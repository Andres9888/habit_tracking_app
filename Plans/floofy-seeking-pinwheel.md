# Reorder Settings Preferences

## Context
The Preferences section items are in a somewhat random order, and the "Data" section contains only one item (Archived Habits), creating unnecessary visual weight. Reordering by impact/frequency and merging the lone Data item into Preferences will create a tighter, more intuitive settings screen.

## Changes

### 1. Reorder items within Preferences section
**File:** `src/components/SettingsModal/SettingsContent.tsx`

Reorder the `<SettingsRow>` components inside the Preferences `<SettingsSection>` from:

1. Completion icon
2. Compact habit cards
3. Circular day markers
4. Gradient streak fill
5. Pin calendar header
6. Play sound on habit completion
7. Sort Order

To:

1. **Sort Order** — most actionable, changes entire habit list arrangement
2. **Compact habit cards** — biggest visual impact, changes layout density
3. **Completion icon** — visible on every card interaction
4. **Play sound on completion** — interaction feedback toggle
5. **Pin calendar header** — calendar behavior tweak
6. **Circular day markers** — calendar visual tweak
7. **Gradient streak fill** — most subtle visual enhancement

### 2. Merge "Data" section into Preferences
**File:** `src/components/SettingsModal/SettingsContent.tsx`

- Move the "Archived Habits" `<SettingsRow>` to the end of the Preferences section (after Gradient streak fill), as item #8
- Remove the standalone `<Animated.View entering={anim(120)}>` Data section wrapper
- Set `showBorder={false}` on Gradient streak fill row (since it's no longer last) → actually, Archived Habits becomes the new last item and already has `showBorder={false}`, so set `showBorder` back to default (true) on Gradient streak fill

### 3. Fix animation delays
**File:** `src/components/SettingsModal/SettingsContent.tsx`

After removing the Data section, the animation delays shift:
- Preferences: `anim(0)` (unchanged)
- Notifications: `anim(60)` (unchanged)
- ~~Data: `anim(120)`~~ (removed)
- AccountSection stagger starts at 0 internally (unchanged)
- About: `anim(240)` → `anim(180)` (shift up since Data is gone)

## Files Modified
- `src/components/SettingsModal/SettingsContent.tsx` — reorder rows, merge Data section

## Verification
1. Open the app → Settings modal
2. Confirm Preferences section shows items in new order: Sort Order, Compact, Completion icon, Sound, Pin calendar, Circular markers, Gradient, Archived Habits
3. Confirm "Data" section no longer appears as a standalone section
4. Confirm stagger animations still cascade smoothly
5. Confirm Archived Habits row still shows count badge and navigates correctly
