import { View, Text } from 'react-native';
import { Trophy } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '../../../theme/ThemeContext';
import { AVATAR_GRADIENT, TROPHY_GRADIENT } from '../constants';
import type { CharacterData } from '../types';
import { headerRowStyles as styles } from './CharacterHeaderRow.styles';

interface CharacterHeaderRowProps {
  data: CharacterData;
}

function LevelInfo({ data }: CharacterHeaderRowProps) {
  const { colors } = useThemeColors();

  return (
    <View style={styles.levelCol}>
      <View style={styles.levelRow}>
        <Text style={[styles.levelText, { color: colors.text.primary }]}>
          Level {data.level}
        </Text>
        <Text style={styles.sparkleEmoji}>✨</Text>
      </View>
      <Text style={[styles.titleText, { color: colors.text.secondary }]}>
        {data.title}
      </Text>
    </View>
  );
}

export function CharacterHeaderRow({ data }: CharacterHeaderRowProps) {
  return (
    <View style={styles.headerRow}>
      <View style={styles.avatarRow}>
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={AVATAR_GRADIENT}
            end={{ x: 1, y: 1 }}
            start={{ x: 0, y: 0 }}
            style={styles.avatarGradient}
          >
            <Text style={styles.avatarEmoji}>🦸</Text>
          </LinearGradient>
        </View>
        <LevelInfo data={data} />
      </View>
      <View style={styles.trophyBadge}>
        <LinearGradient
          colors={TROPHY_GRADIENT}
          end={{ x: 1, y: 0 }}
          start={{ x: 0, y: 0 }}
          style={styles.trophyGradient}
        >
          <Trophy color='white' size={iconSizes.medium} />
          <Text style={styles.trophyText}>
            {data.recentAchievements.length}
          </Text>
        </LinearGradient>
      </View>
    </View>
  );
}
