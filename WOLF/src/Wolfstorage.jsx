
// Wolfstorage.jsx
// مصدر موحد لبيانات Food Tracker وWorkout Tracker

const OLD_KEY = "wolf_daily_log";
const WORKOUT_KEY = "wolf_workout_log";

const getLocalDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const todayKey = () => `wolf_log_${getLocalDate()}`;

export function loadTodayLog() {
  try {
    const raw = localStorage.getItem(todayKey());

    if (raw) return JSON.parse(raw);

    const old = localStorage.getItem(OLD_KEY);

    if (old) {
      const today = new Date().toDateString();

      return JSON.parse(old).filter(
        (item) => new Date(item.id).toDateString() === today
      );
    }
  } catch (error) {
    console.error("Failed to load food log:", error);
  }

  return [];
}

export function saveTodayLog(log) {
  try {
    localStorage.setItem(todayKey(), JSON.stringify(log));
  } catch (error) {
    console.error("Failed to save food log:", error);
  }
}

export function getTodayTotals(log = loadTodayLog()) {
  const sum = (key) =>
    log.reduce((total, item) => total + (Number(item[key]) || 0), 0);

  return {
    calories: Math.round(sum("calories")),
    protein: Number(sum("protein").toFixed(1)),
    carbs: Number(sum("carbs").toFixed(1)),
    fat: Number(sum("fat").toFixed(1)),
  };
}

// ---------------- WORKOUT STORAGE ----------------

export function loadWorkoutLog() {
  try {
    const raw = localStorage.getItem(WORKOUT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Failed to load workout log:", error);
    return [];
  }
}

export function saveWorkoutLog(log) {
  try {
    localStorage.setItem(WORKOUT_KEY, JSON.stringify(log));
  } catch (error) {
    console.error("Failed to save workout log:", error);
  }
}

// تسجيل Set واحدة
export function saveWorkoutSet({
  exercise,
  muscle,
  weight,
  reps,
}) {
  const log = loadWorkoutLog();

  const newSet = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    exercise,
    muscle,
    weight: Number(weight),
    reps: Number(reps),
    volume: Number(weight) * Number(reps),
    date: getLocalDate(),
    createdAt: new Date().toISOString(),
  };

  const updatedLog = [...log, newSet];

  saveWorkoutLog(updatedLog);

  return newSet;
}

// سجلات اليوم
export function getTodayWorkoutSets() {
  const today = getLocalDate();

  return loadWorkoutLog().filter((set) => set.date === today);
}

// مجموع الوزن المرفوع اليوم
export function getTodayWorkoutVolume() {
  return getTodayWorkoutSets().reduce(
    (total, set) => total + (Number(set.volume) || 0),
    0
  );
}

// عدد المجموعات المكتملة اليوم
export function getTodayCompletedSets() {
  return getTodayWorkoutSets().length;
}

// تاريخ التمارين
export function getWorkoutHistory() {
  return [...loadWorkoutLog()].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}
