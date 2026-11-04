// services/kpopStylingService.ts
// Comprehensive, Non-Repeating Put-Together K-Pop Outfits & Salon Hairstyles Engine
// Generates diverse, cohesive, high-fashion K-pop idol coordinates and comeback hairstyles

export type CasualOutfitType = 'top_and_bottom' | 'onesie' | 'matching_set';

export interface PutTogetherOutfitItem {
  id: string;
  title: string;
  outfitType?: CasualOutfitType;
  aesthetic?: string;
  gender: 'female' | 'male';
  topType: string;
  bottomType: string;
  buildDescription: (c1: string, c2: string, neutral: string) => string;
}

export type HairLengthCategory = 'ultra-short' | 'short' | 'medium' | 'long' | 'extra-long';

export interface KpopHairstyleItem {
  id: string;
  title: string;
  gender: 'female' | 'male';
  hairCut: string;
  hairColor: string;
  lengthCategory: HairLengthCategory;
  prompt: string;
}

// ============================================================================
// 1. FEMALE YOUTHFUL KOREAN CASUAL FASHION (K-Fashion for 18-21 Year Old Rookie Idols)
// Authentic Seoul idol off-duty, airport fashion, Hongdae street style, and dance practice chic.
// REDESIGNED ADULT & TAILORED CLOTHING: Blazers, trench coats, waistcoats, button-downs, and suiting
// are creatively deconstructed, cropped, and re-engineered with youthful K-pop idol edge.
// RICH GARMENT DESIGN DETAILS (NEVER A BARE CLOTHING OUTFIT): Hardware, silver shank buttons,
// two-way zippers, D-rings, grommets, chains, raw-cut hems, contrast stitching, and architectural pleats.
// STRICT ANTI-REPETITION: Every outfit pairs a distinct top category with a distinct bottom category.
// ============================================================================
export const FEMALE_PUT_TOGETHER_OUTFITS: PutTogetherOutfitItem[] = [
  // --- K-Fashion Female Casual Coordinates with Redesigned Tailoring & Rich Design Details ---
  {
    id: "f_kcasual_cropped_tailored_blazer_skort",
    title: "Redesigned Cropped Deconstructed Blazer & Pleated Suiting Mini-Skort",
    outfitType: "top_and_bottom",
    gender: "female",
    topType: "blazer",
    bottomType: "pleated_skort",
    aesthetic: "Avant-Garde Idol Tailoring",
    buildDescription: (c1, c2, neutral) =>
      `a stunning K-pop idol redesign of classic tailoring for an 18-21 year old rookie idol with incredible garment design details. Featuring a cropped boxy double-breasted tailored suiting blazer in ${c1} with sharp padded drop shoulders, raw deconstructed frayed hem cut right at the waistline, polished silver heraldic shank buttons, and a decorative cluster of silver safety-pin chain brooches on the notched lapel, layered open over a fitted scoop-neck modal rib baby top in ${c2} with contrast micro-overlock stitching. Paired with a high-waisted knife-pleated suiting skort in ${neutral} featuring a trompe-l'œil double waistband and an integrated leather belt with a polished silver double-grommet buckle. In medium framing, the raw blazer hem, visible waistband, and silver belt are clearly shown. COLOR COORDINATION: Striking tailored contrast where ${c1} cropped blazer frames the clean ${c2} baby top, anchored by crisp ${neutral} pleated suiting.`
  },
  {
    id: "f_kcasual_deconstructed_trench_fluid_slacks",
    title: "Cropped Deconstructed Trench Blouson & Fluid Split-Hem Trousers",
    outfitType: "top_and_bottom",
    gender: "female",
    topType: "trench_blouson",
    bottomType: "fluid_slacks",
    aesthetic: "K-Fashion Airport Chic",
    buildDescription: (c1, c2, neutral) =>
      `an avant-garde idol rework of the classic trench coat rich in clothing design details. Featuring a cropped cotton-gabardine trench blouson in ${c1} with wide notched storm flaps, contrast leather-piped collar, buckled silver D-ring cuff cinch straps, and an exposed two-way silver industrial zipper, layered over an asymmetric shoulder-cutout ribbed baby top in ${c2}. Paired with high-waisted fluid wide-leg double-pleated tailored trousers in ${neutral} featuring sharp front pressed creases, side-slit split hems with silver snap buttons, and a sleek leather belt with a polished silver Western buckle. COLOR COORDINATION: Sophisticated modern palette uniting ${c1} trench twill, ${c2} ribbed accent, and fluid ${neutral} tailoring.`
  },
  {
    id: "f_kcasual_tailored_waistcoat_mesh_pleats",
    title: "Asymmetric Tailored Suiting Waistcoat & Pleated Trouser-Skort",
    outfitType: "top_and_bottom",
    gender: "female",
    topType: "waistcoat",
    bottomType: "pleated_trousers",
    aesthetic: "Rebel Chic High-Teen Suiting",
    buildDescription: (c1, c2, neutral) =>
      `a modern idol redesign of the classic tailored menswear waistcoat. Featuring a tailored subtle pinstripe suiting vest in ${c1} with an asymmetric pointed hemline, polished silver ball buttons, and an open cutout back with an adjustable silver ring-buckle cinch strap, layered over a fine-gauge sheer mesh long-sleeve tee in ${c2} with thumbhole cuffs. Paired with high-waisted fluid pleated suiting trousers in ${neutral} featuring a double-folded waistband, front knife pleats, and a delicate silver chain swag draping across the front belt loops. COLOR COORDINATION: Architectural suiting interplay between ${c1} pinstripe, ${c2} sheer mesh, and ${neutral} pleated trousers.`
  },
  {
    id: "f_kcasual_poplin_corset_cable_vest",
    title: "Deconstructed Poplin Shirt with Back Corset-Lacing & Cropped Cable Vest",
    outfitType: "top_and_bottom",
    gender: "female",
    topType: "poplin_shirt",
    bottomType: "tennis_skort",
    aesthetic: "High-Teen Preppy Casual",
    buildDescription: (c1, c2, neutral) =>
      `an inventive high-teen redesign of classic academic shirting packed with intricate design features. Featuring a crisp cotton-poplin button-down shirt in ${c2} with extended French cuffs featuring silver cufflinks, asymmetric pointed collar, and corset-style ribbon lace-up detailing along the back waist, layered under a cropped asymmetric cable-knit vest in ${c1} with raw-cut split sides held by metallic ring tabs. Paired with a knife-pleated high-teen tennis mini-skort in ${neutral} with a visible tailored waistband and silver eyelet grommet belt. COLOR COORDINATION: Clean collegiate color-blocking uniting ${c1} knitwear, ${c2} crisp poplin, and ${neutral} pleated skort.`
  },
  {
    id: "f_kcasual_cropped_raw_denim_grommet_puddle",
    title: "Cropped Raw-Hem Denim Trucker with Corset Back & Puddle Jeans",
    outfitType: "top_and_bottom",
    gender: "female",
    topType: "denim_trucker",
    bottomType: "puddle_denim",
    aesthetic: "Seongsu-dong Urban Denim",
    buildDescription: (c1, c2, neutral) =>
      `an elevated K-pop redesign of the classic denim trucker loaded with garment design details. Featuring a boxy cropped washed denim jacket in ${c1} with contrast ivory topstitching, dual 3D flap chest pockets with silver donut snaps, raw frayed hem, and lace-up corset eyelets along the back waist, layered open over a fitted ribbed scoop-neck baby crop tank in ${c2}. Paired with low-slung wide-leg baggy skater puddle jeans in vintage washed ${neutral} featuring distressed panel stitching and a double-prong silver grommet belt. COLOR COORDINATION: Vibrant tonal contrast where the ${c1} cropped jacket frames the clean ${c2} baby crop top, anchored by relaxed ${neutral} skater denim.`
  },
  {
    id: "f_kcasual_moto_blouson_cargo_pleat_skort",
    title: "Cropped Moto Blouson with Silver Hardware & Pleated Cargo Skort",
    outfitType: "top_and_bottom",
    gender: "female",
    topType: "moto_jacket",
    bottomType: "cargo_skort",
    aesthetic: "Edgy Hongdae Street-Casual",
    buildDescription: (c1, c2, neutral) =>
      `an edgy, stylish Korean idol casual outfit packed with garment design details. Featuring a cropped washed cotton-twill moto jacket in ${c1} with asymmetric silver metallic zippers, snap-down studded lapels, and dual buckled waist tabs, worn open over a fitted square-neck ribbed baby crop top in ${c2} with contrast lettuce-edge seams. Paired with a structured pleated utility cargo mini-skort in ${neutral} featuring 3D accordion cargo pockets with silver D-rings and a double-grommet leather belt. COLOR COORDINATION: Tactile streetwear aesthetic harmonizing ${c1} with ${neutral} cargo skort and ${c2} baby crop accents.`
  },
  {
    id: "f_kcasual_distressed_mohair_hybrid_skort",
    title: "Slouchy Distressed Open-Knit Mohair & Denim-Suiting Hybrid Skort",
    outfitType: "top_and_bottom",
    gender: "female",
    topType: "mohair_cardigan",
    bottomType: "hybrid_skort",
    aesthetic: "Rehearsal Chic & Soft Grunge",
    buildDescription: (c1, c2, neutral) =>
      `a high-fashion idol off-duty look rich in texture, garment construction, and hardware design. Featuring a slouchy drop-shoulder brushed open-knit mohair cardigan in ${c1} with oversized custom engraved metal buttons and laddered distressed knit accents, loosely buttoned at the waist over a fitted fine-ribbed baby tee in ${c2} with exposed contrast micro-overlock stitching. Paired with a high-waisted pleated hybrid skort combining washed denim and suiting twill in ${neutral} with a visible tailored waistband and silver chain-link belt. COLOR COORDINATION: Rich textural play between fluffy ${c1} knitwear and crisp ${neutral} denim-suiting, accented by the ${c2} inner tee.`
  },
  {
    id: "f_kcasual_sporty_windbreaker_wrap_skort",
    title: "Sporty Retro Track Windbreaker with Metallic Piping & Asymmetric Wrap Kilt",
    outfitType: "top_and_bottom",
    gender: "female",
    topType: "track_windbreaker",
    bottomType: "wrap_skirt",
    aesthetic: "Dance Practice & High-Teen Chic",
    buildDescription: (c1, c2, neutral) =>
      `a high-energy Korean casual idol look full of graphic and hardware design details. Featuring a cropped retro nylon track windbreaker jacket in ${c1} with contrast metallic silver sleeve piping, high stand funnel collar, and an exposed two-way chunky zipper with O-ring pull in ${c2}, worn partially open over a fitted ribbed scoop crop top. Paired with an A-line asymmetric wrap kilt-skort in ${neutral} featuring double leather buckle strap closures, knife pleats, and a subtle contrast ${c2} lining peeking at the split hem. COLOR COORDINATION: Fresh youthful athletic color-blocking uniting ${c1} nylon, ${c2} athletic piping, and crisp ${neutral} wrap kilt.`
  },
  {
    id: "f_kcasual_contrast_stitch_rib_set",
    title: "Contrast-Stitch Zip-Collar Waffle Top & Pintuck Wide-Leg Pants (Matching Set)",
    outfitType: "matching_set",
    gender: "female",
    topType: "waffle_top",
    bottomType: "pintuck_trousers",
    aesthetic: "Luxury Airport Lounge Set",
    buildDescription: (c1, c2, neutral) =>
      `an elevated matching 2-piece Korean designer lounge set packed with structural details. Featuring a long-sleeve zip-collar waffle henley top in ${c1} with bold contrast ${c2} micro-overlock flatlock stitching, exposed silver industrial zipper, and thumbhole cuffs, paired with matching wide-leg trousers in the exact same ${c1} fabric with tailored front pintuck crease seams, a foldover trompe-l'œil waistband, and subtle ${neutral} piping. COLOR COORDINATION: Flawless monochromatic matching set in ${c1} with dynamic ${c2} contrast stitching.`
  },
  {
    id: "f_kcasual_varsity_bomber_bermuda_shorts",
    title: "Satin-Twill Varsity Bomber & Tailored Pleated Bermuda City Shorts",
    outfitType: "top_and_bottom",
    gender: "female",
    topType: "varsity_bomber",
    bottomType: "bermuda_shorts",
    aesthetic: "Rookie Idol Campus Casual",
    buildDescription: (c1, c2, neutral) =>
      `a dynamic, youthful Korean casual outfit bursting with fresh rookie idol charisma and tailored proportions. Featuring a lightweight satin-twill varsity bomber jacket in ${c1} with metallic silver snap buttons, striped rib knit collar and cuffs in ${c2}, and tonal sleeve embroidery, layered over a fitted scoop-neck baby crop tee in ${c2}. Paired with tailored knee-length pleated Bermuda city shorts in structured ${neutral} twill featuring sharp front pressed creases, a wide leather belt with double silver O-rings, and clean tailored cuffs. COLOR COORDINATION: Vibrant collegiate color harmony between ${c1} satin, ${c2} athletic ribbing, and ${neutral} tailored shorts.`
  },
  {
    id: "f_kcasual_asymmetric_cutout_cargo_skater",
    title: "Asymmetric Shoulder Cut-Out Baby Top & Baggy Cargo Skater Pants",
    outfitType: "top_and_bottom",
    gender: "female",
    topType: "cutout_top",
    bottomType: "cargo_pants",
    aesthetic: "Minimalist Cool & Gen-Z K-Fashion",
    buildDescription: (c1, c2, neutral) =>
      `a razor-sharp modern Korean casual look designed for a trendy young idol. Featuring an asymmetric shoulder-cutout long-sleeve fine baby rib top in ${c1} with thumbhole cuffs and contrast silver zip teeth along the neckline, tucked into low-rise relaxed baggy cargo skater pants in ${neutral} with side 3D utility cargo pockets, silver D-rings, and a double-prong silver buckle belt, accented with a ${c2} inner layered strap. COLOR COORDINATION: Sleek architectural contrast between ${c1} rib knit, ${neutral} baggy cargo pants, and ${c2} inner accent.`
  },
  {
    id: "f_kcasual_sporty_track_romper_onesie",
    title: "Sporty Zip-Up Track Romper with Bungee Drawstring & Silver Hardware (Onesie)",
    outfitType: "onesie",
    gender: "female",
    topType: "track_romper",
    bottomType: "onesie",
    aesthetic: "Summer Festival Idol Chic",
    buildDescription: (c1, c2, neutral) =>
      `a standout one-piece Korean casual track romper packed with garment design details. Featuring a tailored sporty short-sleeve zip-up romper in structured matte ${c1} nylon-cotton with an open stand collar, silver ring zipper, contrast athletic side-stripes in ${c2}, dual chest zip pockets, and an adjustable bungee drawstring cinch at the waist with polished metal toggles, layered with a clean ${neutral} collar lining. COLOR COORDINATION: Dynamic sporty one-piece in ${c1} accented sharply with ${c2} side piping and ${neutral} accents.`
  },
  {
    id: "f_kcasual_heavyweight_hoodie_denim_jorts",
    title: "Cropped Heavyweight Zip Hoodie & Slouchy Raw-Hem Denim Jorts",
    outfitType: "top_and_bottom",
    gender: "female",
    topType: "hoodie",
    bottomType: "denim_jorts",
    aesthetic: "Hongdae Skater Grunge",
    buildDescription: (c1, c2, neutral) =>
      `a fresh dance-practice street coordinate full of youthful rookie energy. Featuring an oversized cropped 400gsm French-terry zip hoodie in ${c1} with raw-edge hems, exposed chunky silver two-way zipper, and contrast drawstrings in ${c2}, worn over a fitted ribbed scoop crop tank in ${c2}. Paired with slouchy wide-leg raw-hem denim jorts in washed ${neutral} falling just above the knee, styled with a silver wallet chain and double-grommet belt. COLOR COORDINATION: Authentic Seoul skate aesthetic pairing ${c1} terry with ${neutral} jorts and crisp ${c2} underlayer.`
  },
  {
    id: "f_kcasual_collegiate_sweatshirt_carpenter_pants",
    title: "Slouchy Off-Shoulder Sweatshirt & Wide Canvas Carpenter Pants",
    outfitType: "top_and_bottom",
    gender: "female",
    topType: "sweatshirt",
    bottomType: "carpenter_pants",
    aesthetic: "Indie Practice Room Chic",
    buildDescription: (c1, c2, neutral) =>
      `an effortlessly stylish off-duty rehearsal coordinate loaded with construction details. Featuring an oversized slouchy crewneck sweatshirt in ${c1} with ${c3 || 'distressed'} collegiate chest embroidery worn casually off one shoulder to reveal a ${c2} ribbed camisole strap. Paired with relaxed wide-leg canvas carpenter skate pants in ${neutral} with reinforced double-knee utility patches, hammer loop, and a silver clip buckle belt. COLOR COORDINATION: Cozy practice room contrast uniting ${c1} fleece with rugged ${neutral} canvas and ${c2} accents.`
  },
  {
    id: "f_kcasual_bowling_shirt_flared_slacks",
    title: "Boxy Embroidered Bowling Shirt & Flared Stage Slacks with Split Hems",
    outfitType: "top_and_bottom",
    gender: "female",
    topType: "overshirt",
    bottomType: "flared_slacks",
    aesthetic: "Retro High-Fashion Idol",
    buildDescription: (c1, c2, neutral) =>
      `a retro-modern idol coordinate with sleek structural tailoring. Featuring a boxy camp-collar bowling overshirt in textured slub cotton in ${c1} with contrast collar piping and custom script chest embroidery in ${c2}, worn open over a fitted square-neck baby tee in ${c2}. Paired with high-waisted low-slung flared tailored slacks in ${neutral} featuring front pressed creases, inner leg split hems with silver snaps, and a polished leather belt. COLOR COORDINATION: Clean retro harmony between ${c1} slub cotton, ${c2} embroidery, and sleek ${neutral} flared trousers.`
  },
  {
    id: "f_kcasual_racer_zip_parachute_pants",
    title: "High-Neck Racer Zip Top & Parachute Track Pants with Bungee Hems",
    outfitType: "top_and_bottom",
    gender: "female",
    topType: "windbreaker",
    bottomType: "track_pants",
    aesthetic: "Y2K High-Velocity Streetwear",
    buildDescription: (c1, c2, neutral) =>
      `a high-octane 5th-gen rookie idol coordinate full of technical details. Featuring a cropped mock-neck performance zip top in ${c1} with contrast ergonomic athletic side panels in ${c2}, thumbhole cuffs, and exposed two-way silver zipper. Paired with lightweight nylon parachute track pants in ${neutral} with deep bellows cargo pockets, silver D-rings, and adjustable bungee drawstring hems cinched around high-top court sneakers. COLOR COORDINATION: Futuristic athletic blocking pairing ${c1} technical knit with ${c2} racing inserts and grounded ${neutral} nylon.`
  },
  {
    id: "f_kcasual_rugby_polo_denim_miniskirt",
    title: "Cropped Contrast Rugby Polo & Raw-Edge Denim Mini-Skirt with Brooches",
    outfitType: "top_and_bottom",
    gender: "female",
    topType: "polo",
    bottomType: "denim_skirt",
    aesthetic: "Campus Rebel Idol",
    buildDescription: (c1, c2, neutral) =>
      `a spunky, vibrant idol campus look. Featuring a boxy cropped combed-cotton rugby polo in ${c1} with a crisp white poplin collar and horizontal stripe in ${c2}, concealed metal snap placket, and raw-cut hem. Paired with a distressed low-rise denim mini-skirt in washed ${neutral} with raw frayed hem, side pockets with decorative safety-pin hardware clusters, and a slim leather belt with silver buckle. COLOR COORDINATION: Playful sporty contrast between ${c1} rugby knit, ${c2} collar, and ${neutral} denim.`
  },
  {
    id: "f_kcasual_knit_vest_foldover_trousers",
    title: "Asymmetric Split-Side Knit Vest & Foldover-Waistband Puddle Trousers",
    outfitType: "top_and_bottom",
    gender: "female",
    topType: "knit_vest",
    bottomType: "foldover_trousers",
    aesthetic: "Avant-Garde Seongsu-dong",
    buildDescription: (c1, c2, neutral) =>
      `an editorial everyday idol look rich in structural tailoring. Featuring an asymmetric chunky cable-knit vest in ${c1} with open lace-up split sides held by metallic eyelets, worn over a crisp white long-sleeve cotton tee in ${c2}. Paired with fluid wide-leg puddle trousers in ${neutral} featuring a trendy fold-over contrast waistband, front knife pleats, and a delicate silver chain draped across the side seam. COLOR COORDINATION: Avant-garde tactile layering pairing ${c1} knitwear with ${c2} cotton and ${neutral} suiting.`
  }
];

