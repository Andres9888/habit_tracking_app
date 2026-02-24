/** TemplatesLoadingState - Shimmer animation, stagger, shadows */
import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { fontFamilies } from '../../../theme/typography';
import { ShimmerBox } from './ShimmerBox';
import { SkeletonCard } from './SkeletonCard';

export function TemplatesLoadingState() {
  const { colors } = useThemeColors();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingHorizontal: 20, paddingBottom: 16, paddingTop: 24 }}>
        <Text
          style={{
            color: colors.text.primary,
            fontFamily: fontFamilies.primary.display,
            fontSize: 22,
            fontWeight: '600',
            letterSpacing: -0.35,
          }}
        >
          Import Habits
        </Text>
        <Text
          style={{
            color: colors.text.secondary,
            fontFamily: fontFamilies.primary.text,
            fontSize: 17,
            marginTop: 4,
          }}
        >
          Science-backed habits to get you started
        </Text>
      </View>
      <Animated.View
        entering={FadeInDown.duration(280).springify().damping(18)}
        style={{ marginHorizontal: 20, marginBottom: 16 }}
      >
        <ShimmerBox height={48} style={{ borderRadius: 24 }} width='100%' />
      </Animated.View>
      {[0, 1, 2, 3].map((i) => (
        <SkeletonCard key={i} index={i} />
      ))}
    </View>
  );
}
