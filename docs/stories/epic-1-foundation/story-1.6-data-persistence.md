# Story 1.6: Local Data Persistence

**Epic:** Epic 1 - MVP Foundation
**Priority:** Critical
**Status:** 🟡 PARTIAL (Convex handles this, need verification)
**Estimated Effort:** 8-10 hours

---

## User Story

**As a** user
**I want to** access my habit data instantly even offline
**So that** the app feels responsive and I never lose progress

---

## Prerequisites

- Convex backend configured ✅
- React Native AsyncStorage available ✅

---

## Acceptance Criteria

1. [ ] All habit data cached locally on device
2. [ ] App launches and displays habits in <2 seconds (cold start)
3. [ ] Habit check-offs work offline, queue for sync when online
4. [ ] Sync conflicts resolved with last-write-wins (timestamp comparison)
5. [ ] Background sync every 30 seconds when app active and online
6. [ ] Sync status indicator: subtle icon showing online/syncing/offline state
7. [ ] Data migration handled gracefully on schema changes
8. [ ] No data loss: local persistence backed by redundant storage

---

## Technical Notes

**Current State:**

- ✅ Convex provides built-in optimistic updates and sync
- ✅ Convex client handles caching automatically

**Verification Tasks:**

- **Task:** Verify offline queue behavior
  **Owner:** Developer (Jane)
  **Acceptance:** Create test scenario with offline mutations, verify they sync when connection restored

- **Task:** Verify conflict resolution strategy
  **Owner:** Developer (Jane)
  **Acceptance:** Create test with concurrent edits from 2 devices, verify last-write-wins behavior matches expectations

**Implementation Tasks:**

- Verify Convex offline sync works as expected
- Test conflict resolution (last-write-wins)
- Add offline indicator UI if not already present
- Supplement with AsyncStorage for app state if needed
- Performance: Index habits by userId and date for fast queries

**Key Files to Check/Modify:**

- `convex/_generated/react.ts` - Convex client setup
- `src/utils/sync.ts` - Sync status helpers (create if needed)
- `src/components/SyncIndicator.tsx` - Offline indicator (create if needed)

**Conflict Resolution Strategy:**

We use **last-write-wins (LWW)** for habit tracking data:

**Trade-offs:**

- ✅ Simple to implement and understand
- ✅ Works well for single-user habit tracking scenarios
- ✅ Performant - no complex merge logic
- ⚠️ Can silently discard edits if concurrent writes occur across devices
- ⚠️ Relies on accurate device timestamps (clock skew risk)
- ⚠️ No conflict detection or user notification

**Why LWW is acceptable for habit tracking:**

- Habit completions are timestamped events (rarely conflicting)
- Most users track on single device at a time
- Habit metadata (name, color) changes are infrequent
- Clock skew impact is minimal for daily tracking granularity

**Alternative considered:**
Convex supports CRDTs which provide conflict-free merges, but adds complexity.
For MVP, LWW is sufficient. Consider CRDTs in post-MVP if multi-device conflicts become an issue.

**Mitigations:**

- Client-side timestamps normalized to UTC
- Sync indicator shows users when changes are pending
- Optimistic updates provide immediate feedback

---

## Testing Strategy

**Unit Tests:**

- Offline queue logic
- Conflict resolution algorithm
- Data migration helpers

**Integration Tests:**

- Create habit offline → go online → verify sync
- Complete habit offline → go online → verify sync
- Rapid online/offline toggling
- Concurrent edits from multiple devices

**Stress Tests:**

- Create 50 habits offline → sync
- 100+ habit check-offs offline → sync
- Large data sets (1 year of tracking)

**Manual Testing:**

- Airplane mode → create habits → disable airplane mode → verify sync
- Kill app while offline → reopen → verify data persists
- Slow 3G network → verify graceful degradation

---

## Implementation Plan (Week 3)

### Day 11: Data Persistence Audit

- Review Convex sync architecture
- Test offline → online sync reliability
- Verify conflict resolution strategy
- Add local caching if needed

**Tasks:**

1. Review Convex documentation on offline behavior
2. Test offline mode with real devices
3. Measure sync performance
4. Implement offline indicator if missing

**Deliverables:**

- Sync behavior documented
- Offline indicator UI (if needed)
- Test suite for sync scenarios

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Convex sync behavior verified and documented
- [ ] Offline indicator implemented (if needed)
- [ ] Integration tests passing
- [ ] Stress tests passing
- [ ] Manual testing complete on iOS and Android
- [ ] Code reviewed
- [ ] Documentation updated

---

## Sprint Planning

**Week:** Week 3 of Epic 1 Sprint
**Day:** Day 11 (Monday)
**Total Effort:** 7-8 hours
**Dependencies:** None (Convex already configured)

---

## Notes

**Convex Built-in Features:**

- Automatic local caching
- Optimistic updates
- Background sync
- Conflict-free replicated data types (CRDTs)

**What We Need to Verify:**

- Offline queue persistence across app restarts
- Sync status visibility to user
- Performance with large data sets

---

**Created:** 2025-10-26
**Target Start:** Week 3, Day 1
**Target Complete:** Week 3, Day 1
