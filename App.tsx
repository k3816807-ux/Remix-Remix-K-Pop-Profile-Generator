
import React, { useState, useCallback, useEffect } from 'react';
import { UserPlus, FileDown } from 'lucide-react';
import { CreativeStudio } from './components/CreativeStudio';
import { UserInputForm } from './components/UserInputForm';
import { GroupProfileDisplay } from './components/GroupProfileDisplay';
import { MemberProfileCard } from './components/MemberProfileCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { FandomExtras } from './components/FandomExtras';
import { generateGroupOverview, generateSingleMember, generateSingleAlbum, createProfileFromPdfTextPrompt, generateMemberBiography, sanitizeKpopGreeting, sanitizeKpopGesture, isSoloArtist, detectArtistGender } from './services/profileDataHelper';
import { generateKpopGroupData } from './services/geminiService'; 
import { exportDossierToPdf } from './services/pdfExporter';
import type { UserInput, FullProfile, GroupProfileData } from './types';
import { GroupType } from './types';
import { saveToDB, loadFromDB, deleteFromDB } from './services/storageHelper';

declare global {
  interface Window {
    pdfjsLib: any;
  }
}

type TabType = 'overview' | 'lineup' | 'records' | 'studio' | 'fandom';

const TAB_THEMES = {
  overview: 'indigo',
  lineup: 'fuchsia',
  records: 'emerald',
  studio: 'amber',
  fandom: 'rose',
};

// Group Photoshoot Constants & Presets for randomized automatic studio generation
export const KPOP_PHOTOSHOOT_FORMATIONS = [
  {
    id: 'v_wedge',
    name: 'Center-Apex V-Formation (Delta Wedge)',
    tag: 'Classic Idol Symmetrical Depth',
    desc: 'Center visual/leader positioned slightly in front, remaining members tiered symmetrically backward in dynamic arrow/triangle depth — all standing tall on the studio floor (BTS, TWICE, SEVENTEEN style).',
    prompt: 'Center-Apex V-Formation (Delta Wedge): The center visual/leader is positioned slightly forward in the foreground apex, with remaining members standing tiered symmetrically backward on diagonal sightlines to create dynamic photographic depth and majestic unit cohesion. ALL members are standing on the floor with ZERO chairs, stools, or sitting blocks.'
  },
  {
    id: 'diamond_stagger',
    name: 'Frontline & Flank Diamond Stagger (All Standing)',
    tag: 'Authentic Photography Depth',
    desc: 'Frontline idols standing half a pace forward with flanking members stepped slightly back in staggered depth of field — all standing tall on the studio floor (EXO, aespa, Red Velvet, IVE style).',
    prompt: 'Frontline & Flank Diamond Stagger: Professional standing photography formation where frontline idols stand half a step forward and flanking idols stand stepped slightly back on clean diagonal sightlines. ALL members are standing upright on the studio floor in sharp photographic depth of field with ZERO chairs, stools, or sitting props.'
  },
  {
    id: 'asymmetric_stagger',
    name: 'Dynamic Asymmetrical Standing Stagger (High-Low Depth)',
    tag: 'Organic Modern Idol Depth',
    desc: 'Casual staggered depths of field, asymmetrical spacing, contrapposto weight-shifted stances with varied angles — all standing tall (NewJeans, LE SSERAFIM, Stray Kids style).',
    prompt: 'Dynamic Asymmetrical Editorial Standing Stagger: Members are arranged standing at varied organic depths of field and asymmetrical spatial intervals across the frame. Each idol adopts a distinct contrapposto weight-shifted standing stance, varied head angle, and independent silhouette. ALL members stand upright on the floor.'
  },
  {
    id: 'intimate_cluster',
    name: 'Intimate Multi-Layered Standing Cluster (Layered Heights)',
    tag: 'Intense Facial Charisma & Bond',
    desc: 'Members gathered close in layered standing depths, varied head angles, intimate bond without leaning or blocking faces (ITZY, ILLIT style).',
    prompt: 'Intimate Multi-Layered Standing Cluster: Close-knit layered group arrangement where members stand clustered together with staggered head levels, varied 3/4 face angles, and magnetic camera gazes. Intimate unit warmth with all members standing on the studio floor, ZERO resting heads on shoulders, and zero identical postures.'
  },
  {
    id: 'architectural_curve',
    name: 'Architectural S-Curve & Runway Stagger (Standing)',
    tag: 'Avant-Garde High-Fashion',
    desc: 'Members positioned standing along a sweeping diagonal line with sharp geometric silhouettes, high-contrast posture lines, and editorial spacing (BLACKPINK, NCT style).',
    prompt: 'Architectural S-Curve & Runway Stagger: Avant-garde high-fashion editorial diagonal standing arrangement with crisp geometric lines, sharp silhouette angles, asymmetrical spacing, and runway-level editorial tension. ALL members standing tall on the floor.'
  },
  {
    id: 'orbit_circle',
    name: 'Dynamic Semi-Circle Orbit Formation (Standing Arc)',
    tag: 'Engaging Circular Perspective',
    desc: 'Semi-circular standing arc formation with dynamic perspective, creating an engaging, cohesive circle vibe (BOYNEXTDOOR, RIIZE style).',
    prompt: 'Dynamic Semi-Circle Orbit Formation: Members positioned standing in an engaging curved semi-circular arc, interacting subtly with the camera angle with spontaneous, youth-driven star presence. ALL members standing on the floor.'
  },
  {
    id: 'power_stride',
    name: 'Linear Power Walk / Runway Stride',
    tag: 'Unit Movement & Dynamic Momentum',
    desc: 'Members captured in a confident horizontal runway stride, walking forward with dynamic jacket movement and statuesque presence.',
    prompt: 'Linear Power Walk Runway Stride: Members captured mid-stride walking confidently forward across a wide horizontal line, exuding effortless swagger, natural wind movement in hair and fabric, and commanding runway aura.'
  }
];

export const KPOP_PHOTOSHOOT_EXPRESSIONS = [
  {
    id: 'radiant_smile',
    name: 'Radiant Warm Smiles (Joyful & Friendly)',
    emoji: '🌟',
    tag: 'Approachable Star Glow',
    desc: 'Bright, genuine, radiant smiles with joyful eye contact, warm approachable energy, and cheerful idol glow. Strictly NO unhappy or sullen faces.',
    prompt: 'EXPRESSION DIRECTIVE (WARM RADIANT SMILES - ABSOLUTELY NO UNHAPPY FACES): Every idol displays a genuine, radiant, warm smile with cheerful, sparkling eyes and joyful approachable star energy. Lips are naturally smiling, conveying genuine happiness, charm, and youthful vibrance. ABSOLUTELY NO sullen, unhappy, gloomy, frowning, angry, or bored expressions under any circumstance.'
  },
  {
    id: 'magnetic_smize',
    name: 'Confident Magnetic Smize (Chic Cool)',
    emoji: '✨',
    tag: 'Effortless Idol Charisma',
    desc: 'Subtle pleasant smirk, sparkling captivating eyes, relaxed confident lips, effortless star swagger. Strictly NO unhappy faces.',
    prompt: 'EXPRESSION DIRECTIVE (CONFIDENT MAGNETIC SMIZE - ABSOLUTELY NO UNHAPPY FACES): Idols showcase effortless star swagger with subtle pleasant smirks, smiling eyes ("smize"), relaxed confident lips, and magnetic, captivating camera engagement. The vibe is cool, charming, and magnetic. ABSOLUTELY NO sullen, gloomy, frowning, or bored expressions.'
  },
  {
    id: 'playful_charm',
    name: 'Playful & Mischievous Charm (Lively)',
    emoji: '😜',
    tag: 'Fun Dynamic Energy',
    desc: 'Winks, subtle cheeky smiles, youthful energetic charisma, lively and fun idol expressions. Strictly NO unhappy faces.',
    prompt: 'EXPRESSION DIRECTIVE (PLAYFUL & MISCHIEVOUS CHARM - ABSOLUTELY NO UNHAPPY FACES): High-spirited, playful idol charm featuring subtle cheeky smiles, occasional lighthearted winks, relaxed playful expressions, and vibrant youthful charisma. Dynamic, fun, and lively. ABSOLUTELY NO sad, gloomy, or sullen faces.'
  },
  {
    id: 'ethereal_serenity',
    name: 'Ethereal Gentle Serenity (Dreamy Nostalgia)',
    emoji: '🌸',
    tag: 'Soft Romantic Grace',
    desc: 'Soft relaxed lips, peaceful gentle aura, dreamy tender warmth, nostalgic emotional depth. Strictly NO unhappy faces.',
    prompt: 'EXPRESSION DIRECTIVE (ETHEREAL GENTLE SERENITY - ABSOLUTELY NO UNHAPPY FACES): Soft, serene, and poetic expressions with relaxed tender lips, dreamy gentle gaze, and a warm, peaceful aura. Emotional, nostalgic, and enchanting. ABSOLUTELY NO frowns, distress, or unhappy/depressed looks.'
  },
  {
    id: 'fierce_charisma',
    name: 'Powerful Fierce Charisma (Empowered & Sharp)',
    emoji: '🔥',
    tag: 'Commanding Stage Presence',
    desc: 'Commanding gaze, strong jawlines, empowered and proud stage energy — intense, passionate, confident, strictly NOT sullen or sad.',
    prompt: 'EXPRESSION DIRECTIVE (POWERFUL FIERCE CHARISMA - EMPOWERED & PROUD): Commanding, intense, and empowering high-fashion runway gaze with proud chin angles and magnetic stage fire. Every idol looks confident, passionate, and triumphant. ABSOLUTELY NO sullen, depressed, bored, or miserable expressions.'
  }
];

export const KPOP_PHOTOSHOOT_STUDIO_SETS = [
  {
    id: 'studio_3d_wall',
    name: 'High-End Studio with 3D Brand Logo Wall',
    tag: 'Signature Agency Set',
    desc: 'Clean studio backdrop featuring custom 3D glowing logo typography of the group name mounted on the wall.',
    prompt: 'Studio Set & Backdrop: Clean, ultra-stylish high-end editorial studio backdrop wall with a custom 3D glowing sculptural logo typography of the group name mounted on the wall behind them.'
  },
  {
    id: 'cyclorama_softbox',
    name: 'Pure White Cyclorama with Softbox Glow',
    tag: 'Clean Minimalist Light',
    desc: 'Flawless infinity cyclorama stage with diffused daylight softboxes and clean floor reflections.',
    prompt: 'Studio Set & Backdrop: Flawless pure white infinity cyclorama studio stage with diffused softbox overhead key lighting, soft natural shadows, and pristine glossy floor reflections.'
  },
  {
    id: 'sunset_ambient',
    name: 'Golden Hour Warm Sunset Ambient Stage',
    tag: 'Cinematic Warmth',
    desc: 'Warm peachy-golden rim lighting, soft amber hues, and cinematic warmth.',
    prompt: 'Studio Set & Backdrop: Atmospheric warm sunset studio set with golden-hour directional rim lighting, peachy-amber ambient backdrops, and cinematic warmth.'
  },
  {
    id: 'dark_luxury_neon',
    name: 'Dark Luxury Studio with Vibrant Rim Halos',
    tag: 'Moody High-Contrast',
    desc: 'Matte obsidian stage with subtle edge neon halos echoing the group\'s official colors.',
    prompt: 'Studio Set & Backdrop: Dark matte obsidian luxury studio stage with dramatic edge rim lighting and subtle glowing neon halos echoing the official group colors.'
  }
];

