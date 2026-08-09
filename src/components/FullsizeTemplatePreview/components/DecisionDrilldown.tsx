/**
 * Decision drill-down — outcome and actionability before evidence:
 * what you'll feel → start small → how to start.
 *
 * Shares the science-stack padding/gap so card widths stay consistent when
 * blocks are data-gated away. ScienceDrilldown does not continue this rhythm —
 * it opens with an evidenceBreak chapter seam (~44px) so credibility reads as
 * a new chapter, not the next card in the same list.
 */

import React from 'react';
import { View } from 'react-native';

import { scienceStyles as s } from '../styles/science.styles';
import { BenefitsBlock } from './science/BenefitsBlock';
import { HowToStartBlock } from './science/HowToStartBlock';
import { StartSmallSection } from './StartSmallSection';
import type { Template } from '../../../types/template';

function hasDecisionContent(template: Template): boolean {
  const hasBenefits = Boolean(template?.benefitDetails?.length);
  const hasStartSmall = Boolean(template?.startSmallVersion?.trim());
  const hasSteps = Boolean(
    template?.howToStart?.length || template?.tips?.length
  );
  return hasBenefits || hasStartSmall || hasSteps;
}

export function DecisionDrilldown({ template }: { template: Template }) {
  if (!hasDecisionContent(template)) return null;

  return (
    <View style={s.stack}>
      <BenefitsBlock template={template} />
      <StartSmallSection startSmallVersion={template?.startSmallVersion} />
      <HowToStartBlock template={template} />
    </View>
  );
}
