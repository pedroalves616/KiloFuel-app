import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CreateMealPayload } from '@/core/domain/diet.types';

interface AddMealModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (meal: CreateMealPayload) => Promise<unknown>;
  mutating?: boolean;
}

export function AddMealModal({
  visible,
  onClose,
  onSubmit,
  mutating = false,
}: AddMealModalProps) {
  const [name, setName] = useState('');
  const [time, setTime] = useState('12:30');
  const [proteins, setProteins] = useState('40');
  const [carbs, setCarbs] = useState('60');
  const [fats, setFats] = useState('12');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const p = Number(proteins) || 0;
  const c = Number(carbs) || 0;
  const f = Number(fats) || 0;
  const previewCalories = Math.round(p * 4 + c * 4 + f * 9);

  const handleSave = async () => {
    setErrorMsg(null);
    if (name.trim().length < 2) {
      setErrorMsg('Informe o nome da refeição (mínimo 2 caracteres).');
      return;
    }
    try {
      await onSubmit({
        name: name.trim(),
        time: time.trim() || '12:00',
        proteinsGrams: p,
        carbsGrams: c,
        fatsGrams: f,
      });
      setName('');
      onClose();
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Erro ao registrar refeição.',
      );
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Registrar Refeição</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {errorMsg ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null}

          <Text style={styles.label}>Nome da Refeição</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Almoço (Frango + Arroz)"
            placeholderTextColor="#64748b"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Horário (HH:MM)</Text>
          <TextInput
            style={styles.input}
            placeholder="12:30"
            placeholderTextColor="#64748b"
            value={time}
            onChangeText={setTime}
          />

          <View style={styles.row3}>
            <View style={styles.col}>
              <Text style={[styles.label, { color: '#10b981' }]}>
                Proteína (g)
              </Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={proteins}
                onChangeText={setProteins}
              />
            </View>
            <View style={styles.col}>
              <Text style={[styles.label, { color: '#f97316' }]}>
                Carbo (g)
              </Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={carbs}
                onChangeText={setCarbs}
              />
            </View>
            <View style={styles.col}>
              <Text style={[styles.label, { color: '#38bdf8' }]}>
                Gordura (g)
              </Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={fats}
                onChangeText={setFats}
              />
            </View>
          </View>

          <View style={styles.caloriePreview}>
            <Text style={styles.caloriePreviewLabel}>
              Energia Calculada (4P + 4C + 9G):
            </Text>
            <Text style={styles.caloriePreviewValue}>
              {previewCalories} kcal
            </Text>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveBtn}
              disabled={mutating}
              onPress={() => void handleSave()}
            >
              <Text style={styles.saveBtnText}>
                {mutating ? 'Salvando...' : 'Confirmar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(9, 15, 29, 0.85)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#334155',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '800',
  },
  errorBox: {
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
    borderColor: '#f43f5e',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
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
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#f8fafc',
    fontSize: 14,
    marginBottom: 12,
  },
  row3: {
    flexDirection: 'row',
    gap: 10,
  },
  col: {
    flex: 1,
  },
  caloriePreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.4)',
    marginVertical: 8,
  },
  caloriePreviewLabel: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
  },
  caloriePreviewValue: {
    color: '#f97316',
    fontSize: 16,
    fontWeight: '800',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#334155',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#e2e8f0',
    fontWeight: '700',
    fontSize: 14,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#0f172a',
    fontWeight: '800',
    fontSize: 14,
  },
});

