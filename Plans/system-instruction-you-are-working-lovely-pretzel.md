# Habit Pace Copy Rework

## Context

The "Habit Pace" picker currently frames the choice as algorithm behavior (how Forgiving / Balanced / Strict the strength curve is). The user pointed out that this actually maps more naturally to the *complexity of the habit itself* — simple habits grow fast, complex habits take longer and dip harder. Reframing from "how strict is the algorithm" to "how complex is this habit" gives users a clearer, self-descriptive choice. Internal values (`'forgiving' | 'balanced' | 'strict'`) stay untouched for data compatibility — only display strings change.

Tone target: warm + credible (between scientific and playful).

## Scope

1. Section title ("Habit Pace")
2. Sheet subtitle
3. Three option display names
4. Three option descriptions
5. Supporting strings (accessibility hint)
6. **New:** Build a static browser mock showing three full-copy variants side-by-side so the user can pick visually before we commit to one set.

## Current copy (for reference)

| Piece | Current text |
|---|---|
| Section title | `Habit Pace` |
| Sheet subtitle | `Each check-in grows this habit's strength; missing a day lets it dip. Pick the pace that matches the effort required.` |
| Option 1 | `Forgiving` (Simple, ~18d) — `Grows quickly and barely dips when you miss — best for tiny habits that are easy to bounce back from.` |
| Option 2 | `Balanced` (Moderate, ~66d) — `Steady growth with a real dip when you miss — matches the classic 66-day habit curve from UCL research.` |
| Option 3 | `Strict` (Complex, ~120d) — `Slow to build and unforgiving when you miss — for effortful habits that demand real consistency.` |

## Three full copy variants (for the mock)

### Variant A — Plain & Clear **(recommended)**

| Piece | Text |
|---|---|
| Title | **Habit Complexity** |
| Sheet subtitle | Pick how complex this habit is. The growth curve adjusts to match — simpler habits build faster; complex ones take real consistency. |
| Option 1 name | **Simple** (~18 days) |
| Option 1 desc | Quick, easy wins — a glass of water, a vitamin, one push-up. Builds fast and barely dips on off days. |
| Option 2 name | **Regular** (~66 days) |
| Option 2 desc | Everyday habits like journaling, reading, or stretching. Follows the classic 66-day curve from UCL research. |
| Option 3 name | **Complex** (~120 days) |
| Option 3 desc | Demanding habits like running, meditation, or practicing an instrument. Slow, steep climb that rewards real consistency. |

### Variant B — Motivational

| Piece | Text |
|---|---|
| Title | **Habit Type** |
| Sheet subtitle | Tell us what kind of habit this is and we'll match the growth curve to fit. |
| Option 1 name | **Quick Win** (~18 days) |
| Option 1 desc | Tiny moves you can knock out in seconds. Grows fast and forgives the occasional slip. |
| Option 2 name | **Daily Rhythm** (~66 days) |
| Option 2 desc | The staples — journaling, reading, stretching. Follows the textbook 66-day path to automatic. |
| Option 3 name | **Big Lift** (~120 days) |
| Option 3 desc | The real stuff — running, meditation, practice. Takes months, but the payoff is lasting. |

### Variant C — Science-forward

| Piece | Text |
|---|---|
| Title | **Habit Complexity** |
| Sheet subtitle | Habit strength grows with every check-in and dips with every miss. Pick a complexity level — the curve adjusts to match. |
| Option 1 name | **Simple** (~18 days) |
| Option 1 desc | Small-effort habits with fast gains. Strength recovers quickly from missed days — ideal for bite-size routines. |
| Option 2 name | **Moderate** (~66 days) |
| Option 2 desc | Everyday habits matching the 66-day formation curve identified by UCL research. Steady gains, real setbacks. |
| Option 3 name | **Complex** (~120 days) |
| Option 3 desc | High-effort habits that take months to form. Skipping days carries real weight — the curve demands the consistency these habits need. |

## Recommendation

**Variant A (Plain & Clear).** It:
- Uses the user's own mental model (complexity of the habit, not algorithm behavior).
- Echoes the existing `complexity` tier already in `algorithmCopy.ts` (`'Simple' | 'Moderate' | 'Complex'`) — now the *display name itself* matches that tier.
- Keeps the UCL research mention without burying the reader in jargon.
- Examples woven into descriptions do double duty (no separate examples row needed — though those still render in cards).

## Execution plan

### Step 1 — Build the browser mock *(before touching app code)*

Create a single static HTML file that renders the Advanced Options sheet three times side-by-side (one per variant) using rough visual parity with the RN sheet (same row layout, icons via Lucide CDN, similar spacing/type scale).

- **Mock path:** `.superdesign/design_iterations/habit_complexity_mock_1.html`
- **What it shows:** three stacked (or tabbed) panels — Variant A / B / C — each rendering the section row, sheet header, and all three option cards with their full copy.
- **User opens it** in a browser, picks a variant (or tells me to mix pieces across variants), then we move to Step 2.

### Step 2 — Apply chosen variant to the RN code

Once user picks a variant (or a hybrid), make these edits:

1. **`src/components/AlgorithmPicker/algorithmCopy.ts`** (lines 18–49)
   - Update `name` and `description` on all three entries.
   - Leave `mode` keys, `complexity`, `examples`, `daysToForm`, `Icon` untouched.

2. **`src/components/AdvancedOptions/AdvancedOptionsSection.tsx`**
   - Line 155: row `title='Habit Pace'` → new title
   - Line 188: sheet `title='Habit Pace'` → new title (same string)
   - Line 187: sheet `subtitle` → new subtitle
   - Line 145: `accessibilityHint='Opens habit pace picker'` → update to reflect new title (e.g. "Opens habit complexity picker")

### Files NOT modified (intentional)

- `convex/schema.ts` — stored `AlgorithmMode` values stay `'forgiving' | 'balanced' | 'strict'`; no migration needed.
- `AlgorithmCard.tsx`, `AlgorithmCardsList.tsx`, `AlgorithmLegend.tsx`, `HabitAlgorithmPicker.tsx` — all read from `ALGORITHM_COPY`, so they pick up new names/descriptions automatically.
- Accessibility labels inside `AlgorithmCard.tsx` (`${entry.name}, ${entry.complexity} habits`) will read e.g. "Simple, Simple habits" — that's redundant but not broken. Flag for a follow-up tweak if user wants it refined.

## Verification

1. **Mock review:** open `habit_complexity_mock_1.html` in a browser; confirm all three variants render cleanly and the user picks one.
2. **App smoke test** (after code change): open a habit → Advanced → row shows new title + dynamic subtitle (e.g. "Regular · ~66 days to automatic"); sheet opens with new title + subtitle; all three cards show new names/descriptions.
3. **Settings legend:** `AlgorithmLegend` in Settings renders the new copy correctly (auto-updates via `ALGORITHM_COPY`).
4. **Screen reader:** VoiceOver on the advanced row → hint reads naturally. Check cards too.
5. **Lint + types:** `npm run lint` + TS build pass (pure string changes).
6. **Data sanity:** existing users' stored `'forgiving'|'balanced'|'strict'` values still work — confirmed because we don't touch keys or the schema.

## Open items

1. User picks a variant from the mock (A / B / C) or a hybrid.
2. After pick, confirm whether the redundant accessibility label `"Simple, Simple habits"` (name + complexity) should be de-duped — minor, can be a follow-up.
