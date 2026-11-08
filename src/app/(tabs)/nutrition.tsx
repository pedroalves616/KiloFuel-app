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
import { MealItemCard } from '@/presentation/components/MealItemCard';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useDiets } from '@/presentation/hooks/useDiets';

export default function NutritionTabScreen() {
  const router = useRouter();
  const { athleteId } = useAuth();
  const {
    activeDiet,
    loading,
    refreshing,
    mutating,
    error,
    onRefresh,
    addMeal,
  } = useDiets(athleteId);

  const [mealModalVisible, setMealModalVisible] = useState(false);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#10b981"
        />
      }
    >
      <View style={styles.topRow}>
        <View>
          <Text style={styles.title}>Plano Nutricional</Text>
          <Text style={styles.subtitle}>
            Controle de Calorias e Macronutrientes
          </Text>
        </View>

        <TouchableOpacity
          style={styles.newPlanBtn}
          onPress={() => router.push('/nutrition/create')}
        >
          <Ionicons name="add" size={18} color="#0f172a" />
          <Text style={styles.newPlanBtnText}>Novo Plano</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {loading && !refreshing ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#f97316" />
        </View>
      ) : activeDiet ? (
        <>
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <View>
                <Text style={styles.planName}>{activeDiet.name}</Text>
                <Text style={styles.goalTag}>{activeDiet.goal}</Text>
              </View>
              <View style={styles.remainingBox}>
                <Text style={styles.remainingLabel}>Restantes</Text>
                <Text style={styles.remainingValue}>
                  {activeDiet.remainingCalories} kcal
                </Text>
              </View>
            </View>

            <MacroProgressBar
              label="Calorias Diárias"
              current={activeDiet.consumedCalories}
              target={activeDiet.targetCalories}
              unit=" kcal"
              color="#f97316"
            />
            <MacroProgressBar
              label="Proteínas (4 kcal/g)"
              current={activeDiet.consumedMacros.proteinsGrams}
              target={activeDiet.targetMacros.proteinsGrams}
              color="#10b981"
            />
            <MacroProgressBar
              label="Carboidratos (4 kcal/g)"
              current={activeDiet.consumedMacros.carbsGrams}
              target={activeDiet.targetMacros.carbsGrams}
              color="#f97316"
            />
            <MacroProgressBar
              label="Gorduras (9 kcal/g)"
              current={activeDiet.consumedMacros.fatsGrams}
              target={activeDiet.targetMacros.fatsGrams}
              color="#38bdf8"
            />

            <TouchableOpacity
              style={styles.addMealBtn}
              onPress={() => setMealModalVisible(true)}
            >
              <Ionicons name="restaurant-outline" size={16} color="#0f172a" />
              <Text style={styles.addMealBtnText}>Registrar Refeição</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.mealsSectionTitle}>
            Refeições do Dia ({activeDiet.meals.length})
          </Text>

          {activeDiet.meals.length === 0 ? (
            <View style={styles.emptyMeals}>
              <Text style={styles.emptyMealsText}>
                Nenhuma refeição registrada ainda hoje.
              </Text>
            </View>
          ) : (
            activeDiet.meals.map((meal) => (
              <MealItemCard key={meal.id} meal={meal} />
            ))
          )}

          <AddMealModal
            visible={mealModalVisible}
            onClose={() => setMealModalVisible(false)}
            mutating={mutating}
            onSubmit={(meal) => addMeal(activeDiet.id, meal)}
          />
        </>
      ) : (
        <View style={styles.emptyBox}>
          <Ionicons name="flame-outline" size={40} color="#f97316" />
          <Text style={styles.emptyTitle}>Nenhum plano alimentar ativo</Text>
          <Text style={styles.emptySub}>
            Defina suas metas de proteínas, carboidratos e gorduras para
            acompanhar sua dieta.
          </Text>
          <TouchableOpacity
            style={styles.newPlanBtn}
            onPress={() => router.push('/nutrition/create')}
          >
            <Text style={styles.newPlanBtnText}>Criar Plano Alimentar</Text>
          </TouchableOpacity>
        </View>
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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  newPlanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f97316',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  newPlanBtnText: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '800',
  },
  errorBox: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
    borderWidth: 1,
    borderColor: '#f43f5e',
    marginBottom: 14,
  },
  errorText: {
    color: '#fda4af',
    fontSize: 12,
  },
  loadingBox: {
    padding: 36,
    alignItems: 'center',
  },
  summaryCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  planName: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '800',
  },
  goalTag: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
  },
  remainingBox: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'flex-end',
  },
  remainingLabel: {
    color: '#94a3b8',
    fontSize: 10,
  },
  remainingValue: {
    color: '#f97316',
    fontSize: 15,
    fontWeight: '800',
  },
  addMealBtn: {
    marginTop: 8,
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  addMealBtnText: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '800',
  },
  mealsSectionTitle: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 10,
  },
  emptyMeals: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  emptyMealsText: {
    color: '#94a3b8',
    fontSize: 13,
  },
  emptyBox: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    marginTop: 20,
    gap: 10,
  },
  emptyTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '800',
  },
  emptySub: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 6,
  },
});

