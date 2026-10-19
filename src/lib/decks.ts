export const WOOD_ART_BASE = [
  'stayedAwake',
  'aspen',
  'bristlecone',
  'uselessTree',
  'yggdrasil',
  'greenMan',
  'dryads',
  'kodama',
  'darkWood',
  'nurseLog',
  'leaffall',
] as const;

export const WOOD_ART_ELDERS = [
  'whitePine',
  'sugarMaple',
  'paperBirch',
  'redwood',
  'oak',
  'bodhi',
  'ceiba',
  'carob',
] as const;

export const WOOD_ART_SPIRITS = [
  'humbaba',
  'pan',
  'leshy',
  'tapio',
  'cernunnos',
  'yakshi',
  'burningBush',
  'owl',
  'forestSage',
  'wind',
] as const;

export const WOOD_ART_PASSAGES = [
  'clearing',
  'rings',
  'seed',
  'fire',
  'shelter',
  'oldPaths',
  'pruning',
  'root',
  'dormancy',
  'grafting',
  'fruit',
  'bending',
  'stillness',
  'sprout',
  'threads',
  'firstLeaf',
  'bareMountain',
  'unremembered',
  'hollow',
  'treeOfField',
  'edge',
  'climbing',
  'juniper',
] as const;

export const WOOD_ART = [...WOOD_ART_BASE, ...WOOD_ART_ELDERS, ...WOOD_ART_SPIRITS, ...WOOD_ART_PASSAGES] as const;

export type WoodArt = (typeof WOOD_ART)[number];

export const SKY_ART_BASE = [
  'sun',
  'moon',
  'mercury',
  'venus',
  'mars',
  'jupiter',
  'saturn',
  'pleiades',
  'orion',
  'dipper',
  'milkyway',
  'dogstar',
  'scorpion',
  'swan',
  'weaver',
  'lion',
  'bull',
  'twins',
  'queen',
  'herdsman',
  'chained',
  'archer',
  'falling',
  'silence',
  'oldlight',
  'mirror',
  'message',
  'stranger',
  'view',
  'net',
  'deep',
] as const;

export const SKY_ART_FIGURES = [
  'ram',
  'crab',
  'maiden',
  'scales',
  'goatfish',
  'waterbearer',
  'fishes',
  'southernfish',
  'whale',
  'river',
  'dolphin',
  'crow',
  'polestar',
  'dragon',
  'crown',
  'kneeler',
  'serpentbearer',
  'berenice',
  'hero',
  'horse',
  'charioteer',
  'littlecloud',
] as const;

export const SKY_ART_MYSTERIES = [
  'egg',
  'widening',
  'greatyear',
  'longsleep',
  'edge',
  'stardust',
  'breath',
  'traveler',
  'lastlight',
] as const;

export const SKY_ART = [...SKY_ART_BASE, ...SKY_ART_FIGURES, ...SKY_ART_MYSTERIES] as const;

export type SkyArt = (typeof SKY_ART)[number];

export interface DeckPassage {
  html: string;
  attributionHtml: string;
}

export type Circle = 'Elder' | 'Spirit' | 'Passage';

export interface WoodCard {
  circle: Circle;
  name: string;
  from: string;
  art: WoodArt;
  principle: string;
  story: string;
  passages: DeckPassage[];
  question?: string;
  table?: string;
}

export interface WoodData {
  cards: WoodCard[];
}

export type PlateKind = 'heaven' | 'stars' | 'beyond';

export interface SkyPlate {
  id: string;
  kind: PlateKind;
  n?: number;
  name: string;
  alt: string;
  art: SkyArt;
  above: string;
  set: string;
  receive: string;
  passages: DeckPassage[];
  question: string;
}

export interface SkyData {
  plates: SkyPlate[];
  place: { lat: number; lon: number };
}

export interface YearSeasonData {
  key: string;
  name: string;
  from: number;
  to: number;
  passages: DeckPassage[];
}

export interface YearData {
  terms: Array<{ name: string; month: number; day: number }>;
  windows: string[];
  ko: string[];
  seasons: YearSeasonData[];
}

export type DeckName = 'wood' | 'sky' | 'year';
