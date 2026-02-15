import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { AttributeCardProps } from '../types';
import { useThemeColors } from '@/theme/ThemeContext';

export function AttributeCard({
  icon,
  name,
  value,
  maxValue,
  gradientColors,
  bgGradient,
  delay = 0,
}: AttributeCardProps & { delay?: number }) {
  const { colors } = useThemeColors();
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify().damping(18)}
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
        },
      ]}
    >
      <View style={styles.content}>
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
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: colors.surface },
                ]}
              >
                {icon}
              </View>
              <Text style={[styles.name, { color: colors.text.primary }]}>
                {name}
              </Text>
            </View>
            <Text style={[styles.value, { color: colors.text.primary }]}>
              {value}
            </Text>
          </View>

          <View
            style={[styles.progressTrack, { backgroundColor: colors.gray[200] }]}
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

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#1c1917',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  content: {
    height: 110,
    position: 'relative',
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 9999,
    height: 40,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: 40,
  },
  name: {
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: -0.3125,
    lineHeight: 24,
  },
  progressTrack: {
    borderRadius: 9999,
    height: 8,
    overflow: 'hidden',
    width: '100%',
  },
  value: {
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: -0.3125,
    lineHeight: 24,
  },
});
