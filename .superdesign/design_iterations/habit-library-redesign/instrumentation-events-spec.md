# Instrumentation Events Spec

## Scope
Define minimal analytics additions for the habit library redesign using existing `createHabitModalAnalytics` + `trackEvent` plumbing.

## Event naming
- Prefix all events with `library_`.
- Use verb-past or verb-state naming for consistency.
- Keep payload flat where possible to simplify downstream queries.

## Events and payload schema

### `library_open`
- **Trigger point:** library modal/screen becomes visible.
- **Payload:**
  - `source`: `"home_cta" | "tab" | "after_import" | "deeplink" | "unknown"`
  - `segment`: `"first_time" | "returning" | "power" | "unknown"`
  - `user_habit_count`: `number`
  - `session_id`: `string`
  - `timestamp_ms`: `number`

### `library_landing_variant_shown`
- **Trigger point:** variant decision resolved and rendered.
- **Payload:**
  - `variant`: `"new_user_hero" | "transformation_hero" | "power_hero"`
  - `segment`: `"first_time" | "returning" | "power"`
  - `decision_reason`: `"count_threshold" | "premium_flag" | "fallback"`
  - `user_habit_count`: `number`
  - `session_id`: `string`

### `library_guide_started`
- **Trigger point:** user taps "Help me choose" / guide entry.
- **Payload:**
  - `entry_point`: `"bottom_pill" | "new_user_hero" | "success_first_import"`
  - `segment`: `"first_time" | "returning" | "power"`
  - `session_id`: `string`

### `library_guide_completed`
- **Trigger point:** final guide step submits and recommendations are shown.
- **Payload:**
  - `entry_point`: `"bottom_pill" | "new_user_hero" | "success_first_import"`
  - `answers_area`: `string` (category key)
  - `answers_time_bucket`: `"lt_2" | "2_to_5" | "5_to_10" | "gt_10"`
  - `answers_style`: `"simple" | "average" | "complex"`
  - `recommended_template_ids`: `string[]` (top 3)
  - `session_id`: `string`

### `library_guide_abandoned`
- **Trigger point:** guide closed before completion.
- **Payload:**
  - `entry_point`: `"bottom_pill" | "new_user_hero" | "success_first_import"`
  - `step_index`: `number` (0-based)
  - `total_steps`: `number`
  - `time_in_guide_ms`: `number`
  - `session_id`: `string`

### `library_detail_open`
- **Trigger point:** habit detail/confidence screen opens.
- **Payload:**
  - `template_id`: `string`
  - `path`: `"goal" | "category" | "search" | "guide" | "trending" | "starter" | "pairing"`
  - `segment`: `"first_time" | "returning" | "power"`
  - `session_id`: `string`

### `library_detail_section_viewed`
- **Trigger point:** section reaches viewability threshold (>= 50% visible for >= 500 ms).
- **Payload:**
  - `template_id`: `string`
  - `section`: `"promise" | "time_style" | "benefits_science" | "cue_start_small" | "identity" | "customize" | "pairings"`
  - `path`: `"goal" | "category" | "search" | "guide" | "trending" | "starter" | "pairing"`
  - `session_id`: `string`

### `library_add`
- **Trigger point:** add/import confirmed (after optimistic success or server success callback).
- **Payload:**
  - `template_id`: `string`
  - `path`: `"goal" | "category" | "search" | "guide" | "trending" | "starter" | "pairing"`
  - `from_customize`: `boolean`
  - `segment`: `"first_time" | "returning" | "power"`
  - `is_first_import`: `boolean`
  - `session_id`: `string`

### `library_dwell_no_action`
- **Trigger point:** user dwells on landing without navigation.
- **Heuristic:** fire once per session when `time_on_landing_ms >= 15000` and no `detail_open`, `guide_started`, `search_submit`, or `add`.
- **Payload:**
  - `segment`: `"first_time" | "returning" | "power"`
  - `variant`: `"new_user_hero" | "transformation_hero" | "power_hero"`
  - `time_on_landing_ms`: `number`
  - `session_id`: `string`

## Trigger implementation notes
- Keep event dispatch in a single analytics helper per view to avoid duplicate fires.
- Gate one-time events (`library_open`, `library_dwell_no_action`) with in-memory flags scoped to session.
- Compute `session_id` when library opens and reuse across all child events.

## Minimal rollout plan
1. **Phase A (safe baseline):** add `library_open`, `library_landing_variant_shown`, `library_add`.
2. **Phase B (guide funnel):** add `library_guide_started`, `library_guide_completed`, `library_guide_abandoned`.
3. **Phase C (detail confidence diagnostics):** add `library_detail_open`, `library_detail_section_viewed`.
4. **Phase D (friction signal):** add `library_dwell_no_action`.

## `createHabitModalAnalytics` / `trackEvent` integration minimum
- Extend event union/types to include all `library_*` names.
- Add helper methods:
  - `trackLibraryOpen(payload)`
  - `trackLandingVariantShown(payload)`
  - `trackGuideStarted(payload)` / `trackGuideCompleted(payload)` / `trackGuideAbandoned(payload)`
  - `trackDetailOpen(payload)` / `trackDetailSectionViewed(payload)`
  - `trackLibraryAdd(payload)`
  - `trackLibraryDwellNoAction(payload)`
- Keep wrappers thin (payload passthrough to `trackEvent`) so existing analytics transport remains unchanged.
