import { Pressable, Text, View } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '@/theme/ThemeContext';
import { fontFamilies, fontWeights } from '@/theme/typography';
import { getRelativeTime } from '../utils';

interface HabitCardHeaderProps {
  name: string;
  icon?: string;
  iconColor?: string;
  archiveDate: number;
  accentColor: string;
  onDeletePress?: () => void;
  showDelete?: boolean;
}

export function HabitCardHeader({ name, icon, accentColor, archiveDate, onDeletePress, showDelete }: HabitCardHeaderProps) {
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
          style={{ fontFamily: fontFamilies.primary.text, fontSize: 16, fontWeight: fontWeights.semibold, color: colors.text.primary, letterSpacing: -0.2, lineHeight: 20 }}
        >
          {name}
        </Text>
        <Text style={{ fontFamily: fontFamilies.primary.text, fontSize: 12, lineHeight: 16, color: colors.text.tertiary, marginTop: 3, letterSpacing: 0.1 }}>
          Archived {getRelativeTime(archiveDate)}
        </Text>
      </View>
      {showDelete && onDeletePress && (
        <Pressable
          accessibilityLabel={`Delete ${name}`} accessibilityRole='button'
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={({ pressed }) => ({
            width: 32, height: 32, borderRadius: 10,
            alignItems: 'center', justifyContent: 'center',
            backgroundColor: pressed ? (isDark ? colors.status.error + '25' : '#FDEBEB') : 'transparent',
          })}
          onPress={onDeletePress}
        >
          <Trash2 color={isDark ? colors.gray[400] : '#C4BCB3'} size={iconSizes.small} strokeWidth={2} />
        </Pressable>
      )}
    </View>
  );
}
