// مصدر واحد للبيانات: الداشبورد وصفحة الأكل بيقرأوا ويكتبوا من هون
import React from "react";
const OLD_KEY = "wolf_daily_log";

// كل يوم له مفتاح: wolf_log_2026-11-05
export const todayKey = () => `wolf_log_${new Date().toLocaleDateString("en-CA")}`;

export function loadTodayLog() {
  try {
    const raw = localStorage.getItem(todayKey());
    if (raw) return JSON.parse(raw);

    // ترحيل من النسخة القديمة: ناخد بس عناصر اليوم
    const old = localStorage.getItem(OLD_KEY);
    if (old) {
      const today = new Date().toDateString();
      return JSON.parse(old).filter((e) => new Date(e.id).toDateString() === today);
    }
  } catch (err) {
    console.error("Failed to load log:", err);
  }
  return [];
}

export function saveTodayLog(log) {
  try {
    localStorage.setItem(todayKey(), JSON.stringify(log));
  } catch (err) {
    console.error("Failed to save log:", err);
  }
}

// مجموع اليوم (أرقام، مو strings)
export function getTodayTotals(log = loadTodayLog()) {
  const sum = (key) => log.reduce((acc, item) => acc + (Number(item[key]) || 0), 0);
  return {
    calories: Math.round(sum("calories")),
    protein: Number(sum("protein").toFixed(1)),
    carbs: Number(sum("carbs").toFixed(1)),
    fat: Number(sum("fat").toFixed(1)),
  };
}