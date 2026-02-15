import { View, Pressable, Text } from 'react-native';
import { X, MoreVertical } from 'lucide-react-native';
import { useThemeColors } from '../../theme/ThemeContext';

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
        className='h-10 w-10 items-center justify-center rounded-full'
        hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
        style={{ backgroundColor: isDark ? '#374151' : 'transparent' }}
        onPress={onEdit}
      >
        <MoreVertical color={colors.text.primary} size={20} />
      </Pressable>
      <Text className='text-xl font-bold' style={{ color: colors.text.primary }}>{name}</Text>
      <Pressable
        accessibilityHint='Close this modal'
        accessibilityLabel='Close'
        accessibilityRole='button'
        className='h-10 w-10 items-center justify-center rounded-full'
        hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
        style={{ backgroundColor: isDark ? '#374151' : '#f5f5f4' }}
        onPress={onClose}
      >
        <X color={isDark ? '#9CA3AF' : '#57534e'} size={24} strokeWidth={2} />
      </Pressable>
    </View>
  );
}
