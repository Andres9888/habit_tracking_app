/** Title line for an AdvancedOptionRow — the title plus an optional small pill badge. */
import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { fontWeights, typography } from '@/theme/typography';

interface AdvancedOptionRowTitleProps {
  title: string;
  badge?: string;
}

export function AdvancedOptionRowTitle({
  title,
  badge,
}: AdvancedOptionRowTitleProps) {
  const { colors } = useThemeColors();
  return (
    <View className='flex-row flex-wrap items-center gap-2'>
      <Text
        style={{
          ...typography.body,
          fontWeight: fontWeights.semibold,
          color: colors.text.primary,
        }}
      >
        {title}
      </Text>
      {badge ? (
        <View
          className='rounded-md px-1.5 py-0.5'
          style={{ backgroundColor: colors.primary[100] }}
        >
          <Text
            style={{
              ...typography.caption,
              fontSize: 10,
              fontWeight: fontWeights.bold,
              letterSpacing: 0.3,
              color: colors.primary[700],
            }}
          >
            {badge}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
