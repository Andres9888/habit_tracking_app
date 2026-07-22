/**
 * CatalogHeader — the Habit Browser header ("Habit Browser Final" design):
 * a back chevron, the serif "Browse habits" title, a circular close button,
 * and the habit-count line. Colors are pinned to the screen's cream palette
 * (not the app theme) so contrast holds in both light and dark app themes.
 */

import { Pressable, StyleSheet, Text } from 'react-native';
import { ChevronLeft, X } from 'lucide-react-native';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';
import { triggerHaptic } from '@/utils/haptics';
import { browserPalette } from '../browserPalette';

interface CatalogHeaderProps {
  count: number;
  countLabel: string;
  onClose: () => void;
}

export function CatalogHeader({
  count,
  countLabel,
  onClose,
}: CatalogHeaderProps) {
  const close = () => {
    void triggerHaptic('tap');
    onClose();
  };

  return (
    <>
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
              color={browserPalette.textPrimary}
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
            style={s.close}
            onPress={close}
          >
            <X
              color={browserPalette.textSecondary}
              size={20}
              strokeWidth={2.5}
            />
          </Pressable>
        }
        title='Browse habits'
        titleStyle={{ color: browserPalette.textPrimary }}
        onBack={onClose}
      />
      <Text style={s.count}>{`${count} ${countLabel}`}</Text>
    </>
  );
}

const s = StyleSheet.create({
  close: {
    alignItems: 'center',
    backgroundColor: browserPalette.closeBg,
    borderRadius: 999,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  count: {
    ...typography.body,
    color: browserPalette.textTertiary,
    paddingBottom: spacing.xs,
    paddingHorizontal: spacing.base,
  },
  iconBtn: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
});
