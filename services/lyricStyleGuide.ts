export const LYRIC_TROPE_CLUSTERS = [
  {
    name: "The Relatable Diary / Anti-Drop Hook (The 'Cupid' Effect)",
    description: "Casual, vulnerable, diary-like confessions with a deadpan, conversational hook. Focuses on relatable human flaws (feeling clumsy, overthinking, second-guessing) rather than untouchable perfection.",
    examples: [
      "FIFTY FIFTY - Cupid: 'I gave a second chance to Cupid / But now I'm left here feelin' stupid... Cupid is so dumb'",
      "NewJeans - OMG: 'Oh my oh my God, 예상했어 나 / I was really hoping that he will come through'"
    ],
    themes: ["Relatable", "Self-Deprecating", "Conversational", "Vulnerable", "Deadpan"]
  },
  {
    name: "Bad Desire / Intense Friction",
    description: "The sharp, magnetic pull to someone or something unpredictable. It's about obsession, tension in the room, and yielding to temptation.",
    examples: [
      "TAEMIN - Move: Sensual, hypnotic, focused on subtle physical tension.",
      "Red Velvet - Psycho: A relationship that looks chaotic to outsiders but feels right to them."
    ],
    themes: ["Obsession", "Tension", "Irresistible", "Temptation", "Friction"]
  },
  {
    name: "Unbothered / High-Fashion Attitude",
    description: "Cold, chic confidence. It's not about yelling 'I am the best', it's about not caring what critics think, brushing off noise, and looking sharp.",
    examples: [
      "LE SSERAFIM - Spaghetti: '(Woo) Ippal sai kkin spaghetti / Ppaego simni? Bon appétit / Geunyang pogihae eochapi / Eat it up, eat it, eat it up'",
      "BLACKPINK - Shut Down: Effortlessly shutting down critics with success.",
      "KISS OF LIFE - Midas Touch: 'Making everybody go, Who is she?'"
    ],
    themes: ["Unbothered", "Chic", "Confidence", "Dismissive", "Sharp"]
  },
  {
    name: "Identity Play / The Alter Ego",
    description: "Exploring different sides of oneself, stepping into a bolder persona, or turning the spotlight onto a new identity.",
    examples: [
      "aespa - Drama: 'I'm the drama... I break trauma... I'm the main character, styling the play'",
      "Stray Kids - MANIAC: 'Maniac, going crazy, like I have a loose screw'",
      "ITZY - DALLA DALLA: 'I love myself! Something's different about me, yeah'"
    ],
    themes: ["Alter Ego", "Main Character", "Hidden Self", "Bold Persona", "Unapologetic"]
  },
  {
    name: "Chaotic Youth / Nostalgia",
    description: "The restless, bittersweet energy of youth. Sneaking out, making mistakes, moving fast, but feeling close to friends.",
    examples: [
      "TXT - 0X1=LOVESONG: Emo-rock energy, finding grounding in one person amid chaos.",
      "NCT DREAM - We Go Up: The restless momentum of moving forward and chasing thrills.",
      "NewJeans - Ditto: Nostalgic, slightly bittersweet, missing the warmth of a specific moment in youth."
    ],
    themes: ["Restless", "Nostalgia", "Bittersweet", "Defiance", "Fast-Paced"]
  },
  {
    name: "The Sudden Attraction / Inexplicable Reaction",
    description: "The exact moment you realize you're falling for someone, the confusion, the denial, the magnetic draw.",
    examples: [
      "Stray Kids - CASE 143: 'Why do I keep getting attracted? / Jaseok gachi kkeullyeoga / I cannot explain this reaction / Igeotbakke one-four-three'",
      "ILLIT - Magnetic: 'Da-da-da-da-da, magnetic... Can't deny it, you're my type, baby let's ride, yeah...'",
      "TWICE - What is Love?: The naive expectation of love versus the sudden reality of it."
    ],
    themes: ["Confusion", "Magnetic", "Realization", "Denial", "Attraction"]
  }
];

export const TITLE_IN_CHORUS_STRATEGIES = [
  {
    name: "The Rhythmic Title Repetition Hook (Mantra Loop)",
    description: "The title is repeated rhythmically across bars with syncopated bounce and infectious staccato syllable play as the core melodic earworm.",
    pattern: "[Title Staccato Hit] -> [Syncopated Groove Line] -> [Title Repetition Loop] -> [Unison Punchline]",
    examples: [
      "NewJeans - 'Hype Boy': ''Cause I know what you like boy / You're my chemical hype boy'",
      "IVE - 'ELEVEN': 'Nan mollasseo nae mami iri dachaerounji / 1, 2, 3, 4, 5, 6, 7 / You make me feel like eleven'",
      "aespa - 'Supernova': 'Ah-oh, ayy / Nova, can't stop, hyperstellar / Wonchojeok bonneungeul kkaewo, Supernova!'",
      "KISS OF LIFE - 'Sticky': 'Sticky, sticky, sticky, gotta get sticky / Tteugeoun yeoreumbam...'",
      "ILLIT - 'Magnetic': 'Super ikkeullim / You, you, you, you, like it's magnetic / You, you, you, you, super magnetic'",
      "LE SSERAFIM - 'CRAZY': 'All the girls are girling, girling / Da gat-i michyeobolkka? Crazy, crazy, crazy'"
    ]
  },
  {
    name: "The Anti-Drop Spoken/Whispered Title Drop",
    description: "The high-tension build cuts to dead silence. The title is delivered as an unbothered, low-register spoken or whispered killing line just as the heavy 808 sub-bass drops.",
    pattern: "(Build riser cuts to complete silence) -> [Spoken/Whispered Title Killing Line] -> (Heavy 808 Sub-Bass Drops) -> [Staccato Unison Groove Chants]",
    examples: [
      "aespa - 'Next Level': '(Beat cuts to silence) ... I'm on the next level, yeah / Jeoldaejeok rureul jikyeo'",
      "aespa - 'Drama': '(Silence) ... I'm the Drama!'",
      "BLACKPINK - 'Shut Down': 'When the whip stop, you know you can't stop / Keep watching me shut it down'",
      "Stray Kids - 'God's Menu': '(Beat cuts) ... Ige uri tang tang tang tang'",
      "ITZY - 'SNEAKERS': '(Bass cuts) ... Put my sneakers on / Hana dul ready, get set, go!'"
    ]
  },
  {
    name: "The Question & Answer Punchline Anchor",
    description: "The title acts as the climactic question or definitive punchline at the end of each melodic couplet or 2nd bar.",
    pattern: "Line 1: [Lyrical Set-up & Tension] -> Line 2: [Title Question/Punchline Anchor] -> Line 3: [Melodic Counter-Phrase] -> Line 4: [Final Title Payoff]",
    examples: [
      "IVE - 'After LIKE': 'Du beon se beon pigonhage mudji ma / Nae changmunui bicheul balkyeo / What's after LIKE?'",
      "TWICE - 'What is Love?': 'I wanna know sakakhan geotcheoreom / Eotteon neukkiminji / What is love?'",
      "Red Velvet - 'Psycho': 'Uri jinjjja byeolladae / Geunyang joahande... Hey now we'll be okay / Psycho!'"
    ]
  },
  {
    name: "The High-Belt Melodic Climax Title",
    description: "The title is sung at the highest vocal peak/melody apex with full chest voice or soaring falsetto in the second half of the chorus.",
    pattern: "Bars 1-2: [Driving Rhythmic Pre-Build] -> Bar 3: [Main Vocal Soaring High-Belt Title Climax] -> Bar 4: [Rich Multi-Harmonic Resolution]",
    examples: [
      "Taeyeon - 'INVU': 'I-N-V-U / Gidaehaji ana / Neon ije nareul tteona / I-N-V-U'",
      "IU - 'Celebrity': 'Ijji ma neon heurin eodum sai / Oensoneuro geurin byeol hana... You are my celebrity!'",
      "SEVENTEEN - 'Super': 'Machi doen geot gata Sonogong / Run, run, run, run / We don't stop, sonogong!'",
      "BTS - 'Spring Day': 'Bogo sipda / Bogo sipda / Eolmana gidaryeoya... Bogosipda'"
    ]
  },
  {
    name: "The Chanted Stadium Gang Call-and-Response Title",
    description: "Solo prompt line followed by the entire group shouting the song title in unison accompanied by heavy brass stabs or drum hits.",
    pattern: "[Leader/Center Solo Call Line] -> [All Stadium Gang Shout: (Title!)] -> [Rapper Counter-Response] -> [All Unison Title Drop]",
    examples: [
      "Stray Kids - 'S-Class': 'Special, swerving on the road / (S-Class!) / Uriga mandeun road'",
      "ATEEZ - 'BOUNCY': 'Slow it down, make it bouncy! / Jigeum buteo sijakhae / Cheongyang gochu Vibe!'",
      "NCT 127 - 'Kick It': 'Pugilist in the ring / (Kick it!) / Enter the dragon, now we burn it!'",
      "ENHYPEN - 'Bite Me': 'Just come kiss me and bite me / Oh my, oh my God / This blood is on my hand'"
    ]
  },
  {
    name: "The Seamless Lyrical Infiltration (Concealed Double-Meaning Title)",
    description: "The title is woven organically into a flowing conversational sentence instead of being isolated as a slogan.",
    pattern: "Lines 1-4: [Natural conversational phrasing where the title phrase appears smoothly as the grammatical object or action, carrying double meaning]",
    examples: [
      "IVE - 'Love Dive': 'Narcissistic, my god I love it / Seororeul bichun bam / Sumchamgo love dive'",
      "LE SSERAFIM - 'Perfect Night': 'Tonight I don't care what's wrong or right / Don't start thinking, go with the groove / Having a perfect night'",
      "Red Velvet - 'Feel My Rhythm': 'Feel my rhythm, come with me / Sangsanghae bwa mwodeunji / Pulkkoccheoreom peojineun festival'"
    ]
  },
  {
    name: "The Post-Chorus Stutter / Beat Chop Title",
    description: "The main melodic chorus resolves, and the post-chorus chops, stutters, or spells out the title rhythmically over a dance break beat.",
    pattern: "[Melodic Chorus 4 Bars] -> [Post-Chorus Dance Drop: Stuttered/Chopped Title Cadence Loop]",
    examples: [
      "(G)I-DLE - 'Queencard': 'I'm a Queencard, I'm a Queencard / I'm a, I'm a, I'm a Queencard / Take a photo!'",
      "(G)I-DLE - 'TOMBOY': 'It's neither man nor woman / Just me, I'm a tomboy'",
      "ITZY - 'WANNABE': 'I wanna be me, me, me / Ttakhi namui siseon ttawin sanggwan eopseo / I wanna be me, me, me'",
      "RIIZE - 'Get A Guitar': 'Geu sonkkeuteuro jabeun line / Listen to the beat, get a guitar / Baby, get a guitar'",
      "TWS - 'Plot Twist': 'Cheot mannameun neomu eoryeowo / Gyehoekdaero doeneun ge eopseoseo / Plot twist!'"
    ]
  }
];

