/**
 * PrescriptionStepRow — one sequenced habit inside the prescription card.
 */

import { Pressable, Text, View } from 'react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import type { GoalCollection } from '../../data/goalCollections';
import { ScienceDoorPill } from '../ScienceDoorPill';
import { stepStyles as s } from './PrescriptionStepRow.styles';

interface PrescriptionStepRowProps {
  goal: GoalCollection;
  isImported: boolean;
  reason: string;
  stepNumber: number;
  template: Doc<'templates'>;
  onPreview: (template: Doc<'templates'>) => void;
}

export function PrescriptionStepRow({
  goal,
  isImported,
  reason,
  stepNumber,
  template,
  onPreview,
}: PrescriptionStepRowProps) {
  const stepLabel = isImported ? '✓ Added' : `Step ${stepNumber}`;

  return (
    <Pressable
      accessibilityLabel={`${template.name}, ${stepLabel}`}
      accessibilityRole='button'
      style={[
        s.row,
        isImported ? s.rowImported : null,
        { borderColor: isImported ? '#A7F3D0' : '#DDD8D2' },
      ]}
      onPress={() => onPreview(template)}
    >
      <View
        style={[
          s.icon,
          { backgroundColor: `${template.iconColor || goal.textColor}22` },
        ]}
      >
        <Text style={s.iconText}>{template.icon}</Text>
      </View>
      <View style={s.body}>
        <Text numberOfLines={1} style={s.name}>
          {template.name}
        </Text>
        <View style={s.meta}>
          <Text numberOfLines={1} style={s.reason}>
            {reason}
          </Text>
          <ScienceDoorPill template={template} onPress={onPreview} />
        </View>
      </View>
      <View
        style={[
          s.stepBadge,
          { backgroundColor: isImported ? '#ECFDF5' : goal.bgColor },
        ]}
      >
        <Text
          style={[
            s.stepBadgeText,
            { color: isImported ? '#047857' : goal.textColor },
          ]}
        >
          {stepLabel}
        </Text>
      </View>
      <Text style={s.chevron}>›</Text>
    </Pressable>
  );
}
