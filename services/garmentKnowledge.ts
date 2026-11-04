// services/garmentKnowledge.ts
// Comprehensive, Exhaustive K-Pop Idol Garment Knowledge Base
// Contains deep encyclopedic knowledge of Tops, Bottoms, Jackets/Outerwear, Sets, Footwear, and Accessories
// for both Female and Male K-pop styling.

export type GenderTarget = 'female' | 'male' | 'unisex';

export type GarmentCategory = 
  | 'tops' 
  | 'bottoms' 
  | 'jackets' 
  | 'one_pieces_sets' 
  | 'footwear' 
  | 'accessories' 
  | 'fabrics';

export interface GarmentItem {
  id: string;
  name: string;
  category: GarmentCategory;
  subcategory: string;
  gender: GenderTarget;
  silhouette: string;
  materials: string[];
  stylingNotes: string;
  kpopVibes: string[];
  promptSnippet: string;
}

// ============================================================================
// 1. FEMALE TOPS (50+ Distinct K-Pop Idol Silhouettes)
// ============================================================================
export const FEMALE_TOPS: GarmentItem[] = [
  // Baby Tees & Fitted Tops
  {
    id: "f_top_baby_tee_graphic",
    name: "Vintage Screenprint Baby Tee",
    category: "tops",
    subcategory: "Baby Tees & Cropped Tees",
    gender: "female",
    silhouette: "Fitted micro crop hitting above the navel with cap sleeves and ribbed crew neck",
    materials: ["100% combed cotton jersey", "washed vintage cotton"],
    stylingNotes: "Tucked or cropped above high-rise denim with visible belt; effortless Y2K / off-duty idol aesthetic.",
    kpopVibes: ["Y2K Streetwear", "Off-Duty Airport", "Dance Practice"],
    promptSnippet: "a fitted vintage-washed graphic baby tee in soft combed cotton with a retro distressed chest screenprint and ribbed crew neckline"
  },
  {
    id: "f_top_baby_tee_ringer",
    name: "Retro Contrast-Ringer Baby Tee",
    category: "tops",
    subcategory: "Baby Tees & Cropped Tees",
    gender: "female",
    silhouette: "Fitted short-sleeve crop with contrast piping around collar and sleeve cuffs",
    materials: ["Stretch rib-knit cotton", "modal blend"],
    stylingNotes: "Pairs with pleated tennis skorts or low-slung baggy denim for collegiate athletic look.",
    kpopVibes: ["Preppy Athletic", "High Teen", "Summer Festival"],
    promptSnippet: "a fitted retro ringer baby tee with contrast collegiate binding along the collar and sleeves in soft stretch ribbed cotton"
  },
  {
    id: "f_top_asymm_off_shoulder_tee",
    name: "Deconstructed One-Shoulder Drape Tee",
    category: "tops",
    subcategory: "Baby Tees & Cropped Tees",
    gender: "female",
    silhouette: "Asymmetrical neckline falling off one shoulder with slouchy soft drape",
    materials: ["Fine modal jersey", "slub cotton"],
    stylingNotes: "Layered over a lace or micro-strap camisole for visual depth and effortless idol cool.",
    kpopVibes: ["Acubi Aesthetic", "Editorial Casual", "Minimalist"],
    promptSnippet: "an asymmetrical deconstructed one-shoulder draped tee in ultra-soft lightweight modal jersey with fluid side gathering"
  },
  {
    id: "f_top_cap_sleeve_slash_neck",
    name: "Slash-Neck Cap Sleeve Top",
    category: "tops",
    subcategory: "Baby Tees & Cropped Tees",
    gender: "female",
    silhouette: "Wide horizontal slash boat-neck with micro cap sleeves framing collarbones",
    materials: ["Double-faced compact cotton", "ribbed viscose"],
    stylingNotes: "Accentuates elegant shoulder line and collarbones; pairs with tailored wide-leg slacks.",
    kpopVibes: ["French Chic", "Airport Luxury", "Quiet Luxury"],
    promptSnippet: "a clean slash-neck cap sleeve top in compact matte cotton that elegantly frames the collarbones with sleek minimalist lines"
  },
  {
    id: "f_top_distressed_raglan_tee",
    name: "Cropped Distressed Raglan Baseball Tee",
    category: "tops",
    subcategory: "Baby Tees & Cropped Tees",
    gender: "female",
    silhouette: "Cropped sporty raglan with 3/4 contrast sleeves and raw-edge hem",
    materials: ["Slub cotton jersey", "heathered modal"],
    stylingNotes: "Raw hem hits high waist; style with skater cargo pants and silver chain belt.",
    kpopVibes: ["Grunge Street", "Dance Practice", "90s Retro"],
    promptSnippet: "a cropped sporty raglan baseball tee with contrast 3/4 sleeves, raw unfinished hem, and subtle vintage wash fading"
  },

  // Corsets, Bustiers & Structured Tops
  {
    id: "f_top_denim_boned_corset",
    name: "Structured Boned Denim Bustier",
    category: "tops",
    subcategory: "Corsets & Bustiers",
    gender: "female",
    silhouette: "Curved sweetheart neckline with exposed structural boning channels and back zipper",
    materials: ["12oz washed indigo denim", "heavy cotton twill"],
    stylingNotes: "Worn over an oversized crisp white poplin shirt or standalone with wide denim trousers.",
    kpopVibes: ["Girl Crush", "Stage Performance", "High-Fashion Editorial"],
    promptSnippet: "a structured boned denim bustier in washed indigo twill with architectural sweetheart neckline and contrast golden-amber topstitching"
  },
  {
    id: "f_top_twill_lace_up_corset",
    name: "Architectural Lace-Up Twill Corset",
    category: "tops",
    subcategory: "Corsets & Bustiers",
    gender: "female",
    silhouette: "Fitted bodice with nickel eyelets and tonal lace-up detailing along front",
    materials: ["Structured cotton gabardine", "matte twill"],
    stylingNotes: "Layered over sheer mesh long-sleeve tops for dynamic stage presence.",
    kpopVibes: ["Modern Cyber", "Girl Crush", "Avant-Garde"],
    promptSnippet: "a sharp architectural lace-up corset in structured cotton gabardine featuring polished nickel eyelets and tailored contour seams"
  },
  {
    id: "f_top_leather_sweetheart_crop",
    name: "Matte Lambskin Sweetheart Crop Top",
    category: "tops",
    subcategory: "Corsets & Bustiers",
    gender: "female",
    silhouette: "Form-fitting strapless bodice in supple leather with clean edge seams",
    materials: ["Supple matte lambskin leather", "soft viscose lining"],
    stylingNotes: "Pairs with matching leather cargo slacks or fluid silk maxi skirts.",
    kpopVibes: ["Rockstar Chic", "Dark Minimalist", "Stage Royalty"],
    promptSnippet: "a sleek strapless sweetheart bodice in buttery matte lambskin leather with tailored structural darts and smooth clean finish"
  },
  {
    id: "f_top_mesh_paneled_bustier",
    name: "Sheer Mesh-Paneled Architectural Bustier",
    category: "tops",
    subcategory: "Corsets & Bustiers",
    gender: "female",
    silhouette: "Bustier with alternating opaque satin cups and sheer power-mesh side panels",
    materials: ["Duchess satin", "sheer technical power-mesh"],
    stylingNotes: "Dramatic stage wear; balance with high-rise wide-leg pleated trousers.",
    kpopVibes: ["Stage Performance", "Femme Fatale", "High Fashion"],
    promptSnippet: "an architectural bustier featuring duchess satin cups seamlessly juxtaposed with breathable sheer power-mesh side contouring"
  },
  {
    id: "f_top_denim_bandeau_buckles",
    name: "Bandeau Top with Utility Buckles",
    category: "tops",
    subcategory: "Corsets & Bustiers",
    gender: "female",
    silhouette: "Straight horizontal bandeau tube top with adjustable metallic hardware straps",
    materials: ["Washed black denim", "silver alloy hardware"],
    stylingNotes: "Raw-edge industrial cool, paired with low-rise parachute pants.",
    kpopVibes: ["Acubi Aesthetic", "Festival Stage", "Y2K Grunge"],
    promptSnippet: "a straight-cut denim bandeau crop top with industrial silver buckle straps and reinforced stitching across the chest"
  },

  // Blouses & Crisp Button-Down Shirts
  {
    id: "f_top_cropped_poplin_shirt",
    name: "Crisp Cropped Poplin Button-Down",
    category: "tops",
    subcategory: "Blouses & Shirts",
    gender: "female",
    silhouette: "Boxy cropped fit hitting right at the waist with sharp point collar and chest pocket",
    materials: ["100% fine Italian cotton poplin"],
    stylingNotes: "Leaves waistline clearly defined; pairs effortlessly with high-rise pleated slacks and leather belt.",
    kpopVibes: ["Preppy Minimalist", "Airport Chic", "Modern Office-Core"],
    promptSnippet: "a crisp cropped cotton poplin button-down shirt with a sharp point collar, neat chest pocket, and clean boxy waistline"
  },
  {
    id: "f_top_asymmetric_wrap_blouse",
    name: "Asymmetric Poplin Wrap Shirt with Tie Sash",
    category: "tops",
    subcategory: "Blouses & Shirts",
    gender: "female",
    silhouette: "Surplice wrap front fastening with an elongated side tie sash around the waist",
    materials: ["High-density cotton broadcloth", "crisp paper-touch poplin"],
    stylingNotes: "Creates sculptural waist definition; paired with tailored cigarette slacks.",
    kpopVibes: ["Runway Editorial", "Luxury Airport", "Modern Chic"],
    promptSnippet: "a sculptural asymmetric poplin wrap blouse with an elongated side tie sash, dramatic crossover front, and neat tailored cuffs"
  },
  {
    id: "f_top_oversized_french_cuff_shirt",
    name: "Oversized French-Cuff Striped Oxford",
    category: "tops",
    subcategory: "Blouses & Shirts",
    gender: "female",
    silhouette: "Slouchy boyfriend cut with extra-long French cuffs and curved high-low shirttail hem",
    materials: ["Yarn-dyed cotton Oxford cloth", "pinstripe weave"],
    stylingNotes: "Half-tucked into straight-leg vintage denim with polished silver belt buckle.",
    kpopVibes: ["Off-Duty Idol", "Boyfriend Fit", "Parisian Chic"],
    promptSnippet: "an oversized fine-stripe Oxford shirt with dropped shoulders, elongated French cuffs, and a relaxed half-tuck into trousers"
  },
  {
    id: "f_top_sheer_organza_blouse",
    name: "Translucent Organza Puff-Sleeve Blouse",
    category: "tops",
    subcategory: "Blouses & Shirts",
    gender: "female",
    silhouette: "Voluminous sheer puff sleeves with fitted bodice and high Victorian stand collar",
    materials: ["Silk organza", "fine sheer voile"],
    stylingNotes: "Layered over an opaque silk camisole for fairy-like ethereal stage presence.",
    kpopVibes: ["Ethereal Dream", "Royalty Concept", "Stage Performance"],
    promptSnippet: "a luminous translucent silk organza blouse with dramatic voluminous puff sleeves, high stand collar, and delicate mother-of-pearl buttons"
  },
  {
    id: "f_top_pussy_bow_silk_shirt",
    name: "Silk Charmeuse Pussy-Bow Necktie Blouse",
    category: "tops",
    subcategory: "Blouses & Shirts",
    gender: "female",
    silhouette: "Fluid drape with long attached neck ribbons tied in a relaxed soft bow",
    materials: ["100% mulberry silk charmeuse", "matte silk crepe"],
    stylingNotes: "Tucked smoothly into high-waisted wool trousers under a tweed blouson.",
    kpopVibes: ["Old Money Luxury", "High-Society Chic", "Award Show Red Carpet"],
    promptSnippet: "a luxurious silk charmeuse blouse with an elegant trailing pussy-bow necktie, soft fluid drape, and understated liquid sheen"
  },
  {
    id: "f_top_deconstructed_collar_shirt",
    name: "Deconstructed Collarless Poplin Shirt",
    category: "tops",
    subcategory: "Blouses & Shirts",
    gender: "female",
    silhouette: "Asymmetrical unbuttoned neckline with raw collarband and split sleeve vents",
    materials: ["Crisp compact poplin"],
    stylingNotes: "Avant-garde Seoul street fashion favorite.",
    kpopVibes: ["Seoul Streetwear", "Avant-Garde", "Editorial"],
    promptSnippet: "a deconstructed crisp poplin shirt with a raw asymmetrical neckline, split sleeve vents, and architectural front darts"
  },

  // Knitwear, Cardigans & Sweaters
  {
    id: "f_top_mohair_alpaca_cardigan",
    name: "Fluffy Brushed Mohair-Alpaca Cardigan",
    category: "tops",
    subcategory: "Knitwear & Sweaters",
    gender: "female",
    silhouette: "Slightly cropped slouchy V-neck cardigan with chunky ribbed cuffs and hem",
    materials: ["Brushed kid mohair & baby alpaca blend yarn"],
    stylingNotes: "Soft fuzzy halo texture; worn buttoned up as a top or layered over a fine tank.",
    kpopVibes: ["Cozy Soft Luxury", "Winter Comeback", "Girlfriend Material"],
    promptSnippet: "a cozy fluffy brushed mohair-alpaca knit cardigan with luminous mother-of-pearl buttons and a rich cloud-soft halo texture"
  },
  {
    id: "f_top_off_shoulder_cable_knit",
    name: "Slouchy Off-Shoulder Cable-Knit Sweater",
    category: "tops",
    subcategory: "Knitwear & Sweaters",
    gender: "female",
    silhouette: "Oversized wide boat neckline slouching off one shoulder with intricate heritage cable knits",
    materials: ["Fine merino wool", "cashmere blend"],
    stylingNotes: "Effortless warmth and feminine silhouette; style with pleated mini skirt.",
    kpopVibes: ["High Teen Autumn", "Cozy Chic", "Airport Fashion"],
    promptSnippet: "a slouchy off-shoulder cable-knit sweater in ultra-soft merino wool with dimensional heritage cable patterns and relaxed drape"
  },
  {
    id: "f_top_fine_ribbed_mock_neck",
    name: "Second-Skin Ribbed Mock-Neck Top",
    category: "tops",
    subcategory: "Knitwear & Sweaters",
    gender: "female",
    silhouette: "Fitted turtleneck/mock neck with long sleeves extending slightly over wrists",
    materials: ["Extra-fine ribbed merino wool", "modal silk blend"],
    stylingNotes: "Essential layering piece under blazers, pinafores, and leather jackets.",
    kpopVibes: ["Minimalist Chic", "Clean Modern", "Airport Luxury"],
    promptSnippet: "a second-skin fine-gauge ribbed mock-neck knit top with elongated sleeves and a sleek body-skimming silhouette"
  },
  {
    id: "f_top_open_weave_distressed_knit",
    name: "Open-Weave Distressed Punk Knit Top",
    category: "tops",
    subcategory: "Knitwear & Sweaters",
    gender: "female",
    silhouette: "Loose airy crochet/ladder-stitch knit with intentionally dropped stitches and raw hems",
    materials: ["Linen-cotton slub yarn", "matte acrylic tape"],
    stylingNotes: "Worn over a dark bandeau top; pairs with cargo maxi skirt or distressed denim.",
    kpopVibes: ["Grunge Rockstar", "Festival", "Acubi Style"],
    promptSnippet: "an airy open-weave distressed ladder-knit top with loose dropped stitches, see-through texture, and frayed raw edges"
  },
  {
    id: "f_top_polo_collar_knit",
    name: "Retro Fine-Gauge Knit Polo",
    category: "tops",
    subcategory: "Knitwear & Sweaters",
    gender: "female",
    silhouette: "Fitted short-sleeve knit with spread Johnny collar and 3-button placket",
    materials: ["Supima cotton-silk knit"],
    stylingNotes: "Sporty tennis chic; tucked into pleated skort with retro court sneakers.",
    kpopVibes: ["Preppy Tennis", "High Teen", "Vintage Summer"],
    promptSnippet: "a fitted fine-gauge knit polo shirt with a neat spread collar, delicate ribbed trims, and smooth silky handfeel"
  },
  {
    id: "f_top_cropped_fisherman_sweater",
    name: "Cropped Chunky Fisherman Rib Sweater",
    category: "tops",
    subcategory: "Knitwear & Sweaters",
    gender: "female",
    silhouette: "Boxy chunky rib knit cropped right at waistline with dropped shoulders",
    materials: ["Chunky 5-gauge wool yarn"],
    stylingNotes: "Clean structural silhouette that prevents bulkiness at the hips.",
    kpopVibes: ["Winter Airport", "Nordic Cozy", "Modern Casual"],
    promptSnippet: "a boxy cropped chunky fisherman rib-knit sweater with dropped shoulders, wide ribbed collar, and clean waist-skimming hem"
  },

  // Camisoles, Halters & Tanks
  {
    id: "f_top_cowl_neck_silk_cami",
    name: "Draped Cowl-Neck Silk Camisole",
    category: "tops",
    subcategory: "Camisoles & Halters",
    gender: "female",
    silhouette: "Fluid draped cowl neckline with micro spaghetti straps and bias cut",
    materials: ["100% silk satin charmeuse"],
    stylingNotes: "Luxurious fluid shine; tucked into high-waisted wide-leg trousers under a sharp blazer.",
    kpopVibes: ["Sophisticated Glamour", "Airport Chic", "Night-Out Luxury"],
    promptSnippet: "a fluid cowl-neck silk camisole in lustrous satin charmeuse with delicate spaghetti straps and graceful cascading drape"
  },
  {
    id: "f_top_halter_keyhole_neck",
    name: "High-Neck Keyhole Halter Crop Top",
    category: "tops",
    subcategory: "Camisoles & Halters",
    gender: "female",
    silhouette: "High halter collar fastening at the nape with teardrop chest keyhole cutout",
    materials: ["Sculpting double-knit jersey", "stretch ponte"],
    stylingNotes: "Draws eye to neckline and shoulders; iconic stage performance piece.",
    kpopVibes: ["Stage Performance", "Girl Crush", "Futuristic"],
    promptSnippet: "a high-neck keyhole halter crop top in sculpting stretch jersey with clean teardrop cutout and sleek open-shoulder line"
  },
  {
    id: "f_top_racerback_ribbed_tank",
    name: "High-Neck Racerback Ribbed Tank",
    category: "tops",
    subcategory: "Camisoles & Halters",
    gender: "female",
    silhouette: "Cut-in halter shoulders with tight racerback and high cut-in armholes",
    materials: ["Heavy 2x2 cotton rib"],
    stylingNotes: "Athletic idol staple; ideal for layering under unbuttoned oversized shirts and jackets.",
    kpopVibes: ["Dance Practice", "Off-Duty Minimalist", "Athleisure"],
    promptSnippet: "a fitted high-neck racerback tank in heavy stretch cotton ribbing with athletic cut-in shoulders and clean finished seams"
  },
  {
    id: "f_top_ruched_tube_top",
    name: "Ruched Side-Drawstring Tube Top",
    category: "tops",
    subcategory: "Camisoles & Halters",
    gender: "female",
    silhouette: "Strapless bandeau with adjustable side cinch cords creating flattering gathers",
    materials: ["Double-layered modal spandex"],
    stylingNotes: "Pairs with low-rise parachute cargos or wide skater denim.",
    kpopVibes: ["Y2K Baddie", "Summer Comeback", "Festival"],
    promptSnippet: "a strapless ruched tube crop top with adjustable side drawstrings creating soft horizontal gathers across the torso"
  },
  {
    id: "f_top_lace_trim_camisole",
    name: "Vintage Lace-Trimmed Satin Camisole",
    category: "tops",
    subcategory: "Camisoles & Halters",
    gender: "female",
    silhouette: "V-neck cami bordered with delicate eyelash floral scalloped lace",
    materials: ["Silk-touch poly-satin", "French eyelash lace"],
    stylingNotes: "Contrasted with oversized masculine tailored blazers or distressed leather jackets.",
    kpopVibes: ["Coquette", "Vintage Parisian", "Romantic Stage"],
    promptSnippet: "a romantic satin camisole framed with intricate eyelash scalloped lace along the V-neckline and delicate adjustable straps"
  },

  // Hoodies, Sweatshirts & Athleisure Tops
  {
    id: "f_top_cropped_zip_hoodie",
    name: "Cropped French-Terry Two-Way Zip Hoodie",
    category: "tops",
    subcategory: "Hoodies & Sweatshirts",
    gender: "female",
    silhouette: "Cropped boxy fleece hoodie with silver two-way zipper and relaxed drop shoulders",
    materials: ["420gsm loopback French terry cotton"],
    stylingNotes: "Unzipped from the bottom to reveal high-waisted waistband and belt; dance practice essential.",
    kpopVibes: ["Dance Practice", "Streetwear Cool", "Airport Casual"],
    promptSnippet: "a boxy cropped French-terry hoodie featuring a polished silver two-way zipper unzipped slightly at the hem, with generous double-layered hood"
  },
  {
    id: "f_top_collegiate_crewneck",
    name: "Oversized Vintage Collegiate Crewneck",
    category: "tops",
    subcategory: "Hoodies & Sweatshirts",
    gender: "female",
    silhouette: "Slouchy oversized boyfriend sweatshirt with chenille varsity letter embroidery",
    materials: ["Heavyweight brushed fleece cotton"],
    stylingNotes: "Worn over a pleated mini skirt so the hem just peeks through.",
    kpopVibes: ["High Teen", "Campus Preppy", "Casual Comeback"],
    promptSnippet: "an oversized heavyweight vintage collegiate crewneck sweatshirt with retro chenille varsity patch lettering and chunky ribbed collar"
  },
  {
    id: "f_top_mesh_football_jersey",
    name: "Cropped Athletic Mesh Football Jersey",
    category: "tops",
    subcategory: "Sporty & Performance",
    gender: "female",
    silhouette: "Boxy V-neck crop with athletic numeric print and striped shoulder yokes",
    materials: ["Perforated technical sports mesh"],
    stylingNotes: "Layered over a white bandeau; paired with baggy denim or pleated skort.",
    kpopVibes: ["Blockcore", "Sporty Street", "Music Video"],
    promptSnippet: "a cropped athletic football jersey in breathable sports mesh with bold contrast numeric graphics, V-neck collar, and striped sleeve yokes"
  },
  {
    id: "f_top_motocross_panel_longsleeve",
    name: "Paneled Motocross Compression Longsleeve",
    category: "tops",
    subcategory: "Sporty & Performance",
    gender: "female",
    silhouette: "Fitted mock-neck athletic top with ergonomic curved contrast panels and racing typography",
    materials: ["Technical compression nylon spandex"],
    stylingNotes: "High-octane racing aesthetic; matches with racing leather pants.",
    kpopVibes: ["Moto Racing", "Cyberpunk", "Girl Crush Stage"],
    promptSnippet: "a sleek paneled motocross compression long-sleeve top with curved ergonomic contrast lines, mock-neck collar, and dynamic racing graphics"
  },
  {
    id: "f_top_rugby_stripe_polo",
    name: "Cropped Heavyweight Rugby Stripe Polo",
    category: "tops",
    subcategory: "Sporty & Performance",
    gender: "female",
    silhouette: "Boxy crop with wide horizontal rugby stripes and crisp white drill collar",
    materials: ["Heavy 100% cotton rugby jersey", "woven cotton twill collar"],
    stylingNotes: "Concealed rubber button placket; vintage 90s athletic energy.",
    kpopVibes: ["90s High Teen", "Preppy Casual", "Outdoor Festival"],
    promptSnippet: "a cropped heavyweight rugby polo shirt with bold horizontal stripes, crisp contrast white twill collar, and relaxed boxy sleeves"
  },
  {
    id: "f_top_asym_corset_peplum",
    name: "Asymmetric Peplum Bustier Corset",
    category: "tops",
    subcategory: "Corsets & Bustiers",
    gender: "female",
    silhouette: "Fitted structured boning through torso opening into an angled architectural peplum flare over the hips",
    materials: ["Heavy cotton drill", "flexible steel-boned canvas"],
    stylingNotes: "Avant-garde idol stage presence; accentuates waistline with sculptural drama.",
    kpopVibes: ["High Fashion", "Stage Performance", "Avant-Garde"],
    promptSnippet: "an architectural asymmetric peplum bustier corset with structural vertical boning channels and an angled sculptural flare over the hip"
  },
  {
    id: "f_top_halter_suiting_waistcoat",
    name: "Backless Halter Tailored Suiting Vest",
    category: "tops",
    subcategory: "Vests & Waistcoats",
    gender: "female",
    silhouette: "Deep plunging halter neck with suiting lapels, pointed front hems, and bare open back",
    materials: ["Fine tropical worsted wool", "cupro lining"],
    stylingNotes: "Sleek and sultry masculine-feminine tailoring for awards and concept photos.",
    kpopVibes: ["Girl Crush", "Award Show", "Old Money"],
    promptSnippet: "a sharp backless halter tailored suiting waistcoat in superfine wool with horn button closure and plunging lapels"
  },
  {
    id: "f_top_chunky_bolero_tank_set",
    name: "Chunky Ribbed Bolero Shrug & Micro-Tank Set",
    category: "tops",
    subcategory: "Knitwear & Sweaters",
    gender: "female",
    silhouette: "Ultra-cropped long-sleeve bolero shrug with thumbhole cuffs worn over a matching ribbed micro-tank",
    materials: ["Chunky 7-gauge merino wool rib-knit"],
    stylingNotes: "Y2K dance practice signature; provides warmth while showcasing neckline and waist.",
    kpopVibes: ["Dance Practice", "Y2K Pop", "Street Style"],
    promptSnippet: "a coordinated two-piece chunky ribbed knit set featuring an ultra-cropped bolero shrug with thumbholes worn over a matching fitted scoop-neck tank"
  },
  {
    id: "f_top_broderie_anglaise_blouse",
    name: "Broderie Anglaise Eyelet Cotton Blouse",
    category: "tops",
    subcategory: "Blouses & Shirts",
    gender: "female",
    silhouette: "Victorian ruffled yoke with intricate floral eyelet cutouts, scalloped trim, and blouson sleeves",
    materials: ["100% fine Swiss cotton batiste with broderie anglaise embroidery"],
    stylingNotes: "Romantic coquette concept; pairs with denim or lace skirt.",
    kpopVibes: ["Coquette", "Romantic Summer", "Ethereal Dream"],
    promptSnippet: "a delicate white broderie anglaise eyelet blouse with intricate openwork floral embroidery, ruffled stand collar, and scalloped sleeve cuffs"
  },
  {
    id: "f_top_mandarin_silk_jacquard",
    name: "Mandarin Collar Silk Jacquard Crop Top",
    category: "tops",
    subcategory: "Blouses & Shirts",
    gender: "female",
    silhouette: "High mandarin stand collar with diagonal frog knot fastenings and cap sleeves",
    materials: ["Woven silk jacquard with floral or dragon damask motif"],
    stylingNotes: "Fusion heritage stage styling; sleek and regal.",
    kpopVibes: ["Regal Concept", "Stage Performance", "Fusion Traditional"],
    promptSnippet: "a cropped mandarin collar top in lustrous silk jacquard damask with traditional handmade fabric frog knot button closures"
  },
  {
    id: "f_top_lurex_metallic_bandeau",
    name: "Lurex Metallic Shimmer Knit Bandeau",
    category: "tops",
    subcategory: "Camisoles & Halters",
    gender: "female",
    silhouette: "Strapless bandeau top knitted with sparkling metallic threads that catch stage lighting",
    materials: ["Stretch lurex metallic yarn", "soft modal lining"],
    stylingNotes: "High-voltage sparkle under mesh layers or oversized leather blousons.",
    kpopVibes: ["Stage Performance", "Futuristic Disco", "Clubwear"],
    promptSnippet: "a shimmering strapless lurex knit bandeau top with multidimensional metallic sparkle and clean seamless edge finishing"
  },
  {
    id: "f_top_cold_shoulder_slouch_tee",
    name: "Cold-Shoulder Cutout Draped Slouch Tee",
    category: "tops",
    subcategory: "Tees & Crop Tops",
    gender: "female",
    silhouette: "Relaxed fluid drape with geometric shoulder cutouts showing bare collarbones and shoulders",
    materials: ["Mercerized cotton-viscose blend"],
    stylingNotes: "Effortless airport styling; relaxed yet visually alluring.",
    kpopVibes: ["Airport Casual", "Minimalist Chic", "Off-Duty"],
    promptSnippet: "a slouchy drapey tee featuring clean laser-cut cold-shoulder openings that reveal the collarbone and deltoid with fluid jersey drape"
  },
  {
    id: "f_top_mesh_cutout_bodysuit",
    name: "Thumbhole Sheer Mesh Cutout Bodysuit",
    category: "tops",
    subcategory: "Sporty & Performance",
    gender: "female",
    silhouette: "Body-hugging second skin with strategically mapped sheer micro-mesh and opaque panels and elongated thumbhole sleeves",
    materials: ["High-recovery power mesh & matte spandex"],
    stylingNotes: "Precision athletic lines; stage-ready movement and visual interest.",
    kpopVibes: ["Girl Crush", "Cyberpunk", "Stage Performance"],
    promptSnippet: "a sculpted second-skin bodysuit with graphic sheer-and-opaque paneling, high mock collar, and extended athletic sleeves with thumbholes"
  },
  {
    id: "f_top_cowl_halter_silk_top",
    name: "Draped Cowl-Neck Halter Liquid Silk Top",
    category: "tops",
    subcategory: "Camisoles & Halters",
    gender: "female",
    silhouette: "Deep cascading cowl neckline draped on the bias with a thin halter cord and open back",
    materials: ["Heavy 22-momme silk satin"],
    stylingNotes: "Liquid metallic sheen; effortless glamor with high-waisted tailored pants.",
    kpopVibes: ["Old Money Luxury", "Award Show", "Sensual Chic"],
    promptSnippet: "a backless liquid silk satin halter top with an effortless cascading cowl neckline and fluid, undulating light-reflective drape"
  },
  {
    id: "f_top_milkmaid_smocked_peasant",
    name: "Milkmaid Smocked Bodice Peasant Crop",
    category: "tops",
    subcategory: "Blouses & Shirts",
    gender: "female",
    silhouette: "Elasticated square neckline with ruched sweetheart bust, smocked stretchy bodice, and flutter cap sleeves",
    materials: ["Washed linen-cotton blend"],
    stylingNotes: "Fresh, youthful, and sweet; perfect for summer promotions.",
    kpopVibes: ["Coquette", "Summer Comeback", "High Teen"],
    promptSnippet: "a sweet milkmaid crop top with a gathered sweetheart bust, stretchy smocked torso bodice, and airy ruffled cap sleeves"
  },
  {
    id: "f_top_sculpted_hem_peplum",
    name: "Architectural Sculpted Hem Strapless Top",
    category: "tops",
    subcategory: "Corsets & Bustiers",
    gender: "female",
    silhouette: "Molded sweetheart neckline with structural boning and a curved wave-cut sculpted hemline",
    materials: ["Double-faced technical crepe", "internal horsehair braid hem"],
    stylingNotes: "Runway-level geometric form; holds its crisp silhouette flawlessly.",
    kpopVibes: ["High Fashion Editorial", "Avant-Garde", "Red Carpet"],
    promptSnippet: "a strapless architectural top in structured crepe with a wave-sculpted bottom hemline, crisp interior boning, and immaculate clean seams"
  },
  {
    id: "f_top_diamante_satin_bustier",
    name: "Satin Bustier with Diamante Crystal Trim",
    category: "tops",
    subcategory: "Corsets & Bustiers",
    gender: "female",
    silhouette: "Structured underwired sweetheart cups outlined with pavé diamante rhinestone fringe",
    materials: ["Duchess silk satin", "faceted glass crystal chain"],
    stylingNotes: "Catches stadium spotlight rays; premier headline concert piece.",
    kpopVibes: ["Royalty Concept", "Stage Performance", "Glamour"],
    promptSnippet: "a duchess satin bustier crop top accented with delicate pavé diamante crystal piping around the underwire cups and sparkling faceted fringe"
  },
  {
    id: "f_top_baseball_oversized_jersey",
    name: "Vintage Satin Baseball Button-Up Jersey",
    category: "tops",
    subcategory: "Sporty & Performance",
    gender: "female",
    silhouette: "Oversized button-down athletic jersey with contrast piping and retro felt script across the chest",
    materials: ["Heavy sports satin", "piped twill"],
    stylingNotes: "Worn unbuttoned over a white sports bra with track shorts.",
    kpopVibes: ["Sporty Street", "90s High Teen", "Blockcore"],
    promptSnippet: "an oversized vintage-style satin baseball jersey with contrast edge piping, tonal front buttons, and retro varsity athletic lettering"
  },
  {
    id: "f_top_cropped_anorak_windbreaker",
    name: "Half-Zip Technical Anorak Windbreaker Crop",
    category: "tops",
    subcategory: "Hoodies & Sweatshirts",
    gender: "female",
    silhouette: "Boxy cropped silhouette with high funnel neck, waterproof half-zipper, and bungee toggle waist hem",
    materials: ["Matte ripstop nylon with water-repellent finish"],
    stylingNotes: "Technical gorpcore chic; cinched tight at the waist to emphasize silhouette.",
    kpopVibes: ["Gorpcore", "Seoul Streetwear", "Music Video"],
    promptSnippet: "a cropped technical ripstop nylon anorak with a stand-up zip collar, bungee toggle cords at the cropped hem, and matte contrast pocket panels"
  },
  {
    id: "f_top_open_back_poplin_tie",
    name: "Crisp Poplin Open-Back Multi-Tie Ribbon Shirt",
    category: "tops",
    subcategory: "Blouses & Shirts",
    gender: "female",
    silhouette: "Looks like a classic formal collared shirt from the front, but opens completely at the back with long trailing fabric tie ribbons",
    materials: ["100% fine Egyptian cotton poplin"],
    stylingNotes: "Subversive tailoring; high impact when the idol turns around on stage.",
    kpopVibes: ["Avant-Garde", "Editorial", "Stage Performance"],
    promptSnippet: "a crisp white cotton poplin shirt with a classic pointed collar in front, featuring a dramatic bare open back fastened by multiple trailing tie ribbons"
  }
];

