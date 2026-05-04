import { Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { typography, fontFamilies, fontWeights } from '../../../../theme/typography';
import { formatDuration } from './formatDuration';

interface TotalRowProps {
  totalMinutes: number;
}

export function TotalRow({ totalMinutes }: TotalRowProps) {
  const { colors } = useThemeColors();
  const hasMinutes = totalMinutes > 0;

  return (
    <View className='mb-3 flex-row items-center' style={{ gap: 8 }}>
      <Text style={{ fontSize: 22, lineHeight: 32 }}>⏱️</Text>
      <Text
        style={{
          color: hasMinutes ? colors.text.primary : colors.text.tertiary,
          fontFamily: fontFamilies.monospace,
          fontSize: 28,
          fontWeight: fontWeights.bold,
          lineHeight: 32,
        }}
      >
        {formatDuration(totalMinutes)}
      </Text>
      <Text style={{ ...typography.caption, color: colors.text.secondary }}>
        total last 7 days
      </Text>
    </View>
  );
}
