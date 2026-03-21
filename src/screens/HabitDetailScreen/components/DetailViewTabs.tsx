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

  return (
    <View
      accessibilityRole='tablist'
      className='mt-4 rounded-lg bg-stone-100'
      style={{ padding: PADDING }}
      onLayout={handleLayout}
    >
      <Animated.View
        className='absolute bottom-1 top-1 rounded-md bg-white'
        style={[
          indicatorStyle,
          {
            elevation: 3,
            shadowColor: '#059669',
            shadowOffset: { height: 3, width: 0 },
            shadowOpacity: 0.12,
            shadowRadius: 8,
          },
        ]}
      />
      <View className='flex-row'>
        <DetailViewTabButton
          activeView={activeView}
          hint={calendarHint}
          icon={Calendar}
          label='Calendar'
          view='calendar'
          onPress={onViewChange}
        />
        <DetailViewTabButton
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
