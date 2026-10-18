export interface TocItem {
  label: string;
  href: string;
  arrow?: boolean;
  children?: TocItem[];
}
