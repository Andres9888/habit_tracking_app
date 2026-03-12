/**
 * Template card wrapper for FlatList rendering
 * QW-9: Adds visual loading feedback (opacity + spinner) during import
 */

import { ActivityIndicator, View, StyleSheet } from 'react-native';
import TemplateCard from '../../../components/TemplateCard';
import type { Doc, Id } from '../../../../convex/_generated/dataModel';
import { colors } from '../../../theme/colors';

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
  const isImporting = importingTemplateId === item._id;

  return (
    <View style={isImporting ? loadingStyles.importing : undefined}>
      <TemplateCard
        category={item.category}
        description={item.description}
        frequency={item.frequency}
        icon={item.icon}
        iconColor={item.iconColor}
        id={item._id}
        isImporting={isImporting}
        isPremium={item.category === 'andrew_huberman'}
        name={item.name}
        popularityScore={item.popularityScore}
        scientificLink={item.scientificLink}
        scientificReference={item.scientificReference}
        youtubeLink={item.youtubeLink}
        onImport={() => onImport(item._id)}
        onPreview={() => onPreview(item)}
      />
      {isImporting ? <View style={loadingStyles.overlay}>
          <ActivityIndicator color={colors.primary[600]} size="small" />
        </View> : null}
    </View>
  );
}

const loadingStyles = StyleSheet.create({
  importing: {
    opacity: 0.6,
    position: 'relative',
  },
  overlay: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
