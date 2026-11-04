import React from 'react';
import type { Track, TrackMvVisuals, GroupProfileData } from '../../types';
import { normalizeColorPalette } from '../../services/colorHelper';
import { 
  Shirt, 
  Dices, 
  ShieldCheck, 
  Sparkles, 
  Camera, 
  Trash2, 
  Maximize2, 
  Download, 
  Check, 
  Copy, 
  Palette, 
  Scissors, 
  Sparkle, 
  ArrowRight
} from 'lucide-react';

interface TrackMemberOutfitsTabProps {
  currentTrack?: Track;
  activeVisuals: TrackMvVisuals;
  members: NonNullable<GroupProfileData['members']>;
  selectedMemberIdx: number;
  setSelectedMemberIdx: (idx: number) => void;
  generatingMemberIndex: number | null;
  copiedKey: string | null;
  activeSecondaryStyle: string;
  activeConceptVibe: string;
  onShuffleOutfits: () => void;
  onRenderMemberOutfit: (idx: number) => void;
  onClearMemberOutfit: (idx: number) => void;
  onOpenLightbox: (data: { url: string; title: string; subtitle?: string }) => void;
  onCopy: (text: string, key: string) => void;
  onGoToStyling: () => void;
  onGoToPhotoshoot: () => void;
}

