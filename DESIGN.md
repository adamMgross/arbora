# Arbora Design Language

## Living Architecture

Arbora's design language draws from the same source as its content: trees, roots, rings, flowing water, filtered light, and the slow patience of geological time. The site should feel like a living thing — breathing, growing, rooted. Every visual decision serves the same purpose as the religion itself: to create a space where presence, interconnection, and wonder feel natural.

---

## Core Design Principles

### 1. Organic Geometry
Nothing in nature is perfectly rectangular. Corners are rounded asymmetrically, like river stones. Borders curve like branches. Dividers flow like water between sections. Sharp edges are softened; rigid grids are loosened. The shapes on screen should feel grown, not constructed.

### 2. Rooted Depth
The page has vertical weight. Dark, earthy tones anchor the bottom (footer as root system). Light, airy tones rise toward the top (hero as canopy and sky). Shadows are warm and soft, like shade under a tree. Elements feel layered — bark over heartwood, lichen over bark.

### 3. Living Motion
The site breathes. Background elements pulse gently. Hover states grow rather than snap. Scroll reveals unfold like leaves. Nothing moves fast or mechanically. Animations use organic easing curves — the acceleration of a falling leaf, the slow sway of a branch. Motion is always subtle; it should be felt more than seen.

### 4. Dappled Light
Backgrounds aren't flat. They carry the quality of light filtering through a canopy — warm golden spots, cool green shadows, soft gradients that shift as you scroll. Sections are distinguished by light quality (warmer, cooler, brighter, deeper) rather than by hard borders.

### 5. Growth Rings
Repetition in Arbora follows the pattern of tree rings: concentric, accumulating, each layer recording time. Numbered elements use ring motifs. Lists grow outward from a center. Section transitions ripple rather than cut.

### 6. Mycelial Connection
Related elements are visually connected — through shared color threads, aligned accents, subtle linking lines. The design echoes the mycorrhizal networks that connect trees underground: invisible but structurally essential. Hover states on one element can subtly affect its neighbors.

### 7. Seasonal Warmth
The palette shifts through warm earth tones — amber morning light, green canopy shade, brown bark, grey stone, golden pollen. Cool tones are used sparingly for contrast (river, sky). The overall temperature is warm: this is a site you want to linger in, like a south-facing clearing.

---

## Color System

The tokens are defined once, in `src/styles/tokens.css`. That file is the source of truth for every value, so this document names roles and does not repeat hex codes.

| Group | Tokens | Role |
|---|---|---|
| Earth | `--bark`, `--heartwood`, `--branch`, `--stone` | Text from strongest to quietest, and borders |
| Canopy | `--needle`, `--moss`, `--lichen`, `--sage`, `--sky` | Green accents from strong to faint, and footer text |
| Light | `--warmwhite`, `--cream`, `--parchment`, `--fog`, `--dawn` | Card, page, alternate-section, and deeper backgrounds, and a warm highlight |
| Depth | `--earth`, `--root`, `--canopy` | Footer and dark sections |
| Warm accents | `--amber`, `--sunlight`, `--clay` | Resin, filtered sun, river clay |

Shadows (`--shadow-*`), organic radii (`--radius-*`), easing (`--ease-organic`, `--ease-grow`), fonts, and spacing (`--space-xs` to `--space-2xl`) are tokens too. `--dawn`, `--amber`, `--sunlight`, `--shadow-glow`, and `--ease-grow` are defined and not yet used.

Dark mode follows `prefers-color-scheme` and redefines the palette in `tokens.css`. Several palette tokens change meaning there, so `--earth` becomes a light color. Moving this to semantic tokens is ticketed (`arb-748i`).

The three reflection decks carry their own palettes, defined on their stages in `src/components/Deck.css` and the same in both color schemes: the Wood is gold line on night green with moonlight on birch and aspen, the Sky is the celestial atlas in lapis, gold, vermilion, and cream, and the Year is washi, sumi ink, and seal red with each California season's colors. The SVG art references these tokens with `var()` and never a literal.

---

## Typography

### Typeface roles
- **Cormorant Garamond** (display): headings, hero text, section titles, decorative numerals. Elegant serifs that echo hand-lettering.
- **EB Garamond** (body and UI): long-form text, quotations, navigation, labels, tags, and metadata. `--font-ui` and `--font-body` are the same face.

Source Sans 3 is still requested by every page and is not used. Removing it is ticketed (`arb-7r1s`).

### Scale
The scale is not tokenized. The main steps in use:
- Hero title: 3.4rem on desktop, with smaller steps at 900 px, 640 px, and 380 px
- Section title: 2.4rem, 1.8rem on small screens
- Card heading: 1.3rem
- Body: 1.05rem
- Small UI text: 0.72rem to 0.88rem

### Drop caps
The first letter of introductory paragraphs uses Cormorant Garamond at large size, floated left, a nod to illuminated manuscripts.

---

## Animation Language

### Timing
Animations use organic easing, `--ease-organic`: gentle acceleration that settles slowly, like a branch coming to rest.

