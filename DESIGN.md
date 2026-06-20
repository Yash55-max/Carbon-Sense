---
name: Carbon Sense
colors:
  surface: '#0f131d'
  surface-dim: '#0f131d'
  surface-bright: '#353944'
  surface-container-lowest: '#0a0e18'
  surface-container-low: '#171b26'
  surface-container: '#1c1f2a'
  surface-container-high: '#262a35'
  surface-container-highest: '#313540'
  on-surface: '#dfe2f1'
  on-surface-variant: '#bbcabf'
  inverse-surface: '#dfe2f1'
  inverse-on-surface: '#2c303b'
  outline: '#86948a'
  outline-variant: '#3c4a42'
  surface-tint: '#4edea3'
  primary: '#4edea3'
  on-primary: '#003824'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#006c49'
  secondary: '#45dfa4'
  on-secondary: '#003825'
  secondary-container: '#00bd85'
  on-secondary-container: '#00452e'
  tertiary: '#a4c9ff'
  on-tertiary: '#00315d'
  tertiary-container: '#60a5fa'
  on-tertiary-container: '#003a6b'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#68fcbf'
  secondary-fixed-dim: '#45dfa4'
  on-secondary-fixed: '#002114'
  on-secondary-fixed-variant: '#005137'
  tertiary-fixed: '#d4e3ff'
  tertiary-fixed-dim: '#a4c9ff'
  on-tertiary-fixed: '#001c39'
  on-tertiary-fixed-variant: '#004883'
  background: '#0f131d'
  on-background: '#dfe2f1'
  surface-variant: '#313540'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  data-display:
    fontFamily: JetBrains Mono
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: -0.01em
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

The design system is engineered for environmental consciousness through a technical, developer-centric lens. It targets data-literate users who value precision, transparency, and high-efficiency interfaces. The emotional response is one of "urgent clarity"—combining the seriousness of the climate crisis with the optimism of actionable data.

The aesthetic follows a **Bordered Glassmorphism** approach, blending high-tech minimalism with tactile depth. It utilizes deep, layered blacks to create a void-like space where data points and neon accents feel physically illuminated. This style avoids heavy skeuomorphism in favor of precise lines, subtle translucency, and intentional whitespace, evoking the feel of a modern IDE or a mission-control dashboard.

## Colors

The palette is rooted in a "Code-Dark" philosophy. The primary foundation is **Deep Charcoal (#0B0F19)** for the base canvas, with **Pitch Black (#111827)** used for elevated surface containers to create a "reverse-elevation" effect where the background feels deeper than the interface.

**Neon Green (#10B981)** serves as the primary action and "healthy state" color, symbolizing ecological vitality and positive data trends. A secondary, lighter **Emerald (#34D399)** is reserved for hover states and subtle gradients. For interactive alerts or secondary data streams, a technical **Blue (#60A5FA)** is used. All interactive elements should utilize a 1px border using `border_subtle` to define shapes without breaking the dark-mode immersion.

## Typography

This design system employs a dual-font strategy to balance readability with a technical aesthetic. 

- **Geist** is used for headings, providing a sharp, modern geometric feel that stays legible at large scales.
- **Inter** handles standard body text and UI labels, ensuring maximum clarity for long-form data descriptions and settings.
- **JetBrains Mono** is the critical "Data Layer" font. It is used for all numerical readouts, metrics, carbon counts, and code snippets. This creates a clear visual distinction between information (Inter) and actionable data (JetBrains Mono).

For hierarchy, use `label-caps` for small metadata categories and `data-display` for primary metric cards.

## Layout & Spacing

The layout is governed by a **strict 8px grid system**, ensuring all elements align to a technical, systematic rhythm. 

- **Desktop:** 12-column fluid grid with a 1280px max-width. Use 24px gutters to allow for "Bordered Glass" cards to breathe.
- **Tablet:** 8-column grid with 16px margins.
- **Mobile:** 4-column grid. Large headlines should scale down using the `-mobile` tokens to prevent horizontal overflow.

Spacing should be generous to avoid the "cramped" feeling often associated with data-heavy apps. Vertical rhythm is maintained by using `lg` (40px) or `xl` (64px) between major sections.

## Elevation & Depth

Depth in this design system is achieved through **Tonal Layering** and **Backdrop Blurs** rather than traditional drop shadows.

- **Level 0 (Base):** `#0B0F19` – The infinite background.
- **Level 1 (Cards/Containers):** `#111827` – Elevated surfaces with a 1px solid border at 8% white opacity.
- **Level 2 (Modals/Popovers):** Surface color with a `backdrop-filter: blur(12px)` and a slightly brighter border (15% white). 

**Neon Outlines:** For active or focused states, apply a 1px solid stroke of the primary neon green (#10B981) with a 4px outer glow (spread: 0, blur: 8px, color: rgba(16, 185, 129, 0.3)). This simulates a glowing hardware interface.

## Shapes

The design system utilizes a **Soft (Level 1)** roundedness profile to maintain a precise, engineered appearance while avoiding the harshness of purely sharp corners.

- **Standard Elements (Buttons, Inputs, Small Cards):** 0.25rem (4px) corner radius.
- **Large Containers (Dashboard Widgets):** 0.5rem (8px) corner radius.
- **Interactive Pill Elements:** For specific status indicators, use `rounded-full` (999px).

This subtle rounding mimics the industrial design of high-end hardware and ensures that the 1px borders appear crisp on high-density displays.

## Components

### Buttons
Primary actions use a solid neon green background with black text for maximum contrast. Secondary actions use the "Ghost" style: a 1px border with no fill, shifting to a 10% opacity neon fill on hover.

### Minimalist Cards
Cards must have a background color of `#111827` and a subtle border. Content should have at least 24px of internal padding. Header areas within cards should use `label-caps` for titles.

### Sleek Sliders
The slider track is a dark, thin line. The thumb (handle) is a 12px solid neon green square or circle with a subtle outer glow. The "active" portion of the track should be highlighted in neon green.

### Toggle Switches
Small, rectangular toggles with a 2px inner padding. The "Off" state is dark grey; the "On" state is vibrant neon green. Avoid rounded "pill" toggles to maintain the developer-centric aesthetic.

### Data Visualization
Charts should use thin lines (1.5pt). Fill areas under line charts should use a vertical gradient from neon green (20% opacity) to transparent. Use JetBrains Mono for all axis labels and tooltips.

### Input Fields
Inputs are dark with 1px borders. Upon focus, the border transitions to neon green with a subtle outer glow. Placeholders should be a muted grey to ensure clear differentiation from user-entered data.