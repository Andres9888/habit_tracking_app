# Settings Page UX Audit — Implementation Plan

## Context
The settings page has accumulated inconsistencies: close buttons vary in visual style across modals, the sort picker navigates away from settings unnecessarily, some labels use developer jargon, and section ordering could be improved. This plan addresses all of these to make settings feel polished and cohesive.

---

## Change 1: Inline Sort Picker (instead of navigating away)

**Current behavior:** Tapping "Sort Order" closes settings → 350ms delay → opens SortBottomSheet as a separate modal.

**New behavior:** Tapping "Sort Order" switches to an inline sort view within the settings modal (like Archived Habits already does).

**Key discovery:** The hooks already support `view: 'sort'` (line 30 of `SettingsModal.hooks.ts`), and an inline `SortPicker.tsx` already exists in the SettingsModal directory but was never wired up.

### Files to modify:

**`src/components/SettingsModal/SettingsModal.tsx`**
- Add a `view === 'sort'` branch (similar to the `view === 'archived'` branch at line 68)
- Render `SortPicker` with `onBack={() => setView('settings')}` and `onSelect` wired to `setHabitSortMode`
- Remove the `handleOpenSortSheet` callback that closes settings and delays
- Change `onOpenSortPicker` to `() => setView('sort')`
- Remove `onOpenSortSheet` prop dependency

**`src/components/SettingsModal/SettingsModal.hooks.ts`**
- `setHabitSortMode` is already defined (line 105) — just need to expose/use it

**`src/components/SettingsModal/SortPicker.tsx`**
- Already exists and works — update its header to use `ModalCloseButton` on right + `ArrowLeft` back on left (matching ArchivedHabitsModal pattern)
- It uses `SettingsModal.hooks.ts` view state `'sort'` — already supported

**`src/features/habits/components/HabitsModals/SettingsModalSection.tsx`**
- Remove `openSortSheet`/`closeSortSheet`/`showSortSheet` props from SettingsModal
- Remove `SortBottomSheet` rendering (no longer needed from settings flow)
- NOTE: Check if SortBottomSheet is used elsewhere before removing. If it's only triggered from settings, it can be removed entirely.

**`src/components/SettingsModal/types.ts`**
- Remove `onOpenSortSheet` from `SettingsModalProps`
- Add `onSortModeChange` prop to `SettingsContentProps` (or pass through existing `habitSortMode` setter)

---

## Change 2: Move Sort Order from Data to Preferences

**`src/components/SettingsModal/SettingsContent.tsx`**
- Move the Sort Order `SettingsRow` (lines 151-162) from the Data section to the end of the Preferences section
- Update `showBorder` props: the current last Preferences item ("Play sound on habit completion") should get `showBorder={true}`, and Sort Order should get `showBorder={false}` as the new last item
- Data section now only has Export and Archived Habits

---

## Change 3: Copy Improvements + Subtitle Support

### Add subtitle support to SettingsRow
**`src/components/SettingsModal/SettingsRow.tsx`**
- Add optional `subtitle?: string` prop to `SettingsRowProps`
- Render subtitle below the label in a smaller, secondary-colored text when present
- Wrap label + subtitle in a `View` with `flex-1`

### Update labels
**`src/components/SettingsModal/SettingsContent.tsx`**
| Current | New label | New subtitle |
|---------|-----------|-------------|
| "Use checkmark (off = chain link)" | "Completion icon" | "Choose between checkmark and chain link" |
| "Gradient fill for habit strength" | "Gradient streak fill" | — |
| "Sticky calendar header" | "Pin calendar header" | — |

---

## Change 4: Unify Close Buttons

Replace raw `Pressable` + `X` with `ModalCloseButton` in form modals (keeping LEFT position).

**`src/components/CreateHabitModal/components/ModalHeader/ModalHeader.tsx`**
- Replace lines 42-52 (raw `Pressable` with transparent bg) with `<ModalCloseButton onClose={handleClose} label="Close" />`
- Keep it on the LEFT side

**`src/screens/HabitEditScreen/EditHeader.tsx`**
- Replace lines 57-64 (raw `Pressable`) with `<ModalCloseButton onClose={handleCancel} label="Cancel" />`
- Keep it on the LEFT side

---

## Change 5: Differentiate Legal Icons

**`src/components/SettingsModal/sections/LegalLinks.tsx`**
- Privacy Policy: change `ExternalLink` → `Shield` (from lucide-react-native)
- Terms of Service: change `ExternalLink` → `FileText` (from lucide-react-native)

---

## Verification

1. **Inline sort picker:** Open Settings → tap Sort Order → sort picker slides in within settings modal → tap a sort mode → it selects → tap back arrow → returns to settings → current sort label updated
2. **Section order:** Preferences section ends with Sort Order row → Data section has only Export and Archived
3. **Copy:** "Completion icon" with subtitle visible, "Gradient streak fill", "Pin calendar header"
4. **Close buttons:** Open Create Habit → X button has filled circle background with spring animation (matches Settings X). Same for Edit screen.
5. **Legal icons:** Privacy Policy has shield icon, Terms has document icon
6. **Dark mode + high contrast:** Verify all changes look correct in both modes
7. **Sort bottom sheet:** Verify it's not broken if used elsewhere (check if any other entry point triggers it)
