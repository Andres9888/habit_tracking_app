---
type: report
title: Security Vulnerabilities - Loop 00001
created: 2026-02-22
tags:
  - security
  - vulnerabilities
  - access-control
  - loop-00001
related:
  - '[[Attack Surface Map - Loop 00001]]'
  - '[[Security Analysis - Attack Surface Mapping]]'
---

# Security Vulnerabilities - Loop 00001

## Summary

- **Search Executed This Run:** Hardcoded Secrets [SEARCHED]
- **Total Findings:** 5
- **Critical:** 1
- **High:** 4
- **Medium:** 0
- **Low/Info:** 0

## Category Search Status

- Injection Flaws [SEARCHED]
- Hardcoded Secrets [SEARCHED]
- Authentication Issues [UNSEARCHED]
- XSS [UNSEARCHED]
- Insecure Cryptography [UNSEARCHED]
- Access Control Issues [SEARCHED]
- Dependency Vulnerabilities [UNSEARCHED]

---

## Hardcoded Secrets [SEARCHED]

- **Findings:** No hardcoded secrets, private keys, API tokens, or credential literals were identified in scanned source/configuration files for this category.

---

## Access Control Issues [SEARCHED]

## VULN-001: Unauthenticated Global Deletion of Archived Habits

- **Type:** Access Control Issues
- **File:** `convex/habits/archive.ts`
- **Line:** 69
- **Severity:** CRITICAL
- **Evidence:** `deleteAllArchived` accepts no auth context (`args: {}`), queries all archived habits (`ctx.db.query('habits')...collect()`), then deletes each habit and related tracking records without any `ctx.auth.getUserIdentity()` or ownership filter (`convex/habits/archive.ts:72`, `convex/habits/archive.ts:80`, `convex/habits/archive.ts:90`).
- **Attack Scenario:** Any unauthenticated caller can invoke the mutation and permanently remove archived habits/tracking data for every user in the deployment.
- **Remediation:** Require authentication, scope archived-habit queries to `identity.subject`, and validate ownership before each delete operation.

---

## VULN-002: Notes API Enables Cross-User Data Read and Tampering (IDOR Chain)

- **Type:** Access Control Issues
- **File:** `convex/notesQueries.ts`
- **Line:** 9
- **Severity:** HIGH
- **Evidence:** Notes queries expose all notes (`list`/`search`) and direct note fetch by ID (`get`) without identity checks (`convex/notesQueries.ts:12`, `convex/notesQueries.ts:23`, `convex/notesQueries.ts:46`). Notes mutations update/delete by `noteId` after existence checks only, with no auth/ownership validation (`convex/notesMutations.ts:54`, `convex/notesMutations.ts:59`, `convex/notesMutations.ts:74`, `convex/notesMutations.ts:79`).
- **Attack Scenario:** Attacker calls `api.notes.list` to enumerate note IDs and content, then calls `api.notes.update` or `api.notes.remove` against another user's records.
- **Remediation:** Enforce auth on all notes endpoints, filter reads by authenticated `userId`, set `userId` during create, and reject updates/deletes when `note.userId !== identity.subject`.

---

## VULN-003: Letters Queries and Mutations Permit Cross-User Disclosure/Modification

- **Type:** Access Control Issues
- **File:** `convex/lettersQueries.ts`
- **Line:** 43
- **Severity:** HIGH
- **Evidence:** `getUpcomingUnlocks` falls back to full-table read (`ctx.db.query('letters').collect()`) when no filter args are provided (`convex/lettersQueries.ts:61`), and `get` returns any letter by ID (`convex/lettersQueries.ts:77`) with no auth. Mutations (`markAsRead`, `update`, `remove`) only check existence/lock state, then patch/delete without ownership checks (`convex/lettersMutations.ts:56`, `convex/lettersMutations.ts:63`, `convex/lettersMutations.ts:79`, `convex/lettersMutations.ts:106`, `convex/lettersMutations.ts:118`, `convex/lettersMutations.ts:125`).
- **Attack Scenario:** Caller enumerates letters globally, reads private content, and marks other users' letters read or edits/deletes them.
- **Remediation:** Require authentication for all letter endpoints, bind queries to `identity.subject`, populate `userId` on create, and enforce per-record ownership checks for writes.

