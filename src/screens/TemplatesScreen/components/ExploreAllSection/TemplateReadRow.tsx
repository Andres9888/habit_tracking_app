/**
 * Habit row with an expandable "Why this works" science drawer.
 * Extends ExploreHabitRow with an inline read (lead + evidence) so users
 * can evaluate the science before adding, without leaving the list.
 */

import { View } from 'react-native';
import type { Doc, Id } from '../../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { TemplateReadRowDrawer } from './TemplateReadRowDrawer';
import { TemplateReadRowHeader } from './TemplateReadRowHeader';
import { useTemplateReadRow } from './TemplateReadRow.hooks';
import { s } from './TemplateReadRow.styles';

interface TemplateReadRowProps {
  importedTemplateIds: Set<string>;
  importingTemplateId: Id<'templates'> | null;
  item: Doc<'templates'>;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
}

export function TemplateReadRow({
  importedTemplateIds,
  importingTemplateId,
  item,
  onImport,
  onPreview,
}: TemplateReadRowProps) {
  const { colors } = useThemeColors();
  const isImported = importedTemplateIds.has(item._id);
  // Curated leads are sparse — fall back to the template description so the
  // science read is available on every row (mock parity).
  const hasRead = Boolean(item.lead || item.description);
  const {
    chevronAnimatedStyle,
    contentAnimatedStyle,
    expanded,
    handleContentLayout,
    toggle,
  } = useTemplateReadRow();

  return (
    <View style={[s.cardWrap, { backgroundColor: colors.gray[50] }]}>
      <View
        style={[
          s.card,
          { backgroundColor: colors.gray[50], borderColor: colors.border },
        ]}
      >
        <TemplateReadRowHeader
          importingTemplateId={importingTemplateId}
          isImported={isImported}
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
            onToggle={toggle}
          />
        ) : null}
      </View>
    </View>
  );
}
