// services/kpopStylingTaxonomy.ts
// Comprehensive K-Pop Styling Taxonomy: Universal Styles, Boy Group Styles, Girl Group Styles,
// K-Pop Concepts (Lenses), Curated Style Mixes, and the Formula:
// Main Style + Secondary Style + Concept

export interface KpopStyleItem {
  id: string;
  name: string;
  category: 'universal' | 'boy_group' | 'girl_group';
  tagline: string;
  description: string;
  keywords: string[];
  isConceptOnly?: boolean; // e.g. Girl Crush, Bad Boy, High Teen, Femme Fatale
  curated3ColorSchemes: Array<{
    paletteName: string;
    colors: [string, string, string]; // [Base Tone, Secondary Tone, Accent Pop]
    displayString: string;
  }>;
  maleSilhouettes?: Array<{
    title: string;
    buildDescription: (c1: string, c2: string, c3: string, concept?: string) => string;
    accessories: string[];
    vibe: string;
  }>;
  femaleSilhouettes?: Array<{
    title: string;
    buildDescription: (c1: string, c2: string, c3: string, concept?: string) => string;
    accessories: string[];
    vibe: string;
  }>;
}

export interface KpopConceptItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  appliesTo: 'all' | 'boy_group' | 'girl_group';
  moodKeywords: string[];
}

export interface KpopStyleMixPreset {
  id: string;
  label: string;
  mainStyle: string;
  secondaryStyle: string;
  concept: string;
  targetGroup: 'all' | 'boy_group' | 'girl_group';
  vibeSummary: string;
  recommendedColors: [string, string, string];
}

