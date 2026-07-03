/** One list item for LibraryLandingView — read row + post-add pairing nudge. */

import { View } from 'react-native';
import type { Doc, Id } from '../../../../convex/_generated/dataModel';
import { PairsWellWithNudge } from '../components/ExploreAllSection/PairsWellWithNudge';
import { TemplateReadRow } from '../components/ExploreAllSection/TemplateReadRow';

interface LibraryLandingRowProps {
  importedTemplateIds: Set<string>;
  importingTemplateId: Id<'templates'> | null;
  item: Doc<'templates'>;
  justAdded: boolean;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
  topTemplateByCategory: Map<string, Doc<'templates'>>;
}

export function LibraryLandingRow({
  importedTemplateIds,
  importingTemplateId,
  item,
  justAdded,
  onImport,
  onPreview,
  topTemplateByCategory,
}: LibraryLandingRowProps) {
  return (
    <View>
      <TemplateReadRow
        importedTemplateIds={importedTemplateIds}
        importingTemplateId={importingTemplateId}
        item={item}
        onImport={onImport}
        onPreview={onPreview}
      />
      {justAdded ? (
        <PairsWellWithNudge
          category={item.category}
          importedTemplateIds={importedTemplateIds}
          templatesByCategory={topTemplateByCategory}
          onAdd={onImport}
        />
      ) : null}
    </View>
  );
}
