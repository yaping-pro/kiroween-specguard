---
inclusion: always
---
# Structural Steering & Modularity Boundary

## 1. Directory Structure Law (Skeleton Crew Compliance)
According to Kiroween 2026 official rules:
- `core-template/`: Contains the reusable state-machine kernel, invariant runner, fast-check bridge, and telemetry widget.
- `app-1-necromancer-vault/`: Independent folder for Application 1 (Cryptographic Secret Sharing Safe).
- `app-2-potions-exchange/`: Independent folder for Application 2 (Order Matching & Potions Trading Ledger).
- Both applications MUST consume `core-template/` contracts without cyclic references.

## 2. Kiro Metadata Integrity
- `/.kiro` MUST remain at repository root and be tracked in Git.
- Every major feature must have a corresponding specification directory under `.kiro/specs/<feature>/` containing `requirements.md`, `design.md`, and `tasks.md`.
