import { Pressable, Text } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import type { SemanticColors } from '@/theme/darkColors';
import { iconSizes } from '@/theme/iconSizes';
import { styles } from '../../templates/templatesScreenStyles';

export function CategoryHeaderBackButton({
  colors,
  onPress,
}: {
  colors: SemanticColors;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessible
      accessibilityLabel='Go back to browse'
      accessibilityRole='button'
      style={styles.backButton}
      onPress={onPress}
    >
      <ArrowLeft
        color={colors.text.secondary}
        size={iconSizes.medium}
        strokeWidth={2.5}
      />
      <Text style={[styles.backButtonText, { color: colors.text.secondary }]}>
        Back
      </Text>
    </Pressable>
  );
}
