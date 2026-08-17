import { Pressable, Text } from 'react-native';
import { Check } from 'lucide-react-native';
import { BAND_FG, useInsightPalette } from '../../insightPalette';

interface HeroCompleteBarProps {
  disabled: boolean;
  onPress: () => void;
}

export function HeroCompleteBar({ disabled, onPress }: HeroCompleteBarProps) {
  const palette = useInsightPalette();

  return (
    <Pressable
      accessibilityLabel='Complete today'
      accessibilityRole='button'
      disabled={disabled}
      style={{
        alignItems: 'center',
        backgroundColor: palette.green,
        borderRadius: 17,
        flexDirection: 'row',
        gap: 9,
        height: 56,
        justifyContent: 'center',
        opacity: disabled ? 0.6 : 1,
        shadowColor: palette.green,
        shadowOffset: { height: 10, width: 0 },
        shadowOpacity: 0.38,
        shadowRadius: 12,
      }}
      onPress={onPress}
    >
      <Check color={BAND_FG} size={20} strokeWidth={2.2} />
      <Text
        style={{
          color: BAND_FG,
          fontSize: 17,
          fontWeight: '600',
          letterSpacing: -0.1,
        }}
      >
        Complete today
      </Text>
    </Pressable>
  );
}
