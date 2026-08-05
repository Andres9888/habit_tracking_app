---
type: report
title: Homepage Improvements — Progress Tracker
created: 2026-03-02
tags:
  - homepage
  - retention
  - revenue
  - calendar-timeline
related:
  - '[[HOMEPAGE-01-IMPLEMENTATION]]'
  - '[[HOMEPAGE-02-VERIFICATION]]'
---

## Overview

5 homepage improvements targeting retention (+15-25% Day 30) and revenue (+12-20%).
Total estimated effort: ~70 minutes. Zero breaking changes.

## Pre-Implementation Work (Completed)

| Task | Status | Date |
|------|--------|------|
| Dark mode fixes (5 items) | ✅ Done | 2026-03-02 |
| 44×44px day cells (was 40px) | ✅ Done | 2026-03-02 |
| Center calendar glass chip | ✅ Done | 2026-03-02 |
| Visual mock: homepage_improvements_3.html | ✅ Done | 2026-03-02 |
| ROI analysis: homepage_improvements_3_roi.html | ✅ Done | 2026-03-02 |

## Implementation Status

| # | Improvement | Priority | Status | Verification |
|---|------------|----------|--------|-------------|
| 1 | Contextual Streak Greeting | 9.5/10 | ⬜ Not started | ⬜ Not run |
| 2 | Completion Celebration | 8.0/10 | ⬜ Not started | ⬜ Not run |
| 3 | Week Progress Micro-Bar | 7.5/10 | ⬜ Not started | ⬜ Not run |
| 4 | Today Breathing Glow | 5.0/10 | ⬜ Not started | ⬜ Not run |
| 5 | Shelf Gradient Bleed | 4.0/10 | ⬜ Not started | ⬜ Not run |

## Files Changed (Pre-Implementation)

These files were already modified during dark mode fixes and 44px cell work:

- `src/components/CalendarTimeline/CalendarTimeline.styles.ts` — dark mode getters, topOffset 36.5
- `src/components/CalendarTimeline/CalendarTimeline.tsx` — getShelfStyle(isDark)
- `src/components/CalendarTimeline/components/WeekNavRow.tsx` — centered chip, absolute "Today →"
- `src/components/CalendarTimeline/components/DayCellContent.tsx` — h-11 w-11 (44px), text-[14px]
- `src/components/CalendarTimeline/components/CheckBadge.tsx` — badge 16px, icon 9px
- `src/components/CalendarTimeline/components/CompletionDot.tsx` — isDark-aware colors
- `src/components/CalendarTimeline/components/StripNav.tsx` — HINT_TOP 30
- `src/components/CalendarTimeline/components/DayCellContent.helpers.ts` — isDark param

## Files To Be Changed (Implementation)

- `src/components/CalendarTimeline/components/ProgressGreeting.tsx` — streak greeting (#1)
- `src/components/CalendarTimeline/components/ProgressText.tsx` — celebration animation (#2)
- `src/components/CalendarTimeline/CalendarTimeline.tsx` — micro-bar + gradient bleed (#3, #5)
- `src/components/CalendarTimeline/components/DayCellContent.tsx` — breathing glow (#4)

## Files To Be Created (Implementation)

- `src/components/CalendarTimeline/hooks/useStreakGreeting.ts` — streak greeting logic (#1)
- `src/components/CalendarTimeline/components/MicroProgressBar.tsx` — progress bar (#3)
- `src/components/CalendarTimeline/hooks/useTodayGlow.ts` — breathing animation (#4, if needed)

## Verification Results

_No verification runs have been executed yet._

## Run Notes

_No implementation runs have been executed yet._
