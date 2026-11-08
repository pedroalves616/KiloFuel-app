# Skill: Clean Mobile Architecture (React Native + Expo)

1. **Domínio Puro (`src/core/domain/`):** Contém apenas interfaces e tipos TypeScript espelhando os contratos da API (`WorkoutPlan`, `ExerciseItem`, `DietPlan`, `Macronutrients`, `MealItem`). Zero imports de `react` ou `react-native`.
2. **Serviços HTTP (`src/core/services/`):** Encapsulam `fetch` nativo com `AbortController` (timeout), URL base via `EXPO_PUBLIC_API_URL` e tratamento de erro estruturado RFC 7807.
3. **Hooks de Apresentação (`src/presentation/hooks/`):** Fornecem dados, estados de `loading`, `refreshing`, `mutating` e ações para as Screens.