export const isSoloArtistType = (groupType?: string, memberCount?: number): boolean => {
  if (memberCount === 1) return true;
  if (!groupType) return false;
  const t = groupType.toLowerCase();
  return t.includes('soloist') || t.includes('solo') || t === 'issolo';
};

export const SOLO_TITLE_IN_CHORUS_STRATEGIES = [
  {
    name: "The Rhythmic Title Repetition Earworm (Solo Mantra Loop)",
    description: "The title is repeated rhythmically across bars with syncopated bounce, infectious staccato syllable play, and multi-tracked self-harmonies by the solo artist.",
    pattern: "[Title Staccato Hit] -> [Syncopated Solo Groove Line] -> [Title Repetition Loop] -> [Soloist Punchline Tag]",
    examples: [
      "Jennie - 'SOLO': 'Bichi naneun solo / I'm going solo-lo-lo-lo-lo / Bichi naneun solo / I'm going solo-lo-lo-lo-lo'",
      "Taemin - 'Guilty': 'You got me feeling so guilty / Gwireul magado deullyeowa / You make me guilty, guilty'",
      "Nayeon - 'POP!': 'Pop, pop, pop, you want it / Pop, pop, pop, teojigil wonhae / Gaseumi ttwieo pop, pop!'",
      "Sunmi - 'Gashina': 'Wae yeppeun nal dugo gashina / Nal dugo gashina... Gashina!'"
    ]
  },
  {
    name: "The Anti-Drop Spoken/Whispered Title Drop (Solo Killing Part)",
    description: "The high-tension build cuts to total silence. The solo artist delivers an unbothered, low-register spoken or whispered killing line just as the heavy 808 sub-bass drops.",
    pattern: "(Build riser cuts to complete silence) -> [Soloist Whispered/Spoken Title Killing Line] -> (Heavy 808 Sub-Bass Drops) -> [Staccato Soloist Groove Chants]",
    examples: [
      "Chung Ha - 'Snapping': '(Beat cuts to silence) ... Snapping, snapping / Ije nan neoreul ijeosseo'",
      "Taemin - 'Move': 'Myohan siseon sok / (Whisper) Move... Urin imi hanainikka'",
      "Kai - 'Mmmh': '(Beat cuts) ... Mmmh, mmmh / Neowa nae sai gakkawijin geori'",
      "Hwasa - 'Maria': '(Silence) ... Maria, maria / Neol wihan mariya'"
    ]
  },
  {
    name: "The Question & Answer Punchline Anchor",
    description: "The title acts as the climactic question or definitive punchline at the end of each melodic couplet or 2nd bar, showcasing solo lyrical wit.",
    pattern: "Line 1: [Lyrical Set-up & Personal Tension] -> Line 2: [Title Question/Punchline Anchor] -> Line 3: [Melodic Counter-Phrase] -> Line 4: [Final Title Payoff]",
    examples: [
      "IU - 'BBIBBI': 'I seoneul neomeomyeon chimbeomiya beep / Maeneoneun yeogikkaji, it's ma ma ma mine / Please call me out, Yellow C-A-R-D'",
      "Sunmi - 'Tail': 'Geopdo eopsi nareul geondeuryeo / What are you looking at? / Heundeullineun tail'",
      "Baekhyun - 'Candy': 'Got me feeling sweet / Eotteon matdo da boyeojulge / Original candy, yeah'"
    ]
  },
  {
    name: "The High-Belt Melodic Climax Title",
    description: "The title is sung at the highest vocal peak/melody apex with full chest voice or soaring falsetto in the second half of the chorus.",
    pattern: "Bars 1-2: [Driving Rhythmic Pre-Build] -> Bar 3: [Soloist Soaring High-Belt Title Climax] -> Bar 4: [Rich Multi-Harmonic Resolution & Ad-libs]",
    examples: [
      "Taeyeon - 'INVU': 'I-N-V-U / Gidaehaji ana / Neon ije nareul tteona / I-N-V-U'",
      "IU - 'Celebrity': 'Ijji ma neon heurin eodum sai / Oensoneuro geurin byeol hana... You are my celebrity!'",
      "WOODZ - 'Drowning': 'Biccheoreom ssodajyeo nae mam sok / Can't breathe, I'm drowning, drowning!'",
      "Jungkook - 'Seven': 'Night after night, I'll be loving you right / Seven days a week!'"
    ]
  },
  {
    name: "The Seamless Lyrical Infiltration (Concealed Double-Meaning Title)",
    description: "The title is woven organically into a flowing conversational sentence from the solo artist's personal perspective.",
    pattern: "Lines 1-4: [Natural conversational phrasing where the title phrase appears smoothly as the grammatical object or personal action]",
    examples: [
      "BoA - 'Woman': 'No one can stop me now / Nae bareul matchwo naga / Feelin' like a woman'",
      "Chung Ha - 'Roller Coaster': 'I sungani meomchuji anke / Neowa na duriseo, ride the roller coaster'",
      "Taeyeon - 'Weekend': 'Gajang gakkaun bamsoge / Dallyeoga bollae, it's my weekend'"
    ]
  },
  {
    name: "The Post-Chorus Stutter / Beat Chop Title (Solo Hook)",
    description: "The main melodic chorus resolves, and the post-chorus chops, stutters, or spells out the title rhythmically over a dance break beat with solo vocal chops.",
    pattern: "[Melodic Chorus 4 Bars] -> [Post-Chorus Dance Drop: Solo Stuttered/Chopped Title Cadence Loop]",
    examples: [
      "Somi - 'DUMB DUMB': 'Nan ne meori kkokdaegieseo chumeul chwo, you dumb dumb / Dumb-dumb-dumb-dumb!'",
      "Sunmi - 'Siren': 'Siren, siren, ullyeopaepyeodo / Don't call me now, siren!'",
      "Taemin - 'Advice': 'Best take my advice / Deo eotteon maldo hal piryo eopseo, advice!'"
    ]
  }
];

export const getRandomTitleInChorusStrategy = (isSolo: boolean = false) => {
  const pool = isSolo ? SOLO_TITLE_IN_CHORUS_STRATEGIES : TITLE_IN_CHORUS_STRATEGIES;
  return pool[Math.floor(Math.random() * pool.length)];
};

