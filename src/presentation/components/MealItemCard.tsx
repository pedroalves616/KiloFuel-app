import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MealItem } from '@/core/domain/diet.types';

export function MealItemCard({ meal }: { meal: MealItem }) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <View style={styles.timeBadge}>
            <Ionicons name="time-outline" size={12} color="#10b981" />
            <Text style={styles.timeText}>{meal.time}</Text>
          </View>
          <Text style={styles.nameText}>{meal.name}</Text>
        </View>

        <View style={styles.calorieBadge}>
          <Ionicons name="flame" size={13} color="#f97316" />
          <Text style={styles.calorieText}>{meal.calories} kcal</Text>
        </View>
      </View>

      <View style={styles.macrosRow}>
        <Text style={styles.macroPill}>
          P:{' '}
          <Text style={{ color: '#10b981', fontWeight: '700' }}>
            {meal.proteinsGrams}g
          </Text>
        </Text>
        <Text style={styles.macroPill}>
          C:{' '}
          <Text style={{ color: '#f97316', fontWeight: '700' }}>
            {meal.carbsGrams}g
          </Text>
        </Text>
        <Text style={styles.macroPill}>
          G:{' '}
          <Text style={{ color: '#38bdf8', fontWeight: '700' }}>
            {meal.fatsGrams}g
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1e293b',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  timeText: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '700',
  },
  nameText: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  calorieBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  calorieText: {
    color: '#f97316',
    fontSize: 12,
    fontWeight: '800',
  },
  macrosRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 8,
  },
  macroPill: {
    color: '#94a3b8',
    fontSize: 12,
  },
});

