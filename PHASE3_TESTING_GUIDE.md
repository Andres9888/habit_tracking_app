# Phase 3 Testing Guide

**Date:** October 23, 2025
**Purpose:** Systematically test all Phase 3 features
**Estimated Time:** 30-45 minutes

---

## 🚀 **SETUP: Start the App**

```bash
# Make sure Convex is running
npx convex dev

# In another terminal, start the app
npm start
```

Then:
- Press `w` for web
- OR scan QR code for iOS/Android simulator
- OR run on real device for full testing (haptics, share)

---

## ✅ **TEST 1: Templates Library** (5 min)

### What to Test
The Templates Library should show 20 science-backed habit templates organized by category.

### Steps

1. **Open Templates Tab**
   - Look for bottom navigation
   - Tap "Templates" tab (middle icon)
   - ✅ Screen should load with templates

2. **Verify Template Count**
   - Scroll through the list
   - ✅ Should see ~20 template cards
   - ✅ Each has icon, name, description

3. **Test Category Filtering**
   - Tap "Morning Routine" chip
   - ✅ Should show 4 templates
   - Tap "Health & Fitness" chip
   - ✅ Should show 5 templates
   - Tap "Productivity" chip
   - ✅ Should show 5 templates
   - Tap "Mindfulness" chip
   - ✅ Should show 6 templates
   - Tap "All" chip
   - ✅ Should show all 20 templates

4. **Test Template Import**
   - Find "5-Minute Meditation" template
   - Tap the template card
   - ✅ Preview modal should open
   - ✅ Should show description and science citation
   - Tap "Import" button
   - ✅ Success toast should appear
   - ✅ Modal should close
   - Navigate to Home tab
   - ✅ "5-Minute Meditation" habit should appear in list

5. **Verify Habit Created Correctly**
   - Check the imported habit
   - ✅ Has correct icon (🧘)
   - ✅ Has correct name
   - ✅ Shows 0% strength (Starting 🌱)

### Expected Results
- ✅ All categories filter correctly
- ✅ Import creates habit instantly
- ✅ Habit appears in home list
- ✅ Scientific citations visible

### Common Issues
- **Templates not loading:** Check Convex is running, templates were seeded
- **Import fails:** Check network connection, Convex mutations working

---

## 🎉 **TEST 2: Milestone Celebrations** (10 min) ⭐ CRITICAL

### What to Test
**This is the main fix!** Celebrations should now trigger automatically when habit strength crosses thresholds.

### Preparation
You need a habit with ~18% strength to test the 20% milestone.

**Option A: Use Existing Habit**
If you have a habit with 15-19% strength, use it.

**Option B: Create Test Habit**
1. Create a new habit manually
2. Complete it multiple times to build strength
3. Check strength percentage in habit card

**Option C: Manually Modify Strength (Dev Only)**
Open Convex dashboard and manually set a habit's strength to 0.18

### Steps

1. **Trigger First Milestone (20%)**
   - Find habit with 15-19% strength
   - Complete the habit (tap to check it off)
   - Wait 2-3 seconds for strength recalculation
   - ✅ Celebration modal should appear automatically!

2. **Verify Celebration Modal**
   - ✅ Full-screen modal slides up
   - ✅ Confetti animation plays (100 particles, green + gold)
   - ✅ Large emoji displayed: 🌱
   - ✅ "Starting Level!" text shown
   - ✅ Strength percentage shown (e.g., "21%")
   - ✅ "Share Achievement" button visible
   - ✅ "Continue" button visible
   - ✅ Haptic feedback (if on device)

3. **Test Modal Dismissal**
   - Tap backdrop (outside modal)
   - ✅ Modal should close
   - Complete the same habit again
   - ✅ Modal should NOT reappear (duplicate prevention)

4. **Test All Milestone Thresholds** (if time permits)
   - 20% → 🌱 Starting
   - 40% → 🌿 Building
   - 60% → 🌳 Developing
   - 80% → 💪 Strong
   - 90%+ → ⚡ Automatic

### Expected Results
- ✅ Modal appears automatically on strength increase
- ✅ Confetti smooth and performant
- ✅ Correct emoji for each level
- ✅ No duplicate celebrations
- ✅ Backdrop dismisses modal

### Common Issues
- **Modal doesn't appear:**
  - Check console for errors
  - Verify strength actually increased (check habit card)
  - Check `lastUpdatedHabit` state in React DevTools
- **Confetti lag:** Normal on simulator, test on device
- **Wrong emoji:** Check strength thresholds in code

---

## 📱 **TEST 3: Share Card Generator** (5 min)

### What to Test
From milestone celebration, user should be able to create and share beautiful achievement cards.

