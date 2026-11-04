// Comprehensive list of notorious AI clichés, overused tropes, and robotic filler words
export const BANNED_AI_WORDS = [
  // 1. Light & Visual AI clichés (specifically blocked by user request)
  'neon', 'neon lights', 'city lights', 'shadow', 'shadows', 'shadowy', 'silhouette', 'silhouettes',
  'in the shadows', 'in the dark', 'darkness', 'moonlight', 'starlight', 'sunlight', 'twilight',
  'dawn', 'new dawn', 'glow', 'glowing', 'radiance', 'gleam', 'beam', 'shine', 'shining',
  'illuminate', 'kaleidoscope', 'mirage', 'reflection', 'mirror', 'mirrors', 'glimmer',

  // 2. Line & Boundary AI clichés (specifically blocked by user request)
  'crossing the line', 'cross the line', 'thin line', 'blurred line', 'blurred lines',
  'draw the line', 'drawn the line', 'on the line', 'holding the line', 'walk the line',
  'step out of line', 'line in the sand', 'borderline',

  // 3. Fire & Heat overused metaphors
  'ignite', 'spark', 'sparks', 'flame', 'flames', 'fire in my soul', 'blaze', 'blazing',
  'ashes', 'ember', 'embers', 'burn bright', 'burning bright', 'burn within',

  // 4. Whisper, Echo & Sound tropes
  'whisper', 'whispers', 'whispering', 'whispered', 'echo', 'echoes', 'echoing',
  'pulse of my heart', 'rhythm of my heart', 'beat of my heart', 'heartbeat racing',

  // 5. Abstract & Cosmic tropes
  'destiny', 'eternity', 'eternal', 'infinite', 'infinity', 'boundless', 'fate', 'fated',
  'written in the stars', 'written in stone', 'soul', 'souls', 'universe', 'cosmos', 'galaxy',
  'constellation', 'abyss', 'symphony', 'tapestry', 'labyrinth', 'enigma', 'ethereal',
  'celestial', 'unfold', 'transcend',

  // 6. Flying / Wing tropes
  'soar', 'soaring', 'fly high', 'take flight', 'broken wings', 'spread my wings',
  'wings', 'flying high',

  // 7. Shattering / Glass tropes
  'shatter', 'shattered', 'shattering', 'broken glass',

  // 8. Security / Mystery / AI tropes
  'velvet', 'velvet rope', 'perimeter', 'sécurité', 'securite', 'locked gate',
  'unlock the gate', 'unlocking the gate', 'key to my heart', 'illusion', 'spellbound',
  'magic spell', 'anthem',

  // 9. Cyber / Sci-fi slop in lyrics
  'matrix', 'glitch', 'glitching', 'cyber', 'digital', 'dimension', 'simulation',
  'hologram', 'protocol', 'database', 'download', 'algorithm', 'circuit',

  // 10. Generic Empowerment Clichés
  'break the chains', 'breaking chains', 'break the rules', 'breaking the rules',
  'unstoppable', 'invincible', 'limitless', 'no limits', 'unleash', 'unleashed', 'rise up', 'we rise',

  // 11. Empty academic / robotic filler / essay words
  'beacon', 'testament', 'unwavering', 'delve', 'deep dive', 'cacophony', 'intertwined',
  'furthermore', 'consequently', 'endeavor', 'manifestation', 'in order to', 'nevertheless',

  // 12. Generic Verse 1 Filler & Amateur Openings
  'walking in the room', 'walking in the dark', 'walking into the room', 'looking in the mirror',
  'look in the mirror', 'staring at the mirror', 'clock is ticking', 'the clock is ticking',
  'tick tock goes the clock', 'tick tock on the clock', 'sun goes down', 'when the sun goes down',
  'wake up in the morning', 'waking up in the morning', 'lying in my bed', 'sitting in my room',
  'in the dead of night', 'lost in my thoughts', 'lost in the sound',

  // 13. Preachy / Lesson-like / Moralizing / Essay Cliches (Banned per user request)
  'we must learn', 'teach you a lesson', 'listen to the lesson', 'learn to love ourselves',
  'stand tall and never give up', 'never give up your dreams', 'the world tries to break us',
  'find our inner light', 'together we will heal', 'show them who we are inside',
  'we can conquer the pain', 'find the light within', 'teach the world', 'learn to rise',
  'rise above the storm', 'journey of our hearts', 'believe in the future', 'guide our way',
  'break our spirit', 'heal the world', 'find our way together', 'stand united',
  'never lose your hope', 'listen to the truth', 'i begin to understand', 'we will overcome the pain',
  'discover our true selves', 'embrace the truth', 'illuminate the path',

  // 14. Nonsensical / Forced Onomatopoeia (Banned per user request)
  'ppappappa', 'tik-tak', 'ratata', 'ratatat', 'beep-beep', 'vroom vroom', 'skrrt skrrt', 'zoom zoom',

  // 15. Fake Specificity AI Tropes & Timestamps (Banned per user request: "using stff like 2am when trying to be specifi but it sound ai")
  '2 am', '2:00 am', '2:15 am', '2:30 am', '2am', '3 am', '3:00 am', '3:14 am', '3:30 am', '3am',
  '4 am', '4:12 am', '4:30 am', '4am', '5 am', '5am', '8:45 am',
  'read receipt', 'read at 2', 'read at 3', 'read at 4', 'left on read at',
  'staring at my screen', 'starin at my screen', 'staring at the screen', 'starin at the screen',
  'staring at my phone', 'staring at the ceiling', 'starin at the ceiling', 'blue light on the ceiling',
  'reflection in the microwave', 'microwave door'
];

