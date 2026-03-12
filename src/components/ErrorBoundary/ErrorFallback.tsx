/** ErrorFallback — shown when ErrorBoundary catches an error. */

import React, { useRef, useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';

import { RetryButton } from './RetryButton';
import { SecondaryActions } from './SecondaryActions';
import { SuggestionsCard } from './SuggestionsCard';
import { useStyles } from './errorFallbackStyles';

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
  const retryCountRef = useRef(0);
  const [showLogout, setShowLogout] = useState(false);
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
    <View accessibilityRole='alert' style={styles.container}>
      <Text style={styles.emoji}>😕</Text>
      <Text accessibilityRole='header' style={styles.headline}>
        {headline}
      </Text>
      <Text style={styles.safetyNote}>Your data is safe.</Text>
      <Text style={styles.description}>{desc}</Text>
      <SuggestionsCard />
      {showLogout && onLogout ? (
        <Pressable
          accessibilityLabel='Sign out to resolve persistent error'
          accessibilityRole='button'
          style={styles.logoutButton}
          onPress={onLogout}
        >
          <Text style={styles.logoutText}>Sign Out</Text>
        </Pressable>
      ) : (
        <RetryButton onRetry={handleRetry} />
      )}
      <SecondaryActions
        onContactSupport={handleContactSupport}
        onOpenSettings={onOpenSettings}
      />
      {__DEV__ && error ? <Text style={styles.errorMessage}>{error.message}</Text> : null}
    </View>
  );
}
