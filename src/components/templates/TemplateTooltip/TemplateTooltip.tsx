import { Pressable, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import { Sparkles } from 'lucide-react-native';

interface TemplateTooltipProps {
  onDismiss: () => void;
  visible: boolean;
}

export const TemplateTooltip = ({
  onDismiss,
  visible,
}: TemplateTooltipProps) => {
  if (!visible) return null;

  return (
    <Animated.View
      className='absolute right-0 top-14 z-50'
      entering={SlideInDown.duration(300).springify()}
      exiting={SlideOutDown.duration(200)}
    >
      {/* Arrow pointing up */}
      <View className='mr-6 items-end'>
        <View
          className='h-3 w-3 rotate-45 bg-[#101828]'
          style={{ marginBottom: -6 }}
        />
      </View>

      {/* Tooltip content */}
      <View className='mr-2 w-64 rounded-2xl bg-[#101828] p-4 shadow-2xl'>
        {/* Icon + Title */}
        <View className='mb-2 flex-row items-center gap-2'>
          <Sparkles color='#60A5FA' size={18} strokeWidth={2} />
          <Text className='text-[15px] font-semibold text-white'>
            Import Habits
          </Text>
        </View>

        {/* Description */}
        <Text className='mb-3 text-[13px] leading-[18px] text-white/80'>
          Browse science-backed habits you can add to your routine instantly.
        </Text>

        {/* Dismiss button */}
        <Pressable
          accessibilityLabel='Dismiss tooltip'
          accessibilityRole='button'
          className='self-end'
          onPress={onDismiss}
        >
          <Text className='text-[13px] font-semibold text-blue-400'>
            Got it!
          </Text>
        </Pressable>
      </View>

      {/* Backdrop for dismissing */}
      <Animated.View
        className='absolute -inset-96 -z-10'
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
      >
        <Pressable
          accessibilityLabel='Dismiss tooltip'
          className='h-full w-full'
          onPress={onDismiss}
        />
      </Animated.View>
    </Animated.View>
  );
};

