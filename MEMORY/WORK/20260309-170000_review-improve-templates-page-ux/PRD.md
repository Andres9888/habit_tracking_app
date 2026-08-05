---
task: Review and improve templates page UX flow
slug: 20260309-170000_review-improve-templates-page-ux
effort: extended
phase: execute
progress: 12/16
mode: interactive
started: 2026-03-09T17:00:00-08:00
updated: 2026-03-09T17:01:00-08:00
---

## Context

Andres wants to review and improve the Templates page and the workflow to get there. The current templates feature has a well-structured codebase (TemplatesScreen, MainBrowseView, CategoryDrillView, FullsizeTemplatePreview) with recent UX improvements (PR #1173 moved CategoryGrid before PremiumPacks per Hick's Law, improved search spacing).

### Current Flow
1. **Entry points:** Empty state "Browse Templates" link → modal; CreateHabitModal → inline TemplateBrowser; BottomActionBar → templates
2. **MainBrowseView layout:** ScreenHeader → SearchBar → FeaturedCollection (Morning Mastery hero) → PopularSection (horizontal trending carousel) → CategoryGrid (2-col, 14 categories) → PremiumPacksSection (3 curated packs)
3. **Sub-views:** Category drill (filtered FlatList), See All Popular, Search Results, FullsizeTemplatePreview modal
4. **Import flow:** Browse → tap card → FullsizePreview → "Quick Add" or "Customize First" → toast/celebration

### Key Findings
- FeaturedCollection is hardcoded to "Morning Mastery" — not rotating/dynamic
- FullsizeTemplatePreview has `disableGestureClose=true` — no swipe-to-dismiss
- No preview of what habits a template will create before import
- No "recently imported" or personalized suggestions
- Category tiles show preview emojis but no visual hierarchy for popular categories
- PremiumPacks section has 3 static packs — no connection to user behavior
- Search has no visible debouncing or empty state guidance
- No quick-import from trending cards without opening preview first (wait - AddButton exists on TrendingCard, this IS supported)

### Risks
- Changes must not break existing import flow which is well-tested
- Modal stack complexity — TemplatesScreenModals already manages 4+ modals
- Performance — templates list is ~200 items, changes shouldn't regress scroll perf

## Criteria

- [x] ISC-1: Present prioritized list of UX improvements to Andres
- [x] ISC-2: Each improvement has clear before/after description
- [x] ISC-3: Improvements cover navigation flow to templates page
- [x] ISC-4: Improvements cover the main browse experience
- [x] ISC-5: Improvements cover the category drill-down experience
- [x] ISC-6: Improvements cover the template preview/import flow
- [x] ISC-7: Improvements prioritized by user impact (high/medium/low)
- [x] ISC-8: Each improvement has estimated effort level
- [x] ISC-9: Design mockup created for highest-impact improvement
- [x] ISC-10: Mockup uses app's actual design tokens and patterns
- [x] ISC-11: No improvements that would break existing working import flow
- [x] ISC-12: Recommendations grounded in UX-AUDIT-03 findings
- [x] ISC-13: Specific code locations identified for each change
- [ ] ISC-14: Interactive feedback gathered before implementation begins
- [x] ISC-15: At least 8 distinct improvement areas identified
- [x] ISC-16: Mockup renders correctly in browser for review

## Decisions

## Verification
