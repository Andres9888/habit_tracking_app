/**
 * MetadataPill - Reusable metadata pill component for HeroSection
 */

import React from 'react';
import { View, Text } from 'react-native';
import { heroStyles } from '../styles';

interface MetadataPillProps {
  iconColor: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function MetadataPill({ iconColor, children, icon }: MetadataPillProps) {
  return (
    <View
      style={[
        heroStyles.metadataPill,
        {
          backgroundColor: `${iconColor}10`,
          borderColor: `${iconColor}20`,
        },
      ]}
    >
      {icon}
      <Text style={[heroStyles.metadataPillText, { color: iconColor }]}>
        {children}
      </Text>
    </View>
  );
}
