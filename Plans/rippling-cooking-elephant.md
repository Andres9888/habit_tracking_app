# UX Assessment: Does the Templates Page Solve User Pain Points?

## Context

The Templates screen is a habit template library with 200+ science-backed templates across 14 categories. It was designed to solve cold-start friction, decision paralysis, and premium conversion. This assessment evaluates whether it actually delivers on those goals, based on a full codebase audit.

---

## Scorecard

| Pain Point | Solved? | Grade |
|---|---|---|
| Cold-start / blank slate | Partially — templates exist but are buried | **C-** |
| Decision paralysis | Good curation on browse, but falls apart at scale | **B-** |
| Import friction | Genuinely low — 1-tap import works well | **A-** |
| Science credibility | Structurally broken — filter is a no-op | **D+** |
| Post-import habit quality | Imported habits are hollow shells | **C-** |
| Premium conversion | Pack system has structural issues | **C** |

---

## Finding 1: Onboarding Discovery is the Critical Gap

**Problem:** Templates are the answer to "I don't know what habit to create," but new users never see them.

**Evidence:**
- `src/screens/onboarding/useOnboardingStatus.ts:9-10` — Onboarding carousel is **auto-skipped** for all new users. The third slide about "200+ Templates" is never shown.
- Templates are accessible only via an unlabeled BookOpen icon in the bottom action bar — a new user has no reason to discover this.
- The empty state has hardcoded quick-start chips (Meditate, Read, Exercise, Drink Water) that are **not connected** to the actual template library. They use a separate `QuickStartTemplate` type.

**Verdict:** The feature that's supposed to solve cold-start is hidden behind an icon that requires prior knowledge to find. New users land on an empty habit list with no path to templates.

**Recommendation:**
- Make the empty-state CTA open the templates screen (not the create-habit modal)
- Or show a curated 6-8 template picker as the first post-signup interaction
- Add a text label or tooltip to the BookOpen icon for first-time users

---

## Finding 2: "Research Only" Filter is a No-Op

**Problem:** The science-backing filter doesn't actually filter anything.

**Evidence:**
- `convex/schema.ts:293` — `scientificReference` is `v.string()` (required on every template)
- `src/screens/TemplatesScreen/useFilteredTemplates.ts:88-91` — The "researchOnly" filter checks `scientificLink || scientificReference`. Since `scientificReference` is required on ALL templates, every template passes this filter.
- The filter button exists in the UI but toggling it changes nothing.

**Verdict:** Users who want to see only rigorously-backed templates get no help. The filter is cosmetic.

**Recommendation:**
- Change the filter to check `scientificLink` only (actual verifiable links to papers)
- Or add a `referenceQuality` field to distinguish peer-reviewed citations from self-help book references

---

## Finding 3: Imported Habits Are Hollow

**Problem:** Template-imported habits don't use the fields that actually make habits stick.

**Evidence:**
- The habit schema supports rich fields: `cueAfterBehavior`, `cueLocation`, `cueTime`, `identity`, `goalDuration`, `goalUnit`, `preferredTime`, `daysOfWeek`
- `convex/templates/importTemplate.ts:115-137` — The import mutation only sets: `name`, `icon`, `iconColor`, `frequency`, `notes` (description + scientific reference concatenated), and basic counters
- The template schema (`convex/schema.ts:253-302`) doesn't even have fields for cues, identity, or goals
- A template-imported habit is functionally identical to one where the user just typed a name and picked an icon

**Verdict:** Templates promise science-backed habit design but deliver the same empty habit a user would create manually. The implementation intentions, identity framing, and WOOP scaffolding the app supports are completely bypassed.

**Recommendation:**
- Add `cueTime`, `cueAfterBehavior`, `identity` fields to the template schema
- Populate them with defaults (e.g., Morning Pages: `cueAfterBehavior: "After I pour my morning coffee"`, `identity: "I am someone who processes thoughts through writing"`)
- Pass these through in `importTemplate` so template habits are genuinely richer than manual ones

---

## Finding 4: Browse Curation Works, But "See All" Breaks Down

**Problem:** The main browse view is well-curated, but deeper exploration dumps users into unfiltered lists.

