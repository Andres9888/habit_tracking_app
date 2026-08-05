import { Text, View } from 'react-native';
import type { SemanticColors } from '@/theme/darkColors';

interface MechanicStatCardProps {
  color: string;
  colors: SemanticColors;
  label: string;
  scale: number;
  symbol: string;
  unit: string;
  value: string;
  cardStyle: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    padding: number;
  };
}

export function MechanicStatCard(props: MechanicStatCardProps) {
  return (
    <View className='flex-1 items-center rounded-2xl' style={props.cardStyle}>
      <Text
        style={{
          color: props.color,
          fontSize: 18 * props.scale,
          lineHeight: 20 * props.scale,
        }}
      >
        {props.symbol}
      </Text>
      <Text
        className='font-bold'
        style={{
          color: props.colors.text.primary,
          fontSize: 12 * props.scale,
          marginTop: 2 * props.scale,
        }}
      >
        {props.label}
      </Text>
      <Text
        className='font-extrabold'
        style={{ color: props.color, fontSize: 22 * props.scale }}
      >
        {props.value}
      </Text>
      <Text
        style={{
          color: props.colors.text.tertiary,
          fontSize: 10 * props.scale,
          marginTop: props.scale,
        }}
      >
        {props.unit}
      </Text>
    </View>
  );
}
