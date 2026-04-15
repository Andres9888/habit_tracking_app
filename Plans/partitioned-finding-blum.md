# Plan: 10 Onboarding Mockups

## Context

The current onboarding carousel is auto-skipped for all new users (they land directly on the empty state). A contextual tooltip spec exists but isn't implemented. We need to explore 10 different onboarding approaches as mobile-sized HTML mockups grounded in UX science, monetization strategy, and the app's existing warm minimal design language.

## Design System Reference

- **Background**: `#F5F1ED` (warm parchment)
- **Cards**: `#EDEAE5` with `#DDD8D2` borders
- **Primary CTA**: `#059669` (forest green)
- **Text**: `#2D2A26` (headings), `#6B6560` (body)
- **Streak accent**: `#936A08` / `#E8B94D` (gold, sparingly)
- **Premium**: `#7B52C4`
- **Fonts**: Literata (display/serif), DM Sans (body/UI), JetBrains Mono (data)
- **Border radius**: 16px cards, 12px buttons, 9999px pills
- **Phone frame**: 375x812px

## 10 Mockup Concepts

### 1. `onboarding_value_carousel_1.html` — Value-First Carousel
**UX Framework**: Fogg Behavior Model (motivation before ability)
- 3 screens: "Build Unbreakable Habits" → "Science-Backed Strength Meter" → "200+ Templates"
- Each screen has a single illustration, bold headline, one-line description
- Social proof stat on each screen ("Join 12,000+ habit builders")
- Bottom: progress dots + green CTA ("Next" / "Get Started")
- Skip link top-right

### 2. `onboarding_goal_first_1.html` — Goal-Setting Personalization
**UX Framework**: Self-Determination Theory (autonomy + competence)
- Screen 1: "What do you want to build?" with 6 tappable category cards (Health, Productivity, Mindfulness, Fitness, Learning, Custom)
- Screen 2: Suggested habits based on selection, each with a toggle
- Screen 3: "When will you do it?" — time picker with morning/afternoon/evening quick picks
- Personalizes the app from the first moment — increases ownership

### 3. `onboarding_commitment_1.html` — Commitment Device
**UX Framework**: Implementation Intentions (Gollwitzer, 1999)
- Single scrollable screen
- "I will [habit] at [time] in [location]" fill-in-the-blank format
- Research callout: "People who write specific plans are 2-3x more likely to follow through"
- Signature-style "I commit" button with haptic-like visual pulse
- Minimal, focused, psychologically potent

### 4. `onboarding_tooltip_contextual_1.html` — Contextual Tooltips (from spec)
**UX Framework**: Situated Learning / Learn-by-doing
- Shows the actual app UI (empty habits list) with a dark overlay
- Spotlight on the "+" button with tooltip: "Tap here to create your first habit"
- Progress dots (1/4), Skip button top-right
- Pointer hand emoji animation near the spotlight
- Represents step 1 of the 4-step contextual flow from the spec

### 5. `onboarding_social_proof_1.html` — Social Proof & Stats
**UX Framework**: Social Learning Theory (Bandura)
- Hero stat: "847,000 habits completed this month"
- 3 mini testimonial cards with avatars, names, and habit streaks
- Before/after habit strength meter visualization
- "Join the community" CTA
- Trust signals: app store rating, "Featured in..." badges

### 6. `onboarding_freemium_gate_1.html` — Monetization-Aware Onboarding
**UX Framework**: Anchoring Effect + Loss Aversion
- Welcome screen that subtly introduces free vs premium
- Left column: "Free" (3 habits, basic tracking, streaks)
- Right column: "Premium" with gold accent (unlimited habits, analytics, templates, strength insights)
- "Start Free" primary CTA + "Try Premium Free for 7 Days" secondary
- No hard gate — just plants the seed early

### 7. `onboarding_gamified_1.html` — Gamified First Steps
**UX Framework**: Octalysis Framework (Epic Meaning + Accomplishment)
- Checklist-style onboarding: 4 steps shown as a quest/journey
- Each completed step reveals a small reward (badge, confetti)
- Progress bar at top showing 0/4 → 4/4
- Steps: "Create Profile" ✓ → "Add First Habit" → "Set Reminder" → "Complete First Day"
- XP-like points system hint

### 8. `onboarding_quiz_personality_1.html` — Personality Quiz
**UX Framework**: Bartle Player Types + Habit Tendency (Rubin)
- "What kind of habit builder are you?" header
- 3 quick questions with visual answer cards (not text-heavy)
- Q1: "How do you stay motivated?" (Streaks / Goals / Community / Data)
- Q2: "What's your pace?" (Sprint / Steady / Flexible)
- Q3: "What matters most?" (Consistency / Growth / Fun)
- Results in a "type" with personalized app setup

### 9. `onboarding_empty_state_rich_1.html` — Rich Empty State
**UX Framework**: Progressive Disclosure
- No separate onboarding — the empty habits screen IS the guide
- Large friendly illustration in the center
- "Your habit journey starts here" with an arrow pointing to the add button
- 3 suggestion chips: "Morning Routine", "Daily Exercise", "Read 10 Pages"
- Tapping a chip pre-fills habit creation — zero friction

### 10. `onboarding_story_narrative_1.html` — Story-Driven Narrative
**UX Framework**: Narrative Transportation Theory
- Single scrollable storytelling screen
- "Day 1: You start small" → visual of a tiny seedling
- "Day 7: Roots form" → seedling growing
- "Day 30: Strength builds" → small tree with strength meter overlay
- "Day 90: Automatic" → full tree, habit is part of your life
- "Your story starts now" CTA at bottom
- Maps the habit strength concept to a growth metaphor

## Output

All files saved to `.superdesign/design_iterations/` following the naming convention above. Each is a self-contained HTML file with:
- Tailwind CSS via CDN
- Google Fonts (Literata, DM Sans, JetBrains Mono)
- Lucide icons
- Phone-frame wrapper (375x812, centered on page with dark background)
- App's warm minimal color palette
- Smooth CSS animations where appropriate

## Verification

1. Open each HTML file in browser to verify rendering
2. Check mobile frame sizing is consistent across all 10
3. Verify color palette matches the app's design system
4. Confirm each mockup clearly represents its UX concept
