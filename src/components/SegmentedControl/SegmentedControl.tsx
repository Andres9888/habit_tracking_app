/**
 * SegmentedControl — Unified tab/segment picker with animated indicator.
 *
 * Replaces the three divergent tab-bar implementations (HabitDetailTabs,
 * CalendarTabs, TemplatesScreen TabBar) with a single, theme-aware,
 * dark-mode-ready component.
 *
 * Features:
 *  - Spring-animated sliding pill indicator
 *  - Haptic feedback on selection
 *  - Full dark mode via useThemeColors()
 *  - Accessible (tablist / tab roles)
 *  - Configurable segment count
 */

import React, { useCallback, useEffect } from 'react';
import { View, Text, Pressable, type LayoutChangeEvent } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useDerivedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '../../theme/ThemeContext';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface Segment<T extends string = string> {
  /** Unique key used to identify the segment. */
  id: T;
  /** Display label. */
  label: string;
  /** Optional badge / count shown after the label. */
  badge?: string | number;
}

export interface SegmentedControlProps<T extends string = string> {
  /** Available segments. */
  segments: Segment<T>[];
  /** Currently selected segment id. */
  activeId: T;
  /** Called when the user selects a different segment. */
  onChange: (id: T) => void;
  /** Visual variant — 'filled' uses a coloured pill, 'surface' a white/dark pill. */
  variant?: 'filled' | 'surface';
  /** Optional outer margin style override. */
  style?: object;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const SPRING_CONFIG = { damping: 18, mass: 1, stiffness: 180 };
const CONTAINER_PADDING = 4;
const GAP = 2;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function SegmentedControl<T extends string = string>({
  segments,
  activeId,
  onChange,
  variant = 'filled',
  style,
}: SegmentedControlProps<T>) {
  const { colors, isDark } = useThemeColors();
  const count = segments.length;

  const containerWidth = useSharedValue(0);
  const activeIndex = segments.findIndex((s) => s.id === activeId);
  const position = useSharedValue(activeIndex >= 0 ? activeIndex : 0);

  useEffect(() => {
    const idx = segments.findIndex((s) => s.id === activeId);
    if (idx >= 0) {
      position.value = withSpring(idx, SPRING_CONFIG);
    }
  }, [activeId, segments, position]);

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      containerWidth.value = e.nativeEvent.layout.width;
    },
    [containerWidth],
  );

  const pillWidth = useDerivedValue(() => {
    if (containerWidth.value === 0) return 0;
    return (
      (containerWidth.value - CONTAINER_PADDING * 2 - GAP * (count - 1)) /
      count
    );
  });

  const pillStyle = useAnimatedStyle(() => {
    const w = pillWidth.value;
    if (w <= 0) return { opacity: 0 };
    return {
      left: CONTAINER_PADDING + position.value * (w + GAP),
      width: w,
      opacity: 1,
    };
  });

  const handlePress = useCallback(
    (id: T) => {
      if (id !== activeId) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onChange(id);
      }
    },
    [activeId, onChange],
  );

  /* ---- derived colours ---- */

  const isFilled = variant === 'filled';

  const trackBg = isDark ? colors.gray[100] : colors.gray[100];
  const pillBg = isFilled ? colors.primary[500] : isDark ? colors.gray[200] : '#FFFFFF';
  const pillShadowColor = isFilled ? colors.primary[500] : colors.gray[400];

  const activeTextColor = isFilled ? '#FFFFFF' : colors.text.primary;
  const inactiveTextColor = colors.text.tertiary;
  const activeBadgeColor = isFilled ? 'rgba(255,255,255,0.8)' : colors.primary[500];
  const inactiveBadgeColor = colors.text.tertiary;

  return (
    <View
      accessibilityRole="tablist"
      style={[
        {
          backgroundColor: trackBg,
          borderRadius: 12,
          padding: CONTAINER_PADDING,
        },
        style,
      ]}
      onLayout={handleLayout}
    >
      {/* Sliding pill */}
      <Animated.View
        style={[
          pillStyle,
          {
            position: 'absolute',
            top: CONTAINER_PADDING,
            bottom: CONTAINER_PADDING,
            borderRadius: 10,
            backgroundColor: pillBg,
            shadowColor: pillShadowColor,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 3,
          },
        ]}
      />

      {/* Segments */}
      <View style={{ flexDirection: 'row', gap: GAP }}>
        {segments.map((seg) => {
          const isActive = seg.id === activeId;
          return (
            <Pressable
              key={seg.id}
              accessibilityLabel={`${seg.label} tab`}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                paddingVertical: 10,
                zIndex: 1,
                minHeight: 40,
              }}
              onPress={() => handlePress(seg.id)}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: isActive ? activeTextColor : inactiveTextColor,
                }}
              >
                {seg.label}
              </Text>
              {seg.badge !== undefined && (
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '700',
                    marginLeft: 6,
                    color: isActive ? activeBadgeColor : inactiveBadgeColor,
                  }}
                >
                  {seg.badge}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
