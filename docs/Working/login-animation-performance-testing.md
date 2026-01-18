---
type: reference
title: Login Animation Performance Testing Guide
created: 2026-01-14
tags:
  - testing
  - performance
  - animations
  - login-redesign
related:
  - "[[LOGIN-REDESIGN-04]]"
  - "[[manual-qa-testing-guide]]"
---

# Login Animation Performance Testing Guide

## Overview

This guide provides instructions for manual performance testing of login screen animations on low-end devices, as specified in Task 4.4 of the Login Redesign Phase 4.

## Animations Under Test

### 1. AnimatedLogo (`AnimatedLogo.tsx`)
- **Breathing animation**: Scale 1.0 → 1.05 → 1.0 (1500ms, ease-in-out)
- **Floating animation**: TranslateY 0 → -6 → 0 (2000ms, ease-in-out)
- **Expected behavior**: Continuous, smooth, infinite loop

### 2. LoadingSpinner (`SocialSignInButton.tsx`)
- **Rotation animation**: 0° → 360° (1000ms, linear, infinite)
- **Triggered when**: Social sign-in button is pressed
- **Expected behavior**: Smooth rotation during loading state

### 3. SuccessOverlay (`SuccessOverlay.tsx` + `useSuccessOverlayAnimations.ts`)
- **Overlay fade**: Opacity 0 → 1 (300ms)
- **Ring expansion**: Scale 0 → 1.2 → 1.5 with fade (500ms total)
- **Checkmark bounce**: Scale 0 → 1 with spring (200ms delay)
- **Text slide-up**: TranslateY 20 → 0 with spring + fade (400ms delay)
- **Triggered when**: Sign-in succeeds
- **Expected behavior**: Sequential, choreographed entrance

## Test Devices

### iOS Simulator - iPhone SE (1st Gen)
- **Screen**: 4-inch, 640×1136
- **Performance tier**: Low-end reference device
- **Why**: Smallest supported screen, older hardware simulation

### Android Emulator - Low-End Profile
Create a custom AVD with these specifications:
- **Device**: Nexus 4 or Generic 4.7" WVGA
- **RAM**: 1.5 GB
- **CPU**: 2 cores
- **Graphics**: Software - GLES 2.0

## Setup Instructions

### iOS Simulator
```bash
# List available simulators
xcrun simctl list devices

# Boot iPhone SE (1st generation) if available
xcrun simctl boot "iPhone SE (1st generation)"

# Or use iPhone SE (3rd generation) for a slightly better but still small device
xcrun simctl boot "iPhone SE (3rd generation)"

# Start Expo with iOS
npm run expo:ios
```

### Android Emulator
```bash
# Create low-end AVD via Android Studio:
# 1. Open AVD Manager
# 2. Create Virtual Device → Select "Nexus 4" or similar
# 3. Select system image (API 28-30 recommended)
# 4. In Advanced Settings:
#    - RAM: 1536 MB
#    - VM Heap: 256 MB
#    - Enable GPU emulation: Software

# Or via command line:
avdmanager create avd -n LowEndTest -k "system-images;android-30;google_apis;x86" -d "Nexus 4"

# Start emulator
emulator -avd LowEndTest -gpu swiftshader_indirect

# Start Expo with Android
npm run expo:android
```

## Performance Testing Checklist

### Pre-Test Setup
- [ ] Close other resource-intensive applications
- [ ] Enable Performance Monitor (shake device → "Show Perf Monitor")
- [ ] For iOS: Enable "Debug GPU Overdraw" in Developer Settings (if available)
- [ ] For Android: Enable "Profile GPU Rendering" in Developer Options

### Test Scenarios

#### Scenario 1: Welcome Screen (AnimatedLogo)
1. Navigate to Welcome Screen (unauthenticated state)
2. Observe logo breathing/floating animation for 30+ seconds
3. **Pass criteria**:
   - [ ] Animation runs continuously without freezing
   - [ ] No visible frame drops (stuttering)
   - [ ] FPS stays at 60 (or 58+ with occasional dips)
   - [ ] Memory usage remains stable

#### Scenario 2: Social Sign-In Loading (LoadingSpinner)
1. Tap "Continue with Google" or "Continue with Apple"
2. Observe spinner rotation during loading state
3. **Pass criteria**:
   - [ ] Spinner rotates smoothly at constant speed
   - [ ] No elliptical distortion (indicates frame skip)
   - [ ] Responsive to touch (can still tap Cancel if available)

#### Scenario 3: Sign-In Success (SuccessOverlay)
1. Complete a successful sign-in flow
2. Observe the success overlay animation sequence
3. **Pass criteria**:
   - [ ] Overlay fades in smoothly
   - [ ] Ring expands without stuttering
   - [ ] Checkmark bounces naturally (spring physics)
   - [ ] Text slides up in sync with animations
   - [ ] Entire sequence completes in ~1.5s

