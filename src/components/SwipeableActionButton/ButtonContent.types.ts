import React from 'react';

export interface ButtonContentProps {
  Icon: React.ComponentType<{
    className?: string;
    size?: number;
    strokeWidth?: number;
  }>;
  label: string;
  subtitle?: string;
  isDestructive: boolean;
  isBoost: boolean;
  showChevron: boolean;
  accessibleLabel: string;
  onPress: () => void;
}
