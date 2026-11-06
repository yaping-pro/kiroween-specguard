# Devpost Submission Copy — Kiroween 2026 (Skeleton Crew)

> Fill each field below into the Devpost "Enter a Submission" form. Placeholders marked `⟨…⟩` must be replaced with the published URL after upload.

## Project name
SpecGuard Crew

## Elevator pitch (≤ 200 chars)
A reusable invariant engine skeleton: specs become executable contracts, and property-based tests prove both derived apps cannot violate them.

## Category
**Skeleton Crew**

## Links
- GitHub (public, MIT): https://github.com/yaping-pro/kiroween-specguard
- Live app: https://yaping-pro.github.io/kiroween-specguard/
- Demo video (YouTube, public): ⟨VIDEO_URL⟩
- Blog post: ⟨BLOG_URL⟩
- Social post: ⟨SOCIAL_URL⟩

## Description

**SpecGuard Crew** is the skeleton, not the app. It is a reusable foundation for building software whose correctness is a mathematical property rather than a hope.

The skeleton is a pure functional state machine wrapped in an invariant engine. Every transition is checked against registered predicates before the state is committed: a violating transition is rejected and the previous state is preserved, so an invalid mutation can never reach the UI. On top of that sits a property-based testing (PBT) bridge powered by `fast-check`, which fuzzes the same invariants 1,000 times with generated inputs and reports the exact counterexample when one fails.

To prove the skeleton is genuinely reusable, it is consumed by two applications in unrelated domains:

1. **Necromancer Vault** — Shamir threshold secret sharing over Galois Field GF(256). Any *k* of *n* horcrux shares reconstruct the secret byte-for-byte; any *k−1* shares leak nothing. The invariant engine blocks sub-threshold reconstruction, and the PBT suite verifies the round-trip across randomized secrets and thresholds.
2. **Potions Exchange** — a price-time priority limit order book for Halloween ingredients. Matching conserves total gold and inventory, and the book can never stay crossed. Randomized order floods are verified against both invariants without a single leak.

Both run in the same dashboard with a live "Invariant Radar" HUD that streams check results, latency, and PBT stress passes in real time.

**How it uses Kiro.** The repository is Kiro-native. `.kiro/steering/` encodes the architecture rules (product mission, tech constraints, module boundaries) with `inclusion: always`, so any Kiro agent starts inside the correct constraints. `.kiro/specs/` holds three EARS specification sets (one per component) in `requirements / design / tasks` form, each requirement written as `WHEN <event> THE System SHALL <action>`. `.kiro/hooks/` binds two save triggers — type-check on save, and PBT regression on save whenever an engine, cipher, or order book file changes. `.kiro/agents/invariant-auditor.json` defines a reviewer agent whose job is to find missing boundary invariants, and `.kiro/settings/mcp.json` exposes the fuzzing engine over MCP so agents can request verification inside their own reasoning loop.

## What it does (judge test steps)
1. Open the live dashboard.
2. Necromancer Vault: enter any secret, keep threshold 3 of 5, click **Split Secret**. Select two shares and click **Attempt Resurrection** — the sub-threshold invariant blocks it. Select a third share — the exact secret is recovered.
3. Potions Exchange: post a SELL at 105 g, then a BUY at 105 g; the trade matches and the depth updates. Click **Run 1,000 PBT Stress Pass** — the radar confirms 1,000 generated cases with zero violations.

## Tech stack
TypeScript, Bun, `fast-check`, vanilla Web Components, GitHub Actions + Pages.

## Kiro usage write-up
See `docs/KIRO_USAGE.md` in the repository, and the summary above.

## Bonus prize fields
- **Social Blitz**: ⟨SOCIAL_URL⟩
- **Bonus Blog**: ⟨BLOG_URL⟩
- **Best Demo**: considered automatically
- **Best Kiro Crew App**: not claimed (no Crew-only app submitted)