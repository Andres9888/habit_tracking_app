import React from 'react';
import { Pressable, Text, type ViewStyle } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { Archive } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { colors } from '@/theme';
import { useThemeColors } from '../../theme/ThemeContext';
import { borderRadius } from '../../theme/spacing';
import { typography, fontWeights, fontFamilies } from '@/theme/typography';

interface ArchiveActionProps {
  archiveIconStyle: AnimatedStyle<ViewStyle>;
  onPress: () => void;
}

export function ArchiveAction({ archiveIconStyle, onPress }: ArchiveActionProps) {
  const { isDark } = useThemeColors();

  return (
    <Pressable
      accessibilityLabel="Archive habit"
      accessibilityRole="button"
      testID="archive-habit-action"
      onPress={onPress}
      style={{
        alignItems: 'center',
        backgroundColor: isDark ? colors.warning : colors.streak[300],
        borderBottomRightRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        height: '100%',
        justifyContent: 'center',
        width: 80,
      }}
    >
      <Animated.View
        style={[
          {
            alignItems: 'center',
            justifyContent: 'center',
          },
          archiveIconStyle,
        ]}
      >
        <Archive color="white" size={iconSizes.large} strokeWidth={2} />
        <Text
          style={{
            color: 'white',
            fontFamily: fontFamilies.primary.text,
            fontSize: typography.tabBar.fontSize,
            fontWeight: fontWeights.semibold,
            letterSpacing: 0.2,
            marginTop: 4,
          }}
        >
          Archive
        </Text>
      </Animated.View>
    </Pressable>
  );
}
