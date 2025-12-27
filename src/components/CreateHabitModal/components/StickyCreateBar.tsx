import { useEffect, useMemo, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Check } from 'lucide-react-native';
import STRINGS from '../../../constants/strings';
import { Motion } from '../../../constants/motion';
import { useKeyboardState } from '../hooks/useKeyboardState';
import useHapticFeedback from '../../../hooks/useHapticFeedback';

interface StickyCreateBarProps {
  disabled: boolean;
  onPress: () => void;
  selectedColor?: string;
}

/**
 * Creates a darker shade of a hex color for gradient effect
 * @param hex - The hex color (e.g., '#22C55E')
 * @param percent - How much darker (0-100), default 20%
 * @returns The darker hex color
 */
const darkenColor = (hex: string, percent: number = 20): string => {
  // Remove # if present
  const color = hex.replace('#', '');

  // Parse RGB values
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  // Calculate darker values
  const darkerR = Math.max(0, Math.floor(r * (1 - percent / 100)));
  const darkerG = Math.max(0, Math.floor(g * (1 - percent / 100)));
  const darkerB = Math.max(0, Math.floor(b * (1 - percent / 100)));

  // Convert back to hex
  return `#${darkerR.toString(16).padStart(2, '0')}${darkerG.toString(16).padStart(2, '0')}${darkerB.toString(16).padStart(2, '0')}`;
};

// Default green color for the button when no color is selected
const DEFAULT_BUTTON_COLOR = '#22C55E';

export const StickyCreateBar = ({ disabled, onPress, selectedColor }: StickyCreateBarProps) => {
  const insets = useSafeAreaInsets();
  const { isKeyboardVisible, keyboardHeight } = useKeyboardState();
  const { triggerSuccess } = useHapticFeedback();
  const scale = useRef(new Animated.Value(1)).current;

  // Animation for smooth color transitions
  const colorOpacity = useRef(new Animated.Value(1)).current;
  const previousColorRef = useRef<string>(selectedColor ?? DEFAULT_BUTTON_COLOR);

  // Animate color transitions when selectedColor changes
  useEffect(() => {
    const currentColor = selectedColor ?? DEFAULT_BUTTON_COLOR;
    if (previousColorRef.current !== currentColor) {
      // Quick fade out and in for smooth color transition
      Animated.sequence([
        Animated.timing(colorOpacity, {
          toValue: 0.85,
          duration: Motion.duration.fast,
          easing: Motion.easing.inEase,
          useNativeDriver: true,
        }),
        Animated.timing(colorOpacity, {
          toValue: 1,
          duration: Motion.duration.base,
          easing: Motion.easing.outEase,
          useNativeDriver: true,
        }),
      ]).start();
      previousColorRef.current = currentColor;
    }
  }, [selectedColor, colorOpacity]);

  const bottom = useMemo(() => {
    // Keep bar above keyboard if visible; otherwise rest on safe area
    if (isKeyboardVisible) return keyboardHeight + 12;
    return Math.max(insets.bottom, 12) + 12;
  }, [insets.bottom, isKeyboardVisible, keyboardHeight]);

  // Compute gradient colors based on selected color (or default green)
  const buttonColor = selectedColor ?? DEFAULT_BUTTON_COLOR;
  const gradientColors = useMemo(() => {
    if (disabled) {
      return ['#a8a29e', '#78716c'] as const; // Disabled gray gradient
    }
    return [buttonColor, darkenColor(buttonColor, 25)] as const;
  }, [disabled, buttonColor]);

  return (
    <View
      pointerEvents='box-none'
      style={{ position: 'absolute', left: 16, right: 16, bottom }}
    >
      <View className='rounded-2xl bg-white/95 p-2 shadow-lg shadow-stone-300/40'>
        <Animated.View style={{ transform: [{ scale }], opacity: colorOpacity }}>
          <Pressable
            accessibilityLabel={STRINGS.CREATE_HABIT.createAction}
            accessibilityRole='button'
            accessibilityState={{ disabled }}
            disabled={disabled}
            onPressIn={() => {
              Animated.timing(scale, {
                duration: Motion.duration.fast,
                easing: Motion.easing.inEase,
                toValue: 0.98,
                useNativeDriver: true,
              }).start();
            }}
            onPressOut={() => {
              Animated.timing(scale, {
                duration: Motion.duration.base,
                easing: Motion.easing.outEase,
                toValue: 1,
                useNativeDriver: true,
              }).start();
            }}
            onPress={() => {
              if (!disabled) {
                triggerSuccess();
                onPress();
              }
            }}
          >
            <LinearGradient
              colors={gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className='flex-row items-center justify-center rounded-xl py-3.5'
            >
              <Check color='#ffffff' size={18} strokeWidth={2.5} />
              <Text className='ml-2 text-[15px] font-semibold text-white'>
                {STRINGS.CREATE_HABIT.createAction}
              </Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
};

export default StickyCreateBar;
