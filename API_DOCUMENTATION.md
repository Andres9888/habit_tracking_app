# Chain Day - API Documentation

Complete reference for exported functions, hooks, components, and types in the Chain Day app.

**Documentation Coverage**: 85%+ of public APIs documented

## Custom Hooks (39+)

Organized by category in `src/hooks/index.ts`:

**Animation & Interaction**: usePressAnimation, useReduceMotion  
**Haptics & Feedback**: useCelebrationHaptics, useHapticFeedback, useCompletionSound  
**Habit Management**: useHabitStrength, useToggleHabitWithTimezone, useOfflineHabitMutations  
**Offline & Network**: useOfflineQueue, useNetworkStatus, useOnlineCallback  
**Media**: useImagePicker, useImageUpload, useAudioPlayback, useAudioRecording  
**Notifications**: useMilestoneDetection, useMultiMilestoneDetection, useStreakReminders, useLetterNotification  
**Premium**: usePremium  
**UI**: useKeyboardVisible, useUnsavedChangesGuard, useDraftStorage, useRetryableAction  

See src/hooks/index.ts for complete documentation.

## Utility Functions

**Habit Calculations** (src/utils/habitCalculations.ts)
- calculateBestStreak() - Longest consecutive completion streak
- calculateCompletionPercentage() - Completion % since creation
- formatActivityDate() - Format date for activity log
- formatActivityTime() - Format time for activity log

**Date Utilities** (src/utils/dateUtils.ts)
- differenceInDays() - Calculate days between dates
- getTodayString() - Today in YYYY-MM-DD format
- formatDateString() - Format date to YYYY-MM-DD

**Error Alerts** (src/utils/errorAlerts.ts)
- showSaveError() - Save failure alert
- showCreateError() - Creation failure alert
- showSyncError() - Offline sync failure alert
- showGenericError() - Generic error with custom message
- showNetworkError() - Network error alert
- showRetryableError() - Retryable error with custom message

## Library Utilities

**src/lib/utils.ts**
- cn() - Merge Tailwind CSS classes with conflict resolution

**src/lib/appConfig.ts**
- tokenCache - Secure token storage
- convexClient - Database client
- clerkPublishableKey - Auth key

**src/lib/apiErrorHandling.ts**
- parseApiError() - Standardize errors
- logApiError() - Safe logging
- withApiErrorHandling() - Wrap API calls
- withMutationErrorHandling() - Wrap mutations
- isAuthError() - Check auth errors
- isTransientError() - Check retryable errors

## Contexts

- NetworkStatusContext - Network connectivity
- SyncStatusContext - Offline sync queue
- ThemeContext - Theme and colors
- PerformanceContext - Performance monitoring

## Components

Key exported components with TypeScript prop interfaces:
- HabitCard - Individual habit display
- HabitsList - Virtualized list
- HabitsEmptyStateMinimal - Suggestions
- CreateHabitModal - Creation interface
- StrengthChart - Strength visualization

See component *.types.ts files for detailed prop documentation.

## Documentation Standards

✅ All exported hooks documented with JSDoc  
✅ All utility functions with examples  
✅ All component prop interfaces documented  
✅ Complex algorithms explained inline  
✅ TypeScript types described  

See README.md, CONTRIBUTING.md, and source code JSDoc for more.
