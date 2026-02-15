import { View, Text, Pressable } from 'react-native';
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
      style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}
      entering={FadeInDown.delay(0).springify().damping(18)}
    >
      {onBack && (
        <Pressable
          accessible
          accessibilityLabel='Go back'
          accessibilityRole='button'
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
            marginRight: 16,
            height: 44,
            width: 44,
            alignItems: 'center',
            justifyContent: 'center',
          })}
          onPress={handleBack}
        >
          <ArrowLeft color={colors.text.primary} size={24} />
        </Pressable>
      )}
      <Text
        accessibilityRole="header"
        style={{
          fontSize: 22,
          fontWeight: '600',
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
