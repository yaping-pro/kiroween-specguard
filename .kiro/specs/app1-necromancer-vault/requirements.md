# Requirements: App-1 Necromancer Vault (Cryptographic Share Safe)

## 1. Overview
Necromancer Vault applies the SpecGuard template to cryptographic threshold secret sharing. It allows resurrecting sensitive secrets (such as private keys or API tokens) using split horcrux shares.

## 2. EARS Specification

### REQ-VAULT-001: Secret Splitting
WHEN a valid plaintext secret and threshold parameters $(k, n)$ ($k \le n$) are submitted, THE System SHALL generate $n$ distinct horcrux shares such that any $k$ shares can reconstruct the secret.

### REQ-VAULT-002: Invariant - Exact Reconstruction
WHEN any subset of shares with size $\ge k$ is combined, THE System SHALL reconstruct the exact original secret byte-for-byte.

### REQ-VAULT-003: Invariant - Zero-Knowledge Sub-threshold
WHEN any subset of shares with size $< k$ is provided, THE System SHALL reject reconstruction and leak zero bits of plaintext.

### REQ-VAULT-004: Invariant - Share Tamper Detection
WHEN any share payload has an altered checksum, THE System SHALL detect corruption prior to polynomial interpolation.
