/**
 * TemplateContent Component
 * Icon and text content for the spotlight template
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FlaskConical } from 'lucide-react-native';
import { useAppTheme } from '../../../theme';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { TemplateIcon } from './TemplateIcon';
import { typography } from '@/theme/typography';

interface TemplateContentProps {
  template: Doc<'templates'>;
}

export const TemplateContent: React.FC<TemplateContentProps> = ({
  template,
}) => {
  const theme = useAppTheme();
  const fontFamily = theme.custom.fontFamilies.primary.text;

  return (
    <View style={styles.content}>
      <TemplateIcon icon={template.icon} iconColor={template.iconColor} />

      <View style={styles.textContent}>
        <Text numberOfLines={1} style={[styles.title, { fontFamily }]}>
          {template.name}
        </Text>

        <Text numberOfLines={2} style={[styles.description, { fontFamily }]}>
          {template.description}
        </Text>

        {template.scientificLink && (
          <View style={styles.researchRow}>
            <FlaskConical color='#166534' size={14} strokeWidth={2} />
            <Text style={styles.researchText}>
              Backed by peer-reviewed research
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },
  description: {
    color: '#3D3833',
    fontSize: typography.bodySmall.fontSize,
    lineHeight: 20,
    marginTop: 4,
  },
  researchRow: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  researchText: {
    color: '#166534',
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
  },
  textContent: {
    flex: 1,
  },
  title: {
    color: '#1A1816',
    fontSize: typography.heading2.fontSize,
    fontWeight: '700',
  },
});
