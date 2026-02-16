/* eslint-disable max-lines */
import { View, Text } from 'react-native';
import { Trophy, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { AVATAR_GRADIENT, XP_GRADIENT, TROPHY_GRADIENT } from '../constants';
import type { CharacterData } from '../types';

interface CharacterCardProps {
  data: CharacterData;
}

export function CharacterCard({ data }: CharacterCardProps) {
  const xpToNextLevel = data.xpToNextLevel || 1;
  const xpProgress = (data.xp / xpToNextLevel) * 100;
  const xpRemaining = xpToNextLevel - data.xp;
  const { colors } = useThemeColors();

  return (
    <Animated.View
      className='mb-6 overflow-hidden rounded-3xl border'
      entering={FadeInDown.delay(60).springify().damping(18)}
      style={{
        backgroundColor: colors.card,
        borderColor: colors.cardBorder,
        shadowColor: colors.text.primary,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      }}
    >
      <View className='flex-col gap-6 px-6 py-6'>
        <View className='flex-row items-center justify-between'>
          <View className='flex-row items-center gap-3'>
            <View className='h-20 w-20 items-center justify-center overflow-hidden rounded-full shadow-lg'>
              <LinearGradient
                colors={AVATAR_GRADIENT}
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
                <Text className='text-base font-normal leading-6 tracking-[-0.3125px]' style={{ color: colors.text.primary }}>
                  Level {data.level}
                </Text>
                <Text className='text-lg'>✨</Text>
              </View>
              <Text className='text-sm font-normal leading-5 tracking-[-0.15px]' style={{ color: colors.text.secondary }}>
                {data.title}
              </Text>
            </View>
          </View>
          <View className='overflow-hidden rounded-full'>
            <LinearGradient
              colors={TROPHY_GRADIENT}
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
                {data.totalAchievements || 10}
              </Text>
            </LinearGradient>
          </View>
        </View>

        {/* XP Progress Section */}
        <View className='flex-col gap-2'>
          <View className='flex-row items-center justify-between'>
            <View className='flex-row items-center gap-2'>
              <Text className='text-sm font-normal leading-5 tracking-[-0.15px]' style={{ color: colors.text.secondary }}>
                Experience
              </Text>
              <View className='h-4 w-4 items-center justify-center rounded-full' style={{ backgroundColor: colors.gray[200] }}>
                <Text className='text-[10px]'>ℹ️</Text>
              </View>
            </View>
            <Text className='text-sm font-normal leading-5 tracking-[-0.15px]' style={{ color: colors.text.primary }}>
              {data.xp}/{data.xpToNextLevel} XP
            </Text>
          </View>
          <View className='h-3 w-full overflow-hidden rounded-full' style={{ backgroundColor: colors.gray[200] }}>
            <View style={{ width: `${xpProgress}%` }}>
              <LinearGradient
                colors={XP_GRADIENT}
                end={{ x: 1, y: 0 }}
                start={{ x: 0, y: 0 }}
                style={{ borderRadius: 9999, height: '100%', width: '100%' }}
              />
            </View>
          </View>
          <Text className='text-center text-xs font-normal leading-4' style={{ color: colors.text.tertiary }}>
            {xpRemaining} XP to Level {data.level + 1}
          </Text>
        </View>

        {/* Next Level Preview */}
        <View 
          className='flex-row items-center gap-3 rounded-2xl px-4 py-3'
          style={{ backgroundColor: colors.gray[100] }}
        >
          <Sparkles color='#ad46ff' size={20} />
          <View className='flex-1'>
            <Text className='text-xs font-semibold leading-4 tracking-[-0.08px]' style={{ color: colors.text.primary }}>
              Next: New Achievement Badge
            </Text>
            <Text className='text-xs leading-4 tracking-[-0.08px]' style={{ color: colors.text.tertiary }}>
              Complete habits to gain XP
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}
