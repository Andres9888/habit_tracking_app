/**
 * HabitRankingsList EmptyState
 * Shows when there are no habits to rank
 */

import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { ListOrdered } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { styles } from './styles';

export function EmptyState() {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(10);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    opacity.value = withDelay(100, withSpring(1));
    translateY.value = withDelay(100, withSpring(0));
    scale.value = withDelay(100, withSpring(1));
  }, [opacity, translateY, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.emptyContainer, animatedStyle]}>
      <View
        style={{
          alignItems: 'center',
          backgroundColor: '#f3f4f6',
          borderRadius: 24,
          height: 72,
          justifyContent: 'center',
          marginBottom: 16,
          width: 72,
        }}
      >
        <ListOrdered color={colors.text.tertiary} size={32} strokeWidth={1.5} />
      </View>
      <Text style={styles.emptyText}>No habits to rank yet</Text>
      <Text style={styles.emptySubtext}>
        Complete some habits to see your rankings
      </Text>
    </Animated.View>
  );
}