const App: React.FC = () => {
  const [profile, setProfile] = useState<Partial<FullProfile> | null>(null);
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  const [isStateLoaded, setIsStateLoaded] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCastingMember, setIsCastingMember] = useState<boolean>(false);
  const [isComposingAlbum, setIsComposingAlbum] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('Developing Group Strategy...');
  const [error, setError] = useState<string | null>(null);
  const [pdfJsWorkerSrcSet, setPdfJsWorkerSrcSet] = useState(false);
  const [recastingIndex, setRecastingIndex] = useState<number | null>(null);
  const [isGeneratingGroupPhoto, setIsGeneratingGroupPhoto] = useState<boolean>(false);
  const [groupPhotoError, setGroupPhotoError] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [groupPhotoIncludesAll, setGroupPhotoIncludesAll] = useState<boolean>(true);
  const [isAddingMembers, setIsAddingMembers] = useState<boolean>(false);
  const [photoshootViewMode, setPhotoshootViewMode] = useState<'fullBody' | 'waistUp'>('fullBody');
  const [isGeneratingBiographies, setIsGeneratingBiographies] = useState<boolean>(false);
  const [bioProgressIndex, setBioProgressIndex] = useState<number | null>(null);
  const [bioProgressMessage, setBioProgressMessage] = useState<string | null>(null);
  const [bioNoticeSuccess, setBioNoticeSuccess] = useState<boolean>(false);

  const isSolo = isSoloArtist(userInput?.groupType || profile?.groupType);
  const targetMemberCount = isSolo ? 1 : (userInput?.numMembers || 1);

  // Load robust state from IndexedDB on mount to bypass 5MB localStorage limits
  useEffect(() => {
    async function restoreStateFromIndexedDB() {
      try {
        const storedProfile = await loadFromDB('kpop-profile');
        const storedUserInput = await loadFromDB('kpop-user-input');
        
        if (storedProfile) {
          if (!storedProfile.greeting && storedProfile.groupName) {
            storedProfile.greeting = {
              motto: sanitizeKpopGreeting(undefined, storedProfile.groupName),
              gesture: sanitizeKpopGesture(undefined, storedProfile.groupName)
            };
          }
          setProfile(storedProfile);
        } else {
          try {
            const saved = localStorage.getItem('kpop-profile');
            if (saved && saved !== 'undefined') {
              const parsed = JSON.parse(saved);
              if (parsed && !parsed.greeting && parsed.groupName) {
                parsed.greeting = {
                  motto: sanitizeKpopGreeting(undefined, parsed.groupName),
                  gesture: sanitizeKpopGesture(undefined, parsed.groupName)
                };
              }
              setProfile(parsed);
            }
          } catch (e) {}
        }

        if (storedUserInput) {
          setUserInput(storedUserInput);
        } else {
          try {
            const savedInput = localStorage.getItem('kpop-user-input');
            if (savedInput && savedInput !== 'undefined') setUserInput(JSON.parse(savedInput));
          } catch (e) {}
        }
      } catch (err) {
        console.error("Error loading state from IndexedDB, using local storage", err);
      } finally {
        setIsStateLoaded(true);
      }
    }
    restoreStateFromIndexedDB();
  }, []);

  // Save changes cleanly to IndexedDB and fallback to localStorage without mutating state
  useEffect(() => {
    if (!isStateLoaded) return; // CRITICAL: Never overwrite IndexedDB before initial load finishes!

    if (profile !== null) {
      saveToDB('kpop-profile', profile);
      try {
        localStorage.setItem('kpop-profile', JSON.stringify(profile));
      } catch (e) {
        // Swallowed if 5MB quota is exceeded; IndexedDB maintains full data
      }
    } else {
      deleteFromDB('kpop-profile');
      try { localStorage.removeItem('kpop-profile'); } catch (e) {}
    }

    if (userInput !== null) {
      saveToDB('kpop-user-input', userInput);
      try {
        localStorage.setItem('kpop-user-input', JSON.stringify(userInput));
      } catch (e) {}
    } else {
      deleteFromDB('kpop-user-input');
      try { localStorage.removeItem('kpop-user-input'); } catch (e) {}
    }
  }, [profile, userInput, isStateLoaded]);

  useEffect(() => {
    if (profile) {
      if (profile.groupPhotoIncludesAll !== undefined) {
        setGroupPhotoIncludesAll(profile.groupPhotoIncludesAll);
      } else {
        setGroupPhotoIncludesAll(profile.groupPhotoUrl ? ((profile.members?.length || 0) <= 3) : true);
      }
    }
  }, [profile]);

  useEffect(() => {
    async function setupPdfJs() {
      try {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';
          setPdfJsWorkerSrcSet(true);
        }
      } catch (e) {
        console.error("PDF setup error.");
      }
    }
    setupPdfJs();
  }, []);

  const handleGenerateOverview = useCallback(async (newInput: UserInput) => {
    setIsLoading(true);
    setLoadingMessage('Conducting Market Analysis...');
    setError(null);
    
    // Back up any previously generated/cast lineup and records to avoid removing them
    const savedMembers = profile?.members || [];
    const savedDiscography = profile?.discography || [];
    const savedSources = profile?.sources;
    
    setProfile(null);
    setUserInput(newInput);
    try {
      const groupProfileData = await generateGroupOverview(newInput);
      setProfile({
        ...groupProfileData,
        members: savedMembers.length > 0 ? savedMembers : (groupProfileData.members || []),
        discography: savedDiscography.length > 0 ? savedDiscography : (groupProfileData.discography || []),
        sources: savedSources || groupProfileData.sources
      });
      setActiveTab('overview');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Strategic generation failed. Please refine your parameters.");
    } finally {
      setIsLoading(false);
    }
  }, [profile]);

  const handleRegenerateOverviewKeepName = useCallback(async () => {
    if (!profile || !userInput || !profile.groupName) return;
    setIsLoading(true);
    setLoadingMessage('Regenerating Overview while preserving name...');
    setError(null);
    
    // Back up any previously generated/cast lineup and records to avoid removing them
    const savedMembers = profile?.members || [];
    const savedDiscography = profile?.discography || [];
    const savedSources = profile?.sources;
    
    try {
      const groupProfileData = await generateGroupOverview(userInput, profile.groupName);
      setProfile({
        ...groupProfileData,
        members: savedMembers.length > 0 ? savedMembers : (groupProfileData.members || []),
        discography: savedDiscography.length > 0 ? savedDiscography : (groupProfileData.discography || []),
        sources: savedSources || groupProfileData.sources
      });
      setActiveTab('overview');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Strategic generation failed. Please refine your parameters.");
    } finally {
      setIsLoading(false);
    }
  }, [profile, userInput]);

  const handleGenerateNextMember = useCallback(async () => {
    if (!profile || !userInput) return;
    setIsCastingMember(true);
    setError(null);
    try {
      const newMember = await generateSingleMember(userInput, profile as GroupProfileData, profile.members || []);
      setProfile(prev => ({ ...prev, members: [...(prev?.members || []), newMember] }));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Casting failed. Please try again.");
    } finally {
      setIsCastingMember(false);
    }
  }, [profile, userInput]);

  const handleGenerateNextAlbum = useCallback(async () => {
    if (!profile) return;
    setIsComposingAlbum(true);
    setError(null);
    try {
      const groupType = userInput?.groupType || 'Girl Group';
      const memberCount = profile.members?.length || 5;
      const newAlbum = await generateSingleAlbum(profile as GroupProfileData, profile.discography || [], groupType, memberCount);
      setProfile(prev => ({ ...prev, discography: [...(prev?.discography || []), newAlbum] }));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Discography generation failed. Please try again.");
    } finally {
      setIsComposingAlbum(false);
    }
  }, [profile, userInput]);

  const handleRegenerateMember = useCallback(async (index: number) => {
    if (!profile || !userInput || !profile.members) return;
    setRecastingIndex(index);
    setError(null);
    setBioNoticeSuccess(false);

    try {
      const memberToReplace = profile.members[index];
      const otherMembers = profile.members.filter((_, idx) => idx !== index);
      
      // Step 1: Recast and generate new member profile data
      const newMember = await generateSingleMember(
        userInput, 
        profile as GroupProfileData, 
        otherMembers,
        memberToReplace
      );
      
      // Immediately place new member in lineup and update state
      const updatedMembers = [...profile.members];
      updatedMembers[index] = newMember;
      
      setProfile(prev => {
        if (!prev || !prev.members) return prev;
        const newMembers = [...prev.members];
        newMembers[index] = newMember;
        return { ...prev, members: newMembers };
      });

      // Clear the single slot spinner now that the new member data is active
      setRecastingIndex(null);

      // Step 2: Automatically synchronize biographies for the other members to reflect the new member
      if (updatedMembers.length > 1) {
        setIsGeneratingBiographies(true);
        setBioProgressMessage(`Updating biographies for other members to harmonize with ${newMember.stageName}...`);

        const otherIndices = updatedMembers
          .map((_, idx) => idx)
          .filter(idx => idx !== index);

        const bioTasks: Promise<void>[] = [];

        // Generate biography for the newly cast member
        bioTasks.push((async () => {
          try {
            const newBio = await generateMemberBiography(
              newMember,
              profile as GroupProfileData,
              updatedMembers,
              userInput?.groupType
            );
            if (newBio) {
              setProfile(prev => {
                if (!prev || !prev.members) return prev;
                const next = [...prev.members];
                next[index] = { ...next[index], bio: newBio };
                return { ...prev, members: next };
              });
            }
          } catch (err) {
            console.warn(`Failed to generate bio for new member ${newMember.stageName}:`, err);
          }
        })());

        // Automatically update each of the other members' biographies to integrate the new member
        otherIndices.forEach((otherIdx) => {
          bioTasks.push((async () => {
            try {
              const target = updatedMembers[otherIdx];
              setBioProgressIndex(otherIdx);
              const updatedBio = await generateMemberBiography(
                target,
                profile as GroupProfileData,
                updatedMembers,
                userInput?.groupType,
                target.bio
              );
              if (updatedBio) {
                setProfile(prev => {
                  if (!prev || !prev.members) return prev;
                  const next = [...prev.members];
                  next[otherIdx] = { ...next[otherIdx], bio: updatedBio };
                  return { ...prev, members: next };
                });
              }
            } catch (err) {
              console.warn(`Failed to auto-update bio for member ${otherIdx}:`, err);
            }
          })());
        });

        await Promise.allSettled(bioTasks);
        setBioNoticeSuccess(true);
      } else if (updatedMembers.length === 1) {
        // Soloist single member biography update
        try {
          setIsGeneratingBiographies(true);
          setBioProgressMessage(`Generating biography for ${newMember.stageName}...`);
          const newBio = await generateMemberBiography(
            newMember,
            profile as GroupProfileData,
            updatedMembers,
            userInput?.groupType
          );
          if (newBio) {
            setProfile(prev => {
              if (!prev || !prev.members) return prev;
              const next = [...prev.members];
              next[0] = { ...next[0], bio: newBio };
              return { ...prev, members: next };
            });
            setBioNoticeSuccess(true);
          }
        } catch (err) {
          console.warn("Failed to generate soloist bio:", err);
        }
      }
    } catch (err: any) {
      setError(err.message || "Member generation failed. Please try again.");
    } finally {
      setRecastingIndex(null);
      setIsGeneratingBiographies(false);
      setBioProgressIndex(null);
      setBioProgressMessage(null);
    }
  }, [profile, userInput]);

  const handleGenerateAllBiographies = useCallback(async () => {
    if (!profile || !profile.members || profile.members.length === 0) return;
    setIsGeneratingBiographies(true);
    setError(null);
    setBioNoticeSuccess(false);

    try {
      const total = profile.members.length;
      let currentMembers = [...profile.members];

      for (let i = 0; i < total; i++) {
        setBioProgressIndex(i);
        const targetMember = currentMembers[i];
        setBioProgressMessage(`Writing Biography ${i + 1} of ${total}: ${targetMember.stageName} (${targetMember.positions?.[0] || 'Member'})...`);

        const generatedBio = await generateMemberBiography(
          targetMember,
          profile as GroupProfileData,
          currentMembers,
          userInput?.groupType
        );

        currentMembers[i] = {
          ...currentMembers[i],
          bio: generatedBio
        };

        // Immediately update state so the card updates live
        setProfile(prev => {
          if (!prev || !prev.members) return prev;
          const updated = [...prev.members];
          updated[i] = { ...updated[i], bio: generatedBio };
          return { ...prev, members: updated };
        });
      }
      setBioNoticeSuccess(true);
    } catch (err: any) {
      console.error("Biography generation error:", err);
      setError(err.message || "Failed to generate member biographies. Please try again.");
    } finally {
      setIsGeneratingBiographies(false);
      setBioProgressIndex(null);
      setBioProgressMessage(null);
    }
  }, [profile, userInput]);

  const handleGenerateSingleBio = useCallback(async (index: number) => {
    if (!profile || !profile.members || !profile.members[index]) return;
    setBioProgressIndex(index);
    setError(null);

    try {
      const targetMember = profile.members[index];
      const generatedBio = await generateMemberBiography(
        targetMember,
        profile as GroupProfileData,
        profile.members,
        userInput?.groupType
      );

      setProfile(prev => {
        if (!prev || !prev.members) return prev;
        const updated = [...prev.members];
        updated[index] = { ...updated[index], bio: generatedBio };
        return { ...prev, members: updated };
      });
    } catch (err: any) {
      setError(err.message || "Failed to generate member biography.");
    } finally {
      setBioProgressIndex(null);
    }
  }, [profile, userInput]);

  const handleProfileFileUpload = useCallback(async (file: File) => {
    if (!pdfJsWorkerSrcSet) return;
    const pdfjsLib = window.pdfjsLib;
    if (!pdfjsLib) return;

    setIsLoading(true);
    setLoadingMessage('Ingesting Agency Dossier...');
    setError(null);
    setProfile(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let pdfTextContent = "";
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        textContent.items.forEach((item: any) => { if (item.str) pdfTextContent += item.str + " "; });
      }
      const prompt = createProfileFromPdfTextPrompt(pdfTextContent);
      const { data: parsedData, sources } = await generateKpopGroupData<GroupProfileData>(prompt);
      setProfile({ ...parsedData, sources });
      setActiveTab('overview');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Dossier ingestion failed.");
    } finally {
      setIsLoading(false);
    }
  }, [pdfJsWorkerSrcSet]);

  const handleClearCurrentPhoto = () => {
    setProfile(prev => {
      if (!prev) return prev;
      const isWaistUp = photoshootViewMode === 'waistUp';
      const newWaistUp = isWaistUp ? undefined : prev.groupPhotoWaistUpUrl;
      const newFullBody = !isWaistUp ? undefined : prev.groupPhotoFullBodyUrl;
      return {
        ...prev,
        groupPhotoUrl: newWaistUp || newFullBody || undefined,
        groupPhotoWaistUpUrl: newWaistUp,
        groupPhotoFullBodyUrl: newFullBody,
      };
    });
    setGroupPhotoError(null);
  };

  const handleClearGroupPhoto = () => {
    setProfile(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        groupPhotoUrl: undefined,
        groupPhotoWaistUpUrl: undefined,
        groupPhotoFullBodyUrl: undefined,
        groupPhotoIncludesAll: undefined,
        membersInPhotoCount: undefined
      };
    });
    setGroupPhotoError(null);
  };

  const handleGenerateGroupPhoto = async (modeOverride?: 'waistUp' | 'fullBody') => {
    if (!profile || !profile.members || profile.members.length === 0) return;
    const targetMode = modeOverride || photoshootViewMode;
    const isWaistUp = targetMode === 'waistUp';
    if (targetMode !== photoshootViewMode) {
      setPhotoshootViewMode(targetMode);
    }
    setIsGeneratingGroupPhoto(true);
    setGroupPhotoError(null);
    try {
      const { generateImage } = await import('./services/geminiService');
      const numMembers = profile.members.length;
      const officialColorsStr = profile.officialColors?.map(c => `"${c.name.replace(/\([^)]*\)/g, '').trim()}"${c.hex ? ` (${c.hex})` : ''}`).join(', ') || 'official brand tones';

      // Randomly select dynamic idol photoshoot formation, expression, and studio set
      const randomFormation = KPOP_PHOTOSHOOT_FORMATIONS[Math.floor(Math.random() * KPOP_PHOTOSHOOT_FORMATIONS.length)] || KPOP_PHOTOSHOOT_FORMATIONS[0];
      const randomExpression = KPOP_PHOTOSHOOT_EXPRESSIONS[Math.floor(Math.random() * KPOP_PHOTOSHOOT_EXPRESSIONS.length)] || KPOP_PHOTOSHOOT_EXPRESSIONS[0];
      const randomStudioSet = KPOP_PHOTOSHOOT_STUDIO_SETS[Math.floor(Math.random() * KPOP_PHOTOSHOOT_STUDIO_SETS.length)] || KPOP_PHOTOSHOOT_STUDIO_SETS[0];

      // Check if the other connected photoshoot view already exists as a reference
      const referencePhoto = isWaistUp ? profile.groupPhotoFullBodyUrl : profile.groupPhotoWaistUpUrl;

      // Match the member count already established in the master photoshoot, or initial 3
      const isSoloAct = isSoloArtist(profile.groupType || userInput?.groupType);
      const initialCount = isSoloAct
        ? 1
        : (referencePhoto && profile.membersInPhotoCount
          ? profile.membersInPhotoCount
          : Math.min(3, numMembers));

      const membersToProcess = profile.members.slice(0, initialCount);
      const initialMemberNames = isSoloAct
        ? profile.members[0].stageName
        : membersToProcess.map((m, idx) => `Member ${idx + 1} (${m.stageName})`).join(', ');

      // Collect reference images: if reference photo exists, it is [IMAGE PART 1]
      const memberRefs: { label: string; dataUrl: string }[] = [];
      let memberDescriptions = "";

      if (referencePhoto) {
        memberRefs.push({
          label: `[IMAGE PART 1] Master Reference Photoshoot (Shot 1: ${isWaistUp ? 'Full Body Head-To-Toe Shot' : 'Upper Body Editorial Portrait'})`,
          dataUrl: referencePhoto
        });
      }

      membersToProcess.forEach((m, idx) => {
        const refImg = isWaistUp
          ? (m.imageUrl || (m.fullBodyImages && m.fullBodyImages.length > 0 ? m.fullBodyImages[0] : undefined))
          : ((m.fullBodyImages && m.fullBodyImages.length > 0) ? m.fullBodyImages[0] : m.imageUrl);
        const imagePartNum = referencePhoto ? idx + 2 : idx + 1;
        const totalRefImages = referencePhoto ? initialCount + 1 : initialCount;
        if (refImg) {
          memberRefs.push({
            label: `[IMAGE PART ${imagePartNum}] ${isSoloAct ? 'Solo Artist' : `Member ${idx + 1}`} (${m.stageName}) Reference Card`,
            dataUrl: refImg
          });
        }
        const hairDesc = m.currentHairStyle || m.dyedHairColor || m.originalHairColor || 'styled idol hair';
        const outfitDesc = m.stageOutfit || m.conceptOutfit || 'designer K-pop stage outfit';
        memberDescriptions += `- ${isSoloAct ? 'Solo Artist' : `Member ${idx + 1}`} (${m.stageName}): Real ${m.race || 'East Asian'} artist, ${m.skinTone || 'fair skin'}, hairstyle "${hairDesc}", distinct face (${m.distinctFacialFeatures || 'unique artist facial features'}). COPY THEIR EXACT FACE, HAIRSTYLE, AND EXACT STAGE OUTFIT ("${outfitDesc}") FROM [IMAGE PART ${imagePartNum} OF ${totalRefImages}: ${isSoloAct ? 'Solo Artist' : `Member ${idx + 1}`} (${m.stageName}) Reference Card].\n`;
      });

      // Extract official colors for wall typography and stage styling
      const primaryColor = profile.officialColors?.[0] || { name: 'Platinum Silver', hex: '#E5E7EB' };
      const secondaryColor = profile.officialColors?.[1] || { name: 'Obsidian Black', hex: '#111827' };
      const accentColors = profile.officialColors?.slice(2) || [];
      const colorDescription = profile.officialColors && profile.officialColors.length > 0
        ? profile.officialColors.map(c => `"${c.name}" (Hex: ${c.hex})`).join(', ')
        : 'sleek chrome silver and obsidian black';

      let prompt = "";

      if (referencePhoto) {
        // CONNECTED 2ND IMAGE USING THE 1ST SHOT AS MASTER REFERENCE
        if (isWaistUp) {
          prompt = isSoloAct ? `You are a world-renowned K-pop editorial photographer and photo director.
Attached as [IMAGE PART 1] is Shot 1 (the official Full Body photoshoot) of solo artist "${profile.groupName}" (${initialMemberNames}).

YOUR TASK:
Create SHOT 2 of this official photoshoot session: a brand-new, dedicated UPPER BODY EDITORIAL CLOSE-UP PORTRAIT of this EXACT SAME solo artist (${initialMemberNames}), perfectly connected to Shot 1 [IMAGE PART 1].

CONNECTED PHOTOSHOOT CONTINUITY (100% LOCK FROM SHOT 1 [IMAGE PART 1]):
1. EXACT SOLO ARTIST ONLY: Feature ONLY the solo artist ${initialMemberNames}. Do NOT add extra people, strangers, backup dancers, or other models.
2. EXACT FACE, SKIN, & HAIRSTYLE: Replicate the exact facial features, skin tone, eye shape, hair color, and hair styling seen in [IMAGE PART 1] and the artist reference card.
3. EXACT STAGE OUTFIT: The artist MUST wear the EXACT same high-fashion stage top, jacket, jewelry, collar, and accessories as seen on them in [IMAGE PART 1].
4. EXACT STUDIO SET & ARTIST NAME LOGO: Maintain the exact same studio backdrop, ambient lighting, color palette (${colorDescription}), and the sleek 3D typography logo of "${profile.groupName}" centered on the wall behind the artist.

SHOT 2 CREATIVE DIRECTION (UPPER-BODY CLOSE-UP PORTRAIT):
- A NEW PHOTOGRAPH FROM THE SAME SHOOT: This is a distinct, newly captured photograph from this session — NOT a simple digital crop or low-res cutout.
- FRAMING: Frame the artist from the chest/waist up in a rich, cinematic medium close-up portrait. ABSOLUTELY NO LEGS OR FEET VISIBLE.
- POSING & ENERGY: Charismatic solo editorial posing (e.g. confident hand placement near jacket collar or waist, elegant model posture, slight 3/4 face angle, direct magnetic eye contact with the camera).
- EXPRESSION: Magnetic, confident, star charisma. No gloomy, sad, or deadpan expressions.
- Crisp 8k photorealistic quality, ultra-sharp facial details, natural skin texture, clean studio lighting.`
          : `You are a world-renowned K-pop editorial photographer and photo director.
Attached as [IMAGE PART 1] is Shot 1 (the official Full Body group photoshoot) of K-pop group "${profile.groupName}" featuring ${initialCount} members: ${initialMemberNames}.

YOUR TASK:
Create SHOT 2 of this official photoshoot session: a brand-new, dedicated UPPER BODY EDITORIAL CLOSE-UP PORTRAIT of these EXACT SAME ${initialCount} members (${initialMemberNames}), perfectly connected to Shot 1 [IMAGE PART 1].

CONNECTED PHOTOSHOOT CONTINUITY (100% LOCK FROM SHOT 1 [IMAGE PART 1]):
1. EXACT MEMBERS & RELATIVE ORDER: Keep every single idol in their exact same positions and relative arrangement as seen in [IMAGE PART 1]. Do NOT add new people, do NOT remove any idols, and do NOT alter their identities.
2. EXACT FACES, SKIN, & HAIRSTYLES: Replicate the exact facial features, skin tones, eye shapes, hair colors, and hair styling seen in [IMAGE PART 1] and their attached member reference cards.
3. EXACT STAGE OUTFITS: Every member MUST wear the EXACT same high-fashion stage tops, jackets, jewelry, collars, and accessories as seen on them in [IMAGE PART 1].
4. EXACT STUDIO SET & GROUP NAME LOGO: Maintain the exact same studio backdrop, ambient lighting, color palette (${colorDescription}), and the sleek 3D typography logo of "${profile.groupName}" centered on the wall behind the idols.

SHOT 2 CREATIVE DIRECTION (UPPER-BODY CLOSE-UP PORTRAIT):
- A NEW PHOTOGRAPH FROM THE SAME SHOOT: This is a distinct, newly captured photograph from this session — NOT a simple digital crop or low-res cutout.
- FRAMING: Frame all idols from the chest/waist up in a rich, cinematic medium close-up portrait. ABSOLUTELY NO LEGS OR FEET VISIBLE.
- POSING & ENERGY: Idols adopt dynamic, charismatic upper-body editorial poses (e.g. confident hand placement near lapels or waist, elegant model posture, slight chin lifts or 3/4 face angles, direct magnetic eye contact with the camera).
- ZERO LEAN-ON-SHOULDERS RULE: ABSOLUTELY NO idols leaning on each other's shoulders, NO resting heads on shoulders.
- EXPRESSION: Magnetic, confident, star charisma ("not doing too much" — effortless K-pop editorial poise). No gloomy, sad, or deadpan expressions.
- Crisp 8k photorealistic quality, ultra-sharp facial details, natural skin texture, clean studio lighting.`;
        } else {
          prompt = isSoloAct ? `You are a world-renowned K-pop editorial photographer and photo director.
Attached as [IMAGE PART 1] is Shot 1 (the official Upper Body editorial portrait) of solo artist "${profile.groupName}" (${initialMemberNames}).

YOUR TASK:
Create SHOT 2 of this official photoshoot session: a brand-new, dedicated 100% FULL BODY HEAD-TO-TOE photoshoot of this EXACT SAME solo artist (${initialMemberNames}), perfectly connected to Shot 1 [IMAGE PART 1].

CONNECTED PHOTOSHOOT CONTINUITY (100% LOCK FROM SHOT 1 [IMAGE PART 1]):
1. EXACT SOLO ARTIST ONLY: Feature ONLY the solo artist ${initialMemberNames}. Do NOT add extra people, background dancers, or other models.
2. EXACT FACE, SKIN, & HAIRSTYLE: Replicate the exact facial features, skin tone, eye shape, hair color, and hair styling seen in [IMAGE PART 1] and their attached reference card.
3. EXACT STAGE OUTFIT & EXTENSION: The artist MUST wear the EXACT same high-fashion stage top, jacket, jewelry, collar, and accessories as seen in [IMAGE PART 1], extended downward with perfectly matching designer bottoms (pants/skirt) and footwear.
4. EXACT STUDIO SET & ARTIST NAME LOGO: Maintain the exact same studio backdrop, ambient lighting, color palette (${colorDescription}), and the sleek 3D typography logo of "${profile.groupName}" centered on the wall behind the artist.

SHOT 2 CREATIVE DIRECTION (FULL-BODY HEAD-TO-TOE SHOT):
- A NEW PHOTOGRAPH FROM THE SAME SHOOT: This is a distinct, complete wide-angle photograph from this session.
- FRAMING: Complete 100% head-to-toe wide-angle perspective showing the solo artist standing on the studio floor. Show complete footwear and floor contact. DO NOT CROP FEET OR LEGS.
- POSING: Solo artist standing in a stylish, high-fashion editorial stance on the studio floor (weight shifted, elegant model posture).
- EXPRESSION: Magnetic, confident star aura and warm professional charisma.
- Crisp 8k photorealistic quality, clean full-length silhouette, balanced floor reflections, and sharp studio lighting.`
          : `You are a world-renowned K-pop editorial photographer and photo director.
Attached as [IMAGE PART 1] is Shot 1 (the official Upper Body editorial portrait) of K-pop group "${profile.groupName}" featuring ${initialCount} members: ${initialMemberNames}.

YOUR TASK:
Create SHOT 2 of this official photoshoot session: a brand-new, dedicated 100% FULL BODY HEAD-TO-TOE group photoshoot of these EXACT SAME ${initialCount} members (${initialMemberNames}), perfectly connected to Shot 1 [IMAGE PART 1].

CONNECTED PHOTOSHOOT CONTINUITY (100% LOCK FROM SHOT 1 [IMAGE PART 1]):
1. EXACT MEMBERS & RELATIVE ORDER: Keep every single idol in their exact same positions and relative arrangement as seen in [IMAGE PART 1]. Do NOT add new people, do NOT remove any idols, and do NOT alter their identities.
2. EXACT FACES, SKIN, & HAIRSTYLES: Replicate the exact facial features, skin tones, eye shapes, hair colors, and hair styling seen in [IMAGE PART 1] and their attached member reference cards.
3. EXACT STAGE OUTFITS & EXTENSION: Every member MUST wear the EXACT same high-fashion stage tops, jackets, jewelry, collars, and accessories as seen on them in [IMAGE PART 1], extended downward with perfectly matching designer stage bottoms (pants, skirts, cargo styling) and footwear.
4. EXACT STUDIO SET & GROUP NAME LOGO: Maintain the exact same studio backdrop, ambient lighting, color palette (${colorDescription}), and the sleek 3D typography logo of "${profile.groupName}" centered on the wall behind the idols.

SHOT 2 CREATIVE DIRECTION (FULL-BODY HEAD-TO-TOE SHOT):
- A NEW PHOTOGRAPH FROM THE SAME SHOOT: This is a distinct, complete wide-angle photograph from this session.
- FRAMING: Complete 100% head-to-toe wide-angle perspective showing all idols standing on the studio floor. Show complete footwear and floor contact. DO NOT CROP FEET OR LEGS.
- POSING: All idols standing in stylish, asymmetrical high-fashion stances on the floor (weight shifted, hands in pockets or at sides, model posture). ZERO leaning on each other's shoulders.
- EXPRESSION: Magnetic, confident star aura and warm professional charisma.
- Crisp 8k photorealistic quality, clean full-length silhouettes, balanced floor reflections, and sharp studio lighting.`;
        }
      } else {
        // INITIAL SHOT OF THE PHOTOSHOOT (SHOT 1)
        if (isWaistUp) {
          prompt = isSoloAct ? `A hyper-realistic 16:9 UPPER BODY EDITORIAL PORTRAIT CLOSE-UP of the K-pop solo artist "${profile.groupName}" (${initialMemberNames}).

CRITICAL SINGLE ARTIST MANDATE & STRICT NO-EXTRA-PEOPLE RULE:
The photoshoot MUST feature EXACTLY 1 HUMAN ARTIST (${initialMemberNames}) — NO MORE, NO LESS.
- EXACTLY 1 HUMAN ARTIST: The photo MUST contain ONLY the solo artist ${initialMemberNames}.
- ABSOLUTELY NO EXTRA PEOPLE OR STRANGERS: Do NOT add any extra random people, strangers, background dancers, standard models, or unrequested idols.
- ABSOLUTELY NO CLONES: The photo corresponds strictly to the solo artist from their attached reference image.

MANDATORY ARTIST REFERENCE:
${memberDescriptions}

CRITICAL FRAMING (UPPER BODY CLOSE-UP ONLY - NO LEGS):
This photo MUST be a tight, zoomed-in upper-body portrait framing the solo artist from the chest/waist up ONLY. Focus strictly on their face, hairstyle, and upper-body stage top. ABSOLUTELY NO LEGS OR FEET SHOULD BE VISIBLE IN THIS CLOSE-UP PORTRAIT.

SOLO ARTIST EDITORIAL POSING DIRECTIVE:
- Dynamic editorial upper-body stance with natural photographic depth.
- Confident head angle, refined posture, magnetic eye contact with the camera.
- EXPRESSION STYLE: ${randomExpression.name}. ${randomExpression.prompt}
- ABSOLUTELY NO UNHAPPY OR SAD FACES: Exude star charisma, joyful radiant warmth, or magnetic pleasant confidence.

STRICT WARDROBE LOCK (PRESERVE PROFILE OUTFIT):
- CRITICAL: The artist MUST wear the EXACT outfit they wore in their individual profile photo card attached as their reference image. Replicate their specific stage top, fabrics, jacket details, and accessories faithfully.

STUDIO SET & BESPOKE 3D WALL TYPOGRAPHY:
${randomStudioSet.prompt}
Mounted high on the studio backdrop wall directly behind the artist is the official artist name "${profile.groupName}".
- UNIQUE LOGOTYPE STYLING: Crafted as a custom, high-end 3D sculptural typographic art installation matching their concept.
- VIBRANT OFFICIAL BRAND COLORS INTEGRATION: The 3D typography of "${profile.groupName}" MUST prominently feature the official brand colors (${colorDescription}).
Fresh, healthy, bare-faced glowing natural skin aesthetic. Crisp 8k photorealistic quality.`
          : `A hyper-realistic 16:9 UPPER BODY EDITORIAL PORTRAIT CLOSE-UP of the K-pop group "${profile.groupName}".

CRITICAL TOTAL MEMBER COUNT (${initialCount} MEMBERS) & STRICT NO-EXTRA-PEOPLE RULE:
The photoshoot MUST feature EXACTLY ${initialCount} HUMAN IDOLS (${initialMemberNames}) — NO MORE, NO LESS.
- EXACTLY ${initialCount} HUMAN IDOLS: The photo MUST contain ONLY Member 1 through Member ${initialCount} listed below.
- ABSOLUTELY NO EXTRA PEOPLE OR STRANGERS: Do NOT add any extra random people, strangers, background dancers, standard models, or unrequested idols.
- ABSOLUTELY NO CLONES OR DUPLICATES: Each idol in the photo corresponds strictly to ONE distinct member from their attached reference image.
- DO NOT OMIT ANY MEMBER: Every listed member (${initialMemberNames}) MUST be clearly visible standing together.

MANDATORY MEMBER REFERENCE LIST (${initialCount} MEMBERS):
${memberDescriptions}

CRITICAL FRAMING (UPPER BODY CLOSE-UP ONLY - NO LEGS):
This photo MUST be a tight, zoomed-in upper-body portrait framing the idols from the chest/waist up ONLY. Focus strictly on their faces, hairstyles, and upper-body stage tops. ABSOLUTELY NO LEGS OR FEET SHOULD BE VISIBLE IN THIS CLOSE-UP PORTRAIT.

K-POP GROUP FORMATION & POSING DIRECTIVE (STRICT NO-LEANING RULE):
- FORMATION TYPE: ${randomFormation.name}.
${randomFormation.prompt}
- ZERO LEAN-ON-SHOULDERS RULE (CRITICAL): ABSOLUTELY NO resting heads on shoulders, NO identical leaning poses, and NO repetitive clutching or leaning on adjacent idols' shoulders.
- DIVERSE INDIVIDUALIZED ANGLES & POSTURES: Every single member MUST adopt a different head angle, shoulder level, and upper-body orientation:
  * Staggered shoulder heights (some higher, some lower) to create natural photographic depth.
  * Varied head turns (one looking straight on, one angled three-quarters, one with a subtle chin-up confident look).
  * Varied upper-body stances (subtle arm positions, relaxed open posture, chic model shoulder angle, one hand lightly near jacket collar or waist).

CRITICAL EXPRESSION & ENERGY DIRECTIVE (STRICTLY NO UNHAPPY, SULLEN, GLOOMY, OR BORED FACES):
- EXPRESSION STYLE: ${randomExpression.name}.
${randomExpression.prompt}
- ABSOLUTELY NO UNHAPPY OR SAD FACES: Under NO circumstances should any idol look depressed, angry, deadpan, or bored. Every single idol MUST exude star charisma, joyful radiant warmth, or magnetic pleasant confidence.

STRICT WARDROBE LOCK (PRESERVE INDIVIDUAL PROFILE OUTFITS):
- CRITICAL: Every idol MUST wear the EXACT outfit they wore in their individual profile photo card attached as their reference image. DO NOT invent new wardrobe styling or replace their outfits. Faithfully replicate each member's specific stage top, fabrics, jacket details, and accessories as shown in their profile reference image.

STUDIO SET & BESPOKE 3D WALL TYPOGRAPHY:
${randomStudioSet.prompt}
Mounted high on the studio backdrop wall directly above/behind the group is the group name "${profile.groupName}".
- UNIQUE LOGOTYPE STYLING: It MUST NOT look like a generic Arial or plain font. It must be crafted as a custom, high-end 3D sculptural typographic art installation matching their concept (e.g., fluid chrome metallic lettering, sharp geometric architectural bevels, or layered frosted acrylic).
- VIBRANT OFFICIAL BRAND COLORS INTEGRATION: The 3D typography of "${profile.groupName}" MUST prominently feature the group's official brand colors (${colorDescription}). Use ${primaryColor.name} (${primaryColor.hex}) for the primary letter illumination/material finish and ${secondaryColor.name} (${secondaryColor.hex}) for dynamic edge neon halos, inner core luminescence, or subtle ambient wall reflection glow. The logo is crisp, legible, iconic, and high-fashion.
Fresh, healthy, bare-faced glowing natural skin aesthetic. Crisp 8k photorealistic quality.`;
        } else {
          prompt = isSoloAct ? `A hyper-realistic 16:9 WIDE-ANGLE FULL BODY HEAD-TO-TOE photoshoot of the K-pop solo artist "${profile.groupName}" (${initialMemberNames}).

CRITICAL SINGLE ARTIST MANDATE & STRICT NO-EXTRA-PEOPLE RULE:
The photoshoot MUST feature EXACTLY 1 HUMAN ARTIST (${initialMemberNames}) completely from head to toe standing on the studio floor — NO MORE, NO LESS.
- EXACTLY 1 HUMAN ARTIST: The photo MUST contain ONLY the solo artist ${initialMemberNames}.
- ABSOLUTELY NO EXTRA PEOPLE OR STRANGERS: Do NOT add background dancers, strangers, or other models.
- ABSOLUTELY NO CLONES: The photo corresponds strictly to the solo artist from their attached reference image.

MANDATORY ARTIST REFERENCE:
${memberDescriptions}

CRITICAL WIDE CAMERA DISTANCE & 100% HEAD-TO-TOE FRAMING:
This photo MUST be a wide-angle full-length shot with the camera positioned at a far enough distance to capture the solo artist standing on the studio floor completely from head to toe.
- FULL HEIGHT SILHOUETTE: Entire body — including head, hairstyle, upper outfit, pants/skirt, ankles, and footwear/shoes — MUST BE 100% FULLY VISIBLE.
- NO CROPPING: ABSOLUTELY DO NOT CROP, CUT OFF, OR TRUNCATE LEGS, FEET, OR SHOES AT ALL.
- FLOOR & CEILING SPACE: Leave clearly visible studio floor space underneath their shoes and wall space above their head.

SOLO ARTIST STANDING PHOTOGRAPHY MANDATE:
- The solo artist MUST BE STANDING ON THE STUDIO FLOOR. Dynamic, stylish high-fashion standing pose with weight shifted to one hip, relaxed arms or hands subtly at sides, and effortless star charisma.
- EXPRESSION STYLE: ${randomExpression.name}. ${randomExpression.prompt}
- CHARISMATIC STAR PRESENCE: Exude star aura, effortless charm, and magnetic confidence. No gloomy, sad, or deadpan faces.

STRICT WARDROBE LOCK (PRESERVE PROFILE OUTFIT):
- CRITICAL: The artist MUST wear the EXACT outfit they wore in their individual profile photo card attached as their reference image. Replicate their specific stage outfit, tops, bottoms, shoes, and accessories faithfully.

STUDIO SET & BESPOKE 3D WALL TYPOGRAPHY:
${randomStudioSet.prompt}
Mounted high on the studio backdrop wall directly behind the artist is the official artist name "${profile.groupName}".
- UNIQUE LOGOTYPE STYLING: Custom, high-end 3D sculptural typographic art installation matching their concept.
- VIBRANT OFFICIAL BRAND COLORS INTEGRATION: The 3D typography of "${profile.groupName}" MUST prominently feature official brand colors (${colorDescription}).
Fresh, healthy, bare-faced glowing natural skin aesthetic. Crisp 8k photorealistic quality.`
          : `A hyper-realistic 16:9 WIDE-ANGLE FULL BODY HEAD-TO-TOE group photoshoot of the K-pop group "${profile.groupName}".

CRITICAL TOTAL MEMBER COUNT (${initialCount} MEMBERS) & STRICT NO-EXTRA-PEOPLE RULE:
The photoshoot MUST feature EXACTLY ${initialCount} HUMAN IDOLS (${initialMemberNames}) completely from head to toe standing on the studio floor — NO MORE, NO LESS.
- EXACTLY ${initialCount} HUMAN IDOLS: The photo MUST contain ONLY Member 1 through Member ${initialCount} listed below.
- ABSOLUTELY NO EXTRA PEOPLE OR STRANGERS: Do NOT add any extra random people, strangers, background dancers, standard models, or unrequested idols.
- ABSOLUTELY NO CLONES OR DUPLICATES: Each idol in the photo corresponds strictly to ONE distinct member from their attached reference image.
- DO NOT OMIT ANY MEMBER: Every listed member (${initialMemberNames}) MUST be clearly visible standing together.

MANDATORY MEMBER REFERENCE LIST (${initialCount} MEMBERS):
${memberDescriptions}

CRITICAL WIDE CAMERA DISTANCE & 100% HEAD-TO-TOE FRAMING:
This photo MUST be a wide-angle full-length shot with the camera positioned at a far enough distance to capture ALL ${initialCount} idols standing on the studio floor completely from head to toe.
- FULL HEIGHT SILHOUETTES: Every idol's entire body — including head, hairstyle, upper outfit, pants/skirt, ankles, and footwear/shoes — MUST BE 100% FULLY VISIBLE.
- NO CROPPING: ABSOLUTELY DO NOT CROP, CUT OFF, OR TRUNCATE THEIR LEGS, FEET, OR SHOES AT ALL.
- FLOOR & CEILING SPACE: Leave clearly visible studio floor space underneath their shoes and wall space above their heads.

K-POP GROUP FORMATION & POSING DIRECTIVE (PROFESSIONAL STANDING PHOTOGRAPHY ONLY):
- FORMATION TYPE: ${randomFormation.name}.
${randomFormation.prompt}
- STRICT STANDING PHOTOGRAPHY MANDATE: ALL ${initialCount} IDOLS MUST BE STANDING ON THE STUDIO FLOOR. ABSOLUTELY NO SITTING DOWN, NO PERCHING ON BLOCKS, NO CHAIRS, NO STOOLS, AND NO ACRYLIC CUBES. Group depth must be achieved purely through authentic standing photographic planes (front-to-back z-axis staggering and contrapposto weight shifts) so full-body silhouettes and eye-level framing remain pristine.
- ZERO LEAN-ON-SHOULDERS RULE (CRITICAL): ABSOLUTELY NO idols leaning on each other's shoulders, NO heads resting on shoulders, NO domino leaning sideways, and NO identical train of hands on adjacent shoulders.
- DIVERSE INDIVIDUAL STANDING POSTURES: EVERY SINGLE IDOL MUST HAVE A COMPLETELY UNIQUE AND DISTINCT STANDING BODY POSE AND ANGLE:
  * Member 1 might stand tall in a 3/4 high-fashion silhouette with hands casually in pockets and direct confident gaze.
  * Member 2 might adopt a dynamic model stance with weight shifted to one hip, relaxed arms, and a slight subtle head tilt.
  * Member 3 might stand in an open, upright editorial posture with one hand casually resting near their waist or jacket lapel.
  * Member 4 might stand with arms folded loosely across the chest in a chic editorial posture.
  * Member 5 might turn slightly in profile with a sharp jawline glance toward the camera.
- EDITORIAL LEVEL BLOCKING & SPATIAL FORMATION: Arrange the group in a dynamic staggered editorial standing formation matching ${randomFormation.name}. Do NOT line them up in a boring flat military row or have everyone doing the exact same pose.
- CHARISMATIC INDIVIDUAL VIBES: Each member exudes their own distinct star presence and effortless charm while feeling part of the same elite team.

CRITICAL EXPRESSION & ENERGY DIRECTIVE (STRICTLY NO UNHAPPY, SULLEN, GLOOMY, OR BORED FACES):
- EXPRESSION STYLE: ${randomExpression.name}.
${randomExpression.prompt}
- ABSOLUTELY NO UNHAPPY OR SAD FACES: Under NO circumstances should any idol look depressed, angry, deadpan, or bored. Every single idol MUST exude star charisma, joyful radiant warmth, or magnetic pleasant confidence.

STRICT WARDROBE LOCK (PRESERVE INDIVIDUAL PROFILE OUTFITS):
- CRITICAL: Every idol MUST wear the EXACT outfit they wore in their individual profile photo card attached as their reference image. DO NOT invent new wardrobe styling or replace their outfits. Faithfully replicate each member's specific stage outfit, tops, bottoms, shoes, and accessories as shown in their profile reference image.

STUDIO SET & BESPOKE 3D WALL TYPOGRAPHY:
${randomStudioSet.prompt}
Mounted high on the studio backdrop wall directly above/behind the group is the group name "${profile.groupName}".
- UNIQUE LOGOTYPE STYLING: It MUST NOT look like generic Arial or plain font. It must be crafted as a custom, high-end 3D sculptural typographic art installation matching their concept (e.g., fluid chrome metallic lettering, sharp geometric architectural bevels, or layered frosted acrylic).
- VIBRANT OFFICIAL BRAND COLORS INTEGRATION: The 3D typography of "${profile.groupName}" MUST prominently feature the group's official brand colors (${colorDescription}). Use ${primaryColor.name} (${primaryColor.hex}) for the primary letter illumination/material finish and ${secondaryColor.name} (${secondaryColor.hex}) for dynamic edge neon halos, inner core luminescence, or subtle ambient wall reflection glow. The logo is crisp, legible, iconic, and high-fashion.
Fresh, healthy, bare-faced glowing natural skin aesthetic. Crisp 8k photorealistic quality.`;
        }
      }

      const generatedImg = await generateImage(prompt, "16:9", memberRefs.length > 0 ? memberRefs : undefined);
      const includesAll = isSoloAct ? true : (numMembers <= initialCount);

      setProfile(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          groupPhotoUrl: generatedImg,
          groupPhotoWaistUpUrl: isWaistUp ? generatedImg : prev.groupPhotoWaistUpUrl,
          groupPhotoFullBodyUrl: !isWaistUp ? generatedImg : prev.groupPhotoFullBodyUrl,
          groupPhotoIncludesAll: includesAll,
          membersInPhotoCount: initialCount
        };
      });
      setGroupPhotoIncludesAll(includesAll);
    } catch (err: any) {
      console.error(err);
      setGroupPhotoError(err.message || "Failed to generate group photo.");
    } finally {
      setIsGeneratingGroupPhoto(false);
    }
  };

  const handleAddRemainingMembersToGroupPhoto = async () => {
    if (!profile || !profile.members) return;

    const isWaistUp = photoshootViewMode === 'waistUp';
    const activeBasePhoto = (isWaistUp ? profile.groupPhotoWaistUpUrl : profile.groupPhotoFullBodyUrl) || profile.groupPhotoUrl || profile.groupPhotoWaistUpUrl || profile.groupPhotoFullBodyUrl;

    if (!activeBasePhoto) return;

    setIsAddingMembers(true);
    setGroupPhotoError(null);
    try {
      const { generateImage } = await import('./services/geminiService');
      const numMembers = profile.members.length;
      const startIndex = profile.membersInPhotoCount || 3;
      // Add at most 2 members at a time so reference image array never exceeds 3 items
      const batchSize = Math.min(2, numMembers - startIndex);
      const endIndex = startIndex + batchSize;

      const presentMembers = profile.members.slice(0, startIndex);
      const presentNames = presentMembers.map((m, i) => `Member ${i + 1} (${m.stageName})`).join(', ');

      const newMembers = profile.members.slice(startIndex, endIndex);
      const newNames = newMembers.map((m, i) => `Member ${startIndex + i + 1} (${m.stageName})`).join(' & ');

      let prompt = `You are a master editorial K-pop photo editor.
Attached as [IMAGE PART 1] is the current ${isWaistUp ? 'medium waist-up close-up' : 'wide-angle full-body head-to-toe'} group photo featuring ${startIndex} members of K-pop group "${profile.groupName}": ${presentNames}.

YOUR CRITICAL MANDATE:
Seamlessly ADD ${newMembers.length} NEW MEMBER(S) (${newNames}) into this photoshoot composition alongside the existing ${startIndex} members to create an updated group photo featuring EXACTLY ${endIndex} members in total.

CRITICAL TOTAL MEMBER COUNT (${endIndex} MEMBERS IN TOTAL) & STRICT NO-EXTRA-PEOPLE RULE:
The updated photo MUST contain EXACTLY ${endIndex} HUMAN IDOLS IN TOTAL — NO MORE, NO LESS:
- All ${startIndex} existing idols from [IMAGE PART 1]: ${presentNames}.
- ${newMembers.length} new idol(s): ${newNames}.
- ABSOLUTELY NO EXTRA PEOPLE, STRANGERS, OR BACKGROUND DANCERS.

CRITICAL IDENTITY, OUTFIT & BACKGROUND LOCK FROM [IMAGE PART 1]:
1. PRESERVE EXISTING MEMBERS (${presentNames}): Keep all ${startIndex} existing idols in their EXACT current faces, hairstyles, skin tones, poses, relative order, and stage outfits as rendered in [IMAGE PART 1]. Do NOT alter, swap, duplicate, or remove them.
2. PRESERVE STUDIO SET & LOGO: Maintain the EXACT background studio wall, soft lighting, and the stylized 3D custom typography logo of "${profile.groupName}" centered on the wall behind them from [IMAGE PART 1].

MANDATORY OUTFIT & HAIRSTYLE FAITHFULNESS FOR NEW MEMBER(S):
`;

      const imagesToPass: { label: string; dataUrl: string }[] = [
        {
          label: `[IMAGE PART 1] Base Group Photo with ${startIndex} members (${presentNames})`,
          dataUrl: activeBasePhoto
        }
      ];

      newMembers.forEach((m, idx) => {
        const memberIndex = startIndex + idx;
        const hairDesc = m.currentHairStyle || m.dyedHairColor || m.originalHairColor || 'stylish idol hair';
        const outfitDesc = m.stageOutfit || m.conceptOutfit || 'designer K-pop stage outfit';
        const refImg = (m.fullBodyImages && m.fullBodyImages.length > 0) ? m.fullBodyImages[0] : m.imageUrl;

        prompt += `- New Member ${memberIndex + 1} (${m.stageName}): COPY THEIR EXACT FACE, EXACT HAIRSTYLE ("${hairDesc}"), HAIR COLOR, AND EXACT STAGE OUTFIT ("${outfitDesc}") FROM [IMAGE PART ${idx + 2}: Member ${memberIndex + 1} (${m.stageName}) Reference Card]. Do NOT alter their haircut, do NOT change their hair color, and do NOT change or re-style their clothing design. They must wear their exact profile card outfit.\n`;

        if (refImg) {
          imagesToPass.push({
            label: `[IMAGE PART ${idx + 2}] Member ${memberIndex + 1} (${m.stageName}) Reference Card`,
            dataUrl: refImg
          });
        }
      });

      const randomFormation = KPOP_PHOTOSHOOT_FORMATIONS[Math.floor(Math.random() * KPOP_PHOTOSHOOT_FORMATIONS.length)] || KPOP_PHOTOSHOOT_FORMATIONS[0];
      const randomExpression = KPOP_PHOTOSHOOT_EXPRESSIONS[Math.floor(Math.random() * KPOP_PHOTOSHOOT_EXPRESSIONS.length)] || KPOP_PHOTOSHOOT_EXPRESSIONS[0];

      prompt += `
CRITICAL EXPRESSION & ENERGY DIRECTIVE (STRICTLY NO UNHAPPY, SULLEN, GLOOMY, OR BORED FACES):
- EXPRESSION STYLE: ${randomExpression.name}.
${randomExpression.prompt}
- ABSOLUTELY NO UNHAPPY OR SAD FACES: Under NO circumstances should any idol look depressed, angry, deadpan, or bored. Every single idol MUST exude star charisma, joyful radiant warmth, or magnetic pleasant confidence.

MANDATORY ASYMMETRICAL EDITORIAL POSING & INDIVIDUAL DIVERSITY:
${isWaistUp ? '- EDITORIAL UPPER-BODY CLOSE-UP FRAMING: Frame all idols strictly from the chest/waist up. Every member must adopt a distinct head angle, shoulder level, and upper-body orientation. ABSOLUTELY NO LEGS OR FEET VISIBLE.' : '- STRICT STANDING PHOTOGRAPHY MANDATE: ALL ' + endIndex + ' IDOLS MUST BE STANDING ON THE STUDIO FLOOR. ABSOLUTELY NO SITTING DOWN, NO PERCHING ON BLOCKS, NO STOOLS, AND NO CHAIRS.'}
- ZERO LEAN-ON-SHOULDERS RULE (CRITICAL): ABSOLUTELY NO idols leaning on each other's shoulders, NO resting heads on shoulders, and NO domino leaning sideways.
- FORMATION & SPATIAL STAGING: Position ${newNames} naturally into the ${randomFormation.name} photoshoot composition with their own completely distinct, individual model posture and angle (e.g., standing tall with hands in pockets, relaxed weight-shifted contrapposto stance, subtle 3/4 turn fashion silhouette, or arms loosely folded). Every member must have a distinct angle and pose.
${isWaistUp ? 'CRITICAL FRAMING: Maintain a tight medium waist-up close-up portrait focusing strictly on upper body stage tops and faces. ABSOLUTELY NO LEGS OR FEET VISIBLE.' : 'CRITICAL WIDE-ANGLE FRAMING: Show complete head-to-toe silhouettes of all ' + endIndex + ' members with full outfits and shoes standing on the floor. DO NOT CROP FEET OR LEGS.'}

ENVIRONMENT & LIGHTING:
Maintain the exact studio background set, soft professional studio lighting, and the stylized 3D custom typography logo of "${profile.groupName}" rendered with the official brand colors from [IMAGE PART 1]. Fresh, healthy, bare-faced glowing natural skin aesthetic. Crisp 8k photorealistic quality.`;

      const img = await generateImage(prompt, "16:9", imagesToPass);
      const includesAll = endIndex >= numMembers;

      setProfile(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          groupPhotoUrl: img,
          groupPhotoWaistUpUrl: isWaistUp ? img : prev.groupPhotoWaistUpUrl,
          groupPhotoFullBodyUrl: !isWaistUp ? img : prev.groupPhotoFullBodyUrl,
          groupPhotoIncludesAll: includesAll,
          membersInPhotoCount: endIndex
        };
      });
      setGroupPhotoIncludesAll(includesAll);
    } catch (err: any) {
      console.error(err);
      setGroupPhotoError(err.message || "Failed to add remaining members.");
    } finally {
      setIsAddingMembers(false);
    }
  };

  const handleSwitchPhotoshootViewMode = (mode: 'waistUp' | 'fullBody') => {
    setPhotoshootViewMode(mode);
    setGroupPhotoError(null);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 p-2 sm:p-4 font-sans selection:bg-indigo-100 flex flex-col">
      <header className="flex-none max-w-6xl w-full mx-auto mb-2 border-b border-neutral-200 pb-2 flex flex-col md:flex-row justify-between items-center gap-1">
        <div className="text-left flex items-center gap-4">
          <button 
            onClick={() => setProfile(null)}
            className="text-[8px] font-black uppercase tracking-widest text-neutral-400 hover:text-indigo-600 border border-neutral-200 px-3 py-1.5 rounded-full hover:bg-white transition-all"
          >
            Home
          </button>
          <div>
            <h1 className="text-lg font-black text-indigo-950 uppercase tracking-tighter">
              A&R Management Suite <span className="text-indigo-500">v3.0</span>
            </h1>
            <p className="text-[8px] text-neutral-400 font-bold uppercase tracking-[0.1em]">Agency Strategic Intelligence & Profile System</p>
          </div>
        </div>
        {profile && (
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
            <button
              onClick={() => exportDossierToPdf(profile as FullProfile)}
              className="px-3.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-[#4f46e5] bg-[#eeebfe] hover:bg-[#e4dffe] border border-[#d2c9fd] shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              title={isSolo ? "Compile artist profile, official photoshoot, mascot, lightstick, records, and casting info into a print-ready PDF" : "Compile all group subjects, official photoshoot, mascot, lightstick, records, and casting info into a print-ready PDF"}
            >
              <svg className="w-3 h-3 text-[#4f46e5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Export as Fan Wiki (PDF)</span>
            </button>
            <nav className="flex bg-white rounded-full p-0.5 shadow-sm border border-neutral-200">
              {([
                { id: 'overview' as const, label: 'Overview', activeClass: 'bg-indigo-600 text-white shadow-md' },
                { id: 'lineup' as const, label: isSolo ? 'Artist Profile' : 'Lineup', activeClass: 'bg-fuchsia-600 text-white shadow-md' },
                { id: 'records' as const, label: 'Records', activeClass: 'bg-emerald-600 text-white shadow-md' },
                { id: 'fandom' as const, label: 'Fandom & Merch', activeClass: 'bg-rose-600 text-white shadow-md' },
                { id: 'studio' as const, label: 'Creative Studio', activeClass: 'bg-amber-600 text-white shadow-md' }
              ]).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                    activeTab === tab.id 
                      ? tab.activeClass 
                      : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-grow max-w-6xl w-full mx-auto flex flex-col">
        {!profile && (
          <div className="flex-grow flex items-center justify-center">
            <UserInputForm 
              onGenerate={handleGenerateOverview} 
              onProfileUpload={handleProfileFileUpload}
              isLoading={isLoading} 
            />
          </div>
        )}

        {isLoading && <div className="flex-grow flex items-center justify-center"><LoadingSpinner message={loadingMessage} /></div>}
        {error && <div className="p-2 bg-red-50 text-red-600 rounded-lg border border-red-100 text-center font-bold text-[10px]">{error}</div>}

        {profile && !isLoading && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {activeTab === 'overview' && (
              <GroupProfileDisplay 
                groupProfile={profile as GroupProfileData} 
                groupType={profile.groupType!} 
                view="overview" 
                theme={TAB_THEMES.overview}
                onUpdateProfile={(updated) => setProfile(prev => ({ ...prev, ...updated }))}
                onRegenerateOverviewKeepName={handleRegenerateOverviewKeepName}
              />
            )}
            
            {activeTab === 'records' && (
              <div className="space-y-4">
                <GroupProfileDisplay 
                  groupProfile={profile as GroupProfileData} 
                  groupType={profile.groupType!} 
                  view="records" 
                  theme={TAB_THEMES.records} 
                  onGenerateNextAlbum={handleGenerateNextAlbum}
                  isComposingAlbum={isComposingAlbum}
                  onUpdateProfile={(updated) => setProfile(prev => ({ ...prev, ...updated }))}
                  onNavigateToLineup={() => setActiveTab('lineup')}
                />
              </div>
            )}

            {activeTab === 'fandom' && (
              <FandomExtras 
                profile={profile as FullProfile} 
                onUpdateProfile={(updated) => setProfile(prev => ({ ...prev, ...updated }))}
              />
            )}

            {activeTab === 'studio' && (
              <CreativeStudio 
                groupProfile={profile as FullProfile} 
                isSolo={isSolo} 
                onUpdateProfile={(updated) => setProfile(prev => ({ ...prev, ...updated }))}
              />
            )}

            {activeTab === 'lineup' && (
              <div className="space-y-4">
                {/* Full Lineup Generated Announcement & Sequential Bio Generation Banner */}
                {profile.members && profile.members.length >= targetMemberCount && (
                  <div className="bg-gradient-to-r from-indigo-950 via-neutral-900 to-indigo-950 text-white rounded-2xl p-5 sm:p-6 border border-indigo-500/30 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          {isSolo ? 'Solo Artist Profile Complete' : 'Lineup Profiles Complete'}
                        </span>
                        <span className="text-indigo-200 text-xs font-bold">
                          {isSolo ? 'Solo Artist Cast' : `${profile.members.length} of ${targetMemberCount} Members Cast`}
                        </span>
                      </div>
                      
                      <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                        <span>{isSolo ? '✨ Solo Artist Profile Is Cast!' : '✨ All Member Profiles Are Cast!'}</span>
                      </h3>
                      
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        {profile.members.some(m => !m.bio || m.bio.trim() === '') ? (
                          isSolo ? (
                            <>
                              Artist visual attributes, vocal tone, and musical traits are ready. Click below to craft an authentic, deeply believable <strong>2-to-3 paragraph solo artist biography</strong>, complete with trainee memories, personal musical inspirations, and debut narrative.
                            </>
                          ) : (
                            <>
                              All member visual attributes, positions, and musical traits are ready. Click below to craft authentic, deeply believable <strong>2-to-3 paragraph idol biographies</strong> sequentially one at a time, complete with trainee memories, dorm dynamics, and group chemistry.
                            </>
                          )
                        ) : (
                          isSolo ? (
                            <>
                              Artist biography is complete with personal musical journey and trainee backstory. You can rewrite it whenever you wish.
                            </>
                          ) : (
                            <>
                              All member biographies are complete with full group chemistry and dorm dynamics. You can generate or rewrite them sequentially one at a time in order whenever you wish.
                            </>
                          )
                        )}
                      </p>

                      {/* Live Sequential Bio Progress Indicator */}
                      {isGeneratingBiographies && bioProgressMessage && (
                        <div className="mt-3 bg-indigo-900/60 border border-indigo-500/40 rounded-xl p-3.5 flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-indigo-300 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-white truncate">{bioProgressMessage}</p>
                            <div className="w-full bg-indigo-950/80 rounded-full h-1.5 mt-2 overflow-hidden">
                              <div 
                                className="bg-gradient-to-r from-indigo-400 to-fuchsia-400 h-full transition-all duration-500 rounded-full"
                                style={{ width: `${(((bioProgressIndex ?? 0) + 1) / (profile.members?.length || 1)) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {bioNoticeSuccess && !isGeneratingBiographies && (
                        <div className="mt-2 text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                          <span>{isSolo ? '✅ Solo artist biography has been successfully written!' : '✅ All member biographies have been successfully written and synchronized!'}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-shrink-0 w-full md:w-auto">
                      <button
                        onClick={handleGenerateAllBiographies}
                        disabled={isGeneratingBiographies || isCastingMember}
                        className="w-full md:w-auto bg-gradient-to-r from-indigo-500 via-indigo-600 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 active:scale-95 text-white px-6 py-3.5 rounded-full font-black uppercase tracking-widest text-xs shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer border border-white/10"
                      >
                        {isGeneratingBiographies ? (
                          <>
                            <span className="animate-spin text-sm">⚡</span>
                            <span>{isSolo ? 'Writing Artist Bio...' : 'Writing Bios in Order...'}</span>
                          </>
                        ) : (
                          <>
                            <span>
                              {isSolo
                                ? (profile.members[0]?.bio && profile.members[0].bio.trim() !== '' ? '🔄 Rewrite Artist Biography' : '✨ Write Artist Biography')
                                : (profile.members.some(m => !m.bio || m.bio.trim() === '') ? '✨ Start Generating Biographies (1-by-1)' : '🔄 Rewrite All Biographies (In Order)')
                              }
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {profile.members && profile.members.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {profile.members.map((member, index) => (
                      recastingIndex === index ? (
                        <div key={index} className="flex flex-col items-center justify-center p-8 bg-white border border-neutral-200 rounded-xl min-h-[400px]">
                          <LoadingSpinner message={isSolo ? "Recasting Artist..." : "Recasting Member..."} />
                        </div>
                      ) : (
                        <MemberProfileCard 
                          key={index} 
                          member={member} 
                          memberIndex={index}
                          allMembers={profile.members}
                          groupColors={profile.officialColors || []} 
                          isSolo={isSolo}
                          groupType={userInput?.groupType || profile.groupType}
                          groupName={profile.groupName}
                          groupConcept={profile.conceptDescription || ''}
                          debutAlbumTheme={profile.discography?.[0]?.conceptSummary || profile.conceptDescription || ''}
                          debutAlbumTitle={profile.discography?.[0]?.title || ''}
                          onRegenerateMember={() => handleRegenerateMember(index)}
                          onGenerateBio={() => handleGenerateSingleBio(index)}
                          isGeneratingBio={bioProgressIndex === index || (isGeneratingBiographies && recastingIndex !== index)}
                          onUpdateMember={(updatedMember) => {
                            setProfile(prev => {
                              if (!prev || !prev.members) return prev;
                              const newMembers = [...prev.members];
                              newMembers[index] = updatedMember;
                              return { ...prev, members: newMembers };
                            });
                          }}
                        />
                      )
                    ))}
                  </div>
                )}
                
                {(!profile.members || profile.members.length < targetMemberCount) && (
                  <div className="py-6 text-center bg-white rounded-xl border border-neutral-200 shadow-sm">
                    <p className="text-neutral-400 font-bold uppercase tracking-widest mb-2 text-[10px]">
                      {profile.members?.length 
                        ? `Cast Member ${profile.members.length + 1} of ${targetMemberCount}` 
                        : (isSolo ? 'Soloist not yet cast.' : 'Lineup not yet cast.')}
                    </p>
                    <button 
                      onClick={handleGenerateNextMember}
                      disabled={isCastingMember}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-full font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-md text-[10px] disabled:opacity-50"
                    >
                      {isCastingMember 
                        ? 'Casting...' 
                        : (profile.members?.length 
                            ? 'Cast Next Member' 
                            : (isSolo ? 'Cast Soloist' : 'Cast First Member'))}
                    </button>
                  </div>
                )}

                {profile.members && profile.members.length === targetMemberCount && profile.members.every(m => m.imageUrl) && (
                  <div className="mt-8 py-6 px-4 sm:px-6 bg-white rounded-2xl border border-neutral-200 shadow-sm flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                      <h3 className="text-sm font-black uppercase tracking-widest text-indigo-950">
                        {isSolo ? 'Official Artist Photoshoot Studio' : 'Official Group Photoshoot Studio'}
                      </h3>
                    </div>
                    <p className="text-xs text-neutral-500 mb-6 max-w-xl text-center">
                      {isSolo
                        ? "Auto-composed randomized photoshoot studio set keeping the artist's exact profile outfit intact."
                        : "Auto-composed randomized photoshoot studio set keeping each idol's exact profile outfit intact with authentic member cohesion."}
                    </p>
                    
                    {/* View Mode Selector (Select beforehand or switch views later) */}
                    <div className="flex items-center gap-2 bg-neutral-100 p-1.5 rounded-full border border-neutral-200 mb-6 shadow-inner">
                      <button
                        onClick={() => handleSwitchPhotoshootViewMode('fullBody')}
                        className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 ${
                          photoshootViewMode === 'fullBody'
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60'
                        }`}
                      >
                        <span>🧍 Full Body Shot (Head-to-Toe)</span>
                        {profile.groupPhotoFullBodyUrl && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shadow-sm" title="Shot ready" />
                        )}
                      </button>
                      <button
                        onClick={() => handleSwitchPhotoshootViewMode('waistUp')}
                        className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 ${
                          photoshootViewMode === 'waistUp'
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60'
                        }`}
                      >
                        <span>👤 Upper Body Portrait (Waist-Up)</span>
                        {profile.groupPhotoWaistUpUrl && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shadow-sm" title="Shot ready" />
                        )}
                      </button>
                    </div>

                    {(() => {
                      const hasAnyGroupPhoto = Boolean(profile.groupPhotoWaistUpUrl || profile.groupPhotoFullBodyUrl || profile.groupPhotoUrl);
                      const activeImage = photoshootViewMode === 'waistUp' 
                        ? profile.groupPhotoWaistUpUrl
                        : profile.groupPhotoFullBodyUrl;
                      const otherImage = photoshootViewMode === 'waistUp'
                        ? profile.groupPhotoFullBodyUrl
                        : profile.groupPhotoWaistUpUrl;
                      const thisLabel = photoshootViewMode === 'waistUp' ? 'Upper Body Portrait' : 'Full Body Shot';
                      const otherLabel = photoshootViewMode === 'waistUp' ? 'Full Body Shot' : 'Upper Body Portrait';
                      const currentMemberCount = profile.membersInPhotoCount || Math.min(3, profile.members?.length || 3);

                      if (!hasAnyGroupPhoto) {
                        return (
                          <button 
                            onClick={() => handleGenerateGroupPhoto(photoshootViewMode)}
                            disabled={isGeneratingGroupPhoto}
                            className="bg-indigo-600 text-white px-8 py-3.5 rounded-full font-black uppercase tracking-widest hover:bg-indigo-700 active:scale-95 transition-all shadow-md text-xs disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                          >
                            {isGeneratingGroupPhoto ? (
                              <>
                                <span className="animate-spin text-white">⚡</span>
                                <span>Setting up Studio & Shooting {thisLabel}...</span>
                              </>
                            ) : (
                              <span>✨ Start Photoshoot ({thisLabel})</span>
                            )}
                          </button>
                        );
                      }

                      return (
                        <div className="w-full flex flex-col items-center space-y-4">
                          {/* Custom Typography Marquee with Official Group Colors */}
                          {(() => {
                            const primaryHex = profile.officialColors?.[0]?.hex || '#4F46E5';
                            const secondaryHex = profile.officialColors?.[1]?.hex || primaryHex;
                            return (
                              <div className="w-full max-w-4xl bg-neutral-950 text-white rounded-2xl p-5 border border-neutral-800 shadow-xl relative overflow-hidden flex flex-col items-center justify-center">
                                {/* Ambient glowing radial blur */}
                                <div 
                                  className="absolute -top-12 -left-12 w-48 h-48 rounded-full blur-3xl opacity-25 pointer-events-none"
                                  style={{ backgroundColor: primaryHex }}
                                />
                                <div 
                                  className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-25 pointer-events-none"
                                  style={{ backgroundColor: secondaryHex }}
                                />
                                
                                <div className="flex items-center gap-2 mb-2 z-10">
                                  <span className="text-[8px] font-black uppercase tracking-[0.3em] text-neutral-400">
                                    OFFICIAL A&R EDITORIAL PHOTOSHOOT
                                  </span>
                                  <span className="text-neutral-600">•</span>
                                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-neutral-300">
                                    {profile.agency || 'Global A&R'}
                                  </span>
                                </div>

                                {/* Stylized Bespoke Typography with Official Colors */}
                                <h2 
                                  className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-wider leading-none mb-3 select-none transition-all drop-shadow-lg"
                                  style={{
                                    fontFamily: "'Unbounded', 'Syne', sans-serif",
                                    background: profile.officialColors && profile.officialColors.length > 1
                                      ? `linear-gradient(135deg, #FFFFFF 0%, ${primaryHex} 40%, ${secondaryHex} 100%)`
                                      : (primaryHex ? `linear-gradient(135deg, #FFFFFF 20%, ${primaryHex} 100%)` : '#FFFFFF'),
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    filter: `drop-shadow(0 0 20px ${primaryHex}55)`
                                  }}
                                >
                                  {profile.groupName}
                                </h2>

                                {/* Official Palette Swatches */}
                                <div className="flex flex-wrap items-center justify-center gap-2 z-10">
                                  {profile.officialColors && profile.officialColors.length > 0 ? (
                                    profile.officialColors.map((c, idx) => (
                                      <div key={idx} className="flex items-center gap-1.5 bg-neutral-900/90 border border-neutral-700/80 px-3 py-1 rounded-full text-[9px] font-bold shadow-sm">
                                        <span className="w-2.5 h-2.5 rounded-full border border-white/30 shadow-inner shrink-0" style={{ backgroundColor: c.hex }} />
                                        <span className="text-neutral-200 tracking-wider font-extrabold">{c.name}</span>
                                        <span className="text-neutral-400 text-[8px] font-mono">{c.hex}</span>
                                      </div>
                                    ))
                                  ) : (
                                    <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-bold">Standard A&R Palette</span>
                                  )}
                                </div>
                              </div>
                            );
                          })()}

                          {/* Active Image Display / Shooting State / Unshot View Card */}
                          {(() => {
                            if (isGeneratingGroupPhoto) {
                              return (
                                <div className="w-full max-w-2xl bg-indigo-50/90 border-2 border-indigo-200/90 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-3 shadow-md my-2 animate-in fade-in duration-300">
                                  <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-md animate-bounce">
                                    ⚡
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-black uppercase tracking-wider text-indigo-950">
                                      {otherImage 
                                        ? `Shooting Connected 2nd Image: ${thisLabel}`
                                        : `Shooting ${thisLabel}`
                                      }
                                    </h4>
                                    <p className="text-xs text-indigo-800/90 mt-1 max-w-md font-medium leading-relaxed">
                                      {otherImage
                                        ? (isSolo
                                            ? `Using ${otherLabel} as master reference to lock the artist's likeness, stage outfit, and studio set for the connected 2nd shot...`
                                            : `Using ${otherLabel} as master reference to lock the exact ${currentMemberCount} members, stage outfits, and studio set for the connected 2nd shot...`)
                                        : (isSolo
                                            ? `Setting up studio lighting and shooting solo editorial photoshoot...`
                                            : `Setting up studio lighting and shooting ${currentMemberCount} member group photoshoot...`)
                                      }
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-xs mt-1">
                                    <span className="animate-spin text-indigo-600">⚡</span>
                                    <span>Generating Connected AI Editorial Photoshoot...</span>
                                  </div>
                                </div>
                              );
                            }

                            if (activeImage) {
                              return (
                                <div 
                                  className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 cursor-zoom-in relative group"
                                  onClick={() => setLightboxImage(activeImage)}
                                >
                                  <img 
                                    src={activeImage} 
                                    alt={`Group Photoshoot (${thisLabel})`} 
                                    className="w-full h-auto object-cover aspect-video transition-transform duration-500 group-hover:scale-105" 
                                  />
                                  <div className="absolute inset-0 bg-neutral-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="bg-white/90 text-neutral-950 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg backdrop-blur-sm">
                                      View Full Size
                                    </span>
                                  </div>
                                </div>
                              );
                            }

                            // View not shot yet: If the other shot exists, present the connected 2nd image creation
                            if (otherImage) {
                              return (
                                <div className="w-full max-w-2xl bg-indigo-50/90 border-2 border-indigo-200/90 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-4 shadow-md my-2 animate-in fade-in duration-300">
                                  <div className="flex items-center gap-2 bg-indigo-600/10 text-indigo-800 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                                    <span>🔗 Connected Photoshoot Session • Shot 2 of 2</span>
                                  </div>
                                  <div className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-md">
                                    {photoshootViewMode === 'waistUp' ? '👤' : '🧍'}
                                  </div>
                                  <div>
                                    <h4 className="text-base font-black uppercase tracking-wider text-neutral-900">
                                      Create {thisLabel} (Connected to {otherLabel})
                                    </h4>
                                    <p className="text-xs text-neutral-600 mt-1.5 max-w-md font-medium leading-relaxed">
                                      Your <strong>{otherLabel}</strong> is ready. We will use it as the master visual reference to lock the {isSolo ? 'artist' : 'exact members'}, stage outfits, facial likenesses, and the same studio backdrop — creating the 2nd image of that shot.
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => handleGenerateGroupPhoto(photoshootViewMode)}
                                    disabled={isGeneratingGroupPhoto}
                                    className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-7 py-3 rounded-full font-black uppercase tracking-widest text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                                  >
                                    <span>📸 Shoot 2nd Image ({thisLabel})</span>
                                  </button>
                                </div>
                              );
                            }

                            return (
                              <div className="w-full max-w-2xl bg-white border border-neutral-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-4 shadow-sm my-2 animate-in fade-in duration-300">
                                <div className="w-14 h-14 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-black text-2xl shadow-sm">
                                  {photoshootViewMode === 'waistUp' ? '👤' : '🧍'}
                                </div>
                                <div>
                                  <h4 className="text-base font-black uppercase tracking-wider text-neutral-900">
                                    {thisLabel}
                                  </h4>
                                  <p className="text-xs text-neutral-500 mt-1 max-w-md font-medium leading-relaxed">
                                    {photoshootViewMode === 'waistUp' 
                                      ? (isSolo
                                          ? `Shoot a dedicated upper body editorial portrait for ${profile.members[0]?.stageName || 'the artist'} with waist-up composition, fresh posing, and close-up camera angles.`
                                          : `Shoot an upper body editorial portrait for all ${currentMemberCount} member(s) with dedicated waist-up composition, fresh posing, and close-up camera angles.`)
                                      : (isSolo
                                          ? `Shoot a dedicated full body head-to-toe photoshoot for ${profile.members[0]?.stageName || 'the artist'} with full standing silhouette, footwear, and studio set.`
                                          : `Shoot a full body head-to-toe photoshoot for all ${currentMemberCount} member(s) with full standing silhouettes, footwear, and studio set.`)
                                    }
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleGenerateGroupPhoto(photoshootViewMode)}
                                  disabled={isGeneratingGroupPhoto}
                                  className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-7 py-3 rounded-full font-black uppercase tracking-widest text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                                >
                                  <span>✨ Start Photoshoot ({thisLabel})</span>
                                </button>
                              </div>
                            );
                          })()}

                          {/* Incremental Member Addition Banner & Control (Only if active image exists) */}
                          {activeImage && !isSolo && profile.members && (profile.membersInPhotoCount || 3) < profile.members.length && (() => {
                            const presentCount = profile.membersInPhotoCount || 3;
                            const remainingMembers = profile.members.slice(presentCount);
                            const nextBatch = profile.members.slice(presentCount, presentCount + 2);
                            const nextBatchNames = nextBatch.map(m => m.stageName).join(' & ');

                            return (
                              <div className="w-full max-w-2xl bg-amber-50 border-2 border-amber-300/80 rounded-2xl p-4 flex flex-col gap-3 shadow-md my-2 animate-in fade-in slide-in-from-bottom-2 duration-300 text-left">
                                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/80 pb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="bg-amber-500 text-white font-black text-[9px] uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-sm">
                                      PHOTOSHOOT SET: {presentCount} OF {profile.members.length} MEMBERS PRESENT
                                    </span>
                                  </div>
                                  <span className="text-[10px] font-black text-amber-900 uppercase tracking-widest">
                                    {remainingMembers.length} Idol(s) Remaining
                                  </span>
                                </div>

                                {/* Member lists breakdown */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                  <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/60">
                                    <span className="text-[8px] font-black text-amber-800 uppercase tracking-wider block mb-1">
                                      In Current Photoshoot ({presentCount}):
                                    </span>
                                    <div className="flex flex-wrap gap-1">
                                      {profile.members.slice(0, presentCount).map((m, idx) => (
                                        <span key={idx} className="bg-amber-100 text-amber-950 font-extrabold text-[10px] px-2 py-0.5 rounded-md border border-amber-200">
                                          #{idx + 1} {m.stageName}
                                        </span>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="bg-amber-100/80 p-2.5 rounded-xl border border-amber-300/80">
                                    <span className="text-[8px] font-black text-amber-900 uppercase tracking-wider block mb-1">
                                      Next Member(s) To Add ({nextBatch.length}):
                                    </span>
                                    <div className="flex flex-wrap gap-1">
                                      {nextBatch.map((m, idx) => (
                                        <span key={idx} className="bg-amber-600 text-white font-black text-[10px] px-2 py-0.5 rounded-md shadow-sm">
                                          +#{presentCount + idx + 1} {m.stageName}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                                  <p className="text-[10px] text-amber-900 font-medium leading-relaxed">
                                    <strong>Posing Directive:</strong> Adds{' '}
                                    <span className="font-bold underline">
                                      {nextBatchNames}
                                    </span>{' '}
                                    into the photoshoot studio set alongside current idols.
                                  </p>
                                  <button
                                    onClick={handleAddRemainingMembersToGroupPhoto}
                                    disabled={isAddingMembers || isGeneratingGroupPhoto}
                                    className="bg-amber-600 hover:bg-amber-700 active:scale-95 text-white px-5 py-2.5 rounded-full font-black uppercase tracking-widest text-xs shadow-md flex items-center gap-2 shrink-0 disabled:opacity-50 transition-all cursor-pointer w-full sm:w-auto justify-center"
                                  >
                                    {isAddingMembers ? (
                                      <>
                                        <span className="animate-spin text-white">⚡</span>
                                        <span>Adding {nextBatchNames}...</span>
                                      </>
                                    ) : (
                                      <>
                                        <UserPlus className="w-4 h-4 text-amber-100" />
                                        <span>+ Add {nextBatchNames}</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            );
                          })()}

                          {/* Action Toolbar for Active Image */}
                          {activeImage && (
                            <div className="flex flex-wrap gap-3 justify-center pt-2">
                              <button 
                                onClick={() => handleGenerateGroupPhoto(photoshootViewMode)}
                                disabled={isGeneratingGroupPhoto}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-full font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-md text-[10px] disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                              >
                                {isGeneratingGroupPhoto 
                                  ? 'Shooting...' 
                                  : otherImage 
                                    ? `🔄 Re-shoot ${thisLabel} (Connected to ${otherLabel})`
                                    : `🔄 Re-shoot ${thisLabel} (Fresh Set)`
                                }
                              </button>
                              <button 
                                onClick={handleClearCurrentPhoto}
                                disabled={isGeneratingGroupPhoto}
                                className="bg-neutral-100 border border-neutral-200 text-neutral-700 px-5 py-2 rounded-full font-black uppercase tracking-widest hover:bg-neutral-200 transition-all shadow-sm text-[10px] disabled:opacity-50 cursor-pointer"
                                title="Clear current photoshoot view"
                              >
                                Reset / Clear {photoshootViewMode === 'waistUp' ? 'Upper-Body' : 'Full-Body'} Photo
                              </button>
                              <a 
                                href={activeImage}
                                download={`Group-Photo-${photoshootViewMode}-${profile.groupName}.jpg`}
                                target="_blank" rel="noopener noreferrer"
                                className="bg-white border border-neutral-200 text-neutral-900 px-6 py-2 rounded-full font-black uppercase tracking-widest hover:bg-neutral-50 transition-all shadow-sm text-[10px]"
                              >
                                Download {photoshootViewMode === 'waistUp' ? 'Upper-Body' : 'Full-Body'} Photo
                              </a>
                              <button
                                onClick={() => exportDossierToPdf(profile as FullProfile)}
                                className="bg-indigo-50 border border-indigo-200 text-indigo-700 px-5 py-2 rounded-full font-black uppercase tracking-widest hover:bg-indigo-100 transition-all shadow-sm text-[10px] flex items-center gap-1.5 cursor-pointer"
                                title="Export complete dossier including this official photoshoot, mascot & lightstick to PDF"
                              >
                                <FileDown className="w-3.5 h-3.5 text-indigo-600" />
                                <span>Export Dossier (PDF)</span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                    {groupPhotoError && <p className="text-xs text-red-500 mt-4 font-bold">{groupPhotoError}</p>}
                  </div>
                )}
              </div>
            )}
            
            <div className="my-4 flex justify-center">
               <button 
                onClick={() => setProfile(null)}
                className="text-[8px] font-black uppercase tracking-widest text-neutral-400 hover:text-indigo-600 border border-neutral-200 px-3 py-1.5 rounded-full hover:bg-white transition-all"
               >
                 Create New Project
               </button>
            </div>
          </div>
        )}
      </main>
      
      <footer className="flex-none max-w-6xl w-full mx-auto text-center py-1 border-t border-neutral-100">
        <p className="text-neutral-300 text-[6px] font-bold uppercase tracking-[0.2em]">
          Restricted Internal Use Only • Property of Global A&R Network
        </p>
      </footer>

      {/* Lightbox Modal for Group Photo */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 bg-neutral-950/95 backdrop-blur-md cursor-zoom-out animate-in fade-in duration-200"
          onClick={() => setLightboxImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white hover:text-white/70 z-[101] bg-black/40 p-2 rounded-full cursor-pointer hover:bg-black/60 transition-all border border-neutral-800"
            onClick={() => setLightboxImage(null)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          
          <div className="relative max-w-full max-h-full flex flex-col items-center justify-center animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <img 
              src={lightboxImage} 
              alt="Group Photoshoot Full View" 
              className="max-w-[95vw] max-h-[90vh] object-contain rounded-lg shadow-2xl border border-neutral-800" 
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
