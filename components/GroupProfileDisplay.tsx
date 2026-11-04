import React, { useState } from 'react';
import type { GroupProfileData, FullProfile } from '../types';
import { GroupType } from '../types';
import { SectionHeader } from './SectionHeader';
import { RecordsStudio } from './RecordsStudio';
import { regenerateOfficialColors, regenerateGreetingMotto, sanitizeKpopGreeting, isSoloArtist } from '../services/profileDataHelper';
import { RefreshCw, Sparkles } from 'lucide-react';

interface GroupProfileDisplayProps {
  groupProfile: GroupProfileData;
  groupType: GroupType;
  view: 'overview' | 'records';
  theme: string;
  onGenerateNextAlbum?: () => void;
  isComposingAlbum?: boolean;
  onUpdateProfile?: (updatedProfile: Partial<FullProfile>) => void;
  onRegenerateOverviewKeepName?: () => void;
  onNavigateToLineup?: () => void;
}

const DossierField: React.FC<{ label: string; value?: string; wide?: boolean; theme: string }> = ({ label, value, wide, theme }) => (
  <div className={`flex flex-col ${wide ? 'col-span-full' : ''} border-b border-neutral-100 pb-1`}>
    <span className={`text-[7px] font-black text-${theme}-600 uppercase tracking-[0.1em]`}>{label}</span>
    <span className="text-[10px] font-bold text-neutral-900 leading-tight">{value || 'Strategic Detail Pending'}</span>
  </div>
);

