# Clerk Auth - Troubleshooting Guide

## Common Issues & Solutions

### Issue: Page doesn't load after auth implementation

**Possible Causes:**

1. **Clerk Publishable Key Missing/Invalid**
   - Check `.env.local` has `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Verify key starts with `pk_test_` or `pk_live_`
   - Restart dev server after adding env variable

2. **Convex Dev Server Not Running**
   - Run `npx convex dev` in separate terminal
   - Check Convex URL in `.env.local` matches deployment

3. **OAuth Not Configured in Clerk**
   - If seeing OAuth errors, disable social buttons temporarily
   - Comment out `<SocialLoginButtons />` in SignInScreen/SignUpScreen
   - Configure Google/Apple OAuth in Clerk Dashboard later

4. **Metro Bundler Cache Issue**
   - Clear cache: `npx expo start --clear`
   - Or: `rm -rf node_modules/.cache`

5. **Missing Dependencies**
   - Run `npm install` to ensure all packages installed
   - Check `@clerk/clerk-expo`, `convex/react-clerk` are installed

---

## Quick Fixes

### Fix 1: Temporarily Disable Auth (Testing)

If you need to bypass auth temporarily to test:

```tsx
// src/App.tsx
export default function App() {
  // TEMPORARY: Skip auth for testing
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <ConvexProvider client={convex}>
          <HabitsApp />
        </ConvexProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
```

### Fix 2: Simplify AuthGate (Debug)

```tsx
// src/components/auth/AuthGate.tsx
export function AuthGate() {
  const { isLoaded, isSignedIn } = useAuth();

  console.log('AuthGate:', { isLoaded, isSignedIn });

  if (!isLoaded) {
    console.log('Clerk not loaded yet...');
    return <Text>Loading Clerk...</Text>;
  }

  if (!isSignedIn) {
    console.log('User not signed in');
    return <WelcomeScreen />;
  }

  console.log('User signed in, loading app');
  return <HabitsApp />;
}
```

### Fix 3: Check Clerk Configuration

```bash
# Verify Clerk key is loaded
npx expo start
# Look for console output: "App initializing with Clerk..."
# If not showing, env variable not loaded
```

### Fix 4: Disable Social Login Temporarily

```tsx
// src/screens/auth/SignInScreen.tsx
// Comment out this line:
// <SocialLoginButtons />
```

---

## Debugging Steps

1. **Check Console Logs**
   - Open browser DevTools (web) or React Native Debugger
   - Look for errors related to Clerk, Convex, or auth

2. **Verify Clerk Dashboard**
   - Go to https://dashboard.clerk.com
   - Check your app is created
   - Verify JWT template exists with audience `convex`

3. **Test Convex Connection**
   - Run `npx convex dev`
   - Should show "Convex functions ready"
   - Check `convex/auth.config.ts` domain matches Clerk

4. **Check Network Tab**
   - Look for failed requests to Clerk or Convex
   - 401 errors = auth config issue
   - CORS errors = domain mismatch

---

## Error Messages & Solutions

### "Missing Clerk publishable key"
- Add `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` to `.env.local`
- Restart Metro bundler

### "Failed to sync user"
- Check Convex dev server is running
- Verify `convex/auth.config.ts` has correct Clerk domain
- Check `convex/users.ts` mutation exists

### "OAuth error"
- OAuth not configured in Clerk Dashboard yet
- Temporarily comment out `<SocialLoginButtons />`
- Or configure Google/Apple credentials in Clerk

### "Cannot read property 'getUserIdentity'"
- Convex auth config incorrect
- Check `domain` in `convex/auth.config.ts`
- Should be: `https://vital-elf-64.clerk.accounts.dev`

### Blank white screen
- Check browser console for errors
- Try clearing cache: `npx expo start --clear`
- Verify all imports resolve (no missing files)

---

## Testing Checklist

Before diagnosing further, verify:

- [ ] `.env.local` has `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
- [ ] `npx convex dev` is running
- [ ] Metro bundler restarted after env changes
- [ ] No TypeScript errors in auth files
- [ ] Browser console shows no errors
- [ ] Clerk Dashboard app created

---

## Rollback to Working State

If nothing works, revert auth changes:

```bash
# Restore App.tsx to use HabitsApp directly
git checkout HEAD -- src/App.tsx

# Or manually remove auth:
# - Comment out AuthGate in App.tsx
# - Return <HabitsApp /> directly
```

---

**Need more help?** Share:
1. What you see on screen (blank, error, loading forever?)
2. Console errors (screenshot or copy/paste)
3. What you've tried from this guide
