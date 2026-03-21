# Feature Specification: Templates Screen UX Redesign

**Feature Branch**: `003-templates-ux-redesign`
**Created**: 2026-03-03
**Status**: Draft
**Input**: Redesign the Templates screen UI/UX based on an approved HTML mockup with improved visual hierarchy, discovery patterns, and streamlined import flows.
**Design Reference**: `.superdesign/design_iterations/templates_ux_redesign_1.html`

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Browse and Import a Trending Habit (Priority: P1)

A user opens the Templates screen to find a new habit to track. They see a visually prominent "Trending Now" section with habit cards showing popularity signals and science badges. They tap the circular "Add" button directly on a trending card to import the habit in a single tap, without needing to open a preview modal first.

**Why this priority**: The trending section is the primary discovery mechanism and the inline add button is the biggest UX improvement — reducing the import flow from 3 taps (card → preview → import) to 1 tap. This directly impacts conversion rate for template imports.

**Independent Test**: Can be fully tested by opening the Templates screen, scrolling to Trending Now, and tapping the Add button on any card. The habit should be imported and the button should visually confirm success.

**Acceptance Scenarios**:

1. **Given** the Templates screen is open, **When** the user views the Trending Now section, **Then** they see horizontal cards (165px wide) with habit name, emoji icon on a colored background, frequency in monospace, popularity count with a trending icon, and a circular green Add button.
2. **Given** a trending card is visible, **When** the user taps the circular Add button, **Then** the habit is imported immediately and the button changes from a plus icon to a checkmark with a brief scale animation.
3. **Given** a template has a scientific reference, **When** the trending card is rendered, **Then** a "Science" badge appears in the metadata row.
4. **Given** a habit has already been imported (in the current session), **When** the user views that trending card, **Then** the Add button shows as a muted checkmark (already added state).

---

### User Story 2 - Discover Habits via Quick-Filter Chips (Priority: P1)

A user wants to browse habits in a specific category without scrolling to the bottom of the page. They tap a category chip (e.g., "Morning", "Mental", "Fitness") from the horizontally scrollable chip row positioned below the search bar. This filters the view to show templates from that category.

**Why this priority**: Quick-filter chips reduce navigation from 3 interactions (scroll → find category tile → tap) to 1 tap. This is a core discovery improvement that impacts how all users browse.

**Independent Test**: Can be fully tested by tapping any chip and verifying the category filter activates, showing the relevant templates.

**Acceptance Scenarios**:

1. **Given** the Templates screen is open, **When** the user views the area below the search bar, **Then** they see a horizontally scrollable row of category chips with emoji + label (e.g., "✨ All", "🌅 Morning", "🧠 Mental", "💪 Fitness", "😴 Sleep", "🧘 Mindful", "📚 Learning", "💰 Finance").
2. **Given** the "All" chip is active by default, **When** the user taps a different chip (e.g., "Morning"), **Then** only that chip becomes active (single-select), and the view filters to show templates from the selected category.
3. **Given** a category chip is active, **When** the user taps the "All" chip, **Then** the filter is cleared and the main browse view is restored.
4. **Given** there are more chips than fit on screen, **When** the user swipes horizontally, **Then** the chip row scrolls to reveal additional categories.

---

### User Story 3 - Explore Featured Collection via Hero Card (Priority: P2)

A user sees a visually striking featured collection card at the top of the Templates screen — a full-width card with a green gradient background, decorative elements, habit preview chips, and social proof (user count). They tap the card or the "Explore" button to drill into the featured category.

**Why this priority**: The hero card establishes visual hierarchy and directs users to curated content first. However, users who already know what they want can skip it via chips or search, so it's P2.

**Independent Test**: Can be fully tested by opening the Templates screen, verifying the hero card is visually prominent, and tapping it to navigate to the featured category.

**Acceptance Scenarios**:

1. **Given** the Templates screen is open, **When** the user views the area below the chips, **Then** they see a full-width hero card with a green gradient background, "FEATURED" badge, collection title ("Morning Mastery"), description, habit preview chips (e.g., "🌅 Wake Early", "💧 Hydrate"), user count ("2.4k users"), and an "Explore" call-to-action button.
2. **Given** the hero card is visible, **When** the user taps it, **Then** they navigate to the category drill-in view for the featured collection (currently "morning_routine").
3. **Given** the hero card is visible, **When** the user taps and holds, **Then** the card shows a subtle press feedback (scale down).

