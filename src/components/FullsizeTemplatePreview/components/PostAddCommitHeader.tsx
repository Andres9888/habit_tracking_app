import React from 'react';
import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { footerStyles } from '../styles';
import { useDetailPalette } from '../detailPalette';

interface PostAddCommitHeaderProps {
  checkmarkAnimatedStyle: object;
  templateName: string;
}

export function PostAddCommitHeader({
  checkmarkAnimatedStyle,
  templateName,
}: PostAddCommitHeaderProps) {
  const palette = useDetailPalette();

  return (
    <>
      <View style={footerStyles.successPanelHeader}>
        <Animated.View
          style={[
            footerStyles.successCheck,
            { backgroundColor: palette.addedBg },
            checkmarkAnimatedStyle,
          ]}
        >
          <Check
            color={palette.addedFg}
            size={iconSizes.medium}
            strokeWidth={3}
          />
        </Animated.View>
        <Text
          accessibilityRole='header'
          maxFontSizeMultiplier={1.6}
          style={[footerStyles.successHeading, { color: palette.textPrimary }]}
        >
          {templateName} is in your habits
        </Text>
      </View>
      <Text
        maxFontSizeMultiplier={1.6}
        style={[footerStyles.successMessage, { color: palette.textSecondary }]}
      >
        Complete it from Today when it's due.
      </Text>
    </>
  );
}
