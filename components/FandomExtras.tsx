import React, { useState, useRef, useEffect } from 'react';
import type { FullProfile, MemberProfileData, MerchItem, PhotocardItem, TourStop } from '../types';
import { 
  Sparkles, Zap, MapPin, Award, HeartHandshake, ShoppingBag, 
  Download, Loader2, Star, RefreshCw, Plus, Trash2, Check, 
  Edit3, Music, Volume2, ShieldCheck, Ticket, Eye, 
  Smile, Radio, ChevronRight, X, Camera, Layers, CheckCircle2,
  Lock, Flame, Dices, MessageSquareQuote, FileDown
} from 'lucide-react';
import { generateImage } from '../services/geminiService';
import { generateBespokeFandomSlogans } from '../services/profileDataHelper';
import { exportDossierToPdf } from '../services/pdfExporter';
import { toPng } from 'html-to-image';

interface FandomExtrasProps {
  profile: FullProfile;
  onUpdateProfile?: (updated: Partial<FullProfile>) => void;
}

const DEFAULT_MERCH_TEMPLATES: MerchItem[] = [
  {
    id: 'merch-1',
    name: 'Official World Tour Oversized Zip Hoodie',
    category: 'Apparel',
    priceUSD: 85,
    priceKRW: 115000,
    description: 'Heavyweight French terry cotton with metallic group logo embroidery on chest and world tour dates silk-screened on back.',
    isOfficial: true,
    tag: 'BESTSELLER'
  },
  {
    id: 'merch-2',
    name: 'Deluxe 180g Colored Marble Vinyl LP',
    category: 'Media',
    priceUSD: 48,
    priceKRW: 65000,
    description: 'Limited edition colored vinyl pressed with official group palette swirl, gatefold jacket, poster, and 24p lyric photo-booklet.',
    isOfficial: true,
    tag: 'LIMITED'
  },
  {
    id: 'merch-3',
    name: 'Official Slogan Cheering Towel',
    category: 'Concert',
    priceUSD: 22,
    priceKRW: 30000,
    description: 'Reflective holographic lettering on plush microfiber that glows under concert arena lights.',
    isOfficial: true,
    tag: 'CONCERT ESSENTIAL'
  },
  {
    id: 'merch-4',
    name: 'Complete Member Acrylic Standee & Stage Set',
    category: 'Collectibles',
    priceUSD: 36,
    priceKRW: 49000,
    description: 'High-clarity laser cut acrylic figures with custom diorama stage background and member signature engravings.',
    isOfficial: true
  },
  {
    id: 'merch-5',
    name: 'Official Mascot Character Plush Keychain',
    category: 'Collectibles',
    priceUSD: 24,
    priceKRW: 32000,
    description: 'Ultra-soft micro-plush mascot dressed in the comeback era signature stage outfit.',
    isOfficial: true,
    tag: 'FAN FAVORITE'
  },
  {
    id: 'merch-6',
    name: 'Embroidered Tour Beret & Deco Pin Set',
    category: 'Apparel',
    priceUSD: 32,
    priceKRW: 43000,
    description: 'Wool blend beret with silver-finish metal emblem badge and enamel pin pack.',
    isOfficial: true
  },
  {
    id: 'merch-7',
    name: 'Holographic Stardust Photocard Binder Album',
    category: 'Accessories',
    priceUSD: 28,
    priceKRW: 38000,
    description: '4-pocket archival-safe trading card album with glitter foil cover and exclusive promo photocard slot.',
    isOfficial: true
  },
  {
    id: 'merch-8',
    name: 'Lightstick Custom Pouch & Deco Ring Band',
    category: 'Accessories',
    priceUSD: 26,
    priceKRW: 35000,
    description: 'Padded protective cross-body carrying case with silicone pastel deco rings and member charm strap.',
    isOfficial: true
  }
];

