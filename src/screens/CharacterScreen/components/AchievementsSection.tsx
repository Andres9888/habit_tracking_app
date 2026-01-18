import { View, Text } from 'react-native';
import { AchievementCard } from './AchievementCard';
import type { Achievement } from '../types';

interface AchievementsSectionProps {
  achievements: Achievement[];
}

export function AchievementsSection({ achievements }: AchievementsSectionProps) {
  return (
    <View className='mb-8 flex-col gap-3'>
      <Text className='px-1 text-base font-normal leading-6 tracking-[-0.3125px] text-[#101828]'>
        Recent Achievements
      </Text>
      {achievements.map((achievement) => (
        <AchievementCard key={achievement.id} achievement={achievement} />
      ))}
    </View>
  );
}
