# Settings Redesign — 02: Target IA & Design Principles

> **Part 2 of the `docs/settings-redesign/` audit package.** This document turns the audit in `01-audit-and-current-ia.md` into a decision: the **target "settings-only" information architecture** (sections → rows, and exactly what moves where), followed by the **design principles** the visual-spec author must honour — every one bound to a real token or convention already in the codebase. It is a planning/product-design artifact for a downstream visual-spec author + Open Design run. **No production code is touched by this document.**
>
> Companion docs: `01-audit-and-current-ia.md` (teardown of the current implementation + Non-Settings Inventory), `03-risks-and-recommendations.md` (ranked risks + row-by-row recommendations), `00-README.md` (index).
>
> **The governing constraint (owner):** *"Settings should be only settings."* Everything below is downstream of that one sentence. Where a choice trades against a prior mock or spec, it is called out inline and re-litigated in `03`.

---

## 0. The decision, in one paragraph

The Settings landing today opens with a **read-only analytics dashboard** — profile hero with a streak headline, a weekly-completion ring, and a three-metric stat strip — and only *then* shows a setting (`01 §6`). The target IA **deletes that dashboard from the Settings landing entirely.** The profile hero shrinks to an **identity + navigation** row (avatar, name, plan label, chevron → Account) and nothing else. The streak headline, the weekly ring, and the three-metric strip **relocate to the Account page**, which becomes the single canonical home for "who you are and how you're doing." The duplicate strip already on the Account page (`ProfileCard.tsx:98`) is what they merge into, so relocation *removes* a duplicate rather than adding a surface. After this move the Settings landing is a clean vertical of preference sections — every row either changes app state or navigates to a place that does.

---

## 1. Target information architecture

### 1.1 Landing (`settings` view) — after the move

The landing keeps its two-group structure (primary + secondary, `01 §5`) but the **hero is reduced** and **no analytics render**. Rows are unchanged from today's preferences unless a "Change" column says otherwise.

| # | Section | Rows | Change vs. current | Source of the change |
|---|---|---|---|---|
| 0 | **Account entry** (reduced hero) | avatar · name · plan label · chevron → `account` | **Strip** streak headline, weekly ring, 3-stat strip. Hero becomes one identity/nav row. | `01 §6` — streak/ring/strip = RELOCATE |
| 1 | **Subscription status** (`ProSettingsCard`) | trial/premium status **or** upgrade CTA | **Reframe** as calm status, not upsell. Keep placement. | `01 §6` — KEEP (reframe); single-tier monetization |
| 2 | **Look & Feel** | Calendar look → · Theme · Default growth icons · Compact habit cards | Unchanged (verify theme-control history — `§3.7`, `03`) | current IA |
| 3 | **Reminders** | Streak Reminders toggle · reminder inset (time) | Unchanged | current IA |
| 4 | **Habits** | Sort order · Completion sound · Archived habits → *(count badge)* · Export habits data | Unchanged; **keep** the archived-count badge (wayfinding, not a dashboard) | `01 §6` — badge KEEP |
| 5 | **Support** | Rate · Share · Send Feedback · What's New | Unchanged | current IA |
| 6 | **About footer** | Privacy · Terms · version | Unchanged | current IA |

**What leaves the landing:** the three RELOCATE items from the Non-Settings Inventory (`01 §6`) — streak headline (`ProfileHeroIdentity.tsx:51-63`), `WeeklyCompletionRing` (`ProfileHeroCard.tsx:62-66`), and `ProfileStatsRow` (`ProfileStatsRow.tsx:16-70`). Nothing new is added to the landing.

### 1.2 The reduced hero — identity + navigation only

The hero card (`ProfileHeroCard.tsx`) is decomposed to its identity + nav parts and loses its analytics children:

| Keep | Evidence | Drop | Evidence |
|---|---|---|---|
| Avatar (gradient ring, image or initial) | `ProfileHeroAvatar.tsx:16-57` | Streak headline ("N day streak") | `ProfileHeroIdentity.tsx:51-63` → Account |
| Name + plan badge (PRO/Trial) | `ProfileHeroIdentity.tsx:29-50` | Weekly-completion ring | `WeeklyCompletionRing.tsx:24-106` → Account |
| Whole-card tap → `account` view | `helpers.ts:30` | 3-stat strip (Active/Flawless/Lifetime) | `ProfileStatsRow.tsx:16-70` → Account |

