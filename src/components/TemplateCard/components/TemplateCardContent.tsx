/**
 * TemplateCardContent Component
 *
 * Inner content layout for TemplateCard
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../theme';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { ActionButtons } from './ActionButtons';
import { CategoryBadge } from './CategoryBadge';
import { MetadataPills } from './MetadataPills';
import { ScienceBox } from './ScienceBox';
import { TemplateIcon } from './TemplateIcon';
import type { TemplateCardContentProps } from './TemplateCardContent.types';
import { fontWeights } from '@/theme/typography';

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
        youtubeLink={youtubeLink}
      />
      <Text
        numberOfLines={3}
        style={[theme.custom.typography.bodySmall, styles.descriptionText]}
      >
        {description}
      </Text>
      {scientificReference ? (
        <ScienceBox scientificReference={scientificReference} />
      ) : null}
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
  descriptionText: { color: colors.text.secondary, lineHeight: 20, marginTop: spacing.sm },
  footer: { marginTop: spacing.base },
  header: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  nameText: { color: colors.text.primary, fontWeight: fontWeights.bold, marginTop: spacing.md },
});
