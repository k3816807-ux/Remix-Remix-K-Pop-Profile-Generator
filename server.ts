import express from 'express';
import { createServer as createHttpServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const httpServer = createHttpServer(app);

// Initialize Gemini Client on Server with telemetry header
const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const DEFAULT_TEXT_MODEL = 'gemini-3.8-flash';
const DEFAULT_IMAGE_MODEL = 'gemini-3.1-flash-lite-image';

const STANDARD_SAFETY_SETTINGS = [
  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
];

// Helper to sanitize JSON responses
function extractAndSanitizeJson(rawText: string): any {
  let jsonStr = (rawText || '').trim();
  if (jsonStr.includes('```')) {
    const match = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) jsonStr = match[1].trim();
  }

  const firstBrace = jsonStr.indexOf('{');
  const firstBracket = jsonStr.indexOf('[');
  let startIndex = -1;
  let endIndex = -1;

  if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
    startIndex = firstBracket;
    endIndex = jsonStr.lastIndexOf(']');
  } else if (firstBrace !== -1) {
    startIndex = firstBrace;
    endIndex = jsonStr.lastIndexOf('}');
  }

  if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    jsonStr = jsonStr.substring(startIndex, endIndex + 1);
  }

  try {
    return JSON.parse(jsonStr);
  } catch (err) {
    // Attempt quotes repair & newline escaping
    let cleanJson = jsonStr.replace(/"(\w+)"(\w+)":/g, (match, p1, p2) => {
      const unifiedKey = (p1 + p2).toLowerCase();
      if (unifiedKey.includes('petpeeve')) return '"petPeeves":';
      return `"${p1}${p2}":`;
    });
    cleanJson = cleanJson.replace(/"(\w+)"\s*(\w+)":/g, '"$1$2":');

    let inString = false;
    let escaped = false;
    let newJson = '';
    for (let i = 0; i < cleanJson.length; i++) {
      const char = cleanJson[i];
      if (char === '"' && !escaped) inString = !inString;
      if (char === '\\') escaped = !escaped;
      else escaped = false;

      if (inString && char === '\n') newJson += '\\n';
      else if (inString && char === '\r') {} // ignore \r
      else if (inString && char === '\t') newJson += '\\t';
      else newJson += char;
    }
    return JSON.parse(newJson);
  }
}

// 1. Text / JSON Generation Endpoint
app.post('/api/gemini/generate', async (req, res) => {
  try {
    const { prompt, useSearch = false, schema, model = DEFAULT_TEXT_MODEL, systemInstruction } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt' });
    }

    const config: any = {
      responseMimeType: 'application/json',
      safetySettings: STANDARD_SAFETY_SETTINGS,
    };

    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }
    if (useSearch) {
      config.tools = [{ googleSearch: {} }];
    }
    if (schema) {
      config.responseSchema = schema;
    }

    let finalPrompt = prompt;
    if (!finalPrompt.includes('CRITICAL JSON RULE')) {
      finalPrompt += '\n\nCRITICAL JSON RULE: You MUST return strictly valid JSON. Do NOT include unescaped newlines or unescaped double quotes inside any string values. If you need a newline in a string, escape it as \\\\n.';
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: finalPrompt,
      config,
    });

    const rawText = response.text || '';
    if (!rawText) {
      return res.status(500).json({ error: 'AI returned an empty response.' });
    }

    let parsedData: any;
    try {
      parsedData = extractAndSanitizeJson(rawText);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', rawText);
      return res.status(500).json({ error: 'AI returned invalid JSON format.' });
    }

    const sources: Array<{ title: string; uri: string }> = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title || 'Market Source',
            uri: chunk.web.uri,
          });
        }
      });
    }

    return res.json({ data: parsedData, sources: sources.length > 0 ? sources : undefined });
  } catch (error: any) {
    console.error('API /api/gemini/generate error:', error);
    const status = error.status || 500;
    return res.status(status).json({ error: error.message || 'Generation failed' });
  }
});

