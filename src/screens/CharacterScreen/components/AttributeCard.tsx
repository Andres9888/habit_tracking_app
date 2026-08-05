import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { durations, enterEasing } from '../../../theme/animations';
import { useThemeColors } from '../../../theme/ThemeContext';
import { styles } from './AttributeCard.styles';
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
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
  const { colors } = useThemeColors();

  return (
    <Animated.View
      entering={FadeInDown.delay(delay)
        .duration(durations.enter)
        .easing(enterEasing)}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
          shadowColor: colors.text.primary,
        },
      ]}
    >
      <View style={styles.barContainer}>
        <View style={[styles.bgFillWrapper, { width: `${percentage}%` }]}>
          <LinearGradient
            colors={bgGradient}
            end={{ x: 1, y: 0 }}
            start={{ x: 0, y: 0 }}
            style={styles.bgFill}
          />
        </View>

        <View style={styles.contentCol}>
          <View style={styles.labelRow}>
            <View style={styles.iconNameRow}>
              <View
                style={[styles.iconCircle, { backgroundColor: colors.card }]}
              >
                {icon}
              </View>
              <Text style={[styles.nameText, { color: colors.text.primary }]}>
                {name}
              </Text>
            </View>
            <Text style={[styles.valueText, { color: colors.text.primary }]}>
              {value}
            </Text>
          </View>

          <View
            style={[
              styles.progressTrack,
              { backgroundColor: colors.gray[200] },
            ]}
          >
            <View style={{ width: `${percentage}%` }}>
              <LinearGradient
                colors={gradientColors}
                end={{ x: 1, y: 0 }}
                start={{ x: 0, y: 0 }}
                style={styles.progressFill}
              />
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}
