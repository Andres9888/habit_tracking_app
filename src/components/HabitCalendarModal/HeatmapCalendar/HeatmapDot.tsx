import { View } from 'react-native';

interface HeatmapDotProps {
  isCompleted: boolean;
  isFuture: boolean;
  isRestDay?: boolean;
}

export function HeatmapDot({ isCompleted, isFuture, isRestDay }: HeatmapDotProps) {
  const backgroundColor = isFuture
    ? '#e7e5e4'
    : isCompleted
      ? '#10b981'
      : isRestDay
        ? '#60a5fa'
        : '#d6d3d1';

  return (
    <View
      className='h-1.5 w-1.5 rounded-full'
      style={{ backgroundColor }}
    />
  );
}
