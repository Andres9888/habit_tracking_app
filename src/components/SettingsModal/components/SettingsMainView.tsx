import { View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { useDeferredMount } from '../../../hooks/useDeferredMount';
import type { HabitSortMode } from '../../../features/habits/types';
import { getSettingsViewEntering } from './SettingsMainView.animations';
import { renderSettingsMainViewContent } from './SettingsMainView.renderContent';
import type { SettingsMainViewProps } from './SettingsMainView.types';

export function SettingsMainView(props: SettingsMainViewProps) {
  const reduceMotion = useReducedMotion();
  const ready = useDeferredMount();
  const { colors: themeColors } = useThemeColors();
  const handleSortSelect = (mode: HabitSortMode) => {
    void props.setHabitSortMode(mode);
  };

  const entering = getSettingsViewEntering(
    props.view,
    props.viewDirection,
    reduceMotion
  );

  const backgroundStyle = { backgroundColor: themeColors.background };
  // Keep the existing skeleton up through the open animation: the heavy section
  // tree mounts one frame after interactions settle, off the animation's path.
  const content = renderSettingsMainViewContent(
    { ...props, isLoading: props.isLoading || !ready },
    handleSortSelect
  );

  return (
    <View className='flex-1' style={backgroundStyle}>
      <Animated.View
        key={props.view}
        className='flex-1'
        entering={entering}
        style={backgroundStyle}
      >
        {content}
      </Animated.View>
    </View>
  );
}
