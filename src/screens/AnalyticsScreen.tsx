import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
// import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { exportData, prepareExportData, showExportSuccess, showExportError } from '../utils/exportData';

// Import chart components
import StrengthDistributionChart from '../components/StrengthDistributionChart';
import TrendLineChart from '../components/TrendLineChart';
import ComplianceHeatmap from '../components/ComplianceHeatmap';

// Import insights components
import HabitRankingsList from '../components/HabitRankingsList';
import WeeklyInsightsCard from '../components/WeeklyInsightsCard';
import PremiumAnalyticsPaywall from '../components/PremiumAnalyticsPaywall';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  emoji?: string;
  onPress?: () => void;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  emoji,
  onPress,
  loading = false
}) => {
  // Create accessibility label
  const accessibilityLabel = loading
    ? `${title}, loading`
    : `${title}: ${value}${subtitle ? `, ${subtitle}` : ''}`;

  const content = (
    <View
      style={styles.statCard}
      accessible={true}
      accessibilityRole={onPress ? "button" : "text"}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={onPress ? "Double tap to view habit details" : undefined}
    >
      {loading ? (
        <View style={styles.statCardLoading} accessibilityLabel="Loading">
          <View style={styles.skeletonTitle} />
          <View style={styles.skeletonValue} />
          {subtitle && <View style={styles.skeletonSubtitle} />}
        </View>
      ) : (
        <>
          <Text style={styles.statCardTitle}>{title}</Text>
          <View style={styles.statCardValueRow}>
            {emoji && <Text style={styles.statCardEmoji} accessibilityElementsHidden>{emoji}</Text>}
            <Text style={styles.statCardValue}>{value}</Text>
          </View>
          {subtitle && <Text style={styles.statCardSubtitle}>{subtitle}</Text>}
        </>
      )}
    </View>
  );

  if (onPress && !loading) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint="Double tap to view habit details"
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

export default function AnalyticsScreen() {
  // const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // TODO: Replace with actual premium status check
  const isPremiumUser = true; // Placeholder - will be replaced with actual subscription check

  // Fetch analytics data from Convex
  const overviewStats = useQuery(api.analytics.getOverviewStats);
  const strengthDistribution = useQuery(api.analytics.getStrengthDistribution);
  const trendData = useQuery(api.analytics.get30DayTrend);
  const complianceData = useQuery(api.analytics.getComplianceData);
  const weeklyInsights = useQuery(api.analytics.getWeeklyInsights);

  const isLoading = !overviewStats;

  // Debug logging
  console.log('📊 Analytics Data:', {
    overviewStats,
    strengthDistribution,
    trendData,
    complianceData,
    weeklyInsights,
    isLoading
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Convex queries automatically refresh
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleHabitPress = useCallback((habitId: string) => {
    // navigation.navigate('HabitDetail', { habitId });
    console.log('Navigate to habit detail:', habitId);
  }, []);

  const formatStrengthPercentage = (strength: number) => {
    return `${Math.round(strength)}%`;
  };

  const handleExportPress = () => {
    if (!isPremiumUser) {
      setShowPaywall(true);
      return;
    }
    setShowExportMenu(true);
  };

  const handleExport = async (format: 'csv' | 'json') => {
    setShowExportMenu(false);

    try {
      // Get all habits and trackings (simplified - in production would use proper Convex queries)
      const exportDataObj = await prepareExportData(
        [], // habits - would be fetched from Convex
        [], // trackings - would be fetched from Convex
        overviewStats
      );

      await exportData(exportDataObj, format);

      // Show success toast
      Alert.alert(
        'Success',
        `Data exported successfully as ${format.toUpperCase()}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert(
        'Export Failed',
        error instanceof Error ? error.message : 'Unable to export data',
        [{ text: 'OK' }]
      );
    }
  };

  const handleStartTrial = () => {
    setShowPaywall(false);
    // Navigate to paywall/subscription screen
    // navigation.navigate('Subscription');
    Alert.alert(
      'Start Trial',
      'This would open the subscription flow with RevenueCat/StoreKit integration',
      [{ text: 'OK' }]
    );
  };

  // Show paywall if not premium user
  if (!isPremiumUser && showPaywall) {
    return (
      <Modal visible={showPaywall} animationType="slide" presentationStyle="fullScreen">
        <PremiumAnalyticsPaywall
          onStartTrial={handleStartTrial}
          onClose={() => setShowPaywall(false)}
        />
      </Modal>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary[500]}
          colors={[colors.primary[500]]}
        />
      }
    >
      {/* Header */}
      <View
        style={styles.header}
        accessible={true}
        accessibilityRole="header"
        accessibilityLabel="Analytics Screen"
      >
        <Text
          style={styles.headerTitle}
          accessibilityRole="text"
          accessibilityLabel="Analytics"
        >
          Analytics
        </Text>
        <Text
          style={styles.headerSubtitle}
          accessibilityRole="text"
          accessibilityLabel="Track your habit journey"
        >
          Track your habit journey
        </Text>
      </View>

      {/* Empty State - Show when no habits exist */}
      {!isLoading && overviewStats?.totalHabits === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateEmoji}>📊</Text>
          <Text style={styles.emptyStateTitle}>No Analytics Yet</Text>
          <Text style={styles.emptyStateMessage}>
            Create habits and track them for a few days to see your analytics dashboard come to life!
          </Text>
          <View style={styles.emptyStateSteps}>
            <Text style={styles.emptyStateStep}>1️⃣ Go to Home tab</Text>
            <Text style={styles.emptyStateStep}>2️⃣ Create your first habit</Text>
            <Text style={styles.emptyStateStep}>3️⃣ Track it daily</Text>
            <Text style={styles.emptyStateStep}>4️⃣ Come back here to see insights!</Text>
          </View>
        </View>
      )}

      {/* Overview Stats Cards */}
      <View style={styles.statsGrid}>
        <StatCard
          title="Total Habits"
          value={overviewStats?.totalHabits ?? '-'}
          loading={isLoading}
        />
        <StatCard
          title="Average Strength"
          value={overviewStats ? formatStrengthPercentage(overviewStats.averageStrength) : '-'}
          loading={isLoading}
        />
        <StatCard
          title="Strongest Habit"
          value={overviewStats?.strongestHabit?.name ?? '-'}
          emoji={overviewStats?.strongestHabit?.emoji}
          subtitle={overviewStats ? formatStrengthPercentage(overviewStats.strongestHabit?.strength ?? 0) : undefined}
          onPress={overviewStats?.strongestHabit ? () => handleHabitPress(overviewStats.strongestHabit!.id) : undefined}
          loading={isLoading}
        />
        <StatCard
          title="Weakest Habit"
          value={overviewStats?.weakestHabit?.name ?? '-'}
          emoji={overviewStats?.weakestHabit?.emoji}
          subtitle={overviewStats ? formatStrengthPercentage(overviewStats.weakestHabit?.strength ?? 0) : undefined}
          onPress={overviewStats?.weakestHabit ? () => handleHabitPress(overviewStats.weakestHabit!.id) : undefined}
          loading={isLoading}
        />
      </View>

      {/* Charts Section */}
      <View
        style={styles.section}
        accessible={true}
        accessibilityRole="none"
      >
        <Text
          style={styles.sectionTitle}
          accessibilityRole="header"
          accessibilityLabel="Strength Distribution Chart"
        >
          Strength Distribution
        </Text>
        <View
          accessible={true}
          accessibilityLabel={strengthDistribution ? `Habit strength distribution: ${strengthDistribution.automatic.count} automatic, ${strengthDistribution.strong.count} strong, ${strengthDistribution.developing.count} developing, ${strengthDistribution.building.count} building, ${strengthDistribution.starting.count} starting habits` : "Loading chart"}
        >
          <StrengthDistributionChart
            data={strengthDistribution ?? null}
            onSegmentPress={(level) => console.log('Filter by level:', level)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>30-Day Trend</Text>
        <TrendLineChart
          data={trendData ?? null}
          onDataPointPress={(point) => console.log('Selected point:', point)}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Compliance Heatmap</Text>
        <ComplianceHeatmap
          data={complianceData ?? null}
          onDayPress={(day) => console.log('Selected day:', day)}
        />
      </View>

      {/* Insights Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weekly Insights</Text>
        <WeeklyInsightsCard
          insights={weeklyInsights ?? null}
          onHabitPress={handleHabitPress}
          onArchivePress={() => console.log('Open archive')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Habit Rankings</Text>
        <HabitRankingsList
          habits={overviewStats?.rankedHabits || []}
          onHabitPress={handleHabitPress}
        />
      </View>

      {/* Export Button */}
      <TouchableOpacity
        style={styles.exportButton}
        onPress={handleExportPress}
        activeOpacity={0.8}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Export Data"
        accessibilityHint="Double tap to export your habit data as CSV or JSON"
      >
        <Ionicons name="download-outline" size={20} color={colors.surface} />
        <Text style={styles.exportButtonText}>Export Data</Text>
      </TouchableOpacity>

      {/* Export Format Modal */}
      <Modal
        visible={showExportMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowExportMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowExportMenu(false)}
        >
          <View style={styles.exportMenu}>
            <Text style={styles.exportMenuTitle}>Choose Export Format</Text>
            <TouchableOpacity
              style={styles.exportMenuItem}
              onPress={() => handleExport('csv')}
              activeOpacity={0.7}
            >
              <Ionicons name="document-text-outline" size={24} color={colors.primary[500]} />
              <View style={styles.exportMenuItemContent}>
                <Text style={styles.exportMenuItemTitle}>CSV</Text>
                <Text style={styles.exportMenuItemDescription}>
                  Spreadsheet format (Excel, Google Sheets)
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.exportMenuItem}
              onPress={() => handleExport('json')}
              activeOpacity={0.7}
            >
              <Ionicons name="code-outline" size={24} color={colors.primary[500]} />
              <View style={styles.exportMenuItemContent}>
                <Text style={styles.exportMenuItemTitle}>JSON</Text>
                <Text style={styles.exportMenuItemDescription}>
                  Developer-friendly format
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.exportMenuCancel}
              onPress={() => setShowExportMenu(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.exportMenuCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingBottom: spacing.xxl,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.text.primary,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    margin: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  statCardLoading: {
    height: 80,
  },
  statCardTitle: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  statCardValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statCardEmoji: {
    fontSize: 24,
    marginRight: spacing.xs,
  },
  statCardValue: {
    ...typography.h2,
    color: colors.text.primary,
  },
  statCardSubtitle: {
    ...typography.bodySmall,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  skeletonTitle: {
    width: 80,
    height: 12,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginBottom: spacing.xs,
  },
  skeletonValue: {
    width: 100,
    height: 28,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginBottom: spacing.xs,
  },
  skeletonSubtitle: {
    width: 60,
    height: 10,
    backgroundColor: colors.border,
    borderRadius: 4,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: colors.surface,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  placeholderText: {
    ...typography.body,
    color: colors.text.tertiary,
  },
  exportButton: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exportButtonText: {
    ...typography.button,
    color: colors.surface,
    marginLeft: spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  exportMenu: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.lg,
  },
  exportMenuTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  exportMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  exportMenuItemContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  exportMenuItemTitle: {
    ...typography.bodyBold,
    color: colors.text.primary,
  },
  exportMenuItemDescription: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xxs,
  },
  exportMenuCancel: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  exportMenuCancelText: {
    ...typography.body,
    color: colors.error,
  },
  emptyState: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateEmoji: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyStateTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyStateMessage: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  emptyStateSteps: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 12,
    width: '100%',
  },
  emptyStateStep: {
    ...typography.body,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    paddingVertical: spacing.xs,
  },
});