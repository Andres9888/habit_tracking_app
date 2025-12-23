/**
 * MotivationTabContent Component
 * Displays motivation-related sections with staggered entrance animations
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  type SharedValue,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Heart,
  Sparkles,
  Target,
  MapPin,
  Clock,
  Eye,
  MessageCircle,
  Brain,
  Plus,
  ChevronRight,
  Shuffle,
  Lightbulb,
} from 'lucide-react-native';
import { HabitNotesSection } from '../../../components/HabitNotesSection';
import {
  SectionCard,
  AnimatedSection,
  CompletionCheckmark,
  PulsingIcon,
  AnimatedPressableCard,
} from './SharedComponents';
import type { Habit, Doc } from './types';

interface MotivationTabContentProps {
  affirmations: Doc<'affirmations'>[];
  affirmationFlipAnim: SharedValue<number>;
  habit: Habit;
  habitCueAfterBehavior: string | undefined;
  habitCueLocation: string | undefined;
  habitCueTime: string | undefined;
  habitIdentity: string | undefined;
  habitNotes: Doc<'notes'>[];
  hasCue: boolean;
  onAddNote: () => void;
  onEditNote: (note: Doc<'notes'>) => void;
  onOpenAffirmationEditor: (item?: Doc<'affirmations'>) => void;
  onOpenCueEditor: () => void;
  onOpenIdentityEditor: () => void;
  onShuffleAffirmation: () => void;
  onOpenVisualizationExercise: () => void;
  onOpenVisualizationGuide: () => void;
  onOpenVisionBoardEditor: (item?: Doc<'visionBoardItems'>) => void;
  onOpenVisionBoardPreview: (index: number) => void;
  onOpenWhyEditor: () => void;
  onConfirmDeleteAffirmation: (item: Doc<'affirmations'>) => void;
  onConfirmDeleteVisionBoardItem: (item: Doc<'visionBoardItems'>) => void;
  onSetAffirmationsListOpen: (open: boolean) => void;
  onSetVisionBoardListOpen: (open: boolean) => void;
  onViewAllNotes: () => void;
  shuffledAffirmationIndex: number;
  visionBoardItems: Doc<'visionBoardItems'>[];
  reduceMotion?: boolean;
  /** Whether to animate entrance (first tab visit only) */
  shouldAnimate?: boolean;
}

/**
 * Affirmations Section Component
 * Displays affirmations with flip animation and shuffle feature
 */