export const getArtistTypeVocalAndLyricDirectives = (
  groupType?: string, 
  memberCount: number = 5,
  isSoloOverride?: boolean,
  artistGender?: 'Female' | 'Male'
) => {
  const normalized = (groupType || '').trim().toLowerCase();
  const isSolo = Boolean(isSoloOverride || isSoloArtistType(groupType, memberCount));
  
  if (isSolo) {
    const isFemale = artistGender === 'Female' || normalized.includes('female') || normalized.includes('girl') || (!normalized.includes('male') && !normalized.includes('boy'));
    if (isFemale) {
      return `
FEMALE SOLOIST ARTIST PROFILE, VOCAL DYNAMICS & STRICT NARRATIVE LOGIC:
- STRICT SINGULAR 1ST-PERSON PERSPECTIVE: The entire song is written exclusively from the individual point of view of ONE female artist ("I", "me", "my", "mine").
  * STRICTLY FORBIDDEN: Using collective group plurals ("we", "us", "our group", "our team", "together we conquer", "we the girls").
  * When singing about a romantic interest, tension, or opponent, address them directly ("you", "he", "him", "boy").
- GENDER-AUTHENTIC FEMININE IDENTITY & PRONOUNS:
  * Empowered feminine self-expression: "I'm that girl", "the queen", "diva", "she/her/hers".
  * Authentic female gaze, chic high-fashion independence, unapologetic agency, and magnetic charisma (inspired by Taeyeon, IU, Sunmi, Chung Ha, Somi, Jennie, Nayeon, Hwasa, BoA).
  * STRICTLY FORBIDDEN: Mismatched masculine pronouns ("I'm that man", "king") or boy-group brotherhood themes.
- VOCAL VERSATILITY & PERFORMANCE:
  * ONE artist carries the entire vocal palette: effortless dynamic transitions from intimate, breathy low-register whispered storytelling, to sassy conversational pocket rap, to soaring emotional belts with multi-tracked self-harmonies and ad-libs.
- REMOVE ALL GROUP MEMBER REFERENCES:
  * STRICTLY FORBIDDEN: Referencing group members, member baton-passing, gang shouts, group unison chants ([All]), or group positions ([Leader], [Sub-Vocal], [Main Vocal], [Lead Vocal], [Center], [Main Rapper]).
  * Every single line, ad-lib, and performance tag must belong to the solo artist!
- CHORUS FOCUS: Unforgettable signature hook showcasing iconic solo identity and personal vocal color with rich self-harmonies.`;
    } else {
      return `
MALE SOLOIST ARTIST PROFILE, VOCAL DYNAMICS & STRICT NARRATIVE LOGIC:
- STRICT SINGULAR 1ST-PERSON PERSPECTIVE: The entire song is written exclusively from the individual point of view of ONE male artist ("I", "me", "my", "mine").
  * STRICTLY FORBIDDEN: Using collective group plurals ("we", "us", "our group", "our team", "our brothers", "we the boys").
  * When singing about a romantic interest, tension, or opponent, address them directly ("you", "she", "her", "girl").
- GENDER-AUTHENTIC MASCULINE IDENTITY & PRONOUNS:
  * Magnetic masculine charisma: "I'm that man", "king", "gentleman", "he/him/his".
  * Authentic male vocal charm, late-night vulnerability, smooth R&B swagger, and confident autonomy (inspired by Taemin, Baekhyun, WOODZ, Kai, Jungkook, Zico, Colde, Jay Park).
  * STRICTLY FORBIDDEN: Mismatched feminine pronouns ("I'm that girl", "queen") or girl-group sisterhood themes.
- VOCAL VERSATILITY & PERFORMANCE:
  * ONE artist carries the entire track: smooth R&B emotiveness, confidential low-register spoken talk, airy falsetto runs, impassioned chest-voice belts, and sharp cypher rap cadences with multi-tracked self-harmonies.
- REMOVE ALL GROUP MEMBER REFERENCES:
  * STRICTLY FORBIDDEN: Referencing group members, brotherly crew call-and-responses, stadium gang shouts, group unison chants ([All]), or group positions ([Leader], [Sub-Vocal], [Main Vocal], [Lead Vocal], [Center], [Main Rapper]).
  * Every single line, ad-lib, and performance tag must belong to the solo artist!
- CHORUS FOCUS: Hypnotic melodic groove or explosive vocal climax carrying the emotional core with solo self-harmonies.`;
    }
  }

  if (normalized.includes('girl')) {
    return `
GIRL GROUP ARTIST PROFILE & VOCAL DYNAMICS:
- VOCAL STYLING: Sassy staccato delivery, bright multi-part vocal harmonies, effortless high-register vocal flips, and catchy melodic earworms.
- ATTITUDE & PERSONA: Unbothered chic confidence, witty banter, playful modern dialogue, and sharp charisma (inspired by aespa, IVE, LE SSERAFIM, NewJeans, (G)I-DLE, KISS OF LIFE, TWICE, BLACKPINK).
- VOCAL ARRANGEMENT: Crisp killing parts for visual/center members, rich 3-to-4 part vocal harmonies in the pre-chorus/chorus, and punchy bilingual rap transitions.
- CHORUS FOCUS: Infectious hook bounce, chic attitude drops, and instant vocal earworms.`;
  }
  
  if (normalized.includes('boy')) {
    return `
BOY GROUP ARTIST PROFILE & VOCAL DYNAMICS:
- VOCAL STYLING: Punchy low chest registers, aggressive 808 trap/drill syncopated cadences, stadium gang unison shouts, dynamic vocal belts, and rhythmic rap sparring.
- ATTITUDE & PERSONA: High-octane swagger, intense magnetic tension, brotherhood energy, and fearless performance drive (inspired by Stray Kids, NCT 127, ATEEZ, ENHYPEN, BTS, SEVENTEEN, TXT, RIIZE).
- VOCAL ARRANGEMENT: Heavy sub-bass drive, call-and-response group roaring chants, fast cypher rap verses, and soaring emotional bridge belts.
- CHORUS FOCUS: Stadium unison roars, explosive bass drops, and high-impact choreo chants.`;
  }
  
  if (normalized.includes('female') || normalized.includes('female soloist')) {
    return `
FEMALE SOLOIST ARTIST PROFILE & VOCAL DYNAMICS:
- VOCAL STYLING: Distinctive, singular vocal identity with high dynamic versatility—effortlessly moving between breathy intimate whispered storytelling, sassy conversational pocket rap, and soaring emotional belts.
- ATTITUDE & PERSONA: Unapologetic personal agency, magnetic individual star power, mature vulnerability, and chic high-fashion independence (inspired by Taeyeon, IU, Sunmi, Chung Ha, Somi, Jennie, Nayeon, Hwasa).
- VOCAL ARRANGEMENT: Intimate lead vocals with rich self-harmony stacks, personal ad-lib flourishes, and spotlight killing parts built entirely around one artist's unique vocal color.
- CHORUS FOCUS: Unforgettable signature hook designed to showcase vocal charisma and iconic solo identity.`;
  }
  
  if (normalized.includes('male') || normalized.includes('male soloist')) {
    return `
MALE SOLOIST ARTIST PROFILE & VOCAL DYNAMICS:
- VOCAL STYLING: Charismatic vocal nuance, smooth R&B emotiveness, seamless transitions from low-register confidential talk to airy falsettos and impassioned chest belts.
- ATTITUDE & PERSONA: Magnetic masculine charisma, vulnerable late-night confessions, laid-back swagger, and sensual artistic autonomy (inspired by Taemin, Baekhyun, WOODZ, Kai, Jungkook, Zico, Colde).
- VOCAL ARRANGEMENT: Warm organic instrumentation, smooth vocal runs, layered falsetto harmonies, and expressive vocal phrasing.
- CHORUS FOCUS: Smooth, hypnotic melodic groove or explosive vocal climax carrying the emotional core.`;
  }
  
  return `
CO-ED GROUP ARTIST PROFILE & VOCAL DYNAMICS:
- VOCAL STYLING: Dynamic vocal contrast between male low-register rap/chest voice and female high-register melodic belts.
- ATTITUDE & PERSONA: Vocal sparring, complementary dual-gender storytelling, and sharp cross-harmonic tension (inspired by KARD).
- VOCAL ARRANGEMENT: Call-and-response between male and female vocalists with interlocked harmonies.
- CHORUS FOCUS: Alternating male and female vocal hooks with shared unison power.`;
};

export const getShowDontTellSongwritingMandate = () => `
STRICT POP SONGWRITING MANDATE: COMPLETE SENSE, CATCHY HOOKS, ZERO ESSAY-TALK & ZERO FAKE TIMESTAMPS:
Popular K-pop hits NEVER preach, lecture, write formal essays, or use fake AI specificity. They make complete narrative sense, carry an infectious rhythmic bounce, and SHOW feelings through concrete actions, sensory moments, dialogue, and body language.

❌ BANNED AI TROPES & FAKE SPECIFICITY (STRICTLY FORBIDDEN):
- STRICTLY BAN TIMESTAMPS & SCREEN STARING:
  * DO NOT WRITE: "It's 2 AM and I'm staring at my screen" / "read at 3 AM" / "4:12 AM" / "blue light on the ceiling".
  * Artificial timestamps are lazy AI crutches. Real songs create authentic intimacy through relational friction, eye contact, concrete decisions, and tangible dialogue!
- BANNED ESSAY / ACADEMIC "TELLING":
  * DO NOT WRITE: "I learned to believe in myself and rise above the darkness."
  * DO NOT WRITE: "We are powerful and will teach the world our truth through continuous effort."
  * DO NOT WRITE: "Furthermore, the world may judge us, but we endeavor to remain whole."
  * DO NOT WRITE: "Never give up when the storm tries to break your spirit."

✅ REQUIRED NARRATIVE SENSE & AUTHENTIC POP FLOW (REAL SONGWRITING):
- SHOW CONFIDENCE & ATTITUDE (CONVERSATIONAL, PUNCHY, COHERENT):
  * "Left my keys on the counter, didn't look back twice / Keopi hanjan deulgo georeo, clean steps on the polished floor / You called me twice, but I'm already out the door, don't play with it."
  * "Talk is cheap, eyes on me when I pass / Chattaegi chaewo, laughing into the mic, did you think I was gonna crash?"
- SHOW OBSESSION / ATTRACTION (CLEAR EMOTIONAL CONTINUITY):
  * "Caught myself replaying what you said in the hall / Meori wie tteoolla, biting the straw till it cracks / Radio plays that song again, pretending I ain't looking your way."
- SHOW TURBULENCE / HEARTBREAK (RELATIONAL CONFLICT, NOT CLOCK TIMES):
  * "Cold cup sweating in my hand while you make excuses / Keopi jan kkaejyeodo chiuji aneun chae / Your silence is the loudest answer in this room."
- SHOW REBELLION / WIT (FAST POCKET & SHARP RETORTS):
  * "Spilled espresso on my white shirt, still walked in like I own it / Camera flashes going off without a warning / Laughing in the chorus, 'You thought I'd fold? Think again.'"

CORE MANDATES:
1. TOTAL NARRATIVE SENSE & STORYLINE COHERENCE:
   - Every line MUST make complete logical sense in context and connect seamlessly to the line before it.
   - Do NOT produce word salad or disjointed non-sequiturs. Build a real situation or emotional storyline from Verse 1 to Outro.
2. ZERO TIMESTAMPS OR SCREEN CRUTCHES:
   - Strictly NO "2 AM", "3 AM", "4 AM", "midnight", "staring at my screen/phone/ceiling", "read receipts".
3. RHYTHMIC CATCHINESS & BALANCED SYLLABLE METER:
   - Pop lyrics must have tight rhythmic cadence (balanced syllable counts, typically 6-9 syllables per line) so lines bounce on the beat and can be sung aloud.
   - The chorus must be an instant earworm with punchy repetition of the song title motif.
4. NATURAL VOCABULARY MATCH:
   - Match the tone, attitude, and vocabulary to the song's actual genre and storyline. Never force awkward slang salads into songs where they don't fit.
5. ZERO MORAL LESSONS OR MOTIVATIONAL SLOGANS: The song is an emotional snapshot, a groove, or a vibe—NOT a Sunday sermon!
`;

