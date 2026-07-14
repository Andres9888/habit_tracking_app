# Expo Notifications and Background Tasks

## Overview

Use Expo's first-party stack for this app:

- `expo-notifications` for local scheduled reminders, foreground notification handling, permission prompts, Expo push tokens, and optional remote push.
- `expo-background-task` plus `expo-task-manager` for deferrable background sync/prefetch work.
- Do not use `expo-background-fetch`; Expo marks it deprecated and says it is being replaced by `expo-background-task`.
- Do not add OneSignal unless the product needs a hosted customer messaging platform: journeys, segmentation, analytics, in-app messaging, message history, CSV exports, or non-engineer campaign tooling.

This app currently has Expo SDK 54-era packages in `package.json`:

- `expo`: `~54.0.34`
- `expo-notifications`: `~0.32.17`
- `expo-background-task`: `~1.0.10`
- `expo-task-manager`: `~14.0.9`

Current Expo docs checked on 2026-07-14 show latest recommended versions:

- `expo-notifications`: `~57.0.3`
- `expo-background-task`: docs page latest version, install with `npx expo install expo-background-task`
- `expo-background-fetch`: `~57.0.2`, deprecated

Do not hard-code latest package versions into SDK 54. Use `npx expo install` so Expo selects compatible versions for the installed SDK.

## Selection Rationale

| Option | Best fit | Tradeoffs | Pricing / limits | Decision |
| --- | --- | --- | --- | --- |
| `expo-notifications` | Local habit reminders, scheduled notifications, Expo push tokens, native push tokens, foreground/background notification listeners | Push remote notifications require credentials and a development/release build; Expo Go on Android no longer supports push notifications from SDK 53 onward | Expo Push Service has no send cost; limit is 600 notifications/second/project | Choose |
| `expo-background-task` + `expo-task-manager` | Deferrable sync, stale cache refresh, reminder reconciliation, lightweight maintenance when the app is backgrounded | OS decides timing; not reliable for exact alarms or guaranteed daily execution; iOS Background Tasks require a physical device | Platform scheduling only; no Expo usage pricing found in docs | Choose |
| OneSignal | Marketing/customer engagement platform with dashboards, journeys, segmentation, push/in-app/email/SMS channels | Adds external vendor, account setup, SDK surface, pricing model, and data pipeline; unnecessary for first-party habit reminders | Free tier lists unlimited mobile push sends; Growth starts at $19/mo plus usage; Growth mobile push listed at `$0.012` per monthly active user; some features are gated | Defer |

Breaking/current changes to account for:

- `expo-background-fetch` is deprecated and should not be used for new work.
- Android push notifications with `expo-notifications` are unavailable in Expo Go from SDK 53; use a development build for push.
- Android 13 permission prompt appears only after at least one notification channel exists; call `setNotificationChannelAsync` before token requests.
- Android 12 exact-time notifications require `android.permission.SCHEDULE_EXACT_ALARM` if exact alarms are truly needed. Avoid this unless the product explicitly needs exact alarm behavior.

## Installation

Use Expo's installer so versions match the current Expo SDK:

```sh
npx expo install expo-notifications expo-background-task expo-task-manager expo-constants
```

For remote push through Expo Push Service, configure EAS project ID and native credentials:

```sh
eas init
eas credentials
```

If native `ios/` and `android/` directories are checked in, run prebuild or update native files explicitly after config changes:

```sh
npx expo prebuild
```

## Configuration

### Environment Variables

Client-side:

| Name | Required | Purpose |
| --- | --- | --- |
| `EXPO_PUBLIC_EAS_PROJECT_ID` | Optional if `Constants.expoConfig.extra.eas.projectId` or `Constants.easConfig.projectId` is available | Stable fallback for `Notifications.getExpoPushTokenAsync({ projectId })` |
| `EXPO_PUBLIC_ONESIGNAL_APP_ID` | No | Only if OneSignal is adopted later |

Server-side:

| Name | Required | Purpose |
| --- | --- | --- |
| None for basic Expo Push Service sends | No | Expo Push Service can send with Expo push tokens without an app secret, but server code should throttle and retry |
| FCM/APNs credentials | Only for direct native push or EAS credential setup | Managed through EAS credentials or provider consoles, not exposed in app code |
| `ONESIGNAL_REST_API_KEY` | No | Only if OneSignal is adopted later; never expose this in client code |

### App Config

Use the `expo-notifications` config plugin for native-only notification properties:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#ffffff",
          "defaultChannel": "default",
          "sounds": ["./assets/reminder.wav"],
          "enableBackgroundRemoteNotifications": false
        }
      ]
    ]
  }
}
```

For `expo-background-task`, Expo's current docs say Continuous Native Generation applies the required iOS settings automatically. If the native iOS project is checked in and not regenerated, verify `Info.plist` contains:

```xml
<key>UIBackgroundModes</key>
<array>
  <string>processing</string>
