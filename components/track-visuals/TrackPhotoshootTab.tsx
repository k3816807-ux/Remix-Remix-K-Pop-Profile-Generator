import React from 'react';
import type { Track, TrackMvVisuals, GroupProfileData } from '../../types';
import { normalizeColorPalette } from '../../services/colorHelper';
import { 
  Users, 
  Sparkles, 
  Camera, 
  Layers, 
  Trash2, 
  Maximize2, 
  Download, 
  Check, 
  Copy, 
  SlidersHorizontal, 
  Dices, 
  RotateCcw, 
  Lightbulb, 
  X, 
  Send, 
  ShieldCheck, 
  ArrowRight, 
  Film, 
  Palette, 
  Sparkle,
  Shirt,
  RefreshCw,
  Clapperboard,
  UserCheck
} from 'lucide-react';

import { 
  GEMINI_MODEL_IMAGE, 
  GEMINI_MODEL_IMAGE_FAST, 
  GEMINI_MODEL_IMAGE_LEGACY 
} from '../../constants';

interface TrackPhotoshootTabProps {
  currentTrack?: Track;
  activeVisuals: TrackMvVisuals;
  members: NonNullable<GroupProfileData['members']>;
  groupProfile: GroupProfileData;
  isGeneratingGroupPhoto: boolean;
  compositeProgressText: string;
  showDirectorGuidance: boolean;
  setShowDirectorGuidance: (show: boolean) => void;
  customDirectorNotes: string;
  setCustomDirectorNotes: (notes: string) => void;
  isGeneratingMvStill: boolean;
  copiedKey: string | null;
  onCompositeGroupPhotoshoot: (autoRefreshOutfits?: boolean) => void;
  onShuffleOutfits: () => void;
  onClearGroupPhotoshoot: () => void;
  onResetPhotoshootAndOutfits: () => void;
  onRecombineExistingPhotos: () => void;
  onRenderGroupMvPhotoshootDirect: () => void;
  onRenderGroupMvPhotoshoot: () => void;
  onRenderMvStill: () => void;
  onClearMvStill: () => void;
  settingStillMode?: 'with_members' | 'scenery_only';
  onSetSettingStillMode?: (mode: 'with_members' | 'scenery_only') => void;
  generatingSceneIdx?: number | null;
  onRenderStoryboardScene?: (sceneIndex: number) => void;
  onClearStoryboardScene?: (sceneIndex: number) => void;
  isRegeneratingStoryboard?: boolean;
  onRegenerateStoryboard?: () => void;
  selectedImageModel?: string;
  onSelectImageModel?: (model: string) => void;
  strictFaceLikeness?: boolean;
  onToggleStrictFaceLikeness?: () => void;
  onOpenLightbox: (data: { url: string; title: string; subtitle?: string }) => void;
  onCopy: (text: string, key: string) => void;
  onNavigateToLineup?: () => void;
  onGoToStyling: () => void;
  onGoToOutfits: () => void;
}