After the reduction the hero renders **no `useProfileStats()` call** — which is what severs the Convex read-path coupling in `01 §7` (the landing stops pulling `habits.list` + `habits.getTracking` full-history + `users.currentUser` just to open Settings). This is the performance win; re-homing the read cleanly on Account is a `03` risk.

The reduced hero should read as a **navigation row**, i.e. warm-stone neutral tint per `settingsColors` (`§3.1`) — it *navigates*, it does not *change state*. (The current hero is styled as a hero card; the redesign may keep a slightly larger identity treatment, but the tint semantics say "nav.")

### 1.3 Account page (`account` view) — the new home for stats

The Account page (`AccountPage.tsx`) already renders `ProfileCard` → `PremiumStatus` → `AccountActionsCard` → `AccountDangerCard` (`01 §5.4`). It **absorbs the relocated analytics** by keeping exactly one stat strip:

| Target order | Content | Change | Evidence |
|---|---|---|---|
| 1 | Profile identity (avatar, name, plan) | Keep | `ProfileCard.tsx` |
| 2 | **Progress block** (streak · weekly ring · 3-stat strip) | **This is the relocated dashboard.** Collapse the existing duplicate strip and the incoming landing strip into ONE. | `ProfileCard.tsx:98` (existing) + relocated `ProfileStatsRow`/ring/streak |
| 3 | `PremiumStatus` | Keep (distinct gradient CTA — do **not** wrap in `SettingsSection`; gotcha from SPEC v2) | `AccountPage.tsx:61` |
| 4 | `AccountActionsCard` (edit profile/email/restore) | Keep | `AccountPage.tsx:64` |
| 5 | `AccountDangerCard` (sign out / delete) | Keep | `AccountPage.tsx:67` |

**Canonicalization rule:** there must be exactly **one** rendered `ProfileStatsRow`/ring/streak across the whole Settings modal after this change — on Account. The Account page currently duplicates the landing (`01 §6` REMOVE-dedupe); relocation *merges into* that copy instead of creating a third.

### 1.4 The Account-vs-dedicated-Stats-surface decision

The audit named two candidate homes for the relocated analytics: **Account/Profile** or a **dedicated Stats surface** (`01 §10`).

**Decision: Account/Profile — not a new surface.** Rationale:

- **A home already exists.** Account already renders the identical strip (`ProfileCard.tsx:98`). Relocating *there* turns a REMOVE-dedupe into a merge — zero net new surfaces, one fewer duplicate.
- **The read-path re-homes naturally.** `useProfileStats()` already lives behind the Account navigation; keeping the stats there means the expensive `habits.getTracking` read fires **only when the user opens Account**, not on every Settings open (`01 §7`). A brand-new Stats surface would re-introduce the same coupling somewhere new.
- **Scope discipline.** A dedicated Stats screen is a *feature*, not a *relocation*. The constraint is "make Settings only settings," not "build an analytics product." Shipping a new surface expands scope and decomposition fan-out (`03`).
- **Escape hatch preserved.** If a first-class Stats/Insights destination is later wanted, the relocated block on Account is the seed for it — nothing here blocks that. The visual spec should treat the Account progress block as *movable*, not *load-bearing*.

The spec author should therefore design the **Account progress block** as the analytics home and leave a one-line note that it is the extraction point for a future Stats surface.

### 1.5 Loading behaviour follows the move

`SettingsModalSkeleton.tsx:76` currently renders a `ProfileHeroSkeleton` — i.e. the app skeletons the analytics dashboard on the landing (`01 §5.5`). After the reduction, the **landing skeleton drops the stats skeleton** (there is no dashboard to gate) and the **stats skeleton moves to the Account page** load path. This keeps the skeleton honest about what each surface actually shows.

---

## 2. What this IA deliberately does NOT do

Stated so the spec author does not "helpfully" re-add removed things:

- **Does not add new stats, badges, rings, or a Stats tab to the landing.** The move is subtractive. Prior mocks that *added* stats to Settings are explicitly overridden (`03`; `.superdesign/design_iterations/settings_improvements_plan_1.html`, `settings_bestof_1.html`, OD `chainday-settings-improved-2.html`).
- **Does not wire search.** Search plumbing stays inert or gets deleted — that is a `03` recommendation, not part of this IA. Do not design a search field into the target unless `03` resolves it.
- **Does not revive accordions.** Sections stay static label groups (`01 §4`). The IA is a flat vertical, not a collapsible one.
- **Does not add monetization tiers.** Single-tier app — no crowns, no "unlock," no freemium gating (`01 §6`, `03`).
- **Does not remove theme controls without checking history** — dark-mode toggle was deliberately removed once (`docs/specs/settings/disable-dark-mode-temporarily.md`); the Theme row stays as-is pending `03`.

