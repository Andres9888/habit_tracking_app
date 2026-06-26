/**
 * "See the full science" opener (SPEC_02) — accent label + down chevron on a
 * quiet bordered tile; reveals the science tail. Accent is the per-category
 * science accent so it reads as the page's own affordance.
 */

import React from 'react';
import { Text } from 'react-native';
import { ArrowDown } from 'lucide-react-native';

import { iconSizes } from '@/theme/iconSizes';
import { triggerHaptic } from '@/utils/haptics';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { scienceStyles as s } from '../../styles/science.styles';
import { scienceTheme } from './scienceTheme';
import type { Template } from '../../../../types/template';

interface ScienceSeeMoreProps {
  template: Template;
  onPress: () => void;
}

export function ScienceSeeMore({ template, onPress }: ScienceSeeMoreProps) {
  const accent = scienceTheme(template).accent;
  return (
    <AnimatedPressable
      accessibilityLabel="See the full science"
      accessibilityRole="button"
      style={s.seeMore}
      onPress={() => {
        void triggerHaptic('tap');
        onPress();
      }}
    >
      <Text style={[s.seeMoreText, { color: accent }]}>See the full science</Text>
      <ArrowDown color={accent} size={iconSizes.small} strokeWidth={2.2} />
    </AnimatedPressable>
  );
}
