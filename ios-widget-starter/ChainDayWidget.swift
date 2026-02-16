/**
 * ChainDay iOS Widget
 * 
 * Native iOS widget implementation using WidgetKit and SwiftUI.
 * Displays today's habits and completion progress.
 * 
 * To integrate:
 * 1. Create new Widget Extension target in Xcode
 * 2. Add this file to the extension target
 * 3. Configure App Group entitlement: group.com.chainday.app.shared
 * 4. Build with EAS Build (custom native code)
 * 
 * @see WIDGET_ROADMAP.md for complete setup instructions
 */

import WidgetKit
import SwiftUI

// MARK: - Data Models

/// Matches WidgetData interface from React Native
struct WidgetData: Codable {
    let habits: [WidgetHabit]
    let todayStats: WidgetStats
    let bestStreak: WidgetBestStreak?
    let lastUpdated: Double
}

struct WidgetHabit: Codable, Identifiable {
    let id: String
    let name: String
    let icon: String?
    let color: String?
    let completed: Bool
    let streak: Int
}

struct WidgetStats: Codable {
    let completed: Int
    let total: Int
    let percentage: Int
}

struct WidgetBestStreak: Codable {
    let name: String
    let count: Int
}

// MARK: - Timeline Entry

struct ChainDayEntry: TimelineEntry {
    let date: Date
    let data: WidgetData?
}

// MARK: - Timeline Provider

struct ChainDayProvider: TimelineProvider {
    /// Placeholder for widget gallery and first launch
    func placeholder(in context: Context) -> ChainDayEntry {
        ChainDayEntry(date: Date(), data: mockData())
    }
    
    /// Snapshot for widget gallery
    func getSnapshot(in context: Context, completion: @escaping (ChainDayEntry) -> Void) {
        let entry = ChainDayEntry(date: Date(), data: loadWidgetData())
        completion(entry)
    }
    
    /// Timeline entries for next 12 hours
    func getTimeline(in context: Context, completion: @escaping (Timeline<ChainDayEntry>) -> Void) {
        let currentDate = Date()
        let data = loadWidgetData()
        
        // Create entries for next 12 hours (refresh every 15 min)
        var entries: [ChainDayEntry] = []
        for hourOffset in 0..<12 {
            let entryDate = Calendar.current.date(byAdding: .hour, value: hourOffset, to: currentDate)!
            let entry = ChainDayEntry(date: entryDate, data: data)
            entries.append(entry)
        }
        
        // Reload timeline every 15 minutes
        let nextUpdate = Calendar.current.date(byAdding: .minute, value: 15, to: currentDate)!
        let timeline = Timeline(entries: entries, policy: .after(nextUpdate))
        
        completion(timeline)
    }
    
    /// Load data from shared App Group storage
    private func loadWidgetData() -> WidgetData? {
        let appGroupID = "group.com.chainday.app.shared"
        guard let userDefaults = UserDefaults(suiteName: appGroupID) else {
            print("[Widget] Failed to access App Group: \(appGroupID)")
            return nil
        }
        
        guard let jsonString = userDefaults.string(forKey: "widget_data_v1") else {
            print("[Widget] No widget data found")
            return nil
        }
        
        guard let jsonData = jsonString.data(using: .utf8) else {
            print("[Widget] Failed to convert string to data")
            return nil
        }
        
        do {
            let decoder = JSONDecoder()
            let data = try decoder.decode(WidgetData.self, from: jsonData)
            print("[Widget] Loaded data: \(data.habits.count) habits, \(data.todayStats.percentage)% complete")
            return data
        } catch {
            print("[Widget] Failed to decode data: \(error)")
            return nil
        }
    }
    
    /// Mock data for placeholder
    private func mockData() -> WidgetData {
        return WidgetData(
            habits: [
                WidgetHabit(id: "1", name: "Drink Water", icon: "💧", color: "#059669", completed: true, streak: 5),
                WidgetHabit(id: "2", name: "Read", icon: "📚", color: "#047857", completed: true, streak: 12),
                WidgetHabit(id: "3", name: "Exercise", icon: "🏃", color: "#059669", completed: false, streak: 3)
            ],
            todayStats: WidgetStats(completed: 2, total: 3, percentage: 67),
            bestStreak: WidgetBestStreak(name: "Read", count: 12),
            lastUpdated: Date().timeIntervalSince1970 * 1000
        )
    }
}

// MARK: - Widget Views

/// Small widget (2x2)
struct SmallWidgetView: View {
    let data: WidgetData
    
    var body: some View {
        VStack(spacing: 8) {
            HStack {
                Text("ChainDay")
                    .font(.system(size: 14, weight: .semibold))
                Spacer()
                Text("🔗")
            }
            
            Spacer()
            
            VStack(spacing: 4) {
                Text("\(data.todayStats.completed)/\(data.todayStats.total) ✓")
                    .font(.system(size: 28, weight: .bold))
                    .foregroundColor(Color(hex: "#059669"))
                
                Text("\(data.todayStats.percentage)% today")
                    .font(.system(size: 13))
                    .foregroundColor(.secondary)
            }
            
            Spacer()
            
            if let bestStreak = data.bestStreak, bestStreak.count > 0 {
                HStack(spacing: 4) {
                    Text("🔥")
                    Text("\(bestStreak.count) day")
                        .font(.system(size: 13, weight: .medium))
                    Text("streak")
                        .font(.system(size: 13))
                        .foregroundColor(.secondary)
                }
            }
        }
        .padding()
    }
}

