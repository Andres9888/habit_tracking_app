/**
 * Styles for MiniTemplateCard component
 */

import { StyleSheet } from 'react-native';

import { cardStyles } from './styles/cardStyles';
import { headerStyles } from './styles/headerStyles';
import { importButtonStyles } from './styles/importButtonStyles';

export const styles = StyleSheet.create({
  ...cardStyles,
  ...importButtonStyles,
  ...headerStyles,
});
