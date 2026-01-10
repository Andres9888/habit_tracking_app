import { View, Text, TouchableOpacity, Pressable } from 'react-native';

interface ActionButtonsProps {
  isTodayCompleted: boolean;
  onMarkToday: () => void;
  onEdit: () => void;
}

export function ActionButtons({ isTodayCompleted, onMarkToday, onEdit }: ActionButtonsProps) {
  const markTodayLabel = isTodayCompleted ? 'Completed today' : 'Mark Today Done';

  return (
    <View className='mt-4 flex-row gap-3'>
      <TouchableOpacity
        accessibilityLabel={
          isTodayCompleted ? 'Today already completed' : 'Mark this habit as done today'
        }
        accessibilityRole='button'
        className={`flex-1 rounded-2xl px-4 py-3 ${
          isTodayCompleted ? 'bg-stone-200' : 'bg-blue-500'
        }`}
        disabled={isTodayCompleted}
        onPress={onMarkToday}
      >
        <Text
          className={`text-center text-base font-semibold ${
            isTodayCompleted ? 'text-stone-600' : 'text-white'
          }`}
        >
          {markTodayLabel}
        </Text>
      </TouchableOpacity>

      <Pressable
        accessibilityLabel='Edit habit'
        accessibilityRole='button'
        className='w-[110px] items-center justify-center rounded-2xl border border-stone-200 px-3'
        onPress={onEdit}
      >
        <Text className='text-sm font-semibold text-stone-700'>Edit habit</Text>
      </Pressable>
    </View>
  );
}