### Steps

1. **Trigger Celebration** (from Test 2)
   - Complete habit to trigger milestone
   - Celebration modal appears

2. **Open Share Card Generator**
   - Tap "Share Achievement" button
   - ✅ ShareCardGenerator modal should open
   - ✅ Preview card shows:
     - Gradient background
     - Milestone emoji (large)
     - Habit name
     - Strength percentage
     - Science badge: "Research-backed (Lally et al.)"

3. **Test Customization**
   - Tap different gradient backgrounds
   - ✅ Should see 5 options: Growth, Achievement, Excellence, Sky, Sunset
   - ✅ Preview updates immediately
   - Type a personal message (e.g., "Week 1 complete!")
   - ✅ Message appears on card preview
   - Toggle user name on/off
   - ✅ Name appears/disappears on card

4. **Test Platform Selection**
   - Select "Instagram Story"
   - ✅ Card format changes to 9:16 (tall)
   - Select "Instagram Feed"
   - ✅ Card format changes to 1:1 (square)
   - Select "Twitter"
   - ✅ Card format changes to 16:9 (wide)

5. **Test Share Flow** (Real Device Only)
   - Tap "Share" button
   - ✅ Image generation loading state
   - ✅ Native share sheet opens (iOS/Android)
   - ✅ Can select app (Instagram, Twitter, etc.)
   - ✅ Image quality looks good (1080x1920)

### Expected Results
- ✅ All 5 gradients work
- ✅ Personal message displays
- ✅ Platform formats change correctly
- ✅ Share sheet works (device only)

### Common Issues
- **Share doesn't work on simulator:** Expected - use real device
- **Image quality low:** Check dimensions in console
- **Can't type message:** Check text input focus

---

## 📊 **TEST 4: Habit Detail with Advanced Stats** (5 min)

### What to Test
Premium users should see unlocked charts and predictions. Free users should see upgrade prompts.

### Steps

1. **Open Habit Detail**
   - Tap any habit card in home list
   - ✅ HabitDetailScreen should open
   - ✅ Swipe-right-to-dismiss should work

2. **Verify Premium Status (Default: Unlocked)**
   - Scroll to "Strength History" section
   - ✅ Should see 30-day line chart
   - ✅ Chart shows strength progression
   - Scroll to "Predictions" section
   - ✅ Should see 7-day forecast
   - ✅ Shows risk level (Low/Medium/High)
   - ✅ Shows trend (Improving/Stable/Declining)
   - ✅ Shows suggestions

3. **Test Premium Gating** (Optional)
   - Stop the app
   - Edit `src/App.tsx` line 513
   - Change `|| true` to `|| false`
   - Restart app
   - Open Habit Detail
   - ✅ Charts should show "Upgrade" button
   - ✅ Predictions should show upgrade prompt
   - ✅ Tap upgrade → paywall modal (if implemented)

4. **Test Action Buttons**
   - Verify all buttons present:
     - ✅ Edit button
     - ✅ Pause button (from Phase 4)
     - ✅ Archive button
     - ✅ Delete button

### Expected Results
- ✅ Charts render correctly
- ✅ Predictions show real data (from Phase 4)
- ✅ Premium gating works
- ✅ All action buttons visible

### Common Issues
- **Charts show mock data:** Expected if Phase 4 backend not connected
- **Predictions missing:** Check Phase 4 implementation
- **Always locked:** Check `isPremium` value (line 513)

---

## ✏️ **TEST 5: Edit Modal** (5 min) ⭐ CRITICAL FIX

### What to Test
**This was just fixed!** Edit button should open modal with pre-filled habit data.

### Steps

1. **Open Edit Modal**
   - Open any Habit Detail screen
   - Tap "Edit" button
   - ✅ CreateHabitModal should open
   - ✅ Modal title says "Edit Habit" (not "Create Habit")

2. **Verify Pre-filled Data**
   - Check habit name field
   - ✅ Should show current habit name (without emoji)
   - Check emoji selector
   - ✅ Should show current emoji selected
   - Check reminders toggle
   - ✅ Should match current reminder state
   - Check reminder time
   - ✅ Should show current time (if reminders enabled)

3. **Test Editing**
   - Change habit name (e.g., "Morning Exercise" → "Morning Workout")
   - ✅ Name updates in text field
   - Select different emoji
   - ✅ Emoji changes
   - Toggle reminders off → on
   - ✅ Toggle works
   - Change reminder time
   - ✅ Time picker updates

4. **Save Changes**
   - Tap "Save" or "Create" button
   - ✅ Modal closes
   - ✅ Detail screen closes
   - ✅ Return to home list
   - ✅ Habit shows updated name
   - ✅ Habit shows updated emoji

