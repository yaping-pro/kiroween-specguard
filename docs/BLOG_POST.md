# Beyond Vibe Coding: Building Invariant-Driven Agentic Systems with AWS Kiro

*This post was written as part of the Kiroween 2026 hackathon.*

---

## The Vibe Coding Paradox
In 2026, building software with AI models has become the default. You give a model a prompt, it generates fifty lines of clean TypeScript, your smoke test passes, and you commit. 

Then production happens.

A user enters unicode edge cases into your cryptographic key manager. A high-frequency matching engine receives simultaneous orders that cause balance rounding leaks. Your AI agent claimed the feature was "complete," yet hidden state space bugs lingered unseen.

The fundamental issue isn’t model intelligence—it’s **verification density**. Unit tests verify two or three examples you happened to think of. What about the 100,000 permutations you didn't?

When AWS announced the **Kiroween 2026** hackathon, I set out to solve this exact problem in the **Skeleton Crew** track by building **SpecGuard Crew**—a reusable foundation template combining Kiro's Spec-driven engineering with automated Property-Based Testing (PBT).

---

## 1. What Makes Kiro Different: Executable Specs Over Chat
Most coding assistants are conversational chatbots grafted onto an editor. Kiro treats development as an **executable specification lifecycle**:

1. **EARS Requirements**: Instead of vague prompts, requirements are formulated in strict EARS syntax (`WHEN <trigger> THE System SHALL <action>`).
2. **Steering Documents**: Kiro’s `.kiro/steering/` files act as non-negotiable architectural guardrails. We configured `product.md`, `tech.md`, and `structure.md` so that every agent mutation adhered to pure state-machine reducers and sub-millisecond invariant latency.
3. **Agent Hooks**: Whenever a developer or agent saves a file, Kiro triggers `.kiro/hooks/pbt-verify-on-save.json`. If an edit violates any invariant under a 1,000-sample generative fuzz pass, the save is rejected.

---

## 2. One Foundation, Two Orthogonal Worlds (The Skeleton Crew Architecture)
To demonstrate the versatility of SpecGuard, we built two completely different applications on top of the same core template:

### Application 1: Necromancer Vault (Zero-Knowledge Key Splitting)
A cryptographic safe implementing Shamir's Secret Sharing over Galois Field $GF(256)$. Plaintext secrets (like private keys or API credentials) are decomposed into $n$ horcrux shares with a threshold $k$.
- **Formal Invariant**: Any $k$ shares reconstruct the exact secret byte-for-byte; any $k-1$ shares leak zero bits of information.
- **PBT Stress Pass**: 500 randomized generative trials verifying round-trip reconstruction and tamper resistance in under 60 milliseconds.

### Application 2: Potions Exchange (High-Frequency Dark Orderbook)
A financial limit order matching engine for Halloween ingredients (Dragon Blood, Bat Wings, Moon Dust) featuring FIFO Price-Time priority.
- **Formal Invariant**: Total system gold and inventory balances must remain strictly conserved before and after every trade event.
- **PBT Stress Pass**: 500 generative streams of randomized order floods verifying that no asset is created or destroyed, and the bid-ask spread is never crossed.

---

## 3. How Kiro Caught a Critical Cryptographic Flaw
During initial development, a conversational prompt generated Galois Field arithmetic using polynomial `0x11b`. The code looked mathematically elegant and passed basic unit tests for small numbers.

However, when Kiro executed our automated property tests, `fast-check` immediately flagged a counterexample: element `2` had an order cycle of only 51 elements instead of 255, completely corrupting Lagrange interpolation! 

Because our Kiro steering document mandated PBT verification before implementation, Kiro identified the cycle limitation and switched to primitive polynomial `0x11d` ($x^8 + x^4 + x^3 + x^2 + 1$), restoring full mathematical soundness. A human reviewer might have missed this bug for weeks.

---

## 4. Conclusion
AI coding doesn't have to be reckless vibe coding. With AWS Kiro, specifications become executable contracts, hooks become real-time boundary guards, and property-based testing ensures mathematical certainty.

Check out the full open-source project on GitHub: [SpecGuard Crew](https://github.com/yaping-pro/kiroween-specguard) and try the live interactive radar dashboard!

*This post was written as part of the Kiroween 2026 hackathon.*
