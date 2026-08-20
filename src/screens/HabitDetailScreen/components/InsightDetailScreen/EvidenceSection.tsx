import type { ReactNode } from 'react';
import { Text } from 'react-native';
import { fontWeights } from '../../../../theme/typography';
import { useInsightPalette } from '../../insightPalette';
import { FlowSectionLabel } from '../FlowSectionLabel';
import { InsightCard } from '../InsightCard';

interface EvidenceSectionProps {
  children: ReactNode;
  subtitle?: string;
  title: string;
}

export function EvidenceSection({
  children,
  subtitle,
  title,
}: EvidenceSectionProps) {
  const palette = useInsightPalette();

  return (
    <>
      <FlowSectionLabel>The evidence</FlowSectionLabel>
      <InsightCard palette={palette}>
        <Text
          style={{
            color: palette.textPrimary,
            fontSize: 15,
            fontWeight: fontWeights.semibold,
          }}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={{
              color: palette.textTertiary,
              fontSize: 13,
              marginTop: 3,
            }}
          >
            {subtitle}
          </Text>
        ) : null}
        {children}
      </InsightCard>
    </>
  );
}
