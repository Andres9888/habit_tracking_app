import { Plus } from 'lucide-react-native';
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

// Separate component to fix Rules of Hooks
interface ColorButtonProps {
  color: string;
  isSelected: boolean;
  onSelect: (color: string) => void;
}

const ColorButton = ({ color, isSelected, onSelect }: ColorButtonProps) => {
  const scale = useRef(new Animated.Value(1)).current;
  const { triggerSelection } = useHapticFeedback();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        accessibilityLabel={`Select ${color} color`}
        accessibilityRole='button'
        className='h-11 w-11 items-center justify-center rounded-full'
        style={{
          backgroundColor: color,
          borderColor: '#1a1a1a',
          borderWidth: isSelected ? 2 : 0,
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
          onSelect(color);
        }}
      />
    </Animated.View>
  );
};

// Custom color button with dashed border and plus icon
const CustomColorButton = ({ onPress }: { onPress: () => void }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const { triggerSelection } = useHapticFeedback();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        accessibilityLabel='Choose custom color'
        accessibilityRole='button'
        className='h-11 w-11 items-center justify-center rounded-full'
        style={{
          borderColor: '#a8a29e',
          borderWidth: 2,
          borderStyle: 'dashed',
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
          onPress();
        }}
      >
        <Plus color='#a8a29e' size={20} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const ColorPickerContent = ({ colors, selectedColor, onSelectColor, onCustomPress }: ColorPickerSectionProps) => {
  return (
    <View className='mb-6'>
      <Text className='mb-3 text-base font-semibold text-[#1a1a1a]'>
        {STRINGS.CREATE_HABIT.colorLabel}
      </Text>
      <View className='flex-row flex-wrap gap-3'>
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
