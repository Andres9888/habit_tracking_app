# Expo Notifications For Habit Reminders

## Overview

Use `expo-notifications` as the primary notification library for ChainDay habit reminders.

The app is already an Expo app (`expo` `~54.0.34`) and already depends on `expo-notifications` (`~0.32.17`) plus `expo-task-manager` (`~14.0.9`). Habit reminders are primarily user-selected local schedules, so adding OneSignal or direct Firebase Cloud Messaging would add account, credential, native setup, pricing, and operational complexity without improving the core local-reminder path.

Remote push can still be added later through Expo Push Service using the same client library and Expo push tokens. Direct FCM/APNs should be reserved for advanced push features that Expo Push Service cannot expose.

Checked date: 2026-07-14.

## Selection Rationale

| Option | Fit for habit reminders | Pricing / limits | Recency / breaking changes | Decision |
| --- | --- | --- | --- | --- |
| `expo-notifications` | Best fit. It supports local notification scheduling, notification presentation, permissions, Android channels, push tokens, foreground/background listeners, and Expo Push Service integration from the existing Expo stack. | Library is already installed. Expo Push Service docs list 600 notifications/sec/project, 100 notifications/request, 1000 receipts/request, and optional bearer-token push security. Local scheduled reminders do not use the Expo Push Service send quota. | Expo docs show current recommended SDK-versioned package `~57.0.3`, while this repo is on Expo SDK 54 and has `expo-notifications` `~0.32.17`; keep using the SDK-compatible installed version until the app upgrades Expo. Android remote push is unavailable in Expo Go from SDK 53; use a development build. | Choose. |
| OneSignal | Useful for marketing campaigns, segmentation, in-app messages, delivery analytics, and dashboard-driven remote campaigns. Overkill for local habit reminders. Requires OneSignal app ID, APNs/FCM credentials, `onesignal-expo-plugin`, `react-native-onesignal`, EAS/dev builds, and vendor account setup. | Official rate limits: Free plan create/cancel message API 150 requests/sec/app; paid 6000 requests/sec/app. Pricing page is plan-based and can change; verify before adoption. | OneSignal Expo setup currently requires Expo SDK 53+ with New Architecture enabled and development builds. Plugin ordering and iOS NSE setup are extra moving parts. | Do not choose for MVP reminders. |
| Firebase Cloud Messaging direct | Strong low-level remote push transport, especially if owning server-side push orchestration directly. Not needed for local reminders and does not replace local scheduling. For iOS it still needs APNs. | Firebase pricing lists Cloud Messaging (FCM) as no-cost. FCM HTTP v1 default downstream quota is 600k messages/min/project; Android single-device max is 240/min and 5000/hour; collapsible messages are burst-limited. | Firebase FCM quota docs were last updated 2026-07-10 UTC and note limits are subject to change. Direct FCM adds native Firebase/client setup and backend auth. | Do not choose for MVP reminders; consider only for advanced remote push. |

Primary sources:

- Expo Notifications SDK docs: https://docs.expo.dev/versions/latest/sdk/notifications/ (checked 2026-07-14)
- Expo Push Service sending docs: https://docs.expo.dev/push-notifications/sending-notifications/ (checked 2026-07-14)
- OneSignal Expo SDK setup: https://documentation.onesignal.com/docs/en/react-native-expo-sdk-setup (checked 2026-07-14)
- OneSignal rate limits: https://documentation.onesignal.com/reference/rate-limits (checked 2026-07-14)
- OneSignal pricing: https://onesignal.com/pricing (checked 2026-07-14)
- Firebase Cloud Messaging docs: https://firebase.google.com/docs/cloud-messaging (checked 2026-07-14)
- Firebase pricing: https://firebase.google.com/pricing (checked 2026-07-14)
- FCM throttling and quotas: https://firebase.google.com/docs/cloud-messaging/throttling-and-quotas (last updated 2026-07-10 UTC; checked 2026-07-14)

Context7 note: the current Codex tool registry did not expose a callable Context7 resolver/query tool in this session. The library ID that would normally be resolved is `expo-notifications`; all API details below are from current Expo documentation and the repo's installed SDK-compatible package.

## Installation

The repo already has the required packages:

```json
{
  "dependencies": {
    "expo": "~54.0.34",
    "expo-notifications": "~0.32.17",
    "expo-task-manager": "~14.0.9"
  }
}
```

