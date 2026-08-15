# ChainDay App Store Submission Board

> **Authoritative launch tracker**
> Last audited: 2026-08-13
> App: ChainDay for iOS/iPadOS
> Bundle ID: `com.chainday.app`
> Configured App Store Connect app ID: `6758899638` (not yet verified against App Store Connect)
> Current gate: **BLOCKED — no release candidate has passed the launch gates below**

This replaces the status assumptions in `APPSTORE-01-pre-submission-fixes.md`,
`APPSTORE-02-testing-timeline.md`, `RELEASE_SPRINT_PLAN.md`, and
`specs/app-store-submission-requirements.md`. Those files remain historical
context only.

## How to use this board

- `[x]` means verified with current evidence, not merely implemented once.
- `[ ]` means incomplete or not verified.
- **P0** blocks submission. **P1** should be finished before submission unless
  the release owner explicitly accepts the risk. **P2** may move post-launch.
- Put evidence beside each completed task: build number, commit, TestFlight
  build, screenshot, command output, or App Store Connect record.
- App Store submission and release remain manual owner decisions. Do not submit
  or release automatically.

## Current preflight snapshot

### Confirmed locally

- [x] **LOCAL-01** — `app.json` uses `com.chainday.app`, version `1.0.0`, and
      build `16`.
- [x] **LOCAL-02** — The app icon is 1024×1024 RGB with no alpha; the splash
      image is 2048×2048.
- [x] **LOCAL-03** — A notification permission explanation is configured.
- [x] **LOCAL-04** — A privacy manifest exists and is included in the native
      app target.
- [x] **LOCAL-05** — Purchase and restore-purchase implementations exist.
- [x] **LOCAL-06** — In-app Privacy and Terms links currently point to public
      GitHub Pages and returned HTTP 200 on 2026-08-13.
- [x] **LOCAL-07** — The installed Xcode is 26.6 with the iPhoneOS 26.5 SDK,
      satisfying Apple's requirement in effect since 2026-04-28 to upload with
      Xcode 26 and an iOS 26-family SDK.

### Blocking or unverified now

- [ ] **P0 / RC-01** — Select and freeze an exact release commit. The audited
      checkout is `main`, 30 commits ahead of `origin/main`, with many modified and
      untracked application files. It is not a reproducible release candidate.
- [ ] **P0 / LEGAL-01** — Fix the public URL source of truth. `app.json` points
      to `https://chainday.app/privacy` and `https://chainday.app/support`, but the
      `chainday.app` host did not resolve on 2026-08-13. The app itself uses working
      GitHub Pages URLs for Privacy and Terms. Choose one canonical set and make
      every surface and App Store Connect match it.
- [ ] **P0 / PAY-01** — Add functional Privacy Policy and Terms/EULA links to
      every subscription purchase surface. The audited RevenueCat, PremiumPaywall,
      and PaywallSheet surfaces show pricing/restore copy but not both legal links.
- [ ] **P0 / PAY-02** — Remove the hardcoded `$6.99/month` from
      `PaywallSheet.tsx`; display the selected App Store product's localized billed
      amount and period.
- [ ] **P0 / PRIV-01** — Reconcile the public privacy policy with actual data
      and SDK use. The current page names Convex, Clerk, and RevenueCat, but does not
      disclose Sentry and must be checked against account identifiers, crash and
      performance data, product interaction analytics, user-created habit/note/
      image/audio content, retention, deletion, and permission use.
- [ ] **P0 / ASC-01** — Authenticate App Store Connect access. `asc auth doctor`
      found no stored credentials, so the app record, metadata, IAP products,
      agreements, builds, privacy answers, and review state are unverified.
- [ ] **P0 / BUILD-01** — Resolve the current Expo preflight failures. On
      2026-08-13 `npx expo-doctor` passed 17/20 checks and failed for multiple lock
      files, native/app-config synchronization risk, and 20 Expo SDK patch-version
      mismatches.
- [ ] **P0 / BIN-01** — Produce and inspect a signed production archive. The
      source entitlement says `aps-environment=development`; the archived binary
      must show the production entitlement. The release archive must also be free
      of dev-only local-network/Bonjour configuration unless intentionally required.
- [ ] **P0 / TF-01** — Install the same candidate from TestFlight on a physical
      iPhone and complete the critical-flow and subscription matrices below.
- [ ] **P0 / STORE-01** — Complete and verify the App Store product page,
      subscription metadata, reviewer access, privacy answers, and 2026 age-rating
      questionnaire in App Store Connect.

## Start here — ordered task queue

