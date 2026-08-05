/**
 * Science drill-down — the stacked pre-add detail that earns the add:
 * why it works → what you'll feel → what to expect → how to start →
 * the research.
 *
 * The "How it becomes automatic" strength explainer used to sit before the
 * research block. It was the only block with no data gate, so it rendered
 * identically on every template and read as boilerplate by the third open —
 * and the timeline's gold peak node already tells the automaticity story
 * per-template. Removed rather than personalised: the strength stages are
 * taught on the habit card itself, after the add.
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
import { SourcesBlock } from './SourcesBlock';
import type { Template } from '../../../../types/template';

export function ScienceDrilldown({ template }: { template: Template }) {
  return (
    <View style={s.stack}>
      <WhyItWorksCard template={template} />
      <BenefitsBlock template={template} />
      <TimelineBlock template={template} />
      <HowToStartBlock template={template} />
      <SourcesBlock template={template} />
    </View>
  );
}
