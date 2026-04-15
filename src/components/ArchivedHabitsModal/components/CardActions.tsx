import { Text, View } from 'react-native';
import { spacing } from '@/theme/spacing';
import { ActionButton } from './ActionButton';

interface CardActionsProps {
  onRestore: () => void;
  onDelete: () => void;
  onSkip: () => void;
  disabled?: boolean;
}

export function CardActions({
  onRestore,
  onDelete,
  onSkip,
  disabled,
}: CardActionsProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.lg,
        paddingVertical: spacing.lg,
      }}
    >
      <ActionButton
        size={64}
        color="#FEF2F2"
        borderColor="#FECACA"
        onPress={onDelete}
        disabled={disabled}
        label="Delete"
      >
        <Text style={{ fontSize: 24 }}>✕</Text>
      </ActionButton>

      <ActionButton
        size={72}
        color="#059669"
        onPress={onRestore}
        disabled={disabled}
        label="Restore"
        shadow
      >
        <Text style={{ fontSize: 28, color: 'white' }}>↻</Text>
      </ActionButton>

      <ActionButton
        size={64}
        color="#F3F4F6"
        borderColor="#E5E7EB"
        onPress={onSkip}
        disabled={disabled}
        label="Skip"
      >
        <Text style={{ fontSize: 20, color: '#9CA3AF' }}>⏭</Text>
      </ActionButton>
    </View>
  );
}
