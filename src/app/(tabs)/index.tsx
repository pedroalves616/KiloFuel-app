import React, { useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AddMealModal } from '@/presentation/components/AddMealModal';
import { MacroProgressBar } from '@/presentation/components/MacroProgressBar';
import { WorkoutCard } from '@/presentation/components/WorkoutCard';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useDiets } from '@/presentation/hooks/useDiets';
import { useWorkouts } from '@/presentation/hooks/useWorkouts';

export default function DashboardScreen() {
  const router = useRouter();
  const { athlete, athleteId, logout } = useAuth();
  const {
    activeWorkout,
    loading: loadingWorkouts,
    refreshing: refreshingWorkouts,
    mutating: mutatingWorkouts,
    onRefresh: refreshWorkouts,
    toggleWorkoutActive,
  } = useWorkouts(athleteId);

  const {
    activeDiet,
    loading: loadingDiets,
    refreshing: refreshingDiets,
    mutating: mutatingDiets,
    onRefresh: refreshDiets,
    addMeal,
  } = useDiets(athleteId);

  const [mealModalVisible, setMealModalVisible] = useState(false);

  const isRefreshing = refreshingWorkouts || refreshingDiets;

  const handleRefreshAll = () => {
    refreshWorkouts();
    refreshDiets();
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefreshAll}
          tintColor="#10b981"
        />
      }
    >
      {/* Header do Atleta */}
      <View style={styles.heroCard}>
        <View style={styles.heroLeft}>
          <Text style={styles.badgeText}>KILOFUEL PERFORMANCE</Text>
          <Text style={styles.heroTitle}>
            Olá, {athlete ? athlete.name : 'Atleta'}
          </Text>
          <Text style={styles.heroSub}>ID de Sessão: {athleteId}</Text>
        </View>

        {athlete ? (
          <TouchableOpacity style={styles.authBtn} onPress={logout}>
            <Ionicons name="log-out-outline" size={16} color="#fda4af" />
            <Text style={[styles.authBtnText, { color: '#fda4af' }]}>Sair</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.authBtn}
            onPress={() => router.push('/login')}
          >
            <Ionicons name="person-circle-outline" size={16} color="#10b981" />
            <Text style={styles.authBtnText}>Login</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Card de Calorias & Macros */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Ionicons name="flame" size={18} color="#f97316" />
          <Text style={styles.sectionTitle}>Balanço Calórico & Macros</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/(tabs)/nutrition')}>
          <Text style={styles.linkText}>Ver Dieta →</Text>
        </TouchableOpacity>
      </View>

      {loadingDiets ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color="#10b981" />
        </View>
      ) : activeDiet ? (
        <View style={styles.nutritionCard}>
          <View style={styles.calorieTopRow}>
            <View>
              <Text style={styles.dietName}>{activeDiet.name}</Text>
              <Text style={styles.dietGoal}>{activeDiet.goal}</Text>
            </View>
            <View style={styles.calorieBadge}>
              <Text style={styles.calorieBig}>
                {activeDiet.consumedCalories}
              </Text>
              <Text style={styles.calorieTarget}>
                / {activeDiet.targetCalories} kcal
              </Text>
            </View>
          </View>

          <MacroProgressBar
            label="Energia Diária"
            current={activeDiet.consumedCalories}
            target={activeDiet.targetCalories}
            unit=" kcal"
            color="#f97316"
          />
          <MacroProgressBar
            label="Proteínas"
            current={activeDiet.consumedMacros.proteinsGrams}
            target={activeDiet.targetMacros.proteinsGrams}
            color="#10b981"
          />
          <MacroProgressBar
            label="Carboidratos"
            current={activeDiet.consumedMacros.carbsGrams}
            target={activeDiet.targetMacros.carbsGrams}
            color="#f97316"
          />
          <MacroProgressBar
            label="Gorduras"
            current={activeDiet.consumedMacros.fatsGrams}
            target={activeDiet.targetMacros.fatsGrams}
            color="#38bdf8"
          />

          <TouchableOpacity
            style={styles.quickMealBtn}
            onPress={() => setMealModalVisible(true)}
          >
            <Ionicons name="add-circle-outline" size={18} color="#0f172a" />
            <Text style={styles.quickMealBtnText}>
              Registrar Refeição Rápida
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Nenhuma meta nutricional ativa</Text>
          <Text style={styles.emptySub}>
            Crie um plano alimentar para rastrear calorias e macronutrientes.
          </Text>
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: '#f97316' }]}
            onPress={() => router.push('/nutrition/create')}
          >
            <Text style={styles.primaryBtnText}>Criar Plano Alimentar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Card do Treino Ativo do Dia */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Ionicons name="barbell" size={18} color="#10b981" />
          <Text style={styles.sectionTitle}>Treino Ativo do Dia</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/(tabs)/workouts')}>
          <Text style={styles.linkText}>Todos os Treinos →</Text>
        </TouchableOpacity>
      </View>

      {loadingWorkouts ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color="#10b981" />
        </View>
      ) : activeWorkout ? (
        <WorkoutCard
          workout={activeWorkout}
          mutating={mutatingWorkouts}
          onToggleActive={(id) => void toggleWorkoutActive(id)}
        />
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Nenhum treino ativo selecionado</Text>
          <Text style={styles.emptySub}>
            Prescreva uma nova rotina de treino ou ative um plano existente.
          </Text>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => router.push('/workouts/create')}
          >
            <Text style={styles.primaryBtnText}>Prescrever Novo Treino</Text>
          </TouchableOpacity>
        </View>
      )}

      {activeDiet && (
        <AddMealModal
          visible={mealModalVisible}
          onClose={() => setMealModalVisible(false)}
          mutating={mutatingDiets}
          onSubmit={(meal) => addMeal(activeDiet.id, meal)}
        />
      )}
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
    paddingBottom: 36,
  },
  heroCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  heroLeft: {
    flex: 1,
  },
  badgeText: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  heroTitle: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 2,
  },
  heroSub: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  authBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  authBtnText: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '800',
  },
  linkText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '700',
  },
  loadingBox: {
    padding: 28,
    alignItems: 'center',
  },
  nutritionCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 20,
  },
  calorieTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  dietName: {
    color: '#f8fafc',
    fontSize: 17,
    fontWeight: '800',
  },
  dietGoal: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  calorieBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.4)',
  },
  calorieBig: {
    color: '#f97316',
    fontSize: 18,
    fontWeight: '800',
  },
  calorieTarget: {
    color: '#94a3b8',
    fontSize: 12,
    marginLeft: 4,
  },
  quickMealBtn: {
    marginTop: 6,
    backgroundColor: '#f97316',
    borderRadius: 12,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  quickMealBtnText: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '800',
  },
  emptyCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#334155',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '800',
  },
  emptySub: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 14,
  },
  primaryBtn: {
    backgroundColor: '#10b981',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  primaryBtnText: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '800',
  },
});

