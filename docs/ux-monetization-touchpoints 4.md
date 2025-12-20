# UX Monetization Touchpoints - Haptics, Animations & Micro-Interactions

**Project:** My Project (Habit Tracking App)
**Created:** 2025-11-01
**Designer:** Sally (UX Expert)
**For:** Jane

---

## Overview

This document defines the haptics, animations, and micro-interactions for key monetization touchpoints in the habit tracking app. Each interaction is designed to maximize conversion while maintaining a premium, delightful user experience.

**Design Principles:**
- 🎯 **Intentional Friction:** Use subtle animations to draw attention to premium features
- ✨ **Delight First:** Every interaction should feel premium, even for free users
- 🔄 **Progressive Disclosure:** Show value before asking for payment
- 💎 **Premium Feel:** Premium users get faster, smoother, more satisfying interactions

---

## Component: Habit Plus Button (FloatingActionButton)

**Location:** Main screen, bottom-right corner
**Function:** Primary CTA for habit creation
**Importance:** First major engagement point, conversion trigger at limit

### State 1: Free User (Under Limit)

**Tap Interaction:**
```
1. Haptic: Light impact on touch down
2. Visual: Scale to 0.95x (50ms ease-out)
3. Release: Spring back to 1.0x (damping: 0.8, stiffness: 300)
4. Transition: Modal slides up with spring animation
5. Sound: Subtle "pop" (optional, respect system settings)
```

**Animation Details:**
- **Press:** `transform: scale(0.95)` with `easeOut` timing
- **Release:** Spring animation (`react-native-reanimated`)
- **Duration:** 50ms press, 300ms release
- **Modal Entry:** Sheet modal from bottom, overdamped spring

**Hover State (iPad/Desktop):**
- Elevation: +2dp shadow
- Scale: 1.05x
- Duration: 200ms ease-in-out

### State 2: Free User (At Limit - Paywall Trigger)

**Critical Conversion Moment - Needs Special Treatment**

**Pre-Tap Signaling:**
```
Visual Badge: "2/3" or "3/3" counter
Color Tint: Subtle gold/amber gradient overlay
Animation: Gentle pulsing glow (2s cycle, 0.9x to 1.0x scale)
Icon: Consider adding "✨" sparkle overlay
```

**Tap Interaction:**
```
1. Haptic: Medium impact + "bounce back" pattern (3 quick taps)
2. Visual:
   - Button shakes subtly (2-3 cycles, ±2deg rotation)
   - "🔒" or "✨" icon flashes briefly (300ms)
   - Transitions to premium paywall modal
3. Modal: Dramatic spring animation FROM button location
4. Timing: 100ms shake, then 400ms modal transition
```

**Animation Sequence:**
```javascript
// Pseudo-code
onTap() {
  triggerHaptic('medium');
  animateShake(duration: 150ms, amplitude: 2deg, cycles: 2);
  showIcon('lock', duration: 200ms);
  delay(100ms);
  triggerHaptic('selection'); // Second confirmation
  animateModalFrom(buttonPosition, spring: {damping: 0.7});
}
```

**Messaging in Paywall:**
- "You're on fire! 🔥 Unlock unlimited habits to keep the momentum going"
- "You've maxed out your free habits - ready to level up?"
- Focus on achievement, not limitation

### State 3: Premium User

**Tap Interaction:**
```
1. Haptic: Success pattern (light impact + selection feedback)
2. Visual: Smooth, confident scale (0.95x → 1.0x, faster than free)
3. Transition: Modal appears instantly (200ms vs 300ms for free)
4. Feel: Premium = faster, smoother, more responsive
```

**Visual Differentiation (Optional):**
- Subtle "✨ Premium" badge
- Gold/gradient accent color
- Slightly different shadow/elevation

**Premium Benefits in Interaction:**
- 33% faster animations
- Richer haptics (success patterns vs basic impacts)
- More confident, less "soft" feel

