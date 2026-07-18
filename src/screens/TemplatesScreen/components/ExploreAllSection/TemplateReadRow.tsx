/**
 * Habit row — Version B "confidence-first" card. Reads full-width, shows an
 * always-on "Why it works" teaser and meta chips, and opens the detail view
 * (via the card body or the footer's "How it works" affordance).
 * The footer + Add pill creates the habit in one tap.
 */

import { View } from 'react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { TemplateReadRowFooter } from './TemplateReadRowFooter';
import { TemplateReadRowHeader } from './TemplateReadRowHeader';
import { TemplateReadRowMeta } from './TemplateReadRowMeta';
import { TemplateReadRowTeaser } from './TemplateReadRowTeaser';
import { s } from './TemplateReadRow.styles';

interface TemplateReadRowProps {
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
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
  const surface = colors.cardPaper;
  const isImported = importedTemplateIds.has(item._id);

  return (
    <View
      style={[
        s.cardWrap,
        { backgroundColor: surface, borderColor: colors.border },
      ]}
    >
      <View style={[s.card, { backgroundColor: surface }]}>
        <TemplateReadRowHeader item={item} onPreview={onPreview} />
        <TemplateReadRowTeaser item={item} />
        <TemplateReadRowMeta item={item} />
        <TemplateReadRowFooter
          importingTemplateId={importingTemplateId}
          isImported={isImported}
          item={item}
          onImport={onImport}
          onPreview={onPreview}
        />
      </View>
    </View>
  );
}