---

### User Story 4 - Import a Curated Habit Pack (Priority: P2)

A user sees a section of curated habit packs displayed as full-width stacked cards. Each pack card shows its emoji group, name, description, habit count, and an "Import Pack" button. The user taps "Import Pack" to add all habits in the pack at once.

**Why this priority**: Packs enable batch importing, which is a high-value action. Full-width stacked layout increases discoverability over the current carousel.

**Independent Test**: Can be fully tested by scrolling to Curated Packs, tapping "Import Pack" on any pack card, and verifying the pack confirmation flow opens.

**Acceptance Scenarios**:

1. **Given** the Templates screen is open, **When** the user scrolls to the "Curated Packs" section, **Then** they see full-width stacked cards (not a horizontal carousel) for each pack, with emoji group, pack name, description, habit count, and an "Import Pack" button.
2. **Given** a pack card is visible, **When** the user taps "Import Pack", **Then** the existing pack confirmation sheet opens to confirm the import.
3. **Given** all packs are visible, **When** the user views the section, **Then** no "PRO" badges or premium indicators appear on any pack card.

---

### User Story 5 - Browse Categories with Content Previews (Priority: P3)

A user scrolls to the "Browse by Category" section and sees a 2-column grid of category tiles. Each tile now includes a row of 4 preview emojis at the bottom, giving users a glimpse of the habits inside before tapping.

**Why this priority**: Preview emojis reduce "pogo-sticking" (tap in → nothing interesting → tap back → try another), but the quick-filter chips already provide faster category access, making this a P3.

**Independent Test**: Can be fully tested by scrolling to the category grid and verifying each tile shows 4 preview emojis representing sample habits from that category.

**Acceptance Scenarios**:

1. **Given** the Templates screen is open, **When** the user scrolls to "Browse by Category", **Then** each category tile shows the existing emoji icon, label, and template count, plus a new row of 4 smaller preview emojis at the bottom representing sample habits in that category.
2. **Given** a category tile is visible, **When** the user taps it, **Then** they navigate to the category drill-in view (existing behavior preserved).
3. **Given** the category grid is visible, **When** the user views any tile, **Then** no "PRO" badges appear on any category (including Andrew Huberman).

---

### User Story 6 - Clean Screen Without Premium Gatekeeping (Priority: P3)

All premium/PRO UI elements are removed from the Templates screen: no PRO badges on category tiles, no PRO badges on pack cards, and no sticky usage banner at the bottom of the screen. The screen focuses purely on habit discovery and import.

**Why this priority**: Removing premium UI declutters the screen and focuses the experience on value delivery. Premium gating still exists at the point of import via the existing paywall guard.

**Independent Test**: Can be fully tested by verifying no PRO badges, usage banners, or "Go PRO" buttons appear anywhere on the Templates screen.

**Acceptance Scenarios**:

1. **Given** the Templates screen is open, **When** the user views any category tile (including Andrew Huberman), **Then** no "PRO" badge is displayed.
2. **Given** the Templates screen is open, **When** the user scrolls through the entire page, **Then** no sticky usage bar ("X of Y free habits") appears at the bottom.
3. **Given** the user is a free-tier user, **When** they attempt to import a habit beyond the free limit, **Then** the existing paywall guard still triggers (import-time gating is preserved, not screen-level gating).

---

### Edge Cases

