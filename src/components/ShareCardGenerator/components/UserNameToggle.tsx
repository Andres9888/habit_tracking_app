/**
 * UserNameToggle Component
 * Toggle control for showing/hiding the user name on the share card
 */

import React from 'react';
import { View, Text, Switch } from 'react-native';
import { useAppTheme } from '../../../theme';
import { colors } from '@/theme/colors';
import { controlsStyles as styles } from '../styles';

interface UserNameToggleProps {
  showUserName: boolean;
  userName?: string;
  onToggle: (value: boolean) => void;
}

export function UserNameToggle({
  showUserName,
  userName,
  onToggle,
}: UserNameToggleProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.optionGroup}>
      <View style={styles.toggleRow}>
        <View style={styles.toggleLabelContainer}>
          <Text
            style={[
              styles.optionLabel,
              { color: theme.custom.colors.gray[700], marginBottom: 0 },
            ]}
          >
            Show User Name
          </Text>
          {userName ? <Text
              style={[
                styles.toggleSubtext,
                { color: theme.custom.colors.gray[500] },
              ]}
            >
              {userName}
            </Text> : null}
        </View>
        <Switch
          thumbColor={colors.text.inverse}
          trackColor={{
            false: theme.custom.colors.gray[300],
            true: theme.custom.colors.primary[500],
          }}
          value={showUserName}
          onValueChange={onToggle}
        />
      </View>
    </View>
  );
}
