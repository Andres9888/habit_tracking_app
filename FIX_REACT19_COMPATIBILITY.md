# Fix React 19 Compatibility Issues

## Root Cause

You're using React 19.1.0 which has breaking changes that aren't compatible with:

- React Native Paper 5.x
- Other React Native libraries

The errors you're seeing:

```
ERROR [TypeError: Cannot read property 'displayName' of undefined]
ERROR [runtime not ready]: TypeError: Cannot read property 'secondary' of undefined
```

These are caused by React 19's internal changes to component types.

## Solution: Downgrade to React 18

### Step 1: Update package.json

Replace these lines in your package.json dependencies:

```json
"react": "19.1.0",
"react-dom": "19.1.0",
```

With:

```json
"react": "18.3.1",
"react-dom": "18.3.1",
```

### Step 2: Clean install

```bash
# Remove existing modules and lock file
rm -rf node_modules package-lock.json

# Install dependencies
npm install

# Update Expo packages to match SDK 54
npx expo install --fix
```

### Step 3: Clear caches and restart

```bash
# Clear Metro bundler cache
npx expo start -c

# Or manually clear
rm -rf .expo node_modules/.cache
```

## Alternative: Update all packages to Expo SDK 54

If downgrading doesn't work, update all packages:

```bash
# Update Expo SDK packages
npx expo install expo@~54.0.19 --fix

# Update specific packages mentioned in warnings
npx expo install \
  @expo/vector-icons@^15.0.3 \
  expo-notifications@~0.32.12 \
  react-native@0.81.5 \
  react-native-screens@~4.16.0 \
  jest-expo@~54.0.13
```

## Expected Result

After fixing:

- ✅ No more `displayName` errors
- ✅ No more `'secondary' of undefined` errors
- ✅ Theme loads correctly
- ✅ Analytics screen renders without crashes
