# Onboarding-v2 Conversion Restructure — Plan

## Context

Andres wants to improve onboarding conversion using the HubSpot mobile-app-onboarding playbook (likely Blake Anderson / Prayer Lock pattern — 29-screen flow, 12–15% paywall conversion vs the ~3% typical of short flows). Direction already set: **"lean conversion — teach just enough to close the sale."** Habit-strength numbers are user-facing in the main app, so teaching strength/tiers is legitimate.

Current state: onboarding-v2 is 13 steps, ~3–5 minute experience, honest-emotional register. Fully implemented, gated post-auth, running in force-show mode for review. Welcome was just redesigned (chain hero).

Target state: 17-step flow, ~8–10 minutes, same register, with high-impact conversion beats added: name capture, personalized aha moment, first-action celebration, review request at emotional peak, commitment activation before paywall.

This doc is plan-only. No code will ship from it — each step below becomes its own commit once greenlit.

## Design philosophy (the guardrails)

- **Honest-emotional register stays.** No hype, no "Crush your goals!", no shouting. Every new screen must pass the "would the current Welcome copy feel at home next to this?" test.
- **Conversion comes from commitment, not pressure.** Use Cialdini-style commitment mechanics (verbal/action self-endorsement) rather than urgency/scarcity.
- **Every new screen earns its keep.** The guide's principle: more screens beat fewer if each screen does a specific job. Reject decorative screens.
- **Personalization is the throughline.** Once we have the user's name, it appears on every subsequent headline that benefits from it. Answers from early steps must show up in later steps (reflection).
- **The chain is the app's hero metaphor.** Celebration, faith snapshot, and first-action screens all route through the chain visualization.

## The 17-step sequence (quick reference)

| # | Step | Status | Primary job |
|---|---|---|---|
| 1 | Welcome | ✓ already redesigned | Hook: the chain metaphor as a promise |
| 2 | **Name** | 🆕 NEW | Personalization fuel, first commitment |
| 3 | Goal | existing | Self-identify what you're building |
| 4 | Pain Points | existing | Self-identify what's stopped you |
| 5 | **Bombshell Stat** | 🆕 NEW | Aha moment — personalized calculation |
| 6 | Social Proof | existing | "You're not alone" |
| 7 | Pain Amplification | upgrade | Reflection of their answers, use name |
| 8 | Solution | upgrade | Add chart + quote under the feature list |
| 9 | Category Preference | existing | Narrow the template pool |
| 10 | Processing | existing | Transition loading (signals personalization) |
| 11 | App Demo | existing | Pick 3 templates |
| 12 | Plan Preview → **Faith Snapshot** | upgrade | Journey recap: where you were → where you'll be |
| 13 | **First Check-In** | 🆕 NEW | Real action: tap one habit as Day 1 |
| 14 | **Celebration + Streak** | 🆕 NEW | Emotional peak — congratulate + copper link forged |
| 15 | Notifications | existing | Permission ask (framed, not dumped) |
| 16 | Account | existing | Sync confirmation |
| 17 | **Commitment + Paywall** | upgrade | Insert commitment Q before the pricing ask |

Total: **17 steps** (up from 13). 5 inserts, 3 upgrades, 1 merged.

## Detailed spec per step

### Step 2 — Name (NEW)

**Job:** Personalization fuel + first commitment act. Guide claims 3x conversion impact on its own.