| Order | Task                                                 | Owner                           | Done when                                                                                |
| ----- | ---------------------------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------- |
| 1     | Restore App Store Connect visibility                 | ASC owner                       | `asc apps view --id 6758899638` succeeds and the app/IAP/build state is recorded         |
| 2     | Choose iPhone-only or iPhone + iPad for v1           | Release owner                   | `supportsTablet`, QA scope, and screenshot scope agree                                   |
| 3     | Establish canonical Privacy, Terms, and Support URLs | Product owner + repo maintainer | All URLs work publicly and app/config/store metadata match                               |
| 4     | Fix purchase-surface compliance                      | Repo maintainer                 | Every paywall uses localized product data and has Restore, Privacy, and Terms/EULA links |
| 5     | Clear Expo/native preflight                          | Repo maintainer                 | One lock file, deliberate config sync, supported package set, and `expo-doctor` passes   |
| 6     | Freeze and build the release candidate               | Release owner + repo maintainer | Exact commit produces an inspected production archive and processed TestFlight build     |
| 7     | Run physical-device and subscription gates           | Device QA                       | All P0 scenarios pass on that exact TestFlight build                                     |
| 8     | Finish product page and reviewer packet              | ASC owner                       | Metadata, screenshots, privacy, IAP, credentials, and notes match the candidate          |
| 9     | Make the ship/no-ship decision                       | Release owner                   | Final gate says PASS and submission is explicitly authorized                             |

## Gate 1 — Release scope and repository state

**Owner:** Release owner + repo maintainer
**Pass condition:** one immutable commit maps to one production build.

- [ ] **P0** Decide whether v1 supports iPad. `supportsTablet` is currently
      `true`; keeping it requires iPad screenshots and device QA. If iPad is not a
      launch target, remove support before the release build.
- [ ] **P0** Finish or intentionally exclude all current dirty application
      changes; preserve unrelated work and do not clean the tree destructively.
- [ ] **P0** Record the release commit SHA, branch, version, and EAS build number.
- [ ] **P0** Confirm production Convex, Clerk, RevenueCat, Sentry, and Expo
      configuration without committing secrets.
- [ ] **P1** Remove obsolete native artifacts such as the old
      `ios/DailyHabits/Products.storekit` if the release build does not use them.
- [ ] **P1** Define rollback: previous build, backend compatibility, feature
      flags, and who can halt release.

**Evidence:**

```text
Release commit:
Version / build:
EAS build URL:
Rollback owner:
```

## Gate 2 — Legal, privacy, and account compliance

**Owner:** Product/legal owner + repo maintainer
**Pass condition:** links work publicly, disclosures match behavior, and account
deletion succeeds end to end.

- [ ] **P0** Publish canonical Privacy, Terms/EULA, and Support URLs over HTTPS;
      test them signed out and from a phone on cellular data.
- [ ] **P0** Reconcile `app.json`, `src/constants/urls.ts`, the login footer,
      Settings footer, every paywall, and App Store Connect to the canonical URLs.
- [ ] **P0** Ensure the privacy policy explains collection, use, sharing,
      retention/deletion, consent withdrawal, and each processor: Clerk, Convex,
      RevenueCat, Sentry, Expo/notifications, and any analytics provider actually
      present in the release.
- [ ] **P0** Complete App Store Privacy answers from a written data inventory;
      do not infer the answers only from `PrivacyInfo.xcprivacy`.
- [ ] **P0** Test account deletion on the release backend: app data, uploaded
      media, identity-provider account, active subscription explanation, recovery
      after partial failure, and inability to sign back into a half-deleted account.
- [ ] **P0** Verify photo, camera, microphone, notification, and any tracking
      prompts are contextual, accurate, deny-safe, and declared consistently.
- [ ] **P0** Verify Sign in with Apple and Google on a production build. Test
      Apple Hide My Email and confirm no redundant name/email collection.
- [ ] **P1** Review all health/wellness and “science-backed” claims in the app
      and listing. Do not imply diagnosis, treatment, guaranteed outcomes, or
      medical accuracy the app cannot substantiate.
- [ ] **P1** Verify contact email addresses on the policy/support pages can
      receive mail; a page returning 200 is not enough if the domain has no mail.

## Gate 3 — Subscriptions and RevenueCat

**Owner:** App Store Connect owner + RevenueCat owner + device QA
**Pass condition:** localized product truth and the complete sandbox lifecycle
work from the uploaded candidate.

- [ ] **P0** Confirm Paid Apps agreement, tax, and banking are active.
- [ ] **P0** Verify subscription group, product IDs, locales, prices, durations,
      trial eligibility, availability, and review status in App Store Connect.
- [ ] **P0** Verify RevenueCat app, entitlement, products, offering, webhook,
      API key, and production bundle ID all match App Store Connect.
