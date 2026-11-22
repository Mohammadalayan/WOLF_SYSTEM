import React, { useState } from "react";
import { supabase } from "./supabase.js";
import "./ProfileSetup.css";
/* ---------- Icons ---------- */
const Logo = () => (
  <svg width="34" height="34" viewBox="0 0 48 48" aria-hidden="true">
    <defs>
      <linearGradient id="auth-logo-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6ff7ff" />
        <stop offset="100%" stopColor="#8b7cf6" />
      </linearGradient>
    </defs>
    <path d="M6 5 19 13h10L42 5l-3 19-8 16H17L9 24Z" fill="url(#auth-logo-grad)" />
    <path d="m15 24 6 2.4M33 24l-6 2.4" stroke="#0a1322" strokeWidth="2.6" strokeLinecap="round" />
    <path d="M22 34h4l-2 3.4Z" fill="#0a1322" />
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="10" width="16" height="11" rx="3" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);

const EyeIcon = ({ off }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
    {off && <path d="M4 4l16 16" />}
  </svg>
);

const DumbbellIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 10v4M5 7v10M19 7v10M22 10v4M5 12h14M8 9v6M16 9v6" />
  </svg>
);

const FlameIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2c1 3-1 4.5-2.5 6.5C8 10.5 7 12 7 14.5A5 5 0 0 0 12 20a5 5 0 0 0 5-5c0-2-1-3.2-2-4.5-.4 1.2-1.1 1.8-1.8 2C13.6 9.5 13.5 5 12 2z" />
  </svg>
);

const BodyIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="5" r="2.6" />
    <path d="M6 22v-7l-2-4 4-2h8l4 2-2 4v7M9 22v-5M15 22v-5" />
  </svg>
);

/* ---------- Design helper: password strength (display only) ---------- */
function getStrength(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 6) score = 1;
  if (pw.length >= 8 && /[A-Za-z]/.test(pw) && /\d/.test(pw)) score = 2;
  if (pw.length >= 12 && /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score = 3;
  return score;
}
const STRENGTH_LABEL = ["Too short", "Weak", "Good", "Strong"];

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);          // design: red or green message
  const [showPassword, setShowPassword] = useState(false); // design: eye button

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        setMessage("Login successful!");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        setMessage(
          data.session
            ? "Account created successfully!"
            : "Check your email to confirm your account."
        );
      }
    } catch (error) {
      setMessage(error.message);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  // Switch between Login and Sign up (clears the message)
  const switchMode = (login) => {
    setIsLogin(login);
    setMessage("");
    setIsError(false);
  };

  const strength = getStrength(password);

  return (
    <div className="auth-container">
      <div className="auth-layout">

        {/* Brand side (laptops only) */}
        <aside className="auth-brand">
          <h2 className="auth-brand-title">
            Train hard.<br />
            <span>Track everything.</span>
          </h2>
          <p className="auth-brand-text">
            Your workouts, calories and body stats in one place.
          </p>

          <ul className="auth-features">
            <li>
              <span className="auth-feature-icon"><DumbbellIcon /></span>
              <span>
                <strong>Workout tracker</strong>
                Log every set and watch your total volume grow.
              </span>
            </li>
            <li>
              <span className="auth-feature-icon auth-feature-orange"><FlameIcon /></span>
              <span>
                <strong>Food tracker</strong>
                Calories and macros, day by day.
              </span>
            </li>
            <li>
              <span className="auth-feature-icon auth-feature-purple"><BodyIcon /></span>
              <span>
                <strong>Body metrics</strong>
                BMI, BMR and your daily calorie target.
              </span>
            </li>
          </ul>
        </aside>

        {/* Form card */}
        <form onSubmit={handleAuth} className="auth-card" aria-busy={loading}>
          <div className="auth-logo">
            <Logo />
            <h1>WOLF</h1>
          </div>

          {/* Login / Sign up switch */}
          <div className="auth-tabs" role="group" aria-label="Login or sign up">
            <button
              type="button"
              className={isLogin ? "is-active" : ""}
              aria-pressed={isLogin}
              onClick={() => switchMode(true)}
            >
              Login
            </button>
            <button
              type="button"
              className={!isLogin ? "is-active" : ""}
              aria-pressed={!isLogin}
              onClick={() => switchMode(false)}
            >
              Sign up
            </button>
          </div>

          <div className="auth-heading">
            <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
            <p>
              {isLogin
                ? "Log in to continue your training."
                : "Start tracking your progress today."}
            </p>
          </div>

          {/* Email */}
          <div className="auth-field">
            <label htmlFor="auth-email">Email Address</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon"><MailIcon /></span>
              <input
                id="auth-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="name@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="auth-field">
            <label htmlFor="auth-password">Password</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon"><LockIcon /></span>
              <input
                id="auth-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete={isLogin ? "current-password" : "new-password"}
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
              <button
                type="button"
                className="auth-eye"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                <EyeIcon off={showPassword} />
              </button>
            </div>

            {/* Strength meter: sign up only */}
            {!isLogin && password && (
              <div className="auth-strength" data-level={strength}>
                <div className="auth-strength-bars" aria-hidden="true">
                  <i /><i /><i />
                </div>
                <span>{STRENGTH_LABEL[strength]}</span>
              </div>
            )}
          </div>

          {/* Message (red = error, green = success) */}
          {message && (
            <p
              className={"auth-message " + (isError ? "is-error" : "is-success")}
              role={isError ? "alert" : "status"}
            >
              {message}
            </p>
          )}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading && <span className="auth-spinner" aria-hidden="true" />}
            {loading
              ? "Please wait..."
              : isLogin
              ? "LOGIN"
              : "SIGN UP"}
          </button>

          <p className="auth-switch">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button type="button" onClick={() => switchMode(!isLogin)}>
              {isLogin ? " Sign Up" : " Login"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}