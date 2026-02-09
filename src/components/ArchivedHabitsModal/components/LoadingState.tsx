/**
 * LoadingState - Skeleton loader for archived habits
 */
import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

export const LoadingState: React.FC = () => {
  const shimmerAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          duration: 1200,
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          duration: 1200,
          toValue: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.container}>
      {[1, 2, 3].map((key) => (
        <Animated.View key={key} style={[styles.cardSkeleton, { opacity }]}>
          <View style={styles.header}>
            <Animated.View style={[styles.emojiCircle, { opacity }]} />
            <View style={styles.textBlock}>
              <Animated.View style={[styles.nameSkeleton, { opacity }]} />
              <Animated.View style={[styles.dateSkeleton, { opacity }]} />
            </View>
          </View>
          <View style={styles.buttonRow}>
            <Animated.View style={[styles.buttonSkeleton, { opacity }]} />
            <Animated.View style={[styles.buttonSkeleton, { opacity }]} />
          </View>
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  buttonSkeleton: {
    backgroundColor: colors.gray[200],
    borderRadius: 8,
    flex: 1,
    height: 40,
  },
  cardSkeleton: {
    backgroundColor: colors.gray[50],
    borderColor: colors.gray[200],
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  container: {
    padding: spacing.md,
  },
  dateSkeleton: {
    backgroundColor: colors.gray[200],
    borderRadius: 4,
    height: 12,
    width: 80,
  },
  emojiCircle: {
    backgroundColor: colors.gray[200],
    borderRadius: 24,
    height: 48,
    width: 48,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  nameSkeleton: {
    backgroundColor: colors.gray[200],
    borderRadius: 4,
    height: 16,
    marginBottom: spacing.xs,
    width: 140,
  },
  textBlock: {
    flex: 1,
  },
});
