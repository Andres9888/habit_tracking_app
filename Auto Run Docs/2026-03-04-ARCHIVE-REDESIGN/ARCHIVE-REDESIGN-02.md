# Archive Page Redesign — Phase 2: Card Visual Refresh

**Design reference:** `.superdesign/design_iterations/archive_page_1.html`

## Context

Update the habit cards with filled action buttons (instead of bordered), and pass the strength-based gradient color to the accent bar in the card header. These changes make the cards feel more polished and consistent with the warm-minimal aesthetic.

## Tasks

- [x] **Update `ActionButtons` to use filled background buttons instead of bordered style**

  **File:** `src/components/ArchivedHabitsModal/components/ActionButtons.tsx`

  Change the restore and delete buttons from `border-2` outline style to filled backgrounds:

  **Restore button changes:**
  - Default state: `backgroundColor: isDark ? 'rgba(5,150,105,0.12)' : '#ECFDF5'`, `borderColor: isDark ? 'rgba(5,150,105,0.2)' : '#D1FAE5'`, border-width 1 (not 2)
  - Text color: `isDark ? '#6EE7B7' : '#059669'` (green in both themes)
  - Change text from uppercase "RESTORE" to title-case "Restore", `fontSize: 13, fontWeight: '600'`
  - Replace the `↩` text emoji with `RotateCcw` icon from lucide-react-native (size 15, same green color)

  **Delete button changes:**
  - Default state: `backgroundColor: isDark ? 'rgba(220,38,38,0.1)' : '#FEF2F2'`, `borderColor: isDark ? 'rgba(220,38,38,0.2)' : '#FECACA'`, border-width 1
  - Text color: `isDark ? '#FCA5A5' : '#DC2626'`
  - Change text from uppercase "DELETE" to title-case "Delete", `fontSize: 13, fontWeight: '600'`
  - Replace the `🗑` emoji with `Trash2` icon from lucide-react-native (size 15, same red color)

  **Success state (restore complete):** Keep existing success animation logic, just update colors to match new green scheme.

  Keep `tracking-wide` removed (no longer uppercase). Keep file ≤100 lines.

- [x] **Update `HabitCardHeader` to accept and display a strength-colored accent bar**

  **File:** `src/components/ArchivedHabitsModal/components/HabitCardHeader.tsx`

  Add `accentColor` prop (string) to the interface:

  ```tsx
  interface HabitCardHeaderProps {
    name: string;
    icon?: string;
    iconColor?: string;
    archiveDate: number;
    accentColor: string; // NEW — strength-based gradient color
  }
  ```

  Replace the current accent bar that uses `iconColor || '#6366F1'` with the new `accentColor` prop:

  ```tsx
  <View
    className='absolute bottom-0 left-0 top-0 w-1 rounded-full'
    style={{ backgroundColor: accentColor }}
  />
  ```

  This makes the left accent bar reflect the habit's strength level (purple for automatic, emerald for strong, etc.) instead of the habit's icon color.

- [x] **Update `AnimatedHabitCard` to pass `gradientColor` as `accentColor` to `HabitCardHeader`**

  **File:** `src/components/ArchivedHabitsModal/components/AnimatedHabitCard.tsx`

  The `gradientColor` variable is already computed from `getStrengthGradientColor(strength)`. Simply pass it to `HabitCardHeader`:

  ```tsx
  <HabitCardHeader
    accentColor={gradientColor} // ADD this prop
    archiveDate={archiveDate}
    icon={habit.icon}
    iconColor={habit.iconColor}
    name={habit.name}
  />
  ```

  No other changes needed in this file.
