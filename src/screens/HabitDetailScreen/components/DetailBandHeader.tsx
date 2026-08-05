/**
 * DetailBandHeader — the close/Edit row, painted in the top stop of the hero's
 * pale-green wash so the top of the screen reads as one surface.
 *
 * The header is fixed while the hero scrolls, so it can't share a single
 * gradient node; it takes the wash's first stop instead, which is where the
 * gradient is effectively flat anyway.
 *
 * ScreenHeader tints its own affordances from `colors.text.primary`, so the
 * close control is supplied as a custom element to pick up the band hairline.
 */
import { Edit3, X } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { iconSizes } from '../../../theme/iconSizes';
import { borderRadius } from '../../../theme/spacing';
import { fontWeights, typography } from '../../../theme/typography';
import { useInsightPalette, type InsightPalette } from '../insightPalette';
import { HeaderButton } from './HeaderButton';

interface DetailBandHeaderProps {
  isCompletedToday?: boolean;
  isTitlePinned: boolean;
  title: string;
  onClose: () => void;
  onEdit: () => void;
}

function BandCloseButton({
  palette,
  onPress,
}: {
  palette: InsightPalette;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel='Close'
      accessibilityRole='button'
      hitSlop={8}
      style={{
        alignItems: 'center',
        borderColor: palette.bandHairline,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        height: 40,
        justifyContent: 'center',
        width: 40,
      }}
      onPress={onPress}
    >
      <X color={palette.bandMuted} size={iconSizes.medium} strokeWidth={2.5} />
    </Pressable>
  );
}

export function DetailBandHeader({
  isCompletedToday = false,
  isTitlePinned,
  onClose,
  onEdit,
  title,
}: DetailBandHeaderProps) {
  const palette = useInsightPalette();
  const wash = isCompletedToday
    ? palette.bandGradientDone
    : palette.bandGradient;

  return (
    <View style={{ backgroundColor: wash[0] }}>
      <ScreenHeader
        leftAction={<BandCloseButton palette={palette} onPress={onClose} />}
        rightAction={
          <HeaderButton
            compact={isTitlePinned}
            icon={<Edit3 size={iconSizes.small} strokeWidth={2.5} />}
            label='Edit habit'
            text='Edit'
            tone='onBand'
            onPress={onEdit}
          />
        }
        title={title}
        titleStyle={{
          // Serif, like every other ScreenHeader in the app (typography.heading1
          // sets fontFamilies.primary.display). Sized down from heading1's 22 so
          // the pinned title doesn't out-shout the hero headline it replaces.
          ...typography.heading1,
          color: palette.bandFg,
          fontSize: typography.body.fontSize,
          fontWeight: fontWeights.semibold,
          letterSpacing: -0.2,
          lineHeight: undefined,
        }}
        titleVisible={isTitlePinned}
        variant='transparent'
        onBack={onClose}
      />
    </View>
  );
}
