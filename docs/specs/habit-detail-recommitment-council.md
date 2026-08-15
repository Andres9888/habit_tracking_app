# Council review — Habit Detail as a recommitment surface

**Date:** 13 Aug 2026
**Format:** 3-round debate (Mara Voss, Eli Park, Rafi Okonkwo, Sable Quinn)
**Spec:** [habit-detail-recommitment-surface.md](./habit-detail-recommitment-surface.md)
**Mock:** `.superdesign/design_iterations/habit_detail_recommitment_flow_1.html`

Live tree at review: 3-slot bar (Settings · FAB · Templates), heatmap still `View history ›`, calendar `onDayPress` still toggles. Analytics tab and `AnalyticsHabitPane` are not in the tree.

---

## Council synthesis

**Convergence**
- Home = check-off. Detail = act now. Analytics = over time. Rankings must not open Detail.
- Do not ship **See analytics ›** into a tab that does not exist.
- Ship **2-min CTA** from `startSmallVersion`, and **miss notes that never complete**.
- **Inspect ≠ toggle** is a trust bug, not polish. Hero Complete today / 2-min is the only today toggle.
- First PR does **not** add a fourth bar slot.

**Remaining disagreement**
- **Heatmap on Detail until Analytics exists** (Mara, Rafi) vs **cut heatmap now** (Eli, Sable).
- Rafi still wants heatmap cells tappable until a pane exists. The other three reject that.

**Recommended path**
1. **This PR — recommitment + inspect.** Concrete 2-min CTA. Miss note never completes; **I actually did this** uses confirm, not error-alert voice. Week (and remaining heatmap) **inspect**, they do not toggle. Off / future / untracked get three distinct non-pressable treatments. Keep the month heatmap as evidence with no editor. Keep **View history ›** as collapsed inspect, not a rewrite of history. No Analytics tab. No **See analytics ›**.
2. **Date the Analytics PR.** Templates-style full-screen modal. Rankings / strongest → pane. Then move heatmap + percent, replace **View history ›** with **See analytics ›**.
3. End state stays the signed spec. Sequencing must not park a time job on Detail forever, and must not point at a missing door.

---

## Transcript

### Round 1 — positions

**Mara Voss (retention skeptic):** A miss does not open Detail for “Starting Out.” They need proof they were doing this. Percent and heatmap are that proof. Pointing at Analytics while the bar is still three slots is a broken door. Ship inspect, 2-min CTA, and notes that never complete. Hold word-only hero and killing **View history ›** until Analytics exists and Detail still shows one local fact.

**Eli Park (interaction trust):** Accidental toggles break trust. Today is the only dual-role date and must look different. Off, future, and untracked are three refusals — mute-gray all of them and people will tap, then decide the app is broken. One PR: calendar inspects, hero is the only today toggle.

**Rafi Okonkwo (shipping):** The tree is the argument. No `onOpenAnalytics`. Tests still expect **View history ›**. A prior pass reverted. CTA first. Do not close Detail into Analytics in the same PR. Keep the 3-slot capsule. Analytics later clones Templates, entered from Detail — no bar slot until Home check-off is boring.

**Sable Quinn (IA):** Jobs are coherent. Stacking is not. Rankings opening Detail is a category error. This-week dots serve recommitment. A month heatmap is over-time — that’s Analytics. Cut the heatmap. Keep the week. Then the split holds.

### Round 2 — challenges

**Mara:** Eli’s inspect PR is the trust-killer fix. Rafi’s tree is honest — don’t close into a missing pane. Sable cutting heatmap while Rankings still open Detail and Analytics doesn’t exist isn’t a jobs split; it’s deleting evidence.

**Eli:** Missed-yesterday proof is last-week inspectable dots, not a hero percent. Delay the Analytics tab; do not delay inspect≠toggle. Cut the month heatmap. Word-only strength now. If Rafi’s later modal still toggles, we hid the same leak.

