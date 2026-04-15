import { View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOutLeft,
  FadeOutRight,
  FadeOutDown,
  Layout,
} from 'react-native-reanimated';
import { spacing } from '@/theme/spacing';
import type { ArchivedHabit } from '../types';
import type { Id } from '../../../../convex/_generated/dataModel';
import { useCardStack } from './CardStack.hooks';
import { ArchiveCard } from './ArchiveCard';
import { CardActions } from './CardActions';
import { CompletionSummary } from './CompletionSummary';
import { ProgressDots } from './ProgressDots';

interface CardStackProps {
  habits: ArchivedHabit[];
  reducedMotion: boolean;
  onRestore: (id: Id<'habits'>, name: string) => Promise<boolean>;
  onDelete: (id: Id<'habits'>, name: string) => void;
  onDone: () => void;
}

export function CardStack({
  habits,
  reducedMotion,
  onRestore,
  onDelete,
  onDone,
}: CardStackProps) {
  const state = useCardStack(habits, reducedMotion, onRestore, onDelete);

  if (state.isComplete) {
    return (
      <CompletionSummary
        deleted={state.deleted}
        onDone={onDone}
        onReviewSkipped={state.handleReviewSkipped}
        restored={state.restored}
        skipped={state.skipped}
      />
    );
  }

  if (!state.currentHabit) return null;

  const exitAnimMap = { restore: FadeOutRight, delete: FadeOutLeft, skip: FadeOutDown };
  const exitAnim = state.exitDirection ? exitAnimMap[state.exitDirection].duration(250) : undefined;

  const remaining = state.queue.length - state.currentIndex;
  const shadow = (offset: number, s: number) => ({
    position: 'absolute' as const,
    top: offset, left: offset, right: offset, bottom: offset,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 20,
    transform: [{ scale: s }],
  });

  return (
    <View style={{ flex: 1, paddingHorizontal: spacing.base }}>
      <ProgressDots current={state.currentIndex} total={state.queue.length} />

      <View style={{ flex: 1, justifyContent: 'center', position: 'relative' }}>
        {remaining > 2 && <View style={shadow(16, 0.9)} />}
        {remaining > 1 && <View style={shadow(8, 0.95)} />}

        <Animated.View
          key={state.currentHabitId}
          entering={reducedMotion ? undefined : FadeIn.duration(200)}
          exiting={reducedMotion ? undefined : exitAnim}
          layout={reducedMotion ? undefined : Layout.duration(200)}
          style={{
            transform: [{ rotate: '-1deg' }],
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.08,
            shadowRadius: 30,
            elevation: 8,
          }}
        >
          <ArchiveCard habit={state.currentHabit} />
        </Animated.View>
      </View>

      <CardActions
        disabled={state.isProcessing}
        onDelete={state.handleDelete}
        onRestore={state.handleRestore}
        onSkip={state.handleSkip}
      />
    </View>
  );
}
