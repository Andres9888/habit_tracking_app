/**
 * ErrorFallback Component
 * Default UI shown when ErrorBoundary catches an error.
 * Tracks retry count — after 3 attempts, offers logout as an escape hatch.
 */

import React, { useRef, useState } from 'react';
import { Linking, Pressable, Text, StyleSheet, View } from 'react-native';

import { colors } from '../../theme/colors';
import { RetryButton } from './RetryButton';

const SUPPORT_EMAIL = 'support@chainday.app';
const MAX_RETRIES_BEFORE_LOGOUT = 3;

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

  const handleRetry = () => {
    retryCountRef.current += 1;
    if (retryCountRef.current >= MAX_RETRIES_BEFORE_LOGOUT) {
      setShowLogout(true);
    }
    onRetry();
  };

  const handleContactSupport = () => {
    const subject = encodeURIComponent('Chain Day — App Error');
    const body = encodeURIComponent(
      `Hi, I'm experiencing an issue with Chain Day.\n\nError: ${error?.message ?? 'Unknown'}\n\nDevice info: (please fill in)`
    );
    Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`);
  };

  return (
    <View
      accessibilityLabel='Error occurred'
      accessibilityLiveRegion='assertive'
      accessibilityRole='alert'
      style={styles.container}
    >
      <Text accessibilityLabel='Error icon' style={styles.emoji}>
        😕
      </Text>

      <Text accessibilityRole='header' style={styles.headline}>
        {showLogout
          ? "This isn't working — let's try a fresh start"
          : 'We hit a bump'}
      </Text>

      <Text style={styles.safetyNote}>Your data is safe.</Text>

      <Text style={styles.description}>
        {showLogout
          ? 'Multiple retries haven't fixed the issue. Signing out and back in often resolves persistent errors.'
          : "Something unexpected happened, but don't worry — nothing was lost."}
      </Text>

      {/* Suggestions */}
      <View style={styles.suggestionsCard}>
        <Text style={styles.suggestionsTitle}>Things to try:</Text>
        <Text style={styles.suggestionItem}>• Close and reopen the app</Text>
        <Text style={styles.suggestionItem}>
          • Check your internet connection
        </Text>
        <Text style={styles.suggestionItem}>
          • Make sure the app is up to date
        </Text>
      </View>

      {/* Primary action */}
      {showLogout && onLogout ? (
        <Pressable
          accessibilityLabel='Sign Out'
          accessibilityRole='button'
          style={styles.logoutButton}
          onPress={onLogout}
        >
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </Pressable>
      ) : (
        <RetryButton onRetry={handleRetry} />
      )}

      {/* Secondary actions */}
      <View style={styles.secondaryActions}>
        {onOpenSettings && (
          <Pressable
            accessibilityLabel='Go to Settings'
            accessibilityRole='button'
            style={styles.secondaryButton}
            onPress={onOpenSettings}
          >
            <Text style={styles.secondaryButtonText}>Go to Settings</Text>
          </Pressable>
        )}

        <Pressable
          accessibilityLabel='Contact Support'
          accessibilityRole='link'
          style={styles.secondaryButton}
          onPress={handleContactSupport}
        >
          <Text style={styles.secondaryButtonText}>Contact Support</Text>
        </Pressable>

        {showLogout && (
          <Pressable
            accessibilityLabel='Try Again'
            accessibilityRole='button'
            style={styles.secondaryButton}
            onPress={handleRetry}
          >
            <Text style={styles.secondaryButtonText}>Try Again Anyway</Text>
          </Pressable>
        )}
      </View>

      {__DEV__ && error && (
        <Text
          accessibilityLabel={`Error details: ${error.message}`}
          style={styles.errorMessage}
        >
          {error.message}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.light.background,
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  description: {
    color: colors.text.secondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
    maxWidth: 300,
    textAlign: 'center',
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorMessage: {
    color: colors.error,
    fontFamily: 'monospace',
    fontSize: 12,
    marginTop: 24,
    maxWidth: 300,
    textAlign: 'left',
  },
  headline: {
    color: colors.text.primary,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: colors.error,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  logoutButtonText: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  safetyNote: {
    color: colors.primary[700],
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  secondaryActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },
  secondaryButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  secondaryButtonText: {
    color: colors.primary[600],
    fontSize: 14,
    fontWeight: '500',
  },
  suggestionsCard: {
    backgroundColor: colors.light.card,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
    maxWidth: 280,
    padding: 16,
    width: '100%',
  },
  suggestionsTitle: {
    color: colors.text.primary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  suggestionItem: {
    color: colors.text.secondary,
    fontSize: 13,
    lineHeight: 20,
  },
});
