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
        style={({ pressed }) => ({
          backgroundColor: pressed
            ? isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'
            : 'transparent',
        })}
        onPress={onEdit}
      >
        <MoreVertical color={colors.text.primary} size={20} />
      </Pressable>
      <Text
        className='text-xl font-bold'
        style={{ color: colors.text.primary }}
      >
        {name}
      </Text>
      <Pressable
        accessibilityHint='Close this modal'
        accessibilityLabel='Close'
        accessibilityRole='button'
        className='h-10 w-10 items-center justify-center rounded-full'
        style={({ pressed }) => ({
          backgroundColor: pressed
            ? isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)'
            : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
        })}
        onPress={onClose}
      >
        <X color={colors.text.secondary} size={24} strokeWidth={2} />
      </Pressable>
    </View>
  );
}
