import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  saveWorkoutSet,
  getTodayWorkoutSets,
  getWorkoutHistory,
} from "./Wolfstorage.jsx";
import "./workout.css";

const exercises = [
  { name: "Bench Press", muscle: "Chest", target: "Chest", rest: 90 },
  { name: "Incline Dumbbell Press", muscle: "Chest", target: "Upper Chest", rest: 90 },
  { name: "Chest Fly", muscle: "Chest", target: "Chest", rest: 60 },
  { name: "Push Ups", muscle: "Chest", target: "Chest", rest: 60 },

  { name: "Lat Pulldown", muscle: "Back", target: "Lats", rest: 90 },
  { name: "Seated Cable Row", muscle: "Back", target: "Back", rest: 90 },
  { name: "Barbell Row", muscle: "Back", target: "Back", rest: 120 },
  { name: "Deadlift", muscle: "Back", target: "Back", rest: 150 },

  { name: "Shoulder Press", muscle: "Shoulders", target: "Shoulders", rest: 90 },
  { name: "Lateral Raises", muscle: "Shoulders", target: "Side Delts", rest: 60 },
  { name: "Rear Delt Fly", muscle: "Shoulders", target: "Rear Delts", rest: 60 },

  { name: "Biceps Curl", muscle: "Arms", target: "Biceps", rest: 60 },
  { name: "Hammer Curl", muscle: "Arms", target: "Biceps", rest: 60 },
  { name: "Triceps Pushdown", muscle: "Arms", target: "Triceps", rest: 60 },
  { name: "Overhead Triceps Extension", muscle: "Arms", target: "Triceps", rest: 60 },

  { name: "Squat", muscle: "Legs", target: "Quadriceps", rest: 120 },
  { name: "Leg Press", muscle: "Legs", target: "Legs", rest: 90 },
  { name: "Leg Curl", muscle: "Legs", target: "Hamstrings", rest: 60 },
  { name: "Calf Raises", muscle: "Legs", target: "Calves", rest: 60 },

  { name: "Crunches", muscle: "Abs", target: "Abs", rest: 45 },
  { name: "Plank", muscle: "Abs", target: "Core", rest: 45 },
];

const muscles = [
  "All",
  "Chest",
  "Back",
  "Shoulders",
  "Arms",
  "Legs",
  "Abs",
];

