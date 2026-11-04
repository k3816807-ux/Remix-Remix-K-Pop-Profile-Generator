
export enum GroupType {
  GIRL_GROUP = "Girl Group",
  BOY_GROUP = "Boy Group",
  FEMALE_SOLOIST = "Female Soloist",
  MALE_SOLOIST = "Male Soloist",
  SOLOIST = "Soloist",
  CO_ED_GROUP = "Co-ed Group"
}

export enum KpopGeneration {
  SECOND = "2nd Gen (The Global Pioneers)",
  THIRD = "3rd Gen (The Digital Explosion)",
  FOURTH = "4th Gen (The Universe & Performance)",
  FIFTH = "5th Gen (The Natural & Trendy)"
}

export interface UserInput {
  groupType: GroupType;
  numMembers: number;
  conceptKeywords?: string;
  generation?: KpopGeneration;
}

export interface OfficialColor {
  name: string;
  hex: string;
  description: string;
}

export interface MerchItem {
  id: string;
  name: string;
  category: "Apparel" | "Accessories" | "Collectibles" | "Concert" | "Media";
  priceUSD: number;
  priceKRW: number;
  description: string;
  imageUrl?: string;
  isOfficial?: boolean;
  tag?: string;
}

export interface PhotocardItem {
  id: string;
  memberName: string;
  memberIndex?: number;
  rarity: "Common" | "Rare" | "Holo Rare" | "Secret Rare";
  eraTitle?: string;
  imageUrl?: string;
  backMessage?: string;
  signature?: string;
  foilType?: "stardust" | "prism" | "gold_emboss" | "classic";
  unlockedAt?: string;
}

export interface TourStop {
  city: string;
  country: string;
  venue: string;
  date: string;
  status: "Sold Out" | "Selling Fast" | "Available";
}

export interface FandomProfile {
  name: string;
  pronunciation?: string;
  nameOrigin: string;
  lightstickDescription: string;
  lightstickName?: string;
  lightstickUrl?: string;
  mascotName?: string;
  mascotDescription?: string;
  mascotUrl?: string;
  mascotEmoji?: string;
  fandomPersonality: string;
  fandomMotto: string;
  handGesturePrompt: string;
  worldTourName?: string;
  worldTourLocations?: TourStop[];
  merchItems?: MerchItem[];
  photocardsCollected?: PhotocardItem[];
}

export interface ChartRecords {
  hanteoFirstWeekSales: string;
  circleAlbumSales: string;
  melonPeak: number;
  spotifyGlobalPeak: number;
  spotifyStreams: string;
  youtubeMvViews: string;
  musicShowWins: number;
  trophies: { showName: string; count: number; tripleCrown?: boolean }[];
  certifications: string[];
}

export interface LineDistributionItem {
  memberName: string;
  percentage: number;
  color?: string;
  highlightPart?: string;
}

export interface MemberConceptOutfit {
  memberName: string;
  outfitTitle: string;
  clothingDetails: string;
  colorPalette: string;
  fashionStyle?: string;
  mainStyle?: string;
  secondaryStyle?: string;
  conceptVibe?: string;
  stylingFormula?: string;
  songHairStyle?: string;
  songHairColor?: string;
  hairAndMakeup: string;
  keyAccessories: string[];
  visualVibe: string;
  graphicDesignDetails?: string;
  signaturePersonalityAccent?: string;
  personalityStylingTrait?: string;
  hairTransformation?: {
    styleAndCut: string;
    colorAndHighlights: string;
    stylingFinish: string;
  };
  stagePresence?: string;
  outfitImageUrl?: string;
  outfitImagePrompt?: string;
}

export interface AiSongColorOption {
  id: string;
  title: string;
  rationale: string;
  colors: [string, string, string];
  vibe: string;
}

export interface StoryboardScene {
  timestamp: string;
  title: string;
  visualAction: string;
  featuredMembers?: string[];
  imageUrl?: string;
  imagePrompt?: string;
}

export interface TrackMvVisuals {
  settingName: string;
  settingDescription: string;
  colorGradingAndAtmosphere: string;
  songColorPalette?: string;
  threeColorPalette?: [string, string, string] | string[];
  aiColorOptions?: AiSongColorOption[];
  fashionStyle?: string;
  mainStyle?: string;
  secondaryStyle?: string;
  conceptVibe?: string;
  stylingFormula?: string;
  cinematicVibe: string;
  keyVisualMotifs: string[];
  cameraWorkAndLighting: string;
  groupOutfitConceptSummary?: string;
  iconicSceneHighlights?: StoryboardScene[];
  memberOutfits?: MemberConceptOutfit[];
  groupPhotoUrl?: string;
  groupPhotoPrompt?: string;
  mvStillUrl?: string;
  mvStillPrompt?: string;
}

