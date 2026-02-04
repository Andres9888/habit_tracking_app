# Chain Day Settings v2 — Design & Implementation Specs

**Version:** 2.0  
**Date:** 2026-02-04  
**Status:** Ready for Implementation  
**PR Reference:** Supersedes PR #139 (Jan 31)

---

## 📋 Executive Summary

Settings v2 is a comprehensive redesign addressing critical gaps identified in the UX audit:

- ✅ Missing notifications/reminders management
- ✅ No subscription status visibility
- ✅ No account deletion (GDPR compliance)
- ✅ Limited visual preferences
- ✅ Static version number

**Mockup:** `habit-app-assets/settings-v2-mockup.html`

---

## 🎯 Design Goals

1. **Scannable** — Clear visual hierarchy with section icons
2. **Accessible** — 44pt minimum touch targets, proper roles
3. **Delightful** — Subtle animations, haptic feedback
4. **Complete** — All critical settings in one place
5. **Consistent** — Follows established Chain Day design language

---

## 📐 Information Architecture

```
Settings
├── Account
│   ├── User Info Card (avatar, name, email, subscription badge)
│   ├── Manage Subscription → RevenueCat sheet
│   └── Sign Out → Confirmation
│
├── Notifications
│   ├── Push Notifications [toggle]
│   ├── Default Reminder Time → Time picker
│   └── Milestone Alerts [toggle]
│   │
│   └── [Detail Screen]
│       ├── Enable Notifications [toggle]
│       ├── Reminders
│       │   ├── Morning Reminder → Time picker
│       │   ├── Evening Reminder → Time picker
│       │   └── Smart Reminders [Pro] [toggle]
│       ├── Celebrations
│       │   ├── Streak Milestones [toggle]
│       │   ├── Achievement Unlocks [toggle]
│       │   └── Weekly Summary [toggle]
│       └── Quiet Hours
│           ├── Do Not Disturb [toggle]
│           └── Quiet Period → Time range picker
│
├── Appearance
│   ├── Theme → Dark/Light/System
│   ├── Completion Icon → Check/Chain/Star
│   ├── Show Progress Bar [toggle]
│   │
│   └── [Detail Screen]
│       ├── Theme (grid selector)
│       ├── Completion Icon (grid selector)
│       ├── Day Shape (grid selector)
│       ├── Display Options
│       │   ├── Progress Bar [toggle]
│       │   ├── Streak Flames [toggle]
│       │   ├── Habit Strength [toggle]
│       │   └── Animations → On/Reduced/Off
│       └── Accessibility
│           ├── High Contrast [toggle]
│           ├── Haptic Feedback [toggle]
│           └── Larger Text [toggle]
│
├── App
│   ├── Rate Chain Day → App Store/Play Store
│   ├── Share with Friends → Share sheet
│   └── Contact Support → Email composer
│
├── Legal
│   ├── Privacy Policy → WebView/Browser
│   └── Terms of Service → WebView/Browser
│
├── Data
│   ├── Export Data → JSON download
│   └── Archived Habits → Sub-screen
│
└── Danger Zone
    └── Delete Account → Confirmation modal
```

---

## 🎨 Visual Design Specifications

### Color Palette

| Token                | Value                    | Usage                        |
| -------------------- | ------------------------ | ---------------------------- |
| `background.primary` | `#0f0f23` → `#1a1a3e`    | Screen gradient              |
| `surface.card`       | `rgba(255,255,255,0.04)` | Card backgrounds             |
| `surface.cardBorder` | `rgba(255,255,255,0.06)` | Card borders                 |
| `text.primary`       | `#ffffff`                | Headings, labels             |
| `text.secondary`     | `#8b8ba7`                | Descriptions, section titles |
| `text.tertiary`      | `#6b7280`                | Values, chevrons             |
| `accent.primary`     | `#6366f1` → `#8b5cf6`    | Primary gradient             |
| `accent.success`     | `#22c55e`                | Success states, Pro badge    |
| `accent.danger`      | `#ef4444`                | Danger zone, delete          |
| `accent.warning`     | `#f59e0b`                | Premium badge                |

### Typography

