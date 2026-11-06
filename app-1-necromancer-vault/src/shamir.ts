import { gfAdd, gfDiv, gfEvalPoly, gfMul, gfSub } from "./gf256";

export interface HorcruxShare {
  id: number; // x coordinate (1..255)
  data: Uint8Array;
}

export function splitSecret(secret: string, threshold: number, totalShares: number): HorcruxShare[] {
  if (threshold < 2 || threshold > totalShares || totalShares > 255) {
    throw new Error(`Invalid threshold ${threshold} or total shares ${totalShares}`);
  }

  const bytes = new TextEncoder().encode(secret);
  const shares: HorcruxShare[] = Array.from({ length: totalShares }, (_, i) => ({
    id: i + 1,
    data: new Uint8Array(bytes.length)
  }));

  for (let byteIdx = 0; byteIdx < bytes.length; byteIdx++) {
    const s0 = bytes[byteIdx];
    // Random polynomial coefficients: P(x) = s0 + a1*x + a2*x^2 + ... + a_{k-1}*x^{k-1}
    const poly = [s0];
    for (let c = 1; c < threshold; c++) {
      poly.push(Math.floor(Math.random() * 255) + 1);
    }

    for (let shareIdx = 0; shareIdx < totalShares; shareIdx++) {
      const x = shares[shareIdx].id;
      shares[shareIdx].data[byteIdx] = gfEvalPoly(poly, x);
    }
  }

  return shares;
}

export function reconstructSecret(shares: HorcruxShare[]): string {
  if (shares.length < 2) throw new Error("At least 2 shares required for reconstruction");

  const len = shares[0].data.length;
  for (const s of shares) {
    if (s.data.length !== len) throw new Error("Mismatched share lengths");
  }

  const resultBytes = new Uint8Array(len);

  for (let byteIdx = 0; byteIdx < len; byteIdx++) {
    let secretByte = 0;

    for (let i = 0; i < shares.length; i++) {
      const xi = shares[i].id;
      const yi = shares[i].data[byteIdx];

      // Compute Lagrange basis polynomial L_i(0)
      let basis = 1;
      for (let j = 0; j < shares.length; j++) {
        if (i === j) continue;
        const xj = shares[j].id;
        // L_i(0) = prod_{j!=i} (0 - xj) / (xi - xj)
        const num = xj; // (0 - xj) in GF(256) is xj because add/sub is XOR
        const den = gfSub(xi, xj);
        basis = gfMul(basis, gfDiv(num, den));
      }

      secretByte = gfAdd(secretByte, gfMul(yi, basis));
    }

    resultBytes[byteIdx] = secretByte;
  }

  return new TextDecoder().decode(resultBytes);
}
