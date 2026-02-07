import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { shadows } from '../theme/spacing';

interface CharacterIconProps {
  size?: number;
}

/**
 * Custom character icon component for the character screen navigation
 * Features a superhero emoji on a purple-pink gradient matching the character screen design
 */
export default function CharacterIcon({ size = 36 }: CharacterIconProps) {
  const emojiSize = Math.floor(size * 0.55);

  return (
    <View
      style={{
        ...shadows.card,
        borderRadius: size / 2,
        height: size,
        overflow: 'hidden',
        width: size,
      }}
    >
      <LinearGradient
        colors={['#ad46ff', '#f6339a']}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={{
          alignItems: 'center',
          height: '100%',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Text style={{ fontSize: emojiSize, lineHeight: emojiSize + 4 }}>
          🦸
        </Text>
      </LinearGradient>
    </View>
  );
}
