# Design Consistency Review — 2026-04-16

**Scope:** Full codebase re-verification vs prior audit
**Prior audit:** `DESIGN_CONSISTENCY_REVIEW.md` (2026-04-05, scored 21/24)
**Commits analyzed:** 43 commits between 2026-04-05 and 2026-04-16 HEAD (`15bda89d5`)
**Method:** Direct `grep` against `src/**/*.{ts,tsx}` excluding `src/theme`, `__tests__`, `__mocks__`, `*.test.*`, `*.spec.*`

---

## Executive Summary

The design system is in **materially better shape than the 2026-04-05 audit**. PR #1233 ("design token remediation — fontWeight, iconSizes, typography, shadows, sync colors") landed on the same day as the prior audit and directly addressed the top findings. Every headline issue from the prior audit has either been resolved or substantially reduced.

**Headline wins since 2026-04-05:**

1. **`iconSizes` token adoption: 0 → 305 references** (biggest systemic win — prior audit called this out as "F grade, 0%")
2. **Raw `fontWeight`: 229 → 8** (-96.5%; 4 of the remaining 8 are in a non-production example file)
3. **`borderRadius: 999` bug: 5 → 0** (fully resolved in `ColorPickerSection`)
4. **SyncStatus hardcoded colors: 5 files with hex → 0 files with hex** (fully tokenized)
5. **Tailwind config alignment: `accent`, `card.DEFAULT`, `borderRadius.card` all now match theme**
6. **`strokeWidth={2.25}` sprawl: 6 → 1** production occurrence

