# Settings Redesign — 01: Audit & Current Information Architecture

> **Part 1 of the `docs/settings-redesign/` audit package.** This document is a teardown of Chain Day's **current** Settings implementation: how it is presented, how it navigates, what is dead, the full current IA (sections → rows), and — the centrepiece — a **Non-Settings Inventory** with a KEEP / RELOCATE / REMOVE verdict per item. It is a planning/product-design artifact for a downstream visual-spec author + Open Design run. **No production code is touched by this document.**
>
> Companion docs: `02-target-ia-and-principles.md` (the "settings-only" target IA + design principles), `03-risks-and-recommendations.md` (ranked risks + row-by-row recommendations), `00-README.md` (index).
>
> **All `file:line` references are relative to the repo root and were verified against `src/**` on 2026-07-20.** Paths shown without a directory prefix live under `src/components/SettingsModal/`. Where this audit contradicts `docs/SPEC_settings-improvements-v2.md` (dated 2026-06-11), the code as it stands today wins — noted inline.

---

## 0. One-paragraph summary

Settings is a bespoke full-screen `Modal` housing a hand-rolled 4-view state machine (`settings | account | calendar | archived`). The main list opens not with a setting but with a **read-only analytics dashboard** — a profile hero showing avatar, name, a current-streak headline, a weekly-completion ring, and a three-metric stat strip (Active Habits / Flawless Days / Lifetime Completions) — that forces three Convex reads (`habits.list`, `habits.getTracking` over full history, `users.currentUser`) purely to render numbers no one came to Settings to change. Two whole capabilities are compiled in but inert: **search** (provider mounted with a hardcoded empty query) and **section accordions** (the `collapsible` flag is never passed). One section (`DataPrivacySection`) is orphaned; the historically-dead `AccountRow` chain has since been deleted. And the calendar "preview" advertises itself as reflecting the user's real habits while rendering a hardcoded four-day mock. The single biggest redesign move, established across this package: **strip the analytics dashboard out of the Settings landing so Settings is only settings.**

---

## 1. Shell & presentation

Settings is **not** a bare React Native `Modal` — it is the project's own `Modal` component in `variant='fullScreen'`.

| Concern | Detail | Evidence |
|---|---|---|
| Entry / error boundary | `SettingsModal` wraps `SettingsModalContent` in an `ErrorBoundary` whose fallback is `SettingsModalFallback` (same full-screen shell, renders `ScreenErrorFallback`) | `SettingsModal.tsx:81-94`, `components/SettingsModalFallback.tsx:14-31` |
| Modal flags | `variant='fullScreen'`, `disableBackdropClose`, `disableGestureClose`, `backdropOpacity={0}` — a committed, non-dismissable-by-gesture screen, not a peekable sheet | `SettingsModal.tsx:31-40` |
| Shell style | `fullScreenModalStyle` only zeroes the top corner radii (`borderTopLeftRadius/Right: 0`) | `SettingsContent.constants.ts:21-24` |
| Underlying Modal | Wraps RN `Modal` with `transparent`, `statusBarTranslucent`, `animationType='none'` — RN's own animation is off; **all motion is hand-rolled in reanimated** | `Modal/Modal.tsx:110-142` |
| Enter motion | Full-screen variant **fades/times in** (`withTiming(1, fadeIn(FULL_SCREEN_ENTER_MS))`) — it does **not** spring. Springs (`springs.bottomSheet`, `springs.settle`) are reserved for the sheet/alert variants | `Modal/runEnterAnimation.ts:6-7,43,52` |
| Open / close | Opened lazily by the parent via `lazy(() => import('.../SettingsModal'))`, rendered with `visible`/`onClose` | `features/habits/components/HabitsModals/SettingsModalSection.tsx:17-18,151,177,198` |
| Back interception | `handleRequestClose`: if the current view isn't `settings`, reset to `settings` instead of closing; only the root view actually calls `onClose()` | `SettingsModal.tsx:23-29` |

**Component tree (Modal → sections):**

