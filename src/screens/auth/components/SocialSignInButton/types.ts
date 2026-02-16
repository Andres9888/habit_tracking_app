export interface SocialSignInButtonProps {
  provider: 'google' | 'apple';
  onPress: () => void;
  isLoading: boolean;
  disabled?: boolean;
  testID?: string;
}
