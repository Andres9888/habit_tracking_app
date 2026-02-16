# iOS Widget Starter Files

This directory contains starter code for implementing the ChainDay iOS widget.

## 📁 Files

- **`ChainDayWidget.swift`**: Complete widget implementation (WidgetKit + SwiftUI)
- **`../plugins/withWidgetExtension.js`**: Expo config plugin for App Groups
- **`../src/utils/widgetDataBridge.ts`**: React Native data bridge utility

## 🚀 Integration Steps

### 1. Create Widget Extension in Xcode

```bash
# Open Xcode project
open ios/ChainDay.xcworkspace

# In Xcode:
# File → New → Target → Widget Extension
# Name: ChainDayWidget
# Language: Swift
# Include Configuration Intent: No (for now)
```

### 2. Copy Widget Code

- Copy `ChainDayWidget.swift` to the new extension target
- Delete the default generated files (Widget.swift, etc.)

### 3. Configure App Groups

**In Xcode:**
1. Select ChainDay target → Signing & Capabilities
2. Add "App Groups" capability
3. Enable `group.com.chainday.app.shared`
4. Repeat for ChainDayWidget target

### 4. Update app.json

Already configured in this branch! The plugin at `plugins/withWidgetExtension.js` adds App Groups automatically.

### 5. Install React Native Bridge (Optional)

For production, use SharedGroupPreferences:

```bash
npm install react-native-shared-group-preferences
cd ios && pod install
```

Update `widgetDataBridge.ts` to use the native module instead of AsyncStorage.

### 6. Test Locally

```bash
# Build with EAS (custom native code required)
eas build --platform ios --profile development --local

# Or run in Xcode
# Select ChainDayWidget scheme → Run
```

### 7. Update Widget Data in App

Hook into habit toggle:

```typescript
// In your habit toggle handler
import { syncWidgetData } from '@/utils/widgetDataBridge';

async function handleToggleHabit(habitId: string) {
  await toggleHabit({ habitId });
  await syncWidgetData(); // <-- Add this
}
```

## 📚 Resources

- [WIDGET_ROADMAP.md](../WIDGET_ROADMAP.md) - Complete implementation plan
- [Apple WidgetKit Docs](https://developer.apple.com/documentation/widgetkit)
- [Expo Custom Native Code](https://docs.expo.dev/workflow/customizing/)

## 🧪 Testing

**Widget Preview in Xcode:**
- Use the preview at bottom of ChainDayWidget.swift
- Cmd+Option+P to refresh preview

**On Device:**
1. Build and install app + widget
2. Long-press home screen → Add Widget
3. Search "ChainDay"
4. Add widget to home screen

**Debug Data:**
```swift
// In ChainDayWidget.swift, loadWidgetData() function
// Add print statements to see what data is loaded
print("[Widget] Loaded: \(data)")
```

## ⚠️ Known Limitations

- Widget updates every ~15 min (iOS limitation)
- Max 30MB memory usage per widget instance
- No interactive controls until iOS 17+
- Requires EAS Build for custom native code

## 🎯 Next Steps

See Phase 1 in WIDGET_ROADMAP.md:
- [ ] Create widget extension target
- [ ] Configure App Groups
- [ ] Test basic widget with static data
- [ ] Integrate data bridge
- [ ] Build with EAS

---

**Created by:** Sonnet  
**Date:** February 16, 2026
