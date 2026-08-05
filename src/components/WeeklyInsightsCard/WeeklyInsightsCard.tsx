/**
 * WeeklyInsightsCard Component
 * Main orchestrator for weekly habit insights display
 */

import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import {
  Archive,
  ArrowUpCircle,
  ArrowDownCircle,
  AlertTriangle,
} from 'lucide-react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { iconSizes } from '@/theme/iconSizes';
import { colors } from '../../theme/colors';
import type { WeeklyInsightsCardProps } from './WeeklyInsightsCard.types';
import { styles } from './WeeklyInsightsCard.styles';
import { SummarySection } from './SummarySection';
import { HabitListSection } from './HabitListSection';
import { SuggestedActions } from './SuggestedActions';

export default function WeeklyInsightsCard({
  insights,
  onHabitPress,
  onArchivePress,
}: WeeklyInsightsCardProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(
    'summary'
  );

  if (!insights) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Generating insights...</Text>
      </View>
    );
  }

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <SummarySection
        insights={insights}
        isExpanded={expandedSection === 'summary'}
        onToggle={() => toggleSection('summary')}
      />

      <HabitListSection
        Icon={ArrowUpCircle}
        habits={insights.gainedStrength}
        iconColor={colors.success}
        isExpanded={expandedSection === 'gained'}
        title='Habits Gained Strength'
        type='gained'
        onHabitPress={onHabitPress}
        onToggle={() => toggleSection('gained')}
      />

      <HabitListSection
        Icon={ArrowDownCircle}
        badgeBgColor={colors.errorLight}
        badgeTextColor={colors.error}
        habits={insights.lostStrength}
        iconColor={colors.error}
        isExpanded={expandedSection === 'lost'}
        title='Habits Lost Strength'
        type='lost'
        onHabitPress={onHabitPress}
        onToggle={() => toggleSection('lost')}
      />

      <HabitListSection
        Icon={AlertTriangle}
        badgeBgColor={colors.warningLight}
        badgeTextColor={colors.warning}
        habits={insights.atRisk}
        iconColor={colors.warning}
        isExpanded={expandedSection === 'risk'}
        title='Habits at Risk'
        type='risk'
        onHabitPress={onHabitPress}
        onToggle={() => toggleSection('risk')}
      >
        <SuggestedActions />
      </HabitListSection>

      <AnimatedPressable
        accessibilityLabel='View past reports'
        accessibilityRole='button'
        style={styles.archiveButton}
        onPress={onArchivePress}
      >
        <Archive color={colors.text.secondary} size={iconSizes.medium} />
        <Text style={styles.archiveButtonText}>View Past Reports</Text>
      </AnimatedPressable>

      <Text style={styles.generatedDate}>
        Generated {new Date(insights.generatedAt).toLocaleDateString()}
      </Text>
    </ScrollView>
  );
}
