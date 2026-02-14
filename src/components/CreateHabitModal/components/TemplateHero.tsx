import { Animated, Text, View } from 'react-native';
import { BookOpen, ChevronRight } from 'lucide-react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import STRINGS from '../../../constants/strings';

interface TemplateHeroProps {
  isEditMode: boolean;
  isOpen: boolean;
  chevronRotation: Animated.AnimatedInterpolation<string>;
  onPress: () => void;
}

export const TemplateHero = ({
  isEditMode,
  isOpen,
  chevronRotation,
  onPress,
}: TemplateHeroProps) => {
  if (isEditMode) return null;
  const label = isOpen ? 'Hide template browser' : 'Start from template';
  const subtitle = isOpen
    ? 'Hide template browser'
    : STRINGS.CREATE_HABIT.templateHeroSubtitle;

  return (
    <AnimatedPressable
      accessibilityLabel={label}
      accessibilityRole='button'
      className='mb-6 mt-2 flex-row items-center rounded-3xl bg-[#E8EDFF] px-[18px] py-4 shadow-lg shadow-black/10'
      style={{ elevation: 3 }}
      onPress={onPress}
    >
      <View
        className='mr-4 h-11 w-11 items-center justify-center rounded-full bg-white shadow-md shadow-black/10'
        style={{ elevation: 2 }}
      >
        <BookOpen color='#1A1816' size={20} strokeWidth={2} />
      </View>
      <View className='h-[80px] flex-1'>
        <Text className='text-lg font-bold text-[#1A1816]'>
          {STRINGS.CREATE_HABIT.templateHeroTitle}
        </Text>
        <Text className='mt-1 text-[13px] font-normal text-stone-500'>
          {subtitle}
        </Text>
      </View>
      <Animated.View style={{ transform: [{ rotate: chevronRotation }] }}>
        <ChevronRight color='#1A1816' size={18} strokeWidth={2.5} />
      </Animated.View>
    </AnimatedPressable>
  );
};
