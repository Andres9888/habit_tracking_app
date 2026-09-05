/** One theme pill in the Growth icons theme row. */
import { Pressable, Text } from 'react-native';
import { fontWeights, typography } from '@/theme/typography';
import { usePanelTokens } from './panel/panelTokens';
import { usePressed } from './usePressed';

interface Props {
  emoji: string;
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function GrowthThemePill({ emoji, label, selected, onPress }: Props) {
  const t = usePanelTokens();
  const { pressed, pressProps } = usePressed();
  const hue = t.hues.growth;
  return (
    <Pressable
      accessibilityLabel={`${label} theme`}
      accessibilityRole='button'
      accessibilityState={{ selected }}
      {...pressProps}
      style={{
        flex: 1,
        minWidth: 0,
        minHeight: 44,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingHorizontal: 6,
        backgroundColor: selected ? hue.tile : t.chipRestBg,
        borderWidth: selected ? 2 : 1,
        borderColor: selected ? hue.ink : t.chipRestBorder,
        opacity: pressed ? 0.9 : 1,
      }}
      onPress={onPress}
    >
      <Text allowFontScaling={false} style={{ fontSize: 14 }}>
        {emoji}
      </Text>
      <Text
        allowFontScaling={false}
        numberOfLines={1}
        style={{
          ...typography.label,
          fontSize: 12,
          fontWeight: selected ? fontWeights.bold : fontWeights.semibold,
          color: selected ? hue.ink : t.textPrimary,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
