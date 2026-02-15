
import { Text, Pressable } from 'react-native';

import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ArrowLeft } from 'lucide-react-native';

interface ScreenHeaderProps {
  onBack?: () => void;
}

export function ScreenHeader({ onBack }: ScreenHeaderProps) {
  const handleBack = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onBack?.();
  };

  return (
    <Animated.View
      className='mb-6 flex-row items-center'
      entering={FadeInDown.delay(0).springify().damping(18)}
    >
      {onBack && (
        <Pressable
          accessibilityLabel='Go back'
          accessibilityRole='button'
          className='mr-4 h-10 w-10 items-center justify-center'
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          onPress={handleBack}
        >
          <ArrowLeft color='#101828' size={24} />
        </Pressable>
      )}
      <Text
        className='font-semibold text-[#1c1917]'
        style={{ fontSize: 22, letterSpacing: 0.35, lineHeight: 28 }}
      >
        Character
      </Text>
    </Animated.View>
  );
}
