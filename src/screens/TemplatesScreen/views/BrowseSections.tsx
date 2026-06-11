/**
 * BrowseSections — scroll content for MainBrowseView's non-filtered branch.
 */

import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useReduceMotion } from '../../../hooks/useReduceMotion';
import { spacing } from '../../../theme/spacing';
import { ScrollHint } from '../components/ScrollHint';
import { StarterHabitList } from '../components/StarterHabitList';
import { GOAL_COLLECTIONS } from '../data/goalCollections';
import { useBrowseScrollHint } from '../hooks/useBrowseScrollHint';
import { DefaultBrowseBranch } from './DefaultBrowseBranch';
import { GoalBrowseBranch } from './GoalBrowseBranch';
import { stagger } from './MainBrowseView.helpers';
import type { BrowseSectionsProps } from './BrowseSections.types';

export function BrowseSections(p: BrowseSectionsProps) {
  const reducedMotion = useReduceMotion();
  const scrollHint = useBrowseScrollHint();
  const showStarterList = p.isFirstTimeUser && p.starterTemplates.length > 0;
  const selectedGoal = p.selectedGoalId
    ? GOAL_COLLECTIONS.find((g) => g.id === p.selectedGoalId)
    : null;
  const showDefaultHint = !showStarterList && !(selectedGoal && p.prescription);

  return (
    <View style={{ flex: 1 }}>
      <Animated.ScrollView
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: spacing['2xl'],
          paddingTop: spacing.sm,
        }}
        onContentSizeChange={scrollHint.handleContentSizeChange}
        onLayout={scrollHint.handleLayout}
        onScroll={scrollHint.scrollHandler}
      >
        {showStarterList ? (
          <Animated.View entering={stagger(2)}>
            <StarterHabitList
              importedTemplateIds={p.importedTemplateIds}
              importingTemplateId={p.importingTemplateId}
              templates={p.starterTemplates}
              onBrowseByGoal={p.onBrowseByGoal}
              onImport={p.onImport}
              onPreview={p.onPreview}
            />
          </Animated.View>
        ) : selectedGoal && p.prescription ? (
          <Animated.View entering={stagger(2)}>
            <GoalBrowseBranch
              goal={selectedGoal}
              goalTemplates={p.goalTemplates}
              importedTemplateIds={p.importedTemplateIds}
              importingTemplateId={p.importingTemplateId}
              prescription={p.prescription}
              onImport={p.onImport}
              onOpenGoal={p.onOpenGoal}
              onPreview={p.onPreview}
            />
          </Animated.View>
        ) : (
          <DefaultBrowseBranch
            categoryIndex={p.categoryIndex}
            importedTemplateIds={p.importedTemplateIds}
            importingTemplateId={p.importingTemplateId}
            isFirstTimeUser={p.isFirstTimeUser}
            rowSections={p.rowSections}
            totalHabitCount={p.totalHabitCount}
            onImport={p.onImport}
            onOpenCategory={p.onOpenCategory}
            onPreview={p.onPreview}
            onSeeAll={p.onSeeAll}
            onStartHerePress={p.onStartHerePress}
          />
        )}
      </Animated.ScrollView>
      {showDefaultHint ? (
        <ScrollHint
          reducedMotion={reducedMotion}
          scrollY={scrollHint.scrollY}
          visible={scrollHint.showHint}
        />
      ) : null}
    </View>
  );
}
