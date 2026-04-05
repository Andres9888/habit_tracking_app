/** EditHeader - Dark mode aware */
import { View, Pressable, Text, Keyboard, ActivityIndicator } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useThemeColors } from '../../theme';
import { typography } from '@/theme/typography';
import { triggerHaptic } from '@/utils/haptics';
import { springs } from '@/theme/animations';
import { ModalCloseButton } from '@/components/ui/ModalCloseButton';

interface EditHeaderProps {
  paddingTop: number;
  canSave?: boolean;
  isSaving?: boolean;
  onCancel: () => void;
  onSave: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function EditHeader({
  paddingTop,
  canSave = true,
  isSaving = false,
  onCancel,
  onSave,
}: EditHeaderProps) {
  const { colors, isDark } = useThemeColors();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleCancel = () => {
    void triggerHaptic('tap');
    Keyboard.dismiss();
    onCancel();
  };

  const handleSave = () => {
    void triggerHaptic('toggle');
    onSave();
  };

  const disabledBg = isDark ? colors.gray[300] : '#D6D3D1';
  const disabledText = isDark ? colors.text.tertiary : '#78716C';

  return (
    <Animated.View
      className='flex-row items-center justify-between px-4 pb-2'
      entering={FadeInDown.delay(0).springify().damping(18)}
      style={{ paddingTop }}
    >
      <ModalCloseButton label='Cancel' onClose={handleCancel} />
      <View className='flex-1' />
      <AnimatedPressable
        accessibilityLabel={isSaving ? 'Saving changes' : 'Save changes'}
        accessibilityRole='button'
        accessibilityState={{ busy: isSaving, disabled: !canSave || isSaving }}
        className='flex-row items-center justify-center gap-2 rounded-full h-11 px-6'
        disabled={!canSave || isSaving}
        style={[
          animatedStyle,
          { backgroundColor: canSave && !isSaving ? colors.primary[600] : disabledBg },
        ]}
        onPress={handleSave}
        onPressIn={() => {
          scale.value = withSpring(0.95, springs.button);
        }}
        onPressOut={() => {
          scale.value = withSpring(1, springs.button);
        }}
      >
        {isSaving ? <ActivityIndicator color='#ffffff' size='small' /> : null}
        <Text
          className='font-semibold'
          style={{
            ...typography.button,
            letterSpacing: -0.41,
            color: canSave && !isSaving ? '#FFFFFF' : disabledText,
          }}
        >
          {isSaving ? 'Saving…' : 'Save'}
        </Text>
      </AnimatedPressable>
    </Animated.View>
  );
}
