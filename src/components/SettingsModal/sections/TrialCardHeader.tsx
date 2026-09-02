/** TrialCardHeader — crown tile + plan name + days-remaining line. */
import { Text, View } from 'react-native';
import { Crown } from 'lucide-react-native';
import { airy } from '@/theme/airyScale';
import { iconSizes } from '@/theme/iconSizes';
import { typography, fontWeights } from '@/theme/typography';
import { useThemeColors } from '../../../theme/ThemeContext';

interface Props {
  trialLine: string;
}

export function TrialCardHeader({ trialLine }: Props) {
  const { colors: themeColors } = useThemeColors();

  return (
    <View className='flex-row items-center' style={{ gap: 14 }}>
      <View
        className='items-center justify-center'
        style={{
          backgroundColor: themeColors.status.warningLight,
          borderRadius: airy.tileRadius,
          height: 44,
          width: 44,
        }}
      >
        <Crown color={themeColors.status.warningText} size={iconSizes.medium} />
      </View>
      <View className='flex-1'>
        <Text
          style={{
            ...typography.body,
            fontWeight: fontWeights.bold,
            color: themeColors.text.primary,
          }}
        >
          Chain Day Pro
        </Text>
        <Text
          className='mt-0.5'
          style={{
            ...typography.caption,
            fontWeight: fontWeights.semibold,
            color: themeColors.status.warningText,
          }}
        >
          {trialLine}
        </Text>
      </View>
    </View>
  );
}
