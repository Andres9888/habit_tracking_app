/**
 * MetadataPill - neutral white pill with a bordered surface for hero metadata.
 * The icon (passed in) carries any color; the pill itself stays neutral.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '@/theme';
import { heroStyles } from '../styles';

interface MetadataPillProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function MetadataPill({ children, icon }: MetadataPillProps) {
  return (
    <View
      style={[
        heroStyles.metadataPill,
        { backgroundColor: '#FFFFFF', borderColor: colors.border },
      ]}
    >
      {icon}
      <Text style={[heroStyles.metadataPillText, { color: colors.gray[700] }]}>
        {children}
      </Text>
    </View>
  );
}
