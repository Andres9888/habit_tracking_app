# Week navigation clipped habit card

## Symptoms

- Expected: changing the displayed week starts the refreshed habit rows cleanly below the calendar.
- Actual: intermittently, the rounded bottom edge of a previous habit remains clipped at the top of the list.
- Reproduction: scroll the habit list, then navigate backward or forward through weeks while the calendar is fixed.
- Errors: none reported.

## Root cause

`HabitsListContent` structurally places the calendar outside `DraggableFlatList`
when `stickyCalendarHeader` is enabled. The list therefore keeps its independent
vertical offset when `weekDates` changes. A retained offset can leave only the
bottom rounded edge/accent of the preceding card visible, matching the screenshot.

The recent `removeClippedSubviews` prop is not the cause in the installed
`react-native-draggable-flatlist`: its inner list explicitly supplies
`removeClippedSubviews={false}` after spreading consumer props. The small list in
the screenshot also remains within the configured render window.

## Fix

Track the displayed week key and imperatively reset `DraggableFlatList` to offset
zero after the key changes. Do not reset on initial mount or ordinary rerenders.

## Verification

- Focused hook test proves initial mount and same-week rerenders do not scroll.
- Focused hook test proves a changed week scrolls once to `{ offset: 0,
  animated: false }`.
- `useResetListOnWeekChange.test.ts`: passed.
- `HabitsListContent.performance.test.ts`: passed.
- `npx tsc --noEmit --pretty false`: passed.
- `git diff --check`: passed.
