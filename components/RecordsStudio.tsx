import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { GroupProfileData, Album, Track, FullProfile, ChartRecords, LineDistributionItem } from '../types';
import { GroupType } from '../types';
import { regenerateTrackDetails, regenerateTrackTitle, generateFullLyrics, ensureTrackMetadata, buildMusicStylePrompt, isSoloArtist } from '../services/profileDataHelper';
import { generateImage } from '../services/geminiService';
import { audioSynth } from '../utils/audioSynth';
import { AlbumCoverStudio } from './AlbumCoverStudio';
import { TrackMvVisualsStudio } from './TrackMvVisualsStudio';
import { COVER_ART_STYLES, getSuggestedVisualMetaphor, buildAlbumCoverPrompt } from '../services/albumCoverHelper';
import { 
  Play, Pause, Disc, Music, Plus, Edit, Trash2, Calendar, 
  Sparkles, Volume2, Globe, Package, Video, 
  X, Radio, Flame, Headphones, RefreshCw, Award, 
  TrendingUp, BarChart3, Trophy, CheckCircle, Download,
  Eye, Layers, Share2, Shield, Star, Users, Copy, Check, FileText, Sliders,
  ChevronDown, ChevronUp, Wand2, RotateCcw, Shirt, Camera
} from 'lucide-react';

interface RecordsStudioProps {
  groupProfile: GroupProfileData;
  groupType: GroupType;
  theme: string;
  onGenerateNextAlbum?: () => void;
  isComposingAlbum?: boolean;
  onUpdateProfile?: (updatedProfile: Partial<FullProfile>) => void;
  onNavigateToLineup?: () => void;
}

function durationToSeconds(duration: string): number {
  const parts = duration.split(':');
  if (parts.length === 2) {
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  }
  return 180;
}

