# Wizard Integration Guide - Step-by-Step

## 🎯 Goal
Replace the current habit creation modal with a streamlined 3-step wizard to reduce decision fatigue and improve completion rates.

---

## 📋 Prerequisites

- ✅ Files already created:
  - `src/components/CreateHabitModal/components/CreateHabitWizard.tsx`
  - `src/components/CreateHabitModal/CreateHabitModalSimple.tsx`
- ✅ No breaking changes to existing code
- ✅ All dependencies already installed

---

## 🚀 Quick Integration (5 Minutes)

### Option 1: Direct Replacement

**Step 1:** Backup the original modal
```bash
cd src/components/CreateHabitModal
cp CreateHabitModal.tsx CreateHabitModalOriginal.tsx
```

**Step 2:** Replace with wizard version
```bash
cp CreateHabitModalSimple.tsx CreateHabitModal.tsx
```

**Step 3:** Test the app
```bash
npm start
# or
npm run ios
# or
npm run android
```

**Done!** The wizard is now active. Test by:
1. Tap the FAB (+ button)
2. Create a habit through the 3-step flow
3. Verify it saves correctly

---

### Option 2: Feature Flag (Recommended for A/B Testing)

**Step 1:** Create feature flags file
```bash
touch src/lib/featureFlags.ts
```

**Step 2:** Add flag configuration
```typescript
// src/lib/featureFlags.ts
export const FEATURE_FLAGS = {
  USE_WIZARD_FLOW: true, // Toggle this to switch flows
} as const;

export type FeatureFlagKey = keyof typeof FEATURE_FLAGS;
```

**Step 3:** Find where CreateHabitModal is used

Search for modal usage:
```bash
grep -r "CreateHabitModal" src/
```

Likely locations:
- `src/features/habits/hooks/useHabitsApp.tsx`
- `src/features/habits/components/HabitsModals.tsx`
- Or wherever modals are rendered

**Step 4:** Update modal import
```typescript
// Before
import CreateHabitModal from '../../components/CreateHabitModal';

// After
import CreateHabitModalOriginal from '../../components/CreateHabitModal/CreateHabitModal';
import CreateHabitModalSimple from '../../components/CreateHabitModal/CreateHabitModalSimple';
import { FEATURE_FLAGS } from '../../lib/featureFlags';

// Conditional selection
const CreateHabitModal = FEATURE_FLAGS.USE_WIZARD_FLOW
  ? CreateHabitModalSimple
  : CreateHabitModalOriginal;
```

**Step 5:** Use the selected modal
```typescript
// Usage stays the same
<CreateHabitModal
  visible={isCreateModalVisible}
  onClose={closeCreateModal}
/>
```

**Step 6:** Test both flows
```typescript
// Test wizard flow
FEATURE_FLAGS.USE_WIZARD_FLOW = true;
npm start

// Test original flow
FEATURE_FLAGS.USE_WIZARD_FLOW = false;
npm start
```

---

## 🧪 Testing Checklist

### Manual Testing

#### Wizard Flow (CreateHabitModalSimple)
- [ ] **Step 1: Name**
  - [ ] Input field auto-focuses
  - [ ] "Continue" button disabled until 2+ characters
  - [ ] Suggestions appear (Read, Meditate, Exercise, Drink water)
  - [ ] Tapping suggestion fills input
  - [ ] Character counter shows (0/50)
  - [ ] "Continue" button enabled when valid

- [ ] **Step 2: When**
  - [ ] Back button appears
  - [ ] Progress bar shows 66%
  - [ ] Three time buttons visible (Morning, Afternoon, Evening)
  - [ ] Selecting time shows "✓ Reminder set" message
  - [ ] Default time is "Afternoon"
  - [ ] "Continue" button always enabled

- [ ] **Step 3: Customize**
  - [ ] Back button appears
  - [ ] Progress bar shows 100%
  - [ ] Emoji picker visible
  - [ ] Color picker visible
  - [ ] "Create Habit" button visible
  - [ ] "Skip and create" link visible
  - [ ] Tapping "Skip" creates habit immediately
  - [ ] Tapping "Create" creates habit with selections

#### General
- [ ] Swipe-to-dismiss gesture works
- [ ] Modal closes after habit created
- [ ] Habit appears in habit list
- [ ] Reminder is auto-enabled
- [ ] Default frequency is daily (all days)
- [ ] Can edit habit to change advanced settings

