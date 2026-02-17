// HabitStreaksWidget.swift
// ChainDay Habit Streaks Widget
//
// iOS 17+ WidgetKit implementation for displaying habit streak data
// on the Home Screen. Supports small, medium, and large widget families.

import WidgetKit
import SwiftUI

// MARK: - Data Models

struct HabitEntry: Codable, Identifiable {
    let id: String
    let name: String
    let emoji: String
    let currentStreak: Int
    let completedToday: Bool
    let completedDays: [String] // ISO date strings for the week, e.g. ["2026-02-10", ...]
}

struct WidgetData: Codable {
    let habits: [HabitEntry]
    let totalCompletedToday: Int
    let totalHabits: Int
    let lastUpdated: String
    let weekDates: [String] // 7 ISO date strings for current week (Mon-Sun)
}

// MARK: - Timeline Entry

struct HabitStreaksEntry: TimelineEntry {
    let date: Date
    let widgetData: WidgetData
    let isPlaceholder: Bool

    static var placeholder: HabitStreaksEntry {
        HabitStreaksEntry(
            date: Date(),
            widgetData: WidgetData(
                habits: [
                    HabitEntry(id: "1", name: "Meditate", emoji: "🧘", currentStreak: 12, completedToday: true, completedDays: ["2026-02-11","2026-02-12","2026-02-13","2026-02-14","2026-02-15","2026-02-16","2026-02-17"]),
                    HabitEntry(id: "2", name: "Exercise", emoji: "💪", currentStreak: 7, completedToday: false, completedDays: ["2026-02-11","2026-02-12","2026-02-14","2026-02-15","2026-02-16"]),
                    HabitEntry(id: "3", name: "Read", emoji: "📚", currentStreak: 21, completedToday: true, completedDays: ["2026-02-11","2026-02-12","2026-02-13","2026-02-14","2026-02-15","2026-02-16","2026-02-17"]),
                    HabitEntry(id: "4", name: "Journal", emoji: "📝", currentStreak: 5, completedToday: false, completedDays: ["2026-02-13","2026-02-14","2026-02-15","2026-02-16"]),
                    HabitEntry(id: "5", name: "Water", emoji: "💧", currentStreak: 30, completedToday: true, completedDays: ["2026-02-11","2026-02-12","2026-02-13","2026-02-14","2026-02-15","2026-02-16","2026-02-17"]),
                ],
                totalCompletedToday: 3,
                totalHabits: 5,
                lastUpdated: "2026-02-17T09:00:00Z",
                weekDates: ["2026-02-11","2026-02-12","2026-02-13","2026-02-14","2026-02-15","2026-02-16","2026-02-17"]
            ),
            isPlaceholder: true
        )
    }
}

// MARK: - Timeline Provider

struct HabitStreaksProvider: TimelineProvider {
    private let appGroupID = "group.com.chainday.app.shared"

    func placeholder(in context: Context) -> HabitStreaksEntry {
        HabitStreaksEntry.placeholder
    }

    func getSnapshot(in context: Context, completion: @escaping (HabitStreaksEntry) -> Void) {
        completion(loadEntry())
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<HabitStreaksEntry>) -> Void) {
        let entry = loadEntry()
        // Refresh every 15 minutes
        let nextUpdate = Calendar.current.date(byAdding: .minute, value: 15, to: Date())!
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
        completion(timeline)
    }

    private func loadEntry() -> HabitStreaksEntry {
        guard let defaults = UserDefaults(suiteName: appGroupID),
              let jsonData = defaults.data(forKey: "habitStreaksWidgetData"),
              let widgetData = try? JSONDecoder().decode(WidgetData.self, from: jsonData)
        else {
            return HabitStreaksEntry.placeholder
        }
        return HabitStreaksEntry(date: Date(), widgetData: widgetData, isPlaceholder: false)
    }
}

// MARK: - Design Constants

private enum ChainDayColors {
    static let primaryGreen = Color(red: 4/255, green: 120/255, blue: 87/255)    // #047857
    static let buttonGreen = Color(red: 5/255, green: 150/255, blue: 105/255)    // #059669
    static let lightGreen = Color(red: 209/255, green: 250/255, blue: 229/255)   // #D1FAE5
    static let darkText = Color(red: 17/255, green: 24/255, blue: 39/255)        // #111827
    static let subtleText = Color(red: 107/255, green: 114/255, blue: 128/255)   // #6B7280
    static let cardBg = Color(red: 249/255, green: 250/255, blue: 251/255)       // #F9FAFB
    static let completedDot = Color(red: 5/255, green: 150/255, blue: 105/255)
    static let missedDot = Color(red: 229/255, green: 231/255, blue: 235/255)    // #E5E7EB
    static let futureDot = Color(red: 243/255, green: 244/255, blue: 246/255)    // #F3F4F6
}

// MARK: - Small Widget View
// Shows a single habit's streak count prominently

