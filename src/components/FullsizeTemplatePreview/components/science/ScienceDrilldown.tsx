/**
 * Science drill-down — progressive structure (SPEC_02). Leads with the
 * decision-relevant head (why it works, compact + what you'll feel), then
 * reveals the deeper tail on demand. Each block self-nulls when its data is
 * absent, so a lightly-authored template shows just the head (SPEC_04).
 *
 * When there is no tail, the head's "Why it works" card renders full (not
 * compact) so its cited evidence still attributes the page.
 */

import React, { useState } from 'react';
import { View } from 'react-native';

import { useReduceMotion } from '@/hooks/useReduceMotion';
import { scienceStyles as s } from '../../styles/science.styles';
import { WhyItWorksCard } from './WhyItWorksCard';
import { BenefitsBlock } from './BenefitsBlock';
import { ScienceSeeMore } from './ScienceSeeMore';
import { ScienceTail } from './ScienceTail';
import { hasScienceTail } from './hasScienceTail';
import type { Template } from '../../../../types/template';

interface ScienceDrilldownProps {
  template: Template;
  /** Opened via the 🔬 science door — start expanded so the deep-link lands on full content. */
  initiallyExpanded?: boolean;
}

export function ScienceDrilldown({
  template,
  initiallyExpanded = false,
}: ScienceDrilldownProps) {
  const reduce = useReduceMotion();
  const tail = hasScienceTail(template);
  const [expanded, setExpanded] = useState(initiallyExpanded);

  return (
    <View style={s.stack}>
      <WhyItWorksCard compact={tail} template={template} />
      <BenefitsBlock template={template} />
      {tail && !expanded ? (
        <ScienceSeeMore template={template} onPress={() => setExpanded(true)} />
      ) : null}
      {tail && expanded ? (
        <ScienceTail animate={!initiallyExpanded} reduce={reduce} template={template} />
      ) : null}
    </View>
  );
}
