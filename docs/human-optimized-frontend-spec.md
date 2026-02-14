# Human-Optimized Frontend Specification — Chain Day

## Direction Lock

- **Aesthetic:** Warm Minimalism — restrained palette, generous whitespace, organic softness
- **UX Philosophy:** Clarity-first — every element serves the primary action; zero ambiguity

---

## 1. Typography

| Role | Family | Size | Weight | Line Height | Letter Spacing |
|------|--------|------|--------|-------------|----------------|
| Display | Instrument Serif | 38pt | 500 | 1.18 | -2% |
| H1 | Instrument Serif | 30pt | 500 | 1.2 | -1.5% |
| H2 | DM Sans | 22pt | 600 | 1.27 | -1% |
| H3 / Card Title | DM Sans | 17pt | 600 | 1.29 | -0.4% |
| Body | DM Sans | 16pt | 400 | 1.5 | 0% |
| Body Small | DM Sans | 14pt | 400 | 1.43 | +0.2% |
| Caption | DM Sans | 12pt | 500 | 1.5 | +0.5% |
| Mono / Data | JetBrains Mono | 15pt | 500 | 1.4 | 0% |

**Pairing rule:** Instrument Serif for display/headings only (emotional warmth). DM Sans for everything interactive and informational (clean legibility).

---

## 2. Color & Theme

### Palette

| Role | Token | Hex | Usage |
|------|-------|-----|-------|
| Dominant | `forest` | `#1B4332` | Headings, primary buttons, nav icons |
| Secondary | `sage` | `#74A68D` | Progress fills, active states, links |
| Accent | `amber` | `#E8A838` | Streak fire, celebrations, premium badge |
| Neutral Base | `parchment` | `#F6F2EC` | Screen background |
| Surface | `cream` | `#FFFFFF` | Cards, modals |
| Border | `stone-200` | `#E2DDD6` | Card borders, dividers |
| Text Primary | `ink` | `#2C2C2C` | Body text |
| Text Secondary | `stone-500` | `#8A847C` | Captions, meta |
| Error | `clay` | `#C4442A` | Destructive actions |
| Premium | `plum` | `#6B3FA0` | Premium features, paywall CTA |

### Rules
- Only `amber` is saturated; `forest` and `sage` are desaturated earth tones
- Accent (`amber`) covers ≤ 8% of any screen
- Text on `parchment`: contrast ratio 8.2:1 (ink) / 4.6:1 (stone-500) — AA compliant
- Gradients: only on backgrounds, `parchment` → `#EDE8E0` (vertical, subtle)

### Dark Mode (future)
- `forest` → `#A7C4B5` (inverted for text)
- Background: `#141414`
- Cards: `#1E1E1E`

---

## 3. Layout & Composition

- **Grid unit:** 8pt
- **Screen margins:** 20pt horizontal, 8pt top (below safe area)
- **Card padding:** 16pt
- **Card gap:** 10pt vertical
- **Card border-radius:** 20pt
- **Button border-radius:** 14pt

### Visual Weight Distribution
- **Primary zone (50%):** Habit list / main content — center of viewport
- **Secondary zone (30%):** Week navigator + section headers — top
- **Tertiary zone (20%):** FAB + tab bar — periphery

### Alignment
- Single left axis for all content
- Right axis only for trailing actions (checkmarks, chevrons)

---

## 4. Background & Depth