// ============================================================================
// 1. UNIVERSAL K-POP STYLES — Boy & Girl Groups
// ============================================================================
export const UNIVERSAL_KPOP_STYLES: KpopStyleItem[] = [
  {
    id: "casual",
    name: "Casual",
    category: "universal",
    tagline: "Youthful, energetic, off-duty idol cool",
    description: "Authentic K-pop idol casual fashion celebrating youthful energy, relaxed silhouettes, and effortless street-casual charm. Built around oversized graphic hoodies, cropped lightweight zip bombers, relaxed washed denim trucker jackets, baby tees, relaxed baggy skater jeans, casual denim mini-skorts, and fresh platform sneakers. Strictly youthful idol wear with zero formal suiting, zero office blazers, and zero old-people workwear.",
    keywords: ["oversized graphic hoodie", "baggy skater denim", "cropped bomber", "baby tee", "casual denim skort", "chunky platform sneakers", "collegiate crewneck"],
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
        title: "Oversized College Graphic Hoodie & Baggy Washed Denim",
        buildDescription: (c1, c2, c3, concept) =>
          `Casual Idol Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears an oversized heavyweight French-terry hoodie in ${c1} with ${c3} vintage collegiate graphic lettering, layered with a clean ${c2} tee peeking at the hem, paired with relaxed baggy vintage-wash skater denim jeans in ${c2} and fresh chunky retro court sneakers. Strictly casual idol wear, zero workwear or formal blazers.`,
        accessories: ["Layered silver chain necklace", "Ribbed knit beanie", "Minimalist signet ring"],
        vibe: "Effortless, youthful Seoul off-duty airport idol charm."
      },
      {
        title: "Cropped Lightweight Bomber & Wide Skater Jeans",
        buildDescription: (c1, c2, c3, concept) =>
          `Casual Idol Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a relaxed lightweight zip bomber jacket in ${c1} with subtle ${c3} athletic sleeve piping, layered over a soft relaxed ${c2} graphic tee, paired with wide-leg washed skater denim in ${c2} and clean low-top court sneakers.`,
        accessories: ["Silver ear cuff", "Metal key clip", "Braided cord bracelet"],
        vibe: "Cool, athletic dance practice heartthrob presence."
      },
      {
        title: "Boxy Denim Trucker Jacket & Baggy Cargo Skate Pants",
        buildDescription: (c1, c2, c3, concept) =>
          `Casual Idol Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears an oversized washed denim trucker jacket in ${c1} with contrast ${c3} stitching, layered over a soft ${c2} crewneck tee, styled with relaxed ${c2} baggy cargo skate pants and retro high-top basketball sneakers.`,
        accessories: ["Thick silver curb chain", "Sporty baseball cap worn backwards", "Dual rings"],
        vibe: "Fresh, charismatic high-energy boyband swagger."
      },
      {
        title: "Dropped-Shoulder Collegiate Crewneck & Wide Utility Denim",
        buildDescription: (c1, c2, c3, concept) =>
          `Casual Idol Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears an oversized dropped-shoulder collegiate crewneck sweatshirt in ${c1} with ${c3} varsity chest typography, over a contrast ${c2} tee, paired with relaxed wide-leg washed utility denim in ${c2} and chunky platform trainers.`,
        accessories: ["Silver ball chain necklace", "Knit watch cap", "Leather wristband"],
        vibe: "Cozy, vibrant, and approachable superstar allure."
      },
      {
        title: "Boxy Short-Sleeve Overshirt & Loose Vintage Denim",
        buildDescription: (c1, c2, c3, concept) =>
          `Casual Idol Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a breezy boxy short-sleeve camp overshirt in ${c1} worn unbuttoned over a fitted ${c2} ribbed tank, paired with loose-fit vintage-wash blue denim in ${c2} with subtle ${c3} woven belt detail, and clean canvas sneakers.`,
        accessories: ["Dainty silver pendant", "Tortoiseshell shades hooked on collar", "Silver band"],
        vibe: "Sun-drenched, breezy summer idol off-duty cool."
      },
      {
        title: "Sporty Color-Blocked Track Zip Jacket & Baggy Skater Denim",
        buildDescription: (c1, c2, c3, concept) =>
          `Casual Idol Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a lightweight sporty zip track jacket in ${c1} with dual ${c2} and ${c3} racing sleeve stripes, over a clean ${c2} cotton base, paired with relaxed baggy vintage distressed denim in ${c2} and modern chunky sneakers.`,
        accessories: ["Sporty crossbody sling bag strap", "Ear studs", "Digital sports watch"],
        vibe: "Dynamic, fresh rehearsal studio idol cool."
      },
      {
        title: "Oversized Vintage Hockey Jersey & Baggy Denim Jorts",
        buildDescription: (c1, c2, c3, concept) =>
          `Casual Idol Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears an oversized vintage athletic hockey jersey in ${c1} with bold ${c2} and ${c3} chest numbers, paired with slouchy wide-leg ${c2} denim jorts and high-top court sneakers with white athletic crew socks.`,
        accessories: ["Silver Cuban link necklace", "Backwards dad cap", "Sport watch"],
        vibe: "Playful, rebellious 90s streetwear idol charm."
      },
      {
        title: "Layered Thermal Waffle Longsleeve & Relaxed Carpenter Denim",
        buildDescription: (c1, c2, c3, concept) =>
          `Casual Idol Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a boxy relaxed short-sleeve graphic tee in ${c1} layered over a textured ${c2} thermal waffle longsleeve, paired with loose ${c2} carpenter denim pants with ${c3} utility loop detail and low-profile skate shoes.`,
        accessories: ["Silver dog-tag necklace", "Beanie hat", "Silver ring band"],
        vibe: "Cozy skater idol practice room energy."
      }
    ],
    femaleSilhouettes: [
      {
        title: "Cropped Zip Hoodie & Baggy Vintage Washed Denim",
        buildDescription: (c1, c2, c3, concept) =>
          `Casual Idol Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a cropped boxy fleece zip hoodie in ${c1} with ${c3} contrast drawstrings, over a fitted ${c2} baby crop tee, paired with relaxed low-slung baggy vintage-wash denim jeans in ${c2} and platform retro court sneakers with scrunched athletic crew socks. Strictly casual idol wear, zero corporate blazers or workwear.`,
        accessories: ["Dainty silver star necklace", "Mini claw hair clips", "Beaded rings"],
        vibe: "Trendsetting, breezy idol airport fashion icon."
      },
      {
        title: "Cropped Denim Jacket & Pleated Denim Mini-Skort",
        buildDescription: (c1, c2, c3, concept) =>
          `Casual Idol Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a cute cropped washed denim jacket in ${c1} with silver buttons, over a soft ${c2} ribbed baby tee with subtle ${c3} print, paired with a matching structured ${c1} pleated denim mini-skort and chunky white platform sneakers with athletic ankle socks.`,
        accessories: ["Silver hoop earrings", "Cute satin hair ribbon", "Layered dainty chains"],
        vibe: "Bright, youthful music video center pop star charm."
      },
      {
        title: "Oversized Collegiate Sweatshirt & Casual Pleated Skort",
        buildDescription: (c1, c2, c3, concept) =>
          `Casual Idol Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears an oversized slouchy collegiate crewneck sweatshirt in ${c1} with bold ${c3} varsity typography worn casually off one shoulder, layered over a ${c2} fitted tank, paired with a cute ${c2} pleated casual tennis skort and retro platform trainers with white crew socks.`,
        accessories: ["Scrunchie on wrist", "Small silver hoops", "Heart charm necklace"],
        vibe: "Effervescent, sporty-sweet youth idol allure."
      },
      {
        title: "Soft Cropped Baby Cardigan & Wide-Leg Cargo Denim",
        buildDescription: (c1, c2, c3, concept) =>
          `Casual Idol Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a soft cropped fine-knit baby cardigan in ${c1} with cute ${c2} buttons over a fitted scoop-neck ${c2} baby tank, paired with high-waisted relaxed wide-leg ${c2} cargo denim jeans featuring subtle ${c3} stitching, and clean platform sneakers.`,
        accessories: ["Dainty wildflower choker", "Pastel beaded bracelet", "Cute hair clips"],
        vibe: "Dreamy, effortless girl-next-door superstar allure."
      },
      {
        title: "Boxy Short-Sleeve Overshirt & High-Waist Baggy Skater Denim",
        buildDescription: (c1, c2, c3, concept) =>
          `Casual Idol Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a cropped boxy short-sleeve overshirt in ${c1} unbuttoned over a ${c2} ribbed halter crop top with ${c3} piping, paired with relaxed high-waisted wide-leg ${c2} washed skater denim and chunky platform kicks.`,
        accessories: ["Silver star pendant", "Tinted sunglasses on head", "Silver ear cuff stack"],
        vibe: "Fresh, confident Seoul street-casual cool."
      },
      {
        title: "Sporty Color-Blocked Windbreaker & Casual A-Line Skort",
        buildDescription: (c1, c2, c3, concept) =>
          `Casual Idol Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a cropped color-blocked nylon windbreaker in ${c1} with ${c3} neon piping, over a soft ${c2} fitted crop tee, paired with a high-waisted ${c1} casual A-line denim skort and chunky retro runners with athletic crew socks.`,
        accessories: ["Sporty hair tie", "Silver micro hoops", "Crossbody mini bag strap"],
        vibe: "High-energy, athletic dance practice center idol."
      },
      {
        title: "Oversized Vintage Racing Jersey & Relaxed Denim Jorts",
        buildDescription: (c1, c2, c3, concept) =>
          `Casual Idol Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears an oversized vintage motocross racing jersey in ${c1} with bold ${c2} and ${c3} sponsor graphics, paired with slouchy ${c2} denim jorts, crew socks, and platform sneakers.`,
        accessories: ["Silver chain necklace", "Thick headband", "Silver hoops"],
        vibe: "Rebellious, energetic girl group main dancer swagger."
      },
      {
        title: "Baby Crop Tee & Layered Cargo Skater Skirt",
        buildDescription: (c1, c2, c3, concept) =>
          `Casual Idol Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a fitted 90s baby tee in ${c1} with subtle ${c3} collegiate lettering, paired with a relaxed low-rise ${c2} casual cargo mini skirt with subtle buckle hardware, scrunched white socks, and chunky platform sneakers.`,
        accessories: ["Silver star barrettes", "Dainty beaded choker", "Silver ring set"],
        vibe: "Playful, carefree Y2K casual idol charisma."
      }
    ]
  },
  {
    id: "streetwear",
    name: "Streetwear",
    category: "universal",
    tagline: "Casual, urban, youthful, confident",
    description: "Fashion influenced by contemporary street culture, giving a relaxed but intentionally cool appearance. Characterized by oversized boxy bombers, cargo/parachute trousers, hooded silhouettes, graphic layers, and statement sneakers.",
    keywords: ["oversized bomber", "cargo pants", "parachute pants", "graphic hoodie", "chunky sneakers", "chain necklaces"],
    curated3ColorSchemes: [
      {
        paletteName: "Electric Lime, Obsidian Black & Optic White",
        colors: ["Electric Lime", "Obsidian Black", "Optic White"],
        displayString: "Electric Lime, Obsidian Black, and Optic White"
      },
      {
        paletteName: "Signal Orange, Steel Grey & Chalk White",
        colors: ["Signal Orange", "Steel Grey", "Chalk White"],
        displayString: "Signal Orange, Steel Grey, and Chalk White"
      },
      {
        paletteName: "Royal Purple, Matte Black & Acid Yellow",
        colors: ["Royal Purple", "Matte Black", "Acid Yellow"],
        displayString: "Royal Purple, Matte Black, and Acid Yellow"
      }
    ],
    maleSilhouettes: [
      {
        title: "Oversized MA-1 Bomber & Wide Skate Denim",
        buildDescription: (c1, c2, c3, concept) =>
          `Streetwear Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a voluminous cropped MA-1 nylon bomber in ${c1} with ${c2} contrast rib-knit accents, over a boxy ${c3} heavyweight graphic tee, styled with ultra-baggy ${c2} skate denim pooling over chunky platform sneakers.`,
        accessories: ["Heavy Cuban link chain", "Silver wallet chain", "Chunky signet ring"],
        vibe: "Magnetic street swagger with relaxed urban dominance."
      },
      {
        title: "Two-Tone Windbreaker & Parachute Cargo Pants",
        buildDescription: (c1, c2, c3, concept) =>
          `Streetwear Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a color-blocked zip windbreaker jacket in ${c1} and ${c3}, layered over a ${c2} mock-neck compression base, paired with wide ${c2} parachute pants and high-top skate shoes.`,
        accessories: ["Industrial ball chains", "Embroidered beanie", "Black matte ring"],
        vibe: "Sharp, athletic Seoul streetwear energy."
      }
    ],
    femaleSilhouettes: [
      {
        title: "Cropped Racing Bomber & Wide-Leg Cargo Trousers",
        buildDescription: (c1, c2, c3, concept) =>
          `Streetwear Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a cropped padded racing bomber jacket in ${c1} with ${c3} sleeve stripes, layered over a fitted ${c2} zip crop top, paired with relaxed low-rise ${c2} cargo trousers and chunky platform kicks.`,
        accessories: ["Chunky silver chain choker", "Silver belly chain", "Angular dark sunglasses"],
        vibe: "Fierce, trend-setting street-luxe idol swagger."
      },
      {
        title: "Oversized Vintage Jersey & Baggy Skater Denim",
        buildDescription: (c1, c2, c3, concept) =>
          `Streetwear Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears an oversized vintage hockey/motocross jersey in ${c1} with ${c2} and ${c3} typography, paired with slouchy ${c2} baggy denim jorts and high-top sneakers with scrunched athletic socks.`,
        accessories: ["Thick chain necklace", "Hoop earrings with charms", "Beanie hat"],
        vibe: "Playful, rebellious street icon presence."
      }
    ]
  },
  {
    id: "high_fashion",
    name: "High Fashion / Editorial",
    category: "universal",
    tagline: "Dramatic, luxurious, artistic",
    description: "Fashion inspired by runway and editorial styling, focusing on striking proportions, unusual architectural tailoring, dramatic draping, and a visually elevated luxury appearance.",
    keywords: ["architectural tailoring", "runway silhouette", "asymmetrical drape", "sculptural sleeves", "editorial cuts"],
    curated3ColorSchemes: [
      {
        paletteName: "Midnight Black, Pure Alabaster & Liquid Gold",
        colors: ["Midnight Black", "Pure Alabaster", "Liquid Gold"],
        displayString: "Midnight Black, Pure Alabaster, and Liquid Gold"
      },
      {
        paletteName: "Deep Crimson, Charcoal Slate & Molten Silver",
        colors: ["Deep Crimson", "Charcoal Slate", "Molten Silver"],
        displayString: "Deep Crimson, Charcoal Slate, and Molten Silver"
      },
      {
        paletteName: "Electric Violet, Liquid Chrome & Onyx Noir",
        colors: ["Electric Violet", "Liquid Chrome", "Onyx Noir"],
        displayString: "Electric Violet, Liquid Chrome, and Onyx Noir"
      }
    ],
    maleSilhouettes: [
      {
        title: "Architectural Cutout Blazer & High-Waist Column Slacks",
        buildDescription: (c1, c2, c3, concept) =>
          `High Fashion / Editorial Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears an avant-garde single-button blazer in ${c1} featuring side architectural waist cutouts and ${c3} satin lapels, styled with a clean ${c3} silk cummerbund sash, high-waist fluid ${c2} wool trousers, and square-toe patent boots. Strictly NO techwear, NO tactical gear, and NO harnesses.`,
        accessories: ["Sculptural metal ear cuff", "Liquid silver knuckle ring", "Minimal collar torque"],
        vibe: "Dramatic runway authority with daring artistic power."
      }
    ],
    femaleSilhouettes: [
      {
        title: "Sculptural Peplum Corset & Asymmetric Draped Skirt",
        buildDescription: (c1, c2, c3, concept) =>
          `High Fashion / Editorial Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a structured sculptural boned corset in ${c1} with ${c3} metallic piping, layered over a sheer ${c2} micro-mesh sleeve top, paired with an asymmetric floor-grazing draped ${c1} silk taffeta skirt and pointed stiletto boots.`,
        accessories: ["Architectural choker", "Geometric molten cuffs", "Ear crawler"],
        vibe: "Hypnotic, avant-garde couture editorial glamour."
      }
    ]
  },
  {
    id: "retro",
    name: "Retro / Vintage",
    category: "universal",
    tagline: "Nostalgic, throwback, decade-inspired",
    description: "Fashion that draws from the visual identity of specific past decades (70s disco collars, 80s shoulder silhouettes, 90s vintage wash), creating a soulful nostalgic charm.",
    keywords: ["flared trousers", "vintage wash", "retro colorblock", "camp collar", "wide lapels"],
    curated3ColorSchemes: [
      {
        paletteName: "Mustard Gold, Rust Orange & Vintage Indigo",
        colors: ["Mustard Gold", "Rust Orange", "Vintage Indigo"],
        displayString: "Mustard Gold, Rust Orange, and Vintage Indigo"
      },
      {
        paletteName: "Olive Green, Warm Cream & Burnt Ochre",
        colors: ["Olive Green", "Warm Cream", "Burnt Ochre"],
        displayString: "Olive Green, Warm Cream, and Burnt Ochre"
      }
    ],
    maleSilhouettes: [
      {
        title: "Camp-Collar Retro Silk Shirt & Flared Wool Trousers",
        buildDescription: (c1, c2, c3, concept) =>
          `Retro / Vintage Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a fluid wide camp-collar shirt in ${c1} with geometric ${c2} piping, paired with high-waist flared ${c3} wool trousers and polished leather Cuban heel boots.`,
        accessories: ["Tinted 70s aviators", "Vintage gold chain", "Carved stone signet ring"],
        vibe: "Soulful retro superstar with nostalgic cinematic warmth."
      }
    ],
    femaleSilhouettes: [
      {
        title: "Vintage Halter Knit Top & High-Rise Flared Denim",
        buildDescription: (c1, c2, c3, concept) =>
          `Retro / Vintage Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a crochet-trim halter top in ${c1} with ${c2} striped borders, paired with high-rise patched ${c3} flared bell-bottom denim and polished platform leather boots.`,
        accessories: ["Tinted round sunglasses", "Beaded choker", "Vintage brass hoops"],
        vibe: "Charming nostalgic 70s-80s throwback idol appeal."
      }
    ]
  },
  {
    id: "minimalist",
    name: "Minimalist",
    category: "universal",
    tagline: "Clean, simple, understated",
    description: "A polished aesthetic built around simplicity, balanced proportions, restrained details, architectural silhouettes, and an uncluttered, distraction-free appearance.",
    keywords: ["clean lines", "monochromatic", "uncluttered", "tailored fluid drape", "restrained elegance"],
    curated3ColorSchemes: [
      {
        paletteName: "Crisp Chalk White, Slate Grey & Jet Black",
        colors: ["Crisp Chalk White", "Slate Grey", "Jet Black"],
        displayString: "Crisp Chalk White, Slate Grey, and Jet Black"
      },
      {
        paletteName: "Oatmeal Beige, Cool Stone & Espresso",
        colors: ["Oatmeal Beige", "Cool Stone", "Espresso Brown"],
        displayString: "Oatmeal Beige, Cool Stone, and Espresso Brown"
      }
    ],
    maleSilhouettes: [
      {
        title: "Collarless Boxy Jacket & Seamless Fluid Slacks",
        buildDescription: (c1, c2, c3, concept) =>
          `Minimalist Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a collarless boxy wool jacket in ${c1} with concealed snap closures, layered over a seamless fine-rib ${c2} crew top, styled with straight fluid ${c3} trousers and matte leather derbies.`,
        accessories: ["Brushed titanium band", "Single geometric stud", "Slim black leather watch"],
        vibe: "Pristine, serene, and effortlessly modern."
      }
    ],
    femaleSilhouettes: [
      {
        title: "Architectural Column Vest & Wide Pleated Trousers",
        buildDescription: (c1, c2, c3, concept) =>
          `Minimalist Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a longline structured sleeveless vest in ${c1} with clean welt pockets, layered over a ${c2} silk bandeau, paired with fluid high-waist ${c3} palazzo slacks and minimal square-toe mules.`,
        accessories: ["Minimal silver bar pendant", "Sculptural ear wire", "Slim metal cuff"],
        vibe: "Understated, tranquil, and architecturally striking."
      }
    ]
  },
  {
    id: "sporty",
    name: "Sporty",
    category: "universal",
    tagline: "Energetic, athletic, youthful",
    description: "Fashion influenced by athletic culture that creates an active, effortless, energetic impression with retro racing jerseys, technical windbreakers, tennis skirts, track jackets, and speed trainers.",
    keywords: ["athletic jersey", "racing stripes", "speed runner", "track jacket", "breathable mesh"],
    curated3ColorSchemes: [
      {
        paletteName: "Cobalt Blue, Optic White & Crimson Red",
        colors: ["Cobalt Blue", "Optic White", "Crimson Red"],
        displayString: "Cobalt Blue, Optic White, and Crimson Red"
      },
      {
        paletteName: "Forest Green, Chalk Cream & Sun Yellow",
        colors: ["Forest Green", "Chalk Cream", "Sun Yellow"],
        displayString: "Forest Green, Chalk Cream, and Sun Yellow"
      }
    ],
    maleSilhouettes: [
      {
        title: "Technical Track Jacket & Nylon Athletic Shorts",
        buildDescription: (c1, c2, c3, concept) =>
          `Sporty Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a technical zip track jacket in ${c1} with bold ${c2} racing chevron stripes, over a breathable ${c3} athletic mesh top, paired with knee-length ${c1} track shorts over compression tights and speed running sneakers.`,
        accessories: ["Sport sweatband", "Silicone digital timer watch", "Athletic crew socks"],
        vibe: "High-octane athletic dynamism and boyish agility."
      }
    ],
    femaleSilhouettes: [
      {
        title: "Cropped Zip Track Top & Pleated Athletic Tennis Skort",
        buildDescription: (c1, c2, c3, concept) =>
          `Sporty Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a cropped performance zip top in ${c1} with contrast ${c2} piping, paired with a matching ${c3} pleated tennis skort with inner compression shorts, crew socks, and retro running trainers.`,
        accessories: ["Sporty visor", "Wrist sweatbands", "Dainty stud earrings"],
        vibe: "Bright, energetic, and effortlessly agile."
      }
    ]
  },
  {
    id: "dark_gothic",
    name: "Dark / Gothic",
    category: "universal",
    tagline: "Mysterious, dramatic, intense",
    description: "A darker aesthetic centered around moodiness, mystery, drama, and rebellion. Features rich black velvet, distressed lace, dark silver hardware, choker collars, and brooding dramatic tailoring.",
    keywords: ["black velvet", "distressed lace", "corset lacing", "dark silver hardware", "brooding drape"],
    curated3ColorSchemes: [
      {
        paletteName: "Pitch Obsidian, Blood Wine Red & Antique Silver",
        colors: ["Pitch Obsidian", "Blood Wine Red", "Antique Silver"],
        displayString: "Pitch Obsidian, Blood Wine Red, and Antique Silver"
      },
      {
        paletteName: "Midnight Navy, Raven Black & Burnished Pewter",
        colors: ["Midnight Navy", "Raven Black", "Burnished Pewter"],
        displayString: "Midnight Navy, Raven Black, and Burnished Pewter"
      }
    ],
    maleSilhouettes: [
      {
        title: "Victorian Gothic Longline Coat & Leather Slacks",
        buildDescription: (c1, c2, c3, concept) =>
          `Dark / Gothic Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a dramatic ankle-length tailored frock coat in ${c1} featuring ${c2} velvet lapels, layered over an open-collar ruffled ${c2} silk shirt, fitted ${c1} leather pants, and buckled pointed gothic boots.`,
        accessories: ["Layered thorn & cross antique silver chains", "Ornate onyx rings", "Leather wrist gauntlet"],
        vibe: "Brooding vampiric elegance and theatrical dark charisma."
      }
    ],
    femaleSilhouettes: [
      {
        title: "Gothic Corset Gown & Sheer Lace Tiered Skirt",
        buildDescription: (c1, c2, c3, concept) =>
          `Dark / Gothic Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a boned velvet corset in ${c1} with ${c3} antique silver eyelet lacing, over a sheer ${c2} lace bell-sleeve blouse, paired with an asymmetric tiered ${c1} tulle-and-lace skirt and lace-up platform combat boots.`,
        accessories: ["Velvet choker with dark gemstone", "Lace fingerless gloves", "Gothic silver ear climbers"],
        vibe: "Ethereal dark enchantress with hypnotic, seductive presence."
      }
    ]
  },
  {
    id: "romantic",
    name: "Romantic",
    category: "universal",
    tagline: "Soft, dreamy, delicate",
    description: "A gentle aesthetic emphasizing beauty, softness, elegance, and dreamy visual qualities. Features diaphanous organza, pastel silks, floral embroideries, soft ruffles, and gentle fluid tailoring.",
    keywords: ["sheer organza", "pastel silks", "ruffled collars", "delicate embroidery", "dreamy drape"],
    curated3ColorSchemes: [
      {
        paletteName: "Soft Blush Pink, Pearl White & Dusty Lilac",
        colors: ["Soft Blush Pink", "Pearl White", "Dusty Lilac"],
        displayString: "Soft Blush Pink, Pearl White, and Dusty Lilac"
      },
      {
        paletteName: "Pale Champagne, Mist Blue & Soft Rose",
        colors: ["Pale Champagne", "Mist Blue", "Soft Rose"],
        displayString: "Pale Champagne, Mist Blue, and Soft Rose"
      }
    ],
    maleSilhouettes: [
      {
        title: "Romantic Draped Silk Blouse & Fluid Tailored Slacks",
        buildDescription: (c1, c2, c3, concept) =>
          `Romantic Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a fluid draped poet blouse in ${c1} silk with soft gathering at the wrists, layered with a subtle ${c2} embroidered vest, paired with high-waisted ${c3} flowing crepe trousers and soft suede slip-ons.`,
        accessories: ["Delicate pearl strand necklace", "Floral silver brooch", "Thin ribbon bow"],
        vibe: "Poetic prince with tender, dreamy emotional depth."
      }
    ],
    femaleSilhouettes: [
      {
        title: "Tiered Ruffle Organza Dress & Draped Pearl Strands",
        buildDescription: (c1, c2, c3, concept) =>
          `Romantic Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a dreamy tiered ruffle dress in sheer ${c1} organza layered over a soft ${c2} silk slip, accented with delicate draped ${c3} pearl strands and satin ribbon-tie ballet flats. Strictly NO techwear or tactical gear.`,
        accessories: ["Silk ribbon hair ties", "Dainty pearl drop earrings", "Rose-gold rings"],
        vibe: "Breathtaking fairytale romance and gentle elegance."
      }
    ]
  },
  {
    id: "fantasy",
    name: "Fantasy",
    category: "universal",
    tagline: "Magical, ethereal, otherworldly",
    description: "Fashion designed to evoke fictional, mythical, magical, or dreamlike worlds. Uses celestial sheer cloaks, iridescent shimmering textiles, ornate filigree armour accents, and celestial motifs.",
    keywords: ["iridescent silk", "celestial embroidery", "filigree metal accents", "floating capelet", "mythical aesthetic"],
    curated3ColorSchemes: [
      {
        paletteName: "Starlight Silver, Celestial Cyan & Midnight Indigo",
        colors: ["Starlight Silver", "Celestial Cyan", "Midnight Indigo"],
        displayString: "Starlight Silver, Celestial Cyan, and Midnight Indigo"
      },
      {
        paletteName: "Moonlight Opal, Ethereal Lavender & Frost White",
        colors: ["Moonlight Opal", "Ethereal Lavender", "Frost White"],
        displayString: "Moonlight Opal, Ethereal Lavender, and Frost White"
      }
    ],
    maleSilhouettes: [
      {
        title: "Celestial Draped Tunic & Shimmering Armour Accents",
        buildDescription: (c1, c2, c3, concept) =>
          `Fantasy Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears an ethereal high-collar draped tunic in shimmering ${c1} silk with an asymmetrical ${c2} capelet, accented with sculpted ${c3} silver filigree shoulder guards, tailored slacks, and celestial boots.`,
        accessories: ["Silver elven ear cuff", "Star-sapphire pendant", "Filigree chain ring"],
        vibe: "Otherworldly celestial royalty with mystical aura."
      }
    ],
    femaleSilhouettes: [
      {
        title: "Ethereal Iridescent Gown & Luminescent Capelet",
        buildDescription: (c1, c2, c3, concept) =>
          `Fantasy Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a floating high-low gown crafted in iridescent ${c1} chiffon that shifts color under light, layered with a sheer ${c2} crystalline capelet, ${c3} silver filigree waist corset, and lace-up satin boots.`,
        accessories: ["Celestial diadem headband", "Crystal drop earrings", "Iridescent body shimmer"],
        vibe: "Magical fairy-tale sovereign with transcendent presence."
      }
    ]
  },
  {
    id: "urban_chic",
    name: "Urban Chic",
    category: "universal",
    tagline: "Sophisticated, contemporary, city-inspired",
    description: "A polished combination of modern urban fashion and refined styling. Tailored trench coats, sleek mock necks, structured trousers, clean leather accents, and razor-sharp city silhouettes.",
    keywords: ["tailored trench", "mock neck", "city tailoring", "clean leather accents", "sharp modern silhouette"],
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
        title: "Modern Minimalist Trench & Tailored City Trousers",
        buildDescription: (c1, c2, c3, concept) =>
          `Urban Chic Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears an open, belted fluid trench coat in ${c1}, layered over a sleek ${c2} fine-knit mock neck, paired with slim-straight ${c3} wool trousers and polished leather chelsea boots.`,
        accessories: ["Sleek titanium sunglasses", "Minimal leather watch", "Silver band ring"],
        vibe: "Cosmopolitan Seoul star with effortless metropolis cool."
      }
    ],
    femaleSilhouettes: [
      {
        title: "Structured Belted Blazer Dress & Knee-High Leather Boots",
        buildDescription: (c1, c2, c3, concept) =>
          `Urban Chic Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a sharply structured double-breasted blazer dress in ${c1} with ${c3} horn buttons and a wide ${c2} leather waist belt, paired with sheer tights and sleek knee-high leather boots.`,
        accessories: ["Sculptural gold hoops", "Mini designer leather bag", "Sleek cat-eye sunglasses"],
        vibe: "Commanding, chic urban powerhouse with effortless allure."
      }
    ]
  },
  {
    id: "y2k",
    name: "Y2K",
    category: "universal",
    tagline: "Playful, flashy, early-2000s-inspired",
    description: "Fashion influenced by late-1990s and early-2000s pop culture, creating a youthful, flashy, and attention-grabbing aesthetic with baby tees, low-slung cargo pants, sporty track jackets, and tinted lenses.",
    keywords: ["baby tee", "low-rise cargo", "metallic silver", "tinted frameless shades", "butterfly clips"],
    curated3ColorSchemes: [
      {
        paletteName: "Hot Bubblegum Pink, Ice Silver & Pure White",
        colors: ["Hot Bubblegum Pink", "Ice Silver", "Pure White"],
        displayString: "Hot Bubblegum Pink, Ice Silver, and Pure White"
      },
      {
        paletteName: "Electric Cyan, Jet Black & Optic White",
        colors: ["Electric Cyan", "Jet Black", "Optic White"],
        displayString: "Electric Cyan, Jet Black, and Optic White"
      }
    ],
    maleSilhouettes: [
      {
        title: "Retro Track Zip & Low-Slung Baggy Denim",
        buildDescription: (c1, c2, c3, concept) =>
          `Y2K Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a retro sporty zip track jacket in ${c1} with reflective ${c2} piping, over an optic ${c3} ribbed tank, paired with low-slung wide ${c2} washed jeans and chunky millennium runners.`,
        accessories: ["Frameless tinted sunglasses", "Dog tag necklace", "Silver ear studs"],
        vibe: "Nostalgic 2000s boyband heartthrob swagger."
      }
    ],
    femaleSilhouettes: [
      {
        title: "Shrunken Baby Tee & Low-Rise Cargo Mini Skirt",
        buildDescription: (c1, c2, c3, concept) =>
          `Y2K Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a shrunken contrast-stitch baby tee in ${c1} with glitter ${c3} typography, paired with a low-rise ${c2} nylon cargo mini skirt, knee-high warmers, and platform sneakers.`,
        accessories: ["Rhinestone hair clips", "Tinted oval sunglasses", "Silver star belly chain"],
        vibe: "Peak millennium pop princess high-energy nostalgia."
      }
    ]
  },
  {
    id: "punk_rock",
    name: "Punk / Rock",
    category: "universal",
    tagline: "Rebellious, edgy, expressive",
    description: "Fashion influenced by punk and rock culture, emphasizing individuality, attitude, and deliberate roughness. Features safety pins, studded leather, shredded denim, tartan plaids, and chunky combat boots.",
    keywords: ["biker leather", "safety pins", "tartan plaid", "distressed denim", "combat boots"],
    curated3ColorSchemes: [
      {
        paletteName: "Heritage Tartan Red, Pitch Black & Smoked Chrome",
        colors: ["Heritage Tartan Red", "Pitch Black", "Smoked Chrome"],
        displayString: "Heritage Tartan Red, Pitch Black, and Smoked Chrome"
      },
      {
        paletteName: "Acid Neon Green, Jet Black & Distressed Silver",
        colors: ["Acid Neon Green", "Jet Black", "Distressed Silver"],
        displayString: "Acid Neon Green, Jet Black, and Distressed Silver"
      }
    ],
    maleSilhouettes: [
      {
        title: "Distressed Studded Moto Jacket & Shredded Denim",
        buildDescription: (c1, c2, c3, concept) =>
          `Punk / Rock Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a customized studded leather moto jacket in ${c2} with ${c1} paint-splatter stencil, over a distressed ${c3} band tee, paired with shredded raw ${c2} denim and steel-toe combat boots.`,
        accessories: ["Chunky padlock necklace", "Leather cuff with studs", "Silver skull rings"],
        vibe: "Fierce, unapologetic rock energy with idol attitude."
      }
    ],
    femaleSilhouettes: [
      {
        title: "Cropped Biker Jacket & Pleated Tartan Skirt",
        buildDescription: (c1, c2, c3, concept) =>
          `Punk / Rock Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a cropped zip biker jacket in ${c2}, layered over a mesh ${c3} long-sleeve crop top, paired with an asymmetrical safety-pinned ${c1} tartan pleated skirt, ripped fishnets, and platform combat boots.`,
        accessories: ["O-ring leather choker", "Spiked ear cuffs", "Layered ball-chain necklace"],
        vibe: "Badass punk idol with high-impact stage presence."
      }
    ]
  },
  {
    id: "cute_youthful",
    name: "Cute / Youthful",
    category: "universal",
    tagline: "Cheerful, playful, innocent",
    description: "A bright aesthetic designed to create a youthful, energetic, approachable, and charming image. Pastel palettes, playful cartoon or floral graphics, relaxed dungarees, cozy oversized knitwear, and bright sneakers.",
    keywords: ["pastel colorblock", "cozy oversized knit", "playful patches", "bright sneakers", "cheerful charm"],
    curated3ColorSchemes: [
      {
        paletteName: "Butter Yellow, Sky Blue & Chalk Cream",
        colors: ["Butter Yellow", "Sky Blue", "Chalk Cream"],
        displayString: "Butter Yellow, Sky Blue, and Chalk Cream"
      },
      {
        paletteName: "Coral Peach, Mint Green & Soft White",
        colors: ["Coral Peach", "Mint Green", "Soft White"],
        displayString: "Coral Peach, Mint Green, and Soft White"
      }
    ],
    maleSilhouettes: [
      {
        title: "Oversized Pastel Knit & Relaxed Cream Chinos",
        buildDescription: (c1, c2, c3, concept) =>
          `Cute / Youthful Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears an oversized fluffy knit crewneck in ${c1} featuring cheerful ${c2} stripe accents, layered over a soft ${c3} collared shirt, paired with relaxed ${c3} chinos and bright retro sneakers.`,
        accessories: ["Beaded colorful necklace", "Playful enamel badge", "Soft canvas tote strap"],
        vibe: "Sweet, charming boy-next-door idol innocence."
      }
    ],
    femaleSilhouettes: [
      {
        title: "Pastel Dungaree Romper & Striped Baby Tee",
        buildDescription: (c1, c2, c3, concept) =>
          `Cute / Youthful Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a cute corduroy overall romper in ${c1}, over a fitted ${c2} and ${c3} striped baby tee, paired with ruffled ankle socks and pastel platform canvas sneakers.`,
        accessories: ["Colorful flower hair clips", "Beaded charm bracelet", "Cute ribbon scrunchie"],
        vibe: "Bright, heart-melting youthful idol warmth."
      }
    ]
  },
  {
    id: "elegant",
    name: "Elegant",
    category: "universal",
    tagline: "Refined, graceful, sophisticated",
    description: "A polished aesthetic focused on timeless beauty, sophistication, and composure. Flowing silk suiting, sharp monochrome tailoring, delicate pearl accents, and graceful poise.",
    keywords: ["fluid silk suiting", "timeless composure", "pearl accents", "graceful tailoring", "monochrome elegance"],
    curated3ColorSchemes: [
      {
        paletteName: "Ivory White, Champagne Gold & Charcoal",
        colors: ["Ivory White", "Champagne Gold", "Charcoal Slate"],
        displayString: "Ivory White, Champagne Gold, and Charcoal Slate"
      },
      {
        paletteName: "Midnight Navy, Pearl Silver & Soft Cream",
        colors: ["Midnight Navy", "Pearl Silver", "Soft Cream"],
        displayString: "Midnight Navy, Pearl Silver, and Soft Cream"
      }
    ],
    maleSilhouettes: [
      {
        title: "Tailored Single-Breasted Silk Suit & Satin Lapels",
        buildDescription: (c1, c2, c3, concept) =>
          `Elegant Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears an impeccably tailored single-breasted suit in ${c1} featuring subtle ${c2} satin peak lapels, over an open-collar ${c2} silk crepe shirt, paired with pressed matching trousers and cordovan leather dress oxfords.`,
        accessories: ["Mother-of-pearl cufflinks", "Sleek silver dress watch", "Minimalist signet ring"],
        vibe: "Timeless sophistication, poise, and dignified grace."
      }
    ],
    femaleSilhouettes: [
      {
        title: "Fluid Silk Crepe Gown & Architectural Blazer",
        buildDescription: (c1, c2, c3, concept) =>
          `Elegant Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a floor-length bias-cut silk slip gown in ${c1}, draped with an architectural tailored smoking jacket in ${c3} over the shoulders, finished with delicate ${c2} heeled strappy sandals.`,
        accessories: ["Cascading pearl earrings", "Delicate diamond tennis bracelet", "Silk clutch"],
        vibe: "Graceful red-carpet majesty and refined idol composure."
      }
    ]
  },
  {
    id: "preppy",
    name: "Preppy",
    category: "universal",
    tagline: "Polished, youthful, collegiate",
    description: "A neat and put-together style associated with academic, collegiate, and traditionally polished fashion. Features varsity knit cardigans, school-crest blazers, pleated tennis skirts/slacks, and penny loafers.",
    keywords: ["varsity cardigan", "pleated skirt", "school-crest blazer", "cable knit", "penny loafers"],
    curated3ColorSchemes: [
      {
        paletteName: "Midnight Navy, Chalk White & Crimson Red",
        colors: ["Midnight Navy", "Chalk White", "Crimson Red"],
        displayString: "Midnight Navy, Chalk White, and Crimson Red"
      },
      {
        paletteName: "Forest Green, Ecru Cream & Golden Amber",
        colors: ["Forest Green", "Ecru Cream", "Golden Amber"],
        displayString: "Forest Green, Ecru Cream, and Golden Amber"
      },
      {
        paletteName: "Oxford Maroon, Camel Tan & Crisp White",
        colors: ["Oxford Maroon", "Camel Tan", "Crisp White"],
        displayString: "Oxford Maroon, Camel Tan, and Crisp White"
      }
    ],
    maleSilhouettes: [
      {
        title: "Varsity Knit Cardigan & Pleated Trousers",
        buildDescription: (c1, c2, c3, concept) =>
          `Preppy Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a relaxed collegiate varsity knit cardigan in ${c1} featuring crisp ${c2} sleeve stripes, layered over a ${c2} oxford button-down shirt with a slim ${c3} knit tie, paired with tailored ${c1} double-pleated trousers, white crew socks, and polished penny loafers.`,
        accessories: ["Collegiate crest lapel pin", "Vintage leather-strap dress watch", "Signet ring"],
        vibe: "Charismatic Ivy League campus star with effortless charm."
      }
    ],
    femaleSilhouettes: [
      {
        title: "Cropped Varsity Knit & Pleated Tennis Skirt",
        buildDescription: (c1, c2, c3, concept) =>
          `Preppy Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a cropped varsity knit cardigan in ${c1} with ${c2} contrast stripe piping, paired with a high-rise pleated tennis skirt in ${c2} with a delicate ${c3} hem stripe, white crew socks, and chunky lug-sole loafers.`,
        accessories: ["Pearl hair barrette", "Delicate gold chain pendant", "Vintage watch"],
        vibe: "Iconic high-teen K-pop prep queen with youthful charisma."
      }
    ]
  },
  {
    id: "luxury_quiet_luxury",
    name: "Luxury / Quiet Luxury",
    category: "universal",
    tagline: "Expensive-looking, understated, refined",
    description: "A sophisticated aesthetic communicating quality and wealth through subtlety rather than obvious excess. Double-faced cashmere, fine-gauge merino knits, tailored wool overcoats, and discreet designer craftsmanship.",
    keywords: ["cashmere overcoat", "fine merino knit", "discreet tailoring", "cordovan leather", "quiet wealth"],
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
      }
    ],
    maleSilhouettes: [
      {
        title: "Double-Breasted Wool Overcoat & Fine Merino Turtleneck",
        buildDescription: (c1, c2, c3, concept) =>
          `Luxury / Quiet Luxury Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a tailored double-breasted overcoat in ${c1}, layered over a fine-gauge ${c2} merino turtleneck knit with subtle ${c3} pocket square accent, pressed ${c1} pleated trousers, and cordovan leather dress oxfords.`,
        accessories: ["Gold heirloom signet ring", "Vintage leather-strap watch", "Tortoiseshell glasses"],
        vibe: "Quiet luxury prestige with aristocratic elegance."
      }
    ],
    femaleSilhouettes: [
      {
        title: "Houndstooth Tweed Jacket & Pleated Wool Midi Skirt",
        buildDescription: (c1, c2, c3, concept) =>
          `Luxury / Quiet Luxury Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a collarless cropped tweed jacket in ${c1} and ${c2} with pearl buttons, layered over a ${c2} silk tie blouse with ${c3} ribbon, paired with an elegant high-waisted ${c1} wool midi skirt and polished leather riding boots.`,
        accessories: ["Double-strand pearl necklace", "Gold vintage watch", "Velvet headband"],
        vibe: "Timeless dynasty heiress poise and regal poise."
      }
    ]
  },
  {
    id: "casual_chic",
    name: "Casual Chic",
    category: "universal",
    tagline: "Relaxed, polished, effortless",
    description: "Everyday fashion that feels comfortable and natural while still looking intentionally styled. Boxy overshirts, high-quality modal tees, relaxed straight-leg denim, and clean designer leather sneakers.",
    keywords: ["boxy overshirt", "relaxed denim", "clean white sneakers", "effortless styling", "off-duty idol"],
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
      }
    ],
    maleSilhouettes: [
      {
        title: "Relaxed Boxy Overshirt & Straight-Leg Washed Denim",
        buildDescription: (c1, c2, c3, concept) =>
          `Casual Chic Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears an unbuttoned relaxed-fit overshirt in ${c1}, layered over a heavyweight clean ${c2} crewneck tee, styled with straight-leg ${c3} washed denim trousers and clean designer low-top sneakers.`,
        accessories: ["Minimalist silver pendant", "Canvas tote strap", "Brushed metal ring"],
        vibe: "Effortless Seoul off-duty boyfriend material charm."
      }
    ],
    femaleSilhouettes: [
      {
        title: "Cropped Knit Cardigan & High-Rise Wide Denim",
        buildDescription: (c1, c2, c3, concept) =>
          `Casual Chic Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a soft cropped knit cardigan in ${c1} with ${c2} buttons over a fitted ${c2} baby rib tank, paired with high-rise wide-leg ${c3} denim jeans and platform white sneakers.`,
        accessories: ["Dainty gold layered necklace", "Small hoop earrings", "Canvas crossbody strap"],
        vibe: "Breezy, natural girl-next-door superstar allure."
      }
    ]
  },
  {
    id: "eclectic",
    name: "Eclectic",
    category: "universal",
    tagline: "Unconventional, mixed, individualistic",
    description: "A deliberately varied aesthetic combining different fashion influences, contrasting patterns, unexpected layerings, and unconventional textures into a distinctive, boundary-pushing overall look.",
    keywords: ["avant-garde tailoring", "architectural cuts", "mixed luxury textures", "deconstructed suiting", "editorial edge"],
    curated3ColorSchemes: [
      {
        paletteName: "Obsidian Black, Crisp White & Electric Chartreuse",
        colors: ["Obsidian Black", "Crisp White", "Electric Chartreuse"],
        displayString: "Obsidian Black, Crisp White, and Electric Chartreuse"
      },
      {
        paletteName: "Midnight Navy, Pale Ice Grey & Radiant Tangerine",
        colors: ["Midnight Navy", "Pale Ice Grey", "Radiant Tangerine"],
        displayString: "Midnight Navy, Pale Ice Grey, and Radiant Tangerine"
      }
    ],
    maleSilhouettes: [
      {
        title: "Deconstructed Asymmetric Blazer & Pleated Fluid Trousers",
        buildDescription: (c1, c2, c3, concept) =>
          `Eclectic Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears an avant-garde deconstructed single-breasted blazer in ${c1} featuring an architectural asymmetric lapel with subtle ${c3} metallic safety-pin accents, layered over a fine-gauge ${c2} mock-neck knit, styled with high-waisted ${c1} fluid pleated trousers, a sleek leather belt, and polished black square-toe leather boots.`,
        accessories: ["Sculptural silver ear cuff", "Architectural signet rings", "Minimalist link chain"],
        vibe: "Avant-garde runway visionary with razor-sharp editorial charisma."
      }
    ],
    femaleSilhouettes: [
      {
        title: "Structured Asymmetric Blazer Dress & Pleated Suiting Skort",
        buildDescription: (c1, c2, c3, concept) =>
          `Eclectic Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears an architectural tailored blazer dress in ${c1} with contrast ${c2} silk lapel piping and a sleek ${c3} metallic waist buckle, paired with a matching structured ${c1} pleated micro-skort, sheer tights, and high-shine platform leather oxfords.`,
        accessories: ["Architectural silver statement earrings", "Layered micro-chain necklaces", "Minimalist cuff bracelet"],
        vibe: "High-fashion trendsetter with daring, ultra-chic runway poise."
      }
    ]
  }
];

