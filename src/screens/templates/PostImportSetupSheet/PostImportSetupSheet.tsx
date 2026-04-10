/**
 * Post-import setup sheet
 * Shown after successfully importing a template to set up psychology fields
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Modal from '../../../components/Modal';
import { useThemeColors } from '../../../theme/ThemeContext';
import { fontFamilies, fontWeights } from '@/theme/typography';
import { SetupCard } from './SetupCard';
import { usePostImportSetup } from './usePostImportSetup';
import type { PostImportSetupSheetProps } from './PostImportSetupSheet.types';

export function PostImportSetupSheet({
  habitId,
  template,
  visible,
  onClose,
}: PostImportSetupSheetProps) {
  const { colors } = useThemeColors();
  const {
    cueAfterBehavior,
    handleSave,
    handleSkip,
    hasAnyInput,
    identity,
    isSaving,
    reset,
    setCueAfterBehavior,
    setIdentity,
    setWhy,
    why,
  } = usePostImportSetup(habitId, onClose);

  // Reset fields when sheet opens with a new template
  useEffect(() => {
    if (visible) reset();
  }, [visible, reset]);

  if (!template) return null;

  return (
    <Modal
      inline
      accessibilityViewIsModal
      variant="fullScreen"
      visible={visible}
      onClose={handleSkip}
    >
      <View style={[sheetStyles.container, { backgroundColor: colors.background }]}>
        <ScrollView
          bounces
          contentContainerStyle={sheetStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={sheetStyles.header}>
            <Text style={sheetStyles.icon}>{template.icon}</Text>
            <Text style={[sheetStyles.title, { color: colors.text }]}>
              {`${template.name} added!`}
            </Text>
            <Text style={[sheetStyles.subtitle, { color: colors.textSecondary }]}>
              Set yourself up for success in 30 seconds
            </Text>
          </View>

          {/* Setup cards */}
          <View style={sheetStyles.cards}>
            <SetupCard
              accentColor="#0ea5e9"
              description="People who set a cue are 2.5x more likely to stick"
              emoji="📍"
              placeholder='e.g. "After I pour my morning coffee"'
              suggestedValue={template.suggestedCue}
              title="When & Where"
              value={cueAfterBehavior}
              onChangeText={setCueAfterBehavior}
            />
            <SetupCard
              accentColor="#f43f5e"
              description="Why does this habit matter to you?"
              emoji="💭"
              placeholder='e.g. "I want to start my day calm"'
              suggestedValue={template.suggestedWhy}
              title="Your Why"
              value={why}
              onChangeText={setWhy}
            />
            <SetupCard
              accentColor="#8b5cf6"
              description="Who are you becoming?"
              emoji="🪞"
              placeholder='e.g. "I am someone who meditates daily"'
              suggestedValue={template.suggestedIdentity}
              title="Your Identity"
              value={identity}
              onChangeText={setIdentity}
            />
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={[sheetStyles.footer, { borderTopColor: colors.border }]}>
          <Pressable
            disabled={!hasAnyInput || isSaving}
            style={[
              sheetStyles.saveButton,
              { opacity: hasAnyInput ? 1 : 0.5 },
            ]}
            onPress={handleSave}
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={sheetStyles.saveButtonText}>
                Save & start tracking
              </Text>
            )}
          </Pressable>
          <Pressable style={sheetStyles.skipButton} onPress={handleSkip}>
            <Text style={[sheetStyles.skipText, { color: colors.textSecondary }]}>
              Skip — set up later
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const sheetStyles = StyleSheet.create({
  cards: {
    gap: 12,
    paddingHorizontal: 16,
  },
  container: {
    flex: 1,
  },
  footer: {
    borderTopWidth: 1,
    paddingBottom: 34,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    alignItems: 'center',
    paddingBottom: 20,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  icon: {
    fontSize: 40,
    marginBottom: 10,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: '#22c55e',
    borderRadius: 14,
    paddingVertical: 14,
  },
  saveButtonText: {
    color: '#fff',
    fontFamily: fontFamilies.primary.text,
    fontSize: 16,
    fontWeight: fontWeights.bold,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 14,
    fontWeight: fontWeights.medium,
  },
  subtitle: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 14,
    marginTop: 4,
  },
  title: {
    fontFamily: fontFamilies.primary.display,
    fontSize: 20,
    fontWeight: fontWeights.bold,
  },
});
