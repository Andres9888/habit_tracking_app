import { View } from 'react-native';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { useInsightPalette } from '../insightPalette';

interface FlowHeaderProps {
  backLabel: string;
  title: string;
  onBack: () => void;
}

export function FlowHeader({ backLabel, onBack, title }: FlowHeaderProps) {
  const palette = useInsightPalette();

  return (
    <View style={{ backgroundColor: palette.bandGradient[2] }}>
      <ScreenHeader
        leftAction='back'
        leftActionAccessibilityLabel={`Back to ${backLabel}`}
        title={title}
        titleStyle={{ color: palette.textPrimary }}
        variant='transparent'
        onBack={onBack}
      />
    </View>
  );
}
