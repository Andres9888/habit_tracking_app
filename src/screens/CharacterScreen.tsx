import { View, Text, ScrollView, Pressable } from 'react-native';
import { ArrowLeft, Heart, Dumbbell, Brain, Zap, Flame, Trophy } from 'lucide-react-native';
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
  gradientColors: string[];
  bgGradient: string[];
}

interface StatCardProps {
  emoji: string;
  value: number | string;
  label: string;
}

const AttributeCard = ({ icon, name, value, maxValue, gradientColors, bgGradient }: AttributeCardProps) => {
  const percentage = (value / maxValue) * 100;

  return (
    <Animated.View
      entering={FadeInDown.duration(400)}
      className="overflow-hidden rounded-3xl border border-gray-100 bg-white"
    >
      <View className="relative h-[110px]">
        {/* Background gradient */}
        <View className="absolute left-0 top-0 h-full opacity-60" style={{ width: `${percentage}%` }}>
          <LinearGradient
            colors={bgGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: '100%', height: '100%' }}
          />
        </View>

        {/* Content */}
        <View className="flex-col gap-3 px-6 pt-6">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-md">
                {icon}
              </View>
              <Text className="text-base font-normal leading-6 tracking-[-0.3125px] text-[#101828]">
                {name}
              </Text>
            </View>
            <Text className="text-base font-normal leading-6 tracking-[-0.3125px] text-[#101828]">
              {value}
            </Text>
          </View>

          {/* Progress bar */}
          <View className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <View style={{ width: `${percentage}%` }}>
              <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ width: '100%', height: '100%', borderRadius: 9999 }}
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
    entering={FadeInDown.duration(500)}
    className="flex-1 flex-col items-center gap-1 rounded-2xl border border-gray-100 bg-white px-4 py-4"
  >
    <Text className="text-2xl leading-8">{emoji}</Text>
    <Text className="text-base font-normal leading-6 tracking-[-0.3125px] text-[#101828]">
      {value}
    </Text>
    <Text className="text-center text-xs font-normal leading-4 text-[#6a7282]">
      {label}
    </Text>
  </Animated.View>
);

