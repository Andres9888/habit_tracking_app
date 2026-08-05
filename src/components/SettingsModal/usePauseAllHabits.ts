/** usePauseAllHabits — churn-save action behind "Pause my habits instead".
 *
 *  Confirms first: pausing is reversible but it does stop every habit at once,
 *  which is a big enough change that it shouldn't happen on a single tap. */
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export function usePauseAllHabits() {
  const pauseAll = useMutation(api.habits.pauseAll);
  const [isPausing, setIsPausing] = useState(false);

  const runPauseAll = useCallback(async () => {
    setIsPausing(true);
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const result = await pauseAll({ timezone });
      const count = result?.pausedCount ?? 0;
      Alert.alert(
        count > 0 ? 'Habits paused' : 'Nothing to pause',
        count > 0
          ? `Paused ${count} ${count === 1 ? 'habit' : 'habits'}. Your streaks and history are safe — resume any time.`
          : 'You have no active habits right now.'
      );
    } catch {
      Alert.alert(
        'Could not pause habits',
        'Something went wrong. Please try again.'
      );
    } finally {
      setIsPausing(false);
    }
  }, [pauseAll]);

  const handlePauseAll = useCallback(() => {
    Alert.alert(
      'Pause your habits?',
      'Everything stops tracking until you resume. Streaks and history are preserved, and paused days never count against you.',
      [
        { style: 'cancel', text: 'Cancel' },
        {
          onPress: () => {
            void runPauseAll();
          },
          text: 'Pause all',
        },
      ]
    );
  }, [runPauseAll]);

  return { handlePauseAll, isPausing };
}
