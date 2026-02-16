import { Text, Pressable, ActivityIndicator, View } from 'react-native';
import { ArrowLeft, Share2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface ScreenHeaderProps {
  onBack?: () => void;
  onShare?: () => void;
  isSharing?: boolean;
}

export function ScreenHeader({ onBack, onShare, isSharing }: ScreenHeaderProps) {
  const handleBack = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onBack?.();
  };

  const handleShare = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onShare?.();
  };

  return (
    <Animated.View
      className='mb-6 flex-row items-center justify-between'
      entering={FadeInDown.delay(0).springify().damping(18)}
    >
      <View className='flex-row items-center'>
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
      </View>
      {onShare && (
        <Pressable
          accessibilityLabel='Share your stats'
          accessibilityHint='Share your level and achievements'
          accessibilityRole='button'
          className='h-10 w-10 items-center justify-center'
          disabled={isSharing}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          onPress={handleShare}
        >
          {isSharing ? (
            <ActivityIndicator size='small' color='#047857' />
          ) : (
            <Share2 color='#047857' size={24} />
          )}
        </Pressable>
      )}
    </Animated.View>
  );
}
