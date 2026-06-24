/** SettingsRowHelp — quiet (?) affordance that explains an ambiguous setting */
import { Alert, Pressable } from 'react-native';
import { HelpCircle } from 'lucide-react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { RowHelp } from './SettingsRow.types';

interface SettingsRowHelpProps {
  help: RowHelp;
}

export function SettingsRowHelp({ help }: SettingsRowHelpProps) {
  const { colors: themeColors } = useThemeColors();

  return (
    <Pressable
      accessibilityHint='Explains what this setting does'
      accessibilityLabel={`What is "${help.title}"?`}
      accessibilityRole='button'
      hitSlop={8}
      onPress={() => Alert.alert(help.title, help.body)}
    >
      <HelpCircle color={themeColors.text.tertiary} size={15} />
    </Pressable>
  );
}
