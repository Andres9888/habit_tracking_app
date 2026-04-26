/** ImportHeader - Matches EditHeader style (cancel + import button) */
import { View, Pressable, Text, Keyboard, ActivityIndicator } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useThemeColors } from '../../../theme';
import { typography } from '@/theme/typography';
import { triggerHaptic } from '@/utils/haptics';
import { durations, enterEasing, springs } from '@/theme/animations';
import { ModalCloseButton } from '@/components/ui/ModalCloseButton';

interface ImportHeaderProps {
  paddingTop: number;
  canImport?: boolean;
  isImporting?: boolean;
  onCancel: () => void;
  onImport: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ImportHeader({
  paddingTop,
  canImport = true,
  isImporting = false,
  onCancel,
  onImport,
}: ImportHeaderProps) {
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

  const handleImport = () => {
    void triggerHaptic('toggle');
    onImport();
  };

  const disabledBg = isDark ? colors.gray[300] : '#D6D3D1';
  const disabledText = isDark ? colors.text.tertiary : '#78716C';

  return (
    <Animated.View
      className='flex-row items-center justify-between px-4 pb-2'
      entering={FadeInDown.delay(0).duration(durations.enter).easing(enterEasing)}
      style={{ paddingTop }}
    >
      <ModalCloseButton label='Cancel' onClose={handleCancel} />
      <View className='flex-1' />
      <AnimatedPressable
        accessibilityLabel={isImporting ? 'Adding habit' : 'Add this habit'}
        accessibilityRole='button'
        accessibilityState={{ busy: isImporting, disabled: !canImport || isImporting }}
        className='flex-row items-center justify-center gap-2 rounded-full h-11 px-6'
        disabled={!canImport || isImporting}
        style={[
          animatedStyle,
          { backgroundColor: canImport && !isImporting ? colors.primary[600] : disabledBg },
        ]}
        onPress={handleImport}
        onPressIn={() => {
          scale.value = withSpring(0.95, springs.button);
        }}
        onPressOut={() => {
          scale.value = withSpring(1, springs.button);
        }}
      >
        {isImporting ? <ActivityIndicator color={colors.text.inverse} size='small' /> : null}
        <Text
          className='font-semibold'
          style={{
            ...typography.button,
            letterSpacing: -0.41,
            color: canImport && !isImporting ? colors.text.inverse : disabledText,
          }}
        >
          {isImporting ? 'Adding…' : 'Add this habit'}
        </Text>
      </AnimatedPressable>
    </Animated.View>
  );
}
