import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';

interface TemplateListFooterProps {
  onClose: () => void;
}

export const TemplateListFooter = ({ onClose }: TemplateListFooterProps) => (
  <View className='px-4 pb-6 pt-3'>
    <TouchableOpacity
      accessibilityLabel='Hide template browser'
      accessibilityRole='button'
      className='flex-row items-center justify-center rounded-full bg-[#f4f4f4] px-4 py-2'
      onPress={onClose}
    >
      <Text className='mr-2 text-[15px] font-semibold text-stone-800'>Hide habits</Text>
      <ChevronDown color='#1c1917' size={16} />
    </TouchableOpacity>
  </View>
);
