import { Authenticated, Unauthenticated, useMutation, useQuery } from "convex/react";
import { addDays, format, startOfWeek } from "date-fns";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Toaster } from "sonner";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { SettingsDialog } from "./SettingsDialog";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Checkbox } from "./components/Checkbox";

function getCatMotivation() {
  const motivations = [
    "Purr-fect progress! 🐱",
    "You're feline great! 😺",
    "Meow-velous work! 😸",
    "Keep pawing forward! 🐾",
  ];
  return motivations[Math.floor(Math.random() * motivations.length)];
}

function HabitStats({ habitId, settings }: { habitId: Id<"habits">, settings: any }) {
  const stats = useQuery(api.habits.getStats, { habitId }) ?? { streak: 0, consistency: 0 };

  if (!settings.showStreaks && !settings.showConsistency) return null;

  return (
    <div className="flex gap-4 text-sm text-gray-600">
      {settings.showStreaks && (
        <span className="flex items-center gap-1">
          {settings.showEmojis && "🔥"}
          <span className="font-medium">{stats.streak}</span> day streak
        </span>
      )}
      {settings.showConsistency && (
        <span className="flex items-center gap-1">
          {settings.showEmojis && "📊"}
          <span className="font-medium">{stats.consistency}%</span> consistency
        </span>
      )}
    </div>
  );
}

