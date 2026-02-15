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
      accessible
      accessibilityLabel={`${name}: ${value} out of ${maxValue}`}
      accessibilityRole="none"
      entering={FadeInDown.delay(delay).springify().damping(18)}
      style={{
        overflow: 'hidden',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        shadowColor: isDark ? '#000' : '#1c1917',
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: isDark ? 0.3 : 0.08,
        shadowRadius: 16,
        elevation: 3,
      }}
    >
      <View style={{ position: 'relative', height: 110 }}>
        {!isDark && (
          <View
            style={{
              position: 'absolute', left: 0, top: 0, height: '100%',
              width: `${percentage}%`, opacity: 0.6,
            }}
          >
            <LinearGradient
              colors={bgGradient}
              end={{ x: 1, y: 0 }}
              start={{ x: 0, y: 0 }}
              style={{ height: '100%', width: '100%' }}
            />
          </View>
        )}

        <View style={{ gap: 12, paddingHorizontal: 24, paddingTop: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{
                height: 40, width: 40, alignItems: 'center', justifyContent: 'center',
                borderRadius: 20, backgroundColor: colors.surface,
                shadowColor: '#000', shadowOffset: { height: 2, width: 0 },
                shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
              }}>
                {icon}
              </View>
              <Text style={{ fontSize: 16, fontWeight: '400', lineHeight: 24, letterSpacing: -0.3125, color: colors.text.primary }}>
                {name}
              </Text>
            </View>
            <Text style={{ fontSize: 16, fontWeight: '400', lineHeight: 24, letterSpacing: -0.3125, color: colors.text.primary }}>
              {value}
            </Text>
          </View>

          <View
            accessible
            accessibilityLabel={`${name} progress: ${Math.round(percentage)} percent`}
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: maxValue, now: value }}
            style={{ height: 8, width: '100%', overflow: 'hidden', borderRadius: 9999, backgroundColor: isDark ? colors.border : '#e7e5e4' }}
          >
            <View style={{ width: `${percentage}%`, height: '100%' }}>
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
