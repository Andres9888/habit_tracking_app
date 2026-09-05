/**
 * Owns the "browse all emojis" sheet visibility so a parent (CustomizeFields)
 * can trigger it from both the section-label action and the grid's "+" tile.
 */
import { useCallback, useState } from 'react';
import { Keyboard } from 'react-native';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';

export function useEmojiBrowseSheet() {
  const [visible, setVisible] = useState(false);
  const { triggerSelection } = useHapticFeedback();

  const openSheet = useCallback(() => {
    Keyboard.dismiss();
    triggerSelection();
    setVisible(true);
  }, [triggerSelection]);

  const closeSheet = useCallback(() => setVisible(false), []);

  return { closeSheet, openSheet, visible };
}
