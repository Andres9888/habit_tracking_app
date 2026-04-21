# Plan: Design Token Adoption Deep-Dive Audit

## Context

The user asked to "review the application for design consistency." We scoped this to a **deep-dive on all 4 design token systems** (typography, icons, shadows, colors) with output as an **updated audit document only — no code changes**.

**Why now:**
- The most recent audit, `DESIGN_CONSISTENCY_REVIEW.md`, is dated 2026-04-05 (16 days ago, score 21/24).
- A "designer-review polish pass" shipped yesterday (commit `1338c89c5`), plus ~7 other design/polish commits since Apr 5 (settings toggles, library copy, growth-icon scroll cues, swatch blur, YouTube link fixes).
- The April audit identified critical gaps in token adoption — specifically icons (0%), shadows (15%), fontWeight (20%) — but didn't go screen-by-screen or file-by-file for the four systems together.
- User wants fresh, deeper data to understand where the drift lives so they can prioritize future polish work.

**Intended outcome:** A single, consolidated `DESIGN_TOKEN_ADOPTION_AUDIT.md` that measures adoption rates today, identifies specific hotspots with file:line citations, clusters bypass patterns, and prioritizes remediation. The user reads this, no code moves.

---

## Approach

### Design system sources of truth (read-only reference)

| Token system | File | Lines | What's defined |
|---|---|---|---|
| Typography | `src/theme/typography.ts` | 180 | 7-step type scale (34/28/22/20/17/15/13/10), fontWeights, fontFamilies, helper `textStyle()` |
| Icons | `src/theme/iconSizes.ts` | 33 | micro(10), small(16), medium(20), large(24), xl(32), xxl(48) |
| Shadows | `src/theme/spacing.ts` | 159 (shadows portion) | 5 elevations: subtle, card, floatingActionButton, modal, alert |
| Colors | `src/theme/colors/core.ts` + `src/theme/darkColors.ts` + `src/theme/colors/semantic.ts` | 206 + 342 + 63 | Palette + light/dark semantic + aliases |

### Audit method (per token system)

For each of the four systems, measure and document:

1. **Adoption rate** — Count `typography.*` / `iconSizes.*` / `shadows.*` / `colors.*` (or `useThemeColors()`) token references vs raw value occurrences. Exclude `src/theme/**` and `__tests__/**`.
2. **Delta vs. Apr 5 baseline** — Compare to numbers documented in `DESIGN_CONSISTENCY_REVIEW.md`. Identify net improvement or regression.
3. **Off-scale values** — For each system, find values that don't map to any defined token (e.g., `size={14}` or `size={18}` for icons; `fontSize: 11` for typography).
4. **Top offenders by file** — Rank files by raw-value density. List top 10 per system with `path:lineCount` and estimated violation count.
5. **Bypass patterns** — Cluster violations by pattern: (a) local color constants files, (b) Tailwind arbitrary values `text-[Npx]`, `bg-[#xxx]`, (c) inline `StyleSheet.create` raw numbers, (d) domain-specific constants (character colors, confetti, categories), (e) legitimate uses (data files with semantic coloring).
6. **Remediation priority** — Effort vs. impact scoring: quick wins (<1 day), medium migrations (1–3 days), architectural (requires component abstraction).

### Cross-cutting analysis (new vs. Apr 5 audit)

After per-system findings, add two sections the prior audit did not have:

- **Multi-system offenders** — Files that bypass ≥2 token systems simultaneously (high leverage to fix once). Expected candidates based on prior findings: `SyncStatus/*`, `ErrorBoundary/*`, `screens/templates/styles/*`, `NextHabitSuggestion/*`, `HabitsEmptyStateMinimal/*`.
- **Screen coverage matrix** — For each main surface (Habits List, Analytics, Character, Templates, Auth, Onboarding, Settings, HabitDetail, HabitEdit, CreateHabitModal, Paywall), grade each token system A–F. Gives a one-glance view of which screens are cleanest and which need attention.

### Deliverable structure

New file: `/Users/andres/conductor/workspaces/habit_tracking_app/memphis/docs/DESIGN_TOKEN_ADOPTION_AUDIT.md`

Outline:
1. **Executive summary** — 4-line table with adoption rates today + delta vs Apr 5.
2. **Trajectory** — What changed since Apr 5: which fixes shipped (from git log), which metrics moved.
3. **Per-system deep dive** (x4 sections: Colors, Typography, Icons, Shadows)
   - Adoption rate with evidence
   - Off-scale values enumerated
   - Top 10 offender files (file:line-count)
   - Bypass patterns
   - Specific fix list with effort estimates
