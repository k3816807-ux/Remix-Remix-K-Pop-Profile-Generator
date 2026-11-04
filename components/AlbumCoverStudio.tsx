import React, { useState, useEffect, useMemo } from 'react';
import type { Album, GroupProfileData } from '../types';
import { 
  COVER_ART_STYLES, 
  CURATED_VISUAL_METAPHORS, 
  getSuggestedVisualMetaphor, 
  getRandomVisualMetaphor, 
  buildAlbumCoverPrompt,
  CoverArtStyleOption
} from '../services/albumCoverHelper';
import { 
  Disc, Sparkles, Shield, Flame, FileText, Radio, Star, Globe, 
  Download, Eye, Copy, Check, RotateCcw, Dices, Layers, Box, Wand2, CheckCircle2
} from 'lucide-react';

interface AlbumCoverStudioProps {
  album: Album;
  albumIdx: number;
  groupProfile: GroupProfileData;
  isGeneratingCover: boolean;
  coverError: string | null;
  onGenerateCover: (albumIdx: number, params?: {
    styleId?: string;
    visualMetaphor?: string;
    packagingStyle?: 'vinyl' | 'jewel_case' | 'clean_print';
    customNotes?: string;
    includeLogo?: boolean;
  }) => Promise<void>;
  onOpenLightbox: (url: string) => void;
  isPlaying?: boolean;
}

const STYLE_ICONS: Record<string, React.ElementType> = {
  surreal_chrome: Sparkles,
  cyber_y2k: Disc,
  dark_fantasy: Shield,
  ethereal_biolum: Flame,
  brutalist_editorial: FileText,
  retro_synthwave: Radio,
  minimal_luxury: Star,
  cosmic_abstract: Globe
};

