import { Text, View } from 'react-native';

const COPPER = '#B87333';
const CARD = '#FAF6EE';
const META = '#777';
const TITLE = '#111';

interface Step {
  num: string;
  sub: React.ReactNode;
  title: string;
}

const STEPS: Step[] = [
  {
    num: '1',
    title: 'Know how long.',
    sub: (
      <>
        Simple habits (a walk): <Text style={{ color: COPPER, fontWeight: '800' }}>21 days</Text>.{' '}
        Most habits (meditation): <Text style={{ color: COPPER, fontWeight: '800' }}>66</Text>.{' '}
        Complex (writing): <Text style={{ color: COPPER, fontWeight: '800' }}>120+</Text>.
      </>
    ),
  },
  {
    num: '2',
    title: 'Know where you are.',
    sub: (
      <>
        Your strength has a name:{' '}
        <Text style={{ color: COPPER, fontWeight: '800' }}>Copper → Iron → Gold</Text>.
      </>
    ),
  },
  {
    num: '3',
    title: 'Never back to zero.',
    sub: (
      <>
        Most apps count days (streaks). We use{' '}
        <Text style={{ color: COPPER, fontWeight: '800' }}>habit strength</Text>
        {' '}— how automatic, ingrained, and resistant to change your habit becomes.
        Skips dent it. Never resets.
      </>
    ),
  },
];

const circleStyle = {
  alignItems: 'center', backgroundColor: CARD, borderColor: COPPER,
  borderRadius: 999, borderWidth: 1.5, flexShrink: 0, height: 30,
  justifyContent: 'center', width: 30,
} as const;
const numStyle = { color: COPPER, fontFamily: 'JetBrainsMono', fontSize: 14, fontWeight: '700' } as const;
const titleStyle = { color: TITLE, fontSize: 16, fontWeight: '800', letterSpacing: -0.3, lineHeight: 20 } as const;
const subStyle = { color: META, fontSize: 13, lineHeight: 19 } as const;

export function NumberedSteps() {
  return (
    <View style={{ gap: 14, marginTop: 18 }}>
      {STEPS.map((step) => (
        <View key={step.num} style={{ alignItems: 'flex-start', flexDirection: 'row', gap: 12 }}>
          <View style={circleStyle}><Text style={numStyle}>{step.num}</Text></View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={titleStyle}>{step.title}</Text>
            <Text style={subStyle}>{step.sub}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
