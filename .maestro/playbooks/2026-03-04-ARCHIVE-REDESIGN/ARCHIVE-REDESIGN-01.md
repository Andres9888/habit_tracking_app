# Archive Page Redesign — Phase 1: Summary Pill & Danger Zone

**Design reference:** `.superdesign/design_iterations/archive_page_1.html`

## Context

The archive page in settings is being redesigned to match the warm-minimal aesthetic. This phase moves "Delete All" from the summary bar to a dedicated Danger Zone at the bottom of the list, and simplifies the summary bar to a centered pill.

## Tasks

- [x] **Redesign `StatsSummaryBar` to centered summary pill (remove Delete All button)** _(Completed: removed `onDeleteAll` prop and Delete All button, simplified to centered pill with `justify-center` layout)_

  **File:** `src/components/ArchivedHabitsModal/components/StatsSummaryBar.tsx`

  Remove the `onDeleteAll` prop and the "Delete All" button entirely. Simplify to a centered pill layout:

  ```tsx
  interface StatsSummaryBarProps {
    habitCount: number;
  }

  export function StatsSummaryBar({ habitCount }: StatsSummaryBarProps) {
    // Return null if habitCount === 0 (keep existing behavior)
    // Change className to center content: 'mb-4 flex-row items-center justify-center rounded-xl px-4 py-3 gap-2'
    // Keep the 📦 emoji and "{n} archived habit(s)" text
    // Remove the conditional Delete All button entirely
    // Keep the same isDark background colors
  }
  ```

- [x] **Create `DangerZoneFooter` component for bulk delete action** _(Completed: component already existed from prior commit 9e74cc23b — verified all design specs match: dashed border, danger colors, DANGER ZONE label, AnimatedPressable delete button with Trash2 icon, subtitle with count, 73 lines ≤100)_

  **New file:** `src/components/ArchivedHabitsModal/components/DangerZoneFooter.tsx`

  Create a footer component that renders below the FlatList with a dashed-border danger zone section. Only shown when habitCount > 1.

  ```tsx
  interface DangerZoneFooterProps {
    habitCount: number;
    onDeleteAll: () => void;
  }
  ```

  Design specs (from mockup):
  - Outer container: `marginTop: 12, padding: 16, borderRadius: 16, borderWidth: 1, borderStyle: 'dashed'`
  - Light: `backgroundColor: '#FEF2F2', borderColor: '#FECACA'`
  - Dark: `backgroundColor: '#7F1D1D', borderColor: '#991B1B'`
  - "DANGER ZONE" label: uppercase, 11px, font-weight 600, letter-spacing 0.5, `color` matches danger text, opacity 0.6
  - Delete All button: `AnimatedPressable`, flex-row centered, gap-8, full width, 12px padding, rounded-xl
    - Use `Trash2` icon from lucide-react-native (size 16)
    - Text: "Delete All Archived", 14px, font-weight 600, danger text color
    - Light danger text: `#DC2626`, dark: `#FCA5A5`
  - Subtitle below button: "Permanently remove {n} habits and all tracking data", 12px, text-secondary color
  - Keep file ≤100 lines

  Export from `src/components/ArchivedHabitsModal/components/index.ts` by adding `export { DangerZoneFooter } from './DangerZoneFooter';`

- [x] **Wire DangerZone into `ArchivedHabitsModal` as FlatList footer, remove `onDeleteAll` from `StatsSummaryBar`** _(Already implemented in commit 9e74cc23b — DangerZoneFooter imported, StatsSummaryBar simplified, ListFooterComponent wired with conditional rendering, file is 81 lines)_

  **File:** `src/components/ArchivedHabitsModal/ArchivedHabitsModal.tsx`

  Changes:
  1. Import `DangerZoneFooter` from `./components`
  2. Remove `onDeleteAll` prop from `<StatsSummaryBar>` (it no longer accepts it)
  3. Add `ListFooterComponent` to the `<FlatList>`:
     ```tsx
     ListFooterComponent={
       archivedHabits.length > 1 ? (
         <DangerZoneFooter
           habitCount={archivedHabits.length}
           onDeleteAll={handleDeleteAll}
         />
       ) : undefined
     }
     ```
  4. Verify the file stays ≤100 lines
