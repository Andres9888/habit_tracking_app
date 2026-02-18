/**
 * Demo List Component - Example for testing purposes
 * This component demonstrates a list rendering pattern
 */

import React from 'react';
import { View, Text } from 'react-native';

interface DemoItem {
  id: string;
  name: string;
}

interface DemoListComponentProps {
  items: DemoItem[];
}

export function DemoListComponent({ items }: DemoListComponentProps) {
  return (
    <View>
      {items.map((item) => (
        <View key={item.id} style={{ paddingVertical: 8 }}>
          <Text>{item.name}</Text>
        </View>
      ))}
    </View>
  );
}