// ============================================================================
// 2. MALE YOUTHFUL KOREAN CASUAL FASHION (K-Fashion for 18-21 Year Old Rookie Idols)
// Authentic Seoul idol off-duty, airport fashion, Hongdae street style, and dance practice chic.
// REDESIGNED ADULT & TAILORED CLOTHING: Blazers, trench coats, waistcoats, button-downs, and suiting
// are creatively deconstructed, cropped, and re-engineered with youthful K-pop idol edge.
// RICH GARMENT DESIGN DETAILS (NEVER A BARE CLOTHING OUTFIT): Hardware, silver shank buttons,
// two-way zippers, D-rings, grommets, chains, raw-cut hems, contrast stitching, and architectural pleats.
// STRICT ANTI-REPETITION: Every male outfit pairs a distinct top category with a distinct bottom category.
// ============================================================================
export const MALE_PUT_TOGETHER_OUTFITS: PutTogetherOutfitItem[] = [
  // --- K-Fashion Male Casual Coordinates with Redesigned Tailoring & Rich Design Details ---
  {
    id: "m_kcasual_cropped_tailored_blazer_puddle_denim",
    title: "Redesigned Cropped Deconstructed Wool Blazer & Baggy Skater Puddle Denim",
    outfitType: "top_and_bottom",
    gender: "male",
    topType: "blazer",
    bottomType: "puddle_denim",
    aesthetic: "Avant-Garde Idol Tailoring",
    buildDescription: (c1, c2, neutral) =>
      `a striking K-pop idol redesign of traditional menswear tailoring loaded with rich garment design details. Featuring a boxy cropped single-breasted wool-blend blazer in ${c1} with sharp padded drop shoulders, raw deconstructed fray hem cut at the waistline, polished silver heraldic shank buttons, and a decorative silver safety-pin chain link brooch on the notched lapel, layered over a heavyweight combed-cotton skate tee in ${c2} with minimalist chest typography. Paired with relaxed wide-leg skater puddle jeans in vintage washed ${neutral} with a sturdy black leather belt and polished silver double-grommet buckle. In medium framing, the cropped blazer hem, belt, and wide denim drape are clearly visible. COLOR COORDINATION: Avant-garde balance uniting ${c1} tailored wool, ${c2} skate tee, and ${neutral} vintage skater denim.`
  },
  {
    id: "m_kcasual_deconstructed_trench_wide_slacks",
    title: "Cropped Deconstructed Cotton Trench Blouson & Fluid Pleated Trousers",
    outfitType: "top_and_bottom",
    gender: "male",
    topType: "trench_blouson",
    bottomType: "fluid_slacks",
    aesthetic: "K-Fashion Airport Chic",
    buildDescription: (c1, c2, neutral) =>
      `an avant-garde idol rework of the classic double-breasted trench coat with intricate construction details. Featuring a cropped cotton-gabardine trench blouson in ${c1} with an exaggerated storm flap, contrast leather-piped collar, silver D-ring cuff cinch straps, and a concealed two-way silver zipper, worn over a fine-gauge mock-neck knit in ${c2}. Paired with fluid wide-leg double-pleated tailored trousers in ${neutral} featuring sharp front pressed creases, split side hems with silver snap buttons, and a sleek leather belt with polished silver buckle. COLOR COORDINATION: Elevated high-fashion palette pairing ${c1} gabardine with ${c2} knit and fluid ${neutral} trousers.`
  },
  {
    id: "m_kcasual_tailored_waistcoat_oversized_shirt",
    title: "Asymmetric Tailored Suiting Waistcoat & Oversized Poplin Shirt with Tie",
    outfitType: "top_and_bottom",
    gender: "male",
    topType: "waistcoat",
    bottomType: "pleated_trousers",
    aesthetic: "Rebel Chic Idol Suiting",
    buildDescription: (c1, c2, neutral) =>
      `a sophisticated yet rebellious idol redesign of classic formalwear. Featuring a tailored subtle pinstripe suiting waistcoat in ${c1} with asymmetric front button closure and an adjustable silver ring buckle back cinch strap, layered over an oversized crisp white poplin shirt in ${c2} with extended French cuffs peeking out and a loosely untied slim black necktie. Paired with relaxed wide-leg pleated trousers in ${neutral} with a clean fluid drape and hanging silver chain accent. COLOR COORDINATION: Daring runway-inspired styling blending ${c1} suiting vest, ${c2} crisp poplin, and grounded ${neutral} slacks.`
  },
  {
    id: "m_kcasual_cropped_denim_trucker_jorts",
    title: "Boxy Cropped Washed Denim Trucker & Raw-Hem Denim Jorts with Chain",
    outfitType: "top_and_bottom",
    gender: "male",
    topType: "denim_trucker",
    bottomType: "denim_jorts",
    aesthetic: "Dance Practice Street-Casual",
    buildDescription: (c1, c2, neutral) =>
      `an elevated denim coordinate loaded with clothing design details and modern streetwear proportions. Featuring a boxy cropped vintage-washed denim trucker jacket in ${c1} with contrast golden topstitching, dual 3D flap chest pockets with silver donut buttons, raw-edge waistline, and buckled waist-adjuster tabs, layered open over a soft waffle-knit long-sleeve tee in ${c2} with cuffs peeking out. Paired with relaxed wide-leg raw-hem denim jorts in washed ${neutral} falling below the knee with a hanging silver key-clip wallet chain and sturdy leather belt. COLOR COORDINATION: Tonal denim play between ${c1} jacket and ${neutral} jorts, bridged by clean ${c2} inner waffle tee.`
  },
  {
    id: "m_kcasual_motorsport_racing_jacket_cargos",
    title: "Sporty Motorsport Racing Jacket with Leatherette Panels & Cargo Skate Pants",
    outfitType: "top_and_bottom",
    gender: "male",
    topType: "racing_jacket",
    bottomType: "cargo_pants",
    aesthetic: "Rookie Idol High-Octane Streetwear",
    buildDescription: (c1, c2, neutral) =>
      `a high-octane rookie idol streetwear jacket packed with graphic and construction details. Featuring a lightweight twill motorsport racing jacket in ${c1} with bold athletic geometric leatherette panels in ${c2}, snap-tab mandarin collar, silver zipped chest pockets, and elbow patch seams, layered over a boxy skate tee in ${c2}. Paired with relaxed wide-leg baggy cargo skate pants in ${neutral} featuring 3D flap pockets with silver D-rings and a double-prong belt. COLOR COORDINATION: Daring streetwear energy pairing ${c1} motorsport styling with ${c2} racing panels and ${neutral} cargo pants.`
  },
  {
    id: "m_kcasual_distressed_mohair_corduroy_slacks",
    title: "Slouchy Distressed Mohair Cardigan & Wide-Leg Corduroy Skater Slacks",
    outfitType: "top_and_bottom",
    gender: "male",
    topType: "mohair_cardigan",
    bottomType: "corduroy_slacks",
    aesthetic: "Soft-Boy Indie K-Fashion",
    buildDescription: (c1, c2, neutral) =>
      `a tactile, high-fashion soft-boy idol look rich in texture and hardware design. Featuring a slouchy oversized brushed open-knit mohair cardigan in ${c1} with natural horn buttons, dropped shoulders, and subtle laddered knit distressing, worn open over a heavyweight crewneck skate tee in ${c2} with contrast overlock stitching. Paired with relaxed wide-leg wale corduroy skater slacks in ${neutral} with a clean leather belt, silver wallet chain, and soft fluid drape. COLOR COORDINATION: Rich tactile contrast between fluffy ${c1} mohair and textured ${neutral} corduroy, accented with clean ${c2} cotton.`
  },
  {
    id: "m_kcasual_colorblock_track_parachute_pants",
    title: "Sporty Color-Block Track Windbreaker & Bungee Parachute Track Pants",
    outfitType: "top_and_bottom",
    gender: "male",
    topType: "track_windbreaker",
    bottomType: "track_pants",
    aesthetic: "Dance Practice & Hongdae Street",
    buildDescription: (c1, c2, neutral) =>
      `a high-energy Korean streetwear idol look bursting with 18-21 youthfulness and technical design. Featuring an oversized 90s-inspired lightweight nylon track windbreaker jacket in ${c1} with bold geometric sleeve panels in ${c2}, stand collar with exposed metallic two-way zip, and bungee toggle waist cinch, layered open over a fitted white ribbed tank in ${c2}. Paired with lightweight nylon parachute track pants in ${neutral} with contrast side piping, silver D-rings, and adjustable bungee toggle hems. COLOR COORDINATION: Fresh athletic color-blocking uniting ${c1} nylon, ${c2} contrast panels, and ${neutral} parachute pants.`
  },
  {
    id: "m_kcasual_washed_zip_hoodie_carpenter_pants",
    title: "Pigment-Washed Heavyweight Zip Hoodie with Chunky Two-Way Zip & Carpenter Pants",
    outfitType: "top_and_bottom",
    gender: "male",
    topType: "zip_hoodie",
    bottomType: "carpenter_pants",
    aesthetic: "Hongdae Hip-Hop Casual",
    buildDescription: (c1, c2, neutral) =>
      `an authentic dance studio street look with rich garment construction details. Featuring an oversized 420gsm pigment-washed heavyweight French terry zip hoodie in ${c1} with a structured double-layer hood, raw-edge seam details, and chunky two-way silver zipper unzipped from the bottom, worn over a fitted white ribbed tank in ${c2}. Paired with relaxed wide-leg canvas carpenter skate pants in ${neutral} with utility hammer-loop detailing, reinforced knee panels, and a silver grommet belt. COLOR COORDINATION: Washed vintage streetwear palette where ${c1} French terry pairs seamlessly with ${neutral} canvas and ${c2} tank.`
  },
  {
    id: "m_kcasual_rugby_knit_bermuda_shorts",
    title: "Heavyweight Contrast Rugby Polo & Tailored Pleated Bermuda Shorts",
    outfitType: "top_and_bottom",
    gender: "male",
    topType: "rugby_polo",
    bottomType: "bermuda_shorts",
    aesthetic: "Seongsu-dong Collegiate Skate",
    buildDescription: (c1, c2, neutral) =>
      `a fresh, modern Korean casual outfit updating collegiate sportswear with idol swagger and tailored proportions. Featuring a heavyweight 360gsm combed-cotton relaxed rugby polo knit in ${c1} with a crisp white poplin collar and horizontal chest stripe in ${c2}, concealed silver metal snap placket, and split side hems with herringbone tape. Paired with tailored knee-length pleated Bermuda shorts in structured ${neutral} twill with sharp front pressed creases, a double-ring leather belt, and clean cuffed hems. COLOR COORDINATION: Bold collegiate color blocking between ${c1}, ${c2} contrast twill, and grounded ${neutral} tailored shorts.`
  },
  {
    id: "m_kcasual_waffle_lounge_matching_set",
    title: "Heavyweight Waffle-Knit Half-Zip Pullover & Pintuck Wide Pants (Matching Set)",
    outfitType: "matching_set",
    gender: "male",
    topType: "waffle_pullover",
    bottomType: "pintuck_trousers",
    aesthetic: "Designer Airport Travel Set",
    buildDescription: (c1, c2, neutral) =>
      `an elevated 2-piece Korean casual lounge set that looks intentional, youthful, and stylish with bespoke tailoring touches. Featuring a heavyweight waffle-knit drop-shoulder pullover in ${c1} with raw-edge split hems, exposed silver half-zip collar with ring pull, and thumbhole cuffs, paired with matching relaxed wide-leg waffle trousers in the exact same ${c1} fabric with tailored front pintuck creases, an adjustable bungee drawstring waistband with metallic toggles, and subtle ${neutral} piping. COLOR COORDINATION: Flawless monochromatic matching set in ${c1} with subtle ${c2} and ${neutral} accents.`
  },
  {
    id: "m_kcasual_bowling_shirt_flared_slacks",
    title: "Boxy Embroidered Bowling Shirt & Flared Slacks with Split Hems",
    outfitType: "top_and_bottom",
    gender: "male",
    topType: "bowling_shirt",
    bottomType: "flared_slacks",
    aesthetic: "Vintage Idol Off-Duty",
    buildDescription: (c1, c2, neutral) =>
      `a breezy, effortless Korean casual outfit radiating youthful 18-21 idol charm and sharp tailoring. Featuring a boxy short-sleeve camp-collar bowling shirt in textured slub cotton in ${c1} with contrast collar piping, custom chest embroidery in ${c2}, and silver shank buttons, worn open over a clean white long-sleeve waffle tee in ${c2}. Paired with relaxed flared tailored trousers in ${neutral} with split side hems featuring silver snap buttons and a polished leather belt with silver buckle. COLOR COORDINATION: Youthful retro color harmony uniting ${c1} shirt, ${c2} layered tee, and ${neutral} flared trousers.`
  },
  {
    id: "m_kcasual_flannel_overshirt_wide_chinos",
    title: "Heavyweight Plaid Flannel Overshirt & Double-Pleat Wide Chino Trousers",
    outfitType: "top_and_bottom",
    gender: "male",
    topType: "flannel_overshirt",
    bottomType: "chinos",
    aesthetic: "Effortless Rookie Idol Charisma",
    buildDescription: (c1, c2, neutral) =>
      `a classic Korean idol off-duty casual fit reimagined with modern wide proportions and hardware details. Featuring a premium heavyweight brushed-cotton plaid flannel overshirt in ${c1} with drop shoulders, silver snap buttons, dual chest flap pockets with metal corner rivets, and raw frayed hem, worn open over a boxy skate tee in ${c2}. Paired with relaxed double-pleated wide-leg chino trousers in ${neutral} with sharp pressed creases and a sturdy leather belt with silver buckle. COLOR COORDINATION: Rich vintage flannel tones in ${c1} balanced by pristine ${c2} cotton and ${neutral} chinos.`
  },
  {
    id: "m_kcasual_collegiate_crewneck_kilt_slacks",
    title: "Dropped-Shoulder Collegiate Crewneck & Tailored Asymmetric Kilt-Over-Slacks",
    outfitType: "top_and_bottom",
    gender: "male",
    topType: "sweatshirt",
    bottomType: "kilt_slacks",
    aesthetic: "Avant-Garde K-Fashion Runway",
    buildDescription: (c1, c2, neutral) =>
      `a runway-ready Korean idol streetwear coordinate mixing preppy collegiate comfort with daring runway tailoring. Featuring an oversized dropped-shoulder collegiate crewneck sweatshirt in ${c1} with bold varsity chest typography in ${c2}, worn over a crisp mock-neck base. Paired with a tailored suiting asymmetric pleated wrap kilt layered over slim fluid trousers in ${neutral} with silver buckle cinch straps and a hanging chain link. COLOR COORDINATION: Bold high-fashion contrast pairing ${c1} fleece with ${c2} graphics and ${neutral} suiting.`
  },
  {
    id: "m_kcasual_athletic_hockey_jersey_puddle_denim",
    title: "Oversized Athletic Hockey Jersey & Relaxed Wide Skater Puddle Denim",
    outfitType: "top_and_bottom",
    gender: "male",
    topType: "jersey",
    bottomType: "puddle_denim",
    aesthetic: "90s Retro Boygroup Streetwear",
    buildDescription: (c1, c2, neutral) =>
      `an authentic high-energy dance studio look bursting with 90s boyband nostalgia. Featuring an oversized athletic mesh hockey jersey in ${c1} with bold geometric sleeve striping and collegiate chest numerals in ${c2}, layered over a long-sleeve thermal tee in ${c2}. Paired with relaxed wide-leg skater puddle denim jeans in vintage washed ${neutral} with distressed whisker fading and a silver wallet chain. COLOR COORDINATION: Energetic athletic blocking uniting ${c1} mesh, ${c2} sports striping, and grounded ${neutral} denim.`
  },
  {
    id: "m_kcasual_knit_vest_foldover_trousers",
    title: "Deconstructed Split-Side Knit Vest & Foldover Puddle Trousers",
    outfitType: "top_and_bottom",
    gender: "male",
    topType: "knit_vest",
    bottomType: "foldover_trousers",
    aesthetic: "Contemporary Seongsu-dong",
    buildDescription: (c1, c2, neutral) =>
      `a contemporary idol look built around textural knitwear and architectural trouser cuts. Featuring a deconstructed boxy knit vest in ${c1} with open split side seams fastened with silver metal ring clips, worn over an oversized crisp poplin long-sleeve shirt in ${c2} with extended cuffs. Paired with fluid wide-leg puddle trousers in ${neutral} featuring a foldover contrast waistband, front pleats, and clean drape. COLOR COORDINATION: Architectural layering pairing ${c1} textured knit with ${c2} crisp poplin and ${neutral} trousers.`
  },
  {
    id: "m_kcasual_varsity_bomber_cargo_skate",
    title: "Satin-Twill Varsity Bomber & 3D Utility Double-Knee Skate Pants",
    outfitType: "top_and_bottom",
    gender: "male",
    topType: "bomber",
    bottomType: "cargo_pants",
    aesthetic: "High-Teen Idol Varsity",
    buildDescription: (c1, c2, neutral) =>
      `a varsity-inspired idol street coordinate packed with hardware details. Featuring a relaxed satin-twill varsity bomber jacket in ${c1} with striped knit collar and cuffs in ${c2}, custom crest embroidery, and polished silver snap placket, worn over a fitted skate tee in ${c2}. Paired with relaxed wide-leg double-knee cargo skate pants in ${neutral} with 3D flap pockets, silver D-rings, and heavy-duty double-prong belt. COLOR COORDINATION: Rich sheen from ${c1} satin balanced by ${c2} ribbing and rugged ${neutral} utility twill.`
  },
  {
    id: "m_kcasual_racer_zip_tearaway_pants",
    title: "Mock-Neck Performance Zip Top & Snap Tearaway Athletic Track Pants",
    outfitType: "top_and_bottom",
    gender: "male",
    topType: "windbreaker",
    bottomType: "track_pants",
    aesthetic: "High-Velocity Rehearsal Chic",
    buildDescription: (c1, c2, neutral) =>
      `a dynamic rehearsal stage look full of athletic movement. Featuring a sleek mock-neck performance half-zip athletic pullover in ${c1} with ergonomic contrast sleeve panels in ${c2}, exposed silver zipper with ring pull, and thumbhole cuffs. Paired with relaxed wide-leg athletic track pants in ${neutral} with full-length snap tearaway side seams, metallic silver snaps, and elasticated drawstring waistband. COLOR COORDINATION: Clean high-velocity color contrast between ${c1} pullover, ${c2} athletic inserts, and ${neutral} tearaway slacks.`
  },
  {
    id: "m_kcasual_draped_cardigan_wide_slacks",
    title: "Asymmetric Draped Knit Cardigan with Safety Pin & Fluid Split-Hem Slacks",
    outfitType: "top_and_bottom",
    gender: "male",
    topType: "cardigan",
    bottomType: "fluid_slacks",
    aesthetic: "Avant-Garde Idol Off-Duty",
    buildDescription: (c1, c2, neutral) =>
      `an avant-garde idol look featuring poetic, asymmetric knitwear and fluid tailoring. Featuring a lightweight draped fine-gauge wool cardigan in ${c1} with an asymmetric waterfall front closure fastened by an oversized polished silver safety pin, layered over a fitted scoop-neck modal tee in ${c2}. Paired with fluid wide-leg double-pleated trousers in ${neutral} with front pressed creases, side split hems, and clean leather belt. COLOR COORDINATION: Poetic tonal balance uniting ${c1} drape knit, ${c2} inner tee, and fluid ${neutral} tailoring.`
  }
];

