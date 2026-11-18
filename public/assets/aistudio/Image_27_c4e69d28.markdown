---
name: Warm Academic Exchange
colors:
  surface: '#fdf9f1'
  surface-dim: '#dddad2'
  surface-bright: '#fdf9f1'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f3eb'
  surface-container: '#f1ede6'
  surface-container-high: '#ece8e0'
  surface-container-highest: '#e6e2da'
  on-surface: '#1c1c17'
  on-surface-variant: '#574239'
  inverse-surface: '#31302b'
  inverse-on-surface: '#f4f0e8'
  outline: '#8b7267'
  outline-variant: '#dec0b4'
  surface-tint: '#a23f00'
  primary: '#9e3d00'
  on-primary: '#ffffff'
  primary-container: '#c15316'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb695'
  secondary: '#446274'
  on-secondary: '#ffffff'
  secondary-container: '#c7e7fc'
  on-secondary-container: '#4a687a'
  tertiary: '#00685c'
  on-tertiary: '#ffffff'
  tertiary-container: '#288274'
  on-tertiary-container: '#f4fffb'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcc'
  primary-fixed-dim: '#ffb695'
  on-primary-fixed: '#351000'
  on-primary-fixed-variant: '#7c2e00'
  secondary-fixed: '#c7e7fc'
  secondary-fixed-dim: '#abcbdf'
  on-secondary-fixed: '#001e2c'
  on-secondary-fixed-variant: '#2b4a5b'
  tertiary-fixed: '#9ef2e2'
  tertiary-fixed-dim: '#82d6c6'
  on-tertiary-fixed: '#00201c'
  on-tertiary-fixed-variant: '#005047'
  background: '#fdf9f1'
  on-background: '#1c1c17'
  surface-variant: '#e6e2da'
typography:
  display-lg:
    fontFamily: Newsreader
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Newsreader
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Newsreader
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Newsreader
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '700'
    lineHeight: 22px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The design system embodies a modern literary commons: reliable, community-driven, and intrinsically trustworthy. It merges the warmth of an indie corner bookstore with the utilitarian efficiency of a modern peer-to-peer marketplace. 

The aesthetic style is **Warm Editorial Modern**:
- **Tone:** Accessible, scholarly yet relaxed, honest, and tactile.
- **Audience:** Students, avid readers, collectors, and casual book-passers seeking affordable reads and straightforward selling.
- **Design Signatures:** Subdued parchment background tones paired with ink-inspired deep blue typography, vibrant amber accents that direct action without sensory fatigue, and structured catalog-inspired borders and tags. Tactile paper textures are referenced digitally through layered surface warmth rather than literal skeuomorphism.

## Colors

The palette balances warm bibliophilic nostalgia with decisive e-commerce clarity.

- **Primary (`#D96528` - Ember Amber):** Used for critical conversion hooks, high-intent call-to-actions ("Buy Now", "List a Book"), notifications, and active states. Inspires energy and friendliness.
- **Secondary (`#1B3B4B` - Deep Ink Navy):** The structural anchor. Used for prominent headers, navigation anchors, secondary interactive elements, and key informational badges. Communicates institutional trust and academic heritage.
- **Tertiary (`#1E7B6E` - Vintage Book Teal):** Serves functional accent needs, particularly positive state highlights, condition indicators ("Like New", "Mint"), and verified seller endorsements.
- **Neutral (`#FAF6EE` - Soft Parchment):** The foundation canvas. Reduces eye strain during long browsing sessions, replacing clinical white with a warm, paper-like ground tone.
- **Text & Borders:**
  - High-contrast body text uses Deep Charcoal Ink (`#1C2226`) to preserve legibility over the parchment canvas.
  - Ghost borders and divider rules use Muted Vellum Line (`#E5DEC9`).

## Typography

The typographic hierarchy creates tension between classic literary warmth and modern transaction mechanics.

- **Editorial Serifs (Newsreader):** Selected for book titles, promotional mastheads, and editorial showcases. Brings humanistic authority, evoking classic printing presses and dust jackets.
- **Crisp Grotesque (Plus Jakarta Sans):** Selected for metadata, prices, interactive labels, descriptions, and user interactions. Its open counters and geometric structure guarantee immediate scanability on mobile viewports.
- **Pricing & Numbers:** Always rendered in **Plus Jakarta Sans** with bold weight (`700`), ensuring quick comparison between original retail price (struck-through, muted) and exchange price.

## Layout & Spacing

The layout is built around a mobile-first philosophy that scales effortlessly to tablet and desktop viewports.

