/**
 * One collapsible category group within ExploreAllSection — shows a
 * TemplateReadRow per template plus a PairsWellWithNudge right after import.
 */

import { useState } from 'react';
import { View } from 'react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { CategoryGroupHeader } from './CategoryGroupHeader';
import { PairsWellWithNudge } from './PairsWellWithNudge';
import { TemplateReadRow } from './TemplateReadRow';
import type {
  CategoryGroup,
  ExploreAllSectionProps,
} from './ExploreAllSection.types';

export function CategoryGroupSection({
  defaultExpanded = false,
  group,
  importedTemplateIds,
  importingTemplateId,
  templatesByCategory,
  onImport,
  onPreview,
}: {
  defaultExpanded?: boolean;
  group: CategoryGroup;
  templatesByCategory: Map<string, Doc<'templates'>>;
} & Pick<
  ExploreAllSectionProps,
  'importedTemplateIds' | 'importingTemplateId' | 'onImport' | 'onPreview'
>) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  // Session-only — gates the nudge to right after an add, not every visit to
  // an already-imported row (importedTemplateIds is the persisted history).
  const [justAddedIds, setJustAddedIds] = useState<Set<string>>(
    () => new Set()
  );

  const handleImport = (template: Doc<'templates'>) => {
    setJustAddedIds((prev) => new Set(prev).add(template._id));
    onImport(template);
  };

  return (
    <View>
      <CategoryGroupHeader
        count={group.templates.length}
        expanded={expanded}
        icon={group.icon}
        label={group.label}
        subtitle={group.subtitle}
        onToggle={() => setExpanded((prev) => !prev)}
      />
      {(expanded ? group.templates : group.templates.slice(0, 3)).map((item) => (
        <View key={item._id}>
          <TemplateReadRow
            importedTemplateIds={importedTemplateIds}
            importingTemplateId={importingTemplateId}
            item={item}
            onImport={handleImport}
            onPreview={onPreview}
          />
          {justAddedIds.has(item._id) ? (
            <PairsWellWithNudge
              category={item.category}
              importedTemplateIds={importedTemplateIds}
              templatesByCategory={templatesByCategory}
              onAdd={handleImport}
            />
          ) : null}
        </View>
      ))}
    </View>
  );
}
