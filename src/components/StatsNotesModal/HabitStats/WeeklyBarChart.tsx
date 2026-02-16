/**
 * Weekly bar chart for HabitStats
 */

import { format, parseISO } from 'date-fns';
import { Text, View } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import { colors } from '@/theme/colors';
import type { ChartDataItem } from './HabitStats.types';

/** Parse YYYY-MM-DD as local date using date-fns parseISO (handles TZ correctly) */
const parseDate = (d: string) => parseISO(d);

interface WeeklyBarChartProps {
  data: ChartDataItem[];
}

const CHART_WIDTH = 300;
const CHART_HEIGHT = 120;

export function WeeklyBarChart({ data }: WeeklyBarChartProps) {
  if (data.length === 0) {
    return null;
  }

  const barWidth = CHART_WIDTH / data.length - 8;
  const maxHeight = CHART_HEIGHT - 30;

  return (
    <View className='items-center'>
      <Svg height={CHART_HEIGHT} width={CHART_WIDTH}>
        {data.map((item, index) => {
          const x = index * (CHART_WIDTH / data.length) + 4;
          const barHeight = item.completed ? maxHeight : 10;
          const y = CHART_HEIGHT - barHeight - 20;

          return (
            <View key={item.date}>
              <Rect
                fill={item.completed ? colors.primary[400] : colors.gray[200]}
                height={barHeight}
                rx={4}
                width={barWidth}
                x={x}
                y={y}
              />
              <SvgText
                fill={colors.gray[500]}
                fontSize='10'
                textAnchor='middle'
                x={x + barWidth / 2}
                y={CHART_HEIGHT - 5}
              >
                {format(parseDate(item.date), 'EEE')[0]}
              </SvgText>
            </View>
          );
        })}
      </Svg>
      <Text className='mt-2 text-xs text-stone-500'>
        {format(parseDate(data[0].date), 'MMM d')} -{' '}
        {format(parseDate(data.at(-1)?.date ?? data[0].date), 'MMM d')}
      </Text>
    </View>
  );
}
