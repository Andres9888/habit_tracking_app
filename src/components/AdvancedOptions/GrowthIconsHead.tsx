/** Title row for inline Growth Icons — accent icon tile. */
import { Text } from 'react-native';
import { AdvancedOptionsSectionHead } from './AdvancedOptionsSectionHead';
import { useAdvancedTokens } from './useAdvancedTokens';

interface Props {
  starting: string;
  presetLabel: string;
}

export function GrowthIconsHead({ starting, presetLabel }: Props) {
  const t = useAdvancedTokens();
  return (
    <AdvancedOptionsSectionHead
      description='How your habit’s strength looks as it grows.'
      icon={<Text style={{ fontSize: 16 }}>{starting}</Text>}
      tileBackground={t.accentTile}
      title='Growth Icons'
      valueLabel={presetLabel}
    />
  );
}
