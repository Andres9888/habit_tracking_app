import { Animated, Text, View } from 'react-native';
import { BookOpen, ChevronRight } from 'lucide-react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useThemeColors } from '@/theme/ThemeContext';
import STRINGS from '../../../constants/strings';
import { iconSizes } from '@/theme/iconSizes';

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
  const { colors: themeColors } = useThemeColors();
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
        <BookOpen color='#111827' size={iconSizes.medium} strokeWidth={2} />
      </View>
      <View className='h-[80px] flex-1'>
        <Text className='text-lg font-bold text-[#111827]'>
          {STRINGS.CREATE_HABIT.templateHeroTitle}
        </Text>
        <Text className='mt-1 text-sm font-normal' style={{ color: themeColors.text.secondary }}>
          {subtitle}
        </Text>
      </View>
      <Animated.View style={{ transform: [{ rotate: chevronRotation }] }}>
        <ChevronRight color='#111827' size={iconSizes.medium} strokeWidth={2.5} />
      </Animated.View>
    </AnimatedPressable>
  );
};
