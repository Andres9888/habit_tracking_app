import { Text, View } from 'react-native';
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
        title={title}
        titleStyle={{ color: palette.textPrimary }}
        variant='transparent'
      />
      {subtitle ? (
        <Text
          accessibilityRole='text'
          numberOfLines={1}
          style={{
            color: palette.textTertiary,
            fontSize: 13,
            marginTop: -6,
            paddingBottom: 10,
            textAlign: 'center',
          }}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
