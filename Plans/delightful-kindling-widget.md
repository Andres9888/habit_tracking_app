# Settings Page Redesign — Implementation Plan

## Context

The settings page currently works but has UX issues: an 8-item "Preferences" mega-section mixes visual and functional settings, there's no user identity anchor, destructive actions (Sign Out, Delete Account) sit alongside benign ones, and the section organization doesn't match users' mental models. This redesign reorganizes settings based on UX principles (Miller's Law, Hick's Law, Jakob's Law, Serial Position Effect) to improve findability, reduce cognitive load, increase premium conversion, and create a more polished experience.

**Mockup:** `.superdesign/design_iterations/settings_redesign_1.html`

## Changes Summary

1. **Add Profile Card** at top (avatar, name, email, premium badge, chevron → account sub-screen)
2. **Split "Preferences"** into **Appearance** (4 items) + **Behavior** (3 items)
3. **Extract "Data" section** — Archived Habits gets its own section
4. **Add nested reminder time** — indented under Streak Reminders toggle with tinted background
5. **Create "Support" section** — Rate, Share, Feedback, What's New grouped together
6. **Restructure "About"** — Privacy, Terms, Version, + muted Delete Account as last row
7. **Apple-style Sign Out** — centered red text in standalone card at the very bottom
8. **Add drag indicator** at top of modal (sheet presentation affordance)

## Files to Modify

### Primary (settings components)

| File | Change |
|------|--------|
| `src/components/SettingsModal/SettingsContent.tsx` | Restructure sections: Profile → Appearance → Behavior → Data → Notifications → Support → About → Sign Out card |
| `src/components/SettingsModal/SettingsHeader.tsx` | Add drag indicator bar above header |
| `src/components/SettingsModal/SettingsSection.tsx` | No changes needed — reuse as-is |
| `src/components/SettingsModal/SettingsRow.tsx` | No changes needed — reuse as-is (all 4 row types already exist) |
| `src/components/SettingsModal/AccountSection.tsx` | Refactor — extract sign out/delete from here, keep only the handlers |
| `src/components/SettingsModal/SettingsModal.tsx` | Pass new props for profile card |
| `src/components/SettingsModal/types.ts` | Add profile-related props to SettingsContentProps |

### New Components (small, focused)

| File | Purpose |
|------|---------|
| `src/components/SettingsModal/ProfileCard.tsx` | Avatar + name + email + premium badge + chevron |
| `src/components/SettingsModal/sections/SupportSection.tsx` | Rate, Share, Feedback, What's New rows |
| `src/components/SettingsModal/sections/SignOutCard.tsx` | Centered red text card with confirmation alert |

### Files to Preserve (no changes)

- `SettingsRow.tsx` — all 4 row types (toggle, navigation, selection, info) already cover every need
- `SettingsRow.colors.ts` — color system works as-is
- `SettingsSection.tsx` — section container with title works as-is
- `SortPicker.tsx` — sub-screen navigation unchanged
- `StreakRemindersSection.tsx` — only change: add nested indent style for reminder time row
- `SoundPicker.tsx` — inline picker unchanged
- `settingsColors.ts` — icon colors already defined for all settings

### Integration Points

| File | Change |
|------|--------|
| `src/features/habits/components/HabitsModals/SettingsModalSection.tsx` | Pass user info (name, email, isPremium) to SettingsModal |
| `src/features/habits/components/HabitsModals/HabitsModals.tsx` | No changes expected |

## Implementation Steps

### Step 1: Add drag indicator to SettingsHeader
- Add a 36×5px rounded pill above the title
- Color: `themeColors.border` (adapts to dark mode)
- 8px padding above, 4px below

### Step 2: Create ProfileCard component
- New file: `ProfileCard.tsx` (≤60 lines)
- Uses `useUser()` from Clerk for name/email
- Uses `isPremium` prop for badge
- Avatar: first letter of name, gradient background
- Chevron on right (future: tap → account management sub-screen)
- Wrap in existing `card` shadow/rounded style from SettingsSection

### Step 3: Restructure SettingsContent sections
This is the main change. Reorder the existing `<SettingsSection>` + `<SettingsRow>` components:

