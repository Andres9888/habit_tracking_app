/**
 * BrowseSections — scroll content for MainBrowseView's non-filtered branch.
 */

import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useReduceMotion } from '../../../hooks/useReduceMotion';
import { spacing } from '../../../theme/spacing';
import { ScrollHint } from '../components/ScrollHint';
import { GOAL_COLLECTIONS } from '../data/goalCollections';
import { useBrowseScrollHint } from '../hooks/useBrowseScrollHint';
import { DefaultBrowseBranch } from './DefaultBrowseBranch';
import { GoalBrowseBranch } from './GoalBrowseBranch';
import { bodyEnter, bodyExit } from './MainBrowseView.helpers';
import type { BrowseSectionsProps } from './BrowseSections.types';

export function BrowseSections(p: BrowseSectionsProps) {
  const reducedMotion = useReduceMotion();
  const scrollHint = useBrowseScrollHint();
  const selectedGoal = p.selectedGoalId
    ? GOAL_COLLECTIONS.find((g) => g.id === p.selectedGoalId)
    : null;
  const showDefaultHint = !selectedGoal;

  return (
    <View style={{ flex: 1 }}>
      <Animated.ScrollView
        keyboardDismissMode='on-drag'
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
        {selectedGoal ? (
          <Animated.View
            key='goal-branch'
            entering={bodyEnter}
            exiting={bodyExit}
          >
            <GoalBrowseBranch
              goal={selectedGoal}
              goalTemplates={p.goalTemplates}
              importedTemplateIds={p.importedTemplateIds}
              importingTemplateId={p.importingTemplateId}
              onGoalListImport={p.onPopularImport}
              onPreview={p.onPreview}
            />
          </Animated.View>
        ) : (
          <Animated.View
            key='default-branch'
            entering={bodyEnter}
            exiting={bodyExit}
          >
            <DefaultBrowseBranch
              categoryIndex={p.categoryIndex}
              importedTemplateIds={p.importedTemplateIds}
              importingTemplateId={p.importingTemplateId}
              rowSections={p.rowSections}
              totalHabitCount={p.totalHabitCount}
              onImport={p.onPopularImport}
              onOpenCategory={p.onOpenCategory}
              onPreview={p.onPreview}
              onSeeAll={p.onSeeAll}
            />
          </Animated.View>
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
