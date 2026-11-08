import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { WorkoutCard } from '@/presentation/components/WorkoutCard';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useWorkouts } from '@/presentation/hooks/useWorkouts';

export default function WorkoutsTabScreen() {
  const router = useRouter();
  const { athleteId } = useAuth();
  const {
    workouts,
    loading,
    refreshing,
    mutating,
    error,
    onRefresh,
    toggleWorkoutActive,
  } = useWorkouts(athleteId);

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.title}>Rotinas de Treino</Text>
          <Text style={styles.subtitle}>
            {workouts.length} plano(s) prescrito(s) para {athleteId}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.newBtn}
          onPress={() => router.push('/workouts/create')}
        >
          <Ionicons name="add" size={18} color="#0f172a" />
          <Text style={styles.newBtnText}>Novo Treino</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {loading && !refreshing ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#10b981" />
        </View>
      ) : (
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#10b981"
            />
          }
          renderItem={({ item }) => (
            <WorkoutCard
              workout={item}
              mutating={mutating}
              onToggleActive={(id) => void toggleWorkoutActive(id)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="barbell-outline" size={38} color="#10b981" />
              <Text style={styles.emptyTitle}>
                Nenhum plano de treino cadastrado
              </Text>
              <Text style={styles.emptySub}>
                Toque em &quot;Novo Treino&quot; para prescrever exercícios,
                séries e RPE.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  title: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#10b981',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  newBtnText: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '800',
  },
  errorBanner: {
    margin: 16,
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
    borderWidth: 1,
    borderColor: '#f43f5e',
  },
  errorText: {
    color: '#fda4af',
    fontSize: 12,
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyBox: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    marginTop: 20,
  },
  emptyTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 10,
  },
  emptySub: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
});

