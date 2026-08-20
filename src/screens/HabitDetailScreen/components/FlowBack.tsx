/**
 * FlowBack — labeled chevron used by Detail and nested flow headers.
 * Names the place you land (Home, History), not the calendar day.
 */
import { Pressable, Text } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useInsightPalette } from '../insightPalette';

interface FlowBackProps {
  label: string;
  onPress: () => void;
}

export function FlowBack({ label, onPress }: FlowBackProps) {
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
