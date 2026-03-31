# Archive Habits Modal -- UI Review

**Audited:** 2026-03-23
**Baseline:** Abstract 6-pillar standards (no UI-SPEC.md exists)
**Screenshots:** Not captured (React Native app -- no web renderable dev server for Playwright)
**Component scope:** `src/components/ArchivedHabitsModal/` (18 files)

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Copywriting | 4/4 | Excellent microcopy throughout -- human, specific, contextual |
| 2. Visuals | 3/4 | Strong hierarchy and iconography; MoreVertical icon misleads for delete action |
| 3. Color | 2/4 | 50 unique hardcoded hex values bypass the semantic theme system almost entirely |
| 4. Typography | 3/4 | Reasonable hierarchy but 10+ distinct font sizes instead of the design system's 5-step scale |
| 5. Spacing | 3/4 | Mostly consistent with minor mixing of NativeWind classes and inline style values |
| 6. Experience Design | 4/4 | Full state coverage, haptics, reduced-motion support, accessibility labels, confirmation flows |

**Overall: 19/24**

---

## Top 3 Priority Fixes

1. **50 hardcoded hex colors bypass the theme system** -- Dark mode correctness becomes fragile and any brand pivot requires touching every file -- Replace all inline hex values with semantic tokens from `darkColors`/`lightColors` (e.g., `colors.status.success`, `colors.primary.600`, `colors.gray.200`, `colors.border`) already defined in `src/theme/darkColors.ts`
2. **MoreVertical (three-dot) icon used for a destructive single-action (delete)** -- Users expect a menu; tapping and getting an immediate delete confirmation is surprising -- Replace with `Trash2` icon at 14px in CompactHabitRow line 76, keeping the same hitSlop
3. **10+ font sizes diverge from the 5-step type scale (34/22/17/14/13)** -- Visual inconsistency between this modal and the rest of the app -- Consolidate `fontSize: 10`, `text-[11px]`, `text-[15px]`, `fontSize: 15`, `fontSize: 18`, `fontSize: 32` to the nearest scale stop or add them to the typography system if justified

---

## Detailed Findings

### Pillar 1: Copywriting (4/4)

The copy across this feature is thoughtful and well-crafted:

**CTAs are specific and action-oriented:**
- "Resume This Habit" (hero card) -- verb + object, clear intent
- "Resume" (compact row) -- appropriately condensed for tight layout
- "Upgrade to Resume" -- explains the gate, not just "Upgrade"
- "Delete Forever" / "Delete Permanently" -- escalating language matches severity
- "Delete All Archived" -- scoped and unambiguous

**Confirmation dialogs provide full context:**
- `ArchivedHabitsModal.hooks.ts:50-52`: `Permanently Delete "{habitName}"?` with explanation "This will permanently delete the habit and all its tracking data. This action cannot be undone." -- includes habit name, consequence, and irreversibility
- `ArchivedHabitsModal.hooks.ts:77-78`: Pluralized delete-all message with count
- `useBatchArchiveActions.ts:27-28`: Batch delete uses correct pluralization

**Empty state is encouraging, not dead-end:**
- `EmptyState.tsx:36`: "All Habits Are Active!" -- positive framing
- `EmptyState.tsx:39`: "Swipe left on any habit to archive it for safekeeping" -- teaches the archive gesture
- Includes a "Good to Know" tip card explaining that archiving preserves progress

**Error messages are user-facing quality:**
- `ArchivedHabitsModal.hooks.ts:43`: `Failed to restore "{habitName}". Please try again.` -- names the habit, gives next step
- `ArchivedHabitsModal.hooks.ts:63`: Same pattern for delete failures

**Subtitle copy is warm:**
- `ModalHeader.tsx:35-36`: "1 habit waiting to come back" / "N habits waiting to come back" -- anthropomorphizes habits gently

**No issues found.** No generic "Submit", "OK" (except in the upgrade alert which is appropriate), or "Click Here" patterns.

### Pillar 2: Visuals (3/4)

**Strengths:**
- Clear visual hierarchy: hero card with full stats (AnimatedHabitCard) vs. compact rows (CompactHabitRow) creates a natural focal point
- Strength-based accent bar on the left edge of hero cards provides at-a-glance habit health
- Emoji-based stat badges (fire, checkmark, plant stages) are scannable and culturally recognizable
- Selection mode has clear visual differentiation: green border on selected cards, rounded checkbox with check icon
- Section divider ("Older") with horizontal rule creates clean content grouping
- DangerZoneFooter uses dashed border and red palette to visually segregate destructive actions
- ArchiveSelectionBar uses glass blur (BlurView) and capsule shape consistent with the app's BottomActionBar

