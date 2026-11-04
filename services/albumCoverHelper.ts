import type { Album, OfficialColor } from '../types';

export interface CoverArtStyleOption {
  id: string;
  name: string;
  badge: string;
  description: string;
  promptGuidance: string;
  iconName: string;
}

export const COVER_ART_STYLES: CoverArtStyleOption[] = [
  {
    id: 'surreal_chrome',
    name: 'Surreal 3D Chrome & Liquid Artifact',
    badge: 'High Concept',
    description: 'Suspended liquid mercury geometry, hyper-glossy metallic emblem sculpture, directional softbox lighting, chromatic dispersion.',
    promptGuidance: 'High-concept 3D abstract sculpture of a floating liquid chrome metallic centerpiece and reflective sculptural emblem suspended in an architectural minimalist studio set. Glossy liquid metal reflections, subtle rainbow chromatic dispersion, directional studio lighting, sleek avant-garde typography.',
    iconName: 'Sparkles'
  },
  {
    id: 'cyber_y2k',
    name: 'Y2K Cyber Hologram & Translucent Jewel Case',
    badge: 'Futuristic',
    description: 'Iridescent CD jewel case refraction, acid typography, foil-stamped laser decals, cybernetic circuit flourishes, prismatic glow.',
    promptGuidance: 'Y2K aesthetic CD jewel case cover art with translucent iridescent prismatic refractions, acid typography, metallic foil stickers, cybernetic vector geometry, holographic gradient glow in official colors, hyper-stylish 2000s futuristic graphic design.',
    iconName: 'Disc'
  },
  {
    id: 'dark_fantasy',
    name: 'Dark Fantasy Relic & Monolithic Obsidian',
    badge: 'Atmospheric',
    description: 'Monolithic obsidian stone altar, glowing runic typography, volumetric atmospheric fog, mystical moonlight, ancient celestial relic.',
    promptGuidance: 'Dramatic dark fantasy album art featuring an ancient monolithic obsidian artifact radiating mystical energy in the group\'s official colors. Volumetric cinematic mist, chiaroscuro moonlight, intricate celestial engravings, enigmatic high-art mood.',
    iconName: 'Shield'
  },
  {
    id: 'ethereal_biolum',
    name: 'Ethereal Bioluminescent Crystalline Flora',
    badge: 'Dreamy',
    description: 'Bioluminescent glass flowers, suspended prismatic water droplets, celestial nebula background, glowing organic crystal forms.',
    promptGuidance: 'Ethereal surrealist macro photography of glowing bioluminescent crystal botanical flowers blooming in zero gravity. Shimmering prismatic water droplets, delicate glass petals refracting soft ambient light in official colors, dreamy cosmic depth of field.',
    iconName: 'Flame'
  },
  {
    id: 'brutalist_editorial',
    name: 'Brutalist Avant-Garde & Risograph Print',
    badge: 'Editorial',
    description: 'Swiss International Typographic Style, bold constructivist geometric color blocking, textured risograph paper grain, minimalist graphic stamps.',
    promptGuidance: 'Award-winning Swiss modernist graphic design LP cover with bold geometric color blocking, rich tactile risograph paper texture, minimalist typographic hierarchy, abstract vector emblems, high-fashion art museum exhibition poster aesthetics.',
    iconName: 'FileText'
  },
  {
    id: 'retro_synthwave',
    name: 'Retro Vinyl & Neon Wireframe Grid',
    badge: 'Retro Wave',
    description: 'Analog cassette & vinyl sleeve aging, retro-futuristic wireframe grid horizon, glowing neon sunset, Japanese city-pop typography.',
    promptGuidance: 'Nostalgic 1980s retro-futuristic synthwave album cover with a glowing neon wireframe grid horizon, chrome geometric centerpiece, subtle analog vinyl sleeve ring wear, vibrant sunset neon gradients in official palette, Japanese city-pop typography.',
    iconName: 'Radio'
  },
  {
    id: 'minimal_luxury',
    name: 'Minimalist Luxury & Blind Debossed Paper',
    badge: 'Luxury Clean',
    description: 'Heavyweight textured cotton art paper, elegant blind debossing, metallic gold or silver foil letterpress stamping, generous negative space.',
    promptGuidance: 'Ultra-luxurious minimalist album cover packaging. Heavyweight off-white textured cotton paper with tactile blind debossing and metallic gold and silver foil stamped typography, expansive negative space, timeless high-fashion luxury aesthetic.',
    iconName: 'Star'
  },
  {
    id: 'cosmic_abstract',
    name: 'Cosmic Nebula & Prismatic Light Portal',
    badge: 'Celestial',
    description: 'Swirling celestial nebula, multidimensional crystal portal, laser light beams splitting into official color spectrums.',
    promptGuidance: 'Deep space cosmic nebula with a multidimensional prismatic portal splitting bright laser beams into the official color spectrum. Swirling stardust, floating glass planetary fragments, hyper-detailed astronomical surrealism.',
    iconName: 'Globe'
  }
];

