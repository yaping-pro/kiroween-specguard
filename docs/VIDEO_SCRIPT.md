# Kiroween 2026 Video Demo Script (< 3 Minutes)
**Target Length**: 2 Minutes 30 Seconds (150 Seconds)  
**Audio**: Spoken English voiceover (No copyrighted background music)  
**Resolution**: 1920x1080 60fps

---

## Storyboard & Timeline

### Scene 1: The Problem & The Solution (0:00 - 0:25)
- **Visual**: Screen capture showing Kiro IDE with `.kiro/specs/` and the title slide: "SpecGuard Crew — Invariant-Driven Agentic Engineering".
- **Spoken Voiceover**:
  > *"When building complex software with AI agents, passing unit tests isn't enough. Code can look right, pass basic mocks, and still fail catastrophically under edge-case invariants. For Kiroween 2026, we built SpecGuard Crew—a high-reliability skeleton foundation that pairs Kiro's Spec-driven development with mathematical Property-Based Testing to guarantee zero runtime drift."*

### Scene 2: The Core Skeleton & Kiro Architecture (0:25 - 0:50)
- **Visual**: Navigate directory structure: `.kiro/steering/`, `.kiro/specs/`, `.kiro/hooks/pbt-verify-on-save.json`. Trigger a live test run in terminal showing 1,000 PBT generative runs passing in milliseconds.
- **Spoken Voiceover**:
  > *"At the core is a reusable invariant engine. We defined strict EARS specifications, automated save hooks, and Kiro steering docs. Every state mutation is verified against formal invariants using fast-check. To prove its versatility for the Skeleton Crew category, we built two completely different applications on this single foundation."*

### Scene 3: App-1 Demo — Necromancer Vault (0:50 - 1:25)
- **Visual**: Open browser dashboard, zoom on App-1. Enter secret, set threshold 3/5. Click "Split Secret Into Horcruxes". Select 2 shares -> Click "Attempt Resurrection" -> Show Red Alert (sub-threshold protection). Select 3rd share -> Click "Attempt Resurrection" -> Green Alert, instant byte-for-byte secret recovery!
- **Spoken Voiceover**:
  > *"Application One is the Necromancer Vault—a zero-knowledge secret recovery safe using Galois Field Shamir Secret Sharing. Here, we split an API key into five horcrux shares with a threshold of three. When we try to reconstruct with only two shares, the sub-threshold invariant blocks execution. As soon as the third share is provided, the polynomial interpolation instantly resurrects the exact secret."*

### Scene 4: App-2 Demo — Potions Exchange (1:25 - 2:05)
- **Visual**: Zoom on App-2. Submit matching limit orders for Dragon Blood. Show live order depth matching. Click "Run 1,000 PBT Stress Pass" button -> Watch live radar HUD light up with 1,000 fuzz checks completed in 15ms with 0 violations!
- **Spoken Voiceover**:
  > *"Application Two is the Potions Exchange—a high-frequency dark limit orderbook for Halloween ingredients. It adheres to strict Price-Time priority while enforcing total system gold and ingredient conservation invariants. Watch what happens when we trigger the PBT Stress Pass: the engine executes 1,000 randomized generative order sequences in real time, proving that value is conserved and the spread remains uncrossed."*

### Scene 5: Impact & Conclusion (2:05 - 2:30)
- **Visual**: Show Kiro IDE and GitHub repository About section with MIT License and live demo link.
- **Spoken Voiceover**:
  > *"By combining Kiro's Spec-Driven Development, Agent Hooks, and automated Property-Based Testing, SpecGuard Crew turns AI coding from fragile guesswork into verifiable engineering. The entire repository is open source under the MIT license, ready for developers to build the next generation of reliable agents. Thank you!"*
