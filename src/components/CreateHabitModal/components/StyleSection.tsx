import { useCallback, useEffect, useRef } from 'react';
import { Animated, Pressable, Text, View, Keyboard } from 'react-native';
import { Motion } from '../../../constants/motion';
import useHapticFeedback from '../../../hooks/useHapticFeedback';

interface StyleSectionProps {
  colors: string[];
  onSelectColor: (color: string) => void;
  selectedColor: string;
  disabled?: boolean;
}

// Animated touchable for color buttons
interface AnimatedButtonProps {
  accessibilityLabel: string;
  children: React.ReactNode;
  isSelected: boolean;
  onPress: () => void;
  style?: object;
}

const AnimatedButton = ({
  accessibilityLabel,
  children,
  isSelected,
  onPress,
  style,
}: AnimatedButtonProps) => {
  const scale = useRef(new Animated.Value(1)).current;
  const wasSelected = useRef(isSelected);
  const { triggerSelection } = useHapticFeedback();

  // Trigger selection "pop" animation when this color becomes selected
  useEffect(() => {
    if (isSelected && !wasSelected.current) {
      // Animate: quick scale up then settle back
      Animated.sequence([
        Animated.timing(scale, {
          duration: Motion.duration.fast,
          easing: Motion.easing.outEase,
          toValue: 1.15,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          damping: 12,
          stiffness: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
    wasSelected.current = isSelected;
  }, [isSelected, scale]);

  const handlePressIn = useCallback(() => {
    Animated.timing(scale, {
      duration: Motion.duration.fast,
      easing: Motion.easing.inEase,
      toValue: 0.9,
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

  const handlePress = useCallback(() => {
    triggerSelection();
    onPress();
  }, [onPress, triggerSelection]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
        style={style}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};

export const StyleSection = ({
  colors,
  onSelectColor,
  selectedColor,
  disabled = false,
}: StyleSectionProps) => {
  const handleColorSelect = useCallback((color: string) => {
    if (disabled) return;
    Keyboard.dismiss(); // Dismiss keyboard when tapping color
    onSelectColor(color);
  }, [onSelectColor, disabled]);

  // Split colors into rows of 8 for 3-row layout
  const colorRows = [];
  for (let i = 0; i < colors.length; i += 8) {
    colorRows.push(colors.slice(i, i + 8));
  }

  return (
    <Animated.View
      className="mb-6 rounded-2xl bg-white p-4"
      style={{ opacity: disabled ? 0.4 : 1 }}
      pointerEvents={disabled ? 'none' : 'auto'}
    >
      <Text className="mb-3 text-sm font-bold text-slate-800">Color</Text>

      {/* Color Picker - 24 colors in 3 rows of 8 */}
      <View>
        {colorRows.map((row, rowIndex) => (
          <View
            key={`color-row-${rowIndex}`}
            className="flex-row justify-between mb-2"
          >
            {row.map((color) => (
              <AnimatedButton
                key={color}
                accessibilityLabel={`Select color ${color}`}
                isSelected={selectedColor === color}
                onPress={() => handleColorSelect(color)}
                style={{
                  alignItems: 'center',
                  backgroundColor: color,
                  borderColor: selectedColor === color ? '#1e293b' : 'transparent',
                  borderRadius: 18,
                  borderWidth: selectedColor === color ? 3 : 0,
                  height: 36,
                  justifyContent: 'center',
                  width: 36,
                }}
              >
                {selectedColor === color && (
                  <Text className="text-xs font-bold text-white">✓</Text>
                )}
              </AnimatedButton>
            ))}
          </View>
        ))}
      </View>
    </Animated.View>
  );
};

export default StyleSection;
