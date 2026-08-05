import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { fontFamilies, fontWeights, typography } from '../../../../theme/typography';

interface TimerBandProps {
  elapsedSec: number;
  habitColor: string;
  onStop: () => void;
}

function formatMmSs(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function TimerBand({ elapsedSec, habitColor, onStop }: TimerBandProps) {
  const { colors } = useThemeColors();
  return (
    <View
      className='mb-3.5'
      style={{
        backgroundColor: `${habitColor}14`,
        borderColor: `${habitColor}55`,
        borderRadius: 14,
        borderWidth: 1,
        padding: 14,
      }}
    >
      <View className='flex-row items-center justify-between'>
        <View>
          <View className='flex-row items-center' style={{ gap: 6 }}>
            <View
              style={{ backgroundColor: habitColor, borderRadius: 99, height: 7, width: 7 }}
            />
            <Text
              style={{
                ...typography.caption,
                color: habitColor,
                fontWeight: fontWeights.bold,
                letterSpacing: 1.2,
                textTransform: 'uppercase',
              }}
            >
              Recording
            </Text>
          </View>
          <Text
            style={{
              color: colors.text.primary,
              fontFamily: fontFamilies.monospace,
              fontSize: 32,
              fontWeight: fontWeights.bold,
              letterSpacing: -0.5,
              marginTop: 4,
            }}
          >
            {formatMmSs(elapsedSec)}
          </Text>
        </View>
        <Pressable
          accessibilityLabel='Stop timer and log time'
          accessibilityRole='button'
          style={{
            alignItems: 'center',
            backgroundColor: habitColor,
            borderRadius: 12,
            flexDirection: 'row',
            gap: 6,
            paddingHorizontal: 18,
            paddingVertical: 10,
          }}
          onPress={onStop}
        >
          <View style={{ backgroundColor: '#fff', borderRadius: 2, height: 11, width: 11 }} />
          <Text style={{ color: '#fff', fontSize: 13, fontWeight: fontWeights.bold }}>Stop</Text>
        </Pressable>
      </View>
    </View>
  );
}
