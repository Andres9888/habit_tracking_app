import { Text, View } from 'react-native';

import {
  dividerLineStyle,
  dividerStyle,
  dividerTextBaseStyle,
} from './InlineHint.styles';
import { useEmptyStateColors } from './useEmptyStateColors';

export function InlineHintDivider() {
  const colors = useEmptyStateColors();

  return (
    <View style={dividerStyle} testID='inline-hint-divider'>
      <View
        style={[dividerLineStyle, { backgroundColor: colors.inputBorder }]}
        testID='inline-hint-divider-line-left'
      />
      <Text style={[dividerTextBaseStyle, { color: colors.textSecondary }]}>
        or explore
      </Text>
      <View
        style={[dividerLineStyle, { backgroundColor: colors.inputBorder }]}
        testID='inline-hint-divider-line-right'
      />
    </View>
  );
}
