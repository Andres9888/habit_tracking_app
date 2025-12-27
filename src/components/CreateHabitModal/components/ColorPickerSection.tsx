import { Plus } from 'lucide-react-native';
import {
  AccessibilityInfo,
  Animated,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCallback, useEffect, useRef } from 'react';
import useHapticFeedback from '../../../hooks/useHapticFeedback';
import STRINGS from '../../../constants/strings';
import { Motion } from '../../../constants/motion';
import { getColorName } from '../constants';

interface ColorPickerSectionProps {
  colors: readonly string[];
  selectedColor: string;
  onSelectColor: (color: string) => void;
  onCustomPress: () => void;
}

export const ColorPickerSection = ({
  colors,
  selectedColor,
  onSelectColor,
  onCustomPress,
}: ColorPickerSectionProps) => (
  <ColorPickerContent
    colors={colors}
    selectedColor={selectedColor}
    onCustomPress={onCustomPress}
    onSelectColor={onSelectColor}
  />
);

// Separate component to fix Rules of Hooks
interface ColorButtonProps {
  color: string;
  isSelected: boolean;
  onSelect: (color: string) => void;
}

/**
 * Individual color swatch button with selection animation
 * Spec: 44x44px base, scale(1.12) when selected, 2.5px ring
 */
const ColorButton = ({ color, isSelected, onSelect }: ColorButtonProps) => {
  const scale = useRef(new Animated.Value(isSelected ? 1.12 : 1)).current;
  const wasSelected = useRef(isSelected);
  const { triggerSelection } = useHapticFeedback();
  const colorName = getColorName(color);

  // Animate scale when selection changes
  useEffect(() => {
    if (isSelected !== wasSelected.current) {
      if (isSelected) {
        // Animate to selected scale with spring
        Animated.spring(scale, {
          damping: 12,
          stiffness: 180,
          toValue: 1.12,
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
  }, [isSelected, scale]);

  const handlePress = useCallback(() => {
    triggerSelection();
    onSelect(color);
    // Announce color selection with human-readable name for screen readers
    AccessibilityInfo.announceForAccessibility(`Selected ${colorName} color`);
  }, [color, colorName, onSelect, triggerSelection]);

  const handlePressIn = useCallback(() => {
    Animated.timing(scale, {
      duration: Motion.duration.fast,
      easing: Motion.easing.inEase,
      toValue: isSelected ? 1.05 : 0.96,
      useNativeDriver: true,
    }).start();
  }, [isSelected, scale]);

  const handlePressOut = useCallback(() => {
    Animated.timing(scale, {
      duration: Motion.duration.base,
      easing: Motion.easing.outEase,
      toValue: isSelected ? 1.12 : 1,
      useNativeDriver: true,
    }).start();
  }, [isSelected, scale]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        accessibilityLabel={`${colorName} color${isSelected ? ', selected' : ''}`}
        accessibilityRole='button'
        accessibilityState={{ selected: isSelected }}
        style={{
          alignItems: 'center',
          backgroundColor: color,
          borderColor: '#1c1917', // stone-800
          borderRadius: 999,
          borderWidth: isSelected ? 2.5 : 0,
          height: 26,
          justifyContent: 'center',
          width: 26,
        }}
        testID={`color-swatch-${color.replace('#', '')}`}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      />
    </Animated.View>
  );
};

// Custom color button with dashed border and plus icon
const CustomColorButton = ({ onPress }: { onPress: () => void }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const { triggerSelection } = useHapticFeedback();

  const handlePress = useCallback(() => {
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
          height: 26,
          justifyContent: 'center',
          width: 26,
        }}
        testID='color-swatch-custom'
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Plus color='#a8a29e' size={14} />
      </TouchableOpacity>
    </Animated.View>
  );
};

/**
 * V8 Color Picker - 12 colors in a single row
 * Responsive sizing to fit iPhone 14/15 Pro (390px width)
 * Uses justify-between for even spacing
 */
const ColorPickerContent = ({
  colors,
  selectedColor,
  onSelectColor,
  onCustomPress,
}: ColorPickerSectionProps) => {
  return (
    <View className='mb-6'>
      <Text
        className='mb-3 text-[13px] font-semibold uppercase text-stone-500'
        style={{ letterSpacing: 0.5 }}
      >
        {STRINGS.CREATE_HABIT.colorLabel}
      </Text>
      {/* 12 colors + custom button = 13 items, justify-between for even spacing */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
        testID='color-picker-row'
      >
        {colors.map((color) => (
          <ColorButton
            key={color}
            color={color}
            isSelected={selectedColor === color}
            onSelect={onSelectColor}
          />
        ))}
        <CustomColorButton onPress={onCustomPress} />
      </View>
    </View>
  );
};
