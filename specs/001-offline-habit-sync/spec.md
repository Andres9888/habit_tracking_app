# Feature Specification: Offline Habit Completion Sync

**Feature Branch**: `001-offline-habit-sync`
**Created**: 2026-01-30
**Status**: Draft
**Input**: User description: "Enable offline functionality for the ChainDay habit tracking app. Users should be able to mark habits as complete while offline, with changes automatically syncing when connectivity returns."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Complete Habits While Offline (Priority: P1)

As a user who loses internet connectivity (subway, gym, airplane mode), I want to mark my habits as complete and see immediate visual feedback, so that I can maintain my habit tracking routine without interruption.

**Why this priority**: This is the core user journey. Habit completion is a micro-moment (2-3 seconds) that happens multiple times daily, often in low-connectivity environments. Any friction here breaks the habit-building loop and damages user trust in streak tracking.

**Independent Test**: Can be fully tested by enabling airplane mode, completing a habit, and verifying the chain link animation plays instantly. Delivers immediate value by eliminating the most common offline frustration.

**Acceptance Scenarios**:

1. **Given** the user has no internet connectivity, **When** they tap to complete a habit, **Then** the habit is marked complete with immediate visual feedback (chain link animation) within 200ms.
2. **Given** the user completed habits while offline, **When** they view their habits list, **Then** all offline completions are displayed correctly with accurate streak counts.
3. **Given** the user completed habits while offline, **When** they close and reopen the app (still offline), **Then** all their offline completions are preserved and visible.

---

### User Story 2 - Automatic Background Sync on Reconnect (Priority: P1)

As a user who has completed habits while offline, I want my completions to automatically sync to the server when I regain connectivity, so that my data is backed up and consistent across devices without manual intervention.

**Why this priority**: Equal to P1 because without sync, offline completions are meaningless long-term. Users expect their data to "just work" across sessions and devices. This completes the offline-to-online loop.

**Independent Test**: Can be fully tested by completing habits offline, then enabling WiFi and verifying data appears on another device or in the Convex dashboard. Delivers value by ensuring data durability.

**Acceptance Scenarios**:

1. **Given** the user has pending offline completions and regains connectivity, **When** the app detects the connection, **Then** all pending completions sync to the server automatically within 30 seconds.
2. **Given** a sync operation fails due to transient server error, **When** the system retries, **Then** it uses exponential backoff (increasing delays between attempts) to avoid overwhelming the server.
3. **Given** all pending completions have synced successfully, **When** the user checks their habits, **Then** server-calculated values (streak, strength) update to reflect synced data.

---

### User Story 3 - Visual Sync Status Indicators (Priority: P2)

As a user, I want subtle visual indicators showing my connectivity status and sync progress, so that I have confidence my data is being saved without intrusive notifications.

**Why this priority**: Important for user confidence but not blocking core functionality. Users should never wonder "did my habit save?" but the indicators should be unobtrusive.

**Independent Test**: Can be tested by observing UI elements in various connectivity states. Delivers value by reducing user anxiety about data loss.

**Acceptance Scenarios**:

1. **Given** the app has no internet connectivity, **When** viewing the habits screen, **Then** a subtle offline indicator is visible (small icon, not modal or blocking).
2. **Given** there are pending completions waiting to sync, **When** viewing a habit with pending sync, **Then** a subtle "pending" indicator shows on that habit.
3. **Given** connectivity returns and sync begins, **When** sync completes, **Then** pending indicators disappear and an optional brief "Synced" confirmation appears.

---

### User Story 4 - Graceful Conflict Resolution (Priority: P3)

As a user who may have completed habits on multiple devices while both were offline, I want the system to resolve any conflicts in my favor, so that I never lose credit for work I actually did.

**Why this priority**: Edge case but critical for trust. Most users won't encounter this, but those who do will be extremely frustrated if their completions disappear.

**Independent Test**: Can be tested by completing the same habit on two offline devices, bringing both online, and verifying the completion is preserved. Delivers value for multi-device users.

**Acceptance Scenarios**:

1. **Given** a habit was completed on Device A offline and Device B marks the same habit for the same date offline, **When** both devices sync, **Then** the habit remains marked as complete (last-write-wins, favoring completion over non-completion).
2. **Given** a conflict occurs during sync, **When** the user is notified, **Then** the notification is informational only and does not require user action.

---

### Edge Cases

- What happens when the user completes 100+ habits offline over several days? The system must handle batch processing without blocking the UI.
- How does the system handle a habit that was deleted on the server while the user had offline completions for it? Orphaned completions should be discarded gracefully without error.
- What happens if the app crashes while writing to the offline queue? The queue must be transaction-safe to prevent corruption.
- How does the system behave if the user's authentication expires while offline? Completions should still be stored locally and prompt re-authentication on sync attempt.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST store habit completions locally when offline, independent of server connectivity.
- **FR-002**: System MUST provide immediate visual feedback (under 200ms) when a user completes a habit, regardless of connectivity status.
- **FR-003**: System MUST persist the offline completion queue across app restarts and device reboots.
- **FR-004**: System MUST automatically detect connectivity changes and trigger sync when connection is restored.
- **FR-005**: System MUST process the offline queue in chronological order (FIFO) to maintain data consistency.
- **FR-006**: System MUST implement retry logic with exponential backoff for failed sync attempts.
- **FR-007**: System MUST update local streak and completion counts immediately on offline completion (optimistic calculation).
- **FR-008**: System MUST reconcile local calculations with server-authoritative values after successful sync.
- **FR-009**: System MUST display subtle, non-blocking indicators for offline status and pending sync operations.
- **FR-010**: System MUST resolve conflicts by preserving habit completions (favor "completed" over "not completed").
- **FR-011**: System MUST handle queue sizes of at least 500 pending operations without performance degradation.
- **FR-012**: System MUST NOT block the main UI thread during sync operations.

### Non-Functional Requirements

- **NFR-001**: Offline queue persistence MUST survive app termination and device restart.
- **NFR-002**: Sync operations MUST complete within 30 seconds of connectivity restoration for queues under 50 items.
- **NFR-003**: Battery impact of background sync MUST be negligible (no continuous polling when offline).

### Key Entities

- **Offline Operation**: Represents a single queued mutation (habit completion toggle). Contains: operation ID, habit ID, date, timestamp, operation type, retry count, status (pending/syncing/failed/confirmed).
- **Sync Queue**: The persistent collection of offline operations awaiting sync. Managed as FIFO with status tracking.
- **Connectivity State**: Boolean indicator of current network availability, plus metadata about connection type.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can complete habits with visual feedback in under 200ms, regardless of connectivity status.
- **SC-002**: 100% of offline completions sync successfully within 60 seconds of connectivity restoration (for queues under 50 items).
- **SC-003**: Zero data loss: all offline completions persist through app restarts, device reboots, and app updates.
- **SC-004**: Sync indicator transitions (offline → syncing → synced) complete within 2 seconds of state change.
- **SC-005**: Users report no confusion about whether their habits were saved (measurable via reduced support tickets about "lost completions").
- **SC-006**: App launch time increases by no more than 100ms when loading persisted offline queue.

## Scope Boundaries

### In Scope (MVP)

- Habit completion toggling while offline
- Automatic sync on reconnect
- Queue persistence across app restarts
- Basic sync status indicators
- Conflict resolution (completion wins)

### Out of Scope (Future)

- Offline habit creation
- Offline habit editing (name, schedule, etc.)
- Offline template browsing
- Offline settings changes
- Manual sync trigger button
- Detailed sync history/audit log
- Cross-device real-time sync notifications

## Assumptions

- Users have the app installed and authenticated before going offline (no offline login flow).
- The existing optimistic update infrastructure (`src/lib/optimistic/`) is stable and can be extended.
- The existing network status context accurately detects connectivity changes.
- AsyncStorage or equivalent is available and has sufficient capacity (typically 6MB+ on mobile).
- Convex mutations are idempotent or can be made idempotent for safe retry.
