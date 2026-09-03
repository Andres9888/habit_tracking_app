/**
 * MonthNavButtons — the two hairline chevrons that page the month card.
 *
 * They live in the card header rather than in a bar above it: one month, one
 * heading, one place to move it. At a bound they stay put and go quiet — a
 * disabled control that reads as disabled is honest about where the data ends.
 */
import type { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { usePressed } from '../../../../components/AdvancedOptions/usePressed';
import type { InsightPalette } from '../../insightPalette';

export interface MonthNavigation {
  canGoNext: boolean;
  canGoPrev: boolean;
  onNext: () => void;
  onPrev: () => void;
}

interface MonthNavButtonsProps extends MonthNavigation {
  palette: InsightPalette;
}

interface NavButtonProps {
  children: ReactNode;
  disabled: boolean;
  label: string;
  palette: InsightPalette;
  onPress: () => void;
}

function NavButton({
  children,
  disabled,
  label,
  palette,
  onPress,
}: NavButtonProps) {
  const { pressProps, pressed } = usePressed();
  return (
    <Pressable
      {...pressProps}
      accessibilityLabel={label}
      accessibilityRole='button'
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={8}
      style={{
        alignItems: 'center',
        borderColor: palette.cardBorder,
        borderRadius: 14,
        borderWidth: 1,
        height: 28,
        justifyContent: 'center',
        opacity: disabled ? 0.4 : pressed ? 0.6 : 1,
        width: 28,
      }}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
}

export function MonthNavButtons({
  canGoNext,
  canGoPrev,
  palette,
  onNext,
  onPrev,
}: MonthNavButtonsProps) {
  return (
    <View style={{ flexDirection: 'row', gap: 6 }}>
      <NavButton
        disabled={!canGoPrev}
        label='Previous month'
        palette={palette}
        onPress={onPrev}
      >
        <ChevronLeft color={palette.textPrimary} size={14} strokeWidth={2.2} />
      </NavButton>
      <NavButton
        disabled={!canGoNext}
        label='Next month'
        palette={palette}
        onPress={onNext}
      >
        <ChevronRight color={palette.textPrimary} size={14} strokeWidth={2.2} />
      </NavButton>
    </View>
  );
}
