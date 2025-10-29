/**
 * HabitDetailScreen Component
 * Phase 3: Enhanced Habit Detail with Advanced Stats
 * Based on UX Specification Section 2.1 (Habit Detail Modal) and Flow 4 (Viewing Premium Analytics)
 *
 * Features:
 * - Full-screen modal with swipe-right-to-dismiss gesture
 * - Enhanced strength visualization with formula transparency
 * - 30-day history graph (Premium feature)
 * - Prediction insights with risk assessment (Premium feature)
 * - Edit/Pause/Archive/Delete actions
 * - Premium feature gating
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../theme';
import { Modal } from '../components/Modal';
import HabitStrengthIndicator from '../components/HabitStrengthIndicator/HabitStrengthIndicator';
import {
  X,
  Edit3,
  Pause,
  Archive,
  Trash2,
  Info,
  TrendingUp,
  AlertTriangle,
  Lock,
  Calendar,
} from 'lucide-react-native';
import type { Id } from '../../convex/_generated/dataModel';
import type { StrengthLevel } from '../components/HabitStrengthIndicator/HabitStrengthIndicator';
import StrengthHistoryChart from '../components/StrengthHistoryChart';
import PredictionInsights, {
  type RiskLevel,
  type TrendDirection,
} from '../components/PredictionInsights';
import * as Haptics from 'expo-haptics';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

// Types
interface Habit {
  _id: Id<'habits'>;
  name: string;
  notes?: string;
  createdAt: number;
  strength?: number;
  strengthLevel?: string; // From database as string, will be cast to StrengthLevel
  icon?: string;
  iconColor?: string;
  archived?: boolean;
}

/**
 * Mock data generator for history chart (TODO: Replace with real historical data)
 */
function generateMockHistoryData(habitId: Id<'habits'>) {
  const today = new Date();
  const data = [];

  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Generate semi-random strength data with upward trend
    const baseStrength = 30 + (30 - i) * 1.5;
    const variance = Math.sin(i * 0.5) * 10;
    const strength = Math.max(0, Math.min(100, baseStrength + variance));

    data.push({
      date: date.toISOString(),
      strength,
    });
  }

  return data;
}

interface HabitDetailScreenProps {
  visible: boolean;
  onClose: () => void;
  habit: Habit | null;
  isPremium: boolean;
  onEdit?: (habit: Habit) => void;
  onPause?: (habitId: Id<'habits'>) => void;
  onArchive?: (habitId: Id<'habits'>) => void;
  onDelete?: (habitId: Id<'habits'>) => void;
  onUpgrade?: () => void;
  onOpenCalendar?: (habit: Habit) => void;
}

/**
 * Strength Calculation Formula Component
 * Shows transparency in how strength is calculated: Baseline × Compliance = Strength
 */
function StrengthFormulaTooltip({ theme }: { theme: any }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <View style={styles.formulaContainer}>
      <Pressable
        accessible
        accessibilityLabel='See how strength is calculated'
        accessibilityRole='button'
        style={styles.formulaButton}
        onPress={() => {
          setShowTooltip(!showTooltip);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      >
        <Info color={theme.custom.colors.gray[500]} size={16} />
        <Text
          style={[
            theme.custom.typography.caption,
            { color: theme.custom.colors.gray[500] },
          ]}
        >
          How is this calculated?
        </Text>
      </Pressable>

      {showTooltip && (
        <View
          style={[
            styles.tooltipContainer,
            {
              backgroundColor: theme.custom.colors.gray[100],
              borderRadius: theme.custom.borderRadius.medium,
            },
          ]}
        >
          <Text
            style={[
              theme.custom.typography.bodySmall,
              { color: theme.custom.colors.gray[700], marginBottom: 8 },
            ]}
          >
            Strength Formula:
          </Text>
          <Text
            style={[
              theme.custom.typography.bodySmall,
              {
                color: theme.custom.colors.gray[900],
                fontFamily: theme.custom.fontFamilies.monospace,
              },
            ]}
          >
            Baseline × Compliance = Strength
          </Text>
          <Text
            style={[
              theme.custom.typography.caption,
              { color: theme.custom.colors.gray[600], marginTop: 8 },
            ]}
          >
            • Baseline: How automatic the habit feels{'\n'}• Compliance: How
            consistently you do it{'\n'}• Strength: Combined habit robustness
          </Text>
        </View>
      )}
    </View>
  );
}

/**
 * Premium Feature Lock Component
 * Shows a locked state for premium-only features
 */
function PremiumLock({
  theme,
  onUpgrade,
}: {
  theme: any;
  onUpgrade: () => void;
}) {
  return (
    <View
      style={[
        styles.premiumLockContainer,
        {
          backgroundColor: theme.custom.colors.gray[100],
          borderRadius: theme.custom.borderRadius.medium,
        },
      ]}
    >
      <Lock color={theme.custom.colors.gray[400]} size={32} />
      <Text
        style={[
          theme.custom.typography.bodyMedium,
          { color: theme.custom.colors.gray[700], marginTop: 8 },
        ]}
      >
        Premium Feature
      </Text>
      <Text
        style={[
          theme.custom.typography.caption,
          { color: theme.custom.colors.gray[500], marginTop: 4 },
        ]}
      >
        Upgrade to unlock advanced analytics
      </Text>
      <Pressable
        accessible
        accessibilityLabel='Upgrade to Premium'
        accessibilityRole='button'
        style={[
          styles.upgradeButton,
          { backgroundColor: theme.custom.colors.primary[500] },
        ]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onUpgrade();
        }}
      >
        <Text
          style={[
            theme.custom.typography.buttonMedium,
            { color: theme.custom.colors.light.text },
          ]}
        >
          Upgrade Now
        </Text>
      </Pressable>
    </View>
  );
}

