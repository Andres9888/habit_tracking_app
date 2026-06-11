/**
 * PrescriptionCard — "Your way in" sequenced path for a selected goal.
 */

import { Pressable, Text, View } from 'react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import type { GoalCollection } from '../../data/goalCollections';
import type { ResolvedPrescription } from '../../hooks/usePrescription';
import { PrescriptionStepRow } from './PrescriptionStepRow';
import { styles as s } from './PrescriptionCard.styles';

interface PrescriptionCardProps {
  goal: GoalCollection;
  importedTemplateIds: Set<string>;
  prescription: ResolvedPrescription;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
}

export function PrescriptionCard({
  goal,
  importedTemplateIds,
  prescription,
  onImport,
  onPreview,
}: PrescriptionCardProps) {
  const { importedStepCount, steps } = prescription;
  const nextStep =
    steps.find((step) => !importedTemplateIds.has(step.template._id)) ??
    steps[0];
  const hasImported = importedStepCount > 0;
  const allImported = importedStepCount >= steps.length;
  const ctaLabel = allImported
    ? 'Browse more habits'
    : hasImported
      ? 'Add step 2 →'
      : 'Start step 1 →';
  const footerNote = hasImported
    ? 'Most people add step 2 in week two. No rush.'
    : 'Works best together — starting with one is fine.';

  return (
    <View
      style={[
        s.card,
        {
          backgroundColor: goal.bgColor,
          borderColor: `${goal.textColor}33`,
        },
      ]}
    >
      <View style={s.head}>
        <Text style={[s.overline, { color: goal.textColor }]}>YOUR WAY IN</Text>
        <Text style={[s.insight, { color: goal.textColor }]}>
          {prescription.insight}
        </Text>
        {hasImported ? null : <Text style={s.why}>{prescription.why}</Text>}
      </View>

      {steps.map((step) => (
        <PrescriptionStepRow
          key={step.template._id}
          goal={goal}
          isImported={importedTemplateIds.has(step.template._id)}
          reason={step.reason}
          stepNumber={step.stepNumber}
          template={step.template}
          onPreview={onPreview}
        />
      ))}

      <View style={s.footer}>
        <Text style={s.footerNote}>{footerNote}</Text>
        {!allImported && nextStep ? (
          <Pressable
            accessibilityLabel={ctaLabel}
            accessibilityRole='button'
            style={s.cta}
            onPress={() => onImport(nextStep.template)}
          >
            <Text style={s.ctaText}>{ctaLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
