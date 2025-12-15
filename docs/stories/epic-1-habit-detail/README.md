# Epic 1.5: Habit Detail Screen

**Display Title:** Habit Detail Screen
**Screen Title:** Habit Details Page (Progress Deep Dive)
**Timeline:** Week 2 (Month 1)
**Stories:** 5 stories
**Status:** Not Started (0% Complete - 0/5 stories done)
**Priority:** High

---

## Goal

Turn the Habit Detail Screen into the user’s **single best place** to:

- Complete today’s habit (fast)
- Understand progress (strength + streak + calendar)
- Stay motivated (why + vision board)
- Reflect and learn (notes)
- Manage the habit (edit/pause/archive/delete)

This epic is the implementation companion to the existing UX spec: `docs/ux-habit-detail-redesign.md`.

---

## Placement Recommendation (Information Architecture)

The page should feel like **Action → Progress → Motivation → Reflection → Management**.

1. **Hero (Identity + Why teaser)**
   - Icon, name, optional description
   - Optional “Why” one-liner shown here so it’s always visible

2. **Primary Action (Quick Complete)**
   - One-tap complete/uncomplete for today (with haptics + animation)

3. **Stats (Progress)**
   - Streak (current + best + last 7 days chain)
   - Strength section
   - Calendar heatmap (last 30 days)
   - Stats grid (total completions, success rate, etc.)

4. **Motivation (Vision Board)**
   - Vision board cards / prompts
   - Links to motivational exercises (mental contrasting / visualization)

5. **Notes (Reflection)**
   - Recent note preview + total notes + add/view all

6. **Manage Habit (Safety & Admin)**
   - View Full Calendar, Pause, Archive, Delete

---

## Stories

1. [Story 1.9: Habit Detail Layout + Quick Complete](./story-1.9-habit-detail-page-redesign.md) - 🔴 TODO
2. [Story 1.9.1: Habit Detail Stats Module (Strength/Streak/Calendar)](./story-1.9.1-habit-detail-stats-module.md) - 🔴 TODO
3. [Story 1.9.2: Habit Detail Why + Vision Board (Motivation)](./story-1.9.2-habit-detail-why-and-vision-board.md) - 🔴 TODO
4. [Story 1.9.3: Habit Detail Notes Module](./story-1.9.3-habit-detail-notes.md) - 🔴 TODO
5. [Story 1.9.4: Habit Detail Manage Actions + Safety](./story-1.9.4-habit-detail-manage-actions.md) - 🔴 TODO

---

## Draft Stories (Backlog)

- Day detail drill-down (tap heatmap cell → notes + context)
- Editable past days (long-press heatmap to toggle within last 7 days)
- Shareable progress card

---

**Epic Owner:** Jane
**Created:** 2025-12-14
**Last Updated:** 2025-12-14

