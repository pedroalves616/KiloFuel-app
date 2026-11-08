export type WorkoutGoal =
  | 'HYPERTROPHY'
  | 'STRENGTH'
  | 'ENDURANCE'
  | 'WEIGHT_LOSS'
  | 'FAT_LOSS'
  | 'GENERAL_FITNESS';

export interface ExerciseItem {
  name: string;
  muscleGroup: string;
  sets: number;
  minReps: number;
  maxReps: number;
  targetRpe: number;
  restSeconds: number;
  notes?: string;
  estimatedRepsInReserve?: number;
  intensityClassification?: string;
}

export interface WorkoutPlan {
  id: string;
  athleteId: string;
  name: string;
  description?: string;
  goal: WorkoutGoal;
  weeklyFrequency: number;
  totalWorkingSets: number;
  averageTargetRpe: number;
  exercises: ExerciseItem[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkoutPlanPayload {
  athleteId: string;
  name: string;
  description?: string;
  goal: WorkoutGoal;
  weeklyFrequency: number;
  exercises: Omit<
    ExerciseItem,
    'estimatedRepsInReserve' | 'intensityClassification'
  >[];
  deactivateExistingPlans?: boolean;
}

