import { View, Text, Animated } from 'react-native';
import { Star, ChevronRight } from 'lucide-react-native';
import type { ColorScheme } from '../types';

interface CardHeaderProps {
  colors: ColorScheme;
  starRotation: Animated.AnimatedInterpolation<string>;
  onViewDetails?: () => void;
}

export function CardHeader({
  colors,
  starRotation,
  onViewDetails,
}: CardHeaderProps) {
  return (
    <View className='flex-row items-center justify-between px-5 pt-5'>
      <View className='flex-row items-center gap-2'>
        <Animated.View style={{ transform: [{ rotate: starRotation }] }}>
          <Star color={colors.accent} fill={colors.accent} size={18} />
        </Animated.View>
        <Text
          className='text-[13px] font-bold uppercase tracking-wider'
          style={{ color: colors.text }}
        >
          Week in Review
        </Text>
      </View>
      {onViewDetails && (
        <View className='flex-row items-center gap-1'>
          <Text
            className='text-[13px] font-medium'
            style={{ color: colors.accent }}
          >
            Details
          </Text>
          <ChevronRight color={colors.accent} size={14} />
        </View>
      )}
    </View>
  );
}