export const AlbumCoverStudio: React.FC<AlbumCoverStudioProps> = ({
  album,
  albumIdx,
  groupProfile,
  isGeneratingCover,
  coverError,
  onGenerateCover,
  onOpenLightbox,
  isPlaying = false
}) => {
  const [selectedStyleId, setSelectedStyleId] = useState<string>(album.coverArtStyle || 'surreal_chrome');
  const [visualMetaphor, setVisualMetaphor] = useState<string>(
    album.coverVisualMotif || getSuggestedVisualMetaphor(album.title, album.conceptSummary || '', album.titleTrack)
  );
  const [packagingStyle, setPackagingStyle] = useState<'vinyl' | 'jewel_case' | 'clean_print'>(
    album.coverPackagingStyle || 'vinyl'
  );
  const [customNotes, setCustomNotes] = useState<string>('');
  const [includeLogo, setIncludeLogo] = useState<boolean>(true);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [showPromptInspector, setShowPromptInspector] = useState<boolean>(false);

  // Sync state when album changes
  useEffect(() => {
    setSelectedStyleId(album.coverArtStyle || 'surreal_chrome');
    setVisualMetaphor(
      album.coverVisualMotif || getSuggestedVisualMetaphor(album.title, album.conceptSummary || '', album.titleTrack)
    );
    setPackagingStyle(album.coverPackagingStyle || 'vinyl');
    setCustomNotes('');
  }, [albumIdx, album.title, album.coverArtStyle, album.coverVisualMotif, album.coverPackagingStyle]);

  // Compile active prompt
  const compiledPrompt = useMemo(() => {
    return buildAlbumCoverPrompt({
      album,
      groupName: groupProfile.groupName,
      agency: groupProfile.agency,
      officialColors: groupProfile.officialColors,
      logoDescription: groupProfile.logoDescription,
      styleId: selectedStyleId,
      visualMetaphor,
      customNotes,
      packagingStyle
    });
  }, [album, groupProfile, selectedStyleId, visualMetaphor, customNotes, packagingStyle]);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(compiledPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleRollMetaphor = () => {
    const nextMetaphor = getRandomVisualMetaphor(visualMetaphor);
    setVisualMetaphor(nextMetaphor);
  };

  const handleTriggerGenerate = () => {
    onGenerateCover(albumIdx, {
      styleId: selectedStyleId,
      visualMetaphor,
      packagingStyle,
      customNotes,
      includeLogo
    });
  };

  const activeStyle = COVER_ART_STYLES.find(s => s.id === selectedStyleId) || COVER_ART_STYLES[0];
  const primaryColor = groupProfile.officialColors?.[0]?.hex || '#10b981';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Studio Header Banner */}
      <div className="p-4 bg-neutral-950 text-white rounded-2xl border border-neutral-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-[8px] font-mono font-bold tracking-widest text-neutral-400 uppercase">
              A&R CREATIVE ART DIRECTION LAB
            </span>
          </div>
          <h3 className="text-sm md:text-base font-black uppercase tracking-tight text-white">
            Bespoke Album Cover Studio • "{album.title}"
          </h3>
          <p className="text-[10px] text-neutral-400">
            Designs unique, high-concept fine-art covers with custom visual metaphors, surreal 3D sculptures, and zero generic photoshoot duplication.
          </p>
        </div>

        <button
          onClick={handleTriggerGenerate}
          disabled={isGeneratingCover}
          className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg hover:shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50 shrink-0"
        >
          {isGeneratingCover ? (
            <>
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Rendering Artwork...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-3.5 h-3.5" />
              <span>{album.albumCoverUrl ? 'Re-Mint Bespoke Cover' : 'Generate Unique Cover'}</span>
            </>
          )}
        </button>
      </div>

      {coverError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold">
          {coverError}
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 5 Cols: Live Interactive Packaging Stage */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 text-white flex flex-col items-center justify-center relative overflow-hidden shadow-xl min-h-[380px]">
            
            {/* Packaging Style Switcher Pills */}
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-full border border-white/10 mb-5 z-20">
              {[
                { id: 'vinyl', label: '12" Vinyl Sleeve', icon: Disc },
                { id: 'jewel_case', label: 'Y2K CD Jewel Case', icon: Box },
                { id: 'clean_print', label: 'Fine Art Print', icon: Layers }
              ].map(p => {
                const Icon = p.icon;
                const isActive = packagingStyle === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPackagingStyle(p.id as any)}
                    className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                      isActive ? 'bg-white text-neutral-950 shadow-xs' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-2.5 h-2.5" />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Packaging Visual Render */}
            <div className="relative group my-2">
              
              {/* Vinyl Mode */}
              {packagingStyle === 'vinyl' && (
                <div className="relative flex items-center justify-center">
                  {/* Sliding Vinyl Disc */}
                  <div 
                    className={`absolute -right-8 top-3 w-44 h-44 rounded-full bg-neutral-950 border-4 border-neutral-800 flex items-center justify-center shadow-2xl transition-transform duration-700 group-hover:translate-x-12 ${
                      isPlaying ? 'animate-spin' : ''
                    }`}
                    style={{
                      backgroundImage: 'radial-gradient(circle, #171717 30%, #09090b 70%, #000000 100%)'
                    }}
                  >
                    {/* Concentric vinyl groove rings */}
                    <div className="w-36 h-36 rounded-full border border-white/5 flex items-center justify-center">
                      <div className="w-28 h-28 rounded-full border border-white/5 flex items-center justify-center">
                        <div 
                          className="w-16 h-16 rounded-full flex flex-col items-center justify-center text-center p-1 border-2 border-white/20 shadow-inner"
                          style={{
                            background: `linear-gradient(135deg, ${primaryColor} 0%, #171717 100%)`
                          }}
                        >
                          <span className="text-[5px] font-black text-white uppercase tracking-tighter truncate max-w-full">{groupProfile.groupName}</span>
                          <div className="w-3 h-3 rounded-full bg-neutral-950 border border-white/40 my-0.5"></div>
                          <span className="text-[4.5px] font-mono text-white/80 uppercase tracking-widest">{album.type}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vinyl Cardboard Sleeve Jacket */}
                  <div 
                    onClick={() => album.albumCoverUrl && onOpenLightbox(album.albumCoverUrl)}
                    className="w-48 h-48 rounded-xl overflow-hidden bg-neutral-950 border border-white/10 shadow-2xl relative z-10 cursor-pointer flex items-center justify-center group"
                  >
                    {album.albumCoverUrl ? (
                      <img 
                        src={album.albumCoverUrl} 
                        alt={album.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div 
                        className="w-full h-full p-4 flex flex-col justify-between items-center text-center text-white"
                        style={{
                          background: `linear-gradient(135deg, ${primaryColor} 0%, #0a0a0a 85%)`
                        }}
                      >
                        <span className="text-[7px] font-mono uppercase text-white/70 tracking-widest">{album.type}</span>
                        <div className="space-y-1">
                          <h5 className="text-xs font-black uppercase leading-tight drop-shadow">{album.title}</h5>
                          <p className="text-[8px] font-mono text-emerald-300 font-bold">{groupProfile.groupName}</p>
                        </div>
                        <span className="text-[6.5px] font-mono text-white/40">OFFICIAL A&R MASTER</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[8px] font-black uppercase">
                      <Eye className="w-4 h-4 mr-1.5" /> Fullscreen 4K View
                    </div>
                  </div>
                </div>
              )}

              {/* CD Jewel Case Mode */}
              {packagingStyle === 'jewel_case' && (
                <div 
                  onClick={() => album.albumCoverUrl && onOpenLightbox(album.albumCoverUrl)}
                  className="w-52 h-48 rounded-lg overflow-hidden bg-neutral-950/80 border-2 border-white/20 shadow-2xl relative z-10 cursor-pointer flex items-stretch backdrop-blur-xs p-1"
                >
                  {/* Left Spine */}
                  <div className="w-4 bg-neutral-900 border-r border-white/10 flex items-center justify-center p-0.5">
                    <span className="text-[6px] font-mono font-bold text-neutral-400 rotate-90 uppercase whitespace-nowrap tracking-wider">
                      {album.title}
                    </span>
                  </div>

                  {/* CD Cover Window */}
                  <div className="flex-1 relative overflow-hidden rounded bg-black">
                    {album.albumCoverUrl ? (
                      <img 
                        src={album.albumCoverUrl} 
                        alt={album.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div 
                        className="w-full h-full p-4 flex flex-col justify-between items-center text-center text-white"
                        style={{
                          background: `linear-gradient(135deg, ${primaryColor} 0%, #0a0a0a 85%)`
                        }}
                      >
                        <span className="text-[7px] font-mono uppercase text-white/70 tracking-widest">{album.type}</span>
                        <h5 className="text-xs font-black uppercase leading-tight drop-shadow">{album.title}</h5>
                        <span className="text-[6.5px] font-mono text-emerald-300">{groupProfile.groupName}</span>
                      </div>
                    )}

                    {/* CD Holographic Sheen & Sticker */}
                    <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-md border border-white/40 px-2 py-0.5 rounded-full text-[6px] font-mono font-bold text-white shadow-xs">
                      HOLO-SEAL
                    </div>
                  </div>
                </div>
              )}

              {/* Clean Art Print Mode */}
              {packagingStyle === 'clean_print' && (
                <div 
                  onClick={() => album.albumCoverUrl && onOpenLightbox(album.albumCoverUrl)}
                  className="w-48 h-48 rounded-2xl overflow-hidden bg-neutral-950 border border-white/10 shadow-2xl relative z-10 cursor-pointer flex items-center justify-center group"
                >
                  {album.albumCoverUrl ? (
                    <img 
                      src={album.albumCoverUrl} 
                      alt={album.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div 
                      className="w-full h-full p-4 flex flex-col justify-between items-center text-center text-white"
                      style={{
                        background: `linear-gradient(135deg, ${primaryColor} 0%, #0a0a0a 85%)`
                      }}
                    >
                      <span className="text-[7px] font-mono uppercase text-white/70 tracking-widest">{album.type}</span>
                      <h5 className="text-xs font-black uppercase leading-tight drop-shadow">{album.title}</h5>
                      <span className="text-[6.5px] font-mono text-emerald-300 font-bold">{groupProfile.groupName}</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[8px] font-black uppercase">
                    <Eye className="w-4 h-4 mr-1.5" /> Fullscreen 4K View
                  </div>
                </div>
              )}

            </div>

            {/* Quick Actions Bar under cover */}
            <div className="flex items-center gap-2 mt-4 z-20">
              {album.albumCoverUrl && (
                <>
                  <a
                    href={album.albumCoverUrl}
                    download={`${album.title}-CoverArt.png`}
                    className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-wider flex items-center gap-1 transition-all border border-white/10"
                  >
                    <Download className="w-3 h-3 text-emerald-400" /> Save 4K Cover
                  </a>
                  <button
                    onClick={() => onOpenLightbox(album.albumCoverUrl!)}
                    className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-wider flex items-center gap-1 transition-all border border-white/10 cursor-pointer"
                  >
                    <Eye className="w-3 h-3 text-emerald-400" /> Expand
                  </button>
                </>
              )}
              <button
                onClick={() => setShowPromptInspector(!showPromptInspector)}
                className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-wider flex items-center gap-1 transition-all border border-white/10 cursor-pointer"
              >
                <FileText className="w-3 h-3 text-neutral-300" />
                <span>{showPromptInspector ? 'Hide Prompt' : 'Inspect Prompt'}</span>
              </button>
            </div>

          </div>

          {/* Prompt Inspector Panel */}
          {showPromptInspector && (
            <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white space-y-2 animate-in fade-in duration-200">
              <div className="flex justify-between items-center">
                <span className="text-[7.5px] font-mono font-bold text-emerald-400 uppercase">Compiled AI Art Direction Prompt</span>
                <button
                  onClick={handleCopyPrompt}
                  className="text-neutral-400 hover:text-white flex items-center gap-1 text-[7.5px] font-mono"
                >
                  {copiedPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedPrompt ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-[8.5px] text-neutral-300 font-mono leading-relaxed bg-black/60 p-2.5 rounded-lg max-h-36 overflow-y-auto whitespace-pre-wrap select-all">
                {compiledPrompt}
              </p>
            </div>
          )}

        </div>

        {/* Right 7 Cols: Creative Art Direction Controls */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Section 1: Curated Art Direction Styles */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[8.5px] font-mono font-bold text-neutral-500 uppercase tracking-wider">
                1. Select Conceptual Art Direction Style
              </label>
              <span className="text-[8px] font-mono text-emerald-600 font-bold">
                {COVER_ART_STYLES.length} High-Concept Archetypes
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[280px] overflow-y-auto pr-1">
              {COVER_ART_STYLES.map(style => {
                const Icon = STYLE_ICONS[style.id] || Sparkles;
                const isSelected = selectedStyleId === style.id;
                return (
                  <div
                    key={style.id}
                    onClick={() => setSelectedStyleId(style.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? 'border-neutral-950 bg-neutral-900 text-white shadow-md'
                        : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-900'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-white/20 text-emerald-400' : 'bg-neutral-100 text-neutral-700'
                        }`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <h5 className="text-[10.5px] font-black uppercase leading-tight">{style.name}</h5>
                      </div>
                      <span className={`text-[6.5px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                        isSelected ? 'bg-emerald-500 text-neutral-950' : 'bg-neutral-100 text-neutral-600'
                      }`}>
                        {style.badge}
                      </span>
                    </div>

                    <p className={`text-[8px] leading-relaxed line-clamp-2 ${
                      isSelected ? 'text-neutral-300' : 'text-neutral-500'
                    }`}>
                      {style.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Symbolic Visual Metaphor & Sculptural Centerpiece */}
          <div className="space-y-2 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
            <div className="flex justify-between items-center">
              <label className="text-[8.5px] font-mono font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                <Dices className="w-3.5 h-3.5 text-emerald-600" />
                <span>2. Symbolic Visual Metaphor & Centerpiece</span>
              </label>

              <button
                onClick={handleRollMetaphor}
                className="text-[8px] font-black uppercase tracking-wider text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-100/70 hover:bg-emerald-200/70 px-2.5 py-1 rounded-full transition-all cursor-pointer"
                title="Roll a fresh unique metaphor"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Roll Unique Concept</span>
              </button>
            </div>

            <textarea
              rows={2}
              value={visualMetaphor}
              onChange={e => setVisualMetaphor(e.target.value)}
              placeholder="e.g. A suspended liquid chrome heart blooming with glowing crystal thorns in a misty neon studio..."
              className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 text-xs text-neutral-900 font-medium focus:ring-2 focus:ring-neutral-900 focus:outline-none leading-relaxed"
            />
            
            <p className="text-[7.5px] text-neutral-500 font-mono">
              ★ Tip: A powerful visual metaphor replaces generic idol photos with iconic fine-art centerpieces (like chrome artifacts, celestial spheres, or biomechanical relics).
            </p>
          </div>

          {/* Section 3: Custom Directorial Notes & Branding */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Custom Notes */}
            <div className="space-y-1.5">
              <label className="text-[8px] font-mono font-bold text-neutral-500 uppercase tracking-wider block">
                3. Custom Directorial Notes (Optional)
              </label>
              <input
                type="text"
                value={customNotes}
                onChange={e => setCustomNotes(e.target.value)}
                placeholder="e.g. Add iridescent raindrops, gold lettering..."
                className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium focus:ring-2 focus:ring-neutral-900 focus:outline-none"
              />
            </div>

            {/* Official Branding & Palette */}
            <div className="space-y-1.5">
              <label className="text-[8px] font-mono font-bold text-neutral-500 uppercase tracking-wider block">
                4. Official Palette & Emblem
              </label>
              <div className="bg-white border border-neutral-300 rounded-xl p-2 flex items-center justify-between gap-2">
                {/* Palette chips */}
                <div className="flex items-center gap-1.5 min-w-0">
                  {(groupProfile.officialColors || []).slice(0, 3).map((c, ci) => (
                    <div key={ci} className="flex items-center gap-1" title={`${c.name} (${c.hex})`}>
                      <span className="w-3.5 h-3.5 rounded-full border border-neutral-300 shrink-0" style={{ backgroundColor: c.hex }} />
                      <span className="text-[7.5px] font-bold text-neutral-700 truncate max-w-[60px]">{c.name}</span>
                    </div>
                  ))}
                </div>

                {/* Logo toggle */}
                <label className="flex items-center gap-1 text-[7.5px] font-bold text-neutral-700 cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={includeLogo}
                    onChange={e => setIncludeLogo(e.target.checked)}
                    className="w-3 h-3 text-emerald-600 rounded"
                  />
                  <span>Stamp Logo</span>
                </label>
              </div>
            </div>

          </div>

          {/* Action Row */}
          <div className="pt-2 flex items-center justify-between border-t border-neutral-100">
            <div className="flex items-center gap-1.5 text-[8px] font-mono text-neutral-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero Group Photoshoot Overwriting • Pure Fine Art Commercial Graphic Design</span>
            </div>

            <button
              onClick={handleTriggerGenerate}
              disabled={isGeneratingCover}
              className="bg-neutral-950 hover:bg-neutral-800 text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isGeneratingCover ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  <span>Generating Cover...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Generate Album Cover Art</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
