import { Text, Pressable } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';

interface ScreenHeaderProps {
  onBack?: () => void;
}

export function ScreenHeader({ onBack }: ScreenHeaderProps) {
  const { colors } = useThemeColors();

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
          <ArrowLeft color={colors.text.primary} size={24} />
        </Pressable>
      )}
      <Text
        className='font-semibold'
        style={{
          fontSize: 22,
          letterSpacing: 0.35,
          lineHeight: 28,
          color: colors.text.primary,
        }}
      >
        Character
      </Text>
    </Animated.View>
  );
}
