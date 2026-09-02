/** useEditDisplayName — persists a new display name to Clerk.
 *
 *  The profile hero has always advertised "Edit name, photo & account", but no
 *  name-edit path existed anywhere in the app: the photo picker lived on the
 *  avatar, email was read-only, and the name was derived from Clerk with no
 *  setter. This is that missing path. */
import { useCallback, useState } from 'react';
import { useUser } from '@clerk/clerk-expo';

/** Clerk stores first/last separately; Settings edits one visible field. */
function splitName(input: string): { firstName: string; lastName: string } {
  const parts = input.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: '', lastName: '' };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  };
}

export function useEditDisplayName() {
  const { user } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveName = useCallback(
    async (nextName: string): Promise<boolean> => {
      const trimmed = nextName.trim();
      if (!trimmed) {
        setError('Name can’t be empty.');
        return false;
      }
      if (!user) {
        setError('You need to be signed in to change your name.');
        return false;
      }

      setIsSaving(true);
      setError(null);
      try {
        await user.update(splitName(trimmed));
        return true;
      } catch {
        setError('Couldn’t save your name. Please try again.');
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [user]
  );

  const clearError = useCallback(() => setError(null), []);

  return { clearError, error, isSaving, saveName };
}