export const CURATED_VISUAL_METAPHORS = [
  "A suspended liquid chrome heart blooming with glowing crystal thorns in a misty neon studio",
  "A cracked antique hourglass leaking iridescent stardust and glowing neon liquid onto a dark podium",
  "A levitating obsidian geometric prism splitting laser beams into the group's official color spectrum",
  "A hyper-detailed glass ocular sphere reflecting a radiant supernova explosion in deep cosmic space",
  "An iridescent mechanical butterfly with liquid chrome wings perched on a frozen crystalline lotus flower",
  "A floating golden antique key unlocking a dimensional doorway into swirling iridescent stardust",
  "A holographic skull sculpted from translucent diamond gemstone crystals covered in wild neon botanical vines",
  "A melting chrome audio cassette tape submerged in an ocean of shimmering liquid mercury",
  "A celestial solar eclipse encircled by floating metallic orbital rings and glowing runic glyphs",
  "A delicate blown-glass bird shattering mid-flight into thousands of prismatic glowing diamonds",
  "A monolithic shattered stone mirror floating over a pitch-black reflective water horizon",
  "A glowing geometric dodecahedron emitting vibrant neon laser beams through volumetric atmospheric fog",
  "A pair of interlocking chrome hands holding a floating miniature planetary sphere with glowing auroras",
  "A surreal architectural staircase leading up to a radiant neon portal in a minimalist museum gallery",
  "A vintage microphone wrapped in blooming luminescent wild orchids and golden dewdrops"
];

export function getSuggestedVisualMetaphor(albumTitle: string, concept: string = '', titleTrack: string = ''): string {
  const lower = `${albumTitle} ${concept} ${titleTrack}`.toLowerCase();
  if (lower.includes('love') || lower.includes('heart') || lower.includes('romance') || lower.includes('crush') || lower.includes('kiss')) {
    return "A suspended liquid chrome heart blooming with glowing crystal thorns in a misty neon studio";
  }
  if (lower.includes('dark') || lower.includes('night') || lower.includes('shadow') || lower.includes('moon') || lower.includes('monster') || lower.includes('devil') || lower.includes('void')) {
    return "A monolithic obsidian geometric prism encircled by glowing runic glyphs under cinematic moonlight";
  }
  if (lower.includes('super') || lower.includes('nova') || lower.includes('star') || lower.includes('cosmos') || lower.includes('galaxy') || lower.includes('space') || lower.includes('solar')) {
    return "A celestial supernova explosion contained inside a floating translucent glass sphere in deep space";
  }
  if (lower.includes('time') || lower.includes('memory') || lower.includes('chrono') || lower.includes('clock') || lower.includes('forever') || lower.includes('rewind')) {
    return "A cracked glass hourglass leaking iridescent stardust and glowing neon liquid onto a chrome pedestal";
  }
  if (lower.includes('fire') || lower.includes('flame') || lower.includes('burn') || lower.includes('heat') || lower.includes('wild') || lower.includes('ignite')) {
    return "A suspended golden geometric sculpture engulfed in stylized liquid neon flames and floating amber embers";
  }
  if (lower.includes('ice') || lower.includes('frost') || lower.includes('cold') || lower.includes('crystal') || lower.includes('glacier') || lower.includes('winter')) {
    return "An intricate geometric crystal snowflake frozen inside a block of liquid chrome and sapphire ice";
  }
  if (lower.includes('dream') || lower.includes('fantasy') || lower.includes('magic') || lower.includes('illusion') || lower.includes('wonder')) {
    return "A floating shattered mirror reflecting a vibrant dimensional portal with glowing iridescent butterflies";
  }
  if (lower.includes('invincible') || lower.includes('rebel') || lower.includes('crown') || lower.includes('king') || lower.includes('queen') || lower.includes('power')) {
    return "A floating fractured royal crown sculpted from raw titanium and glowing gemstones on a sleek altar";
  }
  if (lower.includes('sound') || lower.includes('beat') || lower.includes('wave') || lower.includes('vibe') || lower.includes('tempo') || lower.includes('dance')) {
    return "A sculptural soundwave visualizer frozen in liquid chrome and surrounded by iridescent floating spheres";
  }
  
  // Default unique metaphor
  return "A high-concept abstract chrome and glass sculpture suspended over a reflective water surface in directional studio lighting";
}

