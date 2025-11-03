import { Palette } from 'lucide-react-native';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { useRef } from 'react';
import useHapticFeedback from '../../../hooks/useHapticFeedback';
import STRINGS from '../../../constants/strings';
import { Motion } from '../../../constants/motion';

interface ColorPickerSectionProps {
  colors: string[];
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
    onSelectColor={onSelectColor}
    onCustomPress={onCustomPress}
  />
);

const ColorButton = ({ color, selected, onSelectColor, triggerSelection }: { color: string; selected: boolean; onSelectColor: (color: string) => void; triggerSelection: () => void }) => {
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        accessibilityLabel={`Select ${color} color`}
        accessibilityRole='button'
        className='h-10 w-10 items-center justify-center rounded-full'
        style={{
          backgroundColor: color,
          borderColor: '#1a1a1a',
          borderWidth: selected ? 2 : 0,
        }}
        onPressIn={() => {
          Animated.timing(scale, {
            duration: Motion.duration.fast,
            easing: Motion.easing.inEase,
            toValue: 0.94,
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
          triggerSelection();
          onSelectColor(color);
        }}
      />
    </Animated.View>
  );
};

const ColorPickerContent = ({ colors, selectedColor, onSelectColor, onCustomPress }: ColorPickerSectionProps) => {
  const { triggerSelection } = useHapticFeedback();
  return (
    <View className='mb-6'>
      <Text className='mb-1 text-base font-semibold text-[#1a1a1a]'>
        {STRINGS.CREATE_HABIT.colorLabel}
      </Text>
      <Text className='mb-3 text-sm text-[#64748b]'>
        {STRINGS.CREATE_HABIT.colorHelper}
      </Text>
      <View className='flex-row flex-wrap gap-3'>
        {colors.map((color) => (
          <ColorButton
            key={color}
            color={color}
            selected={selectedColor === color}
            onSelectColor={onSelectColor}
            triggerSelection={triggerSelection}
          />
        ))}
      </View>
      <TouchableOpacity
        accessibilityRole='button'
        className='mt-4 w-full flex-row items-center gap-2 rounded-full bg-white px-3 py-2'
        onPress={() => {
          triggerSelection();
          onCustomPress();
        }}
      >
        <Palette color='#1a1a1a' size={16} />
        <Text className='flex-1 text-sm font-medium text-[#1a1a1a]'>
          {STRINGS.CREATE_HABIT.customColor}
        </Text>
        <View className='h-4 w-4 rounded-full border border-[#1a1a1a]' style={{ backgroundColor: selectedColor }} />
      </TouchableOpacity>
    </View>
  );
};
