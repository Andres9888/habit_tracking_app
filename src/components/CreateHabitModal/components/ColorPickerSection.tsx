import { Palette } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

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
  <View className='mb-6'>
    <Text className='mb-3 text-base font-semibold text-[#1a1a1a]'>Color</Text>
    <View className='flex-row flex-wrap gap-3'>
      {colors.map((color) => (
        <TouchableOpacity
          key={color}
          accessibilityLabel={`Select ${color} color`}
          accessibilityRole='button'
          className='h-10 w-10 items-center justify-center rounded-full'
          style={{
            backgroundColor: color,
            borderColor: '#1a1a1a',
            borderWidth: selectedColor === color ? 2 : 0,
          }}
          onPress={() => onSelectColor(color)}
        />
      ))}
    </View>
    <TouchableOpacity
      accessibilityRole='button'
      className='mt-4 w-full flex-row items-center gap-2 rounded-full bg-white px-3 py-2'
      onPress={onCustomPress}
    >
      <Palette color='#1a1a1a' size={16} />
      <Text className='flex-1 text-sm font-medium text-[#1a1a1a]'>Custom color</Text>
      <View
        className='h-4 w-4 rounded-full border border-[#1a1a1a]'
        style={{ backgroundColor: selectedColor }}
      />
    </TouchableOpacity>
  </View>
);