### Named motions
| Motion | Description | Duration | Usage |
|---|---|---|---|
| **Breathe** | Gentle scale pulse on the hero tree (`treeBreathe`) | 10s | Hero tree |
| **Unfold** | Fade up with a slight vertical slide (`fadeUp`, and the `.reveal` transition) | 1s to 1.1s | Hero text and scroll reveals |
| **Sway** | Rotation of plus or minus 0.15 degrees (`tree-sway`) | 8s | The tree diagram |
| **Turn** | Slow rotation (`mandalaRotate`) | 120s | Hero geometry |
| **Drip** | Scaling lines (`scrollDrip`) | 2.5s | Scroll hint |

Drift and Ripple were imagined and never built.

### Rules
- Never animate text directly (no bouncing headers)
- Background motion should be imperceptible until you look for it
- Hover states transition over 0.3 to 0.5s where possible. Some controls use 0.15s to 0.25s.
- Scroll-triggered reveals fire once, then stay
- Reduced motion disables animation and shows content immediately. The tree diagram's sway does not yet stop (`arb-yq84`).

---

## Component Patterns

### Section Separators
Sections flow into each other through organic SVG wave shapes. Each separator carries the color of the section above and reveals the section below through its curved bottom edge. Wave shapes are asymmetric — no two are identical, like shorelines.

### Value Cards
Rounded with organic, asymmetric border-radius (e.g., 12px 8px 16px 4px). Background carries a subtle warm gradient. Left accent is a vertical vine-line that grows upward on hover. Shadow is warm and diffuse.

### Ring Numbers
Numbered items use a circular border (tree ring motif) around the numeral. On hover, the ring fills with green. This connects numbering to the deep-time / growth-ring metaphor.

### Blockquotes
Left border is a subtle vine-like green line. Background has the quality of a clearing — slightly brighter than surroundings. The italic text feels like whispered wisdom.

### Tags / Tradition Labels
Rounded with a leaf-like border-radius (larger on two opposite corners). Core tags are filled with bark color; secondary and tertiary tags are progressively lighter and more transparent.

### Hero
The hero section is a full-viewport clearing in the forest. Background carries multiple layered gradients creating dappled sunlight. A subtle SVG tree illustration (very low opacity) provides a ghostly, sacred presence behind the text. The scroll hint at the bottom is a gentle downward pulse.

### Footer
The footer is the root system. Background transitions from earth to deep root color. The top edge is an organic SVG separator with a root-like profile. The "Arbora" mark sits centered like a trunk cross-section.

---

## Deck Pictures

A drawn card shows its picture and its name and nothing else (`docs/decisions/0012`), so the picture carries the card. The pictures are public-domain art, not drawings (`docs/decisions/0014`). A tarot card works because the reader steps into the figure on it, so a picture has a person in it wherever the card allows, small against trees, sky, or weather.

- **One source per deck,** so a deck reads as one look. The Wood is American landscape painting of the 1800s. The Sky is Doré's engravings, with Flammarion, Verne, and one NASA painting. The Year is Hokusai and Hiroshige.
- **The whole picture.** Each card takes its picture's shape, on a mat with the name beneath. Nothing is cropped except text and the scan's margins.
- **No text in the picture.** Titles, captions, poems, and labels are cropped away by the picture's `trim`. Artists' signatures and seals stay.
- **Credit.** The book ends with the work's title, artist, year, and a link to its source.
- **Every card has one.** A card with no fitting picture leaves the deck.
- **The mat is the deck's.** The Wood's is forest ink with the name in IM Fell small caps. The Sky's is lapis with the name in cream. The Year's is washi, with the window's number on a red seal before its name, and its book credits both the world's print and the drawn one.
- **The backs stay drawn.** The hub's card backs, the Wood's forest, the Sky's dome, and the Year's ring are SVG from each deck's `art.ts`.

---

## Spatial Philosophy

### Vertical Flow
The page reads as a journey from canopy to roots:
- **Hero** (Sky/Canopy): Lightest, most open, airy
- **Content sections** (Trunk): Alternating warm/cool tones, like bark layers
- **Footer** (Roots): Darkest, most grounded, stable

### Breathing Room
Generous spacing between sections (6-10rem). Text has wide line-height (1.7-1.9). Cards have comfortable padding. Nothing feels cramped. The site should feel like a clearing — open space is as important as content.

### Organic Margins
Margins and paddings aren't perfectly uniform. Sections have slightly different vertical rhythms, like the irregular spacing of tree rings (which vary by growing season). This subtle irregularity prevents the mechanical feeling of a rigid grid.

---

## Responsive Philosophy

The intent is mobile-first, and the stylesheet is currently desktop-first with `max-width` queries at 900 px, 640 px, and 380 px (`arb-0yyn` tracks the inversion). On small screens:
- Organic shapes simplify but don't disappear
- Separator waves become gentler (lower amplitude)
- Cards stack single-column with consistent organic radius
- Touch targets are generous (44px minimum)
- Breathing animations continue but at reduced scale
- The tree SVG scales gracefully and maintains its presence

---

*This is a living document. Like the canon, it is never closed.*
