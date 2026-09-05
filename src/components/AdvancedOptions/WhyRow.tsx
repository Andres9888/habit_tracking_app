/** "Your why" panel row — one line of motivation shown above Complete today. */
import { Quote } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { HelperLine } from './panel/HelperLine';
import { PanelRow } from './panel/PanelRow';
import { usePanelTokens } from './panel/panelTokens';
import { WhyField } from './WhyField';

interface Props {
  why: string;
  onWhyChange: (text: string) => void;
  open: boolean;
  onToggle: () => void;
  divided: boolean;
}

const UNSET_HINT = 'One line you’ll see each time you check in';

export function WhyRow({ why, onWhyChange, open, onToggle, divided }: Props) {
  const t = usePanelTokens();
  const trimmed = why.trim();
  const isSet = trimmed.length > 0;

  return (
    <PanelRow
      accessibilityLabel={isSet ? `Your why, ${trimmed}` : 'Your why, add a line'}
      divided={divided}
      hint={isSet ? trimmed : UNSET_HINT}
      hue='why'
      icon={
        <Quote
          color={t.hues.why.ink}
          size={iconSizes.small}
          strokeWidth={2}
        />
      }
      open={open}
      title='Your why'
      value={open && !isSet ? null : { label: isSet ? 'Set' : 'Add', set: isSet }}
      onToggle={onToggle}
    >
      <WhyField autoFocus={open} value={why} onChange={onWhyChange} />
      <HelperLine>SHOWN ABOVE COMPLETE TODAY</HelperLine>
    </PanelRow>
  );
}
