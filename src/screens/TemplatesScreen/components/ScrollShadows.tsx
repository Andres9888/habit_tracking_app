/**
 * Scroll shadow overlays for list views
 */

import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronDown } from 'lucide-react-native';
import { styles } from '../../templates/templatesScreenStyles';

interface ScrollShadowsProps {
  showBottomShadow: boolean;
  showTopShadow: boolean;
}

export function ScrollShadows({
  showBottomShadow,
  showTopShadow,
}: ScrollShadowsProps) {
  return (
    <>
      {showTopShadow && (
        <LinearGradient
          colors={['rgba(248,247,245,0.96)', 'rgba(248,247,245,0)']}
          pointerEvents='none'
          style={styles.scrollFadeTop}
        />
      )}
      {showBottomShadow && (
        <LinearGradient
          colors={['rgba(248,247,245,0)', 'rgba(248,247,245,0.95)']}
          pointerEvents='none'
          style={styles.scrollFadeBottom}
        >
          <View
            style={[
              styles.scrollHintChip,
              { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
            ]}
          >
            <ChevronDown color='#374151' size={16} strokeWidth={2.25} />
            <Text style={[styles.scrollHintText, { color: '#374151' }]}>
              Scroll for more
            </Text>
          </View>
        </LinearGradient>
      )}
    </>
  );
}
