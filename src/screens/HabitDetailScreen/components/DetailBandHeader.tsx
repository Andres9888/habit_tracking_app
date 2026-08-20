/**
 * DetailBandHeader — circled close chevron + Edit on the hero wash.
 *
 * The header is fixed while the hero scrolls, so it can't share a single
 * gradient node; it takes the wash's first stop instead, which is where the
 * gradient is effectively flat anyway.
 *
 * The chevron preserves the original visual language while its accessibility
 * label and behavior correctly identify the modal-root action as Close.
 */
import { ChevronLeft, Edit3 } from 'lucide-react-native';
import { View } from 'react-native';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { iconSizes } from '../../../theme/iconSizes';
import { fontWeights, typography } from '../../../theme/typography';
import { useInsightPalette } from '../insightPalette';
import { HeaderButton } from './HeaderButton';

interface DetailBandHeaderProps {
  isCompletedToday?: boolean;
  isTitlePinned: boolean;
  title: string;
  onClose: () => void;
  onEdit: () => void;
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
        leftAction={
          <HeaderButton
            compact
            icon={<ChevronLeft size={iconSizes.medium} strokeWidth={2.3} />}
            label='Close'
            tone='onBandCircle'
            onPress={onClose}
          />
        }
        rightAction={
          <HeaderButton
            compact={isTitlePinned}
            icon={<Edit3 size={iconSizes.small} strokeWidth={2.5} />}
            label='Edit habit'
            text='Edit'
            tone={isTitlePinned ? 'onBandCircle' : 'onBand'}
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