// ============================================================================
// 3. FEMALE SALON-QUALITY HAIRSTYLES & DYE TECHNIQUES (Covering All 5 Lengths)
// ============================================================================
export const FEMALE_KPOP_HAIRSTYLES: KpopHairstyleItem[] = [
  // --- Ultra-Short Length ---
  {
    id: "f_short_pixie_crop_blonde",
    title: "Youthful Korean Bixie Cut with Air Bangs in Ash Blonde",
    gender: "female",
    hairCut: "Youthful Korean Bixie Cut with Airy See-Through Bangs",
    hairColor: "Soft Cool Ash Blonde with Dark Shadow Roots",
    lengthCategory: "ultra-short",
    prompt: "an ultra-short fresh, youthful Korean bixie haircut in soft cool ash blonde with delicate shadow roots, featuring soft face-framing feathery layers that contour the jawline, delicate see-through air bangs across the forehead, light airy crown texture, and tapered neck layers that give a youthful, energetic 18-22 year old idol look"
  },
  {
    id: "f_spiky_chic_pixie",
    title: "Spiky Chic Pixie Crop with Wispy Micro Fringe",
    gender: "female",
    hairCut: "Textured Pixie Crop with Tapered Sides",
    hairColor: "Jet Black with Gloss Sheen",
    lengthCategory: "ultra-short",
    prompt: "an ultra-short high-fashion textured pixie crop in obsidian jet black, featuring softly textured spiky piecey crown layers, a delicate brow-skimming micro fringe, clean tapered nape, and lightweight styling paste finish with natural gloss"
  },
  {
    id: "f_bleached_buzz_crop",
    title: "Bleached Platinum Micro Buzz Crop with Soft Temple Taper",
    gender: "female",
    hairCut: "Modern Micro Buzz Crop with Soft Hairline",
    hairColor: "Bleached Icy Platinum Blonde",
    lengthCategory: "ultra-short",
    prompt: "an ultra-short fashion-forward micro buzz crop in icy bleached platinum blonde, featuring a soft natural hairline, clean tapered neckline, subtle textured crown, and striking high-concept idol visual presence"
  },
  {
    id: "f_boyish_tapered_pixie",
    title: "Boyish Tapered Pixie Cut with Side-Swept Air Bangs",
    gender: "female",
    hairCut: "Boyish Tapered Pixie Cut",
    hairColor: "Rich Espresso Dark Brown",
    lengthCategory: "ultra-short",
    prompt: "an ultra-short chic boyish tapered pixie cut in rich espresso dark brown, styled with soft airy side-swept bangs that graze the upper cheekbone, feathered ear-framing wisps, and smooth tapered neck contour"
  },

  // --- Short Length (Bobs & Crops) ---
  {
    id: "f_espresso_french_bob",
    title: "Espresso Blunt French Bob with See-Through Bangs",
    gender: "female",
    hairCut: "Chin-Length Blunt Bob",
    hairColor: "Rich Espresso Dark Chocolate Brown",
    lengthCategory: "short",
    prompt: "a short chic chin-length blunt French bob in glossy rich espresso dark chocolate brown, styled with wispy airy Korean see-through bangs, razor-sharp clean ends with a slight inward tuck, high-shine glass hair finish, and clean modern silhouette"
  },
  {
    id: "f_midnight_blue_black_bob",
    title: "Midnight Blue-Black Asymmetric Bob",
    gender: "female",
    hairCut: "Asymmetric Chin-Length Bob",
    hairColor: "Midnight Blue-Black with Sapphire Reflect",
    lengthCategory: "short",
    prompt: "a short sleek asymmetric chin-length bob in deep midnight blue-black that reflects rich sapphire tones under the light, cut with a sharp angled baseline, side part tucked behind one ear, and high-gloss glass hair finish"
  },
  {
    id: "f_retro_layered_bob",
    title: "90s Layered Round Bob with Inward C-Bend",
    gender: "female",
    hairCut: "Chin-Length Layered Round Bob",
    hairColor: "Warm Chestnut Brown with Amber Tones",
    lengthCategory: "short",
    prompt: "a short 90s-inspired layered round bob in warm chestnut brown, cut just to the chin with soft inward-curving bouncy ends, curtain bangs parting at the bridge of the nose, and youthful voluminous blowout texture"
  },
  {
    id: "f_textured_micro_bob",
    title: "Choppy Ear-Length Micro Bob in Honey Blonde",
    gender: "female",
    hairCut: "Ear-to-Jawline Micro Bob with Piecey Texture",
    hairColor: "Warm Honey Blonde with Caramel Roots",
    lengthCategory: "short",
    prompt: "a short choppy ear-to-jawline micro bob in glowing warm honey blonde with subtle caramel root melt, styled with piecey undone waves, brow-grazing wispy fringe, and effortless casual cool texture"
  },

  // --- Medium Length (Lobs, Shags, Hush Cuts, Wolf Cuts) ---
  {
    id: "f_platinum_wolf_curtain",
    title: "Icy Platinum Wolf Cut with Feathered Curtain Bangs",
    gender: "female",
    hairCut: "Layered Wolf Cut with Curtain Bangs",
    hairColor: "Icy Platinum Blonde with Cool Silver Toner",
    lengthCategory: "medium",
    prompt: "a medium collarbone-length icy platinum white-blonde layered wolf cut with cool silver toner, featuring feathered face-framing curtain bangs that graze the cheekbones, textured piecey layers throughout the crown, soft neck-skimming tapered ends, and natural strand definition with healthy light sheen"
  },
  {
    id: "f_ash_silver_layered_shag",
    title: "Ash Silver Shoulder-Length Shag",
    gender: "female",
    hairCut: "Shoulder-Length Shag with Piecey Fringe",
    hairColor: "Smoky Ash Silver Grey with Charcoal Shadow Roots",
    lengthCategory: "medium",
    prompt: "a medium shoulder-length textured shag cut in smoky ash silver grey with cool charcoal shadow roots, featuring piecey micro-curtain bangs, choppy textured layers, effortless natural beach-wave bends, and soft matte texture"
  },
  {
    id: "f_peekaboo_black_lavender",
    title: "Two-Tone Jet Black with Pastel Lavender Peekaboo",
    gender: "female",
    hairCut: "Collarbone-Length Lob with Face Framing",
    hairColor: "Jet Black Outer Layer with Pastel Lilac Hidden Underlayer",
    lengthCategory: "medium",
    prompt: "a medium collarbone-length two-tone peekaboo hair transformation featuring a glossy jet-black outer layer with a hidden vibrant pastel lilac-lavender underlayer visible at the sides and neck, cut into a blunt lob with face-framing layers and soft natural texture"
  },
  {
    id: "f_ginger_copper_textured_lob",
    title: "Ginger Copper Textured Lob with Wispy Bangs",
    gender: "female",
    hairCut: "Textured Lob with Wispy Bangs",
    hairColor: "Vibrant Warm Ginger Copper",
    lengthCategory: "medium",
    prompt: "a medium collarbone-length textured lob in radiant warm ginger copper with golden apricot undertones, styled with wispy brow-skimming Korean air bangs, soft undone bends, piecey ends, and natural healthy gloss"
  },
  {
    id: "f_bouncy_c_curl_lob",
    title: "Korean C-Curl Lob in Rich Chestnut",
    gender: "female",
    hairCut: "Shoulder-Length Lob with Inward C-Curl Ends",
    hairColor: "Warm Chestnut Brown with Amber Sheen",
    lengthCategory: "medium",
    prompt: "a medium signature Korean idol shoulder-length lob in warm chestnut brown with amber highlights, styled with iconic inward-curved C-curl bouncy ends, airy curtain bangs framing the temples, and silky smooth finish"
  },
  {
    id: "f_dusty_lilac_wolf_cut",
    title: "Dusty Lilac Feathered Wolf Cut",
    gender: "female",
    hairCut: "Short-to-Medium Wolf Cut",
    hairColor: "Dusty Lilac Purple with Silver Haze",
    lengthCategory: "medium",
    prompt: "a medium collarbone-skimming feathered wolf cut in dusty lilac purple with a cool silver haze, featuring soft choppy layers that hug the jawline, airy piecey fringe, and effortless rock-chic texture"
  },
  {
    id: "f_korean_layered_hush_cut",
    title: "Youthful Korean Hush Cut with Wispy Air Bangs",
    gender: "female",
    hairCut: "Collarbone-Length Korean Hush Cut with Face-Framing Feathers",
    hairColor: "Soft Milk Tea Brown with Cool Undertones",
    lengthCategory: "medium",
    prompt: "a medium collarbone-length iconic youthful Korean hush cut in soft milk tea brown, featuring light, wispy feather layers softly framing the cheeks and jawline, delicate Korean see-through air bangs that soften the forehead, and effortless natural youthfulness"
  },

  // --- Long Length (Mid-Back, Ponytails, Blowouts) ---
  {
    id: "f_cherry_cola_butterfly",
    title: "Cherry Cola Red Butterfly Layers",
    gender: "female",
    hairCut: "Long Butterfly Layers with Airy Fringe",
    hairColor: "Deep Cherry Cola Burgundy Red",
    lengthCategory: "long",
    prompt: "a long cascading mid-back length butterfly layered cut in glossy deep cherry cola burgundy red with ruby undertones, styled with airy see-through Korean bangs, voluminous inward-curled face-framing layers, soft bouncy blowout movement, and silky liquid sheen"
  },
  {
    id: "f_high_sleek_ponytail",
    title: "Snatched High Ponytail in Espresso Brown",
    gender: "female",
    hairCut: "Sleek High Ponytail with Polished Hairline",
    hairColor: "Espresso Brown with Golden Highlights",
    lengthCategory: "long",
    prompt: "a long snatched high ponytail positioned at the crown in espresso dark brown with subtle golden babylights, styled with sleek flat-brushed sides, delicate sculpted baby hairs at the hairline, and an ultra-straight glossy tail cascading down the back"
  },
  {
    id: "f_half_up_ribbon_topknot",
    title: "Half-Up Ribbon Topknot with Soft Tendrils",
    gender: "female",
    hairCut: "Half-Up Styling with Romantic Face Tendrils",
    hairColor: "Soft Milk Tea Beige Brown",
    lengthCategory: "long",
    prompt: "a long romantic half-up ribbon topknot in soft milk tea beige brown, with loose romantic face-framing wavy tendrils, relaxed natural wave texture through the remaining mid-back length hair, and soft airy volume at the crown"
  },
  {
    id: "f_money_piece_brunette",
    title: "Y2K Face-Framing Baby-Blonde Tendrils on Mocha Base",
    gender: "female",
    hairCut: "Long Youthful Layers with Airy Face Tendrils",
    hairColor: "Dark Mocha Base with Bleached Baby-Blonde Face Framing",
    lengthCategory: "long",
    prompt: "a long trendy youthful comeback hair transformation featuring soft bleached baby-blonde face-framing streaks against a deep dark mocha base, cut with long fluid layers falling past the shoulder blades, wispy brow-skimming bangs, and natural energetic bounce"
  },
  {
    id: "f_space_buns_festival",
    title: "Twin Space Buns with Micro Accent Braids",
    gender: "female",
    hairCut: "Twin High Buns with Loose Lower Hair",
    hairColor: "Smoky Lavender Grey",
    lengthCategory: "long",
    prompt: "a long playful trendy twin high space buns look at the crown in smoky lavender grey, with delicate micro accent braids woven into the loose mid-back length hair below, and soft wavy face-framing wisps"
  },
  {
    id: "f_voluminous_butterfly_cut",
    title: "Youthful Butterfly Layers with Soft Curtain Fringe",
    gender: "female",
    hairCut: "Mid-Back Butterfly Layered Cut with Curtain Bangs",
    hairColor: "Golden Caramel Honey Brown",
    lengthCategory: "long",
    prompt: "a long youthful, bouncy butterfly layered cut falling to the mid-back in rich golden caramel honey brown, styled with soft curtain bangs parting gently to frame the cheekbones, light airy layers that move with natural bounce, and soft polished S-waves that flatter a fresh, young idol face"
  },

  // --- Extra-Long Length (Waist-Length, Hip-Length, Mermaid, Hime) ---
  {
    id: "f_honey_caramel_mermaid_waves",
    title: "Honey Caramel Balayage Mermaid Waves",
    gender: "female",
    hairCut: "Waist-Length Cascading Mermaid Waves",
    hairColor: "Warm Honey Caramel Balayage on Chestnut Base",
    lengthCategory: "extra-long",
    prompt: "an extra-long waist-length cascading mermaid wave look with a warm honey caramel dimensional balayage over rich chestnut roots, styled with a soft center part, face-framing tendrils, loose undulating S-waves reaching down to the waistline, and radiant sunlit glow"
  },
  {
    id: "f_jet_black_hime_cut",
    title: "Jet-Black Liquid Straight Modern Hime Cut",
    gender: "female",
    hairCut: "Modern Japanese Hime Cut with Clean Sidelocks",
    hairColor: "Jet Midnight Black with High-Gloss Sheen",
    lengthCategory: "extra-long",
    prompt: "an extra-long iconic modern K-pop Hime cut in ultra-glossy jet midnight black, featuring sharp cheekbone-length blunt sidelocks framing the face, waist-length liquid-straight glass hair falling down to the hips, and a blunt straight-across eyebrow fringe with mirror-like shine"
  },
  {
    id: "f_pastel_pink_fairy_waves",
    title: "Pastel Sakura Pink Fairy Waves",
    gender: "female",
    hairCut: "Waist-Length Soft Waves with Center Part",
    hairColor: "Soft Pastel Sakura Rose Pink",
    lengthCategory: "extra-long",
    prompt: "an extra-long ethereal waist-length soft wave look in dreamy pastel sakura rose pink with subtle peach metallic undertones, styled with a clean center part, flowing locks reaching the waistline, soft feather-light flyaways, and luminous dreamlike texture"
  },
  {
    id: "f_liquid_glass_long_straight",
    title: "Ultra-Long Liquid Glass Hair in Jet Black",
    gender: "female",
    hairCut: "Waist-Length Blunt Straight Cut",
    hairColor: "Jet Black with Mirror Shine",
    lengthCategory: "extra-long",
    prompt: "an extra-long flawless waist-length liquid straight hair look in obsidian jet black with mirror-like glass shine, perfectly smooth and flat-ironed reaching the waistline with a crisp clean center part and zero frizz"
  }
];

