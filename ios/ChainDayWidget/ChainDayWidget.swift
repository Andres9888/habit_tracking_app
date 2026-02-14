// ChainDayWidget.swift
// WidgetKit extension for ChainDay habit tracker
// Shows today's habit completion progress

import WidgetKit
import SwiftUI

// MARK: - Data Models

struct HabitEntry: Codable, Identifiable {
    let id: String
    let name: String
    let icon: String?
    let iconColor: String?
    let completed: Bool
}

struct WidgetData: Codable {
    let habits: [HabitEntry]
    let date: String // YYYY-MM-DD
    let updatedAt: Double // Unix timestamp
}

// MARK: - Shared Data Provider

struct SharedDataProvider {
    static let appGroupID = "group.com.chainday.app"
    static let dataKey = "widgetData"

    static func loadData() -> WidgetData? {
        guard let defaults = UserDefaults(suiteName: appGroupID),
              let jsonData = defaults.data(forKey: dataKey) else {
            return nil
        }
        return try? JSONDecoder().decode(WidgetData.self, from: jsonData)
    }

    static func todayString() -> String {
        let fmt = DateFormatter()
        fmt.dateFormat = "yyyy-MM-dd"
        fmt.timeZone = .current
        return fmt.string(from: Date())
    }
}

// MARK: - Timeline Provider

struct HabitTimelineProvider: TimelineProvider {
    typealias Entry = HabitTimelineEntry

    func placeholder(in context: Context) -> HabitTimelineEntry {
        HabitTimelineEntry.placeholder
    }

    func getSnapshot(in context: Context, completion: @escaping (HabitTimelineEntry) -> Void) {
        completion(currentEntry())
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<HabitTimelineEntry>) -> Void) {
        let entry = currentEntry()
        // Refresh every 30 minutes
        let nextUpdate = Calendar.current.date(byAdding: .minute, value: 30, to: Date()) ?? Date()
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
        completion(timeline)
    }

    private func currentEntry() -> HabitTimelineEntry {
        let today = SharedDataProvider.todayString()
        if let data = SharedDataProvider.loadData(), data.date == today {
            return HabitTimelineEntry(
                date: Date(),
                habits: data.habits,
                isPlaceholder: false
            )
        }
        return HabitTimelineEntry.placeholder
    }
}

// MARK: - Timeline Entry

struct HabitTimelineEntry: TimelineEntry {
    let date: Date
    let habits: [HabitEntry]
    let isPlaceholder: Bool

    var completedCount: Int { habits.filter(\.completed).count }
    var totalCount: Int { habits.count }
    var progress: Double {
        totalCount > 0 ? Double(completedCount) / Double(totalCount) : 0
    }

    static let placeholder = HabitTimelineEntry(
        date: Date(),
        habits: [
            HabitEntry(id: "1", name: "Meditate", icon: "🧘", iconColor: nil, completed: true),
            HabitEntry(id: "2", name: "Exercise", icon: "💪", iconColor: nil, completed: true),
            HabitEntry(id: "3", name: "Read", icon: "📚", iconColor: nil, completed: false),
            HabitEntry(id: "4", name: "Journal", icon: "✍️", iconColor: nil, completed: false),
            HabitEntry(id: "5", name: "Walk", icon: "🚶", iconColor: nil, completed: true),
            HabitEntry(id: "6", name: "Vitamins", icon: "💊", iconColor: nil, completed: false),
            HabitEntry(id: "7", name: "Sleep 8h", icon: "😴", iconColor: nil, completed: true),
        ],
        isPlaceholder: true
    )
}

// MARK: - Brand Colors

extension Color {
    static let chainGreen = Color(red: 5/255, green: 150/255, blue: 105/255)   // #059669
    static let chainGreenDark = Color(red: 4/255, green: 120/255, blue: 87/255) // #047857
    static let chainBg = Color(red: 247/255, green: 250/255, blue: 248/255)
}

// MARK: - Progress Ring View

struct ProgressRingView: View {
    let progress: Double
    let lineWidth: CGFloat
    let size: CGFloat

    var body: some View {
        ZStack {
            Circle()
                .stroke(Color.chainGreen.opacity(0.15), lineWidth: lineWidth)
            Circle()
                .trim(from: 0, to: CGFloat(min(progress, 1.0)))
                .stroke(
                    Color.chainGreen,
                    style: StrokeStyle(lineWidth: lineWidth, lineCap: .round)
                )
                .rotationEffect(.degrees(-90))
                .animation(.easeInOut(duration: 0.3), value: progress)
        }
        .frame(width: size, height: size)
    }
}

