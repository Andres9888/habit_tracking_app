/**
 * DetailViewTabs - Parchment-pill segmented control for Calendar / Strength / Time / Goals / Why.
 * Warm token track, card-color active pill with forest hairline + tonal shadow.
 * Designed to sit as a sticky header above the section stack.
 */
import { useCallback, useEffect } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import useHapticFeedback from '@/hooks/useHapticFeedback';
import { borderRadius } from '@/theme/spacing';
import { useThemeColors } from '@/theme';
import { DetailViewTabButton, type DetailView } from './DetailViewTabButton';

interface DetailViewTabsProps {
  activeView: DetailView;
  onViewChange: (view: DetailView) => void;
}

const PADDING = 3;
const TABS: Array<{ label: string; view: DetailView }> = [
  { label: 'Calendar', view: 'calendar' },
  { label: 'Strength', view: 'strength' },
  { label: 'Time', view: 'time' },
  { label: 'Goals', view: 'goals' },
  { label: 'Why', view: 'why' },
];
const SPRING = { duration: 280, easing: Easing.out(Easing.cubic) };

export function DetailViewTabs({ activeView, onViewChange }: DetailViewTabsProps) {
  const { triggerSelection } = useHapticFeedback();
  const { colors, isDark } = useThemeColors();
  const containerWidth = useSharedValue(0);
  const activeIndex = TABS.findIndex((t) => t.view === activeView);
  const indicatorIndex = useSharedValue(activeIndex < 0 ? 0 : activeIndex);

  useEffect(() => {
    const next = TABS.findIndex((t) => t.view === activeView);
    indicatorIndex.value = withTiming(next < 0 ? 0 : next, SPRING);
  }, [activeView, indicatorIndex]);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      containerWidth.value = event.nativeEvent.layout.width;
    },
    [containerWidth]
  );

  const handleTabPress = useCallback(
    (view: DetailView) => {
      if (view !== activeView) triggerSelection();
      onViewChange(view);
    },
    [activeView, onViewChange, triggerSelection]
  );

  const indicatorStyle = useAnimatedStyle(() => {
    const tabWidth = (containerWidth.value - PADDING * 2) / TABS.length;
    if (tabWidth <= 0) return { opacity: 0 };
    return {
      opacity: 1,
      transform: [{ translateX: PADDING + indicatorIndex.value * tabWidth }],
      width: tabWidth,
    };
  });

  const accentColor = colors.primary[700];
  const trackBg = isDark ? colors.surface : colors.gray[50];

  return (
    <View
      style={{
        backgroundColor: colors.background,
        paddingBottom: 10,
        paddingHorizontal: 16,
        paddingTop: 6,
      }}
    >
      <View
        accessibilityRole='tablist'
        style={{
          backgroundColor: trackBg,
          borderColor: colors.border,
          borderRadius: borderRadius.medium,
          borderWidth: 1,
          flexDirection: 'row',
          padding: PADDING,
          position: 'relative',
        }}
        onLayout={handleLayout}
      >
        <Animated.View
          pointerEvents='none'
          style={[
            {
              backgroundColor: colors.card,
              borderColor: 'rgba(5, 150, 105, 0.22)',
              borderRadius: borderRadius.small,
              borderWidth: 1,
              bottom: PADDING,
              position: 'absolute',
              shadowColor: accentColor,
              shadowOffset: { height: 1, width: 0 },
              shadowOpacity: 0.08,
              shadowRadius: 3,
              top: PADDING,
            },
            indicatorStyle,
          ]}
        />
        {TABS.map(({ label, view }) => (
          <DetailViewTabButton
            key={view}
            accentColor={accentColor}
            activeView={activeView}
            label={label}
            view={view}
            onPress={handleTabPress}
          />
        ))}
      </View>
    </View>
  );
}

export { type DetailView } from './DetailViewTabButton';
