import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  InteractionManager,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ColorPicker, {
  BrightnessSlider,
  HueSlider,
  Preview,
  SaturationSlider,
  Swatches,
} from 'reanimated-color-picker';
import type { ColorPickerValue } from 'reanimated-color-picker';

interface ColorPickerSheetProps {
  visible: boolean;
  value: string;
  presetColors: string[];
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

export function ColorPickerSheet({
  visible,
  value,
  presetColors,
  onSelect,
  onClose,
}: ColorPickerSheetProps) {
  const [currentColor, setCurrentColor] = useState(value);
  // Lazy mount state - delays picker render until modal animation completes
  // This prevents jank during the modal slide animation
  const [isPickerReady, setIsPickerReady] = useState(false);

  useEffect(() => {
    if (visible) {
      setCurrentColor(value);
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
  }, [value, visible]);

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
  const handleColorComplete = useCallback((color: ColorPickerValue) => {
    setCurrentColor(color.hex);
  }, []);

  const handleDone = () => {
    onSelect(currentColor);
    onClose();
  };

  // Only render ColorPicker when modal is visible to prevent performance issues
  if (!visible) {
    return null;
  }

  return (
    <Modal
      transparent
      animationType='slide'
      visible={visible}
      onRequestClose={onClose}
    >
      <View className='flex-1 justify-end bg-black/50'>
        <View className='rounded-t-3xl bg-white px-4 pb-6 pt-5 shadow-2xl'>
          <View className='mb-4 flex-row items-center justify-between'>
            <Text className='text-lg font-semibold text-[#1a1a1a]'>
              Pick a color
            </Text>
            <TouchableOpacity
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
              <Preview
                style={{ borderRadius: 12, height: 40, marginBottom: 16 }}
              />
              <HueSlider
                style={{ borderRadius: 12, height: 32, marginBottom: 12 }}
                thumbShape='pill'
              />
              <SaturationSlider
                style={{ borderRadius: 12, height: 32, marginBottom: 12 }}
                thumbShape='pill'
              />
              <BrightnessSlider
                style={{ borderRadius: 12, height: 32, marginBottom: 16 }}
                thumbShape='pill'
              />
              <Swatches
                colors={presetColors}
                style={{ marginBottom: 8 }}
                swatchStyle={{ borderRadius: 24, height: 44, width: 44 }}
                onSelect={(color: string) => setCurrentColor(color)}
              />
            </ColorPicker>
          ) : (
            // Loading state while picker initializes after modal animation
            <View
              className='items-center justify-center'
              style={{ height: 400 }}
            >
              <ActivityIndicator color='#1a1a1a' size='large' />
              <Text className='mt-4 text-sm text-slate-500'>
                Loading color picker...
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
