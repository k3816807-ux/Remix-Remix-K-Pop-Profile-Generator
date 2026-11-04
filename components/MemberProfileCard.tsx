
import React, { useState, useEffect, useRef } from 'react';
import type { MemberProfileData, OfficialColor } from '../types';
import { SOCIAL_ICON_MAP } from '../constants';
import { generateImage, ReferenceImageInput } from '../services/geminiService';
import { getOutfitColorDistributionPrompt, getDynamicOutfitDescription, isSoloArtist, detectArtistGender } from '../services/profileDataHelper';
import { getFreshPutTogetherOutfit, getFreshKpopHairstyle, sanitizeFacialFeaturesForYouth, getYouthfulIdolAestheticDirective, detectHairLengthCategory, generateCompletelyNewFacialFeatures, getAmazingMatchingShoesDirective, extractGarmentCategories } from '../services/kpopStylingService';
import { 
  Sparkles, Shirt, Scissors, Upload, Image as ImageIcon, X, Check, RefreshCw, 
  Palette, Sliders, ChevronRight, Info, Layers, Eye, Download, Search, BookOpen, Tag,
  Copy, Terminal
} from 'lucide-react';
import { 
  ALL_GARMENTS, 
  getGarmentsByCategory, 
  searchGarments, 
  getRandomGarmentCoordinate, 
  getGarmentSystemPromptContext,
  AESTHETIC_CAPSULES,
  AestheticCapsule,
  getAestheticCapsules,
  GarmentItem, 
  GarmentCategory 
} from '../services/garmentKnowledge';

interface MemberProfileCardProps {
  member: MemberProfileData;
  groupColors: OfficialColor[];
  onUpdateMember: (updatedMember: MemberProfileData) => void;
  isSolo?: boolean;
  onRegenerateMember?: () => void;
  onGenerateBio?: () => void;
  isGeneratingBio?: boolean;
  groupType?: string;
  groupName?: string;
  groupConcept?: string;
  debutAlbumTheme?: string;
  debutAlbumTitle?: string;
  memberIndex?: number;
  allMembers?: MemberProfileData[];
}

const PerformanceStat: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="flex flex-col gap-2">
    <div className="flex justify-between text-[9px] font-black uppercase text-neutral-500 tracking-[0.1em]">
      <span>{label}</span>
      <span className="text-indigo-600">{value}/10</span>
    </div>
    <div className="h-[3px] bg-neutral-100 w-full rounded-full overflow-hidden">
      <div className="h-full bg-neutral-900 transition-all duration-700 ease-out" style={{ width: `${value * 10}%` }}></div>
    </div>
  </div>
);

