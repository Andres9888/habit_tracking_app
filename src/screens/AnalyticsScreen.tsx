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
import {
  exportData,
  prepareExportData,
  showExportSuccess,
  showExportError,
} from '../utils/exportData';

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
  loading = false,
}) => {
  // Create accessibility label
  const accessibilityLabel = loading
    ? `${title}, loading`
    : `${title}: ${value}${subtitle ? `, ${subtitle}` : ''}`;

  const content = (
    <View
      accessible
      accessibilityHint={
        onPress ? 'Double tap to view habit details' : undefined
      }
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={onPress ? 'button' : 'text'}
      style={styles.statCard}
    >
      {loading ? (
        <View accessibilityLabel='Loading' style={styles.statCardLoading}>
          <View style={styles.skeletonTitle} />
          <View style={styles.skeletonValue} />
          {subtitle && <View style={styles.skeletonSubtitle} />}
        </View>
      ) : (
        <>
          <Text style={styles.statCardTitle}>{title}</Text>
          <View style={styles.statCardValueRow}>
            {emoji && (
              <Text accessibilityElementsHidden style={styles.statCardEmoji}>
                {emoji}
              </Text>
            )}
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
        accessible
        accessibilityHint='Double tap to view habit details'
        accessibilityLabel={accessibilityLabel}
        accessibilityRole='button'
        activeOpacity={0.7}
        onPress={onPress}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const formatStrengthPercentage = (strength: number) =>
  `${Math.round(strength)}%`;

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
    complianceData,
    isLoading,
    overviewStats,
    strengthDistribution,
    trendData,
    weeklyInsights,
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
      <Modal
        animationType='slide'
        presentationStyle='fullScreen'
        visible={showPaywall}
      >
        <PremiumAnalyticsPaywall
          onClose={() => setShowPaywall(false)}
          onStartTrial={handleStartTrial}
        />
      </Modal>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          colors={[colors.primary[500]]}
          refreshing={refreshing}
          tintColor={colors.primary[500]}
          onRefresh={onRefresh}
        />
      }
      style={styles.container}
    >
      {/* Header */}
      <View
        accessible
        accessibilityLabel='Analytics Screen'
        accessibilityRole='header'
        style={styles.header}
      >
        <Text
          accessibilityLabel='Analytics'
          accessibilityRole='text'
          style={styles.headerTitle}
        >
          Analytics
        </Text>
        <Text
          accessibilityLabel='Track your habit journey'
          accessibilityRole='text'
          style={styles.headerSubtitle}
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
            Create habits and track them for a few days to see your analytics
            dashboard come to life!
          </Text>
          <View style={styles.emptyStateSteps}>
            <Text style={styles.emptyStateStep}>1️⃣ Go to Home tab</Text>
            <Text style={styles.emptyStateStep}>
              2️⃣ Create your first habit
            </Text>
            <Text style={styles.emptyStateStep}>3️⃣ Track it daily</Text>
            <Text style={styles.emptyStateStep}>
              4️⃣ Come back here to see insights!
            </Text>
          </View>
        </View>
      )}

      {/* Overview Stats Cards */}
      <View style={styles.statsGrid}>
        <StatCard
          loading={isLoading}
          title='Total Habits'
          value={overviewStats?.totalHabits ?? '-'}
        />
        <StatCard
          loading={isLoading}
          title='Average Strength'
          value={
            overviewStats
              ? formatStrengthPercentage(overviewStats.averageStrength)
              : '-'
          }
        />
        <StatCard
          emoji={overviewStats?.strongestHabit?.emoji}
          loading={isLoading}
          subtitle={
            overviewStats
              ? formatStrengthPercentage(
                  overviewStats.strongestHabit?.strength ?? 0
                )
              : undefined
          }
          title='Strongest Habit'
          value={overviewStats?.strongestHabit?.name ?? '-'}
          onPress={
            overviewStats?.strongestHabit
              ? () => handleHabitPress(overviewStats.strongestHabit!.id)
              : undefined
          }
        />
        <StatCard
          emoji={overviewStats?.weakestHabit?.emoji}
          loading={isLoading}
          subtitle={
            overviewStats
              ? formatStrengthPercentage(
                  overviewStats.weakestHabit?.strength ?? 0
                )
              : undefined
          }
          title='Weakest Habit'
          value={overviewStats?.weakestHabit?.name ?? '-'}
          onPress={
            overviewStats?.weakestHabit
              ? () => handleHabitPress(overviewStats.weakestHabit!.id)
              : undefined
          }
        />
      </View>

      {/* Charts Section */}
      <View accessible accessibilityRole='none' style={styles.section}>
        <Text
          accessibilityLabel='Strength Distribution Chart'
          accessibilityRole='header'
          style={styles.sectionTitle}
        >
          Strength Distribution
        </Text>
        <View
          accessible
          accessibilityLabel={
            strengthDistribution
              ? `Habit strength distribution: ${strengthDistribution.automatic.count} automatic, ${strengthDistribution.strong.count} strong, ${strengthDistribution.developing.count} developing, ${strengthDistribution.building.count} building, ${strengthDistribution.starting.count} starting habits`
              : 'Loading chart'
          }
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
          onArchivePress={() => console.log('Open archive')}
          onHabitPress={handleHabitPress}
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
        accessible
        accessibilityHint='Double tap to export your habit data as CSV or JSON'
        accessibilityLabel='Export Data'
        accessibilityRole='button'
        activeOpacity={0.8}
        style={styles.exportButton}
        onPress={handleExportPress}
      >
        <Ionicons color={colors.surface} name='download-outline' size={20} />
        <Text style={styles.exportButtonText}>Export Data</Text>
      </TouchableOpacity>

      {/* Export Format Modal */}
      <Modal
        transparent
        animationType='fade'
        visible={showExportMenu}
        onRequestClose={() => setShowExportMenu(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalOverlay}
          onPress={() => setShowExportMenu(false)}
        >
          <View style={styles.exportMenu}>
            <Text style={styles.exportMenuTitle}>Choose Export Format</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.exportMenuItem}
              onPress={() => handleExport('csv')}
            >
              <Ionicons
                color={colors.primary[500]}
                name='document-text-outline'
                size={24}
              />
              <View style={styles.exportMenuItemContent}>
                <Text style={styles.exportMenuItemTitle}>CSV</Text>
                <Text style={styles.exportMenuItemDescription}>
                  Spreadsheet format (Excel, Google Sheets)
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.exportMenuItem}
              onPress={() => handleExport('json')}
            >
              <Ionicons
                color={colors.primary[500]}
                name='code-outline'
                size={24}
              />
              <View style={styles.exportMenuItemContent}>
                <Text style={styles.exportMenuItemTitle}>JSON</Text>
                <Text style={styles.exportMenuItemDescription}>
                  Developer-friendly format
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.exportMenuCancel}
              onPress={() => setShowExportMenu(false)}
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
    backgroundColor: colors.background,
    flex: 1,
  },
  contentContainer: {
    paddingBottom: spacing.xxl,
  },
  header: {
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.text.primary,
  },
  skeletonTitle: {
    height: 12,
    backgroundColor: colors.border,
    width: 80,
    borderRadius: 4,
    marginBottom: spacing.xs,
  },
  skeletonSubtitle: {
    height: 10,
    width: 60,
    backgroundColor: colors.border,
    borderRadius: 4,
  },
  statCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    flex: 1,
    elevation: 3,
    margin: spacing.sm,
    minWidth: '45%',
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  section: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  statCardEmoji: {
    fontSize: 24,
    marginRight: spacing.xs,
  },
  chartPlaceholder: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    height: 200,
    alignItems: 'center',
    borderColor: colors.border,
    justifyContent: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
  },
  statCardLoading: {
    height: 80,
  },
  exportButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary[500],
    marginHorizontal: spacing.lg,
    borderRadius: 12,
    marginTop: spacing.md,
    alignItems: 'center',
    paddingVertical: spacing.md,
    justifyContent: 'center',
  },
  statCardSubtitle: {
    ...typography.bodySmall,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  exportButtonText: {
    ...typography.button,
    color: colors.surface,
    marginLeft: spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.lg,
  },
  exportMenu: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.lg,
  },
  statCardTitle: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  exportMenuItem: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    flexDirection: 'row',
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  statCardValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exportMenuItemContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  statCardValue: {
    ...typography.h2,
    color: colors.text.primary,
  },
  exportMenuItemDescription: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xxs,
  },
  exportMenuCancel: {
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingVertical: spacing.md,
  },
  skeletonValue: {
    width: 100,
    height: 28,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginBottom: spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
  },
  emptyStateEmoji: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  emptyStateMessage: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
    textAlign: 'center',
  },
  placeholderText: {
    ...typography.body,
    color: colors.text.tertiary,
  },
  emptyStateStep: {
    ...typography.body,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    paddingVertical: spacing.xs,
  },
  emptyStateSteps: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  emptyStateTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  exportMenuTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  exportMenuCancelText: {
    ...typography.body,
    color: colors.error,
  },
  exportMenuItemTitle: {
    ...typography.bodyBold,
    color: colors.text.primary,
  },
});
