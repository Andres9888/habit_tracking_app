/* eslint-disable max-lines */
import { View, Text } from 'react-native';
import { Trophy } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { AVATAR_GRADIENT, XP_GRADIENT, TROPHY_GRADIENT } from '../constants';
import type { CharacterData } from '../types';

interface CharacterCardProps {
  data: CharacterData;
}

export function CharacterCard({ data }: CharacterCardProps) {
  const { colors, isDark } = useThemeColors();
  const xpProgress = (data.xp / data.xpToNextLevel) * 100;
  const xpRemaining = data.xpToNextLevel - data.xp;

  return (
    <Animated.View
      accessible
      accessibilityLabel={`Level ${data.level} ${data.title}, ${data.xp} of ${data.xpToNextLevel} experience points`}
      accessibilityRole="summary"
      entering={FadeInDown.delay(60).springify().damping(18)}
      style={{
        marginBottom: 24,
        overflow: 'hidden',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        shadowColor: isDark ? '#000' : '#1c1917',
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: isDark ? 0.3 : 0.08,
        shadowRadius: 16,
        elevation: 3,
      }}
    >
      <View style={{ gap: 24, paddingHorizontal: 24, paddingVertical: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{
              height: 80, width: 80, alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', borderRadius: 40,
            }}>
              <LinearGradient
                colors={AVATAR_GRADIENT}
                end={{ x: 1, y: 1 }}
                start={{ x: 0, y: 0 }}
                style={{ alignItems: 'center', height: '100%', justifyContent: 'center', width: '100%' }}
              >
                <Text style={{ fontSize: 30, lineHeight: 36 }}>🦸</Text>
              </LinearGradient>
            </View>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 16, fontWeight: '400', lineHeight: 24, letterSpacing: -0.3125, color: colors.text.primary }}>
                  Level {data.level}
                </Text>
                <Text style={{ fontSize: 18 }}>✨</Text>
              </View>
              <Text style={{ fontSize: 14, fontWeight: '400', lineHeight: 20, letterSpacing: -0.15, color: colors.text.secondary }}>
                {data.title}
              </Text>
            </View>
          </View>
          <View style={{ overflow: 'hidden', borderRadius: 9999 }}>
            <LinearGradient
              colors={TROPHY_GRADIENT}
              end={{ x: 1, y: 0 }}
              start={{ x: 0, y: 0 }}
              style={{ alignItems: 'center', flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 10 }}
            >
              <Trophy color='white' size={20} />
              <Text style={{ fontSize: 16, fontWeight: '400', lineHeight: 24, letterSpacing: -0.3125, color: 'white' }}>
                10
              </Text>
            </LinearGradient>
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 14, fontWeight: '400', lineHeight: 20, letterSpacing: -0.15, color: colors.text.secondary }}>
              Experience
            </Text>
            <Text style={{ fontSize: 14, fontWeight: '400', lineHeight: 20, letterSpacing: -0.15, color: colors.text.primary }}>
              {data.xp}/{data.xpToNextLevel} XP
            </Text>
          </View>
          <View
            accessible
            accessibilityLabel={`Experience progress: ${Math.round(xpProgress)} percent`}
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: data.xpToNextLevel, now: data.xp }}
            style={{ height: 12, width: '100%', overflow: 'hidden', borderRadius: 9999, backgroundColor: isDark ? colors.border : '#e7e5e4' }}
          >
            <View style={{ width: `${xpProgress}%`, height: '100%' }}>
              <LinearGradient
                colors={XP_GRADIENT}
                end={{ x: 1, y: 0 }}
                start={{ x: 0, y: 0 }}
                style={{ borderRadius: 9999, height: '100%', width: '100%' }}
              />
            </View>
          </View>
          <Text style={{ textAlign: 'center', fontSize: 12, fontWeight: '400', lineHeight: 16, color: colors.text.tertiary }}>
            {xpRemaining} XP to Level {data.level + 1}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}