**Appearance section** (new name, existing rows):
- Compact habit cards (toggle) — from Preferences
- Circular day markers (toggle) — from Preferences
- Gradient streak fill (toggle) — from Preferences
- Completion icon (selection) — from Preferences

**Behavior section** (new name, existing rows):
- Sort Order (selection) — from Preferences
- Completion sound (toggle) + SoundPicker — from Preferences
- Pin calendar header (toggle) — from Preferences

**Data section** (new):
- Archived Habits (navigation + badge) — from Preferences

**Notifications** — keep StreakRemindersSection as-is, add indent style to reminder time row:
- padding-left: 64px on the time row
- subtle background tint (#fafaf9 light / darker in dark mode)

### Step 4: Create SupportSection
- New file: `sections/SupportSection.tsx` (≤50 lines)
- Move Rate, Share, Feedback, What's New from AccountSection
- Each is a navigation-type SettingsRow with existing icon colors
- Reuse handlers from current AccountSection (handleRateApp, handleShare, etc.)

### Step 5: Restructure About section
- Keep: Privacy Policy, Terms of Service, Version info
- Add: Delete Account as last row (muted gray, navigation type)
  - Icon: trash-2, color: `#d4d4d4` light / `#525252` dark
  - Icon bg: `#f5f5f4` light / `#1c1c1c` dark
  - Label color: `themeColors.text.tertiary` or equivalent muted color
  - onPress: existing `handleDeleteAccount` with Alert.alert confirmation

### Step 6: Create SignOutCard
- New file: `sections/SignOutCard.tsx` (≤30 lines)
- Centered text, red color (#ef4444), 600 weight
- Card style matching SettingsSection (rounded-2xl, shadow)
- onPress: existing `handleSignOut` with Alert.alert confirmation
- AnimatedPressable with scale feedback

### Step 7: Refactor AccountSection
- Remove sign out button, delete account, rate, share, feedback, what's new
- Keep only: AccountInfo (email display) — or remove entirely if ProfileCard replaces it
- Move handlers (handleSignOut, handleDeleteAccount, handleRateApp, handleShare, etc.) up to SettingsModalSection.tsx or keep as hooks

### Step 8: Wire everything together in SettingsContent
Final render order:
```
<ProfileCard />
<SettingsSection title="Appearance"> ... </SettingsSection>
<SettingsSection title="Behavior"> ... </SettingsSection>
<SettingsSection title="Data"> ... </SettingsSection>
<StreakRemindersSection />
<SupportSection />
<SettingsSection title="About"> ... + Delete Account row </SettingsSection>
<SignOutCard />
```

### Step 9: Dark mode verification
- All existing color tokens from `settingsColors.ts` already support dark mode
- New components (ProfileCard, SignOutCard) must use `useThemeColors()`
- Test both modes

## File Size Compliance

All new files target ≤60 lines per the 100-line max-lines ESLint rule:
- `ProfileCard.tsx` — ~50 lines
- `SupportSection.tsx` — ~45 lines
- `SignOutCard.tsx` — ~25 lines
- `SettingsContent.tsx` — will likely stay under 200 lines but has existing eslint-disable; can be decomposed further if needed

## Verification

1. **Visual match**: Open the app, navigate to Settings, compare against `.superdesign/design_iterations/settings_redesign_1.html`
2. **Section order**: Profile → Appearance → Behavior → Data → Notifications → Support → About → Sign Out
3. **All toggles work**: Compact, Circular, Gradient, Sound, Calendar Header, Streak Reminders
4. **All navigation works**: Sort Order → SortPicker, Archived → ArchivedHabitsModal, Rate/Share/Feedback/What's New
5. **Delete Account**: Tap shows confirmation Alert, cancel returns to settings
6. **Sign Out**: Tap shows confirmation Alert, confirming signs out
7. **Dark mode**: All sections render correctly in dark mode
8. **Animations**: Staggered FadeInDown on each section (existing pattern)
9. **Drag indicator**: Visible at top of modal
10. **Lint**: `npm run lint:max-lines` passes — no new violations
11. **Run on device**: `npx expo start` and test on iOS simulator
