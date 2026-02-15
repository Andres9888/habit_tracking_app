/** EditHeader - X button left, Save button right (like Create modal) */
import { View, Pressable, Text, Keyboard, ActivityIndicator } from 'react-native';
import { X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { t } from '../../i18n';

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

  return (
    <Animated.View
      className='flex-row items-center justify-between px-4 pb-2'
      entering={FadeInDown.delay(0).springify().damping(18)}
      style={{ paddingTop }}
    >
      <Pressable
        accessibilityLabel='Cancel'
        accessibilityRole='button'
        className='h-11 w-11 items-center justify-center rounded-full active:bg-stone-100'
        onPress={handleCancel}
      >
        <X color='#44403c' size={24} strokeWidth={2} />
      </Pressable>
      <View className='flex-1' />
      <AnimatedPressable
        accessibilityLabel={isSaving ? 'Saving changes' : 'Save changes'}
        accessibilityRole='button'
        accessibilityState={{ busy: isSaving, disabled: !canSave || isSaving }}
        className={`flex-row items-center gap-2 rounded-xl px-5 py-2.5 ${canSave && !isSaving ? 'bg-[#059669]' : 'bg-stone-300'}`}
        disabled={!canSave || isSaving}
        style={animatedStyle}
        onPress={handleSave}
        onPressIn={() => {
          scale.value = withSpring(0.95, { damping: 15 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 15 });
        }}
      >
        {isSaving && <ActivityIndicator color='#ffffff' size='small' />}
        <Text
          className={`font-semibold ${canSave && !isSaving ? 'text-white' : 'text-stone-500'}`}
          style={{ fontSize: 17, letterSpacing: -0.41 }}
        >
          {isSaving ? t('common.saving') : t('common.save')}
        </Text>
      </AnimatedPressable>
    </Animated.View>
  );
}
