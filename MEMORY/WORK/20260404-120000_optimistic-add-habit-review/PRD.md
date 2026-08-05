---
task: Review optimistic add-habit for speed improvement
slug: 20260404-120000_optimistic-add-habit-review
effort: standard
phase: complete
progress: 10/10
mode: interactive
started: 2026-04-04T12:00:00-05:00
updated: 2026-04-04T12:00:30-05:00
---

## Context

User wants to speed up habit creation by making it optimistic. Currently, `useCreateHabitModal.ts:53-55` awaits the full Convex mutation round-trip before closing the modal. The user taps Save, waits ~200-500ms with no visual feedback, then the modal closes. The infrastructure for optimistic updates (store, offline queue types, etc.) already exists for toggle/archive/reorder but hasn't been wired for creation.

**Key bottleneck:** `await createNewHabit(data)` blocks modal close. `cleanup()` (close + reset + haptic) runs only after server confirms.

**Complication:** When reminders are enabled, `scheduleReminder` needs the server-returned `habitId`. This must be handled asynchronously after the mutation completes.

### Risks
- Reminder scheduling depends on server-returned habitId — handled by keeping it in the background promise chain
- Edit mode shares same handler path — kept unchanged (still awaits)
- Double-tap on Save could create duplicates — mitigated by isSaving ref guard
- Fire-and-forget mutation errors invisible to user — acceptable for v1, errors already only logged in dev
- checkReminderPermissions may show OS permission dialog — must still await before close

## Criteria

- [x] ISC-1: Modal closes immediately on Save tap without awaiting mutation
- [x] ISC-2: Haptic feedback fires on Save tap before mutation completes
- [x] ISC-3: Convex mutation fires in background after modal close
- [x] ISC-4: Reminder scheduling runs after mutation resolves with habitId
- [x] ISC-5: Mutation errors logged to console in dev mode
- [x] ISC-6: Edit mode flow unchanged — still awaits mutation before close
- [x] ISC-7: Save button disabled after first tap to prevent duplicates
- [x] ISC-8: Form state resets on modal close regardless of mutation status
- [x] ISC-9: markFirstHabitCreated still called after successful creation
- [x] ISC-10: No new dependencies or libraries introduced

## Decisions

## Verification