export default function CharacterScreen({ onBack }: CharacterScreenProps) {
  // Mock data - TODO: Connect to actual habit data
  const characterData = {
    level: 1,
    title: 'Habit Hero',
    xp: 69,
    xpToNextLevel: 100,
    attributes: {
      vitality: 27,
      strength: 34,
      wisdom: 20,
      energy: 41,
    },
    stats: {
      dayStreak: 7,
      totalPower: 69,
      activeHabits: 3,
    },
    recentAchievements: [
      {
        id: '1',
        title: 'Week Warrior',
        description: 'Complete all habits for 7 days',
        icon: '🏆',
      },
    ],
  };

  const xpProgress = (characterData.xp / characterData.xpToNextLevel) * 100;
  const xpRemaining = characterData.xpToNextLevel - characterData.xp;

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="w-full px-6 pt-[60px]">
          {/* Header */}
          <View className="mb-6 flex-row items-center">
            {onBack && (
              <Pressable
                onPress={onBack}
                className="mr-4 h-10 w-10 items-center justify-center"
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <ArrowLeft color="#101828" size={24} />
              </Pressable>
            )}
            <Text className="text-base font-normal leading-6 tracking-[-0.3125px] text-[#101828]">
              Character
            </Text>
          </View>

          {/* Character Card */}
          <Animated.View
            entering={FadeInDown.duration(300)}
            className="mb-6 overflow-hidden rounded-3xl border border-gray-100 bg-white"
          >
            <View className="flex-col gap-6 px-6 py-6">
              {/* Avatar and Level */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <View className="h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                    <Text className="text-[30px] leading-9">🦸</Text>
                  </View>
                  <View className="flex-col">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-base font-normal leading-6 tracking-[-0.3125px] text-[#101828]">
                        Level {characterData.level}
                      </Text>
                      <Text className="text-lg">✨</Text>
                    </View>
                    <Text className="text-sm font-normal leading-5 tracking-[-0.15px] text-[#6a7282]">
                      {characterData.title}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-2 rounded-full bg-orange-500 px-4 py-2">
                  <Trophy color="white" size={16} />
                  <Text className="text-sm font-normal leading-5 tracking-[-0.15px] text-white">
                    10
                  </Text>
                </View>
              </View>

              {/* XP Progress */}
              <View className="flex-col gap-2">
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm font-normal leading-5 tracking-[-0.15px] text-[#4a5565]">
                    Experience
                  </Text>
                  <Text className="text-sm font-normal leading-5 tracking-[-0.15px] text-[#101828]">
                    {characterData.xp}/{characterData.xpToNextLevel} XP
                  </Text>
                </View>
                <View className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                  <View style={{ width: `${xpProgress}%` }}>
                    <LinearGradient
                      colors={['#ad46ff', '#f6339a']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{ width: '100%', height: '100%', borderRadius: 9999 }}
                    />
                  </View>
                </View>
                <Text className="text-center text-xs font-normal leading-4 text-[#99a1af]">
                  {xpRemaining} XP to Level {characterData.level + 1}
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Attributes Section */}
          <View className="mb-6 flex-col gap-3">
            <Text className="px-1 text-base font-normal leading-6 tracking-[-0.3125px] text-[#101828]">
              Attributes
            </Text>
            <AttributeCard
              icon={<Heart color="#fb2c36" size={20} />}
              name="Vitality"
              value={characterData.attributes.vitality}
              maxValue={100}
              gradientColors={['#fb2c36', '#f6339a']}
              bgGradient={['#ffe2e2', '#fdf2f8']}
            />
            <AttributeCard
              icon={<Dumbbell color="#ff6900" size={20} />}
              name="Strength"
              value={characterData.attributes.strength}
              maxValue={100}
              gradientColors={['#ff6900', '#fe9a00']}
              bgGradient={['#ffedd4', '#fffbeb']}
            />
            <AttributeCard
              icon={<Brain color="#ad46ff" size={20} />}
              name="Wisdom"
              value={characterData.attributes.wisdom}
              maxValue={100}
              gradientColors={['#ad46ff', '#615fff']}
              bgGradient={['#f3e8ff', '#eef2ff']}
            />
            <AttributeCard
              icon={<Zap color="#f0b100" size={20} />}
              name="Energy"
              value={characterData.attributes.energy}
              maxValue={100}
              gradientColors={['#f0b100', '#ff6900']}
              bgGradient={['#fef9c2', '#fff7ed']}
            />
          </View>

          {/* Stats Cards */}
          <View className="mb-6 flex-row gap-3">
            <StatCard emoji="🔥" value={characterData.stats.dayStreak} label="Day Streak" />
            <StatCard emoji="⚡" value={characterData.stats.totalPower} label="Total Power" />
            <StatCard emoji="🎯" value={characterData.stats.activeHabits} label="Active Habits" />
          </View>

          {/* Recent Achievements */}
          <View className="mb-8 flex-col gap-3">
            <Text className="px-1 text-base font-normal leading-6 tracking-[-0.3125px] text-[#101828]">
              Recent Achievements
            </Text>
            {characterData.recentAchievements.map((achievement) => (
              <Animated.View
                key={achievement.id}
                entering={FadeInDown.duration(600)}
                className="flex-row items-center gap-4 rounded-3xl border border-gray-100 bg-white px-6 py-6"
              >
                <View className="h-12 w-12 items-center justify-center rounded-full bg-orange-100 shadow-sm">
                  <Trophy color="#f59e0b" size={24} />
                </View>
                <View className="flex-1 flex-col">
                  <Text className="text-base font-normal leading-6 tracking-[-0.3125px] text-[#101828]">
                    {achievement.title}
                  </Text>
                  <Text className="text-sm font-normal leading-5 tracking-[-0.15px] text-[#6a7282]">
                    {achievement.description}
                  </Text>
                </View>
                <Text className="text-2xl">{achievement.icon}</Text>
              </Animated.View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
