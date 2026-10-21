export const WASHI = 'var(--art-washi)';
export const SUMI = 'var(--art-sumi)';
export const RED = 'var(--art-red)';
export const SERIF = "'Cormorant Garamond',Georgia,serif";
export const SMALLCAPS = "'Cormorant SC',Georgia,serif";

export const seasonVar = (key: string, part: string) => `var(--art-${key}-${part})`;
