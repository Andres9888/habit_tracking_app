# Plan: Redesign Premium Upgrade Button — Mock 5 (Dark Luxury)

## Context

The current "Upgrade to Premium" button in account settings uses a horizontal layout with a bright gradient, shimmer animation, and pulsing PRO badge. It works but reads as "marketing banner" in a utility screen. Replacing it with Mock 5 (Dark Luxury): a refined, dark card with a subtle top accent line that feels native to the settings page while still drawing attention.

## New Design

```
┌─ thin purple accent line ───────┐
│                                 │
│  👑  PREMIUM                    │
│      Upgrade Your Experience    │
│      Unlock sounds, reminders   │
│      & themes                 › │
│                                 │
└─────────────────────────────────┘
```

- Near-black gradient bg with subtle purple undertone
- 1px top accent line (purple gradient: transparent → violet → transparent)
- Crown icon in dark purple bg (reuses existing `settings.crown` colors)
- "PREMIUM" eyebrow label in violet
- Bold title + muted subtitle
- Chevron right arrow for navigation affordance
- No shimmer, no pulsing badge — clean and confident

## What Changes

**File:** `src/components/SettingsModal/sections/PremiumStatus.tsx` (only the non-premium branch, lines 131–214)

### Layout
- Replace `flex-row` + icon/text/badge with: icon-left + stacked-text (eyebrow + title + subtitle) + chevron-right
- Same `AnimatedPressable` wrapper, same `onUpgrade` callback

### Styling
- **Background**: Dark gradient — dark: `['#1a1520', '#0d0a14']`, light: `['#f5f0ff', '#ede5ff']`
- **Border**: `1px solid` — dark: `#2a2035`, light: `rgba(139,92,246,0.15)`
- **Top accent line**: `position: absolute`, 1px height, gradient `transparent → #a78bfa → transparent`
- **Icon**: `Crown` (already imported) in a dark bg box — reuse `settings.crown` colors
- **Eyebrow**: "PREMIUM" — `text-[10px] font-bold uppercase tracking-[2px]` in violet (`themeColors.status.premium`)
- **Title**: "Upgrade Your Experience" — `text-[16px] font-bold` in light text
- **Subtitle**: "Unlock sounds, reminders & themes" — `text-[12px]` in muted text
- **Chevron**: `ChevronRight` from lucide — muted color

### Remove
- Shimmer animation (shared value, effect, animated style, overlay View + inner LinearGradient)
- PRO badge pulse animation (shared value, effect, animated style, badge View)
- `Zap` icon import (Crown is already imported)
- `interpolate` import from reanimated
- `shimmerOverlay` StyleSheet
- `SHIMMER_DURATION` constant

### Keep Unchanged
- `isPremium === true` branch (lines 81–129)
- Props interface
- Section header wrapper
- `handleManageSubscription`
- All accessibility attributes (update label text to match new title)

### Add
- `ChevronRight` import from lucide-react-native

## Critical Files
- `src/components/SettingsModal/sections/PremiumStatus.tsx` — **only file modified**

## Verification
1. Run the app and navigate to Settings → Account (non-premium user)
2. Dark mode: Card should be near-black with purple accent line, legible text
3. Light mode: Card should be soft lavender with purple accent, legible text
4. Tap the card → paywall/upgrade flow opens (same as before)
5. Premium-active state (crown + "Active" badge + Manage Subscription) unchanged
6. Run `npm run lint:max-lines` — file should be well under 100 lines after removing animations
