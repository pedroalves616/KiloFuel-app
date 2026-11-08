# KiloFuel Mobile App (React Native + Expo Router)

Aplicativo Mobile oficial do ecossistema **KiloFuel**, construído com **React Native**, **Expo SDK**, **Expo Router** e **Clean Mobile Architecture** em TypeScript estrito (`strict: true`).

---

## Arquitetura de Camadas (`src/`)

- **`src/core/domain/`**: Interfaces e contratos puros (`WorkoutPlan`, `ExerciseItem`, `WorkoutGoal`, `DietPlan`, `Macronutrients`, `MealItem`, `AuthSession`). Zero imports de `react-native`.
- **`src/core/services/`**: Clientes HTTP (`HttpClient`, `WorkoutApiService`, `DietApiService`, `AuthApiService`) encapsulando `fetch` nativo com timeout (`AbortController`) e tratamento de erro estruturado RFC 7807.
- **`src/presentation/hooks/`**: Custom hooks (`useWorkouts`, `useDiets`, `useAuth`) isolando estado, loading, pull-to-refresh (`RefreshControl`) e mutações.
- **`src/presentation/components/`**: Componentes visuais reutilizáveis com `StyleSheet` nativo (`WorkoutCard`, `ExerciseRow`, `MacroProgressBar`, `MealItemCard`, `AddMealModal`).
- **`src/app/`**: Rotas do **Expo Router** com Bottom Tabs (`(tabs)/index.tsx`, `(tabs)/workouts.tsx`, `(tabs)/nutrition.tsx`) e telas modais (`workouts/create.tsx`, `nutrition/create.tsx`, `login.tsx`).

---

## Como Executar Simultaneamente com a API

### 1. Backend (`KiloFuel` na porta `3000`)

```bash
cd /Users/pedroalves/myprojects/KiloFuel
docker compose up -d postgres
npm run db:migrate
npm run start:dev
```

### 2. App Mobile (`KiloFuel-app`)

Em outro terminal:

```bash
cd /Users/pedroalves/myprojects/KiloFuel-app
npm start
```

Atalhos no terminal do Expo:
- Pressione **`i`** para abrir no **iOS Simulator**
- Pressione **`a`** para abrir no **Android Emulator** (se usar emulador Android, ajuste `EXPO_PUBLIC_API_URL=http://10.0.2.2:3000` no `.env`)
- Pressione **`w`** para abrir no navegador (`npm run web`)
- Ou escaneie o QR Code no aplicativo **Expo Go** (usando o IP da sua rede local em `EXPO_PUBLIC_API_URL=http://SEU_IP_LOCAL:3000`)

### 3. Validação de Tipagem Estrita

```bash
npx tsc --noEmit
```

