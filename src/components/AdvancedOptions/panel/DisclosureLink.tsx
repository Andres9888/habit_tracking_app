/** "˅ SEE THE DIFFERENCE" style caps disclosure toggle. */
import { Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { ChevronDown } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { fontFamilies, fontWeights } from '@/theme/typography';
import { useInlineExpand } from '../useInlineExpand';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { usePanelTokens } from './panelTokens';

interface Props {
  label: string;
  open: boolean;
  onToggle: () => void;
}

export function DisclosureLink({ label, open, onToggle }: Props) {
  const t = usePanelTokens();
  const { chevronAnimatedStyle } = useInlineExpand(open);
  return (
    <AnimatedPressable
      accessibilityLabel={label}
      accessibilityRole='button'
      accessibilityState={{ expanded: open }}
      style={{
        marginTop: 8,
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        minHeight: 36,
        paddingHorizontal: 4,
        borderRadius: 10,
      }}
      onPress={onToggle}
    >
      <Animated.View style={chevronAnimatedStyle}>
        <ChevronDown
          color={t.linkInk}
          size={iconSizes.small}
          strokeWidth={2.5}
        />
      </Animated.View>
      <Text
        style={{
          fontFamily: fontFamilies.primary.text,
          fontSize: 12,
          fontWeight: fontWeights.bold,
          letterSpacing: 0.8,
          textTransform: 'uppercase',
          color: t.linkInk,
        }}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}
