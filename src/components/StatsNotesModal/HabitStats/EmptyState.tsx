/**
 * Empty state when no habits exist
 * Standardized: FadeInUp animation, icon, proper typography
 */

import { Text, View } from 'react-native';
import { BarChart2 } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '@/theme/ThemeContext';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export function EmptyState() {
  const { colors: themeColors, isDark } = useThemeColors();

  return (
    <View className='items-center justify-center px-6 py-10'>
      <Animated.View
        className='mb-4 h-16 w-16 items-center justify-center rounded-xl'
        entering={anim(0)}
        style={{
          backgroundColor: isDark ? '#78350f20' : '#fffbeb',
          shadowColor: '#f59e0b',
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
        }}
      >
        <BarChart2 color='#f59e0b' size={32} strokeWidth={1.5} />
      </Animated.View>
      <Animated.Text
        className='mb-2 text-center font-bold'
        entering={anim(60)}
        style={{ fontSize: 22, letterSpacing: -0.5, color: themeColors.text.primary }}
      >
        No Stats Yet
      </Animated.Text>
      <Animated.Text
        className='text-center text-[17px] leading-[22px]'
        entering={anim(120)}
        style={{ maxWidth: 280, color: themeColors.text.secondary }}
      >
        Create your first habit to see stats here
      </Animated.Text>
    </View>
  );
}
