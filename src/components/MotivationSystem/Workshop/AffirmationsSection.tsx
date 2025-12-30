/**
 * AffirmationsSection Component
 * Positive self-talk cards for daily reinforcement
 *
 * Part of the Motivation System Workshop tab
 * Story T13.2-T13.5: Affirmations feature
 *
 * Scientific Basis:
 * - Self-affirmation theory (Steele, 1988): Reduces defensive processing
 * - Sports psychology self-talk (Hatzigeorgiadis et al., 2011): Performance enhancement
 * - Repetition builds neural pathways for positive thought patterns
 *
 * Business Model:
 * - Free: 2 affirmations per habit
 * - Premium: Unlimited affirmations + type categorization
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import {
  Sparkles,
  Plus,
  Check,
  X,
  Edit2,
  Trash2,
  MessageSquareQuote,
  User,
  Zap,
  BookOpen,
  Bell,
  BellOff,
  Clock,
} from 'lucide-react-native';
import {
  formatDaysOfWeek,
  getNextAffirmationDeliveryRelativeTime,
} from '@/utils/notifications';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';
import {
  PulsingIcon,
  CompletionCheckmark,
  SPRING_BUTTON,
  SPRING_GENTLE,
  STAGGER_DELAY,
} from '../../animations';
import { AffirmationScheduleModal } from './AffirmationScheduleModal';
import { GenerateAffirmationsButton } from './GenerateAffirmationsButton';

// Affirmation types for categorization
export type AffirmationType = 'identity' | 'motivational' | 'instructional';

// Frequency types for scheduled delivery
export type AffirmationFrequency = 'daily' | 'weekly';

export interface AffirmationData {
  id: string;
  text: string;
  type?: AffirmationType;
  createdAt: number;
  // Scheduled delivery fields (premium)
  scheduledTime?: string; // "HH:MM" 24-hour format
  frequency?: AffirmationFrequency;
  daysOfWeek?: number[];
  isScheduleEnabled?: boolean;
}

export interface AffirmationScheduleConfig {
  scheduledTime: string;
  frequency: AffirmationFrequency;
  daysOfWeek?: number[];
  isScheduleEnabled: boolean;
}

export interface AffirmationsSectionProps {
  /** List of existing affirmations */
  affirmations: AffirmationData[];
  /** Number of affirmations (for analytics and gating) */
  affirmationCount: number;
  /** Whether user has premium access */
  isPremium: boolean;
  /** Callback when a new affirmation is saved */
  onSaveAffirmation: (text: string, type?: AffirmationType) => Promise<void>;
  /** Callback when an affirmation is updated */
  onUpdateAffirmation: (
    id: string,
    text: string,
    type?: AffirmationType
  ) => Promise<void>;
  /** Callback when an affirmation is deleted */
  onDeleteAffirmation: (id: string) => Promise<void>;
  /** Callback when schedule is configured (premium) */
  onScheduleAffirmation?: (
    id: string,
    schedule: AffirmationScheduleConfig
  ) => Promise<void>;
  /** Callback when schedule is cancelled */
  onCancelSchedule?: (id: string) => Promise<void>;
  /** Callback for AI generation (premium) */
  onGenerateAffirmations?: () => Promise<void>;
  /** Whether AI generation is in progress */
  isGenerating?: boolean;
  /** Whether habit has context for better AI generation (why, identity, viz) */
  hasHabitContext?: boolean;
  /** Callback when user hits premium limit */
  onPremiumRequired: () => void;
  /** Whether to run entrance animations */
  shouldAnimate?: boolean;
  /** Whether to skip animations for accessibility */
  reduceMotion?: boolean;
  /** Section index for staggered animation timing */
  sectionIndex?: number;
}

// Content limits (matching Convex validation)
const MAX_TEXT_LENGTH = 200;

// Free tier limit
const FREE_TIER_MAX_AFFIRMATIONS = 2;

// Type configuration for styling and labels
const TYPE_CONFIG: Record<
  AffirmationType,
  {
    label: string;
    description: string;
    icon: typeof User;
    bgColor: string;
    textColor: string;
    selectedBg: string;
  }