</array>
<key>BGTaskSchedulerPermittedIdentifiers</key>
<array>
  <string>com.expo.modules.backgroundtask.processing</string>
</array>
```

## Key Patterns

### Notification Handler

Define the foreground notification behavior once during app startup:

```ts
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
```

### Permissions and Android Channel

Create the Android channel before asking for tokens. Keep the permission prompt user-initiated where possible.

```ts
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

export async function ensureNotificationPermissionsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('habit-reminders', {
      name: 'Habit reminders',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#6D5DF6',
    });
  }

  const existing = await Notifications.getPermissionsAsync();
  if (existing.status === 'granted') {
    return existing;
  }

  return Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  });
}
```

On iOS, check `permissions.ios?.status` for nuanced states such as provisional authorization when deciding UI copy.

### Expo Push Token

```ts
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

export async function getExpoPushTokenAsync() {
  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId ??
    process.env.EXPO_PUBLIC_EAS_PROJECT_ID;

  if (!projectId) {
    throw new Error('Missing EAS projectId for Expo push token registration');
  }

  const token = await Notifications.getExpoPushTokenAsync({ projectId });
  return token.data;
}
```

### Local Scheduled Habit Reminder

For exact daily habits, prefer calculating the next concrete `Date` and rescheduling after delivery or habit edits. Repeating calendar triggers are platform-sensitive, and exact Android alarms have extra permission implications.

```ts
import * as Notifications from 'expo-notifications';

export async function scheduleHabitReminderAsync(params: {
  habitId: string;
  title: string;
  nextReminderAt: Date;
}) {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: params.title,
      body: 'Time to keep the chain going.',
      data: { habitId: params.habitId, url: `/habits/${params.habitId}` },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: params.nextReminderAt,
    },
  });
}

export async function cancelHabitReminderAsync(notificationId: string) {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}
```

### Background Task Setup

Define tasks in global scope, outside React components. Register them after app startup/auth readiness if the user has opted into sync behavior.

```ts
import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';

const HABIT_BACKGROUND_SYNC_TASK = 'habit-background-sync';