export const TrackPhotoshootTab: React.FC<TrackPhotoshootTabProps> = ({
  currentTrack,
  activeVisuals,
  members,
  groupProfile,
  isGeneratingGroupPhoto,
  compositeProgressText,
  showDirectorGuidance,
  setShowDirectorGuidance,
  customDirectorNotes,
  setCustomDirectorNotes,
  isGeneratingMvStill,
  copiedKey,
  onCompositeGroupPhotoshoot,
  onShuffleOutfits,
  onClearGroupPhotoshoot,
  onResetPhotoshootAndOutfits,
  onRecombineExistingPhotos,
  onRenderGroupMvPhotoshootDirect,
  onRenderGroupMvPhotoshoot,
  onRenderMvStill,
  onClearMvStill,
  settingStillMode = 'with_members',
  onSetSettingStillMode,
  generatingSceneIdx = null,
  onRenderStoryboardScene,
  onClearStoryboardScene,
  isRegeneratingStoryboard = false,
  onRegenerateStoryboard,
  selectedImageModel = GEMINI_MODEL_IMAGE,
  onSelectImageModel,
  strictFaceLikeness = true,
  onToggleStrictFaceLikeness,
  onOpenLightbox,
  onCopy,
  onNavigateToLineup,
  onGoToStyling,
  onGoToOutfits
}) => {
  const hasExistingOutfits = (activeVisuals.memberOutfits || []).some(o => !!o.outfitImageUrl);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Flagship Group Photoshoot Card */}
      <div className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
        {/* Compact Header & Action Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900">
                Full-Body Group MV Photoshoot: "{currentTrack?.title}"
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[7px] font-mono font-black uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                16:9 Wide
              </span>
            </div>
            <p className="text-[8.5px] text-neutral-500 mt-0.5">
              Wide-angle group photo in the cool/simple environment ({activeVisuals.settingName}) with coordinated outfits.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {/* Primary Action Button */}
            <button
              onClick={() => onCompositeGroupPhotoshoot(false)}
              disabled={isGeneratingGroupPhoto}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-full text-[8.5px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              title="Generates individual full-body photos keeping exact face & hairstyle from Lineup tab, then combines them into 16:9 photoshoot"
            >
              {isGeneratingGroupPhoto ? (
                <Sparkles className="w-3.5 h-3.5 animate-spin text-white" />
              ) : (
                <Layers className="w-3.5 h-3.5 text-white" />
              )}
              <span>
                {isGeneratingGroupPhoto 
                  ? 'Compositing...' 
                  : activeVisuals.groupPhotoUrl 
                    ? 'Regen Photoshoot' 
                    : 'Combine Member Photos into 16:9 Photoshoot'}
              </span>
            </button>

            {/* Quick Secondary Actions */}
            <button
              onClick={onShuffleOutfits}
              className="bg-neutral-100 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 text-neutral-700 border border-neutral-200 px-2.5 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
              title="Shuffle outfit concepts for all members"
            >
              <Dices className="w-3 h-3 text-purple-600" />
              <span>Shuffle Fits</span>
            </button>

            <button
              onClick={onRenderGroupMvPhotoshootDirect}
              disabled={isGeneratingGroupPhoto}
              className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200 px-2.5 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
              title="Alternative single-pass AI photoshoot"
            >
              <Camera className="w-3 h-3 text-neutral-600" />
              <span>Direct AI Shot</span>
            </button>

            <button
              onClick={onGoToStyling}
              className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-2.5 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
              title="Customize Fashion Style Formula & 3-Color Harmony"
            >
              <Palette className="w-3 h-3 text-amber-600" />
              <span>Style: {activeVisuals.fashionStyle || 'Casual'}</span>
            </button>

            <button
              onClick={() => setShowDirectorGuidance(!showDirectorGuidance)}
              className={`px-2.5 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer border ${
                showDirectorGuidance || customDirectorNotes.trim().length > 0
                  ? 'bg-purple-50 text-purple-700 border-purple-300'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-neutral-200'
              }`}
              title="Custom Director Guidance"
            >
              <SlidersHorizontal className="w-3 h-3 text-purple-600" />
              <span>Notes</span>
              {customDirectorNotes.trim().length > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
              )}
            </button>

            {hasExistingOutfits && (
              <button
                onClick={onRecombineExistingPhotos}
                disabled={isGeneratingGroupPhoto}
                className="bg-neutral-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 text-neutral-700 border border-neutral-200 px-2.5 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                title="Instant canvas merge without regenerating"
              >
                <Layers className="w-3 h-3 text-indigo-600" />
                <span>Re-Combine</span>
              </button>
            )}

            {activeVisuals.groupPhotoUrl && (
              <button
                onClick={onClearGroupPhotoshoot}
                className="bg-neutral-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 text-neutral-600 border border-neutral-200 p-1.5 rounded-full transition-all cursor-pointer"
                title="Clear current photoshoot"
              >
                <Trash2 className="w-3 h-3 text-rose-500" />
              </button>
            )}
          </div>
        </div>

        {/* AI Image Generation & Facial Likeness Control Strip */}
        <div className="bg-neutral-50/90 rounded-xl p-2.5 border border-neutral-200/80 flex flex-col md:flex-row md:items-center justify-between gap-2.5 text-[8px]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono uppercase font-black tracking-wider text-neutral-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              Image Engine:
            </span>
            <div className="flex items-center gap-1 bg-neutral-200/60 p-0.5 rounded-lg">
              <span className="px-2 py-1 rounded-md font-bold bg-white text-indigo-900 shadow-xs flex items-center gap-1.5" title="Official Gemini Flash Image generation (gemini-3.1-flash-lite-image) running through secure server-side proxy.">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Gemini Flash Image (Server)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleStrictFaceLikeness?.()}
              className={`px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                strictFaceLikeness
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-neutral-100 text-neutral-500 border-neutral-200 hover:bg-neutral-200'
              }`}
              title="Locks each member's authentic eyes, nose, lips, jawline, and hairstyle strictly to their Lineup tab portrait to avoid distortion and strange faces."
            >
              <ShieldCheck className={`w-3 h-3 ${strictFaceLikeness ? 'text-emerald-600' : 'text-neutral-400'}`} />
              <span>{strictFaceLikeness ? 'Strict Face Likeness Lock: ON' : 'Face Likeness Lock: OFF'}</span>
            </button>
            <span className="text-[7.5px] font-mono text-neutral-400 hidden lg:inline">
              (Auto-fallback on quota limit)
            </span>
          </div>
        </div>

        {/* Expandable Directorial Guidance Drawer */}
        {showDirectorGuidance && (
          <div className="p-3.5 bg-gradient-to-r from-purple-50/90 via-neutral-50 to-indigo-50/90 rounded-2xl border border-purple-200 space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-purple-600" />
                <h5 className="text-[9.5px] font-black uppercase text-neutral-900">
                  Custom Directorial Guidance & Creative Tweaks
                </h5>
              </div>
              <button
                onClick={() => setShowDirectorGuidance(false)}
                className="text-neutral-400 hover:text-neutral-600 p-1 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            <p className="text-[7.5px] text-neutral-600 leading-relaxed">
              Provide creative guidance for <strong>"{currentTrack?.title}"</strong> (setting, lighting mood, camera angle, or fashion touches):
            </p>

            <textarea
              value={customDirectorNotes}
              onChange={(e) => setCustomDirectorNotes(e.target.value)}
              placeholder="e.g., Casual oversized streetwear with vintage varsity jackets, golden sunset reflections, warm 35mm film grain..."
              className="w-full text-[8.5px] p-2.5 rounded-xl border border-purple-200 bg-white text-neutral-900 focus:ring-1 focus:ring-purple-500 focus:outline-none resize-none h-16 placeholder:text-neutral-400 font-sans"
            />

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-purple-100">
              <div className="flex flex-wrap gap-1">
                {[
                  "Clean high-fashion minimalist",
                  "Casual off-duty idol look",
                  "Golden-hour cinematic flare",
                  "Urban editorial street runway"
                ].map((tag, ti) => (
                  <button
                    key={ti}
                    onClick={() => setCustomDirectorNotes(tag)}
                    className="px-2 py-0.5 rounded-full bg-white hover:bg-purple-100 text-purple-800 text-[7px] font-medium border border-purple-200 transition-colors cursor-pointer"
                  >
                    + {tag}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {customDirectorNotes && (
                  <button
                    onClick={() => setCustomDirectorNotes("")}
                    className="text-neutral-500 hover:text-neutral-700 text-[7px] font-mono underline cursor-pointer"
                  >
                    Clear Notes
                  </button>
                )}
                <button
                  onClick={onRenderGroupMvPhotoshoot}
                  disabled={isGeneratingGroupPhoto}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded-full text-[7.5px] font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Camera className="w-3 h-3" />
                  <span>Regen with Notes</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Live Composite Progress Banner */}
        {compositeProgressText && (
          <div className="p-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 rounded-xl border border-emerald-300 shadow-2xs flex items-center justify-between gap-3 animate-pulse">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
              </div>
              <div>
                <h6 className="text-[8.5px] font-black uppercase tracking-wider text-emerald-950">
                  Photoshoot Pipeline in Progress
                </h6>
                <p className="text-[8px] text-emerald-800 font-medium">
                  {compositeProgressText}
                </p>
              </div>
            </div>
            <span className="text-[7px] font-mono font-bold text-emerald-700 bg-white/90 px-2 py-0.5 rounded border border-emerald-200">
              Preserving Lineup Faces
            </span>
          </div>
        )}

        {/* 2-Column: Group Photoshoot Left | Setting & Atmosphere Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column (7 cols): 16:9 Photoshoot Frame */}
          <div className="lg:col-span-7 space-y-2.5">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-md group">
              {activeVisuals.groupPhotoUrl ? (
                <>
                  <img
                    src={activeVisuals.groupPhotoUrl}
                    alt={`Full-Body Group MV Photoshoot for ${currentTrack?.title}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="px-2 py-0.5 rounded bg-black/80 text-emerald-400 text-[6.5px] font-mono font-black uppercase border border-emerald-500/30">
                        OFFICIAL FULL-BODY MV PHOTOSHOOT • 16:9
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => onOpenLightbox({
                            url: activeVisuals.groupPhotoUrl!,
                            title: `"${currentTrack?.title}" Full-Body Group MV Photoshoot`,
                            subtitle: `${groupProfile.groupName} in ${activeVisuals.settingName}`
                          })}
                          className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors cursor-pointer"
                          title="Open Fullscreen Lightbox"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href={activeVisuals.groupPhotoUrl}
                          download={`MV-Group-${groupProfile.groupName}-${currentTrack?.title.replace(/\s+/g, '-')}.png`}
                          className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors cursor-pointer"
                          title="Download Photoshoot"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={onClearGroupPhotoshoot}
                          className="p-1.5 rounded-full bg-rose-600/60 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                          title="Clear image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/30 text-emerald-300 text-[6.5px] font-mono font-bold uppercase">
                          {activeVisuals.settingName}
                        </span>
                        <span className="text-[7px] text-neutral-300 font-mono">
                          {members.length} Members Head-to-Toe
                        </span>
                      </div>
                      <p className="text-[7.5px] text-neutral-300 line-clamp-1 italic">
                        "{activeVisuals.cinematicVibe}"
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400">
                    <Users className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <h5 className="text-[10px] font-black uppercase text-neutral-200">
                      Full-Body Group MV Photoshoot Standby
                    </h5>
                    <p className="text-[7.5px] text-neutral-400 leading-normal">
                      Presents all {members.length} members standing in {activeVisuals.settingName}, dressed in bespoke "{activeVisuals.fashionStyle || 'Casual'}" outfits.
                    </p>
                  </div>
                  <button
                    onClick={() => onCompositeGroupPhotoshoot(false)}
                    disabled={isGeneratingGroupPhoto}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-full text-[8px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isGeneratingGroupPhoto ? (
                      <Sparkles className="w-3 h-3 animate-spin" />
                    ) : (
                      <Layers className="w-3 h-3" />
                    )}
                    <span>{isGeneratingGroupPhoto ? 'Compositing...' : 'Combine Member Photos into 16:9 Photoshoot'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Photoshoot Prompt Inspector */}
            {activeVisuals.groupPhotoPrompt && (
              <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[6.5px] font-mono font-bold text-neutral-400 uppercase">
                    Photoshoot Prompt Directives
                  </span>
                  <button
                    onClick={() => onCopy(activeVisuals.groupPhotoPrompt!, 'group-photo-prompt')}
                    className="text-[7px] font-bold text-emerald-700 hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    {copiedKey === 'group-photo-prompt' ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                    <span>Copy Prompt</span>
                  </button>
                </div>
                <p className="text-[7px] text-neutral-600 font-mono line-clamp-2 leading-relaxed">
                  {activeVisuals.groupPhotoPrompt}
                </p>
              </div>
            )}
          </div>

          {/* Right Column (5 cols): Setting, Atmosphere & Style Summary */}
          <div className="lg:col-span-5 space-y-3">
            {/* Setting Box */}
            <div className="p-3.5 bg-neutral-900 text-white rounded-2xl border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[6.5px] font-black uppercase font-mono tracking-wider border border-emerald-500/30">
                  MV ENVIRONMENT
                </span>
                <span className="text-[7px] text-neutral-400 font-mono">
                  {currentTrack?.role}
                </span>
              </div>

              <h4 className="text-xs font-black uppercase tracking-wide text-white">
                {activeVisuals.settingName}
              </h4>

              <p className="text-[8.5px] text-neutral-300 leading-relaxed">
                {activeVisuals.settingDescription}
              </p>

              <div className="pt-1.5 border-t border-neutral-800 text-[7px] text-neutral-400 italic">
                "{activeVisuals.cinematicVibe}"
              </div>
            </div>

            {/* Active Style & 3-Color Card */}
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-neutral-900 font-black text-[8px] uppercase">
                  <Shirt className="w-3 h-3 text-purple-600" />
                  <span>Wardrobe & Color Harmony</span>
                </div>
                <button
                  onClick={onGoToStyling}
                  className="text-[7px] font-bold text-amber-700 hover:text-amber-800 hover:underline cursor-pointer"
                >
                  Edit Style →
                </button>
              </div>

              <div className="flex items-center justify-between gap-2 bg-white p-2 rounded-lg border border-neutral-200/80">
                <div className="min-w-0">
                  <span className="text-[6.5px] font-mono uppercase text-neutral-400 block">Fashion Style:</span>
                  <span className="text-[8.5px] font-black uppercase text-neutral-900 truncate block">
                    {activeVisuals.fashionStyle || activeVisuals.mainStyle || 'Casual'}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {normalizeColorPalette(activeVisuals.threeColorPalette).map((c, ci) => (
                    <span 
                      key={ci} 
                      className="w-4 h-4 rounded-full border border-black/10 shadow-2xs" 
                      style={{ backgroundColor: c.hex }} 
                      title={`${c.role}: ${c.name}`} 
                    />
                  ))}
                </div>
              </div>

              <p className="text-[7.5px] text-neutral-600 leading-tight">
                {activeVisuals.groupOutfitConceptSummary || `High-fashion designer stage outfits tailored specifically to "${currentTrack?.title}".`}
              </p>

              <button
                onClick={onGoToOutfits}
                className="w-full bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 py-1 rounded-lg text-[7.5px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <span>View Member Outfits & Renders ({members.length})</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Atmosphere & Lighting */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-neutral-50 rounded-xl border border-neutral-200 space-y-0.5">
                <span className="text-[6.5px] font-mono font-bold text-neutral-400 uppercase block">COLOR GRADING</span>
                <p className="text-[7px] text-neutral-700 leading-normal line-clamp-2">
                  {activeVisuals.colorGradingAndAtmosphere}
                </p>
              </div>

              <div className="p-2 bg-neutral-50 rounded-xl border border-neutral-200 space-y-0.5">
                <span className="text-[6.5px] font-mono font-bold text-neutral-400 uppercase block">CAMERA & LIGHT</span>
                <p className="text-[7px] text-neutral-700 leading-normal line-clamp-2">
                  {activeVisuals.cameraWorkAndLighting}
                </p>
              </div>
            </div>

            {/* Key Visual Motifs */}
            {activeVisuals.keyVisualMotifs && activeVisuals.keyVisualMotifs.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {activeVisuals.keyVisualMotifs.map((motif, mi) => (
                  <span
                    key={mi}
                    className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200 text-[7px] font-medium flex items-center gap-1"
                  >
                    <Sparkle className="w-2 h-2 text-emerald-600" />
                    <span>{motif}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Compact Lineup Member References Match Strip */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[7px] font-mono font-black uppercase text-neutral-500 tracking-wider">
                LINEUP MEMBER LIKENESS MATCH ({members.length} MEMBERS):
              </span>
              <span className="text-[6.5px] text-emerald-700 font-bold bg-emerald-100/80 px-1.5 py-0.2 rounded border border-emerald-200">
                Face & Hairstyle Preserved
              </span>
            </div>
            {onNavigateToLineup && (
              <button
                onClick={onNavigateToLineup}
                className="text-[7px] font-bold text-indigo-700 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>Edit Lineup Cards</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </button>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {members.map((m, idx) => {
              const photo = m.imageUrl || (m.fullBodyImages && m.fullBodyImages.length > 0 ? m.fullBodyImages[0] : null);
              const outfit = activeVisuals.memberOutfits?.find(o => 
                ((o?.memberName || (o as any)?.stageName || '').toLowerCase() === (m?.stageName || '').toLowerCase())
              ) || activeVisuals.memberOutfits?.[idx];

              return (
                <div
                  key={idx}
                  className="px-2.5 py-1.5 bg-white rounded-xl border border-neutral-200/90 flex items-center gap-2 shrink-0 shadow-2xs"
                >
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-neutral-300 bg-neutral-100 shrink-0">
                    <img
                      src={photo || `https://ui-avatars.com/api/?name=${m.stageName}`}
                      alt={m.stageName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-[8px] font-black uppercase text-neutral-900 truncate">
                        {m.stageName}
                      </span>
                      {photo && (
                        <ShieldCheck className="w-2.5 h-2.5 text-emerald-600 shrink-0" title="Likeness Active" />
                      )}
                    </div>
                    <span className="text-[6.5px] text-neutral-500 font-mono block truncate max-w-[90px]">
                      {outfit?.outfitTitle ? outfit.outfitTitle.split(' ')[0] : 'Stage Costume'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Setting Scenery Still & Storyboard Sequence */}
        <div className="pt-4 border-t border-neutral-100 space-y-4">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-neutral-800" />
              <div>
                <h5 className="text-[11px] font-black uppercase tracking-wider text-neutral-900">
                  Setting Scenery Still & Storyboard Sequence
                </h5>
                <p className="text-[8px] text-neutral-500 font-medium">
                  Member-accurate cinematic visuals featuring {groupProfile.groupName}'s real members and MV narrative
                </p>
              </div>
            </div>

            {/* Top Quick Actions */}
            <div className="flex items-center gap-2">
              {onRegenerateStoryboard && (
                <button
                  type="button"
                  onClick={onRegenerateStoryboard}
                  disabled={isRegeneratingStoryboard}
                  className="px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[7.5px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-neutral-200 transition-all cursor-pointer disabled:opacity-50"
                  title="Sync 4-scene storyboard sequence to track lyrics & real members"
                >
                  <RefreshCw className={`w-2.5 h-2.5 ${isRegeneratingStoryboard ? 'animate-spin text-emerald-600' : 'text-neutral-500'}`} />
                  <span>{isRegeneratingStoryboard ? 'Syncing Storyboard...' : 'Sync Storyboard'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Subsection 1: 16:9 Setting Scenery Landscape Frame */}
          <div className="p-3.5 bg-neutral-50/80 rounded-xl border border-neutral-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[7px] font-mono font-black uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                  16:9 WIDESCREEN MV SET
                </span>
                <span className="text-[8.5px] font-bold text-neutral-900 truncate">
                  {activeVisuals.settingName}
                </span>
              </div>

              {/* Mode Toggle & Render Button */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Mode Selector */}
                {onSetSettingStillMode && (
                  <div className="flex items-center bg-white p-0.5 rounded-full border border-neutral-200 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => onSetSettingStillMode('with_members')}
                      className={`px-2 py-0.5 rounded-full text-[7px] font-bold tracking-tight transition-all cursor-pointer ${
                        settingStillMode === 'with_members'
                          ? 'bg-neutral-900 text-white shadow-xs'
                          : 'text-neutral-500 hover:text-neutral-800'
                      }`}
                      title="Generate scene with your actual group members"
                    >
                      With Members
                    </button>
                    <button
                      type="button"
                      onClick={() => onSetSettingStillMode('scenery_only')}
                      className={`px-2 py-0.5 rounded-full text-[7px] font-bold tracking-tight transition-all cursor-pointer ${
                        settingStillMode === 'scenery_only'
                          ? 'bg-neutral-900 text-white shadow-xs'
                          : 'text-neutral-500 hover:text-neutral-800'
                      }`}
                      title="Generate empty architectural set landscape"
                    >
                      Scenery Only
                    </button>
                  </div>
                )}

                {activeVisuals.mvStillUrl && (
                  <button
                    onClick={onClearMvStill}
                    className="p-1 rounded-full bg-white hover:bg-rose-50 text-neutral-500 hover:text-rose-600 border border-neutral-200 transition-colors cursor-pointer"
                    title="Clear setting still"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={onRenderMvStill}
                  disabled={isGeneratingMvStill}
                  className="bg-neutral-900 hover:bg-neutral-800 text-white px-3 py-1 rounded-full text-[7.5px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {isGeneratingMvStill ? (
                    <Sparkles className="w-3 h-3 animate-spin text-emerald-400" />
                  ) : (
                    <Sparkles className="w-3 h-3 text-amber-400" />
                  )}
                  <span>
                    {isGeneratingMvStill 
                      ? 'Rendering 16:9 Still...' 
                      : (activeVisuals.mvStillUrl ? 'Regen Setting Still' : 'Render Setting Still')}
                  </span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-center">
              {/* 16:9 Frame Preview */}
              <div className="lg:col-span-5">
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-sm group">
                  {activeVisuals.mvStillUrl ? (
                    <>
                      <img
                        src={activeVisuals.mvStillUrl}
                        alt={`Setting still for ${activeVisuals.settingName}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <span className="px-1.5 py-0.5 rounded bg-black/80 text-emerald-400 text-[6px] font-mono font-black uppercase">
                            {settingStillMode === 'with_members' ? 'SETTING + MEMBERS' : 'SCENERY ONLY'}
                          </span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => onOpenLightbox({
                                url: activeVisuals.mvStillUrl!,
                                title: `"${currentTrack?.title}" MV Setting Still`,
                                subtitle: `${activeVisuals.settingName} (${settingStillMode === 'with_members' ? 'With Members' : 'Scenery Only'})`
                              })}
                              className="p-1 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors cursor-pointer"
                              title="Expand view"
                            >
                              <Maximize2 className="w-2.5 h-2.5" />
                            </button>
                            <a
                              href={activeVisuals.mvStillUrl}
                              download={`MV-Setting-${currentTrack?.title.replace(/\s+/g, '-')}.png`}
                              className="p-1 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors cursor-pointer"
                              title="Download"
                            >
                              <Download className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>
                        <span className="text-[7px] font-black uppercase text-white truncate">
                          {activeVisuals.settingName}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center space-y-1">
                      <Film className="w-4 h-4 text-neutral-500" />
                      <span className="text-[7.5px] font-bold text-neutral-300">
                        {settingStillMode === 'with_members' 
                          ? '16:9 Setting Frame with Real Group Members' 
                          : '16:9 Empty Scenery Landscape Frame'}
                      </span>
                      <span className="text-[6.5px] text-neutral-500 max-w-[200px] leading-tight">
                        {settingStillMode === 'with_members'
                          ? `Features ${members.length} members with Lineup likeness and track styling.`
                          : 'Architectural environment with zero human figures.'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Setting Description & Vibe */}
              <div className="lg:col-span-7 space-y-1.5 text-left text-[7.5px] text-neutral-600">
                <div>
                  <span className="font-bold text-neutral-900 uppercase">Architecture & Set: </span>
                  <span className="leading-snug">{activeVisuals.settingDescription}</span>
                </div>
                <div>
                  <span className="font-bold text-neutral-900 uppercase">Lighting & Color: </span>
                  <span className="leading-snug">{activeVisuals.colorGradingAndAtmosphere} ({activeVisuals.songColorPalette})</span>
                </div>
                <div>
                  <span className="font-bold text-neutral-900 uppercase">Cinematic Vibe: </span>
                  <span className="leading-snug">{activeVisuals.cinematicVibe}</span>
                </div>
                {activeVisuals.keyVisualMotifs && activeVisuals.keyVisualMotifs.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap pt-0.5">
                    <span className="font-bold text-neutral-900 uppercase text-[7px]">Motifs:</span>
                    {activeVisuals.keyVisualMotifs.map((motif, mi) => (
                      <span key={mi} className="px-1.5 py-0.2 bg-white text-neutral-700 rounded text-[6.5px] border border-neutral-200">
                        {motif}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Subsection 2: Storyboard Sequence (4 Member-Accurate Narrative Scenes) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Clapperboard className="w-3.5 h-3.5 text-emerald-600" />
                <h6 className="text-[9.5px] font-black uppercase tracking-wider text-neutral-900">
                  MV Storyboard Sequence (4 Iconic Shots)
                </h6>
              </div>
              <span className="text-[7px] text-neutral-500 font-mono">
                Member-Accurate Staging & 16:9 Cinematic Frames
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2.5">
              {activeVisuals.iconicSceneHighlights?.slice(0, 4).map((scene, si) => {
                const isSceneRendering = generatingSceneIdx === si;
                return (
                  <div 
                    key={si} 
                    className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-col justify-between space-y-2 hover:border-neutral-300 transition-colors text-left"
                  >
                    {/* Scene Metadata Header */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[6.5px] font-mono font-bold text-emerald-700 uppercase bg-emerald-100/70 px-1.5 py-0.5 rounded">
                          {scene.timestamp}
                        </span>
                        <span className="text-[6.5px] font-mono font-bold text-neutral-400 uppercase">
                          SCENE 0{si + 1}
                        </span>
                      </div>

                      <h6 className="text-[8px] font-black uppercase text-neutral-900 leading-tight">
                        {scene.title}
                      </h6>

                      {/* Featured Members Badges */}
                      <div className="flex items-center gap-1 flex-wrap">
                        {scene.featuredMembers && scene.featuredMembers.length > 0 ? (
                          scene.featuredMembers.map((mName, mi) => (
                            <span 
                              key={mi} 
                              className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-neutral-900 text-white text-[6px] font-black uppercase tracking-tight"
                            >
                              <UserCheck className="w-2 h-2 text-emerald-400" />
                              {mName}
                            </span>
                          ))
                        ) : (
                          <span className="px-1.5 py-0.2 rounded bg-neutral-200 text-neutral-700 text-[6px] font-bold uppercase">
                            All Members
                          </span>
                        )}
                      </div>

                      <p className="text-[7px] text-neutral-600 leading-snug line-clamp-3">
                        {scene.visualAction}
                      </p>
                    </div>

                    {/* 16:9 Visual Frame */}
                    <div className="pt-1">
                      <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-neutral-950 border border-neutral-800 group/frame">
                        {scene.imageUrl ? (
                          <>
                            <img
                              src={scene.imageUrl}
                              alt={`Scene ${si + 1}: ${scene.title}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/frame:opacity-100 transition-opacity p-1.5 flex flex-col justify-between">
                              <div className="flex justify-between items-start">
                                <span className="px-1 py-0.2 rounded bg-black/80 text-emerald-400 text-[5.5px] font-mono font-black uppercase">
                                  SCENE 0{si + 1}
                                </span>
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => onOpenLightbox({
                                      url: scene.imageUrl!,
                                      title: `Scene ${si + 1}: ${scene.title}`,
                                      subtitle: `Featured: ${scene.featuredMembers?.join(', ') || 'Group'}`
                                    })}
                                    className="p-1 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors cursor-pointer"
                                    title="Expand scene frame"
                                  >
                                    <Maximize2 className="w-2.5 h-2.5" />
                                  </button>
                                  <a
                                    href={scene.imageUrl}
                                    download={`Scene-${si + 1}-${currentTrack?.title.replace(/\s+/g, '-')}.png`}
                                    className="p-1 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors cursor-pointer"
                                    title="Download scene frame"
                                  >
                                    <Download className="w-2.5 h-2.5" />
                                  </a>
                                  {onClearStoryboardScene && (
                                    <button
                                      onClick={() => onClearStoryboardScene(si)}
                                      className="p-1 rounded-full bg-white/20 hover:bg-rose-500/80 text-white transition-colors cursor-pointer"
                                      title="Clear scene frame"
                                    >
                                      <Trash2 className="w-2.5 h-2.5" />
                                    </button>
                                  )}
                                </div>
                              </div>

                              {onRenderStoryboardScene && (
                                <button
                                  type="button"
                                  onClick={() => onRenderStoryboardScene(si)}
                                  disabled={isSceneRendering}
                                  className="w-full py-0.5 rounded bg-white/20 hover:bg-white/30 text-white text-[6px] font-black uppercase flex items-center justify-center gap-1 backdrop-blur-xs transition-colors cursor-pointer disabled:opacity-50"
                                >
                                  <Sparkles className="w-2 h-2 text-amber-400" />
                                  <span>Re-render</span>
                                </button>
                              )}
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center space-y-1">
                            {onRenderStoryboardScene ? (
                              <button
                                type="button"
                                onClick={() => onRenderStoryboardScene(si)}
                                disabled={isSceneRendering}
                                className="w-full h-full flex flex-col items-center justify-center gap-1 text-neutral-400 hover:text-white transition-colors cursor-pointer group-hover/frame:bg-white/5"
                              >
                                {isSceneRendering ? (
                                  <>
                                    <Sparkles className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                                    <span className="text-[6.5px] font-black uppercase text-emerald-400">
                                      Rendering...
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                    <span className="text-[6.5px] font-black uppercase text-neutral-300">
                                      Render Scene Frame
                                    </span>
                                  </>
                                )}
                              </button>
                            ) : (
                              <span className="text-[6.5px] text-neutral-500">Unrendered frame</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