// MARK: - Small Widget View

struct SmallWidgetView: View {
    let entry: HabitTimelineEntry

    var body: some View {
        VStack(spacing: 6) {
            ZStack {
                ProgressRingView(progress: entry.progress, lineWidth: 6, size: 64)
                VStack(spacing: 0) {
                    Text("\(entry.completedCount)")
                        .font(.system(size: 22, weight: .bold, design: .rounded))
                        .foregroundColor(.chainGreenDark)
                    Text("of \(entry.totalCount)")
                        .font(.system(size: 11, weight: .medium, design: .rounded))
                        .foregroundColor(.secondary)
                }
            }

            Text(entry.progress >= 1.0 ? "All done! 🎉" : "Keep going!")
                .font(.system(size: 12, weight: .semibold, design: .rounded))
                .foregroundColor(entry.progress >= 1.0 ? .chainGreen : .secondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .containerBackground(for: .widget) {
            Color.chainBg
        }
    }
}

// MARK: - Medium Widget View

struct MediumWidgetView: View {
    let entry: HabitTimelineEntry

    var body: some View {
        HStack(spacing: 12) {
            // Left: progress ring
            VStack(spacing: 4) {
                ZStack {
                    ProgressRingView(progress: entry.progress, lineWidth: 5, size: 52)
                    Text("\(entry.completedCount)/\(entry.totalCount)")
                        .font(.system(size: 13, weight: .bold, design: .rounded))
                        .foregroundColor(.chainGreenDark)
                }
                Text("Today")
                    .font(.system(size: 11, weight: .medium, design: .rounded))
                    .foregroundColor(.secondary)
            }
            .frame(width: 70)

            // Right: habit list
            VStack(alignment: .leading, spacing: 3) {
                ForEach(entry.habits.prefix(5)) { habit in
                    HabitRowView(habit: habit)
                }
                if entry.habits.count > 5 {
                    Text("+\(entry.habits.count - 5) more")
                        .font(.system(size: 10, weight: .medium, design: .rounded))
                        .foregroundColor(.secondary)
                }
            }
            Spacer(minLength: 0)
        }
        .padding(.horizontal, 4)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .containerBackground(for: .widget) {
            Color.chainBg
        }
    }
}

struct HabitRowView: View {
    let habit: HabitEntry

    var body: some View {
        HStack(spacing: 6) {
            // Tap target for deep link
            Link(destination: URL(string: "habit-tracker://toggle/\(habit.id)")!) {
                HStack(spacing: 6) {
                    Image(systemName: habit.completed ? "checkmark.circle.fill" : "circle")
                        .font(.system(size: 14))
                        .foregroundColor(habit.completed ? .chainGreen : .gray.opacity(0.4))

                    Text(habit.icon ?? "⭐️")
                        .font(.system(size: 12))

                    Text(habit.name)
                        .font(.system(size: 12, weight: habit.completed ? .medium : .regular, design: .rounded))
                        .foregroundColor(habit.completed ? .secondary : .primary)
                        .strikethrough(habit.completed)
                        .lineLimit(1)
                }
            }
            Spacer()
        }
    }
}

// MARK: - Widget Configuration

struct ChainDayWidget: Widget {
    let kind: String = "ChainDayWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: HabitTimelineProvider()) { entry in
            if #available(iOSApplicationExtension 17.0, *) {
                ChainDayWidgetEntryView(entry: entry)
            } else {
                ChainDayWidgetEntryView(entry: entry)
                    .padding()
                    .background(Color.chainBg)
            }
        }
        .configurationDisplayName("ChainDay")
        .description("Track your daily habits at a glance.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

struct ChainDayWidgetEntryView: View {
    @Environment(\.widgetFamily) var family
    let entry: HabitTimelineEntry

    var body: some View {
        switch family {
        case .systemSmall:
            SmallWidgetView(entry: entry)
        case .systemMedium:
            MediumWidgetView(entry: entry)
        default:
            SmallWidgetView(entry: entry)
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

// MARK: - Previews

#if DEBUG
struct ChainDayWidget_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            SmallWidgetView(entry: .placeholder)
                .previewContext(WidgetPreviewContext(family: .systemSmall))
                .previewDisplayName("Small")

            MediumWidgetView(entry: .placeholder)
                .previewContext(WidgetPreviewContext(family: .systemMedium))
                .previewDisplayName("Medium")
        }
    }
}
#endif
