/**
 * Gradient evidence header for WhyItWorksCard — Science-backed badge +
 * optional Read paper pill. Claim-gating lives in the parent.
 */

import React from 'react';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FileText, ShieldCheck } from 'lucide-react-native';

import { iconSizes } from '@/theme/iconSizes';
import { MAX_FONT_SIZE_MULTIPLIER_STRICT } from '@/utils/accessibility/textScaling';
import { triggerHaptic } from '@/utils/haptics';
import { openExternalLink } from '@/utils/openExternalLink';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { scienceWhyStyles as s } from '../../styles/scienceWhy.styles';
import type { DetailPalette } from '../../detailPalette';
import type { ScienceTheme } from './scienceTheme';

interface Props {
  paper?: string;
  palette: DetailPalette;
  theme: ScienceTheme;
}

export function WhyItWorksHeader({ paper, palette, theme: t }: Props) {
  return (
    <LinearGradient
      colors={[t.gradientStart, t.gradientEnd]}
      end={{ x: 0.5, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={[s.whyHeader, { borderBottomColor: palette.border }]}
    >
      <View style={[s.whyBadge, { backgroundColor: palette.raised }]}>
        <ShieldCheck
          color={t.accent}
          size={iconSizes.small - 1}
          strokeWidth={2.2}
        />
        <Text
          maxFontSizeMultiplier={MAX_FONT_SIZE_MULTIPLIER_STRICT}
          style={[s.whyBadgeText, { color: t.accent }]}
        >
          Science-backed
        </Text>
      </View>
      {paper ? (
        <AnimatedPressable
          accessibilityLabel='Read the research paper'
          accessibilityRole='link'
          hitSlop={6}
          style={[s.whyReadBtn, { borderColor: `${t.accent}4D` }]}
          onPress={() => {
            void triggerHaptic('tap');
            void openExternalLink(paper);
          }}
        >
          <FileText
            color={t.accent}
            size={iconSizes.small - 1}
            strokeWidth={2}
          />
          <Text
            maxFontSizeMultiplier={MAX_FONT_SIZE_MULTIPLIER_STRICT}
            numberOfLines={1}
            style={[s.whyReadText, { color: t.accent }]}
          >
            Read paper
          </Text>
        </AnimatedPressable>
      ) : null}
    </LinearGradient>
  );
}
