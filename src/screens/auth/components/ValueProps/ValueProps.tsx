/**
 * ValueProps - Three-step value proposition for the welcome screen
 */

import { Text, View, StyleSheet } from 'react-native';
import { Link, Activity, Trophy } from 'lucide-react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { fontFamilies } from '@/theme/typography';

const PROPS = [
  { Icon: Link, label: 'Start your chain' },
  { Icon: Activity, label: 'Track your streak' },
  { Icon: Trophy, label: 'Build momentum' },
] as const;

export function ValueProps() {
  const { colors } = useThemeColors();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.gray[100] + '99' }]}
    >
      {PROPS.map(({ Icon, label }) => (
        <View key={label} style={styles.item}>
          <View style={[styles.iconBox, { backgroundColor: '#D1FAE5' }]}>
            <Icon color='#059669' size={18} strokeWidth={2.5} />
          </View>
          <Text style={[styles.label, { color: colors.text.primary }]}>
            {label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 4,
    width: '100%',
  },
  iconBox: {
    alignItems: 'center',
    borderRadius: 10,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  label: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 15,
    fontWeight: '500',
  },
});
