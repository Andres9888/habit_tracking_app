import { Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { MousePointerClick } from 'lucide-react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { iconSizes } from '@/theme/iconSizes';
import { typography, fontWeights } from '@/theme/typography';
import { triggerHaptic } from '@/utils/haptics';
import {
  HINT_LAYOUT,
  hintEntering,
  hintExiting,
} from './HabitCardDetailHintBanner.animations';

interface HabitCardDetailHintBannerProps {
  onDismiss: () => void;
  reduceMotion?: boolean;
}

/**
 * One-time coach hint below the calendar. Neutral parchment surface with a
 * two-line hierarchy — distinct from habit cards, dismisses with layout collapse.
 */
export function HabitCardDetailHintBanner({
  onDismiss,
  reduceMotion = false,
}: HabitCardDetailHintBannerProps) {
  const { colors } = useThemeColors();

  const handleDismiss = () => {
    triggerHaptic('tap');
    onDismiss();
  };

  return (
    <Animated.View
      className='mx-6 rounded-2xl border px-3.5 py-3'
      entering={hintEntering(reduceMotion)}
      exiting={hintExiting(reduceMotion)}
      layout={HINT_LAYOUT}
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
      }}
    >
      <View className='flex-row items-start gap-2.5'>
        <View
          className='mt-0.5 rounded-lg p-1.5'
          style={{ backgroundColor: colors.primary[100] }}
        >
          <MousePointerClick
            color={colors.primary[600]}
            size={iconSizes.small}
            strokeWidth={2}
          />
        </View>
        <View
          accessibilityLabel='Tip: tap a habit for details, tap a day to check in'
          accessibilityRole='text'
          className='min-w-0 flex-1'
        >
          <Text
            style={{
              ...typography.bodySmall,
              color: colors.text.primary,
              fontWeight: fontWeights.semibold,
            }}
          >
            Two ways to use a card
          </Text>
          <Text
            className='mt-0.5'
            style={{
              ...typography.caption,
              color: colors.text.secondary,
              lineHeight: 18,
            }}
          >
            Tap the card for details · tap a day to check in
          </Text>
        </View>
        <Pressable
          accessibilityHint='Dismisses this tip'
          accessibilityLabel='Got it'
          accessibilityRole='button'
          className='rounded-full px-2.5 py-1'
          hitSlop={{ bottom: 10, left: 6, right: 6, top: 10 }}
          style={{ backgroundColor: colors.gray[100] }}
          onPress={handleDismiss}
        >
          <Text
            style={{
              ...typography.caption,
              color: colors.text.secondary,
              fontWeight: fontWeights.semibold,
            }}
          >
            Got it
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}
