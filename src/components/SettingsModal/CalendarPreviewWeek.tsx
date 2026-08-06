/**
 * CalendarPreviewWeek — sample week rendered with the real ChainDayItem so the
 * settings preview is pixel-identical to a habit card on the list.
 */
import { View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { ChainDayItem } from '../HabitChainVisualizer/ChainDayItem';
import type { CompletionIcon, DayShape } from '../HabitChainVisualizer/types';

/** A full Monday-start week so the weekday letters in CalendarPreviewLegend
 *  line up: strength climbs, dips on the one missed day, then recovers to its
 *  peak on the last day — which is what the legend's caption describes. */
export const PREVIEW_STRENGTH_PERCENT = 92;

const DAYS = [
  { completed: true, strength: 35 },
  { completed: true, strength: 50 },
  { completed: true, strength: 64 },
  { completed: true, strength: 76 },
  { completed: false, strength: 68 },
  { completed: true, strength: 80 },
  { completed: true, strength: PREVIEW_STRENGTH_PERCENT },
];

interface Props {
  accentColor: string;
  dayShape: DayShape;
  completionIcon: CompletionIcon;
  connectorStyle: 'none' | 'small' | 'full';
}

// Static preview: the cells are display-only, so a shared no-op keeps every
// ChainDayItem's memo intact.
const noop = () => {};

export function CalendarPreviewWeek(p: Props) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <View className='flex-row'>
      {DAYS.map((d, i) => (
        <ChainDayItem
          key={i}
          accentColor={p.accentColor}
          accessibilityHint=''
          accessibilityLabel=''
          burstActive={false}
          completed={d.completed}
          completionIcon={p.completionIcon}
          dateString={`preview-${i}`}
          disabled={false}
          index={i}
          isToday={false}
          missed={false}
          shape={p.dayShape}
          shouldReduceMotion={reduceMotion}
          showConnector={Boolean(
            p.connectorStyle !== 'none' && d.completed && DAYS[i + 1]?.completed
          )}
          strengthPercent={d.strength}
          onBurstComplete={noop}
          onToggle={noop}
        />
      ))}
    </View>
  );
}
