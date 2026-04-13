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

### Earth Palette (Primary)
| Token | Hex | Source | Usage |
|-------|-----|--------|-------|
| `--bark` | `#3a2e2a` | Dark bark | Primary text, deep accents |
| `--heartwood` | `#5c4a3d` | Inner wood | Secondary text, body copy |
| `--branch` | `#7d6b5d` | Dry branch | Tertiary text, captions |
| `--stone` | `#9a8f84` | River stone | Borders, muted UI |

### Canopy Palette (Accent)
| Token | Hex | Source | Usage |
|-------|-----|--------|-------|
| `--needle` | `#4a6741` | Conifer needle | Strong green accent |
| `--moss` | `#6b7f5e` | Forest moss | Medium green accent |
| `--lichen` | `#8a9a7b` | Lichen | Light green accent, borders |
| `--sage` | `#a3b18a` | Sage brush | Subtle green tint |
| `--sky` | `#c5cfc0` | Overcast sky | Lightest green, footer text |

### Light Palette (Backgrounds)
| Token | Hex | Source | Usage |
|-------|-----|--------|-------|
| `--warmwhite` | `#fcfaf6` | Morning light | Card backgrounds |
| `--cream` | `#faf8f4` | Cream | Primary backgrounds |
| `--parchment` | `#f4f0ea` | Old paper | Alternate section backgrounds |
| `--fog` | `#e8e4df` | Morning fog | Deeper background accent |
| `--dawn` | `#e8c9a0` | Dawn light | Warm highlight |

### Earth Depth (Dark)
| Token | Hex | Source | Usage |
|-------|-----|--------|-------|
| `--earth` | `#4a3728` | Rich soil | Footer, dark sections |
| `--root` | `#2a2118` | Deep root | Deepest backgrounds |
| `--canopy` | `#2d4a2d` | Dense canopy | Dark green accent |

### Warm Accents
| Token | Hex | Source | Usage |
|-------|-----|--------|-------|
| `--amber` | `#b8860b` | Tree resin | Warm highlight |
| `--sunlight` | `#d4a843` | Filtered sun | Golden accents |
| `--clay` | `#a0522d` | River clay | Warm accent |

---

## Typography

### Typeface Roles
- **Cormorant Garamond** (Display): Headings, hero text, section titles, decorative numerals. Weight 300-600. Elegant, organic serifs that echo hand-lettering.
- **EB Garamond** (Body): Long-form text, paragraphs, quotes. Weight 400-600. Readable, warm, historically grounded.
- **Source Sans 3** (UI): Navigation, labels, tags, small caps, metadata. Weight 300-600. Clean but warm sans-serif.

### Scale
The typographic scale follows organic proportions (loosely based on the golden ratio):
- Hero title: 3.2rem (desktop), 1.8rem (mobile)
- Section title: 2.4rem / 1.8rem
- Card heading: 1.3rem / 1.15rem
- Body: 1.05rem / 1rem
- Small/UI: 0.78rem / 0.72rem
- Micro: 0.72rem

### Drop Caps
The first letter of preamble/introductory paragraphs uses Cormorant Garamond at large size, floated left. This is a nod to illuminated manuscripts — sacred texts made physical.

---

## Animation Language

### Timing
All animations use organic easing: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` — a curve that starts with gentle acceleration and settles slowly, like a branch coming to rest after the wind passes.

### Named Motions
| Motion | Description | Duration | Usage |
|--------|------------|----------|-------|
| **Breathe** | Gentle scale pulse (1.0 → 1.015 → 1.0) | 8-12s | Background SVGs, decorative elements |
| **Unfold** | Fade up + slight vertical slide | 0.8s | Scroll-triggered reveals |
| **Grow** | Scale from 0 → 1 along Y axis, origin bottom | 0.5s | Accent lines, borders |
| **Drift** | Very slow horizontal float | 20-40s | Background particles |
| **Sway** | Subtle rotation (-0.5deg → 0.5deg) | 6-8s | Tree SVG, organic elements |
| **Ripple** | Outward ring expansion | 0.6s | Click/tap feedback |

### Rules
- Never animate text directly (no bouncing headers)
- Background motion should be imperceptible until you look for it
- Hover states transition over 0.3-0.5s, never instantly
- Scroll-triggered animations fire once, then stay
- Reduced motion: all animations disabled, content visible immediately

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

The site is mobile-first. On small screens:
- Organic shapes simplify but don't disappear
- Separator waves become gentler (lower amplitude)
- Cards stack single-column with consistent organic radius
- Touch targets are generous (44px minimum)
- Breathing animations continue but at reduced scale
- The tree SVG scales gracefully and maintains its presence

---

*This is a living document. Like the canon, it is never closed.*
