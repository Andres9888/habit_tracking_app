/** EditHeader - Dark mode aware */
import { View, Pressable, Text, Keyboard, ActivityIndicator } from 'react-native';
import { X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useThemeColors } from '../../theme/ThemeContext';

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
  const { colors } = useThemeColors();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleCancel = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Keyboard.dismiss();
    onCancel();
  };

  const handleSave = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSave();
  };

  const saveEnabled = canSave && !isSaving;

  return (
    <Animated.View
      className='flex-row items-center justify-between px-4 pb-2'
      entering={FadeInDown.delay(0).springify().damping(18)}
      style={{ paddingTop }}
    >
      <Pressable
        accessibilityLabel='Cancel'
        accessibilityRole='button'
        className='h-11 w-11 items-center justify-center rounded-full'
        style={{ backgroundColor: 'transparent' }}
        onPress={handleCancel}
      >
        <X color={colors.text.secondary} size={24} strokeWidth={2} />
      </Pressable>
      <View className='flex-1' />
      <AnimatedPressable
        accessibilityLabel={isSaving ? 'Saving changes' : 'Save changes'}
        accessibilityRole='button'
        accessibilityState={{ busy: isSaving, disabled: !saveEnabled }}
        className='flex-row items-center gap-2 rounded-xl px-5 py-2.5'
        disabled={!saveEnabled}
        style={[
          animatedStyle,
          {
            backgroundColor: saveEnabled
              ? colors.primary[500]
              : colors.gray[300],
          },
        ]}
        onPress={handleSave}
        onPressIn={() => {
          scale.value = withSpring(0.95, { damping: 18, stiffness: 240 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 18, stiffness: 240 });
        }}
      >
        {isSaving && <ActivityIndicator color='#ffffff' size='small' />}
        <Text
          className='font-semibold'
          style={{
            fontSize: 17,
            letterSpacing: -0.41,
            color: saveEnabled ? '#ffffff' : colors.text.tertiary,
          }}
        >
          {isSaving ? 'Saving…' : 'Save'}
        </Text>
      </AnimatedPressable>
    </Animated.View>
  );
}
