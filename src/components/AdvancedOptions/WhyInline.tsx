/** Inline "Your why" — first row of the More to customize panel. */
import { Quote } from 'lucide-react-native';
import { View } from 'react-native';
import { colors } from '@/theme/colors';
import { iconSizes } from '@/theme/iconSizes';
import { AdvancedOptionsSectionHead } from './AdvancedOptionsSectionHead';
import { WhyField } from './WhyField';

interface Props {
  why: string;
  onWhyChange: (text: string) => void;
}

export function WhyInline({ why, onWhyChange }: Props) {
  return (
    <View>
      <AdvancedOptionsSectionHead
        chipBackground={colors.parchment.bg}
        chipForeground={colors.parchment.text}
        description='One line, shown above Complete today.'
        icon={
          <Quote
            color={colors.parchment.text}
            size={iconSizes.small}
            strokeWidth={2}
          />
        }
        tileBackground={colors.parchment.bg}
        title='Your why'
        valueLabel={why.trim().length > 0 ? 'Set' : 'Not set'}
      />
      <WhyField value={why} onChange={onWhyChange} />
    </View>
  );
}
