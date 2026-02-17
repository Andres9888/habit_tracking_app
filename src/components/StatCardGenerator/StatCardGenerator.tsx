/**
 * StatCardGenerator Component
 *
 * A full-screen modal that lets users choose a stat card template and
 * visual variant, preview it, then share it via the native share sheet.
 *
 * Three card types:
 *   - "30-Day Streak 🔥"  – best current streaks
 *   - "Monthly Recap 📊"  – completion stats for the current month
 *   - "Year in Review 🌟" – full-year highlights
 *
 * Three style variants: Minimal · Bold · Dark
 *
 * Triggered from the Analytics screen "Share Stats" button.
 */

import React from 'react';
import { View, Text, ScrollView, Keyboard, StyleSheet } from 'react-native';
import type ViewShot from 'react-native-view-shot';
import { Modal } from '../Modal';
import { Button } from '../Button/Button';
import { useStatCard } from './useStatCard';
import { StatCardPreview, CardTypeSelector, VariantSelector } from './components';
import { CARD_TYPE_CONFIG } from './StatCardGenerator.constants';
import { colors } from '@/theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import type { StatCardGeneratorProps } from './StatCardGenerator.types';

export function StatCardGenerator({
  visible,
  onClose,
  streakData,
  monthlyData,
  yearData,
  userName,
}: StatCardGeneratorProps) {
  const {
    viewShotRef,
    selectedType,
    setSelectedType,
    selectedVariant,
    setSelectedVariant,
    isGenerating,
    handleShare,
  } = useStatCard({ monthlyData, streakData, yearData });

  const cardConfig = CARD_TYPE_CONFIG[selectedType];

  return (
    <Modal variant='fullScreen' visible={visible} onClose={onClose}>
      <View style={styles.container}>
        {/* ── Header ──────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <Text style={styles.title}>Share Stats</Text>
          <Text style={styles.closeBtn} onPress={onClose}>
            Done
          </Text>
        </View>

        {/* ── Card preview ────────────────────────────────────────────── */}
        <View style={styles.previewSection}>
          <StatCardPreview
            monthlyData={monthlyData}
            selectedType={selectedType}
            selectedVariant={selectedVariant}
            streakData={streakData}
            userName={userName}
            viewShotRef={viewShotRef as React.RefObject<ViewShot>}
            yearData={yearData}
          />
        </View>

        {/* ── Controls ────────────────────────────────────────────────── */}
        <ScrollView
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
          style={styles.controls}
          onScrollBeginDrag={Keyboard.dismiss}
        >
          <CardTypeSelector
            selectedType={selectedType}
            onSelectType={setSelectedType}
          />

          <VariantSelector
            selectedVariant={selectedVariant}
            onSelectVariant={setSelectedVariant}
          />

          <Button
            fullWidth
            loading={isGenerating}
            style={styles.shareButton}
            onPress={() => void handleShare()}
          >
            {`Share ${cardConfig.emoji} ${cardConfig.label}`}
          </Button>
        </ScrollView>
      </View>
    </Modal>
  );
}

export default StatCardGenerator;

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  closeBtn: {
    color: colors.primary[600],
    fontSize: 17,
    fontWeight: '600',
  },
  container: {
    backgroundColor: colors.light.card,
    flex: 1,
  },
  controls: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingTop: spacing.base,
  },
  header: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.base,
  },
  previewSection: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },
  shareButton: {
    borderRadius: borderRadius.button,
    marginHorizontal: spacing.base,
    marginTop: spacing.base,
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.heading2,
    color: colors.gray[900],
  },
});