> = {
  identity: {
    bgColor: 'bg-amber-100',
    description: '"I am someone who..."',
    icon: User,
    label: 'Identity',
    selectedBg: 'bg-amber-500',
    textColor: 'text-amber-700',
  },
  instructional: {
    bgColor: 'bg-yellow-100',
    description: '"Progress, not perfection"',
    icon: BookOpen,
    label: 'Instructional',
    selectedBg: 'bg-yellow-500',
    textColor: 'text-yellow-700',
  },
  motivational: {
    bgColor: 'bg-orange-100',
    description: '"I can do hard things"',
    icon: Zap,
    label: 'Motivational',
    selectedBg: 'bg-orange-500',
    textColor: 'text-orange-700',
  },
};

/**
 * SectionCard Component for consistent styling with press animation
 */
function SectionCard({
  children,
  className,
  onPress,
  accessibilityLabel,
  disabled,
}: {
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
  accessibilityLabel?: string;
  disabled?: boolean;
}) {
  const scale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.08);
  const elevation = useSharedValue(2);

  const animatedStyle = useAnimatedStyle(() => ({
    elevation: elevation.value,
    shadowOffset: {
      height: interpolate(elevation.value, [1, 2], [1, 2]),
      width: 0,
    },
    shadowOpacity: shadowOpacity.value,
    shadowRadius: interpolate(elevation.value, [1, 2], [2, 4]),
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    'worklet';
    scale.value = withSpring(0.98, SPRING_BUTTON);
    shadowOpacity.value = withSpring(0.04, SPRING_BUTTON);
    elevation.value = withSpring(1, SPRING_BUTTON);
  }, [scale, shadowOpacity, elevation]);

  const handlePressOut = useCallback(() => {
    'worklet';
    scale.value = withSpring(1, SPRING_BUTTON);
    shadowOpacity.value = withSpring(0.08, SPRING_BUTTON);
    elevation.value = withSpring(2, SPRING_BUTTON);
  }, [scale, shadowOpacity, elevation]);

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  }, [onPress]);

  if (onPress) {
    return (
      <Animated.View style={[animatedStyle, { shadowColor: '#78716c' }]}>
        <Pressable
          accessibilityLabel={accessibilityLabel}
          accessibilityRole='button'
          accessibilityState={{ disabled }}
          className={clsx('rounded-2xl bg-white p-4', className)}
          disabled={disabled}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          {children}
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <View
      className={clsx(
        'rounded-2xl bg-white p-4 shadow-sm shadow-stone-200/50',
        className
      )}
    >
      {children}
    </View>
  );
}

/**
 * AnimatedSection Component for staggered entrance animations
 */
