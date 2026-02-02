/**
 * ColorSliders - Color picker sliders for hue, saturation, brightness
 */

import { View } from 'react-native';
import ColorPicker, {
  BrightnessSlider,
  Preview,
} from 'reanimated-color-picker';
import type { ColorPickerValue } from 'reanimated-color-picker';
// @ts-expect-error - These exports exist but aren't in TS definitions
import { HueSlider } from 'reanimated-color-picker/lib/module/components/Sliders/Hue/HueSlider';
// @ts-expect-error - These exports exist but aren't in TS definitions
import { SaturationSlider } from 'reanimated-color-picker/lib/module/components/Sliders/HSB/SaturationSlider';

interface ColorSlidersProps {
  currentColor: string;
  currentColorName: string;
  onColorChange: (color: ColorPickerValue) => void;
  onColorComplete: (color: ColorPickerValue) => void;
}

export function ColorSliders({
  currentColor,
  currentColorName,
  onColorChange,
  onColorComplete,
}: ColorSlidersProps) {
  return (
    <ColorPicker
      style={{ width: '100%' }}
      value={currentColor}
      onChange={onColorChange}
      onComplete={onColorComplete}
    >
      <View
        accessible
        accessibilityLabel={`Color preview: ${currentColorName}`}
        accessibilityRole='image'
      >
        <Preview style={{ borderRadius: 12, height: 40, marginBottom: 16 }} />
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
  );
}
