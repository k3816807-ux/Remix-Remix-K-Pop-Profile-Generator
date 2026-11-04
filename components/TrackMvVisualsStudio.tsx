import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Sparkles, 
  Shirt, 
  Palette, 
  Camera, 
  Film, 
  Check, 
  Copy, 
  Download, 
  Maximize2, 
  X, 
  Wand2, 
  Users,
  Sparkle,
  Image as ImageIcon,
  Eye,
  Sliders,
  ChevronRight,
  RotateCcw,
  Trash2,
  RefreshCw,
  SlidersHorizontal,
  Lightbulb,
  Send,
  Dices,
  ExternalLink,
  UserCheck,
  AlertCircle,
  ArrowRight,
  Layers,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import type { Album, Track, GroupProfileData, MemberProfileData, TrackMvVisuals, MemberConceptOutfit, AiSongColorOption, StoryboardScene } from '../types';
import { 
  generateDefaultTrackMvVisuals, 
  generateAiTrackMvVisuals, 
  generateDynamicMemberOutfits,
  buildTrackGroupMvPhotoshootPrompt, 
  buildTrackMvStillPrompt, 
  buildStoryboardSceneStillPrompt,
  generateAiStoryboardSequence,
  buildMemberTrackOutfitPrompt,
  FASHION_STYLE_ARCHETYPES,
  KPOP_POPULAR_FASHION_STYLES,
  PopularFashionStyle,
  ALL_KPOP_FASHION_STYLES,
  UNIVERSAL_KPOP_STYLES,
  BOY_GROUP_STYLES,
  GIRL_GROUP_STYLES,
  KPOP_CONCEPTS,
  KPOP_STYLE_MIX_PRESETS,
  buildKpopOutfitFormula,
  type KpopStyleItem,
  type KpopConceptItem,
  type KpopStyleMixPreset,
  deriveVibrantSongSpecific3ColorPalette,
  generateAiSongColorPaletteOptions,
  generateDynamicSongColorOptions,
  isBoringColorPalette
} from '../services/profileDataHelper';
import { compositeGroupPhotoshoot } from '../services/photoshootCompositor';
import { generateImage } from '../services/geminiService';
import { normalizeColorPalette } from '../services/colorHelper';
import { 
  GEMINI_MODEL_IMAGE, 
  GEMINI_MODEL_IMAGE_FAST, 
  GEMINI_MODEL_IMAGE_LEGACY 
} from '../constants';
import { TrackPhotoshootTab } from './track-visuals/TrackPhotoshootTab';
import { TrackMemberOutfitsTab } from './track-visuals/TrackMemberOutfitsTab';
import { TrackStylingFormulaTab } from './track-visuals/TrackStylingFormulaTab';

interface TrackMvVisualsStudioProps {
  album: Album;
  albumIdx: number;
  tracks: Track[];
  groupProfile: GroupProfileData & { members?: MemberProfileData[] };
  activeTrackIndex: number;
  onSelectTrack: (idx: number) => void;
  onUpdateAlbum: (updatedAlbum: Album) => void;
  onNavigateToLineup?: () => void;
}