- [ ] **P0** Make the actual billed amount the clearest price on every paywall;
      derived monthly savings must remain visually subordinate.
- [ ] **P0** Show title, duration, localized billed amount, renewal/trial terms,
      Restore Purchases, Privacy Policy, and Terms/EULA on each purchase surface.
- [ ] **P0** Test monthly and annual packages independently; the checked-in
      StoreKit file currently models a 7-day monthly trial and a 14-day annual trial.
- [ ] **P0** Test new purchase, cancel sheet, failed purchase, interrupted
      network, duplicate tap, restore after reinstall, restore on a second device,
      trial-to-paid, cancellation, expiration, and resubscribe.
- [ ] **P0** Verify entitlement updates in the app and Convex after webhook delay,
      retry, duplicate event, out-of-order event, and app relaunch.
- [ ] **P0** Submit any first-time subscription/IAP items with the app version
      when required by App Store Connect.
- [ ] **P1** Verify Manage Subscription opens the correct Apple destination and
      that “cancel anytime” copy does not imply cancellation inside ChainDay.

## Gate 4 — Production binary

**Owner:** Repo maintainer
**Pass condition:** production archive builds from the frozen commit and its
contents match the declarations.

- [ ] **P0** Choose one package manager and lock file for local/CI/EAS builds.
- [ ] **P0** Reconcile native folders with Expo config deliberately. Because
      `ios/` and `android/` are checked in, EAS will not automatically sync several
      `app.json` fields and plugins.
- [ ] **P0** Bring Expo SDK dependencies to a supported, internally consistent
      patch set; rerun `npx expo-doctor` to 20/20 or document an approved exception.
- [ ] **P0** Run focused security tests, full unit/integration tests, TypeScript,
      lint, Expo export, dependency audit, secret scan, and `git diff --check`.
- [ ] **P0** Build with Xcode 26+ and an iOS 26-family SDK.
- [ ] **P0** Inspect the archived `.app` for bundle ID, version/build, signing
      team, distribution profile, `aps-environment=production`, permission strings,
      background modes, URL schemes, privacy manifests, and embedded SDK signatures.
- [ ] **P0** Confirm the production archive does not expose secrets, dev menus,
      local Metro URLs, verbose user data, test products, or debug-only screens.
- [ ] **P0** Upload the exact archive to TestFlight and record its processing
      result. Do not substitute a simulator/dev-client build.

Suggested evidence commands:

```bash
npx expo-doctor
npm run typecheck
npm run lint:eslint
npm test -- --runInBand
npm run test:security:fast
npm run build
npm run scan:secrets
git diff --check
```

## Gate 5 — TestFlight and physical-device QA

**Owner:** Device QA
**Pass condition:** all P0 scenarios pass on the uploaded build, with screenshots
or recordings and no unresolved P0/P1 defects.

### Installation and account

- [ ] **P0** Clean install from TestFlight, first launch, permission denial, and
      permission acceptance.
- [ ] **P0** Upgrade from the previous available build without data loss.
- [ ] **P0** Sign in with Apple, including Hide My Email; sign out and back in.
- [ ] **P0** Sign in with Google and handle cancellation/error recovery.
- [ ] **P0** Delete account and verify the full deletion behavior from Gate 2.

### Core habit journey

- [ ] **P0** Create, edit, schedule, pause/resume, archive/restore, and delete a
      habit.
- [ ] **P0** Complete/uncomplete scheduled habits; verify off-day, future-day,
      timezone, midnight, streak, and recovery semantics.
- [ ] **P0** Add a habit from the Library and confirm success, duplicate, failure,
      close/reopen, and navigation behavior.
- [ ] **P0** Verify Home, Habit Detail, Analytics, Settings, and onboarding with
      empty, loading, populated, offline, and error states.
- [ ] **P1** Test image selection/capture, voice note recording/playback, sharing,
      export, feedback, rate-app fallback, and legal links.

### Reliability and platform behavior

- [ ] **P0** Complete a habit offline, relaunch offline, reconnect, and verify no
      duplicate/lost/conflicting data.
- [ ] **P0** Schedule each reminder type, receive it while foregrounded,
      backgrounded, and terminated, then verify notification-tap routing.
- [ ] **P0** Test cold start, background/foreground, force quit, low connectivity,
      time-zone change, and date rollover.
- [ ] **P0** Complete the subscription matrix in Gate 3 on a physical iPhone.
- [ ] **P1** Run VoiceOver, Dynamic Type, Reduce Motion, contrast, keyboard, and
      44×44-point target checks on the critical journey.
- [ ] **P0** If iPad support remains enabled, repeat the critical journey on an
      iPad and check portrait/landscape layouts.

## Gate 6 — App Store Connect product page and review packet

