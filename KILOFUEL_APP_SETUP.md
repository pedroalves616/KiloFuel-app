# Especificação de Arquitetura & Agentes: KiloFuel-app (React Native + Expo)

## 1. Diretório Alvo e Isolamento
1. O aplicativo mobile deve ser criado em um novo diretório chamado `KiloFuel-app` na raiz do workspace (totalmente isolado do `package.json` do backend NestJS).
2. Deve conter sua própria governança em `KiloFuel-app/.agents/` e `KiloFuel-app/.skills/` voltadas para Clean Mobile Architecture com React Native.
3. Configuração de Rede / API:
   - Variável `EXPO_PUBLIC_API_URL` configurável (padrão `http://localhost:3000` para iOS Simulator/Web e suporte a IP local ou `http://10.0.2.2:3000` para Android Emulator).
4. **Requisito prévio no Backend NestJS:**
   - Garantir que `app.enableCors()` esteja ativo no `src/main.ts`.
   - Garantir que o Módulo de Nutrição/Dieta (`POST /diets`, `GET /diets/user/:userId`, `POST /diets/:id/meals`) e a rota `PATCH /workouts/:id/toggle-active` estejam implementados na API antes de conectar as telas correspondentes.

## 2. Stack e Arquitetura (Clean Mobile Architecture)
- **Framework:** React Native com Expo SDK + **Expo Router** (roteamento file-based em `src/app/`) + TypeScript estrito (`strict: true`).
- **UI & Estilização:** `StyleSheet` nativo padronizado (ou NativeWind) + `@expo/vector-icons` (Tema Dark Mode esportivo: fundo `#0f172a`, cards `#1e293b`, verde neon `#10b981` para metas/séries concluídas e laranja `#f97316` para calorias).
- **Camadas (`KiloFuel-app/src/`):**
  - `core/domain/`: Interfaces e tipos puros espelhando os contratos da API (`WorkoutPlan`, `ExerciseItem`, `WorkoutGoal`, `DietPlan`, `Macronutrients`, `MealItem`). Zero imports de `react-native` aqui.
  - `core/services/`: Clientes HTTP (`WorkoutApiService`, `DietApiService`) encapsulando `fetch` nativo com timeout e tratamento de erros RFC 7807 da API. **Proibido** fazer chamadas `fetch` direto dentro de Screens ou Componentes.
  - `presentation/hooks/`: Custom hooks (`useWorkouts`, `useDiets`) gerenciando estado, loading, pull-to-refresh e mutações.
  - `presentation/components/`: Componentes visuais reutilizáveis e tipados (`WorkoutCard`, `ExerciseRow`, `MacroProgressBar`, `MealItemCard`).
  - `app/`: Rotas do Expo Router com Bottom Tabs (`(tabs)/index.tsx` para Dashboard, `(tabs)/workouts.tsx` para Treinos, `(tabs)/nutrition.tsx` para Dieta, mais modais/telas de criação).
0
## 3. Escopo de Funcionalidades Mobile (Conectadas à API Real)
- **Tab 1 — Dashboard (`(tabs)/index.tsx`):**
  - Resumo diário do atleta (`userId` configurável/fixo em constante de sessão para testes).
  - Card de destaque do Treino Ativo do dia e barra rápida de Calorias Consumidas vs. Meta Diária + divisão de Proteínas, Carboidratos e Gorduras.
- **Tab 2 — Treinos (`(tabs)/workouts.tsx` & `workouts/create.tsx`):**
  - Listagem com `FlatList` e `RefreshControl` (pull-to-refresh) consumindo `GET /workouts/user/:userId`.
  - Badge visual do objetivo (`HYPERTROPHY`, `STRENGTH`, `ENDURANCE`, `WEIGHT_LOSS`) e Switch/Botão para ativar/desativar o plano (`PATCH /workouts/:id/toggle-active`).
  - Tela/Modal de criação (`POST /workouts`) permitindo adicionar múltiplos exercícios dinamicamente (nome, séries, repetições e descanso em segundos).
- **Tab 3 — Nutrição (`(tabs)/nutrition.tsx` & `nutrition/create.tsx`):**
  - Consumo de `GET /diets/user/:userId` exibindo o balanço calórico e barras visuais de progresso dos 3 macronutrientes (`Proteínas`, `Carboidratos`, `Gorduras`).
  - Modal/BottomSheet rápido para "Registrar Refeição" (`POST /diets/:id/meals`) atualizando os macros restantes instantaneamente.
  - Formulário para criar novo plano alimentar (`POST /diets`).

## 4. Esteira de Execução dos Agentes (4 Etapas)
- **Etapa 1 (Backend Sync + Core Mobile):** Verificar/completar endpoints pendentes de Dieta e CORS no backend NestJS; inicializar o projeto Expo em `KiloFuel-app`; criar `.agents/` e `.skills/` locais; implementar `src/core/domain` e `src/core/services`.
- **Etapa 2 (Módulo Mobile de Treinos):** Implementar `useWorkouts`, componentes de treino e telas de listagem/criação conectadas à API.
- **Etapa 3 (Módulo Mobile de Nutrição):** Implementar `useDiets`, barras de progresso de macros, listagem de refeições e modal de adição de refeição.
- **Etapa 4 (Dashboard & Validação Strict):** Construir a Tab principal de Dashboard, rodar `npx tsc --noEmit` no `KiloFuel-app` garantindo zero erros de tipagem e fornecer o guia de execução simultânea.
