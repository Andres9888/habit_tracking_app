import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { spacing, borderRadius, shadows } from '../../../theme/spacing';
import { fontWeights } from '../../../theme/typography';
import type { AttributeCardProps } from '../types';

export function AttributeCard({
  icon,
  name,
  value,
  maxValue,
  gradientColors,
  bgGradient,
  delay = 0,
}: AttributeCardProps & { delay?: number }) {
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
  const { colors } = useThemeColors();

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify().damping(18)}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
          shadowColor: colors.text.primary,
        },
      ]}
    >
      <View style={styles.barContainer}>
        <View
          style={[styles.bgFillWrapper, { width: `${percentage}%` }]}
        >
          <LinearGradient
            colors={bgGradient}
            end={{ x: 1, y: 0 }}
            start={{ x: 0, y: 0 }}
            style={styles.bgFill}
          />
        </View>

        <View style={styles.contentCol}>
          <View style={styles.labelRow}>
            <View style={styles.iconNameRow}>
              <View style={[styles.iconCircle, { backgroundColor: colors.card }]}>
                {icon}
              </View>
              <Text style={[styles.nameText, { color: colors.text.primary }]}>
                {name}
              </Text>
            </View>
            <Text style={[styles.valueText, { color: colors.text.primary }]}>
              {value}
            </Text>
          </View>

          <View style={[styles.progressTrack, { backgroundColor: colors.gray[200] }]}>
            <View style={{ width: `${percentage}%` }}>
              <LinearGradient
                colors={gradientColors}
                end={{ x: 1, y: 0 }}
                start={{ x: 0, y: 0 }}
                style={styles.progressFill}
              />
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  barContainer: {
    height: 110,
    position: 'relative',
  },
  bgFill: {
    height: '100%',
    width: '100%',
  },
  bgFillWrapper: {
    bottom: 0,
    left: 0,
    opacity: 0.6,
    position: 'absolute',
    top: 0,
  },
  card: {
    ...shadows.floatingActionButton,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  contentCol: {
    flexDirection: 'column',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  iconCircle: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  iconNameRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  labelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameText: {
    fontSize: 16,
    fontWeight: fontWeights.regular,
    letterSpacing: -0.3125,
    lineHeight: 24,
  },
  progressFill: {
    borderRadius: borderRadius.full,
    height: '100%',
    width: '100%',
  },
  progressTrack: {
    borderRadius: borderRadius.full,
    height: 8,
    overflow: 'hidden',
    width: '100%',
  },
  valueText: {
    fontSize: 16,
    fontWeight: fontWeights.regular,
    letterSpacing: -0.3125,
    lineHeight: 24,
  },
});
