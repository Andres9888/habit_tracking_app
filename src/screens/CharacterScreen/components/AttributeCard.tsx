import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { AttributeCardProps } from '../types';

export function AttributeCard({
  icon,
  name,
  value,
  maxValue,
  gradientColors,
  bgGradient,
  delay = 0,
}: AttributeCardProps & { delay?: number }) {
  const { colors, isDark } = useThemeColors();
  const percentage = (value / maxValue) * 100;

  return (
    <Animated.View
      className='overflow-hidden rounded-3xl'
      entering={FadeInDown.delay(delay).springify().damping(18)}
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
      <View className='relative h-[110px]'>
        <View
          className='absolute left-0 top-0 h-full'
          style={{ opacity: isDark ? 0.3 : 0.6, width: `${percentage}%` }}
        >
          <LinearGradient
            colors={bgGradient}
            end={{ x: 1, y: 0 }}
            start={{ x: 0, y: 0 }}
            style={{ height: '100%', width: '100%' }}
          />
        </View>

        <View className='flex-col gap-3 px-6 pt-6'>
          <View className='flex-row items-center justify-between'>
            <View className='flex-row items-center gap-3'>
              <View
                className='h-10 w-10 items-center justify-center rounded-full shadow-md'
                style={{ backgroundColor: isDark ? colors.surface : '#ffffff' }}
              >
                {icon}
              </View>
              <Text
                style={{
                  color: colors.text.primary,
                  fontSize: 16,
                  fontWeight: '400',
                  letterSpacing: -0.3125,
                  lineHeight: 24,
                }}
              >
                {name}
              </Text>
            </View>
            <Text
              style={{
                color: colors.text.primary,
                fontSize: 16,
                fontWeight: '400',
                letterSpacing: -0.3125,
                lineHeight: 24,
              }}
            >
              {value}
            </Text>
          </View>

          <View
            className='h-2 w-full overflow-hidden rounded-full'
            style={{ backgroundColor: colors.gray[200] }}
          >
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
}
