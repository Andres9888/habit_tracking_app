import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { TrendingUp } from 'lucide-react-native';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ScrollView, Text, View } from 'react-native';

import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import { GrowthIconsInline } from '@/components/AdvancedOptions/GrowthIconsInline';
import { StrengthCurveExpand } from '@/components/AdvancedOptions/StrengthCurveExpand';
import { StrengthCurveToggleRow } from '@/components/AdvancedOptions/StrengthCurveToggleRow';
import { StrengthCurveTypeBar } from '@/components/AdvancedOptions/StrengthCurveTypeBar';
import { StreakGoalInline } from '@/components/AdvancedOptions/StreakGoalInline';
import { CURVE_MOCK_COPY } from '@/components/AdvancedOptions/mockTokens';
import { useAdvancedTokens } from '@/components/AdvancedOptions/useAdvancedTokens';
import { iconSizes } from '@/theme/iconSizes';
import type { ProgressEmojiSet } from '@/utils/progressEmojis';
import { SPROUT_PROGRESS_EMOJIS } from '@/utils/progressEmojis';

function Harness() {
  const t = useAdvancedTokens();
  const [mode, setMode] = useState<AlgorithmMode>('balanced');
  const [streakGoal, setStreakGoal] = useState(7);
  const [emojis, setEmojis] = useState<ProgressEmojiSet | undefined>(
    SPROUT_PROGRESS_EMOJIS
  );
  const curve = CURVE_MOCK_COPY[mode];

  return (
    <ScrollView
      style={{ backgroundColor: '#f7f4ef', minHeight: '100vh' }}
      contentContainerStyle={{
        paddingBottom: 48,
        paddingTop: 20,
      }}
    >
      <View style={{ paddingHorizontal: 24 }}>
        <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 10 }}>
          Add habit
        </Text>
        <Text style={{ color: '#6b6258', fontSize: 13, marginBottom: 10 }}>
          Advanced options
        </Text>
        <View
          style={{
            backgroundColor: t.card,
            borderWidth: 1,
            borderColor: t.border,
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingBottom: 12,
          }}
        >
          <StrengthCurveTypeBar growthType='average' />
          <StrengthCurveToggleRow
            chevronAnimatedStyle={{}}
            collapsedValue={curve.value}
            expanded
            icon={
              <TrendingUp
                color={t.accentTileIcon}
                size={iconSizes.small}
                strokeWidth={2}
              />
            }
            onToggle={() => {}}
          />
          <StrengthCurveExpand
            selected={mode}
            suggested='balanced'
            onSelect={setMode}
          />
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: t.border,
              paddingBottom: 12,
              paddingTop: 12,
            }}
          >
            <StreakGoalInline
              streakGoal={streakGoal}
              onStreakGoalChange={setStreakGoal}
            />
          </View>
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: t.border,
              paddingTop: 12,
            }}
          >
            <GrowthIconsInline
              fallback={SPROUT_PROGRESS_EMOJIS}
              value={emojis}
              onChange={setEmojis}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

createRoot(document.getElementById('root')!).render(<Harness />);
