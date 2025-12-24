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

| Decision              | Details                                                               |
| --------------------- | --------------------------------------------------------------------- |
| **Categories Tab**    | No filters - categories ARE the organization                          |
| **All Templates Tab** | Show filters (Science-Backed toggle, Sort options)                    |
| **Rationale**         | Reduces cognitive overhead; filters only appear where they make sense |

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

| Element           | Change                                     |
| ----------------- | ------------------------------------------ |
| Left accent bar   | Changes to green (`#22c55e`)               |
| Add button        | Changes to "Added ✓" with green background |
| Shimmer animation | Stops                                      |
| Button            | Becomes disabled (can't re-add)            |

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
  - File: `src/components/MiniTemplateCard.tsx`
  - _Completed: Added ChevronRight icon from lucide-react-native, positioned absolutely at top-right (14px inset), with animated translateX(+2px) on press via chevronStyle and chevronTranslate shared value. Includes accessibilityLabel="View details"._

- [x] **Task 1.2:** Update science badge to Option A style ✅
  - Position badge on icon corner (bottom-right, -4px offset)
  - Use green circle (`#10b981`) with white flask icon
  - Add shimmer animation (existing, verify working)
  - File: `src/components/MiniTemplateCard.tsx`
  - _Completed: Replaced text-based research badge with circular FlaskConical icon badge (18x18px) positioned at bottom-right (-4px offset) of icon container. Badge uses green (#10b981) background with white flask icon. Added subtle pulse animation (opacity 0.6-1.0) that respects reduced motion and stops when imported. Badge includes accessibilityLabel="Science-backed habit". Removed old shimmer-based research badge at bottom of card._

- [x] **Task 1.3:** Fix description/button overlap ✅
  - Add `marginBottom: 36` to description style
  - Ensure Add button doesn't overlap text
  - File: `src/components/MiniTemplateCard.tsx`
  - _Completed: Updated description marginBottom from 10 to 36 pixels in MiniTemplateCard.tsx, providing sufficient spacing to prevent text overflow beneath the card content area._

- [x] **Task 1.4:** Implement "Added" state styling ✅
  - Change left accent to green when `isImported`
  - Change button to "Added ✓" with green background
  - Stop shimmer animation when imported
  - File: `src/components/MiniTemplateCard.tsx`
  - _Completed: All "Added" state styling was already implemented. Left accent bar changes to green (#22c55e) via conditional backgroundColor (line 244). Add button shows Check icon with "Added" text on green background (lines 300-312). Shimmer/pulse animation stops when isImported is true (lines 99-105). Button is disabled when isImported to prevent re-import (line 296). File path corrected to actual location._

### Phase 2: Templates Screen Updates

- [x] **Task 2.1:** Remove filters from Categories tab ✅
  - Only show filters when `browseTab === 'all'`
  - Keep search bar visible in both tabs
  - File: `src/screens/TemplatesScreen.tsx`
  - _Completed: Added filter controls (Science-Backed toggle and Sort options) to the All Templates tab only. Categories tab has no filters as categories ARE the organization. Search bar remains visible in both tabs. FlatList in All Templates tab now uses filteredTemplates to respect filter selections. Added filterControlsRow style to templatesScreenStyles.ts and dropdown backdrop for sort options._

- [x] **Task 2.2:** Update category count to show science count ✅
  - Format: "6 habits · 4 science-backed"
  - Calculate science count per category
  - File: `src/screens/TemplatesScreen.tsx`
  - _Completed: Added `scienceCountsByCategory` memoized calculation in TemplatesScreen that counts templates with scientificLink per category. Added `scienceCount` prop to CollapsibleCategorySection component and updated the count text to display "X habits · Y science-backed" format when science-backed templates exist. Also updated accessibility label to announce science count to screen readers._

### Phase 3: Full Card Updates

- [x] **Task 3.1:** Update Import button to use `iconColor` ✅
  - Replace black/dark button with habit's `iconColor`
  - Maintain contrast with white text
  - File: `src/components/TemplateCard.tsx`
  - _Verified complete: Import button already uses `iconColor` via inline style (line 496: `backgroundColor: isLocked ? '#9ca3af' : iconColor`). White text maintained via Button component's primary variant._

- [x] **Task 3.2:** Add "Added" state to TemplateCard ✅
  - Show "Added ✓" with green background when imported
  - Disable button to prevent re-import
  - File: `src/components/TemplateCard.tsx`
  - _Verified complete: "Added" state already implemented (lines 482-486). Shows "Added to Habits" with checkmark icon on green (#22c55e) background. Button is replaced entirely when `isImported` is true, preventing re-import. Success animation with glow effect included._

### Phase 4: Preview Modal Updates

- [x] **Task 4.1:** Add "Tips for Success" section ✅
  - Create new section below science box
  - Show 2-3 actionable tips with icons
  - Use habit color for tip icons
  - File: `src/components/templates/FullsizeTemplatePreview/FullsizeTemplatePreview.tsx`
  - _Completed: Added "Tips for Success" section to FullsizeTemplatePreview modal, positioned after science box. Section displays numbered tips using habit iconColor for tip number styling. Uses warm yellow color scheme (#fefce8 background, #fef08a border) with Lightbulb icon header. Section conditionally renders only when template.tips array exists and has items. Added accessibility label announcing tip count. Includes 5 new tests: rendering with tips, empty array handling, undefined tips handling, numbered ordering, and accessibility. All 44 FullsizeTemplatePreview tests pass._

- [x] **Task 4.2:** Update Import button to use `iconColor` ✅
  - Replace current button color with habit's `iconColor`
  - File: `src/components/FullsizeTemplatePreview.tsx`
  - _Verified complete: Import button already uses `iconColor` via inline style (line 705: `backgroundColor: iconColor`). White text maintained via importButtonText style._

### Phase 5: Data Updates

- [x] **Task 5.1:** Add `tips` field to template schema ✅
  - Array of strings for success tips
  - Update seed data with tips for existing templates
  - File: `convex/schema.ts`, `convex/templates.ts`
  - _Completed: Added optional `tips` field (array of strings) to templates table in convex/schema.ts. Updated TemplateInsert type in convex/templates.ts. Added tips arrays to 10 popular seed templates across categories: 5-Minute Meditation, Hydration First, 7-Minute Workout, 10,000 Steps, Deep Work Session, Gratitude Journaling, Morning Sunlight Viewing, Delay Caffeine 90 Minutes, Consistent Bedtime, 7-9 Hours Sleep, and Daily Social Call. All 44 FullsizeTemplatePreview tests pass including tips-related tests._

### Phase 6: Layout Fixes to Match Mock (NEW)

#### 6.1 Mini Card Layout Restructure

- [x] **Task 6.1.1:** Restructure MiniTemplateCard layout to match mock ✅
  - **Current:** Icon, title, and Add button in horizontal header row
  - **Mock:** Icon at top-left, Title below icon, Description below title, Add button at bottom-right (absolute)
  - File: `src/components/MiniTemplateCard.tsx`
  - _Completed: Restructured layout from horizontal header row to vertical stack. New structure: topRow (icon + chevron), title, description, absolute-positioned import button. Removed headerRow and headerContent styles, added topRow style with flex-start alignment and space-between justification._

- [x] **Task 6.1.2:** Move Add button to bottom-right (absolute positioned) ✅
  - Position: `position: absolute, bottom: 14, right: 14`
  - Remove from header row
  - File: `src/components/MiniTemplateCard.tsx`
  - _Completed: Created importButtonWrapper style with `position: 'absolute', bottom: 14, right: 14`. Button now renders outside the content flow at bottom-right corner. Removed marginLeft from importButton style._

- [x] **Task 6.1.3:** Update card dimensions to match mock ✅
  - Width: 200px (currently 220px)
  - Min height: 150px (currently 140px)
  - File: `src/components/MiniTemplateCard.tsx`
  - _Completed: Updated card style width from 220px to 200px, minHeight from 140px to 150px._

- [x] **Task 6.1.4:** Fix icon size and spacing ✅
  - Icon container: 42x42px with 12px border radius
  - Icon font size: 22px
  - Spacing below icon: 10px
  - File: `src/components/MiniTemplateCard.tsx`
  - _Completed: Updated iconContainer to 42x42px with 12px borderRadius (was 36x36px with 10px). Updated icon fontSize to 22px (was 18px). topRow marginBottom provides 10px spacing._

- [x] **Task 6.1.5:** Update title styling ✅
  - Font size: 16px (currently 15px)
  - Font weight: 700
  - Color: #1c1917
  - Line height: 1.3
  - Margin bottom: 6px
  - File: `src/components/MiniTemplateCard.tsx`
  - _Completed: Updated name style: fontSize 16px (was 15px), fontWeight 700, color #1c1917 (was #101727), lineHeight 21 (approx 1.3), marginBottom 6px (was 2px)._

#### 6.2 Search Bar & Tab Navigation Fixes

- [ ] **Task 6.2.1:** Update search bar styling to match mock
  - Background: #fff
  - Border: 1.5px solid #e7e5e4
  - Border radius: 14px
  - Padding: 11px 14px
  - Placeholder color: #a8a29e
  - File: `src/screens/TemplatesScreen.tsx`, `src/screens/templates/templatesScreenStyles.ts`

- [ ] **Task 6.2.2:** Update tab bar styling to match mock
  - Background: #f5f5f4
  - Border radius: 12px
  - Tab indicator: white with shadow
  - Active tab color: #1c1917
  - Inactive tab color: #78716c
  - Tab count badge: purple (#6366f1) when active
  - File: `src/screens/TemplatesScreen.tsx`, `src/screens/templates/templatesScreenStyles.ts`

- [ ] **Task 6.2.3:** Fix tab indicator animation
  - Smooth slide animation between tabs
  - Tab indicator width: calc(50% - 4px)
  - Shadow: 0 2px 6px rgba(0,0,0,0.08)
  - File: `src/screens/TemplatesScreen.tsx`

#### 6.3 Category Header Fixes

- [ ] **Task 6.3.1:** Update category header styling to match mock
  - Background: #fff (when collapsed), category bg color (when expanded)
  - Border radius: 16px
  - Padding: 14px 16px
  - Icon badge: 48x48px with 14px border radius
  - File: `src/components/CollapsibleCategorySection.tsx`

- [ ] **Task 6.3.2:** Update category count text styling
  - Format: "X habits · Y science-backed"
  - Science count in green (#059669)
  - Font size: 13px
  - File: `src/components/CollapsibleCategorySection.tsx`

#### 6.4 Full Card (All Templates Tab) Fixes

- [ ] **Task 6.4.1:** Update TemplateCard styling to match mock
  - Card background: #fff
  - Border radius: 16px
  - Padding: 16px
  - Shadow: 0 2px 8px rgba(0,0,0,0.05)
  - File: `src/components/TemplateCard.tsx`

- [ ] **Task 6.4.2:** Update science box styling
  - Background: #f0fdf4
  - Border: 2px solid #bbf7d0
  - Border radius: 12px
  - Header: "🔬 Science Behind This Habit"
  - Text color: #166534
  - File: `src/components/TemplateCard.tsx`

- [ ] **Task 6.4.3:** Update action buttons layout
  - Preview button: gray (#f5f5f4) background
  - Import button: uses habit's iconColor
  - Border radius: 12px
  - Padding: 12px
  - Gap between buttons: 10px
  - File: `src/components/TemplateCard.tsx`

#### 6.5 Color Scheme Updates

- [ ] **Task 6.5.1:** Update color palette to match mock
  - Text primary: #1c1917 (currently #101727)
  - Text secondary: #78716c (currently #6b7280)
  - Text muted: #a8a29e (currently #94a3b8)
  - Border color: #e7e5e4 (currently #e2e8f0)
  - Background: #faf9f7 (currently #f8f5f1)
  - File: Multiple files

---

## Design Assets

| Mock File                                 | Description                                |
| ----------------------------------------- | ------------------------------------------ |
| `templates_mini_card_chevron_1.html`      | Final mini card with chevron + Added state |
| `templates_mini_card_refined_2.html`      | Science indicator options (A/B/C)          |
| `templates_categories_view_1.html`        | Categories view layout                     |
| `templates_filter_placement_1.html`       | Filter placement comparison                |
| `templates_full_card_with_preview_2.html` | Full card + preview modal                  |

---

## Accessibility

- [x] Chevron has `accessibilityLabel="View details"` - _Implemented in MiniTemplateCard.tsx line 250_
- [x] Flask badge has `accessibilityLabel="Science-backed habit"` - _Implemented in MiniTemplateCard.tsx line 270_
- [x] Added state announced to screen readers - _MiniTemplateCard.tsx lines 292-294: conditional accessibilityLabel shows "${name} added" when isImported_
- [x] All animations respect `useReducedMotion` - _All animations check reducedMotion before running (MiniTemplateCard lines 100, 124, 138, 190, 202; TemplateCard lines 176-181, 276-285)_

---

## Success Metrics

- **Discoverability:** Users tap into preview more often (track tap rate)
- **Import rate:** More habits imported per session
- **Science engagement:** "Read Research" link clicks increase
