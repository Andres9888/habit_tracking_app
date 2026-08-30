import { useRef } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Pressable,
  Text,
  View,
} from 'react-native';
import { LayoutGrid, ChevronRight } from 'lucide-react-native';
import useHapticFeedback from '../../../hooks/useHapticFeedback';
import { STRINGS } from '../../../constants';
import { iconSizes } from '@/theme/iconSizes';

interface TemplatesLinkSectionProps {
  onPress: () => void;
}

/**
 * V8 Templates Link Section
 *
 * A card-style button that links to the Habit library.
 * Positioned below the Reminder Selector, providing users with
 * inspiration for science-backed habit templates.
 *
 * Design spec:
 * - Layout-grid icon
 * - Heading/subtext from STRINGS.CREATE_HABIT so entry copy and the
 *   library's own title stay on one "Habit library / habits" noun spine
 * - Chevron indicating actionable link
 */
export const TemplatesLinkSection = ({
  onPress,
}: TemplatesLinkSectionProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const { triggerSelection } = useHapticFeedback();

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      friction: 10,
      tension: 300,
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      friction: 10,
      tension: 300,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    triggerSelection();
    onPress();
    AccessibilityInfo.announceForAccessibility(
      `Opening ${STRINGS.CREATE_HABIT.templateCTA}`
    );
  };

  return (
    <View className='mb-6' testID='templates-link-section'>
      <Pressable
        accessibilityHint='Opens the Habit library'
        accessibilityLabel={STRINGS.CREATE_HABIT.templateCTA}
        accessibilityRole='button'
        testID='templates-link-button'
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View
          className='flex-row items-center rounded-2xl border border-[#e7e5e4] bg-white px-4 py-4'
          style={{ transform: [{ scale: scaleAnim }] }}
        >
          {/* Icon */}
          <View
            className='mr-4 h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF5]'
            testID='templates-link-icon'
          >
            <LayoutGrid color='#10B981' size={iconSizes.medium} strokeWidth={2} />
          </View>

          {/* Text content */}
          <View className='flex-1'>
            <Text className='text-sm font-semibold text-[#1F2937]'>
              Need inspiration?
            </Text>
            <Text className='mt-0.5 text-xs text-[#78716c]'>
              Browse science-backed templates
            </Text>
          </View>

          {/* Chevron */}
          <ChevronRight color='#6B7280' size={iconSizes.medium} strokeWidth={2} />
        </Animated.View>
      </Pressable>
    </View>
  );
};

export default TemplatesLinkSection;
