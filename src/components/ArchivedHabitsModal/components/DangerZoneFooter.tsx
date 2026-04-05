import { Text, View } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '../../../theme/ThemeContext';
import { typography, fontWeights } from '@/theme/typography';
import { AnimatedPressable } from '../../ui';

interface DangerZoneFooterProps {
  habitCount: number;
  onDeleteAll: () => void;
}

export function DangerZoneFooter({ habitCount, onDeleteAll }: DangerZoneFooterProps) {
  const { colors, isDark } = useThemeColors();

  if (habitCount <= 1) return null;

  const danger = {
    bg: colors.status.errorLight,
    border: colors.status.error,
    text: isDark ? colors.status.errorText : colors.status.error,
  };

  return (
    <View
      style={{
        marginTop: 12,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderStyle: 'dashed',
        backgroundColor: danger.bg,
        borderColor: danger.border,
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          fontSize: 10,
          fontWeight: fontWeights.semibold,
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          color: danger.text,
          opacity: 0.6,
          marginBottom: 10,
        }}
      >
        DANGER ZONE
      </Text>

      <AnimatedPressable
        accessibilityLabel='Delete all archived habits'
        accessibilityRole='button'
        className='flex-row items-center justify-center gap-2 rounded-xl px-4 py-3'
        style={{ width: '100%' }}
        onPress={onDeleteAll}
      >
        <Trash2 color={danger.text} size={iconSizes.small} strokeWidth={2.5} />
        <Text style={{ ...typography.bodySmall, fontWeight: fontWeights.semibold, color: danger.text }}>
          Delete All Archived
        </Text>
      </AnimatedPressable>

      <Text
        style={{
          ...typography.caption,
          color: colors.text.secondary,
          marginTop: 4,
          textAlign: 'center',
        }}
      >
        Permanently remove {habitCount} habits and all tracking data
      </Text>
    </View>
  );
}
