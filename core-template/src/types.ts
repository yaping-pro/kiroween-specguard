/**
 * SpecGuard Core Invariant Engine Types
 * Compliant with Kiro EARS Specifications
 */

export interface Invariant<TState, TAction = unknown> {
  id: string;
  name: string;
  description: string;
  severity: "critical" | "warning";
  check: (prevState: TState, nextState: TState, action: TAction) => boolean;
}

export interface InvariantViolation {
  invariantId: string;
  invariantName: string;
  description: string;
  timestamp: number;
}

export interface InvariantReport {
  passed: boolean;
  timestamp: number;
  totalChecked: number;
  violations: InvariantViolation[];
  latencyMs: number;
}

export type Reducer<TState, TAction> = (state: TState, action: TAction) => TState;

export interface StateMachineConfig<TState, TAction> {
  name: string;
  initialState: TState;
  reducer: Reducer<TState, TAction>;
  invariants: Invariant<TState, TAction>[];
}

export interface PbtRunResult {
  suiteName: string;
  totalRuns: number;
  passed: boolean;
  failedRunIndex?: number;
  counterexample?: unknown;
  durationMs: number;
}