export const MemberProfileCard: React.FC<MemberProfileCardProps> = ({ 
  member, 
  groupColors, 
  onUpdateMember, 
  isSolo, 
  onRegenerateMember, 
  onGenerateBio,
  isGeneratingBio = false,
  groupType,
  groupName = '',
  groupConcept = '',
  debutAlbumTheme = '',
  debutAlbumTitle = '',
  memberIndex,
  allMembers = []
}) => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(member.imageUrl || null);
  const [fullBodyImages, setFullBodyImages] = useState<string[]>(member.fullBodyImages || []);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isChangingOutfit, setIsChangingOutfit] = useState(false);
  const [isChangingHairstyle, setIsChangingHairstyle] = useState(false);
  const [isGeneratingFullBody, setIsGeneratingFullBody] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [fullBodyError, setFullBodyError] = useState<string | null>(null);

  // Auto-dismiss errors after 6s so they don't linger once images render
  useEffect(() => {
    if (!profileError) return;
    const t = setTimeout(() => setProfileError(null), 6000);
    return () => clearTimeout(t);
  }, [profileError]);

  useEffect(() => {
    if (!fullBodyError) return;
    const t = setTimeout(() => setFullBodyError(null), 6000);
    return () => clearTimeout(t);
  }, [fullBodyError]);
  const [fullBodyProgress, setFullBodyProgress] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Custom Outfit & Hair Styling Studio State
  const [isCustomStylingModalOpen, setIsCustomStylingModalOpen] = useState(false);
  const [stylingTab, setStylingTab] = useState<'outfit' | 'hair' | 'all'>('outfit');
  
  // Outfit Customizer State
  const [outfitMode, setOutfitMode] = useState<'preset' | 'reference' | 'custom' | 'wardrobe'>('wardrobe');
  const [outfitReferenceImage, setOutfitReferenceImage] = useState<string | null>(null);
  const [customOutfitText, setCustomOutfitText] = useState<string>('');
  const [adaptOutfitColors, setAdaptOutfitColors] = useState<boolean>(true);
  const [selectedOutfitAesthetic, setSelectedOutfitAesthetic] = useState<string>('Airport Casual & Blazer');
  const [isDraggingOutfit, setIsDraggingOutfit] = useState<boolean>(false);
  const outfitFileInputRef = useRef<HTMLInputElement>(null);

  // Encyclopedic Garment Wardrobe Explorer State
  const [wardrobeCategory, setWardrobeCategory] = useState<'all' | 'tops' | 'bottoms' | 'jackets' | 'footwear' | 'accessories'>('all');
  const [wardrobeSearchQuery, setWardrobeSearchQuery] = useState<string>('');
  const [selectedCapsuleAesthetic, setSelectedCapsuleAesthetic] = useState<string>('all');
  const [assembledCoordPreview, setAssembledCoordPreview] = useState<{ 
    title: string; 
    capsuleName?: string; 
    topName: string; 
    bottomName: string; 
    jacketName?: string; 
    accName?: string;
    colorScheme?: string;
  } | null>(null);

  // Hair Customizer State
  const [hairMode, setHairMode] = useState<'custom' | 'reference'>('custom');
  const [hairReferenceImage, setHairReferenceImage] = useState<string | null>(null);
  const [customHairLength, setCustomHairLength] = useState<string>('shoulder-length (lob)');
  const [customHairColor, setCustomHairColor] = useState<string>('platinum silver blonde');
  const [customHairTexture, setCustomHairTexture] = useState<string>('soft beach waves with curtain air bangs');
  const [customHairNotes, setCustomHairNotes] = useState<string>('');
  const [isDraggingHair, setIsDraggingHair] = useState<boolean>(false);
  const hairFileInputRef = useRef<HTMLInputElement>(null);

  const [isApplyingCustomStyling, setIsApplyingCustomStyling] = useState<boolean>(false);
  const [customStylingError, setCustomStylingError] = useState<string | null>(null);
  const [customStylingSuccess, setCustomStylingSuccess] = useState<string | null>(null);

  // Non-repeating history tracking for outfit and hairstyle transformations
  const usedOutfitIndicesRef = useRef<number[]>([]);
  const usedHairstyleIndicesRef = useRef<number[]>([]);

  // State to inspect & copy AI image prompt
  const [isPromptExpanded, setIsPromptExpanded] = useState<boolean>(false);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  // Synchronize internal state with changes in member props
  useEffect(() => {
    setGeneratedImage(member.imageUrl || null);
  }, [member.imageUrl]);

  useEffect(() => {
    setFullBodyImages(member.fullBodyImages || []);
  }, [member.fullBodyImages]);

  const {
    stageName,
    fullNameKorean,
    fullNameRomanized,
    dateOfBirth,
    placeOfBirth,
    positions,
    bio,
    stats,
    socialMedia,
    imagePrompt,
    race,
    skinTone,
    talents,
    preDebutActivities,
    hobbies,
    roleModels,
    petPeeves,
    heightCM,
    weightKG,
    bloodType,
    zodiacSign,
    mbti,
    trainingPeriod,
    representativeEmoji,
    representativeAnimal,
    stageNamePronunciation,
    realNamePronunciation
  } = member;

  const safeArray = (val: any): string[] => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') return val.split(',').map(s => s.trim());
    return [];
  };

  const safePositions = safeArray(positions);
  const safeTalents = safeArray(talents);
  const safeHobbies = safeArray(hobbies);
  const safeRoleModels = safeArray(roleModels);
  const safeFavoriteColors = safeArray(member.favoriteColors);

  const eyeColorFallback = [
    "dark brown",
    "deep brown",
    "espresso brown",
    "dark charcoal black",
    "hazel brown"
  ];

  const getDynamicFacialFallback = (nameHash: number): string => {
    const faceShapes = [
      "defined soft-angled youthful jawline and high cheekbones",
      "warm heart-shaped face with a delicate chin",
      "classic elegant oval face with balanced youthful proportions",
      "charming round face with soft youthful cheeks and a small chin",
      "sculpted clean-cut youthful jaw with smooth natural contours",
      "delicate youthful V-line face with elegant curves"
    ];

    const eyeShapes = [
      "sharp cat-like monolid eyes with a bright youthful gaze",
      "warm round almond-shaped eyes with clear double eyelids",
      "expressive almond eyes with long natural youthful eyelashes",
      "slanted phoenix-style eyes with clear vibrant contours",
      "gentle drooping puppy-dog eyes that look warm and friendly"
    ];

    const noseShapes = [
      "small cute button nose with a soft rounded tip",
      "tall elegant high-bridge nose with a clean profile",
      "delicate straight nose with a subtle, neat tip",
      "classic refined nose with a slightly soft tip"
    ];

    const lipShapes = [
      "prominent sharp cupid's bow with natural peach lip color",
      "plump natural rosy lips with a soft youthful natural shape",
      "classic thin elegant lips with clean definition",
      "soft full lips with a defined border and natural tone"
    ];

    const beautyMarkers = [
      "a tiny beauty mark on the high left cheekbone",
      "delicate dimples on the cheeks when expression changes",
      "a small dark mole on the nose bridge",
      "a distinct tiny beauty mark just under the outer corner of the right eye",
      "a clean smooth face with no visible marks",
      "a faint beauty mark near the outer edge of the left eyebrow"
    ];

    const randomFace = faceShapes[nameHash % faceShapes.length];
    const randomEye = eyeShapes[(nameHash >> 2) % eyeShapes.length];
    const randomNose = noseShapes[(nameHash >> 3) % noseShapes.length];
    const randomLip = lipShapes[(nameHash >> 4) % lipShapes.length];
    const randomMarker = beautyMarkers[(nameHash >> 5) % beautyMarkers.length];

    return `${randomEye}, a ${randomNose}, ${randomLip}, set in a ${randomFace}, featuring ${randomMarker}`;
  };

  const hashString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  const nameHash = hashString(stageName || member.stageName || "default");
  const finalEyeColor = member.eyeColor || eyeColorFallback[nameHash % eyeColorFallback.length];
  const rawFacialFeatures = member.distinctFacialFeatures || getDynamicFacialFallback(nameHash);
  const finalFacialFeatures = sanitizeFacialFeaturesForYouth(rawFacialFeatures);


  const isSoloAct = Boolean(isSolo || isSoloArtist(groupType));
  const memberGender = detectArtistGender(groupType, groupConcept, member.gender);
  const isCoed = groupType === 'Co-ed Group';
  const groupTypeInstruction = memberGender === 'Male' ? (isSoloAct ? 'MALE (Male Solo Artist)' : 'MALE (Male Idol)') : (isSoloAct ? 'FEMALE (Female Solo Artist)' : 'FEMALE (Female Idol)');
  const genderStr = memberGender === 'Male' ? 'male' : 'female';

  const handleGenerateImage = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsGenerating(true);
    setProfileError(null);
    // Explicitly open the white popup overview modal so the user gets visual progress immediately
    setIsModalOpen(true);
    try {
      // Dynamic random seed each time Regenerate Photo is called to guarantee a completely new idol
      const dynamicSeed = Math.floor(Math.random() * 900000) + Math.floor(Date.now() / 1000) % 100000;
      
      // 1. Generate completely fresh, unique facial features for a brand new idol every time
      const freshFace = generateCompletelyNewFacialFeatures(genderStr);
      const randomEyeColor = eyeColorFallback[dynamicSeed % eyeColorFallback.length];

      // 2. Fresh haircut and length: actively avoid the previous hair length category so every regeneration gives diverse lengths and cuts
      const previousHairLength = detectHairLengthCategory(member.currentHairStyle);
      const freshHair = getFreshKpopHairstyle(genderStr, usedHairstyleIndicesRef.current, undefined, previousHairLength);
      usedHairstyleIndicesRef.current.push(freshHair.index);
      if (usedHairstyleIndicesRef.current.length > 25) {
        usedHairstyleIndicesRef.current.shift();
      }

      // 3. Fresh coordinate for this idol (guaranteeing different top/bottom silhouettes across group members)
      const excludeTopTypes: string[] = [];
      const excludeBottomTypes: string[] = [];
      if (allMembers && allMembers.length > 0) {
        allMembers.forEach(m => {
          if (m.stageName !== member.stageName) {
            const detected = extractGarmentCategories(m.personalFashionStyle || '', m.imagePrompt || '');
            if (detected.topType) excludeTopTypes.push(detected.topType);
            if (detected.bottomType) excludeBottomTypes.push(detected.bottomType);
          }
        });
      }

      const freshOutfit = getFreshPutTogetherOutfit(
        genderStr, 
        usedOutfitIndicesRef.current, 
        groupColors,
        excludeTopTypes,
        excludeBottomTypes
      );
      usedOutfitIndicesRef.current.push(freshOutfit.index);
      if (usedOutfitIndicesRef.current.length > 25) {
        usedOutfitIndicesRef.current.shift();
      }

      // Universal youthfulness standard directive for all ethnicities to counteract bias
      const youthfulDirective = getYouthfulIdolAestheticDirective(member.race || 'Asian', member.placeOfBirth);

      // Construct a pristine group-coordinated medium upper-body portrait prompt with hips visible for a completely new idol
      const promptToUse = `A hyper-realistic front-facing medium upper-body portrait (framed from head down past the waistline to the hips with hips and waistline clearly visible in the shot) of a real ${member.race || 'Asian'} ${groupTypeInstruction} K-pop idol named ${stageName} who is a youthful 18-21 years old, with ${member.skinTone || 'fair (Fitzpatrick Type II)'} skin and beautiful ${randomEyeColor} eyes, styled with their upper body and hips visible, completely bare-faced with 100% natural unadorned skin, ZERO makeup, NO eyeliner, NO eyeshadow, NO lipstick, NO blush, NO face cosmetics, displaying authentic raw human skin texture with natural skin pores and a healthy natural skin glow.
BRAND NEW UNIQUE IDOL IDENTITY & FACIAL FEATURES: This is a completely unique, brand-new individual idol person with their own distinct facial features: "${freshFace.description}". They have completely natural, organic, and proportional youthful facial structures.
HAIRSTYLE & DYE TRANSFORMATION (${freshHair.title}): ${freshHair.prompt}. Hair Color: ${freshHair.hairColor}. Hair length: ${freshHair.lengthCategory}.
OUTFIT: ${freshOutfit.prompt}.
Solid plain light grey background with hex code #D1D5DB, pristine studio photography. ABSOLUTELY NEVER DO TECHWEAR OR ANYTHING RELATED TO IT: Absolutely NO techwear, NO ripstop nylon, NO parachute pants, NO tactical gear, NO combat clothes, NO military harnesses, NO chest rigs, NO tactical pouches, NO shoulder straps, and NO utility belts. ABSOLUTELY NO MAKEUP, NO COSMETICS, NO EYELINER, NO EYESHADOW, NO LIPSTICK, NO BLUSH, COMPLETELY BARE-FACED REAL HUMAN FACE.
${youthfulDirective}
Their facial features, youthful bone structure, and eyes MUST look organic, energetic, young, and strictly match their ${member.race || 'Asian'} ethnicity while radiating the exact same peak 18-21 year old rookie idol youthfulness and smooth skin as Korean idols. Under no circumstances make non-Korean members look older, mature, or middle-aged. To guarantee a completely unique facial structure and prevent same-face appearance, their face must feature highly individualized bone structures, unique eye-to-nose spacing, and specific organic proportions. Avoid standard artificial K-pop filters, airbrushed skin, or plastic/CGI puppet features. Give them a highly realistic, distinctive, and authentic human look with raw model characteristics, looking like a real-world K-pop idol in their early 20s (DO NOT make them look mature, middle-aged, or artificial/plastic-looking like a CGI/wax figure with heavy cosmetic modifications; ZERO wrinkles, ZERO smile lines, ZERO laugh lines, ZERO hollow cheeks). STRICT CAMERA FRAMING CONSTRAINT: Front-facing medium upper-body portrait framing from head down to hips. THE HIPS, WAISTLINE, AND ENTIRE UPPER TORSO MUST BE CLEARLY VISIBLE IN THE SHOT (medium shot from top of head down to the hips and upper waistband). Do not crop closely on the face; keep the camera at a consistent medium distance showing head to hips. THIS IS A ${genderStr.toUpperCase()}, DO NOT GENERATE THE WRONG GENDER. NO JEWELRY, NO NECKLACES, NO EARRINGS, NO BRACELETS, NO RINGS, ABSOLUTELY NO JEWELRY.`;

      const img = await generateImage(promptToUse);
      setGeneratedImage(img);
      onUpdateMember({ 
        ...member, 
        imageUrl: img, 
        imagePrompt: promptToUse,
        distinctFacialFeatures: freshFace.description,
        currentHairStyle: freshHair.title,
        dyedHairColor: freshHair.hairColor,
        personalFashionStyle: freshOutfit.title,
        eyeColor: randomEyeColor
      });
    } catch (err: any) {
      console.error(err);
      setProfileError(err instanceof Error ? err.message : "Image generation failed. Please try again later.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleChangeOutfit = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsChangingOutfit(true);
    setProfileError(null);
    setIsModalOpen(true);
    try {
      // Pick a brand new, non-repeating, normal casual good-looking outfit coordinate (top & bottom, onesie, matching set)
      // Strictly follows normal everyday casual wear with high effort in color matching and harmony with group colors
      const excludeTopTypes: string[] = [];
      const excludeBottomTypes: string[] = [];
      if (allMembers && allMembers.length > 0) {
        allMembers.forEach(m => {
          if (m.stageName !== member.stageName) {
            const detected = extractGarmentCategories(m.personalFashionStyle || '', m.imagePrompt || '');
            if (detected.topType) excludeTopTypes.push(detected.topType);
            if (detected.bottomType) excludeBottomTypes.push(detected.bottomType);
          }
        });
      }

      const freshOutfit = getFreshPutTogetherOutfit(
        genderStr, 
        usedOutfitIndicesRef.current, 
        groupColors,
        excludeTopTypes,
        excludeBottomTypes
      );
      usedOutfitIndicesRef.current.push(freshOutfit.index);
      if (usedOutfitIndicesRef.current.length > 25) {
        usedOutfitIndicesRef.current.shift();
      }
      const freshOutfitTitle = freshOutfit.title;
      const freshOutfitPrompt = freshOutfit.prompt;

      const referenceImageToUse = generatedImage || undefined;
      const youthfulDirective = getYouthfulIdolAestheticDirective(member.race || 'Asian', member.placeOfBirth);

      const promptToUse = referenceImageToUse
        ? `A hyper-realistic front-facing medium upper-body portrait (framed from head down to hips with hips and waistline clearly visible) of the exact same real person ${stageName} who is a youthful 18-21 years old.
STRICT CAMERA FRAMING & COMPOSITION LOCK: Medium upper-body portrait framing from head down to hips. The camera frame, field of view, focal distance, eye-level angle, head-to-torso proportions, scale, and composition MUST BE 100% IDENTICAL to the provided reference image. The hips, waistline, full torso, and top of bottoms must remain clearly visible. Do NOT zoom in, do NOT zoom out, do NOT change the cropping, and do NOT pan or tilt the camera. The person is positioned in the exact same front-facing pose, head angle, eye level, and medium upper-body framing (head to hips) against the solid plain light grey background (#D1D5DB).
CRITICAL IDENTITY & FACIAL CONSTRAINTS: You MUST preserve their exact face, youthful facial features, young 18-21 year old facial bone structure, smooth youthful skin tone, eye color, gaze direction, neutral/subtle expression, bare-faced natural youthful skin texture identical to the reference image. DO NOT AGE THE PERSON.
CRITICAL HAIRSTYLE & HAIR COLOR PRESERVATION (PRESERVE EXACT HAIR): You MUST keep their EXACT SAME hairstyle, haircut silhouette, hair length, bangs, and hair color 100% IDENTICAL to the reference image. Do NOT change their hair, do NOT restyle their hair, and do NOT change the hair color.
${youthfulDirective}
CHANGE OUTFIT ONLY: Replace ONLY their clothing with an elevated Korean casual fashion outfit with captivating persona, flair, and group color harmony: ${freshOutfitPrompt}.
ELEVATED KOREAN CASUAL FASHION (NEVER BASIC OR BORING):
Even though the outfit is casual, it MUST NOT look basic, generic, or boring. It embodies authentic modern Korean fashion (K-Fashion as seen in Seoul idol airport fashion, Seongsu-dong street style, and rehearsal chic)—casual wear must still give the idol who wears it an unmistakable aesthetic persona, charisma, and undeniable sense of style. Featuring intentional silhouette play (cropped boxy jackets, wide-leg fluid pleat trousers, oversized textured knits with peeking crisp collars, layered tees, authentic vintage-wash denim with clean silver-buckle belts). High effort in color matching: all pieces match in color and tone to harmonize with the group colors with zero clashing shades. In this exact same medium upper-body camera framing showing head down to hips, render BOTH the stylish casual top piece AND the visible waistband/belt/top of the trousers or skirt (or continuous one-piece romper/jumpsuit) so the outfit is visibly complete and impeccably color-coordinated from the hips up. ABSOLUTELY NOT middle-aged or elderly attire: NO frumpy clothes, NO dad khakis, NO outdated auntie cardigans, NO shapeless matronly sweaters, NO baggy grandpa corduroys, and NO drab middle-aged office wear. ABSOLUTELY NO basic boring blank t-shirts, NO drab featureless gym hoodies, and ABSOLUTELY NO TECHWEAR or tactical gear.
BACKGROUND & FRAMING: Solid plain light grey background with hex code #D1D5DB. Identical medium upper-body camera framing showing hips and waistline. ABSOLUTELY NO MAKEUP, NO COSMETICS, NO JEWELRY. THIS IS A YOUTHFUL ${genderStr.toUpperCase()}.`
        : `A hyper-realistic front-facing medium upper-body portrait (framed from head down to hips with hips and waistline clearly visible) of a youthful 18-21 year old real ${member.race || 'Asian'} ${groupTypeInstruction} idol named ${stageName}, retaining their exact hairstyle and hair color (${member.currentHairStyle || 'stylish cut'}, ${member.dyedHairColor || member.originalHairColor || 'natural tone'}).
${youthfulDirective}
They are wearing an elevated Korean casual fashion outfit with captivating persona, flair, and group color harmony (NEVER basic or boring): ${freshOutfitPrompt}. ABSOLUTELY NOT middle-aged or elderly attire. Solid plain light grey background with hex code #D1D5DB. Medium upper-body shot from head down to hips. ABSOLUTELY NO MAKEUP, NO COSMETICS, NO JEWELRY.`;

      const img = await generateImage(promptToUse, "1:1", referenceImageToUse);
      setGeneratedImage(img);
      onUpdateMember({
        ...member,
        imageUrl: img,
        imagePrompt: promptToUse,
        personalFashionStyle: freshOutfitTitle
      });
    } catch (err: any) {
      console.error(err);
      setProfileError(err instanceof Error ? err.message : "Outfit change failed. Please try again later.");
    } finally {
      setIsChangingOutfit(false);
    }
  };

  const handleChangeHairstyle = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsChangingHairstyle(true);
    setProfileError(null);
    setIsModalOpen(true);
    try {
      // Pick a brand new, non-repeating comeback hairstyle that changes BOTH the hairstyle and hair color
      const currentHairLength = detectHairLengthCategory(member.currentHairStyle);
      const freshHair = getFreshKpopHairstyle(genderStr, usedHairstyleIndicesRef.current, undefined, currentHairLength);
      usedHairstyleIndicesRef.current.push(freshHair.index);
      if (usedHairstyleIndicesRef.current.length > 25) {
        usedHairstyleIndicesRef.current.shift();
      }

      const referenceImageToUse = generatedImage || undefined;
      const youthfulDirective = getYouthfulIdolAestheticDirective(member.race || 'Asian', member.placeOfBirth);

      const promptToUse = referenceImageToUse
        ? `A hyper-realistic front-facing medium upper-body portrait (framed from head down to hips with hips and waistline clearly visible) of the exact same real person ${stageName} who is a youthful 18-21 years old.
STRICT CAMERA FRAMING & COMPOSITION LOCK: Medium upper-body portrait framing from head down to hips. The camera frame, field of view, focal distance, eye-level angle, head-to-torso proportions, scale, and composition MUST BE 100% IDENTICAL to the provided reference image. The hips, waistline, and full upper body must remain clearly visible. Do NOT zoom in, do NOT zoom out, do NOT change the cropping, and do NOT pan or tilt the camera. The person is positioned in the exact same front-facing pose, head angle, eye level, and medium framing (head to hips) against the solid plain light grey background (#D1D5DB).
CRITICAL FACIAL IDENTITY & YOUTH CONSTRAINTS: You MUST preserve their exact face, youthful facial features, young 18-21 year old facial bone structure, smooth youthful skin tone, eye color, gaze direction, neutral/subtle expression, and bare-faced natural youthful skin texture identical to the provided reference image. DO NOT make them look mature, middle-aged, or old.
${youthfulDirective}
CRITICAL OUTFIT PRESERVATION (KEEP EXACT SAME CLOTHING):
You MUST preserve their EXACT SAME clothing and outfit from the reference image. Do NOT change their clothes, do NOT change their top or bottoms, do NOT change their jacket, shirt, waistband, belt, or fabric colors. The clothing MUST REMAIN 100% IDENTICAL to what they are wearing in the reference image.
CHANGE HAIRSTYLE AND HAIR COLOR ONLY:
Change ONLY their hairstyle and hair color. Transform their hair into a brand new, stylish, youthful face-matching K-pop idol haircut and hair color transformation (${freshHair.title}): ${freshHair.prompt}. New Hair Color: ${freshHair.hairColor}. This hairstyle MUST perfectly match and flatter the idol's youthful facial structure, jawline, and natural features. It must look young, fresh, energetic, and modern—characteristic of an 18-21 year old K-pop idol with healthy natural sheen, soft strand definition, and realistic texture. ABSOLUTELY NO aging haircuts, NO dated middle-aged cuts, NO stiff grandma perms, NO matronly bobs, NO thinning or receding hair, and NO old person or uncle hairstyles.
BACKGROUND & FRAMING: Solid plain light grey background with hex code #D1D5DB. Identical medium upper-body camera framing showing head down to hips. ABSOLUTELY NO MAKEUP, NO COSMETICS, NO JEWELRY. THIS IS A YOUTHFUL ${genderStr.toUpperCase()}.`
        : `A hyper-realistic front-facing medium upper-body portrait (framed from head down to hips with hips and waistline clearly visible) of a youthful 18-21 year old real ${member.race || 'Asian'} K-pop idol named ${stageName} with hair styled in a brand-new youthful face-flattering cut and hair color (${freshHair.title}): ${freshHair.prompt}. Hair color: ${freshHair.hairColor}.
${youthfulDirective}
Dressed in their official stylish coordinate (${member.personalFashionStyle || 'modern casual coordinate'}). Solid plain light grey background with hex code #D1D5DB. Medium upper-body shot from head down to hips. ABSOLUTELY NO MAKEUP, NO COSMETICS, NO JEWELRY.`;

      const img = await generateImage(promptToUse, "1:1", referenceImageToUse);
      setGeneratedImage(img);
      onUpdateMember({
        ...member,
        imageUrl: img,
        currentHairStyle: freshHair.title,
        dyedHairColor: freshHair.hairColor,
        imagePrompt: promptToUse
      });
    } catch (err: any) {
      console.error(err);
      setProfileError(err instanceof Error ? err.message : "Hairstyle change failed. Please try again later.");
    } finally {
      setIsChangingHairstyle(false);
    }
  };

  const handleFileUpload = (file: File, setter: (val: string) => void) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP, etc.)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setter(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomStyling = async () => {
    setIsApplyingCustomStyling(true);
    setCustomStylingError(null);
    setCustomStylingSuccess(null);
    try {
      const effectiveIndex = memberIndex !== undefined ? memberIndex : nameHash;
      const colorWayPrompt = getOutfitColorDistributionPrompt(groupColors, effectiveIndex);

      // Collect reference images
      const refInputs: ReferenceImageInput[] = [];

      // 1. If we have a current idol image, lock face identity
      if (generatedImage) {
        refInputs.push({
          label: `${stageName} Official Facial Identity Reference (Keep face, eyes, bone structure, and skin texture identical)`,
          dataUrl: generatedImage
        });
      }

      // 2. Outfit reference image if selected
      if (stylingTab !== 'hair' && outfitMode === 'reference' && outfitReferenceImage) {
        refInputs.push({
          label: `Target Outfit Inspiration Reference (Recreate and adapt into ${groupColors.map(c => c.name).join(' & ')} brand colors)`,
          dataUrl: outfitReferenceImage
        });
      }

      // 3. Hair reference image if selected
      if (stylingTab !== 'outfit' && hairMode === 'reference' && hairReferenceImage) {
        refInputs.push({
          label: `Target Hairstyle, Haircut & Dye Technique Reference`,
          dataUrl: hairReferenceImage
        });
      }

      // Build Outfit Directive
      let outfitDirective = '';
      if (stylingTab === 'hair') {
        outfitDirective = 'PRESERVE EXACT OUTFIT: Keep their existing outfit and clothing identical to the facial reference image.';
      } else if (outfitMode === 'reference' && outfitReferenceImage) {
        outfitDirective = `OUTFIT TRANSFORMATION FROM REFERENCE IMAGE:
- Analyze the attached reference image labeled [Target Outfit Inspiration Reference].
- Recreate and synthesize an inspired, elevated new version of this exact outfit silhouette, structure, garment layers, tailoring, and styling vibe.
- ${adaptOutfitColors ? `CRITICAL COLORWAY TRANSLATION: Adapt and translate the garment colors strictly into the idol's official group brand color scheme: ${colorWayPrompt}. Replace whatever original colors were in the reference image with this official group palette.` : 'Keep the harmonious coordinated colors from the outfit concept.'}
- Elevate it with authentic tangible fabrics (tailored wool, fine combed cotton, washed denim, soft mohair, crisp poplin).
- Ensure waist-up upper body coordination showing both the top piece and waistband/skirt top.
- Do NOT copy the person or face from the outfit reference image—apply this newly synthesized outfit directly onto idol ${stageName}.`;
      } else if ((outfitMode === 'custom' || outfitMode === 'wardrobe') && customOutfitText.trim()) {
        outfitDirective = `CUSTOM ENCYCLOPEDIC GARMENT DIRECTIVE:
- Dressed in an impeccably styled K-pop designer coordinate: "${customOutfitText.trim()}".
- ${adaptOutfitColors ? `OFFICIAL GROUP BRAND COLORWAY: Infuse and harmonize the garments with the group's official color palette: ${colorWayPrompt}.` : 'Harmonize with high-fashion stage tones.'}
- Material textures: Authentic tangible fabrics with natural drape, crisp seams, and waist-up coordinate balance.`;
      } else if (outfitMode === 'wardrobe') {
        const c0 = groupColors?.[0];
        const c1 = groupColors?.[1];
        const c2 = groupColors?.[2];
        const coord = getRandomGarmentCoordinate(genderStr, {
          primary: c0?.name ? `${c0.name}${c0.hex ? ` (${c0.hex})` : ''}` : "deep navy suiting tone",
          secondary: c1?.name ? `${c1.name}${c1.hex ? ` (${c1.hex})` : ''}` : "crisp optic white",
          neutral: c2?.name ? `${c2.name}${c2.hex ? ` (${c2.hex})` : ''}` : "tailored charcoal wool"
        }, selectedCapsuleAesthetic !== 'all' ? selectedCapsuleAesthetic : undefined);
        outfitDirective = `CUSTOM GARMENT COORDINATE DIRECTIVE:
- ${coord.prompt}
- ${adaptOutfitColors ? `OFFICIAL GROUP BRAND COLORWAY: Infuse and harmonize the garments strictly with the group's official color palette: ${colorWayPrompt}. Ensure the statement pieces and details use these official brand colors harmoniously without clashing.` : 'Harmonize with high-fashion stage tones.'}
- Material textures: Authentic tangible fabrics with natural drape, crisp seams, and waist-up coordinate balance.`;
      } else {
        const dynamicOutfit = getDynamicOutfitDescription(selectedOutfitAesthetic, effectiveIndex, colorWayPrompt, genderStr, groupColors);
        outfitDirective = `PRESET OUTFIT DIRECTIVE: ${dynamicOutfit}. Coordinated with official colors: ${colorWayPrompt}.`;
      }

      // Build Hair Directive
      let hairDirective = '';
      if (stylingTab === 'outfit') {
        hairDirective = 'PRESERVE EXACT HAIRSTYLE & HAIR COLOR: Keep their exact hairstyle, haircut, hair length, and hair color 100% identical to the facial reference image. Do NOT alter their hair or hair color in any way.';
      } else if (hairMode === 'reference' && hairReferenceImage) {
        hairDirective = `HAIRSTYLE TRANSFORMATION FROM REFERENCE IMAGE:
- Analyze the attached reference image labeled [Target Hairstyle, Haircut & Dye Technique Reference].
- Precisely match this haircut silhouette, hair length, hair layering/texture, fringe/bangs style, and hair dyeing/coloration technique onto ${stageName}.
- Render realistic, silky hair strands with natural light sheen, fine flyaways, and authentic texture.`;
      } else {
        const hairNotes = customHairNotes.trim() ? ` Extra styling details: ${customHairNotes.trim()}.` : '';
        hairDirective = `CUSTOM HAIRSTYLE DIRECTIVE:
- Hair Length: ${customHairLength}.
- Hair Color & Dye Technique: ${customHairColor}.
- Hair Texture & Style: ${customHairTexture}.${hairNotes}
- The hair must look expertly cut and styled like a top K-pop idol with healthy strand definition.`;
      }

      const youthfulDirective = getYouthfulIdolAestheticDirective(member.race || 'Asian', member.placeOfBirth);

      let masterPrompt = '';
      if (generatedImage) {
        masterPrompt = `A hyper-realistic front-facing medium upper-body portrait (framed from head down to hips with hips and waistline clearly visible) of the exact same real K-pop idol ${stageName}.
STRICT CAMERA FRAMING & COMPOSITION LOCK: Medium upper-body portrait framing from head down to hips. The camera frame, field of view, focal distance, eye-level angle, head-to-torso proportions, scale, and composition MUST BE 100% IDENTICAL to the provided facial reference image. The idol is positioned in the exact same front-facing pose and medium framing (head to hips) against the solid plain light grey studio background (#D1D5DB).
CRITICAL FACIAL IDENTITY CONSTRAINTS: You MUST preserve their exact face, youthful facial features, young 18-21 year old facial bone structure, skin tone, eye color, gaze direction, neutral/subtle smize expression, and 100% bare-faced natural youthful skin texture with visible skin pores and zero makeup.
${youthfulDirective}

${outfitDirective}

${hairDirective}

BACKGROUND & PHOTOGRAPHY: Solid plain light grey studio background with hex code #D1D5DB. Medium upper-body portrait framing from head down to hips with waistline and hips visible. ABSOLUTELY NO MAKEUP, NO COSMETICS, NO EYELINER, NO EYESHADOW, NO LIPSTICK, NO BLUSH. NO JEWELRY, NO NECKLACES, NO EARRINGS. THIS IS A ${genderStr.toUpperCase()}.`;
      } else {
        masterPrompt = `A hyper-realistic 8k front-facing medium upper-body portrait (framed from head down to hips with hips and waistline clearly visible) of a real ${member.race || 'Asian'} ${groupTypeInstruction} K-pop idol named ${stageName} who is a youthful 18-21 years old, with ${member.skinTone || 'fair (Fitzpatrick Type II)'} skin and ${finalEyeColor} eyes, styled with the upper body and hips visible, completely bare-faced with 100% natural unadorned skin, ZERO makeup, displaying authentic raw human skin texture with natural skin pores and a healthy skin glow.
${youthfulDirective}

${outfitDirective}

${hairDirective}

Solid plain light grey studio background with hex code #D1D5DB. Medium upper-body portrait framing from head down to hips with waistline and hips visible. ABSOLUTELY NO MAKEUP, NO COSMETICS, NO JEWELRY. THIS IS A ${genderStr.toUpperCase()}.`;
      }

      const img = await generateImage(masterPrompt, "1:1", refInputs.length > 0 ? refInputs : undefined);
      setGeneratedImage(img);

      // Update current hair style description if hair was changed
      let updatedHairStyle = member.currentHairStyle;
      let updatedDyedColor = member.dyedHairColor;
      if (stylingTab !== 'outfit') {
        if (hairMode === 'reference') {
          updatedHairStyle = "Custom reference-matched hairstyle";
        } else {
          updatedHairStyle = `${customHairLength} ${customHairTexture}`;
          updatedDyedColor = customHairColor;
        }
      }

      let updatedFashionStyle = member.personalFashionStyle;
      if (stylingTab !== 'hair') {
        if (outfitMode === 'custom' && customOutfitText.trim()) {
          updatedFashionStyle = customOutfitText.trim().substring(0, 60);
        } else if (outfitMode === 'reference') {
          updatedFashionStyle = "Custom reference-inspired outfit";
        } else if (outfitMode === 'preset') {
          updatedFashionStyle = selectedOutfitAesthetic;
        }
      }

      onUpdateMember({
        ...member,
        imageUrl: img,
        imagePrompt: masterPrompt,
        currentHairStyle: updatedHairStyle,
        dyedHairColor: updatedDyedColor,
        personalFashionStyle: updatedFashionStyle
      });

      setCustomStylingSuccess("Custom styling successfully generated and applied!");
      setTimeout(() => {
        setCustomStylingSuccess(null);
      }, 3500);
    } catch (err: any) {
      console.error(err);
      setCustomStylingError(err instanceof Error ? err.message : "Custom styling generation failed. Please try again.");
    } finally {
      setIsApplyingCustomStyling(false);
    }
  };

  const handleGenerateFullBodyImages = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsGeneratingFullBody(true);
    setFullBodyError(null);
    setFullBodyProgress("Generating full body portrait with amazing coordinated shoes...");
    try {
      const personalColors = member.favoriteColors?.join(' and ') || 'neutral';
      const fashionStyle = member.personalFashionStyle || 'trendy casual streetwear';
      const raceName = member.race || 'Asian';
      const skin = member.skinTone || 'fair';
      const height = member.heightCM || 170;
      const weight = member.weightKG || 50;
      const genderStr = (member.gender || '').toLowerCase() === 'female' ? 'female' : ((member.gender || '').toLowerCase() === 'male' ? 'male' : 'person');
      const shoesDirective = getAmazingMatchingShoesDirective(genderStr, fashionStyle, groupColors);
      
      let hairStyle = member.dyedHairColor && member.dyedHairColor !== 'none' && !member.dyedHairColor.toLowerCase().includes('keeps natural')
        ? `${member.currentHairStyle || 'stylish hair'} (dyed: ${member.dyedHairColor})`
        : `${member.currentHairStyle || 'stylish hair'} (natural: ${member.originalHairColor || 'dark espresso'})`;
      let prompt = "";
      
      if (member.imagePrompt) {
        let basePrompt = member.imagePrompt;
        
        // Scrub out all medium upper-body, close-up, and waist-up camera/composition constraints
        basePrompt = basePrompt.replace(/front-facing close-up head-and-shoulders portrait/gi, "full-length head-to-toe standing portrait");
        basePrompt = basePrompt.replace(/framed very closely on the face and upper chest \(head and shoulders only\)/gi, "framed as a complete full-body head-to-toe standing shot showing their entire outfit, legs, and shoes in full clear view");
        basePrompt = basePrompt.replace(/STRICT FRAMING CONSTRAINT: Close-up head-and-shoulders portrait ONLY\. Do not show the waist or legs\. Focus heavily on the face\./gi, "");
        
        basePrompt = basePrompt.replace(/front-facing medium upper-body portrait \(framed from head down past the waistline to the hips with hips and waistline clearly visible in the shot\)/gi, "full-length head-to-toe standing portrait");
        basePrompt = basePrompt.replace(/framed from head down past the waistline to the hips with hips and waistline clearly visible in the shot/gi, "framed as a complete full-body standing shot from head to toe with trousers, full legs, and footwear clearly visible");
        basePrompt = basePrompt.replace(/front-facing medium upper-body portrait \(framed from head down to hips with hips and waistline clearly visible\)/gi, "full-length head-to-toe standing portrait");
        basePrompt = basePrompt.replace(/framed from head down to hips with hips and waistline clearly visible/gi, "framed as a complete full-body standing shot from head to toe showing entire legs and shoes");
        basePrompt = basePrompt.replace(/STRICT CAMERA FRAMING CONSTRAINT: Front-facing medium upper-body portrait framing from head down to hips.*?showing head to hips\./gis, "");
        basePrompt = basePrompt.replace(/STRICT CAMERA FRAMING & COMPOSITION LOCK: Medium upper-body portrait framing from head down to hips.*?against the solid plain light grey background \(#D1D5DB\)\./gis, "");
        basePrompt = basePrompt.replace(/Identical medium upper-body camera framing showing head down to hips/gi, "Full-body head-to-toe standing camera framing showing entire body from head down to shoes");
        basePrompt = basePrompt.replace(/medium upper-body portrait/gi, "full-length head-to-toe standing portrait");
        basePrompt = basePrompt.replace(/medium upper-body/gi, "full-length head-to-toe standing");
        basePrompt = basePrompt.replace(/front-facing waist-up upper body portrait/gi, "full-body portrait");
        basePrompt = basePrompt.replace(/styled from the waist up/gi, "styled for a complete full-body shot showing head to toe");
        basePrompt = basePrompt.replace(/STRICT FRAMING CONSTRAINT: Waist-up portrait ONLY\. Crop above the waist\. Do not show legs\./gi, "");
        basePrompt = basePrompt.replace(/Focus strictly on the upper body and face\./gi, "");
        basePrompt = basePrompt.replace(/waist-up upper body portrait/gi, "full-body portrait");
        basePrompt = basePrompt.replace(/Styled strictly from the waist up \(medium framing from waist to head\) to show the attire\./gi, "Showing their full body, head to toe.");
        basePrompt = basePrompt.replace(/Framing:.*?\./gi, "Framing: Full body shot, head to toe.");
        basePrompt = basePrompt.replace(/Background environment:.*?\./gi, "Background environment: solid plain light grey background with hex code #D1D5DB.");

        const youthfulDirective = getYouthfulIdolAestheticDirective(raceName, member.placeOfBirth);
        prompt = `${basePrompt}
${youthfulDirective}
Their facial features, youthful rookie idol facial bone structure, skin tone, eye color, expression, hairstyle, and hair color MUST REMAIN 100% PRESERVED and IDENTICAL to the reference image. Physical build: ${height}cm tall, weighing ${weight}kg.
STRICT CAMERA FRAMING: COMPLETE FULL-BODY HEAD-TO-TOE SHOT.
The framing MUST show the idol's full body from the top of their head down to their feet, with both shoes resting visibly and flat on the studio floor against the solid plain light grey background (#D1D5DB). Do NOT crop off the legs, ankles, or feet. The entire silhouette from head to toe must be in full view.
${shoesDirective.prompt}
NO JEWELRY, NO NECKLACES, NO EARRINGS, NO BRACELETS, NO RINGS, ABSOLUTELY NO JEWELRY.`;
      } else {
        const youthfulDirective = getYouthfulIdolAestheticDirective(raceName, member.placeOfBirth);
        const baseFeatures = `Physical profile: ${raceName} person with ${skin} skin tone who is a youthful 18-21 years old. Hair style and color: ${hairStyle}.`;
        prompt = `A high-resolution, full-body standing portrait of the real K-pop idol ${stageName}. ${baseFeatures}
${youthfulDirective}
Their facial features and bone structure MUST strictly match their ${raceName} ethnicity while radiating the exact same peak 18-21 year old rookie idol youthfulness and smooth skin as Korean idols. Do not make them look mixed-race unless explicitly stated. Physical build: ${height}cm tall, weighing ${weight}kg.
Wearing a highly fashionable, completely normal and wearable civilian everyday outfit (ABSOLUTELY NEVER DO TECHWEAR OR ANYTHING RELATED TO IT: strictly NO techwear, NO tactical gear, combat straps, utility vests, chest rigs, tactical pouches, military harnesses, or tactical clothes) in ${personalColors} color scheme reflecting visual details from their ${fashionStyle} personal style.
STRICT CAMERA FRAMING: COMPLETE FULL-BODY HEAD-TO-TOE SHOT.
The framing MUST show the idol's full body from the top of their head down to their feet, with both shoes resting visibly and flat on the studio floor against the solid plain light grey background (#D1D5DB). Do NOT crop off the legs, ankles, or feet.
${shoesDirective.prompt}
NO JEWELRY, NO NECKLACES, NO EARRINGS, NO BRACELETS, NO RINGS, ABSOLUTELY NO JEWELRY.`;
      }

      // We only generate 1 image now. If we have a profile image, use it as reference.
      const referenceImage = generatedImage || undefined;
      
      const img = await generateImage(prompt, "3:4", referenceImage);

      setFullBodyProgress(null);
      onUpdateMember({ ...member, fullBodyImages: [img] });
    } catch (err: any) {
      console.error(err);
      setFullBodyError(err instanceof Error ? err.message : "Full body image generation failed.");
      setFullBodyProgress(null);
    } finally {
      setIsGeneratingFullBody(false);
    }
  };

  const handleDownloadImage = (e: React.MouseEvent, url: string, isFullBody: boolean = false, index: number = 0) => {
    e.stopPropagation();
    const cleanGroupName = (groupName || 'Group').replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
    const cleanGroupType = (groupType || 'Kpop').replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
    const cleanStageName = stageName.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
    const cleanRoles = positions.map(p => p.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()).join('-');
    const suffix = isFullBody ? `fullbody-${index + 1}` : 'profile';
    const filename = `${cleanGroupName}_${cleanGroupType}_${cleanStageName}_${cleanRoles}_${suffix}.png`;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const placeholderUrl = `https://picsum.photos/seed/${encodeURIComponent(stageName)}/1000/1250?grayscale&blur=3`;

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-md transition-all group flex flex-col h-full cursor-pointer"
      >
        <div className="relative aspect-square bg-neutral-50 overflow-hidden">
          <img 
            src={generatedImage || placeholderUrl} 
            className={`w-full h-full object-cover transition-all duration-1000 ease-in-out ${!generatedImage ? 'opacity-30' : 'opacity-100'}`}
            alt={stageName} 
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-70"></div>
          
          {!generatedImage ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px] p-4">
              <button 
                onClick={handleGenerateImage}
                disabled={isGenerating}
                className="bg-indigo-600 text-white px-4 py-2 rounded-full font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-md text-[10px] disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : 'Generate Profile Image'}
              </button>
              {profileError && (
                <p className="text-[9px] text-red-300 font-bold text-center mt-2 bg-black/60 px-2 py-1 rounded max-w-[90%] leading-tight">{profileError}</p>
              )}
            </div>
          ) : (
            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 z-10">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCustomStylingModalOpen(true);
                }}
                disabled={isGenerating || isChangingOutfit || isChangingHairstyle || isApplyingCustomStyling}
                className="bg-indigo-600/95 hover:bg-indigo-500 text-white p-2 rounded-full transition-all shadow-lg backdrop-blur border border-white/25 disabled:opacity-50 flex items-center justify-center group/btn relative"
                title="Open Custom Outfit & Hair Styling Studio"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleGenerateImage();
                }}
                disabled={isGenerating || isChangingOutfit || isApplyingCustomStyling}
                className="bg-black/75 hover:bg-indigo-600 text-white p-2 rounded-full transition-all shadow-lg backdrop-blur border border-white/20 disabled:opacity-50 flex items-center justify-center"
                title="Regenerate Profile Image with current debut stage concept"
              >
                <svg className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </button>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleChangeOutfit(e);
                }}
                disabled={isGenerating || isChangingOutfit || isChangingHairstyle}
                className="bg-indigo-600/90 hover:bg-indigo-600 text-white p-2 rounded-full transition-all shadow-lg backdrop-blur border border-white/20 disabled:opacity-50 flex items-center justify-center"
                title="Change Outfit Only (Changes only the outfit while preserving exact face, hairstyle, and hair color)"
              >
                <svg className={`w-3.5 h-3.5 ${isChangingOutfit ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5a2.25 2.25 0 00-2.25 2.25c0 .408.109.79.3 1.125L4.5 13.5A2.25 2.25 0 003 15.688V18a1.5 1.5 0 001.5 1.5h15A1.5 1.5 0 0021 18v-2.312a2.25 2.25 0 00-1.5-2.188l-5.55-5.625c.191-.335.3-.717.3-1.125A2.25 2.25 0 0012 4.5z" />
                </svg>
              </button>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleChangeHairstyle(e);
                }}
                disabled={isGenerating || isChangingOutfit || isChangingHairstyle}
                className="bg-purple-600/90 hover:bg-purple-600 text-white p-2 rounded-full transition-all shadow-lg backdrop-blur border border-white/20 disabled:opacity-50 flex items-center justify-center"
                title="Change Hair Only (Changes only the hairstyle and hair color while preserving exact face and outfit)"
              >
                <svg className={`w-3.5 h-3.5 ${isChangingHairstyle ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </button>

              <button 
                onClick={(e) => generatedImage && handleDownloadImage(e, generatedImage)}
                className="bg-black/75 hover:bg-emerald-600 text-white p-2 rounded-full transition-all shadow-lg backdrop-blur border border-white/20 flex items-center justify-center"
                title="Download Profile Image"
              >
                <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleGenerateFullBodyImages();
                }}
                disabled={isGeneratingFullBody}
                className="bg-black/75 hover:bg-indigo-600 text-white p-2 rounded-full transition-all shadow-lg backdrop-blur border border-white/20 disabled:opacity-50 flex items-center justify-center"
                title="Generate Full Body Portrait using this profile image as a reference"
              >
                <svg className={`w-3.5 h-3.5 ${isGeneratingFullBody ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </button>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-3 pointer-events-none">
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              <span className="text-white/80 text-[8px] font-black uppercase tracking-[0.2em]">{safePositions[0] || (isSolo ? 'SOLOIST' : 'MEMBER')}</span>
              <span className={`text-[7.5px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${memberGender === 'Female' ? 'bg-pink-600/90 text-white border border-pink-400/50' : 'bg-blue-600/90 text-white border border-blue-400/50'}`}>
                {memberGender === 'Female' ? '♀ FEMALE' : '♂ MALE'}
              </span>
            </div>
            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">{stageName || 'TBD'}</h3>
          </div>
        </div>

        <div className="p-3 space-y-3 flex-grow flex flex-col">
          <div className="flex justify-between items-start border-b border-neutral-100 pb-2">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="text-sm font-black text-neutral-950 tracking-tight uppercase">
                  {fullNameRomanized || 'Unknown'}
                  {realNamePronunciation && <span className="text-[8px] text-indigo-500 font-bold ml-1 hover:underline cursor-help" title={`Pronounced: ${realNamePronunciation}`}>({realNamePronunciation})</span>}
                </p>
                <span className={`text-[7.5px] font-black px-1.5 py-0.5 rounded uppercase ${memberGender === 'Female' ? 'bg-pink-50 text-pink-700 border border-pink-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                  {memberGender === 'Female' ? '♀ Female' : '♂ Male'}
                </span>
              </div>
              <p className="text-[9px] font-bold text-neutral-400 flex flex-wrap gap-1 items-center">
                <span>{fullNameKorean || 'Unknown'}</span>
                {stageNamePronunciation && <span className="text-[7.5px] text-emerald-600 bg-emerald-50 px-1 rounded font-extrabold border border-emerald-100 uppercase">[{stageNamePronunciation}]</span>}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <PerformanceStat label="VOCAL" value={stats?.vocal || 0} />
            <PerformanceStat label="DANCE" value={stats?.dance || 0} />
            <PerformanceStat label="RAP" value={stats?.rap || 0} />
            <PerformanceStat label="VISUAL" value={stats?.visual || 0} />
          </div>

          <p className="text-[10px] text-neutral-700 leading-relaxed font-medium italic opacity-90">
            {bio ? (bio.length > 100 ? `${bio.substring(0, 100)}...` : bio) : (
              <span className="text-amber-700 font-semibold not-italic text-[9.5px]">
                {isSoloAct ? "⏳ Bio will be written with authentic solo artistry..." : "⏳ Bio will be written after full lineup is cast..."}
              </span>
            )}
          </p>
          <div className="mt-auto pt-2 text-center flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[8px] font-black uppercase tracking-widest text-indigo-600">Full Profile</span>
              {member.imagePrompt && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(member.imagePrompt || '');
                    setCopiedPrompt(true);
                    setTimeout(() => setCopiedPrompt(false), 2000);
                  }}
                  title="Copy the exact AI Image Prompt used for this portrait"
                  className="text-[7.5px] font-mono font-bold uppercase tracking-wider text-neutral-500 hover:text-indigo-600 bg-neutral-100 hover:bg-neutral-200 px-1.5 py-0.5 rounded transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Terminal className="w-2.5 h-2.5 text-indigo-500" />
                  <span>{copiedPrompt ? 'Copied!' : 'Prompt'}</span>
                </button>
              )}
            </div>
            <div className="flex items-center gap-1">
              {onRegenerateMember && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRegenerateMember();
                  }}
                  title={isSoloAct ? "Redo profile data for this artist" : "Redo profile data for this member (automatically updates other members' biographies to reflect the new member)"}
                  className="text-[8px] font-black uppercase tracking-wider text-neutral-600 hover:text-indigo-600 bg-neutral-100 hover:bg-indigo-50 px-1.5 py-0.5 rounded transition-all flex items-center gap-0.5"
                >
                  <span>🔄</span>
                  <span>Redo Data</span>
                </button>
              )}
              {onGenerateBio && !bio && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onGenerateBio();
                  }}
                  disabled={isGeneratingBio}
                  className="text-[8px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded transition-all disabled:opacity-50 flex items-center gap-0.5"
                >
                  {isGeneratingBio ? '✍️ Writing...' : '✨ Write Bio'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
          <div 
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-full md:w-2/5 relative bg-neutral-100">
              <img 
                src={generatedImage || placeholderUrl} 
                className={`w-full h-full object-cover min-h-[300px] ${!generatedImage ? 'opacity-30' : 'opacity-100'}`}
                alt={stageName} 
                referrerPolicy="no-referrer"
              />
              {!generatedImage ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm p-6">
                  <button 
                    onClick={handleGenerateImage}
                    disabled={isGenerating}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-full font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-md text-[10px] disabled:opacity-50"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Profile Image'}
                  </button>
                  {profileError && (
                    <p className="text-[10px] text-red-600 font-bold text-center mt-2 bg-white/95 shadow rounded px-3 py-1.5 border border-red-100 max-w-[85%] leading-tight">{profileError}</p>
                  )}
                </div>
              ) : (
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                  <div className="relative group/btn flex items-center justify-end">
                    <div className="absolute right-full mr-2 px-2 py-1 bg-black/80 text-white text-[10px] font-bold rounded opacity-0 group-hover/btn:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                      Regenerate Photo
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGenerateImage();
                      }}
                      disabled={isGenerating || isChangingOutfit}
                      className="bg-black/60 text-white hover:bg-black/80 p-2.5 rounded-full border border-white/20 shadow-lg backdrop-blur flex items-center justify-center transition-all active:scale-95 disabled:opacity-50"
                      title="Regenerate this profile photo with current style & background settings"
                    >
                      <svg className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                    </button>
                  </div>

                  <div className="relative group/btn flex items-center justify-end">
                    <div className="absolute right-full mr-2 px-2 py-1 bg-black/80 text-white text-[10px] font-bold rounded opacity-0 group-hover/btn:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                      Change Outfit (Keep Face & Hair)
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChangeOutfit(e);
                      }}
                      disabled={isGenerating || isChangingOutfit || isChangingHairstyle}
                      className="bg-indigo-600/90 hover:bg-indigo-600 text-white p-2.5 rounded-full border border-white/20 shadow-lg backdrop-blur flex items-center justify-center transition-all active:scale-95 disabled:opacity-50"
                      title="Change Outfit Only (Changes only the outfit while strictly preserving face, hairstyle, and hair color)"
                    >
                      <svg className={`w-4 h-4 ${isChangingOutfit ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5a2.25 2.25 0 00-2.25 2.25c0 .408.109.79.3 1.125L4.5 13.5A2.25 2.25 0 003 15.688V18a1.5 1.5 0 001.5 1.5h15A1.5 1.5 0 0021 18v-2.312a2.25 2.25 0 00-1.5-2.188l-5.55-5.625c.191-.335.3-.717.3-1.125A2.25 2.25 0 0012 4.5z" />
                      </svg>
                    </button>
                  </div>

                  <div className="relative group/btn flex items-center justify-end">
                    <div className="absolute right-full mr-2 px-2 py-1 bg-black/80 text-white text-[10px] font-bold rounded opacity-0 group-hover/btn:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                      Change Hair Only (Keep Outfit & Face)
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChangeHairstyle(e);
                      }}
                      disabled={isGenerating || isChangingOutfit || isChangingHairstyle}
                      className="bg-purple-600/90 hover:bg-purple-600 text-white p-2.5 rounded-full border border-white/20 shadow-lg backdrop-blur flex items-center justify-center transition-all active:scale-95 disabled:opacity-50"
                      title="Change Hair Only (Changes only the hairstyle and hair color while preserving exact face and outfit)"
                    >
                      <svg className={`w-4 h-4 ${isChangingHairstyle ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="relative group/btn flex items-center justify-end">
                    <div className="absolute right-full mr-2 px-2 py-1 bg-black/80 text-white text-[10px] font-bold rounded opacity-0 group-hover/btn:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                      Download
                    </div>
                    <button 
                      onClick={(e) => generatedImage && handleDownloadImage(e, generatedImage)}
                      className="bg-black/60 text-white hover:bg-emerald-600 p-2.5 rounded-full border border-white/20 shadow-lg backdrop-blur flex items-center justify-center transition-all active:scale-95"
                      title="Download Profile Image"
                    >
                      <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                    </button>
                  </div>
                  
                  {generatedImage && (
                    <div className="relative group/btn flex items-center justify-end">
                      <div className="absolute right-full mr-2 px-2 py-1 bg-black/80 text-white text-[10px] font-bold rounded opacity-0 group-hover/btn:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                        Full Body Portrait
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGenerateFullBodyImages();
                        }}
                        disabled={isGeneratingFullBody}
                        className="bg-black/60 text-white hover:bg-indigo-600 p-2.5 rounded-full border border-white/20 shadow-lg backdrop-blur flex items-center justify-center transition-all active:scale-95 disabled:opacity-50"
                        title="Generate Full Body Portrait using this profile image as a reference"
                      >
                        <svg className={`w-4 h-4 ${isGeneratingFullBody ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                      </button>
                    </div>
                  )}
                  {profileError && (
                    <p className="text-[9px] text-red-300 font-bold text-center bg-black/60 px-2.5 py-1 rounded max-w-[85%] mt-1 backdrop-blur self-end shadow-md border border-red-500/10 leading-tight">{profileError}</p>
                  )}
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-neutral-950 to-transparent">
                <span className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em]">{safePositions.join(' • ') || (isSoloAct ? 'SOLOIST' : 'MEMBER')}</span>
                <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">{stageName || 'TBD'}</h3>
              </div>
            </div>
            
            <div className="w-full md:w-3/5 p-6 md:p-8 space-y-6">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-2xl font-black text-neutral-950 tracking-tight uppercase">{fullNameRomanized}</h4>
                    <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1 ${memberGender === 'Female' ? 'bg-pink-100 text-pink-700 border border-pink-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                      <span>{memberGender === 'Female' ? '♀' : '♂'}</span>
                      <span>{memberGender.toUpperCase()}</span>
                      {isCoed && <span className="text-[7.5px] font-semibold opacity-75">(Co-ed)</span>}
                    </span>
                    {realNamePronunciation && (
                      <span className="text-[9px] font-black tracking-widest text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100/60 uppercase">
                        🗣️ Real: {realNamePronunciation}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-neutral-400">{fullNameKorean}</p>
                    {stageNamePronunciation && (
                      <span className="text-[9px] font-black tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100/60 uppercase">
                        🎤 Stage Pronunciation: {stageNamePronunciation}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  {onRegenerateMember && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsModalOpen(false);
                        onRegenerateMember();
                      }}
                      className="text-[10px] font-black uppercase tracking-widest text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-full transition-all flex items-center gap-1 shadow-sm"
                      title={isSoloAct ? "Redo this artist's profile data" : "Redo this idol's profile data (will automatically update and harmonize other members' biographies to incorporate the new member)"}
                    >
                      <span>🔄</span>
                      <span>Redo Profile Data</span>
                    </button>
                  )}
                  <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-neutral-900 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
              </div>

              {/* Studio Photoshoot Controls inside Modal */}
              <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200/80 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase text-neutral-900 tracking-wider">A&R Photoshoot Controls</span>
                  <span className="text-[8px] text-neutral-500 font-medium">Customize outfit or regenerate portrait</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsCustomStylingModalOpen(true);
                    }}
                    disabled={isGenerating || isChangingOutfit || isChangingHairstyle || isApplyingCustomStyling}
                    className="bg-indigo-600 text-white px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                    title="Open Custom Outfit & Hair Styling Studio"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Custom Styling Studio</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGenerateImage();
                    }}
                    disabled={isGenerating || isChangingOutfit || isApplyingCustomStyling}
                    className="bg-white border border-neutral-200 text-neutral-900 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-neutral-100 transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <svg className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    <span>{isGenerating ? 'Regenerating...' : 'New Face/Style'}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChangeOutfit(e);
                    }}
                    disabled={isGenerating || isChangingOutfit || isChangingHairstyle}
                    className="bg-indigo-600 text-white px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                    title="Change outfit (generates a sensible, normal casual color-matched outfit while keeping face and hair)"
                  >
                    <svg className={`w-3 h-3 ${isChangingOutfit ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5a2.25 2.25 0 00-2.25 2.25c0 .408.109.79.3 1.125L4.5 13.5A2.25 2.25 0 003 15.688V18a1.5 1.5 0 001.5 1.5h15A1.5 1.5 0 0021 18v-2.312a2.25 2.25 0 00-1.5-2.188l-5.55-5.625c.191-.335.3-.717.3-1.125A2.25 2.25 0 0012 4.5z" />
                    </svg>
                    <span>{isChangingOutfit ? 'Changing Outfit...' : 'Change Outfit Only'}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChangeHairstyle(e);
                    }}
                    disabled={isGenerating || isChangingOutfit || isChangingHairstyle}
                    className="bg-purple-600 text-white px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-purple-700 transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                    title="Change Hair Only (Changes only the hairstyle and hair color while preserving exact face and outfit)"
                  >
                    <svg className={`w-3 h-3 ${isChangingHairstyle ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                    <span>{isChangingHairstyle ? 'Changing Hair...' : 'Change Hair Only'}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGenerateFullBodyImages();
                    }}
                    disabled={isGeneratingFullBody}
                    className="bg-white border border-neutral-200 text-neutral-800 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-neutral-100 transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <svg className={`w-3 h-3 ${isGeneratingFullBody ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    <span>{isGeneratingFullBody ? 'Full Body...' : 'Full Body Shot'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">Gender</span>
                  <span className="text-xs font-bold text-neutral-900 flex items-center gap-1">
                    <span>{memberGender === 'Female' ? '♀' : '♂'}</span>
                    <span>{memberGender}</span>
                    {isCoed && <span className="text-[8px] text-indigo-600 font-semibold">(Co-ed Group)</span>}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">DOB</span>
                  <span className="text-xs font-bold text-neutral-900">{dateOfBirth}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">Origin</span>
                  <span className="text-xs font-bold text-neutral-900">{placeOfBirth}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">Race / Ethnicity</span>
                  <span className="text-xs font-bold text-neutral-900">{race || 'Not specified'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">Height / Weight</span>
                  <span className="text-xs font-bold text-neutral-900">
                    {heightCM}cm ({Math.floor((heightCM / 2.54) / 12)}'{Math.round((heightCM / 2.54) % 12)}") / {weightKG}kg ({Math.round(weightKG * 2.20462)} lbs)
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">Blood Type</span>
                  <span className="text-xs font-bold text-neutral-900">{bloodType}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">Skin Tone</span>
                  <span className="text-xs font-bold text-neutral-900">{skinTone || 'Not specified'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">Nat. Hair Color</span>
                  <span className="text-xs font-bold text-neutral-900">{member.originalHairColor || 'Not specified'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">Nat. Hair Type</span>
                  <span className="text-xs font-bold text-neutral-900">{member.originalHairType || 'Not specified'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-rose-600 uppercase tracking-widest">Concept Dye Color</span>
                  <span className="text-xs font-bold text-neutral-900">{member.dyedHairColor || 'none, natural'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-rose-600 uppercase tracking-widest">Concept Hair Style</span>
                  <span className="text-xs font-bold text-neutral-900">{member.currentHairStyle || 'Default'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">MBTI</span>
                  <span className="text-xs font-bold text-neutral-900">{mbti}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">Zodiac</span>
                  <span className="text-xs font-bold text-neutral-900">{zodiacSign}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">Training</span>
                  <span className="text-xs font-bold text-neutral-900">{trainingPeriod}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">Symbols</span>
                  <span className="text-xs font-bold text-neutral-900">{representativeEmoji} {representativeAnimal}</span>
                </div>
              </div>

              <div className="space-y-3 bg-indigo-50/40 p-4 rounded-2xl border border-indigo-100/40 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h5 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] border-b border-indigo-100/60 pb-1">Eye Color</h5>
                  <p className="text-xs font-bold text-neutral-900 capitalize leading-relaxed">{member.eyeColor || finalEyeColor}</p>
                </div>
                <div className="space-y-1">
                  <h5 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] border-b border-indigo-100/60 pb-1">Distinct Facial Features</h5>
                  <p className="text-xs font-medium text-neutral-700 leading-relaxed">{member.distinctFacialFeatures || finalFacialFeatures}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-1">
                  <h5 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Biography</h5>
                  {onGenerateBio && (
                    <button
                      onClick={onGenerateBio}
                      disabled={isGeneratingBio}
                      className="text-[9px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-full transition-all disabled:opacity-50 flex items-center gap-1 shadow-xs"
                    >
                      {isGeneratingBio ? (
                        <>
                          <span className="animate-spin text-xs">⚡</span>
                          <span>Writing Narrative...</span>
                        </>
                      ) : (
                        <span>{bio ? '🔄 Rewrite Biography' : '✨ Write Biography'}</span>
                      )}
                    </button>
                  )}
                </div>

                {bio ? (
                  <div className="space-y-3">
                    {bio.split('\n\n').filter(Boolean).map((paragraph, pIdx) => (
                      <p key={pIdx} className="text-sm text-neutral-800 leading-relaxed font-medium">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/60 text-center space-y-2">
                    <p className="text-xs text-amber-900 font-medium leading-relaxed">
                      ⏳ <strong>Biography Pending:</strong> {isSoloAct ? "This artist's rich narrative will be crafted with authentic solo artistry, trainee memories, and vocal/performance origins." : "This idol's rich narrative will be crafted with complete group chemistry, dorm dynamics, and trainee stories once all group members are generated."}
                    </p>
                    {onGenerateBio && (
                      <button
                        onClick={onGenerateBio}
                        disabled={isGeneratingBio}
                        className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-full shadow-sm transition-all disabled:opacity-50 inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        {isGeneratingBio ? (
                          <>
                            <span className="animate-spin">⚡</span>
                            <span>Writing Biography...</span>
                          </>
                        ) : (
                          <>
                            <span>{isSoloAct ? "✨ Write Solo Artist's Bio Now" : "✨ Write This Member's Bio Now"}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h5 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] border-b border-neutral-100 pb-1">Performance Stats</h5>
                  <div className="space-y-3 pt-1">
                    <PerformanceStat label="VOCAL" value={stats?.vocal || 0} />
                    <PerformanceStat label="DANCE" value={stats?.dance || 0} />
                    <PerformanceStat label="RAP" value={stats?.rap || 0} />
                    <PerformanceStat label="VISUAL" value={stats?.visual || 0} />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h5 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] border-b border-neutral-100 pb-1">Talents & Skills</h5>
                    <div className="flex flex-wrap gap-1">
                      {safeTalents.map((t, i) => <span key={i} className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded text-[9px] font-bold">{t}</span>)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] border-b border-neutral-100 pb-1">Hobbies</h5>
                    <div className="flex flex-wrap gap-1">
                      {safeHobbies.map((h, i) => <span key={i} className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded text-[9px] font-bold">{h}</span>)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h5 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] border-b border-neutral-100 pb-1">Pre-Debut</h5>
                  <p className="text-xs text-neutral-700 font-medium">{preDebutActivities}</p>
                </div>
                <div className="space-y-2">
                  <h5 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] border-b border-neutral-100 pb-1">Role Models</h5>
                  <p className="text-xs text-neutral-700 font-medium">{safeRoleModels.join(', ')}</p>
                </div>
                <div className="space-y-2">
                  <h5 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] border-b border-neutral-100 pb-1">Personal Fashion</h5>
                  <p className="text-xs text-neutral-700 font-medium">{member.personalFashionStyle || 'Trendy Casual'}</p>
                </div>
                <div className="space-y-2">
                  <h5 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] border-b border-neutral-100 pb-1">Favorite Colors</h5>
                  <div className="flex flex-wrap gap-1">
                    {safeFavoriteColors.length > 0 ? safeFavoriteColors.map((c, i) => <span key={i} className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded text-[9px] font-bold">{c}</span>) : <span className="text-xs text-neutral-700 font-medium">Neutral tones</span>}
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-neutral-100">
                <div className="flex justify-between items-center bg-neutral-50 px-3 py-2 rounded-lg border border-neutral-100">
                  <div className="flex flex-col">
                    <h5 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Full Body Portrait</h5>
                    {fullBodyProgress && (
                      <span className="text-[9px] text-indigo-600 font-bold animate-pulse mt-0.5">{fullBodyProgress}</span>
                    )}
                    {fullBodyError && (
                      <span className="text-[9px] text-red-500 font-bold mt-0.5">{fullBodyError}</span>
                    )}
                  </div>
                  <button 
                    onClick={handleGenerateFullBodyImages}
                    disabled={isGeneratingFullBody || !generatedImage}
                    className="bg-indigo-600 text-white px-3 py-1.5 rounded-full font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-sm text-[8px] disabled:opacity-50 disabled:bg-neutral-400"
                    title={!generatedImage ? "Please generate a profile portrait first to use as a reference" : "Generate full body portrait"}
                  >
                    {isGeneratingFullBody ? 'Generating...' : fullBodyImages.length > 0 ? 'Regenerate Portrait' : 'Generate Portrait'}
                  </button>
                </div>
                
                {fullBodyImages.length > 0 && (
                  <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
                    {fullBodyImages.map((img, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => setLightboxImage(img)}
                        className="aspect-[3/4] rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-sm relative group/img cursor-zoom-in hover:shadow-md transition-all duration-300"
                      >
                        <img 
                          src={img} 
                          alt={`${stageName} full body portrait`} 
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-neutral-950/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="bg-white/90 text-neutral-950 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">View Full Size</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* AI Image Generation Prompt Inspector & Copy Tool */}
              {member.imagePrompt && (
                <div className="pt-4 border-t border-neutral-100">
                  <div className="bg-neutral-900 text-neutral-100 rounded-xl p-3 border border-neutral-800 shadow-inner">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-300">
                          AI Image Generation Prompt
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(member.imagePrompt || '');
                            setCopiedPrompt(true);
                            setTimeout(() => setCopiedPrompt(false), 2500);
                          }}
                          className="px-2.5 py-1 rounded-full bg-neutral-800 hover:bg-neutral-700 text-[8px] font-black uppercase tracking-wider text-white transition-all flex items-center gap-1 border border-neutral-700 cursor-pointer"
                          title="Copy exact image generation prompt to clipboard"
                        >
                          {copiedPrompt ? (
                            <>
                              <Check className="w-2.5 h-2.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-2.5 h-2.5 text-neutral-400" />
                              <span>Copy Prompt</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsPromptExpanded(prev => !prev);
                          }}
                          className="px-2.5 py-1 rounded-full bg-neutral-800 hover:bg-neutral-700 text-[8px] font-black uppercase tracking-wider text-neutral-300 transition-all border border-neutral-700 cursor-pointer"
                        >
                          {isPromptExpanded ? 'Hide' : 'View Prompt'}
                        </button>
                      </div>
                    </div>
                    {isPromptExpanded && (
                      <div className="mt-2.5 pt-2 border-t border-neutral-800 text-[10px] font-mono leading-relaxed text-neutral-300 whitespace-pre-wrap bg-neutral-950 p-3 rounded-lg max-h-48 overflow-y-auto selection:bg-indigo-500/30">
                        {member.imagePrompt}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Full Body Image Lightbox Overlay */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 bg-neutral-950/95 backdrop-blur-md cursor-zoom-out animate-in fade-in duration-200"
          onClick={() => setLightboxImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-neutral-300 z-[101] bg-black/40 p-2 rounded-full cursor-pointer hover:bg-black/60 transition-all border border-neutral-800"
            onClick={() => setLightboxImage(null)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          
          <button 
            className="absolute top-4 right-16 text-white hover:text-emerald-400 z-[101] bg-black/40 p-2 rounded-full cursor-pointer hover:bg-black/60 transition-all border border-neutral-800 flex items-center justify-center gap-2 px-4"
            onClick={(e) => {
              const idx = fullBodyImages.indexOf(lightboxImage);
              handleDownloadImage(e, lightboxImage, true, Math.max(0, idx));
            }}
          >
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            <span className="text-[10px] font-black uppercase tracking-widest">Download Full Body</span>
          </button>

          <div className="relative max-w-full max-h-full flex flex-col items-center justify-center animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <img 
              src={lightboxImage} 
              alt={`${stageName} full view`} 
              className="max-w-[95vw] max-h-[82vh] object-contain rounded-lg shadow-2xl border border-neutral-800" 
              referrerPolicy="no-referrer"
            />
            <p className="mt-3 text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em] bg-black/60 px-4 py-1.5 rounded-full border border-neutral-800 shadow-lg text-center backdrop-blur">
              Click anywhere outside to close
            </p>
          </div>
        </div>
      )}

      {/* Custom Outfit & Hair Styling Studio Modal */}
      {isCustomStylingModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => !isApplyingCustomStyling && setIsCustomStylingModalOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-2xl max-h-[92vh] rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between bg-gradient-to-r from-neutral-50 via-white to-indigo-50/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight">Custom Styling Studio</h3>
                    <span className="bg-indigo-100 text-indigo-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {stageName}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 font-medium">
                    Upload reference photos or customize outfits and hairstyles in official {isSoloAct ? "artist" : "group"} colors.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => !isApplyingCustomStyling && setIsCustomStylingModalOpen(false)}
                disabled={isApplyingCustomStyling}
                className="text-neutral-400 hover:text-neutral-900 p-1.5 rounded-full hover:bg-neutral-100 transition-colors disabled:opacity-40"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Group Colors Palette Bar */}
            <div className="bg-neutral-900 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-y border-neutral-800">
              <div className="flex items-center gap-2">
                <Palette className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-300">Official {isSoloAct ? "Artist" : "Group"} Colors:</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {groupColors.map((col, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 bg-neutral-800/80 px-2 py-0.5 rounded-full border border-neutral-700">
                    <span 
                      className="w-2.5 h-2.5 rounded-full shadow-sm" 
                      style={{ backgroundColor: col.hex }} 
                    />
                    <span className="text-[10px] font-bold text-neutral-200">{col.name}</span>
                    <span className="text-[9px] font-mono text-neutral-400">{col.hex}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="grid grid-cols-3 bg-neutral-100 p-1 border-b border-neutral-200 text-xs font-black uppercase tracking-wider">
              <button
                onClick={() => setStylingTab('outfit')}
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  stylingTab === 'outfit'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Shirt className="w-3.5 h-3.5" />
                <span>Outfit Styling</span>
              </button>
              <button
                onClick={() => setStylingTab('hair')}
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  stylingTab === 'hair'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>Hair & Color</span>
              </button>
              <button
                onClick={() => setStylingTab('all')}
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  stylingTab === 'all'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Complete Look</span>
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-6 flex-1 text-neutral-800">
              
              {/* SECTION: OUTFIT STYLING */}
              {(stylingTab === 'outfit' || stylingTab === 'all') && (
                <div className="space-y-3 bg-neutral-50/60 p-4 rounded-xl border border-neutral-200/80">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                        <Shirt className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900">
                        Outfit Transformation Options
                      </h4>
                    </div>

                    {/* Mode Buttons */}
                    <div className="flex bg-neutral-200/80 p-0.5 rounded-lg text-[10px] font-bold">
                      <button
                        onClick={() => setOutfitMode('wardrobe')}
                        className={`px-2.5 py-1 rounded-md transition-all ${
                          outfitMode === 'wardrobe' ? 'bg-white text-indigo-600 shadow-xs' : 'text-neutral-600'
                        }`}
                      >
                        👗 Garment Wardrobe
                      </button>
                      <button
                        onClick={() => setOutfitMode('reference')}
                        className={`px-2.5 py-1 rounded-md transition-all ${
                          outfitMode === 'reference' ? 'bg-white text-indigo-600 shadow-xs' : 'text-neutral-600'
                        }`}
                      >
                        📸 Reference Image
                      </button>
                      <button
                        onClick={() => setOutfitMode('custom')}
                        className={`px-2.5 py-1 rounded-md transition-all ${
                          outfitMode === 'custom' ? 'bg-white text-indigo-600 shadow-xs' : 'text-neutral-600'
                        }`}
                      >
                        ✍️ Describe Outfit
                      </button>
                      <button
                        onClick={() => setOutfitMode('preset')}
                        className={`px-2.5 py-1 rounded-md transition-all ${
                          outfitMode === 'preset' ? 'bg-white text-indigo-600 shadow-xs' : 'text-neutral-600'
                        }`}
                      >
                        👔 Presets
                      </button>
                    </div>
                  </div>

                  {/* Mode A: Reference Image Upload */}
                  {outfitMode === 'reference' && (
                    <div className="space-y-3 pt-1">
                      <input 
                        ref={outfitFileInputRef}
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, setOutfitReferenceImage);
                        }}
                      />

                      {!outfitReferenceImage ? (
                        <div
                          onDragOver={(e) => { e.preventDefault(); setIsDraggingOutfit(true); }}
                          onDragLeave={() => setIsDraggingOutfit(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setIsDraggingOutfit(false);
                            const file = e.dataTransfer.files?.[0];
                            if (file) handleFileUpload(file, setOutfitReferenceImage);
                          }}
                          onClick={() => outfitFileInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                            isDraggingOutfit 
                              ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]' 
                              : 'border-neutral-300 hover:border-indigo-400 bg-white hover:bg-neutral-50/80'
                          }`}
                        >
                          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2">
                            <Upload className="w-5 h-5" />
                          </div>
                          <p className="text-xs font-bold text-neutral-800">
                            Drop outfit reference photo here, or <span className="text-indigo-600 underline">browse</span>
                          </p>
                          <p className="text-[10px] text-neutral-500 mt-1">
                            Upload any runway, stage, or streetwear photo you want to copy & adapt.
                          </p>
                        </div>
                      ) : (
                        <div className="bg-white p-3 rounded-xl border border-neutral-200 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img 
                              src={outfitReferenceImage} 
                              alt="Outfit Reference" 
                              className="w-14 h-14 object-cover rounded-lg border border-neutral-200 shadow-sm"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-xs font-bold text-neutral-900">Outfit Reference Loaded</span>
                              </div>
                              <p className="text-[10px] text-neutral-500">Ready to synthesize into group colorway</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => outfitFileInputRef.current?.click()}
                              className="text-[10px] font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-2.5 py-1.5 rounded-lg transition-colors"
                            >
                              Change Photo
                            </button>
                            <button
                              onClick={() => setOutfitReferenceImage(null)}
                              className="text-[10px] font-bold text-red-600 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Color Adaptation Checkbox */}
                      <label className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-neutral-200 cursor-pointer hover:bg-neutral-50/60 transition-colors">
                        <input
                          type="checkbox"
                          checked={adaptOutfitColors}
                          onChange={(e) => setAdaptOutfitColors(e.target.checked)}
                          className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="text-left">
                          <span className="text-xs font-bold text-neutral-900 block">
                            Translate outfit into Official Group Colors
                          </span>
                          <span className="text-[10px] text-neutral-500 leading-normal block">
                            AI will copy the silhouette, cut, and layering from the photo, but adapt the garments to use {groupColors.map(c => c.name).join(' & ')}.
                          </span>
                        </div>
                      </label>
                    </div>
                  )}

                  {/* Mode B: Custom Text Description */}
                  {outfitMode === 'custom' && (
                    <div className="space-y-3 pt-1">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-600 mb-1">
                          Describe the Desired Outfit in Detail:
                        </label>
                        <textarea
                          value={customOutfitText}
                          onChange={(e) => setCustomOutfitText(e.target.value)}
                          rows={3}
                          placeholder="e.g. Cropped structured blazer in fine houndstooth wool with asymmetric silver chain accents, paired with high-waisted pleated wide-leg slacks and a crisp white poplin collared shirt..."
                          className="w-full text-xs bg-white border border-neutral-200 rounded-xl p-3 text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      {/* Quick Idea Chips */}
                      <div>
                        <span className="text-[9px] font-bold text-neutral-500 block mb-1.5">Quick Inspiration Starters:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            "Tailored Wool Blazer & Pleated Slacks",
                            "Cropped Tweed Jacket & Co-ord Skirt",
                            "Deconstructed Denim & Layered Vest",
                            "Silk Blouse & Wide-Leg Trousers",
                            "Velvet Stage Suit with Satin Lapels",
                            "Distressed Knit & Wide Cargo Set",
                            "High-Collar Trench & Tailored Pants"
                          ].map((chip, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setCustomOutfitText(chip)}
                              className="text-[9px] font-bold bg-white hover:bg-indigo-50 hover:text-indigo-600 text-neutral-700 px-2.5 py-1 rounded-full border border-neutral-200 transition-colors"
                            >
                              + {chip}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Color Adaptation Checkbox */}
                      <label className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-neutral-200 cursor-pointer hover:bg-neutral-50/60 transition-colors">
                        <input
                          type="checkbox"
                          checked={adaptOutfitColors}
                          onChange={(e) => setAdaptOutfitColors(e.target.checked)}
                          className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="text-left">
                          <span className="text-xs font-bold text-neutral-900 block">
                            Infuse Official Group Brand Colors
                          </span>
                          <span className="text-[10px] text-neutral-500 leading-normal block">
                            Harmonize garments with {groupColors.map(c => c.name).join(' & ')} palette.
                          </span>
                        </div>
                      </label>
                    </div>
                  )}

                  {/* Mode C: Curated Aesthetic Presets */}
                  {outfitMode === 'preset' && (
                    <div className="space-y-2 pt-1">
                      <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-600 mb-1">
                        Select Curated K-Pop Styling Aesthetic:
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {[
                          'Airport Casual & Blazer',
                          'High-Fashion Stage Suit',
                          'Soft Pastel Mohair Knit',
                          'Y2K Retro Pop Streetwear',
                          'Dance Practice Oversized Set',
                          'Avant-Garde Velvet Suiting',
                          'Minimalist Poplin Chic',
                          'Racing Moto Jacket & Denim',
                          'Preppy Academia & Cardigan'
                        ].map((aesthetic, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedOutfitAesthetic(aesthetic)}
                            className={`p-2 rounded-xl text-left border transition-all text-xs font-bold ${
                              selectedOutfitAesthetic === aesthetic
                                ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-xs'
                                : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                            }`}
                          >
                            {aesthetic}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mode D: Encyclopedic Garment Wardrobe Library */}
                  {outfitMode === 'wardrobe' && (
                    <div className="space-y-3.5 pt-1">
                      {/* Official Group Colors Infusion Status */}
                      <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center -space-x-1">
                            {groupColors && groupColors.length > 0 ? (
                              groupColors.slice(0, 4).map((c, ci) => (
                                <span 
                                  key={ci} 
                                  className="w-4 h-4 rounded-full border border-white shadow-xs inline-block" 
                                  style={{ backgroundColor: c.hex || '#333' }}
                                  title={`${c.name} (${c.hex || ''})`}
                                />
                              ))
                            ) : (
                              <span className="w-4 h-4 rounded-full bg-neutral-400" />
                            )}
                          </div>
                          <div className="text-[11px] font-bold text-neutral-800">
                            Group Brand Colors Applied
                            <span className="text-[10px] text-neutral-500 font-normal ml-1.5">
                              ({groupColors && groupColors.length > 0 ? groupColors.map(c => c.name).join(' · ') : 'Tailored neutrals & suiting tones'})
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 self-start sm:self-auto">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Strict Style & Color Coherence Active</span>
                        </div>
                      </div>

                      {/* Curated Cohesive Aesthetic Capsules */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-indigo-500" />
                            Curated Aesthetic Capsule (Ensures Matching Outfits)
                          </span>
                          <span className="text-[9px] text-neutral-400 font-medium">Guaranteed no clashing pieces</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedCapsuleAesthetic('all')}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                              selectedCapsuleAesthetic === 'all'
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                            }`}
                          >
                            ✨ All Capsules
                          </button>
                          {AESTHETIC_CAPSULES.map(cap => (
                            <button
                              key={cap.id}
                              type="button"
                              onClick={() => setSelectedCapsuleAesthetic(cap.id)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                selectedCapsuleAesthetic === cap.id
                                  ? 'bg-indigo-600 text-white shadow-xs'
                                  : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                              }`}
                              title={cap.description}
                            >
                              {cap.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Subcategory Filter Tabs & Search */}
                      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between">
                        <div className="flex flex-wrap gap-1 bg-white p-1 rounded-lg border border-neutral-200 text-[10px] font-bold">
                          {[
                            { key: 'all', label: 'All Items' },
                            { key: 'tops', label: '👚 Tops' },
                            { key: 'bottoms', label: '👖 Bottoms' },
                            { key: 'jackets', label: '🧥 Jackets' },
                            { key: 'footwear', label: '👟 Footwear' },
                            { key: 'accessories', label: '💎 Accessories' }
                          ].map((tab) => (
                            <button
                              key={tab.key}
                              type="button"
                              onClick={() => setWardrobeCategory(tab.key as any)}
                              className={`px-2 py-1 rounded-md transition-all ${
                                wardrobeCategory === tab.key
                                  ? 'bg-indigo-600 text-white shadow-xs'
                                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                              }`}
                            >
                              {tab.label}
                            </button>
                          ))}
                        </div>

                        {/* Cohesive Assemble Co-ord Button */}
                        <button
                          type="button"
                          onClick={() => {
                            const c0 = groupColors?.[0];
                            const c1 = groupColors?.[1];
                            const c2 = groupColors?.[2];
                            const colorwayObj = {
                              primary: c0?.name ? `${c0.name}${c0.hex ? ` (${c0.hex})` : ''}` : "deep navy suiting tone",
                              secondary: c1?.name ? `${c1.name}${c1.hex ? ` (${c1.hex})` : ''}` : "crisp optic white",
                              neutral: c2?.name ? `${c2.name}${c2.hex ? ` (${c2.hex})` : ''}` : "tailored charcoal wool"
                            };
                            const coord = getRandomGarmentCoordinate(
                              genderStr, 
                              colorwayObj, 
                              selectedCapsuleAesthetic !== 'all' ? selectedCapsuleAesthetic : undefined
                            );
                            setCustomOutfitText(coord.prompt);
                            setAssembledCoordPreview({
                              title: coord.title,
                              capsuleName: coord.capsuleName,
                              topName: coord.top.name,
                              bottomName: coord.bottom.name,
                              jacketName: coord.jacket?.name,
                              accName: coord.accessory?.name,
                              colorScheme: `${colorwayObj.primary} + ${colorwayObj.secondary}`
                            });
                          }}
                          className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all shrink-0"
                          title="Generate a cohesive, matching Top + Bottom + Jacket + Accessory coordinate from the chosen capsule and group colors"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>🎲 Assemble Cohesive Co-ord</span>
                        </button>
                      </div>

                      {/* Search Bar */}
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={wardrobeSearchQuery}
                          onChange={(e) => setWardrobeSearchQuery(e.target.value)}
                          placeholder="Search tops, bottoms, jackets, fabrics (e.g. mohair, denim, corset, gurkha)..."
                          className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-neutral-200 rounded-xl placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                        />
                        {wardrobeSearchQuery && (
                          <button
                            type="button"
                            onClick={() => setWardrobeSearchQuery('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-neutral-400 hover:text-neutral-600"
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      {/* Assembled Co-ord Alert / Preview if present */}
                      {assembledCoordPreview && (
                        <div className="bg-indigo-50/90 border border-indigo-200 p-3 rounded-xl flex flex-col gap-2 shadow-xs">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3 text-indigo-600" />
                                {assembledCoordPreview.capsuleName ? `${assembledCoordPreview.capsuleName} · ` : ''}{assembledCoordPreview.title}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setAssembledCoordPreview(null)}
                              className="text-[10px] text-indigo-500 hover:text-indigo-700 font-bold"
                            >
                              Dismiss
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-1.5 text-[9px] font-bold">
                            <span className="bg-white text-indigo-900 px-2 py-0.5 rounded-full border border-indigo-200">
                              👚 {assembledCoordPreview.topName}
                            </span>
                            <span className="bg-white text-indigo-900 px-2 py-0.5 rounded-full border border-indigo-200">
                              👖 {assembledCoordPreview.bottomName}
                            </span>
                            {assembledCoordPreview.jacketName && (
                              <span className="bg-white text-indigo-900 px-2 py-0.5 rounded-full border border-indigo-200">
                                🧥 {assembledCoordPreview.jacketName}
                              </span>
                            )}
                            {assembledCoordPreview.accName && (
                              <span className="bg-white text-indigo-900 px-2 py-0.5 rounded-full border border-indigo-200">
                                💎 {assembledCoordPreview.accName}
                              </span>
                            )}
                          </div>
                          {assembledCoordPreview.colorScheme && (
                            <div className="text-[9px] text-indigo-600 font-medium">
                              🎨 Official Group Palette Infused: {assembledCoordPreview.colorScheme}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Current Selected Outfit Prompt Text Preview */}
                      {customOutfitText.trim() && (
                        <div className="bg-white p-3 rounded-xl border border-indigo-200 shadow-xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600">
                              Selected Coordinate Prompt
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setCustomOutfitText('');
                                setAssembledCoordPreview(null);
                              }}
                              className="text-[9px] text-red-500 hover:text-red-700 font-bold"
                            >
                              Clear Selection
                            </button>
                          </div>
                          <p className="text-xs text-neutral-800 italic leading-relaxed line-clamp-2">
                            "{customOutfitText}"
                          </p>
                        </div>
                      )}

                      {/* Scrollable Garment Cards Grid */}
                      <div className="max-h-72 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                        {(() => {
                          const isFemale = genderStr.toLowerCase().includes('female') || genderStr.toLowerCase().includes('girl');
                          const activeCapsule = selectedCapsuleAesthetic !== 'all' 
                            ? AESTHETIC_CAPSULES.find(c => c.id === selectedCapsuleAesthetic) 
                            : null;
                          const capsuleAllowedIds = activeCapsule 
                            ? (isFemale ? activeCapsule.femaleItemIds : activeCapsule.maleItemIds) 
                            : null;

                          const filtered = searchGarments(wardrobeSearchQuery, isFemale ? 'female' : 'male').filter(item => {
                            if (capsuleAllowedIds && !capsuleAllowedIds.includes(item.id)) return false;
                            if (wardrobeCategory === 'all') return true;
                            return item.category === wardrobeCategory;
                          });

                          if (filtered.length === 0) {
                            return (
                              <div className="text-center py-6 bg-white rounded-xl border border-dashed border-neutral-200">
                                <p className="text-xs text-neutral-500">
                                  {capsuleAllowedIds 
                                    ? `No garments in "${activeCapsule?.name}" match the current search.` 
                                    : `No garments match "${wardrobeSearchQuery}".`}
                                </p>
                              </div>
                            );
                          }

                          return filtered.map((item) => (
                            <div
                              key={item.id}
                              className="bg-white p-3 rounded-xl border border-neutral-200 hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                            >
                              <div className="space-y-1 flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="text-xs font-bold text-neutral-900">{item.name}</span>
                                  <span className="text-[9px] font-bold bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded">
                                    {item.subcategory}
                                  </span>
                                  {item.materials.slice(0, 2).map((m, mi) => (
                                    <span key={mi} className="text-[9px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded">
                                      {m}
                                    </span>
                                  ))}
                                </div>
                                <p className="text-[10px] text-neutral-600 leading-snug line-clamp-1">
                                  {item.silhouette}
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {item.kpopVibes.slice(0, 3).map((v, vi) => (
                                    <span key={vi} className="text-[8px] font-bold text-neutral-400">
                                      #{v}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCustomOutfitText(item.promptSnippet);
                                    setAssembledCoordPreview(null);
                                  }}
                                  className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-bold transition-colors"
                                  title="Replace outfit description with this garment"
                                >
                                  Use as Outfit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCustomOutfitText(prev => prev ? `${prev}, paired with ${item.promptSnippet}` : item.promptSnippet);
                                  }}
                                  className="px-2 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-[10px] font-bold transition-colors"
                                  title="Add this garment to the current coordinate"
                                >
                                  + Layer/Add
                                </button>
                              </div>
                            </div>
                          ));
                        })()}
                      </div>

                      {/* Color Adaptation Checkbox */}
                      <label className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-neutral-200 cursor-pointer hover:bg-neutral-50/60 transition-colors">
                        <input
                          type="checkbox"
                          checked={adaptOutfitColors}
                          onChange={(e) => setAdaptOutfitColors(e.target.checked)}
                          className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="text-left">
                          <span className="text-xs font-bold text-neutral-900 block">
                            Infuse Official Group Brand Colors
                          </span>
                          <span className="text-[10px] text-neutral-500 leading-normal block">
                            Harmonize garments with {groupColors.map(c => c.name).join(' & ')} palette.
                          </span>
                        </div>
                      </label>
                    </div>
                  )}
                </div>
              )}

              {/* SECTION: HAIR & COLOR STYLING */}
              {(stylingTab === 'hair' || stylingTab === 'all') && (
                <div className="space-y-3 bg-neutral-50/60 p-4 rounded-xl border border-neutral-200/80">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                        <Scissors className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900">
                        Haircut, Length & Color Customization
                      </h4>
                    </div>

                    {/* Hair Mode Buttons */}
                    <div className="flex bg-neutral-200/80 p-0.5 rounded-lg text-[10px] font-bold">
                      <button
                        onClick={() => setHairMode('custom')}
                        className={`px-3 py-1 rounded-md transition-all ${
                          hairMode === 'custom' ? 'bg-white text-purple-600 shadow-xs' : 'text-neutral-600'
                        }`}
                      >
                        🎨 Hair Specs
                      </button>
                      <button
                        onClick={() => setHairMode('reference')}
                        className={`px-3 py-1 rounded-md transition-all ${
                          hairMode === 'reference' ? 'bg-white text-purple-600 shadow-xs' : 'text-neutral-600'
                        }`}
                      >
                        ✂️ Hair Photo
                      </button>
                    </div>
                  </div>

                  {/* Mode A: Granular Custom Hair Specs */}
                  {hairMode === 'custom' && (
                    <div className="space-y-3.5 pt-1">
                      {/* Hair Length */}
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-neutral-600 block mb-1.5">
                          1. Hair Length:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            'ultra-short (pixie / buzz cut)',
                            'short (chin bob / two-block / crop)',
                            'ear-length (curtain bangs / pageboy)',
                            'shoulder-length (lob / shag)',
                            'collarbone-length (layered wolf cut)',
                            'long (chest to mid-back waves)',
                            'extra long (waist / hip-length)'
                          ].map((len, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setCustomHairLength(len)}
                              className={`text-[10px] font-bold px-3 py-1 rounded-full border transition-all ${
                                customHairLength === len
                                  ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                                  : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                              }`}
                            >
                              {len}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Hair Color & Dye Technique */}
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-neutral-600 block mb-1.5">
                          2. Hair Color & Dye Technique:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            'natural pitch black',
                            'espresso dark brown',
                            'platinum silver blonde',
                            'pastel lavender lilac',
                            'poison cherry ruby red',
                            'electric cobalt blue',
                            'rose gold peach blonde',
                            'split-dye (half black half blonde)',
                            'two-tone peek-a-boo underlayer',
                            'face-framing money-piece highlights',
                            'holographic prism melt'
                          ].map((col, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setCustomHairColor(col)}
                              className={`text-[10px] font-bold px-3 py-1 rounded-full border transition-all ${
                                customHairColor === col
                                  ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                                  : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                              }`}
                            >
                              {col}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Hair Texture & Style */}
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-neutral-600 block mb-1.5">
                          3. Styling Texture & Fringe:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            'sleek pin-straight with liquid gloss',
                            'soft beach waves with curtain air bangs',
                            'feathered wolf cut with airy fringe',
                            'textured two-block with parted bangs',
                            'voluminous perm curls',
                            'sleek high ponytail',
                            'half-up ribbon topknot with wispy tendrils',
                            'stylish space buns',
                            'slicked-back wet look'
                          ].map((tex, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setCustomHairTexture(tex)}
                              className={`text-[10px] font-bold px-3 py-1 rounded-full border transition-all ${
                                customHairTexture === tex
                                  ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                                  : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                              }`}
                            >
                              {tex}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Additional Hair Notes */}
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-600 mb-1">
                          Additional Hair Notes (Optional):
                        </label>
                        <input
                          type="text"
                          value={customHairNotes}
                          onChange={(e) => setCustomHairNotes(e.target.value)}
                          placeholder="e.g. ultra fine soft wispy front fringe, soft natural sheen..."
                          className="w-full text-xs bg-white border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Mode B: Hair Reference Photo */}
                  {hairMode === 'reference' && (
                    <div className="space-y-3 pt-1">
                      <input 
                        ref={hairFileInputRef}
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, setHairReferenceImage);
                        }}
                      />

                      {!hairReferenceImage ? (
                        <div
                          onDragOver={(e) => { e.preventDefault(); setIsDraggingHair(true); }}
                          onDragLeave={() => setIsDraggingHair(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setIsDraggingHair(false);
                            const file = e.dataTransfer.files?.[0];
                            if (file) handleFileUpload(file, setHairReferenceImage);
                          }}
                          onClick={() => hairFileInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                            isDraggingHair 
                              ? 'border-purple-500 bg-purple-50/50 scale-[1.01]' 
                              : 'border-neutral-300 hover:border-purple-400 bg-white hover:bg-neutral-50/80'
                          }`}
                        >
                          <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-2">
                            <Scissors className="w-5 h-5" />
                          </div>
                          <p className="text-xs font-bold text-neutral-800">
                            Drop hairstyle reference photo here, or <span className="text-purple-600 underline">browse</span>
                          </p>
                          <p className="text-[10px] text-neutral-500 mt-1">
                            AI will analyze the haircut, length, styling texture, and dye technique from this photo.
                          </p>
                        </div>
                      ) : (
                        <div className="bg-white p-3 rounded-xl border border-neutral-200 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img 
                              src={hairReferenceImage} 
                              alt="Hairstyle Reference" 
                              className="w-14 h-14 object-cover rounded-lg border border-neutral-200 shadow-sm"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-xs font-bold text-neutral-900">Hairstyle Reference Loaded</span>
                              </div>
                              <p className="text-[10px] text-neutral-500">Ready to replicate haircut & color</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => hairFileInputRef.current?.click()}
                              className="text-[10px] font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-2.5 py-1.5 rounded-lg transition-colors"
                            >
                              Change Photo
                            </button>
                            <button
                              onClick={() => setHairReferenceImage(null)}
                              className="text-[10px] font-bold text-red-600 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Transformation Lock Info Banner */}
              <div className="bg-indigo-50/80 border border-indigo-100 p-3 rounded-xl flex items-start gap-2.5">
                <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div className="text-[11px] text-indigo-900 leading-normal">
                  <span className="font-bold">Identity & Facial Integrity Lock: </span>
                  {stageName}&apos;s exact face, eyes, bone structure, and 100% natural bare-faced skin texture will be strictly preserved while applying your custom styling directives.
                </div>
              </div>

              {/* Status / Feedback messages */}
              {customStylingError && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-xl text-xs font-bold text-red-600">
                  {customStylingError}
                </div>
              )}

              {customStylingSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs font-bold text-emerald-700 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>{customStylingSuccess}</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsCustomStylingModalOpen(false)}
                disabled={isApplyingCustomStyling}
                className="text-xs font-bold text-neutral-600 hover:text-neutral-900 px-4 py-2 rounded-xl hover:bg-neutral-100 transition-colors disabled:opacity-40"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handleApplyCustomStyling}
                disabled={isApplyingCustomStyling}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-60 disabled:bg-neutral-400 cursor-pointer"
              >
                {isApplyingCustomStyling ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Custom Look...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {stylingTab === 'outfit' ? 'Apply Custom Outfit' : stylingTab === 'hair' ? 'Apply Custom Hair' : 'Apply Complete Look'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
