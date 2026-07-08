/** Header for AdvancedOptionsSection — eyebrow + Optional pill, reassurance line, growth pill. */
import { Text, View } from 'react-native';
import { Sprout } from 'lucide-react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { fontWeights, typography } from '@/theme/typography';
import { getGrowthTypeMeta, type GrowthType } from '@/utils/growthTypeMeta';

interface AdvancedOptionsHeaderProps {
  growthType?: GrowthType;
}

export function AdvancedOptionsHeader({
  growthType,
}: AdvancedOptionsHeaderProps) {
  const { colors } = useThemeColors();
  const growthMeta = getGrowthTypeMeta(growthType);

  return (
    <>
      <View className='mb-2 flex-row items-center gap-2'>
        <Text
          className='uppercase'
          style={{
            ...typography.caption,
            fontSize: 12,
            fontWeight: fontWeights.bold,
            letterSpacing: 0.6,
            color: colors.text.secondary,
          }}
        >
          Fine-tune this habit
        </Text>
        <View
          className='rounded-full px-2 py-0.5'
          style={{ backgroundColor: colors.primary[100] }}
        >
          <Text
            style={{
              ...typography.caption,
              fontSize: 11,
              fontWeight: fontWeights.semibold,
              color: colors.primary[700],
            }}
          >
            Optional
          </Text>
        </View>
      </View>
      <Text
        style={{
          ...typography.caption,
          color: colors.text.tertiary,
          marginBottom: growthMeta ? 8 : 10,
        }}
      >
        Defaults are great — adjust any only if you want to.
      </Text>
      {growthMeta ? (
        <View
          accessibilityLabel={`Growth Type: ${growthMeta.label}`}
          className='mb-2 flex-row items-center self-start rounded-full px-3 py-1.5'
          style={{ backgroundColor: growthMeta.pillBg }}
        >
          <Sprout color={growthMeta.pillFg} size={14} strokeWidth={2.5} />
          <Text
            style={{
              ...typography.caption,
              fontSize: 12,
              fontWeight: fontWeights.semibold,
              color: growthMeta.pillFg,
              marginLeft: 6,
            }}
          >
            Growth Type · {growthMeta.label} · ~{growthMeta.days}-day build
          </Text>
        </View>
      ) : null}
    </>
  );
}
