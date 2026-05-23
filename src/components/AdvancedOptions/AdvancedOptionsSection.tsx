/* eslint-disable max-lines */
/** AdvancedOptionsSection — consolidated per-habit Advanced controls. */
import { type ReactNode, useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInUp,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ChevronDown, Sprout, Target } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { ALGORITHM_COPY } from '@/components/AlgorithmPicker';
import {
  useUserCustomProgressEmojis,
  useUserDefaultProgressEmojis,
} from '@/hooks/useProgressEmojis';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '@/theme/ThemeContext';
import { fontWeights, typography } from '@/theme/typography';
import { shadows } from '@/theme/spacing';
import { durations, enterEasing } from '@/theme/animations';
import {
  CUSTOM_PRESET_ID,
  matchPresetId,
  PROGRESS_EMOJI_PRESETS,
  resolveProgressEmojis,
} from '@/utils/progressEmojis';
import { getGrowthTypeMeta } from '@/utils/growthTypeMeta';
import { StrengthCurvePickerModal } from '@/screens/StrengthCurvePicker';
import { MODE_STYLES } from '@/screens/StrengthCurvePicker/strengthCurveModeStyles';
import { AdvancedOptionRow } from './AdvancedOptionRow';
import { AdvancedSheet } from './AdvancedSheet';
import { GrowthIconsSheetBody } from './GrowthIconsSheetBody';
import { StreakGoalSheetBody } from './StreakGoalSheetBody';
import type { AdvancedOptionsSectionProps } from './AdvancedOptions.types';

type SheetKey = 'algorithm' | 'growth' | 'streak' | null;