For a fresh install on this Expo SDK line, use Expo's installer so the package version matches the SDK:

```sh
npx expo install expo-notifications expo-task-manager
```

Use a development build or production build for real device push testing. Expo docs state Android remote push is unavailable in Expo Go from SDK 53 onward; local notifications remain available in Expo Go, but habit-reminder QA should use dev/release builds because app behavior depends on Android channels, permissions, boot behavior, and iOS notification settings.

## Configuration (env vars + init code)

### Env Vars

Local scheduled habit reminders do not require server env vars.

Recommended env vars if remote push is enabled:

| Name | Required | Used by | Notes |
| --- | --- | --- | --- |
| `EXPO_PUBLIC_EAS_PROJECT_ID` | Optional | Client fallback for `getExpoPushTokenAsync({ projectId })` | The repo already has `extra.eas.projectId = "32c36f06-6185-42ca-aee8-5a939ad68d75"` in `app.json`; prefer reading `Constants.expoConfig.extra.eas.projectId` / `Constants.easConfig.projectId`. |
| `EXPO_PUSH_ACCESS_TOKEN` | Optional but recommended for remote push | Backend only | Set only if Expo enhanced push security is enabled. Send as `Authorization: Bearer ${EXPO_PUSH_ACCESS_TOKEN}`. Never expose this through `EXPO_PUBLIC_`. |
| `APNS_KEY_ID`, `APNS_TEAM_ID`, `APNS_KEY_P8`, `FCM_V1_SERVICE_ACCOUNT_JSON` | Not required for local reminders | EAS credentials / backend depending on push path | Prefer EAS credentials management for Expo Push Service. Direct FCM/APNs or custom credential automation may need secure non-public values. |

Do not add OneSignal env vars unless the product decision changes:

| Name | Required if OneSignal chosen | Notes |
| --- | --- | --- |
| `EXPO_PUBLIC_ONESIGNAL_APP_ID` | Yes | Client-visible OneSignal app ID used by `OneSignal.initialize`. |
| OneSignal REST API key | Yes for server sends | Backend-only secret; never ship in the app. |

### App Config

Current `app.json` already includes `"expo-notifications"` in `plugins`. Make the plugin explicit before shipping custom Android icon/color/channel/sounds:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#059669",
          "defaultChannel": "habit-reminders",
          "sounds": ["./assets/sounds/reminder.wav"],
          "enableBackgroundRemoteNotifications": false
        }
      ]
    ],
    "ios": {
      "infoPlist": {
        "NSUserNotificationsUsageDescription": "ChainDay sends reminders you choose (habit check-ins, streak alerts, and scheduled motivation messages) to help you stay consistent."
      }
    }
  }
}
```

Set `enableBackgroundRemoteNotifications: true` only if the app implements remote, data-only background notification handling on iOS. That adds `remote-notification` to `UIBackgroundModes`; it is not needed for ordinary local scheduled reminders.

For exact-time alarms on Android 12+, Expo docs say `SCHEDULE_EXACT_ALARM` is needed for exact triggers. Add it only if product requirements require exact alarm behavior and policy review accepts the permission:

```json
{
  "expo": {
    "android": {
      "permissions": ["android.permission.SCHEDULE_EXACT_ALARM"]
    }
  }
}
```

### Runtime Init

Initialize notification presentation once, early in app startup:

```ts
import * as Notifications from 'expo-notifications';

export function initNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}
```

Create the Android channel before requesting permissions or obtaining push tokens:

```ts
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

export const HABIT_REMINDER_CHANNEL_ID = 'habit-reminders';

export async function ensureHabitReminderChannel() {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync(HABIT_REMINDER_CHANNEL_ID, {
    name: 'Habit reminders',
    description: 'Reminders for habits you choose.',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    sound: 'reminder.wav',
  });
}
```

## Key Patterns (code examples)

### Permission Check

On iOS, Expo recommends interpreting `settings.ios.status`, not only the root `status`, because provisional authorization is possible.

```ts
import * as Notifications from 'expo-notifications';

export async function allowsHabitReminders() {
  const settings = await Notifications.getPermissionsAsync();

  return (
    settings.granted ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

export async function requestHabitReminderPermissions() {
  await ensureHabitReminderChannel();

  return Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  });
}
```

### Schedule One Habit Reminder

Persist the returned notification identifier with the habit/reminder record so archive, delete, time changes, and undo can cancel/reschedule the right notification.

```ts
import * as Notifications from 'expo-notifications';

