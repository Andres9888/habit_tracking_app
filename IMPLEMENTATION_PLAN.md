# Implementation Plan

## Recommendation (design direction — synthesis-ready)

**One coherent direction: Settings is the app's control panel, not a progress dashboard.**
Every row either *changes how the app behaves/looks* or *manages the account*. Nothing in
Settings should report how the user is doing — no streaks, no rings, no completion counts.

### The core problem (what the audit found)
Settings currently opens with a **mini analytics dashboard**, not a settings header:

- `ProfileHeroCard.tsx` renders a streak headline (🔥 `N` day streak), a `WeeklyCompletionRing`
  (0–100% "this week" ring), and a 3-column `ProfileStatsRow` — **Active Habits / Flawless Days /
  Lifetime Completions**. All five metrics are computed live from Convex (`useProfileStats` fires
  `habits.list` + a full-history `habits.getTracking`). So the Settings screen pays a real query
  cost to show progress content that doesn't belong there.
- The Account subpage's `ProfileCard.tsx` then **duplicates** the streak line and the identical
  `ProfileStatsRow` a second time, directly above the actual account controls.
- These numbers are already surfaced where progress belongs: the home `HabitsListHeader`
  (streak / completed-today / avg-strength, visible to everyone) and the dedicated, premium-gated
  `AnalyticsScreen` (Total Habits, Average Strength, Strongest/Weakest). The Settings copies are
  redundant vanity metrics.

### Challenging the current trajectory
The existing `.superdesign` mocks — including the newest `settings_v3_recommended` — move the
**opposite** way: they lean *harder* into a stats-rich hero and an editorial "live calendar"
centerpiece. I'm recommending against that trajectory. A settings screen that doubles as a trophy
case dilutes both jobs: it slows the one screen users open to *fix* something, and it scatters
progress reporting across surfaces that then drift out of sync. Keep progress on progress surfaces.

### What stays (explicitly not stats — do not touch)
The Appearance / Calendar Look screens are already clean and legitimately configuration:

- The `CalendarPreview` looks like real data but is **synthetic** (`CalendarPreviewWeek` = a fixed
  4-day-streak-then-rest mock, fake `preview-N` dates). It exists to visualize style toggles
  (day shape, connector, completion icon, gradient fill) — a config aid, not a progress readout. Keep it.
- `GrowthIconsSettingsRow` is a glyph *picker* (choose the emoji set), not a progress display. Keep it.

### Recommended information architecture (configuration-only, top → bottom)
1. **Account entry** — identity only: avatar, name, Pro/Trial badge, "Manage account & subscription",
   chevron → Account subpage. *No stats.*
2. **Pro card** — upgrade CTA for non-premium (commerce, legitimate).
3. **Appearance** — Theme, Calendar look (subpage w/ synthetic preview), Default growth icons,
   Compact cards. *Unchanged.*
4. **Reminders** — Streak reminders (+ time), premium-gated. *Unchanged.*
5. **Habits** — Sort order, Completion sound, Archived habits, Export data. *Unchanged.*
6. **Support** — Rate, Share, Feedback, What's New. *Unchanged.*
7. **About footer** — Privacy, Terms, Version. *Unchanged.*

**Account subpage** stays config-only: Edit profile, Email, Premium status / Restore purchases,
Sign out, Delete account — with the duplicated stat block removed.

### Visual hierarchy
No restyle. Keep the flat always-open grouped-list, the editorial serif section labels, the
40×40 icon-tile rows. The change is **content-subtractive at the top**: the stats-heavy hero
collapses into a single quiet identity row, so the eye lands on configuration immediately.

### Tradeoff to record (for synthesis)
Removing *Flawless Days* / *Lifetime Completions* deletes their only free-tier home (Analytics is
premium-gated). This plan intentionally does **not** build a new home for them — that's a progress-
surface decision, out of scope for a Settings-hygiene pass. If product wants them retained, relocate
to the home header or Analytics; do not re-add to Settings.

---

## END_RESULT
Opening Settings shows a clean control panel: a single identity row at the top (avatar, name,
Pro badge, "Manage account & subscription") leading to Account, followed by Appearance, Reminders,
Habits, Support, and About. No streak, no completion ring, no stat counters appear anywhere in
Settings or the Account subpage. The Settings screen no longer fires habit/tracking queries just to
render vanity metrics. All existing configuration controls behave exactly as before.

### Acceptance Criteria
- [x] AC1: The Settings top card shows only identity + account entry (avatar, name, Pro/Trial badge,
      "Manage account & subscription", chevron) — no streak headline, no weekly ring, no stat strip.
- [x] AC2: The Account subpage's profile card shows only avatar, name, email, and edit affordance —
      the duplicated streak line and 3-stat row are gone.
- [x] AC3: No streak / ring / "Active Habits" / "Flawless Days" / "Lifetime Completions" text renders
      anywhere in the Settings modal or Account subpage.
- [ ] AC4: Appearance (incl. synthetic Calendar preview + growth icons), Reminders, Habits, Support,
      and About are visually and functionally unchanged.
- [ ] AC5: Restore purchases, Sign out, and Delete account remain reachable on the Account subpage.
- [x] AC6: `npx tsc --noEmit` and lint pass; no dead imports remain.

## Phase 1 — Make Settings configuration-only

- [x] **T1 — Reduce `ProfileHeroCard` to an identity-only account-entry row.** In
  `src/components/SettingsModal/ProfileHeroCard.tsx`, remove `WeeklyCompletionRing`, `ProfileStatsRow`,
  and the `useProfileStats` call; keep avatar + `ProfileHeroIdentity` (drop its `currentStreak` prop /
  streak line) + Pro badge + chevron, and add a quiet "Manage account & subscription" subtitle. Adjust
  `getProfileCardShellStyle` padding so the shorter card looks intentional. Skill: `frontend-design:frontend-design`. [wave:1]

- [x] **T2 — Reduce Account `ProfileCard` to identity + email.** In
  `src/components/SettingsModal/ProfileCard.tsx`, remove the `🔥 {currentStreak}-day streak` block and
  the `ProfileStatsRow`, and drop the `useProfileStats` call; keep avatar, name, Pro badge, email, and
  the edit affordance. Different file from T1 → parallel-safe. Skill: `frontend-design:frontend-design`. [wave:1]

- [x] **T3 — Delete the now-dead stats subtree.** After T1+T2 remove the last consumers, delete
  `useProfileStats.ts`, `ProfileStatsRow.tsx`, `ProfileStatItem.tsx`, `WeeklyCompletionRing.tsx`,
  `getProfileStatColors.ts`, `profileStats.helpers.ts`, `profileStats.types.ts`, and prune the profile
  stats/streak skeleton pieces (`ProfileHeroSkeleton.tsx` streak/stat rows). Grep to confirm zero
  remaining references before deleting; run `npx tsc --noEmit` + lint to catch orphaned imports.
  [needs:T1] [needs:T2]

- [ ] **T4 — Sim-verify the config-only result.** Build to the iOS simulator, open Settings → confirm
  identity-only header (AC1, AC3), open Account → confirm config-only profile card and that Restore /
  Sign out / Delete remain (AC2, AC5), and spot-check Appearance/Reminders/Habits unchanged (AC4).
  Use the `run` / `verify` skill + xcodebuild MCP; screenshot Settings + Account. [needs:T3]
