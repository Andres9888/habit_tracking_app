import { useEffect } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { useThemeColors } from '../../../../../theme/ThemeContext';
import { springs } from '../../../../../theme/animations';
import { spacing } from '../../../../../theme/spacing';
import { typography } from '../../../../../theme/typography';
import { triggerHaptic } from '@/utils/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ImportButtonProps {
  isImported: boolean;
  isImporting: boolean;
  name: string;
  onImport: () => void;
}

export function ImportButton({
  isImported,
  isImporting,
  name,
  onImport,
}: ImportButtonProps) {
  const { colors } = useThemeColors();
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isImported) {
      scale.value = withSpring(1.15, springs.responsive);
      const timeout = setTimeout(() => {
        scale.value = withSpring(1, springs.responsive);
      }, 120);
      return () => clearTimeout(timeout);
    }
  }, [isImported, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      accessibilityLabel={isImported ? `${name} added` : `Import ${name} template`}
      accessibilityRole='button'
      disabled={isImported || isImporting}
      style={[
        styles.button,
        {
          backgroundColor: isImported
            ? colors.primary[100]
            : colors.primary[600],
        },
        animatedStyle,
      ]}
      onPress={(event) => {
        event.stopPropagation();
        void triggerHaptic('selection');
        onImport();
      }}
    >
      {isImporting ? (
        <ActivityIndicator color={colors.text.inverse} size='small' />
      ) : isImported ? (
        <Check color={colors.primary[700]} size={16} strokeWidth={3} />
      ) : (
        <Text style={[styles.label, { color: colors.text.inverse }]}>Add</Text>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 10,
    height: 34,
    justifyContent: 'center',
    minWidth: 78,
    paddingHorizontal: spacing.md,
  },
  label: {
    ...typography.caption,
    fontWeight: '700',
  },
});
