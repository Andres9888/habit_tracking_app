import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import { Microscope } from 'lucide-react-native';
import type { HabitTemplate } from '../types';

interface TemplateListItemProps {
  template: HabitTemplate;
  onSelect: (template: HabitTemplate) => void;
  onViewScience: (template: HabitTemplate) => void;
}

export const TemplateListItem = ({
  template,
  onSelect,
  onViewScience,
}: TemplateListItemProps) => (
  <View className='flex-row items-center gap-3 border-b border-stone-50 p-3'>
    <Pressable
      accessibilityLabel={`Select ${template.name} template`}
      accessibilityRole='button'
      className='flex-1 flex-row items-center gap-3'
      onPress={() => onSelect(template)}
    >
      <View
        className='h-12 w-12 items-center justify-center rounded-xl'
        style={{ backgroundColor: template.iconColor + '20' }}
      >
        <Text className='text-xl'>{template.icon}</Text>
      </View>
      <View className='flex-1'>
        <Text
          className='text-[15px] font-semibold text-stone-800'
          numberOfLines={1}
        >
          {template.name}
        </Text>
        <Text
          className='text-[13px] font-normal text-stone-500'
          numberOfLines={2}
        >
          {template.description}
        </Text>
      </View>
    </Pressable>
    <TouchableOpacity
      accessibilityLabel={`View science for ${template.name}`}
      accessibilityRole='button'
      className='h-9 w-9 items-center justify-center rounded-full bg-blue-50'
      onPress={() => onViewScience(template)}
    >
      <Microscope color='#3B82F6' size={16} strokeWidth={2} />
    </TouchableOpacity>
  </View>
);