// eslint-disable-next-line max-lines-per-function
export function AdvancedOptionsSection({
  growthType,
  strengthAlgorithm,
  progressEmojis,
  streakGoal,
  onStrengthAlgorithmChange,
  onProgressEmojisChange,
  onStreakGoalChange,
  baseDelay = 320,
  onExpand,
}: AdvancedOptionsSectionProps) {
  const { colors } = useThemeColors();
  const reduceMotion = useReduceMotion();
  const userDefaultEmojis = useUserDefaultProgressEmojis();
  const savedCustomEmojis = useUserCustomProgressEmojis();
  const [expanded, setExpanded] = useState(false);
  const [openSheet, setOpenSheet] = useState<SheetKey>(null);
  const chevron = useSharedValue(180);
  const duration = reduceMotion ? 0 : 200;

  useEffect(() => {
    chevron.value = withTiming(expanded ? 180 : 0, { duration });
  }, [expanded, duration, chevron]);

  useEffect(() => {
    if (!expanded || !onExpand) return;
    // Wait for the expanded body's LinearTransition layout to settle before scrolling.
    const t = setTimeout(onExpand, reduceMotion ? 0 : 240);
    return () => clearTimeout(t);
  }, [expanded, onExpand, reduceMotion]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevron.value}deg` }],
  }));

  const toggle = () => {
    void Haptics.selectionAsync();
    setExpanded((v) => !v);
  };

  const algoEntry = ALGORITHM_COPY[strengthAlgorithm];
  const algoStyle = MODE_STYLES[strengthAlgorithm];
  const AlgoIcon = algoStyle.Icon;
  const algoSubtitle = `${algoEntry.name} · ~${algoEntry.daysToForm}-day build`;
  const growthMeta = getGrowthTypeMeta(growthType);

  const resolvedEmojis = resolveProgressEmojis(progressEmojis, userDefaultEmojis);
  const presetId = matchPresetId(resolvedEmojis, savedCustomEmojis);
  const presetLabel =
    presetId === CUSTOM_PRESET_ID
      ? 'Custom'
      : (PROGRESS_EMOJI_PRESETS.find((p) => p.id === presetId)?.label ??
        'Custom');
  const streakSubtitle =
    streakGoal > 0 ? `${streakGoal}-day goal` : 'No goal set';

  return (
    <>
      <Animated.View
        className='mt-6 px-6'
        entering={FadeInUp.delay(baseDelay + 40).duration(durations.enter).easing(enterEasing)}
        layout={reduceMotion ? undefined : LinearTransition.duration(220)}
      >
        <View
          style={{
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.cardBorder,
            borderRadius: 16,
            ...shadows.subtle,
          }}
        >
        <Pressable
          accessibilityLabel='More to customize, 3 options'
          accessibilityRole='button'
          accessibilityState={{ expanded }}
          className='px-4 py-3.5'
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
          })}
          onPress={toggle}
        >
          <View className='items-center'>
            <Text
              className='uppercase'
              style={{
                ...typography.caption,
                fontSize: 12,
                fontWeight: fontWeights.semibold,
                letterSpacing: 0.5,
                color: colors.text.secondary,
              }}
            >
              More to customize
            </Text>
          </View>
          <View className='mt-3 flex-row flex-wrap justify-center gap-2'>
            <PreviewChip
              backgroundColor={algoStyle.iconTileBackground}
              foregroundColor={algoStyle.iconColor}
              icon={
                <AlgoIcon
                  color={algoStyle.iconColor}
                  size={12}
                  strokeWidth={2.5}
                />
              }
              label={algoEntry.name}
            />
            <PreviewChip
              backgroundColor={colors.primary[100]}
              foregroundColor={colors.primary[700]}
              icon={<Text style={{ fontSize: 12 }}>{resolvedEmojis.starting}</Text>}
              label={presetLabel}
            />
            <PreviewChip
              backgroundColor={colors.status.streakLight}
              foregroundColor={colors.status.streakText}
              icon={
                <Target
                  color={colors.status.streakText}
                  size={12}
                  strokeWidth={2.5}
                />
              }
              label={streakGoal > 0 ? `${streakGoal}-day` : 'No goal set'}
            />
          </View>
          <View
            className='mt-4 flex-row items-center justify-center gap-1.5 rounded-xl py-3'
            style={{ backgroundColor: colors.primary[600] }}
          >
            <Text
              className='uppercase'
              style={{
                ...typography.caption,
                fontSize: 13,
                fontWeight: fontWeights.bold,
                letterSpacing: 0.5,
                color: '#FFFFFF',
              }}
            >
              {expanded ? 'Hide options' : 'Customize'}
            </Text>
            <Animated.View style={chevronStyle}>
              <ChevronDown color='#FFFFFF' size={iconSizes.small} strokeWidth={2.5} />
            </Animated.View>
          </View>
        </Pressable>
        {expanded ? (
          <Animated.View
            className='px-4 pb-3 pt-1'
            entering={reduceMotion ? undefined : FadeIn.duration(160)}
            exiting={reduceMotion ? undefined : FadeOut.duration(120)}
          >
            <Text
              style={{
                ...typography.caption,
                color: colors.text.tertiary,
                marginBottom: growthMeta ? 8 : 4,
              }}
            >
              Tap any option below to customize how this habit grows.
            </Text>
            {growthMeta ? (
              <View
                accessibilityLabel={`Growth Type: ${growthMeta.label}`}
                className='mb-1 flex-row items-center self-start rounded-full px-3 py-1.5'
                style={{
                  backgroundColor: growthMeta.pillBg,
                }}
              >
                <Sprout
                  color={growthMeta.pillFg}
                  size={14}
                  strokeWidth={2.5}
                />
                <Text
                  style={{
                    ...typography.caption,
                    fontSize: 12,
                    fontWeight: fontWeights.semibold,
                    color: growthMeta.pillFg,
                    marginLeft: 6,
                  }}
                >
                  Growth Type · {growthMeta.label} · ~{growthMeta.days}-day build
                </Text>
              </View>
            ) : null}
            <AdvancedOptionRow
              isFirst
              accessibilityHint='Opens strength curve picker'
              description="How your habit's strength grows and resets when you miss days."
              icon={
                <AlgoIcon
                  color={colors.primary[700]}
                  size={iconSizes.small}
                  strokeWidth={2}
                />
              }
              iconBackground={colors.surface}
              subtitle={algoSubtitle}
              title='Strength Curve'
              onPress={() => setOpenSheet('algorithm')}
            />
            <AdvancedOptionRow
              accessibilityHint='Opens growth icons picker'
              description="The 5-stage emoji progression shown on your habit's strength bar."
              icon={
                <Text style={{ fontSize: 18 }}>{resolvedEmojis.starting}</Text>
              }
              iconBackground={colors.surface}
              subtitle={`${presetLabel} · 5 stages`}
              title='Growth Icons'
              onPress={() => setOpenSheet('growth')}
            />
            <AdvancedOptionRow
              accessibilityHint='Opens streak goal picker'
              description="A motivational target — purely visual, no penalty if you miss it."
              icon={
                <Target
                  color={colors.primary[700]}
                  size={iconSizes.small}
                  strokeWidth={2}
                />
              }
              iconBackground={colors.surface}
              subtitle={streakSubtitle}
              title='Streak Goal'
              onPress={() => setOpenSheet('streak')}
            />
          </Animated.View>
        ) : null}
        </View>
      </Animated.View>

      <StrengthCurvePickerModal
        selected={strengthAlgorithm}
        visible={openSheet === 'algorithm'}
        onClose={() => setOpenSheet(null)}
        onSelect={onStrengthAlgorithmChange}
      />

      <AdvancedSheet
        subtitle='Five stages, one for every 20% of strength. Pick a theme or customize any stage.'
        title='Growth Icons'
        visible={openSheet === 'growth'}
        onClose={() => setOpenSheet(null)}
      >
        <View style={{ maxHeight: 520 }}>
          <GrowthIconsSheetBody
            fallback={userDefaultEmojis}
            value={progressEmojis}
            onChange={onProgressEmojisChange}
          />
        </View>
      </AdvancedSheet>

      <AdvancedSheet
        subtitle='Set a streak length to aim for.'
        title='Streak Goal'
        visible={openSheet === 'streak'}
        onClose={() => setOpenSheet(null)}
      >
        <StreakGoalSheetBody
          streakGoal={streakGoal}
          onStreakGoalChange={onStreakGoalChange}
        />
      </AdvancedSheet>
    </>
  );
}

interface PreviewChipProps {
  icon: ReactNode;
  label: string;
  backgroundColor: string;
  foregroundColor: string;
}

function PreviewChip({
  icon,
  label,
  backgroundColor,
  foregroundColor,
}: PreviewChipProps) {
  return (
    <View
      className='flex-row items-center gap-1 rounded-full px-2.5 py-1'
      style={{ backgroundColor }}
    >
      {icon}
      <Text
        style={{
          ...typography.caption,
          fontSize: 11,
          fontWeight: fontWeights.semibold,
          color: foregroundColor,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
