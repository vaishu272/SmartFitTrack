import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../store/auth";
import toast from "react-hot-toast";

export default function History() {
  const [workouts, setWorkouts] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [loading, setLoading] = useState(true);
  const { API, authorizationToken } = useAuth();

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoading(true);
        const params = filterDate ? { date: filterDate } : {};
        const response = await axios.get(`${API}/api/workouts`, {
          headers: { Authorization: authorizationToken },
          params,
        });
        setWorkouts(response.data);
      } catch (error) {
        toast.error("Could not load history");
      } finally {
        setLoading(false);
      }
    };
    fetchWorkouts();
  }, [API, authorizationToken, filterDate]);

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-dark-950 p-6 md:p-8 text-zinc-900 dark:text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-500">Workout history</h1>
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm text-zinc-500 dark:text-neutral-400">Filter by date</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-white dark:bg-dark-800 border border-zinc-200 dark:border-dark-900 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:border-primary-500 outline-none"
            />
            {filterDate && (
              <button
                type="button"
                onClick={() => setFilterDate("")}
                className="text-sm text-secondary-400 hover:text-secondary-300"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {workouts.map((w) => (
              <div
                key={w._id}
                className="bg-white dark:bg-dark-900 p-6 rounded-xl border border-zinc-200 dark:border-dark-800 shadow-sm dark:shadow-none"
              >
                <div className="flex flex-wrap justify-between items-center gap-2 mb-4 pb-4 border-b border-zinc-200 dark:border-dark-800">
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                    {new Date(w.date).toLocaleString()}
                  </h3>
                  <span className="text-secondary-600 dark:text-secondary-500 font-bold">
                    {w.totalCaloriesBurned} kcal
                  </span>
                </div>
                <div className="space-y-2">
                  {w.exercises.map((ex, i) => (
                    <div key={i} className="flex flex-wrap justify-between gap-2 text-zinc-600 dark:text-gray-300 text-sm">
                      <span>
                        {ex.exerciseId?.name || "Exercise"} ({ex.duration} min)
                      </span>
                      {ex.sets > 0 && (
                        <span className="text-zinc-500 dark:text-neutral-500">
                          {ex.sets} × {ex.reps} reps
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {workouts.length === 0 && (
              <p className="text-zinc-500 dark:text-gray-400">No workouts for this filter.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
