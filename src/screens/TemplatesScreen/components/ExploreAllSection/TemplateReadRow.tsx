/**
 * Habit row with an expandable "Why this works" science drawer.
 * Extends ExploreHabitRow with an inline read (lead + evidence) so users
 * can evaluate the science before adding, without leaving the list.
 */

import { memo } from 'react';
import { View } from 'react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { TemplateReadRowDrawer } from './TemplateReadRowDrawer';
import { TemplateReadRowHeader } from './TemplateReadRowHeader';
import { useTemplateReadRow } from './TemplateReadRow.hooks';
import { s } from './TemplateReadRow.styles';

interface TemplateReadRowProps {
  isImported: boolean;
  isImporting: boolean;
  item: Doc<'templates'>;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
}

export const TemplateReadRow = memo(function TemplateReadRow({
  isImported,
  isImporting,
  item,
  onImport,
  onPreview,
}: TemplateReadRowProps) {
  const { colors } = useThemeColors();
  const surface = colors.card;
  // Only offer the science read when there's curated copy beyond the
  // description already shown on the card — never repeat it.
  const hasRead = Boolean(
    item.lead ||
    item.evidence ||
    item.startSmallVersion ||
    item.scientificReference
  );
  const {
    chevronAnimatedStyle,
    contentAnimatedStyle,
    expanded,
    handleContentLayout,
    toggle,
  } = useTemplateReadRow();

  return (
    <View style={[s.cardWrap, { backgroundColor: surface }]}>
      <View style={[s.card, { backgroundColor: surface }]}>
        <TemplateReadRowHeader
          isImported={isImported}
          isImporting={isImporting}
          item={item}
          onImport={onImport}
          onPreview={onPreview}
        />
        {hasRead ? (
          <TemplateReadRowDrawer
            chevronAnimatedStyle={chevronAnimatedStyle}
            contentAnimatedStyle={contentAnimatedStyle}
            expanded={expanded}
            item={item}
            onContentLayout={handleContentLayout}
            onPreview={onPreview}
            onToggle={toggle}
          />
        ) : null}
      </View>
    </View>
  );
});
