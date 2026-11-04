import { Type } from '@google/genai';

import type { UserInput, GroupProfileData, MemberProfileData, FullProfile, GroupType, Album, Track, KpopGeneration, GroundingSource, TrackMvVisuals, MemberConceptOutfit, AiSongColorOption, StoryboardScene } from '../types';
import { generateKpopGroupData, generateKpopMembersData, generateImage } from './geminiService';
import { 
  getAllLyricTropesText, 
  getSingleLyricStyleGuide, 
  getChorusEngineeringRules, 
  getVerse1EngineeringRules,
  getLineDistributionRules,
  getRandomRhymeScheme,
  getRandomVerse1Archetype,
  getRandomFigurativeDevices,
  getRandomStructure,
  RHYME_SCHEMES,
  VERSE_1_ARCHETYPES,
  FIGURATIVE_DEVICES,
  EXPANDED_SONG_STRUCTURES
} from './lyricStyleGuide';
import { hasCringeLyrics, checkSoloistLyricViolations, LYRIC_RETRY_PROMPT, SOLOIST_LYRIC_RETRY_PROMPT } from './lyricValidator';
import {
  ALL_KPOP_FASHION_STYLES,
  UNIVERSAL_KPOP_STYLES,
  BOY_GROUP_STYLES,
  GIRL_GROUP_STYLES,
  KPOP_CONCEPTS,
  KPOP_STYLE_MIX_PRESETS,
  buildKpopOutfitFormula,
  getAvailableStylesForGroup,
  findKpopStyle,
  type KpopStyleItem,
  type KpopConceptItem,
  type KpopStyleMixPreset
} from './kpopStylingTaxonomy';
import {
  getFreshPutTogetherOutfit,
  getFreshKpopHairstyle,
  FEMALE_PUT_TOGETHER_OUTFITS,
  MALE_PUT_TOGETHER_OUTFITS,
  FEMALE_KPOP_HAIRSTYLES,
  MALE_KPOP_HAIRSTYLES,
  sanitizeFacialFeaturesForYouth,
  getYouthfulIdolAestheticDirective,
  extractGarmentCategories
} from './kpopStylingService';

export const isSoloArtist = (groupType?: string): boolean => {
  if (!groupType) return false;
  const t = groupType.toLowerCase().trim();
  return t.includes('soloist') || t.includes('solo') || t === 'issolo';
};

export const detectArtistGender = (
  groupType?: string,
  conceptKeywords?: string,
  memberGender?: string
): 'Female' | 'Male' => {
  if (memberGender === 'Female' || memberGender === 'Male') return memberGender;
  if (!groupType) return 'Female';
  const gt = groupType.toLowerCase();
  if (gt === 'female soloist' || gt === 'girl group') return 'Female';
  if (gt === 'male soloist' || gt === 'boy group') return 'Male';

  // For generic 'Soloist', Co-ed, or custom input:
  const text = `${groupType} ${conceptKeywords || ''}`.toLowerCase();
  const femaleMatches = /\b(female|girl|woman|women|she|her|hers|diva|queen|actress|soprano)\b/i.test(text);
  const maleMatches = /\b(male|boy|guy|man|men|he|him|his|king|actor|baritone|tenor)\b/i.test(text);

  if (femaleMatches && !maleMatches) return 'Female';
  if (maleMatches && !femaleMatches) return 'Male';
  return 'Female';
};

export {
  ALL_KPOP_FASHION_STYLES,
  UNIVERSAL_KPOP_STYLES,
  BOY_GROUP_STYLES,
  GIRL_GROUP_STYLES,
  KPOP_CONCEPTS,
  KPOP_STYLE_MIX_PRESETS,
  buildKpopOutfitFormula,
  getAvailableStylesForGroup,
  findKpopStyle,
  getFreshPutTogetherOutfit,
  getFreshKpopHairstyle,
  FEMALE_PUT_TOGETHER_OUTFITS,
  MALE_PUT_TOGETHER_OUTFITS,
  FEMALE_KPOP_HAIRSTYLES,
  MALE_KPOP_HAIRSTYLES,
  sanitizeFacialFeaturesForYouth,
  getYouthfulIdolAestheticDirective,
  type KpopStyleItem,
  type KpopConceptItem,
  type KpopStyleMixPreset
};

export function buildMusicStylePrompt(
  track: Partial<Track>,
  groupName: string = "Artist",
  concept: string = "Modern K-pop",
  isSolo: boolean = false
): string {
  if (track.musicStylePrompt && track.musicStylePrompt.trim().length > 30) {
    return track.musicStylePrompt.trim();
  }

  const primaryGenre = track.genre || (track.genres && track.genres[0]) || "Contemporary K-Pop Dance";
  const subGenres = track.genres && track.genres.length > 1 ? track.genres.slice(1).join(", ") : "Electropop, Future Bass, Hyper-melodic R&B";
  const isTitle = track.role === "Title Track";
  const bpm = isTitle ? "128 BPM" : "118 BPM";
  const key = isTitle ? "F# Minor / A Major" : "C# Minor / E Major";

  const vocalProduction = isSolo
    ? "Intimate close-mic solo lead vocal, crisp high-shelf EQ presence (12kHz boost), subtle pitch-quantized vocal chops, breathy intimate verse delivery, soaring belted solo hook with lush multi-tracked self-harmonies, expressive high-note belt ad-libs with plate reverb and 1/4-note ping-pong delay."
    : "Multi-layered wide vocal stacks, crisp high-shelf EQ presence (12kHz boost), subtle pitch-quantized vocal chops, breathy intimate verse delivery, explosive stadium unison chant in hook, high-note belt ad-libs with plate reverb and 1/4-note ping-pong delay.";

  return `[GENRE & STYLE]: ${primaryGenre}, ${subGenres}
[TEMPO & KEY]: ${bpm}, Key of ${key}, 4/4 Time Signature
[DRUM & GROOVE]: Punchy 808 sub-bass, crisp syncopated trap hi-hats, tight acoustic snare claps on 2 and 4, dynamic Jersey club 5-beat kick pattern transition in chorus.
[SYNTHS & INSTRUMENTATION]: Plucked analog FM bassline, shimmering Juno-106 stereo pads, aggressive detuned saw leads with sidechain ducking, metallic hyperpop arpeggios, organic electric guitar muted riffs in pre-chorus.
[VOCAL PRODUCTION & MIX]: ${vocalProduction}
[DYNAMIC ARRANGEMENT]: High-tension filtered intro -> bouncy staccato verse -> sweeping riser pre-chorus -> high-impact melodic anti-drop hook -> half-time 808 rap break -> soaring vocal bridge -> double-time grand finale dance outro.
[SONIC VIBE & MOOD]: High-energy, sleek, cinematic, chart-topping polished K-pop production with punchy low-end and pristine crystal-clear highs.`;
}

export function ensureTrackMetadata(
  track: Track,
  groupName: string = "Artist",
  concept: string = "Modern K-pop",
  isSolo: boolean = false
): Track {
  const genres = track.genres && track.genres.length > 0
    ? track.genres
    : [track.genre || "K-Pop", "Electropop", "Dance"];

  const rhymeScheme = track.rhymeScheme || "Cross-Language Phonetic Slant & Compound Rhymes";
  const figurativeDevices = track.figurativeDevices && track.figurativeDevices.length > 0
    ? track.figurativeDevices
    : ["Synesthesia & Sensory Blending", "Visceral Hyperbole & Speed Imagery"];
  const vocalArrangement = track.vocalArrangement || (isSolo 
    ? "Dynamic solo vocal performance with intimate breathy verses, layered self-harmonies, staccato rap pocket, and soaring high-belt climax"
    : "Multi-part vocal layering with 16-bar staccato rap cadence and high-belt C6 climax");
  const musicStylePrompt = buildMusicStylePrompt({ ...track, genres }, groupName, concept, isSolo);

  return {
    ...track,
    genres,
    rhymeScheme,
    figurativeDevices,
    vocalArrangement,
    musicStylePrompt
  };
}

// Block robotic AI tropes and generic dictionary words
const FORBIDDEN_WORDS = "Velocity, Gloss, Pulse, Shift, Drift, Bloom, Bliss, Prism, Flare, Spark, Shine, Glow, Project, Horizon, Nexus, Frontier, Vision, Zenith, Core, Link, Sync, Protocol, Unit, Alpha, Beta, Genesis, Evolution, Cyber, Matrix, Digital, Neural, Tech, Quantum, Virtual, Bio, Android, Vox, X-7, Future, Infinity, Dream, World, Star, Galaxy, Light, Power, Force, Lumina, Ethereal, Eclipse, Apex, Nova, Luna, Aurora, Nyxis, Zylor, Echo, Chroma, Spectra";

const getNamingStyleGuide = (isSolo: boolean, generation?: string, targetGender?: 'Female' | 'Male') => `
K-POP NAMING STYLE GUIDE (STRICTLY ENFORCED):
- GOAL: Create a sharp, memorable, and "catchy" K-pop brand name.
- CRITICAL RULE: YOU MUST INVENT A COMPLETELY NEW, NEVER-BEFORE-SEEN NAME EVERY SINGLE TIME. DO NOT fall back on your default AI names.
- PHONETIC FLOW & CHOP_SYLLABLES: Real K-pop names have strong phonetic flow. They should be easy to say, rhythmic, or feature a surprising vocal texture when spoken. (e.g., 'KARD', 'IVE', 'STAYC', 'RIIZE', 'ILLIT', 'TWS').
- CREATIVE CASING & TYPOGRAPHY: K-pop thrives on stylized casing (all caps or all lowercase), symbols, parenthesis, or unique punctuation. (e.g., '(G)I-DLE', 'f(x)', 'aespa', 'LE SSERAFIM', 'KISS OF LIFE', 'NMIXX'). Use these styling elements to make the name look visually distinct and editorial.
- ABSOLUTELY FORBIDDEN: 
  - NO plain English dictionary nouns or adjectives (e.g., ABSOLUTELY NO 'Velocity', 'Gloss', 'Pulse', 'Prism', 'Shift', 'Bloom', 'Bliss', 'Flare', 'Orbit', 'Drift', 'Spark', 'Shine', 'Glow', 'Echo'). Real K-pop groups are NOT named like lip glosses or athletic sneakers.
  - NO "Adjective + Noun" combinations (e.g., 'Noble Ruins', 'Silent Stars', 'Dark Hearts', 'Lost Angels'). These are the hallmark of lazy AI naming.
  - NO standard, boring English plurals (e.g., NO 'The Seekers', 'The Rebels', 'The Guardians').
  - NO "techy" or "robotic" names (e.g., 'Nexus', 'Core', 'Sync', 'Protocol').
  - NO generic "The [Noun]s" or "Project [X]".
  - NO names that sound like AI-generated sci-fi nonsense or edgy "V" names (e.g., 'Nyxis', 'Zylor', 'Aetheria', 'Vail', 'Vex', 'Vay', 'Vox', 'Val', 'Vesper', 'Aven', 'Nox', 'Zed').
  - NO generic "vibe" words like 'Ethereal', 'Lumina', 'Eclipse', 'Apex', 'Nova', 'Synergy', 'Zenith', 'Echo'.
  - AVOID names starting with the letter 'P'. There is an over-reliance on 'P' names. Randomize the starting letter using the entire alphabet.
${isSolo ? `
- SOLOIST NAMING & STYLIZATION (CRITICAL - FOR A ${targetGender ? targetGender.toUpperCase() : 'SOLO'} ARTIST):
  Use a realistic, highly authentic solo stage name matching their ${targetGender || 'solo'} identity with varying degrees of stylization:
  ${targetGender === 'Male' ? `
  * MALE SOLOIST REAL GIVEN NAME (HIGHLY NATURAL & COMMON): An authentic male given birth name (e.g., 'Minjun', 'Sang-hoon', 'Seungwoo', 'Doyun', 'Jaehyun', 'Wonbin', 'Jin-woo', 'Hyun-woo', 'Tae-yang', 'Dong-wook').
  * MALE SOLOIST STYLIZED ALIAS: A punchy English mononym, initials, or Korean alias with creative casing/punctuation (e.g., WOODZ, B.I, TAEMIN, COLDE, WONHO, KAI, DEAN, CRUSH, ZICO, PAUL KIM, GRAY).
  * MALE SOLOIST ABSTRACT CONCEPT: A stylized, memorable word (e.g., GEMINI, SHAUN, LOCO, HA SUNG WOON).
  * STRICT PROHIBITION: DO NOT copy real idols like 'WOODZ', 'Hoshi', 'Zico', 'B.I', 'Colde', 'Felix', 'Jungkook', 'KAI', 'Taemin', 'Baekhyun', 'Dean', 'Crush'.
  ` : `
  * FEMALE SOLOIST REAL GIVEN NAME (HIGHLY NATURAL & COMMON): An authentic female given birth name (e.g., 'Haeun', 'Ji-young', 'Da-jung', 'Chaewon', 'Yuna', 'Chaeyoung', 'So-yeon', 'Ji-eun', 'Hye-won', 'Minji').
  * FEMALE SOLOIST STYLIZED ALIAS: A catchy English mononym or Korean alias with creative casing/punctuation (e.g., CHUNG HA, SOMI, SUNMI, IU, CHUU, YVES, ROSÉ, TAEYEON, BoA, HWASA, WHEEIN, SOLAR).
  * FEMALE SOLOIST ABSTRACT CONCEPT: A stylized, memorable word (e.g., BIBI, MEENOI, YUQI, SOOJIN, ADORA, SEORI, SURAN, KATIE, HEIZE, YOUHA).
  * STRICT PROHIBITION: DO NOT copy real idols like 'IU', 'BoA', 'Taeyeon', 'Somi', 'Chungha', 'Sunmi', 'Chuu', 'Yves', 'Winter', 'Karina', 'Jennie', 'Lisa', 'Rosé', 'Jisoo', 'Bibi', 'Heize'.
  `}
  Vary the casing: use all-caps, lowercase, or special characters.
  AVOID common AI default or robotic fantasy names like 'Vail', 'Vex', 'Vesper', 'Aven', 'Luna', 'Nova', 'Aurora', 'Kai', 'Leo', 'Jin'. Dig deep for authentic, beautiful, and realistic names.
` : `
- GROUP NAMING & STYLIZATION DIVERSITY (CRITICAL):
  * You MUST create completely unique, never-before-generated group names every single time. DO NOT repeat names like 'ECLIPSE', 'AETHER', 'LUMINA', 'NEXUS', 'APEX', 'VORTEX', or 'ECHO'. Think completely outside the box.
  * DO NOT rely heavily on abbreviations or acronyms (like XYZ or A.B.C) every time. Real K-pop groups use a massive variety of naming styles: short punchy words, long phrases, numbers, hyphenations, foreign loanwords, and entirely made-up syllables.
  * You MUST randomly choose a DIFFERENT naming structure than your typical default. Vary the lengths (short like 'IVE', medium like 'aespa', long like 'KISS OF LIFE' or 'TOMORROW X TOGETHER').
  * RANDOMLY CHOOSE ONE OF THESE STYLIZATION LEVELS FOR THIS GENERATION:
    1. SIMPLE BUT UNIQUE (Short): A highly distinct 1-2 syllable word or made-up term (e.g., RIIZE, ITZY, ILLIT, aespa, STAYC, CRAVITY, TWS, VCHA, UNIS, IVE, ATEEZ, TREASURE, EVNNE, MEOVV, RESCENE).
    2. SIMPLE BUT UNIQUE (Long Phrase): A catchy, meaningful phrase (e.g., Stray Kids, KISS OF LIFE, TOMORROW X TOGETHER, BOYNEXTDOOR, FIFTY FIFTY, FANTASY BOYS, YOUNG POSSE, BADVILLAIN).
    3. MEDIUM STYLIZATION / BLENDED / ACRONYMS: Portmanteaus, camelCase, lowercase, blended words, or stylized acronyms (e.g., NewJeans, NMIXX, LE SSERAFIM, ENHYPEN, BABYMONSTER, P1Harmony, AMPERS&ONE, KATSEYE, ARTMS, CIX, EPEX, DXMON). Acronyms are perfectly fine, just make them creative!
    4. SYMBOLISM & NUMBERS: Tasteful use of numbers, hyphens, mixed casing, and number-word replacements (e.g., fromis_9, xikers, Kep1er, ZEROBASEONE, AB6IX, tripleS, (G)I-DLE, 8TURN, izna, QWER, ONEUS, BAE173, TIOT, BLITZERS, hearts2hearts).
- PRONOUNCEABILITY RULE (CRITICAL): Even if the name is highly stylized, it MUST be easy, natural, and catchy to pronounce out loud (e.g., f(x) is 'eff-ex', (G)I-DLE is 'idle', 2NE1 is 'twenty-one'). DO NOT create unpronounceable consonant clusters, awkward symbol mashes, or names that don't make phonetic sense. The name must sound good when spoken naturally by fans.
- THINK LIKE A K-POP LABEL: K-pop names are often slightly abstract, stylized, or use unique combinations of sounds. They should feel like a brand, not a sentence.
- DO NOT just mash up these examples. Think of foreign loanwords (French, Latin, Spanish), obscure terms, unique stylized English words, or completely made-up but catchy syllables.`}
- INDEPENDENCE RULE: The group/artist name MUST be created independently of the concept keywords. DO NOT force the name to match the theme. If the concept is "dark", the name should NOT be "Dark [Noun]".
- COLOR PALETTE (TRUE RANDOMNESS REQUIRED): Generate completely unique, unpredictable color palettes every time. DO NOT use the same palettes over and over. DO NOT use the examples provided in previous runs. Think of completely unrelated colors and combine them (e.g., 'Burnt Sienna & Icy Cyan', 'Mustard Yellow & Lavender', 'Deep Teal & Bubblegum Pink'). Ensure absolutely no repetition between generations.
`;

export const COLOR_AESTHETIC_UNIVERSES = [
  {
    theme: "High-Teen Sweet Pastel",
    vibe: "Bright, youthful, euphoric 5th-gen pop",
    examples: "Buttercream Custard Yellow (#FDE047), Baby Periwinkle (#818CF8), Strawberry Milk Pink (#F472B6)"
  },
  {
    theme: "Cyberpunk Acid Pop & High-Voltage Neon",
    vibe: "Sharp streetwear, futuristic cyber rave",
    examples: "Electric Citron (#D9F99D), Cyber Magenta (#F43F5E), Deep Space Indigo (#1E1B4B)"
  },
  {
    theme: "Royal Velvet & Metallic Champagne",
    vibe: "Regal luxury, high-fashion aristocratic elegance",
    examples: "Imperial Cobalt Sapphire (#1D4ED8), Gilded Champagne Gold (#FCD34D), Obsidian Noir (#0F172A)"
  },
  {
    theme: "Sunset Horizon & Peach Coral",
    vibe: "Warm cinematic golden hour, bittersweet youth",
    examples: "Apricot Nectar (#FB923C), Dusk Hydrangea (#6366F1), Sea Salt White (#F8FAFC)"
  },
  {
    theme: "Dark Cherry Wine & Smoked Noir",
    vibe: "Theatrical vampire romance, gothic luxury",
    examples: "Spiced Bordeaux (#881337), Antique Pearl Ivory (#FEF3C7), Smoked Graphite (#334155)"
  },
  {
    theme: "Glacial Prism & Aurora Hologram",
    vibe: "Icy, crystalline, ethereal dreamscape",
    examples: "Frostbite Cyan (#38BDF8), Holographic Quartz Lilac (#C084FC), Polar Titanium (#F1F5F9)"
  },
  {
    theme: "Earthy Retro Botanical & Warm Terracotta",
    vibe: "Organic indie nostalgia, 70s vinyl aesthetic",
    examples: "Forest Moss Green (#15803D), Baked Terracotta (#C2410C), Warm Linen (#FAFAF9)"
  },
  {
    theme: "Graphic Minimalist Monochrome & Signal Red",
    vibe: "Avant-garde runway, high-contrast graphic impact",
    examples: "Signal Crimson Red (#DC2626), Deep Pitch Black (#09090B), Pure Titanium White (#FFFFFF)"
  },
  {
    theme: "Dreamy Twilight Amethyst & Plum",
    vibe: "Starry nocturnal fantasy, cosmic dreamscape",
    examples: "Electric Violet (#8B5CF6), Dusky Periwinkle (#A5B4FC), Deep Midnight Navy (#172554)"
  },
  {
    theme: "Citrus Tonic & Oceanic Marine Teal",
    vibe: "Summer festival splash, energetic tropical groove",
    examples: "Tangelo Orange (#EA580C), Marine Seafoam Teal (#0D9488), Salted Froth (#F0FDFA)"
  },
  {
    theme: "Rose Gold & Midnight Velvet",
    vibe: "Sensual velvet R&B, intimate elegance",
    examples: "Dusty Rose Quartz (#FB7185), Midnight Plum (#581C87), Starlight Chiffon (#FFF1F2)"
  },
  {
    theme: "Y2K Gloss Chrome & Electric Bubblegum",
    vibe: "Millennium futurism, glossy pop explosion",
    examples: "Hot Cyber Cherry (#E11D48), Chrome Glaze (#CBD5E1), Vivid Electric Aqua (#06B6D4)"
  },
  {
    theme: "Matcha Mist & Blossom Silk",
    vibe: "Zen botanical harmony, delicate pastel grace",
    examples: "Matcha Mist (#86EFAC), Blossom Silk (#FBCFE8), Rice Paper Ivory (#FEFCE8)"
  },
  {
    theme: "Solar Flare & Cosmic Lapis",
    vibe: "Supernova energy, celestial festival power",
    examples: "Radiant Marigold (#F59E0B), Ultramarine Lapis (#2563EB), Carbon Black (#18181B)"
  },
  {
    theme: "Frosted Mint & Electric Grape",
    vibe: "Refreshing shock-contrast, experimental 4th-gen",
    examples: "Frosted Spearmint (#6EE7B7), Electric Grape Purple (#9333EA), Platinum Chrome (#E2E8F0)"
  },
  {
    theme: "Smoky Lavender & Burnt Ochre",
    vibe: "Sophisticated art-house, vintage cinema warmth",
    examples: "Smoky Lavender (#A78BFA), Burnt Ochre Gold (#D97706), Deep Espresso (#292524)"
  }
];

export function sanitizeKpopGreeting(motto: string | undefined, groupName: string, isSolo: boolean = false): string {
  const safeName = (groupName || (isSolo ? 'Artist' : 'Group')).trim();
  
  if (isSolo) {
    if (!motto || typeof motto !== 'string' || motto.trim() === '') {
      return `안녕하세요, ${safeName}입니다! (Hello, I am ${safeName}!)`;
    }

    let cleaned = motto.trim();
    // Remove group count-ins that soloists never use
    cleaned = cleaned.replace(/^(둘,\s*셋!|하나,\s*둘!|Ready,\s*get\s*set!)\s*/i, '');
    // Replace "we are" with "I am"
    cleaned = cleaned.replace(/hello,\s*we\s*are/gi, 'Hello, I am');
    cleaned = cleaned.replace(/we\s*are\s+/gi, '');

    const lower = cleaned.toLowerCase();
    const bannedPhrases = [
      'tear up the script', 'break the mold', 'break the mode', 'shatter the',
      'rewrite the rules', 'rewrite the story', 'defy the odds', 'redefine reality',
      'burn the stage', 'carve your path', 'carve our path', 'unleash the',
      'make them look', 'here to conquer', 'shining forever', 'light up the dark', 'ignite the future'
    ];
    const hasCliche = bannedPhrases.some(phrase => lower.includes(phrase));
    const hasKoreanGreeting = cleaned.includes('안녕하세요') || lower.includes('annyeonghaseyo');

    if (hasCliche || !hasKoreanGreeting) {
      const soloHooks = [
        `Tune in!`,
        `Catch the vibe!`,
        `Spotlight on!`,
        `Feel the rhythm!`,
        `Here with you!`,
        `Right now!`
      ];
      const chosenHook = soloHooks[Math.floor(Math.random() * soloHooks.length)];
      return `${chosenHook} 안녕하세요, ${safeName}입니다! (Hello, I am ${safeName}!)`;
    }
    return cleaned;
  }

  if (!motto || typeof motto !== 'string' || motto.trim() === '') {
    return `둘, 셋! Dive into our rhythm! 안녕하세요, ${safeName}입니다! (Hello, we are ${safeName}!)`;
  }

  const cleaned = motto.trim();
  const lower = cleaned.toLowerCase();

  // Explicitly banned Western AI motivational quotes & clichés
  const bannedPhrases = [
    'tear up the script',
    'break the mold',
    'break the mode',
    'shatter the',
    'rewrite the rules',
    'rewrite the story',
    'defy the odds',
    'redefine reality',
    'burn the stage',
    'carve your path',
    'carve our path',
    'unleash the',
    'make them look',
    'here to conquer',
    'shining forever',
    'light up the dark',
    'ignite the future'
  ];

  const hasCliche = bannedPhrases.some(phrase => lower.includes(phrase));
  const hasKoreanGreeting = cleaned.includes('안녕하세요') || lower.includes('annyeonghaseyo');

  if (hasCliche || !hasKoreanGreeting) {
    // Generate an authentic K-pop greeting incorporating the group name
    const greetingHooks = [
      `Dive into ${safeName}!`,
      `Catch the spark! We are ${safeName}!`,
      `Step Out! We are ${safeName}!`,
      `All in us! We are ${safeName}!`,
      `One, two, connect! We are ${safeName}!`,
      `Tune into our frequency! We are ${safeName}!`,
      `Say the name! ${safeName}!`,
      `Realize! We are ${safeName}!`,
      `Attention! We are ${safeName}!`,
      `Open the horizon! We are ${safeName}!`,
      `Feel the pulse! We are ${safeName}!`,
      `Twenty-four seven! We are ${safeName}!`
    ];
    const cues = ['둘, 셋!', '하나, 둘!', 'Ready, get set!'];
    const chosenCue = cues[Math.floor(Math.random() * cues.length)];
    const chosenHook = greetingHooks[Math.floor(Math.random() * greetingHooks.length)];
    return `${chosenCue} ${chosenHook} 안녕하세요, ${safeName}입니다! (Hello, we are ${safeName}!)`;
  }

  return cleaned;
}

export function sanitizeKpopGesture(gesture: string | undefined, groupName: string, isSolo: boolean = false): string {
  if (isSolo) {
    if (!gesture || typeof gesture !== 'string' || gesture.trim().length < 8 || 
        gesture.includes('Members') || gesture.includes('in unison') || gesture.includes('each member') || gesture.includes('together')) {
      const soloGestures = [
        `The artist places their right hand gently over their heart and offers a graceful, polite 90-degree bow with a charming smile.`,
        `The artist flashes a subtle signature hand gesture by their cheek, then brings both hands forward with a warm, respectful bow.`,
        `The artist holds up an elegant finger-heart toward the camera, then bows politely with both hands folded in front.`,
        `The artist offers a signature wave followed by a dignified, polite bow to the audience.`
      ];
      return soloGestures[Math.floor(Math.random() * soloGestures.length)];
    }
    return gesture.trim();
  }

  if (!gesture || typeof gesture !== 'string' || gesture.trim().length < 8) {
    return `Members bring both hands together forming an iconic geometric emblem over the chest, then snap forward in unison with a warm bow.`;
  }
  return gesture.trim();
}

function createGroupOverviewPrompt(userInput: UserInput, existingName?: string): string {
  const { groupType, conceptKeywords, generation } = userInput;
  const isSolo = isSoloArtist(groupType);
  const targetGender = detectArtistGender(groupType, conceptKeywords);
  
  const randomSeed = Math.random().toString(36).substring(2, 10);
  const chosenColorUniverse = COLOR_AESTHETIC_UNIVERSES[Math.floor(Math.random() * COLOR_AESTHETIC_UNIVERSES.length)];
  
  const existingNameInstruction = existingName 
    ? `- PRESERVED ${isSolo ? 'ARTIST' : 'GROUP'} NAME: You MUST use the exact name "${existingName}". Do not change it. Re-imagine the origin, meaning, concept, and all other details around this exact name.`
    : `- ORIGINALITY & BRANDING (MAX VARIANCE):
  - RANDOMIZATION SEED: [${randomSeed}] Use this to ensure completely different naming and concepts every generation.
  - DO NOT USE REPETITIVE AI NAMES. Break out of your loops. Generate extremely unique ${isSolo ? `${targetGender} soloist stage names` : 'group names'}.
  - DO NOT use existing names (e.g., No 'BLACKPINK', 'IVE', 'aespa', 'RIIZE', 'IU', 'CHUNG HA', 'TAEMIN', 'WOODZ').
  - ABSOLUTELY NO PLACEHOLDER NAMES LIKE "ORIGIN_X" or "THE PULSE".
  ${getNamingStyleGuide(isSolo, generation, targetGender)}`;

  const marketBrief = `
STORYTELLER & BRAND ARCHITECT ROLE:
- Create an ORIGINAL, high-concept brand that feels authentic to the ${generation} K-pop landscape for a ${isSolo ? `${targetGender} Solo Artist (${groupType})` : `K-Pop Group (${groupType})`}.
${existingNameInstruction}
${isSolo ? `
- SOLOIST IDENTITY MANDATE:
  This act is a ${targetGender.toUpperCase()} SOLOIST (${groupType}). The artist performs alone as a single solo performer.
  NEVER refer to this act as a "group", "members", or "sub-units".
  All branding, visual aesthetics, stage presence, and concept storylines must be tailored specifically for one charismatic ${targetGender.toLowerCase()} solo artist.
- STAGE NAME ORIGIN & MEANING: In the "groupNameMeaning" field, explain the simple, direct, and beautiful origin and artistic meaning of the soloist's stage name in a highly realistic, casual way. Focus on what their name represents to them as a solo artist.
- STAGE NAME PRONUNCIATION: In the "groupNamePronunciation" field, provide the simple phonetic pronunciation of the solo artist's stage name.
` : `
- NAME ORIGIN & MEANING: In the "groupNameMeaning" field, you MUST explain the simple, direct, and beautiful meaning and origin of the group name in a highly realistic, casual, and uncomplicated way. DO NOT break down individual letters unless explicitly a stylized acronym or containing numbers. Focus on what the word represents simply and beautifully.
- PRONUNCIATION: In the "groupNamePronunciation" field, you MUST provide the simple, clear phonetic pronunciation of the group name so readers know exactly how to say it.
`}

${isSolo ? 'SOLO ARTIST' : 'GROUP'} CONCEPT / MEANING (SIMPLE & AUTHENTIC - MUST BE DIVERSE EVERY TIME):
- In the "conceptDescription" field, define the ${isSolo ? 'solo artist\'s' : 'group\'s'} core central theme, attitude, or message that serves as their permanent philosophical anchor.
- TO PREVENT REPETITIVE OR CLICHÉ GENERATIONS, you MUST randomly choose ONE of these 6 highly authentic, distinct K-pop message anchors, or invent a completely new, distinct message:
  1. Carefree Youthful Freedom: Representing comfort, pure joy, raw growing pains, nostalgia, and trusting the flow of life with a relaxed, effortless everyday charm.
  2. Fearless Self-Empowerment & Resilience: Standing for unyielding confidence, physical or mental strength, overcoming public scrutiny, and paving an unapologetic path.
  3. Cozy Solace & Companionship: Focusing on quiet comfort, being a steady everyday companion to listeners, and healing mundane anxieties through warm, relatable reassurance.
  4. Untamed Rebel Energy & Autonomy: Embracing wild teenage rebellion, celebrating individual quirks, questioning standard rules, and disregarding societal expectations.
  5. Bittersweet Romantic Nostalgia: Exploring the quiet, delicate emotional turbulence of growing up, unrequited crushes, and bittersweet memories of youth.
  6. Introspective Self-Discovery & Identity: Exploring deeper psychology, finding peace with one's flaws, and balancing private identity with public expectations.
- Clearly explain how this chosen central theme acts as their permanent philosophical anchor. Make sure to specify that while their actual music releases and eras span any genre, style, or subject, every single album is a distinct chapter exploring a specific angle of that central theme naturally.
- DO NOT use cliché, dramatic, or awful AI statements like "empowering the universe to transcend", "shining in a brilliant galaxy of infinite starlight", "redefining the paradigm of K-pop", "bringing a revolution", or "unveiling a new dimension". Avoid pretentious/robotic corporate talk or fake inspirational slop.
- DO NOT talk about fashion, clothing styles, streetwear, visual aesthetics, or music video lore. It is purely about the core identity message.
- Keep it extremely simple, clean, and authentic (maximum 1-2 straightforward sentences). No fluff.

ERA / ALBUM NARRATIVE STYLE (MAKE IT NATURAL):
- Plan a story arc across 3-4 distinct eras (albums).
- AVOID CRINGE, REPETITIVE, OR FORCED LORE ALBUM TITLES (e.g., DO NOT generate titles like "The Chapter of Awakening", "The Cybernetic Vanguard", "Vampiri Dimension Part 1").
- USE highly authentic, trendy K-pop naming conventions for album names (Serialized Chapters, Punctuation/Math, Concept Clashing, or Literal Structural Minimalism).
- For each era, provide the title, a super simple summarized concept, and the "moodOrVibe".

- ${isSolo ? 'SOLOIST GREETING & SIGNATURE MOTTO (AUTHENTIC K-POP INDUSTRY STANDARD)' : 'GROUP GREETING & SIGNATURE MOTTO (AUTHENTIC K-POP INDUSTRY STANDARD)'}:
  * STRICT BANNED AI CLICHÉS (ABSOLUTELY FORBIDDEN):
    ABSOLUTELY NEVER output generic Western motivational slogans, movie trailer taglines, or cheesy corporate rebellion clichés like:
    "Tear up the script", "Break the mold", "Break the mode", "Rewrite the rules", "Shatter expectations", "Defy the odds", "Burn the stage", "Redefine reality", "Carve your path", "Unleash the storm", "Light up the dark", "Make them look", "Here to conquer", "Shining forever".
  * THE AUTHENTIC K-POP GREETING FORMULA:
${isSolo ? `    In real K-pop, soloists introduce themselves charismatically and simply:
    [Optional Catchy 1-2 Word Hook] + "안녕하세요, [Stage Name]입니다! (Hello, I am [Stage Name]!)"
    * REQUIRED FORMAT FOR "motto":
      "[Optional hook, e.g. 'Tune in!'] 안녕하세요, [ARTIST_STAGE_NAME]입니다! (Hello, I am [ARTIST_STAGE_NAME]!)"
      CRITICAL: NEVER say "we are", ALWAYS say "I am"! Soloists NEVER use group count-ins like "둘, 셋!".
    * SIGNATURE HAND GESTURE ("gesture"):
      A charismatic individual stage gesture (e.g., "The artist places their right hand gently over their heart and offers a warm, respectful 90-degree bow with a charming smile").` : `    In actual K-pop, groups introduce themselves at music shows and press conferences using a synchronized 3-part formula:
    [Leader Count-in/Cue] + [Catchy 1-3 Word Signature Hook / Concept Pun] + "안녕하세요, [Group Name]입니다!" (Hello, we are [Group Name]!)
    * REQUIRED FORMAT FOR "motto":
      "[Leader Count-in, e.g., '둘, 셋!'] [Punchy 1-3 word hook]! 안녕하세요, [GROUP_NAME]입니다! (Hello, we are [GROUP_NAME]!)"
    * SIGNATURE HAND GESTURE ("gesture"):
      A vivid physical hand motion performed in unison by all members.`}

- FANDOM DETAILS, IDENTITY & BESPOKE CONCERT MOTTO:
  * FANDOM NAME STRATEGY: Define a distinct, non-generic fandom name connected directly to the ${isSolo ? 'solo artist\'s' : 'group\'s'} name or core narrative metaphor.
  * FANDOM PRONUNCIATION: Phonetic pronunciation so fans know how to say it.
  * FANDOM NAME ORIGIN & MEANING: Authentic meaning connecting to the ${isSolo ? 'artist\'s' : 'group\'s'} journey.
  * FANDOM MOTTO & CONCERT SLOGAN: Bespoke stadium banner slogan (2-6 words) connecting ${isSolo ? 'the solo artist' : 'the group'} and fandom.
  * Provide a detailed image generation prompt for a storyboard collage of the signature greeting gesture.
- OFFICIAL COLORS (MAXIMUM DIVERSITY & VIBRANCE — NEVER USE GENERIC AI PAIRS):
  * Choose 2-3 highly aesthetic, vibrant, and coordinated official fandom colors.
  * Selected Visual Universe Inspiration for this generation: "${chosenColorUniverse.theme}" (${chosenColorUniverse.vibe}).
  * Invent 2-3 completely new, imaginative, and evocative K-pop color names with hex codes and vivid visual descriptions.
- VISUAL ASSETS: Provide detailed image generation prompts for the ${isSolo ? 'soloist' : 'group'} logo.
- ALBUM COVERS & VERSIONS (VISUAL CONCEPTS): Define 2-3 distinct physical album concepts/versions with specific K-fashion styling directions and hair styling/bare-skin grooming details (strictly no cosmetics). Outfits must use the official color palette.
- PROMOTIONAL TIMETABLE (TEASER TIMELINE): Create a realistic promotional rollout schedule of 5-8 sequenced milestones.
- SIMULATION METRICS: Estimate the debut budget, target demographic reach, and potential chart performance.
- NO GENERIC AI BUZZWORDS: Avoid "${FORBIDDEN_WORDS}".
- Define a clear, unique sonic identity that blends current trends with experimental elements.
`;

  return `
You are the Executive Creative Director at a Tier-1 K-pop Label.
Produce a professional, highly detailed A&R Dossier based on 2024-2025 market trends for ${isSolo ? `a ${targetGender} K-pop Soloist (${generation})` : `${generation} K-pop ${groupType}`}.
${marketBrief}
Keywords: "${conceptKeywords || 'Legendary and Provocative'}"

STRICT JSON OUTPUT FORMAT:
{
  "groupName": "string (${isSolo ? `Stage Name of the ${targetGender} Soloist` : 'Official Group Name'})",
  "groupNamePronunciation": "string",
  "groupNameMeaning": "string",
  "agency": "string",
  "debutDate": "YYYY-MM-DD",
  "greeting": { "motto": "string", "gesture": "string" },
  "fandom": { "name": "string", "pronunciation": "string", "nameOrigin": "string", "lightstickDescription": "string", "fandomPersonality": "string", "fandomMotto": "string", "handGesturePrompt": "string" },
  "officialColors": [{ "name": "string", "hex": "#HEXCODE", "description": "string" }],
  "conceptDescription": "string",
  "eraNarrative": [{ "eraTitle": "string", "conceptSummary": "string", "moodOrVibe": "string" }],
  "musicalDirection": "string",
  "logoDescription": "string",
  "logoPrompt": "string",
  "marketFocus": "string",
  "simulationMetrics": { "estimatedDebutBudget": "string", "targetDemographicReach": "string", "potentialChartPerformance": "string" },
  "visualConcepts": [{ "versionName": "string", "aestheticStyling": "string", "makeupHairInfo": "string (Focus on hair styling and natural bare skin grooming, strictly zero makeup or cosmetics)" }],
  "teaserTimeline": [{ "dayCount": "string", "eventName": "string", "deliverableDescription": "string" }]
}
`;
}

function createSingleAlbumPrompt(groupName: string, conceptDescription: string, existingAlbums: string, groupType: string, generation?: string, memberCount: number = 5, fandomName?: string): string {
  const isSolo = isSoloArtist(groupType) || memberCount === 1;
  const artistGender = detectArtistGender(groupType, conceptDescription);
  const isFirstAlbum = !existingAlbums || existingAlbums.trim().toLowerCase() === 'none yet' || existingAlbums.trim() === '';
  return `
Generate ONE NEW album for K-pop ${isSolo ? `solo artist (${artistGender} Soloist)` : 'group'} "${groupName}".
Concept: "${conceptDescription}"
Existing Albums (DO NOT DUPLICATE THESE): ${existingAlbums || 'None yet'}
${isFirstAlbum ? `NOTE: This is their DEBUT ALBUM showcase! However, DO NOT use cliché debut titles like "The First Step", "Chapter 1", "Awakening", or "Beginning". The debut album must have a completely unique, creative title that perfectly fits their specific concept. Create a wildly different, trend-setting debut concept, completely distinct from generic AI debut templates.` : ''}

${isSolo ? `CRITICAL SOLO ARTIST RULES FOR "${groupName}" (${artistGender} Soloist):
- 100% SINGULAR 1ST-PERSON PERSPECTIVE: The entire album, MV storyline, and all song lyrics are written strictly from ${groupName}'s individual perspective ("I", "me", "my", "mine"). NEVER use collective group plurals ("we", "us", "our group", "our team", "together we stand") unless explicitly addressing a romantic partner as a couple ("you and I").
- GENDER-AUTHENTIC PRONOUNS & PERSPECTIVE:
  ${artistGender === 'Female' 
    ? `* Feminine point of view: She / Her / Hers self-expression ("I'm that girl", "the queen", "diva").
  * Directed pronouns: When singing about romantic tension, rivals, or listeners, address them as "he", "him", "boy", or direct "you".
  * ZERO mismatched masculine pronouns for the singer and ZERO collective girl-group clichés.`
    : `* Masculine point of view: He / Him / His self-expression ("I'm that man", "king", "gentleman").
  * Directed pronouns: When singing about romantic tension, rivals, or listeners, address them as "she", "her", "girl", or direct "you".
  * ZERO mismatched feminine pronouns for the singer and ZERO collective boy-group clichés.`}
- REMOVE ALL GROUP MEMBER REFERENCES:
  * PHYSICAL PACKAGING: Plan single artist packaging items (e.g. '80-page editorial photobook', 'exclusive concept photocard (1 of 4 concept versions of ${groupName})', 'folded poster featuring ${groupName}'). STRICTLY FORBIDDEN to say 'random member photocard (1 of 5)'!
  * MV SYNOPSIS: Focuses entirely on ${groupName}'s cinematic solo star power, striking solo set pieces, and choreography backed by dancers. NEVER say 'shows members dancing'!
  * TRACK DESCRIPTIONS & LYRIC EXCERPTS: Feature ONLY ${groupName}'s singular voice and individual charisma. NO member role tags or split parts!
  * VOCAL ARRANGEMENTS: Describe solo dynamics (e.g. 'Intimate breathy verse delivery transitioning into high-belt C6 climax with multi-tracked self-harmonies and ad-libs').
  * SONG MEANINGS: Written casually from ${groupName}'s personal artistic perspective ("In this track, I wanted to express...", not "The members wanted to show...").
` : getLineDistributionRules(memberCount, false, groupName)}

ALBUM, MV & PACKAGING INTEL (HIGH DETAIL, NO GENERIC SLOP):
- MV SYNOPSIS: Create an intelligent, detailed, storyline-rich cinematic music video synopsis showing exactly how a progressive design-first production company would visual-direct it (e.g. detailed stage sets, lighting shifts from pastel pink, lens filters, clothing switches, specific choreography scenes, and plot points like finding relics, walking through mirroring corridors, instead of basic generic statements like "shows members dancing").
- PHYSICAL PACKAGING CONCEPT: Plan highly aesthetic, smart packaging inclusions that fit top-tier companies (e.g. customized multi-form photobooks, envelope-sealed polaroids, printed lyrics cards styled like vintage tickets, holographic sticker packs, or concept-themed items like fake boardgame cards or translucent scent strips).

ALBUM & TRACK STYLING RULES (ABSOLUTELY NO CRINGE OR FORCED AI PATTERNS):
- NEVER USE THESE PRESET AI TITLES: "Spoiler", "Thrift Check", "3am Call", "Eclipse", "Awakening", "Nova", "Illusion", "Focus", "Echo", "Mirror". YOU MUST INVENT COMPLETELY NEW, UNIQUE SONG TITLES EVERY TIME.
- REALISTIC TRACK TITLES (ACROSS GENERATIONS): Vary the style of the song titles. Use all types of popular K-pop naming conventions:
  1. Catchy single English words (e.g., 'Hype Boy', 'Ditto', 'Spicy', 'Supernova', 'Next Level', 'Monster', 'Guilty', 'SOLO').
  2. Quirky onomatopoeia or repeated words (e.g., 'Zimzalabim', 'DALLA DALLA', 'Dumb Dumb', 'Bboom Bboom', 'Ring Ding Dong').
  3. Short, moody phrases (e.g., 'Love Dive', 'Perfect Night', 'I AM', 'Playing with Fire', 'Love Scenario').
  4. Symbolic or abstract concepts (e.g., 'Blood Sweat & Tears', 'Spring Day', 'Sherlock', 'Mirotic', 'Growl').
  5. Creative casing / punctuation / stylization (e.g., 'O.O', 'ELEVEN', 'Nxde', 'TT', 'Ah-Choo', 'La Vie en Rose').
- TRACK LYRICS MUST SOUND LIKE AUTHENTIC, TOP-TIER K-POP:
  * COMPLETE NARRATIVE SENSE & STORYLINE COHERENCE: The lyrics must make 100% logical and emotional sense from line to line. Every line must connect naturally to the next line. NO disjointed non-sequiturs or random word salad. Both Korean and English lines must form complete, grammatically sound thoughts.
  * STRICT BAN ON TIMESTAMPS & FAKE SPECIFICITY: Absolutely NO "2 AM", "3 AM", "4 AM", "midnight", "staring at my screen/phone/ceiling", "read receipts", or "blue light". Ground lyrics in real situations, relational tension, and tangible dialogue.
  * PUNCHY & ULTRA-CATCHY CHORUSES (NOT WORDY OR PREACHY): The chorus must be an instant earworm (2 to 4 lines maximum of high-impact rhythmic hook or drop chant). Balanced syllable counts (6 to 9 syllables per line) so lines bounce on the beat and stick in the listener's head. STRICTLY NO MORAL LESSONS, inspirational essays, or philosophical lectures (NO "we must learn to love ourselves", "stand tall and never give up", "the world tries to break us").
  * BAN NONSENSICAL ONOMATOPOEIA: Strictly NO awkward, random, or forced sound effects (e.g. 'tik-tak', 'ppappappa', 'ratata', 'beep-beep', 'vroom', 'zoom', 'skrrt'). Every line and chant must make natural musical and lyrical sense.
  * CASUAL, RELATABLE VERSES (NO POETRY-LIKE FLUFF): Verses do NOT need to be stiff, Victorian, or overly dramatic poetry. They should feel conversational, casual, modern, and relatable. Verses must establish the groove and naturally build anticipation into the Pre-Chorus and Chorus WITHOUT stealing their spotlight or competing with them!
  * TOP-TIER RAP FLOW: Rapping must have authentic rhythmic pocket, cadence, locked-in syncopation, and multisyllabic internal slant rhymes. Deliver witty punchlines, natural bilingual attitude, and sharp swagger (inspired by Soyeon, Changbin, Mark Lee, Jennie, Bobby).
  * AVOID AI CLICHÉS & CRINGE: Never use pretentious, over-dramatic AI phrases like "velvet rope", "perimeter", "unlocking the gate", "SÉCURITÉ", "whisper in the dark", "shadows", "breaking the rules", "neon lights", "destiny", "eternity", "ignite", "echoes". DO NOT use basic magic/star metaphors.
  * POV & NARRATIVE CLARITY: The lyrics must have a clear Point of View (I, You, We). Use strong, directed pronouns to ground the lyrics in a specific situation, relationship, or conversation. Make sure the lyrics make complete narrative sense.
  * VARY THE KOREAN & ENGLISH MIX: Use varied structures for English and Romanized Korean. Do not just use English at the end of lines. Sometimes start a line with English and end with Korean, sometimes use full English lines, sometimes full Korean lines, sometimes insert English words mid-sentence, etc. Mix it up naturally.
  * STUDY REAL EXAMPLES: Your lyrics should feel exactly like these real K-pop hits:
    > KISS OF LIFE style: "When I walk onto the stage, yeah, I got this / 짙게 타오르는 숨 벅찬 heartbeat / Come around, baby, you can come and see me / Making everybody go, 'Who is she?'"
    > ENHYPEN style: "With or without you / Neoreul ireun cheongugeun jiogingeol / With or without you / Nareul taeuneun i beautiful fire / It's all my bad desire"
    > LE SSERAFIM style: "(Woo) Ippal sai kkin spaghetti / Ppaego simni? Bon appétit / Geunyang pogihae eochapi / Eat it up, eat it, eat it up"
    > Stray Kids style: "Why do I keep getting attracted? / Jaseok gachi kkeullyeoga (Oh) / I cannot explain this reaction / Igeotbakke one-four-three (Oh)"
  * AVOID OVERUSE OF RHYME & REPETITION: Do not over-rely on repetitive nursery rhymes. Use complex internal rhymes, slant rhymes, rhythmic staccato phrasing, and multi-syllabic flows. The lyrics must read like a produced pop/rap rhythm, not a nursery rhyme.
- NO VIRTUAL CLICHES: Under no circumstances should the lyrics or song descriptions contain tech/cyber slop words like 'glitch', 'system', 'hologram', 'code', 'data', 'simulation', 'download', 'protocol', 'database'. Popular K-pop songs are about real feelings, styles, and energy, not technical software.
- MUSICIANSHIP & RHYMING: Absolutely NO generic AABB or ABAB end-rhymes (e.g. night/light, fly/high). Use complex internal rhymes, slant rhymes, rhythmic staccato phrasing, and multi-syllabic flows. The lyrics must read like a produced pop/rap rhythm, not a nursery rhyme.
- TITLE INTEGRATION: The song title MUST be integrated naturally into the chorus as the core rhythmic hook. Do NOT awkwardly paste the title at the end of a sentence just to include it. It must make contextual and musical sense.
${fandomName ? `- FANDOM LYRICAL EASTER EGG (REALISTIC FREQUENCY): Fandom names appear in < 10% of a group's total discography so as not to alienate casual listeners. If you embed the fandom name "${fandomName}" into a track's lyrics, you MUST follow these placement rules:
  1. Dedicated "Fan Song" B-Side (Anniversary/Milestone): Mentioned heavily in the main chorus or song title (e.g., ITZY "Trust Me (MIDZY)").
  2. Standard Title Track (Rare, ~5-10%): Hidden seamlessly via The Infiltration (Double-Meaning) or Language-Bending Visual Joke so casual listeners don't notice (e.g., IVE "Love Dive").
  3. Standard B-Side Tracks (~20%): Placed in emotional bridges, ending lines, or The Code (Acronym Spell-Out).
  4. Hype Intros & Concert Remixes: Yelled as an ad-lib in the intro/outro, or leaving empty beats for Acoustic Stadium Chants.
  5. Album Outro / Hidden Track: A spoken-word message thanking fans.
  CRITICAL: DO NOT mention the fandom name in every song! Choose EXACTLY ONE track on the album (preferably a B-side) to feature a creative fandom lyrical easter egg using one of the methods above, and NEVER mention the fandom name in any of the other tracks.` : ''}
${getChorusEngineeringRules(groupType, generation, undefined, isSolo, artistGender)}
- SONG MEANINGS MUST BE CASUAL, RELEVANT, & SHORT:
${getAllLyricTropesText()}
  * DO NOT start descriptions or meanings with crutch words like "Basically" or "This song is basically...". Just state the meaning directly, casually, and briefly, as if ${isSolo ? `${groupName} is explaining their personal vision` : 'a real member is explaining it'} simply on a TikTok live or a music show interview.

K-POP SONG STRUCTURE MANDATE - YOU MUST RANDOMIZE & ASSIGN ONE OF THESE TOP 5 STRUCTURES TO EACH SONG:
1. "The Dynamic Pop/EDM Powerhouse": (Sequencing: Intro -> Verse 1 -> Pre-Chorus -> Drop Chorus -> Verse 2 (trap-break rap) -> Pre-Chorus -> Chorus -> Bridge (melodic high note) -> Outro (explosive choreo-chant focus))
2. "The Multi-Part Hybrid Beat-Switch-up": (Sequencing: Intro (spoken/signature hook) -> Verse 1 (R&B groove) -> Pre-Chorus (rising build) -> Chorus (anti-drop) -> Verse 2 (abrupt half-time breakbeat/tempo shift) -> Chorus -> Bridge (ambient tempo slow-down) -> Outro (dramatic beat-switch & highnotes/chants))
3. "The Post-Chorus TikTok Hook-First": (Sequencing: Intro/Chorus start -> Verse 1 -> Pre-Chorus -> Chorus -> Post-Chorus (catchy repetitive mantra chant loop) -> Verse 2 -> Chorus -> Post-Chorus -> Short Outro (dance break & hook overlap))
4. "Sensual Minimalist R&B / UK Garage": (Sequencing: Atmospheric Intro -> Low-Register Verse 1 -> Airy Falsetto Pre-Chorus -> Whisper-Staccato Chorus -> Call-and-Response Verse 2 -> Dual-Harmony Bridge -> Fading Ad-lib Outro)
5. "Cyberpunk Hyperpop / Jersey Club Staccato": (Sequencing: Fast-Chant Intro -> Fast-BPM Verse 1 (140 BPM) -> Rising Snare Pre-Chorus -> Jersey 5-Beat Bounce Chorus -> Verse 2 Punchy Staccato Rap -> Glitch-Pop Bridge -> Dual-Tempo Finale)

MUSIC STYLE PROMPT & AUDIO PRODUCTION INTEL:
For EACH track, you MUST generate a complete, high-definition "musicStylePrompt" that describes the purely instrumental and production details (NO LYRICS, just musical styling, BPM, key, rhythm, synths, bass, vocal production, and mix aesthetic) so producers or music generators (like Suno/Udio/DAWs) can use it directly.

STRICT JSON OUTPUT FORMAT:
{
  "album": { 
    "type": "Mini Album", 
    "title": "string (Evocative, natural, non-generic K-pop album title)", 
    "releaseDate": "YYYY-MM-DD", 
    "titleTrack": "string (Catchy, trendy, non-generic title track name)", 
    "albumCoverPrompt": "string (Detailed image generation prompt for the album cover)",
    "conceptSummary": "string (1-2 sentences explaining this comeback's story or aesthetic vibe)",
    "targetMarketStrategy": "string (Brief specific detail about who this release targets and how, like 'Japanese pre-release with retro anime-inspired aesthetic')",
    "mvSynopsis": "string (An incredibly detailed, creative director's outline of the music video storyline, settings, stylistic camera direction, costume themes, and cinematic plot keys)",
    "physicalInclusions": ["string" (generate 3-4 fun high-concept physical packaging items, e.g. '84-page photobook', ${isSolo ? `'exclusive concept photocard (1 of 4 versions of ${groupName})'` : `'random member photocard (1 of 5)'`}, 'printed lyrics booklet styled as a passport')],
    "tracks": [
      {
        "title": "string (Catchy, realistic K-pop track name)",
        "duration": "string (m:ss format, e.g., '3:05')",
        "role": "Title Track",
        "genre": "string (e.g. 'Synthwave Pop')",
        "genres": ["string (Primary and subgenres, e.g. ['Synthwave Pop', 'Dark Cyberpunk Bass', 'Jersey Club'])"],
        "musicStylePrompt": "string (High-definition audio/music production prompt with BPM, Key, drums, 808 bass, synths, acoustic textures, vocal mixing and vibe - NO LYRICS)",
        "producers": ["string (Realistic names, can mix classic K-pop creators like Dem Jointz, LDN Noise, FRANTS and global hitmakers)"],
        "lyricists": ["string"],
        "description": "string (Vivid 1-sentence description of the song's energy, instrumentation, and vocal/rap focus)",
        "lyricExcerpt": "string (Two highly catchy K-pop lines in English or Romanized-Korean using slant-rhymes or internal rhyming, avoiding basic repeating ABAB loops and avoiding virtual words like glitch or system)",
        "meaning": "string (A casual, simple explanation of the song's meaning, written exactly like ${isSolo ? `${groupName} explaining their personal vision` : 'a K-pop member explaining it'} in a simple, non-complicated interview)",
        "hasChoreography": true,
        "choreographer": "string (or null)",
        "structureType": "string (e.g., 'Dynamic Pop/EDM Powerhouse', 'Multi-Part Hybrid Beat-Switch-up', 'Post-Chorus TikTok Hook-First', 'Sensual Minimalist R&B / UK Garage', or 'Cyberpunk Hyperpop / Jersey Club Staccato')",
        "structurePattern": "string (Sequence matching the structureType)",
        "rhymeScheme": "string (e.g., 'Cross-Language Phonetic Slant & Compound Rhymes')",
        "figurativeDevices": ["string (e.g. 'Synesthesia & Sensory Blending', 'Visceral Hyperbole')"],
        "vocalArrangement": "string (e.g. ${isSolo ? `'Solo lead vocal with intimate breathy verses, layered self-harmonies, and soaring high-belt climax'` : `'Multi-part vocal layering with 16-bar staccato rap cadence and high-belt C6 climax'`})"
      },
      {
        "title": "string (Catchy track name)",
        "duration": "string (e.g., '2:48')",
        "role": "B-side",
        "genre": "string",
        "genres": ["string"],
        "musicStylePrompt": "string (Detailed music production prompt without lyrics)",
        "producers": ["string"],
        "lyricists": ["string"],
        "description": "string (Description of this B-side's style)",
        "lyricExcerpt": "string (Catchy lyric excerpt with interesting rhyming)",
        "meaning": "string (Casually explained simple song meaning)",
        "hasChoreography": false,
        "choreographer": null,
        "structureType": "string",
        "structurePattern": "string",
        "rhymeScheme": "string",
        "figurativeDevices": ["string"],
        "vocalArrangement": "string"
      },
      {
        "title": "string (Catchy track name)",
        "duration": "string",
        "role": "B-side",
        "genre": "string",
        "genres": ["string"],
        "musicStylePrompt": "string (Detailed music production prompt without lyrics)",
        "producers": ["string"],
        "lyricists": ["string"],
        "description": "string",
        "lyricExcerpt": "string",
        "meaning": "string",
        "hasChoreography": false,
        "choreographer": null,
        "structureType": "string",
        "structurePattern": "string",
        "rhymeScheme": "string",
        "figurativeDevices": ["string"],
        "vocalArrangement": "string"
      }
    ]
  }
}
`;
}

function createSingleMemberPrompt(
  groupType: GroupType, 
  conceptDescription: string, 
  groupName: string, 
  existingMembersStr: string,
  existingMembersList: MemberProfileData[] = [],
  replacedMember?: MemberProfileData,
  userInput?: UserInput
): string {
  const isSolo = isSoloArtist(groupType);
  
  // Calculate balanced gender for Co-ed Groups
  const existingMales = existingMembersList.filter(m => (m.gender || '').toLowerCase() === 'male').length;
  const existingFemales = existingMembersList.filter(m => (m.gender || '').toLowerCase() === 'female').length;
  
  let targetGender: 'Male' | 'Female' = 'Female';
  if (groupType === 'Boy Group' || groupType === 'Male Soloist') {
    targetGender = 'Male';
  } else if (groupType === 'Girl Group' || groupType === 'Female Soloist') {
    targetGender = 'Female';
  } else if (groupType === 'Co-ed Group') {
    if (existingMales > existingFemales) {
      targetGender = 'Female';
    } else if (existingFemales > existingMales) {
      targetGender = 'Male';
    } else {
      targetGender = Math.random() > 0.5 ? 'Male' : 'Female';
    }
  } else {
    // Soloist or custom
    targetGender = detectArtistGender(groupType, conceptDescription, userInput?.conceptKeywords);
  }

  const groupTypeInstruction = targetGender === 'Male' ? 'MALE (Male Idol)' : 'FEMALE (Female Idol)';
  const pronouns = targetGender === 'Male' ? 'he/him/his' : 'she/her/hers';
  
  // Extract all existing stage names and real names to guarantee zero repetition
  const allUsedStageNames = new Set<string>();
  const allUsedRealNames = new Set<string>();
  const existingGarments: string[] = [];
  
  existingMembersList.forEach(m => {
    if (m.stageName) allUsedStageNames.add(m.stageName.trim());
    if (m.fullNameRomanized) allUsedRealNames.add(m.fullNameRomanized.trim());
    if (m.fullNameKorean) allUsedRealNames.add(m.fullNameKorean.trim());

    const detected = extractGarmentCategories(m.personalFashionStyle || '', m.imagePrompt || '');
    if (detected.topType || detected.bottomType) {
      existingGarments.push(`- ${m.stageName || 'Member'}: wears ${detected.topType.replace(/_/g, ' ')} (top) and ${detected.bottomType.replace(/_/g, ' ')} (bottom)`);
    }
  });
  
  if (replacedMember) {
    if (replacedMember.stageName) allUsedStageNames.add(replacedMember.stageName.trim());
    if (replacedMember.fullNameRomanized) allUsedRealNames.add(replacedMember.fullNameRomanized.trim());
  }

  const usedStageNamesDisplay = Array.from(allUsedStageNames).map(s => `"${s}"`).join(', ');
  const usedRealNamesDisplay = Array.from(allUsedRealNames).map(s => `"${s}"`).join(', ');

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const rl1 = letters[Math.floor(Math.random() * letters.length)];
  const rl2 = letters[Math.floor(Math.random() * letters.length)];
  const rl3 = letters[Math.floor(Math.random() * letters.length)];
  const randomSeed = Math.random().toString(36).substring(2, 9);
  
  return `
Casting Brief for ${isSolo ? `the ${targetGender} Solo Artist "${groupName}"` : `ONE NEW member of "${groupName}" (${groupType})`}.
Lore Context: "${conceptDescription}"

GENDER & DEMOGRAPHIC (CRITICAL - MANDATORY ASSIGNMENT):
- Assigned Gender: ${targetGender.toUpperCase()} (${targetGender === 'Male' ? 'Male idol, use he/him/his' : 'Female idol, use she/her/hers'})
- In the JSON output, you MUST set "gender": "${targetGender}".
${isSolo ? `
- SOLOIST IDENTITY & STAGE NAME MANDATE:
  This artist is a SOLO PERFORMER (${targetGender} Soloist).
  * In the JSON output, you MUST set "stageName": "${groupName}". Their stage name IS their solo artist name "${groupName}".
  * Their positions MUST be soloist positions like ["Soloist", "Vocalist", "Dancer"] or ["Soloist", "Songwriter", "Performer"]. NEVER assign "Leader" or "Maknae" since this is a solo artist, NOT a group!
  * Visual and styling must be tailored for a stunning, charismatic 18-22 year old ${targetGender.toLowerCase()} solo artist.
` : ''}
${groupType === 'Co-ed Group' ? `- CO-ED GROUP MEMBER DIRECTIVE: This group is a Co-ed Group ("${groupName}"). The roster comprises both male and female members. This specific member MUST be cast as a ${targetGender.toUpperCase()} idol with authentic ${targetGender.toLowerCase()} vocal characteristics, clothing, styling, and visual proportions.` : ''}

${replacedMember ? `
RECASTING A BRAND NEW IDOL (CRITICAL RECAST DIRECTIVE):
The user has clicked "Redo Profile Data" to discard the old member and cast a COMPLETELY NEW, DIFFERENT IDOL from scratch.
- DISCARDED PREVIOUS IDOL: "${replacedMember.stageName}" (Real Name: "${replacedMember.fullNameRomanized}", Origin: "${replacedMember.placeOfBirth}", Race: "${replacedMember.race}", Positions: "${replacedMember.positions?.join(', ')}", Style: "${replacedMember.personalFashionStyle}").
- STRICT REPLACEMENT RULE: You MUST NOT reuse the previous idol's stage name, real name, ethnicity/hometown, or traits. Generate a COMPLETELY DIFFERENT, fresh new idol with a new stage name, new real name, different birthplace, different facial structures, different hairstyle/color, different performance stats, different MBTI, and different pre-debut history!
` : ''}

${!isSolo ? `Existing Members in Lineup:
${existingMembersStr || 'None yet'}` : ''}

${allUsedStageNames.size > 0 ? `
STRICT ANTI-REPETITION DIRECTIVE (ABSOLUTE PROHIBITION ON REPEATING NAMES):
The following stage names and real names have ALREADY been used in this group/session and are STRICTLY FORBIDDEN from being repeated or slightly modified:
- FORBIDDEN ALREADY-USED STAGE NAMES: ${usedStageNamesDisplay || 'None'}
- FORBIDDEN ALREADY-USED REAL NAMES: ${usedRealNamesDisplay || 'None'}
You MUST generate a 100% BRAND NEW, completely distinct stage name and real birth name that is NOT on this list or anywhere close to it!
` : ''}

${existingGarments.length > 0 ? `
STRICT ANTI-UNIFORM DIRECTIVE (ZERO MATCHING TOPS OR BOTTOMS ACROSS MEMBERS):
Under NO circumstances should members in this group wear the same type of shirts/tops or pants/bottoms!
Current garments worn by other members in this group:
${existingGarments.join('\n')}
MANDATORY OUTFIT SILHOUETTE VARIETY DIRECTIVE:
You MUST assign this new member a completely DIFFERENT top category (NOT on the list above) and a completely DIFFERENT bottom category (NOT on the list above)!
For example:
- If an existing member wears a button-down shirt, this member CANNOT wear a button-down shirt (choose a cropped deconstructed blazer, varsity bomber jacket, brushed mohair cardigan, moto racing blouson, asymmetrical waistcoat vest, waffle henley, or collegiate rugby polo).
- If an existing member wears denim jeans, this member CANNOT wear denim jeans (choose fluid double-pleated tailored slacks, 3D baggy cargo skate pants, knife-pleated suiting skort, Bermuda city shorts, raw-hem denim jorts, lightweight parachute track pants, A-line wrap kilt-skort, canvas carpenter pants, or corduroy slacks).
NO TWO MEMBERS IN THE ENTIRE GROUP MAY WEAR THE SAME TOP TYPE OR BOTTOM TYPE!
` : ''}

STAGE NAME & REAL NAME GUIDELINES (ICONIC, NATURAL & AUTHENTIC K-POP IDENTITY):
- RANDOMIZATION SEED: [${randomSeed}]. Ensure authentic, natural, and memorable K-pop idol stage names and 100% original real names.
- STRICT NO AI-SOUNDING / SCI-FI / FANTASY NAMES: Absolutely NO fake-sounding AI words, sci-fi alien tags, or RPG game characters (e.g., ABSOLUTELY NO 'Vail', 'Vex', 'Vay', 'Val', 'Vesper', 'Aven', 'Zylas', 'Kaelis', 'Aethon', 'Ignis', 'Vexal', 'Aether', 'Nox', 'Zephyr', 'Luxe', 'Nyx', 'Zeno', 'Rune', 'Aura', 'Nova'). These sound like synthetic bots or video game handles rather than real human K-pop idols.

- COMPLETE STAGE NAMING VERSATILITY (ALL AUTHENTIC TYPES FREELY SUPPORTED & MIXED):
  K-pop groups feature a rich, natural variety of naming styles across native Korean and all global/Asian members. You can freely choose and mix ANY of the following authentic naming approaches for any member:
  1. REAL GIVEN BIRTH NAMES (100% NATURAL & COMMON): An idol promoting directly under their real given birth name as a single clean name (e.g., Minjun, Haeun, Seungwoo, Chaewon, Jiwon, Doyun, Yuna, Soobin, Beomgyu, Sunghoon, Wonbin, Sohee, Sungchan, Anton, Jaehyun, Doyoung, Jungwoo, Mark, Renjun, Jeno, Jaemin, Chenle, Jisung, Haruto, Ren, Lisa, Ten, Hanni, Dita, Sriya, Hanbin, Aria, Sophia, Kriesha, Chanty, Lingling, Zayyan).
  2. PUNCHY KOREAN WORD & NATURE MONONYMS: Authentic pure-Korean words or meaningful names that sound clean and poetic (e.g., "Gaeul" [Autumn], "Bada" [Ocean], "Haneul" [Sky], "Byeol" [Star], "Bom" [Spring], "Sol" [Pine/Sun], "San" [Mountain], "Dan-a", "Roa", "Sieun", "I-eun", "Se-on").
  3. CLIPPED SYLLABLE MONONYMS: A punchy single syllable derived directly from their real given name (e.g., "Han" from Han Ji-sung, "San" from Choi San, "Kai" from Kim Jong-in, "Ren" from Choi Min-ki, "Chae" from Chaewon, "Yoo" from Yoo-jung, "Jun" from Jun-hui, "Sol" from Jin-sol, "Gaeul", "Rei", "Liz", "Bae", "Ten", "Natty").
  4. NATURAL GLOBAL & WESTERN GIVEN NAMES: For diaspora, global, or internationally styled members across Asia and the world (e.g., "Jay", "Jake", "Felix", "Mark", "Johnny", "Anton", "Eric", "Kevin", "Jacob", "Lily", "Danielle", "Hanni", "Julie", "Stella", "Chloe", "Nicholas", "Harua", "Maki", "Lucas", "Lara", "Sophia", "Isaac").
  5. STYLIZED AGENCY ALIASES & EDITORIAL PSEUDONYMS: Melodious, fashionable aesthetic names crafted by agencies (e.g., "Karina", "Giselle", "Wendy", "Irene", "Hwasa", "Wheein", "Natty", "Belle", "Julie", "Arin", "YooA", "Onda", "Mia", "Sihyeon", "Aisha", "Yiren", "Sena", "Ruka", "Moka", "Minju", "Wonhee", "Iroha", "Chuu", "Yves", "Vivi", "Solar", "Joy", "Aria").
  6. STYLIZED INITIALISMS & PUNCTUATED ALIASES: Sharp graphic mononyms (e.g., "D.O.", "I.M", "B.I", "J-Hope", "RM", "V", "Q", "New", "THE8", "S.Coups", "K", "BM", "DK", "Z.N", "J.L").

- ZERO PRESETS FOR REAL NAMES (100% ORIGINAL & DYNAMIC GENERATION ACROSS ALL ASIAN NATIONS):
  * You MUST NEVER use fixed preset templates, hardcoded name pools, or repeating stock names for idols' real birth names.
  * Every single real birth name (both full romanized and native script like Hangul/Kanji/Hanzi/Devanagari/Thai/Cyrillic/Tagalog) must be completely original, authentic, and dynamically generated on the fly matching the idol's specific birthplace, nationality, and heritage.
  * For Korean members: Dynamically generate authentic Korean given names and pair them with diverse Korean family names (draw from Kang, Cho, Yun, Im, Han, Oh, Seo, Shin, Kwon, Hwang, Ahn, Song, Jeon, Hong, Yoo, Go, Moon, Yang, Son, Bae, Baek, Heo, Seol, Pyo, Ma, Gu, Na, Cheon, Yeon, etc. rather than repeating standard ones).
  * For Southeast Asian members (e.g. Philippines, Thailand, Vietnam, Indonesia, Malaysia, Singapore, Myanmar, Cambodia): Dynamically generate culturally authentic, realistic native names matching their exact language and heritage (e.g., authentic Thai first names & formal surnames, Vietnamese names with Chữ Quốc ngữ, Filipino first names & surnames [Tagalog/Spanish-Filipino heritage], Indonesian names, Malay names).
  * For South Asian members (e.g. India, Pakistan, Bangladesh, Sri Lanka, Nepal): Dynamically generate culturally authentic native given names and surnames matching their specific region/state (e.g. Odia, Hindi, Tamil, Bengali, Punjabi, Marathi, Telugu).
  * For Central Asian members (e.g. Kazakhstan, Uzbekistan, Kyrgyzstan): Dynamically generate culturally authentic Kazakh/Uzbek native given names and surnames in Cyrillic & Latin romanization.
  * For West Asian / Middle Eastern members (e.g. Turkey, Lebanon, UAE, etc.): Dynamically generate authentic native names.
  * For Japanese, Chinese, Taiwanese, Mongolian, Western diaspora, or mixed-race members: Dynamically generate culturally authentic, realistic native names matching their exact heritage.
  * If the idol uses their real given name as their stage name, ensure their fullNameRomanized and stageName harmoniously correspond (e.g., Stage Name: "Minjun", Full Real Name: "Park Min-jun" / 박민준; Stage Name: "Aria", Full Real Name: "Gauthami" / 가우타미; Stage Name: "Hanbin", Full Real Name: "Ngô Ngọc Hưng" / 응오응옥흥). If they use an alias or mononym, pair it with an equally authentic, fully original real birth name.

- VARIETY RULE (CRITICAL & ABSOLUTE): You MUST generate completely new, unique, and unpredictable stage names and real names every single time this prompt is run. Do not rely on previous patterns. YOU MUST NOT KEEP REUSING THE SAME NAMES YOU JUST GENERATED IN PREVIOUS REQUESTS.
- STRICTLY FORBIDDEN DETAILED LIST (NEVER GENERATE OR SLIGHTLY MODIFY THESE REAL COPIED NAMES):
  * Famous Female Stage Names: Hanni, Danielle, Minji, Haerin, Hyein, Karina, Winter, Giselle, Ningning, Lisa, Jennie, Rosé, Jisoo, Irene, Seulgi, Wendy, Joy, Yeri, Nayeon, Jeongyeon, Momo, Sana, Jihyo, Mina, Dahyun, Chaeyoung, Tzuyu, Yeji, Lia, Ryujin, Chaeryeong, Yuna, Wonyoung, Yujin, Gaeul, Rei, Liz, Leeseo, Sakura, Chaewon, Yunjin, Kazuha, Eunchae, Sullyoon, Kyujin, Jiwoo, Haewon, Lily, Bae, Soyeon, Miyeon, Minnie, Yuqi, Shuhua, Chuu, Yves, Heejin, Hyunjin, Haseul, Vivi, Kim Lip, Jinsoul, Choerry, Gowon, Olivia Hye, Eunha, SinB, Umji, Somi, Sunmi, Chungha, IU, Taeyeon, BoA, Billie, Lana, Lorde, Taylor, Miley, Rihanna, Beyonce, Selena, Ariana, Chappell, Olivia, Sabrina.
  * Famous Male Stage Names: Jungkook, Jimin, V, Suga, J-Hope, RM, Jin, G-Dragon, Taeyang, Daesung, T.O.P, Baekhyun, Chanyeol, D.O., Kai, Sehun, Suho, Xiumin, Chen, Lay, Taemin, Key, Onew, Minho, Bang Chan, Lee Know, Changbin, Hyunjin, Han, Felix, Seungmin, I.N, Soobin, Yeonjun, Beomgyu, Taehyun, Huening Kai, Jungwon, Heeseung, Jay, Jake, Sunghoon, Sunoo, Ni-ki, Eunseok, Sungchan, Wonbin, Sohee, Anton, Shotaro, Taeyong, Mark, Jaehyun, Doyoung, Haechan, Johnny, Yuta, Jungwoo, Taeil, Lucas, Ten, Kun, Winwin, Xiaojun, Hendery, Yangyang, Chenle, Jisung, Renjun, Jeno, Jaemin.
- CRITICAL: Double-check the generated stageName and ensure it is not exactly equal to any of the forbidden names, and doesn't directly copy or slightly modify a very famous one (e.g., do not generate 'Wintey', 'Karin', 'Jenni', 'Rosie', 'Jungkook', 'Taemyn', etc.). If you have already used a name in this session, DO NOT USE IT AGAIN.
- NAMES PAIRING: If the idol has a Korean full name, ensure the romanized version corresponds perfectly (e.g., "Park Ji-sung" -> "박지성"). If they are a foreign/global Asian member, match their name to their place of birth and provide their native name plus the standard Korean Hangul broadcast transliteration in fullNameKorean (e.g. birthplace "Cebu City, Philippines" -> Filipino name "Mateo Gabriel Santos" / 마테오 가브리엘 산토스; birthplace "Kyoto, Japan" -> Japanese name "Miyawaki Sakura" / 미야와키 사쿠라; birthplace "Bhubaneswar, India" -> Indian name "Sriya Lenka" / 스리야 렌카; birthplace "Bangkok, Thailand" -> Thai name "Pranpriya Manobal" / 쁘란쁘리야 마노반).
- TRAINING PERIOD: Give a highly realistic duration (e.g. "2 years 6 months", "4 years", "11 months").
- K-POP POSITION DIRECTIVE (Omit for Soloist): Assign authentic combinations from real-world roles like: 'Leader', 'Main Vocalist', 'Lead Vocalist', 'Main Dancer', 'Lead Dancer', 'Main Rapper', 'Lead Rapper', 'Sub Vocalist/Rapper', 'Visual', 'Center', or 'Maknae' (youngest).

HIGH INDIVIDUALITY & DIVERSITY DIRECTIVE (CRITICAL - FULL PAN-ASIAN REPRESENTATION):
- MEMBER INDIVIDUALITY: You MUST ensure every single member has a completely unique background, MBTI, birthplace, representative emoji/animal, visual assets, and voice/performance vibe. NO duplicate MBTIs or emojis across members.
- PAN-ASIAN & GLOBAL DIVERSITY (SINGLE-ETHNICITY BY DEFAULT, WITH MIXED-RACE ASIAN IDOLS OCCASIONALLY / ORGANICALLY): Modern K-pop is an expansive, globally embraced industry. Maintain a natural, realistic balance across the lineup:
  * SINGLE-ETHNICITY ASIAN IDOLS (STANDARD & PRIMARY): The majority of members in standard K-pop lineups are single-ethnicity Asian idols representing diverse countries and cultures:
    1. EAST ASIA: South Korea, Japan, China, Taiwan, Hong Kong, Macau, Mongolia.
    2. SOUTHEAST ASIA: Thailand, Philippines, Vietnam, Indonesia, Malaysia, Singapore, Myanmar, Cambodia, Laos, Brunei. (e.g. Thai, Filipino, Vietnamese, Indonesian, Malaysian, Singaporean idols).
    3. SOUTH ASIA: India, Pakistan, Bangladesh, Sri Lanka, Nepal, Bhutan, Maldives. (e.g. Indian, Nepali, Sri Lankan idols).
    4. CENTRAL ASIA: Kazakhstan, Uzbekistan, Kyrgyzstan, Tajikistan, Turkmenistan. (e.g. Kazakh, Uzbek idols).
    5. WEST ASIA / MIDDLE EAST: Turkey, Lebanon, UAE, Saudi Arabia, Jordan, Iran, Armenia, Azerbaijan, Georgia, etc.
    6. ASIAN DIASPORA: Diaspora born in Western & global countries (e.g., Filipino-American, Korean-Australian, Vietnamese-Canadian, Indian-British, Thai-German, Chinese-American, Japanese-Brazilian).
  * MULTI-ETHNIC & MIXED-RACE ASIAN IDOLS (OCCASIONALLY & ORGANICALLY INCLUDED): Just like in real-world K-pop (e.g., Somi, Danielle, Vernon, Huening Kai, Tia), occasionally include mixed-race Asian members when appropriate or spontaneous:
    - Mixed Pan-Asian: Half-Korean / Half-Filipino, Half-Japanese / Half-Korean, Half-Thai / Half-Chinese, Half-Indian / Half-Korean, Half-Vietnamese / Half-Filipino, Half-Indonesian / Half-Korean.
    - Mixed Asian / Caucasian/White: Half-Korean / Half-Caucasian (American, Canadian, Australian, French, German), Half-Filipino / Half-White, Half-Japanese / Half-White, Half-Thai / Half-German, Half-Vietnamese / Half-French.
    - Mixed Asian / Black (Blasian): Black / Asian (e.g., African-American / Korean, Afro-Filipino, Black / Japanese).
    - Mixed Asian / Hispanic/Latino: e.g., Mexican-Korean, Brazilian-Japanese, Colombian-Filipino.
  * Ensure the 'race' field is highly specific. You MUST provide the broad race category AND the specific ethnicity (e.g., "Asian (Korean)", "Asian (Japanese)", "Asian (Chinese)", "Asian (Filipino)", "Asian (Thai)", "Asian (Vietnamese)", "Asian (Indian)", "Asian (Indonesian)", "Asian (Kazakh)", "Asian (Taiwanese)", "Asian (Singaporean)", "Mixed: Asian (Korean) / White (Australian)", "Mixed: Asian (Korean) / Asian (Filipino)", "Mixed: Black (African-American) / Asian (Korean)", "Mixed: White (American) / Asian (Indian)", "Mixed: Asian (Japanese) / White (American)").
  * For mixed-race members, reflect their multicultural heritage naturally in their name (e.g. bilingual given name, English/Western first name with Asian family name, or dual names), birthplace, spoken languages, and bio background.
  * For the 'placeOfBirth' field, make sure you are highly specific with the exact city, province/region/state, and country (e.g., "Seoul, South Korea", "Busan, South Korea", "Tokyo, Japan", "Osaka, Kansai, Japan", "Cebu City, Philippines", "Bangkok, Thailand", "Jakarta, Indonesia", "Bhubaneswar, Odisha, India", "Almaty, Kazakhstan", "Ho Chi Minh City, Vietnam", "Kuala Lumpur, Malaysia", "Taipei, Taiwan", "Toronto, Ontario, Canada", "Sydney, New South Wales, Australia", "Los Angeles, California, USA"). Do not be vague.
- REALISTIC HEIGHT & WEIGHT: Assign realistic measurements. Height should range from 155cm to 185cm based on gender. Weight should be healthy and realistic (e.g., 45kg to 70kg).
- ROLE MODELS (STRICT NON-REPETITIVE, EXPANDED GLOBAL SELECTION): K-pop idols look up to a highly diverse set of global musical acts, legendary bands, individual artists, pop superstars, indie singers, rock legends, hip-hop/R&B trailblazers, and experimental producers.
  * DO NOT limit role models to K-pop idols. You MUST select and combine both K-pop pioneers AND global/Western/Eastern non-K-pop acts (e.g., bands, rock groups, singers, sound designers) from around the world to ensure every single generated member has a highly distinct, original, and deeply layered set of 1-3 role models.
  * EXAMPLES OF GLOBAL/NON-K-POP HEROES TO FREELY CHOOSE AND MIX IN:
    - BANDS & GROUPS: Queen, Radiohead, Daft Punk, Oasis, The 1975, Coldplay, Pink Floyd, Gorillaz, Fleetwood Mac, ABBA, New Order, Nirvana, Arctic Monkeys, No Doubt, Paramore, CHVRCHES, Depeche Mode, Phoenix.
    - VOCALISTS & POP DIVAS: Billie Eilish, Lorde, Lana Del Rey, SZA, Frank Ocean, Bruno Mars, Stevie Wonder, Adele, Charlie Puth, Mitski, Hozier, Joji, Rosalía, Charli XCX, Olivia Rodrigo, Chappell Roan, Sabrina Carpenter, Hayley Williams, FKA twigs, Björk.
    - INDIE, FOLK & BEATS: Bon Iver, Phoebe Bridgers, Fred again.., FKJ, Tame Impala, Aphex Twin, Mac DeMarco, Tyler, The Creator, Kendrick Lamar, Ryuichi Sakamoto, Steve Lacy, Clairo, Boygenius.
    - PERFORMERS & LEGENDS: Michael Jackson, Prince, Janet Jackson, Madonna, David Bowie, Queen, Lady Gaga, Beyoncé.
  * K-POP LEGENDS (Use selectively): Taeyang, G-Dragon, Taemin, IU, BoA, Uhm Jung-hwa, Lee Hyori, J-Hope, RM, Jonghyun, Baekhyun, Taeyeon, Sunmi.
  * Connect they are a fan of them authentically (e.g., a rapper referencing Tyler, The Creator or Gorillaz, an indie-pop songwriter referencing Phoebe Bridgers, a main dancer inspired by Michael Jackson or FKA twigs, or a keyboardist-vocalist citing Tame Impala or Coldplay).

- PERSONAL FASHION STYLE (STRICT REAL STYLES RULE): You MUST assign a real, highly recognizable fashion style name for this member's 'personalFashionStyle' field. Choose exactly from or creatively combine these authentic fashion styles seen on real idols:
  * CLASSIC & CLEAN: "Classic / Casual", "Minimalist", "Normcore", "Preppy", "Old Money / Quiet Luxury", "Business Casual", "Chic", "Elegant", "Sophisticated", "Menswear"
  * MODERN & TRENDY: "Trendy", "Streetwear", "Y2K", "Acubi", "Balletcore", "Skater", "Hip Hop", "Surf", "Feminine", "Girly", "Glamorous"
  * AESTHETIC SUB-GENRES: "Cottagecore", "Dark Academia", "Soft Girl / Boy", "Artsy", "Bohemian (Boho)", "Ethereal", "Romantic", "Kawaii"
  * EDGY & SUB-CULTURES: "Cyberpunk", "Baddie", "E-Girl", "Emo", "Indie", "Scene", "Lolita", "Maximalist", "Cosplay", "Eclectic", "Avant-Garde", "Tomboy", "Western"
  Ensure that each member of the group gets a completely different style from this list so that the group represents a diverse, high-fashion catalog. Describe the aesthetic nicely (e.g. "Minimalist with a touch of Old Money / Quiet Luxury" or "Trendy Y2K mixed with Streetwear"). DO NOT invent futuristic or sci-fi styles. Keep it grounded and highly realistic.
  CRITICAL: ABSOLUTELY NEVER assign or generate techwear or anything related to it (NO techwear, NO tactical vests, NO combat gear, NO harnesses, NO utility straps, NO chest rigs).

- PRE-DEBUT INFO: You MUST provide detailed, realistic pre-debut activities for this ${isSolo ? 'soloist' : 'member'}. Do not leave this empty. Examples: "Former child actor in [City]", "Contestant on regional survival show [Show Name]", "Trainee at [Previous Agency] for 2 years", "Lead dancer at [City] Youth Dance Academy", "Acoustic cover artist on YouTube with viral following", "Trained in classical piano and contemporary dance in [Birthplace]".

- BIOGRAPHY & TRIVIA RULES (INITIAL CASTING):
  * BIOGRAPHY ("bio" field): Leave as empty string "" for now. Rich, deeply contextualized biographies are generated sequentially with complete group chemistry once all member profiles are cast.
  * COHESIVE CONCEPT BUT HUMANIZED (EXO MODEL): If the group has a specific storyline, universe, or concept (like supernatural powers or celestial motifs), you may mention it subtly as their lore representation (e.g., "In the group's debut storyline, she represents the element of resonance"), BUT their personal pre-debut info, family life, and personality MUST remain 100% grounded, realistic, and human.
  * UNIQUE HABITS (CRITICAL): Every member MUST have 1-2 highly specific, unique, and quirky habits that no one else has. DO NOT reuse habits! Examples: "always falls asleep with wet hair", "eats pizza with honey", "has a habit of blinking rapidly when nervous", "taps their left foot when thinking", "unconsciously pouts when focused", "drinks iced americano even in mid-winter", "talks in their sleep in two languages".
  * CASTING VARIETY (CRITICAL): YOU MUST NOT KEEP SAYING THEY WERE SCOUTED. You MUST randomly vary how they joined the company! Examples: passed a highly competitive global audition in their home city, spotted from a viral TikTok/Instagram dance cover, recommended by a local vocal/dance academy, applied online with a demo tape, competed in a grueling idol survival show, transferred from a global academy, former child actor who pivoted to music, OR street-casted in a unique situation. ENSURE THIS IS DIFFERENT FROM EXISTING MEMBERS.
  * TRIVIA / HOBBIES / PET PEEVES: Give normal everyday things. (e.g., Hobbies: cooking, collecting retro cameras, taking walks at night, playing Nintendo Switch, film photography, brewing filter coffee; Pet peeves: slow Wi-Fi, food being cold, when people chew loudly, getting caught in rain without an umbrella, losing guitar picks).
${getNamingStyleGuide(isSolo, undefined, targetGender)}

VISUAL REQUIREMENTS (For imagePrompt - CRITICAL FOR MAXIMUM COHESION & QUALITY):
- STRICT MEDIUM UPPER-BODY FRAMING (HIPS & WAISTLINE VISIBLE): Every member's profile image MUST be a front-facing medium upper-body portrait showing their full upper body from top of head down past the waistline to the hips / upper waistband (hips clearly visible in the shot). The camera must be at a steady medium distance so the shoulders, chest, full torso, waistline, waistband, and hips are all visible. Do NOT crop as an extreme close-up headshot or cut off above the waist.
- CONCEPT & AESTHETIC-DRIVEN STAGE STYLING (THINK LIKE A K-POP FASHION STYLIST & DIYER): Outfits MUST be custom, high-energy K-pop stage costumes matching the group's concept and color palette.
  * COMPREHENSIVE FASHION TAXONOMY KNOWLEDGE: Utilize a complete understanding of garment types across both women's and men's idol wardrobes:
    - Female Items: Deconstructed crop tops, corset & bustier tops, asymmetric wrap tops, halter cutouts, off-shoulder chiffon blouses, custom graphic tees, cropped hoodies, tie-front shirt tops, pleated tennis skirts, asymmetric wrap skirts, high-waisted cargo shorts, spliced denim skirts/shorts, wide-leg trousers, flared stage pants, athletic rompers, halter bodysuits/onesies, deconstructed jumpsuits, and matching two-piece co-ord sets (e.g., crop hoodie + shorts, blazer + pleated skirt, corset top + wide-leg slacks).
    - Male Items: Asymmetric button-down shirts, deconstructed cropped jackets/bombers, zip-neck racer tees, mock-neck compression tops, collarless double-breasted vests, layered graphic tees, open-collar satin shirts, boxy dress shirts, tailored pleated trousers, cargo track slacks, spliced denim jeans, structured knee-length stage shorts, athletic jumpsuits/onesies, flight-suit rompers, and matching two-piece sets (e.g., cropped zip jacket + track pants, tailored blazer + trouser co-ord, vest + cargo slacks).
  * CREATIVE STYLIST & DIYER DETAILS: Think like an elite K-pop fashion stylist and DIYer! Transform everyday clothing foundation pieces—specific shirt tops & bottoms, matching two-piece co-ord sets, onesies/rompers, cropped hoodies, and button-downs—into stunning stage outfits with creative custom touches (artistic asymmetric cuts, deconstructed necklines/hems, custom fabric trims, subtle pattern mixing, floating satin ribbon ties, silver safety-pin art, chain link hardware, and decorative grommets).
  * CONCEPTUAL AESTHETIC DIRECTIONS FOR INSPIRATION:
    - High-Energy Racing & Moto Vibe: Dynamic color-blocked paneling, deconstructed zip collars, athletic contrast piping, and silver safety-pin/chain hardware on custom shirt tops or matching sets.
    - Preppy Idol Academy Vibe: Tailored cropped blazers, custom button-down shirts, crisp contrast collar trim, neat lapel lines, subtle crest embroidery, and narrow tie/ribbon accents with matching bottoms.
    - Sporty Athletic & Varsity Vibe: Athletic performance paneling, ribbed contrast trims, custom collar cutouts, and contemporary crop-layered matching two-piece sets.
    - Sleek 2-Piece Performance Vibe: Coordinated cropped shirt sets or chic onesies with subtle asymmetric strap accents, structured waists, floating ribbon ties, and clean modern buckles.
    - Urban Biker & Denim Vibe: DIY spliced textured cropped outerwear over structured fitted shirt tops with clean metallic silver hardware and matching bottoms.
    - Tailored Utility & Layered Vibe: Sleek deconstructed vests, double-breasted cropped blazers, and sophisticated collarless shirts with side grommet lacing.
  * STYLISH & BALANCED STAGING: Keep the clothing looking fresh, neat, brand-new, beautiful, and natural for a K-pop idol photoshoot (ages 18-22).
  * AVOID OVERLY EXTRAVAGANT OR DULL EXTREMES: NEVER generate plain default grey undershirts or unstyled basic mall clothes on one hand, and avoid heavy ugly industrial military armor, tactical harnesses, or sci-fi combat gear on the other. Make the outfits BEAUTIFUL, stylish, and high-fashion!
  * COLOR PALETTE DISTRIBUTION:
    Every member of the group MUST have a distinct color distribution scheme from the official palette:
    - Member A: Wears 1 single full color from the official palette as a bold monochromatic piece.
    - Member B: Mixes 2 colors from the official palette in a sleek color-blocked style (e.g. top in Color 1, trim or layer in Color 2).
    - Member C: Incorporates all 3 colors from the official palette (e.g. main piece in Color 1, secondary in Color 2, accents in Color 3).
  * ABSOLUTELY UNIQUE OUTFITS FOR EACH MEMBER: Every member's outfit must have a COMPLETELY DIFFERENT look and silhouette matching their style aesthetic. DO NOT repeat identical clothing for different members.
  * STRICT ANTI-UNIFORM RULE (NEVER WEAR THE SAME TOP OR BOTTOM TYPE ACROSS MEMBERS): Under NO circumstances should members in this group be wearing the same types of shirts and pants, or the same types of tops and bottoms!
    - Every single member in the group lineup MUST wear a DIFFERENT top silhouette (e.g. if one member wears a button-down shirt, NO other member can wear a button-down shirt; others must wear a cropped deconstructed blazer, varsity bomber jacket, brushed mohair cardigan, moto racing blouson, asymmetrical waistcoat vest, waffle henley, cropped hoodie, or rugby polo).
    - Every single member in the group lineup MUST wear a DIFFERENT bottom silhouette (e.g. if one member wears denim jeans, NO other member can wear denim jeans; others must wear fluid double-pleated tailored trousers, 3D baggy cargo skate pants, knife-pleated suiting skort, Bermuda city shorts, raw-hem denim jorts, lightweight parachute track pants, A-line wrap kilt-skort, canvas carpenter pants, or corduroy slacks).
    - The top and bottom combination MUST be completely individualized for each member so the group looks fashion-forward, dynamic, and non-repetitive!
  * The outfits MUST integrate the group's official color palette cleanly and creatively, making the overall group look incredibly cool, coordinated, and stage-ready.
- ULTRA-NATURAL YOUTH LOOK & AGE (CRITICAL - 100% BARE FACE, ZERO MAKEUP, 18-21 YEARS OLD): The idol MUST look like a youthful, fresh-faced, late-teens or early-twenties K-pop star (strictly 18-21 years old). Absolutely ensure they DO NOT look mature or middle-aged. 
  * STRICT 100% BARE-FACE & ZERO MAKEUP RULE: Absolutely NO MAKEUP, NO EYELINER, NO EYESHADOW, NO LIPSTICK, NO BLUSH, NO FOUNDATION MASK, NO COSMETICS. Both male and female idols MUST have a completely bare-faced, clean, raw natural look with 100% natural unadorned skin, natural real eyebrows, natural lip tones, and natural eye depth. The skin must look like real, healthy human skin with natural soft skin texture, visible micro-pores, and natural youthful dewy vibrance. Avoid all artificial, "plastic surgery," "puffy cosmetic filler," "heavy makeup mask," or "waxy/fake CGI" filters.
- MANDATORY EQUAL YOUTHFULNESS FOR ALL NATIONALITIES & ETHNICITIES (CRITICAL BIAS COUNTERMEASURE):
  * ZERO AGING BIAS: Regardless of this member's nationality, race, or country of origin (whether Korean, Japanese, Thai, Filipino, Chinese, Vietnamese, Indonesian, Indian, Kazakh, Caucasian, Black, Hispanic, or Multiracial), ALL members MUST look equally youthful, fresh-faced, and 18-21 years old.
  * Under NO circumstances should non-Korean members look older, mature, weathered, or middle-aged compared to Korean members!
  * In the 'distinctFacialFeatures' field, you MUST describe youthful, vibrant, fresh idol features (e.g., youthful soft cheek volume, plump natural lips, bright expressive eyes, smooth facial contours, delicate beauty mark).
  * ABSOLUTELY FORBIDDEN IN 'distinctFacialFeatures': NEVER write "smile lines", "laugh lines", "nasolabial folds", "deep-set mature eyes", "prominent aged bone structure", "hollow cheeks", or "weathered features". Every member must have smooth, youthful, collagen-rich skin with rookie idol freshness.
- MEMBER DISTINCT FACIAL FEATURES & ETHNIC AUTHENTICITY (ACROSS ALL REGIONS & NATIONALITIES):
  * You MUST define highly detailed youthful "distinctFacialFeatures" that avoid the repetitive 'AI face'. Describe distinct facial shapes (e.g. soft-angled youthful jawline, heart-shaped, clean-cut youthful jaw, natural oval, soft round cheeks, prominent cheekbones, delicate jaw), realistic eye shapes (e.g. sharp cat-like monolid eyes, warm round puppy hooded eyes, bright expressive almond eyes, long thick lashes, almond-shaped double eyelids), specific lip shapes (e.g. prominent cupid's bow, plump natural lips, thin elegant lips), nose features (e.g. small button nose, tall elegant bridge, defined bridge, soft nose tip), and other natural characteristics like dimples or beauty marks.
  * Every generated member MUST look completely visually distinct, authentically reflecting their specific country/ethnicity across East, Southeast, South, Central, or West Asia and global regions, while looking undeniably like a radiant, young 18-21 year old K-pop idol.
  * EYE COLOR: Define their precise natural eye color ("eyeColor", e.g. "deep charcoal black", "espresso brown", "dark brown", "warm amber", "hazel brown", "deep chocolate"). Asian idols across different regions display beautiful variations of charcoal, brown, amber, and hazel tones.
- HAIR LENGTH & STYLING VARIETY (EXTENSIVE DIVERSITY FOR BOTH FEMALES AND MALES - NEVER BE AFRAID OF VARYING LENGTHS):
  * MANDATORY EXPANDED LENGTH SPECTRUM: You MUST NOT restrict female idols or male idols to narrow stereotypical lengths. Freely vary lengths across all members:
    - FEMALE HAIR LENGTH SPECTRUM:
      1. Ultra-Short / Pixie: Textured boyish crop, spiky chic pixie cut, sleek tapered pixie with side-swept bangs, buzz cut with micro-fringe.
      2. Short / Bobs: Chin-length blunt bob, French bob with air bangs, asymmetrical angled bob, choppy neck-length textured bob, 90s layered bob, ear-length micro-bob.
      3. Medium / Shoulder & Collarbone: Shoulder-length lob, collarbone-length layered shag, mid-length wolf cut with curtain bangs, pageboy cut with wispy bangs, choppy layered midi-cut.
      4. Long / Mid-Back: Long cascading soft waves, layered blowout falling to the mid-back, classic straight long hair with middle part, high sleek ponytail.
      5. Extra-Long / Waist & Hip-Length: Cascading mermaid curls reaching the waist, sleek liquid hip-length straight hair, long twin braided extensions, ultra-long half-up hair.
    - MALE HAIR LENGTH SPECTRUM:
      1. Ultra-Short / Fades: Clean crew cut, textured buzz cut with bleached tips, military high-and-tight fade, sharp caesar cut with micro bangs.
      2. Short / Classic K-pop: Textured two-block cut with parted fringe, classic comma hair, dandy cut with soft layers, textured crop with airy bangs.
      3. Medium / Ear, Jaw & Neck-Length: Ear-length curtain bangs, chin-length shaggy bob, neck-skimming layered wolf cut, modern mullet shag with feathered nape, textured soft wave bob, leaf perm falling to the cheekbones.
      4. Long / Shoulder-Length: Shoulder-length rockstar waves, layered wolf cut falling past the collarbones, sleek shoulder-length bob with center part, half-up man bun with loose face-framing strands.
      5. Extra-Long / Mid-Back & Ponytail: Flowing mid-back layered locks, long high samurai ponytail, braided dreadlocks/cornrows, chest-length textured waves.
  * ZERO REPETITION: Every member must have a completely unique hair silhouette, texture (straight, wavy, curly, coily, textured, crimped), and length.
- HAIR COLOR FREEDOM & RICH PALETTE (NATURAL HAIR vs ANY DYE / HIGHLIGHT TECHNIQUE):
  * COMPLETE FREEDOM & RICH VARIETY: You can choose to have a member KEEP THEIR NATURAL HAIR COLOR or style it with ANY dynamic coloring method (full dye, highlights, balayage, ombre, peek-a-boo, split dye, money piece, frosted tips, or halo accents).
  * BALANCED GROUP DISTRIBUTION: In any K-pop group, ensure a natural, organic balance across members. A realistic group features a blend where some members retain their beautiful natural dark/black/brown hair, while others showcase statement dyes, highlights, or accent techniques!
  * FREELY CHOOSE AND MIX FROM ANY OF THESE AUTHENTIC APPROACHES:
    1. KEEP NATURAL ORIGINAL HAIR COLOR (100% UN-DYED & ELEGANT):
       - "none, kept natural jet black"
       - "none, kept natural dark espresso brown"
       - "none, kept natural deep chocolate brown"
       - "none, kept natural soft charcoal"
    2. FULL SOLID FASHION DYE:
       - e.g., "fully dyed platinum ice-blonde", "fully dyed rich cherry burgundy", "fully dyed warm copper ginger", "fully dyed pastel lavender-violet", "fully dyed honey ash brown", "fully dyed electric cobalt blue", "fully dyed rose gold", "fully dyed smoky ash grey".
    3. HIGHLIGHTS, LOWLIGHTS & FACE-FRAMING ACCENTS:
       - e.g., "chunky caramel brown highlights scattered across espresso hair", "bleached platinum blonde face-framing money piece", "subtle honey babylights adding soft dimension", "frosted silver halo streaks", "golden amber ribbon highlights".
    4. PEEK-A-BOO & HIDDEN UNDERDYE:
       - e.g., "hidden peek-a-boo pastel lilac dye underneath natural dark chocolate hair", "peek-a-boo platinum silver underlayer visible when hair moves", "electric sapphire blue underdye under midnight black".
    5. TWO-TONE & SPLIT DYE:
       - e.g., "vertical split dye with soft pastel pink on the left and natural black on the right", "horizontal two-tone with ash blonde upper canopy and dark charcoal underlayer", "two-tone ginger-orange and mocha brown split".
    6. OMBRE, BALAYAGE & DIP-DYED TIPS:
       - e.g., "seamless root melt from natural espresso roots fading into smoky ash blonde tips", "dip-dyed vibrant cherry red ends on soft black waves", "caramel honey balayage fading naturally toward the ends".
    7. EXPERIMENTAL & AVANT-GARDE COLOR CONCEPTS:
       - e.g., "holographic prism-melt blending pastel lavender, rose gold, and soft peach", "frosted tips in metallic silver over a textured dark crop", "airbrushed metallic rose-gold stenciled accents".
  * ZERO UNREQUESTED REPETITION: Check existing members' colors and ensure every member has a distinct, individual hairstyle and color approach. DO NOT default everyone to mint/green or bob cuts.
- ORIGINAL HAIR: Also include their natural, original hair type (e.g., "1A Straight", "2B Wavy", "3C Curly", "4A Coily") and original natural hair color before any dye.
- GENDER/APPEARANCE ALIGNMENT (CRITICAL): The visual appearance MUST perfectly match a ${groupTypeInstruction} idol. If it's a Boy Group, they must look undeniably male. If a Girl Group, female.
- SKIN DIVERSITY & SKIN TONE SPECTRUM: Match their natural birthplace and heritage across Asia and the world, providing realistic skin textures. For the 'skinTone' field, you MUST provide BOTH the casual term and the technical term covering the complete spectrum (e.g., "fair (Fitzpatrick Type II)", "tan (Fitzpatrick Type IV)", "warm honey (Fitzpatrick Type III)", "golden olive (Fitzpatrick Type IV)", "pale porcelain (Fitzpatrick Type I)", "rich bronze (Fitzpatrick Type V)", "deep caramel (Fitzpatrick Type V)", "rich golden brown (Fitzpatrick Type VI)").
- ETHNICITY & DEMOGRAPHIC ACCURACY WITH EQUAL YOUTHFULNESS: When generating the image prompt, ensure their facial features accurately reflect their specific ethnicity (e.g., Filipino, Indian, Thai, Vietnamese, Indonesian, Kazakh, Korean, Japanese, Chinese, Turkish) combined with their specific skin tone, while strictly maintaining the EXACT SAME 18-21 year old rookie idol youthfulness, smooth skin, and vibrant facial fullness as Korean idols. Under no circumstances should non-Korean idols look older or mature.
- STYLE: NO 3D, NO ANIMATED, NO CGI. Hyper-realism only!
- Prompt format: "A hyper-realistic front-facing medium upper-body portrait (framed from head down to hips with hips and waistline clearly visible in the shot) of a real [ETHNICITY] ${groupTypeInstruction} K-pop idol with [SKIN TONE] skin and [EYE COLOR] eyes, named [STAGE NAME] who is a youthful 18-21 years old, styled with the upper body and hips visible, completely bare-faced with 100% natural unadorned skin, ZERO makeup, NO eyeliner, NO eyeshadow, NO lipstick, NO blush, NO face cosmetics, displaying authentic raw human skin texture with natural skin pores and a healthy natural skin glow, having [DISTINCT FACIAL FEATURES - YOUTHFUL ONLY, ZERO AGING LINES] with completely natural, organic, and proportional facial structures, wearing a stylish custom [HAIRSTYLE] in [UNIQUE HAIR COLOR], dressed in a custom, original coordinated debut stage outfit (Style: [GENRE/CONCEPT OUTFIT STYLE]) styled in the group's unified official brand palette ([COLOR NAME] [HEX CODE] [VISUAL COLOR SHADE]) matched to their [FASHION SUBCULTURE] style, solid plain light grey background with hex code #D1D5DB, pristine studio photography. STRICT CAMERA FRAMING: Medium upper-body shot from head down to hips with waistline and hips clearly visible. Absolutely NO tactical gear, military straps, harnesses, chest rigs, or combat clothing. ABSOLUTELY NO MAKEUP, NO COSMETICS, NO EYELINER, NO EYESHADOW, NO LIPSTICK, COMPLETELY BARE-FACED REAL HUMAN FACE. EQUAL YOUTHFULNESS ACROSS ALL ETHNICITIES: Their facial features, youthful bone structure, and eyes MUST look organic, energetic, young, and strictly match their [ETHNICITY] ethnicity, looking like a real-world K-pop idol in their early 20s (DO NOT make them look mature, middle-aged, or artificial/plastic-looking like a CGI/wax figure with heavy cosmetic modifications; ZERO wrinkles, ZERO smile lines, ZERO hollow cheeks). NO JEWELRY, NO NECKLACES, NO EARRINGS, NO BRACELETS, NO RINGS, ABSOLUTELY NO JEWELRY."

Output (STRICT JSON FORMAT):
{
  "member": {
    "stageName": "string",
    "stageNamePronunciation": "string (Phonetic spelling, e.g. 'min-jun' or 'jee-woo')",
    "fullNameKorean": "string",
    "fullNameRomanized": "string",
    "realNamePronunciation": "string (Phonetic spelling of full real name, e.g. 'KIM JEE-WOO')",
    "dateOfBirth": "YYYY-MM-DD",
    "placeOfBirth": "string",
    "heightCM": number,
    "weightKG": number,
    "bloodType": "string",
    "zodiacSign": "string",
    "mbti": "string",
    "trainingPeriod": "string",
    "representativeEmoji": "string",
    "representativeAnimal": "string",
    "positions": ["string"],
    "stats": { "vocal": 1-10, "dance": 1-10, "rap": 1-10, "visual": 1-10 },
    "bio": "string",
    "talents": ["string"],
    "preDebutActivities": "string",
    "hobbies": ["string"],
    "roleModels": ["string"],
    "petPeeves": ["string"],
    "personalFashionStyle": "string",
    "favoriteColors": ["string"],
    "race": "string (e.g., 'Asian (Filipino)' or 'Asian (Indian)' or 'Asian (Korean)')",
    "skinTone": "string (e.g., 'warm honey (Fitzpatrick Type III)' or 'fair (Fitzpatrick Type II)')",
    "eyeColor": "string (e.g., 'deep charcoal black' or 'dark espresso brown')",
    "distinctFacialFeatures": "string (e.g. 'expressive almond eyes, defined cheekbones, natural warm smile lines')",
    "originalHairColor": "string",
    "originalHairType": "string (e.g., '2B Wavy (Loose waves)')",
    "dyedHairColor": "string (The hair color for this debut concept, e.g. 'none, kept natural jet black' or 'chunky caramel highlights over espresso hair' or 'fully dyed platinum ice-blonde' or 'peek-a-boo pastel lilac under natural black')",
    "currentHairStyle": "string (The hairstyle for this debut concept, e.g. 'high sleek ponytail with face-framing pieces' or 'textured comma hair middle part')",
    "imagePrompt": "string",
    "socialMedia": { "instagram": "@string", "tiktok": "@string" }
  }
}
`;
}

export const generateGroupOverview = async (userInput: UserInput, existingName?: string): Promise<GroupProfileData & { groupType: GroupType, generation?: KpopGeneration, sources?: GroundingSource[] }> => {
  const groupPrompt = createGroupOverviewPrompt(userInput, existingName);
  const { data: groupData, sources } = await generateKpopGroupData<Omit<GroupProfileData, 'discography'>>(groupPrompt);

  if (!groupData.groupName || !groupData.conceptDescription || !groupData.simulationMetrics || !groupData.fandom) {
    throw new Error("AI failed to generate sufficient group data.");
  }

  const isSolo = isSoloArtist(userInput.groupType);

  // Strictly enforce authentic K-pop greeting format and ban AI clichés
  if (groupData.greeting) {
    groupData.greeting.motto = sanitizeKpopGreeting(groupData.greeting.motto, groupData.groupName, isSolo);
    groupData.greeting.gesture = sanitizeKpopGesture(groupData.greeting.gesture, groupData.groupName, isSolo);
  } else {
    groupData.greeting = {
      motto: sanitizeKpopGreeting(undefined, groupData.groupName, isSolo),
      gesture: sanitizeKpopGesture(undefined, groupData.groupName, isSolo)
    };
  }

  return {
    ...groupData,
    discography: [],
    sources,
    groupType: userInput.groupType,
    generation: userInput.generation
  } as any;
};

export const generateSingleAlbum = async (groupProfile: GroupProfileData & { generation?: string }, existingAlbums: Album[], groupType: string, memberCount: number = 5): Promise<Album> => {
  const isSolo = isSoloArtist(groupType) || memberCount === 1;
  const artistGender = detectArtistGender(groupType, groupProfile.conceptDescription, groupProfile.members?.[0]?.gender);
  const existingTitles = existingAlbums.map(a => a.title).join(', ');
  const prompt = createSingleAlbumPrompt(groupProfile.groupName, groupProfile.conceptDescription, existingTitles, groupType, groupProfile.generation, isSolo ? 1 : memberCount, groupProfile.fandom?.name);
  let { data } = await generateKpopGroupData<{ album: Album }>(prompt);
  
  let attempts = 0;
  while (data?.album?.tracks && attempts < 2) {
    const hasCringe = data.album.tracks.some(t => {
      if (hasCringeLyrics(t.lyricExcerpt)) return true;
      if (isSolo && checkSoloistLyricViolations(t.lyricExcerpt, artistGender).hasViolation) return true;
      return false;
    });
    if (!hasCringe) break;
    
    console.log(`Lyric Quality Check failed for Album, retrying... (${attempts + 1}/2)`);
    const retryPrompt = prompt + "\n\n" + (isSolo ? SOLOIST_LYRIC_RETRY_PROMPT : LYRIC_RETRY_PROMPT);
    const retryResult = await generateKpopGroupData<{ album: Album }>(retryPrompt);
    data = retryResult.data;
    attempts++;
  }

  if (data?.album?.tracks) {
    data.album.tracks = data.album.tracks.map(t => ensureTrackMetadata(t, groupProfile.groupName, groupProfile.conceptDescription, isSolo));
  }
  
  return data?.album;
};

export const generateSingleMember = async (
  userInput: UserInput, 
  groupProfile: GroupProfileData, 
  existingMembers: MemberProfileData[],
  replacedMember?: MemberProfileData
): Promise<MemberProfileData> => {
  const existingDetails = existingMembers.map(m => {
    return "- " + m.stageName + " (Gender: " + (m.gender || (userInput.groupType === 'Boy Group' ? 'Male' : (userInput.groupType === 'Girl Group' ? 'Female' : 'Unknown'))) + ", FullName: " + (m.fullNameRomanized || "") + ", Race: " + (m.race || "") + ", Dyed/Concept Hair Color: " + (m.dyedHairColor || m.originalHairColor || "") + ", Current Concept Hair Style: " + (m.currentHairStyle || "") + ", Original Natural Hair Color: " + (m.originalHairColor || "") + ", Skin Tone: " + (m.skinTone || "") + ", Fashion Style: " + (m.personalFashionStyle || "") + ", Positions: [" + (m.positions ? m.positions.join(', ') : "") + "])";
  }).join('\n') || 'None yet';

  const prompt = createSingleMemberPrompt(
    userInput.groupType,
    groupProfile.conceptDescription,
    groupProfile.groupName,
    existingDetails,
    existingMembers,
    replacedMember
  );
  
  const { data } = await generateKpopMembersData<{ member: MemberProfileData }>(prompt);
  let member = data?.member;

  if (!member) throw new Error("Failed to generate member data.");

  // Guarantee non-repetition of stage names and real names against existing members
  const existingStageNames = new Set(existingMembers.map(m => (m.stageName || '').trim().toLowerCase()));
  const existingRealNames = new Set(existingMembers.map(m => (m.fullNameRomanized || '').trim().toLowerCase()));
  if (replacedMember) {
    if (replacedMember.stageName) existingStageNames.add(replacedMember.stageName.trim().toLowerCase());
    if (replacedMember.fullNameRomanized) existingRealNames.add(replacedMember.fullNameRomanized.trim().toLowerCase());
  }

  // Safety fallback for gender if AI omitted it
  let memberGender = member.gender;
  if (!memberGender) {
    if (userInput.groupType === 'Boy Group' || userInput.groupType === 'Male Soloist') memberGender = 'Male';
    else if (userInput.groupType === 'Girl Group' || userInput.groupType === 'Female Soloist') memberGender = 'Female';
    else if (isSoloArtist(userInput.groupType)) {
      memberGender = detectArtistGender(userInput.groupType, userInput.conceptKeywords);
    } else {
      const maleCount = existingMembers.filter(m => (m.gender || '').toLowerCase() === 'male').length;
      const femaleCount = existingMembers.filter(m => (m.gender || '').toLowerCase() === 'female').length;
      memberGender = maleCount > femaleCount ? 'Female' : 'Male';
    }
  }

  return { 
    ...member, 
    gender: memberGender,
    bio: member.bio || "",
    imageUrl: undefined,
    heightCM: Number(member.heightCM) || 170, 
    weightKG: Number(member.weightKG) || 55 
  };
};

export const generateMemberBiography = async (
  member: MemberProfileData,
  groupProfile: GroupProfileData,
  allMembers: MemberProfileData[],
  groupType?: GroupType | string,
  existingBio?: string
): Promise<string> => {
  const isSolo = isSoloArtist(groupType);
  const memberGender = member.gender || (
    groupType === 'Male Soloist' || groupType === 'Boy Group' ? 'Male' :
    groupType === 'Female Soloist' || groupType === 'Girl Group' ? 'Female' :
    detectArtistGender(groupType, groupProfile.conceptDescription)
  );
  const pronouns = memberGender === 'Male' ? 'he/him/his' : 'she/her/hers';

  const otherMembersList = allMembers
    .filter(m => m.stageName !== member.stageName)
    .map(m => `- ${m.stageName} (Gender: ${m.gender || 'Unknown'}, Positions: ${m.positions?.join(', ') || 'Member'}, Hometown: ${m.placeOfBirth || 'Unknown'}, Trainee Period: ${m.trainingPeriod || '3 years'})`)
    .join('\n') || 'None (Soloist or sole member)';

  const prompt = `
You are the master narrative writer and creative director for a top-tier global K-pop entertainment company.
Write an authentic, deeply believable, humanized, and highly engaging 2-to-3 paragraph biography for the K-pop ${isSolo ? `${memberGender} Solo Artist` : 'idol'} "${member.stageName}".

${isSolo ? 'SOLO ARTIST PROFILE DETAILS:' : 'IDOL PROFILE DETAILS:'}
- Stage Name: ${member.stageName} (Pronunciation: ${member.stageNamePronunciation || member.stageName})
- Gender: ${memberGender} (${pronouns})
- Real Full Name: ${member.fullNameRomanized || member.stageName} (${member.fullNameKorean || ''})
- Birthdate & Age: ${member.dateOfBirth || '2004-01-01'} (Youthful ${memberGender.toLowerCase()} idol in early 20s)
- Birthplace / Hometown: ${member.placeOfBirth || 'Hometown'}
- Ethnicity / Heritage: ${member.race || 'Asian'}
- Positions / Artistry: ${isSolo ? (member.positions?.join(', ') || 'Soloist, Vocalist, Performer') : (member.positions?.join(', ') || 'Vocalist, Dancer')}
- Training Period: ${member.trainingPeriod || '3 years'}
- MBTI & Zodiac: MBTI ${member.mbti || 'ENFP'}, Zodiac ${member.zodiacSign || 'Capricorn'}
- Pre-Debut Activities: ${member.preDebutActivities || 'Trained in regional academy'}
- Notable Talents: ${member.talents?.join(', ') || 'Vocal harmonization, expressive stage dance'}
- Hobbies & Quirks: ${member.hobbies?.join(', ') || 'Film photography, late-night walks'}
- Role Models & Pet Peeves: Role Models: ${member.roleModels?.join(', ') || 'Iconic vocalists'}, Pet Peeves: ${member.petPeeves?.join(', ') || 'Cold food, slow internet'}
- Personal Fashion Style: ${member.personalFashionStyle || 'Casual chic'}
- Distinct Facial Features: ${member.distinctFacialFeatures || 'Warm expressive eyes'}

${isSolo ? 'ARTIST CONTEXT & BRANDING:' : 'GROUP & TEAM CONTEXT:'}
- ${isSolo ? 'Artist Stage Name' : 'Group Name'}: ${groupProfile.groupName} (${isSolo ? `${memberGender} Soloist` : (groupType || 'K-pop Group')})
- Concept & Universe: "${groupProfile.conceptDescription || 'High-fashion modern K-pop'}"
- Debut Album Theme: "${groupProfile.discography?.[0]?.title || 'Debut Album'}" (${groupProfile.discography?.[0]?.conceptSummary || 'Empowering debut'})
- Agency: ${groupProfile.agency || 'Global Music Entertainment'}
- Fandom Name: ${groupProfile.fandom?.name || 'Fans'}
${!isSolo ? `- All Other Members in the Lineup:\n${otherMembersList}` : '- Act Type: Solo Artist (Performs completely individually)'}
${existingBio ? `
PREVIOUS BIOGRAPHY REFERENCE & HARMONIZATION DIRECTIVE:
Existing Biography:
"""
${existingBio}
"""
CONTINUITY INSTRUCTION:
Preserve this ${isSolo ? 'artist\'s' : 'member\'s'} core childhood upbringing, musical roots, and pre-debut audition story from their profile/previous biography${!isSolo ? `, but actively rewrite and update their trainee memories, dorm dynamics, and team interactions so they seamlessly align with the current lineup and newly cast teammates (${allMembers.map(m => m.stageName).join(', ')})` : ''}.
` : ''}
BELIEVABLE CHRONOLOGICAL NARRATIVE RULES (STRICTLY 2 TO 3 RICH, BEAUTIFULLY FLOWING PARAGRAPHS):
1. PARAGRAPH 1 (CHILDHOOD, UPBRINGING & MUSICAL AWAKENING):
   Introduce ${member.stageName}'s early life growing up in ${member.placeOfBirth}. Describe their childhood atmosphere, family background, musical influences (e.g., classical piano, guitar, acoustic covers, school choir, dance crew, athletic background), and the pivotal artist, song, or concert experience that sparked their dream to become a performer.

${isSolo ? `2. PARAGRAPH 2 (SOLO TRAINEE PATH, INDIVIDUAL RIGOR & ALL-ROUNDER DISCIPLINE):
   Detail their authentic casting story (${member.preDebutActivities}) and training in Seoul. Chronicle their ${member.trainingPeriod} trainee era—the intense daily practice routines as an all-rounder soloist who must master vocals, dance, and stage presence simultaneously without the safety net of group members. Highlight their monthly evaluations and personal perseverance.

3. PARAGRAPH 3 (SOLO ARTISTRY, STAGE DOMINANCE & CHARISMA):
   Explain the singular vocal color, dance command, and individual magnetism ${member.stageName} brings to their solo releases under "${groupProfile.groupName}". Highlight their personal connection with their fandom (${groupProfile.fandom?.name || 'Fans'}), their passion for their craft, and cute, endearing off-stage habits and quirks (${member.hobbies?.[0] || 'quirky daily habits'}).` : `2. PARAGRAPH 2 (AUDITION JOURNEY, TRAINEE HARDSHIPS & SISTERHOOD/BROTHERHOOD):
   Detail their authentic casting story (${member.preDebutActivities}) and moving to the trainee dorms in Seoul. Chronicle their ${member.trainingPeriod} trainee era—the intense daily practice routines, overcoming vocal or dance plateaus, foreign language or cultural adaptations (if international), monthly evaluation pressures, and the deep emotional bonds formed with fellow trainees and future group members during late-night practice sessions.

3. PARAGRAPH 3 (TEAM ROLE, GROUP CHEMISTRY, DORM DYNAMICS & QUIRKY CHARM):
   Explain the unique vocal color, dance charisma, or stage energy ${member.stageName} brings to "${groupProfile.groupName}". Mention their role in the dorms and organic dynamic with other members (naturally mention other group members by stage name, dorm roommates, or team roles where fitting), meaningful nicknames given by members or fans, and cute, endearing real-world habits (${member.hobbies?.[0] || 'quirky daily habits'}).`}

STRICT CONSTRAINTS:
- Use correct pronouns (${pronouns}).
- NO SCI-FI, ROBOTIC, OR AI WORDS ('glitch', 'cyber', 'matrix', 'synthesizer', 'protocol', 'vanguard', 'dimension', 'hacker', 'corrupted').
- Keep the narrative 100% human, grounded, credible, and engaging.
- Separate paragraphs with double newlines (\\n\\n).

Output (STRICT JSON FORMAT):
{
  "bio": "string (The complete 2-to-3 paragraph biography text)"
}
`;

  const { data } = await generateKpopMembersData<{ bio: string }>(prompt);
  return data?.bio || "";
};

export function createProfileFromPdfTextPrompt(pdfText: string): string {
  return `Create an ORIGINAL lore-driven K-pop profile from this text. Ensure NO existing idol names and a simple, iconic group meaning. TEXT: ${pdfText.substring(0, 5000)}`;
}

export const regenerateOfficialColors = async (
  groupName: string,
  conceptDescription: string,
  groupType: GroupType | string,
  currentColors?: OfficialColor[]
): Promise<OfficialColor[]> => {
  const currentHexes = new Set((currentColors || []).map(c => c.hex?.toUpperCase().trim()));
  const currentNames = new Set((currentColors || []).map(c => c.name?.toLowerCase().trim()));

  // Attempt 1: Call Gemini to generate a truly bespoke, concept-aligned and fresh palette!
  const currentAvoidList = (currentColors || []).map(c => `${c.name} (${c.hex})`).join(', ');
  const randomSeed = Math.random().toString(36).substring(2, 8);
  const randomUniverse = COLOR_AESTHETIC_UNIVERSES[Math.floor(Math.random() * COLOR_AESTHETIC_UNIVERSES.length)];

  const aiPrompt = `You are an elite K-pop visual director and branding architect.
Generate 2 or 3 completely NEW, highly aesthetic, vibrant, and coordinated official fandom colors for this K-pop artist:
Artist / Group: "${groupName}"
Concept & Lore: "${conceptDescription}"
Visual Universe Inspiration: "${randomUniverse.theme}" (${randomUniverse.vibe})
Randomization Seed: [${randomSeed}]

STRICT RULES:
- DO NOT USE ANY OF THESE PREVIOUS/CURRENT COLORS: [${currentAvoidList || 'None'}]
- ABSOLUTELY NO REPETITIVE AI CLICHÉS: Do NOT return "Velvet Orchid + Cyber Lavender", "Midnight Indigo + Electric Cobalt", or plain "Navy + Gold".
- NEVER generate dull corporate or safe office colors (like plain navy blue, boring dark green, standard gray, safe maroon, or plain royal blue).
- Think of iconic, stylish K-pop fandom colors: imaginative, poetic names, exact hex codes, and vivid visual descriptions.

STRICT JSON OUTPUT:
{
  "officialColors": [
    { "name": "string (Creative, poetic K-pop color name)", "hex": "#HEXCODE", "description": "string (Vivid 3-7 word description)" }
  ]
}`;

  try {
    const { data } = await generateKpopGroupData<{ officialColors: OfficialColor[] }>(aiPrompt);
    if (data && Array.isArray(data.officialColors) && data.officialColors.length >= 2) {
      const valid = data.officialColors.filter(c => c.name && c.hex && c.hex.startsWith('#'));
      const isFresh = valid.some(c => !currentHexes.has(c.hex.toUpperCase().trim()));
      if (valid.length >= 2 && isFresh) {
        return valid.slice(0, 3);
      }
    }
  } catch (err) {
    console.warn("AI color generation skipped or failed, falling back to expanded curated master taxonomy:", err);
  }

  // Vast master taxonomy of 60+ distinct, iconic K-pop aesthetic palettes across all 16 visual archetypes
  const curatedPalettes: OfficialColor[][] = [
    // 1. High-Teen Sweet Pastel
    [
      { name: "Buttercream Glow", hex: "#FDE047", description: "Warm youthful custard yellow" },
      { name: "Baby Periwinkle", hex: "#818CF8", description: "Soft dreamy pastel blue" },
      { name: "Strawberry Silk", hex: "#F472B6", description: "Cheery blush pink" }
    ],
    [
      { name: "Peach Macaron", hex: "#FDBA74", description: "Sweet bakery peach" },
      { name: "Sky Mint", hex: "#6EE7B7", description: "Refreshing milky spearmint" }
    ],
    [
      { name: "Vanilla Custard", hex: "#FEF08A", description: "Gentle sunny cream" },
      { name: "Lilac Chiffon", hex: "#DDD6FE", description: "Airy fairy purple" }
    ],

    // 2. Cyberpunk Acid Pop & High-Voltage Neon
    [
      { name: "Electric Citron", hex: "#CCFF00", description: "High-voltage acid lime" },
      { name: "Cyber Magenta", hex: "#FF007F", description: "Ultraviolet neon punch" },
      { name: "Deep Space Slate", hex: "#0F172A", description: "Midnight stealth contrast" }
    ],
    [
      { name: "Laser Aqua", hex: "#00F0FF", description: "Pure luminescent cyan" },
      { name: "Obsidian Pitch", hex: "#18181B", description: "Matte carbon darkness" }
    ],
    [
      { name: "Volt Chartreuse", hex: "#84CC16", description: "Kinetic neon green" },
      { name: "Gunmetal Smoke", hex: "#27272A", description: "Industrial deep graphite" }
    ],

    // 3. Royal Velvet & Metallic Champagne
    [
      { name: "Imperial Cobalt", hex: "#1D4ED8", description: "Regal electric sapphire" },
      { name: "Gilded Champagne", hex: "#FCD34D", description: "Luminous pale gold" },
      { name: "Obsidian Velvet", hex: "#0F172A", description: "Opulent midnight black" }
    ],
    [
      { name: "Deep Royal Plum", hex: "#581C87", description: "Aristocratic velvet purple" },
      { name: "Burnished Brass", hex: "#EAB308", description: "Gleaming warm metallic" }
    ],
    [
      { name: "Smoky Emerald", hex: "#065F46", description: "Deep jewel forest green" },
      { name: "Antique Pearl", hex: "#FEF3C7", description: "Warm aristocratic silk cream" }
    ],

    // 4. Sunset Horizon & Peach Coral
    [
      { name: "Apricot Nectar", hex: "#FB923C", description: "Warm golden hour peach" },
      { name: "Dusk Hydrangea", hex: "#6366F1", description: "Twilight lavender periwinkle" },
      { name: "Sea Salt Mist", hex: "#F8FAFC", description: "Clean horizon white" }
    ],
    [
      { name: "Sunkissed Coral", hex: "#FF6B6B", description: "Vibrant tropical sunset" },
      { name: "Oceanic Twilight", hex: "#1E293B", description: "Deep coastal navy" }
    ],

    // 5. Dark Cherry Wine & Smoked Noir
    [
      { name: "Spiced Bordeaux", hex: "#881337", description: "Rich gothic burgundy ruby" },
      { name: "Antique Ivory", hex: "#FEF3C7", description: "Delicate aged parchment" },
      { name: "Smoked Graphite", hex: "#334155", description: "Nocturnal velvet shadow" }
    ],
    [
      { name: "Black Cherry Cordial", hex: "#4A044E", description: "Deep intoxicating plum" },
      { name: "Silver Moonlight", hex: "#E2E8F0", description: "Pale luminescent grey" }
    ],

    // 6. Glacial Prism & Aurora Hologram
    [
      { name: "Frostbite Cyan", hex: "#38BDF8", description: "Icy polar glacial crystal" },
      { name: "Holographic Quartz", hex: "#C084FC", description: "Iridescent prism violet" },
      { name: "Polar Titanium", hex: "#F1F5F9", description: "Pristine reflective silver" }
    ],
    [
      { name: "Boreal Shimmer", hex: "#2DD4BF", description: "Aurora Borealis seafoam" },
      { name: "Deep Glacial Fjord", hex: "#0C4A6E", description: "Sub-zero oceanic depth" }
    ],

    // 7. Earthy Retro Botanical & Warm Terracotta
    [
      { name: "Forest Moss", hex: "#15803D", description: "Lush botanical velvet green" },
      { name: "Baked Terracotta", hex: "#C2410C", description: "Warm 70s clay orange" },
      { name: "Raw Linen", hex: "#FAFAF9", description: "Natural warm neutral" }
    ],
    [
      { name: "Olive Glaze", hex: "#65A30D", description: "Earthy modern green" },
      { name: "Roasted Pecan", hex: "#78350F", description: "Rich vintage wood warmth" }
    ],

    // 8. Graphic Minimalist Monochrome & Signal Red
    [
      { name: "Signal Crimson", hex: "#DC2626", description: "Striking runway scarlet red" },
      { name: "Pitch Jet", hex: "#09090B", description: "Ultra-matte deepest black" },
      { name: "Pure Titanium", hex: "#FFFFFF", description: "Sterile optical white" }
    ],
    [
      { name: "Vermilion Flame", hex: "#EA580C", description: "High-impact editorial blaze" },
      { name: "Carbon Core", hex: "#18181B", description: "Sleek industrial black" }
    ],

    // 9. Dreamy Twilight Amethyst & Deep Navy
    [
      { name: "Electric Amethyst", hex: "#8B5CF6", description: "Vibrant supernatural violet" },
      { name: "Dusky Periwinkle", hex: "#A5B4FC", description: "Soft midnight cloud tone" },
      { name: "Abyssal Midnight", hex: "#172554", description: "Deep cosmic horizon" }
    ],
    [
      { name: "Starry Neon Blue", hex: "#2563EB", description: "Pulsing galaxy cobalt" },
      { name: "Lilac Haze", hex: "#C4B5FD", description: "Ethereal foggy pastel" }
    ],

    // 10. Citrus Tonic & Oceanic Marine Teal
    [
      { name: "Tangelo Zest", hex: "#F97316", description: "Energetic festival orange" },
      { name: "Marine Seafoam", hex: "#0D9488", description: "Deep refreshing tropical teal" },
      { name: "Salted Froth", hex: "#F0FDFA", description: "Breezy ocean cream" }
    ],
    [
      { name: "Lime Tonic", hex: "#A3E635", description: "Sparkling fizzy citrus" },
      { name: "Pacific Azure", hex: "#0284C7", description: "Vivid clear reef blue" }
    ],

    // 11. Rose Gold & Midnight Velvet
    [
      { name: "Dusty Rose Quartz", hex: "#FB7185", description: "Romantic metallic blush" },
      { name: "Midnight Plum", hex: "#581C87", description: "Velvety nocturnal shade" },
      { name: "Starlight Chiffon", hex: "#FFF1F2", description: "Soft petal glow" }
    ],

    // 12. Y2K Gloss Chrome & Electric Bubblegum
    [
      { name: "Cyber Bubblegum", hex: "#EC4899", description: "Glossy millennium pop pink" },
      { name: "Chrome Glaze", hex: "#94A3B8", description: "Metallic liquid silver" },
      { name: "Optic Aqua", hex: "#06B6D4", description: "Vivid cyber water" }
    ],

    // 13. Matcha Mist & Blossom Silk
    [
      { name: "Matcha Mist", hex: "#86EFAC", description: "Zen herbal pastel green" },
      { name: "Blossom Silk", hex: "#FBCFE8", description: "Delicate spring petal pink" },
      { name: "Rice Paper Ivory", hex: "#FEFCE8", description: "Calm organic warmth" }
    ],

    // 14. Solar Flare & Cosmic Lapis
    [
      { name: "Radiant Marigold", hex: "#F59E0B", description: "Warm solar flare gold" },
      { name: "Ultramarine Lapis", hex: "#2563EB", description: "Deep celestial blue" }
    ],

    // 15. Frosted Mint & Electric Grape
    [
      { name: "Frosted Spearmint", hex: "#6EE7B7", description: "Ultra-cool icy mint" },
      { name: "Electric Grape", hex: "#9333EA", description: "Punchy vibrant violet" },
      { name: "Platinum Ice", hex: "#E2E8F0", description: "Gleaming cool neutral" }
    ],

    // 16. Smoky Lavender & Burnt Ochre
    [
      { name: "Smoky Lavender", hex: "#A78BFA", description: "Velvet atmospheric mauve" },
      { name: "Burnt Ochre Gold", hex: "#D97706", description: "Deep retro caramel amber" }
    ]
  ];

  // Procedural mathematical harmony generator fallback
  const generateProceduralPalette = (): OfficialColor[] => {
    const colorAdjectives = [
      "Solar", "Lucid", "Electric", "Velvet", "Prismatic", "Glacial", "Smoky", 
      "Neon", "Cosmic", "Astral", "Frosted", "Gilded", "Obsidian", "Celestial", 
      "Hyper", "Ethereal", "Aurora", "Magnetic", "Vivid", "Luminous", "Cherry",
      "Starlight", "Matcha", "Apricot", "Midnight", "Pacific", "Imperial"
    ];
    const colorNouns = [
      "Quartz", "Cyan", "Amber", "Sapphire", "Crimson", "Onyx", "Lilac", 
      "Coral", "Emerald", "Platinum", "Mist", "Indigo", "Chiffon", "Breeze", 
      "Citron", "Tonic", "Topaz", "Ruby", "Horizon", "Orchid", "Blush", "Echo"
    ];

    const hslToHex = (h: number, s: number, l: number) => {
      l /= 100;
      const a = (s * Math.min(l, 1 - l)) / 100;
      const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
      };
      return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
    };

    const baseHue = Math.floor(Math.random() * 360);
    const randomAdjective1 = colorAdjectives[Math.floor(Math.random() * colorAdjectives.length)];
    const randomNoun1 = colorNouns[Math.floor(Math.random() * colorNouns.length)];
    const randomAdjective2 = colorAdjectives[Math.floor(Math.random() * colorAdjectives.length)];
    const randomNoun2 = colorNouns[Math.floor(Math.random() * colorNouns.length)];

    const harmonyType = Math.floor(Math.random() * 4);
    let secondaryHue = (baseHue + 180) % 360; // Complementary
    if (harmonyType === 1) secondaryHue = (baseHue + 120) % 360; // Triadic
    if (harmonyType === 2) secondaryHue = (baseHue + 40) % 360; // Analogous
    if (harmonyType === 3) secondaryHue = (baseHue + 150) % 360; // Split-Complementary

    const hex1 = hslToHex(baseHue, 75 + Math.floor(Math.random() * 20), 45 + Math.floor(Math.random() * 15));
    const hex2 = hslToHex(secondaryHue, 60 + Math.floor(Math.random() * 30), 60 + Math.floor(Math.random() * 20));

    return [
      { name: `${randomAdjective1} ${randomNoun1}`, hex: hex1, description: "Primary concept hero tone" },
      { name: `${randomAdjective2} ${randomNoun2}`, hex: hex2, description: "Harmonic accent contrast" }
    ];
  };

  // Filter out any palettes that contain current active colors
  const candidatePalettes = curatedPalettes.filter(p => {
    return !p.some(c => currentHexes.has(c.hex.toUpperCase().trim()) || currentNames.has(c.name.toLowerCase().trim()));
  });

  if (candidatePalettes.length > 0) {
    const randomIndex = Math.floor(Math.random() * candidatePalettes.length);
    return candidatePalettes[randomIndex];
  }

  return generateProceduralPalette();
};

export const regenerateGreetingMotto = async (
  groupName: string,
  conceptDescription: string,
  groupType?: string
): Promise<{ motto: string; gesture: string }> => {
  const isSolo = isSoloArtist(groupType);
  const randomSeed = Math.random().toString(36).substring(2, 8);
  const prompt = isSolo ? `You are an elite K-pop Agency Creative Director.
Create an authentic, iconic official solo artist greeting (인사 구호) and signature stage gesture for:
Artist Stage Name: "${groupName}"
Concept: "${conceptDescription}"
Act Type: Solo Artist (Performs individually)
Randomization Seed: [${randomSeed}]

STRICT BANNED AI CLICHÉS (ABSOLUTELY FORBIDDEN):
- NEVER output generic Western motivational slogans or corporate rebellion lines.
- NEVER use group count-ins like "둘, 셋!" or "하나, 둘!".
- NEVER say "we are". ALWAYS say "I am"!

AUTHENTIC K-POP SOLOIST GREETING FORMULA:
In real K-pop, soloists introduce themselves charismatically and simply:
[Optional punchy 1-2 word hook] + "안녕하세요, ${groupName}입니다! (Hello, I am ${groupName}!)"

OUTPUT FORMAT (JSON):
{
  "motto": "string (Formula: '[Optional Hook] 안녕하세요, ${groupName}입니다! (Hello, I am ${groupName}!)')",
  "gesture": "string (Individual charismatic stage gesture or elegant bow)"
}` : `You are an elite K-pop Agency Creative Director.
Create an authentic, iconic, and synchronized official group greeting (인사 구호) and physical hand gesture for:
Group Name: "${groupName}"
Concept: "${conceptDescription}"
Randomization Seed: [${randomSeed}]

STRICT BANNED AI CLICHÉS (ABSOLUTELY FORBIDDEN):
- NEVER output generic Western motivational slogans or corporate rebellion lines like:
  "Tear up the script", "Break the mold", "Break the mode", "Rewrite the rules", "Shatter expectations", "Defy the odds", "Burn the stage", "Redefine reality", "Carve your path", "Unleash the storm", "Light up the dark", "Make them look".
  Those are Western movie trailer clichés, NOT K-pop greetings!

AUTHENTIC K-POP GREETING FORMULA:
In real K-pop, groups introduce themselves using a synchronized 3-part formula:
1. Leader Count-in / Cue: e.g. "둘, 셋!" (Dul, set! / 2, 3!) or "하나, 둘!" (Hana, dul!) or "Ready, get set!"
2. Catchy 1-3 Word Signature Hook / Concept Pun / Rhyme referencing the group name or lore (e.g. "Dive into [NAME]!", "Step Out!", "All in us!", "Be my ae!", "Say the name!", "One, two, connect!", "Realize!", "Catch the spark!", "Open the prism!")
3. Formal Korean Introduction: "안녕하세요, ${groupName}입니다! (Hello, we are ${groupName}!)"

The physical hand gesture must be a synchronized, stylish multi-step finger/hand movement.

OUTPUT FORMAT (JSON):
{
  "motto": "string (Exact formula: '[Count-in] [Punchy 1-3 word hook]! 안녕하세요, ${groupName}입니다! (Hello, we are ${groupName}!)')",
  "gesture": "string (Hyper-specific synchronized hand gesture)"
}`;

  try {
    const { data } = await generateKpopGroupData<{ motto: string; gesture: string }>(prompt);
    if (data && data.motto) {
      return {
        motto: sanitizeKpopGreeting(data.motto, groupName, isSolo),
        gesture: sanitizeKpopGesture(data.gesture, groupName, isSolo)
      };
    }
  } catch (err) {
    console.error("Failed to regenerate greeting motto with AI:", err);
  }

  if (isSolo) {
    const soloHooks = [
      `Tune in!`,
      `Catch the vibe!`,
      `Spotlight on!`,
      `Feel the rhythm!`,
      `Here with you!`,
      `Right now!`
    ];
    const hook = soloHooks[Math.floor(Math.random() * soloHooks.length)];
    return {
      motto: `${hook} 안녕하세요, ${groupName}입니다! (Hello, I am ${groupName}!)`,
      gesture: `The artist gently places their right hand over their heart and offers a warm, respectful 90-degree bow with a charming smile.`
    };
  }

  // Fallback authentic greeting
  const defaultHooks = [
    `Dive into ${groupName}!`,
    `Step Out! We are ${groupName}!`,
    `All in us! We are ${groupName}!`,
    `One, two, connect! We are ${groupName}!`,
    `Catch the spark! We are ${groupName}!`,
    `Say the name! ${groupName}!`,
    `Tune into our frequency! We are ${groupName}!`,
    `Realize! We are ${groupName}!`,
    `Feel our pulse! We are ${groupName}!`,
    `Open the prism! We are ${groupName}!`
  ];
  const cues = ['둘, 셋!', '하나, 둘!', 'Ready, get set!'];
  const cue = cues[Math.floor(Math.random() * cues.length)];
  const hook = defaultHooks[Math.floor(Math.random() * defaultHooks.length)];

  return {
    motto: `${cue} ${hook} 안녕하세요, ${groupName}입니다! (Hello, we are ${groupName}!)`,
    gesture: `Members bring both hands together forming a signature geometric emblem over their chest, then snap their fingers outward in unison while bowing politely.`
  };
};

export const regenerateTrackTitle = async (
  currentTitle: string,
  genre: string,
  conceptDescription: string,
  role: string,
  groupName: string,
  options?: {
    customDirection?: string;
    existingTitles?: string[];
    albumTitle?: string;
    groupType?: string;
    isSolo?: boolean;
    memberGender?: string;
  }
): Promise<{ title: string }> => {
  const isSolo = Boolean(options?.isSolo || isSoloArtist(options?.groupType));
  const artistGender = detectArtistGender(options?.groupType, conceptDescription, options?.memberGender);
  const existingList = (options?.existingTitles || []).filter(t => t && t.trim() !== '' && t.trim().toLowerCase() !== currentTitle.trim().toLowerCase());
  const existingExclusion = existingList.length > 0
    ? `- STRICT UNIQUENESS: DO NOT use or closely copy any existing song titles from this album: ${existingList.map(t => `"${t}"`).join(', ')}.\n`
    : '';
  const customHint = options?.customDirection?.trim()
    ? `- CUSTOM USER DIRECTION / DESIRED VIBE: Tailor the new title to reflect this mood, aesthetic, or keyword: "${options.customDirection.trim()}".\n`
    : '';

  const prompt = `
Generate exactly ONE new, highly creative, and incredibly catchy K-pop track title to replace "${currentTitle}".
${isSolo ? `Artist: "${groupName}" (Solo Artist - ${artistGender})` : `Group Name: "${groupName}"`}
Genre: "${genre}"
Role: "${role}"
${options?.albumTitle ? `Album Title: "${options.albumTitle}"` : ''}
Lore Concept Backdrop: "${conceptDescription}"

STRICT TITLING RULES:
- NEVER USE THESE OVERUSED AI PRESET TITLES: "Spoiler", "Thrift Check", "3am Call", "Eclipse", "Awakening", "Nova", "Illusion", "Focus", "Echo", "Mirror". YOU MUST INVENT A COMPLETELY FRESH, UNIQUE SONG TITLE.
${existingExclusion}${customHint}- Use diverse real K-pop naming conventions: Punchy single English words (e.g. ${isSolo ? `'SOLO', 'INVU', 'Guilty', 'Move', 'Celebrity', 'Gashina', 'Snapping', 'Seven', 'LALISA', 'Tail'` : `'Magnetic', 'Supernova', 'Ditto', 'Spicy', 'Smart'`}), bold Korean/English phrases, quirky hooks, onomatopoeia, symbolic metaphors, or stylised casing/punctuation (e.g. 'Love Dive', 'Nxde', 'DDU-DU DDU-DU', 'Queencard', 'Fast Forward', "God's Menu").
- The title MUST suit a modern ${genre} song with the role of "${role}".
- Return ONLY the title string in the JSON output, without unnecessary surrounding quotation marks.

STRICT JSON OUTPUT FORMAT:
{
  "title": "string (The new catchy track title)"
}
`;
  const schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING }
    },
    required: ["title"]
  };

  try {
    const { data } = await generateKpopGroupData<{ title: string }>(prompt, schema);
    if (data?.title && data.title.trim().length > 0) {
      const cleanTitle = data.title.trim().replace(/^["']|["']$/g, '');
      return { title: cleanTitle };
    }
  } catch (err) {
    console.error("Failed to regenerate track title via AI:", err);
  }

  // Fallback high-impact K-pop titles by role
  const FALLBACK_TITLES: Record<string, string[]> = {
    "Title Track": isSolo ? ["Siren", "Guilty", "Velvet Rose", "Voltage", "Paranoia", "Fever Dream", "Snapping", "Solo Flight", "After Glow"] : ["HyperDrive", "Velvet Siren", "Zero Hour", "Voltage", "Paranoia", "Chasing Stars", "Fever Dream", "After Shock", "Neon Venom", "Siren Call"],
    "Intro": ["Overture: Genesis", "Prelude (Awakening)", "Gate 00:00", "Breathe In", "Frequency", "Ignition"],
    "Outro": ["Fade to Gold", "Epilogue: Dawn", "Last Call", "Still Here", "Encore (Till Next)", "Curtain Fall"],
    "B-side": ["Midnight Rush", "Sugar Rush", "Ghost Whisper", "Runaway Heart", "Bittersweet", "Static Signal", "Blue Hour Glow", "Daydreamer"]
  };
  const roleFallbacks = FALLBACK_TITLES[role] || FALLBACK_TITLES["B-side"];
  const randomFallback = roleFallbacks[Math.floor(Math.random() * roleFallbacks.length)];
  return { title: randomFallback };
};

export const regenerateTrackDetails = async (
  trackTitle: string,
  genre: string,
  conceptDescription: string,
  role: string,
  groupName: string,
  groupType?: string,
  generation?: string,
  memberCount: number = 5
): Promise<{ 
  lyricExcerpt: string; 
  meaning: string; 
  structureType: string; 
  structurePattern: string;
  genres: string[];
  musicStylePrompt: string;
  rhymeScheme: string;
  figurativeDevices: string[];
  vocalArrangement: string;
}> => {
  const isSolo = isSoloArtist(groupType) || memberCount === 1;
  const artistGender = detectArtistGender(groupType, conceptDescription);
  const prompt = `
Create fresh, authentic demo lyrics, an advanced K-pop song structure, detailed music production prompt, and a casual song meaning for:
Track Title: "${trackTitle}"
Genre: "${genre}"
Role: "${role}"
${isSolo ? `Solo Artist: "${groupName}" (${artistGender} Soloist)` : `Group Name: "${groupName}"`}
Lore Concept Backdrop: "${conceptDescription}"

STRICT COMPOSITION RULES:
1. LYRIC EXCERPT & CHORUS ENGINEERING:
   - Provide a highly memorable, extremely catchy, professional 4-to-8 line demo lyric (in English and/or Romanized Korean).
${getChorusEngineeringRules(groupType, generation, trackTitle, isSolo, artistGender)}
${isSolo ? `
CRITICAL SOLO ARTIST RULES FOR "${groupName}" (${artistGender} Soloist):
- STRICT SINGULAR 1ST-PERSON PERSPECTIVE: The lyrics are written strictly from ${groupName}'s individual perspective ("I", "me", "my", "mine"). NEVER use collective group plurals ("we", "us", "our group", "our team", "together we stand") unless explicitly addressing a romantic partner as a couple ("you and I").
- GENDER-AUTHENTIC PRONOUNS & NARRATIVE FOCUS:
  ${artistGender === 'Female' 
    ? `* Feminine point of view: She / Her / Hers self-expression ("I'm that girl", "the queen", "diva").
  * Directed pronouns: When singing about romantic tension, rivals, or listeners, address them as "he", "him", "boy", or direct "you".
  * ZERO mismatched masculine pronouns for the singer and ZERO collective girl-group clichés.`
    : `* Masculine point of view: He / Him / His self-expression ("I'm that man", "king", "gentleman").
  * Directed pronouns: When singing about romantic tension, rivals, or listeners, address them as "she", "her", "girl", or direct "you".
  * ZERO mismatched feminine pronouns for the singer and ZERO collective boy-group clichés.`}
- REMOVE ALL GROUP MEMBER REFERENCES:
  * Strictly NO references to other members, member hand-offs, unison group shouting ([All]), or group positions ([Leader], [Sub-Vocal], [Main Vocal], [Center]).
  * The entire vocal performance, harmonies, ad-libs, and rap are performed by ${groupName}.
- CASUAL MEANING: Written from the solo artist's personal perspective ("In this track, I wanted to express...", not "The members wanted to show...").
` : getLineDistributionRules(memberCount, false, groupName)}
   - LYRICS MUST SOUND LIKE AUTHENTIC, TOP-TIER K-POP:
     * COMPLETE NARRATIVE SENSE & STORYLINE COHERENCE: The lyrics must make 100% logical and emotional sense from line to line. Every line must connect naturally to the next line. NO disjointed non-sequiturs or random word salad. Both Korean and English lines must form complete, grammatically sound thoughts.
     * STRICT BAN ON TIMESTAMPS & FAKE SPECIFICITY: Absolutely NO "2 AM", "3 AM", "4 AM", "midnight", "staring at my screen/phone/ceiling", "read receipts", or "blue light". Ground lyrics in real situations, relational tension, and tangible dialogue.
     * PUNCHY & ULTRA-CATCHY CHORUS HOOK: Keep the chorus tight (2 to 4 lines maximum), infectious, and rhythmically captivating. Balanced syllable counts (6 to 9 syllables per line) so lines bounce on the beat. Center on title hook repetition (Rule of 3) and singable open vowels. STRICTLY NO MORAL LESSONS, preaching, or motivational speeches (NO "we must learn", "stand tall and overcome", "the world tries to break us").
     * ZERO NONSENSICAL ONOMATOPOEIA: Strictly NO forced sound effects or random nonsense syllables (e.g., 'tik-tak', 'ppappappa', 'ratata', 'beep-beep', 'vroom', 'zoom', 'skrrt'). Every line and chant must make clear musical sense.
     * CASUAL, RELATABLE VERSES (NO POETRY-LIKE FLUFF): Verses should be casual, modern, conversational, and relatable. Verses establish the groove and smoothly build anticipation into the Pre-Chorus and Chorus without competing for the spotlight!
     * TOP-TIER RAP FLOW: Rappers must have authentic rhythmic pocket, cadence, locked-in syncopation, and multisyllabic internal slant rhymes. Deliver sharp punchlines, natural bilingual attitude, and swagger (inspired by Soyeon, Changbin, Mark Lee, Jennie, Bobby).
     * AVOID AI CLICHÉS & CRINGE: Never use pretentious, over-dramatic AI phrases like "velvet rope", "perimeter", "unlocking the gate", "whisper in the dark", "shadows", "breaking the rules", "neon lights", "destiny", "eternity", "ignite", "echoes". DO NOT use basic magic/star metaphors.
     * POV & NARRATIVE CLARITY: The lyrics must have a clear Point of View (I, You, We). Use strong, directed pronouns to ground the lyrics in a specific situation, relationship, or conversation. Make sure the lyrics make complete narrative sense.
     * VARY THE KOREAN & ENGLISH MIX: Use varied structures for English and Romanized Korean. Do not just use English at the end of lines. Sometimes start a line with English and end with Korean, sometimes use full English lines, sometimes full Korean lines, sometimes insert English words mid-sentence, etc. Mix it up naturally.
     * STUDY REAL EXAMPLES:
       > KISS OF LIFE style: "When I walk onto the stage, yeah, I got this / 짙게 타오르는 숨 벅찬 heartbeat / Come around, baby, you can come and see me / Making everybody go, 'Who is she?'"
       > ENHYPEN style: "With or without you / Neoreul ireun cheongugeun jiogingeol / With or without you / Nareul taeuneun i beautiful fire / It's all my bad desire"
       > LE SSERAFIM style: "(Woo) Ippal sai kkin spaghetti / Ppaego simni? Bon appétit / Geunyang pogihae eochapi / Eat it up, eat it, eat it up"
       > Stray Kids style: "Why do I keep getting attracted? / Jaseok gachi kkeullyeoga (Oh) / I cannot explain this reaction / Igeotbakke one-four-three (Oh)"
     * AVOID OVERUSE OF RHYME & ONOMATOPOEIA: Do not over-rely on repetitive rhymes or excessive onomatopoeia (Da da da, Woo, Yeah). Only use them sparingly when it naturally fits the rhythm.
     * NO generic AABB or ABAB end-rhymes (e.g., night/light, go/show). Use complex internal rhymes, slant rhymes, rhythmic staccato phrasing, and multi-syllabic flows.
   - NO AI CYBER CLICHES: Keep virtual or technical words strictly out of the lyrics ('glitch', 'system', 'hologram', 'data', 'code', 'download', 'simulation', 'protocol', 'database', 'cyber', 'matrix').
2. SONG MEANING & TOPIC VARIANCE (CRITICAL):
   - Give a completely simple, down-to-earth explanation of the song's meaning, exactly how ${isSolo ? `${groupName} would casually describe their personal vision` : 'a real group member would casually describe it'} in a short interview or TikTok live stream.
   ${getSingleLyricStyleGuide(isSolo, artistGender, groupName)}
   - ABSOLUTELY DO NOT start the meaning with crutch words like "Basically" or "This song is basically...". Start the explanation directly and naturally.

3. K-POP SONG STRUCTURE MANDATE - CHOOSE ONE OF THESE TOP 5 STRUCTURES:
   - "Dynamic Pop/EDM Powerhouse" (Pattern: Intro -> Verse 1 -> Pre-Chorus -> Drop Chorus -> Verse 2 (trap-break rap) -> Pre-Chorus -> Chorus -> Bridge -> Outro)
   - "Multi-Part Hybrid Beat-Switch-up" (Pattern: Intro -> Verse 1 (R&B groove) -> Pre-Chorus -> Chorus (anti-drop) -> Verse 2 (trap/tempo shift) -> Chorus -> Bridge -> Outro (beat switch))
   - "Post-Chorus TikTok Hook-First" (Pattern: Intro/Chorus -> Verse 1 -> Pre-Chorus -> Chorus -> Post-Chorus (mantra loop) -> Verse 2 -> Chorus -> Post-Chorus -> Short Outro)
   - "Sensual Minimalist R&B / UK Garage" (Pattern: Atmospheric Intro -> Low-Register Verse 1 -> Airy Falsetto Pre-Chorus -> Whisper-Staccato Chorus -> Call-and-Response Verse 2 -> Dual-Harmony Bridge -> Fading Ad-lib Outro)
   - "Cyberpunk Hyperpop / Jersey Club Staccato" (Pattern: Fast-Chant Intro -> Fast-BPM Verse 1 (140 BPM) -> Rising Snare Pre-Chorus -> Jersey 5-Beat Bounce Chorus -> Verse 2 Punchy Staccato Rap -> Glitch-Pop Bridge -> Dual-Tempo Finale)

4. MUSIC STYLE PROMPT & AUDIO PRODUCTION:
   - Write a complete music production prompt (BPM, key, groove, 808 bass, synths, acoustic elements, vocal production, mixing notes - NO lyrics).

STRICT JSON OUTPUT FORMAT:
{
  "lyricExcerpt": "string (The highly catchy demo lyrics with lines separated by \\n)",
  "meaning": "string (The simple, relatable, casual human song meaning)",
  "structureType": "string (Structure Name)",
  "structurePattern": "string (Pattern sequence)",
  "genres": ["string (Primary and subgenres)"],
  "musicStylePrompt": "string (High-definition audio/music production prompt with BPM, Key, drums, synths, mix - NO lyrics)",
  "rhymeScheme": "string (e.g. 'Cross-Language Phonetic Slant & Compound Rhymes')",
  "figurativeDevices": ["string (e.g. 'Synesthesia & Sensory Blending')"],
  "vocalArrangement": "string (e.g. ${isSolo ? `'Solo lead vocal with intimate breathy verses, layered self-harmonies, and soaring high-belt climax'` : `'Multi-part vocal layering with 16-bar staccato rap cadence and high-belt C6 climax'`})"
}
`;
  let { data } = await generateKpopGroupData<{ 
    lyricExcerpt: string; 
    meaning: string; 
    structureType: string; 
    structurePattern: string;
    genres?: string[];
    musicStylePrompt?: string;
    rhymeScheme?: string;
    figurativeDevices?: string[];
    vocalArrangement?: string;
  }>(prompt);
  
  let attempts = 0;
  while (data?.lyricExcerpt && (hasCringeLyrics(data.lyricExcerpt) || (isSolo && checkSoloistLyricViolations(data.lyricExcerpt, artistGender).hasViolation)) && attempts < 2) {
    console.log(`Lyric Quality Check failed for track details, retrying... (${attempts + 1}/2)`);
    const retryPrompt = prompt + "\n\n" + (isSolo ? SOLOIST_LYRIC_RETRY_PROMPT : LYRIC_RETRY_PROMPT);
    const retryResult = await generateKpopGroupData<typeof data>(retryPrompt);
    data = retryResult.data;
    attempts++;
  }

  const guaranteedTrack = ensureTrackMetadata({
    title: trackTitle,
    duration: "3:10",
    role: role as any,
    genre: genre,
    genres: data.genres,
    musicStylePrompt: data.musicStylePrompt,
    producers: ["Dem Jointz", "LDN Noise"],
    lyricists: [groupName],
    description: "",
    lyricExcerpt: data.lyricExcerpt,
    meaning: data.meaning,
    hasChoreography: true,
    structureType: data.structureType,
    structurePattern: data.structurePattern,
    rhymeScheme: data.rhymeScheme,
    figurativeDevices: data.figurativeDevices,
    vocalArrangement: data.vocalArrangement
  }, groupName, conceptDescription, isSolo);

  return {
    lyricExcerpt: guaranteedTrack.lyricExcerpt,
    meaning: guaranteedTrack.meaning,
    structureType: guaranteedTrack.structureType || data.structureType || "Dynamic Pop/EDM Powerhouse",
    structurePattern: guaranteedTrack.structurePattern || data.structurePattern || "Intro -> Verse 1 -> Pre-Chorus -> Drop Chorus -> Verse 2 -> Pre-Chorus -> Chorus -> Bridge -> Outro",
    genres: guaranteedTrack.genres || [genre, "Electropop"],
    musicStylePrompt: guaranteedTrack.musicStylePrompt || buildMusicStylePrompt({ genre, role: role as any }, groupName, conceptDescription, isSolo),
    rhymeScheme: guaranteedTrack.rhymeScheme || "Cross-Language Phonetic Slant & Compound Rhymes",
    figurativeDevices: guaranteedTrack.figurativeDevices || ["Synesthesia & Sensory Blending"],
    vocalArrangement: guaranteedTrack.vocalArrangement || (isSolo ? "Dynamic solo vocal performance with layered self-harmonies" : "Multi-part vocal layering with 16-bar staccato rap cadence")
  };
};

export const generateFullLyrics = async (
  trackTitle: string,
  genre: string,
  conceptDescription: string,
  role: string,
  groupName: string,
  groupType?: string,
  generation?: string,
  memberCount: number = 5,
  rhymeScheme?: string,
  figurativeDevices?: string[],
  structureType?: string,
  meaning?: string,
  lyricExcerpt?: string,
  genres?: string[],
  vocalArrangement?: string,
  customTestNotes?: string
): Promise<{ lyrics: string; lyricsEnglish: string }> => {
  const isSolo = isSoloArtist(groupType) || memberCount === 1;
  const artistGender = detectArtistGender(groupType, conceptDescription);
  const selectedRhymeScheme = rhymeScheme || getRandomRhymeScheme();
  const selectedDevices = figurativeDevices && figurativeDevices.length > 0 ? figurativeDevices.join(", ") : getRandomFigurativeDevices().join(", ");
  const selectedStructure = structureType || getRandomStructure().name;

  const prompt = `
Create the FULL, AUTHENTIC, COHESIVE K-POP SONG LYRICS for:
Track Title: "${trackTitle}"
Primary Genre: "${genre}"
Subgenres / Soundscape: "${genres && genres.length > 0 ? genres.join(', ') : genre}"
Track Role: "${role}"
${isSolo ? `Solo Artist: "${groupName}" (${artistGender} Soloist)` : `Artist / Group Name: "${groupName}"`}
Group Concept / Lore Backdrop: "${conceptDescription}"

SONG INSPIRATION & STORYLINE MEANING (CRITICAL - THE LYRICS MUST DIRECTLY EXPLORE THIS STORY):
"${meaning || 'A high-energy, relatable story about self-confidence, breaking out of hesitation, and owning the stage.'}"

${lyricExcerpt ? `EXISTING DEMO HOOK MOTIF (Incorporate, reference, or build upon this catchy hook):
"${lyricExcerpt}"` : ''}

${vocalArrangement ? `VOCAL ARRANGEMENT CONTEXT:
"${vocalArrangement}"` : ''}

${customTestNotes ? `SPECIAL REGENERATION / TEST INSTRUCTIONS:
"${customTestNotes}"` : ''}

MANDATORY ARTISTIC TECHNIQUES & DIVERSITY:
- RHYME SCHEME TO EXECUTE: "${selectedRhymeScheme}" (Focus heavily on multi-syllabic rhymes, cross-language English/Korean slant rhymes, syncopated internal pocket rhymes, and avoid repetitive nursery AABB end-rhymes).
- FIGURATIVE DEVICES & IMAGERY: "${selectedDevices}" (Use vivid, unconventional sensory metaphors, visceral velocity hyperbole, or double entendres that make the lyrics memorable and deep).
- SONG STRUCTURE: "${selectedStructure}"

${getVerse1EngineeringRules(isSolo, groupName, artistGender)}

STORYTELLING & COHERENCE MANDATE (SONGWRITING VS ESSAY - MUST SOUND LIKE REAL POP HITS):
1. COMPLETE NARRATIVE SENSE & STORYLINE COHERENCE:
   - The song must tell a clear, coherent musical story from start to finish.
   - Every line must logically follow from and answer the line before it. NO disconnected non-sequiturs, confusing jumps, or random word salad!
   - Both Korean and English lines must form complete, grammatically sound thoughts that make sense in context.
   - Real chart-topping lyrics DO NOT sound like an explanatory essay, academic thesis, or diary dissertation!
   - Ban formal grammar words ("furthermore", "thus", "consequently", "endeavor", "manifestation", "nevertheless", "contemplate", "realization", "in order to").
   - Ban robotic AI sentence structures ("As I walk through the room, I begin to understand that...", "The world may try to tell us what to be, but we will...").

2. STRICT BAN ON TIMESTAMPS & FAKE SPECIFICITY:
   - Absolutely NO "2 AM", "3 AM", "4 AM", "midnight", "staring at my screen/phone/ceiling", "read receipts", "blue light".
   - Artificial timestamps are lazy AI tropes. Real songs achieve authentic specificity through relational friction, eye contact, concrete decisions, and tangible dialogue.

3. RHYTHMIC CATCHINESS & BALANCED SYLLABLE METER:
   - Pop lyrics live in tight, rhythmic pocket! Maintain balanced syllable counts (typically 6-9 syllables per line) so lines bounce on the beat and can be sung aloud.
   - The chorus MUST be an infectious, ultra-catchy earworm (2 to 4 bars of high-impact rhythmic bounce, vocal hook, or anti-drop chant).
   - Use rhythmic syllable repetition (Rule of 3), syncopated bounce, alliteration, and singable open vowels (e.g., "Hype Boy", "Cupid", "Perfect Night", "Spicy", "Shut Down", "Magnetic", "Sticky", "Supernova", "SOLO", "INVU", "Guilty").
   - The song title MUST be the centerpiece hook of the chorus!
   - STRICTLY NO MORAL LESSONS or philosophical lectures in the chorus (NO "we must learn", "stand tall and overcome", "the world tries to break us").

4. GENRE & TONE ALIGNMENT (NO FORCED SLANG SALAD):
   - Use vocabulary, attitude, and phrasing that authentically fits "${genre}" and the song's storyline.
   - Blend standard modern conversational English with authentic urban pop expressions and pocket contractions naturally where appropriate, but NEVER force awkward slang into songs where it doesn't belong.

5. CASUAL, GROUNDED VERSES:
   - Verses should feel conversational, casual, modern, and relatable.
   - Verses establish the groove and smoothly build anticipation into the Pre-Chorus and Chorus WITHOUT stealing their spotlight!

6. AUTHENTIC RAP FLOW & CYPHER POCKET:
   - Verse 2 and cypher sections must feature authentic rap flow—locked into the pocket, syncopated internal slant rhymes, bilingual cadence, double-time switches, and true swagger (like Soyeon, Changbin, Mark Lee, Jennie, Bobby).

7. BAN NONSENSICAL ONOMATOPOEIA: Strictly NO awkward or random sound effects (e.g. 'tik-tak', 'ppappappa', 'ratata', 'beep-beep', 'vroom', 'skrrt'). Every line and chant must make clear musical sense.

8. SECTION-BY-SECTION RHYME VARIETY: Do NOT repeat the exact same rhyme structure across every section. Shift the rhythmic pattern between verses (syncopated storytelling / fast cypher), pre-choruses (rising tension melodic slant), and choruses (punchy bounce hooks, anti-drop payoffs, or soaring vocal belts).

9. DIVERSIFIED KONGLISH BLENDING: Do NOT just put English at the end of each line! Start lines with English, mix English slang inside Korean grammar with particles, use full Korean lines with deadpan English one-liner reactions, and rhyme English words with phonetic Korean vowels.

10. STRICT AI CLICHÉ BAN: Absolutely NO 'neon', 'shadow', 'line' / 'crossing the line', 'velvet rope', 'whisper in the dark', 'destiny', 'eternity', 'ignite', 'spark', 'flame', 'echo', 'shatter', 'soar', 'wings', 'matrix', 'glitch'. Use natural, vibrant, human phrasing.

STRICT COMPOSITION RULES & CHORUS ENGINEERING:
${getChorusEngineeringRules(groupType, generation, trackTitle, isSolo, artistGender)}
${isSolo ? `
EXPLICIT SOLO PERFORMANCE TAGS:
Every single section is performed exclusively by ${groupName}.
STRICTLY FORBIDDEN: Do NOT output "[All]", "[Members]", "[Group]", "[Gang Chant]", "[Center]", "[Sub-Vocal]", "[Lead Vocal]", "[Main Vocal]", or "[Main Rapper]"!
Label every section using ${groupName}'s name and solo vocal dynamic:
[Intro: ${groupName} - Breathy Low-Register Spoken Hook]
[Verse 1: ${groupName} - Fast Syncopated Conversational Melody]
[Pre-Chorus: ${groupName} - Rising Dynamic Tension & Melodic Build]
[Chorus: ${groupName} - Catchy Earworm Hook & Layered Self-Harmonies]
[Post-Chorus: ${groupName} - Staccato Catchphrase Loop & Vocal Chops]
[Verse 2: ${groupName} - Double-Time Pocket Rap Flow with Internal Slant Rhymes]
[Bridge: ${groupName} - Soaring Emotional High-Belt Climax & Falsetto Runs]
[Dance Break / Beat Drop: ${groupName} - Pitch-Shifted Vocal Chops & Heavy Bass Groove]
[Outro: ${groupName} - Hypnotic Fading Ad-libs & Signature Spoken Punchline]

CRITICAL SOLO ARTIST PERSPECTIVE & GENDER PRONOUN MANDATES:
1. STRICT SINGULAR 1ST-PERSON PERSPECTIVE: The lyrics must be written strictly from ${groupName}'s personal individual perspective ("I", "me", "my", "mine"). NEVER use collective group plurals ("we", "us", "our group", "our team", "together we conquer") unless explicitly referring to a couple ("you and I").
2. GENDER-SPECIFIC IDENTITY & PRONOUNS: ${groupName} is a ${artistGender} Soloist.
   ${artistGender === 'Female' 
     ? `* Feminine point of view: She / Her / Hers identity. Confident feminine agency ("I'm that girl", "the queen", "she's got it").
   * Directed pronouns: When singing to/about a romantic partner, rival, or listener, address them as "he", "him", "boy", or direct "you".
   * ZERO mismatched masculine pronouns for the singer and ZERO collective girl-group clichés.`
     : `* Masculine point of view: He / Him / His identity. Magnetic masculine charisma ("I'm that man", "king", "gentleman").
   * Directed pronouns: When singing to/about a romantic partner, rival, or listener, address them as "she", "her", "girl", or direct "you".
   * ZERO mismatched feminine pronouns for the singer and ZERO collective boy-group clichés.`}
3. ZERO GROUP REFERENCES: Absolutely NO references to other members, member hand-offs, unison group shouting ([All]), or multi-member backing choirs.
` : `
${getLineDistributionRules(memberCount, false, groupName)}

EXPLICIT PERFORMANCE TAGS:
Label every section clearly with member role tags, vocal delivery registers, and emotional direction, e.g.:
[Intro: Main Vocal - Breathy Low-Register Spoken Hook]
[Verse 1: Lead Vocal - Fast Syncopated Storytelling]
[Pre-Chorus: Sub-Vocal - Rising Melodic Tension & Harmonic Build]
[Chorus: All - Unison Earworm Hook & Dynamic Rhythmic Bounce]
[Post-Chorus: Center - Staccato Catchphrase Loop]
[Verse 2: Main Rapper - Double-Time Flow with Internal Rhymes]
[Bridge: Main Vocal - Soaring Emotional Belt with High Notes]
[Dance Break / Beat Drop: Vocal Chops & Heavy Bass Groove]
[Outro: All - Stadium Gang Chant, Ad-libs & Punchline Fadeout]
`}

FORMAT REQUIREMENT:
Return ONLY a strictly formatted JSON object with two fields:
1. "lyrics": The full authentic bilingual K-pop lyrics (mix of Korean and English lines, performance tags, ad-libs, and rap cadences).
2. "lyricsEnglish": The complete official FULL ENGLISH VERSION of the song lyrics (adapted entirely in natural, rhythmic, singable English while preserving the exact same song structure, syllable bounce, flow, rhymes, story meaning, and section tags like "${isSolo ? `[Verse 1: ${groupName}]` : `[Verse 1: Main Vocal]`}", just like official English releases by TWICE, BTS, LE SSERAFIM, aespa, or FIFTY FIFTY).
CRITICAL: You MUST escape all newlines within both lyrics strings as "\\n" so that the JSON is syntactically valid!
`;
  const schema = {
    type: Type.OBJECT,
    properties: {
      lyrics: { type: Type.STRING },
      lyricsEnglish: { type: Type.STRING }
    },
    required: ["lyrics", "lyricsEnglish"]
  };
  let { data } = await generateKpopGroupData<{ lyrics: string; lyricsEnglish?: string }>(prompt, schema);
  
  let attempts = 0;
  while (data?.lyrics && (hasCringeLyrics(data.lyrics) || (isSolo && checkSoloistLyricViolations(data.lyrics, artistGender).hasViolation)) && attempts < 2) {
    console.log(`Lyric Quality Check failed for Full Lyrics, retrying... (${attempts + 1}/2)`);
    const retryPrompt = prompt + "\n\n" + (isSolo ? SOLOIST_LYRIC_RETRY_PROMPT : LYRIC_RETRY_PROMPT);
    const retryResult = await generateKpopGroupData<{ lyrics: string; lyricsEnglish?: string }>(retryPrompt, schema);
    data = retryResult.data;
    attempts++;
  }

  // If lyricsEnglish wasn't generated in the schema for any reason, generate an English adaptation fallback
  let englishLyrics = data?.lyricsEnglish;
  if (!englishLyrics && data?.lyrics) {
    try {
      const englishPrompt = `
You are an expert top-tier global hit songwriter and K-pop localization director (like Bekuh BOOM, Tayla Parx, Justin Tranter).
Adapt the following K-pop song into the official FULL ENGLISH VERSION ("${trackTitle} - English Ver.") for ${isSolo ? `solo artist "${groupName}" (${artistGender} Soloist)` : `"${groupName}"`}:

ORIGINAL LYRICS:
"""
${data.lyrics}
"""

SONG STORYLINE & MEANING:
"${meaning || trackTitle}"

CRITICAL ENGLISH ADAPTATION RULES (SONGWRITING VS ESSAY):
1. COMPLETE NARRATIVE SENSE & STORYLINE COHERENCE:
   - The English version must make 100% logical, narrative, and emotional sense!
   - Every line must naturally flow into and answer the line before it. NO disjointed non-sequiturs, random phrases, or confusing word salad.
   - Do NOT write lyrics that sound like a school essay, diary thesis, or stiff literal translations.
   - Ban formal words ("furthermore", "thus", "consequently", "endeavor", "contemplate", "manifestation").
   - Ban long run-on explanatory sentences. Pop music lives in syncopated phrases, rhythmic punchlines, and effortless cadence.

2. STRICT BAN ON TIMESTAMPS & FAKE SPECIFICITY:
   - Absolutely NO "2 AM", "3 AM", "4 AM", "midnight", "staring at my screen/phone/ceiling", "read receipts", "blue light".
   - Ground specificity in real interactions, facial expressions, dialogue, and concrete decisions.

3. RHYTHMIC CATCHINESS, BALANCED METER & EARWORM CHORUS:
   - Keep lines to balanced 6 to 9 syllable counts so they bounce on the beat and are effortless to sing aloud.
   - The chorus must be an instant, irresistible earworm (2-4 lines of rhythmic bounce, melodic hook, or drop chant).
   - Use infectious syllable repetition and bounce with singable open vowels (e.g. "Hype Boy", "Cupid", "Perfect Night", "Spicy", "Magnetic", "Sticky", "SOLO", "INVU").
   - ZERO moral lessons or preachy lectures in the chorus.
   - The song title "${trackTitle}" MUST be the centerpiece hook of the chorus!

4. AUTHENTIC POP FLOW & NATURAL VOCABULARY:
   - Adapt into stylish, modern, singable pop/R&B English that matches the track's genre and emotional mood.
   - Use natural colloquial contractions and pocket rhymes organically. Never force awkward slang into tracks where it doesn't belong.

5. FULL ENGLISH & EXACT TIMING MATCH:
   - 100% of the lyrics must be in natural, singable, rhythmic English (no Korean Hangul or Romanized Korean).
   ${isSolo ? `- PRESERVE STRUCTURE & TIMING: Keep the exact same section structure tags using ${groupName}'s name (e.g. [Intro: ${groupName}], [Verse 1: ${groupName}], [Chorus: ${groupName}], [Verse 2: ${groupName}], [Bridge: ${groupName}], [Outro: ${groupName}]).
   - STRICT SINGULAR 1ST-PERSON PERSPECTIVE: Use exclusively "I", "me", "my", "mine". Strictly FORBIDDEN to use collective group plurals ("we", "us", "our group", "our team").
   - GENDER-AUTHENTIC PRONOUNS: ${artistGender === 'Female' ? 'Feminine identity ("I\'m that girl", "the queen"), addressing "boy/he/him" or "you"' : 'Masculine identity ("I\'m that man", "king"), addressing "girl/she/her" or "you"'}.
   - ZERO GROUP TAGS: Strictly NO "[All]" or group member tags.` : `- PRESERVE STRUCTURE & TIMING: Keep the exact same section structure tags (e.g. [Intro: Main Vocal], [Verse 1: Lead Vocal], [Chorus: All], [Verse 2: Main Rapper], [Bridge: Main Vocal], [Outro: All]).`}
   - RHYME & POCKET: Craft catchy slant rhymes, internal pocket rhymes, and syncopated cadence that fits the original tempo and melody bounce perfectly.
   - NO CLICHÉS: Ban cheesy AI words ('matrix', 'ignite', 'wings', 'echo', 'shadow', 'neon', 'destiny'). Use conversational, confident, modern pop lyrics.

Return ONLY a JSON object with:
{
  "lyricsEnglish": "string (Full English lyrics with escaped \\n newlines)"
}
`;
      const engSchema = {
        type: Type.OBJECT,
        properties: {
          lyricsEnglish: { type: Type.STRING }
        },
        required: ["lyricsEnglish"]
      };
      const engRes = await generateKpopGroupData<{ lyricsEnglish: string }>(englishPrompt, engSchema);
      if (engRes.data?.lyricsEnglish) {
        englishLyrics = engRes.data.lyricsEnglish;
      }
    } catch (engErr) {
      console.warn("Fallback English lyric generation error:", engErr);
    }
  }

  return {
    lyrics: data?.lyrics || "",
    lyricsEnglish: englishLyrics || ""
  };
};

export function getOutfitColorDistributionPrompt(
  groupColors: { name: string; hex?: string; description?: string }[],
  indexOrHash: number
): string {
  if (!groupColors || groupColors.length === 0) {
    return "OUTFIT COLOR HARMONY: Clean, tasteful, and cohesive color palette anchored in crisp off-white, warm cream, washed vintage indigo denim, and soft black with elegant tonal matching across top and bottom pieces.";
  }

  // Extract clean color names and hex codes, stripping out lengthy lore descriptions
  const cleanColors = groupColors.map(c => {
    let cleanName = (c.name || 'Official Tone').replace(/\([^)]*\)/g, '').replace(/\[[^\]]*\]/g, '').trim();
    if (!cleanName) cleanName = 'Official Color';
    const hexPart = c.hex && c.hex.startsWith('#') ? ` (${c.hex})` : '';
    return { name: cleanName, hex: c.hex, formatted: `"${cleanName}"${hexPart}` };
  });

  const numColors = cleanColors.length;
  const idx = Math.abs(indexOrHash);

  // Pick primary statement color for this outfit variation
  const primaryColor = cleanColors[idx % numColors];
  
  // Pick secondary accent color if available
  const secondaryColor = numColors > 1 ? cleanColors[(idx + 1) % numColors] : null;

  if (secondaryColor && secondaryColor.name !== primaryColor.name) {
    return `OUTFIT COLOR HARMONY & MATCHING: The outfit is tastefully coordinated around the official group brand colors. The primary statement piece features ${primaryColor.formatted}, complemented by subtle accent details in ${secondaryColor.formatted}, seamlessly balanced with matching fashion neutrals (such as crisp white, rich ivory, warm camel, washed vintage denim, heather grey, or soft black). The top and bottom pieces complement each other in tone and texture for a cohesive, stylish, editorial fashion aesthetic (NO clashing colors, NO garish neon blocks, NO disjointed mismatched pieces).`;
  } else {
    return `OUTFIT COLOR HARMONY & MATCHING: The outfit is tastefully coordinated around the official group brand color ${primaryColor.formatted} as the hero piece or key motif, harmoniously balanced with stylish matching fashion neutrals (such as crisp white, rich ivory, warm camel, washed vintage denim, heather oatmeal, charcoal, or soft black). The top and bottom pieces complement each other in tone and texture for a cohesive, stylish, editorial fashion aesthetic (NO clashing colors, NO garish neon blocks, NO disjointed mismatched pieces).`;
  }
}

export function getDynamicOutfitDescription(
  fashionStyle: string, 
  seed: number, 
  colorWayPrompt: string, 
  genderStr: string,
  groupColors?: { name: string; hex?: string; description?: string }[]
): string {
  const normalizedStyle = (fashionStyle || '').toLowerCase();
  const isFemale = genderStr === 'female';

  let styleCategory: 'airport_casual' | 'practice_streetwear' | 'cozy_knitwear' | 'y2k_retro' | 'minimalist_chic' | 'preppy_academia' | 'vintage_denim' | 'sporty_athleisure' | 'highfashion_casual' | 'soft_aesthetic' = 'airport_casual';

  if (normalizedStyle.includes('airport') || normalizedStyle.includes('chic') || normalizedStyle.includes('classic')) {
    styleCategory = 'airport_casual';
  } else if (normalizedStyle.includes('street') || normalizedStyle.includes('dance') || normalizedStyle.includes('hip hop') || normalizedStyle.includes('skater')) {
    styleCategory = 'practice_streetwear';
  } else if (normalizedStyle.includes('cozy') || normalizedStyle.includes('knit') || normalizedStyle.includes('casual')) {
    styleCategory = 'cozy_knitwear';
  } else if (normalizedStyle.includes('y2k') || normalizedStyle.includes('cyber') || normalizedStyle.includes('acubi') || normalizedStyle.includes('baddie')) {
    styleCategory = 'y2k_retro';
  } else if (normalizedStyle.includes('minimalist') || normalizedStyle.includes('old money') || normalizedStyle.includes('clean') || normalizedStyle.includes('normcore')) {
    styleCategory = 'minimalist_chic';
  } else if (normalizedStyle.includes('preppy') || normalizedStyle.includes('academic') || normalizedStyle.includes('uniform') || normalizedStyle.includes('ivy')) {
    styleCategory = 'preppy_academia';
  } else if (normalizedStyle.includes('vintage') || normalizedStyle.includes('grunge') || normalizedStyle.includes('denim') || normalizedStyle.includes('rock')) {
    styleCategory = 'vintage_denim';
  } else if (normalizedStyle.includes('sporty') || normalizedStyle.includes('racing') || normalizedStyle.includes('athletic')) {
    styleCategory = 'sporty_athleisure';
  } else if (normalizedStyle.includes('high fashion') || normalizedStyle.includes('editorial') || normalizedStyle.includes('luxe')) {
    styleCategory = 'highfashion_casual';
  } else {
    styleCategory = 'soft_aesthetic';
  }

  // Master taxonomy of youthful, trendy, authentic everyday K-pop idol outfits across 10 aesthetic themes (6 distinct combinations per category)
  // REDESIGNED ADULT & TAILORED CLOTHING: Traditional tailoring (blazers, trench coats, waistcoats, button-downs, fluid slacks)
  // are creatively deconstructed, cropped, and re-engineered with youthful K-pop rookie idol energy (18-21 Gen-Z).
  // RICH GARMENT DESIGN DETAILS (NEVER A BARE CLOTHING OUTFIT): Polished silver hardware, two-way zippers, D-rings,
  // safety-pin brooches, chain swags, raw-cut hems, contrast stitching, knife pleats, and trompe-l'œil double waistbands.
  // Strictly NO military techwear, NO ripstop nylon, NO parachute pants, NO tactical utility straps, NO harness vests.
  const garments = {
    airport_casual: {
      female: [
        "a trendsetting 18-21 K-pop idol airport fashion look featuring a redesigned cropped deconstructed tailored blazer in rich suiting twill with raw frayed hems, sharp drop shoulders, silver heraldic shank buttons, and a decorative silver safety-pin brooch on the notched lapel, layered open over a fitted scoop-neck modal rib baby top with contrast overlock stitching, paired with high-waisted knife-pleated suiting trousers with a double-folded waistband, delicate silver chain drape across belt loops, and designer platform court sneakers",
        "an iconic idol airport OOTD featuring a cropped cotton-gabardine trench blouson with notched storm flaps, contrast leather-piped lapels, silver D-ring cuff cinch straps, and an exposed two-way silver industrial zipper, worn over an asymmetric shoulder-cutout ribbed baby top, paired with fluid wide-leg double-pleated slacks featuring split side hems with silver snap buttons and chunky retro platform trainers",
        "a stylish youthful airport ensemble with a cropped boxy washed denim trucker jacket featuring contrast golden topstitching, dual 3D flap chest pockets with silver donut snaps, and raw-cut frayed waistline, layered over a ribbed scoop-neck baby tee, paired with low-slung wide-leg skater puddle jeans with a double-prong silver grommet belt and platform sneakers",
        "an avant-garde idol airport look featuring an asymmetric tailored pinstripe suiting waistcoat with silver ball buttons and an open cutout back with a silver ring-buckle cinch strap, layered over a fine sheer mesh long-sleeve tee with thumbhole cuffs, paired with fluid wide-leg puddle slacks and designer platform derbies",
        "a modern youthful airport outfit featuring a slouchy distressed brushed mohair open-knit cardigan with laddered knit detailing and oversized custom engraved metal buttons, loosely buttoned over a baby tee with exposed contrast stitching, paired with a pleated hybrid denim-suiting mini-skort and silver chain-link belt",
        "a chic airport travel look featuring a long-sleeve zip-collar waffle henley top with bold contrast micro-overlock stitching, exposed silver industrial zipper, and thumbhole cuffs, paired with matching wide-leg lounge trousers featuring tailored front pintuck creases and a trompe-l'œil foldover waistband"
      ],
      male: [
        "an iconic 18-21 K-pop rookie idol airport look featuring a redesigned cropped deconstructed single-breasted wool blazer with sharp padded drop shoulders, raw frayed waistline, silver heraldic shank buttons, and a decorative silver safety-pin chain link brooch on the lapel, layered over a heavyweight combed-cotton skate tee with minimalist chest print, paired with relaxed wide-leg skater puddle jeans in washed vintage denim, a sturdy leather belt, and polished silver double-grommet buckle",
        "an avant-garde idol airport ensemble featuring a cropped cotton-gabardine trench blouson with an exaggerated storm flap, contrast leather-piped collar, silver D-ring cuff cinch straps, and a concealed two-way silver zipper, worn over a fine-gauge mock-neck knit, paired with fluid wide-leg double-pleated tailored trousers with sharp front pressed creases and split hems with silver snap buttons",
        "a sophisticated young idol off-duty look featuring a tailored subtle pinstripe suiting waistcoat with asymmetric front button closure and silver ring buckle back cinch strap, layered over an oversized crisp white poplin shirt with extended French cuffs peeking out and a loosely untied slim black tie, paired with relaxed wide-leg pleated trousers with a hanging silver chain accent",
        "a high-octane airport OOTD featuring a lightweight twill motorsport racing jacket with bold athletic geometric leatherette panels, snap-tab mandarin collar, and silver zip chest pockets, layered over a boxy skate tee, paired with relaxed wide-leg skater denim featuring 3D flap pockets with silver D-rings and retro runners",
        "a tactile off-duty airport fit featuring a slouchy oversized brushed open-knit mohair cardigan with natural horn buttons, dropped shoulders, and subtle laddered knit distressing over a clean skate tee with contrast overlock stitching, paired with relaxed wide-leg washed skater denim and a silver wallet chain",
        "a clean designer airport lounge set featuring a heavyweight waffle-knit drop-shoulder pullover with raw-edge split hems, exposed silver half-zip collar with ring pull, and thumbhole cuffs, paired with matching relaxed wide-leg waffle trousers with tailored front pintuck creases and metallic toggle drawstrings"
      ]
    },
    practice_streetwear: {
      female: [
        "a stylish dance practice room streetwear fit featuring a boxy cropped heavyweight French terry zip hoodie with a chunky two-way silver zipper unzipped from the bottom, raw-edge structural seams, and thumbhole cuffs, layered over a ribbed scoop-neck baby crop tank, paired with wide-leg baggy cargo sweatpants with silver D-rings and retro skate sneakers",
        "a cool off-duty dance outfit featuring an asymmetric shoulder-cutout long-sleeve fine baby rib top with silver zip teeth along the neckline and contrast flatlock stitching, paired with low-slung baggy cargo skater denim featuring 3D accordion pockets and a double-prong grommet belt",
        "a trendy dance-practice look featuring a cropped retro nylon track windbreaker jacket with metallic silver sleeve piping, high stand funnel collar, and exposed two-way chunky zipper with O-ring pull, paired with a knife-pleated high-teen tennis skort with built-in athletic contrast-stripe waistband",
        "an authentic K-pop dance studio fit featuring a short-sleeve sporty zip-up flight romper in structured matte nylon-cotton with an open stand collar, silver ring zipper, contrast athletic side-stripes, and an adjustable bungee drawstring cinch at the waist with polished metal toggles",
        "a modern street-dance OOTD featuring a fitted square-neck baby crop tee with contrast lettuce-edge overlock seams, layered under a cropped boxy canvas blouson with silver snaps, paired with low-slung wide-leg skater puddle jeans and platform skate shoes",
        "a stylish rehearsal ensemble featuring a slouchy off-shoulder wide-neck dance knit sweater with raw-cut distressed hems, revealing a contrast spaghetti strap, paired with a micro-pleated high-waisted mini-skort and chunky retro court shoes"
      ],
      male: [
        "a signature K-pop dance practice streetwear fit featuring an oversized 420gsm pigment-washed heavyweight French terry zip hoodie with a structured double-layer hood, raw-edge seam details, and chunky two-way silver zipper unzipped from the bottom, worn over a fitted white ribbed tank, paired with relaxed wide-leg canvas carpenter skate pants with utility hammer-loop detailing and reinforced knee panels",
        "a high-energy dance practice look with an oversized 90s-inspired lightweight nylon track windbreaker jacket featuring bold geometric sleeve panels, stand collar with exposed metallic two-way zip, and bungee toggle waist cinch, paired with relaxed baggy cargo skate pants with side flap pockets, silver D-rings, and bungee toggle hems",
        "an athletic streetwear look featuring a 340gsm heavyweight combed-cotton drop-shoulder boxy skate tee with structured ribbed collar and minimalist typography, layered over a waffle-knit long-sleeve tee with cuffs peeking out, paired with relaxed wide-leg skater puddle denim and a silver wallet chain",
        "an iconic dance practice OOTD featuring a lightweight twill motorsport racing jacket with athletic geometric leatherette panels, snap-tab mandarin collar, and silver zip pockets, layered over a clean tee, paired with relaxed wide-leg skater jeans and retro sneakers",
        "a modern street practice fit featuring a heavyweight 360gsm combed-cotton relaxed rugby polo knit with a crisp white poplin collar, horizontal chest stripe, concealed silver metal snap placket, and split side hems with herringbone tape, loosely half-tucked into wide puddle denim",
        "a stylish studio practice look featuring a premium heavyweight brushed-cotton plaid flannel overshirt with silver snap buttons, dual chest flap pockets with metal corner rivets, and raw frayed hem, worn open over a boxy skate tee, paired with relaxed wide skater denim"
      ]
    },
    cozy_knitwear: {
      female: [
        "a cozy-chic K-pop idol OOTD featuring a slouchy drop-shoulder brushed open-knit mohair cardigan with oversized custom engraved silver buttons and laddered distressed knit accents, loosely buttoned over a fitted fine-ribbed baby tee with contrast micro-overlock stitching, paired with a knife-pleated suiting skort and silver chain-link belt",
        "an effortless designer sweater look with an oversized chunky cable-knit pullover featuring deconstructed split side hems held by metallic ring tabs, layered over a crisp poplin collar peeking out, paired with a pleated denim mini-skort and leather platform boots",
        "a soft youthful casual outfit featuring a fine ribbed knit top with an asymmetric off-shoulder neckline and thumbhole cuffs, paired with relaxed wide-leg puddle jeans, a double-grommet belt, and clean platform sneakers",
        "a charming autumn casual look featuring a cropped boxy cardigan in brushed alpaca with contrast ribbed edges and silver shank buttons, layered over a scoop crop top, paired with high-waisted wide-leg puddle slacks with front pressed creases",
        "a stylish cozy-chic fit featuring an oversized rugby-striped knit polo sweater with a crisp contrast collar and concealed silver snap placket, paired with a pleated tennis mini-skort and retro sneakers with crew socks",
        "an effortless off-duty look featuring a zip-collar waffle-knit pullover with exposed silver ring zipper and contrast flatlock stitching, paired with matching wide-leg knit trousers with front pintuck seams"
      ],
      male: [
        "an effortless soft-boy everyday look featuring a slouchy oversized brushed open-knit mohair cardigan with natural horn buttons, dropped shoulders, and subtle laddered knit distressing over a clean skate tee with contrast overlock stitching, paired with baggy relaxed skater denim and a silver wallet chain",
        "a cozy designer OOTD featuring an oversized chunky cable-knit sweater with raw-edge split side hems, layered over a white waffle long-sleeve tee with cuffs peeking out, paired with relaxed wide-leg skater puddle denim and a sturdy leather belt",
        "a relaxed knitwear look featuring a heavyweight waffle-knit drop-shoulder pullover with raw-edge hems, exposed silver half-zip collar with ring pull, and thumbhole cuffs, paired with wide-leg carpenter skate pants with hammer-loop detailing",
        "a handsome casual knit outfit featuring an oversized varsity V-neck knit sweater with bold contrast striped collar trim, layered over a crisp crewneck tee, paired with relaxed wide skater puddle denim and a silver buckle belt",
        "an effortless casual sweater fit with a soft oversized striped crewneck knit featuring drop shoulders and ribbed cuffs, paired with vintage-washed wide-leg skater denim and retro skate shoes",
        "a cozy idol off-duty look featuring a zip-collar fisherman rib sweater with an industrial silver zipper, paired with relaxed wide-leg tailored trousers featuring sharp front creases and platform sneakers"
      ]
    },
    y2k_retro: {
      female: [
        "a trendy Y2K casual outfit featuring a fitted short-sleeve baby tee with contrast raglan sleeves, ribbed crewneck, and subtle athletic micro-lettering, French-tucked into low-slung wide-leg baggy skater puddle jeans with a double-prong silver grommet belt and chunky platform runners",
        "a retro-chic outfit featuring a cropped satin-twill varsity bomber jacket with metallic silver snap buttons, striped rib-knit collar and cuffs, and sleeve crest embroidery, layered over a scoop baby crop tee, paired with a high-waisted pleated tennis skort with an athletic striped waistband",
        "a stylish Y2K casual fit featuring an asymmetric shoulder-cutout baby crop top with contrast silver zip teeth along the neckline, paired with low-rise relaxed baggy cargo skater pants featuring 3D utility pockets and silver D-rings",
        "a vintage 2000s streetwear OOTD featuring a cropped washed denim trucker jacket with corset-style lace-up eyelets along the back waist, paired with low-rise wide-leg skater jeans and chunky platform sneakers",
        "a cute Y2K aesthetic look featuring a baby tee with retro athletic typography and lettuce-edge contrast seams, paired with a pleated utility cargo mini-skort with accordion pockets and silver buckle hardware",
        "a stylish retro pop outfit featuring a cropped retro track windbreaker with contrast metallic piping and two-way O-ring zipper, paired with ultra-wide puddle jeans and platform sneakers"
      ],
      male: [
        "a retro Y2K casual outfit featuring a color-blocked raglan skate tee in heavy combed cotton with contrast collar ribbing, paired with wide-leg distressed skater puddle jeans, a double-grommet leather belt, and chunky retro runners",
        "a cool Y2K streetwear look featuring a lightweight twill motorsport racing jacket with bold athletic leatherette panels, snap-tab mandarin collar, and silver zip chest pockets, paired with loose baggy cargo skater pants with silver D-rings",
        "a retro-futuristic casual ensemble with a zip-up mock-neck track jacket featuring metallic silver sleeve stripes, paired with relaxed wide skater denim and a silver wallet chain",
        "a trendy 2000s street look featuring an oversized boxy jersey with vintage athletic typography and contrast sleeve bands, paired with loose wide-leg faded denim and chunky retro sneakers",
        "a retro skater outfit featuring an unbuttoned vintage brushed flannel overshirt with metal corner rivets over a graphic skate tee, paired with baggy low-slung puddle jeans and classic skate shoes",
        "a stylish retro streetwear fit with an oversized 90s windbreaker jacket featuring geometric color-blocking and bungee cinch hem, paired with relaxed wide track pants and platform sneakers"
      ]
    },
    minimalist_chic: {
      female: [
        "a clean Gen-Z minimalist everyday outfit featuring a redesigned cropped boxy cotton-poplin button-down shirt with an asymmetric collar, extended French cuffs with silver links, and back corset-lacing, French-tucked into high-waisted fluid wide-leg double-pleated slacks with split hems and silver snap buttons",
        "a modern clean-aesthetic look featuring an asymmetric shoulder-cutout fine baby rib top with thumbhole cuffs, paired with fluid wide-leg puddle trousers with front pressed creases, a sleek leather belt with polished silver buckle, and platform loafers",
        "a chic minimalist ensemble featuring a cropped deconstructed tailored blazer in charcoal suiting twill with raw frayed hems, sharp padded shoulders, and silver heraldic shank buttons, worn open over a ribbed baby tank, paired with a high-waisted pleated suiting skort with double waistband",
        "a sophisticated modern look featuring a tailored subtle pinstripe suiting waistcoat with an asymmetric hem and cutout back with silver buckle cinch, layered over a sheer tissue-weight long-sleeve tee, paired with fluid wide-leg puddle trousers and designer derbies",
        "an effortless clean look with a square-neck ribbed modal baby tank with contrast lettuce-edge seams, paired with relaxed high-waisted wide skater puddle denim and a double-grommet belt",
        "a stylish modern clean outfit featuring a cropped cotton-gabardine trench blouson with silver D-ring cuff cinch straps and an exposed two-way silver industrial zipper, paired with wide-leg relaxed denim and platform sneakers"
      ],
      male: [
        "a sleek Gen-Z minimalist casual look featuring a redesigned cropped deconstructed wool-blend blazer with sharp padded drop shoulders, raw frayed waistline, and polished silver shank buttons, layered over a heavyweight combed-cotton skate tee, paired with relaxed wide-leg skater puddle denim and a double-grommet leather belt",
        "a modern minimalist everyday outfit featuring an asymmetric tailored pinstripe suiting waistcoat with silver ring buckle back cinch strap, layered over an oversized crisp white poplin shirt with extended French cuffs peeking out and a loosely untied slim tie, paired with relaxed wide-leg pleated trousers with a silver chain accent",
        "a refined casual look featuring an avant-garde cropped cotton trench blouson with exaggerated storm flaps and silver D-ring cuff cinch straps over a fine-gauge mock-neck knit, paired with fluid wide-leg double-pleated tailored trousers with split snap hems",
        "a clean aesthetic OOTD featuring a 340gsm heavyweight boxy drop-shoulder tee in clean combed cotton with structured collar, layered over a waffle-knit long-sleeve tee with cuffs peeking out, paired with relaxed wide skater pants and clean platform sneakers",
        "a handsome minimalist outfit featuring a boxy cropped Harrington zip blouson with industrial silver zipper and snap cuffs over a white crewneck skate tee, paired with relaxed wide-leg denim and designer sneakers",
        "an understated modern ensemble featuring a heavyweight waffle-knit half-zip pullover with raw-edge split hems and exposed silver zipper, paired with relaxed wide-leg trousers with front pintuck creases"
      ]
    },
    preppy_academia: {
      female: [
        "a high-teen Korean preppy casual fit featuring an inventive deconstructed poplin button-down shirt with extended French cuffs with silver links, asymmetric collar, and back corset-lacing, layered under a cropped asymmetric cable-knit vest with raw-cut split sides held by metallic ring tabs, paired with a knife-pleated tennis mini-skort and platform loafers with white crew socks",
        "a stylish campus casual outfit featuring a cropped boxy navy suiting blazer with raw deconstructed frayed hems, polished silver heraldic shank buttons, and a decorative silver safety-pin brooch on the notched lapel, layered over a fitted baby tee, paired with a pleated suiting skort with double waistband and Mary Janes",
        "a trendy high-teen preppy OOTD featuring an oversized collegiate crest varsity bomber jacket with metallic snap buttons and striped rib knit trim, paired with a high-waisted pleated tennis skort and platform derbies with crew socks",
        "a cute academic aesthetic outfit featuring a tailored pinstripe suiting waistcoat with asymmetric button closure and cutout back, layered over a crisp collared poplin shirt with slim untied black ribbon tie, paired with a high-waisted knife-pleated skirt and platform loafers",
        "a modern preppy look featuring a fitted cropped cardigan with contrast athletic tipping and silver crest buttons over a baby tee, paired with a pleated denim-suiting hybrid mini-skort with silver chain belt",
        "a collegiate casual fit featuring an oversized V-neck cable cricket knit sweater with contrast striped collar, paired with a white knife-pleated tennis skort and clean retro court sneakers"
      ],
      male: [
        "a stylish high-teen varsity preppy outfit featuring a satin-twill varsity bomber jacket with metallic silver snap buttons, striped ribbed collar, and sleeve crest embroidery over a clean white tee, paired with relaxed wide-leg skater denim, leather belt, and retro court sneakers",
        "a fresh preppy everyday look featuring an asymmetric tailored suiting waistcoat with silver ring buckle back cinch strap, layered over an oversized crisp white poplin shirt with extended cuffs peeking out and a loosely untied slim necktie, paired with relaxed wide skater trousers and platform loafers",
        "a campus-aesthetic fit featuring an oversized brushed mohair cardigan with contrast varsity stripes and natural horn buttons over a clean skate tee, paired with relaxed wide-leg washed jeans and a silver wallet chain",
        "an iconic K-pop preppy look featuring a heavyweight 360gsm combed-cotton relaxed rugby polo knit with a crisp white poplin collar, horizontal chest stripe, concealed silver metal snap placket, and split side hems with herringbone tape, loosely half-tucked into wide puddle denim",
        "a modern collegiate outfit featuring a redesigned cropped deconstructed wool blazer with raw frayed waistline and silver shank buttons over a hooded sweatshirt, paired with wide-leg skater jeans and basketball shoes",
        "a casual campus look featuring a crewneck knit sweater with collegiate varsity lettering and contrast striped V-neck trim, paired with relaxed wide-leg washed denim and clean skate sneakers"
      ]
    },
    vintage_denim: {
      female: [
        "an edgy original everyday look featuring a boxy cropped washed denim trucker jacket with contrast golden topstitching, dual 3D flap chest pockets with silver donut snaps, raw-edge frayed waistline, and corset-style lace-up eyelets along the back waist, layered open over a fitted ribbed baby crop tank, paired with low-slung wide-leg skater puddle jeans with a double-prong silver grommet belt",
        "a retro denim-on-denim outfit featuring a cropped moto blouson jacket in washed denim with asymmetric silver metallic zippers, snap-down studded lapels, and buckled waist tabs, paired with low-rise wide-leg skater puddle jeans and silver hardware",
        "a vintage grunge-casual look with an oversized brushed plaid flannel overshirt with metal corner rivets over a faded graphic baby tee with contrast overlock stitching, paired with relaxed wide-leg skater denim and platform boots",
        "a trendy retro denim outfit featuring a boxy cropped denim trucker jacket paired with a matching high-waisted knife-pleated denim mini-skort with visible tailored waistband and silver grommet belt",
        "a cool 90s vintage fit featuring a lightweight satin varsity bomber jacket over a fitted scoop baby crop tee, paired with relaxed light-wash wide skater puddle jeans with side hammer loop and platform sneakers",
        "a casual vintage rock look featuring an asymmetric shoulder-cutout baby tee with silver zip teeth, paired with vintage high-rise wide skater denim and a double-grommet belt"
      ],
      male: [
        "a rugged vintage-cool outfit featuring a boxy cropped vintage-washed denim trucker jacket with contrast golden topstitching, dual 3D flap chest pockets with silver donut buttons, raw-edge waistline, and buckled waist-adjuster tabs, layered open over a soft waffle-knit long-sleeve tee with cuffs peeking out, paired with relaxed wide-leg skater puddle jeans in washed denim with a silver wallet chain and sturdy leather belt",
        "a vintage denim-on-denim look featuring a washed denim trucker jacket with silver shank hardware over a heavyweight skate tee, paired with matching wide-leg skater puddle jeans with subtle whisker fading and clean hems",
        "a cool vintage grunge fit featuring a premium heavyweight brushed-cotton plaid flannel overshirt with silver snap buttons, dual chest flap pockets with metal corner rivets, and raw frayed hem, worn open over a boxy skate tee, paired with relaxed wide skater denim",
        "a classic vintage street OOTD featuring a boxy corduroy overshirt with silver snap buttons over a clean white skate tee, paired with wide-leg raw-edge skater denim and retro skate shoes",
        "an edgy vintage street look featuring a lightweight twill motorsport racing jacket with bold athletic leatherette panels and silver zip pockets, paired with black relaxed wide-leg skater jeans and platform sneakers",
        "a 90s retro casual ensemble with a vintage washed workwear canvas jacket over a heavyweight tee, paired with loose-fit baggy carpenter skater denim with hammer-loop detailing and reinforced knee panels"
      ]
    },
    sporty_athleisure: {
      female: [
        "a trendy athleisure OOTD featuring a cropped retro nylon track windbreaker jacket with contrast metallic silver sleeve piping, high stand funnel collar, and an exposed two-way chunky zipper with O-ring pull, worn partially open over a fitted ribbed scoop crop top, paired with a high-waisted knife-pleated high-teen tennis skort with built-in athletic contrast-stripe waistband and retro court runners",
        "a sporty off-duty outfit featuring a tailored short-sleeve zip-up track romper in structured matte nylon-cotton with an open stand collar, silver ring zipper, contrast athletic side-stripes, dual chest zip pockets, and an adjustable bungee drawstring cinch at the waist with polished metal toggles",
        "a chic athletic fit featuring a cropped two-way zip-up French terry hoodie unzipped from the bottom, raw-edge seams, and thumbhole cuffs, paired with wide-leg French terry sweatpants with silver D-rings and chunky platform sneakers",
        "a cool sports-street look with an oversized racing jersey with athletic typography and contrast piping, paired with a pleated tennis mini-skort and chunky retro sneakers with crew socks",
        "a stylish off-duty athlete look featuring a fitted half-zip athletic pullover with contrast micro-overlock stitching and silver ring zipper, paired with low-slung baggy cargo track pants with bungee toggle hems and runners",
        "a trendy dance-to-street fit featuring an asymmetric ribbed athletic crop top with silver zip teeth along the neckline, paired with low-slung wide-leg track pants with contrast side-stripes and court sneakers"
      ],
      male: [
        "a sporty off-duty outfit featuring an oversized 90s-inspired lightweight nylon track windbreaker jacket with bold geometric sleeve panels, stand collar with exposed metallic two-way zip, and bungee toggle waist cinch, layered open over a fitted white ribbed tank, paired with relaxed baggy cargo skate pants with side flap pockets, silver D-rings, and bungee toggle hems",
        "an athletic everyday fit featuring a sporty short-sleeve flight jumpsuit in durable lightweight cotton-nylon twill with a clean stand collar, two-way silver front zipper, chest zip pockets, and an adjustable bungee drawstring cinch at the waist with polished metal toggles",
        "a retro sportswear look with a lightweight twill motorsport racing jacket with bold athletic geometric leatherette panels, snap-tab mandarin collar, and silver zipped chest pockets, paired with wide-leg track pants and classic runners",
        "an iconic K-pop sporty look featuring a heavyweight 360gsm combed-cotton relaxed rugby polo knit with crisp white poplin collar, horizontal chest stripe, and concealed silver metal snap placket, paired with relaxed wide skater puddle denim",
        "a clean athleisure fit with an oversized 420gsm pigment-washed heavyweight French terry zip hoodie with chunky two-way silver zipper unzipped from the bottom, paired with relaxed wide-leg canvas carpenter skate pants with hammer-loop detailing",
        "a retro athletic ensemble featuring a boxy color-blocked track windbreaker pullover with bungee toggle hem, paired with relaxed wide-leg track pants with contrast piping and retro sneakers"
      ]
    },
    highfashion_casual: {
      female: [
        "a high-fashion casual street look featuring a redesigned cropped deconstructed tailored suiting blazer in rich twill with sharp padded drop shoulders, raw frayed hem cut right at the waistline, polished silver heraldic shank buttons, and a decorative cluster of silver safety-pin chain brooches on the notched lapel, layered over a fitted modal rib baby top with contrast overlock stitching, paired with a high-waisted knife-pleated suiting skort with trompe-l'œil double waistband and silver double-grommet belt",
        "an editorial casual outfit featuring a cropped cotton-gabardine trench blouson with wide notched storm flaps, contrast leather-piped collar, buckled silver D-ring cuff cinch straps, and an exposed two-way silver industrial zipper, worn over an asymmetric shoulder-cutout ribbed top, paired with fluid wide-leg double-pleated tailored trousers with split side hems with silver snap buttons",
        "a stylish high-fashion OOTD with a tailored subtle pinstripe suiting vest featuring an asymmetric pointed hemline, polished silver ball buttons, and an open cutout back with an adjustable silver ring-buckle cinch strap, layered over a fine sheer mesh long-sleeve tee with thumbhole cuffs, paired with fluid wide-leg puddle slacks with front knife pleats and delicate hanging silver chain drape",
        "a chic avant-garde daily look featuring an inventive poplin button-down shirt with extended French cuffs with silver links, asymmetric pointed collar, and back corset-lacing, layered under a cropped asymmetric cable-knit vest with raw-cut split sides held by metallic ring tabs, paired with a knife-pleated suiting mini-skort",
        "a modern off-duty runway outfit featuring a cropped washed cotton-twill moto blouson with asymmetric silver metallic zippers, snap-down studded lapels, and dual buckled waist tabs, worn open over a fitted square-neck baby crop top, paired with a structured pleated utility cargo mini-skort with 3D accordion pockets and silver D-rings",
        "an effortless high-fashion casual ensemble featuring a slouchy drop-shoulder brushed open-knit mohair cardigan with oversized custom engraved metal buttons and laddered distressed knit accents, loosely buttoned over a fitted baby tee with exposed contrast stitching, paired with a pleated hybrid denim-suiting mini-skort and silver chain-link belt"
      ],
      male: [
        "a high-fashion casual ensemble featuring a redesigned cropped deconstructed single-breasted wool-blend blazer with sharp padded drop shoulders, raw deconstructed fray hem cut at the waistline, polished silver heraldic shank buttons, and a decorative silver safety-pin chain link brooch on the notched lapel, layered over a heavyweight combed-cotton skate tee, paired with relaxed wide-leg skater puddle jeans with a sturdy leather belt and polished silver double-grommet buckle",
        "an editorial street look featuring an avant-garde cropped cotton-gabardine trench blouson with an exaggerated storm flap, contrast leather-piped collar, silver D-ring cuff cinch straps, and a concealed two-way silver zipper over a fine-gauge mock-neck knit, paired with fluid wide-leg double-pleated tailored trousers with sharp front pressed creases and split side hems with silver snap buttons",
        "a modern high-fashion casual outfit featuring a tailored subtle pinstripe suiting waistcoat with asymmetric front button closure and silver ring buckle back cinch strap, layered over an oversized crisp white poplin shirt with extended French cuffs peeking out and a loosely untied slim black necktie, paired with relaxed wide-leg pleated trousers with a hanging silver chain accent",
        "a directional runway-casual outfit featuring a boxy cropped vintage-washed denim trucker jacket with contrast golden topstitching, dual 3D flap chest pockets with silver donut buttons, raw-edge waistline, and buckled waist-adjuster tabs over a waffle-knit long-sleeve tee with cuffs peeking out, paired with relaxed wide-leg skater puddle denim and a silver wallet chain",
        "a sophisticated high-fashion off-duty look featuring a lightweight twill motorsport racing jacket with bold athletic geometric leatherette panels, snap-tab mandarin collar, and silver zipped chest pockets, paired with relaxed wide-leg baggy cargo skater denim with 3D flap pockets and silver D-rings",
        "a modern sculptural street ensemble featuring a slouchy oversized brushed open-knit mohair cardigan with natural horn buttons, dropped shoulders, and subtle laddered knit distressing over a skate tee with contrast overlock stitching, paired with baggy relaxed skater denim and a silver wallet chain"
      ]
    },
    soft_aesthetic: {
      female: [
        "a dreamy soft-aesthetic everyday outfit featuring a delicate sheer organza-paneled baby blouse with ruffled collar and pearl-centered silver buttons over a silk camisole, paired with a pleated tennis mini-skort with a visible tailored waistband, delicate silver chain belt, and platform Mary Janes with crew socks",
        "a soft romantic casual look featuring a ruffled tie-front baby blouse with contrast lettuce-edge seams, paired with high-waisted light-wash wide skater puddle denim with subtle floral rivet hardware and platform court sneakers",
        "a charming soft-girl OOTD featuring a pastel fluffy brushed mohair cardigan with oversized custom engraved silver buttons over a delicate camisole crop top, paired with a knife-pleated mini-skirt and retro sneakers",
        "an ethereal daily outfit featuring a puff-sleeve baby blouse with back ribbon lace-up detailing, paired with high-waisted relaxed light-wash wide puddle denim with a double-grommet belt and platform loafers",
        "a gentle romantic look with a sweetheart-neckline ribbed knit crop top with contrast micro-overlock stitching, paired with a fluid pleated mini-skort in dusty pastel twill and clean retro sneakers",
        "a soft pastel casual fit with a cropped boxy cable-knit vest with split sides held by metallic ring tabs over a crisp collared poplin shirt, paired with a pleated tennis skort and white canvas sneakers"
      ],
      male: [
        "a charming soft-boy look featuring a boxy short-sleeve camp-collar bowling shirt in textured slub cotton with contrast collar piping, custom chest embroidery, and silver shank buttons, worn open over a clean white long-sleeve waffle tee, paired with relaxed wide-leg light skater jeans and a silver wallet chain",
        "a soft casual outfit featuring an oversized pastel crewneck sweater in brushed mohair wool with drop shoulders and ribbed cuffs, paired with relaxed wide skater puddle denim with a clean leather belt and silver buckle",
        "an effortless soft-aesthetic look featuring a slouchy pastel brushed mohair cardigan with natural horn buttons over a clean white skate tee with contrast overlock stitching, paired with wide-leg light-wash skater jeans",
        "a gentle aesthetic OOTD featuring an oversized baby-blue Oxford shirt with extended cuffs with silver links over a white ribbed tank, paired with relaxed wide-leg denim and clean canvas shoes",
        "a charming romantic casual fit featuring a textured crochet-knit short-sleeve shirt with mother-of-pearl buttons over a white tank, paired with fluid wide-leg double-pleated light trousers with split snap hems",
        "a soft-boy everyday look with a lightweight 360gsm combed-cotton pastel knit rugby polo with crisp white poplin collar and concealed silver snap placket, paired with relaxed-fit wide light skater denim and minimalist white sneakers"
      ]
    }
  };

  const categoryGarments = garments[styleCategory] || garments.airport_casual;
  const options = isFemale ? categoryGarments.female : categoryGarments.male;
  const putTogetherPool = isFemale ? FEMALE_PUT_TOGETHER_OUTFITS : MALE_PUT_TOGETHER_OUTFITS;
  const effectiveIndex = Math.abs(seed);
  
  // Extract real group colors with hex codes or clean names
  let primaryTone = "rich navy suiting wool";
  let secondaryTone = "crisp optic white";
  let neutralTone = "tailored charcoal wool";

  if (groupColors && groupColors.length > 0) {
    const c0 = groupColors[0];
    const c1 = groupColors.length > 1 ? groupColors[1] : null;
    const c2 = groupColors.length > 2 ? groupColors[2] : null;

    primaryTone = (c0.name || 'Official Tone') + (c0.hex ? ` (${c0.hex})` : '');
    secondaryTone = c1 ? `${c1.name || 'Secondary Tone'}${c1.hex ? ` (${c1.hex})` : ''}` : "crisp optic white";
    neutralTone = c2 ? `${c2.name || 'Neutral Tone'}${c2.hex ? ` (${c2.hex})` : ''}` : "tailored charcoal wool";
  } else if (colorWayPrompt) {
    const matches = colorWayPrompt.match(/"([^"]+)"/g);
    if (matches && matches.length > 0) {
      primaryTone = matches[0].replace(/"/g, '');
      if (matches.length > 1) secondaryTone = matches[1].replace(/"/g, '');
    }
  }

  // Blend curated taxonomy coordinates with category garments for massive variety
  let chosenGarment = "";
  if (effectiveIndex % 2 === 0 && putTogetherPool.length > 0) {
    const putTogetherItem = putTogetherPool[effectiveIndex % putTogetherPool.length];
    chosenGarment = putTogetherItem.buildDescription(primaryTone, secondaryTone, neutralTone);
  } else {
    chosenGarment = options[effectiveIndex % options.length];
  }

  return `a custom, impeccably styled K-pop idol designer coordinate designed like a creative idol fashion stylist for their "${fashionStyle}" personal style concept. The outfit features ${chosenGarment}. ${colorWayPrompt}. STRICT OUTFIT COHESION & GROUP COLOR HARMONY: The entire coordinate is thoughtfully styled around official group colors (${primaryTone} on the statement piece, accented with ${secondaryTone}, balanced by ${neutralTone}). The top and bottom pieces belong to the same cohesive aesthetic with matching tailoring, silhouette balance, and natural cloth drape. ZERO disjointed garments, ZERO clashing colors, and ZERO mismatched pieces. YOUTHFUL KOREAN IDOL CASUAL DIRECTIVE (STRICTLY AGE 18-21 ROOKIE IDOL): Even if the outfit is casual, it is NEVER basic, boring, or generic. It embodies authentic modern Korean idol casual fashion (K-Fashion as seen in Seoul idol airport fashion, Seongsu street style, and dance-practice chic)—giving the idol wearing it an undeniable aesthetic persona, charisma, and effortless cool factor. REDESIGNED ADULT & TAILORED CLOTHING: Adult or tailored pieces (blazers, trench coats, button-downs, waistcoats, slacks, coats) ARE WELCOME, but they MUST be creatively REDESIGNED and deconstructed with youthful K-pop flair (cropped boxy cuts, raw-edge fray hems, asymmetric lapels, cutout details, silver hardware, layered styling). NEVER render them as stiff, boring, or corporate 9-to-5 adult office clothes. RICH CLOTHING DESIGN DETAILS (NEVER A BARE CLOTHING OUTFIT): The garments must NEVER be plain or bare. They must have visible, intricate clothing design details built into the garments: polished silver shank buttons, exposed two-way zippers with ring pulls, silver D-rings, grommets, chain drapes, safety-pin hardware links, contrast overlock seams, architectural pleats, split cuffs, and trompe-l'œil double waistbands. CRITICAL FOR FRAMING: Even in a waist-up upper body camera framing, render BOTH the top piece AND the visible waistband/top of the trousers or skirt so the outfit feels complete, harmonized, and stylish. ABSOLUTELY NO techwear, NO ripstop nylon, NO parachute pants, NO tactical utility straps, NO harness vests, NO combat gear, NO plain blank undershirts, and NO basic boring clothes.`;
}

export interface BespokeFandomSloganResult {
  primarySlogan: string;
  alternativeSlogans: string[];
  greetingMotto?: string;
  greetingGesture?: string;
  nameOrigin?: string;
  pronunciation?: string;
}

export const generateBespokeFandomSlogans = async (
  groupName: string,
  fandomName: string,
  conceptDescription: string,
  officialColors?: { name: string; hex: string }[]
): Promise<BespokeFandomSloganResult> => {
  const colorsText = officialColors && officialColors.length > 0
    ? officialColors.map(c => `${c.name} (${c.hex})`).join(', ')
    : 'official brand colors';

  const prompt = `You are the Master Creative Director & Fandom Branding Architect at a legendary K-pop agency.
Generate a set of 100% ORIGINAL, ULTRA-BESPOKE, NON-GENERIC Fandom Mottos, Concert Slogans, Pronunciation Guide, and Group Greetings for:
- Group Name: "${groupName}"
- Fandom Name: "${fandomName}"
- Core Narrative & Musical Concept: "${conceptDescription}"
- Official Color Palette: ${colorsText}

STRICT BANNED CLICHÉS (ABSOLUTELY FORBIDDEN):
- NEVER output generic Western motivational slogans or corporate rebellion lines:
  "Tear up the script", "Break the mold", "Break the mode", "Rewrite the rules", "Shatter expectations", "Defy the odds", "Burn the stage", "Redefine reality", "Carve your path", "Unleash the storm", "Light up the dark", "Make them look", "Here to conquer", "Shining forever", "We are one", "Forever together", "Always by your side", "Never give up".
- DO NOT sound like a Western movie trailer or AI chatbot. Real K-pop idols speak with charm, style, synchronization, and respect.

AUTHENTIC K-POP GREETING INDUSTRY STANDARD:
The group greeting motto MUST follow the iconic synchronized K-pop formula:
[Leader Count-in: '둘, 셋!' / '하나, 둘!' / 'Ready, get set!'] + [Punchy 1-3 word signature hook / concept call referencing '${groupName}'] + "안녕하세요, ${groupName}입니다! (Hello, we are ${groupName}!)"
Examples of real group formulas:
- "Dive into IVE! 안녕하세요, 아이브입니다!"
- "둘, 셋! IM FEARLESS! 안녕하세요, 르세라핌입니다!"
- "Say the name! SEVENTEEN! 안녕하세요, 세븐틴입니다!"
- "Step Out! 안녕하세요, 스트레이 키즈입니다!"
- "One, two, connect! 안녕하세요, ENHYPEN입니다!"

OUTPUT FORMAT (JSON):
{
  "primarySlogan": "string (The most iconic, punchy 2-5 word official concert banner slogan)",
  "alternativeSlogans": [
    "string (Option 1: Poetic / Lore-driven slogan)",
    "string (Option 2: Clever wordplay connecting groupName and fandomName)",
    "string (Option 3: Stadium encore emotional fan-chant)",
    "string (Option 4: High-energy bold tagline)"
  ],
  "greetingMotto": "string (Exact formula: '[Count-in] [Punchy 1-3 word hook]! 안녕하세요, ${groupName}입니다! (Hello, we are ${groupName}!)')",
  "greetingGesture": "string (Hyper-specific, kinetic multi-step hand movement reflecting their logo/lore)",
  "pronunciation": "string (Simple, clear phonetic pronunciation of the fandom name, e.g. 'ZEH-rose', 'fear-not', 'ah-tee-nee', 'glit', 'mo-ah')",
  "nameOrigin": "string (Concise, charming 6-14 word explanation of the fandom name origin & meaning)"
}
`;

  try {
    const { data } = await generateKpopGroupData<BespokeFandomSloganResult>(prompt);
    if (data && data.primarySlogan) {
      return {
        ...data,
        greetingMotto: sanitizeKpopGreeting(data.greetingMotto, groupName),
        greetingGesture: sanitizeKpopGesture(data.greetingGesture, groupName)
      };
    }
  } catch (err) {
    console.error("Failed to generate bespoke slogans:", err);
  }

  // Smart authentic fallback if network fails
  const fallbackGreeting = sanitizeKpopGreeting(undefined, groupName);
  const fallbackGesture = sanitizeKpopGesture(undefined, groupName);

  return {
    primarySlogan: `Rooted in ${groupName}, blooming forever with ${fandomName}`,
    alternativeSlogans: [
      `When ${groupName} speaks, ${fandomName} echoes across the stars`,
      `Our shared frequency, our loudest heart: ${fandomName}`,
      `Two worlds united under one rhythm: ${groupName} & ${fandomName}`,
      `Every heartbeat belongs to ${fandomName}`
    ],
    greetingMotto: fallbackGreeting,
    greetingGesture: fallbackGesture,
    nameOrigin: `Represents the irreplaceable bond and shared heartbeat that completes ${groupName}.`,
    pronunciation: fandomName
  };
};

// ==========================================
// TRACK MV SETTING & MEMBER CONCEPT OUTFITS
// ==========================================

export interface TrackMvArchetype {
  id: string;
  settingName: string;
  settingDescription: string;
  colorGradingAndAtmosphere: string;
  cinematicVibe: string;
  keyVisualMotifs: string[];
  cameraWorkAndLighting: string;
}

export const TRACK_MV_SETTING_ARCHETYPES: TrackMvArchetype[] = [
  {
    id: "modern_rooftop",
    settingName: "Modernist Concrete Rooftop & Twilight Horizon",
    settingDescription: "A sleek open-air architectural concrete rooftop overlooking a panoramic twilight cityscape skyline, featuring clean glass railings, geometric ambient uplighting, and a gentle evening breeze.",
    colorGradingAndAtmosphere: "Cool slate-blue evening tones, golden twilight city glow on the horizon, and clean natural cinematic contrast.",
    cinematicVibe: "Sleek, atmospheric urban mood with effortless superstar presence.",
    keyVisualMotifs: ["City twilight horizon", "Glass balustrades", "Geometric LED floor lines", "Evening ambient breeze"],
    cameraWorkAndLighting: "Wide anamorphic 16:9 full-length framing, soft golden hour rim light, and smooth camera tracking."
  }
];

// =========================================================================
// K-POP COORDINATED MIX-AND-MATCH CAPSULE WARDROBE SYSTEM
// In K-pop styling, all idols strictly share the EXACT SAME 2-3 color scheme
// and matching fabrics, while wearing distinct modular mix-and-match silhouettes
// =========================================================================

export interface KpopMixMatchCapsule {
  id: string;
  name: string;
  themeSummary: string;
  primaryFabrics: string;
  sharedHardware: string;
  colorPalettes: {
    baseColor: string;
    secondaryColor: string;
    accentColor: string;
    paletteString: string;
  }[];
  maleSilhouettes: {
    title: string;
    cutName: string;
    buildDescription: (base: string, sec: string, acc: string, fabrics: string, hw: string) => string;
    accessories: string[];
    vibe: string;
  }[];
  femaleSilhouettes: {
    title: string;
    cutName: string;
    buildDescription: (base: string, sec: string, acc: string, fabrics: string, hw: string) => string;
    accessories: string[];
    vibe: string;
  }[];
}

export const KPOP_MIX_MATCH_CAPSULES: KpopMixMatchCapsule[] = [
  {
    id: "runway_tailoring",
    name: "Runway Deconstructed Suiting & Poplin Capsule",
    themeSummary: "Sharp architectural suiting remixed into modular stage cuts. All members share bespoke suiting wool, poplin layering, and brushed silver hardware.",
    primaryFabrics: "tailored fine-wool suiting twill and crisp 100% cotton poplin",
    sharedHardware: "brushed silver chain link details, collar tips, and minimalist chrome buckle tabs",
    colorPalettes: [
      {
        baseColor: "Charcoal Slate",
        secondaryColor: "Chalk White",
        accentColor: "Crimson Cherry Red",
        paletteString: "Charcoal Slate, Crisp Chalk White, and Crimson Cherry"
      },
      {
        baseColor: "Matte Jet Black",
        secondaryColor: "Pure Optic White",
        accentColor: "Titanium Silver",
        paletteString: "Matte Jet Black, Pure Optic White, and Titanium Silver"
      },
      {
        baseColor: "Deep Midnight Navy",
        secondaryColor: "Warm Cream",
        accentColor: "Polished Chrome",
        paletteString: "Deep Midnight Navy, Warm Cream, and Polished Chrome"
      },
      {
        baseColor: "Smoked Ash Grey",
        secondaryColor: "Pale Ivory",
        accentColor: "Smoked Burgundy",
        paletteString: "Smoked Ash Grey, Pale Ivory, and Smoked Burgundy"
      }
    ],
    maleSilhouettes: [
      {
        title: "Capsule Mix: Boxy Deconstructed Jacket & Pleated Wide Trousers",
        cutName: "Boxy Tailored Jacket Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Cut from the group's matching ${base} ${fabrics} featuring subtle ${acc} lapel piping and ${hw}. Member wears the collection's boxy structured blazer over the group's ${sec} poplin collared shirt, paired with the collection's matching ${base} high-rise fluid pleated wide-leg puddle trousers with matching belt, and polished black leather chunky derbies.`,
        accessories: ["Brushed titanium collar tips", "Minimalist silver signet band", "Leather dress watch"],
        vibe: "Commanding, sophisticated runway authority with effortless precision."
      },
      {
        title: "Capsule Mix: Asymmetric Suiting Vest & Poplin Tie with Straight Slacks",
        cutName: "Asymmetric Tailored Vest Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Cut from the group's exact same ${base} ${fabrics} with clean side-buckle ${hw}. Member wears the collection's asymmetric tailored suiting vest over the group's ${sec} poplin shirt styled with a sleek ${acc} tie, paired with the group's matching ${base} straight-leg pressed wool slacks and lug-sole dress shoes.`,
        accessories: ["Layered micro curb chains", "Brushed chrome ring set", "Minimalist ear drop"],
        vibe: "Sleek, avant-garde elegance with poetic grace."
      },
      {
        title: "Capsule Mix: Cropped Double-Breasted Bolero & Relaxed Slacks",
        cutName: "Cropped Double-Breasted Bolero Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Tailored from the group's matching ${base} ${fabrics} with horn buttons and ${hw}. Member wears the cropped double-breasted jacket over the group's ${sec} fine-gauge mock-neck base, paired with the collection's matching ${base} relaxed pleated slacks featuring ${acc} pocket tab accents and square-toe leather boots.`,
        accessories: ["Dual silver chain choker", "Silver geometric cuff", "Engraved signet ring"],
        vibe: "Sharp, architectural, and sleek modern luxury."
      },
      {
        title: "Capsule Mix: Unlined Shacket & Pressed Suiting Slacks",
        cutName: "Unlined Minimalist Shacket Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Cut from the group's matching ${base} ${fabrics} unbuttoned over a fitted ${sec} ribbed modal tank. Styled with the group's matching ${base} relaxed pressed suiting trousers with ${acc} subtle side piping and identical silver chain details, finished with black leather dress derbies.`,
        accessories: ["Thin silver chain", "Geometric ear stud", "Brushed metal ring"],
        vibe: "Clean, ultra-modern luxury with crisp silhouette clarity."
      },
      {
        title: "Capsule Mix: Architectural Zip Tunic & Straight Slacks",
        cutName: "Architectural Zip Tunic Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Crafted from the group's matching ${base} ${fabrics} featuring an asymmetric zip with ${acc} collar accents and ${hw}. Layered over the ${sec} undershirt, paired with the collection's matching ${base} tailored straight slacks and polished designer loafers.`,
        accessories: ["Single brushed titanium pendant", "Geometric signet ring", "Clean leather wrist wrap"],
        vibe: "Ultra-clean, modern gallery aesthetics with impeccable tailoring."
      },
      {
        title: "Capsule Mix: Collarless Structured Blazer & Flared Suiting Trousers",
        cutName: "Collarless Minimalist Blazer Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Cut from the group's matching ${base} ${fabrics} with hidden front buttons and ${hw}. Member wears the collarless suiting jacket over a silky ${sec} modal mock-neck, paired with the collection's matching ${base} flared tailored wool trousers with ${acc} pocket trim and sleek Chelsea boots.`,
        accessories: ["Silver bar pendant", "Signet ring stack", "Polished ear hoop"],
        vibe: "Sculptural, high-fashion minimalism with fluid dance movement."
      },
      {
        title: "Capsule Mix: French-Cuff Poplin Shirt & Double-Pleated Wool Slacks",
        cutName: "French-Cuff Poplin & Pleated Wool Slacks Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Tailored from the collection's crisp ${sec} poplin with ${base} wool trim and ${hw}. Member wears the relaxed French-cuff tailored shirt with a slim loosened ${acc} tie, paired with the group's matching ${base} high-rise double-pleated wool trousers and polished oxford shoes.`,
        accessories: ["Brushed silver cuff links", "Minimalist tie bar", "Silver ring band"],
        vibe: "Effortless sartorial idol charisma with timeless tailoring."
      }
    ],
    femaleSilhouettes: [
      {
        title: "Capsule Mix: Sharp Cropped Blazer & Pleated Tailored Skort",
        cutName: "Sharp Cropped Blazer & Skort Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Cut from the group's matching ${base} ${fabrics} with ${acc} lapel accents and ${hw}. Member wears the sharp-shouldered cropped tailored blazer over the group's ${sec} poplin base, paired with the collection's matching ${base} high-waisted pleated A-line structured skort with identical buckle hardware, opaque tights, and knee-high polished black leather riding boots.`,
        accessories: ["Layered delicate silver chokers", "Silver geometric drop earrings", "Minimalist ring stack"],
        vibe: "Poised, charismatic leader energy with runway editorial precision."
      },
      {
        title: "Capsule Mix: Hourglass Suiting Jacket & Wide Palazzo Slacks",
        cutName: "Hourglass Blazer & Palazzo Slacks Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Cut from the exact same ${base} ${fabrics} with silver shank buttons and ${hw}. Member wears the cinched hourglass suiting jacket over the collection's ${sec} silk camisole, paired with the collection's matching ${base} high-rise fluid pleated wide palazzo pants with matching waistband and pointed-toe leather kitten heel boots.`,
        accessories: ["Sculptural chrome ear wrap", "Fine silver collar necklace", "Minimalist cocktail ring"],
        vibe: "Impeccably chic, powerful, and high-fashion editorial."
      },
      {
        title: "Capsule Mix: Asymmetric Tailored Halter Vest & Wrap Skirt",
        cutName: "Asymmetric Halter Vest & Wrap Skirt Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Crafted from the group's matching ${base} ${fabrics} with silver buckle closures and ${hw}. Member wears the asymmetric tailored suiting vest over a ${sec} fitted underlayer, paired with the collection's matching ${base} asymmetric pleated wrap skirt with ${acc} trim and knee-high leather zip boots.`,
        accessories: ["Silver chain ear cuff", "Stacked geometric bangles", "Hardware ring set"],
        vibe: "Sleek, edgy runway sophistication with stage charisma."
      },
      {
        title: "Capsule Mix: Tailored Bolero Shrug & Fluid Puddle Trousers",
        cutName: "Tailored Bolero & Puddle Trousers Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Cut from the group's matching ${base} ${fabrics}. Member wears the cropped tailored bolero jacket over the group's ${sec} fine-ribbed bandeau top with ${acc} straps, paired with the collection's matching ${base} high-waisted fluid puddle trousers with belt loops and square-toe ankle boots.`,
        accessories: ["Delicate silver y-chain necklace", "Brushed silver hoop earrings", "Slim metal belt accent"],
        vibe: "Fluid, graceful, and stunningly modern."
      },
      {
        title: "Capsule Mix: Boned Corset Top & Tailored Straight Slacks",
        cutName: "Boned Suiting Corset & Slacks Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Tailored from the exact same ${base} ${fabrics} with ${acc} eyelet lacing and ${hw}. Member wears the structured boned corset top over the group's ${sec} poplin underlayer, paired with the collection's matching ${base} tailored straight-leg pressed slacks and sleek designer heels.`,
        accessories: ["Layered micro silver chains", "Geometric ear wraps", "Polished titanium ring"],
        vibe: "Modern, iconic, and captivating performance glamour."
      },
      {
        title: "Capsule Mix: Draped Suiting Tunic & Pleated Wool Midi",
        cutName: "Draped Suiting Tunic & Pleated Midi Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Cut from the group's matching ${base} ${fabrics} with ${acc} piping and ${hw}. Member wears the asymmetric draped wool tunic over a ${sec} silk undershirt, paired with the collection's matching ${base} knife-pleated midi skirt, sheer tights, and pointed leather boots.`,
        accessories: ["Silver wire torque necklace", "Minimalist cuff bracelet", "Ear stud set"],
        vibe: "Architectural, hypnotic, and commanding runway elegance."
      },
      {
        title: "Capsule Mix: Double-Breasted Longline Vest & Flared Trousers",
        cutName: "Longline Vest & Flared Trousers Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Crafted from the group's matching ${base} ${fabrics} with ${hw}. Member wears the sleeveless longline suiting coat over an open-collar ${sec} silk blouse with ${acc} accents, paired with the collection's matching ${base} tailored flared trousers and platform loafers.`,
        accessories: ["Chunky link chain", "Modernist signet ring", "Polished silver hoops"],
        vibe: "Sophisticated, authoritative, and chic idol charisma."
      }
    ]
  },
  {
    id: "street_luxe_denim",
    name: "Street-Luxe Washed Denim & Distressed Leather Capsule",
    themeSummary: "Heavyweight Japanese stone-washed selvedge denim and matte lambskin modular pieces. All members share identical denim washes, leather finishes, and silver hardware.",
    primaryFabrics: "14oz Japanese stone-washed selvedge denim and distressed washed black leather",
    sharedHardware: "clean polished silver eyelets, heavy-gauge chrome zips, and minimalist silver chain loops",
    colorPalettes: [
      {
        baseColor: "Stone-Washed Raw Indigo",
        secondaryColor: "Bleached Ecru Cream",
        accentColor: "Weathered Black Leather",
        paletteString: "Washed Raw Indigo, Bleached Ecru Cream, and Weathered Black"
      },
      {
        baseColor: "Acid-Washed Charcoal Grey",
        secondaryColor: "Crisp Pure White",
        accentColor: "Smoked Amber Accents",
        paletteString: "Acid-Washed Charcoal, Pure White, and Smoked Amber"
      },
      {
        baseColor: "Deep Ink Navy Denim",
        secondaryColor: "Heather Grey",
        accentColor: "Polished Silver Hardware",
        paletteString: "Deep Ink Navy Denim, Heather Grey, and Polished Silver"
      },
      {
        baseColor: "Sun-Bleached Faded Blue",
        secondaryColor: "Chalk White",
        accentColor: "Crimson Red Stitching",
        paletteString: "Sun-Bleached Faded Blue, Chalk White, and Crimson Red"
      }
    ],
    maleSilhouettes: [
      {
        title: "Capsule Mix: Cropped Moto Leather Jacket & Baggy Selvedge Jeans",
        cutName: "Cropped Moto Leather & Baggy Denim Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Cut from the group's matching ${fabrics} with ${hw}. Member wears the cropped ${acc} biker jacket over the group's ${sec} mock-neck tee, paired with the collection's matching ${base} relaxed-fit selvedge denim jeans with subtle distressing and designer chunky low-top sneakers.`,
        accessories: ["Layered sterling silver link chains", "Black leather wrist wrap", "Silver ear cuff"],
        vibe: "Effortless street-luxe cool with magnetic stage charisma."
      },
      {
        title: "Capsule Mix: Washed Denim Zip Trucker & Pleated Wide Jeans",
        cutName: "Zip Denim Trucker & Pleated Wide Jeans Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Tailored from the group's exact same ${base} ${fabrics} with ${hw}. Member wears the structured zip trucker jacket over a fine-ribbed ${sec} modal tank, paired with the collection's matching ${base} loose pleated wide-leg jeans with ${acc} trim and designer skate low-tops.`,
        accessories: ["Chunky silver curb bracelet", "Geometric pendant chain", "Ear wrap cuff"],
        vibe: "Crisp modern streetwear with choreography ease."
      },
      {
        title: "Capsule Mix: Leather Overshirt & Straight Selvedge Denim",
        cutName: "Leather Overshirt & Straight Denim Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Crafted from the group's matching ${fabrics}. Member wears the ${acc} overshirt over a washed ${sec} waffle thermal, paired with the collection's matching ${base} classic straight-leg raw denim jeans and chunky lug-sole Chelsea boots.`,
        accessories: ["Braided leather cord necklace", "Brushed silver thumb ring", "Silver ear stud"],
        vibe: "Rugged, magnetic, and effortlessly stylish."
      },
      {
        title: "Capsule Mix: Modular Denim Vest & Relaxed Trousers",
        cutName: "Denim Vest & Relaxed Denim Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Cut from the group's matching ${base} ${fabrics} with ${acc} pocket tabs and ${hw}. Member wears the tailored denim vest over a boxy ${sec} tee, paired with the group's matching ${base} wide-leg relaxed selvedge denim and chunky platform trainers.`,
        accessories: ["Industrial silver chain necklace", "Multi-ring stack", "Leather key lanyard"],
        vibe: "Bold, kinetic, and street-smart swagger."
      },
      {
        title: "Capsule Mix: Two-Tone Denim Bomber & Tapered Jeans",
        cutName: "Two-Tone Denim Bomber & Tapered Jeans Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Cut from the group's matching ${base} ${fabrics} with ${acc} ribbing and ${hw}. Member wears the oversized bomber jacket over a fitted ${sec} undershirt, paired with the collection's matching ${base} tapered jeans and platform leather derbies.`,
        accessories: ["Layered curb chains", "Silver ring stack", "Leather wrist band"],
        vibe: "Dynamic, rhythmic, and choreography-ready."
      },
      {
        title: "Capsule Mix: Distressed Denim Work Jacket & Wide Flared Jeans",
        cutName: "Denim Work Jacket & Flared Jeans Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Crafted from the group's matching ${base} ${fabrics} with subtle fading. Member wears the unlined boxy work jacket over an asymmetric ${sec} tee with ${acc} stitching, paired with the collection's matching ${base} high-rise flared denim jeans and chunky lug boots.`,
        accessories: ["Silver padlock necklace", "Double leather cuff", "Ear hoop stud"],
        vibe: "Artisanal, stylish vintage Americana reinterpreted for Seoul stage."
      },
      {
        title: "Capsule Mix: Sleek Leather Rider Vest & Relaxed Slacks Denim",
        cutName: "Leather Rider Vest & Relaxed Denim Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Tailored from the group's matching ${acc} leather with ${hw}. Member wears the tailored asymmetric zip vest over an oversized ${sec} cotton shirt, paired with the collection's matching ${base} pressed denim trousers and square-toe dress boots.`,
        accessories: ["Heavy silver curb chain", "Signet ring", "Minimalist ear drop"],
        vibe: "Subversive idol rock-and-roll elegance with crisp silhouette lines."
      }
    ],
    femaleSilhouettes: [
      {
        title: "Capsule Mix: Distressed Leather Bolero & Wide-Leg Denim",
        cutName: "Distressed Leather Bolero & Wide Denim Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Cut from the group's matching ${fabrics} with ${hw}. Member wears the ${acc} bolero jacket over a fitted ${sec} ribbed mock-neck top, paired with the collection's matching ${base} low-slung wide-leg washed denim with contrast stitching and designer platform sneakers.`,
        accessories: ["Thick industrial silver chain choker", "Clean silver belt", "Silver ear cuff wrap"],
        vibe: "Bold, confident street-luxe swagger with magnetic stage presence."
      },
      {
        title: "Capsule Mix: Cropped Raw-Hem Denim Trucker & Denim Micro-Skort",
        cutName: "Cropped Denim Trucker & Micro-Skort Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Tailored from the group's matching ${base} ${fabrics} with ${hw}. Member wears the cropped raw-edge denim jacket over a fitted ${sec} seamless baby tee, paired with the collection's matching ${base} high-waisted pleated denim skort with ${acc} belt loops, sheer socks, and chunky platform oxford shoes.`,
        accessories: ["Layered ball-chain necklaces", "Chunky silver hoop earrings", "Silver ring stack"],
        vibe: "Playful, energetic, and ultra-stylish idol charm."
      },
      {
        title: "Capsule Mix: Boned Denim Corset Top & Slit Denim Trousers",
        cutName: "Boned Denim Corset & Slit Trousers Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Cut from the group's matching ${base} ${fabrics} with ${acc} leather lace accents and ${hw}. Member wears the structured denim corset top over a soft ${sec} mesh base, paired with the collection's matching ${base} high-rise denim trousers with side ankle slits and pointed-toe leather ankle boots.`,
        accessories: ["Layered fine silver snake chains", "Silver ear wrap set", "Minimalist waist chain"],
        vibe: "Edgy, sculpted, and mesmerizing performance glamour."
      },
      {
        title: "Capsule Mix: Oversized Leather Flight Bomber & Washed Baggy Jeans",
        cutName: "Leather Flight Bomber & Baggy Jeans Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Crafted from the group's matching ${fabrics}. Member wears the oversized ${acc} bomber jacket over a ${sec} ribbed crop tank, paired with the collection's matching ${base} ultra-wide-leg vintage washed jeans and platform retro runners.`,
        accessories: ["Silver padlock chain choker", "Leather wrist wrap", "Minimalist ear climber"],
        vibe: "Effortless high-fashion casual cool with star power."
      },
      {
        title: "Capsule Mix: Asymmetric Denim Wrap Vest & Straight Jeans",
        cutName: "Asymmetric Denim Wrap Vest Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Tailored from the group's matching ${base} ${fabrics} with ${acc} trim and ${hw}. Member wears the asymmetric wrap vest over a fitted ${sec} bandeau, paired with the collection's matching ${base} straight-leg denim and chunky platform combat boots.`,
        accessories: ["Dual silver chokers", "Geometric signet rings", "Industrial ear drop"],
        vibe: "Striking, synchronized, and runway-ready."
      },
      {
        title: "Capsule Mix: Cropped Leather Moto Shrug & Pleated Denim Midi",
        cutName: "Leather Moto Shrug & Pleated Denim Midi Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Cut from the collection's matching ${acc} leather and ${base} denim. Member wears the cropped moto shrug over a ${sec} fine-ribbed camisole, paired with the group's matching ${base} knife-pleated denim midi skirt and lace-up platform derbies.`,
        accessories: ["Layered chain collar", "Silver hoop earrings", "Signet ring"],
        vibe: "Dynamic, rebellious, and commanding performance presence."
      },
      {
        title: "Capsule Mix: Fitted Denim Halter Top & Ultra-Wide Puddle Jeans",
        cutName: "Denim Halter Top & Puddle Jeans Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Tailored from the group's matching ${base} ${fabrics} with ${hw}. Member wears the sculpted halter top with open back over sheer ${sec} details, paired with the collection's matching ${base} high-rise fluid puddle jeans with ${acc} belt and pointed boots.`,
        accessories: ["Fine silver torque choker", "Minimalist cuff", "Silver ring stack"],
        vibe: "Chic, effortless, and magnetic K-pop choreography poise."
      }
    ]
  },
  {
    id: "royal_baroque_velvet",
    name: "Royal Baroque Velvet & Silk Brocade Capsule",
    themeSummary: "Aristocratic, regal K-pop grandeur with plush crushed velvet, metallic filigree embroidery, silk cravat details, and clean pressed wool slacks. All members share plush royal velvet, silk crepe shirting, and antique silver/gold hardware.",
    primaryFabrics: "heavy crushed royal velvet and liquid silk charmeuse poplin",
    sharedHardware: "antique silver filigree buttons, vintage crest lapel pins, and delicate braided metallic cord",
    colorPalettes: [
      {
        baseColor: "Midnight Obsidian Velvet",
        secondaryColor: "Royal Chalk Ivory Silk",
        accentColor: "Burnished Antique Silver Filigree",
        paletteString: "Midnight Obsidian Velvet, Royal Chalk Ivory Silk, and Burnished Antique Silver"
      },
      {
        baseColor: "Deep Crimson Wine Velvet",
        secondaryColor: "Champagne Silk Crepe",
        accentColor: "Smoked Charcoal Wool",
        paletteString: "Deep Crimson Wine Velvet, Champagne Silk Crepe, and Smoked Charcoal Wool"
      },
      {
        baseColor: "Royal Cobalt Blue Velvet",
        secondaryColor: "Crisp Pearl White Poplin",
        accentColor: "Polished Silver Crest Details",
        paletteString: "Royal Cobalt Blue Velvet, Crisp Pearl White Poplin, and Polished Silver"
      },
      {
        baseColor: "Emerald Green Velvet",
        secondaryColor: "Smoked Jet Black Silk",
        accentColor: "Vintage Platinum Trim",
        paletteString: "Emerald Green Velvet, Smoked Jet Black Silk, and Vintage Platinum"
      }
    ],
    maleSilhouettes: [
      {
        title: "Capsule Mix: Deconstructed Velvet Blazer with Filigree Buttons & Pressed Slacks",
        cutName: "Deconstructed Velvet Blazer Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Cut from the group's matching ${base} ${fabrics} with ${acc} and ${hw}. Member wears the tailored single-breasted velvet blazer with filigree buttons over an unbuttoned ${sec} silk shirt with subtle collar ruffle, paired with the collection's matching tailored pressed wool slacks and polished patent leather derbies.`,
        accessories: ["Antique silver crest lapel pin", "Vintage signet ring stack", "Subtle ear drop"],
        vibe: "Aristocratic, magnetic, and effortlessly commanding royalty."
      },
      {
        title: "Capsule Mix: Asymmetric Velvet Suiting Vest with Silk Tie & Straight Trousers",
        cutName: "Asymmetric Velvet Vest Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Tailored from the group's matching ${base} ${fabrics} with ${hw}. Member wears the structured velvet vest over a crisp ${sec} French-cuff silk shirt with a thin loosened tie, paired with the group's matching high-rise pressed wool trousers with ${acc} piping and dress boots.`,
        accessories: ["Layered micro silver chains", "Silver cuff links", "Minimalist ear cuff"],
        vibe: "Sharp, poetic, and hypnotic stage presence."
      },
      {
        title: "Capsule Mix: Cropped Velvet Bolero Suiting Jacket & Wide Pleated Slacks",
        cutName: "Cropped Velvet Bolero Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Cut from the group's matching ${base} ${fabrics} with ${acc} braided trim. Member wears the cropped velvet bolero over a ${sec} silk mock-neck top, paired with the collection's matching fluid wide-leg double-pleated wool trousers and square-toe leather boots.`,
        accessories: ["Antique silver torque necklace", "Vintage cocktail ring", "Silver ear stud"],
        vibe: "Architectural, opulent, and choreography-ready luxury."
      },
      {
        title: "Capsule Mix: Double-Breasted Velvet Jacket & High-Waisted Slacks",
        cutName: "Double-Breasted Velvet Jacket Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Crafted from the group's matching ${base} ${fabrics} with ${hw}. Member wears the sharp double-breasted velvet jacket with peaked silk lapels over a fitted ${sec} top, paired with the group's matching tailored trousers and polished dress shoes.`,
        accessories: ["Silver pocket watch chain", "Engraved signet band", "Drop ear stud"],
        vibe: "Classic European princely charm reimagined for modern K-pop."
      },
      {
        title: "Capsule Mix: Velvet Collarless Shacket & Flared Wool Trousers",
        cutName: "Velvet Collarless Shacket Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Cut from the group's matching ${base} ${fabrics} unbuttoned over an open-collar ${sec} silk blouse with ${acc} detailing, paired with the collection's matching flared pressed trousers and platform loafers.`,
        accessories: ["Antique silver pendant chain", "Ring stack", "Leather dress watch"],
        vibe: "Soulful, romantic, and effortlessly poised."
      },
      {
        title: "Capsule Mix: Embroidered Velvet Vest over Silk Poplin & Slacks",
        cutName: "Embroidered Velvet Vest Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Tailored from the group's matching ${base} ${fabrics} with subtle ${acc} crest embroidery and ${hw}. Member wears the tailored vest over a billowy ${sec} poet sleeve silk poplin shirt, paired with the collection's matching tailored trousers and Chelsea boots.`,
        accessories: ["Silver bar choker", "Dual signet rings", "Ear climber"],
        vibe: "Dramatic, lyrical, and visually arresting idol star."
      },
      {
        title: "Capsule Mix: Longline Velvet Frock Coat & Slim Trousers",
        cutName: "Longline Velvet Coat Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Cut from the group's matching ${base} ${fabrics} with silk lining and ${hw}. Member wears the unlined lightweight velvet coat over a sleek ${sec} silk tee, paired with the group's matching slim-cut pressed wool slacks and dress boots.`,
        accessories: ["Layered antique silver necklaces", "Velvet choker cord", "Silver ear cuff"],
        vibe: "Sovereign, enigmatic, and commanding center charisma."
      }
    ],
    femaleSilhouettes: [
      {
        title: "Capsule Mix: Sculpted Velvet Blazer with Silk Lapels & Pleated Suiting Skort",
        cutName: "Sculpted Velvet Blazer & Skort Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Cut from the group's matching ${base} ${fabrics} with ${acc} filigree buttons and ${hw}. Member wears the tailored velvet blazer with contrasting silk lapels over a ${sec} silk camisole, paired with the collection's matching high-waisted pleated velvet skort, sheer black tights, and knee-high leather dress boots.`,
        accessories: ["Antique silver filigree collar necklace", "Vintage pearl drop earrings", "Silver ring stack"],
        vibe: "Regal, commanding, and mesmerizing stage elegance."
      },
      {
        title: "Capsule Mix: Boned Velvet Corset Top with Sheer Sleeves & Wide Palazzo Slacks",
        cutName: "Boned Velvet Corset & Palazzo Slacks Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Tailored from the group's matching ${base} ${fabrics} with ${acc} piping and ${hw}. Member wears the boned velvet corset top over sheer ${sec} silk poet sleeves, paired with the collection's matching fluid high-waisted wide-leg palazzo trousers and pointed kitten heel boots.`,
        accessories: ["Delicate silver torque choker", "Baroque pearl earrings", "Minimalist signet ring"],
        vibe: "Sculptural, breathtakingly romantic, and high-fashion editorial."
      },
      {
        title: "Capsule Mix: Asymmetric Velvet Draped Vest & High-Rise Wool Trousers",
        cutName: "Asymmetric Velvet Vest Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Crafted from the group's matching ${base} ${fabrics} with ${hw}. Member wears the asymmetric tailored velvet vest over a crisp ${sec} silk poplin blouse, paired with the collection's matching pressed wool trousers with ${acc} accents and pointed leather heels.`,
        accessories: ["Layered fine silver chains", "Crest ear cuffs", "Hardware ring set"],
        vibe: "Sleek, avant-garde aristocratic authority."
      },
      {
        title: "Capsule Mix: Cropped Velvet Bolero Shrug over Liquid Silk Bias Slip Dress",
        cutName: "Velvet Bolero & Silk Slip Dress Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Cut from the collection's matching ${base} velvet and ${sec} liquid silk with ${hw}. Member wears the plush cropped bolero over the fluid bias-cut silk slip dress with ${acc} hem piping, sheer tights, and pointed dress boots.`,
        accessories: ["Antique silver filigree choker", "Drop earrings", "Silver cocktail ring"],
        vibe: "Ethereal, dramatic, and emotionally powerful."
      },
      {
        title: "Capsule Mix: Double-Breasted Velvet Suiting Vest & Pleated Mini Wrap",
        cutName: "Velvet Suiting Vest & Mini Wrap Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Tailored from the group's matching ${base} ${fabrics} with filigree shank buttons and ${hw}. Member wears the tailored longline vest over a fitted ${sec} mock-neck, paired with the collection's matching pleated mini wrap skirt, sheer stockings, and platform oxfords.`,
        accessories: ["Silver chain belt", "Vintage hoop earrings", "Signet band set"],
        vibe: "Chic, charismatic, and runway-ready."
      },
      {
        title: "Capsule Mix: Off-Shoulder Velvet Peplum Top & Straight Pressed Wool Slacks",
        cutName: "Off-Shoulder Velvet Peplum Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Cut from the group's matching ${base} ${fabrics} with ${acc} detailing. Member wears the sculpted off-shoulder velvet top over a ${sec} silk underlayer, paired with the collection's matching high-waisted tailored straight slacks and square-toe ankle boots.`,
        accessories: ["Antique silver torque necklace", "Pearl-accented ear wrap", "Polished ring"],
        vibe: "Timeless, alluring, and effortlessly regal."
      },
      {
        title: "Capsule Mix: Tailored Velvet Suiting Coat & Fluid Wool Slacks",
        cutName: "Tailored Velvet Coat & Slacks Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Crafted from the group's matching ${base} ${fabrics} with silk collar trim and ${hw}. Member wears the lightweight velvet coat over a ${sec} silk button-up with loosened ribbon tie, paired with the group's matching fluid trousers and pointed boots.`,
        accessories: ["Vintage crest brooch", "Drop earrings", "Silver ring stack"],
        vibe: "Commanding, majestic, and undeniably iconic."
      }
    ]
  },
  {
    id: "punk_tartan",
    name: "Deconstructed Heritage Plaid & Suiting Wool Capsule",
    themeSummary: "Rebellious pop-punk tailoring with raw check wool tartan, safety pins, and distressed suiting. All members share identical tartan patterns, wool fabrics, and sterling silver hardware.",
    primaryFabrics: "custom heritage check wool tartan and structured black suiting twill",
    sharedHardware: "sterling silver safety-pin hardware, dual-grommet belts, and chrome chain drapes",
    colorPalettes: [
      {
        baseColor: "Heritage Red Tartan Plaid",
        secondaryColor: "Chalk White Poplin",
        accentColor: "Smoked Jet Black Twill",
        paletteString: "Heritage Red Tartan, Chalk White Poplin, and Smoked Jet Black"
      },
      {
        baseColor: "Cobalt Navy Tartan Check",
        secondaryColor: "Optic White Graphic",
        accentColor: "Distressed Charcoal Denim",
        paletteString: "Cobalt Navy Tartan, Optic White, and Distressed Charcoal"
      },
      {
        baseColor: "Monochrome Shadow Plaid",
        secondaryColor: "Pale Ivory",
        accentColor: "Burnished Silver Hardware",
        paletteString: "Monochrome Shadow Plaid, Pale Ivory, and Burnished Silver"
      },
      {
        baseColor: "Emerald Green Tartan",
        secondaryColor: "Crisp Black Cotton",
        accentColor: "Polished Steel Chains",
        paletteString: "Emerald Green Tartan, Crisp Black, and Polished Steel"
      }
    ],
    maleSilhouettes: [
      {
        title: "Capsule Mix: Asymmetric Plaid Kilt Wrap & Straight Wool Slacks",
        cutName: "Asymmetric Plaid Kilt Wrap Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Cut from the group's matching ${base} ${fabrics} with ${hw}. Member wears the asymmetric pleated check wrap kilt over the collection's matching ${acc} straight-leg wool trousers, styled with an oversized distressed ${sec} sweater with subtle raw hems and chunky creepers.`,
        accessories: ["Custom safety-pin collar chain", "Layered silver keyrings", "Dual ear cuffs"],
        vibe: "Rebellious, poetic, and effortlessly charismatic rock frontman."
      },
      {
        title: "Capsule Mix: Deconstructed Plaid Blazer & Pleated Slacks",
        cutName: "Deconstructed Plaid Blazer Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Tailored from the group's matching ${base} and ${acc} ${fabrics} with ${hw}. Member wears the half-plaid, half-wool deconstructed blazer over a crisp ${sec} poplin shirt with a thin loosened black tie, paired with the collection's matching ${acc} pleated trousers and lug boots.`,
        accessories: ["Silver padlock necklace", "Chrome ring stack", "Safety-pin lapel pin"],
        vibe: "Sharp, subversive high-fashion rock sophistication."
      },
      {
        title: "Capsule Mix: Plaid Wool Suiting Vest & Cargo Trousers",
        cutName: "Plaid Wool Suiting Vest Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Crafted from the group's matching ${base} ${fabrics} with ${hw}. Member wears the structured wool vest with safety-pin closures over a ${sec} long-sleeve thermal, paired with the group's matching ${acc} relaxed cargo trousers with plaid pocket flaps and combat boots.`,
        accessories: ["Heavy curb chain", "Silver thumb ring", "Barbed ear stud"],
        vibe: "Kinetic, gritty, and magnetic idol energy."
      },
      {
        title: "Capsule Mix: Shredded Mohair Plaid Shacket & Slacks",
        cutName: "Plaid Shacket & Slacks Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Cut from the group's matching ${base} ${fabrics} unbuttoned over a fitted ${sec} graphic base. Styled with the collection's matching ${acc} straight slacks with silver chain loops and chunky platform derbies.`,
        accessories: ["Ball-chain choker", "Leather wrist wrap", "Silver signet band"],
        vibe: "Carefree, stylish, and full of rock-and-roll swagger."
      },
      {
        title: "Capsule Mix: Cropped Plaid Moto Jacket & Slacks",
        cutName: "Cropped Plaid Moto Jacket Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Tailored from the group's matching ${base} ${fabrics} with ${acc} leather lapels and ${hw}. Member wears the cropped moto jacket over a ${sec} tee, paired with the collection's matching ${acc} wide trousers and polished dress boots.`,
        accessories: ["Chrome chain drape", "Multi-ring set", "Ear cuff"],
        vibe: "Fierce, sleek, and stage-commanding."
      }
    ],
    femaleSilhouettes: [
      {
        title: "Capsule Mix: Cropped Plaid Blazer & Pleated Tartan Skort",
        cutName: "Cropped Plaid Blazer & Skort Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Cut from the group's matching ${base} ${fabrics} with ${hw}. Member wears the sharp cropped tailored jacket over a fitted ${sec} baby tee, paired with the collection's matching ${base} high-waisted pleated tartan micro-skort with ${acc} dual-grommet belt, fishnet accents, and platform lace-up combat boots.`,
        accessories: ["Silver razor-blade and padlock layered necklaces", "Chunky hoop earrings", "Safety-pin ear cuffs"],
        vibe: "Fierce, playful, and undeniably iconic punk-idol presence."
      },
      {
        title: "Capsule Mix: Boned Tartan Corset Top & Asymmetric Slacks",
        cutName: "Boned Tartan Corset & Slacks Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Tailored from the group's matching ${base} ${fabrics} with ${acc} boning channels and ${hw}. Member wears the structured corset top over a sheer ${sec} mesh underlayer, paired with the collection's matching ${acc} fluid wide trousers with plaid side-stripe detailing and pointed platform boots.`,
        accessories: ["Layered chrome chain belt", "Silver safety-pin choker", "Chrome nail rings"],
        vibe: "Edgy, sculpted, and deeply captivating rock glamour."
      },
      {
        title: "Capsule Mix: Asymmetric Tartan Wrap Dress & Bolero Shrug",
        cutName: "Asymmetric Tartan Wrap & Bolero Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Cut from the group's matching ${base} ${fabrics}. Member wears the deconstructed wrap dress with safety-pin accents under the collection's matching ${acc} cropped bolero shrug, finished with knee-high lace-up leather boots.`,
        accessories: ["Chunky silver chain necklace", "Leather cuff bracelet", "Ear wrap cuffs"],
        vibe: "Dramatic, magnetic, and effortlessly cool."
      },
      {
        title: "Capsule Mix: Plaid Halter Vest & Pleated Mini Wrap",
        cutName: "Plaid Halter Vest & Mini Wrap Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Crafted from the group's matching ${base} ${fabrics} with ${hw}. Member wears the tailored halter vest over a ${sec} bandeau, paired with the collection's matching ${base} pleated mini wrap skirt over ${acc} opaque tights and lug-sole oxfords.`,
        accessories: ["Safety-pin choker", "Stacked geometric bangles", "Silver rings"],
        vibe: "Sharp, dynamic, and full of attitude."
      },
      {
        title: "Capsule Mix: Oversized Deconstructed Plaid Coat & Trousers",
        cutName: "Oversized Plaid Coat & Trousers Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Tailored from the group's matching ${base} and ${acc} ${fabrics} with ${hw}. Member wears the unlined statement coat over a ${sec} silk camisole, paired with the collection's matching ${acc} tailored trousers and pointed leather ankle boots.`,
        accessories: ["Chrome torque choker", "Minimalist ear climber", "Silver signet ring"],
        vibe: "Commanding, stylish, and high-editorial."
      }
    ]
  },
  {
    id: "soft_luxury_knitwear",
    name: "Soft Brushed Mohair & Liquid Silk Drape Capsule",
    themeSummary: "Ethereal, tactile luxury with cloud-soft knits and liquid silk draping. All members share fine-gauge mohair, fluid silk crepe, and delicate silver wire hardware.",
    primaryFabrics: "fine-gauge brushed mohair knitwear and bias-cut liquid silk crepe",
    sharedHardware: "delicate silver wire torques, micro-bead chains, and mother-of-pearl button accents",
    colorPalettes: [
      {
        baseColor: "Cashmere Oatmeal",
        secondaryColor: "Pearl Ivory Silk",
        accentColor: "Smoke Slate Draping",
        paletteString: "Cashmere Oatmeal, Pearl Ivory Silk, and Smoke Slate"
      },
      {
        baseColor: "Muted Sage Mist",
        secondaryColor: "Soft Cream Ivory",
        accentColor: "Dappled Silver Accents",
        paletteString: "Muted Sage Mist, Soft Cream Ivory, and Dappled Silver"
      },
      {
        baseColor: "Dusty Rose Quartz",
        secondaryColor: "Chalk White Modal",
        accentColor: "Smoked Ash Grey",
        paletteString: "Dusty Rose Quartz, Chalk White, and Smoked Ash"
      },
      {
        baseColor: "Pale Lavender Mist",
        secondaryColor: "Frosted Pearl Silk",
        accentColor: "Deep Charcoal Accents",
        paletteString: "Pale Lavender Mist, Frosted Pearl, and Deep Charcoal"
      }
    ],
    maleSilhouettes: [
      {
        title: "Capsule Mix: Oversized Brushed Mohair Cardigan & Fluid Wool Trousers",
        cutName: "Brushed Mohair Cardigan Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Cut from the group's matching ${base} ${fabrics} with ${hw}. Member wears the cloud-soft oversized mohair cardigan over a fine-ribbed ${sec} modal tank, paired with the collection's matching ${acc} fluid high-waisted wool trousers and square-toe soft leather boots.`,
        accessories: ["Delicate silver pendant chain", "Dual-band silver signet ring", "Minimalist ear drop"],
        vibe: "Soulful, ethereal elegance with rich poetic depth."
      },
      {
        title: "Capsule Mix: Asymmetric Draped Silk Tunic & Wide Trousers",
        cutName: "Draped Silk Tunic Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Tailored from the group's matching ${sec} and ${base} ${fabrics} with ${hw}. Member wears the fluid silk tunic with asymmetric shoulder drape over matching ${acc} relaxed pleated trousers and polished leather mules.`,
        accessories: ["Fine silver wire torque", "Minimalist cuff bracelet", "Titanium ear stud"],
        vibe: "Pure, architectural serenity with high-fashion gravitas."
      },
      {
        title: "Capsule Mix: Open-Knit Drop-Shoulder Sweater & Slacks",
        cutName: "Open-Knit Drop-Shoulder Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Crafted from the group's matching ${base} ${fabrics}. Member wears the loose open-stitch sweater over a ${sec} silk undershirt, paired with the group's matching ${acc} wide trousers and soft leather dress shoes.`,
        accessories: ["Layered micro silver chains", "Brushed silver ring", "Ear stud"],
        vibe: "Warm, emotional, and captivatingly handsome."
      },
      {
        title: "Capsule Mix: Fine-Ribbed Mock-Neck & Flowing Slacks",
        cutName: "Fine-Ribbed Mock-Neck Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Cut from the group's matching ${base} ${fabrics} with ${hw}. Member wears the fine-ribbed top with ${acc} piping, paired with the collection's matching ${sec} fluid trousers and minimalist loafers.`,
        accessories: ["Thin silver snake chain", "Geometric band", "Leather wrist wrap"],
        vibe: "Sleek, delicate, and choreography-ready."
      },
      {
        title: "Capsule Mix: Cropped Mohair Shrug & Pleated Slacks",
        cutName: "Cropped Mohair Shrug Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Tailored from the group's matching ${base} ${fabrics}. Member wears the shrug over a ${sec} silk button-up, paired with the collection's matching ${acc} trousers and dress boots.`,
        accessories: ["Silver bar necklace", "Dual rings", "Ear drop"],
        vibe: "Ethereal, modern, and poised."
      }
    ],
    femaleSilhouettes: [
      {
        title: "Capsule Mix: Cropped Mohair Bolero & Liquid Silk Bias Slip Dress",
        cutName: "Mohair Bolero & Bias Slip Dress Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Cut from the group's matching ${base} and ${sec} ${fabrics} with ${hw}. Member wears the cloud-soft cropped mohair bolero shrug over the collection's matching bias-cut fluid silk slip dress with subtle ${acc} hem piping, sheer tights, and pointed kitten-heel boots.`,
        accessories: ["Fine silver torque choker", "Pearl-accented wire drop earrings", "Minimalist ring stack"],
        vibe: "Breathtakingly ethereal, delicate, and emotionally resonant."
      },
      {
        title: "Capsule Mix: Asymmetric Draped Silk Top & Wide Palazzo Pants",
        cutName: "Asymmetric Silk Top & Palazzo Pants Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Tailored from the group's matching ${sec} and ${base} ${fabrics} with ${hw}. Member wears the sculpted asymmetric draped silk top, paired with the collection's matching ${acc} high-rise fluid wide-leg palazzo pants and pointed-toe leather mules.`,
        accessories: ["Sculptural chrome drop earrings", "Minimalist silver cuff bracelet", "Geometric ring stack"],
        vibe: "Striking, timeless, and effortlessly commanding."
      },
      {
        title: "Capsule Mix: Fine-Knit Mock-Neck & Pleated Wool Wrap Skirt",
        cutName: "Fine-Knit Mock-Neck & Wrap Skirt Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Crafted from the group's matching ${base} ${fabrics} with ${hw}. Member wears the form-fitting fine-gauge knit top over the collection's matching ${acc} pleated wrap skirt with ${sec} lining and leather ankle boots.`,
        accessories: ["Delicate y-chain necklace", "Brushed silver hoop earrings", "Modernist signet ring"],
        vibe: "Graceful, architectural, and strikingly elegant."
      },
      {
        title: "Capsule Mix: Open-Stitch Mohair Tunic & Silk Slacks",
        cutName: "Open-Stitch Mohair Tunic Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Cut from the group's matching ${base} ${fabrics}. Member wears the airy mohair tunic over a ${sec} silk slip, paired with the collection's matching ${acc} wide trousers and soft square-toe boots.`,
        accessories: ["Layered micro silver chains", "Ear cuffs", "Polished ring"],
        vibe: "Dreamy, luminous, and enchanting."
      },
      {
        title: "Capsule Mix: Sculpted Knit Corset & Fluid Slacks",
        cutName: "Sculpted Knit Corset Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Tailored from the group's matching ${base} ${fabrics} with ${hw}. Member wears the boned knit corset over a ${sec} sheer top, paired with the collection's matching ${acc} fluid trousers and heels.`,
        accessories: ["Silver wire choker", "Drop earrings", "Slim ring set"],
        vibe: "Captivating, modern, and poised."
      }
    ]
  },
  {
    id: "minimal_monochrome",
    name: "Architectural Minimalist Monochrome Capsule",
    themeSummary: "Ultra-clean geometric silhouettes with hidden closures and precise drape. All members share sculptural bonded wool-crepe, matte silk poplin, and brushed titanium hardware.",
    primaryFabrics: "sculptural bonded wool-crepe and matte silk poplin",
    sharedHardware: "brushed titanium collar bars, hidden zip closures, and geometric signet hardware",
    colorPalettes: [
      {
        baseColor: "Chalk White Crepe",
        secondaryColor: "Matte Smoked Grey",
        accentColor: "Pitch Black Accents",
        paletteString: "Chalk White, Matte Smoked Grey, and Pitch Black"
      },
      {
        baseColor: "Monochromatic Charcoal",
        secondaryColor: "Slate Grey Poplin",
        accentColor: "Brushed Titanium Silver",
        paletteString: "Monochromatic Charcoal, Slate Grey, and Brushed Titanium"
      },
      {
        baseColor: "Pure Optic White",
        secondaryColor: "Soft Bone Ivory",
        accentColor: "Minimalist Obsidian Details",
        paletteString: "Pure Optic White, Soft Bone Ivory, and Obsidian Details"
      },
      {
        baseColor: "Warm Sand Crepe",
        secondaryColor: "Cashmere Taupe",
        accentColor: "Smoked Espresso Accents",
        paletteString: "Warm Sand Crepe, Cashmere Taupe, and Smoked Espresso"
      }
    ],
    maleSilhouettes: [
      {
        title: "Capsule Mix: Sculptural Asymmetric Zip Overshirt & Clean Pressed Slacks",
        cutName: "Sculptural Asymmetric Zip Overshirt Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Cut from the group's matching ${base} ${fabrics} with ${hw}. Member wears the structured matte-finish zip overshirt with clean stand collar over a ${sec} base, paired with the collection's matching ${base} tailored pressed straight-leg trousers with ${acc} trim and square-toe leather derbies.`,
        accessories: ["Single brushed titanium pendant", "Geometric signet ring", "Clean leather watch"],
        vibe: "Ultra-clean, modern gallery aesthetics with impeccable tailoring."
      },
      {
        title: "Capsule Mix: Cropped Boxy Suiting Jacket & High-Rise Fluid Slacks",
        cutName: "Cropped Boxy Suiting Jacket Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Tailored from the group's matching ${base} ${fabrics} with hidden placket and ${hw}. Member wears the unlined suiting jacket over a seamless ${sec} modal tee, paired with the collection's matching ${base} high-rise fluid pleated slacks with ${acc} accents and chunky polished loafers.`,
        accessories: ["Brushed silver bar necklace", "Dual-band ring", "Minimalist ear drop"],
        vibe: "Sleek, futuristic minimalism with effortless poise."
      },
      {
        title: "Capsule Mix: Double-Layered Wool Tunic & Fluid Wide Pants",
        cutName: "Double-Layered Wool Tunic Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Crafted from the group's matching ${base} ${fabrics}. Member wears the minimalist tunic over a fluid ${sec} silk undershirt, paired with the group's matching ${base} relaxed wide-leg trousers and smooth leather mules.`,
        accessories: ["Fine silver torque choker", "Minimalist cuff bracelet", "Titanium ear stud"],
        vibe: "Pure, architectural serenity with high-fashion gravitas."
      },
      {
        title: "Capsule Mix: Fine-Ribbed Asymmetric Top & Straight Chinos",
        cutName: "Fine-Ribbed Asymmetric Top Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Cut from the group's matching ${base} ${fabrics} with ${hw}. Member wears the fitted asymmetric hem top over a ${sec} base, paired with the collection's matching ${base} tailored straight-leg pressed chinos with ${acc} piping and clean designer dress shoes.`,
        accessories: ["Minimalist silver snake chain", "Geometric signet band", "Leather wrist wrap"],
        vibe: "Sharp, disciplined, and choreography-ready precision."
      },
      {
        title: "Capsule Mix: Minimalist Collarless Blazer & Trousers",
        cutName: "Collarless Blazer & Trousers Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Tailored from the group's matching ${base} ${fabrics} with ${hw}. Member wears the collarless tailored jacket over a ${sec} poplin shirt, paired with the collection's matching ${base} wide trousers and polished derbies.`,
        accessories: ["Titanium collar pin", "Minimalist signet ring", "Clean watch"],
        vibe: "Disciplined, architectural, and striking."
      },
      {
        title: "Capsule Mix: Sculptural Draped Shacket & High-Rise Pressed Slacks",
        cutName: "Sculptural Draped Shacket Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Cut from the group's matching ${base} ${fabrics} with subtle hidden snaps. Member wears the clean unlined shacket over an asymmetric ${sec} modal tank, paired with the collection's matching ${base} pressed wool slacks and sleek leather dress shoes.`,
        accessories: ["Titanium torque collar", "Geometric cuff", "Silver ear stud"],
        vibe: "Effortless, pristine gallery sophistication."
      },
      {
        title: "Capsule Mix: Deep-V Tailored Suiting Vest & Pleated Wide Slacks",
        cutName: "Deep-V Suiting Vest & Wide Slacks Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Crafted from the group's matching ${base} ${fabrics} with ${hw}. Member wears the tailored suiting vest over a fine-gauge ${sec} mock-neck, paired with the collection's matching ${base} double-pleated wide trousers and polished loafers.`,
        accessories: ["Silver bar chain", "Signet ring stack", "Minimalist ear hoop"],
        vibe: "Impeccably tailored, regal, and modern."
      }
    ],
    femaleSilhouettes: [
      {
        title: "Capsule Mix: Asymmetric High-Neck Sculpted Top & Fluid Palazzo Pants",
        cutName: "Asymmetric High-Neck & Palazzo Pants Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Cut from the group's matching ${base} ${fabrics} with ${hw}. Member wears the sculpted asymmetric high-neck top over a ${sec} base, paired with the collection's matching ${base} high-rise fluid wide-leg palazzo pants with hidden closures, ${acc} belt accents, and pointed-toe kitten heel mules.`,
        accessories: ["Sculptural chrome drop earrings", "Minimalist silver cuff bracelet", "Geometric ring stack"],
        vibe: "Striking, timeless, and effortlessly commanding."
      },
      {
        title: "Capsule Mix: Column Slip Dress & Cropped Structured Blazer",
        cutName: "Column Slip Dress & Cropped Blazer Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Tailored from the group's matching ${base} ${fabrics} with ${hw}. Member wears the fluid column slip dress with clean side slit under the collection's matching cropped structured collarless blazer in ${base} with ${acc} lining, sheer ${sec} accents, and square-toe ankle boots.`,
        accessories: ["Fine silver torque collar", "Minimalist wire ear cuffs", "Slim band ring set"],
        vibe: "Graceful, architectural, and strikingly elegant."
      },
      {
        title: "Capsule Mix: Tailored Suiting Halter Vest & Pleated Fluid Trousers",
        cutName: "Suiting Halter Vest & Fluid Trousers Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Crafted from the group's matching ${base} ${fabrics} with ${hw}. Member wears the tailored halterneck vest with clean back strap over a ${sec} fitted layer, paired with the collection's matching ${base} relaxed pleated fluid trousers with deep pockets and pointed leather boots.`,
        accessories: ["Delicate y-chain necklace", "Brushed silver hoop earrings", "Modernist signet ring"],
        vibe: "Sleek, sophisticated, and captivatingly confident."
      },
      {
        title: "Capsule Mix: Sculpted Cutout Midi Dress & Sleek Boots",
        cutName: "Sculpted Cutout Midi Dress Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Cut from the group's matching ${base} ${fabrics} with ${hw}. Member wears the form-fitting compact knit midi dress with subtle architectural cutouts, layered over sheer ${sec} details with ${acc} trim, and polished leather riding boots.`,
        accessories: ["Layered micro silver chains", "Geometric ear wraps", "Polished titanium ring"],
        vibe: "Modern, iconic, and mesmerizing stage presence."
      },
      {
        title: "Capsule Mix: Boned Minimalist Corset & Wide Slacks",
        cutName: "Minimalist Boned Corset Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Tailored from the group's matching ${base} ${fabrics} with ${hw}. Member wears the boned corset top over a ${sec} silk undershirt, paired with the collection's matching ${base} fluid wide trousers and kitten heel boots.`,
        accessories: ["Silver choker", "Drop earrings", "Titanium ring"],
        vibe: "Architectural, poised, and powerful."
      },
      {
        title: "Capsule Mix: Cropped Bolero Jacket & High-Rise Pleated Skort",
        cutName: "Minimalist Bolero & Skort Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Cut from the group's matching ${base} ${fabrics} with ${hw}. Member wears the architectural cropped bolero over a seamless ${sec} bandeau top, paired with the collection's matching ${base} structured pleated wool skort, sheer tights, and pointed leather boots.`,
        accessories: ["Silver wire torque", "Geometric ear cuffs", "Signet ring"],
        vibe: "Sharp, balanced, and runway-commanding."
      },
      {
        title: "Capsule Mix: Asymmetric Draped Suiting Tunic & Straight Slacks",
        cutName: "Asymmetric Suiting Tunic Cut",
        buildDescription: (base, sec, acc, fabrics, hw) =>
          `Coordinated Capsule Mix: Tailored from the group's matching ${base} ${fabrics}. Member wears the asymmetric high-fashion draped tunic over a ${sec} silk camisole, paired with the collection's matching ${base} pressed straight slacks and square-toe heels.`,
        accessories: ["Layered micro chains", "Polished cuff", "Silver ring stack"],
        vibe: "Hypnotic, fluid, and effortlessly chic."
      }
    ]
  }
];

// Alias for backward compatibility
// ============================================================================
// POPULAR K-POP FASHION STYLES & CURATED 3-COLOR PALETTES
// Focuses on high-level recognizable fashion styles (Preppy, Casual, Streetwear, etc.)
// with vibrant, non-boring 3-color schemes (Base, Secondary, Accent)
// ============================================================================

export interface PopularFashionStyle {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category?: 'universal' | 'boy_group' | 'girl_group';
  curated3ColorSchemes: Array<{
    paletteName: string;
    colors: [string, string, string]; // [Base, Secondary, Accent]
    displayString: string;
  }>;
  palettes: Array<{
    name: string;
    paletteString: string;
    baseColor: string;
    secondaryColor: string;
    accentColor: string;
  }>;
  maleSilhouettes: Array<{
    title: string;
    buildDescription: (c1: string, c2: string, c3: string, concept?: string) => string;
    accessories: string[];
    vibe: string;
  }>;
  femaleSilhouettes: Array<{
    title: string;
    buildDescription: (c1: string, c2: string, c3: string, concept?: string) => string;
    accessories: string[];
    vibe: string;
  }>;
}

function toCuratedPalettes(curated: Array<{ paletteName: string; colors: [string, string, string]; displayString: string }>) {
  return curated.map(c => ({
    name: c.paletteName,
    paletteString: c.displayString,
    baseColor: c.colors[0],
    secondaryColor: c.colors[1],
    accentColor: c.colors[2]
  }));
}

const BASE_KPOP_POPULAR_FASHION_STYLES: PopularFashionStyle[] = [
  {
    id: "casual",
    name: "Casual",
    category: "universal",
    tagline: "Youthful Off-Duty Idol & Trendy Street-Casual",
    description: "Iconic K-pop idol off-duty casual fashion featuring oversized graphic hoodies, cropped zip jackets, varsity bombers, baby tees, relaxed baggy vintage-wash skater denim, casual denim mini-skorts, and fresh designer platform sneakers. Strictly youthful, energetic idol wear with zero stuffy blazers, zero suiting, and zero office workwear.",
    curated3ColorSchemes: [
      {
        paletteName: "Cobalt Blue, Crisp White & Warm Sand",
        colors: ["Cobalt Blue", "Crisp White", "Warm Sand"],
        displayString: "Cobalt Blue, Crisp White, and Warm Sand"
      },
      {
        paletteName: "Sage Olive, Off-White & Washed Black",
        colors: ["Sage Olive", "Off-White", "Washed Black"],
        displayString: "Sage Olive, Off-White, and Washed Black"
      },
      {
        paletteName: "Terracotta Rust, Chalk Cream & Deep Indigo",
        colors: ["Terracotta Rust", "Chalk Cream", "Deep Indigo"],
        displayString: "Terracotta Rust, Chalk Cream, and Deep Indigo"
      },
      {
        paletteName: "Heather Grey, Optic White & Soft Mint",
        colors: ["Heather Grey", "Optic White", "Soft Mint"],
        displayString: "Heather Grey, Optic White, and Soft Mint"
      }
    ],
    maleSilhouettes: [
      {
        title: "Casual: Oversized College Graphic Hoodie & Baggy Washed Denim",
        buildDescription: (c1, c2, c3, concept) =>
          `Casual Idol Fashion Style${concept ? ` [${concept}]` : ''}: Member wears an oversized heavyweight French-terry hoodie in ${c1} with ${c3} vintage collegiate graphic lettering, layered with a clean ${c2} tee peeking at the hem, paired with relaxed baggy vintage-wash skater denim jeans in ${c2} and fresh chunky retro court sneakers.`,
        accessories: ["Layered silver chain necklace", "Ribbed knit beanie", "Minimalist signet ring"],
        vibe: "Effortless, youthful Seoul off-duty airport idol charm."
      },
      {
        title: "Casual: Cropped Lightweight Bomber & Wide Skater Jeans",
        buildDescription: (c1, c2, c3, concept) =>
          `Casual Idol Fashion Style${concept ? ` [${concept}]` : ''}: Member wears a relaxed lightweight zip bomber jacket in ${c1} with subtle ${c3} athletic sleeve piping, layered over a soft relaxed ${c2} graphic tee, paired with wide-leg washed skater denim in ${c2} and clean low-top court sneakers.`,
        accessories: ["Silver ear cuff", "Metal key clip", "Braided cord bracelet"],
        vibe: "Cool, athletic dance practice heartthrob presence."
      },
      {
        title: "Casual: Boxy Denim Trucker Jacket & Baggy Cargo Skate Pants",
        buildDescription: (c1, c2, c3, concept) =>
          `Casual Idol Fashion Style${concept ? ` [${concept}]` : ''}: Member wears an oversized washed denim trucker jacket in ${c1} with contrast ${c3} stitching, layered over a soft ${c2} crewneck tee, styled with relaxed ${c2} baggy cargo skate pants and retro high-top basketball sneakers.`,
        accessories: ["Thick silver curb chain", "Sporty baseball cap worn backwards", "Dual rings"],
        vibe: "Fresh, charismatic high-energy boyband swagger."
      },
      {
        title: "Casual: Dropped-Shoulder Collegiate Crewneck & Wide Utility Denim",
        buildDescription: (c1, c2, c3, concept) =>
          `Casual Idol Fashion Style${concept ? ` [${concept}]` : ''}: Member wears an oversized dropped-shoulder collegiate crewneck sweatshirt in ${c1} with ${c3} varsity chest typography, over a contrast ${c2} tee, paired with relaxed wide-leg washed utility denim in ${c2} and chunky platform trainers.`,
        accessories: ["Silver ball chain necklace", "Knit watch cap", "Leather wristband"],
        vibe: "Cozy, vibrant, and approachable superstar allure."
      },
      {
        title: "Casual: Boxy Short-Sleeve Overshirt & Loose Vintage Denim",
        buildDescription: (c1, c2, c3, concept) =>
          `Casual Idol Fashion Style${concept ? ` [${concept}]` : ''}: Member wears a breezy boxy short-sleeve camp overshirt in ${c1} worn unbuttoned over a fitted ${c2} ribbed tank, paired with loose-fit vintage-wash blue denim in ${c2} with subtle ${c3} woven belt detail, and clean canvas sneakers.`,
        accessories: ["Dainty silver pendant", "Tortoiseshell shades hooked on collar", "Silver band"],
        vibe: "Sun-drenched, breezy summer idol off-duty cool."
      },
      {
        title: "Casual: Sporty Color-Blocked Track Zip Jacket & Baggy Skater Denim",
        buildDescription: (c1, c2, c3, concept) =>
          `Casual Idol Fashion Style${concept ? ` [${concept}]` : ''}: Member wears a lightweight sporty zip track jacket in ${c1} with dual ${c2} and ${c3} racing sleeve stripes, over a clean ${c2} cotton base, paired with relaxed baggy vintage distressed denim in ${c2} and modern chunky sneakers.`,
        accessories: ["Sporty crossbody sling bag strap", "Ear studs", "Digital sports watch"],
        vibe: "Dynamic, fresh rehearsal studio idol cool."
      },
      {
        title: "Casual: Oversized Vintage Hockey Jersey & Baggy Denim Jorts",
        buildDescription: (c1, c2, c3, concept) =>
          `Casual Idol Fashion Style${concept ? ` [${concept}]` : ''}: Member wears an oversized vintage athletic hockey jersey in ${c1} with bold ${c2} and ${c3} chest numbers, paired with slouchy wide-leg ${c2} denim jorts and high-top court sneakers with white athletic crew socks.`,
        accessories: ["Silver Cuban link necklace", "Backwards dad cap", "Sport watch"],
        vibe: "Playful, rebellious 90s streetwear idol charm."
      },
      {
        title: "Casual: Layered Thermal Waffle Longsleeve & Relaxed Carpenter Denim",
        buildDescription: (c1, c2, c3, concept) =>
          `Casual Idol Fashion Style${concept ? ` [${concept}]` : ''}: Member wears a boxy relaxed short-sleeve graphic tee in ${c1} layered over a textured ${c2} thermal waffle longsleeve, paired with loose ${c2} carpenter denim pants with ${c3} utility loop detail and low-profile skate shoes.`,
        accessories: ["Silver dog-tag necklace", "Beanie hat", "Silver ring band"],
        vibe: "Cozy skater idol practice room energy."
      }
    ],
    femaleSilhouettes: [
      {
        title: "Casual: Cropped Zip Hoodie & Baggy Vintage Washed Denim",
        buildDescription: (c1, c2, c3, concept) =>
          `Casual Idol Fashion Style${concept ? ` [${concept}]` : ''}: Member wears a cropped boxy fleece zip hoodie in ${c1} with ${c3} contrast drawstrings, over a fitted ${c2} baby crop tee, paired with relaxed low-slung baggy vintage-wash denim jeans in ${c2} and platform retro court sneakers with scrunched athletic crew socks.`,
        accessories: ["Dainty silver star necklace", "Mini claw hair clips", "Beaded rings"],
        vibe: "Trendsetting, breezy idol airport fashion icon."
      },
      {
        title: "Casual: Cropped Denim Jacket & Pleated Denim Mini-Skort",
        buildDescription: (c1, c2, c3, concept) =>
          `Casual Idol Fashion Style${concept ? ` [${concept}]` : ''}: Member wears a cute cropped washed denim jacket in ${c1} with silver buttons, over a soft ${c2} ribbed baby tee with subtle ${c3} print, paired with a matching structured ${c1} pleated denim mini-skort and chunky white platform sneakers with athletic ankle socks.`,
        accessories: ["Silver hoop earrings", "Cute satin hair ribbon", "Layered dainty chains"],
        vibe: "Bright, youthful music video center pop star charm."
      },
      {
        title: "Casual: Oversized Collegiate Sweatshirt & Casual Pleated Skort",
        buildDescription: (c1, c2, c3, concept) =>
          `Casual Idol Fashion Style${concept ? ` [${concept}]` : ''}: Member wears an oversized slouchy collegiate crewneck sweatshirt in ${c1} with bold ${c3} varsity typography worn casually off one shoulder, layered over a ${c2} fitted tank, paired with a cute ${c2} pleated casual tennis skort and retro platform trainers with white crew socks.`,
        accessories: ["Scrunchie on wrist", "Small silver hoops", "Heart charm necklace"],
        vibe: "Effervescent, sporty-sweet youth idol allure."
      },
      {
        title: "Casual: Soft Cropped Baby Cardigan & Wide-Leg Cargo Denim",
        buildDescription: (c1, c2, c3, concept) =>
          `Casual Idol Fashion Style${concept ? ` [${concept}]` : ''}: Member wears a soft cropped fine-knit baby cardigan in ${c1} with cute ${c2} buttons over a fitted scoop-neck ${c2} baby tank, paired with high-waisted relaxed wide-leg ${c2} cargo denim jeans featuring subtle ${c3} stitching, and clean platform sneakers.`,
        accessories: ["Dainty wildflower choker", "Pastel beaded bracelet", "Cute hair clips"],
        vibe: "Dreamy, effortless girl-next-door superstar allure."
      },
      {
        title: "Casual: Boxy Short-Sleeve Overshirt & High-Waist Baggy Skater Denim",
        buildDescription: (c1, c2, c3, concept) =>
          `Casual Idol Fashion Style${concept ? ` [${concept}]` : ''}: Member wears a cropped boxy short-sleeve overshirt in ${c1} unbuttoned over a ${c2} ribbed halter crop top with ${c3} piping, paired with relaxed high-waisted wide-leg ${c2} washed skater denim and chunky platform kicks.`,
        accessories: ["Silver star pendant", "Tinted sunglasses on head", "Silver ear cuff stack"],
        vibe: "Fresh, confident Seoul street-casual cool."
      },
      {
        title: "Casual: Sporty Color-Blocked Windbreaker & Casual A-Line Skort",
        buildDescription: (c1, c2, c3, concept) =>
          `Casual Idol Fashion Style${concept ? ` [${concept}]` : ''}: Member wears a cropped color-blocked nylon windbreaker in ${c1} with ${c3} neon piping, over a soft ${c2} fitted crop tee, paired with a high-waisted ${c1} casual A-line denim skort and chunky retro runners with athletic crew socks.`,
        accessories: ["Sporty hair tie", "Silver micro hoops", "Crossbody mini bag strap"],
        vibe: "High-energy, athletic dance practice center idol."
      },
      {
        title: "Casual: Oversized Vintage Racing Jersey & Relaxed Denim Jorts",
        buildDescription: (c1, c2, c3, concept) =>
          `Casual Idol Fashion Style${concept ? ` [${concept}]` : ''}: Member wears an oversized vintage motocross racing jersey in ${c1} with bold ${c2} and ${c3} sponsor graphics, paired with slouchy ${c2} denim jorts, crew socks, and platform sneakers.`,
        accessories: ["Silver chain necklace", "Thick headband", "Silver hoops"],
        vibe: "Rebellious, energetic girl group main dancer swagger."
      },
      {
        title: "Casual: Baby Crop Tee & Layered Cargo Skater Skirt",
        buildDescription: (c1, c2, c3, concept) =>
          `Casual Idol Fashion Style${concept ? ` [${concept}]` : ''}: Member wears a fitted 90s baby tee in ${c1} with subtle ${c3} collegiate lettering, paired with a relaxed low-rise ${c2} casual cargo mini skirt with subtle buckle hardware, scrunched white socks, and chunky platform sneakers.`,
        accessories: ["Silver star barrettes", "Dainty beaded choker", "Silver ring set"],
        vibe: "Playful, carefree Y2K casual idol charisma."
      }
    ]
  },
  {
    id: "preppy",
    name: "Preppy",
    category: "universal",
    tagline: "Youthful Varsity Letterman & Collegiate Idol Casual",
    description: "Iconic youthful collegiate idol aesthetic featuring relaxed varsity bombers, slouchy cricket knits, casual pleated mini-skorts, relaxed skater chinos, and chunky platform sneakers. Strictly youthful idol wear with zero stuffy corporate suiting or office wear.",
    curated3ColorSchemes: [
      {
        paletteName: "Varsity Navy, Chalk & Crimson",
        colors: ["Midnight Navy", "Chalk White", "Crimson Red"],
        displayString: "Midnight Navy, Chalk White, and Crimson Red"
      },
      {
        paletteName: "Ivy Green, Cream & Amber",
        colors: ["Forest Green", "Ecru Cream", "Golden Amber"],
        displayString: "Forest Green, Ecru Cream, and Golden Amber"
      },
      {
        paletteName: "Oxford Maroon, Camel & Crisp White",
        colors: ["Oxford Maroon", "Camel Tan", "Crisp White"],
        displayString: "Oxford Maroon, Camel Tan, and Crisp White"
      },
      {
        paletteName: "Collegiate Sky Blue, Ivory & Slate",
        colors: ["Pastel Sky Blue", "Ivory White", "Charcoal Grey"],
        displayString: "Pastel Sky Blue, Ivory White, and Charcoal Grey"
      }
    ],
    maleSilhouettes: [
      {
        title: "Preppy: Relaxed Varsity Letterman Bomber & Skater Chinos",
        buildDescription: (c1, c2, c3, concept) =>
          `Preppy Idol Fashion Style${concept ? ` [${concept}]` : ''}: Member wears a relaxed wool-and-leather varsity bomber jacket in ${c1} with contrast ${c2} sleeves and ${c3} varsity letter patch, layered over a soft ${c2} graphic tee, styled with relaxed ${c1} skater chinos and retro court sneakers with white athletic crew socks. Strictly casual idol wear, no office blazers or ties.`,
        accessories: ["Enamel varsity badge", "Silver link chain", "Baseball cap worn backward"],
        vibe: "Campus heartthrob idol with irresistible high-teen charisma."
      },
      {
        title: "Preppy: Slouchy V-Neck Cricket Knit & Wide Pleated Trousers",
        buildDescription: (c1, c2, c3, concept) =>
          `Preppy Idol Fashion Style${concept ? ` [${concept}]` : ''}: Member wears an oversized slouchy cable-knit cricket sweater in ${c2} with ${c1} and ${c3} neckline stripes, layered loosely over an untucked ${c1} collared polo, styled with wide relaxed ${c1} casual trousers and chunky designer trainers.`,
        accessories: ["Silver wire glasses", "Dual silver rings", "Woven wristband"],
        vibe: "Warm, scholarly, effortless boyband center charm."
      },
      {
        title: "Preppy: Dropped-Shoulder Collegiate Cardigan & Casual Prep Denim",
        buildDescription: (c1, c2, c3, concept) =>
          `Preppy Idol Fashion Style${concept ? ` [${concept}]` : ''}: Member wears a slouchy dropped-shoulder knit cardigan in ${c1} with ${c2} collegiate sleeve stripes, worn unbuttoned over a relaxed ${c2} boxy tee with subtle ${c3} embroidery, paired with relaxed ${c2} washed vintage denim and clean low-top sneakers.`,
        accessories: ["Silver ball chain", "Leather cord bracelet", "Signet ring"],
        vibe: "Approachable, romantic campus pop-star allure."
      },
      {
        title: "Preppy: Cropped Sport-Prep Windbreaker & Straight Casual Chinos",
        buildDescription: (c1, c2, c3, concept) =>
          `Preppy Idol Fashion Style${concept ? ` [${concept}]` : ''}: Member wears a boxy lightweight nylon windbreaker in ${c1} with ${c2} color blocking and ${c3} athletic collar tipping, over an everyday ${c2} tee, styled with straight-leg ${c1} casual chinos and platform sneakers.`,
        accessories: ["Sporty crossbody sling", "Ear studs", "Digital watch"],
        vibe: "High-energy, youthful athletic stage presence."
      }
    ],
    femaleSilhouettes: [
      {
        title: "Preppy: Cropped Varsity Bomber & Pleated Tennis Skort",
        buildDescription: (c1, c2, c3, concept) =>
          `Preppy Idol Fashion Style${concept ? ` [${concept}]` : ''}: Member wears a cropped varsity bomber jacket in ${c1} with ${c2} striped rib trim, over a fitted ${c2} baby crop tee with ${c3} lettering, paired with a high-rise ${c2} pleated tennis skort with ${c3} hem stripe, white crew socks, and chunky platform sneakers. Strictly casual idol wear, no office blazers.`,
        accessories: ["Ribbon hair clips", "Dainty star necklace", "Mini backpack"],
        vibe: "Iconic high-teen K-pop queen with infectious youthful charm."
      },
      {
        title: "Preppy: Slouchy Cable-Knit Cricket Jumper & Plaid Pleated Skort",
        buildDescription: (c1, c2, c3, concept) =>
          `Preppy Idol Fashion Style${concept ? ` [${concept}]` : ''}: Member wears an oversized slouchy cable-knit cricket jumper in ${c2} with ${c1} and ${c3} V-neck stripes worn off one shoulder over a ${c1} fitted crop tank, paired with a structured ${c1} pleated skort and platform chunky loafers with ruffled socks.`,
        accessories: ["Satin hair bow", "Silver micro hoops", "Heart pendant"],
        vibe: "Effortlessly sweet, iconic teen-pop center star charisma."
      },
      {
        title: "Preppy: Cropped Knit Vest & High-Waist Wide Pleated Denim",
        buildDescription: (c1, c2, c3, concept) =>
          `Preppy Idol Fashion Style${concept ? ` [${concept}]` : ''}: Member wears a cropped collegiate knit sweater vest in ${c1} with ${c3} contrast neckline piping, over a ${c2} fitted baby tee, paired with high-waisted relaxed wide-leg ${c2} washed skater denim and chunky white sneakers.`,
        accessories: ["Pearl bead necklace", "Pastel hair barrettes", "Thin silver rings"],
        vibe: "Trendy Seoul street-prep trendsetter aura."
      },
      {
        title: "Preppy: Casual Half-Zip Prep Fleece & A-Line Denim Skort",
        buildDescription: (c1, c2, c3, concept) =>
          `Preppy Idol Fashion Style${concept ? ` [${concept}]` : ''}: Member wears a relaxed half-zip fleece pullover in ${c1} with ${c3} zipper pull, over a soft ${c2} inner layer, paired with a high-waisted structured ${c1} A-line denim skort and retro platform runners with scrunched socks.`,
        accessories: ["Scrunchie wristband", "Dainty ear studs", "Crossbody mini bag"],
        vibe: "Fresh, youthful stadium rehearsal idol energy."
      }
    ]
  },
  {
    id: "streetwear",
    name: "High-End Streetwear",
    tagline: "Urban Hip-Hop & Modern Seoul Street-Luxe",
    description: "Bold contemporary streetwear with oversized boxy bombers, layered graphic hoodies, baggy skate and cargo trousers, silver chain accents, and statement designer sneakers.",
    curated3ColorSchemes: [
      {
        paletteName: "Electric Lime, Obsidian & Optic White",
        colors: ["Electric Lime", "Obsidian Black", "Optic White"],
        displayString: "Electric Lime, Obsidian Black, and Optic White"
      },
      {
        paletteName: "Royal Purple, Matte Black & Signal Yellow",
        colors: ["Royal Purple", "Matte Black", "Bright Yellow"],
        displayString: "Royal Purple, Matte Black, and Bright Yellow"
      },
      {
        paletteName: "Signal Orange, Steel Grey & Clean White",
        colors: ["Signal Orange", "Steel Grey", "Clean White"],
        displayString: "Signal Orange, Steel Grey, and Clean White"
      },
      {
        paletteName: "Flame Red, Pitch Black & Acid Grey",
        colors: ["Flame Red", "Pitch Black", "Acid Wash Grey"],
        displayString: "Flame Red, Pitch Black, and Acid Wash Grey"
      }
    ],
    maleSilhouettes: [
      {
        title: "Streetwear: Oversized MA-1 Bomber & Baggy Skate Denim",
        buildDescription: (c1, c2, c3) =>
          `Streetwear Fashion Style: Member wears a voluminous cropped MA-1 nylon bomber in ${c1} with ${c2} utility accents, layered over a boxy ${c3} heavyweight graphic tee, paired with ultra-baggy ${c2} skate denim pooling over chunky designer platform sneakers.`,
        accessories: ["Heavy Cuban link chain", "Silver wallet chain", "Chunky signet ring"],
        vibe: "Magnetic, high-swagger hip-hop runway idol presence."
      },
      {
        title: "Streetwear: Two-Tone Windbreaker & Parachute Cargo Pants",
        buildDescription: (c1, c2, c3) =>
          `Streetwear Fashion Style: Member wears a color-blocked zip windbreaker jacket in ${c1} and ${c3}, layered over a ${c2} mock-neck compression base, paired with wide ${c2} parachute pants and high-top skate shoes.`,
        accessories: ["Layered industrial ball chains", "Embroidered beanie", "Black metal ring"],
        vibe: "Sharp, athletic Seoul streetwear energy."
      },
      {
        title: "Streetwear: Structured Leather Moto Overshirt & Relaxed Utility Trousers",
        buildDescription: (c1, c2, c3) =>
          `Streetwear Fashion Style: Member wears a structured boxy leather zip overshirt in ${c2} with subtle ${c3} stitching, layered over a clean ${c1} heavyweight cotton tee, paired with relaxed ${c1} utility trousers and designer high-top runners.`,
        accessories: ["Thick silver curb necklace", "Industrial metal wrist cuff", "Dual rings"],
        vibe: "Urban runway prestige with effortless swagger."
      },
      {
        title: "Streetwear: Cropped Heavyweight Hoodie & Wide Skater Slacks",
        buildDescription: (c1, c2, c3) =>
          `Streetwear Fashion Style: Member wears a boxy cropped heavyweight French-terry hoodie in ${c1} with bold ${c3} sleeve typography, layered over an extended ${c2} tank, styled with loose ${c2} skater slacks and thick-soled chunky trainers.`,
        accessories: ["Silver ear cuff", "Metal key clip", "Heavy signet ring"],
        vibe: "Rebellious, high-energy Seoul street idol presence."
      }
    ],
    femaleSilhouettes: [
      {
        title: "Streetwear: Cropped Racing Bomber & Wide-Leg Cargo Pants",
        buildDescription: (c1, c2, c3) =>
          `Streetwear Fashion Style: Member wears a cropped padded racing bomber jacket in ${c1} with ${c3} sleeve stripes, layered over a fitted ${c2} zip crop top, paired with relaxed low-rise ${c2} cargo trousers and chunky platform kicks.`,
        accessories: ["Chunky silver chain choker", "Silver belly chain", "Angular dark sunglasses"],
        vibe: "Fierce, trend-setting street-luxe girl crush swagger."
      },
      {
        title: "Streetwear: Oversized Graphic Jersey & Baggy Skater Denim",
        buildDescription: (c1, c2, c3) =>
          `Streetwear Fashion Style: Member wears an oversized vintage hockey/motorcross jersey in ${c1} with ${c2} and ${c3} number graphics, paired with slouchy ${c2} baggy denim shorts and high-top sneakers with scrunched athletic socks.`,
        accessories: ["Thick chain necklace", "Hoop earrings with charms", "Beanie hat"],
        vibe: "Playful, rebellious street icon presence."
      },
      {
        title: "Streetwear: Asymmetric Halter Top & High-Waisted Relaxed Slacks",
        buildDescription: (c1, c2, c3) =>
          `Streetwear Fashion Style: Member wears a sculpted asymmetric cut-out halter top in ${c2} with subtle ${c3} piping, styled with high-waisted relaxed fluid ${c1} street slacks featuring an accent ${c3} belt, and platform combat trainers.`,
        accessories: ["Layered industrial ball chains", "Silver ear cuff stack", "Rhinestone ring"],
        vibe: "Edgy, razor-sharp editorial girl crush attitude."
      },
      {
        title: "Streetwear: Cropped Biker Leather Jacket & Cargo Mini-Skort",
        buildDescription: (c1, c2, c3) =>
          `Streetwear Fashion Style: Member wears a structured cropped biker leather jacket in ${c1} with silver hardware, layered over a ribbed ${c2} baby crop tee, paired with a matching structured ${c1} cargo mini-skort with subtle ${c3} tab accents, and knee-high lace-up platform boots.`,
        accessories: ["Silver lock pendant", "Chunky chain bracelet", "Dark tinted sunglasses"],
        vibe: "Unstoppable, commanding main-character idol energy."
      }
    ]
  },
  {
    id: "y2k",
    name: "Y2K Retro",
    tagline: "Nostalgic 2000s Millennium Pop Aesthetic",
    description: "Nostalgic turn-of-the-millennium pop star fashion with low-slung baggy cargo pants, sporty windbreakers, baby tees, tinted shades, and futuristic sporty accents.",
    curated3ColorSchemes: [
      {
        paletteName: "Bubblegum Pink, Ice Silver & Pure White",
        colors: ["Hot Bubblegum Pink", "Ice Silver", "Pure White"],
        displayString: "Hot Bubblegum Pink, Ice Silver, and Pure White"
      },
      {
        paletteName: "Electric Cyan, Optic White & Jet Black",
        colors: ["Electric Cyan", "Optic White", "Jet Black"],
        displayString: "Electric Cyan, Optic White, and Jet Black"
      },
      {
        paletteName: "Chrome Metallic, Baby Blue & Neon Lime",
        colors: ["Baby Blue", "Chrome Metallic", "Neon Lime"],
        displayString: "Baby Blue, Chrome Metallic, and Neon Lime"
      }
    ],
    maleSilhouettes: [
      {
        title: "Y2K: Retro Track Jacket & Low-Slung Baggy Jeans",
        buildDescription: (c1, c2, c3) =>
          `Y2K Fashion Style: Member wears a retro sporty zip track jacket in ${c1} with reflective ${c2} piping, over an optic ${c3} ribbed tank, paired with low-slung wide ${c2} vintage washed jeans and retro Millennium runner sneakers.`,
        accessories: ["Tinted frameless sunglasses", "Silver dog-tag necklace", "Spiked gel ear studs"],
        vibe: "Nostalgic MTV 2000s boyband heartthrob swagger."
      },
      {
        title: "Y2K: Metallic-Accent Zip Hoodie & Relaxed Skate Denim",
        buildDescription: (c1, c2, c3) =>
          `Y2K Fashion Style: Member wears an oversized zip hoodie in ${c2} with reflective ${c3} sleeve stripes and ${c1} embroidered logo, over a fitted ${c1} tee, paired with relaxed wide ${c1} skater denim and chunky Millennium skate shoes.`,
        accessories: ["Silver ball-chain necklace", "Frosted visor shades", "Dual metal rings"],
        vibe: "High-octane Millennium futuristic boyband swagger."
      },
      {
        title: "Y2K: Boxy Mock-Neck & Contrast-Stitch Cargo Trousers",
        buildDescription: (c1, c2, c3) =>
          `Y2K Fashion Style: Member wears a boxy short-sleeve mock-neck in ${c1} with ${c2} contrast stitching, layered over a long-sleeve ${c2} base, styled with low-rise ${c1} cargo trousers featuring ${c3} buckle accents and platform runners.`,
        accessories: ["Chunky link chain", "Futuristic wraparound shades", "Silver wrist cuff"],
        vibe: "Electrifying turn-of-the-century music video pop energy."
      },
      {
        title: "Y2K: Sleeveless Tech Knit & Wide Low-Rise Slacks",
        buildDescription: (c1, c2, c3) =>
          `Y2K Fashion Style: Member wears a sculpted sleeveless fine-ribbed high-neck top in ${c2} with subtle ${c3} side piping, paired with fluid low-slung ${c1} wide-leg slacks and metallic-accented low sneakers.`,
        accessories: ["Silver chain necklace", "Industrial clip belt", "Ear studs"],
        vibe: "Clean, athletic futuristic pop star presence."
      }
    ],
    femaleSilhouettes: [
      {
        title: "Y2K: Shrunken Baby Tee & Low-Rise Cargo Skirt",
        buildDescription: (c1, c2, c3) =>
          `Y2K Fashion Style: Member wears a shrunken contrast-stitch baby tee in ${c1} with glitter ${c3} typography, paired with a low-rise ${c2} nylon cargo mini skirt with buckle hardware, knee-high warmers, and chunky platform sneakers.`,
        accessories: ["Rhinestone butterfly clips", "Tinted oval sunglasses", "Silver star belly chain"],
        vibe: "Peak Millennium pop princess nostalgia and high-energy glam."
      },
      {
        title: "Y2K: Cropped Velour Zip Track Jacket & Baggy Flare Denim",
        buildDescription: (c1, c2, c3) =>
          `Y2K Fashion Style: Member wears a plush cropped velour zip jacket in ${c2} with ${c3} rhinestone detailing, layered over a ribbed ${c1} crop camisole, paired with low-rise ${c1} baggy flare jeans and platform kicks.`,
        accessories: ["Frameless gradient sunglasses", "Silver heart locket", "Sparkling hair clips"],
        vibe: "Playful, glamorous turn-of-the-millennium pop royalty."
      },
      {
        title: "Y2K: Asymmetric Cut-Out Tank & Pleated Micro Suiting Skort",
        buildDescription: (c1, c2, c3) =>
          `Y2K Fashion Style: Member wears an asymmetric one-shoulder ribbed tank in ${c1} with delicate ${c3} piping, paired with a low-rise structured ${c2} pleated micro suiting skort, sheer knee socks, and chunky platform Mary Janes.`,
        accessories: ["Silver belly chain", "Beaded choker necklace", "Metallic hair clips"],
        vibe: "Trendy, energetic Y2K pop music show superstar."
      },
      {
        title: "Y2K: Halter Neck Mesh Top & High-Rise Wide-Leg Cargo Slacks",
        buildDescription: (c1, c2, c3) =>
          `Y2K Fashion Style: Member wears a double-layered halter neck top in ${c2} with a sheer ${c3} print overlay, paired with relaxed high-waisted ${c1} fluid wide-leg cargo slacks and platform runner sneakers.`,
        accessories: ["Layered star pendants", "Frosted lip gloss glow", "Silver hoop stack"],
        vibe: "Confident, magnetic girl group center charisma."
      }
    ]
  },
  {
    id: "old_money",
    name: "Old Money / Quiet Luxury",
    category: "universal",
    tagline: "Effortless Quiet-Luxury Idol & Relaxed Minimalist Knitwear",
    description: "Subtle, understated high-taste idol off-duty fashion celebrating relaxed cashmere knits, fluid linen camp-collar overshirts, slouchy polo sweaters, relaxed pleated casual trousers, and clean designer court sneakers. Zero corporate business suits, zero wool overcoats with dress brogues, and zero office wear.",
    curated3ColorSchemes: [
      {
        paletteName: "Royal Amethyst, Alabaster White & Liquid Gold",
        colors: ["Royal Amethyst", "Alabaster White", "Liquid Gold"],
        displayString: "Royal Amethyst, Alabaster White, and Liquid Gold"
      },
      {
        paletteName: "Rich Navy, Alabaster White & Burnished Brass",
        colors: ["Rich Navy", "Alabaster White", "Burnished Brass"],
        displayString: "Rich Navy, Alabaster White, and Burnished Brass"
      },
      {
        paletteName: "Muted Olive, Oatmeal Beige & Charcoal",
        colors: ["Muted Olive", "Oatmeal Beige", "Charcoal Tweed"],
        displayString: "Muted Olive, Oatmeal Beige, and Charcoal Tweed"
      }
    ],
    maleSilhouettes: [
      {
        title: "Old Money: Relaxed Cashmere Crewneck & Fluid Pleated Trousers",
        buildDescription: (c1, c2, c3, concept) =>
          `Quiet Luxury Idol Fashion Style${concept ? ` [${concept}]` : ''}: Member wears a slouchy fine-gauge cashmere crewneck sweater in ${c1} with a clean ${c2} inner tee peeking casually at the neck, paired with relaxed wide-leg ${c2} pleated casual trousers and clean minimalist designer court sneakers. Strictly casual idol wear, no stuffy corporate blazers or dress shoes.`,
        accessories: ["Gold signet ring", "Minimalist watch", "Thin gold chain"],
        vibe: "Quiet luxury prestige with effortless off-duty idol ease."
      },
      {
        title: "Old Money: Breezy Silk-Linen Camp Overshirt & Straight Chinos",
        buildDescription: (c1, c2, c3, concept) =>
          `Quiet Luxury Idol Fashion Style${concept ? ` [${concept}]` : ''}: Member wears a breezy boxy camp-collar overshirt in ${c2} unbuttoned over a soft ${c1} ribbed tank, paired with straight-leg ${c1} relaxed chinos with a woven ${c3} belt and clean canvas court sneakers.`,
        accessories: ["Tortoiseshell sunglasses", "Minimalist gold band", "Leather cord bracelet"],
        vibe: "Sun-drenched, sophisticated Riviera off-duty idol allure."
      },
      {
        title: "Old Money: Slouchy Fine-Knit Polo Sweater & Wide Casual Slacks",
        buildDescription: (c1, c2, c3, concept) =>
          `Quiet Luxury Idol Fashion Style${concept ? ` [${concept}]` : ''}: Member wears a relaxed open-collar fine-knit polo sweater in ${c1} with subtle ${c3} collar tipping, styled with relaxed fluid ${c2} wide-leg casual slacks and platform trainers.`,
        accessories: ["Thin gold wrist chain", "Wire-frame glasses", "Minimalist ring"],
        vibe: "Scholarly, understated heir charisma with youthful poise."
      },
      {
        title: "Old Money: Lightweight Minimalist Zip Jacket & Relaxed Trousers",
        buildDescription: (c1, c2, c3, concept) =>
          `Quiet Luxury Idol Fashion Style${concept ? ` [${concept}]` : ''}: Member wears a lightweight unlined minimalist zip jacket in ${c2}, layered over a relaxed ${c1} cotton crewneck, styled with relaxed ${c1} casual trousers and clean designer sneakers.`,
        accessories: ["Vintage leather-strap watch", "Silver band ring", "Dainty chain"],
        vibe: "Impeccably styled quiet luxury off-duty superstar."
      }
    ],
    femaleSilhouettes: [
      {
        title: "Old Money: Cropped Bouclé Knit Cardigan & Fluid Wide Slacks",
        buildDescription: (c1, c2, c3, concept) =>
          `Quiet Luxury Idol Fashion Style${concept ? ` [${concept}]` : ''}: Member wears a soft cropped bouclé knit cardigan in ${c1} with delicate ${c2} pearl buttons, over a soft ${c2} baby cami, paired with high-waisted relaxed fluid ${c1} wide-leg trousers and clean designer platform sneakers. Strictly casual idol wear, no office blazers.`,
        accessories: ["Dainty pearl drop earrings", "Gold chain bracelet", "Vintage leather watch"],
        vibe: "Effortless heiress off-duty style with radiant youth."
      },
      {
        title: "Old Money: Slouchy Cashmere Knit & Pleated Wool Mini-Skort",
        buildDescription: (c1, c2, c3, concept) =>
          `Quiet Luxury Idol Fashion Style${concept ? ` [${concept}]` : ''}: Member wears an oversized slouchy cashmere sweater in ${c2} worn off one shoulder over a ${c1} crop tank, paired with a structured ${c1} pleated wool mini-skort with ${c3} piping and platform chunky loafers with ruffled ankle socks.`,
        accessories: ["Pearl hair barrettes", "Dainty gold pendant", "Thin gold rings"],
        vibe: "Polished, youthful quiet luxury center idol charm."
      },
      {
        title: "Old Money: Sleeveless Fine-Knit Mock Top & High-Rise Linen Slacks",
        buildDescription: (c1, c2, c3, concept) =>
          `Quiet Luxury Idol Fashion Style${concept ? ` [${concept}]` : ''}: Member wears a soft sleeveless fine-knit mock-neck top in ${c1}, paired with high-rise relaxed ${c2} linen wide slacks with a subtle ${c3} slim belt, and platform mule slip-ons.`,
        accessories: ["Gold hoop earrings", "Tortoiseshell shades", "Minimalist bangles"],
        vibe: "Chic, commanding heiress elegance with modern ease."
      },
      {
        title: "Old Money: Cropped Minimalist Suiting Jacket & A-Line Pleated Skort",
        buildDescription: (c1, c2, c3, concept) =>
          `Quiet Luxury Idol Fashion Style${concept ? ` [${concept}]` : ''}: Member wears a collarless cropped lightweight jacket in ${c2} over a ${c1} scoop-neck baby tank, paired with a matching high-waisted ${c1} casual pleated skort and platform retro court sneakers with crew socks.`,
        accessories: ["Silk hair ribbon", "Dainty pearl stud earrings", "Gold signet pinky ring"],
        vibe: "Timeless, youthful quiet luxury pop star presence."
      }
    ]
  },
  {
    id: "glam_rock",
    name: "Glam Rock",
    tagline: "Edgy Rockstar Leather, Distressed Denim & Silver Chains",
    description: "Rebellious idol rock aesthetic with sleek leather jackets, distressed denim, layered check flannel accents, silver chains and rings, and chunky combat boots.",
    curated3ColorSchemes: [
      {
        paletteName: "Heritage Plaid, Pitch Black Leather & Smoked Silver",
        colors: ["Heritage Red Plaid", "Pitch Black Leather", "Smoked Silver"],
        displayString: "Heritage Red Plaid, Pitch Black Leather, and Smoked Silver"
      },
      {
        paletteName: "Cobalt Navy, Distressed Charcoal & Chalk White",
        colors: ["Cobalt Navy", "Distressed Charcoal", "Chalk White"],
        displayString: "Cobalt Navy, Distressed Charcoal, and Chalk White"
      },
      {
        paletteName: "Emerald Green, Jet Black & Chrome Steel",
        colors: ["Emerald Green", "Jet Black", "Chrome Steel"],
        displayString: "Emerald Green, Jet Black, and Chrome Steel"
      }
    ],
    maleSilhouettes: [
      {
        title: "Glam Rock: Biker Moto Leather & Distressed Raw Denim",
        buildDescription: (c1, c2, c3) =>
          `Glam Rock Fashion Style: Member wears an asymmetrical biker leather jacket in ${c2} accented with silver studs, layered over a distressed vintage ${c3} band tee and tied ${c1} check flannel at the waist, paired with slim-straight distressed ${c2} raw denim and buckled combat boots.`,
        accessories: ["Layered skull & cross silver pendants", "Leather wrist wrap", "Silver ring stack"],
        vibe: "Electrifying rockstar frontman magnetism with rebellious attitude."
      },
      {
        title: "Glam Rock: Structured Velvet Blazer & Coated Slim Trousers",
        buildDescription: (c1, c2, c3) =>
          `Glam Rock Fashion Style: Member wears a structured single-breasted velvet blazer in ${c1} with satin lapels, layered over a deep ${c2} silk-blend button-down unbuttoned at the collar with a slim ${c3} metallic scarf, paired with coated ${c2} slim trousers and pointed chelsea boots.`,
        accessories: ["Silver cross pendant", "Multiple silver rings", "Engraved cuff bracelet"],
        vibe: "Dark, magnetic glam rockstar aura with runway elegance."
      },
      {
        title: "Glam Rock: Distressed Band Cardigan & Straight Rocker Denim",
        buildDescription: (c1, c2, c3) =>
          `Glam Rock Fashion Style: Member wears an oversized distressed mohair knit cardigan in ${c1} with ${c3} safety pin hardware, layered over a soft ${c2} graphic tee, paired with straight-leg ${c2} washed rocker denim and chunky creepers.`,
        accessories: ["Layered thin curb chains", "Silver ear studs", "Leather wristband"],
        vibe: "Grunge-infused charismatic idol swagger."
      },
      {
        title: "Glam Rock: Asymmetric Zip Leather Overshirt & Pressed Slacks",
        buildDescription: (c1, c2, c3) =>
          `Glam Rock Fashion Style: Member wears an asymmetric zip leather overshirt in ${c2} with subtle ${c1} contrast piping, over a ${c3} sheer mesh base, paired with pressed ${c1} tailored rock slacks with a silver wallet chain and lug-sole boots.`,
        accessories: ["Heavy silver chain necklace", "Spiked ear cuffs", "Signet ring"],
        vibe: "Razor-sharp, commanding rock idol frontman energy."
      }
    ],
    femaleSilhouettes: [
      {
        title: "Glam Rock: Cropped Studded Moto Jacket & Plaid Pleated Skirt",
        buildDescription: (c1, c2, c3) =>
          `Glam Rock Fashion Style: Member wears a cropped biker leather jacket in ${c2} with silver zipper hardware, layered over a sheer ${c3} mesh top with black bralette, paired with a pleated punk ${c1} tartan skort with safety pin hardware and chunky lace-up platform boots.`,
        accessories: ["Silver o-ring choker", "Fishnet tights", "Spike ear cuffs"],
        vibe: "Badass idol rockstar energy with high-fashion stage presence."
      },
      {
        title: "Glam Rock: Structured Leather Blazer & Coated High-Waist Slacks",
        buildDescription: (c1, c2, c3) =>
          `Glam Rock Fashion Style: Member wears a tailored single-breasted leather blazer in ${c1} with silver metallic buttons, layered over a fitted ${c2} lace-trim camisole with a ${c3} velvet ribbon choker, paired with high-waisted coated ${c2} trousers and pointed heeled boots.`,
        accessories: ["Layered rhinestone and silver chains", "Dark smoky stage makeup", "Silver midi rings"],
        vibe: "Fierce, glamorous rock queen authority."
      },
      {
        title: "Glam Rock: Distressed Band Knit & Asymmetric Suiting Skort",
        buildDescription: (c1, c2, c3) =>
          `Glam Rock Fashion Style: Member wears a slouchy drop-shoulder distressed knit in ${c2} with metallic ${c3} thread accents, layered over a ${c1} fitted bralette, paired with an asymmetric structured ${c1} suiting skort featuring silver grommets and platform combat boots.`,
        accessories: ["Silver safety pin earring", "Dual leather wrist cuffs", "Statement ring"],
        vibe: "Rebellious, effortless punk-luxe idol cool."
      },
      {
        title: "Glam Rock: Velvet Moto Top & Straight-Leg Split-Hem Trousers",
        buildDescription: (c1, c2, c3) =>
          `Glam Rock Fashion Style: Member wears a structured zip-front velvet moto crop top in ${c1} with silver hardware, layered over a sheer ${c2} long-sleeve base, styled with high-waisted ${c2} split-hem tailored slacks with ${c3} chain accents and heeled platform boots.`,
        accessories: ["Chunky silver chain choker", "Silver knuckle ring", "Smoky winged eyeliner"],
        vibe: "Electric, unforgettable rock goddess charisma."
      }
    ]
  },
  {
    id: "athleisure",
    name: "Sporty Athleisure",
    tagline: "High-Fashion Athletic & Performance Runway Luxe",
    description: "Elevated athletic sportswear with retro track jackets, racing stripes, tennis skirts, sleek zip-up bodysuits, and high-fashion running trainers.",
    curated3ColorSchemes: [
      {
        paletteName: "Classic Navy, Tennis White & Bright Kelly Green",
        colors: ["Classic Navy", "Tennis Court White", "Bright Kelly Green"],
        displayString: "Classic Navy, Tennis Court White, and Bright Kelly Green"
      },
      {
        paletteName: "Ferrari Red, Optic White & Midnight Black",
        colors: ["Ferrari Red", "Optic White", "Midnight Black"],
        displayString: "Ferrari Red, Optic White, and Midnight Black"
      }
    ],
    maleSilhouettes: [
      {
        title: "Athleisure: Track Jacket with Racing Stripes & Warmup Pants",
        buildDescription: (c1, c2, c3) =>
          `Sporty Athleisure Fashion Style: Member wears an elevated nylon track jacket in ${c1} with dual ${c2} and ${c3} racing stripes down the sleeves, paired with matching ${c1} track pants and futuristic athletic runway trainers.`,
        accessories: ["Sport sweatband wrist cuffs", "Reflective neck cord", "Digital chronograph"],
        vibe: "High-energy athletic precision and runway performance style."
      },
      {
        title: "Athleisure: Half-Zip Performance Anorak & Tailored Slacks",
        buildDescription: (c1, c2, c3) =>
          `Sporty Athleisure Fashion Style: Member wears a lightweight color-blocked half-zip anorak in ${c2} with ${c1} chest panels and ${c3} zipper pull, layered over a ${c1} compression mock-neck, paired with tailored ${c1} athleisure slacks and clean designer trainers.`,
        accessories: ["Reflective wrist strap", "Minimalist sports watch", "Matte ear studs"],
        vibe: "Sleek, aerodynamic athletic star power."
      },
      {
        title: "Athleisure: Ribbed Muscle Top & Relaxed Track Trousers",
        buildDescription: (c1, c2, c3) =>
          `Sporty Athleisure Fashion Style: Member wears a fitted sleeveless athletic knit top in ${c1} with contrast ${c3} collar trim, layered under an unzipped lightweight ${c2} warmup layer, paired with relaxed ${c2} track trousers and chunky trainers.`,
        accessories: ["Silver chain sport necklace", "Athletic sweatband", "Chronograph"],
        vibe: "Athletic, dynamic heartthrob idol presence."
      },
      {
        title: "Athleisure: Boxy Sport-Luxe Windbreaker & Straight Warmup Pants",
        buildDescription: (c1, c2, c3) =>
          `Sporty Athleisure Fashion Style: Member wears an oversized boxy windbreaker jacket in ${c2} with bold ${c1} side stripes and ${c3} piping, styled over a clean ${c1} crewneck base, with straight-leg ${c1} warmup trousers and low-top athletic shoes.`,
        accessories: ["Sporty crossbody strap", "Reflective ring", "Digital watch"],
        vibe: "Fresh, youthful stadium-ready performance energy."
      }
    ],
    femaleSilhouettes: [
      {
        title: "Athleisure: Quarter-Zip Track Top & Pleated Tennis Skirt",
        buildDescription: (c1, c2, c3) =>
          `Sporty Athleisure Fashion Style: Member wears a sleek quarter-zip performance top in ${c1} with ${c2} piping and ${c3} chest logo, paired with a pleated tennis skirt in ${c2}, ribbed white crew socks, and chunky designer runners.`,
        accessories: ["Visor cap", "Sporty wristband", "Silver micro-hoops"],
        vibe: "Dynamic, fresh athletic charisma and court-ready glam."
      },
      {
        title: "Athleisure: Cropped Windbreaker Jacket & Wide-Leg Track Pants",
        buildDescription: (c1, c2, c3) =>
          `Sporty Athleisure Fashion Style: Member wears a cropped nylon windbreaker in ${c2} with contrast ${c1} raglan sleeves and ${c3} neon piping, over a fitted ${c1} sports bra, paired with high-waist wide-leg ${c1} track pants and platform sneakers.`,
        accessories: ["Sporty hair tie", "Silver chain necklace", "Matte ear cuffs"],
        vibe: "Fierce, energetic main dancer swagger."
      },
      {
        title: "Athleisure: Sculpted Zip Vest & Contrast-Trim Tennis Skort",
        buildDescription: (c1, c2, c3) =>
          `Sporty Athleisure Fashion Style: Member wears a sculpted performance zip vest in ${c1} with ${c3} piping over a lightweight ${c2} cap-sleeve tee, paired with a structured ${c1} tennis skort featuring a ${c2} pleat underlay, and retro running shoes with crew socks.`,
        accessories: ["Athletic headband", "Small silver hoops", "Sport watch"],
        vibe: "Youthful, vibrant court-side pop idol energy."
      },
      {
        title: "Athleisure: Long-Sleeve Performance Crop Top & Fluid Warmup Pants",
        buildDescription: (c1, c2, c3) =>
          `Sporty Athleisure Fashion Style: Member wears a seamless compression long-sleeve crop top in ${c2} with thumbhole cuffs and subtle ${c3} linear accents, paired with high-waisted fluid ${c1} warmup trousers and chunky designer trainers.`,
        accessories: ["Sport cord necklace", "Minimalist hair clips", "Silver ring stack"],
        vibe: "Sleek, aerodynamic runway athleisure chic."
      }
    ]
  },
  {
    id: "chic_minimalist",
    name: "Chic Minimalist",
    tagline: "Clean Architectural Lines & Contemporary Fluid Tailoring",
    description: "Sharp monochromatic minimalism with boxy unstructured blazers, fluid high-waisted puddle slacks, clean tank tops, and sleek square-toe boots.",
    curated3ColorSchemes: [
      {
        paletteName: "Icy Cerulean, Titanium Silver & Pitch Onyx",
        colors: ["Icy Cerulean", "Titanium Silver", "Pitch Onyx"],
        displayString: "Icy Cerulean, Titanium Silver, and Pitch Onyx"
      },
      {
        paletteName: "Deep Plum, Chalk White & Liquid Copper",
        colors: ["Deep Plum", "Chalk White", "Liquid Copper"],
        displayString: "Deep Plum, Chalk White, and Liquid Copper"
      }
    ],
    maleSilhouettes: [
      {
        title: "Chic Minimalist: Collarless Blazer & Fluid Puddle Slacks",
        buildDescription: (c1, c2, c3) =>
          `Chic Minimalist Fashion Style: Member wears a clean collarless unstructured blazer in ${c1}, seamless modal ${c2} mock-neck tee, and wide fluid ${c3} puddle slacks pooling cleanly over sleek black leather square-toe boots.`,
        accessories: ["Titanium collar bar", "Geometric signet ring", "Clean leather dress watch"],
        vibe: "Architectural, ultra-modern art gallery authority."
      },
      {
        title: "Chic Minimalist: Boxy Double-Breasted Jacket & Straight Trousers",
        buildDescription: (c1, c2, c3) =>
          `Chic Minimalist Fashion Style: Member wears a boxy tailored double-breasted minimalist jacket in ${c2} with hidden horn buttons, over a fine ${c1} silk-cotton crewneck, paired with pressed ${c1} straight-leg trousers with subtle ${c3} metallic belt buckle and leather derbies.`,
        accessories: ["Sculptural silver cuff", "Minimalist geometric ring", "Sleek dress watch"],
        vibe: "Monolithic, sophisticated modern luxury composure."
      },
      {
        title: "Chic Minimalist: Asymmetric Wrap Shirt & High-Waist Wide Slacks",
        buildDescription: (c1, c2, c3) =>
          `Chic Minimalist Fashion Style: Member wears an architectural asymmetric wrap shirt in ${c1} with a clean concealed placket, layered over a ${c2} inner tank, paired with high-waisted fluid ${c2} wide slacks and square-toe leather loafers.`,
        accessories: ["Silver wire choker", "Minimalist signet ring", "Matte ear stud"],
        vibe: "Clean, sculptural contemporary high-fashion presence."
      },
      {
        title: "Chic Minimalist: Minimalist Zip Harrington & Pleated Drape Trousers",
        buildDescription: (c1, c2, c3) =>
          `Chic Minimalist Fashion Style: Member wears an unlined minimalist zip Harrington jacket in ${c1} with concealed seams, seamless ${c2} modal tee, and ${c1} wide drape trousers pooling over minimalist leather shoes.`,
        accessories: ["Brushed titanium ring", "Thin chain necklace", "Clean leather watch"],
        vibe: "Understated, effortless high-taste idol aura."
      }
    ],
    femaleSilhouettes: [
      {
        title: "Chic Minimalist: Asymmetric Suiting Vest & Wide Slacks",
        buildDescription: (c1, c2, c3) =>
          `Chic Minimalist Fashion Style: Member wears an architectural asymmetric tailored vest in ${c1} over a sheer ${c2} silk-blend base, paired with high-waisted ${c3} wide-leg trousers and pointed kitten-heel mules.`,
        accessories: ["Polished silver torque choker", "Minimalist ear cuffs", "Sleek silver bangle"],
        vibe: "Sculptural, high-fashion editorial presence with effortless grace."
      },
      {
        title: "Chic Minimalist: Sculpted Collarless Blazer & Fluid Wide Slacks",
        buildDescription: (c1, c2, c3) =>
          `Chic Minimalist Fashion Style: Member wears a tailored cropped collarless blazer in ${c2} with clean sharp shoulders, layered over a fine ${c1} silk camisole with a delicate ${c3} clasp, paired with high-rise fluid ${c1} wide-leg trousers and pointed boots.`,
        accessories: ["Sculptural geometric earrings", "Polished metal torque collar", "Stack of thin rings"],
        vibe: "Commanding, razor-sharp modern runway elegance."
      },
      {
        title: "Chic Minimalist: High-Neck Draped Top & Tailored Slacks",
        buildDescription: (c1, c2, c3) =>
          `Chic Minimalist Fashion Style: Member wears a sleeveless high-neck draped cowl top in ${c1} in liquid matte fabric, styled with tailored ${c2} pleated high-waisted slacks with a slim ${c3} leather belt and minimalist heeled sandals.`,
        accessories: ["Silver bar earrings", "Minimalist cuff", "Geometric ring"],
        vibe: "Effortlessly poised, statuesque gallery-chic grace."
      },
      {
        title: "Chic Minimalist: Clean Tailored Blazer Dress & Sleek Heeled Mules",
        buildDescription: (c1, c2, c3) =>
          `Chic Minimalist Fashion Style: Member wears a structured minimalist single-breasted blazer dress in ${c1} with clean concealed closures and subtle ${c3} metallic waist hardware, paired with sheer black tights and polished ${c2} leather pointed mules.`,
        accessories: ["Architectural drop earrings", "Thin silver wire bracelet", "Minimalist ear cuff"],
        vibe: "Iconic, statuesque haute couture stage presence."
      }
    ]
  },
  {
    id: "soft_indie",
    name: "Soft Romantic Indie",
    tagline: "Gentle Pastel Knitwear & Poetic Dreamy Warmth",
    description: "Soft dreamy idol fashion with fluffy brushed pastel cardigans, open-collar linen shirts, relaxed corduroy trousers, and gentle romantic charm.",
    curated3ColorSchemes: [
      {
        paletteName: "Dusty Rose, Soft Cream & Sage Mist",
        colors: ["Dusty Rose", "Soft Cream", "Sage Mist"],
        displayString: "Dusty Rose, Soft Cream, and Sage Mist"
      },
      {
        paletteName: "Pale Lavender, Buttercream & Pearl Grey",
        colors: ["Pale Lavender", "Buttercream Yellow", "Pearl Grey"],
        displayString: "Pale Lavender, Buttercream Yellow, and Pearl Grey"
      }
    ],
    maleSilhouettes: [
      {
        title: "Soft Indie: Fluffy Mohair Cardigan & Relaxed Corduroy Slacks",
        buildDescription: (c1, c2, c3) =>
          `Soft Romantic Indie Fashion Style: Member wears an oversized fuzzy mohair knit cardigan in ${c1}, layered over a gentle ${c2} open-collar linen shirt, styled with soft ${c3} corduroy trousers and vintage suede loafers.`,
        accessories: ["Layered delicate silver chains", "Floral signet ring", "Soft woven wristlet"],
        vibe: "Dreamy, poetic warmth with gentle romantic charisma."
      },
      {
        title: "Soft Indie: Textured Crochet Knit & Fluid Linen Trousers",
        buildDescription: (c1, c2, c3) =>
          `Soft Romantic Indie Fashion Style: Member wears an open-work crochet knit sweater in ${c2} with subtle ${c1} and ${c3} floral stitching, layered over a soft ${c1} tank, paired with relaxed fluid ${c1} linen trousers and woven leather mules.`,
        accessories: ["Beaded cord necklace", "Silver flower ring", "Thin fabric bracelet"],
        vibe: "Artistic, bohemian warmth and tender idol presence."
      },
      {
        title: "Soft Indie: Brushed Wool Overshirt & Relaxed Tapered Chinos",
        buildDescription: (c1, c2, c3) =>
          `Soft Romantic Indie Fashion Style: Member wears a soft brushed wool overshirt in ${c1}, layered over a lightweight ${c2} waffle-knit Henley shirt with ${c3} buttons, styled with relaxed ${c2} tapered chinos and clean retro canvas shoes.`,
        accessories: ["Vintage leather cord pendant", "Brass ring", "Soft woven watch strap"],
        vibe: "Warm, comforting, poetic singer-songwriter charisma."
      },
      {
        title: "Soft Indie: Open-Collar Resort Shirt & Straight Corduroy Pants",
        buildDescription: (c1, c2, c3) =>
          `Soft Romantic Indie Fashion Style: Member wears a relaxed open-collar camp shirt in ${c2} featuring delicate ${c3} embroidery, worn over a fine ${c1} ribbed tee, paired with straight-leg ${c1} corduroy pants and vintage suede wallabees.`,
        accessories: ["Layered dainty silver chains", "Enamel wildflower pin", "Cord bracelet"],
        vibe: "Sun-drenched, gentle nostalgic romance."
      }
    ],
    femaleSilhouettes: [
      {
        title: "Soft Indie: Ruffled Lace Blouse & Brushed Knit Skirt",
        buildDescription: (c1, c2, c3) =>
          `Soft Romantic Indie Fashion Style: Member wears a soft ruffled-collar blouse in ${c2} layered under a pastel ${c1} crop knit vest, paired with a pleated fluid ${c3} skirt and soft leather Mary Janes with lace socks.`,
        accessories: ["Pastel ribbon hair tie", "Dainty floral pendant", "Pearl cluster earrings"],
        vibe: "Fairy-tale romantic charm with delicate idol presence."
      },
      {
        title: "Soft Indie: Cropped Pastel Cardigan & High-Waist Linen Slacks",
        buildDescription: (c1, c2, c3) =>
          `Soft Romantic Indie Fashion Style: Member wears a fluffy brushed cropped knit cardigan in ${c1} with delicate pearl buttons, layered over a soft ${c2} camisole with subtle ${c3} lace trim, paired with high-waisted fluid ${c2} linen wide slacks and platform Mary Janes.`,
        accessories: ["Dainty wildflower choker", "Pearl hair clip", "Stack of pastel beaded rings"],
        vibe: "Ethereal, dreamy spring idol aesthetic."
      },
      {
        title: "Soft Indie: Draped Tiered Chiffon Mini Dress & Lace Trim Cardigan",
        buildDescription: (c1, c2, c3) =>
          `Soft Romantic Indie Fashion Style: Member wears a romantic tiered chiffon dress in ${c2} with delicate ${c3} botanical embroidery, draped with a soft slouchy knit cardigan in ${c1}, finished with Mary Jane shoes and ruffled ankle socks.`,
        accessories: ["Silk ribbon hair bow", "Delicate pearl drop earrings", "Vintage locket"],
        vibe: "Poetic, gentle storybook idol aura."
      },
      {
        title: "Soft Indie: Slouchy Chunky Knit Sweater & Pleated Corduroy Skort",
        buildDescription: (c1, c2, c3) =>
          `Soft Romantic Indie Fashion Style: Member wears an oversized slouchy cable knit in ${c1} off one shoulder, layered over a ${c2} lace bralette, paired with a structured ${c2} pleated soft corduroy skort with ${c3} button details and leather lace-up boots.`,
        accessories: ["Layered floral necklaces", "Knitted headband", "Dainty silver rings"],
        vibe: "Cozy, charming, and effortlessly romantic."
      }
    ]
  }
];

// Ensure all base styles have `palettes` defined
BASE_KPOP_POPULAR_FASHION_STYLES.forEach(style => {
  if (!style.palettes || style.palettes.length === 0) {
    style.palettes = toCuratedPalettes(style.curated3ColorSchemes);
  }
});

// Convert and merge styles from the comprehensive taxonomy
function convertTaxonomyItemToStyle(tItem: KpopStyleItem): PopularFashionStyle {
  const palettes = toCuratedPalettes(tItem.curated3ColorSchemes);
  const fallbackMale = [
    {
      title: `${tItem.name}: Boxy Lightweight Zip Bomber & Skater Denim`,
      buildDescription: (c1: string, c2: string, c3: string, concept?: string) =>
        `${tItem.name} Idol Fashion Style${concept ? ` [${concept}]` : ''}: Member wears a boxy lightweight zip bomber jacket in ${c1} with ${c3} athletic accents, layered over a soft ${c2} crewneck tee, paired with relaxed baggy vintage-wash skater denim in ${c2} and fresh designer chunky sneakers.`,
      accessories: ["Layered silver chain", "Minimalist ear stud", "Brushed metal ring"],
      vibe: `${tItem.name} energetic idol presence`
    },
    {
      title: `${tItem.name}: Oversized College Graphic Hoodie & Wide Skate Denim`,
      buildDescription: (c1: string, c2: string, c3: string, concept?: string) =>
        `${tItem.name} Idol Fashion Style${concept ? ` [${concept}]` : ''}: Member wears an oversized heavyweight hoodie in ${c1} featuring ${c3} graphic lettering, layered over a clean ${c2} inner tee, paired with wide-leg ${c2} washed skater denim and retro court sneakers.`,
      accessories: ["Silver curb necklace", "Embroidered beanie", "Dual silver rings"],
      vibe: `${tItem.name} cool off-duty idol swagger`
    },
    {
      title: `${tItem.name}: Washed Denim Trucker Jacket & Baggy Utility Denim`,
      buildDescription: (c1: string, c2: string, c3: string, concept?: string) =>
        `${tItem.name} Idol Fashion Style${concept ? ` [${concept}]` : ''}: Member wears an oversized washed denim trucker jacket in ${c1} with subtle ${c3} contrast stitching, over a soft ${c2} tee, styled with relaxed baggy utility denim in ${c2} and high-top skate sneakers.`,
      accessories: ["Silver collar chain", "Baseball cap worn backward", "Leather wristband"],
      vibe: `${tItem.name} fresh youth boyband charm`
    },
    {
      title: `${tItem.name}: Dropped-Shoulder Collegiate Crewneck & Relaxed Denim`,
      buildDescription: (c1: string, c2: string, c3: string, concept?: string) =>
        `${tItem.name} Idol Fashion Style${concept ? ` [${concept}]` : ''}: Member wears a cozy dropped-shoulder crewneck sweatshirt in ${c1} with ${c3} varsity chest print, layered over a ${c2} base, styled with relaxed wide-leg ${c2} vintage denim and chunky platform trainers.`,
      accessories: ["Minimalist ball chain", "Silver ear cuff", "Geometric ring"],
      vibe: `${tItem.name} approachable charismatic superstar allure`
    }
  ];
  const fallbackFemale = [
    {
      title: `${tItem.name}: Cropped Zip Hoodie & Baggy Washed Denim`,
      buildDescription: (c1: string, c2: string, c3: string, concept?: string) =>
        `${tItem.name} Idol Fashion Style${concept ? ` [${concept}]` : ''}: Member wears a cropped boxy fleece zip hoodie in ${c1} with ${c3} contrast drawstrings, layered over a fitted ${c2} baby rib tank, paired with relaxed low-slung baggy vintage-wash denim in ${c2} and platform retro sneakers with crew socks.`,
      accessories: ["Dainty silver star necklace", "Mini hair clips", "Beaded bracelet"],
      vibe: `${tItem.name} trendsetting idol airport fashion icon`
    },
    {
      title: `${tItem.name}: Cropped Denim Jacket & Pleated Mini-Skort`,
      buildDescription: (c1: string, c2: string, c3: string, concept?: string) =>
        `${tItem.name} Idol Fashion Style${concept ? ` [${concept}]` : ''}: Member wears a cute cropped washed denim jacket in ${c1} with silver hardware, over a soft ${c2} baby crop tee with ${c3} graphic accents, paired with a matching structured ${c1} pleated denim mini-skort and chunky white platform sneakers with athletic socks.`,
      accessories: ["Silver hoop earrings", "Satin ribbon in hair", "Layered micro chains"],
      vibe: `${tItem.name} bright youthful center pop star charm`
    },
    {
      title: `${tItem.name}: Oversized Collegiate Sweatshirt & Casual Tennis Skort`,
      buildDescription: (c1: string, c2: string, c3: string, concept?: string) =>
        `${tItem.name} Idol Fashion Style${concept ? ` [${concept}]` : ''}: Member wears an oversized slouchy crewneck sweatshirt in ${c1} with bold ${c3} typography, worn casually off one shoulder over a ${c2} fitted tank, paired with a cute ${c2} pleated casual tennis skort and retro platform trainers with white crew socks.`,
      accessories: ["Scrunchie on wrist", "Small silver hoops", "Heart pendant necklace"],
      vibe: `${tItem.name} sporty-sweet youth idol allure`
    },
    {
      title: `${tItem.name}: Soft Cropped Cardigan & High-Waist Cargo Denim`,
      buildDescription: (c1: string, c2: string, c3: string, concept?: string) =>
        `${tItem.name} Idol Fashion Style${concept ? ` [${concept}]` : ''}: Member wears a soft cropped fine-knit baby cardigan in ${c1} with cute ${c2} buttons over a fitted scoop-neck ${c2} baby tank, paired with high-waisted wide-leg ${c2} cargo denim jeans with subtle ${c3} stitching, and clean platform sneakers.`,
      accessories: ["Dainty wildflower choker", "Pastel beaded rings", "Cute hair barrettes"],
      vibe: `${tItem.name} dreamy girl-next-door idol allure`
    }
  ];

  const maleSilhouettes = tItem.maleSilhouettes && tItem.maleSilhouettes.length > 0 ? [...tItem.maleSilhouettes] : [];
  fallbackMale.forEach(f => {
    if (maleSilhouettes.length < 4 && !maleSilhouettes.some(m => m.title === f.title)) {
      maleSilhouettes.push(f);
    }
  });

  const femaleSilhouettes = tItem.femaleSilhouettes && tItem.femaleSilhouettes.length > 0 ? [...tItem.femaleSilhouettes] : [];
  fallbackFemale.forEach(f => {
    if (femaleSilhouettes.length < 4 && !femaleSilhouettes.some(m => m.title === f.title)) {
      femaleSilhouettes.push(f);
    }
  });

  return {
    id: tItem.id,
    name: tItem.name,
    tagline: tItem.tagline,
    description: tItem.description,
    category: tItem.category,
    curated3ColorSchemes: tItem.curated3ColorSchemes,
    palettes,
    maleSilhouettes: maleSilhouettes.length > 0 ? maleSilhouettes : fallbackMale,
    femaleSilhouettes: femaleSilhouettes.length > 0 ? femaleSilhouettes : fallbackFemale
  };
}

// Build the unified KPOP_POPULAR_FASHION_STYLES containing all curated styles
export const KPOP_POPULAR_FASHION_STYLES: PopularFashionStyle[] = [
  ...BASE_KPOP_POPULAR_FASHION_STYLES,
  ...ALL_KPOP_FASHION_STYLES
    .filter(tItem => !BASE_KPOP_POPULAR_FASHION_STYLES.some(b => b.id === tItem.id || b.name.toLowerCase() === tItem.name.toLowerCase()))
    .map(convertTaxonomyItemToStyle)
];

// Alias for backward compatibility
export const FASHION_STYLE_ARCHETYPES = KPOP_POPULAR_FASHION_STYLES;

// ============================================================================
// DYNAMIC SONG-SPECIFIC VIBRANT COLOR PALETTE ENGINE
// Analyzes what the song is actually about from the Records page:
// Title, Meaning, Description, Music Sound Prompt, Lyrics, and Genres.
// Strictly prevents defaulting to boring, repetitive colors (NO black/cream/burgundy,
// NO safe neutrals, NO generic navy/white/red).
// ============================================================================

export interface SongPaletteTheme {
  id: string;
  label: string;
  emoji: string;
  tagline: string;
  palettes: Array<{
    name: string;
    colors: [string, string, string]; // [Base, Secondary, Accent]
    displayString: string;
  }>;
}

// Anti-boring / Anti-cliché validator: detects tired combinations like black/cream/burgundy
export function isBoringColorPalette(colors?: string[] | [string, string, string]): boolean {
  if (!colors || colors.length < 3) return true;
  const joined = colors.join(' ').toLowerCase();

  // Check for tired, safe black/cream/burgundy combinations
  const hasDarkNeutral = joined.includes('black') || joined.includes('charcoal') || joined.includes('espresso') || joined.includes('slate') || joined.includes('pitch');
  const hasCream = joined.includes('cream') || joined.includes('ivory') || joined.includes('cashmere') || joined.includes('oatmeal') || joined.includes('beige');
  const hasBurgundy = joined.includes('burgundy') || joined.includes('bordeaux') || joined.includes('wine') || joined.includes('maroon');

  if (hasDarkNeutral && hasCream && hasBurgundy) return true;
  if (joined.includes('midnight navy') && joined.includes('chalk white') && joined.includes('crimson red')) return true;
  if (joined.includes('charcoal slate') && joined.includes('warm ivory') && joined.includes('burgundy')) return true;
  if (joined.includes('espresso brown') && joined.includes('cashmere ivory')) return true;
  if (joined.includes('camel beige') && joined.includes('jet black') && joined.includes('crisp white')) return true;

  // Dull all-grey/neutral combinations
  if (joined.includes('slate grey') && joined.includes('obsidian') && joined.includes('chalk white')) return true;

  return false;
}

// Curated themes catalog representing rich musical and emotional atmospheres
export function getSongPaletteThemesCatalog(): SongPaletteTheme[] {
  return [
    {
      id: "sunset_twilight",
      label: "Sunset & Twilight",
      emoji: "🌅",
      tagline: "Golden hour horizons, dusk glows, and emotional warmth",
      palettes: [
        {
          name: "Twilight Cobalt, Blazing Tangerine & Dusk Lilac",
          colors: ["Twilight Cobalt", "Blazing Tangerine", "Dusk Lilac"],
          displayString: "Twilight Cobalt, Blazing Tangerine, and Dusk Lilac"
        },
        {
          name: "Apricot Sherbet, Warm Honey Amber & Sky Magenta",
          colors: ["Apricot Sherbet", "Warm Honey Amber", "Sky Magenta"],
          displayString: "Apricot Sherbet, Warm Honey Amber, and Sky Magenta"
        },
        {
          name: "Deep Saffron, Electric Coral & Violet Evening",
          colors: ["Deep Saffron", "Electric Coral", "Violet Evening"],
          displayString: "Deep Saffron, Electric Coral, and Violet Evening"
        }
      ]
    },
    {
      id: "cosmic_astral",
      label: "Cosmic & Celestial",
      emoji: "🌌",
      tagline: "Starlight mysteries, infinite space, and ethereal dreaming",
      palettes: [
        {
          name: "Midnight Indigo, Celestial Cyan & Iridescent Starlight Violet",
          colors: ["Midnight Indigo", "Celestial Cyan", "Iridescent Starlight Violet"],
          displayString: "Midnight Indigo, Celestial Cyan, and Iridescent Starlight Violet"
        },
        {
          name: "Deep Nebula Purple, Frost White & Electric Starlight Blue",
          colors: ["Deep Nebula Purple", "Frost White", "Electric Starlight Blue"],
          displayString: "Deep Nebula Purple, Frost White, and Electric Starlight Blue"
        },
        {
          name: "Starlight Silver, Deep Cosmic Navy & Holographic Magenta",
          colors: ["Starlight Silver", "Deep Cosmic Navy", "Holographic Magenta"],
          displayString: "Starlight Silver, Deep Cosmic Navy, and Holographic Magenta"
        }
      ]
    },
    {
      id: "ocean_summer",
      label: "Ocean & Summer Breeze",
      emoji: "🌊",
      tagline: "Coastal tides, tropical vitality, and sun-drenched euphoria",
      palettes: [
        {
          name: "Shimmering Turquoise, Mango Coral & Sun-Bleached Sand",
          colors: ["Shimmering Turquoise", "Mango Coral", "Sun-Bleached Sand"],
          displayString: "Shimmering Turquoise, Mango Coral, and Sun-Bleached Sand"
        },
        {
          name: "Capri Cobalt Blue, Lemon Zest & Crisp Salt White",
          colors: ["Capri Cobalt Blue", "Lemon Zest", "Crisp Salt White"],
          displayString: "Capri Cobalt Blue, Lemon Zest, and Crisp Salt White"
        },
        {
          name: "Aquatic Seafoam, Tangerine Sunset & Pearl Shimmer",
          colors: ["Aquatic Seafoam", "Tangerine Sunset", "Pearl Shimmer"],
          displayString: "Aquatic Seafoam, Tangerine Sunset, and Pearl Shimmer"
        }
      ]
    },
    {
      id: "neon_velocity",
      label: "Neon & Cyber Velocity",
      emoji: "⚡",
      tagline: "High-BPM club energy, futuristic synths, and electric rhythm",
      palettes: [
        {
          name: "Obsidian Black, Optic White & Electric Cyber Violet",
          colors: ["Obsidian Black", "Optic White", "Electric Cyber Violet"],
          displayString: "Obsidian Black, Optic White, and Electric Cyber Violet"
        },
        {
          name: "Smoked Charcoal, Ice Platinum & Neon Cyber Lime",
          colors: ["Smoked Charcoal", "Ice Platinum", "Neon Cyber Lime"],
          displayString: "Smoked Charcoal, Ice Platinum, and Neon Cyber Lime"
        },
        {
          name: "Deep Midnight Navy, Pure Chalk White & Electric Cyan Pop",
          colors: ["Deep Midnight Navy", "Pure Chalk White", "Electric Cyan Pop"],
          displayString: "Deep Midnight Navy, Pure Chalk White, and Electric Cyan Pop"
        }
      ]
    },
    {
      id: "fire_passion",
      label: "Fire & Siren Passion",
      emoji: "🔥",
      tagline: "Blazing intensity, unstoppable danger, and fierce confidence",
      palettes: [
        {
          name: "Electric Vermilion Red, Molten Marigold & Deep Smoked Graphite",
          colors: ["Electric Vermilion Red", "Molten Marigold", "Deep Smoked Graphite"],
          displayString: "Electric Vermilion Red, Molten Marigold, and Deep Smoked Graphite"
        },
        {
          name: "Blazing Crimson, Sunburst Gold & Obsidian Onyx",
          colors: ["Blazing Crimson", "Sunburst Gold", "Obsidian Onyx"],
          displayString: "Blazing Crimson, Sunburst Gold, and Obsidian Onyx"
        },
        {
          name: "Fiery Paprika, Warm Amber & Smoky Amethyst",
          colors: ["Fiery Paprika", "Warm Amber", "Smoky Amethyst"],
          displayString: "Fiery Paprika, Warm Amber, and Smoky Amethyst"
        }
      ]
    },
    {
      id: "sweet_high_teen",
      label: "Sweet & High-Teen Pop",
      emoji: "🌸",
      tagline: "Bubblegum romance, youthful crush, and playful nostalgia",
      palettes: [
        {
          name: "Baby Blush Pink, Crisp Milk White & Soft Lilac Mist",
          colors: ["Baby Blush Pink", "Crisp Milk White", "Soft Lilac Mist"],
          displayString: "Baby Blush Pink, Crisp Milk White, and Soft Lilac Mist"
        },
        {
          name: "Bubblegum Rose, Powder Mint & Crisp Alabaster",
          colors: ["Bubblegum Rose", "Powder Mint", "Crisp Alabaster"],
          displayString: "Bubblegum Rose, Powder Mint, and Crisp Alabaster"
        },
        {
          name: "Peach Sherbet, Pastel Sky Blue & Warm Buttercream",
          colors: ["Peach Sherbet", "Pastel Sky Blue", "Warm Buttercream"],
          displayString: "Peach Sherbet, Pastel Sky Blue, and Warm Buttercream"
        }
      ]
    },
    {
      id: "luxe_regal",
      label: "Royalty & High Glamour",
      emoji: "💎",
      tagline: "Chateau opulence, imperial jewels, and runway authority",
      palettes: [
        {
          name: "Imperial Royal Amethyst, Burnished Antique Gold & Midnight Sapphire",
          colors: ["Imperial Royal Amethyst", "Burnished Antique Gold", "Midnight Sapphire"],
          displayString: "Imperial Royal Amethyst, Burnished Antique Gold, and Midnight Sapphire"
        },
        {
          name: "Emerald Jade, Champagne Shimmer & Deep Velvet Onyx",
          colors: ["Emerald Jade", "Champagne Shimmer", "Deep Velvet Onyx"],
          displayString: "Emerald Jade, Champagne Shimmer, and Deep Velvet Onyx"
        },
        {
          name: "Rich Lapis Lazuli, Rose Champagne & Gilded Platinum",
          colors: ["Rich Lapis Lazuli", "Rose Champagne", "Gilded Platinum"],
          displayString: "Rich Lapis Lazuli, Rose Champagne, and Gilded Platinum"
        }
      ]
    },
    {
      id: "retro_groove",
      label: "Retro Funk & City Pop",
      emoji: "💿",
      tagline: "Vintage 80s synths, roller disco shimmer, and groovy funk",
      palettes: [
        {
          name: "Electric Turquoise, Sunset Coral & Sunburst Ochre",
          colors: ["Electric Turquoise", "Sunset Coral", "Sunburst Ochre"],
          displayString: "Electric Turquoise, Sunset Coral, and Sunburst Ochre"
        },
        {
          name: "Groovy Teal, Pop Tangerine & Warm Toffee",
          colors: ["Groovy Teal", "Pop Tangerine", "Warm Toffee"],
          displayString: "Groovy Teal, Pop Tangerine, and Warm Toffee"
        },
        {
          name: "Caramel Toffee, Cream White & Retro Electric Cobalt",
          colors: ["Caramel Toffee", "Cream White", "Retro Electric Cobalt"],
          displayString: "Caramel Toffee, Cream White, and Retro Electric Cobalt"
        }
      ]
    },
    {
      id: "melancholy_rain",
      label: "Rain & Misty Solitude",
      emoji: "🌧️",
      tagline: "Acoustic heartbreak, nostalgic teardrops, and emotional depth",
      palettes: [
        {
          name: "Misty Periwinkle, Wet Slate Charcoal & Icy Blue Tint",
          colors: ["Misty Periwinkle", "Wet Slate Charcoal", "Icy Blue Tint"],
          displayString: "Misty Periwinkle, Wet Slate Charcoal, and Icy Blue Tint"
        },
        {
          name: "Dusty Denim Blue, Sea-Glass Green & Frosted Oyster",
          colors: ["Dusty Denim Blue", "Sea-Glass Green", "Frosted Oyster"],
          displayString: "Dusty Denim Blue, Sea-Glass Green, and Frosted Oyster"
        },
        {
          name: "Deep Wisteria Purple, Raindrop Grey & Pale Lavender Mist",
          colors: ["Deep Wisteria Purple", "Raindrop Grey", "Pale Lavender Mist"],
          displayString: "Deep Wisteria Purple, Raindrop Grey, and Pale Lavender Mist"
        }
      ]
    },
    {
      id: "rebel_punk",
      label: "Rebel Rock & Loud Energy",
      emoji: "🎸",
      tagline: "Raw garage grit, distorted guitars, and rebellious charisma",
      palettes: [
        {
          name: "Washed Charcoal Black, Crisp Bleach White & Electric Crimson Red",
          colors: ["Washed Charcoal Black", "Crisp Bleach White", "Electric Crimson Red"],
          displayString: "Washed Charcoal Black, Crisp Bleach White, and Electric Crimson Red"
        },
        {
          name: "Inky Midnight Indigo, Smoky Heather Grey & Distressed Acid Yellow",
          colors: ["Inky Midnight Indigo", "Smoky Heather Grey", "Distressed Acid Yellow"],
          displayString: "Inky Midnight Indigo, Smoky Heather Grey, and Distressed Acid Yellow"
        },
        {
          name: "Matte Pitch Black, Steel Grey & Blazing Signal Orange",
          colors: ["Matte Pitch Black", "Steel Grey", "Blazing Signal Orange"],
          displayString: "Matte Pitch Black, Steel Grey, and Blazing Signal Orange"
        }
      ]
    },
    {
      id: "spring_bloom",
      label: "Spring Bloom & Botanical",
      emoji: "🌿",
      tagline: "Sakura petals, fresh verdant greens, and botanical renewal",
      palettes: [
        {
          name: "Sakura Blossom Pink, Matcha Green & Dewdrop Opal",
          colors: ["Sakura Blossom Pink", "Matcha Green", "Dewdrop Opal"],
          displayString: "Sakura Blossom Pink, Matcha Green, and Dewdrop Opal"
        },
        {
          name: "Lush Moss Emerald, Marigold Ochre & Crisp Birch White",
          colors: ["Lush Moss Emerald", "Marigold Ochre", "Crisp Birch White"],
          displayString: "Lush Moss Emerald, Marigold Ochre, and Crisp Birch White"
        },
        {
          name: "Spun Pistachio Green, Terracotta Coral & Pale Sun Gold",
          colors: ["Spun Pistachio Green", "Terracotta Coral", "Pale Sun Gold"],
          displayString: "Spun Pistachio Green, Terracotta Coral, and Pale Sun Gold"
        }
      ]
    },
    {
      id: "mystery_noir",
      label: "Eclipse & Midnight Mystery",
      emoji: "🌙",
      tagline: "Shadow illusions, enigmatic whispers, and phantom aesthetics",
      palettes: [
        {
          name: "Phantom Violet, Smoked Gunmetal & Neon Acid Lilac",
          colors: ["Phantom Violet", "Smoked Gunmetal", "Neon Acid Lilac"],
          displayString: "Phantom Violet, Smoked Gunmetal, and Neon Acid Lilac"
        },
        {
          name: "Deep Eclipse Teal, Obsidian Black & Molten Chrome",
          colors: ["Deep Eclipse Teal", "Obsidian Black", "Molten Chrome"],
          displayString: "Deep Eclipse Teal, Obsidian Black, and Molten Chrome"
        },
        {
          name: "Midnight Plum, Iridescent Beetle Green & Liquid Silver",
          colors: ["Midnight Plum", "Iridescent Beetle Green", "Liquid Silver"],
          displayString: "Midnight Plum, Iridescent Beetle Green, and Liquid Silver"
        }
      ]
    }
  ];
}

// Deep semantic analyzer that extracts color intelligence from the Track on the Records page:
export function deriveVibrantSongSpecific3ColorPalette(
  track: Track,
  _fashionStyleIdOrName?: string,
  seed: number = 0
): [string, string, string] {
  if (!track) {
    return ["Twilight Cobalt", "Blazing Tangerine", "Dusk Lilac"];
  }

  // 1. Gather all textual records data
  const title = (track.title || '').trim().toLowerCase();
  const meaning = (track.meaning || '').trim().toLowerCase();
  const description = (track.description || '').trim().toLowerCase();
  const soundPrompt = (track.musicStylePrompt || '').trim().toLowerCase();
  const lyricExcerpt = (track.lyricExcerpt || '').trim().toLowerCase();
  const fullLyrics = (track.fullLyrics || '').trim().toLowerCase();
  const fullLyricsEnglish = (track.fullLyricsEnglish || '').trim().toLowerCase();
  const genre = (track.genre || '').trim().toLowerCase();
  const genres = (track.genres || []).join(' ').toLowerCase();

  const fullCorpus = `${title} ${meaning} ${description} ${soundPrompt} ${lyricExcerpt} ${fullLyrics} ${fullLyricsEnglish} ${genre} ${genres}`;

  // 2. Direct color motif checks in title or lyrics (e.g. "Cherry", "Violet", "Gold", "Ocean")
  if (title.includes('cherry') || title.includes('ruby') || fullCorpus.includes('scarlet')) {
    return ["Matte Pitch Black", "Smoked Charcoal", "Electric Vermilion Red"];
  }
  if (title.includes('violet') || title.includes('purple') || title.includes('lavender') || title.includes('lilac') || fullCorpus.includes('amethyst')) {
    return ["Midnight Indigo", "Celestial Slate", "Iridescent Starlight Violet"];
  }
  if (title.includes('gold') || title.includes('solar') || title.includes('sunburst') || fullCorpus.includes('golden hour')) {
    return ["Obsidian Onyx", "Alabaster Cream", "Sunburst Gold"];
  }
  if (title.includes('blue') || title.includes('ocean') || title.includes('cyan') || title.includes('wave') || title.includes('sea')) {
    return ["Deep Capri Navy", "Crisp Salt White", "Vibrant Cyan Pop"];
  }
  if (title.includes('pink') || title.includes('candy') || title.includes('bubblegum') || title.includes('rose')) {
    return ["Baby Blush Pink", "Crisp Milk White", "Soft Lilac Mist"];
  }
  if (title.includes('emerald') || title.includes('green') || title.includes('mint') || title.includes('jade')) {
    return ["Deep Velvet Onyx", "Champagne Shimmer", "Emerald Jade"];
  }
  if (title.includes('neon') || title.includes('acid') || title.includes('laser') || title.includes('cyber')) {
    return ["Obsidian Black", "Optic White", "Electric Cyber Violet"];
  }

  // 3. Keyword Scoring across the thematic clusters
  const themeScores: Record<string, number> = {
    sunset_twilight: 0,
    cosmic_astral: 0,
    ocean_summer: 0,
    neon_velocity: 0,
    fire_passion: 0,
    sweet_high_teen: 0,
    luxe_regal: 0,
    retro_groove: 0,
    melancholy_rain: 0,
    rebel_punk: 0,
    spring_bloom: 0,
    mystery_noir: 0
  };

  const scoreCluster = (themeId: string, keywords: string[], weight: number = 1) => {
    for (const kw of keywords) {
      if (title.includes(kw)) themeScores[themeId] += 5 * weight;
      if (meaning.includes(kw)) themeScores[themeId] += 3 * weight;
      if (description.includes(kw)) themeScores[themeId] += 2 * weight;
      if (soundPrompt.includes(kw)) themeScores[themeId] += 2 * weight;
      if (fullCorpus.includes(kw)) themeScores[themeId] += 1 * weight;
    }
  };

  // Score each cluster
  scoreCluster('sunset_twilight', ['sunset', 'twilight', 'dusk', 'dawn', 'golden hour', 'horizon', 'evening', 'sundown', 'afterglow', 'orange sky', 'warmth']);
  scoreCluster('cosmic_astral', ['star', 'cosmic', 'galaxy', 'celestial', 'astral', 'space', 'universe', 'planet', 'supernova', 'orbit', 'meteor', 'starlight', 'infinite', 'dream']);
  scoreCluster('ocean_summer', ['summer', 'ocean', 'beach', 'wave', 'tropical', 'sea', 'breeze', 'island', 'sunshine', 'resort', 'sand', 'coastal', 'pool', 'holiday', 'surf']);
  scoreCluster('neon_velocity', ['neon', 'club', 'rave', 'speed', 'velocity', 'synthwave', 'electro', 'bass', 'drop', 'dance', 'glitch', 'cyber', 'laser', 'bpm', 'techno', 'circuit', 'hyperpop', 'electronic']);
  scoreCluster('fire_passion', ['fire', 'flame', 'burn', 'heat', 'ignite', 'blaze', 'inferno', 'fever', 'danger', 'wild', 'hot', 'siren', 'passion', 'flare', 'toxic', 'venom', 'fury', 'intense']);
  scoreCluster('sweet_high_teen', ['love', 'crush', 'sweet', 'cute', 'confession', 'heart', 'candy', 'romantic', 'school', 'teen', 'first love', 'blush', 'darling', 'honey', 'sugar', 'angel', 'cupid', 'pop']);
  scoreCluster('luxe_regal', ['luxury', 'royalty', 'queen', 'king', 'crown', 'diamond', 'palace', 'chateau', 'haute', 'runway', 'velvet', 'gem', 'jewel', 'empress', 'monarch', 'gilded', 'glamour', 'prestige']);
  scoreCluster('retro_groove', ['disco', 'funk', 'city pop', 'retro', 'groovy', '80s', '70s', 'motown', 'vinyl', 'roller', 'boogie', 'vintage synth', 'brass', 'r&b']);
  scoreCluster('melancholy_rain', ['rain', 'tears', 'cry', 'goodbye', 'sad', 'lonely', 'heartbreak', 'sorrow', 'melancholy', 'acoustic', 'ballad', 'slow', 'piano', 'memory', 'miss you', 'nostalgia', 'autumn', 'grey']);
  scoreCluster('rebel_punk', ['rock', 'punk', 'guitar', 'distortion', 'grunge', 'riot', 'shout', 'scream', 'rebel', 'anarchy', 'crash', 'metal', 'garage', 'loud', 'bassline', 'band']);
  scoreCluster('spring_bloom', ['flower', 'bloom', 'spring', 'blossom', 'sakura', 'garden', 'botanical', 'leaf', 'forest', 'green', 'nature', 'earth', 'petal', 'flora', 'fresh']);
  scoreCluster('mystery_noir', ['mystery', 'noir', 'secret', 'shadow', 'eclipse', 'night', 'phantom', 'whisper', 'dark', 'moon', 'midnight', 'hidden', 'illusion', 'veil', 'enigma']);

  // Find the highest scoring theme
  let bestThemeId = 'sunset_twilight';
  let highestScore = -1;

  for (const [tId, score] of Object.entries(themeScores)) {
    if (score > highestScore) {
      highestScore = score;
      bestThemeId = tId;
    }
  }

  // If score is 0 or low, use a deterministic title hash to pick a distinctive vibrant theme
  if (highestScore <= 0) {
    const catalog = getSongPaletteThemesCatalog();
    const hash = (track.title || 'kpop').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const chosenTheme = catalog[(hash + Math.abs(seed)) % catalog.length];
    const chosenPalette = chosenTheme.palettes[Math.abs(seed) % chosenTheme.palettes.length];
    return chosenPalette.colors;
  }

  const catalog = getSongPaletteThemesCatalog();
  const themeObj = catalog.find(c => c.id === bestThemeId) || catalog[0];
  const paletteIdx = Math.abs(seed) % themeObj.palettes.length;
  const selected = themeObj.palettes[paletteIdx] || themeObj.palettes[0];

  // Anti-boring safety check
  if (isBoringColorPalette(selected.colors)) {
    return ["Twilight Cobalt", "Blazing Tangerine", "Dusk Lilac"];
  }

  return selected.colors;
}

// Dynamically constructs 4 diverse, non-boring color options based on song metadata (title, lyrics, meaning, genre)
export function generateDynamicSongColorOptions(
  track: Track,
  _targetFashionStyle?: string
): AiSongColorOption[] {
  const title = (track?.title || 'Title').trim();
  const meaning = (track?.meaning || track?.description || 'K-Pop Comeback').trim();
  const genre = (track?.genre || 'K-Pop').trim();

  // Color collections with rich, high-fashion names derived from song semantic analysis
  const narrativeCol = deriveVibrantSongSpecific3ColorPalette(track, undefined, 1);
  const sonicCol = deriveVibrantSongSpecific3ColorPalette(track, undefined, 4);
  const stageCol = deriveVibrantSongSpecific3ColorPalette(track, undefined, 7);
  const avantGardeCol = deriveVibrantSongSpecific3ColorPalette(track, undefined, 11);

  return [
    {
      id: "narrative_metaphor",
      title: `${narrativeCol[0]} & ${narrativeCol[2]} Narrative`,
      rationale: `Directly derived from "${title}"'s narrative concept (${meaning.slice(0, 80)}...). Grounded in ${narrativeCol[0]} with striking ${narrativeCol[2]} accents to capture the song's story.`,
      colors: narrativeCol,
      vibe: "Lyrical narrative stage presence"
    },
    {
      id: "sonic_mood",
      title: `${sonicCol[0]} & ${sonicCol[1]} Sonic Vibe`,
      rationale: `Interprets the sonic frequency and production vibe of ${genre} in "${title}". Balanced between foundational ${sonicCol[0]} and harmonious ${sonicCol[1]} with electric ${sonicCol[2]} highlights.`,
      colors: sonicCol,
      vibe: "Dynamic musical atmosphere"
    },
    {
      id: "stage_contrast",
      title: `${stageCol[0]} & ${stageCol[2]} Bold Contrast`,
      rationale: `High-impact comeback stage presence designed to command broadcast cameras and stadium concert lighting with vivid, unmistakable contrast.`,
      colors: stageCol,
      vibe: "High-contrast charismatic pop"
    },
    {
      id: "avant_garde",
      title: `${avantGardeCol[0]} & ${avantGardeCol[1]} Editorial Vision`,
      rationale: `Bespoke high-fashion editorial interpretation blending ${avantGardeCol[0]} and ${avantGardeCol[1]} with an unexpected ${avantGardeCol[2]} signature flair tailored to "${title}".`,
      colors: avantGardeCol,
      vibe: "Editorial haute couture edge"
    }
  ];
}

// Calls Gemini AI to analyze the song's meaning, title, description, and lyrics from the Records page,
// and generate 4 distinct bespoke 3-color palette options on its own with zero stock presets.
export async function generateAiSongColorPaletteOptions(
  track: Track,
  groupProfile: GroupProfileData,
  targetFashionStyle?: string
): Promise<AiSongColorOption[]> {
  const prompt = `You are an elite Seoul K-pop Chief Fashion Director & Stage Stylist.
Analyze this specific track from the group's Records page:
- Song Title: "${track.title}"
- Album Role: ${track.role}
- Musical Genre: ${track.genre} (${track.genres?.join(', ') || 'K-Pop'})
- Song Narrative & Meaning from Records: "${track.meaning || track.description || 'K-pop comeback'}"
- Song Description: "${track.description || ''}"
- Sound & Style: "${track.musicStylePrompt || ''}"
- Lyrical Themes: "${track.fullLyricsEnglish?.slice(0, 400) || track.lyricExcerpt || ''}"
- Group: "${groupProfile.groupName}" (${groupProfile.conceptDescription || 'K-pop'})
- Target Fashion Style: "${targetFashionStyle || 'K-Pop Stage Wardrobe'}"

YOUR MISSION:
Invent 4 COMPLETELY DISTINCT, BESPOKE 3-COLOR PALETTES for this song's outfits on your own.
DO NOT use generic presets or stock themes. You must derive each palette genuinely from what this song is about on the Records page.

STRICT ANTI-BORING COLOR RULES:
1. NEVER return boring, safe, or repetitive colors (ABSOLUTELY NO black/cream/burgundy, NO safe black/white, NO all-grey dull neutrals).
2. Each palette must have exactly 3 colors: [Base Tone (60%), Secondary Tone (25-30%), Accent Pop (10-15%)].
3. Use high-fashion, evocative color names (e.g. 'Twilight Cobalt Blue', 'Acid Lime', 'Blazing Tangerine', 'Icy Periwinkle', 'Smoked Amethyst', 'Deep Forest Emerald', 'Electric Vermilion', 'Solar Amber', 'Capri Blue', 'Lilac Mist', 'Molten Marigold', 'Obsidian Plum').
4. The 4 options MUST be distinct from each other:
   - Option 1: Direct Lyrical & Narrative Metaphor Palette
   - Option 2: Sonic Production & Emotional Atmosphere Palette
   - Option 3: High-Contrast Stage Charisma Palette
   - Option 4: Avant-Garde Editorial Fashion Palette
5. Provide a 1-2 sentence rationale for each option explaining EXACTLY how these colors reflect "${track.title}" and its meaning/lyrics from the Records page.

STRICT JSON OUTPUT FORMAT:
{
  "options": [
    {
      "id": "narrative",
      "title": "Evocative Title (e.g. Electric Twilight & Solar Tangerine)",
      "rationale": "Directly references the song meaning and lyrics...",
      "colors": ["Base Color Name", "Secondary Color Name", "Accent Pop Color Name"],
      "vibe": "Brief stage attitude"
    }
  ]
}
CRITICAL JSON RULE: You MUST return strictly valid JSON.`;

  try {
    const { data } = await generateKpopGroupData<{ options: AiSongColorOption[] }>(prompt);
    if (data && Array.isArray(data.options) && data.options.length > 0) {
      const valid = data.options.filter(opt =>
        opt.colors && Array.isArray(opt.colors) && opt.colors.length === 3 && !isBoringColorPalette(opt.colors)
      ).map((opt, idx) => ({
        ...opt,
        id: opt.id || `ai_palette_${idx + 1}`
      }));

      if (valid.length > 0) {
        return valid;
      }
    }
  } catch (err) {
    console.warn("AI song palette generation failed, falling back to dynamic derivation:", err);
  }

  return generateDynamicSongColorOptions(track, targetFashionStyle);
}

// Helper to generate dynamic, fresh, high-fashion member concept outfits using the K-pop Formula:
// "Main Style + Secondary Style + Concept"
// STRICTLY ENFORCES UNIFIED CAPSULE COHESION ACROSS ALL MEMBERS (INCLUDING CO-ED GROUPS)
// AND PRESERVES EACH MEMBER'S FACE AND SIGNATURE HAIRSTYLE FROM LINEUP PROFILE
export function generateDynamicMemberOutfits(
  track: Track,
  songColorPalette?: string,
  members: MemberProfileData[] = [],
  variationSeed: number = Date.now(),
  customGuidance?: string,
  explicitFashionStyleId?: string,
  explicit3ColorPalette?: [string, string, string] | string[],
  explicitSecondaryStyle?: string,
  explicitConcept?: string
): MemberConceptOutfit[] {
  // 1. Pick Main Fashion Style (Defaults to Casual idol style unless specified)
  // ALL members strictly share this identical main fashion style to eliminate any mismatched looks!
  let style: PopularFashionStyle | undefined;
  if (explicitFashionStyleId) {
    style = KPOP_POPULAR_FASHION_STYLES.find(
      s => s.id === explicitFashionStyleId || s.name.toLowerCase() === explicitFashionStyleId.toLowerCase()
    );
  }
  if (!style) {
    // Default to fresh, youthful K-Pop idol Casual style
    style = KPOP_POPULAR_FASHION_STYLES.find(s => s.id === 'casual') || KPOP_POPULAR_FASHION_STYLES[0];
  }

  // Determine group gender context
  const hasMale = members.some(m => (m.gender || '').toLowerCase() === 'male');
  const hasFemale = members.some(m => (m.gender || '').toLowerCase() === 'female');
  const groupTarget: 'all' | 'boy_group' | 'girl_group' = (hasMale && !hasFemale) ? 'boy_group' : (!hasMale && hasFemale ? 'girl_group' : 'all');

  // 2. Pick Secondary Style & Concept for the K-pop Outfit Formula:
  // "Main Style + Secondary Style + Concept"
  let secondaryStyleName = explicitSecondaryStyle;
  let conceptName = explicitConcept;

  if (!secondaryStyleName || !conceptName) {
    // Check if there is an iconic style mix preset matching this main style
    const matchingPreset = KPOP_STYLE_MIX_PRESETS.find(p => 
      (p.mainStyle.toLowerCase() === style!.name.toLowerCase() || style!.name.toLowerCase().includes(p.mainStyle.toLowerCase())) &&
      (p.targetGroup === 'all' || p.targetGroup === groupTarget)
    ) || KPOP_STYLE_MIX_PRESETS.find(p => p.mainStyle.toLowerCase() === style!.name.toLowerCase());

    if (matchingPreset) {
      if (!secondaryStyleName) secondaryStyleName = matchingPreset.secondaryStyle;
      if (!conceptName) conceptName = matchingPreset.concept;
    }
  }

  // Fallback secondary style if still unspecified
  if (!secondaryStyleName) {
    if (style.name.toLowerCase().includes('streetwear')) {
      secondaryStyleName = 'High Fashion / Editorial';
    } else if (style.name.toLowerCase().includes('preppy')) {
      secondaryStyleName = groupTarget === 'boy_group' ? 'Punk / Rebel' : 'Y2K';
    } else if (style.name.toLowerCase().includes('sporty')) {
      secondaryStyleName = 'Streetwear';
    } else if (style.name.toLowerCase().includes('romantic')) {
      secondaryStyleName = 'Dark / Gothic';
    } else {
      secondaryStyleName = 'Editorial High-Fashion';
    }
  }

  // Fallback concept lens if still unspecified
  if (!conceptName) {
    if (groupTarget === 'boy_group') {
      conceptName = 'Bad Boy';
    } else if (groupTarget === 'girl_group') {
      conceptName = 'Girl Crush';
    } else {
      conceptName = 'Confident / Swagger';
    }
  }

  const stylingFormula = buildKpopOutfitFormula(style.name, secondaryStyleName, conceptName);

  // 3. Pick 3-Color Scheme (Base, Secondary, Accent)
  // Strictly checks for vibrant, song-specific palettes and avoids boring black/cream/burgundy combos
  let colors: [string, string, string];
  if (explicit3ColorPalette && explicit3ColorPalette.length === 3 && !isBoringColorPalette(explicit3ColorPalette)) {
    colors = [explicit3ColorPalette[0], explicit3ColorPalette[1], explicit3ColorPalette[2]];
  } else {
    // Deep semantic derivation from what the song is about on the Records page
    colors = deriveVibrantSongSpecific3ColorPalette(track, style.name, variationSeed);
  }
  const [c1, c2, c3] = colors;
  const threeColorStr = `${c1}, ${c2}, and ${c3}`;

// Curated pool of stylish, youthful bottom pieces to substitute whenever a bottom type is already taken
const DIVERSE_BOTTOM_POOLS = {
  female: [
    { type: 'pleated_skort', title: 'Pleated Suiting Skort', desc: (c: string, n: string) => `high-waisted knife-pleated suiting mini-skort in ${n} featuring a trompe-l'œil double waistband and an integrated leather belt with a polished silver double-grommet buckle` },
    { type: 'fluid_slacks', title: 'Fluid Split-Hem Trousers', desc: (c: string, n: string) => `high-waisted fluid wide-leg double-pleated tailored trousers in ${n} featuring sharp front pressed creases and side-slit split hems with silver snap buttons` },
    { type: 'cargo_pants', title: 'Baggy Cargo Skater Pants', desc: (c: string, n: string) => `low-rise relaxed baggy cargo skater pants in ${n} with side 3D utility cargo pockets, silver D-rings, and a double-prong silver buckle belt` },
    { type: 'wrap_skirt', title: 'Asymmetric Wrap Kilt-Skort', desc: (c: string, n: string) => `A-line asymmetric wrap kilt-skort in ${n} featuring double leather buckle strap closures, knife pleats, and split hem with contrast lining` },
    { type: 'puddle_denim', title: 'Baggy Skater Puddle Jeans', desc: (c: string, n: string) => `low-slung wide-leg baggy skater puddle jeans in vintage washed ${n} with distressed panel stitching and a double-prong silver grommet belt` },
    { type: 'bermuda_shorts', title: 'Tailored Bermuda City Shorts', desc: (c: string, n: string) => `tailored knee-length pleated Bermuda city shorts in structured ${n} twill featuring sharp front pressed creases and a wide leather belt with double silver O-rings` },
    { type: 'denim_jorts', title: 'Raw-Hem Denim Jorts', desc: (c: string, n: string) => `slouchy wide-leg raw-hem denim jorts in washed ${n} falling just above the knee, styled with a silver wallet chain and double-grommet belt` },
    { type: 'track_pants', title: 'Parachute Track Pants', desc: (c: string, n: string) => `lightweight nylon parachute track pants in ${n} with bellows cargo pockets, silver D-rings, and adjustable bungee drawstring cinch hems` },
    { type: 'denim_skirt', title: 'Distressed Denim Mini-Skirt', desc: (c: string, n: string) => `distressed low-rise denim mini-skirt in washed ${n} with raw frayed hem, side pockets with decorative safety-pin brooches, and silver buckle belt` },
    { type: 'pintuck_trousers', title: 'Pintuck Wide Trousers', desc: (c: string, n: string) => `relaxed wide-leg trousers in ${n} with tailored front pintuck crease seams, a foldover waistband, and metallic drawstring toggles` },
    { type: 'flared_slacks', title: 'Flared Stage Slacks', desc: (c: string, n: string) => `high-waisted low-slung flared tailored slacks in ${n} featuring front pressed creases, inner leg split hems with silver snaps, and a polished belt` },
    { type: 'foldover_trousers', title: 'Foldover Puddle Trousers', desc: (c: string, n: string) => `fluid wide-leg puddle trousers in ${n} featuring a fold-over contrast waistband, front knife pleats, and a delicate silver chain draped across the side seam` },
    { type: 'carpenter_pants', title: 'Canvas Carpenter Skate Pants', desc: (c: string, n: string) => `relaxed wide-leg canvas carpenter skate pants in ${n} with reinforced double-knee utility patches, hammer loop, and a silver clip buckle belt` }
  ],
  male: [
    { type: 'puddle_denim', title: 'Baggy Skater Puddle Denim', desc: (c: string, n: string) => `relaxed wide-leg skater puddle jeans in vintage washed ${n} with a sturdy leather belt and polished silver double-grommet buckle` },
    { type: 'fluid_slacks', title: 'Fluid Double-Pleated Trousers', desc: (c: string, n: string) => `fluid wide-leg double-pleated tailored trousers in ${n} featuring sharp front pressed creases, split side hems with silver snap buttons, and a sleek leather belt` },
    { type: 'cargo_pants', title: '3D Utility Cargo Skate Pants', desc: (c: string, n: string) => `relaxed wide-leg baggy cargo skate pants in ${n} featuring 3D flap pockets with silver D-rings and a double-prong belt` },
    { type: 'denim_jorts', title: 'Raw-Hem Denim Jorts with Chain', desc: (c: string, n: string) => `relaxed wide-leg raw-hem denim jorts in washed ${n} falling below the knee with a hanging silver key-clip wallet chain and sturdy leather belt` },
    { type: 'bermuda_shorts', title: 'Tailored Pleated Bermuda Shorts', desc: (c: string, n: string) => `tailored knee-length pleated Bermuda shorts in structured ${n} twill with sharp front pressed creases, a double-ring leather belt, and clean cuffed hems` },
    { type: 'track_pants', title: 'Parachute Track Pants with Bungee', desc: (c: string, n: string) => `lightweight nylon parachute track pants in ${n} with contrast side piping, silver D-rings, and adjustable bungee toggle hems` },
    { type: 'carpenter_pants', title: 'Canvas Carpenter Skate Pants', desc: (c: string, n: string) => `relaxed wide-leg canvas carpenter skate pants in ${n} with utility hammer-loop detailing, reinforced knee panels, and a silver grommet belt` },
    { type: 'corduroy_slacks', title: 'Wide-Leg Corduroy Skater Slacks', desc: (c: string, n: string) => `relaxed wide-leg wale corduroy skater slacks in ${n} with a clean leather belt, silver wallet chain, and soft fluid drape` },
    { type: 'pintuck_trousers', title: 'Pintuck Wide Lounge Trousers', desc: (c: string, n: string) => `relaxed wide-leg trousers in ${n} with tailored front pintuck creases, an adjustable bungee drawstring waistband with metallic toggles, and subtle contrast piping` },
    { type: 'chinos', title: 'Double-Pleat Wide Chino Trousers', desc: (c: string, n: string) => `relaxed double-pleated wide-leg chino trousers in ${n} with sharp pressed creases and a sturdy leather belt with silver buckle` },
    { type: 'flared_slacks', title: 'Flared Slacks with Split Hems', desc: (c: string, n: string) => `relaxed flared tailored trousers in ${n} with split side hems featuring silver snap buttons and a polished leather belt with silver buckle` },
    { type: 'kilt_slacks', title: 'Asymmetric Kilt-Over-Slacks', desc: (c: string, n: string) => `tailored suiting asymmetric pleated wrap kilt layered over slim fluid trousers in ${n} with silver buckle cinch straps and a hanging chain link` },
    { type: 'foldover_trousers', title: 'Foldover-Waistband Puddle Trousers', desc: (c: string, n: string) => `fluid wide-leg puddle trousers in ${n} featuring a foldover contrast waistband, front pleats, and clean fluid drape` }
  ]
};

// Curated pool of stylish, youthful top pieces to substitute whenever a top type is already taken
const DIVERSE_TOP_POOLS = {
  female: [
    { type: 'blazer', title: 'Cropped Deconstructed Suiting Blazer', desc: (c: string, n: string) => `cropped boxy deconstructed suiting blazer in ${c} with asymmetric notched lapels, polished silver buttons, and raw waist hem` },
    { type: 'trench_blouson', title: 'Cropped Gabardine Trench Blouson', desc: (c: string, n: string) => `cropped gabardine trench blouson in ${c} with storm flap, gunmetal D-ring sleeve straps, and convertible collar` },
    { type: 'waistcoat', title: 'Tailored Pinstripe Suiting Waistcoat', desc: (c: string, n: string) => `tailored pinstripe suiting waistcoat vest in ${c} with asymmetric hem, silver shank buttons, and corset lace-up back` },
    { type: 'bomber', title: 'Cropped Satin Varsity Bomber', desc: (c: string, n: string) => `cropped satin-twill varsity bomber jacket in ${c} with striped collegiate ribbed trims and silver industrial zipper` },
    { type: 'moto_jacket', title: 'Cropped Moto Racing Blouson', desc: (c: string, n: string) => `cropped moto racing jacket in ${c} with stand-up snap collar, contrast sleeve piping, and asymmetric zipper pull` },
    { type: 'cardigan', title: 'Brushed Mohair Drop-Shoulder Cardigan', desc: (c: string, n: string) => `slouchy drop-shoulder brushed open-knit mohair cardigan in ${c} with contrast ribbed edging and polished horn buttons` },
    { type: 'denim_trucker', title: 'Boxy Cropped Denim Trucker', desc: (c: string, n: string) => `boxy cropped vintage denim trucker jacket in ${c} with silver donut buttons and raw split cuffs` },
    { type: 'windbreaker', title: 'Technical Track Windbreaker', desc: (c: string, n: string) => `lightweight technical windbreaker in ${c} with metallic silver piping, stand collar, and two-way ring-pull zipper` },
    { type: 'hoodie', title: 'Cropped Heavyweight Zip Hoodie', desc: (c: string, n: string) => `cropped heavyweight French terry two-way zip hoodie in ${c} with raw-edge split hem and metal cord aglets` },
    { type: 'poplin_shirt', title: 'Deconstructed Cotton-Poplin Shirt', desc: (c: string, n: string) => `deconstructed poplin button-down shirt in ${c} with extended French cuffs, silver eyelet ties, and asymmetric hem` },
    { type: 'polo', title: 'Cropped Rugby Polo with Crest', desc: (c: string, n: string) => `contrast-collar rugby crop polo in ${c} with concealed snap placket, dropped shoulders, and embroidered crest` },
    { type: 'waffle_top', title: 'Snap-Collar Waffle Henley', desc: (c: string, n: string) => `fitted long-sleeve waffle henley top in ${c} with silver snap buttons and contrast micro-overlock stitching` },
    { type: 'cutout_top', title: 'Asymmetric Shoulder-Cutout Top', desc: (c: string, n: string) => `asymmetric shoulder-cutout fine ribbed knit top in ${c} with thumbhole cuffs and lettuce edges` },
    { type: 'tank_corset', title: 'Structured Square-Neck Corset Top', desc: (c: string, n: string) => `structured square-neck ribbed corset baby top in ${c} with boning details and contrast piped seams` },
    { type: 'knit_vest', title: 'Deconstructed Cable Knit Vest', desc: (c: string, n: string) => `deconstructed cable-knit vest in ${c} with side slit openings and safety-pin chain brooch` },
    { type: 'jersey', title: 'Athletic Mesh Hockey Jersey', desc: (c: string, n: string) => `oversized athletic mesh hockey jersey in ${c} with bold sleeve striping and ribbed V-neck` }
  ],
  male: [
    { type: 'blazer', title: 'Cropped Boxy Suiting Blazer', desc: (c: string, n: string) => `cropped boxy deconstructed suiting blazer in ${c} with dropped shoulders, raw-edge waistline, and polished silver buttons` },
    { type: 'trench_blouson', title: 'Boxy Gabardine Trench Blouson', desc: (c: string, n: string) => `boxy cropped gabardine trench blouson in ${c} with storm flap, D-ring sleeve cinch straps, and convertible collar` },
    { type: 'waistcoat', title: 'Asymmetric Tailored Suiting Waistcoat', desc: (c: string, n: string) => `asymmetric tailored suiting waistcoat in ${c} with contrast back cinch buckle, sharp angular points, and silver shank buttons` },
    { type: 'bomber', title: 'Varsity Bomber Jacket with Crest', desc: (c: string, n: string) => `satin-twill varsity bomber jacket in ${c} with striped collegiate ribbing, silver industrial zipper, and chest emblem` },
    { type: 'moto_jacket', title: 'Boxy Moto Biker Jacket', desc: (c: string, n: string) => `boxy moto biker jacket in ${c} with asymmetric silver two-way zipper, snap lapels, and contrast piping` },
    { type: 'denim_trucker', title: 'Boxy Drop-Shoulder Denim Trucker', desc: (c: string, n: string) => `boxy drop-shoulder denim trucker jacket in ${c} with silver donut buttons, chest flap pockets, and contrast stitching` },
    { type: 'cardigan', title: 'Oversized Brushed Mohair Cardigan', desc: (c: string, n: string) => `relaxed oversized brushed mohair cardigan in ${c} with dropped shoulders, deep V-neck, and tonal buttons` },
    { type: 'windbreaker', title: 'Retro Track Windbreaker Jacket', desc: (c: string, n: string) => `retro nylon track windbreaker jacket in ${c} with silver piping, stand collar, and elasticated toggle hem` },
    { type: 'hoodie', title: 'Heavyweight Two-Way Zip Hoodie', desc: (c: string, n: string) => `oversized heavyweight French terry two-way zip hoodie in ${c} with dropped shoulders and silver industrial zipper` },
    { type: 'poplin_shirt', title: 'Boxy Cotton-Poplin Button-Down', desc: (c: string, n: string) => `oversized boxy cotton-poplin button-down shirt in ${c} with dropped shoulders, chest patch pocket, and silver cuff snaps` },
    { type: 'polo', title: 'Collegiate Rugby Polo', desc: (c: string, n: string) => `heavyweight collegiate rugby polo in ${c} with contrast twill collar, rubber buttons, and side vents` },
    { type: 'overshirt', title: 'Camp-Collar Bowling Overshirt', desc: (c: string, n: string) => `boxy camp-collar bowling overshirt in ${c} with contrast piped lapels, silver snap buttons, and chest pocket` },
    { type: 'sweatshirt', title: 'Heavyweight Collegiate Crewneck', desc: (c: string, n: string) => `relaxed heavyweight crewneck sweatshirt in ${c} with dropped shoulders, ribbed triangle V-insert, and tonal micro-embroidery` },
    { type: 'waffle_top', title: 'Snap-Placket Thermal Waffle Henley', desc: (c: string, n: string) => `long-sleeve waffle thermal henley in ${c} with metal snap placket and contrast flatlock stitching` },
    { type: 'knit_vest', title: 'Oversized Cable Knit V-Neck Vest', desc: (c: string, n: string) => `oversized V-neck cable knit sweater vest in ${c} with collegiate tipping and relaxed dropped armholes` },
    { type: 'jersey', title: 'Athletic Mesh Performance Jersey', desc: (c: string, n: string) => `oversized athletic mesh performance jersey in ${c} with contrast sleeve stripes and ribbed collar` }
  ]
};

  let maleCounter = 0;
  let femaleCounter = 0;

  // STRICT ANTI-REPETITION ENGINE: Track top and bottom types group-wide so no two members ever share the same silhouettes!
  const usedTopTypes = new Set<string>();
  const usedBottomTypes = new Set<string>();
  const usedSilhouetteIndicesByGender: { male: number[]; female: number[] } = { male: [], female: [] };

  return members.map((member, idx) => {
    const isMale = (member.gender || '').toLowerCase() === 'male';
    const genderKey = isMale ? 'male' : 'female';
    const genderIndex = isMale ? maleCounter++ : femaleCounter++;

    // STRICT IDENTITY MANDATE: PRESERVE EXACT FACE AND HAIRSTYLE FROM LINEUP PROFILE!
    const preservedHairStyle = member.currentHairStyle || member.originalHairType || 'Signature hairstyle from Lineup profile';
    const preservedHairColor = member.dyedHairColor || member.originalHairColor || 'Natural hair color from Lineup profile';

    // COLOR HARMONIZATION PER MEMBER (CAPSULE COLLECTION):
    let memberC1 = c1;
    let memberC2 = c2;
    let memberC3 = c3;
    if (genderIndex % 2 === 1) {
      // Rotate primary and secondary tones so the second guy or girl wears distinct garment colors!
      memberC1 = c2;
      memberC2 = c1;
    }

    const silhouettes = isMale ? style!.maleSilhouettes : style!.femaleSilhouettes;

    // Pick silhouette: Evaluate every candidate silhouette against already-used top and bottom garment types
    let bestIdx = 0;
    let bestScore = 9999;
    let bestDetected = { topType: '', bottomType: '' };

    for (let i = 0; i < silhouettes.length; i++) {
      const cand = silhouettes[i];
      const candDesc = cand.buildDescription(memberC1, memberC2, memberC3, conceptName);
      const candDetected = extractGarmentCategories(cand.title, candDesc);
      const isIndexUsed = usedSilhouetteIndicesByGender[genderKey].includes(i);
      const isTopUsed = usedTopTypes.has(candDetected.topType);
      const isBottomUsed = usedBottomTypes.has(candDetected.bottomType);

      let score = 0;
      if (isTopUsed && isBottomUsed) score += 500;
      else if (isBottomUsed) score += 200; // Penalize duplicate bottom heavily
      else if (isTopUsed) score += 150;   // Penalize duplicate top heavily
      if (isIndexUsed) score += 25;

      if (score < bestScore) {
        bestScore = score;
        bestIdx = i;
        bestDetected = candDetected;
      }
    }

    usedSilhouetteIndicesByGender[genderKey].push(bestIdx);
    const chosenSilhouette = silhouettes[bestIdx] || silhouettes[0];

    // Determine final top and bottom, substituting if needed to GUARANTEE 100% NON-REPEATING tops and bottoms
    let finalTopType = bestDetected.topType;
    let finalBottomType = bestDetected.bottomType;
    let topPieceDesc: string | null = null;
    let bottomPieceDesc: string | null = null;
    let finalTitle = `${style!.name} Capsule: ${chosenSilhouette.title}`;

    // If bottom type is already used anywhere in the group, pick a fresh unique bottom from the pool
    if (usedBottomTypes.has(finalBottomType)) {
      const bottomPool = DIVERSE_BOTTOM_POOLS[genderKey];
      const availableBottom = bottomPool.find(b => !usedBottomTypes.has(b.type)) || bottomPool[genderIndex % bottomPool.length];
      finalBottomType = availableBottom.type;
      bottomPieceDesc = availableBottom.desc(memberC1, memberC2);
    }

    // If top type is already used anywhere in the group, pick a fresh unique top from the pool
    if (usedTopTypes.has(finalTopType)) {
      const topPool = DIVERSE_TOP_POOLS[genderKey];
      const availableTop = topPool.find(t => !usedTopTypes.has(t.type)) || topPool[genderIndex % topPool.length];
      finalTopType = availableTop.type;
      topPieceDesc = availableTop.desc(memberC1, memberC2);
    }

    usedTopTypes.add(finalTopType);
    usedBottomTypes.add(finalBottomType);

    // Build the tailored description highlighting the non-repeating individual pieces
    let baseSilhouetteDesc = chosenSilhouette.buildDescription(memberC1, memberC2, memberC3, conceptName);
    if (topPieceDesc || bottomPieceDesc) {
      let customPieces = '';
      if (topPieceDesc && bottomPieceDesc) {
        customPieces = `Individually curated with a distinct ${topPieceDesc} and ${bottomPieceDesc}`;
        finalTitle = `${style!.name} Capsule: ${chosenSilhouette.title} with Distinct Silhouette`;
      } else if (topPieceDesc) {
        customPieces = `Individually curated with a distinct ${topPieceDesc}`;
      } else if (bottomPieceDesc) {
        customPieces = `Individually curated with distinct ${bottomPieceDesc}`;
      }
      baseSilhouetteDesc = `${baseSilhouetteDesc}. ${customPieces} (strictly non-repeating top and bottom pieces across all group members).`;
    }

    const clothingDetails = `${style!.name} Unified Capsule Collection: ${baseSilhouetteDesc}. Harmonized with the group's ${threeColorStr} palette through personalized ${memberC1} tailoring and ${memberC2} contrast layering, distinctly styled for ${member.stageName} while maintaining 100% capsule wardrobe cohesion with the group (Unique Silhouette: ${finalTopType.replace(/_/g, ' ')} top + ${finalBottomType.replace(/_/g, ' ')} bottom).`;

    const hairAndMakeup = `Authentic facial likeness and signature hairstyle (${preservedHairStyle} in ${preservedHairColor}) preserved directly from official Lineup profile. Clean, radiant stage makeup tailored to the ${conceptName} concept and coordinated 3-color scheme (${threeColorStr}).`;

    return {
      memberName: member.stageName,
      outfitTitle: finalTitle,
      fashionStyle: style!.name,
      mainStyle: style!.name,
      secondaryStyle: secondaryStyleName,
      conceptVibe: conceptName,
      stylingFormula,
      clothingDetails,
      colorPalette: threeColorStr,
      songHairStyle: preservedHairStyle,
      songHairColor: preservedHairColor,
      hairAndMakeup,
      keyAccessories: [...chosenSilhouette.accessories],
      visualVibe: `Unified ${style!.name} Stage Presence: ${chosenSilhouette.vibe} (${conceptName} attitude)`
    };
  });
}

// Helper to dynamically generate a song-tailored cool or simple environment, 3-color palette, and fashion style outfits
export function generateDefaultTrackMvVisuals(
  track: Track,
  groupName: string,
  members: MemberProfileData[] = [],
  _officialColors?: { name: string; hex: string }[],
  seed: number = Date.now(),
  explicitFashionStyleId?: string
): TrackMvVisuals {
  const genreLower = (track.genre || '').toLowerCase();
  
  // 1. Determine song-specific vibrant 3-color scheme directly from what the song is about
  // Guaranteed non-boring, anti-cliché, vibrant palette tailored to title, lyrics, and meaning
  const default3Colors: [string, string, string] = deriveVibrantSongSpecific3ColorPalette(
    track,
    explicitFashionStyleId,
    seed
  );

  // Determine setting & mood based on genre and narrative theme
  let settingName = `Modernist Concrete Rooftop & Twilight Horizon`;
  let settingDescription = `A sleek open-air architectural concrete rooftop overlooking a panoramic twilight cityscape skyline, featuring clean glass balustrades, geometric ambient uplighting, and a gentle evening breeze.`;
  let colorGradingAndAtmosphere = `Cool slate-blue evening tones, golden twilight city glow on the horizon, accented by vibrant tones of ${default3Colors[0]} and ${default3Colors[2]}.`;
  let defaultStyleId = explicitFashionStyleId || 'casual';
  let cinematicVibe = `Sleek, atmospheric urban mood with effortless superstar presence.`;
  let keyVisualMotifs = ["City twilight horizon", "Glass balustrades", "Geometric LED floor lines", "Evening ambient breeze"];
  let cameraWorkAndLighting = `Wide anamorphic 16:9 full-length framing, soft golden hour rim light, and smooth camera tracking.`;

  if (genreLower.includes('rock') || genreLower.includes('band') || genreLower.includes('punk') || genreLower.includes('grunge')) {
    settingName = `Industrial Minimalist Brick Loft & Sunset Skylight`;
    settingDescription = `A spacious, uncluttered exposed brick studio loft with towering multi-pane windows streaming warm amber late-afternoon sunlight onto weathered polished concrete floors.`;
    colorGradingAndAtmosphere = `Warm 35mm film tones, golden sunset shafts, and rich analog contrast featuring ${default3Colors[0]} and ${default3Colors[2]}.`;
    defaultStyleId = explicitFashionStyleId || 'glam_rock';
    cinematicVibe = `Raw, charismatic live-band energy with relaxed vintage rock cool.`;
    keyVisualMotifs = ["Sunlight streaming through tall windows", "Exposed warm brickwork", "Vintage chrome microphone stands", "Sunbeam lens flares"];
    cameraWorkAndLighting = `Eye-level wide group framing, authentic natural directional sunlight, and dynamic subtle handheld motion.`;
  } else if (genreLower.includes('hip') || genreLower.includes('trap') || genreLower.includes('r&b') || genreLower.includes('street')) {
    settingName = `Illuminated Architectural Underpass & Minimalist Subway Plaza`;
    settingDescription = `A clean, modern subterranean architectural plaza with brushed concrete columns, overhead linear white strip lights, and a smooth reflective granite floor.`;
    colorGradingAndAtmosphere = `Crisp architectural contrast with saturated accents in ${default3Colors[0]} and ${default3Colors[2]}.`;
    defaultStyleId = explicitFashionStyleId || 'streetwear';
    cinematicVibe = `Effortless street-luxe style, sharp rhythmic swagger, and clean minimalism.`;
    keyVisualMotifs = ["Linear overhead white lights", "Brushed concrete columns", "Reflective granite floor", "Minimalist architectural lines"];
    cameraWorkAndLighting = `Low-angle wide perspective capturing full-body silhouettes, crisp geometric symmetry, and sharp focus.`;
  } else if (genreLower.includes('ballad') || genreLower.includes('acoustic') || genreLower.includes('folk') || genreLower.includes('indie')) {
    settingName = `Sunlit Glass Pavilion & Minimalist Botanical Courtyard`;
    settingDescription = `An elegant modernist glass-walled conservatory courtyard with clean pale limestone tiles, minimalist sculptural greenery, and soft diffused morning sunlight.`;
    colorGradingAndAtmosphere = `Soft luminous warmth and gentle natural shadows tinted with ${default3Colors[0]} and ${default3Colors[1]}.`;
    defaultStyleId = explicitFashionStyleId || 'soft_indie';
    cinematicVibe = `Emotional warmth, refined sincerity, and timeless understated beauty.`;
    keyVisualMotifs = ["Diffused glass light panels", "Minimalist potted olive trees", "Limestone reflection pool", "Soft lens flares"];
    cameraWorkAndLighting = `Wide eye-level tracking, gentle natural key light, and expansive open composition.`;
  } else if (genreLower.includes('dance') || genreLower.includes('synth') || genreLower.includes('electro') || genreLower.includes('house') || genreLower.includes('edm')) {
    settingName = `Sleek Midnight Transit Tunnel with Linear Light Rails`;
    settingDescription = `A futuristic yet minimalist architectural transit tunnel with clean matte-black walls, flush vertical white neon light bars, and polished obsidian pavement.`;
    colorGradingAndAtmosphere = `High-contrast midnight noir punctuated by electric reflections of ${default3Colors[0]} and ${default3Colors[2]}.`;
    defaultStyleId = explicitFashionStyleId || 'y2k';
    cinematicVibe = `Hypnotic dance precision, sleek modern luxury, and magnetic charisma.`;
    keyVisualMotifs = ["Vertical neon light strips", "Mirror-polished black runway", "Volumetric haze beams", "Clean silhouette framing"];
    cameraWorkAndLighting = `Wide full-body formation shot, dramatic backlit rim lighting, and rhythmic camera pans.`;
  } else if (genreLower.includes('summer') || genreLower.includes('pop') || genreLower.includes('funk')) {
    settingName = `Retro Coastal Highway Lookout & Golden Hour Horizon`;
    settingDescription = `A clean vintage scenic coastal rest plaza overlooking a shimmering turquoise ocean during sunset, with minimal chrome railings and sun-bleached concrete.`;
    colorGradingAndAtmosphere = `Warm golden hour glow, sun-drenched pastels, and breezy crisp highlights radiating ${default3Colors[0]} and ${default3Colors[1]}.`;
    defaultStyleId = explicitFashionStyleId || 'casual';
    cinematicVibe = `Youthful freedom, breezy charisma, and nostalgic euphoria.`;
    keyVisualMotifs = ["Golden sunset ocean horizon", "Vintage chrome railing", "Warm ambient breeze", "Sun-bleached pavement"];
    cameraWorkAndLighting = `Wide panoramic tracking shots, natural lens flares, and fluid movement.`;
  }

  // Find style definition
  const chosenStyle = KPOP_POPULAR_FASHION_STYLES.find(s => s.id === defaultStyleId) || KPOP_POPULAR_FASHION_STYLES[0];
  const songColorPalette = `${default3Colors[0]}, ${default3Colors[1]}, and ${default3Colors[2]}`;

  // 2. Curate dynamic member outfits based on Fashion Style and 3-Color Scheme (preserving face & hairstyle)
  const memberOutfits = generateDynamicMemberOutfits(
    track,
    songColorPalette,
    members,
    seed,
    undefined,
    chosenStyle.id,
    default3Colors
  );

  const sampleOutfit = memberOutfits[0];
  const mainStyle = sampleOutfit?.mainStyle || chosenStyle.name;
  const secondaryStyle = sampleOutfit?.secondaryStyle || "High Fashion / Editorial";
  const conceptVibe = sampleOutfit?.conceptVibe || "Confident / Swagger";
  const stylingFormula = sampleOutfit?.stylingFormula || buildKpopOutfitFormula(mainStyle, secondaryStyle, conceptVibe);

  const allNames = members.map(m => m.stageName);
  const m1 = members[0]?.stageName || groupProfile.groupName;
  const m2 = members[1]?.stageName || members[0]?.stageName || m1;
  const m3 = members[2]?.stageName || members[0]?.stageName || m1;
  const groupStr = allNames.length > 0 ? allNames.join(', ') : groupProfile.groupName;

  const iconicScenes: StoryboardScene[] = [
    {
      timestamp: "0:00 - 0:28",
      title: `Atmospheric Intro: ${m1} Solo Hook`,
      featuredMembers: members.length > 0 ? [m1] : [groupProfile.groupName],
      visualAction: `Cinematic wide-to-medium camera push revealing ${m1} inside ${settingName}. ${m1} delivers the opening vocal lines under dramatic ${colorGradingAndAtmosphere}, dressed in tailored ${chosenStyle.name} stage styling.`
    },
    {
      timestamp: "0:45 - 1:15",
      title: "First Chorus: Full Group Center Choreography",
      featuredMembers: allNames.length > 0 ? allNames : [groupProfile.groupName],
      visualAction: `Dynamic wide anamorphic framing as all members (${groupStr}) hit the synchronized main chorus point-dance in the center of ${settingName}, their coordinated 3-color outfits (${default3Colors.join(', ')}) popping with rhythmic lighting pulses.`
    },
    {
      timestamp: "1:40 - 2:10",
      title: `Narrative Bridge: ${m2} & ${m3} Dramatic Vocal Tension`,
      featuredMembers: members.length > 1 ? [m2, m3] : [m1],
      visualAction: `Intimate split-field tracking shots following ${members.length > 1 ? `${m2} and ${m3}` : m1} through the architectural set, capturing emotional facial expressions and vocal intensity as the song builds to its emotional climax.`
    },
    {
      timestamp: "2:35 - Outro",
      title: "Grand Climax & Final Signature Formation",
      featuredMembers: allNames.length > 0 ? allNames : [groupProfile.groupName],
      visualAction: `Sweeping 360-degree crane pullback as ${groupStr} unite for the explosive musical crescendo and freeze-frame ending silhouette pose against the sweeping backdrop of ${settingName}.`
    }
  ];

  return {
    settingName,
    settingDescription,
    colorGradingAndAtmosphere,
    songColorPalette,
    threeColorPalette: default3Colors,
    fashionStyle: chosenStyle.name,
    mainStyle,
    secondaryStyle,
    conceptVibe,
    stylingFormula,
    cinematicVibe,
    keyVisualMotifs,
    cameraWorkAndLighting,
    groupOutfitConceptSummary: `Styling Formula: ${stylingFormula}. Cohesive K-pop stage outfits tailored to "${track.title}" in vibrant 3-color scheme: ${songColorPalette}, preserving each member's authentic face and signature hairstyle.`,
    iconicSceneHighlights: iconicScenes,
    memberOutfits
  };
}

export async function generateAiTrackMvVisuals(
  track: Track,
  groupProfile: GroupProfileData,
  members: MemberProfileData[] = [],
  userGuidance?: string
): Promise<TrackMvVisuals> {
  const membersList = members.map((m, i) => `${i + 1}. ${m.stageName} (Gender: ${m.gender || 'Unknown'}, Roles: ${m.positions?.join(', ') || 'Member'})`).join('\n') || 'All members';

  const userGuidanceSection = userGuidance && userGuidance.trim() ? `
SPECIAL USER DIRECTORIAL GUIDANCE & CREATIVE PREFERENCES:
"${userGuidance.trim()}"
- Strictly incorporate and prioritize the above directorial ideas, specific settings, mood, styling adjustments, or aesthetic concepts in your generation!
` : '';

  const prompt = `You are a world-renowned K-Pop Creative Director & Fashion Stylist.
Design a custom, bespoke CINEMATIC MV WORLD, COOL/SIMPLE ENVIRONMENT, VIBRANT 3-COLOR PALETTE, and POPULAR FASHION STYLE OUTFITS tailored specifically to what this song is about on the Records page:

TRACK DETAILS FROM RECORDS PAGE:
- Song Title: "${track.title}"
- Album Role: ${track.role}
- Primary Genre: ${track.genre} (${track.genres?.join(', ') || 'K-Pop'})
- Song Meaning & Narrative Theme: "${track.meaning || track.description || 'Modern K-pop song'}"
- Song Description: "${track.description || ''}"
- Musical Sound & Production Style: "${track.musicStylePrompt || 'Dynamic K-pop production'}"
- Lyric Excerpt: "${track.lyricExcerpt || ''}"
${track.fullLyricsEnglish ? `- English Lyrics Meaning: "${track.fullLyricsEnglish.slice(0, 300)}..."` : ''}
- Group Name: "${groupProfile.groupName}"
- Group Universe / Identity: "${groupProfile.conceptDescription}"
${userGuidanceSection}
MEMBERS IN GROUP:
${membersList}

CRITICAL DIRECTORIAL & STYLING MANDATES:
1. FOCUS ON POPULAR FASHION STYLES (COHESIVE DESIGNER CAPSULE COLLECTION):
   - Choose an iconic, recognizable fashion style for the MV: e.g. Preppy, Elevated Casual, High-End Streetwear, Y2K Retro, Old Money / Academia, Glam Rock, Sporty Athleisure, Chic Minimalist, or Soft Indie.
   - ALL MEMBERS MUST SHARE THE EXACT SAME SPECIFIC FASHION STYLE: e.g. if the style is "Preppy", every single member wears Preppy!
   - NO MISMATCHED OUTFITS: Outfits must NEVER look all over the place. They must look like a cohesive capsule collection from the SAME high-end designer house.
   - CO-ED & MIXED LINEUP HARMONIZATION: In co-ed groups, male and female members MUST share the same design language, fabrics, tailored lines, and styling rules. Male tailored blazers/knits pair with female matching cropped blazers/pleated skirts; both wear identical color hierarchies with Base Tone, Secondary Tone, and Accent Pop.

2. MANDATORY OUTFIT UNIQUENESS — STRICTLY NO TWIN OR IDENTICAL OUTFITS (ESPECIALLY IN CO-ED GROUPS):
   - NO TWO MEMBERS MUST EVER WEAR THE EXACT SAME OUTFIT OR SILHOUETTE!
   - In co-ed groups, all-male groups, or all-female groups, members of the same gender MUST have distinctly DIFFERENT, unique outfits:
     * Guy 1 and Guy 2 MUST have distinctly different garment silhouettes (e.g. Guy 1 in an oversized single-breasted blazer and fluid trousers; Guy 2 in a cropped leather moto jacket or fine-knit cardigan with straight-leg slacks). Both guys must NEVER wear identical twin suits or matching jackets!
     * Girl 1 and Girl 2 MUST have distinctly different garment silhouettes (e.g. Girl 1 in a cropped tailored blazer with a pleated tennis skort; Girl 2 in an asymmetric suiting vest or off-shoulder knit with high-waisted tailored wide-leg trousers). Both girls must NEVER wear identical twin tops or matching skirts!
   - In the "memberOutfits" list, EVERY member's "outfitTitle" and "clothingDetails" MUST describe a visually distinct piece and cut from the capsule collection!
   - Rotate color distribution across members (e.g. Member 1 has Base Color jacket with Secondary Color shirt; Member 2 has Secondary Color outer piece with Base Color slacks) so the group coordinates seamlessly without anyone looking like an identical clone.

3. ABSOLUTE PROHIBITION ON WEIRD, CLOWNISH, OR COSTUMEY OUTFITS:
   - STRICTLY NO skirts layered over pants or trousers! A member wears EITHER tailored trousers OR a skirt/skort, NEVER a skirt over pants.
   - STRICTLY NO sheer ruffled tulle slips or tutus worn over slacks or trousers.
   - STRICTLY NO split two-tone patchwork clown jackets (no half-houndstooth half-satin jackets, no half-and-half mismatched fabrics).
   - STRICTLY NO shiny tin-foil or metallic foil space pants.
   - STRICTLY NO clogs, wooden soles, pacifiers, fairy wings, or cartoon costumes.
   - Outfits MUST be authentic, elegant, sleek, wearable designer K-Pop stage fashion (tailored blazers, structured leather moto jackets, crisp shirting, pleated tennis/suiting skirts, refined knits, clean pressed tailored trousers, polished leather boots or clean designer sneakers) as seen on premier Seoul music shows.

3. VIBRANT, BESPOKE SONG COLOR SCHEME (STRICTLY NO BORING / REPETITIVE COLOR COMBINATIONS):
   - ABSOLUTELY NEVER default to safe, repetitive, or boring color combinations (STRICTLY NO safe black/cream/burgundy, NO generic black/white, NO dull all-grey neutrals).
   - Look deeply at what THIS SPECIFIC SONG is actually about in its Title ("${track.title}"), Meaning ("${track.meaning || ''}"), Description ("${track.description || ''}"), Musical Sound Style ("${track.musicStylePrompt || ''}"), and Lyrics on the Records page!
   - Invent an exciting, vivid, bespoke 3-color scheme [Base Grounding Tone, Secondary Harmonizing Layer, Striking Accent Pop] tailored directly to what this song is about!
   - High-fashion song-inspired examples:
     * Twilight / Sunset: ["Twilight Cobalt", "Dusk Sand Tan", "Blazing Tangerine"]
     * Cosmic / Ethereal: ["Midnight Indigo", "Celestial Slate", "Iridescent Starlight Violet"]
     * Neon / Cyber Velocity: ["Obsidian Black", "Optic White", "Electric Cyber Violet"] or ["Smoked Charcoal", "Ice Platinum", "Neon Cyber Lime"]
     * Summer / Ocean: ["Deep Capri Navy", "Crisp Salt White", "Vibrant Cyan Pop"]
     * Sweet / High-Teen: ["Baby Blush Pink", "Crisp Milk White", "Soft Lilac Mist"]
     * Passion / Siren: ["Matte Pitch Black", "Smoked Charcoal", "Electric Vermilion Red"]
     * Luxe / Regal: ["Imperial Royal Amethyst", "Burnished Antique Gold", "Midnight Sapphire"]
     * Retro Funk: ["Caramel Toffee", "Cream White", "Retro Electric Cobalt"]
     * Melancholy / Rain: ["Misty Periwinkle", "Wet Slate Charcoal", "Icy Blue Tint"]
     * Spring / Blossom: ["Sakura Blossom Pink", "Matcha Green", "Dewdrop Opal"]
   - Each member's outfit must dynamically incorporate these 3 colors in a coordinated mix with Base Tone (60%), Secondary Tone (30%), and Accent Pop (10%).

4. PRESERVE MEMBERS' AUTHENTIC FACE AND SIGNATURE HAIRSTYLE:
   - KEEP the member's authentic face and signature hairstyle from their Lineup profile.
   - DO NOT invent random new haircuts or drastic artificial hair dyes.

5. ZERO TECHWEAR POLICY:
   - Strictly NO techwear, NO tactical gear, NO utility harnesses, NO chest rigs, NO tactical pouches, NO combat clothes.

6. MANDATORY REAL-MEMBER-ACCURATE STORYBOARD SEQUENCE (ZERO MAKING STUFF UP):
   - In "iconicSceneHighlights", EVERY scene MUST feature real members from the MEMBERS IN GROUP list above by their EXACT stage names!
   - NEVER invent fictional background characters or use generic phrases like "a dancer" or "the soloist".
   - Assign distinct, cinematic narrative moments:
     * Scene 1 (0:00 - 0:30): Atmospheric Intro featuring a specific named member's solo vocal hook or cinematic establishing moment.
     * Scene 2 (0:45 - 1:15): High-energy main chorus choreography in the setting featuring all group members synchronized in their coordinated outfits.
     * Scene 3 (1:40 - 2:15): Dramatic bridge / narrative tension featuring 1 or 2 specific named members delivering the song's emotional vocal climax.
     * Scene 4 (2:35 - End): Explosive grand finale & final signature freeze-frame silhouette pose featuring all group members.
   - The "featuredMembers" array MUST contain the exact stage names of the members appearing in that scene!

STRICT JSON OUTPUT FORMAT:
{
  "settingName": "string (Evocative 3-6 word cool or simple environment name)",
  "settingDescription": "string (Vivid 2-3 sentence description of the set architecture, textures, and backdrop)",
  "colorGradingAndAtmosphere": "string (Specific color grading, lighting temperature, and mood matching the 3-color scheme)",
  "fashionStyle": "string (Chosen popular fashion style: Preppy, Casual, Streetwear, etc.)",
  "threeColorPalette": ["string (Color 1)", "string (Color 2)", "string (Color 3)"],
  "songColorPalette": "string (e.g. 'Twilight Cobalt, Blazing Tangerine, and Dusk Lilac')",
  "cinematicVibe": "string (1-2 sentence core aesthetic vibe and feeling)",
  "keyVisualMotifs": ["string (Motif 1)", "string (Motif 2)", "string (Motif 3)", "string (Motif 4)"],
  "cameraWorkAndLighting": "string (Specific lens choice, camera angles, and lighting style)",
  "groupOutfitConceptSummary": "string (1-2 sentence overview of how the group wears this fashion style in the 3 colors)",
  "iconicSceneHighlights": [
    { 
      "timestamp": "0:00 - 0:28", 
      "title": "Intro Scene: [Specific Member] Solo Hook", 
      "featuredMembers": ["MemberStageName"],
      "visualAction": "Specific, vivid description of what this member is doing in the setting" 
    },
    { 
      "timestamp": "0:45 - 1:15", 
      "title": "Main Chorus: Full Group Center Choreography", 
      "featuredMembers": ["Member1", "Member2"],
      "visualAction": "Synchronized chorus choreography performance in the center of the setting" 
    },
    { 
      "timestamp": "1:40 - 2:10", 
      "title": "Dramatic Bridge: [Member] Narrative Climax", 
      "featuredMembers": ["MemberStageName"],
      "visualAction": "Emotional vocal tension and acting moment" 
    },
    { 
      "timestamp": "2:35 - End", 
      "title": "Grand Climax & Final Signature Formation", 
      "featuredMembers": ["Member1", "Member2"],
      "visualAction": "Explosive finale with all members in iconic ending formation" 
    }
  ],
  "memberOutfits": [
    {
      "memberName": "string (Member's stage name)",
      "outfitTitle": "string (e.g. 'Preppy: Varsity Cardigan & Pleated Trousers')",
      "clothingDetails": "string (How this member wears the fashion style in the 3 colors)",
      "colorPalette": "string (The 3 colors)",
      "songHairStyle": "string (Signature hairstyle preserved from Lineup profile)",
      "songHairColor": "string (Signature hair color preserved from Lineup profile)",
      "hairAndMakeup": "string (Facial likeness and hairstyle preserved from profile. Clean stage makeup in 3-color tones)",
      "keyAccessories": ["string", "string", "string"],
      "visualVibe": "string (Stage presence in this fashion style)"
    }
  ]
}
`;

  try {
    const { data } = await generateKpopGroupData<TrackMvVisuals>(prompt);
    if (data && data.settingName && data.memberOutfits && data.memberOutfits.length > 0) {
      // Validate that color palette is vibrant and not defaulting to boring safe tones
      if (!data.threeColorPalette || data.threeColorPalette.length < 3 || isBoringColorPalette(data.threeColorPalette)) {
        const freshVibrant = deriveVibrantSongSpecific3ColorPalette(track, data.fashionStyle);
        data.threeColorPalette = freshVibrant;
        data.songColorPalette = `${freshVibrant[0]}, ${freshVibrant[1]}, and ${freshVibrant[2]}`;
        data.memberOutfits = data.memberOutfits.map(o => ({
          ...o,
          colorPalette: data.songColorPalette
        }));
      }
      return data;
    }
  } catch (err) {
    console.error("Failed to generate AI MV visuals, falling back to default:", err);
  }

  return generateDefaultTrackMvVisuals(track, groupProfile.groupName, members);
}

// Builds the Hyper-Realistic 16:9 Full-Body Head-to-Toe Group MV Photoshoot Prompt
export function buildTrackGroupMvPhotoshootPrompt(
  track: Track,
  mvVisuals: TrackMvVisuals,
  groupProfile: GroupProfileData,
  members: MemberProfileData[],
  customDirectorialNotes?: string,
  variationSeed?: number,
  useIndividualPhotosAsReferences: boolean = false
): string {
  const initialCount = members.length;
  const initialMemberNames = members.map((m, i) => `Member ${i + 1} (${m.stageName})`).join(', ');
  const colorsText = Array.isArray(mvVisuals.threeColorPalette) 
    ? mvVisuals.threeColorPalette.join(', ')
    : (mvVisuals.songColorPalette || "3-color palette");
  const fashionStyle = mvVisuals.fashionStyle || "High-Fashion Stage Styling";
  const mainStyle = mvVisuals.mainStyle || fashionStyle;
  const secondaryStyle = mvVisuals.secondaryStyle;
  const conceptVibe = mvVisuals.conceptVibe;
  const stylingFormula = mvVisuals.stylingFormula || buildKpopOutfitFormula(mainStyle, secondaryStyle, conceptVibe);

  const memberDescriptions = members.map((m, i) => {
    const outfit = mvVisuals.memberOutfits?.find(o => o.memberName.toLowerCase() === m.stageName.toLowerCase()) 
      || mvVisuals.memberOutfits?.[i];
    
    const hairStyle = m.currentHairStyle || m.originalHairType || 'Signature hairstyle';
    const hairColor = m.dyedHairColor || m.originalHairColor || 'Natural hair color';
    const genderDesc = (m.gender || '').toLowerCase() === 'male' ? 'Male K-pop Idol' : 'Female K-pop Idol';
    const koreanNameStr = m.koreanName || m.fullNameKorean ? ` (Korean: ${m.koreanName || m.fullNameKorean})` : '';

    const facialTraits = m.distinctFacialFeatures 
      ? `Distinctive Facial Characteristics: "${m.distinctFacialFeatures}"`
      : `Distinctive Facial Characteristics: Natural, individualized ${m.race || 'East Asian'} idol facial bone structure with balanced proportions`;

    const outfitDetails = outfit 
      ? `Fashion Style Outfit ("${outfit.outfitTitle}"): ${outfit.clothingDetails}. 3-Color Harmony: ${outfit.colorPalette}. Accessories: ${outfit.keyAccessories?.join(', ') || 'Styled accessories in the 3 colors'}. Vibe: ${outfit.visualVibe}.`
      : `Fashion Style Outfit: Impeccably styled ${fashionStyle} outfit in ${colorsText}.`;

    return `MEMBER ${i + 1} - "${m.stageName}"${koreanNameStr} (${genderDesc}):
- ETHNICITY & COMPLEXION: Authentic ${m.race || 'East Asian'} idol with ${m.skinTone || 'fair radiant skin'} and ${m.eyeColor || 'dark brown'} eyes.
- ${facialTraits}.
- SIGNATURE HAIR: ${hairStyle} in ${hairColor}.
- STRICT IDENTITY & FACE PRESERVATION (CRITICAL): Copy their EXACT face, eyelid shape, nose bridge, jawline, lips, and signature hairstyle directly from [SOURCE FACE PORTRAIT ${i + 1}: ${m.stageName}]. Their face must look 100% like themselves, NOT like a stranger, generic person, or weird AI face!
- ${outfitDetails}`;
  }).join('\n\n');

  const customNotesSection = customDirectorialNotes && customDirectorialNotes.trim() ? `
SPECIAL DIRECTOR TWEAKS & CUSTOM COMPOSITION GUIDANCE:
"${customDirectorialNotes.trim()}"
- Prioritize and integrate this custom direction directly into the staging, lighting, or atmosphere.
` : '';

  const dynamicStagings = [
    "Editorial asymmetric lineup with natural staggered heights and subtle cinematic parallax.",
    "Dynamic high-fashion group formation with center-anchored charisma and clean spacing.",
    "Natural relaxed idol staging with architectural depth, soft backlighting, and effortless poise.",
    "Sophisticated wide-angle perspective with elegant symmetry and crisp edge-to-edge clarity."
  ];
  const stagingChoice = dynamicStagings[Math.abs((variationSeed || Date.now())) % dynamicStagings.length];

  const referenceIntro = useIndividualPhotosAsReferences
    ? `ATTACHED IMAGES ARE THE PRE-RENDERED INDIVIDUAL FULL-BODY PHOTOS OF EACH MEMBER:
The attached reference images show each member in their individual full-body outfit shot. You must composite and stage these exact individuals standing side-by-side in the ${mvVisuals.settingName} environment, keeping their faces, hairstyles, and outfits completely identical to their individual shots!`
    : `ATTACHED REFERENCE IMAGES ARE OFFICIAL LINEUP PROFILE PORTRAITS:
Each attached reference image corresponds to the official profile portrait of that member from the Lineup tab:
${members.map((m, i) => `  * Reference Image ${i + 1}: Official Lineup profile photo of Member ${i + 1} (${m.stageName}) - Keep Face & Hairstyle strictly identical!`).join('\n')}`;

  return `A hyper-realistic 16:9 WIDE-ANGLE FULL-BODY HEAD-TO-TOE music video location photoshoot of the K-pop group "${groupProfile.groupName}" for their song "${track.title}".
${customNotesSection}
CRITICAL TOTAL MEMBER COUNT (${initialCount} MEMBERS) & STRICT NO-EXTRA-PEOPLE RULE:
The photoshoot MUST feature EXACTLY ${initialCount} HUMAN IDOLS (${initialMemberNames}) completely from head to toe standing together in the environment — NO MORE, NO LESS.
- EXACTLY ${initialCount} HUMAN IDOLS: The photo MUST contain ONLY Member 1 through Member ${initialCount} listed below.
- ABSOLUTELY NO EXTRA PEOPLE OR STRANGERS: Do NOT add any extra random background people, dancers, or unrequested models.
- ABSOLUTELY NO CLONES OR DUPLICATES: Each idol in the photo corresponds strictly to ONE distinct member from their attached reference image.
- DO NOT OMIT ANY MEMBER: Every listed member (${initialMemberNames}) MUST be clearly visible standing together.

CRITICAL IDENTITY PRESERVATION — ZERO WEIRD FACES & 100% AUTHENTIC LIKENESS:
- ZERO UNCANNY, MELTED, OR WEIRD FACES: Under NO circumstances should any idol look weird, distorted, morphed, asymmetrical, or generic. Each member's face MUST match their official reference portrait with razor-sharp fidelity.
- CRISP FACIAL RESOLUTION IN FULL-BODY WIDE SHOT: Even though this is a wide-angle full-body head-to-toe shot, commercial Hasselblad 8k medium-format rendering ensures all faces remain crystal clear, with realistic human eyes, crisp double/single eyelids, authentic skin pores, and defined jawlines.
- PRESERVE INDIVIDUAL FACIAL CHARACTERISTICS: Faithfully reproduce each idol's authentic bone structure, eye shape, nose bridge, and mouth.
- PRESERVE SIGNATURE HAIRSTYLE & COLOR: Replicate each member's exact signature hairstyle and hair color from their reference card.
${referenceIntro}

K-POP STYLING CONCEPT FORMULA & 3-COLOR HARMONY:
- Outfit Concept Formula: "${stylingFormula}" (Main Style: "${mainStyle}"${secondaryStyle ? ` + Secondary Style: "${secondaryStyle}"` : ''}${conceptVibe ? ` + Concept Lens: "${conceptVibe}"` : ''})
- UNIFIED CAPSULE WARDROBE (ZERO MISMATCHED OUTFITS): ALL members—male and female alike—strictly wear the EXACT same fashion style: "${mainStyle}". The outfits must look like a unified designer comeback capsule collection, NEVER looking all over the place or disjointed!
- MANDATORY OUTFIT DIVERSITY (STRICTLY NO TWIN OR IDENTICAL OUTFITS):
  * NO TWO MEMBERS MUST WEAR THE EXACT SAME OUTFIT OR SILHOUETTE!
  * In co-ed groups or any group lineup, multiple male members must NEVER wear identical twin suits or matching jackets, and multiple female members must NEVER wear identical twin tops or matching skirts!
  * Each idol must have a distinct, personalized silhouette from the collection:
    - e.g., Male 1 in an oversized collegiate graphic hoodie with baggy vintage-wash skater denim vs. Male 2 in a boxy cropped zip bomber over a graphic tee and wide utility denim.
    - e.g., Female 1 in a cropped zip hoodie with low-slung baggy vintage-wash denim vs. Female 2 in a cropped denim jacket with a structured pleated denim mini-skort and platform sneakers.
  * All members share the same cohesive fashion style and the same 3-color palette, but every idol's individual outfit, cut, and silhouette MUST BE VISUALLY UNIQUE!
- CO-ED & MIXED LINEUP HARMONIZATION: In co-ed groups, male and female members wear coordinated pieces from the same collection (e.g. matching denim washes, complementary graphic accents, coordinated jacket cuts or casual skorts) in the exact same 3-color hierarchy!
- Unified 3-Color Scheme: "${colorsText}". Grounded in Base Tone for main garments, Secondary Tone for layering, and vibrant Accent Pop for signature details across all outfits so the styling is cohesive, stylish, and never boring!
- Full silhouettes from head to toe: pants/skirts, and shoes MUST BE 100% visible on the floor. NO cropping of feet or shoes!

CRITICAL MANDATE — ABSOLUTE PROHIBITION ON WORKWEAR, SUITING & "OLD PEOPLE" CLOTHES (REMEMBER THESE ARE YOUNG K-POP IDOLS!):
- STRICTLY NO WORKWEAR OR SUITS: Absolutely NO corporate blazers, NO business suits, NO suiting vests/waistcoats, NO dress trousers, NO pressed office slacks, NO corporate chinos, NO button-down office shirts with ties, and NO grandma/grandpa knitted vests!
- STRICTLY NO OLD-FASHIONED FORMAL FOOTWEAR: Absolutely NO dress loafers, NO penny loafers, NO formal oxfords, NO brogues, NO derbies, NO corporate court shoes, and NO dress mules!
- AUTHENTIC YOUTHFUL K-POP IDOL CASUAL: All members are young, charismatic K-pop idols! They wear youthful, trendsetting, fresh idol casual outfits (e.g. oversized graphic hoodies, cropped zip hoodies, boxy cropped denim trucker jackets, varsity bomber jackets, fitted baby tees, ribbed tank tops, baggy skater denim jeans, relaxed wide-leg washed cargo jeans, pleated denim or casual tennis mini-skorts, and fresh designer chunky sneakers or platform court kicks with white athletic crew socks). The styling must look youthful, effortless, cool, and iconic!

CRITICAL MANDATE — ABSOLUTE PROHIBITION ON WEIRD, CLOWNISH, OR COSTUMEY OUTFITS:
- STRICTLY NO skirts layered over pants or trousers! A member wears EITHER pants OR a skirt/skort, NEVER a skirt over pants.
- STRICTLY NO sheer ruffled tulle slips or tutus worn over pants.
- STRICTLY NO split two-tone patchwork clown jackets (no half-houndstooth half-satin jackets, no mismatched split fabrics).
- STRICTLY NO shiny tin-foil or metallic foil space pants.
- STRICTLY NO clogs, wooden soles, pacifiers, fairy wings, or cartoon costumes.
- Outfits MUST be authentic, fresh, stylish, wearable K-Pop idol stage and off-duty fashion (oversized graphic hoodies, cropped zip jackets, varsity bombers, baby tees, relaxed baggy vintage-wash skater denim, casual denim/tennis mini-skorts, and fresh designer platform sneakers with athletic socks) as seen on premier Seoul music shows.

CRITICAL MANDATE — ABSOLUTE PROHIBITION ON TECHWEAR:
- NEVER DO TECHWEAR OR ANYTHING RELATED TO IT: Absolutely NO techwear, NO tactical vests, NO utility harnesses, NO chest rigs, NO multi-strap buckles, NO tactical pouches, NO combat gear, NO military nylon webbing, NO ripstop parachute cargo pants, and NO sci-fi survival straps. The group's stage fashion must be high-end, clean, fashionable, tailored, streetwear or editorial K-pop stage clothing, NEVER techwear.

COOL OR SIMPLE MV ENVIRONMENT & LOCATION:
- Setting Name: ${mvVisuals.settingName}
- Environment & Architecture: ${mvVisuals.settingDescription}
- Color Grading, Lighting & Atmosphere: ${mvVisuals.colorGradingAndAtmosphere}
- Cinematic Vibe: ${mvVisuals.cinematicVibe}

GROUP POSING & IDOL PRESENCE:
- Composition: ${stagingChoice}
- All members are standing with confident star presence and distinct, charismatic postures.
- Shot on ARRI Alexa 65 / Hasselblad 8k commercial photography, anamorphic lens, beautiful cinematic lighting, crisp 8k photorealistic quality.

MEMBER SPECIFICATIONS:
${memberDescriptions}`;
}

export function buildTrackMvStillPrompt(
  track: Track,
  mvVisuals: TrackMvVisuals,
  groupName: string,
  agency: string,
  members: MemberProfileData[] = [],
  mode: 'with_members' | 'scenery_only' = 'with_members'
): string {
  const motifs = mvVisuals.keyVisualMotifs?.join(', ') || 'Cinematic lighting, ambient atmosphere';
  const songPalette = mvVisuals.songColorPalette || 'Cinematic palette';

  if (mode === 'scenery_only' || members.length === 0) {
    return `Award-winning 8k cinematic architectural film landscape still from the official high-budget K-pop music video for "${track.title}" by "${groupName}".
Production: ${agency} / Global Creative Direction.
Setting Location: ${mvVisuals.settingName}.
Environment & Set Architecture: ${mvVisuals.settingDescription}.
Color Grading & Mood: ${mvVisuals.colorGradingAndAtmosphere} (${songPalette}).
Atmosphere & Key Motifs: ${motifs}.
Cinematic Vibe: ${mvVisuals.cinematicVibe}.
CRITICAL COMPOSITION MANDATE:
- ARCHITECTURAL & SET SCENERY ONLY (NO PEOPLE): This is an empty, majestic establishing landscape shot of the set environment.
- ZERO HUMAN FIGURES, ZERO PEOPLE, ZERO SILHOUETTES: Under NO circumstances should any person, stranger, mannequin, or blurry silhouette appear in this shot.
Camera & Lens: Shot on ARRI Alexa 65 with Anamorphic lenses, expansive 16:9 cinematic framing, beautiful architectural volumetric lighting, atmospheric haze, hyper-detailed commercial cinematography, 8k resolution.`;
  }

  // mode === 'with_members'
  const memberDescs = members.map((m, i) => {
    const outfit = mvVisuals.memberOutfits?.[i];
    const hairStyle = m.currentHairStyle || m.originalHairType || 'Signature hairstyle';
    const hairColor = m.dyedHairColor || m.originalHairColor || 'Natural hair color';
    const genderDesc = (m.gender || '').toLowerCase() === 'male' ? 'Male K-pop Idol' : 'Female K-pop Idol';
    const koreanNameStr = m.koreanName || m.fullNameKorean ? ` (Korean: ${m.koreanName || m.fullNameKorean})` : '';
    const outfitStr = outfit ? `${outfit.outfitTitle}: ${outfit.clothingDetails}` : `Styled in ${mvVisuals.fashionStyle || 'editorial K-pop'} fashion`;

    return `MEMBER ${i + 1}: "${m.stageName}"${koreanNameStr} (${genderDesc}):
- Authentic ${m.race || 'East Asian'} idol, ${m.skinTone || 'fair radiant skin'}, ${m.eyeColor || 'dark brown'} eyes.
- Signature Hair: ${hairStyle} in ${hairColor}.
- Distinctive Facial Identity: ${m.distinctFacialFeatures || 'Youthful idol facial harmony, defined jawline and high cheekbones'}.
- STRICT IDENTITY PRESERVATION: Match their EXACT face, eyelid shape, nose bridge, jawline, and lips directly from [REFERENCE PORTRAIT ${i + 1}: ${m.stageName}]. Zero weird faces, zero distortions.
- Outfit: ${outfitStr}.`;
  }).join('\n\n');

  return `Award-winning 8k cinematic widescreen film still from the official high-budget K-pop music video for "${track.title}" by "${groupName}".
Production: ${agency} / Global Creative Direction.

SCENE SETTING & WORLD:
- Setting Location: ${mvVisuals.settingName}
- Environment & Set Architecture: ${mvVisuals.settingDescription}
- Color Grading & Mood: ${mvVisuals.colorGradingAndAtmosphere} (${songPalette})
- Atmosphere & Key Motifs: ${motifs}
- Cinematic Vibe: ${mvVisuals.cinematicVibe}

FEATURED IDOLS IN SCENE:
- All ${members.length} members of ${groupName} (${members.map(m => `"${m.stageName}"`).join(', ')}) are positioned dynamically in the setting, radiating star charisma and idol stage presence.
- STRICT IDENTITY PRESERVATION — ZERO WEIRD FACES: Under NO circumstances should any idol look strange, distorted, melted, or unfamiliar. Each idol's face MUST match their official Lineup reference portrait with razor-sharp commercial fidelity.
- NO STRANGERS, NO RANDOM EXTRAS: Only the actual members of ${groupName} appear in this shot.
- COHESIVE FASHION: All members wear their coordinated ${mvVisuals.fashionStyle || 'K-pop'} capsule collection in ${songPalette}.

MEMBER DETAILS:
${memberDescs}

Camera & Lens: Shot on ARRI Alexa 65 with Anamorphic lenses, expansive 16:9 cinematic framing, beautiful filmic lighting, volumetric haze, pristine skin rendering, 8k master cinematography.`;
}

// Builds individual 16:9 Storyboard Scene frame still prompt featuring the specific members assigned to that scene
export function buildStoryboardSceneStillPrompt(
  scene: StoryboardScene,
  sceneIndex: number,
  track: Track,
  mvVisuals: TrackMvVisuals,
  groupName: string,
  agency: string,
  members: MemberProfileData[]
): { prompt: string; featuredMemberProfiles: MemberProfileData[] } {
  // Determine featured members:
  let featured: MemberProfileData[] = [];
  if (scene.featuredMembers && scene.featuredMembers.length > 0) {
    featured = members.filter(m => 
      scene.featuredMembers!.some(fm => 
        fm.toLowerCase().includes(m.stageName.toLowerCase()) || 
        m.stageName.toLowerCase().includes(fm.toLowerCase())
      )
    );
  }
  
  if (featured.length === 0) {
    featured = members.filter(m => 
      scene.title.toLowerCase().includes(m.stageName.toLowerCase()) || 
      scene.visualAction.toLowerCase().includes(m.stageName.toLowerCase())
    );
  }

  if (featured.length === 0) {
    featured = members;
  }

  const isSolo = featured.length === 1;
  const isDuo = featured.length === 2;
  const featuredNames = featured.map(m => `"${m.stageName}"`).join(featured.length > 2 ? ', ' : ' and ');

  const memberDescriptions = featured.map((m, idx) => {
    const mIdx = members.findIndex(mem => mem.stageName.toLowerCase() === m.stageName.toLowerCase());
    const outfit = mIdx >= 0 ? mvVisuals.memberOutfits?.[mIdx] : undefined;
    const hairStyle = m.currentHairStyle || m.originalHairType || 'Signature hairstyle';
    const hairColor = m.dyedHairColor || m.originalHairColor || 'Natural hair color';
    const genderDesc = (m.gender || '').toLowerCase() === 'male' ? 'Male K-pop Idol' : 'Female K-pop Idol';
    const koreanNameStr = m.koreanName || m.fullNameKorean ? ` (Korean: ${m.koreanName || m.fullNameKorean})` : '';
    const outfitStr = outfit ? `${outfit.outfitTitle}: ${outfit.clothingDetails}` : `Styled in cohesive ${mvVisuals.fashionStyle || 'K-pop'} stage outfit in ${mvVisuals.songColorPalette}`;

    return `IDOL ${idx + 1} IN SCENE — "${m.stageName}"${koreanNameStr} (${genderDesc}):
- Authentic ${m.race || 'East Asian'} idol, ${m.skinTone || 'fair radiant skin'}, ${m.eyeColor || 'dark brown'} eyes.
- Signature Hair: ${hairStyle} in ${hairColor}.
- Distinctive Facial Structure: ${m.distinctFacialFeatures || 'Defined jawline, high cheekbones, youthful idol facial harmony'}.
- STRICT IDENTITY PRESERVATION: Match their EXACT face, eyes, nose, and lips from their attached official reference portrait [IDOL ${idx + 1}: ${m.stageName}]. Zero weird faces, zero distortions.
- Outfit: ${outfitStr}.`;
  }).join('\n\n');

  const shotType = isSolo ? 'Intimate medium-close tracking shot / solo focal frame' : (isDuo ? 'Dynamic two-shot medium framing' : 'Expansive cinematic ensemble performance framing');

  const prompt = `Award-winning 8k cinematic storyboard movie still from the official music video for "${track.title}" by "${groupName}".
Production: ${agency} / Global Creative Direction.
Scene Identifier: SCENE ${sceneIndex + 1} (${scene.timestamp}) — "${scene.title}".

NARRATIVE ACTION & SCENE MOMENT:
- Action: ${scene.visualAction}
- Framing & Camera: ${shotType}, shot on ARRI Alexa 65 with Anamorphic lenses, expansive 16:9 cinematic aspect ratio.
- Setting: ${mvVisuals.settingName} (${mvVisuals.settingDescription}).
- Color Grading & Atmosphere: ${mvVisuals.colorGradingAndAtmosphere} (${mvVisuals.songColorPalette}).
- Motifs: ${mvVisuals.keyVisualMotifs?.join(', ') || 'Cinematic atmosphere'}.

CRITICAL IDENTITY MANDATE — ZERO WEIRD FACES:
- This shot features strictly ${featuredNames} from ${groupName}.
- NO RANDOM STRANGERS, NO WEIRD MORPHED FACES, NO GENERIC FACES.
- The face and signature hairstyle of each featured idol MUST match their attached official reference portrait with pristine photorealistic commercial quality.

FEATURED MEMBER SPECIFICATIONS:
${memberDescriptions}`;

  return { prompt, featuredMemberProfiles: featured };
}

// Dedicated AI generation function to regenerate a member-accurate 4-scene storyboard sequence
export async function generateAiStoryboardSequence(
  track: Track,
  groupProfile: GroupProfileData,
  members: MemberProfileData[],
  mvVisuals: TrackMvVisuals,
  userNotes?: string
): Promise<StoryboardScene[]> {
  const membersList = members.map((m, i) => `${i + 1}. ${m.stageName} (Gender: ${m.gender || 'Unknown'}, Roles: ${m.positions?.join(', ') || 'Member'})`).join('\n') || groupProfile.groupName;

  const prompt = `You are an elite K-pop Music Video Director & Screenwriter.
Create an authentic, cinematic, member-accurate 4-SCENE STORYBOARD SEQUENCE for the official music video of "${track.title}" by "${groupName}".

MV SETTING & WORLD:
- Setting Location: ${mvVisuals.settingName}
- Environment Description: ${mvVisuals.settingDescription}
- Color Grading & Mood: ${mvVisuals.colorGradingAndAtmosphere} (${mvVisuals.songColorPalette || ''})
- Fashion Style: ${mvVisuals.fashionStyle || 'Designer K-pop fashion'}
- Cinematic Vibe: ${mvVisuals.cinematicVibe}
- Key Motifs: ${mvVisuals.keyVisualMotifs?.join(', ') || ''}

TRACK CONTEXT:
- Title: "${track.title}" (${track.role})
- Meaning & Narrative Theme: "${track.meaning || track.description || ''}"
- Musical Sound & Vibe: "${track.musicStylePrompt || track.genre || ''}"
${track.fullLyricsEnglish ? `- Lyrics Meaning: "${track.fullLyricsEnglish.slice(0, 300)}..."` : ''}
${userNotes ? `- Directorial Guidance: "${userNotes}"` : ''}

OFFICIAL GROUP MEMBERS (YOU MUST FEATURE THESE EXACT MEMBERS):
${membersList}

MANDATORY RULES:
1. NO MAKING STUFF UP / NO GENERIC PLACEHOLDERS: Every single scene MUST explicitly feature real members from the list above by their EXACT stage names!
2. DISTINCT ROLES:
   - Scene 1 (0:00 - 0:30): World intro / hook featuring a specific member's solo or dramatic visual opening.
   - Scene 2 (0:45 - 1:15): High-energy chorus choreography featuring all members in synchronized performance in the main set.
   - Scene 3 (1:40 - 2:15): Narrative climax / emotional bridge featuring 1 or 2 specific members acting out the emotional tension of the lyrics.
   - Scene 4 (2:35 - End): Explosive grand finale & iconic ending pose with all members.
3. ACCURATE JSON OUTPUT:
Return ONLY a JSON array with exactly 4 scene objects:
[
  {
    "timestamp": "0:00 - 0:28",
    "title": "Scene title with member name (e.g. 'Atmospheric Intro: [Member] Solo Hook')",
    "featuredMembers": ["Exact stage name of member(s) in this scene"],
    "visualAction": "Vivid, cinematic description of what the member(s) are doing, their emotional delivery, camera motion, and set interaction"
  }
]`;

  try {
    const { data } = await generateKpopGroupData<StoryboardScene[]>(prompt);
    if (Array.isArray(data) && data.length > 0) {
      return data.slice(0, 4);
    }
  } catch (err) {
    console.warn("AI Storyboard generation failed, generating fallback member-accurate storyboard:", err);
  }

  // Fallback member-accurate storyboard:
  const allNames = members.map(m => m.stageName);
  const m1 = members[0]?.stageName || groupProfile.groupName;
  const m2 = members[1]?.stageName || members[0]?.stageName || m1;
  const m3 = members[2]?.stageName || members[0]?.stageName || m1;
  const groupStr = allNames.length > 0 ? allNames.join(', ') : groupProfile.groupName;

  return [
    {
      timestamp: "0:00 - 0:28",
      title: `Atmospheric Intro: ${m1} Solo Hook`,
      featuredMembers: members.length > 0 ? [m1] : [groupProfile.groupName],
      visualAction: `Cinematic wide-to-medium camera push revealing ${m1} inside ${mvVisuals.settingName}. ${m1} delivers the opening vocal lines under dramatic ${mvVisuals.colorGradingAndAtmosphere}, dressed in tailored ${mvVisuals.fashionStyle || 'K-pop'} stage styling.`
    },
    {
      timestamp: "0:45 - 1:15",
      title: "First Chorus: Full Group Center Choreography",
      featuredMembers: allNames.length > 0 ? allNames : [groupProfile.groupName],
      visualAction: `Dynamic wide anamorphic framing as all members (${groupStr}) hit the synchronized main chorus point-dance in the center of ${mvVisuals.settingName}, their coordinated 3-color outfits (${mvVisuals.songColorPalette || ''}) popping with rhythmic camera cuts.`
    },
    {
      timestamp: "1:40 - 2:10",
      title: `Narrative Bridge: ${m2} & ${m3} Dramatic Vocal Duet`,
      featuredMembers: members.length > 1 ? [m2, m3] : [m1],
      visualAction: `Intimate split-field and tracking shots following ${members.length > 1 ? `${m2} and ${m3}` : m1} through the architectural set, capturing emotional expressions and raw vocal intensity as the song builds to its peak.`
    },
    {
      timestamp: "2:35 - Outro",
      title: "Climax & Grand Finale Formation",
      featuredMembers: allNames.length > 0 ? allNames : [groupProfile.groupName],
      visualAction: `Dramatic 360-degree orbital crane shot as ${groupStr} unite for the explosive climax and final freeze-frame silhouette pose against the sweeping background horizon of ${mvVisuals.settingName}.`
    }
  ];
}

// Builds Individual Full-Body Member Lookbook Prompt
// STRICTLY ENFORCES FACE & HAIRSTYLE PRESERVATION FROM LINEUP PROFILE PHOTO
export function buildMemberTrackOutfitPrompt(
  member: MemberProfileData,
  outfit: MemberConceptOutfit,
  trackTitle: string,
  groupName: string,
  settingName?: string,
  fashionStyle?: string,
  threeColorPalette?: [string, string, string] | string[],
  mainStyle?: string,
  secondaryStyle?: string,
  conceptVibe?: string
): string {
  const genderStr = (member.gender || '').toLowerCase() === 'male' ? 'male K-pop idol' : 'female K-pop idol';
  const hairStyle = member.currentHairStyle || member.originalHairType || 'Signature hairstyle';
  const hairColor = member.dyedHairColor || member.originalHairColor || 'Signature hair color';
  const resolvedMain = mainStyle || outfit.mainStyle || fashionStyle || outfit.fashionStyle || 'Casual';
  const resolvedSecondary = secondaryStyle || outfit.secondaryStyle;
  const resolvedConcept = conceptVibe || outfit.conceptVibe;
  const formulaStr = outfit.stylingFormula || buildKpopOutfitFormula(resolvedMain, resolvedSecondary, resolvedConcept);
  const colorStr = (threeColorPalette && threeColorPalette.length === 3)
    ? `${threeColorPalette[0]}, ${threeColorPalette[1]}, and ${threeColorPalette[2]}`
    : outfit.colorPalette;

  return `Award-winning commercial photography: Full-body 3:4 individual fashion photoshoot of K-pop idol "${member.stageName}" from "${groupName}" for the official music video "${trackTitle}".

CRITICAL MANDATE: PRESERVE EXACT FACE AND HAIRSTYLE FROM REFERENCE PHOTO:
- EXACT MEMBER IDENTITY: The idol in this photo MUST be "${member.stageName}" (${member.fullNameKorean ? `Korean: ${member.fullNameKorean}` : ''}), authentic ${member.race || 'East Asian'} ${genderStr}.
- AUTHENTIC FACIAL FEATURES & SKIN TONE: Natural skin tone: ${member.skinTone || 'fair radiant skin'}, Eye color: ${member.eyeColor || 'dark brown'}, Signature facial characteristics: "${member.distinctFacialFeatures || 'defined cheekbones, elegant jawline, and youthful idol facial harmony'}".
- ZERO WEIRD OR DISTORTED FACES: Under NO circumstances should their face look weird, melted, unfamiliar, or distorted. Match their eyelid shape, eye spacing, nose bridge, lip contours, and jawline strictly to the attached reference portrait!
- CRISP FACIAL DEFINITION IN FULL-BODY SHOT: In this full-body head-to-toe lookbook shot, their face must remain ultra-sharp and recognizable as their authentic self with natural skin texture and clear pupils.
- KEEP EXACT HAIRSTYLE & HAIR COLOR: Replicate their exact signature hairstyle (${hairStyle}) and hair color (${hairColor}) from their reference photo! DO NOT change their haircut, DO NOT change their hair length, and DO NOT dye their hair a different color. Keep their authentic hairstyle identical to the reference picture!

CRITICAL MANDATE — ABSOLUTE PROHIBITION ON WORKWEAR, SUITING & "OLD PEOPLE" CLOTHES (REMEMBER THESE ARE YOUNG K-POP IDOLS!):
- STRICTLY NO WORKWEAR OR SUITS: Absolutely NO corporate blazers, NO business suits, NO suiting vests/waistcoats, NO dress trousers, NO pressed office slacks, NO corporate chinos, NO button-down office shirts with ties, and NO grandma/grandpa knitted vests!
- STRICTLY NO OLD-FASHIONED FORMAL FOOTWEAR: Absolutely NO dress loafers, NO penny loafers, NO formal oxfords, NO brogues, NO derbies, NO corporate court shoes, and NO dress mules!
- AUTHENTIC YOUTHFUL K-POP IDOL CASUAL: "${member.stageName}" is a young, stylish K-pop idol! They wear a youthful, fresh, trendy idol casual outfit (e.g. oversized graphic hoodie, cropped zip hoodie, boxy cropped denim trucker jacket, varsity bomber jacket, fitted baby tee, ribbed tank, baggy skater denim, relaxed wide-leg washed cargo denim, pleated denim or casual tennis mini-skort, and fresh designer platform sneakers with athletic socks).

CRITICAL MANDATE — ABSOLUTE PROHIBITION ON WEIRD, CLOWNISH, OR COSTUMEY OUTFITS:
- STRICTLY NO skirts layered over pants or trousers! A member wears EITHER pants OR a skirt/skort, NEVER a skirt over pants.
- STRICTLY NO sheer ruffled tulle slips or tutus worn over pants.
- STRICTLY NO split two-tone patchwork clown jackets (no half-houndstooth half-satin jackets, no mismatched split fabrics).
- STRICTLY NO shiny tin-foil or metallic foil space pants.
- STRICTLY NO clogs, wooden soles, pacifiers, fairy wings, or cartoon costumes.
- Outfits MUST be authentic, fresh, stylish, wearable K-Pop idol stage and off-duty fashion (oversized graphic hoodies, cropped zip jackets, varsity bombers, baby tees, relaxed baggy vintage-wash skater denim, casual denim/tennis mini-skorts, and fresh designer platform sneakers with athletic socks) as seen on premier Seoul music shows.

ABSOLUTE PROHIBITION ON TECHWEAR:
- NEVER DO TECHWEAR OR ANYTHING RELATED TO IT: Absolutely NO techwear, NO tactical gear, NO tactical vests, NO utility harnesses, NO chest rigs, NO multi-strap buckles, NO tactical pouches, NO combat gear, NO ripstop nylon cargo tactical suits, and NO dystopian military straps. All styling must be authentic, stylish, high-fashion K-pop stage clothing, strictly avoiding techwear.

K-POP STYLING CONCEPT FORMULA & 3-COLOR HARMONY:
- Outfit Formula: "${formulaStr}"
  * Main Fashion Style: ${resolvedMain} (foundational silhouette, garment cuts, and tailoring)
  * Secondary Aesthetic Layer: ${resolvedSecondary || 'High-Fashion Editorial contrast'} (accents, layering, textures)
  * Concept Attitude Lens: ${resolvedConcept || 'Charismatic star presence'} (expression, swagger, stage charisma)
- Harmonious 3-Color Scheme: "${colorStr}" (Dynamic three-color balance so the outfit looks vibrant, stylish, and never boring).
- Member Outfit Title: "${outfit.outfitTitle}".
- Outfit Description: ${outfit.clothingDetails}.
- Signature Accessories: ${outfit.keyAccessories?.join(', ') || 'Styled accessories in the 3-color scheme'}.
- Stage Vibe & Charisma: ${outfit.visualVibe}.

FULL-BODY FRAMING & SETTING:
- 100% Full-length head-to-toe shot standing in "${settingName || 'the MV setting'}", showing their full silhouette, outfit, and footwear completely.
- Absolutely NO cropping of feet or shoes.
- Shot on Hasselblad H6D-100c, 85mm portrait lens, professional editorial fashion studio lighting, crisp 8k photorealistic quality.`;
}


