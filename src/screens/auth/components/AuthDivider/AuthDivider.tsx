import { Text, View, StyleSheet } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

export function AuthDivider() {
  const { colors } = useThemeColors();

  return (
    <View className='my-4 flex-row items-center'>
      <View style={[styles.line, { backgroundColor: colors.border }]} />
      <Text
        style={[styles.text, { color: colors.text.tertiary }]}
      >
        OR
      </Text>
      <View style={[styles.line, { backgroundColor: colors.border }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    flex: 1,
    height: 1,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 1.5,
    marginHorizontal: 16,
  },
});