function AffirmationsSection({
  affirmations,
  affirmationFlipAnim,
  shuffledAffirmationIndex,
  onShuffleAffirmation,
  onOpenAffirmationEditor,
  onConfirmDeleteAffirmation,
  onSetAffirmationsListOpen,
  reduceMotion = false,
}: {
  affirmations: Doc<'affirmations'>[];
  affirmationFlipAnim: SharedValue<number>;
  shuffledAffirmationIndex: number;
  onShuffleAffirmation: () => void;
  onOpenAffirmationEditor: (item?: Doc<'affirmations'>) => void;
  onConfirmDeleteAffirmation: (item: Doc<'affirmations'>) => void;
  onSetAffirmationsListOpen: (open: boolean) => void;
  reduceMotion?: boolean;
}) {
  // Get the current affirmation to display based on shuffled index
  const safeIndex = affirmations.length > 0
    ? shuffledAffirmationIndex % affirmations.length
    : 0;
  const currentAffirmation = affirmations[safeIndex];

  // Animated style for card flip effect
  // Skip animation if reduce motion is enabled
  const flipAnimatedStyle = useAnimatedStyle(() => {
    // No animation transform when reduce motion is enabled
    if (reduceMotion) {
      return {
        transform: [{ perspective: 1000 }, { rotateY: '0deg' }],
        opacity: 1,
      };
    }
    const rotateY = interpolate(
      affirmationFlipAnim.value,
      [0, 1],
      [0, 90],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      affirmationFlipAnim.value,
      [0, 0.5, 1],
      [1, 0.5, 0],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      opacity,
    };
  });

  return (
    <SectionCard>
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <MessageCircle className="text-stone-500" size={18} />
          <Text className="font-semibold text-stone-800">Affirmations</Text>
          {affirmations.length > 0 && (
            <View className="rounded-full bg-stone-100 px-1.5 py-0.5">
              <Text className="text-[10px] font-medium text-stone-500">
                {safeIndex + 1}/{affirmations.length}
              </Text>
            </View>
          )}
        </View>
        <View className="flex-row items-center gap-2">
          {/* Shuffle button - only show when more than 1 affirmation */}
          {affirmations.length > 1 && (
            <Pressable
              accessibilityLabel="Shuffle affirmation"
              accessibilityRole="button"
              className="rounded-full bg-stone-100 p-2 active:bg-stone-200"
              onPress={onShuffleAffirmation}
            >
              <Shuffle className="text-stone-600" size={16} />
            </Pressable>
          )}
          <Pressable
            accessibilityLabel="Add affirmation"
            accessibilityRole="button"
            className="rounded-full bg-violet-600 px-3 py-1.5 active:bg-violet-700"
            onPress={() => onOpenAffirmationEditor()}
          >
            <Text className="text-xs font-semibold text-white">+ Add</Text>
          </Pressable>
        </View>
      </View>
      {affirmations.length === 0 ? (
        <LinearGradient
          colors={['#ecfdf5', '#d1fae5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="items-center rounded-xl py-6"
        >
          <PulsingIcon reduceMotion={reduceMotion}>
            <MessageCircle className="mb-2 text-emerald-300" size={28} />
          </PulsingIcon>
          <Text className="text-center text-sm text-stone-500">
            What do you tell yourself?
          </Text>
          <View className="mt-2 flex-row items-center gap-1">
            <Plus className="text-emerald-600" size={12} />
            <Text className="text-xs font-medium text-emerald-600">Add affirmation</Text>
          </View>
        </LinearGradient>
      ) : (
        <View className="gap-3">
          {/* Single affirmation card with flip animation */}
          <Animated.View style={flipAnimatedStyle}>
            <AnimatedPressableCard
              accessibilityLabel={`Edit affirmation: ${currentAffirmation?.text.slice(0, 30)}`}
              className="rounded-xl border border-stone-100 bg-gradient-to-r from-violet-50 to-indigo-50 p-4"
              onLongPress={() => currentAffirmation && onConfirmDeleteAffirmation(currentAffirmation)}
              onPress={() => onOpenAffirmationEditor(currentAffirmation)}
              reduceMotion={reduceMotion}
            >
              <Text className="text-sm leading-5 text-stone-700">"{currentAffirmation?.text}"</Text>
              {currentAffirmation?.type && (
                <View className="mt-2">
                  <View className="self-start rounded-full bg-violet-100 px-2 py-0.5">
                    <Text className="text-xs text-violet-600">{currentAffirmation.type}</Text>
                  </View>
                </View>
              )}
            </AnimatedPressableCard>
          </Animated.View>
          {/* View all link - show when more than 1 affirmation */}
          {affirmations.length > 1 && (
            <Pressable
              accessibilityLabel="View all affirmations"
              accessibilityRole="button"
              className="items-center rounded-xl border border-dashed border-stone-200 bg-white py-3 active:bg-stone-50"
              onPress={() => onSetAffirmationsListOpen(true)}
            >
              <Text className="text-sm font-medium text-stone-600">
                View all ({affirmations.length})
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </SectionCard>
  );
}

export function MotivationTabContent({
  affirmations,
  affirmationFlipAnim,
  habit,
  habitCueAfterBehavior,
  habitCueLocation,
  habitCueTime,
  habitIdentity,
  habitNotes,
  hasCue,
  onAddNote,
  onEditNote,
  onOpenAffirmationEditor,
  onOpenCueEditor,
  onOpenIdentityEditor,
  onShuffleAffirmation,
  onOpenVisualizationExercise,
  onOpenVisualizationGuide,
  onOpenVisionBoardEditor,
  onOpenVisionBoardPreview,
  onOpenWhyEditor,
  onConfirmDeleteAffirmation,
  onConfirmDeleteVisionBoardItem,
  onSetAffirmationsListOpen,
  onSetVisionBoardListOpen,
  onViewAllNotes,
  shuffledAffirmationIndex,
  visionBoardItems,
  reduceMotion = false,
  shouldAnimate = false,
}: MotivationTabContentProps) {
  return (
    <View className="gap-4">
      {/* Your Why Section - Index 0 */}
      <AnimatedSection index={0} shouldAnimate={shouldAnimate} reduceMotion={reduceMotion}>
        <SectionCard
          accessibilityLabel={habit.why ? 'Edit your why' : 'Add your why'}
          onPress={onOpenWhyEditor}
          className="border-l-4 border-rose-400"
        >
          <View className="flex-row items-start gap-3">
            <View className="relative h-10 w-10 items-center justify-center rounded-xl bg-rose-100">
              {habit.why ? (
                <Heart className="text-rose-500" size={20} />
              ) : (
                <PulsingIcon reduceMotion={reduceMotion}>
                  <Heart className="text-rose-500" size={20} />
                </PulsingIcon>
              )}
              <CompletionCheckmark
                isVisible={!!habit.why}
                sectionIndex={0}
                shouldAnimate={shouldAnimate ?? false}
                reduceMotion={reduceMotion}
              />
            </View>
            <View className="flex-1">
              {habit.why ? (
                <>
                  <Text className="mb-1 font-semibold text-stone-800">Your Why</Text>
                  <Text className="text-sm text-stone-600">"{habit.why}"</Text>
                </>
              ) : (
                <>
                  <View className="mb-1 flex-row items-center justify-between">
                    <Text className="font-semibold text-stone-800">Your Why</Text>
                    <View className="flex-row items-center gap-1">
                      <Plus className="text-rose-600" size={12} />
                      <Text className="text-xs font-medium text-rose-600">Set up</Text>
                    </View>
                  </View>
                  <Text className="text-sm text-stone-500">
                    Define your deeper motivation
                  </Text>
                </>
              )}
            </View>
          </View>
        </SectionCard>
      </AnimatedSection>

      {/* Your Identity Section - Index 1 */}
      <AnimatedSection index={1} shouldAnimate={shouldAnimate} reduceMotion={reduceMotion}>
        <SectionCard
          accessibilityLabel={habitIdentity ? 'Edit your identity' : 'Add your identity'}
          onPress={onOpenIdentityEditor}
          className="border-l-4 border-violet-400"
        >
          <View className="flex-row items-start gap-3">
            <View className="relative h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
              {habitIdentity ? (
                <Sparkles className="text-violet-500" size={20} />
              ) : (
                <PulsingIcon reduceMotion={reduceMotion}>
                  <Sparkles className="text-violet-500" size={20} />
                </PulsingIcon>
              )}
              <CompletionCheckmark
                isVisible={!!habitIdentity}
                sectionIndex={1}
                shouldAnimate={shouldAnimate ?? false}
                reduceMotion={reduceMotion}
              />
            </View>
            <View className="flex-1">
              {habitIdentity ? (
                <>
                  <View className="mb-1 flex-row items-center gap-2">
                    <Text className="font-semibold text-stone-800">Your Identity</Text>
                    <View className="rounded-full bg-violet-100 px-2 py-0.5">
                      <Text className="text-[10px] font-medium text-violet-700">Most powerful</Text>
                    </View>
                  </View>
                  <Text className="text-sm text-stone-600">"I am {habitIdentity}"</Text>
                </>
              ) : (
                <>
                  <View className="mb-1 flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                      <Text className="font-semibold text-stone-800">Your Identity</Text>
                      <View className="rounded-full bg-violet-100 px-2 py-0.5">
                        <Text className="text-[10px] font-medium text-violet-700">Most powerful</Text>
                      </View>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <Plus className="text-violet-600" size={12} />
                      <Text className="text-xs font-medium text-violet-600">Set up</Text>
                    </View>
                  </View>
                  <Text className="text-sm text-stone-500">
                    Who are you becoming?
                  </Text>
                </>
              )}
            </View>
          </View>
        </SectionCard>
      </AnimatedSection>

      {/* Your Cue Section - Index 2 */}
      <AnimatedSection index={2} shouldAnimate={shouldAnimate} reduceMotion={reduceMotion}>
        <SectionCard
          accessibilityLabel={hasCue ? 'Edit your cue' : 'Add a cue'}
          onPress={onOpenCueEditor}
          className="border-l-4 border-amber-400"
        >
          <View className="flex-row items-start gap-3">
            <View className="relative h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
              {hasCue ? (
                <Target className="text-amber-500" size={20} />
              ) : (
                <PulsingIcon reduceMotion={reduceMotion}>
                  <Target className="text-amber-500" size={20} />
                </PulsingIcon>
              )}
              <CompletionCheckmark
                isVisible={hasCue}
                sectionIndex={2}
                shouldAnimate={shouldAnimate ?? false}
                reduceMotion={reduceMotion}
              />
            </View>
            <View className="flex-1">
              {hasCue ? (
                <>
                  <Text className="mb-1 font-semibold text-stone-800">Your Cue</Text>
                  {habitCueAfterBehavior && (
                    <Text className="text-sm text-stone-600">
                      After I {habitCueAfterBehavior}, I will {habit.name}
                    </Text>
                  )}
                  {(habitCueLocation || habitCueTime) && (
                    <View className="mt-2 flex-row flex-wrap gap-2">
                      {habitCueLocation && (
                        <View className="flex-row items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5">
                          <MapPin className="text-amber-500" size={12} />
                          <Text className="text-xs text-amber-700">{habitCueLocation}</Text>
                        </View>
                      )}
                      {habitCueTime && (
                        <View className="flex-row items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5">
                          <Clock className="text-amber-500" size={12} />
                          <Text className="text-xs text-amber-700">{habitCueTime}</Text>
                        </View>
                      )}
                    </View>
                  )}
                </>
              ) : (
                <>
                  <View className="mb-1 flex-row items-center justify-between">
                    <Text className="font-semibold text-stone-800">Your Cue</Text>
                    <View className="flex-row items-center gap-1">
                      <Plus className="text-amber-600" size={12} />
                      <Text className="text-xs font-medium text-amber-600">Set up</Text>
                    </View>
                  </View>
                  <Text className="text-sm text-stone-500">
                    Link this habit to an existing routine
                  </Text>
                  {/* T3.2: Helpful tip for empty Cue section */}
                  <View className="mt-2 flex-row items-center gap-1.5 rounded-lg bg-amber-50 px-2 py-1.5">
                    <Lightbulb className="text-amber-600" size={12} />
                    <Text className="flex-1 text-xs text-amber-700">
                      Habits with cues are 2x more likely to stick
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </SectionCard>
      </AnimatedSection>

      {/* Vision Board Section - Index 3 */}
      <AnimatedSection index={3} shouldAnimate={shouldAnimate} reduceMotion={reduceMotion}>
        <SectionCard>
          <View className="mb-3 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Eye className="text-stone-500" size={18} />
              <Text className="font-semibold text-stone-800">Vision Board</Text>
            </View>
            <Pressable
              accessibilityLabel="Add vision board card"
              accessibilityRole="button"
              className="rounded-full bg-violet-600 px-3 py-1.5 active:bg-violet-700"
              onPress={() => onOpenVisionBoardEditor()}
            >
              <Text className="text-xs font-semibold text-white">+ Add</Text>
            </Pressable>
          </View>
          {visionBoardItems.length === 0 ? (
            <LinearGradient
              colors={['#faf5ff', '#f3e8ff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="items-center rounded-xl py-6"
            >
              <PulsingIcon reduceMotion={reduceMotion}>
                <Eye className="mb-2 text-violet-300" size={28} />
              </PulsingIcon>
              <Text className="text-center text-sm text-stone-500">
                What are you building toward?
              </Text>
              <View className="mt-2 flex-row items-center gap-1">
                <Plus className="text-violet-600" size={12} />
                <Text className="text-xs font-medium text-violet-600">Add a vision</Text>
              </View>
            </LinearGradient>
          ) : (
            <View className="gap-3">
              {visionBoardItems.slice(0, 2).map((item, index) => (
                <AnimatedPressableCard
                  key={item._id}
                  accessibilityLabel={`Preview vision card ${item.title}. Tap to view full screen.`}
                  className="rounded-xl border border-stone-100 bg-stone-50/50 p-4"
                  onLongPress={() => onConfirmDeleteVisionBoardItem(item)}
                  onPress={() => onOpenVisionBoardPreview(index)}
                  reduceMotion={reduceMotion}
                >
                  <Text className="text-sm font-semibold text-stone-800">{item.title}</Text>
                  {item.body && (
                    <Text className="mt-1 text-sm leading-5 text-stone-600" numberOfLines={3}>
                      {item.body}
                    </Text>
                  )}
                  <Text className="mt-2 text-xs text-stone-400">Tap to preview</Text>
                </AnimatedPressableCard>
              ))}
              {visionBoardItems.length > 2 && (
                <Pressable
                  accessibilityLabel="View all vision board cards"
                  accessibilityRole="button"
                  className="items-center rounded-xl border border-dashed border-stone-200 bg-white py-3 active:bg-stone-50"
                  onPress={() => onSetVisionBoardListOpen(true)}
                >
                  <Text className="text-sm font-medium text-stone-600">
                    View all ({visionBoardItems.length})
                  </Text>
                </Pressable>
              )}
            </View>
          )}
        </SectionCard>
      </AnimatedSection>

      {/* Affirmations Section - Index 4 - T4.2: Shuffle feature */}
      <AnimatedSection index={4} shouldAnimate={shouldAnimate} reduceMotion={reduceMotion}>
        <AffirmationsSection
          affirmations={affirmations}
          affirmationFlipAnim={affirmationFlipAnim}
          shuffledAffirmationIndex={shuffledAffirmationIndex}
          onShuffleAffirmation={onShuffleAffirmation}
          onOpenAffirmationEditor={onOpenAffirmationEditor}
          onConfirmDeleteAffirmation={onConfirmDeleteAffirmation}
          onSetAffirmationsListOpen={onSetAffirmationsListOpen}
          reduceMotion={reduceMotion}
        />
      </AnimatedSection>

      {/* Mental Exercises Section - Index 5 */}
      <AnimatedSection index={5} shouldAnimate={shouldAnimate} reduceMotion={reduceMotion}>
        <SectionCard>
          <View className="mb-3 flex-row items-center gap-2">
            <Brain className="text-stone-500" size={18} />
            <Text className="font-semibold text-stone-800">Mental Exercises</Text>
          </View>
          <Text className="mb-4 text-sm text-stone-500">
            Science-backed techniques to strengthen your resolve.
          </Text>
          <View className="gap-3">
            <Pressable
              accessibilityLabel="Open mental contrasting exercise"
              accessibilityRole="button"
              className="flex-row items-center justify-between rounded-xl border border-stone-100 bg-gradient-to-r from-cyan-50 to-teal-50 p-4 active:opacity-80"
              onPress={onOpenVisualizationExercise}
            >
              <View className="flex-row items-center gap-3">
                <Text className="text-xl">🎯</Text>
                <Text className="text-sm font-medium text-stone-700">Mental Contrasting</Text>
              </View>
              <ChevronRight className="text-stone-400" size={18} />
            </Pressable>
            <Pressable
              accessibilityLabel="Open visualization guide"
              accessibilityRole="button"
              className="flex-row items-center justify-between rounded-xl border border-stone-100 bg-gradient-to-r from-indigo-50 to-blue-50 p-4 active:opacity-80"
              onPress={onOpenVisualizationGuide}
            >
              <View className="flex-row items-center gap-3">
                <Text className="text-xl">✨</Text>
                <Text className="text-sm font-medium text-stone-700">Visualization Guide</Text>
              </View>
              <ChevronRight className="text-stone-400" size={18} />
            </Pressable>
          </View>
        </SectionCard>
      </AnimatedSection>

      {/* Notes Section - Index 6 - Story 1.9.3 */}
      <AnimatedSection index={6} shouldAnimate={shouldAnimate} reduceMotion={reduceMotion}>
        <HabitNotesSection
          notes={habitNotes}
          onAddNote={onAddNote}
          onEditNote={onEditNote}
          onViewAll={onViewAllNotes}
        />
      </AnimatedSection>
    </View>
  );
}
