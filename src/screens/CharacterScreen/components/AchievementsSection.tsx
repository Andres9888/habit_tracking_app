import { View, Text } from 'react-native';
import { Target } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AchievementCard } from './AchievementCard';
import type { Achievement } from '../types';

interface AchievementsSectionProps {
  achievements: Achievement[];
}

const STAGGER_DELAY = 60;
const BASE_DELAY = 660;

function EmptyAchievements() {
  return (
    <Animated.View
      className='items-center gap-3 rounded-3xl border border-stone-100 bg-white px-6 py-8'
      entering={FadeInDown.delay(BASE_DELAY + STAGGER_DELAY).springify().damping(18)}
      style={{
        shadowColor: '#1c1917',
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
      }}
    >
      <View className='h-14 w-14 items-center justify-center rounded-full bg-stone-50'>
        <Target color='#a8a29e' size={28} />
      </View>
      <Text
        className='text-center font-semibold text-[#78716c]'
        style={{ fontSize: 17, letterSpacing: -0.41, lineHeight: 22 }}
      >
        No achievements yet
      </Text>
      <Text
        className='text-center text-[#a8a29e]'
        style={{ fontSize: 13, letterSpacing: -0.08, lineHeight: 18, maxWidth: 240 }}
      >
        Complete habits consistently to unlock achievements and level up your character
      </Text>
    </Animated.View>
  );
}

export function AchievementsSection({
  achievements,
}: AchievementsSectionProps) {
  return (
    <View className='mb-8 flex-col gap-3'>
      <Animated.Text
        className='px-1 font-semibold text-[#1c1917]'
        entering={FadeInDown.delay(BASE_DELAY).springify().damping(18)}
        style={{ fontSize: 17, letterSpacing: -0.41, lineHeight: 22 }}
      >
        Recent Achievements
      </Animated.Text>
      {achievements.length === 0 ? (
        <EmptyAchievements />
      ) : (
        achievements.map((achievement, index) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            delay={BASE_DELAY + STAGGER_DELAY * (index + 1)}
          />
        ))
      )}
    </View>
  );
}
