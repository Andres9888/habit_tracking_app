import { memo } from 'react';
import { Text, View } from 'react-native';
import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { X } from 'lucide-react-native';

interface EmojiPickerHeaderProps {
  onClose: () => void;
}

export const EmojiPickerHeader = memo(({ onClose }: EmojiPickerHeaderProps) => (
  <View className='flex-row items-center justify-between border-b border-stone-200 px-4 pb-3 pt-4'>
    <Text className='text-[24px] font-bold tracking-tight text-stone-800'>
      Choose Icon
    </Text>
    <AnimatedPressable
      accessibilityLabel='Close emoji picker'
      accessibilityRole='button'
      className='h-10 w-10 items-center justify-center rounded-full bg-stone-200'
      onPress={onClose}
    >
      <X color='#1c1917' size={24} strokeWidth={2} />
    </AnimatedPressable>
  </View>
));

EmojiPickerHeader.displayName = 'EmojiPickerHeader';