#### Scenario 4: Form Interactions + Logo Animation
1. While on Sign In/Sign Up screen with logo animation
2. Type in email/password fields
3. **Pass criteria**:
   - [ ] Logo animation continues smoothly during text input
   - [ ] Keyboard appearance doesn't cause animation jank
   - [ ] Form validation doesn't interrupt animations

#### Scenario 5: Reduced Motion (Accessibility)
1. Enable "Reduce Motion" in device settings
   - iOS: Settings → Accessibility → Motion → Reduce Motion
   - Android: Settings → Accessibility → Remove animations
2. Return to auth screens
3. **Pass criteria**:
   - [ ] AnimatedLogo shows static (no breathing/floating)
   - [ ] App remains functional without animations
   - [ ] No errors in console

### Performance Metrics to Record

| Metric | Target | Observed (iOS SE) | Observed (Android Low) |
|--------|--------|-------------------|------------------------|
| Average FPS | ≥58 | | |
| JS Thread (ms) | <16 | | |
| UI Thread (ms) | <16 | | |
| Memory (MB) | Stable | | |
| Battery Impact | Low | | |

## Profiling Tools

### React Native Performance Monitor
- Shake device → "Show Perf Monitor"
- Shows JS and UI thread frame times
- Green = good (<16ms), Yellow = warning, Red = drop

### Flipper (Advanced)
```bash
# Install Flipper desktop app, then:
# 1. Connect device
# 2. Open React DevTools plugin
# 3. Use Performance tab to record

# For React Native specific metrics:
# - Install react-native-flipper
# - Use Performance plugin for flame graphs
```

### Android Systrace
```bash
# Record 5 seconds of animation
python $ANDROID_HOME/platform-tools/systrace/systrace.py \
  --time=5 \
  -o trace.html \
  gfx view res

# Open trace.html in Chrome
```

### iOS Instruments
1. Xcode → Product → Profile
2. Choose "Core Animation" template
3. Record while using auth screens
4. Look for dropped frames in timeline

## Troubleshooting Performance Issues

### If Animations Drop Below 60fps

**Check #1: JS Thread Blocking**
- Symptom: JS thread shows >16ms in Perf Monitor
- Solution: Ensure animations use Reanimated's UI thread (✓ already implemented)

**Check #2: Component Re-renders**
- Symptom: Animation stutters during state changes
- Solution: Use `React.memo()` on parent components, check for unnecessary re-renders

**Check #3: Overdraw**
- Symptom: Multiple overlapping views causing GPU strain
- Solution: Simplify view hierarchy, remove unnecessary wrapper Views

**Check #4: Shadow Computation**
- Symptom: iOS performance worse than Android
- Solution: Use `shouldRasterizeIOS` for static shadows, or simplify shadow values

### Device-Tier Detection (If Issues Found)
If animations cannot achieve 60fps on low-end devices, implement device-tier detection:

```typescript
// Example: Detect device tier and simplify animations
import { Platform, PixelRatio, Dimensions } from 'react-native';

function getDeviceTier(): 'low' | 'mid' | 'high' {
  const { width, height } = Dimensions.get('window');
  const pixelDensity = PixelRatio.get();
  const totalPixels = width * height * pixelDensity;

  if (totalPixels < 800000) return 'low';
  if (totalPixels < 2000000) return 'mid';
  return 'high';
}

// In AnimatedLogo:
const deviceTier = getDeviceTier();
const animationScale = deviceTier === 'low' ? 1.02 : 1.05; // Reduce scale movement
const animationDuration = deviceTier === 'low' ? 2000 : 1500; // Slow down for fewer frames
```

## Test Results Documentation

### Date: ___________
### Tester: ___________

**iOS Simulator (iPhone SE)**
- [ ] PASS / [ ] FAIL
- Notes: _________________________________

**Android Emulator (Low-End)**
- [ ] PASS / [ ] FAIL
- Notes: _________________________________

**Issues Found:**
1. ___________________________________
2. ___________________________________

**Recommended Actions:**
- [ ] No changes needed - animations perform well
- [ ] Simplify animations for low-end devices
- [ ] Add device-tier detection
- [ ] Other: ___________________________

---

## Architecture Notes

`★ Insight ─────────────────────────────────────`
**Why These Animations Should Perform Well:**

1. **React Native Reanimated 3.x** runs all animations on the UI thread via worklets, bypassing the JS bridge entirely. The `useAnimatedStyle` callback compiles to native code.

2. **Simple transform properties** (scale, translateY, rotate, opacity) are GPU-composited, not requiring layout recalculation. These are the "cheap" animations.

3. **No layout thrashing**: Animations don't modify `width`, `height`, `margin`, `padding`, or `flex` properties which would trigger expensive layout passes.

4. **Infinite loops use native drivers**: `withRepeat(-1, true)` creates a self-sustaining native animation that doesn't communicate back to JS.
`─────────────────────────────────────────────────`

## References

- [React Native Reanimated Performance](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary/#ui-thread)
- [Optimizing React Native Performance](https://reactnative.dev/docs/performance)
- [iOS Animation Best Practices](https://developer.apple.com/documentation/uikit/animation_and_haptics)
