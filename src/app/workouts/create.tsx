import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { WorkoutGoal } from '@/core/domain/workout.types';
import { useWorkouts } from '@/presentation/hooks/useWorkouts';

const GOALS: { value: WorkoutGoal; label: string }[] = [
  { value: 'HYPERTROPHY', label: 'Hipertrofia' },
  { value: 'STRENGTH', label: 'Força' },
  { value: 'ENDURANCE', label: 'Resistência' },
  { value: 'WEIGHT_LOSS', label: 'Perda de Peso' },
];

interface DraftExercise {
  name: string;
  muscleGroup: string;
  sets: string;
  minReps: string;
  maxReps: string;
  targetRpe: string;
  restSeconds: string;
}

export default function CreateWorkoutScreen() {
  const router = useRouter();
  const { createWorkout, mutating } = useWorkouts();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState<WorkoutGoal>('HYPERTROPHY');
  const [weeklyFrequency, setWeeklyFrequency] = useState('4');
  const [exercises, setExercises] = useState<DraftExercise[]>([
    {
      name: 'Supino Reto com Barra',
      muscleGroup: 'CHEST',
      sets: '4',
      minReps: '6',
      maxReps: '8',
      targetRpe: '8.5',
      restSeconds: '180',
    },
  ]);
  const [formError, setFormError] = useState<string | null>(null);

  const handleAddExercise = () => {
    setExercises((prev) => [
      ...prev,
      {
        name: '',
        muscleGroup: 'BACK',
        sets: '3',
        minReps: '8',
        maxReps: '12',
        targetRpe: '8',
        restSeconds: '120',
      },
    ]);
  };

  const handleRemoveExercise = (idx: number) => {
    if (exercises.length <= 1) return;
    setExercises((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateExerciseField = (
    idx: number,
    field: keyof DraftExercise,
    value: string,
  ) => {
    setExercises((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)),
    );
  };

  const handleSubmit = async () => {
    setFormError(null);
    if (name.trim().length < 3) {
      setFormError('O nome do treino deve ter pelo menos 3 caracteres.');
      return;
    }

    try {
      await createWorkout({
        name: name.trim(),
        description: description.trim() || undefined,
        goal,
        weeklyFrequency: Number(weeklyFrequency) || 4,
        exercises: exercises.map((ex) => ({
          name: ex.name.trim(),
          muscleGroup: ex.muscleGroup.trim() || 'GENERAL',
          sets: Number(ex.sets) || 3,
          minReps: Number(ex.minReps) || 8,
          maxReps: Number(ex.maxReps) || 10,
          targetRpe: Number(ex.targetRpe) || 8,
          restSeconds: Number(ex.restSeconds) || 120,
        })),
      });
      router.back();
    } catch (err: unknown) {
      setFormError(
        err instanceof Error ? err.message : 'Falha ao salvar plano de treino.',
      );
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {formError ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{formError}</Text>
        </View>
      ) : null}

      <Text style={styles.label}>Nome do Plano de Treino</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Upper / Lower Hipertrofia"
        placeholderTextColor="#64748b"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Descrição / Observações</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Progressão dupla nas cargas básicas"
        placeholderTextColor="#64748b"
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Objetivo Principal</Text>
      <View style={styles.goalsRow}>
        {GOALS.map((g) => (
          <TouchableOpacity
            key={g.value}
            style={[
              styles.goalChip,
              goal === g.value && styles.goalChipSelected,
            ]}
            onPress={() => setGoal(g.value)}
          >
            <Text
              style={[
                styles.goalChipText,
                goal === g.value && styles.goalChipTextSelected,
              ]}
            >
              {g.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Frequência Semanal (1 a 7 dias)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={weeklyFrequency}
        onChangeText={setWeeklyFrequency}
      />

      <View style={styles.exercisesHeader}>
        <Text style={styles.sectionTitle}>
          Exercícios ({exercises.length})
        </Text>
        <TouchableOpacity style={styles.addExBtn} onPress={handleAddExercise}>
          <Ionicons name="add-circle" size={16} color="#10b981" />
          <Text style={styles.addExBtnText}>Adicionar Exercício</Text>
        </TouchableOpacity>
      </View>

      {exercises.map((ex, idx) => (
        <View key={idx} style={styles.exerciseCard}>
          <View style={styles.exCardHeader}>
            <Text style={styles.exCardTitle}>Exercício #{idx + 1}</Text>
            {exercises.length > 1 && (
              <TouchableOpacity onPress={() => handleRemoveExercise(idx)}>
                <Ionicons name="trash-outline" size={18} color="#fb7185" />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.label}>Nome do Exercício</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Agachamento Livre"
            placeholderTextColor="#64748b"
            value={ex.name}
            onChangeText={(v) => updateExerciseField(idx, 'name', v)}
          />

          <View style={styles.row2}>
            <View style={styles.col}>
              <Text style={styles.label}>Grupo Muscular</Text>
              <TextInput
                style={styles.input}
                placeholder="CHEST / BACK / LEGS"
                placeholderTextColor="#64748b"
                value={ex.muscleGroup}
                onChangeText={(v) => updateExerciseField(idx, 'muscleGroup', v)}
              />
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Séries</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={ex.sets}
                onChangeText={(v) => updateExerciseField(idx, 'sets', v)}
              />
            </View>
          </View>

          <View style={styles.row2}>
            <View style={styles.col}>
              <Text style={styles.label}>Reps Mín</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={ex.minReps}
                onChangeText={(v) => updateExerciseField(idx, 'minReps', v)}
              />
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Reps Máx</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={ex.maxReps}
                onChangeText={(v) => updateExerciseField(idx, 'maxReps', v)}
              />
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>RPE (1-10)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={ex.targetRpe}
                onChangeText={(v) => updateExerciseField(idx, 'targetRpe', v)}
              />
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Descanso (s)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={ex.restSeconds}
                onChangeText={(v) => updateExerciseField(idx, 'restSeconds', v)}
              />
            </View>
          </View>
        </View>
      ))}

      <TouchableOpacity
        style={styles.submitBtn}
        disabled={mutating}
        onPress={() => void handleSubmit()}
      >
        <Text style={styles.submitBtnText}>
          {mutating ? 'Salvando Prescrição...' : 'Salvar Plano de Treino'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  errorBox: {
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
    borderColor: '#f43f5e',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  errorText: {
    color: '#fda4af',
    fontSize: 12,
  },
  label: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#f8fafc',
    fontSize: 14,
    marginBottom: 12,
  },
  goalsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  goalChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  goalChipSelected: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: '#10b981',
  },
  goalChipText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
  },
  goalChipTextSelected: {
    color: '#10b981',
  },
  exercisesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '800',
  },
  addExBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addExBtnText: {
    color: '#10b981',
    fontSize: 13,
    fontWeight: '700',
  },
  exerciseCard: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 12,
  },
  exCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  exCardTitle: {
    color: '#10b981',
    fontSize: 13,
    fontWeight: '800',
  },
  row2: {
    flexDirection: 'row',
    gap: 8,
  },
  col: {
    flex: 1,
  },
  submitBtn: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '800',
  },
});

