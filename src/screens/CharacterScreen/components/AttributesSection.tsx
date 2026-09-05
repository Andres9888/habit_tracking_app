import { View, StyleSheet } from 'react-native';
import { Heart, Dumbbell, Brain, Zap } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { durations, enterEasing } from '../../../theme/animations';
import { useThemeColors } from '../../../theme/ThemeContext';
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';
import { AttributeCard } from './AttributeCard';
import { ATTRIBUTE_CONFIGS } from '../constants';
import type { CharacterAttributes } from '../types';

interface AttributesSectionProps {
  attributes: CharacterAttributes;
}

const STAGGER_DELAY = durations.stagger;
const BASE_DELAY = durations.reveal;

export function AttributesSection({ attributes }: AttributesSectionProps) {
  const { colors } = useThemeColors();

  return (
    <View style={styles.section}>
      <Animated.Text
        entering={FadeInDown.delay(BASE_DELAY)
          .duration(durations.enter)
          .easing(enterEasing)}
        style={[styles.sectionTitle, { color: colors.text.primary }]}
      >
        Attributes
      </Animated.Text>
      <AttributeCard
        bgGradient={ATTRIBUTE_CONFIGS.vitality.bgGradient}
        delay={BASE_DELAY + STAGGER_DELAY}
        gradientColors={ATTRIBUTE_CONFIGS.vitality.gradientColors}
        icon={
          <Heart
            color={ATTRIBUTE_CONFIGS.vitality.iconColor}
            size={iconSizes.medium}
          />
        }
        maxValue={100}
        name='Vitality'
        value={attributes.vitality}
      />
      <AttributeCard
        bgGradient={ATTRIBUTE_CONFIGS.strength.bgGradient}
        delay={BASE_DELAY + STAGGER_DELAY * 2}
        gradientColors={ATTRIBUTE_CONFIGS.strength.gradientColors}
        icon={
          <Dumbbell
            color={ATTRIBUTE_CONFIGS.strength.iconColor}
            size={iconSizes.medium}
          />
        }
        maxValue={100}
        name='Strength'
        value={attributes.strength}
      />
      <AttributeCard
        bgGradient={ATTRIBUTE_CONFIGS.wisdom.bgGradient}
        delay={BASE_DELAY + STAGGER_DELAY * 3}
        gradientColors={ATTRIBUTE_CONFIGS.wisdom.gradientColors}
        icon={
          <Brain
            color={ATTRIBUTE_CONFIGS.wisdom.iconColor}
            size={iconSizes.medium}
          />
        }
        maxValue={100}
        name='Wisdom'
        value={attributes.wisdom}
      />
      <AttributeCard
        bgGradient={ATTRIBUTE_CONFIGS.energy.bgGradient}
        delay={BASE_DELAY + STAGGER_DELAY * 4}
        gradientColors={ATTRIBUTE_CONFIGS.energy.gradientColors}
        icon={
          <Zap
            color={ATTRIBUTE_CONFIGS.energy.iconColor}
            size={iconSizes.medium}
          />
        }
        maxValue={100}
        name='Energy'
        value={attributes.energy}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    flexDirection: 'column',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.button,
    letterSpacing: -0.41,
    lineHeight: 22,
    paddingHorizontal: spacing.xs,
  },
});