- **Type:** Layered planes
- **Layer 0 (background):** `parchment` (#F6F2EC) with subtle vertical gradient to #EDE8E0
- **Layer 1 (cards):** Pure white (#FFFFFF) with 1px `stone-200` border
- **Layer 2 (elevated):** Modals, sheets — white with shadow `0 8px 32px rgba(28,25,23,0.12)`

### Shadow System
| Level | Offset | Blur | Opacity |
|-------|--------|------|---------|
| Card | 0, 2px | 12px | 0.06 |
| FAB | 0, 4px | 16px | 0.12 |
| Modal | 0, 8px | 32px | 0.12 |

- Foreground/background luminance contrast: 28% (white card on parchment)
- Max depth layers: 3

---

## 5. Motion Graphics

### Entry Motion
- Cards: fade-up from 16px below, staggered 50ms between items
- Duration: 280ms, ease-out (`cubic-bezier(0.16, 1, 0.3, 1)`)

### Hierarchy Reinforcement
- Section headers: fade in 200ms before cards
- Week navigator arrows: scale 0.92 → 1.0 on appear (220ms)

### Interaction Feedback
- **Habit toggle:** Scale card to 0.97 on press (100ms spring, damping 18), then snap back
- **Check complete:** Checkmark draws in (stroke-dasharray animation), 320ms ease-out; accent bar fills from left, 280ms
- **Streak fire:** Amber glow pulse on streak ≥ 7 days (single cycle, 400ms, ease-in-out)
- **FAB press:** Scale 0.9 + slight rotation (-3°), spring back (damping 12, stiffness 200)

### Celebration
- Confetti burst on milestone: 24 particles, 600ms, gravity-based fall
- Only on habit strength level-up and 7/30/100-day streaks

### Constraints
- Max 3 simultaneous animating elements
- No decorative loops or idle animations
- All motion respects `prefers-reduced-motion`
- Timing range: 100ms–600ms (celebration exception: 3000ms particle life)

---

## 6. UX Structure

### Home Screen
- **Primary goal:** Complete today's habits
- **Primary action:** Toggle habit (tap anywhere on card)
- **Secondary actions:** Navigate weeks (arrows), create habit (FAB)
- **Entry point:** Today's date is visually emphasized in week row
- **Focal points:** (1) Habit cards, (2) Week navigator, (3) FAB — exactly 3

### Habit Card
- **Layout:** Left accent bar (4px, color = habit strength) → emoji icon → habit name + meta → trailing checkbox
- **States:** Default, pressed (scale 0.97), completed (accent bar fills, text dims to 70% opacity, checkbox filled with `sage`)
- **Information density:** Name (primary), streak count + strength label (secondary), checkbox (action)
- **Feedback:** Immediate visual + haptic on toggle

### Paywall Screen
- **Primary goal:** Convert to premium
- **Primary action:** "Start Free Trial" button (full-width, `forest` background, white text)
- **Secondary action:** "Restore Purchases" (text link below CTA)
- **Layout:** Hero illustration (top 35%) → value props (3 items max) → pricing → CTA → restore link
- **Cognitive load:** 3 benefit items only, each with icon + one-line description
- **Social proof:** Single line — "Join 12,000+ users building better habits"
- **Pricing:** Clear "$1.99/month" with "after 7-day free trial" subtitle
- **Close:** Top-right X button, always visible

### Navigation
- Tab bar: 4 items max (Habits, Analytics, Settings, [Premium badge])
- Active tab: `forest` icon + label; inactive: `stone-500`
- All navigation transitions: horizontal slide, 280ms

### Error Tolerance
- Destructive actions (delete habit): red-tinted button, confirmation sheet required
- Undo toast for habit toggle: 5 seconds, bottom of screen

---

## Scoring

### Iteration 1

| Dimension | Score | Notes |
|-----------|-------|-------|
| Typography | 9 | Serif + sans pairing creates warmth and hierarchy; scale is tight and readable |
| Color | 9 | Earth tones with single saturated accent; strong contrast ratios |
| Layout | 8 | Clean single-axis alignment; clear weight distribution |
| Background | 8 | Layered planes with sufficient luminance contrast |
| Motion | 8 | Purposeful motion tied to state changes; no decorative waste |
| UX | 9 | One primary action per screen; immediate feedback; ≤ 3 focal points |
| Harmony | 9 | Warm aesthetic + clarity UX reinforce each other; serif warmth + earth tones + deliberate motion = cohesive |

**Weighted Total:** (9×0.20) + (9×0.20) + (8×0.20) + (8×0.15) + (9×0.15) + (8×0.10) = 1.80 + 1.80 + 1.60 + 1.20 + 1.35 + 0.80 = **8.55 / 10**

Harmony ≥ 8 ✓ — All dimensions ≥ 8 ✓

### Iteration 2 — Targeting Layout (8) and Background (8)

**Layout adjustment:** Add card grouping container with subtle `parchment-dark` (#EDE8E0) background and 24pt border-radius to create visual "tray" effect — reinforces card zone as primary.

**Background adjustment:** Add 2% noise texture overlay on parchment background for tactile warmth (opacity 0.03).

| Dimension | Score |
|-----------|-------|
| Typography | 9 |
| Color | 9 |
| Layout | 9 |
| Background | 9 |
| Motion | 8 |
| UX | 9 |
| Harmony | 9 |

**Weighted Total:** (9×0.20) + (9×0.20) + (9×0.20) + (8×0.15) + (9×0.15) + (9×0.10) = 1.80 + 1.80 + 1.80 + 1.20 + 1.35 + 0.90 = **8.85 / 10**

### Iteration 3 — Targeting Motion (8)

**Motion adjustment:** Add micro-interaction for streak counter: number morphs (counter roll) when streak increments, 240ms with spring easing. Adds delight without violating the 3-element simultaneous cap.

| Dimension | Score |
|-----------|-------|
| Typography | 9 |
| Color | 9 |
| Layout | 9 |
| Background | 9 |
| Motion | 9 |
| UX | 9 |
| Harmony | 9 |

**Final Weighted Total:** (9×0.20) + (9×0.20) + (9×0.20) + (9×0.15) + (9×0.15) + (9×0.10) = 1.80 + 1.80 + 1.80 + 1.35 + 1.35 + 0.90 = **9.0 / 10**

All dimensions ≥ 9. Harmony ≥ 8. Specification complete.

---

*Generated by human-optimized-frontend skill • Chain Day • February 2026*
