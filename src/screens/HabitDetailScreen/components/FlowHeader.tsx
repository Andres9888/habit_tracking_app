import { Pressable, Text, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { useInsightPalette } from '../insightPalette';

interface FlowHeaderProps {
  backLabel: string;
  title: string;
  onBack: () => void;
}

function FlowBack({ label, onPress }: { label: string; onPress: () => void }) {
  const palette = useInsightPalette();

  return (
    <Pressable
      accessibilityLabel={`Back to ${label}`}
      accessibilityRole='button'
      hitSlop={8}
      style={{ alignItems: 'center', flexDirection: 'row', gap: 2 }}
      onPress={onPress}
    >
      <ChevronLeft color={palette.green} size={20} strokeWidth={2.3} />
      <Text
        style={{
          color: palette.green,
          fontSize: 16,
          fontWeight: '500',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function FlowHeader({ backLabel, onBack, title }: FlowHeaderProps) {
  const palette = useInsightPalette();

  return (
    <View style={{ backgroundColor: palette.bandGradient[2] }}>
      <ScreenHeader
        leftAction={<FlowBack label={backLabel} onPress={onBack} />}
        title={title}
        titleStyle={{ color: palette.textPrimary }}
        variant='transparent'
        onBack={onBack}
      />
    </View>
  );
}
