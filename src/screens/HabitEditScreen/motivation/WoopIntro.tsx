import { Text, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { fontWeights, typography } from '../../../theme/typography';
import { COPY } from './MotivationSection.constants';

export function WoopIntro() {
  const { colors } = useThemeColors();

  return (
    <View
      style={{
        backgroundColor: colors.primary[100],
        borderColor: colors.border,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 14,
        paddingVertical: 13,
      }}
    >
      <Text
        style={{
          ...typography.caption,
          color: colors.primary[700],
          fontWeight: fontWeights.bold,
          letterSpacing: 0.8,
          textTransform: 'uppercase',
        }}
      >
        {COPY.woopLabel}
      </Text>
      <Text
        style={{
          ...typography.bodySmall,
          color: colors.text.secondary,
          marginTop: 4,
        }}
      >
        {COPY.woopBody}
      </Text>
    </View>
  );
}
