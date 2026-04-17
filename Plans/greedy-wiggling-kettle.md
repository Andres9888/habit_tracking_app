# Streak Goal Variations — Design Exploration

## Context
Chain Day currently shows streak count (fire emoji badge) and a 7-day chain, with auto-assigned milestones (3, 7, 14, 21, 30, 60, 90, 100, 365). There's no way for users to **set their own streak target** (e.g., "reach 66 days"). This exploration creates 10 distinct UI variations for a user-defined streak goal feature, each grounded in behavioral science / UI/UX frameworks.

## Deliverable
Single HTML file at `.superdesign/design_iterations/streak_goals_1.html` showing all 10 variations side-by-side using the app's exact design tokens (warm minimal palette, Literata + DM Sans, burnished gold streak color).

## 10 Variations

### 1. Progress Ring (Goal Gradient Effect)
Circular SVG arc around streak count. Gold fill on gray track. "23/66" inside.
- **Best for:** Compact display, universal recognition
- **Weakness:** Slow fill on long goals, no messy-middle help

### 2. Mountain Path (Narrative Transportation)
Horizontal trail with summit = goal. Waypoint flags at milestones. Avatar moves along.
- **Best for:** Emotional journey, messy-middle (visual variety), recovery ("base camp")
- **Weakness:** Space-heavy, overkill for short goals, illustration complexity

### 3. Milestone Timeline (Zeigarnik Effect)
Horizontal scrollable timeline with notch markers at milestones. Filled line to current day.
- **Best for:** Multiple sub-goals, any goal length, existing milestone data reuse
- **Weakness:** Sparse middle on long goals, reset is dramatic

### 4. Filling Jar (Endowed Progress Effect)
Vertical honey jar fills with golden drops, one per day. Overflow animation at goal.
- **Best for:** Daily tangibility, "collecting" satisfaction, vertical layout fit
- **Weakness:** Imperceptible fills on long goals, streak break = draining?

### 5. Level-Up XP Bar (Self-Determination Theory — Competence)
Horizontal XP bar with named levels from milestones. "+1 DAY" floating text. Level-up celebrations.
- **Best for:** Gamification engagement, named identity tiers, existing milestone mapping
- **Weakness:** Clashes with warm minimal aesthetic, gamification fatigue, extrinsic > intrinsic risk

### 6. Countdown (Loss Aversion)
Large "43 days to go" number counting down. Color shift as it approaches zero.
- **Best for:** End-of-goal urgency, extreme minimalism, tiny footprint
- **Weakness:** Demoralizing start on long goals, no accumulated progress sense, anxiety-inducing

### 7. Calendar Heatmap + Goal Marker (Implementation Intentions)
GitHub-style grid spanning goal length. Colored = done, gray = missed. Goal marker at end.
- **Best for:** History visibility, graceful streak breaks (gaps not resets), information density
- **Weakness:** Tiny cells on long goals, shows misses prominently, feels clinical

### 8. Badge Collection (Collection Completion)
Horizontal scrollable badge cards — earned (color) vs locked (gray). Goal badge has crown treatment.
- **Best for:** Multiple rewards, badges persist after breaks, shareable
- **Weakness:** Sparse for short goals, doesn't show "how close" at a glance

### 9. Chain + Visible Endpoint (Sunk Cost / Commitment)
Existing StreakChain extended to goal day. Telescope effect: detailed nearby, compressed far away.
- **Best for:** Brand alignment ("Chain Day"), sunk cost motivation, existing component extension
- **Weakness:** Complex rendering for long goals, blemishes permanent

### 10. Minimalist % (Fogg Simplicity)
Large percentage in Literata serif + thin fill bar. Haptic at 10% increments. Checkmark at 100%.
- **Best for:** Zero cognitive load, smallest footprint, perfect warm-minimal alignment
- **Weakness:** Boring, no emotional narrative, messy-middle feels static

## Design Tokens for Mock
```
Background:     #F5F1ED
Card:           #EDEAE5
Border:         #DDD8D2
Text Primary:   #2D2A26
Text Secondary: #6B6560
Primary Green:  #059669
Streak Gold:    #8B6208
Streak Light:   #FEF3CD
Gold Accent:    #E8B94D
Dark BG:        #111827
Dark Card:      #1F2937
```

## Implementation
1. Create single HTML page with all 10 variations in a 2-column grid
2. Each variation shows a card with: title, UX principle tag, visual mock at ~Day 23 of 66, and brief rationale
3. Use Google Fonts (Literata + DM Sans), Lucide icons, Tailwind CDN
4. Light mode only for this exploration (matches app default)
5. Open in browser for review

## Verification
- Open the HTML file in browser
- Verify all 10 variations render correctly
- Each uses correct design tokens (colors, typography, spacing)
- Each has its UX framework label and pro/con annotation
