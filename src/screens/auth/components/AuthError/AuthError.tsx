/** AuthError - OPTIMIZED: FadeIn animation, better styling, haptics */
import { Text, Pressable, View } from 'react-native';
import { AlertCircle, X } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { AuthErrorProps } from './types';

export function AuthError({ message, onDismiss }: AuthErrorProps) {
  const handleDismiss = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDismiss();
  };

  return (
    <Animated.View
      accessibilityLiveRegion='assertive'
      accessibilityRole='alert'
      className='mb-4 flex-row items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4'
      entering={FadeIn.duration(280).springify().damping(18)}
      exiting={FadeOut.duration(200)}
      style={{
        shadowColor: '#1c1917',
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      }}
    >
      <View className='mt-0.5 h-8 w-8 items-center justify-center rounded-full bg-red-100'>
        <AlertCircle color='#dc2626' size={18} strokeWidth={2.5} />
      </View>
      <View className='flex-1'>
        <Text className='text-[17px] font-medium leading-[22px] text-red-800'>
          {message}
        </Text>
      </View>
      <Pressable
        accessibilityHint='Removes the error message from the screen'
        accessibilityLabel='Dismiss error'
        accessibilityRole='button'
        className='h-8 w-8 items-center justify-center rounded-full active:bg-red-100'
        onPress={handleDismiss}
      >
        <X color='#dc2626' size={18} strokeWidth={2} />
      </Pressable>
    </Animated.View>
  );
}
