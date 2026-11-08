import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MacroProgressBarProps {
  label: string;
  current: number;
  target: number;
  unit?: string;
  color: string;
}

export function MacroProgressBar({
  label,
  current,
  target,
  unit = 'g',
  color,
}: MacroProgressBarProps) {
  const pct = Math.min(100, Math.round((current / Math.max(1, target)) * 100));

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.labelText}>{label}</Text>
        <Text style={styles.valueText}>
          <Text style={[styles.currentValue, { color }]}>{current}</Text> /{' '}
          {target}
          {unit} ({pct}%)
        </Text>
      </View>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            {
              width: `${pct}%`,
              backgroundColor: pct >= 100 ? '#10b981' : color,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  labelText: {
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: '700',
  },
  valueText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  currentValue: {
    fontWeight: '800',
  },
  track: {
    height: 10,
    backgroundColor: '#0f172a',
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});

