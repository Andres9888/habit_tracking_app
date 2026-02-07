/** Loading state shown when HabitDetailScreen modal is visible but habit data hasn't loaded yet */
import { ActivityIndicator, View } from 'react-native';
import { colors } from '../../../theme/colors';

export function DetailLoadingState() {
  return (
    <View
      accessible
      accessibilityLabel='Loading habit details'
      accessibilityRole='progressbar'
      className='flex-1 items-center justify-center'
      style={{ backgroundColor: colors.light.background }}
    >
      <ActivityIndicator color={colors.gray[500]} size='large' />
    </View>
  );
}
