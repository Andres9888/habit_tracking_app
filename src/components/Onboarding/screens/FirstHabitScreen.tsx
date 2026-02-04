/**
 * First Habit Screen
 * Screen 2: "What will you build?"
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { SuggestionPill } from '../components/SuggestionPill';
import { ProgressDots } from '../components/ProgressDots';
import type { FirstHabitScreenProps } from '../types';
import { DEFAULT_SUGGESTIONS } from '../types';

const DOMINANT_BG = '#FAF8F5';
const SECONDARY_TEXT = '#2C2825';
const NEUTRAL_TEXT = '#8A847D';
const ACCENT_COLOR = '#D4654A';
const SURFACE_COLOR = '#FFFFFF';
const INPUT_BORDER = 'rgba(138, 132, 125, 0.3)';
const ENTRY_DURATION = 240;
const SUGGESTION_DELAY = 2000;

export function FirstHabitScreen({ onNext, onSkip }: FirstHabitScreenProps) {
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);
  const [habitName, setHabitName] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const buttonScale = useSharedValue(1);

  const headlineOpacity = useSharedValue(0);
  const headlineTranslateY = useSharedValue(16);
  const inputOpacity = useSharedValue(0);
  const inputTranslateY = useSharedValue(16);
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(16);
  const skipOpacity = useSharedValue(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSuggestions(true);
    }, SUGGESTION_DELAY);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    headlineOpacity.value = withDelay(
      0,
      withTiming(1, { duration: ENTRY_DURATION, easing: Easing.out(Easing.ease) })
    );
    headlineTranslateY.value = withDelay(
      0,
      withTiming(0, { duration: ENTRY_DURATION, easing: Easing.out(Easing.ease) })
    );

    inputOpacity.value = withDelay(
      60,
      withTiming(1, { duration: ENTRY_DURATION, easing: Easing.out(Easing.ease) })
    );
    inputTranslateY.value = withDelay(
      60,
      withTiming(0, { duration: ENTRY_DURATION, easing: Easing.out(Easing.ease) })
    );

    buttonOpacity.value = withDelay(
      120,
      withTiming(1, { duration: ENTRY_DURATION, easing: Easing.out(Easing.ease) })
    );
    buttonTranslateY.value = withDelay(
      120,
      withTiming(0, { duration: ENTRY_DURATION, easing: Easing.out(Easing.ease) })
    );

    skipOpacity.value = withDelay(
      180,
      withTiming(1, { duration: ENTRY_DURATION, easing: Easing.out(Easing.ease) })
    );
  }, []);

  const headlineStyle = useAnimatedStyle(() => ({
    opacity: headlineOpacity.value,
    transform: [{ translateY: headlineTranslateY.value }],
  }));

  const inputStyle = useAnimatedStyle(() => ({
    opacity: inputOpacity.value,
    transform: [{ translateY: inputTranslateY.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: habitName.trim().length > 0 ? 1 : 0.4,
    transform: [{ translateY: buttonTranslateY.value }, { scale: buttonScale.value }],
  }));

  const skipStyle = useAnimatedStyle(() => ({
    opacity: skipOpacity.value,
  }));

  const handleSuggestionPress = useCallback((suggestion: string) => {
    setHabitName(suggestion);
  }, []);

  const handleCreateHabit = useCallback(() => {
    if (habitName.trim().length > 0) {
      onNext(habitName.trim());
    }
  }, [habitName, onNext]);

  const handlePressIn = () => {
    if (habitName.trim().length > 0) {
      buttonScale.value = withTiming(0.96, { duration: 120, easing: Easing.out(Easing.ease) });
    }
  };

  const handlePressOut = () => {
    buttonScale.value = withTiming(1, { duration: 180, easing: Easing.out(Easing.ease) });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + 8 }]}
        onPress={onSkip}
        testID="back-button"
      >
        <ChevronLeft size={24} color={NEUTRAL_TEXT} />
      </TouchableOpacity>

      <ProgressDots currentScreen={1} />

      <View style={[styles.content, { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 32 }]}>
        <View style={styles.contentSection}>
          <Animated.Text style={[styles.headline, headlineStyle]}>
            What will you build?
          </Animated.Text>

          <Animated.View style={[inputStyle, styles.inputWrapper]}>
            <TextInput
              ref={inputRef}
              style={[styles.input, isFocused && styles.inputFocused]}
              value={habitName}
              onChangeText={setHabitName}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="e.g., Read for 10 minutes"
              placeholderTextColor={NEUTRAL_TEXT}
              maxLength={40}
              testID="habit-input"
            />

            {showSuggestions && (
              <View style={styles.suggestionsContainer}>
                {DEFAULT_SUGGESTIONS.map((suggestion, index) => (
                  <SuggestionPill
                    key={suggestion.id}
                    label={suggestion.label}
                    onPress={() => handleSuggestionPress(suggestion.label)}
                    delay={index * 100}
                    testID={`suggestion-${suggestion.id}`}
                  />
                ))}
              </View>
            )}
          </Animated.View>
        </View>

        <View style={styles.actionSection}>
          <Animated.View style={buttonStyle}>
            <TouchableOpacity
              style={[
                styles.primaryButton,
                habitName.trim().length === 0 && styles.buttonDisabled,
              ]}
              activeOpacity={1}
              onPress={handleCreateHabit}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              disabled={habitName.trim().length === 0}
              testID="create-habit-button"
            >
              <Text style={styles.primaryButtonText}>Create habit</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={skipStyle}>
            <TouchableOpacity
              style={styles.skipLink}
              onPress={onSkip}
              testID="skip-for-now-link"
            >
              <Text style={styles.skipLinkText}>Skip for now</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  actionSection: {
    gap: 12,
    paddingBottom: 80,
  },
  backButton: {
    left: 16,
    padding: 8,
    position: 'absolute',
    zIndex: 10,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  container: {
    backgroundColor: DOMINANT_BG,
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  contentSection: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  headline: {
    color: SECONDARY_TEXT,
    fontSize: 38,
    fontWeight: '600',
    letterSpacing: -0.02 * 38,
    lineHeight: 38 * 1.2,
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    backgroundColor: SURFACE_COLOR,
    borderColor: INPUT_BORDER,
    borderRadius: 12,
    borderWidth: 1,
    color: SECONDARY_TEXT,
    elevation: 2,
    fontSize: 16,
    fontWeight: '400',
    height: 56,
    paddingHorizontal: 16,
    shadowColor: SECONDARY_TEXT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  inputFocused: {
    borderColor: ACCENT_COLOR,
    borderWidth: 2,
  },
  inputWrapper: {
    width: '100%',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: ACCENT_COLOR,
    borderRadius: 12,
    elevation: 2,
    height: 56,
    justifyContent: 'center',
    shadowColor: SECONDARY_TEXT,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 16 * 0.01,
  },
  skipLink: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipLinkText: {
    color: NEUTRAL_TEXT,
    fontSize: 14,
    fontFamily: 'Inter, system-ui, sans-serif',
    fontWeight: '400',
  },
  suggestionsContainer: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginTop: 16,
  },
});

export default FirstHabitScreen;
