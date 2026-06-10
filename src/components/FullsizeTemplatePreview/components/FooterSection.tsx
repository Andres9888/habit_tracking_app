/**
 * Footer section for FullsizeTemplatePreview
 * Start-small commitment CTA (when available) + secondary actions.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { footerStyles } from '../styles';
import { FooterPrimaryAction } from './FooterPrimaryAction';
import { FooterSecondaryActions } from './FooterSecondaryActions';
import type { FooterSectionProps } from './FooterSection.types';

const COMMIT_MICROLINE =
  'Too small to fail — tiny starts survive week one. You can always do more.';

function buildStartSmallLabel(startSmallVersion: string): string {
  const trimmed = startSmallVersion.trim().replace(/\.$/, '');
  return `Start small — ${trimmed.charAt(0).toLowerCase()}${trimmed.slice(1)}`;
}

export function FooterSection({
  templateName,
  iconColor,
  isImporting,
  isImported,
  bottomInset,
  startSmallVersion,
  importButtonStyle,
  customizeButtonStyle,
  checkmarkAnimatedStyle,
  successPillStyle,
  createPressHandlers,
  importButtonScale,
  customizeButtonScale,
  onImport,
  onCustomize,
}: FooterSectionProps) {
  const importLabel = startSmallVersion
    ? buildStartSmallLabel(startSmallVersion)
    : 'Add to my habits';

  return (
    <View style={footerStyles.footerGradientWrapper}>
      {/* Intentional rgba gradient — fades from transparent to gray[50] (#FAF8F5) */}
      <LinearGradient
        colors={[
          'rgba(250, 248, 245, 0)',
          'rgba(250, 248, 245, 1)',
          'rgba(250, 248, 245, 1)',
        ]}
        style={footerStyles.footerGradient}
      >
        <View
          style={[
            footerStyles.footer,
            { paddingBottom: Math.max(bottomInset, 20) },
          ]}
        >
          {!isImported && startSmallVersion ? (
            <Text style={footerStyles.commitMicroline}>{COMMIT_MICROLINE}</Text>
          ) : null}
          <FooterPrimaryAction
            checkmarkAnimatedStyle={checkmarkAnimatedStyle}
            createPressHandlers={createPressHandlers}
            iconColor={iconColor}
            importButtonScale={importButtonScale}
            importButtonStyle={importButtonStyle}
            importLabel={importLabel}
            isImported={isImported}
            isImporting={isImporting}
            successPillStyle={successPillStyle}
            templateName={templateName}
            onImport={onImport}
          />
          {isImported ? null : (
            <FooterSecondaryActions
              createPressHandlers={createPressHandlers}
              customizeButtonScale={customizeButtonScale}
              customizeButtonStyle={customizeButtonStyle}
              hasStartSmall={!!startSmallVersion}
              isImporting={isImporting}
              templateName={templateName}
              onCustomize={onCustomize}
              onImport={onImport}
            />
          )}
        </View>
      </LinearGradient>
    </View>
  );
}