---

## Touchpoint 1: Paywall Modal/Screen

**Trigger Moments:**
- User taps Plus button at 3-habit limit
- User taps locked Analytics tab
- User taps locked Premium feature
- Day 7 trigger (proactive upsell)

### Entry Animation

**From Habit Plus Button:**
```
- Modal originates FROM button position
- Expands with elastic spring (damping: 0.7)
- Background blur fades in (300ms ease-out)
- Content fades in sequentially (100ms stagger)
```

**From Locked Feature:**
```
- Modal slides up from bottom
- Feature preview blurs and scales down behind
- Haptic: Medium impact on appearance
- Duration: 400ms overdamped spring
```

### Content Micro-Interactions

**Subscription Cards:**
```
- Stagger entrance (100ms delay between cards)
- Hover/Press: Scale 0.98x with shadow increase
- Selected: Scale 1.02x, border glow animation
- Haptic on select: Selection feedback
```

**"Start Free Trial" Button:**
```
- Resting: Subtle gradient animation (3s cycle)
- Hover: Elevation increase, scale 1.02x
- Press: Scale 0.98x, haptic: heavy impact
- Success: Checkmark animation + confetti burst
- Haptic on success: Success pattern (3 taps)
```

**Feature List Items:**
```
- Animate in from left (50ms stagger)
- Checkmark icon: Draw animation (300ms)
- Premium features: Gold accent glow
- Tap to expand: Show more details with accordion
```

### Exit Animation

**Conversion Success:**
```
- Confetti animation (Lottie, 2s duration)
- Modal scales out with elastic spring
- Success haptic pattern
- Transition to unlocked feature
```

**Dismissal (No Conversion):**
```
- Modal slides down (300ms ease-in)
- Background blur fades out
- Gentle haptic: Light impact
- Remember: Don't punish dismissal
```

---

## Touchpoint 2: Habit Completion Check-off (Core Loop)

**Importance:** Happens daily, reinforces habit loop, premium upsell opportunity

### Free User Check-off

**Interaction:**
```
1. Tap: Immediate visual feedback (0ms delay)
2. Haptic: Medium impact
3. Visual:
   - Checkmark draws in (200ms ease-out)
   - Circle fill animation (300ms)
   - Subtle particle burst (8-10 particles)
4. Strength Update: Number counts up (400ms)
5. Micro-celebration: ±2 habit strength points = subtle glow
```

**Animation Sequence:**
```javascript
onHabitCheck() {
  // Instant feedback
  triggerHaptic('medium');
  animateCheckmark(duration: 200ms, easing: 'easeOut');

  // Circle fill
  animateCircleFill(duration: 300ms, color: habitColor);

  // Particle burst (subtle)
  emitParticles(count: 10, radius: 30px, duration: 400ms);

  // Strength counter
  animateCounter(from: oldStrength, to: newStrength, duration: 400ms);

  // Celebration threshold?
  if (crossedThreshold) {
    showMilestoneCelebration();
  }
}
```

**Premium Upsell Moment:**
```
Every 5th check-off (or daily):
- Show "Analytics Preview" mini-card (3s auto-dismiss)
- Content: "Your strength increased 5% this week! 📈"
- CTA: "See full analytics" → Paywall
- Haptic: Selection feedback on CTA tap
```

### Premium User Check-off

**Enhanced Interaction:**
```
1. Haptic: Success pattern (richer than free)
2. Visual:
   - Faster checkmark animation (150ms vs 200ms)
   - Richer particle burst (15-20 particles)
   - Gold sparkle accents
   - Strength prediction shows immediately
3. Analytics Preview: Real-time graph update preview
```

**Premium Differentiation:**
- 25% faster animations
- Richer particle effects
- Gold/premium color accents
- Immediate data insights (vs delayed for free)

---

## Touchpoint 3: Milestone Celebrations