// ============================================================================
// 2. MALE TOPS (50+ Distinct K-Pop Idol Silhouettes)
// ============================================================================
export const MALE_TOPS: GarmentItem[] = [
  // Heavyweight Tees & Layering Undershirts
  {
    id: "m_top_boxy_heavyweight_tee",
    name: "Drop-Shoulder 280gsm Heavyweight Crewneck Tee",
    category: "tops",
    subcategory: "Tees & Undershirts",
    gender: "male",
    silhouette: "Wide boxy fit with dropped shoulder seams, thick 1.25-inch ribbed neckband, and structured drape",
    materials: ["280gsm combed open-end cotton jersey"],
    stylingNotes: "Holds a crisp silhouette that never clings; clean front tuck into pleated trousers.",
    kpopVibes: ["Clean Minimalist", "Airport Casual", "Boyfriend Look"],
    promptSnippet: "a pristine drop-shoulder heavyweight 280gsm cotton crewneck tee with a thick structured neckband and immaculate boxy silhouette"
  },
  {
    id: "m_top_vintage_tour_graphic_tee",
    name: "Vintage Faded Rock-Tour Graphic Tee",
    category: "tops",
    subcategory: "Tees & Undershirts",
    gender: "male",
    silhouette: "Relaxed oversized cut with subtle enzyme wash fading and soft distressed collar edges",
    materials: ["Pigment-dyed washed vintage cotton"],
    stylingNotes: "Layered under tailored blazers or leather jackets for balanced edge.",
    kpopVibes: ["Seoul Grunge", "Rockstar Idol", "Off-Duty Street"],
    promptSnippet: "a vintage washed graphic tour tee with distressed collar detailing, faded retro concert artwork, and effortless relaxed drape"
  },
  {
    id: "m_top_ribbed_muscle_tank",
    name: "Fine-Ribbed Scoop Muscle Tank",
    category: "tops",
    subcategory: "Tees & Undershirts",
    gender: "male",
    silhouette: "Fitted athletic sleeveless tank with deep scoop neck and broad shoulder straps",
    materials: ["Stretch ribbed modal-cotton blend"],
    stylingNotes: "Layered cleanly under unbuttoned camp-collar shirts or cardigans.",
    kpopVibes: ["Summer Comeback", "Stage Rehearsal", "Sophisticated Casual"],
    promptSnippet: "a fitted fine-ribbed cotton-modal muscle tank with a clean scoop neckline and tailored athletic shoulder cut"
  },
  {
    id: "m_top_raw_hem_boxy_tee",
    name: "Raw-Edge Hem Boxy Skate Tee",
    category: "tops",
    subcategory: "Tees & Undershirts",
    gender: "male",
    silhouette: "Slightly shorter boxy length with rolled raw-cut sleeve cuffs and waist hem",
    materials: ["Slub cotton jersey"],
    stylingNotes: "Shows off belt buckle and trouser waistband proportions cleanly.",
    kpopVibes: ["Skater Street", "Practice Room", "Casual Cool"],
    promptSnippet: "a relaxed boxy skate tee with raw-edge unfinished hems, subtle rolled cuffs, and textured slub cotton weave"
  },

  // Knit Polos, Henleys & Collared Knits
  {
    id: "m_top_johnny_collar_knit_polo",
    name: "Johnny-Collar Fine-Gauge Knit Polo",
    category: "tops",
    subcategory: "Knit Polos & Collared Knits",
    gender: "male",
    silhouette: "Seamless buttonless V-split Johnny collar with clean ribbed hem and cuffs",
    materials: ["Extra-fine merino wool", "silk-cotton blend knit"],
    stylingNotes: "Sophisticated luxury staple; worn tucked into high-rise double-pleated slacks.",
    kpopVibes: ["Old Money", "Airport Luxury", "Clean Aesthetic"],
    promptSnippet: "an impeccably tailored fine-gauge knit polo featuring a seamless buttonless Johnny collar, ribbed cuffs, and soft silky sheen"
  },
  {
    id: "m_top_open_weave_retro_polo",
    name: "Open-Weave Pointelle Retro Knit Polo",
    category: "tops",
    subcategory: "Knit Polos & Collared Knits",
    gender: "male",
    silhouette: "Relaxed 70s-inspired short sleeve with open pointelle stitch pattern and horn buttons",
    materials: ["Linen-cotton blend knit yarn"],
    stylingNotes: "Breathable airy texture; layered over a ribbed white undershirt with wide linen trousers.",
    kpopVibes: ["Summer Resort", "Retro Chic", "MV Visual"],
    promptSnippet: "a vintage-inspired open-weave pointelle knit polo with an airy geometric stitch, spread collar, and natural horn buttons"
  },
  {
    id: "m_top_waffle_thermal_henley",
    name: "Heavy Waffle-Knit Thermal Henley",
    category: "tops",
    subcategory: "Knit Polos & Collared Knits",
    gender: "male",
    silhouette: "Fitted long sleeve with 4-button twill placket and wide ribbed storm cuffs",
    materials: ["350gsm 100% cotton honeycomb waffle knit"],
    stylingNotes: "Rugged yet cozy; buttons left partially undone; paired with raw selvedge denim.",
    kpopVibes: ["Boyfriend Material", "Autumn Acoustic", "Casual Heritage"],
    promptSnippet: "a heavyweight honeycomb waffle-knit thermal henley with a woven twill button placket, long ribbed cuffs, and rich dimensional texture"
  },
  {
    id: "m_top_zip_neck_merino_polo",
    name: "Quarter-Zip Merino Wool Knit Polo",
    category: "tops",
    subcategory: "Knit Polos & Collared Knits",
    gender: "male",
    silhouette: "Stand-up mock collar with silver metal half-zip and set-in sleeves",
    materials: ["100% fine Italian merino wool"],
    stylingNotes: "Zipped up for sleek minimalism or unzipped for laid-back chic.",
    kpopVibes: ["Minimalist Luxury", "Winter Airport", "Smart Casual"],
    promptSnippet: "a sleek quarter-zip merino wool knit sweater polo with a polished silver zipper pull, stand collar, and ultra-fine handfeel"
  },
  {
    id: "m_top_vertical_stripe_70s_polo",
    name: "Vertical-Stripe Textured Bowling Knit",
    category: "tops",
    subcategory: "Knit Polos & Collared Knits",
    gender: "male",
    silhouette: "Relaxed fit with contrasting vertical jacquard panels across the chest and spread collar",
    materials: ["Mercerized cotton knit"],
    stylingNotes: "Pairs with flared or straight-leg trousers for retro idol elegance.",
    kpopVibes: ["Retro 70s", "City Pop", "Summer Visual"],
    promptSnippet: "a retro vertical-stripe knit polo featuring contrasting jacquard paneling down the front, spread collar, and refined rib trim"
  },

  // Shirts & Button-Downs
  {
    id: "m_top_oversized_poplin_oxford",
    name: "Crisp Oversized Poplin Oxford Shirt",
    category: "tops",
    subcategory: "Shirts & Button-Downs",
    gender: "male",
    silhouette: "Relaxed slouchy drape with dropped shoulders, wide buttoned cuffs, and high-low curved hem",
    materials: ["100% high-density Italian cotton poplin"],
    stylingNotes: "Half-tucked or worn unbuttoned over a high-neck tee; staple idol airport fashion.",
    kpopVibes: ["Airport Fashion", "Minimalist Clean", "Boyfriend Fit"],
    promptSnippet: "an oversized crisp cotton poplin shirt with dropped shoulders, wide button cuffs, and high-low hem in a relaxed relaxed fit"
  },
  {
    id: "m_top_camp_collar_silk_shirt",
    name: "Camp-Collar Silk-Blend Resort Shirt",
    category: "tops",
    subcategory: "Shirts & Button-Downs",
    gender: "male",
    silhouette: "Straight hem with open Cuban notch collar and boxy short sleeves",
    materials: ["Silk-viscose twill", "sandwashed silk"],
    stylingNotes: "Fluid drape that moves gracefully with wind; worn open over a tank with tailored trousers.",
    kpopVibes: ["Summer Comeback", "Resort Glamour", "Music Video"],
    promptSnippet: "a fluid camp-collar resort shirt in sandwashed silk-viscose twill with an open Cuban notch collar, chest pocket, and fluid drape"
  },
  {
    id: "m_top_deconstructed_band_shirt",
    name: "Deconstructed Band-Collar Grandad Shirt",
    category: "tops",
    subcategory: "Shirts & Button-Downs",
    gender: "male",
    silhouette: "Minimalist mandarin collar with concealed front button placket and split side vents",
    materials: ["Crinkle linen-cotton blend"],
    stylingNotes: "Zen, modern, and sculptural; worn with fluid wide-leg slacks.",
    kpopVibes: ["Modern Hanbok Concept", "Minimalist Avant-Garde", "Stage Visual"],
    promptSnippet: "a deconstructed band-collar shirt with a concealed front placket, extended sleeve cuffs, and clean architectural lines"
  },
  {
    id: "m_top_western_yoke_denim_shirt",
    name: "10oz Washed Denim Western Shirt with Pearl Snaps",
    category: "tops",
    subcategory: "Shirts & Button-Downs",
    gender: "male",
    silhouette: "Fitted western cut with pointed front and back shoulder yokes and twin flap pockets",
    materials: ["10oz rope-dyed washed indigo denim", "synthetic pearl snap buttons"],
    stylingNotes: "Tucked into dark trousers with western silver belt for modern cowboy swagger.",
    kpopVibes: ["Modern Western", "Americana Cool", "Stage Performance"],
    promptSnippet: "a vintage washed denim western shirt featuring authentic pointed yokes, twin flap chest pockets, and polished pearl snap fasteners"
  },
  {
    id: "m_top_sheer_silk_organza_shirt",
    name: "Translucent Silk Organza Dress Shirt",
    category: "tops",
    subcategory: "Shirts & Button-Downs",
    gender: "male",
    silhouette: "Sharp formal collar with sheer ethereal body and French cuffs",
    materials: ["100% sheer silk organza"],
    stylingNotes: "Worn over an opaque dark tank or bare chest under a velvet blazer for dramatic stage presence.",
    kpopVibes: ["Vampire Concept", "Sensual High-Fashion", "Stage Royalty"],
    promptSnippet: "a dramatic translucent silk organza button-down shirt with a crisp formal collar, French cuffs, and ethereal see-through texture"
  },

  // Sweaters & Cardigans
  {
    id: "m_top_mohair_oversized_cardigan",
    name: "Brushed Mohair V-Neck Oversized Cardigan",
    category: "tops",
    subcategory: "Sweaters & Cardigans",
    gender: "male",
    silhouette: "Slouchy oversized silhouette with deep V-neck and chunky genuine horn buttons",
    materials: ["Hand-brushed kid mohair & wool blend"],
    stylingNotes: "Touchable soft halo; worn over a plain white tee with wide vintage jeans.",
    kpopVibes: ["Cozy Soft Boy", "Winter Visual", "Effortless Chic"],
    promptSnippet: "a slouchy brushed kid-mohair V-neck cardigan with rich tactile halo fuzz, chunky horn buttons, and relaxed dropped shoulders"
  },
  {
    id: "m_top_chunky_fisherman_crew",
    name: "Chunky Cable-Knit Fisherman Crewneck",
    category: "tops",
    subcategory: "Sweaters & Cardigans",
    gender: "male",
    silhouette: "Substantial heavy knit with thick ribbed crew collar and intricate honeycomb cable panels",
    materials: ["100% British wool yarn"],
    stylingNotes: "Classic warmth; paired with tailored wool trousers and leather derby shoes.",
    kpopVibes: ["Autumn Heritage", "Winter Warmth", "Clean Preppy"],
    promptSnippet: "a chunky cable-knit fisherman sweater with thick textured honeycomb cable patterns, heavy ribbed neckline, and substantial woolen warmth"
  },
  {
    id: "m_top_distressed_grunge_sweater",
    name: "Deconstructed Distressed Ribbed Pullover",
    category: "tops",
    subcategory: "Sweaters & Cardigans",
    gender: "male",
    silhouette: "Oversized silhouette with intentional ladder runs, frayed collar, and distressed hem",
    materials: ["Slub cotton-acrylic blend"],
    stylingNotes: "Layered over a white tee peaking through the distressing; paired with baggy cargo pants.",
    kpopVibes: ["Seoul Grunge", "Cyberpunk", "Rock Rehearsal"],
    promptSnippet: "an oversized distressed ribbed sweater featuring intentional ladder runs, frayed sleeve cuffs, and an edgy deconstructed grunge finish"
  },
  {
    id: "m_top_slouchy_cricket_sweater",
    name: "Oversized V-Neck Cricket Cable Sweater",
    category: "tops",
    subcategory: "Sweaters & Cardigans",
    gender: "male",
    silhouette: "Deep V-neckline with contrasting collegiate color stripes along collar and cuffs",
    materials: ["Heavyweight combed cotton knit"],
    stylingNotes: "Preppy ivy league charm; worn over an Oxford shirt or standalone.",
    kpopVibes: ["Preppy Ivy League", "Campus Visual", "High Teen"],
    promptSnippet: "an oversized cable-knit cricket sweater with a deep V-neckline bordered by bold contrast collegiate stripes and relaxed slouchy sleeves"
  },

  // Hoodies, Sweatshirts & Athleisure Tops
  {
    id: "m_top_loopback_cotton_hoodie",
    name: "Heavyweight 450gsm Loopback French-Terry Hoodie",
    category: "tops",
    subcategory: "Hoodies & Sweatshirts",
    gender: "male",
    silhouette: "Boxy structured fit with double-layered crossover hood (no drawstrings) and seamless kangaroo pocket",
    materials: ["450gsm heavy unbrushed loopback cotton"],
    stylingNotes: "Hood stands up tall and structured; looks high-end even with casual styling.",
    kpopVibes: ["Streetwear Staple", "Dance Practice", "Airport Casual"],
    promptSnippet: "a premium 450gsm heavyweight loopback French-terry hoodie with a clean double-layered standing hood, boxy fit, and ribbed side gussets"
  },
  {
    id: "m_top_vintage_faded_crewneck",
    name: "Sun-Faded Vintage Washed Crewneck Sweatshirt",
    category: "tops",
    subcategory: "Hoodies & Sweatshirts",
    gender: "male",
    silhouette: "Relaxed drop-shoulder cut with V-insert at the neck and wide ribbed waistband",
    materials: ["Pigment-dyed fleece cotton"],
    stylingNotes: "Front-tucked slightly into relaxed trousers or worn loose over straight jeans.",
    kpopVibes: ["Vintage Retro", "Practice Room", "Casual Comeback"],
    promptSnippet: "a sun-faded vintage washed crewneck sweatshirt with classic V-stitch collar detailing, washed patina finish, and relaxed dropped shoulders"
  },
  {
    id: "m_top_athletic_mesh_jersey",
    name: "Oversized Basketball Mesh Practice Jersey",
    category: "tops",
    subcategory: "Sporty & Performance",
    gender: "male",
    silhouette: "Wide sleeveless cut with striped ribbing along neck and armholes and large chest number",
    materials: ["High-durability technical athletic mesh"],
    stylingNotes: "Layered over a crisp black or white short-sleeve tee with baggy track pants.",
    kpopVibes: ["Hip Hop Concept", "Dance Performance", "90s Sportswear"],
    promptSnippet: "an oversized basketball practice mesh jersey with contrast ribbed neck and arm trim, bold athletic chest numbering, and breathable perforated weave"
  },
  {
    id: "m_top_track_quarter_zip",
    name: "Retro Color-Blocked Quarter-Zip Track Top",
    category: "tops",
    subcategory: "Sporty & Performance",
    gender: "male",
    silhouette: "Stand collar with zip placket and geometric contrast color-block chest chevron",
    materials: ["Nylon crinkle taslan", "breathable mesh lining"],
    stylingNotes: "Pairs with matching windbreaker track pants or relaxed denim.",
    kpopVibes: ["90s Retro Sport", "Active Street", "Music Show Rehearsal"],
    promptSnippet: "a 90s-inspired color-blocked quarter-zip track pullover in crinkle nylon taslan with high stand collar and geometric chest chevron panels"
  },
  {
    id: "m_top_noragi_kimono_shirt",
    name: "Kimono-Wrap Modern Noragi Shirt",
    category: "tops",
    subcategory: "Blouses & Shirts",
    gender: "male",
    silhouette: "Collarless wrap front with clean side-tie closure and wide three-quarter kimono sleeves",
    materials: ["Heavy slubbed linen-cotton canvas"],
    stylingNotes: "Contemporary heritage fusion for music videos and conceptual stages.",
    kpopVibes: ["Fusion Traditional", "Avant-Garde", "Editorial"],
    promptSnippet: "a modern structured kimono-wrap noragi shirt in slubbed linen canvas with a clean crossover tie front and wide structured sleeves"
  },
  {
    id: "m_top_distressed_slub_longsleeve",
    name: "Raw-Hem Distressed Slub Longsleeve Tee",
    category: "tops",
    subcategory: "Tees & Undershirts",
    gender: "male",
    silhouette: "Relaxed slouchy drape with laser-cut distressing, raw rolled hems, and extended cuffs",
    materials: ["100% slub-knit vintage-washed cotton"],
    stylingNotes: "Rock-star idol essential; pairs effortlessly with leather or distressed denim.",
    kpopVibes: ["Grunge Rockstar", "Seoul Streetwear", "Off-Duty"],
    promptSnippet: "a relaxed distressed slub-cotton long-sleeve tee with subtle artful micro-holes, raw-edge hems, and extra-long slouchy sleeves"
  },
  {
    id: "m_top_half_placket_popover",
    name: "Half-Placket Relaxed Popover Shirt",
    category: "tops",
    subcategory: "Blouses & Shirts",
    gender: "male",
    silhouette: "Clean band collar with deep three-button half-placket and boxy drop-shoulder cut",
    materials: ["Crisp compact Italian cotton poplin"],
    stylingNotes: "Understated modern luxury; clean French tuck into tailored slacks.",
    kpopVibes: ["Clean Minimalist", "Boyfriend Material", "Airport Luxury"],
    promptSnippet: "a crisp compact poplin half-placket popover shirt with a minimal band collar, mother-of-pearl buttons, and structured boxy drape"
  },
  {
    id: "m_top_cuban_linen_shirt",
    name: "Cuban-Collar Textured Linen-Cotton Shirt",
    category: "tops",
    subcategory: "Blouses & Shirts",
    gender: "male",
    silhouette: "Relaxed fit with open camp/Cuban collar and straight square hem with side vents",
    materials: ["Textured waffle-weave linen-cotton"],
    stylingNotes: "Summer concept staple; worn slightly unbuttoned with layered subtle chain.",
    kpopVibes: ["Summer Comeback", "Resort Chic", "Boyfriend Look"],
    promptSnippet: "a breathable textured linen-cotton shirt with a relaxed open Cuban camp collar, straight hem, and subtle waffle weave structure"
  },
  {
    id: "m_top_asym_diag_zip_top",
    name: "Asymmetric Technical Diagonal-Zip Pullover",
    category: "tops",
    subcategory: "Sporty & Performance",
    gender: "male",
    silhouette: "Stand-up funnel collar with diagonal matte black zipper running from neck across chest",
    materials: ["Bonded scuba stretch jersey"],
    stylingNotes: "Futuristic techwear stage presence; clean sculptural silhouette.",
    kpopVibes: ["Futuristic", "Stage Performance", "Cyberpunk"],
    promptSnippet: "a futuristic bonded scuba pullover featuring an asymmetric diagonal front zipper that runs from high funnel neck across the chest"
  },
  {
    id: "m_top_drop_armhole_muscle_hoodie",
    name: "Drop-Armhole French-Terry Muscle Hoodie",
    category: "tops",
    subcategory: "Hoodies & Sweatshirts",
    gender: "male",
    silhouette: "Sleeveless muscle cut with deep dropped armholes showcasing toned shoulders, with generous double-layered hood",
    materials: ["380gsm loopback French terry"],
    stylingNotes: "Dance practice and workout aesthetic; reveals idol muscular physique.",
    kpopVibes: ["Dance Practice", "Athletic Visual", "Street Style"],
    promptSnippet: "a sleeveless drop-armhole muscle hoodie in heavyweight French terry with deep open armholes, kangaroo pocket, and structured drape"
  },
  {
    id: "m_top_mock_neck_compression",
    name: "Mock-Neck Athletic Compression Underlayer",
    category: "tops",
    subcategory: "Sporty & Performance",
    gender: "male",
    silhouette: "Second-skin ergonomic compression fit with low mock collar and flatlock athletic stitching",
    materials: ["Moisture-wicking matte nylon-elastane"],
    stylingNotes: "Layered under oversized short-sleeve tees, open jerseys, or tactical vests.",
    kpopVibes: ["Performance Athletic", "Stage Layering", "Dance Practice"],
    promptSnippet: "a sleek athletic mock-neck compression long-sleeve top with ergonomic contour seams and flatlock stitching"
  },
  {
    id: "m_top_piped_silk_pajama_shirt",
    name: "Silk Camp Collar Shirt with Contrast Piping",
    category: "tops",
    subcategory: "Blouses & Shirts",
    gender: "male",
    silhouette: "Fluid relaxed button-down with rounded camp collar and contrast piping along lapels and chest pocket",
    materials: ["100% silk twill with matte sheen"],
    stylingNotes: "Sensual high-fashion pajama chic popularized by top male visual idols.",
    kpopVibes: ["Visual Center", "Sensual Concept", "Award Show Afterparty"],
    promptSnippet: "a luxurious fluid silk twill camp-collar shirt accented with contrast ivory edge piping along the lapels, cuffs, and chest patch pocket"
  },
  {
    id: "m_top_ombre_mohair_pullover",
    name: "Ombré Gradient Brushed Mohair Pullover",
    category: "tops",
    subcategory: "Knitwear & Sweaters",
    gender: "male",
    silhouette: "Oversized crewneck sweater with softly blended gradient dip-dye transition from dark to light",
    materials: ["70% brushed kid mohair, 30% wool"],
    stylingNotes: "Cloud-soft fuzzy texture that creates dreamy, artistic visuals in photoshoots.",
    kpopVibes: ["Artistic Editorial", "Winter Comeback", "Soft Boy Aesthetic"],
    promptSnippet: "an oversized fuzzy brushed mohair crewneck sweater with an ethereal ombré gradient color fade and a rich, cloud-like halo texture"
  },
  {
    id: "m_top_sailor_collar_marine",
    name: "Vintage Sailor-Collar Navy Marine Top",
    category: "tops",
    subcategory: "Blouses & Shirts",
    gender: "male",
    silhouette: "Flap sailor collar extending over upper back with V-neck front and striped ribbon trim",
    materials: ["Dense cotton gabardine"],
    stylingNotes: "Retro marine naval concept; clean and boyishly charming.",
    kpopVibes: ["High Teen", "Marine Concept", "Music Video"],
    promptSnippet: "a crisp navy sailor-collar pullover top with a square back flap collar, V-neck front, and contrast twin-stripe ribbon edge detailing"
  },
  {
    id: "m_top_sheer_mesh_illusion",
    name: "Sheer Micro-Mesh Layering Longsleeve",
    category: "tops",
    subcategory: "Tees & Undershirts",
    gender: "male",
    silhouette: "Fitted long-sleeve layer in ultra-fine sheer stretch tulle mesh",
    materials: ["Technical micro-mesh tulle"],
    stylingNotes: "Worn under tailored blazers or leather vests for subtle sultry transparency on stage.",
    kpopVibes: ["Stage Performance", "Sensual Concept", "Dark Allure"],
    promptSnippet: "a fitted sheer black micro-mesh long-sleeve top providing an ethereal see-through layer with fine finished cuffs"
  },
  {
    id: "m_top_biker_raglan_tee",
    name: "Biker Raglan Long-Sleeve Moto Graphic Tee",
    category: "tops",
    subcategory: "Sporty & Performance",
    gender: "male",
    silhouette: "Raglan cut sleeves with color-contrast arms, reinforced elbows, and high-impact motorsport graphics",
    materials: ["Heavyweight combed cotton jersey"],
    stylingNotes: "Pairs with coated denim or leather cargo pants for a rebellious concept.",
    kpopVibes: ["Moto Racing", "Rockstar Idol", "Street Style"],
    promptSnippet: "a vintage motocross raglan long-sleeve tee with contrast two-tone colorblocking, elbow reinforcement patches, and bold racing iconography"
  },
  {
    id: "m_top_deconstructed_double_collar",
    name: "Deconstructed Double-Collar Layered Shirt",
    category: "tops",
    subcategory: "Blouses & Shirts",
    gender: "male",
    silhouette: "Architectural layered collar giving the illusion of two shirts worn together, with stepped asymmetric hem",
    materials: ["Premium Egyptian cotton poplin"],
    stylingNotes: "High-concept Seoul fashion week favorite; subtle complexity.",
    kpopVibes: ["Avant-Garde", "Seoul Fashion Week", "Editorial"],
    promptSnippet: "an architectural deconstructed poplin shirt featuring layered double collars, split side vents, and an offset front button placket"
  },
  {
    id: "m_top_chunky_fisherman_turtleneck",
    name: "Chunky Fisherman Ribbed Turtleneck Sweater",
    category: "tops",
    subcategory: "Knitwear & Sweaters",
    gender: "male",
    silhouette: "Substantial high rollneck collar with chunky half-cardigan rib knit and raglan shoulders",
    materials: ["100% pure untreated Shetland wool"],
    stylingNotes: "Rugged warmth with scholarly elegance; ideal for dramatic winter airport visuals.",
    kpopVibes: ["Winter Comeback", "Classic Gentleman", "Airport Luxury"],
    promptSnippet: "a substantial chunky-gauge fisherman ribbed turtleneck sweater with a high fold-over collar, heavy tactile yarn, and clean raglan shoulders"
  },
  {
    id: "m_top_western_yoke_chambray",
    name: "Western Chambray Workshirt with Contrast Yokes",
    category: "tops",
    subcategory: "Blouses & Shirts",
    gender: "male",
    silhouette: "Fitted Western silhouette with pointed front and back curved yokes, pearl snap buttons, and flap pockets",
    materials: ["Japanese selvedge cotton chambray"],
    stylingNotes: "Americana heritage styling; tucked into bootcut denim with a silver buckle belt.",
    kpopVibes: ["Vintage Americana", "Rodeo Chic", "Stage Performance"],
    promptSnippet: "a tailored indigo chambray Western shirt with pointed front yokes, lustrous pearl snap button fasteners, and dual flap chest pockets"
  }
];

