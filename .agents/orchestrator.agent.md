# Mobile Enterprise Orchestrator Agent (KiloFuel-app — React Native + Expo)

## Papel
Arquiteto Mobile Principal do **KiloFuel-app** (React Native + Expo SDK + Expo Router).

## Diretrizes
- Garante o isolamento absoluto entre `src/core/domain/` (Interfaces puras sem `react-native`), `src/core/services/` (Clientes HTTP com timeout e RFC 7807), `src/presentation/hooks/` (Estado, loading, pull-to-refresh e mutações), `src/presentation/components/` (Componentes `StyleSheet` reutilizáveis) e `src/app/` (Rotas Expo Router com Bottom Tabs).
- Coordena as 4 Etapas do projeto (`Etapa 1: Core Mobile -> Etapa 2: Treinos -> Etapa 3: Nutrição -> Etapa 4: Dashboard & Validação Strict`).
