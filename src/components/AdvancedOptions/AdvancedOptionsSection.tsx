/* eslint-disable max-lines */
/** AdvancedOptionsSection — consolidated per-habit Advanced controls. */
import { useEffect, useState } from 'react';
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
import {
  Activity,
  ChevronDown,
  Heart,
  SlidersHorizontal,
  Sprout,
  Target,
  Zap,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { ALGORITHM_COPY } from '@/components/AlgorithmPicker';
import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import {
  useUserCustomProgressEmojis,
  useUserDefaultProgressEmojis,
} from '@/hooks/useProgressEmojis';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '@/theme/ThemeContext';
import { fontWeights, typography } from '@/theme/typography';
import { durations, enterEasing } from '@/theme/animations';
import {
  CUSTOM_PRESET_ID,
  matchPresetId,
  PROGRESS_EMOJI_PRESETS,
  resolveProgressEmojis,
} from '@/utils/progressEmojis';
import { getGrowthTypeMeta } from '@/utils/growthTypeMeta';
import { AdvancedOptionRow } from './AdvancedOptionRow';
import { AdvancedSheet } from './AdvancedSheet';
import { AlgorithmSheetBody } from './AlgorithmSheetBody';
import { GrowthIconsSheetBody } from './GrowthIconsSheetBody';
import { StreakGoalSheetBody } from './StreakGoalSheetBody';
import type { AdvancedOptionsSectionProps } from './AdvancedOptions.types';

const ALGO_ICONS: Record<AlgorithmMode, LucideIcon> = {
  forgiving: Heart,
  balanced: Activity,
  strict: Zap,
};

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
}: AdvancedOptionsSectionProps) {
  const { colors } = useThemeColors();
  const reduceMotion = useReduceMotion();
  const userDefaultEmojis = useUserDefaultProgressEmojis();
  const savedCustomEmojis = useUserCustomProgressEmojis();
  const [expanded, setExpanded] = useState(true);
  const [openSheet, setOpenSheet] = useState<SheetKey>(null);
  const chevron = useSharedValue(180);
  const duration = reduceMotion ? 0 : 200;

  useEffect(() => {
    chevron.value = withTiming(expanded ? 180 : 0, { duration });
  }, [expanded, duration, chevron]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevron.value}deg` }],
  }));

  const toggle = () => {
    void Haptics.selectionAsync();
    setExpanded((v) => !v);
  };

  const algoEntry = ALGORITHM_COPY[strengthAlgorithm];
  const AlgoIcon = ALGO_ICONS[strengthAlgorithm];
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
    streakGoal > 0 ? `${streakGoal}-day target` : 'No target set';

  return (
    <>
      <Animated.View
        className='mx-6 mt-6 overflow-hidden rounded-2xl'
        entering={FadeInUp.delay(baseDelay + 40).duration(durations.enter).easing(enterEasing)}
        layout={reduceMotion ? undefined : LinearTransition.duration(220)}
        style={{
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <Pressable
          accessibilityRole='button'
          accessibilityState={{ expanded }}
          className='flex-row items-center justify-between p-4'
          onPress={toggle}
        >
          <View className='flex-row items-center gap-2.5'>
            <SlidersHorizontal
              color={colors.text.secondary}
              size={iconSizes.small}
              strokeWidth={2}
            />
            <Text
              style={{
                ...typography.body,
                fontWeight: fontWeights.semibold,
                color: colors.text.primary,
              }}
            >
              Advanced
            </Text>
          </View>
          <Animated.View style={chevronStyle}>
            <ChevronDown
              color={colors.text.tertiary}
              size={iconSizes.small}
              strokeWidth={2}
            />
          </Animated.View>
        </Pressable>
        {expanded ? (
          <Animated.View
            className='gap-2.5 px-3 pb-3'
            entering={reduceMotion ? undefined : FadeIn.duration(160)}
            exiting={reduceMotion ? undefined : FadeOut.duration(120)}
          >
            {growthMeta ? (
              <View
                accessibilityLabel='Growth Type'
                className='flex-row items-center gap-3 rounded-2xl px-4 py-3.5'
                style={{
                  backgroundColor: colors.card,
                  borderWidth: 1,
                  borderColor: colors.border,
                  minHeight: 64,
                }}
              >
                <View
                  className='items-center justify-center rounded-xl'
                  style={{
                    backgroundColor: growthMeta.pillBg,
                    height: 36,
                    width: 36,
                  }}
                >
                  <Sprout
                    color={growthMeta.pillFg}
                    size={iconSizes.small}
                    strokeWidth={2}
                  />
                </View>
                <View className='flex-1'>
                  <Text
                    numberOfLines={1}
                    style={{
                      ...typography.body,
                      fontWeight: fontWeights.semibold,
                      color: colors.text.primary,
                    }}
                  >
                    Growth Type
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      ...typography.caption,
                      color: colors.text.tertiary,
                      marginTop: 2,
                    }}
                  >
                    {growthMeta.label} · ~{growthMeta.days}-day build
                  </Text>
                </View>
              </View>
            ) : null}
            <AdvancedOptionRow
              accessibilityHint='Opens strength curve picker'
              icon={
                <AlgoIcon
                  color={colors.primary[600]}
                  size={iconSizes.small}
                  strokeWidth={2}
                />
              }
              iconBackground={colors.primary[100]}
              subtitle={algoSubtitle}
              title='Strength Curve'
              onPress={() => setOpenSheet('algorithm')}
            />
            <AdvancedOptionRow
              accessibilityHint='Opens growth icons picker'
              icon={
                <Text style={{ fontSize: 18 }}>{resolvedEmojis.starting}</Text>
              }
              iconBackground={colors.status.streakLight}
              subtitle={`${presetLabel} · 5 stages`}
              title='Growth Icons'
              onPress={() => setOpenSheet('growth')}
            />
            <AdvancedOptionRow
              accessibilityHint='Opens streak goal picker'
              icon={
                <Target
                  color={colors.status.streakText}
                  size={iconSizes.small}
                  strokeWidth={2}
                />
              }
              iconBackground={colors.status.streakLight}
              subtitle={streakSubtitle}
              title='Streak Goal'
              onPress={() => setOpenSheet('streak')}
            />
          </Animated.View>
        ) : null}
      </Animated.View>

      <AdvancedSheet
        subtitle={`Strength rises with check-ins and dips with misses. Pick the curve that fits this habit.`}
        title='Strength Curve'
        visible={openSheet === 'algorithm'}
        onClose={() => setOpenSheet(null)}
      >
        <AlgorithmSheetBody
          selected={strengthAlgorithm}
          onSelect={onStrengthAlgorithmChange}
        />
      </AdvancedSheet>

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
