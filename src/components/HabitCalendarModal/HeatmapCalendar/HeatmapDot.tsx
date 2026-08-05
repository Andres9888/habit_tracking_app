import { View } from 'react-native';

interface HeatmapDotProps {
  isCompleted: boolean;
  isFuture: boolean;
}

export function HeatmapDot({ isCompleted, isFuture }: HeatmapDotProps) {
  const backgroundColor = isFuture
    ? '#e7e5e4'
    : isCompleted
      ? '#10b981'
      : '#d6d3d1';

  return (
    <View
      className='h-1.5 w-1.5 rounded-full'
      style={{ backgroundColor }}
    />
  );
}
