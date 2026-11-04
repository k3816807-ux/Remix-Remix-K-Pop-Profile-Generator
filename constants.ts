import { GroupType, KpopGeneration } from "./types";

export const GROUP_TYPES: GroupType[] = [
  GroupType.GIRL_GROUP,
  GroupType.BOY_GROUP,
  GroupType.FEMALE_SOLOIST,
  GroupType.MALE_SOLOIST,
  GroupType.SOLOIST,
  GroupType.CO_ED_GROUP,
];

export const KPOP_GENERATIONS: KpopGeneration[] = [
  KpopGeneration.SECOND,
  KpopGeneration.THIRD,
  KpopGeneration.FOURTH,
  KpopGeneration.FIFTH,
];

export const DEFAULT_CONCEPT_KEYWORDS = "charismatic, trendy, versatile";
export const MIN_MEMBERS = 1;
export const MAX_MEMBERS = 15;

export const GEMINI_MODEL_TEXT = "gemini-3.8-flash";
export const GEMINI_MODEL_IMAGE = "gemini-3.1-flash-lite-image";
export const GEMINI_MODEL_IMAGE_FAST = "gemini-3.1-flash-lite-image";
export const GEMINI_MODEL_IMAGE_HD = "gemini-3.1-flash-image";
export const GEMINI_MODEL_IMAGE_LEGACY = "gemini-2.5-flash-image";

export const SOCIAL_ICON_MAP: { [key: string]: string } = {
  twitter: "fab fa-twitter",
  instagram: "fab fa-instagram",
  youtube: "fab fa-youtube",
  tiktok: "fab fa-tiktok",
};