---

## 3. Design principles (bound to real tokens)

Every principle below points at a concrete file so the spec author stays visually consistent with the app as it exists — not an invented style.

### 3.1 Calm-not-rainbow colour discipline — `src/theme/settingsColors.ts`

The settings icon system is a **two-tone calm palette**, not a saturated rainbow. Meaning is carried by two warm tones:

- **Green tint** = a row that **changes app state** (switches, the account hero-as-state). Light `{ icon:#047857, bg:#E2F1EA }`, dark `{ icon:#34D399, bg:rgba(52,211,153,0.14) }`.
- **Warm-stone neutral** = a purely **navigational** row (Support links, and — per `§1.2` — the reduced hero). Light `{ icon:#6B6560, bg:#E9E4DD }`, dark `{ icon:#A8A29E, bg:rgba(168,162,158,0.14) }`.
- **Red** = **destructive** only (sign out / delete). Light `{ icon:#B53030, bg:#FEE2E2 }`, dark `{ icon:#FCA5A5, bg:#4B1F1F }`.

**Rule for the spec author:** do not introduce per-section hues. New rows inherit one of these three semantics. Burnished-gold stays reserved for streak emphasis (<10% of area) and does not enter the settings row palette.

### 3.2 Airy row + surface scale — `src/theme/airyScale.ts`

Settings runs at **full airy** proportions (`AIRY_SCALE = true`). Bind spacing/radii to these tokens, never magic numbers:

| Token | Value (airy) | Applies to |
|---|---|---|
| `tileSize` | 42 | settings-row icon tile |
| `tileRadius` | 13 | icon tile corner |
| `rowPaddingV` | 20 | vertical row padding |
| `cardRadius` | 24 | each `SettingsSection` card |
| `modalRadius` | 28 | modal surface (top corners zeroed by the full-screen shell) |
| `sectionGap` | 16 | gap between sections |
| `controlHeight` | 48 | toggles/segmented controls |

The one dense exception (`habitCardMinHeight:88`) is the home habit list, **not** Settings — Settings is uniformly airy.

### 3.3 Type pairing — `src/theme/typography.ts`

- **Literata** (serif) = display / H1 / editorial. The `SettingsHeader` editorial kicker + serif title use this (`SettingsHeader.tsx`). Section relocations must not turn serif headers into sans.
- **DM Sans** (`DMSans`) = all body, UI, row labels, H2/H3.
- **JetBrains Mono** = numeric emphasis (stat values on the relocated Account progress block are a legitimate mono home — the numbers left Settings but keep their type treatment on Account).
- **OpenDyslexic** = the a11y toggle; every choice must survive that swap.

### 3.4 Motion — `react-native-reanimated` v4

- Section/row entrance: **`FadeInDown`** staggered by `durations.stagger` (60ms) — the existing landing stagger (`SettingsContent.constants.ts:4-12`). The reduced hero + surviving sections keep this.
- Sub-page transitions: reduce-motion → `FadeIn`/none; back-to-`settings` → `SlideInLeft`; forward → `SlideInRight` (`SettingsMainView.animations.ts:7-27`). Relocating stats to Account rides the **existing forward/back** transition — no new nav motion needed.
- Springs: state-change interactions use **`springs.standard` `{ damping:18, stiffness:150 }`**; expandable pickers use **`springs.gentle`** via `useExpandAnimation` (gotcha: accordion/expand motion must not hand-roll timing). The full-screen shell itself **fades in** (`withTiming`, `runEnterAnimation.ts`) — it does **not** spring; do not "upgrade" the shell entrance to a spring.

### 3.5 The shell is a committed full-screen Modal — not a sheet

Settings is the bespoke `Modal` in `variant='fullScreen'` with `disableBackdropClose`, `disableGestureClose`, `backdropOpacity=0` (`SettingsModal.tsx:31-40`). Design for a **committed screen** with an explicit header/back affordance, not a peekable bottom sheet. Back interception resets sub-views to `settings` before it ever closes (`SettingsModal.tsx:23-29`) — the relocated Account page inherits this for free (its `onBack` → `setView('settings')`).

