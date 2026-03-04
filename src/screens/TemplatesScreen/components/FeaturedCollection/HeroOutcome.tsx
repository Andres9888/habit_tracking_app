/**
 * HeroOutcome - Curiosity gap stat to drive engagement (Loewenstein, 1994)
 */

import { StyleSheet, Text, View } from 'react-native';

export function HeroOutcome() {
  return (
    <View style={s.container}>
      <Text style={s.text}>
        Users report <Text style={s.bold}>2.3x more productive</Text> mornings
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  bold: { color: '#FFFFFF', fontWeight: '700' },
  container: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 8,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  text: { color: 'rgba(255,255,255,0.9)', fontSize: 12 },
});