```
SettingsModal (ErrorBoundary)                         SettingsModal.tsx:81
└─ SettingsModalContent → Modal variant='fullScreen'  SettingsModal.tsx:15,32
   └─ (RNModal → FullScreenContent, reanimated)       Modal/FullScreenContent.tsx:31-51
      └─ SettingsMainView                             components/SettingsMainView.tsx:9
         └─ Animated.View key={view} entering=…        SettingsMainView.tsx:27
            └─ renderSettingsMainViewContent(props)     SettingsMainView.renderContent.tsx:12
               └─ (view==='settings')
                  ├─ SettingsHeader                     renderContent.tsx:63
                  └─ SettingsContent (Animated.ScrollView)  renderContent.tsx:64 / SettingsContent.tsx:48
                     └─ SettingsSearchProvider query=''      SettingsContent.tsx:57   ← inert, see §3
                        └─ SettingsSectionList               SettingsContent.tsx:59
                           ├─ SettingsPrimarySections        SettingsSectionList.tsx:21
                           └─ SettingsSecondarySections      SettingsSectionList.tsx:22
```

**Tokens in play (for visual continuity in the redesign):** `airy.sectionGap` (16) for the section `gap`, `airy.cardRadius` (24) + `shadows.card` on each `SettingsSection` (`SettingsContent.tsx:10,58`, `SettingsSection.tsx:5,36-38`); row tokens available but under-used here: `tileSize:42`, `tileRadius:13`, `rowPaddingV:20`, `controlHeight:48` (`theme/airyScale.ts:23-31`). Section glyphs pull one uniform calm tint (`themeColors.settings.user.icon` — light `#047857`, dark `#34D399`) via `SettingsContent.tsx:18-22`. Stagger entrance uses `FadeInDown` + `durations.stagger` (60ms) (`SettingsContent.constants.ts:4-12`).

---

## 2. In-modal navigator

There is **no navigation library** — no React Navigation, no tabs, no stack. Sub-navigation is a hand-rolled **4-way `view` state machine** with a directional reanimated transition driven by remounting on `key={view}`.

- State lives in `useSettingsModalLogic`: `view: 'settings' | 'archived' | 'account' | 'calendar'` plus `viewDirection: 'forward' | 'back' | 'none'` (`SettingsModal.hooks.ts:22-27`). `setView` picks `'back'` when returning to `settings`, else `'forward'` (`SettingsModal.hooks.ts:39-45`).
- Content is a plain `switch (props.view)`:

| View | Renders | Reached from | Evidence |
|---|---|---|---|
| `settings` | `SettingsHeader` + `SettingsContent` (or `SettingsModalSkeleton` while loading) | root | `renderContent.tsx:58-69` |
| `account` | `AccountPage` | Profile hero tap (`onOpenAccount`) | `renderContent.tsx:25-33`, `helpers.ts:30` |
| `calendar` | `CalendarLookPage` | "Calendar look" row (`onOpenCalendarLook`) | `renderContent.tsx:35-57`, `helpers.ts:32` |
| `archived` | `ArchivedHabitsModal` | "Archived habits" row (`onOpenArchivedHabits`) | `renderContent.tsx:17-24`, `helpers.ts:31` |

- Transition rules: reduce-motion → `FadeIn`/none; back-to-`settings` → `SlideInLeft`; forward → `SlideInRight`; else `FadeIn` (`SettingsMainView.animations.ts:7-27`). Each sub-page's `onBack` calls `setView('settings')`.
- `SettingsSectionList` does **not** switch views — it statically renders `SettingsPrimarySections` then `SettingsSecondarySections` (`SettingsSectionList.tsx:18-33`). There is no route registry or `<Navigator>` abstraction — just the string union and the `switch`.

---

## 3. Dead capability A — Search (compiled, inert)

The search subsystem is fully written and threaded through the render tree, but it never changes behaviour: the sole provider is mounted with a **hardcoded empty query**, and there is no text input anywhere feeding it.

