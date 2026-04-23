import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../store/auth";
import Calendar from "react-calendar";
import "../calendar-theme.css";
import toast from "react-hot-toast";
import { format } from "date-fns";

export default function StreakCalendar() {
  const [streakData, setStreakData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { API, authorizationToken } = useAuth();

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const response = await axios.get(`${API}/api/streak`, {
          headers: { Authorization: authorizationToken },
        });
        setStreakData(response.data);
      } catch {
        toast.error("Could not load streak data");
      } finally {
        setLoading(false);
      }
    };
    fetchStreak();
  }, [API, authorizationToken]);

  if (loading || !streakData) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="h-8 w-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const getStreakMood = (streak) => {
    if (!streak || streak === 0)
      return { emoji: "😴", text: "Start your journey" };
    if (streak <= 3) return { emoji: "🙂", text: "Good start" };
    if (streak <= 7) return { emoji: "😄", text: "Keep going!" };
    if (streak <= 14) return { emoji: "🔥", text: "You're on fire!" };
    return { emoji: "🏆", text: "Unstoppable!" };
  };

  const mood = streakData ? getStreakMood(streakData.current) : null;

  return (
    <div className="bg-white dark:bg-dark-900 border border-zinc-200 dark:border-dark-800 p-6 rounded-xl relative overflow-hidden shadow-sm dark:shadow-none h-full flex flex-col">
      <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500 rounded-bl-full opacity-10" />
      <h3 className="text-xl font-bold mb-6 text-zinc-900 dark:text-white flex items-center gap-2">
        <span>🔥</span> Activity Streak
      </h3>
      {/* Streak Banner */}
      <div className="mb-6 p-4 rounded-xl bg-linear-to-r from-orange-500/20 to-yellow-400/10 border border-orange-400/20 flex items-center gap-4">
        <div className="text-3xl">{mood.emoji}</div>
        <div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
            {mood.text}
          </p>
          <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
            {streakData.current} day streak
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6 text-center">
        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-500/30 flex flex-col items-center">
          <span className="text-xl mb-1">🔥</span>
          <p className="text-3xl font-black text-orange-600 dark:text-orange-500">
            {streakData.current}
          </p>
          <p className="text-xs font-semibold text-orange-800/60 dark:text-orange-300 uppercase tracking-wider mt-1">
            Current
          </p>
        </div>
        <div className="bg-zinc-50 dark:bg-dark-950 p-4 rounded-lg border border-zinc-200 dark:border-dark-800 flex flex-col items-center">
          <span className="text-xl mb-1">🏆</span>
          <p className="text-3xl font-black text-zinc-700 dark:text-zinc-300">
            {streakData.longest}
          </p>
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-500 uppercase tracking-wider mt-1">
            Longest
          </p>
        </div>
      </div>
      <div className="grow flex items-center justify-center w-full mt-4 relative z-10">
        <Calendar
          className="w-full"
          tileClassName={({ date, view }) => {
            if (view !== "month") return null;

            const dateString = format(date, "yyyy-MM-dd");

            if (streakData.activityDates?.includes(dateString)) {
              return "activity-streak-tile";
            }

            return null;
          }}
          tileContent={({ date, view }) => {
            if (view !== "month") return null;

            const dateString = format(date, "yyyy-MM-dd");
            const todayString = format(new Date(), "yyyy-MM-dd");

            if (dateString === todayString) {
              return (
                <div className="absolute -top-1 -right-1 flex flex-col items-center z-10 pointer-events-none">
                  <span className="text-[12px] leading-none drop-shadow-md">
                    ⭐
                  </span>
                </div>
              );
            }

            if (streakData.activityDates?.includes(dateString)) {
              return (
                <div className="absolute -top-1 -right-1 flex flex-col items-center z-10 pointer-events-none">
                  <span className="text-[12px] leading-none drop-shadow-md">
                    🔥
                  </span>
                </div>
              );
            }

            return null;
          }}
          prev2Label={null}
          next2Label={null}
          minDetail="year"
        />
      </div>{" "}
    </div>
  );
}
