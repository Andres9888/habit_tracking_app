/**
 * RestDaysSelector Component
 *
 * Allows users to designate rest days where missing a habit doesn't break their streak.
 * Premium feature: free users get 1 rest day, premium users get unlimited.
 */

import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '../../theme/ThemeContext';

const DAYS_OF_WEEK = [
  { label: 'Sun', value: 0 },
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
];

interface RestDaysSelectorProps {
  restDays: number[];
  hasPremium?: boolean;
  onRestDaysChange: (days: number[]) => void;
}

export function RestDaysSelector({
  restDays,
  hasPremium = false,
  onRestDaysChange,
}: RestDaysSelectorProps) {
  const { colors: themeColors } = useThemeColors();

  const handleDayToggle = (dayValue: number) => {
    // Enforce free tier limit (max 1 rest day)
    const maxRestDays = hasPremium ? 7 : 1;

    if (restDays.includes(dayValue)) {
      // Remove rest day
      onRestDaysChange(restDays.filter((d) => d !== dayValue));
    } else {
      // Add rest day if under limit
      if (restDays.length < maxRestDays) {
        onRestDaysChange([...restDays, dayValue].sort());
      }
    }
  };

  const isFreeUserAtLimit = !hasPremium && restDays.length >= 1;

  return (
    <View className='gap-3 rounded-2xl p-4' style={{ backgroundColor: themeColors.card }}>
      <View>
        <Text
          className='font-semibold'
          style={{ color: themeColors.text.primary, fontSize: 13 }}
        >
          REST DAYS (STREAK FREEZE)
        </Text>
        <Text
          className='mt-1 text-xs'
          style={{ color: themeColors.text.tertiary }}
        >
          {hasPremium
            ? 'Skip up to 7 days without breaking your streak'
            : 'Choose 1 day to skip without breaking your streak'}
        </Text>
      </View>

      <View className='flex-row gap-2'>
        {DAYS_OF_WEEK.map(({ label, value }) => {
          const isSelected = restDays.includes(value);
          const canSelect = isSelected || !isFreeUserAtLimit;

          return (
            <Pressable
              key={value}
              onPress={() => {
                if (canSelect) {
                  handleDayToggle(value);
                }
              }}
              disabled={!canSelect}
            >
              <View
                className='h-10 w-10 items-center justify-center rounded-full'
                style={{
                  backgroundColor: isSelected
                    ? '#047857'
                    : themeColors.background,
                  opacity: !canSelect ? 0.5 : 1,
                  borderWidth: isSelected ? 0 : 1,
                  borderColor: themeColors.text.tertiary,
                }}
              >
                <Text
                  className='text-xs font-semibold'
                  style={{ color: isSelected ? '#ffffff' : themeColors.text.primary }}
                >
                  {label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {!hasPremium && restDays.length > 0 && (
        <Text
          className='text-xs'
          style={{ color: themeColors.text.tertiary }}
        >
          💎 Upgrade to Premium for unlimited rest days
        </Text>
      )}
    </View>
  );
}
