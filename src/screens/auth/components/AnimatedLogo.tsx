import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { borderRadius } from '@/theme/spacing';

/**
 * Props for the AnimatedLogo component
 */
interface AnimatedLogoProps {
  /** Size of the logo in pixels (width and height) */
  size?: number;
}

/**
 * AnimatedLogo - Static auth logo; WelcomeScreen owns the entrance animation.
 *
 * Features:
 * - Emerald gradient background (#059669 → #10b981 → #34d399)
 * - SVG link icon centered
 * - Full accessibility support
 *
 * @example
 * <AnimatedLogo size={80} />
 */
export function AnimatedLogo({ size = 80 }: AnimatedLogoProps) {
  const iconSize = size * 0.5;

  return (
    <View
      accessible
      accessibilityLabel='Chain Day Logo'
      accessibilityRole='image'
      className='mb-4'
    >
      <View
        style={{
          borderRadius: borderRadius.card,
          elevation: 4,
          height: size,
          shadowColor: colors.gray[900],
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          width: size,
        }}
      >
        <LinearGradient
          colors={[
            colors.primary[600],
            colors.primary[500],
            colors.primary[400],
          ]}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={{
            alignItems: 'center',
            borderRadius: borderRadius.card,
            height: size,
            justifyContent: 'center',
            width: size,
          }}
        >
          <Link color='white' size={iconSize} strokeWidth={2} />
        </LinearGradient>
      </View>
    </View>
  );
}
