/** "˅ SEE THE DIFFERENCE" style caps disclosure toggle. */
import { Pressable, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { ChevronDown } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { fontFamilies, fontWeights } from '@/theme/typography';
import { useInlineExpand } from '../useInlineExpand';
import { usePressed } from '../usePressed';
import { usePanelTokens } from './panelTokens';

interface Props {
  label: string;
  open: boolean;
  onToggle: () => void;
}

export function DisclosureLink({ label, open, onToggle }: Props) {
  const t = usePanelTokens();
  const { pressed, pressProps } = usePressed();
  const { chevronAnimatedStyle } = useInlineExpand(open);
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole='button'
      accessibilityState={{ expanded: open }}
      {...pressProps}
      style={{
        marginTop: 8,
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        minHeight: 36,
        paddingHorizontal: 4,
        borderRadius: 10,
        opacity: pressed ? 0.7 : 1,
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
    </Pressable>
  );
}
