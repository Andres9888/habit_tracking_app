/**
 * Decision drill-down — outcome and actionability before evidence:
 * what you'll feel → start small → how to start.
 *
 * Shares the science-stack padding/gap rhythm so card widths stay consistent
 * when blocks are data-gated away. paddingBottom matches the stack gap so the
 * following ScienceDrilldown (paddingTop: 0) continues the same rhythm.
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

  // paddingTop: 0 — DescriptionSection already provides spacing.lg below;
  // keeping stack paddingTop would double the seam before the first block.
  return (
    <View style={[s.stack, { paddingTop: 0 }]}>
      <BenefitsBlock template={template} />
      <StartSmallSection startSmallVersion={template?.startSmallVersion} />
      <HowToStartBlock template={template} />
    </View>
  );
}
