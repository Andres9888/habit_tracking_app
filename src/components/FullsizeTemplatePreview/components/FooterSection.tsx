/**
 * Footer section for FullsizeTemplatePreview
 * Primary import CTA + Customize secondary action.
 */

import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { footerStyles } from '../styles';
import { FooterPrimaryAction } from './FooterPrimaryAction';
import { FooterSecondaryActions } from './FooterSecondaryActions';
import type { FooterSectionProps } from './FooterSection.types';

const IMPORT_LABEL = 'Add this habit';

export function FooterSection({
  templateName,
  iconColor,
  isImporting,
  isImported,
  bottomInset,
  customizeButtonStyle,
  checkmarkAnimatedStyle,
  successPillStyle,
  createPressHandlers,
  customizeButtonScale,
  reducedMotion,
  onImport,
  onCustomize,
}: FooterSectionProps) {
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
          <FooterPrimaryAction
            checkmarkAnimatedStyle={checkmarkAnimatedStyle}
            iconColor={iconColor}
            importLabel={IMPORT_LABEL}
            isImported={isImported}
            isImporting={isImporting}
            reducedMotion={reducedMotion}
            successPillStyle={successPillStyle}
            templateName={templateName}
            onImport={onImport}
          />
          {isImported ? null : (
            <FooterSecondaryActions
              createPressHandlers={createPressHandlers}
              customizeButtonScale={customizeButtonScale}
              customizeButtonStyle={customizeButtonStyle}
              isImporting={isImporting}
              onCustomize={onCustomize}
            />
          )}
        </View>
      </LinearGradient>
    </View>
  );
}
