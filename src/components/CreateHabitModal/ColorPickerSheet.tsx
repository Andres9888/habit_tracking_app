import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  ActivityIndicator,
  InteractionManager,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ColorPicker, {
  BrightnessSlider,
  Preview,
} from 'reanimated-color-picker';
// @ts-expect-error - These exports exist but aren't in TS definitions
import { HueSlider } from 'reanimated-color-picker/lib/module/components/Sliders/Hue/HueSlider';
// @ts-expect-error - These exports exist but aren't in TS definitions
import { SaturationSlider } from 'reanimated-color-picker/lib/module/components/Sliders/HSB/SaturationSlider';
import type { ColorPickerValue } from 'reanimated-color-picker';
import {
  getLastCustomColor,
  saveLastCustomColor,
} from '../../utils/lastCustomColor';
import useHapticFeedback from '../../hooks/useHapticFeedback';
import { useReduceMotion } from '../../hooks/useReduceMotion';

interface ColorPickerSheetProps {
  visible: boolean;
  value: string;
  onSelect: (color: string) => void;
  onClose: () => void;
}

/**
 * Simple throttle function for color picker updates
 * Limits how often the callback fires during continuous drag
 */
function useThrottle(callback: (hex: string) => void, delay: number) {
  const lastCall = useRef(0);
  const lastArg = useRef<string | null>(null);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  return useMemo(() => {
    return (hex: string) => {
      const now = Date.now();
      lastArg.current = hex;

      // If enough time has passed, call immediately
      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        callback(hex);
      } else if (!timeoutId.current) {
        // Schedule trailing call
        const remaining = delay - (now - lastCall.current);
        timeoutId.current = setTimeout(() => {
          lastCall.current = Date.now();
          if (lastArg.current !== null) {
            callback(lastArg.current);
          }
          timeoutId.current = null;
        }, remaining);
      }
    };
  }, [callback, delay]);
}

/**
 * Get a human-readable color name from a hex value
 * Used for accessibility screen reader announcements
 */
function getColorName(hex: string): string {
  const colorNames: Record<string, string> = {
    '#CC0000': 'Dark Red',

    // Greens
    '#00FF00': 'Lime',

    // Reds
    '#FF0000': 'Red',

    '#008000': 'Green',

    '#FF6B6B': 'Coral Red',

    '#10B981': 'Teal Green',

    '#FF7F50': 'Coral',

    '#22C55E': 'Emerald',

    // Oranges
    '#FF8C00': 'Dark Orange',

    // Blues
    '#0000FF': 'Blue',

    '#FF4444': 'Light Red',

    '#3B82F6': 'Royal Blue',

    '#FFA500': 'Orange',

    '#06B6D4': 'Cyan',

    '#FFD700': 'Gold',

    '#8B5CF6': 'Violet',

    '#FFEDD5': 'Light Orange',

    '#60A5FA': 'Sky Blue',
    // Yellows
    '#FFFF00': 'Yellow',
    // Purples
    '#800080': 'Purple',

    '#FFC107': 'Amber',

    '#A855F7': 'Light Purple',

    // Neutrals
    '#000000': 'Black',

    '#CCFBF1': 'Mint',

    '#808080': 'Gray',

    '#DCFCE7': 'Light Green',

    '#1E293B': 'Slate',

    '#DBEAFE': 'Light Blue',

    '#EC4899': 'Pink',

    '#F3E8FF': 'Lavender',

    '#F472B6': 'Light Pink',

    '#FCE7F3': 'Rose',
    // Pinks
    '#FF69B4': 'Hot Pink',
    '#FFFFFF': 'White',
  };

  // Check for exact match (case-insensitive)
  const upperHex = hex.toUpperCase();
  if (colorNames[upperHex]) {
    return colorNames[upperHex];
  }

  // Parse hex to get approximate color name based on hue
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);

  // Calculate HSL
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2 / 255;

  if (max === min) {
    // Achromatic (gray scale)
    if (l < 0.2) return 'Dark Gray';
    if (l > 0.8) return 'Light Gray';
    return 'Gray';
  }

  const d = max - min;
  // Note: saturation calculated but not used for hue-based naming (kept for potential future use)
  const _s = l > 0.5 ? d / (2 * 255 - max - min) : d / (max + min);

  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;

  const hue = h * 360;

  // Determine color name based on hue
  const lightPrefix = l > 0.7 ? 'Light ' : l < 0.3 ? 'Dark ' : '';

  if (hue < 15 || hue >= 345) return `${lightPrefix}Red`;
  if (hue < 45) return `${lightPrefix}Orange`;
  if (hue < 75) return `${lightPrefix}Yellow`;
  if (hue < 150) return `${lightPrefix}Green`;
  if (hue < 210) return `${lightPrefix}Cyan`;
  if (hue < 270) return `${lightPrefix}Blue`;
  if (hue < 315) return `${lightPrefix}Purple`;
  return `${lightPrefix}Pink`;
}

