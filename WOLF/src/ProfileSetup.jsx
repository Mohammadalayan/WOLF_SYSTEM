
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabase.js";
import "./profile-setup.css";
const initialForm = {
  full_name: "",
  age: "",
  sex: "",
  height_cm: "",
  weight_kg: "",
  target_weight_kg: "",
  body_fat_percent: "",
  goal: "",
  experience: "",
  activity_level: "",
  training_days_per_week: "3",
  equipment: "Full Gym",
};

const goals = [
  ["muscle_building", "Muscle Building"],
  ["fat_loss", "Fat Loss"],
  ["recomposition", "Body Recomposition"],
  ["strength", "Strength"],
  ["general_fitness", "General Fitness"],
];

const experienceLevels = [
  ["beginner", "Beginner"],
  ["intermediate", "Intermediate"],
  ["advanced", "Advanced"],
];

const activityLevels = [
  ["sedentary", "Sedentary", "Little or no exercise"],
  ["light", "Light", "Exercise 1–3 days/week"],
  ["moderate", "Moderate", "Exercise 3–5 days/week"],
  ["high", "High", "Exercise 6–7 days/week"],
  ["very_high", "Very High", "Hard training or physical job"],
];

export default function ProfileSetup() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError || !authData?.user) {
        navigate("/auth");
        return;
      }

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", authData.user.id)
        .maybeSingle();

      if (profileError) {
        setError(profileError.message);
      } else if (data) {
        setForm({
          ...initialForm,
          ...Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
              key,
              value == null ? "" : String(value),
            ])
          ),
        });
      }

      setLoading(false);
    }

    loadProfile();
  }, [navigate]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const age = Number(form.age);
    const height = Number(form.height_cm);
    const weight = Number(form.weight_kg);
    const targetWeight = form.target_weight_kg
      ? Number(form.target_weight_kg)
      : null;
    const bodyFat = form.body_fat_percent
      ? Number(form.body_fat_percent)
      : null;

    if (
      !form.full_name.trim() ||
      !form.sex ||
      !form.goal ||
      !form.experience ||
      !form.activity_level
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (
      !Number.isFinite(age) || age < 16 || age > 100 ||
      !Number.isFinite(height) || height < 100 || height > 250 ||
      !Number.isFinite(weight) || weight < 30 || weight > 350
    ) {
      setError("Please check your age, height and weight.");
      return;
    }

    if (
      targetWeight !== null &&
      (!Number.isFinite(targetWeight) || targetWeight < 30 || targetWeight > 350)
    ) {
      setError("Please enter a valid target weight.");
      return;
    }

    if (
      bodyFat !== null &&
      (!Number.isFinite(bodyFat) || bodyFat < 2 || bodyFat > 70)
    ) {
      setError("Body fat must be between 2% and 70%.");
      return;
    }

    const { data: authData, error: authError } =
      await supabase.auth.getUser();

    if (authError || !authData?.user) {
      navigate("/auth");
      return;
    }

    setSaving(true);

    const profileData = {
      user_id: authData.user.id,
      full_name: form.full_name.trim(),
      age,
      sex: form.sex,
      height_cm: height,
      weight_kg: weight,
      target_weight_kg: targetWeight,
      body_fat_percent: bodyFat,
      goal: form.goal,
      experience: form.experience,
      activity_level: form.activity_level,
      training_days_per_week: Number(form.training_days_per_week),
      equipment: form.equipment,
      updated_at: new Date().toISOString(),
    };
const { data: savedProfile, error: saveError } = await supabase
  .from("profiles")
  .upsert(profileData, { onConflict: "user_id" })
  .select()
  .single();

setSaving(false);

if (saveError) {
  console.error("PROFILE SAVE ERROR:", saveError);
  setError(saveError.message);
  return;
}

console.log("PROFILE SAVED:", savedProfile);
setSuccess("Your profile has been saved!");

navigate("/");

    setSaving(false);

    if (saveError) {
      setError(saveError.message);
      return;
    }

    setSuccess("Your profile has been saved!");

    // بعد حفظ البيانات، ننتقل للـ Dashboard
    navigate("/");
  }

  if (loading) {
    return (
      <div className="ps-root">
        <div className="ps-loading">LOADING WOLF PROFILE...</div>
      </div>
    );
  }

  return (
    <div className="ps-root">
      <div className="ps-container">

        <header className="ps-header">
          <div className="ps-logo">WOLF<span>.</span></div>
          <span className="ps-step">PERSONAL SETUP · 01</span>
        </header>

        <div className="ps-intro">
          <span className="ps-eyebrow">BUILD YOUR PROFILE</span>
          <h1>KNOW YOUR BODY.<br /><span>BUILD YOUR PLAN.</span></h1>
          <p>
            Tell WOLF about yourself. We'll use your information
            to calculate your body metrics and help build your training plan.
          </p>
        </div>

        <form className="ps-form" onSubmit={handleSubmit}>

          <section className="ps-card">
            <div className="ps-section-heading">
              <span>01</span>
              <div>
                <h2>PERSONAL INFORMATION</h2>
                <p>Let's get to know you.</p>
              </div>
            </div>

            <div className="ps-grid">
              <label className="ps-field ps-full">
                <span>FULL NAME *</span>
                <input
                  name="full_name"
                  value={form.full_name}
                  onChange={updateField}
                  placeholder="Your name"
                  autoComplete="name"
                  required
                />
              </label>

              <label className="ps-field">
                <span>AGE *</span>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={updateField}
                  placeholder="e.g. 25"
                  min="16"
                  max="100"
                  required
                />
              </label>

              <label className="ps-field">
                <span>SEX *</span>
                <select name="sex" value={form.sex} onChange={updateField} required>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </label>
            </div>
          </section>

          <section className="ps-card">
            <div className="ps-section-heading">
              <span>02</span>
              <div>
                <h2>BODY MEASUREMENTS</h2>
                <p>Used for BMI, BMR and TDEE estimates.</p>
              </div>
            </div>

            <div className="ps-grid">
              <label className="ps-field">
                <span>HEIGHT (CM) *</span>
                <input
                  type="number"
                  name="height_cm"
                  value={form.height_cm}
                  onChange={updateField}
                  placeholder="e.g. 175"
                  min="100"
                  max="250"
                  required
                />
              </label>

              <label className="ps-field">
                <span>CURRENT WEIGHT (KG) *</span>
                <input
                  type="number"
                  name="weight_kg"
                  value={form.weight_kg}
                  onChange={updateField}
                  placeholder="e.g. 75"
                  min="30"
                  max="350"
                  step="0.1"
                  required
                />
              </label>

              <label className="ps-field">
                <span>TARGET WEIGHT (KG)</span>
                <input
                  type="number"
                  name="target_weight_kg"
                  value={form.target_weight_kg}
                  onChange={updateField}
                  placeholder="Optional"
                  min="30"
                  max="350"
                  step="0.1"
                />
              </label>

              <label className="ps-field">
                <span>BODY FAT (%)</span>
                <input
                  type="number"
                  name="body_fat_percent"
                  value={form.body_fat_percent}
                  onChange={updateField}
                  placeholder="Optional"
                  min="2"
                  max="70"
                  step="0.1"
                />
              </label>
            </div>
            <p className="ps-note">
              Target weight and body fat are optional. You can add them later.
            </p>
          </section>

          <section className="ps-card">
            <div className="ps-section-heading">
              <span>03</span>
              <div>
                <h2>YOUR FITNESS GOAL</h2>
                <p>What do you want to achieve?</p>
              </div>
            </div>

            <div className="ps-choice-grid">
              {goals.map(([value, label]) => (
                <label
                  className={`ps-choice ${form.goal === value ? "selected" : ""}`}
                  key={value}
                >
                  <input
                    type="radio"
                    name="goal"
                    value={value}
                    checked={form.goal === value}
                    onChange={updateField}
                    required
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="ps-card">
            <div className="ps-section-heading">
              <span>04</span>
              <div>
                <h2>TRAINING EXPERIENCE</h2>
                <p>Choose the level that best describes you.</p>
              </div>
            </div>

            <div className="ps-choice-grid">
              {experienceLevels.map(([value, label]) => (
                <label
                  className={`ps-choice ${form.experience === value ? "selected" : ""}`}
                  key={value}
                >
                  <input
                    type="radio"
                    name="experience"
                    value={value}
                    checked={form.experience === value}
                    onChange={updateField}
                    required
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="ps-card">
            <div className="ps-section-heading">
              <span>05</span>
              <div>
                <h2>DAILY ACTIVITY</h2>
                <p>How active are you outside the gym?</p>
              </div>
            </div>

            <div className="ps-activity-list">
              {activityLevels.map(([value, label, description]) => (
                <label
                  className={`ps-activity ${form.activity_level === value ? "selected" : ""}`}
                  key={value}
                >
                  <input
                    type="radio"
                    name="activity_level"
                    value={value}
                    checked={form.activity_level === value}
                    onChange={updateField}
                    required
                  />
                  <span>
                    <strong>{label}</strong>
                    <small>{description}</small>
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="ps-card">
            <div className="ps-section-heading">
              <span>06</span>
              <div>
                <h2>TRAINING AVAILABILITY</h2>
                <p>We'll use this when building your program.</p>
              </div>
            </div>

            <div className="ps-grid">
              <label className="ps-field">
                <span>DAYS PER WEEK</span>
                <select
                  name="training_days_per_week"
                  value={form.training_days_per_week}
                  onChange={updateField}
                >
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                    <option key={day} value={day}>{day} days</option>
                  ))}
                </select>
              </label>

              <label className="ps-field">
                <span>AVAILABLE EQUIPMENT</span>
                <select
                  name="equipment"
                  value={form.equipment}
                  onChange={updateField}
                >
                  <option value="Full Gym">Full Gym</option>
                  <option value="Dumbbells">Dumbbells</option>
                  <option value="Home Equipment">Home Equipment</option>
                  <option value="Bodyweight Only">Bodyweight Only</option>
                </select>
              </label>
            </div>
          </section>

          {error && <div className="ps-error">{error}</div>}
          {success && <div className="ps-success">{success}</div>}

          <button className="ps-submit" type="submit" disabled={saving}>
            {saving ? "SAVING YOUR PROFILE..." : "SAVE PROFILE & CONTINUE →"}
          </button>

          <p className="ps-footer">
            YOUR DATA IS PRIVATE AND CONNECTED TO YOUR WOLF ACCOUNT.
          </p>

        </form>
      </div>
    </div>
  );
}
