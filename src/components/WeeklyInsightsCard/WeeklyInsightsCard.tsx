/**
 * WeeklyInsightsCard Component
 * Main orchestrator for weekly habit insights display
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
        habits={insights.gainedStrength}
        iconColor={colors.success}
        iconName='arrow-up-circle'
        isExpanded={expandedSection === 'gained'}
        title='Habits Gained Strength'
        type='gained'
        onHabitPress={onHabitPress}
        onToggle={() => toggleSection('gained')}
      />

      <HabitListSection
        badgeBgColor='#FEE2E2'
        badgeTextColor={colors.error}
        habits={insights.lostStrength}
        iconColor={colors.error}
        iconName='arrow-down-circle'
        isExpanded={expandedSection === 'lost'}
        title='Habits Lost Strength'
        type='lost'
        onHabitPress={onHabitPress}
        onToggle={() => toggleSection('lost')}
      />

      <HabitListSection
        badgeBgColor='#FEF3C7'
        badgeTextColor={colors.warning[700]}
        habits={insights.atRisk}
        iconColor={colors.warning[500]}
        iconName='warning'
        isExpanded={expandedSection === 'risk'}
        title='Habits at Risk'
        type='risk'
        onHabitPress={onHabitPress}
        onToggle={() => toggleSection('risk')}
      >
        <SuggestedActions />
      </HabitListSection>

      <TouchableOpacity
        accessibilityLabel='View past reports'
        accessibilityRole='button'
        activeOpacity={0.7}
        style={styles.archiveButton}
        onPress={onArchivePress}
      >
        <Ionicons color={colors.text.secondary} name='archive' size={20} />
        <Text style={styles.archiveButtonText}>View Past Reports</Text>
      </TouchableOpacity>

      <Text style={styles.generatedDate}>
        Generated {new Date(insights.generatedAt).toLocaleDateString()}
      </Text>
    </ScrollView>
  );
}
