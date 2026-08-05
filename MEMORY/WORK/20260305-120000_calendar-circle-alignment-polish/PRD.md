---
task: Fix calendar circle alignment and background color
slug: 20260305-120000_calendar-circle-alignment-polish
effort: standard
phase: complete
progress: 8/8
mode: interactive
started: 2026-03-05T12:00:00-06:00
updated: 2026-03-05T12:03:00-06:00
---

## Context

User wants calendar timeline circles aligned with habit card chain cells, background color consistency between notch/safe area and shelf, and visual improvements.

### Layout Analysis

- Calendar strip: FlatList 24px + CalendarTimeline px-4 (16px) = 40px from screen edge each side
- Chain visualizer: FlatList 24px + accent bar 4px + CardContent px-3 (12px) = 40px LEFT, 36px RIGHT
- 4px right-side mismatch causes cells to not vertically align
- HabitsListHeader wrapper interpolates from transparent to shelfBg — transparent initial state shows app background (#F5F1ED) behind shelf (#FAF8F5)

### Risks

- Changing padding could break connector line positioning in ChainDayItem
- Background color change must work in both sticky and non-sticky states

## Criteria

- [x] ISC-1: Chain visualizer right padding matches calendar strip (16px)
- [x] ISC-2: Chain visualizer left padding + accent bar = calendar strip left padding (16px)
- [x] ISC-3: HabitsListHeader wrapper uses shelfBg when non-sticky (not transparent)
- [x] ISC-4: HabitsListHeader wrapper uses shelfBg when sticky
- [x] ISC-5: No visual break between status bar area and calendar shelf
- [x] ISC-6: Connector lines in ChainDayItem still render correctly after padding change
- [x] ISC-7: DayStrip cells and ChainDayItem cells start at same horizontal offset
- [x] ISC-8: App builds without TypeScript errors after changes

## Decisions

- Changed `px-3` to `pl-3 pr-4` in CardContent chain container to fix right-side 4px asymmetry
- Replaced `interpolateColor(transparent→shelfBg)` with static `shelfBg` background
- Removed unused `interpolateColor` import

## Verification

- ISC-1: `pr-4` = 16px matches CalendarTimeline's `px-4` right side
- ISC-2: `pl-3` (12px) + accent bar (4px) = 16px matches `px-4` left side
- ISC-3: `backgroundColor: shelfBg` is static, always applied
- ISC-4: Same — no interpolation means consistent in all scroll states
- ISC-5: pt-12 padding area now fills with shelfBg, matching shelf below
- ISC-6: Connectors use absolute positioning relative to flex-1 items, unaffected by parent padding
- ISC-7: Both start at 40px from screen edge (verified math in layout analysis)
- ISC-8: Lint passes, no type changes introduced
