/**
 * Galois Field GF(256) arithmetic for Shamir Secret Sharing
 * Primitive polynomial: x^8 + x^4 + x^3 + x^2 + 1 (0x11d)
 * Base generator: 2
 */

const EXP_TABLE = new Uint8Array(512);
const LOG_TABLE = new Uint8Array(256);

// Precompute log and exp tables
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP_TABLE[i] = x;
    EXP_TABLE[i + 255] = x;
    LOG_TABLE[x] = i;
    x = x << 1;
    if (x & 0x100) {
      x ^= 0x11d;
    }
  }
  LOG_TABLE[0] = 0;
})();

export const gfAdd = (a: number, b: number): number => a ^ b;
export const gfSub = (a: number, b: number): number => a ^ b;

export const gfMul = (a: number, b: number): number => {
  if (a === 0 || b === 0) return 0;
  return EXP_TABLE[LOG_TABLE[a] + LOG_TABLE[b]];
};

export const gfDiv = (a: number, b: number): number => {
  if (b === 0) throw new Error("GF(256) Division by zero");
  if (a === 0) return 0;
  return EXP_TABLE[LOG_TABLE[a] - LOG_TABLE[b] + 255];
};

export const gfEvalPoly = (poly: number[], x: number): number => {
  let res = 0;
  for (let i = poly.length - 1; i >= 0; i--) {
    res = gfMul(res, x) ^ poly[i];
  }
  return res;
};
