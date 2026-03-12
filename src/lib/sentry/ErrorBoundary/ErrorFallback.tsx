/**
 * Error Fallback Component
 * Displays user-friendly error message with retry option.
 * Shows when ErrorBoundary catches an unhandled error.
 */

import React, { useRef, useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';

import { useThemeColors } from '../../../theme/ThemeContext';
import { createErrorFallbackStyles } from './ErrorFallback.styles';

interface ErrorFallbackProps {
  error: Error | null;
  onRetry: () => void;
}

const SUPPORT_EMAIL = 'support@chainday.app';
const MAX_RETRIES = 3;

export function ErrorFallback({ error, onRetry }: ErrorFallbackProps) {
  const { colors } = useThemeColors();
  const retryCountRef = useRef(0);
  const [showContactSupport, setShowContactSupport] = useState(false);
  const styles = createErrorFallbackStyles(colors);

  const handleRetry = () => {
    retryCountRef.current += 1;
    if (retryCountRef.current >= MAX_RETRIES) {
      setShowContactSupport(true);
    }
    onRetry();
  };

  const handleContactSupport = () => {
    const subject = encodeURIComponent('Chain Day — App Error');
    const body = encodeURIComponent(
      `Error: ${error?.message ?? 'Unknown'}\n\nPlease describe what you were doing when this happened:`
    );
    void Linking.openURL(
      `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`
    );
  };

  return (
    <View accessibilityRole='alert' style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>😊</Text>
        <Text accessibilityRole='header' style={styles.title}>
          Oops! Something went wrong
        </Text>
        <Text style={styles.safetyNote}>Don't worry — your data is safe.</Text>
        <Text style={styles.message}>
          We encountered an issue, but nothing was lost. Try refreshing the app.
        </Text>
        {__DEV__ && error ? <Text style={styles.errorDetail}>{error.message}</Text> : null}
        <Pressable
          accessibilityLabel='Try again'
          accessibilityRole='button'
          style={styles.button}
          onPress={handleRetry}
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </Pressable>
        {showContactSupport ? <Pressable
            accessibilityHint='Opens email to contact support team'
            accessibilityLabel='Contact support'
            accessibilityRole='button'
            style={styles.supportButton}
            onPress={handleContactSupport}
          >
            <Text style={styles.supportButtonText}>Contact Support</Text>
          </Pressable> : null}
      </View>
    </View>
  );
}

export default ErrorFallback;
