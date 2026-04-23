import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../store/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const field =
  "w-full bg-zinc-50 dark:bg-dark-800 rounded-lg p-2 border border-zinc-200 dark:border-dark-900 text-zinc-900 dark:text-white focus:border-primary-500 outline-none";

export default function WorkoutLogger() {
  const [exerciseOptions, setExerciseOptions] = useState([]);
  const [workoutDate, setWorkoutDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [exercises, setExercises] = useState([
    { exerciseId: "", duration: "", sets: "", reps: "" },
  ]);
  const { API, authorizationToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLib = async () => {
      try {
        const response = await axios.get(`${API}/api/exercises`);
        setExerciseOptions(response.data);
      } catch {
        toast.error("Could not load exercise library");
      }
    };
    fetchLib();
  }, [API]);

  const handleAddRow = () => {
    setExercises([
      ...exercises,
      { exerciseId: "", duration: "", sets: "", reps: "" },
    ]);
  };

  const handleRemoveRow = (index) => {
    const newEx = [...exercises];
    newEx.splice(index, 1);
    setExercises(
      newEx.length
        ? newEx
        : [{ exerciseId: "", duration: "", sets: "", reps: "" }],
    );
  };

  const handleChange = (index, fieldName, value) => {
    const newEx = [...exercises];
    newEx[index][fieldName] = value;
    setExercises(newEx);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formatted = exercises.map((ex) => ({
        exerciseId: ex.exerciseId,
        duration: Number(ex.duration),
        sets: Number(ex.sets || 0),
        reps: Number(ex.reps || 0),
      }));
      if (
        formatted.some((x) => !x.exerciseId || !Number.isFinite(x.duration))
      ) {
        toast.error("Select an exercise and duration for each row.");
        return;
      }
      await axios.post(
        `${API}/api/workouts`,
        { date: workoutDate, exercises: formatted, completed: true },
        { headers: { Authorization: authorizationToken } },
      );
      toast.success("Workout saved!");
      navigate("/history");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to log workout");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-dark-950 p-6 md:p-8 text-zinc-900 dark:text-white">
      <div className="max-w-3xl mx-auto bg-white dark:bg-dark-900 border border-zinc-200 dark:border-dark-800 p-6 md:p-8 rounded-xl shadow-lg shadow-zinc-900/5 dark:shadow-primary-500/10">
        <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-500 mb-2">
          Log a workout
        </h1>
        <p className="text-zinc-500 dark:text-neutral-500 text-sm mb-6">
          Add exercises, minutes, sets, and reps.
        </p>

        <div className="mb-6">
          <label className="block text-sm text-zinc-500 dark:text-gray-400 mb-1">
            Workout date
          </label>
          <input
            type="date"
            value={workoutDate}
            onChange={(e) => setWorkoutDate(e.target.value)}
            className={`w-full max-w-xs ${field}`}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {exercises.map((ex, idx) => (
            <div
              key={idx}
              className="flex flex-wrap md:flex-nowrap gap-4 items-end bg-zinc-50 dark:bg-dark-950 p-4 border border-zinc-200 dark:border-dark-800 rounded-lg"
            >
              <div className="w-full md:w-[28%]">
                <label className="block text-sm text-zinc-500 dark:text-gray-400 mb-1">
                  Exercise
                </label>
                <select
                  required
                  value={ex.exerciseId}
                  onChange={(e) =>
                    handleChange(idx, "exerciseId", e.target.value)
                  }
                  className={field}
                >
                  <option value="">Select…</option>
                  {exerciseOptions.map((o) => (
                    <option key={o._id} value={o._id}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full sm:w-[22%] md:w-[14%]">
                <label className="block text-sm text-zinc-500 dark:text-gray-400 mb-1">
                  Minutes
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  value={ex.duration}
                  onChange={(e) =>
                    handleChange(idx, "duration", e.target.value)
                  }
                  className={field}
                />
              </div>
              <div className="w-full sm:w-[22%] md:w-[14%]">
                <label className="block text-sm text-zinc-500 dark:text-gray-400 mb-1">
                  Sets
                </label>
                <input
                  type="number"
                  min="0"
                  value={ex.sets}
                  onChange={(e) => handleChange(idx, "sets", e.target.value)}
                  className={field}
                />
              </div>
              <div className="w-full sm:w-[22%] md:w-[14%]">
                <label className="block text-sm text-zinc-500 dark:text-gray-400 mb-1">
                  Reps
                </label>
                <input
                  type="number"
                  min="0"
                  value={ex.reps}
                  onChange={(e) => handleChange(idx, "reps", e.target.value)}
                  className={field}
                />
              </div>
              {exercises.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveRow(idx)}
                  className="text-red-600 dark:text-red-500 hover:text-red-500 dark:hover:text-red-400 p-2 font-bold mb-1"
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddRow}
            className="text-secondary-600 hover:text-secondary-500 dark:text-secondary-500 dark:hover:text-secondary-400 font-semibold text-sm"
          >
            + Add exercise
          </button>

          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 mt-4 rounded-lg shadow-[0_0_18px_rgba(14,165,233,0.35)] transition-colors"
          >
            Save workout
          </button>
        </form>
      </div>
    </div>
  );
}
