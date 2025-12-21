# Bug: Customize Modal Opens as Small Bottom Sheet

## Status: FIXED

## Problem
When tapping "Customize First →" from the FullsizeTemplatePreview, the TemplatePreviewModal (customize modal) opens as a **small bottom sheet** instead of a **fullscreen modal**.

This creates a jarring UX where the user goes from:
1. Fullsize preview (fullscreen) →
2. Customize modal (small bottom sheet) ❌

The customize modal should also be fullscreen for consistency.

---

## Current Behavior

**File**: `src/screens/templates/TemplatePreviewModal.tsx`
**Line 114**:
```tsx
<Modal
  disableBackdropClose={isImporting}
  variant='bottomSheet'  // ❌ Wrong variant
  visible={visible}
  onClose={handleClose}
>
```

The modal uses `variant='bottomSheet'` which renders a small sheet at the bottom of the screen.

---

## Expected Behavior

The customize modal should open as a fullscreen modal to match the FullsizeTemplatePreview flow:

```tsx
<Modal
  disableBackdropClose={isImporting}
  variant='fullScreen'  // ✅ Fullscreen
  visible={visible}
  onClose={handleClose}
>
```

---

## User Flow

### Current (Broken)
1. User taps template card in categories
2. **FullsizeTemplatePreview** opens (fullscreen) ✅
3. User taps "Customize First →"
4. **TemplatePreviewModal** opens (small bottom sheet) ❌
5. Jarring transition, feels inconsistent

### Expected (Fixed)
1. User taps template card in categories
2. **FullsizeTemplatePreview** opens (fullscreen) ✅
3. User taps "Customize First →"
4. **TemplatePreviewModal** opens (fullscreen) ✅
5. Smooth, consistent experience

---

## Fix

### Simple Fix
Change `variant='bottomSheet'` to `variant='fullScreen'` in TemplatePreviewModal.tsx

### Additional Considerations
- May need to adjust padding/layout for fullscreen view
- Close button positioning may need update
- Safe area insets handling

---

## Files to Modify

| File | Change |
|------|--------|
| `src/screens/templates/TemplatePreviewModal.tsx` | Change variant from `bottomSheet` to `fullScreen` |

---

## Implementation Tasks

- [x] **Task 1**: Change Modal variant to `fullScreen`
- [x] **Task 2**: Adjust layout/padding for fullscreen view
- [x] **Task 3**: Update close button positioning (top-right like FullsizeTemplatePreview)
- [x] **Task 4**: Add safe area insets for content
- [x] **Task 5**: Test the customize → import flow

## Implementation Notes

**Changes made to `src/screens/templates/TemplatePreviewModal.tsx`:**

1. Changed `variant='bottomSheet'` to `variant='fullScreen'` (line 111)
2. Added safe area insets to header with `paddingTop: insets.top > 0 ? insets.top : 12` (line 117)
3. Updated close button styling to match FullsizeTemplatePreview:
   - Added background color (#F3F4F6)
   - Updated size from padding-based to 40x40 circular button
   - Updated X icon color to #374151 and size to 22
   - Added accessibility attributes
4. Updated container to use `flex: 1` with consistent background color (#FAFAF9)
5. Added proper horizontal padding to header (16px), scroll content (20px), and footer (20px)
6. Removed unused `SCREEN_HEIGHT` and `Dimensions` imports

**Result**: The customize modal now opens as a fullscreen modal, providing a consistent UX flow from FullsizeTemplatePreview → TemplatePreviewModal (customize).

---

## Priority
**High** - Affects user experience in core habit import flow

---

*Created: December 2024*
*Fixed: December 2024*
