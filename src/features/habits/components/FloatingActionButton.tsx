import { Plus } from 'lucide-react-native';
import { Pressable } from 'react-native';

interface FloatingActionButtonProps {
  onPress: () => void;
}

export function FloatingActionButton({ onPress }: FloatingActionButtonProps) {
  return (
    <Pressable
      accessibilityHint='Open create habit modal'
      accessibilityLabel='Add habit'
      accessibilityRole='button'
      className='h-14 w-14 items-center justify-center rounded-full bg-[#101727] shadow-lg'
      onPress={onPress}
    >
      <Plus color='#ffffff' size={24} strokeWidth={2.25} />
    </Pressable>
  );
}

export default FloatingActionButton;
