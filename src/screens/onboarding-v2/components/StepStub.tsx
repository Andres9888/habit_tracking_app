import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

interface StepStubProps {
  label: string;
  note?: string;
  onNext: () => void;
  title: string;
}

export function StepStub({ label, note, onNext, title }: StepStubProps) {
  const { colors } = useThemeColors();

  return (
    <View style={{ flex: 1, justifyContent: 'space-between' }}>
      <View style={{ paddingTop: 24 }}>
        <Text style={{ color: colors.text.secondary, fontSize: 12, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' }}>
          {label}
        </Text>
        <Text style={{ color: colors.text.primary, fontSize: 30, fontWeight: '800', letterSpacing: -0.5, marginTop: 8 }}>
          {title}
        </Text>
        {note ? (
          <Text style={{ color: colors.text.secondary, fontSize: 15, lineHeight: 22, marginTop: 12 }}>
            {note}
          </Text>
        ) : null}
        <Text style={{ color: colors.text.tertiary, fontSize: 12, marginTop: 24 }}>
          Phase A placeholder — copy and interactions arrive in Phase B.
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={onNext}
        style={{
          alignItems: 'center',
          backgroundColor: colors.text.primary,
          borderRadius: 14,
          padding: 16,
        }}
      >
        <Text style={{ color: colors.background, fontSize: 16, fontWeight: '600' }}>Continue</Text>
      </Pressable>
    </View>
  );
}
