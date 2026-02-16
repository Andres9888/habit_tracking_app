import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { AttributeCardProps } from '../types';

export function AttributeCard({
  bgGradient,
  delay = 0,
  description,
  gradientColors,
  icon,
  maxValue,
  name,
  value,
}: AttributeCardProps & { delay?: number }) {
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
  const { colors } = useThemeColors();

  return (
    <Animated.View
      className='overflow-hidden rounded-3xl border'
      entering={FadeInDown.delay(delay).springify().damping(18)}
      style={{
        backgroundColor: colors.card,
        borderColor: colors.cardBorder,
        shadowColor: colors.text.primary,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      }}
    >
      <View className='relative h-[120px]'>
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

        <View className='flex-col gap-3 px-6 pt-6'>
          <View className='flex-row items-center justify-between'>
            <View className='flex-row items-center gap-3'>
              <View className='h-10 w-10 items-center justify-center rounded-full shadow-md' style={{ backgroundColor: colors.card }}>
                {icon}
              </View>
              <View className='flex-col'>
                <Text className='text-base font-normal leading-6 tracking-[-0.3125px]' style={{ color: colors.text.primary }}>
                  {name}
                </Text>
                {description && (
                  <Text className='text-xs leading-4 tracking-[-0.08px]' style={{ color: colors.text.tertiary }}>
                    {description}
                  </Text>
                )}
              </View>
            </View>
            <Text className='text-base font-normal leading-6 tracking-[-0.3125px]' style={{ color: colors.text.primary }}>
              {value}
            </Text>
          </View>

          <View className='h-2 w-full overflow-hidden rounded-full' style={{ backgroundColor: colors.gray[200] }}>
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
