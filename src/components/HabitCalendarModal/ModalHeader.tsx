import { View, Pressable, Text } from 'react-native';
import { ChevronLeft, MoreVertical } from 'lucide-react-native';

interface ModalHeaderProps {
  name: string;
  onClose: () => void;
  onEdit: () => void;
}

export function ModalHeader({ name, onClose, onEdit }: ModalHeaderProps) {
  return (
    <View className='flex-row items-center justify-between px-4 pb-4 pt-2'>
      <Pressable
        accessibilityHint='Return to the previous screen'
        accessibilityRole='button'
        className='h-10 w-10 items-center justify-center rounded-full active:bg-stone-200'
        onPress={onClose}
      >
        <ChevronLeft color='#1c1917' size={24} />
      </Pressable>
      <Text className='text-xl font-bold text-stone-900'>{name}</Text>
      <Pressable
        accessibilityLabel='Habit options'
        accessibilityRole='button'
        className='h-10 w-10 items-center justify-center rounded-full active:bg-stone-200'
        onPress={onEdit}
      >
        <MoreVertical color='#1c1917' size={20} />
      </Pressable>
    </View>
  );
}
