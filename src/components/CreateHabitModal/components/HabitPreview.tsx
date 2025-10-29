import { Text, View } from 'react-native';

interface HabitPreviewProps {
  habitName: string;
  selectedEmoji: string | null;
  selectedColor: string;
}

export const HabitPreview = ({
  habitName,
  selectedEmoji,
  selectedColor,
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
        <Text className='text-[20px] font-semibold text-[#1a1a1a]'>
          {habitName || 'Exercise'}
        </Text>
        <Text className='text-sm font-medium text-[#8a8a8a]'>Daily</Text>
      </View>
    </View>
  </View>
);
