
import type { SharedValue } from 'react-native-reanimated';

import { createButtonHandlers } from './useButtonHandler';
import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';

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
    },
    triggerLightImpact,
    triggerSelection
  );
  const settings = createButtonHandlers(
    { onPress: openSettings, scale: settingsButtonScale },
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