export interface Track {
  title: string;
  duration: string;
  role: "Title Track" | "B-side" | "Intro" | "Outro";
  genre: string;
  genres?: string[];
  musicStylePrompt?: string;
  producers: string[];
  lyricists: string[];
  description: string;
  lyricExcerpt?: string;
  meaning?: string;
  hasChoreography?: boolean;
  fullLyrics?: string;
  fullLyricsEnglish?: string;
  choreographer?: string;
  structureType?: string;
  structurePattern?: string;
  rhymeScheme?: string;
  figurativeDevices?: string[];
  vocalArrangement?: string;
  lineDistribution?: LineDistributionItem[];
  mvVisuals?: TrackMvVisuals;
}

export interface Album {
  type: "Mini Album" | "Full Album" | "Single" | "Repackage";
  title: string;
  releaseDate: string;
  titleTrack: string;
  albumCoverPrompt: string;
  albumCoverUrl?: string;
  coverArtStyle?: string;
  coverVisualMotif?: string;
  coverPackagingStyle?: "vinyl" | "jewel_case" | "clean_print";
  conceptSummary?: string;
  targetMarketStrategy?: string;
  tracks?: Track[];
  mvSynopsis?: string;
  physicalInclusions?: string[];
  chartRecords?: ChartRecords;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface EraNarrative {
  eraTitle: string;
  conceptSummary: string;
  moodOrVibe: string;
}

export interface SimulationMetrics {
  estimatedDebutBudget: string;
  targetDemographicReach: string;
  potentialChartPerformance: string;
}

export interface VisualConcept {
  versionName: string;
  aestheticStyling: string;
  makeupHairInfo: string;
  framingType?: string;
  poseStyle?: string;
  typographyStyle?: string;
  expressionMood?: string;
  conceptAesthetic?: string;
  studioSet?: string;
  aspectRatio?: string;
  imageUrl?: string;
  imagePrompt?: string;
}

export interface TeaserMilestone {
  dayCount: string;
  eventName: string;
  deliverableDescription: string;
}

export interface GroupProfileData {
  groupName: string;
  groupNamePronunciation?: string;
  groupNameMeaning: string;
  agency: string;
  debutDate: string;
  greeting?: {
    motto: string;
    gesture: string;
  };
  fandom: FandomProfile;
  officialColors: OfficialColor[];
  conceptDescription: string;
  eraNarrative: EraNarrative[];
  musicalDirection: string;
  logoDescription: string;
  logoUrl?: string;
  discography: Album[];
  albumCoverUrls?: Record<string, string>;
  marketFocus: string; 
  simulationMetrics: SimulationMetrics;
  visualConcepts?: VisualConcept[];
  teaserTimeline?: TeaserMilestone[];
  sources?: GroundingSource[];
}

export interface SocialMediaHandles {
  twitter?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
}

export interface PerformanceStats {
  vocal: number;
  dance: number;
  rap: number;
  visual: number;
}

export interface MemberProfileData {
  stageName: string;
  gender?: 'Male' | 'Female' | string;
  fullNameKorean: string;
  fullNameRomanized: string;
  dateOfBirth: string;
  placeOfBirth: string;
  heightCM: number;
  weightKG: number;
  bloodType: string;
  zodiacSign: string;
  mbti: string;
  trainingPeriod: string;
  representativeEmoji: string;
  representativeAnimal: string;
  positions: string[];
  bio: string;
  stats: PerformanceStats;
  socialMedia: SocialMediaHandles;
  race: string;
  skinTone: string;
  originalHairColor: string;
  originalHairType?: string;
  dyedHairColor?: string;
  currentHairStyle?: string;
  imagePrompt: string;
  imageUrl?: string;
  stageNamePronunciation?: string;
  realNamePronunciation?: string;
  fullBodyImages?: string[];
  talents: string[];
  preDebutActivities: string;
  hobbies: string[];
  roleModels: string[];
  petPeeves: string[];
  personalFashionStyle?: string;
  favoriteColors?: string[];
  eyeColor?: string;
  distinctFacialFeatures?: string;
}

export interface FullProfile extends GroupProfileData {
  members: MemberProfileData[];
  groupType: GroupType;
  generation?: KpopGeneration;
  groupPhotoUrl?: string;
  groupPhotoWaistUpUrl?: string;
  groupPhotoFullBodyUrl?: string;
  groupPhotoIncludesAll?: boolean;
  membersInPhotoCount?: number;
}
