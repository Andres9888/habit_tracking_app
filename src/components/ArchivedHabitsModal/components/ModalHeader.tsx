import { Pressable, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { ChevronLeft } from 'lucide-react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';
import { shadows } from '../../../theme/spacing';
import { useThemeColors } from '../../../theme/ThemeContext';
import { ModalCloseButton } from '../../ui/ModalCloseButton';

interface ModalHeaderProps {
  habitCount?: number;
  insets: EdgeInsets;
  onBack: () => void;
  onClose: () => void;
}

export function ModalHeader({ habitCount, insets, onBack, onClose }: ModalHeaderProps) {
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
        <View className='flex-1 flex-row items-center justify-center gap-2'>
          <Text
            className='text-center text-xl font-bold'
            style={{ color: colors.text.primary }}
          >
            Archived Habits
          </Text>
          {(habitCount ?? 0) > 0 && (
            <Text
              style={{
                backgroundColor: isDark ? '#374151' : '#f1f5f9',
                borderRadius: 10,
                color: isDark ? '#9ca3af' : '#94a3b8',
                fontSize: 11,
                fontWeight: '600',
                overflow: 'hidden',
                paddingHorizontal: 8,
                paddingVertical: 2,
              }}
            >
              {habitCount}
            </Text>
          )}
        </View>
        <ModalCloseButton label='Close archived habits' onClose={onClose} />
      </View>
    </BlurView>
  );
}