TaskManager.defineTask(HABIT_BACKGROUND_SYNC_TASK, async () => {
  try {
    // Keep this short and idempotent: flush queued mutations, reconcile reminders,
    // prefetch small cache entries, then exit.
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (error) {
    console.error('Habit background sync failed', error);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

export async function registerHabitBackgroundSyncAsync() {
  return BackgroundTask.registerTaskAsync(HABIT_BACKGROUND_SYNC_TASK, {
    minimumInterval: 15,
  });
}

export async function unregisterHabitBackgroundSyncAsync() {
  return BackgroundTask.unregisterTaskAsync(HABIT_BACKGROUND_SYNC_TASK);
}

export async function isHabitBackgroundSyncRegisteredAsync() {
  return TaskManager.isTaskRegisteredAsync(HABIT_BACKGROUND_SYNC_TASK);
}
```

## API Reference

| API | Package | Use | Notes |
| --- | --- | --- | --- |
| `Notifications.setNotificationHandler(handler)` | `expo-notifications` | Foreground display behavior | Handler must respond quickly; docs state notifications are discarded if the handler misses its time budget |
| `Notifications.getPermissionsAsync()` | `expo-notifications` | Check current permission state | On iOS, inspect iOS-specific status for provisional/ephemeral states |
| `Notifications.requestPermissionsAsync(options)` | `expo-notifications` | Prompt for notification permission | Request only after explaining value to the user |
| `Notifications.setNotificationChannelAsync(id, channel)` | `expo-notifications` | Android channel setup | Required before Android 13 permission/token flow |
| `Notifications.getExpoPushTokenAsync({ projectId })` | `expo-notifications` | Expo Push Service token | Requires an EAS project ID |
| `Notifications.getDevicePushTokenAsync()` | `expo-notifications` | Native APNs/FCM token | Use for direct APNs/FCM or third-party push providers |
| `Notifications.scheduleNotificationAsync(request)` | `expo-notifications` | Immediate or scheduled local notification | `trigger: null` means immediate |
| `Notifications.cancelScheduledNotificationAsync(id)` | `expo-notifications` | Cancel one scheduled notification | Store returned IDs per habit |
| `Notifications.addNotificationReceivedListener(fn)` | `expo-notifications` | Foreground receipt listener | Remove subscription on cleanup |
| `Notifications.addNotificationResponseReceivedListener(fn)` | `expo-notifications` | Tap/deep-link handling | Use notification `data.url` or `data.habitId` |
| `TaskManager.defineTask(name, callback)` | `expo-task-manager` | Background task definition | Must run in global scope |
| `BackgroundTask.registerTaskAsync(name, options)` | `expo-background-task` | Register deferrable background work | `minimumInterval` is minutes in current docs |
| `BackgroundTask.unregisterTaskAsync(name)` | `expo-background-task` | Disable background work | Use when user opts out |
| `BackgroundTask.getStatusAsync()` | `expo-background-task` | Check platform background availability | Use for diagnostics/settings UI |

## Gotchas

- Background tasks are not exact schedulers. The OS decides when to run them based on battery, network, usage patterns, and vendor policies.
- iOS Background Tasks do not run on iOS simulators; test on a physical device.
- If the user force-kills the app, background tasks stop. They resume after the app is restarted.
- Android vendors vary. Some devices treat recent-app removal like a kill.
- Android WorkManager minimum interval is 15 minutes. Do not promise faster background execution.
- Notifications and background work are separate. Scheduled local notifications are better for habit reminders; background tasks are better for opportunistic sync/reconciliation.
- Android 13 requires a notification channel before the notification permission/token prompt can work correctly.
- Android 12 exact alarms require `SCHEDULE_EXACT_ALARM`; adding it can trigger policy/user-experience review. Prefer inexact reminders unless exactness is a hard requirement.
- Expo Go is not enough for Android push notifications from SDK 53 onward. Use a development build.
- Store scheduled notification IDs. On habit edit, archive, delete, restore, timezone change, or permission change, cancel/reschedule deterministically.
- Keep background task code idempotent and short. Assume it can be skipped, delayed, retried, or interrupted.
- Do not put secrets in `EXPO_PUBLIC_*` variables. They are bundled into client code.

## Rate Limits

- Expo Push Service: no send cost; documented limit is 600 notifications per second per project. Add server throttling and retry logic.
- Expo local scheduled notifications: no Expo service rate limit found in docs; OS-level behavior and exact-alarm policies apply.
- `expo-background-task`: no Expo service rate limit found in docs; Android WorkManager minimum interval is 15 minutes, while iOS BGTaskScheduler can delay beyond the requested minimum.
- OneSignal: pricing page checked on 2026-07-14 lists Free at `$0/mo`, unlimited mobile push sends, 10,000/month free email sends, and Growth starting at `$19/mo` plus usage; the feature table lists Growth mobile push at `$0.012` per monthly active user. Treat this as vendor-pricing-sensitive and re-check before adoption.

## Currency

| Item | Version / status | Checked date | Source |
| --- | --- | --- | --- |
| Repo Expo SDK | `expo ~54.0.34` | 2026-07-14 | `package.json` |
| Repo notifications | `expo-notifications ~0.32.17` | 2026-07-14 | `package.json` |
| Repo background task | `expo-background-task ~1.0.10`, `expo-task-manager ~14.0.9` | 2026-07-14 | `package.json` |
| Expo Notifications latest docs | recommended `~57.0.3` | 2026-07-14 | https://docs.expo.dev/versions/latest/sdk/notifications/ |
| Expo BackgroundTask latest docs | current replacement for background fetch | 2026-07-14 | https://docs.expo.dev/versions/latest/sdk/background-task/ |
| Expo BackgroundFetch latest docs | deprecated; not receiving patches; removal planned | 2026-07-14 | https://docs.expo.dev/versions/latest/sdk/background-fetch/ |
| Expo Push Service FAQ | no cost; 600 notifications/sec/project | 2026-07-14 | https://docs.expo.dev/push-notifications/faq/ |
| OneSignal pricing | Free, Growth, Professional, Enterprise tiers | 2026-07-14 | https://onesignal.com/pricing |
| Context7 docs query | `/websites/expo_dev_versions_sdk_notifications`, `/expo/expo/__branch__sdk-54` | 2026-07-14 | Context7 |

## References

- Expo Notifications docs: https://docs.expo.dev/versions/latest/sdk/notifications/
- Expo BackgroundTask docs: https://docs.expo.dev/versions/latest/sdk/background-task/
- Expo BackgroundFetch docs: https://docs.expo.dev/versions/latest/sdk/background-fetch/
- Expo TaskManager docs: https://docs.expo.dev/versions/latest/sdk/task-manager/
- Expo Push Notifications FAQ: https://docs.expo.dev/push-notifications/faq/
- OneSignal pricing: https://onesignal.com/pricing
- Android exact alarm permission: https://developer.android.com/develop/background-work/services/alarms/schedule
- Android notification runtime permission: https://developer.android.com/develop/ui/views/notifications/notification-permission
- Apple BGTaskScheduler: https://developer.apple.com/documentation/backgroundtasks/bgtaskscheduler
- Doze/vendor background behavior reference: https://dontkillmyapp.com/
