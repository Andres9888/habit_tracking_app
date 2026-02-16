# E2E Testing with Maestro

This project uses [Maestro](https://maestro.mobile.dev/) for end-to-end smoke testing. Maestro is a lightweight, YAML-based testing framework perfect for React Native and Expo apps.

## Why Maestro?

- **No native code changes required** - Works with Expo out of the box
- **Simple YAML flows** - Easy to read and maintain
- **Fast setup** - No complex configuration
- **Cross-platform** - Same tests work on iOS and Android
- **Great developer experience** - Clear error messages and debugging

## Installation

### 1. Install Maestro CLI

**macOS/Linux:**
```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
```

**Add to PATH:**
```bash
export PATH="$PATH:$HOME/.maestro/bin"
```

Add this to your `~/.zshrc` or `~/.bashrc` to make it permanent.

**Verify installation:**
```bash
maestro --version
```

### 2. Start Your App

Make sure your Expo app is running on a simulator/emulator or physical device:

**iOS Simulator:**
```bash
npm run expo:ios
```

**Android Emulator:**
```bash
npm run expo:android
```

## Running Tests

### Run All Smoke Tests

```bash
maestro test .maestro/
```

### Run Individual Tests

```bash
# Test app launch
maestro test .maestro/01-app-launches.yaml

# Test navigation
maestro test .maestro/02-navigate-modals.yaml

# Test habit creation
maestro test .maestro/03-create-habit.yaml

# Test habit toggling
maestro test .maestro/04-toggle-habit.yaml

# Test settings
maestro test .maestro/05-open-settings.yaml
```

### Run Tests in Continuous Mode

Watch for changes and re-run tests automatically:

```bash
maestro test --continuous .maestro/
```

### Run Tests with Debug Output

```bash
maestro test --debug .maestro/01-app-launches.yaml
```

## Smoke Test Coverage

The current E2E smoke test suite covers these critical user journeys:

### 1. **App Launches Without Crash** (`01-app-launches.yaml`)
- ✅ App starts successfully
- ✅ Main screen displays
- ✅ Core UI elements are visible

### 2. **Navigate Between Modals** (`02-navigate-modals.yaml`)
- ✅ Settings modal opens
- ✅ Settings modal closes
- ✅ FAB menu interactions

### 3. **Create a Habit** (`03-create-habit.yaml`)
- ✅ Open create habit screen
- ✅ Fill in habit name and description
- ✅ Save habit
- ✅ Habit appears in list

### 4. **Toggle Habit Complete** (`04-toggle-habit.yaml`)
- ✅ Mark habit as complete
- ✅ Visual feedback for completion
- ✅ Un-mark habit as incomplete

### 5. **Open Settings** (`05-open-settings.yaml`)
- ✅ Settings screen opens
- ✅ Key settings sections visible
- ✅ Settings screen closes

## Test Identifiers

Maestro tests rely on `testID` props in React Native components. If a test fails with "element not found", you may need to add testIDs:

```tsx
<Pressable testID="fab-button" onPress={handlePress}>
  {/* ... */}
</Pressable>

<TextInput testID="habit-name-input" {...props} />
```

Common testIDs used in our flows:
- `fab-button` - Floating Action Button
- `settings-button` - Settings button
- `habit-name-input` - Habit name input field
- `habit-description-input` - Habit description field
- `habit-checkbox-{habitName}` - Habit completion checkbox
- `create-habit-button` - Create habit button in FAB menu

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Install Maestro
  run: |
    curl -Ls "https://get.maestro.mobile.dev" | bash
    echo "$HOME/.maestro/bin" >> $GITHUB_PATH

- name: Run E2E Smoke Tests
  run: maestro test .maestro/
```

### Local Pre-commit Hook

Add to `.husky/pre-push`:

```bash
#!/bin/sh
echo "Running E2E smoke tests..."
maestro test .maestro/
```

## Debugging Tips

### Test is Failing?

1. **Run with debug output:**
   ```bash
   maestro test --debug .maestro/01-app-launches.yaml
   ```

2. **Check element IDs:**
   Use Maestro Studio to inspect your app:
   ```bash
   maestro studio
   ```

3. **Verify app is running:**
   Make sure the app is fully loaded before running tests

4. **Check logs:**
   Maestro shows detailed error messages with screenshots

### Common Issues

**"App not found"**
- Ensure the `appId` in YAML matches your app's bundle ID
- Update `appId` in all `.maestro/*.yaml` files if needed

**"Element not found"**
- Add `testID` props to components
- Verify the element is actually visible on screen
- Try using text matchers instead of IDs

**"Timeout"**
- Increase wait time in flow: `- waitForAnimationToEnd`
- Add explicit waits: `- waitForVisible: "text"`

## Writing New Tests

### Flow Template

```yaml
appId: com.chainday.app
---
# Test Name: Brief Description

- launchApp
- assertVisible: "Expected Element"

# Your test steps...
- tapOn:
    id: "button-id"
- inputText: "some text"
- assertVisible: "Expected Result"
```

### Best Practices

1. **Keep tests independent** - Each test should work in isolation
2. **Use descriptive comments** - Explain what each section does
3. **Clean up after yourself** - Delete test data if needed
4. **Use testIDs over text** - More reliable across languages
5. **Assert key states** - Verify expected outcomes

## Resources

- [Maestro Documentation](https://maestro.mobile.dev/)
- [Maestro CLI Reference](https://maestro.mobile.dev/cli/test)
- [YAML Flow Syntax](https://maestro.mobile.dev/reference/yaml)
- [Best Practices](https://maestro.mobile.dev/best-practices/best-practices)

## Next Steps

- [ ] Add more comprehensive test coverage
- [ ] Integrate tests into CI/CD pipeline
- [ ] Add visual regression testing with Maestro Cloud
- [ ] Create smoke test suite for critical user flows
- [ ] Set up test reporting and metrics

---

**Note:** These smoke tests are designed to catch critical regressions quickly. For comprehensive testing, supplement with unit tests, integration tests, and manual QA.

*Created by **Sonnet*** 🤖
