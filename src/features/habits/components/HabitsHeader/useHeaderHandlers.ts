import type { SharedValue } from 'react-native-reanimated';
import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';
import { usePrefetchNavigation } from '../../../../hooks/usePrefetchNavigation';
import { createButtonHandlers } from './useButtonHandler';

interface UseHeaderHandlersProps {
  addButtonScale: SharedValue<number>;
  sortButtonScale: SharedValue<number>;
  templatesButtonScale: SharedValue<number>;
  settingsButtonScale: SharedValue<number>;
  openCreateHabitScreen: () => void;
  openSortSheet: () => void;
  openTemplatesScreen: () => void;
  openSettings: () => void;
  dismissBadge: () => void;
}

/**
 * Hook that creates press handlers for all header buttons.
 * Uses the reusable createButtonHandlers factory.
 * 
 * Includes prefetch on onPressIn for navigation targets to improve
 * perceived performance by starting data fetching early.
 */
export function useHeaderHandlers({
  addButtonScale,
  sortButtonScale,
  templatesButtonScale,
  settingsButtonScale,
  openCreateHabitScreen,
  openSortSheet,
  openTemplatesScreen,
  openSettings,
  dismissBadge,
}: UseHeaderHandlersProps) {
  const { triggerLightImpact, triggerSelection } = useHapticFeedback({});
  const { prefetchTemplatesAndCategories, prefetchSettings } =
    usePrefetchNavigation();

  const add = createButtonHandlers(
    {
      onPress: openCreateHabitScreen,
      pressInScale: 0.95,
      scale: addButtonScale,
    },
    triggerLightImpact,
    triggerSelection
  );
  const sort = createButtonHandlers(
    { onPress: openSortSheet, scale: sortButtonScale },
    triggerLightImpact,
    triggerSelection
  );
  const templates = createButtonHandlers(
    {
      onPress: () => {
        dismissBadge();
        openTemplatesScreen();
      },
      scale: templatesButtonScale,
      // Prefetch templates when user starts pressing the button
      onPressIn: prefetchTemplatesAndCategories,
    },
    triggerLightImpact,
    triggerSelection
  );
  const settings = createButtonHandlers(
    {
      onPress: openSettings,
      scale: settingsButtonScale,
      // Prefetch settings when user starts pressing the button
      onPressIn: prefetchSettings,
    },
    triggerLightImpact,
    triggerSelection
  );

  return {
    handleAddHabitPress: add.handlePress,
    handleAddHabitPressIn: add.handlePressIn,
    handleAddHabitPressOut: add.handlePressOut,
    handleSettingsPress: settings.handlePress,
    handleSettingsPressIn: settings.handlePressIn,
    handleSettingsPressOut: settings.handlePressOut,
    handleSortPress: sort.handlePress,
    handleSortPressIn: sort.handlePressIn,
    handleSortPressOut: sort.handlePressOut,
    handleTemplatesPress: templates.handlePress,
    handleTemplatesPressIn: templates.handlePressIn,
    handleTemplatesPressOut: templates.handlePressOut,
  };
}
