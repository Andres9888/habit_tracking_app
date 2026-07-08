# Requirements Checklist: Add Habit — "Extra Options" Open List

Status legend: `[x]` done · `[ ]` open

## Understanding & layout

- [x] Section renders as an always-visible list (no expand/collapse, no "Customize" button)
- [x] Header shows "Fine-tune this habit" + "Optional" pill + reassurance line
- [x] Each row shows a plain title, current value (subtitle), and one-line description
- [x] "Recommended" badge shown on the default (balanced) strength curve

## Conversion & flow

- [x] "Create Habit" is the only full-width primary (green) button on screen
- [x] A habit can be created without opening any option (defaults apply)

## Behavior & state

- [x] Tapping a row opens the matching editor (strength / icons / streak)
- [x] Streak row is neutral when unset, amber once a goal is set
- [x] Changed values persist on the created/edited habit

## Consistency

- [x] Same pattern on Add, Edit, and Template Preview
- [x] Growth-type pill still renders for templates that define one

## Quality gates

- [x] Unit test for the rows (render + open-sheet behavior)
- [x] Typecheck passes (0 errors)
- [x] No `max-lines` lint violations in changed files
- [ ] Manual QA on device in light + dark (pending real-device pass)
