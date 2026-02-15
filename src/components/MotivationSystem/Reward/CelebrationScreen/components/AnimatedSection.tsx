/**
 * AnimatedSection - Wrapper for animated celebration content sections
 * Combines AnimatedContent wrapper with optional View margin
 */

import React from 'react';
import { View } from 'react-native';

import { AnimatedContent } from './animations/AnimatedContent';

interface AnimatedSectionProps {
  index: number;
  visible: boolean;
  reduceMotion: boolean;
  children: React.ReactNode;
  className?: string;
}

export function AnimatedSection({
  index,
  visible,
  reduceMotion,
  children,
  className = 'mt-4',
}: AnimatedSectionProps) {
  return (
    <AnimatedContent
      index={index}
      reduceMotion={reduceMotion}
      visible={visible}
    >
      <View className={className}>{children}</View>
    </AnimatedContent>
  );
}
