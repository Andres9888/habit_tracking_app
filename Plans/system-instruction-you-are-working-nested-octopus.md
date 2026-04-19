# Duolingo-Style Gamification Exploration

## Context

The app already has sophisticated **per-habit** gamification. The question is what Duolingo-style layers would genuinely improve retention for a **habit tracker** (not a language app) without copying mechanics that hurt habit formation.

This plan is exploratory: it maps what exists, identifies the highest-ROI additions, and flags mechanics to *avoid*. Pick which to pursue before any implementation begins.

---

## What Already Exists (don't duplicate)

| Mechanic | Status | Key files |
|---|---|---|
| Streaks + 1-day grace | Sophisticated | `src/utils/streak.ts`, `src/components/HabitCard/components/StreakBadge.tsx` |
| Habit Strength 0–100 (5 levels, Bayesian) — this is effectively the XP/level system | Sophisticated | `convex/habitStrength/momentum.ts`, `src/components/ProgressSectionConsolidated/types/strengthLevels.ts` |
| Milestones (3/7/14/21/30/60/90/100/365 days) per habit | Sophisticated | `src/components/ProgressSectionConsolidated/milestones.data.ts` |
| Today's Focus card (state-based daily goal) | Sophisticated | `src/components/ProgressSectionConsolidated/TodaysFocusCard/` |
| Growth icons (🌱→🌿→🌳→💪→⚡) | Sophisticated | `src/utils/progressEmojis.ts` |
| Streak-at-risk + freeze notifications | Sophisticated | `src/utils/notifications/streakFreeze.ts`, `streakAtRisk.ts` |
| Confetti + reward toasts | Sophisticated | `src/components/HabitCard/components/ConfettiBurst.tsx`, `src/components/RewardCelebrationToast/` |

**Takeaway:** The per-habit loop is already strong. The gaps are **meta-progression**, **recovery mechanics**, and **ambient presence**.

---

## Recommended Additions — Ranked by ROI

### 1. Home/Lock-Screen Widgets (🔥 highest ROI, lowest risk)
Persistent streak + today's progress on iOS/Android home screen. Ambient reminder with zero notification tax. Duolingo's most underrated feature.
- **Why it fits habits:** Habit formation is about cue strength; a glanceable widget *is* a cue.
- **Scope:** iOS WidgetKit + Android App Widget. Show top habit's streak + today's completion count.
- **Risk:** Native module work; Expo config plugin required.

### 2. Perfect Week / Monthly Challenges (best streak-break recovery)
Parallel shorter-horizon streaks ("5/7 days this week", "Perfect April"). When the main streak breaks, users still have something to protect — the single best answer to abandonment.
- **Why it fits habits:** Behavioral science says friction-to-restart kills habits. This lowers it.
- **Scope:** New card in ProgressSection showing weekly/monthly completion %. Reuses existing streak data.
- **Risk:** Low. Pure derived view on top of existing data.

### 3. Achievements Library (cross-habit trophies)
Persistent badge collection rewarding cumulative behavior across habits: "100 habits completed", "First 30-day streak", "7-day perfect week", "5 habits active". Today's milestones are per-habit; this adds meta-collection.
- **Why it fits habits:** Cheap to ship, compounds over tenure, zero ongoing dev cost.
- **Scope:** New `achievements.data.ts` (~15–25 badges), a `useAchievements` hook that evaluates on completion, a new Achievements screen.
- **Risk:** Low. Data-driven; follows the existing `milestones.data.ts` pattern.

### 4. Aggregate "Total Strength" Meta-Progression
A single top-level number that sums/averages strength across all active habits, with its own levels (Novice → Disciplined → Master). Gives users a "main character stat" — a reason to keep multiple habits alive.
- **Why it fits habits:** Existing strength system is per-habit; users lack a dashboard identity.
- **Scope:** New Convex query that aggregates existing `getStrengthInfo`, plus a hero card on Home.
- **Risk:** Medium. Needs thoughtful formula (average? weighted by age? penalize dead habits?).

### 5. Friend Streaks (opt-in only)
Shared streak between two users; breaks if either misses. Strong social accountability for power users who opt in.
- **Why it fits habits:** Social commitment is one of the most-proven habit interventions.
- **Scope:** Backend work — friend invite, shared-streak calculation, notifications. Meaningful effort.
- **Risk:** High. Requires auth-aware social layer, privacy settings, notification design. Defer unless willing to invest.

---

## Explicitly Skip (actively bad for a habit tracker)

- **Hearts / lives** — punishes restart; opposite of habit science.
- **Leagues / global leaderboards** — wrong motivational frame; corrupts intrinsic motivation; punishes users with lighter goals.
- **Loot chests / variable-reward boxes** — feels manipulative in a self-improvement context.
- **Guilt-trip mascot** — adult audience churns on passive-aggressive push notifications.

---

## Proposed Next Step

Pick the subset to pursue. My recommendation: ship **#2 (Perfect Week)** and **#3 (Achievements)** first — both are pure data-derived features with low risk and high retention value, and they can be built on the existing strength/streak plumbing in days, not weeks. Revisit widgets (#1) and meta-progression (#4) after that.

## Critical Files Referenced

- `src/utils/streak.ts` — streak math, reusable for Perfect Week
- `convex/habitStrength/getStrengthInfo.ts` — source for Total Strength aggregation
- `src/components/ProgressSectionConsolidated/milestones.data.ts` — pattern to follow for Achievements
- `src/components/ProgressSectionConsolidated/TodaysFocusCard/` — where Perfect Week card likely slots in

## Verification (once a feature is picked)

- Unit test the calculation (e.g., perfect-week %) against fixture completion data
- Render on Home screen, complete a habit, verify update
- Break a streak, verify Perfect Week still motivates
- Device test widgets on both iOS and Android if pursued
