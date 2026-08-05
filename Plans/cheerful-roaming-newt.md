# Create Habit Page — UX Audit & Optimization Plan

## Context

The Create Habit modal is the primary conversion point in the app — every user must pass through it to get value. It's currently well-built with good accessibility, haptics, and animations. This audit identifies consistency gaps, science-backed improvements, monetization opportunities, and concrete A/B test ideas to maximize both creation completion rate and premium conversion.

---

## 1. Design Consistency Fixes

Small issues where the create modal deviates from the app's design system.

### 1a. Typography mismatches

| Element | Current | Design System Token | Fix |
|---------|---------|-------------------|-----|
| Heading "Name your new habit" | 28px bold | No 28px token exists (closest: 22px heading1 or 34px displayLarge) | Change to 22px Literata bold (heading1) or promote 28px to a named token |
| TextInput font weight | 22px medium (500) | heading2 = 22px semibold (600) | Align to 600 weight |
| SaveButton text | 15px semibold | button = 17px semibold | Change to 17px |

**Files:** `NameInputSection.tsx:34`, `NameInputSection.tsx:43`, `SaveButton.tsx:51`

### 1b. Hardcoded colors (dark mode risk)

| Component | Issue | Fix |
|-----------|-------|-----|
| `SuccessCard.tsx:62` | `bg-white` hardcoded | Use `themeColors.card` |
| `SuccessCard.tsx:66` | `shadowColor: '#1c1917'` | Use theme shadow color `#2D2A26` |
| `EmojiChip.tsx` | Hardcodes `#059669`, `#D1FAE5` | Use `colors.primary[600]`, `colors.primary[100]` |
| `PresetButton.tsx` | Hardcodes `#ECFDF5`, `#10B981`, etc. | Use theme tokens |

### 1c. Spacing off-grid

| Location | Current | Fix |
|----------|---------|-----|
| `NameInputSection.tsx:32` | `marginBottom: 40` (not on 8px grid) | Use `spacing['2xl']` (48px) or `spacing.xl` (32px) |

### 1d. Validation threshold mismatch (bug)

- `ModalHeader.tsx:21`: `canSave = habitName.trim().length > 0` — button enables at **1 char**
- `NameInputSection.tsx:65`: error says "at least **2 characters**"
- Actual create logic (`useCreateHabitModal.ts:46`): allows 1+ chars

**Fix:** Either change `canSave` to `length >= 2` to match the error message, or change the error message to "at least 1 character." The 2-char minimum is the better UX choice (prevents accidental single-letter habits).

---

## 2. UX Science Audit

### What's strong (keep these)

| Principle | Implementation | Assessment |
|-----------|---------------|------------|
| **Fogg — Ability** | Only 1 required field, smart defaults for emoji/color | Excellent friction reduction |
| **Progressive Disclosure** | Reminder presets hidden until toggle, full emoji picker behind "Browse more" | Well-executed |
| **Aesthetic-Usability** | Warm stone palette, spring animations, confetti celebration | Strong emotional design |
| **Zeigarnik Effect** | "Your streak starts now" creates an open loop | Good forward momentum |
| **Peak-End Rule** | Confetti + haptic celebration anchors a positive peak | Well-timed |

### What's missing (opportunities)

| Principle | Gap | Recommendation |
|-----------|-----|----------------|
| **Fogg — Trigger** | No contextual cue prompt ("After what routine?") | Add optional implementation intention chip selector (Test 3 below) |
| **Fitts's Law** | Save button in top-right header = maximum thumb travel from bottom sheet | Move CTA to sticky bottom bar (Test 1 below) |
| **Goal-Setting Theory** | No frequency, target, or specificity prompts | Keep minimal for now, but test "How often?" with "Daily" pre-selected |
| **Implementation Intentions** | Reminder gives "when" but no "where" or "after what" | Lightweight cue prompt would double follow-through (Gollwitzer 1999) |
| **Loss Aversion** | Success screen has no visual streak to protect | Add 7-day streak preview to create urgency for day-2 return (Test 4 below) |
| **IKEA Effect** | Paywall blocks modal from opening at habit limit — user has zero investment | Let user build the habit first, then paywall on save (Test 2 below) |

---

## 3. Monetization Opportunities

### Current state
- **FREE_HABIT_LIMIT = 3** — hard gate via `Alert.alert()` before modal opens
- **PremiumTeaser component exists** (`src/components/CreateHabitModal/components/PremiumTeaser/`) — shows blurred AI suggestions with shimmer — but is **NOT rendered** in the current form
- **No monetization touchpoint** during or after habit creation for users under the limit

### Recommendations (non-destructive, additive)

| Opportunity | Mechanism | Science Basis | Risk |
|-------------|-----------|---------------|------|
| **Activate PremiumTeaser** | Render existing component between color picker and reminder toggle | Exposure effect — users see premium value every creation | Guard: monitor creation completion rate, kill if >2% drop |
| **Post-investment paywall** | Let 4th-habit users open modal, build their habit, paywall on "Create" tap | IKEA Effect (Norton et al. 2012) — people value what they partially build | Requires A/B test vs current gate |
| **3rd-habit success upsell** | On 3rd habit creation, success screen shows soft "Unlock unlimited" CTA | Peak motivation moment + last free habit = urgency | Keep soft — secondary CTA below main "Let's get started" |
| **Smart scheduling premium** | Reminder presets are free; "AI optimal time" suggestion is premium | Anchoring — free users see the option exists | Don't lock the basic reminder, only the smart suggestion |