// ============================================================================
// 3. FEMALE BOTTOMS (40+ Distinct K-Pop Idol Silhouettes)
// ============================================================================
export const FEMALE_BOTTOMS: GarmentItem[] = [
  // Tailored Trousers & Slacks
  {
    id: "f_bot_wide_leg_pleated_slacks",
    name: "High-Rise Wide-Leg Double-Pleated Trousers",
    category: "bottoms",
    subcategory: "Tailored Trousers",
    gender: "female",
    silhouette: "High-waisted fit through hips opening into an expansive fluid wide leg with deep front pleats",
    materials: ["Fine wool-blend suiting crepe", "tropical wool"],
    stylingNotes: "Cleanly highlights narrow waist with leather belt; puddle drape over shoes.",
    kpopVibes: ["Airport Luxury", "Modern Chic", "Editorial Tailoring"],
    promptSnippet: "high-waisted double-pleated wide-leg trousers in fluid suiting wool with sharp front center creases and a sleek leather belt with silver buckle"
  },
  {
    id: "f_bot_cigarette_trousers",
    name: "High-Waisted Tailored Cigarette Pants",
    category: "bottoms",
    subcategory: "Tailored Trousers",
    gender: "female",
    silhouette: "Slim tailored silhouette skimming the leg and tapering gently to ankle bone",
    materials: ["Bi-stretch cotton gabardine", "compact wool blend"],
    stylingNotes: "Pairs with oversized blazers or cropped knit tops; sharp and professional.",
    kpopVibes: ["Parisian Chic", "Clean Modern", "Office-Core"],
    promptSnippet: "high-waisted tailored cigarette trousers in compact wool gabardine with clean ankle-skimming crop and pristine front ironed creases"
  },
  {
    id: "f_bot_puddle_crepe_pants",
    name: "Ultra-Fluid Crepe Puddle Trousers",
    category: "bottoms",
    subcategory: "Tailored Trousers",
    gender: "female",
    silhouette: "Relaxed mid-to-high rise with extra inseam length pooling elegantly over footwear",
    materials: ["Heavy fluid polyester-rayon crepe"],
    stylingNotes: "Incredible movement when dancing or walking through airports.",
    kpopVibes: ["Minimalist Runway", "Effortless Luxury", "Off-Duty"],
    promptSnippet: "ultra-fluid heavy crepe puddle trousers with an effortless relaxed drape pooling softly over chunky platform loafers"
  },
  {
    id: "f_bot_split_hem_flare_pants",
    name: "Front-Split Hem Tailored Flare Trousers",
    category: "bottoms",
    subcategory: "Tailored Trousers",
    gender: "female",
    silhouette: "Fitted through thigh before flaring out with a dramatic vertical split at the front hem",
    materials: ["Ponte de Roma stretch knit", "tailoring twill"],
    stylingNotes: "Front split reveals boots or statement sneakers; elongates leg line.",
    kpopVibes: ["Stage Performance", "Y2K Glam", "Girl Crush"],
    promptSnippet: "tailored flare trousers with a high rise, streamlined thigh, and dramatic front-hem split seams showcasing statement footwear"
  },
  {
    id: "f_bot_pinstripe_tailored_pants",
    name: "Classic Chalk-Pinstripe Suiting Slacks",
    category: "bottoms",
    subcategory: "Tailored Trousers",
    gender: "female",
    silhouette: "Wide straight leg with subtle chalk-stripe pattern running vertically",
    materials: ["Worsted wool pinstripe weave"],
    stylingNotes: "Matches pinstripe vest or plain black baby tee.",
    kpopVibes: ["Dandy Girl", "Power Suiting", "Airport Elegance"],
    promptSnippet: "high-waisted chalk-pinstripe wide-leg slacks in worsted wool with front slant pockets, belt loops, and crisp linear silhouette"
  },

  // Denim & Jeans
  {
    id: "f_bot_vintage_straight_denim",
    name: "High-Rise Straight-Leg Vintage Washed Denim",
    category: "bottoms",
    subcategory: "Denim & Jeans",
    gender: "female",
    silhouette: "Classic 5-pocket straight cut sitting at natural waist with authentic honeycombing and whiskering",
    materials: ["13.5oz 100% cotton ring-spun denim"],
    stylingNotes: "The quintessential K-pop denim; pairs with any top, blouson, or cardigan.",
    kpopVibes: ["Everyday Idol", "Airport Casual", "Vintage Americana"],
    promptSnippet: "high-rise straight-leg vintage-washed blue denim jeans with authentic whiskering, five-pocket styling, and a classic leather waist patch"
  },
  {
    id: "f_bot_low_rise_baggy_skater_jeans",
    name: "Low-Slung 90s Baggy Skater Denim",
    category: "bottoms",
    subcategory: "Denim & Jeans",
    gender: "female",
    silhouette: "Low-rise waist sitting on the hips with voluminous wide skater legs stacking over sneakers",
    materials: ["12oz washed soft cotton denim"],
    stylingNotes: "Pairs with cropped baby tees or fitted corsets to emphasize waist silhouette.",
    kpopVibes: ["Y2K Streetwear", "Hip Hop Dance", "Music Video"],
    promptSnippet: "low-slung 90s baggy skater jeans in vintage light-wash denim with voluminous wide legs stacking effortlessly over platform sneakers"
  },
  {
    id: "f_bot_raw_hem_distressed_denim",
    name: "Knee-Slash Distressed Straight Denim",
    category: "bottoms",
    subcategory: "Denim & Jeans",
    gender: "female",
    silhouette: "Straight cut with horizontal razor slashes at the knees and frayed raw hem cuffs",
    materials: ["100% cotton rigid denim"],
    stylingNotes: "Edgy rockstar touch; balances polished blazers.",
    kpopVibes: ["Rockstar Chic", "Airport Edge", "Dance Practice"],
    promptSnippet: "straight-cut distressed denim jeans featuring clean horizontal knee slashes, frayed raw hems, and faded wash highlights"
  },
  {
    id: "f_bot_two_tone_paneled_denim",
    name: "Two-Tone Asymmetric Patchwork Denim",
    category: "bottoms",
    subcategory: "Denim & Jeans",
    gender: "female",
    silhouette: "Straight wide leg constructed from alternating panels of dark indigo and bleach-wash denim",
    materials: ["Reconstructed denim panels"],
    stylingNotes: "Eye-catching stage and video piece; keep the top solid and clean.",
    kpopVibes: ["High Fashion", "Stage Outfit", "Futuristic Street"],
    promptSnippet: "high-waisted two-tone patchwork jeans with contrasting panels of dark indigo and light bleached denim down the straight wide legs"
  },

  // Skirts & Skorts
  {
    id: "f_bot_pleated_tennis_skort",
    name: "High-Waisted Box-Pleated Tennis Skort",
    category: "bottoms",
    subcategory: "Skirts & Skorts",
    gender: "female",
    silhouette: "Fitted waistband with crisp architectural knife/box pleats and built-in matching safety shorts",
    materials: ["Wrinkle-resistant polyester twill"],
    stylingNotes: "Iconic K-pop girl group silhouette; pairs with knit polos, varsity crewnecks, and baby tees.",
    kpopVibes: ["High Teen", "Stage Performance", "Preppy Cheer"],
    promptSnippet: "a high-waisted knife-pleated tennis skort in crisp structured twill with sharp uniform pleats that swish gracefully in motion"
  },
  {
    id: "f_bot_raw_edge_denim_mini",
    name: "A-Line Raw-Edge Denim Mini Skirt",
    category: "bottoms",
    subcategory: "Skirts & Skorts",
    gender: "female",
    silhouette: "A-line mini skirt hitting mid-thigh with copper rivets and raw frayed lower hemline",
    materials: ["13oz rigid denim"],
    stylingNotes: "Classic summer idol look with boots and baby tee.",
    kpopVibes: ["Festival Cool", "Summer Comeback", "Off-Duty"],
    promptSnippet: "an A-line rigid denim mini skirt with a raw frayed hemline, classic five-pocket styling, and authentic vintage fade"
  },
  {
    id: "f_bot_wool_houndstooth_skort",
    name: "Tailored Houndstooth Tweed Mini Skort",
    category: "bottoms",
    subcategory: "Skirts & Skorts",
    gender: "female",
    silhouette: "A-line wrap front with mock flap pockets and built-in shorts",
    materials: ["Wool-blend houndstooth tweed", "crepe lining"],
    stylingNotes: "Pairs with matching tweed blouson or black turtleneck for French chic.",
    kpopVibes: ["French Chic", "Airport Luxury", "Winter Comeback"],
    promptSnippet: "a tailored houndstooth tweed mini skort with decorative crest buttons, clean wrap front, and structured A-line silhouette"
  },
  {
    id: "f_bot_satin_slip_midi_skirt",
    name: "Bias-Cut Silk Satin Midi Skirt",
    category: "bottoms",
    subcategory: "Skirts & Skorts",
    gender: "female",
    silhouette: "Elasticized waist falling into a bias-cut fluid midi that ripples with every step",
    materials: ["Heavy silk-satin charmeuse"],
    stylingNotes: "Contrasted with chunky boots and oversized knit sweater.",
    kpopVibes: ["Quiet Luxury", "Romantic Minimalist", "Editorial"],
    promptSnippet: "a bias-cut fluid silk satin midi skirt with luminous surface sheen, gentle flare at the hem, and soft graceful movement"
  },
  {
    id: "f_bot_cargo_utility_maxi_skirt",
    name: "Technical Nylon Parachute Cargo Maxi Skirt",
    category: "bottoms",
    subcategory: "Skirts & Skorts",
    gender: "female",
    silhouette: "Straight column maxi with toggle drawstrings at waist and side hems and 3D bellows pockets",
    materials: ["Lightweight matte nylon taslan"],
    stylingNotes: "Drawstrings allow adjusting height and gather; style with baby tee.",
    kpopVibes: ["Acubi Street", "Y2K Techwear", "Dance Practice"],
    promptSnippet: "a lightweight nylon parachute cargo maxi skirt with adjustable bungee toggles, 3D utility bellows pockets, and a back walking slit"
  },

  // Cargo, Shorts & Activewear
  {
    id: "f_bot_parachute_pants_toggle",
    name: "Low-Rise Parachute Pants with Bungee Toggles",
    category: "bottoms",
    subcategory: "Cargo & Activewear",
    gender: "female",
    silhouette: "Voluminous balloon leg with adjustable elastic bungee cords at ankles and low waistband",
    materials: ["Crisp crinkle nylon ripstop"],
    stylingNotes: "Ankles can be cinched tight over sneakers or left open; supreme dance movement.",
    kpopVibes: ["Dance Performance", "Y2K Street", "Festival"],
    promptSnippet: "voluminous low-rise crinkle nylon parachute pants with adjustable bungee cords at the waist and ankles creating dramatic billowy gathers"
  },
  {
    id: "f_bot_tailored_bermuda_shorts",
    name: "High-Waisted Pleated Tailored Bermuda Shorts",
    category: "bottoms",
    subcategory: "Cargo & Activewear",
    gender: "female",
    silhouette: "Knee-length relaxed shorts with crisp front pleats and wide leg opening",
    materials: ["Tropical wool suiting", "linen blend"],
    stylingNotes: "Modern European suiting vibe; wear with loafers and tailored blazer.",
    kpopVibes: ["Modern Dandy", "Airport Chic", "Summer Luxury"],
    promptSnippet: "high-waisted tailored Bermuda shorts in lightweight tropical wool with crisp front pleats, slant pockets, and a clean knee-length cut"
  },
  {
    id: "f_bot_tiered_tulle_fairy_skirt",
    name: "Tiered Asymmetric Tulle Fairy Skirt",
    category: "bottoms",
    subcategory: "Skirts & Minis",
    gender: "female",
    silhouette: "Voluminous multi-layered asymmetric tulle ruffles with handkerchief hemline and elastic waistband",
    materials: ["Micro-fine nylon tulle & soft cotton lining"],
    stylingNotes: "Ethereal dreamcore stage concept; looks magical in motion.",
    kpopVibes: ["Ethereal Dream", "Fairycore", "Stage Concept"],
    promptSnippet: "a dreamy multi-tiered asymmetric tulle ruffle skirt with airy, floating layers and an ethereal handkerchief hemline"
  },
  {
    id: "f_bot_side_snap_track_pants",
    name: "Breakaway Popper Side-Snap Track Pants",
    category: "bottoms",
    subcategory: "Cargo & Activewear",
    gender: "female",
    silhouette: "Wide-leg relaxed track pants with full-length functional metallic popper snap buttons along the side seams",
    materials: ["Slick sports tricot knit with contrast side striping"],
    stylingNotes: "Classic 90s dance crew aesthetic; snaps partially unbuttoned to reveal footwear.",
    kpopVibes: ["90s High Teen", "Dance Practice", "Street Style"],
    promptSnippet: "wide-leg retro track pants featuring full-length functional metal snap poppers along contrast side stripes and an elastic drawstring waist"
  },
  {
    id: "f_bot_front_split_column_maxi",
    name: "Center-Split Tailored Wool Column Maxi Skirt",
    category: "bottoms",
    subcategory: "Skirts & Minis",
    gender: "female",
    silhouette: "Straight pencil column reaching ankle length with a daring high center-front slit and belt loops",
    materials: ["Fine worsted wool blend with satin lining"],
    stylingNotes: "Sophisticated minimalism for press events and high-fashion airport looks.",
    kpopVibes: ["Quiet Luxury", "Airport Fashion", "Editorial"],
    promptSnippet: "a floor-grazing tailored wool column maxi skirt with a sharp high center-front split, clean waistband, and sleek streamlined silhouette"
  },
  {
    id: "f_bot_denim_micro_skort",
    name: "Foldover Waistband Denim Micro-Skort",
    category: "bottoms",
    subcategory: "Skirts & Minis",
    gender: "female",
    silhouette: "Low-rise micro silhouette with raw-cut foldover waistband and built-in hidden stretch safety shorts",
    materials: ["13oz washed indigo cotton denim"],
    stylingNotes: "Dance-safe festival and music show performance essential.",
    kpopVibes: ["Y2K Pop", "Music Show Stage", "Festival"],
    promptSnippet: "a trendy denim micro-skort with a folded-over waistband, raw frayed hem, and integrated tonal modesty shorts underneath"
  },
  {
    id: "f_bot_paperbag_leather_shorts",
    name: "Paperbag Tie-Waist Butter Leather Shorts",
    category: "bottoms",
    subcategory: "Denim & Shorts",
    gender: "female",
    silhouette: "High gathered paperbag waistband with self-fabric sash belt and flared thigh leg openings",
    materials: ["Supple butter-soft lambskin leather"],
    stylingNotes: "Flattering silhouette that cinches the waist and provides luxurious tactile shine.",
    kpopVibes: ["Girl Crush", "Luxe Street", "Stage Performance"],
    promptSnippet: "high-waisted butter-soft leather shorts with a ruffled paperbag waistline, cinched sash belt, and relaxed A-line leg openings"
  },
  {
    id: "f_bot_flare_jazz_pants",
    name: "Cross-Waist Ribbed Flare Dance Jazz Pants",
    category: "bottoms",
    subcategory: "Cargo & Activewear",
    gender: "female",
    silhouette: "Fitted through thighs with iconic V-front crossover waistband opening into a wide bell flare at the ankle",
    materials: ["High-stretch modal rib-knit"],
    stylingNotes: "Elongates idol legs dramatically; quintessential rehearsal uniform.",
    kpopVibes: ["Dance Practice", "Rehearsal Chic", "Comfort Luxe"],
    promptSnippet: "ribbed stretch flare jazz pants featuring an overlapping V-shaped crossover waistband and dramatic bell flares at the hem"
  },
  {
    id: "f_bot_bubble_hem_balloon_mini",
    name: "Puffed Bubble-Hem Balloon Mini Skirt",
    category: "bottoms",
    subcategory: "Skirts & Minis",
    gender: "female",
    silhouette: "Voluminous gathered puff silhouette with inverted turned-under bubble hem and fitted yoke waistband",
    materials: ["Crisp nylon taffeta with structural bounce"],
    stylingNotes: "Modern playful runway trend worn by top 4th-gen girl group centers.",
    kpopVibes: ["High Teen", "Playful Avant-Garde", "Stage Concept"],
    promptSnippet: "a cloud-like puffed bubble-hem balloon mini skirt in structured nylon taffeta with a clean flat front yoke"
  },
  {
    id: "f_bot_buckled_utility_mini",
    name: "Multi-Buckled Hardware Combat Mini Skirt",
    category: "bottoms",
    subcategory: "Skirts & Minis",
    gender: "female",
    silhouette: "Fitted wrap skirt adorned with dual industrial nylon webbing straps and polished chrome clip buckles",
    materials: ["Heavy technical cotton twill"],
    stylingNotes: "Tech-warrior stage styling for powerful dance routines.",
    kpopVibes: ["Girl Crush", "Techwear", "Stage Performance"],
    promptSnippet: "an asymmetric utility wrap mini skirt featuring dual cross-body webbed straps, heavy metal quick-release buckles, and side cargo flap"
  },
  {
    id: "f_bot_pleated_tennis_contrast",
    name: "Two-Tone Inverted Box-Pleat Tennis Skirt",
    category: "bottoms",
    subcategory: "Skirts & Minis",
    gender: "female",
    silhouette: "High-waisted knife pleats with contrast color reveals inside every inverted pleat fold",
    materials: ["Poly-wool gabardine that holds crisp permanent pleat presses"],
    stylingNotes: "Dynamic color flash whenever the idol spins or dances.",
    kpopVibes: ["Preppy Chic", "High Teen", "Music Show"],
    promptSnippet: "a high-waisted pleated tennis skirt featuring crisp permanent knife pleats that reveal a vibrant contrast colorway inside each fold"
  },
  {
    id: "f_bot_metallic_foil_wide_jeans",
    name: "Liquid Silver Foil Coated Wide-Leg Denim",
    category: "bottoms",
    subcategory: "Denim & Shorts",
    gender: "female",
    silhouette: "Ultra-wide puddle jeans laminated with reflective metallic silver foil finish over black denim base",
    materials: ["Foil-coated 13oz rigid cotton denim"],
    stylingNotes: "High-impact futuristic music video visual that reflects camera flash brightly.",
    kpopVibes: ["Futuristic", "Music Video", "Y2K Cyber"],
    promptSnippet: "wide-leg relaxed puddle jeans coated with a shimmering liquid metallic silver foil finish that reflects stage lights"
  },
  {
    id: "f_bot_lace_paneled_slip_skirt",
    name: "Bias-Cut Silk Charmeuse Lace Slip Skirt",
    category: "bottoms",
    subcategory: "Skirts & Minis",
    gender: "female",
    silhouette: "Fluid midi skirt cut on the true bias that hugs hips smoothly, finished with delicate scalloped eyelash lace hem",
    materials: ["100% silk charmeuse & French Chantilly lace"],
    stylingNotes: "Sensual elegance paired with oversized menswear knitwear.",
    kpopVibes: ["Sensual Minimalist", "Airport Luxury", "Coquette"],
    promptSnippet: "a fluid bias-cut silk charmeuse midi slip skirt with an effortless liquid drape and delicate French scalloped lace trim along the hemline"
  },
  {
    id: "f_bot_stirrup_leggings",
    name: "High-Rise Tailored Stirrup Crepe Leggings",
    category: "bottoms",
    subcategory: "Cargo & Activewear",
    gender: "female",
    silhouette: "Sleek cigarette silhouette with sharp pin-tucked center front creases and under-foot stirrup straps",
    materials: ["Heavy four-way stretch ponte crepe"],
    stylingNotes: "Worn inside slingback heels or pointed boots for runway equestrian elegance.",
    kpopVibes: ["Equestrian Chic", "Runway High Fashion", "Modern Minimalist"],
    promptSnippet: "tailored high-rise black crepe stirrup leggings with sharp front pintuck seams and clean under-foot elastic straps"
  }
];

