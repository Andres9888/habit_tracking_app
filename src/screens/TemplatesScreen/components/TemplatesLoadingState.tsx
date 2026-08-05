/** TemplatesLoadingState - Shimmer animation, stagger, shadows */
import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { enterEasing } from '../../../theme/animations';
import { fontFamilies } from '../../../theme/typography';
import { borderRadius as themeRadius } from '../../../theme/spacing';
import { ShimmerBox } from './ShimmerBox';
import { SkeletonCard } from './SkeletonCard';

export function TemplatesLoadingState() {
  const { colors } = useThemeColors();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{ paddingHorizontal: 20, paddingBottom: 16, paddingTop: 24 }}
      >
        <Text
          style={{
            color: colors.text.secondary,
            fontFamily: fontFamilies.primary.text,
            fontSize: 17,
          }}
        >
          {'Browse by goal, category, or what\u2019s popular'}
        </Text>
      </View>
      <Animated.View
        entering={FadeInDown.duration(280).easing(enterEasing)}
        style={{ marginHorizontal: 20, marginBottom: 16 }}
      >
        <ShimmerBox height={48} style={{ borderRadius: 24 }} width='100%' />
      </Animated.View>
      <View
        style={{
          flexDirection: 'row',
          gap: 8,
          marginBottom: 16,
          paddingHorizontal: 16,
        }}
      >
        {[64, 86, 78, 74, 68, 82].map((w, i) => (
          <ShimmerBox
            key={i}
            height={36}
            style={{ borderRadius: themeRadius.full }}
            width={w}
          />
        ))}
      </View>
      {[0, 1, 2, 3].map((i) => (
        <SkeletonCard key={i} index={i} />
      ))}
    </View>
  );
}
