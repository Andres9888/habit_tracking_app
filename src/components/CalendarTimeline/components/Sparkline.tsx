import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

interface SparklineProps {
  completionByDay: Record<string, { completed: number; total: number }>;
  width?: number;
  height?: number;
}

const COLORS = {
  line: '#10b981', // emerald-500
  dot: '#059669', // emerald-600
  area: '#10b98120', // emerald-500 @ 12%
};

const DEFAULTS = { width: 80, height: 24 };

/** Mini SVG sparkline showing completion rate trend over visible days */
export const Sparkline: React.FC<SparklineProps> = ({
  completionByDay,
  width = DEFAULTS.width,
  height = DEFAULTS.height,
}) => {
  const sortedKeys = Object.keys(completionByDay).sort();
  if (sortedKeys.length < 2) return <View style={{ width, height }} />;

  const rates = sortedKeys.map((key) => {
    const day = completionByDay[key];
    return day.total > 0 ? day.completed / day.total : 0;
  });

  const padX = 3;
  const padY = 3;
  const plotW = width - padX * 2;
  const plotH = height - padY * 2;
  const step = plotW / (rates.length - 1);

  const points = rates.map((rate, i) => ({
    x: padX + i * step,
    y: padY + plotH * (1 - rate),
  }));

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`)
    .join(' ');

  const areaPath = `${linePath} L ${points.at(-1)?.x},${height} L ${points[0].x},${height} Z`;
  const lastPoint = points.at(-1);

  return (
    <View style={{ width, height }}>
      <Svg height={height} width={width}>
        <Path d={areaPath} fill={COLORS.area} />
        <Path d={linePath} fill='none' stroke={COLORS.line} strokeWidth={1.5} />
        {lastPoint && (
          <Circle cx={lastPoint.x} cy={lastPoint.y} fill={COLORS.dot} r={2} />
        )}
      </Svg>
    </View>
  );
};
