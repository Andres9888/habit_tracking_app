/** SortPicker — grouped card layout for selecting habit sort mode */

import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { shadows } from '@/theme';
import { typography, fontWeights } from '@/theme/typography';
import { durations, enterEasing } from '@/theme/animations';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useThemeColors } from '../../theme/ThemeContext';
import { SORT_SECTIONS } from './SortPicker.constants';
import { SortOptionRow } from './SortOptionRow';
import type { HabitSortMode } from '../../features/habits/types';

interface SortPickerProps {
  currentMode: HabitSortMode;
  onBack: () => void;
  onSelect: (mode: HabitSortMode) => void;
}

const stagger = (index: number) =>
  FadeInDown.delay(Math.min(index, 5) * durations.stagger).duration(durations.enter).easing(enterEasing);

export function SortPicker({ currentMode, onBack, onSelect }: SortPickerProps) {
  const { colors } = useThemeColors();

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      <View style={{ backgroundColor: colors.background }}>
        <ScreenHeader leftAction='back' rightAction={null} title='Sort Order' onBack={onBack} />
      </View>

      <Animated.ScrollView
        className='flex-1 px-4'
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className='gap-5'>
          {SORT_SECTIONS.map((section, sectionIndex) => (
            <Animated.View key={section.key} entering={stagger(sectionIndex)}>
              <Text
                className='mb-1 px-1'
                style={{ ...typography.caption, fontWeight: fontWeights.semibold, color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: 0.5 }}
              >
                {section.title}
              </Text>
              <Text className='mb-2 px-1' style={{ ...typography.caption, color: colors.text.tertiary }}>
                {section.subtitle}
              </Text>

              <View className='overflow-hidden rounded-2xl' style={{ backgroundColor: colors.card, ...shadows.card }}>
                {section.options.map((option, optionIndex) => (
                  <SortOptionRow
                    key={option.value}
                    option={option}
                    selected={currentMode === option.value}
                    showBorder={optionIndex < section.options.length - 1}
                    onSelect={onSelect}
                  />
                ))}
              </View>
            </Animated.View>
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
}