function AnimatedSection({
  children,
  index,
  shouldAnimate,
  reduceMotion = false,
}: {
  children: React.ReactNode;
  index: number;
  shouldAnimate: boolean;
  reduceMotion?: boolean;
}) {
  const INITIAL_TRANSLATE_Y = 24;

  const translateY = useSharedValue(
    shouldAnimate && !reduceMotion ? INITIAL_TRANSLATE_Y : 0
  );
  const opacity = useSharedValue(shouldAnimate && !reduceMotion ? 0 : 1);

  useEffect(() => {
    if (!shouldAnimate || reduceMotion) {
      translateY.value = 0;
      opacity.value = 1;
      return;
    }

    const delay = index * STAGGER_DELAY;

    const timeout = setTimeout(() => {
      translateY.value = withSpring(0, SPRING_GENTLE);
      opacity.value = withTiming(1, { duration: 300 });
    }, delay);

    return () => clearTimeout(timeout);
  }, [shouldAnimate, reduceMotion, index, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

/**
 * TypeSelector Component
 * Allows user to select affirmation type (identity/motivational/instructional)
 */
function TypeSelector({
  selectedType,
  onSelectType,
  isPremium,
}: {
  selectedType?: AffirmationType;
  onSelectType: (type?: AffirmationType) => void;
  isPremium: boolean;
}) {
  return (
    <View className='gap-2'>
      <Text className='mb-1 text-xs font-semibold uppercase tracking-wide text-stone-400'>
        Type {!isPremium && '(Premium)'}
      </Text>
      <View className='flex-row gap-2'>
        {(Object.keys(TYPE_CONFIG) as AffirmationType[]).map((type) => {
          const config = TYPE_CONFIG[type];
          const isSelected = selectedType === type;
          const IconComponent = config.icon;

          return (
            <Pressable
              key={type}
              accessibilityLabel={`${config.label} affirmation type`}
              accessibilityRole='radio'
              accessibilityState={{ selected: isSelected }}
              className={clsx(
                'flex-1 flex-row items-center justify-center gap-1.5 rounded-lg border-2 px-2 py-2',
                isSelected
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-stone-200 bg-white',
                !isPremium && 'opacity-50'
              )}
              disabled={!isPremium}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onSelectType(isSelected ? undefined : type);
              }}
            >
              <View
                className={clsx(
                  'h-6 w-6 items-center justify-center rounded-full',
                  isSelected ? config.selectedBg : config.bgColor
                )}
              >
                <IconComponent
                  className={isSelected ? 'text-white' : config.textColor}
                  size={12}
                />
              </View>
              <Text
                className={clsx(
                  'text-xs font-medium',
                  isSelected ? 'text-amber-700' : 'text-stone-600'
                )}
              >
                {config.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/**
 * AffirmationEditorModal Component
 * Modal for writing/editing an affirmation
 */
function AffirmationEditorModal({
  visible,
  onClose,
  onSave,
  initialText,
  initialType,
  isEditing,
  isSaving,
  isPremium,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (text: string, type?: AffirmationType) => Promise<void>;
  initialText?: string;
  initialType?: AffirmationType;
  isEditing: boolean;
  isSaving: boolean;
  isPremium: boolean;
}) {
  const [text, setText] = useState(initialText ?? '');
  const [type, setType] = useState<AffirmationType | undefined>(initialType);

  // Reset form when modal opens
  useEffect(() => {
    if (visible) {
      setText(initialText ?? '');
      setType(initialType);
    }
  }, [visible, initialText, initialType]);

  const canSave =
    text.trim().length >= 3 && text.trim().length <= MAX_TEXT_LENGTH;

  const handleSave = useCallback(async () => {
    if (!canSave || isSaving) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Keyboard.dismiss();
    try {
      await onSave(text.trim(), isPremium ? type : undefined);
      onClose();
    } catch (error) {
      console.error('Failed to save affirmation:', error);
    }
  }, [canSave, isSaving, text, type, isPremium, onSave, onClose]);

  // Example affirmations for inspiration
  const examples = [
    'I am capable of achieving my goals',
    'Every small step counts',
    'I choose progress over perfection',
    'I am becoming the person I want to be',
  ];

  return (
    <Modal
      animationType='slide'
      presentationStyle='pageSheet'
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1 bg-white'
      >
        {/* Header */}
        <View className='flex-row items-center justify-between border-b border-stone-100 px-4 pb-4 pt-6'>
          <View className='flex-row items-center gap-3'>
            <View className='h-10 w-10 items-center justify-center rounded-xl bg-amber-100'>
              <Sparkles className='text-amber-600' size={20} />
            </View>
            <View>
              <Text className='text-lg font-bold text-stone-800'>
                {isEditing ? 'Edit Affirmation' : 'Add Affirmation'}
              </Text>
              <Text className='text-xs text-stone-500'>
                Positive self-talk for daily reinforcement
              </Text>
            </View>
          </View>
          <Pressable
            accessibilityLabel='Close'
            className='h-10 w-10 items-center justify-center rounded-full bg-stone-100'
            onPress={onClose}
          >
            <X className='text-stone-500' size={20} />
          </Pressable>
        </View>

        <ScrollView
          className='flex-1'
          contentContainerClassName='p-4 pb-8'
          keyboardShouldPersistTaps='handled'
        >
          {/* Science callout */}
          <View className='mb-4 flex-row items-start gap-2 rounded-xl bg-amber-50 p-3'>
            <Sparkles className='mt-0.5 text-amber-500' size={16} />
            <Text className='flex-1 text-xs leading-relaxed text-amber-700'>
              Self-affirmations reduce stress and defensiveness while enhancing
              openness to change. Repeat them daily for best results.
            </Text>
          </View>

          {/* Text input */}
          <View className='mb-4'>
            <Text className='mb-2 text-xs font-semibold uppercase tracking-wide text-stone-400'>
              Your Affirmation
            </Text>
            <TextInput
              multiline
              accessibilityLabel='Affirmation text'
              className='min-h-[100px] rounded-xl border-2 border-amber-200 bg-white px-4 py-3 text-base text-stone-800'
              maxLength={MAX_TEXT_LENGTH}
              placeholder="e.g., 'I am capable of achieving my goals'"
              placeholderTextColor='#a8a29e'
              textAlignVertical='top'
              value={text}
              onChangeText={setText}
            />
            <View className='mt-2 flex-row items-center justify-between'>
              <Text className='text-xs text-stone-400'>
                {text.length < 3
                  ? `${3 - text.length} more characters needed`
                  : ''}
              </Text>
              <Text
                className={clsx(
                  'text-xs font-semibold',
                  text.length >= MAX_TEXT_LENGTH
                    ? 'text-rose-500'
                    : text.length >= MAX_TEXT_LENGTH * 0.9
                      ? 'text-amber-500'
                      : 'text-stone-400'
                )}
              >
                {text.length}/{MAX_TEXT_LENGTH}
              </Text>
            </View>
          </View>

          {/* Type selector (premium only) */}
          <View className='mb-4'>
            <TypeSelector
              isPremium={isPremium}
              selectedType={type}
              onSelectType={setType}
            />
          </View>

          {/* Example affirmations */}
          <View className='mt-2'>
            <Text className='mb-3 text-xs font-semibold uppercase tracking-wide text-stone-400'>
              Examples for Inspiration
            </Text>
            <View className='gap-2'>
              {examples.map((example, index) => (
                <Pressable
                  key={index}
                  className='flex-row items-start gap-2 rounded-lg bg-stone-50 px-3 py-2'
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setText(example);
                  }}
                >
                  <MessageSquareQuote
                    className='mt-0.5 text-amber-400'
                    size={14}
                  />
                  <Text className='flex-1 text-sm italic text-stone-600'>
                    "{example}"
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Footer with save button */}
        <View className='border-t border-stone-100 px-4 pb-8 pt-4'>
          <Pressable
            accessibilityLabel={isEditing ? 'Save changes' : 'Add affirmation'}
            accessibilityRole='button'
            accessibilityState={{ disabled: !canSave || isSaving }}
            className={clsx(
              'flex-row items-center justify-center gap-2 rounded-xl py-4',
              canSave && !isSaving ? 'bg-amber-500' : 'bg-stone-200'
            )}
            disabled={!canSave || isSaving}
            onPress={handleSave}
          >
            {isEditing ? (
              <Check
                className={
                  canSave && !isSaving ? 'text-white' : 'text-stone-400'
                }
                size={20}
              />
            ) : (
              <Plus
                className={
                  canSave && !isSaving ? 'text-white' : 'text-stone-400'
                }
                size={20}
              />
            )}
            <Text
              className={clsx(
                'text-base font-semibold',
                canSave && !isSaving ? 'text-white' : 'text-stone-400'
              )}
            >
              {isSaving
                ? 'Saving...'
                : isEditing
                  ? 'Save Changes'
                  : 'Add Affirmation'}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/**
 * Format time for display (12-hour with AM/PM)
 */
function formatTimeForDisplay(time?: string): string {
  if (!time) return '';
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * AffirmationItem Component
 * Individual affirmation display with edit/delete/schedule actions
 */
function AffirmationItem({
  affirmation,
  onEdit,
  onDelete,
  onSchedule,
  isPremium,
}: {
  affirmation: AffirmationData;
  onEdit: () => void;
  onDelete: () => void;
  onSchedule?: () => void;
  isPremium: boolean;
}) {
  const typeConfig = affirmation.type ? TYPE_CONFIG[affirmation.type] : null;
  const TypeIcon = typeConfig?.icon;
  const hasSchedule =
    affirmation.isScheduleEnabled && affirmation.scheduledTime;

  // Get next delivery time preview
  const nextDelivery =
    hasSchedule && affirmation.scheduledTime && affirmation.frequency
      ? getNextAffirmationDeliveryRelativeTime(
          affirmation.scheduledTime,
          affirmation.frequency,
          affirmation.daysOfWeek
        )
      : null;

  return (
    <View className='rounded-xl bg-amber-50 p-3'>
      <View className='flex-row items-start gap-3'>
        {/* Type badge or default icon */}
        <View
          className={clsx(
            'h-8 w-8 items-center justify-center rounded-full',
            typeConfig ? typeConfig.bgColor : 'bg-amber-100'
          )}
        >
          {TypeIcon ? (
            <TypeIcon className={typeConfig?.textColor} size={14} />
          ) : (
            <MessageSquareQuote className='text-amber-600' size={14} />
          )}
        </View>

        {/* Content */}
        <View className='flex-1'>
          <Text className='text-sm text-stone-700'>"{affirmation.text}"</Text>
          {typeConfig && (
            <Text className={clsx('mt-1 text-xs', typeConfig.textColor)}>
              {typeConfig.label}
            </Text>
          )}
        </View>

        {/* Actions */}
        <View className='flex-row gap-1'>
          {/* Schedule button (premium only) */}
          {isPremium && onSchedule && (
            <Pressable
              accessibilityLabel={
                hasSchedule
                  ? `Scheduled at ${formatTimeForDisplay(affirmation.scheduledTime)}`
                  : 'Schedule delivery'
              }
              className={clsx(
                'h-8 w-8 items-center justify-center rounded-full',
                hasSchedule ? 'bg-emerald-100' : 'bg-white'
              )}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onSchedule();
              }}
            >
              {hasSchedule ? (
                <Bell className='text-emerald-600' size={14} />
              ) : (
                <BellOff className='text-stone-400' size={14} />
              )}
            </Pressable>
          )}
          <Pressable
            accessibilityLabel='Edit affirmation'
            className='h-8 w-8 items-center justify-center rounded-full bg-white'
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onEdit();
            }}
          >
            <Edit2 className='text-stone-400' size={14} />
          </Pressable>
          <Pressable
            accessibilityLabel='Delete affirmation'
            className='h-8 w-8 items-center justify-center rounded-full bg-white'
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onDelete();
            }}
          >
            <Trash2 className='text-rose-400' size={14} />
          </Pressable>
        </View>
      </View>

      {/* Schedule indicator */}
      {hasSchedule && nextDelivery && (
        <View className='mt-2 flex-row items-center gap-1.5 rounded-lg bg-emerald-50 px-2 py-1'>
          <Clock className='text-emerald-500' size={12} />
          <Text className='text-xs text-emerald-700'>
            Next: {nextDelivery}
            {affirmation.frequency === 'weekly' &&
              affirmation.daysOfWeek &&
              ` • ${formatDaysOfWeek(affirmation.daysOfWeek)}`}
          </Text>
        </View>
      )}
    </View>
  );
}

/**
 * AffirmationsList Component
 * Displays list of existing affirmations
 */
function AffirmationsList({
  affirmations,
  onEdit,
  onDelete,
  onSchedule,
  isPremium,
  maxDisplay = 3,
}: {
  affirmations: AffirmationData[];
  onEdit: (affirmation: AffirmationData) => void;
  onDelete: (affirmationId: string) => void;
  onSchedule?: (affirmation: AffirmationData) => void;
  isPremium: boolean;
  maxDisplay?: number;
}) {
  if (affirmations.length === 0) {
    return null;
  }

  const displayAffirmations = affirmations.slice(0, maxDisplay);
  const remainingCount = affirmations.length - maxDisplay;

  // Count scheduled affirmations
  const scheduledCount = affirmations.filter(
    (a) => a.isScheduleEnabled && a.scheduledTime
  ).length;

  return (
    <View className='mt-4 border-t border-stone-100 pt-4'>
      <View className='mb-2 flex-row items-center justify-between'>
        <Text className='text-sm font-medium text-stone-600'>
          Your Affirmations ({affirmations.length})
        </Text>
        {scheduledCount > 0 && isPremium && (
          <View className='flex-row items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5'>
            <Bell className='text-emerald-600' size={10} />
            <Text className='text-xs font-medium text-emerald-700'>
              {scheduledCount} scheduled
            </Text>
          </View>
        )}
      </View>

      <View className='gap-2'>
        {displayAffirmations.map((affirmation) => (
          <AffirmationItem
            key={affirmation.id}
            affirmation={affirmation}
            isPremium={isPremium}
            onDelete={() => onDelete(affirmation.id)}
            onEdit={() => onEdit(affirmation)}
            onSchedule={onSchedule ? () => onSchedule(affirmation) : undefined}
          />
        ))}
        {remainingCount > 0 && (
          <Text className='mt-1 text-center text-xs text-stone-400'>
            +{remainingCount} more
          </Text>
        )}
      </View>
    </View>
  );
}

/**
 * Helper function to get a random affirmation from a list
 * Used in Activation modal to show a random daily affirmation
 */
export function getRandomAffirmation(
  affirmations: AffirmationData[]
): AffirmationData | null {
  if (affirmations.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * affirmations.length);
  return affirmations[randomIndex];
}

/**
 * Helper function to get a random affirmation of a specific type
 * Useful for showing identity-based affirmations in specific contexts
 */
export function getRandomAffirmationByType(
  affirmations: AffirmationData[],
  type: AffirmationType
): AffirmationData | null {
  const filtered = affirmations.filter((a) => a.type === type);
  if (filtered.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}

/**
 * AffirmationsSection - Main component
 *
 * Displays the Affirmations section with:
 * - Empty state: Pulsing sparkle icon with "Add" CTA
 * - Filled state: List of affirmations with edit/delete
 * - Premium gating: 2 free, unlimited premium
 * - Scheduled delivery (premium feature)
 * - Amber accent color (border-l-amber-400)
 */
export function AffirmationsSection({
  affirmations,
  affirmationCount,
  isPremium,
  onSaveAffirmation,
  onUpdateAffirmation,
  onDeleteAffirmation,
  onScheduleAffirmation,
  onCancelSchedule,
  onGenerateAffirmations,
  isGenerating = false,
  hasHabitContext = false,
  onPremiumRequired,
  shouldAnimate = false,
  reduceMotion = false,
  sectionIndex = 0,
}: AffirmationsSectionProps) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingAffirmation, setEditingAffirmation] =
    useState<AffirmationData | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Schedule modal state
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [schedulingAffirmation, setSchedulingAffirmation] =
    useState<AffirmationData | null>(null);
  const [isScheduleSaving, setIsScheduleSaving] = useState(false);

  const hasAffirmations = affirmationCount > 0;
  const canAddMore = isPremium || affirmationCount < FREE_TIER_MAX_AFFIRMATIONS;

  const handleOpenEditor = useCallback(() => {
    if (!canAddMore) {
      onPremiumRequired();
      return;
    }
    setEditingAffirmation(null);
    setIsEditorOpen(true);
  }, [canAddMore, onPremiumRequired]);

  const handleEditAffirmation = useCallback((affirmation: AffirmationData) => {
    setEditingAffirmation(affirmation);
    setIsEditorOpen(true);
  }, []);

  const handleSave = useCallback(
    async (text: string, type?: AffirmationType) => {
      setIsSaving(true);
      try {
        await (editingAffirmation
          ? onUpdateAffirmation(editingAffirmation.id, text, type)
          : onSaveAffirmation(text, type));
      } finally {
        setIsSaving(false);
      }
    },
    [editingAffirmation, onSaveAffirmation, onUpdateAffirmation]
  );

  const handleDelete = useCallback(
    async (affirmationId: string) => {
      try {
        await onDeleteAffirmation(affirmationId);
      } catch (error) {
        console.error('Failed to delete affirmation:', error);
      }
    },
    [onDeleteAffirmation]
  );

  // Schedule handlers
  const handleOpenScheduleModal = useCallback(
    (affirmation: AffirmationData) => {
      if (!isPremium) {
        onPremiumRequired();
        return;
      }
      setSchedulingAffirmation(affirmation);
      setIsScheduleModalOpen(true);
    },
    [isPremium, onPremiumRequired]
  );

  const handleSaveSchedule = useCallback(
    async (schedule: AffirmationScheduleConfig) => {
      if (!schedulingAffirmation || !onScheduleAffirmation) return;
      setIsScheduleSaving(true);
      try {
        await onScheduleAffirmation(schedulingAffirmation.id, schedule);
      } finally {
        setIsScheduleSaving(false);
      }
    },
    [schedulingAffirmation, onScheduleAffirmation]
  );

  const handleCancelSchedule = useCallback(async () => {
    if (!schedulingAffirmation || !onCancelSchedule) return;
    setIsScheduleSaving(true);
    try {
      await onCancelSchedule(schedulingAffirmation.id);
    } finally {
      setIsScheduleSaving(false);
    }
  }, [schedulingAffirmation, onCancelSchedule]);

  const handleSectionPress = useCallback(() => {
    if (!hasAffirmations) {
      handleOpenEditor();
    }
  }, [hasAffirmations, handleOpenEditor]);

  return (
    <>
      <AnimatedSection
        index={sectionIndex}
        reduceMotion={reduceMotion}
        shouldAnimate={shouldAnimate}
      >
        <SectionCard
          accessibilityLabel={
            hasAffirmations ? 'Affirmations' : 'Add your first affirmation'
          }
          className='border-l-4 border-l-amber-400'
          onPress={handleSectionPress}
        >
          <View className='flex-row items-start gap-3'>
            {/* Icon with completion checkmark */}
            <View className='relative h-10 w-10 items-center justify-center rounded-xl bg-amber-100'>
              {hasAffirmations ? (
                <Sparkles className='text-amber-500' size={20} />
              ) : (
                <PulsingIcon reduceMotion={reduceMotion}>
                  <Sparkles className='text-amber-500' size={20} />
                </PulsingIcon>
              )}
              <CompletionCheckmark
                isVisible={hasAffirmations}
                reduceMotion={reduceMotion}
                sectionIndex={sectionIndex}
                shouldAnimate={shouldAnimate}
              />
            </View>

            {/* Content area */}
            <View className='flex-1'>
              <View className='mb-1 flex-row items-center justify-between'>
                <View className='flex-row items-center gap-2'>
                  <Text className='font-semibold text-stone-800'>
                    Affirmations
                  </Text>
                  {!isPremium && (
                    <View className='rounded-full bg-amber-100 px-2 py-0.5'>
                      <Text className='text-xs font-medium text-amber-700'>
                        {affirmationCount}/{FREE_TIER_MAX_AFFIRMATIONS} Free
                      </Text>
                    </View>
                  )}
                </View>
                {!hasAffirmations && (
                  <View className='flex-row items-center gap-1'>
                    <Plus className='text-amber-600' size={12} />
                    <Text className='text-xs font-medium text-amber-600'>
                      Add
                    </Text>
                  </View>
                )}
              </View>

              {/* Description */}
              {!hasAffirmations && (
                <Text className='text-sm text-stone-500'>
                  Positive statements for daily reinforcement
                </Text>
              )}

              {/* Science tip */}
              {!hasAffirmations && (
                <View className='mt-2 flex-row items-start gap-1.5 rounded-lg bg-amber-50 px-2 py-1.5'>
                  <Sparkles className='mt-0.5 text-amber-500' size={12} />
                  <Text className='flex-1 text-xs text-amber-700'>
                    Repetition builds neural pathways for positive thinking
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Action buttons when affirmations exist */}
          {hasAffirmations && canAddMore && (
            <View className='mt-4 gap-3'>
              {/* AI Generate button (Premium) */}
              {onGenerateAffirmations && (
                <GenerateAffirmationsButton
                  currentCount={affirmationCount}
                  hasHabitContext={hasHabitContext}
                  isGenerating={isGenerating}
                  isPremium={isPremium}
                  maxCount={10}
                  reduceMotion={reduceMotion}
                  variant='full'
                  onGenerate={onGenerateAffirmations}
                  onPremiumRequired={onPremiumRequired}
                />
              )}

              {/* Manual add button */}
              <View className='items-center'>
                <Pressable
                  accessibilityLabel='Add a new affirmation'
                  accessibilityRole='button'
                  className='flex-row items-center gap-2 rounded-full bg-amber-500 px-4 py-2'
                  onPress={handleOpenEditor}
                >
                  <Plus className='text-white' size={16} />
                  <Text className='font-medium text-white'>Add Manually</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* Empty state AI Generate + Add */}
          {!hasAffirmations && (
            <View className='mt-4 gap-3'>
              {/* AI Generate button (Premium) */}
              {onGenerateAffirmations && (
                <GenerateAffirmationsButton
                  currentCount={affirmationCount}
                  hasHabitContext={hasHabitContext}
                  isGenerating={isGenerating}
                  isPremium={isPremium}
                  maxCount={10}
                  reduceMotion={reduceMotion}
                  variant='full'
                  onGenerate={onGenerateAffirmations}
                  onPremiumRequired={onPremiumRequired}
                />
              )}
            </View>
          )}

          {/* Premium upsell when at limit */}
          {hasAffirmations && !canAddMore && (
            <View className='mt-4 items-center'>
              <Pressable
                accessibilityLabel='Upgrade to add more affirmations'
                accessibilityRole='button'
                className='flex-row items-center gap-2 rounded-full bg-stone-100 px-4 py-2'
                onPress={onPremiumRequired}
              >
                <Sparkles className='text-amber-500' size={16} />
                <Text className='font-medium text-stone-600'>
                  Upgrade for Unlimited
                </Text>
              </Pressable>
            </View>
          )}

          {/* List of existing affirmations */}
          <AffirmationsList
            affirmations={affirmations}
            isPremium={isPremium}
            onDelete={handleDelete}
            onEdit={handleEditAffirmation}
            onSchedule={
              onScheduleAffirmation ? handleOpenScheduleModal : undefined
            }
          />
        </SectionCard>
      </AnimatedSection>

      {/* Editor Modal */}
      <AffirmationEditorModal
        initialText={editingAffirmation?.text}
        initialType={editingAffirmation?.type}
        isEditing={!!editingAffirmation}
        isPremium={isPremium}
        isSaving={isSaving}
        visible={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSave}
      />

      {/* Schedule Modal (Premium) */}
      {schedulingAffirmation && (
        <AffirmationScheduleModal
          affirmationText={schedulingAffirmation.text}
          initialSchedule={{
            daysOfWeek: schedulingAffirmation.daysOfWeek,
            frequency: schedulingAffirmation.frequency,
            isScheduleEnabled: schedulingAffirmation.isScheduleEnabled,
            scheduledTime: schedulingAffirmation.scheduledTime,
          }}
          isSaving={isScheduleSaving}
          visible={isScheduleModalOpen}
          onCancel={handleCancelSchedule}
          onClose={() => {
            setIsScheduleModalOpen(false);
            setSchedulingAffirmation(null);
          }}
          onSave={handleSaveSchedule}
        />
      )}
    </>
  );
}

export default AffirmationsSection;
