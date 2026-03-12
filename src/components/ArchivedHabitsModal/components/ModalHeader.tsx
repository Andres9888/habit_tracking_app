import { Pressable, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { ChevronLeft } from 'lucide-react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';
import { shadows } from '../../../theme/spacing';
import { useThemeColors } from '../../../theme/ThemeContext';
import { ModalCloseButton } from '../../ui/ModalCloseButton';

interface ModalHeaderProps {
  insets: EdgeInsets;
  onBack: () => void;
  onClose: () => void;
}

export function ModalHeader({ insets, onBack, onClose }: ModalHeaderProps) {
  const { colors, isDark } = useThemeColors();

  return (
    <BlurView
      intensity={20}
      style={{
        paddingBottom: 8,
        paddingHorizontal: 0,
        paddingTop: insets.top + 8,
      }}
      tint={isDark ? 'dark' : 'light'}
    >
      <View className='mb-2 flex-row items-center justify-between px-4'>
        <Pressable
          accessibilityLabel='Back to settings'
          accessibilityRole='button'
          className='h-11 w-11 items-center justify-center rounded-full'
          style={({ pressed }) => [
            shadows.subtle,
            {
              backgroundColor: pressed
                ? isDark ? '#374151' : '#e7e5e4'
                : isDark ? '#1f2937' : '#f5f5f4',
            },
          ]}
          onPress={onBack}
        >
          <ChevronLeft color={colors.text.secondary} size={24} strokeWidth={2} />
        </Pressable>
        <Text
          className='flex-1 text-center text-xl font-bold'
          style={{ color: colors.text.primary }}
        >
          Archived Habits
        </Text>
        <ModalCloseButton label='Close archived habits' onClose={onClose} />
      </View>
    </BlurView>
  );
}
