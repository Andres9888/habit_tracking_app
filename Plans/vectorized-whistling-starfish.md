# Plan: Archive Habit Page UX Explorations

## Context

The current Archived Habits page lives inside a modal accessed via **Settings → Data → Archived Habits**. Each card shows habit info (icon, name, archive date, stats badges) with two small buttons: Restore (green) and Delete (red). There's also a "Delete All" danger zone footer.

**User pain points:**
1. Resuming an archived habit isn't fast or intuitive enough
2. Deleting an archived habit has too much friction / not enough clarity
3. The page is buried (Settings → Data → Archived Habits)

**Goal:** Create 10 distinct HTML design explorations focused on making restore and delete actions faster, more discoverable, and more satisfying. Each explores a different interaction paradigm.

---

## Design Explorations (10 variations)

### 1. Swipe Actions (Mail-style)
Swipe right → green "Restore" slides in. Swipe left → red "Delete" slides in. No buttons visible at rest — cards are clean. Follows the existing swipe pattern from the main habit list but adapted for archive context. Fast for power users.

### 2. Prominent Resume CTA
Each card has a large, full-width "Resume This Habit" button as the primary CTA. Delete is a subtle icon in the corner. The entire design screams "these habits want to come back." Restore is the hero action.

### 3. Tinder-style Card Stack
Cards stacked on top of each other. Swipe right to restore, swipe left to delete. Visual indicators show which direction does what. Fast, fun, zero-thought decision-making. Great for clearing out a backlog.

### 4. Batch Selection + Action Bar
Tap cards to select (checkbox appears). Bottom action bar slides up with "Restore Selected" and "Delete Selected" buttons. Long-press to select all. Perfect for users with many archived habits.

### 5. Expandable Accordion Cards
Compact list at rest (icon + name + archive date only). Tap to expand revealing full stats + large, clear action buttons. Saves space, reduces visual noise, but actions are one tap away.

### 6. Two-Zone Drag Sort
Screen split into zones. Drag cards up to a green "Restore" zone or down to a red "Delete" zone. Visual, tactile, satisfying. Cards animate into their destination.

### 7. Quick Action Popover
Tap a card → popover menu appears anchored to the card with: "Resume Habit", "Delete Permanently", "View History". Clean, contextual, no page navigation needed.

### 8. Timeline View with Inline Actions
Chronological timeline (vertical line with dots). Each archived habit is a node on the timeline with inline "Restore" and "Delete" text buttons. Shows the story of when habits were archived. Scannable.

### 9. "Restore Last" Hero + Compact List
Top section: large hero card for the most recently archived habit with prominent "Resume" button. Below: compact, minimal list of older archived habits with subtle swipe actions. Optimizes for the most common case (restoring the habit you just archived).

### 10. Slide-to-Restore (iOS Unlock style)
Each card has a slide-to-restore track — drag the handle right to restore. Prevents accidental restores. Delete available via a trash icon button. Feels intentional and satisfying. The "slide" motion reinforces the action.

---

## Implementation Approach

### What we're building
10 standalone HTML files in `.superdesign/design_iterations/`, each showing one UX concept for the archive page. All use the app's warm minimal design system (parchment backgrounds, forest green primary, DM Sans typography, 16px card radius, warm shadows).

### Design System Tokens (applied to all)
- **Background:** `#F5F1ED` (warm parchment)
- **Surface/Card:** `#EDEAE5` with warm shadow
- **Primary (Restore):** `#059669` (forest green)
- **Destructive (Delete):** `#B53030`
- **Text primary:** `#1F2937`
- **Text secondary:** `#6B7280`
- **Font:** DM Sans (body), Literata (headings)
- **Card radius:** 16px
- **Spacing:** 8px grid
- **Mobile viewport:** 390×844 (iPhone 14 frame)

### Files to create
```
.superdesign/design_iterations/
├── archive_swipe_1.html         # 1. Swipe Actions
├── archive_resume_cta_2.html    # 2. Prominent Resume CTA
├── archive_tinder_3.html        # 3. Tinder Card Stack
├── archive_batch_4.html         # 4. Batch Selection
├── archive_accordion_5.html     # 5. Expandable Accordion
├── archive_drag_zones_6.html    # 6. Two-Zone Drag Sort
├── archive_popover_7.html       # 7. Quick Action Popover
├── archive_timeline_8.html      # 8. Timeline View
├── archive_hero_9.html          # 9. Restore Last Hero
└── archive_slide_10.html        # 10. Slide-to-Restore
```

### Per-file structure
- Self-contained HTML with inline CSS and JS
- Mobile-first (390px width centered on desktop)
- Tailwind CDN + Google Fonts (DM Sans, Literata)
- Lucide icons for UI icons
- Interactive where the concept requires it (swipe simulations, tap states, animations)
- 3-4 sample archived habits with realistic data (e.g., "Morning Meditation", "Read 30 min", "Cold Shower", "Journal")
- Dark mode not required (light mode only for explorations)

### Verification
- Open each HTML file in a browser
- Verify interactions work (swipe, tap, drag where applicable)
- Check visual consistency with design system tokens
- Confirm responsive layout at mobile width
