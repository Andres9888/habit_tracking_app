import { useEffect, useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import ColorPicker, {
  BrightnessSlider,
  Panel1,
  Preview,
  PreviewText,
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

export function ColorPickerSheet({
  visible,
  value,
  presetColors,
  onSelect,
  onClose,
}: ColorPickerSheetProps) {
  const [currentColor, setCurrentColor] = useState(value);

  useEffect(() => {
    if (visible) {
      setCurrentColor(value);
    }
  }, [value, visible]);

  const handleColorChange = (color: ColorPickerValue) => {
    setCurrentColor(color.hex);
  };

  const handleDone = () => {
    onSelect(currentColor);
    onClose();
  };

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

          <ColorPicker
            style={{ width: '100%' }}
            value={currentColor}
            onChange={handleColorChange}
          >
            <Preview
              style={{ borderRadius: 16, height: 64, marginBottom: 16 }}
            />
            <PreviewText style={{ marginBottom: 16 }} />
            <Panel1
              style={{ borderRadius: 16, height: 220, marginBottom: 16 }}
            />
            <BrightnessSlider style={{ marginBottom: 16 }} />
            <Swatches
              colors={presetColors}
              style={{ marginBottom: 8 }}
              swatchStyle={{ borderRadius: 24, height: 44, width: 44 }}
              onSelect={(color: string) => setCurrentColor(color)}
            />
          </ColorPicker>
        </View>
      </View>
    </Modal>
  );
}
