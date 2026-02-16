import { View, Text } from 'react-native';
import { Trophy, Sparkles } from 'lucide-react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { ColorScheme } from '../types';

interface StatsGridProps {
  totalCompleted: number;
  totalPossible: number;
  perfectDays: number;
  colors: ColorScheme;
}

export function StatsGrid({
  totalCompleted,
  totalPossible,
  perfectDays,
  colors,
}: StatsGridProps) {
  const { colors: themeColors, isDark } = useThemeColors();
  const cardBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.6)';

  return (
    <View className='flex-row gap-3'>
      {/* Total Completed */}
      <View
        className='flex-1 rounded-2xl p-3'
        style={{ backgroundColor: cardBg }}
      >
        <View className='mb-1 flex-row items-center gap-1.5'>
          <Trophy color={colors.accent} size={14} />
          <Text
            className='text-[10px] font-medium uppercase'
            style={{ color: colors.accent }}
          >
            Completed
          </Text>
        </View>
        <Text className='text-[22px] font-bold' style={{ color: colors.text }}>
          {totalCompleted}
        </Text>
        <Text className='text-[10px] font-medium' style={{ color: themeColors.text.tertiary }}>
          of {totalPossible} habits
        </Text>
      </View>

      {/* Perfect Days */}
      <View
        className='flex-1 rounded-2xl p-3'
        style={{ backgroundColor: cardBg }}
      >
        <View className='mb-1 flex-row items-center gap-1.5'>
          <Sparkles color={colors.accent} size={14} />
          <Text
            className='text-[10px] font-medium uppercase'
            style={{ color: colors.accent }}
          >
            Perfect Days
          </Text>
        </View>
        <Text className='text-[22px] font-bold' style={{ color: colors.text }}>
          {perfectDays}
        </Text>
        <Text className='text-[10px] font-medium' style={{ color: themeColors.text.tertiary }}>
          100% completion
        </Text>
      </View>
    </View>
  );
}
