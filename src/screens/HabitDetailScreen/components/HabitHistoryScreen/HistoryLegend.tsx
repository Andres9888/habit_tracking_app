/**
 * HistoryLegend — square swatches for the day states the current month
 * actually shows. A month with no paused days does not explain "Paused".
 */
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import type { HabitDayState } from '../../../../features/habits/habitDayState';
import { type InsightPalette, useInsightPalette } from '../../insightPalette';

const SWATCH = 14;

function Swatch({
  borderColor,
  borderStyle,
  faded,
  fill,
}: {
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed';
  faded?: boolean;
  fill?: string;
}) {
  return (
    <View
      style={{
        backgroundColor: fill,
        borderColor: borderColor ?? 'transparent',
        borderRadius: 4,
        borderStyle: borderStyle ?? 'solid',
        borderWidth: borderColor ? 1.5 : 0,
        height: SWATCH,
        opacity: faded ? 0.55 : 1,
        width: SWATCH,
      }}
    />
  );
}

function Item({ children, swatch }: { children: string; swatch: ReactNode }) {
  const palette = useInsightPalette();
  return (
    <View style={{ alignItems: 'center', flexDirection: 'row', gap: 6 }}>
      {swatch}
      <Text style={{ color: palette.textTertiary, fontSize: 11 }}>
        {children}
      </Text>
    </View>
  );
}

interface LegendItem {
  label: string;
  state: HabitDayState;
  swatch: (palette: InsightPalette) => ReactNode;
}

const ITEMS: readonly LegendItem[] = [
  { label: 'Completed', state: 'completed', swatch: (p) => <Swatch fill={p.green} /> },
  {
    label: 'Missed',
    state: 'missed',
    swatch: (p) => <Swatch borderColor={p.missedRing} borderStyle='dashed' />,
  },
  { label: 'Today', state: 'open-today', swatch: (p) => <Swatch borderColor={p.green} /> },
  { label: 'Paused', state: 'paused', swatch: (p) => <Swatch fill={p.greenSoft} /> },
  { label: 'Not scheduled', state: 'unscheduled', swatch: (p) => <Swatch fill={p.cellFuture} /> },
  { label: 'Upcoming', state: 'upcoming', swatch: (p) => <Swatch faded fill={p.cellFuture} /> },
  {
    label: 'Before start',
    state: 'before-creation',
    swatch: (p) => <Swatch faded fill={p.cellFuture} />,
  },
];

export function HistoryLegend({
  states,
}: {
  states: ReadonlySet<HabitDayState>;
}) {
  const palette = useInsightPalette();
  const shown = ITEMS.filter((item) => states.has(item.state));
  if (shown.length === 0) return null;
  return (
    <View
      style={{
        borderTopColor: palette.divider,
        borderTopWidth: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 14,
        marginTop: 12,
        paddingTop: 14,
      }}
    >
      {shown.map((item) => (
        <Item key={item.state} swatch={item.swatch(palette)}>
          {item.label}
        </Item>
      ))}
    </View>
  );
}