export const TrackMvVisualsStudio: React.FC<TrackMvVisualsStudioProps> = ({
  album,
  albumIdx,
  tracks,
  groupProfile,
  activeTrackIndex,
  onSelectTrack,
  onUpdateAlbum,
  onNavigateToLineup
}) => {
  const currentTrack = tracks[activeTrackIndex] || tracks[0];
  const members = groupProfile.members || [];

  // Local state for active track's visuals
  const [activeVisuals, setActiveVisuals] = useState<TrackMvVisuals>(() => {
    if (currentTrack?.mvVisuals) {
      return currentTrack.mvVisuals;
    }
    return generateDefaultTrackMvVisuals(
      currentTrack,
      groupProfile.groupName,
      members,
      groupProfile.officialColors
    );
  });

  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [isGeneratingGroupPhoto, setIsGeneratingGroupPhoto] = useState<boolean>(false);
  const [compositeProgressText, setCompositeProgressText] = useState<string>("");
  const [isGeneratingMvStill, setIsGeneratingMvStill] = useState<boolean>(false);
  const [generatingMemberIndex, setGeneratingMemberIndex] = useState<number | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<{ url: string; title: string; subtitle?: string } | null>(null);
  const [selectedMemberIdx, setSelectedMemberIdx] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto-dismiss stale error banner after 6s so it doesn't linger after images finish generating
  useEffect(() => {
    if (!errorMsg) return;
    const timer = setTimeout(() => setErrorMsg(null), 6000);
    return () => clearTimeout(timer);
  }, [errorMsg]);
  const [customDirectorNotes, setCustomDirectorNotes] = useState<string>("");
  const [showDirectorGuidance, setShowDirectorGuidance] = useState<boolean>(false);
  const [autoRefreshOutfitsOnGen, setAutoRefreshOutfitsOnGen] = useState<boolean>(true);
  const [variationSeed, setVariationSeed] = useState<number>(() => Date.now());
  const [activeStudioTab, setActiveStudioTab] = useState<'photoshoot' | 'outfits' | 'styling'>('photoshoot');
  const [selectedImageModel, setSelectedImageModel] = useState<string>(GEMINI_MODEL_IMAGE);
  const [strictFaceLikeness, setStrictFaceLikeness] = useState<boolean>(true);

  // K-pop Styling Taxonomy & Formula States: "Main Style + Secondary Style + Concept"
  const [styleCategoryFilter, setStyleCategoryFilter] = useState<'all' | 'universal' | 'boy_group' | 'girl_group'>('all');
  const [activeSecondaryStyle, setActiveSecondaryStyle] = useState<string>(() => activeVisuals.secondaryStyle || 'High Fashion / Editorial');
  const [activeConceptVibe, setActiveConceptVibe] = useState<string>(() => activeVisuals.conceptVibe || 'Confident / Swagger');
  const [stylingFormulaMode, setStylingFormulaMode] = useState<'presets' | 'builder'>('presets');

  // Setting Scenery Still & Storyboard Sequence States
  const [settingStillMode, setSettingStillMode] = useState<'with_members' | 'scenery_only'>('with_members');
  const [generatingSceneIdx, setGeneratingSceneIdx] = useState<number | null>(null);
  const [isRegeneratingStoryboard, setIsRegeneratingStoryboard] = useState(false);

  // AI-Derived Song-Meaning Color Options (Bespoke per song, zero presets)
  const [isGeneratingAiPalettes, setIsGeneratingAiPalettes] = useState<boolean>(false);
  const [aiPalettes, setAiPalettes] = useState<AiSongColorOption[]>(() => {
    if (activeVisuals.aiColorOptions && activeVisuals.aiColorOptions.length > 0) {
      return activeVisuals.aiColorOptions;
    }
    return generateDynamicSongColorOptions(currentTrack, activeVisuals.fashionStyle);
  });

  // Keep AI palettes synced when track changes
  useEffect(() => {
    if (!currentTrack) return;
    if (activeVisuals.aiColorOptions && activeVisuals.aiColorOptions.length > 0) {
      setAiPalettes(activeVisuals.aiColorOptions);
    } else {
      setAiPalettes(generateDynamicSongColorOptions(currentTrack, activeVisuals.fashionStyle));
    }
  }, [currentTrack?.title, activeVisuals.aiColorOptions]);

  // Detect group gender for targeted styling presets
  const hasMale = members.some(m => (m.gender || '').toLowerCase() === 'male');
  const hasFemale = members.some(m => (m.gender || '').toLowerCase() === 'female');
  const groupGenderTarget: 'all' | 'boy_group' | 'girl_group' = (hasMale && !hasFemale) ? 'boy_group' : (!hasMale && hasFemale ? 'girl_group' : 'all');

  // Sync state whenever track changes
  useEffect(() => {
    if (!currentTrack) return;
    if (currentTrack.mvVisuals) {
      let visualsToUse = currentTrack.mvVisuals;
      // Auto-detect and upgrade boring/cliché combinations (e.g. black/cream/burgundy, generic navy/white/red)
      // to dynamic song-specific vibrant colors derived from the Records page
      if (isBoringColorPalette(visualsToUse.threeColorPalette)) {
        const vibrantColors = deriveVibrantSongSpecific3ColorPalette(
          currentTrack,
          visualsToUse.fashionStyle || visualsToUse.mainStyle
        );
        const paletteStr = `${vibrantColors[0]}, ${vibrantColors[1]}, and ${vibrantColors[2]}`;
        const refreshedOutfits = generateDynamicMemberOutfits(
          currentTrack,
          paletteStr,
          members,
          Date.now(),
          undefined,
          visualsToUse.fashionStyle,
          vibrantColors,
          visualsToUse.secondaryStyle,
          visualsToUse.conceptVibe
        );
        visualsToUse = {
          ...visualsToUse,
          threeColorPalette: vibrantColors,
          songColorPalette: paletteStr,
          memberOutfits: refreshedOutfits
        };
        persistVisuals(visualsToUse, activeTrackIndex);
      }
      setActiveVisuals(visualsToUse);
      if (visualsToUse.secondaryStyle) {
        setActiveSecondaryStyle(visualsToUse.secondaryStyle);
      }
      if (visualsToUse.conceptVibe) {
        setActiveConceptVibe(visualsToUse.conceptVibe);
      }
    } else {
      const generated = generateDefaultTrackMvVisuals(
        currentTrack,
        groupProfile.groupName,
        members,
        groupProfile.officialColors
      );
      setActiveVisuals(generated);
      if (generated.secondaryStyle) {
        setActiveSecondaryStyle(generated.secondaryStyle);
      }
      if (generated.conceptVibe) {
        setActiveConceptVibe(generated.conceptVibe);
      }
      // Persist to album tracks
      persistVisuals(generated, activeTrackIndex);
    }
  }, [activeTrackIndex, album.title]);

  const persistVisuals = (visuals: TrackMvVisuals, trackIdx: number) => {
    const updatedTracks = [...(album.tracks || [])];
    if (updatedTracks[trackIdx]) {
      updatedTracks[trackIdx] = {
        ...updatedTracks[trackIdx],
        mvVisuals: visuals
      };
      onUpdateAlbum({
        ...album,
        tracks: updatedTracks
      });
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // AI Direct World & Outfits for this track (Accepts optional custom directorial guidance)
  const handleAiDirect = async (overrideGuidance?: string) => {
    if (!currentTrack) return;
    setIsGeneratingAi(true);
    setErrorMsg(null);
    try {
      const guidanceToUse = typeof overrideGuidance === 'string' ? overrideGuidance : customDirectorNotes;
      const result = await generateAiTrackMvVisuals(currentTrack, groupProfile, members, guidanceToUse);
      // Retain existing image URLs if already generated
      const merged: TrackMvVisuals = {
        ...result,
        groupPhotoUrl: activeVisuals.groupPhotoUrl,
        groupPhotoPrompt: activeVisuals.groupPhotoPrompt,
        mvStillUrl: activeVisuals.mvStillUrl,
        mvStillPrompt: activeVisuals.mvStillPrompt
      };
      setActiveVisuals(merged);
      persistVisuals(merged, activeTrackIndex);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to direct AI visuals. Please try again.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Clear / Reset the Full-Body Group MV Photoshoot image
  const handleClearGroupPhotoshoot = () => {
    const updated: TrackMvVisuals = {
      ...activeVisuals,
      groupPhotoUrl: undefined,
      groupPhotoPrompt: undefined
    };
    setActiveVisuals(updated);
    persistVisuals(updated, activeTrackIndex);
  };

  // Clear / Reset Scenery Still
  const handleClearMvStill = () => {
    const updated: TrackMvVisuals = {
      ...activeVisuals,
      mvStillUrl: undefined,
      mvStillPrompt: undefined
    };
    setActiveVisuals(updated);
    persistVisuals(updated, activeTrackIndex);
  };

  // Clear / Reset Storyboard Scene Frame
  const handleClearStoryboardScene = (sceneIndex: number) => {
    if (!activeVisuals.iconicSceneHighlights?.[sceneIndex]) return;
    const updatedScenes = [...activeVisuals.iconicSceneHighlights];
    updatedScenes[sceneIndex] = {
      ...updatedScenes[sceneIndex],
      imageUrl: undefined,
      imagePrompt: undefined
    };
    const updated: TrackMvVisuals = {
      ...activeVisuals,
      iconicSceneHighlights: updatedScenes
    };
    setActiveVisuals(updated);
    persistVisuals(updated, activeTrackIndex);
  };

  // Clear / Reset Individual Member Outfit Lookbook
  const handleClearMemberOutfit = (mIdx: number) => {
    const outfits = [...(activeVisuals.memberOutfits || [])];
    if (outfits[mIdx]) {
      outfits[mIdx] = {
        ...outfits[mIdx],
        outfitImageUrl: undefined,
        outfitImagePrompt: undefined
      };
      const updated: TrackMvVisuals = {
        ...activeVisuals,
        memberOutfits: outfits
      };
      setActiveVisuals(updated);
      persistVisuals(updated, activeTrackIndex);
    }
  };

  // Instantly shuffle and generate fresh coordinated K-pop capsule outfits across all members
  const handleShuffleOutfits = () => {
    if (!currentTrack) return;
    const nextSeed = Date.now() + Math.floor(Math.random() * 100000);
    setVariationSeed(nextSeed);
    const freshOutfits = generateDynamicMemberOutfits(
      currentTrack,
      activeVisuals.songColorPalette,
      members,
      nextSeed,
      customDirectorNotes,
      activeVisuals.fashionStyle,
      activeVisuals.threeColorPalette,
      activeSecondaryStyle,
      activeConceptVibe
    );
    const newPalette = freshOutfits[0]?.colorPalette || activeVisuals.songColorPalette;
    const updated: TrackMvVisuals = {
      ...activeVisuals,
      songColorPalette: newPalette,
      memberOutfits: freshOutfits
    };
    setActiveVisuals(updated);
    persistVisuals(updated, activeTrackIndex);
  };

  // Reset/Clear: Clears the current photoshoot image and immediately generates fresh coordinated outfit concepts
  const handleResetPhotoshootAndOutfits = () => {
    if (!currentTrack) return;
    const nextSeed = Date.now() + Math.floor(Math.random() * 100000);
    setVariationSeed(nextSeed);
    const freshOutfits = generateDynamicMemberOutfits(
      currentTrack,
      activeVisuals.songColorPalette,
      members,
      nextSeed,
      customDirectorNotes,
      activeVisuals.fashionStyle,
      activeVisuals.threeColorPalette,
      activeSecondaryStyle,
      activeConceptVibe
    );
    const newPalette = freshOutfits[0]?.colorPalette || activeVisuals.songColorPalette;
    const updated: TrackMvVisuals = {
      ...activeVisuals,
      groupPhotoUrl: undefined,
      groupPhotoPrompt: undefined,
      songColorPalette: newPalette,
      memberOutfits: freshOutfits
    };
    setActiveVisuals(updated);
    persistVisuals(updated, activeTrackIndex);
  };

  // Apply an iconic preset formula: "Main Style + Secondary Style + Concept"
  const handleApplyStyleMixPreset = (preset: KpopStyleMixPreset) => {
    if (!currentTrack) return;
    const nextSeed = Date.now() + Math.floor(Math.random() * 100000);
    setVariationSeed(nextSeed);

    const styleObj = KPOP_POPULAR_FASHION_STYLES.find(
      s => s.name.toLowerCase() === preset.mainStyle.toLowerCase() || s.id.toLowerCase() === preset.mainStyle.toLowerCase()
    ) || KPOP_POPULAR_FASHION_STYLES[0];

    const threeColors: [string, string, string] = preset.recommendedColors || (
      styleObj.palettes && styleObj.palettes[0]
        ? [styleObj.palettes[0].baseColor, styleObj.palettes[0].secondaryColor, styleObj.palettes[0].accentColor]
        : ['Midnight Navy', 'Chalk White', 'Crimson Red']
    );

    const formula = buildKpopOutfitFormula(styleObj.name, preset.secondaryStyle, preset.concept);
    const songColorPalette = `${threeColors[0]}, ${threeColors[1]}, and ${threeColors[2]}`;

    const freshOutfits = generateDynamicMemberOutfits(
      currentTrack,
      songColorPalette,
      members,
      nextSeed,
      customDirectorNotes,
      styleObj.id,
      threeColors,
      preset.secondaryStyle,
      preset.concept
    );

    setActiveSecondaryStyle(preset.secondaryStyle);
    setActiveConceptVibe(preset.concept);

    const updated: TrackMvVisuals = {
      ...activeVisuals,
      fashionStyle: styleObj.name,
      mainStyle: styleObj.name,
      secondaryStyle: preset.secondaryStyle,
      conceptVibe: preset.concept,
      stylingFormula: formula,
      threeColorPalette: threeColors,
      songColorPalette,
      memberOutfits: freshOutfits,
      groupOutfitConceptSummary: `Styling Formula: ${formula}. Cohesive K-pop stage outfits tailored to "${currentTrack.title}" in vibrant 3-color scheme: ${songColorPalette}, preserving each member's authentic face and signature hairstyle.`
    };
    setActiveVisuals(updated);
    persistVisuals(updated, activeTrackIndex);
  };

  // Change Main Fashion Style
  const handleSelectFashionStyle = (style: PopularFashionStyle) => {
    if (!currentTrack) return;
    const nextSeed = Date.now() + Math.floor(Math.random() * 100000);
    setVariationSeed(nextSeed);
    const selectedPalette = style.palettes[0];
    const threeColors: [string, string, string] = selectedPalette
      ? [selectedPalette.baseColor, selectedPalette.secondaryColor, selectedPalette.accentColor]
      : (activeVisuals.threeColorPalette as [string, string, string] || ['Midnight Navy', 'Chalk White', 'Crimson Red']);
    const paletteString = selectedPalette?.paletteString || `${threeColors[0]}, ${threeColors[1]}, and ${threeColors[2]}`;

    const secondary = activeSecondaryStyle || activeVisuals.secondaryStyle || 'High Fashion / Editorial';
    const concept = activeConceptVibe || activeVisuals.conceptVibe || (groupGenderTarget === 'boy_group' ? 'Bad Boy' : 'Girl Crush');
    const formula = buildKpopOutfitFormula(style.name, secondary, concept);

    const freshOutfits = generateDynamicMemberOutfits(
      currentTrack,
      paletteString,
      members,
      nextSeed,
      customDirectorNotes,
      style.id,
      threeColors,
      secondary,
      concept
    );
    const updated: TrackMvVisuals = {
      ...activeVisuals,
      fashionStyle: style.name,
      mainStyle: style.name,
      secondaryStyle: secondary,
      conceptVibe: concept,
      stylingFormula: formula,
      threeColorPalette: threeColors,
      songColorPalette: paletteString,
      memberOutfits: freshOutfits
    };
    setActiveVisuals(updated);
    persistVisuals(updated, activeTrackIndex);
  };

  // Change Secondary Style Accent
  const handleSelectSecondaryStyle = (secondary: string) => {
    if (!currentTrack) return;
    const nextSeed = Date.now() + Math.floor(Math.random() * 100000);
    setVariationSeed(nextSeed);
    setActiveSecondaryStyle(secondary);

    const currentStyleName = activeVisuals.mainStyle || activeVisuals.fashionStyle || 'Preppy';
    const currentConcept = activeConceptVibe || activeVisuals.conceptVibe || 'Confident / Swagger';
    const formula = buildKpopOutfitFormula(currentStyleName, secondary, currentConcept);

    const freshOutfits = generateDynamicMemberOutfits(
      currentTrack,
      activeVisuals.songColorPalette,
      members,
      nextSeed,
      customDirectorNotes,
      activeVisuals.fashionStyle,
      activeVisuals.threeColorPalette,
      secondary,
      currentConcept
    );
    const updated: TrackMvVisuals = {
      ...activeVisuals,
      secondaryStyle: secondary,
      stylingFormula: formula,
      memberOutfits: freshOutfits
    };
    setActiveVisuals(updated);
    persistVisuals(updated, activeTrackIndex);
  };

  // Change Concept / Attitude Lens
  const handleSelectConcept = (concept: KpopConceptItem) => {
    if (!currentTrack) return;
    const nextSeed = Date.now() + Math.floor(Math.random() * 100000);
    setVariationSeed(nextSeed);
    setActiveConceptVibe(concept.name);

    const currentStyleName = activeVisuals.mainStyle || activeVisuals.fashionStyle || 'Preppy';
    const currentSecondary = activeSecondaryStyle || activeVisuals.secondaryStyle || 'High Fashion / Editorial';
    const formula = buildKpopOutfitFormula(currentStyleName, currentSecondary, concept.name);

    const freshOutfits = generateDynamicMemberOutfits(
      currentTrack,
      activeVisuals.songColorPalette,
      members,
      nextSeed,
      customDirectorNotes,
      activeVisuals.fashionStyle,
      activeVisuals.threeColorPalette,
      currentSecondary,
      concept.name
    );
    const updated: TrackMvVisuals = {
      ...activeVisuals,
      conceptVibe: concept.name,
      stylingFormula: formula,
      memberOutfits: freshOutfits
    };
    setActiveVisuals(updated);
    persistVisuals(updated, activeTrackIndex);
  };

  // Select a specific curated 3-color palette directly
  const handleSelect3ColorPalette = (colors: [string, string, string]) => {
    if (!currentTrack) return;
    const nextSeed = Date.now() + Math.floor(Math.random() * 100000);
    setVariationSeed(nextSeed);
    const paletteStr = `${colors[0]}, ${colors[1]}, and ${colors[2]}`;

    const freshOutfits = generateDynamicMemberOutfits(
      currentTrack,
      paletteStr,
      members,
      nextSeed,
      customDirectorNotes,
      activeVisuals.fashionStyle,
      colors,
      activeSecondaryStyle,
      activeConceptVibe
    );
    const updated: TrackMvVisuals = {
      ...activeVisuals,
      songColorPalette: paletteStr,
      threeColorPalette: colors,
      memberOutfits: freshOutfits
    };
    setActiveVisuals(updated);
    persistVisuals(updated, activeTrackIndex);
  };

  // Dynamically analyze the song's meaning, title, description, and lyrics from the Records page
  const handleApplySongSpecificPalette = (seedOffset: number = 0) => {
    if (!currentTrack) return;
    const nextSeed = Date.now() + seedOffset + Math.floor(Math.random() * 10000);
    setVariationSeed(nextSeed);
    const vibrantColors = deriveVibrantSongSpecific3ColorPalette(
      currentTrack,
      activeVisuals.fashionStyle || activeVisuals.mainStyle,
      nextSeed
    );
    const paletteStr = `${vibrantColors[0]}, ${vibrantColors[1]}, and ${vibrantColors[2]}`;
    const freshOutfits = generateDynamicMemberOutfits(
      currentTrack,
      paletteStr,
      members,
      nextSeed,
      customDirectorNotes,
      activeVisuals.fashionStyle,
      vibrantColors,
      activeSecondaryStyle,
      activeConceptVibe
    );
    const updated: TrackMvVisuals = {
      ...activeVisuals,
      songColorPalette: paletteStr,
      threeColorPalette: vibrantColors,
      memberOutfits: freshOutfits
    };
    setActiveVisuals(updated);
    persistVisuals(updated, activeTrackIndex);
  };

  // Calls AI to analyze the song's meaning and lyrics from the Records page to generate 4 bespoke 3-color palette options
  const handleGenerateAiSongPalettes = async () => {
    if (!currentTrack || isGeneratingAiPalettes) return;
    setIsGeneratingAiPalettes(true);
    try {
      const options = await generateAiSongColorPaletteOptions(
        currentTrack,
        groupProfile,
        activeVisuals.fashionStyle || activeVisuals.mainStyle
      );
      setAiPalettes(options);
      const updated: TrackMvVisuals = {
        ...activeVisuals,
        aiColorOptions: options
      };
      setActiveVisuals(updated);
      persistVisuals(updated, activeTrackIndex);
    } catch (err) {
      console.error("Failed to generate AI song palettes:", err);
    } finally {
      setIsGeneratingAiPalettes(false);
    }
  };

  // Cycle to the next curated 3-color palette for the current fashion style or song theme
  const handleCycle3ColorPalette = () => {
    if (!currentTrack) return;
    const currentStyleObj = KPOP_POPULAR_FASHION_STYLES.find(
      s => s.name.toLowerCase() === (activeVisuals.fashionStyle || '').toLowerCase()
    ) || KPOP_POPULAR_FASHION_STYLES[0];

    const currentPaletteIndex = currentStyleObj.palettes.findIndex(
      p => p.paletteString.toLowerCase() === (activeVisuals.songColorPalette || '').toLowerCase()
    );
    const nextIdx = (currentPaletteIndex + 1) % (currentStyleObj.palettes.length || 1);
    const nextPalette = currentStyleObj.palettes[nextIdx];
    let next3Colors: [string, string, string] = nextPalette ? [
      nextPalette.baseColor,
      nextPalette.secondaryColor,
      nextPalette.accentColor
    ] : deriveVibrantSongSpecific3ColorPalette(currentTrack, currentStyleObj.id, Date.now());

    // Strict check: if somehow a boring combination was selected, fallback to dynamic song derivation
    if (isBoringColorPalette(next3Colors)) {
      next3Colors = deriveVibrantSongSpecific3ColorPalette(currentTrack, currentStyleObj.id, Date.now() + 1);
    }

    const nextSeed = Date.now() + Math.floor(Math.random() * 100000);
    setVariationSeed(nextSeed);
    const paletteStr = `${next3Colors[0]}, ${next3Colors[1]}, and ${next3Colors[2]}`;
    const freshOutfits = generateDynamicMemberOutfits(
      currentTrack,
      paletteStr,
      members,
      nextSeed,
      customDirectorNotes,
      currentStyleObj.id,
      next3Colors,
      activeSecondaryStyle,
      activeConceptVibe
    );
    const updated: TrackMvVisuals = {
      ...activeVisuals,
      songColorPalette: paletteStr,
      threeColorPalette: next3Colors,
      memberOutfits: freshOutfits
    };
    setActiveVisuals(updated);
    persistVisuals(updated, activeTrackIndex);
  };

  // =========================================================================
  // HIGH-RESOLUTION GROUP MV PHOTOSHOOT PIPELINE:
  // Step 1: Generate individual full-body photo for each member (preserving exact face & hairstyle from Lineup tab)
  // Step 2: Combine them seamlessly into a unified 16:9 stage photoshoot using the Canvas Compositor
  // =========================================================================
  const handleCompositeGroupPhotoshoot = async (forceRerenderAllMembers: boolean = false) => {
    if (!currentTrack || members.length === 0) return;
    setIsGeneratingGroupPhoto(true);
    setErrorMsg(null);
    setCompositeProgressText("Initializing group photoshoot pipeline...");

    try {
      const updatedOutfits = [...(activeVisuals.memberOutfits || [])];
      const memberPhotoItems: { stageName: string; photoUrl: string; koreanName?: string }[] = [];

      // Step 0: Ensure Backdrop Scenery Still exists (or generate it) for realistic environmental lighting
      let backdropUrl = activeVisuals.mvStillUrl;
      if (!backdropUrl) {
        setCompositeProgressText(`Rendering 16:9 MV Environment Setting (${activeVisuals.settingName})...`);
        const stillPrompt = buildTrackMvStillPrompt(
          currentTrack,
          activeVisuals,
          groupProfile.groupName,
          groupProfile.agency
        );
        try {
          const bgImg = await generateImage(stillPrompt, "16:9");
          backdropUrl = bgImg;
          const withBg: TrackMvVisuals = {
            ...activeVisuals,
            mvStillUrl: bgImg,
            mvStillPrompt: stillPrompt
          };
          setActiveVisuals(withBg);
          persistVisuals(withBg, activeTrackIndex);
        } catch (bgErr) {
          console.warn("Could not generate backdrop, proceeding with dynamic studio lighting backdrop:", bgErr);
        }
      }

      // Step 1: Render individual full-body image for each member using their Lineup profile image reference
      for (let i = 0; i < members.length; i++) {
        const member = members[i];
        let outfit = updatedOutfits[i];
        if (!outfit) {
          const fresh = generateDynamicMemberOutfits(
            currentTrack,
            activeVisuals.songColorPalette,
            [member],
            variationSeed + i,
            customDirectorNotes,
            activeVisuals.fashionStyle,
            activeVisuals.threeColorPalette
          )[0];
          outfit = fresh;
          updatedOutfits[i] = fresh;
        }

        let photoUrl = (!forceRerenderAllMembers && outfit.outfitImageUrl) ? outfit.outfitImageUrl : null;

        if (!photoUrl) {
          setCompositeProgressText(
            `Generating individual full-body photo for ${member.stageName} (${i + 1}/${members.length}) [Preserving face & hairstyle from Lineup tab]...`
          );

          const prompt = buildMemberTrackOutfitPrompt(
            member,
            outfit,
            currentTrack.title,
            groupProfile.groupName,
            activeVisuals.settingName,
            activeVisuals.fashionStyle,
            activeVisuals.threeColorPalette
          );

          // Find reference image strictly from Lineup profile photo: prioritize official face portrait
          const refImages: { label: string; dataUrl: string }[] = [];
          if (member.imageUrl) {
            refImages.push({
              label: `EXACT OFFICIAL FACE PORTRAIT: ${member.stageName} (Preserve this exact face, eyelid shape, nose, lips, and jawline 100%)`,
              dataUrl: member.imageUrl
            });
          }
          if (member.fullBodyImages && member.fullBodyImages.length > 0 && member.fullBodyImages[0] !== member.imageUrl) {
            refImages.push({
              label: `Body Silhouette & Height Reference for ${member.stageName}`,
              dataUrl: member.fullBodyImages[0]
            });
          }

          const generatedUrl = await generateImage(
            prompt, 
            "3:4", 
            refImages.length > 0 ? refImages : undefined,
            { model: selectedImageModel, imageSize: '1K', strictFaceLikeness }
          );
          photoUrl = generatedUrl;
          outfit = {
            ...outfit,
            outfitImageUrl: generatedUrl,
            outfitImagePrompt: prompt
          };
          updatedOutfits[i] = outfit;

          // Incrementally update UI so user sees each member rendered live
          setActiveVisuals(prev => ({
            ...prev,
            memberOutfits: [...updatedOutfits]
          }));
        }

        memberPhotoItems.push({
          stageName: member.stageName,
          photoUrl: photoUrl,
          koreanName: member.koreanName
        });
      }

      // Step 2: Combine all individual member photos onto the 16:9 stage backdrop using the compositor
      setCompositeProgressText(`Compositing all ${members.length} members onto wide-angle 16:9 MV stage...`);

      const finalComposite = await compositeGroupPhotoshoot({
        members: memberPhotoItems,
        backdropUrl: backdropUrl,
        settingName: activeVisuals.settingName,
        settingDescription: activeVisuals.settingDescription,
        groupName: groupProfile.groupName,
        trackTitle: currentTrack.title,
        fashionStyle: activeVisuals.fashionStyle || 'High-Fashion Stage Styling',
        threeColorPalette: activeVisuals.threeColorPalette || ['Midnight Navy', 'Chalk White', 'Crimson Red']
      });

      const finalized: TrackMvVisuals = {
        ...activeVisuals,
        memberOutfits: updatedOutfits,
        groupPhotoUrl: finalComposite,
        groupPhotoPrompt: `Composite MV Stage Photoshoot: Combining individual full-body renders of ${members.map(m => m.stageName).join(', ')} with exact faces & hairstyles preserved from Lineup tab, styled in ${activeVisuals.fashionStyle || 'High-Fashion'} with 3-color scheme (${activeVisuals.songColorPalette}).`
      };

      setActiveVisuals(finalized);
      persistVisuals(finalized, activeTrackIndex);
      setErrorMsg(null);
    } catch (err: any) {
      console.error("Group Composite Error:", err);
      setErrorMsg(err.message || "Failed to composite group photoshoot. Please try again.");
    } finally {
      setIsGeneratingGroupPhoto(false);
      setCompositeProgressText("");
    }
  };

  // Instant re-compositing of already existing member images (runs in ~200ms without calling AI image gen)
  const handleRecombineExistingPhotos = async () => {
    if (!currentTrack || members.length === 0) return;
    const memberPhotoItems: { stageName: string; photoUrl: string; koreanName?: string }[] = [];
    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      const outfit = activeVisuals.memberOutfits?.[i];
      const photo = outfit?.outfitImageUrl || member.imageUrl;
      if (photo) {
        memberPhotoItems.push({
          stageName: member.stageName,
          photoUrl: photo,
          koreanName: member.koreanName
        });
      }
    }

    if (memberPhotoItems.length === 0) {
      setErrorMsg("No individual member photos found to combine yet. Click 'Generate All Member Photos & Combine' to render them.");
      return;
    }

    setIsGeneratingGroupPhoto(true);
    setCompositeProgressText(`Re-compositing ${memberPhotoItems.length} member photos onto stage...`);
    try {
      const finalComposite = await compositeGroupPhotoshoot({
        members: memberPhotoItems,
        backdropUrl: activeVisuals.mvStillUrl,
        settingName: activeVisuals.settingName,
        settingDescription: activeVisuals.settingDescription,
        groupName: groupProfile.groupName,
        trackTitle: currentTrack.title,
        fashionStyle: activeVisuals.fashionStyle || 'High-Fashion Stage Styling',
        threeColorPalette: activeVisuals.threeColorPalette || ['Midnight Navy', 'Chalk White', 'Crimson Red']
      });
      const updated: TrackMvVisuals = {
        ...activeVisuals,
        groupPhotoUrl: finalComposite
      };
      setActiveVisuals(updated);
      persistVisuals(updated, activeTrackIndex);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to re-combine photos.");
    } finally {
      setIsGeneratingGroupPhoto(false);
      setCompositeProgressText("");
    }
  };

  // Direct AI Single-Pass Photoshoot (Alternative option for direct diffusion generation)
  const handleRenderGroupMvPhotoshootDirect = async () => {
    if (!currentTrack) return;
    setIsGeneratingGroupPhoto(true);
    setErrorMsg(null);
    setCompositeProgressText("Rendering direct AI group photoshoot with Lineup references...");
    try {
      const nextSeed = Date.now() + Math.floor(Math.random() * 100000);
      setVariationSeed(nextSeed);

      const prompt = buildTrackGroupMvPhotoshootPrompt(
        currentTrack,
        activeVisuals,
        groupProfile,
        members,
        customDirectorNotes,
        nextSeed
      );

      // Collect image references strictly from the Lineup tab member profiles: prioritize official face portraits
      const refImages: { label: string; dataUrl: string }[] = [];
      members.forEach((m, idx) => {
        const refImg = m.imageUrl || (m.fullBodyImages && m.fullBodyImages.length > 0 ? m.fullBodyImages[0] : undefined);
        if (refImg) {
          refImages.push({
            label: `Official Face Reference Portrait [MEMBER ${idx + 1}]: ${m.stageName} (Preserve this exact face, eyes, nose, lips, jawline, and hairstyle 100%)`,
            dataUrl: refImg
          });
        }
      });

      const img = await generateImage(
        prompt, 
        "16:9", 
        refImages.length > 0 ? refImages : undefined,
        { model: selectedImageModel, imageSize: '1K', strictFaceLikeness }
      );

      const updated: TrackMvVisuals = {
        ...activeVisuals,
        groupPhotoUrl: img,
        groupPhotoPrompt: prompt
      };
      setActiveVisuals(updated);
      persistVisuals(updated, activeTrackIndex);
      setErrorMsg(null);
    } catch (err: any) {
      console.error("Direct Photoshoot Error:", err);
      setErrorMsg(err.message || "Failed to generate group photoshoot.");
    } finally {
      setIsGeneratingGroupPhoto(false);
      setCompositeProgressText("");
    }
  };

  // Render 4K Setting Scenery Still (16:9)
  const handleRenderMvStill = async () => {
    if (!currentTrack) return;
    setIsGeneratingMvStill(true);
    setErrorMsg(null);
    try {
      const prompt = buildTrackMvStillPrompt(
        currentTrack,
        activeVisuals,
        groupProfile.groupName,
        groupProfile.agency,
        members,
        settingStillMode
      );

      const refImages: any[] = [];
      if (settingStillMode === 'with_members') {
        members.forEach((m, idx) => {
          if (m.imageUrl) {
            refImages.push({ 
              label: `[REFERENCE PORTRAIT ${idx + 1}: ${m.stageName}] Official Face & Hair`, 
              dataUrl: m.imageUrl 
            });
          }
        });
      }
      if (groupProfile.logoUrl) {
        refImages.push({ label: `${groupProfile.groupName} Official Logo`, dataUrl: groupProfile.logoUrl });
      }

      const img = await generateImage(
        prompt, 
        "16:9", 
        refImages.length > 0 ? refImages : undefined,
        { model: selectedImageModel, imageSize: '1K', strictFaceLikeness }
      );
      
      const updated: TrackMvVisuals = {
        ...activeVisuals,
        mvStillUrl: img,
        mvStillPrompt: prompt
      };
      setActiveVisuals(updated);
      persistVisuals(updated, activeTrackIndex);
      setErrorMsg(null);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to generate MV scenery still.");
    } finally {
      setIsGeneratingMvStill(false);
    }
  };

  // Render individual 16:9 Storyboard Scene Frame with specific featured members
  const handleRenderStoryboardScene = async (sceneIndex: number) => {
    if (!currentTrack || !activeVisuals.iconicSceneHighlights?.[sceneIndex]) return;
    const scene = activeVisuals.iconicSceneHighlights[sceneIndex];
    setGeneratingSceneIdx(sceneIndex);
    setErrorMsg(null);
    try {
      const { prompt, featuredMemberProfiles } = buildStoryboardSceneStillPrompt(
        scene,
        sceneIndex,
        currentTrack,
        activeVisuals,
        groupProfile.groupName,
        groupProfile.agency,
        members
      );

      const refImages: any[] = [];
      featuredMemberProfiles.forEach((m, idx) => {
        if (m.imageUrl) {
          refImages.push({
            label: `[IDOL ${idx + 1}: ${m.stageName}] Official Reference Portrait`,
            dataUrl: m.imageUrl
          });
        }
      });
      if (groupProfile.logoUrl) {
        refImages.push({ label: `${groupProfile.groupName} Official Logo`, dataUrl: groupProfile.logoUrl });
      }

      const img = await generateImage(
        prompt, 
        "16:9", 
        refImages.length > 0 ? refImages : undefined,
        { model: selectedImageModel, imageSize: '1K', strictFaceLikeness }
      );

      const updatedScenes = [...(activeVisuals.iconicSceneHighlights || [])];
      updatedScenes[sceneIndex] = {
        ...updatedScenes[sceneIndex],
        imageUrl: img,
        imagePrompt: prompt
      };

      const updated: TrackMvVisuals = {
        ...activeVisuals,
        iconicSceneHighlights: updatedScenes
      };
      setActiveVisuals(updated);
      persistVisuals(updated, activeTrackIndex);
      setErrorMsg(null);
    } catch (err: any) {
      console.error("Storyboard Scene Render Error:", err);
      setErrorMsg(err.message || `Failed to render frame for Scene ${sceneIndex + 1}.`);
    } finally {
      setGeneratingSceneIdx(null);
    }
  };

  // Regenerate member-accurate storyboard sequence
  const handleRegenerateStoryboard = async () => {
    if (!currentTrack) return;
    setIsRegeneratingStoryboard(true);
    setErrorMsg(null);
    try {
      const freshScenes = await generateAiStoryboardSequence(
        currentTrack,
        groupProfile,
        members,
        activeVisuals,
        customDirectorNotes
      );
      const updated: TrackMvVisuals = {
        ...activeVisuals,
        iconicSceneHighlights: freshScenes
      };
      setActiveVisuals(updated);
      persistVisuals(updated, activeTrackIndex);
    } catch (err: any) {
      console.error("Storyboard Regeneration Error:", err);
      setErrorMsg(err.message || "Failed to regenerate storyboard sequence.");
    } finally {
      setIsRegeneratingStoryboard(false);
    }
  };

  // Render Member Outfit Lookbook (3:4)
  const handleRenderMemberOutfit = async (mIdx: number) => {
    const member = members[mIdx];
    const outfit = activeVisuals.memberOutfits?.[mIdx];
    if (!member || !outfit || !currentTrack) return;

    setGeneratingMemberIndex(mIdx);
    setErrorMsg(null);
    try {
      const prompt = buildMemberTrackOutfitPrompt(
        member,
        outfit,
        currentTrack.title,
        groupProfile.groupName,
        activeVisuals.settingName,
        activeVisuals.fashionStyle,
        activeVisuals.threeColorPalette
      );

      const refImages: any[] = [];
      if (member.imageUrl) {
        refImages.push({ 
          label: `EXACT FACE PORTRAIT: ${member.stageName} (Preserve this exact face, eyelid shape, nose, lips, and bone structure 100%)`, 
          dataUrl: member.imageUrl 
        });
      }
      if (member.fullBodyImages && member.fullBodyImages.length > 0 && member.fullBodyImages[0] !== member.imageUrl) {
        refImages.push({ 
          label: `Body Silhouette & Height Reference for ${member.stageName}`, 
          dataUrl: member.fullBodyImages[0] 
        });
      }

      const img = await generateImage(
        prompt, 
        "3:4", 
        refImages.length > 0 ? refImages : undefined,
        { model: selectedImageModel, imageSize: '1K', strictFaceLikeness }
      );

      const updatedOutfits = [...(activeVisuals.memberOutfits || [])];
      updatedOutfits[mIdx] = {
        ...outfit,
        outfitImageUrl: img,
        outfitImagePrompt: prompt
      };

      const updated: TrackMvVisuals = {
        ...activeVisuals,
        memberOutfits: updatedOutfits
      };
      setActiveVisuals(updated);
      persistVisuals(updated, activeTrackIndex);
      setErrorMsg(null);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || `Failed to generate outfit lookbook for ${member.stageName}.`);
    } finally {
      setGeneratingMemberIndex(null);
    }
  };

  // Build complete export summary
  const getFullProductionBrief = (): string => {
    if (!currentTrack) return "";
    let brief = `=====================================================
CINEMATIC MV & STYLING PRODUCTION BRIEF: "${currentTrack.title}"
ARTIST: ${groupProfile.groupName} (${groupProfile.agency})
ALBUM: ${album.title} (${album.type})
TRACK ROLE: ${currentTrack.role} | GENRE: ${currentTrack.genre}
=====================================================

[1. MV ENVIRONMENT & LOCATION SETTING]
• LOCATION: ${activeVisuals.settingName}
• ARCHITECTURE & TEXTURES: ${activeVisuals.settingDescription}
• SONG-SPECIFIC COLOR PALETTE: ${activeVisuals.songColorPalette || 'Song-specific custom tones'}
• COLOR GRADING & ATMOSPHERE: ${activeVisuals.colorGradingAndAtmosphere}
• CINEMATIC VIBE: ${activeVisuals.cinematicVibe}
• KEY VISUAL MOTIFS: ${activeVisuals.keyVisualMotifs?.join(', ') || 'N/A'}
• CAMERAWORK & LIGHTING: ${activeVisuals.cameraWorkAndLighting}

[2. GROUP OUTFIT STYLING DIRECTION]
${activeVisuals.groupOutfitConceptSummary || 'High-fashion, runway-ready K-pop stage outfits tailored to the track vibe.'}

[3. MEMBER-BY-MEMBER BESPOKE CONCEPT OUTFITS & COMEBACK HAIRSTYLES]
`;
    activeVisuals.memberOutfits?.forEach((o) => {
      brief += `\n=========================================
MEMBER: ${o.memberName}
OUTFIT TITLE: "${o.outfitTitle}"
• COMEBACK HAIRSTYLE: ${o.songHairStyle || 'Song-specific styling'}
• COMEBACK HAIR COLOR: ${o.songHairColor || 'Bespoke dye'}
• GARMENTS & SILHOUETTE: ${o.clothingDetails}
• SONG COLOR PALETTE: ${o.colorPalette}
• HAIR & MAKEUP: ${o.hairAndMakeup}
• SIGNATURE ACCESSORIES: ${o.keyAccessories?.join(', ')}
• VIBE & PRESENCE: ${o.visualVibe}
`;
    });

    brief += `\n[4. SCENE HIGHLIGHTS & STORYBOARD SEQUENCE]\n`;
    activeVisuals.iconicSceneHighlights?.forEach((s, idx) => {
      brief += `\n• SCENE ${idx + 1} (${s.timestamp}): [${s.title}]\n  ${s.visualAction}\n`;
    });

    return brief;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header / Track Navigator */}
      <div className="bg-neutral-950 text-white p-5 rounded-2xl border border-neutral-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[7.5px] font-mono uppercase tracking-widest text-emerald-400 font-black">
                  ALBUM MV & OUTFIT DIRECTING STUDIO
                </span>
                <span className="px-1.5 py-0.2 rounded bg-neutral-800 text-[6.5px] font-mono text-neutral-400">
                  {album.title}
                </span>
              </div>
              <h3 className="text-sm font-black uppercase text-white tracking-wide">
                Track-By-Track MV Setting Look & Concept Outfits
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleAiDirect}
              disabled={isGeneratingAi}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-full text-[8.5px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
              title="Generate fresh bespoke AI MV concept and outfits for this track"
            >
              {isGeneratingAi ? (
                <Sparkles className="w-3.5 h-3.5 animate-spin text-white" />
              ) : (
                <Wand2 className="w-3.5 h-3.5" />
              )}
              <span>{isGeneratingAi ? 'Directing...' : 'AI Direct Song MV & Outfits'}</span>
            </button>

            <button
              onClick={() => handleCopy(getFullProductionBrief(), 'full-production-brief')}
              className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-1.5 rounded-full text-[8.5px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border border-neutral-700"
              title="Copy Complete MV & Styling Production Brief"
            >
              {copiedKey === 'full-production-brief' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-neutral-400" />
              )}
              <span>{copiedKey === 'full-production-brief' ? 'Copied Brief' : 'Export Brief'}</span>
            </button>
          </div>
        </div>

        {/* Track Carousel Pills */}
        <div className="space-y-1.5">
          <span className="text-[7px] font-mono font-bold text-neutral-400 uppercase tracking-widest block">
            SELECT TRACK TO VIEW SPECIFIC MV LOCATION & OUTFITS:
          </span>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-neutral-700">
            {tracks.map((track, idx) => {
              const isSelected = idx === activeTrackIndex;
              return (
                <button
                  key={idx}
                  onClick={() => onSelectTrack(idx)}
                  className={`px-3.5 py-2 rounded-xl text-left transition-all shrink-0 cursor-pointer border flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-md'
                      : 'bg-neutral-900/90 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-[9px] font-black font-mono ${
                    isSelected ? 'bg-emerald-500 text-neutral-950' : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9.5px] font-black uppercase truncate max-w-[130px] text-white">
                        {track.title}
                      </span>
                      {track.role === 'Title Track' && (
                        <span className="px-1 py-0.2 rounded bg-rose-500/20 text-rose-300 text-[6px] font-black uppercase font-mono">
                          TITLE
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[7px] text-neutral-400 font-mono">
                      <span>{track.genre || 'K-Pop'}</span>
                      <span>•</span>
                      <span>{track.duration}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-[9px] font-medium flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="text-rose-500 hover:text-rose-700">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

            {/* Studio View Mode Switcher / Tab Bar */}
      <div className="bg-neutral-900 p-2.5 rounded-2xl border border-neutral-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
          <button
            onClick={() => setActiveStudioTab("photoshoot")}
            className={`px-3.5 py-2 rounded-xl text-[8.5px] font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeStudioTab === "photoshoot"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800/80"
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Group Photoshoot & MV Scene</span>
            {activeVisuals.groupPhotoUrl && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" title="Photoshoot ready" />
            )}
          </button>

          <button
            onClick={() => setActiveStudioTab("outfits")}
            className={`px-3.5 py-2 rounded-xl text-[8.5px] font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeStudioTab === "outfits"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800/80"
            }`}
          >
            <Shirt className="w-3.5 h-3.5" />
            <span>Member Outfits Lookbook</span>
            <span className={`px-1.5 py-0.2 rounded text-[6.5px] font-mono font-bold ${
              activeStudioTab === "outfits" ? "bg-purple-800 text-purple-100" : "bg-neutral-800 text-neutral-400"
            }`}>
              {members.length}
            </span>
          </button>

          <button
            onClick={() => setActiveStudioTab("styling")}
            className={`px-3.5 py-2 rounded-xl text-[8.5px] font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeStudioTab === "styling"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800/80"
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Style Formula & Colors</span>
            <span className={`px-1.5 py-0.2 rounded text-[6.5px] font-mono font-bold uppercase truncate max-w-[85px] ${
              activeStudioTab === "styling" ? "bg-amber-800 text-amber-100" : "bg-neutral-800 text-neutral-400"
            }`}>
              {activeVisuals.fashionStyle || "Casual"}
            </span>
          </button>
        </div>

        {/* Quick Context Strip in Tab Bar */}
        <div className="flex items-center gap-2 px-2 text-[7.5px] font-mono text-neutral-400 shrink-0">
          <span className="text-neutral-300 font-bold">{currentTrack?.title}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            {normalizeColorPalette(activeVisuals.threeColorPalette).map((c, ci) => (
              <span key={ci} className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: c.hex }} title={`${c.role}: ${c.name}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Active Tab View */}
      {activeStudioTab === "photoshoot" && (
        <TrackPhotoshootTab
          currentTrack={currentTrack}
          activeVisuals={activeVisuals}
          members={members}
          groupProfile={groupProfile}
          isGeneratingGroupPhoto={isGeneratingGroupPhoto}
          compositeProgressText={compositeProgressText}
          showDirectorGuidance={showDirectorGuidance}
          setShowDirectorGuidance={setShowDirectorGuidance}
          customDirectorNotes={customDirectorNotes}
          setCustomDirectorNotes={setCustomDirectorNotes}
          isGeneratingMvStill={isGeneratingMvStill}
          copiedKey={copiedKey}
          onCompositeGroupPhotoshoot={handleCompositeGroupPhotoshoot}
          onShuffleOutfits={handleShuffleOutfits}
          onClearGroupPhotoshoot={handleClearGroupPhotoshoot}
          onResetPhotoshootAndOutfits={handleResetPhotoshootAndOutfits}
          onRecombineExistingPhotos={handleRecombineExistingPhotos}
          onRenderGroupMvPhotoshootDirect={handleRenderGroupMvPhotoshootDirect}
          onRenderGroupMvPhotoshoot={handleRenderGroupMvPhotoshootDirect}
          onRenderMvStill={handleRenderMvStill}
          onClearMvStill={handleClearMvStill}
          settingStillMode={settingStillMode}
          onSetSettingStillMode={setSettingStillMode}
          generatingSceneIdx={generatingSceneIdx}
          onRenderStoryboardScene={handleRenderStoryboardScene}
          onClearStoryboardScene={handleClearStoryboardScene}
          isRegeneratingStoryboard={isRegeneratingStoryboard}
          onRegenerateStoryboard={handleRegenerateStoryboard}
          selectedImageModel={selectedImageModel}
          onSelectImageModel={setSelectedImageModel}
          strictFaceLikeness={strictFaceLikeness}
          onToggleStrictFaceLikeness={() => setStrictFaceLikeness(prev => !prev)}
          onOpenLightbox={setLightboxUrl}
          onCopy={handleCopy}
          onNavigateToLineup={onNavigateToLineup}
          onGoToStyling={() => setActiveStudioTab("styling")}
          onGoToOutfits={() => setActiveStudioTab("outfits")}
        />
      )}

      {activeStudioTab === "outfits" && (
        <TrackMemberOutfitsTab
          currentTrack={currentTrack}
          activeVisuals={activeVisuals}
          members={members}
          selectedMemberIdx={selectedMemberIdx}
          setSelectedMemberIdx={setSelectedMemberIdx}
          generatingMemberIndex={generatingMemberIndex}
          copiedKey={copiedKey}
          activeSecondaryStyle={activeSecondaryStyle}
          activeConceptVibe={activeConceptVibe}
          onShuffleOutfits={handleShuffleOutfits}
          onRenderMemberOutfit={handleRenderMemberOutfit}
          onClearMemberOutfit={handleClearMemberOutfit}
          onOpenLightbox={setLightboxUrl}
          onCopy={handleCopy}
          onGoToStyling={() => setActiveStudioTab("styling")}
          onGoToPhotoshoot={() => setActiveStudioTab("photoshoot")}
        />
      )}

      {activeStudioTab === "styling" && (
        <TrackStylingFormulaTab
          currentTrack={currentTrack}
          activeVisuals={activeVisuals}
          stylingFormulaMode={stylingFormulaMode}
          setStylingFormulaMode={setStylingFormulaMode}
          activeSecondaryStyle={activeSecondaryStyle}
          activeConceptVibe={activeConceptVibe}
          styleCategoryFilter={styleCategoryFilter}
          setStyleCategoryFilter={setStyleCategoryFilter}
          groupGenderTarget={groupGenderTarget}
          aiPalettes={aiPalettes}
          isGeneratingAiPalettes={isGeneratingAiPalettes}
          customDirectorNotes={customDirectorNotes}
          setCustomDirectorNotes={setCustomDirectorNotes}
          onApplyStyleMixPreset={handleApplyStyleMixPreset}
          onSelectFashionStyle={handleSelectFashionStyle}
          onSelectSecondaryStyle={handleSelectSecondaryStyle}
          onSelectConcept={handleSelectConcept}
          onCycle3ColorPalette={handleCycle3ColorPalette}
          onSelect3ColorPalette={handleSelect3ColorPalette}
          onGenerateAiSongPalettes={handleGenerateAiSongPalettes}
          onGoToPhotoshoot={() => setActiveStudioTab("photoshoot")}
        />
      )}

      {/* Lightbox Modal */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl p-2 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-3 pt-2">
              <div>
                <h4 className="text-xs font-black uppercase text-white tracking-wide">
                  {lightboxUrl.title}
                </h4>
                {lightboxUrl.subtitle && (
                  <p className="text-[8px] text-neutral-400 font-mono">{lightboxUrl.subtitle}</p>
                )}
              </div>
              <button
                onClick={() => setLightboxUrl(null)}
                className="p-1 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden flex items-center justify-center bg-black max-h-[75vh]">
              <img src={lightboxUrl.url} alt="Lightbox Preview" className="max-h-[75vh] w-auto object-contain" />
            </div>

            <div className="flex justify-end gap-2 px-3 pb-2">
              <a
                href={lightboxUrl.url}
                download="MV-Visual-Preview.png"
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-full text-[8.5px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download High-Res</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
