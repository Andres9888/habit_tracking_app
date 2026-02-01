/**
 * 30-day trend line chart for HabitStats
 */

import { format } from 'date-fns';
import { Text, View } from 'react-native';
import Svg, { Line, Circle, Text as SvgText } from 'react-native-svg';
import type { ChartDataItem } from './HabitStats.types';

interface TrendLineChartProps {
  data: ChartDataItem[];
}

const CHART_WIDTH = 300;
const CHART_HEIGHT = 100;
const POINT_RADIUS = 3;

export function TrendLineChart({ data }: TrendLineChartProps) {
  if (data.length === 0) {
    return null;
  }

  const denominator = Math.max(1, data.length - 1);
  const points = data.map((item, index) => ({
    completed: item.completed,
    x: (index / denominator) * CHART_WIDTH,
    y: item.completed ? 20 : CHART_HEIGHT - 20,
  }));

  return (
    <View className='items-center'>
      <Svg height={CHART_HEIGHT} width={CHART_WIDTH}>
        {/* Grid lines */}
        <Line
          stroke='#e7e5e4'
          strokeDasharray='4,4'
          strokeWidth='1'
          x1='0'
          x2={CHART_WIDTH}
          y1={CHART_HEIGHT / 2}
          y2={CHART_HEIGHT / 2}
        />

        {/* Line path */}
        <Line
          stroke='#d6d3d1'
          strokeWidth='1'
          x1={points[0]?.x ?? 0}
          x2={points.at(-1)?.x ?? 0}
          y1={points[0]?.y ?? 0}
          y2={points.at(-1)?.y ?? 0}
        />

        {/* Points */}
        {points.map((point, index) => (
          <Circle
            key={index}
            cx={point.x}
            cy={point.y}
            fill={point.completed ? '#48bb78' : '#dde3ed'}
            r={POINT_RADIUS}
            stroke={point.completed ? '#48bb78' : '#a8a29e'}
            strokeWidth='1.5'
          />
        ))}

        {/* Labels */}
        <SvgText fill='#78716c' fontSize='10' textAnchor='start' x='0' y='15'>
          ✓
        </SvgText>
        <SvgText
          fill='#78716c'
          fontSize='10'
          textAnchor='start'
          x='0'
          y={CHART_HEIGHT - 10}
        >
          ✗
        </SvgText>
      </Svg>
      <Text className='mt-2 text-xs text-stone-500'>
        {format(new Date(data[0].date), 'MMM d')} -{' '}
        {format(new Date(data[data.length - 1].date), 'MMM d')}
      </Text>
    </View>
  );
}
