import { View, Text } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';

export function InfoBanner() {
  const { colors } = useThemeColors();

  return (
    <Animated.View
      className='mb-6 overflow-hidden rounded-3xl border'
      entering={FadeInDown.delay(340).springify().damping(18)}
      style={{
        backgroundColor: colors.card,
        borderColor: colors.cardBorder,
        shadowColor: colors.text.primary,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      }}
    >
      <View className='flex-row items-start gap-4 px-6 py-5'>
        <View className='h-10 w-10 items-center justify-center rounded-full' style={{ backgroundColor: '#f3e8ff' }}>
          <Sparkles color='#ad46ff' size={20} />
        </View>
        <View className='flex-1 flex-col gap-1'>
          <Text 
            className='font-semibold'
            style={{ fontSize: 15, letterSpacing: -0.24, lineHeight: 20, color: colors.text.primary }}
          >
            Your Habit Character
          </Text>
          <Text 
            className='text-xs leading-4 tracking-[-0.08px]'
            style={{ color: colors.text.secondary }}
          >
            Complete daily habits to earn XP and level up. Each habit strengthens your attributes and unlocks achievements. The more consistent you are, the more powerful your character becomes! 🚀
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}
