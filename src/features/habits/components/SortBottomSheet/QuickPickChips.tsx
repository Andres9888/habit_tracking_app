import { Platform, Pressable, ScrollView, Text } from 'react-native';
import * as Haptics from 'expo-haptics';

import type { HabitSortMode } from '../../types';
import { QUICK_PICK_OPTIONS } from './constants';

interface QuickPickChipsProps {
  sortMode: HabitSortMode;
  onSelect: (mode: HabitSortMode) => void;
}

export function QuickPickChips({ sortMode, onSelect }: QuickPickChipsProps) {
  return (
    <ScrollView
      horizontal
      className='mb-4'
      contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}
      showsHorizontalScrollIndicator={false}
    >
      {QUICK_PICK_OPTIONS.map((option) => {
        const isSelected = sortMode === option.value;
        return (
          <Pressable
            key={option.value}
            accessibilityLabel={option.chipLabel}
            accessibilityRole='radio'
            accessibilityState={{ checked: isSelected }}
            className={`flex-row items-center gap-1.5 rounded-full px-4 py-2.5 ${
              isSelected ? 'bg-stone-800' : 'bg-stone-100 active:bg-stone-200'
            }`}
            style={{ minHeight: 44 }}
            onPress={() => {
              if (Platform.OS === 'ios' || Platform.OS === 'android') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
                  () => {}
                );
              }
              onSelect(option.value);
            }}
          >
            <option.Icon
              color={isSelected ? '#ffffff' : '#44403c'}
              size={14}
              strokeWidth={2.25}
            />
            <Text
              className={`text-[13px] font-medium ${
                isSelected ? 'text-white' : 'text-stone-700'
              }`}
            >
              {option.chipLabel}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
