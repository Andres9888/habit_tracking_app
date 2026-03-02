# Feature Specification: Templates Page Monetization Redesign

**Feature Branch**: `002-templates-monetization-redesign`
**Created**: 2026-03-02
**Status**: Draft
**Input**: User description: "Monetization-optimized Templates Page Redesign for the React Native habit tracking app. Redesign the templates browsing experience with a focus on driving premium conversions while providing excellent UX."
**Reference Mockup**: `.superdesign/design_iterations/templates_redesign_2.html`

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Browse and Add a Free Template (Priority: P1)

A free-tier user opens the Templates screen and sees an organized browsing experience: a usage banner showing how many free habit slots remain (e.g., "1 of 3 used"), a featured collection spotlighting a curated template pack, a horizontally-scrollable "Popular" carousel of compact template cards, and a category grid for deeper exploration. The user taps "+ Add" on a popular template card. A success toast with confetti confirms the import, and the usage banner updates to reflect one fewer free slot remaining.

**Why this priority**: This is the core browsing and import flow that every user must experience. Without this, the screen has no purpose.

**Independent Test**: Can be fully tested by navigating to Templates, scrolling the popular carousel, tapping "+ Add" on a template, and verifying the toast confirmation and usage counter update.

**Acceptance Scenarios**:

1. **Given** a free user with 1 of 3 habits used, **When** user opens the Templates screen, **Then** the usage banner displays "1 of 3 free habits used" with 1 filled dot and 2 empty dots.
2. **Given** the Templates screen is loaded, **When** the user taps "+ Add" on a popular template card, **Then** the button changes to "✓ Added", a success toast appears for 5 seconds, confetti fires, and the usage banner increments by one.
3. **Given** the Templates screen is loaded, **When** the screen first renders, **Then** all sections animate in with staggered entrance animations (60ms delay between sections).
4. **Given** a free user has already added a template, **When** the user scrolls to the same template card, **Then** the card shows "✓ Added" and the button is non-interactive.

---

### User Story 2 - Explore Categories and Preview a Template (Priority: P1)

A user taps a category tile (e.g., "Morning Routine") from the category grid. A category drill-in view slides in from the right showing all templates in that category as full-width list cards with accent bars, science badges, frequency tags, and "Preview" / "+ Add" actions. The user taps "Preview" on a template to open a light-themed full-screen preview modal showing the template icon, name, description, science-backed research callout, and success tips. From the preview, the user can tap "Quick Add" to import or "Customize" to personalize before importing.

**Why this priority**: Category browsing and template preview are essential for discovery and informed decision-making. Users need to understand what a template offers before committing.

**Independent Test**: Can be tested by tapping a category, verifying the drill-in view loads with correct templates, tapping "Preview", and verifying the modal displays all template details with working "Quick Add" and close actions.

**Acceptance Scenarios**:

