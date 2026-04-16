import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { typography, fontWeights } from '@/theme/typography';
import { getRelativeTime } from '../utils';

interface HabitCardHeaderProps {
  name: string;
  icon?: string;
  iconColor?: string;
  archiveDate: number;
  accentColor: string;
}

export function HabitCardHeader({ name, icon, accentColor, archiveDate }: HabitCardHeaderProps) {
  const { colors, isDark } = useThemeColors();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 }}>
      <View
        style={{
          width: 44, height: 44, borderRadius: 14,
          backgroundColor: `${accentColor}14`,
          alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 24, lineHeight: 28 }}>{icon || '📝'}</Text>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          numberOfLines={1}
          style={{ fontFamily: 'DMSans', fontSize: 16, fontWeight: fontWeights.semibold, color: colors.text.primary, letterSpacing: -0.2, lineHeight: 20 }}
        >
          {name}
        </Text>
        <Text style={{ fontFamily: 'DMSans', fontSize: 12, lineHeight: 16, color: isDark ? colors.gray[400] : '#B5AFA8', marginTop: 3, letterSpacing: 0.1 }}>
          Archived {getRelativeTime(archiveDate)}
        </Text>
      </View>
    </View>
  );
}
