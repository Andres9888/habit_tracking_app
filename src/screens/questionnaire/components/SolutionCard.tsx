/**
 * SolutionCard - A pain-to-solution card for screen 6.
 *
 * Displays an emoji with a title and description, accented
 * by a 4px left border bar in the primary color.
 */

import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

export interface SolutionCardProps {
  description: string;
  emoji: string;
  title: string;
}

export function SolutionCard({ description, emoji, title }: SolutionCardProps) {
  const { colors } = useThemeColors();

  return (
    <View
      className="flex-row overflow-hidden rounded-2xl"
      style={{ backgroundColor: colors.card }}
    >
      <View
        className="w-1"
        style={{ backgroundColor: colors.primary[600] }}
      />
      <View className="flex-1 flex-row items-start px-4 py-3.5">
        <Text className="text-2xl">{emoji}</Text>
        <View className="ml-3 flex-1">
          <Text
            className="text-base font-semibold"
            style={{ color: colors.text.primary }}
          >
            {title}
          </Text>
          <Text
            className="mt-1 text-sm leading-5"
            style={{ color: colors.text.secondary }}
          >
            {description}
          </Text>
        </View>
      </View>
    </View>
  );
}
