# 🎃 SpecGuard Crew — Invariant-Driven Agentic Engineering

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Kiro: EARS Compliant](https://img.shields.io/badge/Kiro-EARS%20Compliant-orange.svg)](https://kiro.dev)
[![PBT: fast--check](https://img.shields.io/badge/PBT-fast--check%201000%20runs-green.svg)](https://fast-check.dev)
[![Track: Skeleton Crew](https://img.shields.io/badge/Track-Skeleton%20Crew-purple.svg)](https://kiroween.devpost.com)

> Built for the **AWS Kiroween 2026 Hackathon** (Skeleton Crew Category).  
> A reusable mathematical invariant state engine paired with continuous Property-Based Testing (PBT) to eliminate vibe-coding drift across AI-generated codebases.

---

## 🌟 The Core Idea: Beyond Vibe Coding

When coding with AI models, standard unit tests often only check two or three examples you happened to think of. **SpecGuard Crew** transforms software specifications into continuous mathematical contracts:
1. **EARS Specifications**: Requirements defined strictly as `WHEN <event> THE System SHALL <action>`.
2. **Kiro Architectural Steering**: `.kiro/steering/` sets non-negotiable boundaries on state immutability and test execution limits.
3. **Agent Save Hooks**: Every file save automatically triggers `fast-check` generative fuzzing across thousands of randomized state permutations.
4. **Live Verification Radar**: An embedded client-side HUD visualizes real-time invariant health and stress passes.

---

## 🏛️ Architecture & Two Consumer Applications

SpecGuard Crew strictly satisfies the **Skeleton Crew** track requirements (1 common foundation + 2 distinct orthogonal applications):

```
specguard-kiroween/
├── .kiro/                           # Kiro Governance (Steering, Specs, Hooks, Agents, MCP)
├── core-template/                   # [The Skeleton] Invariant state engine & PBT runner
├── app-1-necromancer-vault/         # [Application 1] Galois Field GF(256) Shamir Secret Sharing
├── app-2-potions-exchange/          # [Application 2] High-frequency dark orderbook with value conservation
├── public/                          # Zero-dependency interactive web dashboard
└── docs/                            # Kiro usage write-up, video script, blog post, roadmap
```

### ⚰️ Application 1: Necromancer Vault (Cryptographic Safe)
- **Domain**: Cryptographic threshold secret sharing over Galois Field $GF(256)$.
- **Mathematical Invariant**: Any $k$ horcrux shares reconstruct the exact secret byte-for-byte; any $k-1$ shares yield zero plaintext bits.
- **Verification**: 500-pass generative PBT round-trip fuzzing.

### 🧪 Application 2: Potions Exchange (Dark Matching Engine)
- **Domain**: High-frequency financial limit orderbook for Halloween ingredients (Dragon Blood, Bat Wings).
- **Mathematical Invariant**: The total sum of market gold and ingredient quantities is strictly conserved after every matching event, and resting orderbooks are never crossed.
- **Verification**: 500-pass randomized order flood testing.

---

## 🚀 Quickstart & Verification

### Prerequisites
- [Bun](https://bun.sh) (v1.0+) or Node.js (v18+)

### Installation & Test Suite
```bash
# Clone the repository
git clone https://github.com/yaping-pro/kiroween-specguard.git
cd kiroween-specguard

# Install dependencies
bun install

# Run all unit tests and 1,000+ generative Property-Based Tests
bun test

# Launch the live interactive dashboard
bun run serve
```
Open [http://localhost:3000](http://localhost:3000) to view the live dashboard and trigger real-time PBT stress passes!

---

## 📚 Hackathon Documentation & Evidence Links

- [Kiro Usage & Architecture Dossier (Judge Scorecard)](docs/KIRO_USAGE.md)
- [Video Demo Script (< 3 Minutes)](docs/VIDEO_SCRIPT.md)
- [Technical Execution Roadmap (SSOT)](docs/EXECUTION_ROADMAP.md)
- [Bonus Blog Post Draft](docs/BLOG_POST.md)
- [Social Blitz Tweet Draft](docs/SOCIAL_POST.md)

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
