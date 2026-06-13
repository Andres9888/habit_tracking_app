/**
 * ConvexConnectionGuard
 *
 * Displays a friendly error when Convex is unreachable
 * Guards against: network outages, Convex server issues, DNS failures
 */

import React, { useEffect, useState, type PropsWithChildren } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useThemeColors } from '../theme/ThemeContext';
import { borderRadius, componentSpacing } from '@/theme/spacing';
import { typography, fontFamilies, fontWeights } from '@/theme/typography';

export function ConvexConnectionGuard({ children }: PropsWithChildren) {
  const { colors } = useThemeColors();
  const [showError, setShowError] = useState(false);

  // Ping query to check Convex connectivity
  // If this returns undefined for > 5 seconds, we're likely offline
  const pingResult = useQuery(api.settings.get);

  useEffect(() => {
    if (pingResult === undefined) {
      // Wait 5 seconds before showing error (allow for normal loading)
      const timer = setTimeout(() => {
        setShowError(true);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setShowError(false);
    }
  }, [pingResult]);

  if (showError) {
    return (
      <View
        style={{
          alignItems: 'center',
          backgroundColor: colors.background,
          flex: 1,
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <Text
          style={{
            color: colors.text.primary,
            fontFamily: fontFamilies.primary.text,
            fontSize: typography.heading1.fontSize,
            fontWeight: fontWeights.semibold,
            marginBottom: 12,
            textAlign: 'center',
          }}
        >
          Connection Issue
        </Text>
        <Text
          style={{
            color: colors.text.secondary,
            fontFamily: fontFamilies.primary.text,
            fontSize: typography.body.fontSize,
            marginBottom: 24,
            textAlign: 'center',
          }}
        >
          Unable to connect to the server. Please check your internet connection
          and try again.
        </Text>
        <Pressable
          accessibilityLabel='Try connecting again'
          accessibilityRole='button'
          hitSlop={8}
          style={{
            alignItems: 'center',
            backgroundColor: colors.primary[600],
            borderRadius: borderRadius.button,
            height: componentSpacing.button.height,
            justifyContent: 'center',
            paddingHorizontal: componentSpacing.button.paddingHorizontal,
          }}
          onPress={() => setShowError(false)}
        >
          <Text
            style={{
              color: colors.text.inverse,
              fontFamily: fontFamilies.primary.text,
              fontSize: typography.button.fontSize,
              fontWeight: fontWeights.semibold,
            }}
          >
            Try again
          </Text>
        </Pressable>
      </View>
    );
  }

  return <>{children}</>;
}
