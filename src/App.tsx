import { Authenticated, Unauthenticated, useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { useState, useEffect } from "react";
import Calendar from 'react-calendar';
import { format, startOfWeek, addDays } from 'date-fns';
import 'react-calendar/dist/Calendar.css';
import { SettingsDialog } from "./SettingsDialog";
import { Id } from "../convex/_generated/dataModel";

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
    <main className="container mx-auto px-4 py-8">
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
              <nav className="-mb-px flex gap-4">
                <button
                  onClick={() => setActiveTab("habits")}
                  className={`py-2 px-4 text-sm font-medium ${
                    activeTab === "habits"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
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
                  className="flex flex-col gap-2"
                >
                  <input
                    type="text"
                    value={newHabit}
                    onChange={(e) => setNewHabit(e.target.value)}
                    placeholder="Enter a new habit..."
                    className="rounded-lg border border-gray-300 px-3 py-2"
                  />
                  <textarea
                    value={newHabitNotes}
                    onChange={(e) => setNewHabitNotes(e.target.value)}
                    placeholder="Add notes (optional)..."
                    className="rounded-lg border border-gray-300 px-3 py-2"
                    rows={2}
                  />
                  <button
                    type="submit"
                    disabled={!newHabit.trim()}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
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
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="px-4 py-2">Habit</th>
                          {weekDates.map((date) => (
                            <th key={date.toString()} className="px-4 py-2">
                              {format(date, 'EEE d')}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {habits.map((habit) => (
                          <tr key={habit._id}>
                            <td className="px-4 py-2">
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
                                  <button
                                    onClick={() =>
                                      toggleHabit({
                                        habitId: habit._id,
                                        date: dateStr,
                                      })
                                    }
                                    className={`w-8 h-8 rounded-full ${
                                      isCompleted
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-100"
                                    }`}
                                  >
                                    {isCompleted && settings.showEmojis ? "✅" : ""}
                                  </button>
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
                          className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm"
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
                              >
                                Add notes
                              </button>
                            )}
                          </div>
                          <button
                            onClick={() =>
                              toggleHabit({
                                habitId: habit._id,
                                date: dateStr,
                              })
                            }
                            className={`px-4 py-2 rounded-lg ${
                              isCompleted
                                ? "bg-green-500 text-white"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {isCompleted ? (settings.showEmojis ? "✅" : "Done") : "Mark Done"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Resources Tab Content */}
            {activeTab === "resources" && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  {settings.catTheme && <span role="img" aria-label="book">📚</span>}
                  Habit Building Resources
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {articles.map((article) => (
                    <div key={article._id} className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-2">{article.title}</h3>
                      <p className="text-gray-600 text-sm">{article.content}</p>
                      <div className="mt-2">
                        <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
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
              className="bg-gray-100 p-2 rounded-full hover:bg-gray-200"
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
