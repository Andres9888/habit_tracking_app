import { View, Text, Pressable } from 'react-native';
import { Trash2, Undo2 } from 'lucide-react-native';

import { useThemeColors } from '../../../theme/ThemeContext';
import { layoutStyles, deleteToastColors } from '../styles';

interface ToastContentProps {
  itemName: string;
  onUndo: () => void;
}

/**
 * Content section of the DeleteUndoToast
 * Contains icon, message, and undo button — dark mode aware
 */
export function ToastContent({ itemName, onUndo }: ToastContentProps) {
  const { colors, isDark } = useThemeColors();
  const tc = deleteToastColors(isDark, colors);

  return (
    <View style={layoutStyles.content}>
      <View style={[layoutStyles.iconContainer, { backgroundColor: tc.iconBg }]}>
        <Trash2 color={tc.iconColor} size={18} strokeWidth={2} />
      </View>

      <Text numberOfLines={1} style={layoutStyles.message}>
        <Text style={{ color: tc.itemNameColor, fontWeight: '600' }}>"{itemName}"</Text>
        <Text style={{ color: tc.messageColor }}> will be deleted</Text>
      </Text>

      <Pressable
        accessibilityLabel='Undo delete'
        accessibilityRole='button'
        style={({ pressed }) => [
          layoutStyles.undoButton,
          { backgroundColor: pressed ? tc.undoBgPressed : tc.undoBg },
        ]}
        onPress={onUndo}
      >
        <Undo2 color={tc.undoColor} size={14} strokeWidth={2.5} />
        <Text style={[layoutStyles.undoText, { color: tc.undoColor }]}>UNDO</Text>
      </Pressable>
    </View>
  );
}