type HabitReminderInput = {
  habitId: string;
  habitName: string;
  hour: number;
  minute: number;
};

export async function scheduleDailyHabitReminder({
  habitId,
  habitName,
  hour,
  minute,
}: HabitReminderInput) {
  await ensureHabitReminderChannel();

  return Notifications.scheduleNotificationAsync({
    content: {
      title: habitName,
      body: 'Time to keep the chain going.',
      data: {
        habitId,
        url: `habit-tracker://habit/${habitId}`,
      },
      sound: 'reminder.wav',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      channelId: HABIT_REMINDER_CHANNEL_ID,
    },
  });
}
```

### Cancel or Replace a Reminder

```ts
import * as Notifications from 'expo-notifications';

export async function cancelHabitReminder(notificationId?: string | null) {
  if (!notificationId) return;
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

export async function replaceHabitReminder(
  previousNotificationId: string | null | undefined,
  nextReminder: HabitReminderInput,
) {
  await cancelHabitReminder(previousNotificationId);
  return scheduleDailyHabitReminder(nextReminder);
}
```

### Audit Scheduled Reminders

Use this in debug screens/tests to detect orphaned notifications after archive/delete/restore flows.

```ts
import * as Notifications from 'expo-notifications';

export async function listScheduledHabitReminders() {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();

  return scheduled.filter((request) => {
    const habitId = request.content.data?.habitId;
    return typeof habitId === 'string' && habitId.length > 0;
  });
}
```

### Notification Tap Routing

```ts
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';

export function useHabitReminderResponses() {
  useEffect(() => {
    const lastResponse = Notifications.getLastNotificationResponse();
    const initialUrl = lastResponse?.notification.request.content.data?.url;

    if (typeof initialUrl === 'string') {
      void Linking.openURL(initialUrl);
    }

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const url = response.notification.request.content.data?.url;
        if (typeof url === 'string') {
          void Linking.openURL(url);
        }
      },
    );

    return () => subscription.remove();
  }, []);
}
```

### Remote Push Token (Optional Later)

```ts
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

export async function getExpoPushToken() {
  await ensureHabitReminderChannel();

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId ??
    process.env.EXPO_PUBLIC_EAS_PROJECT_ID;

  if (!projectId) {
    throw new Error('Missing EAS project ID for Expo push token registration.');
  }

  try {
    const token = await Notifications.getExpoPushTokenAsync({ projectId });
    return token.data;
  } catch (error) {
    // Expo docs say this call can fail offline or on HTTPS/network errors.
    // Queue retry when connectivity returns instead of blocking reminders.
    throw error;
  }
}
```

### Background Remote Notification Task (Optional Later)

Only use this for remote data-only pushes, not normal local habit reminders.

```ts
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

TaskManager.defineTask<Notifications.NotificationTaskPayload>(
  BACKGROUND_NOTIFICATION_TASK,
  ({ data, error }) => {
    if (error) {
      return Notifications.BackgroundNotificationResult.Failed;
    }

    // Handle data-only remote payload. Keep this work minimal.
    void data;
    return Notifications.BackgroundNotificationResult.NoData;
  },
);

void Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
```

For iOS background remote delivery via Expo Push Service, send a data-only payload with `_contentAvailable: true`, configure `enableBackgroundRemoteNotifications: true`, and expect OS throttling. Apple guidance surfaced in Expo docs says not to send more than two or three background notifications per hour.

## API Reference table

| API | Signature / return | Use in ChainDay | Source |
| --- | --- | --- | --- |
| `Notifications.setNotificationHandler(handler)` | Returns `void`; `handleNotification` must respond within 3 seconds. | Required so foreground-triggered reminders display banner/list. | Expo Notifications docs, checked 2026-07-14 |
| `Notifications.getPermissionsAsync()` | `Promise<NotificationPermissionsStatus>` | Read current permission state without prompting. | Expo Notifications docs, checked 2026-07-14 |
| `Notifications.requestPermissionsAsync(permissions?)` | `Promise<NotificationPermissionsStatus>` | Ask for alert/badge/sound permissions after user intent. | Expo Notifications docs, checked 2026-07-14 |
| `Notifications.setNotificationChannelAsync(channelId, channel)` | `Promise<NotificationChannel \| null>` | Create `habit-reminders` Android channel before permission/token flow. | Expo Notifications docs, checked 2026-07-14 |
| `Notifications.scheduleNotificationAsync(request)` | `Promise<string>` notification identifier | Schedule daily/weekly habit reminders; persist returned identifier. | Expo Notifications docs, checked 2026-07-14 |
| `Notifications.cancelScheduledNotificationAsync(identifier)` | `Promise<void>` | Cancel on archive/delete/disable/time change. | Expo Notifications docs, checked 2026-07-14 |
| `Notifications.cancelAllScheduledNotificationsAsync()` | `Promise<void>` | Use only for account logout/reset/debug cleanup, not normal habit edits. | Expo Notifications docs, checked 2026-07-14 |
| `Notifications.getAllScheduledNotificationsAsync()` | `Promise<NotificationRequest[]>` | Debug orphaned reminder schedules. | Expo Notifications docs, checked 2026-07-14 |
| `Notifications.getNextTriggerDateAsync(trigger)` | `Promise<number \| null>` | Validate schedule previews before saving reminder settings. | Expo Notifications docs, checked 2026-07-14 |
| `Notifications.addNotificationReceivedListener(listener)` | `EventSubscription` | Observe foreground receipt for analytics/debug. | Expo Notifications docs, checked 2026-07-14 |
| `Notifications.addNotificationResponseReceivedListener(listener)` | `EventSubscription` | Route notification taps to habit detail. | Expo Notifications docs, checked 2026-07-14 |
| `Notifications.getLastNotificationResponse()` | `NotificationResponse \| null` | Handle cold-start/open-from-notification route. | Expo Notifications docs, checked 2026-07-14 |
| `Notifications.getExpoPushTokenAsync({ projectId })` | `Promise<ExpoPushToken>` | Optional remote push token registration. Must catch offline/network failures. | Expo Notifications docs, checked 2026-07-14 |
| `Notifications.addPushTokenListener(listener)` | `EventSubscription` | Optional remote token rotation handling. | Expo Notifications docs, checked 2026-07-14 |
| `TaskManager.defineTask` + `Notifications.registerTaskAsync(taskName)` | `registerTaskAsync` returns `Promise<null>` | Optional data-only remote background tasks. Define/register in module scope loaded early, such as `index.ts`. | Expo Notifications docs, checked 2026-07-14 |

## Gotchas

- Local notifications are the correct MVP primitive. Do not send server pushes for reminders that can be scheduled on-device.
- Create Android notification channels before requesting notification permission or push tokens. Android 13 permission prompt behavior depends on a channel existing.
- Android 8+ notifications should specify an app-owned channel. Otherwise Expo creates a fallback "Miscellaneous" channel.
- After an Android channel is created, the OS allows changing only its name and description. Sound/importance changes may require a new channel ID.
- Android custom sound must be configured on both the channel and notification content to cover pre-8.0 and 8.0+ behavior.
- Android exact-time reminders on Android 12+ may require `SCHEDULE_EXACT_ALARM`. Treat this as a product/policy decision, not a default permission.
- Android receives `RECEIVE_BOOT_COMPLETED` automatically from `expo-notifications` so scheduled notifications can be restored after reboot.
- iOS notification permission is granular. Treat `PROVISIONAL` as allowed for noninterruptive notifications when appropriate.
- `setNotificationHandler` must respond within 3 seconds; default behavior without a handler or after timeout is not to show the notification.
- `getExpoPushTokenAsync` makes network requests to Expo and can fail offline. Do not block local reminder scheduling on remote push token registration.
- Remote push testing on Android requires a development build from SDK 53 onward. Expo Go is not enough for Android remote push.
- iOS APNs entitlement is set to development in local builds and changed by Xcode for release archives, per Expo docs.
- Background remote notification tasks are not reliable schedulers. OS delivery can be skipped in Android Doze, throttled by Apple, or dropped under volume pressure.
- Keep background task definitions at module scope in a file loaded early by the app, because `expo-task-manager` loads the JS bundle in the background.
- Expo Push Service enhanced security is optional but recommended for remote pushes; if enabled, every push API request must include `Authorization: Bearer ${EXPO_PUSH_ACCESS_TOKEN}`.
- Push payloads must stay within provider limits. Expo's message format notes `data` may be about 4 KiB and the total payload sent to Apple/Google must be at most 4 KiB.
- Persist notification identifiers server-side or locally with the habit. Archive/delete/restore flows should cancel only after the corresponding mutation succeeds, then reschedule on undo/restore.

## Rate Limits

### Local Scheduled Reminders

No Expo Push Service, OneSignal, or FCM send quota applies to purely local scheduled notifications.

Practical product limits:

- Avoid scheduling unbounded notifications per habit. Prefer one repeating schedule per enabled reminder where possible.
- Keep a debug/audit path with `getAllScheduledNotificationsAsync()` to catch orphaned schedules.
- Do not use background remote notifications as a high-frequency scheduler. Apple guidance cited in Expo docs is not more than two or three background notifications per hour.

### Expo Push Service (Optional Remote Push)

Official documented limits:

- 600 notifications/sec/project.
- 100 notifications/request.
- 1000 push receipts/request.
- Node server SDK limits concurrent connections to six and includes retry/backoff behavior.
- Payload data is about 4 KiB; total notification payload sent to Apple/Google must be at most 4 KiB.
- Optional enhanced push security requires a bearer access token.

### OneSignal (Not Selected)

Official documented API limits:

- Free plans: 150 create/cancel message requests/sec/app.
- Paid plans: 6000 create/cancel message requests/sec/app.
- Create and cancel share the same rate limit.
- User/subscription create/update/delete: 1000 requests/sec/app and 1 request/sec per user or subscription.
- Retry with `idempotency_key`; OneSignal recommends waiting 100 seconds for non-urgent retries and honoring `Retry-After` on 429.

Pricing:

- Pricing is plan-based at https://onesignal.com/pricing and should be rechecked before adoption. Use source date 2026-07-14 for this spec.

### Firebase Cloud Messaging Direct (Not Selected)

Official documented limits/pricing:

- Firebase pricing lists Cloud Messaging (FCM) as no-cost.
- HTTP v1 default downstream quota: 600k messages/min/project.
- Quota measures messages, not requests; client errors count except 429.
- Android single-device maximum: 240 messages/min and 5000/hour.
- Collapsible messages: burst of 20 messages/app/device with refill of 1 every 3 minutes.
- FCM docs note limits are subject to change.

## Currency (version · checked date · source)

| Item | Version / date | Source |
| --- | --- | --- |
| Repo Expo SDK | `expo` `~54.0.34`; checked 2026-07-14 | `package.json` |
| Repo notifications package | `expo-notifications` `~0.32.17`; checked 2026-07-14 | `package.json` |
| Repo task manager package | `expo-task-manager` `~14.0.9`; checked 2026-07-14 | `package.json` |
| Expo current docs recommended notifications version | `~57.0.3`; checked 2026-07-14 | https://docs.expo.dev/versions/latest/sdk/notifications/ |
| Expo Push Service limits/security | checked 2026-07-14 | https://docs.expo.dev/push-notifications/sending-notifications/ |
| OneSignal Expo SDK setup | requires Expo SDK 53+, New Architecture, EAS/dev build; checked 2026-07-14 | https://documentation.onesignal.com/docs/en/react-native-expo-sdk-setup |
| OneSignal API rate limits | checked 2026-07-14 | https://documentation.onesignal.com/reference/rate-limits |
| OneSignal pricing | checked 2026-07-14 | https://onesignal.com/pricing |
| Firebase pricing | FCM no-cost; checked 2026-07-14 | https://firebase.google.com/pricing |
| FCM throttling and quotas | last updated 2026-07-10 UTC; checked 2026-07-14 | https://firebase.google.com/docs/cloud-messaging/throttling-and-quotas |

## References

- Expo Notifications SDK: https://docs.expo.dev/versions/latest/sdk/notifications/
- Expo Push Notifications overview: https://docs.expo.dev/push-notifications/overview/
- Expo Push Service sending: https://docs.expo.dev/push-notifications/sending-notifications/
- OneSignal Expo SDK setup: https://documentation.onesignal.com/docs/en/react-native-expo-sdk-setup
- OneSignal rate limits and error handling: https://documentation.onesignal.com/reference/rate-limits
- OneSignal pricing: https://onesignal.com/pricing
- Firebase Cloud Messaging: https://firebase.google.com/docs/cloud-messaging
- Firebase pricing: https://firebase.google.com/pricing
- FCM throttling and quotas: https://firebase.google.com/docs/cloud-messaging/throttling-and-quotas