// ============================================================================
// 4. MALE SALON-QUALITY HAIRSTYLES & DYE TECHNIQUES (Covering All 5 Lengths)
// ============================================================================
export const MALE_KPOP_HAIRSTYLES: KpopHairstyleItem[] = [
  // --- Ultra-Short Length ---
  {
    id: "m_platinum_buzz_crop",
    title: "Textured Buzz Crop in Icy Platinum White",
    gender: "male",
    hairCut: "Textured Caesar Buzz Crop with Clean Skin Fade",
    hairColor: "Icy Platinum White Blonde",
    lengthCategory: "ultra-short",
    prompt: "an ultra-short high-fashion street buzz crop in icy platinum white blonde, featuring a sharp blunt micro fringe, textured crew length on top, and a clean low skin taper fade at the temples and neckline"
  },
  {
    id: "m_military_crew_fade",
    title: "Clean High-and-Tight Tapered Crew Fade in Jet Black",
    gender: "male",
    hairCut: "High-and-Tight Tapered Crew Cut",
    hairColor: "Jet Black with Natural Sheen",
    lengthCategory: "ultra-short",
    prompt: "an ultra-short masculine high-and-tight tapered crew fade in jet black, featuring a neat brushed-up textured top, sharp razor-clean temple borders, and clean skin fade at the nape that sharpens the jawline"
  },
  {
    id: "m_textured_caesar_crop",
    title: "Modern Textured Caesar Crop with Micro Fringe",
    gender: "male",
    hairCut: "Textured Caesar Crop with Low Taper",
    hairColor: "Cool Ash Brown with Smoky Reflect",
    lengthCategory: "ultra-short",
    prompt: "an ultra-short modern textured Caesar crop in cool ash brown, featuring a horizontal micro-fringe with subtle piecey separation, textured top layers, and a soft neat taper around the ears and neck"
  },

  // --- Short Length (Classic K-Pop Cuts, Two-Block, Comma, Drop Cut) ---
  {
    id: "m_classic_comma_charcoal",
    title: "Classic Korean Comma Hair in Midnight Charcoal",
    gender: "male",
    hairCut: "Classic 1/9 Split Comma Haircut",
    hairColor: "Midnight Charcoal Black with Subtle Blue Sheen",
    lengthCategory: "short",
    prompt: "a short iconic Korean comma haircut in glossy midnight charcoal black with subtle blue sheen, styled with a 1/9 side part where the front fringe curves inward in an elegant comma shape with airy root lift, tapered clean sides, and soft textured movement"
  },
  {
    id: "m_two_block_curtain_ash_blonde",
    title: "Two-Block Undercut with Ash Blonde Curtain Bangs",
    gender: "male",
    hairCut: "Modern Two-Block Undercut with Curtain Fringe",
    hairColor: "Cool Ash Blonde with Soft Dark Roots",
    lengthCategory: "short",
    prompt: "a short trendsetting two-block haircut in cool ash blonde with soft dark shadow roots, featuring a clean tapered undercut at the sides and back, with long textured curtain bangs parted at the center falling softly to cheekbones with natural airy wave"
  },
  {
    id: "m_clean_dandy_honey_brown",
    title: "Clean Tapered Dandy Cut in Honey Brown",
    gender: "male",
    hairCut: "Clean Dandy Cut with Soft Airy Layers",
    hairColor: "Warm Honey Caramel Brown",
    lengthCategory: "short",
    prompt: "a short handsome clean dandy cut in warm honey caramel brown, with soft airy downward fringe skimming the eyebrows, smooth rounded crown volume, neatly tapered temple contours, and healthy natural shine"
  },
  {
    id: "m_youthful_drop_cut_textured",
    title: "Youthful Korean Drop Cut with Textured Fringe",
    gender: "male",
    hairCut: "Korean Drop Cut with Forward-Falling Piecey Fringe",
    hairColor: "Dark Chocolate Brown with Mocha Sheen",
    lengthCategory: "short",
    prompt: "a short trendy youthful Korean drop cut in rich dark chocolate brown with mocha sheen, styled with a soft taper at the temples, textured forward-falling piecey fringe skimming the brows that flatters a young idol's face shape and jawline, with matte natural texture"
  },
  {
    id: "m_wet_look_side_sweep",
    title: "Wet-Look Textured Crop in Jet Black",
    gender: "male",
    hairCut: "Textured Short Crop with Side Sweep",
    hairColor: "Jet Black with High-Gloss Sheen",
    lengthCategory: "short",
    prompt: "a short sharp stage-ready wet-look textured crop in jet black, styled with high-shine pomade finish, side-swept textured pieces falling lightly over the forehead, clean tapered sides, and sleek defined strands"
  },
  {
    id: "m_midnight_blue_comma",
    title: "Deep Midnight Blue Comma Cut with Gloss Finish",
    gender: "male",
    hairCut: "Korean Comma Cut with High Root Lift",
    hairColor: "Deep Midnight Navy Blue with Indigo Sheen",
    lengthCategory: "short",
    prompt: "a short deep midnight navy blue comma haircut reflecting glossy indigo light, featuring a dramatic curved comma fringe over one eye, airy root volume, and clean polished temple tapers"
  },
  {
    id: "m_youthful_textured_two_block",
    title: "Youthful Textured Two-Block Crop with Wispy Bangs",
    gender: "male",
    hairCut: "Youthful Two-Block Crop with Brow-Grazing Wisps",
    hairColor: "Obsidian Black with Healthy Luminous Glow",
    lengthCategory: "short",
    prompt: "a short sharp, youthful two-block crop in obsidian black with healthy luminous shine, featuring clean tapered sides, layered texture on top, and wispy brow-grazing bangs that contour the cheekbones and flatter a youthful idol face"
  },

  // --- Medium Length (Ear & Neck-Length, Wolf Cuts, Mullets, Leaf Cuts) ---
  {
    id: "m_wolf_cut_mullet_mocha",
    title: "Rockstar Layered Wolf Mullet in Dark Mocha",
    gender: "male",
    hairCut: "Layered Wolf Cut Mullet with Feathered Nape",
    hairColor: "Dark Mocha Espresso Brown",
    lengthCategory: "medium",
    prompt: "a medium rockstar K-pop layered wolf cut mullet in rich dark mocha espresso brown, featuring choppy textured volume at the crown, piecey eyebrow-grazing fringe, feathered neck-skimming layers at the nape, and effortless messy texture"
  },
  {
    id: "m_textured_leaf_cut_ash_brown",
    title: "Textured Leaf Cut with Parted Curtain Bangs",
    gender: "male",
    hairCut: "Korean Leaf Cut with Curved Temple Bangs",
    hairColor: "Smoky Ash Brown",
    lengthCategory: "medium",
    prompt: "a medium neck-length sophisticated Korean leaf haircut in smoky ash brown, styled with a soft 5/5 center part where the long bangs curve outward like leaves framing the temples and cheekbones, with subtle natural wave and soft feathered texture"
  },
  {
    id: "m_shaggy_bob_center_part",
    title: "Chin-Length Shaggy Bob in Deep Chestnut",
    gender: "male",
    hairCut: "Chin-Length Layered Shaggy Bob",
    hairColor: "Deep Chestnut Brown with Amber Undertones",
    lengthCategory: "medium",
    prompt: "a medium chin-length artistic shaggy bob in deep chestnut brown with warm amber undertones, styled with a natural center part, soft undone S-waves tucked effortlessly behind one ear, and relaxed textured ends"
  },
  {
    id: "m_curly_perm_mop",
    title: "Bouncy Shadow-Perm Textured Crop in Caramel",
    gender: "male",
    hairCut: "Korean Shadow Perm with Bouncy Volume",
    hairColor: "Warm Caramel Toffee Brown",
    lengthCategory: "medium",
    prompt: "a medium ear-length youthful Korean shadow perm in warm caramel toffee brown, featuring bouncy defined wave-curls throughout the crown, full textured curly fringe resting above the eyes, and neatly tapered temple fades"
  },
  {
    id: "m_ear_length_curtain_wave",
    title: "Ear-Length Soft Wave Curtain Cut in Milk Tea Brown",
    gender: "male",
    hairCut: "Ear-Length Curtain Cut with Soft Natural Wave",
    hairColor: "Soft Milk Tea Brown with Cool Undertones",
    lengthCategory: "medium",
    prompt: "a medium ear-length soft curtain haircut in milk tea brown, featuring a clean center part with gentle S-curl waves that curve around the ears and temples, with soft airy root lift and touchable natural texture"
  },
  {
    id: "m_cherry_red_textured_mullet",
    title: "Vibrant Cherry Crimson Layered Mullet",
    gender: "male",
    hairCut: "Modern Textured Mullet with Micro Fringe",
    hairColor: "Vibrant Cherry Crimson Red",
    lengthCategory: "medium",
    prompt: "a medium high-impact comeback hair transformation in vibrant cherry crimson red, styled into a modern textured mullet with textured piecey crown volume, micro fringe, and soft feathered layers grazing the collarbone"
  },
  {
    id: "m_ginger_copper_wolf_cut",
    title: "Ginger Copper Tousled Wolf Cut",
    gender: "male",
    hairCut: "Tousled Wolf Cut with Textured Layers",
    hairColor: "Warm Ginger Copper with Apricot Glow",
    lengthCategory: "medium",
    prompt: "a medium tousled layered wolf cut in rich warm ginger copper with golden apricot glow, featuring choppy piecey bangs framing the brow, natural wavy movement, and soft neck-skimming layers"
  },
  {
    id: "m_pastel_lilac_crop",
    title: "Pastel Lavender-Lilac Textured Medium Crop",
    gender: "male",
    hairCut: "Modern Textured Crop with Airy Fringe",
    hairColor: "Pastel Lavender-Lilac with Silver Sheen",
    lengthCategory: "medium",
    prompt: "a medium collarbone-grazing ethereal comeback idol look in pastel lavender-lilac with cool silver sheen, styled in a textured wolf shag with soft downward fringe, piecey strand separation, and feathered neckline"
  },

  // --- Long Length (Shoulder-Length, Half-Up Samurai Bun) ---
  {
    id: "m_shoulder_rockstar_waves",
    title: "Shoulder-Length Grunge Waves in Smoky Silver",
    gender: "male",
    hairCut: "Shoulder-Length Layered Rockstar Cut",
    hairColor: "Smoky Silver Grey with Charcoal Roots",
    lengthCategory: "long",
    prompt: "a long shoulder-length layered grunge wave haircut in smoky silver grey with charcoal shadow roots, featuring effortless tousled texture falling past the collarbones, piecey face-framing strands, and rockstar idol presence"
  },
  {
    id: "m_half_up_man_bun",
    title: "Half-Up Samurai Bun with Face-Framing Tendrils",
    gender: "male",
    hairCut: "Half-Up Topknot with Shoulder-Length Layers",
    hairColor: "Espresso Brown with Bronze Highlights",
    lengthCategory: "long",
    prompt: "a long stylish half-up man bun gathered at the high crown in espresso brown with subtle bronze highlights, with loose textured face-framing pieces falling naturally at the cheekbones and shoulder-length hair resting smoothly below"
  },
  {
    id: "m_collarbone_rockstar_shag",
    title: "Collarbone-Length Rockstar Shag in Jet Black",
    gender: "male",
    hairCut: "Collarbone-Length Shag with Curtain Part",
    hairColor: "Glossy Jet Black",
    lengthCategory: "long",
    prompt: "a long collarbone-length layered rockstar shag in glossy jet black, featuring a subtle middle part, feathery face-framing layers that curve along the jawline down to the collarbones, and natural effortless wave"
  },
  {
    id: "m_asymmetric_undercut_sweep",
    title: "Brushed-Back Disconnected Undercut with Long Flowing Top",
    gender: "male",
    hairCut: "Disconnected Undercut with Long Flowing Top",
    hairColor: "Platinum Blonde with Dark Underlayer",
    lengthCategory: "long",
    prompt: "a long striking disconnected undercut with platinum blonde long locks on top swept back with natural airy volume, cascading past the shoulders when loose, contrasting with a short dark cropped fade beneath at the temples"
  },

  // --- Extra-Long Length (Flowing Mid-Back, Samurai Tail) ---
  {
    id: "m_flowing_mid_back_waves",
    title: "Flowing Mid-Back Layered Waves in Dark Espresso",
    gender: "male",
    hairCut: "Mid-Back Layered Rock Waves",
    hairColor: "Natural Dark Espresso Brown",
    lengthCategory: "extra-long",
    prompt: "an extra-long flowing mid-back layered wave haircut in natural dark espresso brown, with healthy natural shine, soft dimensional layers that cascade down the back past the shoulder blades, and romantic parted front tendrils"
  },
  {
    id: "m_waist_length_samurai_tail",
    title: "Sleek High Samurai Ponytail in Obsidian Black",
    gender: "male",
    hairCut: "High Samurai Ponytail with Undercut Taper",
    hairColor: "Obsidian Black with Glass Finish",
    lengthCategory: "extra-long",
    prompt: "an extra-long dramatic sleek high samurai ponytail in obsidian black with glass finish, gathered tightly at the crown with long straight hair falling past the mid-back, clean shaved undercut at the sides, and powerful visual presence"
  },
  {
    id: "m_chest_length_textured_waves",
    title: "Chest-Length Textured Beach Waves in Golden Ash",
    gender: "male",
    hairCut: "Chest-Length Layered Cut with Center Part",
    hairColor: "Smoky Golden Ash Brown",
    lengthCategory: "extra-long",
    prompt: "an extra-long chest-length layered haircut in smoky golden ash brown with natural sunlit highlights, styled with an effortless center part, loose beach-wave bends falling past the chest, and touchable natural movement"
  },
  {
    id: "m_two_tone_peekaboo_silver",
    title: "Two-Tone Jet Black with Silver Platinum Long Underlayer",
    gender: "male",
    hairCut: "Extra-Long Layered Cut with Hidden Underdye",
    hairColor: "Jet Black Top with Silver-Platinum Underlayer",
    lengthCategory: "extra-long",
    prompt: "an extra-long cutting-edge two-tone hair concept featuring glossy jet-black hair on top styled with parted curtain fringe, cascading down past the chest to reveal a bright silver-platinum bleached underlayer"
  }
];

