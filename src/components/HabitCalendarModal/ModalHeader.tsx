import { View, Pressable, Text } from 'react-native';
import { MoreVertical } from 'lucide-react-native';
import { useThemeColors } from '../../theme/ThemeContext';
import { ModalCloseButton } from '../ui/ModalCloseButton';
import { iconSizes } from '@/theme/iconSizes';

interface ModalHeaderProps {
  name: string;
  onClose: () => void;
  onEdit: () => void;
}

export function ModalHeader({ name, onClose, onEdit }: ModalHeaderProps) {
  const { colors, isDark } = useThemeColors();

  return (
    <View className='flex-row items-center justify-between px-4 pb-4 pt-2'>
      <Pressable
        accessibilityLabel='Habit options'
        accessibilityRole='button'
        className='h-11 w-11 items-center justify-center rounded-full'
        style={({ pressed }) => ({
          backgroundColor: pressed
            ? isDark ? '#4B5563' : '#e7e5e4'
            : isDark ? '#374151' : 'transparent',
        })}
        onPress={onEdit}
      >
        <MoreVertical color={colors.text.primary} size={iconSizes.medium} />
      </Pressable>
      <Text
        className='flex-1 text-center text-xl font-bold'
        numberOfLines={1}
        style={{ color: colors.text.primary }}
      >
        {name}
      </Text>
      <ModalCloseButton
        label='Close habit calendar'
        onClose={onClose}
      />
    </View>
  );
}
