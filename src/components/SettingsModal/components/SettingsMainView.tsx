import { View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';
import { Toast } from '../../Toast';
import { useThemeColors } from '../../../theme/ThemeContext';
import { useDeferredMount } from '../../../hooks/useDeferredMount';
import type { HabitSortMode } from '../../../features/habits/types';
import { getSettingsViewEntering } from './SettingsMainView.animations';
import { renderSettingsMainViewContent } from './SettingsMainView.renderContent';
import type { SettingsMainViewProps } from './SettingsMainView.types';

export function SettingsMainView(props: SettingsMainViewProps) {
  const reduceMotion = useReducedMotion();
  const ready = useDeferredMount({ latchKey: 'SettingsModal' });
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
  // Keep the skeleton up through the *first* open animation: the heavy section
  // tree mounts one frame after interactions settle, off the animation's path.
  // The latch keeps later opens instant — Modal unmounts children on close, so
  // without it every open would replay the skeleton against an already-warm tree.
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
      {/* Rendered above the view switcher so a rejected write is reported even
          if the user has already navigated into a sub-page. */}
      <Toast
        message={props.errorMessage ?? ''}
        variant='error'
        visible={props.errorMessage !== null}
        onDismiss={props.clearError}
      />
    </View>
  );
}
