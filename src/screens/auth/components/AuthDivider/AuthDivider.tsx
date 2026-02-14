import { Text, View, StyleSheet } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';

export function AuthDivider() {
  const { colors } = useThemeColors();

  return (
    <View style={styles.container}>
      <View style={[styles.line, { backgroundColor: colors.border }]} />
      <Text style={[styles.text, { color: colors.text.tertiary }]}>OR</Text>
      <View style={[styles.line, { backgroundColor: colors.border }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 16,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 1.5,
    marginHorizontal: 16,
  },
});
