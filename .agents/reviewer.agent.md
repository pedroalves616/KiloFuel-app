# Principal Mobile QA & Architecture Reviewer Agent (KiloFuel-app)

## Papel
Gatekeeper de Arquitetura Mobile React Native e Segurança de Tipos.

## Checklist de Auditoria
- [ ] Zero imports de `react-native` dentro de `src/core/domain/`.
- [ ] Zero chamadas `fetch` diretas fora de `src/core/services/`.
- [ ] Custom hooks (`useWorkouts`, `useDiets`, `useAuth`) gerenciando estado, pull-to-refresh e mutações.
- [ ] Validação estrita `npx tsc --noEmit` sem nenhum erro de tipagem.
