# UI Review — Whole App

## Context
User requested a full-app 6-pillar UI audit via `/gsd:ui-review`. This is an audit/analysis task — not a code change. The GSD UI auditor agent will be spawned to review all implemented frontend code across the entire app.

## Approach
1. Explore the app's screen/component structure to build a comprehensive file list
2. Spawn `gsd-ui-auditor` agent targeting the whole app (not a single phase)
3. Produce `UI-REVIEW.md` in `.planning/ui-reviews/` with 6-pillar scores and actionable findings

## Output
- `.planning/ui-reviews/full-app-UI-REVIEW.md` — scored review (1-4 per pillar, /24 total)
