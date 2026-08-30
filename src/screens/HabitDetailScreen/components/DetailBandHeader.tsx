/**
 * DetailBandHeader — bare close chevron + Edit on the hero wash.
 *
 * The header is fixed while the hero scrolls, so it can't share a single
 * gradient node; it takes the wash's first stop instead, which is where the
 * gradient is effectively flat anyway. That stop comes from `heroWash` rather
 * than a local ternary so recovery's amber cannot reach the hero while the
 * header stays mint.
 *
 * The chevron preserves the original visual language while its accessibility
 * label and behavior correctly identify the modal-root action as Close.
 *
 * Both controls run the `onBand` tone: transparent chrome with CTA green ink.
 * The pinned Edit stays compact to make room for the title without reverting
 * to the older gray circled treatment.
 */
import { ChevronLeft, Edit3 } from 'lucide-react-native';
import { View } from 'react-native';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { iconSizes } from '../../../theme/iconSizes';
import { fontWeights, typography } from '../../../theme/typography';
import { useInsightPalette } from '../insightPalette';
import { heroWash } from './DetailHeroBanner/DetailHeroBanner.utils';
import { HeaderButton } from './HeaderButton';

interface DetailBandHeaderProps {
  isCompletedToday?: boolean;
  /** A miss is still unanswered: take the hero's amber wash, not the mint one. */
  isRecovery?: boolean;
  isTitlePinned: boolean;
  title: string;
  onClose: () => void;
  onEdit: () => void;
}

export function DetailBandHeader({
  isCompletedToday = false,
  isRecovery = false,
  isTitlePinned,
  onClose,
  onEdit,
  title,
}: DetailBandHeaderProps) {
  const palette = useInsightPalette();
  const wash = heroWash(
    palette,
    isCompletedToday ? 'completed' : 'open-today',
    isRecovery
  );

  return (
    <View style={{ backgroundColor: wash[0] }}>
      <ScreenHeader
        leftAction={
          <HeaderButton
            compact
            icon={<ChevronLeft size={iconSizes.large} strokeWidth={2} />}
            label='Close'
            tone='onBand'
            onPress={onClose}
          />
        }
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
        title={isTitlePinned ? title : undefined}
        titleStyle={{
          ...typography.bodyBold,
          color: palette.bandFg,
          fontSize: typography.body.fontSize,
          fontWeight: fontWeights.semibold,
          letterSpacing: -0.2,
        }}
        titleVisible={isTitlePinned}
        variant='transparent'
      />
    </View>
  );
}
