/**
 * PrescriptionCard — "Your way in" sequenced path for a selected goal.
 */

import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { durations, enterEasing } from '../../../../theme/animations';
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
  const { colors, isDark } = useThemeColors();
  const { importedStepCount, steps } = prescription;
  const goalTextColor = isDark ? goal.darkTextColor : goal.textColor;
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
    <Animated.View
      entering={FadeInDown.duration(durations.enter).easing(enterEasing)}
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

      <View style={s.footer}>
        <Text style={[s.footerNote, { color: colors.text.tertiary }]}>
          {footerNote}
        </Text>
        {!allImported && nextStep ? (
          <Pressable
            accessibilityLabel={ctaLabel}
            accessibilityRole='button'
            style={[s.cta, { backgroundColor: colors.primary[600] }]}
            onPress={() => onImport(nextStep.template)}
          >
            <Text style={[s.ctaText, { color: '#FFFFFF' }]}>{ctaLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </Animated.View>
  );
}
