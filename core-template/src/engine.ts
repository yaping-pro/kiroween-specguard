import type {
  Invariant,
  InvariantReport,
  InvariantViolation,
  Reducer,
  StateMachineConfig
} from "./types";

export class InvariantEngine<TState, TAction> {
  private state: TState;
  private readonly reducer: Reducer<TState, TAction>;
  private readonly invariants: Map<string, Invariant<TState, TAction>> = new Map();
  private readonly listeners: Array<(state: TState, report: InvariantReport) => void> = [];
  public readonly name: string;
  private history: Array<{ state: TState; action: TAction; report: InvariantReport }> = [];

  constructor(config: StateMachineConfig<TState, TAction>) {
    this.name = config.name;
    this.state = config.initialState;
    this.reducer = config.reducer;
    for (const inv of config.invariants) {
      this.registerInvariant(inv);
    }
  }

  public getState(): TState {
    return this.state;
  }

  public registerInvariant(inv: Invariant<TState, TAction>): void {
    this.invariants.set(inv.id, inv);
  }

  public dispatch(action: TAction): { state: TState; report: InvariantReport } {
    const start = performance.now();
    const prevState = this.state;
    const nextState = this.reducer(prevState, action);
    const violations: InvariantViolation[] = [];

    for (const inv of this.invariants.values()) {
      try {
        const ok = inv.check(prevState, nextState, action);
        if (!ok) {
          violations.push({
            invariantId: inv.id,
            invariantName: inv.name,
            description: inv.description,
            timestamp: Date.now()
          });
        }
      } catch (err) {
        violations.push({
          invariantId: inv.id,
          invariantName: inv.name,
          description: `Invariant check threw exception: ${String(err)}`,
          timestamp: Date.now()
        });
      }
    }

    const report: InvariantReport = {
      passed: violations.length === 0,
      timestamp: Date.now(),
      totalChecked: this.invariants.size,
      violations,
      latencyMs: Number((performance.now() - start).toFixed(3))
    };

    if (report.passed) {
      this.state = nextState;
    }

    this.history.push({ state: this.state, action, report });
    if (this.history.length > 100) this.history.shift();

    for (const listener of this.listeners) {
      listener(this.state, report);
    }

    return { state: this.state, report };
  }

  public subscribe(fn: (state: TState, report: InvariantReport) => void): () => void {
    this.listeners.push(fn);
    return () => {
      const idx = this.listeners.indexOf(fn);
      if (idx !== -1) this.listeners.splice(idx, 1);
    };
  }

  public getHistory() {
    return [...this.history];
  }
}