struct SmallWidgetView: View {
    let entry: HabitStreaksEntry

    private var topHabit: HabitEntry {
        entry.widgetData.habits.sorted { $0.currentStreak > $1.currentStreak }.first
            ?? HabitEntry(id: "0", name: "No habits", emoji: "🔗", currentStreak: 0, completedToday: false, completedDays: [])
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                Text("ChainDay")
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundColor(ChainDayColors.subtleText)
                Spacer()
                Text("🔗")
                    .font(.system(size: 11))
            }

            Spacer()

            Text(topHabit.emoji)
                .font(.system(size: 32))

            Text("\(topHabit.currentStreak)")
                .font(.system(size: 34, weight: .bold, design: .rounded))
                .foregroundColor(ChainDayColors.primaryGreen)

            Text("day streak")
                .font(.system(size: 13, weight: .medium))
                .foregroundColor(ChainDayColors.subtleText)

            Text(topHabit.name)
                .font(.system(size: 13, weight: .semibold))
                .foregroundColor(ChainDayColors.darkText)
                .lineLimit(1)

            Spacer(minLength: 2)

            // Today's overall progress
            HStack(spacing: 4) {
                Circle()
                    .fill(topHabit.completedToday ? ChainDayColors.buttonGreen : ChainDayColors.missedDot)
                    .frame(width: 8, height: 8)
                Text(topHabit.completedToday ? "Done today" : "Not yet")
                    .font(.system(size: 11))
                    .foregroundColor(ChainDayColors.subtleText)
            }
        }
        .padding(14)
        .widgetURL(URL(string: "chainday://habit/\(topHabit.id)"))
    }
}

// MARK: - Medium Widget View
// Shows top 3 habits with their streak counts

struct MediumWidgetView: View {
    let entry: HabitStreaksEntry

    private var topHabits: [HabitEntry] {
        Array(entry.widgetData.habits.sorted { $0.currentStreak > $1.currentStreak }.prefix(3))
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Text("ChainDay")
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundColor(ChainDayColors.subtleText)
                Text("🔗")
                    .font(.system(size: 11))
                Spacer()
                Text("\(entry.widgetData.totalCompletedToday)/\(entry.widgetData.totalHabits) today")
                    .font(.system(size: 11, weight: .medium))
                    .foregroundColor(ChainDayColors.buttonGreen)
            }

            Spacer(minLength: 2)

            ForEach(topHabits) { habit in
                Link(destination: URL(string: "chainday://habit/\(habit.id)")!) {
                    HStack(spacing: 8) {
                        Text(habit.emoji)
                            .font(.system(size: 20))

                        VStack(alignment: .leading, spacing: 1) {
                            Text(habit.name)
                                .font(.system(size: 13, weight: .semibold))
                                .foregroundColor(ChainDayColors.darkText)
                                .lineLimit(1)
                        }

                        Spacer()

                        HStack(spacing: 4) {
                            Image(systemName: "flame.fill")
                                .font(.system(size: 12))
                                .foregroundColor(habit.currentStreak >= 7 ? .orange : ChainDayColors.subtleText)

                            Text("\(habit.currentStreak)d")
                                .font(.system(size: 17, weight: .bold, design: .rounded))
                                .foregroundColor(ChainDayColors.primaryGreen)
                        }

                        // Completion indicator
                        Circle()
                            .fill(habit.completedToday ? ChainDayColors.buttonGreen : ChainDayColors.missedDot)
                            .frame(width: 10, height: 10)
                    }
                }
            }

            Spacer(minLength: 0)
        }
        .padding(14)
    }
}

// MARK: - Large Widget View
// Weekly overview grid with all habits

struct LargeWidgetView: View {
    let entry: HabitStreaksEntry

    private var sortedHabits: [HabitEntry] {
        entry.widgetData.habits.sorted { $0.currentStreak > $1.currentStreak }
    }

    private let dayLabels = ["M", "T", "W", "T", "F", "S", "S"]

