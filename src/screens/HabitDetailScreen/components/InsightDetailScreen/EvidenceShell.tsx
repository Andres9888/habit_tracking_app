import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { fontFamilies, fontWeights } from '../../../../theme/typography';
import { useInsightPalette } from '../../insightPalette';
import { InsightCard } from '../InsightCard';
import { NextStepCard } from './NextStepCard';

interface EvidenceShellProps {
  children?: ReactNode;
  headline: string;
  nextStep?: string | null;
  nextStepLabel?: string;
  prose: string;
  onNextStep?: () => void;
}

/** Claim + prose + optional next step. Paper only — amber is recovery. */
export function EvidenceShell({
  children,
  headline,
  nextStep,
  nextStepLabel = 'Edit ›',
  onNextStep,
  prose,
}: EvidenceShellProps) {
  const palette = useInsightPalette();

  return (
    <View style={{ gap: 12 }}>
      <View style={{ paddingHorizontal: 4 }}>
        <Text
          style={{
            color: palette.ctaGreen,
            fontSize: 12,
            fontWeight: fontWeights.bold,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
          }}
        >
          From your log
        </Text>
        <Text
          style={{
            color: palette.textPrimary,
            fontFamily: fontFamilies.primary.display,
            fontSize: 20,
            lineHeight: 26,
            marginTop: 8,
          }}
        >
          {headline}
        </Text>
      </View>
      <InsightCard palette={palette}>
        <Text
          style={{ color: palette.textSecondary, fontSize: 15, lineHeight: 22 }}
        >
          {prose}
        </Text>
      </InsightCard>
      {children}
      {nextStep ? (
        <NextStepCard
          label={nextStepLabel}
          text={nextStep}
          onPress={onNextStep}
        />
      ) : null}
    </View>
  );
}
