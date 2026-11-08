import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WorkoutGoal, WorkoutPlan } from '@/core/domain/workout.types';
import { ExerciseRow } from './ExerciseRow';

const GOAL_LABELS: Record<WorkoutGoal, { label: string; color: string }> = {
  HYPERTROPHY: { label: 'HIPERTROFIA', color: '#10b981' },
  STRENGTH: { label: 'FORÇA PURA', color: '#f97316' },
  ENDURANCE: { label: 'RESISTÊNCIA', color: '#38bdf8' },
  WEIGHT_LOSS: { label: 'PERDA DE PESO', color: '#fb7185' },
  FAT_LOSS: { label: 'QUEIMA DE GORDURA', color: '#fb7185' },
  GENERAL_FITNESS: { label: 'CONDICIONAMENTO', color: '#a78bfa' },
};

interface WorkoutCardProps {
  workout: WorkoutPlan;
  onToggleActive?: (id: string) => void;
  mutating?: boolean;
}

export function WorkoutCard({
  workout,
  onToggleActive,
  mutating = false,
}: WorkoutCardProps) {
  const goalInfo = GOAL_LABELS[workout.goal] ?? {
    label: workout.goal,
    color: '#10b981',
  };

  return (
    <View style={[styles.card, workout.isActive && styles.cardActive]}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.badgesRow}>
            <View style={[styles.goalBadge, { borderColor: goalInfo.color }]}>
              <Text style={[styles.goalText, { color: goalInfo.color }]}>
                {goalInfo.label}
              </Text>
            </View>
            {workout.isActive && (
              <View style={styles.activeBadge}>
                <Ionicons name="checkmark-circle" size={12} color="#0f172a" />
                <Text style={styles.activeBadgeText}>ATIVO</Text>
              </View>
            )}
          </View>
          <Text style={styles.title}>{workout.name}</Text>
          {workout.description ? (
            <Text style={styles.description}>{workout.description}</Text>
          ) : null}
        </View>

        {onToggleActive && (
          <View style={styles.switchBox}>
            <Switch
              value={workout.isActive}
              disabled={mutating}
              onValueChange={() => onToggleActive(workout.id)}
              trackColor={{ false: '#334155', true: '#10b981' }}
              thumbColor="#f8fafc"
            />
            <TouchableOpacity
              disabled={mutating}
              onPress={() => onToggleActive(workout.id)}
            >
              <Text style={styles.switchLabel}>
                {workout.isActive ? 'Ativo' : 'Ativar'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Frequência</Text>
          <Text style={styles.statValue}>{workout.weeklyFrequency}x/sem</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Volume Total</Text>
          <Text style={styles.statValue}>
            {workout.totalWorkingSets} séries
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>RPE Médio</Text>
          <Text style={[styles.statValue, { color: '#f97316' }]}>
            {workout.averageTargetRpe}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        Exercícios ({workout.exercises.length})
      </Text>
      {workout.exercises.map((exercise, idx) => (
        <ExerciseRow key={`${exercise.name}-${idx}`} exercise={exercise} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  cardActive: {
    borderColor: '#10b981',
    borderWidth: 1.5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  headerLeft: {
    flex: 1,
    paddingRight: 12,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  goalBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
  },
  goalText: {
    fontSize: 10,
    fontWeight: '800',
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#10b981',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  activeBadgeText: {
    color: '#0f172a',
    fontSize: 10,
    fontWeight: '800',
  },
  title: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '800',
  },
  description: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 4,
  },
  switchBox: {
    alignItems: 'center',
  },
  switchLabel: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 11,
  },
  statValue: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2,
  },
  sectionTitle: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
});

