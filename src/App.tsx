import { Authenticated, Unauthenticated, useMutation, useQuery } from "convex/react";
import { addDays, format, startOfWeek } from "date-fns";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Toaster } from "sonner";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";

const weeklyDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

type HabitStatus = "done" | "missed" | "planned";

const statusStyles: Record<HabitStatus, string> = {
  done: "bg-foreground text-background border-transparent",
  missed: "border-dashed text-muted-foreground",
  planned: "text-muted-foreground",
};

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function App() {
  const [isAdding, setIsAdding] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");

  const createHabit = useMutation(api.habits.create);
  const toggleHabit = useMutation(api.habits.toggleHabit);
  const habits = useQuery(api.habits.list) ?? [];

  // Get current week starting from Monday
  const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));
  const weekDateStrings = weekDates.map(d => format(d, 'yyyy-MM-dd'));

  const tracking = useQuery(api.habits.getTracking, { dates: weekDateStrings }) ?? [];

  const canSubmit = useMemo(
    () => newHabitName.trim().length > 0,
    [newHabitName],
  );

  const handleToggleForm = () => {
    setIsAdding((prev) => {
      if (prev) {
        setNewHabitName("");
      }
      return !prev;
    });
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const name = newHabitName.trim();
    if (!name) {
      return;
    }

    await createHabit({ name, notes: "" });
    setNewHabitName("");
    setIsAdding(false);
  };

  const getHabitStatus = (habitId: string, dateString: string): HabitStatus => {
    const trackingEntry = tracking.find(
      (t) => t.habitId === habitId && t.date === dateString
    );

    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (trackingEntry?.completed) return "done";
    if (date < today) return "missed";
    return "planned";
  };

  return (
    <section className="bg-background">
      <div className="mx-auto flex min-h-screen max-w-md flex-col gap-8 px-6 pb-24 pt-12">
        <Unauthenticated>
          <SignInForm />
        </Unauthenticated>

        <Authenticated>
          <header className="flex items-center justify-between">
            <h1 className="text-4xl font-black tracking-tight text-foreground">
              Habits
            </h1>
            <button
              type="button"
              onClick={handleToggleForm}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition-colors hover:bg-foreground hover:text-background"
              aria-label="Add habit"
              aria-expanded={isAdding}
              aria-controls="add-habit-panel"
            >
              <Plus size={20} strokeWidth={2.4} />
            </button>
          </header>

          {isAdding && (
            <form
              id="add-habit-panel"
              onSubmit={handleSubmit}
              className="rounded-[24px] border border-border bg-background/90 p-5 shadow-sm backdrop-blur"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="habit-name"
                    className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground"
                  >
                    New Habit
                  </label>
                  <input
                    id="habit-name"
                    name="habit-name"
                    type="text"
                    value={newHabitName}
                    onChange={(event) => setNewHabitName(event.target.value)}
                    placeholder="Name your habit"
                    autoFocus
                    className="w-full rounded-full border border-border bg-background px-5 py-3 text-sm font-medium tracking-wide text-foreground outline-none transition-colors focus:border-foreground"
                  />
                </div>
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleToggleForm}
                    className="text-xs uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className={cn(
                      "rounded-full border border-foreground px-5 py-2 text-xs uppercase tracking-[0.3em] transition-colors",
                      canSubmit
                        ? "hover:bg-foreground hover:text-background"
                        : "opacity-40",
                    )}
                  >
                    Add
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="space-y-8">
            {habits.map((habit) => {
              const weekStatus = weekDateStrings.map(ds => getHabitStatus(habit._id, ds));
              const completedCount = weekStatus.filter(s => s === "done").length;
              const completionRate = Math.round((completedCount / 7) * 100);

              // Calculate streak (consecutive days completed up to today)
              const calculateStreak = () => {
                const completedDates = new Set(
                  tracking
                    .filter(t => t.habitId === habit._id && t.completed)
                    .map(t => t.date)
                );

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                let streak = 0;
                let currentDate = new Date(today);

                // Count consecutive days backward from today
                while (true) {
                  const dateString = format(currentDate, 'yyyy-MM-dd');
                  if (completedDates.has(dateString)) {
                    streak++;
                    currentDate.setDate(currentDate.getDate() - 1);
                  } else {
                    break;
                  }
                }

                return streak;
              };

              const streak = calculateStreak();

              return (
                <article
                  key={habit._id}
                  className="rounded-[28px] border border-border bg-background/90 p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-3">
                    <div>
                      <h3 className="text-xl font-semibold tracking-tight text-foreground">
                        {habit.name}
                      </h3>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-7 justify-items-center gap-y-4 gap-x-3">
                    {weeklyDays.map((day, index) => {
                      const state = weekStatus[index];
                      const dateString = weekDateStrings[index];
                      return (
                        <div
                          key={`${habit._id}-${day}`}
                          className="flex flex-col items-center gap-2"
                        >
                          <span className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">
                            {day}
                          </span>
                          <button
                            onClick={() => toggleHabit({ habitId: habit._id, date: dateString })}
                            className={cn(
                              "flex h-11 w-11 items-center justify-center rounded-full border border-border text-sm font-semibold transition-colors",
                              state && statusStyles[state],
                            )}
                            aria-label={`Toggle ${habit.name} on ${day}`}
                          >
                            {state === "done" ? "✓" : state === "missed" ? "–" : "·"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-6 h-[2px] w-full bg-border">
                    <div
                      className="h-full bg-foreground transition-all duration-300"
                      style={{ width: `${completionRate}%` }}
                      aria-hidden
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    <span>Streak · {streak} days</span>
                    <span>{completionRate}% this week</span>
                  </div>
                </article>
              );
            })}
          </div>
        </Authenticated>
      </div>
      <Toaster />
    </section>
  );
}

export default App;
