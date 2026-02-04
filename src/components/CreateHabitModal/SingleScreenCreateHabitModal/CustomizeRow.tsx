/**
 * CustomizeRow - Collapsible row showing icon/color preview
 *
 * Per spec:
 * - Height: 48px
 * - Icon chip: 24×24px, border-radius 6px
 * - Color chip: 24×24px, border-radius 50%
 * - Label: Caption size, muted text color
 * - Chevron: 16×16px, rotates 180° on expand
 */

/* eslint-disable max-lines-per-function */

import { memo, useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ChevronDown } from 'lucide-react-native';
import useHapticFeedback from '../../../hooks/useHapticFeedback';
import { ANIMATION, COLORS, DIMENSIONS, TYPOGRAPHY } from './constants';

interface CustomizeRowProps {
  isExpanded: boolean;
  onToggle: () => void;
  selectedColor: string;
  selectedEmoji: string | null;
}

function CustomizeRowComponent({
  isExpanded,
  onToggle,
  selectedColor,
  selectedEmoji,
}: CustomizeRowProps) {
  const { triggerSelection } = useHapticFeedback();
  const chevronRotation = useSharedValue(isExpanded ? 180 : 0);

  // Animate chevron rotation
  chevronRotation.value = withTiming(isExpanded ? 180 : 0, {
    duration: ANIMATION.customizeExpand,
    easing: Easing.out(Easing.ease),
  });

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevronRotation.value}deg` }],
  }));

  const handlePress = useCallback(() => {
    triggerSelection();
    onToggle();
  }, [onToggle, triggerSelection]);

  return (
    <Pressable
      accessibilityHint={
        isExpanded
          ? 'Collapse customization options'
          : 'Expand customization options'
      }
      accessibilityLabel='Customize habit appearance'
      accessibilityRole='button'
      accessibilityState={{ expanded: isExpanded }}
      className='flex-row items-center justify-center py-3'
      style={{ height: DIMENSIONS.customizeRowHeight }}
      onPress={handlePress}
    >
      {/* Icon chip */}
      <View
        style={{
          alignItems: 'center',
          backgroundColor: '#f3f3f3',
          borderRadius: DIMENSIONS.borderRadius.iconChip,
          height: DIMENSIONS.iconChip,
          justifyContent: 'center',
          width: DIMENSIONS.iconChip,
        }}
      >
        <Text style={{ fontSize: 14 }}>{selectedEmoji || '💪'}</Text>
      </View>

      {/* Color chip */}
      <View
        style={{
          backgroundColor: selectedColor,
          borderRadius: DIMENSIONS.colorChip / 2,
          height: DIMENSIONS.colorChip,
          marginLeft: 8,
          width: DIMENSIONS.colorChip,
        }}
      />

      {/* Label */}
      <Text
        style={{
          color: COLORS.mutedText,
          fontSize: TYPOGRAPHY.caption.fontSize,
          marginLeft: 12,
        }}
      >
        Customize
      </Text>

      {/* Chevron */}
      <Animated.View style={[{ marginLeft: 4 }, chevronStyle]}>
        <ChevronDown color={COLORS.mutedText} size={16} />
      </Animated.View>
    </Pressable>
  );
}

export const CustomizeRow = memo(CustomizeRowComponent);