// ============================================================================
// 5. SELECTION ENGINES (Guaranteed Non-Repeating, High Quality)
// ============================================================================

/**
 * Extracts normalized garment top and bottom categories from an outfit title or description.
 * Ensures accurate detection across all K-fashion styling types.
 */
export function extractGarmentCategories(title: string = '', description: string = ''): { topType: string; bottomType: string } {
  const combined = (title + ' ' + description).toLowerCase();

  // 1. Detect Top Category
  let topType = 'statement_top';
  if (combined.includes('blazer') || combined.includes('suit jacket')) topType = 'blazer';
  else if (combined.includes('trench')) topType = 'trench_blouson';
  else if (combined.includes('waistcoat') || combined.includes('suiting vest')) topType = 'waistcoat';
  else if (combined.includes('bomber') || combined.includes('varsity')) topType = 'bomber';
  else if (combined.includes('moto') || combined.includes('biker') || combined.includes('racing jacket') || combined.includes('motorsport')) topType = 'moto_jacket';
  else if (combined.includes('trucker') || combined.includes('denim jacket')) topType = 'denim_trucker';
  else if (combined.includes('hoodie') || combined.includes('hooded')) topType = 'hoodie';
  else if (combined.includes('cardigan') || combined.includes('mohair')) topType = 'cardigan';
  else if (combined.includes('sweatshirt') || combined.includes('crewneck')) topType = 'sweatshirt';
  else if (combined.includes('poplin') || combined.includes('button-down') || combined.includes('oxford')) topType = 'poplin_shirt';
  else if (combined.includes('bowling shirt') || combined.includes('camp-collar') || combined.includes('overshirt') || combined.includes('flannel')) topType = 'overshirt';
  else if (combined.includes('rugby') || combined.includes('polo')) topType = 'polo';
  else if (combined.includes('windbreaker') || combined.includes('track jacket') || combined.includes('racer zip') || combined.includes('performance zip')) topType = 'windbreaker';
  else if (combined.includes('jersey') || combined.includes('hockey')) topType = 'jersey';
  else if (combined.includes('waffle') || combined.includes('henley') || combined.includes('pullover')) topType = 'waffle_top';
  else if (combined.includes('baby tee') || combined.includes('skate tee') || combined.includes('t-shirt') || combined.includes('tee')) topType = 't_shirt';
  else if (combined.includes('corset') || combined.includes('bustier') || combined.includes('tank') || combined.includes('camisole')) topType = 'tank_corset';
  else if (combined.includes('cutout') || combined.includes('asymmetric top') || combined.includes('wrap top')) topType = 'cutout_top';
  else if (combined.includes('romper') || combined.includes('onesie') || combined.includes('jumpsuit')) topType = 'onesie';
  else if (combined.includes('vest') || combined.includes('cable vest')) topType = 'knit_vest';

  // 2. Detect Bottom Category
  let bottomType = 'tailored_bottom';
  if (combined.includes('skort') || combined.includes('pleated skort') || combined.includes('mini-skort') || combined.includes('tennis skort')) bottomType = 'pleated_skort';
  else if (combined.includes('wrap kilt') || combined.includes('wrap skort') || combined.includes('wrap skirt') || combined.includes('kilt')) bottomType = 'wrap_skirt';
  else if (combined.includes('denim skirt') || combined.includes('denim mini')) bottomType = 'denim_skirt';
  else if (combined.includes('puddle denim') || combined.includes('puddle jeans') || combined.includes('skater denim') || combined.includes('skater jeans') || combined.includes('baggy denim') || combined.includes('washed denim')) bottomType = 'puddle_denim';
  else if (combined.includes('cargo') || combined.includes('utility pants')) bottomType = 'cargo_pants';
  else if (combined.includes('carpenter') || combined.includes('hammer loop')) bottomType = 'carpenter_pants';
  else if (combined.includes('fluid slacks') || combined.includes('fluid trousers') || combined.includes('pleated trousers') || combined.includes('suiting trousers') || combined.includes('dress slacks') || combined.includes('tailored trousers')) bottomType = 'fluid_slacks';
  else if (combined.includes('bermuda') || combined.includes('tailored shorts')) bottomType = 'bermuda_shorts';
  else if (combined.includes('jorts') || combined.includes('denim shorts')) bottomType = 'denim_jorts';
  else if (combined.includes('parachute') || combined.includes('track pants') || combined.includes('tearaway') || combined.includes('sweatpants')) bottomType = 'track_pants';
  else if (combined.includes('pintuck')) bottomType = 'pintuck_trousers';
  else if (combined.includes('corduroy')) bottomType = 'corduroy_slacks';
  else if (combined.includes('chino')) bottomType = 'chinos';
  else if (combined.includes('flared') || combined.includes('flare')) bottomType = 'flared_slacks';
  else if (combined.includes('foldover')) bottomType = 'foldover_trousers';
  else if (combined.includes('romper') || combined.includes('onesie') || combined.includes('jumpsuit')) bottomType = 'onesie';

  return { topType, bottomType };
}

