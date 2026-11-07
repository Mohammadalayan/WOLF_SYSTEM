import React from "react";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Workout from './workout.jsx';
import { getTodayTotals } from "./Wolfstorage.jsx";

/* ---------- Small inline icons ---------- */
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
  <svg width="28" height="28" viewBox="0 0 24 24" fill={active ? "#22e5ff" : "#9fb0c3"} aria-hidden="true">
    <circle cx="12" cy="12" r="11" />
    <circle cx="12" cy="9.5" r="3.6" fill="#0d1626" />
    <path d="M5.5 19c1.3-3 3.8-4.4 6.5-4.4s5.2 1.4 6.5 4.4A10.8 10.8 0 0 1 12 23a10.8 10.8 0 0 1-6.5-4z" fill="#0d1626" />
  </svg>
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
  <svg width="100%" height="48" viewBox="0 0 120 48" preserveAspectRatio="none" aria-hidden="true">
    <polyline fill="none" stroke="#9b6bff" strokeWidth="1.6" points="0,10 25,40 50,18 75,36 100,14 120,30" />
    <polyline fill="none" stroke="#cfd6e3" strokeWidth="1.2" opacity="0.6" points="0,34 25,22 50,44 75,24 100,40 120,32" />
  </svg>
);

/* ---------- Screen ---------- */
export default function FitnessHome({
  workout = { title: "CHEST & TRICEPS FOCUS", minutes: 45, exercises: 5 },
  calories = 1600, // الهدف اليومي (goal)
  streak = 10,
  volume = "14.2K",
  guidesViewed = 12,
  quote = {
    text: "Every action you take is a vote for the type of person you wish to become.",
    source: "From Atomic Habits by James Clear",
  },
  onStart = () => {},
  onAskFood = () => {},
  onNavigate = () => {},
  activeTab = "home",
}) {
  const tabs = [
    { id: "home", label: "Home", Icon: Home },
    { id: "workout", label: "Workout", Icon: Dumbbell },
    { id: "guide", label: "Guide", Icon: Book },
    { id: "profile", label: "Profile", Icon: User },
  ];

  // نفس بيانات صفحة الأكل (WOLF): بتنقرأ كل ما الصفحة تنفتح
  const totals = getTodayTotals();

  const handleStartWorkout = () => {
    <Routes>
        <Route path="/workout" element={<Workout />} />
    </Routes>
     }
  return (
    <div className="fh-root">
      <style>{css}</style>
      

      <div className="fh-screen">
        {/* Container for Desktop/Tablet centering */}
        <div className="fh-container">
          
          {/* Top bar */}
          <header className="fh-top">
            <div className="fh-avatar" aria-label="Profile photo" />
            <div className="fh-streak">
              <Flame size={20} color="#e8590c" />
              <span>{streak} DAYS<br />DISCIPLINE</span>
            </div>
          </header>

          <main className="fh-main">
            {/* Hero */}
            <section className="fh-card fh-hero">
              <h1>{workout.title}</h1>
              <p>{workout.minutes} Min / {workout.exercises} Exercises</p>
              <Link to="/workout" className="fh-cta flex items-center justify-center text-center">
                START WORKOUT
              </Link>
                
            </section>

            {/* Grid Area */}
            <div className="fh-layout-grid">
              
              {/* Primary Stats Grid */}
              <div className="fh-grid">
                <section className="fh-card fh-tile fh-orange">
                  <span className="fh-label">CALORIE GOAL</span>
                  <div className="fh-row">
                    <strong className="fh-big">{totals.calories}</strong>
                    <Flame size={34} color="#ff7a1a" />
                  </div>
                  <span className="fh-unit">KCAL TODAY / {calories} GOAL</span>

                </section>

                <section className="fh-card fh-tile fh-teal" >
                  <span className="fh-label">CALORIE / FOOD AI</span>
                  <button className="fh-ask" onClick={onAskFood}>
                    <span className="fh-mic"><Mic /></span>
                   <Link to="./ai" style={{ textDecoration: 'none',
                      color: 'var(--cyan)'
                    }}> <span style={{fontSize:"13px", fontWeight:"200"}}>Enter your calorie intake</span></Link>
                  </button>
                </section>

                <section className="fh-card fh-tile fh-teal">
                  <span className="fh-label">VOLUME PUMPED</span>
                  <strong className="fh-big">{volume}</strong>
                  <Sparkline />
                </section>

                <section className="fh-card fh-tile fh-teal">
                  <span className="fh-label">MUSCLE GUIDE AI</span>
                  <div className="fh-guide">
                    <MuscleIcon />
                    <div className="fh-guide-count">
                      <strong>{guidesViewed}</strong>
                      <span>GUIDE<br />VIEWED</span>
                    </div>
                  </div>
                </section>
              </div>

              {/* Sidebar Quote on Desktop */}
              <section className="fh-card fh-quote">
                <span className="fh-quote-title">QUOTE OF THE DAY</span>
                <blockquote>"{quote.text}"</blockquote>
                <cite>{quote.source}</cite>
              </section>

            </div>
          </main>

          {/* Bottom nav */}
          <nav className="fh-nav" aria-label="Main">
            {tabs.map(({ id, label, Icon }, i) => (
              <React.Fragment key={id}>
                {i > 0 && <span className="fh-sep" aria-hidden="true" />}
                <button
                  className="fh-tab"
                  aria-label={label}
                  aria-current={activeTab === id ? "page" : undefined}
                  onClick={() => onNavigate(id)}
                >
                  <Icon active={activeTab === id} />
                  <span className="fh-tab-label">{label}</span>
                </button>
              </React.Fragment>
            ))}
          </nav>

        </div>
      </div>
    </div>
  );
}