export default function WorkoutTimer() {
  const [muscle, setMuscle] = useState("All");
  const [exerciseName, setExerciseName] = useState(exercises[0].name);
  const [weight, setWeight] = useState("20");
  const [reps, setReps] = useState("10");
  const [sets, setSets] = useState(getTodayWorkoutSets());
  const [history, setHistory] = useState(getWorkoutHistory());

  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [message, setMessage] = useState("");

  const selectedExercise =
    exercises.find((item) => item.name === exerciseName) || exercises[0];

  const filteredExercises =
    muscle === "All"
      ? exercises
      : exercises.filter((item) => item.muscle === muscle);

  // Stopwatch
  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setElapsed((value) => value + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);

  // Rest countdown
  useEffect(() => {
    if (restTime <= 0) return;

    const interval = setInterval(() => {
      setRestTime((value) => Math.max(0, value - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [restTime]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;

    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const changeMuscle = (value) => {
    setMuscle(value);

    const nextExercise = exercises.find(
      (item) => value === "All" || item.muscle === value
    );

    if (nextExercise) {
      setExerciseName(nextExercise.name);
      setRestTime(0);
    }
  };

  const addSet = () => {
    const numericWeight = Number(weight);
    const numericReps = Number(reps);

    if (!Number.isFinite(numericWeight) || numericWeight < 0) {
      setMessage("Enter a valid weight.");
      return;
    }

    if (!Number.isInteger(numericReps) || numericReps < 1) {
      setMessage("Enter a valid number of reps.");
      return;
    }

    const savedSet = saveWorkoutSet({
      exercise: selectedExercise.name,
      muscle: selectedExercise.muscle,
      weight: numericWeight,
      reps: numericReps,
    });

    setSets((previous) => [...previous, savedSet]);
    setHistory(getWorkoutHistory());
    setRestTime(selectedExercise.rest);
    setMessage("Set saved successfully!");
  };

  const todayVolume = sets.reduce(
    (total, set) => total + (Number(set.volume) || 0),
    0
  );

  const exerciseSets = sets.filter(
    (set) => set.exercise === exerciseName
  );

  return (
    <div className="wt-root">
      <div className="wt-layout">

        <header className="wt-top">
          <Link to="/" className="wt-back" aria-label="Back">
            ←
          </Link>
          <span className="wt-status">
            WOLF WORKOUT
          </span>
        </header>

        <section className="wt-card">
          <h1>WORKOUT LIBRARY</h1>
          <p>Choose your muscle group and start training</p>
        </section>

        {/* Two columns on laptops: left = train, right = results */}
        <div className="wt-cols">

          <div className="wt-col">
            <section className="wolf-workout-section">
              <h2>MUSCLE GROUP</h2>

              <div className="wolf-muscle-list">
                {muscles.map((item) => (
                  <button
                    key={item}
                    className={muscle === item ? "wolf-chip active" : "wolf-chip"}
                    aria-pressed={muscle === item}
                    onClick={() => changeMuscle(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </section>

            <section className="wolf-workout-section">
              <h2>SELECT EXERCISE</h2>

              <select
                className="wolf-select"
                aria-label="Exercise"
                value={exerciseName}
                onChange={(event) => {
                  setExerciseName(event.target.value);
                  setRestTime(0);
                  setMessage("");
                }}
              >
                {filteredExercises.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>

              <div className="wolf-exercise-info">
                <strong>{selectedExercise.name}</strong>
                <span>{selectedExercise.target}</span>
                <span>Rest: {selectedExercise.rest}s</span>
              </div>
            </section>

            <section className="wolf-workout-section">
              <h2>WORKOUT TIMER</h2>

              <div className="wolf-timer-display">
                {formatTime(elapsed)}
              </div>

              <div className="wolf-action-row">
                <button onClick={() => setRunning(true)} disabled={running}>
                  START
                </button>

                <button onClick={() => setRunning(false)} disabled={!running}>
                  PAUSE
                </button>

                <button
                  onClick={() => {
                    setRunning(false);
                    setElapsed(0);
                  }}
                >
                  RESET
                </button>
              </div>
            </section>

            <section className="wolf-workout-section">
              <h2>LOG YOUR SET</h2>

              <div className="wolf-input-grid">
                <label>
                  Weight (KG)
                  <input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.5"
                    value={weight}
                    onChange={(event) => setWeight(event.target.value)}
                  />
                </label>

                <label>
                  Reps
                  <input
                    type="number"
                    inputMode="numeric"
                    min="1"
                    step="1"
                    value={reps}
                    onChange={(event) => setReps(event.target.value)}
                  />
                </label>
              </div>

              <button className="wolf-save-set" onClick={addSet}>
                COMPLETE SET + SAVE
              </button>

              {message && (
                <p className="wolf-message" role="status">
                  {message}
                </p>
              )}

              <p className="wolf-rest">
                {restTime > 0
                  ? `REST: ${formatTime(restTime)}`
                  : "READY FOR NEXT SET"}
              </p>

              <p className="wolf-set-count">
                Sets logged for this exercise: {exerciseSets.length}
              </p>
            </section>
          </div>

          <div className="wt-col">
            <section className="wolf-workout-section">
              <h2>TODAY'S WORKOUT</h2>

              <div className="wolf-today-volume">
                <span>TOTAL VOLUME</span>
                <strong>{todayVolume.toLocaleString()} KG</strong>
                <span>{sets.length} sets completed</span>
              </div>

              {sets.length === 0 ? (
                <p className="wolf-empty">No sets logged today. Start your workout!</p>
              ) : (
                <div className="wolf-log-list">
                  {[...sets].reverse().map((set) => (
                    <div className="wolf-log-item" key={set.id}>
                      <strong>{set.exercise}</strong>
                      <span>
                        {set.weight} KG × {set.reps} reps
                      </span>
                      <span>{set.volume.toLocaleString()} KG volume</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="wolf-workout-section">
              <h2>RECENT HISTORY</h2>

              {history.length === 0 ? (
                <p className="wolf-empty">Your workout history will appear here.</p>
              ) : (
                <div className="wolf-log-list">
                  {history.slice(0, 8).map((set) => (
                    <div className="wolf-log-item" key={set.id}>
                      <strong>{set.exercise}</strong>
                      <span>{set.date}</span>
                      <span>{set.weight} KG × {set.reps}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>

        <Link to="/" className="wolf-home-link">
          BACK TO DASHBOARD
        </Link>
      </div>
    </div>
  );
}