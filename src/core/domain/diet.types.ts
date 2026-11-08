export type DietGoal = 'BULKING' | 'CUTTING' | 'MAINTENANCE' | 'RECOMPOSITION';

export interface Macronutrients {
  proteinsGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  calories: number;
}

export interface MealItem {
  id: string;
  name: string;
  time: string;
  proteinsGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  calories: number;
  loggedAt: string;
}

export interface DietPlan {
  id: string;
  athleteId: string;
  name: string;
  goal: DietGoal;
  targetCalories: number;
  targetMacros: Macronutrients;
  consumedCalories: number;
  consumedMacros: Macronutrients;
  remainingCalories: number;
  meals: MealItem[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMealPayload {
  name: string;
  time: string;
  proteinsGrams: number;
  carbsGrams: number;
  fatsGrams: number;
}

export interface CreateDietPlanPayload {
  athleteId: string;
  name: string;
  goal: DietGoal;
  targetProteinsGrams: number;
  targetCarbsGrams: number;
  targetFatsGrams: number;
  meals?: CreateMealPayload[];
  deactivateExistingPlans?: boolean;
}