export const CHORUS_ARCHETYPES = [
  {
    name: "The Anti-Drop Whisper / Low-Register Staccato Hook",
    description: "The high-energy build abruptly cuts to total silence. The chorus drops with a heavy 808 sub-bass, a low-register whispered or spoken English punchline in bars 1-2, followed by a punchy 3-word vocal chop. Punchy, effortless, zero preachy fluff.",
    chorusStructure: "Beat cuts out -> [Whispered/Spoken English Killing Part] -> (Heavy Bass Kick Drops) -> [Staccato 3-Word Korean Vocal Chop] -> [Deadpan English Tag]",
    example: "(Beat cuts to silence)\n[Center - Spoken Low Register] 'Don't blink.'\n(Heavy 808 Bass Drops)\n[All - Staccato Chant] 'Nal bwa / Step back / Da teoreonae'\n[Main Rapper] 'Game over, checkmate.'"
  },
  {
    name: "The Dual-Flavor Switch (Rhythmic Trap Chants into Lush Melodic Bloom)",
    description: "Split chorus: Bars 1-4 are punchy, syncopated rap/gang shouts over driving beats, then bars 5-8 blossom into lush multi-part vocal harmonies and a soaring melodic resolution.",
    chorusStructure: "First Half: [Punchy Gang Chant & Snappy Rhythm] -> Second Half: [Lush 4-Part Harmony & Soaring High-Register Melody]",
    example: "[All - Rhythmic Chant] 'Bite back! Gariji ma / Louder, louder, scream it out!'\n[Main Rapper] 'One step, two step, pandoreul dwijibeo'\n[Main & Lead Vocals - Lush Soaring Melody] 'Neowa naega mandeureoganeun new road / Kkeuteopsi beonjyeoganeun uriui story'"
  },
  {
    name: "The Call-and-Response Crowd Chant / Stadium Unison",
    description: "Leader shouts a high-energy English prompt phrase, and the whole group roars the rhythmic answer in unison with brass hits, followed by an immediate vocal echo.",
    chorusStructure: "[Leader Solo Shout] -> [All Unison Roar] -> [Sub-Vocal Quick Response] -> [All Unison Payoff]",
    example: "[Leader] 'Who's next?'\n[All - Stadium Roar] 'Make way, da bikyeo!'\n[Center] 'Watch this reaction'\n[All] 'One, two, take it down right now!'"
  },
  {
    name: "The Symmetrical 4-Bar Melodic Loop with Deadpan English Payoff",
    description: "Bars 1 to 3 establish an infectious, repetitive melodic question in Korean that gets stuck in the listener's head. Bar 4 completely breaks the rhythm with a sassy, deadpan conversational English one-liner.",
    chorusStructure: "Bars 1-3: [Catchy Repetitive Melodic Hook in Korean] -> Bar 4: [Sudden Deadpan English Spoken Breakout]",
    example: "[Lead Vocal] 'Eojjeomyeon naega neoreul jom deo / Maeiri jinado saenggakhae / Neoui nunbiche heundeullideon nal / ...Honestly? You were never even my type.'"
  },
  {
    name: "The Punchy Title-Motif Cadence Bounce (Clean Earworm Hook)",
    description: "A tight, infectious 4-line hook built around the song title. Features a syncopated vocal cadence with clean repetition and zero awkward onomatopoeia.",
    chorusStructure: "[Song Title Motif Strike] -> [Syncopated Korean Groove Line] -> [Title Variation Hook] -> [Unison Punchline]",
    example: "[Center] 'Say my name, louder now'\n[All - Rhythmic Bounce] 'Siseoneul kkeureodanggyeo, ready or not'\n[Main Vocal] 'Say my name, keep it loud'\n[All] 'I sungani jeonbuinikka, we run the show'"
  },
  {
    name: "The Fluid English-First High-Belt Climax with Korean Sub-Harmonies",
    description: "The main vocal sings a soaring, emotionally charged full-English lead line while background members sing dense, rapid Korean counter-rhythms underneath.",
    chorusStructure: "[Main Vocal English Soaring Belt] + [Background Korean Counter-Rhythm Stacks] -> [Unison Melodic Drop]",
    example: "[Main Vocal - High Belt] 'Tell me where you wanna go tonight!'\n[Sub-Vocals - Fast Korean Stack] '(Sum makhineun bame, gachi tteonaja)'\n[Main Vocal] 'Leaving all the noise behind us now!'\n[All - Unison Drop] 'I sungan uri duri, perfect sync'"
  },
  {
    name: "The Deadpan Conversational Voice-Note into High-Speed Cypher Drop",
    description: "Opens with an unbothered, spoken conversational phone/voice-note line before exploding into high-BPM rhythmic syllable stacking.",
    chorusStructure: "[Spoken Phone Audio Tag] -> [Immediate Snare Rush & Cypher Flow] -> [Punchy Bass Payoff]",
    example: "[Visual - Spoken Casual] 'Wait, did you really think I'd care?'\n(Immediate Snare Fill & 140 BPM Bass Drop)\n[Rapper & Vocal] 'Geu eotteon maldo deullyeojuji ma / Turn around, step aside, done with you / Dasi doraboji ana, final call'"
  }
];

export const SOLO_CHORUS_ARCHETYPES = [
  {
    name: "The Solo Anti-Drop Whisper & Heavy 808 Bass Kick (Killing Part Drop)",
    description: "The build cuts to absolute silence. The solo artist delivers a low-register whispered or spoken English killing punchline, followed by an immediate 808 bass drop and layered self-harmony vocal chops.",
    chorusStructure: "Beat cuts out -> [Soloist - Whispered/Spoken Killing Part] -> (Heavy Bass Kick Drops) -> [Soloist - Staccato Vocal Chop with Self-Harmonies] -> [Soloist - Unbothered English Tag]",
    example: "(Beat cuts to silence)\n[Soloist - Spoken Low Register] 'Don't blink.'\n(Heavy 808 Bass Drops)\n[Soloist - Staccato Chant with Self-Harmonies] 'Nal bwa / Step back / Da teoreonae'\n[Soloist - Sassy Spoken Tag] 'Game over, checkmate.'"
  },
  {
    name: "The Symmetrical Melodic Loop with Deadpan English Payoff (Soloist Earworm)",
    description: "Bars 1 to 3 establish an infectious, repetitive melodic question in Korean that gets stuck in the listener's head. Bar 4 breaks the rhythm with a sassy, deadpan conversational English one-liner.",
    chorusStructure: "Bars 1-3: [Soloist - Catchy Repetitive Melodic Hook in Korean] -> Bar 4: [Soloist - Sudden Deadpan English Spoken Breakout]",
    example: "[Soloist - Sweet Melodic Tone] 'Eojjeomyeon naega neoreul jom deo / Maeiri jinado saenggakhae / Neoui nunbiche heundeullideon nal'\n[Soloist - Deadpan Spoken Tag] '...Honestly? You were never even my type.'"
  },
  {
    name: "The Punchy Title-Motif Cadence Bounce (Solo Earworm Hook)",
    description: "A tight, infectious 4-line hook built around the song title. Features a syncopated vocal cadence with clean repetition, layered self-harmonies, and zero awkward onomatopoeia.",
    chorusStructure: "[Soloist - Song Title Motif Strike] -> [Soloist - Syncopated Korean Groove Line] -> [Soloist - Title Variation Hook] -> [Soloist - Confident Solo Resolution]",
    example: "[Soloist - Rhythmic Lead Line] 'Say my name, louder now'\n[Soloist - Rhythmic Bounce with Harmonies] 'Siseoneul kkeureodanggyeo, ready or not'\n[Soloist - Vocal Belt] 'Say my name, keep it loud'\n[Soloist - Solo Punchline] 'I sungani jeonbuinikka, I run the show'"
  },
  {
    name: "The Soaring High-Belt Climax with Cascading Falsetto Runs (Solo Vocal Apex)",
    description: "The title is sung at the highest vocal peak/melody apex with full chest voice or soaring falsetto in the second half of the chorus, accompanied by intimate self-layered vocal harmonies.",
    chorusStructure: "Bars 1-2: [Soloist - Driving Rhythmic Pre-Build] -> Bar 3: [Soloist - Soaring High-Belt Title Climax] -> Bar 4: [Soloist - Cascading Falsetto Runs & Ad-lib Flourishes]",
    example: "[Soloist - Building Melody] 'I-N-V-U / Gidaehaji ana'\n[Soloist - Soaring High Belt C6] 'Neon ije nareul tteona / I-N-V-U!'\n[Soloist - Airy Falsetto Runs] '(Falling into you, into you)'"
  },
  {
    name: "The Sensual Minimalist R&B / UK Garage Bounce (Intimate Solo Groove)",
    description: "Warm sub-bass, 2-step syncopated swing, and breathy intimate vocal layering highlighting the solo artist's singular vocal color.",
    chorusStructure: "[Soloist - Breathy Falsetto Hook] -> [Soloist - Intimate Close-Mic Whisper-Chant] -> [Soloist - Low-Register Ad-lib Payoff]",
    example: "[Soloist - Breathy Airy Delivery] 'Goyohan saebyeok, gipi ppajyeodeureo'\n[Soloist - Staccato Whisper Chant] 'Touch me slow, don't let it go'\n[Soloist - Smooth Low Run] 'I sunganeun ojik nae geot, right here'"
  },
  {
    name: "The High-BPM Pocket Cypher Drop into Sassy Spoken Tag (Solo Rap/Vocal Hybrid)",
    description: "Opens with an unbothered conversational spoken line before exploding into high-BPM rhythmic syllable stacking and witty solo punchlines.",
    chorusStructure: "[Soloist - Spoken Audio Tag] -> [Soloist - 140 BPM Syncopated Cypher Rap Flow] -> [Soloist - Unbothered Punchline Payoff]",
    example: "[Soloist - Spoken Casual] 'Wait, did you really think I'd fold?'\n(140 BPM Bass Drop)\n[Soloist - Fast Double-Time Flow] 'Geu eotteon maldo deullyeojuji ma / Turn around, step aside, done with you / Dasi doraboji ana, final call'"
  }
];

