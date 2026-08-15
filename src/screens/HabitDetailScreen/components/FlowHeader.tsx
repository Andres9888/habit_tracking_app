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
      <ChevronLeft color={palette.textPrimary} size={22} strokeWidth={2.3} />
      <Text style={{ color: palette.textSecondary, fontSize: 15 }}>
        {label}
      </Text>
    </Pressable>
  );
}

export function FlowHeader({ backLabel, onBack, title }: FlowHeaderProps) {
  const palette = useInsightPalette();

  return (
    <View style={{ backgroundColor: palette.card }}>
      <ScreenHeader
        leftAction={<FlowBack label={backLabel} onPress={onBack} />}
        title={title}
        titleStyle={{ color: palette.textPrimary }}
        variant='default'
        onBack={onBack}
      />
    </View>
  );
}
