import type { ReactNode } from 'react';
import { View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import type { GestureType } from 'react-native-gesture-handler';
import type { ConnectorStyle } from '../../../../convex/settings/types';
import { AnimatedWeeksGrid } from './AnimatedWeeksGrid';
import type { DayData } from './types';
import { WeekdayHeaderRow } from './WeekdayHeaderRow';

interface MonthWeeksSectionProps {
  completedBg: string;
  connectorStyle: ConnectorStyle;
  direction: 'left' | 'right';
  habitColor: string;
  labelColor: string;
  monthKey: string;
  monthSwipeGesture: GestureType;
  onPress: (dateString: string, completed: boolean) => void;
  pendingToggleDate: string | null;
  shape: 'circle' | 'square';
  surfaceBg: string;
  textColors: {
    inverse: string;
    muted: string;
    primary: string;
    tertiary: string;
  };
  useSolidCompletedFill: boolean;
  weeks: DayData[][];
}

export function MonthWeeksSection(p: MonthWeeksSectionProps): ReactNode {
  return (
    <GestureDetector gesture={p.monthSwipeGesture}>
      <View collapsable={false}>
        <WeekdayHeaderRow labelColor={p.labelColor} />
        <AnimatedWeeksGrid
          completedBg={p.completedBg}
          connectorStyle={p.connectorStyle}
          direction={p.direction}
          habitColor={p.habitColor}
          monthKey={p.monthKey}
          pendingToggleDate={p.pendingToggleDate}
          shape={p.shape}
          surfaceBg={p.surfaceBg}
          textColors={p.textColors}
          useSolidCompletedFill={p.useSolidCompletedFill}
          weeks={p.weeks}
          onPress={p.onPress}
        />
      </View>
    </GestureDetector>
  );
}
