# Quick Spec: Fix Habit Card Chain Link Alignment & Overlap

## Overview
Fix two visual bugs in the habit card component where chain link icons are misaligned with the header emoji and chain connectors overlap the card boundaries.

## Workflow Type
bugfix

## Task Scope
Fix visual alignment and overflow issues in the HabitChainVisualizer component to ensure chain link icons align horizontally with header elements and connectors stay within card boundaries.

## Success Criteria
- Chain link icons align horizontally with the emoji icon in the habit card header
- Connectors between chain links don't overlap outside the card boundary
- Visual alignment matches the 5-column grid used in the rest of the habit card

## Files to Modify
- `src/components/HabitChainVisualizer/HabitChainVisualizer.tsx` - Adjust chain layout alignment and connector positioning

## Change Details

### Issue 1: Horizontal Alignment
The `HabitChainVisualizer` component uses `flex-row justify-between` (line 515) which creates 5 evenly-spaced habit circles. However, this doesn't perfectly align with the 5-column flex grid used in the `DraggableHabit.tsx` title row (where the emoji is in column 1).

**Fix**: The HabitChainVisualizer already uses `flex-1 items-center` for each day container, but the parent may need adjustment. Check that the habit circles align with the 5-column layout by ensuring consistent flex distribution.

### Issue 2: Connector Overlap
The connector positioning at lines 579-598 uses:
- `left: '50%'`
- `marginLeft: 18`
- `right: -18`

This can cause the connector to extend beyond the container boundaries, creating visual overlap with the habit card edges.

**Fix**: Adjust connector positioning to stay within bounds, potentially using `overflow: 'hidden'` on parent or reducing the connector extension values.

## Verification
- [ ] Chain link icons align horizontally with the emoji icon in the habit card header
- [ ] Connectors between chain links don't overlap outside the card boundary
- [ ] Visual alignment matches the 5-column grid used in the rest of the habit card

## Notes
- The habit card uses a 5-column flex layout (see DraggableHabit.tsx lines 667-746)
- HabitChainVisualizer should mirror this same 5-column distribution
- The `px-3` padding on the chain visualizer container should match the header padding