export const KONGLISH_MIXING_PATTERNS = [
  {
    name: "English-First Line Launch (English Head -> Korean Body)",
    description: "Starts each bar with a punchy conversational English exclamation or attitude hook, then resolves into nuanced Romanized Korean storytelling.",
    formula: "[English Attitude Phrase] + [Korean Continuation]",
    example: "'Honestly speaking, neo eopsi saneun ge deo pyeonhae'\n'No hesitation, jigeum dallyeogalge bareul matchwo'"
  },
  {
    name: "Bilingual Sandwich / Integrated Infix Slang",
    description: "Inserts English slang, fashion terms, or verbs directly inside Korean grammatical structures with active Korean particles (~hae, ~ro, ~reul).",
    formula: "[Korean context] + [English Slang/Verb] + [Korean Particle Ending]",
    example: "'I sungani so messy-haedo sanggwan eopseo'\n'Nae styled-up georeumeuro doro wie seoseo'"
  },
  {
    name: "Full Korean Thought with Deadpan English Punchline Tag",
    description: "A complete, emotionally grounded Korean poetic sentence followed by a dry 1-to-3 word English reality check.",
    formula: "[Full Poetic Korean Line] — [English 2-Word Reaction]",
    example: "'Ne mami da boineunde mwol geureoke sumgyeo... not interested'\n'Dasi hanbeon gikkeoi neol bwajulkke... last chance'"
  },
  {
    name: "Phonetic Mirroring & Vowel-Match Rhyme Cadence",
    description: "Rhymes an English phrase with a Korean phrase based purely on matching phonetics and identical vowel cadence, rather than literal translation.",
    formula: "[English line ending in -ee/-er/-o] <-> [Korean line ending in matching vowel sounds]",
    example: "'Goyohan bamsoge deeper / Gwireul giuryeo listen to the speaker / Nareul jabajwo keeper / Deoneun meomchul su eomneun i sungan'"
  },
  {
    name: "Rapid Interleaved Alternation (Odd Korean / Even English)",
    description: "Strict line-by-line alternation between full Romanized Korean and full English for dynamic cross-cultural flow.",
    formula: "Line 1 (Korean) -> Line 2 (English) -> Line 3 (Korean) -> Line 4 (English)",
    example: "'Goyohan saebyeoge nuneul tteumyeon / The whole world is moving way too fast / Dasi hanbeon sumeul goreugo / We're gonna make this feeling last'"
  },
  {
    name: "English Solo Call / Korean Gang Response",
    description: "Center shouts an English prompt word or question, and the group shouts the snappy Romanized Korean answer in unison.",
    formula: "[Center English Shout] -> (Group Korean Answer)",
    example: "'Who said that? -> (Uriga malhaetji!)'\n'You ready? -> (Dallyeogal junbi dwaesseo!)'"
  },
  {
    name: "Dense Expressive Korean with English Micro-Adlibs",
    description: "Verse driven predominantly by deep Romanized Korean storytelling, punctuated by subtle, confident English pocket ad-libs.",
    formula: "[Korean Narrative Line] (English Understated Ad-lib)",
    example: "'Geoul wie bichin moseubi natseoreo (alright)\nMaeumi ikkineun daero dallyeoga (uh-huh, watch out)'"
  }
];

export const RHYME_SCHEMES = [
  {
    name: "Mosaic & Multisyllabic Compound Rhyme",
    pattern: "A1-A2-A3 / B1-B2-B3",
    description: "Rhymes multi-syllable phrases across languages (2-4 matching syllables per bar) for a heavy rhythmic bounce and technical complexity.",
    example: "Stepping on the gas pedal, no brake / Machi kkaeeonan deusi, shake shake / Shattered every obstacle, awake / Geu eotteon bando mot maga, our stake"
  },
  {
    name: "Cross-Language Phonetic Slant Rhyme",
    pattern: "A B A' B'",
    description: "Matches English terminal vowels with Korean phonetic vowel cadences (e.g., 'gravity' with 'dasi ttwieo', or 'speaker' with 'gipi', or 'center' with 'nareul bwa').",
    example: "Cold air on the rooftop, gravity / Neol hyanghae dallyeoga, dasi ttwieo / Can't erase the sweetest memory / Nalkaroun nunbit sok, deureowa"
  },
  {
    name: "Syncopated Internal Pocket Rhyme",
    pattern: "A-x-A / B-x-B (Mid-Bar)",
    description: "Places rhymes in the unexpected 2nd and 4th sixteenth-note pockets of a bar rather than predictable line endings, creating an organic syncopated groove.",
    example: "Lock it in the pocket, drop it on the floor / Nuni majuchin sungan, knock it at the door / Catch the instant reaction, fashion on replay / Imi sijakdoen motion, we don't have to wait"
  },
  {
    name: "Interlocking Chained AABA / BBCB Rhyme",
    pattern: "A A B A / B B C B",
    description: "Classic pop lyrical tension where line 3 breaks expectation, and line 4 delivers a punchy delayed resolution that flows into the next stanza.",
    example: "Geoul sogui nae moseubeun stranger / Geopdo eopsi ttwieodeun danger / I sunganeul kkwak jabeun sungan / Uri duri mandeureogal wonder"
  },
  {
    name: "Staccato Monosyllabic Energy Burst",
    pattern: "A A A B (Triple-Punch into Release)",
    description: "Delivers 3 high-impact single-syllable strike words (Hit / Split / Quit) followed by an expansive, soaring melodic line.",
    example: "Flash, crash, make a splash / I sunganeul kkwak jaba / Rush, hush, feel the crush / Pureun saebyeogeul kkaewo"
  },
  {
    name: "Falling-Tail Feminine Slant (Trochaic Double Rhyme)",
    pattern: "Stressed-Unstressed (Syllable Pairs)",
    description: "Rhymes word endings that taper off gently on soft unstressed syllables (-ing, -er, -eo, -ji), creating a dreamy, melodic, intimate mood.",
    example: "Bamsae heulleoneomchideon feeling / Neoui sonkkeuti daeun healing / Ije sijakdoeneun moving / Eodirodeun hamkke dreaming"
  },
  {
    name: "Asymmetrical Triplet Bounce (3+3+2 Flow)",
    pattern: "A1-A2-A3 B",
    description: "A fast syncopated triplet run that bunches three rapid rhymes at the start of a bar before resolving with a relaxed conversational finish.",
    example: "One-two-three, step-and-see, let it be / Urin geunyang meomchuji ana / Set-it-free, VIP, guarantee / I sungani jeonbuinikka"
  },
  {
    name: "Enjambed Flow & Cross-Bar Wrap",
    pattern: "A -> (wraps to next line) -> A'",
    description: "The syntactic thought spills over the end of the line without pausing, rhyming across the boundary like a fluid stream of consciousness.",
    example: "Bamsaedorok gominhaetdeon sumaneun yaegi sok / geu modeun geotdeuri han sungane pullyeoga / nega naege geonnedeon hanmadi / like a key"
  },
  {
    name: "Deadpan Spondee Cadence (Equal-Stress Syllables)",
    pattern: "Heavy Heavy / Heavy Heavy",
    description: "Delivers equal, heavy rhythmic weight to every syllable for a chic, dismissive, unbothered attitude.",
    example: "Ice cold. Big talk. Zero fear. / Nunchi boji ma, just stand clear. / New shoes. Loud bass. Right here. / Uriga mandeun atmosphere."
  },
  {
    name: "Call-and-Response Inverted Chiasmus (ABBA)",
    pattern: "A B B' A'",
    description: "Mirror structure where outer lines frame the concept and inner lines deliver contrasting rapid-fire rhymes.",
    example: "Meomchuji anneun rideum / I sungan dallyeoga / Han beon deo ttwieobwa / Uriui new kingdom"
  },
  {
    name: "Polyrhythmic Infix Slang Rhyme",
    pattern: "Korean[Rhyme] + English[Rhyme]",
    description: "Rhymes an internal English slang term with the grammatical Korean suffix of the adjacent line.",
    example: "Geu eotteon talk-do pilyo eopseo / Urin jigeum rock-hae, deoneun meomchit ma / Moduga look-hae, pureun saebyeoge / Siseoneul kkeureodanggyeo"
  },
  {
    name: "Anaphora Anchor with Shifting End-Rhymes",
    pattern: "Hook-Start + Varied Endings",
    description: "Repeats a distinct anchor phrase at the start of every line while spinning surprising multi-syllable rhyme variations at the end.",
    example: "Tell me wae geuri gominhae / Tell me mwo ttaeme mangseoryeo / Tell me jigeumi taimingira / Tell me nae soneul kkwak jaba"
  }
];

