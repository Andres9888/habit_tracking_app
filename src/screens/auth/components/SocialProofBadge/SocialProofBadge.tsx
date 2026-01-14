import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Star } from 'lucide-react-native';

/**
 * Props for the SocialProofBadge component
 */
interface SocialProofBadgeProps {
  /** Text to display in the badge */
  text?: string;
}

/**
 * SocialProofBadge - Social proof indicator for auth screens
 *
 * Features:
 * - Amber gradient background (#fef3c7 → #fde68a)
 * - Star icon with amber-600 color
 * - Customizable text (defaults to "10,000+ habits tracked")
 * - Rounded pill design
 * - Full accessibility support
 *
 * @example
 * <SocialProofBadge />
 * <SocialProofBadge text="5,000+ happy users" />
 */
export function SocialProofBadge({
  text = '10,000+ habits tracked',
}: SocialProofBadgeProps) {
  return (
    <View accessible accessibilityLabel={text} accessibilityRole='text'>
      <LinearGradient
        colors={['#fef3c7', '#fde68a']}
        end={{ x: 1, y: 0 }}
        start={{ x: 0, y: 0 }}
        style={{
          alignItems: 'center',
          borderRadius: 20,
          flexDirection: 'row',
          gap: 6,
          paddingHorizontal: 16,
          paddingVertical: 8,
        }}
      >
        <Star color='#d97706' fill='#d97706' size={16} />
        <Text
          style={{
            color: '#92400e', // amber-800
            fontSize: 14,
            fontWeight: '600',
          }}
        >
          {text}
        </Text>
      </LinearGradient>
    </View>
  );
}