// Regex builder for standalone word matches to avoid false positives on valid substrings
const BANNED_WORD_REGEXES = [
  /\bneon\b/i,
  /\bshadows?\b/i,
  /\bsilhouettes?\b/i,
  /\bignite\b/i,
  /\bsparks?\b/i,
  /\bflames?\b/i,
  /\bblaze\b/i,
  /\bblazing\b/i,
  /\bwhispers?\b/i,
  /\bwhispering\b/i,
  /\bechoes?\b/i,
  /\bechoing\b/i,
  /\bdestiny\b/i,
  /\beternity\b/i,
  /\beternal\b/i,
  /\binfinite\b/i,
  /\binfinity\b/i,
  /\bboundless\b/i,
  /\bshatters?\b/i,
  /\bshattered\b/i,
  /\billuminate\b/i,
  /\bsoars?\b/i,
  /\bsoaring\b/i,
  /\blabyrinth\b/i,
  /\bethereal\b/i,
  /\bcelestial\b/i,
  /\babyss\b/i,
  /\bvelvet\b/i,
  /\bperimeter\b/i,
  /\bsécurité\b/i,
  /\bsecurite\b/i,
  /\bglitch\b/i,
  /\bmatrix\b/i,
  /\bdigital\b/i,
  /\bcyber\b/i,
  /\bhologram\b/i,
  /\bsimulation\b/i,
  /\btapestry\b/i,
  /\bkaleidoscope\b/i,
  /\bunfold\b/i,
  /\bcosmos\b/i,
  /\bconstellation\b/i,
  /\bppappappa\b/i,
  /\btik-tak\b/i,
  /\bratata\b/i,
  // Fake specificity timestamps & screen tropes:
  /\b[1-5]\s*(?:am|pm)\b/i,
  /\b([1-9]|1[0-2]):[0-5][0-9]\s*(?:am|pm)\b/i,
  /\b(?:staring|starin'?)\s+at\s+(?:my\s+|the\s+)?(?:screen|phone|ceiling)\b/i,
  /\bread\s+at\s+\d/i,
  /\bread\s+receipt\b/i
];

export const checkCringeLyrics = (lyrics: string): { isCringe: boolean; reason?: string } => {
  if (!lyrics) return { isCringe: false };
  
  const lower = lyrics.toLowerCase();

  // 1. Check exact regex matches for high-frequency AI words and fake timestamps
  for (const regex of BANNED_WORD_REGEXES) {
    const match = lower.match(regex);
    if (match) {
      console.warn(`Lyric Quality Check Failed: Found banned word/pattern '${match[0]}'`);
      return { isCringe: true, reason: `Contains banned word/pattern: "${match[0]}"` };
    }
  }

  // 2. Check multi-word cliché phrases
  for (const phrase of BANNED_AI_WORDS) {
    if (phrase.includes(' ') && lower.includes(phrase)) {
      console.warn(`Lyric Quality Check Failed: Found banned cliché phrase '${phrase}'`);
      return { isCringe: true, reason: `Contains banned cliché phrase: "${phrase}"` };
    }
  }

  // 3. Check specific "line" clichés specifically requested by user
  const lineCliches = [
    'crossing the line', 'cross the line', 'thin line', 'blurred line', 'blurred lines',
    'draw the line', 'drawn the line', 'walk the line', 'step out of line', 'hold the line',
    'touch the line', 'every line'
  ];
  for (const lc of lineCliches) {
    if (lower.includes(lc)) {
      console.warn(`Lyric Quality Check Failed: Found banned line cliché '${lc}'`);
      return { isCringe: true, reason: `Contains banned line cliché: "${lc}"` };
    }
  }

  // 4. Check for run-on essay sentences (lyrics must be punchy, rhythmic fragments, not long rambling prose)
  const lines = lyrics.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('[') || trimmed.startsWith('(')) continue;
    if (trimmed.length > 130 || trimmed.split(/\s+/).length > 24) {
      console.warn(`Lyric Quality Check Failed: Line is too wordy/essay-like: "${trimmed.slice(0, 45)}..."`);
      return { isCringe: true, reason: `Line is too wordy and lacks pop rhythm/meter: "${trimmed.slice(0, 45)}..."` };
    }
  }

  return { isCringe: false };
};