// ============================================================================
// 2. MOSTLY BOY GROUP STYLES
// ============================================================================
export const BOY_GROUP_STYLES: KpopStyleItem[] = [
  {
    id: "military_uniform",
    name: "Military / Uniform",
    category: "boy_group",
    tagline: "Disciplined, commanding, powerful",
    description: "A structured aesthetic inspired by ceremonial uniforms and precision tailoring. Epaulets, gold braided aiguillettes, double-breasted buttoning, and sharp tailored discipline creating a strong authoritative image. Strictly NO techwear, tactical vests, or combat gear.",
    keywords: ["ceremonial epaulets", "double-breasted tunic", "gold aiguillettes", "leather service boots", "authoritative discipline"],
    curated3ColorSchemes: [
      {
        paletteName: "Midnight Navy, Burnished Gold & Crisp White",
        colors: ["Midnight Navy", "Burnished Gold", "Crisp White"],
        displayString: "Midnight Navy, Burnished Gold, and Crisp White"
      },
      {
        paletteName: "Obsidian Black, Crimson Red & Smoked Silver",
        colors: ["Obsidian Black", "Crimson Red", "Smoked Silver"],
        displayString: "Obsidian Black, Crimson Red, and Smoked Silver"
      },
      {
        paletteName: "Battleship Grey, Jet Black & Signal Orange",
        colors: ["Battleship Grey", "Jet Black", "Signal Orange"],
        displayString: "Battleship Grey, Jet Black, and Signal Orange"
      }
    ],
    maleSilhouettes: [
      {
        title: "Ceremonial Officer Tunic & High-Shine Service Boots",
        buildDescription: (c1, c2, c3, concept) =>
          `Military / Uniform Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a high-collar ceremonial tailored officer tunic in ${c1} with ${c2} braided shoulder epaulets and polished ${c3} brass buttons, paired with pressed ${c1} riding trousers and knee-high polished combat boots.`,
        accessories: ["Aiguillette gold cord", "Leather service cross-belt", "Signet ring"],
        vibe: "Disciplined, commanding authority with razor-sharp synchronicity."
      }
    ]
  },
  {
    id: "grunge",
    name: "Grunge",
    category: "boy_group",
    tagline: "Raw, rebellious, distressed",
    description: "A rougher alternative aesthetic associated with underground music culture and an intentionally imperfect appearance. Distressed oversized sweaters, layered shadow plaids, shredded raw-hem denim, and beaten leather boots.",
    keywords: ["distressed knit", "shadow plaid", "shredded denim", "worn leather", "underground energy"],
    curated3ColorSchemes: [
      {
        paletteName: "Faded Charcoal, Shadow Plaid Red & Dirty Cream",
        colors: ["Faded Charcoal", "Shadow Plaid Red", "Dirty Cream"],
        displayString: "Faded Charcoal, Shadow Plaid Red, and Dirty Cream"
      },
      {
        paletteName: "Muted Olive, Worn Black & Ash Grey",
        colors: ["Muted Olive", "Worn Black", "Ash Grey"],
        displayString: "Muted Olive, Worn Black, and Ash Grey"
      }
    ],
    maleSilhouettes: [
      {
        title: "Distressed Open-Knit Jumper & Tied Shadow Flannel",
        buildDescription: (c1, c2, c3, concept) =>
          `Grunge Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears an oversized loosely distressed knit sweater in ${c1} with dropped stitches, a tied ${c2} shadow-plaid flannel at the waist, worn raw-hem ${c3} denim, and scuffed leather combat boots.`,
        accessories: ["Silver razor-blade pendant", "Worn leather wristband", "Skull ring"],
        vibe: "Raw, brooding rock magnetism with effortless anti-establishment charm."
      }
    ]
  },
  {
    id: "hip_hop",
    name: "Hip-Hop",
    category: "boy_group",
    tagline: "Confident, expressive, bold",
    description: "A style heavily influenced by hip-hop culture, emphasizing individuality, swagger, attitude, and stage dominance. Oversized hockey/baseball jerseys, iced-out chunky Cuban links, baggy track bottoms, and designer kicks.",
    keywords: ["oversized jersey", "cuban links", "baggy track pants", "statement kicks", "swagger presence"],
    curated3ColorSchemes: [
      {
        paletteName: "Signal Red, Jet Black & Pure White",
        colors: ["Signal Red", "Jet Black", "Pure White"],
        displayString: "Signal Red, Jet Black, and Pure White"
      },
      {
        paletteName: "Royal Gold, Matte Black & Royal Blue",
        colors: ["Royal Gold", "Matte Black", "Royal Blue"],
        displayString: "Royal Gold, Matte Black, and Royal Blue"
      }
    ],
    maleSilhouettes: [
      {
        title: "Heavyweight Mesh Basketball Jersey & Baggy Track Pants",
        buildDescription: (c1, c2, c3, concept) =>
          `Hip-Hop Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears an oversized breathable mesh basketball jersey in ${c1} with ${c2} and ${c3} number appliqué over a clean ${c3} tee, paired with wide-leg ${c2} nylon track pants and limited-edition high-top basketball sneakers.`,
        accessories: ["Layered thick iced-out chains", "Embroidered snapback", "Gold pinky ring"],
        vibe: "Confident swagger, effortless charisma, and magnetic stage presence."
      }
    ]
  },
  {
    id: "bad_boy",
    name: "Bad Boy",
    category: "boy_group",
    tagline: "Rebellious, charismatic, dangerous",
    description: "A masculine K-pop aesthetic built around confidence, attitude, rebelliousness, and danger. Asymmetrical biker leathers, unbuttoned silk shirts, silver chain chokers, dark denim, and brooding stage gaze.",
    keywords: ["biker leather", "unbuttoned silk", "chain choker", "smoky eyeliner", "dangerous charm"],
    curated3ColorSchemes: [
      {
        paletteName: "Midnight Black, Deep Crimson & Gunmetal Silver",
        colors: ["Midnight Black", "Deep Crimson", "Gunmetal Silver"],
        displayString: "Midnight Black, Deep Crimson, and Gunmetal Silver"
      },
      {
        paletteName: "Smoked Charcoal, Blood Wine & Chrome Steel",
        colors: ["Smoked Charcoal", "Blood Wine", "Chrome Steel"],
        displayString: "Smoked Charcoal, Blood Wine, and Chrome Steel"
      }
    ],
    maleSilhouettes: [
      {
        title: "Sleek Moto Biker Leather & Open Deep-V Silk Shirt",
        buildDescription: (c1, c2, c3, concept) =>
          `Bad Boy Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a fitted asymmetrical biker leather jacket in ${c1} with silver zip hardware, layered over an unbuttoned deep-V ${c2} silk shirt revealing subtle chest line, paired with slim ${c1} coated denim and Cuban heel leather boots.`,
        accessories: ["Layered lock & chain necklace", "Silver ear cuffs", "Heavy signet rings"],
        vibe: "Charismatic, dangerous rockstar heartthrob with rebellious attitude."
      }
    ]
  },
  {
    id: "executive_sophisticated",
    name: "Executive / Sophisticated",
    category: "boy_group",
    tagline: "Powerful, mature, prestigious",
    description: "A refined aesthetic designed to communicate authority, success, confidence, and maturity. Sharp three-piece suiting, tailored pinstripes, silk neckties, crisp collars, and bespoke prestige.",
    keywords: ["three-piece suit", "pinstripes", "silk tie", "oxford shoes", "corporate prestige"],
    curated3ColorSchemes: [
      {
        paletteName: "Deep Sapphire, Pure Alabaster & Burnished Gold",
        colors: ["Deep Sapphire", "Pure Alabaster", "Burnished Gold"],
        displayString: "Deep Sapphire, Pure Alabaster, and Burnished Gold"
      },
      {
        paletteName: "Electric Cobalt, Frosted Silver & Slate Obsidian",
        colors: ["Electric Cobalt", "Frosted Silver", "Slate Obsidian"],
        displayString: "Electric Cobalt, Frosted Silver, and Slate Obsidian"
      }
    ],
    maleSilhouettes: [
      {
        title: "Bespoke Three-Piece Wool Suit & Silk Tie",
        buildDescription: (c1, c2, c3, concept) =>
          `Executive / Sophisticated Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears an impeccably tailored three-piece suit in ${c1} including a structured waistcoat, over a crisp ${c2} spread-collar dress shirt with a ${c3} jacquard silk tie, pressed straight trousers, and mirror-polished oxfords.`,
        accessories: ["Gold tie bar", "Swiss luxury chronograph watch", "Gold signet ring"],
        vibe: "Commanding CEO authority with mature, magnetic confidence."
      }
    ]
  },
  {
    id: "rockstar",
    name: "Rockstar",
    category: "boy_group",
    tagline: "Rebellious, glamorous, charismatic",
    description: "A performance-oriented aesthetic inspired by rock stars, emphasizing confidence, individuality, drama, and stage presence with metallic embellishments, velvet blazers, leather, and glam attitude.",
    keywords: ["studded velvet", "metallic shimmer", "leather pants", "statement boots", "stage dominance"],
    curated3ColorSchemes: [
      {
        paletteName: "Obsidian Black, Shimmering Gold & Electric Red",
        colors: ["Obsidian Black", "Shimmering Gold", "Electric Red"],
        displayString: "Obsidian Black, Shimmering Gold, and Electric Red"
      },
      {
        paletteName: "Pitch Black, Holographic Silver & Royal Purple",
        colors: ["Pitch Black", "Holographic Silver", "Royal Purple"],
        displayString: "Pitch Black, Holographic Silver, and Royal Purple"
      }
    ],
    maleSilhouettes: [
      {
        title: "Embellished Velvet Blazer & Fitted Leather Pants",
        buildDescription: (c1, c2, c3, concept) =>
          `Rockstar Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a dramatic tailored velvet blazer in ${c1} adorned with ${c2} metallic sequin embroidery along the lapels, worn open over a fitted ${c3} scoop tank, with sleek ${c1} leather pants and buckled rockstar boots.`,
        accessories: ["Layered multi-charm silver chains", "Glitter eye accents", "Statement knuckle ring"],
        vibe: "Electrifying arena rockstar charisma and unapologetic glam."
      }
    ]
  },
  {
    id: "gentleman",
    name: "Gentleman / Classic Masculine",
    category: "boy_group",
    tagline: "Refined, confident, timeless",
    description: "A traditionally sophisticated masculine aesthetic emphasizing maturity, elegance, confidence, and polished styling. Double-faced wool overcoats, tailored slacks, fine knitwear, and classic masculine composure.",
    keywords: ["classic masculine", "tailored overcoat", "fine knitwear", "leather oxfords", "timeless refinement"],
    curated3ColorSchemes: [
      {
        paletteName: "Camel Tan, Alabaster White & Rich Espresso",
        colors: ["Camel Tan", "Alabaster White", "Rich Espresso"],
        displayString: "Camel Tan, Alabaster White, and Rich Espresso"
      },
      {
        paletteName: "Slate Grey, Oxford Blue & Crisp White",
        colors: ["Slate Grey", "Oxford Blue", "Crisp White"],
        displayString: "Slate Grey, Oxford Blue, and Crisp White"
      }
    ],
    maleSilhouettes: [
      {
        title: "Tailored Camel Wool Coat & Cashmere Turtleneck",
        buildDescription: (c1, c2, c3, concept) =>
          `Gentleman / Classic Masculine Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a flowing tailored wool overcoat in ${c1}, over a soft ${c2} cashmere turtleneck, paired with pressed ${c3} wool slacks and classic handcrafted leather derbies.`,
        accessories: ["Leather-strap dress watch", "Minimal silver signet ring", "Silk pocket square"],
        vibe: "Dignified, mature, and reassuringly masculine idol composure."
      }
    ]
  },
  {
    id: "preppy_boy",
    name: "Preppy Boy",
    category: "boy_group",
    tagline: "Clean, youthful, polished",
    description: "A youthful masculine take on preppy fashion with a smart, approachable, put-together image. Cricket jumpers, collegiate rugby shirts, tailored chino shorts/trousers, and clean canvas sneakers.",
    keywords: ["cricket jumper", "rugby shirt", "chino trousers", "white socks", "penny loafers"],
    curated3ColorSchemes: [
      {
        paletteName: "Ivy Green, Warm Ecru & Navy Blue",
        colors: ["Ivy Green", "Warm Ecru", "Navy Blue"],
        displayString: "Ivy Green, Warm Ecru, and Navy Blue"
      },
      {
        paletteName: "Oxford Red, Chalk White & Camel Tan",
        colors: ["Oxford Red", "Chalk White", "Camel Tan"],
        displayString: "Oxford Red, Chalk White, and Camel Tan"
      }
    ],
    maleSilhouettes: [
      {
        title: "Collegiate Cable Cricket Sweater & Pressed Chinos",
        buildDescription: (c1, c2, c3, concept) =>
          `Preppy Boy Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears an oversized cable-knit cricket sweater in ${c2} with ${c1} and ${c3} V-neck trim stripes, layered over a crisp collared shirt, paired with tailored ${c3} chinos and clean leather loafers with white crew socks.`,
        accessories: ["Collegiate crest pin", "Tortoiseshell glasses", "Braided leather bracelet"],
        vibe: "Wholesome, approachable campus idol heartthrob charm."
      }
    ]
  }
];

