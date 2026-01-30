import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';

import { usePressAnimation } from './usePressAnimation';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface OAuthButtonProps {
  onPress: () => void;
  loading: boolean;
  disabled: boolean;
  providerName: string;
  loadingColor: string;
  Logo: React.ComponentType<{ size: number }>;
  accessibilityLabel: string;
  accessibilityHint: string;
}

export function OAuthButton({
  onPress,
  loading,
  disabled,
  providerName,
  loadingColor,
  Logo,
  accessibilityLabel,
  accessibilityHint,
}: OAuthButtonProps) {
  const { animatedStyle, handlePressIn, handlePressOut } = usePressAnimation();

  return (
    <AnimatedTouchable
      accessible
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='button'
      className='flex-row items-center justify-center gap-3 rounded-3xl border border-stone-200 bg-white py-[14px]'
      disabled={disabled}
      style={animatedStyle}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {loading ? (
        <ActivityIndicator color={loadingColor} size='small' />
      ) : (
        <Logo size={20} />
      )}
      <Text
        className='text-[15px] font-semibold tracking-[2px] text-stone-900'
        style={{ opacity: loading ? 0.6 : 1 }}
      >
        CONTINUE WITH {providerName}
      </Text>
    </AnimatedTouchable>
  );
}
