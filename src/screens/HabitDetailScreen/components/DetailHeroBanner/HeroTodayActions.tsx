/**
 * HeroTodayActions — Complete today, then a fixed-height caption or
 * Undo / Add a note pair so History / Analytics never jump.
 */
import { Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { BAND_GREEN, useInsightPalette } from '../../insightPalette';
import { HeroActionPair } from './HeroActionPair';
import { HeroCompleteBar } from './HeroCompleteBar';

interface HeroTodayActionsProps {
  isCompletedToday: boolean;
  isScheduledToday: boolean;
  isToggling: boolean;
  todayNote?: string;
  onOpenNote: () => void;
  onToggleToday: () => void;
}

export function HeroTodayActions({
  isCompletedToday,
  isScheduledToday,
  isToggling,
  todayNote,
  onOpenNote,
  onToggleToday,
}: HeroTodayActionsProps) {
  const palette = useInsightPalette();

  return (
    <View style={{ gap: 8, paddingBottom: 4, paddingTop: 11 }}>
      {!isScheduledToday && !isCompletedToday ? (
        <View
          accessibilityLabel='Not scheduled today'
          accessibilityRole='text'
          style={{
            alignItems: 'center',
            backgroundColor: palette.cellFuture,
            borderColor: palette.cardBorder,
            borderRadius: 17,
            borderWidth: 1,
            height: 56,
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              color: palette.textSecondary,
              fontSize: 15,
              fontWeight: '600',
            }}
          >
            Not scheduled today
          </Text>
        </View>
      ) : isCompletedToday ? (
        <View
          accessibilityLabel='Done today'
          accessibilityRole='text'
          style={{
            alignItems: 'center',
            backgroundColor: palette.greenWash,
            borderColor: palette.bandHairline,
            borderRadius: 17,
            borderWidth: 1.5,
            flexDirection: 'row',
            gap: 9,
            height: 56,
            justifyContent: 'center',
          }}
        >
          <Check color={BAND_GREEN} size={20} strokeWidth={2.2} />
          <Text
            style={{
              color: BAND_GREEN,
              fontSize: 17,
              fontWeight: '600',
            }}
          >
            Done today
          </Text>
        </View>
      ) : (
        <HeroCompleteBar disabled={isToggling} onPress={onToggleToday} />
      )}
      {!isScheduledToday && !isCompletedToday ? (
        <Text
          style={{
            color: palette.textTertiary,
            fontSize: 12,
            height: 48,
            lineHeight: 48,
            textAlign: 'center',
          }}
        >
          No completion is required. History remains available below.
        </Text>
      ) : isCompletedToday ? (
        <HeroActionPair
          disabled={isToggling}
          noteLabel={todayNote ? 'Edit note' : 'Add a note'}
          onAddNote={onOpenNote}
          onUndo={onToggleToday}
        />
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
