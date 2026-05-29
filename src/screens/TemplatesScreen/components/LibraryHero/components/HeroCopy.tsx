import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../../../theme/ThemeContext';
import { spacing } from '../../../../../theme/spacing';
import { typography } from '../../../../../theme/typography';
import type { HeroCopyProps } from '../LibraryHero.types';

export function HeroCopy({ subtitle, title }: HeroCopyProps) {
  const { colors } = useThemeColors();

  return (
    <View style={s.copy}>
      <Animated.View entering={FadeInDown.delay(80).duration(280)}>
        <Text
          accessibilityRole='header'
          numberOfLines={2}
          style={[s.title, { color: colors.text.primary }]}
        >
          {title}
        </Text>
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(160).duration(280)}>
        <Text style={[s.subtitle, { color: colors.text.secondary }]}>
          {subtitle}
        </Text>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  copy: { gap: spacing.sm },
  subtitle: {
    ...typography.body,
    maxWidth: 290,
  },
  title: {
    ...typography.displayLarge,
  },
});
