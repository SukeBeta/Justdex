---
name: Elemental Clarity
colors:
  surface: '#f6faff'
  surface-dim: '#d2dbe4'
  surface-bright: '#f6faff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#ecf5fe'
  surface-container: '#e6eff8'
  surface-container-high: '#e0e9f2'
  surface-container-highest: '#dbe4ed'
  on-surface: '#141d23'
  on-surface-variant: '#47464c'
  inverse-surface: '#293138'
  inverse-on-surface: '#e9f2fb'
  outline: '#78767d'
  outline-variant: '#c8c5cd'
  surface-tint: '#5d5c74'
  primary: '#00000b'
  on-primary: '#ffffff'
  primary-container: '#1a1a2e'
  on-primary-container: '#83829b'
  inverse-primary: '#c6c4df'
  secondary: '#5c5f60'
  on-secondary: '#ffffff'
  secondary-container: '#e1e3e4'
  on-secondary-container: '#626566'
  tertiary: '#695d3c'
  on-tertiary: '#ffffff'
  tertiary-container: '#b9aa83'
  on-tertiary-container: '#493f20'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e0fc'
  primary-fixed-dim: '#c6c4df'
  on-primary-fixed: '#1a1a2e'
  on-primary-fixed-variant: '#45455b'
  secondary-fixed: '#e1e3e4'
  secondary-fixed-dim: '#c5c7c8'
  on-secondary-fixed: '#191c1d'
  on-secondary-fixed-variant: '#454748'
  tertiary-fixed: '#f2e1b7'
  tertiary-fixed-dim: '#d5c59d'
  on-tertiary-fixed: '#231b02'
  on-tertiary-fixed-variant: '#514627'
  background: '#f6faff'
  on-background: '#141d23'
  surface-variant: '#dbe4ed'
typography:
  h1:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.05em
  chip-text:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  section-gap: 64px
---

## Brand & Style

This design system focuses on a **Minimalist** aesthetic with a strong emphasis on content legibility and ease of navigation. The brand personality is efficient, quiet, and premium, moving away from the loud, gamified visuals typical of the genre. 

The UI prioritizes generous whitespace and a "quiet" interface to allow the vibrant colors of the Pokémon and their elemental types to provide the primary visual interest. It uses a blend of soft depth and structured layouts to create a sense of organized discovery, evoking a modern scientific encyclopedia feel rather than a toy.

## Colors

The palette is anchored by high-quality neutrals. The **Main Background** is a crisp off-white for light mode, while the **Dark Mode Background** utilizes a deep, sophisticated navy-tinted dark gray. 

The **Primary Accents** are strictly reserved for functional information—specifically Pokémon types. These 18 colors are used as semantic identifiers for chips, progress bars, and card accents. Actionable elements like buttons and primary navigation links use the Dark Mode Background color as their "Ink" color in light mode to maintain high contrast and a professional tone.

## Typography

The design system utilizes **Inter** exclusively to achieve a systematic, utilitarian look. The hierarchy is established through significant weight changes and tight letter-spacing on larger headings. 

Body text remains open and legible with a 1.6 line-height to support longer descriptions of Pokémon biology. Small labels and metadata use an uppercase style with increased letter spacing to provide a clear distinction from primary content.

## Layout & Spacing

This design system uses a **Fixed Grid** approach for desktop views to maintain a curated, editorial feel, while transitioning to a flexible fluid model for mobile. 

A 12-column grid is employed with generous 24px gutters. Spacing follows a 4px base unit, with consistent use of "stack" spacing (vertical margins) to separate content modules. Horizontal padding in sections should never be less than 24px on desktop to preserve the sense of openness.

## Elevation & Depth

Visual hierarchy is managed through **Ambient Shadows** and tonal layering. Surfaces do not use harsh borders; instead, depth is created using a single "soft lift" shadow: 
- **Shadow-SM:** 0px 4px 12px rgba(0, 0, 0, 0.05) — Used for static cards.
- **Shadow-MD:** 0px 12px 24px rgba(0, 0, 0, 0.08) — Used for hovered cards and dropdowns.

In dark mode, depth is achieved by lightening the surface color of elements closer to the user (Tonal Layers), rather than relying on shadows, which are less visible on dark backgrounds.

## Shapes

The shape language is defined by a consistent **16px (1rem)** radius for all primary containers, including cards, search inputs, and modal overlays. Smaller elements like buttons and chips utilize a fully rounded (pill-shaped) style to distinguish them as interactive triggers. This contrast between the "Rounded" structural elements and "Pill" interactive elements helps users quickly identify touch targets.

## Components

### Navigation & Search
- **Top Nav:** A fixed, transparent background with a backdrop-blur (10px). Link items use `label-caps` typography.
- **Search Bar:** Large, 16px rounded input. Uses a subtle `Shadow-SM`. Iconography is placed on the left with a placeholder font color of `#ADB5BD`.

### Action Elements
- **Filter Chips:** Pill-shaped. Inactive state is a light gray stroke; active state uses the background color of the specific Pokémon type with white text.
- **Buttons:** Primary buttons are pill-shaped with a solid `#1A1A2E` background. Secondary buttons use a subtle ghost style with a 1px border.

### Data Display
- **Cards:** White background (Light Mode) or Lighter Navy (Dark Mode). Soft 16px corners. Image of the Pokémon should exceed the top boundary of the card slightly for a 3D effect.
- **Type Badges:** Small pill-shaped containers. Background color corresponds to the Pokémon type, text is always high-contrast (white or dark navy depending on the type's luminance).
- **Stat Bars:** Horizontal progress bars. The track is a light neutral, while the fill color dynamically changes based on the primary type of the Pokémon being viewed.