// 2. Server-Sent Events Streaming Endpoint
app.post('/api/gemini/stream', async (req, res) => {
  try {
    const { prompt, model = DEFAULT_TEXT_MODEL, systemInstruction } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const config: any = {
      safetySettings: STANDARD_SAFETY_SETTINGS,
    };
    if (systemInstruction) config.systemInstruction = systemInstruction;

    const stream = await ai.models.generateContentStream({
      model,
      contents: prompt,
      config,
    });

    for await (const chunk of stream) {
      const text = chunk.text || '';
      res.write(`data: ${JSON.stringify({ text })}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    console.error('API /api/gemini/stream error:', error);
    if (!res.headersSent) {
      return res.status(500).json({ error: error.message || 'Stream error' });
    }
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

// 3. Image Generation Endpoint with Model Cascades & Likeness Anchoring
app.post('/api/gemini/generate-image', async (req, res) => {
  try {
    const { prompt, aspectRatio = '1:1', referenceImages, options } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt' });
    }

    // Process reference images (convert URL to base64 if needed)
    let refArray: any[] = [];
    if (referenceImages) {
      refArray = Array.isArray(referenceImages) ? referenceImages : [referenceImages];
    }

    const validRefs: Array<{ label: string; mimeType: string; base64Data: string }> = [];
    for (let index = 0; index < refArray.length; index++) {
      const ref = refArray[index];
      const label = typeof ref === 'string' ? `Face Reference ${index + 1}` : (ref.label || `Face Reference ${index + 1}`);
      let dataUrl = typeof ref === 'string' ? ref : ref.dataUrl;

      if (dataUrl && (dataUrl.startsWith('http://') || dataUrl.startsWith('https://'))) {
        try {
          const resp = await fetch(dataUrl);
          const blob = await resp.blob();
          const mime = blob.type || 'image/jpeg';
          const buffer = await blob.arrayBuffer();
          const b64 = Buffer.from(buffer).toString('base64');
          dataUrl = `data:${mime};base64,${b64}`;
        } catch (e) {
          console.warn('Could not fetch remote reference image:', e);
        }
      }

      if (dataUrl && dataUrl.startsWith('data:') && dataUrl.includes(';base64,')) {
        const mimeType = dataUrl.substring(dataUrl.indexOf(':') + 1, dataUrl.indexOf(';'));
        const base64Data = dataUrl.split(',')[1];
        if (base64Data && base64Data.length > 50) {
          validRefs.push({ label, mimeType, base64Data });
        }
      }
    }

    const constructParts = (includeImages: boolean): any[] => {
      const callParts: any[] = [];
      if (includeImages && validRefs.length > 0) {
        callParts.push({
          text: `### CRITICAL SOURCE FACE PORTRAIT REFERENCES (${validRefs.length} TOTAL)\nThe attached reference photos show the official face, facial structure, eyelid shape, jawline, lips, skin tone, and signature hairstyle of the idols. You MUST strictly preserve these exact human facial identities. Do not generate weird, melted, distorted, or unrecognizable faces:`,
        });

        validRefs.slice(0, 8).forEach((item, idx) => {
          callParts.push({
            text: `\n[SOURCE FACE PORTRAIT ${idx + 1} OF ${validRefs.length}: ${item.label}]`,
          });
          callParts.push({
            inlineData: {
              mimeType: item.mimeType,
              data: item.base64Data,
            },
          });
        });

        callParts.push({
          text: '\n### PHOTOGRAPHY & COMPOSITION DIRECTIVE (STRICTLY PRESERVE FACIAL LIKENESS FROM SOURCE PORTRAITS ABOVE):\n',
        });
      }

      callParts.push({ text: prompt });
      return callParts;
    };

    const executeGeneration = async (targetModel: string, parts: any[]): Promise<string | null> => {
      const imageConfig: any = {
        aspectRatio,
      };

      if (targetModel.includes('3.1-flash-image') || targetModel.includes('3-pro-image') || targetModel.includes('nano-banana-2.1')) {
        imageConfig.imageSize = options?.imageSize || '1K';
      }

      const response = await ai.models.generateContent({
        model: targetModel,
        contents: { parts },
        config: {
          imageConfig,
          safetySettings: STANDARD_SAFETY_SETTINGS,
        },
      });

      if (response.candidates?.[0]?.finishReason === 'PROHIBITED_CONTENT') {
        throw new Error('Image generation triggered safety filters. Please try again with a different concept.');
      }

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          }
        }
      }
      return null;
    };

    const primaryModel = options?.model || DEFAULT_IMAGE_MODEL;
    const candidateModels: string[] = [primaryModel];

    const fallbackCascade = [
      DEFAULT_IMAGE_MODEL,
      'gemini-3.1-flash-image',
      'gemini-nano-banana-2.1',
      'gemini-2.5-flash-image',
    ];

    for (const m of fallbackCascade) {
      if (!candidateModels.includes(m)) candidateModels.push(m);
    }

    let lastError: any = null;
    for (const modelName of candidateModels) {
      try {
        const parts = constructParts(validRefs.length > 0);
        const result = await executeGeneration(modelName, parts);
        if (result) return res.json({ imageUrl: result, modelUsed: modelName });
      } catch (err: any) {
        lastError = err;
        console.warn(`Server image generation attempt failed on "${modelName}":`, err.message || err);

        if (validRefs.length > 0) {
          try {
            const textOnlyParts = constructParts(false);
            const fallbackResult = await executeGeneration(modelName, textOnlyParts);
            if (fallbackResult) return res.json({ imageUrl: fallbackResult, modelUsed: modelName });
          } catch (textErr: any) {
            console.warn(`Server text-only retry for "${modelName}" failed:`, textErr.message || textErr);
          }
        }
      }
    }

    if (lastError?.message?.includes('429') || lastError?.message?.includes('RESOURCE_EXHAUSTED')) {
      return res.status(429).json({ error: 'Image generation quota limit reached on the server API key.' });
    }
    if (lastError?.message?.includes('404') || lastError?.message?.includes('NOT_FOUND')) {
      return res.status(404).json({ error: `Image model not found or unsupported. Tried: ${candidateModels.join(', ')}` });
    }

    return res.status(500).json({ error: lastError?.message || 'Failed to generate image.' });
  } catch (error: any) {
    console.error('API /api/gemini/generate-image error:', error);
    return res.status(500).json({ error: error.message || 'Image generation failed' });
  }
});

