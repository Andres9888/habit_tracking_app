import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

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
            color: colors.text.tertiary,
            fontSize: 12,
            fontWeight: '600',
            letterSpacing: 1,
            marginBottom: 8,
            textTransform: 'uppercase',
          }}
        >
          {eyebrow}
        </Text>
      ) : null}
      <Text
        style={{
          color: colors.text.primary,
          fontSize: 28,
          fontWeight: '800',
          letterSpacing: -0.5,
          lineHeight: 34,
        }}
      >
        {headline}
      </Text>
      {sub ? (
        <Text
          style={{
            color: colors.text.secondary,
            fontSize: 15,
            lineHeight: 22,
            marginTop: 10,
          }}
        >
          {sub}
        </Text>
      ) : null}
    </View>
  );
}
