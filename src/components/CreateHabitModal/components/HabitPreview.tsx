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
}: HabitPreviewProps) => {
  const isEmpty = !habitName && !selectedEmoji;
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <View className='mb-6 mt-4 rounded-2xl bg-white p-4'>
      <Text className='mb-2 text-xs font-semibold text-[#64748b]'>✨ Live Preview</Text>

      {isEmpty ? (
        <View className='items-center py-6'>
          <Text className='mb-2 text-4xl'>✨</Text>
          <Text className='mb-1 text-sm font-medium text-[#64748b]'>Your habit will appear here</Text>
          <Text className='text-xs text-[#94a3b8]'>Try: "Meditate", "Run", or "Read"</Text>
        </View>
      ) : (
        <>
          <View className='flex-row items-center gap-4'>
            {selectedEmoji ? (
              <View
                className='h-16 w-16 items-center justify-center rounded-2xl'
                style={{ backgroundColor: selectedColor }}
              >
                <Text className='text-[30px]'>{selectedEmoji}</Text>
              </View>
            ) : (
              <View
                className='h-16 w-16 items-center justify-center rounded-2xl bg-gray-200'
              >
                <Text className='text-2xl text-gray-400'>?</Text>
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

          {/* Week Preview */}
          <View className='mt-4 rounded-xl bg-[#f8f5f1] p-3'>
            <Text className='mb-2 text-xs font-medium text-[#64748b]'>This week:</Text>
            <View className='flex-row items-center justify-between'>
              {weekDays.map((day, index) => (
                <View key={`${day}-${index}`} className='items-center gap-1'>
                  <Text className='text-xs text-[#94a3b8]'>{day}</Text>
                  <View className='h-6 w-6 items-center justify-center rounded-full bg-white'>
                    <View className='h-2 w-2 rounded-full bg-[#e2e8f0]' />
                  </View>
                </View>
              ))}
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const capitalize = (s?: string) => {
  if (!s) return s ?? '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};
