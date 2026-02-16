/**
 * RestDaysSection - Toggle rest days for a habit
 *
 * Rest days are days of the week where not completing a habit
 * doesn't break the streak. Free users get 1 rest day, premium unlimited.
 */
import React from 'react';
import { Text, View, Pressable, Alert } from 'react-native';
import { useThemeColors } from '../../theme/ThemeContext';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface RestDaysSectionProps {
  restDays: number[];
  onRestDaysChange: (restDays: number[]) => void;
  isPremium: boolean;
}

export function RestDaysSection({
  restDays,
  onRestDaysChange,
  isPremium,
}: RestDaysSectionProps) {
  const { colors: themeColors, isDark } = useThemeColors();
  const maxRestDays = isPremium ? 6 : 1; // Can't set all 7 as rest days

  const toggleDay = (day: number) => {
    if (restDays.includes(day)) {
      onRestDaysChange(restDays.filter((d) => d !== day));
    } else {
      if (restDays.length >= maxRestDays) {
        if (!isPremium) {
          Alert.alert(
            'Premium Feature',
            'Free users can set 1 rest day per habit. Upgrade to Premium for unlimited rest days!',
            [{ text: 'OK' }]
          );
        }
        return;
      }
      onRestDaysChange([...restDays, day]);
    }
  };

  return (
    <View className="mt-4">
      <View className="mb-2 flex-row items-center justify-between">
        <View className="flex-1">
          <Text
            className="text-[15px] font-semibold"
            style={{ color: themeColors.text }}
          >
            😴 Rest Days
          </Text>
          <Text
            className="mt-0.5 text-[13px]"
            style={{ color: themeColors.secondaryText }}
          >
            Skipping these days won't break your streak
          </Text>
        </View>
        {!isPremium && (
          <View
            className="rounded-full px-2 py-0.5"
            style={{ backgroundColor: isDark ? '#374151' : '#FEF3C7' }}
          >
            <Text
              className="text-[11px] font-semibold"
              style={{ color: isDark ? '#FBBF24' : '#92400E' }}
            >
              1 FREE
            </Text>
          </View>
        )}
      </View>
      <View className="flex-row justify-between">
        {DAY_LABELS.map((label, index) => {
          const isSelected = restDays.includes(index);
          return (
            <Pressable
              key={label}
              accessibilityLabel={`${label} rest day ${isSelected ? 'enabled' : 'disabled'}`}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              className="items-center"
              onPress={() => toggleDay(index)}
            >
              <View
                className="h-10 w-10 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: isSelected
                    ? isDark ? '#1E3A5F' : '#DBEAFE'
                    : isDark ? '#374151' : '#F3F4F6',
                  borderColor: isSelected
                    ? '#3B82F6'
                    : 'transparent',
                  borderWidth: isSelected ? 2 : 0,
                }}
              >
                <Text
                  className="text-[13px] font-semibold"
                  style={{
                    color: isSelected
                      ? '#3B82F6'
                      : themeColors.secondaryText,
                  }}
                >
                  {label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