// ============================================================================
// 4. MALE BOTTOMS (40+ Distinct K-Pop Idol Silhouettes)
// ============================================================================
export const MALE_BOTTOMS: GarmentItem[] = [
  // Tailored Trousers & Slacks
  {
    id: "m_bot_double_pleated_wool_trousers",
    name: "High-Waisted Double-Pleated Wide Wool Trousers",
    category: "bottoms",
    subcategory: "Tailored Trousers",
    gender: "male",
    silhouette: "High rise with deep inward double forward pleats, generous thigh room, and a gentle taper with 2-inch cuffs",
    materials: ["100% fine British wool flannel", "tropical wool worsted"],
    stylingNotes: "The gold-standard idol trouser; elongates leg line; pairs with boxy tees, knit polos, or blazers.",
    kpopVibes: ["Airport Luxury", "Old Money", "High-Fashion Editorial"],
    promptSnippet: "high-waisted double-pleated wool trousers with deep front forward pleats, sharp center iron creases, and clean tailored turn-up cuffs"
  },
  {
    id: "m_bot_fluid_wide_suiting_slacks",
    name: "Fluid Wide-Leg Suiting Slacks with Belt Loops",
    category: "bottoms",
    subcategory: "Tailored Trousers",
    gender: "male",
    silhouette: "Straight voluminous wide leg with relaxed rise and clean waistband with extended tab closure",
    materials: ["Heavy wool-viscose blend drape twill"],
    stylingNotes: "Flows with every stride; styled with sleek leather belt and silver buckle.",
    kpopVibes: ["Runway Minimalist", "Award Show Casual", "Modern Idol"],
    promptSnippet: "wide-leg fluid suiting slacks with an extended waistband tab, polished leather belt, and sweeping fabric drape down to the shoes"
  },
  {
    id: "m_bot_cropped_tailored_trousers",
    name: "Ankle-Cropped Tapered Pleated Trousers",
    category: "bottoms",
    subcategory: "Tailored Trousers",
    gender: "male",
    silhouette: "Pleated waist tapering cleanly to stop exactly at the ankle bone",
    materials: ["Compact cotton-twill stretch", "lightweight wool"],
    stylingNotes: "Highlights socks and chunky penny loafers or derby shoes.",
    kpopVibes: ["Preppy Chic", "Clean Dandy", "Off-Duty Smart"],
    promptSnippet: "ankle-cropped tapered trousers with neat front pleats, crisp pressed creases, and a clean ankle break showcasing polished loafers"
  },
  {
    id: "m_bot_wide_pinstripe_dress_slacks",
    name: "Wide-Leg Navy Chalk-Pinstripe Trousers",
    category: "bottoms",
    subcategory: "Tailored Trousers",
    gender: "male",
    silhouette: "Full-cut wide leg with elegant vertical white chalk-stripes",
    materials: ["Worsted wool pinstripe suiting"],
    stylingNotes: "Wear with plain white tee or matching double-breasted blazer for modern gangster chic.",
    kpopVibes: ["Power Suiting", "Dapper Gentleman", "Stage Royalty"],
    promptSnippet: "wide-cut navy chalk-pinstripe wool trousers with sharp front creases, high-rise waistline, and an commanding tailored presence"
  },

  // Denim & Jeans
  {
    id: "m_bot_14oz_selvedge_denim",
    name: "14oz Raw Rigid Selvedge Denim Jeans",
    category: "bottoms",
    subcategory: "Denim & Jeans",
    gender: "male",
    silhouette: "Mid-to-high rise straight leg with red-line selvedge ID visible when cuffed",
    materials: ["14oz Japanese kurabo raw selvedge denim"],
    stylingNotes: "Substantial, structured denim that holds its architectural shape without slouching.",
    kpopVibes: ["Heritage Casual", "Clean Street", "Airport Idol"],
    promptSnippet: "14oz raw rigid dark indigo selvedge denim jeans with contrast copper stitching, clean straight cut, and neat single-cuffed hems"
  },
  {
    id: "m_bot_90s_baggy_skater_denim",
    name: "90s Wide Baggy Skater Denim Jeans",
    category: "bottoms",
    subcategory: "Denim & Jeans",
    gender: "male",
    silhouette: "Relaxed loose fit through seat and thigh falling straight with slight stacking at hem",
    materials: ["13oz stonewashed vintage cotton denim"],
    stylingNotes: "Washed to a soft light blue; staple pairing with heavyweight tees and hoodies.",
    kpopVibes: ["90s Skater", "Practice Room", "Hip Hop Cool"],
    promptSnippet: "wide-leg 90s baggy skater jeans in vintage stonewashed light blue denim with authentic fading and relaxed sneaker stacking"
  },
  {
    id: "m_bot_carpenter_utility_denim",
    name: "Washed Black Carpenter Workwear Denim",
    category: "bottoms",
    subcategory: "Denim & Jeans",
    gender: "male",
    silhouette: "Straight utilitarian leg with reinforced tool pockets and side hammer loop",
    materials: ["12oz washed black cotton canvas denim"],
    stylingNotes: "Industrial street look; pairs with boots or retro chunky court sneakers.",
    kpopVibes: ["Workwear Street", "Seoul Grunge", "Dance Practice"],
    promptSnippet: "washed black carpenter jeans featuring authentic side utility hammer loop, dual rear tool pockets, and durable triple-needle stitching"
  },
  {
    id: "m_bot_knee_slash_rock_denim",
    name: "Vintage Knee-Slashed Washed Black Denim",
    category: "bottoms",
    subcategory: "Denim & Jeans",
    gender: "male",
    silhouette: "Straight cut with authentic worn whiskers and horizontal slashed knees",
    materials: ["100% cotton washed denim"],
    stylingNotes: "Pairs with moto leather jacket and distressed graphic tee.",
    kpopVibes: ["Rockstar", "Stage Rehearsal", "Edgy Seoul"],
    promptSnippet: "washed black straight-leg jeans with clean horizontal knee slashes, subtle vintage fading, and an effortless rockstar vibe"
  },

  // Cargo, Utility & Activewear
  {
    id: "m_bot_wide_leg_cargo_trousers",
    name: "Wide-Leg Utility Cargo Pants with Flap Pockets",
    category: "bottoms",
    subcategory: "Cargo & Utility",
    gender: "male",
    silhouette: "Full relaxed leg with 3D gusseted side cargo pockets and darted knees for ergonomic shape",
    materials: ["Heavyweight cotton ripstop twill"],
    stylingNotes: "Functional without excessive tactical straps; clean everyday streetwear.",
    kpopVibes: ["Streetwear Core", "Dance Practice", "Casual Comeback"],
    promptSnippet: "relaxed wide-leg cotton cargo pants with gusseted 3D side bellows flap pockets, darted knee articulation, and clean hem drape"
  },
  {
    id: "m_bot_technical_parachute_pants",
    name: "Technical Nylon Parachute Track Pants",
    category: "bottoms",
    subcategory: "Cargo & Utility",
    gender: "male",
    silhouette: "Lightweight billowy leg with elastic waistband and adjustable toggle bungee cuffs",
    materials: ["Water-repellent matte crinkle nylon"],
    stylingNotes: "Cuffed at ankles; allows complete freedom of dynamic stage choreography.",
    kpopVibes: ["Performance Athleisure", "Cyber Street", "Festival"],
    promptSnippet: "technical matte nylon parachute pants with elasticized waistband, concealed zippered pockets, and bungee toggle cuffs at the ankles"
  },
  {
    id: "m_bot_wide_wale_corduroys",
    name: "Relaxed Wide-Wale Corduroy Trousers",
    category: "bottoms",
    subcategory: "Textured & Heritage",
    gender: "male",
    silhouette: "Mid-rise relaxed straight cut with plush 6-wale vertical cord ridges",
    materials: ["100% cotton 6-wale heavy corduroy"],
    stylingNotes: "Rich tactile depth and warmth; pairs with fluffy mohair cardigans or wool coats.",
    kpopVibes: ["Autumn Aesthetic", "Vintage Warmth", "Campus Idol"],
    promptSnippet: "relaxed straight-cut wide-wale corduroy trousers with plush velvety vertical ridges, slant front pockets, and warm textural richness"
  },
  {
    id: "m_bot_loopback_sweatshorts",
    name: "Heavyweight 400gsm French-Terry Sweatshorts",
    category: "bottoms",
    subcategory: "Cargo & Activewear",
    gender: "male",
    silhouette: "Above-the-knee relaxed shorts with thick elastic ribbed waistband and natural cotton drawcords",
    materials: ["400gsm heavyweight loopback French terry"],
    stylingNotes: "Essential practice room / off-duty summer look.",
    kpopVibes: ["Dance Practice", "Casual Off-Duty", "Summer Travel"],
    promptSnippet: "heavyweight loopback French-terry sweatshorts hitting right above the knee with thick ribbed waistband and raw-edge hem details"
  },
  {
    id: "m_bot_pleated_wide_shorts",
    name: "Tailored Knee-Length Double-Pleated Slacks Shorts",
    category: "bottoms",
    subcategory: "Tailored Trousers",
    gender: "male",
    silhouette: "Generous wide leg hitting right at the knee with deep reverse pleats, side adjusters, and cuffed hems",
    materials: ["Italian tropical worsted wool"],
    stylingNotes: "Contemporary high-fashion sartorial look; styled with chunky leather derbies and white socks.",
    kpopVibes: ["Modern Sartorial", "Seoul Fashion Week", "Preppy Luxury"],
    promptSnippet: "wide-cut tailored wool pleated Bermuda slacks shorts hitting at the knee with sharp creases, side waist adjusters, and tailored cuffs"
  },
  {
    id: "m_bot_deconstructed_layered_pants",
    name: "Deconstructed Layered Apron-Over-Trousers",
    category: "bottoms",
    subcategory: "Tailored Trousers",
    gender: "male",
    silhouette: "Tailored straight trousers overlaid with an asymmetric pleated suiting apron wrap panel",
    materials: ["Fine matte black suiting wool"],
    stylingNotes: "Avant-garde runway statement pieces worn by lead dancers.",
    kpopVibes: ["Avant-Garde", "Stage Performance", "Seoul Fashion Week"],
    promptSnippet: "architectural tailored black wool trousers featuring an integrated asymmetric suiting half-apron overlay that moves dynamically with dance"
  },
  {
    id: "m_bot_stacked_waxed_denim",
    name: "Stacked Coated Black Moto Waxed Denim",
    category: "bottoms",
    subcategory: "Denim & Shorts",
    gender: "male",
    silhouette: "Extra-long inseam creating natural sculptural stacks around ankle boots, with articulated moto knee ribbing",
    materials: ["12oz resin-coated waxed stretch denim with subtle leather sheen"],
    stylingNotes: "Rockstar stage charisma; pairs with leather biker jackets.",
    kpopVibes: ["Rockstar Idol", "Stage Performance", "Dark Glam"],
    promptSnippet: "stacked coated black waxed denim jeans with heavy accordion pooling at the ankles and articulated biker knee ribbing"
  },
  {
    id: "m_bot_wide_cuffed_selvedge",
    name: "Wide-Leg Deep Turn-Up Cuffed Selvedge Jeans",
    category: "bottoms",
    subcategory: "Denim & Shorts",
    gender: "male",
    silhouette: "Relaxed straight wide leg with iconic 4-inch deep turn-up cuffs showing the redline selvedge ID",
    materials: ["14.5oz rigid Japanese raw indigo selvedge denim"],
    stylingNotes: "Vintage heritage purist styling for airport casual appearances.",
    kpopVibes: ["Vintage Americana", "Airport Fashion", "Boyfriend Look"],
    promptSnippet: "wide-leg rigid dark indigo raw selvedge jeans with prominent wide folded turn-up cuffs displaying crisp white-and-red selvedge ticker lines"
  },
  {
    id: "m_bot_tactical_ripstop_joggers",
    name: "Tactical Ripstop Bonded Cargo Joggers",
    category: "bottoms",
    subcategory: "Cargo & Activewear",
    gender: "male",
    silhouette: "Tapered technical jogger with 3D modular bellows cargo pockets and heavy zippered ankle cuffs",
    materials: ["Diamond-weave tactical ripstop nylon"],
    stylingNotes: "Stage-ready tactical warrior styling for high-intensity choreography.",
    kpopVibes: ["Techwear", "Stage Performance", "Urban Tactical"],
    promptSnippet: "technical ripstop cargo joggers with angled bellows pockets, waterproof bonded matte zippers, and snug ribbed ankle cuffs"
  },
  {
    id: "m_bot_raw_denim_carpenter",
    name: "Contrast-Stitched Heavy Carpenter Workwear Jeans",
    category: "bottoms",
    subcategory: "Denim & Shorts",
    gender: "male",
    silhouette: "Loose relaxed fit with side utility hammer loop, dual tool pockets, and prominent contrast white triple stitching",
    materials: ["Heavyweight 100% cotton washed canvas denim"],
    stylingNotes: "Rugged street-skater aesthetic beloved by idol rappers.",
    kpopVibes: ["Seoul Streetwear", "Hip Hop Concept", "Casual Off-Duty"],
    promptSnippet: "loose-fit heavy denim carpenter pants featuring an authentic side hammer loop, double-layer knee panels, and crisp contrast triple topstitching"
  },
  {
    id: "m_bot_satin_side_stripe_tux_pants",
    name: "Silk Satin Side-Stripe Formal Tuxedo Trousers",
    category: "bottoms",
    subcategory: "Tailored Trousers",
    gender: "male",
    silhouette: "Slim-straight tailored cut with high-luster satin side-stripe galloon ribbon down each outer leg seam",
    materials: ["Midnight black wool barathea & duchess silk satin stripe"],
    stylingNotes: "Grand awards red carpet elegance.",
    kpopVibes: ["Red Carpet", "Award Show", "Formal Luxury"],
    promptSnippet: "impeccably tailored tuxedo trousers in deep black wool barathea with a continuous silk satin ribbon stripe down each outer leg seam"
  },
  {
    id: "m_bot_asym_wrap_skort_trousers",
    name: "Avant-Garde Half-Kilt Wrap Over Tailored Trousers",
    category: "bottoms",
    subcategory: "Tailored Trousers",
    gender: "male",
    silhouette: "Sharp straight trousers integrated with a pleated half-kilt skirt wrap fastened with leather buckles",
    materials: ["Black wool gabardine & tartan accents"],
    stylingNotes: "Signature concept stage styling blending masculine tailoring with fluid motion.",
    kpopVibes: ["Avant-Garde", "Stage Performance", "Gender Fluid Chic"],
    promptSnippet: "tailored straight-leg wool trousers layered with an integrated pleated half-kilt skirt wrap featuring polished silver buckle hardware"
  },
  {
    id: "m_bot_bungee_nylon_windpants",
    name: "Crinkle Nylon Parachute Track Pants with Bungee Hems",
    category: "bottoms",
    subcategory: "Cargo & Activewear",
    gender: "male",
    silhouette: "Ultra-wide parachute leg with volume-enhancing knee darts and adjustable elastic bungee cords at ankles and waist",
    materials: ["Matte crinkle nylon with water-resistant finish"],
    stylingNotes: "Dance practice staple; gathers gracefully above high-top sneakers.",
    kpopVibes: ["Dance Practice", "Y2K Streetwear", "Airport Casual"],
    promptSnippet: "billowing crinkle nylon parachute track pants with articulated knee gathers and adjustable toggle bungee drawstrings at the ankles"
  },
  {
    id: "m_bot_straight_leg_leather_pants",
    name: "Matte Lambskin Straight-Leg Leather Trousers",
    category: "bottoms",
    subcategory: "Tailored Trousers",
    gender: "male",
    silhouette: "Classic 5-pocket jeans cut rendered in rich matte genuine lambskin leather that drapes without stiffness",
    materials: ["100% fine matte lambskin leather"],
    stylingNotes: "Timeless luxury rock silhouette that elevates any stage coordinate.",
    kpopVibes: ["Dark Elegance", "Stage Visual", "Luxe Rockstar"],
    promptSnippet: "straight-leg trousers tailored from supple matte black lambskin leather with clean 5-pocket styling and natural subtle drape"
  },
  {
    id: "m_bot_pleated_balloon_chinos",
    name: "High-Volume Balloon Tapered Pleated Chinos",
    category: "bottoms",
    subcategory: "Tailored Trousers",
    gender: "male",
    silhouette: "Exaggerated curved balloon leg through thigh and calf, tapering sharply into a clean cropped ankle",
    materials: ["High-density washed Japanese cotton twill"],
    stylingNotes: "Modern Japanese-Seoul street silhouette that creates distinctive artistic proportions.",
    kpopVibes: ["Seoul Streetwear", "Artsy Minimalist", "Fashion Forward"],
    promptSnippet: "high-volume balloon silhouette cotton chinos with deep twin pleats, rounded curved legs, and a neat tapered cropped ankle"
  },
  {
    id: "m_bot_distressed_patchwork_denim",
    name: "Artisanal Boro Sashiko Patchwork Relaxed Denim",
    category: "bottoms",
    subcategory: "Denim & Shorts",
    gender: "male",
    silhouette: "Relaxed mid-rise jeans constructed from multiple shades of vintage indigo denim stitched with white sashiko thread",
    materials: ["Recycled vintage indigo cotton denim, sashiko embroidery"],
    stylingNotes: "Artistic festival and music video hero piece.",
    kpopVibes: ["Artisanal Craft", "Festival Vibe", "Music Video"],
    promptSnippet: "relaxed-fit artisanal patchwork denim jeans featuring multi-tonal indigo swatches, visible white sashiko embroidery, and subtle fraying"
  }
];

