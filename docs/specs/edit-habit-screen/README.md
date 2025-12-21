# Epic 2: Edit Habit Screen Redesign

**Display Title:** Edit Habit Screen Redesign
**Timeline:** Week 3 (Month 1)
**Stories:** 1 story (expandable)
**Status:** Not Started
**Priority:** High

---

## Goal

Transform the Edit Habit Screen into a **modern, polished experience** that matches the Create Habit flow, enabling users to easily modify their habits with the same delightful UX.

---

## Current vs Target State

### Current State
```
┌─────────────────────────────────────┐
│  ← Edit Habit                    🗑  │  ← Delete in header (dangerous)
├─────────────────────────────────────┤
│     [Emoji Preview]                  │
│     "Browse Icons" button           │
├─────────────────────────────────────┤
│  Habit Name: [_______________]      │
├─────────────────────────────────────┤
│  Frequency: [Daily][Weekly][Custom] │
├─────────────────────────────────────┤
│  Days: M T W T F S S                │
├─────────────────────────────────────┤
│  Time: ☀️ ☁️ 🌙                       │
├─────────────────────────────────────┤
│  Reminders: [Toggle]                │
│  Time: 2:00 PM                      │
├─────────────────────────────────────┤
│  Goal: [30] [minutes ▾]             │  ← Unit picker broken
├─────────────────────────────────────┤
│  🔥 Current Streak: 7 days          │
├─────────────────────────────────────┤
│  [Cancel]        [Save Changes]     │
└─────────────────────────────────────┘
```

### Target State
```
┌─────────────────────────────────────┐
│  ← Edit Habit                        │  ← No delete in header
├─────────────────────────────────────┤
│         IDENTITY                     │
│     [Emoji Preview]                  │
│     "Browse Icons" button           │
│                                     │
│     Color:                          │
│     🔴 🟠 🟡 🟢 🔵 🟣 💗 ⚫          │  ← 24 colors
│     🩵 🧡 💚 💜 🩷 🤎 🖤 🌊          │
│     🌸 🍑 🌿 💎 🪻 🩶 🤍 🌻          │
│                                     │
│     Name: [_______________]         │
├─────────────────────────────────────┤
│         SCHEDULE                     │
│     Frequency + Days + Time         │
├─────────────────────────────────────┤
│         REMINDERS                    │
│     Toggle + Time + Sound           │
├─────────────────────────────────────┤
│         GOAL                         │
│     Value + Unit (working picker)   │
├─────────────────────────────────────┤
│         ADVANCED                     │
│  → Edit Cue & Intention             │
│  → Edit Affirmations                │
│  → View Why & Vision Board          │
├─────────────────────────────────────┤
│         MANAGE                       │
│  → View Calendar                    │
│  [Archive Habit]                    │
│  [Delete Habit] ← Red, confirmation │
├─────────────────────────────────────┤
│  [Cancel]        [Save Changes]     │
└─────────────────────────────────────┘
```

---

## Stories

1. [Story 2.1: Edit Page Redesign](./stories/story-2.1-edit-page-redesign.md) - Draft

---

## Design Principles

1. **Parity with Create Flow** - Same color picker, same patterns
2. **Safe by Default** - Destructive actions require confirmation
3. **Progressive Disclosure** - Advanced features accessible but not overwhelming
4. **Consistent Sections** - Clear visual grouping with headers

---

## Dependencies

- Story 1.9.4 (Manage Actions) - shares confirmation dialog patterns
- Color Picker Phase 1 - reuses 24-color palette
- Archive Habits UX Spec - follows same archive flow

---

**Epic Owner:** Andres
**Created:** 2025-12-21
**Last Updated:** 2025-12-21
