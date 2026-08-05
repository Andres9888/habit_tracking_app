/* eslint-disable max-lines */
/** AdvancedOptionsSection — consolidated per-habit Advanced controls. */
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { ChevronDown, Sprout, Target } from 'lucide-react-native';
import { triggerHaptic } from '@/utils/haptics';
import { ALGORITHM_COPY } from '@/components/AlgorithmPicker';
import {
  useUserCustomProgressEmojis,
  useUserDefaultProgressEmojis,
} from '@/hooks/useProgressEmojis';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '@/theme/ThemeContext';
import { fontWeights, typography } from '@/theme/typography';
import { shadows } from '@/theme/spacing';
import { durations } from '@/theme/animations';
import {
  CUSTOM_PRESET_ID,
  matchPresetId,
  PROGRESS_EMOJI_PRESETS,
  resolveProgressEmojis,
  STRENGTH_LEVEL_KEYS,
} from '@/utils/progressEmojis';
import { getGrowthTypeMeta } from '@/utils/growthTypeMeta';
import { StrengthCurvePickerModal } from '@/screens/StrengthCurvePicker';
import { MODE_STYLES } from '@/screens/StrengthCurvePicker/strengthCurveModeStyles';
import { useAdvancedOptionsAccordion } from './useAdvancedOptionsAccordion';
import { AdvancedOptionRow } from './AdvancedOptionRow';
import { AdvancedSheet } from './AdvancedSheet';
import { GrowthIconsSheetBody } from './GrowthIconsSheetBody';
import { StreakGoalSheetBody } from './StreakGoalSheetBody';
import { StrengthCurveSheetBody } from './StrengthCurveSheetBody';
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
  onExpand,
}: AdvancedOptionsSectionProps) {
  const { colors } = useThemeColors();
  const userDefaultEmojis = useUserDefaultProgressEmojis();
  const savedCustomEmojis = useUserCustomProgressEmojis();
  const [expanded, setExpanded] = useState(false);
  const [openSheet, setOpenSheet] = useState<SheetKey>(null);
  const [fullPickerVisible, setFullPickerVisible] = useState(false);
  const {
    chevronAnimatedStyle,
    contentAnimatedStyle,
    handleContentLayout,
    reduceMotion,
  } = useAdvancedOptionsAccordion({ isExpanded: expanded });

  const onExpandRef = useRef(onExpand);
  useEffect(() => {
    onExpandRef.current = onExpand;
  });

  useEffect(() => {
    if (!expanded) return;
    // Wait for the measured layout to settle before nudging the section into view.
    const scroll = setTimeout(
      () => onExpandRef.current?.(),
      reduceMotion ? 0 : durations.enter
    );
    return () => clearTimeout(scroll);
  }, [expanded, reduceMotion]);

  const toggle = () => {
    void triggerHaptic('selection');
    setExpanded((v) => !v);
  };

  const algoEntry = ALGORITHM_COPY[strengthAlgorithm];
  const algoStyle = MODE_STYLES[strengthAlgorithm];
  const AlgoIcon = algoStyle.Icon;
  const algoSubtitle = `${algoEntry.name} · ~${algoEntry.daysToForm}-day build`;
  const growthMeta = getGrowthTypeMeta(growthType);

  const resolvedEmojis = resolveProgressEmojis(
    progressEmojis,
    userDefaultEmojis
  );
  const presetId = matchPresetId(resolvedEmojis, savedCustomEmojis);
  const presetLabel =
    presetId === CUSTOM_PRESET_ID
      ? 'Custom'
      : (PROGRESS_EMOJI_PRESETS.find((p) => p.id === presetId)?.label ??
        'Custom');
  const emojiStrip = STRENGTH_LEVEL_KEYS.map((k) => resolvedEmojis[k]).join(' ');
  const streakSubtitle =
    streakGoal > 0 ? `${streakGoal}-day goal` : 'No goal set';

  const openFullPicker = () => {
    setOpenSheet(null);
    setTimeout(() => setFullPickerVisible(true), 80);
  };

  return (
    <>
      <View className='mt-6 px-6'>
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
                icon={
                  <Text style={{ fontSize: 12 }}>
                    {resolvedEmojis.starting}
                  </Text>
                }
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
              <Animated.View style={chevronAnimatedStyle}>
                <ChevronDown
                  color='#FFFFFF'
                  size={iconSizes.small}
                  strokeWidth={2.5}
                />
              </Animated.View>
            </View>
          </Pressable>
          <Animated.View
            accessibilityElementsHidden={!expanded}
            importantForAccessibility={
              expanded ? 'auto' : 'no-hide-descendants'
            }
            pointerEvents={expanded ? 'auto' : 'none'}
            style={contentAnimatedStyle}
          >
            <View className='px-4 pb-3 pt-1' onLayout={handleContentLayout}>
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
                    Growth Type · {growthMeta.label} · ~{growthMeta.days}-day
                    build
                  </Text>
                </View>
              ) : null}
              <AdvancedOptionRow
                isFirst
                accessibilityHint='Opens habit strength picker'
                description='How strength grows — and what a missed day costs.'
                icon={
                  <AlgoIcon
                    color={colors.primary[700]}
                    size={iconSizes.small}
                    strokeWidth={2}
                  />
                }
                iconBackground={colors.surface}
                subtitle={algoSubtitle}
                title='Habit Strength'
                onPress={() => setOpenSheet('algorithm')}
              />
              <AdvancedOptionRow
                accessibilityHint='Opens growth icons picker'
                description="Your habit's icon upgrades as it grows stronger."
                icon={
                  <Text style={{ fontSize: 18 }}>
                    {resolvedEmojis.starting}
                  </Text>
                }
                iconBackground={colors.surface}
                subtitle={`${presetLabel} · ${emojiStrip}`}
                title='Growth Icons'
                onPress={() => setOpenSheet('growth')}
              />
              <AdvancedOptionRow
                accessibilityHint='Opens streak goal picker'
                description='A visual target — no penalty if you miss it.'
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
            </View>
          </Animated.View>
        </View>
      </View>

      <StrengthCurvePickerModal
        selected={strengthAlgorithm}
        visible={fullPickerVisible}
        onClose={() => setFullPickerVisible(false)}
        onSelect={onStrengthAlgorithmChange}
      />

      <AdvancedSheet
        subtitle='How strength grows — and what a missed day costs.'
        title='Habit Strength'
        visible={openSheet === 'algorithm'}
        onClose={() => setOpenSheet(null)}
      >
        <StrengthCurveSheetBody
          selected={strengthAlgorithm}
          onLearnMore={openFullPicker}
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
