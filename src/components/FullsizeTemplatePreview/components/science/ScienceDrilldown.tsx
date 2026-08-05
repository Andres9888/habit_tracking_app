/**
 * Science drill-down — the stacked pre-add detail that earns the add:
 * why it works → what you'll feel → what to expect → how to start →
 * how it becomes automatic → the research.
 *
 * Each section is wrapped so its scroll Y can be reported to the jump chips.
 * Only available sections render, so empty ones leave no gap.
 */

import React from 'react';
import { View, type LayoutChangeEvent } from 'react-native';

import { scienceStyles as s } from '../../styles/science.styles';
import { availableSections, type SectionKey } from '../../utils/sectionAvailability';
import { WhyItWorksCard } from './WhyItWorksCard';
import { BenefitsBlock } from './BenefitsBlock';
import { TimelineBlock } from './TimelineBlock';
import { HowToStartBlock } from './HowToStartBlock';
import { StrengthExplainerBlock } from './StrengthExplainerBlock';
import { SourcesBlock } from './SourcesBlock';
import type { Template } from '../../../../types/template';

interface ScienceDrilldownProps {
  template: Template;
  onSectionLayout: (key: SectionKey, y: number) => void;
}

export function ScienceDrilldown({ template, onSectionLayout }: ScienceDrilldownProps) {
  const keys = availableSections(template);
  const on = (key: SectionKey) => (e: LayoutChangeEvent) => onSectionLayout(key, e.nativeEvent.layout.y);
  return (
    <View style={s.stack}>
      {keys.includes('why') ? (
        <View onLayout={on('why')}><WhyItWorksCard template={template} /></View>
      ) : null}
      {keys.includes('feel') ? (
        <View onLayout={on('feel')}><BenefitsBlock template={template} /></View>
      ) : null}
      {keys.includes('timeline') ? (
        <View onLayout={on('timeline')}><TimelineBlock template={template} /></View>
      ) : null}
      {keys.includes('start') ? (
        <View onLayout={on('start')}><HowToStartBlock template={template} /></View>
      ) : null}
      <View onLayout={on('strength')}><StrengthExplainerBlock /></View>
      {keys.includes('research') ? (
        <View onLayout={on('research')}><SourcesBlock template={template} /></View>
      ) : null}
    </View>
  );
}