**Revised pillar estimate: ~23/24** (+2 from 2026-04-05's 21/24)

---

## Verified Counts — Current HEAD vs 2026-04-05

| Category   | Metric                                             | 2026-04-05 |  2026-04-16 |          Δ |
| ---------- | -------------------------------------------------- | ---------: | ----------: | ---------: |
| Typography | Raw `fontSize: N`                                  |        328 |         270 |       -18% |
| Typography | `typography.*` refs                                |        277 |         441 |       +59% |
| Typography | Raw `fontWeight: N`                                |        229 |           8 | **-96.5%** |
| Typography | `fontWeights.*` refs                               |         56 |         306 |  **+446%** |
| Typography | `fontWeight: '800'`                                |          0 |           0 |      clean |
| Typography | `fontWeight: 'bold'`                               |          0 |           0 |      clean |
| Icons      | Raw `size={N}`                                     |        460 |         152 |   **-67%** |
| Icons      | `iconSizes.*` refs                                 |          0 |         305 |     **+∞** |
| Icons      | `strokeWidth={2.25}`                               |          6 | 1 (+1 test) |       -83% |
| Icons      | `strokeWidth={3}`                                  |         17 |          16 |       flat |
| Color      | `colors.*` refs                                    |      2,029 |       2,233 |       +10% |
| Color      | `useThemeColors` files                             |        467 |         502 |      +7.5% |
| Shadow     | `shadows.*` refs                                   |         77 |          85 |       +10% |
| Shadow     | Inline shadow props                                |        427 |         424 |       flat |
| Radius     | Raw `borderRadius: N`                              |       ~180 |         192 |        +7% |
| Radius     | `borderRadius.*` refs                              |        193 |         222 |       +15% |
| Radius     | `borderRadius: 999` bug                            |          5 |           0 |  **-100%** |
| Spacing    | `spacing.*`/`screenMargins.*`/`componentSpacing.*` |        419 |         499 |       +19% |
| Tailwind   | `text-[Npx]` custom                                |        192 |         150 |       -22% |

**Counts are from direct `grep` on current HEAD. Source of truth, not transcribed.**

---

## What's Resolved (since 2026-04-05)

### 1. `borderRadius: 999` bug — FIXED

Prior audit flagged 5 instances in `CreateHabitModal/components/ColorPickerSection/*`. Direct grep on current HEAD returns **zero matches**. The `borderRadius.full` token (= 9999) is now used. Verified via:

```bash
grep -rnE "borderRadius: *999\b" src  # zero hits
```

### 2. SyncStatus hardcoded colors — FIXED

All 5 style files previously using hardcoded amber/stone Tailwind hex (`#fffbeb`, `#fef3c7`, etc.) now contain **0 raw hex values**:

- `src/components/SyncStatus/ConflictNotification/styles.ts` — 0 hex
- `src/components/SyncStatus/SyncingIndicator/styles.ts` — 0 hex
- `src/components/SyncStatus/OfflineIndicator/styles.ts` — 0 hex
- `src/components/SyncStatus/SyncedToast/styles.ts` — 0 hex
- `src/components/SyncStatus/PendingSyncBadge/styles.ts` — 0 hex

All now use `colors.warningLight`, `colors.streak[*]`, `colors.gray[*]`, `colors.primary[*]`, and `colors.success`.

### 3. `iconSizes` adoption — RESOLVED

Prior grade: **F (0%)**. Current: **305 references** across the codebase. Raw `size={N}` dropped 67% (460 → 152).

Most common remaining raw sizes (from `size={N}` breakdown):

- `size={20}` — 43× (maps to `iconSizes.medium`)
- `size={16}` — 30× (maps to `iconSizes.small`)
- `size={24}` — 11× (maps to `iconSizes.large`)
- `size={32}` — 7× (maps to `iconSizes.xl`)

**Off-scale survivors** (not in token set `micro:10, small:16, medium:20, large:24, xl:32, xxl:48`):

- `size={14}` — 24×
- `size={18}` — 19×
- `size={12}` — 13×
- `size={28}` — 3×
- `size={22}` — 2×
- `size={40}` — 3×
- `size={80}`, `size={120}`, `size={200}` — illustrations, fine

### 4. `fontWeight` raw values — NEARLY RESOLVED

229 → 8 (-96.5%). The 8 remaining occurrences:

| File                                                                  | Lines              | Status                                                                                        |
| --------------------------------------------------------------------- | ------------------ | --------------------------------------------------------------------------------------------- |
| `src/screens/HabitEditScreen/CustomizeSection.tsx`                    | 50, 66             | Spread `...typography.caption` then override weight — should reference `fontWeights.semibold` |
| `src/screens/templates/TemplatePreviewModal/TemplatePreviewModal.tsx` | 191, 227           | Inline `'600'` — should be `fontWeights.semibold`                                             |
| `src/components/CelebrationSystem/examples/CelebrationExample.tsx`    | 146, 172, 182, 196 | **Example file, not production code** — can be ignored or cleaned up                          |

Production-facing violations: **4 lines across 2 files**.

### 5. Tailwind config / theme alignment — FIXED

Current `tailwind.config.js`:

- `accent.DEFAULT: '#059669'` — matches theme `primary[600]` ✓
- `card.DEFAULT: '#EDEAE5'` — matches theme `light.card` ✓
- `borderRadius.card: '16px'` — matches theme `borderRadius.card: 16` ✓

The three mismatches flagged on 2026-04-05 are all resolved.

### 6. `strokeWidth={2.25}` — NEARLY RESOLVED

Prior: 6 files. Current: 1 production occurrence (`src/components/SettingsModal/SortOptionRow.tsx:50`) plus 1 reference inside a test comment. Recommendation: change `SortOptionRow.tsx:50` to `strokeWidth={2.5}` for full resolution.

---

## What's Still Open

### A. Raw `fontSize` — 270 occurrences (was 328)

Down 18%, but still the largest remaining token-adoption gap. Top hotspots:

| File                                                                     | Raw `fontSize` count |
| ------------------------------------------------------------------------ | -------------------: |
| `src/screens/CharacterScreen/components/CharacterCard.tsx`               |                    8 |
| `src/screens/TemplatesScreen/components/StartHereCard/StartHereCard.tsx` |                    5 |
| `src/screens/templates/PostImportSetupSheet/SetupCard.tsx`               |                    5 |
| `src/screens/templates/PostImportSetupSheet/PostImportSetupSheet.tsx`    |                    5 |
| `src/screens/AnalyticsScreen/components/EmptyState.tsx`                  |                    5 |

**Pattern:** Recently-built screens (StartHereCard, PostImportSetupSheet, TemplateListCard) adopted raw values instead of tokens. CharacterCard is long-standing.

### B. Raw `size={N}` — 152 occurrences (was 460)

A concrete action list with file:line pointers would be valuable here, but the win is already 67%. Focus remaining effort on the ~61 off-scale values (14, 18, 12, 22, 28) — these bypass the token system even when converted:

- `size={14}` (24×) → use `iconSizes.small` (16) unless visual spec demands exactly 14
- `size={18}` (19×) → use `iconSizes.medium` (20)
- `size={12}` (13×) → use `iconSizes.micro` (10) or `small` (16)

### C. Raw `borderRadius: N` — 192 occurrences (+7% since prior audit — slight regression)

`borderRadius.*` token usage also grew (193 → 222) so the ratio is roughly steady. Worth a codemod to sweep the common values (`4`, `8`, `12`, `16`, `24`) to their tokens.

### D. Inline shadow properties — 424 (flat since prior audit)

This is the lowest-adopted token category and has not moved since 2026-04-05. The 5-level shadow token (subtle, card, FAB, modal, alert) is mature but not reached for. If you touch elevation next, prefer `...shadows.card` spread over inline `shadowColor/Offset/Radius/Opacity/elevation`.

### E. Recent refactors — residual raw values

Two recent high-touch areas introduced some raw typography that should be migrated in a follow-up:

**CalendarTimeline** (11 files with raw typography after recent strength-chain refactor):

- `DayCellRing.styles.ts` — 10 raw typography occurrences (largest cluster)
- `WeekNavRow.tsx` — 6
- `ProgressText.tsx` — 4
- `InlineTrialBar.tsx` — 4
- `MiniCalendarGrid.tsx` — 3

**HabitCard** (5 files after recent 3-line description / chain connector work):

- `HabitCard.streakStyles.ts` — 6
- `HabitCard.statusStyles.ts` — 5
- `HabitCard.styles.ts` — 3
- `HabitCard.actionStyles.ts` — 1

These are not regressions relative to the app average — they're just the most actively-modified surfaces and thus collected some raw values during the redesign work. Worth a single token pass.

### F. Templates screen styles — 8 of 14 files still have some raw typography

Prior audit named 7 template style files with "zero token usage." Current state is mixed — most files now include some tokens but still use raw values too. Files with the most raw typography occurrences:

- `previewStyles.ts` — 3
- `tabStyles.ts` — 2
- `sortStyles.ts` — 2
- `formStyles.ts` — 2
- `categoryStyles.ts` — 2

### G. Side concern: non-SyncStatus hardcoded hex residue

Agent reported `src/components/CalendarTimeline/components/MiniCalendarGrid.helpers.ts` contains 6 hardcoded hex values (`#10b981`, `#f59e0b`, etc.) in helper functions. Recommend converting to the semantic `streak.*` / `success` / `warning` tokens.

---

## Regression Watch — None found

None of the prior-audit wins have regressed. Specifically verified:

- `fontWeight: '800'` — still 0
- `fontWeight: 'bold'` — still 0
- `padding: 20` (off-grid) — no new production instances
- Hardcoded `'#ffffff'` in SuccessContent — still tokenized

---

## Prioritized Action List (ranked by ROI)

### Tier 1 — Trivial, ship today

1. **Fix `SortOptionRow.tsx:50`** — change `strokeWidth={2.25}` → `strokeWidth={2.5}`. Eliminates the last production `2.25` instance. <2 min.

2. **Fix 4 remaining production raw `fontWeight` values** — 2 lines in `CustomizeSection.tsx`, 2 in `TemplatePreviewModal.tsx`. Replace `fontWeight: '600'` with `fontWeight: fontWeights.semibold`. <5 min.

3. **Tokenize `MiniCalendarGrid.helpers.ts`** — 6 hardcoded hex in one helper file. Use `colors.streak[*]`, `colors.success`, `colors.warning`. <15 min.

### Tier 2 — High-impact codemod opportunities

4. **`CalendarTimeline` + `HabitCard` typography sweep** — 16 files in two related areas. Because both are post-refactor and actively maintained, a single token-migration pass here is high-impact. Maybe 1–2 hours.

5. **Off-scale icon sizes** — address the ~61 `size={14|18|12|22|28}` occurrences. Each is a design decision — either add new tokens (`iconSizes.xsmall = 14`?) or normalize to nearest existing token.

### Tier 3 — Long-tail polish

6. **Shadow inline → token migration** — 424 inline properties, flat since last audit. Lowest-adopted category. Requires touching many files. Most beneficial if done as a codemod or when revisiting elevation design.

7. **Remaining raw `fontSize`** — 270 occurrences. CharacterCard (8) is the largest single file; everything else is <6 per file. Codemod candidate.

---

## Methodology Notes

- All counts are from direct `grep` run in the main session, not transcribed from agent summaries. Where agents returned numbers that didn't match direct greps, the direct-grep counts were used.
- Exclusion filter: `src/theme/**`, `__tests__/**`, `__mocks__/**`, `*.test.*`, `*.spec.*`.
- Palette/data files (category colors, confetti configs, CharacterScreen constants) are _not_ counted as hex violations — those are legitimate data.
- `grep` results for borderRadius / `iconSizes` / `strokeWidth={2.25}` include zero-match verification via exit code.

## Files referenced

Prior audits:

- `UI_CONSISTENCY_AUDIT.md` (2026-02-03)
- `UI-REVIEW.md` (2026-03-19)
- `DESIGN_CONSISTENCY_REVIEW.md` (2026-04-05)

Remediation PR of note: **#1233** (commit `d01705a9a`) — "design token remediation — fontWeight, iconSizes, typography, shadows, sync colors". This single PR is responsible for most of the delta in this report.
