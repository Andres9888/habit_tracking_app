# AI Frontend Prompts: Gamification & Monetization

## Overview

This folder contains comprehensive prompts for generating React Native components using AI tools like **Vercel v0**, **Lovable.ai**, **Cursor AI**, or **GitHub Copilot**.

Each prompt is self-contained and production-ready, with:
- Complete TypeScript interfaces
- Animation specifications with React Native Reanimated
- Design system colors and tokens
- Accessibility requirements
- Usage examples

---

## 📋 Prompt Files

### 1. Currency Components (`01-currency-components-prompt.md`)

**What it builds:**
- `CoinCounter` - Displays and animates coin balance
- `StreakSaveIndicator` - Shows remaining streak saves (hearts)
- `XPProgressBar` - Character XP progress with level display

**When to use:**
- Building the top bar of the home screen
- Adding gamification overlay to existing UI
- Implementing basic progression system

**Key features:**
- Odometer-style number animations
- Pulse effects for low resources
- Gradient progress bars
- Haptic feedback integration

**Complexity:** ⭐⭐☆☆☆ (Easy)

---

### 2. Celebration Modals (`02-celebration-modals-prompt.md`)

**What it builds:**
- `MilestoneCelebrationModal` - 7/30/100-day streak celebrations
- `LevelUpModal` - Character level-up sequences
- `StreakSaveDecisionModal` - Gentle failure state handling
- `FloatingXPText` - "+10 XP" floating animations

**When to use:**
- Creating rewarding milestone moments
- Implementing level-up sequences
- Building supportive failure states

**Key features:**
- Multi-phase animation choreography (2-3 second sequences)
- Confetti effects with react-native-confetti-cannon
- Haptic patterns (single impacts, success patterns, custom 3x pulses)
- Particle effects and badge animations

**Complexity:** ⭐⭐⭐⭐☆ (Hard)

---

### 3. Character & Shop Screens (`03-character-shop-screens-prompt.md`)

**What it builds:**
- `CharacterScreen` - Full RPG-style character progression screen
  - Character card with avatar, level, XP
  - 4 Attribute cards (Vitality, Strength, Wisdom, Energy)
  - Stats row (day streak, total power, active habits)
  - Recent achievements feed
- `ShopScreen` - Power-up marketplace
  - Power-up cards (Streak Freeze, Extra Reminder, etc.)
  - Locked premium items with shimmer effect
  - Purchase confirmation modal
  - Coin balance display

**When to use:**
- Building full navigable screens
- Implementing character progression system
- Creating in-app currency marketplace

**Key features:**
- Gradient progress bars and backgrounds
- Shimmer effects for locked items
- Staggered entry animations
- Icon + gradient combinations from Lucide

**Complexity:** ⭐⭐⭐☆☆ (Medium)

---

### 4. Premium Upgrade Flow (`04-premium-upgrade-flow-prompt.md`)

**What it builds:**
- `PremiumUpgradeScreen` - Complete subscription flow
  - Hero section with value proposition
  - Feature comparison table (Free vs Premium)
  - Pricing cards (Monthly, Annual with "BEST VALUE")
  - Social proof & testimonials
  - Sticky CTA bar
- `PremiumBadge` - Post-purchase badge indicator
- Subscription management sheet

**When to use:**
- Implementing monetization/conversion flow
- Building pricing pages
- Creating trial CTAs
- Integrating in-app purchases (iOS)

**Key features:**
- iOS In-App Purchase integration
- A/B testing variations documented
- Analytics event tracking
- 7-day free trial handling
- Success celebration sequence

**Complexity:** ⭐⭐⭐⭐⭐ (Advanced)

---

## 🚀 How to Use These Prompts

### Option 1: Vercel v0 / Lovable.ai

1. **Copy the entire prompt** from one of the markdown files
2. **Paste into v0/Lovable** chat interface
3. **Review generated code** and iterate with follow-up prompts:
   - "Make the animation faster"
   - "Change the color scheme to match my brand"
   - "Add a loading state"
4. **Export code** to your React Native project

**Pro Tips:**
- Start with simpler components (Currency) before complex ones (Modals)
- Specify your existing tech stack in follow-up prompts
- Ask for explanations of complex animation logic

---

### Option 2: Cursor AI / GitHub Copilot

1. **Open the component file** you want to create (e.g., `CoinCounter.tsx`)
2. **Paste the prompt** as a comment at the top of the file
3. **Let AI generate** the component implementation
4. **Iterate inline** with code comments:
   ```typescript
   // Change spring animation to be more bouncy
   // Add error handling for invalid balance values
   ```

**Pro Tips:**
- Keep the prompt in the file as documentation
- Use AI to generate tests based on the same prompt
- Ask AI to refactor existing code to match the spec

---

### Option 3: Manual Implementation

1. **Read the prompt** to understand requirements
2. **Use TypeScript interfaces** as your component contract
3. **Implement animations** following the timing specifications
4. **Reference color tokens** and design system values
5. **Test accessibility** using screen reader simulation

---

## 📦 Recommended Build Order

For fastest time-to-value, build components in this order:

### Phase 1: Foundation (Week 1)
1. **Currency Components** (Prompt 01)
   - Adds visible gamification to existing UI
   - Low risk, high visibility
   - ~2-3 hours implementation