export const GroupProfileDisplay: React.FC<GroupProfileDisplayProps> = ({ 
  groupProfile,
  groupType, 
  view, 
  theme, 
  onGenerateNextAlbum, 
  isComposingAlbum,
  onUpdateProfile,
  onRegenerateOverviewKeepName,
  onNavigateToLineup
}) => {
  const isSolo = isSoloArtist(groupType || groupProfile.groupType);
  const name = groupProfile.groupName || 'IDENTITY_PENDING';
  const agency = groupProfile.agency || 'Global A&R Division';
  
  const groupLogoUrl = `https://picsum.photos/seed/${encodeURIComponent(name)}/1200/1200?blur=2`;

  const [isRegeneratingColors, setIsRegeneratingColors] = useState<boolean>(false);
  const [colorRegenError, setColorRegenError] = useState<string | null>(null);
  const [isRegeneratingGreeting, setIsRegeneratingGreeting] = useState<boolean>(false);
  const [greetingRegenError, setGreetingRegenError] = useState<string | null>(null);

  const handleRegenerateColors = async () => {
    if (!onUpdateProfile) return;
    setIsRegeneratingColors(true);
    setColorRegenError(null);
    try {
      const newColors = await regenerateOfficialColors(
        groupProfile.groupName || 'K-Pop Group',
        groupProfile.conceptDescription || 'Charismatic K-pop',
        groupType,
        groupProfile.officialColors
      );
      onUpdateProfile({
        ...groupProfile,
        officialColors: newColors
      });
    } catch (err: any) {
      console.error("Failed to regenerate colors:", err);
      setColorRegenError(err.message || "Failed to regenerate colors.");
    } finally {
      setIsRegeneratingColors(false);
    }
  };

  const handleRegenerateGreeting = async () => {
    if (!onUpdateProfile) return;
    setIsRegeneratingGreeting(true);
    setGreetingRegenError(null);
    try {
      const newGreeting = await regenerateGreetingMotto(
        groupProfile.groupName || 'K-Pop Group',
        groupProfile.conceptDescription || 'Charismatic K-pop'
      );
      onUpdateProfile({
        ...groupProfile,
        greeting: newGreeting
      });
    } catch (err: any) {
      console.error("Failed to regenerate greeting:", err);
      setGreetingRegenError(err.message || "Failed to regenerate greeting.");
    } finally {
      setIsRegeneratingGreeting(false);
    }
  };

  if (view === 'records') {
    return (
      <RecordsStudio
        groupProfile={groupProfile}
        groupType={groupType}
        theme={theme}
        onGenerateNextAlbum={onGenerateNextAlbum}
        isComposingAlbum={isComposingAlbum}
        onUpdateProfile={onUpdateProfile}
        onNavigateToLineup={onNavigateToLineup}
      />
    );
  }

  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-left-8 duration-700">
      {/* Brand Identity Hero */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        {/* Top Banner */}
        <div className="h-28 md:h-32 bg-neutral-950 relative overflow-hidden">
          <img src={groupLogoUrl} alt="Branding" className="w-full h-full object-cover opacity-20 grayscale scale-110" />
          <div className={`absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-${theme}-950/40 backdrop-blur-[2px]`}>
              <div className="mb-1 flex items-center gap-2">
                <div className="h-[1px] w-4 bg-white/20"></div>
                <p className="text-white/60 text-[7px] font-black uppercase tracking-[0.4em]">INTERNAL_FILE</p>
                <div className="h-[1px] w-4 bg-white/20"></div>
              </div>
              {/* Stylized Brand Name with Official Colors */}
              <h2 
                className="text-2xl md:text-4xl font-black uppercase tracking-tight leading-none mb-1.5 transition-all drop-shadow-md select-none"
                style={{
                  fontFamily: "'Unbounded', 'Syne', sans-serif",
                  background: groupProfile.officialColors && groupProfile.officialColors.length > 1
                    ? `linear-gradient(135deg, #FFFFFF 0%, ${groupProfile.officialColors[0].hex} 45%, ${groupProfile.officialColors[1].hex} 100%)`
                    : (groupProfile.officialColors?.[0]?.hex ? `linear-gradient(135deg, #FFFFFF 20%, ${groupProfile.officialColors[0].hex} 100%)` : '#FFFFFF'),
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: `drop-shadow(0 2px 10px ${groupProfile.officialColors?.[0]?.hex || 'rgba(255,255,255,0.4)'}66)`
                }}
              >
                {name}
              </h2>
              {groupProfile.groupNamePronunciation && (
                <p className="text-white/80 text-[9px] font-bold tracking-widest uppercase mb-2">
                  Pronounced: [{groupProfile.groupNamePronunciation}]
                </p>
              )}
              <div className="flex gap-2 items-center">
                <p className="text-white text-[7px] font-black px-3 py-1 border border-white/20 rounded-full bg-white/5 uppercase tracking-[0.2em] shadow-sm">
                  {agency}
                </p>
                {onRegenerateOverviewKeepName && (
                  <button 
                    onClick={onRegenerateOverviewKeepName}
                    className="text-white text-[7px] font-black px-3 py-1 border border-white/20 rounded-full bg-white/10 hover:bg-white/20 uppercase tracking-[0.2em] shadow-sm transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-2 h-2" /> REGENERATE OVERVIEW (KEEP NAME)
                  </button>
                )}
              </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <SectionHeader title={isSolo ? "STRATEGIC ARTIST IDENTITY DATA" : "STRATEGIC IDENTITY DATA"} />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-2 mt-2">
                {groupProfile.groupNamePronunciation && (
                  <DossierField theme={theme} label={isSolo ? "ARTIST NAME PRONUNCIATION" : "PRONUNCIATION"} value={groupProfile.groupNamePronunciation} />
                )}
                <DossierField theme={theme} label={isSolo ? "ARTIST NAME ORIGIN & ARTISTRY" : "NAME ORIGIN & MEANING"} value={groupProfile.groupNameMeaning} wide={!groupProfile.groupNamePronunciation} />
                {groupProfile.greeting ? (
                  <div className="col-span-full border-b border-neutral-100 pb-2">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className={`text-[7px] font-black text-${theme}-600 uppercase tracking-[0.1em] flex items-center gap-1`}>
                        <Sparkles size={8} /> {isSolo ? "SOLOIST SIGNATURE GREETING & STAGE GESTURE" : "SIGNATURE GREETING MOTTO & CHOREO GESTURE"}
                      </span>
                      {onUpdateProfile && (
                        <button 
                          onClick={handleRegenerateGreeting}
                          disabled={isRegeneratingGreeting}
                          className={`text-[8px] font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${isRegeneratingGreeting ? 'text-neutral-400' : `text-${theme}-600 hover:text-${theme}-800`}`}
                          title={isSolo ? "Generate new authentic solo artist greeting" : "Generate new authentic synchronized K-pop greeting"}
                        >
                          <RefreshCw size={9} className={isRegeneratingGreeting ? "animate-spin" : ""} />
                          {isRegeneratingGreeting ? 'Regenerating...' : 'Regenerate Greeting'}
                        </button>
                      )}
                    </div>
                    {greetingRegenError && <p className="text-[8px] text-red-500 font-bold mb-1">{greetingRegenError}</p>}
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="text-[11px] font-black text-neutral-900 tracking-tight">
                        "{sanitizeKpopGreeting(groupProfile.greeting.motto, groupProfile.groupName, isSolo)}"
                      </span>
                      {groupProfile.greeting.gesture && (
                        <span className="text-[8.5px] font-semibold text-neutral-500 italic">
                          {isSolo ? "Stage Gesture: " : "Hand Gesture: "}{groupProfile.greeting.gesture}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="col-span-full border-b border-neutral-100 pb-2 flex justify-between items-center">
                    <div>
                      <span className={`text-[7px] font-black text-${theme}-600 uppercase tracking-[0.1em] flex items-center gap-1`}>
                        <Sparkles size={8} /> {isSolo ? "SOLOIST SIGNATURE GREETING & STAGE GESTURE" : "SIGNATURE GREETING MOTTO & CHOREO GESTURE"}
                      </span>
                      <p className="text-[9px] text-neutral-500 italic mt-0.5">No greeting motto assigned to this profile yet.</p>
                    </div>
                    {onUpdateProfile && (
                      <button 
                        onClick={handleRegenerateGreeting}
                        disabled={isRegeneratingGreeting}
                        className={`text-[8px] font-black uppercase tracking-wider flex items-center gap-1 px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded border border-neutral-300 cursor-pointer transition-all disabled:opacity-50`}
                      >
                        <Sparkles size={9} />
                        {isRegeneratingGreeting ? 'Generating...' : (isSolo ? 'Generate Solo Greeting' : 'Generate Signature Greeting')}
                      </button>
                    )}
                  </div>
                )}
                {groupProfile.fandom?.pronunciation && (
                  <DossierField theme={theme} label="FANDOM PRONUNCIATION" value={groupProfile.fandom.pronunciation} />
                )}
                <DossierField 
                  theme={theme} 
                  label="FANDOM ALLIANCE & MEANING" 
                  value={groupProfile.fandom ? `${groupProfile.fandom.name}${groupProfile.fandom.pronunciation ? ` [${groupProfile.fandom.pronunciation}]` : ''}: ${groupProfile.fandom.nameOrigin || 'Pending'}` : undefined} 
                  wide={!groupProfile.fandom?.pronunciation} 
                />
                <DossierField theme={theme} label="FANDOM PERSONALITY" value={groupProfile.fandom?.fandomPersonality} />
                <DossierField theme={theme} label="FANDOM MOTTO" value={groupProfile.fandom?.fandomMotto} />
                <DossierField theme={theme} label="LIGHTSTICK DESIGN" value={groupProfile.fandom?.lightstickDescription} wide />
                <DossierField theme={theme} label="DEBUT TIMELINE" value={groupProfile.debutDate ? new Date(groupProfile.debutDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Classified'} />
                <DossierField theme={theme} label="PRIMARY MARKET" value={groupProfile.marketFocus} />
                <DossierField theme={theme} label="VISUAL SYMBOLISM" value={groupProfile.logoDescription} wide />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <SectionHeader title={isSolo ? "THE ARTIST PALETTE" : "THE CORPORATE PALETTE"} />
                  <button 
                    onClick={handleRegenerateColors}
                    disabled={isRegeneratingColors}
                    className={`text-[8px] font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${isRegeneratingColors ? 'text-neutral-400' : `text-${theme}-600 hover:text-${theme}-800`}`}
                    title="Generate a completely new aesthetic color palette across 16 K-pop universes"
                  >
                    <RefreshCw size={10} className={isRegeneratingColors ? "animate-spin" : ""} />
                    {isRegeneratingColors ? 'Regenerating...' : 'Randomize Palette'}
                  </button>
                </div>
                {colorRegenError && <p className="text-[8px] text-red-500 font-bold mb-1">{colorRegenError}</p>}
                
                {/* Unboxed Fluid Chromatic Spectrum & Swatches */}
                {groupProfile.officialColors?.length > 0 ? (
                  <div className="space-y-2.5 pt-1">
                    {/* Continuous fluid chromatic gradient spectrum ribbon */}
                    <div 
                      className="h-2.5 w-full rounded-full shadow-inner opacity-90 transition-all duration-700"
                      style={{
                        background: groupProfile.officialColors.length > 1
                          ? `linear-gradient(90deg, ${groupProfile.officialColors.map(c => c.hex).join(', ')})`
                          : groupProfile.officialColors[0].hex
                      }}
                    />
                    
                    {/* Unboxed floating swatches (no enclosing boxes) */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      {groupProfile.officialColors.map((color, idx) => (
                        <div key={idx} className="flex items-center gap-2 group">
                          <div 
                            className="w-4 h-4 rounded-full shadow-sm ring-2 ring-white transition-transform group-hover:scale-125" 
                            style={{ backgroundColor: color.hex }}
                          />
                          <div className="flex flex-col">
                            <span className="text-[8px] font-black text-neutral-900 tracking-wider uppercase">
                              {color.name}
                            </span>
                            <span className="text-[7px] text-neutral-400 font-mono font-bold uppercase">
                              {color.hex}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-[7px] text-neutral-300 font-black uppercase tracking-[0.2em] italic">Color protocol pending.</p>
                )}
              </div>
              
              <div className="space-y-2">
                <SectionHeader title="A&R SIMULATION SUITE" />
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-neutral-50 p-2 rounded-lg border border-neutral-100 flex flex-col justify-center">
                    <span className={`text-[6px] font-black text-${theme}-600 uppercase tracking-widest block`}>EST. DEBUT BUDGET</span>
                    <span className="text-[9px] font-bold text-neutral-900 truncate mt-0.5">{groupProfile.simulationMetrics?.estimatedDebutBudget || 'CENSORED'}</span>
                  </div>
                  <div className="bg-neutral-50 p-2 rounded-lg border border-neutral-100 flex flex-col justify-center">
                    <span className={`text-[6px] font-black text-${theme}-600 uppercase tracking-widest block`}>DEMOGRAPHIC REACH</span>
                    <span className="text-[9px] font-bold text-neutral-900 truncate mt-0.5">{groupProfile.simulationMetrics?.targetDemographicReach || 'GLO_REG'}</span>
                  </div>
                  <div className="bg-neutral-50 p-2 rounded-lg border border-neutral-100 flex flex-col justify-center">
                    <span className={`text-[6px] font-black text-${theme}-600 uppercase tracking-widest block`}>CHART TIER BIAS</span>
                    <span className="text-[9px] font-bold text-neutral-900 truncate mt-0.5">{groupProfile.simulationMetrics?.potentialChartPerformance || 'A_CLASS'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>

      {/* Visual Concepts (Physical Album Photobook Versions) */}
      {groupProfile.visualConcepts && groupProfile.visualConcepts.length > 0 && (
        <div className="bg-white p-4 md:p-6 rounded-xl border border-neutral-200 shadow-sm space-y-3">
          <SectionHeader title={isSolo ? "PHYSICAL ALBUM & PRODUCT CONCEPTS" : "PHYSICAL PRODUCT & ALBUM CONCEPTS"} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {groupProfile.visualConcepts.map((concept, idx) => (
              <div key={idx} className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 shadow-sm space-y-2 hover:border-neutral-300 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-1.5 mb-1">
                    <span className={`text-[8px] font-black bg-${theme}-100 text-${theme}-700 px-2 py-0.5 rounded-full uppercase tracking-wider`}>
                      VER_0{idx + 1}
                    </span>
                    {concept.framingType && (
                      <span className="text-[7px] font-bold text-neutral-500 uppercase">
                        {concept.framingType.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>
                  <h4 className="text-[11px] font-extrabold text-neutral-900 uppercase tracking-tight mb-2">{concept.versionName}</h4>
                  
                  {concept.imageUrl && (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden mb-2 border border-neutral-200 shadow-inner group">
                      <img 
                        src={concept.imageUrl} 
                        alt={concept.versionName} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-1 right-1 bg-black/70 backdrop-blur-xs text-white text-[6px] font-black px-1.5 py-0.5 rounded uppercase">
                        Editorial Scan
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5 pt-1 border-t border-neutral-200/50">
                    <div>
                      <span className={`text-[6px] font-black text-${theme}-600 uppercase tracking-widest block mb-0.5`}>AESTHETIC & COSTUME KEYNOTE</span>
                      <p className="text-[9px] text-neutral-700 leading-tight font-medium mt-0.5">{concept.aestheticStyling}</p>
                    </div>
                    <div>
                      <span className={`text-[6px] font-black text-${theme}-600 uppercase tracking-widest block mb-0.5`}>MAKEUP, HAIR & COLOR DIRECTIVE</span>
                      <p className="text-[9px] text-neutral-700 leading-tight font-medium mt-0.5">{concept.makeupHairInfo}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Promotional Rollout Timetable Poster */}
      {groupProfile.teaserTimeline && groupProfile.teaserTimeline.length > 0 && (
        <div className="bg-white p-4 md:p-6 rounded-xl border border-neutral-200 shadow-sm space-y-3">
          <SectionHeader title="PROMOTIONAL TIMETABLE / TEASER SCHEDULE" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {groupProfile.teaserTimeline.map((milestone, idx) => (
              <div key={idx} className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-105 hover:bg-neutral-100 transition-all flex flex-col justify-between min-h-[90px] shadow-sm">
                <div>
                  <span className={`text-[9px] font-black text-${theme}-600 tracking-wider block font-mono`}>
                    {milestone.dayCount}
                  </span>
                  <h5 className="text-[10px] font-black text-neutral-950 uppercase leading-none mt-1 break-words">
                    {milestone.eventName}
                  </h5>
                </div>
                <p className="text-[8px] text-neutral-500 font-bold leading-tight mt-1 pt-1 border-t border-neutral-200/60 leading-normal">
                  {milestone.deliverableDescription}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* The Story Central - Cinematic Narrative */}
      <div className={`bg-neutral-950 p-4 md:p-6 rounded-xl shadow-sm space-y-4 relative overflow-hidden text-white border border-white/5`}>
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <div className="flex flex-col items-center text-center space-y-1">
            <div className={`w-6 h-0.5 bg-${theme}-600 mb-1`}></div>
            <SectionHeader title={isSolo ? "WHAT THE ARTIST REPRESENTS" : "WHAT THE GROUP REPRESENTS"} />
          </div>

          <div className="relative group">
            <div className={`absolute -left-3 top-0 h-full w-0.5 bg-gradient-to-b from-${theme}-600 to-transparent`}></div>
            <h4 className="text-sm md:text-base font-black text-white leading-snug tracking-tight italic pl-3">
              "{groupProfile.conceptDescription || 'A legendary chronicle currently in production.'}"
            </h4>
          </div>
        </div>

        {groupProfile.sources && groupProfile.sources.length > 0 && (
          <div className="pt-4 border-t border-white/5 flex flex-col items-center">
            <p className="text-[7px] font-black text-white/30 uppercase tracking-[0.4em] mb-3">GROUNDING SOURCES & INSPIRATION</p>
            <div className="flex flex-wrap justify-center gap-2">
              {groupProfile.sources.slice(0, 5).map((source, i) => (
                <a key={i} href={source.uri} target="_blank" rel="noreferrer" className={`text-[7px] bg-white text-neutral-950 px-3 py-1 rounded-full font-black border border-transparent hover:bg-${theme}-600 hover:text-white transition-all shadow-sm uppercase tracking-[0.1em]`}>
                  {source.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Era Narrative Timeline */}
      <div className="bg-white p-4 md:p-6 rounded-xl border border-neutral-200 shadow-sm space-y-4">
        <SectionHeader title="PHASED ROLLOUT STRATEGY" />
        <div className="relative border-l-2 border-neutral-100 ml-2 space-y-6">
          {groupProfile.eraNarrative && groupProfile.eraNarrative.length > 0 ? groupProfile.eraNarrative.map((era, index) => (
            <div key={index} className="relative pl-6">
              <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-4 border-${theme}-500 shadow-sm`}></div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-neutral-900 uppercase tracking-widest">{era.eraTitle}</h4>
                <p className="text-[10px] text-neutral-500 font-medium leading-relaxed">{era.conceptSummary}</p>
                {era.moodOrVibe && (
                  <div className="mt-2 inline-block bg-neutral-50 px-2 py-1 rounded border border-neutral-100">
                    <span className={`text-[7px] font-black text-${theme}-600 uppercase tracking-widest block mb-0.5`}>MOOD / VIBE</span>
                    <span className="text-[9px] font-bold text-neutral-700">{era.moodOrVibe}</span>
                  </div>
                )}
              </div>
            </div>
          )) : (
            <p className="text-[10px] text-neutral-400 italic pl-6">Rollout strategy pending.</p>
          )}
        </div>
      </div>
    </div>
  );
};