// ============================================================================
// 3. MOSTLY GIRL GROUP STYLES
// ============================================================================
export const GIRL_GROUP_STYLES: KpopStyleItem[] = [
  {
    id: "high_teen",
    name: "High Teen",
    category: "girl_group",
    tagline: "Youthful, energetic, fashionable",
    description: "A distinctly youthful Korean pop aesthetic associated with teenage confidence, nostalgia, friendship, and aspirational style. Plaid pleated mini skirts, cropped cardigans, hair clips, knee-high socks, and 90s/2000s teen-movie styling.",
    keywords: ["plaid pleated skirt", "cropped knit cardigan", "hair barrettes", "knee-high socks", "teen-movie glamour"],
    curated3ColorSchemes: [
      {
        paletteName: "Baby Pink, Baby Blue & Crisp White",
        colors: ["Baby Pink", "Baby Blue", "Crisp White"],
        displayString: "Baby Pink, Baby Blue, and Crisp White"
      },
      {
        paletteName: "Yellow Tartan, Optic White & Pastel Lilac",
        colors: ["Yellow Tartan", "Optic White", "Pastel Lilac"],
        displayString: "Yellow Tartan, Optic White, and Pastel Lilac"
      }
    ],
    femaleSilhouettes: [
      {
        title: "Pastel Plaid Blazer & Pleated Tennis Skirt Set",
        buildDescription: (c1, c2, c3, concept) =>
          `High Teen Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a cropped plaid tailored blazer in ${c1} and ${c2}, paired with a matching high-waist pleated tennis mini skirt, a fitted ${c3} baby tee, knee-high white socks, and chunky platform loafers.`,
        accessories: ["Pastel hair barrettes", "Heart pendant necklace", "Beaded charm bracelet"],
        vibe: "Iconic teen-pop queen with infectious youthful confidence."
      }
    ]
  },
  {
    id: "girl_crush",
    name: "Girl Crush",
    category: "girl_group",
    tagline: "Powerful, confident, fierce",
    description: "A bold feminine aesthetic centered around independence, charisma, confidence, and strong visual presence. Cropped leather moto jackets, high-fashion statement boots, sleek chain belts, and fierce high-energy styling. Strictly NO techwear or tactical gear.",
    keywords: ["cropped moto jacket", "statement boots", "chain belt", "leather mini skirt", "fierce confidence"],
    curated3ColorSchemes: [
      {
        paletteName: "Jet Black, Crimson Red & Metallic Silver",
        colors: ["Jet Black", "Crimson Red", "Metallic Silver"],
        displayString: "Jet Black, Crimson Red, and Metallic Silver"
      },
      {
        paletteName: "Matte Black, Electric Royal Blue & Neon White",
        colors: ["Matte Black", "Electric Royal Blue", "Neon White"],
        displayString: "Matte Black, Electric Royal Blue, and Neon White"
      }
    ],
    femaleSilhouettes: [
      {
        title: "Cropped Moto Leather & Pleated Mini Skort",
        buildDescription: (c1, c2, c3, concept) =>
          `Girl Crush Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a cropped biker leather jacket in ${c1} with ${c3} zip hardware, layered over a bold ${c2} zip crop top, paired with an asymmetric pleated ${c1} skort and knee-high leather statement boots. Strictly NO techwear, NO tactical harnesses, and NO utility straps.`,
        accessories: ["Silver chain choker", "Metallic chain belt", "Smoky winged liner"],
        vibe: "Unstoppable feminine power, swagger, and fierce charisma."
      }
    ]
  },
  {
    id: "femme_fatale",
    name: "Femme Fatale",
    category: "girl_group",
    tagline: "Seductive, mysterious, powerful",
    description: "A glamorous mature aesthetic built around confidence, mystery, allure, and controlled sophistication. Slinky satin gowns, high leg slits, sheer mesh accents, sharp tailored blazers, and dark alluring glamour.",
    keywords: ["satin slip", "high slit", "sheer mesh", "tailored blazer dress", "seductive glamour"],
    curated3ColorSchemes: [
      {
        paletteName: "Obsidian Black, Deep Bordeaux & Liquid Gold",
        colors: ["Obsidian Black", "Deep Bordeaux", "Liquid Gold"],
        displayString: "Obsidian Black, Deep Bordeaux, and Liquid Gold"
      },
      {
        paletteName: "Midnight Navy, Smoke Grey & Molten Silver",
        colors: ["Midnight Navy", "Smoke Grey", "Molten Silver"],
        displayString: "Midnight Navy, Smoke Grey, and Molten Silver"
      }
    ],
    femaleSilhouettes: [
      {
        title: "Satin Corset Column Dress & Draped Smoking Jacket",
        buildDescription: (c1, c2, c3, concept) =>
          `Femme Fatale Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a boned satin corset dress in ${c1} with a sultry thigh-high slit and ${c2} velvet trim, draped with an oversized ${c1} tailored smoking jacket with ${c3} satin lapels, and pointed stiletto pumps.`,
        accessories: ["Diamond tennis choker", "Mesh evening gloves", "Statement drop earrings"],
        vibe: "Dangerous allure, intoxicating mystery, and supreme feminine command."
      }
    ]
  },
  {
    id: "princess_fairytale",
    name: "Princess / Fairy Tale",
    category: "girl_group",
    tagline: "Elegant, whimsical, dreamy",
    description: "A high-fashion royal aesthetic associated with ethereal couture, delicate silk draping, crystal embellishments, and regal stage gowns.",
    keywords: ["couture corset", "crystal embroidery", "silk draping", "regal elegance", "haute fairytale"],
    curated3ColorSchemes: [
      {
        paletteName: "Ice Blue, Starlight Silver & Pure White",
        colors: ["Ice Blue", "Starlight Silver", "Pure White"],
        displayString: "Ice Blue, Starlight Silver, and Pure White"
      },
      {
        paletteName: "Soft Rose Pink, Pearl Cream & Pale Gold",
        colors: ["Soft Rose Pink", "Pearl Cream", "Pale Gold"],
        displayString: "Soft Rose Pink, Pearl Cream, and Pale Gold"
      }
    ],
    femaleSilhouettes: [
      {
        title: "Embellished Silk Corset Bodice & Draped A-Line Stage Skirt",
        buildDescription: (c1, c2, c3, concept) =>
          `Princess / Fairy Tale Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears an elegant structured silk corset top in ${c1} with delicate ${c3} crystal trim and sheer off-shoulder ${c2} organza sleeves, paired with a matching high-waisted ${c1} A-line tailored satin skirt with subtle side draping, finished with polished satin stiletto pumps.`,
        accessories: ["Dainty crystal choker", "Pearl drop earrings", "Delicate ring set"],
        vibe: "Regal haute-couture royalty with breathtaking elegance."
      }
    ]
  },
  {
    id: "cottagecore",
    name: "Cottagecore",
    category: "girl_group",
    tagline: "Natural, soft, pastoral",
    description: "A romantic countryside-inspired aesthetic emphasizing delicate fabrics, nostalgia, and gentle femininity with smocked silks, ditsy floral details, soft knitwear, and earthy elegance.",
    keywords: ["smocked silk", "ditsy floral", "knit bolero", "pastoral charm", "soft nature"],
    curated3ColorSchemes: [
      {
        paletteName: "Sage Olive, Warm Buttercream & Terracotta Rose",
        colors: ["Sage Olive", "Warm Buttercream", "Terracotta Rose"],
        displayString: "Sage Olive, Warm Buttercream, and Terracotta Rose"
      }
    ],
    femaleSilhouettes: [
      {
        title: "Smocked Silk-Linen Midi Dress & Cropped Knit Bolero",
        buildDescription: (c1, c2, c3, concept) =>
          `Cottagecore Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a romantic smocked midi dress in ${c1} featuring subtle ${c3} wildflower embroidery, layered with a soft cropped ${c2} knit bolero cardigan, finished with dainty lace-trimmed ankle socks and polished leather Mary Janes.`,
        accessories: ["Delicate ribbon choker", "Dainty daisy stud earrings", "Pearl hair pins"],
        vibe: "Pastoral serenity, gentle warmth, and nostalgic elegance."
      }
    ]
  },
  {
    id: "harajuku_kawaii",
    name: "Harajuku / Kawaii",
    category: "girl_group",
    tagline: "Playful, colorful, eccentric",
    description: "A contemporary Neo-Tokyo pop streetwear aesthetic with playful cropped silhouettes, sporty accents, vibrant graphic patches, and chunky designer footwear.",
    keywords: ["pop streetwear", "platform sneakers", "cropped bomber", "tennis skirt", "playful energy"],
    curated3ColorSchemes: [
      {
        paletteName: "Pitch Black, Optic White & Neon Electric Pink",
        colors: ["Pitch Black", "Optic White", "Neon Electric Pink"],
        displayString: "Pitch Black, Optic White, and Neon Electric Pink"
      }
    ],
    femaleSilhouettes: [
      {
        title: "Cropped Boxy Track Bomber & Pleated Tennis Skirt",
        buildDescription: (c1, c2, c3, concept) =>
          `Harajuku / Kawaii Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a cropped boxy satin track bomber jacket in ${c1} with ${c2} sleeve stripes and ${c3} embroidered graphic patches, layered over a fitted ${c2} baby tee, paired with a matching high-waisted ${c1} pleated tennis skirt, white ribbed crew socks, and chunky platform designer sneakers.`,
        accessories: ["Metallic hair clips", "Layered silver chain choker", "Graphic enamel ring set"],
        vibe: "Vibrant, high-energy pop-star cuteness with confident streetwear edge."
      }
    ]
  },
  {
    id: "soft_girl",
    name: "Soft Girl",
    category: "girl_group",
    tagline: "Gentle, sweet, pastel",
    description: "A youthful feminine aesthetic emphasizing softness, sweetness, innocence, and calm visual energy. Oversized fuzzy pastel cardigans, pleated tennis skirts, cloud motifs, and glowing blush makeup.",
    keywords: ["fuzzy cardigan", "pastel tones", "pleated mini", "cloud motif", "blush radiance"],
    curated3ColorSchemes: [
      {
        paletteName: "Pastel Lavender, Cloud White & Baby Blue",
        colors: ["Pastel Lavender", "Cloud White", "Baby Blue"],
        displayString: "Pastel Lavender, Cloud White, and Baby Blue"
      }
    ],
    femaleSilhouettes: [
      {
        title: "Fluffy Mohair Cardigan & Pastel Pleated Skirt",
        buildDescription: (c1, c2, c3, concept) =>
          `Soft Girl Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a cozy cloud-soft mohair knit cardigan in ${c1} with pearl buttons, over a sweet ${c2} scoop tee, paired with a pleated ${c3} mini skirt and platform sneakers with ruffled socks.`,
        accessories: ["Heart-shaped barrettes", "Pastel cloud ring", "Gentle pink cheek blush"],
        vibe: "Endearing, calm, and sweet fairy-tale softness."
      }
    ]
  },
  {
    id: "chic_parisian",
    name: "Chic / Parisian",
    category: "girl_group",
    tagline: "Effortless, sophisticated, refined",
    description: "An understated aesthetic associated with confidence, simplicity, elegance, and effortless sophistication. Breton striped tops, tailored tweed jackets, berets, tailored straight trousers, and subtle red lip.",
    keywords: ["breton stripes", "tweed jacket", "beret", "straight-leg denim", "effortless chic"],
    curated3ColorSchemes: [
      {
        paletteName: "Midnight Navy, French Cream & Cherry Red",
        colors: ["Midnight Navy", "French Cream", "Cherry Red"],
        displayString: "Midnight Navy, French Cream, and Cherry Red"
      }
    ],
    femaleSilhouettes: [
      {
        title: "Tailored Tweed Jacket & High-Waist Straight Slacks",
        buildDescription: (c1, c2, c3, concept) =>
          `Chic / Parisian Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a collarless cropped tweed jacket in ${c1} with gold coin buttons, layered over a ${c2} silk camisole, paired with high-waist straight ${c1} slacks with ${c3} silk scarf tied at the neck and slingback pointed heels.`,
        accessories: ["Wool beret", "Classic pearl earrings", "Minimal gold watch"],
        vibe: "Effortless French chic with timeless composure and poised confidence."
      }
    ]
  },
  {
    id: "magical_girl",
    name: "Magical Girl",
    category: "girl_group",
    tagline: "Whimsical, heroic, feminine",
    description: "An anime-inspired aesthetic combining cute femininity, fantasy, transformation imagery, and heroine-like energy. Sailor collars, iridescent wing accents, star/heart brooches, metallic gold trim, and celestial ribbons.",
    keywords: ["sailor collar", "transformation ribbons", "heart brooch", "metallic gold trim", "heroine energy"],
    curated3ColorSchemes: [
      {
        paletteName: "Midnight Navy, Crisp White & Crimson Red",
        colors: ["Midnight Navy", "Crisp White", "Crimson Red"],
        displayString: "Midnight Navy, Crisp White, and Crimson Red"
      }
    ],
    femaleSilhouettes: [
      {
        title: "Tailored Cropped Sailor Blazer & High-Waist Pleated Skirt",
        buildDescription: (c1, c2, c3, concept) =>
          `Magical Girl Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a crisp tailored cropped blazer in ${c1} with a structured sailor lapel piped in ${c2}, layered over a clean ${c2} button-down blouse with a slim ${c3} silk tie, paired with a matching ${c1} structured pleated tennis mini skirt, crew socks, and polished platform loafers.`,
        accessories: ["Slim metallic headband", "Pearl ear studs", "Minimalist brooch pin"],
        vibe: "Crisp high-fashion anime-inspired idol uniform with sharp tailored charm."
      }
    ]
  },
  {
    id: "coquette",
    name: "Coquette",
    category: "girl_group",
    tagline: "Delicate, flirtatious, ultra-feminine",
    description: "A hyper-feminine aesthetic centered around romantic charm, playfulness, delicacy, and flirtatious elegance. Silk bows, lace trim, eyelet corsets, pastel pinks, sheer stockings, and vintage pearl details.",
    keywords: ["satin bows", "lace trim", "eyelet corset", "sheer tights", "flirtatious elegance"],
    curated3ColorSchemes: [
      {
        paletteName: "Powder Pink, Ivory Cream & Muted Wine",
        colors: ["Powder Pink", "Ivory Cream", "Muted Wine"],
        displayString: "Powder Pink, Ivory Cream, and Muted Wine"
      }
    ],
    femaleSilhouettes: [
      {
        title: "Lace-Trimmed Bustier & Bow-Adorned Ruffle Skirt",
        buildDescription: (c1, c2, c3, concept) =>
          `Coquette Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a delicate eyelet lace bustier top in ${c1} with satin ribbon lace-up details, paired with a ruffled ${c2} tiered mini skirt adorned with small ${c3} velvet bows, white lace tights, and Mary Jane platform pumps.`,
        accessories: ["Satin bow hair clips", "Pearl choker with rosette", "Lace gloves"],
        vibe: "Delicate, flirtatious doll-like charm with playful romantic poise."
      }
    ]
  },
  {
    id: "balletcore",
    name: "Balletcore",
    category: "girl_group",
    tagline: "Graceful, delicate, elegant",
    description: "A ballet-inspired aesthetic emphasizing grace, softness, femininity, refinement, and poise. Wrap tops, pleated skorts, sleek knitwear, satin ribbon accents, and refined ballerina footwear.",
    keywords: ["wrap top", "pleated skort", "ribbon laces", "fine knit", "graceful ballerina"],
    curated3ColorSchemes: [
      {
        paletteName: "Ballet Blush Pink, Chalk White & Muted Slate",
        colors: ["Ballet Blush Pink", "Chalk White", "Muted Slate"],
        displayString: "Ballet Blush Pink, Chalk White, and Muted Slate"
      }
    ],
    femaleSilhouettes: [
      {
        title: "Fitted Wrap Knit Top & Tailored Pleated Wrap Skort",
        buildDescription: (c1, c2, c3, concept) =>
          `Balletcore Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a sleek form-fitting wrap top in fine ${c1} knit over a clean ${c2} scoop-neck base, paired with a tailored ${c1} pleated wrap skort featuring subtle ${c3} satin ribbon accents, sheer stockings, and polished platform Mary Jane shoes.`,
        accessories: ["Silk ribbon hair tie", "Delicate pearl pendant", "Satin wrist ribbon"],
        vibe: "Graceful, ethereal modern ballerina elegance with pristine athletic poise."
      }
    ]
  },
  {
    id: "mermaidcore",
    name: "Mermaidcore",
    category: "girl_group",
    tagline: "Aquatic, glamorous, ethereal",
    description: "A high-fashion oceanic aesthetic inspired by liquid draping, aquatic tones, pearl accents, and luminous red-carpet glamour.",
    keywords: ["liquid satin", "aquatic turquoise", "pearl accents", "fluid drape", "oceanic glamour"],
    curated3ColorSchemes: [
      {
        paletteName: "Deep Obsidian, Seafoam Mint & Shimmer Pearl",
        colors: ["Deep Obsidian", "Seafoam Mint", "Shimmer Pearl"],
        displayString: "Deep Obsidian, Seafoam Mint, and Shimmer Pearl"
      }
    ],
    femaleSilhouettes: [
      {
        title: "Liquid Satin Cowl Top & Fluid Draped Wide-Leg Trousers",
        buildDescription: (c1, c2, c3, concept) =>
          `Mermaidcore Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a luxurious liquid satin cowl-neck top in ${c1} with subtle ${c2} pearlescent shimmer, paired with high-waisted fluid ${c1} wide-leg trousers featuring delicate ${c3} silver chain waist draping and sleek pointed metallic-cap heels.`,
        accessories: ["Seashell-motif pearl ear cuff", "Dainty pearl waist chain", "High-shine silver rings"],
        vibe: "Mythical oceanic siren with breathtaking high-fashion red-carpet glamour."
      }
    ]
  },
  {
    id: "dark_feminine",
    name: "Dark Feminine",
    category: "girl_group",
    tagline: "Mysterious, mature, powerful",
    description: "A darker feminine aesthetic centered around confidence, sophistication, mystery, and controlled sensuality. Deep velvets, structured black suiting with cutout waists, sharp leather skirts, and dark captivating aura.",
    keywords: ["black velvet", "waist cutouts", "leather pencil skirt", "captivating aura", "controlled power"],
    curated3ColorSchemes: [
      {
        paletteName: "Pitch Onyx, Blood Red Velvet & Dark Titanium",
        colors: ["Pitch Onyx", "Blood Red Velvet", "Dark Titanium"],
        displayString: "Pitch Onyx, Blood Red Velvet, and Dark Titanium"
      }
    ],
    femaleSilhouettes: [
      {
        title: "Cutout Velvet Blazer Dress & Thigh-High Leather Boots",
        buildDescription: (c1, c2, c3, concept) =>
          `Dark Feminine Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears an architectural blazer dress in deep ${c2} with sharp structured shoulders and ${c1} side waist cutouts, paired with sheer black tights and glossy thigh-high leather boots.`,
        accessories: ["Dark titanium snake choker", "Onyx cocktail rings", "Cat-eye dark eyeliner"],
        vibe: "Mysterious, commanding feminine dominance and intoxicating magnetic presence."
      }
    ]
  },
  {
    id: "y2k_girl",
    name: "Y2K Girl",
    category: "girl_group",
    tagline: "Playful, flashy, nostalgic",
    description: "A feminine interpretation of Y2K fashion emphasizing youthful pop-star energy and early-2000s nostalgia with micro mini skirts, shiny metallic fabrics, butterfly motifs, and glitter rhinestones.",
    keywords: ["micro mini skirt", "metallic shine", "rhinestones", "baby tee", "millennium pop star"],
    curated3ColorSchemes: [
      {
        paletteName: "Hot Magenta, Chrome Silver & Pure White",
        colors: ["Hot Magenta", "Chrome Silver", "Pure White"],
        displayString: "Hot Magenta, Chrome Silver, and Pure White"
      }
    ],
    femaleSilhouettes: [
      {
        title: "Holographic Tube Top & Low-Rise Pleated Metallic Skirt",
        buildDescription: (c1, c2, c3, concept) =>
          `Y2K Girl Fashion Style${concept ? ` [Concept: ${concept}]` : ''}: Member wears a shimmering holographic tube top in ${c1} with silver rhinestone star piping, paired with a low-rise pleated ${c2} metallic mini skirt, matching arm warmers, and chunky white platform boots.`,
        accessories: ["Rhinestone butterfly belly chain", "Pink rimless sunglasses", "Glitter lip gloss"],
        vibe: "Flashy millennium pop icon energy and irresistible nostalgia."
      }
    ]
  }
];