| Element         | Font           | Size | Weight | Tracking |
| --------------- | -------------- | ---- | ------ | -------- |
| Screen Title    | SF Pro Display | 24px | 700    | 0        |
| Section Header  | SF Pro Text    | 13px | 600    | 0.8px    |
| Row Label       | SF Pro Text    | 16px | 500    | 0        |
| Row Description | SF Pro Text    | 13px | 400    | 0        |
| Row Value       | SF Pro Text    | 15px | 400    | 0        |
| Version         | SF Pro Text    | 13px | 400    | 0        |

### Spacing System

```
Section margin-bottom: 24px
Section header padding: 16px 4px 8px
Card border-radius: 16px
Row padding: 14px 16px
Row min-height: 56px
Row gap: 14px
Icon container: 36×36px, border-radius 10px
Toggle: 48×28px, border-radius 14px
Grid gap: 8px
Grid item padding: 12px 8px
```

### Icon Background Colors

Each row icon has a tinted background for visual interest:

| Color Name | Background                 | Usage              |
| ---------- | -------------------------- | ------------------ |
| Blue       | `rgba(59, 130, 246, 0.2)`  | Theme, Support     |
| Green      | `rgba(34, 197, 94, 0.2)`   | Export, Completion |
| Purple     | `rgba(139, 92, 246, 0.2)`  | Notifications      |
| Orange     | `rgba(249, 115, 22, 0.2)`  | Time, Streaks      |
| Pink       | `rgba(236, 72, 153, 0.2)`  | Share              |
| Gray       | `rgba(107, 114, 128, 0.2)` | Legal, Archive     |
| Red        | `rgba(239, 68, 68, 0.2)`   | Delete             |
| Yellow     | `rgba(234, 179, 8, 0.2)`   | Rate, Milestones   |
| Indigo     | `rgba(99, 102, 241, 0.2)`  | Subscription       |
| Cyan       | `rgba(34, 211, 238, 0.2)`  | Progress           |

---

## 🎬 Animation Specifications

### Section Entrance

```typescript
const sectionEntrance = {
  from: { opacity: 0, translateY: 10 },
  to: { opacity: 1, translateY: 0 },
  duration: 300,
  easing: Easing.out(Easing.ease),
  staggerDelay: 50, // per section
};
```

### Row Press

```typescript
const rowPress = {
  scale: 0.98,
  duration: 150,
  easing: Easing.out(Easing.ease),
};
```

### Toggle Switch

```typescript
const toggleAnimation = {
  duration: 300,
  easing: Easing.out(Easing.ease),
  knobTranslateX: 20, // when active
};
```

### Navigation Transitions

```typescript
const screenTransition = {
  type: 'slide',
  direction: 'horizontal',
  duration: 300,
};
```

---

## 🔊 Haptic Feedback

| Interaction    | Haptic Type                        |
| -------------- | ---------------------------------- |
| Row tap        | `ImpactFeedbackStyle.Light`        |
| Toggle change  | `ImpactFeedbackStyle.Light`        |
| Delete button  | `ImpactFeedbackStyle.Medium`       |
| Success action | `NotificationFeedbackType.Success` |
| Error state    | `NotificationFeedbackType.Error`   |

---

## ♿ Accessibility Requirements

### Touch Targets

- Minimum 44×44pt for all interactive elements
- Row has full-width tap area
- Toggle has 48×28pt explicit area

### Labels

```tsx
// Row with navigation
accessibilityRole="button"
accessibilityLabel="Manage Subscription, opens subscription management"

// Row with toggle
accessibilityRole="switch"
accessibilityState={{ checked: isEnabled }}
accessibilityLabel="Push Notifications"

// Section header
accessibilityRole="header"
accessibilityLabel="Account section"

// Danger row
accessibilityHint="Double-tap to delete your account permanently"
```

### Focus Order

1. Back button
2. Sections in visual order
3. Footer version

### Reduced Motion

- Disable entrance animations
- Instant toggle transitions
- No scale effects

---

## 🧩 Component Implementation Plan

### File Structure

