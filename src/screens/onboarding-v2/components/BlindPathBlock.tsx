import { Text, View } from 'react-native';

const QUESTIONS = [
  'How long does it take?',
  'Where am I in the process?',
  'What if I miss a day?',
] as const;

export function BlindPathBlock() {
  return (
    <View
      style={{
        backgroundColor: '#FAF6EE',
        borderColor: '#C8C4B8',
        borderRadius: 12,
        borderStyle: 'dashed',
        borderWidth: 1.5,
        gap: 10,
        marginTop: 22,
        maxWidth: 320,
        padding: 16,
        width: '100%',
      }}
    >
      {QUESTIONS.map((q) => (
        <View key={q}>
          <Text
            style={{
              color: '#999',
              fontSize: 17,
              fontStyle: 'italic',
              lineHeight: 24,
              textAlign: 'center',
            }}
          >
            &ldquo;{q}&rdquo;
          </Text>
          <Text
            style={{
              color: '#555',
              fontSize: 17,
              fontWeight: '700',
              lineHeight: 24,
              textAlign: 'center',
            }}
          >
            You don&rsquo;t know.
          </Text>
        </View>
      ))}
    </View>
  );
}
