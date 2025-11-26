/**
 * HabitDetailScreen Component
 * Comprehensive Habit Detail Page - Redesigned
 *
 * Features:
 * - Hero section with icon, name, and notes
 * - Quick completion button (one-tap complete)
 * - Streak chain visualization with best streak
 * - 30-day calendar heatmap
 * - Stats grid (completions, success rate, streak, days)
 * - Notes section with recent note preview
 * - Strength visualization with formula transparency
 * - Manage habit actions
 * - Premium feature gating
 */

import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, Alert, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, SlideInRight } from 'react-native-reanimated';
import { Modal } from '../components/Modal';
import HabitStrengthIndicator from '../components/HabitStrengthIndicator/HabitStrengthIndicator';
import QuickCompleteButton from '../components/QuickCompleteButton';
import StreakChainSection from '../components/StreakChainSection';
import StatsGrid from '../components/StatsGrid';
import CalendarHeatmap from '../components/CalendarHeatmap';
import NotesSection from '../components/NotesSection';
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
  ChevronRight,
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
  archived?: boolean;
  bestStreak?: number;
  createdAt: number;
  currentStreak?: number;
  icon?: string;
  iconColor?: string;
  name: string;
  notes?: string;
  strength?: number;
  strengthLevel?: string;
  totalCompletions?: number;
  totalMisses?: number;
}

interface TrackingRecord {
  completed: boolean;
  date: string;
}

interface NoteRecord {
  body: string;
  createdAt: number;
  date: string;
}

interface HabitDetailScreenProps {
  habit: Habit | null;
  isPremium: boolean;
  onAddNote?: (habitId: Id<'habits'>) => void;
  onArchive?: (habitId: Id<'habits'>) => void;
  onClose: () => void;
  onDelete?: (habitId: Id<'habits'>) => void;
  onEdit?: (habit: Habit) => void;
  onOpenCalendar?: (habit: Habit) => void;
  onPause?: (habitId: Id<'habits'>) => void;
  onUpgrade?: () => void;
  onViewNotes?: (habitId: Id<'habits'>) => void;
  visible: boolean;
}

/**
 * Hero Section - Icon, Name, Notes
 */
function HeroSection({
  completedToday,
  habit,
}: {
  completedToday: boolean;
  habit: Habit;
}) {
  return (
    <Animated.View
      className="items-center rounded-2xl bg-white/90 py-6 shadow-sm shadow-stone-200/50"
      entering={FadeInDown.delay(100).springify()}
    >
      {/* Icon */}
      {habit.icon && (
        <View
          className="relative mb-3 h-16 w-16 items-center justify-center rounded-2xl shadow-sm"
          style={{
            backgroundColor: habit.iconColor || '#fef3c7',
          }}
        >
          <Text className="text-4xl">{habit.icon}</Text>
          {completedToday && (
            <View className="absolute -bottom-1 -right-1 h-6 w-6 items-center justify-center rounded-full bg-emerald-500 shadow-sm">
              <Text className="text-sm">✓</Text>
            </View>
          )}
        </View>
      )}

      {/* Name */}
      <Text className="text-2xl font-bold text-stone-900">
        {habit.name}
      </Text>

      {/* Notes/Description */}
      {habit.notes && (
        <Text className="mt-1 px-6 text-center text-base text-stone-500">
          {habit.notes}
        </Text>
      )}
    </Animated.View>
  );
}

/**
 * Strength Calculation Formula Component
 */
function StrengthFormulaTooltip() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <View className="mt-3">
      <Pressable
        accessibilityLabel="See how strength is calculated"
        accessibilityRole="button"
        className="flex-row items-center gap-1.5 py-2 active:opacity-70"
        onPress={() => {
          setShowTooltip(!showTooltip);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      >
        <Info className="text-amber-600" size={16} />
        <Text className="text-xs font-medium text-amber-700">
          What powers this?
        </Text>
      </Pressable>

      {showTooltip && (
        <View className="mt-2 rounded-xl border border-amber-100 bg-amber-50/80 p-4">
          <Text className="mb-2 text-sm font-medium text-stone-700">
            Strength Formula:
          </Text>
          <Text className="font-mono text-sm text-stone-900">
            Baseline × Compliance = Strength
          </Text>
          <Text className="mt-2 text-xs leading-5 text-stone-600">
            • Baseline: How automatic the habit feels{'\n'}
            • Compliance: How consistently you do it{'\n'}
            • Strength: Combined habit robustness
          </Text>
        </View>
      )}
    </View>
  );
}

/**
 * Premium Feature Lock Component
 */
