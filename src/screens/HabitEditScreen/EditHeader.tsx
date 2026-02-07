/** EditHeader - X button left, Save button right (like Create modal) */
import { View, Pressable, Text, Keyboard } from 'react-native';
import { X } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface EditHeaderProps {
  paddingTop: number;
  canSave?: boolean;
  onCancel: () => void;
  onSave: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function EditHeader({
  paddingTop,
  canSave = true,
  onCancel,
  onSave,
}: EditHeaderProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View
      className='flex-row items-center justify-between px-4 pb-2'
      style={{ paddingTop }}
    >
      <Pressable
        accessibilityLabel='Cancel'
        accessibilityRole='button'
        className='h-11 w-11 items-center justify-center rounded-full active:bg-stone-100'
        onPress={() => {
          Keyboard.dismiss();
          onCancel();
        }}
      >
        <X color='#44403c' size={24} strokeWidth={2} />
      </Pressable>
      <View className='flex-1' />
      <AnimatedPressable
        accessibilityLabel='Save changes'
        accessibilityRole='button'
        className={`rounded-full px-5 py-2.5 ${canSave ? 'bg-emerald-600' : 'bg-stone-300'}`}
        disabled={!canSave}
        style={animatedStyle}
        onPress={onSave}
        onPressIn={() => {
          scale.value = withSpring(0.95, { damping: 15 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 15 });
        }}
      >
        <Text
          className={`text-[15px] font-semibold ${canSave ? 'text-white' : 'text-stone-500'}`}
        >
          Save
        </Text>
      </AnimatedPressable>
    </View>
  );
}
