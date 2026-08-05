# Screen 2 Copy Improvements — `ProblemStep`

## Context
Screen 2 of `onboarding-v2` is the problem-agitation beat between Welcome (1) and Solution Intro (3). It sets up the "you can't see your progress, so you quit" pain that the rest of the flow (Habit Map, waypoints, copper arrow) resolves. Goal of this exercise: stress-test the current copy and surface tighter alternatives — **no code changes yet**.

## Current copy (file: `src/screens/onboarding-v2/steps/ProblemStep.tsx`)
- **Headline:** "You're building habits **blind.**" (52pt, "blind." in copper #B87333)
- **Visual block** (`BlindPathBlock`, dashed beige card): three italic questions, each followed by "You don't know."
  - "How long does it take?" → You don't know.
  - "Where am I in the process?" → You don't know.
  - "What if I miss a day?" → You don't know.
- **Sub-headline:** "You're lost." (20pt, amber #B45309)
- **Body:** "No map. No markers. So you quit." (14pt secondary)
- **CTA:** "tap to continue →"

## What's working
- The "blind / lost / no map" stack lands cleanly on the trail-map brand metaphor used downstream (Habit Map, named waypoints, copper arrow).
- The drumbeat of three "You don't know." lines is a strong agitation device.
- Final question — "What if I miss a day?" — is the most emotionally loaded; placing it last is correct.

## What could be tighter
1. **"You're building habits blind"** + **"You're lost"** are saying the same thing with two metaphors (sight + position). The second feels redundant on a re-read.
2. **"So you quit"** is a logical leap; users don't quit *because* there's no map — they quit because effort outpaces visible progress. The map framing is the symptom, not the cause.
3. **"How long does it take?"** is generic; the other two are more specific/visceral. Question one underperforms its slot.
4. Headline word "blind" is strong but has accessibility-language baggage; "flying blind" reads as idiom and softens that.

## Copy options to consider

### Option A — Tighten what's there (smallest change)
- Headline: **"You're building habits blind."** *(unchanged)*
- Visual block questions: keep two, swap "How long does it take?" for something sharper:
  - "Is this even working?"
  - "Where am I in the process?"
  - "What if I miss a day?"
- Sub-headline: **drop "You're lost."** — let the visual block carry the weight.
- Body: **"No signal. No progress. So you stop."**
  *(Replaces the redundant map metaphor; "stop" is softer and truer than "quit".)*

### Option B — Reframe around invisible progress (medium change)
- Headline: **"You can't see your progress."**  *(or)* **"Your progress is invisible."*
- Visual block: keep questions; tighten responses to vary:
  - "Is this even working?" → No idea.
  - "Where am I in the process?" → No idea.
  - "What if I miss a day?" → No idea.
- Sub-headline: **"So you guess. Then you quit."**
- Body: *(remove — sub-headline carries it)*

### Option C — Lean into "flying blind" idiom (low risk, fresh)
- Headline: **"You're flying blind."** (still copper-accent "blind.")
- Visual block: unchanged, three questions + "You don't know."
- Sub-headline: **"No instruments. No horizon."**
- Body: **"That's why most habits crash."**

### Option D — Make the user the subject, not the system
- Headline: **"You can't tell if it's working."**
- Visual block: keep as-is.
- Sub-headline: **"So motivation runs out."**
- Body: **"Every time."**

## Recommendation
**Option A** is the smallest defensible change and addresses both real issues (redundant "lost" line, weak first question) without re-doing the visual metaphor that downstream screens depend on. Option C is the runner-up if you want a slightly fresher headline.

## Files referenced (read-only)
- `src/screens/onboarding-v2/steps/ProblemStep.tsx`
- `src/screens/onboarding-v2/components/BlindPathBlock.tsx`
- `src/screens/onboarding-v2/types.ts` (for step ordering)

## Verification (only if you greenlight a change)
- Update strings in `ProblemStep.tsx` and/or `BlindPathBlock.tsx`.
- Run app, navigate Welcome → tap to advance → confirm screen 2 renders updated copy without layout shift (sub-headline removal in Option A/B will tighten vertical spacing — verify visually).
- No tests guard this copy; manual screenshot diff against current build is the bar.
