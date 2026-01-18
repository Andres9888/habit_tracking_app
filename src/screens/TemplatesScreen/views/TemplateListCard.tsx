/**
 * Template card wrapper for FlatList rendering
 */

import TemplateCard from '../../../components/TemplateCard';
import type { Doc, Id } from '../../../../convex/_generated/dataModel';

interface TemplateListCardProps {
  item: Doc<'templates'>;
  importingTemplateId: Id<'templates'> | null;
  onImport: (templateId: Id<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
}

export function TemplateListCard({
  item,
  importingTemplateId,
  onImport,
  onPreview,
}: TemplateListCardProps) {
  return (
    <TemplateCard
      category={item.category}
      description={item.description}
      frequency={item.frequency}
      icon={item.icon}
      iconColor={item.iconColor}
      id={item._id}
      isImporting={importingTemplateId === item._id}
      isPremium={item.category === 'andrew_huberman'}
      name={item.name}
      popularityScore={item.popularityScore}
      scientificLink={item.scientificLink}
      scientificReference={item.scientificReference}
      youtubeLink={item.youtubeLink}
      onImport={() => onImport(item._id)}
      onPreview={() => onPreview(item)}
    />
  );
}