export const FandomExtras: React.FC<FandomExtrasProps> = ({ profile, onUpdateProfile }) => {
  const [activeTab, setActiveTab] = useState<'brand_assets' | 'merch' | 'photocards' | 'tour' | 'lore' | 'edit'>('brand_assets');

  // Fandom & Colors
  const fandomName = profile.fandom?.name || `${profile.groupName} Fandom`;
  const fandomMeaning = profile.fandom?.nameOrigin || profile.fandom?.meaning || "The forever companion shining light on our journey.";
  const colors = profile.officialColors && profile.officialColors.length > 0
    ? profile.officialColors
    : [{ hex: '#10b981', name: 'Primary Emerald', description: 'Official Hue' }];
  const mainColor = colors[0]?.hex || '#10b981';
  const secondaryColor = colors[1]?.hex || colors[0]?.hex || '#064e3b';

  // Lightstick state
  const [isGeneratingLightstick, setIsGeneratingLightstick] = useState(false);
  const [generatedLightstick, setGeneratedLightstick] = useState<string | null>(profile.fandom?.lightstickUrl || null);
  const [lightstickError, setLightstickError] = useState<string | null>(null);
  const [lightstickColor, setLightstickColor] = useState<string>(mainColor);
  const [lightstickEffect, setLightstickEffect] = useState<'solid' | 'pulse' | 'strobe' | 'rainbow' | 'wave'>('solid');
  const [isAudienceSyncActive, setIsAudienceSyncActive] = useState<boolean>(true);

  // Merch State & Mannequin Config
  const [merchCatalog, setMerchCatalog] = useState<MerchItem[]>(profile.fandom?.merchItems || DEFAULT_MERCH_TEMPLATES);
  const [cart, setCart] = useState<{ item: MerchItem; quantity: number; selectedOption?: string }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [generatingMerchId, setGeneratingMerchId] = useState<string | null>(null);
  const [merchError, setMerchError] = useState<string | null>(null);
  const [isAddingCustomMerch, setIsAddingCustomMerch] = useState(false);
  const [newMerchName, setNewMerchName] = useState('');
  const [newMerchCategory, setNewMerchCategory] = useState<MerchItem['category']>('Apparel');
  const [newMerchPrice, setNewMerchPrice] = useState(35);
  const [newMerchDesc, setNewMerchDesc] = useState('');
  const [mannequinStyle, setMannequinStyle] = useState<'dual' | 'female' | 'male'>('dual');

  // Photocard Gacha & Binder
  const [isGeneratingPC, setIsGeneratingPC] = useState(false);
  const [pcMember, setPcMember] = useState<MemberProfileData | null>(null);
  const [pcRarity, setPcRarity] = useState<PhotocardItem['rarity']>('Common');
  const [pulledCard, setPulledCard] = useState<PhotocardItem | null>(null);
  const [pcError, setPcError] = useState<string | null>(null);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [selectedBinderCard, setSelectedBinderCard] = useState<PhotocardItem | null>(null);
  const [binderFilterMember, setBinderFilterMember] = useState<string>('All');
  
  // Photocard Customization Controls
  const [pcConceptTheme, setPcConceptTheme] = useState<'backstage' | 'ending_fairy' | 'stage_concept' | 'cozy_beret' | 'golden_hour'>('backstage');
  const [pcCustomPose, setPcCustomPose] = useState<string>('');
  const [selectedPullMemberIdx, setSelectedPullMemberIdx] = useState<number | null>(null);
  const [isBatchPulling, setIsBatchPulling] = useState(false);
  const [batchPullProgress, setBatchPullProgress] = useState<{ current: number; total: number; memberName: string } | null>(null);

  const [collectedCards, setCollectedCards] = useState<PhotocardItem[]>(() => {
    return profile.fandom?.photocardsCollected || [];
  });

  // Mascot state
  const [isGeneratingMascot, setIsGeneratingMascot] = useState(false);
  const [mascotUrl, setMascotUrl] = useState<string | null>(profile.fandom?.mascotUrl || null);
  const [mascotError, setMascotError] = useState<string | null>(null);

  // Keep lightstick, mascot, and merch catalog synchronized with parent profile updates
  useEffect(() => {
    if (profile.fandom?.lightstickUrl && profile.fandom.lightstickUrl !== generatedLightstick) {
      setGeneratedLightstick(profile.fandom.lightstickUrl);
    }
    if (profile.fandom?.mascotUrl && profile.fandom.mascotUrl !== mascotUrl) {
      setMascotUrl(profile.fandom.mascotUrl);
    }
    if (profile.fandom?.merchItems && profile.fandom.merchItems.length > 0) {
      setMerchCatalog(profile.fandom.merchItems);
    }
  }, [profile.fandom?.lightstickUrl, profile.fandom?.mascotUrl, profile.fandom?.merchItems]);

  // Tour Ticket Studio
  const [ticketFanName, setTicketFanName] = useState('STARLIGHT_VIP');
  const [selectedTourIndex, setSelectedTourIndex] = useState(0);
  const [ticketTier, setTicketTier] = useState<'VIP Soundcheck All-Access' | 'VIP Floor Standing' | 'General Admission Tier 1'>('VIP Soundcheck All-Access');
  const [ticketSeat, setTicketSeat] = useState('Floor A - Row 1 - Seat 07');
  const ticketRef = useRef<HTMLDivElement>(null);
  const [isDownloadingTicket, setIsDownloadingTicket] = useState(false);

  // Tour Stops list
  const baseYear = profile.debutDate ? parseInt(profile.debutDate.split('-')[0]) : 2026;
  const tourStops: TourStop[] = profile.fandom?.worldTourLocations || [
    { city: "Seoul", country: "South Korea", venue: "KSPO Olympic Dome", date: `${baseYear + 1}.04.18 - 04.20`, status: "Sold Out" },
    { city: "Tokyo", country: "Japan", venue: "Tokyo Dome", date: `${baseYear + 1}.05.02 - 05.04`, status: "Sold Out" },
    { city: "Los Angeles", country: "USA", venue: "BMO Stadium", date: `${baseYear + 1}.06.14`, status: "Sold Out" },
    { city: "New York", country: "USA", venue: "Prudential Center Arena", date: `${baseYear + 1}.06.21`, status: "Selling Fast" },
    { city: "London", country: "UK", venue: "The O2 Arena", date: `${baseYear + 1}.07.09`, status: "Sold Out" },
    { city: "Paris", country: "France", venue: "Accor Arena", date: `${baseYear + 1}.07.15`, status: "Available" },
    { city: "Bangkok", country: "Thailand", venue: "Impact Arena", date: `${baseYear + 1}.08.01`, status: "Sold Out" },
    { city: "Sydney", country: "Australia", venue: "Qudos Bank Arena", date: `${baseYear + 1}.08.20`, status: "Selling Fast" },
  ];

  // Fan Chant state
  const [activeChantStep, setActiveChantStep] = useState(0);
  const [isChantPlaying, setIsChantPlaying] = useState(false);

  // Edit Fandom Info Form
  const [editFandomName, setEditFandomName] = useState(fandomName);
  const [editFandomPronunciation, setEditFandomPronunciation] = useState(profile.fandom?.pronunciation || "");
  const [editFandomOrigin, setEditFandomOrigin] = useState(fandomMeaning);
  const [editFandomMotto, setEditFandomMotto] = useState(profile.fandom?.fandomMotto || `Rooted in ${profile.groupName}, blooming with ${fandomName}`);
  const [editLightstickDesc, setEditLightstickDesc] = useState(profile.fandom?.lightstickDescription || "");
  const [editTourName, setEditTourName] = useState(profile.fandom?.worldTourName || `${profile.groupName} 1st World Tour: [THE HORIZON]`);

  // Bespoke Fandom Slogan & Motto AI Generation State
  const [isGeneratingSlogans, setIsGeneratingSlogans] = useState(false);
  const [sloganOptions, setSloganOptions] = useState<string[]>([]);
  const [sloganSuccessMsg, setSloganSuccessMsg] = useState<string | null>(null);

  // Sync state to parent profile
  const saveFandomUpdates = (updatedFields: Partial<NonNullable<FullProfile['fandom']>>) => {
    if (!onUpdateProfile) return;
    const currentFandom = profile.fandom || {
      name: fandomName,
      nameOrigin: fandomMeaning,
      lightstickDescription: "",
      fandomPersonality: "Passionate, loyal, and creative",
      fandomMotto: "",
      handGesturePrompt: ""
    };
    onUpdateProfile({
      fandom: {
        ...currentFandom,
        ...updatedFields
      }
    });
  };

  // Generate Bespoke Fandom Slogans via AI
  const handleGenerateBespokeSlogans = async () => {
    setIsGeneratingSlogans(true);
    setSloganSuccessMsg(null);
    try {
      const result = await generateBespokeFandomSlogans(
        profile.groupName,
        fandomName,
        profile.conceptDescription || 'K-pop group',
        colors
      );

      const allSlogans = [result.primarySlogan, ...(result.alternativeSlogans || [])].filter(Boolean);
      setSloganOptions(allSlogans);
      setEditFandomMotto(result.primarySlogan);
      if (result.pronunciation) {
        setEditFandomPronunciation(result.pronunciation);
      }

      const updatePayload: Partial<FullProfile> = {
        fandom: {
          ...(profile.fandom || {
            name: fandomName,
            nameOrigin: fandomMeaning,
            lightstickDescription: '',
            fandomPersonality: 'Passionate, loyal, and creative',
            fandomMotto: '',
            handGesturePrompt: ''
          }),
          fandomMotto: result.primarySlogan,
          nameOrigin: result.nameOrigin || profile.fandom?.nameOrigin || fandomMeaning,
          pronunciation: result.pronunciation || profile.fandom?.pronunciation || editFandomPronunciation
        }
      };

      if (result.greetingMotto && result.greetingGesture) {
        updatePayload.greeting = {
          motto: result.greetingMotto,
          gesture: result.greetingGesture
        };
      }

      if (onUpdateProfile) {
        onUpdateProfile(updatePayload);
      }

      setSloganSuccessMsg("Generated bespoke concept-tied slogans, pronunciation guide, and signature greeting!");
      setTimeout(() => setSloganSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error("Failed to generate bespoke slogans:", err);
    } finally {
      setIsGeneratingSlogans(false);
    }
  };

  const handleSelectSlogan = (slogan: string) => {
    setEditFandomMotto(slogan);
    saveFandomUpdates({ fandomMotto: slogan });
    setSloganSuccessMsg(`Applied slogan: "${slogan}"`);
    setTimeout(() => setSloganSuccessMsg(null), 3000);
  };

  // Generate Lightstick Mockup
  const handleGenerateLightstick = async () => {
    setIsGeneratingLightstick(true);
    setLightstickError(null);
    try {
      const paletteText = colors.map(c => `"${c.name}" (${c.hex})`).join(', ');
      const refImages: any[] = [];
      if (profile.logoUrl) {
        refImages.push({ label: `${profile.groupName} Official Logo Emblem`, dataUrl: profile.logoUrl });
      }
      if (profile.groupPhotoUrl) {
        refImages.push({ label: `${profile.groupName} Group Reference`, dataUrl: profile.groupPhotoUrl });
      }

      const prompt = `Hyper-realistic 3D commercial product photoshoot of the official K-pop concert lightstick for the group "${profile.groupName}".
Fandom Name: ${fandomName}.
Agency / Label: ${profile.agency}.
Group Official Logo & Emblem: ${profile.logoDescription || 'Official group logo emblem'}.
Group Concept: ${profile.conceptDescription || 'High-concept K-pop'}.
Lightstick Concept & Structure: ${profile.fandom?.lightstickDescription || 'A sleek, premium glowing acrylic dome with an internal floating geometric emblem'}.
Official Color Palette: ${paletteText}.
Setting & Packaging: Seamless pure white minimalist studio photography background.
On a clean presentation surface, display the glowing lightstick emitting vibrant light in these exact official palette colors, standing beside its official luxury retail collector packaging box displaying the group's official logo design and geometric typography.
Studio lighting, 8k resolution, crisp textures, award-winning industrial design packaging mockup on pure white studio background with soft contact reflections.`;
      
      const img = await generateImage(prompt, "16:9", refImages.length > 0 ? refImages : undefined);
      setGeneratedLightstick(img);
      saveFandomUpdates({ lightstickUrl: img });
    } catch (err: any) {
      console.error(err);
      setLightstickError(err.message || "Failed to generate lightstick mockup.");
    } finally {
      setIsGeneratingLightstick(false);
    }
  };

  // Generate Merch Mockup with prerequisite gating, reference injection, and mannequin/table presentation
  const handleGenerateMerchImage = async (item: MerchItem) => {
    const lightstickImg = generatedLightstick || profile.fandom?.lightstickUrl;
    const mascotImg = mascotUrl || profile.fandom?.mascotUrl;

    // Prerequisite Gate: Must wait until lightstick and mascot are generated
    if (!lightstickImg || !mascotImg) {
      const missing = [];
      if (!lightstickImg) missing.push("Official Lightstick (with logo/box packaging)");
      if (!mascotImg) missing.push("Official Group Mascot Character");
      setMerchError(`🔒 Merch Studio Locked: Please generate the ${missing.join(" and ")} first! The studio requires these visual references to design authentic branded goods.`);
      return;
    }

    setGeneratingMerchId(item.id);
    setMerchError(null);
    try {
      const paletteText = colors.map(c => `"${c.name}" (${c.hex})`).join(', ');
      const refImages: any[] = [];
      
      // Inject Lightstick Design & Box Packaging
      if (lightstickImg) {
        refImages.push({ label: `${profile.groupName} Official Lightstick & Box Packaging Design`, dataUrl: lightstickImg });
      }
      // Inject Mascot Character
      if (mascotImg) {
        refImages.push({ label: `${profile.groupName} Official Mascot Character Art`, dataUrl: mascotImg });
      }
      // Inject Logo & Group Photo if present
      if (profile.logoUrl) {
        refImages.push({ label: `${profile.groupName} Official Logo Emblem`, dataUrl: profile.logoUrl });
      }
      if (profile.groupPhotoUrl) {
        refImages.push({ label: `${profile.groupName} Group Photo Reference`, dataUrl: profile.groupPhotoUrl });
      }

      // Check if product is wearable / apparel
      const isWearable = item.category === 'Apparel' || 
        /hoodie|tee|t-shirt|shirt|jacket|jersey|bomber|cardigan|sweatshirt|beret|cap|hat|beanie|socks|scarf|windbreaker|pants|shorts|vest|wearable/i.test(item.name);
      const isHeadwear = /beret|cap|hat|beanie|headband/i.test(item.name);

      let presentationDirective = '';
      if (isHeadwear) {
        presentationDirective = `Product Presentation: Displayed resting on a sculpted minimalist matte white head and bust mannequin dummy form in a seamless solid pure white studio.`;
      } else if (isWearable) {
        if (mannequinStyle === 'female') {
          presentationDirective = `Product Presentation: Dressed elegantly on a sleek tailored female dress form mannequin dummy in a seamless solid pure white studio, showing authentic garment drape, stitch details, and chest embroidery.`;
        } else if (mannequinStyle === 'male') {
          presentationDirective = `Product Presentation: Dressed sharply on a sleek tailored male mannequin torso dummy in a seamless solid pure white studio, showing authentic garment drape, stitch details, and chest embroidery.`;
        } else {
          presentationDirective = `Product Presentation: Inclusive dual mannequin display featuring a pair of tailored male and female mannequin dummies standing side-by-side in a seamless solid pure white studio, modeling how the apparel looks on both silhouettes with realistic fabric texture, natural drape, and crisp branding prints.`;
        }
      } else {
        presentationDirective = `Product Presentation: Neatly displayed elevated on a sleek minimalist matte white presentation table / white acrylic display riser in a seamless solid pure white studio background with soft commercial studio lighting and delicate contact reflections, making it look ultra-presentable, premium, and retail catalog-ready.`;
      }

      const prompt = `Official commercial product catalog photo of official K-pop merchandise: "${item.name}".
Artist / Group: "${profile.groupName}".
Agency / Label: "${profile.agency}".
Group Concept: ${profile.conceptDescription || 'K-pop idol group'}.
Item Category: ${item.category}.
Item Description: ${item.description}.
Official Theme & Color Palette: ${paletteText}.
Branding Elements: Incorporate the group's official logo design (from the official lightstick packaging box) and the official group mascot theme ("${profile.fandom?.mascotName || 'Official Mascot'}") into the product styling.
${presentationDirective}
Environment & Studio Background: Seamless solid pure white minimalist studio photography infinity background (solid pure white background) with clean commercial studio lighting, soft subtle ground shadows, and zero cluttered background elements. Ultra-sharp commercial catalog quality.`;

      const img = await generateImage(prompt, "1:1", refImages.length > 0 ? refImages : undefined);
      const updatedCatalog = merchCatalog.map(m => m.id === item.id ? { ...m, imageUrl: img } : m);
      setMerchCatalog(updatedCatalog);
      saveFandomUpdates({ merchItems: updatedCatalog });
    } catch (err: any) {
      console.error(err);
      setMerchError(err.message || `Failed to generate mockup for ${item.name}`);
    } finally {
      setGeneratingMerchId(null);
    }
  };

  // Add custom merch item
  const handleAddCustomMerch = () => {
    if (!newMerchName.trim()) return;
    const newItem: MerchItem = {
      id: `custom-merch-${Date.now()}`,
      name: newMerchName.trim(),
      category: newMerchCategory,
      priceUSD: newMerchPrice,
      priceKRW: Math.round(newMerchPrice * 1350),
      description: newMerchDesc.trim() || `Official custom ${newMerchCategory.toLowerCase()} item for ${fandomName}.`,
      isOfficial: true,
      tag: 'NEW'
    };
    const updated = [newItem, ...merchCatalog];
    setMerchCatalog(updated);
    saveFandomUpdates({ merchItems: updated });
    setNewMerchName('');
    setNewMerchDesc('');
    setIsAddingCustomMerch(false);
  };

  // Cart operations
  const handleAddToCart = (item: MerchItem, option?: string) => {
    setCart(prev => {
      const existing = prev.find(p => p.item.id === item.id && p.selectedOption === option);
      if (existing) {
        return prev.map(p => p.item.id === item.id && p.selectedOption === option ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { item, quantity: 1, selectedOption: option }];
    });
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const cartTotalUSD = cart.reduce((sum, item) => sum + item.item.priceUSD * item.quantity, 0);
  const cartTotalKRW = cart.reduce((sum, item) => sum + item.item.priceKRW * item.quantity, 0);

  // Helper: Extract accurate active hairstyle & hair color for each member
  const getMemberActiveHairInfo = (member: MemberProfileData) => {
    const isDyed = Boolean(
      member.dyedHairColor && 
      member.dyedHairColor !== 'none' && 
      !member.dyedHairColor.toLowerCase().includes('keeps natural') && 
      !member.dyedHairColor.toLowerCase().includes('natural')
    );
    const hairColor = isDyed ? (member.dyedHairColor as string) : (member.originalHairColor || 'natural dark espresso');
    const hairStyle = member.currentHairStyle || `${member.originalHairType || 'straight'} styled hair`;
    return {
      isDyed,
      hairColor,
      hairStyle,
      summary: `${hairStyle} • ${isDyed ? `Dyed ${hairColor}` : `Natural ${hairColor}`}`
    };
  };

  // Helper: Construct an authentic, identity-locked photocard prompt with distinct photographic style per theme
  const buildMemberPhotocardPrompt = (
    member: MemberProfileData,
    concept: 'backstage' | 'ending_fairy' | 'stage_concept' | 'cozy_beret' | 'golden_hour' = 'backstage',
    customPose?: string
  ) => {
    const groupType = profile.groupType;
    const isBoyGroup = groupType === 'Boy Group';
    const isGirlGroup = groupType === 'Girl Group';
    const genderCategory = isBoyGroup ? 'MALE (Boy Group Member)' : (isGirlGroup ? 'FEMALE (Girl Group Member)' : 'MALE OR FEMALE');
    const genderWord = isBoyGroup ? 'male' : (isGirlGroup ? 'female' : 'person');

    const hair = getMemberActiveHairInfo(member);
    const facialDetails = member.distinctFacialFeatures ? `Distinct facial traits: ${member.distinctFacialFeatures}.` : '';
    const eyeDetails = member.eyeColor ? `Eye color: ${member.eyeColor}.` : '';

    const identityInstruction = member.imageUrl
      ? `CRITICAL EXACT FACIAL IDENTITY MATCH:
You MUST maintain the EXACT same person, facial bone structure, jawline, eye shape, nose shape, lip contours, ${member.skinTone} skin tone, and ${member.race} ethnicity as the K-pop idol ${member.stageName} shown in the attached reference image.
DO NOT GENERATE A RANDOM DIFFERENT IDOL. This is specifically the real member ${member.stageName}.`
      : `CRITICAL IDENTITY MANDATE:
This is the official K-pop idol ${member.stageName}, an attractive youthful 18-22 year old ${member.race} ${genderCategory} with ${member.skinTone} skin tone. ${facialDetails} ${eyeDetails} Real human facial features, organic bone structure, healthy radiant skin pores. THIS IS A ${genderWord.toUpperCase()}, DO NOT GENERATE THE WRONG GENDER.`;

    const hairMandate = `CRITICAL EXACT HAIRSTYLE & HAIR COLOR MANDATE (STRICTLY DO NOT CHANGE):
- EXACT CURRENT HAIRSTYLE: ${hair.hairStyle}
- EXACT CURRENT HAIR COLOR: ${hair.hairColor}
- HAIR TEXTURE: ${member.originalHairType || 'straight'}
STRICT REQUIREMENT: You MUST keep this exact hairstyle (${hair.hairStyle}) and exact hair color (${hair.hairColor}). DO NOT change their hairstyle. DO NOT give them a random or different hairstyle or different hair color.`;

    // 1. Music Show Ending Fairy (4K Live TV Broadcast Close-up)
    if (concept === 'ending_fairy') {
      const defaultPose = 'Breathing heavily right after finishing an intense choreography routine, delicate wink into the 4K broadcast camera, breathy soft smile, finger heart or peace sign near cheek';
      const poseInstruction = customPose?.trim() ? `Custom Action/Expression: ${customPose.trim()}.` : `Ending Fairy Action: ${defaultPose}.`;

      return `Official 4K Broadcast TV Screenshot Photocard of real K-pop idol ${member.stageName} as a Music Show Ending Fairy (Inkigayo / Music Bank / M Countdown ending fairy shot).
${identityInstruction}
${hairMandate}
${poseInstruction}
Photographic Style & Framing: Professional TV broadcast studio camera zoom-in close-up shot (chest-up face focus). Slight sweat glistened on collarbone/forehead from intense dancing, glowing dewy stage makeup, expressive eye contact staring directly into the broadcast camera lens with floating pink and gold paper confetti sparkles fluttering around them.
Stage Environment: Major K-pop music show broadcast stage with vibrant neon LED backdrop screens, dramatic overhead stage spotlights, soft stage fog/haze, and twinkling ambient stage lights.
Strict Negative Rules: NO smartphone holding, NO backstage room, NO dressing room mirrors, NO casual room, NO text, NO logos, NO watermarks, NO white borders, NO distorted hands. High-definition authentic K-pop ending fairy broadcast photocard photo.`;
    }

    // 2. Stage Performance (Live Concert Action Photocard)
    if (concept === 'stage_concept') {
      const defaultPose = 'Powerful, charismatic performance pose: mid-song vocals near wireless custom stage microphone, intense smize gaze, flying hair strands, confident posture';
      const poseInstruction = customPose?.trim() ? `Custom Action/Expression: ${customPose.trim()}.` : `Performance Action: ${defaultPose}.`;

      return `Official Live Concert Action Photocard of real K-pop idol ${member.stageName} performing live on a world tour stage.
${identityInstruction}
${hairMandate}
${poseInstruction}
Photographic Style & Framing: High-speed fansite master / professional stage photography portrait shot (medium close-up). Wearing a dazzling custom stage outfit and holding a sleek wireless stage microphone or wearing a headset mic. Dynamic motion blur in background, sharp focus on the idol.
Stage Environment: Stadium arena stage with blinding laser light beams, glowing pyro sparkler fireworks in background, stadium floodlights, and a crowded arena atmosphere.
Strict Negative Rules: NO selfie holding, NO backstage dressing room, NO casual room, NO text, NO watermarks, NO white borders, NO distorted hands. Ultra high-res live concert photocard photo.`;
    }

    // 3. Cozy Beret / Album Concept Photo (Album Photobook Studio Shot)
    if (concept === 'cozy_beret') {
      const defaultPose = 'Cute Fansign / Season\'s Greetings pose: resting chin on hand with a soft adorable smile, wearing a chic beret hat or cozy plush oversized sweater';
      const poseInstruction = customPose?.trim() ? `Custom Action/Expression: ${customPose.trim()}.` : `Fansign Pose: ${defaultPose}.`;

      return `Official Album Photobook / Season's Greetings Photocard of real K-pop idol ${member.stageName}.
${identityInstruction}
${hairMandate}
${poseInstruction}
Photographic Style & Framing: Warm studio portrait photo shoot for an official K-pop Season's Greetings photobook. Intimate soft-focus lighting, wearing stylish plush winter knitwear, beret cap or cute hair ribbon. Holding a cute plushie, polaroid frame, or cup of warm cocoa.
Environment: Aesthetic soft pastel studio background with cozy props (piles of books, dried flowers, fairy string lights).
Strict Negative Rules: NO stage lights, NO backstage dressing room clutter, NO smartphone holding, NO text, NO watermarks, NO white borders. Warm, ultra-high-resolution album photobook photocard photo.`;
    }

    // 4. Golden Hour Sunset (Outdoor Tour / Travel Photo)
    if (concept === 'golden_hour') {
      const defaultPose = 'Natural sun-kissed outdoor pose: wind-blown hair, warm radiant smile looking into the lens, casually brushing hair back';
      const poseInstruction = customPose?.trim() ? `Custom Action/Expression: ${customPose.trim()}.` : `Sunset Action: ${defaultPose}.`;

      return `Official Outdoor Travel / World Tour Photocard of real K-pop idol ${member.stageName} during golden hour sunset.
${identityInstruction}
${hairMandate}
${poseInstruction}
Photographic Style & Framing: Natural outdoor portrait captured during peak golden hour sunset. Warm amber sun flare, golden rim lighting outlining their hair strands, soft natural bokeh background, warm glowing skin tones.
Environment: Scenic rooftop terrace or coastal beach overlook with a brilliant sunset sky (pink, orange, gold hues) and city skyline in distant soft focus.
Strict Negative Rules: NO stage lights, NO indoor dressing room, NO studio lights, NO text, NO watermarks, NO white borders. Breathtaking golden hour outdoor photocard photo.`;
    }

    // 5. Default Backstage Selfie
    const defaultPose = 'Charming natural selfie pose: cute cheek heart, peace sign, or cute wink with a warm friendly smile';
    const poseInstruction = customPose?.trim() ? `Custom Pose & Action: ${customPose.trim()}.` : `Selfie Pose: ${defaultPose}.`;

    return `Close-up candid smartphone selfie-style photocard of real K-pop idol ${member.stageName}.
${identityInstruction}
${hairMandate}
${poseInstruction}
Photographic Style & Framing: High-resolution vertical smartphone front-camera selfie (chest-up / close-up framing). Authentic smartphone lens focal length, natural raw skin texture, flattering selfie mirror ring-light reflection.
Setting: Cozy backstage waiting room or music show dressing room makeup station with vanity light bulbs in background.
Strict Negative Rules: NO stage fog, NO stadium lasers, NO text, NO watermarks, NO white borders, NO distorted hands. Ultra high-res candid authentic K-pop backstage selfie photocard image.`;
  };

  // Photocard Pulling (Single Card with Likeness & Hairstyle Locking)
  const handlePullPhotocard = async (
    targetMember?: MemberProfileData, 
    customTheme?: 'backstage' | 'ending_fairy' | 'stage_concept' | 'cozy_beret' | 'golden_hour',
    customPoseStr?: string,
    existingCardId?: string
  ) => {
    setIsGeneratingPC(true);
    setPcError(null);
    setIsCardFlipped(false);
    try {
      const members = profile.members || [];
      if (members.length === 0) throw new Error("No members found in profile.");
      
      const member = targetMember || (selectedPullMemberIdx !== null && members[selectedPullMemberIdx]) || members[Math.floor(Math.random() * members.length)];
      setPcMember(member);

      const theme = customTheme || pcConceptTheme;
      const pose = customPoseStr !== undefined ? customPoseStr : pcCustomPose;

      const roll = Math.random();
      let rarity: PhotocardItem['rarity'] = 'Common';
      let foilType: PhotocardItem['foilType'] = 'classic';
      if (roll > 0.92) {
        rarity = 'Secret Rare';
        foilType = 'stardust';
      } else if (roll > 0.75) {
        rarity = 'Holo Rare';
        foilType = 'prism';
      } else if (roll > 0.45) {
        rarity = 'Rare';
        foilType = 'gold_emboss';
      }

      setPcRarity(rarity);

      const prompt = buildMemberPhotocardPrompt(member, theme, pose);
      const refImages: any[] = [];
      if (member.imageUrl) {
        refImages.push({ label: `${member.stageName} Official Idol Face Reference`, dataUrl: member.imageUrl });
      }
      if (profile.logoUrl) {
        refImages.push({ label: `${profile.groupName} Official Logo Emblem`, dataUrl: profile.logoUrl });
      }

      const img = await generateImage(prompt, "2:3", refImages.length > 0 ? refImages : undefined);

      const themeTitleMap = {
        backstage: 'Backstage Selfie',
        ending_fairy: 'Ending Fairy',
        stage_concept: 'Stage Performance',
        cozy_beret: 'Cozy Pajama Special',
        golden_hour: 'Golden Hour Tour'
      };

      const newCard: PhotocardItem = {
        id: existingCardId || `pc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        memberName: member.stageName,
        memberIndex: members.findIndex(m => m.stageName === member.stageName),
        rarity: rarity,
        eraTitle: `${profile.discography?.[0]?.title || 'Debut Era'} [${themeTitleMap[theme]}]`,
        imageUrl: img,
        backMessage: `To my sweetest ${fandomName}! Thank you for always lighting up every step of our path. Let's make this era unforgettable! 💕✨`,
        signature: `${member.stageName} ♡`,
        foilType: foilType,
        unlockedAt: new Date().toLocaleDateString()
      };

      setPulledCard(newCard);
      
      // Add or replace in persistent collection
      setCollectedCards(prev => {
        const filtered = existingCardId ? prev.filter(c => c.id !== existingCardId) : prev;
        const updated = [newCard, ...filtered];
        saveFandomUpdates({ photocardsCollected: updated });
        return updated;
      });

      if (selectedBinderCard && selectedBinderCard.id === existingCardId) {
        setSelectedBinderCard(newCard);
      }

    } catch (err: any) {
      console.error(err);
      setPcError(err.message || "Failed to pull photocard.");
    } finally {
      setIsGeneratingPC(false);
    }
  };

  // Batch Pull Complete Set for all members
  const handleBatchPullAllMembers = async () => {
    const members = profile.members || [];
    if (members.length === 0) return;
    setIsBatchPulling(true);
    setPcError(null);

    const newCards: PhotocardItem[] = [];

    try {
      for (let i = 0; i < members.length; i++) {
        const member = members[i];
        setBatchPullProgress({ current: i + 1, total: members.length, memberName: member.stageName });

        const roll = Math.random();
        let rarity: PhotocardItem['rarity'] = 'Common';
        let foilType: PhotocardItem['foilType'] = 'classic';
        if (roll > 0.90) {
          rarity = 'Secret Rare';
          foilType = 'stardust';
        } else if (roll > 0.70) {
          rarity = 'Holo Rare';
          foilType = 'prism';
        } else if (roll > 0.40) {
          rarity = 'Rare';
          foilType = 'gold_emboss';
        }

        const prompt = buildMemberPhotocardPrompt(member, pcConceptTheme, pcCustomPose);
        const refImages: any[] = [];
        if (member.imageUrl) {
          refImages.push({ label: `${member.stageName} Official Idol Face Reference`, dataUrl: member.imageUrl });
        }
        if (profile.logoUrl) {
          refImages.push({ label: `${profile.groupName} Official Logo Emblem`, dataUrl: profile.logoUrl });
        }

        const img = await generateImage(prompt, "2:3", refImages.length > 0 ? refImages : undefined);

        const card: PhotocardItem = {
          id: `pc-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
          memberName: member.stageName,
          memberIndex: i,
          rarity: rarity,
          eraTitle: `${profile.discography?.[0]?.title || 'Debut Era'} [Full Set]`,
          imageUrl: img,
          backMessage: `Dearest ${fandomName}! With all my love from ${member.stageName}. Forever together! 💖✨`,
          signature: `${member.stageName} ♡`,
          foilType: foilType,
          unlockedAt: new Date().toLocaleDateString()
        };

        newCards.push(card);
      }

      const updatedCollection = [...newCards, ...collectedCards];
      setCollectedCards(updatedCollection);
      saveFandomUpdates({ photocardsCollected: updatedCollection });
      if (newCards.length > 0) {
        setPulledCard(newCards[0]);
      }
    } catch (err: any) {
      console.error(err);
      setPcError(err.message || "Failed during batch photocard pull.");
    } finally {
      setIsBatchPulling(false);
      setBatchPullProgress(null);
    }
  };

  // Delete card from binder
  const handleDeletePhotocard = (cardId: string) => {
    const updated = collectedCards.filter(c => c.id !== cardId);
    setCollectedCards(updated);
    saveFandomUpdates({ photocardsCollected: updated });
    if (selectedBinderCard?.id === cardId) {
      setSelectedBinderCard(null);
    }
    if (pulledCard?.id === cardId) {
      setPulledCard(null);
    }
  };

  // Generate Mascot
  const handleGenerateMascot = async () => {
    setIsGeneratingMascot(true);
    setMascotError(null);
    try {
      const paletteText = colors.map(c => `"${c.name}" (${c.hex})`).join(', ');
      const mascotName = profile.fandom?.mascotName || `${profile.groupName} Mascot`;
      const mascotDesc = profile.fandom?.mascotDescription || `An adorable, iconic cute animal character representing ${profile.groupName} and their fandom ${fandomName}.`;
      
      const refImages: any[] = [];
      if (profile.logoUrl) {
        refImages.push({ label: `${profile.groupName} Official Logo Emblem`, dataUrl: profile.logoUrl });
      }

      const prompt = `Official cute K-pop mascot character design for the group "${profile.groupName}".
Mascot Name: ${mascotName}.
Character Lore: ${mascotDesc}.
Group Concept: ${profile.conceptDescription || 'K-pop group'}.
Official Emblem Motif: ${profile.logoDescription || 'Group logo emblem'}.
Official Color Palette: ${paletteText}.
Art Style: Ultra clean 3D vinyl toy character illustration, soft rounded aesthetics like Sanrio / Line Friends / BT21. High-detail studio background with soft drop shadow. Incorporating official group colors and a subtle group emblem on the character.`;

      const img = await generateImage(prompt, "1:1", refImages.length > 0 ? refImages : undefined);
      setMascotUrl(img);
      saveFandomUpdates({ mascotUrl: img, mascotName: mascotName });
    } catch (err: any) {
      console.error(err);
      setMascotError(err.message || "Failed to generate mascot artwork.");
    } finally {
      setIsGeneratingMascot(false);
    }
  };

  // Download VIP Concert Ticket
  const handleDownloadTicket = async () => {
    if (!ticketRef.current) return;
    setIsDownloadingTicket(true);
    try {
      const dataUrl = await toPng(ticketRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `${profile.groupName}-WorldTour-VIP-Pass-${ticketFanName}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export ticket image', err);
    } finally {
      setIsDownloadingTicket(false);
    }
  };

  // Save Edit Fandom Info
  const handleSaveFandomEdit = () => {
    saveFandomUpdates({
      name: editFandomName.trim() || fandomName,
      pronunciation: editFandomPronunciation.trim(),
      nameOrigin: editFandomOrigin.trim() || fandomMeaning,
      fandomMotto: editFandomMotto.trim(),
      lightstickDescription: editLightstickDesc.trim(),
      worldTourName: editTourName.trim()
    });
    setActiveTab('lore');
  };

  // Fan chant simulated lyrics
  const titleTrack = profile.discography?.[0]?.tracks?.[0] || {
    title: profile.discography?.[0]?.titleTrack || "Signature Title Track",
    lyricExcerpt: "Step into the spotlight, feel the rhythm ignite / We are writing legends under the neon sky"
  };

  const fanChantLines = [
    { type: 'intro', text: `(Intro Beat Starts - Crowd Roars)`, chant: `[KIM JISOO! PARK CHAEYOUNG! ... ${profile.members?.map(m => m.stageName.toUpperCase()).join('! ')}! ${profile.groupName.toUpperCase()}!]` },
    { type: 'lyric', text: `Can you hear the bassline dropping through the floor?`, chant: `(DROPPING MORE!)` },
    { type: 'lyric', text: `We don't look back anymore, stepping through the door`, chant: `(OPEN THE DOOR!)` },
    { type: 'chorus', text: `${titleTrack.title} — Catch the fire, light the sky!`, chant: `[${profile.groupName.toUpperCase()}! DA-E-BAK! SARANGHAE!]` },
    { type: 'outro', text: `Yeah we keep it moving till the morning light`, chant: `(FOREVER WITH ${fandomName.toUpperCase()}!)` }
  ];

  // Cycling fan chant timer
  useEffect(() => {
    let timer: number | null = null;
    if (isChantPlaying) {
      timer = window.setInterval(() => {
        setActiveChantStep(prev => (prev + 1) % fanChantLines.length);
      }, 3200);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isChantPlaying, fanChantLines.length]);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
      
      {/* Top Banner & Fandom Identity Bar */}
      <div 
        className="rounded-2xl p-5 border border-neutral-200/80 shadow-xs relative overflow-hidden bg-white text-neutral-900"
        style={{
          background: `linear-gradient(135deg, ${mainColor}12 0%, #ffffff 40%, ${secondaryColor}10 100%)`
        }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[7.5px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-neutral-900 text-white shadow-2xs">
                OFFICIAL FANDOM HQ
              </span>
              <span className="text-[7.5px] font-mono font-bold text-neutral-500 uppercase">
                EST. {profile.debutDate || '2026'}
              </span>
            </div>
            
            <div className="flex items-baseline gap-3 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-neutral-950">
                {fandomName}
              </h2>
              {(profile.fandom?.pronunciation || editFandomPronunciation) && (
                <span className="text-[11px] font-mono font-bold text-neutral-700 bg-neutral-100/90 px-2.5 py-0.5 rounded-full border border-neutral-300 shadow-2xs">
                  Pronounced: [{profile.fandom?.pronunciation || editFandomPronunciation}]
                </span>
              )}
              <span className="text-xs font-bold italic text-neutral-600">
                "{profile.fandom?.fandomMotto || `Rooted in ${profile.groupName}, blooming with ${fandomName}`}"
              </span>
            </div>

            <p className="text-xs text-neutral-600 font-medium max-w-2xl leading-relaxed">
              <span className="font-bold text-neutral-900">Name Origin & Meaning: </span>
              {fandomMeaning}
            </p>
          </div>

          {/* Official Colors Bar & Quick Badges */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-xs p-1.5 rounded-xl border border-neutral-200/80 shadow-2xs">
              <span className="text-[7.5px] font-black text-neutral-400 uppercase tracking-widest px-1">COLORS:</span>
              {colors.map((col, idx) => (
                <div key={idx} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-neutral-50 border border-neutral-200">
                  <div className="w-3 h-3 rounded-full border border-black/10 shadow-inner" style={{ backgroundColor: col.hex }} />
                  <div className="text-[8px] font-black text-neutral-800 leading-tight">
                    <span>{col.name}</span>
                    <span className="font-mono text-neutral-400 block text-[6.5px]">{col.hex}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => exportDossierToPdf(profile as FullProfile)}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-full text-[8.5px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                title="Export complete dossier including Lightstick & Mascot to PDF"
              >
                <FileDown className="w-3 h-3 text-indigo-600" />
                <span>Export Dossier (PDF)</span>
              </button>
              <button
                onClick={() => setIsCartOpen(true)}
                className="bg-neutral-900 hover:bg-neutral-800 text-white px-3 py-1.5 rounded-full text-[8.5px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <ShoppingBag className="w-3 h-3 text-emerald-400" />
                <span>Haul Bag ({cart.reduce((sum, i) => sum + i.quantity, 0)})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-neutral-200 pb-1 gap-1 overflow-x-auto scrollbar-none">
        {(() => {
          const hasLightstick = Boolean(generatedLightstick || profile.fandom?.lightstickUrl);
          const hasMascot = Boolean(mascotUrl || profile.fandom?.mascotUrl);
          const brandAssetsCount = (hasLightstick ? 1 : 0) + (hasMascot ? 1 : 0);

          return [
            { 
              id: 'brand_assets', 
              label: '1. Lightstick & Mascot Studio', 
              icon: Zap, 
              badge: brandAssetsCount === 2 ? 'Ready ✓' : `${brandAssetsCount}/2 Ready`,
              isComplete: brandAssetsCount === 2
            },
            { id: 'merch', label: '2. Official Merch & Store', icon: ShoppingBag, count: merchCatalog.length },
            { id: 'photocards', label: 'Photocard Gacha & Binder', icon: Sparkles, count: collectedCards.length },
            { id: 'tour', label: 'World Tour & VIP Pass', icon: MapPin },
            { id: 'lore', label: 'Fandom Lore & Fan Chant', icon: HeartHandshake },
            { id: 'edit', label: 'Edit Fandom', icon: Edit3 }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200/70'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-neutral-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[7px] font-mono font-black uppercase tracking-wider ${
                    tab.isComplete ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                  }`}>
                    {tab.badge}
                  </span>
                )}
                {typeof tab.count === 'number' && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[7.5px] font-mono font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-700'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          });
        })()}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs min-h-[460px]">
        
        {/* ================= BRAND ASSETS: LIGHTSTICK & MASCOT TAB ================= */}
        {activeTab === 'brand_assets' && (() => {
          const hasLightstick = Boolean(generatedLightstick || profile.fandom?.lightstickUrl);
          const hasMascot = Boolean(mascotUrl || profile.fandom?.mascotUrl);
          const bothReady = hasLightstick && hasMascot;

          return (
            <div className="space-y-8">
              {/* Top Launchpad & Prerequisites Banner */}
              <div className="p-5 bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 text-white rounded-2xl space-y-4 shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-3 border-b border-neutral-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="text-[7.5px] font-black uppercase tracking-widest text-emerald-400 font-mono">
                        STEP 1: BRAND ASSET FOUNDATION
                      </span>
                    </div>
                    <h3 className="text-base font-black uppercase tracking-tight text-white mt-1">
                      Official Lightstick & Mascot Studio
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
                      Generate the <strong>Official Lightstick</strong> (with retail collector box packaging & group logo) and the <strong>Group Mascot</strong> character. Once created, these brand prerequisites automatically unlock and power the <strong>Official Merch Store</strong> in Tab 2!
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('merch')}
                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                      bothReady
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-md font-black'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Proceed to Merch Store (Tab 2)</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Quick Status Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Lightstick Status */}
                  <div className={`p-3 rounded-xl border flex items-center justify-between ${
                    hasLightstick 
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                      : 'bg-neutral-900/90 border-amber-500/40 text-amber-300'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${hasLightstick ? 'bg-emerald-500 text-neutral-950 font-bold' : 'bg-amber-500/20 text-amber-400'}`}>
                        {hasLightstick ? <Check className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-wider text-white">1. Official Lightstick & Box Logo</div>
                        <div className="text-[8.5px] font-medium text-neutral-400">
                          {hasLightstick ? 'Ready ✓ Brand packaging connected' : 'Missing: Generate 3D mockup below'}
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[7px] font-mono font-black uppercase tracking-wider ${
                      hasLightstick ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {hasLightstick ? 'Active' : 'Pending'}
                    </span>
                  </div>

                  {/* Mascot Status */}
                  <div className={`p-3 rounded-xl border flex items-center justify-between ${
                    hasMascot 
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                      : 'bg-neutral-900/90 border-amber-500/40 text-amber-300'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${hasMascot ? 'bg-emerald-500 text-neutral-950 font-bold' : 'bg-amber-500/20 text-amber-400'}`}>
                        {hasMascot ? <Check className="w-4 h-4" /> : <Smile className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-wider text-white">2. Group Mascot Character Art</div>
                        <div className="text-[8.5px] font-medium text-neutral-400">
                          {hasMascot ? 'Ready ✓ Mascot art connected' : 'Missing: Generate 3D mascot below'}
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[7px] font-mono font-black uppercase tracking-wider ${
                      hasMascot ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {hasMascot ? 'Active' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* ================= SECTION 1: LIGHTSTICK STUDIO ================= */}
              <div className="p-6 bg-neutral-50/70 border border-neutral-200 rounded-2xl space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-neutral-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-wider text-neutral-950">
                        1. Official Concert Lightstick & 3D Box Packaging Studio
                      </h4>
                      <p className="text-xs text-neutral-500">
                        Interactive cheering apparatus controller and 3D retail box packaging render.
                      </p>
                    </div>
                  </div>
                  {hasLightstick && (
                    <span className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-[8px] font-black uppercase tracking-wider flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Packaging Ready</span>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left: Lightstick Interactive Controls */}
                  <div className="lg:col-span-5 space-y-4">
                    <div>
                      <h5 className="text-lg font-black uppercase tracking-tight text-neutral-950" style={{ color: lightstickColor }}>
                        {profile.fandom?.lightstickName || `${profile.groupName} Official Bong`}
                      </h5>
                      <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                        {profile.fandom?.lightstickDescription || `The official central synchronized concert lightstick for ${fandomName}, designed with iconic custom internal geometry glowing in the group's official color palette.`}
                      </p>
                    </div>

                    {/* Controller Console */}
                    <div className="p-4 bg-white border border-neutral-200 rounded-2xl space-y-3 shadow-xs">
                      <h6 className="text-[8px] font-black uppercase tracking-widest text-neutral-500 flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-amber-500" />
                        Interactive Concert Light Controller
                      </h6>

                      {/* Color Selector */}
                      <div>
                        <label className="text-[7px] font-black text-neutral-400 uppercase tracking-widest block mb-1.5">
                          LED Beam Palette Mode:
                        </label>
                        <div className="flex gap-2 flex-wrap">
                          {colors.map((c, i) => (
                            <button
                              key={i}
                              onClick={() => setLightstickColor(c.hex)}
                              className={`px-3 py-1.5 rounded-xl text-[8px] font-black uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
                                lightstickColor === c.hex
                                  ? 'bg-neutral-900 text-white shadow-sm ring-2 ring-neutral-900'
                                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 border border-neutral-200'
                              }`}
                            >
                              <span className="w-2.5 h-2.5 rounded-full border border-black/10" style={{ backgroundColor: c.hex }} />
                              <span>{c.name}</span>
                            </button>
                          ))}
                          <button
                            onClick={() => setLightstickColor('#ffffff')}
                            className={`px-3 py-1.5 rounded-xl text-[8px] font-black uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
                              lightstickColor === '#ffffff'
                                ? 'bg-neutral-900 text-white shadow-sm ring-2 ring-neutral-900'
                                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 border border-neutral-200'
                            }`}
                          >
                            <span className="w-2.5 h-2.5 rounded-full bg-white border border-neutral-300" />
                            <span>White Strobe</span>
                          </button>
                        </div>
                      </div>

                      {/* Mode Selector */}
                      <div>
                        <label className="text-[7px] font-black text-neutral-400 uppercase tracking-widest block mb-1.5">
                          Stadium Lighting Animation:
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {[
                            { id: 'solid', label: 'Solid Glow' },
                            { id: 'pulse', label: 'Heart Pulse' },
                            { id: 'strobe', label: 'Strobe Flash' },
                            { id: 'rainbow', label: 'Prism Cycle' },
                            { id: 'wave', label: 'Ocean Wave' }
                          ].map(mode => (
                            <button
                              key={mode.id}
                              onClick={() => setLightstickEffect(mode.id as any)}
                              className={`py-1.5 px-2 rounded-lg text-[7.5px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                                lightstickEffect === mode.id
                                  ? 'bg-neutral-900 text-white shadow-2xs'
                                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 border border-neutral-200'
                              }`}
                            >
                              {mode.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Audience Stadium Sync Toggle */}
                      <div className="pt-2 border-t border-neutral-200 flex justify-between items-center">
                        <span className="text-[8px] font-bold text-neutral-600">Bluetooth Stadium Mesh Sync</span>
                        <button
                          onClick={() => setIsAudienceSyncActive(!isAudienceSyncActive)}
                          className={`px-3 py-1 rounded-full text-[7.5px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                            isAudienceSyncActive
                              ? 'bg-emerald-600 text-white'
                              : 'bg-neutral-200 text-neutral-500'
                          }`}
                        >
                          {isAudienceSyncActive ? 'SYNCED (55,000 ACTIVE)' : 'OFFLINE'}
                        </button>
                      </div>
                    </div>

                    {/* 3D Glowing Lightstick Model Preview Box */}
                    <div className="bg-neutral-950 rounded-2xl p-5 text-center relative overflow-hidden border border-neutral-800 flex flex-col items-center justify-center min-h-[200px]">
                      <div 
                        className="absolute w-40 h-40 rounded-full blur-3xl opacity-60 transition-all duration-700 pointer-events-none"
                        style={{
                          backgroundColor: lightstickColor,
                          animation: lightstickEffect === 'pulse' ? 'pulse 1.2s infinite' : lightstickEffect === 'strobe' ? 'ping 0.4s infinite' : 'none'
                        }}
                      />

                      <div className="relative z-10 flex flex-col items-center">
                        <div 
                          className="w-16 h-16 rounded-full border-2 border-white/60 flex items-center justify-center shadow-2xl relative transition-all duration-300"
                          style={{
                            backgroundColor: `${lightstickColor}40`,
                            boxShadow: `0 0 35px ${lightstickColor}`
                          }}
                        >
                          <div className="w-8 h-8 rounded-full border border-white/80 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white animate-spin" style={{ animationDuration: '6s' }} />
                          </div>
                        </div>
                        <div className="w-3 h-3 bg-neutral-700 border-x border-neutral-600"></div>
                        <div className="w-4 h-20 bg-gradient-to-b from-neutral-200 via-neutral-100 to-neutral-400 rounded-b-md shadow-lg relative flex flex-col items-center justify-between py-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 shadow-inner"></div>
                          <span className="text-[4px] font-black uppercase text-neutral-800 rotate-90 tracking-widest">
                            {profile.groupName}
                          </span>
                          <div className="w-2 h-0.5 bg-neutral-400 rounded"></div>
                        </div>
                      </div>

                      <span className="text-[7.5px] font-black uppercase tracking-widest text-neutral-400 mt-3 relative z-10 font-mono">
                        LIVE STADIUM GLOW PREVIEW
                      </span>
                    </div>
                  </div>

                  {/* Right: AI 3D Product & Box Packaging Mockup */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[7.5px] font-black uppercase tracking-widest text-neutral-400 font-mono">
                        OFFICIAL RETAIL PACKAGING & PRODUCT MOCKUP
                      </span>

                      {generatedLightstick && (
                        <a
                          href={generatedLightstick}
                          download={`${profile.groupName}-Official-Lightstick.png`}
                          className="text-[8px] font-black uppercase text-neutral-700 hover:text-neutral-950 flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-neutral-200 shadow-2xs"
                        >
                          <Download className="w-3 h-3" />
                          <span>Save 4K Mockup</span>
                        </a>
                      )}
                    </div>

                    {lightstickError && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold">
                        {lightstickError}
                      </div>
                    )}

                    {!generatedLightstick ? (
                      <div className="aspect-[16/9] bg-white rounded-2xl border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center p-8 text-center space-y-3 shadow-xs">
                        <Zap className="w-10 h-10 text-amber-500/60" />
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900">Generate 3D Official Lightstick Mockup</h4>
                          <p className="text-[9px] text-neutral-500 max-w-sm mt-1">
                            Creates an official product render displaying the glowing lightstick along with its custom retail collector packaging box and group logo.
                          </p>
                        </div>
                        <button
                          onClick={handleGenerateLightstick}
                          disabled={isGeneratingLightstick}
                          className="bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {isGeneratingLightstick ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                              <span>Rendering 3D Product Mockup...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 text-amber-400" />
                              <span>Generate Official Mockup</span>
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-neutral-200 shadow-md relative group">
                          <img 
                            src={generatedLightstick} 
                            alt="Official Lightstick Mockup" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-neutral-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                            <span className="text-white text-[8px] font-black uppercase tracking-widest bg-black/60 px-3 py-1 rounded-full backdrop-blur-xs">
                              Studio Packaging & Lightstick Concept
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                            onClick={handleGenerateLightstick}
                            disabled={isGeneratingLightstick}
                            className="bg-neutral-900 hover:bg-neutral-800 text-white text-[8.5px] font-black uppercase tracking-wider px-4 py-2 rounded-full flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                          >
                            {isGeneratingLightstick ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                            ) : (
                              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                            )}
                            <span>Regenerate Lightstick Design</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Stadium Lightstick Ocean Simulation */}
                    <div className="bg-neutral-950 rounded-2xl p-4 border border-neutral-800 space-y-2">
                      <div className="flex justify-between items-center text-[7.5px] font-mono text-neutral-400 font-bold uppercase">
                        <span>STADIUM CROWD CHEERING OCEAN (55,000 FANS)</span>
                        <span className="text-emerald-400">● LIVE SYNC</span>
                      </div>

                      <div className="h-16 bg-neutral-900/60 rounded-xl p-3 flex flex-wrap gap-1.5 items-center justify-center overflow-hidden relative">
                        {Array.from({ length: 84 }).map((_, idx) => (
                          <div
                            key={idx}
                            className="w-1.5 h-1.5 rounded-full transition-all duration-500 shadow-sm"
                            style={{
                              backgroundColor: lightstickColor,
                              opacity: Math.sin(idx * 0.4 + (isAudienceSyncActive ? 2 : 0)) * 0.4 + 0.6,
                              transform: `scale(${Math.sin(idx * 0.3) * 0.4 + 1})`
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ================= SECTION 2: MASCOT & ANIMAL IDENTITIES STUDIO ================= */}
              <div className="p-6 bg-neutral-50/70 border border-neutral-200 rounded-2xl space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-neutral-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
                      <Smile className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-wider text-neutral-950">
                        2. Official Group Mascot & Member Animal Identities Studio
                      </h4>
                      <p className="text-xs text-neutral-500">
                        Explore character lore, member representative animals, and generate 3D mascot vinyl artwork.
                      </p>
                    </div>
                  </div>
                  {hasMascot && (
                    <span className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-[8px] font-black uppercase tracking-wider flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Mascot Art Ready</span>
                    </span>
                  )}
                </div>

                {mascotError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold">
                    {mascotError}
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Mascot Lore Card & Member Animals */}
                  <div className="lg:col-span-6 space-y-4">
                    <div className="p-5 bg-white border border-neutral-200 rounded-2xl space-y-3 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[7.5px] font-black uppercase tracking-widest text-neutral-400 font-mono">
                          OFFICIAL GROUP MASCOT
                        </span>
                        <span className="text-2xl">{profile.fandom?.mascotEmoji || '🧸'}</span>
                      </div>

                      <h5 className="text-lg font-black uppercase tracking-tight text-neutral-950">
                        {profile.fandom?.mascotName || `${profile.groupName} Official Mascot`}
                      </h5>

                      <p className="text-xs text-neutral-600 leading-relaxed">
                        {profile.fandom?.mascotDescription || `The adorable, high-spirited mascot companion created for ${profile.groupName} and ${fandomName}. Always cheering in the front row, carrying the official group lightstick, and bringing comfort to fans.`}
                      </p>

                      <div className="pt-2 border-t border-neutral-100">
                        <button
                          onClick={handleGenerateMascot}
                          disabled={isGeneratingMascot}
                          className="bg-neutral-900 hover:bg-neutral-800 text-white px-5 py-2 rounded-full text-[8.5px] font-black uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                        >
                          {isGeneratingMascot ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                          <span>{mascotUrl ? 'Regenerate Mascot Art' : 'Generate 3D Mascot Artwork'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Member Animal Gallery */}
                    <div className="space-y-2">
                      <span className="text-[7.5px] font-black text-neutral-400 uppercase tracking-widest font-mono block">
                        MEMBER REPRESENTATIVE ANIMAL PROFILES
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {profile.members?.map((member, idx) => (
                          <div key={idx} className="p-3 bg-white border border-neutral-200 rounded-xl flex items-center gap-3 shadow-2xs">
                            <span className="text-2xl">{member.representativeEmoji || '🐱'}</span>
                            <div className="min-w-0">
                              <h6 className="text-xs font-black text-neutral-900 uppercase truncate">{member.stageName}</h6>
                              <span className="text-[8px] font-bold text-neutral-500 block truncate">
                                {member.representativeAnimal || 'Kitten'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Mascot Visual Display */}
                  <div className="lg:col-span-6">
                    {mascotUrl ? (
                      <div className="space-y-3">
                        <div className="rounded-2xl overflow-hidden border border-neutral-200 shadow-md relative group aspect-square">
                          <img src={mascotUrl} alt="Mascot Art" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-neutral-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                            <a
                              href={mascotUrl}
                              download={`Mascot-${profile.groupName}.png`}
                              className="bg-white/95 text-neutral-900 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider shadow-md hover:bg-white transition-all"
                            >
                              Download 3D Artwork
                            </a>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                            onClick={handleGenerateMascot}
                            disabled={isGeneratingMascot}
                            className="bg-neutral-900 hover:bg-neutral-800 text-white text-[8.5px] font-black uppercase tracking-wider px-4 py-2 rounded-full flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                          >
                            {isGeneratingMascot ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                            ) : (
                              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                            )}
                            <span>Regenerate Mascot Art</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-square bg-white rounded-2xl border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center p-8 text-center space-y-3 shadow-xs">
                        <Smile className="w-12 h-12 text-amber-400/60" />
                        <div>
                          <h5 className="text-xs font-black uppercase tracking-wider text-neutral-900">3D Vinyl Mascot Character</h5>
                          <p className="text-[9px] text-neutral-500 max-w-xs mt-1">
                            Generate adorable 3D vinyl character artwork inspired by official group colors and mascot lore.
                          </p>
                        </div>
                        <button
                          onClick={handleGenerateMascot}
                          disabled={isGeneratingMascot}
                          className="bg-neutral-900 hover:bg-neutral-800 text-white px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider shadow-md transition-all cursor-pointer disabled:opacity-50"
                        >
                          {isGeneratingMascot ? 'Rendering Mascot...' : 'Generate 3D Mascot Character'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Transition Banner to Merch Store */}
              <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
                bothReady 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
                  : 'bg-amber-50 border-amber-200 text-amber-950'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${bothReady ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                    {bothReady ? <CheckCircle2 className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  </div>
                  <div>
                    <h5 className="text-xs font-black uppercase tracking-wider">
                      {bothReady ? 'Brand Assets Ready for Merch Production' : 'Complete Brand Assets to Unlock Merch Store'}
                    </h5>
                    <p className="text-[11px] text-neutral-600 mt-0.5">
                      {bothReady 
                        ? 'Your Lightstick Box Logo and Mascot character are active. Head into the Official Merch Store to generate custom hoodies, vinyls, and goods!' 
                        : 'Generate both the Lightstick (with box packaging) and Mascot above to unlock AI mockups in the store.'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('merch')}
                  className="bg-neutral-900 hover:bg-neutral-800 text-white text-[9px] font-black uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Open Official Merch Store (Tab 2)</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })()}

        {/* ================= MERCH TAB ================= */}
        {activeTab === 'merch' && (() => {
          const hasLightstick = Boolean(generatedLightstick || profile.fandom?.lightstickUrl);
          const hasMascot = Boolean(mascotUrl || profile.fandom?.mascotUrl);
          const isMerchLocked = !hasLightstick || !hasMascot;

          return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-neutral-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isMerchLocked ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                  <h3 className="text-sm font-black uppercase tracking-wider text-neutral-950">
                    Official Merch Collection & AI Product Studio
                  </h3>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Explore official concert goods, wearable apparel, and generate hyper-realistic AI product mockups on clean studio backgrounds.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsAddingCustomMerch(true)}
                  className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[8.5px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border border-neutral-300 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3 h-3 text-neutral-600" />
                  <span>Design Custom Merch</span>
                </button>
              </div>
            </div>

            {/* Prerequisite Gate: Required Lightstick & Mascot Checks */}
            {isMerchLocked ? (
              <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-amber-950">
                      Official Merch Studio Locked: Brand Assets Required
                    </h4>
                    <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5 font-medium">
                      Before generating merchandise mockups, you must generate the <strong>Official Lightstick</strong> (which includes the group logo and box packaging design) and the <strong>Group Mascot</strong>. The AI studio uses them as reference designs for authentic product creation.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Lightstick Status Card */}
                  <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                    hasLightstick 
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' 
                      : 'bg-white border-amber-200 text-amber-900 shadow-xs'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${hasLightstick ? 'bg-emerald-500 text-white' : 'bg-amber-100 text-amber-600'}`}>
                        {hasLightstick ? <Check className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-wider">1. Lightstick & Box Logo</div>
                        <div className="text-[9px] font-medium text-neutral-500">
                          {hasLightstick ? 'Ready ✓ Brand packaging active' : 'Missing: Generate lightstick first'}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('brand_assets')}
                      className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                        hasLightstick 
                          ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800' 
                          : 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                      }`}
                    >
                      {hasLightstick ? 'View Design' : 'Open Studio (Tab 1)'}
                    </button>
                  </div>

                  {/* Mascot Status Card */}
                  <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                    hasMascot 
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' 
                      : 'bg-white border-amber-200 text-amber-900 shadow-xs'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${hasMascot ? 'bg-emerald-500 text-white' : 'bg-amber-100 text-amber-600'}`}>
                        {hasMascot ? <Check className="w-4 h-4" /> : <Smile className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-wider">2. Group Mascot Character</div>
                        <div className="text-[9px] font-medium text-neutral-500">
                          {hasMascot ? 'Ready ✓ Mascot art active' : 'Missing: Generate mascot first'}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('brand_assets')}
                      className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                        hasMascot 
                          ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800' 
                          : 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                      }`}
                    >
                      {hasMascot ? 'View Mascot' : 'Open Studio (Tab 1)'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Unlocked Header: Brand Assets Connected & Mannequin Style Selector */
              <div className="p-4 bg-neutral-900 text-white rounded-2xl space-y-3.5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">
                      Brand References Active
                    </span>
                    <span className="text-[9px] text-neutral-400">
                      (Lightstick Box Logo & Mascot Art Loaded)
                    </span>
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-wider text-neutral-400 bg-white/10 px-2.5 py-1 rounded-full">
                    Pure White Studio Presentation
                  </span>
                </div>

                <div className="pt-2 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <label className="text-[8px] font-black uppercase tracking-wider text-neutral-300 block mb-1">
                      Wearables Presentation Form (Inclusive Studio Display)
                    </label>
                    <p className="text-[9px] text-neutral-400 leading-snug">
                      Apparel is photographed dressed on tailored mannequins; other items are elevated on sleek white display tables.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 shrink-0">
                    <button
                      onClick={() => setMannequinStyle('dual')}
                      className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                        mannequinStyle === 'dual'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                      title="Dual Display: Male & Female Mannequin Dummies Side-by-Side (Inclusive)"
                    >
                      👥 Dual (Male & Female)
                    </button>
                    <button
                      onClick={() => setMannequinStyle('female')}
                      className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                        mannequinStyle === 'female'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                      title="Female Dress Form Mannequin"
                    >
                      👗 Female Dummy
                    </button>
                    <button
                      onClick={() => setMannequinStyle('male')}
                      className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                        mannequinStyle === 'male'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                      title="Male Tailor's Dummy Form"
                    >
                      👔 Male Dummy
                    </button>
                  </div>
                </div>
              </div>
            )}

            {merchError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold flex items-center justify-between">
                <span>{merchError}</span>
                <button onClick={() => setMerchError(null)} className="text-rose-500 hover:text-rose-800"><X className="w-4 h-4" /></button>
              </div>
            )}

            {/* Custom Merch Modal / Form */}
            {isAddingCustomMerch && (
              <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-3 animate-in fade-in duration-200">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900">Add New Official Merch Item</h4>
                  <button onClick={() => setIsAddingCustomMerch(false)} className="text-neutral-400 hover:text-neutral-700"><X className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[7.5px] font-black text-neutral-500 uppercase block mb-1">Item Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Signature Satin Bomber Jacket"
                      value={newMerchName}
                      onChange={e => setNewMerchName(e.target.value)}
                      className="w-full border border-neutral-200 rounded-lg p-2 text-xs font-bold bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[7.5px] font-black text-neutral-500 uppercase block mb-1">Category</label>
                    <select 
                      value={newMerchCategory} 
                      onChange={e => setNewMerchCategory(e.target.value as any)}
                      className="w-full border border-neutral-200 rounded-lg p-2 text-xs font-bold bg-white"
                    >
                      <option value="Apparel">Apparel</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Collectibles">Collectibles</option>
                      <option value="Concert">Concert</option>
                      <option value="Media">Media</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[7.5px] font-black text-neutral-500 uppercase block mb-1">Price (USD $)</label>
                    <input 
                      type="number" 
                      value={newMerchPrice}
                      onChange={e => setNewMerchPrice(Number(e.target.value))}
                      className="w-full border border-neutral-200 rounded-lg p-2 text-xs font-bold bg-white"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="text-[7.5px] font-black text-neutral-500 uppercase block mb-1">Detailed Description & Materials</label>
                    <input 
                      type="text" 
                      placeholder="Describe material, colors, packaging, member versions..."
                      value={newMerchDesc}
                      onChange={e => setNewMerchDesc(e.target.value)}
                      className="w-full border border-neutral-200 rounded-lg p-2 text-xs font-bold bg-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button 
                    onClick={() => setIsAddingCustomMerch(false)}
                    className="px-3 py-1.5 text-[8.5px] font-black uppercase text-neutral-500 hover:text-neutral-800"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddCustomMerch}
                    className="bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-1.5 rounded-full text-[8.5px] font-black uppercase tracking-wider"
                  >
                    Save Item to Catalog
                  </button>
                </div>
              </div>
            )}

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {merchCatalog.map(item => {
                const isGeneratingThis = generatingMerchId === item.id;
                return (
                  <div 
                    key={item.id}
                    className="border border-neutral-200 rounded-2xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    {/* Visual / Mockup Container */}
                    <div className="aspect-square bg-neutral-100 relative overflow-hidden flex items-center justify-center">
                      {item.imageUrl ? (
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="p-6 text-center flex flex-col items-center justify-center space-y-2">
                          <ShoppingBag className="w-8 h-8 text-neutral-300" />
                          <span className="text-[7.5px] font-black uppercase tracking-widest text-neutral-400">
                            {item.category}
                          </span>
                          <p className="text-[9px] text-neutral-500 font-medium">No studio mockup generated yet</p>
                        </div>
                      )}

                      {item.tag && (
                        <span className="absolute top-2 left-2 bg-neutral-900/90 backdrop-blur-xs text-white text-[6.5px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md shadow-sm">
                          {item.tag}
                        </span>
                      )}

                      <button
                        onClick={() => {
                          if (isMerchLocked) {
                            setMerchError("🔒 Please generate the Official Lightstick (with logo/packaging) and Group Mascot first!");
                            return;
                          }
                          handleGenerateMerchImage(item);
                        }}
                        disabled={isGeneratingThis}
                        className={`absolute bottom-2 right-2 p-2 rounded-xl shadow-md border transition-all flex items-center gap-1 text-[7.5px] font-black uppercase cursor-pointer ${
                          isMerchLocked 
                            ? 'bg-amber-50/95 text-amber-800 border-amber-200 opacity-90 hover:opacity-100'
                            : 'bg-white/95 hover:bg-white text-neutral-900 border-neutral-200 opacity-90 group-hover:opacity-100 disabled:opacity-50'
                        }`}
                        title={isMerchLocked ? "Brand Assets Required: Generate Lightstick & Mascot First" : "Generate AI Product Mockup"}
                      >
                        {isGeneratingThis ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                        ) : isMerchLocked ? (
                          <>
                            <Lock className="w-3.5 h-3.5 text-amber-600" />
                            <span>Assets Needed</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span>{item.imageUrl ? 'Regen Mockup' : 'AI Mockup'}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Item Details */}
                    <div className="p-3.5 flex flex-col flex-grow justify-between space-y-2">
                      <div className="space-y-1">
                        <div className="flex justify-between items-baseline gap-1">
                          <span className="text-[7.5px] font-mono font-bold text-neutral-400 uppercase tracking-widest">{item.category}</span>
                          <div className="text-right">
                            <span className="text-xs font-black text-neutral-950">${item.priceUSD}</span>
                            <span className="text-[7px] font-mono text-neutral-400 block font-bold">₩{item.priceKRW.toLocaleString()}</span>
                          </div>
                        </div>
                        <h4 className="text-xs font-black text-neutral-900 leading-snug line-clamp-2">
                          {item.name}
                        </h4>
                        <p className="text-[8.5px] text-neutral-500 leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-neutral-100 flex gap-1.5">
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="flex-1 bg-neutral-900 hover:bg-neutral-800 active:scale-95 text-white py-1.5 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <ShoppingBag className="w-3 h-3 text-emerald-400" />
                          <span>Add To Bag</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          );
        })()}

        {/* ================= PHOTOCARDS TAB ================= */}
        {activeTab === 'photocards' && (
          <div className="space-y-6">
            
            {/* Header & Gacha Banner */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-3 border-b border-neutral-100">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-500" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-neutral-950">
                    Photocard Studio & Official Binder
                  </h3>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Pull authentic candid smartphone selfie photocards with locked member facial likeness and active hairstyles!
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black text-neutral-900 bg-neutral-100 px-3 py-1.5 rounded-full border border-neutral-200">
                  Binder: {collectedCards.length} / {Math.max(12, (profile.members?.length || 4) * 4)} Collected
                </span>
                <button
                  onClick={handleBatchPullAllMembers}
                  disabled={isGeneratingPC || isBatchPulling || (profile.members?.length || 0) === 0}
                  className="bg-neutral-900 hover:bg-neutral-800 text-white px-3.5 py-1.5 rounded-full text-[8.5px] font-black uppercase tracking-wider shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Generate a candid photocard for every member in the group"
                >
                  {isBatchPulling ? <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" /> : <Layers className="w-3.5 h-3.5 text-amber-400" />}
                  <span>Pull Full Album Set ({profile.members?.length || 0} Members)</span>
                </button>
              </div>
            </div>

            {/* Batch Pull Progress Indicator */}
            {isBatchPulling && batchPullProgress && (
              <div className="p-4 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 text-white rounded-2xl border border-white/10 shadow-lg space-y-2 animate-in fade-in duration-300">
                <div className="flex justify-between items-center text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                    <span className="font-black uppercase tracking-wider text-amber-300">
                      Generating Photocard Set ({batchPullProgress.current}/{batchPullProgress.total}):
                    </span>
                    <span className="text-white font-black">{batchPullProgress.memberName}</span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400">
                    Preserving facial likeness & active hairstyle
                  </span>
                </div>
                <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-rose-500 to-amber-400 h-full transition-all duration-500 ease-out"
                    style={{ width: `${(batchPullProgress.current / batchPullProgress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {pcError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold flex items-center justify-between">
                <span>{pcError}</span>
                <button onClick={() => setPcError(null)} className="text-rose-500 hover:text-rose-800">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Studio Controls: Member Selection & Theme Config */}
            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-4">
              
              {/* Member Selection with Hairstyle Badges */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-rose-500" />
                    <span className="text-[8.5px] font-black uppercase tracking-wider text-neutral-800">
                      Step 1: Select Member (Facial Identity & Hairstyle Locked):
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedPullMemberIdx(null)}
                    className={`text-[7.5px] font-black uppercase px-2 py-0.5 rounded-md transition-all ${
                      selectedPullMemberIdx === null ? 'bg-rose-100 text-rose-700 font-black' : 'text-neutral-500 hover:text-neutral-800'
                    }`}
                  >
                    🎲 Random Gacha Pull
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {profile.members?.map((member, idx) => {
                    const hairInfo = getMemberActiveHairInfo(member);
                    const isSelected = selectedPullMemberIdx === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedPullMemberIdx(idx)}
                        disabled={isGeneratingPC || isBatchPulling}
                        className={`p-2.5 rounded-xl border transition-all flex flex-col items-center gap-1 text-center cursor-pointer disabled:opacity-50 relative group ${
                          isSelected 
                            ? 'bg-rose-50/80 border-rose-500 ring-2 ring-rose-400/30 shadow-xs' 
                            : 'bg-white border-neutral-200 hover:border-rose-300 hover:shadow-2xs'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-rose-600 text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-neutral-200 shadow-2xs group-hover:scale-105 transition-transform relative">
                          <img 
                            src={member.imageUrl || `https://ui-avatars.com/api/?name=${member.stageName}&background=random`} 
                            alt={member.stageName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-[9px] font-black uppercase text-neutral-900 truncate max-w-full">
                          {member.stageName}
                        </span>
                        
                        {/* Hairstyle Tag */}
                        <span className="text-[6.5px] font-bold text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded-md truncate max-w-full border border-neutral-200">
                          💇 {hairInfo.hairStyle}
                        </span>
                        <span className="text-[6px] font-mono text-neutral-400 truncate max-w-full">
                          {hairInfo.isDyed ? `Dyed ${hairInfo.hairColor}` : `Nat. ${hairInfo.hairColor}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Theme & Selfie Style Selector */}
              <div className="space-y-2 pt-2 border-t border-neutral-200">
                <span className="text-[8.5px] font-black uppercase tracking-wider text-neutral-800 block">
                  Step 2: Photocard Era Theme & Backdrop:
                </span>
                
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'backstage', label: 'Backstage Dressing Room', emoji: '📸', desc: 'Dressing room mirror selfie' },
                    { id: 'ending_fairy', label: 'Music Show Ending Fairy', emoji: '🎀', desc: '4K TV broadcast close-up & confetti' },
                    { id: 'stage_concept', label: 'Live Concert Action', emoji: '🕶️', desc: 'Stadium performance with mic & lasers' },
                    { id: 'cozy_beret', label: 'Album Concept Photobook', emoji: '🧸', desc: 'Soft pastel studio portrait & beret' },
                    { id: 'golden_hour', label: 'Outdoor Sunset Tour', emoji: '🌟', desc: 'Sun-kissed rooftop/beach sunset flare' }
                  ].map((theme) => {
                    const isSelected = pcConceptTheme === theme.id;
                    return (
                      <button
                        key={theme.id}
                        onClick={() => setPcConceptTheme(theme.id as any)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                            : 'bg-white text-neutral-800 border-neutral-200 hover:border-neutral-400'
                        }`}
                      >
                        <div className="text-base mb-0.5">{theme.emoji}</div>
                        <div className="text-[8.5px] font-black uppercase tracking-tight">{theme.label}</div>
                        <div className={`text-[7px] ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                          {theme.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Custom Pose / Expression Input */}
              <div className="space-y-2 pt-2 border-t border-neutral-200">
                <div className="flex justify-between items-center">
                  <span className="text-[8.5px] font-black uppercase tracking-wider text-neutral-800">
                    Step 3: Pose & Facial Expression (Optional Customization):
                  </span>
                  {pcCustomPose && (
                    <button 
                      onClick={() => setPcCustomPose('')} 
                      className="text-[7.5px] text-neutral-400 hover:text-neutral-700 font-bold"
                    >
                      Clear Pose
                    </button>
                  )}
                </div>

                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={pcCustomPose}
                    onChange={(e) => setPcCustomPose(e.target.value)}
                    placeholder="e.g. Cute wink with peace sign, cheek heart, holding hot coffee, resting chin on palm..."
                    className="flex-1 bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-rose-500 shadow-2xs"
                  />
                  <button
                    onClick={() => {
                      const target = selectedPullMemberIdx !== null ? profile.members?.[selectedPullMemberIdx] : undefined;
                      handlePullPhotocard(target);
                    }}
                    disabled={isGeneratingPC || isBatchPulling}
                    className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 whitespace-nowrap"
                  >
                    {isGeneratingPC ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Pulling Selfie...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{selectedPullMemberIdx !== null ? `Pull ${profile.members?.[selectedPullMemberIdx]?.stageName}` : 'Pull Random Gacha'}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Quick Suggestion Chips */}
                <div className="flex flex-wrap gap-1.5 items-center pt-1">
                  <span className="text-[7.5px] font-bold text-neutral-400 uppercase">Quick Poses:</span>
                  {[
                    'Cheek heart & gentle wink',
                    'Double peace signs with playful smile',
                    'Resting chin in palm looking at camera',
                    'Blowing a soft kiss with cute smize',
                    'Holding warm coffee mug in both hands',
                    'Cat paws pose with bright joyful eyes'
                  ].map((preset, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => setPcCustomPose(preset)}
                      className="text-[7.5px] font-bold bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Pulled Card Stage (If just pulled) */}
            {pulledCard && (
              <div className="p-6 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 rounded-3xl text-white flex flex-col items-center text-center space-y-4 shadow-xl border border-white/10 animate-in zoom-in-95 duration-300">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className="text-[8px] font-black uppercase tracking-widest text-amber-400 px-3 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/30">
                    ★ NEW PULL UNLOCKED ★
                  </span>
                  <span className="text-[8px] font-mono text-neutral-400 font-bold px-2 py-0.5 rounded-md bg-white/5">
                    {pulledCard.rarity}
                  </span>
                  <span className="text-[8px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Identity & Hair Locked
                  </span>
                </div>

                {/* 3D Photocard Flip Card */}
                <div 
                  onClick={() => setIsCardFlipped(!isCardFlipped)}
                  className="w-56 aspect-[2.5/3.5] rounded-2xl relative cursor-pointer shadow-2xl transition-transform duration-500 hover:scale-102 select-none"
                  style={{ perspective: '1000px' }}
                >
                  <div 
                    className="w-full h-full rounded-2xl relative transition-all duration-700 shadow-2xl"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: isCardFlipped ? 'rotateY(180deg)' : 'none'
                    }}
                  >
                    {/* Front View */}
                    <div 
                      className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-white/20 bg-neutral-900"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <img 
                        src={pulledCard.imageUrl} 
                        alt={pulledCard.memberName}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Foil shimmer overlays */}
                      {pulledCard.foilType === 'stardust' && (
                        <div className="absolute inset-0 bg-gradient-to-tr from-rose-400/30 via-yellow-300/30 to-teal-300/30 mix-blend-overlay animate-pulse pointer-events-none" />
                      )}
                      {pulledCard.foilType === 'prism' && (
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/25 via-fuchsia-400/25 to-amber-300/25 mix-blend-color-dodge pointer-events-none" />
                      )}
                      {pulledCard.foilType === 'gold_emboss' && (
                        <div className="absolute inset-0 bg-gradient-to-b from-amber-300/20 via-transparent to-amber-500/20 mix-blend-overlay pointer-events-none" />
                      )}

                      {/* Name Plate */}
                      <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-xs p-2 rounded-xl text-neutral-950 text-left border border-white/40 shadow-md">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-[6.5px] font-black uppercase tracking-widest text-rose-600 block">{pulledCard.rarity}</span>
                            <h5 className="text-xs font-black uppercase tracking-tight">{pulledCard.memberName}</h5>
                          </div>
                          <span className="text-[7px] font-mono font-bold text-neutral-400">{profile.groupName}</span>
                        </div>
                      </div>
                    </div>

                    {/* Back View */}
                    <div 
                      className="absolute inset-0 rounded-2xl p-5 border-2 border-white/20 bg-neutral-100 text-neutral-900 flex flex-col justify-between"
                      style={{ 
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                      }}
                    >
                      <div className="flex justify-between items-center border-b border-neutral-200 pb-2">
                        <span className="text-[7px] font-black uppercase tracking-widest text-neutral-400 font-mono">OFFICIAL PC #{pulledCard.id.slice(-4)}</span>
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      </div>

                      <div className="py-2 text-center space-y-2">
                        <p className="text-xs font-bold text-neutral-700 italic leading-relaxed">
                          "{pulledCard.backMessage}"
                        </p>
                        <span className="text-sm font-black text-rose-600 block transform -rotate-3">
                          {pulledCard.signature}
                        </span>
                      </div>

                      <div className="border-t border-neutral-200 pt-2 flex justify-between items-center text-[7px] font-mono text-neutral-400 font-bold">
                        <span>{profile.groupName}</span>
                        <span className="truncate max-w-[100px]">{pulledCard.eraTitle}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">
                  (Click Card To Flip Front / Back)
                </p>

                {/* Pulled Card Action Buttons */}
                <div className="flex flex-wrap gap-2 justify-center pt-1">
                  <button
                    onClick={() => {
                      const memberObj = profile.members?.find(m => m.stageName === pulledCard.memberName);
                      handlePullPhotocard(memberObj, undefined, undefined, pulledCard.id);
                    }}
                    disabled={isGeneratingPC}
                    className="bg-neutral-800 hover:bg-neutral-700 text-white text-[8px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10 cursor-pointer disabled:opacity-50 transition-all"
                    title="Regenerate this member's selfie with preserved identity"
                  >
                    <RefreshCw className={`w-3 h-3 text-amber-400 ${isGeneratingPC ? 'animate-spin' : ''}`} />
                    <span>Re-take Selfie (Redo Pull)</span>
                  </button>

                  <a 
                    href={pulledCard.imageUrl}
                    download={`Photocard-${pulledCard.memberName}.png`}
                    className="bg-white hover:bg-neutral-100 text-neutral-950 text-[8px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Download className="w-3 h-3 text-neutral-900" />
                    <span>Save Image</span>
                  </a>
                </div>
              </div>
            )}

            {/* Virtual Collector Binder */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900">
                    Personal Photocard Binder ({collectedCards.length} Cards)
                  </h4>
                  <p className="text-[9px] text-neutral-500">
                    Click any photocard to inspect high-res, re-take selfie, or save to your device.
                  </p>
                </div>
                
                {/* Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[7.5px] font-black text-neutral-400 uppercase">Filter:</span>
                  <select 
                    value={binderFilterMember} 
                    onChange={e => setBinderFilterMember(e.target.value)}
                    className="border border-neutral-200 rounded-lg text-[8px] font-bold py-1 px-2 bg-white"
                  >
                    <option value="All">All Members ({collectedCards.length})</option>
                    {profile.members?.map(m => {
                      const count = collectedCards.filter(c => c.memberName === m.stageName).length;
                      return (
                        <option key={m.stageName} value={m.stageName}>{m.stageName} ({count})</option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {collectedCards.length === 0 ? (
                <div className="py-12 text-center bg-neutral-50 rounded-2xl border border-neutral-200">
                  <Sparkles className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-neutral-500">Your binder is empty. Pull your first photocard above!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {collectedCards
                    .filter(c => binderFilterMember === 'All' || c.memberName === binderFilterMember)
                    .map((card, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setSelectedBinderCard(card)}
                        className="aspect-[2.5/3.5] rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 shadow-2xs hover:shadow-md transition-all cursor-pointer relative group"
                      >
                        <img src={card.imageUrl} alt={card.memberName} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        
                        {/* Foil Tag */}
                        {card.foilType === 'stardust' && (
                          <div className="absolute top-1.5 right-1.5 bg-amber-400 text-neutral-950 text-[6px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
                            ★ STARDUST
                          </div>
                        )}
                        {card.foilType === 'prism' && (
                          <div className="absolute top-1.5 right-1.5 bg-cyan-400 text-neutral-950 text-[6px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
                            ◆ PRISM
                          </div>
                        )}
                        {card.foilType === 'gold_emboss' && (
                          <div className="absolute top-1.5 right-1.5 bg-amber-500 text-white text-[6px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
                            ● GOLD
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-2 flex flex-col justify-end text-white">
                          <span className="text-[6.5px] font-black uppercase text-amber-300">{card.rarity}</span>
                          <span className="text-[8.5px] font-black uppercase truncate">{card.memberName}</span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Binder Card Inspection Modal */}
            {selectedBinderCard && (
              <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-neutral-200 shadow-2xl flex flex-col items-center space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[7.5px] font-black uppercase text-rose-600 tracking-widest">{selectedBinderCard.rarity}</span>
                        {selectedBinderCard.foilType !== 'classic' && (
                          <span className="text-[7px] font-mono text-amber-600 font-bold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 uppercase">
                            {selectedBinderCard.foilType}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-black uppercase text-neutral-900">{selectedBinderCard.memberName}</h4>
                      <p className="text-[8px] font-mono text-neutral-400">{selectedBinderCard.eraTitle}</p>
                    </div>
                    <button onClick={() => setSelectedBinderCard(null)} className="text-neutral-400 hover:text-neutral-700 cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Card Front */}
                  <div className="w-52 aspect-[2.5/3.5] rounded-2xl overflow-hidden border border-neutral-200 shadow-xl relative group">
                    <img src={selectedBinderCard.imageUrl} alt={selectedBinderCard.memberName} className="w-full h-full object-cover" />
                  </div>

                  {/* Handwritten Back Message */}
                  <div className="p-3 bg-neutral-50 rounded-xl w-full text-center border border-neutral-200 space-y-1">
                    <p className="text-xs italic text-neutral-700 font-medium">"{selectedBinderCard.backMessage}"</p>
                    <span className="text-xs font-black text-rose-600 block">{selectedBinderCard.signature}</span>
                    <span className="text-[7px] font-mono text-neutral-400 block pt-1">Unlocked {selectedBinderCard.unlockedAt}</span>
                  </div>

                  {/* Modal Action Controls */}
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const memberObj = profile.members?.find(m => m.stageName === selectedBinderCard.memberName);
                          handlePullPhotocard(memberObj, undefined, undefined, selectedBinderCard.id);
                        }}
                        disabled={isGeneratingPC}
                        className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-xl text-[8.5px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50 transition-all"
                      >
                        <RefreshCw className={`w-3 h-3 ${isGeneratingPC ? 'animate-spin' : ''}`} />
                        <span>Re-take Selfie</span>
                      </button>

                      <a 
                        href={selectedBinderCard.imageUrl}
                        download={`Photocard-${selectedBinderCard.memberName}.png`}
                        className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white py-2 rounded-xl text-[8.5px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm text-center"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download PNG</span>
                      </a>
                    </div>

                    <button
                      onClick={() => handleDeletePhotocard(selectedBinderCard.id)}
                      className="w-full py-1.5 text-neutral-400 hover:text-rose-600 text-[8px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove From Binder</span>
                    </button>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {/* ================= WORLD TOUR TAB ================= */}
        {activeTab === 'tour' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-neutral-100">
              <div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-neutral-950">
                    {profile.fandom?.worldTourName || `${profile.groupName} 1st World Tour`}
                  </h3>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Global stadium routing, dates, and interactive custom VIP Backstage Stage Pass creator.
                </p>
              </div>
            </div>

            {/* Tour Routing List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {tourStops.map((stop, idx) => {
                const isSelected = selectedTourIndex === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedTourIndex(idx)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? 'border-neutral-950 bg-neutral-900 text-white shadow-md'
                        : 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-900'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[7.5px] font-mono font-bold">
                        <span className={isSelected ? 'text-emerald-400' : 'text-neutral-400'}>STOP 0{idx + 1}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[6.5px] font-black uppercase ${
                          stop.status === 'Sold Out'
                            ? isSelected ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-700'
                            : stop.status === 'Selling Fast'
                              ? isSelected ? 'bg-amber-400 text-black' : 'bg-amber-100 text-amber-800'
                              : isSelected ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {stop.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-black uppercase tracking-tight">{stop.city}, {stop.country}</h4>
                      <p className={`text-[8.5px] font-medium ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                        {stop.venue}
                      </p>
                    </div>

                    <div className={`pt-2 border-t text-[8px] font-mono font-bold flex justify-between items-center ${isSelected ? 'border-white/10 text-emerald-400' : 'border-neutral-100 text-neutral-400'}`}>
                      <span>{stop.date}</span>
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* VIP Ticket & Stage Pass Generator */}
            <div className="p-6 bg-neutral-50 border border-neutral-200 rounded-3xl space-y-5">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900">
                    VIP Concert Pass & Laminate Badge Studio
                  </h4>
                  <p className="text-[9px] text-neutral-500">Personalize your concert ticket and export high-res PNG badge.</p>
                </div>

                <button
                  onClick={handleDownloadTicket}
                  disabled={isDownloadingTicket}
                  className="bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 rounded-full text-[8.5px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {isDownloadingTicket ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3 text-emerald-400" />}
                  <span>Export Ticket PNG</span>
                </button>
              </div>

              {/* Form Config */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[7.5px] font-black text-neutral-400 uppercase tracking-widest block mb-1">Attendee Name</label>
                  <input 
                    type="text" 
                    value={ticketFanName}
                    onChange={e => setTicketFanName(e.target.value)}
                    className="w-full border border-neutral-200 rounded-lg p-2 text-xs font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="text-[7.5px] font-black text-neutral-400 uppercase tracking-widest block mb-1">Ticket Tier</label>
                  <select 
                    value={ticketTier}
                    onChange={e => setTicketTier(e.target.value as any)}
                    className="w-full border border-neutral-200 rounded-lg p-2 text-xs font-bold bg-white"
                  >
                    <option value="VIP Soundcheck All-Access">VIP Soundcheck All-Access</option>
                    <option value="VIP Floor Standing">VIP Floor Standing</option>
                    <option value="General Admission Tier 1">General Admission Tier 1</option>
                  </select>
                </div>
                <div>
                  <label className="text-[7.5px] font-black text-neutral-400 uppercase tracking-widest block mb-1">Assigned Seat / Gate</label>
                  <input 
                    type="text" 
                    value={ticketSeat}
                    onChange={e => setTicketSeat(e.target.value)}
                    className="w-full border border-neutral-200 rounded-lg p-2 text-xs font-bold bg-white"
                  />
                </div>
              </div>

              {/* Rendered Live Ticket / Pass Component (Used for PNG export) */}
              <div className="flex justify-center py-2">
                <div 
                  ref={ticketRef}
                  className="w-full max-w-xl bg-neutral-950 text-white rounded-3xl p-6 border-2 border-white/15 shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-5"
                  style={{
                    background: `linear-gradient(135deg, #0a0a0a 0%, #171717 60%, ${mainColor}20 100%)`
                  }}
                >
                  {/* Hologram side strip */}
                  <div className="w-2 rounded-full bg-gradient-to-b from-rose-400 via-amber-300 to-emerald-400 shrink-0 hidden md:block"></div>

                  {/* Ticket Body */}
                  <div className="flex-grow space-y-4 text-left">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[7px] font-black uppercase tracking-widest text-emerald-400 font-mono">
                          ★ OFFICIAL WORLD TOUR TICKET ★
                        </span>
                        <h3 className="text-xl font-black uppercase tracking-tight text-white mt-0.5">
                          {profile.groupName}
                        </h3>
                        <p className="text-[8px] font-mono text-neutral-400 font-bold">
                          {tourStops[selectedTourIndex]?.venue} • {tourStops[selectedTourIndex]?.city}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[7px] font-black uppercase px-2 py-0.5 rounded-full bg-white/10 text-amber-300 border border-white/10">
                          {ticketTier}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-white/5 p-2.5 rounded-xl border border-white/10 text-[8px]">
                      <div>
                        <span className="text-[6.5px] font-bold text-neutral-400 uppercase block">ATTENDEE</span>
                        <span className="font-black text-white uppercase truncate block">{ticketFanName}</span>
                      </div>
                      <div>
                        <span className="text-[6.5px] font-bold text-neutral-400 uppercase block">DATE</span>
                        <span className="font-black text-emerald-400 block">{tourStops[selectedTourIndex]?.date}</span>
                      </div>
                      <div>
                        <span className="text-[6.5px] font-bold text-neutral-400 uppercase block">SEATING</span>
                        <span className="font-black text-white truncate block">{ticketSeat}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-white/10">
                      <div className="space-y-0.5">
                        <span className="text-[6px] font-mono text-neutral-500 tracking-widest block">BARCODE VALIDATION</span>
                        <div className="flex gap-0.5 h-6 items-end">
                          {Array.from({ length: 36 }).map((_, i) => (
                            <div key={i} className="bg-white" style={{ width: `${(i % 3) + 1}px`, height: `${(i % 5) * 4 + 10}px` }}></div>
                          ))}
                        </div>
                      </div>
                      <span className="text-[8px] font-mono font-bold text-neutral-400">
                        AUTH_SECURE_{profile.groupName.slice(0, 3)}_{selectedTourIndex + 1}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ================= LORE & FAN CHANT TAB ================= */}
        {activeTab === 'lore' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Lore & Greeting */}
              <div className="lg:col-span-6 space-y-4">
                <div className="p-5 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[7.5px] font-black uppercase tracking-widest text-neutral-400 font-mono">
                      OFFICIAL FANDOM ETHOS & MOTTO
                    </span>
                    <button
                      onClick={handleGenerateBespokeSlogans}
                      disabled={isGeneratingSlogans}
                      className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-[8px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                      title="Generate 100% bespoke, non-generic slogans tailored to the group's name & lore"
                    >
                      {isGeneratingSlogans ? (
                        <>
                          <Loader2 className="w-2.5 h-2.5 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Dices className="w-2.5 h-2.5 text-emerald-400" />
                          <span>AI Re-Roll Bespoke Mottos</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-baseline gap-2 flex-wrap">
                    <h4 className="text-xl font-black uppercase tracking-tight text-neutral-950">
                      "{fandomName}"
                    </h4>
                    {(profile.fandom?.pronunciation || editFandomPronunciation) && (
                      <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shadow-2xs">
                        Pronounced: [{profile.fandom?.pronunciation || editFandomPronunciation}]
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-[7.5px] font-black uppercase text-neutral-400 tracking-widest block font-mono">
                      NAME ORIGIN & MEANING
                    </span>
                    <p className="text-xs text-neutral-700 leading-relaxed font-medium">
                      {fandomMeaning}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-neutral-200 space-y-1.5">
                    <span className="text-[7.5px] font-black uppercase text-neutral-400 tracking-widest block">OFFICIAL MOTTO</span>
                    <div className="p-2.5 bg-white rounded-xl border border-neutral-200/80 shadow-2xs">
                      <p className="text-xs font-bold text-neutral-900 italic flex items-center gap-2">
                        <MessageSquareQuote className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        "{profile.fandom?.fandomMotto || editFandomMotto || `Rooted in ${profile.groupName}, blooming with ${fandomName}`}"
                      </p>
                    </div>
                  </div>

                  {/* Slogan Options Picker if generated */}
                  {sloganOptions.length > 0 && (
                    <div className="pt-2 border-t border-neutral-200 space-y-2">
                      <span className="text-[7.5px] font-black uppercase text-emerald-700 tracking-widest block">
                        CHOOSE A BESPOKE CONCERT SLOGAN (TAP TO APPLY):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {sloganOptions.map((slog, sIdx) => {
                          const isSelected = (profile.fandom?.fandomMotto || editFandomMotto) === slog;
                          return (
                            <button
                              key={sIdx}
                              onClick={() => handleSelectSlogan(slog)}
                              className={`px-2.5 py-1 rounded-lg text-[9px] font-bold text-left transition-all border cursor-pointer ${
                                isSelected
                                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                                  : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                              }`}
                            >
                              "{slog}"
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {sloganSuccessMsg && (
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 text-[9px] font-bold flex items-center gap-1.5 animate-in fade-in">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>{sloganSuccessMsg}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-neutral-200 space-y-1">
                    <span className="text-[7.5px] font-black uppercase text-neutral-400 tracking-widest block">FANDOM PERSONALITY</span>
                    <p className="text-xs text-neutral-700">
                      {profile.fandom?.fandomPersonality || "Supportive, trendsetting, fiercely dedicated, and highly creative community."}
                    </p>
                  </div>
                </div>

                {profile.greeting && (
                  <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-1.5">
                    <span className="text-[7.5px] font-black uppercase text-emerald-700 tracking-widest block">
                      GROUP GREETING & HAND GESTURE
                    </span>
                    <p className="text-xs font-black text-emerald-950">
                      "{profile.greeting.motto}"
                    </p>
                    <p className="text-[9px] text-emerald-800">
                      {profile.greeting.gesture}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column: Interactive Fan Chant Trainer */}
              <div className="lg:col-span-6 space-y-3">
                <div className="p-5 bg-neutral-950 text-white rounded-2xl border border-neutral-800 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[7.5px] font-black uppercase tracking-widest text-emerald-400 font-mono">
                        INTERACTIVE CONCERT CHEERING GUIDE
                      </span>
                      <h4 className="text-sm font-black uppercase text-white mt-0.5">
                        "{titleTrack.title}" Title Track Fan Chant
                      </h4>
                    </div>

                    <button
                      onClick={() => setIsChantPlaying(!isChantPlaying)}
                      className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                        isChantPlaying
                          ? 'bg-rose-600 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      <Radio className={`w-3 h-3 ${isChantPlaying ? 'animate-pulse' : ''}`} />
                      <span>{isChantPlaying ? 'Pause Trainer' : 'Start Cheering Trainer'}</span>
                    </button>
                  </div>

                  <p className="text-[9px] text-neutral-400">
                    Follow the highlighted stadium cues below to practice chanting in sync with the song beat!
                  </p>

                  <div className="space-y-2.5 pt-2">
                    {fanChantLines.map((line, idx) => {
                      const isCurrent = isChantPlaying && activeChantStep === idx;
                      return (
                        <div 
                          key={idx}
                          className={`p-3 rounded-xl border transition-all ${
                            isCurrent
                              ? 'bg-white text-neutral-950 border-emerald-400 shadow-lg scale-102'
                              : 'bg-white/5 text-neutral-300 border-white/5'
                          }`}
                        >
                          <div className="flex justify-between items-baseline mb-1">
                            <span className="text-[7px] font-mono uppercase text-neutral-400 font-bold">Line 0{idx + 1}</span>
                            <span className="text-[7.5px] font-black text-rose-500 uppercase">{line.chant}</span>
                          </div>
                          <p className="text-xs font-bold">
                            {line.text}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= EDIT TAB ================= */}
        {activeTab === 'edit' && (
          <div className="max-w-2xl mx-auto space-y-4 p-4 bg-neutral-50 border border-neutral-200 rounded-2xl">
            <h3 className="text-sm font-black uppercase tracking-wider text-neutral-950">
              Edit Fandom Brand Information
            </h3>
            <p className="text-xs text-neutral-500">
              Customize your fandom name, official meaning, motto, and lightstick specifications.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-[7.5px] font-black text-neutral-500 uppercase block mb-1">Fandom Name</label>
                <input 
                  type="text" 
                  value={editFandomName}
                  onChange={e => setEditFandomName(e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg p-2 text-xs font-bold bg-white"
                />
              </div>

              <div>
                <label className="text-[7.5px] font-black text-neutral-500 uppercase block mb-1">
                  Fandom Pronunciation Guide (Phonetics)
                </label>
                <input 
                  type="text" 
                  value={editFandomPronunciation}
                  onChange={e => setEditFandomPronunciation(e.target.value)}
                  placeholder="e.g., ZEH-rose, fear-not, ah-tee-nee, glit, mo-ah"
                  className="w-full border border-neutral-200 rounded-lg p-2 text-xs font-mono font-bold bg-white"
                />
              </div>

              <div>
                <label className="text-[7.5px] font-black text-neutral-500 uppercase block mb-1">Fandom Name Origin & Meaning</label>
                <textarea 
                  rows={2}
                  value={editFandomOrigin}
                  onChange={e => setEditFandomOrigin(e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg p-2 text-xs font-bold bg-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[7.5px] font-black text-neutral-500 uppercase block">Official Fandom Motto</label>
                  <button
                    type="button"
                    onClick={handleGenerateBespokeSlogans}
                    disabled={isGeneratingSlogans}
                    className="text-[8px] font-black uppercase text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    {isGeneratingSlogans ? (
                      <>
                        <Loader2 className="w-2.5 h-2.5 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>Generate Bespoke Slogans</span>
                      </>
                    )}
                  </button>
                </div>
                <input 
                  type="text" 
                  value={editFandomMotto}
                  onChange={e => setEditFandomMotto(e.target.value)}
                  placeholder="e.g., Rooted in Our Brand, blooming with Fandom"
                  className="w-full border border-neutral-200 rounded-lg p-2 text-xs font-bold bg-white"
                />
                {sloganOptions.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <span className="text-[7px] font-black uppercase text-neutral-400 tracking-wider block">Suggested Bespoke Slogans:</span>
                    <div className="flex flex-wrap gap-1">
                      {sloganOptions.map((slog, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setEditFandomMotto(slog)}
                          className="px-2 py-0.5 rounded bg-neutral-200/70 hover:bg-neutral-300 text-neutral-800 text-[8px] font-medium transition-colors cursor-pointer"
                        >
                          "{slog}"
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[7.5px] font-black text-neutral-500 uppercase block mb-1">Lightstick Concept & Features</label>
                <textarea 
                  rows={2}
                  value={editLightstickDesc}
                  onChange={e => setEditLightstickDesc(e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg p-2 text-xs font-bold bg-white"
                />
              </div>

              <div>
                <label className="text-[7.5px] font-black text-neutral-500 uppercase block mb-1">World Tour Title</label>
                <input 
                  type="text" 
                  value={editTourName}
                  onChange={e => setEditTourName(e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg p-2 text-xs font-bold bg-white"
                />
              </div>

              <div className="pt-3 border-t border-neutral-200 flex justify-end gap-2">
                <button
                  onClick={() => setActiveTab('lore')}
                  className="px-4 py-2 text-xs font-black uppercase text-neutral-500 hover:text-neutral-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveFandomEdit}
                  className="bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-wider shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Cart / Fandom Haul Slideout Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs flex justify-end z-50 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-neutral-900" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-neutral-950">
                    Fandom Merch Haul ({cart.reduce((sum, i) => sum + i.quantity, 0)})
                  </h3>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="text-neutral-400 hover:text-neutral-800">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="py-16 text-center text-neutral-400 space-y-2">
                  <ShoppingBag className="w-10 h-10 mx-auto text-neutral-300" />
                  <p className="text-xs font-bold">Your haul bag is empty.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((cartItem, idx) => (
                    <div key={idx} className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex justify-between items-center gap-3">
                      <div className="min-w-0">
                        <h5 className="text-xs font-black text-neutral-900 truncate">{cartItem.item.name}</h5>
                        <span className="text-[8px] font-mono text-neutral-500 font-bold">
                          Qty: {cartItem.quantity} • ${cartItem.item.priceUSD * cartItem.quantity} (₩{(cartItem.item.priceKRW * cartItem.quantity).toLocaleString()})
                        </span>
                      </div>
                      <button 
                        onClick={() => handleRemoveFromCart(idx)}
                        className="text-neutral-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-neutral-100 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black uppercase text-neutral-500">Haul Total:</span>
                  <div className="text-right">
                    <span className="text-base font-black text-neutral-950">${cartTotalUSD}</span>
                    <span className="text-[8px] font-mono text-neutral-400 block font-bold">₩{cartTotalKRW.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    alert(`🎉 Fandom Haul Confirmed! Simulated receipt saved for ${fandomName}. Total: $${cartTotalUSD}`);
                    setCart([]);
                    setIsCartOpen(false);
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-full text-xs font-black uppercase tracking-wider shadow-md transition-all cursor-pointer"
                >
                  Checkout Simulated Haul
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
