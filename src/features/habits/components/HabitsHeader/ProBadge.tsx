
import { Pressable, Text } from 'react-native';

import { Crown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ProBadgeProps {
  onPress: () => void;
}

export function ProBadge({ onPress }: ProBadgeProps) {
  return (
    <Pressable
      accessibilityHint='Open upgrade screen'
      accessibilityLabel='Upgrade to Pro'
      accessibilityRole='button'
      onPress={onPress}
    >
      <LinearGradient
        className='flex-row items-center gap-1 rounded-full px-3 py-1.5'
        colors={['#8b5cf6', '#7c3aed']}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
      >
        <Crown color='#ffffff' size={12} strokeWidth={2.5} />
        <Text className='text-[11px] font-bold tracking-wide text-white'>
          PRO
        </Text>
      </LinearGradient>
    </Pressable>
  );
}
