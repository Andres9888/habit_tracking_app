/**
 * Weekly bar chart for HabitStats
 */

import { format } from 'date-fns';
import { Text, View } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import type { ChartDataItem } from './HabitStats.types';

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
                fill={item.completed ? '#48bb78' : '#dde3ed'}
                height={barHeight}
                rx={4}
                width={barWidth}
                x={x}
                y={y}
              />
              <SvgText
                fill='#78716c'
                fontSize='10'
                textAnchor='middle'
                x={x + barWidth / 2}
                y={CHART_HEIGHT - 5}
              >
                {format(new Date(item.date), 'EEE')[0]}
              </SvgText>
            </View>
          );
        })}
      </Svg>
      <Text className='mt-2 text-xs text-stone-500'>
        {format(new Date(data[0].date), 'MMM d')} -{' '}
        {format(new Date(data[data.length - 1].date), 'MMM d')}
      </Text>
    </View>
  );
}
