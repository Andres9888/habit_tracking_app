import { Pressable, View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { ChevronLeft } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import type { EdgeInsets } from 'react-native-safe-area-context';
import { durations, springs } from '@/theme/animations';
import { useThemeColors } from '@/theme/ThemeContext';
import { typography } from '@/theme/typography';
import { ModalCloseButton } from '../../ui/ModalCloseButton';

const ENTERING = FadeInDown.duration(durations.enter).springify().damping(springs.standard.damping);

interface ModalHeaderProps {
  insets: EdgeInsets;
  habitCount: number;
  onBack: () => void;
  onClose: () => void;
}

export function ModalHeader({ insets, habitCount, onBack, onClose }: ModalHeaderProps) {
  const { colors, isDark } = useThemeColors();

  const subtitle = habitCount === 0
    ? 'No archived habits'
    : `${habitCount} habit${habitCount === 1 ? '' : 's'} paused · tap to bring ${habitCount === 1 ? 'it' : 'them'} back`;

  return (
    <Animated.View entering={ENTERING}>
      <BlurView intensity={20} style={{ paddingBottom: 8, paddingTop: insets.top + 8 }} tint={isDark ? 'dark' : 'light'}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 16 }}>
          <Pressable
            accessibilityLabel='Back to settings' accessibilityRole='button'
            style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}
            onPress={onBack}
          >
            <ChevronLeft color={colors.text.primary} size={iconSizes.large} strokeWidth={2} />
          </Pressable>
          <ModalCloseButton label='Close archived habits' onClose={onClose} />
        </View>
        <View style={{ paddingHorizontal: 20, paddingBottom: 4 }}>
          <Text style={[typography.heading1, { color: colors.text.primary, letterSpacing: -0.5, fontSize: 24, lineHeight: 30 }]}>
            Archived Habits
          </Text>
          <Text style={[typography.bodySmall, { color: isDark ? colors.gray[400] : '#9B958E', marginTop: 6, letterSpacing: -0.1 }]}>
            {subtitle}
          </Text>
        </View>
      </BlurView>
    </Animated.View>
  );
}
