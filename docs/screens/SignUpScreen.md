# SignUpScreen (React Native)

Email/password registration with email code verification using Clerk.

## Local State

- `emailAddress: string`
- `password: string`
- `pendingVerification: boolean`
- `code: string`
- `isLoading: boolean`

## Behavior

- Initiates sign up then prepares email verification
- On verify, sets active session

## Example

```tsx
import SignUpScreen from "src/screens/auth/SignUpScreen";

<SignUpScreen />
```