export const hasCringeLyrics = (lyrics: string): boolean => {
  return checkCringeLyrics(lyrics).isCringe;
};

export const checkSoloistLyricViolations = (
  lyrics: string,
  artistGender?: 'Female' | 'Male'
): { hasViolation: boolean; reason?: string } => {
  if (!lyrics) return { hasViolation: false };
  const lower = lyrics.toLowerCase();

  // 1. Group member role tags
  const groupTagRegex = /\[(all|members|group|leader|sub-?vocal|main vocal|lead vocal|main rapper|lead rapper|center|visual)[^\]]*\]/i;
  const tagMatch = lyrics.match(groupTagRegex);
  if (tagMatch) {
    console.warn(`Soloist Lyric Check Failed: Found group member performance tag '${tagMatch[0]}'`);
    return { hasViolation: true, reason: `Soloist lyrics contain group member performance tag: "${tagMatch[0]}"` };
  }

  // 2. Gang chant / unison / chorus all indicators
  if (
    lower.includes('[all]') || 
    lower.includes('[all -') || 
    lower.includes('[all:') ||
    lower.includes('[gang chant') || 
    lower.includes('[stadium roar') || 
    lower.includes('[group unison')
  ) {
    console.warn("Soloist Lyric Check Failed: Found group unison / gang chant tag.");
    return { hasViolation: true, reason: "Soloist lyrics contain group unison / gang chant tag." };
  }

  // 3. Collective group pronouns / phrases in narrative
  const collectivePhrases = [
    'our group', 'our team', 'our band', 'all our members', 'the members', 'each member',
    'brotherhood of ours', 'sisterhood of our group', 'together as a group'
  ];
  for (const phrase of collectivePhrases) {
    if (lower.includes(phrase)) {
      console.warn(`Soloist Lyric Check Failed: Found collective group reference '${phrase}'`);
      return { hasViolation: true, reason: `Soloist lyrics contain collective group reference: "${phrase}"` };
    }
  }

  // 4. Gender mismatches for soloists
  if (artistGender === 'Female') {
    if (/\b(i'm the man|i am the man|i am the boy|i'm a king)\b/i.test(lower)) {
      console.warn("Soloist Lyric Check Failed: Female soloist lyrics contain mismatched masculine self-reference.");
      return { hasViolation: true, reason: "Female soloist lyrics contain mismatched masculine self-reference." };
    }
  } else if (artistGender === 'Male') {
    if (/\b(i'm the girl|i am the girl|i'm a queen|i am a queen|i'm that girl)\b/i.test(lower)) {
      console.warn("Soloist Lyric Check Failed: Male soloist lyrics contain mismatched feminine self-reference.");
      return { hasViolation: true, reason: "Male soloist lyrics contain mismatched feminine self-reference." };
    }
  }

  return { hasViolation: false };
};

export const hasSoloistLyricViolations = (lyrics: string, artistGender?: 'Female' | 'Male'): boolean => {
  return checkSoloistLyricViolations(lyrics, artistGender).hasViolation;
};

