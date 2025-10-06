# Date-Circle Alignment Debugging Guide

## Quick Fix Steps

### 1. **Restart the App with Fresh Cache**

```bash
# Stop any running instances
# Press Ctrl+C in terminal

# Clear Expo cache and restart
npx expo start --clear

# Then press 'i' for iOS or 'a' for Android
```

### 2. **Verify You're Looking at the Right View**

The alignment fix is in the **main habit list view**, NOT in:
- ❌ Calendar modal (different component)
- ❌ Settings or other screens
- ✅ **Main screen with 5-day habit circles**

### 3. **What You Should See**

**Before Fix (Misaligned):**
```
MON  TUE  WED  THU  FRI
 ○────○────○────○────○
 ↑ Labels appear LEFT of circles
```

**After Fix (Aligned):**
```
 MON   TUE   WED   THU   FRI
  ○─────○─────○─────○─────○
  ↑ Labels centered above circles
```

## Visual Debugging

If you still don't see alignment, let's add temporary visual markers to debug:

### Add This Temporary Debug Code

**Location:** `App.tsx` around line 481 (in the labels row)

**Change this:**
```typescript
<View style={styles.labelItem}>
  <Text style={styles.dayLabel}>{dayLabel.toUpperCase()}</Text>
</View>
```

**To this (temporary debug version):**
```typescript
<View style={[styles.labelItem, { backgroundColor: 'rgba(255,0,0,0.2)' }]}>
  <Text style={styles.dayLabel}>{dayLabel.toUpperCase()}</Text>
</View>
```

**And change line 485:**
```typescript
<View style={styles.labelSpacer} />
```

**To this:**
```typescript
<View style={[styles.labelSpacer, { backgroundColor: 'rgba(0,255,0,0.2)' }]} />
```

This will show:
- 🟥 **Red background** on label containers (should be 48px wide)
- 🟩 **Green background** on spacers between labels (should grow to fill space)

### Expected Result with Debug Colors

You should see:
```
🟥MON🟩🟩🟩🟥TUE🟩🟩🟩🟥WED🟩🟩🟩🟥THU🟩🟩🟩🟥FRI
  ○─────○─────○─────○─────○
```

If you see:
- ❌ All labels bunched together → Spacers not working
- ❌ Labels spread unevenly → Width issue
- ✅ Red boxes aligned with circles → WORKING!

## Check Current Code

Verify these exact values in `App.tsx`:

### Line 851-854 (labelItem style):
```typescript
labelItem: {
  width: 48,  // ← MUST be 48, not flexGrow
  alignItems: 'center',
},
```

### Line 855-861 (labelSpacer style):
```typescript
labelSpacer: {
  height: 3,
  backgroundColor: 'transparent',
  marginHorizontal: 6,
  flexBasis: 0,
  flexGrow: 1,  // ← MUST have flexGrow: 1
},
```

### Line 868-871 (dayButton/circle style):
```typescript
dayButton: {
  width: 48,  // ← MUST match labelItem width
  height: 48,
  borderRadius: 24,
  // ...
}
```

## Common Issues

### Issue 1: App Not Refreshing
**Solution:**
```bash
# In Expo app, shake device (iOS) or press Cmd+M (Android)
# Select "Reload"
# OR restart with: npx expo start --clear
```

### Issue 2: Looking at Wrong Component
**Solution:**
- Check you're on the **main screen** (not modal)
- Should see 5 days: MON TUE WED THU FRI
- Should see circles below the day labels

### Issue 3: Cache Issue
**Solution:**
```bash
# Clear ALL caches
rm -rf node_modules/.cache
npx expo start --clear
```

### Issue 4: Wrong File Being Used
**Solution:**
```bash
# Verify you're editing the RIGHT file:
# ✅ ./App.tsx (ROOT level - mobile app)
# ❌ ./src/App.tsx (web version)

# Check which is which:
head -1 ./App.tsx
# Should show: import { ClerkLoaded... (mobile)

head -1 ./src/App.tsx
# Should show: import { useMutation... (web)
```

## Screenshot the Issue

Please take a screenshot showing:
1. The day labels (MON, TUE, etc.)
2. The circles below them
3. Whether they align or not

This will help me understand exactly what you're seeing!

## Nuclear Option: Force Alignment with Debug Values

If nothing works, temporarily add these styles for MAXIMUM visibility:

```typescript
labelItem: {
  width: 48,
  alignItems: 'center',
  backgroundColor: 'red',  // ← Temporary debug
  height: 20,              // ← Temporary debug
},

labelSpacer: {
  height: 3,
  backgroundColor: 'green', // ← Temporary debug (not transparent)
  marginHorizontal: 6,
  flexBasis: 0,
  flexGrow: 1,
},
```

You should see VERY clearly:
- Red boxes for labels (48px wide)
- Green lines growing between them
- If this doesn't work, there's a deeper issue

## Next Steps

1. ✅ Restart app with `npx expo start --clear`
2. ✅ Verify you're looking at main screen (5 days visible)
3. ✅ Add debug colors temporarily if needed
4. 📸 Screenshot what you see
5. 💬 Describe the exact misalignment you observe

I'm here to help debug this! Let me know what you see after trying these steps.
