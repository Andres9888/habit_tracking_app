# Hooks Readability Audit Analysis

## Hooks Over 100 Lines (Flag for Potential Splitting)

### Top-Level Hooks
- **useOfflineHabitMutations.ts** (300 lines) - ⚠️ CONSIDER SPLITTING into separate mutation hooks
- **useImageUpload.ts** (191 lines) - ⚠️ Could extract resize logic
- **usePressAnimation.ts** (154 lines) - ⚠️ Consider splitting haptic logic

### useAudioPlayback/
- **usePlaybackStatusHandler.ts** (138 lines) - ⚠️ Complex status handling, consider splitting
- **useLoadAudio.ts** (130 lines) - OK - focused responsibility
- **useSeekControls.ts** (122 lines) - OK - multiple seek methods justified
- **usePlaybackHooks.ts** (104 lines) - OK - orchestrator hook

### useAudioRecording/
- **useRecordingStatusHandler.ts** (123 lines) - ⚠️ Mirror of playback, similar complexity
- **useRecordingHooks.ts** (109 lines) - OK - orchestrator
- **useStopRecording.ts** (107 lines) - OK - cleanup logic is complex

### useDraftStorage/
- **storage.ts** (114 lines) - ⚠️ Consider splitting storage operations

### useImagePicker/
- **useImagePicker.ts** (105 lines) - OK - orchestrator

### useOfflineQueue/
- **types.ts** (111 lines) - OK - type definitions
- **useQueueOperations.ts** (105 lines) - OK - focused on queue ops

### usePremium/
- **usePremiumData.ts** (126 lines) - ⚠️ Consider splitting data fetching logic
- **usePremiumActions.ts** (116 lines) - ⚠️ Consider splitting purchase flow

### useRescueTrigger/
- **useRescueTrigger.ts** (105 lines) - OK - complex orchestration justified

### useStreakReminders/
- **useStreakReminderSettings.ts** (125 lines) - ⚠️ Settings management could be split

## Documentation Status

### Well-Documented Hooks ✅
- useHabitStrength.ts - Excellent JSDoc with examples
- useLetterNotification.ts - Complete JSDoc
- useCompletionSound.ts - Good documentation
- useNotificationResponse.ts - Well documented
- usePressAnimation.ts - Excellent JSDoc
- useImageUpload.ts - Comprehensive JSDoc
- All performance/ hooks - Well documented

### Needs Documentation Improvements
- Several utility files lack JSDoc (constants.ts, types.ts files)
- Some internal hooks in subdirectories need better examples

## Recommendations

1. **Split Large Hooks**:
   - useOfflineHabitMutations.ts → Split into createHabit, updateHabit, etc.
   - usePremiumData.ts → Extract data fetching logic
   - usePremiumActions.ts → Split purchase/restore flows

2. **Add Documentation**:
   - All type files should have JSDoc explaining the types
   - Constants files should document why specific values were chosen

3. **Inline Comments**:
   - Complex algorithms (e.g., strength calculation) need more inline comments
   - State management patterns should be explained
