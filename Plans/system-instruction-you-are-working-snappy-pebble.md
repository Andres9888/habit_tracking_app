# Design Review: Habit Settings Page (HabitEditScreen)

## Context

**What is being reviewed.** `HabitEditScreen` — the bottom-sheet modal reached by tapping "Edit Habit" on the habit detail screen. It lets users change a habit's name, icon, color, daily reminder, and advanced options (growth type, growth icons, streak goal). It shares its customization components (`EmojiPicker`, `ColorPickerSection`, `EnhancedReminderSelector`) with `CreateHabitModal` but wraps them in a distinct layout.

**Why a review.** This is where users iterate on existing habits — the cost of friction here is silent churn (users abandon tweaking and drop the habit). It also needs to feel native alongside `CreateHabitModal` so users' mental model carries over, while being optimized for editing rather than creation.

**Outcome.** A written design review document categorizing findings (strengths, issues, recommendations) with severity, effort estimate, and specific `file:line` references. User can act on the findings directly or share with collaborators.

## Scope

**Primary files reviewed:**

| File | Role |
|------|------|
| `src/screens/HabitEditScreen/HabitEditScreen.tsx` | Sheet wrapper + orchestration (166 lines) |
| `src/screens/HabitEditScreen/EditHeader.tsx` | Cancel + Save buttons |
| `src/screens/HabitEditScreen/NameInputSection.tsx` | "Edit your habit" heading, input, counter |
| `src/screens/HabitEditScreen/CustomizeSection.tsx` | Emoji / Color / Reminder grouping |
| `src/screens/HabitEditScreen/HabitEditSkeleton.tsx` | Loading skeleton |
| `src/screens/HabitEditScreen/DangerZone.tsx` | **Exists but is not imported or rendered anywhere** |
| `src/components/AdvancedOptions/AdvancedOptionsSection.tsx` | Collapsible advanced card |
| `src/components/AdvancedOptions/AdvancedOptionRow.tsx` | Row pattern inside Advanced |
| `src/components/AdvancedOptions/AdvancedSheet.tsx` + sheet bodies | Sub-sheets for Growth Type / Icons / Streak Goal |

**Reference files for consistency:**

- `src/components/CreateHabitModal/**` — sibling creation flow
- `src/theme/spacing.ts`, `typography.ts`, `colors/*` — design tokens
- `src/screens/HabitDetailScreen/useSwipeActions.ts` — where delete/archive actually live today (swipe gestures on the detail screen)

**Out of scope:** Convex mutations, navigation stack, product-level feature requests.

## Review Dimensions

I will evaluate each section against these axes and surface findings only where there is something actionable to note:

1. **Information architecture** — Logical grouping. Does the order match user priority? Why is "Advanced" a card but "Customize" is not?
2. **Visual hierarchy** — Is Save most prominent? Do the three Customize sub-sections read as peers or as clutter?
3. **Spacing & rhythm** — Consistent token usage. Anything that feels crowded or adrift.
4. **Typography** — Type scale usage, copy quality. Examples already spotted: heading "Edit your habit" omits the habit's current name; Growth Type subtitle uses the word "automatic" without context; two section captions are verbs ("Choose an icon", "Pick a color") but the reminder sub-section has no caption at all — an inconsistency.
5. **Color & contrast** — Theme token compliance, dark-mode fidelity, WCAG contrast on disabled Save state.
6. **Motion** — Are the staggered entrances (0/60/120/280ms delays) helping or just delaying the first interaction?
7. **Affordances** — Is Advanced collapsed-by-default discoverable? Do the three sub-sheets feel like overlays of the same system?
8. **Consistency with CreateHabitModal** — Do Create and Edit feel like siblings? Identified divergences: Edit has a visible drag handle, Create doesn't; Edit lacks the live preview Create has; section captions differ.
9. **Completeness** — Archive and Delete are reachable only via swipe gestures on the detail screen. A "Settings" page missing these is surprising; `DangerZone.tsx` exists as unwired dead code.
10. **Edge cases** — Unsaved-changes handling on swipe-to-dismiss; skeleton fidelity vs real layout; error states on save failure.
11. **Accessibility** — 48×48 minimum tap targets on color swatches, labels on all interactive elements, focus order, color-only signifiers in the color picker.

## Method

A design review cannot live on static code analysis alone — rendered visual reality is the source of truth. I will use **browser verification as a first-class step**, not a follow-up.

### Step 1 — Open the rendered page in the browser (before writing anything)

- Check for an already-running dev server on `localhost:8081` (Expo Web default). If none, start it with `npm run dev` in the background.
- Use the `claude-in-chrome` MCP tools to drive the browser:
  - `tabs_context_mcp` — see current tabs.
  - `tabs_create_mcp` or `navigate` — open the Expo Web app.
  - `read_page` + `browser_screenshot` — capture the rendered UI.
  - `form_input` / click helpers — navigate to a habit detail screen and tap "Edit Habit" to land on `HabitEditScreen`.
- Capture screenshots of each state that matters for the review:
  1. Sheet opening (initial entrance, to judge the staggered animations)
  2. Sheet fully rendered in **light mode**
  3. Same sheet in **dark mode** (toggle theme)
  4. Advanced section **collapsed** and **expanded**
  5. Each sub-sheet: **Growth Type**, **Growth Icons**, **Streak Goal**
  6. Empty / invalid states: empty name (Save should be disabled), max-length name (50/50)
  7. Saving state (spinner + "Saving…" text)
  8. Loading skeleton (captured during the brief load window or by reading the relevant Convex query state)

