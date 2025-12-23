# Habit Import Redesign - UX Specification

**Version:** 1.0
**Date:** 2024-12-23
**Author:** Sally (UX Expert)
**Status:** Ready for Implementation

---

## Overview

Redesign of the Templates Import screen to improve discoverability, clarity, and user experience when browsing and importing science-backed habits.

### Goals
- Make it clear which habits have scientific research
- Provide clear affordance for viewing more details
- Show clear feedback when a habit has been imported
- Simplify the UI by removing unnecessary filter options from Categories view

---

## Design Decisions

### 1. Filter Placement

| Decision | Details |
|----------|---------|
| **Categories Tab** | No filters - categories ARE the organization |
| **All Templates Tab** | Show filters (Science-Backed toggle, Sort options) |
| **Rationale** | Reduces cognitive overhead; filters only appear where they make sense |

**Reference Mock:** `templates_filter_placement_1.html` (Option B - Recommended)

---

### 2. Mini Card Design

#### Layout
- **Width:** 200px
- **Elements:** Icon, Title, Description (2-line clamp), Add button, Chevron
- **Left accent bar:** Uses habit's `iconColor`

#### Science Indicator
- **Style:** Flask badge on icon corner (Option A)
- **Color:** Green (`#10b981`) with white flask icon
- **Animation:** Subtle shimmer/pulse (disabled for reduced motion)
- **Position:** Bottom-right of icon, 18x18px

#### "View More" Indicator
- **Style:** Chevron (`›`) in rounded container
- **Position:** Top-right of card
- **Behavior:** Moves slightly right on hover
- **Meaning:** Tap card to open fullsize preview

#### Add Button
- **Position:** Bottom-right (absolute)
- **Color:** Uses habit's `iconColor`
- **States:**
  - Default: `+ Add` (habit color)
  - Importing: Spinner
  - Added: `✓ Added` (green `#22c55e`)

**Reference Mock:** `templates_mini_card_chevron_1.html`

---

### 3. "Added" State

When a habit has been imported:

