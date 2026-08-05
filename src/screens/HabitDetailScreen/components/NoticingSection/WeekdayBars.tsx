/**
 * WeekdayBars — completion rate per weekday, amber on the weakest day.
 * Bars are proportional to rate, with a visible floor so a 0% day still reads
 * as a bar rather than as missing data.
 */
import { Text, View } from 'react-native';
import { borderRadius } from '../../../../theme/spacing';
import { fontWeights } from '../../../../theme/typography';
import type { WeekdayStat } from '../../insights';
import type { InsightPalette } from '../../insightPalette';

const MAX_HEIGHT = 60;
const MIN_HEIGHT = 6;

interface WeekdayBarsProps {
  bars: WeekdayStat[];
  palette: InsightPalette;
  weakestWeekday: number;
}

export function WeekdayBars({
  bars,
  palette,
  weakestWeekday,
}: WeekdayBarsProps) {
  return (
    <View
      accessibilityRole='image'
      accessibilityLabel={bars
        .map((bar) => `${bar.plural} ${Math.round(bar.rate * 100)} percent`)
        .join(', ')}
      style={{
        alignItems: 'flex-end',
        flexDirection: 'row',
        gap: 7,
        marginTop: 16,
      }}
    >
      {bars.map((bar) => {
        const isWeak = bar.weekday === weakestWeekday;
        const height = Math.max(MIN_HEIGHT, Math.round(bar.rate * MAX_HEIGHT));
        const fill = isWeak
          ? palette.amberBar
          : bar.rate >= 0.75
            ? palette.green
            : palette.greenSoft;
        return (
          <View
            key={bar.weekday}
            style={{ alignItems: 'center', flex: 1, gap: 8 }}
          >
            <View
              style={{
                backgroundColor: bar.scheduled === 0 ? palette.cellEmpty : fill,
                borderRadius: borderRadius.small,
                height: bar.scheduled === 0 ? MIN_HEIGHT : height,
                width: '100%',
              }}
            />
            <Text
              style={{
                color: isWeak ? palette.amber : palette.textTertiary,
                fontSize: 11,
                fontWeight: isWeak ? fontWeights.bold : fontWeights.regular,
              }}
            >
              {bar.short}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
