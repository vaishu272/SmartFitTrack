import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useAuth } from "../store/auth";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
  const { API, authorizationToken } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/api/admin/stats`, {
        headers: { Authorization: authorizationToken },
      });
      setStats(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load admin stats");
    } finally {
      setLoading(false);
    }
  }, [API, authorizationToken]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const chartData = useMemo(() => {
    if (!stats?.workoutsByDay?.length) {
      return {
        labels: ["No data"],
        datasets: [{ label: "Workouts", data: [0], backgroundColor: "#38bdf8" }],
      };
    }
    return {
      labels: stats.workoutsByDay.map((d) => d._id),
      datasets: [
        {
          label: "Workouts per day",
          data: stats.workoutsByDay.map((d) => d.workouts),
          backgroundColor: "#38bdf8",
          borderRadius: 6,
        },
      ],
    };
  }, [stats]);

  const cardClass =
    "bg-white dark:bg-dark-900 border border-zinc-200 dark:border-dark-800 rounded-xl p-5 shadow-sm dark:shadow-none";

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-10 w-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-500">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className={cardClass}>
          <p className="text-sm text-zinc-500 dark:text-neutral-400">Total users</p>
          <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
        </div>
        <div className={cardClass}>
          <p className="text-sm text-zinc-500 dark:text-neutral-400">
            Total workouts
          </p>
          <p className="text-3xl font-bold mt-2">{stats.totalWorkouts}</p>
        </div>
        {/* <div className={cardClass}>
          <p className="text-sm text-zinc-500 dark:text-neutral-400">
            Active users (7d)
          </p>
          <p className="text-3xl font-bold mt-2">{stats.activeUsers}</p>
        </div> */}
        <div className={cardClass}>
          <p className="text-sm text-zinc-500 dark:text-neutral-400">
            Calories logged (7d)
          </p>
          <p className="text-3xl font-bold mt-2">{Math.round(stats.caloriesLogged7Days)}</p>
        </div>
        <div className={cardClass}>
          <p className="text-sm text-zinc-500 dark:text-neutral-400">
            Contact messages
          </p>
          <p className="text-3xl font-bold mt-2">{stats.totalContacts ?? 0}</p>
        </div>
      </div>

      <div className={cardClass}>
        <h2 className="text-lg font-semibold mb-4">Workout Activity Trend</h2>
        <div className="h-72">
          <Bar data={chartData} options={{ maintainAspectRatio: false, responsive: true }} />
        </div>
      </div>
    </div>
  );
}
