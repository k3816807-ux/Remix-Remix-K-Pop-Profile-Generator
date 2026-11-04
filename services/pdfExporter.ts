import type { FullProfile, MemberProfileData, Album, Track } from '../types';
import { isSoloArtist, detectArtistGender } from './profileDataHelper';

function cleanText(val?: any): string {
  if (val === undefined || val === null) return '';
  return String(val)
    .replace(/[*_`#]/g, '') // strip markdown formats
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1') // strip links
    .replace(/\\/g, '') // backslashes
    .trim();
}

function hexToRgb(hex?: string): string {
  if (!hex) return 'RGB(—)';
  const cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return `RGB(${r}, ${g}, ${b})`;
  } else if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return `RGB(${r}, ${g}, ${b})`;
  }
  return 'RGB(—)';
}

export function exportDossierToPdf(profile: FullProfile): void {
  try {
    const isSolo = isSoloArtist(profile.groupType);
    const cleanName = cleanText(profile.groupName || (isSolo ? 'K-Pop Solo Artist' : 'K-Pop Group'));
    const filename = `${cleanName.toLowerCase().replace(/\s+/g, '_')}_ar_dossier.html`;
    
    // Format official palette
    const officialColorsList = profile.officialColors || [];
    const gradientStops = officialColorsList.length > 1
      ? officialColorsList.map((c, i) => `${c.hex} ${(i / (officialColorsList.length - 1)) * 100}%`).join(', ')
      : officialColorsList.length === 1
        ? `${officialColorsList[0].hex}, ${officialColorsList[0].hex}`
        : '#111827, #4f46e5';

    const corporatePaletteHtml = officialColorsList.length > 0
      ? `<div style="page-break-inside:avoid; margin-bottom: 24px;">
          <!-- Corporate/Artist Harmony Gradient Spectrum -->
          <div style="margin-bottom: 12px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <span style="font-size:9.5px; font-weight:900; color:#4f46e5; text-transform:uppercase; letter-spacing:1px;">
                ${isSolo ? 'Artist Visual Harmony Spectrum' : 'Corporate Brand Harmony Spectrum'}
              </span>
              <span style="font-size:9px; font-weight:700; color:#9ca3af; text-transform:uppercase;">
                ${officialColorsList.length} Registered Official Shades
              </span>
            </div>
            <div style="height: 22px; width: 100%; border-radius: 8px; background: linear-gradient(90deg, ${gradientStops}); border: 1px solid rgba(0,0,0,0.12); box-shadow: inset 0 1px 3px rgba(0,0,0,0.12);"></div>
          </div>
          
          <!-- Corporate Palette Color Tiles Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 12px;">
            ${officialColorsList.map((c, idx) => {
              const roleTitle = idx === 0 ? 'Primary Corporate Identity' : idx === 1 ? 'Secondary Brand Accent' : idx === 2 ? 'Tertiary Visual Motif' : `Corporate Shade 0${idx + 1}`;
              const hexUpper = cleanText(c.hex).toUpperCase();
              const rgbText = hexToRgb(c.hex);
              return `
              <div style="display: flex; align-items: center; gap: 12px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
                <div style="width: 44px; height: 44px; border-radius: 8px; background-color: ${c.hex}; border: 2px solid #ffffff; box-shadow: 0 2px 5px rgba(0,0,0,0.16); flex-shrink: 0;"></div>
                <div style="flex: 1; min-width: 0;">
                  <span style="font-size: 8px; font-weight: 950; color: #4f46e5; text-transform: uppercase; letter-spacing: 0.8px; display: block; margin-bottom: 2px;">${roleTitle}</span>
                  <div style="font-size: 13px; font-weight: 900; color: #111827; text-transform: uppercase; letter-spacing: 0.3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${cleanText(c.name)}</div>
                  <div style="font-size: 10px; font-weight: 700; color: #6b7280; font-family: monospace; margin-top: 2px;">
                    <span style="color:#111827;">${hexUpper}</span> • <span>${rgbText}</span>
                  </div>
                </div>
              </div>`;
            }).join('')}
          </div>
        </div>`
      : '<p style="font-style:italic; color:#9ca3af; font-size:12px;">Corporate color palette pending assignment.</p>';

    // Format A&R simulation metrics
    const simulationMetricsHtml = profile.simulationMetrics
      ? `<div style="page-break-inside:avoid; margin-bottom: 24px;">
          <h3 style="font-size:12px; font-weight:950; color:#111827; text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid #e5e7eb; padding-bottom:6px; margin-bottom:12px;">
            5. A&R Simulation Suite & Commercial Market Projections
          </h3>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;">
            <div style="background-color:#fafafa; border:1px solid #e5e7eb; border-radius:10px; padding:14px;">
              <span style="font-size:8.5px; font-weight:950; color:#4f46e5; text-transform:uppercase; letter-spacing:1px; display:block; margin-bottom:4px;">
                Est. Debut Production Budget
              </span>
              <span style="font-size:14px; font-weight:900; color:#111827;">
                ${cleanText(profile.simulationMetrics.estimatedDebutBudget || 'Confidential')}
              </span>
            </div>
            <div style="background-color:#fafafa; border:1px solid #e5e7eb; border-radius:10px; padding:14px;">
              <span style="font-size:8.5px; font-weight:950; color:#4f46e5; text-transform:uppercase; letter-spacing:1px; display:block; margin-bottom:4px;">
                Target Demographic Reach
              </span>
              <span style="font-size:14px; font-weight:900; color:#111827;">
                ${cleanText(profile.simulationMetrics.targetDemographicReach || 'Global Audience')}
              </span>
            </div>
            <div style="background-color:#fafafa; border:1px solid #e5e7eb; border-radius:10px; padding:14px;">
              <span style="font-size:8.5px; font-weight:950; color:#4f46e5; text-transform:uppercase; letter-spacing:1px; display:block; margin-bottom:4px;">
                Potential Chart Performance Bias
              </span>
              <span style="font-size:14px; font-weight:900; color:#111827;">
                ${cleanText(profile.simulationMetrics.potentialChartPerformance || 'Tier 1 Global')}
              </span>
            </div>
          </div>
        </div>`
      : '';

    // Format overarching era narratives
    const eraNarrativesHtml = (profile.eraNarrative && profile.eraNarrative.length > 0)
      ? `<div style="page-break-inside:avoid; margin-bottom: 24px;">
          <h3 style="font-size:12px; font-weight:950; color:#111827; text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid #e5e7eb; padding-bottom:6px; margin-bottom:12px;">
            6. Overarching Multi-Era Narrative & Universe Storylines
          </h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px;">
            ${profile.eraNarrative.map((era, idx) => `
              <div style="background-color:#ffffff; border:1px solid #e5e7eb; border-radius:10px; padding:14px; box-shadow:0 1px 3px rgba(0,0,0,0.03);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                  <span style="font-size:9px; font-weight:950; color:#4f46e5; text-transform:uppercase; letter-spacing:0.8px;">
                    ERA CHAPTER 0${idx + 1}
                  </span>
                  <span style="font-size:8.5px; font-weight:800; color:#059669; background-color:#ecfdf5; padding:2px 8px; border-radius:4px; text-transform:uppercase;">
                    ${cleanText(era.moodOrVibe)}
                  </span>
                </div>
                <h4 style="font-size:13px; font-weight:900; color:#111827; text-transform:uppercase; margin:0 0 6px 0;">
                  ${cleanText(era.eraTitle)}
                </h4>
                <p style="font-size:11.5px; color:#4b5563; line-height:1.5; margin:0;">
                  ${cleanText(era.conceptSummary)}
                </p>
              </div>
            `).join('')}
          </div>
        </div>`
      : '';

    // Format promotional teaser milestones
    const teaserTimelineHtml = (profile.teaserTimeline && profile.teaserTimeline.length > 0)
      ? `<div style="page-break-inside:avoid; margin-bottom: 24px;">
          <h3 style="font-size:12px; font-weight:950; color:#111827; text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid #e5e7eb; padding-bottom:6px; margin-bottom:12px;">
            7. Debut Teaser Rollout & Promotional Milestones
          </h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
            ${profile.teaserTimeline.map(t => `
              <div style="background-color:#f9fafb; border:1px solid #e5e7eb; border-radius:8px; padding:10px 12px;">
                <span style="font-size:10px; font-weight:950; color:#dc2626; font-family:monospace; display:block; margin-bottom:2px;">
                  ${cleanText(t.dayCount)}
                </span>
                <div style="font-size:12px; font-weight:800; color:#111827; margin-bottom:2px;">
                  ${cleanText(t.eventName)}
                </div>
                <div style="font-size:10.5px; color:#6b7280; line-height:1.4;">
                  ${cleanText(t.deliverableDescription)}
                </div>
              </div>
            `).join('')}
          </div>
        </div>`
      : '';

    // Legacy backwards-compatible variable
    const colorsHtml = corporatePaletteHtml;

    // Format member roster
    const totalMembers = (profile.members || []).length;
    const membersHtml = (profile.members || [])
      .map((m: MemberProfileData, idx: number) => {
        const positionsList = Array.isArray(m.positions) ? m.positions : [];
        const talentsList = Array.isArray(m.talents) ? m.talents : [];
        const hobbiesList = Array.isArray(m.hobbies) ? m.hobbies : [];
        const roleModelsList = Array.isArray(m.roleModels) ? m.roleModels : [];
        const petPeevesList = Array.isArray(m.petPeeves) ? m.petPeeves : [];

        const stagePron = m.stageNamePronunciation ? `[Pronounced: ${cleanText(m.stageNamePronunciation)}]` : '';
        const realPron = m.realNamePronunciation ? `[Pronounced: ${cleanText(m.realNamePronunciation)}]` : '';
        const rolesRow = positionsList.length > 0
          ? `<div style="margin-bottom:8px;"><span style="font-size:10px; font-weight:900; color:#4f46e5; text-transform:uppercase; letter-spacing:1px; display:block; margin-bottom:2px;">POSITIONS</span>
             <span style="font-size:12px; font-weight:700; color:#1f2937;">${positionsList.map(cleanText).join(' • ')}</span></div>`
          : '';

        return `
        <div style="page-break-inside:avoid; border:1px solid #e5e7eb; border-radius:12px; padding:24px; margin-bottom:30px; background-color:#ffffff; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <div style="display:flex; flex-direction:row; gap:24px; flex-wrap:wrap;">
            ${m.imageUrl ? `
            <div style="flex: 0 0 160px; max-width: 160px; height: 160px; border-radius:12px; overflow:hidden; border:2px solid #f3f4f6; background-color:#f9fafb;">
              <img src="${m.imageUrl}" alt="${cleanText(m.stageName)}" style="width:100%; height:100%; object-fit:cover;" referrerPolicy="no-referrer" />
            </div>` : ''}
            <div style="flex:1; min-width:280px;">
              <div style="border-bottom:1px solid #f3f4f6; padding-bottom:12px; margin-bottom:16px;">
                <div style="font-size:11px; font-weight:900; color:#4f46e5; letter-spacing:1px; text-transform:uppercase;">${isSolo ? 'SOLO ARTIST PROFILE' : `MEMBER ${idx + 1} OF ${totalMembers}`}</div>
                <h3 style="font-size:24px; font-weight:900; color:#111827; margin:2px 0 4px 0; text-transform:uppercase; font-style:italic;">
                  ${cleanText(m.stageName)} <span style="font-size:11px; font-style:normal; font-weight:500; color:#059669; margin-left:6px; letter-spacing:0.5px;">${stagePron}</span>
                </h3>
                <p style="font-size:14px; font-weight:700; color:#4b5563; margin:0;">
                  Real Name: ${cleanText(m.fullNameRomanized)} (${cleanText(m.fullNameKorean)}) <span style="font-size:11px; font-weight:500; color:#6366f1; margin-left:6px;">${realPron}</span>
                </p>
              </div>
              
              ${rolesRow}

              <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(140px, 1fr)); gap:12px; margin-bottom:16px; background-color:#f9fafb; padding:12px; border-radius:8px;">
                <div>
                  <span style="font-size:9px; font-weight:950; color:#9ca3af; text-transform:uppercase; display:block;">GENDER</span>
                  <span style="font-size:11px; font-weight:700; color:#111827;">${cleanText(m.gender || detectArtistGender(profile.groupType, profile.conceptDescription, m.gender))}</span>
                </div>
                <div>
                  <span style="font-size:9px; font-weight:950; color:#9ca3af; text-transform:uppercase; display:block;">DATE OF BIRTH</span>
                  <span style="font-size:11px; font-weight:700; color:#111827;">${cleanText(m.dateOfBirth)}</span>
                </div>
                <div>
                  <span style="font-size:9px; font-weight:950; color:#9ca3af; text-transform:uppercase; display:block;">PLACE OF BIRTH</span>
                  <span style="font-size:11px; font-weight:700; color:#111827;">${cleanText(m.placeOfBirth)}</span>
                </div>
                <div>
                  <span style="font-size:9px; font-weight:950; color:#9ca3af; text-transform:uppercase; display:block;">HEIGHT / WEIGHT</span>
                  <span style="font-size:11px; font-weight:700; color:#111827;">${cleanText(m.heightCM)}cm / ${cleanText(m.weightKG)}kg</span>
                </div>
                <div>
                  <span style="font-size:9px; font-weight:950; color:#9ca3af; text-transform:uppercase; display:block;">BLOOD TYPE</span>
                  <span style="font-size:11px; font-weight:700; color:#111827;">${cleanText(m.bloodType)}</span>
                </div>
                <div>
                  <span style="font-size:9px; font-weight:950; color:#9ca3af; text-transform:uppercase; display:block;">MBTI</span>
                  <span style="font-size:11px; font-weight:700; color:#111827;">${cleanText(m.mbti)}</span>
                </div>
                <div>
                  <span style="font-size:9px; font-weight:950; color:#9ca3af; text-transform:uppercase; display:block;">ZODIAC SIGN</span>
                  <span style="font-size:11px; font-weight:700; color:#111827;">${cleanText(m.zodiacSign)}</span>
                </div>
                <div>
                  <span style="font-size:9px; font-weight:950; color:#9ca3af; text-transform:uppercase; display:block;">TRAINING PERIOD</span>
                  <span style="font-size:11px; font-weight:700; color:#111827;">${cleanText(m.trainingPeriod)}</span>
                </div>
                <div>
                  <span style="font-size:9px; font-weight:950; color:#9ca3af; text-transform:uppercase; display:block;">REPRESENTATIVE SYMBOLS</span>
                  <span style="font-size:11px; font-weight:700; color:#111827;">${cleanText(m.representativeEmoji)} ${cleanText(m.representativeAnimal)}</span>
                </div>
                <div>
                  <span style="font-size:9px; font-weight:950; color:#9ca3af; text-transform:uppercase; display:block;">SKIN TONE / RACE</span>
                  <span style="font-size:11px; font-weight:700; color:#111827;">${cleanText(m.skinTone || 'Not specified')} / ${cleanText(m.race || 'Not specified')}</span>
                </div>
                <div>
                  <span style="font-size:9px; font-weight:950; color:#9ca3af; text-transform:uppercase; display:block;">NATURAL HAIR</span>
                  <span style="font-size:11px; font-weight:700; color:#111827;">${cleanText(m.originalHairColor || 'Not specified')} - ${cleanText(m.originalHairType || 'Not specified')}</span>
                </div>
              </div>
            </div>
          </div>

          <div style="margin-top:16px;">
            <h4 style="font-size:12px; font-weight:900; color:#374151; border-bottom:1px solid #f3f4f6; padding-bottom:4px; margin-bottom:8px; text-transform:uppercase;">BIOGRAPHY & PROFILE</h4>
            <p style="font-size:12.5px; color:#4b5563; line-height:1.6; margin:0 0 14px 0;">${cleanText(m.bio)}</p>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:12px;">
            <div style="border:1px solid #f3f4f6; border-radius:8px; padding:12px;">
              <span style="font-size:9px; font-weight:900; color:#4f46e5; text-transform:uppercase; display:block; margin-bottom:4px;">TALENTS & SPECIALTIES</span>
              <span style="font-size:11.5px; font-weight:700; color:#374151;">${talentsList.map(cleanText).join(', ') || 'Classified'}</span>
            </div>
            <div style="border:1px solid #f3f4f6; border-radius:8px; padding:12px;">
              <span style="font-size:9px; font-weight:900; color:#4f46e5; text-transform:uppercase; display:block; margin-bottom:4px;">HOBBIES & INTERESTS</span>
              <span style="font-size:11.5px; font-weight:700; color:#374151;">${hobbiesList.map(cleanText).join(', ') || 'Classified'}</span>
            </div>
            <div style="border:1px solid #f3f4f6; border-radius:8px; padding:12px;">
              <span style="font-size:9px; font-weight:900; color:#4f46e5; text-transform:uppercase; display:block; margin-bottom:4px;">HEROES & ROLE MODELS</span>
              <span style="font-size:11.5px; font-weight:700; color:#374151;">${roleModelsList.map(cleanText).join(', ') || 'None declared'}</span>
            </div>
            <div style="border:1px solid #f3f4f6; border-radius:8px; padding:12px;">
              <span style="font-size:9px; font-weight:900; color:#4f46e5; text-transform:uppercase; display:block; margin-bottom:4px;">PET PEEVES</span>
              <span style="font-size:11.5px; font-weight:700; color:#374151;">${petPeevesList.map(cleanText).join(', ') || 'None declared'}</span>
            </div>
          </div>

          ${m.personalFashionStyle ? `
          <div style="margin-top:12px; border:1px solid #f3f4f6; border-radius:8px; padding:12px; background-color:#fafafa;">
            <span style="font-size:9px; font-weight:900; color:#10b981; text-transform:uppercase; display:block; margin-bottom:4px;">Fashion Subculture & Styling Note</span>
            <span style="font-size:11.5px; font-weight:700; color:#374151;">${cleanText(m.personalFashionStyle)}</span>
          </div>` : ''}

          ${m.fullBodyImages && m.fullBodyImages.length > 0 ? `
          <div style="margin-top:16px; border-top:2px dashed #f3f4f6; padding-top:16px; page-break-inside:avoid;">
            <h4 style="font-size:12px; font-weight:900; color:#374151; margin-bottom:12px; text-transform:uppercase;">Candid Lookbook & Portfolio</h4>
            <div style="display:flex; gap:16px;">
              ${(m.fullBodyImages as string[]).map((img, i) => `
                <div style="flex:1; border-radius:8px; overflow:hidden; border:1px solid #e5e7eb; background-color:#f9fafb;">
                   <img src="${img}" alt="${cleanText(m.stageName)} Portfolio ${i+1}" style="width:100%; height:auto; display:block;" referrerPolicy="no-referrer" />
                </div>
              `).join('')}
            </div>
          </div>
          ` : ''}
        </div>`;
      })
      .join('');

    // Format discography (albums and tracks)
    const discographyHtml = (profile.discography || [])
      .map((album: Album, albumIdx: number) => {
        const tracksHtml = (album.tracks || [])
          .map((t: Track, trackIdx: number) => {
            const meaningText = t.meaning || t.description || '';
            const meaningStr = meaningText 
              ? `<div style="margin-top:8px; background-color:#f0f3ff; border-left:4px solid #4f46e5; padding:10px 14px; border-radius:0 8px 8px 0;">
                  <span style="font-size:9px; font-weight:950; color:#4338ca; text-transform:uppercase; display:block; letter-spacing:0.8px; margin-bottom:3px;">🎵 Official Song Meaning & Narrative Concept</span>
                  <p style="font-size:12px; color:#1f2937; margin:0; line-height:1.6; font-weight:500;">${cleanText(meaningText)}</p>
                 </div>` 
              : '';

            const lyricExcerptStr = t.lyricExcerpt ? `
            <div style="margin-top:6px; border-left:3px solid #10b981; background-color:#f0fdf4; padding:8px 12px; border-radius:0 8px 8px 0;">
              <span style="font-size:8.5px; font-weight:950; color:#15803d; text-transform:uppercase; display:block; margin-bottom:2px;">Signature Catchy Lyric Hook Excerpt</span>
              <p style="font-size:11.5px; font-family:monospace; color:#166534; font-weight:700; margin:0; line-height:1.4;">${cleanText(t.lyricExcerpt)}</p>
            </div>` : '';

            const fullLyricsStr = t.fullLyrics ? `
            <div style="margin-top:8px; border-left:3px solid #8b5cf6; background-color:#f5f3ff; padding:10px 14px; border-radius:0 8px 8px 0;">
              <span style="font-size:8.5px; font-weight:950; color:#6d28d9; text-transform:uppercase; display:block; margin-bottom:4px;">Full Verse-by-Verse Official Lyrics</span>
              <pre style="font-size:11px; font-family:monospace; color:#4c1d95; font-weight:600; margin:0; white-space:pre-wrap; line-height:1.5;">${cleanText(t.fullLyrics)}</pre>
            </div>` : '';

            const soundStyleStr = t.musicStylePrompt ? `
            <div style="margin-top:6px; font-size:10.5px; color:#4b5563;">
              <span style="font-weight:700; color:#1f2937;">Sonic Production Prompt:</span> ${cleanText(t.musicStylePrompt)}
            </div>` : '';

            const rhymeDevicesStr = (t.rhymeScheme || t.figurativeDevices) ? `
            <div style="margin-top:4px; font-size:10px; color:#6b7280;">
              ${t.rhymeScheme ? `<span style="font-weight:700; color:#4b5563;">Rhyme Scheme:</span> ${cleanText(t.rhymeScheme)} ` : ''}
              ${t.figurativeDevices ? `<span style="font-weight:700; color:#4b5563;">| Figurative:</span> ${cleanText(t.figurativeDevices)}` : ''}
            </div>` : '';

            const genreStr = cleanText(t.genre || (Array.isArray(t.genres) ? t.genres[0] : 'Pop'));

            return `
            <div style="border-bottom:1px solid #f3f4f6; padding:14px 0; page-break-inside:avoid;">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
                <span style="font-size:14px; font-weight:900; color:#111827;">${trackIdx + 1}. ${cleanText(t.title)} ${t.role === 'Title Track' ? '<span style="background-color:#fef3c7; color:#d97706; padding:2px 8px; border-radius:4px; font-size:9px; font-weight:900; margin-left:6px; border:1px solid #fcd34d;">TITLE TRACK</span>' : ''}</span>
                <span style="font-family:monospace; font-size:11px; font-weight:700; color:#6b7280;">DUR: ${cleanText(t.duration)} | GENRE: ${genreStr}</span>
              </div>
              
              <div style="font-size:10px; color:#9ca3af; font-weight:700; margin-top:2px;">
                PRODUCERS: <span style="color:#4b5563;">${(Array.isArray(t.producers) ? t.producers : []).map(cleanText).join(', ') || 'In-house'}</span> | 
                LYRICISTS: <span style="color:#4b5563;">${(Array.isArray(t.lyricists) ? t.lyricists : []).map(cleanText).join(', ') || 'In-house'}</span>
              </div>
              
              ${meaningStr}
              ${lyricExcerptStr}
              ${fullLyricsStr}
              ${rhymeDevicesStr}
              ${soundStyleStr}
            </div>`;
          })
          .join('');

        return `
        <div style="page-break-inside:avoid; border:1px solid #e5e7eb; border-radius:12px; padding:24px; margin-bottom:30px; background-color:#ffffff;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:20px; border-bottom:2px solid #e5e7eb; padding-bottom:12px; margin-bottom:14px; flex-wrap:wrap;">
            <div style="flex:1; min-width:240px;">
              <div style="font-size:10px; font-weight:950; color:#059669; letter-spacing:1px; text-transform:uppercase;">RELEASE OUTLINE</div>
              <h3 style="font-size:20px; font-weight:900; color:#111827; margin:2px 0 0 0; text-transform:uppercase;">
                ${cleanText(album.title)} <span style="font-size:11px; font-weight:500; color:#9ca3af; margin-left:6px;">(${cleanText(album.type)})</span>
              </h3>
              <p style="font-size:11px; font-weight:700; color:#4b5563; margin:2px 0 0 0;">OFFICIAL SHIP DATE: ${cleanText(album.releaseDate)}</p>
            </div>
            ${album.albumCoverUrl ? `
            <div style="flex:0 0 100px; width:100px; height:100px; border-radius:8px; overflow:hidden; border:1px solid #e5e7eb; box-shadow:0 2px 6px rgba(0,0,0,0.08); background-color:#09090b;">
              <img src="${album.albumCoverUrl}" alt="${cleanText(album.title)} Cover" style="width:100%; height:100%; object-fit:cover; display:block;" referrerPolicy="no-referrer" />
            </div>` : ''}
          </div>

          <div style="margin-bottom:16px;">
            <span style="font-size:10px; font-weight:950; color:#9ca3af; text-transform:uppercase; display:block; margin-bottom:2px;">ALBUM CONCEPT DESCRIPTION</span>
            <p style="font-size:12px; color:#4b5563; line-height:1.5; margin:0;">${cleanText(album.conceptSummary)}</p>
          </div>

          ${album.mvSynopsis ? `
          <div style="margin-bottom:16px; background-color:#f9fafb; padding:12px; border-radius:8px;">
            <span style="font-size:9px; font-weight:950; color:#4f46e5; text-transform:uppercase; display:block; margin-bottom:2px;">CINEMATIC Music Video Lore & Aesthetic Overview</span>
            <p style="font-size:11.5px; color:#4b5563; line-height:1.5; margin:0;">${cleanText(album.mvSynopsis)}</p>
          </div>` : ''}

          ${album.physicalInclusions && album.physicalInclusions.length > 0 ? `
          <div style="margin-bottom:16px;">
            <span style="font-size:9px; font-weight:950; color:#9ca3af; text-transform:uppercase; display:block; margin-bottom:4px;">PHYSICAL PACKAGING INCLUSIONS</span>
            <div style="display:flex; flex-wrap:wrap; gap:8px;">
              ${album.physicalInclusions.map(inc => `<span style="background-color:#f3f4f6; color:#374151; font-size:10px; padding:3px 8px; border-radius:4px; font-weight:700; border:1px solid #e5e7eb;">${cleanText(inc)}</span>`).join('')}
            </div>
          </div>` : ''}

          <div>
            <h4 style="font-size:11px; font-weight:950; color:#111827; letter-spacing:1px; text-transform:uppercase; border-bottom:1px solid #e5e7eb; padding-bottom:4px; margin:20px 0 8px 0;">SONG TRACK LIST PREVIEW (WITH SONG MEANINGS)</h4>
            ${tracksHtml || '<p style="font-size:11px; color:#9ca3af; font-weight:700; margin:0;">No songs registered on this tape model.</p>'}
          </div>
        </div>`;
      })
      .join('');

    // Combine eras / visual concept sheets
    const brandVisualsHtml = (profile.visualConcepts || [])
      .map((c, idx) => `
      <div style="border:1px solid #e5e7eb; border-radius:8px; padding:14px; margin-bottom:12px; background-color:#ffffff;">
        <span style="font-size:9px; font-weight:950; color:#4f46e5; text-transform:uppercase; display:block; margin-bottom:2px;">VERSION ${idx + 1}: ${cleanText(c.versionName)}</span>
        <p style="font-size:12px; color:#111827; font-weight:700; margin:2px 0 4px 0;">${cleanText(c.aestheticStyling)}</p>
        <p style="font-size:11px; color:#6b7280; margin:0;"><span style="font-weight:700;">Makeup & Hair Profile:</span> ${cleanText(c.makeupHairInfo)}</p>
      </div>`)
      .join('');

    // Format Official Group Photoshoot(s) from Lineup Tab
    interface PhotoshootCard {
      title: string;
      subtitle: string;
      url: string;
      badge: string;
    }
    const photoshootCards: PhotoshootCard[] = [];

    if (profile.groupPhotoFullBodyUrl) {
      photoshootCards.push({
        title: isSolo ? 'Full-Body Solo Artist Editorial Photoshoot' : 'Full-Body Group Editorial Photoshoot',
        subtitle: isSolo ? `Coordinated full-body stage styling & silhouette for ${cleanName}` : `Coordinated full-body stage styling & spatial formation for ${cleanName}`,
        url: profile.groupPhotoFullBodyUrl,
        badge: 'HEAD-TO-TOE FULL BODY'
      });
    }

    if (profile.groupPhotoWaistUpUrl && profile.groupPhotoWaistUpUrl !== profile.groupPhotoFullBodyUrl) {
      photoshootCards.push({
        title: isSolo ? 'Upper-Body Close-Up Artist Portrait' : 'Upper-Body Close-Up Editorial Portrait',
        subtitle: isSolo ? `High-fashion beauty lighting, makeup, and styling for ${cleanName}` : `High-fashion beauty lighting, makeup, and expression harmonization for ${cleanName}`,
        url: profile.groupPhotoWaistUpUrl,
        badge: 'UPPER-BODY PORTRAIT'
      });
    }

    if (profile.groupPhotoUrl && !photoshootCards.some(c => c.url === profile.groupPhotoUrl)) {
      photoshootCards.unshift({
        title: isSolo ? 'Official Solo Artist Editorial Photoshoot' : 'Official Group Editorial Photoshoot',
        subtitle: isSolo ? `Signature A&R photoshoot for ${cleanName}` : `Signature Lineup A&R photoshoot for ${cleanName}`,
        url: profile.groupPhotoUrl,
        badge: isSolo ? 'OFFICIAL ARTIST PHOTOSHOOT' : 'OFFICIAL LINEUP PHOTOSHOOT'
      });
    }

    const memberNamesList = (profile.members || []).map(m => cleanText(m.stageName)).filter(Boolean).join(' • ');

    const photoshootHtml = photoshootCards.length > 0
      ? `<div style="display:flex; flex-direction:column; gap:24px; margin-bottom:40px; page-break-inside:avoid;">
          ${photoshootCards.map(photo => `
            <div style="border:1px solid #e5e7eb; border-radius:14px; overflow:hidden; background-color:#ffffff; box-shadow:0 2px 8px rgba(0,0,0,0.06); page-break-inside:avoid;">
              <div style="position:relative; width:100%; aspect-ratio:16/9; background-color:#09090b; overflow:hidden;">
                <img src="${photo.url}" alt="${cleanText(photo.title)}" style="width:100%; height:100%; object-fit:cover; display:block;" referrerPolicy="no-referrer" />
                <div style="position:absolute; top:12px; left:12px; background-color:rgba(17,24,39,0.85); backdrop-filter:blur(4px); color:#10b981; font-size:9.5px; font-weight:900; letter-spacing:1px; text-transform:uppercase; padding:4px 10px; border-radius:4px; border:1px solid rgba(16,185,129,0.3); font-family:monospace;">
                  ${photo.badge}
                </div>
              </div>
              <div style="padding:18px 24px; border-top:1px solid #f3f4f6;">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:4px;">
                  <span style="font-size:10px; font-weight:950; color:#4f46e5; text-transform:uppercase; letter-spacing:1px;">
                    ${isSolo ? 'OFFICIAL ARTIST STUDIO ASSET' : 'OFFICIAL LINEUP STUDIO ASSET'}
                  </span>
                  <span style="font-size:10px; font-weight:800; color:#6b7280; font-family:monospace;">
                    ${isSolo ? 'SOLOIST ACTIVE' : `${profile.members?.length || 0} MEMBERS ACTIVE`}
                  </span>
                </div>
                <h3 style="font-size:18px; font-weight:900; color:#111827; margin:0 0 6px 0; text-transform:uppercase;">
                  ${cleanText(photo.title)}
                </h3>
                <p style="font-size:12.5px; color:#4b5563; margin:0 0 12px 0; line-height:1.5;">
                  ${cleanText(photo.subtitle)}
                </p>
                ${memberNamesList ? `
                <div style="background-color:#f9fafb; border:1px solid #f3f4f6; border-radius:8px; padding:8px 14px; font-size:11px; color:#374151; font-weight:700;">
                  <span style="color:#9ca3af; text-transform:uppercase; font-size:9.5px; font-weight:900; margin-right:8px; letter-spacing:0.5px;">${isSolo ? 'ARTIST:' : 'LINEUP:'}</span> ${memberNamesList}
                </div>` : ''}
              </div>
            </div>
          `).join('')}
        </div>`
      : `<div style="border:2px dashed #e5e7eb; border-radius:12px; padding:28px 20px; text-align:center; background-color:#f9fafb; margin-bottom:40px;">
          <div style="font-size:24px; margin-bottom:6px;">📸</div>
          <span style="font-size:12px; font-weight:800; color:#9ca3af; text-transform:uppercase; letter-spacing:1px; display:block;">
            ${isSolo ? 'Official Solo Artist Photoshoot Pending Generation' : 'Official Lineup Group Photoshoot Pending Generation'}
          </span>
          <p style="font-size:11px; color:#6b7280; margin:4px 0 0 0;">
            ${isSolo ? 'Generate an official artist photoshoot in the Artist tab to display it here in full editorial glory.' : 'Generate an official group photoshoot in the Lineup tab to display it here in full editorial glory.'}
          </p>
        </div>`;

    // Format Official Fandom Goods: Lightstick & Mascot
    const lightstickImg = profile.fandom?.lightstickUrl;
    const lightstickName = cleanText(profile.fandom?.lightstickName || `${cleanName} Official Lightstick`);
    const lightstickDesc = cleanText(profile.fandom?.lightstickDescription || 'Official wireless-synced concert cheering wand featuring multi-stage LED glow synchronized to live concert audio.');

    const mascotImg = profile.fandom?.mascotUrl;
    const mascotName = cleanText(profile.fandom?.mascotName || `${cleanName} Official Mascot`);
    const mascotEmoji = cleanText(profile.fandom?.mascotEmoji || '✨');
    const mascotDesc = cleanText(profile.fandom?.mascotDescription || 'The official 3D mascot character companion representing the heart, optimism, and warmth of the group and fandom.');

    const fandomGoodsHtml = `
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(360px, 1fr)); gap:24px; margin-bottom:40px; page-break-inside:avoid;">
        <!-- Official Lightstick Card -->
        <div style="border:1px solid #e5e7eb; border-radius:14px; overflow:hidden; background-color:#ffffff; box-shadow:0 2px 6px rgba(0,0,0,0.05); display:flex; flex-direction:column; page-break-inside:avoid;">
          <div style="padding:16px 20px 14px 20px; border-bottom:1px solid #f3f4f6; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <span style="font-size:9.5px; font-weight:950; color:#4f46e5; text-transform:uppercase; letter-spacing:1px; display:block;">OFFICIAL CONCERT MERCHANDISE</span>
              <h4 style="font-size:16px; font-weight:900; color:#111827; margin:2px 0 0 0; text-transform:uppercase;">${lightstickName}</h4>
            </div>
            <span style="font-size:9px; font-weight:900; color:#059669; background-color:#ecfdf5; border:1px solid #a7f3d0; padding:4px 10px; border-radius:999px;">
              STAGE SYNCED
            </span>
          </div>

          ${lightstickImg ? `
          <div style="width:100%; aspect-ratio:4/3; max-height:300px; background-color:#09090b; overflow:hidden; display:flex; align-items:center; justify-content:center; position:relative;">
            <img src="${lightstickImg}" alt="${lightstickName}" style="width:100%; height:100%; object-fit:contain; display:block;" referrerPolicy="no-referrer" />
          </div>` : `
          <div style="width:100%; height:160px; background-color:#f9fafb; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px; color:#9ca3af; font-size:11px; font-weight:700; border-bottom:1px solid #f3f4f6;">
            <span style="font-size:24px;">🪄</span>
            <span>Lightstick 3D Render Pending Generation</span>
          </div>`}

          <div style="padding:18px 20px; flex:1; display:flex; flex-direction:column; justify-content:space-between; gap:14px;">
            <div>
              <span style="font-size:9.5px; font-weight:950; color:#6b7280; text-transform:uppercase; display:block; margin-bottom:4px; letter-spacing:0.5px;">DESIGN MOTIF & HARDWARE SPECS</span>
              <p style="font-size:12px; color:#374151; line-height:1.55; margin:0;">${lightstickDesc}</p>
            </div>
            <div style="background-color:#f9fafb; border:1px solid #f3f4f6; border-radius:8px; padding:10px 12px; font-size:10.5px; color:#4b5563;">
              <span style="font-weight:900; color:#111827; text-transform:uppercase;">Illumination:</span> Full-Spectrum LED • Bluetooth 5.3 Stage Control • Official Group Colors Glow
            </div>
          </div>
        </div>

        <!-- Official Mascot Card -->
        <div style="border:1px solid #e5e7eb; border-radius:14px; overflow:hidden; background-color:#ffffff; box-shadow:0 2px 6px rgba(0,0,0,0.05); display:flex; flex-direction:column; page-break-inside:avoid;">
          <div style="padding:16px 20px 14px 20px; border-bottom:1px solid #f3f4f6; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <span style="font-size:9.5px; font-weight:950; color:#ec4899; text-transform:uppercase; letter-spacing:1px; display:block;">OFFICIAL CHARACTER UNIVERSE</span>
              <h4 style="font-size:16px; font-weight:900; color:#111827; margin:2px 0 0 0; text-transform:uppercase;">${mascotName} ${mascotEmoji}</h4>
            </div>
            <span style="font-size:9px; font-weight:900; color:#db2777; background-color:#fdf2f8; border:1px solid #fbcfe8; padding:4px 10px; border-radius:999px;">
              3D MASCOT
            </span>
          </div>

          ${mascotImg ? `
          <div style="width:100%; aspect-ratio:4/3; max-height:300px; background-color:#faf5ff; overflow:hidden; display:flex; align-items:center; justify-content:center; position:relative;">
            <img src="${mascotImg}" alt="${mascotName}" style="width:100%; height:100%; object-fit:contain; display:block;" referrerPolicy="no-referrer" />
          </div>` : `
          <div style="width:100%; height:160px; background-color:#f9fafb; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px; color:#9ca3af; font-size:11px; font-weight:700; border-bottom:1px solid #f3f4f6;">
            <span style="font-size:24px;">🧸</span>
            <span>Mascot 3D Artwork Pending Generation</span>
          </div>`}

          <div style="padding:18px 20px; flex:1; display:flex; flex-direction:column; justify-content:space-between; gap:14px;">
            <div>
              <span style="font-size:9.5px; font-weight:950; color:#6b7280; text-transform:uppercase; display:block; margin-bottom:4px; letter-spacing:0.5px;">CHARACTER LORE & COMPANION BACKSTORY</span>
              <p style="font-size:12px; color:#374151; line-height:1.55; margin:0;">${mascotDesc}</p>
            </div>
            ${(profile.members || []).some(m => m.representativeEmoji || m.representativeAnimal) ? `
            <div style="background-color:#fdf4ff; border:1px solid #fae8ff; border-radius:8px; padding:10px 12px; font-size:10.5px; color:#86198f;">
              <span style="font-weight:900; text-transform:uppercase; display:block; margin-bottom:4px; font-size:9.5px;">Member Animal Avatars:</span>
              ${(profile.members || []).map(m => `<span style="display:inline-block; margin-right:10px; margin-bottom:2px; font-weight:700;">${cleanText(m.representativeEmoji || '🐾')} ${cleanText(m.stageName)} (${cleanText(m.representativeAnimal || 'Kitten')})</span>`).join('')}
            </div>` : ''}
          </div>
        </div>
      </div>
    `;

    const fullHtmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>A&R STRATEGIC BRAND DOSSIER - ${cleanName.toUpperCase()}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background-color: #ffffff;
      color: #111827;
      margin: 0;
      padding: 0;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 40px;
    }
    header {
      border-bottom: 3px solid #111827;
      padding-bottom: 20px;
      margin-bottom: 40px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    h1 {
      font-size: 32px;
      font-weight: 950;
      text-transform: uppercase;
      font-style: italic;
      letter-spacing: -1px;
      margin: 0 0 4px 0;
    }
    h2 {
      font-size: 18px;
      font-weight: 900;
      text-transform: uppercase;
      border-bottom: 2px solid #111827;
      padding-bottom: 6px;
      margin-top: 40px;
      margin-bottom: 20px;
      letter-spacing: 0.5px;
      color: #111827;
      page-break-after: avoid;
    }
    .grid-props {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px 24px;
      margin-bottom: 30px;
    }
    .prop-item {
      border-bottom: 1px solid #f3f4f6;
      padding-bottom: 8px;
    }
    .prop-label {
      font-size: 10px;
      font-weight: 950;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      display: block;
      margin-bottom: 2px;
    }
    .prop-value {
      font-size: 13.5px;
      font-weight: 750;
      color: #111827;
    }
    .floating-print-bar {
      background-color: #111827;
      color: #ffffff;
      padding: 12px 24px;
      position: sticky;
      top: 0;
      z-index: 9999;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .btn {
      background-color: #4f46e5;
      color: #ffffff;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .btn:hover {
      background-color: #4338ca;
    }
    @media print {
      .floating-print-bar {
        display: none !important;
      }
      body {
        padding: 0;
        background-color: #ffffff;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .container {
        padding: 0;
        max-width: 100%;
      }
      a {
        text-decoration: none;
        color: #111827;
      }
      img {
        page-break-inside: avoid !important;
      }
    }
  </style>
</head>
<body>
  <div class="floating-print-bar">
    <div style="font-size:11px; font-weight:800; letter-spacing:1px; text-transform:uppercase;">
      📝 Print / Save PDF Mode (White Background, Clean layout, Complete Song Meanings Included)
    </div>
    <button class="btn" onclick="window.print()">Print / Save as PDF</button>
  </div>

  <div class="container">
    <header>
      <div style="display: flex; align-items: center; gap: 16px;">
        ${profile.logoUrl ? `
        <div style="flex: 0 0 68px; width: 68px; height: 68px; border-radius: 12px; overflow: hidden; border: 2px solid #111827; background-color: #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <img src="${profile.logoUrl}" alt="${cleanName} Logo" style="width: 100%; height: 100%; object-fit: contain;" referrerPolicy="no-referrer" />
        </div>` : ''}
        <div>
          <span style="font-size: 10px; font-weight: 950; color: #4f46e5; letter-spacing: 2px; text-transform: uppercase;">A&R STRATEGIC BRAND DOSSIER</span>
          <h1>${cleanName}</h1>
          <p style="font-size: 14px; font-weight: 700; color: #4b5563; margin: 0;">Fandom Alliance: ${cleanText(profile.fandom?.name || 'Classified')}${profile.fandom?.pronunciation ? ` [${cleanText(profile.fandom.pronunciation)}]` : ''}${profile.fandom?.nameOrigin ? ` — ${cleanText(profile.fandom.nameOrigin)}` : ''}</p>
        </div>
      </div>
      <div style="text-align: right;">
        <span style="font-size: 10px; font-weight: 950; color: #9ca3af; letter-spacing: 1px; display:block;">ESTABLISHED PRODUCER</span>
        <span style="font-size: 15px; font-weight: 900; color: #111827; text-transform: uppercase;">${cleanText(profile.agency || 'Elite Label')}</span>
      </div>
    </header>

    <h2>Section I: ${isSolo ? 'Strategic Artist Identity Data & Brand Blueprint' : 'Strategic Identity Data & Corporate Brand Blueprint'}</h2>
    
    <!-- 1. Corporate/Artist Nomenclature & Executive Profile -->
    <div style="margin-bottom: 24px;">
      <h3 style="font-size:12px; font-weight:950; color:#111827; text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid #e5e7eb; padding-bottom:6px; margin-bottom:14px;">
        1. ${isSolo ? 'Artist Nomenclature & Executive Profile' : 'Corporate Nomenclature & Executive Profile'}
      </h3>
      <div class="grid-props">
        <div class="prop-item">
          <span class="prop-label">${isSolo ? 'Official Artist Name' : 'Official Group Name'}</span>
          <span class="prop-value" style="font-size:15px; font-weight:900; color:#111827;">
            ${cleanName} ${profile.groupNamePronunciation ? `<span style="font-size:11px; font-weight:600; color:#4f46e5;">[${cleanText(profile.groupNamePronunciation)}]</span>` : ''}
          </span>
        </div>
        <div class="prop-item">
          <span class="prop-label">Corporate Label / Agency</span>
          <span class="prop-value">${cleanText(profile.agency || 'Global A&R Division')}</span>
        </div>
        <div class="prop-item">
          <span class="prop-label">${isSolo ? 'Industry Division / Artist Type' : 'Industry Division / Group Type'}</span>
          <span class="prop-value">${cleanText(profile.groupType || (isSolo ? 'Solo Artist' : 'K-Pop Unit'))} • ${isSolo ? '1 Active Soloist' : `${(profile.members || []).length} Active Idols`}</span>
        </div>
        <div class="prop-item">
          <span class="prop-label">Official Debut Timeline</span>
          <span class="prop-value">${cleanText(profile.debutDate)}</span>
        </div>
        <div class="prop-item">
          <span class="prop-label">Primary Global Market Focus</span>
          <span class="prop-value">${cleanText(profile.marketFocus)}</span>
        </div>
        <div class="prop-item">
          <span class="prop-label">Signature Greeting & Physical Gesture</span>
          <span class="prop-value" style="font-weight:600; font-size:12px; color:#1f2937;">
            ${profile.greeting ? `"${cleanText(profile.greeting.motto)}" <br/><span style="font-size:10.5px; color:#6b7280; font-weight:500;">(Official Gesture: ${cleanText(profile.greeting.gesture)})</span>` : 'Classified'}
          </span>
        </div>
        <div class="prop-item" style="grid-column: span 2;">
          <span class="prop-label">${isSolo ? 'Artist Name Etymology & Core Meaning' : 'Group Name Etymology & Core Meaning'}</span>
          <span class="prop-value" style="font-weight: 500; font-size:13px; line-height:1.6; color:#374151;">${cleanText(profile.groupNameMeaning)}</span>
        </div>
      </div>
    </div>

    <!-- 2. Artistic Silhouette & Musical Sonic Direction -->
    <div style="margin-bottom: 24px;">
      <h3 style="font-size:12px; font-weight:950; color:#111827; text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid #e5e7eb; padding-bottom:6px; margin-bottom:14px;">
        2. Artistic Silhouette & Musical Sonic Direction
      </h3>
      <div class="grid-props">
        <div class="prop-item" style="grid-column: span 2;">
          <span class="prop-label">Signature Concept Silhouette & Styling Directive</span>
          <span class="prop-value" style="font-weight: 500; font-size:13px; line-height:1.6; color:#374151;">${cleanText(profile.conceptDescription)}</span>
        </div>
        <div class="prop-item" style="grid-column: span 2;">
          <span class="prop-label">Musical Sonic Direction & Production Philosophy</span>
          <span class="prop-value" style="font-weight: 500; font-size:13px; line-height:1.6; color:#374151;">${cleanText(profile.musicalDirection)}</span>
        </div>
        <div class="prop-item" style="grid-column: span 2;">
          <span class="prop-label">${isSolo ? 'Artist Logo & Emblem Symbolism' : 'Corporate Logo & Emblem Symbolism'}</span>
          <span class="prop-value" style="font-weight: 500; font-size:13px; line-height:1.6; color:#374151;">${cleanText(profile.logoDescription)}</span>
        </div>
      </div>
    </div>

    <!-- 3. Strategic Fandom Alliance & Community Protocol -->
    <div style="margin-bottom: 24px;">
      <h3 style="font-size:12px; font-weight:950; color:#111827; text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid #e5e7eb; padding-bottom:6px; margin-bottom:14px;">
        3. Strategic Fandom Alliance & Community Protocol
      </h3>
      <div class="grid-props">
        <div class="prop-item">
          <span class="prop-label">Official Fandom Alliance</span>
          <span class="prop-value" style="font-size:15px; font-weight:900; color:#e11d48;">
            ${cleanText(profile.fandom?.name || 'Classified')}
            ${profile.fandom?.pronunciation ? `<span style="font-size:11px; font-weight:600; color:#4b5563;">[${cleanText(profile.fandom.pronunciation)}]</span>` : ''}
          </span>
        </div>
        <div class="prop-item">
          <span class="prop-label">Fandom Core Slogan / Cheering Motto</span>
          <span class="prop-value" style="font-weight:700; color:#111827;">${cleanText(profile.fandom?.fandomMotto || 'Classified')}</span>
        </div>
        <div class="prop-item" style="grid-column: span 2;">
          <span class="prop-label">Fandom Name Etymology & Alliance Meaning</span>
          <span class="prop-value" style="font-weight: 500; font-size:13px; line-height:1.6; color:#374151;">${cleanText(profile.fandom?.nameOrigin || 'Classified')}</span>
        </div>
        <div class="prop-item">
          <span class="prop-label">Fandom Community Personality Archetype</span>
          <span class="prop-value" style="font-weight:600; font-size:12px; color:#374151;">${cleanText(profile.fandom?.fandomPersonality || 'Classified')}</span>
        </div>
        <div class="prop-item">
          <span class="prop-label">Official Cheering Hand Gesture & Secret Signal</span>
          <span class="prop-value" style="font-weight:600; font-size:12px; color:#374151;">${cleanText(profile.fandom?.handGesturePrompt || 'Classified')}</span>
        </div>
        <div class="prop-item" style="grid-column: span 2;">
          <span class="prop-label">Official Lightstick Design & Specification</span>
          <span class="prop-value" style="font-weight: 500; font-size:13px; line-height:1.6; color:#374151;">${cleanText(profile.fandom?.lightstickDescription || 'Classified')}</span>
        </div>
      </div>
    </div>

    <!-- 4. The Corporate/Artist Palette & Visual Color Harmonies -->
    <div style="margin-bottom: 24px;">
      <h3 style="font-size:12px; font-weight:950; color:#111827; text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid #e5e7eb; padding-bottom:6px; margin-bottom:14px;">
        4. ${isSolo ? 'The Artist Palette & Visual Color Harmonies' : 'The Corporate Palette & Visual Color Harmonies'}
      </h3>
      ${corporatePaletteHtml}
    </div>

    <!-- 5. A&R Simulation Suite -->
    ${simulationMetricsHtml}

    <!-- 6. Overarching Multi-Era Narrative -->
    ${eraNarrativesHtml}

    <!-- 7. Teaser Rollout Timeline -->
    ${teaserTimelineHtml}

    <h2>Section II: ${isSolo ? 'Official Artist Editorial Photoshoot' : 'Official Lineup Editorial Photoshoot'}</h2>
    <div style="margin-bottom:40px;">
      ${photoshootHtml}
    </div>

    <h2>Section III: Official Fandom Universe — Lightstick & 3D Mascot Showcase</h2>
    <div style="margin-bottom:40px;">
      ${fandomGoodsHtml}
    </div>

    <h2>Section IV: ${isSolo ? 'Talent & Solo Artist Blueprint' : 'Talent & Casting Roster Blueprint'}</h2>
    <div style="margin-bottom:40px;">
      ${membersHtml || (isSolo ? '<p style="font-style:italic; color:#9ca3af; font-size:13px;">No artist profile configured in the active database.</p>' : '<p style="font-style:italic; color:#9ca3af; font-size:13px;">No members cast in the active roster database.</p>')}
    </div>

    <h2>Section V: Registered Discography & Song Meanings</h2>
    <div style="margin-bottom:40px;">
      ${discographyHtml || '<p style="font-style:italic; color:#9ca3af; font-size:13px;">No albums structured in active discography.</p>'}
    </div>

    ${brandVisualsHtml ? `
    <h2>Section VI: Product Concept Styling Versions</h2>
    <div style="margin-bottom:40px;">
      ${brandVisualsHtml}
    </div>` : ''}

    <footer style="margin-top:60px; border-top:1px solid #e5e7eb; padding-top:20px; text-align:center; font-size:10px; color:#9ca3af; font-weight:800; letter-spacing:1px; text-transform:uppercase;">
      CONFIDENTIAL A&R RECORD SYSTEM — ELITE TALENT PROTOCOL v3.0 — DO NOT DISTRIBUTE
    </footer>
  </div>
</body>
</html>`;

    // Strategy 1: Open a clean window directly
    let opened = false;
    try {
      const win = window.open('', '_blank');
      if (win) {
        win.document.open();
        win.document.write(fullHtmlContent);
        win.document.close();
        opened = true;
        
        // Auto-trigger print dialog after render
        setTimeout(() => {
          try {
            win.print();
          } catch (e) {
            console.log('Auto-print ignored:', e);
          }
        }, 500);
      }
    } catch (e) {
      console.warn('window.open was blocked:', e);
    }

    // Strategy 2: File download trigger via Blob / Data URL
    try {
      const blob = new Blob([fullHtmlContent], { type: 'text/html;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        try {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        } catch (e) {}
      }, 5000);
    } catch (e) {
      console.warn('Download link click blocked:', e);
    }

    // Strategy 3: Fallback if iframe blocked window.open
    if (!opened) {
      const blob = new Blob([fullHtmlContent], { type: 'text/html;charset=utf-8;' });
      const blobUrl = URL.createObjectURL(blob);
      const fallbackWin = window.open(blobUrl, '_blank');
      if (!fallbackWin) {
        // Fallback to Data URI open
        const dataUri = 'data:text/html;charset=utf-8,' + encodeURIComponent(fullHtmlContent);
        window.open(dataUri, '_blank');
      }
    }
  } catch (err) {
    console.error('Failed to export dossier:', err);
    alert('Error exporting PDF Dossier. Check console for details.');
  }
}
