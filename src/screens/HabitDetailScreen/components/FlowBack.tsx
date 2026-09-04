/**
 * FlowBack — labeled chevron used by Detail and nested flow headers.
 * Names the place you land (Home, History), not the calendar day.
 */
import { I18nManager, StyleSheet, Text } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { AnimatedPressable } from '../../../components/ui';
import { useInsightPalette } from '../insightPalette';

interface FlowBackProps {
  label: string;
  onPress: () => void;
}

export function FlowBack({ label, onPress }: FlowBackProps) {
  const palette = useInsightPalette();
  return (
    <AnimatedPressable
      accessibilityLabel={`Back to ${label}`}
      accessibilityRole='button'
      animationConfig={{ pressScale: 0.94 }}
      style={styles.control}
      onPress={onPress}
    >
      <ChevronLeft
        color={palette.green}
        size={20}
        strokeWidth={2.3}
        style={I18nManager.isRTL ? styles.rtlIcon : undefined}
      />
      <Text
        style={{
          color: palette.green,
          fontSize: 16,
          fontWeight: '500',
        }}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  control: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 2,
    minHeight: 44,
  },
  rtlIcon: { transform: [{ scaleX: -1 }] },
});
