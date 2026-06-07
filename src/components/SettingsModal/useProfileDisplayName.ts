import { useUser } from '@clerk/clerk-expo';

export function useProfileDisplayName() {
  const { user } = useUser();
  const name =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    user?.username ||
    'User';

  return {
    email: user?.primaryEmailAddress?.emailAddress,
    initial: name.charAt(0).toUpperCase(),
    name,
  };
}