// All available fashion styles combined
export const ALL_KPOP_FASHION_STYLES: KpopStyleItem[] = [
  ...UNIVERSAL_KPOP_STYLES,
  ...BOY_GROUP_STYLES,
  ...GIRL_GROUP_STYLES
];

// ============================================================================
// 4. K-POP CONCEPTS & AESTHETIC MODIFIERS (THE CONCEPTUAL LENSES)
// "I wouldn't classify 'Bad Boy,' 'Girl Crush,' 'High Teen,' or 'Femme Fatale'
// as pure fashion styles... they're K-pop concepts that influence the fashion."
// ============================================================================
export const KPOP_CONCEPTS: KpopConceptItem[] = [
  {
    id: "girl_crush",
    name: "Girl Crush",
    tagline: "Powerful, confident, fierce",
    description: "Bold feminine charisma, independence, confidence, and commanding visual presence.",
    appliesTo: "girl_group",
    moodKeywords: ["fierce", "confident", "independent", "powerful", "charismatic"]
  },
  {
    id: "bad_boy",
    name: "Bad Boy",
    tagline: "Rebellious, charismatic, dangerous",
    description: "Masculine magnetism built around confidence, attitude, rebelliousness, and danger.",
    appliesTo: "boy_group",
    moodKeywords: ["rebellious", "dangerous", "charismatic", "edgy", "unapologetic"]
  },
  {
    id: "high_teen",
    name: "High Teen",
    tagline: "Youthful, energetic, fashionable",
    description: "Teenage confidence, nostalgic teen-movie vibrancy, aspirational styling, and youthful charisma.",
    appliesTo: "girl_group",
    moodKeywords: ["youthful", "nostalgic", "energetic", "aspirational", "fashion-forward"]
  },
  {
    id: "femme_fatale",
    name: "Femme Fatale",
    tagline: "Seductive, mysterious, powerful",
    description: "Mature glamour, controlled sophistication, seductive mystery, and regal allure.",
    appliesTo: "girl_group",
    moodKeywords: ["seductive", "mysterious", "mature", "alluring", "sophisticated"]
  },
  {
    id: "sophisticated",
    name: "Sophisticated / Executive",
    tagline: "Refined, prestigious, authoritative",
    description: "Polished poise, quiet luxury, commanding presence, and immaculate tailoring.",
    appliesTo: "all",
    moodKeywords: ["prestigious", "tailored", "authoritative", "refined", "composed"]
  },
  {
    id: "rebellious",
    name: "Rebellious / Angsty",
    tagline: "Defiant, raw, explosive",
    description: "Anti-establishment edge, raw performance energy, distressed accents, and rockstar swagger.",
    appliesTo: "all",
    moodKeywords: ["defiant", "raw", "explosive", "distressed", "bold"]
  },
  {
    id: "dreamy_ethereal",
    name: "Dreamy / Ethereal",
    tagline: "Poetic, tender, transcendent",
    description: "Soft luminescence, emotional vulnerability, delicate beauty, and poetic charm.",
    appliesTo: "all",
    moodKeywords: ["dreamy", "ethereal", "poetic", "tender", "gentle"]
  },
  {
    id: "playful_quirky",
    name: "Playful / Cheerful",
    tagline: "Upbeat, witty, fun",
    description: "Bright upbeat charisma, colorful accents, charming smiles, and refreshing youthful energy.",
    appliesTo: "all",
    moodKeywords: ["playful", "cheerful", "refreshing", "charming", "bright"]
  },
  {
    id: "dark_mysterious",
    name: "Dark / Gothic",
    tagline: "Moody, intense, dramatic",
    description: "Brooding intensity, nocturnal shadows, intense dramatic gaze, and magnetic noir aura.",
    appliesTo: "all",
    moodKeywords: ["moody", "intense", "dramatic", "brooding", "nocturnal"]
  },
  {
    id: "futuristic_sleek",
    name: "Futuristic / Neo-Chic",
    tagline: "Sleek, architectural, avant-garde",
    description: "Sleek architectural lines, liquid metallic accents, polished high-fashion poise, and modern runway luxury. Absolutely NO techwear, NO tactical gear, NO harnesses, and NO utility straps.",
    appliesTo: "all",
    moodKeywords: ["futuristic", "sleek", "architectural", "metallic", "avant-garde"]
  }
];