**Owner:** App Store Connect owner
**Pass condition:** every required field is accurate for the selected build and
reviewers can reach all functionality without contacting us first.

- [ ] **P0** Verify app name (30 characters max), subtitle, description,
      promotional text, keywords, categories, copyright, price, and availability.
- [ ] **P0** Complete the updated 2026 age-rating questionnaire.
- [ ] **P0** Complete Privacy Policy URL, App Privacy answers, export compliance,
      content rights, and encryption declarations.
- [ ] **P0** Add the Terms/EULA link to every localized description or configure
      the EULA field; verify subscription metadata is complete in every locale.
- [ ] **P0** Provide one to ten current screenshots. Use an accepted 6.9-inch
      iPhone size; if iPad support remains enabled, also provide the required iPad
      set. Screenshots must show the submitted build and fictional/sample data.
- [ ] **P1** Skip the app preview for v1 unless there is a tested conversion
      reason to include it; if included, use app screen capture and verify Apple's
      preview specifications.
- [ ] **P0** Confirm Support URL works, offers contact, and matches the submitted
      app. Confirm Marketing URL if supplied.
- [ ] **P0** Create a durable reviewer path: demo account or fully featured demo
      mode, credentials stored only in App Store Connect, no expiring MFA, and
      premium test instructions.
- [ ] **P0** Write review notes covering login, first habit, reminders,
      subscriptions, Restore Purchases, account deletion, permissions, non-obvious
      features, and anything controlled by a feature flag.
- [ ] **P0** Keep production backend services and the reviewer account available
      for the full review window.
- [ ] **P0** Select the exact processed build and add the app plus any first-time
      subscriptions/IAP to the submission.

## Final ship/no-ship gate

All rows must be true before the owner clicks **Submit for Review**:

- [ ] One frozen commit maps to one signed TestFlight build.
- [ ] Expo preflight, code checks, archive inspection, and physical-device P0 QA pass.
- [ ] Public legal/support pages and in-app links work.
- [ ] App Privacy, subscription details, screenshots, metadata, and review notes
      match the uploaded build.
- [ ] Reviewer access works without assistance.
- [ ] No open P0 or P1 defects; any accepted exception has an owner and rollback.
- [ ] Release owner has performed a final App Store Connect diff/read-through.
- [ ] Release owner explicitly authorizes submission.

```text
Status: PASS | BLOCKED
Release commit:
TestFlight build:
Open P0/P1:
Decision owner:
Decision timestamp:
```

## After submission

### Immediately after submitting

- [ ] Record submission ID, version/build, submitted IAP, timestamp, and owner.
- [ ] Verify status changed to Ready for Review / Waiting for Review as expected.
- [ ] Recheck reviewer credentials and keep production services operational.
- [ ] Freeze release-affecting backend/config changes or log every necessary change.
- [ ] Monitor App Store Connect messages and the review contact inbox.

### While in review

- [ ] Respond promptly with reproduction steps and evidence.
- [ ] For metadata-only issues, correct only the requested metadata and document it.
- [ ] For binary issues, reproduce on the submitted build, create a new build,
      rerun affected gates, developer-reject if necessary, and resubmit with notes.
- [ ] Do not silently change paywalls, offerings, feature flags, reviewer access,
      or backend behavior during review.

### After approval, before release

- [ ] Reconfirm price, storefront availability, phased/manual release setting,
      production backend, RevenueCat offering, legal/support pages, and monitoring.
- [ ] Run a final smoke test on the approved build if it remains available in
      TestFlight.
- [ ] Release only after explicit owner approval.

### After release

- [ ] Verify the public product page, screenshots, legal links, price, and download.
- [ ] Clean-install the public App Store build on a physical iPhone and run sign
      in, habit completion, purchase/restore, notifications, and account deletion.
- [ ] Monitor crash-free sessions, auth errors, Convex failures, RevenueCat
      purchase/webhook errors, reviews, refunds, and support contacts.
- [ ] Define rollback/hotfix thresholds and create post-launch P0 tickets immediately.

## App Store Connect access setup

No App Store Connect credentials were available during this audit. The owner can
configure access without committing secrets:

```bash
asc auth login
asc auth doctor
asc apps view --id 6758899638
asc metadata pull --app 6758899638 --version 1.0 --dir ./artifacts/app-store/metadata
```

After access is configured, rerun the metadata, subscription, build, privacy,
and submission-state checks before changing this board to PASS.

## Current official references

- [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Submit an app](https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-an-app)
- [Screenshot specifications](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications)
- [Upcoming submission requirements](https://developer.apple.com/news/upcoming-requirements/)
- [Apple standard EULA](https://www.apple.com/legal/internet-services/itunes/dev/stdeula/)
