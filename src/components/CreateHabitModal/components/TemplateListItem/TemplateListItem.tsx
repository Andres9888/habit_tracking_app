import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Microscope } from 'lucide-react-native';
import Animated from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import { useThemeColors } from '@/theme/ThemeContext';
import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';
import { useReduceMotion } from '../../../../hooks/useReduceMotion';
import type { HabitTemplate } from '../../types';
import { useTemplateListItemAnimations } from './useTemplateListItemAnimations';
import { useTemplateListItemHandlers } from './useTemplateListItemHandlers';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface TemplateListItemProps {
  index?: number;
  template: HabitTemplate;
  onSelect: (template: HabitTemplate) => void;
  onViewScience: (template: HabitTemplate) => void;
}

const TemplateListItemComponent = ({
  index = 0,
  template,
  onSelect,
  onViewScience,
}: TemplateListItemProps) => {
  const reduceMotion = useReduceMotion();
  const { triggerLightImpact, triggerSelection } = useHapticFeedback({});
  const { colors: themeColors } = useThemeColors();

  const {
    templateScale,
    scienceScale,
    entranceAnimatedStyle,
    templateAnimatedStyle,
    scienceAnimatedStyle,
  } = useTemplateListItemAnimations(index, reduceMotion);

  const {
    handleTemplatePressIn,
    handleTemplatePressOut,
    handleSciencePressIn,
    handleSciencePressOut,
  } = useTemplateListItemHandlers({
    reduceMotion,
    scienceScale,
    templateScale,
    triggerLightImpact,
  });

  return (
    <Animated.View style={entranceAnimatedStyle}>
      <View className='flex-row items-center gap-3 border-b p-4' style={{ borderColor: themeColors.border }}>
        <AnimatedPressable
          accessibilityLabel={`Select ${template.name} template`}
          accessibilityRole='button'
          className='flex-1 flex-row items-center gap-3'
          style={templateAnimatedStyle}
          onPress={() => {
            triggerSelection();
            onSelect(template);
          }}
          onPressIn={handleTemplatePressIn}
          onPressOut={handleTemplatePressOut}
        >
          <View
            className='h-12 w-12 items-center justify-center rounded-xl'
            style={{ backgroundColor: template.iconColor + '20' }}
          >
            <Text className='text-xl'>{template.icon}</Text>
          </View>
          <View className='flex-1'>
            <Text
              className='text-[15px] font-semibold'
              numberOfLines={1}
              style={{ color: themeColors.text.primary }}
            >
              {template.name}
            </Text>
            <Text
              className='text-[13px] font-normal'
              numberOfLines={2}
              style={{ color: themeColors.text.secondary }}
            >
              {template.description}
            </Text>
          </View>
        </AnimatedPressable>
        <AnimatedPressable
          accessibilityLabel={`View science for ${template.name}`}
          accessibilityRole='button'
          className='h-11 w-11 items-center justify-center rounded-full'
          style={[
            { backgroundColor: themeColors.status.infoLight },
            scienceAnimatedStyle,
          ]}
          onPress={() => {
            triggerSelection();
            onViewScience(template);
          }}
          onPressIn={handleSciencePressIn}
          onPressOut={handleSciencePressOut}
        >
          <Microscope color={colors.secondary[500]} size={18} strokeWidth={2} />
        </AnimatedPressable>
      </View>
    </Animated.View>
  );
};

export const TemplateListItem = memo(TemplateListItemComponent);