/// Medium widget (4x2)
struct MediumWidgetView: View {
    let data: WidgetData
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text("ChainDay")
                    .font(.system(size: 15, weight: .semibold))
                Spacer()
                Text("\(data.todayStats.completed)/\(data.todayStats.total) done")
                    .font(.system(size: 13))
                    .foregroundColor(.secondary)
            }
            
            Divider()
            
            VStack(spacing: 6) {
                ForEach(data.habits.prefix(5)) { habit in
                    HStack {
                        Text(habit.icon ?? "⭐️")
                            .font(.system(size: 16))
                        
                        Text(habit.name)
                            .font(.system(size: 14))
                            .lineLimit(1)
                        
                        Spacer()
                        
                        Text(habit.completed ? "✓" : "○")
                            .font(.system(size: 16, weight: .medium))
                            .foregroundColor(habit.completed ? Color(hex: "#059669") : .gray)
                    }
                }
            }
        }
        .padding()
    }
}

/// Large widget (4x4)
struct LargeWidgetView: View {
    let data: WidgetData
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text("ChainDay")
                    .font(.system(size: 16, weight: .semibold))
                Spacer()
                Text("\(data.todayStats.completed)/\(data.todayStats.total) — \(data.todayStats.percentage)%")
                    .font(.system(size: 14))
                    .foregroundColor(.secondary)
            }
            
            Divider()
            
            VStack(spacing: 8) {
                ForEach(data.habits.prefix(5)) { habit in
                    HStack {
                        Text(habit.icon ?? "⭐️")
                            .font(.system(size: 18))
                        
                        Text(habit.name)
                            .font(.system(size: 15))
                            .lineLimit(1)
                        
                        Spacer()
                        
                        Text(habit.completed ? "✓" : "○")
                            .font(.system(size: 18, weight: .medium))
                            .foregroundColor(habit.completed ? Color(hex: "#059669") : .gray)
                        
                        if habit.streak > 0 {
                            Text("\(habit.streak) 🔥")
                                .font(.system(size: 13))
                                .foregroundColor(.secondary)
                        }
                    }
                }
            }
            
            if let bestStreak = data.bestStreak, bestStreak.count > 0 {
                Divider()
                
                Text("Best Streak: \(bestStreak.name) 📚 \(bestStreak.count) days")
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(Color(hex: "#047857"))
            }
            
            Spacer()
        }
        .padding()
    }
}

/// Main widget configuration
struct ChainDayWidget: Widget {
    let kind: String = "ChainDayWidget"
    
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: ChainDayProvider()) { entry in
            ChainDayWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("ChainDay")
        .description("Track your daily habits and streaks.")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

/// Entry view that routes to correct size
struct ChainDayWidgetEntryView: View {
    @Environment(\.widgetFamily) var family
    var entry: ChainDayProvider.Entry
    
    var body: some View {
        if let data = entry.data {
            switch family {
            case .systemSmall:
                SmallWidgetView(data: data)
            case .systemMedium:
                MediumWidgetView(data: data)
            case .systemLarge:
                LargeWidgetView(data: data)
            default:
                SmallWidgetView(data: data)
            }
        } else {
            // No data available
            VStack {
                Text("ChainDay 🔗")
                    .font(.headline)
                Spacer()
                Text("Open app to")
                Text("get started")
                    .foregroundColor(.secondary)
                Spacer()
            }
            .padding()
        }
    }
}

// MARK: - Widget Bundle

@main
struct ChainDayWidgetBundle: WidgetBundle {
    var body: some Widget {
        ChainDayWidget()
    }
}

// MARK: - Helpers

extension Color {
    /// Convert hex string to Color
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let r, g, b: UInt64
        switch hex.count {
        case 6: // RGB
            (r, g, b) = ((int >> 16) & 0xFF, (int >> 8) & 0xFF, int & 0xFF)
        default:
            (r, g, b) = (0, 0, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255
        )
    }
}

// MARK: - Previews

struct ChainDayWidget_Previews: PreviewProvider {
    static var previews: some View {
        let mockData = WidgetData(
            habits: [
                WidgetHabit(id: "1", name: "Drink Water", icon: "💧", color: "#059669", completed: true, streak: 5),
                WidgetHabit(id: "2", name: "Read 20 min", icon: "📚", color: "#047857", completed: true, streak: 12),
                WidgetHabit(id: "3", name: "Meditate", icon: "🧘", color: "#059669", completed: false, streak: 2),
                WidgetHabit(id: "4", name: "Exercise", icon: "🏃", color: "#047857", completed: true, streak: 7),
                WidgetHabit(id: "5", name: "Sleep early", icon: "🌙", color: "#059669", completed: false, streak: 0)
            ],
            todayStats: WidgetStats(completed: 3, total: 5, percentage: 60),
            bestStreak: WidgetBestStreak(name: "Read", count: 12),
            lastUpdated: Date().timeIntervalSince1970 * 1000
        )
        
        Group {
            ChainDayWidgetEntryView(entry: ChainDayEntry(date: Date(), data: mockData))
                .previewContext(WidgetPreviewContext(family: .systemSmall))
            
            ChainDayWidgetEntryView(entry: ChainDayEntry(date: Date(), data: mockData))
                .previewContext(WidgetPreviewContext(family: .systemMedium))
            
            ChainDayWidgetEntryView(entry: ChainDayEntry(date: Date(), data: mockData))
                .previewContext(WidgetPreviewContext(family: .systemLarge))
        }
    }
}
