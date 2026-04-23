export const updateStreak = (user) => {
  const today = new Date();

  if (!user.streak) {
    user.streak = { current: 0, longest: 0, activityDates: [] };
  }

  const formatDate = (date) => date.toISOString().split("T")[0];
  const todayStr = formatDate(today);

  if (!user.streak.lastActiveDate) {
    user.streak.current = 1;
    user.streak.longest = 1;
    user.streak.lastActiveDate = today;
    if (!user.streak.activityDates) user.streak.activityDates = [];
    user.streak.activityDates.push(todayStr);
    return;
  }

  const lastDate = new Date(user.streak.lastActiveDate);
  const utcToday = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const utcLast = Date.UTC(
    lastDate.getFullYear(),
    lastDate.getMonth(),
    lastDate.getDate(),
  );
  const diffDays = Math.floor((utcToday - utcLast) / (1000 * 60 * 60 * 24));

  if (!user.streak.activityDates) user.streak.activityDates = [];

  if (diffDays === 0) {
    // Activity on the same day. Just ensure today is recorded.
    if (!user.streak.activityDates.includes(todayStr)) {
      user.streak.activityDates.push(todayStr);
    }
  } else if (diffDays === 1) {
    // Consecutive day
    user.streak.current += 1;
    user.streak.lastActiveDate = today;
    if (!user.streak.activityDates.includes(todayStr)) {
      user.streak.activityDates.push(todayStr);
    }
  } else if (diffDays > 1) {
    // Streak broken
    user.streak.current = 1;
    user.streak.lastActiveDate = today;
    if (!user.streak.activityDates.includes(todayStr)) {
      user.streak.activityDates.push(todayStr);
    }
  }

  if (user.streak.current > user.streak.longest) {
    user.streak.longest = user.streak.current;
  }
};
