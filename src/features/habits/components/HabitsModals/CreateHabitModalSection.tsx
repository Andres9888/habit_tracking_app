import { lazy, Suspense } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import type { CreateHabitModalSectionProps } from './HabitsModals.types';

// Lazy load CreateHabitModal - 1.1MB component, only load when modal is opened
const CreateHabitModal = lazy(() => import('../../../../components/CreateHabitModal'));

function LoadingFallback() {
  const { colors: themeColors } = useThemeColors();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.67)' }}>
      <ActivityIndicator size="large" color={themeColors.primary[500]} />
    </View>
  );
}

/**
 * Create habit modal section - handles habit creation/editing
 * Performance: CreateHabitModal is lazy loaded to reduce initial bundle size (~1.1MB)
 */
export function CreateHabitModalSection({
  showCreateHabit,
  habitToEdit,
  closeCreateHabit,
}: CreateHabitModalSectionProps) {
  // Don't render anything if modal is not visible to avoid loading the component
  if (!showCreateHabit) {
    return null;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <CreateHabitModal
        habitToEdit={habitToEdit || undefined}
        visible={showCreateHabit}
        onClose={closeCreateHabit}
      />
    </Suspense>
  );
}
