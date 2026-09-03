import { Pressable, Text } from 'react-native';
import { fontWeights } from '../../../../theme/typography';
import { useInsightPalette } from '../../insightPalette';
import { FlowDivider } from '../FlowRow';

interface ShowAllRowProps {
  count: number;
  onPress: () => void;
}

/** Reveals the rest of the daily record once it's been capped. */
export function ShowAllRow({ count, onPress }: ShowAllRowProps) {
  const palette = useInsightPalette();
  return (
    <>
      <FlowDivider />
      <Pressable
        accessibilityRole='button'
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 48,
          paddingHorizontal: 15,
        }}
        onPress={onPress}
      >
        <Text
          style={{
            color: palette.textSecondary,
            fontSize: 14,
            fontWeight: fontWeights.semibold,
          }}
        >
          {`Show all ${count} days`}
        </Text>
      </Pressable>
    </>
  );
}
