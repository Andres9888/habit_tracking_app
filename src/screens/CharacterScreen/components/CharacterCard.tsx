import { View, Text } from 'react-native';
import { Trophy } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { AVATAR_GRADIENT, XP_GRADIENT, TROPHY_GRADIENT } from '../constants';
import type { CharacterData } from '../types';

interface CharacterCardProps {
  data: CharacterData;
}

export function CharacterCard({ data }: CharacterCardProps) {
  const { colors, isDark } = useThemeColors();
  const xpProgress = (data.xp / data.xpToNextLevel) * 100;
  const xpRemaining = data.xpToNextLevel - data.xp;

  return (
    <Animated.View
      className='mb-6 overflow-hidden rounded-3xl'
      entering={FadeInDown.delay(60).springify().damping(18)}
      style={{
        backgroundColor: colors.card,
        borderColor: colors.cardBorder,
        borderWidth: 1,
        shadowColor: isDark ? '#000000' : '#1c1917',
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: isDark ? 0.3 : 0.08,
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
                <Text
                  style={{
                    color: colors.text.primary,
                    fontSize: 16,
                    fontWeight: '400',
                    letterSpacing: -0.3125,
                    lineHeight: 24,
                  }}
                >
                  Level {data.level}
                </Text>
                <Text className='text-lg'>✨</Text>
              </View>
              <Text
                style={{
                  color: colors.text.secondary,
                  fontSize: 14,
                  fontWeight: '400',
                  letterSpacing: -0.15,
                  lineHeight: 20,
                }}
              >
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
              <Text
                style={{
                  color: '#ffffff',
                  fontSize: 16,
                  fontWeight: '400',
                  letterSpacing: -0.3125,
                  lineHeight: 24,
                }}
              >
                10
              </Text>
            </LinearGradient>
          </View>
        </View>

        <View className='flex-col gap-2'>
          <View className='flex-row items-center justify-between'>
            <Text
              style={{
                color: colors.text.secondary,
                fontSize: 14,
                fontWeight: '400',
                letterSpacing: -0.15,
                lineHeight: 20,
              }}
            >
              Experience
            </Text>
            <Text
              style={{
                color: colors.text.primary,
                fontSize: 14,
                fontWeight: '400',
                letterSpacing: -0.15,
                lineHeight: 20,
              }}
            >
              {data.xp}/{data.xpToNextLevel} XP
            </Text>
          </View>
          <View
            className='h-3 w-full overflow-hidden rounded-full'
            style={{ backgroundColor: colors.gray[200] }}
          >
            <View style={{ width: `${xpProgress}%` }}>
              <LinearGradient
                colors={XP_GRADIENT}
                end={{ x: 1, y: 0 }}
                start={{ x: 0, y: 0 }}
                style={{ borderRadius: 9999, height: '100%', width: '100%' }}
              />
            </View>
          </View>
          <Text
            style={{
              color: colors.text.tertiary,
              fontSize: 12,
              fontWeight: '400',
              lineHeight: 16,
              textAlign: 'center',
            }}
          >
            {xpRemaining} XP to Level {data.level + 1}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}