export const VERSE_1_ARCHETYPES = [
  {
    name: "Casual Conversational Dialogue / Real-Life Moment",
    description: "Opens directly like a natural conversation or vivid everyday observation. Casual, modern, and effortless songwriting that sets up the groove without being stiff, poetic, or using clock timestamps.",
    blueprint: "Line 1: Relatable real-world action or scene -> Line 2: Natural conversational remark -> Line 3: Subtle emotional tension or humor -> Line 4: Clean rhythmic pickup into pre-chorus",
    example: "[Verse 1: Lead Vocal - Casual & Conversational]\nCold rain tapping on the windowpane\nUrin gateun mareul banbokhae again\nIje geumanhago bareul matchwobwa\nTurn up the tempo, we don't have to wait"
  },
  {
    name: "The Deadpan Direct Confrontation / Candid Dialogue",
    description: "Opens with unbothered, direct spoken-style dialogue or reacting to someone's excuses. Highly relatable, slightly dry/sarcastic, emotionally authentic, with zero timestamp clichés.",
    blueprint: "Line 1: Direct quote or reaction to an excuse -> Line 2: Dry conversational reality check -> Line 3: Relatable vulnerability or sharp boundary -> Line 4: Witty punchline",
    example: "[Verse 1: Sub-Vocal - Deadpan Conversational]\nYou said we'd talk, but you won't meet my eyes\nDasi sijakdoen neoui familiar lies\nI'm done pretending that it's all okay\nLaugh it off, turn around, walk away"
  },
  {
    name: "Effortless Swagger / Unbothered Chic Flow",
    description: "Opens with sharp, unbothered visual focus, everyday style details, and relaxed confidence. Sets up the vibe without dramatic pretension.",
    blueprint: "Line 1: Specific lifestyle/look detail -> Line 2: Dismissive shrug at the noise -> Line 3: Snappy bilingual phrase -> Line 4: Confident launch forward",
    example: "[Verse 1: Main Rapper - Laid-Back Pocket Flow]\nTailored blazer wie bundeun dust, brush it off\nSiseondeuri ssodajyeodo, I just shrug and walk\nGeudeuri wonhaneun teureun da kkaebeoryeotji\nNae rideumdaero gabollae, you can just watch"
  },
  {
    name: "Syncopated Pocket Cypher (High-Skill Rap Flow)",
    description: "Opens with tight rhythmic bounce and staccato cadence. The rapper locks into the groove with crisp multisyllabic slant rhymes and clever bilingual punchlines.",
    blueprint: "Line 1: Snappy syncopated cadence -> Line 2: Multi-syllable internal slant rhymes -> Line 3: Subtle breath pause -> Line 4: Punchy pocket acceleration",
    example: "[Verse 1: Main Rapper - 140 BPM Crisp Pocket Flow]\nOne-two step, bakjareul matchwo, deoneun eomneun trap\nSiseondeureul dwijibeonoheun new blueprint on the map\nPpalli dallyeobwado kkeuteun eopseo, keep it moving\nNae moksoriro mandeureoganeun new groove"
  },
  {
    name: "Intimate Grounded Observation / Sensory Realism",
    description: "Opens with tangible, relatable sensory moments (cold drink in hand, quiet room, headlights sweeping across the wall) rather than abstract poetry or arbitrary clock numbers.",
    blueprint: "Line 1: Concrete everyday moment -> Line 2: Honest understated feeling -> Line 3: Conversational realization -> Line 4: Natural build towards pre-chorus",
    example: "[Verse 1: Lead Vocal - Breathy Low Register]\nChagapge sigeun kaen keopi, sonkkeute maethin drop\nRadioeseo heulleonaoneun static, won't stop\nBami gipeulsurok gwireul giuryeobwa\nNae anui jageun soriga ije keojyeoga"
  },
  {
    name: "Playful Teasing Banter / Cheeky Direct Dialogue",
    description: "Opens by casually teasing or questioning someone with lively, sarcastic charm.",
    blueprint: "Line 1: Playful rhetorical question -> Line 2: Teasing observation -> Line 3: Snappy conversational ad-lib -> Line 4: Upbeat transition",
    example: "[Verse 1: Sub-Vocal - Playful & Bratty]\nGeureoke bogo isseumyeon mwo naoraedo hana? (Nope)\nNe meorissok saenggagi da boineunde eotteokhae\nUh, complicated? Geugeon ne saenggagigo\nNan geunyang i sunganeul enjoy-halge"
  }
];

export const SOLO_VERSE_1_ARCHETYPES = [
  {
    name: "Casual Conversational Dialogue / Real-Life Moment (Soloist Perspective)",
    description: "Opens directly from the solo artist's candid individual perspective—100% singular 1st-person POV ('I/me/my') with rhythmic meter and zero timestamp clichés.",
    blueprint: "Line 1: Relatable solo real-world action or thought -> Line 2: Natural conversational remark -> Line 3: Personal emotional tension -> Line 4: Clean rhythmic pickup into pre-chorus",
    example: "[Verse 1: Soloist - Casual & Conversational]\nCold rain tapping on the windowpane\nNeoui mareul dweeodeopneun i sungani plain\nDeoneun gomin eopsi bareul matchwobwa\nNae rideumdaero gallae, I won't wait"
  },
  {
    name: "The Deadpan Direct Confrontation (Soloist POV)",
    description: "Opens like the solo artist delivering an honest, unbothered reality check to a former partner or rival. Highly relatable, dry humor, authentic singular confidence, zero screen-staring tropes.",
    blueprint: "Line 1: Direct quote or reaction -> Line 2: Dry conversational reality check -> Line 3: Relatable vulnerability -> Line 4: Witty punchline",
    example: "[Verse 1: Soloist - Deadpan Conversational]\nYou left your jacket hanging on my chair\nGeunyang jinachyeo, like I didn't care\nI spent too long waiting on your call\nNow watch me stand up tall, having it all"
  },
  {
    name: "Effortless Solo Swagger / Unbothered Chic Flow (Solo Artist)",
    description: "Opens with sharp, unbothered visual focus, high-fashion lifestyle details, and relaxed confidence. Sets up the singular star-power persona.",
    blueprint: "Line 1: Specific lifestyle/look detail -> Line 2: Dismissive shrug at the noise -> Line 3: Snappy bilingual phrase -> Line 4: Confident launch forward",
    example: "[Verse 1: Soloist - Laid-Back Pocket Flow]\nTailored blazer wie bundeun dust, brush it off\nSiseondeuri ssodajyeodo, I just shrug and walk\nGeudeuri wonhaneun teureun da kkaebeoryeotji\nNae rideumdaero gabollae, you can just watch"
  },
  {
    name: "Syncopated Pocket Cypher (High-Skill Solo Rap Flow)",
    description: "Opens with tight rhythmic bounce and staccato cadence. The solo artist locks into the groove with crisp multisyllabic slant rhymes and clever bilingual punchlines.",
    blueprint: "Line 1: Snappy syncopated cadence -> Line 2: Multi-syllable internal slant rhymes -> Line 3: Subtle breath pause -> Line 4: Punchy pocket acceleration",
    example: "[Verse 1: Soloist - 140 BPM Crisp Pocket Flow]\nOne-two step, bakjareul matchwo, deoneun eomneun trap\nSiseondeureul dwijibeonoheun new blueprint on the map\nPpalli dallyeobwado kkeuteun eopseo, keep it moving\nNae moksoriro mandeureoganeun new groove"
  },
  {
    name: "Intimate Grounded Observation / Sensory Realism (Solo Intimacy)",
    description: "Opens with tangible, relatable sensory moments (cold drink in hand, quiet studio, headlights reflecting on the wall) emphasizing intimate solo vocal delivery.",
    blueprint: "Line 1: Concrete everyday moment -> Line 2: Honest understated feeling -> Line 3: Conversational realization -> Line 4: Natural build towards pre-chorus",
    example: "[Verse 1: Soloist - Breathy Low Register]\nChagapge sigeun kaen keopi, sonkkeute maethin drop\nRadioeseo heulleonaoneun static, won't stop\nBami gipeulsurok gwireul giuryeobwa\nNae anui jageun soriga ije keojyeoga"
  },
  {
    name: "Playful Teasing Banter / Cheeky Direct Dialogue (Solo Agency)",
    description: "Opens by casually teasing or questioning someone with lively, sarcastic charm from a singular perspective.",
    blueprint: "Line 1: Playful rhetorical question -> Line 2: Teasing observation -> Line 3: Snappy conversational ad-lib -> Line 4: Upbeat transition",
    example: "[Verse 1: Soloist - Playful & Bratty]\nGeureoke bogo isseumyeon mwo naoraedo hana? (Nope)\nNe meorissok saenggagi da boineunde eotteokhae\nUh, complicated? Geugeon ne saenggagigo\nNan geunyang i sunganeul enjoy-halge"
  }
];

export const FIGURATIVE_DEVICES = [
  {
    name: "Conversational Realism & Relational Candor",
    description: "Relatable everyday phrasing, unspoken social tension, direct casual observations, and honest dialogue without flowery poetic fluff or fake timestamps.",
    examples: ["Dropping your keys on the counter without looking back", "Faking a smile while ordering an iced drink", "Walking out the door mid-sentence with total calm"]
  },
  {
    name: "Bilingual Double Entendre & Wordplay",
    description: "Cleverly using Korean words that sound like English slang or carry double layered meanings and clever punchlines.",
    examples: ["'Bad' / 'Bada' (ocean/sea)", "'Dive' / 'Daebak'", "'One-four-three' (cipher code)"]
  },
  {
    name: "Relatable Micro-Drama & Tangible Props",
    description: "Grounding the emotional state in physical, everyday objects (subway cards, headphones on 1%, worn sneakers, cold canned coffee).",
    examples: ["Headphones dying right at the best part of the song", "Stepping out into the sudden rain without an umbrella", "Tying shoelaces to avoid making eye contact"]
  },
  {
    name: "Syncopated Pocket Grooves & Attitude Cadence",
    description: "Snappy rhythmic flow, nonchalant swagger, and punchy rhythmic phrasing that carries attitude without needing melodramatic prose.",
    examples: ["Shrugging off unwanted opinions with a 2-word punchline", "Walking to our own tempo regardless of the crowd", "Keeping the volume turned up"]
  },
  {
    name: "Modern Urban & Lifestyle Metaphors",
    description: "Chic fashion details, late-night playlists, backstage adrenaline, and effortless confidence.",
    examples: ["Oversized jacket hiding my heartbeat", "Bass vibrating through the dashboard", "Turning the camera away because the night is ours"]
  },
  {
    name: "Understated Irony & Sarcastic Retorts",
    description: "Playfully calling out contradictory actions with wry humor instead of heavy moralizing.",
    examples: ["Acting like you didn't hear my call", "Pretending you didn't look back twice", "Giving advice you never follow yourself"]
  }
];

