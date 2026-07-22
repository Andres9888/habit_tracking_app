/**
 * CatalogHeader — the Habit Browser header ("Habit Browser Final" design):
 * a back chevron, the serif "Habit library" title, and a circular close
 * button. Colors follow the app's light/dark theme via useBrowserPalette.
 */

import { Pressable, StyleSheet } from 'react-native';
import { ChevronLeft, X } from 'lucide-react-native';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { triggerHaptic } from '@/utils/haptics';
import { useBrowserPalette } from '../browserPalette';

interface CatalogHeaderProps {
  onClose: () => void;
}

export function CatalogHeader({ onClose }: CatalogHeaderProps) {
  const palette = useBrowserPalette();
  const close = () => {
    void triggerHaptic('tap');
    onClose();
  };

  return (
    <ScreenHeader
      leftAction={
        <Pressable
          accessibilityLabel='Go back'
          accessibilityRole='button'
          hitSlop={8}
          style={s.iconBtn}
          onPress={onClose}
        >
          <ChevronLeft
            color={palette.textPrimary}
            size={24}
            strokeWidth={2.5}
          />
        </Pressable>
      }
      rightAction={
        <Pressable
          accessibilityLabel='Close habit library'
          accessibilityRole='button'
          hitSlop={8}
          style={[s.close, { backgroundColor: palette.closeBg }]}
          onPress={close}
        >
          <X color={palette.textSecondary} size={20} strokeWidth={2.5} />
        </Pressable>
      }
      title='Habit library'
      titleStyle={{ color: palette.textPrimary }}
      onBack={onClose}
    />
  );
}

const s = StyleSheet.create({
  close: {
    alignItems: 'center',
    borderRadius: 999,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  iconBtn: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
});