```
src/components/SettingsModal/
├── SettingsScreen.tsx          # Main settings screen (refactor)
├── SettingsSection.tsx         # Section wrapper with header
├── SettingsRow.tsx             # Updated row component
├── SettingsToggle.tsx          # Custom toggle switch
├── SettingsGrid.tsx            # Grid selector for preferences
├── AccountCard.tsx             # Special account info card
├── DeleteAccountModal.tsx      # Confirmation modal
├── hooks/
│   ├── useSettingsAnimations.ts
│   └── useSettingsNavigation.ts
├── screens/
│   ├── NotificationsScreen.tsx
│   ├── AppearanceScreen.tsx
│   └── ArchivedHabitsScreen.tsx (existing)
├── constants.ts                # Section definitions
├── styles.ts                   # Shared styles
└── types.ts                    # TypeScript types
```

### Component APIs

#### SettingsSection

```tsx
interface SettingsSectionProps {
  title: string;
  icon?: string;
  variant?: 'default' | 'danger';
  animationDelay?: number;
  children: ReactNode;
}

<SettingsSection title='Account' icon='👤'>
  {/* rows */}
</SettingsSection>;
```

#### SettingsRow

```tsx
interface SettingsRowProps {
  icon: string;
  iconColor: IconColorVariant;
  label: string;
  description?: string;
  value?: string;
  badge?: 'pro' | 'new';

  // Variants
  type: 'navigation' | 'toggle' | 'action';

  // Toggle props
  isEnabled?: boolean;
  onToggle?: (value: boolean) => void;

  // Navigation props
  onPress?: () => void;

  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

<SettingsRow
  icon="🔔"
  iconColor="purple"
  label="Push Notifications"
  description="Daily reminders"
  type="toggle"
  isEnabled={notificationsEnabled}
  onToggle={setNotificationsEnabled}
/>

<SettingsRow
  icon="⏰"
  iconColor="orange"
  label="Default Reminder Time"
  value="9:00 AM"
  type="navigation"
  onPress={() => navigate('ReminderTime')}
/>
```

#### SettingsGrid

```tsx
interface SettingsGridOption {
  id: string;
  emoji: string;
  label: string;
}

interface SettingsGridProps {
  options: SettingsGridOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  columns?: 3 | 4;
}

<SettingsGrid
  options={[
    { id: 'light', emoji: '☀️', label: 'Light' },
    { id: 'dark', emoji: '🌙', label: 'Dark' },
    { id: 'system', emoji: '📱', label: 'System' },
  ]}
  selectedId={theme}
  onSelect={setTheme}
/>;
```

#### AccountCard

```tsx
interface AccountCardProps {
  user: {
    name: string;
    email: string;
    avatarInitial: string;
  };
  subscription: 'free' | 'pro' | 'trial';
  onManageSubscription: () => void;
  onSignOut: () => void;
}
```

#### DeleteAccountModal

```tsx
interface DeleteAccountModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  stats: {
    habitsCount: number;
    totalDays: number;
  };
}
```

---

## 📱 Screen Implementations

### Main Settings Screen

```tsx
export function SettingsScreen() {
  const navigation = useSettingsNavigation();
  const { user, subscription } = useAuth();
  const settings = useSettings();

  return (
    <ScrollView style={styles.container}>
      {/* Account */}
      <SettingsSection title='Account' icon='👤'>
        <AccountCard
          user={user}
          subscription={subscription}
          onManageSubscription={navigation.toSubscription}
          onSignOut={handleSignOut}
        />
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection title='Notifications' icon='🔔'>
        <SettingsRow
          icon='📱'
          iconColor='purple'
          label='Push Notifications'
          description='Daily reminders'
          type='toggle'
          isEnabled={settings.notificationsEnabled}
          onToggle={settings.setNotificationsEnabled}
        />
        <SettingsRow
          icon='⏰'
          iconColor='orange'
          label='Default Reminder Time'
          value={formatTime(settings.reminderTime)}
          type='navigation'
          onPress={navigation.toNotifications}
        />
        <SettingsRow
          icon='🎉'
          iconColor='yellow'
          label='Milestone Alerts'
          description='7, 30, 100 day celebrations'
          type='toggle'
          isEnabled={settings.milestoneAlerts}
          onToggle={settings.setMilestoneAlerts}
        />
      </SettingsSection>

      {/* ... other sections ... */}

      {/* Danger Zone */}
      <SettingsSection title='Danger Zone' icon='⚠️' variant='danger'>
        <SettingsRow
          icon='🗑️'
          iconColor='red'
          label='Delete Account'
          description='Permanently remove all data'
          type='action'
          onPress={() => setDeleteModalVisible(true)}
        />
      </SettingsSection>

      <SettingsFooter version={appVersion} />
    </ScrollView>
  );
}
```