export const EXPANDED_SONG_STRUCTURES = [
  {
    name: "Dynamic Pop/EDM Powerhouse",
    pattern: "Intro -> Verse 1 -> Pre-Chorus -> Drop Chorus -> Verse 2 (Trap Rap Break) -> Pre-Chorus -> Chorus -> Soaring Melodic Bridge (Belt High C6) -> Explosive Dance Break & Outro Chants",
    description: "Built for massive stadium concerts and high-energy music show stages. High dynamic contrast with vocal belts and choreography drops."
  },
  {
    name: "Multi-Part Hybrid Beat-Switch-up",
    pattern: "Spoken Signature Intro -> Verse 1 (R&B Groove) -> Rising Pre-Chorus -> Anti-Drop Chorus -> Verse 2 (Half-Time UK Drill / Trap Tempo Shift) -> Pre-Chorus -> Chorus -> Ambient Bridge -> High-Speed Climax Outro",
    description: "SM/NMIXX/aespa style unexpected genre switch-up that keeps listeners on their toes with contrasting acoustic and bass sections."
  },
  {
    name: "Post-Chorus TikTok Hook-First",
    pattern: "Instant Hook Burst -> Verse 1 -> Pre-Chorus -> Main Chorus -> Post-Chorus (Repetitive Onomatopoeia Mantra) -> Verse 2 Melodic Flow -> Chorus -> Post-Chorus -> Dance Break Outro",
    description: "Optimized for short-form viral choreography with a sticky, infectious vocal mantra right after the chorus."
  },
  {
    name: "Sensual Minimalist R&B / UK Garage",
    pattern: "Atmospheric Lo-Fi Intro -> Low-Register Verse 1 -> Airy Falsetto Pre-Chorus -> Whisper-Staccato Chorus -> Call-and-Response Verse 2 -> Dual-Harmony Bridge -> Fading Ad-lib Outro",
    description: "NewJeans / ILLIT / Taemin vibe: warm sub-bass, 2-step syncopated swing, and breathy intimate vocal layering."
  },
  {
    name: "Cyberpunk Hyperpop / Jersey Club Staccato",
    pattern: "Fast-Chant Intro -> Fast-BPM Verse 1 (140 BPM) -> Rising Snare Pre-Chorus -> Jersey 5-Beat Bounce Chorus -> Verse 2 Punchy Staccato Rap -> Glitch-Pop Bridge -> Dual-Tempo Finale",
    description: "Ultra-modern, high-BPM dance track featuring Jersey club kick patterns, metallic synth plucks, and vocal chops."
  }
];

export const getRandomTropeCluster = () => {
  return LYRIC_TROPE_CLUSTERS[Math.floor(Math.random() * LYRIC_TROPE_CLUSTERS.length)];
};

export const getRandomVerse1Archetype = (isSolo: boolean = false) => {
  const pool = isSolo ? SOLO_VERSE_1_ARCHETYPES : VERSE_1_ARCHETYPES;
  return pool[Math.floor(Math.random() * pool.length)];
};

export const getRandomChorusArchetype = (isSolo: boolean = false) => {
  const pool = isSolo ? SOLO_CHORUS_ARCHETYPES : CHORUS_ARCHETYPES;
  return pool[Math.floor(Math.random() * pool.length)];
};

export const getRandomKonglishPattern = () => {
  return KONGLISH_MIXING_PATTERNS[Math.floor(Math.random() * KONGLISH_MIXING_PATTERNS.length)];
};

export const getRandomRhymeScheme = () => {
  return RHYME_SCHEMES[Math.floor(Math.random() * RHYME_SCHEMES.length)];
};