**Issues:**
- `CompactHabitRow.tsx:73-76`: The `MoreVertical` (three-dot menu) icon is used for a single-action delete button. Users universally associate three-dot icons with menus containing multiple options. Tapping it and immediately getting a delete confirmation violates expectations. Should use `Trash2` icon instead.
- `SelectionCheckbox.tsx:12`: Checkbox is `absolute right-3 top-3` on hero card but rendered inline at end of row in CompactHabitRow. The positioning inconsistency between the two contexts is minor but noticeable -- the hero card checkbox floats over content while the compact row checkbox sits in flow.
- `HabitCardHeader.tsx:28`: Icon fallback `'(memo icon)'` uses a generic memo icon -- acceptable but could be more contextually relevant (e.g., a habit-specific default).

### Pillar 3: Color (2/4)

This is the weakest pillar. The app has a well-structured semantic color system in `src/theme/darkColors.ts` with tokens for `colors.status.success`, `colors.status.error`, `colors.primary.*`, `colors.gray.*`, `colors.border`, etc. However, the ArchivedHabitsModal uses **50 unique hardcoded hex values** instead of these tokens.

**Token usage vs. hardcoded (approximate):**
- Semantic token references (`colors.text.primary`, `colors.text.secondary`, etc.): ~13 usages
- Hardcoded hex values: ~60+ usages

**Specific violations by category:**

*Green accent colors (should use `colors.primary.*` or `colors.status.success*`)* :
- `#059669` appears 8+ times -- matches `lightColors.primary[600]` exactly
- `#6EE7B7` appears 5+ times -- matches `darkColors.primary[600]` exactly
- `#047857` appears 3 times -- matches `lightColors.primary[700]` exactly
- `#10B981`, `#34D399`, `#064E3B` -- all in the primary scale

*Gray colors (should use `colors.gray.*`)* :
- `#374151` appears 6 times -- is `darkColors.gray[200]` / `darkColors.border`
- `#6B7280` appears 4 times -- is `darkColors.gray[400]`
- `#9CA3AF` appears 4 times -- is `darkColors.gray[500]`
- `#1f2937` appears 4 times -- is `darkColors.gray[100]` / `darkColors.card`

*Red/destructive colors (should use `colors.status.error*`)* :
- `#B53030` in ActionButtons.tsx lines 118, 121, 137 -- not in the theme system at all (the theme uses `#DC2626` for error)
- `#DC2626` in DangerZoneFooter matches `lightColors.status.error`
- `#FCA5A5` matches `darkColors.status.errorText`

*Warm stone/neutral colors (light mode)* :
- `#f5f5f4`, `#e7e5e4`, `#d6d3d1` are Tailwind stone palette values that do not match the app's warm gray tokens (`#F5F1ED`, `#EDEAE5`, `#DDD8D2`)
- This means light mode backgrounds in this modal subtly clash with the rest of the app's warm parchment aesthetic

*Blue info colors:*
- `#1e3a8a`, `#dbeafe`, `#93c5fd`, `#2563eb`, `#1d4ed8` in HabitStatsBadges -- these should use `colors.status.info*`

*Yellow/streak colors:*
- `#78350f`, `#fef3c7`, `#fde68a`, `#b45309` -- should use `colors.status.streak*`

**White card background concern:**
- `AnimatedHabitCard.tsx:61`: Uses `#FFFFFF` for light mode card background, but the app's semantic card color is `#EDEAE5` (warm parchment). This makes the hero card appear stark white against the warm app background.

### Pillar 4: Typography (3/4)

The design system defines a 5-step type scale: 34/22/17/14/13 (with 10 for tab bar). The modal uses these plus several off-scale sizes:

**On-scale sizes (good):**
- `fontSize: 34` -- EmptyState emoji (matches displayLarge)
- `text-2xl` (24px) / `fontSize: 22` -- ModalHeader title, EmptyState heading (near heading1/heading2 at 22px)
- `text-lg` (18px) -- HabitCardHeader name (close to body at 17px)
- `text-sm` (14px) -- StatsSummaryBar count, ModalHeader subtitle (matches bodySmall)
- `text-xs` (12px) / `text-[13px]` (13px) -- badges, captions (matches caption at 13px)

