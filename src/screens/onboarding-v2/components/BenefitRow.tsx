import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

interface BenefitRowProps {
  icon: string;
  benefit: string;
  feature: string;
}

export function BenefitRow({ icon, benefit, feature }: BenefitRowProps) {
  const { colors } = useThemeColors();

  return (
    <View style={{ alignItems: 'flex-start', flexDirection: 'row', gap: 10, marginTop: 12 }}>
      <View
        style={{
          alignItems: 'center',
          backgroundColor: '#FEF3C7',
          borderRadius: 6,
          height: 26,
          justifyContent: 'center',
          width: 26,
        }}
      >
        <Text style={{ fontSize: 14 }}>{icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: colors.text.primary,
            fontSize: 14,
            fontWeight: '800',
            letterSpacing: -0.2,
            lineHeight: 19,
          }}
        >
          {benefit}
        </Text>
        <Text
          style={{
            color: colors.text.secondary,
            fontSize: 13,
            lineHeight: 18,
            marginTop: 2,
          }}
        >
          {feature}
        </Text>
      </View>
    </View>
  );
}
