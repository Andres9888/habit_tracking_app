import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { VictoryPie, VictoryLabel, VictoryContainer } from 'victory-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

const { width: screenWidth } = Dimensions.get('window');
const chartSize = Math.min(screenWidth - spacing.xl * 2, 280);

interface StrengthLevel {
  count: number;
  percentage: number;
  emoji: string;
}

interface StrengthDistributionData {
  starting: StrengthLevel;
  building: StrengthLevel;
  developing: StrengthLevel;
  strong: StrengthLevel;
  automatic: StrengthLevel;
  total: number;
}

interface Props {
  data: StrengthDistributionData | null;
  onSegmentPress?: (level: string) => void;
}

const LEVEL_COLORS = {
  // Green-200 (Strong 💪)
  automatic: '#10B981',

  // Red-100 (Starting 🌱)
  building: '#FED7AA',

  // Orange-200 (Building 🌿)
  developing: '#FDE68A',

  starting: '#FEE2E2',
  // Yellow-200 (Developing 🌳)
  strong: '#BBF7D0', // Primary green (Automatic ⚡)
};

const LEVEL_LABELS = {
  automatic: 'Automatic',
  building: 'Building',
  developing: 'Developing',
  starting: 'Starting',
  strong: 'Strong',
};

export default function StrengthDistributionChart({
  data,
  onSegmentPress,
}: Props) {
  const animationProgress = useSharedValue(0);
  const containerScale = useSharedValue(0);

  useEffect(() => {
    // Animate chart appearance
    containerScale.value = withSpring(1, {
      damping: 15,
      stiffness: 100,
    });
    animationProgress.value = withTiming(1, { duration: 400 });
  }, [data]);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(containerScale.value, [0, 1], [0, 1]),
      transform: [{ scale: containerScale.value }],
    };
  });

  if (!data || data.total === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No habits to display</Text>
        <Text style={styles.emptySubtext}>
          Create your first habit to see analytics
        </Text>
      </View>
    );
  }

  // Prepare data for Victory chart
  const chartData = Object.entries(data)
    .filter(([key]) => key !== 'total')
    .map(([key, value]) => ({
      label: `${(value as StrengthLevel).percentage.toFixed(0)}%`,
      x: key,
      y: (value as StrengthLevel).count,
    }))
    .filter((item) => item.y > 0); // Only show segments with data

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.chartContainer, containerAnimatedStyle]}>
        <VictoryPie
          animate={{
            duration: 400,
            onLoad: { duration: 400 },
          }}
          colorScale={chartData.map(
            (d) => LEVEL_COLORS[d.x as keyof typeof LEVEL_COLORS]
          )}
          data={chartData}
          events={[
            {
              eventHandlers: {
                onPressIn: () => {
                  return [
                    {
                      mutation: (props) => {
                        if (onSegmentPress) {
                          onSegmentPress(props.datum.x);
                        }
                        return null;
                      },
                      target: 'data',
                    },
                  ];
                },
              },
              target: 'data',
            },
          ]}
          height={chartSize}
          innerRadius={chartSize * 0.3}
          labelComponent={
            <VictoryLabel
              style={{
                fill: colors.text.primary,
                fontSize: 14,
                fontWeight: '600',
              }}
            />
          }
          labelRadius={chartSize * 0.4}
          padAngle={2}
          width={chartSize}
        />

        {/* Center label */}
        <View style={styles.centerLabel}>
          <Text style={styles.centerLabelValue}>{data.total}</Text>
          <Text style={styles.centerLabelText}>Total Habits</Text>
        </View>
      </Animated.View>

      {/* Legend */}
      <View style={styles.legend}>
        {Object.entries(data)
          .filter(([key]) => key !== 'total')
          .filter(([_, value]) => (value as StrengthLevel).count > 0)
          .map(([key, value]) => {
            const level = value as StrengthLevel;
            return (
              <TouchableOpacity
                key={key}
                activeOpacity={0.7}
                style={styles.legendItem}
                onPress={() => onSegmentPress?.(key)}
              >
                <View style={styles.legendRow}>
                  <View
                    style={[
                      styles.legendDot,
                      {
                        backgroundColor:
                          LEVEL_COLORS[key as keyof typeof LEVEL_COLORS],
                      },
                    ]}
                  />
                  <Text style={styles.legendEmoji}>{level.emoji}</Text>
                  <Text style={styles.legendLabel}>
                    {LEVEL_LABELS[key as keyof typeof LEVEL_LABELS]}
                  </Text>
                </View>
                <Text style={styles.legendValue}>
                  {level.percentage.toFixed(0)}%
                </Text>
              </TouchableOpacity>
            );
          })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centerLabel: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  centerLabelText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginTop: spacing.xxs,
  },
  centerLabelValue: {
    ...typography.h1,
    color: colors.text.primary,
    fontSize: 32,
  },
  chartContainer: {
    height: chartSize,
    alignItems: 'center',
    position: 'relative',
    justifyContent: 'center',
    width: chartSize,
  },
  container: {
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    height: 200,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  emptyText: {
    ...typography.h3,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  legend: {
    marginTop: spacing.lg,
    width: '100%',
  },
  legendDot: {
    borderRadius: 6,
    height: 12,
    marginRight: spacing.sm,
    width: 12,
  },
  legendEmoji: {
    fontSize: 18,
    marginRight: spacing.xs,
  },
  legendItem: {
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  legendLabel: {
    ...typography.body,
    color: colors.text.primary,
  },
  legendRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  legendValue: {
    ...typography.bodyBold,
    color: colors.text.secondary,
  },
});
