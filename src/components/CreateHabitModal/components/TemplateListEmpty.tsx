import { View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { fontFamilies, fontWeights } from '@/theme/typography';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export const TemplateListEmpty = () => {
  const { colors } = useThemeColors();

  return (
    <View
      accessibilityLabel='No habits found in this category. Try selecting a different category.'
      accessibilityRole='text'
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 48,
      }}
    >
      <Animated.Text entering={anim(0)} style={{ fontSize: 32 }}>
        🔍
      </Animated.Text>
      <Animated.Text
        entering={anim(60)}
        style={{
          color: colors.text.primary,
          fontFamily: fontFamilies.primary.text,
          fontSize: 14,
          fontWeight: fontWeights.medium,
          marginTop: 8,
        }}
      >
        No habits in this category
      </Animated.Text>
      <Animated.Text
        entering={anim(120)}
        style={{
          color: colors.text.secondary,
          fontFamily: fontFamilies.primary.text,
          fontSize: 13,
          marginTop: 4,
        }}
      >
        Try selecting a different category
      </Animated.Text>
    </View>
  );
};
