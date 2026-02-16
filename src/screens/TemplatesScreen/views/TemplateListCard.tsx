/**
 * Template card wrapper for FlatList rendering
 * QW-9: Adds visual loading feedback (opacity + spinner) during import
 */

import React, { memo, useCallback } from 'react';
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

export const TemplateListCard = memo(function TemplateListCard({
  item,
  importingTemplateId,
  onImport,
  onPreview,
}: TemplateListCardProps) {
  const isImporting = importingTemplateId === item._id;

  const handleImport = useCallback(() => onImport(item._id), [onImport, item._id]);
  const handlePreview = useCallback(() => onPreview(item), [onPreview, item]);

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
        onImport={handleImport}
        onPreview={handlePreview}
      />
      {isImporting && (
        <View style={loadingStyles.overlay}>
          <ActivityIndicator color={colors.primary[600]} size="small" />
        </View>
      )}
    </View>
  );
});

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
