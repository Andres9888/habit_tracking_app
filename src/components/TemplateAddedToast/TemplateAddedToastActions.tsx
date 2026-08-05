import { Pressable, Text, View } from 'react-native';
import { styles } from './styles';

interface TemplateAddedToastActionsProps {
  color: string;
  handleDismiss: () => void;
  onAddAnother?: () => void;
  primaryLabel: string;
  viewHabit?: () => void;
}

export function TemplateAddedToastActions({
  color,
  handleDismiss,
  onAddAnother,
  primaryLabel,
  viewHabit,
}: TemplateAddedToastActionsProps) {
  return (
    <View style={styles.actionColumn}>
      {viewHabit ? (
        <Pressable
          accessibilityLabel={primaryLabel}
          accessibilityRole='button'
          style={[styles.actionPill, { backgroundColor: color }]}
          onPress={() => {
            handleDismiss();
            viewHabit();
          }}
        >
          <Text style={styles.actionText}>{primaryLabel}</Text>
        </Pressable>
      ) : null}
      {onAddAnother ? (
        <Pressable
          accessibilityLabel='Add another habit'
          accessibilityRole='button'
          onPress={() => {
            handleDismiss();
            onAddAnother();
          }}
        >
          <Text style={styles.addAnotherText}>Add another</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