export function ColorPickerSheet({
  visible,
  value,
  onSelect,
  onClose,
}: ColorPickerSheetProps) {
  const [currentColor, setCurrentColor] = useState(value);
  // Lazy mount state - delays picker render until modal animation completes
  // This prevents jank during the modal slide animation
  const [isPickerReady, setIsPickerReady] = useState(false);
  const { triggerSelection, triggerLightImpact } = useHapticFeedback();
  // Respect system reduce motion preference for modal animation
  const reduceMotion = useReduceMotion();

  useEffect(() => {
    if (visible) {
      // Load last custom color if available, otherwise use the passed value
      const loadInitialColor = async () => {
        const lastCustom = await getLastCustomColor();
        setCurrentColor(lastCustom ?? value);
      };
      void loadInitialColor();

      // If reduce motion is enabled, no animation delay needed - mount immediately
      if (reduceMotion) {
        setIsPickerReady(true);
        return () => {
          setIsPickerReady(false);
        };
      }

      // Wait for modal animation to complete before mounting the heavy picker
      const handle = InteractionManager.runAfterInteractions(() => {
        setIsPickerReady(true);
      });
      return () => {
        handle.cancel();
        setIsPickerReady(false);
      };
    } else {
      setIsPickerReady(false);
    }
  }, [reduceMotion, value, visible]);

  // Throttled color change handler - limits updates to every 100ms during drag
  // This prevents the app from freezing due to continuous reanimated updates
  const updateColor = useCallback((hex: string) => {
    setCurrentColor(hex);
  }, []);

  const throttledSetColor = useThrottle(updateColor, 100);

  const handleColorChange = useCallback(
    (color: ColorPickerValue) => {
      throttledSetColor(color.hex);
    },
    [throttledSetColor]
  );

  // Called when user lifts finger (touch end) - ensures final color is set
  // This is the definitive value after dragging
  const handleColorComplete = useCallback(
    (color: ColorPickerValue) => {
      setCurrentColor(color.hex);
      // Haptic feedback on color change complete
      triggerLightImpact();
      // Announce color name for screen reader users
      const colorName = getColorName(color.hex);
      AccessibilityInfo.announceForAccessibility(`Selected ${colorName}`);
    },
    [triggerLightImpact]
  );

  const handleDone = () => {
    // Haptic feedback on Done press
    triggerSelection();
    onSelect(currentColor);
    // Save the custom color for future use
    void saveLastCustomColor(currentColor);
    // Announce for screen readers
    const colorName = getColorName(currentColor);
    AccessibilityInfo.announceForAccessibility(`${colorName} color applied`);
    onClose();
  };

  // Only render ColorPicker when modal is visible to prevent performance issues
  if (!visible) {
    return null;
  }

  // Get accessible color name for current selection
  const currentColorName = getColorName(currentColor);

  return (
    <Modal
      accessibilityViewIsModal
      accessibilityLabel='Custom color picker'
      visible={visible}
      onRequestClose={onClose}
      transparent
      // Disable animation if user has reduce motion enabled
      animationType={reduceMotion ? 'none' : 'slide'}
    >
      <View className='flex-1 justify-end bg-black/50'>
        <View
          accessible
          accessibilityRole='none'
          className='rounded-t-3xl bg-white px-4 pb-6 pt-5 shadow-2xl'
        >
          <View className='mb-4 flex-row items-center justify-between'>
            <Text
              accessibilityRole='header'
              className='text-lg font-semibold text-[#1a1a1a]'
            >
              Pick a color
            </Text>
            <TouchableOpacity
              accessibilityHint='Applies the selected color and closes the picker'
              accessibilityLabel={`Done. Apply ${currentColorName} color`}
              accessibilityRole='button'
              className='rounded-full bg-[#1a1a1a] px-4 py-2'
              onPress={handleDone}
            >
              <Text className='text-sm font-semibold text-white'>Done</Text>
            </TouchableOpacity>
          </View>

          {isPickerReady ? (
            <ColorPicker
              style={{ width: '100%' }}
              value={currentColor}
              onChange={handleColorChange}
              onComplete={handleColorComplete}
            >
              <View
                accessible
                accessibilityLabel={`Color preview: ${currentColorName}`}
                accessibilityRole='image'
              >
                <Preview
                  style={{ borderRadius: 12, height: 40, marginBottom: 16 }}
                />
              </View>
              <View
                accessible
                accessibilityHint='Adjusts the base color from red through the rainbow to violet'
                accessibilityLabel='Hue slider. Drag to change color'
                accessibilityRole='adjustable'
              >
                <HueSlider
                  style={{ borderRadius: 12, height: 32, marginBottom: 12 }}
                  thumbShape='pill'
                />
              </View>
              <View
                accessible
                accessibilityHint='Adjusts how vivid or muted the color is'
                accessibilityLabel='Saturation slider. Drag to change color intensity'
                accessibilityRole='adjustable'
              >
                <SaturationSlider
                  style={{ borderRadius: 12, height: 32, marginBottom: 12 }}
                  thumbShape='pill'
                />
              </View>
              <View
                accessible
                accessibilityHint='Adjusts how light or dark the color is'
                accessibilityLabel='Brightness slider. Drag to change brightness'
                accessibilityRole='adjustable'
              >
                <BrightnessSlider
                  style={{ borderRadius: 12, height: 32, marginBottom: 8 }}
                />
              </View>
            </ColorPicker>
          ) : (
            // Loading state while picker initializes after modal animation
            <View
              accessible
              accessibilityLabel='Loading color picker'
              accessibilityRole='progressbar'
              className='items-center justify-center'
              style={{ height: 400 }}
            >
              <ActivityIndicator color='#1a1a1a' size='large' />
              <Text className='mt-4 text-sm text-stone-500'>
                Loading color picker...
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
