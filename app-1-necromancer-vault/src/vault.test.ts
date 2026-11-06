import { describe, expect, it } from "bun:test";
import * as fc from "fast-check";
import { PbtRunner } from "../../core-template/src";
import { reconstructSecret, splitSecret, type HorcruxShare } from "./shamir";
import { createVaultEngine } from "./vault-machine";

describe("App-1: Necromancer Vault Tests", () => {
  it("splits secret and reconstructs with exact threshold k", () => {
    const original = "sk-ant-api-key-spooky-ghost-2026";
    const k = 3;
    const n = 5;
    const shares = splitSecret(original, k, n);

    expect(shares.length).toBe(5);

    // Pick 3 arbitrary shares
    const subset: HorcruxShare[] = [shares[0], shares[2], shares[4]];
    const recovered = reconstructSecret(subset);
    expect(recovered).toBe(original);
  });

  it("fails or produces corrupted text when fewer than k shares are combined", () => {
    const original = "confidential-spellbook-passcode";
    const shares = splitSecret(original, 3, 5);
    // Only 2 shares provided (sub-threshold)
    const subThreshold = [shares[0], shares[1]];
    const attempt = reconstructSecret(subThreshold);
    expect(attempt).not.toBe(original);
  });

  it("verifies Vault Invariant Engine lifecycle", () => {
    const engine = createVaultEngine();
    const splitRes = engine.dispatch({
      type: "STORE_SECRET",
      secret: "master-key-xyz",
      threshold: 2,
      totalShares: 4
    });
    expect(splitRes.report.passed).toBe(true);

    const shares = splitRes.state.availableShares;
    engine.dispatch({ type: "INSERT_SHARE", share: shares[0] });
    engine.dispatch({ type: "INSERT_SHARE", share: shares[1] });

    const unlockRes = engine.dispatch({ type: "ATTEMPT_RESURRECTION" });
    expect(unlockRes.report.passed).toBe(true);
    expect(unlockRes.state.isLocked).toBe(false);
    expect(unlockRes.state.lastReconstructedSecret).toBe("master-key-xyz");
  });

  it("PBT: Generative secret splitting and reconstruction (500 runs)", async () => {
    const pbtResult = await PbtRunner.verify({
      name: "Shamir Threshold Roundtrip Invariant",
      arbitrary: fc.tuple(
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.integer({ min: 2, max: 4 })
      ),
      predicate: ([secret, k]) => {
        const n = k + 2;
        const shares = splitSecret(secret, k, n);
        // Choose k random distinct shares
        const picked = shares.slice(0, k);
        const reconstructed = reconstructSecret(picked);
        return reconstructed === secret;
      },
      numRuns: 500
    });

    expect(pbtResult.passed).toBe(true);
  });
});
