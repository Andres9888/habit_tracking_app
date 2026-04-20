/**
 * DetailViewTabs - Segmented control for Calendar / Strength / Goal views.
 * Horizontal icon + label, no hints.
 */
import { useCallback, useEffect, useRef } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Activity, Calendar, Target } from 'lucide-react-native';
import { springs } from '@/theme/animations';
import { useThemeColors } from '@/theme';
import { shadows } from '@/theme/spacing';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { DetailViewTabButton, type DetailView } from './DetailViewTabButton';

interface DetailViewTabsProps {
  activeView: DetailView;
  onViewChange: (view: DetailView) => void;
}

const PADDING = 4;
const TABS = [
  { icon: Calendar, label: 'Calendar', view: 'calendar' as const },
  { icon: Activity, label: 'Strength', view: 'strength' as const },
  { icon: Target, label: 'Goal', view: 'goal' as const },
];

export function DetailViewTabs({ activeView, onViewChange }: DetailViewTabsProps) {
  const containerWidth = useSharedValue(0);
  const activeIndex = TABS.findIndex((t) => t.view === activeView);
  const indicatorX = useSharedValue(activeIndex < 0 ? 0 : activeIndex);
  const hasMounted = useRef(false);
  const reduceMotion = useReduceMotion();

  useEffect(() => {
    const next = TABS.findIndex((t) => t.view === activeView);
    const target = next < 0 ? 0 : next;
    if (!hasMounted.current) {
      indicatorX.value = target;
      hasMounted.current = true;
      return;
    }
    indicatorX.value = withSpring(target, springs.standard);
  }, [activeView, indicatorX]);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      containerWidth.value = event.nativeEvent.layout.width;
    },
    [containerWidth]
  );

  const indicatorStyle = useAnimatedStyle(() => {
    const tabWidth = (containerWidth.value - PADDING * 2) / TABS.length;
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
      className='mt-2 rounded-lg'
      style={{ backgroundColor: containerBg, padding: PADDING }}
      onLayout={handleLayout}
    >
      <Animated.View
        className='absolute bottom-1 top-1 rounded-md'
        style={[indicatorStyle, { backgroundColor: indicatorBg, ...shadows.card }]}
      />
      <View className='flex-row'>
        {TABS.map(({ icon, label, view }) => (
          <DetailViewTabButton
            key={view}
            accentColor={accentColor}
            activeView={activeView}
            icon={icon}
            label={label}
            reduceMotion={reduceMotion}
            view={view}
            onPress={onViewChange}
          />
        ))}
      </View>
    </View>
  );
}

export { type DetailView } from './DetailViewTabButton';
