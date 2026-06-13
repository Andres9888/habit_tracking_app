import { Animated, Text, View } from 'react-native';
import { BookOpen, ChevronRight } from 'lucide-react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useThemeColors } from '@/theme/ThemeContext';
import { shadows } from '@/theme/spacing';
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
  const { colors: themeColors, isDark } = useThemeColors();
  if (isEditMode) return null;
  // Light keeps the lavender brand-accent card; dark themes the whole surface
  // so content stays legible and the card doesn't glare against the dark canvas.
  const cardBg = isDark ? themeColors.card : '#E8EDFF';
  const iconBg = isDark ? themeColors.surface : '#FFFFFF';
  const contentColor = isDark ? themeColors.text.primary : '#111827';
  const label = isOpen ? 'Hide template browser' : 'Start from template';
  const subtitle = isOpen
    ? 'Hide template browser'
    : STRINGS.CREATE_HABIT.templateHeroSubtitle;

  return (
    <AnimatedPressable
      accessibilityLabel={label}
      accessibilityRole='button'
      className='mb-6 mt-2 flex-row items-center rounded-3xl px-[18px] py-4'
      style={[{ elevation: 3, backgroundColor: cardBg }, shadows.floatingActionButton]}
      onPress={onPress}
    >
      <View
        className='mr-4 h-11 w-11 items-center justify-center rounded-full'
        style={[{ elevation: 2, backgroundColor: iconBg }, shadows.floatingActionButton]}
      >
        <BookOpen color={contentColor} size={iconSizes.medium} strokeWidth={2} />
      </View>
      <View className='h-[80px] flex-1'>
        <Text className='text-lg font-bold' style={{ color: contentColor }}>
          {STRINGS.CREATE_HABIT.templateHeroTitle}
        </Text>
        <Text className='mt-1 text-sm font-normal' style={{ color: themeColors.text.secondary }}>
          {subtitle}
        </Text>
      </View>
      <Animated.View style={{ transform: [{ rotate: chevronRotation }] }}>
        <ChevronRight color={contentColor} size={iconSizes.medium} strokeWidth={2.5} />
      </Animated.View>
    </AnimatedPressable>
  );
};
