/** Post-add education: cue anchoring, 66-day expectation, identity line. */

import { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { triggerHaptic } from '@/utils/haptics';
import { useThemeColors } from '../../theme/ThemeContext';
import { SectionOverline } from '../../screens/TemplatesScreen/components/SectionOverline';
import { CelebrationBand } from './components/CelebrationBand';
import { CueChips } from './components/CueChips';
import { ExpectationCard } from './components/ExpectationCard';
import { IdentityVote } from './components/IdentityVote';
import { StickActions } from './components/StickActions';
import { buildCueOptions, buildRecapLabel } from './MakeItStickSheet.helpers';
import { enterBody, enterSheet, styles as s } from './MakeItStickSheet.styles';
import type { MakeItStickSheetProps } from './MakeItStickSheet.types';

export function MakeItStickSheet({
  habitId,
  onDone,
  onSaveError,
  template,
  visible,
}: MakeItStickSheetProps) {
  const { colors } = useThemeColors();
  const insets = useSafeAreaInsets();
  const updateHabit = useMutation(api.habits.update);

  const cues = useMemo(() => buildCueOptions(template), [template]);
  const [selectedCue, setSelectedCue] = useState('');
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (visible) setSelectedCue(cues[0] ?? '');
  }, [cues, visible]);

  if (!visible || !template) return null;

  const recapLabel = buildRecapLabel(template);

  const handleLockIn = async () => {
    if (saving) return;
    setSaving(true);
    try {
      if (habitId) {
        await updateHabit({
          cueAfterBehavior: selectedCue || undefined,
          habitId,
          identity: template.suggestedIdentity,
        });
      }
    } catch {
      setSaving(false);
      onSaveError?.();
      return;
    }
    void triggerHaptic('success');
    setSaving(false);
    onDone();
  };

  return (
    <Animated.View
      entering={enterSheet}
      style={[s.container, { backgroundColor: colors.background }]}
      testID='make-it-stick-sheet'
    >
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        <CelebrationBand topInset={insets.top} />
        <Animated.View entering={enterBody}>
          <Text
            numberOfLines={2}
            style={[
              s.recap,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.text.primary,
              },
            ]}
          >
            {recapLabel}
          </Text>
          <SectionOverline title='Anchor it to something you already do' />
          <Text style={[s.cueHelp, { color: colors.text.secondary }]}>
            Habits stick when they have a trigger.
          </Text>
          <CueChips
            cues={cues}
            selected={selectedCue}
            onSelect={setSelectedCue}
          />
          <ExpectationCard />
          {template.suggestedIdentity ? (
            <IdentityVote identity={template.suggestedIdentity} />
          ) : null}
          <StickActions
            saving={saving}
            onLockIn={() => void handleLockIn()}
            onSkip={onDone}
          />
        </Animated.View>
      </ScrollView>
    </Animated.View>
  );
}
