/**
 * Science drill-down — evidence and expectations after the decision group:
 * why it works → what to expect → the research.
 *
 * Outcome/action blocks (what you'll feel, start small, how to start) live in
 * DecisionDrilldown so desire and feasibility precede credibility.
 *
 * The "How it becomes automatic" strength explainer used to sit before the
 * research block. It was the only block with no data gate, so it rendered
 * identically on every template and read as boilerplate by the third open —
 * and the timeline's gold peak node already tells the automaticity story
 * per-template. Removed rather than personalised: the strength stages are
 * taught on the habit card itself, after the add.
 *
 * Each block renders only when its data is present (graceful fallback), so
 * lightly-authored templates still get a clean, credible page. paddingTop is
 * zeroed so spacing from DecisionDrilldown continues the shared stack gap.
 */

import React from 'react';
import { View } from 'react-native';

import { scienceStyles as s } from '../../styles/science.styles';
import { hasScienceContent } from '../../utils/hasScienceContent';
import { WhyItWorksCard } from './WhyItWorksCard';
import { TimelineBlock } from './TimelineBlock';
import { SourcesBlock } from './SourcesBlock';
import type { Template } from '../../../../types/template';

export function ScienceDrilldown({ template }: { template: Template }) {
  if (!hasScienceContent(template)) return null;

  return (
    <View style={[s.stack, { paddingTop: 0 }]}>
      <WhyItWorksCard template={template} />
      <TimelineBlock template={template} />
      <SourcesBlock template={template} />
    </View>
  );
}
