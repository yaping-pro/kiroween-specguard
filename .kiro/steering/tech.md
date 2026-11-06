---
inclusion: always
---
# Technical Steering & Architecture Constraints

## 1. Toolchain & Runtime
- **Language**: TypeScript (strict mode, zero implicit any, exact optional property types).
- **Execution & Test Runner**: Bun (`bun test` with built-in runner, native ESM, instant cold start).
- **Property-Based Testing (PBT)**: `fast-check` for generative input space exploration, shrinkable counterexamples, and invariant fuzzing.
- **UI & Presentation**: Vanilla reactive DOM / Web Components with zero heavy runtime overhead, dark theme styling matching Kiroween aesthetics, and an embedded live PBT radar console.

## 2. Invariant Engineering Rules
- Model state machines as pure reducer functions: `(State, Action) -> State`.
- Every mutation must return an `InvariantReport` alongside the next state:
  - Total conservation (e.g. sum of balances or parity bits unchanged).
  - Monotonicity (timestamps or nonces strictly increasing).
  - Reversibility / Bijectivity (e.g. split -> recombine recovers original secret).
- Fast-check properties must run under 100ms for 1,000 samples to enable sub-second Kiro save hooks.