- **Mobile (Default):** 4-column fluid layout with `0.75rem` (12px) gutters and `1rem` (16px) outer edge margins. Screen real estate prioritizes two-column book grids (`grid-cols-2`) with equal-height cards.
- **Tablet & Desktop:** Adapts to an 8-column layout (tablet) and 12-column fixed container (desktop max width 1120px) with `1rem` gutters and centered `2rem` margins.
- **Vertical Rhythm:** Strict adherence to an 8pt increment model. Component gaps use `space-xs` (4px) for inline badges and icon pairings, `space-sm` (8px) for related meta text groupings, `space-md` (16px) for item separators, and `space-xl` (32px) to designate major catalog chapters or collections.
- **Bottom Navigation Safe Zone:** Sticky bottom actions and system navigation include a safe-area offset of minimum `4.5rem` to avoid content occlusion on mobile handoffs.

## Elevation & Depth

Visual hierarchy leverages **tonal surfaces and soft paper-like depth** rather than aggressive synthetic shadows:

- **Base Canvas:** `#FAF6EE` (Warm Parchment).
- **Surface Level 1 (Cards, Modals, Inputs):** Pure `#FFFFFF` resting atop the parchment base, bound by a crisp 1px hair-line outline (`#E5DEC9`) that feels like a clean paper cut.
- **Surface Level 2 (Floating Action Buttons, Menus, Bottom Bar):** Elevated with a warm ambient shadow:
  - `box-shadow: 0 4px 16px -2px rgba(27, 59, 75, 0.08), 0 2px 4px -1px rgba(27, 59, 75, 0.04);`
  - Shadows are tinted subtly with the secondary navy tone (`#1B3B4B`) to simulate natural light rather than generic dark gray blurs.
- **Sticky Bottom Bar:** Uses a subtle semi-opaque backdrop blur (`backdrop-filter: blur(12px)`) with `rgba(250, 246, 238, 0.92)` parchment background and a 1px border-top (`#E5DEC9`), maintaining visual continuity with the page content below.

## Shapes

The interface embraces a **Soft Bookish Contour** (`roundedness: 1`):

- **Standard Elements (Buttons, Inputs, Tag Badges):** 0.25rem (4px) corner radii. This captures the disciplined feel of cut bookmark slips and printed library ledger cards.
- **Book Display Cards & Modals (`rounded-lg`):** 0.5rem (8px) corner radii, smoothing touch interactions on handheld screens while avoiding excessively bulbous aesthetic traits.
- **Bottom Sheets (`rounded-xl`):** 0.75rem (12px) applied strictly to top-left and top-right edges.
- **Book Cover Media:** Corner radii on book thumbnails are kept minimal at 2px–4px, preserving the rectangular structural silhouette of physical spines and covers.

## Components

### Buttons
- **Primary Action (Buy / Direct Purchase):** Solid Ember Amber (`#D96528`) background, white text (`#FFFFFF`), `font-weight: 600`, minimum 48px touch target height, `0.25rem` radius. Subtle active scale transition (`active:scale-[0.98]`).
- **Secondary Action (List / Sell / Message Seller):** Deep Ink Navy (`#1B3B4B`) background with white text or transparent background with a solid 1.5px border in `#1B3B4B`.
- **Text & Link Actions:** Unadorned Deep Ink Navy with an underlined state on hover/focus.

### Status Chips & Badges
- **Condition Tags ('Like New', 'Gently Used', 'Vintage'):** Pill-structured or 4px-box styling using light tinted backgrounds with matching high-contrast text.
  - *Like New / Pristine:* Tinted Teal (`#E6F4F1`) with text `#1E7B6E`.
  - *Gently Used:* Tinted Navy (`#EBF1F5`) with text `#1B3B4B`.
  - *Acceptable / Worn:* Tinted Sand (`#F2ECE1`) with text `#705E44`.
- **Discount & Price Drops ('50% Off'):** High-saturation Ember Amber background (`#D96528`) with inverted crisp white bold text.

### Book Cards (Listing Grid)
- Formed with pure white surface background (`#FFFFFF`) framed by a 1px border (`#E5DEC9`).
- Features a portrait aspect ratio book cover (3:4) with a subtle inset shadow to mimic spine depth.
- Displays condition badge overlay on the top corner, book title in `headline-sm` Newsreader (truncated at 2 lines), author in muted sans-serif, and bottom price lockup with original retail price in strikethrough.

### Input Fields & Search
- Surface in pure `#FFFFFF` surrounded by `#E5DEC9` border. Focus states transition smoothly to an intentional 1.5px border in Deep Ink Navy (`#1B3B4B`), avoiding fluorescent focus rings.
- Placeholder text reads warmly: *"Search by title, author, or ISBN..."* in muted charcoal.

### Checkboxes & Radio Buttons
- 20px squares and circles with 1.5px border in `#1B3B4B`.
- Checked state fills with `#1B3B4B` housing an ivory check icon or center dot.

### Bottom Navigation Bar
- Fixed at the bottom of the viewport with a height of 64px + safe area padding.
- Comprises 4 primary routes: *Explore (Catalog)*, *Search*, *Sell (+)*, *Inbox*, and *My Bookshelf*.
- The *Sell* action can be styled as an accented Ember Amber circular dock button rising slightly above the bar boundary.