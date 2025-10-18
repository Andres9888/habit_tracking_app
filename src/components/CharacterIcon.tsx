import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <LinearGradient
        colors={['#ad46ff', '#f6339a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: emojiSize, lineHeight: emojiSize + 4 }}>
          🦸
        </Text>
      </LinearGradient>
    </View>
  );
}
