import { Pressable } from 'react-native';
import { styles } from '../../templates/templatesScreenStyles';

interface SortOptionsBackdropProps {
  visible: boolean;
  onClose: () => void;
}

export function SortOptionsBackdrop({
  visible,
  onClose,
}: SortOptionsBackdropProps) {
  if (!visible) return null;

  return (
    <Pressable
      accessibilityLabel='Close sort options'
      accessibilityRole='button'
      style={styles.dropdownBackdrop}
      onPress={onClose}
    />
  );
}
