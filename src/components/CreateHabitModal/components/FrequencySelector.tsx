import { memo, useCallback } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import useHapticFeedback from '../../../hooks/useHapticFeedback';

interface FrequencySelectorProps {
  selectedDays: boolean[];
  onChange: (selectedDays: boolean[]) => void;
}

const WEEKDAYS = [
  { label: 'S', fullName: 'Sunday', index: 0 },
  { label: 'M', fullName: 'Monday', index: 1 },
  { label: 'T', fullName: 'Tuesday', index: 2 },
  { label: 'W', fullName: 'Wednesday', index: 3 },
  { label: 'T', fullName: 'Thursday', index: 4 },
  { label: 'F', fullName: 'Friday', index: 5 },
  { label: 'S', fullName: 'Saturday', index: 6 },
];

const FrequencySelectorComponent = ({
  selectedDays,
  onChange,
}: FrequencySelectorProps) => {
  const { triggerSelection } = useHapticFeedback();

  const handleDayPress = useCallback(
    (dayIndex: number) => {
      triggerSelection();
      const newSelectedDays = [...selectedDays];
      newSelectedDays[dayIndex] = !newSelectedDays[dayIndex];
      onChange(newSelectedDays);
    },
    [selectedDays, onChange, triggerSelection]
  );

  const selectedCount = selectedDays.filter(Boolean).length;
  const frequencyText =
    selectedCount === 7
      ? 'Every day'
      : selectedCount === 0
        ? 'No days selected'
        : `${selectedCount} day${selectedCount > 1 ? 's' : ''} per week`;

  return (
    <View className='mb-6'>
      <Text className='mb-3 text-xs font-medium text-stone-500'>Repeat</Text>
      <View className='flex-row gap-1.5'>
        {WEEKDAYS.map((day) => {
          const isSelected = selectedDays[day.index];
          return (
            <TouchableOpacity
              key={day.index}
              accessibilityLabel={`${day.fullName}${isSelected ? ', selected' : ''}`}
              accessibilityRole='button'
              accessibilityState={{ selected: isSelected }}
              className={`h-10 w-10 items-center justify-center rounded-full ${
                isSelected ? 'bg-emerald-500' : 'border border-stone-200 bg-white'
              }`}
              onPress={() => handleDayPress(day.index)}
            >
              <Text
                className={`text-xs font-semibold ${
                  isSelected ? 'text-white' : 'text-stone-600'
                }`}
              >
                {day.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Text className='mt-2 text-xs text-stone-400'>
        {frequencyText} • Tap to customize
      </Text>
    </View>
  );
};

export const FrequencySelector = memo(FrequencySelectorComponent);

export default FrequencySelector;
