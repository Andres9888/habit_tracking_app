/** Science copy inside the expanded drawer — lead, evidence, start-small, citation. */

import { Pressable, Text, View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { getShortCitation } from '../HabitTemplateCard/templateMeta';
import { s } from './TemplateReadRow.styles';

interface TemplateReadRowScienceProps {
  item: Doc<'templates'>;
  onLayout: (event: LayoutChangeEvent) => void;
  onPreview: (template: Doc<'templates'>) => void;
}

export function TemplateReadRowScience({
  item,
  onLayout,
  onPreview,
}: TemplateReadRowScienceProps) {
  const { colors } = useThemeColors();
  const citation = getShortCitation(item);
  const accent = colors.primary[600];
  // Never repeat the card's own description here — the drawer only shows
  // curated science copy (lead paragraph + evidence stat) plus start-small.
  const lead = item.lead ?? null;
  const evidence = item.evidence ?? null;
  const startSmall = item.startSmallVersion ?? null;

  return (
    <View style={s.drawerBody} onLayout={onLayout}>
      {lead ? (
        <Text style={[s.drawerLead, { color: colors.text.primary }]}>
          {lead}
        </Text>
      ) : null}
      {evidence ? (
        <Text style={[s.drawerEvidence, { color: colors.text.secondary }]}>
          {evidence}
        </Text>
      ) : null}
      {startSmall ? (
        <Text style={[s.drawerStartSmall, { color: colors.text.secondary }]}>
          <Text style={[s.drawerStartSmallPrefix, { color: accent }]}>
            Start small:{' '}
          </Text>
          {startSmall}
        </Text>
      ) : null}
      {citation ? (
        <Text style={[s.drawerCitation, { color: colors.text.tertiary }]}>
          {citation}
        </Text>
      ) : null}
      <Pressable
        accessibilityLabel={`View ${item.name} details`}
        accessibilityRole='button'
        hitSlop={8}
        style={s.detailsLink}
        onPress={() => onPreview(item)}
      >
        <Text style={[s.detailsLinkLabel, { color: accent }]}>
          View details ›
        </Text>
      </Pressable>
    </View>
  );
}