### Step 2 — Static code review (alongside the screenshots)

- Read each file in scope; cross-reference with design tokens (`src/theme/`) and the sibling `CreateHabitModal`. Most of this has been completed during Phase 1 exploration.
- For every issue spotted in the code, go back to the screenshot to confirm it's visibly real. Every finding in the deliverable is backed by both a `file:line` reference *and* a screenshot.

### Step 3 — Iterate

If a screenshot reveals something the code review missed (spacing that looks off, a contrast issue the tokens didn't predict), add it as a finding. If the code review reveals a concern that the screenshot disproves, drop it.

## Deliverable

A single markdown file at:

```
.context/design-reviews/habit-edit-screen-review.md
```

Plus a screenshots folder at:

```
.context/design-reviews/habit-edit-screen/
├── 01-sheet-light.png
├── 02-sheet-dark.png
├── 03-advanced-collapsed.png
├── 04-advanced-expanded.png
├── 05-sheet-growth-type.png
├── 06-sheet-growth-icons.png
├── 07-sheet-streak-goal.png
├── 08-empty-name.png
├── 09-max-name.png
├── 10-saving.png
└── 11-skeleton.png
```

Structure of the review markdown:

1. **Executive summary** — three sentences: overall state, top two strengths, top two issues.
2. **Overview screenshot** — the baseline light-mode capture, embedded at the top.
3. **Strengths** — bulleted, concise. Things worth preserving.
4. **Findings** — grouped by section (Header → Name → Customize → Advanced → Sub-sheets → Missing surfaces). Each finding formatted as:

   > **[Severity: High / Medium / Low]** — short title
   > *Screenshot:* `![](habit-edit-screen/NN-something.png)` with an annotation of what to look at.
   > **Observation.** What's there, with `file:line`.
   > **Why it matters.** User impact.
   > **Recommendation.** Concrete change (copy, tokens, layout) with `file:line`.
   > **Effort.** Trivial / Small / Medium / Large.

5. **Cross-cutting recommendations** — things that apply across sections (e.g., migrate hardcoded hex values in `EmojiChip.tsx` and `PresetButton.tsx` to theme tokens).
6. **Open questions** — design decisions that need user input before acting (e.g., "Should Archive live on the edit screen or stay swipe-only?").

Expected length: ~400–700 lines of markdown with ~11 screenshots embedded. Sharable as a standalone review.

## Pre-identified findings (headline preview)

A preview of the most impactful items the review will expand on — so the user can redirect scope now:

- **High — Archive / Delete are invisible on the settings page.** `DangerZone.tsx` exists but is unwired. The only path to archive/delete is a swipe gesture on the detail screen. Discoverability problem.
- **High — Heading ignores context.** `NameInputSection.tsx:40` says "Edit your habit" with no indication of *which* habit. The current name is in the input below but the emoji and color are not previewed together.
- **Medium — Visual grouping is inconsistent.** `Customize` sub-sections sit directly on the sheet surface; `Advanced` is a bordered card. Either both should be cards or neither should.
- **Medium — Reminder sub-section has no caption.** `CustomizeSection.tsx` gives captions to emoji and color but lets `EnhancedReminderSelector` provide its own label — breaks parallel structure.
- **Medium — No live preview.** Create has a hero preview; Edit does not. Users can't see the result of their changes until after saving.
- **Medium — Jargon in Growth Type subtitle** ("~14 days to automatic"). "Automatic" is internal vocabulary.
- **Medium — No unsaved-changes guard.** Swiping the sheet down with a half-typed name discards silently.
- **Low — Hardcoded colors in shared components** (`EmojiChip.tsx`, `PresetButton.tsx`) bypass theme tokens; dark-mode fidelity risk.
- **Low — Staggered entrance delays (0/60/120/280/360 ms).** Total ~500 ms before user can interact with Advanced on every open. Worth questioning for a screen used repeatedly.
- **Low — Copy parallelism.** "Choose an icon", "Pick a color", then nothing for reminders.

## Verification

1. Every finding in the review cites both a `file:line` reference *and* the screenshot that shows the issue. If I can't point at the evidence, the finding is cut.
2. Re-read the review end-to-end for internal consistency and actionability before handing off.
3. Cross-check every `file:line` reference by re-reading the cited file.
4. Confirm the review is scannable: table of contents, bolded severities, short paragraphs.
5. Invite the user to react; iterate on scope or depth if they want.

## Critical Files (quick reference)

```
src/screens/HabitEditScreen/HabitEditScreen.tsx
src/screens/HabitEditScreen/EditHeader.tsx
src/screens/HabitEditScreen/NameInputSection.tsx
src/screens/HabitEditScreen/CustomizeSection.tsx
src/screens/HabitEditScreen/HabitEditSkeleton.tsx
src/screens/HabitEditScreen/DangerZone.tsx
src/components/AdvancedOptions/AdvancedOptionsSection.tsx
src/components/AdvancedOptions/AdvancedOptionRow.tsx
src/components/AdvancedOptions/AdvancedSheet.tsx
src/components/CreateHabitModal/components/EmojiPicker/EmojiChip.tsx
src/components/CreateHabitModal/components/EnhancedReminderSelector/PresetButton.tsx
src/theme/spacing.ts
src/theme/typography.ts
src/theme/colors/*
```