### 3.6 Reuse the row/section primitives — do not reinvent

The redesign composes existing primitives:

- **`SettingsSection`** — card wrapper (`cardRadius` + `shadows.card`); accordion branch stays dormant (`01 §4`).
- **`SettingsRow`** — one component, four types: **`'toggle' | 'navigation' | 'selection' | 'info'`** (`SettingsRow.types.ts`), plus badge/accessory slots and per-type haptics (toggle→Medium, selection→Selection, navigation→Light). Every landing row maps to one of these four; the archived-count badge is the `navigation` + badge case.
- **`AnimatedPressable`**, **`Button/`**, **`Modal/`**, **`SettingsHeader`** (editorial kicker + serif title). `PremiumStatus` stays a **distinct gradient CTA** outside `SettingsSection` (SPEC v2 gotcha).

### 3.7 ≤100-line decomposition rule (repo-enforced)

`max-lines` ≤ 100 (blanks/comments excluded) is enforced. This shapes *how* the hero reduction ships: `ProfileHeroCard` decomposes so the analytics children (`WeeklyCompletionRing`, `ProfileStatsRow`, streak line) **detach cleanly** and re-mount under the Account progress block, leaving a small identity/nav hero. Note the current sole violator to fix if touched: `GrowthIconsSettingsRow.tsx` (114 lines, `01 §8`). New files follow the component-decomposition layout (`ComponentName/` with `index.ts` barrel + `.hooks.ts` + `.types.ts` + `components/`) from the project's Code Readability Initiative.

### 3.8 Honesty principle (carried from the audit)

A settings *preview* must reflect the setting it previews. The `CalendarPreview` "lying preview" (`01 §9`) renders a hardcoded thriving four-day week while claiming to show "**your** calendar." The target keeps the preview (it legitimately previews a *style* setting) but the spec must either (a) drive it from real user data or (b) drop the "your habits" framing to an explicit "Sample" label — and fix the `'small'`/`'full'` connector collapse (`01 §9`). No settings surface should assert data it does not render.

---

## 4. Row-semantics crosswalk (for the spec author)

Every target-landing row, mapped to its `SettingsRow` type + `settingsColors` tint, so the visual spec is unambiguous:

| Row | `SettingsRow` type | Tint (`§3.1`) |
|---|---|---|
| Account entry (reduced hero) | navigation | warm-stone neutral |
| Subscription status / upgrade | (custom `PremiumStatus` CTA — not a `SettingsRow`) | gradient CTA (outside `SettingsSection`) |
| Calendar look → | navigation | warm-stone neutral |
| Theme | selection | green (changes state) |
| Default growth icons | selection (expandable) | green |
| Compact habit cards | toggle | green |
| Streak Reminders | toggle | green |
| Reminder time | selection/info | green |
| Sort order | info+chevron (expandable) | green |
| Completion sound | selection (expandable) | green |
| Archived habits → *(badge)* | navigation + badge | warm-stone neutral |
| Export habits data | navigation | warm-stone neutral |
| Rate / Share / Feedback / What's New | navigation | warm-stone neutral |
| Privacy / Terms | info link | (footer text, no tile) |

The pattern the spec should internalize: **green = it flips a switch in the app; stone = it takes you somewhere; red = it destroys something.** Nothing on the landing is analytics.

---

## 5. Handoff

The target is set: a subtractive, settings-only landing; a reduced identity/nav hero; the analytics dashboard relocated to a single canonical Account progress block; and every visual choice bound to `settingsColors`, `airyScale`, `typography` (Literata/DM Sans), reanimated springs, the full-screen `Modal` shell, and the ≤100-line rule. From here:

- `03-risks-and-recommendations.md` — the ranked risks this IA incurs (reversing recent stats-adding momentum incl. the named prior mocks; single-tier monetization vs upsell crowns; dark-mode-removal history; decomposition fan-out; the duplicate-stats + Convex read-path coupling of `01 §7` when relocating) and concrete row-by-row recommendations, pointing at `frontend-design:frontend-design` and the `.superdesign` + OD precedent library for the downstream build.
- Downstream target: the empty Open Design **"Settings Page Fable"** project (`892e01b2-300e-4c8e-801f-50efe31f7010`) for the visual spec/build.
