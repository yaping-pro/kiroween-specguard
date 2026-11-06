import { describe, expect, it } from "bun:test";
import * as fc from "fast-check";
import { InvariantEngine } from "./engine";
import { PbtRunner } from "./pbt-runner";
import type { Invariant } from "./types";

interface CounterState {
  count: number;
  history: number[];
}

type CounterAction = { type: "inc"; amount: number } | { type: "dec"; amount: number };

describe("InvariantEngine Core Unit Tests", () => {
  const nonNegativeInvariant: Invariant<CounterState, CounterAction> = {
    id: "INV-COUNT-001",
    name: "Non-Negative Count",
    description: "Counter must never be negative",
    severity: "critical",
    check: (_prev, next) => next.count >= 0
  };

  const reducer = (state: CounterState, action: CounterAction): CounterState => {
    switch (action.type) {
      case "inc":
        return { count: state.count + action.amount, history: [...state.history, action.amount] };
      case "dec":
        return { count: Math.max(0, state.count - action.amount), history: [...state.history, -action.amount] };
    }
  };

  it("dispatches actions and maintains valid invariant report", () => {
    const engine = new InvariantEngine<CounterState, CounterAction>({
      name: "CounterMachine",
      initialState: { count: 10, history: [] },
      reducer,
      invariants: [nonNegativeInvariant]
    });

    const res = engine.dispatch({ type: "inc", amount: 5 });
    expect(res.state.count).toBe(15);
    expect(res.report.passed).toBe(true);
    expect(res.report.violations.length).toBe(0);
  });

  it("catches invariant violation without mutating state", () => {
    // A faulty reducer that allows negative count
    const faultyReducer = (state: CounterState, action: CounterAction): CounterState => {
      if (action.type === "dec") {
        return { count: state.count - action.amount, history: [] };
      }
      return state;
    };

    const engine = new InvariantEngine<CounterState, CounterAction>({
      name: "FaultyCounter",
      initialState: { count: 5, history: [] },
      reducer: faultyReducer,
      invariants: [nonNegativeInvariant]
    });

    const res = engine.dispatch({ type: "dec", amount: 10 });
    expect(res.report.passed).toBe(false);
    expect(res.report.violations.length).toBe(1);
    expect(res.state.count).toBe(5); // State was preserved!
  });

  it("executes 1,000 property-based runs via PbtRunner", async () => {
    const result = await PbtRunner.verify({
      name: "Addition commutativity property",
      arbitrary: fc.tuple(fc.integer(), fc.integer()),
      predicate: ([a, b]) => a + b === b + a,
      numRuns: 1000
    });

    expect(result.passed).toBe(true);
    expect(result.totalRuns).toBe(1000);
  });
});
