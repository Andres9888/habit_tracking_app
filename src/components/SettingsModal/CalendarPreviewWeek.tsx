/**
 * CalendarPreviewWeek — sample week rendered with the real ChainDayItem so the
 * settings preview is pixel-identical to a habit card on the list.
 */
import { View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { ChainDayItem } from '../HabitChainVisualizer/ChainDayItem';
import type { CompletionIcon, DayShape } from '../HabitChainVisualizer/types';

/** A representative span: a four-day streak building strength, then rest days. */
export const PREVIEW_STRENGTH_PERCENT = 92;

const DAYS = [
  { completed: true, strength: 35 },
  { completed: true, strength: 55 },
  { completed: true, strength: 75 },
  { completed: true, strength: PREVIEW_STRENGTH_PERCENT },
  { completed: false, strength: 0 },
  { completed: false, strength: 0 },
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
