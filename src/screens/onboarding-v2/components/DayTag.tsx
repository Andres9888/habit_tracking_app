import { Text } from 'react-native';

interface DayTagProps {
  label: string;
  variant?: 'copper' | 'green';
}

const STYLES = {
  copper: { bg: 'rgba(184, 115, 51, 0.15)', fg: '#8B5A2B' },
  green: { bg: 'rgba(16, 185, 129, 0.15)', fg: '#065F46' },
} as const;

export function DayTag({ label, variant = 'copper' }: DayTagProps) {
  const style = STYLES[variant];
  return (
    <Text
      style={{
        alignSelf: 'flex-start',
        backgroundColor: style.bg,
        borderRadius: 10,
        color: style.fg,
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1.5,
        overflow: 'hidden',
        paddingHorizontal: 12,
        paddingVertical: 4,
        textTransform: 'uppercase',
      }}
    >
      {label}
    </Text>
  );
}