export function getRandomVisualMetaphor(current?: string): string {
  const filtered = CURATED_VISUAL_METAPHORS.filter(m => m !== current);
  return filtered[Math.floor(Math.random() * filtered.length)] || CURATED_VISUAL_METAPHORS[0];
}

export function buildAlbumCoverPrompt(params: {
  album: Album;
  groupName: string;
  agency: string;
  officialColors?: OfficialColor[];
  logoDescription?: string;
  styleId?: string;
  visualMetaphor?: string;
  customNotes?: string;
  packagingStyle?: 'vinyl' | 'jewel_case' | 'clean_print';
}): string {
  const {
    album,
    groupName,
    agency,
    officialColors,
    logoDescription,
    styleId = 'surreal_chrome',
    visualMetaphor,
    customNotes,
    packagingStyle = 'vinyl'
  } = params;

  const selectedStyle = COVER_ART_STYLES.find(s => s.id === styleId) || COVER_ART_STYLES[0];
  const paletteText = officialColors && officialColors.length > 0
    ? officialColors.map(c => `"${c.name}" (${c.hex})`).join(', ')
    : 'Vibrant Emerald & Gilded Gold';

  const activeMetaphor = visualMetaphor && visualMetaphor.trim().length > 5
    ? visualMetaphor.trim()
    : getSuggestedVisualMetaphor(album.title, album.conceptSummary || '', album.titleTrack);

  const packagingDesc = packagingStyle === 'jewel_case'
    ? 'Format: Y2K transparent CD jewel case packaging mockup with realistic plastic refraction, tray card spine, and holographic sticker seal stamp.'
    : (packagingStyle === 'clean_print'
      ? 'Format: Ultra-clean borderless square fine-art album print with pristine negative space and museum gallery presentation.'
      : 'Format: Premium 12-inch vinyl LP record gatefold jacket sleeve presentation with realistic spine typography, cardboard texture, and glossy varnish.');

  return `Award-winning official K-pop album cover graphic design for "${album.title}" by "${groupName}".
Agency / Record Label: "${agency || 'A&R Entertainment'}".
Album Format: ${album.type} • Title Track: "${album.titleTrack}".
Album Era Concept: "${album.conceptSummary || 'Artistic evolution and signature sound'}".

CORE VISUAL METAPHOR & SCULPTURAL CENTERPIECE:
${activeMetaphor}.

ART DIRECTION & AESTHETIC STYLE (${selectedStyle.name}):
${selectedStyle.promptGuidance}

COLOR HARMONY & PALETTE:
Official Palette: ${paletteText}.
Atmosphere: High-contrast directional lighting, subtle volumetric atmosphere, rich reflections, pristine specular highlights.

TYPOGRAPHY & BRANDING:
- Album Title: "${album.title}" rendered in bespoke, high-fashion avant-garde typography.
- Artist Name: "${groupName}" positioned with clean editorial alignment.
- Official Group Emblem: Subtle stylized motif based on group branding (${logoDescription || 'Iconic minimalist geometric emblem'}).

PACKAGING SPECIFICATION:
${packagingDesc}
${customNotes && customNotes.trim().length > 0 ? `DIRECTORIAL CUSTOM NOTES: ${customNotes.trim()}` : ''}

CRITICAL ANTI-CLICHÉ RULES:
- STRICT NO-GROUP-PHOTO RULE: ABSOLUTELY NO generic human photos or casual portrait headshots of the members. This is an iconic, fine-art conceptual graphic design and sculptural masterpiece.
- Ultra-detailed 8K resolution, award-winning commercial graphic design and packaging art.`;
}