5. **Verify Persistence**
   - Tap the edited habit again
   - Open detail screen
   - ✅ Shows updated data
   - Tap Edit again
   - ✅ Modal shows updated data

### Expected Results
- ✅ Modal opens with current data
- ✅ All fields editable
- ✅ Changes save correctly
- ✅ Updates persist

### Common Issues
- **Modal empty:** Check `habitToEdit` prop being passed
- **Changes don't save:** Check `updateHabit` mutation
- **Name has emoji prefix:** Check emoji parsing logic

---

## 🗑️ **TEST 6: Delete Functionality** (5 min) ⭐ CRITICAL FIX

### What to Test
**This was just fixed!** Delete button should work with platform-specific confirmation.

### Steps

1. **Test Delete Flow**
   - Create a test habit or use existing one
   - Open Habit Detail
   - Tap "Delete" button
   - ✅ Confirmation dialog should appear

2. **Verify Confirmation Dialog**
   - **On Web:**
     - ✅ Browser `confirm()` dialog
     - ✅ Message: "Are you sure you want to delete this habit? This cannot be undone."
   - **On Mobile:**
     - ✅ Native Alert dialog
     - ✅ Two buttons: "Cancel" and "Delete"
     - ✅ "Delete" button is red (destructive style)

3. **Test Cancel**
   - Tap "Cancel" (or dismiss)
   - ✅ Dialog closes
   - ✅ Habit NOT deleted
   - ✅ Still in detail screen

4. **Test Confirm Delete**
   - Tap Delete again
   - Confirm in dialog
   - ✅ Habit deleted from database
   - ✅ Detail screen closes
   - ✅ Return to home list
   - ✅ Habit no longer visible
   - ✅ Tracking data also deleted

5. **Verify Permanent Deletion**
   - Check home list
   - ✅ Deleted habit is gone
   - Restart app
   - ✅ Habit still gone (not just hidden)

### Expected Results
- ✅ Platform-specific confirmation
- ✅ Cancel works (no deletion)
- ✅ Confirm deletes habit + data
- ✅ UI updates immediately
- ✅ Deletion is permanent

### Common Issues
- **No confirmation:** Check Alert import and handler
- **Habit not deleted:** Check `removeHabit` mutation
- **Detail screen doesn't close:** Check state reset in handler

---

## 📋 **FINAL VERIFICATION CHECKLIST**

After testing all features, verify:

### Core Functionality
- [ ] Templates library loads and filters work
- [ ] Template import creates habits
- [ ] Milestone celebrations trigger automatically
- [ ] Confetti plays smoothly
- [ ] Share card generator opens from celebration
- [ ] Share customization works
- [ ] Habit detail shows charts/predictions
- [ ] Edit modal pre-fills data correctly
- [ ] Edit changes save and persist
- [ ] Delete confirmation appears
- [ ] Delete removes habit completely

### Integration Points
- [ ] Template → Habit creation works
- [ ] Habit completion → Milestone detection works
- [ ] Milestone → Share card flow works
- [ ] Habit card → Detail screen works
- [ ] Detail screen → Edit modal works
- [ ] All modals dismiss correctly

### Premium Features
- [ ] Premium status configurable (line 513)
- [ ] Charts unlock for premium users
- [ ] Predictions unlock for premium users
- [ ] Paywall appears for free users

### User Experience
- [ ] No console errors
- [ ] Smooth animations (60fps)
- [ ] Responsive interactions
- [ ] Proper loading states
- [ ] Error states handled

---

## 🐛 **ISSUE TRACKING**

If you find bugs, document them:

### Template for Bug Report
```
Feature: [Templates/Celebrations/Share/Detail/Edit/Delete]
Issue: [Brief description]
Steps to Reproduce:
1.
2.
3.
Expected: [What should happen]
Actual: [What actually happened]
Priority: [P0/P1/P2/P3]
```

---

## 📊 **SUCCESS CRITERIA**

**Phase 3 is production-ready if:**
- ✅ All 6 test sections pass
- ✅ No critical bugs found (P0)
- ✅ Maximum 2-3 minor bugs (P2-P3)
- ✅ Core flows work end-to-end
- ✅ TypeScript compiles without errors

---

## 🎯 **NEXT STEPS AFTER TESTING**

**If all tests pass:**
1. Document any minor issues found
2. Fix P0/P1 bugs if any
3. Deploy to TestFlight for beta testing
4. Gather user feedback
5. Move to production

**If tests fail:**
1. Document failing tests
2. Prioritize fixes (P0 first)
3. Re-run failed tests
4. Repeat until all pass

---

**Happy Testing! 🚀**

Let me know if you encounter any issues during testing.
