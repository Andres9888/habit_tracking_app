# Remove drag indicator pill from Settings header

## Context
The settings modal has a small horizontal pill/bar (36×5px) at the top of the header that visually mimics a bottom-sheet drag handle. Since the settings modal is a full-screen `Modal` with `animationType='slide'` and no gesture-based dismissal, this indicator is non-functional and misleading. The user wants it removed.

## Change

**File:** `src/components/SettingsModal/SettingsHeader.tsx` (line 27-35)

Remove the drag indicator `View` wrapper:

```jsx
// REMOVE this block (lines 27-35):
<View className='mb-2 items-center pt-2'>
  <View
    style={{
      backgroundColor: themeColors.border,
      borderRadius: 3,
      height: 5,
      width: 36,
    }}
  />
</View>
```

No other files reference or depend on this element. The `themeColors` import stays (used elsewhere in the file — no, actually it's only used for the drag indicator). Let me check... `themeColors` is destructured at line 19 but only used at line 30 for the drag indicator background. After removal, the `useThemeColors` import and destructuring can also be removed to keep the file clean.

**Summary of edits in `SettingsHeader.tsx`:**
1. Remove `import { useThemeColors } from '../../theme/ThemeContext';` (line 5)
2. Remove `const { colors: themeColors } = useThemeColors();` (line 19)
3. Remove the drag indicator `<View>` block (lines 27-35)

## Verification
- Open the app → tap Settings → confirm the pill bar is gone
- Confirm the "Settings" title and close button still render correctly with proper spacing
