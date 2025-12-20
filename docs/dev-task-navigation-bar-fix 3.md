# Development Task: Fix Navigation Bar Safe Area

**Task ID:** DEV-001
**Created:** 2025-11-01
**Assigned to:** Jane
**Project:** My Project
**Priority:** Medium
**Estimated Time:** 2-5 minutes

---

## Task Overview

Fix navigation bar in Habit Detail screen to respect safe area insets (notch/status bar), preventing content from being cut off on devices with notches.

**Reference:** `/docs/tech-spec.md`

---

## Prerequisites

- [ ] Development environment is set up and running
- [ ] Metro bundler is started (`npm start` or `yarn start`)
- [ ] iOS simulator/device is available for testing
- [ ] Current codebase is on latest version

---

## Implementation Steps

### Step 1: Locate the File

**Action:** Open `src/screens/HabitDetailScreen.tsx` in your editor

```bash
code src/screens/HabitDetailScreen.tsx
```

### Step 2: Find Navigation Bar Component

**Action:** Navigate to lines 396-403 or search for `{/* Navigation Bar */}`

**Current code:**
```typescript
{/* Navigation Bar */}
<View
  style={[
    styles.navigationBar,
    {
      borderBottomColor: theme.custom.colors.gray[200],
      borderBottomWidth: 1,
    },
  ]}
>
```

### Step 3: Add Safe Area Padding

**Action:** Add `paddingTop: insets.top,` to the inline style object

**Modified code:**
```typescript
{/* Navigation Bar */}
<View
  style={[
    styles.navigationBar,
    {
      paddingTop: insets.top,  // ← ADD THIS LINE
      borderBottomColor: theme.custom.colors.gray[200],
      borderBottomWidth: 1,
    },
  ]}
>
```

**Important:**
- Place the new line BEFORE `borderBottomColor`
- Include the comma at the end
- Match existing indentation (6 spaces or 3 tabs)

### Step 4: Save the File

**Action:** Save changes with `Ctrl+S` (Windows/Linux) or `Cmd+S` (macOS)

### Step 5: Verify Hot Reload

**Action:** The development server should automatically reload. If not:
- Press `r` in Metro bundler terminal
- Or shake device/simulator and select "Reload"

---

## Testing Checklist

### Visual Verification

**On iPhone with notch (iPhone X or newer):**
- [ ] Navigate to any habit in the app
- [ ] Tap on the habit to open Habit Detail screen
- [ ] Verify navigation bar starts below the status bar/notch
- [ ] Verify "Habit Detail" heading is fully visible
- [ ] Verify close button (X) is fully visible and tappable
- [ ] Verify all action buttons in header are accessible

**On iPhone without notch (iPhone SE, iPhone 8):**
- [ ] Test same flow
- [ ] Verify layout still looks correct with standard status bar
- [ ] Verify no extra spacing issues

**Landscape Orientation:**
- [ ] Rotate device to landscape
- [ ] Verify safe area adapts correctly
- [ ] Verify navigation bar still properly positioned

### Regression Testing

- [ ] Test other screens with navigation bars
- [ ] Verify no other screens are affected by this change
- [ ] Test ScrollView content scrolls properly
- [ ] Verify content area fills remaining space correctly

---

## Expected Results

**Before Fix:**
- Navigation bar renders under status bar/notch
- "Habit Detail" heading partially obscured
- Close button (X) cut off at top

**After Fix:**
- Navigation bar starts below safe area
- All content fully visible
- Interactive elements accessible
- Design adapts to different devices

---

## Troubleshooting

### Issue: Hot reload didn't work
**Solution:**
```bash
# Full reload in Metro terminal
Press 'r'
# or in iOS simulator
Cmd+R
```

### Issue: TypeScript error about `insets`
**Solution:**
- Verify `const insets = useSafeAreaInsets();` exists on line 302
- Verify import exists on line 18: `import { useSafeAreaInsets } from 'react-native-safe-area-context';`

### Issue: Still cut off on device
**Solution:**
- Check for typo: `insets.top` not `inset.top`
- Verify comma at end of line
- Check indentation matches surrounding code

---

## Completion Criteria

- [x] Code change implemented (single line added)
- [ ] Visual verification passed on device with notch
- [ ] Visual verification passed on device without notch
- [ ] Landscape orientation tested
- [ ] No regression issues found
- [ ] Code committed to version control
- [ ] Task marked as complete

---

## Technical Notes

**Why this works:**
- `useSafeAreaInsets()` hook already imported and called (line 302)
- Returns top safe area inset in pixels (~47-59px on notched devices, ~20px on standard devices)
- `paddingTop` extends navigation bar background into safe area (better than `marginTop` which would leave a gap)
- Combined with existing `paddingVertical: 12` from `styles.navigationBar`

**Performance:**
- Zero performance impact
- No re-renders triggered (insets calculated once on mount)
- No animation or layout thrashing

---

## Next Steps After Completion

1. **Commit the change:**
   ```bash
   git add src/screens/HabitDetailScreen.tsx
   git commit -m "fix: add safe area padding to navigation bar in HabitDetailScreen"
   ```

2. **Optional:** Take screenshots for documentation
3. **Optional:** Update any related UI tests if they exist

---

**Status:** ⏳ Ready to implement
**Last Updated:** 2025-11-01