**Off-scale sizes (issues):**
- `fontSize: 10` in `DangerZoneFooter.tsx:37` -- "DANGER ZONE" label. The type scale minimum is 13px (caption). 10px is below WCAG minimum recommended size.
- `text-[11px]` in `SectionDivider.tsx:14` -- "OLDER" section label. Also below the 13px floor.
- `text-[15px]` in `CompactHabitRow.tsx:52` -- habit name in compact row. Falls between bodySmall (14) and body (17), not on scale.
- `fontSize: 15` in `ActionButtons.tsx:85,90,111` -- button text. Design system button text is 17px. This creates an inconsistency with other buttons in the app.
- `fontSize: 18` in `CompactHabitRow.tsx:48` -- emoji in compact row icon. Understandable for emoji sizing but not on scale.
- `fontSize: 32` in `HabitCardHeader.tsx:28` -- hero card emoji. Between heading1 (22) and displayLarge (34).

**Font weight usage:**
- `font-semibold` / `fontWeight: '600'` -- 20 usages (dominant weight)
- `font-medium` / `fontWeight: '500'` -- 3 usages
- `font-bold` / `fontWeight: '700'` -- 2 usages

Weight usage is reasonable. The system allows 400/500/600/700. No weight violations.

**Font family:**
- `EmptyState.tsx:9` correctly references `fontFamilies.primary.text` (DM Sans)
- `ModalHeader.tsx:68` uses `font-serif` class for the title, aligning with Literata for display headings
- Most other text does not explicitly set fontFamily, relying on NativeWind defaults -- this is acceptable in React Native where the system font is the fallback

### Pillar 5: Spacing (3/4)

The design system uses an 8px grid (multiples of 4px): 4/8/12/16/24/32/48/64.

**Grid-compliant spacing:**
- `p-6` (24px) -- hero card padding, matches `spacing.lg`
- `px-5` (20px) -- screen horizontal padding, matches `paddingHorizontal: 20` (between `spacing.base` 16 and `spacing.lg` 24 -- slightly off grid but common for screen margins)
- `px-4` (16px) -- matches `spacing.base`
- `py-3` (12px) -- matches `spacing.md`
- `gap-2` (8px) -- matches `spacing.sm`, used 8 times consistently
- `padding: 16` in DangerZoneFooter, LoadingState -- matches `spacing.base`

**Minor inconsistencies:**
- `gap-1.5` (6px) used 4 times in stat badges -- 6px is not on the 4px grid
- `py-1.5` (6px) used 4 times in badges -- same issue
- `px-3.5` (14px) in CompactHabitRow restore button -- 14px is not on the 4px grid
- `py-1` (4px) in delete confirm buttons matches `spacing.xs`
- `paddingVertical: 64` in EmptyState -- matches `spacing['3xl']`
- `marginLeft: 68` in CompactHabitRow divider -- not on grid, but calculated to align with content after icon+gap (9*4=36 avatar + 12 ml-3 + 20 = 68... functionally correct alignment)

**Positive patterns:**
- LoadingState (`LoadingState.tsx`) correctly imports and uses `spacing` tokens directly
- ArchiveSelectionBar uses `StyleSheet.create` with consistent padding values
- FlatList `contentContainerStyle` properly accounts for safe area insets

### Pillar 6: Experience Design (4/4)

This is the strongest pillar. The feature demonstrates thorough state coverage:

**Loading state:** `LoadingState.tsx` provides skeleton loaders with shimmer animation, 3 placeholder cards with appropriate bone shapes (avatar circle, text blocks, button rows). Uses the centralized `SkeletonLoader` component.

**Empty state:** `EmptyState.tsx` is celebratory ("All Habits Are Active!"), educates about archiving, and includes a helpful tip card. Staggered entrance animations add polish.

**Error handling:**
- All mutations (`handleRestore`, `handlePermanentDelete`, `handleDeleteAll`, `handleBatchRestore`, `handleBatchDelete`) have try/catch blocks with user-facing error alerts
- Error haptic feedback on failure (`triggerHaptic('error')`)
- Restore failures reset `isRestoring` state so users can retry

