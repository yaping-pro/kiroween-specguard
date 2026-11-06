# Kiro Technical Implementation & Usage Dossier
**Project**: SpecGuard Crew  
**Hackathon**: Kiroween 2026 (Skeleton Crew Track)  
**Author**: Steven Ma (`hi.steven.ma@gmail.com`)

---

## 1. Executive Summary & Philosophy
Modern AI engineering often suffers from "vibe-coding drift"—agents output code that looks plausible and passes shallow smoke checks but fails catastrophically under edge-case invariants. **SpecGuard Crew** was built with AWS Kiro to demonstrate how **Spec-Driven Development + Continuous Invariant Verification** transforms non-deterministic LLM coding into verifiable software engineering.

---

## 2. Comprehensive Kiro Features Breakdown

### 2.1 How Kiro consumes this repository
This project is structured so that a Kiro agent can pick it up with zero onboarding: the agent reads `/.kiro` at repo root, and every architectural rule it needs is already encoded as machine-readable artifacts.

- **Kiro IDE** — the primary surface. Opening the repo loads `.kiro/steering/*.md` (`inclusion: always`), so product/tech/structure constraints are in context before the first prompt.
- **Kiro CLI (`kiro-cli`)** — the headless surface for scripted work: the same specs and hooks run without a GUI, which is how the invariant checks are wired to a save-triggered pipeline.
- **Kiro Web** — the zero-install surface: `app.kiro.dev` runs sessions against the same account and consumes the same credits, useful for review without a local toolchain.
- **Kiro Crew** — the parallel-agent surface: `.kiro/agents/invariant-auditor.json` defines a dedicated auditor agent that reviews state reducers for missing boundary invariants and proposes new properties.

> Evidence in this repo: `.kiro/steering/` (3 files), `.kiro/specs/` (3 EARS spec sets), `.kiro/hooks/` (2 save triggers), `.kiro/agents/` (1 custom agent), `.kiro/settings/mcp.json` (1 MCP server).

### 2.2 Spec-Driven Development vs. Vibe Coding
Instead of conversational vibe-coding, every component followed strict EARS (Easy Approach to Requirements Syntax) structure:
1. `requirements.md`: Formulated as `WHEN <event> THE System SHALL <action>`.
2. `design.md`: Explicit mathematical invariants (e.g. Galois field polynomial bounds, balance conservation equations).
3. `tasks.md`: Fine-grained task checklist linking code back to formal requirements.

**Why this beats vibe-coding**: the specification forced the generator requirement to be written down before code existed. Implementing $GF(256)$ with polynomial `0x11b` produces an element of multiplicative order 51 instead of 255, which silently corrupts Lagrange interpolation; the spec's stated invariant (`2` must have order 255) rejects that choice, so the implementation uses primitive polynomial `0x11d`. The property test in `app-1-necromancer-vault/src/vault.test.ts` now fails loudly if anyone reintroduces a non-primitive generator.

### 2.3 Agent Hooks & Automation
Configured two critical PostFileSave hooks in `.kiro/hooks/`:
- `lint-on-save.json`: Enforces static TypeScript compilation upon save.
- `pbt-verify-on-save.json`: Automatically triggers `fast-check` generative fuzzing across `(engine|shamir|orderbook|machine).ts`. If an edit violates any invariant, the save hook rejects the drift immediately.

### 2.4 Steering Documentation (`.kiro/steering/`)
We authored three steering files:
- `product.md`: Sets top-level project mission and non-negotiables (`inclusion: always`).
- `tech.md`: Mandates pure state-machine architecture and sub-millisecond invariant latency.
- `structure.md`: Guarantees isolation between the core template and the two consumer applications.

### 2.5 Model Context Protocol (MCP) Integration
Configured `.kiro/settings/mcp.json` to expose a local invariant fuzzing engine over MCP. This allows external AI agents to trigger 1,000-pass fuzzing runs and receive structured JSON violation diagnostics directly inside their reasoning loops.

### 2.6 Property-Based Testing (PBT) in Production
PBT with `fast-check` was central to our validation:
- **App 1 Invariant**: Tested 500 random secret strings with arbitrary threshold partitions. Proved that any $k$ shares reconstruct the secret identically, while any $k-1$ shares yield zero data.
- **App 2 Invariant**: Fuzzed 500 randomized limit order sequences across multiple trading accounts. Mathematically proved that total gold and ingredient balances remained strictly conserved, with zero negative balance leaks and zero crossed orderbooks.