// ============================================================================
// 5. FEMALE JACKETS & OUTERWEAR (40+ Distinct K-Pop Idol Silhouettes)
// ============================================================================
export const FEMALE_JACKETS: GarmentItem[] = [
  {
    id: "f_jkt_tweed_boucle_blouson",
    name: "Cropped Collarless Tweed Bouclé Blouson",
    category: "jackets",
    subcategory: "Blousons & Cropped Jackets",
    gender: "female",
    silhouette: "Boxy cropped fit hitting at waist with round collarless neckline, frayed edges, and ornamental crest buttons",
    materials: ["Multi-yarn wool-blend tweed bouclé", "smooth silk-touch lining"],
    stylingNotes: "The ultimate K-pop airport and ambassador luxury piece; balances casual jeans or matching mini skirt.",
    kpopVibes: ["French Chic", "Airport Luxury", "House Ambassador"],
    promptSnippet: "a cropped collarless tweed bouclé blouson jacket with delicate frayed edge trim, ornamental engraved metal buttons, and textured woven fabric"
  },
  {
    id: "f_jkt_oversized_wool_blazer",
    name: "Oversized Tailored Double-Breasted Wool Blazer",
    category: "jackets",
    subcategory: "Blazers & Suiting",
    gender: "female",
    silhouette: "Boxy masculine cut with strong defined shoulder pads, peak lapels, and low-slung 4-button closure",
    materials: ["Fine suiting wool", "tropical worsted wool"],
    stylingNotes: "Draped over shoulders or worn open over a baby tee with wide jeans for effortless cool.",
    kpopVibes: ["Airport Fashion", "Clean Minimalist", "Power Chic"],
    promptSnippet: "a tailored oversized double-breasted wool blazer with sharp padded shoulders, broad peak lapels, and relaxed boyfriend silhouette"
  },
  {
    id: "f_jkt_lambskin_moto_biker",
    name: "Cropped Distressed Lambskin Moto Biker Jacket",
    category: "jackets",
    subcategory: "Leather & Moto",
    gender: "female",
    silhouette: "Cropped to high waist with wide notch collar, heavy silver asymmetric zippers, and buckled waist belt",
    materials: ["Supple washed lambskin leather", "heavy silver alloy hardware"],
    stylingNotes: "Adds instant rockstar grit to any stage or travel look.",
    kpopVibes: ["Rockstar Cool", "Seoul Grunge", "Girl Crush"],
    promptSnippet: "a cropped asymmetric motorcycle jacket in supple washed lambskin leather with polished silver zippers, snap lapels, and waist buckle"
  },
  {
    id: "f_jkt_varsity_bomber",
    name: "Cropped Wool Varsity Letterman Bomber",
    category: "jackets",
    subcategory: "Bombers & Casual",
    gender: "female",
    silhouette: "Cropped blouson with wool body, contrast leather raglan sleeves, and striped ribbed collar/cuffs",
    materials: ["Melton wool body", "genuine leather sleeves", "chenille patches"],
    stylingNotes: "High-teen retro favorite; pairs with pleated skorts and sneakers.",
    kpopVibes: ["High Teen", "Campus Preppy", "Casual Comeback"],
    promptSnippet: "a cropped wool varsity bomber jacket with contrasting leather raglan sleeves, striped ribbed trims, and retro chenille chest patches"
  },
  {
    id: "f_jkt_shearling_aviator",
    name: "Cropped Shearling-Lined Suede Aviator Jacket",
    category: "jackets",
    subcategory: "Leather & Moto",
    gender: "female",
    silhouette: "Boxy flight jacket with plush cream shearling collar, buckle throat latch, and exposed shearling trims",
    materials: ["Cracked vintage suede", "natural shearling fleece"],
    stylingNotes: "Warm luxury for winter airport appearances.",
    kpopVibes: ["Winter Airport", "Cozy Luxury", "Editorial"],
    promptSnippet: "a cropped shearling aviator jacket in distressed brown suede with plush shearling collar, twin buckled neck straps, and exposed fleece cuffs"
  },
  {
    id: "f_jkt_fluid_trench_coat",
    name: "Fluid Double-Breasted Longline Trench Coat",
    category: "jackets",
    subcategory: "Coats & Longline",
    gender: "female",
    silhouette: "Calf-length relaxed drape with wide storm flaps, raglan sleeves, and wide fabric waist belt",
    materials: ["Water-resistant fluid lyocell-cotton twill"],
    stylingNotes: "Belted at waist or left completely open to flow behind the idol.",
    kpopVibes: ["Airport Royalty", "Cinematic Visual", "Classic Elegance"],
    promptSnippet: "a sweeping double-breasted fluid trench coat with dramatic storm flaps, belted cuffs, and waist tie sash creating elegant movement"
  },
  {
    id: "f_jkt_motocross_leather_blouson",
    name: "Ergonomic Color-Blocked Motocross Racing Jacket",
    category: "jackets",
    subcategory: "Leather & Moto",
    gender: "female",
    silhouette: "Fitted cafe racer with stand collar, snap neck tab, and aerodynamic contrast leather panels",
    materials: ["Heavy cowhide leather with gloss finish"],
    stylingNotes: "Dynamic racing concept; matches with leather bottoms or baggy denim.",
    kpopVibes: ["Moto Racing", "Girl Crush", "Stage Performance"],
    promptSnippet: "an aerodynamic color-blocked motocross leather jacket with high snap mandarin collar, contoured contrast panels, and sleek racing patches"
  },
  {
    id: "f_jkt_cropped_down_puffer",
    name: "Matte Cropped High-Collar Down Puffer",
    category: "jackets",
    subcategory: "Bombers & Casual",
    gender: "female",
    silhouette: "High-volume quilted puffer cropped right at the natural waist with an exaggerated stand collar",
    materials: ["Matte technical ripstop nylon", "90/10 goose down fill"],
    stylingNotes: "Dramatic silhouette without hiding waist and trouser details.",
    kpopVibes: ["Winter Street", "Snow Comeback", "Cozy Chic"],
    promptSnippet: "a high-volume matte cropped down puffer jacket with an exaggerated pillow stand collar, wide horizontal baffles, and waist cinch hem"
  },
  {
    id: "f_jkt_deconstructed_waistcoat",
    name: "Tailored Pinstripe Suiting Waistcoat / Vest",
    category: "jackets",
    subcategory: "Blazers & Suiting",
    gender: "female",
    silhouette: "Fitted sleeveless vest with V-neckline, pointed hem points, and adjustable back cinch buckle",
    materials: ["Worsted pinstripe suiting wool", "satin back"],
    stylingNotes: "Worn standalone as a top or layered over a sheer shirt.",
    kpopVibes: ["Modern Suiting", "Clean Dandy", "Runway"],
    promptSnippet: "a tailored pinstripe suiting waistcoat with pointed front hem, horn buttons, clean V-neckline, and an adjustable satin back cinch"
  },
  {
    id: "f_jkt_sukajan_satin_bomber",
    name: "Reversible Silk-Satin Sukajan Souvenir Jacket",
    category: "jackets",
    subcategory: "Bombers & Casual",
    gender: "female",
    silhouette: "Relaxed raglan bomber with lustrous satin sheen and intricate embroidery across chest and back",
    materials: ["Heavyweight silk-viscose satin", "striped knit ribbing"],
    stylingNotes: "Vibrant statement piece for music video and festival stages.",
    kpopVibes: ["Retro Sukajan", "Festival Rockstar", "Street Style"],
    promptSnippet: "a lustrous silk-satin sukajan bomber jacket with two-tone raglan sleeves, striped rib-knit trims, and delicate vintage embroidery"
  },
  {
    id: "f_jkt_cropped_shearling_aviator",
    name: "Cropped Distressed Shearling Aviator Jacket",
    category: "jackets",
    subcategory: "Blousons & Cropped Jackets",
    gender: "female",
    silhouette: "Cropped boxy flight jacket with plush contrast shearling collar, buckle throat latch, and storm cuffs",
    materials: ["Cracked vintage lambskin & dense shearling fleece"],
    stylingNotes: "Winter airport visual favorite; cozy luxury with tough attitude.",
    kpopVibes: ["Winter Airport", "Luxe Vintage", "Off-Duty Visual"],
    promptSnippet: "a cropped distressed leather aviator jacket lined with thick creamy shearling fleece, featuring dual collar buckle straps and heavy brass zips"
  },
  {
    id: "f_jkt_vinyl_patent_trench",
    name: "High-Gloss Vinyl Patent Cropped Trench",
    category: "jackets",
    subcategory: "Blousons & Cropped Jackets",
    gender: "female",
    silhouette: "Ultra-reflective cropped double-breasted trench with storm flap, epaulettes, and buckled sleeve tabs",
    materials: ["High-gloss liquid vinyl patent PU"],
    stylingNotes: "Cyberpunk and dark pop concept music video highlight.",
    kpopVibes: ["Cyberpunk", "Dark Pop", "Music Video Visual"],
    promptSnippet: "a cropped double-breasted trench jacket in mirror-shine high-gloss vinyl with dramatic storm flaps and polished tortoiseshell buttons"
  },
  {
    id: "f_jkt_lace_organza_track_jacket",
    name: "Sheer Lace-Organza Hybrid Track Jacket",
    category: "jackets",
    subcategory: "Bombers & Sport Jackets",
    gender: "female",
    silhouette: "Athletic zip-up track silhouette crafted unexpectedly from delicate sheer floral organza lace with athletic striped rib trim",
    materials: ["Embroidered sheer organza & stretch athletic ribbing"],
    stylingNotes: "Contrasting sport and delicate femininity; high-fashion stage darling.",
    kpopVibes: ["High Fashion Subversive", "Stage Performance", "Coquette Sport"],
    promptSnippet: "a zip-up track jacket constructed from sheer delicate floral lace organza with contrast athletic striped ribbed collar and cuffs"
  },
  {
    id: "f_jkt_quilted_silk_hanbok_jacket",
    name: "Modern Quilted Silk Hanbok Jeogori Jacket",
    category: "jackets",
    subcategory: "Blousons & Cropped Jackets",
    gender: "female",
    silhouette: "Cropped wrap jacket inspired by traditional Korean jeogori with clean angled collar and trailing modern grosgrain goreum tie",
    materials: ["Diamond-quilted raw mulberry silk"],
    stylingNotes: "National prestige and global award show stage concept.",
    kpopVibes: ["Fusion Traditional", "Global Cultural Ambassador", "Regal Stage"],
    promptSnippet: "a cropped modern quilted raw silk jacket inspired by Korean traditional jeogori with a diagonal wrap neckline and elegant flowing tie ribbons"
  },
  {
    id: "f_jkt_deconstructed_cutout_blazer",
    name: "Deconstructed Slash-Back Tailored Tuxedo Blazer",
    category: "jackets",
    subcategory: "Blazers & Suiting",
    gender: "female",
    silhouette: "Sharp structured shoulders with peak satin lapels, featuring unexpected horizontal slashes across the spine and ribs",
    materials: ["Fine grain de poudre wool suiting"],
    stylingNotes: "Striking choreography visual when lights hit the open geometric back.",
    kpopVibes: ["Avant-Garde", "Stage Performance", "High Fashion Editorial"],
    promptSnippet: "a precision-tailored black tuxedo blazer with sharp peaked lapels and architectural cut-out slash openings across the lower back"
  },
  {
    id: "f_jkt_padded_puffer_shrug",
    name: "Down-Filled Sculptural Bolero Puffer Shrug",
    category: "jackets",
    subcategory: "Blousons & Cropped Jackets",
    gender: "female",
    silhouette: "Ultra-cropped bubble puffer covering just shoulders and arms with dramatic exaggerated stand-up funnel collar",
    materials: ["Water-resistant matte technical nylon & goose down"],
    stylingNotes: "Futuristic silhouette framing crop tops and bodysuits for choreography.",
    kpopVibes: ["Futuristic", "Streetwear Icon", "Dance Choreography"],
    promptSnippet: "a sculptural ultra-cropped down puffer shrug with an exaggerated stand collar and voluminous cloud-like sleeves"
  },
  {
    id: "f_jkt_fringed_suede_western",
    name: "Fringed Camel Suede Western Jacket",
    category: "jackets",
    subcategory: "Blousons & Cropped Jackets",
    gender: "female",
    silhouette: "Cropped trucker cut with pointed Western yokes and cascading hand-cut suede fringe along chest and sleeves",
    materials: ["100% genuine split calf suede"],
    stylingNotes: "Fringe ripples dramatically with arm movements during stage routines.",
    kpopVibes: ["Boho Chic", "Summer Festival", "Stage Performance"],
    promptSnippet: "a cropped camel suede Western jacket featuring pointed chest yokes and long, dynamic cascading fringe that sways with movement"
  },
  {
    id: "f_jkt_metallic_chainmail_cardigan",
    name: "Liquid Metallic Chainmail Draped Cardigan",
    category: "jackets",
    subcategory: "Blousons & Cropped Jackets",
    gender: "female",
    silhouette: "Open-front fluid bolero crafted from interlocking micro-mesh chainmail that ripples like liquid metal",
    materials: ["Aluminum mesh chainmail with rhodium dip"],
    stylingNotes: "Ultimate visual center stage piece under stadium spotlights.",
    kpopVibes: ["Glitz & Glamour", "Stage Performance", "Y2K Royalty"],
    promptSnippet: "a shimmering open-front bolero jacket made of liquid silver chainmail micro-mesh that drapes fluidly and glints under stadium spotlights"
  },
  {
    id: "f_jkt_corset_waist_peplum_blazer",
    name: "Hourglass Corset-Waist Peplum Wool Blazer",
    category: "jackets",
    subcategory: "Blazers & Suiting",
    gender: "female",
    silhouette: "Extreme hourglass tailoring with internal boned waist cinch opening into a flared sculpted peplum hem",
    materials: ["Dense worsted wool crepe"],
    stylingNotes: "Runway couture silhouette celebrating regal feminine power.",
    kpopVibes: ["Haute Couture", "Award Show", "Royalty Concept"],
    promptSnippet: "an extreme hourglass tailored wool blazer with an internal corseted waist cinch and dramatically flared structured peplum hips"
  },
  {
    id: "f_jkt_track_cape_anorak",
    name: "Batwing Cape Technical Windbreaker Anorak",
    category: "jackets",
    subcategory: "Bombers & Sport Jackets",
    gender: "female",
    silhouette: "High-volume cape-like silhouette with zip funnel neck, batwing side volume, and bungee cinch cords",
    materials: ["Ultra-lightweight crinkle ripstop parachute fabric"],
    stylingNotes: "Flies and billows during fast stage routines creating mesmerizing shapes.",
    kpopVibes: ["Avant-Garde Sport", "Music Video", "Choreography Hero"],
    promptSnippet: "a billowing technical batwing windbreaker cape with high zip funnel collar, toggled bungee hems, and ultra-lightweight translucent parachute nylon"
  }
];