### Phase 2: Progression (Week 2)
2. **Character Screen** (Prompt 03, Part 1)
   - Full screen with all attributes
   - Leverage existing CharacterScreen.tsx
   - ~4-6 hours implementation

3. **Celebration Modals** (Prompt 02, Milestones only)
   - Start with 7-day milestone
   - Skip level-up initially
   - ~6-8 hours implementation

### Phase 3: Economy (Week 3)
4. **Shop Screen** (Prompt 03, Part 2)
   - Power-up cards
   - Purchase flow
   - ~4-6 hours implementation

5. **Celebration Modals** (Prompt 02, Level-Up)
   - Complete remaining celebrations
   - ~3-4 hours implementation

### Phase 4: Monetization (Week 4)
6. **Premium Upgrade Flow** (Prompt 04)
   - Full subscription implementation
   - In-app purchase integration
   - ~8-12 hours implementation (includes testing)

**Total Estimated Time:** 27-39 hours (3-4 weeks part-time)

---

## 🎨 Design System Reference

All prompts use a consistent design system:

### Colors
```typescript
export const COLORS = {
  // Currency
  coin: '#F59E0B',        // Amber 500
  heart: '#EF4444',       // Red 500
  premium: '#FFD700',     // Gold

  // Attributes
  vitality: ['#FB2C36', '#F6339A'],   // Red → Pink
  strength: ['#FF6900', '#FE9A00'],   // Orange → Amber
  wisdom: ['#AD46FF', '#615FFF'],     // Purple → Indigo
  energy: ['#F0B100', '#FF6900'],     // Yellow → Orange

  // XP
  xpGradient: ['#AD46FF', '#F6339A'], // Purple → Pink

  // Leagues
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#FFD700',
  diamond: '#B9F2FF',

  // States
  success: '#10B981',     // Green 500
  warning: '#F59E0B',     // Amber 500
  error: '#EF4444',       // Red 500
  info: '#3B82F6',        // Blue 500
};
```

### Animation Timings
```typescript
export const DURATIONS = {
  instant: 100,
  fast: 300,
  normal: 800,
  celebration: 2000,
};

export const SPRING_CONFIG = {
  gentle: { damping: 20, stiffness: 100 },
  default: { damping: 15, stiffness: 150 },
  bouncy: { damping: 10, stiffness: 200 },
};
```

### Typography
- System font (SF Pro / Roboto)
- Tabular nums for counters
- Scale: 12px (captions) → 36px (hero numbers)

---

## 🧪 Testing Checklist

After implementing components, verify:

### Functionality
- [ ] All animations run smoothly (60 FPS)
- [ ] Haptic feedback triggers correctly
- [ ] State changes update UI instantly
- [ ] Error states handled gracefully
- [ ] Loading states shown during async operations

### Accessibility
- [ ] Screen reader announces all state changes
- [ ] Touch targets ≥ 44x44px
- [ ] Color contrast ≥ 4.5:1
- [ ] Reduced motion alternative works
- [ ] All interactive elements have labels

### Performance
- [ ] Animations use `useNativeDriver: true`
- [ ] No memory leaks in cleanup
- [ ] Debounced rapid interactions
- [ ] Efficient re-renders (React.memo where needed)

### Edge Cases
- [ ] Handles extreme values (0 coins, 999+ level)
- [ ] Works on small screens (<375px)
- [ ] Works on tablets (>600px)
- [ ] Handles interrupted animations
- [ ] Network errors don't break UI

---

## 🔧 Troubleshooting

### "Animations are janky"
- ✅ Enable `useNativeDriver: true`
- ✅ Reduce particle count in confetti
- ✅ Use `react-native-reanimated` (not Animated API)
- ✅ Profile with React DevTools

### "Colors don't match design"
- ✅ Double-check hex codes from prompts
- ✅ Verify gradient direction (LTR vs TTB)
- ✅ Check opacity values (% vs 0-1 scale)

### "In-app purchases not working"
- ✅ Test on real device (not simulator)
- ✅ Verify product IDs in App Store Connect
- ✅ Check sandbox test account
- ✅ Enable In-App Purchases capability in Xcode

### "Haptics not triggering"
- ✅ Test on physical device (not simulator)
- ✅ Check device silent mode switch
- ✅ Verify expo-haptics installation
- ✅ Use `runOnJS()` wrapper in Reanimated worklets

---

## 📚 Related Documentation

- **Full UX Spec**: `../ux-gamification-monetization-spec.md`
- **Animation Details**: UX Spec Section 8 (Interaction & Motion)
- **User Flows**: UX Spec Section 3 (Mermaid diagrams)
- **Component Specs**: UX Spec Section 4 (TypeScript interfaces)

---

## 🤝 Contributing

Found an issue or want to improve a prompt?

1. Test the prompt with your AI tool
2. Document what works/doesn't work
3. Submit improvements via pull request
4. Include before/after examples

---

## 📝 License

These prompts are part of the Habit Tracking App UX documentation.
Use freely for your own projects. Attribution appreciated but not required.

---

**Generated:** 2025-11-01
**Version:** 1.0.0
**Author:** Jane (UX Expert Agent)

For questions or support, see the main project README.
