/**
 * Decision drill-down — outcome and actionability before evidence:
 * what you'll feel → how to start.
 *
 * Sits between the description and the science group so the reader's first
 * questions ("why should I care?", "what do I do?") are answered before the
 * credibility material. Shares the science-stack padding/gap rhythm so card
 * widths stay consistent; its paddingBottom doubles as the inter-group gap,
 * and ScienceDrilldown zeroes its paddingTop to continue the same rhythm.
 */

import React from 'react';
import { View } from 'react-native';

import { scienceStyles as s } from '../styles/science.styles';
import { BenefitsBlock } from './science/BenefitsBlock';
import { HowToStartBlock } from './science/HowToStartBlock';
import type { Template } from '../../../types/template';

function hasDecisionContent(template: Template): boolean {
  const hasBenefits = Boolean(template?.benefitDetails?.length);
  const hasSteps = Boolean(
    template?.howToStart?.length || template?.tips?.length
  );
  return hasBenefits || hasSteps;
}

export function DecisionDrilldown({ template }: { template: Template }) {
  if (!hasDecisionContent(template)) return null;

  return (
    <View style={s.stack}>
      <BenefitsBlock template={template} />
      <HowToStartBlock template={template} />
    </View>
  );
}
