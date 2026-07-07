import { Text, View } from 'react-native';
import { spacing } from '@/theme/spacing';
import { useThemeColors } from '@/theme/ThemeContext';
import { onboardingTypography } from '../onboardingTypography';

interface HeroHeaderProps {
  eyebrow?: string;
  headline: string;
  sub?: string;
}

export function HeroHeader({ eyebrow, headline, sub }: HeroHeaderProps) {
  const { colors } = useThemeColors();

  return (
    <View>
      {eyebrow ? (
        <Text
          style={{
            ...onboardingTypography.eyebrow,
            color: colors.text.tertiary,
            marginBottom: spacing.sm,
          }}
        >
          {eyebrow}
        </Text>
      ) : null}
      <Text
        style={{
          ...onboardingTypography.heroHeadline,
          color: colors.text.primary,
        }}
      >
        {headline}
      </Text>
      {sub ? (
        <Text
          style={{
            ...onboardingTypography.bodyText,
            color: colors.text.secondary,
            marginTop: 10,
          }}
        >
          {sub}
        </Text>
      ) : null}
    </View>
  );
}
