import { Text, View } from 'react-native';
import STRINGS from '../../../constants/strings';

interface HabitPreviewProps {
  habitName: string;
  selectedEmoji: string | null;
  selectedColor: string;
  frequencyLabel?: string;
}

export const HabitPreview = ({
  habitName,
  selectedEmoji,
  selectedColor,
  frequencyLabel,
}: HabitPreviewProps) => (
  <View className='mb-6 mt-4 rounded-2xl bg-white p-4'>
    <View className='flex-row items-center gap-4'>
      {selectedEmoji && (
        <View
          className='h-16 w-16 items-center justify-center rounded-2xl'
          style={{ backgroundColor: selectedColor }}
        >
          <Text className='text-[30px]'>{selectedEmoji}</Text>
        </View>
      )}
      <View className='flex-1'>
        {habitName ? (
          <Text className='text-[20px] font-semibold text-[#1a1a1a]'>
            {habitName}
          </Text>
        ) : (
          <Text className='text-[20px] font-semibold text-[#94a3b8]'>
            {STRINGS.CREATE_HABIT.namePlaceholder}
          </Text>
        )}
        {!!frequencyLabel && (
          <Text className='text-sm font-medium text-[#8a8a8a]'>
            {capitalize(frequencyLabel)}
          </Text>
        )}
      </View>
    </View>
  </View>
);

const capitalize = (s?: string) => {
  if (!s) return s ?? '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};
