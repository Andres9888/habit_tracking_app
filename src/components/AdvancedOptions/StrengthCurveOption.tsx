/** One Gentle/Balanced/Strict option row in the Strength Curve sheet. */
import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { fontWeights, typography } from '@/theme/typography';
import { usePressed } from './usePressed';

interface Props {
  name: string;
  desc: string;
  active: boolean;
  onPress: () => void;
}

export function StrengthCurveOption({ name, desc, active, onPress }: Props) {
  const { colors } = useThemeColors();
  const { pressed, pressProps } = usePressed();
  return (
    <Pressable
      accessibilityRole='button'
      accessibilityState={{ selected: active }}
      {...pressProps}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 14,
        backgroundColor: active ? colors.primary[100] : colors.card,
        borderWidth: active ? 2 : 1,
        borderColor: active ? colors.primary[500] : colors.cardBorder,
        opacity: pressed ? 0.92 : 1,
      }}
      onPress={onPress}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{
            ...typography.body,
            fontSize: 15,
            fontWeight: fontWeights.bold,
            color: active ? colors.primary[700] : colors.text.primary,
          }}
        >
          {name}
        </Text>
        <Text
          style={{
            ...typography.caption,
            fontSize: 12,
            color: colors.text.secondary,
            marginTop: 2,
            lineHeight: 16,
          }}
        >
          {desc}
        </Text>
      </View>
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 999,
          borderWidth: 2,
          borderColor: active ? colors.primary[700] : colors.cardBorder,
          backgroundColor: active ? colors.primary[600] : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {active ? (
          <Text
            style={{
              color: colors.text.inverse,
              fontSize: 12,
              fontWeight: fontWeights.bold,
            }}
          >
            ✓
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
