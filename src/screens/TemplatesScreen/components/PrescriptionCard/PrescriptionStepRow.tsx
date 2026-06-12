/**
 * PrescriptionStepRow — one sequenced habit inside the prescription card.
 */

import { Text, View } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { triggerHaptic } from '@/utils/haptics';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../../theme/ThemeContext';
import type { GoalCollection } from '../../data/goalCollections';
import { getImportedStateColors } from '../../utils/importedStateColors';
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
  const { colors, isDark } = useThemeColors();
  const importedColors = getImportedStateColors(isDark);
  const goalTextColor = isDark ? goal.darkTextColor : goal.textColor;
  const stepLabel = isImported ? '✓ Added' : `Step ${stepNumber}`;

  return (
    <AnimatedPressable
      accessibilityLabel={`${template.name}, ${stepLabel}`}
      accessibilityRole='button'
      style={[
        s.row,
        {
          backgroundColor: isImported
            ? importedColors.backgroundColor
            : colors.card,
          borderColor: isImported ? importedColors.borderColor : colors.border,
        },
      ]}
      onPress={() => {
        void triggerHaptic('selection');
        onPreview(template);
      }}
    >
      <View
        style={[
          s.icon,
          { backgroundColor: `${template.iconColor || goalTextColor}22` },
        ]}
      >
        <Text style={s.iconText}>{template.icon}</Text>
      </View>
      <View style={s.body}>
        <Text
          numberOfLines={1}
          style={[s.name, { color: colors.text.primary }]}
        >
          {template.name}
        </Text>
        <View style={s.meta}>
          <Text
            numberOfLines={1}
            style={[s.reason, { color: colors.text.secondary }]}
          >
            {reason}
          </Text>
        </View>
      </View>
      <View
        style={[
          s.stepBadge,
          {
            backgroundColor: isImported
              ? colors.status.successLight
              : isDark
                ? goal.darkBgColor
                : goal.bgColor,
          },
        ]}
      >
        <Text
          style={[
            s.stepBadgeText,
            {
              color: isImported ? colors.status.successText : goalTextColor,
            },
          ]}
        >
          {stepLabel}
        </Text>
      </View>
      <Text style={[s.chevron, { color: colors.text.tertiary }]}>›</Text>
    </AnimatedPressable>
  );
}