/**
 * Returns a brand-new, non-repeating put-together K-pop outfit coordinate.
 * STRICT ANTI-REPETITION GUARANTEE: Excludes recent indices and actively verifies
 * that neither the top type nor the bottom type matches any excluded garments in the group!
 */
export function getFreshPutTogetherOutfit(
  genderStr: 'female' | 'male' | string,
  excludeIndices: number[] = [],
  groupColors: { name: string; hex?: string }[] = [],
  excludeTopTypes: string[] = [],
  excludeBottomTypes: string[] = []
): { 
  index: number; 
  title: string; 
  prompt: string; 
  outfitType?: string; 
  aesthetic?: string;
  topType: string;
  bottomType: string;
} {
  const isFemale = genderStr.toLowerCase() === 'female';
  const pool = isFemale ? FEMALE_PUT_TOGETHER_OUTFITS : MALE_PUT_TOGETHER_OUTFITS;

  // Extract clean colors from group official palette or default to sensible everyday tones
  let primaryColor = "classic deep navy blue";
  let secondaryColor = "clean crisp white";
  let neutralColor = "washed vintage denim blue";

  if (groupColors && groupColors.length > 0) {
    const cleanColors = groupColors.map(c => {
      let cleanName = (c.name || '').replace(/\([^)]*\)/g, '').replace(/\[[^\]]*\]/g, '').trim();
      const hexPart = c.hex && c.hex.startsWith('#') ? ` (${c.hex})` : '';
      return (cleanName || 'Official Tone') + hexPart;
    });
    if (cleanColors[0]) primaryColor = cleanColors[0];
    if (cleanColors[1]) secondaryColor = cleanColors[1];
    else secondaryColor = "clean crisp white";
    if (cleanColors[2]) neutralColor = cleanColors[2];
    else neutralColor = "washed casual denim";
  }

  const normalizedExcludeTops = excludeTopTypes.map(t => t.toLowerCase().trim()).filter(Boolean);
  const normalizedExcludeBottoms = excludeBottomTypes.map(b => b.toLowerCase().trim()).filter(Boolean);

  // Categorize candidate outfits into tiers:
  // Tier 1: Not in excludeIndices, top NOT in excludeTopTypes, bottom NOT in excludeBottomTypes
  const tier1: number[] = [];
  // Tier 2: Top NOT in excludeTopTypes, bottom NOT in excludeBottomTypes (relaxing index restriction)
  const tier2: number[] = [];
  // Tier 3: Bottom NOT in excludeBottomTypes (since users find repeating bottoms most noticeable)
  const tier3: number[] = [];
  // Tier 4: Top NOT in excludeTopTypes
  const tier4: number[] = [];
  // Tier 5: Not in excludeIndices
  const tier5: number[] = [];

  for (let i = 0; i < pool.length; i++) {
    const item = pool[i];
    const top = (item.topType || '').toLowerCase();
    const bottom = (item.bottomType || '').toLowerCase();
    const isIndexExcluded = excludeIndices.includes(i);
    const isTopExcluded = normalizedExcludeTops.includes(top);
    const isBottomExcluded = normalizedExcludeBottoms.includes(bottom);

    if (!isIndexExcluded && !isTopExcluded && !isBottomExcluded) {
      tier1.push(i);
    }
    if (!isTopExcluded && !isBottomExcluded) {
      tier2.push(i);
    }
    if (!isBottomExcluded && !isIndexExcluded) {
      tier3.push(i);
    }
    if (!isTopExcluded && !isIndexExcluded) {
      tier4.push(i);
    }
    if (!isIndexExcluded) {
      tier5.push(i);
    }
  }

  let candidateIndices: number[] = [];
  if (tier1.length > 0) {
    candidateIndices = tier1;
  } else if (tier2.length > 0) {
    candidateIndices = tier2;
  } else if (tier3.length > 0) {
    candidateIndices = tier3;
  } else if (tier4.length > 0) {
    candidateIndices = tier4;
  } else if (tier5.length > 0) {
    candidateIndices = tier5;
  } else {
    // If entire pool exhausted, take any item not recently used
    const lastFew = excludeIndices.slice(-3);
    candidateIndices = pool.map((_, i) => i).filter(i => !lastFew.includes(i));
    if (candidateIndices.length === 0) candidateIndices = pool.map((_, i) => i);
  }

  // Randomly pick an index from candidate pool
  const chosenIndex = candidateIndices[Math.floor(Math.random() * candidateIndices.length)];
  const item = pool[chosenIndex];

  let fullPrompt = item.buildDescription(primaryColor, secondaryColor, neutralColor);
  fullPrompt += ` ELEVATED KOREAN CASUAL FASHION DIRECTIVE (YOUTHFUL 18-21 IDOL PERSONA & DESIGNED GARMENTS):
- STRICT AGE REFLECTION (GEN-Z 18-21 ROOKIE IDOL): The outfit MUST reflect the idol's youthful age (18-21 years old). It must look like authentic, trendsetting K-fashion worn by a young 4th/5th generation rookie idol—high-teen street style, airport cool, dance practice chic, and Hongdae youth culture.
- UNIQUE INDIVIDUAL SILHOUETTE (ABSOLUTE ANTI-UNIFORM RULE): Member wears a distinct ${item.topType} top and ${item.bottomType} bottom. No other member in the group shares this top or bottom silhouette!
- REDESIGNED ADULT & TAILORED FASHION (AVANT-GARDE YOUTHFUL IDOL REDESIGN): Adult garments (blazers, trench coats, tailored suiting, poplin button-downs, waistcoats, trousers, wool outerwear) ARE WELCOME, but they MUST be creatively REDESIGNED and deconstructed to match the youthful energy of an 18-21 year old K-pop idol! Re-engineer them with cropped boxy cuts, raw-edge deconstruction, asymmetric lapels, cutout shoulders, split hems, and pair them with high-teen pleated skorts, wide fluid puddle trousers, or layered streetwear elements. NEVER render them as stiff, boring, 9-to-5 corporate office wear.
- INTRICATE CLOTHING DESIGN DETAILS (NEVER A BARE CLOTHING OUTFIT): Do NOT give them bare, plain, flat fabric clothes! The clothing itself MUST have rich, visible garment design details:
  * HARDWARE & METALWORK: Polished silver or gunmetal shank buttons, exposed two-way chunky industrial zippers with ring pulls, silver D-rings, buckle cinch tabs, safety-pin hardware clusters, metal eyelets with lace-up ties, delicate silver chain swags draping across lapels or belt loops, double-grommet belts.
  * STRUCTURAL CONSTRUCTION & TAILORING DETAILS: Contrast micro-overlock stitching, exposed structural seams, architectural knife-pleats, asymmetric button plackets, split cuffs with silver snap buttons, trompe-l'œil double waistbands, 3D flap utility pockets with silver rings, ruched drawstring channels with metallic cord toggles, thumbhole cuffs, layered faux double collars.
  * SURFACE & TEXTURAL COMPLEXITY: Tonal pinstripes, subtle houndstooth suiting wool, contrast satin or leather piping along edges, waffle-knit textures, brushed open-knit mohair, color-blocked panels, and collegiate tipping.
- NEVER BASIC OR BORING: Even though this is casual everyday attire, it is NEVER plain, boring, or generic. It reflects authentic modern Korean casual fashion (K-Fashion as seen in Seoul idol airport fashion, Seongsu-dong street style, and dance-practice chic). The idol wearing it has an unmistakable aesthetic persona, presence, and effortless cool factor.
- SILHOUETTE & PROPORTIONAL MASTERY: Flattering contemporary proportions (e.g. cropped boxy jackets, wide-leg baggy skater puddle denim, pleated skorts, oversized textured drop-shoulder knits with crisp collars or inner hems peeking out, intentional French tucks, clean waistbands with polished silver-buckle belts).
- GROUP BRAND HARMONY: Impeccably color-matched around the group palette (${primaryColor} as the hero tone, complemented by ${secondaryColor}, and anchored by ${neutralColor}) with zero clashing shades.
- ABSOLUTELY NO TECHWEAR: Strictly NO military techwear, NO tactical utility vests, NO combat straps, NO harness rigs, NO chest pouches.
- IN THE MEDIUM UPPER-BODY SHOT: Both the stylish top piece AND the visible waistband/belt/top of the bottoms (or continuous onesie/jumpsuit) must be clearly visible and color-coordinated.`;

  return {
    index: chosenIndex,
    title: item.title,
    prompt: fullPrompt,
    outfitType: item.outfitType || 'top_and_bottom',
    aesthetic: item.aesthetic || 'Elevated Korean Casual',
    topType: item.topType,
    bottomType: item.bottomType
  };
}