- Only mount site: `SettingsContent.tsx:57` → `<SettingsSearchProvider query=''>`. The comment directly above states: *"Search field temporarily removed — filter plumbing retained (see SPEC_03)"* (`SettingsContent.tsx:15`).
- `useSettingsSearch` returns `isSearching: query.length > 0` (`search/SettingsSearchContext.tsx:29-32`) — with `query=''`, `isSearching` is permanently `false` and every match helper short-circuits to "show everything."
- The plumbing **is** consumed at runtime (so it isn't tree-shaken) but is behaviourally a no-op: section gating in `SettingsPrimarySections.tsx:21,40,52,65` and `SettingsSecondarySections.tsx:19,23`; row gating in `SettingsRow.tsx:37-42` (`if (!rowVisible) return null`); plus `GrowthIconsSettingsRow.tsx:31,100`, `BehaviorSection.tsx:46,62,81`, `StreakRemindersSection.tsx:21,53`.
- Data: `search/settingsSearchSections.ts:12-36` (`SETTINGS_SEARCH_SECTIONS`) + `sectionHasMatch`. `anySectionMatches` is exported but **never consumed** anywhere in `src/` — dead within dead (`settingsSearchSections.ts:50`, re-exported `search/index.ts:9`).

**Verdict: DEAD (inert).** Every match path evaluates to "always visible." Either wire a real search field or delete the plumbing — the redesign should decide, not inherit ambiguity.

---

## 4. Dead capability B — Section accordions (compiled, unreachable)

Every section renders through `SettingsSection`, which has a `collapsible` branch — but **no call site ever sets `collapsible`, so the accordion path is never mounted.**

- `SettingsSection`'s `collapsible` prop **defaults to `false`** (`SettingsSection.tsx:27`); a repo-wide grep for `collapsible=` returns **zero** call sites. Every real section (`AppearanceSection.tsx:15`, `StreakRemindersSection.tsx:43`, `BehaviorSection.tsx:49`, `AboutSupportSection.tsx:33`) mounts it with no flag → always the static branch (`SettingsSection.tsx:56-63`).
- Because the guard is never true, `CollapsibleSectionCard` (`SettingsSection.tsx:41-54`) never mounts, so `useSettingsSectionAccordion` (its only caller, `CollapsibleSectionCard.tsx:29`) never executes.

**Verdict: DEAD (unreachable).** ⚠️ **This reverses a claim in `SPEC_settings-improvements-v2.md`** ("`useSettingsSectionAccordion.ts` is NOT dead code… the engine of every section accordion — do not delete it"). That was true in June 2026; the sections have since been converted to static label groups (SPEC v2 Phase 4 Decision 3B), leaving the accordion hook + card orphaned on current `main`. `IMPLEMENTATION_PLAN.md` already reflects the current state: "Accordion capability present but unused (all sections static)."

---

## 5. Current Information Architecture (sections → rows)

The Settings landing (`settings` view) renders two static groups. Sub-pages (`account`, `calendar`, `archived`) are reached by drill-down. Ordered top-to-bottom.

### 5.1 Landing — primary group (`components/SettingsPrimarySections.tsx`)

| # | Section | file:line | Rows | Control | Reads → writes | Data source |
|---|---|---|---|---|---|---|
| 0 | **Profile hero** (`ProfileHeroCard`) | `SettingsPrimarySections.tsx:30` | avatar · name · streak headline · weekly ring · 3-stat strip (whole card taps to Account) | Navigation + **analytics** | name/stats/image | Convex (`habits.*`, `users.currentUser`) + Clerk — **see §6, this is non-settings** |
| 1 | **Pro card** (`ProSettingsCard`) | `SettingsPrimarySections.tsx:34` | `TrialCard` **or** `PremiumUpsellCard` (conditional; `null` if premium active; hidden while "searching") | Button (upgrade CTA) | `usePremium()` status/expiration/price | `usePremium` (RevenueCat/Convex) — **adjacent non-settings, §7** |
| 2 | **Look & Feel** (`AppearanceSection`) | `SettingsPrimarySections.tsx:42` | Calendar look → · Theme · Default growth icons · Compact habit cards | — | — | — |
| 3 | **Reminders** (`StreakRemindersSection`) | `SettingsPrimarySections.tsx:54` | Streak Reminders toggle · reminder inset (time + upsell) | — | — | — |
| 4 | **Habits** (`BehaviorSection`) | `SettingsPrimarySections.tsx:67` | Sort order · Completion sound · Archived habits → · Export habits data | — | — | — |
| 5 | *(stagger index skipped)* | — | — | — | — | vacated slot of the orphaned `DataPrivacySection` — **§7** |

**Look & Feel rows** (`sections/AppearanceSection.tsx`):

| Row | file:line | Control | Reads → writes | Data source |
|---|---|---|---|---|
| Calendar look | `AppearanceSection.tsx:16` | Navigation → `calendar` view | — | — |
| Theme (`ThemeSettingsRow`) | `AppearanceSection.tsx:29` / `ThemeSettingsRow.tsx:18` | segmented (light/dark/system) via `ThemePicker` accessory | `darkModePreference` → `update({darkMode})` | Convex `settings.darkMode` + optimistic local |
| Default growth icons (`GrowthIconsSettingsRow`) | `AppearanceSection.tsx:33` / `GrowthIconsSettingsRow.tsx:82` | expandable `ProgressEmojiPicker` | `settings.progressEmojis` / `customProgressEmojis` | **Convex direct** — `useCachedQuery`/`useMutation(api.settings.update)`, bypasses the shared updaters ⚠️ |
| Compact habit cards (`AppearanceDisplayRows`) | `AppearanceSection.tsx:34` / `AppearanceDisplayRows.tsx:16` | Toggle | `compactView` → `update({compactView})` | Convex `settings.compactView` + optimistic local |

**Reminders rows** (`StreakRemindersSection/StreakRemindersSection.tsx`):

| Row | file:line | Control | Reads → writes | Data source |
|---|---|---|---|---|
| Streak Reminders | `StreakRemindersSection.tsx:44` | Toggle | `enabled` → `onToggleStreakReminders` | **parent-supplied props** (not the local updaters) |
| Reminder inset (`ReminderInsetCard`) | `StreakRemindersSection.tsx:55` | time picker + premium upsell row | `reminderTime` → `onChangeStreakReminderTime` | parent props; hidden while "searching" |

**Habits rows** (`components/BehaviorSection.tsx`):

| Row | file:line | Control | Reads → writes | Data source |
|---|---|---|---|---|
| Sort order | `BehaviorSection.tsx:53` | info+chevron, expands `SortOrderPicker` (7 modes) | `habitSortMode` → `update({habitSortMode})` | Convex `settings.habitSortMode` (default `'manual'`) |
| Completion sound | `BehaviorSection.tsx:68` | selection row + expandable `SoundPicker` | `completionSoundEnabled/Type` → parent props | parent-supplied props |
| Archived habits (`HabitDataRows`) | `HabitDataRows.tsx:22` | Navigation + **count badge** | `archivedHabitsCount` | prop — **badge is a live count, §6/§7** |
| Export habits data (`HabitDataRows`) | `HabitDataRows.tsx:31` | Navigation/button | — | prop |

### 5.2 Landing — secondary group (`components/SettingsSecondarySections.tsx`)

| Section | file:line | Rows | Control |
|---|---|---|---|
| **Support** (`AboutSupportSection`) | `SettingsSecondarySections.tsx:25` | Rate Chain Day · Share with Friends · Send Feedback · What's New | Navigation (`onRate`/`onShare`/`onFeedback`/`onWhatsNew`) — `AboutSupportSection.tsx:37,44,51,58` |
| **About footer** (`AboutFooter`) | `SettingsSecondarySections.tsx:37` | Privacy Policy · Terms · version caption (hidden while "searching") | Text links + expo-constants version |

### 5.3 Sub-page — Calendar look (`calendar` view, `CalendarLookPage.tsx`)

`CalendarPreview` (`:56`) → Day shape (`DayMarkerShapeSettingsRow`, `:63`, segmented circle/square) → Gradient fill (`AppearanceChainRows`, `:67`) → Connector style (`ConnectorStyleSettingsRow`, `:71`, picker) → Completion icon (`CompletionIconSettingsRow`, `:76`, segmented) → Sticky month header toggle (`:80`). Writes via `setConnectorStyle` / `setShowGradientFill` / `onChangeDayShape` / `onChangeHabitCompletionIcon`. **The preview at the top of this page is the lying preview — §8.**

### 5.4 Sub-page — Account (`account` view, `AccountPage.tsx`)

`ProfileCard` (`:58`) → `PremiumStatus` (`:61`) → `AccountActionsCard` (`:64`) → `AccountDangerCard` (`:67`, sign out + delete) → version caption (`:74`), each in an `AccountSection` stagger wrapper. **`ProfileCard` re-renders the same stat strip as the landing hero — a duplicate, §6/§7.**

### 5.5 Persistence model

- **One write path:** Convex mutation `api.settings.update` (`SettingsModal.hooks.ts:29,51-64`). `createSettingsUpdaters` merges the full settings doc + patch through `updateSettingsWithFallback` / `sanitizeSettingsPayload`.
- Prefs through the shared updaters: `compactView`, `connectorStyle`, `darkMode`, `habitSortMode`, `reduceMotion`, `showGradientFill` (`SettingsModal.settingsUpdaters.ts:16-39`).
- `useSettingsLocalPrefs.ts:9-42` holds an **in-memory optimistic mirror** of 5 prefs, re-synced from the Convex doc via `useEffect` (`:20-28`). "Local" ≠ AsyncStorage; source of truth is Convex.
- **Two exceptions to the single write path** (both are redesign smells): `GrowthIconsSettingsRow` writes Convex directly, and `completionSound*` + `streakReminder*` arrive as **parent props**, not through the updaters.
- `useSettingsReady` gates whether real settings data can be shown (`auth/useSettingsReady.ts:16-34`); `SettingsModalSkeleton.tsx` is the loading placeholder — note it renders a `ProfileHeroSkeleton` (`:76`), i.e. the app skeletons the analytics dashboard too.

---

## 6. Non-Settings Inventory

The redesign constraint is **"Settings should be only settings."** Everything below is content the Settings surface renders that is **not a preference**. Verdict legend: **KEEP** (legitimately belongs on a settings surface) · **RELOCATE** (real content, wrong home — move to Account/Profile or a dedicated Stats surface) · **REMOVE** (duplicate or dead).

| Item | file:line | What it renders | Data source | Verdict | Rationale |
|---|---|---|---|---|---|
| Profile hero container | `SettingsPrimarySections.tsx:29-31` → `ProfileHeroCard.tsx:28-72` | The whole hero card as **section 0**, above any setting | composes the hooks below | **KEEP (reduced)** | An account entry-point at the top of Settings is fine; but it must shrink to **identity + navigation** and shed the analytics (rows below). |
| Avatar | `components/ProfileHeroAvatar.tsx:16-57` | Gradient-ring avatar (image or initial) | `useProfileDisplayImage()`, `useProfileDisplayName()` | **KEEP** | Identity affordance; reasonable on the account entry row. |
| Name + plan badge | `components/ProfileHeroIdentity.tsx:29-50` | User name + PRO/Trial badge | Clerk `useUser()`, `usePremium()` | **KEEP** | Identity + entitlement label; belongs with the account entry. |
| **Streak headline** | `components/ProfileHeroIdentity.tsx:51-63` | Big "N day streak" | `stats.currentStreak` | **RELOCATE** | Read-only analytics, not a setting. Belongs on Account/Profile or a Stats surface. |
| **WeeklyCompletionRing** | `ProfileHeroCard.tsx:62-66` / `WeeklyCompletionRing.tsx:24-106` | Animated SVG "N% this week" ring | `stats.weeklyCompletionRate` | **RELOCATE** | Progress visualization = analytics dashboard content. |
| **ProfileStatsRow** (3 metrics) | `ProfileStatsRow.tsx:16-70` | Active Habits · Flawless Days · Lifetime Completions | `useProfileStats()` | **RELOCATE** | The core "analytics dashboard" the constraint targets. Move wholesale. |
| ProfileStatItem tiles | rendered `ProfileStatsRow.tsx:29-57` | Numeric stat tiles + icons | `stats.activeHabits/flawlessDays/lifetimeCompletions` | **RELOCATE** | Sub-parts of the strip above; travel with it. |
| **Duplicate stats strip (Account page)** | `ProfileCard.tsx:98` (rendered `AccountPage.tsx:58`) | The **same** stat strip, again, on the Account sub-page | `useProfileStats()` | **REMOVE (dedupe)** | Two copies of identical analytics. Keep exactly one canonical home (Account/Profile is the candidate) and delete the other. |
| ProSettingsCard / TrialCard | `sections/ProSettingsCard.tsx:12-18`, `sections/TrialCard.tsx` | Upgrade CTA + trial/premium "days left" metadata | `usePremium()` | **KEEP (reframe)** | Subscription *status* is legitimate on an account surface. But **single-tier monetization** applies — present as calm status, **no crown/"unlock" upsell framing** (see `03`). |
| Archived-habits count badge | `SettingsCountBadge.tsx` on `HabitDataRows.tsx:23` | Live count of archived habits on the nav row | prop `archivedHabitsCount` | **KEEP** | A count badge on a navigation row is a wayfinding affordance, not a dashboard — it tells you how many items await. Low risk; keep. |
| Calendar preview | `CalendarLookPage.tsx:56-62` / `CalendarPreview.tsx:45-96` | Sample habit-chain week shown above the calendar-style rows | **hardcoded mock** (not user data) | **KEEP (fix)** | A live preview of a *style* setting is legitimate settings UI. But it currently lies about the data — **§8**. Keep the preview, fix the honesty. |

**Net:** the streak headline, weekly ring, and the three-metric strip are the analytics dashboard to strip from the landing; the Account-page copy is a straight duplicate to collapse. Everything else is either identity/navigation (keep) or a settings preview to repair.

---

## 7. Data-source coupling (Convex read-path)

Opening Settings forces a **live read of three Convex queries purely to render the hero dashboard** — none of it is needed to change a preference:

- `useProfileStats.ts:25-31` → **`api.habits.list`** (`convex/habits.ts:41`): drives `activeHabits`, `currentStreak`, and the tracking-window start (`profileStats.helpers.ts:16-30`).
- `useProfileStats.ts:37-41` → **`api.habits.getTracking`** (`convex/habits.ts:44`) over `startDate…today`: drives `lifetimeCompletions`, `flawlessDays`, `weeklyCompletionRate`. **This is a potentially large read** — all tracking entries since the earliest habit — triggered just by opening Settings.
- `useProfileDisplayImage.ts:11` → **`api.users.currentUser`** (`convex/users.ts:71`): avatar image.
- Aggregation lives in `profileStats.helpers.ts:32-89` (`buildProfileStats`): habit-ID sets, per-date completion maps for flawless-day counting, `calculateWeekOverWeekTrend(...).thisWeekRate` for the ring.

**Implication for the redesign:** relocating the dashboard out of Settings **severs this read path** — the Settings landing stops depending on `habits.list` + `habits.getTracking` (full history) + `users.currentUser`. That is a performance win, but the coupling must be re-homed cleanly wherever the stats land (flagged for `03`).

---

## 8. Orphaned / dead code

| Item | Status | Evidence |
|---|---|---|
| `sections/DataPrivacySection.tsx` (42 lines) | **ORPHANED** — never rendered | Only references are its own definition + the barrel re-export `sections/index.ts:4`. Corroborated by the **stagger-index gap**: primary group uses indices 0-4, secondary uses 6-7 — **index 5 is vacant**, the slot this "Data & Privacy" section used to occupy. Its rows were absorbed elsewhere (Archived/Export → Habits via `HabitDataRows`; Delete account → Account sub-page via `AccountDangerCard`). |
| `AccountRow` → `HighContrastAccountRow` → `AccountRowContent` chain | **ALREADY DELETED** | A repo-wide grep for `AccountRow` returns **zero** matches in `src/`. This ~250-line chain was the dead code flagged by `SPEC_settings-improvements-v2.md` Phase 0; that deletion has since shipped. Flagged here for completeness — **it is no longer present.** (`AccountSection.tsx` still exists but is a live stagger wrapper on the Account page, not part of that chain.) |
| `search/settingsSearchSections.ts` `anySectionMatches` | **DEAD export** | Exported + re-exported, consumed nowhere (§3). |
| `useSettingsSectionAccordion` + `CollapsibleSectionCard` | **DEAD (unreachable)** | `collapsible` never passed (§4). |
| `GrowthIconsSettingsRow.tsx` — **114 lines** | **Over the ≤100-line rule** | Repo enforces `max-lines` ≤100 (blanks/comments excluded). Every other audited Settings file is compliant; this is the sole current violator and a decomposition target for whoever touches it. |

---

## 9. The `CalendarPreview` "lying preview" bug

**Location of the lie:** `CalendarPreviewWeek.tsx:11-20` (the fabricated data), consumed by `CalendarPreview.tsx:45-96`.

**What it claims to be** — real, user-reflecting data:
- Docstring: *"live preview of how the habit calendar renders … Reuses the real `ChainDayItem` + `StrengthFillBackground` so the preview is **pixel-identical to a habit card on the list**"* (`CalendarPreview.tsx:1-7`).
- Accessibility label: *"Preview of how **your** habit calendar looks with the current appearance settings"* (`CalendarPreview.tsx:56`).

**What it actually renders** — a hardcoded mock, disconnected from any habit:

```ts
// CalendarPreviewWeek.tsx:11-20
export const PREVIEW_STRENGTH_PERCENT = 92;
const DAYS = [
  { completed: true,  strength: 35 },
  { completed: true,  strength: 55 },
  { completed: true,  strength: 75 },
  { completed: true,  strength: PREVIEW_STRENGTH_PERCENT }, // 92
  { completed: false, strength: 0 },
  { completed: false, strength: 0 },
];
```

`CalendarPreviewWeek` iterates this static array and never reads a Convex query, hook, or the user's habits/tracking. **Every user** — zero habits, all-missed days, a broken streak — sees the same thriving four-day chain ramping 35→55→75→92 with the strength-fill bar pinned to 92% width (`CalendarPreview.tsx:49-52`). The docstring's "pixel-identical to a habit card on the list" and the a11y label's "how **your** calendar looks" promise real data the render cannot deliver. The style knobs (dayShape, completionIcon, connectorStyle, showGradientFill) **are** honestly threaded through — so the lie is specifically about the **habit data / streak / strength**, not the appearance settings.

**Note — the historical `78%` discrepancy is already fixed.** `SPEC_settings-improvements-v2.md` flagged a "78% vs 92%" mismatch (fill hardcoded to 78% while the preview data peaked at 92%). Commit `430e12825 "fix(settings): derive preview fill from week data"` resolved that by tying the fill to `PREVIEW_STRENGTH_PERCENT`. **The remaining, deeper problem is that the entire preview week is a fabricated mock presented as the user's real data** — internally consistent, externally false.

**Secondary inconsistency — connector style collapses to a boolean.** `CalendarPreviewWeek.tsx:50-52` reduces the three-way `connectorStyle` (`'none' | 'small' | 'full'`) to `showConnector={Boolean(connectorStyle !== 'none' && …)}`, and `ChainDayItem` only accepts `showConnector: boolean` (`HabitChainVisualizer/ChainDayItem.tsx:39`). So **`'small'` and `'full'` render identically** in the preview even though `ConnectorStyleSettingsRow` presents them as two distinct choices — a milder "lying preview" of that specific setting.

---

## 10. Handoff

This audit establishes the current state and the single biggest move: **strip the analytics dashboard from the Settings landing.** From here:
- `02-target-ia-and-principles.md` — the "settings-only" target IA (what moves where; hero reduces to identity + navigation; stats relocate to Account/Profile or a dedicated Stats surface) plus design principles bound to the real tokens named in §1.
- `03-risks-and-recommendations.md` — ranked risks (reversing recent stats-adding design momentum; single-tier vs upsell crowns; dark-mode-removal history; decomposition fan-out; the duplicate-stats + Convex read-path coupling of §7) and row-by-row recommendations.
- Downstream target: the empty Open Design **"Settings Page Fable"** project (`892e01b2-300e-4c8e-801f-50efe31f7010`) for the visual spec/build.
