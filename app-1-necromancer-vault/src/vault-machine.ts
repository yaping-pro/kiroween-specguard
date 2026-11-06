import { InvariantEngine, type Invariant } from "../../core-template/src";
import { reconstructSecret, splitSecret, type HorcruxShare } from "./shamir";

export interface VaultState {
  vaultName: string;
  isLocked: boolean;
  activeSecret: string | null;
  threshold: number;
  totalShares: number;
  availableShares: HorcruxShare[];
  collectedShares: HorcruxShare[];
  lastReconstructedSecret: string | null;
}

export type VaultAction =
  | { type: "STORE_SECRET"; secret: string; threshold: number; totalShares: number }
  | { type: "INSERT_SHARE"; share: HorcruxShare }
  | { type: "ATTEMPT_RESURRECTION" }
  | { type: "LOCK_VAULT" };

export const VaultInvariants: Invariant<VaultState, VaultAction>[] = [
  {
    id: "INV-VAULT-001",
    name: "Valid Threshold Bounds",
    description: "Threshold k must strictly satisfy 2 <= k <= n",
    severity: "critical",
    check: (_prev, next) => next.threshold <= next.totalShares && next.threshold >= 2
  },
  {
    id: "INV-VAULT-002",
    name: "Zero Share Loss on Split",
    description: "Splitting a secret generates exactly n distinct horcrux shares",
    severity: "critical",
    check: (prev, next, action) => {
      if (action.type === "STORE_SECRET") {
        return next.availableShares.length === action.totalShares;
      }
      return true;
    }
  },
  {
    id: "INV-VAULT-003",
    name: "Deterministic Reconstruction Identity",
    description: "Reconstructed secret must match the original stored secret when k shares are provided",
    severity: "critical",
    check: (_prev, next, action) => {
      if (action.type === "ATTEMPT_RESURRECTION") {
        if (next.collectedShares.length >= next.threshold) {
          return next.lastReconstructedSecret === next.activeSecret;
        }
      }
      return true;
    }
  }
];

export function createVaultEngine(name = "Necromancer Horcrux Safe") {
  const initialState: VaultState = {
    vaultName: name,
    isLocked: true,
    activeSecret: null,
    threshold: 3,
    totalShares: 5,
    availableShares: [],
    collectedShares: [],
    lastReconstructedSecret: null
  };

  const reducer = (state: VaultState, action: VaultAction): VaultState => {
    switch (action.type) {
      case "STORE_SECRET": {
        const shares = splitSecret(action.secret, action.threshold, action.totalShares);
        return {
          ...state,
          activeSecret: action.secret,
          threshold: action.threshold,
          totalShares: action.totalShares,
          availableShares: shares,
          collectedShares: [],
          lastReconstructedSecret: null,
          isLocked: true
        };
      }
      case "INSERT_SHARE": {
        const exists = state.collectedShares.some(s => s.id === action.share.id);
        if (exists) return state;
        return {
          ...state,
          collectedShares: [...state.collectedShares, action.share]
        };
      }
      case "ATTEMPT_RESURRECTION": {
        if (state.collectedShares.length < state.threshold) {
          return { ...state, lastReconstructedSecret: null };
        }
        try {
          const recovered = reconstructSecret(state.collectedShares);
          return {
            ...state,
            lastReconstructedSecret: recovered,
            isLocked: recovered !== state.activeSecret
          };
        } catch {
          return { ...state, lastReconstructedSecret: null };
        }
      }
      case "LOCK_VAULT": {
        return {
          ...state,
          isLocked: true,
          collectedShares: [],
          lastReconstructedSecret: null
        };
      }
    }
  };

  return new InvariantEngine<VaultState, VaultAction>({
    name,
    initialState,
    reducer,
    invariants: VaultInvariants
  });
}
