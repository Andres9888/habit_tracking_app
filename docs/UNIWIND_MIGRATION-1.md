# Uniwind Migration - Phase 1: Package Updates

> **Migration Overview**: NativeWind v4 → Uniwind (Tailwind 4)
> **Risk Level**: High - Breaking changes in Tailwind CSS syntax
> **Estimated Files Affected**: 187 files with className usage

## Pre-Migration Checklist

- [ ] Create a new git branch for the migration: `git checkout -b feature/uniwind-migration`
- [ ] Ensure all current changes are committed
- [ ] Run current tests to establish baseline: `npm test`
- [ ] Document current app state with screenshots (iOS/Android/Web)

## Phase 1 Tasks: Package Updates

### 1.1 Remove NativeWind Dependencies

- [ ] Remove NativeWind and related packages:
```bash
npm uninstall nativewind react-native-css-interop
```

### 1.2 Install Uniwind

- [ ] Install Uniwind package:
```bash
npm install uniwind
```

### 1.3 Upgrade Tailwind CSS to v4

- [ ] Remove Tailwind v3:
```bash
npm uninstall tailwindcss autoprefixer postcss
```

- [ ] Install Tailwind v4:
```bash
npm install tailwindcss@next @tailwindcss/postcss
```

> ⚠️ **Note**: Tailwind v4 uses `@tailwindcss/postcss` instead of the old `postcss` plugin approach.

### 1.4 Update Related Dev Dependencies

- [ ] Update prettier-plugin-tailwindcss for v4 compatibility:
```bash
npm install prettier-plugin-tailwindcss@latest
```

### 1.5 Verify Package Installation

- [ ] Run `npm list uniwind tailwindcss` to verify versions
- [ ] Ensure no peer dependency warnings for Tailwind 4

### 1.6 Update package.json Scripts (if needed)

- [ ] Review scripts - no changes expected, but verify `expo:start` still works

## Expected package.json Changes

**Before (relevant sections):**
```json
{
  "devDependencies": {
    "nativewind": "^4.1.23",
    "react-native-css-interop": "^0.2.1",
    "tailwindcss": "^3.4.18",
    "autoprefixer": "~10",
    "postcss": "~8"
  }
}
```

**After:**
```json
{
  "dependencies": {
    "uniwind": "^x.x.x"
  },
  "devDependencies": {
    "tailwindcss": "^4.x.x",
    "@tailwindcss/postcss": "^4.x.x"
  }
}
```

## Verification

- [ ] `npm install` completes without errors
- [ ] `npm list` shows correct package versions
- [ ] No unresolved peer dependencies

## Rollback Plan

If issues arise:
```bash
git checkout main -- package.json package-lock.json
npm install
```

---
**Next Phase**: [UNIWIND_MIGRATION-2.md](./UNIWIND_MIGRATION-2.md) - Config Migration