**Evidence:**
- MainBrowseView has good hierarchy: SearchBar > QuickFilterChips (7 categories) > FeaturedCollection (time-aware) > Popular (top 10) > PremiumPacks > CategoryGrid
- But QuickFilterChips only show 7 of 14 categories — breathing, creativity, recovery, social, longevity, andrew_huberman are absent
- CategoryGrid initially shows only 6 of 14 categories (`INITIAL_VISIBLE = 6`)
- The "See All" view from PopularSection renders ALL templates in a flat FlatList with no search, no sort, no filter controls

**Verdict:** The curated entry point is solid. But the moment a user wants to explore beyond the curated surface, the UX degrades sharply.

**Recommendation:**
- Add search/filter/sort controls to the SeeAll view
- Show all 14 categories in the grid by default (or at least more than 6)

---

## Finding 5: Import Flow is Genuinely Good

**Problem:** None — this is the strongest part.

**Evidence:**
- Direct import is truly 1-tap with immediate feedback
- Duplicate detection via `templateUsage` table with `by_user_template` index — prevents double imports gracefully
- Customize flow is light: only name, iconColor, reminderTime (3 fields)
- Success feedback via toast + "Added" badge state

**Minor gaps:**
- Frequency is not customizable before import (daily vs 3x/week)
- No "View Habit" action after import — user stays on templates screen
- No undo mechanism

**Verdict:** The friction reduction here is real. Going from a 10-field form to 1-tap import is a legitimate UX win.

---

## Finding 6: Science Credibility is Inconsistent

**Problem:** All templates claim science backing, but quality varies wildly.

**Evidence from seed data patterns:**
- Strong: `"Goyal et al. (2014) - Meditation programs for psychological stress"` with JAMA link
- Weak: `"Cirillo (2006) - The Pomodoro Technique"` (productivity methodology, not research)
- Questionable: `"Huberman (2021) - Light exposure and circadian biology"` (podcast, not peer-reviewed)

The FullsizePreview's ScienceBox wraps ALL references in "SCIENCE BEHIND THIS HABIT" framing with equal visual weight, whether it's a JAMA citation or a self-help book reference.

**Verdict:** Presenting all references as equivalent science erodes trust for users who notice the inconsistency.

---

## Finding 7: Missing Pain Points Not Addressed

1. **No personalization** — System knows user's existing habits and premium status but doesn't use this to recommend templates. No "based on your morning routine, try these" suggestions.

2. **No habit stacking guidance** — Templates are imported individually with no guidance on how they relate or how to build a routine. Premium packs hint at this but don't provide sequencing.

3. **No success signals** — `popularityScore` is shown but there's no indication of how many users maintained the habit long-term. `templateUsage` tracks imports but this data isn't surfaced to users.

4. **No re-engagement** — After initial import, no mechanism suggests new templates based on progress, abandoned habits, or changing goals.

5. **Hardcoded duration pill** — HeroSection shows "5-10 min" for all templates regardless of actual time requirements.

---

## Summary

The templates page is a **well-engineered feature that solves the wrong layer of the problem**. It excels at reducing the mechanical friction of habit creation (1-tap import, good browse UI) but falls short on the deeper pain points:

- **New users can't find it** (onboarding bypass + hidden icon)
- **Imported habits aren't actually better** than manual ones (no cues, identity, or goals carried through)
- **The science backing is performative** (required field = filter is useless, quality varies)

The highest-leverage fixes are:
1. **Surface templates to new users** at the moment of need (empty state, post-signup)
2. **Enrich the template schema** with cue/identity/goal fields so template habits are genuinely superior
3. **Fix the research filter** to check `scientificLink` instead of the always-present `scientificReference`

---

## Files Referenced

| File | Relevance |
|---|---|
| `convex/templates/importTemplate.ts` | Habit creation from template — missing fields |
| `convex/schema.ts:253-302` | Template schema — lacks cue/identity/goal fields |
| `src/screens/onboarding/useOnboardingStatus.ts` | Auto-skip that hides templates from new users |
| `src/screens/TemplatesScreen/useFilteredTemplates.ts:88-91` | Research filter no-op |
| `src/screens/TemplatesScreen/views/MainBrowseView.tsx` | Browse hierarchy (works well) |
| `src/screens/TemplatesScreen/hooks/useMainBrowseData.ts` | Quick filter limited to 7/14 categories |
