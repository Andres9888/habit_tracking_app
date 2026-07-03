# MotivationSystem — Design Archive

> **Status:** Archived before deletion. This document captures enough intent, structure, and
> science to rebuild the feature from scratch. It is a design memory, not living code.
>
> **Source location (at time of archival):** `src/components/MotivationSystem/` (~193 source files)
> **Backend removed in commit:** `aec0dbeac` (dropped tables `reflections`, `affirmations`,
> `letters`, `visionBoardImages`, `voiceNotes`, `visionBoardItems` from `convex/schema.ts`).
> **Sole external mount point:** `src/features/habits/components/HabitsModals/ActivationModalSection.tsx`

---

## Overview

The **MotivationSystem** was a science-backed behavior-change toolkit layered on top of the core
habit tracker. Where the base app answers _"did you do the habit today?"_, the MotivationSystem
answered _"why will you do it, and what happens when you don't feel like it?"_ It packaged a set of
established behavioral-science protocols (implementation intentions, WOOP / mental contrasting,
identity-based habits, dual visualization, loss aversion, commitment devices) into a set of RN
components that the user configured once (the **Workshop**) and that then fired at the two highest-
leverage moments: **just before** a scheduled habit (**Activation**) and **when a streak was about
to break** (**Rescue**). A **Premium** layer gated the higher-cost / higher-value features.

