/**
 * ShareCardFooter Component
 * Footer section with science badge and app info
 */

import React from 'react';
import { View, Text } from 'react-native';
import { shareCardFooterStyles as styles } from '../styles';

interface ShareCardFooterProps {
  showUserName: boolean;
  userName?: string;
}

export function ShareCardFooter({
  showUserName,
  userName,
}: ShareCardFooterProps) {
  return (
    <View style={styles.footerContainer}>
      <View style={styles.scienceBadge}>
        <Text style={styles.scienceBadgeText}>
          Research-backed (Lally et al. 2010)
        </Text>
      </View>

      <View style={styles.appInfo}>
        <Text style={styles.appName}>Chain Day</Text>
        {showUserName && userName ? <Text style={styles.userName}>by {userName}</Text> : null}
      </View>
    </View>
  );
}
