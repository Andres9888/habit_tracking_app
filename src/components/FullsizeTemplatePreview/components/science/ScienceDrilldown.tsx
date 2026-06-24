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

import { scienceStyles as s } from '../../styles/science.styles';
import { WhyItWorksCard } from './WhyItWorksCard';
import { BenefitsBlock } from './BenefitsBlock';
import { TimelineBlock } from './TimelineBlock';
import { HowToStartBlock } from './HowToStartBlock';
import { StrengthExplainerBlock } from './StrengthExplainerBlock';
import { SourcesBlock } from './SourcesBlock';
import type { Template } from '../../../../types/template';

export function ScienceDrilldown({ template }: { template: Template }) {
  return (
    <View style={s.stack}>
      <WhyItWorksCard template={template} />
      <BenefitsBlock template={template} />
      <TimelineBlock template={template} />
      <HowToStartBlock template={template} />
      <StrengthExplainerBlock />
      <SourcesBlock template={template} />
    </View>
  );
}