function PremiumLock({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <View className="items-center rounded-xl border border-violet-100/50 bg-gradient-to-br from-violet-50 to-amber-50 p-8">
      <View className="rounded-full bg-violet-100 p-3">
        <Lock className="text-violet-500" size={24} />
      </View>
      <Text className="mt-3 text-base font-semibold text-stone-800">
        Unlock Your Full Potential
      </Text>
      <Text className="mt-1 text-center text-sm text-stone-500">
        See patterns and predictions that help you grow
      </Text>
      <Pressable
        accessibilityLabel="Upgrade to Premium"
        accessibilityRole="button"
        className="mt-5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-3.5 shadow-lg shadow-violet-500/25 active:opacity-90"
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onUpgrade();
        }}
      >
        <Text className="text-sm font-bold text-white">
          ✨ Unlock Insights
        </Text>
      </Pressable>
    </View>
  );
}

/**
 * Action Button Component
 */
function ActionButton({
  icon: Icon,
  label,
  onPress,
  showChevron = false,
  variant = 'default',
}: {
  icon: React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>;
  label: string;
  onPress: () => void;
  showChevron?: boolean;
  variant?: 'default' | 'destructive';
}) {
  const isDestructive = variant === 'destructive';

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      className={clsx(
        'flex-row items-center gap-3 rounded-xl border px-4 py-3.5 active:opacity-70',
        isDestructive
          ? 'border-red-200/60 bg-red-50/50'
          : 'border-stone-200 bg-white/80'
      )}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
    >
      <Icon
        className={isDestructive ? 'text-red-500' : 'text-stone-600'}
        size={20}
        strokeWidth={2.25}
      />
      <Text
        className={clsx(
          'flex-1 text-base font-medium',
          isDestructive ? 'text-red-600' : 'text-stone-800'
        )}
      >
        {label}
      </Text>
      {showChevron && (
        <ChevronRight
          className={isDestructive ? 'text-red-400' : 'text-stone-400'}
          size={20}
        />
      )}
    </Pressable>
  );
}

/**
 * Mock data generator for history chart
 */
