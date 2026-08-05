import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '../../../theme/ThemeContext';
import { spacing, borderRadius } from '../../../theme/spacing';
import { typography, fontWeights } from '../../../theme/typography';
import { XP_GRADIENT } from '../constants';
import type { CharacterData } from '../types';

interface CharacterXpSectionProps {
  data: CharacterData;
}

export function CharacterXpSection({ data }: CharacterXpSectionProps) {
  const xpToNextLevel = data.xpToNextLevel || 1;
  const xpProgress = (data.xp / xpToNextLevel) * 100;
  const xpRemaining = xpToNextLevel - data.xp;
  const { colors } = useThemeColors();

  return (
    <View style={styles.xpSection}>
      <View style={styles.xpLabelRow}>
        <Text style={[styles.xpLabel, { color: colors.text.secondary }]}>
          Experience
        </Text>
        <Text style={[styles.xpValue, { color: colors.text.primary }]}>
          {data.xp}/{data.xpToNextLevel} XP
        </Text>
      </View>
      <View style={[styles.xpBarTrack, { backgroundColor: colors.gray[200] }]}>
        <View style={{ width: `${xpProgress}%` }}>
          <LinearGradient
            colors={XP_GRADIENT}
            end={{ x: 1, y: 0 }}
            start={{ x: 0, y: 0 }}
            style={styles.xpBarFill}
          />
        </View>
      </View>
      <Text style={[styles.xpRemaining, { color: colors.text.tertiary }]}>
        {xpRemaining} XP to Level {data.level + 1}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  xpBarFill: {
    borderRadius: borderRadius.full,
    height: '100%',
    width: '100%',
  },
  xpBarTrack: {
    borderRadius: borderRadius.full,
    height: 12,
    overflow: 'hidden',
    width: '100%',
  },
  xpLabel: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: fontWeights.regular,
    letterSpacing: -0.15,
    lineHeight: 20,
  },
  xpLabelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  xpRemaining: {
    fontSize: typography.caption.fontSize,
    fontWeight: fontWeights.regular,
    lineHeight: 16,
    textAlign: 'center',
  },
  xpSection: {
    flexDirection: 'column',
    gap: spacing.sm,
  },
  xpValue: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: fontWeights.regular,
    letterSpacing: -0.15,
    lineHeight: 20,
  },
});