/* ---------- Responsive Styles ---------- */
const css = `
.a{
  text-decoration: none;
  color: var(--cyan);
  }
.fh-root {
  --bg: #0a1322; 
  --card: #16223a; 
  --card-edge: #25344f;
  --cyan: #22e5ff; 
  --orange: #ff9d2e; 
  --teal: #1fbfb8;
  --text: #ffffff; 
  --muted: #9fb0c3;
  min-height: 100vh; 
  width: 100%; 
  background: var(--bg);
  font-family: Inter, "SF Pro Text", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}

body, html { margin: 0; padding: 0; width: 100%; height: 100%; }
.fh-root * { box-sizing: border-box; margin: 0; }

.fh-screen {
  width: 100%; 
  min-height: 100vh; 
  background: var(--bg);
  color: var(--text); 
  display: flex; 
  justify-content: center;
}

.fh-container {
  width: 100%;
  max-width: 1080px; /* Limits container on Laptops & Desktops */
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Header */
.fh-top {
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 16px 20px;
  min-height: 60px;
}

.fh-avatar {
  position: absolute;
  left: 20px;
  top: 16px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #d9d9de;
}

/* On mobile keep profile centered if desired, else top left for clean dashboard layout */
@media (max-width: 639px) {
  .fh-avatar {
    left: 50%;
    transform: translateX(-50%);
  }
}

.fh-streak {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f5a623;
  color: #2a1a00;
  font-size: 8px;
  font-weight: 800;
  line-height: 1.15;
  padding: 6px 10px;
  border-radius: 8px;
}

.fh-main {
  flex: 1;
  padding: 12px 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.fh-card {
  background: var(--card);
  border: 1px solid var(--card-edge);
  border-radius: 16px;
}

/* Hero Section */
.fh-hero {
  padding: 24px 20px;
  text-align: center;
  border-color: #2a4a62;
}

.fh-hero h1 {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 0.3px;
}

.fh-hero p {
  margin: 6px 0 18px;
  font-size: 13px;
  color: var(--muted);
}

.fh-cta {
  width: 100%;
  max-width: 400px;
  border: 0;
  border-radius: 10px;
  padding: 14px;
  background: var(--cyan);
  color: #06202a;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.5px;
  cursor: pointer;
  margin: 0 auto;
  display: block;
}

.fh-cta:hover { filter: brightness(1.08); }

/* Layout Grids */
.fh-layout-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.fh-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.fh-tile {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 140px;
}

.fh-orange { border-color: var(--orange); box-shadow: 0 0 0 1px rgba(255,157,46,.25) inset; }
.fh-teal { border-color: var(--teal); box-shadow: 0 0 0 1px rgba(31,191,184,.2) inset; }

.fh-label { font-size: 11px; color: var(--muted); letter-spacing: 0.3px; }
.fh-row { display: flex; justify-content: space-between; align-items: center; }
.fh-big { font-size: 32px; font-weight: 700; line-height: 1.1; }
.fh-unit { font-size: 11px; color: var(--orange); letter-spacing: 0.3px; }

.fh-ask {
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: none;
  border: 0;
  color: var(--text);
  cursor: pointer;
  text-align: left;
  font: inherit;
  font-size: 12px;
  font-weight: 700;
}

.fh-mic {
  flex: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #19b97a;
  display: grid;
  place-items: center;
  box-shadow: 0 0 14px rgba(25,185,122,.45);
}

.fh-guide { display: flex; align-items: center; gap: 10px; margin-top: 4px; }
.fh-guide-count { display: flex; align-items: center; gap: 6px; }
.fh-guide-count strong { font-size: 28px; font-weight: 700; }
.fh-guide-count span { font-size: 10px; font-weight: 600; line-height: 1.15; }

/* Quote Section */
.fh-quote {
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.fh-quote-title { font-size: 11px; color: var(--cyan); letter-spacing: 0.4px; font-weight: 700; }
.fh-quote blockquote { font-size: 14px; line-height: 1.4; font-weight: 500; }
.fh-quote cite { font-size: 12px; color: var(--muted); font-style: normal; margin-top: 4px; }

/* Bottom Nav Bar */
.fh-nav {
  position: sticky;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: #0d1626;
  border-top: 1px solid #1d2b43;
  padding: 10px 16px 14px;
  border-radius: 16px 16px 0 0;
}

.fh-tab {
  background: none;
  border: 0;
  padding: 6px 16px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.fh-tab-label {
  font-size: 10px;
  color: var(--muted);
  font-weight: 600;
}

.fh-tab[aria-current="page"] .fh-tab-label {
  color: var(--cyan);
}

.fh-sep { width: 1px; height: 28px; background: #24334d; }

/* =========================================================
   TABLET & IPAD STYLES (min-width: 640px)
   ========================================================= */
@media (min-width: 640px) {
  .fh-main { padding: 20px; gap: 20px; }
  .fh-hero h1 { font-size: 26px; }
  .fh-grid { gap: 18px; }
  .fh-tile { padding: 20px; min-height: 155px; }
  .fh-big { font-size: 38px; }
  .fh-quote blockquote { font-size: 16px; }
}

/* =========================================================
   LAPTOP & DESKTOP STYLES (min-width: 900px)
   ========================================================= */
@media (min-width: 900px) {
  .fh-screen { padding: 24px 0; }
  .fh-container {
    background: #0b1527;
    border: 1px solid var(--card-edge);
    border-radius: 24px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    min-height: auto;
  }
  
  .fh-layout-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 20px;
    align-items: start;
  }

  .fh-nav {
    border-radius: 0 0 24px 24px;
    padding: 12px 30px;
  }
  
  .fh-tab-label { font-size: 11px; }
}

@media (prefers-reduced-motion: no-preference) {
  .fh-cta, .fh-tab { transition: filter 0.15s, transform 0.1s; }
  .fh-cta:active { transform: scale(0.98); }
}
`;