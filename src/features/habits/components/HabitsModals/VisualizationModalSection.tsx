import { Alert, Pressable, Text, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { X } from 'lucide-react-native';

import CustomModal from '../../../../components/Modal';
import { VisualizationExercise } from '../../../../components/VisualizationExercise';
import { useHaptics } from '../../../../utils/haptics/useHaptics';
import { useThemeColors } from '../../../../theme/ThemeContext';
import type { VisualizationModalSectionProps } from './HabitsModals.types';
import { useThemeColors } from '@/theme/ThemeContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function handleSave(_data: unknown) {
  Alert.alert(
    'Visualization Saved!',
    'Your mental contrasting exercise has been saved. Review it when you need motivation.',
    [{ text: 'Got it' }]
  );
}

/** Visualization modal section - mental boost / visualization exercise */
export function VisualizationModalSection({
  selectedHabit,
  showVisualizationExercise,
  closeVisualizationExercise,
}: VisualizationModalSectionProps) {
  const { colors } = useThemeColors();
  const insets = useSafeAreaInsets();
  const closeScale = useSharedValue(1);
  const { colors } = useThemeColors();
  const { trigger } = useHaptics();

  const closeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: closeScale.value }],
  }));

  const handleClose = () => {
    trigger('tap');
    closeVisualizationExercise();
  };

  return (
    <CustomModal
      variant='fullScreen'
      visible={showVisualizationExercise}
      onClose={handleClose}
    >
      <View
        className='flex-1'
        style={[
          { backgroundColor: colors.background },
          { paddingTop: insets.top + 16 },
        ]}
      >
        <View
          style={[
            styles.header,
            {
              borderBottomColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.title, { color: colors.text.primary }]}>
            Mental Boost
          </Text>
          <AnimatedPressable
            accessibilityHint='Close the mental boost exercise'
            accessibilityLabel='Close mental boost'
            accessibilityRole='button'
            style={[
              closeAnimatedStyle,
              styles.closeButton,
              { backgroundColor: colors.gray[100] },
            ]}
            onPress={handleClose}
            onPressIn={() => {
              closeScale.value = withSpring(0.9, {
                damping: 15,
                stiffness: 200,
              });
            }}
            onPressOut={() => {
              closeScale.value = withSpring(1, { damping: 18, stiffness: 150 });
            }}
          >
            <X color={colors.text.primary} size={24} />
          </AnimatedPressable>
        </View>
        <View
          className='flex-1 px-5 pt-4'
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          <VisualizationExercise
            habitName={selectedHabit?.name ?? ''}
            onClose={handleClose}
            onSave={handleSave}
          />
        </View>
      </View>
    </CustomModal>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    alignItems: 'center',
    borderRadius: 9999,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  header: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
