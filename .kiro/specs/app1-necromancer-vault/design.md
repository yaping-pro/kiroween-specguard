# Design: App-1 Necromancer Vault

## 1. Cryptographic Primitive
Uses Galois Field $GF(256)$ Lagrange polynomial interpolation for deterministic, zero-dependency threshold secret sharing.

## 2. Invariant Specifications for Fast-Check
```typescript
// PBT Property 1: Perfect Roundtrip
fc.assert(
  fc.property(fc.string({ minLength: 1, maxLength: 100 }), fc.integer({ min: 2, max: 5 }), (secret, k) => {
    const n = k + 2;
    const shares = splitSecret(secret, k, n);
    const chosen = pickRandomSubarray(shares, k);
    return reconstructSecret(chosen) === secret;
  })
);
```