#### Edge Cases
- [ ] Creating habit with minimum name (2 chars)
- [ ] Creating habit with maximum name (50 chars)
- [ ] Going back from Step 3 → Step 2 → Step 1
- [ ] Changing name after proceeding to Step 2
- [ ] Changing time after proceeding to Step 3
- [ ] Skipping customization (Step 3)

---

### Automated Testing (Optional)

Create test file:
```typescript
// src/components/CreateHabitModal/__tests__/CreateHabitWizard.test.tsx

import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { CreateHabitWizard } from '../components/CreateHabitWizard';

describe('CreateHabitWizard', () => {
  it('should start on Step 1 (name)', () => {
    const { getByPlaceholderText } = render(
      <CreateHabitWizard
        habitName=""
        onHabitNameChange={jest.fn()}
        // ... other props
      />
    );

    expect(getByPlaceholderText('e.g., Read for 20 minutes')).toBeTruthy();
  });

  it('should disable Continue if name < 2 chars', () => {
    const { getByText } = render(
      <CreateHabitWizard
        habitName="A"
        // ... other props
      />
    );

    const continueButton = getByText('Continue');
    expect(continueButton).toBeDisabled();
  });

  it('should advance to Step 2 on Continue', async () => {
    const { getByText } = render(
      <CreateHabitWizard
        habitName="Read"
        // ... other props
      />
    );

    fireEvent.press(getByText('Continue'));

    await waitFor(() => {
      expect(getByText('When will you do this?')).toBeTruthy();
    });
  });

  // ... more tests
});
```

Run tests:
```bash
npm test -- CreateHabitWizard
```

---

## 📊 Analytics Integration (Recommended)

Track user behavior to measure impact:

```typescript
// src/lib/analytics.ts (or wherever analytics is configured)

export const trackHabitCreationStep = (step: 1 | 2 | 3) => {
  // Example: Mixpanel, PostHog, or custom analytics
  analytics.track('Habit Creation Step Viewed', {
    step,
    step_name: step === 1 ? 'Name' : step === 2 ? 'When' : 'Customize',
  });
};

export const trackHabitCreationAbandoned = (step: 1 | 2 | 3) => {
  analytics.track('Habit Creation Abandoned', {
    last_step: step,
  });
};

export const trackHabitCreationCompleted = (
  time_to_complete: number,
  customized: boolean
) => {
  analytics.track('Habit Created', {
    time_to_complete,
    customized,
    flow_type: 'wizard', // vs 'original'
  });
};
```

**Integrate into wizard:**
```typescript
// In CreateHabitWizard.tsx

import { trackHabitCreationStep, trackHabitCreationAbandoned } from '../../../lib/analytics';

const handleNext = useCallback(() => {
  if (currentStep === 'name') {
    trackHabitCreationStep(2);
    setCurrentStep('when');
  } else if (currentStep === 'when') {
    trackHabitCreationStep(3);
    setCurrentStep('customize');
  }
}, [currentStep]);

// On modal close without completion
useEffect(() => {
  return () => {
    if (!habitCreated) {
      const step = currentStep === 'name' ? 1 : currentStep === 'when' ? 2 : 3;
      trackHabitCreationAbandoned(step);
    }
  };
}, []);
```

---

## 🔍 Debugging Tips

### Issue: Modal doesn't open
**Solution:** Check that import path is correct
```typescript
// Verify import
import CreateHabitModal from './components/CreateHabitModal/CreateHabitModalSimple';

// Verify modal props
<CreateHabitModal
  visible={true} // Should be true to show
  onClose={() => setVisible(false)}
/>
```

### Issue: Swipe-to-dismiss doesn't work
**Solution:** Ensure GestureHandler is configured
```typescript
// App.tsx should have GestureHandlerRootView
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Rest of app */}
    </GestureHandlerRootView>
  );
}
```

### Issue: Reminder not being set
**Solution:** Check notification permissions
```bash
# iOS: Check Info.plist has NSUserNotificationsUsageDescription
# Android: Check AndroidManifest.xml has permissions
```

### Issue: Wizard not advancing past Step 1
**Solution:** Check habit name length validation
```typescript
// Should be >= 2 characters
console.log('Habit name:', habitName);
console.log('Length:', habitName.trim().length);
console.log('Can proceed:', habitName.trim().length >= 2);
```

---

## 🎨 Customization Options

### Change Default Time
```typescript
// In CreateHabitWizard.tsx or CreateHabitModalSimple.tsx

// Before
const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('afternoon');

// After (default to morning)
const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');
```

