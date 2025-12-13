import { View, Text, ScrollView, Pressable } from 'react-native';
import {
  ArrowLeft,
  Heart,
  Dumbbell,
  Brain,
  Zap,
  Flame,
  Trophy,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface CharacterScreenProps {
  onBack?: () => void;
}

interface AttributeCardProps {
  icon: React.ReactNode;
  name: string;
  value: number;
  maxValue: number;
  gradientColors: readonly [string, string];
  bgGradient: readonly [string, string];
}

interface StatCardProps {
  emoji: string;
  value: number | string;
  label: string;
}

const AttributeCard = ({
  icon,
  name,
  value,
  maxValue,
  gradientColors,
  bgGradient,
}: AttributeCardProps) => {
  const percentage = (value / maxValue) * 100;

  return (
    <Animated.View
      className='overflow-hidden rounded-3xl border border-gray-100 bg-white'
      entering={FadeInDown.duration(400)}
    >
      <View className='relative h-[110px]'>
        {/* Background gradient */}
        <View
          className='absolute left-0 top-0 h-full opacity-60'
          style={{ width: `${percentage}%` }}
        >
          <LinearGradient
            colors={bgGradient}
            end={{ x: 1, y: 0 }}
            start={{ x: 0, y: 0 }}
            style={{ height: '100%', width: '100%' }}
          />
        </View>

        {/* Content */}
        <View className='flex-col gap-3 px-6 pt-6'>
          <View className='flex-row items-center justify-between'>
            <View className='flex-row items-center gap-3'>
              <View className='h-10 w-10 items-center justify-center rounded-full bg-white shadow-md'>
                {icon}
              </View>
              <Text className='text-base font-normal leading-6 tracking-[-0.3125px] text-[#101828]'>
                {name}
              </Text>
            </View>
            <Text className='text-base font-normal leading-6 tracking-[-0.3125px] text-[#101828]'>
              {value}
            </Text>
          </View>

          {/* Progress bar */}
          <View className='h-2 w-full overflow-hidden rounded-full bg-gray-100'>
            <View style={{ width: `${percentage}%` }}>
              <LinearGradient
                colors={gradientColors}
                end={{ x: 1, y: 0 }}
                start={{ x: 0, y: 0 }}
                style={{ borderRadius: 9999, height: '100%', width: '100%' }}
              />
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const StatCard = ({ emoji, value, label }: StatCardProps) => (
  <Animated.View
    className='flex-1 flex-col items-center gap-1 rounded-2xl border border-gray-100 bg-white px-4 py-4'
    entering={FadeInDown.duration(500)}
  >
    <Text className='text-2xl leading-8'>{emoji}</Text>
    <Text className='text-base font-normal leading-6 tracking-[-0.3125px] text-[#101828]'>
      {value}
    </Text>
    <Text className='text-center text-xs font-normal leading-4 text-[#6a7282]'>
      {label}
    </Text>
  </Animated.View>
);

export default function CharacterScreen({ onBack }: CharacterScreenProps) {
  // Mock data - TODO: Connect to actual habit data
  const characterData = {
    attributes: {
      energy: 41,
      strength: 34,
      vitality: 27,
      wisdom: 20,
    },
    level: 1,
    recentAchievements: [
      {
        description: 'Complete all habits for 7 days',
        icon: '🏆',
        id: '1',
        title: 'Week Warrior',
      },
    ],
    stats: {
      activeHabits: 3,
      dayStreak: 7,
      totalPower: 69,
    },
    title: 'Habit Hero',
    xp: 69,
    xpToNextLevel: 100,
  };

  const xpProgress = (characterData.xp / characterData.xpToNextLevel) * 100;
  const xpRemaining = characterData.xpToNextLevel - characterData.xp;

  return (
    <View className='flex-1 bg-white'>
      <ScrollView className='flex-1'>
        <View className='w-full px-6 pt-[60px]'>
          {/* Header */}
          <View className='mb-6 flex-row items-center'>
            {onBack && (
              <Pressable
                accessibilityLabel='Go back'
                accessibilityRole='button'
                className='mr-4 h-10 w-10 items-center justify-center'
                onPress={onBack}
              >
                <ArrowLeft color='#101828' size={24} />
              </Pressable>
            )}
            <Text className='text-base font-normal leading-6 tracking-[-0.3125px] text-[#101828]'>
              Character
            </Text>
          </View>

          {/* Character Card */}
          <Animated.View
            className='mb-6 overflow-hidden rounded-3xl border border-gray-100 bg-white'
            entering={FadeInDown.duration(300)}
          >
            <View className='flex-col gap-6 px-6 py-6'>
              {/* Avatar and Level */}
              <View className='flex-row items-center justify-between'>
                <View className='flex-row items-center gap-3'>
                  <View className='h-20 w-20 items-center justify-center overflow-hidden rounded-full shadow-lg'>
                    <LinearGradient
                      colors={['#ad46ff', '#f6339a']}
                      end={{ x: 1, y: 1 }}
                      start={{ x: 0, y: 0 }}
                      style={{
                        alignItems: 'center',
                        height: '100%',
                        justifyContent: 'center',
                        width: '100%',
                      }}
                    >
                      <Text className='text-[30px] leading-9'>🦸</Text>
                    </LinearGradient>
                  </View>
                  <View className='flex-col'>
                    <View className='flex-row items-center gap-2'>
                      <Text className='text-base font-normal leading-6 tracking-[-0.3125px] text-[#101828]'>
                        Level {characterData.level}
                      </Text>
                      <Text className='text-lg'>✨</Text>
                    </View>
                    <Text className='text-sm font-normal leading-5 tracking-[-0.15px] text-[#6a7282]'>
                      {characterData.title}
                    </Text>
                  </View>
                </View>
                <View className='overflow-hidden rounded-full'>
                  <LinearGradient
                    colors={['#ff8c00', '#ff6900']}
                    end={{ x: 1, y: 0 }}
                    start={{ x: 0, y: 0 }}
                    style={{
                      alignItems: 'center',
                      flexDirection: 'row',
                      gap: 8,
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                    }}
                  >
                    <Trophy color='white' size={20} />
                    <Text className='text-base font-normal leading-6 tracking-[-0.3125px] text-white'>
                      10
                    </Text>
                  </LinearGradient>
                </View>
              </View>

              {/* XP Progress */}
              <View className='flex-col gap-2'>
                <View className='flex-row items-center justify-between'>
                  <Text className='text-sm font-normal leading-5 tracking-[-0.15px] text-[#4a5565]'>
                    Experience
                  </Text>
                  <Text className='text-sm font-normal leading-5 tracking-[-0.15px] text-[#101828]'>
                    {characterData.xp}/{characterData.xpToNextLevel} XP
                  </Text>
                </View>
                <View className='h-3 w-full overflow-hidden rounded-full bg-gray-100'>
                  <View style={{ width: `${xpProgress}%` }}>
                    <LinearGradient
                      colors={['#ad46ff', '#f6339a']}
                      end={{ x: 1, y: 0 }}
                      start={{ x: 0, y: 0 }}
                      style={{
                        borderRadius: 9999,
                        height: '100%',
                        width: '100%',
                      }}
                    />
                  </View>
                </View>
                <Text className='text-center text-xs font-normal leading-4 text-[#99a1af]'>
                  {xpRemaining} XP to Level {characterData.level + 1}
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Attributes Section */}
          <View className='mb-6 flex-col gap-3'>
            <Text className='px-1 text-base font-normal leading-6 tracking-[-0.3125px] text-[#101828]'>
              Attributes
            </Text>
            <AttributeCard
              bgGradient={['#ffe2e2', '#fdf2f8']}
              gradientColors={['#fb2c36', '#f6339a']}
              icon={<Heart color='#fb2c36' size={20} />}
              maxValue={100}
              name='Vitality'
              value={characterData.attributes.vitality}
            />
            <AttributeCard
              bgGradient={['#ffedd4', '#fffbeb']}
              gradientColors={['#ff6900', '#fe9a00']}
              icon={<Dumbbell color='#ff6900' size={20} />}
              maxValue={100}
              name='Strength'
              value={characterData.attributes.strength}
            />
            <AttributeCard
              bgGradient={['#f3e8ff', '#eef2ff']}
              gradientColors={['#ad46ff', '#615fff']}
              icon={<Brain color='#ad46ff' size={20} />}
              maxValue={100}
              name='Wisdom'
              value={characterData.attributes.wisdom}
            />
            <AttributeCard
              bgGradient={['#fef9c2', '#fff7ed']}
              gradientColors={['#f0b100', '#ff6900']}
              icon={<Zap color='#f0b100' size={20} />}
              maxValue={100}
              name='Energy'
              value={characterData.attributes.energy}
            />
          </View>

          {/* Stats Cards */}
          <View className='mb-6 flex-row gap-3'>
            <StatCard
              emoji='🔥'
              label='Day Streak'
              value={characterData.stats.dayStreak}
            />
            <StatCard
              emoji='⚡'
              label='Total Power'
              value={characterData.stats.totalPower}
            />
            <StatCard
              emoji='🎯'
              label='Active Habits'
              value={characterData.stats.activeHabits}
            />
          </View>

          {/* Recent Achievements */}
          <View className='mb-8 flex-col gap-3'>
            <Text className='px-1 text-base font-normal leading-6 tracking-[-0.3125px] text-[#101828]'>
              Recent Achievements
            </Text>
            {characterData.recentAchievements.map((achievement) => (
              <Animated.View
                key={achievement.id}
                className='flex-row items-center gap-4 rounded-3xl border border-gray-100 bg-white px-6 py-6'
                entering={FadeInDown.duration(600)}
              >
                <View className='h-12 w-12 items-center justify-center rounded-full bg-orange-100 shadow-sm'>
                  <Trophy color='#f59e0b' size={24} />
                </View>
                <View className='flex-1 flex-col'>
                  <Text className='text-base font-normal leading-6 tracking-[-0.3125px] text-[#101828]'>
                    {achievement.title}
                  </Text>
                  <Text className='text-sm font-normal leading-5 tracking-[-0.15px] text-[#6a7282]'>
                    {achievement.description}
                  </Text>
                </View>
                <Text className='text-2xl'>{achievement.icon}</Text>
              </Animated.View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
