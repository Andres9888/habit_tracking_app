import { memo } from 'react';
import { Text, View } from 'react-native';
import { X } from 'lucide-react-native';
import { AnimatedPressable } from '../../ui';
import { useThemeColors } from '@/theme/ThemeContext';

interface EmojiPickerHeaderProps {
  onClose: () => void;
}

export const EmojiPickerHeader = memo(({ onClose }: EmojiPickerHeaderProps) => {
  const { colors } = useThemeColors();

  return (
    <View className='flex-row items-center justify-between border-b px-4 pb-3 pt-4' style={{ borderColor: colors.border }}>
      <Text className='text-[24px] font-bold tracking-tight' style={{ color: colors.text.primary }}>
        Choose Icon
      </Text>
      <AnimatedPressable
        accessibilityLabel='Close emoji picker'
        accessibilityRole='button'
        className='h-10 w-10 items-center justify-center rounded-full'
        style={{ backgroundColor: colors.border }}
        onPress={onClose}
      >
        <X color={colors.text.primary} size={24} strokeWidth={2} />
      </AnimatedPressable>
    </View>
  );
});

EmojiPickerHeader.displayName = 'EmojiPickerHeader';
