import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface StrengthBackgroundProps {
  strength: number;
  gradientColor: string;
}

export function StrengthBackground({
  strength,
  gradientColor,
}: StrengthBackgroundProps) {
  return (
    <View
      className='absolute inset-0'
      style={{ width: `${Math.min(strength, 100)}%` }}
    >
      <LinearGradient
        colors={[
          `${gradientColor}20`,
          `${gradientColor}08`,
          `${gradientColor}00`,
        ]}
        end={{ x: 1, y: 0.5 }}
        start={{ x: 0, y: 0.5 }}
        style={{ flex: 1 }}
      />
    </View>
  );
}
