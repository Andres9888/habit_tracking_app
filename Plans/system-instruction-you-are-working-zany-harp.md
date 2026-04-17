# Archive Habits — 10 Mockup Variations (Tweaks, Not Redesigns)

## Context

User asked for a review of the Archive Habits page. Code review surfaced clear bugs (copy, orphaned features) and UX gaps. Rather than a full redesign, we'll generate 10 small-scope mockup variations — each tweaking the existing card-list layout and each solving a specific user problem **faster**.

**North-star question for every mockup:** "If a user opens this screen, what's the shortest path to their goal?"

**Dominant user tasks (ranked by estimated frequency):**
1. Restore a habit I accidentally archived — very common
2. Restore a habit after a break — common
3. Clean up / delete old habits — occasional
4. Review what I've tried (self-reflection) — occasional
5. Decide between restore vs delete for a specific habit — rare but high-stakes

---

## The 10 Mockups

Each is a tweak to the existing card-list. Each is a standalone HTML file in `.superdesign/design_iterations/archive_v4_{n}.html`. Each has a **primary problem solved** and a **tradeoff**.

### 1. `archive_v4_1_primary_resume.html` — Asymmetric CTAs
- **Problem solved:** Restore is far more common than delete, but current design gives them equal visual weight.
- **Tweak:** Resume becomes a full-width primary pill (green). Delete shrinks to a small icon in the top-right corner of the card.
- **Tradeoff:** Delete is slightly less discoverable (acceptable — it's the rare path).
- **Expected impact:** Fewer scanning taps, one-touch restore.

### 2. `archive_v4_2_recently_archived.html` — "Just archived" section at top
- **Problem solved:** Most restore requests target habits archived in the last 24–48h (accidents, second-guessing).
- **Tweak:** Pin last-7-days archives in a top "Recently archived" section with a subtle "Undo?" chip. Older archives below, collapsed by default.
- **Tradeoff:** Extra section chrome; small habit lists get double-headers.
- **Expected impact:** Accidental archives reverted in 1–2 taps.

### 3. `archive_v4_3_search_header.html` — Search-first
- **Problem solved:** Users with 10+ archived habits scan slowly; power users who archive experimentally need fast find.
- **Tweak:** Sticky search bar in header (icon when idle, expands to input on tap). Filters list by name.
- **Tradeoff:** Adds header height; unused by casual users.
- **Expected impact:** Find-by-name in 2–3 taps instead of scroll.

### 4. `archive_v4_4_proactive_lock.html` — Surface the free-tier limit before the tap
- **Problem solved:** Free users at the 3-habit limit currently learn they can't restore *after* tapping Resume (alert dialog).
- **Tweak:** Resume button shows lock badge + "Upgrade" label when `hasReachedLimit`. Disabled state visible at a glance. Tap opens upgrade flow, not an error alert.
- **Tradeoff:** None — signal is already computed; we're just showing it.
- **Expected impact:** Zero wasted taps on blocked restores.

### 5. `archive_v4_5_header_select.html` — Wire up the existing batch feature
- **Problem solved:** Full batch restore/delete infrastructure exists in code (`useArchiveSelection`, `ArchiveSelectionBar`, Convex `batchUnarchive` + `batchRemove`) but is unreachable from the UI.
- **Tweak:** Render `StatsSummaryBar` (already in components barrel) in the header. Tapping "Select" enters selection mode → checkboxes per card → bottom sticky action bar with Restore / Delete / Cancel.
- **Tradeoff:** Slightly busier header.
- **Expected impact:** Bulk cleanup in N taps instead of 2N.

### 6. `archive_v4_6_swipe_actions.html` — Swipe right to restore, left to delete
- **Problem solved:** Cards carry both Resume + Delete buttons always-on, adding visual noise. iOS mental model for archive/restore lists = swipe (Mail, Reminders).
- **Tweak:** Cards become minimal (icon, name, tiny metadata row). Swipe reveals colored action rails (green Resume right, red Delete left). Buttons hidden until gesture.
- **Tradeoff:** Less discoverable for users unfamiliar with iOS swipe pattern — counter with a one-time onboarding hint.
- **Expected impact:** Cleaner card, gesture-based speed for iOS-savvy users.

### 7. `archive_v4_7_time_sections.html` — Grouped by time
- **Problem solved:** Users mentally categorize archives as "recent mistake" vs "long-ago abandonment" — flat list erases that.
- **Tweak:** Collapsible sections: "This week", "This month", "Older". Section headers show count. "Older" collapses by default.
- **Tradeoff:** More chrome; section headers eat space.
- **Expected impact:** Faster mental filtering → faster target acquisition.

### 8. `archive_v4_8_stats_summary.html` — Context strip at top
- **Problem solved:** Users open archive with no overview — no sense of scale or composition.
- **Tweak:** Top strip shows "5 archived · strongest reached 78% · oldest 3 months ago". Subtle, one line. Replaces current subtitle.
- **Tradeoff:** Extra computation; requires light aggregation query.
- **Expected impact:** Orientation in one glance; informs whether to drill in or close.

### 9. `archive_v4_9_expandable_card.html` — Tap to expand inline
- **Problem solved:** "Should I restore this?" requires context users currently can't see — strength trajectory, peak streak, why archived.
- **Tweak:** Cards collapsed by default (icon, name, strength %). Tap expands inline: 14-day sparkline, peak streak, total completions, archive date. Restore/Delete buttons only appear in expanded state.
- **Tradeoff:** More taps per restore for users who already know what they want — mitigated by combining with v4_1 (asymmetric CTAs visible in collapsed state).
- **Expected impact:** Informed decisions; lower regret on deletes.

### 10. `archive_v4_10_danger_footer.html` — "Clear all archived" in the danger zone
- **Problem solved:** Heavy users accumulate dozens of archives; one-by-one delete is painful. The `handleDeleteAll` function already exists but has no UI trigger.
- **Tweak:** Render `DangerZoneFooter` (exists in components barrel) below the list when count > 3. Red-tinted "Delete all N archived habits" link with two-step confirm.
- **Tradeoff:** Destructive action visible (mitigated by two-step confirm).
- **Expected impact:** Nuclear option for accumulation; unblocks "clean slate" intent.

---

## Which mockup solves which user task?

| User task | Best tweak(s) |
|---|---|
| Restore a fresh accidental archive | v4_1 (big Resume) + v4_2 (pinned recent) |
| Restore after a break | v4_3 (search) or v4_7 (time grouping) |
| Know if restore is blocked by limit | v4_4 (proactive lock) |
| Bulk cleanup | v4_5 (batch mode) + v4_10 (delete all) |
| Quick card interactions | v4_6 (swipe actions) |
| Overview before drilling in | v4_8 (stats strip) |
| Informed restore/delete decision | v4_9 (expandable detail) |

The tweaks are mostly **additive** — a real ship would combine 3–5 of them. After review, you'll pick a subset to actually implement.

---

## Shared design constraints across all 10 mockups

To keep each mockup a fair, comparable tweak (not a whole redesign), all 10 share:
- Palette: `#F5F1ED` background, DM Sans primary, Literata serif for titles (matches the v3 series)
- Viewport: 390px mobile frame (matches existing v3 mockups)
- Icons: lucide-react CDN (matches project)
- Card anatomy: accent bar (left), icon circle, habit name, stats row (strength %, streak, completions), archive date
- Header: back chevron, blurred glass, title "Archived Habits", one-line subtitle

Fixes applied to **every** mockup (so each iterates off a correct baseline, not the buggy one):
- Subtitle copy: "paused" → "archived" (current bug in `ModalHeader.tsx:26`)
- Header: Back only (drop X — matches iOS Settings.app push/pop pattern)
- Empty state copy clarified

---

## Files to create

10 new HTML files in `/Users/andres/conductor/workspaces/habit_tracking_app/moscow-v2/.superdesign/design_iterations/`:
- `archive_v4_1_primary_resume.html`
- `archive_v4_2_recently_archived.html`
- `archive_v4_3_search_header.html`
- `archive_v4_4_proactive_lock.html`
- `archive_v4_5_header_select.html`
- `archive_v4_6_swipe_actions.html`
- `archive_v4_7_time_sections.html`
- `archive_v4_8_stats_summary.html`
- `archive_v4_9_expandable_card.html`
- `archive_v4_10_danger_footer.html`

Plus a thin index page `archive_v4_index.html` that embeds all 10 in iframes side-by-side for easy comparison.

**No production code changes** in this plan — these are only HTML mockups for you to evaluate. After you pick the winning subset, we'll plan the React Native implementation as a separate phase.

---

## Verification

After files are written:
1. `open /Users/andres/conductor/workspaces/habit_tracking_app/moscow-v2/.superdesign/design_iterations/archive_v4_index.html`
2. Compare the 10 variations side-by-side
3. You pick the subset to actually implement (expected: 3–5 combined)
4. Follow-up plan will cover production implementation + batch-feature wire-up + copy fixes + dead-code removal

## Critical files referenced (for later implementation phase, NOT this phase)

- `src/components/ArchivedHabitsModal/ArchivedHabitsModal.tsx` — main orchestrator
- `src/components/ArchivedHabitsModal/components/ModalHeader.tsx:26` — copy bug
- `src/components/ArchivedHabitsModal/components/StatsSummaryBar.tsx` — unused "Select" button
- `src/components/ArchivedHabitsModal/components/DangerZoneFooter.tsx` — unused "Delete all"
- `src/components/ArchivedHabitsModal/useArchiveSelection.ts` — `enterSelectionMode` never called
- `convex/habits/batchArchive.ts` — `batchUnarchive` already exists and works
