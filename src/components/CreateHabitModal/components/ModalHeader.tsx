import { Text, TouchableOpacity, View } from 'react-native';
import { X } from 'lucide-react-native';

interface ModalHeaderProps {
  isEditMode: boolean;
  habitName: string;
  onClose: () => void;
  onSave: () => void;
}

export const ModalHeader = ({ isEditMode, habitName, onClose, onSave }: ModalHeaderProps) => {
  const canSave = habitName.trim().length > 0;
  return (
    <View className='flex-row items-center justify-between px-4 pb-4 pt-4'>
      <TouchableOpacity
        accessibilityLabel='Close'
        accessibilityRole='button'
        className='h-10 w-10 items-center justify-center rounded-full'
        onPress={onClose}
      >
        <X color='#1a1a1a' size={24} strokeWidth={2} />
      </TouchableOpacity>
      <Text className='text-[20px] font-bold text-[#1a1a1a]'>
        {isEditMode ? 'Edit Habit' : 'Create Habit'}
      </Text>
      <TouchableOpacity
        accessibilityRole='button'
        className={`h-9 items-center justify-center rounded-full px-6 ${
          canSave ? 'bg-[#1a1a1a]' : 'bg-gray-300'
        }`}
        disabled={!canSave}
        onPress={onSave}
      >
        <Text className='text-sm font-semibold text-white'>Save</Text>
      </TouchableOpacity>
    </View>
  );
};