// ============================================================================
// STRICT UNIVERSAL PROHIBITION ON TECHWEAR
// ============================================================================
export const STRICT_NO_TECHWEAR_DIRECTIVE = 
  "ABSOLUTE PROHIBITION ON TECHWEAR: NEVER DO TECHWEAR OR ANYTHING RELATED TO IT. Strictly NO techwear, NO tactical vests, NO utility harnesses, NO chest rigs, NO multi-strap buckles, NO tactical pouches, NO combat gear, NO military nylon webbing, NO ripstop parachute cargo pants, and NO sci-fi survival straps. Outfits must be authentic, stylish, elegant, tailored, or urban high-fashion K-pop stage clothing, NEVER techwear.";

// ============================================================================
// 5. CURATED K-POP STYLE MIX PRESETS (Formula: Main Style + Secondary Style + Concept)
// Directly incorporates the 35+ iconic pairings from the user's styling guide!
// ============================================================================
export const KPOP_STYLE_MIX_PRESETS: KpopStyleMixPreset[] = [
  // Universal / Cross Mixes
  {
    id: "casual_streetwear",
    label: "Casual + Streetwear",
    mainStyle: "Casual",
    secondaryStyle: "Streetwear",
    concept: "Youthful / Swagger",
    targetGroup: "all",
    vibeSummary: "Effortless off-duty youth cool pairing relaxed collegiate hoodies with baggy skater denim and fresh sneakers.",
    recommendedColors: ["Cobalt Blue", "Crisp White", "Warm Sand"]
  },
  {
    id: "casual_sporty",
    label: "Casual + Sporty",
    mainStyle: "Casual",
    secondaryStyle: "Sporty / Athleisure",
    concept: "Energetic / Approachable",
    targetGroup: "all",
    vibeSummary: "Vibrant rehearsal studio and dance-practice idol energy with lightweight bombers and track details.",
    recommendedColors: ["Sage Olive", "Off-White", "Washed Black"]
  },
  {
    id: "casual_y2k",
    label: "Casual + Y2K",
    mainStyle: "Casual",
    secondaryStyle: "Y2K",
    concept: "Playful / Youthful",
    targetGroup: "all",
    vibeSummary: "Playful 2000s throwback casual charm with baby tees, low-slung denim jorts, and platform kicks.",
    recommendedColors: ["Heather Grey", "Optic White", "Soft Mint"]
  },
  {
    id: "casual_highfashion",
    label: "Casual + High Fashion",
    mainStyle: "Casual",
    secondaryStyle: "High Fashion / Editorial",
    concept: "Sophisticated / Understated",
    targetGroup: "all",
    vibeSummary: "Elevated airport fashion idol look pairing minimalist casual cuts with designer sneakers and jewelry.",
    recommendedColors: ["Terracotta Rust", "Chalk Cream", "Deep Indigo"]
  },
  {
    id: "streetwear_highfashion",
    label: "Streetwear + High Fashion",
    mainStyle: "Streetwear",
    secondaryStyle: "High Fashion / Editorial",
    concept: "Sophisticated / Swagger",
    targetGroup: "all",
    vibeSummary: "Casual urban energy mixed with a dramatic, luxurious runway appearance.",
    recommendedColors: ["Obsidian Black", "Optic White", "Molten Silver"]
  },
  {
    id: "streetwear_y2k",
    label: "Streetwear + Y2K",
    mainStyle: "Streetwear",
    secondaryStyle: "Y2K",
    concept: "Playful / Confident",
    targetGroup: "all",
    vibeSummary: "Playful early-2000s nostalgia combined with modern youthful street fashion.",
    recommendedColors: ["Electric Cyan", "Jet Black", "Hot Pink"]
  },
  {
    id: "streetwear_hiphop",
    label: "Streetwear + Hip-Hop",
    mainStyle: "Streetwear",
    secondaryStyle: "Hip-Hop",
    concept: "Confident / Swagger",
    targetGroup: "all",
    vibeSummary: "Urban casual styling with a stronger sense of confidence, swagger, and attitude.",
    recommendedColors: ["Signal Red", "Obsidian Black", "Pure White"]
  },
  {
    id: "streetwear_preppy",
    label: "Streetwear + Preppy",
    mainStyle: "Streetwear",
    secondaryStyle: "Preppy",
    concept: "Youthful / Polished",
    targetGroup: "all",
    vibeSummary: "A polished youthful look that combines relaxed urban fashion with clean collegiate influence.",
    recommendedColors: ["Varsity Navy", "Chalk White", "Forest Green"]
  },
  {
    id: "highfashion_elegant",
    label: "High Fashion + Elegant",
    mainStyle: "High Fashion / Editorial",
    secondaryStyle: "Elegant",
    concept: "Sophisticated / Regal",
    targetGroup: "all",
    vibeSummary: "Luxury runway styling with a sophisticated, refined, graceful appearance.",
    recommendedColors: ["Midnight Black", "Alabaster White", "Liquid Gold"]
  },
  {
    id: "highfashion_darkgothic",
    label: "High Fashion + Dark / Gothic",
    mainStyle: "High Fashion / Editorial",
    secondaryStyle: "Dark / Gothic",
    concept: "Mysterious / Dramatic",
    targetGroup: "all",
    vibeSummary: "Dramatic luxury mixed with a mysterious, darker aesthetic and brooding couture.",
    recommendedColors: ["Raven Black", "Blood Wine Red", "Antique Silver"]
  },
  {
    id: "highfashion_romantic",
    label: "High Fashion + Romantic",
    mainStyle: "High Fashion / Editorial",
    secondaryStyle: "Romantic",
    concept: "Dreamy / Ethereal",
    targetGroup: "all",
    vibeSummary: "Runway-inspired styling softened with dreamy, delicate, graceful qualities.",
    recommendedColors: ["Soft Blush Pink", "Pearl White", "Smoked Titanium"]
  },
  {
    id: "minimalist_luxury",
    label: "Minimalist + Luxury",
    mainStyle: "Minimalist",
    secondaryStyle: "Luxury / Quiet Luxury",
    concept: "Sophisticated / Understated",
    targetGroup: "all",
    vibeSummary: "Simple, restrained styling designed to look polished, expensive, and sophisticated.",
    recommendedColors: ["Cashmere Ivory", "Slate Grey", "Espresso Brown"]
  },
  {
    id: "minimalist_elegant",
    label: "Minimalist + Elegant",
    mainStyle: "Minimalist",
    secondaryStyle: "Elegant",
    concept: "Serene / Poised",
    targetGroup: "all",
    vibeSummary: "A very clean, refined appearance with an emphasis on simplicity and grace.",
    recommendedColors: ["Chalk White", "Cool Stone", "Deep Navy"]
  },
  {
    id: "darkgothic_romantic",
    label: "Dark / Gothic + Romantic",
    mainStyle: "Dark / Gothic",
    secondaryStyle: "Romantic",
    concept: "Dreamy / Mysterious",
    targetGroup: "all",
    vibeSummary: "Darkness and mystery balanced with softness, lace, elegance, and dreamy beauty.",
    recommendedColors: ["Pitch Black", "Dusty Lilac", "Antique Silver"]
  },
  {
    id: "darkgothic_punkrock",
    label: "Dark / Gothic + Punk / Rock",
    mainStyle: "Dark / Gothic",
    secondaryStyle: "Punk / Rock",
    concept: "Rebellious / Edgy",
    targetGroup: "all",
    vibeSummary: "A more rebellious, aggressive interpretation of dark fashion with leather and studs.",
    recommendedColors: ["Pitch Black", "Distressed Silver", "Crimson Red"]
  },
  {
    id: "romantic_fantasy",
    label: "Romantic + Fantasy",
    mainStyle: "Romantic",
    secondaryStyle: "Fantasy",
    concept: "Dreamy / Ethereal",
    targetGroup: "all",
    vibeSummary: "A soft, dreamy aesthetic pushed further into a magical or otherworldly direction.",
    recommendedColors: ["Moonlight Opal", "Mist Blue", "Starlight Silver"]
  },
  {
    id: "preppy_highteen",
    label: "Preppy + High Teen",
    mainStyle: "Preppy",
    secondaryStyle: "High Teen",
    concept: "Youthful / Confident",
    targetGroup: "girl_group",
    vibeSummary: "Youthful collegiate-inspired fashion with a distinctly Korean teen-pop feeling.",
    recommendedColors: ["Pastel Sky Blue", "Baby Pink", "Chalk White"]
  },
  {
    id: "girlcrush_highfashion",
    label: "Girl Crush + High Fashion",
    mainStyle: "High Fashion / Editorial",
    secondaryStyle: "Streetwear",
    concept: "Girl Crush / Fierce",
    targetGroup: "girl_group",
    vibeSummary: "Powerful feminine confidence combined with dramatic, luxurious styling.",
    recommendedColors: ["Jet Black", "Liquid Gold", "Crimson Red"]
  },
  {
    id: "girlcrush_streetwear",
    label: "Girl Crush + Streetwear",
    mainStyle: "Streetwear",
    secondaryStyle: "Punk / Rock",
    concept: "Girl Crush / Swagger",
    targetGroup: "girl_group",
    vibeSummary: "Bold feminine energy mixed with modern urban street-luxe fashion.",
    recommendedColors: ["Obsidian Black", "Electric Lime", "Chrome Silver"]
  },
  {
    id: "femmefatale_elegant",
    label: "Femme Fatale + Elegant",
    mainStyle: "Elegant",
    secondaryStyle: "Dark / Gothic",
    concept: "Femme Fatale / Sophisticated",
    targetGroup: "girl_group",
    vibeSummary: "Mature, sophisticated glamour with a mysterious and alluring edge.",
    recommendedColors: ["Deep Bordeaux", "Pitch Black", "Molten Gold"]
  },
  {
    id: "femmefatale_darkgothic",
    label: "Femme Fatale + Dark / Gothic",
    mainStyle: "Dark / Gothic",
    secondaryStyle: "High Fashion / Editorial",
    concept: "Femme Fatale / Mysterious",
    targetGroup: "girl_group",
    vibeSummary: "A darker, more seductive and mysterious interpretation of feminine glamour.",
    recommendedColors: ["Midnight Obsidian", "Blood Red Velvet", "Smoked Pewter"]
  },
  {
    id: "balletcore_romantic",
    label: "Balletcore + Romantic",
    mainStyle: "Balletcore",
    secondaryStyle: "Romantic",
    concept: "Dreamy / Graceful",
    targetGroup: "girl_group",
    vibeSummary: "Graceful, delicate ballerina styling with an especially dreamy and feminine atmosphere.",
    recommendedColors: ["Ballet Blush Pink", "Chalk White", "Pale Lavender"]
  },
  {
    id: "coquette_romantic",
    label: "Coquette + Romantic",
    mainStyle: "Coquette",
    secondaryStyle: "Romantic",
    concept: "Flirtatious / Sweet",
    targetGroup: "girl_group",
    vibeSummary: "Soft, delicate, playful femininity with an especially flirtatious romantic quality.",
    recommendedColors: ["Powder Pink", "Ivory Cream", "Muted Wine"]
  },
  {
    id: "cottagecore_romantic",
    label: "Cottagecore + Romantic",
    mainStyle: "Cottagecore",
    secondaryStyle: "Romantic",
    concept: "Gentle / Nostalgic",
    targetGroup: "girl_group",
    vibeSummary: "Soft countryside nostalgia combined with romantic and gentle aesthetics.",
    recommendedColors: ["Sage Olive", "Warm Buttercream", "Terracotta Rose"]
  },
  {
    id: "military_darkgothic",
    label: "Military / Uniform + Dark / Gothic",
    mainStyle: "Military / Uniform",
    secondaryStyle: "Dark / Gothic",
    concept: "Commanding / Intense",
    targetGroup: "boy_group",
    vibeSummary: "A powerful structured uniform appearance with a darker, more dramatic mood.",
    recommendedColors: ["Obsidian Black", "Blood Wine Red", "Smoked Silver"]
  },
  {
    id: "military_elegant",
    label: "Military / Uniform + Elegant",
    mainStyle: "Military / Uniform",
    secondaryStyle: "Elegant",
    concept: "Authoritative / Regal",
    targetGroup: "boy_group",
    vibeSummary: "A more polished and sophisticated interpretation of structured uniform-inspired styling.",
    recommendedColors: ["Midnight Navy", "Burnished Gold", "Crisp White"]
  },
  {
    id: "badboy_streetwear",
    label: "Bad Boy + Streetwear",
    mainStyle: "Streetwear",
    secondaryStyle: "Punk / Rock",
    concept: "Bad Boy / Confident",
    targetGroup: "boy_group",
    vibeSummary: "Confident masculine styling with a casual urban edge and brooding attitude.",
    recommendedColors: ["Obsidian Black", "Deep Crimson", "Gunmetal Silver"]
  },
  {
    id: "badboy_rockstar",
    label: "Bad Boy + Rockstar",
    mainStyle: "Rockstar",
    secondaryStyle: "Punk / Rock",
    concept: "Bad Boy / Rebellious",
    targetGroup: "boy_group",
    vibeSummary: "Charismatic, rebellious rock styling with dramatic performance energy.",
    recommendedColors: ["Pitch Black Leather", "Heritage Red Plaid", "Chrome Steel"]
  },
  {
    id: "grunge_punkrock",
    label: "Grunge + Punk / Rock",
    mainStyle: "Grunge",
    secondaryStyle: "Punk / Rock",
    concept: "Rebellious / Defiant",
    targetGroup: "boy_group",
    vibeSummary: "Raw, rebellious, rough-edged fashion with stronger alternative rock music influence.",
    recommendedColors: ["Faded Charcoal", "Shadow Plaid Red", "Ash Grey"]
  },
  {
    id: "grunge_streetwear",
    label: "Grunge + Streetwear",
    mainStyle: "Grunge",
    secondaryStyle: "Streetwear",
    concept: "Rebellious / Casual",
    targetGroup: "boy_group",
    vibeSummary: "A more relaxed modern interpretation of grunge with urban street influence.",
    recommendedColors: ["Muted Olive", "Worn Black", "Off-White"]
  },
  {
    id: "gentleman_quietluxury",
    label: "Gentleman + Quiet Luxury",
    mainStyle: "Gentleman / Classic Masculine",
    secondaryStyle: "Luxury / Quiet Luxury",
    concept: "Sophisticated / Composed",
    targetGroup: "boy_group",
    vibeSummary: "A mature, polished masculine look focused on refinement and understated status.",
    recommendedColors: ["Camel Tan", "Alabaster White", "Rich Espresso"]
  },
  {
    id: "preppyboy_elegant",
    label: "Preppy Boy + Elegant",
    mainStyle: "Preppy Boy",
    secondaryStyle: "Elegant",
    concept: "Polished / Youthful",
    targetGroup: "boy_group",
    vibeSummary: "Youthful collegiate styling elevated into something more sophisticated and refined.",
    recommendedColors: ["Oxford Maroon", "Ivory White", "Camel Tan"]
  },
  {
    id: "eclectic_y2k",
    label: "Eclectic + Y2K",
    mainStyle: "Eclectic",
    secondaryStyle: "Y2K",
    concept: "Playful / Quirky",
    targetGroup: "all",
    vibeSummary: "A playful mix of different influences anchored by early-2000s nostalgia.",
    recommendedColors: ["Chartreuse Yellow", "Electric Cyan", "Optic White"]
  },
  {
    id: "eclectic_highfashion",
    label: "Eclectic + High Fashion",
    mainStyle: "Eclectic",
    secondaryStyle: "High Fashion / Editorial",
    concept: "Artistic / Dramatic",
    targetGroup: "all",
    vibeSummary: "Unconventional combinations elevated through dramatic editorial styling.",
    recommendedColors: ["Deep Bordeaux", "Lavender Purple", "Liquid Gold"]
  }
];

