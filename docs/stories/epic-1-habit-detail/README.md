# Epic 1.5: Habit Detail Screen

**Display Title:** Habit Detail Screen
**Screen Title:** Habit Details Page (Progress Deep Dive)
**Timeline:** Week 2 (Month 1)
**Stories:** 7 stories
**Status:** Not Started (0% Complete - 0/7 stories done)
**Priority:** High

---

## Goal

Turn the Habit Detail Screen into the user's **single best place** to:

- Complete today's habit (fast)
- Understand progress (strength + streak + calendar)
- Stay motivated (why + vision board + cue + affirmations)
- Reflect and learn (notes)
- Manage the habit (edit/pause/archive/delete)

This epic is the implementation companion to the existing UX spec: `docs/ux-habit-detail-redesign.md`.

---

## Placement Recommendation (Information Architecture)

The page should feel like **Identity → Trigger → Action → Progress → Motivation → Reflection → Management**.

```
┌─────────────────────────────────────────────────────────────┐
│  1. HERO (Identity + Why + Cue)                             │
│     - Icon, name, optional description                      │
│     - "Why" one-liner (always visible)                      │
│     - "Cue" implementation intention (trigger)              │
├─────────────────────────────────────────────────────────────┤
│  2. PRIMARY ACTION (Quick Complete)                         │
│     - One-tap complete/uncomplete for today                 │
├─────────────────────────────────────────────────────────────┤
│  3. STATS (Progress)                                        │
│     - Streak (current + best + last 7 days)                 │
│     - Strength section                                      │
│     - Calendar heatmap (last 30 days)                       │
│     - Stats grid (total, success rate, etc.)                │
├─────────────────────────────────────────────────────────────┤
│  4. MOTIVATION (Vision Board + Affirmations)                │
│     - Vision board cards / prompts                          │
│     - Mental contrasting / visualization exercises          │
│     - Affirmations & positive self-talk                     │
├─────────────────────────────────────────────────────────────┤
│  5. NOTES (Reflection)                                      │
│     - Recent note preview + total + add/view all            │
├─────────────────────────────────────────────────────────────┤
│  6. MANAGE HABIT (Safety & Admin)                           │
│     - View Calendar, Pause, Archive, Delete                 │
└─────────────────────────────────────────────────────────────┘
```

### The Habit Loop Integration

This layout implements the **complete habit loop** from behavioral science:

| Element | Habit Loop Role | Research |
|---------|-----------------|----------|
| **Why** | Identity / Purpose | SDT, Frankl's Logotherapy |
| **Cue** | Trigger | Gollwitzer (2-3x follow-through) |
| **Quick Complete** | Routine | The actual behavior |
| **Stats** | Evidence of Identity | Identity reinforcement |
| **Vision Board** | Long-term Reward | Dopamine anticipation |
| **Affirmations** | Self-Talk / Inner Coach | Steele, Hatzigeorgiadis (d = 0.48) |
| **Notes** | Reflection | Learning and adjustment |

---

## Stories

1. [Story 1.9: Habit Detail Layout + Quick Complete](./story-1.9-habit-detail-page-redesign.md) - 🔴 TODO
2. [Story 1.9.1: Habit Detail Stats Module (Strength/Streak/Calendar)](./story-1.9.1-habit-detail-stats-module.md) - 🔴 TODO
3. [Story 1.9.2: Habit Detail Why + Vision Board (Motivation)](./story-1.9.2-habit-detail-why-and-vision-board.md) - 🔴 TODO
4. [Story 1.9.3: Habit Detail Notes Module](./story-1.9.3-habit-detail-notes.md) - 🔴 TODO
5. [Story 1.9.4: Habit Detail Manage Actions + Safety](./story-1.9.4-habit-detail-manage-actions.md) - 🔴 TODO
6. [Story 1.9.5: Habit Cue & Implementation Intention](./story-1.9.5-habit-cue-implementation-intention.md) - 🔴 TODO
7. [Story 1.9.6: Affirmations & Positive Self-Talk](./story-1.9.6-affirmations-positive-self-talk.md) - 🔴 TODO

---

## Draft Stories (Backlog)

- Day detail drill-down (tap heatmap cell → notes + context)
- Editable past days (long-press heatmap to toggle within last 7 days)
- Shareable progress card
- Immediate Reward definition and post-completion celebration
- Audio playback of affirmations
- AI-generated affirmations based on habit

---

**Epic Owner:** Jane
**Created:** 2025-12-14
**Last Updated:** 2025-12-14



