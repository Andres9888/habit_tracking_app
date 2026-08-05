import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { fontWeights, typography } from '../../../../theme/typography';
import { formatDurationCompact } from './formatDuration';

interface TimerConfirmBandProps {
  recordedMinutes: number;
  habitColor: string;
  onDiscard: () => void;
  onLog: () => void;
}

export function TimerConfirmBand({
  recordedMinutes,
  habitColor,
  onDiscard,
  onLog,
}: TimerConfirmBandProps) {
  const { colors } = useThemeColors();
  return (
    <View
      className='mb-3.5'
      style={{
        backgroundColor: `${habitColor}10`,
        borderColor: `${habitColor}55`,
        borderRadius: 14,
        borderWidth: 1,
        padding: 14,
      }}
    >
      <View className='mb-3 flex-row items-center justify-between'>
        <View>
          <Text
            style={{
              ...typography.caption,
              color: habitColor,
              fontWeight: fontWeights.bold,
              letterSpacing: 1.2,
              textTransform: 'uppercase',
            }}
          >
            Recorded
          </Text>
          <Text
            style={{
              color: colors.text.primary,
              fontSize: 22,
              fontWeight: fontWeights.bold,
              marginTop: 2,
            }}
          >
            {formatDurationCompact(recordedMinutes)}
          </Text>
        </View>
        <Text style={{ ...typography.caption, color: colors.text.secondary, maxWidth: 140 }}>
          Log this session to today?
        </Text>
      </View>
      <View className='flex-row' style={{ gap: 8 }}>
        <Pressable
          accessibilityLabel='Discard timer session'
          accessibilityRole='button'
          className='flex-1 items-center'
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: 10,
            borderWidth: 1,
            paddingVertical: 10,
          }}
          onPress={onDiscard}
        >
          <Text style={{ ...typography.bodySmall, color: colors.text.secondary, fontWeight: fontWeights.semibold }}>
            Discard
          </Text>
        </Pressable>
        <Pressable
          accessibilityLabel='Log timer session to today'
          accessibilityRole='button'
          className='flex-1 items-center'
          style={{ backgroundColor: habitColor, borderRadius: 10, paddingVertical: 10 }}
          onPress={onLog}
        >
          <Text style={{ color: '#fff', fontSize: 13, fontWeight: fontWeights.bold }}>
            Log it
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