Design thesis (from the code's own comments): the app's _retention and conversion_ levers are
emotional, not mechanical. A checkbox does not survive a low-motivation morning; a recording of
your own voice from the day you were most committed might. Every section carries an inline
"science tip" citing the specific study or protocol it implements, which doubled as the upsell
rationale.

The architecture header states it plainly:

```
Workshop:   Components for the Motivation tab (setup)
Activation: Components for pre-habit notification/modal
Rescue:     Components for streak-at-risk interventions
Premium:    Feature-gating, upsell, paywall integration
```

---

## The Four Sub-Systems

### 1. Workshop — the setup surface (the "Motivation" tab of Habit Detail)

**Purpose:** where the user authors, once per habit, the raw material every other sub-system
replays. Each piece is a tappable `SectionCard` with an empty state ("Set up" CTA) and a filled
state, a colored left border for identity, a staggered entrance animation (`AnimatedSection`,
`sectionIndex` for timing), and a `CompletionCheckmark` that appears when the section has data.
Most cards open an editor modal on press and show an explainer modal via a help icon.

| Component            | Concept                                                           | Border         | What the user enters                                                                   |
| -------------------- | ----------------------------------------------------------------- | -------------- | -------------------------------------------------------------------------------------- |
| `YourWhySection`     | Self-Determination Theory (Deci & Ryan); Noom 3x retention        | rose           | A free-text "why" statement, shown in quotes                                           |
| `IdentitySection`    | Identity-based habits (James Clear, _Atomic Habits_)              | premium/indigo | "I am a \_\_\_" — auto-prefixed "I am a" if missing; copy: _Not "I run" — who you ARE_ |
| `CueTriggerSection`  | Habit loop (Duhigg) + implementation intentions (Gollwitzer 1999) | sky            | `time` / `location` / `afterBehavior` — When / Where / After                           |
| `WOOPSection`        | WOOP / mental contrasting (Gabriele Oettingen, NYU, 20+ studies)  | (varies)       | `wish` / `outcome` / `obstacle` / `plan` (IF-obstacle-THEN-action)                     |
| `DualVizSetup`       | Dual visualization (Huberman, Stanford, Ep. #55)                  | violet         | Success + Failure each as `body` / `mind` / `emotion`                                  |
| `VisionBoardSection` | Mental imagery / mirror neurons; personal > stock images          | fuchsia        | Up to **4** photos (Convex `_storage`), each with optional caption                     |
| `VoiceNotesSection`  | Voice = 40% higher emotional recall than text                     | teal           | Audio recordings; one flaggable as **Day 1**                                           |

**Supporting Workshop components:**

- `VoiceNotePlaybackUI` — full + compact audio players (progress bar, seek, speed control, mute,
  `isDay1` styling). Driven by `useVoiceNotePlayback`.
- `MicrophonePermissionDenied` — graceful mic-denial state; distinguishes `canAskAgain` (retry) vs
  permanent (open Settings), repeats the 40%-recall science line as upsell/justification.
- `VoiceNotesSection` internals: recording state machine (`preparing` → recording/paused →
  `stopping` → error / permission-denied), `WaveformVisualization` (live metering), max-duration
  guardrails (`isApproachingMaxDuration`, `isMaxDurationReached`, `secondsUntilMaxDuration`).

**UX flow:** user opens the Motivation tab → sees the stack of section cards, each empty or filled
→ taps one → editor modal → data saved to the habit (or to a satellite table) → checkmark appears.
The `shouldAnimate` flag runs the entrance stagger only on the first tab visit.

### 2. Activation — priming right before the habit

**Purpose:** intercept the moment a scheduled-habit notification is tapped and prime the user to
actually start. Mounted via `ActivationModalSection` (see Integration).

**Key components:**

- `ActivationModal` — full-screen modal composed of `ActivationModalHeader` / `...Content` /
  `...Actions`. Renders: habit card (streak + completions), **Your Why** (featured), the WOOP
  IF-THEN reminder, the cue/trigger reminder, a glowing **Start Now** primary button, and quick
  actions **Snooze** and **Just 2 Min**. Returns `null` when no habit.
- `MotivationCheck` — "How motivated are you right now?" with 3 emoji options
  (`MotivationLevel`: `ready` / `meh` / `not_motivated`, roughly). Selecting a low level surfaces a
  science tip and routes to a different visualization. Has a `compact` variant.
- `ContextAwareViz` — picks which visualization to show from the motivation level: `ready` →
  **success** viz; `meh` / `not_motivated` → **failure** viz (`shouldShowFailureViz`). Failure
  variant carries a loss-aversion callout ("This feeling moves you 2x more effectively"). `body`
  / `mind` / `emotion` fields, `compact` + `forceType` escape hatches.

**Science:** implementation intentions (2–3x follow-through), BJ Fogg Tiny Habits ("Just 2 min"
lowers activation energy), Huberman dual visualization (show success when motivated, failure when
not).

**UX flow:** notification tap → `ActivationModal` opens → optional `MotivationCheck` →
`ContextAwareViz` shows the matching mental image → user taps **Start Now** (toggles the habit
complete for today) / **Just 2 Min** / **Snooze**.

### 3. Rescue — streak-at-risk intervention

**Purpose:** a more urgent sibling of Activation, fired when a streak is about to break. Same
skeleton (full-screen `Modal`, header/content/actions) but three deliberate differences, per the
component comment:

1. **Always** shows the failure visualization (Huberman: show failure when unmotivated).
2. **"Just 2 Min" is the PRIMARY CTA**, not "Start Now" (lower activation energy under pressure).
3. Urgent visual language — red/amber `LinearGradient` (`#fff1f2` → `#fafaf9`).

**Key components:**

- `RescueMode` — orchestrator. Computes gating booleans from habit data: `hasStreak`, `hasWhy`,
  `hasVoiceNote` (a Day-1 note exists), and `hasPreviousStreakNotes` (best streak ≥ 3 **and** notes
  exist). Actions: **Just 2 Min** (primary), **Start Full**, **Skip Today**, plus voice-note
  play start/finish callbacks.
- `FailureViz` — dedicated loss-aversion panel: "If You Skip Today…", lists failure `body`/`mind`/
  `emotion`, a `StreakLossPreview` (visualizes the number of days about to be lost), and the
  "loss aversion moves you 2x" callout. Uses a subtle shake/pulse animation.
- `PreviousStreakVoiceNotes` — the emotional payload of streak recovery: replays voice notes the
  user recorded during their **best** streak. Auto-expands the note from the highest streak day.
  Copy: _"This was you at your best. You can get there again."_ Each `StreakVoiceNoteData` carries
  `streakAtRecording` and `daysAgo` for context.

**Science:** loss aversion (Kahneman & Tversky — losses hurt ~2x), streak protection as the #1
retention driver (explicitly cited as "Duolingo"), voice as a commitment device / peak-motivation
anchor.

**UX flow:** streak detected at risk → `RescueMode` opens → failure viz + (if present) Day-1 voice
note + best-streak voice notes → user taps **Just 2 Min** (default path to preserve the streak),
**Start Full**, or **Skip Today**.

### 4. Premium — gating, upsell, paywall

**Purpose:** gate the higher-cost features and drive conversion, without ever letting the client
self-grant entitlement (see Rebuild Notes).

**Key components:**

- `PremiumFeatureLock` — renders one of three variants: `inline` (compact bar), `overlay` (covers
  the gated content), `card` (standalone). Fires `onLockViewed(feature)` for analytics on mount and
  `onUpgrade` on CTA. Optional `showScience` reveals the study-based rationale from `FEATURE_META`.
- `FeatureLimitBadge` — the "1/2 Free" usage pill. Renders nothing for premium users; turns into a
  tappable upgrade CTA (warning color + chevron) once `current >= limit`.
- `PremiumPaywall` (re-exported from `src/components/PremiumPaywall`) — unified paywall with
  `variant="motivation" | "benefits" | "analytics"`. Legacy aliases `MotivationPaywall` /
  `PremiumBenefitsModal` were deprecated in favor of the variant prop.
- `usePremiumUpsell` — state machine for the upsell flow: `showPaywall` / `showBenefits`,
  `triggeredFeature` (which feature opened it, for highlighting + analytics), and transitions
  `triggerPaywall` / `triggerBenefits` / `benefitsToPaywall` / `dismissPaywall` (clears the
  triggered feature after a 300 ms animation via a tracked-timeout helper to avoid leaks).

---

## Premium Gating Model

The gated feature set (`MotivationPremiumFeature`) and its display/science copy lived in
`Premium/PremiumFeatureLock/featureMetadata.ts`:

| Feature (`MotivationPremiumFeature`) | Free tier                                    | Premium                                  | Science basis (upsell copy)                               |
| ------------------------------------ | -------------------------------------------- | ---------------------------------------- | --------------------------------------------------------- |
| `voiceNotes`                         | **1 recording** (`freeLimit: '1 recording'`) | Unlimited                                | "Voice has 40% higher emotional recall than text"         |
| `visionBoard`                        | Locked (0 images)                            | Up to 4 images/habit                     | "Personal images create stronger emotional connections"   |
| `rescueMode`                         | Locked                                       | Streak-at-risk alerts                    | "Streak protection is #1 retention driver (Duolingo)"     |
| `advancedViz`                        | Locked (basic viz only)                      | Full Body+Mind+Emotion Huberman protocol | "Fear visualization moves you 2x better when unmotivated" |

Free-vs-premium was expressed two ways: **hard locks** (`PremiumFeatureLock` overlay/card on
visionBoard/rescueMode/advancedViz) and a **soft counter** (`FeatureLimitBadge current/limit` for
voiceNotes, only `voiceNotes` carried an explicit `freeLimit`). Sections received an `isPremium`
prop and an `onPremiumRequired` callback; hitting a limit called `onPremiumRequired()` →
`usePremiumUpsell.triggerPaywall(feature)`.

> Note: the "benefits" paywall variant was an educational pre-paywall screen; `benefitsToPaywall()`
> stepped the user from benefits → the actual paywall.

---

## Data Model

Two storage locations were used.

### A. Fields on the existing `habits` table (STILL PRESENT in `convex/schema.ts`)

The single-value Workshop/Activation inputs were denormalized directly onto the habit document and
were **not** removed by `aec0dbeac`. `ActivationModalSection.buildActivationHabitData` reads them:

```
why, identity, suggestedWhy, suggestedIdentity,
cueTime, cueLocation, cueAfterBehavior,
woopObstacle, woopPlan   (+ wish/outcome implied by WOOPData),
vizSuccessBody, vizSuccessMind, vizSuccessEmotion,
vizFailureBody, vizFailureMind, vizFailureEmotion,
currentStreak, bestStreak, completedDays (→ totalCompletions), icon, name
```

All optional strings. A rebuild can keep using these or normalize them out.

### B. Satellite tables (REMOVED in `aec0dbeac` — reconstruct if rebuilding the full feature)

Inferred shapes from the removed schema diff and how components consumed them:

**`voiceNotes`** — recordings for Voice Notes + Rescue.

```
audioUrl: string           // Convex _storage URL
duration: number           // seconds
habitId: Id<'habits'>
isDay1?: boolean           // featured in Rescue Mode as the emotional anchor
label?: string             // e.g. "Day 1 motivation"
createdAt: number, updatedAt?: number, userId?: string
// indexes: by_habit, by_user, by_habit_and_date([habitId, createdAt])
```

Consumed as `VoiceNoteSummary` (Workshop) and `StreakVoiceNoteData` (Rescue, which derives
`streakAtRecording` and `daysAgo` at read time from streak history).

**`visionBoardImages`** — the 4-image board (premium).

```
storageId: Id<'_storage'>  // source of truth; getUrl() for display
imageUrl?: string          // cached, may expire
caption?: string           // <= 200 chars (MAX_CAPTION_LENGTH)
order: number              // 0-based, drag-to-reorder
habitId: Id<'habits'>
createdAt: number, updatedAt?: number, userId?: string
// indexes: by_habit, by_user, by_storageId, by_user_and_storage, by_habit_and_order
```

Consumed as `VisionBoardImage`. `MAX_IMAGES = 4`.
(A legacy text-only `visionBoardItems` table — `title` / `body` — also existed and was removed.)

**`affirmations`** — scheduled positive self-talk cards (premium; UI not in this folder but backed
the system). Science cited: Steele 1988; Hatzigeorgiadis 2011.

```
text: string
type?: 'identity' | 'motivational' | 'instructional'
frequency?: 'daily' | 'weekly'
daysOfWeek?: number[]      // 0=Sun..6=Sat, weekly only
scheduledTime?: string     // "HH:MM" 24h
isScheduleEnabled?: boolean
notificationId?: string    // Expo notification id for cancellation
lastDeliveredAt?: number
habitId: Id<'habits'>, createdAt, updatedAt, userId?
// indexes: by_habit, by_user, by_schedule([isScheduleEnabled, scheduledTime])
```

**`letters`** — time-locked "letters to your future self" (premium; temporal self-continuity /
delayed gratification).

```
content: string
title?: string
unlockAt: number           // becomes readable at this time
isRead: boolean
habitId: Id<'habits'>, createdAt, updatedAt?, userId?
// indexes: by_habit, by_user, by_unlock_date, by_habit_and_unlock
```

**`reflections`** — post-completion emoji + note (BJ Fogg Tiny Habits; Daylio-style).

```
emoji: 'frustrated' | 'neutral' | 'happy' | 'fire'
note?: string
date: string               // YYYY-MM-DD
habitId: Id<'habits'>, createdAt, updatedAt, userId?
// indexes: by_habit, by_habit_and_date, by_user, by_user_and_date
```

---

## Integration Point

The entire system reached the app through **one** file:
`src/features/habits/components/HabitsModals/ActivationModalSection.tsx`.

- It imports **only** `ActivationModal` (the Workshop tab and Rescue were wired elsewhere / mounted
  in the Habit Detail Motivation tab; this section is the notification-driven entry).
- `buildActivationHabitData(habit)` maps the habit document's denormalized motivation fields into
  the `ActivationHabitData` the modal expects.
- Callbacks: `onStartNow` → `toggleHabit({ date: today, habitId })` (marks the habit done today);
  `onSnooze` and `onJustTwoMin` were **no-op stubs** with comments marking them as future work
  (schedule a delayed notification; enter a 2-minute commit mode).
- Visibility/`reduceMotion` were passed down from the habits screen state
  (`showActivationModal`, `reduceMotionPreference`).

This single-importer property is why the feature is cleanly deletable.

---

## Component Inventory (notable, grouped)

```
MotivationSystem/
├── index.ts                       # re-exports Workshop + Activation + Rescue
├── Activation/
│   ├── ActivationModal/           # ActivationModal (+ Header/Content/Actions), types
│   ├── MotivationCheck/           # MotivationCheck, MotivationButton, constants, shouldShowFailureViz
│   └── ContextAwareViz/           # ContextAwareViz, useVizData, VizHeader, VisualizationContent
├── Premium/
│   ├── PremiumFeatureLock/        # PremiumFeatureLock (Inline/Overlay/Card), FeatureLimitBadge,
│   │                              #   featureMetadata.ts (FEATURE_META), types
│   ├── usePremiumUpsell.ts        # paywall/benefits state machine
│   └── index.ts                   # + re-export of shared PremiumPaywall (variant-based)
├── Rescue/
│   ├── RescueMode/                # RescueMode + components/{Header,Content,Actions,sections/}
│   ├── FailureViz/                # FailureViz, VizFieldsList, StreakLossPreview, animation hook
│   └── PreviousStreakVoiceNotes/  # list + StreakVoiceNoteCard, SectionHeader
└── Workshop/
    ├── YourWhySection/            # rose  — "why"
    ├── IdentitySection/           # indigo— "I am a…"
    ├── CueTriggerSection/         # sky   — time/location/afterBehavior (+ shared SectionCard,
    │                              #   AnimatedSection reused by Why/Identity)
    ├── WOOPSection/               # wish/outcome/obstacle/plan + WOOPExplainerModal, woopUtils
    ├── DualVizSetup/              # violet— success/failure viz + VizPreview, ExplainerModal
    ├── VisionBoardSection/        # fuchsia— 4-image grid + Add/Viewer modals, hooks (MAX_IMAGES=4)
    ├── VoiceNotesSection/         # teal  — recorder state machine + waveform, hooks
    ├── VoiceNotePlaybackUI/       # full + compact players, useVoiceNotePlayback
    └── MicrophonePermissionDenied/# mic-denial fallback
```

(Each leaf folder follows the repo's ≤100-line decomposition convention: a thin orchestrator
`.tsx`, a `.hooks.ts`/`use*.ts`, a `types.ts`, and a `components/` or sibling sub-parts.)

---

## Rebuild Notes — decisions, gotchas, what to preserve

**Preserve these design decisions:**

- **Science-first copy is load-bearing, not decoration.** Every section pairs its input with the
  exact protocol/study it implements; the same line doubles as the premium upsell rationale. Keep
  the citation → feeling → CTA chain intact.
- **Two-moment model.** Setup (Workshop) is separated from delivery (Activation pre-habit, Rescue
  at-risk). Rescue is intentionally _not_ just Activation with red paint: failure-only viz, "Just
  2 Min" as primary CTA, and best-streak voice notes are the three differentiators.
- **Voice notes as the emotional peak.** The Day-1 note (`isDay1`) and best-streak notes are the
  highest-value asset; Rescue auto-expands the highest-streak recording. Worth the storage cost.
- **Motivation-aware branching.** `MotivationCheck` → `ContextAwareViz`/`shouldShowFailureViz`
  implements the Huberman rule (success viz when motivated, failure viz when not). Loss-aversion
  framing ("2x") is deliberate and consistent across Activation, Rescue, and FailureViz.
- **Reduced-motion + accessibility everywhere.** Every component takes `reduceMotion`; cards carry
  `accessibilityLabel`/`Role`, permission states use `role="alert"`. Do not drop these.

**Gotchas / things that bit or were left unfinished:**

- **Premium gating must stay webhook-only.** `isPremium` is passed in; the client only _requests_
  upgrade via `onPremiumRequired`/`usePremiumUpsell`. Never accept an entitlement field in a public
  mutation (mass-assignment self-grant). See repo memory "Premium gating invariant".
- **`onSnooze` / `onJustTwoMin` in `ActivationModalSection` were no-op stubs.** A rebuild still owes
  the delayed-notification reschedule and the 2-minute commit mode.
- **Timer leaks.** `usePremiumUpsell` tracks every `setTimeout` in a ref and clears on unmount —
  the dismiss animations depend on delayed state clears; replicate that pattern.
- **Storage vs cached URL.** `visionBoardImages`/`voiceNotes` treat `storageId`/`audioUrl` from
  Convex `_storage` as source of truth; cached `imageUrl` may expire — re-resolve via `getUrl`.
- **Data lives in two places.** Single-value inputs (why, identity, cue*, woop*, viz\*) are
  denormalized on the `habits` table (still in schema); multi-row assets (voice notes, images,
  affirmations, letters, reflections) were separate tables (removed in `aec0dbeac`). A rebuild must
  restore those five tables (plus legacy `visionBoardItems` if needed) — shapes are in the Data
  Model section above.
- **Deletability.** The whole feature was reachable through one importer
  (`ActivationModalSection`) plus the Habit Detail Motivation tab, which is what makes clean
  archival/removal possible. Keep that single-seam property if rebuilt.

```

```
