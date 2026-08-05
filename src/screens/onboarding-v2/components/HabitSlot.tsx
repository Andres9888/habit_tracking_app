import { Text, View } from 'react-native';

interface HabitSlotProps {
  index: number;
  label: string;
  locked?: boolean;
}

export function HabitSlot({ index, label, locked = false }: HabitSlotProps) {
  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: locked ? 'transparent' : '#FAF6EE',
        borderColor: locked ? '#B5B0A0' : '#E5E1D8',
        borderRadius: 11,
        borderStyle: locked ? 'dashed' : 'solid',
        borderWidth: 1,
        flexDirection: 'row',
        gap: 10,
        marginBottom: 8,
        paddingHorizontal: 14,
        paddingVertical: 14,
      }}
    >
      <View
        style={{
          alignItems: 'center',
          backgroundColor: locked ? 'transparent' : '#FEF3C7',
          borderColor: locked ? '#B5B0A0' : 'transparent',
          borderRadius: 11,
          borderStyle: 'dashed',
          borderWidth: locked ? 1 : 0,
          height: 22,
          justifyContent: 'center',
          width: 22,
        }}
      >
        <Text
          style={{
            color: locked ? '#B5B0A0' : '#92400E',
            fontSize: 12,
            fontWeight: '700',
          }}
        >
          {index}
        </Text>
      </View>
      <Text
        style={{
          color: locked ? '#B5B0A0' : '#111',
          flex: 1,
          fontSize: 15,
          fontStyle: locked ? 'italic' : 'normal',
          fontWeight: locked ? '500' : '600',
        }}
      >
        {label}
      </Text>
    </View>
  );
}
