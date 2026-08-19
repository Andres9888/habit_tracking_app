/** PauseCard — pause a habit without breaking the streak. */
import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import { ERROR_MESSAGES } from '../../../constants/errorMessages';
import { borderRadius } from '../../../theme/spacing';
import { fontWeights } from '../../../theme/typography';
import { useInsightPalette } from '../insightPalette';
import { runPauseToggle } from './pauseCardToggle';

interface PauseCardProps {
  habitId: Id<'habits'>;
  paused?: boolean;
}

export function PauseCard({ habitId, paused = false }: PauseCardProps) {
  const palette = useInsightPalette();
  const pause = useMutation(api.habits.pause);
  const resume = useMutation(api.habits.resume);
  const [isBusy, setIsBusy] = useState(false);

  const toggle = async () => {
    if (isBusy) return;
    setIsBusy(true);
    try {
      await runPauseToggle({ habitId, pause, paused, resume });
    } catch {
      Alert.alert('Error', ERROR_MESSAGES.DATA_OPS.PAUSE_HABIT_FAILED);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: palette.cellEmpty,
        borderRadius: borderRadius.large,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
        paddingVertical: 15,
      }}
    >
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text
          style={{
            color: palette.textPrimary,
            fontSize: 14,
            fontWeight: fontWeights.bold,
          }}
        >
          {paused ? 'Currently paused' : 'Going away?'}
        </Text>
        <Text
          style={{
            color: palette.textSecondary,
            fontSize: 13,
            marginTop: 2,
          }}
        >
          {paused
            ? 'Your streak is being held for you'
            : 'Pause without losing your streak'}
        </Text>
      </View>
      <Pressable
        accessibilityLabel={paused ? 'Resume habit' : 'Pause habit'}
        accessibilityRole='button'
        accessibilityState={{ busy: isBusy }}
        disabled={isBusy}
        hitSlop={8}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 44,
          opacity: isBusy ? 0.5 : 1,
          paddingHorizontal: 4,
        }}
        onPress={() => void toggle()}
      >
        <Text
          style={{
            color: palette.ctaGreen,
            fontSize: 13,
            fontWeight: fontWeights.bold,
          }}
        >
          {paused ? 'Resume' : 'Pause'}
        </Text>
      </Pressable>
    </View>
  );
}
