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
import { DietGoal } from '@/core/domain/diet.types';
import { useDiets } from '@/presentation/hooks/useDiets';

const DIET_GOALS: { value: DietGoal; label: string }[] = [
  { value: 'BULKING', label: 'Bulking (Superávit)' },
  { value: 'CUTTING', label: 'Cutting (Déficit)' },
  { value: 'MAINTENANCE', label: 'Manutenção' },
  { value: 'RECOMPOSITION', label: 'Recomposição' },
];

export default function CreateDietScreen() {
  const router = useRouter();
  const { createDiet, mutating } = useDiets();

  const [name, setName] = useState('Dieta Hipertrofia Limpa');
  const [goal, setGoal] = useState<DietGoal>('BULKING');
  const [proteins, setProteins] = useState('180');
  const [carbs, setCarbs] = useState('320');
  const [fats, setFats] = useState('70');
  const [formError, setFormError] = useState<string | null>(null);

  const p = Number(proteins) || 0;
  const c = Number(carbs) || 0;
  const f = Number(fats) || 0;
  const totalCalories = Math.round(p * 4 + c * 4 + f * 9);

  const handleSubmit = async () => {
    setFormError(null);
    if (name.trim().length < 3) {
      setFormError('O nome do plano deve ter pelo menos 3 caracteres.');
      return;
    }

    try {
      await createDiet({
        name: name.trim(),
        goal,
        targetProteinsGrams: p,
        targetCarbsGrams: c,
        targetFatsGrams: f,
      });
      router.back();
    } catch (err: unknown) {
      setFormError(
        err instanceof Error ? err.message : 'Erro ao criar plano alimentar.',
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

      <Text style={styles.label}>Nome do Plano Alimentar</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Ex: Protocolo Cutting 2400 kcal"
        placeholderTextColor="#64748b"
      />

      <Text style={styles.label}>Estratégia Nutricional</Text>
      <View style={styles.goalsRow}>
        {DIET_GOALS.map((g) => (
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

      <Text style={[styles.label, { color: '#10b981' }]}>
        Meta de Proteínas Diárias (g)
      </Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={proteins}
        onChangeText={setProteins}
      />

      <Text style={[styles.label, { color: '#f97316' }]}>
        Meta de Carboidratos Diários (g)
      </Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={carbs}
        onChangeText={setCarbs}
      />

      <Text style={[styles.label, { color: '#38bdf8' }]}>
        Meta de Gorduras Diárias (g)
      </Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={fats}
        onChangeText={setFats}
      />

      <View style={styles.calorieBox}>
        <Text style={styles.calorieLabel}>Meta Calórica Total Calculada:</Text>
        <Text style={styles.calorieValue}>{totalCalories} kcal / dia</Text>
      </View>

      <TouchableOpacity
        style={styles.submitBtn}
        disabled={mutating}
        onPress={() => void handleSubmit()}
      >
        <Text style={styles.submitBtnText}>
          {mutating ? 'Calculando e Salvando...' : 'Criar Plano Alimentar'}
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
    marginBottom: 14,
  },
  goalsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
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
    backgroundColor: 'rgba(249, 115, 22, 0.2)',
    borderColor: '#f97316',
  },
  goalChipText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
  },
  goalChipTextSelected: {
    color: '#f97316',
  },
  calorieBox: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.4)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  calorieLabel: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '700',
  },
  calorieValue: {
    color: '#f97316',
    fontSize: 18,
    fontWeight: '800',
  },
  submitBtn: {
    backgroundColor: '#f97316',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '800',
  },
});

