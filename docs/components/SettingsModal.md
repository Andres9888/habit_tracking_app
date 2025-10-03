# SettingsModal (React Native)

Modal that shows user info and actions (archived habits, sign out).

## Props

- `visible: boolean`
- `onClose: () => void`

## Usage

```tsx
import SettingsModal from "src/components/SettingsModal";

<SettingsModal visible={visible} onClose={() => setVisible(false)} />
```

## Behavior

- Resets internal view to `settings` when closed.
- Uses Clerk's `useAuth`/`useUser` for session management.
- Opens `ArchivedHabitsModal` when selecting Archive.
