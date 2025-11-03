# Create Habit — UX Spec

## Microcopy (Base)
- Title: Create Habit
- Name label: Habit name
- Name placeholder: e.g., Read 10 minutes
- Name helper: Tip: Be specific — time, trigger, place.
- Icon label: Icon
- Color label: Color
- Custom color: Custom color
- Reminders label: Reminders
- Reminders helper: We'll only remind you at your chosen time.
- Reminder time: Reminder time
- Sound: Sound
- Template hero title: Start from Template
- Template hero subtitle: Browse curated routines and auto‑fill details.
- Template prompt: Prefer a ready-made routine?
- Template CTA: Browse curated templates
- Save: Save
- Close: Close

## Microcopy (Variants to test)
- Title: New Habit | Add a habit
- Name helper: Keep it small to start | Make it specific and doable
- Reminders helper: Pick a time you’ll likely be free | You control when and how often we remind you
- Template hero subtitle: Get science‑backed routines from experts | Skip setup with curated presets
- Save: Create habit | Done

## Motion Tokens
- Duration
  - fast: 100ms
  - base: 150ms
  - reveal: 180ms
  - emphasized: 220ms
  - enter: 280ms
  - exit: 220ms
- Easing
  - outEase: Easing.out(Easing.ease)
  - inEase: Easing.in(Easing.ease)
  - outCubic: Easing.out(Easing.cubic)
  - inCubic: Easing.in(Easing.cubic)

## Haptics Map
- Select chip/toggle: selection
- Time selection confirm: selection
- Save success: notification success
- Validation error: notification error
- Cancel/close: none

## Quick Templates (Suggestions)
- 💧 Drink water
- 📖 Read 10 minutes
- 🚶 Walk 15 minutes
- 🧘 Meditate 5 minutes
- 🍎 Eat a healthy snack
- 📝 Journal 3 lines

## Implementation Notes
- Tokens live at: `src/constants/motion.ts`
- Strings live at: `src/constants/strings.ts`
- UI wiring: `src/components/CreateHabitModal/*`
- Haptics hook: `src/hooks/useHapticFeedback.ts`