**Trigger:** User crosses strength thresholds: 20%, 40%, 60%, 80%, 100%

### Celebration Sequence

**Entry Animation:**
```
1. Screen freezes briefly (50ms) - build anticipation
2. Haptic: Heavy impact
3. Confetti explosion (Lottie animation, 2s)
4. Achievement card slides up with spring
5. Background blurs and darkens (800ms)
```

**Achievement Card:**
```
Content:
- "🎉 Building Momentum!" (20%)
- "💪 Developing Strong!" (40%)
- "🔥 Habit Locked In!" (60%)
- "⚡ Almost Automatic!" (80%)
- "✨ Fully Automatic!" (100%)

Animation:
- Scale entrance: 0.8 → 1.0 with elastic spring
- Strength badge: Counter animation (1s)
- Share button: Pulses gently (attract attention)
- Haptic on card appearance: Success pattern
```

**Premium Upsell Opportunity:**
```
Free Users at 40%+ milestone:
- "🎉 You're 40% there! See your full progress graph"
- CTA: "Unlock Analytics" → Premium paywall
- Timing: After celebration, before dismissal
- Non-intrusive: Easily dismissible

Premium Users:
- Full analytics preview RIGHT in celebration card
- "Share your achievement" with rich preview card
- Immediate access to strength history graph
```

**Exit Animation:**
```
User Tap "Continue":
- Card scales down and fades (300ms)
- Confetti fades out
- Background unblurs
- Gentle haptic: Light impact
- Returns to habit list with smooth transition
```

---

## Touchpoint 4: Analytics Dashboard (Locked State)

**For Free Users - Preview Without Access**

### Locked State Design

**Visual Treatment:**
```
- Background blur (24px Gaussian blur)
- "Unlock Analytics" overlay card (center)
- Dimmed content behind (40% opacity)
- Subtle animation: Content scrolls slowly behind blur (parallax)
```

**Tap Interaction:**
```
1. User taps anywhere on locked analytics
2. Haptic: Medium impact
3. Animation:
   - Blur intensifies briefly (30px, 100ms)
   - Overlay card scales up (1.0 → 1.05x, 150ms)
   - CTA button pulses (gold glow)
4. Transition: Fade to paywall modal (300ms)
```

**"Unlock Analytics" Card:**
```
Content:
- Icon: 📊 or 📈
- Heading: "See Your Progress in Detail"
- Features:
  - "📈 Strength over time"
  - "🔥 Streak insights"
  - "🎯 Completion patterns"
- CTA: "Upgrade to Premium"

Animation:
- Card floats gently (2s cycle, ±5px vertical)
- Button has gradient animation (3s cycle)
- Haptic on button press: Heavy impact
```

### Unlocked State (Premium Users)

**Entry Animation:**
```
- Blur dissolves out (400ms ease-out)
- Charts animate in sequentially (100ms stagger)
- Data points draw in (line graph: 800ms)
- Bars grow from bottom (bar chart: 600ms)
- Haptic on unlock: Success pattern
```

---

## Touchpoint 5: Weekly Insights Notification

