/**
 * DetailViewTabs - Minimal pill segmented control for Calendar / Strength / Goal.
 * Borderless token track, plain card-color indicator, weight-driven active state.
 * Designed to sit as a sticky header above the section stack.
 */
import { useCallback, useEffect } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import useHapticFeedback from '@/hooks/useHapticFeedback';
import { borderRadius, spacing } from '@/theme/spacing';
import { useThemeColors } from '@/theme';
import { DetailViewTabButton, type DetailView } from './DetailViewTabButton';
import { DetailViewTabIndicator } from './DetailViewTabIndicator';
import {
  INDICATOR_TIMING,
  PADDING,
  TABS,
  TRACK_PADDING_BOTTOM,
  TRACK_PADDING_TOP,
} from './DetailViewTabs.constants';

interface DetailViewTabsProps {
  activeView: DetailView;
  onViewChange: (view: DetailView) => void;
}

export function DetailViewTabs({
  activeView,
  onViewChange,
}: DetailViewTabsProps) {
  const { triggerSelection } = useHapticFeedback();
  const { colors, isDark } = useThemeColors();
  const containerWidth = useSharedValue(0);
  const activeIndex = TABS.findIndex((t) => t.view === activeView);
  const indicatorIndex = useSharedValue(Math.max(activeIndex, 0));

  useEffect(() => {
    const next = TABS.findIndex((t) => t.view === activeView);
    indicatorIndex.value = withTiming(Math.max(next, 0), INDICATOR_TIMING);
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

  const trackBg = isDark ? colors.surface : colors.gray[50];

  return (
    <View
      style={{
        backgroundColor: colors.background,
        paddingBottom: TRACK_PADDING_BOTTOM,
        paddingHorizontal: spacing.base + spacing.xs,
        paddingTop: TRACK_PADDING_TOP,
      }}
    >
      <View
        accessibilityRole='tablist'
        style={{
          backgroundColor: trackBg,
          borderRadius: borderRadius.full,
          flexDirection: 'row',
          padding: PADDING,
          position: 'relative',
        }}
        onLayout={handleLayout}
      >
        <DetailViewTabIndicator
          containerWidth={containerWidth}
          indicatorIndex={indicatorIndex}
        />
        {TABS.map(({ label, view }) => (
          <DetailViewTabButton
            key={view}
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
