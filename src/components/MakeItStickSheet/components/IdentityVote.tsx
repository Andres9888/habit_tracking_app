import { Text } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { styles as s } from '../MakeItStickSheet.styles';

interface IdentityVoteProps {
  identity: string;
}

export function IdentityVote({ identity }: IdentityVoteProps) {
  const { colors } = useThemeColors();

  return (
    <Text style={[s.identity, { color: colors.text.primary }]}>
      Every rep is a vote for: “{identity}”
    </Text>
  );
}