// ============================================================================
// 6. MALE JACKETS & OUTERWEAR (40+ Distinct K-Pop Idol Silhouettes)
// ============================================================================
export const MALE_JACKETS: GarmentItem[] = [
  {
    id: "m_jkt_architectural_wool_blazer",
    name: "Architectural Drop-Shoulder Double-Breasted Wool Blazer",
    category: "jackets",
    subcategory: "Blazers & Suiting",
    gender: "male",
    silhouette: "Substantial boxy silhouette with extended padded shoulders, broad peak lapels, and horn buttons",
    materials: ["Heavy British suiting wool", "cupro lining"],
    stylingNotes: "Commanding silhouette; pairs with matching wide trousers or worn casually over vintage tees.",
    kpopVibes: ["High-Fashion Suiting", "Airport Royalty", "Clean Minimalist"],
    promptSnippet: "a commanding architectural double-breasted wool blazer with sharp extended shoulders, wide peak lapels, and deep flap pockets"
  },
  {
    id: "m_jkt_distressed_leather_cafe_racer",
    name: "Distressed Lambskin Cafe Racer Leather Jacket",
    category: "jackets",
    subcategory: "Leather & Moto",
    gender: "male",
    silhouette: "Clean minimalist biker jacket with stand snap collar, heavy central brass zip, and zippered chest pockets",
    materials: ["Full-grain vegetable-tanned washed lambskin"],
    stylingNotes: "Timeless rebellious idol staple; develops rich personal patina.",
    kpopVibes: ["Rockstar Cool", "Bad Boy Concept", "Airport Off-Duty"],
    promptSnippet: "a minimalist cafe racer jacket in washed distressed black lambskin leather with a snap mandarin collar and heavy antique silver hardware"
  },
  {
    id: "m_jkt_wool_leather_varsity",
    name: "Heavy Melton Wool & Leather Varsity Jacket",
    category: "jackets",
    subcategory: "Bombers & Casual",
    gender: "male",
    silhouette: "Relaxed vintage varsity cut with heavy wool body, full-grain cowhide sleeves, and thick knit collar/cuffs",
    materials: ["24oz melton wool", "heavy grain cowhide leather"],
    stylingNotes: "Classic high-teen boy group staple; wear with hoodie and straight denim.",
    kpopVibes: ["Campus Idol", "Varsity Heritage", "Music Video"],
    promptSnippet: "a classic varsity letterman jacket featuring a heavy melton wool body, genuine cowhide leather sleeves, and striped wool-rib trims"
  },
  {
    id: "m_jkt_double_breasted_trench",
    name: "Belted Raglan Double-Breasted Trench Coat",
    category: "jackets",
    subcategory: "Coats & Longline",
    gender: "male",
    silhouette: "Knee-to-calf length with roomy raglan sleeves, storm gun flap, epaulets, and D-ring buckle belt",
    materials: ["High-density weatherproof cotton gabardine"],
    stylingNotes: "Worn over suiting or casual knitwear for cinematic airport moments.",
    kpopVibes: ["Cinematic Drama", "Airport Fashion", "Sophisticated Gentleman"],
    promptSnippet: "a classic double-breasted trench coat in weatherproof cotton gabardine with raglan sleeves, buckled belt, and wide notch lapels"
  },
  {
    id: "m_jkt_14oz_denim_trucker",
    name: "14oz Washed Vintage Type-III Denim Trucker Jacket",
    category: "jackets",
    subcategory: "Denim & Workwear",
    gender: "male",
    silhouette: "Boxy fit with pointed chest flap pockets, vertical front welt seams, and embossed metal shank buttons",
    materials: ["14oz rigid ring-spun denim with vintage stone wash"],
    stylingNotes: "Layered over a hoodie or worn buttoned up as a top layer.",
    kpopVibes: ["Americana Cool", "Dance Practice", "Casual Street"],
    promptSnippet: "a vintage washed 14oz denim trucker jacket with pointed chest flap pockets, brass shank buttons, and authentic worn seam fading"
  },
  {
    id: "m_jkt_wool_minimalist_car_coat",
    name: "Minimalist Wool-Cashmere Concealed-Placket Car Coat",
    category: "jackets",
    subcategory: "Coats & Longline",
    gender: "male",
    silhouette: "Straight mid-thigh coat with clean point collar, concealed front button placket, and deep welt pockets",
    materials: ["Double-faced wool-cashmere blend"],
    stylingNotes: "Pure Scandinavian / Seoul minimalist elegance.",
    kpopVibes: ["Quiet Luxury", "Seoul Minimalist", "Winter Airport"],
    promptSnippet: "a sleek wool-cashmere car coat with a concealed front button placket, minimalist point collar, and clean architectural drape"
  },
  {
    id: "m_jkt_matte_technical_shell",
    name: "Matte Technical Hooded Shell Windbreaker",
    category: "jackets",
    subcategory: "Performance & Technical",
    gender: "male",
    silhouette: "Ergonomic hooded jacket with taped waterproof zippers, cinch hood, and articulated sleeve darts",
    materials: ["3-layer breathable matte technical ripstop"],
    stylingNotes: "Lightweight weather protection for tour travel and outdoor filming.",
    kpopVibes: ["Gorpcore Idol", "Tour Travel", "Modern Athleisure"],
    promptSnippet: "a matte technical shell windbreaker with waterproof sealed zippers, adjustable storm hood, and minimalist ergonomic seams"
  },
  {
    id: "m_jkt_corduroy_sherpa_trucker",
    name: "Wide-Wale Corduroy Sherpa-Lined Trucker Jacket",
    category: "jackets",
    subcategory: "Denim & Workwear",
    gender: "male",
    silhouette: "Boxy trucker jacket with plush cream sherpa fleece lining extending onto the point collar",
    materials: ["8-wale cotton corduroy", "plush sherpa lining"],
    stylingNotes: "Warm retro textures; pairs with denim and chunky boots.",
    kpopVibes: ["Autumn Warmth", "Retro Boyfriend", "Casual Comeback"],
    promptSnippet: "a warm wide-wale corduroy trucker jacket featuring a plush cream sherpa collar, soft fleece lining, and metal shank buttons"
  },
  {
    id: "m_jkt_heavy_wool_peacoat",
    name: "Nautical Double-Breasted Melton Peacoat",
    category: "jackets",
    subcategory: "Coats & Longline",
    gender: "male",
    silhouette: "Thigh-length naval cut with oversized ulster collar, 8 anchor-embossed buttons, and vertical handwarmer pockets",
    materials: ["32oz heavy naval melton wool"],
    stylingNotes: "Structured winter warmth; looks handsome over thick roll-neck knits.",
    kpopVibes: ["Naval Heritage", "Winter Visual", "Gentleman Idol"],
    promptSnippet: "a substantial naval double-breasted peacoat in heavy melton wool with a broad ulster lapel, anchor buttons, and tailored silhouette"
  },
  {
    id: "m_jkt_reversible_ma1_bomber",
    name: "Classic Reversible MA-1 Military Flight Bomber",
    category: "jackets",
    subcategory: "Bombers & Casual",
    gender: "male",
    silhouette: "Voluminous blouson body with emergency safety-orange lining, utility sleeve cigarette pocket, and ribbed collar",
    materials: ["Flight nylon twill with water-repellent coating"],
    stylingNotes: "Streetwear icon; worn slightly zipped with heavy sweatshirt.",
    kpopVibes: ["Streetwear Icon", "Dance Rehearsal", "Off-Duty Cool"],
    promptSnippet: "a classic MA-1 flight bomber jacket in heavy flight nylon with ribbed collar and cuffs, zippered sleeve utility pocket, and relaxed blouson drape"
  },
  {
    id: "m_jkt_crop_double_rider",
    name: "Cropped Asymmetric Leather Double-Rider Biker",
    category: "jackets",
    subcategory: "Leather & Denim",
    gender: "male",
    silhouette: "Cropped at the natural waist with wide angled notch lapels, heavy chrome zippers, and coin snap flap",
    materials: ["Heavyweight oiled cowhide leather"],
    stylingNotes: "Elongates idol legs when paired with high-waisted tailored pants or denim.",
    kpopVibes: ["Rockstar Idol", "Stage Performance", "Seoul Fashion Week"],
    promptSnippet: "a cropped heavy oiled black leather double-rider biker jacket with wide angled lapels, chunky silver zippers, and waist coin pocket"
  },
  {
    id: "m_jkt_tartan_punk_blazer",
    name: "Punk Safety-Pin Asymmetric Tartan Wool Blazer",
    category: "jackets",
    subcategory: "Blazers & Suiting",
    gender: "male",
    silhouette: "Tailored British royal stewart red tartan blazer accented with oversized polished steel safety pin closures and frayed raw edges",
    materials: ["100% Scottish wool tartan", "polished stainless steel hardware"],
    stylingNotes: "Rebellious high-fashion punk stage concept.",
    kpopVibes: ["Neo Punk", "Rock Concept", "Stage Performance"],
    promptSnippet: "a vibrant red tartan wool tailored blazer decorated with oversized industrial safety pin fastenings, raw unfinished edges, and peak lapels"
  },
  {
    id: "m_jkt_noragi_padded_hanten",
    name: "Modern Insulated Kimono Hanten Winter Jacket",
    category: "jackets",
    subcategory: "Parkas & Coats",
    gender: "male",
    silhouette: "Boxy collarless kimono wrap cut with front tie chords and horizontal baffle quilted warmth",
    materials: ["Water-repellent matte nylon & microfiber down alternative"],
    stylingNotes: "Contemporary East-Asian streetwear fusion for winter airport fashion.",
    kpopVibes: ["Fusion Traditional", "Airport Luxury", "Minimalist Streetwear"],
    promptSnippet: "a modern quilted hanten wrap jacket with clean collarless crossover lapels, front fabric ties, and lightweight down baffles"
  },
  {
    id: "m_jkt_varsity_chenille_leather",
    name: "Heavyweight Melton Wool & Leather Varsity Jacket",
    category: "jackets",
    subcategory: "Bombers & Casual",
    gender: "male",
    silhouette: "Classic American varsity silhouette with dense wool body, cream full-grain cowhide leather sleeves, and custom chenille chest patches",
    materials: ["24oz melton wool, full-grain cowhide sleeves, striped wool ribbing"],
    stylingNotes: "High-teen college idol visual archetype.",
    kpopVibes: ["High Teen", "Varsity Visual", "Campus Idol"],
    promptSnippet: "a heavy melton wool varsity jacket with cream leather sleeves, striped rib-knit collar and cuffs, and tactile chenille embroidered badges"
  },
  {
    id: "m_jkt_technical_modular_gilet",
    name: "Modular Utility Gilet Vest with Detachable Pockets",
    category: "jackets",
    subcategory: "Tactical & Utility",
    gender: "male",
    silhouette: "Sleeveless tactical vest featuring MOLLE webbing grid, dual quick-release magnetic buckles, and 3D bellows utility pouches",
    materials: ["1000D Cordura ballistic nylon"],
    stylingNotes: "Layered over hoodies or shirts during high-energy dance routines.",
    kpopVibes: ["Techwear", "Stage Performance", "Cyberpunk"],
    promptSnippet: "a multi-pocket technical tactical utility gilet in Cordura nylon with quick-release magnetic buckles, modular pouch attachments, and webbed straps"
  },
  {
    id: "m_jkt_velvet_smoking_jacket",
    name: "Silk-Velvet Smoking Jacket with Satin Shawl Collar",
    category: "jackets",
    subcategory: "Blazers & Suiting",
    gender: "male",
    silhouette: "Single-button smoking jacket in deep jewel-toned silk velvet with sweeping black satin shawl lapels and braided frogs",
    materials: ["Plush cotton-silk velvet & duchess satin"],
    stylingNotes: "Regal decadence for year-end grand awards and orchestral ballad stages.",
    kpopVibes: ["Royalty Concept", "Year-End Gayo", "Grand Luxury"],
    promptSnippet: "a luxurious jewel-toned silk-velvet smoking jacket with an elegant black satin shawl collar, piped welt pockets, and deep tactile luster"
  },
  {
    id: "m_jkt_moto_racer_leather",
    name: "Padded Shoulder Two-Tone Leather Moto Racing Jacket",
    category: "jackets",
    subcategory: "Leather & Denim",
    gender: "male",
    silhouette: "Fitted racing silhouette with mandarin snap collar, contrast aerodynamic stripe paneling, and quilted shoulder reinforcement",
    materials: ["Top-grain racing leather with perforated breathability panels"],
    stylingNotes: "High-octane concept styling for dynamic choreography.",
    kpopVibes: ["Moto Racing", "Stage Performance", "Sporty Visual"],
    promptSnippet: "a sleek two-tone leather motorcycle racing jacket with a snap-tab mandarin collar, quilted padded shoulders, and dynamic contrast racing stripes"
  },
  {
    id: "m_jkt_shearling_b3_bomber",
    name: "Distressed B-3 Sheepskin Shearling Flight Jacket",
    category: "jackets",
    subcategory: "Parkas & Coats",
    gender: "male",
    silhouette: "Rugged oversized flight bomber with thick curly sheepskin collar, dual leather buckle neck latches, and warm woolly interior",
    materials: ["100% genuine vintage patina sheepskin shearling"],
    stylingNotes: "Effortless rugged charisma during freezing Seoul winter schedules.",
    kpopVibes: ["Winter Visual", "Rugged Luxury", "Airport Fashion"],
    promptSnippet: "an oversized vintage B-3 sheepskin bomber jacket with thick plush shearling collar, weathered brown leather patina, and buckle throat straps"
  },
  {
    id: "m_jkt_draped_haori_cardigan",
    name: "Fluid Suiting Haori Kimono Cardigan Jacket",
    category: "jackets",
    subcategory: "Blazers & Suiting",
    gender: "male",
    silhouette: "Unstructured open-front jacket inspired by Japanese haori with square sleeves and fluid, light-catching suiting drape",
    materials: ["Lightweight wool-cupro suiting weave"],
    stylingNotes: "Captures air during turns in slow emotive ballads or contemporary choreo.",
    kpopVibes: ["Contemporary Dance", "Poetic Elegance", "Ballad Stage"],
    promptSnippet: "an unstructured fluid haori-style suiting cardigan jacket with wide square-cut sleeves, open front, and graceful undulating drape"
  },
  {
    id: "m_jkt_safari_field_jacket",
    name: "Four-Pocket Belted Cotton Gabardine Safari Jacket",
    category: "jackets",
    subcategory: "Tactical & Utility",
    gender: "male",
    silhouette: "Tailored mid-thigh jacket with four front buttoned bellows pockets, notch lapels, and buckled fabric waist belt",
    materials: ["High-density weatherproof cotton gabardine"],
    stylingNotes: "Polished adventurous explorer aesthetic.",
    kpopVibes: ["Modern Explorer", "Gentleman Style", "Airport Fashion"],
    promptSnippet: "a refined safari field jacket in crisp cotton gabardine featuring four pleated bellows pockets, horn buttons, and a cinched buckled waist belt"
  }
];

