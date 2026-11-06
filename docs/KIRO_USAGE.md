# Kiro Technical Implementation & Usage Dossier
**Project**: SpecGuard Crew  
**Hackathon**: Kiroween 2026 (Skeleton Crew Track)  
**Author**: Steven Ma (`hi.steven.ma@gmail.com`)

---

## 1. Executive Summary & Philosophy
Modern AI engineering often suffers from "vibe-coding drift"—agents output code that looks plausible and passes shallow smoke checks but fails catastrophically under edge-case invariants. **SpecGuard Crew** was built with AWS Kiro to demonstrate how **Spec-Driven Development + Continuous Invariant Verification** transforms non-deterministic LLM coding into verifiable software engineering.

---

## 2. Comprehensive Kiro Features Breakdown

### 2.1 Kiro Modalities & Comparison (IDE, CLI, Web, Crew)
Throughout this build, we evaluated and integrated four Kiro surfaces:
- **Kiro IDE**: Used for core architectural shaping and in-editor spec refactoring. The real-time inline spec diffing prevented code degradation.
- **Kiro CLI (`kiro-cli`)**: Used in headless CI/CD automation pipelines and git save hooks. Running invariant checks via CLI headless mode provided sub-second regression feedback.
- **Kiro Web**: Utilized for prompt exploration and lightweight spec drafting across remote environments without local dependencies.
- **Kiro Crew**: Deployed autonomous parallel agents (`InvariantAuditor` and `RedTeamFuzzer`). Crew enabled simultaneous development of orthogonal applications (`app-1-necromancer-vault` and `app-2-potions-exchange`) while ensuring neither broke the shared core contracts in `core-template`.

### 2.2 Spec-Driven Development vs. Vibe Coding
Instead of conversational vibe-coding, every component followed strict EARS (Easy Approach to Requirements Syntax) structure:
1. `requirements.md`: Formulated as `WHEN <event> THE System SHALL <action>`.
2. `design.md`: Explicit mathematical invariants (e.g. Galois field polynomial bounds, balance conservation equations).
3. `tasks.md`: Fine-grained task checklist linking code back to formal requirements.

**Why this beat vibe-coding**: When implementing the Galois Field $GF(256)$ generator, simple prompting produced non-primitive polynomials (order 51) that broke Shamir reconstruction. Kiro's spec-driven reasoning caught the generator cycle requirement, switching to primitive polynomial `0x11d` before a single line of business logic was built.

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
