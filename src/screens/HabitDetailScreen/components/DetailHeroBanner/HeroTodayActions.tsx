/**
 * HeroTodayActions — Complete today on the paper page, then a fixed-height
 * note or Undo row so History / Analytics never jump between states.
 */
import { Pressable, Text, View } from 'react-native';
import { Undo2 } from 'lucide-react-native';
import { useInsightPalette } from '../../insightPalette';
import { DetailCompleteButton } from '../DetailCompleteButton';

interface HeroTodayActionsProps {
  isCompletedToday: boolean;
  isToggling: boolean;
  onToggleToday: () => void;
}

export function HeroTodayActions({
  isCompletedToday,
  isToggling,
  onToggleToday,
}: HeroTodayActionsProps) {
  const palette = useInsightPalette();

  return (
    <View style={{ gap: 8, paddingBottom: 4, paddingTop: 11 }}>
      <DetailCompleteButton
        disabled={isToggling}
        isCompletedToday={isCompletedToday}
        tone='onBand'
        onPress={onToggleToday}
      />
      {isCompletedToday ? (
        <Pressable
          accessibilityLabel='Undo today’s check-in'
          accessibilityRole='button'
          disabled={isToggling}
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            gap: 7,
            height: 48,
            justifyContent: 'center',
          }}
          onPress={onToggleToday}
        >
          <Undo2 color={palette.textTertiary} size={17} strokeWidth={2} />
          <Text
            style={{
              color: palette.textSecondary,
              fontSize: 15,
              fontWeight: '500',
            }}
          >
            Undo
          </Text>
        </Pressable>
      ) : (
        <Text
          style={{
            color: palette.textTertiary,
            fontSize: 13,
            height: 48,
            lineHeight: 48,
            textAlign: 'center',
          }}
        >
          Logs today’s date. You can undo anytime.
        </Text>
      )}
    </View>
  );
}
