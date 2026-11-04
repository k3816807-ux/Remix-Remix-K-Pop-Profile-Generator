import React from 'react';
import type { Track, TrackMvVisuals, AiSongColorOption } from '../../types';
import { 
  Shirt, 
  Sparkles, 
  Palette, 
  Check, 
  Dices, 
  Layers, 
  RotateCcw, 
  ArrowRight,
  SlidersHorizontal,
  Lightbulb
} from 'lucide-react';
import { 
  UNIVERSAL_KPOP_STYLES, 
  BOY_GROUP_STYLES, 
  GIRL_GROUP_STYLES,
  ALL_KPOP_FASHION_STYLES,
  KPOP_CONCEPTS,
  KPOP_STYLE_MIX_PRESETS,
  buildKpopOutfitFormula
} from '../../services/profileDataHelper';
import { getColorHex, normalizeColorPalette } from '../../services/colorHelper';

interface TrackStylingFormulaTabProps {
  currentTrack?: Track;
  activeVisuals: TrackMvVisuals;
  stylingFormulaMode: 'presets' | 'builder';
  setStylingFormulaMode: (mode: 'presets' | 'builder') => void;
  activeSecondaryStyle: string;
  activeConceptVibe: string;
  styleCategoryFilter: 'all' | 'universal' | 'boy_group' | 'girl_group';
  setStyleCategoryFilter: (filter: 'all' | 'universal' | 'boy_group' | 'girl_group') => void;
  groupGenderTarget: 'all' | 'boy_group' | 'girl_group';
  aiPalettes: AiSongColorOption[];
  isGeneratingAiPalettes: boolean;
  customDirectorNotes: string;
  setCustomDirectorNotes: (notes: string) => void;
  onApplyStyleMixPreset: (preset: any) => void;
  onSelectFashionStyle: (styleName: string) => void;
  onSelectSecondaryStyle: (secStyle: string) => void;
  onSelectConcept: (concept: string) => void;
  onCycle3ColorPalette: () => void;
  onSelect3ColorPalette: (palette: [string, string, string]) => void;
  onGenerateAiSongPalettes: () => void;
  onGoToPhotoshoot: () => void;
}

