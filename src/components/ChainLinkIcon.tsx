import React from 'react';
import { View } from 'react-native';
import { Link2 } from 'lucide-react-native';

interface ChainLinkIconProps {
  color?: string;
  size?: number;
}

export const ChainLinkIcon: React.FC<ChainLinkIconProps> = ({
  color = '#ffffff',
  size = 20
}) => {
  return (
    <View className="items-center justify-center">
      <Link2 color={color} size={size} strokeWidth={2.5} />
    </View>
  );
};
