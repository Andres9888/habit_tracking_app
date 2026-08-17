/**
 * HistoryLegend — Completed / No entry / Today / Upcoming, as in the mock.
 */
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { useInsightPalette } from '../../insightPalette';

const SWATCH = 14;

function Swatch({
  borderColor,
  borderStyle,
  fill,
}: {
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed';
  fill?: string;
}) {
  return (
    <View
      style={{
        backgroundColor: fill,
        borderColor: borderColor ?? 'transparent',
        borderRadius: SWATCH / 2,
        borderStyle: borderStyle ?? 'solid',
        borderWidth: borderColor ? 1.5 : 0,
        height: SWATCH,
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

export function HistoryLegend() {
  const palette = useInsightPalette();

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
      <Item swatch={<Swatch fill={palette.green} />}>Completed</Item>
      <Item
        swatch={
          <Swatch borderColor={palette.missedRing} borderStyle='dashed' />
        }
      >
        No entry
      </Item>
      <Item swatch={<Swatch borderColor={palette.green} borderStyle='solid' />}>
        Today
      </Item>
      <Item
        swatch={
          <Swatch borderColor={palette.cardBorder} fill={palette.cellFuture} />
        }
      >
        Upcoming
      </Item>
    </View>
  );
}
