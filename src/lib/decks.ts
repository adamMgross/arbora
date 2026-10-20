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

export interface CardPicture {
  src: string;
  srcset: string;
  width: number;
  height: number;
  alt: string;
  title: string;
  artist: string;
  year: string;
  source: string;
}

export type Circle = 'Elder' | 'Spirit' | 'Passage';

export interface WoodCard {
  circle: Circle;
  name: string;
  from: string;
  picture: CardPicture;
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