export const getRandomFigurativeDevices = (count: number = 2) => {
  const shuffled = [...FIGURATIVE_DEVICES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getRandomStructure = () => {
  return EXPANDED_SONG_STRUCTURES[Math.floor(Math.random() * EXPANDED_SONG_STRUCTURES.length)];
};

export const getAllLyricTropesText = () => {
  let text = "APPROVED K-POP LYRIC TROPE CLUSTERS:\n";
  text += "When generating songs, you MUST randomly select one of these Trope Clusters as the core theme to ensure variety and authenticity.\n\n";
  
  LYRIC_TROPE_CLUSTERS.forEach(trope => {
    text += `- Trope: ${trope.name}\n`;
    text += `  Description: ${trope.description}\n`;
    text += `  Themes: ${trope.themes.join(", ")}\n`;
    text += `  Examples:\n`;
    trope.examples.forEach(ex => {
      text += `    > ${ex}\n`;
    });
    text += "\n";
  });
  
  return text;
};

export const getSingleLyricStyleGuide = (
  isSolo: boolean = false, 
  artistGender?: 'Female' | 'Male', 
  artistName?: string
) => {
  const selectedTrope = getRandomTropeCluster();
  const selectedChorus = getRandomChorusArchetype(isSolo);
  const selectedKonglish = getRandomKonglishPattern();
  const selectedRhyme = getRandomRhymeScheme();
  const selectedFigurative = getRandomFigurativeDevices(2);
  const selectedStruct = getRandomStructure();
  
  return `
STRICT LYRIC CRAFT, CATCHY CHORUS & SONGWRITING CONSTRAINTS:
- Core Trope: ${selectedTrope.name} (${selectedTrope.description})
- Specific Chorus Archetype: ${selectedChorus.name}
  * Chorus Layout: ${selectedChorus.chorusStructure}
- Konglish Mixing Method: ${selectedKonglish.name}
  * Formula: ${selectedKonglish.formula}
  * Example Pattern: "${selectedKonglish.example.split('\n')[0]}"
- Target Rhyme Scheme: ${selectedRhyme.name} (${selectedRhyme.pattern} - ${selectedRhyme.description})
- Songcraft Device: ${selectedFigurative[0].name}: ${selectedFigurative[0].description} (e.g. "${selectedFigurative[0].examples[0]}")
- Song Structure Model: ${selectedStruct.name} (${selectedStruct.pattern})

${isSolo ? `CRITICAL SOLO ARTIST SONGWRITING MANDATES:
1. STRICT SINGULAR PERSPECTIVE: Write exclusively from ${artistName ? `"${artistName}"'s` : 'the solo artist\'s'} individual 1st-person perspective ("I", "me", "my", "mine").
   - STRICTLY FORBIDDEN: Using collective group plurals ("we", "us", "our group", "our team", "together we conquer").
2. GENDER-SPECIFIC IDENTITY & PRONOUNS:
   ${artistGender === 'Female' 
     ? `- Feminine self-expression: She/her/hers identity ("I'm that girl", "the queen").
   - When addressing romantic tension or partners, use male pronouns ("he", "him", "boy") or direct "you".
   - ZERO mismatched masculine self-references.`
     : `- Masculine self-expression: He/him/his identity ("I'm that man", "king").
   - When addressing romantic tension or partners, use female pronouns ("she", "her", "girl") or direct "you".
   - ZERO mismatched feminine self-references.`}
3. ZERO GROUP REFERENCES:
   - Strictly NO references to other group members, member baton-passing, or group positions ([Leader], [Center], [Sub-Vocal], [Main Vocal], [Main Rapper]).
   - Tag lines as [Soloist] or using the artist's name!` : ''}

CRITICAL MANDATES:
1. COMPLETE NARRATIVE SENSE & STORYLINE CONTINUITY:
   - The lyrics must make 100% logical and emotional sense from start to finish!
   - Every line must logically follow from and answer the previous line. Do NOT write random disconnected thoughts or confusing word-salad.
   - Both Korean and English lines must be grammatically complete and meaningful.
2. STRICT BAN ON FAKE SPECIFICITY & TIMESTAMPS:
   - Strictly NO "2 AM", "3 AM", "4 AM", "midnight", "staring at my screen/phone/ceiling", "read receipts".
   - Ground specificity in real dialogue, relational friction, tangible actions, and emotional decisions.
3. CHORUS MUST BE ULTRA-CATCHY & EARWORM-DRIVEN (RULE OF 3):
   - 2 to 4 lines of infectious, rhythmic earworm hooks or drop chants.
   - Balanced syllable counts (6-9 syllables per line) so lines bounce on the beat and stick in the listener's head.
   - Repeat the title hook motif rhythmically with syncopated bounce and singable open vowels!
   - STRICTLY NO MORAL LESSONS or philosophical lectures (NO "we must learn", "stand tall and overcome", "the world tries to break us").
4. BAN NONSENSICAL ONOMATOPOEIA: Strictly NO forced, clunky sound effects (e.g. 'tik-tak', 'ppappappa', 'ratata', 'beep-beep', 'vroom', 'zoom', 'skrrt').
5. CASUAL, MODERN VERSES (NO STIFF POETRY):
   - Verses should feel conversational, natural, and relatable.
   - Set up the groove and situation effortlessly so the energy builds naturally into the Pre-Chorus and Chorus without stealing their spotlight.
6. HIGH-TIER RAP FLOW: Rappers must have locked-in pocket rhythm, syncopated multisyllabic rhymes, and authentic swagger (inspired by Soyeon, Changbin, Mark, Jennie, Bobby).
7. BAN ALL AI CLICHÉS: Strictly NO 'neon', 'shadow', 'line', 'velvet', 'whisper', 'spark', 'flame', 'destiny', 'echo', 'shatter', 'matrix', 'glitch'.
`;
};

export const getChorusEngineeringRules = (
  groupType?: string, 
  generation?: string, 
  trackTitle?: string,
  isSoloParam?: boolean,
  artistGender?: 'Female' | 'Male'
) => {
  const isSolo = Boolean(isSoloParam || isSoloArtistType(groupType));
  const titleStrategy = getRandomTitleInChorusStrategy(isSolo);
  return `
K-POP CHORUS ENGINEERING RULES (CATCHY, PUNCHY & ZERO PREACHY LESSONS):
The chorus is the heart of a K-pop hit: it MUST be an instant, unforgettable earworm that gets stuck in the listener's head.

${getShowDontTellSongwritingMandate()}

${getArtistTypeVocalAndLyricDirectives(groupType, 1, isSolo, artistGender)}

${isSolo ? `CRITICAL SOLO ARTIST CHORUS MANDATES:
- 100% SINGULAR VOCAL FOCUS: The chorus is performed entirely by the solo artist. Use layered self-harmonies, ad-libs, and soaring vocal runs.
- ZERO GROUP UNISON CHANTS OR GANG SHOUTS: Strictly FORBIDDEN to use "[All]", "[Members]", or group roaring chants.
- GENDER-AUTHENTIC PRONOUNS: Strictly adhere to ${artistGender || 'the artist\'s'} individual identity and gender pronouns.` : ''}

1. ULTRA-CATCHY EARWORM HOOK (MUST GET STUCK IN HEAD ON FIRST LISTEN):
   - Keep the main hook tight (2 to 4 lines maximum of high-impact melodic or chant delivery).
   - Balance the syllable count across lines (6 to 9 syllables per line) so the melody bounces effortlessly on the beat.
   - Avoid cramming long explanatory sentences into the chorus. Prioritize rhythmic bounce, dynamic pauses, vocal chops, alliteration, and bass drops.
   - Use singable, open resonant vowels at phrase endings ("ah", "oh", "ay", "ee") for effortless crowd sing-alongs.

2. TOTAL NARRATIVE SENSE & CONTEXTUAL MEANING:
   - The chorus hook must directly express the song's core theme and make complete sense with the verses that lead into it.
   - Every line must be grammatically sound and emotionally clear—NO confusing fragments or disconnected phrases.

3. STRICT BAN ON FAKE SPECIFICITY & TIMESTAMPS:
   - Strictly NO "2 AM", "3 AM", "4 AM", "midnight", "staring at the screen/phone/ceiling", "read receipts".

4. ZERO "LESSON-LIKE" / PREACHY LECTURES & ZERO ESSAY-TALK:
   - STRICTLY FORBIDDEN: Writing motivational life-lessons, moral teachings, or philosophical speeches (e.g., "We must find our light", "Together we conquer our pain", "Never give up when the world is against you").
   - Ban formal grammar/essay filler words ("thus", "furthermore", "consequently", "endeavor", "manifestation").
   - K-pop choruses thrive on attitude, romantic tension, confidence, witty callbacks, dance grooves, and infectious earworm energy.

5. ZERO NONSENSICAL OR FORCED ONOMATOPOEIA:
   - STRICTLY FORBIDDEN: Inserting awkward sound effects or random nonsense syllables (e.g., 'tik-tak', 'ppappappa', 'ratata', 'beep-beep', 'vroom-vroom', 'skrrt', 'zoom').
   - Every word must make natural lyrical and musical sense.

6. MANDATORY SONG TITLE INTEGRATION STRATEGY:
   - YOU MUST USE THIS SPECIFIC STRATEGY TO INTEGRATE THE SONG TITLE ${trackTitle ? `"${trackTitle}"` : ''} INTO THE CHORUS:
     ★ Strategy: "${titleStrategy.name}"
     ★ Structural Blueprint: ${titleStrategy.pattern}
     ★ Description: ${titleStrategy.description}
     ★ Real K-Pop Reference Examples:
${titleStrategy.examples.map(ex => `       > ${ex}`).join('\n')}

7. DIVERSIFIED KONGLISH BLENDING (NEVER always put English at the end!):
   - English-First Launch: Start the line with English ("Honestly speaking, neo eopsi..."), end with Korean.
   - Integrated Infix Slang: Insert English slang mid-sentence with Korean particles ("I sungani so messy-haedo...", "Nae styled-up georeum...").
   - Korean Narrative Line with Deadpan English Punchline: Full Korean line followed by a dry 2-word reaction ("...not interested", "...last chance").
   - Phonetic Mirroring: Rhyme English endings with Korean words that have matching vowel sounds ("deeper" <-> "gwireul giuryeo speaker").
   - Cross-Bar Interleaving: Odd lines in 100% Romanized Korean, Even lines in 100% English.

8. STRICT AI CLICHÉ BAN:
   - BAN ALL: 'neon', 'shadow', 'line', 'lines', 'velvet', 'whisper', 'destiny', 'eternity', 'ignite', 'spark', 'flame', 'echo', 'shatter', 'soar', 'wings', 'matrix', 'glitch'.

${generation === '4th Gen' ? `4TH GENERATION CHORUS FOCUS:
- Heavy dynamic contrast, intricate multi-language blending, and sub-vocal chant layers.` : generation === '5th Gen' ? `5TH GENERATION CHORUS FOCUS:
- Instant viral hooks, relatable conversational realism (The Cupid Effect), and punchy spoken-word punchlines.` : ''}
`;
};

export const getVerse1EngineeringRules = (
  isSolo: boolean = false, 
  artistName?: string, 
  artistGender?: 'Female' | 'Male'
) => {
  const sampleV1 = getRandomVerse1Archetype(isSolo);
  return `
VERSE & SONGWRITING ENGINEERING MANDATE (CASUAL, RELATABLE, AMAZING SONGWRITING):
Verses must be casual, conversational, and effortless—NOT stiff Victorian poetry or abstract philosophical monologues.

${isSolo ? `STRICT SOLO ARTIST VERSE RULES FOR ${artistName ? `"${artistName}"` : 'SOLO ARTIST'}:
1. SINGULAR 1ST-PERSON PERSPECTIVE: Verses are written exclusively from the individual perspective ("I", "me", "my", "mine"). NO collective plurals ("we", "us", "our group").
2. GENDER-AUTHENTIC PRONOUNS: Adhere strictly to ${artistGender || 'the artist\'s'} gender (${artistGender === 'Female' ? 'Feminine perspective, she/her identity, addressing partner as boy/he/him or you' : 'Masculine perspective, he/him identity, addressing partner as girl/she/her or you'}).
3. PERFORMANCE TAGGING: Tag verses as [Verse 1: ${artistName || 'Soloist'} - ${sampleV1.name}], NOT [Sub-Vocal] or [Lead Vocal]!` : ''}

STRICT VERSE & RAP RULES:
1. COMPLETE NARRATIVE SENSE & STORY PROGRESSION:
   - Every line must make 100% sense and logically lead into the next line.
   - Establish the scene, emotional conflict, or unbothered attitude clearly without jumping between unrelated thoughts.
   - Verses establish the groove, setting, and mood without overcomplicating things.
   - Build energy naturally into the Pre-Chorus and Chorus, WITHOUT stealing the spotlight or competing with the chorus hook!

2. ZERO TIMESTAMPS OR SCREEN STARING:
   - Strictly NO "2 AM", "3 AM", "4 AM", "midnight", "staring at my screen/phone/ceiling", "read receipts".
   - Ground the verse in real interactions, facial expressions, dialogue, and physical scenes.

3. RHYTHMIC METER & BALANCED SYLLABLES:
   - Maintain a consistent, rhythmic syllable count (6 to 9 syllables per line) so the verse locks cleanly into the groove.
   - NO long essay sentences or prose paragraphs.

4. TOP-TIER K-POP RAPPING & FLOW:
   - Rapping must have authentic rhythmic pocket, cadence, locked-in syncopation, and multisyllabic internal slant rhymes.
   - Deliver witty punchlines, natural bilingual attitude, and sharp swagger (inspired by Soyeon, Changbin, Mark Lee, Jennie, Bobby).
   - Clear delivery tags: e.g. [Verse 2: ${isSolo ? (artistName || 'Soloist') : 'Main Rapper'} - 140 BPM Syncopated Pocket Flow with Bilingual Punchlines].

5. ABSOLUTELY NO GENERIC OPENINGS: NEVER start with "Walking in the room", "I look at the mirror", "The clock is ticking", "In the dark of the night", or "Sun goes down".

6. SUGGESTED VERSE 1 BLUEPRINT FOR THIS TRACK: "${sampleV1.name}"
   - Structure: ${sampleV1.blueprint}
   - Reference Style:
${sampleV1.example}

7. RHYME DYNAMICS:
   - Use internal pocket rhymes and multi-syllabic slant rhymes rather than predictable nursery end-rhymes (AABB).
   - Ground the lyrics strictly in the song's core narrative meaning.
`;
};

export const getLineDistributionRules = (
  memberCount: number = 5, 
  isSolo: boolean = false, 
  artistName?: string
) => {
  if (isSolo || memberCount === 1) {
    return `
SOLOIST VOCAL & PERFORMANCE ALLOCATION RULES:
The entire song is performed 100% by the solo artist ${artistName ? `"${artistName}"` : ''}.
There are NO member splits, NO sub-vocal trade-offs, and NO multi-member line distributions.
Line allocations reflect dynamic pacing across vocal registers and delivery styles:
- Solo Lead Vocals & Melodic Choruses: 60%
- Solo Rap Cadence / Spoken Conversational Pockets: 20%
- Solo Layered Self-Harmonies, Ad-Lib Runs & Climax Belts: 20%
Every single vocal part, harmony, ad-lib, and killing part is performed exclusively by ${artistName || 'the solo artist'}.
`;
  }

  return `
K-POP LINE DISTRIBUTION RULES (MUST BE REFLECTED IN THE LYRIC EXCERPT):
Assign the lines in the lyric excerpt to specific roles (e.g., [Main Vocal], [Main Rapper], [Sub-Vocal/Visual]).
1. The Main & Lead Vocals: Pre-choruses, choruses, bridges, and high-note belts.
2. The Main & Lead Rappers: High-impact rhythmic sections, fast syllable count, and double-time flows.
3. The Sub-Vocals, Dancers, and Visuals: Killing parts (short 2-4 second spoken-word hooks, transition intros, or post-chorus vocal chops).

GROUP SIZE DYNAMICS (${memberCount} members):
${memberCount <= 5 ? `Small Group (4-5 members): Individual showcases. Everyone gets healthy 25-35 seconds with full verse bars and shared chorus parts.` : memberCount <= 9 ? `Medium Group (6-9 members): Strategic balance. Use Unison Stacking and Call-and-Response chants ([All]) with distinct solo killing lines.` : `Large Group (10+ members): Rapid baton-passing. Short micro-lines (2-4 seconds) and dense background chants.`}
`;
};