/**
 * Action Button Component
 * Reusable button for edit/pause/archive/delete actions
 */
function ActionButton({
  icon: Icon,
  label,
  onPress,
  variant = 'default',
  theme,
}: {
  icon: any;
  label: string;
  onPress: () => void;
  variant?: 'default' | 'destructive';
  theme: any;
}) {
  const backgroundColor =
    variant === 'destructive'
      ? theme.custom.colors.error[50]
      : theme.custom.colors.gray[100];
  const textColor =
    variant === 'destructive'
      ? theme.custom.colors.error[600]
      : theme.custom.colors.gray[700];
  const iconColor =
    variant === 'destructive'
      ? theme.custom.colors.error[500]
      : theme.custom.colors.gray[600];

  return (
    <Pressable
      accessible
      accessibilityLabel={label}
      accessibilityRole='button'
      style={[
        styles.actionButton,
        { backgroundColor, borderRadius: theme.custom.borderRadius.medium },
      ]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
    >
      <Icon color={iconColor} size={20} />
      <Text style={[theme.custom.typography.bodyMedium, { color: textColor }]}>
        {label}
      </Text>
    </Pressable>
  );
}

/**
 * Main HabitDetailScreen Component
 */
export default function HabitDetailScreen({
  visible,
  onClose,
  habit,
  isPremium,
  onEdit,
  onPause,
  onArchive,
  onDelete,
  onUpgrade,
  onOpenCalendar,
}: HabitDetailScreenProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  // Fetch real prediction data from Convex
  const predictionData = useQuery(
    api.predictions.predict7Days,
    habit ? { habitId: habit._id } : 'skip'
  );

  if (!habit) {
    return null;
  }

  // Convert strength from 0-1 scale to 0-100 percentage for display
  const strength = (habit.strength ?? 0) * 100;
  const strengthLevel = habit.strengthLevel as StrengthLevel | undefined;

  // Action handlers with confirmations
  const handleEdit = () => {
    onEdit?.(habit);
  };

  const handlePause = () => {
    Alert.alert(
      'Pause Habit',
      'This habit will be hidden from your daily list. You can unpause it anytime from Settings.',
      [
        { style: 'cancel', text: 'Cancel' },
        {
          onPress: () => {
            onPause?.(habit._id);
            onClose();
          },
          style: 'destructive',
          text: 'Pause',
        },
      ]
    );
  };

  const handleArchive = () => {
    Alert.alert(
      'Archive Habit',
      'Archived habits are moved to your archive but keep their history.',
      [
        { style: 'cancel', text: 'Cancel' },
        {
          onPress: () => {
            onArchive?.(habit._id);
            onClose();
          },
          style: 'destructive',
          text: 'Archive',
        },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Habit',
      'This will permanently delete this habit and all its history. This cannot be undone.',
      [
        { style: 'cancel', text: 'Cancel' },
        {
          onPress: () => {
            onDelete?.(habit._id);
            onClose();
          },
          style: 'destructive',
          text: 'Delete',
        },
      ]
    );
  };

  const handleUpgrade = () => {
    onUpgrade?.();
  };

  const handleOpenCalendar = () => {
    onOpenCalendar?.(habit);
    onClose(); // Close detail screen when opening calendar
  };

  return (
    <Modal
      disableGestureClose
      disableBackdropClose={false}
      variant='fullScreen'
      visible={visible}
      onClose={onClose}
    >
      <View style={{ flex: 1 }}>
        {/* Navigation Bar */}
        <View
          style={[
            styles.navigationBar,
            {
              borderBottomColor: theme.custom.colors.gray[200],
              borderBottomWidth: 1,
            },
          ]}
        >
          <Pressable
            accessible
            accessibilityLabel='Close'
            accessibilityRole='button'
            style={styles.closeButton}
            onPress={onClose}
          >
            <X color={theme.custom.colors.gray[700]} size={24} />
          </Pressable>
          <Text
            style={[
              theme.custom.typography.heading3,
              { color: theme.custom.colors.gray[900] },
            ]}
          >
            Habit Detail
          </Text>
          <View style={styles.closeButton} />
        </View>

        {/* Scrollable Content */}
        <ScrollView
          bounces
          nestedScrollEnabled
          scrollEnabled
          showsVerticalScrollIndicator
          contentContainerStyle={styles.contentContainer}
          style={styles.content}
        >
          {/* Habit Header */}
          <View style={styles.habitHeader}>
            {habit.icon && (
              <View
                style={[
                  styles.habitIcon,
                  {
                    backgroundColor:
                      habit.iconColor || theme.custom.colors.gray[200],
                    borderRadius: theme.custom.borderRadius.medium,
                  },
                ]}
              >
                <Text style={styles.habitIconText}>{habit.icon}</Text>
              </View>
            )}
            <Text
              style={[
                theme.custom.typography.heading1,
                { color: theme.custom.colors.gray[900], marginTop: 12 },
              ]}
            >
              {habit.name}
            </Text>
            {habit.notes && (
              <Text
                style={[
                  theme.custom.typography.bodyMedium,
                  { color: theme.custom.colors.gray[600], marginTop: 8 },
                ]}
              >
                {habit.notes}
              </Text>
            )}
          </View>

          {/* Enhanced Strength Visualization */}
          <View style={styles.section}>
            <Text
              style={[
                theme.custom.typography.heading3,
                { color: theme.custom.colors.gray[900], marginBottom: 16 },
              ]}
            >
              Current Strength
            </Text>
            <HabitStrengthIndicator
              showLabel
              showPercentage
              habitName={habit.name}
              strength={strength}
              strengthLevel={strengthLevel}
              variant='full'
            />
            <StrengthFormulaTooltip theme={theme} />
          </View>

          {/* History Graph (Premium) */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <TrendingUp color={theme.custom.colors.gray[700]} size={20} />
              <Text
                style={[
                  theme.custom.typography.heading3,
                  { color: theme.custom.colors.gray[900] },
                ]}
              >
                30-Day Strength History
              </Text>
              {!isPremium && (
                <View style={styles.premiumBadge}>
                  <Lock color={theme.custom.colors.primary[600]} size={12} />
                  <Text
                    style={[
                      theme.custom.typography.caption,
                      { color: theme.custom.colors.primary[600] },
                    ]}
                  >
                    Premium
                  </Text>
                </View>
              )}
            </View>

            {isPremium ? (
              <StrengthHistoryChart
                interactive
                data={generateMockHistoryData(habit._id)}
                height={220}
                showDualAxis={false}
              />
            ) : (
              <PremiumLock theme={theme} onUpgrade={handleUpgrade} />
            )}
          </View>

          {/* Prediction Insights (Premium) */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <AlertTriangle color={theme.custom.colors.gray[700]} size={20} />
              <Text
                style={[
                  theme.custom.typography.heading3,
                  { color: theme.custom.colors.gray[900] },
                ]}
              >
                Predictions & Insights
              </Text>
              {!isPremium && (
                <View style={styles.premiumBadge}>
                  <Lock color={theme.custom.colors.primary[600]} size={12} />
                  <Text
                    style={[
                      theme.custom.typography.caption,
                      { color: theme.custom.colors.primary[600] },
                    ]}
                  >
                    Premium
                  </Text>
                </View>
              )}
            </View>

            {isPremium ? (
              predictionData ? (
                <PredictionInsights
                  showSuggestions
                  data={{
                    confidence: predictionData.confidence,
                    currentStrength: predictionData.currentStrength,
                    predictedStrength: predictionData.predictedStrength,
                    riskLevel: predictionData.riskLevel as RiskLevel,
                    suggestions: predictionData.suggestions,
                    trend: predictionData.trend as TrendDirection,
                  }}
                />
              ) : (
                <View style={styles.predictionContainer}>
                  <Text
                    style={[
                      theme.custom.typography.bodyMedium,
                      { color: theme.custom.colors.gray[500] },
                    ]}
                  >
                    Loading predictions...
                  </Text>
                </View>
              )
            ) : (
              <PremiumLock theme={theme} onUpgrade={handleUpgrade} />
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.section}>
            <Text
              style={[
                theme.custom.typography.heading3,
                { color: theme.custom.colors.gray[900], marginBottom: 16 },
              ]}
            >
              Manage Habit
            </Text>
            <View style={styles.actionsGrid}>
              <ActionButton
                icon={Calendar}
                label='View Calendar'
                theme={theme}
                onPress={handleOpenCalendar}
              />
              <ActionButton
                icon={Edit3}
                label='Edit'
                theme={theme}
                onPress={handleEdit}
              />
              <ActionButton
                icon={Pause}
                label='Pause'
                theme={theme}
                onPress={handlePause}
              />
              <ActionButton
                icon={Archive}
                label='Archive'
                theme={theme}
                onPress={handleArchive}
              />
              <ActionButton
                icon={Trash2}
                label='Delete'
                theme={theme}
                variant='destructive'
                onPress={handleDelete}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  chartContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formulaButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 8,
  },
  formulaContainer: {
    marginTop: 12,
  },
  habitHeader: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  actionsGrid: {
    gap: 12,
  },
  habitIcon: {
    alignItems: 'center',
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  actionButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  navigationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  habitIconText: {
    fontSize: 32,
  },
  predictionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  premiumBadge: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    borderRadius: 12,
    paddingVertical: 4,
  },
  premiumLockContainer: {
    alignItems: 'center',
    padding: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tooltipContainer: {
    marginTop: 8,
    padding: 16,
  },
  upgradeButton: {
    borderRadius: 12,
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
});