**Timing:** Sunday evening, habit review time (6:00 PM user's timezone)

### Notification Design

**Rich Notification Content:**
```
Title: "Your Weekly Habit Report 📊"
Body: "You gained +12% strength this week! 3 habits at risk tomorrow."
Image: Mini strength graph preview (generated image)
Actions:
- "View Insights" (primary)
- "Dismiss" (secondary)
```

**Tap Behavior:**

**Free Users:**
```
1. App opens to insights screen (300ms fade)
2. Haptic: Medium impact on open
3. Shows preview card with limited insights:
   - Top performing habit
   - Total completions
   - Overall strength trend
4. After 3 seconds: "Unlock full insights" CTA fades in
5. Tap CTA → Paywall modal
```

**Premium Users:**
```
1. App opens to full insights dashboard
2. Haptic: Success pattern
3. Insights appear with stagger animation (100ms)
4. Interactive: Tap habits to see details
5. "Share Report" button available
```

---

## Touchpoint 6: Habit Templates Library

**Entry:** User taps microscope icon (habit science/templates)

### Free User Experience

**Template Grid:**
```
Layout: 2-column grid
Free Templates: First 3-5 templates
Locked Templates: Blurred with lock icon overlay

Animation on Scroll:
- Templates fade in as they scroll into view (200ms)
- Stagger: 50ms between items
- Locked templates have subtle gold shimmer animation
```

**Locked Template Tap:**
```
1. Haptic: Medium impact + light "denied" pattern
2. Visual:
   - Template card shakes gently (2 cycles, ±1deg)
   - Lock icon pulses (200ms)
   - "Premium" badge glows
3. Transition: Modal slides up "Unlock All Templates"
4. Duration: 400ms total
```

**Free Template Tap:**
```
1. Haptic: Selection feedback
2. Visual:
   - Card scales slightly (1.02x, 100ms)
   - Detail sheet slides up (300ms spring)
3. Content:
   - Template details
   - Science explanation
   - "Use This Template" button
```

### Premium User Experience

**All Templates Unlocked:**
```
- No blur or locks
- Faster navigation (reduced animation times)
- "Recently Used" section at top
- Haptic: Success pattern when importing template
```

**Template Import Animation:**
```
1. Template card scales down (0.9x, 200ms)
2. Morphs into new habit card (400ms)
3. Appears in habit list with entrance animation
4. Confetti burst (subtle)
5. Haptic: Success pattern
```

---

## Touchpoint 7: Adaptive Reminder Notification (Premium Feature)

**For Free Users - Preview/Teaser**

**Notification (Limited for Free):**
```
Title: "Daily Reminder 🔔"
Body: "Time to complete your habits!"
Type: Generic, not personalized
Frequency: Once per day, fixed time
```

**Tap Behavior:**
```
Opens app to habit list
No special animation
Basic haptic: Light impact
```

### Premium Users - Full Intelligence

**Notification (Personalized):**
```
Title: "Don't Break Your Streak! 💪"
Body: "You have a 35% chance of completing 'Morning Run' today. Beat the odds!"
Type: Adaptive, prediction-based
Frequency: Only when habit at risk (<40% probability)
Time: User-configured optimal time
```

**Tap Behavior:**
```
1. App opens to specific habit detail (300ms)
2. Haptic: Medium impact
3. Prediction insight card appears (400ms spring)
4. "Complete Now" button pulses gently
5. Actionable: One-tap completion
```

**Insight Card Animation:**
```
- Slides up from bottom with spring
- Probability meter fills (1s animation)
- Risk indicator pulses (if <40%)
- Encouragement message fades in (200ms delay)
- Haptic on card appearance: Selection feedback
```

---

## Touchpoint 8: Strength History Graph (Premium)

**For Free Users - Teaser**

### Limited History View

**Visual:**
```
- Shows last 7 days only
- Fade to blur after day 3
- "Unlock full history" overlay at right edge
- Graph animates in from left (600ms)
```

**Tap on Locked Portion:**
```
1. Haptic: Medium impact + gentle denied pattern
2. Visual:
   - Blur pulsates (200ms)
   - Overlay card appears (300ms slide)
3. Content: "See your full strength journey"
4. CTA: "Upgrade to Premium"
```

### Premium Users - Full History

**Visual:**
```
- Shows full habit history (90+ days)
- Smooth scrolling with momentum
- Milestone markers on graph
- Zoomable with pinch gestures
```

**Entry Animation:**
```
1. Graph draws in from left to right (1s ease-out)
2. Data points appear with stagger (50ms)
3. Milestone badges pop in (100ms each, spring)
4. Legend fades in at bottom (300ms)
5. Haptic on completion: Selection feedback
```

**Interaction Micro-Moments:**
```
- Tap data point: Shows exact value (modal popup)
- Pinch zoom: Haptic feedback at zoom levels
- Scroll: Momentum scrolling with edge bounce
- Tap milestone: Shows celebration replay
```

---

## Implementation Notes

### Haptic Patterns

**Available Patterns (iOS):**
```javascript
// Basic Impacts
'light'      // Subtle, for small UI changes
'medium'     // Standard, for most interactions
'heavy'      // Strong, for important moments

// Notification Feedbacks
'success'    // Positive outcome
'warning'    // Caution
'error'      // Failed action

// Other
'selection'  // UI picker, selection changes
```

**Custom Patterns:**
```javascript
// "Bounce back" for denied actions
triggerHaptic('medium');
setTimeout(() => triggerHaptic('light'), 50);
setTimeout(() => triggerHaptic('light'), 100);

// Success celebration
triggerHaptic('success');
setTimeout(() => triggerHaptic('light'), 100);
setTimeout(() => triggerHaptic('light'), 200);
```

### Animation Libraries

**Recommended Stack:**
- `react-native-reanimated` v3.8.0 - 60fps animations
- `lottie-react-native` v6.7.0 - Confetti, complex animations
- `react-native-haptic-feedback` or Expo Haptics - Tactile feedback
- Spring presets: `{damping: 0.8, stiffness: 300}` for most interactions

### Performance Considerations

**60fps Target:**
- Use `useNativeDriver: true` for all animations
- Avoid animating `width`/`height` (use `transform` instead)
- Debounce rapid interactions (300ms threshold)
- Preload Lottie animations on app start

**Battery Considerations:**
- Limit particle effects to <20 particles
- Disable animations when battery saver enabled
- Respect `reduceMotion` accessibility setting

---

## A/B Testing Recommendations

**Experiments to Run:**

1. **Paywall Timing**
   - Test: Day 3 vs Day 7 vs at-limit trigger
   - Measure: Conversion rate, trial starts

2. **Celebration Intensity**
   - Test: Confetti vs subtle glow vs minimal
   - Measure: Engagement, check-off frequency

3. **Haptic Richness**
   - Test: Rich haptics vs minimal vs none
   - Measure: Perceived app quality, retention

4. **Premium Preview Blur**
   - Test: 24px blur vs 12px blur vs solid overlay
   - Measure: Curiosity clicks, conversion

---

## Accessibility Considerations

**Reduce Motion:**
```javascript
if (userPrefersReducedMotion) {
  // Disable spring animations
  // Replace with fade transitions
  // Reduce particle effects to zero
  // Instant state changes instead of animated
}
```

**Haptics:**
```javascript
if (!hapticsEnabled) {
  // All haptic calls become no-ops
  // Never require haptics for core functionality
}
```

**Screen Reader:**
```
- All animations have equivalent announcements
- "Loading analytics" instead of blur animation
- "Unlocked premium feature" announcement
```

---

## Next Steps

**Priority Implementation Order:**

1. ✅ **Habit Plus Button** - Highest frequency, conversion trigger
2. ✅ **Habit Check-off** - Core loop, daily engagement
3. ⏳ **Paywall Modal** - Direct monetization
4. ⏳ **Milestone Celebrations** - Retention + upsell
5. ⏳ **Analytics Locked State** - Feature preview
6. ⏳ **Template Library** - Discovery + upsell
7. ⏳ **Adaptive Reminders** - Premium value demo
8. ⏳ **Strength Graph** - Data visualization premium

**Design Handoff Requirements:**
- [ ] Animation timing specifications (done above)
- [ ] Haptic mapping (done above)
- [ ] Lottie animation files (need design)
- [ ] Sound effects (optional)
- [ ] A/B test variants defined

---

**Document Status:** Draft v1.0
**Last Updated:** 2025-11-01
**Next Review:** After initial implementation

**Questions or Changes:** Contact Sally (UX Expert)
