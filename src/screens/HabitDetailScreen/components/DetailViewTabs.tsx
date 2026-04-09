/**
 * DetailViewTabs - Segmented control for Calendar vs Strength views.
 * Apple HIG pill + Dual Coding (icons) + Information Scent (hints).
 */

import { useCallback, useEffect } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Activity, Calendar } from 'lucide-react-native';
import { springs } from '@/theme/animations';
import { useThemeColors } from '@/theme';
import { shadows } from '@/theme/spacing';
import { DetailViewTabButton, type DetailView } from './DetailViewTabButton';

interface DetailViewTabsProps {
  activeView: DetailView;
  calendarHint?: string;
  strengthHint?: string;
  onViewChange: (view: DetailView) => void;
}

const PADDING = 4;

export function DetailViewTabs({
  activeView,
  calendarHint,
  strengthHint,
  onViewChange,
}: DetailViewTabsProps) {
  const containerWidth = useSharedValue(0);
  const indicatorX = useSharedValue(activeView === 'calendar' ? 0 : 1);

  useEffect(() => {
    indicatorX.value = withSpring(
      activeView === 'calendar' ? 0 : 1,
      springs.standard
    );
  }, [activeView, indicatorX]);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      containerWidth.value = event.nativeEvent.layout.width;
    },
    [containerWidth]
  );

  const indicatorStyle = useAnimatedStyle(() => {
    const tabWidth = (containerWidth.value - PADDING * 2) / 2;
    if (tabWidth <= 0) return { opacity: 0 };
    return {
      left: PADDING + indicatorX.value * tabWidth,
      opacity: 1,
      width: tabWidth,
    };
  });

  const { colors, isDark } = useThemeColors();
  const containerBg = isDark ? colors.surface : colors.gray[200];
  const indicatorBg = isDark ? colors.card : colors.gray[50];
  const accentColor = isDark ? colors.primary[500] : colors.primary[600];

  return (
    <View
      accessibilityRole='tablist'
      className='mt-4 rounded-lg'
      style={{ backgroundColor: containerBg, padding: PADDING }}
      onLayout={handleLayout}
    >
      <Animated.View
        className='absolute bottom-1 top-1 rounded-md'
        style={[
          indicatorStyle,
          {
            backgroundColor: indicatorBg,
            ...shadows.card,
            shadowColor: accentColor,
          },
        ]}
      />
      <View className='flex-row'>
        <DetailViewTabButton
          accentColor={accentColor}
          activeView={activeView}
          hint={calendarHint}
          icon={Calendar}
          label='Calendar'
          view='calendar'
          onPress={onViewChange}
        />
        <DetailViewTabButton
          accentColor={accentColor}
          activeView={activeView}
          hint={strengthHint}
          icon={Activity}
          label='Strength'
          view='strength'
          onPress={onViewChange}
        />
      </View>
    </View>
  );
}

export { type DetailView } from './DetailViewTabButton';
