import { Pressable, Text, View } from 'react-native';
import { Pencil, RotateCcw } from 'lucide-react-native';
import { borderRadius, shadows } from '../../../../theme/spacing';
import { useInsightPalette } from '../../insightPalette';
import { FlowDivider } from '../FlowRow';

interface DayCorrectRowsProps {
  disabled?: boolean;
  done: boolean;
  hasNote: boolean;
  onOpenNote: () => void;
  onToggle: () => void;
}

function Row({
  disabled,
  label,
  onPress,
}: {
  disabled?: boolean;
  label: string;
  onPress: () => void;
}) {
  const palette = useInsightPalette();
  const Icon =
    label.startsWith('Undo') || label.startsWith('Mark') ? RotateCcw : Pencil;

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole='button'
      accessibilityState={{ disabled }}
      disabled={disabled}
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        gap: 11,
        minHeight: 52,
        opacity: disabled ? 0.5 : 1,
        paddingHorizontal: 16,
        paddingVertical: 13,
      }}
      onPress={onPress}
    >
      <Icon color={palette.textTertiary} size={19} strokeWidth={1.9} />
      <Text style={{ color: palette.textSecondary, fontSize: 15 }}>
        {label}
      </Text>
    </Pressable>
  );
}

export function DayCorrectRows({
  disabled,
  done,
  hasNote,
  onOpenNote,
  onToggle,
}: DayCorrectRowsProps) {
  const palette = useInsightPalette();

  return (
    <View
      style={{
        backgroundColor: palette.card,
        borderColor: palette.cardBorder,
        borderRadius: borderRadius.large,
        borderWidth: 1,
        overflow: 'hidden',
        ...shadows.subtle,
      }}
    >
      <Row label={hasNote ? 'Edit note' : 'Add a note'} onPress={onOpenNote} />
      <FlowDivider />
      <Row
        disabled={disabled}
        label={done ? 'Undo completion' : 'Mark as completed'}
        onPress={onToggle}
      />
    </View>
  );
}