/**
 * Detects the length category of a hairstyle from its title, haircut description, or prompt.
 */
export function detectHairLengthCategory(text?: string): HairLengthCategory {
  if (!text || typeof text !== 'string') return 'medium';
  const lower = text.toLowerCase();
  if (lower.includes('extra-long') || lower.includes('waist') || lower.includes('hip') || lower.includes('mermaid') || lower.includes('hime')) {
    return 'extra-long';
  }
  if (lower.includes('ultra-short') || lower.includes('buzz') || lower.includes('pixie') || lower.includes('bixie') || lower.includes('crew') || lower.includes('caesar')) {
    return 'ultra-short';
  }
  if (lower.includes('short') || lower.includes('bob') || lower.includes('comma') || lower.includes('two-block') || lower.includes('dandy') || lower.includes('drop cut')) {
    return 'short';
  }
  if (lower.includes('extra-long') || lower.includes('long') || lower.includes('mid-back') || lower.includes('ponytail') || lower.includes('cascading')) {
    return 'long';
  }
  if (lower.includes('medium') || lower.includes('collarbone') || lower.includes('shoulder') || lower.includes('lob') || lower.includes('wolf') || lower.includes('mullet') || lower.includes('shag') || lower.includes('leaf')) {
    return 'medium';
  }
  return 'medium';
}

/**
 * Generates a completely new, unique, and fresh facial feature specification
 * ensuring every regenerated photo is a completely new idol with distinct
 * eye shape, nose bridge, lips, jawline, and charming individual features.
 */
export function generateCompletelyNewFacialFeatures(genderStr?: string): {
  description: string;
  eyeType: string;
  noseType: string;
  lipType: string;
  faceShape: string;
  distinctiveFeature: string;
} {
  const isFemale = (genderStr || '').toLowerCase() === 'female';

  const femaleEyeTypes = [
    "sparkling almond-shaped doe eyes with delicate natural aegyo-sal and soft double eyelids",
    "captivating feline-like sleek eyes with a subtle youthful upward sweep at the outer corners",
    "soft round puppy-dog idol eyes with bright luminous dark irises and clear open gaze",
    "delicate hooded monolid-adjacent eyes with deep expressive gaze and subtle inner corner definition",
    "dreamy phoenix-shaped idol eyes with bright clean whites and delicate fluttering lashlines"
  ];

  const maleEyeTypes = [
    "sharp charismatic mono-eyelid gaze with clean defined lash lines and intense youthful focus",
    "gentle warm puppy eyes with subtle soft double eyelids and sparkling dark brown irises",
    "magnetic almond-shaped idol eyes with softly contoured outer corners and striking visual presence",
    "captivating deep-set expressive eyes with clean youthful eyelids and bright luminous reflection",
    "cool charismatic feline-tilted eyes with clean straight brow lines and sharp visual focus"
  ];

  const femaleFaceShapes = [
    "delicate youthful V-line jaw with a soft tapered chin and natural cheek fullness",
    "soft heart-shaped facial contour with youthful cheek apple volume and smooth jaw angles",
    "refined oval idol face structure with smooth seamless cheek-to-jaw transitions",
    "youthful baby-face contours with gentle cheek volume and a delicate petite chin"
  ];

  const maleFaceShapes = [
    "clean sculpted idol jawline with youthful smooth mandibular angles and neat chin definition",
    "soft V-shaped face structure with smooth youthful cheek fullness and modern proportions",
    "refined oval facial shape with balanced masculine idol proportions and smooth contours",
    "youthful structured bone shape with clean jaw contour and soft cheek elasticity"
  ];

  const noseTypes = [
    "delicate straight nose bridge with a neat, softly defined youthful tip",
    "subtle slender button nose with smooth natural bridge and dainty tip",
    "clean architectural straight idol nose with balanced bridge and refined profile",
    "gentle sloping nose with natural contour and soft youthful tip"
  ];

  const lipTypes = [
    "youthful cherry-blossom cupid's bow lips with natural plush fullness and soft rosy tint",
    "soft plump pouty idol lips with defined philtrum and healthy hydrated finish",
    "delicate petal-shaped lips with subtle natural upturned corners that suggest a gentle resting smile",
    "clean defined lips with balanced fullness on upper and lower cushions and smooth natural texture"
  ];

  const distinctiveFeatures = [
    "a charming tiny beauty mark delicately placed just beneath the lower left eyelash",
    "a subtle natural beauty mark sitting on the right upper cheekbone",
    "a faint, endearing beauty mark on the tip of the nose",
    "soft natural cheek dimples that create gentle youthful indentation",
    "youthful luminous glass-skin glow with healthy natural flush on the apples of the cheeks",
    "a faint delicate beauty mark near the outer corner of the lip"
  ];

  const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  const eye = isFemale ? pick(femaleEyeTypes) : pick(maleEyeTypes);
  const face = isFemale ? pick(femaleFaceShapes) : pick(maleFaceShapes);
  const nose = pick(noseTypes);
  const lips = pick(lipTypes);
  const charm = pick(distinctiveFeatures);

  const description = `completely brand new idol face featuring ${eye}, ${nose}, ${lips}, framed by ${face}, with ${charm}, completely smooth youthful bare skin, and energetic 18-21 year old idol freshness`;

  return {
    description,
    eyeType: eye,
    noseType: nose,
    lipType: lips,
    faceShape: face,
    distinctiveFeature: charm
  };
}

