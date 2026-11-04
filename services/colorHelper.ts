// Robust K-Pop Stylist Color & Swatch Resolver
// Safely handles strings ("Cobalt Blue"), hexes ("#2563EB"), and object formats ({ role, name, hex })

const COLOR_MAP: Record<string, string> = {
  // Darks / Neutrals
  black: '#121214',
  pitch: '#09090B',
  charcoal: '#27272A',
  smoked: '#3F3F46',
  slate: '#475569',
  espresso: '#382216',
  white: '#F8FAFC',
  chalk: '#F1F5F9',
  cream: '#FEF3C7',
  ivory: '#FFFBEB',
  cashmere: '#E2E8F0',
  sand: '#FDE68A',
  beige: '#E7E5E4',
  oatmeal: '#F5F5F4',
  grey: '#64748B',
  gray: '#64748B',
  silver: '#CBD5E1',

  // Blues
  cobalt: '#1D4ED8',
  navy: '#0F172A',
  midnight: '#1E1B4B',
  twilight: '#312E81',
  cyan: '#06B6D4',
  teal: '#0D9488',
  turquoise: '#14B8A6',
  sky: '#0284C7',
  ocean: '#0369A1',
  blue: '#2563EB',

  // Reds / Pinks / Purples
  vermilion: '#E11D48',
  crimson: '#BE123C',
  scarlet: '#DC2626',
  ruby: '#9F1239',
  burgundy: '#881337',
  cherry: '#E11D48',
  wine: '#4C0519',
  red: '#DC2626',
  rose: '#E11D48',
  pink: '#DB2777',
  fuchsia: '#C026D3',
  magenta: '#D946EF',
  purple: '#9333EA',
  violet: '#7C3AED',
  lavender: '#A855F7',
  lilac: '#C084FC',

  // Greens
  emerald: '#059669',
  olive: '#65A30D',
  sage: '#84CC16',
  mint: '#10B981',
  forest: '#064E3B',
  green: '#16A34A',

  // Yellows / Oranges
  gold: '#D97706',
  amber: '#D97706',
  tangerine: '#EA580C',
  orange: '#EA580C',
  peach: '#FB923C',
  terracotta: '#C2410C',
  yellow: '#CA8A04'
};

export function getColorHex(colorOrHex?: any): string {
  if (!colorOrHex) return '#64748B';
  if (typeof colorOrHex === 'object') {
    if (colorOrHex.hex && typeof colorOrHex.hex === 'string' && colorOrHex.hex.startsWith('#')) {
      return colorOrHex.hex;
    }
    colorOrHex = colorOrHex.name || '';
  }
  if (typeof colorOrHex !== 'string') return '#64748B';
  
  const trimmed = colorOrHex.trim();
  if (trimmed.startsWith('#') && (trimmed.length === 4 || trimmed.length === 7 || trimmed.length === 9)) {
    return trimmed;
  }

  const lower = trimmed.toLowerCase();
  for (const [keyword, hex] of Object.entries(COLOR_MAP)) {
    if (lower.includes(keyword)) {
      return hex;
    }
  }

  // Deterministic fallback generator for arbitrary color names
  let hash = 0;
  for (let i = 0; i < lower.length; i++) {
    hash = lower.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 65%, 45%)`;
}

export interface NormalizedSwatch {
  role: string;
  name: string;
  hex: string;
  usage: string;
}

export function normalizeColorPalette(rawPalette?: any): NormalizedSwatch[] {
  const defaultRoles = ['Base (60%)', 'Secondary (30%)', 'Accent Pop (10%)'];
  const defaultUsages = [
    '60% Main fabric & coats',
    '30% Layering & pants',
    '10% Accessories & trims'
  ];

  if (!rawPalette || !Array.isArray(rawPalette) || rawPalette.length === 0) {
    return [
      { role: 'Base (60%)', name: 'Midnight Charcoal', hex: '#1E293B', usage: '60% Main fabric & coats' },
      { role: 'Secondary (30%)', name: 'Chalk White', hex: '#F8FAFC', usage: '30% Layering & pants' },
      { role: 'Accent Pop (10%)', name: 'Electric Vermilion', hex: '#EF4444', usage: '10% Accessories & trims' }
    ];
  }

  return rawPalette.map((c: any, idx: number) => {
    const role = (typeof c === 'object' && c?.role) ? c.role : defaultRoles[idx] || `Color ${idx + 1}`;
    const name = (typeof c === 'string') ? c : (c?.name || `Tone ${idx + 1}`);
    const hex = getColorHex(c);
    const usage = (typeof c === 'object' && c?.usage) ? c.usage : defaultUsages[idx] || `${name} application`;

    return { role, name, hex, usage };
  });
}
