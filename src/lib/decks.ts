export const WOOD_ART = [
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

export type WoodArt = (typeof WOOD_ART)[number];

export const SKY_ART = [
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
  'silence',
  'oldlight',
  'mirror',
  'message',
  'stranger',
  'view',
  'net',
  'deep',
] as const;

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