function generateMockHistoryData(habitId: Id<'habits'>) {
  const today = new Date();
  const data = [];

  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
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

/**
 * Generate mock tracking data for calendar heatmap
 */
function generateMockTrackingData(): { completed: boolean; date: string }[] {
  const data = [];
  const today = new Date();

  for (let i = 34; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Random completion with higher probability for recent days
    const probability = 0.6 + (34 - i) * 0.01;
    const completed = Math.random() < probability;

    data.push({ completed, date: dateStr });
  }

  return data;
}

/**
 * Main HabitDetailScreen Component
 */
export default function HabitDetailScreen({
  habit,
  isPremium,
  onAddNote,
  onArchive,
  onClose,
  onDelete,
  onEdit,
  onOpenCalendar,
  onPause,
  onUpgrade,
  onViewNotes,
  visible,
}: HabitDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const safeTop = insets.top || 44;

  // Get today's date
  const today = new Date().toISOString().split('T')[0];

  // Fetch completion status for today
  const isCompletedToday = useQuery(
    api.tracking.getCompletionStatus,
    habit ? { date: today, habitId: habit._id } : 'skip'
  );

  // Fetch prediction data
  const predictionData = useQuery(
    api.predictions.predict7Days,
    habit ? { habitId: habit._id } : 'skip'
  );

  // Calculate derived values
  const derivedValues = useMemo(() => {
    if (!habit) return null;

    const totalCompletions = habit.totalCompletions ?? 0;
    const totalMisses = habit.totalMisses ?? 0;
    const totalDays = totalCompletions + totalMisses;
    const successRate = totalDays > 0 ? (totalCompletions / totalDays) * 100 : 0;
    const daysTracking = Math.floor((Date.now() - habit.createdAt) / (1000 * 60 * 60 * 24));

    return {
      daysTracking: Math.max(1, daysTracking),
      successRate,
      totalCompletions,
    };
  }, [habit]);

  // Generate mock data for last 7 days streak chain
  const lastSevenDays = useMemo(() => {
    // TODO: Replace with real tracking data query
    const days = [];
    for (let i = 6; i >= 0; i--) {
      days.push(Math.random() > 0.3);
    }
    return days;
  }, []);

  // Generate mock calendar data
  const calendarData = useMemo(() => generateMockTrackingData(), []);

  if (!habit) {
    return null;
  }

  const strength = (habit.strength ?? 0) * 100;
  const strengthLevel = habit.strengthLevel as StrengthLevel | undefined;
  const completedToday = isCompletedToday ?? false;

  // Action handlers
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
    onClose();
  };

  const handleAddNote = () => {
    onAddNote?.(habit._id);
  };

  const handleViewNotes = () => {
    onViewNotes?.(habit._id);
  };

  return (
    <Modal
      disableBackdropClose={false}
      disableGestureClose
      onClose={onClose}
      variant="fullScreen"
      visible={visible}
    >
      <View
        className="flex-1 bg-gradient-to-b from-stone-50 via-amber-50/30 to-stone-100"
        style={{ paddingTop: safeTop }}
      >
        {/* Navigation Bar */}
        <View className="flex-row items-center justify-between px-5 pb-3">
          <Pressable
            accessibilityLabel="Close"
            accessibilityRole="button"
            className="h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-sm shadow-stone-200/50 active:bg-stone-50"
            onPress={onClose}
          >
            <X className="text-stone-700" size={24} strokeWidth={2.25} />
          </Pressable>

          <Pressable
            accessibilityLabel="Edit habit"
            accessibilityRole="button"
            className="h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-sm shadow-stone-200/50 active:bg-stone-50"
            onPress={handleEdit}
          >
            <Edit3 className="text-stone-700" size={20} strokeWidth={2.25} />
          </Pressable>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          bounces
          className="flex-1"
          contentContainerClassName="gap-4 px-5 pb-8"
          nestedScrollEnabled
          scrollEnabled
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Section */}
          <HeroSection completedToday={completedToday} habit={habit} />

          {/* Quick Complete Button */}
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <QuickCompleteButton
              completedToday={completedToday}
              habitId={habit._id}
              habitName={habit.name}
            />
          </Animated.View>

          {/* Streak Section */}
          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <StreakChainSection
              bestStreak={habit.bestStreak ?? 0}
              currentStreak={habit.currentStreak ?? 0}
              lastSevenDays={lastSevenDays}
              todayCompleted={completedToday}
            />
          </Animated.View>

          {/* Strength Visualization */}
          <Animated.View
            className="rounded-2xl bg-white/90 p-5 shadow-sm shadow-stone-200/50"
            entering={FadeInDown.delay(400).springify()}
          >
            <Text className="mb-4 text-lg font-semibold text-stone-800">
              Habit Strength
            </Text>
            <HabitStrengthIndicator
              habitName={habit.name}
              showLabel
              showPercentage
              strength={strength}
              strengthLevel={strengthLevel}
              variant="full"
            />
            <StrengthFormulaTooltip />
          </Animated.View>

          {/* Calendar Heatmap */}
          <Animated.View entering={FadeInDown.delay(500).springify()}>
            <CalendarHeatmap
              data={calendarData}
              onDayPress={(date, completed) => {
                console.log(`Pressed ${date}: ${completed ? 'completed' : 'missed'}`);
              }}
            />
          </Animated.View>

          {/* Stats Grid */}
          {derivedValues && (
            <Animated.View entering={FadeInDown.delay(600).springify()}>
              <StatsGrid
                currentStreak={habit.currentStreak ?? 0}
                daysTracking={derivedValues.daysTracking}
                successRate={derivedValues.successRate}
                totalCompletions={derivedValues.totalCompletions}
              />
            </Animated.View>
          )}

          {/* Notes Section */}
          <Animated.View entering={FadeInDown.delay(700).springify()}>
            <NotesSection
              habitName={habit.name}
              onAddNote={handleAddNote}
              onViewAllNotes={handleViewNotes}
              recentNote={undefined} // TODO: Fetch from notes query
              totalNotes={0}
            />
          </Animated.View>

          {/* Premium History Graph */}
          <Animated.View
            className="rounded-2xl bg-white/90 p-5 shadow-sm shadow-stone-200/50"
            entering={FadeInDown.delay(800).springify()}
          >
            <View className="mb-4 flex-row items-center gap-2 border-b border-stone-100 pb-3">
              <TrendingUp className="text-amber-600" size={20} strokeWidth={2.25} />
              <Text className="flex-1 text-lg font-semibold text-stone-800">
                Strength History
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
          </Animated.View>

          {/* Premium Predictions */}
          <Animated.View
            className="rounded-2xl bg-white/90 p-5 shadow-sm shadow-stone-200/50"
            entering={FadeInDown.delay(900).springify()}
          >
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
                  <Text className="text-sm italic text-stone-400">
                    ✨ Reading your patterns...
                  </Text>
                </View>
              )
            ) : (
              <PremiumLock onUpgrade={handleUpgrade} />
            )}
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View
            className="rounded-2xl bg-white/90 p-5 shadow-sm shadow-stone-200/50"
            entering={FadeInDown.delay(1000).springify()}
          >
            <Text className="mb-4 text-lg font-semibold text-stone-800">
              Manage Habit
            </Text>
            <View className="gap-3">
              <ActionButton
                icon={Calendar}
                label="View Full Calendar"
                onPress={handleOpenCalendar}
                showChevron
              />
              <ActionButton
                icon={Pause}
                label="Pause Habit"
                onPress={handlePause}
              />
              <ActionButton
                icon={Archive}
                label="Archive"
                onPress={handleArchive}
              />
              <ActionButton
                icon={Trash2}
                label="Delete"
                onPress={handleDelete}
                variant="destructive"
              />
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    </Modal>
  );
}