// ============================================================================
// HELPER FUNCTIONS & FORMULA BUILDER
// ============================================================================

/**
 * Builds the standard K-pop styling concept formula:
 * Main Style + Secondary Style + Concept
 * e.g., "Streetwear + High Fashion [Concept: Confident / Swagger]"
 */
export function buildKpopOutfitFormula(
  mainStyle: string,
  secondaryStyle?: string,
  concept?: string
): string {
  if (!secondaryStyle || secondaryStyle.toLowerCase() === mainStyle.toLowerCase()) {
    return concept ? `${mainStyle} [Concept: ${concept}]` : mainStyle;
  }
  return `${mainStyle} + ${secondaryStyle}${concept ? ` [Concept: ${concept}]` : ''}`;
}

/**
 * Filters fashion styles and mixes suitable for the current group gender.
 */
export function getAvailableStylesForGroup(
  groupGender?: string
): {
  universalStyles: KpopStyleItem[];
  genderSpecificStyles: KpopStyleItem[];
  mixPresets: KpopStyleMixPreset[];
  conceptItems: KpopConceptItem[];
} {
  const g = (groupGender || '').toLowerCase();
  const isBoy = g.includes('boy') || g.includes('male');
  const isGirl = g.includes('girl') || g.includes('female');

  let genderSpecificStyles: KpopStyleItem[] = [];
  if (isBoy) {
    genderSpecificStyles = BOY_GROUP_STYLES;
  } else if (isGirl) {
    genderSpecificStyles = GIRL_GROUP_STYLES;
  } else {
    genderSpecificStyles = [...BOY_GROUP_STYLES, ...GIRL_GROUP_STYLES];
  }

  const mixPresets = KPOP_STYLE_MIX_PRESETS.filter(p => {
    if (p.targetGroup === 'all') return true;
    if (isBoy && p.targetGroup === 'boy_group') return true;
    if (isGirl && p.targetGroup === 'girl_group') return true;
    return false;
  });

  const conceptItems = KPOP_CONCEPTS.filter(c => {
    if (c.appliesTo === 'all') return true;
    if (isBoy && c.appliesTo === 'boy_group') return true;
    if (isGirl && c.appliesTo === 'girl_group') return true;
    return false;
  });

  return {
    universalStyles: UNIVERSAL_KPOP_STYLES,
    genderSpecificStyles,
    mixPresets,
    conceptItems
  };
}

/**
 * Finds a style item by ID or name (fuzzy match).
 */
export function findKpopStyle(idOrName: string): KpopStyleItem | undefined {
  if (!idOrName) return undefined;
  const clean = idOrName.toLowerCase().trim();
  return ALL_KPOP_FASHION_STYLES.find(
    s => s.id.toLowerCase() === clean || s.name.toLowerCase() === clean || s.name.toLowerCase().includes(clean)
  );
}
