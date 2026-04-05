import { Pressable, View } from 'react-native';
import { Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { ChevronLeft } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import type { EdgeInsets } from 'react-native-safe-area-context';
import { durations, springs } from '../../../theme/animations';
import { shadows } from '../../../theme/spacing';
import { useThemeColors } from '../../../theme/ThemeContext';
import { typography } from '../../../theme/typography';
import { ModalCloseButton } from '../../ui/ModalCloseButton';

const ENTERING = FadeInDown.duration(durations.enter).springify().damping(springs.standard.damping);

interface ModalHeaderProps {
  insets: EdgeInsets;
  habitCount: number;
  onBack: () => void;
  onClose: () => void;
}

export function ModalHeader({
  insets,
  habitCount,
  onBack,
  onClose,
}: ModalHeaderProps) {
  const { colors, isDark } = useThemeColors();

  const subtitle = habitCount === 0
    ? 'No archived habits'
    : habitCount === 1
      ? '1 habit waiting to come back'
      : `${habitCount} habits waiting to come back`;

  return (
    <Animated.View entering={ENTERING}>
      <BlurView
        intensity={20}
        style={{ paddingBottom: 4, paddingTop: insets.top + 8 }}
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
                  ? colors.gray[200]
                  : colors.card,
              },
            ]}
            onPress={onBack}
          >
            <ChevronLeft color={colors.text.secondary} size={iconSizes.large} strokeWidth={2} />
          </Pressable>
          <View style={{ width: 44 }} />
          <ModalCloseButton label='Close archived habits' onClose={onClose} />
        </View>

        <View className='px-5 pb-2'>
          <Text style={[typography.heading1, { color: colors.text.primary }]}>
            Your Archived Habits
          </Text>
          <View className='mt-1.5'>
            <Text style={[typography.caption, { color: colors.text.tertiary }]}>
              {subtitle}
            </Text>
          </View>
        </View>
      </BlurView>
    </Animated.View>
  );
}
