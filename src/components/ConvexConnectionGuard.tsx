/**
 * ConvexConnectionGuard
 *
 * Displays a friendly error when Convex is unreachable
 * Guards against: network outages, Convex server issues, DNS failures
 */

import React, { useEffect, useState, type PropsWithChildren } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useThemeColors } from '../theme/ThemeContext';

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
            fontSize: 22,
            fontWeight: '600',
            marginBottom: 12,
            textAlign: 'center',
          }}
        >
          Connection Issue
        </Text>
        <Text
          style={{
            color: colors.text.secondary,
            fontSize: 17,
            marginBottom: 24,
            textAlign: 'center',
          }}
        >
          Unable to connect to the server. Please check your internet connection
          and try again.
        </Text>
        <ActivityIndicator color={colors.accent} size='large' />
      </View>
    );
  }

  return <>{children}</>;
}