4. **Multi-system offenders** — ranked list
5. **Screen coverage matrix** — grid: screen × token system → letter grade
6. **Prioritized remediation roadmap** — 3 waves (quick wins / systematic / long-tail) with specific file targets

Target length: ~400–600 lines. Scannable by section headers; each finding has enough evidence to act on without re-running queries.

---

## Critical files to read during execution

| File | Purpose |
|---|---|
| `src/theme/typography.ts` | Confirm type scale, understand valid/invalid sizes |
| `src/theme/iconSizes.ts` | Confirm icon token values |
| `src/theme/spacing.ts` (shadows section) | Confirm 5-elevation shadow system |
| `src/theme/colors/core.ts` | Confirm palette; identify which hex values are "in-palette" vs foreign |
| `src/theme/darkColors.ts` | Semantic color map used via `useThemeColors()` |
| `DESIGN_CONSISTENCY_REVIEW.md` (root) | Apr 5 baseline for delta computation |
| `docs/DESIGN_CONSISTENCY_AUDIT.md` | Feb 14 granular violations list (some may still apply) |
| `ANIMATION_AUDIT.md` | Cross-reference for motion-related token cross-cutting |
| `tailwind.config.js` | Understand className-driven values that compete with theme tokens |
| `src/components/SyncStatus/**/styles.ts` | Suspected multi-system offender |
| `src/components/ErrorBoundary/**` | Suspected multi-system offender |
| `src/screens/templates/styles/**` | Suspected multi-system offender (recent) |
| `src/components/NextHabitSuggestion/styles.ts` | Heavy raw-value density per Apr 5 audit |
| `src/features/habits/components/HabitsEmptyStateMinimal/**` | Off-scale + local palette per Feb 14 + Apr 5 audits |

### Grep queries the audit will run (representative)

```
# Typography
typography\.(caption|body|heading|display|title|label|tabBar)  # token refs
fontSize:\s*\d+                                                # raw sizes
fontWeight:\s*['"]\d+['"]                                      # raw weights

# Icons
iconSizes\.(micro|small|medium|large|xl|xxl)                   # token refs
<\w+\s+[^>]*size=\{(\d+)\}                                     # raw size props

# Shadows
shadows\.(subtle|card|floatingActionButton|modal|alert)        # token refs
shadowColor|shadowOffset|shadowOpacity|shadowRadius|elevation  # inline

# Colors
useThemeColors|colors\.(primary|gray|strength|text|success|error|warning) # token refs
#[0-9a-fA-F]{3,8}                                              # raw hex
bg-\[#|text-\[#|border-\[#                                     # Tailwind arbitrary
```

All queries scoped to `src/**`, excluding `src/theme/**`, `__tests__/**`, `*.test.*`, `*.stories.*`, and data/constant files flagged as legitimate (categoryColors, confetti configs, milestone colors, character achievements).

---

## Verification

Because this plan produces a document (not code), verification is about **accuracy of claims**, not runtime behavior:

1. **Spot-check 5 file:line citations** picked randomly across sections — read each file and confirm the violation described actually exists today. If any are stale, re-measure the surrounding claim.
2. **Reconcile totals with Apr 5 numbers** — the doc must either show the same numbers, justified growth, or an explained regression. No orphan metrics.
3. **Cross-check "zero adoption" claims** — for icons specifically, confirm `iconSizes` is imported zero times outside `src/theme/**` via grep. Any single import invalidates the claim.
4. **Confirm theme definitions match audit descriptions** — read `iconSizes.ts`, `typography.ts`, shadow section of `spacing.ts` fresh. If the audit claims "6 icon tokens", it must match the file.
5. **Screen matrix sanity** — spot-check 3 screens' grades by opening one representative styles file per screen. Grades should correlate with what the file actually does.

No tests to run, no dev server. Only readonly tools: `Read`, `Grep`, `Glob`, `Bash` (for `git log` delta tracking if needed).

---

## Post-plan housekeeping

- **Branch rename** — deferred from session start due to plan mode. After approval, rename to `design-tokens-audit` via `git branch -m design-tokens-audit`.
- **No git commits** during execution — user asked for a doc only. Creating the doc does not require a commit unless requested.