1. **Given** the user is on the main Templates screen, **When** the user taps a category tile, **Then** a category view slides in from the right (280ms transition) showing filtered templates with a back button, category icon, category name, template count, and science-backed count.
2. **Given** the user is in a category view, **When** the user taps "Preview" on a template card, **Then** a light-themed bottom sheet modal opens (background #FAFAF9) showing the template icon (large), name, frequency pills, science pills, description, research box (green), and success tips (yellow).
3. **Given** the preview modal is open for a free template, **When** the user taps "Quick Add", **Then** the template is imported, the button updates to "✓ Added", a toast fires, and the modal closes after a brief delay.
4. **Given** the user is in a category view, **When** the user taps the back arrow, **Then** the view slides out to the right and the main screen is restored.

---

### User Story 3 - See All Popular Templates (Priority: P2)

A user taps "See all" next to the "Popular" section header. A full-screen list view slides in showing all popular templates as full-width list cards (same format as category drill-in) with the total count displayed in the sub-header. Each card has accent bars, science badges, frequency tags, and "+ Add" / "Preview" actions. The user can add templates or preview them from this view.

**Why this priority**: Power users want to browse the full catalog without being limited to the carousel. This expands the discovery surface for popular content.

**Independent Test**: Can be tested by tapping "See all", verifying the list view loads with all popular templates, and confirming add/preview actions work from this view.

**Acceptance Scenarios**:

1. **Given** the user is on the main Templates screen, **When** the user taps "See all" next to "Popular", **Then** a full-screen view slides in showing all popular templates as list cards with "All Popular Templates" header and "{N} templates · sorted by popularity" sub-header.
2. **Given** the user is in the See All view, **When** the user taps "+ Add" on a template, **Then** the template is imported with the same success flow as on the main screen (toast, confetti, button update).
3. **Given** the user has already added a template from the main carousel, **When** they open the See All view, **Then** that template already shows "✓ Added" state.

---

### User Story 4 - Hit Free Limit and See Paywall (Priority: P1)

A free-tier user has used all 3 free habit slots. The usage banner now shows "3 of 3 free habits used" with all dots filled and an "Unlock All" call-to-action. When the user tries to add any additional template (from carousel, list, or preview), a paywall bottom sheet appears showing the upgrade offer: unlimited habits, premium packs, and all tools for $6.99/month with cancel-anytime messaging. The user can dismiss the paywall or proceed to purchase.

**Why this priority**: This is the primary monetization trigger — converting free users to premium at the natural friction point. Without this, the redesign fails its core business objective.

**Independent Test**: Can be tested by simulating a free user with 3 habits, attempting to add a template, and verifying the paywall appears with correct pricing and perks.

**Acceptance Scenarios**:

1. **Given** a free user has 3 of 3 habits used, **When** the user taps "+ Add" on any free template, **Then** the paywall bottom sheet slides up instead of importing the template.
2. **Given** the paywall is displayed, **Then** it shows: headline "Unlock Unlimited Habits", description, 3+ benefit items with icons, a primary CTA button "Upgrade to Premium", "$6.99/month · Cancel anytime" sub-text, and a close button.
3. **Given** the paywall is displayed, **When** the user taps the background overlay or close button, **Then** the paywall dismisses and the user returns to their previous position.
4. **Given** a free user with 3 habits, **When** the usage banner is visible, **Then** the "Unlock All" CTA button is prominently displayed in the banner.

---

### User Story 5 - Discover and Attempt Premium Packs (Priority: P2)

A user scrolls past the Popular section and sees a "Premium Packs" section with a "PRO" badge. Compact pack cards show grouped emojis, pack name, description, and an "🔓 Unlock Pack" button. Tapping any premium pack or its unlock button opens the paywall. Premium packs are visually distinct with a purple accent color scheme.

**Why this priority**: Premium packs create aspiration and demonstrate the value of upgrading. They serve as passive conversion prompts even if the user doesn't interact with them.

**Independent Test**: Can be tested by scrolling to the Premium Packs section, tapping a pack card, and verifying the paywall appears.

**Acceptance Scenarios**:

1. **Given** the Templates screen is loaded, **When** the user scrolls to the Premium Packs section, **Then** horizontally-scrollable pack cards are displayed with grouped emoji icons, pack name, description, "🔓 Unlock Pack" button, and a lock icon in the corner.
2. **Given** a premium pack is visible, **When** the user taps anywhere on the pack card, **Then** the paywall bottom sheet opens.
3. **Given** the user is premium, **When** they view a premium pack, **Then** the card shows an "Add Pack" action instead of "🔓 Unlock Pack", and tapping it opens a pack confirmation flow.

---

### User Story 6 - Premium User Adds a Pack (Priority: P3)

A premium user taps "Add Pack" on a premium pack. A pack confirmation bottom sheet appears listing all habits in the pack with their emoji, name, and frequency. Checkmarks animate one by one to confirm each habit. The user can tap "Add All {N}" to import the entire pack or "Cancel" to dismiss. After confirmation, all habits are imported and a toast confirms with the count.

**Why this priority**: Pack imports reward premium users with efficient bulk actions, reinforcing the value of their subscription.

**Independent Test**: Can be tested by simulating a premium user, tapping a pack, verifying the confirmation sheet lists all habits, and confirming bulk import with animated checkmarks.

**Acceptance Scenarios**:

1. **Given** a premium user taps a premium pack card, **When** the pack confirmation sheet opens, **Then** it displays: pack title, "{N} habits will be added" description, a list of all habits with emoji/name/frequency, and "Cancel" / "Add All {N}" buttons.
2. **Given** the pack confirmation is open, **When** the user taps "Add All {N}", **Then** checkmarks animate sequentially on each habit (200ms stagger), then all habits are imported, the sheet closes, and a summary toast appears.
3. **Given** adding the pack would exceed the free habit limit, **When** the user taps "Add All", **Then** the pack confirmation closes and the paywall opens instead.

---

### User Story 7 - Search Templates (Priority: P3)

A user taps the search bar and types a query. Results filter in real-time across all categories. The search bar has a visible placeholder ("Search templates..."), focus state with accent border glow, and clear affordance.

**Why this priority**: Search is a utility feature for returning users who know what they want. It accelerates the path to import for specific templates.

**Independent Test**: Can be tested by tapping search, typing a query, and verifying filtered results appear.

**Acceptance Scenarios**:

1. **Given** the user is on the main Templates screen, **When** the user taps the search bar and types "meditation", **Then** the main screen content is replaced with filtered results matching the query across all categories.
2. **Given** a search is active, **When** the user clears the search input, **Then** the main screen content is restored to its default state.

---

### Edge Cases

- What happens when the user has 0 habits and all 3 free slots are available? — The usage banner shows "0 of 3" with all dots empty and no "Unlock All" CTA emphasis.
- What happens when a user adds a template and immediately navigates to a different view (category, see-all)? — The added state persists across all views; the template shows "✓ Added" everywhere.
- What happens when the user taps "Quick Add" in the preview modal for a template they already added? — The button is disabled (shows "✓ Added") and is non-interactive.
- What happens if the template database is empty or the seed hasn't loaded? — An empty state is shown with a prompt to seed templates.
- What happens when a premium user's subscription expires while on the Templates screen? — The premium status is re-evaluated on each import attempt; if expired, the paywall is shown.
- What happens when a user tries to add a premium-only template while free? — The paywall appears regardless of how many free slots remain; premium content requires a subscription.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST display a usage banner showing the number of habits used out of the free limit (currently 3) with visual dot indicators.
- **FR-002**: System MUST display a "Popular" section with a horizontally-scrollable carousel of compact template cards (width 200px per card).
- **FR-003**: System MUST display a "Premium Packs" section with horizontally-scrollable pack cards visually distinguished by purple accent colors and lock indicators.
- **FR-004**: System MUST display a "Browse by Category" section with a 2-column grid of category tiles showing category icon, name, and template count.
- **FR-005**: System MUST display a featured collection banner at the top of the content area highlighting a curated template or pack.
- **FR-006**: Users MUST be able to tap "See all" to navigate to a full list view of all popular templates.
- **FR-007**: Users MUST be able to tap a category tile to navigate to a category drill-in view showing only that category's templates.
- **FR-008**: System MUST provide a template preview modal rendered in a light theme (light background) showing: large icon, template name, frequency and duration pills, science-backed callout (green box), and success tips (yellow box).
- **FR-009**: Users MUST be able to add a template via "+ Add" buttons on carousel cards, list cards, and the "Quick Add" button in the preview modal.
- **FR-010**: System MUST show a success toast notification (dismisses after 5 seconds) and confetti animation when a template is successfully added.
- **FR-011**: System MUST update the usage banner in real-time when a habit is added.
- **FR-012**: System MUST present a paywall bottom sheet when a free user attempts to add a template after reaching the free habit limit (3).
- **FR-013**: System MUST present a paywall when any user attempts to access premium-only content (premium packs, premium templates).
- **FR-014**: The paywall MUST display: upgrade headline, benefit list with icons, primary CTA button, pricing ($6.99/month), and cancel-anytime messaging.
- **FR-015**: System MUST provide a pack confirmation bottom sheet for premium users showing all habits in the pack with animated sequential checkmarks on confirmation.
- **FR-016**: System MUST persist the "added" state of templates across all views within the same session (carousel, see-all, category, preview).
- **FR-017**: Template list cards MUST display a 4px colored accent bar, icon, name, description (2-line clamp), science badge (if applicable), frequency tag, and action buttons.
- **FR-018**: System MUST provide a search bar that filters templates across all categories in real-time.
- **FR-019**: All view transitions MUST animate with slide-from-right navigation (280ms duration).
- **FR-020**: All content sections MUST animate in with staggered entrance animations (60ms stagger between items).
- **FR-021**: All interactive elements MUST provide tactile feedback (press scale-down animation).
- **FR-022**: Premium templates MUST show a lock indicator on the icon and a "✨ Premium" tag.

### Key Entities

- **Template**: A habit definition that users can import. Key attributes: name, icon (emoji), icon color, category, description, frequency, scientific reference, tips, premium flag, popularity score.
- **Template Category**: A grouping of related templates. Key attributes: category ID, display name, icon (emoji), background color, text color, template count, premium flag.
- **Premium Pack**: A curated bundle of multiple templates sold as a group. Key attributes: pack name, description, list of included habits (each with emoji, name, frequency), visual emoji group, background gradient.
- **User Habit Slot**: The user's current count of active habits relative to the free limit (3). Tracks used/available slots and determines paywall triggers.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Free-tier users who visit the Templates screen encounter the paywall within their first session at a rate of 60% or higher (measured by paywall view / screen view).
- **SC-002**: Premium conversion rate from the Templates screen paywall increases by at least 25% compared to the current alert-based limit notification.
- **SC-003**: Average templates imported per user session increases by at least 30% compared to the current browse experience.
- **SC-004**: Users can browse, preview, and add a template in under 10 seconds (from screen open to toast confirmation).
- **SC-005**: 90% of users who open the Templates screen scroll past the first fold (below the featured collection) within 5 seconds, indicating engaging content hierarchy.
- **SC-006**: The redesigned screen renders all initial content (above-the-fold: header, search, usage banner, featured, popular carousel) within 1 second of screen open.
- **SC-007**: Premium pack section receives at least 15% tap-through rate among free users who scroll to it, indicating aspirational content effectiveness.
- **SC-008**: Toast and confetti success celebration increases repeat template imports by 20% compared to the current silent import flow.

## Assumptions

- The free habit limit remains at 3 (as defined in `src/constants/app.ts`).
- Premium pricing remains $6.99/month via RevenueCat.
- The existing 14 template categories and their seed data remain the data source.
- The existing `FullsizeTemplatePreview` light-theme pattern (#FAFAF9 background) is the established design precedent for preview modals.
- Only the `andrew_huberman` category is currently premium-gated; this redesign supports arbitrary premium flagging per template and per category.
- The existing customization flow (name, color, reminder via `TemplatePreviewModal`) remains available via the "Customize" action in the preview modal.
- Pack confirmation logic handles the case where adding a pack would exceed the free limit by redirecting to the paywall.
- Design system tokens (colors, typography, spacing, border radius, shadows, animations) as documented in `src/theme/` are the source of truth and must be followed exactly.
