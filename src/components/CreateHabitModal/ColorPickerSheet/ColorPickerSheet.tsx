import { Modal, Text, TouchableOpacity, View } from 'react-native';
import ColorPicker, {
  BrightnessSlider,
  Preview,
} from 'reanimated-color-picker';
// @ts-expect-error - These exports exist but aren't in TS definitions
import { HueSlider } from 'reanimated-color-picker/lib/module/components/Sliders/Hue/HueSlider';
// @ts-expect-error - These exports exist but aren't in TS definitions
import { SaturationSlider } from 'reanimated-color-picker/lib/module/components/Sliders/HSB/SaturationSlider';

import type { ColorPickerSheetProps } from './types';
import { useColorPickerSheet } from './useColorPickerSheet';
import { LoadingState } from './LoadingState';

export function ColorPickerSheet(props: ColorPickerSheetProps) {
  const { visible, onClose } = props;
  const {
    currentColor,
    currentColorName,
    isPickerReady,
    reduceMotion,
    handleColorChange,
    handleColorComplete,
    handleDone,
  } = useColorPickerSheet(props);

  if (!visible) return null;

  return (
    <Modal
      accessibilityViewIsModal
      transparent
      accessibilityLabel='Custom color picker'
      animationType={reduceMotion ? 'none' : 'slide'}
      visible={visible}
      onRequestClose={onClose}
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
              className='text-lg font-semibold text-stone-800'
            >
              Pick a color
            </Text>
            <TouchableOpacity
              accessibilityHint='Applies the selected color and closes the picker'
              accessibilityLabel={`Done. Apply ${currentColorName} color`}
              accessibilityRole='button'
              className='rounded-full bg-stone-800 px-4 py-2'
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
            <LoadingState />
          )}
        </View>
      </View>
    </Modal>
  );
}