export const SOLOIST_LYRIC_RETRY_PROMPT = `
CRITICAL SOLO ARTIST LYRIC RE-GENERATION MANDATE:
Your previous lyrics contained GROUP member tags, plural group pronouns, fake timestamp clichés, incoherent thoughts, or lacked catchiness.
This song is performed entirely by a SOLO ARTIST. 

YOU MUST RE-GENERATE THE LYRICS FOLLOWING THESE STRICT MANDATES:
1. STRICT SINGULAR 1ST-PERSON PERSPECTIVE:
   - Use exclusively "I", "me", "my", "mine". 
   - NEVER use collective group plurals ("we", "us", "our group", "our team", "together we stand") unless directly addressing "you and I" as a couple.
2. ZERO GROUP MEMBER TAGS OR REFERENCES:
   - Strictly NO "[All]", "[Members]", "[Group]", "[Leader]", "[Center]", "[Sub-Vocal]", "[Main Vocal]", "[Lead Vocal]", or "[Main Rapper]".
   - The solo artist carries the ENTIRE song, including all verses, pre-choruses, choruses, rap, high notes, and ad-libs.
   - Tag sections using the artist's name or solo delivery style (e.g. [Intro: Breathy Low-Register Hook], [Chorus: Soaring Melodic Hook with Self-Harmonies], [Verse 2: Crisp Syncopated Pocket Rap], [Bridge: Climactic Vocal Belt]).
3. GENDER-AUTHENTIC PRONOUNS & PERSPECTIVE:
   - Strictly adhere to the individual artist's gender and perspective.
   - For Female Soloist: She / Her / Hers identity ("I'm that girl", "queen"). Address romantic interest or listener as "he", "him", "boy", or "you".
   - For Male Soloist: He / Him / His identity ("I'm that man", "king"). Address romantic interest or listener as "she", "her", "girl", or "you".
4. COMPLETE NARRATIVE SENSE & COHERENCE:
   - The lyrics must make 100% logical and emotional sense from start to finish.
   - Every line must naturally flow into the next line. NO disconnected non-sequiturs or random word salads.
   - Both Korean and English lines must be grammatically complete and meaningful.
5. STRICT BAN ON FAKE SPECIFICITY & TIMESTAMPS:
   - Absolutely NO "2 AM", "3 AM", "4 AM", "midnight", "staring at the screen/phone/ceiling", "read receipts", "blue light".
   - Ground specificity in real dialogue, relational tension, concrete physical reactions, and emotional stakes.
6. ULTRA-CATCHY EARWORM CHORUS:
   - Keep the hook tight (2 to 4 lines), rhythmically infectious, and stuck in the listener's head.
   - Balanced syllable counts (6-9 syllables per line) so lines bounce on the beat.
   - Center on attitude, title hook repetition (Rule of 3), syncopated bounce, and singable open vowels.
   - ZERO moral lessons, preaching, or philosophical lectures.
7. BAN ALL AI CLICHÉS:
   - Strictly NO 'neon', 'shadow', 'line', 'velvet', 'whisper', 'destiny', 'spark', 'flame', 'echo', 'shatter', 'soar', 'wings', 'matrix', 'glitch'.
`;

export const LYRIC_RETRY_PROMPT = `
CRITICAL LYRIC QUALITY CHECK FAILED. 
Your previous lyrics contained overused AI clichés, fake timestamp tropes (e.g. 2 AM/3 AM), rambling essay sentences, disjointed nonsense, or lacked catchiness.

YOU MUST RE-GENERATE THE LYRICS FOLLOWING THESE STRICT SONGWRITING RULES:
1. COMPLETE NARRATIVE SENSE & STORYLINE COHERENCE:
   - The lyrics must make 100% logical, narrative, and emotional sense!
   - Every line must naturally connect to and build upon the line before it. NO random disconnected buzzwords.
   - Both Korean and English lines must be grammatically sound and form complete, meaningful musical thoughts.
2. STRICT BAN ON FAKE SPECIFICITY & TIMESTAMPS:
   - Absolutely NO "2 AM", "3 AM", "4 AM", "midnight", "staring at the screen/phone/ceiling", "read receipts", "blue light".
   - Create authentic specificity through real conversations, body language, relational friction, and vivid sensory moments.
3. ULTRA-CATCHY, BALANCED SYLLABLE METER & EARWORM HOOKS:
   - Real hit songs have tight rhythmic cadence! Keep lines to 6 to 9 syllables so they bounce with groove and can be sung aloud.
   - The chorus must be an instant earworm: repeat the title/hook motif with syncopated rhythm, memorable bounce, and open vowels.
   - ZERO run-on prose or long explanatory sentences.
   - ABSOLUTELY NO MORAL LESSONS or philosophical lectures (NO "we must learn", "stand tall and overcome", "the world tries to break us").
4. BAN NONSENSICAL ONOMATOPOEIA:
   - Strictly NO forced sound effects (e.g. 'tik-tak', 'ppappappa', 'ratata', 'beep-beep', 'vroom', 'skrrt').
5. CASUAL, GROUNDED VERSES:
   - Verses must be effortless, modern, and relatable. Establish the groove and smoothly build tension into the Pre-Chorus.
6. HIGH-TIER RAP FLOW:
   - Deliver authentic pocket rhythm, syncopated multisyllabic rhymes, witty punchlines, and swagger (inspired by Soyeon, Changbin, Mark, Jennie, Bobby).
7. BAN ALL AI CLICHÉS:
   - Strictly NO 'neon', 'shadow', 'line', 'velvet', 'whisper', 'destiny', 'spark', 'flame', 'echo', 'shatter', 'soar', 'wings', 'matrix', 'glitch'.
`;
