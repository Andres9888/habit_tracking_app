# SignInScreen (React Native)

Email/password sign in using Clerk.

## Local State

- `emailAddress: string`
- `password: string`
- `isLoading: boolean`

## Behavior

- Uses `useSignIn` and `setActive` from Clerk
- Shows errors via `Alert`

## Example

```tsx
import SignInScreen from "src/screens/auth/SignInScreen";

<SignInScreen />
```
