# Social Sharing Feature Audit

**Date:** 2026-02-16  
**Focus:** Drive organic growth through social sharing

## Current State ✅❌

### 1. Share Functionality Exists ✅
- **ShareCardGenerator** component is well-built and functional
- Located at: `src/components/ShareCardGenerator/`
- Uses `react-native-view-shot` for image generation
- Uses `expo-sharing` for native share sheet

### 2. Share Image Quality ✅
- Multiple platform formats supported:
  - Instagram Story (1080x1920, 9:16)
  - Instagram Feed (1080x1080, 1:1)
  - Twitter (1200x675, 16:9)
  - Facebook (1200x630, 1.91:1)
- High-quality PNG export (quality: 1)
- Beautiful gradient backgrounds (5 presets)
- Professional design with proper spacing

### 3. Branding ⚠️
- ✅ "Chain Day" text appears in footer
- ✅ "Research-backed (Lally et al. 2010)" badge
- ✅ User name option
- ❌ **Missing:** Chain Day logo/icon visual
- ❌ **Missing:** More prominent branding

### 4. Share Triggering Points ⚠️
- ✅ Streak milestone celebrations (via StreakMilestoneCelebration)
- ✅ Share button appears in celebration modal
- ✅ TodaysFocusCard has share button when celebrating
- ❌ **Missing:** Profile/stats screen share button
- ❌ **Missing:** Weekly summary share prompt
- ❌ **Missing:** Achievement screen share buttons
- ❌ **Missing:** Proactive prompts after specific milestones (7, 30, 100 days)

### 5. Platform Captions ✅
- Customized for each platform
- Include hashtags (Instagram, Twitter)
- Include app store link
- Professional messaging

### 6. Invite Functionality ❌
- ❌ No "invite a friend" feature
- ❌ No referral system
- ❌ No easy way to share app link without achievement

### 7. Customization ✅
- ✅ Personal message (100 char max)
- ✅ Toggle user name visibility
- ✅ 5 gradient background options
- ✅ Platform selection

### 8. User Experience ⚠️
- ✅ Smooth animations
- ✅ Live preview
- ✅ Haptic feedback
- ❌ Could be more discoverable
- ❌ No "share reminder" after multiple milestones

## Recommended Improvements

### High Priority 🔴
1. **Add Chain Day logo to share cards** - Critical for brand recognition
2. **Add share button to CharacterScreen** - Profile/stats are shareable moments
3. **Create invite feature** - Separate from achievements, always available
4. **Add proactive share prompts** - After 7, 30, 100-day milestones

### Medium Priority 🟡
5. **Weekly summary share cards** - New content type for consistent sharing
6. **Achievement screen share buttons** - Each achievement should be shareable
7. **Share reminders** - Gentle nudge after 2-3 milestones without sharing

### Low Priority 🟢
8. **Share analytics** - Track which milestones get shared most
9. **Social preview optimization** - Test on actual platforms
10. **More gradient presets** - Seasonal or themed options

## Implementation Plan

### Phase 1: Branding & Profile Sharing
- Add logo to ShareCard footer
- Add share button to CharacterCard
- Create profile stats share card variant

### Phase 2: Invite Feature
- Create InviteScreen component
- Design invite card (app-focused, not achievement)
- Add "Invite Friends" to settings/menu

### Phase 3: Smart Prompts
- Add milestone-specific share prompts
- Implement share tracking (localStorage)
- Create gentle reminder system

### Phase 4: New Content Types
- Weekly summary share cards
- Achievement unlock cards
- Custom message cards

## Technical Notes

- Logo asset available: `assets/icon.png`, `assets/source/icon.svg`
- Share functionality well-abstracted in useShareCard hook
- StreakMilestoneProvider already handles celebration → share flow
- Consider adding share tracking to avoid over-prompting
