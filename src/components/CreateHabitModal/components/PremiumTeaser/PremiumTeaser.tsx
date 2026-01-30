import { Animated, Pressable, View } from 'react-native';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';
import { getAISuggestions } from './suggestions';
import { usePremiumTeaserAnimations } from './usePremiumTeaserAnimations';
import { TeaserContent } from './TeaserContent';

interface PremiumTeaserProps {
  habitName: string;
  onUpgrade: () => void;
}

export function PremiumTeaser({ habitName, onUpgrade }: PremiumTeaserProps) {
  const { triggerSelection } = useHapticFeedback();
  const { opacityAnim, slideAnim, shimmerOpacity } =
    usePremiumTeaserAnimations(habitName);

  const suggestions = getAISuggestions(habitName);

  if (habitName.trim().length < 3) {
    return null;
  }

  return (
    <Animated.View
      className='mb-6'
      style={{
        opacity: opacityAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <Pressable
        accessibilityLabel='Unlock AI suggestions with Premium'
        accessibilityRole='button'
        className='overflow-hidden rounded-2xl'
        onPress={() => {
          triggerSelection();
          onUpgrade();
        }}
      >
        <View className='bg-gradient-to-r from-violet-50 to-indigo-50 p-4'>
          {/* Shimmer overlay */}
          <Animated.View
            className='absolute inset-0 bg-gradient-to-r from-transparent via-violet-200/30 to-transparent'
            style={{ opacity: shimmerOpacity }}
          />
          <TeaserContent suggestions={suggestions} />
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default PremiumTeaser;
