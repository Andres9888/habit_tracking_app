/**
 * The science section under the hero: the KeyFacts decision band (SPEC_01),
 * the deduped description (SPEC_04), and the progressive science drill-down
 * (SPEC_02). Extracted from ScrollableContent to respect max-lines.
 */

import React from 'react';
import { View, type LayoutChangeEvent } from 'react-native';

import { colors } from '@/theme/colors';
import type { TemplatePreviewAnchor } from '@/screens/TemplatesScreen/TemplatesScreen.types';
import { DescriptionSection } from './DescriptionSection';
import { KeyFactsBand } from './science/KeyFactsBand';
import { ScienceDrilldown } from './science/ScienceDrilldown';
import { layoutStyles } from '../styles';
import type { Template } from '../../../types/template';

interface PreviewScienceSectionProps {
  template: Template;
  iconColor: string;
  initialAnchor: TemplatePreviewAnchor;
  scienceRef: React.RefObject<View | null>;
  onScienceLayout: (event: LayoutChangeEvent) => void;
}

export function PreviewScienceSection({
  template,
  iconColor,
  initialAnchor,
  scienceRef,
  onScienceLayout,
}: PreviewScienceSectionProps) {
  return (
    <View style={{ backgroundColor: colors.gray[50] }}>
      <KeyFactsBand template={template} />
      {/* When `lead` is absent the Why card adopts the description, so the
          standalone section would duplicate it — give the description one
          home (SPEC_04). */}
      {template?.lead && template?.description ? (
        <DescriptionSection description={template.description} iconColor={iconColor} />
      ) : null}
      <View ref={scienceRef} onLayout={onScienceLayout}>
        <ScienceDrilldown
          initiallyExpanded={initialAnchor === 'science'}
          template={template}
        />
      </View>
      <View style={layoutStyles.bottomSpacer} />
      {/* The start-small hint makes the absolute footer ~28px taller, so add
          matching clearance only for templates that show it (SPEC_03). */}
      {template?.startSmallVersion ? <View style={{ height: 28 }} /> : null}
    </View>
  );
}
