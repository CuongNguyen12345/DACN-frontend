import { initialExercises } from "./exerciseMockData";

const STORAGE_KEY = "edu4all-admin-exercises";

const canUseLocalStorage = () => typeof window !== "undefined" && window.localStorage;

export function readExercises() {
  if (!canUseLocalStorage()) return initialExercises;

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return initialExercises;

    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : initialExercises;
  } catch {
    return initialExercises;
  }
}

export function writeExercises(exercises) {
  if (!canUseLocalStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(exercises));
}

export function addExercise(exercise) {
  const nextExercises = [exercise, ...readExercises()];
  writeExercises(nextExercises);
  return nextExercises;
}

export function getNextExerciseId(exercises) {
  const nextNumber =
    Math.max(
      0,
      ...exercises.map((exercise) =>
        Number(String(exercise.id).replace(/\D/g, "")) || 0,
      ),
    ) + 1;

  return `EX${String(nextNumber).padStart(2, "0")}`;
}
