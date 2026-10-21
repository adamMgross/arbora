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
  picture: CardPicture;
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
  pictures: CardPicture[];
  seasons: YearSeasonData[];
}

export type DeckName = 'wood' | 'sky' | 'year';