- What happens when the template list is empty (no templates loaded)? The existing empty state with "Load Habits" seed button should still appear before any new sections render.
- What happens when a category in the quick-filter chips has zero templates? The chip should still be visible but tapping it shows an empty state in the filtered view.
- What happens when the user imports a habit via the trending card's Add button while offline? The existing offline queue processor should handle it; the button should show a loading/importing state.
- What happens when the hero card's featured collection changes in the future? The hero card data (title, description, chips, user count) should be configurable, not hardcoded.
- What happens when the chip row has more categories than fit on a single screen width? The row scrolls horizontally with no visible scrollbar (native scroll behavior).

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST display a horizontally scrollable chip row below the search bar with category shortcuts ("All", plus one chip per major category with emoji and label).
- **FR-002**: System MUST support single-select chip behavior — tapping a chip activates it and deactivates the previously active chip. "All" is active by default.
- **FR-003**: When a category chip is tapped (other than "All"), the system MUST filter the template view to show only templates from that category.
- **FR-004**: System MUST display a featured hero card below the chip row with a gradient background, "FEATURED" badge, collection title, description, habit preview chips, user count, and "Explore" CTA.
- **FR-005**: System MUST display the "Trending Now" section with a horizontal carousel of cards (165px wide), each showing: emoji icon on a colored background, habit name, frequency, optional science badge, popularity count with trending icon, and a circular Add button.
- **FR-006**: The circular Add button on trending cards MUST import the habit immediately on tap (single-tap import) without opening a preview modal.
- **FR-007**: After a successful import via the Add button, the button MUST transition from a plus icon to a checkmark icon with a brief scale animation.
- **FR-008**: System MUST display the "Curated Packs" section as full-width vertically stacked cards (not a horizontal carousel), each showing emoji group, pack name, description, habit count, and "Import Pack" button.
- **FR-009**: System MUST display the "Browse by Category" section as a 2-column grid where each tile includes the existing icon, label, and count, plus a row of 4 preview emojis at the bottom.
- **FR-010**: System MUST NOT display any PRO badges on category tiles or pack cards.
- **FR-011**: System MUST NOT display the usage banner (free habit count + "Go PRO") on the Templates screen.
- **FR-012**: The existing paywall guard at import time MUST be preserved — free users are still gated when importing beyond their free habit limit.
- **FR-013**: The "Popular" section title MUST be renamed to "Trending Now" and the "Habit Packs" section title MUST be renamed to "Curated Packs".
- **FR-014**: All sections MUST use staggered entrance animations (FadeInDown with increasing delay per section).
- **FR-015**: Tapping a trending card body (not the Add button) MUST open the existing fullsize template preview modal.
- **FR-016**: The hero card "Explore" CTA and card tap MUST navigate to the category drill-in view for the featured category.

### Key Entities

- **Template**: A habit template with name, icon, iconColor, description, category, frequency, popularityScore, and optional scientificReference. Source of truth is the Convex `templates` collection.
- **Category**: A grouping of templates, identified by string key (e.g., `morning_routine`), enriched with CATEGORY_META (icon, colors, label, count).
- **Premium Pack**: A curated bundle of habits with id, name, description, gradient colors, emoji group, and a list of habit definitions.
- **Quick-Filter Chip**: A UI element representing a category shortcut with emoji, label, and active state. Derived from CATEGORY_META.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can import a habit from the Trending section in 1 tap (down from 3 taps in the current flow: card → preview → import).
- **SC-002**: Users can filter templates by category in 1 tap via quick-filter chips (down from 3 interactions: scroll → find tile → tap).
- **SC-003**: All 3 curated packs are visible during normal vertical scrolling without requiring horizontal scroll discovery.
- **SC-004**: Each category tile shows preview content (4 emojis) that gives users a glimpse of what's inside before tapping.
- **SC-005**: The featured hero card is the dominant visual element above the fold, establishing clear visual hierarchy on screen load.
- **SC-006**: No premium/PRO indicators appear anywhere on the Templates screen (verified by visual audit).
- **SC-007**: All sections animate into view with staggered timing, creating a polished entry experience.
- **SC-008**: The screen remains scrollable and responsive, with no performance degradation from the layout changes.

## Assumptions

- The hero card's featured collection is currently hardcoded to "Morning Mastery" / `morning_routine`. This spec maintains that behavior. If dynamic featured content is desired, it should be a follow-up feature.
- The quick-filter chips derive their list from CATEGORY_META. The specific subset shown (All, Morning, Mental, Fitness, Sleep, Mindful, Learning, Finance) represents the most popular categories. The full category list may differ from what's shown in the chips.
- The "2.4k users" count on the hero card is static display text. If dynamic user counts are desired, that requires backend changes outside this spec's scope.
- Preview emojis for category tiles are derived from the actual template icons in each category (first 4 by popularity). If a category has fewer than 4 templates, fewer emojis are shown.
- The existing import feedback flows (success toast, celebration overlay, error toast) are preserved as-is.
- File decomposition will follow the project's 100-line max rule, with new components extracted into their own files.
