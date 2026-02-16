import { Animated, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatedPressable } from '../ui/AnimatedPressable';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { useRewardToastAnimation } from './useRewardToastAnimation';
import { useRewardToastContent } from './useRewardToastContent';
import { useThemeColors } from '../../theme/ThemeContext';

interface RewardCelebrationToastProps {
  message: string;
  onDismiss: () => void;
  onPrimaryAction: () => void;
  onSecondaryAction: () => void;
  streak?: number;
  visible: boolean;
}

const AnimatedContainer = Animated.createAnimatedComponent(View);

export const RewardCelebrationToast = ({
  message,
  onDismiss,
  onPrimaryAction,
  onSecondaryAction,
  streak,
  visible,
}: RewardCelebrationToastProps) => {
  const { translateY, opacity } = useRewardToastAnimation(visible);
  const { title, premiumCTA } = useRewardToastContent(streak);
  const { triggerLightImpact } = useHapticFeedback({});
  const { colors, isDark } = useThemeColors();

  const cardBg = isDark ? colors.card : '#ffffff';
  const titleColor = isDark ? colors.text.primary : '#1c1917';
  const bodyColor = isDark ? colors.text.secondary : '#44403c';
  const gradientColors = isDark
    ? (['#1e1033', '#0f1729'] as const)
    : (['#faf5ff', '#eff6ff'] as const);
  const borderColor = isDark ? colors.border : '#d6d3d1';
  const secondaryTextColor = isDark ? colors.text.secondary : '#57534e';
  const dismissColor = isDark ? colors.text.tertiary : '#78716c';
  const shadowStyle = isDark
    ? {}
    : { shadowColor: '#93c5fd', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12 };

  return (
    <AnimatedContainer
      accessibilityLiveRegion='polite'
      style={{
        position: 'absolute',
        bottom: 24,
        left: 16,
        right: 16,
        opacity,
        transform: [{ translateY }],
      }}
      pointerEvents='box-none'
    >
      <View
        style={{
          borderRadius: 24,
          backgroundColor: cardBg,
          padding: 20,
          ...shadowStyle,
        }}
      >
        <Text
          style={{
            fontSize: 17,
            fontWeight: '700',
            lineHeight: 24,
            color: titleColor,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            marginTop: 8,
            fontSize: 17,
            lineHeight: 22,
            color: bodyColor,
          }}
        >
          {message}
        </Text>
        <View style={{ marginTop: 12, borderRadius: 16, overflow: 'hidden' }}>
          <LinearGradient
            colors={gradientColors as unknown as string[]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ padding: 12, borderRadius: 16 }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: '600',
                color: '#7c3aed',
              }}
            >
              ✨ {premiumCTA.benefit}
            </Text>
          </LinearGradient>
        </View>
        <View
          style={{
            marginTop: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <AnimatedPressable
            accessibilityHint='Share this streak to motivate friends'
            accessibilityLabel='Share streak'
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 999,
              borderWidth: 1,
              borderColor,
              paddingHorizontal: 16,
              paddingVertical: 10,
            }}
            onPress={() => {
              triggerLightImpact();
              onSecondaryAction();
            }}
          >
            <Text
              style={{
                fontSize: 17,
                fontWeight: '600',
                lineHeight: 22,
                color: secondaryTextColor,
              }}
            >
              Share
            </Text>
          </AnimatedPressable>
          <AnimatedPressable
            accessibilityHint={`${premiumCTA.text}: ${premiumCTA.benefit}`}
            accessibilityLabel={premiumCTA.text}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 999,
              paddingHorizontal: 16,
              paddingVertical: 10,
              backgroundColor: '#7c3aed',
            }}
            onPress={() => {
              triggerLightImpact();
              onPrimaryAction();
            }}
          >
            <Text
              style={{
                fontSize: 17,
                fontWeight: '600',
                lineHeight: 22,
                color: '#ffffff',
              }}
            >
              {premiumCTA.text}
            </Text>
          </AnimatedPressable>
        </View>
        <AnimatedPressable
          accessibilityLabel='Dismiss reward toast'
          style={{ marginTop: 12, alignItems: 'center' }}
          onPress={() => {
            triggerLightImpact();
            onDismiss();
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: '500',
              textTransform: 'uppercase',
              lineHeight: 18,
              letterSpacing: 0.8,
              color: dismissColor,
            }}
          >
            Not now
          </Text>
        </AnimatedPressable>
      </View>
    </AnimatedContainer>
  );
};

export default RewardCelebrationToast;