| Element | Change |
|---------|--------|
| Left accent bar | Changes to green (`#22c55e`) |
| Add button | Changes to "Added ✓" with green background |
| Shimmer animation | Stops |
| Button | Becomes disabled (can't re-add) |

---

### 4. Full Card Design (All Templates Tab)

- Icon with habit color background
- Title and description
- Green science box (if has research):
  - Header: "🔬 Science Behind This Habit"
  - Quote text (italic)
  - "Read Research →" link
- Action buttons:
  - Preview (gray)
  - Import (uses habit's `iconColor`)

**Reference Mock:** `templates_full_card_with_preview_2.html`

---

### 5. Fullsize Preview Modal

- **Header:** Habit-colored gradient background
- **Hero:** Large icon with glow effect
- **Pills:** Frequency, Category, Duration (habit-colored)
- **Description:** Centered text
- **Science Box:** Green box with full research quote + external link
- **Tips for Success:** NEW section with actionable tips
- **Footer:**
  - "Import This Habit" button (habit color)
  - "Customize First →" link

---

## Implementation Tasks

### Phase 1: Mini Card Updates

- [x] **Task 1.1:** Add chevron indicator to MiniTemplateCard ✅
  - Add `ChevronRight` icon in top-right corner
  - Style with rounded container (`28x28px`, `rgba(0,0,0,0.04)` background)
  - Add hover animation (translateX +2px)
  - File: `src/components/templates/MiniTemplateCard/MiniTemplateCard.tsx`
  - *Completed: Added ChevronRight icon from lucide-react-native, positioned absolutely at top-right (14px inset), with animated translateX(+2px) on press. Includes accessibilityLabel="View details".*

- [x] **Task 1.2:** Update science badge to Option A style ✅
  - Position badge on icon corner (bottom-right, -4px offset)
  - Use green circle (`#10b981`) with white flask icon
  - Add shimmer animation (existing, verify working)
  - File: `src/components/templates/MiniTemplateCard/MiniTemplateCard.tsx`
  - *Completed: Replaced text-based research badge with circular FlaskConical icon badge (18x18px) positioned at bottom-right (-4px offset) of icon container. Badge uses green (#10b981) background with white flask icon. Added subtle pulse animation (opacity 0.6-1.0) that respects reduced motion and stops when imported. Badge includes accessibilityLabel="Science-backed habit".*

- [x] **Task 1.3:** Fix description/button overlap ✅
  - Add `marginBottom: 36` to description style
  - Ensure Add button doesn't overlap text
  - File: `src/components/templates/MiniTemplateCard/MiniTemplateCard.tsx`
  - *Completed: Updated description marginBottom from 10 to 36 pixels, providing sufficient spacing to prevent overlap with the Add button when positioned absolutely at bottom-right.*

- [x] **Task 1.4:** Implement "Added" state styling ✅
  - Change left accent to green when `isImported`
  - Change button to "Added ✓" with green background
  - Stop shimmer animation when imported
  - File: `src/components/templates/MiniTemplateCard/MiniTemplateCard.tsx`
  - *Completed: All "Added" state styling was already implemented. Left accent bar changes to green (#22c55e) via conditional backgroundColor. Add button shows Check icon with "Added" text on green background. Shimmer/pulse animation stops when isImported is true (checked in useEffect and scienceBadgeStyle application). Button is disabled when isImported to prevent re-import.*

### Phase 2: Templates Screen Updates

- [ ] **Task 2.1:** Remove filters from Categories tab
  - Only show filters when `browseTab === 'all'`
  - Keep search bar visible in both tabs
  - File: `src/screens/TemplatesScreen.tsx`

- [ ] **Task 2.2:** Update category count to show science count
  - Format: "6 habits · 4 science-backed"
  - Calculate science count per category
  - File: `src/screens/TemplatesScreen.tsx`

### Phase 3: Full Card Updates

- [ ] **Task 3.1:** Update Import button to use `iconColor`
  - Replace black/dark button with habit's `iconColor`
  - Maintain contrast with white text
  - File: `src/components/templates/TemplateCard/TemplateCard.tsx`

- [ ] **Task 3.2:** Add "Added" state to TemplateCard
  - Show "Added ✓" with green background when imported
  - Disable button to prevent re-import
  - File: `src/components/templates/TemplateCard/TemplateCard.tsx`

### Phase 4: Preview Modal Updates

- [ ] **Task 4.1:** Add "Tips for Success" section
  - Create new section below science box
  - Show 2-3 actionable tips with icons
  - Use habit color for tip icons
  - File: `src/components/templates/FullsizeTemplatePreview/FullsizeTemplatePreview.tsx`

- [ ] **Task 4.2:** Update Import button to use `iconColor`
  - Replace current button color with habit's `iconColor`
  - File: `src/components/templates/FullsizeTemplatePreview/FullsizeTemplatePreview.tsx`

### Phase 5: Data Updates

- [ ] **Task 5.1:** Add `tips` field to template schema
  - Array of strings for success tips
  - Update seed data with tips for existing templates
  - File: `convex/schema.ts`, `convex/templates.ts`

---

## Design Assets

| Mock File | Description |
|-----------|-------------|
| `templates_mini_card_chevron_1.html` | Final mini card with chevron + Added state |
| `templates_mini_card_refined_2.html` | Science indicator options (A/B/C) |
| `templates_categories_view_1.html` | Categories view layout |
| `templates_filter_placement_1.html` | Filter placement comparison |
| `templates_full_card_with_preview_2.html` | Full card + preview modal |

---

## Accessibility

- [x] Chevron has `accessibilityLabel="View details"`
- [x] Flask badge has `accessibilityLabel="Science-backed habit"`
- [ ] Added state announced to screen readers
- [ ] All animations respect `useReducedMotion`

---

## Success Metrics

- **Discoverability:** Users tap into preview more often (track tap rate)
- **Import rate:** More habits imported per session
- **Science engagement:** "Read Research" link clicks increase
