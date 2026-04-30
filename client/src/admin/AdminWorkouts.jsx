import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../store/auth";

export default function AdminWorkouts() {
  const { API, authorizationToken } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [userId, setUserId] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchWorkouts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/api/admin/workouts`, {
        headers: { Authorization: authorizationToken },
        params: { userId: userId || undefined, date: date || undefined },
      });
      setWorkouts(response.data.workouts);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load workouts");
    } finally {
      setLoading(false);
    }
  }, [API, authorizationToken, date, userId]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-500">
        Workout Monitoring
      </h1>

      <div className="bg-white dark:bg-dark-900 border border-zinc-200 dark:border-dark-800 p-4 rounded-xl grid md:grid-cols-3 gap-3">
        <input
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Filter by user id"
          className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-dark-700 bg-zinc-50 dark:bg-dark-950"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-dark-700 bg-zinc-50 dark:bg-dark-950"
        />
        <button
          onClick={fetchWorkouts}
          className="px-3 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-500"
        >
          Apply filters
        </button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="h-8 w-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : workouts.length === 0 ? (
          <p className="text-zinc-500 dark:text-neutral-400">No workouts found.</p>
        ) : (
          workouts.map((w) => (
            <div
              key={w._id}
              className="bg-white dark:bg-dark-900 border border-zinc-200 dark:border-dark-800 rounded-xl p-4"
            >
              <div className="flex flex-wrap justify-between gap-3 mb-3">
                <div>
                  <p className="font-semibold">{w.user?.name || "Unknown user"}</p>
                  <p className="text-sm text-zinc-500 dark:text-neutral-400">
                    {w.user?.email || "No email"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{w.totalCaloriesBurned} kcal</p>
                  <p className="text-sm text-zinc-500 dark:text-neutral-400">
                    {new Date(w.date).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="space-y-1 text-sm text-zinc-600 dark:text-neutral-300">
                {w.exercises.map((ex, idx) => (
                  <p key={idx}>
                    {ex.exerciseId?.name || "Exercise"} - {ex.duration} min
                  </p>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
