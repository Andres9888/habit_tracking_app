# InlineHint H4 — Component Spec

> **Mock:** `.superdesign/design_iterations/inline_hint_h4_mock_1.html`
> **Status:** Implemented
> **Last validated:** 2026-02-23

---

## 1. Overview

The InlineHint is a secondary CTA group on the empty habits screen. It appears below the main "Start tracking" button, separated by an "or explore" divider. It offers two actions:

1. **Browse templates** — gradient emerald button (primary CTA)
2. **Build my own** — card with accent stripe (secondary CTA)

---

## 2. Component Tree

```
ActionSection
└─ Animated.View (keyboard hide/show)
   └─ AnimatedEntrance (fade-in-up, delay: 400ms)
      └─ InlineHint
         ├─ InlineHintDivider ("or explore")
         └─ actions-column (gap: 8)
            ├─ Animated.View (press scale + entrance Y)
            │  └─ Pressable → LinearGradient (Browse templates)
            └─ Animated.View (press scale + entrance Y)
               └─ Pressable (Build my own + accent stripe)
```

---

## 3. Visual Spec

### 3a. Divider

| Property | Value |
|----------|-------|
| Line height | 0.5px |
| Line color (light) | `#E7E5E4` (stone-200) |
| Line color (dark) | theme `border` |
| Text | "or explore" |
| Text size | 13px, weight 500 |
| Text color (light) | `textSecondary` |
| Text color (dark) | `textSecondary` |
| Gap (line–text) | 10px |
| Bottom margin | 10px |

### 3b. Browse Templates Button

| Property | Light | Dark |
|----------|-------|------|
| Height | 52px | 52px |
| Border radius | 14px | 14px |
| Gradient direction | 110deg | 110deg |
| Gradient stops | `#047857` → `#059669` → `#10B981` | `rgba(4,120,87,0.85)` → `rgba(5,150,105,0.85)` → `rgba(16,185,129,0.85)` |
| Shadow color | `#047857` | `#047857` |
| Shadow offset | 0, 4 | 0, 4 |
| Shadow radius | 16 | 16 |
| Shadow opacity | 0.3 (rest) / 0.15 (pressed) | 0.3 / 0.15 |
| Emoji | 📚 (18px) | same |
| Label | "browse templates" — 14px, weight 700, white, tracking -0.2 | same |
| Badge bg | `rgba(255,255,255,0.22)` | same |
| Badge text | "200+" — 11px, weight 800, white | same |
| Badge radius | 8px | same |
| Badge padding | 3px × 9px | same |
| Inner padding | 0 18px (horizontal) | same |
| Inner gap | 10px | same |

### 3c. Build My Own Card

| Property | Light | Dark |
|----------|-------|------|
| Height | 44px | 44px |
| Border radius | 12px | 12px |
| Background | `#FFFFFF` | `#1F2937` (gray-800) |
| Background (pressed) | `#F5F5F4` (stone-100) | `#283548` |
| Border | 1px `#E7E5E4` (stone-200) | 1px `#374151` (gray-700) |
| Shadow | 0 1px 3px rgba(0,0,0,0.06) | 0 1px 3px rgba(0,0,0,0.2) |
| Accent stripe width | 3.5px | 3.5px |
| Accent stripe color | `#6EE7B7` (emerald-300) | `#34D399` (emerald-400) |
| Accent stripe position | absolute, left: 0, full height | same |
| Emoji | ✏️ (18px) | same |
| Label | "Build my own" — 13px, weight 600, `#44403C`, tracking -0.1 | 13px, weight 600, `#d1d5db` |
| Arrow | "→" — 13px, `#A8A29E` | 13px, `#6b7280` |
| Inner padding | left 16, right 14 | same |
| Inner gap | 10px | same |

### 3d. Layout

| Property | Value |
|----------|-------|
| Container margin-top | 16px |
| Container width | 100%, alignSelf: stretch |
| Actions column gap | 8px |
| Max width (parent) | 343px (set on ActionSection parent) |

---

## 4. Animation Spec

### 4a. Entrance

| Animation | Config |
|-----------|--------|
| Wrapper (AnimatedEntrance) | Fade: 0→1, TranslateY: +20→0, spring (stiffness 150, damping 18, mass 1), delay 300ms |
| Templates CTA | TranslateY: +12→0, spring (stiffness 150, damping 18, mass 1) |
| Build My Own CTA | Same as templates, +100ms stagger delay |
| Reduced motion | All values snap immediately, no animation |

### 4b. Press Interaction

| Animation | Config |
|-----------|--------|
| Scale down | 1.0 → 0.97 (spring: stiffness 150, damping 18) |
| Scale up | 0.97 → 1.0 (same spring) |
| Opacity | Templates button: 1.0 → 0.85 on press (via Pressable style) |

### 4c. Keyboard Behavior

| State | Effect |
|-------|--------|
| Keyboard visible | InlineHint animates to maxHeight: 0, opacity: 0 (hidden) |
| Keyboard hidden | Animates back to maxHeight: 200, opacity: 1 |
| Transition | Easing.out(Easing.ease), duration from KEYBOARD_LAYOUT config |

---

## 5. Haptics

| CTA | Haptic Type |
|-----|-------------|
| Browse templates | `tap` (light) |
| Build my own | `selection` (medium) |

---

## 6. Accessibility

| Property | Browse Templates | Build My Own |
|----------|-----------------|--------------|
| Role | `button` | `button` |
| Label | "Browse habit templates" | "Create custom habit" |
| Hint | "Opens screen with pre-made habit templates" | "Opens full habit creation screen" |
| Keyboard visible | `accessibilityElementsHidden: true` | same |

---

## 7. File Map

| File | Purpose |
|------|---------|
| `InlineHint.tsx` | Main component (orchestration, ~100 lines) |
| `InlineHint.styles.ts` | All static styles + dynamic style functions |
| `InlineHint.hooks.ts` | Press animations, entrance stagger, haptics |
| `InlineHintDivider.tsx` | "or explore" divider sub-component |
| `useEmptyStateColors.ts` | Theme-aware color definitions (light/dark) |
| `ActionSection.tsx` | Parent wrapper (keyboard hiding, max-width) |
| `AnimatedEntrance.tsx` | Reusable fade-in-up animation wrapper |
| `useKeyboardLayoutAnimations.ts` | Keyboard show/hide layout transitions |
| `animations.ts` | Barrel re-export of all animation configs |
| `types.ts` | TypeScript interfaces (`InlineHintProps`) |

---

## 8. Color Token Reference

| Token | Light | Dark | Source |
|-------|-------|------|--------|
| `gradientColors` | `['#047857','#059669','#10B981']` | `['rgba(4,120,87,0.85)','rgba(5,150,105,0.85)','rgba(16,185,129,0.85)']` | `useEmptyStateColors` |
| `accentStripeColor` | `#6EE7B7` | `#34D399` | `useEmptyStateColors` |
| `buildMyOwnCardBg` | `#FFFFFF` | `#1F2937` | `useEmptyStateColors` |
| `buildMyOwnCardBgPressed` | `#F5F5F4` | `#283548` | `useEmptyStateColors` |
| `ctaText` | `#ffffff` | `#ffffff` | `useEmptyStateColors` |
| `textSecondary` | theme dependent | theme dependent | `useEmptyStateColors` |
| `textTertiary` | theme dependent | theme dependent | `useEmptyStateColors` |
| `inputBorder` | `#E7E5E4` | theme `border` | `useEmptyStateColors` |
