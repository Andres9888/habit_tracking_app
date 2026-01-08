import { Plus } from 'lucide-react-native';
import {
  AccessibilityInfo,
  Animated,
  Keyboard,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { memo, useCallback, useEffect, useRef } from 'react';
import useHapticFeedback from '../../../hooks/useHapticFeedback';
import { useReduceMotion } from '../../../hooks/useReduceMotion';
import STRINGS from '../../../constants/strings';
import { Motion } from '../../../constants/motion';
import { getColorName } from '../constants';

interface ColorPickerSectionProps {
  colors: readonly string[];
  selectedColor: string;
  onSelectColor: (color: string) => void;
  onCustomPress?: () => void; // Optional - if not provided, custom color button is hidden
  hideLabel?: boolean; // Hide section label for cleaner centered modal design
}

const ColorPickerSectionComponent = ({
  colors,
  selectedColor,
  onSelectColor,
  onCustomPress,
  hideLabel = false,
}: ColorPickerSectionProps) => (
  <ColorPickerContent
    colors={colors}
    hideLabel={hideLabel}
    selectedColor={selectedColor}
    onCustomPress={onCustomPress}
    onSelectColor={onSelectColor}
  />
);

export const ColorPickerSection = memo(ColorPickerSectionComponent);

// Separate component to fix Rules of Hooks
interface ColorButtonProps {
  color: string;
  isSelected: boolean;
  onSelect: (color: string) => void;
  reduceMotion: boolean;
}

/**
 * Individual color swatch button with selection animation
 * V9 Spec: 36x36px base, scale(1.08) when selected, box-shadow ring
 * V11 Spec: Added ripple animation (scale + opacity fade outward) on selection
 * V11 Task 8: Respects reduced motion preference
 * V12: Increased to 44px base with 52px container for better touch targets
 */
const ColorButtonComponent = ({
  color,
  isSelected,
  onSelect,
  reduceMotion,
}: ColorButtonProps) => {
  const scale = useRef(new Animated.Value(isSelected ? 1.08 : 1)).current;
  const rippleScale = useRef(new Animated.Value(0)).current;
  const rippleOpacity = useRef(new Animated.Value(1)).current;
  const wasSelected = useRef(isSelected);
  const { triggerSelection } = useHapticFeedback();
  const colorName = getColorName(color);

  // Animate scale when selection changes
  useEffect(() => {
    if (isSelected !== wasSelected.current) {
      if (reduceMotion) {
        // V11 Task 8: No animation in reduced motion mode
        scale.setValue(isSelected ? 1.08 : 1);
      } else if (isSelected) {
        // Animate to selected scale with spring
        Animated.spring(scale, {
          damping: 12,
          stiffness: 180,
          toValue: 1.08,
          useNativeDriver: true,
        }).start();
      } else {
        // Animate back to normal scale
        Animated.timing(scale, {
          duration: Motion.duration.base,
          easing: Motion.easing.outEase,
          toValue: 1,
          useNativeDriver: true,
        }).start();
      }
      wasSelected.current = isSelected;
    }
  }, [isSelected, scale, reduceMotion]);

  const handlePress = useCallback(() => {
    // Dismiss keyboard to reveal full picker and signal interactivity
    Keyboard.dismiss();
    triggerSelection();

    if (!reduceMotion) {
      // V11 Spec: Trigger ripple animation on selection (skip if reduced motion)
      // Reset ripple values
      rippleScale.setValue(0);
      rippleOpacity.setValue(1);

      // Animate ripple: scale 0 → 2, opacity 1 → 0 over 300ms
      Animated.parallel([
        Animated.timing(rippleScale, {
          duration: 300,
          easing: Motion.easing.outEase,
          toValue: 2,
          useNativeDriver: true,
        }),
        Animated.timing(rippleOpacity, {
          duration: 300,
          easing: Motion.easing.outEase,
          toValue: 0,
          useNativeDriver: true,
        }),
      ]).start();
    }

    onSelect(color);
    // Announce color selection with human-readable name for screen readers
    AccessibilityInfo.announceForAccessibility(`Selected ${colorName} color`);
  }, [
    color,
    colorName,
    onSelect,
    triggerSelection,
    rippleScale,
    rippleOpacity,
    reduceMotion,
  ]);

  const handlePressIn = useCallback(() => {
    if (reduceMotion) return;
    Animated.timing(scale, {
      duration: Motion.duration.fast,
      easing: Motion.easing.inEase,
      toValue: isSelected ? 1.08 : 0.96,
      useNativeDriver: true,
    }).start();
  }, [isSelected, scale, reduceMotion]);

  const handlePressOut = useCallback(() => {
    if (reduceMotion) return;
    Animated.timing(scale, {
      duration: Motion.duration.base,
      easing: Motion.easing.outEase,
      toValue: isSelected ? 1.08 : 1,
      useNativeDriver: true,
    }).start();
  }, [isSelected, scale, reduceMotion]);

  return (
    <View style={{ position: 'relative' }}>
      {/* V11: Ripple effect layer - positioned absolutely behind the button */}
      <Animated.View
        pointerEvents='none'
        style={[
          StyleSheet.absoluteFill,
          {
            alignItems: 'center',
            justifyContent: 'center',
            opacity: rippleOpacity,
            transform: [{ scale: rippleScale }],
          },
        ]}
      >
        <View
          style={{
            backgroundColor: color,
            borderRadius: 999,
            height: 44,
            width: 44,
          }}
        />
      </Animated.View>

      {/* Main color button with outer ring for selection */}
      {/* Fixed 52px container to prevent layout shift (44px * 1.08 ≈ 47px) */}
      <View
        style={{
          alignItems: 'center',
          height: 52,
          justifyContent: 'center',
          width: 52,
        }}
      >
        <Animated.View
          style={[
            { transform: [{ scale }] },
            // Shadow for selected state
            isSelected && {
              elevation: 6,
              shadowColor: '#000000',
              shadowOffset: { height: 2, width: 0 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
            },
          ]}
        >
          {/* Outer ring - only visible when selected */}
          <View
            style={{
              alignItems: 'center',
              backgroundColor: isSelected ? color : 'transparent',
              borderRadius: 999,
              height: isSelected ? 52 : 44,
              justifyContent: 'center',
              width: isSelected ? 52 : 44,
            }}
          >
            {/* White gap ring - only visible when selected */}
            <View
              style={{
                alignItems: 'center',
                backgroundColor: isSelected ? '#ffffff' : 'transparent',
                borderRadius: 999,
                height: isSelected ? 48 : 44,
                justifyContent: 'center',
                width: isSelected ? 48 : 44,
              }}
            >
              {/* Inner color circle - always 44px (increased from 36px) */}
              <TouchableOpacity
                accessibilityLabel={`${colorName} color${isSelected ? ', selected' : ''}`}
                accessibilityRole='button'
                accessibilityState={{ selected: isSelected }}
                style={{
                  alignItems: 'center',
                  backgroundColor: color,
                  borderRadius: 999,
                  height: 44,
                  justifyContent: 'center',
                  width: 44,
                }}
                testID={`color-swatch-${color.replace('#', '')}`}
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
              />
            </View>
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const ColorButton = memo(ColorButtonComponent);

// Custom color button with dashed border and plus icon
// V9: Updated to 36px to match color swatches
// V12: Updated to 44px to match larger color swatches
const CustomColorButtonComponent = ({ onPress }: { onPress: () => void }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const { triggerSelection } = useHapticFeedback();

  const handlePress = useCallback(() => {
    Keyboard.dismiss();
    triggerSelection();
    onPress();
  }, [onPress, triggerSelection]);

  const handlePressIn = useCallback(() => {
    Animated.timing(scale, {
      duration: Motion.duration.fast,
      easing: Motion.easing.inEase,
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const handlePressOut = useCallback(() => {
    Animated.timing(scale, {
      duration: Motion.duration.base,
      easing: Motion.easing.outEase,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return (
    // Fixed 52px container to match color swatches
    <View
      style={{
        alignItems: 'center',
        height: 52,
        justifyContent: 'center',
        width: 52,
      }}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          accessibilityLabel='Choose custom color'
          accessibilityRole='button'
          style={{
            alignItems: 'center',
            borderColor: '#a8a29e', // stone-400
            borderRadius: 999,
            borderStyle: 'dashed',
            borderWidth: 2,
            height: 44,
            justifyContent: 'center',
            width: 44,
          }}
          testID='color-swatch-custom'
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Plus color='#a8a29e' size={20} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const CustomColorButton = memo(CustomColorButtonComponent);

/**
 * V8 Color Picker - 12 colors with wrapping
 * Responsive sizing to fit iPhone 14/15 Pro (390px width)
 * V11 Task 8: Reduced motion support
 * V12: Increased touch targets (44px swatches in 52px containers) for premium feel
 */
const ColorPickerContent = ({
  colors,
  selectedColor,
  onSelectColor,
  onCustomPress,
  hideLabel = false,
}: ColorPickerSectionProps) => {
  const reduceMotion = useReduceMotion(); // V11 Task 8: Reduced motion support

  return (
    <View className='mb-6'>
      {!hideLabel && (
        <Text
          accessibilityRole='text'
          className='mb-3 text-[13px] font-semibold uppercase text-stone-500'
          style={{ letterSpacing: 0.5 }}
        >
          {STRINGS.CREATE_HABIT.colorLabel}
        </Text>
      )}
      {/* 12 colors, centered with wrapping */}
      {/* Each swatch has fixed 52px container with 44px content, providing built-in spacing */}
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
        testID='color-picker-row'
      >
        {colors.map((color) => (
          <ColorButton
            key={color}
            color={color}
            isSelected={selectedColor === color}
            reduceMotion={reduceMotion}
            onSelect={onSelectColor}
          />
        ))}
        {onCustomPress && <CustomColorButton onPress={onCustomPress} />}
      </View>
    </View>
  );
};
