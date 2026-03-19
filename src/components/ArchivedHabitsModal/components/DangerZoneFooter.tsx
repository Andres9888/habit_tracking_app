import { Text, View } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { AnimatedPressable } from '../../ui';

interface DangerZoneFooterProps {
  habitCount: number;
  onDeleteAll: () => void;
}

const LIGHT_DANGER = { bg: '#FEF2F2', border: '#FECACA', text: '#DC2626' };
const DARK_DANGER = { bg: '#7F1D1D', border: '#991B1B', text: '#FCA5A5' };

export function DangerZoneFooter({ habitCount, onDeleteAll }: DangerZoneFooterProps) {
  const { isDark } = useThemeColors();

  if (habitCount <= 1) return null;

  const danger = isDark ? DARK_DANGER : LIGHT_DANGER;

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
          fontWeight: '600',
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
        <Trash2 color={danger.text} size={16} strokeWidth={2.5} />
        <Text style={{ fontSize: 14, fontWeight: '600', color: danger.text }}>
          Delete All Archived
        </Text>
      </AnimatedPressable>

      <Text
        style={{
          fontSize: 13,
          color: isDark ? '#9CA3AF' : '#78716C',
          marginTop: 4,
          textAlign: 'center',
        }}
      >
        Permanently remove {habitCount} habits and all tracking data
      </Text>
    </View>
  );
}
