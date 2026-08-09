/**
 * Footer section for FullsizeTemplatePreview
 * Primary import CTA + Customize secondary action.
 */

import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { withAlpha } from '@/theme/colors';
import { footerStyles } from '../styles';
import { useDetailPalette } from '../detailPalette';
import { FooterPrimaryAction } from './FooterPrimaryAction';
import { FooterSecondaryActions } from './FooterSecondaryActions';
import type { FooterSectionProps } from './FooterSection.types';

const IMPORT_LABEL = 'Add this habit';

export function FooterSection({
  templateName,
  isImporting,
  isImported,
  bottomInset,
  importButtonStyle,
  customizeButtonStyle,
  checkmarkAnimatedStyle,
  successPillStyle,
  startSmallVersion,
  createPressHandlers,
  importButtonScale,
  customizeButtonScale,
  onImport,
  onCustomize,
  onDone,
}: FooterSectionProps) {
  const palette = useDetailPalette();

  return (
    <View style={footerStyles.footerGradientWrapper}>
      {/* Fades the page body up to opaque so content scrolls under the CTA. */}
      <LinearGradient
        colors={[
          withAlpha(palette.body, 0),
          palette.body,
          palette.body,
        ]}
        locations={[0, 0.38, 1]}
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
            createPressHandlers={createPressHandlers}
            importButtonScale={importButtonScale}
            importButtonStyle={importButtonStyle}
            importLabel={IMPORT_LABEL}
            isImported={isImported}
            isImporting={isImporting}
            startSmallVersion={startSmallVersion}
            successPillStyle={successPillStyle}
            templateName={templateName}
            onImport={onImport}
          />
          <FooterSecondaryActions
            createPressHandlers={createPressHandlers}
            customizeButtonScale={customizeButtonScale}
            customizeButtonStyle={customizeButtonStyle}
            isImported={isImported}
            isImporting={isImporting}
            onCustomize={onCustomize}
            onDone={onDone}
          />
        </View>
      </LinearGradient>
    </View>
  );
}
