/** ErrorFallback — shown when ErrorBoundary catches an error. */

import React, { useRef, useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';

import { useThemeColors } from '../../theme/ThemeContext';
import { RetryButton } from './RetryButton';
import { SecondaryActions } from './SecondaryActions';
import { SuggestionsCard } from './SuggestionsCard';
import { useErrorTheme } from './useErrorTheme';

const SUPPORT_EMAIL = 'support@chainday.app';
const MAX_RETRIES = 3;

interface ErrorFallbackProps {
  error: Error | null;
  onRetry: () => void;
  onLogout?: () => void;
  onOpenSettings?: () => void;
}

export function ErrorFallback({
  error,
  onRetry,
  onLogout,
  onOpenSettings,
}: ErrorFallbackProps) {
  const { colors } = useErrorTheme();
  const retryCountRef = useRef(0);
  const [showLogout, setShowLogout] = useState(false);
  const { colors } = useThemeColors();
  const styles = useStyles();

  const handleRetry = () => {
    retryCountRef.current += 1;
    if (retryCountRef.current >= MAX_RETRIES) setShowLogout(true);
    onRetry();
  };

  const handleContactSupport = () => {
    const subject = encodeURIComponent('Chain Day \u2014 App Error');
    const body = encodeURIComponent('Error: ' + (error?.message ?? 'Unknown'));
    void Linking.openURL(
      'mailto:' + SUPPORT_EMAIL + '?subject=' + subject + '&body=' + body
    );
  };

  const headline = showLogout
    ? "This isn't working \u2014 let's try a fresh start"
    : 'We hit a bump';
  const desc = showLogout
    ? 'Signing out and back in often resolves persistent errors.'
    : 'Something unexpected happened, but nothing was lost.';

  return (
    <View accessibilityRole='alert' style={{
      alignItems: 'center',
      backgroundColor: colors.background,
      flex: 1,
      justifyContent: 'center',
      padding: 24,
    }}>
      <Text style={{ fontSize: 48, marginBottom: 16 }}>😕</Text>
      <Text accessibilityRole='header' style={{
        color: colors.text.primary,
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 4,
        textAlign: 'center',
      }}>
        {headline}
      </Text>
      <Text style={{
        color: colors.primary[700],
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 8,
      }}>Your data is safe.</Text>
      <Text style={{
        color: colors.text.secondary,
        fontSize: 13,
        lineHeight: 20,
        marginBottom: 20,
        maxWidth: 300,
        textAlign: 'center',
      }}>{desc}</Text>
      <SuggestionsCard />
      {showLogout && onLogout ? (
        <Pressable
          accessibilityLabel='Sign out to resolve persistent error'
          accessibilityRole='button'
          style={{
            backgroundColor: '#C93B3B',
            borderRadius: 12,
            paddingHorizontal: 24,
            paddingVertical: 12,
          }}
          onPress={onLogout}
        >
          <Text style={{ color: colors.text.inverse, fontSize: 17, fontWeight: '600' }}>Sign Out</Text>
        </Pressable>
      ) : (
        <RetryButton onRetry={handleRetry} />
      )}
      <SecondaryActions
        onContactSupport={handleContactSupport}
        onOpenSettings={onOpenSettings}
      />
      {__DEV__ && error && (
        <Text style={{
          color: '#C93B3B',
          fontFamily: 'monospace',
          fontSize: 13,
          marginTop: 24,
          maxWidth: 300,
        }}>{error.message}</Text>
      )}
    </View>
  );
}
