/** TrialCardHeader — crown tile + title/trial-line for TrialCard */
import { Text, View } from 'react-native';
import { Crown } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { colors } from '@/theme/colors';
import { typography, fontWeights } from '@/theme/typography';
import { useSettingsScale } from '../useSettingsScale';

interface TrialCardHeaderProps {
  trialLine: string;
}

export function TrialCardHeader({ trialLine }: TrialCardHeaderProps) {
  const k = useSettingsScale();
  return (
    <View className='flex-row items-center' style={{ gap: k(14) }}>
      <View
        className='items-center justify-center'
        style={{
          backgroundColor: colors.streak[700],
          width: k(40),
          height: k(40),
          borderRadius: k(11),
        }}
      >
        <Crown color='#FFFFFF' size={k(iconSizes.medium)} />
      </View>
      <View className='flex-1'>
        <Text
          style={{
            ...typography.body,
            fontSize: k(15),
            fontWeight: fontWeights.bold,
            color: colors.gray[800],
          }}
        >
          Chain Day Pro
        </Text>
        <Text
          className='mt-0.5'
          style={{
            ...typography.caption,
            fontSize: k(12),
            fontWeight: fontWeights.semibold,
            color: colors.streak[700],
          }}
        >
          {trialLine}
        </Text>
      </View>
    </View>
  );
}