export const TrackMemberOutfitsTab: React.FC<TrackMemberOutfitsTabProps> = ({
  currentTrack,
  activeVisuals,
  members,
  selectedMemberIdx,
  setSelectedMemberIdx,
  generatingMemberIndex,
  copiedKey,
  activeSecondaryStyle,
  activeConceptVibe,
  onShuffleOutfits,
  onRenderMemberOutfit,
  onClearMemberOutfit,
  onOpenLightbox,
  onCopy,
  onGoToStyling,
  onGoToPhotoshoot
}) => {
  const member = members[selectedMemberIdx];
  const outfit = activeVisuals.memberOutfits?.[selectedMemberIdx];
  const isRenderingThis = generatingMemberIndex === selectedMemberIdx;

  return (
    <div className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-2xs space-y-5 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Shirt className="w-4 h-4 text-purple-600" />
            <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900">
              Member Concept Outfits Lookbook: "{currentTrack?.title}"
            </h4>
            <span className="px-2 py-0.5 rounded-full text-[7px] font-mono font-black uppercase bg-purple-50 text-purple-800 border border-purple-200">
              {members.length} Members Styled
            </span>
          </div>
          <p className="text-[8.5px] text-neutral-500 mt-0.5">
            Specific high-fashion garments, silhouettes, color harmony, comeback hairstyles, and individual 3:4 lookbook portraits.
          </p>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={onShuffleOutfits}
            className="bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 px-3 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
            title="Generate fresh high-fashion outfit ideas for all members"
          >
            <Dices className="w-3.5 h-3.5 text-purple-600" />
            <span>Shuffle Outfit Ideas</span>
          </button>

          <button
            onClick={onGoToStyling}
            className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200 px-3 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
            title="Adjust fashion formula and color scheme"
          >
            <Palette className="w-3.5 h-3.5 text-amber-600" />
            <span>Adjust Style Formula</span>
          </button>

          <button
            onClick={onGoToPhotoshoot}
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
            title="Switch to 16:9 Full-Body Group Photoshoot"
          >
            <Camera className="w-3.5 h-3.5 text-emerald-600" />
            <span>Group Photoshoot</span>
          </button>
        </div>
      </div>

      {/* Unified Capsule Styling Banner */}
      <div className="p-3 bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 rounded-xl border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black uppercase text-purple-950 tracking-wider">
                Unified Fashion Style: {activeVisuals.fashionStyle || activeVisuals.mainStyle || 'Casual'}
              </span>
              <span className="text-[6.5px] font-mono font-bold uppercase bg-emerald-100 text-emerald-900 px-1.5 py-0.2 rounded border border-emerald-300">
                Cohesive Group Capsule
              </span>
            </div>
            <p className="text-[7.5px] text-neutral-600 font-medium mt-0.5">
              All members share this exact fashion style and harmonized 3-color distribution. Zero mismatched aesthetics.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1">
            {normalizeColorPalette(activeVisuals.threeColorPalette).map((c, ci) => (
              <span 
                key={ci} 
                className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs" 
                style={{ backgroundColor: c.hex }} 
                title={`${c.role}: ${c.name}`} 
              />
            ))}
          </div>
          <button
            onClick={onGoToStyling}
            className="text-[7px] font-bold text-purple-700 hover:underline cursor-pointer"
          >
            Change →
          </button>
        </div>
      </div>

      {/* Member Tab Bar */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {members.map((m, mIdx) => {
          const out = activeVisuals.memberOutfits?.[mIdx];
          const isSelected = mIdx === selectedMemberIdx;
          return (
            <button
              key={mIdx}
              onClick={() => setSelectedMemberIdx(mIdx)}
              className={`px-3 py-2 rounded-xl text-left transition-all shrink-0 cursor-pointer border flex items-center gap-2.5 ${
                isSelected
                  ? 'bg-purple-50 border-purple-400 text-purple-950 shadow-2xs'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-200 shrink-0 border border-neutral-300">
                <img
                  src={m.imageUrl || `https://ui-avatars.com/api/?name=${m.stageName}`}
                  alt={m.stageName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-black uppercase text-neutral-900 truncate">
                    {m.stageName}
                  </span>
                  {out?.outfitImageUrl && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Rendered" />
                  )}
                </div>
                <span className="text-[7px] text-neutral-500 truncate block max-w-[110px]">
                  {out?.outfitTitle ? out.outfitTitle.split(' ')[0] + ' ' + (out.outfitTitle.split(' ')[1] || '') : 'Tailored Fit'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Member Outfit Card for Selected Member */}
      {(!member || !outfit) ? (
        <div className="p-8 text-center text-neutral-400 text-xs font-mono">
          No outfit data available for this member. Click "Shuffle Outfit Ideas" above!
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-4 bg-neutral-50 rounded-2xl border border-neutral-200 items-start">
          {/* Left Column (8 cols): Outfit Details */}
          <div className="lg:col-span-8 space-y-3.5">
            <div className="flex items-center justify-between gap-3 border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl overflow-hidden bg-neutral-200 border-2 border-white shadow-sm shrink-0">
                  <img
                    src={member.imageUrl || `https://ui-avatars.com/api/?name=${member.stageName}`}
                    alt={member.stageName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[7px] font-mono font-black uppercase text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                      MEMBER STYLING SPEC
                    </span>
                    <span className="text-[7.5px] text-neutral-500 font-mono">
                      {member.positions?.join(', ')}
                    </span>
                  </div>
                  <h4 className="text-sm font-black uppercase text-neutral-900">
                    {member.stageName} — "{outfit.outfitTitle}"
                  </h4>
                </div>
              </div>

              <button
                onClick={() => onCopy(`${member.stageName} Outfit for "${currentTrack?.title}":\nTitle: ${outfit.outfitTitle}\nClothing: ${outfit.clothingDetails}\nHair & Makeup: ${outfit.hairAndMakeup}\nAccessories: ${outfit.keyAccessories?.join(', ')}`, `outfit-${selectedMemberIdx}`)}
                className="p-1.5 rounded-lg bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 transition-colors cursor-pointer text-[7.5px] font-bold flex items-center gap-1"
                title="Copy Member Styling Spec"
              >
                {copiedKey === `outfit-${selectedMemberIdx}` ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>Copy Fit</span>
              </button>
            </div>

            {/* Member Styling Formula & 3-Color Composition */}
            <div className="p-3 bg-gradient-to-r from-purple-50/80 via-white to-indigo-50/80 rounded-xl border border-purple-200/90 space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-neutral-900 font-black text-[8.5px] uppercase">
                  <Shirt className="w-3.5 h-3.5 text-purple-600" />
                  <span>K-pop Outfit Formula & 3-Color Harmony</span>
                </div>
                <span className="text-[6.5px] font-mono font-bold text-purple-700 bg-purple-100/80 px-1.5 py-0.5 rounded uppercase">
                  Strict Face & Hair Lock
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-[8px]">
                <div className="bg-white px-2 py-0.5 rounded-lg border border-purple-200 text-neutral-800 font-bold shadow-2xs">
                  <span className="text-purple-600 font-normal mr-1">Formula:</span>
                  {outfit.stylingFormula || `${outfit.mainStyle || outfit.fashionStyle || activeVisuals.fashionStyle || 'Preppy'} + ${outfit.secondaryStyle || activeSecondaryStyle} (${outfit.conceptVibe || activeConceptVibe})`}
                </div>
                <div className="bg-white px-2 py-0.5 rounded-lg border border-indigo-200 text-neutral-800 font-bold shadow-2xs">
                  <span className="text-indigo-600 font-normal mr-1">Palette:</span>
                  {outfit.colorPalette || activeVisuals.songColorPalette}
                </div>
              </div>
            </div>

            {/* Comeback Hair Transformation Card */}
            {outfit.hairTransformation && (
              <div className="p-3 bg-gradient-to-r from-pink-50/70 via-white to-purple-50/70 rounded-xl border border-pink-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-neutral-900 font-black text-[8.5px] uppercase">
                    <Scissors className="w-3.5 h-3.5 text-pink-600" />
                    <span>Comeback Hair Transformation: "{currentTrack?.title}" Era</span>
                  </div>
                  <span className="text-[6.5px] font-mono font-bold text-pink-700 bg-pink-100 px-1.5 py-0.5 rounded uppercase">
                    Era Visual Identity
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[8px]">
                  <div className="bg-white p-2 rounded-lg border border-pink-100">
                    <span className="text-pink-600 font-bold uppercase text-[7px] block">Style & Cut:</span>
                    <span className="font-medium text-neutral-800">{outfit.hairTransformation.styleAndCut}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-pink-100">
                    <span className="text-pink-600 font-bold uppercase text-[7px] block">Color & Highlights:</span>
                    <span className="font-medium text-neutral-800">{outfit.hairTransformation.colorAndHighlights}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-pink-100">
                    <span className="text-pink-600 font-bold uppercase text-[7px] block">Finish / Texture:</span>
                    <span className="font-medium text-neutral-800">{outfit.hairTransformation.stylingFinish}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Garments, Fabrics & Tailoring Details */}
            <div className="p-3.5 bg-white rounded-xl border border-neutral-200 space-y-1.5 shadow-2xs">
              <span className="text-[7.5px] font-mono font-bold text-purple-700 uppercase tracking-wider block">
                GARMENTS, FABRICS & STAGE TAILORING:
              </span>
              <p className="text-[9px] text-neutral-800 leading-relaxed font-medium">
                {outfit.clothingDetails}
              </p>
            </div>

            {/* Custom Graphic Art & Personality Styling Accent */}
            {(outfit.graphicDesignDetails || outfit.signaturePersonalityAccent || outfit.personalityStylingTrait) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {outfit.graphicDesignDetails && (
                  <div className="p-3 bg-gradient-to-br from-amber-50/70 via-white to-orange-50/50 rounded-xl border border-amber-200 space-y-1 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-amber-900 font-bold text-[7.5px] uppercase">
                      <Sparkle className="w-3 h-3 text-amber-600" />
                      <span>Custom Garment Art & Graphic</span>
                    </div>
                    <p className="text-[8.5px] text-neutral-800 leading-normal font-medium">
                      {outfit.graphicDesignDetails}
                    </p>
                  </div>
                )}
                {(outfit.signaturePersonalityAccent || outfit.personalityStylingTrait) && (
                  <div className="p-3 bg-gradient-to-br from-purple-50/70 via-white to-fuchsia-50/50 rounded-xl border border-purple-200 space-y-1 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-purple-900 font-bold text-[7.5px] uppercase">
                      <Sparkle className="w-3 h-3 text-purple-600" />
                      <span>Signature Persona & Accent</span>
                    </div>
                    {outfit.personalityStylingTrait && (
                      <span className="inline-block px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-bold text-[7px] mb-1">
                        {outfit.personalityStylingTrait}
                      </span>
                    )}
                    <p className="text-[8.5px] text-neutral-800 leading-normal font-medium">
                      {outfit.signaturePersonalityAccent || outfit.stagePresence}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Hair/Makeup & Color Harmony Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-2.5 bg-white rounded-xl border border-neutral-200 space-y-1">
                <span className="text-[7px] font-mono font-bold text-neutral-500 uppercase block">HAIR & MAKEUP</span>
                <p className="text-[8px] text-neutral-700 leading-normal">
                  {outfit.hairAndMakeup}
                </p>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-neutral-200 space-y-1">
                <span className="text-[7px] font-mono font-bold text-neutral-500 uppercase block">COLOR HARMONY</span>
                <p className="text-[8px] text-neutral-700 leading-normal">
                  {outfit.colorPalette}
                </p>
              </div>
            </div>

            {/* Key Signature Accessories Chips */}
            <div className="space-y-1.5">
              <span className="text-[7px] font-mono font-bold text-neutral-500 uppercase tracking-widest block">
                SIGNATURE ACCESSORIES & DETAILS:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {outfit.keyAccessories?.map((acc, ai) => (
                  <span
                    key={ai}
                    className="px-2 py-0.5 rounded-lg bg-purple-50 text-purple-900 border border-purple-200 text-[7.5px] font-bold flex items-center gap-1"
                  >
                    <Sparkle className="w-2 h-2 text-purple-600" />
                    <span>{acc}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Stage Presence / Vibe Quote */}
            {outfit.stagePresence && (
              <div className="p-2.5 bg-neutral-100 rounded-xl border border-neutral-200 text-[8px] text-neutral-600 italic">
                "{outfit.stagePresence}"
              </div>
            )}
          </div>

          {/* Right Column (4 cols): 3:4 Lookbook Render Visual Frame */}
          <div className="lg:col-span-4 space-y-3">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-md group">
              {outfit.outfitImageUrl ? (
                <>
                  <img
                    src={outfit.outfitImageUrl}
                    alt={`${member.stageName} outfit for ${currentTrack?.title}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="px-2 py-0.5 rounded bg-black/80 text-purple-300 text-[6.5px] font-mono font-black uppercase border border-purple-500/30">
                        LOOKBOOK • 3:4
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => onOpenLightbox({
                            url: outfit.outfitImageUrl!,
                            title: `${member.stageName} — "${outfit.outfitTitle}"`,
                            subtitle: `Stage outfit for "${currentTrack?.title}"`
                          })}
                          className="p-1 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors cursor-pointer"
                          title="Fullscreen Lightbox"
                        >
                          <Maximize2 className="w-3 h-3" />
                        </button>
                        <a
                          href={outfit.outfitImageUrl}
                          download={`Outfit-${member.stageName}-${currentTrack?.title.replace(/\s+/g, '-')}.png`}
                          className="p-1 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors cursor-pointer"
                          title="Download Image"
                        >
                          <Download className="w-3 h-3" />
                        </a>
                        <button
                          onClick={() => onClearMemberOutfit(selectedMemberIdx)}
                          className="p-1 rounded-full bg-rose-600/60 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                          title="Clear Lookbook Image"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <span className="text-[8px] font-black uppercase text-white truncate">
                      {member.stageName} • {outfit.outfitTitle}
                    </span>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center space-y-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400">
                    <Shirt className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8px] font-black uppercase text-neutral-200 block">
                      Individual Lookbook Render
                    </span>
                    <p className="text-[7px] text-neutral-400 max-w-[160px] mx-auto">
                      Renders {member.stageName} in full body wearing "{outfit.outfitTitle}".
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Render Button */}
            <button
              onClick={() => onRenderMemberOutfit(selectedMemberIdx)}
              disabled={isRenderingThis}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-xl text-[8px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {isRenderingThis ? (
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Camera className="w-3.5 h-3.5" />
              )}
              <span>
                {isRenderingThis 
                  ? 'Rendering Member Look...' 
                  : outfit.outfitImageUrl 
                    ? `Regen ${member.stageName}'s Look` 
                    : `Render ${member.stageName}'s Look`}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* All Members Outfit Overview Grid */}
      <div className="space-y-2 pt-2 border-t border-neutral-100">
        <span className="text-[7.5px] font-mono font-bold text-neutral-400 uppercase tracking-widest block">
          ALL {members.length} MEMBER OUTFIT SPECS:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {members.map((m, mIdx) => {
            const out = activeVisuals.memberOutfits?.[mIdx];
            const isSelected = mIdx === selectedMemberIdx;
            return (
              <div
                key={mIdx}
                onClick={() => setSelectedMemberIdx(mIdx)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer space-y-1 text-left ${
                  isSelected 
                    ? 'bg-purple-50/80 border-purple-400 shadow-2xs' 
                    : 'bg-white border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[8.5px] font-black uppercase text-neutral-900">
                      {m.stageName}
                    </span>
                    <span className="text-[6.5px] text-neutral-400 font-mono">
                      {m.positions?.[0]}
                    </span>
                  </div>
                  {out?.outfitImageUrl && (
                    <span className="text-[6px] font-mono font-bold text-emerald-700 bg-emerald-100 px-1 py-0.2 rounded">
                      RENDERED
                    </span>
                  )}
                </div>
                <span className="text-[7.5px] font-bold text-purple-700 block truncate">
                  "{out?.outfitTitle || 'Stage Outfit'}"
                </span>
                <p className="text-[7px] text-neutral-600 line-clamp-2 leading-tight">
                  {out?.clothingDetails || 'Detailed stage tailoring'}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
