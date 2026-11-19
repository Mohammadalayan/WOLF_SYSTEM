
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getTodayTotals,
  getTodayWorkoutVolume,
} from "./Wolfstorage.jsx";
import { supabase } from "./supabase.js";
import { calculateFitnessMetrics } from "./fitnessCalculations.jsx";
import "./fitness.css";

/* ---------- Icons ---------- */

const Flame = ({ size = 18, color = "#e8590c" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
    <path d="M12 2c1 3-1 4.5-2.5 6.5C8 10.5 7 12 7 14.5A5 5 0 0 0 12 20a5 5 0 0 0 5-5c0-2-1-3.2-2-4.5-.4 1.2-1.1 1.8-1.8 2C13.6 9.5 13.5 5 12 2z" />
  </svg>
);

const Mic = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0b1220" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="2" width="6" height="12" rx="3" fill="#0b1220" />
    <path d="M5 11a7 7 0 0 0 14 0M12 18v4" />
  </svg>
);

const Home = ({ active }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={active ? "#22e5ff" : "#9fb0c3"} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
    <path d="M3 11l9-8 9 8v10h-6v-6H9v6H3z" />
  </svg>
);

const Dumbbell = ({ active }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={active ? "#22e5ff" : "#9fb0c3"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 10v4M5 7v10M19 7v10M22 10v4M5 12h14M8 9v6M16 9v6" />
  </svg>
);

const Book = ({ active }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={active ? "#22e5ff" : "#9fb0c3"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 6c-2-1.5-5-2-9-2v14c4 0 7 .5 9 2 2-1.5 5-2 9-2V4c-4 0-7 .5-9 2zM12 6v14" />
  </svg>
);

const User = ({ active }) => (
   <a href="./Auth.jsx"><svg width="28" height="28" viewBox="0 0 24 24" fill={active ? "#22e5ff" : "#9fb0c3"} aria-hidden="true">
    <circle cx="12" cy="12" r="11" />
    <circle cx="12" cy="9.5" r="3.6" fill="#0d1626" />
   
    <path d="M5.5 19c1.3-3 3.8-4.4 6.5-4.4s5.2 1.4 6.5 4.4A10.8 10.8 0 0 1 12 23a10.8 10.8 0 0 1-6.5-4z" fill="#0d1626" />
  </svg></a>
);

const MuscleIcon = () => (
  <svg width="48" height="42" viewBox="0 0 52 46" fill="none" stroke="#8b7cf6" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
    <circle cx="26" cy="9" r="5" />
    <path d="M14 22c0-4 4-6 12-6s12 2 12 6v12H14z" />
    <path d="M14 22c-5-2-9 0-10 4 0 4 3 6 6 5M38 22c5-2 9 0 10 4 0 4-3 6-6 5" />
    <path d="M19 26h14M26 26v8M17 34v6h18v-6" />
  </svg>
);

const Sparkline = () => (
  <svg className="fh-spark" width="100%" height="48" viewBox="0 0 120 48" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <linearGradient id="fh-spark-fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#9b6bff" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#9b6bff" stopOpacity="0" />
      </linearGradient>
    </defs>
    <polygon points="0,10 25,40 50,18 75,36 100,14 120,30 120,48 0,48" fill="url(#fh-spark-fill)" />
    <polyline fill="none" stroke="#9b6bff" strokeWidth="1.8" vectorEffect="non-scaling-stroke" points="0,10 25,40 50,18 75,36 100,14 120,30" />
    <polyline fill="none" stroke="#cfd6e3" strokeWidth="1.2" opacity="0.6" vectorEffect="non-scaling-stroke" points="0,34 25,22 50,44 75,24 100,40 120,32" />
  </svg>
);

/* ---------- BMI color helper ---------- */

function bmiTone(category) {
  const c = String(category || "").toLowerCase();

  if (c.includes("obes")) return "high";
  if (c.includes("over")) return "warn";
  if (c.includes("under")) return "low";
  if (c.includes("normal") || c.includes("healthy")) return "good";

  return "none";
}

/* ---------- Dashboard ---------- */

export default function FitnessHome({
  workout = {
    title: "YOUR TRAINING PLAN",
    minutes: 45,
    exercises: 0,
  },
  streak = 10,
  guidesViewed = 12,
  quote = {
    text: "Every action you take is a vote for the type of person you wish to become.",
    source: "From Atomic Habits by James Clear",
  },
  onNavigate = () => {},
  activeTab = "home",
}) {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState("");

  /* ---------- Load user profile ---------- */

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        const { data: authData, error: authError } =
          await supabase.auth.getUser();

        if (authError || !authData?.user) {
          navigate("/auth", { replace: true });
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", authData.user.id)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (!data) {
          navigate("/profile-setup", { replace: true });
          return;
        }

        if (isMounted) {
          setProfile(data);
          setMetrics(calculateFitnessMetrics(data));
        }
      } catch (error) {
        console.error("DASHBOARD PROFILE ERROR:", error);

        if (isMounted) {
          setProfileError(
            error.message || "Could not load your profile."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  /* ---------- Food Tracker ---------- */

  const totals = getTodayTotals();

  /* ---------- Workout Tracker ---------- */

  const todayVolume = getTodayWorkoutVolume();

  /* ---------- Dynamic calorie goal ---------- */

  const calorieGoal = Number(metrics?.calorieTarget) || 0;
  const consumedCalories = Number(totals.calories) || 0;

  const percent = calorieGoal
    ? Math.min(
        100,
        Math.round((consumedCalories / calorieGoal) * 100)
      )
    : 0;

  const remaining = calorieGoal - consumedCalories;
  const isOver = calorieGoal > 0 && remaining < 0;

  /* ---------- Volume formatting ---------- */

  const volumeDisplay =
    todayVolume >= 1000
      ? `${(todayVolume / 1000).toFixed(1)}K`
      : todayVolume.toLocaleString();

  /* ---------- Loading ---------- */

  if (loading) {
    return (
      <div className="fh-root">
        <div className="fh-screen">
          <div className="fh-container">
            <main
              className="fh-main fh-loading"
              aria-busy="true"
              aria-live="polite"
            >
              <span className="fh-sr-only">
                Loading your dashboard
              </span>

              <div className="fh-skel fh-skel-hero" />

              <div className="fh-skel-grid">
                <div className="fh-skel" />
                <div className="fh-skel" />
                <div className="fh-skel" />
                <div className="fh-skel" />
              </div>

              <div className="fh-skel fh-skel-wide" />
            </main>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Error ---------- */

  if (profileError) {
    return (
      <div className="fh-root">
        <div className="fh-screen">
          <div className="fh-container fh-state-wrap">
            <div className="fh-card fh-state" role="alert">
              <span className="fh-state-icon" aria-hidden="true">
                !
              </span>

              <h2 className="fh-state-title">
                Could not load your profile
              </h2>

              <p className="fh-state-text">
                {profileError}
              </p>

              <button
                className="fh-cta fh-cta-plain"
                onClick={() => window.location.reload()}
              >
                TRY AGAIN
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Dashboard UI ---------- */

  return (
    <div className="fh-root">
      <div className="fh-screen">
        <div className="fh-container">

          {/* Top bar */}

    <header className="fh-top">
  <div className="fh-user-info">
    <Link
      to="/profile-setup"
      className="fh-avatar"
      aria-label="Edit profile"
    >
      {profile?.full_name?.trim()?.charAt(0).toUpperCase() || "W"}
    </Link>

    <div className="fh-user-details">
      <span className="fh-greeting">WELCOME BACK</span>
      <span className="fh-user-name">
        {profile?.full_name || "Athlete"}
      </span>
    </div>
  </div>

  <div className="fh-streak">
    <Flame size={20} color="#e8590c" />
    <span>
      {streak} DAYS
      <br />
      DISCIPLINE
    </span>
  </div>
</header>

          <main className="fh-main">

            {/* 1. Today's workout */}

            <section className="fh-card fh-hero">
              <h1>{workout.title}</h1>

              <p>
                {workout.exercises > 0
                  ? `${workout.minutes} Min / ${workout.exercises} Exercises`
                  : `${workout.minutes} Min session`}
              </p>

              <Link
                to="/workout"
                className="fh-cta flex items-center justify-center text-center"
                onClick={() => onNavigate("workout")}
              >
                START WORKOUT&nbsp; →
              </Link>
            </section>

            <div className="fh-layout-grid">

              {/* 2. Today's progress */}

              <div className="fh-today">

                <h2 className="fh-section-title">
                  TODAY
                </h2>

                <div className="fh-grid">

                  {/* Calories */}

                  <section
                    className={
                      "fh-card fh-tile fh-orange" +
                      (isOver ? " is-over" : "")
                    }
                  >
                    <span className="fh-label">
                      CALORIE GOAL
                    </span>

                    <div className="fh-row">
                      <strong className="fh-big">
                        {consumedCalories.toLocaleString()}
                      </strong>

                      <Flame
                        size={34}
                        color={isOver ? "#ff5d73" : "#ff7a1a"}
                      />
                    </div>

                    <div className="fh-unit-row">
                      <span className="fh-unit">
                        KCAL TODAY /{" "}
                        {calorieGoal
                          ? calorieGoal.toLocaleString()
                          : "—"}{" "}
                        GOAL
                      </span>

                      <span className="fh-percent">
                        {calorieGoal ? `${percent}%` : "—"}
                      </span>
                    </div>

                    <div
                      className="fh-progress"
                      role="progressbar"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-valuenow={percent}
                      aria-label="Calories eaten today"
                    >
                      <div
                        className="fh-progress-bar"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    {calorieGoal ? (
                      <span className="fh-hint">
                        {isOver
                          ? `${Math.abs(remaining).toLocaleString()} kcal over your goal`
                          : `${remaining.toLocaleString()} kcal left today`}
                      </span>
                    ) : (
                      <Link
                        to="/profile-setup"
                        className="fh-hint fh-hint-link"
                      >
                        Finish your profile to get a goal →
                      </Link>
                    )}
                  </section>

                  {/* Food AI */}

                  <Link
                    to="/ai"
                    className="fh-card fh-tile fh-teal fh-tile-link"
                    onClick={() => onNavigate("ai")}
                  >
                    <div className="fh-ai-head">
                      <span className="fh-label">
                        CALORIE / FOOD AI
                      </span>

                      <span className="fh-chip">
                        AI
                      </span>
                    </div>

                    <div className="fh-ask-content">
                      <span className="fh-mic">
                        <Mic />
                      </span>

                      <span className="fh-wave" aria-hidden="true">
                        <i />
                        <i />
                        <i />
                        <i />
                        <i />
                      </span>
                    </div>

                    <div className="fh-ask-copy">
                      <strong className="fh-ask-title">
                        Ask about any food
                      </strong>

                      <span className="fh-ask-text">
                        Enter your calorie intake
                      </span>
                    </div>
                  </Link>

                  {/* Volume Pumped */}

                  <section className="fh-card fh-tile fh-teal">
                    <span className="fh-label">
                      VOLUME PUMPED
                    </span>

                    <div className="fh-value">
                      <strong className="fh-big">
                        {volumeDisplay}
                      </strong>

                      <span className="fh-unit-sm">
                        KG
                      </span>
                    </div>

                    <Sparkline />
                  </section>

                  {/* Muscle Guide AI */}

                  <section className="fh-card fh-tile fh-teal">
                    <span className="fh-label">
                      MUSCLE GUIDE AI
                    </span>

                    <div className="fh-guide">
                      <MuscleIcon />

                      <div className="fh-guide-count">
                        <strong>{guidesViewed}</strong>

                        <span>
                          GUIDE
                          <br />
                          VIEWED
                        </span>
                      </div>
                    </div>
                  </section>

                </div>
              </div>

              {/* 3. Body information + motivation */}

              <div className="fh-side">

                {/* Body metrics */}

                <section className="fh-card fh-metrics">

                  <div className="fh-metrics-head">
                    <h2 className="fh-section-title">
                      YOUR BODY
                    </h2>

                    <Link
                      to="/profile-setup"
                      className="fh-link"
                    >
                      EDIT PROFILE
                    </Link>
                  </div>

                  <div className="fh-metrics-grid">

                    <div
                      className="fh-metric"
                      data-tone={bmiTone(metrics?.bmiCategory)}
                    >
                      <span className="fh-metric-label">
                        BMI
                      </span>

                      <strong className="fh-metric-value">
                        {metrics?.bmi ?? "—"}
                      </strong>

                      <span className="fh-metric-note">
                        {metrics?.bmiCategory ?? "Not available"}
                      </span>
                    </div>

                    <div className="fh-metric">
                      <span className="fh-metric-label">
                        BMR
                      </span>

                      <strong className="fh-metric-value">
                        {metrics?.bmr?.toLocaleString() ?? "—"}
                      </strong>

                      <span className="fh-metric-note">
                        KCAL AT REST
                      </span>
                    </div>

                    <div className="fh-metric">
                      <span className="fh-metric-label">
                        TDEE
                      </span>

                      <strong className="fh-metric-value">
                        {metrics?.tdee?.toLocaleString() ?? "—"}
                      </strong>

                      <span className="fh-metric-note">
                        KCAL WITH ACTIVITY
                      </span>
                    </div>

                    <div className="fh-metric">
                      <span className="fh-metric-label">
                        BODY FAT
                      </span>

                      <strong className="fh-metric-value">
                        {metrics?.bodyFat != null
                          ? `${metrics.bodyFat}%`
                          : "—"}
                      </strong>

                      <span className="fh-metric-note">
                        {metrics?.bodyFat != null
                          ? "YOUR BODY FAT"
                          : "NOT PROVIDED"}
                      </span>
                    </div>

                  </div>
                </section>

                {/* Quote */}

                <section className="fh-card fh-quote">
                  <span className="fh-quote-title">
                    QUOTE OF THE DAY
                  </span>

                  <blockquote>
                    "{quote.text}"
                  </blockquote>

                  <cite>
                    {quote.source}
                  </cite>
                </section>

              </div>
            </div>
          </main>

          {/* Bottom navigation */}

          <nav className="fh-nav" aria-label="Main">

            <Link
              to="/"
              className="fh-tab"
              aria-current={activeTab === "home" ? "page" : undefined}
              onClick={() => onNavigate("home")}
            >
              <Home active={activeTab === "home"} />
              <span className="fh-tab-label">
                Home
              </span>
            </Link>

            <Link
              to="/workout"
              className="fh-tab"
              aria-current={activeTab === "workout" ? "page" : undefined}
              onClick={() => onNavigate("workout")}
            >
              <Dumbbell active={activeTab === "workout"} />
              <span className="fh-tab-label">
                Workout
              </span>
            </Link>

            <button
              className="fh-tab"
              aria-current={activeTab === "guide" ? "page" : undefined}
              onClick={() => onNavigate("guide")}
            >
              <Book active={activeTab === "guide"} />
              <span className="fh-tab-label">
                Guide
              </span>
            </button>

            <Link
              to="/auth"
              className="fh-tab"
              aria-current={activeTab === "profile" ? "page" : undefined}
              onClick={() => onNavigate("profile")}
            >
              <User active={activeTab === "profile"} />
              <span className="fh-tab-label">
                Profile
              </span>
            </Link>

          </nav>

        </div>
      </div>
    </div>
  );
}
