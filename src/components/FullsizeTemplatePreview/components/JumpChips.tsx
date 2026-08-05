/**
 * Sticky jump chips — a horizontal unit-chip row that jumps to a science
 * section on tap and highlights the section currently under the header.
 */

import React from 'react';
import { ScrollView, Text, type LayoutChangeEvent } from 'react-native';

import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { jumpChipsStyles as s } from '../styles/jumpChips.styles';
import { SECTIONS, type SectionKey } from '../utils/sectionAvailability';

interface JumpChipsProps {
  sections: SectionKey[];
  activeKey: SectionKey | null;
  onChipPress: (key: SectionKey) => void;
  onLayout: (e: LayoutChangeEvent) => void;
}

export function JumpChips({ sections, activeKey, onChipPress, onLayout }: JumpChipsProps) {
  const visible = SECTIONS.filter((sec) => sections.includes(sec.key));
  return (
    <ScrollView
      horizontal
      contentContainerStyle={s.row}
      showsHorizontalScrollIndicator={false}
      style={s.wrap}
      onLayout={onLayout}
    >
      {visible.map((sec) => {
        const active = sec.key === activeKey;
        return (
          <AnimatedPressable
            key={sec.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            testID={`templates-preview-jump-${sec.key}`}
            style={[s.chip, active && s.chipActive]}
            onPress={() => onChipPress(sec.key)}
          >
            <Text style={[s.chipText, active && s.chipTextActive]}>{sec.label}</Text>
          </AnimatedPressable>
        );
      })}
    </ScrollView>
  );
}
