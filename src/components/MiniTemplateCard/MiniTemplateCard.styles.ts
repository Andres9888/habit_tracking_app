/**
 * Styles for MiniTemplateCard component
 */

import { StyleSheet } from 'react-native';
import { cardStyles } from './styles/cardStyles';
import { importButtonStyles } from './styles/importButtonStyles';
import { headerStyles } from './styles/headerStyles';

export const styles = StyleSheet.create({
  ...cardStyles,
  ...importButtonStyles,
  ...headerStyles,
});
