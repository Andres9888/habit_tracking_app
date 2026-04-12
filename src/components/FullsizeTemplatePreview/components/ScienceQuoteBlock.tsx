/**
 * Scientific citation quote and research link
 */

import React from 'react';
import { Text, Pressable, Linking } from 'react-native';
import { useAppTheme } from '../../../theme';
import { evidenceStyles as s } from '../styles';
import type { Template } from '../../../types/template';

interface ScienceQuoteBlockProps {
  template: Template;
}

export function ScienceQuoteBlock({ template }: ScienceQuoteBlockProps) {
  const theme = useAppTheme();
  const fontFamily = theme.custom.fontFamilies.primary.text;
  const hasLink = Boolean(template?.scientificLink);

  return (
    <>
      <Text style={[s.quoteText, { fontFamily }]}>
        &ldquo;{template?.scientificReference ?? ''}&rdquo;
      </Text>
      {hasLink ? (
        <Pressable
          accessibilityLabel="Read the research paper"
          accessibilityRole="link"
          hitSlop={8}
          onPress={() => void Linking.openURL(template.scientificLink!)}
        >
          <Text style={[s.researchLink, { fontFamily }]}>
            📄 Read the research →
          </Text>
        </Pressable>
      ) : null}
    </>
  );
}
