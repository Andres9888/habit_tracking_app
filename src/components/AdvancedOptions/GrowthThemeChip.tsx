/** Growth theme chip — calm flat chip language (emerald when selected). */
import { Pressable, Text } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { fontWeights, typography } from '@/theme/typography';
import { usePressed } from './usePressed';

interface Props {
  label: string;
  emoji: string;
  selected: boolean;
  onPress: () => void;
}

export function GrowthThemeChip({ label, emoji, selected, onPress }: Props) {
  const { colors } = useThemeColors();
  const { pressed, pressProps } = usePressed();
  return (
    <Pressable
      accessibilityLabel={`${label} theme`}
      accessibilityRole='button'
      accessibilityState={{ selected }}
      {...pressProps}
      style={{
        flex: 1,
        minHeight: 44,
        borderRadius: 999,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        paddingHorizontal: 10,
        backgroundColor: selected ? colors.primary[100] : colors.card,
        borderWidth: selected ? 2 : 1,
        borderColor: selected ? colors.primary[500] : colors.cardBorder,
        opacity: pressed ? 0.92 : 1,
      }}
      onPress={onPress}
    >
      <Text style={{ fontSize: 14 }}>{emoji}</Text>
      <Text
        numberOfLines={1}
        style={{
          ...typography.caption,
          fontWeight: fontWeights.bold,
          color: selected ? colors.primary[700] : colors.text.secondary,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
