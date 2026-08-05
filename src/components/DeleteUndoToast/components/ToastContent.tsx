import { View, Text, Pressable } from 'react-native';
import { Trash2, Undo2 } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';

import { useThemeColors } from '../../../theme/ThemeContext';
import { useToastStyles } from '../styles';

interface ToastContentProps {
  itemName: string;
  onUndo: () => void;
}

/**
 * Content section of the DeleteUndoToast
 * Contains icon, message, and undo button
 */
export function ToastContent({ itemName, onUndo }: ToastContentProps) {
  const { colors } = useThemeColors();
  const styles = useToastStyles();
  const redIconColor = colors.status.error;

  return (
    <View style={styles.content}>
      <View style={styles.iconContainer}>
        <Trash2 color={redIconColor} size={iconSizes.medium} strokeWidth={2} />
      </View>

      <Text numberOfLines={1} style={styles.message}>
        <Text style={styles.itemName}>"{itemName}"</Text>
        <Text style={styles.messageText}> will be deleted</Text>
      </Text>

      <Pressable
        accessibilityLabel='Undo delete'
        accessibilityRole='button'
        style={({ pressed }) => [
          styles.undoButton,
          pressed && styles.undoButtonPressed,
        ]}
        onPress={onUndo}
      >
        <Undo2 color={redIconColor} size={iconSizes.small} strokeWidth={2.5} />
        <Text style={styles.undoText}>UNDO</Text>
      </Pressable>
    </View>
  );
}