**Rafi:** Cutting the heatmap now is a hole. Won’t bundle inspect, dual-role, dead states, and toggle-off in one cathedral. This PR is CTA + miss-note. Next is inspect chrome; `HeatmapGrid` still gets `onDayPress` until Analytics exists.

**Sable:** Don’t ship **See analytics ›** into a missing tab. That’s a broken door, not a license to keep percent or a heatmap on Detail. Rafi’s “history stays” is how Detail stays a dashboard across releases. Inspect is honesty for whoever owns the control. It does not assign ownership.

### Round 3 — synthesis

**Mara:** We agree on CTA, notes, no fake door, inspect as trust. I still will not cut heatmap and percent while the pane isn’t in the tree. Accidental toggles during a miss are how week two dies. Keep heatmap. No fourth slot. Move month and percent when the pane exists.

**Eli:** I will not meet Rafi on delaying inspect or on letting the heatmap keep toggling. Toggleable proof is worse than no heatmap. This PR: CTA, miss notes, word-only hero, week strip that inspects. Cut the month heatmap. **View history ›** only if it inspects.

**Rafi:** I concede Eli’s inspect clock — CTA then inspect was wrong. I will not concede cutting heatmap or word-only in that same PR. Heatmap keeps `onDayPress` until the pane exists. Next PR is Analytics-as-Templates-clone.

**Sable:** Date the Analytics PR. Don’t soothe sequencing by parking a time job on Detail. If the heatmap goes and Analytics slips, missed users lose a report. That’s schedule risk, not job assignment.

---

## Kimi K3 + GPT-5.6 Sol (13 Aug 2026)

Cursor `cursor-agent` was blocked on an unpaid invoice. These ran via `kimi -m kimi-code/k3` and `codex exec -m gpt-5.6-sol`. Both verified the live tree.

### GPT-5.6 Sol — AMEND

The product model is right; shipping the signed UI literally would create a dead destination.

**First PR:** 2-min CTA from `startSmallVersion`; inspector for week and month (done/missed/today inspect; off/future/pre-create non-interactive); miss notes stay incomplete; hero is the only today toggle; keep the 3-slot bar and **View history ›** but those calendars must inspect; no ranking-to-Detail route. Keep the hero percentage until Analytics exists.

**Analytics PR (atomic):** fourth bar slot, Templates-style modal, focused pane, word · percent, view-only history, rankings → pane, Detail → pane. In that same PR: word-only Detail, **See analytics ›**, move heatmap and percent.

**Heatmap:** keep on Detail as inspect-only until Analytics. Toggleable keeps the trust defect; cutting now removes the only reachable month context.

Amend signed rule 5: copy change + Detail close + focused pane + Analytics entry must be one release. Month heatmap is transitional.

VERDICT: AMEND — Preserve the signed IA, ship trust-safe recommitment first, move history only when its destination exists.

### Kimi K3 — AMEND

Live tree matches: 3-slot bar, **View history ›**, `onDayPress`, no pane. The all-at-once path already reverted here. Sequence it.

**First PR:** CTA, miss-note-never-completes, week + heatmap inspect-only, three dead states, word-only hero + ring fill, no fourth slot, no **See analytics ›**.

**Analytics PR (dated, not “later”):** BarChart3 tab, Templates-style modal, pane with `Starting Out · 12%`, then move heatmap/history/percent and swap the footer. Rankings never open Detail.

**Heatmap:** with Mara/Rafi — keep on Detail in PR 1 as inspect-only. Reject Rafi’s tappable-cell carve-out. Cutting it now leaves Detail too thin.

Amend signed rule 4: keep the year-rate footer (`{yearRatePct}% of days this year`) on the Detail heatmap until Analytics ships — existing factual data, not invented science.

VERDICT: AMEND — two dated PRs; heatmap stays inspect-only on Detail until the Analytics tab exists.
