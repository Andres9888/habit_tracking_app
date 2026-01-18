import { Text, TouchableOpacity } from 'react-native';

interface BackButtonProps {
  onPress: () => void;
}

export function BackButton({ onPress }: BackButtonProps) {
  return (
    <TouchableOpacity
      className='absolute left-6 top-[60px] z-10'
      onPress={onPress}
    >
      <Text className='text-base font-semibold text-stone-800'>← Back</Text>
    </TouchableOpacity>
  );
}
