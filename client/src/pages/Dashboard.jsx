import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../store/auth";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import toast from "react-hot-toast";
import { useTheme } from "../store/theme";
import StreakCalendar from "../components/StreakCalendar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { API, authorizationToken } = useAuth();
  const { isDark } = useTheme();

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/api/progress/dashboard/stats`, {
        headers: { Authorization: authorizationToken },
      });
      setStats(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load dashboard");
    } finally {
      setLoading(false);
    }
  }, [API, authorizationToken]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { labels: { color: isDark ? "#a3a3a3" : "#71717a" } },
      },
      scales: {
        x: {
          ticks: { color: isDark ? "#a3a3a3" : "#71717a" },
          grid: {
            color: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
          },
        },
        y: {
          beginAtZero: true,
          ticks: { color: isDark ? "#a3a3a3" : "#71717a" },
          grid: {
            color: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
          },
        },
      },
    }),
    [isDark],
  );

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-zinc-100 dark:bg-dark-950 flex flex-col items-center justify-center gap-3 text-primary-600 dark:text-primary-500 py-8">
        <div className="h-10 w-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-zinc-500 dark:text-neutral-400">
          Loading dashboard…
        </p>
      </div>
    );
  }

  const barLabels = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  });

  const barData = {
    labels: barLabels,
    datasets: [
      {
        label: "Calories burned",
        data: stats.caloriesPerDay,
        backgroundColor: "#38bdf8",
        borderRadius: 6,
      },
    ],
  };

  const weightTrend = stats.weightTrend || [];
  const lineData =
    weightTrend.length > 0
      ? {
          labels: weightTrend.map((w) =>
            new Date(w.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
          ),
          datasets: [
            {
              label: "Weight (kg)",
              data: weightTrend.map((w) => w.weight),
              borderColor: "#818cf8",
              backgroundColor: "rgba(129, 140, 248, 0.12)",
              tension: 0.35,
              fill: true,
            },
          ],
        }
      : {
          labels: ["No data yet"],
          datasets: [
            {
              label: "Weight (kg)",
              data: [0],
              borderColor: isDark
                ? "rgba(255,255,255,0.2)"
                : "rgba(0,0,0,0.15)",
              backgroundColor: "transparent",
            },
          ],
        };

  const cardClass =
    "bg-white dark:bg-dark-900 border border-zinc-200 dark:border-dark-800 p-6 rounded-xl relative overflow-hidden shadow-sm dark:shadow-none";

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-dark-950 p-6 md:p-8 text-zinc-900 dark:text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-500 mb-6">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN: Streak Calendar & Achievements */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="flex-1">
              <StreakCalendar />
            </div>

            {/* Achievement Badges moved to left column under calendar */}
            <div className={`${cardClass} flex-1`}>
              <h3 className="text-xl font-bold mb-4 text-primary-600 dark:text-primary-500">
                Achievements
              </h3>
              <div className="flex flex-col gap-3">
                {stats.recentAchievements?.length ? (
                  stats.recentAchievements.map((ach) => (
                    <div
                      key={ach._id}
                      className="flex items-center gap-4 bg-zinc-50 dark:bg-dark-950 border border-primary-500/25 dark:border-primary-500/30 p-3 rounded-lg shadow-sm"
                    >
                      <div className="text-3xl">{ach.icon}</div>
                      <div>
                        <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
                          {ach.title}
                        </h4>
                        <p className="text-xs text-zinc-500 dark:text-gray-400">
                          {ach.description}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-500 dark:text-gray-400 text-sm">
                    Complete workouts to unlock achievements.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Stats and Charts */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* STATS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={cardClass}>
                <div className="absolute top-0 right-0 w-16 h-16 bg-primary-500 rounded-bl-full opacity-20" />
                <h3 className="text-zinc-500 dark:text-gray-400 font-semibold mb-2">
                  Total workouts
                </h3>
                <p className="text-4xl font-bold text-zinc-900 dark:text-white">
                  {stats.totalWorkouts}
                </p>
              </div>
              <div className={cardClass}>
                <div className="absolute top-0 right-0 w-16 h-16 bg-secondary-500 rounded-bl-full opacity-20" />
                <h3 className="text-zinc-500 dark:text-gray-400 font-semibold mb-2">
                  Calories (7 days)
                </h3>
                <p className="text-4xl font-bold text-zinc-900 dark:text-white">
                  {stats.totalCaloriesThisWeek}
                </p>
              </div>
            </div>

            {/* CHARTS ROW */}
            <div className="flex flex-col gap-6">
              <div className={cardClass}>
                <h3 className="text-xl font-bold mb-4">
                  Calories burned (last 7 days)
                </h3>
                <div className="h-72 flex items-center justify-center">
                  <Bar
                    data={barData}
                    options={{ ...chartOptions, maintainAspectRatio: false }}
                  />
                </div>
              </div>
              <div className={cardClass}>
                <h3 className="text-xl font-bold mb-4">Weight progress</h3>
                <div className="h-72 flex items-center justify-center">
                  {weightTrend.length === 0 ? (
                    <p className="text-zinc-500 dark:text-neutral-500 text-sm text-center w-full">
                      Log weight from your profile to see this chart.
                    </p>
                  ) : (
                    <Line
                      data={lineData}
                      options={{ ...chartOptions, maintainAspectRatio: false }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
