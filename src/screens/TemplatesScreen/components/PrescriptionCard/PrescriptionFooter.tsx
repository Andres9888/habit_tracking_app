/**
 * PrescriptionFooter — CTA row for PrescriptionCard.
 */

import { Text, View } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { colors } from '@/theme/colors';
import { triggerHaptic } from '@/utils/haptics';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { styles as s } from './PrescriptionCard.styles';

interface PrescriptionFooterProps {
  allImported: boolean;
  ctaLabel: string;
  footerNote: string;
  nextStep: { template: Doc<'templates'> } | undefined;
  onImport: (template: Doc<'templates'>) => void;
}

export function PrescriptionFooter({
  allImported,
  ctaLabel,
  footerNote,
  nextStep,
  onImport,
}: PrescriptionFooterProps) {
  const { colors } = useThemeColors();

  return (
    <View style={s.footer}>
      <Text style={[s.footerNote, { color: colors.text.tertiary }]}>
        {footerNote}
      </Text>
      {!allImported && nextStep ? (
        <AnimatedPressable
          accessibilityLabel={ctaLabel}
          accessibilityRole='button'
          animationConfig={{ pressScale: 0.97 }}
          style={[s.cta, { backgroundColor: colors.primary[600] }]}
          onPress={() => {
            void triggerHaptic('tap');
            onImport(nextStep.template);
          }}
        >
          <Text style={[s.ctaText, { color: colors.text.inverse }]}>{ctaLabel}</Text>
        </AnimatedPressable>
      ) : null}
    </View>
  );
}
