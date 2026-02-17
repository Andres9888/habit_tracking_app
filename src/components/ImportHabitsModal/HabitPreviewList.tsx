/* HabitPreviewList - Preview habits before importing */
import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../theme/ThemeContext';
import type { ParsedHabit } from './csvParser';

export interface HabitPreviewListProps {
  habits: ParsedHabit[];
}

const anim = (delay: number) => FadeInDown.delay(delay).springify().damping(18);

export function HabitPreviewList({ habits }: HabitPreviewListProps) {
  const { colors, isDark } = useThemeColors();

  return (
    <View className="gap-3">
      {habits.map((habit, index) => (
        <Animated.View
          key={`${habit.name}-${index}`}
          entering={anim(index * 60)}
        >
          <View
            className="rounded-2xl p-4"
            style={{
              backgroundColor: colors.card,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <View className="flex-row items-center gap-3">
              {/* Icon */}
              <View
                className="h-12 w-12 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: isDark ? '#374151' : '#f3f4f6',
                }}
              >
                <Text className="text-[24px]">
                  {habit.icon || '⭐'}
                </Text>
              </View>

              {/* Content */}
              <View className="flex-1">
                <Text
                  className="text-[17px] font-semibold"
                  style={{ color: colors.text.primary }}
                >
                  {habit.name}
                </Text>
                
                {habit.frequency && (
                  <Text
                    className="mt-0.5 text-[13px]"
                    style={{ color: colors.text.secondary }}
                  >
                    {formatFrequency(habit.frequency)}
                  </Text>
                )}

                {habit.notes && (
                  <Text
                    className="mt-1 text-[13px]"
                    style={{ color: colors.text.tertiary }}
                    numberOfLines={2}
                  >
                    {habit.notes}
                  </Text>
                )}

                {habit.tags && habit.tags.length > 0 && (
                  <View className="mt-2 flex-row flex-wrap gap-1">
                    {habit.tags.map((tag, tagIndex) => (
                      <View
                        key={`${tag}-${tagIndex}`}
                        className="rounded-full px-2 py-1"
                        style={{
                          backgroundColor: isDark ? '#374151' : '#e5e7eb',
                        }}
                      >
                        <Text
                          className="text-[11px] font-medium"
                          style={{ color: colors.text.secondary }}
                        >
                          {tag}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </View>
        </Animated.View>
      ))}
    </View>
  );
}

function formatFrequency(frequency: string): string {
  const frequencyMap: Record<string, string> = {
    'daily': 'Every day',
    'weekdays': 'Monday - Friday',
    'weekends': 'Saturday - Sunday',
    'custom': 'Custom schedule',
  };

  return frequencyMap[frequency.toLowerCase()] || frequency;
}
