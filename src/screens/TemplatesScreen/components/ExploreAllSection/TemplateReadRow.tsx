/**
 * Habit row — full-width "confidence-first" card mirroring the habit-library
 * mock: icon + serif name, description with an inline "Details ›" affordance,
 * a "Start small" teaser, and a foot row that pairs the duration pill with the
 * + Add button. Tapping the card body opens the science detail view.
 */

import { View } from 'react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../../theme/ThemeContext';
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
        <TemplateReadRowMeta
          importingTemplateId={importingTemplateId}
          isImported={isImported}
          item={item}
          onImport={onImport}
        />
      </View>
    </View>
  );
}
