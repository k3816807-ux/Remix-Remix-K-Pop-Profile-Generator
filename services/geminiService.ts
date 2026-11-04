import { 
  GEMINI_MODEL_TEXT, 
  GEMINI_MODEL_IMAGE, 
  GEMINI_MODEL_IMAGE_FAST, 
  GEMINI_MODEL_IMAGE_LEGACY 
} from '../constants';
import type { GroundingSource } from '../types';

export function getClientApiKey(): string {
  // Retained for backward compatibility; API keys are now securely managed server-side
  return '';
}

export interface ReferenceImageInput {
  label?: string;
  dataUrl: string;
}

export interface ImageGenerationOptions {
  model?: string;
  imageSize?: '512px' | '1K' | '2K' | '4K';
  strictFaceLikeness?: boolean;
}

/**
 * Generate structured content with retry and sanitization via server-side Gemini proxy
 */
export async function generateContentWithRetry<T>(
  prompt: string, 
  useSearch: boolean = false, 
  schema?: any
): Promise<{ data: T; sources?: GroundingSource[] }> {
  try {
    const res = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        useSearch,
        schema,
        model: GEMINI_MODEL_TEXT,
      }),
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.error || `Server responded with HTTP ${res.status}`);
    }

    const json = await res.json();
    return {
      data: json.data as T,
      sources: json.sources,
    };
  } catch (error: any) {
    console.error('Server-side AI Generation Error Details:', {
      message: error.message,
      prompt: prompt.substring(0, 150) + '...',
    });
    throw error;
  }
}

/**
 * Generate images via server-side Gemini endpoint with multi-model fallback & facial likeness preservation
 */
export async function generateImage(
  prompt: string, 
  aspectRatio: string = '1:1', 
  referenceImages?: string | string[] | ReferenceImageInput | ReferenceImageInput[],
  options?: ImageGenerationOptions
): Promise<string> {
  try {
    const res = await fetch('/api/gemini/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        aspectRatio,
        referenceImages,
        options,
      }),
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.error || `Image generation failed with HTTP ${res.status}`);
    }

    const json = await res.json();
    if (!json.imageUrl) {
      throw new Error('No image URL returned from server.');
    }
    return json.imageUrl;
  } catch (err: any) {
    console.error('Server Image Generation Error:', err);
    throw err;
  }
}

/**
 * Server-Sent Events (SSE) Streaming text generator
 */
export async function* generateContentStream(
  prompt: string,
  model?: string
): AsyncGenerator<string, void, unknown> {
  const res = await fetch('/api/gemini/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, model }),
  });

  if (!res.ok || !res.body) {
    throw new Error(`Stream request failed with status ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const payload = line.replace('data: ', '').trim();
        if (payload === '[DONE]') return;
        try {
          const parsed = JSON.parse(payload);
          if (parsed.text) yield parsed.text;
        } catch {
          // ignore parse errors for partial chunks
        }
      }
    }
  }
}

/**
 * Connect to Live API WebSocket relay on the server
 */
export function connectLiveSession(onMessage: (msg: any) => void): {
  send: (msg: any) => void;
  close: () => void;
  ws: WebSocket;
} {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${protocol}//${window.location.host}/api/gemini/live-ws`;
  const ws = new WebSocket(wsUrl);

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (e) {
      console.warn('Could not parse WS message:', e);
    }
  };

  return {
    send: (msg: any) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(msg));
      } else {
        ws.addEventListener('open', () => ws.send(JSON.stringify(msg)), { once: true });
      }
    },
    close: () => ws.close(),
    ws,
  };
}

export const generateKpopGroupData = async <T,>(prompt: string, schema?: any): Promise<{ data: T; sources?: GroundingSource[] }> => {
  return generateContentWithRetry<T>(prompt, false, schema);
};

export const generateKpopMembersData = async <T,>(prompt: string, schema?: any): Promise<{ data: T }> => {
  return generateContentWithRetry<T>(prompt, false, schema);
};
