
const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  high: 1.725,
  very_high: 1.9,
};

export function calculateFitnessMetrics(profile) {
  if (!profile) return null;

  const age = Number(profile.age);
  const height = Number(profile.height_cm);
  const weight = Number(profile.weight_kg);

  if (
    !Number.isFinite(age) ||
    !Number.isFinite(height) ||
    !Number.isFinite(weight) ||
    age <= 0 ||
    height <= 0 ||
    weight <= 0
  ) {
    return null;
  }

  // BMI
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters ** 2);

  let bmiCategory = "Unknown";

  if (bmi < 18.5) bmiCategory = "Underweight";
  else if (bmi < 25) bmiCategory = "Normal";
  else if (bmi < 30) bmiCategory = "Overweight";
  else bmiCategory = "Obesity";

  // Mifflin-St Jeor equation
  let bmr = null;

  if (profile.sex === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else if (profile.sex === "female") {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  const activityMultiplier =
    ACTIVITY_MULTIPLIERS[profile.activity_level];

  const tdee =
    bmr !== null && activityMultiplier
      ? Math.round(bmr * activityMultiplier)
      : null;

  // Daily calorie target based on fitness goal
  let calorieAdjustment = 0;

  switch (profile.goal) {
    case "fat_loss":
      calorieAdjustment = -400;
      break;

    case "muscle_building":
      calorieAdjustment = 250;
      break;

    case "recomposition":
    case "strength":
    case "general_fitness":
      calorieAdjustment = 0;
      break;

    default:
      calorieAdjustment = 0;
  }

  // Avoid adult calorie recommendations for users under 18
  const calorieTarget =
    age >= 18 && tdee !== null
      ? Math.round(tdee + calorieAdjustment)
      : null;

  return {
    bmi: Number(bmi.toFixed(1)),
    bmiCategory,
    bmr: bmr !== null ? Math.round(bmr) : null,
    tdee,
    calorieTarget,
    bodyFat: profile.body_fat_percent
      ? Number(profile.body_fat_percent)
      : null,
  };
}