function App() {
  const [newHabit, setNewHabit] = useState("");
  const [newHabitNotes, setNewHabitNotes] = useState("");
  const [activeTab, setActiveTab] = useState("habits");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<"week" | "calendar">("week");
  const [editingNotes, setEditingNotes] = useState<Id<"habits"> | null>(null);

  const createHabit = useMutation(api.habits.create);
  const updateNotes = useMutation(api.habits.updateNotes);
  const toggleHabit = useMutation(api.habits.toggleHabit);
  const habits = useQuery(api.habits.list) ?? [];

  // Get the start of the week
  const weekStart = startOfWeek(selectedDate);
  // Generate an array of dates for the week
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weekDateStrings = weekDates.map(date => format(date, 'yyyy-MM-dd'));

  const tracking = useQuery(api.habits.getTracking, {
    dates: view === "week" ? weekDateStrings : [format(selectedDate, 'yyyy-MM-dd')]
  }) ?? [];

  const settings = useQuery(api.settings.get) ?? {
    showStreaks: true,
    showConsistency: true,
    showMotivationalMessages: true,
    showEmojis: true,
    showCalendarView: true,
    catTheme: true,
  };

  const articles = useQuery(api.articles.list, {}) ?? [];
  const seedArticles = useMutation(api.articles.seed);

  useEffect(() => {
    seedArticles();
  }, []);

  // Respect calendar view setting
  useEffect(() => {
    if (!settings.showCalendarView && view === "calendar") {
      setView("week");
    }
  }, [settings.showCalendarView]);

  const [showSettings, setShowSettings] = useState(false);

  return (
    <main aria-label="Habit tracker" className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold accent-text mb-4 flex items-center justify-center gap-3">
            {settings.catTheme && <span role="img" aria-label="cat" className="text-4xl">🐱</span>}
            Daily Habits
            {settings.catTheme && <span role="img" aria-label="cat" className="text-4xl">🐱</span>}
          </h1>
          <Authenticated>
            {settings.showMotivationalMessages && (
              <p className="text-xl text-slate-600">
                {getCatMotivation()}
              </p>
            )}
          </Authenticated>
          <Unauthenticated>
            <p className="text-xl text-slate-600">Sign in to track your habits</p>
          </Unauthenticated>
        </div>

        <Unauthenticated>
          <SignInForm />
        </Unauthenticated>

        <Authenticated>
          <div className="space-y-8">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav aria-label="Primary" className="-mb-px flex gap-4">
                <button
                  onClick={() => setActiveTab("habits")}
                  className={`py-2 px-4 text-sm font-medium ${
                    activeTab === "habits"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  role="tab"
                  aria-selected={activeTab === "habits"}
                >
                  My Habits
                </button>
                <button
                  onClick={() => setActiveTab("resources")}
                  className={`py-2 px-4 text-sm font-medium ${
                    activeTab === "resources"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  role="tab"
                  aria-selected={activeTab === "resources"}
                >
                  Resources
                </button>
              </nav>
            </div>

            {/* Habits Tab Content */}
            {activeTab === "habits" && (
              <div className="space-y-6">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (newHabit.trim()) {
                      await createHabit({
                        name: newHabit.trim(),
                        notes: newHabitNotes.trim() || undefined
                      });
                      setNewHabit("");
                      setNewHabitNotes("");
                    }
                  }}
                  aria-label="Create a new habit"
                  className="flex flex-col gap-2"
                >
                  <label className="sr-only" htmlFor="habit-name">Habit name</label>
                  <input
                    className="rounded-lg border border-gray-300 px-3 py-2"
                    id="habit-name"
                    onChange={(e) => setNewHabit(e.target.value)}
                    placeholder="Enter a new habit..."
                    type="text"
                    value={newHabit}
                  />
                  <label className="sr-only" htmlFor="habit-notes">Habit notes (optional)</label>
                  <textarea
                    className="rounded-lg border border-gray-300 px-3 py-2"
                    id="habit-notes"
                    onChange={(e) => setNewHabitNotes(e.target.value)}
                    placeholder="Add notes (optional)..."
                    rows={2}
                    value={newHabitNotes}
                  />
                  <button
                    disabled={!newHabit.trim()}
                    className="rounded-lg bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
                    type="submit"
                  >
                    Add Habit
                  </button>
                </form>

                {settings.showCalendarView && (
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => setView("week")}
                      className={`px-4 py-2 rounded-lg ${
                        view === "week"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                      aria-pressed={view === 'week'}
                    >
                      Week View
                    </button>
                    <button
                      onClick={() => setView("calendar")}
                      className={`px-4 py-2 rounded-lg ${
                        view === "calendar"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                      aria-pressed={view === 'calendar'}
                    >
                      Calendar View
                    </button>
                  </div>
                )}

                {view === "calendar" && settings.showCalendarView && (
                  <div className="flex justify-center">
                    <Calendar
                      onChange={(value) => {
                        if (value instanceof Date) {
                          setSelectedDate(value);
                        }
                      }}
                      value={selectedDate}
                      className="rounded-xl border shadow-lg"
                    />
                  </div>
                )}

                {(view === "week" || !settings.showCalendarView) ? (
                  <div className="overflow-x-auto">
                    <table className="w-full" role="grid" aria-label="Weekly habit grid">
                      <thead>
                        <tr>
                          <th className="px-4 py-2" scope="col">Habit</th>
                          {weekDates.map((date) => (
                            <th key={date.toString()} className="px-4 py-2" scope="col">
                              {format(date, 'EEE d')}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {habits.map((habit) => (
                          <tr key={habit._id}>
                            <td className="px-4 py-2" scope="row">
                              <div className="space-y-1">
                                <div>{habit.name}</div>
                                <HabitStats habitId={habit._id} settings={settings} />
                                {editingNotes === habit._id ? (
                                  <div className="mt-2">
                                    <textarea
                                      defaultValue={habit.notes || ""}
                                      className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                      rows={2}
                                      onBlur={async (e) => {
                                        await updateNotes({
                                          habitId: habit._id,
                                          notes: e.target.value
                                        });
                                        setEditingNotes(null);
                                      }}
                                    />
                                  </div>
                                ) : (
                                  habit.notes && (
                                    <div
                                      className="text-sm text-gray-600 cursor-pointer"
                                      onClick={() => setEditingNotes(habit._id)}
                                    >
                                      {habit.notes}
                                    </div>
                                  )
                                )}
                                {!habit.notes && !editingNotes && (
                                  <button
                                    onClick={() => setEditingNotes(habit._id)}
                                    className="text-sm text-blue-500"
                                    type="button"
                                  >
                                    Add notes
                                  </button>
                                )}
                              </div>
                            </td>
                            {weekDates.map((date) => {
                              const dateStr = format(date, 'yyyy-MM-dd');
                              const isCompleted = tracking.some(
                                (t) => t.habitId === habit._id && t.date === dateStr && t.completed
                              );
                              return (
                                <td key={dateStr} className="px-4 py-2 text-center">
                                  <label className="inline-flex items-center justify-center">
                                    <Checkbox
                                      aria-label={`Mark ${habit.name} on ${format(date, 'PPP')}`}
                                      checked={isCompleted}
                                      onChange={() =>
                                        toggleHabit({
                                          habitId: habit._id,
                                          date: dateStr,
                                        })
                                      }
                                      size="md"
                                      variant="success"
                                    />
                                  </label>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {habits.map((habit) => {
                      const dateStr = format(selectedDate, 'yyyy-MM-dd');
                      const isCompleted = tracking.some(
                        (t) => t.habitId === habit._id && t.date === dateStr && t.completed
                      );
                      return (
                        <div
                          key={habit._id}
                          className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm"
                        >
                          <div className="space-y-1">
                            <div className="text-lg">{habit.name}</div>
                            <HabitStats habitId={habit._id} settings={settings} />
                            {editingNotes === habit._id ? (
                              <div className="mt-2">
                                <textarea
                                  defaultValue={habit.notes || ""}
                                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                  rows={2}
                                  onBlur={async (e) => {
                                    await updateNotes({
                                      habitId: habit._id,
                                      notes: e.target.value
                                    });
                                    setEditingNotes(null);
                                  }}
                                />
                              </div>
                            ) : (
                              habit.notes && (
                                <div
                                  className="text-sm text-gray-600 cursor-pointer"
                                  onClick={() => setEditingNotes(habit._id)}
                                >
                                  {habit.notes}
                                </div>
                              )
                            )}
                            {!habit.notes && !editingNotes && (
                              <button
                                onClick={() => setEditingNotes(habit._id)}
                                className="text-sm text-blue-500"
                                type="button"
                              >
                                Add notes
                              </button>
                            )}
                          </div>
                          <label className="inline-flex items-center gap-2">
                            <Checkbox
                              aria-label={`Mark ${habit.name} on ${format(selectedDate, 'PPP')}`}
                              checked={isCompleted}
                              onChange={() =>
                                toggleHabit({
                                  habitId: habit._id,
                                  date: dateStr,
                                })
                              }
                              size="lg"
                              variant="success"
                            />
                            <span className="text-sm text-gray-700">Done</span>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Resources Tab Content */}
            {activeTab === "resources" && (
              <div className="rounded-xl bg-white p-6 shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  {settings.catTheme && <span role="img" aria-label="book">📚</span>}
                  Habit Building Resources
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {articles.map((article) => (
                    <div key={article._id} className="rounded-lg bg-gray-50 p-4">
                      <h3 className="text-lg font-medium mb-2">{article.title}</h3>
                      <p className="text-gray-600 text-sm">{article.content}</p>
                      <div className="mt-2">
                        <span className="inline-block rounded bg-indigo-100 px-2 py-1 text-xs text-indigo-800">
                          {article.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="fixed bottom-4 right-4 flex gap-2">
            <button
              onClick={() => setShowSettings(true)}
              aria-label="Open settings"
              className="rounded-full bg-gray-100 p-2 hover:bg-gray-200"
              type="button"
            >
              ⚙️
            </button>
            <SignOutButton />
          </div>
        </Authenticated>
      </div>
      <Toaster />
      <SettingsDialog isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </main>
  );
}

export default App;
