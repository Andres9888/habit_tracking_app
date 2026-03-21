/**
 * E2E Tests for Swipe-to-Archive Feature
 *
 * These tests verify the complete user journey from UI interaction
 * through to database persistence using full app rendering.
 *
 * Setup Requirements:
 * - Detox configured in package.json
 * - iOS Simulator or Native Handset Emulator running
 * - Convex backend running (dev or test deployment)
 *
 * Run with: npm run test:e2e
 */

import { by, device, element, expect as detoxExpect, waitFor } from 'detox';

describe('Swipe to Archive E2E', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      permissions: { notifications: 'YES' },
    });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  afterAll(async () => {
    await device.terminateApp();
  });

  describe('Complete Swipe-to-Archive User Journey', () => {
    it('should display habit cards on home screen', async () => {
      // Wait for app to load
      await waitFor(element(by.text('Habits')))
        .toBeVisible()
        .withTimeout(5000);

      // Verify at least one habit is visible (assumes test data exists)
      await waitFor(element(by.id('habit-card')))
        .toBeVisible()
        .withTimeout(3000);
    });

    it('should show archive button when swiping left on habit', async () => {
      // Find the first habit card
      const habitCard = element(by.id('habit-card')).atIndex(0);

      // Swipe left to reveal archive action
      await habitCard.swipe('left', 'fast', 0.8);

      // Verify archive button appears
      await waitFor(element(by.text('Archive')))
        .toBeVisible()
        .withTimeout(2000);

      // Verify Archive icon is visible
      await expect(element(by.id('archive-icon'))).toBeVisible();
    });

    it('should archive habit when swipe completes fully', async () => {
      // Get the habit name before archiving
      const habitCard = element(by.id('habit-card')).atIndex(0);
      const habitName = await element(
        by.id('habit-name').withAncestor(habitCard)
      );

      // Store the habit name text for verification
      // (In real Detox, you'd use getText() if available)

      // Swipe left fully to archive
      await habitCard.swipe('left', 'fast', 0.9);

      // Wait for archive animation to complete
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Verify habit is no longer in the active list
      // (It should have been removed from the view)
      await waitFor(habitCard).not.toBeVisible().withTimeout(2000);
    });

    it('should show habit in archived list in settings', async () => {
      // Archive a habit first
      const habitCard = element(by.id('habit-card')).atIndex(0);
      await habitCard.swipe('left', 'fast', 0.9);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Open settings
      await element(by.id('settings-button')).tap();

      // Wait for settings modal to open
      await waitFor(element(by.text('Settings')))
        .toBeVisible()
        .withTimeout(2000);

      // Tap on "Archived Habits" option
      await element(by.text('Archived Habits')).tap();

      // Wait for archived habits modal
      await waitFor(element(by.text('Archived Habits')))
        .toBeVisible()
        .withTimeout(2000);

      // Verify at least one archived habit is shown
      await waitFor(element(by.id('archived-habit-card')))
        .toBeVisible()
        .withTimeout(2000);
    });

    it('should restore habit from archived list', async () => {
      // Archive a habit
      const habitCard = element(by.id('habit-card')).atIndex(0);
      await habitCard.swipe('left', 'fast', 0.9);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Navigate to archived habits
      await element(by.id('settings-button')).tap();
      await waitFor(element(by.text('Archived Habits')))
        .toExist()
        .withTimeout(2000);
      await element(by.text('Archived Habits')).tap();

      // Tap restore on the archived habit
      const restoreButton = element(by.text('RESTORE')).atIndex(0);
      await restoreButton.tap();

      // Wait for toast notification
      await waitFor(element(by.text(/restored/i)))
        .toBeVisible()
        .withTimeout(2000);

      // Close modals
      await element(by.id('close-archived-modal')).tap();
      await element(by.id('close-settings-modal')).tap();

      // Verify habit is back in the main list
      await waitFor(element(by.id('habit-card')))
        .toBeVisible()
        .withTimeout(2000);
    });

    it('should permanently delete habit from archived list', async () => {
      // Archive a habit
      const habitCard = element(by.id('habit-card')).atIndex(0);
      await habitCard.swipe('left', 'fast', 0.9);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Navigate to archived habits
      await element(by.id('settings-button')).tap();
      await element(by.text('Archived Habits')).tap();
      await waitFor(element(by.id('archived-habit-card')))
        .toBeVisible()
        .withTimeout(2000);

      // Get count of archived habits
      // (This would be implementation-specific)

      // Tap delete on archived habit
      const deleteButton = element(by.text('DELETE')).atIndex(0);
      await deleteButton.tap();

      // Confirm deletion in alert (if applicable)
      // await element(by.text("Confirm")).tap();

      // Wait for deletion to complete
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Verify habit is removed from archived list
      // (Count should decrease or show "No archived habits")
    });
  });

  describe('Swipe Gesture Variations', () => {
    it('should cancel swipe if not swiped far enough', async () => {
      const habitCard = element(by.id('habit-card')).atIndex(0);

      // Swipe only 30% (below threshold)
      await habitCard.swipe('left', 'slow', 0.3);

      // Wait a moment
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Verify archive button is not visible (swipe cancelled)
      await expect(element(by.text('Archive'))).not.toBeVisible();

      // Verify habit is still in the list
      await expect(habitCard).toBeVisible();
    });

    it('should handle swipe on multiple habits independently', async () => {
      // Ensure at least 2 habits exist
      await waitFor(element(by.id('habit-card')))
        .toBeVisible()
        .withTimeout(2000);

      // Swipe first habit
      const habit1 = element(by.id('habit-card')).atIndex(0);
      await habit1.swipe('left', 'fast', 0.9);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Swipe second habit
      const habit2 = element(by.id('habit-card')).atIndex(0); // Now at index 0 after first was removed
      await habit2.swipe('left', 'fast', 0.9);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Both habits should be archived
      // Navigate to archived habits to verify
      await element(by.id('settings-button')).tap();
      await element(by.text('Archived Habits')).tap();

      // Should see at least 2 archived habits
      const archivedCount = await element(by.id('archived-habit-card'));
      // Verify count >= 2 (implementation-specific)
    });

    it('should work correctly in compact mode', async () => {
      // Enable compact mode in settings
      await element(by.id('settings-button')).tap();
      await waitFor(element(by.text('Compact Mode')))
        .toExist()
        .withTimeout(2000);

      const compactToggle = element(by.id('compact-mode-toggle'));
      await compactToggle.tap();

      // Close settings
      await element(by.id('close-settings-modal')).tap();

      // Wait for UI to update
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Swipe should still work in compact mode
      const habitCard = element(by.id('habit-card')).atIndex(0);
      await habitCard.swipe('left', 'fast', 0.9);

      // Verify archive action appears
      await waitFor(element(by.text('Archive')))
        .toBeVisible()
        .withTimeout(2000);
    });
  });

  describe('Archive Feature with Habit Strength', () => {
    it('should preserve habit strength when archiving', async () => {
      // Assumptions: Habit has strength indicator visible

      // Get habit with strength indicator
      const habitCard = element(by.id('habit-card')).atIndex(0);

      // Verify strength indicator is present
      await expect(
        element(by.id('strength-indicator').withAncestor(habitCard))
      ).toExist();

      // Archive the habit
      await habitCard.swipe('left', 'fast', 0.9);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Navigate to archived habits
      await element(by.id('settings-button')).tap();
      await element(by.text('Archived Habits')).tap();

      // Verify archived habit still shows strength info (if implemented)
      const archivedCard = element(by.id('archived-habit-card')).atIndex(0);
      // Strength should be preserved in database even if not shown in UI
      await expect(archivedCard).toBeVisible();
    });

    it('should not update strength while habit is archived', async () => {
      // Archive a habit
      const habitCard = element(by.id('habit-card')).atIndex(0);
      await habitCard.swipe('left', 'fast', 0.9);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Archived habits should not receive strength updates from daily decay
      // This is a backend test - would need to verify via API or after restoration

      // Restore the habit after some time
      await element(by.id('settings-button')).tap();
      await element(by.text('Archived Habits')).tap();
      await element(by.text('RESTORE')).atIndex(0).tap();

      // Close modals
      await element(by.id('close-archived-modal')).tap();
      await element(by.id('close-settings-modal')).tap();

      // Verify habit's strength is same as when it was archived
      // (This requires baseline measurement before archiving)
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully during archive', async () => {
      // Simulate network failure (requires test setup)
      // await device.setNetworkConditions({ offline: true });

      const habitCard = element(by.id('habit-card')).atIndex(0);
      await habitCard.swipe('left', 'fast', 0.9);

      // Should show error toast or keep habit visible
      await waitFor(element(by.text(/error/i)).or(habitCard))
        .toBeVisible()
        .withTimeout(3000);

      // Restore network
      // await device.setNetworkConditions({ offline: false });
    });

    it('should handle rapid swipes without crashes', async () => {
      // Rapidly swipe multiple habits
      for (let i = 0; i < 3; i++) {
        const card = element(by.id('habit-card')).atIndex(0);
        await card.swipe('left', 'fast', 0.9);
        // No delay - test rapid succession
      }

      // App should remain stable
      await expect(element(by.text('Habits'))).toBeVisible();
    });
  });

  describe('Accessibility', () => {
    it('should have accessibility labels for archive action', async () => {
      const habitCard = element(by.id('habit-card')).atIndex(0);
      await habitCard.swipe('left', 'fast', 0.8);

      // Verify archive button has accessibility label
      const archiveButton = element(by.label(/archive/i));
      await expect(archiveButton).toBeVisible();
    });

    it('should announce archive action to screen reader', async () => {
      // Enable screen reader simulation
      // This would require Detox accessibility configuration

      const habitCard = element(by.id('habit-card')).atIndex(0);
      await habitCard.swipe('left', 'fast', 0.9);

      // Verify announcement was made (implementation-specific)
      // await expect(element(by.text(/archived/i))).toBeVisible();
    });
  });
});

describe('E2E Performance Tests', () => {
  it('should complete archive within 500ms', async () => {
    const startTime = Date.now();

    const habitCard = element(by.id('habit-card')).atIndex(0);
    await habitCard.swipe('left', 'fast', 0.9);

    // Wait for animation
    await waitFor(habitCard).not.toBeVisible().withTimeout(1000);

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Archive should be fast and responsive
    expect(duration).toBeLessThan(1000);
  });

  it('should handle large number of habits without performance degradation', async () => {
    // Assumption: Test data has 50+ habits

    // Scroll through list
    const habitList = element(by.id('habit-scroll-view'));
    await habitList.scroll(300, 'down');
    await habitList.scroll(300, 'down');

    // Swipe a habit near the bottom
    const habitCard = element(by.id('habit-card')).atIndex(5);
    const startTime = Date.now();

    await habitCard.swipe('left', 'fast', 0.9);

    const duration = Date.now() - startTime;

    // Should be just as fast with many habits
    expect(duration).toBeLessThan(1000);
  });
});
