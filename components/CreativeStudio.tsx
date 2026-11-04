import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { FullProfile, MemberProfileData, Album, OfficialColor, MerchItem, VisualConcept } from '../types';
import { generateImage } from '../services/geminiService';
import { getOutfitColorDistributionPrompt, getDynamicOutfitDescription, detectArtistGender, isSoloArtist } from '../services/profileDataHelper';
import { getYouthfulIdolAestheticDirective, getFreshKpopHairstyle, detectHairLengthCategory, getAmazingMatchingShoesDirective } from '../services/kpopStylingService';
import { 
  Sparkles, Sliders, Save, Copy, Check, Zap, Eye, Camera, Lightbulb, 
  Shirt, Image as ImageIcon, RotateCcw, Play, Pause, ChevronDown, Award, Star, RefreshCw, Scissors,
  Disc, Maximize2, X, Plus, Trash2, ShoppingBag, Palette, Download, ExternalLink, Sparkle, Layers, BookOpen
} from 'lucide-react';

interface CreativeStudioProps {
  groupProfile: FullProfile;
  isSolo?: boolean;
  onUpdateProfile?: (updatedProfile: Partial<FullProfile>) => void;
}

type StudioTab = 'members' | 'albums' | 'branding' | 'concept' | 'merch';

export const CreativeStudio: React.FC<CreativeStudioProps> = ({ 
  groupProfile, 
  isSolo, 
  onUpdateProfile 
}) => {
  const [activeStudioTab, setActiveStudioTab] = useState<StudioTab>('members');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), 6000);
    return () => clearTimeout(t);
  }, [error]);

  const colors: OfficialColor[] = groupProfile.officialColors || [{ name: 'Jade', hex: '#10b981', description: 'Energetic' }];
  const mainHex = colors[0]?.hex || '#10b981';

  // ---------------------------------------------------------------------------
  // TAB 1: PORTRAIT casting studio states
  // ---------------------------------------------------------------------------
  const [selectedMemberIdx, setSelectedMemberIdx] = useState<number>(0);
  const currentMember: MemberProfileData | undefined = groupProfile.members?.[selectedMemberIdx];
  
  const [portraitFraming, setPortraitFraming] = useState<string>('Front-facing medium upper-body portrait (framed from head down to hips with hips and waistline clearly visible)');
  const [portraitAesthetic, setPortraitAesthetic] = useState<string>('Elevated Airport Casual & Blazer');
  const [portraitHair, setPortraitHair] = useState<string>('Original Profile Hair');
  const [portraitExpression, setPortraitExpression] = useState<string>('Confident Intense Smize');

  const [selectedHairPreset, setSelectedHairPreset] = useState<string>('profile');
  const [customHairText, setCustomHairText] = useState<string>('');

  const hairPresets = [
    { value: 'profile', label: '✨ Use Current Profile Hairstyle & Color' },
    { value: 'original', label: '🌿 Natural Hair: Retain 100% Un-Dyed Natural Hair' },
    { value: 'natural_black', label: '🖤 Sleek Midnight Jet Black' },
    { value: 'natural_espresso', label: '☕ Soft Dark Espresso Brown' },
    { value: 'custom', label: '🎨 Custom Hairstyle & Hair Color (Type your own below)' }
  ];

  const handleHairPresetChange = (presetValue: string) => {
    setSelectedHairPreset(presetValue);
    setPortraitReady(false);
    if (!currentMember) return;
    
    if (presetValue === 'profile') {
      const defaultHair = currentMember.dyedHairColor && currentMember.dyedHairColor !== 'none' && !currentMember.dyedHairColor.toLowerCase().includes('keeps natural')
        ? `${currentMember.currentHairStyle || 'stylish hair'} (dyed: ${currentMember.dyedHairColor})`
        : `${currentMember.currentHairStyle || 'stylish hair'} (natural: ${currentMember.originalHairColor})`;
      setPortraitHair(defaultHair);
    } else if (presetValue === 'original') {
      const originalHair = `${currentMember.originalHairType || 'straight'} hair, natural ${currentMember.originalHairColor || 'dark espresso'}`;
      setPortraitHair(originalHair);
    } else if (presetValue === 'custom') {
      setPortraitHair(customHairText || 'custom stylized hair');
    } else {
      const preset = hairPresets.find(p => p.value === presetValue);
      if (preset) {
        const strippedLabel = preset.label.replace(/^[\s\S]*?\s/, '').trim();
        setPortraitHair(strippedLabel);
      }
    }
  };

  const handleCustomHairTextChange = (text: string) => {
    setCustomHairText(text);
    setPortraitReady(false);
    if (selectedHairPreset === 'custom') {
      setPortraitHair(text);
    }
  };
  
  // Update defaults when switching members
  useEffect(() => {
    if (currentMember) {
      setSelectedHairPreset('profile');
      setCustomHairText('');
      const defaultHair = currentMember.dyedHairColor && currentMember.dyedHairColor !== 'none' && !currentMember.dyedHairColor.toLowerCase().includes('keeps natural')
        ? `${currentMember.currentHairStyle || 'stylish hair'} (dyed: ${currentMember.dyedHairColor})`
        : `${currentMember.currentHairStyle || 'stylish hair'} (natural: ${currentMember.originalHairColor})`;
      setPortraitHair(defaultHair);
      setPortraitExpression('Confident Intense Smize');
    }
  }, [currentMember?.stageName]);

  const [portraitBackground, setPortraitBackground] = useState<string>('Solid plain light grey studio background with hex code #D1D5DB');
  const [isCompilingPortrait, setIsCompilingPortrait] = useState<boolean>(false);
  const [portraitProgress, setPortraitProgress] = useState<number>(0);
  const [portraitReady, setPortraitReady] = useState<boolean>(false);
  const [customPromptGuideline, setCustomPromptGuideline] = useState<string>('');
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [isRenderingPortrait, setIsRenderingPortrait] = useState<boolean>(false);
  const [portraitRenderError, setPortraitRenderError] = useState<string | null>(null);

  useEffect(() => {
    if (!portraitRenderError) return;
    const t = setTimeout(() => setPortraitRenderError(null), 6000);
    return () => clearTimeout(t);
  }, [portraitRenderError]);
  const usedHairstylesRef = useRef<number[]>([]);

  // Auto-compiled prompt for stable portrait rendering
  const compiledPortraitPrompt = useMemo(() => {
    if (!currentMember) return '';
    const isSoloAct = Boolean(isSolo || isSoloArtist(groupProfile.groupType));
    const detectedGender = detectArtistGender(groupProfile.groupType, groupProfile.conceptDescription, currentMember.gender);
    const groupTypeInstruction = detectedGender === 'Male'
      ? (isSoloAct ? 'MALE (Male Solo Artist)' : 'MALE (Boy Group Member)')
      : (isSoloAct ? 'FEMALE (Female Solo Artist)' : 'FEMALE (Girl Group Member)');
    const genderStr = detectedGender === 'Male' ? 'male' : 'female';
    
    const memberIndex = groupProfile.members?.findIndex(m => m.stageName === currentMember.stageName) ?? 0;
    const colorWayPrompt = getOutfitColorDistributionPrompt(colors || [], memberIndex);
    const outfitDescription = getDynamicOutfitDescription(portraitAesthetic || currentMember.personalFashionStyle || 'Airport Casual', memberIndex, colorWayPrompt, genderStr, colors);

    // Hair details incorporating both dyed hair and natural hair
    const hairDetails = `wearing a stylish custom hairstyle: ${portraitHair} (original natural hair: ${currentMember.originalHairColor || 'dark brown'}, hair type: ${currentMember.originalHairType || 'straight'})`;
    const youthfulDirective = getYouthfulIdolAestheticDirective(currentMember.race || 'Asian', currentMember.placeOfBirth);

    const isFullBody = portraitFraming.toLowerCase().includes('full-body') || portraitFraming.toLowerCase().includes('full body');
    const shoesDirective = isFullBody ? getAmazingMatchingShoesDirective(genderStr, outfitDescription, colors).prompt : '';

    const base = isFullBody
      ? `A hyper-realistic 8k resolution full-body standing head-to-toe portrait of a real ${currentMember.race || 'Asian'} ${groupTypeInstruction} K-pop idol named ${currentMember.stageName} who is a youthful 18-21 years old, with ${currentMember.skinTone || 'fair (Fitzpatrick Type II)'} skin, completely bare-faced with 100% natural unadorned skin, ZERO makeup, NO eyeliner, NO eyeshadow, NO lipstick, NO blush, NO face cosmetics, displaying authentic raw human skin texture with natural skin pores and a healthy natural skin glow, showcasing a natural unique expression: ${portraitExpression}. They have completely natural, organic, and proportional facial structures.
${youthfulDirective}`
      : `A hyper-realistic 8k resolution front-facing medium upper-body portrait (framed from head down to hips with hips and waistline clearly visible) of a real ${currentMember.race || 'Asian'} ${groupTypeInstruction} K-pop idol named ${currentMember.stageName} who is a youthful 18-21 years old, with ${currentMember.skinTone || 'fair (Fitzpatrick Type II)'} skin, styled with their upper body and hips visible, completely bare-faced with 100% natural unadorned skin, ZERO makeup, NO eyeliner, NO eyeshadow, NO lipstick, NO blush, NO face cosmetics, displaying authentic raw human skin texture with natural skin pores and a healthy natural skin glow, showcasing a natural unique expression: ${portraitExpression}. They have completely natural, organic, and proportional facial structures.
${youthfulDirective}`;
    
    const details = `Framing: ${portraitFraming}. Styling aesthetic: ${outfitDescription}. ELEVATED KOREAN CASUAL FASHION: Even when casual, the outfit is NEVER basic, boring, or generic. It embodies authentic modern Korean idol casual fashion (K-Fashion as seen in Seoul airport style, Seongsu street fashion, and rehearsal chic)—giving the idol wearing it an undeniable aesthetic persona, charisma, and effortless cool factor. The outfit is stylish, original, modern, and high-fashion casual, utilizing tangible real fabrics (tailored wool blends, soft cottons, linens, ribbed knits, and washed denim) with coordinate harmony. ABSOLUTELY NEVER DO TECHWEAR OR ANYTHING RELATED TO IT: ABSOLUTELY NO techwear, NO ripstop nylon, NO parachute pants, NO tactical vest armor, NO military harness, NO chest rigs, NO tactical pouches, NO plain grey undershirt, and NO cheap cosplay gear. CRITICAL OFFICIAL BRAND COLOR SCHEME & MATCHING HARMONY: ${colorWayPrompt}. ABSOLUTELY NO MAKEUP, NO COSMETICS, NO EYELINER, NO EYESHADOW, NO LIPSTICK, NO BLUSH, COMPLETELY BARE-FACED REAL HUMAN FACE. Hairstyle/color details: ${hairDetails}. Background environment: ${portraitBackground}.${shoesDirective ? ' ' + shoesDirective : ''}`;
    
    const custom = customPromptGuideline ? ` Custom designer details: ${customPromptGuideline}.` : '';
    
    const framingRule = isFullBody
      ? 'STRICT FRAMING CONSTRAINT: Complete full-body head-to-toe standing shot showing head down to feet with their shoes resting flat on the studio floor in full clear view.'
      : 'STRICT FRAMING CONSTRAINT: Medium upper-body portrait from head down to hips with waistline and hips visible.';

    const rules = `Their facial features, youthful bone structure, and eyes MUST look organic, energetic, young, and strictly match their ${currentMember.race || 'Asian'} ethnicity, looking like a real-world K-pop idol in their early 20s (DO NOT make them look mature, middle-aged, or artificial/plastic-looking like a CGI/wax figure with heavy cosmetic modifications). NO JEWELRY, NO NECKLACES, NO EARRINGS, NO BRACELETS, NO RINGS, ABSOLUTELY NO JEWELRY. ${framingRule} THIS IS A ${genderStr.toUpperCase()}, DO NOT GENERATE THE WRONG GENDER.`;

    return `${base} ${details}${custom} ${rules}`;
  }, [currentMember, portraitFraming, portraitAesthetic, portraitHair, portraitExpression, portraitBackground, customPromptGuideline, colors, groupProfile.groupType]);

  const handleCompilePortrait = () => {
    setIsCompilingPortrait(true);
    setPortraitProgress(0);
    setPortraitReady(false);
    
    const interval = setInterval(() => {
      setPortraitProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCompilingPortrait(false);
          setPortraitReady(true);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleSaveMemberPrompt = () => {
    if (!onUpdateProfile || !currentMember || selectedMemberIdx === undefined) return;
    
    const updatedMembers = [...(groupProfile.members || [])];
    updatedMembers[selectedMemberIdx] = {
      ...currentMember,
      imagePrompt: compiledPortraitPrompt
    };

    onUpdateProfile({
      members: updatedMembers
    });
    
    setSuccess("Portrait prompt compiled and saved permanently to member briefcase!");
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleRenderActualImage = async () => {
    if (!onUpdateProfile || !currentMember || selectedMemberIdx === undefined) return;
    setIsRenderingPortrait(true);
    setPortraitRenderError(null);
    try {
      const imgUrl = await generateImage(compiledPortraitPrompt);
      
      const updatedMembers = [...(groupProfile.members || [])];
      updatedMembers[selectedMemberIdx] = {
        ...currentMember,
        imagePrompt: compiledPortraitPrompt,
        imageUrl: imgUrl
      };

      onUpdateProfile({
        members: updatedMembers
      });
      
      setSuccess(`Physical photoshoot successfully completed! ${currentMember.stageName}'s official photoprofile has been synchronized and permanently saved.`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error(err);
      setPortraitRenderError(err instanceof Error ? err.message : "Photoshoot failed. Please try again later.");
    } finally {
      setIsRenderingPortrait(false);
    }
  };

  const handleRenderNewOutfitOnly = async () => {
    if (!onUpdateProfile || !currentMember || selectedMemberIdx === undefined) return;
    setIsRenderingPortrait(true);
    setPortraitRenderError(null);
    try {
      const detectedGender = detectArtistGender(groupProfile.groupType, groupProfile.conceptDescription, currentMember.gender);
      const genderStr = detectedGender === 'Male' ? 'male' : 'female';
      const randomSeed = Math.floor(Math.random() * 900) + Math.floor(Date.now() / 1000) % 1000;
      const colorWayPrompt = getOutfitColorDistributionPrompt(colors || [], selectedMemberIdx + randomSeed);

      const fashionStyle = currentMember.personalFashionStyle || portraitAesthetic || 'Classic / Casual';
      const nameHash = currentMember.stageName ? currentMember.stageName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
      const outfitDescription = getDynamicOutfitDescription(fashionStyle, nameHash + randomSeed, colorWayPrompt, genderStr, colors);

      const youthfulDirective = getYouthfulIdolAestheticDirective(currentMember.race || 'Asian', currentMember.placeOfBirth);

      const promptToUse = currentMember.imageUrl
        ? `A hyper-realistic front-facing medium upper-body portrait (framed from head down to hips with hips and waistline clearly visible) of the exact same real K-pop idol ${currentMember.stageName} who is a youthful 18-21 years old.
STRICT CAMERA FRAMING & COMPOSITION LOCK: Medium upper-body portrait framing from head down to hips. The camera frame, field of view, focal distance, eye-level angle, head-to-torso proportions, scale, and composition MUST BE 100% IDENTICAL to the provided reference image. The hips, waistline, and full upper body must remain clearly visible in the shot. Do NOT zoom in, do NOT zoom out, do NOT change the cropping, and do NOT pan or tilt the camera. The idol is positioned in the exact same front-facing pose, head angle, eye level, and medium upper-body framing (head to hips) against the solid plain light grey background (#D1D5DB).
CRITICAL IDENTITY & FACIAL CONSTRAINTS: You MUST preserve their exact face, youthful facial features, young 18-21 year old facial bone structure, skin tone, eye color, gaze direction, neutral/subtle expression, bare-faced natural skin texture identical to the reference image. DO NOT AGE THE PERSON.
CRITICAL HAIRSTYLE & HAIR COLOR PRESERVATION (KEEP EXACT HAIR): You MUST keep their EXACT SAME hairstyle, haircut silhouette, hair length, bangs, and hair color 100% IDENTICAL to the reference image. Do NOT alter their hair or hair color in any way.
${youthfulDirective}
CHANGE OUTFIT ONLY: Replace ONLY their clothing with an elevated Korean casual fashion outfit with captivating persona, flair, and group color harmony: ${outfitDescription}. ELEVATED KOREAN CASUAL FASHION (NEVER BASIC OR BORING): Even though the outfit is casual, it MUST NOT look basic, generic, or boring. It embodies authentic modern Korean fashion (K-Fashion as seen in Seoul idol airport fashion, Seongsu-dong street style, and rehearsal chic)—casual wear must still give the idol who wears it an unmistakable aesthetic persona, charisma, and undeniable sense of style. GARMENT MATERIAL & WAIST-UP CO-ORD HARMONY: Every garment element uses authentic, tangible fabrics (combed cotton jersey, washed denim, fine wool, soft mohair, crisp poplin, or loopback terry) with natural weave textures and believable cloth drape. In this exact same medium upper-body camera framing showing head down to hips, render BOTH the new top piece AND the visible waistband/top of the trousers or skirt so the new outfit is visibly complete and harmonized from the hips up. ABSOLUTELY NO basic boring blank t-shirts, NO drab featureless gym hoodies, and ABSOLUTELY NO techwear.
BACKGROUND & FRAMING: Solid plain light grey background with hex code #D1D5DB. Identical medium upper-body camera framing showing hips and waistline. ABSOLUTELY NO MAKEUP, NO COSMETICS, NO JEWELRY. THIS IS A ${genderStr.toUpperCase()}.`
        : compiledPortraitPrompt;

      const imgUrl = await generateImage(promptToUse, "1:1", currentMember.imageUrl || undefined);
      
      const updatedMembers = [...(groupProfile.members || [])];
      updatedMembers[selectedMemberIdx] = {
        ...currentMember,
        imagePrompt: promptToUse,
        imageUrl: imgUrl
      };

      onUpdateProfile({
        members: updatedMembers
      });
      
      setSuccess(`Outfit update photoshoot successfully completed! ${currentMember.stageName}'s official outfit has been updated.`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error(err);
      setPortraitRenderError(err instanceof Error ? err.message : "Outfit photoshoot failed. Please try again later.");
    } finally {
      setIsRenderingPortrait(false);
    }
  };

  const handleRenderNewHairstyleOnly = async () => {
    if (!onUpdateProfile || !currentMember || selectedMemberIdx === undefined) return;
    setIsRenderingPortrait(true);
    setPortraitRenderError(null);
    try {
      const detectedGender = detectArtistGender(groupProfile.groupType, groupProfile.conceptDescription, currentMember.gender);
      const genderStr = detectedGender === 'Male' ? 'male' : 'female';
      const currentLength = detectHairLengthCategory(currentMember.currentHairStyle);
      const freshHair = getFreshKpopHairstyle(genderStr, usedHairstylesRef.current, undefined, currentLength);
      usedHairstylesRef.current.push(freshHair.index);
      if (usedHairstylesRef.current.length > 25) {
        usedHairstylesRef.current.shift();
      }
      const youthfulDirective = getYouthfulIdolAestheticDirective(currentMember.race || 'Asian', currentMember.placeOfBirth);

      const promptToUse = currentMember.imageUrl
        ? `A hyper-realistic front-facing medium upper-body portrait (framed from head down to hips with hips and waistline clearly visible) of the exact same real K-pop idol ${currentMember.stageName} who is a youthful 18-21 years old.
STRICT CAMERA FRAMING & COMPOSITION LOCK: Medium upper-body portrait framing from head down to hips. The camera frame, field of view, focal distance, eye-level angle, head-to-torso proportions, scale, and composition MUST BE 100% IDENTICAL to the provided reference image. The hips, waistline, and full upper body must remain clearly visible. Do NOT zoom in, do NOT zoom out, do NOT change the cropping, and do NOT pan or tilt the camera. The idol is positioned in the exact same front-facing pose, head angle, eye level, and medium framing (head to hips) against the solid plain light grey background (#D1D5DB).
CRITICAL IDENTITY & FACIAL CONSTRAINTS: You MUST preserve their exact face, youthful facial features, young 18-21 year old facial bone structure, skin tone, eye color, gaze direction, neutral/subtle expression, and bare-faced natural skin texture identical to the provided reference image. DO NOT AGE THE PERSON.
${youthfulDirective}
CRITICAL OUTFIT PRESERVATION (KEEP EXACT SAME CLOTHING):
You MUST preserve their EXACT SAME clothing and outfit from the reference image. Do NOT change their clothes, do NOT change their top or bottoms, do NOT change their jacket, shirt, waistband, belt, or fabric colors. The clothing MUST REMAIN 100% IDENTICAL to what they are wearing in the reference image.
CHANGE HAIRSTYLE AND HAIR COLOR ONLY:
Change ONLY their hairstyle and hair color. Transform their hair into a brand new, stylish, youthful face-matching K-pop idol haircut and hair color transformation (${freshHair.title}): ${freshHair.prompt}. New Hair Color: ${freshHair.hairColor}. This hairstyle MUST perfectly match and flatter the idol's youthful facial structure, jawline, and natural features. It must look young, fresh, energetic, and modern—characteristic of an 18-21 year old K-pop idol with healthy natural sheen, soft strand definition, and realistic texture. ABSOLUTELY NO aging haircuts, NO dated middle-aged cuts, NO stiff grandma perms, NO matronly bobs, NO thinning or receding hair, and NO old person or uncle hairstyles.
BACKGROUND & FRAMING: Solid plain light grey background with hex code #D1D5DB. Identical medium upper-body camera framing showing head down to hips with hips and waistline visible. ABSOLUTELY NO MAKEUP, NO COSMETICS, NO JEWELRY. THIS IS A ${genderStr.toUpperCase()}.`
        : compiledPortraitPrompt;

      const imgUrl = await generateImage(promptToUse, "1:1", currentMember.imageUrl || undefined);
      
      const updatedMembers = [...(groupProfile.members || [])];
      updatedMembers[selectedMemberIdx] = {
        ...currentMember,
        imagePrompt: promptToUse,
        imageUrl: imgUrl,
        currentHairStyle: freshHair.title,
        dyedHairColor: freshHair.hairColor
      };

      onUpdateProfile({
        members: updatedMembers
      });
      
      setSuccess(`Hairstyle and hair color update photoshoot successfully completed! ${currentMember.stageName}'s hair has been updated to ${freshHair.title} (${freshHair.hairColor}).`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error(err);
      setPortraitRenderError(err instanceof Error ? err.message : "Hairstyle photoshoot failed. Please try again later.");
    } finally {
      setIsRenderingPortrait(false);
    }
  };

  // ---------------------------------------------------------------------------
  // TAB 2: ALBUM COVERS states & AI generation
  // ---------------------------------------------------------------------------
  const [selectedAlbumIdx, setSelectedAlbumIdx] = useState<number>(0);
  const currentAlbum: Album | undefined = groupProfile.discography?.[selectedAlbumIdx];

  const [coverArtDirection, setCoverArtDirection] = useState<string>('Standard CD Jewel Case format with high-contrast reflex highlight');
  const [coverArtTheme, setCoverArtTheme] = useState<string>('A beautiful 3D Abstract Jewel sculpture floating inside a void with glowing metallic textures');
  const [coverTitleCasing, setCoverTitleCasing] = useState<'UPPER' | 'lower' | 'Title'>('UPPER');
  const [isCompilingCover, setIsCompilingCover] = useState<boolean>(false);
  const [coverProgress, setCoverProgress] = useState<number>(0);
  const [coverReady, setCoverReady] = useState<boolean>(false);
  const [customCoverGuideline, setCustomCoverGuideline] = useState<string>('');
  const [isGeneratingCover, setIsGeneratingCover] = useState<boolean>(false);
  const [coverGenError, setCoverGenError] = useState<string | null>(null);

  const activeAlbumCoverUrl = currentAlbum?.albumCoverUrl || (currentAlbum ? groupProfile.albumCoverUrls?.[currentAlbum.title] : undefined);

  const compiledCoverPrompt = useMemo(() => {
    if (!currentAlbum) return '';
    const casingStyle = coverTitleCasing === 'UPPER' 
      ? 'capitalized block lettering' 
      : coverTitleCasing === 'lower' 
        ? 'lowercase subtle text' 
        : 'stylized font';
    const officialColorsStr = colors.map(c => `"${c.name}" (${c.hex})`).join(', ');
    const base = `A masterpiece 8k ultra-high resolution graphic design front album cover artwork for K-pop group "${groupProfile.groupName}" titled "${currentAlbum.title}" (${currentAlbum.type || 'Album'}).`;
    const styling = `Form factor packaging style: ${coverArtDirection}. Visual motif and theme: ${coverArtTheme}. Color Palette: Richly incorporating official group colors ${officialColorsStr}. Typographic title typography: "${coverTitleCasing === 'UPPER' ? currentAlbum.title.toUpperCase() : (coverTitleCasing === 'lower' ? currentAlbum.title.toLowerCase() : currentAlbum.title)}" in ${casingStyle}.`;
    const details = `Sleek, award-winning minimalist Korean graphic design, world-class typography, photorealistic textures, metallic foil accents, holographic sheen, professional album art aesthetic.`;
    const custom = customCoverGuideline ? ` Additional custom specifications: ${customCoverGuideline}.` : '';
    return `${base} ${styling}${custom} ${details}`;
  }, [currentAlbum, coverArtDirection, coverArtTheme, coverTitleCasing, colors, customCoverGuideline, groupProfile.groupName]);

  const handleCompileCover = () => {
    setIsCompilingCover(true);
    setCoverProgress(0);
    setCoverReady(false);

    const interval = setInterval(() => {
      setCoverProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCompilingCover(false);
          setCoverReady(true);
          return 100;
        }
        return prev + 15;
      });
    }, 120);
  };

  const handleGenerateAlbumCover = async () => {
    if (!onUpdateProfile || !currentAlbum) return;
    setIsGeneratingCover(true);
    setCoverGenError(null);
    try {
      const refImages: any[] = [];
      if (groupProfile.logoUrl) {
        refImages.push({ label: `${groupProfile.groupName} Official Logo Emblem`, dataUrl: groupProfile.logoUrl });
      }
      if (groupProfile.groupPhotoUrl) {
        refImages.push({ label: `${groupProfile.groupName} Group Photo Reference`, dataUrl: groupProfile.groupPhotoUrl });
      }

      const imgUrl = await generateImage(compiledCoverPrompt, "1:1", refImages.length > 0 ? refImages : undefined);
      
      const updatedDiscography = [...(groupProfile.discography || [])];
      updatedDiscography[selectedAlbumIdx] = {
        ...currentAlbum,
        albumCoverPrompt: compiledCoverPrompt,
        albumCoverUrl: imgUrl
      };

      const updatedAlbumUrls = {
        ...(groupProfile.albumCoverUrls || {}),
        [currentAlbum.title]: imgUrl
      };

      onUpdateProfile({
        discography: updatedDiscography,
        albumCoverUrls: updatedAlbumUrls
      });

      setSuccess(`Album cover for "${currentAlbum.title}" rendered and permanently saved!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error(err);
      setCoverGenError(err instanceof Error ? err.message : "Failed to generate album artwork. Please try again.");
    } finally {
      setIsGeneratingCover(false);
    }
  };

  const handleSaveCoverPrompt = () => {
    if (!onUpdateProfile || !currentAlbum) return;
    
    const updatedDiscography = [...(groupProfile.discography || [])];
    updatedDiscography[selectedAlbumIdx] = {
      ...currentAlbum,
      albumCoverPrompt: compiledCoverPrompt
    };

    onUpdateProfile({
      discography: updatedDiscography
    });

    setSuccess("Album cover art prompt and design configs saved permanently!");
    setTimeout(() => setSuccess(null), 3000);
  };

  // ---------------------------------------------------------------------------
  // TAB 3: BRANDING (Reactive Lightstick & 3D Render)
  // ---------------------------------------------------------------------------
  const [lightstickGlobe, setLightstickGlobe] = useState<string>('Crystal Hexagonal Dome reflecting lights at high-fashion angles');
  const [lightstickCoreEmblem, setLightstickCoreEmblem] = useState<string>('Rotating Miniature Group Silhouette Emblem designed in silver chrome');
  const [lightstickHandleStyle, setLightstickHandleStyle] = useState<string>('Sleek Matte Obsidian Black handle featuring custom rubberized grips');
  const [lightstickPower, setLightstickPower] = useState<boolean>(true);
  const [lightstickChoreography, setLightstickChoreography] = useState<'solid' | 'pulse' | 'flash' | 'strobe'>('pulse');
  const [stadiumCheerStream, setStadiumCheerStream] = useState<boolean>(false);
  const [isGeneratingLightstick, setIsGeneratingLightstick] = useState<boolean>(false);
  const [lightstickGenError, setLightstickGenError] = useState<string | null>(null);
  const [lightstickViewMode, setLightstickViewMode] = useState<'interactive' | 'render'>('interactive');

  const compiledBrandingPrompt = useMemo(() => {
    const officialColorsStr = colors.map(c => `"${c.name}" (${c.hex})`).join(' and ');
    return `An ultra-photorealistic 8k 3D studio product render of the official concert merchandise lightstick and retail collector packaging box for K-pop group "${groupProfile.groupName}".
Lightstick specifications:
- Globe Head: ${lightstickGlobe}, transparent scratch-resistant acrylic dome with delicate refractive crystal facets.
- Inside Emblem: ${lightstickCoreEmblem}, mounted at the center, backlit with dynamic glowing LED elements in the group's official brand colors (${officialColorsStr}).
- Handle Body: ${lightstickHandleStyle}, ergonomic luxury wand handle with tactile silicone buttons and subtle chrome trim.
- Packaging Box: Standing beside the glowing lightstick is its official luxury retail collector packaging box displaying the group's official logo design and geometric typography.
- Lighting & Presentation: Standing on a clean presentation surface in a seamless pure white minimalist studio background with soft studio lighting, subtle ground shadows, and crisp reflections. High-end luxury idol merchandise photography.`;
  }, [groupProfile.groupName, lightstickGlobe, lightstickCoreEmblem, lightstickHandleStyle, colors]);

  const handleGenerateLightstickRender = async () => {
    if (!onUpdateProfile) return;
    setIsGeneratingLightstick(true);
    setLightstickGenError(null);
    try {
      const refImages: any[] = [];
      if (groupProfile.logoUrl) {
        refImages.push({ label: `${groupProfile.groupName} Official Logo Emblem`, dataUrl: groupProfile.logoUrl });
      }

      const imgUrl = await generateImage(compiledBrandingPrompt, "1:1", refImages.length > 0 ? refImages : undefined);
      
      const updatedFandom = {
        ...(groupProfile.fandom || { name: 'Fans', nameOrigin: '', lightstickDescription: '', fandomPersonality: '', fandomMotto: '', handGesturePrompt: '' }),
        lightstickUrl: imgUrl,
        lightstickDescription: `Official Lightstick (${lightstickGlobe}, with ${lightstickCoreEmblem})`
      };

      onUpdateProfile({
        fandom: updatedFandom,
        logoDescription: `${groupProfile.logoDescription || ''} | Lightstick Blueprint: ${lightstickGlobe}, ${lightstickCoreEmblem}`
      });

      setLightstickViewMode('render');
      setSuccess("3D Photorealistic Lightstick render generated and saved to official fandom branding!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error(err);
      setLightstickGenError(err instanceof Error ? err.message : "Failed to generate lightstick render. Please try again.");
    } finally {
      setIsGeneratingLightstick(false);
    }
  };

  const handleSaveBrandingPrompt = () => {
    if (!onUpdateProfile) return;
    onUpdateProfile({
      logoDescription: `${groupProfile.logoDescription || ''} | Lightstick Blueprint: Globe ${lightstickGlobe}, Inside ${lightstickCoreEmblem}, glowing in ${colors.map(c=>c.name).join(', ')}.`
    });
    setSuccess("Official branding dome specifications saved in agency logs!");
    setTimeout(() => setSuccess(null), 3000);
  };

  // ---------------------------------------------------------------------------
  // TAB 4: CONCEPT PHOTOS states & AI Lookbook Generation
  // ---------------------------------------------------------------------------
  const LOOKBOOK_FRAMING_OPTIONS = [
    {
      id: 'upper_body_close_up',
      label: '📸 Upper Body Close-Up (Tight Chest-to-Head Cluster)',
      description: 'Strictly cropped from mid-chest/waist up. Zero legs, knees, or shoes. Tight layered cluster with intense facial focus and varied head heights.',
      aspectRatio: '16:9' as const,
      promptText: 'EXTREME STRICT CAMERA FRAMING CONSTRAINT: ULTRA-TIGHT UPPER BODY CLOSE-UP / BUST-TO-HEAD GROUP CLUSTER PORTRAIT ONLY. The camera is positioned at close proximity using an 85mm portrait telephoto lens, cropping tightly from the mid-chest/waist up to just above their heads. ZERO LEGS, ZERO KNEES, ZERO FEET, ZERO SHOES VISIBLE. ABSOLUTELY NO FULL BODY SHOT, DO NOT ZOOM OUT. All members are clustered tightly together across the horizontal frame in an intimate layered composition with multi-tiered head levels, putting intense focus on their facial charisma, eye contact, hairstyle textures, and upper-body wardrobe details.'
    },
    {
      id: 'waist_up_medium',
      label: '📷 Medium Waist-Up Group Portrait',
      description: 'Cropped at the waist to showcase jackets, collars, statement tops, and upper styling with zero legs visible.',
      aspectRatio: '16:9' as const,
      promptText: 'STRICT CAMERA FRAMING CONSTRAINT: MEDIUM WAIST-UP GROUP PORTRAIT. The camera is positioned at eye level, framed strictly from the waistband up to the top of their heads. Focus strictly on their upper-body attire, tailored jackets, statement collars, and hair styling. NO LEGS OR SHOES VISIBLE, DO NOT SHOW LOWER BODY.'
    },
    {
      id: 'full_body_lookbook',
      label: '👠 Full-Body Runway Lookbook',
      description: 'Head-to-toe high-fashion editorial showcase with full outfits, footwear, and posture.',
      aspectRatio: '16:9' as const,
      promptText: 'FRAMING CONSTRAINT: FULL-BODY EDITORIAL LOOKBOOK SHOT. Full head-to-toe composition showcasing complete coordinated outfits, tailored trousers/skirts, designer footwear, and statuesque editorial postures.'
    },
    {
      id: 'dynamic_wide_cinematic',
      label: '🎬 Cinematic Wide Environmental Stagger',
      description: 'Cinematic wide landscape staging with deep architectural perspective.',
      aspectRatio: '16:9' as const,
      promptText: 'FRAMING CONSTRAINT: WIDE-ANGLE CINEMATIC EDITORIAL SPREAD. Atmospheric environmental landscape framing with expansive architectural set design and deep lighting.'
    }
  ];

  const LOOKBOOK_POSE_OPTIONS = [
    {
      id: 'v_wedge',
      label: '🔺 Center-Apex V-Formation (Delta Wedge)',
      description: 'Center visual/leader forward at apex, members standing tiered backward symmetrically (BTS, TWICE, SEVENTEEN style).',
      promptText: 'Posing & Formation (Professional Standing Photography - Strict No-Leaning Rule): Center-Apex V-Formation (Delta Wedge). The center visual is positioned slightly forward in the foreground apex, with remaining members standing tiered symmetrically backward on diagonal sightlines to create dynamic photographic depth and majestic unit cohesion. ALL members are standing upright on the studio floor with ZERO chairs, stools, or sitting props, and ZERO resting heads on shoulders.'
    },
    {
      id: 'diamond_stagger',
      label: '💎 Frontline & Flank Diamond Stagger (All Standing)',
      description: 'Frontline idols standing half a pace forward with flanking members stepped slightly back in clean depth (EXO, aespa, IVE style).',
      promptText: 'Posing & Formation (Professional Standing Photography - Strict No-Leaning Rule): Frontline & Flank Diamond Stagger. Professional standing photography formation where frontline idols stand half a step forward and flanking idols stand stepped slightly back on clean diagonal sightlines. ALL members are standing upright on the studio floor in sharp photographic depth of field with ZERO chairs, stools, or sitting blocks.'
    },
    {
      id: 'asymmetric_stagger',
      label: '⚡ Dynamic Asymmetrical Standing Stagger (High-Low Depth)',
      description: 'Organic staggered depths, contrapposto weight shifts, varied angles — all standing (NewJeans, LE SSERAFIM style).',
      promptText: 'Posing & Formation (Professional Standing Photography - Strict No-Leaning Rule): Dynamic Asymmetrical Editorial Standing Stagger. Members are arranged standing at varied organic depths of field and asymmetrical spatial intervals across the frame. Each idol adopts a distinct contrapposto weight-shifted standing stance, varied head angle, and independent silhouette. ALL members stand upright on the floor.'
    },
    {
      id: 'intimate_cluster',
      label: '✨ Multi-Layered Intimate Cluster (All Standing, Zero Leaning)',
      description: 'Layered front-to-back depth, asymmetric head tilts, magnetic idol gaze without leaning or sitting.',
      promptText: 'Posing & Formation (Professional Standing Photography - Strict No-Leaning Rule): Dynamic multi-layered intimate editorial cluster where members stand positioned at staggered depth planes. Every member holds a unique individual standing model posture and head angle with magnetic camera gaze. ALL members are standing on the studio floor. ABSOLUTELY NO sitting, NO resting heads on shoulders, NO hands draped on adjacent members, NO identical or repetitive leaning poses.'
    },
    {
      id: 'architectural_sculptural',
      label: '🏛️ Architectural S-Curve & Runway Stagger (Standing)',
      description: 'High-fashion editorial angles, sharp geometric lines, and asymmetric spacing (BLACKPINK, NCT style).',
      promptText: 'Posing & Formation (Professional Standing Photography - Strict No-Leaning Rule): Avant-garde architectural S-curve and runway standing stagger featuring high-contrast geometric silhouettes, asymmetrical shoulder angles, crisp posture lines, and high-fashion editorial tension with all members standing on the studio floor.'
    },
    {
      id: 'orbit_circle',
      label: '🔄 Dynamic Semi-Circle Orbit Formation (Standing Arc)',
      description: 'Engaging semi-circular standing arc formation with dynamic perspective (BOYNEXTDOOR, RIIZE style).',
      promptText: 'Posing & Formation (Professional Standing Photography - Strict No-Leaning Rule): Dynamic Semi-Circle Orbit Formation. Members positioned standing in an engaging curved semi-circular arc, interacting subtly with the camera angle with spontaneous, youth-driven star presence. ALL members standing on the floor.'
    },
    {
      id: 'power_stride',
      label: '🚶 Runway Power Stride / Linear Power Walk',
      description: 'Captured mid-stride walking forward across a wide line with dynamic energy.',
      promptText: 'Posing & Formation: Linear Power Walk Runway Stride. Members captured mid-stride walking confidently forward across a wide horizontal line, exuding effortless swagger, natural wind movement in hair and fabric, and commanding runway aura.'
    }
  ];

  const LOOKBOOK_EXPRESSION_OPTIONS = [
    {
      id: 'radiant_smile',
      label: '🌟 Radiant Warm Smiles (Joyful & Friendly)',
      description: 'Bright, genuine, radiant smiles with joyful eye contact. Strictly NO unhappy or sullen faces.',
      promptText: 'EXPRESSION DIRECTIVE (WARM RADIANT SMILES - ABSOLUTELY NO UNHAPPY FACES): Every idol displays a genuine, radiant, warm smile with cheerful, sparkling eyes and joyful approachable star energy. Lips are naturally smiling, conveying genuine happiness, charm, and youthful vibrance. ABSOLUTELY NO sullen, unhappy, gloomy, frowning, angry, or bored expressions under any circumstance.'
    },
    {
      id: 'magnetic_smize',
      label: '✨ Confident Magnetic Smize (Chic Cool)',
      description: 'Subtle pleasant smirk, captivating smiling eyes, relaxed confident lips. Strictly NO unhappy faces.',
      promptText: 'EXPRESSION DIRECTIVE (CONFIDENT MAGNETIC SMIZE - ABSOLUTELY NO UNHAPPY FACES): Idols showcase effortless star swagger with subtle pleasant smirks, smiling eyes ("smize"), relaxed confident lips, and magnetic, captivating camera engagement. The vibe is cool, charming, and magnetic. ABSOLUTELY NO sullen, gloomy, frowning, or bored expressions.'
    },
    {
      id: 'playful_charm',
      label: '😜 Playful & Mischievous Charm (Lively)',
      description: 'Cheeky smiles, youthful energetic charisma, lively idol expressions. Strictly NO unhappy faces.',
      promptText: 'EXPRESSION DIRECTIVE (PLAYFUL & MISCHIEVOUS CHARM - ABSOLUTELY NO UNHAPPY FACES): High-spirited, playful idol charm featuring subtle cheeky smiles, occasional lighthearted winks, relaxed playful expressions, and vibrant youthful charisma. Dynamic, fun, and lively. ABSOLUTELY NO sad, gloomy, or sullen faces.'
    },
    {
      id: 'ethereal_serenity',
      label: '🌸 Ethereal Gentle Serenity (Dreamy Nostalgia)',
      description: 'Soft relaxed lips, peaceful gentle aura, dreamy tender warmth. Strictly NO unhappy faces.',
      promptText: 'EXPRESSION DIRECTIVE (ETHEREAL GENTLE SERENITY - ABSOLUTELY NO UNHAPPY FACES): Soft, serene, and poetic expressions with relaxed tender lips, dreamy gentle gaze, and a warm, peaceful aura. Emotional, nostalgic, and enchanting. ABSOLUTELY NO frowns, distress, or unhappy/depressed looks.'
    },
    {
      id: 'fierce_charisma',
      label: '🔥 Powerful Fierce Charisma (Empowered & Sharp)',
      description: 'Commanding gaze, strong jawlines, empowered stage energy — strictly NOT sullen or sad.',
      promptText: 'EXPRESSION DIRECTIVE (POWERFUL FIERCE CHARISMA - EMPOWERED & PROUD): Commanding, intense, and empowering high-fashion runway gaze with proud chin angles and magnetic stage fire. Every idol looks confident, passionate, and triumphant. ABSOLUTELY NO sullen, depressed, bored, or miserable expressions.'
    }
  ];

  const LOOKBOOK_TYPOGRAPHY_OPTIONS = [
    {
      id: 'official_colors_neon_chrome',
      label: '🌈 3D Embossed Neon Chrome in Official Group Colors',
      description: 'Sculpted 3D logo rendered in the group\'s exact official color palette with soft studio glow.',
      promptText: 'Typography & Wall Branding: Prominently featured on the upper backdrop wall is a customized 3D embossed typography logo of the group name "[GROUP_NAME]" rendered in their official group color palette [OFFICIAL_COLORS], glowing softly with high-end architectural studio backlighting.'
    },
    {
      id: 'haute_couture_serif',
      label: '🖋️ Haute Couture Editorial Serif Watermark',
      description: 'Sleek luxury magazine serif typography with fine kerning.',
      promptText: 'Typography & Editorial Branding: Elegant luxury editorial serif title of "[GROUP_NAME]" styled like a high-end Vogue Korea magazine header at the top of the frame in official brand color [OFFICIAL_COLORS].'
    },
    {
      id: 'cyber_glassmorphism',
      label: '💎 Translucent Cyber Glassmorphism & Holographic Edge',
      description: 'Modern glassmorphic lettering with frosted texture and subtle prismatic dispersion.',
      promptText: 'Typography & Branding: Ultra-modern floating frosted glassmorphism typography of "[GROUP_NAME]" with prismatic edge reflections echoing their official colors [OFFICIAL_COLORS].'
    },
    {
      id: 'avant_garde_bold',
      label: '⚡ Avant-Garde High-Impact Graphic Display',
      description: 'Bold Swiss-style graphic design typography integrated into the studio set.',
      promptText: 'Typography & Branding: Striking high-impact avant-garde graphic layout of the group name "[GROUP_NAME]" designed with oversized modernist letterforms in official colors [OFFICIAL_COLORS].'
    }
  ];

  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [isGeneratingConceptPhoto, setIsGeneratingConceptPhoto] = useState<boolean>(false);
  const [conceptPhotoError, setConceptPhotoError] = useState<string | null>(null);

  const [editedConcepts, setEditedConcepts] = useState<VisualConcept[]>(() => {
    return groupProfile.visualConcepts && groupProfile.visualConcepts.length > 0 
      ? JSON.parse(JSON.stringify(groupProfile.visualConcepts))
      : [
          { 
            versionName: "Version A: Twilight", 
            aestheticStyling: "Casual elegant streetwear, structured leather blazers, and distressed denim pieces.", 
            makeupHairInfo: "Wet look messy hair with clean bare skin and zero cosmetics.",
            framingType: "upper_body_close_up",
            poseStyle: "intimate_cluster",
            typographyStyle: "official_colors_neon_chrome",
            aspectRatio: "16:9"
          },
          { 
            versionName: "Version B: Bloom", 
            aestheticStyling: "Ethereal pastel knitwear, soft oversized structures, and layered organza trims.", 
            makeupHairInfo: "Dreamy hairstyle, soft natural bangs, completely bare natural face.",
            framingType: "upper_body_close_up",
            poseStyle: "intimate_cluster",
            typographyStyle: "official_colors_neon_chrome",
            aspectRatio: "16:9"
          }
        ];
  });

  const currentConcept = editedConcepts[activePhotoIdx] || editedConcepts[0];

  const handleUpdateConceptItem = (idx: number, field: keyof VisualConcept, val: string) => {
    const updated = [...editedConcepts];
    updated[idx] = { ...updated[idx], [field]: val };
    setEditedConcepts(updated);
  };

  const handleAddNewConcept = () => {
    const newIdx = editedConcepts.length + 1;
    const newConcept: VisualConcept = {
      versionName: `Version ${String.fromCharCode(64 + newIdx)}: Concept`,
      aestheticStyling: "High-fashion tailored monochromatic stage outfits with custom hardware accents.",
      makeupHairInfo: "Textured editorial hair styling with natural glowing bare skin.",
      framingType: "upper_body_close_up",
      poseStyle: "intimate_cluster",
      typographyStyle: "official_colors_neon_chrome",
      aspectRatio: "16:9"
    };
    const updated = [...editedConcepts, newConcept];
    setEditedConcepts(updated);
    setActivePhotoIdx(updated.length - 1);
  };

  const handleDeleteConcept = (idx: number) => {
    if (editedConcepts.length <= 1) return;
    const updated = editedConcepts.filter((_, i) => i !== idx);
    setEditedConcepts(updated);
    setActivePhotoIdx(Math.max(0, idx - 1));
  };

  const handleSaveConceptStrategy = () => {
    if (!onUpdateProfile) return;
    onUpdateProfile({
      visualConcepts: editedConcepts
    });
    setSuccess("Editorial visual concepts and photobook layout briefs saved permanently!");
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleSetAsGroupDebutPhoto = (imgUrl: string) => {
    if (!onUpdateProfile) return;
    onUpdateProfile({
      groupPhotoUrl: imgUrl
    });
    setSuccess(`Successfully set as official Group Debut Photo reference!`);
    setTimeout(() => setSuccess(null), 3000);
  };

  const compiledConceptPrompt = useMemo(() => {
    if (!currentConcept) return '';
    const officialColorsStr = colors.map(c => `"${c.name}" (${c.hex})`).join(', ');
    
    const framing = LOOKBOOK_FRAMING_OPTIONS.find(f => f.id === (currentConcept.framingType || 'upper_body_close_up')) || LOOKBOOK_FRAMING_OPTIONS[0];
    const pose = LOOKBOOK_POSE_OPTIONS.find(p => p.id === (currentConcept.poseStyle || 'intimate_cluster')) || LOOKBOOK_POSE_OPTIONS[0];
    const expression = LOOKBOOK_EXPRESSION_OPTIONS.find(e => e.id === (currentConcept.expressionMood || 'radiant_smile')) || LOOKBOOK_EXPRESSION_OPTIONS[0];
    const typo = LOOKBOOK_TYPOGRAPHY_OPTIONS.find(t => t.id === (currentConcept.typographyStyle || 'official_colors_neon_chrome')) || LOOKBOOK_TYPOGRAPHY_OPTIONS[0];
    
    const typoPrompt = typo.promptText
      .replace(/\[GROUP_NAME\]/g, groupProfile.groupName)
      .replace(/\[OFFICIAL_COLORS\]/g, officialColorsStr);

    return `A hyper-realistic 8k high-fashion editorial magazine lookbook photoshoot for K-pop group "${groupProfile.groupName}".
Concept Version: "${currentConcept.versionName}".
${framing.promptText}
Fashion & Wardrobe Styling: ${currentConcept.aestheticStyling}. Unified high-fashion color harmony anchored in ${officialColorsStr}.
Hair & Grooming: ${currentConcept.makeupHairInfo}. Completely bare-faced natural glowing skin, zero heavy makeup, authentic skin pore textures.
${pose.promptText}
${expression.promptText}
${typoPrompt}
Set & Atmosphere: Avant-garde minimalist high-fashion studio setting with directional softbox lighting, shallow cinematic depth of field, 8k crisp details, and top-tier K-pop idol charisma.`;
  }, [currentConcept, colors, groupProfile.groupName]);

  const handleGenerateEditorialSpread = async () => {
    if (!onUpdateProfile || !currentConcept) return;
    setIsGeneratingConceptPhoto(true);
    setConceptPhotoError(null);
    try {
      const refImages: any[] = [];
      if (groupProfile.groupPhotoUrl) {
        refImages.push({ label: `${groupProfile.groupName} Group Photo Reference`, dataUrl: groupProfile.groupPhotoUrl });
      } else if (groupProfile.members) {
        groupProfile.members.slice(0, 3).forEach(m => {
          if (m.imageUrl) {
            refImages.push({ label: `${m.stageName} Official Idol Reference`, dataUrl: m.imageUrl });
          }
        });
      }
      if (groupProfile.logoUrl) {
        refImages.push({ label: `${groupProfile.groupName} Official Logo Emblem`, dataUrl: groupProfile.logoUrl });
      }

      const framing = LOOKBOOK_FRAMING_OPTIONS.find(f => f.id === (currentConcept.framingType || 'upper_body_close_up')) || LOOKBOOK_FRAMING_OPTIONS[0];
      const targetAspectRatio = (currentConcept.aspectRatio as any) || framing.aspectRatio || "16:9";

      const imgUrl = await generateImage(compiledConceptPrompt, targetAspectRatio, refImages.length > 0 ? refImages : undefined);

      const updated = [...editedConcepts];
      updated[activePhotoIdx] = {
        ...currentConcept,
        imageUrl: imgUrl,
        imagePrompt: compiledConceptPrompt
      };
      setEditedConcepts(updated);

      onUpdateProfile({
        visualConcepts: updated
      });

      setSuccess(`Editorial photoshoot for "${currentConcept.versionName}" successfully captured and saved!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error(err);
      setConceptPhotoError(err instanceof Error ? err.message : "Failed to shoot editorial lookbook. Please try again.");
    } finally {
      setIsGeneratingConceptPhoto(false);
    }
  };

  // ---------------------------------------------------------------------------
  // TAB 5: MERCH DESIGN LAB states & Real AI Merch Generation
  // ---------------------------------------------------------------------------
  const [merchBaseType, setMerchBaseType] = useState<string>('Premium Over-Sized Hoodie');
  const [merchDyeColor, setMerchDyeColor] = useState<string>(colors[0]?.name || 'Jade');
  const [merchGraphicPlacement, setMerchGraphicPlacement] = useState<string>('Minimalist Left Chest logo with back artwork');
  const [merchMannequinStyle, setMerchMannequinStyle] = useState<'dual' | 'female' | 'male'>('dual');
  const [isGeneratingMerch, setIsGeneratingMerch] = useState<boolean>(false);
  const [merchGenError, setMerchGenError] = useState<string | null>(null);
  const [generatedMerchImage, setGeneratedMerchImage] = useState<string | null>(null);
  const [isGeneratingQuickMascot, setIsGeneratingQuickMascot] = useState(false);

  const fandomName = groupProfile.fandom?.name || 'Fans';
  const estimatedDrives = useMemo(() => {
    const baseDemand = groupProfile.groupType === 'Soloist' ? 1200 : 2800;
    const modifier = groupProfile.simulationMetrics?.targetDemographicReach === 'GLOBAL' ? 2.5 : 1.2;
    const productionCost = merchBaseType.includes('Hoodie') ? 24 : (merchBaseType.includes('Tote') ? 6 : (merchBaseType.includes('Vinyl') ? 18 : (merchBaseType.includes('Bomber') ? 35 : 8)));
    const retailPrice = merchBaseType.includes('Hoodie') ? 68 : (merchBaseType.includes('Tote') ? 22 : (merchBaseType.includes('Vinyl') ? 48 : (merchBaseType.includes('Bomber') ? 95 : 18)));
    
    const preOrderDemand = Math.floor(baseDemand * modifier);
    const netRevenue = preOrderDemand * (retailPrice - productionCost);

    return {
      cost: productionCost,
      retail: retailPrice,
      demand: preOrderDemand,
      net: netRevenue
    };
  }, [merchBaseType, groupProfile.groupType, groupProfile.simulationMetrics]);

  const handleGenerateQuickMascot = async () => {
    if (!onUpdateProfile) return;
    setIsGeneratingQuickMascot(true);
    setMerchGenError(null);
    try {
      const mascotName = groupProfile.fandom?.mascotName || `${groupProfile.groupName} Mascot`;
      const mascotDesc = groupProfile.fandom?.mascotDescription || `An iconic, adorable cute character representing ${groupProfile.groupName} and fandom ${fandomName}.`;
      const prompt = `Official cute K-pop mascot character design for the group "${groupProfile.groupName}".
Mascot Name: ${mascotName}.
Character Lore: ${mascotDesc}.
Art Style: 3D vinyl collectible toy figure aesthetic (like Pop Mart / LINE FRIENDS / Sanrio), clean smooth materials, vibrant colors matching group palette, studio product lighting on seamless pure white background.`;
      const img = await generateImage(prompt, "1:1");
      const updatedFandom = {
        ...(groupProfile.fandom || { name: 'Fans', nameOrigin: '', lightstickDescription: '', fandomPersonality: '', fandomMotto: '', handGesturePrompt: '' }),
        mascotUrl: img,
        mascotName: mascotName
      };
      onUpdateProfile({ fandom: updatedFandom });
      setSuccess("Official group mascot generated successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setMerchGenError(err instanceof Error ? err.message : "Failed to generate mascot.");
    } finally {
      setIsGeneratingQuickMascot(false);
    }
  };

  const compiledMerchPrompt = useMemo(() => {
    const isWearable = /hoodie|tee|jacket|bomber|jersey|cardigan|sweatshirt|beanie|cap|beret|wearable/i.test(merchBaseType);
    const isHeadwear = /beanie|cap|beret|hat/i.test(merchBaseType);

    let presentationDirective = '';
    if (isHeadwear) {
      presentationDirective = `Product Presentation: Displayed resting elegantly on a sculpted minimalist matte white head and bust mannequin dummy form in a seamless solid pure white studio.`;
    } else if (isWearable) {
      if (merchMannequinStyle === 'female') {
        presentationDirective = `Product Presentation: Dressed elegantly on a sleek tailored female dress form mannequin dummy in a seamless solid pure white studio, showing authentic garment drape, stitch details, and chest embroidery.`;
      } else if (merchMannequinStyle === 'male') {
        presentationDirective = `Product Presentation: Dressed sharply on a sleek tailored male mannequin torso dummy in a seamless solid pure white studio, showing authentic garment drape, stitch details, and chest embroidery.`;
      } else {
        presentationDirective = `Product Presentation: Inclusive dual mannequin display featuring a pair of tailored male and female mannequin dummies standing side-by-side in a seamless solid pure white studio, modeling how the apparel looks on both silhouettes with realistic fabric texture, natural drape, and crisp branding prints.`;
      }
    } else {
      presentationDirective = `Product Presentation: Neatly displayed elevated on a sleek minimalist matte white presentation table / white acrylic display riser in a seamless solid pure white studio background with soft commercial studio lighting and delicate contact reflections, making it look ultra-presentable, premium, and retail catalog-ready.`;
    }

    return `An ultra-clean commercial studio product mockup photograph of official K-pop merchandise for group "${groupProfile.groupName}".
Item Type: ${merchBaseType}.
Colorway & Fabric: Dyed in high-end "${merchDyeColor}" premium material.
Graphic Design & Branding: ${merchGraphicPlacement}, incorporating the official group logo design (from the official lightstick packaging box) and the official group mascot theme ("${groupProfile.fandom?.mascotName || 'Official Mascot'}").
${presentationDirective}
Environment & Studio Background: Seamless solid pure white minimalist studio photography infinity background (solid pure white background) with clean commercial studio lighting, soft subtle ground shadows, and zero cluttered background elements. 8k commercial catalogue quality.`;
  }, [merchBaseType, merchDyeColor, merchGraphicPlacement, merchMannequinStyle, groupProfile.groupName, groupProfile.fandom]);

  const handleGenerateMerchMockup = async () => {
    const lightstickImg = groupProfile.fandom?.lightstickUrl;
    const mascotImg = groupProfile.fandom?.mascotUrl;

    // Prerequisite Gate: Must wait until lightstick and mascot are generated
    if (!lightstickImg || !mascotImg) {
      const missing = [];
      if (!lightstickImg) missing.push("Official Lightstick (with logo/box packaging)");
      if (!mascotImg) missing.push("Official Group Mascot Character");
      setMerchGenError(`🔒 Merch Studio Locked: Please generate the ${missing.join(" and ")} first! The studio requires these visual references to design authentic branded goods.`);
      return;
    }

    setIsGeneratingMerch(true);
    setMerchGenError(null);
    try {
      const refImages: any[] = [];
      if (lightstickImg) {
        refImages.push({ label: `${groupProfile.groupName} Official Lightstick & Box Packaging Design`, dataUrl: lightstickImg });
      }
      if (mascotImg) {
        refImages.push({ label: `${groupProfile.groupName} Official Mascot Character Art`, dataUrl: mascotImg });
      }
      if (groupProfile.logoUrl) {
        refImages.push({ label: `${groupProfile.groupName} Official Logo Emblem`, dataUrl: groupProfile.logoUrl });
      }
      if (groupProfile.groupPhotoUrl) {
        refImages.push({ label: `${groupProfile.groupName} Group Photo Reference`, dataUrl: groupProfile.groupPhotoUrl });
      }

      const imgUrl = await generateImage(compiledMerchPrompt, "1:1", refImages.length > 0 ? refImages : undefined);
      setGeneratedMerchImage(imgUrl);
      setSuccess(`Official product mockup for "${merchBaseType}" generated!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error(err);
      setMerchGenError(err instanceof Error ? err.message : "Failed to generate merchandise mockup. Please try again.");
    } finally {
      setIsGeneratingMerch(false);
    }
  };

  const handleAddMerchToStore = () => {
    if (!onUpdateProfile) return;
    const newItem: MerchItem = {
      id: `merch_${Date.now()}`,
      name: `${groupProfile.groupName} Official ${merchBaseType}`,
      category: merchBaseType.includes('Hoodie') || merchBaseType.includes('Tee') || merchBaseType.includes('Bomber') ? 'Apparel' : (merchBaseType.includes('Vinyl') ? 'Media' : 'Collectibles'),
      priceUSD: estimatedDrives.retail,
      priceKRW: estimatedDrives.retail * 1350,
      description: `Official boutique merchandise dyed in ${merchDyeColor} featuring ${merchGraphicPlacement}.`,
      imageUrl: generatedMerchImage || undefined,
      isOfficial: true,
      tag: 'Studio Edition'
    };

    const existingItems = groupProfile.fandom?.merchItems || [];
    const updatedFandom = {
      ...(groupProfile.fandom || { name: 'Fans', nameOrigin: '', lightstickDescription: '', fandomPersonality: '', fandomMotto: '', handGesturePrompt: '' }),
      merchItems: [newItem, ...existingItems]
    };

    onUpdateProfile({
      fandom: updatedFandom
    });

    setSuccess(`Added "${newItem.name}" to the official Fandom & Merch catalogue!`);
    setTimeout(() => setSuccess(null), 3000);
  };

  // Utility copy functions
  const handleCopyText = (txt: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      
      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-neutral-950/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-200"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
            <img 
              src={lightboxImage} 
              alt="Full view artwork" 
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/20"
            />
            <button 
              onClick={() => setLightboxImage(null)}
              className="mt-3 bg-white/20 hover:bg-white/30 text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-sm transition-all flex items-center gap-1.5"
            >
              <X className="w-4 h-4" /> Close Artwork
            </button>
          </div>
        </div>
      )}

      {/* Alert feeds */}
      {success && (
        <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100 text-[10px] font-black uppercase tracking-widest text-center shadow-sm animate-in fade-in duration-200">
          ✓ {success}
        </div>
      )}
      {error && (
        <div className="p-3 bg-rose-50 text-rose-800 rounded-xl border border-rose-100 text-[10px] font-black uppercase tracking-widest text-center shadow-sm">
          ✕ {error}
        </div>
      )}

      {/* Top Selector Panel */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm shrink-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h2 className="text-sm font-black text-neutral-900 uppercase tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Creative Studio & AI Rendering Lab
            </h2>
            <p className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider">
              Compile portraits, generate 8K album covers, design 3D lightsticks, render lookbooks, and produce merchandise
            </p>
          </div>
          
          <nav className="flex flex-wrap gap-1 bg-neutral-100 p-1 rounded-xl border border-neutral-200/60">
            {([
              { id: 'members', label: isSolo ? 'Soloist Portrait' : 'Casting Portraits' },
              { id: 'albums', label: 'Album Artwork' },
              { id: 'branding', label: 'Lightstick & Branding' },
              { id: 'concept', label: 'Magazine Editorial' },
              { id: 'merch', label: 'Merchandise Lab' }
            ] as const).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveStudioTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                  activeStudioTab === tab.id
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/80'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Studio Workbench Area */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-neutral-200 shadow-sm min-h-[450px]">
        
        {/* ===================================================================
            TAB 1: CASTING PORTRAIT DESIGN WORKBENCH
            =================================================================== */}
        {activeStudioTab === 'members' && (
          <div className="space-y-5">
            {groupProfile.members && groupProfile.members.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Visual Customizers Sidebar (4 cols) */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="space-y-3">
                    <span className="text-[7px] font-black text-amber-700 tracking-[0.15em] uppercase block">PORTRAIT DESIGN MODIFIERS</span>
                    
                    {/* Member dropdown */}
                    <div className="flex flex-col">
                      <label className="text-[7px] font-black text-neutral-400 uppercase mb-1">Target Talent Profile</label>
                      <select 
                        value={selectedMemberIdx}
                        onChange={(e) => {
                          setSelectedMemberIdx(Number(e.target.value));
                          setPortraitReady(false);
                        }}
                        className="border border-neutral-200 p-2 rounded-xl font-bold text-neutral-800 text-[10px] focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                      >
                        {groupProfile.members.map((m, idx) => (
                          <option key={idx} value={idx}>{m.stageName} ({m.fullNameRomanized})</option>
                        ))}
                      </select>
                    </div>

                    {/* Framing drop */}
                    <div className="flex flex-col">
                      <label className="text-[7px] font-black text-neutral-400 uppercase mb-1">A&R Camera Shot Framing</label>
                      <select 
                        value={portraitFraming}
                        onChange={(e) => { setPortraitFraming(e.target.value); setPortraitReady(false); }}
                        className="border border-neutral-200 p-2 rounded-xl font-bold text-neutral-800 text-[10px] focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                      >
                        <option value="Front-facing waist-up upper body portrait (strictly from waist up)">Waist-Up Upper Body Portrait</option>
                        <option value="Full-body standing head-to-toe shot showing complete outfit, trousers, and amazing coordinated shoes">Full-Body Standing Head-to-Toe Shot (with Coordinated Shoes)</option>
                        <option value="Close-up Beauty Portrait focusing on facial charisma">Close-Up Beauty Portrait</option>
                        <option value="High-Fashion Editorial Full Upper Torso Shot">Editorial Upper Torso Shot</option>
                        <option value="Candid Polarized Style Film Portrait">Candid Polarized Film Style</option>
                      </select>
                    </div>

                    {/* Aesthetic Theme */}
                    <div className="flex flex-col">
                      <label className="text-[7px] font-black text-neutral-400 uppercase mb-1">Portrait Everyday Fashion Aesthetic</label>
                      <select 
                        value={portraitAesthetic}
                        onChange={(e) => { setPortraitAesthetic(e.target.value); setPortraitReady(false); }}
                        className="border border-neutral-200 p-2 rounded-xl font-bold text-neutral-800 text-[10px] focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                      >
                        <option value="Airport Casual & Tailored Blazer">Airport Casual & Tailored Blazer</option>
                        <option value="Dance Practice Streetwear & Hoodie">Dance Practice Streetwear & Hoodie</option>
                        <option value="Cozy Soft Knitwear & Mohair">Cozy Soft Knitwear & Mohair</option>
                        <option value="Y2K Retro Casual & Baby Tee / Raglan">Y2K Retro Casual & Baby Tee / Raglan</option>
                        <option value="Minimalist Old-Money Clean Aesthetic">Minimalist Old-Money Clean Aesthetic</option>
                        <option value="Preppy Ivy Academia & Argyle / Varsity">Preppy Ivy Academia & Argyle / Varsity</option>
                        <option value="Vintage Distressed Denim & Leather Jacket">Vintage Distressed Denim & Leather Jacket</option>
                        <option value="Sporty Athleisure & Track Jacket">Sporty Athleisure & Track Jacket</option>
                        <option value="High-Fashion Runway Casual & Draped Vest">High-Fashion Runway Casual & Draped Vest</option>
                        <option value="Soft Aesthetic & Pastel Linen / Organza">Soft Aesthetic & Pastel Linen / Organza</option>
                      </select>
                    </div>

                    {/* Hair color styling */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[7px] font-black text-neutral-400 uppercase">Choreographed Hairstyle & Dye Color</label>
                      <select 
                        value={selectedHairPreset}
                        onChange={(e) => handleHairPresetChange(e.target.value)}
                        className="border border-neutral-200 p-2 rounded-xl font-bold text-neutral-800 text-[10px] focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                      >
                        {hairPresets.map((preset) => (
                          <option key={preset.value} value={preset.value}>{preset.label}</option>
                        ))}
                      </select>
                      
                      {selectedHairPreset === 'custom' && (
                        <div className="mt-1 flex flex-col gap-1 animate-in fade-in duration-200">
                          <label className="text-[6.5px] font-black text-amber-700 uppercase">Specify custom style & dye technique</label>
                          <input 
                            type="text"
                            placeholder="e.g. split dye half-pink half-black, peek-a-boo highlights, layered wolf-cut"
                            value={customHairText}
                            onChange={(e) => handleCustomHairTextChange(e.target.value)}
                            className="border border-neutral-200 p-2 rounded-xl font-bold text-neutral-800 text-[10px] focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                          />
                        </div>
                      )}

                      <div className="text-[8px] bg-neutral-50 border border-neutral-100 p-2 rounded-lg text-neutral-600 font-medium">
                        <span className="font-bold text-neutral-700">Prompt Active: </span>
                        {portraitHair}
                      </div>
                    </div>

                    {/* Expression */}
                    <div className="flex flex-col">
                      <label className="text-[7px] font-black text-neutral-400 uppercase mb-1">Casting Pose & Expression</label>
                      <select 
                        value={portraitExpression}
                        onChange={(e) => { setPortraitExpression(e.target.value); setPortraitReady(false); }}
                        className="border border-neutral-200 p-2 rounded-xl font-bold text-neutral-800 text-[10px] focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                      >
                        <option value="Confident Intense Smize">Confident Intense Smize</option>
                        <option value="Soft Dreamy Gaze">Soft Dreamy Gaze</option>
                        <option value="Gentle Charismatic Smile">Gentle Charismatic Smile</option>
                        <option value="Stoic High-Contrast Editorial glare">Stoic High-Contrast Editorial glare</option>
                        <option value="Playful Charming Wink">Playful Charming Wink</option>
                      </select>
                    </div>

                    {/* Background */}
                    <div className="flex flex-col">
                      <label className="text-[7px] font-black text-neutral-400 uppercase mb-1">Mise-En-Scene Background</label>
                      <select 
                        value={portraitBackground}
                        onChange={(e) => { setPortraitBackground(e.target.value); setPortraitReady(false); }}
                        className="border border-neutral-200 p-2 rounded-xl font-bold text-neutral-800 text-[10px] focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                      >
                        <option value="Solid plain light grey studio background with hex code #D1D5DB">Solid Plain Studio Grey (#D1D5DB)</option>
                        <option value="Plain White professional clean studio backdrop">Clean Studio White</option>
                        <option value="Neon Seoul retro convenience storefront with bokeh glow">Neon Seoul Night Bokeh</option>
                        <option value="Cozy greenhouse filled with misty glass panes and lush greenery">Misty Greenhouse</option>
                        <option value="Deep Cosmic Indigo gradient overlay studio backdrop">Deep Cosmic Indigo Gradient</option>
                      </select>
                    </div>

                    {/* Custom prompt text guidelines */}
                    <div className="flex flex-col pt-1">
                      <label className="text-[7px] font-black text-neutral-400 uppercase mb-1">Custom Styling Guidelines (Optional)</label>
                      <input 
                        type="text"
                        placeholder="e.g. silver rings, chunky headphones, leather choker..."
                        value={customPromptGuideline}
                        onChange={(e) => { setCustomPromptGuideline(e.target.value); setPortraitReady(false); }}
                        className="border border-neutral-200 p-2 rounded-xl font-bold text-neutral-800 text-[10px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Main Render Output (8 cols) */}
                <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
                  
                  {/* Portrait Card Output Box */}
                  <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 flex flex-col md:flex-row gap-5 items-center justify-center min-h-[320px]">
                    {currentMember && (
                      <>
                        {/* Interactive Photocard Display */}
                        <div 
                          className="relative w-56 h-80 rounded-2xl overflow-hidden shrink-0 shadow-2xl border border-white/20 select-none group cursor-pointer"
                          onClick={() => currentMember.imageUrl && setLightboxImage(currentMember.imageUrl)}
                        >
                          {/* Holographic shifting sheen overlay */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none z-20 group-hover:via-white/25 transition-all"></div>
                          
                          {currentMember.imageUrl ? (
                            <>
                              <img 
                                src={currentMember.imageUrl} 
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 scale-105 group-hover:scale-110"
                                alt={currentMember.stageName}
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute top-2 right-2 z-30 bg-black/40 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                <Maximize2 className="w-3.5 h-3.5" />
                              </div>
                            </>
                          ) : (
                            <div 
                              className="absolute inset-0 transition-transform duration-700 scale-105 group-hover:scale-110 flex items-center justify-center"
                              style={{
                                background: portraitReady 
                                  ? `linear-gradient(135deg, ${colors[0]?.hex || '#d97706'}33, ${currentMember.skinTone === 'fair' ? '#fee2e2' : '#fef3c7'}ff, ${colors[1]?.hex || '#d97706'}33)`
                                  : '#17171b'
                              }}
                            >
                              {portraitReady ? (
                                <div className="text-center p-4 text-neutral-800 space-y-2 relative z-10">
                                  <div className="w-16 h-16 shrink-0 rounded-full mx-auto bg-neutral-900 border-2 border-white flex items-center justify-center text-white scale-110 shadow-lg relative overflow-hidden">
                                    <span className="text-2xl">{currentMember.representativeEmoji || '⭐'}</span>
                                  </div>
                                  
                                  <div className="space-y-0.5">
                                    <h4 className="text-sm font-black uppercase text-neutral-900 tracking-tight leading-none">
                                      {currentMember.stageName}
                                    </h4>
                                    <p className="text-[7px] text-neutral-400 font-extrabold uppercase tracking-widest">{currentMember.fullNameRomanized}</p>
                                  </div>

                                  <div className="pt-2 border-y border-neutral-300/40 grid grid-cols-2 gap-x-2 gap-y-1 text-[8px] font-black text-neutral-500 uppercase tracking-tight text-left">
                                    <span>MBTI: <b className="text-amber-700 font-extrabold">{currentMember.mbti}</b></span>
                                    <span>BLOOD: <b className="text-amber-700 font-extrabold">{currentMember.bloodType}</b></span>
                                    <span className="col-span-2 truncate">POS: <b className="text-amber-700 font-extrabold">{currentMember.positions?.[0]}</b></span>
                                  </div>

                                  <p className="text-[6px] text-neutral-400 leading-normal font-extrabold max-w-[160px] truncate uppercase">
                                     STYLE: {portraitAesthetic}
                                  </p>
                                </div>
                              ) : (
                                <div className="text-center p-4 text-neutral-400">
                                  <Camera className="w-8 h-8 text-neutral-500 mx-auto animate-pulse mb-2" />
                                  <h5 className="text-[9px] font-black uppercase tracking-widest">A&R Portrait Lab</h5>
                                  <p className="text-[7px] mt-0.5">Click "Apply & Generate Portrait" to shoot</p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Collectible Border overlay */}
                          <div className="absolute inset-1.5 border border-white/20 rounded-xl pointer-events-none z-10 flex flex-col justify-between p-2">
                            <span className="text-[5px] font-mono text-white/70 bg-black/40 px-2 rounded-full w-max text-left tracking-wider font-bold">TALENT_0{selectedMemberIdx+1}</span>
                            <div className="flex justify-between items-center text-white text-[7px] font-black uppercase drop-shadow z-10">
                              <span>{currentMember.stageName}</span>
                              <span className="font-mono text-[5px] text-white/80">{currentMember.representativeAnimal || '🦁'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Prompt compiler review box */}
                        <div className="flex-grow space-y-3 w-full self-stretch flex flex-col justify-between">
                          <div className="space-y-1 bg-white p-3 rounded-xl border border-neutral-200 shadow-sm">
                            <span className="text-[7px] font-black text-[#d97706] tracking-wider uppercase block">MIDJOURNEY / FLUX COMPILED SPEC</span>
                            <p className="text-[9px] text-neutral-600 font-medium leading-relaxed select-auto h-[115px] overflow-y-auto pr-1">
                              {compiledPortraitPrompt}
                            </p>
                          </div>

                          {portraitRenderError && (
                            <span className="text-[9px] text-red-600 font-bold block">{portraitRenderError}</span>
                          )}

                          <div className="flex flex-wrap gap-2">
                            <button 
                              onClick={() => handleCopyText(compiledPortraitPrompt)}
                              className="bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                            >
                              {copiedPrompt ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              Copy Frame Prompt
                            </button>
                            <button 
                              onClick={handleSaveMemberPrompt}
                              className="bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all shrink-0 flex items-center gap-1 shadow-sm cursor-pointer"
                            >
                              <Save className="w-3 h-3" />
                              Save Blueprints
                            </button>
                            <button 
                              onClick={handleRenderActualImage}
                              disabled={isRenderingPortrait}
                              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all shrink-0 flex items-center gap-1 shadow-sm disabled:opacity-50 cursor-pointer"
                            >
                              {isRenderingPortrait ? (
                                <span className="animate-spin mr-1 text-white">⚡</span>
                              ) : (
                                <Sparkles className="w-3 h-3 text-white" />
                              )}
                              {isRenderingPortrait ? 'Photoshooting...' : 'Apply & Generate Portrait'}
                            </button>
                            {currentMember?.imageUrl && (
                              <>
                                <button 
                                  onClick={handleRenderNewOutfitOnly}
                                  disabled={isRenderingPortrait}
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all shrink-0 flex items-center gap-1 shadow-sm disabled:opacity-50 cursor-pointer"
                                  title="Change outfit only while keeping the idol's face and hairstyle identical"
                                >
                                  {isRenderingPortrait ? (
                                    <span className="animate-spin mr-1 text-white">⚡</span>
                                  ) : (
                                    <Shirt className="w-3 h-3 text-white" />
                                  )}
                                  {isRenderingPortrait ? 'Changing Outfit...' : 'Change Outfit Only'}
                                </button>
                                <button 
                                  onClick={handleRenderNewHairstyleOnly}
                                  disabled={isRenderingPortrait}
                                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all shrink-0 flex items-center gap-1 shadow-sm disabled:opacity-50 cursor-pointer"
                                  title="Change hairstyle only while keeping the idol's face and stage outfit identical"
                                >
                                  {isRenderingPortrait ? (
                                    <span className="animate-spin mr-1 text-white">⚡</span>
                                  ) : (
                                    <Scissors className="w-3 h-3 text-white" />
                                  )}
                                  {isRenderingPortrait ? 'Changing Hair...' : 'Change Hair Only'}
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Rendering triggers */}
                  <div className="bg-neutral-50 px-4 py-3 rounded-2xl border border-neutral-200 flex items-center gap-4">
                    <button 
                      onClick={handleCompilePortrait}
                      disabled={isCompilingPortrait}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-50 shrink-0 shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isCompilingPortrait ? 'animate-spin' : ''}`} />
                      Compile Concept Layout
                    </button>
                    
                    {isCompilingPortrait && (
                      <div className="flex-grow space-y-1.5">
                        <div className="flex justify-between items-center text-[7px] font-black uppercase text-neutral-400">
                          <span>Synthesizing physical idol features...</span>
                          <span className="font-mono">{portraitProgress}%</span>
                        </div>
                        <div className="w-full bg-neutral-200 h-1 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full transition-all duration-150" style={{ width: `${portraitProgress}%` }}></div>
                        </div>
                      </div>
                    )}
                  </div>

                </div>

              </div>
            ) : (
              <div className="text-center py-20 text-neutral-400">
                <h3 className="text-base font-black">Talent Lineup Empty</h3>
                <p className="text-[10px] mt-1">Please cast members in the Lineup page first.</p>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            TAB 2: ALBUM COVERS ART WORKBENCH
            =================================================================== */}
        {activeStudioTab === 'albums' && (
          <div className="space-y-4">
            {groupProfile.discography && groupProfile.discography.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Visual controls */}
                <div className="lg:col-span-4 space-y-3">
                  <span className="text-[7px] font-black text-amber-700 tracking-[0.12em] uppercase block">ALBUM JACKET DESIGN CONTROLS</span>
                  
                  <div className="flex flex-col">
                    <label className="text-[7px] font-black text-neutral-400 uppercase mb-1">Target Album</label>
                    <select 
                      value={selectedAlbumIdx}
                      onChange={(e) => {
                        setSelectedAlbumIdx(Number(e.target.value));
                        setCoverReady(false);
                      }}
                      className="border border-neutral-200 p-2 rounded-xl font-bold text-neutral-800 text-[10px] focus:outline-none bg-white"
                    >
                      {groupProfile.discography.map((album, idx) => (
                        <option key={idx} value={idx}>{album.type || 'Album'}: "{album.title}" ({album.releaseDate})</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[7px] font-black text-neutral-400 uppercase mb-1">Physical Media Packaging</label>
                    <select 
                      value={coverArtDirection}
                      onChange={(e) => { setCoverArtDirection(e.target.value); setCoverReady(false); }}
                      className="border border-neutral-200 p-2 rounded-xl font-bold text-neutral-800 text-[10px] focus:outline-none bg-white"
                    >
                      <option value="Standard CD Jewel Case format with high-contrast reflex highlight">Classic CD Jewel Case</option>
                      <option value="Luxury Matte Photobook Cover overlayed with silver slipcase sleeve">Premium Slim Photobook Digipak</option>
                      <option value="Classic 12-inch Vinyl Gatefold Record Sleeve showing gloss groove circles">Limited Vinyl Gatefold</option>
                      <option value="Collectible cassette tape cartridge container including clear outer casing">Retro Cassette Cartridge</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[7px] font-black text-neutral-400 uppercase mb-1">Cover Art Motif Concept</label>
                    <select 
                      value={coverArtTheme}
                      onChange={(e) => { setCoverArtTheme(e.target.value); setCoverReady(false); }}
                      className="border border-neutral-200 p-2 rounded-xl font-bold text-neutral-800 text-[10px] focus:outline-none bg-white"
                    >
                      <option value="A beautiful 3D Abstract Jewel sculpture floating inside a void with glowing metallic textures">Abstract 3D Crystal Gem</option>
                      <option value="Sleek Minimalist Swiss Typography on flat pastel backgrounds with custom brand gridlines">Swiss Minimalist Typography</option>
                      <option value="Glitch Art cyber punk layout with glowing matrix codes and metallic foil mask">Cyber Glitch Foil</option>
                      <option value="Cute hand-drawn doodle pop graphics filled with vibrant cartoon outlines and stickers">Pastel Doodle-Pop Collage</option>
                      <option value="Moody surrealist oil painting representing sunset skies, misty fog, and architectural ruins">Classic Surrealist Painting</option>
                      <option value="Ethereal celestial cosmos with floating orbital rings and starlight dust">Celestial Galaxy Aura</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[7px] font-black text-neutral-400 uppercase mb-1">Title Typography Casing</label>
                    <div className="grid grid-cols-3 gap-1">
                      {([
                        { id: 'UPPER' as const, label: 'UPPER' },
                        { id: 'lower' as const, label: 'lower' },
                        { id: 'Title' as const, label: 'Title Case' }
                      ]).map(cas => (
                        <button
                          key={cas.id}
                          onClick={() => { setCoverTitleCasing(cas.id); setCoverReady(false); }}
                          className={`py-1 border rounded text-[7px] font-extrabold uppercase cursor-pointer ${
                            coverTitleCasing === cas.id 
                              ? 'bg-amber-600 text-white border-amber-600' 
                              : 'bg-white text-neutral-600 border-neutral-200'
                          }`}
                        >
                          {cas.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col pt-1">
                    <label className="text-[7px] font-black text-neutral-400 uppercase mb-1">Additional Art Specifications (Optional)</label>
                    <input 
                      type="text"
                      placeholder="Add objects like 'silver butterfly', 'broken glass'..."
                      value={customCoverGuideline}
                      onChange={(e) => { setCustomCoverGuideline(e.target.value); setCoverReady(false); }}
                      className="border border-neutral-200 p-2 rounded-xl font-bold text-neutral-800 text-[10px]"
                    />
                  </div>
                </div>

                {/* Display Output */}
                <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
                  <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-6 flex flex-col md:flex-row gap-5 items-center justify-center min-h-[320px]">
                    {currentAlbum && (
                      <>
                        {/* Live Artwork / Graphic Album Cover */}
                        <div 
                          className="relative w-64 h-64 rounded-xl overflow-hidden shrink-0 shadow-2xl select-none group border border-neutral-300 cursor-pointer"
                          onClick={() => activeAlbumCoverUrl && setLightboxImage(activeAlbumCoverUrl)}
                        >
                          {/* Shifting radial holographic sleeve foil */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none z-20 group-hover:via-white/20 transition-all"></div>
                          
                          {activeAlbumCoverUrl ? (
                            <>
                              <img 
                                src={activeAlbumCoverUrl} 
                                alt={currentAlbum.title} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute top-2 right-2 z-30 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <Maximize2 className="w-3.5 h-3.5" />
                              </div>
                            </>
                          ) : (
                            <div 
                              className="absolute inset-0 flex flex-col justify-between p-4"
                              style={{
                                background: coverReady 
                                  ? `radial-gradient(circle at 70% 30%, ${colors[0]?.hex || '#10b981'}bb, ${colors[1]?.hex || '#d97706'}aa, #111827)`
                                  : '#18181b'
                              }}
                            >
                              {coverReady ? (
                                <>
                                  <div className="flex justify-between items-start text-white/60 text-[6px] font-mono leading-none z-10 font-bold">
                                    <span>{currentAlbum.type}</span>
                                    <span>EDITION_{new Date().getFullYear()}</span>
                                  </div>

                                  <div className="flex-grow flex items-center justify-center relative z-10">
                                    <div className="w-20 h-20 rounded-full border border-white/20 flex items-center justify-center animate-pulse relative">
                                      <div className="w-14 h-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-[2px] flex items-center justify-center">
                                        <Disc className="w-8 h-8 text-white/80" />
                                      </div>
                                      <div className="absolute inset-2 border border-dashed border-emerald-400 rounded-full opacity-30"></div>
                                    </div>
                                  </div>

                                  <div className="text-center z-10 text-white space-y-1">
                                    <h4 className="font-black tracking-tighter leading-none text-sm uppercase drop-shadow">
                                      {coverTitleCasing === 'UPPER' 
                                        ? currentAlbum.title.toUpperCase() 
                                        : coverTitleCasing === 'lower' 
                                          ? currentAlbum.title.toLowerCase() 
                                          : currentAlbum.title}
                                    </h4>
                                    <p className="text-[7px] text-white/70 font-mono tracking-widest font-black uppercase">
                                      *{groupProfile.groupName}*
                                    </p>
                                  </div>
                                </>
                              ) : (
                                <div className="inset-0 m-auto flex flex-col items-center justify-center text-neutral-400 absolute">
                                  <ImageIcon className="w-8 h-8 text-neutral-500 mb-2 animate-pulse" />
                                  <h5 className="text-[9px] font-black uppercase tracking-widest">CD JACKET WORKBENCH</h5>
                                  <p className="text-[7px]">Click "Generate AI Album Cover" below</p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Jewel case sheen overlay */}
                          {coverArtDirection.includes('Jewel') && (
                            <>
                              <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-black/10 border-l border-white/10 z-20 pointer-events-none"></div>
                              <div className="absolute inset-2 border border-white/5 rounded-full pointer-events-none opacity-40 z-10"></div>
                            </>
                          )}
                        </div>

                        {/* Compiler specs container */}
                        <div className="self-stretch flex-grow flex flex-col justify-between space-y-3 w-full">
                          <div className="bg-white p-3 rounded-xl border border-neutral-200 shadow-sm">
                            <span className="text-[7px] font-black text-[#d97706] tracking-wider uppercase block">AI ART PROMPT SPECIFICATION</span>
                            <p className="text-[9px] text-neutral-600 font-medium leading-relaxed h-[95px] overflow-y-auto pr-1">
                              {compiledCoverPrompt}
                            </p>
                          </div>

                          {coverGenError && (
                            <span className="text-[9px] text-red-600 font-bold block">{coverGenError}</span>
                          )}

                          <div className="flex flex-wrap gap-2 pt-1">
                            <button 
                              onClick={() => handleCopyText(compiledCoverPrompt)}
                              className="bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shrink-0 cursor-pointer"
                            >
                              {copiedPrompt ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              Copy Prompt
                            </button>
                            <button 
                              onClick={handleSaveCoverPrompt}
                              className="bg-neutral-800 hover:bg-neutral-900 text-white px-3.5 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm shrink-0 cursor-pointer"
                            >
                              <Save className="w-3 h-3" />
                              Save Blueprint
                            </button>
                            <button 
                              onClick={handleGenerateAlbumCover}
                              disabled={isGeneratingCover}
                              className="bg-amber-600 hover:bg-amber-700 active:scale-95 text-white px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-md shrink-0 cursor-pointer transition-all disabled:opacity-50"
                            >
                              {isGeneratingCover ? (
                                <span className="animate-spin text-white">⚡</span>
                              ) : (
                                <Sparkles className="w-3.5 h-3.5 text-white" />
                              )}
                              <span>{isGeneratingCover ? 'Rendering 8K Artwork...' : '✨ Generate AI Album Cover'}</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Compiler triggering elements */}
                  <div className="bg-neutral-50 px-4 py-3 rounded-2xl border border-neutral-200 flex items-center gap-4">
                    <button 
                      onClick={handleCompileCover}
                      disabled={isCompilingCover}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest disabled:opacity-50 shrink-0 shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isCompilingCover ? 'animate-spin' : ''}`} />
                      Compile Jacket Concept
                    </button>
                    {isCompilingCover && (
                      <div className="flex-grow space-y-1.5">
                        <div className="flex justify-between items-center text-[7px] font-black uppercase text-neutral-400">
                          <span>Rendering CD Jacket cover layouts...</span>
                          <span className="font-mono">{coverProgress}%</span>
                        </div>
                        <div className="w-full bg-neutral-200 h-1 rounded-full overflow-hidden">
                          <div className="bg-[#10b981] h-full" style={{ width: `${coverProgress}%` }}></div>
                        </div>
                      </div>
                    )}
                  </div>

                </div>

              </div>
            ) : (
              <div className="text-center py-20 text-neutral-400">
                <h3 className="text-base font-black">Discography Empty</h3>
                <p className="text-[10px] mt-1">Please develop a record in the Records page first.</p>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            TAB 3: BRANDING - reactive lightstick designer & 3D render
            =================================================================== */}
        {activeStudioTab === 'branding' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Designer controls (4 cols) */}
              <div className="lg:col-span-4 space-y-3 font-semibold text-[10px] text-neutral-800 leading-tight">
                <span className="text-[7px] font-black text-amber-700 tracking-[0.12em] uppercase block">LIGHTSTICK DESIGN SPECS</span>
                
                <div className="flex flex-col">
                  <label className="text-[7px] font-black text-neutral-400 uppercase mb-1">Outer Sphere Dome Design</label>
                  <select 
                    value={lightstickGlobe}
                    onChange={(e) => setLightstickGlobe(e.target.value)}
                    className="border border-neutral-200 p-2 rounded-xl font-bold text-neutral-800 text-[10px] focus:outline-none bg-white"
                  >
                    <option value="Crystal Hexagonal Dome reflecting lights at high-fashion angles">Crystal Hexagon Globe</option>
                    <option value="Sleek Minimal Monolith Dome enclosing the inner figure cleanly">Monolith Cylindrical Dome</option>
                    <option value="Crown Jewel Heart Dome symbolizing the crown of fans">Princess Crown Heart Dome</option>
                    <option value="Rotated Planet Ring Sphere floating inside spatial grids">Solar Orbit Ring Sphere</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-[7px] font-black text-neutral-400 uppercase mb-1">Mounted Core Logo Figure</label>
                  <select 
                    value={lightstickCoreEmblem}
                    onChange={(e) => setLightstickCoreEmblem(e.target.value)}
                    className="border border-neutral-200 p-2 rounded-xl font-bold text-neutral-800 text-[10px] focus:outline-none bg-white"
                  >
                    <option value="Rotating Miniature Group Silhouette Emblem designed in silver chrome">Rotating Chrome Emblem</option>
                    <option value="Glowing Golden Wings structure holding a crystal heart">Glowing Angelic Wings</option>
                    <option value="Symmetric five-point core star emitting light beams upwards">Symmetric Pentagram Star</option>
                    <option value="Interconnected orbit ring figures revolving manually inside">Mechanical Orbit Monogram</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-[7px] font-black text-neutral-400 uppercase mb-1">Merchandise Grip Handle Style</label>
                  <select 
                    value={lightstickHandleStyle}
                    onChange={(e) => setLightstickHandleStyle(e.target.value)}
                    className="border border-neutral-200 p-2 rounded-xl font-bold text-neutral-800 text-[10px] focus:outline-none bg-white"
                  >
                    <option value="Sleek Matte Obsidian Black handle featuring custom rubberized grips">Sleek Matte Black Grip</option>
                    <option value="Luxury Pristine Pearl-Silver handle containing chrome accent buttons">Pristine Pearl-Silver</option>
                    <option value="Transparent Neon handle with visible fiber-optic components">Transparent Tech-Fiber Grip</option>
                  </select>
                </div>

                {/* Strobe Choreography Selection */}
                <div className="flex flex-col space-y-1">
                  <span className="text-[7px] font-black text-neutral-400 uppercase tracking-widest">Active LED Strobe Choreography</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'solid' as const, label: 'Standard Steady' },
                      { id: 'pulse' as const, label: 'Breathing Pulse' },
                      { id: 'flash' as const, label: 'Active Flash' },
                      { id: 'strobe' as const, label: 'Stadium Strobe' }
                    ].map(st => (
                      <button
                        key={st.id}
                        onClick={() => setLightstickChoreography(st.id)}
                        className={`py-1.5 border rounded text-[7px] font-black uppercase tracking-wider cursor-pointer ${
                          lightstickChoreography === st.id
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'bg-white text-neutral-500 border-neutral-200'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Simulated stadium ambience sound toggle */}
                <div className="pt-1.5 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-[7px] font-black text-neutral-400 uppercase tracking-widest">STADIUM FAN AUDIO AMBIENCE</span>
                  <button 
                    onClick={() => setStadiumCheerStream(!stadiumCheerStream)}
                    className={`px-3 py-1 text-[7px] font-black uppercase rounded-full cursor-pointer ${
                      stadiumCheerStream 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                    }`}
                  >
                    {stadiumCheerStream ? "Cheering: On" : "Audio: Mute"}
                  </button>
                </div>

              </div>

              {/* Display & prompts output (8 cols) */}
              <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
                <div className="bg-neutral-950 text-white rounded-2xl p-5 border border-white/5 flex flex-col md:flex-row gap-5 items-center justify-center min-h-[320px] relative overflow-hidden select-none">
                  
                  {/* Neon Grid back */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>

                  {/* Mode switcher (Interactive SVG vs Real 3D AI Render) */}
                  {groupProfile.fandom?.lightstickUrl && (
                    <div className="absolute top-3 left-3 z-30 flex items-center gap-1 bg-black/60 backdrop-blur-sm p-1 rounded-full border border-white/10">
                      <button
                        onClick={() => setLightstickViewMode('interactive')}
                        className={`px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                          lightstickViewMode === 'interactive' ? 'bg-amber-600 text-white' : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        ⚡ Live Simulator
                      </button>
                      <button
                        onClick={() => setLightstickViewMode('render')}
                        className={`px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                          lightstickViewMode === 'render' ? 'bg-amber-600 text-white' : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        ✨ 3D AI Photo
                      </button>
                    </div>
                  )}

                  {/* Interactive Reactive Lightstick SVG vector mesh or 3D Photo */}
                  {lightstickViewMode === 'render' && groupProfile.fandom?.lightstickUrl ? (
                    <div 
                      className="w-56 h-72 rounded-2xl overflow-hidden shadow-2xl border border-white/20 shrink-0 relative group cursor-pointer"
                      onClick={() => setLightboxImage(groupProfile.fandom?.lightstickUrl || null)}
                    >
                      <img 
                        src={groupProfile.fandom.lightstickUrl} 
                        alt="Official 3D Lightstick" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-white/90 text-neutral-900 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-wider">
                          Full View
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-52 h-72 relative flex flex-col justify-center items-center shrink-0 z-10">
                      {/* Glowing bloom aura based on power states */}
                      {lightstickPower && (
                        <div 
                          className={`absolute w-36 h-36 rounded-full filter blur-xl opacity-30 transition-all top-[15%] duration-700 bg-emerald-500 ${
                            lightstickChoreography === 'pulse' ? 'animate-pulse' : 
                            lightstickChoreography === 'flash' ? 'animate-[ping_1.5s_infinite]' : 
                            lightstickChoreography === 'strobe' ? 'animate-[bounce_0.4s_infinite]' : ''
                          }`}
                          style={{ backgroundColor: colors[0]?.hex || '#10b981' }}
                        />
                      )}

                      {/* SVG Graphic Lightstick body */}
                      <svg width="200" height="280" viewBox="0 0 200 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 scale-100 hover:scale-105 transition-transform duration-500">
                        {/* Transparent Outer dome globe */}
                        <circle cx="100" cy="100" r="50" stroke="white" strokeWidth="2.5" strokeOpacity="0.4" fill="white" fillOpacity="0.05" />
                        
                        {/* Interactive inside figure */}
                        <rect x="92" y="85" width="16" height="30" rx="3" fill={lightstickPower ? (colors[0]?.hex || '#10b981') : '#525252'} className="transition-all" />
                        <circle cx="100" cy="80" r="10" fill={lightstickPower ? (colors[1]?.hex || '#d97706') : '#404040'} className="transition-all" />
                        
                        {/* Outer orbital rings around circle */}
                        {lightstickGlobe.includes('Orbit') && (
                          <ellipse cx="100" cy="100" rx="60" ry="15" stroke="white" strokeWidth="1" strokeOpacity="0.3" transform="rotate(25 100 100)" />
                        )}
                        
                        {/* Chrome support stand base under dome */}
                        <rect x="85" y="146" width="30" height="12" rx="2" fill="#737373" />
                        
                        {/* Sleek support handle */}
                        <path d="M90 158L88 245C88 248 90 250 93 250H107C110 250 112 248 112 245L110 158H90Z" fill={lightstickHandleStyle.includes('Black') ? "#171717" : "#e5e5e5"} />
                        <line x1="94" y1="162" x2="94" y2="245" stroke="white" strokeOpacity="0.1" strokeWidth="2" />
                        
                        {/* Button controls glow indicator */}
                        <circle cx="100" cy="180" r="4" fill={lightstickPower ? (colors[0]?.hex || '#10b981') : '#3f3f46'} className="transition-all cursor-pointer" />
                      </svg>
                    </div>
                  )}

                  {/* Left layout details & sound streams */}
                  <div className="flex-grow space-y-4 self-stretch flex flex-col justify-between w-full h-full relative z-10">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-white/10">
                        <span className="text-[7px] font-black uppercase text-amber-500 tracking-wider">Device Workbench Details</span>
                        <button 
                          onClick={() => setLightstickPower(!lightstickPower)}
                          className={`text-[8px] font-black px-3 py-1 uppercase rounded-full tracking-widest cursor-pointer ${
                            lightstickPower 
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' 
                              : 'bg-white/10 hover:bg-white/15 text-neutral-300'
                          }`}
                        >
                          POWER: {lightstickPower ? "ACTIVE" : "OFFLINE"}
                        </button>
                      </div>

                      <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                        <span className="text-[6px] font-black uppercase text-neutral-400">Merchandise Design Prompt Spec</span>
                        <p className="text-[9px] text-neutral-300 leading-normal font-medium max-h-[75px] overflow-y-auto pr-1">
                          {compiledBrandingPrompt}
                        </p>
                      </div>

                      {lightstickGenError && (
                        <span className="text-[8px] text-rose-400 font-bold block">{lightstickGenError}</span>
                      )}

                      {stadiumCheerStream && lightstickPower && (
                        <div className="text-[7px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 p-2.5 rounded-lg flex items-center gap-2 animate-pulse">
                          <span className="block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span className="font-bold">Virtual Crowd Cheer simulation active. Loud stadium screams of "{fandomName}" looping...</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 shrink-0 pt-2 border-t border-white/10">
                      <button 
                        onClick={() => handleCopyText(compiledBrandingPrompt)}
                        className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all shrink-0 cursor-pointer"
                      >
                        {copiedPrompt ? "Copied!" : "Copy Spec"}
                      </button>
                      <button 
                        onClick={handleSaveBrandingPrompt}
                        className="bg-white/10 hover:bg-white/15 text-white px-3.5 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all shrink-0 flex items-center gap-1 cursor-pointer"
                      >
                        <Save className="w-3 h-3" />
                        Save Specs
                      </button>
                      <button 
                        onClick={handleGenerateLightstickRender}
                        disabled={isGeneratingLightstick}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all shadow-md shrink-0 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                      >
                        {isGeneratingLightstick ? (
                          <span className="animate-spin text-white">⚡</span>
                        ) : (
                          <Sparkles className="w-3 h-3 text-white" />
                        )}
                        <span>{isGeneratingLightstick ? 'Rendering 3D...' : '✨ Generate 3D Lightstick'}</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 4: CONCEPT EDITORIAL PHOTOPRINT MAG
            =================================================================== */}
        {activeStudioTab === 'concept' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Costume / Concept Specs Card (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[7px] font-black text-amber-700 tracking-[0.13em] uppercase block">EDITORIAL LAYOUT BRACKETS</span>
                  <button 
                    onClick={handleAddNewConcept}
                    className="text-[7px] font-black text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Version
                  </button>
                </div>
                
                <div className="space-y-3 bg-neutral-50 p-4 border border-neutral-200 rounded-2xl max-h-[480px] overflow-y-auto">
                  {editedConcepts.map((con, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`bg-white p-3.5 rounded-xl border shadow-sm space-y-3 transition-all cursor-pointer ${
                        activePhotoIdx === idx ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-neutral-150 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[7px] font-black px-2 py-0.5 rounded-full bg-amber-50 text-[#d97706] border border-amber-100">
                          VER_0{idx+1} Concept
                        </span>
                        <div className="flex items-center gap-2">
                          <input 
                            type="text"
                            value={con.versionName}
                            onChange={(e) => handleUpdateConceptItem(idx, 'versionName', e.target.value)}
                            className="font-black text-xs text-neutral-900 uppercase border-b border-dashed border-neutral-300 focus:outline-none text-right"
                          />
                          {editedConcepts.length > 1 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteConcept(idx);
                              }}
                              className="text-neutral-400 hover:text-rose-600 p-1"
                              title="Delete concept version"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Framing & Camera Angle */}
                      <div className="flex flex-col space-y-1">
                        <label className="text-[7px] font-black text-neutral-600 uppercase flex items-center gap-1">
                          <Camera className="w-3 h-3 text-amber-600" /> Shot Framing & Scale (Strict Constraint)
                        </label>
                        <select
                          value={con.framingType || 'upper_body_close_up'}
                          onChange={(e) => handleUpdateConceptItem(idx, 'framingType', e.target.value)}
                          className="w-full border border-neutral-200 bg-white p-1.5 rounded-lg text-[9px] font-bold text-neutral-800 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                        >
                          {LOOKBOOK_FRAMING_OPTIONS.map(f => (
                            <option key={f.id} value={f.id}>{f.label}</option>
                          ))}
                        </select>
                        <p className="text-[7px] text-neutral-500 italic">
                          {LOOKBOOK_FRAMING_OPTIONS.find(f => f.id === (con.framingType || 'upper_body_close_up'))?.description}
                        </p>
                      </div>

                      {/* Posing & Level Arrangement */}
                      <div className="flex flex-col space-y-1">
                        <label className="text-[7px] font-black text-neutral-600 uppercase flex items-center gap-1">
                          <Layers className="w-3 h-3 text-amber-600" /> Posing & Level Arrangement (No Leaning)
                        </label>
                        <select
                          value={con.poseStyle || 'intimate_cluster'}
                          onChange={(e) => handleUpdateConceptItem(idx, 'poseStyle', e.target.value)}
                          className="w-full border border-neutral-200 bg-white p-1.5 rounded-lg text-[9px] font-bold text-neutral-800 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                        >
                          {LOOKBOOK_POSE_OPTIONS.map(p => (
                            <option key={p.id} value={p.id}>{p.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Expression & Energy Mood */}
                      <div className="flex flex-col space-y-1">
                        <label className="text-[7px] font-black text-neutral-600 uppercase flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-600" /> Facial Expression & Energy (Strictly Anti-Unhappy)
                        </label>
                        <select
                          value={con.expressionMood || 'radiant_smile'}
                          onChange={(e) => handleUpdateConceptItem(idx, 'expressionMood', e.target.value)}
                          className="w-full border border-neutral-200 bg-white p-1.5 rounded-lg text-[9px] font-bold text-neutral-800 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                        >
                          {LOOKBOOK_EXPRESSION_OPTIONS.map(e => (
                            <option key={e.id} value={e.id}>{e.label}</option>
                          ))}
                        </select>
                        <p className="text-[7px] text-neutral-500 italic">
                          {LOOKBOOK_EXPRESSION_OPTIONS.find(e => e.id === (con.expressionMood || 'radiant_smile'))?.description}
                        </p>
                      </div>

                      {/* Typography & Official Colors Header */}
                      <div className="flex flex-col space-y-1">
                        <label className="text-[7px] font-black text-neutral-600 uppercase flex items-center gap-1">
                          <Palette className="w-3 h-3 text-amber-600" /> Group Logo Typography & Color Style
                        </label>
                        <select
                          value={con.typographyStyle || 'official_colors_neon_chrome'}
                          onChange={(e) => handleUpdateConceptItem(idx, 'typographyStyle', e.target.value)}
                          className="w-full border border-neutral-200 bg-white p-1.5 rounded-lg text-[9px] font-bold text-neutral-800 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                        >
                          {LOOKBOOK_TYPOGRAPHY_OPTIONS.map(t => (
                            <option key={t.id} value={t.id}>{t.label}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="flex flex-col space-y-1">
                        <label className="text-[6px] font-black text-neutral-400 uppercase">Costume & Aesthetic Keynote</label>
                        <textarea
                          rows={2}
                          value={con.aestheticStyling}
                          onChange={(e) => handleUpdateConceptItem(idx, 'aestheticStyling', e.target.value)}
                          className="border border-neutral-100 p-1.5 rounded text-[9px] text-neutral-800 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 leading-normal"
                        />
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="text-[6px] font-black text-neutral-400 uppercase">Makeup, Hair & Grooming Blueprint</label>
                        <textarea
                          rows={2}
                          value={con.makeupHairInfo}
                          onChange={(e) => handleUpdateConceptItem(idx, 'makeupHairInfo', e.target.value)}
                          className="border border-neutral-100 p-1.5 rounded text-[9px] text-neutral-800 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 leading-normal"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={handleSaveConceptStrategy}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[8px] py-2.5 rounded-full tracking-widest shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Visual Strategy
                </button>
              </div>

              {/* Lookbook Layout preview (7 cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
                <div className="bg-white border-2 border-neutral-900 rounded-2xl p-6 min-h-[360px] shadow-lg flex flex-col justify-between text-neutral-900 space-y-4 relative overflow-hidden font-serif select-none">
                  
                  {/* Photo agency watermarking background */}
                  <div className="absolute right-[-40px] top-[-20px] font-sans opacity-5 text-[6rem] font-black italic pointer-events-none tracking-tighter leading-none select-none text-neutral-900">
                    A&R MAG
                  </div>

                  {/* Header page details */}
                  <div className="flex justify-between items-end border-b border-neutral-950 pb-2 font-sans font-black tracking-widest text-[7px] uppercase">
                    <span>A&R Lookbook Editorial v3.0</span>
                    <span>Page 0{activePhotoIdx+1} of 0{editedConcepts.length}</span>
                  </div>

                  {/* Styled magazine layout */}
                  <div className="flex-grow flex flex-col md:flex-row gap-5 items-center justify-center py-2 relative z-10">
                    {/* High-Fashion Editorial Mock Panel / Real AI Photoshoot */}
                    <div 
                      className="w-56 h-64 shrink-0 bg-neutral-900 text-white rounded-xl relative overflow-hidden shadow-xl flex flex-col justify-between p-3 select-none cursor-pointer group"
                      onClick={() => currentConcept?.imageUrl && setLightboxImage(currentConcept.imageUrl)}
                    >
                      {currentConcept?.imageUrl ? (
                        <>
                          <img 
                            src={currentConcept.imageUrl} 
                            alt={currentConcept.versionName}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col justify-between p-3 z-10">
                            <div className="flex justify-between items-start font-sans font-black text-[5px] uppercase tracking-widest text-emerald-300">
                              <span>Lookbook Scan</span>
                              <span>EDITORIAL</span>
                            </div>
                            <div>
                              <h5 className="font-serif italic text-xs font-bold uppercase tracking-tight text-white drop-shadow">
                                {currentConcept.versionName}
                              </h5>
                              <p className="text-[6px] font-sans text-neutral-300 uppercase font-black tracking-widest">
                                {groupProfile.groupName}
                              </p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div 
                            className="absolute inset-0 opacity-40"
                            style={{
                              background: `linear-gradient(rgba(16,185,129,0.3), rgba(245,158,11,0.2)), repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 2px, transparent 2px, transparent 10px)`
                            }}
                          ></div>
                          
                          <div className="flex justify-between items-start font-sans font-black text-[5px] uppercase tracking-widest text-emerald-400">
                            <span>Studio Setup</span>
                            <span>LOOKBOOK</span>
                          </div>

                          <div className="text-center font-serif py-4">
                            <Camera className="w-6 h-6 text-white/50 mx-auto animate-pulse mb-1" />
                            <h5 className="italic text-[11px] font-semibold leading-tight px-1 uppercase tracking-tight">
                              {currentConcept?.versionName || "LOOKBOOK"}
                            </h5>
                          </div>

                          <div className="flex justify-between items-end font-sans font-black text-[5px] uppercase tracking-widest text-neutral-400">
                            <span>{groupProfile.groupName}</span>
                            <span>CONFIDENTIAL</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Typography editorial detail footnotes & Shoot button */}
                    <div className="flex-grow space-y-3 font-sans w-full md:max-w-[260px]">
                      <div className="space-y-1">
                        <span className="text-[6px] font-black text-emerald-700 tracking-wider block uppercase font-sans">ACTIVE FRAMING & POSE CONFIG</span>
                        <div className="bg-neutral-50 p-2 rounded-lg border border-neutral-200 text-[8px] font-bold text-neutral-800 space-y-1">
                          <div>
                            <span className="text-neutral-400 uppercase font-black text-[6px]">Framing: </span>
                            {LOOKBOOK_FRAMING_OPTIONS.find(f => f.id === (currentConcept?.framingType || 'upper_body_close_up'))?.label}
                          </div>
                          <div>
                            <span className="text-neutral-400 uppercase font-black text-[6px]">Posing: </span>
                            {LOOKBOOK_POSE_OPTIONS.find(p => p.id === (currentConcept?.poseStyle || 'intimate_cluster'))?.label}
                          </div>
                          <div>
                            <span className="text-neutral-400 uppercase font-black text-[6px]">Typography: </span>
                            {LOOKBOOK_TYPOGRAPHY_OPTIONS.find(t => t.id === (currentConcept?.typographyStyle || 'official_colors_neon_chrome'))?.label}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1 border-t border-neutral-200 pt-2">
                        <span className="text-[6px] font-black text-emerald-700 tracking-wider block uppercase font-sans">CONCEPT AESTHETIC DIRECTIVE</span>
                        <p className="text-[9px] text-neutral-800 leading-normal font-semibold font-serif italic text-left">
                          "{currentConcept?.aestheticStyling}"
                        </p>
                      </div>

                      {currentConcept?.imageUrl && (
                        <button
                          onClick={() => handleSetAsGroupDebutPhoto(currentConcept.imageUrl!)}
                          className="w-full bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 py-1.5 px-3 rounded-lg text-[8px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                        >
                          <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                          Set as Debut Group Reference Photo
                        </button>
                      )}

                      {conceptPhotoError && (
                        <span className="text-[8px] text-rose-600 font-bold block">{conceptPhotoError}</span>
                      )}

                      <button
                        onClick={handleGenerateEditorialSpread}
                        disabled={isGeneratingConceptPhoto}
                        className="mt-2 w-full bg-neutral-900 hover:bg-neutral-800 active:scale-95 text-white py-2.5 px-3 rounded-full text-[8px] font-black uppercase tracking-widest shadow flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all"
                      >
                        {isGeneratingConceptPhoto ? (
                          <span className="animate-spin text-white">⚡</span>
                        ) : (
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        )}
                        <span>{isGeneratingConceptPhoto ? 'Shooting Editorial...' : '✨ Shoot Editorial Lookbook'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Flippers */}
                  <div className="flex justify-between items-center pt-2 border-t border-neutral-950 shrink-0 font-sans">
                    <span className="text-[7px] text-neutral-400 font-bold uppercase tracking-wider">Agency restricted photobook prints</span>
                    <div className="flex gap-2">
                      {editedConcepts.map((_, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => setActivePhotoIdx(pIdx)}
                          className={`w-5 h-5 rounded-full text-[7px] font-black flex items-center justify-center transition-all cursor-pointer ${
                            activePhotoIdx === pIdx 
                              ? 'bg-neutral-950 text-white shadow' 
                              : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                          }`}
                        >
                          {pIdx+1}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 5: MERCHANDISE MOCK DESIGN LAB
            =================================================================== */}
        {activeStudioTab === 'merch' && (() => {
          const hasLightstick = Boolean(groupProfile.fandom?.lightstickUrl);
          const hasMascot = Boolean(groupProfile.fandom?.mascotUrl);
          const isMerchLocked = !hasLightstick || !hasMascot;

          return (
          <div className="space-y-4">
            {/* Prerequisite Gate Banner */}
            {isMerchLocked ? (
              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4 text-amber-700" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-amber-950">
                      Official Merch Studio Locked: Brand Assets Required
                    </h4>
                    <p className="text-[10px] text-amber-800 leading-relaxed mt-0.5 font-medium">
                      Before generating merchandise mockups, you must generate the <strong>Official Lightstick</strong> (which contains the group logo and box packaging design) and the <strong>Group Mascot</strong>. The studio uses these designs as authentic visual references.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Lightstick Card */}
                  <div className={`p-3 rounded-xl border flex items-center justify-between ${
                    hasLightstick ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' : 'bg-white border-amber-200 text-amber-900 shadow-2xs'
                  }`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] ${hasLightstick ? 'bg-emerald-500 text-white' : 'bg-amber-100 text-amber-600'}`}>
                        {hasLightstick ? <Check className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <div className="text-[9px] font-black uppercase">1. Lightstick & Box Logo</div>
                        <div className="text-[8px] text-neutral-500">{hasLightstick ? 'Ready ✓ Active' : 'Missing: Generate 3D lightstick'}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveStudioTab('branding')}
                      className={`px-3 py-1 rounded-lg text-[7.5px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                        hasLightstick ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                      }`}
                    >
                      {hasLightstick ? 'View Lightstick' : 'Open Lightstick Lab'}
                    </button>
                  </div>

                  {/* Mascot Card */}
                  <div className={`p-3 rounded-xl border flex items-center justify-between ${
                    hasMascot ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' : 'bg-white border-amber-200 text-amber-900 shadow-2xs'
                  }`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] ${hasMascot ? 'bg-emerald-500 text-white' : 'bg-amber-100 text-amber-600'}`}>
                        {hasMascot ? <Check className="w-3.5 h-3.5" /> : <Smile className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <div className="text-[9px] font-black uppercase">2. Group Mascot Art</div>
                        <div className="text-[8px] text-neutral-500">{hasMascot ? 'Ready ✓ Active' : 'Missing: Generate mascot'}</div>
                      </div>
                    </div>
                    <button
                      onClick={handleGenerateQuickMascot}
                      disabled={isGeneratingQuickMascot}
                      className={`px-3 py-1 rounded-lg text-[7.5px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                        hasMascot ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                      }`}
                    >
                      {isGeneratingQuickMascot ? (
                        <span className="animate-spin text-white">⚡</span>
                      ) : hasMascot ? (
                        'Mascot Ready'
                      ) : (
                        '✨ 1-Click Mascot'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-neutral-900 text-white rounded-xl flex items-center justify-between text-[8px] font-bold">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-emerald-400 font-black uppercase tracking-wider">Brand References Connected</span>
                  <span className="text-neutral-400">(Lightstick Box Logo & Mascot Character Loaded)</span>
                </div>
                <span className="text-neutral-300 bg-white/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Pure White Studio Mockups
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Product selector & configuration (4 cols) */}
              <div className="lg:col-span-4 space-y-3.5 text-[10px] text-neutral-800 leading-tight font-semibold">
                <span className="text-[7px] font-black text-amber-700 tracking-[0.12em] uppercase block">PRODUCT LAUNCH CONFIGURATOR</span>
                
                <div className="flex flex-col">
                  <label className="text-[7px] font-black text-neutral-400 uppercase mb-1">Base Apparel / Item</label>
                  <select 
                    value={merchBaseType}
                    onChange={(e) => setMerchBaseType(e.target.value)}
                    className="border border-neutral-200 p-2 rounded-xl font-bold text-neutral-800 text-[10px] focus:outline-none bg-white"
                  >
                    <option value="Premium Over-Sized Hoodie">Premium Over-Sized Hoodie (Apparel)</option>
                    <option value="Vintage Heavyweight Washed Tee">Vintage Heavyweight Washed Tee (Apparel)</option>
                    <option value="Cotton Canvas Tote Bag">Cotton Canvas Tote Bag (Accessory)</option>
                    <option value="Collectible Vinyl Boxset">Collectible Vinyl Boxset (Media)</option>
                    <option value="Satin Tour Bomber Jacket">Satin Tour Bomber Jacket (Apparel)</option>
                    <option value="Signature acrylic member standee keyring">Acrylic Standee Keyring (Collectible)</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-[7px] font-black text-neutral-400 uppercase mb-1">Apparel Dye / Primary Color</label>
                  <select 
                    value={merchDyeColor}
                    onChange={(e) => setMerchDyeColor(e.target.value)}
                    className="border border-neutral-200 p-2 rounded-xl font-bold text-neutral-800 text-[10px] focus:outline-none bg-white"
                  >
                    {colors.map((c, idx) => (
                      <option key={idx} value={c.name}>{c.name} ({c.hex})</option>
                    ))}
                    <option value="Stealth Charcoal Black">Stealth Charcoal Black (#18181b)</option>
                    <option value="Minimal Pearl Ivory">Minimal Pearl Ivory (#f5f5f4)</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-[7px] font-black text-neutral-400 uppercase mb-1">Graphic Artwork Positioning</label>
                  <select 
                    value={merchGraphicPlacement}
                    onChange={(e) => setMerchGraphicPlacement(e.target.value)}
                    className="border border-neutral-200 p-2 rounded-xl font-bold text-neutral-800 text-[10px] focus:outline-none bg-white"
                  >
                    <option value="Minimalist Left Chest logo with back artwork">Minimal Left Chest + Large Back</option>
                    <option value="Centered giant brand typography in holographic silver ink">Giant Centered Holographic Typography</option>
                    <option value="Sleeve-cuff branding stamp with clean minimalist layout">Sleeve-Cuff Minimalist Emblem</option>
                    <option value="Abstract all-over geometric print representing lore concepts">Abstract All-Over Print representation</option>
                  </select>
                </div>

                {/* Wearable Mannequin Form Selector */}
                <div className="flex flex-col space-y-1">
                  <span className="text-[7px] font-black text-neutral-400 uppercase tracking-widest">
                    Wearables Mannequin / Dummy Form
                  </span>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      onClick={() => setMerchMannequinStyle('dual')}
                      className={`py-1.5 px-1 border rounded-lg text-[7px] font-black uppercase text-center cursor-pointer transition-all ${
                        merchMannequinStyle === 'dual'
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                      }`}
                      title="Dual Display: Male & Female Mannequin Dummies Side-by-Side (Inclusive)"
                    >
                      👥 Dual (M & F)
                    </button>
                    <button
                      onClick={() => setMerchMannequinStyle('female')}
                      className={`py-1.5 px-1 border rounded-lg text-[7px] font-black uppercase text-center cursor-pointer transition-all ${
                        merchMannequinStyle === 'female'
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                      }`}
                      title="Female Dress Form Dummy"
                    >
                      👗 Female Dummy
                    </button>
                    <button
                      onClick={() => setMerchMannequinStyle('male')}
                      className={`py-1.5 px-1 border rounded-lg text-[7px] font-black uppercase text-center cursor-pointer transition-all ${
                        merchMannequinStyle === 'male'
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                      }`}
                      title="Male Tailor's Dummy Form"
                    >
                      👔 Male Dummy
                    </button>
                  </div>
                </div>

                {/* Economic Forecasting Metrics box */}
                <div className="bg-amber-50 p-3.5 border border-amber-100 rounded-xl space-y-2 text-[9px]">
                  <span className="text-[7px] font-black text-[#d97706] tracking-wider uppercase block">A&R COMMERCIAL ESTIMATION FORECAST</span>
                  
                  <div className="grid grid-cols-2 gap-1.5 font-bold">
                    <div className="text-neutral-500">A&R Production Cost:</div>
                    <div className="text-neutral-900 text-right">${estimatedDrives.cost} USD</div>
                    <div className="text-neutral-500">MSRP Retail Price:</div>
                    <div className="text-neutral-900 text-right">${estimatedDrives.retail} USD</div>
                    <div className="text-neutral-500">Estimated Fandom Pre-orders:</div>
                    <div className="text-neutral-900 text-right font-mono text-[10px]">{estimatedDrives.demand.toLocaleString()} units</div>
                    <div className="border-t border-amber-200/50 pt-1 text-neutral-600">Net projected revenue:</div>
                    <div className="border-t border-amber-200/50 pt-1 text-emerald-700 text-[10px] font-black text-right font-mono">${estimatedDrives.net.toLocaleString()} USD</div>
                  </div>
                </div>

              </div>

              {/* Design Preview card (8 cols) */}
              <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
                <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-5 flex flex-col md:flex-row gap-5 items-center justify-center min-h-[320px]">
                  
                  {/* Outer physical item mockup rendering box */}
                  <div 
                    className="w-56 h-56 rounded-xl bg-white border border-neutral-200 shadow-lg relative overflow-hidden flex flex-col justify-between p-4 group select-none cursor-pointer"
                    onClick={() => generatedMerchImage && setLightboxImage(generatedMerchImage)}
                  >
                    {generatedMerchImage ? (
                      <>
                        <img 
                          src={generatedMerchImage} 
                          alt={merchBaseType} 
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                          <span className="bg-white/90 text-neutral-900 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-wider">
                            Full Size
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="absolute inset-x-0 mx-auto top-2 w-6 h-1.5 rounded-full bg-neutral-300 opacity-60"></div>
                        
                        <div className="flex-grow flex items-center justify-center relative">
                          <div className="w-28 h-28 rounded-full border border-neutral-100 flex items-center justify-center shadow-inner relative">
                            <div 
                              className="w-20 h-20 rounded-xl flex flex-col justify-between p-2 shadow-md shrink-0 transition-colors duration-500 animate-[pulse_6s_infinite]"
                              style={{
                                background: merchDyeColor.includes('Charcoal') ? '#27272a' : (merchDyeColor.includes('Ivory') ? '#f5f5f4' : mainHex)
                              }}
                            >
                              <span className="text-[5px] text-white/40 font-mono tracking-widest font-black uppercase">MOCKPRINT</span>
                              
                              <div className="text-center">
                                <span className="bg-white/10 text-white border border-white/10 px-1 py-0.5 rounded text-[5px] font-black block tracking-widest uppercase mb-0.5 max-w-[50px] mx-auto truncate">
                                  {groupProfile.groupName}
                                </span>
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mx-auto mt-1 animate-ping"></div>
                              </div>

                              <span className="text-[4px] text-white/50 text-right leading-none block">OFFICIAL</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-end font-sans font-black text-[6px] text-neutral-400 uppercase tracking-widest shrink-0">
                          <span>TYPE: {merchBaseType.split(' ').slice(-1)[0]}</span>
                          <span>MSRP: ${estimatedDrives.retail}.00</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Summary of production specs */}
                  <div className="flex-grow space-y-3 self-stretch flex flex-col justify-between w-full h-full">
                    <div className="space-y-2 bg-white p-4 border border-neutral-200 rounded-xl shadow-sm">
                      <div className="flex items-center gap-2">
                        <Star className="text-amber-500 w-4 h-4 shrink-0" />
                        <h4 className="font-black text-xs text-neutral-900 uppercase">Strategic Launch Analysis</h4>
                      </div>
                      
                      <p className="text-[9px] text-neutral-600 leading-relaxed font-semibold">
                        This limited-run <span className="text-neutral-950 font-black">"{merchBaseType}"</span> will be dyed in high-contrast <span className="text-neutral-950 font-black">"{merchDyeColor}"</span> to fit boutique fashion aesthetics. Artwork layout focuses on a <span className="text-emerald-700 font-extrabold">{merchGraphicPlacement}</span> layout. Production calculations project pre-orders breaching <span className="text-emerald-700 font-black">{estimatedDrives.demand.toLocaleString()} units</span>.
                      </p>
                    </div>

                    {merchGenError && (
                      <span className="text-[8px] text-rose-600 font-bold block">{merchGenError}</span>
                    )}

                    <div className="flex flex-col sm:flex-row gap-2">
                      <button 
                        onClick={() => {
                          if (isMerchLocked) {
                            setMerchGenError("🔒 Brand Assets Required: Please generate the Official Lightstick and Group Mascot first!");
                            return;
                          }
                          handleGenerateMerchMockup();
                        }}
                        disabled={isGeneratingMerch}
                        className={`flex-1 active:scale-95 text-white text-[8px] font-black uppercase py-2.5 rounded-full tracking-widest shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                          isMerchLocked
                            ? 'bg-amber-600/80 hover:bg-amber-600'
                            : 'bg-amber-600 hover:bg-amber-700'
                        }`}
                      >
                        {isGeneratingMerch ? (
                          <span className="animate-spin text-white">⚡</span>
                        ) : isMerchLocked ? (
                          <Lock className="w-3 h-3 text-white" />
                        ) : (
                          <Sparkles className="w-3 h-3 text-white" />
                        )}
                        <span>{isGeneratingMerch ? 'Generating Mockup...' : (isMerchLocked ? 'Assets Required to Generate' : '✨ Generate AI Merch Mockup')}</span>
                      </button>

                      {generatedMerchImage && (
                        <button 
                          onClick={handleAddMerchToStore}
                          className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-[8px] font-black uppercase py-2.5 px-4 rounded-full tracking-widest shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>+ Add to Fandom Store</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
          );
        })()}

      </div>

    </div>
  );
};
