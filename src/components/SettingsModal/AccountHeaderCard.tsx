/** AccountHeaderCard — compact account header with inline manage/sign-out actions */
import { View, Text, Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { AnimatedPressable } from '../ui/AnimatedPressable';
import { ProfileHeroAvatar } from './components/ProfileHeroAvatar';
import { ProfilePremiumBadge } from './ProfilePremiumBadge';
import { useAccountHeader } from './AccountHeaderCard.hooks';
import { getRaisedSurface } from './raisedSurface';
import { shadows } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface AccountHeaderCardProps {
  isPremium: boolean;
  isSigningOut: boolean;
  onOpenAccount: () => void;
  onSignOut: () => void;
  onManageSubscription: () => void;
}

export function AccountHeaderCard(p: AccountHeaderCardProps) {
  const { themeColors, isDark, name, imageUrl, initial } = useAccountHeader();
  return (
    <View
      className='mb-3 flex-row items-center rounded-2xl px-4 py-3'
      style={[
        { backgroundColor: getRaisedSurface(isDark) },
        shadows.floatingActionButton,
      ]}
    >
      <AnimatedPressable
        accessibilityLabel='Account settings'
        accessibilityRole='button'
        animationConfig={{ hapticStyle: 'light' }}
        className='flex-1 flex-row items-center'
        onPress={p.onOpenAccount}
      >
        <ProfileHeroAvatar
          imageUrl={imageUrl}
          initial={initial}
          size={50}
          themeColors={themeColors}
        />
        <View className='ml-3 flex-1'>
          <View className='flex-row items-center' style={{ gap: 7 }}>
            <Text
              style={{
                ...typography.bodyBold,
                color: themeColors.text.primary,
              }}
            >
              {name}
            </Text>
            {p.isPremium ? <ProfilePremiumBadge variant='compact' /> : null}
          </View>
          <View className='mt-1 flex-row items-center' style={{ gap: 8 }}>
            {p.isPremium ? (
              <Pressable
                accessibilityRole='button'
                hitSlop={6}
                onPress={p.onManageSubscription}
              >
                <Text
                  style={{
                    ...typography.bodySmall,
                    color: themeColors.primary[700],
                    fontWeight: '600',
                  }}
                >
                  Manage subscription
                </Text>
              </Pressable>
            ) : null}
            <Pressable
              accessibilityRole='button'
              disabled={p.isSigningOut}
              hitSlop={6}
              onPress={p.onSignOut}
            >
              <Text
                style={{
                  ...typography.bodySmall,
                  color: themeColors.text.secondary,
                  fontWeight: '600',
                }}
              >
                Sign out
              </Text>
            </Pressable>
          </View>
        </View>
        <ChevronRight color={themeColors.text.tertiary} size={20} />
      </AnimatedPressable>
    </View>
  );
}