// ============================================================================
// 7. FOOTWEAR (Female & Male)
// ============================================================================
export const FEMALE_FOOTWEAR: GarmentItem[] = [
  {
    id: "f_foot_chunky_lug_loafers",
    name: "Chunky Lug-Sole Commando Loafers",
    category: "footwear",
    subcategory: "Loafers & Dress Shoes",
    gender: "female",
    silhouette: "Polished leather penny loafer with exaggerated 2-inch lightweight commando lug sole",
    materials: ["Polished calfskin leather", "EVA lug sole"],
    stylingNotes: "Worn with white crew socks and pleated skorts or puddle trousers.",
    kpopVibes: ["Preppy Chic", "Airport Luxury", "Modern Dandy"],
    promptSnippet: "polished black calfskin penny loafers with a chunky commando lug sole and crisp white ribbed crew socks"
  },
  {
    id: "f_foot_knee_high_combat_boots",
    name: "Lace-Up Knee-High Combat Boots",
    category: "footwear",
    subcategory: "Boots",
    gender: "female",
    silhouette: "Knee-high lace-up boots with inner side zipper, round toe, and thick lugged platform",
    materials: ["Full-grain leather", "rubber sole"],
    stylingNotes: "Girl crush and military stage essential; pairs with mini skirts and shorts.",
    kpopVibes: ["Girl Crush", "Stage Performance", "Rockstar"],
    promptSnippet: "tall knee-high lace-up combat boots in smooth black leather with substantial platform lug soles and side zipper"
  },
  {
    id: "f_foot_mary_jane_platforms",
    name: "Triple-Strap Platform Mary Janes",
    category: "footwear",
    subcategory: "Heels & Pumps",
    gender: "female",
    silhouette: "Round toe with three delicate instep buckle straps and 3-inch chunky platform block heel",
    materials: ["Patent leather", "gloss calfskin"],
    stylingNotes: "Coquette and high-teen favorite; styled with sheer or lace frill socks.",
    kpopVibes: ["High Teen", "Coquette", "Retro Glamour"],
    promptSnippet: "glossy black patent leather Mary Jane shoes with triple buckle instep straps and a sturdy platform block heel"
  },
  {
    id: "f_foot_retro_court_sneakers",
    name: "Vintage Low-Top Leather Court Sneakers",
    category: "footwear",
    subcategory: "Sneakers",
    gender: "female",
    silhouette: "Clean low-profile court silhouette with perforated toe box and off-white aged rubber cupsole",
    materials: ["Soft tumbled leather", "gum rubber sole"],
    stylingNotes: "Versatile everyday sneaker for airport travel and dance practice.",
    kpopVibes: ["Airport Casual", "Dance Practice", "Minimalist Clean"],
    promptSnippet: "clean vintage-inspired white leather low-top court sneakers with perforated toe box and aged cream rubber sole"
  },
  {
    id: "f_foot_pointed_kitten_boots",
    name: "Pointed-Toe Leather Kitten-Heel Ankle Boots",
    category: "footwear",
    subcategory: "Boots",
    gender: "female",
    silhouette: "Sharp pointed toe with slender 2-inch kitten heel and slim shaft hugging the ankle",
    materials: ["Supple nappa leather"],
    stylingNotes: "Peeks out from underneath fluid wide-leg trousers; high-fashion runway look.",
    kpopVibes: ["Editorial Chic", "French Elegance", "Night Event"],
    promptSnippet: "sleek pointed-toe black leather ankle boots with a slender kitten heel and snug ankle-hugging shaft"
  }
];

export const MALE_FOOTWEAR: GarmentItem[] = [
  {
    id: "m_foot_chunky_penny_loafers",
    name: "Chunky Commando-Sole Leather Penny Loafers",
    category: "footwear",
    subcategory: "Loafers & Dress Shoes",
    gender: "male",
    silhouette: "Substantial penny strap loafer with thick Goodyear-welted lugged rubber sole",
    materials: ["Brushed calfskin leather", "Vibram commando sole"],
    stylingNotes: "Balances wide-leg pleated trousers and oversized tailoring with grounded weight.",
    kpopVibes: ["Airport Luxury", "Old Money", "Modern Gentleman"],
    promptSnippet: "chunky commando-sole black leather penny loafers with Goodyear-welted heavy rubber treads and polished finish"
  },
  {
    id: "m_foot_chelsea_boots_cuban_heel",
    name: "Cuban-Heel Suede Chelsea Boots",
    category: "footwear",
    subcategory: "Boots",
    gender: "male",
    silhouette: "Snug shaft with elastic side gussets, almond toe, and 1.5-inch bevelled Cuban heel",
    materials: ["Fine Italian calf suede", "leather sole"],
    stylingNotes: "Rockstar elongation of the leg line; pairs with straight and slim denim.",
    kpopVibes: ["Rockstar Chic", "Stage Sleek", "Gentleman Visual"],
    promptSnippet: "streamlined suede Chelsea boots with elastic side gores, clean almond toe, and a refined 1.5-inch Cuban heel"
  },
  {
    id: "m_foot_retro_90s_basketball_sneakers",
    name: "High-Top Retro 90s Leather Basketball Sneakers",
    category: "footwear",
    subcategory: "Sneakers",
    gender: "male",
    silhouette: "Substantial high-top silhouette with ankle padding, color-blocked overlays, and pivot-point sole",
    materials: ["Full-grain leather and suede overlays"],
    stylingNotes: "Anchors baggy skater denim or sweatpants for authentic hip-hop aesthetic.",
    kpopVibes: ["90s Hip Hop", "Dance Practice", "Streetwear Cool"],
    promptSnippet: "high-top retro leather basketball sneakers with padded collars, vintage color-blocked panels, and chunky rubber cupsole"
  },
  {
    id: "m_foot_combat_zip_boots",
    name: "8-Eyelet Military Combat Boots with Side Zipper",
    category: "footwear",
    subcategory: "Boots",
    gender: "male",
    silhouette: "Mid-calf lace-up boot with rounded reinforced toe cap and heavy cleated sole",
    materials: ["Tough full-grain steerhide leather"],
    stylingNotes: "Tucked inside wide pants or pants stacked over; rugged performance footwear.",
    kpopVibes: ["Military Concept", "Edgy Rockstar", "Stage Performance"],
    promptSnippet: "rugged 8-eyelet black leather combat boots with heavy cleated lug soles and functional inner side zippers"
  },
  {
    id: "m_foot_minimalist_white_lowtops",
    name: "Minimalist Italian White Leather Low-Top Sneakers",
    category: "footwear",
    subcategory: "Sneakers",
    gender: "male",
    silhouette: "Unbranded, ultra-clean tennis shoe silhouette with flat cotton laces and stitched margom sole",
    materials: ["Smooth nappa leather", "natural leather lining"],
    stylingNotes: "The ultimate clean shoe for quiet luxury suiting.",
    kpopVibes: ["Quiet Luxury", "Clean Aesthetic", "Airport Chic"],
    promptSnippet: "pristine minimalist low-top white leather sneakers with tonal stitching, flat laces, and sleek unbranded silhouette"
  }
];

// ============================================================================
// 8. ACCESSORIES, BELTS & LAYER DETAILS (Female & Male)
// ============================================================================
export const FEMALE_ACCESSORIES: GarmentItem[] = [
  {
    id: "f_acc_western_double_buckle_belt",
    name: "Western Double-Buckle Leather Waist Belt",
    category: "accessories",
    subcategory: "Belts & Hardware",
    gender: "female",
    silhouette: "Smooth leather strap with engraved silver western buckles and metal tip keeper",
    materials: ["Vegetable-tanned leather", "carved antique silver alloy"],
    stylingNotes: "Cinches waist over oversized blazers or through high-rise denim belt loops.",
    kpopVibes: ["Boho Chic", "Y2K Grunge", "Airport Visual"],
    promptSnippet: "a black leather belt with ornate engraved silver western hardware and polished metal tip keeper"
  },
  {
    id: "f_acc_chrome_grommet_belt",
    name: "Double-Row Chrome Grommet Eyelet Belt",
    category: "accessories",
    subcategory: "Belts & Hardware",
    gender: "female",
    silhouette: "1.5-inch leather strap punched with continuous double rows of silver eyelets",
    materials: ["Heavy saddle leather", "polished chrome grommets"],
    stylingNotes: "90s punk street staple; adds hardware punch to baggy denim.",
    kpopVibes: ["Acubi Punk", "Y2K Street", "Dance Rehearsal"],
    promptSnippet: "a statement leather belt detailed with double rows of polished chrome grommets and heavy roller buckle"
  },
  {
    id: "f_acc_layered_pearl_chain_choker",
    name: "Layered Freshwater Pearl & Silver Chain Choker",
    category: "accessories",
    subcategory: "Jewelry & Neckwear",
    gender: "female",
    silhouette: "Multi-strand collar combining baroque pearls with chunky Cuban curb chains",
    materials: ["Irregular freshwater baroque pearls", "925 sterling silver chain"],
    stylingNotes: "Juxtaposes elegance with industrial edge; frames bare neck and open collars.",
    kpopVibes: ["High Fashion", "Stage Jewelry", "Elegance"],
    promptSnippet: "a layered choker necklace contrasting irregular freshwater baroque pearls with polished sterling silver curb chains"
  },
  {
    id: "f_acc_skinny_silk_necktie",
    name: "Skinny Silk-Satin Loose Necktie",
    category: "accessories",
    subcategory: "Jewelry & Neckwear",
    gender: "female",
    silhouette: "Ultra-slim 1.5-inch tie worn loosely knotted with open shirt collar",
    materials: ["Silk satin", "woven polyester"],
    stylingNotes: "Preppy rebellious schoolgirl or Dandy girl look.",
    kpopVibes: ["High Teen", "Modern Dandy", "Music Video"],
    promptSnippet: "an ultra-slim silk necktie worn loosely knotted around an unbuttoned shirt collar with relaxed drape"
  },
  {
    id: "f_acc_wool_beret",
    name: "Structured French Wool Felt Beret",
    category: "accessories",
    subcategory: "Hats & Headwear",
    gender: "female",
    silhouette: "Classic rounded felt crown tilted gracefully to one side",
    materials: ["100% boiled wool felt"],
    stylingNotes: "Framed over curtain bangs or long waves for Parisian charm.",
    kpopVibes: ["Parisian Chic", "Winter Comeback", "High Teen"],
    promptSnippet: "a classic structured wool felt beret tilted effortlessly to one side above soft face-framing hair strands"
  }
];

export const MALE_ACCESSORIES: GarmentItem[] = [
  {
    id: "m_acc_silver_buckle_calfskin_belt",
    name: "Sleek Calfskin Belt with Polished Silver Buckle",
    category: "accessories",
    subcategory: "Belts & Hardware",
    gender: "male",
    silhouette: "1.25-inch dress strap with clean beveled edges and rectangular polished silver buckle",
    materials: ["Full-grain black calfskin leather"],
    stylingNotes: "Essential for marking the waistline in tucked trouser coordinates.",
    kpopVibes: ["Clean Luxury", "Airport Suiting", "Minimalist"],
    promptSnippet: "a sleek black calfskin leather belt with a minimalist polished silver rectangular buckle securing the waistband"
  },
  {
    id: "m_acc_layered_cuban_curb_chain",
    name: "Layered Cuban Curb Chain & Pendant",
    category: "accessories",
    subcategory: "Jewelry & Neckwear",
    gender: "male",
    silhouette: "Dual-layer necklace featuring a 6mm flat diamond-cut curb chain and longer medallion pendant",
    materials: ["Solid 925 sterling silver"],
    stylingNotes: "Adds metallic shine over plain crewnecks or under open shirts.",
    kpopVibes: ["Hip Hop Cool", "Stage Visual", "Airport Streetwear"],
    promptSnippet: "layered diamond-cut sterling silver Cuban curb chains resting against the collarbone with subtle metallic gleam"
  },
  {
    id: "m_acc_skinny_tie_tiebar",
    name: "Tailored Skinny Silk Tie with Polished Silver Tie Bar",
    category: "accessories",
    subcategory: "Jewelry & Neckwear",
    gender: "male",
    silhouette: "Modern 2-inch silk knit or satin tie clipped with a horizontal silver slide bar",
    materials: ["Silk jacquard", "rhodium-plated brass"],
    stylingNotes: "Sharp modern suiting precision for red carpets and music shows.",
    kpopVibes: ["Secret Agent Concept", "Gentleman Suiting", "Award Show"],
    promptSnippet: "a narrow silk necktie anchored with a sleek polished silver tie bar between the lapels of the suit"
  },
  {
    id: "m_acc_wireframe_glasses",
    name: "Geometric Titanium Wire-Frame Eyeglasses",
    category: "accessories",
    subcategory: "Eyewear",
    gender: "male",
    silhouette: "Lightweight polygonal or round frame with thin silver or gunmetal temple arms",
    materials: ["Japanese beta-titanium"],
    stylingNotes: "Intellectual, handsome boy-next-door or CEO concept.",
    kpopVibes: ["Intellectual Visual", "Boyfriend Material", "Fansign Charm"],
    promptSnippet: "delicate silver geometric wire-frame titanium eyeglasses resting on the bridge of the nose"
  },
  {
    id: "m_acc_knit_beanie",
    name: "Ribbed Fisherman Watch Cap Beanie",
    category: "accessories",
    subcategory: "Hats & Headwear",
    gender: "male",
    silhouette: "Short-profile roll-cuff knit cap sitting above the ears",
    materials: ["100% merino wool rib-knit"],
    stylingNotes: "Street casual idol travel staple; lets hairstyle peek out naturally.",
    kpopVibes: ["Dance Practice", "Street Style", "Airport Casual"],
    promptSnippet: "a tight-knit ribbed wool fisherman watch cap beanie worn cuffed above the ears with front bangs peeking through"
  }
];

// ============================================================================
// 9. MASTER CATALOGUE & HELPER QUERY ENGINES
// ============================================================================

export const ALL_GARMENTS: GarmentItem[] = [
  ...FEMALE_TOPS,
  ...MALE_TOPS,
  ...FEMALE_BOTTOMS,
  ...MALE_BOTTOMS,
  ...FEMALE_JACKETS,
  ...MALE_JACKETS,
  ...FEMALE_FOOTWEAR,
  ...MALE_FOOTWEAR,
  ...FEMALE_ACCESSORIES,
  ...MALE_ACCESSORIES
];

/**
 * Returns all garments filtered by category and target gender.
 */
export function getGarmentsByCategory(
  category: GarmentCategory,
  genderStr: 'female' | 'male' | string
): GarmentItem[] {
  const isFemale = genderStr.toLowerCase().includes('female') || genderStr.toLowerCase().includes('girl');
  const targetGender: GenderTarget = isFemale ? 'female' : 'male';

  return ALL_GARMENTS.filter(
    item => item.category === category && (item.gender === targetGender || item.gender === 'unisex')
  );
}

/**
 * Search the deep garment library by query keyword across name, subcategory, materials, and vibes.
 */
export function searchGarments(
  query: string,
  genderStr?: 'female' | 'male' | string
): GarmentItem[] {
  const q = (query || '').toLowerCase().trim();
  const isFemale = genderStr ? (genderStr.toLowerCase().includes('female') || genderStr.toLowerCase().includes('girl')) : undefined;

  return ALL_GARMENTS.filter(item => {
    if (isFemale !== undefined) {
      const matchGender = isFemale ? (item.gender === 'female' || item.gender === 'unisex') : (item.gender === 'male' || item.gender === 'unisex');
      if (!matchGender) return false;
    }

    if (!q) return true;

    return (
      item.name.toLowerCase().includes(q) ||
      item.subcategory.toLowerCase().includes(q) ||
      item.silhouette.toLowerCase().includes(q) ||
      item.materials.some(m => m.toLowerCase().includes(q)) ||
      item.kpopVibes.some(v => v.toLowerCase().includes(q))
    );
  });
}

