/**
 * Science drill-down — the stacked pre-add detail that earns the add:
 * why it works → what you'll feel → what to expect → how to start →
 * how it becomes automatic → the research.
 *
 * Each block renders only when its data is present (graceful fallback), so
 * lightly-authored templates still get a clean, credible page.
 */

import React from 'react';
import { View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';

import { scienceStyles as s } from '../../styles/science.styles';
import { WhyItWorksCard } from './WhyItWorksCard';
import { BenefitsBlock } from './BenefitsBlock';
import { TimelineBlock } from './TimelineBlock';
import { HowToStartBlock } from './HowToStartBlock';
import { StrengthExplainerBlock } from './StrengthExplainerBlock';
import { SourcesBlock } from './SourcesBlock';
import type { Template } from '../../../../types/template';

interface SectionRegistration {
  ref: (node: View | null) => void;
  onLayout: (event: LayoutChangeEvent) => void;
}

interface ScienceDrilldownProps {
  template: Template;
  registerSection: (key: string) => SectionRegistration;
}

export function ScienceDrilldown({ template, registerSection }: ScienceDrilldownProps) {
  return (
    <View style={s.stack}>
      <View {...registerSection('why')}>
        <WhyItWorksCard template={template} />
      </View>
      <View {...registerSection('feel')}>
        <BenefitsBlock template={template} />
      </View>
      <View {...registerSection('expect')}>
        <TimelineBlock template={template} />
      </View>
      <View {...registerSection('start')}>
        <HowToStartBlock template={template} />
      </View>
      <View {...registerSection('automatic')}>
        <StrengthExplainerBlock />
      </View>
      <View {...registerSection('research')}>
        <SourcesBlock template={template} />
      </View>
    </View>
  );
}
