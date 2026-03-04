# Template Page Layout & Science Review

## Context

Andres asked whether the template page is well laid out and grounded in science. This is an audit/assessment of the current implementation across the main browse screen (`TemplatesScreen`), the preview modals (`FullsizeTemplatePreview`, `TemplateScienceModal`), and the underlying data model.

---

## Overall Verdict: Strong foundation, a few gaps

The template page is **well-structured** and has **genuine science integration** — not just cosmetic labels. The architecture is clean, decomposed properly, and the science content flows from database to UI consistently. Below is a section-by-section breakdown.

---

## Browse Page Layout (MainBrowseView)

**Current section order:**
1. ScreenHeader ("Import Habits" / "Science-backed templates to build great habits")
2. SearchBar (animated)
3. QuickFilterChips (7 of 15 categories)
4. FeaturedCollection ("Morning Mastery" hero)
5. PopularSection ("Trending Now" horizontal carousel)
6. PremiumPacksSection
7. CategoryGrid ("Browse by Category" 2-column grid)

**What's good:**
- **Progressive disclosure** via staggered `FadeInDown` animations — reduces cognitive overload (Sweller, 1988)
- **Social proof** in PopularSection — trending/popular indicators leverage bandwagon effect
- **Anchoring** — Featured hero card at top anchors expectations (Tversky & Kahneman, 1974)
- **Category chunking** — QuickFilterChips + CategoryGrid help users navigate without decision paralysis (Miller's Law: 7 +/- 2 chunks)
- Clean separation: SearchBar for goal-directed search, chips for exploratory browse

**Potential concerns:**
- **FeaturedCollection is hardcoded** to "Morning Mastery" — no rotation or personalization. Could benefit from time-of-day relevance (show sleep templates at night)
- **QuickFilterChips show 7 of 15 categories** — missing: productivity, creativity, social, longevity, recovery, breathing, andrew_huberman. 7 is a good cognitive limit, but users in those categories have no quick filter
- **No personalization** — static experience regardless of user's existing habits or onboarding selections

---

## Science Data Model (convex/schema.ts)

**What's good:**
- `scientificReference` is **required** on every template — guarantees science backing
- `scientificLink` (optional) links to actual research papers
- `youtubeLink` (optional) provides multimedia access
- `tips` array provides actionable implementation guidance
- `popularityScore` enables evidence-based social proof
- Template deduplication (`pickBestTemplate`) **prioritizes templates with scientificLinks** (1000 point bonus) — science quality drives selection

**This is genuinely science-backed infrastructure**, not just decorative labels.

---

## TemplateScienceModal (Full Detail View)

**Section flow:** Hero → About This Habit → YouTube (conditional) → Scientific Backing (Research Citation + Why It Works)

**What's good:**
- **Research Citation** component displays the actual `scientificReference` in a styled quote box with "Read Full Research Paper" link when `scientificLink` exists
- **"Why It Works"** section explains the mechanism, not just "it's proven"
- Reading time estimate, popularity badge, category/frequency pills — good metadata density
- Confetti celebration on use — positive reinforcement (operant conditioning)
- Full accessibility labels including science content

**Concern — `getWhyItWorksText()` is fragile:**
- Only matches 6 keyword patterns: meditation, water, exercise, gratitude, sleep, productivity
- Templates that don't match (e.g., "Digital Detox", "Cold Plunge", "Gratitude Walk") get a generic fallback: *"Scientific research has consistently demonstrated the effectiveness of this habit pattern..."*
- This is a **client-side keyword hack** rather than per-template stored content
- **Recommendation:** Store `whyItWorks` as a field on each template in the database, similar to `scientificReference`

---

## FullsizeTemplatePreview (Quick Preview)

**Section flow:** Hero → ScienceBox → TipsBox → Import/Customize buttons

**What's good:**
- ScienceBox surfaces `scientificReference` with "Read Research" link — science visible without full modal
- TipsBox shows numbered tips — actionable guidance
- Import success triggers confetti + glow overlay — positive reinforcement
- Reduced motion support (`useReduceMotion`) — accessibility

---

## TemplateCard (Browse Cards)

- Shows `scientificReference` in a bordered box with science emoji
- Research indicator (`hasResearch`) on TrendingCard shows templates have science backing
- This is good — science is visible at the browsing level, not hidden behind clicks

---

## Summary of Strengths

| Principle | Implementation | Status |
|-----------|---------------|--------|
| Every template has science backing | `scientificReference` required field | Good |
| Research papers linked | `scientificLink` optional field | Good |
| Progressive disclosure | Staggered animations, modal depth | Good |
| Social proof | Trending section, popularity scores | Good |
| Cognitive load management | Category chips, chunked grid | Good |
| Positive reinforcement | Confetti, glow, celebration overlays | Good |
| Accessibility | Full a11y labels on science content | Good |
| Component decomposition | Well-decomposed into <100 line files | Good |

## Potential Improvements

| Issue | Impact | Suggestion |
|-------|--------|------------|
| `getWhyItWorksText()` keyword matching | Many templates get generic fallback | Store `whyItWorks` per template in DB |
| Featured collection hardcoded | No time/context relevance | Rotate based on time-of-day or user habits |
| 8 categories missing from quick filters | Users can't quick-filter to those | Consider scrollable chips or "More" chip |
| No personalization | Same browse for all users | Show recommended based on existing habits |
| Science not ranked in browse | All templates look equal | Surface "Research Verified" badge on cards with `scientificLink` |

---

## No Code Changes Needed

This was a review/assessment. The template page is well laid out and meaningfully science-backed. The improvements above are suggestions for future consideration, not bugs to fix.