export const TrackStylingFormulaTab: React.FC<TrackStylingFormulaTabProps> = ({
  currentTrack,
  activeVisuals,
  stylingFormulaMode,
  setStylingFormulaMode,
  activeSecondaryStyle,
  activeConceptVibe,
  styleCategoryFilter,
  setStyleCategoryFilter,
  groupGenderTarget,
  aiPalettes,
  isGeneratingAiPalettes,
  customDirectorNotes,
  setCustomDirectorNotes,
  onApplyStyleMixPreset,
  onSelectFashionStyle,
  onSelectSecondaryStyle,
  onSelectConcept,
  onCycle3ColorPalette,
  onSelect3ColorPalette,
  onGenerateAiSongPalettes,
  onGoToPhotoshoot
}) => {
  const activeMainStyle = activeVisuals.fashionStyle || activeVisuals.mainStyle || 'Casual';

  return (
    <div className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-2xs space-y-5 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Shirt className="w-4 h-4 text-purple-600" />
            <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900">
              MV Styling Formula & 3-Color Harmony: "{currentTrack?.title}"
            </h4>
            <span className="px-2 py-0.5 rounded-full text-[6.5px] font-black uppercase font-mono bg-rose-50 text-rose-700 border border-rose-200">
              Zero Techwear Policy
            </span>
          </div>
          <p className="text-[8.5px] text-neutral-500 mt-0.5">
            Formulate the fashion style and coordinated 3-color scheme. Changes apply across all member outfits and the group photoshoot.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex bg-neutral-100 p-0.5 rounded-lg border border-neutral-200">
            <button
              onClick={() => setStylingFormulaMode('presets')}
              className={`px-3 py-1 rounded-md text-[7.5px] font-bold uppercase transition-all cursor-pointer ${
                stylingFormulaMode === 'presets'
                  ? 'bg-purple-700 text-white shadow-2xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              ⭐ Curated Presets
            </button>
            <button
              onClick={() => setStylingFormulaMode('builder')}
              className={`px-3 py-1 rounded-md text-[7.5px] font-bold uppercase transition-all cursor-pointer ${
                stylingFormulaMode === 'builder'
                  ? 'bg-purple-700 text-white shadow-2xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              🛠 Custom Builder
            </button>
          </div>

          <button
            onClick={onGoToPhotoshoot}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded-full text-[7.5px] font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
          >
            <span>Go to Photoshoot</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Active Formula Equation Banner */}
      <div className="p-3 bg-gradient-to-r from-purple-100/70 via-white to-indigo-100/70 rounded-xl border border-purple-200 space-y-1.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-[7.5px] font-mono font-black uppercase text-purple-900 tracking-wider">
            ACTIVE K-POP OUTFIT EQUATION:
          </span>
          <span className="text-[6.5px] font-mono text-neutral-500 uppercase bg-white px-2 py-0.5 rounded border border-purple-200">
            {activeVisuals.groupGenderTarget === 'boy_group' ? 'Boy Group' : activeVisuals.groupGenderTarget === 'girl_group' ? 'Girl Group' : 'Co-ed / Universal'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-[8.5px]">
          <div className="bg-white px-2.5 py-1 rounded-lg border border-purple-300 font-black text-purple-950 shadow-2xs flex items-center gap-1">
            <span className="text-purple-600 font-mono text-[7px]">MAIN:</span>
            <span>{activeMainStyle}</span>
          </div>
          <span className="text-purple-400 font-black">+</span>
          <div className="bg-white px-2.5 py-1 rounded-lg border border-indigo-300 font-black text-indigo-950 shadow-2xs flex items-center gap-1">
            <span className="text-indigo-600 font-mono text-[7px]">SECONDARY:</span>
            <span>{activeSecondaryStyle}</span>
          </div>
          <span className="text-purple-400 font-black">@</span>
          <div className="bg-white px-2.5 py-1 rounded-lg border border-pink-300 font-black text-pink-950 shadow-2xs flex items-center gap-1">
            <span className="text-pink-600 font-mono text-[7px]">CONCEPT:</span>
            <span>{activeConceptVibe}</span>
          </div>
          <span className="text-purple-400 font-black">→</span>
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-2.5 py-1 rounded-lg font-black shadow-2xs flex items-center gap-1">
            <span className="text-purple-200 font-mono text-[7px]">RESULT:</span>
            <span>{buildKpopOutfitFormula(activeMainStyle, activeSecondaryStyle, activeConceptVibe).resultingVibe}</span>
          </div>
        </div>
      </div>

      {/* Mode 1: Iconic Presets */}
      {stylingFormulaMode === 'presets' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[7.5px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
              CURATED K-POP FASHION STYLE MIX PRESETS (1-CLICK APPLY):
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {KPOP_STYLE_MIX_PRESETS.map((preset, pi) => {
              const isCurrentPreset = 
                (preset.mainStyle || '').toLowerCase() === (activeMainStyle || '').toLowerCase() &&
                (preset.secondaryStyle || '').toLowerCase() === (activeSecondaryStyle || '').toLowerCase();

              const presetColors = preset.recommendedColors || (preset as any).defaultPalette || [];

              return (
                <button
                  key={preset.id || pi}
                  onClick={() => onApplyStyleMixPreset(preset)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer space-y-1.5 flex flex-col justify-between ${
                    isCurrentPreset
                      ? 'bg-purple-50/90 border-purple-500 shadow-2xs ring-1 ring-purple-400'
                      : 'bg-neutral-50 hover:bg-white hover:border-neutral-300 border-neutral-200'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[8.5px] font-black uppercase text-neutral-900">
                        {preset.label || (preset as any).name}
                      </span>
                      {isCurrentPreset && (
                        <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0" />
                      )}
                    </div>
                    <div className="text-[7px] text-purple-700 font-mono font-bold">
                      {preset.mainStyle} + {preset.secondaryStyle} ({preset.concept || (preset as any).conceptVibe})
                    </div>
                    <p className="text-[7px] text-neutral-600 line-clamp-2 leading-normal">
                      {preset.vibeSummary || (preset as any).description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-neutral-200/60">
                    <div className="flex items-center gap-1">
                      {presetColors.map((c: any, ci: number) => (
                        <span 
                          key={ci} 
                          className="w-2.5 h-2.5 rounded-full border border-black/10 shadow-2xs" 
                          style={{ backgroundColor: getColorHex(c) }} 
                          title={typeof c === 'string' ? c : c?.name}
                        />
                      ))}
                    </div>
                    <span className="text-[6.5px] font-mono text-purple-700 font-bold uppercase">
                      {isCurrentPreset ? 'Active Preset' : 'Apply Preset →'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Mode 2: Step-by-Step Custom Builder */}
      {stylingFormulaMode === 'builder' && (
        <div className="space-y-4">
          {/* Step 1: Main Style */}
          <div className="space-y-2 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-purple-600 text-white font-mono text-[8px] font-black flex items-center justify-center">
                  1
                </span>
                <span className="text-[8.5px] font-black uppercase text-neutral-900">
                  Step 1: Choose Main Fashion Style ({activeMainStyle})
                </span>
              </div>

              {/* Filter Pills */}
              <div className="flex gap-1">
                {(['all', 'universal', 'boy_group', 'girl_group'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setStyleCategoryFilter(cat)}
                    className={`px-2 py-0.5 rounded-full text-[6.5px] font-bold uppercase transition-colors cursor-pointer border ${
                      styleCategoryFilter === cat
                        ? 'bg-purple-700 text-white border-purple-700 shadow-2xs'
                        : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    {cat === 'all' ? 'All Styles' : cat === 'universal' ? 'Universal' : cat === 'boy_group' ? 'Boy Group' : 'Girl Group'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5">
              {[
                ...(styleCategoryFilter === 'all' || styleCategoryFilter === 'universal' ? UNIVERSAL_KPOP_STYLES : []),
                ...(styleCategoryFilter === 'all' || styleCategoryFilter === 'boy_group' ? BOY_GROUP_STYLES : []),
                ...(styleCategoryFilter === 'all' || styleCategoryFilter === 'girl_group' ? GIRL_GROUP_STYLES : [])
              ].map((style) => {
                const isSelected = (activeMainStyle || '').toLowerCase() === (style.name || '').toLowerCase();
                return (
                  <button
                    key={style.name}
                    onClick={() => onSelectFashionStyle(style.name)}
                    className={`p-2 rounded-lg text-left transition-all cursor-pointer border space-y-0.5 ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-700 shadow-2xs'
                        : 'bg-white hover:bg-neutral-100 text-neutral-800 border-neutral-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-black uppercase truncate">
                        {style.name}
                      </span>
                      {isSelected && <Check className="w-2.5 h-2.5 text-white shrink-0" />}
                    </div>
                    <p className={`text-[6.5px] line-clamp-1 ${isSelected ? 'text-purple-100' : 'text-neutral-500'}`}>
                      {style.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Secondary Accent */}
          <div className="space-y-2 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
            <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
              <span className="w-4 h-4 rounded-full bg-indigo-600 text-white font-mono text-[8px] font-black flex items-center justify-center">
                2
              </span>
              <span className="text-[8.5px] font-black uppercase text-neutral-900">
                Step 2: Choose Secondary Contrast Accent ({activeSecondaryStyle})
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5">
              {UNIVERSAL_KPOP_STYLES.map((sec) => {
                const isSelected = (activeSecondaryStyle || '').toLowerCase() === (sec.name || '').toLowerCase();
                return (
                  <button
                    key={sec.name}
                    onClick={() => onSelectSecondaryStyle(sec.name)}
                    className={`p-2 rounded-lg text-left transition-all cursor-pointer border space-y-0.5 ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs'
                        : 'bg-white hover:bg-neutral-100 text-neutral-800 border-neutral-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-black uppercase truncate">
                        {sec.name}
                      </span>
                      {isSelected && <Check className="w-2.5 h-2.5 text-white shrink-0" />}
                    </div>
                    <p className={`text-[6.5px] line-clamp-1 ${isSelected ? 'text-indigo-100' : 'text-neutral-500'}`}>
                      {sec.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Concept Lens */}
          <div className="space-y-2 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
            <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
              <span className="w-4 h-4 rounded-full bg-pink-600 text-white font-mono text-[8px] font-black flex items-center justify-center">
                3
              </span>
              <span className="text-[8.5px] font-black uppercase text-neutral-900">
                Step 3: Choose Concept / Attitude Lens ({activeConceptVibe})
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5">
              {KPOP_CONCEPTS.map((lens) => {
                const isSelected = (activeConceptVibe || '').toLowerCase() === (lens.name || '').toLowerCase();
                return (
                  <button
                    key={lens.name}
                    onClick={() => onSelectConcept(lens.name)}
                    className={`p-2 rounded-lg text-left transition-all cursor-pointer border space-y-0.5 ${
                      isSelected
                        ? 'bg-pink-600 text-white border-pink-700 shadow-2xs'
                        : 'bg-white hover:bg-neutral-100 text-neutral-800 border-neutral-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-black uppercase truncate">
                        {lens.name}
                      </span>
                      {isSelected && <Check className="w-2.5 h-2.5 text-white shrink-0" />}
                    </div>
                    <p className={`text-[6.5px] line-clamp-1 ${isSelected ? 'text-pink-100' : 'text-neutral-500'}`}>
                      {lens.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3-Color Harmony Swatch Display & AI Song-Meaning Color Options */}
      <div className="space-y-3 pt-3 border-t border-neutral-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Palette className="w-3.5 h-3.5 text-pink-600" />
              <h5 className="text-[9.5px] font-black uppercase tracking-wider text-neutral-900">
                Coordinated 3-Color Scheme (Base + Secondary + Accent Pop)
              </h5>
            </div>
            <p className="text-[7.5px] text-neutral-500 mt-0.5">
              Strictly harmonized across all member garments to ensure zero visual clash.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onCycle3ColorPalette}
              className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200 px-2.5 py-1 rounded-full text-[7.5px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
              title="Cycle to next curated color palette"
            >
              <RotateCcw className="w-3 h-3 text-neutral-600" />
              <span>Cycle Palette</span>
            </button>

            <button
              onClick={onGenerateAiSongPalettes}
              disabled={isGeneratingAiPalettes}
              className="bg-pink-50 hover:bg-pink-100 text-pink-800 border border-pink-200 px-2.5 py-1 rounded-full text-[7.5px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
              title="AI derives 4 bespoke color schemes tailored to this track's lyrics and emotional meaning"
            >
              <Sparkles className="w-3 h-3 text-pink-600" />
              <span>{isGeneratingAiPalettes ? 'Generating...' : 'Match to Song Meaning'}</span>
            </button>
          </div>
        </div>

        {/* Active Swatches */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {normalizeColorPalette(activeVisuals.threeColorPalette).map((color, ci) => (
            <div
              key={ci}
              className="p-2.5 bg-white rounded-xl border border-neutral-200 flex items-center gap-3 shadow-2xs"
            >
              <div
                className="w-8 h-8 rounded-lg border border-black/10 shadow-inner shrink-0"
                style={{ backgroundColor: color.hex }}
              />
              <div className="min-w-0">
                <span className="text-[6.5px] font-mono font-bold text-neutral-400 uppercase block">
                  {color.role}
                </span>
                <span className="text-[8.5px] font-black uppercase text-neutral-900 block truncate">
                  {color.name}
                </span>
                <span className="text-[6.5px] text-neutral-500 font-mono block truncate">
                  {color.usage || color.hex}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* AI Song-Meaning Palettes */}
        {aiPalettes.length > 0 && (
          <div className="p-3 bg-pink-50/50 rounded-xl border border-pink-200 space-y-2">
            <span className="text-[7.5px] font-mono font-bold text-pink-800 uppercase tracking-wider block">
              AI PALETTES DERIVED FROM "{currentTrack?.title}" LYRICS & MEANING:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {aiPalettes.map((opt, oi) => {
                const paletteColors = (opt.colors || (opt as any).palette || []) as [string, string, string];
                return (
                  <button
                    key={oi}
                    onClick={() => onSelect3ColorPalette(paletteColors)}
                    className="p-2.5 bg-white hover:border-pink-400 rounded-lg border border-pink-100 text-left space-y-1 transition-all cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-black uppercase text-neutral-900 truncate">
                        {opt.title}
                      </span>
                      <div className="flex items-center gap-1">
                        {paletteColors.map((c: any, ci: number) => (
                          <span 
                            key={ci} 
                            className="w-2.5 h-2.5 rounded-full border border-black/10 shadow-2xs" 
                            style={{ backgroundColor: getColorHex(c) }} 
                            title={typeof c === 'string' ? c : c?.name}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-[6.5px] text-neutral-600 line-clamp-2">
                      {opt.rationale || (opt as any).storytellingExplanation || opt.vibe}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Directorial Guidance Notes inside Style Studio */}
      <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
        <div className="flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-purple-600" />
          <span className="text-[8.5px] font-black uppercase text-neutral-900">
            Custom Directorial Stylist Notes (Optional)
          </span>
        </div>
        <textarea
          value={customDirectorNotes}
          onChange={(e) => setCustomDirectorNotes(e.target.value)}
          placeholder="e.g. Include oversized tailored blazers, silver chrome chains, distressed denim..."
          className="w-full text-[8.5px] p-2.5 rounded-lg border border-neutral-200 bg-white text-neutral-900 focus:ring-1 focus:ring-purple-500 focus:outline-none resize-none h-14 placeholder:text-neutral-400 font-sans"
        />
      </div>

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
        <span className="text-[7px] text-neutral-500 font-mono">
          Fashion Style & Colors apply automatically to all members.
        </span>
        <button
          onClick={onGoToPhotoshoot}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
        >
          <span>Apply & Go to Group Photoshoot</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
