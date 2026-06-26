/**
 * Science tail (SPEC_02) — the deeper blocks revealed by "See the full
 * science": the cited evidence + optional video, then what-to-expect, how-to-
 * start, how-it-becomes-automatic, and the research. Animates in once on tap;
 * mounts instantly when deep-linked (already expanded) or reduce-motion is on.
 */

import React from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { durations, enterEasing } from '@/theme/animations';
import { scienceStyles as s } from '../../styles/science.styles';
import { scienceWhyStyles as w } from '../../styles/scienceWhy.styles';
import { ScienceVideoEmbed } from '../ScienceVideoEmbed';
import { TimelineBlock } from './TimelineBlock';
import { HowToStartBlock } from './HowToStartBlock';
import { StrengthExplainerBlock } from './StrengthExplainerBlock';
import { SourcesBlock } from './SourcesBlock';
import type { Template } from '../../../../types/template';

interface ScienceTailProps {
  template: Template;
  reduce: boolean;
  animate: boolean;
}

export function ScienceTail({ template, reduce, animate }: ScienceTailProps) {
  const evidence = template?.evidence ?? template?.scientificReference;
  const inner = (
    <View style={s.tail}>
      {evidence ? <Text style={[w.whyEvidence, s.tailEvidence]}>{evidence}</Text> : null}
      {template?.youtubeLink ? <ScienceVideoEmbed template={template} /> : null}
      <TimelineBlock template={template} />
      <HowToStartBlock template={template} />
      <StrengthExplainerBlock />
      <SourcesBlock template={template} />
    </View>
  );

  if (reduce || !animate) return inner;
  return (
    <Animated.View entering={FadeInDown.duration(durations.enter).easing(enterEasing)}>
      {inner}
    </Animated.View>
  );
}
