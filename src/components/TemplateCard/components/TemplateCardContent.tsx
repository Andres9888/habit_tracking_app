/**
 * TemplateCardContent Component
 *
 * Inner content layout for TemplateCard
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../theme';
import { spacing } from '../../../theme/spacing';
import { ActionButtons } from './ActionButtons';
import { CategoryBadge } from './CategoryBadge';
import { MetadataPills } from './MetadataPills';
import { ScienceBox } from './ScienceBox';
import { TemplateIcon } from './TemplateIcon';
import type { TemplateCardContentProps } from './TemplateCardContent.types';

export function TemplateCardContent({
  category,
  checkmarkStyle,
  description,
  frequency,
  icon,
  index,
  iconColor,
  isImported,
  isImporting,
  isLocked,
  isPremium,
  name,
  onImportPress,
  onPreview,
  popularityScore,
  scientificLink,
  scientificReference,
  showPreviewCTA,
  youtubeLink,
}: TemplateCardContentProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.content}>
      <View style={styles.header}>
        <TemplateIcon icon={icon} iconColor={iconColor} />
        <CategoryBadge
          category={category}
          iconColor={iconColor}
          isPremium={isPremium}
        />
      </View>
      <Text
        numberOfLines={1}
        style={[theme.custom.typography.heading3, styles.nameText]}
      >
        {name}
      </Text>
      <MetadataPills
        frequency={frequency}
        iconColor={iconColor}
        popularityScore={popularityScore}
        scientificLink={scientificLink}
        youtubeLink={youtubeLink}
      />
      <Text
        numberOfLines={3}
        style={[theme.custom.typography.bodySmall, styles.descriptionText]}
      >
        {description}
      </Text>
      <ScienceBox scientificReference={scientificReference} />
      <View style={styles.footer}>
        <ActionButtons
          checkmarkStyle={checkmarkStyle}
          iconColor={iconColor}
          index={index}
          isImported={isImported}
          isImporting={isImporting}
          isLocked={isLocked}
          name={name}
          showPreviewCTA={showPreviewCTA}
          onImportPress={onImportPress}
          onPreview={onPreview}
        />
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  content: { padding: spacing.base, paddingLeft: spacing.base },
  descriptionText: { color: '#4b5563', lineHeight: 20, marginTop: spacing.sm },
  footer: { marginTop: spacing.base },
  header: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  nameText: { color: '#1c1917', fontWeight: '700', marginTop: spacing.md },
});
