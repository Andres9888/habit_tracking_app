---
task: Fix habit not adding when reminder is set
slug: 20260310-200000_fix-habit-not-adding-with-reminder
effort: standard
phase: complete
progress: 8/8
mode: interactive
started: 2026-03-10T20:00:00-08:00
updated: 2026-03-10T20:00:30-08:00
---

## Context

User reports habits fail to create when a reminder is set. Root cause: `preferredTime` field carries HubermanPhase identifiers (e.g., `phase1_push`) but is validated by `validateTimeFormat()` which expects HH:MM format. When a reminder option is selected, `dayPhase` is set to a HubermanPhase, passed as `preferredTime` to Convex, and validation throws. The error is silently caught in `useCreateHabitModal.ts`.

### Risks
- Fix must not break existing habits with `preferredTime` already stored as HubermanPhase values
- Fix must not break habits created without reminders (dayPhase=null passes as undefined, no issue)

## Criteria

- [x] ISC-1: preferredTime accepts HubermanPhase identifiers (phase1_push, phase2_pivot, phase3_pull)
- [x] ISC-2: preferredTime still accepts legacy time-of-day strings (morning, afternoon, evening)
- [x] ISC-3: preferredTime still accepts HH:MM time format strings
- [x] ISC-4: preferredTime undefined passes validation (no reminder case)
- [x] ISC-5: Habit creation succeeds when reminder is set to morning
- [x] ISC-6: Habit creation succeeds when reminder is set to midday
- [x] ISC-7: Habit creation succeeds when reminder is set to evening
- [x] ISC-8: Habit creation succeeds when no reminder is set

## Decisions

## Verification