/**
 * Returns a brand-new, non-repeating K-pop idol haircut & dye transformation.
 * Excludes recent indices to prevent repetition, and can actively avoid the previous hair length
 * to guarantee diverse lengths (ultra-short, short, medium, long, extra-long) across idols and regenerations.
 */
export function getFreshKpopHairstyle(
  genderStr: 'female' | 'male' | string,
  excludeIndices: number[] = [],
  preferredLength?: HairLengthCategory,
  excludeLength?: HairLengthCategory | string
): { 
  index: number; 
  title: string; 
  prompt: string; 
  hairStyle: string; 
  hairColor: string;
  lengthCategory: HairLengthCategory;
} {
  const isFemale = genderStr.toLowerCase() === 'female';
  const pool = isFemale ? FEMALE_KPOP_HAIRSTYLES : MALE_KPOP_HAIRSTYLES;

  // Filter pool based on excludeLength or preferredLength if specified
  let filteredIndices = pool.map((_, i) => i);
  
  if (excludeLength) {
    const withoutExclude = filteredIndices.filter(i => pool[i].lengthCategory !== excludeLength);
    if (withoutExclude.length > 0) {
      filteredIndices = withoutExclude;
    }
  }

  if (preferredLength) {
    const withPreferred = filteredIndices.filter(i => pool[i].lengthCategory === preferredLength);
    if (withPreferred.length > 0) {
      filteredIndices = withPreferred;
    }
  }

  // Filter out recent excludeIndices
  const validIndices = filteredIndices.filter(i => !excludeIndices.includes(i));

  let candidateIndices = validIndices;
  if (candidateIndices.length === 0) {
    // If all valid were used, reset to filtered indices without the most recent few
    const lastFew = excludeIndices.slice(-3);
    candidateIndices = filteredIndices.filter(i => !lastFew.includes(i));
    if (candidateIndices.length === 0) candidateIndices = filteredIndices;
  }

  const chosenIndex = candidateIndices[Math.floor(Math.random() * candidateIndices.length)];
  const item = pool[chosenIndex];

  let hairPrompt = item.prompt;
  hairPrompt += `. YOUTHFUL IDOL HAIRSTYLE & FACE-MATCHING: This haircut and style is distinctly youthful, fresh, and specifically shaped to match and flatter a young 18-24 year old idol's facial structure, jawline, and cheekbones. Soft natural texture, healthy hair vitality, and modern salon styling. ABSOLUTELY NO aging haircuts, NO dated middle-aged cuts, NO stiff grandma perms, NO matronly bobs, NO thinning or receding hair, and NO old person or uncle hairstyles.`;

  return {
    index: chosenIndex,
    title: item.title,
    prompt: hairPrompt,
    hairStyle: item.hairCut,
    hairColor: item.hairColor,
    lengthCategory: item.lengthCategory
  };
}

/**
 * Sanitizes facial feature descriptions to purge any age-inducing or maturing phrases
 * (such as smile lines, laugh lines, nasolabial folds, hollow cheeks, mature bone structure)
 * and guarantees smooth, youthful, fresh-faced idol facial fullness.
 */
export function sanitizeFacialFeaturesForYouth(features?: string): string {
  if (!features || typeof features !== 'string') {
    return "youthful clear skin with soft natural cheek volume, bright expressive idol eyes, and delicate youthful facial contours";
  }

  let cleaned = features
    .replace(/\b(smile|laugh)\s+lines\b/gi, "youthful radiant smile")
    .replace(/\bnasolabial\s*(folds?|creases?|lines?)?\b/gi, "smooth youthful cheeks")
    .replace(/\b(mature|aged|weathered|tired|hollow|sunken)\b/gi, "youthful")
    .replace(/\bwrinkles?|crow'?s?\s*feet|creases?\b/gi, "smooth skin")
    .replace(/\bprominent bone structure\b/gi, "delicate youthful facial contours")
    .replace(/\bprominent facial contours\b/gi, "smooth youthful facial contours")
    .replace(/\bdeep-set\b/gi, "expressive bright")
    .replace(/\bhollow cheeks?\b/gi, "soft youthful cheeks")
    .replace(/\bheavy (brow|jaw|lids?)\b/gi, "clean youthful $1")
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned.toLowerCase().includes("youthful") && !cleaned.toLowerCase().includes("fresh")) {
    cleaned += ", with natural youthful facial fullness and smooth skin";
  }

  return cleaned;
}

/**
 * Universal Youthful K-Pop Idol Directive for ALL Nationalities & Ethnicities.
 * Explicitly counteracts diffusion model bias where non-Korean members are depicted
 * older/more mature than Korean members.
 */
export function getYouthfulIdolAestheticDirective(
  raceOrEthnicity: string = 'idol',
  nationalityOrPlace: string = ''
): string {
  const demoLabel = nationalityOrPlace
    ? `${raceOrEthnicity} (originating from ${nationalityOrPlace})`
    : raceOrEthnicity;

  return `UNIVERSAL YOUTHFUL IDOL STANDARD (ALL NATIONALITIES & ETHNICITIES EQUAL IN YOUTHFULNESS):
- The idol (${demoLabel}) MUST look undeniably young, youthful, and fresh-faced (strictly 18-21 years old)—radiating the exact same youthful rookie idol vitality, collagen-rich smooth facial fullness, and fresh charm as any young Korean K-pop idol.
- EQUAL YOUTH BIAS COUNTERMEASURE: Non-Korean idols and idols from other nationalities MUST NOT be rendered older, mature, weathered, or adult-looking. They MUST possess natural youthful facial volume, plump smooth cheeks, soft youthful jawline, bright alert eyes with youthful vitality, and smooth radiant unblemished skin.
- STRICT ANTI-AGING DIRECTIVES FOR ALL ETHNICITIES: ZERO wrinkles, ZERO fine lines, ZERO smile lines, ZERO laugh lines, ZERO nasolabial creases, ZERO dark eye circles or eye bags, ZERO hollow cheeks or sunken areas, ZERO gauntness, and ZERO weathered, rugged, or mature features.
- Fresh 4th/5th generation young K-pop idol at debut, at the peak of their youth with natural youthful vitality.
- YOUTHFUL & REDESIGNED FASHION (STRICTLY 18-21 YEARS OLD ROOKIE IDOL): Their outfit MUST reflect their youthful 18-21 idol energy. Adult or tailored pieces (blazers, trench coats, button-downs, waistcoats, slacks, coats) ARE WELCOME, but they MUST be creatively REDESIGNED and deconstructed with youthful K-pop flair (cropped boxy cuts, raw-edge hems, asymmetric lapels, cutout details, silver hardware, layered styling). NEVER render them as stiff, boring, or corporate 9-to-5 adult office clothes.
- RICH CLOTHING DESIGN DETAILS (NEVER A BARE CLOTHING OUTFIT): The garments must NEVER be plain or bare. They must have visible, intricate clothing design details built into the garments: polished silver shank buttons, exposed two-way zippers with ring pulls, silver D-rings, grommets, chain drapes, safety-pin hardware links, contrast overlock seams, architectural pleats, split cuffs, and trompe-l'œil double waistbands.`;
}

/**
 * Generates an amazing, luxury/designer K-pop footwear directive for full-body portraits.
 * Guarantees that the idol's shoes look extraordinary, pristine, modern, and perfectly
 * matched in style, color palette, and proportion to their outfit.
 */
export function getAmazingMatchingShoesDirective(
  genderStr: string = 'female',
  outfitDescription: string = '',
  groupColors: OfficialColor[] = []
): {
  prompt: string;
  shoesDescription: string;
} {
  const isFemale = (genderStr || '').toLowerCase() === 'female';

  const femaleShoeStyles = [
    "sculptural designer platform leather derbies with polished box-calf finish, clean tonal welt stitching, and chunky architectural lug soles",
    "crisp luxury low-top platform sneakers in supple ivory calfskin with soft suede mudguards, polished eyelets, and chunky cream rubber soles",
    "sleek modern Chelsea platform ankle boots in semi-gloss black leather with elastic side gores and refined architectural treaded soles",
    "contemporary chunky platform Mary Janes in polished smooth leather with delicate silver buckle straps and sculpted stacked soles",
    "high-fashion minimalist court sneakers with clean geometric leather paneling, tonal cotton laces, and pristine designer soles",
    "edgy polished leather combat boots with neat front lacing, side zip closure, and chunky lugged platform outsoles",
    "stylish tonal leather sneaker-boots with padded collar, pristine stitching, and sculpted designer outsoles"
  ];

  const maleShoeStyles = [
    "luxury low-top designer sneakers in pristine calfskin with subtle micro-perforations, flat waxed laces, and sculpted rubber cupsole",
    "architectural lug-sole leather derbies in polished black calf with silver eyelets, clean welt seams, and bold modern proportions",
    "modern retro suede-and-leather trainers with clean minimalist lines, tonal panelling, and gum/ivory rubber cupsole",
    "high-fashion chunky combat boots in premium smooth leather with neat lace-and-zip front and sculpted treaded outsoles",
    "sleek Chelsea boots in fine brushed leather with angled Cuban heels, sharp streamlined toes, and pristine clean silhouette",
    "designer low-profile skate trainers in tumbled white and tonal leather with padded collar and clean rubber foxing",
    "modern platform loafers with brushed spazzolato leather, subtle tonal penny keeper strap, and sculpted treaded soles"
  ];

  const pool = isFemale ? femaleShoeStyles : maleShoeStyles;
  const chosenShoe = pool[Math.floor(Math.random() * pool.length)];

  let colorHarmonization = "The shoes are color-coordinated to harmonize seamlessly with the outfit";
  if (groupColors && groupColors.length > 0) {
    const validColors = groupColors.filter(c => c && c.name).map(c => c.name);
    if (validColors.length > 0) {
      colorHarmonization += `, with leather tones, sole accents, or fine trim reflecting the palette (${validColors.slice(0, 2).join(' & ')})`;
    }
  }

  const prompt = `AMAZING DESIGNER SHOES & PERFECT OUTFIT HARMONY:
- FOOTWEAR MASTERPIECE: The idol is wearing an extraordinary, impeccably styled pair of shoes: ${chosenShoe}.
- PERFECT COLOR & PROPORTION MATCH: ${colorHarmonization}. The shoes perfectly anchor and complete the outfit from the ground up, balancing the silhouette of the trousers/skirt with modern high-fashion K-pop stage and editorial standards.
- MATERIAL AUTHENTICITY & CRAFT: Pristine materials with genuine physical texture—luxurious calfskin, brushed leather, soft suede trims, crisp eyelets, and sculptural vulcanized or treaded rubber soles. Clean, unworn, and immaculate.
- ABSOLUTE PROHIBITIONS: STRICTLY NO scuffed, dirty, or beat-up sneakers. NO cheap flimsy plastic footwear, NO rubber foam clogs/crocs, NO outdated generic running shoes with clashing neon-green/orange gym soles, NO mismatched or sloppy footwear that detracts from the high-end outfit.
- COMPLETE SHOE VISIBILITY: Both shoes MUST be 100% visible, fully in-frame, standing solidly on the floor with crisp soles and lacing clearly rendered.`;

  return {
    prompt,
    shoesDescription: chosenShoe
  };
}

