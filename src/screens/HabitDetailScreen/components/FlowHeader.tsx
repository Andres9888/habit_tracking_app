import { View } from 'react-native';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { useInsightPalette } from '../insightPalette';
import { FlowBack } from './FlowBack';

interface FlowHeaderProps {
  backLabel: string;
  subtitle?: string;
  title: string;
  onBack: () => void;
}

export function FlowHeader({
  backLabel,
  onBack,
  subtitle,
  title,
}: FlowHeaderProps) {
  const palette = useInsightPalette();

  return (
    <View style={{ backgroundColor: palette.bandGradient[2] }}>
      <ScreenHeader
        leftAction={<FlowBack label={backLabel} onPress={onBack} />}
        subtitle={subtitle}
        title={title}
        titleStyle={{ color: palette.textPrimary }}
        variant='transparent'
      />
    </View>
  );
}
