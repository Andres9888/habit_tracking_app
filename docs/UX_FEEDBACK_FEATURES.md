# User Feedback & Social Proof Features

This document describes the user feedback collection and social proof features implemented in Chain Day.

## 1. App Store Review Prompts ✅

### Implementation
- **File**: `src/utils/storeReview.ts`
- **Package**: `expo-store-review` (already installed)

### Triggers

#### Milestone Celebrations
- **When**: After achieving 7, 14, or 30-day streaks
- **Location**: `src/components/StreakMilestoneCelebration/useCelebrationHandlers.ts`
- **Logic**: Calls `maybeRequestReview(milestoneDays)` after celebration animation

#### Analytics Screen (NEW)
- **When**: User views Analytics screen with positive stats
- **Criteria**: 
  - Average completion rate ≥ 70%
  - At least 3 active habits
- **Location**: `src/screens/AnalyticsScreen/AnalyticsScreen.hooks.ts`
- **Logic**: Calls `maybeRequestReviewFromAnalytics()` once per session

### Guard Conditions (Applied to All Triggers)
1. ✅ Minimum 5 total completions
2. ✅ 90-day cooldown between prompts
3. ✅ Platform support check (native only, not web)
4. ✅ Native API availability check

### Manual Trigger
- **Location**: Settings → App → "Rate Chain Day"
- **Behavior**: Opens App Store page or native review dialog

---

## 2. Achievement Sharing ✅

### Implementation
- **Component**: `src/components/ShareCardGenerator/`
- **Package**: `expo-sharing`, `react-native-view-shot`

### Features
- **Platforms**: Instagram Story/Feed, Twitter, Facebook
- **Customization**:
  - 4 gradient background presets
  - Personal message input
  - User name toggle
- **Share Trigger**: From Milestone Celebration modal
- **Output**: High-quality image with habit achievement details

### How It Works
1. User hits a milestone (7, 14, 21, 30, 60, 90, 180, 365 days)
2. Celebration modal shows with confetti
3. User can tap "Share" button
4. ShareCardGenerator modal opens with preview
5. User customizes card (gradient, message, platform)
6. Taps "Share to [Platform]"
7. Native share sheet opens with generated image

### Technical Details
- Uses `react-native-view-shot` to capture card as image
- Different aspect ratios per platform:
  - Instagram Story: 9:16 (1080x1920)
  - Instagram Feed: 1:1 (1080x1080)
  - Twitter: 16:9 (1200x675)
  - Facebook: 1.91:1 (1200x628)

---

## 3. In-App Feedback Collection ✅ (NEW)

### Implementation
- **Component**: `src/components/FeedbackModal/`
- **Location**: Settings → App → "Send Feedback"

### Features

#### Feedback Types
1. 🐛 **Bug Report**
   - Red theme (#ef4444)
   - Prompts for: What happened? Steps to reproduce?
   
2. 💡 **Feature Request**
   - Amber theme (#f59e0b)
   - Prompts for: Describe the feature and how it would help
   
3. 💬 **General Feedback**
   - Purple theme (#8b5cf6)
   - Prompts for: Share your thoughts

#### Form Fields
- **Feedback Type** (required): Radio selection
- **Title** (required): Brief summary (max 500 chars)
- **Description** (required): Detailed explanation (max 5000 chars)
- **Email** (optional): For follow-up

#### Submission
- Opens email client with pre-filled template
- Sends to: `support@chainday.app`
- Subject: `[Type] Title`
- Body: Structured with all details

### Why Email-Based?
- No backend needed
- User can attach screenshots before sending
- Preserves user privacy (email on their device)
- Support team gets context-rich emails

---

## 4. Contact Support

### Legacy "Contact Support" (Replaced)
- Old behavior: Direct `mailto:` link
- New behavior: Opens FeedbackModal

### Error Handling
- **Error Boundary**: Has "Contact Support" link
- **Still uses direct mailto**: For critical crashes

---

## Testing Checklist

### Store Review
- [ ] Test milestone review prompt (manually trigger 7-day milestone)
- [ ] Test analytics review prompt (view analytics with 70%+ completion)
- [ ] Verify 90-day cooldown works
- [ ] Verify minimum completion guard
- [ ] Test "Rate Chain Day" button in Settings

### Sharing
- [ ] Complete a milestone
- [ ] Open ShareCardGenerator from celebration
- [ ] Test all 4 gradient presets
- [ ] Test personal message input
- [ ] Test username toggle
- [ ] Test share to each platform format
- [ ] Verify image quality
- [ ] Test on iOS and Android

### Feedback Modal
- [ ] Open from Settings → App → Send Feedback
- [ ] Test bug report flow
- [ ] Test feature request flow
- [ ] Test general feedback flow
- [ ] Verify required field validation
- [ ] Test character limits (500/5000)
- [ ] Test email submission (opens mail app)
- [ ] Test cancel/close behavior

---

## Future Enhancements

### Potential Additions
1. **Share from Analytics**
   - Add share button in analytics to share progress charts
   
2. **Share Individual Habits**
   - Share specific habit streaks (not just milestones)
   
3. **In-App Review History**
   - Track when user was prompted, dismissed, or reviewed
   
4. **A/B Test Review Timing**
   - Test different thresholds for analytics-based reviews
   
5. **Feedback Sentiment Analysis**
   - Auto-categorize feedback types from description

### Notes
- Store review prompts are intentionally conservative (90-day cooldown)
- Never interrupt negative moments (e.g., habit deletion, streak loss)
- All prompts are passive — user can always dismiss
- Privacy-first: No tracking of what user selected in review dialog
