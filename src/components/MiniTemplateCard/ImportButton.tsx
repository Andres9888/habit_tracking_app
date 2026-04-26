/**
 * Import button sub-component for MiniTemplateCard
 */

import React from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { Check, Plus } from 'lucide-react-native';
import { styles } from './MiniTemplateCard.styles';
import { SUCCESS_COLOR } from './constants';
import { iconSizes } from '@/theme/iconSizes';

interface ImportButtonProps {
  name: string;
  iconColor: string;
  isImporting?: boolean;
  isImported?: boolean;
  importButtonStyle: object;
  checkmarkStyle: object;
  onImport: () => void;
}

export function ImportButton({
  name,
  iconColor,
  isImporting,
  isImported,
  importButtonStyle,
  checkmarkStyle,
  onImport,
}: ImportButtonProps) {
  return (
    <Animated.View style={[styles.importButtonWrapper, importButtonStyle]}>
      <Pressable
        accessible
        accessibilityLabel={isImported ? `${name} added` : `Add ${name} habit`}
        accessibilityRole='button'
        disabled={isImporting || isImported}
        hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
        style={[
          styles.importButton,
          { backgroundColor: isImported ? SUCCESS_COLOR : iconColor },
        ]}
        onPress={onImport}
      >
        {isImporting ? (
          <ActivityIndicator color='#fff' size={iconSizes.micro} />
        ) : isImported ? (
          <Animated.View style={[styles.checkmarkContainer, checkmarkStyle]}>
            <Check color='#fff' size={iconSizes.small} strokeWidth={3} />
            <Text style={styles.importButtonText}>Added</Text>
          </Animated.View>
        ) : (
          <>
            <Plus color='#fff' size={iconSizes.small} strokeWidth={3} />
            <Text style={styles.importButtonText}>Add</Text>
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}