    private func dayAbbreviation(for dateString: String) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        guard let date = formatter.date(from: dateString) else { return "?" }
        let weekday = Calendar.current.component(.weekday, from: date)
        // weekday: 1=Sun ... 7=Sat
        let labels = ["S", "M", "T", "W", "T", "F", "S"]
        return labels[weekday - 1]
    }

    private func isToday(_ dateString: String) -> Bool {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        guard let date = formatter.date(from: dateString) else { return false }
        return Calendar.current.isDateInToday(date)
    }

    private func isFuture(_ dateString: String) -> Bool {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        guard let date = formatter.date(from: dateString) else { return false }
        return date > Date()
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            // Header
            HStack {
                Text("ChainDay")
                    .font(.system(size: 13, weight: .bold))
                    .foregroundColor(ChainDayColors.primaryGreen)
                Text("🔗")
                    .font(.system(size: 13))
                Spacer()
                Text("\(entry.widgetData.totalCompletedToday)/\(entry.widgetData.totalHabits) today")
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundColor(ChainDayColors.buttonGreen)
            }

            Divider()

            // Day column headers
            HStack(spacing: 0) {
                // Habit name column
                Text("")
                    .frame(width: 110, alignment: .leading)

                // Streak column
                Text("")
                    .frame(width: 36, alignment: .trailing)

                // Day columns
                ForEach(entry.widgetData.weekDates, id: \.self) { dateStr in
                    Text(dayAbbreviation(for: dateStr))
                        .font(.system(size: 11, weight: isToday(dateStr) ? .bold : .regular))
                        .foregroundColor(isToday(dateStr) ? ChainDayColors.primaryGreen : ChainDayColors.subtleText)
                        .frame(maxWidth: .infinity)
                }
            }

            // Habit rows
            ForEach(Array(sortedHabits.prefix(7))) { habit in
                Link(destination: URL(string: "chainday://habit/\(habit.id)")!) {
                    HStack(spacing: 0) {
                        // Habit name
                        HStack(spacing: 4) {
                            Text(habit.emoji)
                                .font(.system(size: 14))
                            Text(habit.name)
                                .font(.system(size: 13, weight: .medium))
                                .foregroundColor(ChainDayColors.darkText)
                                .lineLimit(1)
                        }
                        .frame(width: 110, alignment: .leading)

                        // Streak count
                        Text("\(habit.currentStreak)")
                            .font(.system(size: 13, weight: .bold, design: .rounded))
                            .foregroundColor(ChainDayColors.primaryGreen)
                            .frame(width: 36, alignment: .trailing)

                        // Weekly dots
                        ForEach(entry.widgetData.weekDates, id: \.self) { dateStr in
                            ZStack {
                                if isFuture(dateStr) {
                                    Circle()
                                        .fill(ChainDayColors.futureDot)
                                        .frame(width: 14, height: 14)
                                } else if habit.completedDays.contains(dateStr) {
                                    Circle()
                                        .fill(ChainDayColors.completedDot)
                                        .frame(width: 14, height: 14)
                                    Image(systemName: "checkmark")
                                        .font(.system(size: 8, weight: .bold))
                                        .foregroundColor(.white)
                                } else if isToday(dateStr) {
                                    Circle()
                                        .strokeBorder(ChainDayColors.buttonGreen, lineWidth: 1.5)
                                        .frame(width: 14, height: 14)
                                } else {
                                    Circle()
                                        .fill(ChainDayColors.missedDot)
                                        .frame(width: 14, height: 14)
                                }
                            }
                            .frame(maxWidth: .infinity)
                        }
                    }
                }
            }

            Spacer(minLength: 0)

            // Footer motivation
            if sortedHabits.first?.currentStreak ?? 0 >= 7 {
                HStack {
                    Spacer()
                    Text("🔥 Keep the chains going!")
                        .font(.system(size: 11, weight: .medium))
                        .foregroundColor(ChainDayColors.subtleText)
                    Spacer()
                }
            }
        }
        .padding(14)
    }
}

// MARK: - Widget Configuration

struct HabitStreaksWidget: Widget {
    let kind: String = "HabitStreaksWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: HabitStreaksProvider()) { entry in
            if #available(iOS 17.0, *) {
                HabitStreaksWidgetView(entry: entry)
                    .containerBackground(.fill.tertiary, for: .widget)
            } else {
                HabitStreaksWidgetView(entry: entry)
                    .padding()
                    .background()
            }
        }
        .configurationDisplayName("Habit Streaks")
        .description("Track your habit streaks at a glance.")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

// MARK: - Adaptive Widget View

struct HabitStreaksWidgetView: View {
    @Environment(\.widgetFamily) var family
    let entry: HabitStreaksEntry

    var body: some View {
        switch family {
        case .systemSmall:
            SmallWidgetView(entry: entry)
        case .systemMedium:
            MediumWidgetView(entry: entry)
        case .systemLarge:
            LargeWidgetView(entry: entry)
        default:
            SmallWidgetView(entry: entry)
        }
    }
}

// MARK: - Widget Bundle

@main
struct HabitStreaksWidgetBundle: WidgetBundle {
    var body: some Widget {
        HabitStreaksWidget()
    }
}

// MARK: - Previews

#if DEBUG
struct HabitStreaksWidget_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            HabitStreaksWidgetView(entry: .placeholder)
                .previewContext(WidgetPreviewContext(family: .systemSmall))
                .previewDisplayName("Small")

            HabitStreaksWidgetView(entry: .placeholder)
                .previewContext(WidgetPreviewContext(family: .systemMedium))
                .previewDisplayName("Medium")

            HabitStreaksWidgetView(entry: .placeholder)
                .previewContext(WidgetPreviewContext(family: .systemLarge))
                .previewDisplayName("Large")
        }
    }
}
#endif