---

## VULN-004: Habit State Mutations Lack Function-Level Authorization

- **Type:** Access Control Issues
- **File:** `convex/habits/pause.ts`
- **Line:** 9
- **Severity:** HIGH
- **Evidence:** Mutations that modify habit state (`pause`, `resume`, `reorderHabits`, `toggleHabit`) patch habit/tracking records without `ctx.auth.getUserIdentity()` and without `habit.userId` ownership verification (`convex/habits/pause.ts:14`, `convex/habits/pause.ts:20`, `convex/habits/reorder.ts:25`, `convex/habits/reorder.ts:28`, `convex/habits/toggle.ts:26`, `convex/habits/toggle.ts:74`).
- **Attack Scenario:** Any client with a valid `habitId` can alter completion history, streak/strength data, pause status, and ordering of another user's habit.
- **Remediation:** Add shared auth+ownership middleware/helpers for every state-changing habit mutation and reject operations where `habit.userId !== identity.subject`.

---

## VULN-005: Vision Board Endpoints Expose and Modify Other Users' Images

- **Type:** Access Control Issues
- **File:** `convex/visionBoardImagesQueries.ts`
- **Line:** 63
- **Severity:** HIGH
- **Evidence:** `listByUser` accepts arbitrary `userId` from caller and returns that user's images (`convex/visionBoardImagesQueries.ts:66`, `convex/visionBoardImagesQueries.ts:71`) with no auth check. `updateCaption` updates any image by `imageId` after existence check only (`convex/visionBoardImagesMutations.ts:20`, `convex/visionBoardImagesMutations.ts:29`).
- **Attack Scenario:** Attacker supplies victim `userId` to enumerate private vision board images, then changes captions on victim records via `imageId`.
- **Remediation:** Remove client-provided `userId` for user-scoped queries, derive subject from auth identity, and enforce image ownership on mutation handlers.

---

## Injection Flaws [SEARCHED]

- **Outcome:** No SQL Injection, Command Injection, or Path Traversal patterns were identified in this run.
- **Scope Reviewed:** `src/**/*.ts`, `convex/**/*.ts`.
- **Evidence:** Pattern scan detected no shell-execution APIs (`child_process` / `exec` / `spawn`) and no unsafe dynamic HTML sinks (`eval` / `dangerouslySetInnerHTML`) linked to user-supplied data in production source files.

## Hardcoded Secrets [SEARCHED]

- **Outcome:** No committed hardcoded secrets, private keys, or token-bearing credentials were found.
- **Scope Reviewed:** `src/**/*.ts`, `convex/**/*.ts`, `docs/**/*.md`, `.claude/**`, `.env.example`, and `Auto Run Docs`.
- **Evidence:** Scans returned only environment placeholders (e.g., `your_openai_api_key_here`, `your_perplexity_api_key_here`) and environment-variable indirections (e.g., `${OPENAI_API_KEY}`) rather than concrete secret values.

## Findings by Category

| Category       | Count | Critical | High |
| -------------- | ----- | -------- | ---- |
| Injection      | 0     | 0        | 0    |
| Secrets        | 0     | 0        | 0    |
| Auth           | 0     | 0        | 0    |
| XSS            | 0     | 0        | 0    |
| Crypto         | 0     | 0        | 0    |
| Access Control | 5     | 1        | 4    |
| Dependencies   | 0     | 0        | 0    |

## Dependency Vulnerabilities

Not assessed in this run (category still `[UNSEARCHED]`).

## Potential False Positives

- None identified in this access-control pass; each finding includes a direct call path with missing auth/ownership checks.