**Destructive action protection:**
- Single delete requires tap + confirmation ("Are you sure?" inline) or Alert.confirm
- Batch delete shows Alert with count and "Cannot be undone" warning
- Delete All has separate Alert with habit count and irreversibility warning
- All destructive confirmations use `style: 'destructive'` for red button on iOS
- Heavy haptic (`triggerHaptic('heavy')`) precedes destructive prompts

**Animation and motion:**
- Entrance animations: `FadeInDown` for header, staggered card reveals with configurable delay
- Restore success: scale bounce on checkmark icon, then slide-out exit (translateX + opacity + scale)
- `useReduceMotion` hook respected -- skips all animations when system reduce-motion is enabled (`useCardAnimatedStyles.ts:39-43`)
- Selection bar enters with `FadeInUp` spring animation
- EmptyState uses staggered `FadeInUp` on each element (60ms increments)

**Selection mode:**
- Clean enter/exit with haptic feedback on mode transitions
- Visual differentiation: green borders, checkboxes appear, action buttons hide
- Batch action bar with blur glass effect shows selected count
- Disabled state at 35% opacity when nothing selected
- "Select All" / "Deselect All" toggle

**Haptic feedback:** Every interaction has appropriate haptic type:
- `tap` for mode entry, selection toggles, batch restore
- `selection` for individual item toggle
- `heavy` for destructive action prompts
- `success` for completed operations
- `error` for failed operations

**Accessibility:**
- 12 `accessibilityLabel` annotations found across interactive elements
- `accessibilityRole='button'` on all pressable actions
- Dynamic labels include habit names (e.g., `Resume ${habitName}`, `Delete ${habitName}`)
- `hitSlop` on small touch targets (ModalHeader back button, CompactHabitRow delete, SelectionBar buttons)
- Missing: `SelectionCheckbox` has no accessibility label; the compact row Pressable in selection mode has no accessibility hint indicating it toggles selection

---

## Files Audited

| File | Lines |
|------|-------|
| `src/components/ArchivedHabitsModal/ArchivedHabitsModal.tsx` | 107 |
| `src/components/ArchivedHabitsModal/ArchivedHabitsModal.hooks.ts` | 111 |
| `src/components/ArchivedHabitsModal/types.ts` | 41 |
| `src/components/ArchivedHabitsModal/utils.ts` | 89 |
| `src/components/ArchivedHabitsModal/useArchiveSelection.ts` | 47 |
| `src/components/ArchivedHabitsModal/useArchiveSelectionActions.ts` | 37 |
| `src/components/ArchivedHabitsModal/useBatchArchiveActions.ts` | 51 |
| `src/components/ArchivedHabitsModal/components/index.ts` | 12 |
| `src/components/ArchivedHabitsModal/components/AnimatedHabitCard.tsx` | 106 |
| `src/components/ArchivedHabitsModal/components/AnimatedHabitCard.hooks.ts` | 89 |
| `src/components/ArchivedHabitsModal/components/useCardAnimatedStyles.ts` | 91 |
| `src/components/ArchivedHabitsModal/components/HabitCardHeader.tsx` | 46 |
| `src/components/ArchivedHabitsModal/components/HabitStatsBadges.tsx` | 89 |
| `src/components/ArchivedHabitsModal/components/ActionButtons.tsx` | 147 |
| `src/components/ArchivedHabitsModal/components/CompactHabitRow.tsx` | 90 |
| `src/components/ArchivedHabitsModal/components/ModalHeader.tsx` | 92 |
| `src/components/ArchivedHabitsModal/components/StatsSummaryBar.tsx` | 71 |
| `src/components/ArchivedHabitsModal/components/SectionDivider.tsx` | 25 |
| `src/components/ArchivedHabitsModal/components/SelectionCheckbox.tsx` | 21 |
| `src/components/ArchivedHabitsModal/components/ArchiveSelectionBar.tsx` | 107 |
| `src/components/ArchivedHabitsModal/components/EmptyState.tsx` | 60 |
| `src/components/ArchivedHabitsModal/components/DangerZoneFooter.tsx` | 73 |
| `src/components/ArchivedHabitsModal/components/LoadingState.tsx` | 73 |

**Theme reference files:**
- `src/theme/darkColors.ts` (semantic color system)
- `src/theme/spacing.ts` (spacing scale + shadows)
- `src/theme/typography.ts` (type scale + font families)
- `src/theme/ThemeContext.tsx` (theme provider)
