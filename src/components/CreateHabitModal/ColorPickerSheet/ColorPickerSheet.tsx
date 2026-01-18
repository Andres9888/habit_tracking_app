import { Modal, Text, TouchableOpacity, View } from 'react-native';

import type { ColorPickerSheetProps } from './types';
import { useColorPickerSheet } from './useColorPickerSheet';
import { LoadingState } from './LoadingState';
import { ColorSliders } from './ColorSliders';

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
            <ColorSliders
              currentColor={currentColor}
              currentColorName={currentColorName}
              onColorChange={handleColorChange}
              onColorComplete={handleColorComplete}
            />
          ) : (
            <LoadingState />
          )}
        </View>
      </View>
    </Modal>
  );
}