// 4. WebSocket Server for Live API Relay
const wss = new WebSocketServer({ server: httpServer, path: '/api/gemini/live-ws' });

wss.on('connection', (clientWs: WebSocket) => {
  console.log('Client connected to Live API WebSocket relay');
  let isConnected = true;

  clientWs.on('message', async (data: Buffer | string) => {
    try {
      const msg = JSON.parse(data.toString());
      if (msg.type === 'ping') {
        clientWs.send(JSON.stringify({ type: 'pong' }));
        return;
      }

      // Handle real-time audio / text turns via Live API or streaming
      if (msg.type === 'send_turn' && msg.prompt) {
        const stream = await ai.models.generateContentStream({
          model: msg.model || DEFAULT_TEXT_MODEL,
          contents: msg.prompt,
        });

        for await (const chunk of stream) {
          if (!isConnected || clientWs.readyState !== WebSocket.OPEN) break;
          clientWs.send(JSON.stringify({ type: 'chunk', text: chunk.text || '' }));
        }

        if (isConnected && clientWs.readyState === WebSocket.OPEN) {
          clientWs.send(JSON.stringify({ type: 'turn_complete' }));
        }
      }
    } catch (err: any) {
      console.error('Error handling Live WS message:', err);
      if (isConnected && clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(JSON.stringify({ type: 'error', message: err.message }));
      }
    }
  });

  clientWs.on('close', () => {
    isConnected = false;
    console.log('Client disconnected from Live API WebSocket relay');
  });

  clientWs.on('error', (err) => {
    console.error('Live WS Client error:', err);
  });
});

// Vite Middleware for Dev / Static Files for Production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = Number(process.env.PORT) || 3000;
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT} (env: ${isProd ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