function formatSeconds(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

const FAN_COMMENTS = [
  "THIS IS SOTY FOR SURE!!! 🔥🔥🔥",
  "The B-sides are absolute masterpieces, on repeat all day!",
  "That synth baseline is so addictive! Can't stop listening.",
  "STREAM FOR THE MUSIC SHOW WINS GUYS!!! 📈",
  "The high note in the bridge gave me full chills 😭",
  "The choreography is out of this world!",
  "BEST comeback of the year, let's break all records!",
  "Ordering 5 copies of each photobook version right now 😂",
  "The lyricism and production value are peak perfection 🎧",
  "THE BRIDGE TO FINAL CHORUS TRANSITION IS INSANE!!!"
];

// Helper to generate simulated chart & sales records
function getOrGenerateChartRecords(album: Album, groupName: string): ChartRecords {
  if (album.chartRecords) return album.chartRecords;
  const isDebut = album.type === 'Single' || album.type === 'Mini Album';
  const baseSales = isDebut ? 850000 : 1650000;
  return {
    hanteoFirstWeekSales: `${(baseSales).toLocaleString()} copies`,
    circleTotalSales: `${(baseSales * 1.45 | 0).toLocaleString()} copies`,
    melonPeakRank: 1,
    spotifyGlobalPeak: 8,
    billboard200Peak: 3,
    musicShowWins: [
      { showName: "M Countdown", count: 3, isTripleCrown: true },
      { showName: "Music Bank", count: 2, isTripleCrown: false },
      { showName: "Inkigayo", count: 3, isTripleCrown: true },
      { showName: "Show! Music Core", count: 2, isTripleCrown: false },
      { showName: "Show Champion", count: 1, isTripleCrown: false }
    ],
    youtubeViews: "68,400,000 views",
    spotifyStreams: "142,500,000 streams",
    certifications: ["KMCA Million Certified", "RIAA Gold Certified"]
  };
}

// Helper to generate line distribution
function getOrGenerateLineDistribution(
  track: Track, 
  members: NonNullable<GroupProfileData['members']>,
  isSolo: boolean = false
): LineDistributionItem[] {
  const trackDurSec = durationToSeconds(track.duration || "3:15");

  // If already present, validate against solo constraints
  if (track.lineDistribution && track.lineDistribution.length > 0) {
    if (isSolo && track.lineDistribution.length > 1) {
      const primaryName = members[0]?.stageName || track.lineDistribution[0]?.memberName || "Soloist";
      return [{
        memberName: primaryName,
        percentage: 100,
        seconds: trackDurSec,
        partDescription: "Full Solo Vocals, Dynamic Rap Cadence & Self-Harmonies",
        color: 'hsl(280, 80%, 55%)'
      }];
    }
    return track.lineDistribution;
  }
  if (!members || members.length === 0) return [];
  
  if (isSolo || members.length === 1) {
    const m = members[0];
    return [{
      memberName: m?.stageName || "Soloist",
      percentage: 100,
      seconds: trackDurSec,
      partDescription: m?.primaryPosition || "Full Solo Vocals, Dynamic Rap Cadence & Self-Harmonies",
      color: 'hsl(280, 80%, 55%)'
    }];
  }

  const count = members.length;
  // Distribute based on roles
  let weights = members.map(m => {
    let w = 1.0;
    const pos = (m.primaryPosition || "").toLowerCase();
    if (pos.includes('main vocal')) w += 1.2;
    else if (pos.includes('lead vocal')) w += 0.8;
    else if (pos.includes('main rapper')) w += 0.7;
    else if (pos.includes('sub vocal')) w += 0.4;
    return w;
  });
  const sumWeights = weights.reduce((a, b) => a + b, 0);

  return members.map((m, i) => {
    const pct = Math.round((weights[i] / sumWeights) * 100);
    const secs = Math.round((pct / 100) * trackDurSec);
    return {
      memberName: m.stageName,
      percentage: pct,
      seconds: secs,
      partDescription: m.primaryPosition || "Vocal & Chorus Harmonies",
      color: `hsl(${(i * 360) / count}, 70%, 55%)`
    };
  });
}

export const RecordsStudio: React.FC<RecordsStudioProps> = ({
  groupProfile,
  groupType,
  theme,
  onGenerateNextAlbum,
  isComposingAlbum,
  onUpdateProfile,
  onNavigateToLineup
}) => {
  const isSolo = isSoloArtist(groupType) || (groupProfile.members?.length === 1);
  const [selectedAlbumIndex, setSelectedAlbumIndex] = useState<number>(0);
  const [selectedDetailTab, setSelectedDetailTab] = useState<'player' | 'cover_studio' | 'mv_visuals' | 'charts' | 'distribution' | 'narrative' | 'inclusions' | 'strategy'>('player');
  
  // Audio playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeTrackIndex, setActiveTrackIndex] = useState<number>(0);
  const [playProgress, setPlayProgress] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.75);
  
  // Chat feed
  const [chatMessages, setChatMessages] = useState<{username: string, text: string}[]>([
    {username: "kpop_producer", text: "Showcase ready! Press Play to listen to real synthesized audio."}
  ]);

  // AI Album Cover Generation
  const [isGeneratingCover, setIsGeneratingCover] = useState<boolean>(false);
  const [coverError, setCoverError] = useState<string | null>(null);
  const [coverModalUrl, setCoverModalUrl] = useState<string | null>(null);

  // AI MV Concept Still Generation
  const [isGeneratingMvStill, setIsGeneratingMvStill] = useState<boolean>(false);
  const [mvStillUrl, setMvStillUrl] = useState<string | null>(null);

  // Lyrics & track editing
  const [infoTab, setInfoTab] = useState<'analysis' | 'prompt' | 'feedback'>('analysis');
  const [lyricsViewMode, setLyricsViewMode] = useState<'korean' | 'english'>('korean');
  const [isRegeneratingTrack, setIsRegeneratingTrack] = useState<number | null>(null);
  const [isGeneratingFullLyrics, setIsGeneratingFullLyrics] = useState<number | null>(null);
  const [trackRegenError, setTrackRegenError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showLyricTestPanel, setShowLyricTestPanel] = useState<boolean>(false);
  const [customLyricPrompt, setCustomLyricPrompt] = useState<string>('');

  // Single song title regeneration
  const [isRegeneratingTrackTitle, setIsRegeneratingTrackTitle] = useState<number | null>(null);
  const [titleRegenModalTrackIdx, setTitleRegenModalTrackIdx] = useState<number | null>(null);
  const [customTitlePrompt, setCustomTitlePrompt] = useState<string>('');
  const [titleSuccessToast, setTitleSuccessToast] = useState<{ trackIdx: number; oldTitle: string; newTitle: string } | null>(null);

  useEffect(() => {
    if (titleSuccessToast) {
      const timer = setTimeout(() => {
        setTitleSuccessToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [titleSuccessToast]);

  const handleCopy = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  // Album Edit Form (CRUD)
  const [isEditingAlbum, setIsEditingAlbum] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editType, setEditType] = useState<Album['type']>('Mini Album');
  const [editReleaseDate, setEditReleaseDate] = useState<string>('');
  const [editTitleTrack, setEditTitleTrack] = useState<string>('');
  const [editConcept, setEditConcept] = useState<string>('');
  const [editMv, setEditMv] = useState<string>('');
  const [editStrategy, setEditStrategy] = useState<string>('');
  const [editInclusions, setEditInclusions] = useState<string>('');
  const [editTracks, setEditTracks] = useState<Track[]>([]);

  // Canvas ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  // Hydrate discography
  const initializedDiscography = useMemo(() => {
    return (groupProfile.discography || []).map(album => {
      const chartRecords = getOrGenerateChartRecords(album, groupProfile.groupName);
      const tracks = (album.tracks || []).map(t => {
        const withMeta = ensureTrackMetadata(t, groupProfile.groupName, groupProfile.conceptDescription, isSolo);
        return {
          ...withMeta,
          lineDistribution: getOrGenerateLineDistribution(withMeta, groupProfile.members || [], isSolo)
        };
      });
      return {
        ...album,
        conceptSummary: album.conceptSummary || `Artistic evolution and signature sound release for ${groupProfile.groupName}.`,
        targetMarketStrategy: album.targetMarketStrategy || `Global digital campaign targeting streaming playlists, broadcast promotions, and global fan interactions.`,
        mvSynopsis: album.mvSynopsis || (isSolo 
          ? `A dramatic cinematic visual narrative capturing ${groupProfile.groupName}'s artistic evolution through high-contrast choreography sets, intimate camera closeups, and striking solo stage presence.` 
          : `A dramatic visual narrative capturing the group's journey through high-contrast cinematic choreography sets and emotional storyline beats.`),
        physicalInclusions: album.physicalInclusions || (isSolo
          ? ["80p Editorial Photobook", `2 Exclusive Concept Photocards (1 of 4 versions of ${groupProfile.groupName})`, `Folded Mini Poster featuring ${groupProfile.groupName}`, "Holographic Sticker Sheet"]
          : ["80p Hardcover Photobook", "2 Random Selfie Photocards (1 of 12)", "Folded Mini Poster", "Holographic Sticker Sheet"]),
        chartRecords,
        tracks
      } as Album;
    });
  }, [groupProfile.discography, groupProfile.groupName, groupProfile.members, groupProfile.conceptDescription, isSolo]);

  const selectedAlbum: Album | undefined = initializedDiscography[selectedAlbumIndex];

  // Sound playback hook with AudioSynthEngine
  useEffect(() => {
    if (isPlaying && selectedAlbum) {
      const track = selectedAlbum.tracks?.[activeTrackIndex];
      const bpm = track?.role === "Title Track" ? 128 : 105;
      audioSynth.setVolume(volume);
      audioSynth.start(bpm, track?.genre || "Pop");
    } else {
      audioSynth.stop();
    }
    return () => {
      audioSynth.stop();
    };
  }, [isPlaying, activeTrackIndex, selectedAlbum]);

  // Volume change
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    audioSynth.setVolume(newVol);
  };

  // Playhead timer
  useEffect(() => {
    let interval: any = null;
    if (isPlaying && selectedAlbum) {
      interval = setInterval(() => {
        setPlayProgress(prev => {
          const track = selectedAlbum.tracks?.[activeTrackIndex];
          const durationSecs = durationToSeconds(track?.duration || "3:15");
          if (prev >= durationSecs) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeTrackIndex, selectedAlbum]);

  // Virtual chat comments loop
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        const usernames = ["fandom_queen", "sweet_vocals", "loves_kpop", "dance_machine", "bias_wrecker_99", "kpop_chart_bot", "ultimate_fan", "melody_star"];
        const randomUser = usernames[Math.floor(Math.random() * usernames.length)] + "_" + Math.floor(Math.random() * 100);
        const randomComment = FAN_COMMENTS[Math.floor(Math.random() * FAN_COMMENTS.length)];
        
        setChatMessages(prev => [
          ...prev, 
          { username: randomUser, text: randomComment }
        ].slice(-14));
      }, 2800);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Visualizer Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let frame = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barsCount = 32;
      const barWidth = canvas.width / barsCount - 2.5;
      
      const mainColor = groupProfile.officialColors?.[0]?.hex || '#10b981';
      ctx.fillStyle = mainColor;
      
      for (let i = 0; i < barsCount; i++) {
        let height = 0;
        if (isPlaying) {
          height = Math.sin(i * 0.35 + frame * 0.2) * 14 + Math.cos(i * 0.8 + frame * 0.12) * 10 + 22;
          height = Math.max(4, height + (Math.random() - 0.5) * 6);
        } else {
          height = 4 + Math.sin(i * 0.2 + frame * 0.02) * 2;
        }
        
        const x = i * (barWidth + 2.5);
        const y = canvas.height - height;
        
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, y, barWidth, height, 2);
        } else {
          ctx.rect(x, y, barWidth, height);
        }
        ctx.fill();
      }
      
      frame++;
      animationRef.current = requestAnimationFrame(render);
    };
    
    render();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, groupProfile.officialColors]);

  // Track select
  const handleSelectTrack = (idx: number) => {
    setActiveTrackIndex(idx);
    setPlayProgress(0);
    setIsPlaying(true);
    setChatMessages(prev => [
      ...prev,
      { username: "System", text: `Now Playing: "${selectedAlbum?.tracks?.[idx]?.title}"` }
    ].slice(-14));
  };

  // Generate Official Album Cover (Unique High-Concept Fine Art)
  const handleGenerateAlbumCover = async (albumIdx: number, overrideParams?: {
    styleId?: string;
    visualMetaphor?: string;
    packagingStyle?: 'vinyl' | 'jewel_case' | 'clean_print';
    customNotes?: string;
    includeLogo?: boolean;
  }) => {
    const album = initializedDiscography[albumIdx];
    if (!album || !onUpdateProfile) return;
    setIsGeneratingCover(true);
    setCoverError(null);
    try {
      const activeStyleId = overrideParams?.styleId || album.coverArtStyle || 'surreal_chrome';
      const activeMetaphor = overrideParams?.visualMetaphor || album.coverVisualMotif || getSuggestedVisualMetaphor(album.title, album.conceptSummary || '', album.titleTrack);
      const activePackaging = overrideParams?.packagingStyle || album.coverPackagingStyle || 'vinyl';
      const activeNotes = overrideParams?.customNotes || '';
      const activeIncludeLogo = overrideParams?.includeLogo !== undefined ? overrideParams.includeLogo : true;

      const prompt = buildAlbumCoverPrompt({
        album,
        groupName: groupProfile.groupName,
        agency: groupProfile.agency,
        officialColors: groupProfile.officialColors,
        logoDescription: groupProfile.logoDescription,
        styleId: activeStyleId,
        visualMetaphor: activeMetaphor,
        customNotes: activeNotes,
        packagingStyle: activePackaging
      });

      // ONLY pass the official Logo Emblem reference image, NEVER pass the group photoshoot!
      const refImages: any[] = [];
      if (activeIncludeLogo && groupProfile.logoUrl) {
        refImages.push({ label: `${groupProfile.groupName} Official Logo Emblem`, dataUrl: groupProfile.logoUrl });
      }

      const img = await generateImage(prompt, "1:1", refImages.length > 0 ? refImages : undefined);
      const updated = [...initializedDiscography];
      updated[albumIdx] = {
        ...album,
        albumCoverUrl: img,
        albumCoverPrompt: prompt,
        coverArtStyle: activeStyleId,
        coverVisualMotif: activeMetaphor,
        coverPackagingStyle: activePackaging
      };
      onUpdateProfile({
        ...groupProfile,
        discography: updated
      });
      setChatMessages(prev => [
        ...prev,
        { username: "A&R Art Director", text: `Minted bespoke "${COVER_ART_STYLES.find(s => s.id === activeStyleId)?.name || 'Custom'}" fine-art album cover for "${album.title}"!` }
      ].slice(-14));
    } catch (err: any) {
      console.error(err);
      setCoverError(err.message || "Failed to generate album cover.");
    } finally {
      setIsGeneratingCover(false);
    }
  };

  // Generate MV Concept Still
  const handleGenerateMvStill = async () => {
    if (!selectedAlbum) return;
    setIsGeneratingMvStill(true);
    try {
      const paletteText = groupProfile.officialColors?.map(c => `"${c.name}" (${c.hex})`).join(', ') || 'Vibrant Emerald & Gold';
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

      const prompt = `Cinematic 4K still frame from the official music video for "${selectedAlbum.titleTrack}" by "${groupProfile.groupName}".
Concept & Synopsis: ${selectedAlbum.mvSynopsis || 'Dramatic K-pop music video blockbuster'}.
Group Emblem & Branding: ${groupProfile.logoDescription || 'Official group logo emblem'}.
Official Palette: ${paletteText}.
Visual Style: High-budget movie cinematography featuring real members of ${groupProfile.groupName}, anamorphic lens flares, atmospheric smoke, neon backlighting in official palette colors, stunning choreography stage setup. Crisp textures and color grading.`;

      const img = await generateImage(prompt, "16:9", refImages.length > 0 ? refImages : undefined);
      setMvStillUrl(img);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsGeneratingMvStill(false);
    }
  };

  // Regenerate demo lyrics & meaning
  const handleRegenerateTrack = async (trackIdx: number) => {
    if (!selectedAlbum || !onUpdateProfile) return;
    const track = selectedAlbum.tracks?.[trackIdx];
    if (!track) return;
    
    setIsRegeneratingTrack(trackIdx);
    setTrackRegenError(null);
    try {
      const result = await regenerateTrackDetails(
        track.title,
        track.genre,
        groupProfile.conceptDescription,
        track.role,
        groupProfile.groupName,
        groupType,
        groupProfile.generation,
        groupProfile.members?.length || 5
      );
      
      const updatedTracks = [...(selectedAlbum.tracks || [])];
      updatedTracks[trackIdx] = {
        ...track,
        lyricExcerpt: result.lyricExcerpt,
        meaning: result.meaning,
        structureType: result.structureType,
        structurePattern: result.structurePattern,
        genres: result.genres,
        musicStylePrompt: result.musicStylePrompt,
        rhymeScheme: result.rhymeScheme,
        figurativeDevices: result.figurativeDevices,
        vocalArrangement: result.vocalArrangement
      };
      
      const updatedAlbum: Album = {
        ...selectedAlbum,
        tracks: updatedTracks
      };
      
      const newDiscography = [...initializedDiscography];
      newDiscography[selectedAlbumIndex] = updatedAlbum;
      
      onUpdateProfile({
        ...groupProfile,
        discography: newDiscography
      });
      
      setChatMessages(prev => [
        ...prev,
        { username: "A&R Director", text: `Updated lyrics, music style prompt & sound design for "${track.title}"!` }
      ].slice(-14));
    } catch (err: any) {
      console.error(err);
      setTrackRegenError("Failed to update track. Please try again.");
    } finally {
      setIsRegeneratingTrack(null);
    }
  };

  // Generate or Regenerate full lyrics
  const handleGenerateFullLyrics = async (trackIdx: number, customInstructions?: string) => {
    if (!selectedAlbum || !onUpdateProfile) return;
    const track = selectedAlbum.tracks?.[trackIdx];
    if (!track) return;
    
    setIsGeneratingFullLyrics(trackIdx);
    setTrackRegenError(null);
    try {
      const activePrompt = typeof customInstructions === 'string' ? customInstructions : customLyricPrompt;
      const lyricsResult = await generateFullLyrics(
        track.title,
        track.genre,
        groupProfile.conceptDescription,
        track.role,
        groupProfile.groupName,
        groupType,
        groupProfile.generation,
        groupProfile.members?.length || 5,
        track.rhymeScheme,
        track.figurativeDevices,
        track.structureType,
        track.meaning,
        track.lyricExcerpt,
        track.genres,
        track.vocalArrangement,
        activePrompt
      );
      
      const updatedTracks = [...(selectedAlbum.tracks || [])];
      updatedTracks[trackIdx] = {
        ...track,
        fullLyrics: lyricsResult.lyrics,
        fullLyricsEnglish: lyricsResult.lyricsEnglish
      };
      
      const updatedAlbum: Album = {
        ...selectedAlbum,
        tracks: updatedTracks
      };
      
      const newDiscography = [...initializedDiscography];
      newDiscography[selectedAlbumIndex] = updatedAlbum;
      
      onUpdateProfile({
        ...groupProfile,
        discography: newDiscography
      });

      setChatMessages(prev => [
        ...prev,
        { username: "Lyricist Studio", text: `Crafted full bilingual lyrics & official English Version for "${track.title}"!` }
      ].slice(-14));
    } catch (err: any) {
      console.error(err);
      setTrackRegenError("Failed to generate full lyrics.");
    } finally {
      setIsGeneratingFullLyrics(null);
    }
  };

  // Regenerate title for ONLY a specific track
  const handleRegenerateTrackTitleOnly = async (trackIdx: number, customDirection?: string) => {
    if (!selectedAlbum || !onUpdateProfile) return;
    const track = selectedAlbum.tracks?.[trackIdx];
    if (!track) return;

    setIsRegeneratingTrackTitle(trackIdx);
    setTrackRegenError(null);

    try {
      const existingTitles = (selectedAlbum.tracks || []).map(t => t.title);
      const result = await regenerateTrackTitle(
        track.title,
        track.genre || 'K-Pop',
        groupProfile.conceptDescription,
        track.role,
        groupProfile.groupName,
        {
          customDirection: customDirection?.trim(),
          existingTitles,
          albumTitle: selectedAlbum.title,
          groupType,
          isSolo,
          memberGender: groupProfile.members?.[0]?.gender
        }
      );

      const oldTitle = track.title;
      const newTitle = result.title.trim();

      const updatedTracks = [...(selectedAlbum.tracks || [])];
      updatedTracks[trackIdx] = {
        ...track,
        title: newTitle,
        musicStylePrompt: track.musicStylePrompt ? track.musicStylePrompt.replace(new RegExp(oldTitle, 'g'), newTitle) : undefined
      };

      // If this track was the album's designated titleTrack or has role "Title Track", sync album.titleTrack
      const isTitleTrack = selectedAlbum.titleTrack === oldTitle || track.role === 'Title Track';
      const updatedAlbum: Album = {
        ...selectedAlbum,
        tracks: updatedTracks,
        titleTrack: isTitleTrack ? newTitle : selectedAlbum.titleTrack
      };

      const newDiscography = [...initializedDiscography];
      newDiscography[selectedAlbumIndex] = updatedAlbum;

      onUpdateProfile({
        ...groupProfile,
        discography: newDiscography
      });

      setTitleSuccessToast({
        trackIdx,
        oldTitle,
        newTitle
      });

      setChatMessages(prev => [
        ...prev,
        { 
          username: "A&R Director", 
          text: `Regenerated title for Track #${trackIdx + 1}: "${oldTitle}" ➔ "${newTitle}"! (All other tracks & lyrics preserved)` 
        }
      ].slice(-14));

      // Close custom modal if open
      setTitleRegenModalTrackIdx(null);
      setCustomTitlePrompt('');
    } catch (err: any) {
      console.error(err);
      setTrackRegenError("Failed to regenerate title for this song. Please try again.");
    } finally {
      setIsRegeneratingTrackTitle(null);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = () => {
    if (!selectedAlbum) return;
    setEditTitle(selectedAlbum.title);
    setEditType(selectedAlbum.type);
    setEditReleaseDate(selectedAlbum.releaseDate || '');
    setEditTitleTrack(selectedAlbum.titleTrack || '');
    setEditConcept(selectedAlbum.conceptSummary || '');
    setEditMv(selectedAlbum.mvSynopsis || '');
    setEditStrategy(selectedAlbum.targetMarketStrategy || '');
    setEditInclusions((selectedAlbum.physicalInclusions || []).join(', '));
    setEditTracks(selectedAlbum.tracks || []);
    setIsEditingAlbum(true);
  };

  // Save Edit Form
  const handleSaveAlbumEdit = () => {
    if (!selectedAlbum || !onUpdateProfile) return;
    const updatedAlbum: Album = {
      ...selectedAlbum,
      title: editTitle.trim() || selectedAlbum.title,
      type: editType,
      releaseDate: editReleaseDate.trim() || selectedAlbum.releaseDate,
      titleTrack: editTitleTrack.trim() || selectedAlbum.titleTrack,
      conceptSummary: editConcept.trim() || selectedAlbum.conceptSummary,
      mvSynopsis: editMv.trim() || selectedAlbum.mvSynopsis,
      targetMarketStrategy: editStrategy.trim() || selectedAlbum.targetMarketStrategy,
      physicalInclusions: editInclusions.split(',').map(s => s.trim()).filter(Boolean),
      tracks: editTracks
    };

    const newDiscography = [...initializedDiscography];
    newDiscography[selectedAlbumIndex] = updatedAlbum;

    onUpdateProfile({
      ...groupProfile,
      discography: newDiscography
    });
    setIsEditingAlbum(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      
      {/* Top Discography Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Discography Navigator & Era Selector */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-xs space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
              <div>
                <span className="text-[7.5px] font-mono font-bold text-neutral-400 uppercase tracking-widest block">
                  A&R DISCOGRAPHY REPOSITORY
                </span>
                <h3 className="text-xs font-black uppercase tracking-tight text-neutral-900">
                  {initializedDiscography.length} Releases Logged
                </h3>
              </div>

              {onGenerateNextAlbum && (
                <button
                  onClick={onGenerateNextAlbum}
                  disabled={isComposingAlbum}
                  className="bg-neutral-900 hover:bg-neutral-800 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <Plus className="w-3 h-3 text-emerald-400" />
                  <span>{isComposingAlbum ? 'Composing...' : 'New Era'}</span>
                </button>
              )}
            </div>

            {/* Album Era Cards */}
            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {initializedDiscography.map((album, idx) => {
                const isSelected = idx === selectedAlbumIndex;
                const cover = album.albumCoverUrl;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedAlbumIndex(idx);
                      setActiveTrackIndex(0);
                      setPlayProgress(0);
                      setIsPlaying(false);
                    }}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'border-neutral-950 bg-neutral-900 text-white shadow-md'
                        : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-900'
                    }`}
                  >
                    {/* Album Art Icon */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-950 shrink-0 border border-white/10 relative flex items-center justify-center">
                      {cover ? (
                        <img src={cover} alt={album.title} className="w-full h-full object-cover" />
                      ) : (
                        <div 
                          className="w-full h-full flex items-center justify-center text-[7px] font-black text-white text-center p-1"
                          style={{
                            background: `linear-gradient(135deg, ${groupProfile.officialColors?.[0]?.hex || '#10b981'} 0%, #171717 100%)`
                          }}
                        >
                          <Disc className="w-5 h-5 opacity-80" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-grow">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[6.5px] font-black uppercase px-1.5 py-0.2 rounded font-mono ${
                          isSelected ? 'bg-white/20 text-emerald-300' : 'bg-neutral-100 text-neutral-600'
                        }`}>
                          {album.type}
                        </span>
                        {idx === 0 && (
                          <span className="text-[6.5px] font-bold text-amber-400">★ DEBUT</span>
                        )}
                      </div>
                      <h4 className="text-xs font-black uppercase truncate mt-0.5">{album.title}</h4>
                      <span className={`text-[7.5px] font-mono block ${isSelected ? 'text-neutral-400' : 'text-neutral-500'}`}>
                        {album.releaseDate || 'TBD'} • {album.tracks?.length || 0} Tracks
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Selected Album Deep-Dive Workspace */}
        <div className="lg:col-span-8 space-y-4">
          {selectedAlbum ? (
            <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs space-y-5">
              
              {/* Header: Album Cover & 3D Vinyl Sleeve Showcase */}
              <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center pb-4 border-b border-neutral-100">
                
                {/* 3D Vinyl Sleeve Art Stage */}
                <div className="relative group shrink-0 mx-auto sm:mx-0">
                  {/* Vinyl Disc that slides out */}
                  <div 
                    className={`absolute -right-4 top-2 w-24 h-24 rounded-full bg-neutral-900 border-2 border-neutral-800 flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:translate-x-6 ${
                      isPlaying ? 'animate-spin' : ''
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center bg-neutral-950">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                  </div>

                  {/* Album Cover Jacket */}
                  <div 
                    onClick={() => selectedAlbum.albumCoverUrl && setCoverModalUrl(selectedAlbum.albumCoverUrl)}
                    className="w-28 h-28 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-200 shadow-xl relative z-10 cursor-pointer flex items-center justify-center"
                  >
                    {selectedAlbum.albumCoverUrl ? (
                      <img 
                        src={selectedAlbum.albumCoverUrl} 
                        alt={selectedAlbum.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div 
                        className="w-full h-full p-3 flex flex-col justify-between items-center text-center text-white"
                        style={{
                          background: `linear-gradient(135deg, ${groupProfile.officialColors?.[0]?.hex || '#10b981'} 0%, #171717 80%)`
                        }}
                      >
                        <span className="text-[6px] font-mono uppercase text-white/70 tracking-widest">{selectedAlbum.type}</span>
                        <h5 className="text-[10px] font-black uppercase leading-tight drop-shadow">{selectedAlbum.title}</h5>
                        <span className="text-[6px] font-mono text-emerald-300 font-bold">{groupProfile.groupName}</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[7.5px] font-black uppercase">
                      <Eye className="w-4 h-4 mr-1" /> View
                    </div>
                  </div>
                </div>

                {/* Album Metadata & Action Buttons */}
                <div className="flex-grow space-y-2 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[7.5px] font-black uppercase tracking-wider">
                        {selectedAlbum.type}
                      </span>
                      <span className="text-[7.5px] font-mono font-bold text-neutral-500">
                        {selectedAlbum.releaseDate}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedDetailTab('cover_studio')}
                        className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-wider flex items-center gap-1 border transition-all cursor-pointer ${
                          selectedDetailTab === 'cover_studio'
                            ? 'bg-neutral-900 text-white border-neutral-900'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200'
                        }`}
                        title="Open Album Cover Design Studio"
                      >
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>{selectedAlbum.albumCoverUrl ? 'Cover Studio' : 'Design Cover Art'}</span>
                      </button>

                      <button
                        onClick={() => setSelectedDetailTab('mv_visuals')}
                        className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-wider flex items-center gap-1 border transition-all cursor-pointer ${
                          selectedDetailTab === 'mv_visuals'
                            ? 'bg-neutral-900 text-white border-neutral-900'
                            : 'bg-purple-50 hover:bg-purple-100 text-purple-900 border-purple-200'
                        }`}
                        title="Open Track MV Setting Look & Member Outfit Concepts"
                      >
                        <Shirt className="w-3 h-3 text-purple-600" />
                        <span>MV & Outfits</span>
                      </button>

                      <button
                        onClick={handleOpenEdit}
                        className="text-neutral-500 hover:text-neutral-900 border border-neutral-200 p-1.5 rounded-full hover:bg-neutral-50 transition-all"
                        title="Edit Album Metadata"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xl font-black uppercase tracking-tight text-neutral-950 truncate">
                    {selectedAlbum.title}
                  </h3>

                  <p className="text-xs text-neutral-600 leading-relaxed line-clamp-2">
                    {selectedAlbum.conceptSummary}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[8px] font-bold text-neutral-500 font-mono">
                    <span>TITLE TRACK: <strong className="text-emerald-700 font-black">"{selectedAlbum.titleTrack}"</strong></span>
                    <span>TRACKS: <strong>{selectedAlbum.tracks?.length || 0}</strong></span>
                    <span>1ST-WEEK: <strong className="text-neutral-900">{selectedAlbum.chartRecords?.hanteoFirstWeekSales || "1.2M+"}</strong></span>
                  </div>
                </div>

              </div>

              {titleSuccessToast && (
                <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 rounded-2xl text-xs flex items-center justify-between shadow-2xs animate-in fade-in duration-200">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <span className="font-black uppercase tracking-wider text-[8.5px] block text-amber-950">
                        Targeted Song Title Updated
                      </span>
                      <span className="text-[10.5px]">
                        Track #{titleSuccessToast.trackIdx + 1} was renamed from <strong>"{titleSuccessToast.oldTitle}"</strong> to <strong className="text-amber-800 underline">"{titleSuccessToast.newTitle}"</strong>. All lyrics and other songs remain intact.
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setTitleSuccessToast(null)} 
                    className="text-amber-700 hover:text-amber-950 p-1 cursor-pointer"
                    title="Dismiss"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {coverError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold">
                  {coverError}
                </div>
              )}

              {/* Subtabs Bar */}
              <div className="flex border-b border-neutral-200 pb-1 gap-1 overflow-x-auto scrollbar-none">
                {[
                  { id: 'player', label: 'Audio Stream Studio', icon: Radio },
                  { id: 'cover_studio', label: 'Album Cover Studio', icon: Sparkles },
                  { id: 'mv_visuals', label: isSolo ? 'Track MV & Solo Styling' : 'Track MV & Outfits', icon: Shirt },
                  { id: 'charts', label: 'Chart Records & Trophies', icon: Trophy },
                  { id: 'distribution', label: isSolo ? 'Vocal Dynamics & Breakdown' : 'Line Distribution', icon: BarChart3 },
                  { id: 'narrative', label: 'MV Cinematic Storyboard', icon: Video },
                  { id: 'inclusions', label: 'Packaging & Inclusions', icon: Package },
                  { id: 'strategy', label: 'A&R Strategy', icon: Globe }
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = selectedDetailTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedDetailTab(tab.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-[8.5px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'bg-neutral-900 text-white shadow-2xs'
                          : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100 border border-neutral-200/60'
                      }`}
                    >
                      <Icon className={`w-3 h-3 ${isActive ? 'text-emerald-400' : 'text-neutral-400'}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* ================= SUBTAB: AUDIO STREAM STUDIO ================= */}
              {selectedDetailTab === 'player' && (
                <div className="space-y-4">
                  {(() => {
                    const currentTrack = selectedAlbum.tracks?.[activeTrackIndex];
                    const activeMusicPrompt = currentTrack?.musicStylePrompt || (currentTrack ? buildMusicStylePrompt(currentTrack, groupProfile.groupName, groupProfile.conceptDescription, isSolo) : '');
                    const activeLyrics = currentTrack?.fullLyrics || currentTrack?.lyricExcerpt || '';

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Live Synth Stream Player */}
                        <div className="bg-neutral-950 text-white rounded-2xl p-4 flex flex-col justify-between space-y-3 min-h-[340px] border border-white/10 shadow-lg relative overflow-hidden">
                          <div className="flex justify-between items-center border-b border-white/10 pb-2">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-600'}`}></span>
                              <span className="text-[7.5px] font-mono font-bold tracking-widest text-neutral-400 uppercase">
                                {isPlaying ? 'LIVE SYNTHESIZER AUDIO' : 'SHOWCASE STREAM STANDBY'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[7px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                                {currentTrack?.role === 'Title Track' ? '128 BPM' : '105 BPM'}
                              </span>
                            </div>
                          </div>

                          {/* Song Display */}
                          <div className="text-center py-1 flex flex-col items-center space-y-1.5">
                            <div className={`w-12 h-12 rounded-full bg-neutral-900 border border-white/20 flex items-center justify-center shadow-inner ${isPlaying ? 'animate-spin' : ''}`}>
                              <Disc className="w-7 h-7 text-emerald-400" />
                            </div>

                            <div className="flex items-center justify-center gap-1.5 max-w-full px-2">
                              <h4 className="text-sm font-black uppercase text-emerald-400 truncate">
                                {currentTrack?.title || 'Track'}
                              </h4>
                              <button
                                onClick={() => handleRegenerateTrackTitleOnly(activeTrackIndex)}
                                disabled={isRegeneratingTrackTitle === activeTrackIndex}
                                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-emerald-300 hover:text-emerald-200 border border-emerald-500/30 text-[7px] font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                                title={`Regenerate new title for "${currentTrack?.title}"`}
                              >
                                <RefreshCw className={`w-2.5 h-2.5 text-emerald-400 ${isRegeneratingTrackTitle === activeTrackIndex ? 'animate-spin' : ''}`} />
                                <span className="hidden sm:inline text-[6.5px] uppercase font-black">Regen Title</span>
                              </button>
                              <button
                                onClick={() => setTitleRegenModalTrackIdx(activeTrackIndex)}
                                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-amber-300 border border-white/10 text-[7px] font-bold flex items-center cursor-pointer transition-all active:scale-95"
                                title={`Custom title vibe & directive options for "${currentTrack?.title}"`}
                              >
                                <Wand2 className="w-2.5 h-2.5 text-amber-300" />
                              </button>
                            </div>
                            
                            {/* Genres Tags */}
                            <div className="flex flex-wrap items-center justify-center gap-1 max-w-xs">
                              {(currentTrack?.genres && currentTrack.genres.length > 0 ? currentTrack.genres : [currentTrack?.genre || 'K-Pop']).map((g, gi) => (
                                <span key={gi} className="px-2 py-0.5 rounded-md text-[7px] font-mono font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/30">
                                  {g}
                                </span>
                              ))}
                            </div>

                            <span className="text-[7.5px] font-mono font-bold text-neutral-400 uppercase">
                              {currentTrack?.role} • Structure: {currentTrack?.structureType || 'K-Pop High Dynamic'}
                            </span>

                            <p className="text-[8.5px] text-neutral-300 italic max-w-xs mx-auto leading-relaxed line-clamp-2">
                              "{currentTrack?.lyricExcerpt || 'Demo lyrics loading...'}"
                            </p>

                            {/* Quick 1-Click Copy Bar */}
                            <div className="flex items-center gap-1.5 pt-1">
                              <button
                                onClick={() => handleCopy(activeLyrics, 'player-lyrics')}
                                className="px-2.5 py-1 rounded-full text-[7.5px] font-bold bg-white/10 hover:bg-white/20 text-white flex items-center gap-1 transition-all active:scale-95 cursor-pointer border border-white/10"
                                title="Copy Song Lyrics"
                              >
                                {copiedKey === 'player-lyrics' ? (
                                  <>
                                    <Check className="w-2.5 h-2.5 text-emerald-400" />
                                    <span className="text-emerald-400 font-black">Lyrics Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-2.5 h-2.5 text-neutral-300" />
                                    <span>Copy Lyrics</span>
                                  </>
                                )}
                              </button>

                              <button
                                onClick={() => handleCopy(activeMusicPrompt, 'player-prompt')}
                                className="px-2.5 py-1 rounded-full text-[7.5px] font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 flex items-center gap-1 transition-all active:scale-95 cursor-pointer border border-emerald-500/30"
                                title="Copy Music Style & Production Prompt"
                              >
                                {copiedKey === 'player-prompt' ? (
                                  <>
                                    <Check className="w-2.5 h-2.5 text-emerald-300" />
                                    <span className="text-emerald-300 font-black">Prompt Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                                    <span>Copy Style Prompt</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Waveform Canvas */}
                          <div className="h-8 w-full flex items-end">
                            <canvas ref={canvasRef} width={320} height={32} className="w-full h-full rounded" />
                          </div>

                          {/* Scrub Bar & Player Controls */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center text-[7px] font-mono text-neutral-400">
                              <span>{formatSeconds(playProgress)}</span>
                              <span>{currentTrack?.duration || '3:15'}</span>
                            </div>

                            <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                              <div 
                                className="bg-emerald-500 h-full transition-all duration-300"
                                style={{
                                  width: `${Math.min(100, (playProgress / durationToSeconds(currentTrack?.duration || "3:15")) * 100)}%`
                                }}
                              />
                            </div>

                            <div className="flex justify-between items-center pt-1 border-t border-white/10">
                              <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="bg-white text-neutral-950 p-2 rounded-full hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                              >
                                {isPlaying ? <Pause className="w-3.5 h-3.5 text-neutral-950 fill-neutral-950" /> : <Play className="w-3.5 h-3.5 text-neutral-950 fill-neutral-950" />}
                              </button>

                              <div className="flex items-center gap-1.5">
                                <Volume2 className="w-3 h-3 text-neutral-400" />
                                <input 
                                  type="range" 
                                  min="0" 
                                  max="1" 
                                  step="0.05"
                                  value={volume}
                                  onChange={e => handleVolumeChange(parseFloat(e.target.value))}
                                  className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right: Lyrics, Music Style Prompts & Insights */}
                        <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 flex flex-col justify-between min-h-[340px]">
                          <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
                            <div className="flex gap-1 bg-neutral-200 p-0.5 rounded-lg flex-wrap">
                              <button
                                onClick={() => setInfoTab('analysis')}
                                className={`px-2 py-1 rounded text-[7.5px] font-black uppercase transition-all ${infoTab === 'analysis' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'}`}
                              >
                                Lyrics & Poetics
                              </button>
                              <button
                                onClick={() => setInfoTab('prompt')}
                                className={`px-2 py-1 rounded text-[7.5px] font-black uppercase transition-all flex items-center gap-1 ${infoTab === 'prompt' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'}`}
                              >
                                <Sparkles className="w-2.5 h-2.5" />
                                Music Style Prompt
                              </button>
                              <button
                                onClick={() => setInfoTab('feedback')}
                                className={`px-2 py-1 rounded text-[7.5px] font-black uppercase transition-all ${infoTab === 'feedback' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'}`}
                              >
                                Fan Stream
                              </button>
                            </div>
                          </div>

                          {/* Tab 1: Lyrics & Meaning */}
                          {infoTab === 'analysis' && (
                            <div className="space-y-2.5 py-2 flex-grow overflow-y-auto max-h-[220px]">
                              {/* Rhyme Scheme & Figurative Devices Chips */}
                              <div className="flex flex-wrap gap-1">
                                {currentTrack?.rhymeScheme && (
                                  <span className="px-2 py-0.5 rounded bg-neutral-200/80 text-neutral-800 text-[7px] font-mono font-bold">
                                    Rhyme: {currentTrack.rhymeScheme}
                                  </span>
                                )}
                                {currentTrack?.figurativeDevices && (
                                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[7px] font-mono font-bold">
                                    Figurative: {currentTrack.figurativeDevices}
                                  </span>
                                )}
                              </div>

                              <div className="bg-white p-2.5 rounded-xl border border-neutral-200 text-left">
                                <div className="flex justify-between items-center mb-0.5">
                                  <span className="text-[7px] font-black uppercase tracking-widest text-emerald-700">SONG INSPIRATION & MEANING</span>
                                  <span className="text-[6.5px] font-mono text-neutral-400 font-bold">Narrative Anchor</span>
                                </div>
                                <p className="text-[9.5px] text-neutral-800 leading-relaxed font-medium">
                                  {currentTrack?.meaning || "High-energy anthem celebrating finding your true rhythm and shining fearlessly."}
                                </p>
                              </div>

                              {/* Lyric Hook with Copy Button */}
                              <div className="bg-white p-2.5 rounded-xl border border-neutral-200 text-left relative group">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-[7px] font-black uppercase tracking-widest text-neutral-400">SONG DEMO LYRIC HOOK</span>
                                  {currentTrack?.lyricExcerpt && (
                                    <button
                                      onClick={() => handleCopy(currentTrack.lyricExcerpt || '', 'hook-lyrics')}
                                      className="text-[7.5px] font-bold text-neutral-600 hover:text-neutral-950 flex items-center gap-1 bg-neutral-100 hover:bg-neutral-200 px-2 py-0.5 rounded-md transition-all cursor-pointer"
                                    >
                                      {copiedKey === 'hook-lyrics' ? (
                                        <>
                                          <Check className="w-2.5 h-2.5 text-emerald-600" />
                                          <span className="text-emerald-600 font-bold">Copied! ✓</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="w-2.5 h-2.5" />
                                          <span>Copy Hook</span>
                                        </>
                                      )}
                                    </button>
                                  )}
                                </div>
                                <p className="text-[9.5px] text-neutral-700 italic leading-relaxed">
                                  "{currentTrack?.lyricExcerpt || '[No lyrics written]'}"
                                </p>
                              </div>

                              {/* Full Song Lyrics Section with Redo / Test & Copy */}
                              {currentTrack?.fullLyrics ? (
                                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-left space-y-2.5">
                                  <div className="flex flex-wrap justify-between items-center gap-2">
                                    {/* Version Tab Switcher */}
                                    <div className="flex items-center gap-1 bg-emerald-100/90 p-0.5 rounded-lg border border-emerald-200">
                                      <button
                                        onClick={() => setLyricsViewMode('korean')}
                                        className={`px-2.5 py-1 rounded-md text-[7.5px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                                          lyricsViewMode === 'korean'
                                            ? 'bg-emerald-700 text-white shadow-xs'
                                            : 'text-emerald-800 hover:text-emerald-950 hover:bg-emerald-200/60'
                                        }`}
                                      >
                                        🇰🇷 Korean + Eng Ver.
                                      </button>
                                      <button
                                        onClick={() => setLyricsViewMode('english')}
                                        className={`px-2.5 py-1 rounded-md text-[7.5px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                                          lyricsViewMode === 'english'
                                            ? 'bg-emerald-700 text-white shadow-xs'
                                            : 'text-emerald-800 hover:text-emerald-950 hover:bg-emerald-200/60'
                                        }`}
                                      >
                                        <span>🌐 Full English Ver.</span>
                                        {currentTrack.fullLyricsEnglish && (
                                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                                        )}
                                      </button>
                                    </div>

                                    <div className="flex items-center gap-1 ml-auto">
                                      <button
                                        onClick={() => setShowLyricTestPanel(prev => !prev)}
                                        className="text-[7px] font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-0.5 bg-emerald-100 hover:bg-emerald-200/80 px-1.5 py-1 rounded transition-all cursor-pointer"
                                        title="Test & Custom Redo Prompt"
                                      >
                                        <Wand2 className="w-2.5 h-2.5 text-emerald-700" />
                                        <span>Test / Prompt</span>
                                        {showLyricTestPanel ? <ChevronUp className="w-2 h-2" /> : <ChevronDown className="w-2 h-2" />}
                                      </button>

                                      <button
                                        onClick={() => handleGenerateFullLyrics(activeTrackIndex)}
                                        disabled={isGeneratingFullLyrics === activeTrackIndex}
                                        className="text-[7px] font-bold text-emerald-900 hover:text-emerald-950 flex items-center gap-1 bg-emerald-200 hover:bg-emerald-300 px-2 py-1 rounded transition-all cursor-pointer disabled:opacity-50"
                                        title="Regenerate & Redo Full Lyrics"
                                      >
                                        <RefreshCw className={`w-2.5 h-2.5 text-emerald-800 ${isGeneratingFullLyrics === activeTrackIndex ? 'animate-spin' : ''}`} />
                                        <span>Redo Both</span>
                                      </button>

                                      <button
                                        onClick={() => {
                                          const textToCopy = lyricsViewMode === 'english' 
                                            ? (currentTrack.fullLyricsEnglish || currentTrack.fullLyrics || '')
                                            : (currentTrack.fullLyrics || '');
                                          handleCopy(textToCopy, `full-lyrics-${lyricsViewMode}`);
                                        }}
                                        className="text-[7px] font-bold text-emerald-900 hover:text-emerald-950 flex items-center gap-1 bg-emerald-200/80 hover:bg-emerald-300 px-2 py-1 rounded transition-all cursor-pointer"
                                      >
                                        {copiedKey === `full-lyrics-${lyricsViewMode}` ? (
                                          <>
                                            <Check className="w-2.5 h-2.5 text-emerald-700" />
                                            <span className="text-emerald-700 font-bold">Copied! ✓</span>
                                          </>
                                        ) : (
                                          <>
                                            <Copy className="w-2.5 h-2.5" />
                                            <span>Copy</span>
                                          </>
                                        )}
                                      </button>
                                    </div>
                                  </div>

                                  {/* Header Label / Badge */}
                                  <div className="flex items-center justify-between border-b border-emerald-200/70 pb-1">
                                    <span className="text-[7px] font-black uppercase tracking-widest text-emerald-800 flex items-center gap-1">
                                      {lyricsViewMode === 'korean' ? '🇰🇷 OFFICIAL BILINGUAL K-POP LYRICS' : '🌐 OFFICIAL GLOBAL FULL ENGLISH ADAPTATION'}
                                    </span>
                                    <span className="text-[6.5px] font-mono text-emerald-700 font-semibold">
                                      {lyricsViewMode === 'korean' ? 'Original Release' : 'Global Singable English Release'}
                                    </span>
                                  </div>

                                  {/* Collapsible Test / Custom Prompt Panel */}
                                  {showLyricTestPanel && (
                                    <div className="bg-white p-2.5 rounded-lg border border-emerald-300 space-y-2 animate-in fade-in duration-150">
                                      <div className="flex justify-between items-center">
                                        <span className="text-[7px] font-black uppercase tracking-wider text-neutral-700 flex items-center gap-1">
                                          <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                                          TEST & REDO LYRICS (AUTO-GENERATES ENGLISH VERSION TOO)
                                        </span>
                                        <span className="text-[6.5px] font-mono text-neutral-400">Uses song meaning automatically</span>
                                      </div>

                                      {/* Quick Test Preset Chips */}
                                      <div className="space-y-1">
                                        <span className="text-[6.5px] font-bold text-neutral-500 uppercase tracking-wider block">
                                          Verse 1 Opening Styles & Rhyme Dynamics:
                                        </span>
                                        <div className="flex flex-wrap gap-1">
                                          {[
                                            { label: "🔥 Viral Earworm Hook", prompt: "Make the chorus an unforgettable viral earworm with tight 7-8 syllable balance, rhythmic title repetition, infectious vocal chops, syncopated bounce, and singable open vowels." },
                                            { label: "📖 Coherent Story Arc", prompt: "Ensure every line makes 100% logical and narrative sense with clear line-to-line continuity, emotional stakes, and zero random non-sequiturs." },
                                            { label: "🚫 Ban Fake Timestamps", prompt: "Strictly ban all timestamps (no 2 AM, 3 AM, midnight) and phone-screen staring. Ground the lyrics in real dialogue and face-to-face tension." },
                                            { label: "💬 Candid Dialogue V1", prompt: "Execute Verse 1 as punchy, conversational dialogue with realistic relational tension, direct eye contact, witty one-liners, and zero fake timestamps." },
                                            { label: "🕶️ Runway Swagger V1", prompt: "Execute Verse 1 with high-fashion chic attitude, tailored silhouette imagery, unbothered posture, and laid-back pocket flow." },
                                            { label: "⚡ 16-Bar Double-Time V1", prompt: "Execute Verse 1 with immediate 140 BPM fast-cadence double-time syllables and crisp internal rhymes." },
                                            { label: "☕ Sensory Grounding V1", prompt: "Execute Verse 1 with vivid tactile sensory details (cold drink sweating, keys on counter, rushing rain) and intimate breathy delivery." },
                                            { label: "🧩 Multi-Syllabic Rhymes", prompt: "Use Mosaic & Multisyllabic compound rhymes (2-4 matching syllables per bar) across English and Korean lines." },
                                            { label: "🎶 Syncopated Pocket Rhymes", prompt: "Execute syncopated internal rhymes placed off-beat in the 2nd and 4th sixteenth-note pockets rather than predictable end-rhymes." },
                                            { label: "🔥 Anti-Drop Whisper Hook", prompt: "Craft an anti-drop whisper chorus hook with heavy 808 sub-bass and syncopated staccato vocal chops." },
                                            { label: "✨ English-First Hook Launch", prompt: "Use English-First Line Launches for the chorus hook with Korean rhythmic counter-harmonies." },
                                            { label: "⚡ Stadium Gang Chants", prompt: "Include high-energy stadium gang chants and call-and-response shout hooks in chorus & outro." }
                                          ].map((preset, pIdx) => (
                                            <button
                                              key={pIdx}
                                              onClick={() => {
                                                setCustomLyricPrompt(preset.prompt);
                                                handleGenerateFullLyrics(activeTrackIndex, preset.prompt);
                                              }}
                                              disabled={isGeneratingFullLyrics === activeTrackIndex}
                                              className="px-1.5 py-0.5 bg-neutral-100 hover:bg-emerald-100 text-neutral-700 hover:text-emerald-900 text-[6.5px] font-bold rounded border border-neutral-200 transition-colors cursor-pointer disabled:opacity-50"
                                            >
                                              {preset.label}
                                            </button>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Custom Input */}
                                      <div className="flex gap-1">
                                        <input
                                          type="text"
                                          value={customLyricPrompt}
                                          onChange={(e) => setCustomLyricPrompt(e.target.value)}
                                          placeholder="Type custom lyric instructions (e.g. 'More playful banter in pre-chorus')..."
                                          className="flex-1 px-2 py-1 bg-neutral-50 text-[8px] rounded border border-neutral-200 focus:outline-none focus:border-emerald-500 font-medium"
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter' && customLyricPrompt.trim()) {
                                              handleGenerateFullLyrics(activeTrackIndex, customLyricPrompt);
                                            }
                                          }}
                                        />
                                        <button
                                          onClick={() => handleGenerateFullLyrics(activeTrackIndex, customLyricPrompt)}
                                          disabled={isGeneratingFullLyrics === activeTrackIndex}
                                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[7.5px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                        >
                                          <RefreshCw className={`w-2.5 h-2.5 ${isGeneratingFullLyrics === activeTrackIndex ? 'animate-spin' : ''}`} />
                                          <span>Redo</span>
                                        </button>
                                      </div>
                                    </div>
                                  )}

                                  {/* Lyrics Text Display */}
                                  {lyricsViewMode === 'english' ? (
                                    currentTrack.fullLyricsEnglish ? (
                                      <p className="text-[9px] text-emerald-950 whitespace-pre-line leading-relaxed font-medium">
                                        {currentTrack.fullLyricsEnglish}
                                      </p>
                                    ) : (
                                      <div className="p-3 bg-white/70 rounded-lg border border-emerald-200 text-center space-y-1.5">
                                        <p className="text-[8px] text-neutral-600 font-medium">
                                          English version was not generated for this legacy session yet. Click below to generate the English Version!
                                        </p>
                                        <button
                                          onClick={() => handleGenerateFullLyrics(activeTrackIndex)}
                                          disabled={isGeneratingFullLyrics === activeTrackIndex}
                                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[7.5px] font-black uppercase tracking-wider inline-flex items-center gap-1 cursor-pointer"
                                        >
                                          <Sparkles className="w-2.5 h-2.5" />
                                          <span>Generate English Version</span>
                                        </button>
                                      </div>
                                    )
                                  ) : (
                                    <p className="text-[9px] text-emerald-950 whitespace-pre-line leading-relaxed font-medium">
                                      {currentTrack.fullLyrics}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <div className="bg-neutral-100/80 p-3 rounded-xl border border-neutral-200 text-center space-y-2">
                                  <div className="flex flex-col items-center gap-1">
                                    <Sparkles className="w-4 h-4 text-emerald-600" />
                                    <span className="text-[8px] font-black uppercase text-neutral-800 tracking-wider">
                                      FULL SONG LYRICS NOT GENERATED YET
                                    </span>
                                    <p className="text-[8px] text-neutral-600 font-medium max-w-xs">
                                      Generate complete bilingual K-pop lyrics AND the official full English Version with role tags, vocal directions, and storytelling grounded in: "{currentTrack?.meaning || 'anthem'}".
                                    </p>
                                  </div>

                                  <button
                                    onClick={() => handleGenerateFullLyrics(activeTrackIndex)}
                                    disabled={isGeneratingFullLyrics === activeTrackIndex}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer shadow-2xs disabled:opacity-50"
                                  >
                                    <Sparkles className={`w-3 h-3 ${isGeneratingFullLyrics === activeTrackIndex ? 'animate-spin' : ''}`} />
                                    <span>{isGeneratingFullLyrics === activeTrackIndex ? 'Generating Full Lyrics & English Ver...' : 'Generate Full Lyrics & English Ver.'}</span>
                                  </button>
                                </div>
                              )}

                              {trackRegenError && (
                                <div className="p-2 bg-rose-50 text-rose-700 text-[8px] font-bold rounded-lg">{trackRegenError}</div>
                              )}
                            </div>
                          )}

                          {/* Tab 2: Music Style Prompt */}
                          {infoTab === 'prompt' && (
                            <div className="space-y-2.5 py-2 flex-grow overflow-y-auto max-h-[220px] text-left">
                              <div className="bg-neutral-950 text-emerald-300 p-3 rounded-xl border border-neutral-800 space-y-2">
                                <div className="flex justify-between items-center border-b border-neutral-800 pb-1.5">
                                  <div className="flex items-center gap-1.5">
                                    <Sliders className="w-3 h-3 text-emerald-400" />
                                    <span className="text-[7.5px] font-mono font-bold uppercase tracking-wider text-neutral-300">
                                      AI MUSIC STYLE PROMPT (NO LYRICS)
                                    </span>
                                  </div>
                                  <span className="text-[6.5px] font-mono font-black uppercase text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                                    Suno / Udio / DAW Ready
                                  </span>
                                </div>

                                <div className="space-y-1">
                                  <div className="flex flex-wrap gap-1">
                                    {(currentTrack?.genres && currentTrack.genres.length > 0 ? currentTrack.genres : [currentTrack?.genre || 'K-Pop']).map((g, gi) => (
                                      <span key={gi} className="px-1.5 py-0.5 bg-neutral-900 text-emerald-400 text-[7px] font-mono font-bold rounded border border-emerald-500/20">
                                        {g}
                                      </span>
                                    ))}
                                  </div>
                                  <p className="text-[8.5px] font-mono text-neutral-200 leading-relaxed whitespace-pre-wrap bg-neutral-900/90 p-2 rounded-lg border border-neutral-800">
                                    {activeMusicPrompt}
                                  </p>
                                </div>

                                <button
                                  onClick={() => handleCopy(activeMusicPrompt, 'tab-music-prompt')}
                                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-98"
                                >
                                  {copiedKey === 'tab-music-prompt' ? (
                                    <>
                                      <Check className="w-3 h-3 text-neutral-950" />
                                      <span>Copied Music Style Prompt! ✓</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      <span>Copy Music Style Prompt</span>
                                    </>
                                  )}
                                </button>
                              </div>

                              {currentTrack?.vocalArrangement && (
                                <div className="p-2 bg-white rounded-lg border border-neutral-200">
                                  <span className="text-[7px] font-black uppercase tracking-widest text-neutral-500 block mb-0.5">VOCAL ARRANGEMENT SPECIFICATION</span>
                                  <p className="text-[8px] text-neutral-800 font-mono leading-relaxed">
                                    {currentTrack.vocalArrangement}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Tab 3: Live Fan Stream */}
                          {infoTab === 'feedback' && (
                            <div className="space-y-1.5 py-2 flex-grow overflow-y-auto max-h-[220px] text-left">
                              {chatMessages.map((msg, i) => (
                                <div key={i} className="text-[8px] leading-tight">
                                  <span className="font-black text-emerald-800 uppercase">@{msg.username}: </span>
                                  <span className="text-neutral-700 font-medium">{msg.text}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Action buttons */}
                          <div className="pt-2 border-t border-neutral-200 flex flex-wrap gap-2">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleRegenerateTrackTitleOnly(activeTrackIndex)}
                                disabled={isRegeneratingTrackTitle === activeTrackIndex}
                                className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 py-1.5 px-3 rounded-full text-[8px] font-black uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50 transition-all shadow-2xs"
                                title="Regenerate ONLY this track's title (all lyrics and sound prompts preserved)"
                              >
                                <RefreshCw className={`w-2.5 h-2.5 text-amber-700 ${isRegeneratingTrackTitle === activeTrackIndex ? 'animate-spin' : ''}`} />
                                <span>{isRegeneratingTrackTitle === activeTrackIndex ? 'Naming...' : 'Regen Title Only'}</span>
                              </button>
                              <button
                                onClick={() => setTitleRegenModalTrackIdx(activeTrackIndex)}
                                className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200 p-1.5 rounded-full text-[8px] flex items-center justify-center cursor-pointer transition-all"
                                title="Options & custom prompt for title"
                              >
                                <Wand2 className="w-2.5 h-2.5 text-amber-600" />
                              </button>
                            </div>

                            <button
                              onClick={() => handleRegenerateTrack(activeTrackIndex)}
                              disabled={isRegeneratingTrack === activeTrackIndex}
                              className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white py-1.5 px-2 rounded-full text-[8px] font-black uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50 min-w-[110px]"
                            >
                              <RefreshCw className={`w-3 h-3 ${isRegeneratingTrack === activeTrackIndex ? 'animate-spin' : ''}`} />
                              <span>Regen Demo & Style</span>
                            </button>

                            <button
                              onClick={() => handleGenerateFullLyrics(activeTrackIndex)}
                              disabled={isGeneratingFullLyrics === activeTrackIndex}
                              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 px-2 rounded-full text-[8px] font-black uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50 min-w-[110px]"
                            >
                              {currentTrack?.fullLyrics ? (
                                <>
                                  <RefreshCw className={`w-3 h-3 ${isGeneratingFullLyrics === activeTrackIndex ? 'animate-spin' : ''}`} />
                                  <span>Redo Full Lyrics</span>
                                </>
                              ) : (
                                <>
                                  <Sparkles className={`w-3 h-3 ${isGeneratingFullLyrics === activeTrackIndex ? 'animate-spin' : ''}`} />
                                  <span>Generate Full Lyrics</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })()}

                  {/* Track List Table */}
                  <div className="space-y-2">
                    <span className="text-[7.5px] font-black uppercase tracking-widest text-neutral-400 font-mono">
                      OFFICIAL TRACKLIST, GENRES & PRODUCERS
                    </span>
                    <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                      <table className="w-full text-left text-[9px]">
                        <thead className="bg-neutral-50 text-neutral-500 font-black uppercase border-b border-neutral-200">
                          <tr>
                            <th className="px-3 py-2 text-center w-8">#</th>
                            <th className="px-3 py-2">TITLE & GENRES</th>
                            <th className="px-3 py-2">ROLE & RHYME</th>
                            <th className="px-3 py-2">PRODUCERS & CHOREO</th>
                            <th className="px-3 py-2 text-center w-36">ACTIONS</th>
                            <th className="px-3 py-2 text-center w-12">TIME</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                          {selectedAlbum.tracks?.map((track, idx) => {
                            const isCurrent = idx === activeTrackIndex;
                            const promptText = track.musicStylePrompt || buildMusicStylePrompt(track, groupProfile.groupName);
                            const lyricsText = track.fullLyrics || track.lyricExcerpt || '';

                            return (
                              <tr
                                key={idx}
                                onClick={() => handleSelectTrack(idx)}
                                className={`cursor-pointer transition-colors ${
                                  isCurrent ? 'bg-emerald-50/80 font-bold border-l-4 border-emerald-500' : 'hover:bg-neutral-50'
                                }`}
                              >
                                <td className="px-3 py-2 text-center text-neutral-400 font-bold">{idx + 1}</td>
                                <td className="px-3 py-2">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-black uppercase text-neutral-900">{track.title}</span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRegenerateTrackTitleOnly(idx);
                                      }}
                                      disabled={isRegeneratingTrackTitle === idx}
                                      className="p-1 rounded-full text-neutral-400 hover:text-amber-700 hover:bg-amber-100 transition-all cursor-pointer disabled:opacity-50"
                                      title={`Regenerate title for "${track.title}" (only this song)`}
                                    >
                                      <RefreshCw className={`w-2.5 h-2.5 ${isRegeneratingTrackTitle === idx ? 'animate-spin text-amber-600' : ''}`} />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setTitleRegenModalTrackIdx(idx);
                                      }}
                                      className="p-1 rounded-full text-neutral-300 hover:text-amber-600 hover:bg-amber-100 transition-all cursor-pointer"
                                      title={`Custom options & vibe directives for "${track.title}"`}
                                    >
                                      <Wand2 className="w-2.5 h-2.5" />
                                    </button>
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-0.5">
                                    {(track.genres && track.genres.length > 0 ? track.genres : [track.genre || 'K-Pop']).map((g, gi) => (
                                      <span key={gi} className="px-1.5 py-0.2 bg-neutral-100 text-neutral-600 text-[6.5px] font-mono rounded">
                                        {g}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                                <td className="px-3 py-2">
                                  <span className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase block w-max mb-0.5 ${
                                    track.role === 'Title Track' ? 'bg-rose-100 text-rose-800' : 'bg-neutral-100 text-neutral-600'
                                  }`}>
                                    {track.role}
                                  </span>
                                  {track.rhymeScheme && (
                                    <span className="text-[6.5px] text-neutral-400 font-mono block">
                                      {track.rhymeScheme}
                                    </span>
                                  )}
                                </td>
                                <td className="px-3 py-2 text-[7.5px] text-neutral-600">
                                  <div>Prod: {track.producers?.join(', ')}</div>
                                  {track.choreographer && <div>Choreo: {track.choreographer}</div>}
                                </td>
                                <td className="px-3 py-2 text-center" onClick={e => e.stopPropagation()}>
                                  <div className="flex items-center justify-center gap-1">
                                    <button
                                      onClick={() => handleRegenerateTrackTitleOnly(idx)}
                                      disabled={isRegeneratingTrackTitle === idx}
                                      className="px-1.5 py-0.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 text-[7px] font-bold flex items-center gap-0.5 cursor-pointer disabled:opacity-50 transition-all border border-amber-200/60"
                                      title={`Regenerate ONLY the title for "${track.title}"`}
                                    >
                                      <RefreshCw className={`w-2.5 h-2.5 text-amber-700 ${isRegeneratingTrackTitle === idx ? 'animate-spin' : ''}`} />
                                      <span>{isRegeneratingTrackTitle === idx ? 'Naming...' : 'Title'}</span>
                                    </button>

                                    <button
                                      onClick={() => handleCopy(lyricsText, `table-lyric-${idx}`)}
                                      className="px-1.5 py-0.5 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[7px] font-bold flex items-center gap-0.5 cursor-pointer"
                                      title="Copy Lyrics"
                                    >
                                      {copiedKey === `table-lyric-${idx}` ? (
                                        <Check className="w-2.5 h-2.5 text-emerald-600" />
                                      ) : (
                                        <Copy className="w-2.5 h-2.5" />
                                      )}
                                      <span>Lyrics</span>
                                    </button>

                                    <button
                                      onClick={() => handleCopy(promptText, `table-prompt-${idx}`)}
                                      className="px-1.5 py-0.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[7px] font-bold flex items-center gap-0.5 cursor-pointer"
                                      title="Copy Music Style Prompt"
                                    >
                                      {copiedKey === `table-prompt-${idx}` ? (
                                        <Check className="w-2.5 h-2.5 text-emerald-700" />
                                      ) : (
                                        <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                                      )}
                                      <span>Style</span>
                                    </button>

                                    <button
                                      onClick={() => {
                                        setActiveTrackIndex(idx);
                                        setSelectedDetailTab('mv_visuals');
                                      }}
                                      className="px-1.5 py-0.5 rounded bg-purple-100 hover:bg-purple-200 text-purple-800 text-[7px] font-bold flex items-center gap-0.5 cursor-pointer"
                                      title="View MV Look & Member Outfits for this track"
                                    >
                                      <Shirt className="w-2.5 h-2.5 text-purple-600" />
                                      <span>MV & Fit</span>
                                    </button>
                                  </div>
                                </td>
                                <td className="px-3 py-2 text-center font-mono text-neutral-500 font-bold">{track.duration}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= SUBTAB: ALBUM COVER DESIGN STUDIO ================= */}
              {selectedDetailTab === 'cover_studio' && (
                <AlbumCoverStudio
                  album={selectedAlbum}
                  albumIdx={selectedAlbumIndex}
                  groupProfile={groupProfile}
                  isGeneratingCover={isGeneratingCover}
                  coverError={coverError}
                  onGenerateCover={handleGenerateAlbumCover}
                  onOpenLightbox={(url) => setCoverModalUrl(url)}
                  isPlaying={isPlaying}
                />
              )}

              {/* ================= SUBTAB: TRACK MV SETTINGS & MEMBER CONCEPT OUTFITS ================= */}
              {selectedDetailTab === 'mv_visuals' && (
                <TrackMvVisualsStudio
                  album={selectedAlbum}
                  albumIdx={selectedAlbumIndex}
                  tracks={selectedAlbum.tracks || []}
                  groupProfile={groupProfile}
                  activeTrackIndex={activeTrackIndex}
                  onSelectTrack={(idx) => handleSelectTrack(idx)}
                  onUpdateAlbum={(updatedAlbum) => {
                    if (!onUpdateProfile) return;
                    const newDiscography = [...initializedDiscography];
                    newDiscography[selectedAlbumIndex] = updatedAlbum;
                    onUpdateProfile({
                      ...groupProfile,
                      discography: newDiscography
                    });
                  }}
                  onNavigateToLineup={onNavigateToLineup}
                />
              )}

              {/* ================= SUBTAB: CHART RECORDS & TROPHIES ================= */}
              {selectedDetailTab === 'charts' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-left space-y-1">
                      <span className="text-[7px] font-mono font-bold text-neutral-400 uppercase">HANTEO FIRST-WEEK</span>
                      <h4 className="text-base font-black text-neutral-950">{selectedAlbum.chartRecords?.hanteoFirstWeekSales}</h4>
                      <span className="text-[7px] font-black text-emerald-600 uppercase">★ MILLION SELLER</span>
                    </div>

                    <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-left space-y-1">
                      <span className="text-[7px] font-mono font-bold text-neutral-400 uppercase">MELON REALTIME</span>
                      <h4 className="text-base font-black text-neutral-950">#{selectedAlbum.chartRecords?.melonPeakRank || 1} PEAK</h4>
                      <span className="text-[7px] font-black text-rose-600 uppercase">● REAL-TIME ALL-KILL</span>
                    </div>

                    <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-left space-y-1">
                      <span className="text-[7px] font-mono font-bold text-neutral-400 uppercase">SPOTIFY GLOBAL 200</span>
                      <h4 className="text-base font-black text-neutral-950">#{selectedAlbum.chartRecords?.spotifyGlobalPeak || 8} PEAK</h4>
                      <span className="text-[7px] font-black text-teal-600 uppercase">{selectedAlbum.chartRecords?.spotifyStreams}</span>
                    </div>

                    <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-left space-y-1">
                      <span className="text-[7px] font-mono font-bold text-neutral-400 uppercase">YOUTUBE MV MILESTONE</span>
                      <h4 className="text-base font-black text-neutral-950">{selectedAlbum.chartRecords?.youtubeViews}</h4>
                      <span className="text-[7px] font-black text-amber-600 uppercase">#1 TRENDING WORLDWIDE</span>
                    </div>
                  </div>

                  {/* Music Show Trophy Cabinet */}
                  <div className="p-5 bg-neutral-950 text-white rounded-2xl border border-neutral-800 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-amber-400" />
                        <h4 className="text-sm font-black uppercase text-white">Music Show Trophy Cabinet (11 Wins)</h4>
                      </div>
                      <span className="text-[8px] font-black uppercase text-amber-400 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-400/30">
                        2x TRIPLE CROWN
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {selectedAlbum.chartRecords?.musicShowWins?.map((show, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/10 p-3 rounded-xl text-center space-y-1">
                          <Trophy className={`w-6 h-6 mx-auto ${show.isTripleCrown ? 'text-amber-400' : 'text-neutral-400'}`} />
                          <h5 className="text-[9px] font-black uppercase text-white truncate">{show.showName}</h5>
                          <span className="text-xs font-black text-emerald-400 block">{show.count} Wins</span>
                          {show.isTripleCrown && (
                            <span className="text-[6.5px] font-black uppercase text-amber-300 bg-amber-400/20 px-1.5 py-0.5 rounded block">
                              Triple Crown
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Official Industry Certifications */}
                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-2">
                    <span className="text-[7.5px] font-mono font-bold text-neutral-400 uppercase tracking-widest block">
                      OFFICIAL INDUSTRY RECORD CERTIFICATIONS
                    </span>
                    <div className="flex gap-2 flex-wrap">
                      {selectedAlbum.chartRecords?.certifications?.map((cert, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl border border-neutral-200 text-[8.5px] font-black uppercase text-neutral-800 shadow-2xs">
                          <Award className="w-3.5 h-3.5 text-amber-500" />
                          <span>{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ================= SUBTAB: VOCAL LINE DISTRIBUTION ================= */}
              {selectedDetailTab === 'distribution' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
                    <div>
                      <h4 className="text-xs font-black uppercase text-neutral-900">
                        {isSolo 
                          ? `Vocal Dynamics & Performance Breakdown for "${selectedAlbum.tracks?.[activeTrackIndex]?.title}"` 
                          : `Vocal & Rap Line Distribution for "${selectedAlbum.tracks?.[activeTrackIndex]?.title}"`}
                      </h4>
                      <p className="text-[9px] text-neutral-500">
                        {isSolo 
                          ? "Breakdown of solo vocal delivery, rap dynamics, and layered self-harmonies." 
                          : "Breakdown of vocal seconds and lyrical part share per member."}
                      </p>
                    </div>
                  </div>

                  {/* Stacked Progress Bar */}
                  <div className="w-full h-4 rounded-full overflow-hidden flex shadow-inner bg-neutral-100">
                    {selectedAlbum.tracks?.[activeTrackIndex]?.lineDistribution?.map((dist, idx) => (
                      <div
                        key={idx}
                        style={{
                          width: `${dist.percentage}%`,
                          backgroundColor: dist.color || `hsl(${(idx * 360) / 5}, 70%, 50%)`
                        }}
                        className="h-full relative group transition-all"
                        title={`${dist.memberName}: ${dist.percentage}% (${dist.seconds}s)`}
                      />
                    ))}
                  </div>

                  {/* Member Line Breakdown Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {selectedAlbum.tracks?.[activeTrackIndex]?.lineDistribution?.map((dist, idx) => {
                      const memberObj = groupProfile.members?.find(m => m.stageName === dist.memberName);
                      return (
                        <div key={idx} className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-200 shrink-0 border border-neutral-300">
                            <img 
                              src={memberObj?.imageUrl || `https://ui-avatars.com/api/?name=${dist.memberName}`} 
                              alt={dist.memberName} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-grow">
                            <div className="flex justify-between items-baseline">
                              <h5 className="text-xs font-black uppercase text-neutral-900 truncate">{dist.memberName}</h5>
                              <span className="text-xs font-black text-emerald-700">{dist.percentage}%</span>
                            </div>
                            <span className="text-[7.5px] text-neutral-500 font-bold block">{dist.seconds}s • {dist.partDescription}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ================= SUBTAB: MV STORYBOARD & STILLS ================= */}
              {selectedDetailTab === 'narrative' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Shirt className="w-4 h-4 text-purple-600 shrink-0" />
                      <div>
                        <h5 className="text-[10px] font-black uppercase text-purple-950">
                          {isSolo ? "Track-by-Track MV Setting & Solo Outfits" : "Track-by-Track MV Setting & Concept Outfits"}
                        </h5>
                        <p className="text-[8px] text-purple-700">
                          {isSolo ? "Looking for song-specific set locations and solo artist costume lookbooks?" : "Looking for song-specific set locations and member-by-member costume lookbooks?"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedDetailTab('mv_visuals')}
                      className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-full text-[7.5px] font-black uppercase tracking-wider flex items-center gap-1 shrink-0 transition-all cursor-pointer shadow-2xs"
                    >
                      <span>Open Outfits Studio</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="p-4 bg-neutral-950 text-white rounded-2xl border border-neutral-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-emerald-400" />
                        <h4 className="text-xs font-black uppercase tracking-wider text-white">
                          "{selectedAlbum.titleTrack}" Official MV Concept Synopsis
                        </h4>
                      </div>

                      <button
                        onClick={handleGenerateMvStill}
                        disabled={isGeneratingMvStill}
                        className="bg-white text-neutral-950 px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isGeneratingMvStill ? <Sparkles className="w-3 h-3 animate-spin text-emerald-600" /> : <Sparkles className="w-3 h-3 text-amber-500" />}
                        <span>{mvStillUrl ? 'Regen 4K MV Still' : 'Generate 4K MV Still'}</span>
                      </button>
                    </div>

                    <p className="text-xs text-neutral-300 leading-relaxed font-medium italic">
                      "{selectedAlbum.mvSynopsis}"
                    </p>

                    {mvStillUrl && (
                      <div className="rounded-xl overflow-hidden border border-white/10 aspect-[16/9] shadow-2xl relative group">
                        <img src={mvStillUrl} alt="MV Cinematic Still" className="w-full h-full object-cover" />
                        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <a 
                            href={mvStillUrl} 
                            download={`MV-Still-${selectedAlbum.titleTrack}.png`}
                            className="bg-black/80 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" /> Save Still
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Scene Storyboard */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { scene: "Scene 01", title: "THE HOOK TEASER", detail: "Atmospheric establishing shots introducing the conceptual world under cinematic neon mist." },
                      { scene: "Scene 02", title: "GROUP STAGECRAFT", detail: "Dynamic synchronized chorus choreography in a massive custom architectural set." },
                      { scene: "Scene 03", title: "STORY CLIMAX", detail: "Dramatic member close-ups facing emotional tension with intense high-fashion lighting." },
                      { scene: "Scene 04", title: "GOLDEN OUTRO", detail: "Sweeping tracking camera pan as the final harmony rings out, sealing their legendary era." }
                    ].map((item, si) => (
                      <div key={si} className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1 text-left">
                        <span className="text-[7px] font-mono font-bold text-emerald-600 uppercase">{item.scene}</span>
                        <h5 className="text-[10px] font-black uppercase text-neutral-900">{item.title}</h5>
                        <p className="text-[8px] text-neutral-600 leading-normal">{item.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= SUBTAB: PACKAGING & INCLUSIONS ================= */}
              {selectedDetailTab === 'inclusions' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
                    <h4 className="text-xs font-black uppercase text-neutral-900">Physical Album Versions & Retail Inclusions</h4>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {selectedAlbum.physicalInclusions?.map((inclusion, idx) => (
                      <div key={idx} className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-900 shrink-0">
                          <Package className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[6.5px] font-mono font-bold text-neutral-400 uppercase block">ITEM 0{idx + 1}</span>
                          <span className="text-[9px] font-black uppercase text-neutral-900 truncate block">{inclusion}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= SUBTAB: STRATEGY ================= */}
              {selectedDetailTab === 'strategy' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-2 text-left">
                      <span className="text-[7.5px] font-black uppercase tracking-widest text-emerald-700 font-mono">TARGET MARKET BLUEPRINT</span>
                      <p className="text-xs text-neutral-700 leading-relaxed font-medium">
                        {selectedAlbum.targetMarketStrategy}
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-2 text-left">
                      <span className="text-[7.5px] font-black uppercase tracking-widest text-neutral-400 font-mono">LAUNCH METRICS</span>
                      <div className="space-y-2 text-[8.5px] font-bold">
                        <div className="flex justify-between">
                          <span className="text-neutral-500">PRODUCTION BUDGET:</span>
                          <span className="text-neutral-900 font-black">{groupProfile.simulationMetrics?.estimatedDebutBudget || "$450,000"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">TARGET DEMOGRAPHIC:</span>
                          <span className="text-neutral-900 font-black">{groupProfile.simulationMetrics?.targetDemographicReach || "GLOBAL_TIER_A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">CHART TARGET:</span>
                          <span className="text-emerald-700 font-black">TOP 10 BILLBOARD 200</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="p-12 text-center bg-white border border-neutral-200 rounded-2xl">
              <Disc className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-neutral-500">No discography releases found.</p>
            </div>
          )}
        </div>

      </div>

      {/* Album Cover Lightbox Modal */}
      {coverModalUrl && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-neutral-950 border border-white/10 rounded-3xl p-4 max-w-lg w-full text-center space-y-4">
            <div className="flex justify-between items-center text-white">
              <h4 className="text-xs font-black uppercase">{selectedAlbum?.title} Cover Artwork</h4>
              <button onClick={() => setCoverModalUrl(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-square rounded-2xl overflow-hidden border border-white/20">
              <img src={coverModalUrl} alt="Album Cover" className="w-full h-full object-cover" />
            </div>

            <div className="flex gap-2">
              <a
                href={coverModalUrl}
                download={`${selectedAlbum?.title}-Cover.png`}
                className="flex-1 bg-white text-neutral-950 py-2.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Save High-Res Cover</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Album Edit Modal */}
      {isEditingAlbum && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full max-h-[85vh] overflow-y-auto space-y-4 border border-neutral-200 shadow-2xl">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <h3 className="text-sm font-black uppercase text-neutral-950">Modify Album Blueprint</h3>
              <button onClick={() => setIsEditingAlbum(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[7.5px] font-black uppercase text-neutral-400 block mb-1">Album Title</label>
                  <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} className="w-full border border-neutral-200 rounded-lg p-2 text-xs font-bold" />
                </div>
                <div>
                  <label className="text-[7.5px] font-black uppercase text-neutral-400 block mb-1">Type</label>
                  <select value={editType} onChange={e => setEditType(e.target.value as any)} className="w-full border border-neutral-200 rounded-lg p-2 text-xs font-bold bg-white">
                    <option value="Mini Album">Mini Album</option>
                    <option value="Full Album">Full Album</option>
                    <option value="Single">Single</option>
                    <option value="Repackage">Repackage</option>
                  </select>
                </div>
                <div>
                  <label className="text-[7.5px] font-black uppercase text-neutral-400 block mb-1">Release Date</label>
                  <input type="text" value={editReleaseDate} onChange={e => setEditReleaseDate(e.target.value)} className="w-full border border-neutral-200 rounded-lg p-2 text-xs font-bold" />
                </div>
                <div>
                  <label className="text-[7.5px] font-black uppercase text-neutral-400 block mb-1">Title Track</label>
                  <input type="text" value={editTitleTrack} onChange={e => setEditTitleTrack(e.target.value)} className="w-full border border-neutral-200 rounded-lg p-2 text-xs font-bold" />
                </div>
              </div>

              <div>
                <label className="text-[7.5px] font-black uppercase text-neutral-400 block mb-1">Concept Summary</label>
                <textarea rows={2} value={editConcept} onChange={e => setEditConcept(e.target.value)} className="w-full border border-neutral-200 rounded-lg p-2 text-xs font-bold" />
              </div>

              <div>
                <label className="text-[7.5px] font-black uppercase text-neutral-400 block mb-1">MV Synopsis</label>
                <textarea rows={2} value={editMv} onChange={e => setEditMv(e.target.value)} className="w-full border border-neutral-200 rounded-lg p-2 text-xs font-bold" />
              </div>

              <div>
                <label className="text-[7.5px] font-black uppercase text-neutral-400 block mb-1">Target Strategy</label>
                <textarea rows={2} value={editStrategy} onChange={e => setEditStrategy(e.target.value)} className="w-full border border-neutral-200 rounded-lg p-2 text-xs font-bold" />
              </div>

              <div>
                <label className="text-[7.5px] font-black uppercase text-neutral-400 block mb-1">Inclusions (comma separated)</label>
                <input type="text" value={editInclusions} onChange={e => setEditInclusions(e.target.value)} className="w-full border border-neutral-200 rounded-lg p-2 text-xs font-bold" />
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex justify-end gap-2">
              <button onClick={() => setIsEditingAlbum(false)} className="px-4 py-2 text-xs font-black uppercase text-neutral-500">Cancel</button>
              <button onClick={handleSaveAlbumEdit} className="bg-neutral-900 hover:bg-neutral-800 text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Song Title Regeneration Modal */}
      {titleRegenModalTrackIdx !== null && selectedAlbum && (() => {
        const track = selectedAlbum.tracks?.[titleRegenModalTrackIdx];
        if (!track) return null;

        return (
          <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 border border-neutral-200 shadow-2xl">
              <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase text-neutral-950 tracking-tight">Regenerate Song Title</h3>
                    <p className="text-[9px] text-neutral-500 font-medium">Generate a new title for this specific song only</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setTitleRegenModalTrackIdx(null);
                    setCustomTitlePrompt('');
                  }} 
                  className="text-neutral-400 hover:text-neutral-700 cursor-pointer p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Track snapshot card */}
              <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[7.5px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                    TRACK #{titleRegenModalTrackIdx + 1} CURRENT TITLE
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[7px] font-black uppercase ${
                    track.role === 'Title Track' ? 'bg-rose-100 text-rose-800' : 'bg-neutral-200 text-neutral-700'
                  }`}>
                    {track.role}
                  </span>
                </div>
                <div className="text-base font-black text-neutral-900 uppercase">
                  "{track.title}"
                </div>
                <div className="flex flex-wrap gap-1.5 text-[7.5px] font-mono text-neutral-500">
                  <span>Genre: <strong className="text-neutral-800">{track.genre || 'K-Pop'}</strong></span>
                  <span>•</span>
                  <span>Album: <strong className="text-neutral-800">{selectedAlbum.title}</strong></span>
                  <span>•</span>
                  <span>Duration: <strong className="text-neutral-800">{track.duration}</strong></span>
                </div>
              </div>

              {/* Protection assurance */}
              <div className="flex items-start gap-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-[8.5px]">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Targeted Update:</strong> Only this specific song's title will be regenerated. All demo and full bilingual lyrics, producer credits, choreography, and other songs on this album remain completely untouched.
                </p>
              </div>

              {/* Quick Style Chips */}
              <div className="space-y-1.5">
                <label className="text-[7.5px] font-black uppercase text-neutral-400 block tracking-wider">
                  OPTIONAL VIBE PRESETS (CLICK TO SET)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "🔥 Punchy 1-Word Hit",
                    "⚡ High-Energy Club Banger",
                    "🌌 Dreamy & Ethereal Synth",
                    "🖤 Dark, Fierce & Edgy",
                    "🍬 Sweet Y2K Pop Hook",
                    "🔮 Deep Lore Metaphor",
                    "🏙️ Late Night R&B Mood",
                    "💥 Hypnotic Siren Sound"
                  ].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setCustomTitlePrompt(chip)}
                      className={`px-2.5 py-1 rounded-full text-[8px] font-bold border transition-all cursor-pointer ${
                        customTitlePrompt === chip
                          ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-2xs font-black'
                          : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom prompt input */}
              <div className="space-y-1">
                <label className="text-[7.5px] font-black uppercase text-neutral-400 block tracking-wider">
                  OR TYPE CUSTOM INSTRUCTIONS / KEYWORDS (OPTIONAL)
                </label>
                <input
                  type="text"
                  value={customTitlePrompt}
                  onChange={(e) => setCustomTitlePrompt(e.target.value)}
                  placeholder="e.g. cybernetic neon, French word, dramatic heartbreak, catchy hook..."
                  className="w-full border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTitleRegenModalTrackIdx(null);
                    setCustomTitlePrompt('');
                  }}
                  disabled={isRegeneratingTrackTitle !== null}
                  className="px-4 py-2 text-xs font-black uppercase text-neutral-400 hover:text-neutral-700 cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleRegenerateTrackTitleOnly(titleRegenModalTrackIdx)}
                    disabled={isRegeneratingTrackTitle !== null}
                    className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all"
                  >
                    <Sparkles className="w-3 h-3 text-neutral-600" />
                    <span>Surprise Me</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRegenerateTrackTitleOnly(titleRegenModalTrackIdx, customTitlePrompt)}
                    disabled={isRegeneratingTrackTitle !== null}
                    className="bg-amber-600 hover:bg-amber-700 active:scale-95 text-white px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-md transition-all"
                  >
                    <RefreshCw className={`w-3 h-3 ${isRegeneratingTrackTitle !== null ? 'animate-spin' : ''}`} />
                    <span>{isRegeneratingTrackTitle !== null ? 'Generating New Title...' : 'Regenerate Title'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
};