### Notifications Detail Screen

```tsx
export function NotificationsScreen() {
  return (
    <ScrollView>
      <SettingsSection>
        <SettingsRow
          icon='🔔'
          iconColor='purple'
          label='Enable Notifications'
          description='Required for reminders'
          type='toggle'
          {...notificationToggle}
        />
      </SettingsSection>

      <SettingsSection title='Reminders' icon='⏰'>
        {/* Morning/Evening reminders */}
      </SettingsSection>

      <SettingsSection title='Celebrations' icon='🎉'>
        {/* Milestone toggles */}
      </SettingsSection>

      <SettingsSection title='Quiet Hours' icon='🌙'>
        {/* DND settings */}
      </SettingsSection>
    </ScrollView>
  );
}
```

---

## 🔧 Implementation Checklist

### Phase 1: Core Components (2-3h)

- [ ] Update `SettingsRow.tsx` with new icon system
- [ ] Create `SettingsSection.tsx` with animations
- [ ] Create `SettingsToggle.tsx` (custom animated toggle)
- [ ] Create `SettingsGrid.tsx` for preference selectors
- [ ] Update `styles.ts` with new design tokens

### Phase 2: Account Section (1h)

- [ ] Create `AccountCard.tsx`
- [ ] Integrate subscription status from RevenueCat
- [ ] Connect sign out with confirmation

### Phase 3: Notifications (2h)

- [ ] Create `NotificationsScreen.tsx`
- [ ] Connect to existing notification hooks
- [ ] Add time pickers for reminder settings
- [ ] Add quiet hours functionality

### Phase 4: Appearance (1.5h)

- [ ] Create `AppearanceScreen.tsx`
- [ ] Add theme grid selector
- [ ] Add completion icon selector
- [ ] Add accessibility toggles

### Phase 5: Data & Danger Zone (1.5h)

- [ ] Add export data functionality
- [ ] Create `DeleteAccountModal.tsx`
- [ ] Implement account deletion API call
- [ ] Add confirmation flow with stats

### Phase 6: Polish (1h)

- [ ] Add entrance animations
- [ ] Verify haptic feedback throughout
- [ ] Test accessibility with VoiceOver
- [ ] Dynamic version from app config

---

## 🧪 Testing Requirements

### Unit Tests

- [ ] SettingsRow renders all variants
- [ ] SettingsToggle fires callbacks
- [ ] SettingsGrid selection works
- [ ] DeleteAccountModal shows correct stats

### Integration Tests

- [ ] Settings persist across app restarts
- [ ] Notification permissions flow works
- [ ] Subscription status updates correctly
- [ ] Account deletion clears all data

### Accessibility Tests

- [ ] All rows focusable via keyboard
- [ ] Toggle states announced by VoiceOver
- [ ] Section headers announced
- [ ] Delete modal is fully accessible

### Manual QA

- [ ] Test on iOS 15+
- [ ] Test on Android 10+
- [ ] Test light theme
- [ ] Test reduced motion
- [ ] Test with largest font size

---

## 📊 Success Metrics

| Metric                             | Target        |
| ---------------------------------- | ------------- |
| Settings engagement                | +20% opens    |
| Notification opt-in                | +15%          |
| Support tickets (settings-related) | -30%          |
| App Store rating mentions          | "easy to use" |

---

## 🔗 Related PRs & Docs

- **Supersedes:** PR #139 (Enhanced Settings Modal)
- **References:** UX Audit (`memory/ux-audit-feb4.md`)
- **Design System:** Onboarding mockup patterns
- **Haptics:** PR #343 (SettingsRow haptic feedback)

---

_Spec authored by: Settings Redesign Subagent_  
_Review date: 2026-02-04_