**Layout:**
- HeroHeader: "What should we call you?"
- Sub: "Your chain is going to know your name."
- Single text input, auto-focused, large font
- PrimaryCTA "Continue" (disabled until ≥1 char)
- Skip link *below* the CTA in text.tertiary, small: "Skip for now" — unobtrusive but present (losing this person's 3x lift is worse than gaining a tiny friction-free path)

**State/data:**
- Add `name?: string` to `OnboardingAnswers` in `types.ts`
- Persist to AsyncStorage via existing `updateAnswers` flow
- Make available everywhere via `answers.name`

**Components reused:**
- `HeroHeader`, `PrimaryCTA`
- New: small styled `TextInput` wrapper (or use the one in HabitCard name edit if it exists)

**Copy notes:**
- "Your chain is going to know your name" — reinforces the chain metaphor set up in Welcome. Personalization-of-the-product, not analytics-data-extraction framing.

**File:** `src/screens/onboarding-v2/steps/NameStep.tsx` (new)

---

### Step 5 — Bombshell Stat (NEW)

**Job:** Aha moment. Personalized calculation based on their Pain Points answer. "Let users arrive at conclusions themselves."

**Layout:**
- HeroHeader eyebrow: "[Name], here's what we see."
- Headline: large personalized stat, e.g. *"91% of people with [their top pain] quit before day 10."*
- Sub: *"You're trying again anyway. That's the part that matters."*
- Small supporting citation in text.tertiary: "Source: [legitimate study or app data]"
- PrimaryCTA "Keep going"
- No skip; this is a set piece

**Data deps:**
- Map each pain point ID → a prewritten personalized stat line. File: `src/screens/onboarding-v2/data/painStats.ts`
- If user selected multiple pains, pick the most quit-prone one (pre-ranked in the map)
- Fallback stat if no pain selected

**Validation requirements:**
- Every stat must cite a real source. If a number can't be sourced, don't ship that variant. Honest-emotional register forbids made-up numbers.
- Acceptable sources: published habit research (Clear's 21/66-day work, Lally 2010, Fogg), internal ChainDay data once we have it, App Store avg retention stats.

**Copy framework:**
```
[Pain-specific setup] — "If you've struggled with [pain], you're in a huge group."
[The bombshell number] — "91% of them quit by [day N]."
[The hopeful pivot] — "[Name], you're here. That's already different."
```

**Risk:** A wrong or preachy stat kills trust faster than a weak one. Needs curation.

**File:** `src/screens/onboarding-v2/steps/BombshellStep.tsx` + `data/painStats.ts`

---

### Step 7 — Pain Amplification (UPGRADE)

**Current:** Tap-through 4 first-person pain statements, user taps "Yes" or "Skip" on each.

**Upgrade:**
- Use user's name in the eyebrow: "[Name], does this sound like you?"
- After the 4 statements, add a **reflection frame**: the ones they said "Yes" to fade in as a list. Title: "You said yes to these. We believe you."
- This is the guide's "reflection screen" — mirrors answers back.

**State:** Already captures `painAgreements: string[]`. Just render them back.

**Cost:** ~20 LOC addition to existing file. No new component.

**File:** `src/screens/onboarding-v2/steps/PainAmplificationStep.tsx` (edit)

---

### Step 8 — Solution (UPGRADE)

**Current:** Eyebrow "Step 6 of 13", headline "Here's what you're getting.", list of solution rows mapped to user's pain selections.

**Upgrade per guide's "chart + supporting quote confirming your solution before climax":**
- Add a single small visualization above the solution list: a simple chain-strength-over-time curve (copper rising to gold), labeled "Day 1 → Day 365"
- Add one quote below the solution list from a real source (research, testimonial, book): small italicized quote + attribution. Not a made-up testimonial.
- Keep existing solution list untouched

**Cost:** ~40 LOC + small `GrowthCurve.tsx` SVG component. Could be a Reanimated path draw.

**File:** `src/screens/onboarding-v2/steps/SolutionStep.tsx` (edit) + `components/GrowthCurve.tsx` (new)

---

### Step 12 — Faith Snapshot (UPGRADE of PlanPreview)

**Current:** Shows 3 picked habit cards with `IRON_DAYS_BY_INDEX` (hardcoded 40/52/45) + "Average time to iron tier: 45 days" callout.

**Upgrade per guide's "personalized summary centered on user, not product":**
- Eyebrow: "[Name], here's your plan."
- Restructure into three beats stacked vertically:
  1. **Where you are today**: "Day 0. No chain yet." small copper-only square.
  2. **Where you'll be in 45 days**: "Iron tier. Three habits holding." small 3-cell iron visual.
  3. **Where you could be in a year**: "Gold tier. Habits as identity." gold visual.
- Keep the 3 `PlanHabitCard`s (they show the specifics)
- Replace the current "Average time to iron tier" with: "This is realistic. People who make it here usually make it to gold."

**This is the step where concepts 2 (leveling) and 3 (strength) both live** per our earlier mapping. The three-beat recap shows the leveling. The "tiers" framing teaches strength without requiring the 0–100 number.

**Cost:** Medium rewrite — ~80 LOC. New `FutureSelfBeat` sub-component (3 instances, one per time horizon).

**File:** `src/screens/onboarding-v2/steps/PlanPreviewStep.tsx` (major edit)

---

### Step 13 — First Check-In (NEW)

**Job:** Let user do the core feature during onboarding. "Tap one of your habits, right now."

**Layout:**
- Eyebrow: "Day 1 starts now."
- Headline: "Tap a habit to begin your chain."
- Show the 3 habit cards from Plan Preview in tappable form (reusing `HabitCard` or a simplified version)
- User must tap at least 1 to continue
- No Skip — this is the commitment moment
- PrimaryCTA "Continue" is hidden until ≥1 tap; replaced by the habit cards themselves

**State:**
- Add `firstCheckInIds: string[]` to OnboardingAnswers
- When user taps a card, record it + trigger light haptic + visual "Done" state on the card
- Auto-advance to Step 14 (Celebration) 600ms after first tap, OR show Continue CTA for multi-tap

**Backend consideration:**
- This is a real completion that should persist to Convex once the user has an account and the habit is imported. During onboarding (pre-template-import), we record the intent in AsyncStorage and replay it after `useTemplateAutoImport` lands on Paywall.
- Alternative: make first-check-in "ceremonial" (not persisted), and the real check-in happens when the user enters the main app. Simpler but loses the "real action" effect.

**Decision needed:** Ceremonial check-in (simpler, safe) vs real check-in (higher impact, needs persistence plumbing). **My lean: ceremonial for v1**, upgrade to real once the rest ships.

**File:** `src/screens/onboarding-v2/steps/FirstCheckInStep.tsx` (new) + `hooks/useCeremonialCheckIn.ts`

---

### Step 14 — Celebration + Streak (NEW)

**Job:** The congratulation moment. Emotional peak of the flow. Guide: "Celebrate completion immediately after first use."

**Layout:**
- Full-screen-ish celebration treatment
- Top: brief confetti burst using the existing `ConfettiOverlay` component (already in codebase at `src/components/FullsizeTemplatePreview/components/ConfettiOverlay.tsx`)
- Center: a single copper chain cell, pulsing/glowing, labeled **"Day 1"**
- Headline: "[Name], your chain has begun."
- Sub: "Come back tomorrow. That's all Day 2 takes."
- Small stat: "You're one of [N] people who started their chain today." (honest if we have the number; skip if we don't)
- PrimaryCTA "Continue"

**Optional review request hook (guide's 12% review-rate tactic):**
- Immediately after this screen's CTA press, trigger iOS `SKStoreReviewController.requestReview()` before advancing to Notifications
- Must gate on platform + dev build flag
- Only fire once per user (store flag in AsyncStorage)
- This is low-cost to add but Apple rate-limits to 3 prompts/year, so we're spending one of those

**Components reused:**
- `ConfettiOverlay` (already exists)
- `SuccessGlowOverlay` (already exists at `src/components/FullsizeTemplatePreview/components/SuccessGlowOverlay.tsx`)
- One copper cell + pulse animation (custom or pull from `HabitChainVisualizer`)

**File:** `src/screens/onboarding-v2/steps/CelebrationStep.tsx` (new) + optional `hooks/useOnboardingReviewPrompt.ts`

---

### Step 17 — Commitment + Paywall (UPGRADE)

**Current:** PaywallStep shows RevenueCatPaywall component + auto-imports templates on mount.

**Upgrade per guide's "Commitment Activation" Cialdini principle:**
- Insert a commitment question as the top half of the screen BEFORE the paywall renders:
  - Headline: "[Name], how committed are you?"
  - Three graduated options (radio group or OptionRow):
    - "I'm going to try this for 7 days."
    - "I'm serious — I'll give it a month."
    - "I'm building this into my life. No going back."
  - After selection, affirming copy fades in based on choice: e.g., "A week is how chains start. Copper takes 20 days." / "30 days is iron territory. We'll be there with you." / "Identity-level commitment. That's how gold happens."
- Then the RevenueCatPaywall renders below or the user advances to it via a CTA

**State:** Add `commitmentLevel?: '7d' | '30d' | 'identity'` to OnboardingAnswers.

**Alternative:** Split into two screens — Commitment (16.5) then Paywall (17). Cleaner but adds a step and risks the user bouncing between them.

**Decision needed:** Stacked on one screen (tighter) vs two screens (cleaner). **My lean: two screens** — the commitment moment needs space to breathe and the paywall needs its own focus.

If split: step count goes to 18 not 17.

**File:** `src/screens/onboarding-v2/steps/CommitmentStep.tsx` (new) + `PaywallStep.tsx` (minor — remove any Welcome-style hero, let it be just the pricing)

---

## Data/state additions needed

New fields on `OnboardingAnswers` (in `types.ts`):

```ts
interface OnboardingAnswers {
  // existing
  goal?: string;
  painPoints: string[];
  painAgreements: string[];
  categories: string[];
  pickedTemplateIds: string[];

  // NEW
  name?: string;              // step 2
  firstCheckInIds?: string[]; // step 13
  commitmentLevel?: '7d' | '30d' | 'identity'; // step 17
}
```

New `STEP_SEQUENCE` in `types.ts`:

```ts
export const STEP_SEQUENCE: readonly StepId[] = [
  'welcome',
  'name',              // NEW
  'goal',
  'painPoints',
  'bombshell',         // NEW
  'socialProof',
  'painAmplification',
  'solution',
  'categoryPreference',
  'processing',
  'appDemo',
  'planPreview',       // upgraded to faith snapshot
  'firstCheckIn',      // NEW
  'celebration',       // NEW
  'notificationPriming',
  'accountCreation',
  'commitment',        // NEW
  'paywall',
] as const;
```

New data files:
- `src/screens/onboarding-v2/data/painStats.ts` — pain → bombshell stat map
- Possibly `src/screens/onboarding-v2/data/quotes.ts` — supporting quotes for Solution step

New hooks (possible):
- `src/screens/onboarding-v2/hooks/useOnboardingReviewPrompt.ts` — guards SKStoreReviewController call
- `src/screens/onboarding-v2/hooks/useCeremonialCheckIn.ts` — records the first-tap event

## Implementation order

Sequenced by impact × independence. Each row = one commit. Progress checkable between rows.

| # | Commit | Depends on | Blocks |
|---|---|---|---|
| 1 | **Celebration step** (14) + ConfettiOverlay wiring, with ceremonial first-check-in stubbed inline | nothing | Real first-check-in (future) |
| 2 | **First check-in step** (13, ceremonial version) — real screen, feeds into Celebration | 1 | — |
| 3 | **Name step** (2) + add `name` to answers + thread through HeroHeader eyebrows in existing steps | nothing | Personalization reflection (future) |
| 4 | **Bombshell stat step** (5) + painStats.ts data file + source citations | 3 (for name) | — |
| 5 | **Pain Amp reflection upgrade** (7) | 3, 4 | — |
| 6 | **Solution chart + quote** (8) | nothing | — |
| 7 | **Faith Snapshot rewrite** (12) | 3 | First check-in (already shipped) |
| 8 | **Commitment step** (17) — split from paywall | 3 | — |
| 9 | **Real first-check-in persistence** (upgrade step 13 from ceremonial to real) — if we decide it's worth it | 1, 2 | — |
| 10 | **Review prompt hook** — if we decide to spend one of Apple's 3 yearly prompts here | 1 | — |

## Risks and how we handle them

| Risk | Mitigation |
|---|---|
| Flow becomes too long → users bail mid-funnel | Monitor drop-off per step. If any single new step has >10% abandonment, cut or reorder. Need analytics wired first (currently zero tracking — separate workstream). |
| Bombshell stat feels preachy or fake | Every stat must cite a real, checkable source. Curate copy before shipping. Test with real users. |
| Celebration before real value = hollow | The check-in has to feel real. Ceremonial is a concession; push to real check-in persistence in a follow-up. |
| Review prompt at wrong time burns a prompt | Add strict once-per-install guard. Consider deferring to second session if unsure. |
| Commitment question feels gimmicky | Copy discipline. The graduated options must read like honest reflections, not sales triggers. |
| Force-show mode currently breaks review replay (step/answers persist across launches) | Known issue. Fix before enabling celebration real persistence, or ceremonial-only survives. |

## Open questions for Andres

1. **First check-in: ceremonial or real?** My lean: ceremonial for v1, upgrade later.
2. **Commitment + Paywall: one screen or two?** My lean: two screens (18 total).
3. **Review prompt: ship with celebration or hold?** My lean: hold until we have analytics to measure impact.
4. **Any stat sources off-limits?** If we want to avoid specific research papers or competitor references, flag them now.
5. **Name field: optional skip link or hard-required?** My lean: optional skip (soft friction) — the 3x conversion claim is likely name-available users, not forced users.
6. **Bombshell stat accuracy bar:** Is "based on real habit research" enough, or do we need exact study citations visible on screen?

## What this plan deliberately does NOT include

- Analytics/funnel tracking instrumentation (separate workstream — blocks measurement of these changes)
- Fixing the force-show/persist bug (separate, already flagged)
- ProcessingStep back-nav trap fix (separate bug)
- Accessibility audit on all 17 steps (separate pass)
- Copy localization / i18n (separate)
- A/B testing framework for variant copy (separate)

## Verification path (once any step lands)

For each new/upgraded step:
1. Typecheck passes (`node_modules/.bin/tsc -p tsconfig.app.json -noEmit`)
2. File under 100 non-blank/non-comment lines
3. Manual run on iOS simulator: step renders, back/forward nav works, answers persist
4. Screen reader smoke test (VoiceOver announces headers correctly)
5. Reduced-motion mode: animations skip gracefully
6. Dark mode: colors use theme tokens, no hardcoded hex (except material tier constants)
