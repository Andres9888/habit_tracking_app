import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';

interface GoalProgressBarProps {
  progressPercentage: number;
  streakColor: string;
  trackColor: string;
  textColor: string;
}

export function GoalProgressBar({
  progressPercentage,
  streakColor,
  trackColor,
  textColor,
}: GoalProgressBarProps) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(progressPercentage, { duration: 1200 });
  }, [progressPercentage, width]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <View style={{ marginBottom: 8 }}>
      <View style={{ height: 24, borderRadius: 12, backgroundColor: trackColor, overflow: 'hidden' }}>
        <Animated.View
          style={[
            { height: '100%', borderRadius: 12, backgroundColor: streakColor, justifyContent: 'center', alignItems: 'flex-end', paddingRight: 8, minWidth: 40 },
            fillStyle,
          ]}
        >
          {progressPercentage >= 15 ? (
            <Text style={{ fontSize: 11, fontWeight: '700', color: textColor }}>
              {progressPercentage}%
            </Text>
          ) : null}
        </Animated.View>
      </View>
    </View>
  );
}
