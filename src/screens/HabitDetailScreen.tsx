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
import { View, Text, Pressable, Alert, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { clsx } from 'clsx';

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
  habit: Habit | null;
  isPremium: boolean;
  onArchive?: (habitId: Id<'habits'>) => void;
  onClose: () => void;
  onDelete?: (habitId: Id<'habits'>) => void;
  onEdit?: (habit: Habit) => void;
  onOpenCalendar?: (habit: Habit) => void;
  onPause?: (habitId: Id<'habits'>) => void;
  onUpgrade?: () => void;
  visible: boolean;
}

/**
 * Strength Calculation Formula Component
 * Shows transparency in how strength is calculated: Baseline × Compliance = Strength
 */
function StrengthFormulaTooltip() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <View className="mt-3">
      <Pressable
        accessibilityLabel='See how strength is calculated'
        accessibilityRole='button'
        className="flex-row items-center gap-1.5 py-2 active:opacity-70"
        onPress={() => {
          setShowTooltip(!showTooltip);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      >
        <Info className="text-amber-600" size={16} />
        <Text className="font-medium text-xs text-amber-700">
          What powers this?
        </Text>
      </Pressable>

      {showTooltip && (
        <View className="mt-2 rounded-xl bg-amber-50/80 border border-amber-100 p-4">
          <Text className="mb-2 text-sm font-medium text-stone-700">
            Strength Formula:
          </Text>
          <Text className="font-mono text-sm text-stone-900">
            Baseline × Compliance = Strength
          </Text>
          <Text className="mt-2 text-xs leading-5 text-stone-600">
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
function PremiumLock({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <View className="items-center rounded-xl bg-gradient-to-br from-violet-50 to-amber-50 border border-violet-100/50 p-8">
      <View className="rounded-full bg-violet-100 p-3">
        <Lock className="text-violet-500" size={24} />
      </View>
      <Text className="mt-3 text-base font-semibold text-stone-800">
        Unlock Your Full Potential
      </Text>
      <Text className="mt-1 text-sm text-stone-500 text-center">
        See patterns and predictions that help you grow
      </Text>
      <Pressable
        accessibilityLabel='Upgrade to Premium'
        accessibilityRole='button'
        className="mt-5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-3.5 shadow-lg shadow-violet-500/25 active:opacity-90"
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onUpgrade();
        }}
      >
        <Text className="font-bold text-sm text-white">
          ✨ Unlock Insights
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
}: {
  icon: any;
  label: string;
  onPress: () => void;
  variant?: 'default' | 'destructive';
}) {
  const isDestructive = variant === 'destructive';

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole='button'
      className={clsx(
        "flex-row items-center gap-3 rounded-xl border px-4 py-3.5 active:opacity-70",
        isDestructive
          ? "border-red-200/60 bg-red-50/50"
          : "border-stone-200 bg-white/80"
      )}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
    >
      <Icon
        className={isDestructive ? "text-red-500" : "text-stone-600"}
        size={20}
        strokeWidth={2.25}
      />
      <Text className={clsx(
        "text-base font-medium",
        isDestructive ? "text-red-600" : "text-stone-800"
      )}>
        {label}
      </Text>
    </Pressable>
  );
}

/**
 * Main HabitDetailScreen Component
 */
export default function HabitDetailScreen({
  habit,
  isPremium,
  onArchive,
  onClose,
  onDelete,
  onEdit,
  onOpenCalendar,
  onPause,
  onUpgrade,
  visible,
}: HabitDetailScreenProps) {
  const insets = useSafeAreaInsets();

  // Ensure we have a minimum top padding for devices with notch/dynamic island
  // If insets.top is 0, default to 44 (standard iOS status bar + some padding)
  const safeTop = insets.top || 44;

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
      disableBackdropClose={false}
      disableGestureClose
      onClose={onClose}
      variant='fullScreen'
      visible={visible}
    >
      <View
        className="flex-1 bg-gradient-to-b from-stone-50 via-amber-50/30 to-stone-100"
        style={{ paddingTop: safeTop }}
      >
        {/* Navigation Bar */}
        <View className="flex-row items-center justify-start px-5 pb-3">
          <Pressable
            accessibilityLabel='Close'
            accessibilityRole='button'
            className="h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-sm shadow-stone-200/50 active:bg-stone-50"
            onPress={onClose}
          >
            <X className="text-stone-700" size={24} strokeWidth={2.25} />
          </Pressable>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          bounces
          className="flex-1"
          contentContainerClassName="pb-8 px-5"
          nestedScrollEnabled
          scrollEnabled
          showsVerticalScrollIndicator
        >
          {/* Habit Header */}
          <View className="mb-5 items-center rounded-2xl bg-white/90 backdrop-blur-sm py-6 shadow-sm shadow-stone-200/50">
            {habit.icon && (
              <View
                className="h-16 w-16 items-center justify-center rounded-2xl shadow-sm"
                style={{
                  backgroundColor: habit.iconColor || '#fef3c7', // amber-100 fallback
                }}
              >
                <Text className="text-4xl">{habit.icon}</Text>
              </View>
            )}
            <Text className="mt-3 text-2xl font-bold text-stone-900">
              {habit.name}
            </Text>
            {habit.notes && (
              <Text className="mt-2 text-base text-stone-500">
                {habit.notes}
              </Text>
            )}
          </View>

          {/* Enhanced Strength Visualization */}
          <View className="mb-5 rounded-2xl bg-white/90 backdrop-blur-sm p-5 shadow-sm shadow-stone-200/50">
            <Text className="mb-4 text-lg font-semibold text-stone-800">
              Your {habit.name} Strength
            </Text>
            <HabitStrengthIndicator
              habitName={habit.name}
              showLabel
              showPercentage
              strength={strength}
              strengthLevel={strengthLevel}
              variant='full'
            />
            <StrengthFormulaTooltip />
          </View>

          {/* History Graph (Premium) */}
          <View className="mb-5 rounded-2xl bg-white/90 backdrop-blur-sm p-5 shadow-sm shadow-stone-200/50">
            <View className="mb-4 flex-row items-center gap-2 border-b border-stone-100 pb-3">
              <TrendingUp className="text-amber-600" size={20} strokeWidth={2.25} />
              <Text className="flex-1 text-lg font-semibold text-stone-800">
                30-Day Strength History
              </Text>
              {!isPremium && (
                <View className="flex-row items-center gap-1 rounded-xl bg-indigo-50 px-2 py-1">
                  <Lock className="text-indigo-600" size={12} />
                  <Text className="text-xs font-medium text-indigo-600">
                    Premium
                  </Text>
                </View>
              )}
            </View>

            {isPremium ? (
              <StrengthHistoryChart
                data={generateMockHistoryData(habit._id)}
                height={220}
                interactive
                showDualAxis={false}
              />
            ) : (
              <PremiumLock onUpgrade={handleUpgrade} />
            )}
          </View>

          {/* Prediction Insights (Premium) */}
          <View className="mb-5 rounded-2xl bg-white/90 backdrop-blur-sm p-5 shadow-sm shadow-stone-200/50">
            <View className="mb-4 flex-row items-center gap-2 border-b border-stone-100 pb-3">
              <AlertTriangle className="text-violet-500" size={20} strokeWidth={2.25} />
              <Text className="flex-1 text-lg font-semibold text-stone-800">
                Predictions & Insights
              </Text>
              {!isPremium && (
                <View className="flex-row items-center gap-1 rounded-xl bg-indigo-50 px-2 py-1">
                  <Lock className="text-indigo-600" size={12} />
                  <Text className="text-xs font-medium text-indigo-600">
                    Premium
                  </Text>
                </View>
              )}
            </View>

            {isPremium ? (
              predictionData ? (
                <PredictionInsights
                  data={{
                    confidence: predictionData.confidence,
                    currentStrength: predictionData.currentStrength,
                    predictedStrength: predictionData.predictedStrength,
                    riskLevel: predictionData.riskLevel as RiskLevel,
                    suggestions: predictionData.suggestions,
                    trend: predictionData.trend as TrendDirection,
                  }}
                  showSuggestions
                />
              ) : (
                <View className="items-center justify-center p-6">
                  <Text className="text-sm text-stone-400 italic">
                    ✨ Reading your patterns...
                  </Text>
                </View>
              )
            ) : (
              <PremiumLock onUpgrade={handleUpgrade} />
            )}
          </View>

          {/* Action Buttons */}
          <View className="rounded-2xl bg-white/90 backdrop-blur-sm p-5 shadow-sm shadow-stone-200/50">
            <Text className="mb-4 text-lg font-semibold text-stone-800">
              Manage Habit
            </Text>
            <View className="gap-3">
              <ActionButton
                icon={Calendar}
                label='View Calendar'
                onPress={handleOpenCalendar}
              />
              <ActionButton
                icon={Edit3}
                label='Edit'
                onPress={handleEdit}
              />
              <ActionButton
                icon={Pause}
                label='Pause'
                onPress={handlePause}
              />
              <ActionButton
                icon={Archive}
                label='Archive'
                onPress={handleArchive}
              />
              <ActionButton
                icon={Trash2}
                label='Delete'
                onPress={handleDelete}
                variant='destructive'
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
