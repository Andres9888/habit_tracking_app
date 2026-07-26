import { Text, View } from 'react-native';
import type { SemanticColors } from '@/theme/darkColors';
import { typography } from '@/theme/typography';
import { SettingsCountBadge } from '../../SettingsModal/SettingsCountBadge';

interface ModalHeaderTitleProps {
  colors: SemanticColors;
  habitCount: number;
  isDark: boolean;
  subtitle: string;
}

export function ModalHeaderTitle({
  colors,
  habitCount,
  isDark,
  subtitle,
}: ModalHeaderTitleProps) {
  return (
    <View style={{ paddingHorizontal: 20, paddingBottom: 4 }}>
      <Text
        style={[
          typography.heading1,
          {
            color: colors.text.primary,
            letterSpacing: -0.5,
            fontSize: 24,
            lineHeight: 30,
          },
        ]}
      >
        Archived Habits
      </Text>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 6,
          marginTop: 6,
        }}
      >
        {habitCount > 0 ? <SettingsCountBadge count={habitCount} /> : null}
        <Text
          style={[
            typography.bodySmall,
            {
              color: isDark ? colors.gray[400] : '#9B958E',
              letterSpacing: -0.1,
            },
          ]}
        >
          {subtitle}
        </Text>
      </View>
    </View>
  );
}
