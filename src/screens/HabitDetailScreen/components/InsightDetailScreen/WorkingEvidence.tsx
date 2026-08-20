import { View } from 'react-native';
import type { WorkingInsight } from '../../insights';
import { useInsightPalette } from '../../insightPalette';
import { WorkingStatTile } from '../NoticingSection/WorkingStatTile';
import { EvidenceSection } from './EvidenceSection';
import { EvidenceShell } from './EvidenceShell';
import { EvidenceStatStrip } from './EvidenceStatStrip';
import {
  workingHeadline,
  workingNextStep,
  workingProse,
} from './insightEvidence';

interface WorkingEvidenceProps {
  insight: WorkingInsight;
  onEdit: () => void;
}

export function WorkingEvidence({ insight, onEdit }: WorkingEvidenceProps) {
  const palette = useInsightPalette();
  const next = workingNextStep(insight);

  return (
    <EvidenceShell
      headline={workingHeadline(insight)}
      nextStep={next}
      nextStepLabel='Adjust ›'
      prose={workingProse(insight)}
      onNextStep={next ? onEdit : undefined}
    >
      <EvidenceSection
        subtitle={`${insight.sample} timestamped check-ins`}
        title='When check-ins landed'
      >
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
          <WorkingStatTile
            label={`of ${insight.sample} wins ${insight.daypart.phrase}`}
            palette={palette}
            value={insight.sharePct}
          />
          <WorkingStatTile
            muted
            label='the rest of the day'
            palette={palette}
            value={insight.otherPct}
          />
        </View>
      </EvidenceSection>
      <EvidenceStatStrip
        items={[
          { label: insight.daypart.label, value: `${insight.sharePct}%` },
          { label: 'Rest of day', value: `${insight.otherPct}%` },
        ]}
      />
    </EvidenceShell>
  );
}
