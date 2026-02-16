import { Text, View } from 'react-native';
import { AnimatedPressable } from '../../ui/AnimatedPressable';
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
      <View className='mb-2 flex-row items-center justify-between'>
        <AnimatedPressable
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
          <ChevronLeft color={colors.gray[500]} size={24} strokeWidth={2} />
        </AnimatedPressable>
        <Text className='flex-1 text-center text-xl font-bold text-stone-900'>
          Archived Habits
        </Text>
        <AnimatedPressable
          accessibilityLabel='Close'
          accessibilityRole='button'
          className='h-11 w-11 items-center justify-center rounded-2xl bg-stone-100/80'
          style={shadows.subtle}
          onPress={onClose}
        >
          <X color={colors.gray[500]} size={24} strokeWidth={2} />
        </AnimatedPressable>
      </View>
    </BlurView>
  );
}
