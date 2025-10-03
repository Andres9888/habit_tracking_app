# ArchivedHabitsModal (React Native)

Lists archived habits with actions to restore or permanently delete.

## Props

- `onClose: () => void`
- `onBack: () => void`

## Usage

```tsx
import ArchivedHabitsModal from "src/components/ArchivedHabitsModal";

<ArchivedHabitsModal onClose={handleClose} onBack={() => setView('settings')} />
```

## Data

- `useQuery(api.habits.listArchived)` — fetch archived habits
- `useMutation(api.habits.unarchive)` — restore
- `useMutation(api.habits.remove)` — permanent delete

## UX

- Haptic feedback for actions
- Confirmation dialog for destructive delete