---

## 4. A/B Test Ideas (Prioritized)

### Test 1: Save Button Placement — Bottom vs. Top

**Hypothesis:** Sticky bottom CTA increases creation completion rate by 15%+ (Fitts's Law — thumb is already at bottom of sheet).

- **Control:** Current top-right "Create" pill in ModalHeader
- **Treatment:** `StickyCreateBar` component (already exists in codebase) pinned to bottom
- **Primary metric:** Modal opened → habit saved completion rate
- **Secondary:** Time to save, abandonment rate
- **Effort:** Low — both components already exist

### Test 2: Post-Investment Paywall (users at 3-habit limit)

**Hypothesis:** Showing paywall after user customizes their 4th habit increases conversion 20%+ vs blocking modal (IKEA Effect).

- **Control:** Alert dialog blocks modal from opening
- **Treatment:** Modal opens normally, paywall appears on "Create" tap with preview of the habit card they designed
- **Primary metric:** Premium conversion rate from habit-limit trigger
- **Secondary:** Create modal open rate, time in modal
- **Effort:** Medium — need to move gate from pre-open to pre-save

### Test 3: Implementation Intention Prompt

**Hypothesis:** "When will you do this?" chip selector increases 7-day retention 10%+ (Gollwitzer 1999 meta-analysis).

- **Control:** Current form (name → emoji → color → reminder)
- **Treatment:** Add "When will you do this?" with 4-5 chips (After morning coffee, Before bed, During lunch, After work, Custom) between name and emoji sections
- **Primary metric:** 7-day streak maintenance for created habit
- **Guard metric:** Creation completion rate must not drop >5%
- **Effort:** Medium — new component, maps to existing `dayPhase` field

### Test 4: Success Screen Streak Preview

**Hypothesis:** Visual 7-day streak preview increases day-2 return rate 12%+ (Zeigarnik + loss aversion on incomplete visual).

- **Control:** Current success screen ("Your streak starts now" + "Let's get started")
- **Treatment:** Add horizontal 7-day tracker `[Day 1: filled] [Day 2-7: empty]` with "7 days to build momentum. Day 1 starts now."
- **Primary metric:** Day-2 app open rate
- **Secondary:** Day-7 retention, immediate habit check-off
- **Effort:** Low-medium — new visual component in SuccessCard

### Test 5: PremiumTeaser Activation

**Hypothesis:** Rendering PremiumTeaser in create form increases trial starts 8%+ without hurting creation completion >2%.

- **Control:** No PremiumTeaser (current)
- **Treatment A:** PremiumTeaser between color picker and reminder toggle
- **Treatment B:** PremiumTeaser in success screen after creation
- **Primary metric:** Premium trial start rate
- **Guard metric:** Creation completion rate
- **Effort:** Low — component already exists, just needs to be rendered

---

## 5. Implementation Priority

| # | Change | Type | Effort | Impact |
|---|--------|------|--------|--------|
| 1 | Fix validation threshold mismatch (canSave >= 2) | Bug fix | Trivial | Trust/consistency |
| 2 | Fix hardcoded colors in SuccessCard, EmojiChip, PresetButton | Consistency | Low | Dark mode correctness |
| 3 | Align typography to design system tokens | Consistency | Low | Visual consistency |
| 4 | Fix off-grid spacing (marginBottom 40 → token) | Consistency | Trivial | Grid alignment |
| 5 | A/B Test 1: Save button bottom placement | Experiment | Low | +15% completion |
| 6 | A/B Test 5: Activate PremiumTeaser | Experiment | Low | +8% trial starts |
| 7 | A/B Test 2: Post-investment paywall | Experiment | Medium | +20% conversion |
| 8 | A/B Test 4: Streak preview in success screen | Experiment | Low-Med | +12% day-2 return |
| 9 | A/B Test 3: Implementation intention prompt | Experiment | Medium | +10% 7-day retention |

**Prerequisite for all A/B tests:** Analytics pipeline must be connected. `trackers.ts` currently uses `NoOpAnalyticsTracker` in production. The `setAnalyticsTracker()` API exists but needs a real provider (PostHog, Amplitude, etc.).

---

## 6. Verification

- **Consistency fixes:** Visual diff in light + dark mode, run `npm run lint:max-lines` to confirm no file bloat
- **Validation fix:** Manual test — type 1 char, verify button is disabled; type 2 chars, verify button enables
- **A/B tests:** Each test needs analytics events for variant assignment, primary metric, and guard metrics before launch

## Key Files

- `src/components/CreateHabitModal/components/CreateHabitFormCentered.tsx` — form composition
- `src/components/CreateHabitModal/components/NameInputSection.tsx` — name input + validation UX
- `src/components/CreateHabitModal/components/ModalHeader/SaveButton.tsx` — CTA button
- `src/components/CreateHabitModal/components/ModalHeader/ModalHeader.tsx` — canSave threshold
- `src/components/CreateHabitModal/components/SuccessAnimation/SuccessCard.tsx` — success screen
- `src/components/CreateHabitModal/components/PremiumTeaser/PremiumTeaser.tsx` — existing unused teaser
- `src/components/CreateHabitModal/components/EmojiPicker/EmojiChip.tsx` — hardcoded colors
- `src/components/CreateHabitModal/components/EnhancedReminderSelector/PresetButton.tsx` — hardcoded colors
- `src/utils/createHabitModalAnalytics/trackers.ts` — analytics infrastructure
- `src/features/habits/useHabitsAppHandlers.ts` — habit limit gate logic
