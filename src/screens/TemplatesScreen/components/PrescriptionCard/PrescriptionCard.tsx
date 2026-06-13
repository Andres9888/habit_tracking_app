/**
 * PrescriptionCard — "Your way in" sequenced path for a selected goal.
 */

import { Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { useReduceMotion } from '../../../../hooks/useReduceMotion';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { durations, enterEasing } from '../../../../theme/animations';
import type { GoalCollection } from '../../data/goalCollections';
import type { ResolvedPrescription } from '../../hooks/usePrescription';
import { PrescriptionFooter } from './PrescriptionFooter';
import { PrescriptionStepRow } from './PrescriptionStepRow';
import { getPrescriptionCopy } from './prescriptionCopy';
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
  const { colors, isDark } = useThemeColors();
  const reduceMotion = useReduceMotion();
  const { steps } = prescription;
  const { allImported, ctaLabel, footerNote, hasImported, nextStep } =
    getPrescriptionCopy(prescription, importedTemplateIds);
  const goalTextColor = isDark ? goal.darkTextColor : goal.textColor;
  const entering = reduceMotion
    ? undefined
    : FadeInDown.duration(durations.enter).easing(enterEasing);
  const exiting = reduceMotion
    ? undefined
    : FadeOut.duration(durations.quick);

  return (
    <Animated.View
      entering={entering}
      exiting={exiting}
      style={[
        s.card,
        {
          backgroundColor: isDark ? goal.darkBgColor : goal.bgColor,
          borderColor: `${goalTextColor}33`,
        },
      ]}
    >
      <View style={s.head}>
        <Text style={[s.overline, { color: goalTextColor }]}>YOUR WAY IN</Text>
        <Text style={[s.insight, { color: goalTextColor }]}>
          {prescription.insight}
        </Text>
        {hasImported ? null : (
          <Text style={[s.why, { color: colors.text.secondary }]}>
            {prescription.why}
          </Text>
        )}
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

      <PrescriptionFooter
        allImported={allImported}
        ctaLabel={ctaLabel}
        footerNote={footerNote}
        nextStep={nextStep}
        onImport={onImport}
      />
    </Animated.View>
  );
}
