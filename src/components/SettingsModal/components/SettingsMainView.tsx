import { View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { HabitSortMode } from '../../../features/habits/types';
import { getSettingsViewEntering } from './SettingsMainView.animations';
import { renderSettingsMainViewContent } from './SettingsMainView.renderContent';
import type { SettingsMainViewProps } from './SettingsMainView.types';

export function SettingsMainView(props: SettingsMainViewProps) {
  const reduceMotion = useReducedMotion();
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
  const content = renderSettingsMainViewContent(props, handleSortSelect);

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
