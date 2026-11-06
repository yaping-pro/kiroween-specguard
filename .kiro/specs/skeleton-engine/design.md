# Design: SpecGuard Core Invariant Engine

## 1. Type Interfaces
```typescript
export interface Invariant<TState> {
  id: string;
  description: string;
  assert: (prev: TState, next: TState, action?: unknown) => boolean;
}

export interface InvariantReport {
  timestamp: number;
  totalChecks: number;
  passed: boolean;
  violations: string[];
  executionTimeMs: number;
}

export interface StateMachine<TState, TAction> {
  getState: () => TState;
  dispatch: (action: TAction) => { state: TState; report: InvariantReport };
  registerInvariant: (invariant: Invariant<TState>) => void;
  runPropertyTest: (runs?: number) => Promise<{ success: boolean; runs: number; counterexample?: unknown }>;
}
```

## 2. Fast-Check Integration
The engine encapsulates `fc.assert(fc.property(...))` into an in-memory execution loop that can run both in Node/Bun unit test suites and client-side browser Web Workers.
