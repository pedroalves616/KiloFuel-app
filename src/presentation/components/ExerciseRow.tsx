import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ExerciseItem } from '@/core/domain/workout.types';

export function ExerciseRow({ exercise }: { exercise: ExerciseItem }) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.muscleBadge}>
          <Text style={styles.muscleText}>{exercise.muscleGroup}</Text>
        </View>
        <Text style={styles.nameText}>{exercise.name}</Text>
      </View>

      {exercise.notes ? (
        <Text style={styles.notesText}>Obs: {exercise.notes}</Text>
      ) : null}

      <View style={styles.metricsRow}>
        <View style={styles.pillNeutral}>
          <Text style={styles.pillNeutralText}>
            {exercise.sets}x {exercise.minReps}-{exercise.maxReps} reps
          </Text>
        </View>

        <View style={styles.pillOrange}>
          <Text style={styles.pillOrangeText}>
            RPE {exercise.targetRpe}
            {exercise.estimatedRepsInReserve !== undefined
              ? ` (${exercise.estimatedRepsInReserve} RIR)`
              : ''}
          </Text>
        </View>

        <View style={styles.restContainer}>
          <Ionicons name="time-outline" size={13} color="#94a3b8" />
          <Text style={styles.restText}>{exercise.restSeconds}s</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  muscleBadge: {
    backgroundColor: '#1e293b',
    borderColor: '#10b981',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  muscleText: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '700',
  },
  nameText: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  notesText: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 4,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  pillNeutral: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  pillNeutralText: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '600',
  },
  pillOrange: {
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
    borderColor: 'rgba(249, 115, 22, 0.4)',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  pillOrangeText: {
    color: '#f97316',
    fontSize: 12,
    fontWeight: '700',
  },
  restContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  restText: {
    color: '#94a3b8',
    fontSize: 12,
  },
});