### Change Suggestions
```typescript
// In CreateHabitWizard.tsx, Step 1

// Before
{['Read for 20 minutes', 'Meditate', 'Exercise', 'Drink water'].map(...)}

// After
{['Your', 'Custom', 'Suggestions', 'Here'].map(...)}
```

### Add Template Integration
```typescript
// In CreateHabitWizard.tsx, Step 1

// Add below suggestions section
<TouchableOpacity onPress={onBrowseTemplates}>
  <Text>Browse Templates</Text>
</TouchableOpacity>
```

### Change Progress Bar Color
```typescript
// In CreateHabitWizard.tsx, Progress Bar

// Before
<View className="h-full bg-emerald-500" />

// After
<View className="h-full bg-blue-500" /> // Or any color
```

---

## 🔄 Rollback Plan

If issues arise, rollback is simple:

### If using Direct Replacement:
```bash
cd src/components/CreateHabitModal
cp CreateHabitModalOriginal.tsx CreateHabitModal.tsx
```

### If using Feature Flag:
```typescript
// src/lib/featureFlags.ts
export const FEATURE_FLAGS = {
  USE_WIZARD_FLOW: false, // Switch back to original
};
```

Then rebuild:
```bash
npm start
```

---

## 📈 Success Metrics

### Week 1: Initial Rollout
- [ ] Modal opens without errors
- [ ] Users can create habits
- [ ] No increase in crash reports
- [ ] Completion rate ≥ 60% (baseline)

### Week 2-4: Optimization
- [ ] Completion rate ≥ 70%
- [ ] Average time-to-create ≤ 75 seconds
- [ ] Abandonment rate ≤ 30%
- [ ] User feedback positive (≥ 4/5 rating)

### Month 2+: Success
- [ ] Completion rate ≥ 80%
- [ ] Average time-to-create ≤ 60 seconds
- [ ] Abandonment rate ≤ 20%
- [ ] Edit rate stable (users not fixing mistakes)

---

## 🎓 User Education (Optional)

If you want to explain the new flow to existing users:

**Option 1: One-time tooltip**
```typescript
// Show on first modal open after update
<Tooltip text="New! Create habits in 3 easy steps">
  <FAB onPress={openCreateModal} />
</Tooltip>
```

**Option 2: What's New modal**
```typescript
// Show once after app update
<WhatsNewModal>
  <Text>✨ Faster Habit Creation</Text>
  <Text>We've simplified creating habits into 3 quick steps!</Text>
</WhatsNewModal>
```

**Option 3: In-app announcement**
```typescript
// Banner at top of habit list
<Banner dismissible>
  Creating habits is now easier! Try our new step-by-step flow.
</Banner>
```

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module 'CreateHabitWizard'"
**Solution:**
```bash
# Verify file exists
ls src/components/CreateHabitModal/components/CreateHabitWizard.tsx

# Clear Metro bundler cache
npm start -- --reset-cache
```

### Issue: TypeScript errors about TimeOfDay type
**Solution:**
```typescript
// Ensure TimeOfDaySelector exports type
export type TimeOfDay = 'morning' | 'afternoon' | 'evening';
```

### Issue: Modal background tap doesn't close wizard
**Solution:** Add onRequestClose handler
```typescript
<Modal
  transparent
  visible={visible}
  onRequestClose={onClose} // Add this
>
```

### Issue: Progress bar not animating
**Solution:** Use Animated.View
```typescript
// Instead of static width
<Animated.View
  style={{
    width: withSpring(`${progress}%`),
  }}
  className="h-full bg-emerald-500"
/>
```

---

## 📞 Support

If you encounter issues:

1. Check console logs for errors
2. Verify all files are in correct locations
3. Clear Metro cache: `npm start -- --reset-cache`
4. Rebuild app: `npm run ios` or `npm run android`
5. Review comparison docs: `WIZARD_VS_ORIGINAL_COMPARISON.md`

---

## ✅ Final Checklist

Before deploying to production:

- [ ] Wizard flow tested on iOS
- [ ] Wizard flow tested on Android
- [ ] Accessibility tested (VoiceOver/TalkBack)
- [ ] Analytics tracking implemented
- [ ] Rollback plan tested
- [ ] User feedback collected (5+ users)
- [ ] Metrics improved vs baseline
- [ ] Code reviewed by team
- [ ] Documentation updated
- [ ] App Store screenshots updated (if needed)

---

**Estimated Integration Time:**
- Direct replacement: **5 minutes**
- Feature flag setup: **15 minutes**
- Testing: **30 minutes**
- Analytics integration: **20 minutes**
- **Total: ~1 hour**

Good luck! 🚀
