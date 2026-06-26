/**
 * Footer section for FullsizeTemplatePreview
 * Primary import CTA + Customize secondary action.
 */

import React from 'react';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from 'lucide-react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { footerStyles } from '../styles';
import { FooterPrimaryAction } from './FooterPrimaryAction';
import { FooterSecondaryActions } from './FooterSecondaryActions';
import type { FooterSectionProps } from './FooterSection.types';

const IMPORT_LABEL = 'Add to my habits';

export function FooterSection({
  templateName,
  startSmallVersion,
  iconColor,
  isImporting,
  isImported,
  bottomInset,
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
  const { colors } = useThemeColors();
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
          {startSmallVersion && !isImported ? (
            <View style={footerStyles.startSmallRow}>
              <Feather color={colors.status.streakText} size={14} strokeWidth={2} />
              <Text numberOfLines={1} style={footerStyles.startSmallText}>
                <Text
                  style={[footerStyles.startSmallLabel, { color: colors.status.streakText }]}
                >
                  Start small:{' '}
                </Text>
                <Text style={{ color: colors.text.secondary }}>{startSmallVersion}</Text>
              </Text>
            </View>
          ) : null}
          <FooterPrimaryAction
            checkmarkAnimatedStyle={checkmarkAnimatedStyle}
            createPressHandlers={createPressHandlers}
            iconColor={iconColor}
            importButtonScale={importButtonScale}
            importButtonStyle={importButtonStyle}
            importLabel={IMPORT_LABEL}
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
              isImporting={isImporting}
              onCustomize={onCustomize}
            />
          )}
        </View>
      </LinearGradient>
    </View>
  );
}