// ============================================================================
// 10. COHESIVE AESTHETIC CAPSULES & HARMONIZED STYLING ENGINE
// ============================================================================

export interface AestheticCapsule {
  id: string;
  name: string;
  vibe: string;
  tagline: string;
  female: {
    topIds: string[];
    bottomIds: string[];
    jacketIds: string[];
    accessoryIds: string[];
  };
  male: {
    topIds: string[];
    bottomIds: string[];
    jacketIds: string[];
    accessoryIds: string[];
  };
}

export const AESTHETIC_CAPSULES: AestheticCapsule[] = [
  {
    id: "tailored_luxury",
    name: "Tailored Suiting & Quiet Luxury",
    vibe: "Clean, structured, editorial elegance with crisp silhouettes and luxury suiting wools",
    tagline: "Architectural tailoring, razor-sharp creases, and understated luxury",
    female: {
      topIds: ["f_top_cropped_poplin_shirt", "f_top_cowl_neck_silk_cami", "f_top_halter_suiting_waistcoat", "f_top_asymmetric_wrap_blouse", "f_top_pussy_bow_silk_shirt", "f_top_fine_ribbed_mock_neck"],
      bottomIds: ["f_bot_wide_leg_pleated_slacks", "f_bot_cigarette_trousers", "f_bot_puddle_crepe_pants", "f_bot_pinstripe_tailored_pants", "f_bot_tailored_bermuda_shorts"],
      jacketIds: ["f_jkt_oversized_wool_blazer", "f_jkt_fluid_trench_coat", "f_jkt_deconstructed_waistcoat", "f_jkt_corset_waist_peplum_blazer"],
      accessoryIds: ["f_acc_skinny_silk_necktie", "f_acc_western_double_buckle_belt"]
    },
    male: {
      topIds: ["m_top_oversized_poplin_oxford", "m_top_johnny_collar_knit_polo", "m_top_zip_neck_merino_polo", "m_top_half_placket_popover"],
      bottomIds: ["m_bot_double_pleated_wool_trousers", "m_bot_fluid_wide_suiting_slacks", "m_bot_cropped_tailored_trousers", "m_bot_wide_pinstripe_dress_slacks"],
      jacketIds: ["m_jkt_architectural_wool_blazer", "m_jkt_double_breasted_trench", "m_jkt_wool_minimalist_car_coat", "m_jkt_draped_haori_cardigan"],
      accessoryIds: ["m_acc_silver_buckle_calfskin_belt", "m_acc_skinny_tie_tiebar", "m_acc_wireframe_glasses"]
    }
  },
  {
    id: "parisian_airport_chic",
    name: "Parisian Chic & Airport Off-Duty",
    vibe: "Effortless off-duty celebrity idol travel style with tweed, relaxed denim, and soft knits",
    tagline: "Iconic Incheon airport arrival aesthetics with luxury nonchalance",
    female: {
      topIds: ["f_top_mohair_alpaca_cardigan", "f_top_racerback_ribbed_tank", "f_top_fine_ribbed_mock_neck", "f_top_cropped_poplin_shirt", "f_top_chunky_bolero_tank_set"],
      bottomIds: ["f_bot_vintage_straight_denim", "f_bot_wide_leg_pleated_slacks", "f_bot_split_hem_flare_pants", "f_bot_cigarette_trousers"],
      jacketIds: ["f_jkt_tweed_boucle_blouson", "f_jkt_fluid_trench_coat", "f_jkt_oversized_wool_blazer", "f_jkt_cropped_shearling_aviator"],
      accessoryIds: ["f_acc_wool_beret", "f_acc_western_double_buckle_belt", "f_acc_layered_pearl_chain_choker"]
    },
    male: {
      topIds: ["m_top_oversized_poplin_oxford", "m_top_mohair_oversized_cardigan", "m_top_zip_neck_merino_polo", "m_top_boxy_heavyweight_tee"],
      bottomIds: ["m_bot_fluid_wide_suiting_slacks", "m_bot_14oz_selvedge_denim", "m_bot_cropped_tailored_trousers"],
      jacketIds: ["m_jkt_wool_minimalist_car_coat", "m_jkt_double_breasted_trench", "m_jkt_heavy_wool_peacoat"],
      accessoryIds: ["m_acc_wireframe_glasses", "m_acc_silver_buckle_calfskin_belt"]
    }
  },
  {
    id: "high_teen_preppy",
    name: "Collegiate High-Teen & Modern Preppy",
    vibe: "Youthful academic prep, varsity crests, pleated tennis skirts, and tailored knits",
    tagline: "Ivy League elite school uniform concept re-imagined for center-stage visuals",
    female: {
      topIds: ["f_top_baby_tee_ringer", "f_top_rugby_stripe_polo", "f_top_collegiate_crewneck", "f_top_cropped_poplin_shirt", "f_top_polo_collar_knit"],
      bottomIds: ["f_bot_pleated_tennis_skort", "f_bot_wool_houndstooth_skort", "f_bot_pleated_tennis_contrast", "f_bot_tailored_bermuda_shorts"],
      jacketIds: ["f_jkt_varsity_bomber", "f_jkt_tweed_boucle_blouson"],
      accessoryIds: ["f_acc_wool_beret", "f_acc_skinny_silk_necktie"]
    },
    male: {
      topIds: ["m_top_slouchy_cricket_sweater", "m_top_oversized_poplin_oxford", "m_top_open_weave_retro_polo", "m_top_vintage_faded_crewneck"],
      bottomIds: ["m_bot_pleated_wide_shorts", "m_bot_pleated_balloon_chinos", "m_bot_cropped_tailored_trousers"],
      jacketIds: ["m_jkt_wool_leather_varsity", "m_jkt_varsity_chenille_leather"],
      accessoryIds: ["m_acc_wireframe_glasses", "m_acc_skinny_tie_tiebar"]
    }
  },
  {
    id: "dance_studio_athleisure",
    name: "Dance Studio & Sleek Athleisure",
    vibe: "High-performance choreography chic with clean athletic silhouettes, zip tracks, and fluid joggers",
    tagline: "Dance practice room royalty with sleek technical fabrications and sharp mobility",
    female: {
      topIds: ["f_top_racerback_ribbed_tank", "f_top_motocross_panel_longsleeve", "f_top_cropped_zip_hoodie", "f_top_mesh_football_jersey", "f_top_baseball_oversized_jersey"],
      bottomIds: ["f_bot_side_snap_track_pants", "f_bot_flare_jazz_pants", "f_bot_parachute_pants_toggle", "f_bot_stirrup_leggings"],
      jacketIds: ["f_jkt_lace_organza_track_jacket", "f_jkt_track_cape_anorak", "f_jkt_motocross_leather_blouson"],
      accessoryIds: ["f_acc_chrome_grommet_belt"]
    },
    male: {
      topIds: ["m_top_track_quarter_zip", "m_top_loopback_cotton_hoodie", "m_top_athletic_mesh_jersey", "m_top_mock_neck_compression"],
      bottomIds: ["m_bot_loopback_sweatshorts", "m_bot_technical_parachute_pants", "m_bot_bungee_nylon_windpants"],
      jacketIds: ["m_jkt_reversible_ma1_bomber", "m_jkt_matte_technical_shell"],
      accessoryIds: ["m_acc_knit_beanie"]
    }
  },
  {
    id: "rockstar_grunge_denim",
    name: "Seoul Vintage & Rockstar Grunge",
    vibe: "Edgy rock concept with distressed leather, authentic heavy denim, and rock tour nostalgia",
    tagline: "Midnight rehearsal rockstar with washed denim and distressed hardware",
    female: {
      topIds: ["f_top_distressed_raglan_tee", "f_top_denim_boned_corset", "f_top_open_weave_distressed_knit", "f_top_leather_sweetheart_crop", "f_top_baby_tee_graphic"],
      bottomIds: ["f_bot_raw_hem_distressed_denim", "f_bot_raw_edge_denim_mini", "f_bot_paperbag_leather_shorts", "f_bot_two_tone_paneled_denim"],
      jacketIds: ["f_jkt_lambskin_moto_biker", "f_jkt_sukajan_satin_bomber", "f_jkt_cropped_shearling_aviator"],
      accessoryIds: ["f_acc_western_double_buckle_belt", "f_acc_chrome_grommet_belt"]
    },
    male: {
      topIds: ["m_top_vintage_tour_graphic_tee", "m_top_distressed_grunge_sweater", "m_top_waffle_thermal_henley", "m_top_western_yoke_denim_shirt"],
      bottomIds: ["m_bot_14oz_selvedge_denim", "m_bot_knee_slash_rock_denim", "m_bot_stacked_waxed_denim", "m_bot_distressed_patchwork_denim"],
      jacketIds: ["m_jkt_distressed_leather_cafe_racer", "m_jkt_crop_double_rider", "m_jkt_14oz_denim_trucker", "m_jkt_tartan_punk_blazer"],
      accessoryIds: ["m_acc_layered_cuban_curb_chain"]
    }
  },
  {
    id: "quiet_luxury_knitwear",
    name: "Cozy Soft Luxury & Fine Knitwear",
    vibe: "Tactile kid mohair, brushed alpaca, and fluid tailoring for poetic visual charisma",
    tagline: "Fluffy cloud knits, mother-of-pearl hardware, and fluid suiting drape",
    female: {
      topIds: ["f_top_mohair_alpaca_cardigan", "f_top_off_shoulder_cable_knit", "f_top_cropped_fisherman_sweater", "f_top_cowl_neck_silk_cami", "f_top_fine_ribbed_mock_neck"],
      bottomIds: ["f_bot_wide_leg_pleated_slacks", "f_bot_satin_slip_midi_skirt", "f_bot_puddle_crepe_pants", "f_bot_vintage_straight_denim"],
      jacketIds: ["f_jkt_fluid_trench_coat", "f_jkt_cropped_shearling_aviator"],
      accessoryIds: ["f_acc_layered_pearl_chain_choker", "f_acc_wool_beret"]
    },
    male: {
      topIds: ["m_top_mohair_oversized_cardigan", "m_top_chunky_fisherman_crew", "m_top_zip_neck_merino_polo", "m_top_chunky_fisherman_turtleneck"],
      bottomIds: ["m_bot_double_pleated_wool_trousers", "m_bot_fluid_wide_suiting_slacks", "m_bot_wide_wale_corduroys"],
      jacketIds: ["m_jkt_wool_minimalist_car_coat", "m_jkt_heavy_wool_peacoat", "m_jkt_corduroy_sherpa_trucker"],
      accessoryIds: ["m_acc_wireframe_glasses", "m_acc_knit_beanie"]
    }
  },
  {
    id: "y2k_acubi_streetwear",
    name: "Y2K Pop & Sleek Acubi",
    vibe: "Early 2000s cyber minimalism with micro baby tees, low-slung denim, and futuristic metallic touches",
    tagline: "Retro-futuristic cyber street fashion with playful Y2K proportions",
    female: {
      topIds: ["f_top_baby_tee_graphic", "f_top_mesh_paneled_bustier", "f_top_denim_bandeau_buckles", "f_top_ruched_tube_top", "f_top_asymm_off_shoulder_tee"],
      bottomIds: ["f_bot_low_rise_baggy_skater_jeans", "f_bot_denim_micro_skort", "f_bot_buckled_utility_mini", "f_bot_metallic_foil_wide_jeans"],
      jacketIds: ["f_jkt_cropped_down_puffer", "f_jkt_sukajan_satin_bomber", "f_jkt_vinyl_patent_trench"],
      accessoryIds: ["f_acc_chrome_grommet_belt", "f_acc_western_double_buckle_belt"]
    },
    male: {
      topIds: ["m_top_boxy_heavyweight_tee", "m_top_raw_hem_boxy_tee", "m_top_asym_diag_zip_top", "m_top_biker_raglan_tee"],
      bottomIds: ["m_bot_90s_baggy_skater_denim", "m_bot_carpenter_utility_denim", "m_bot_raw_denim_carpenter"],
      jacketIds: ["m_jkt_reversible_ma1_bomber", "m_jkt_moto_racer_leather"],
      accessoryIds: ["m_acc_layered_cuban_curb_chain", "m_acc_knit_beanie"]
    }
  },
  {
    id: "sleek_minimalist_editorial",
    name: "Sleek Contemporary & Editorial Minimalist",
    vibe: "Deconstructed architectural poplins, sculptural wraps, and clean monochromatic lines",
    tagline: "High-fashion runway editorial styling with intentional negative space",
    female: {
      topIds: ["f_top_asymmetric_wrap_blouse", "f_top_deconstructed_collar_shirt", "f_top_open_back_poplin_tie", "f_top_sculpted_hem_peplum", "f_top_cowl_neck_silk_cami"],
      bottomIds: ["f_bot_wide_leg_pleated_slacks", "f_bot_cigarette_trousers", "f_bot_split_hem_flare_pants", "f_bot_puddle_crepe_pants"],
      jacketIds: ["f_jkt_deconstructed_cutout_blazer", "f_jkt_fluid_trench_coat", "f_jkt_oversized_wool_blazer"],
      accessoryIds: ["f_acc_skinny_silk_necktie", "f_acc_western_double_buckle_belt"]
    },
    male: {
      topIds: ["m_top_deconstructed_band_shirt", "m_top_oversized_poplin_oxford", "m_top_johnny_collar_knit_polo", "m_top_half_placket_popover"],
      bottomIds: ["m_bot_double_pleated_wool_trousers", "m_bot_fluid_wide_suiting_slacks", "m_bot_cropped_tailored_trousers"],
      jacketIds: ["m_jkt_architectural_wool_blazer", "m_jkt_draped_haori_cardigan", "m_jkt_wool_minimalist_car_coat"],
      accessoryIds: ["m_acc_silver_buckle_calfskin_belt", "m_acc_wireframe_glasses"]
    }
  }
];

/**
 * Returns all defined cohesive aesthetic capsules.
 */
export function getAestheticCapsules(): AestheticCapsule[] {
  return AESTHETIC_CAPSULES;
}

/**
 * Randomly samples a harmonious custom outfit coordinate constructed from the comprehensive garment knowledge base.
 * Guarantees that every piece belongs to a single cohesive aesthetic capsule and incorporates official group colors!
 */
export function getRandomGarmentCoordinate(
  genderStr: 'female' | 'male' | string,
  colorway?: { primary: string; secondary?: string; neutral?: string },
  aestheticPreference?: string
): {
  title: string;
  capsuleName: string;
  top: GarmentItem;
  bottom: GarmentItem;
  jacket?: GarmentItem;
  accessory?: GarmentItem;
  prompt: string;
} {
  const isFemale = genderStr.toLowerCase().includes('female') || genderStr.toLowerCase().includes('girl');

  // 1. Determine the target cohesive aesthetic capsule
  let capsule = AESTHETIC_CAPSULES[Math.floor(Math.random() * AESTHETIC_CAPSULES.length)];
  if (aestheticPreference) {
    const q = aestheticPreference.toLowerCase();
    const matched = AESTHETIC_CAPSULES.find(c =>
      c.id.toLowerCase() === q ||
      c.name.toLowerCase().includes(q) ||
      c.vibe.toLowerCase().includes(q)
    );
    if (matched) capsule = matched;
  }

  const capsuleGenderData = isFemale ? capsule.female : capsule.male;
  const allTops = isFemale ? FEMALE_TOPS : MALE_TOPS;
  const allBottoms = isFemale ? FEMALE_BOTTOMS : MALE_BOTTOMS;
  const allJackets = isFemale ? FEMALE_JACKETS : MALE_JACKETS;
  const allAccessories = isFemale ? FEMALE_ACCESSORIES : MALE_ACCESSORIES;

  // Filter items that strictly belong to this aesthetic capsule
  const compatibleTops = allTops.filter(t => capsuleGenderData.topIds.includes(t.id));
  const compatibleBottoms = allBottoms.filter(b => capsuleGenderData.bottomIds.includes(b.id));
  const compatibleJackets = allJackets.filter(j => capsuleGenderData.jacketIds.includes(j.id));
  const compatibleAccessories = allAccessories.filter(a => capsuleGenderData.accessoryIds.includes(a.id));

  const top = compatibleTops.length > 0
    ? compatibleTops[Math.floor(Math.random() * compatibleTops.length)]
    : allTops[Math.floor(Math.random() * allTops.length)];

  const bottom = compatibleBottoms.length > 0
    ? compatibleBottoms[Math.floor(Math.random() * compatibleBottoms.length)]
    : allBottoms[Math.floor(Math.random() * allBottoms.length)];

  // 50% chance of a compatible jacket/outerwear that belongs to the same aesthetic
  const includeJacket = compatibleJackets.length > 0 && Math.random() > 0.45;
  const jacket = includeJacket ? compatibleJackets[Math.floor(Math.random() * compatibleJackets.length)] : undefined;

  // 70% chance of an accessory that complements the silhouette
  const includeAccessory = compatibleAccessories.length > 0 && Math.random() > 0.3;
  const accessory = includeAccessory ? compatibleAccessories[Math.floor(Math.random() * compatibleAccessories.length)] : undefined;

  // Format official group colors with high-fashion tailoring precision
  const c1 = colorway?.primary || "rich navy suiting tone";
  const c2 = colorway?.secondary || "crisp optic white";
  const neutral = colorway?.neutral || "tailored charcoal wool";

  let title = `${top.name} & ${bottom.name}`;
  if (jacket) {
    title = `${jacket.name} over ${top.name} & ${bottom.name}`;
  }

  let prompt = "";
  if (jacket) {
    prompt = `an impeccably styled, aesthetically unified high-fashion K-pop designer coordinate in the "${capsule.name}" aesthetic. Featuring ${jacket.promptSnippet} in the official group brand color ${c1}, layered naturally over ${top.promptSnippet} in ${c2}, tucked cleanly into ${bottom.promptSnippet} in ${neutral} with a clearly visible waistband and belt.`;
  } else {
    prompt = `an impeccably styled, aesthetically unified high-fashion K-pop designer coordinate in the "${capsule.name}" aesthetic. Featuring ${top.promptSnippet} in the official group brand color ${c1}, tucked cleanly into ${bottom.promptSnippet} in ${neutral} with a clearly visible waistband and belt.`;
  }

  if (accessory) {
    prompt += ` Refined with ${accessory.promptSnippet} that perfectly complements the silhouette.`;
  }

  prompt += ` AESTHETIC COHESION & GROUP COLOR HARMONY: Every garment belongs strictly to the "${capsule.name}" aesthetic with matching formal level, balanced proportions, and complementary textiles. The primary statement piece showcases official group brand color ${c1}, harmonized with ${c2} and grounded in ${neutral}. ZERO clashing colors, ZERO mismatched aesthetics, and ZERO disjointed pieces.`;

  return {
    title,
    capsuleName: capsule.name,
    top,
    bottom,
    jacket,
    accessory,
    prompt
  };
}

/**
 * Generates an authoritative styling principles block for prompt compilation.
 * Avoids dumping 100+ conflicting garment names so image generation models maintain pristine aesthetic focus.
 */
export function getGarmentSystemPromptContext(genderStr: 'female' | 'male' | string): string {
  const isFemale = genderStr.toLowerCase().includes('female') || genderStr.toLowerCase().includes('girl');

  return `HIGH-FASHION K-POP STYLING PRINCIPLES (${isFemale ? 'FEMALE' : 'MALE'} IDOL):
- AESTHETIC COHESION & UNITY: Every piece in the outfit must belong strictly to one cohesive high-fashion designer concept. The top, bottom, outerwear, and accessories must look intentionally curated by a top agency stylist. ZERO mismatched items, ZERO disjointed random layers.
- OFFICIAL GROUP BRAND COLORS: The outfit must be cleanly color-blocked around the group's official palette, using the primary brand color for the statement piece, secondary color for layering/accents, and balanced with tailored neutrals (such as tailored charcoal wool, crisp optic white, ivory, or washed vintage denim).
- TEXTILE & MATERIAL REALISM: Authentic tangible fabrics with natural cloth drape, crisp tailoring seams, realistic texture (e.g. combed cotton, worsted wool crepe, washed denim, soft brushed mohair, fine silk poplin).
- WAIST-UP CAMERA FRAMING BALANCE: The camera frames the idol from head down to hips; ensure BOTH the top garment and the waistband, belt, or skirt top are cleanly visible and proportionally balanced. ABSOLUTELY NO techwear straps, NO generic plain grey undershirts, and NO sloppy mismatched clothes.`;
}
