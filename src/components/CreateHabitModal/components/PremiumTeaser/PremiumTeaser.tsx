
import { Animated, Pressable, View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import useHapticFeedback from '../../../../hooks/useHapticFeedback';
import { TeaserContent } from './TeaserContent';
import { getAISuggestions } from './suggestions';
import { usePremiumTeaserAnimations } from './usePremiumTeaserAnimations';

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
        <View className='p-4'>
          <LinearGradient
            className='absolute inset-0'
            colors={['#f5f3ff', '#e0e7ff']}
            end={{ x: 1, y: 0 }}
            start={{ x: 0, y: 0 }}
          />
          {/* Shimmer overlay */}
          <Animated.View className='absolute inset-0' style={{ opacity: shimmerOpacity }}>
            <LinearGradient
              className='absolute inset-0'
              colors={['transparent', 'rgba(221, 214, 254, 0.3)', 'transparent']}
              end={{ x: 1, y: 0 }}
              start={{ x: 0, y: 0 }}
            />
          </Animated.View>
          <TeaserContent suggestions={suggestions} />
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default PremiumTeaser;
