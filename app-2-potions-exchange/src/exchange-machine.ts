import { InvariantEngine, type Invariant } from "../../core-template/src";
import { PotionsMatchingEngine } from "./engine";
import type { Order, Side, Trade, TraderBalance } from "./orderbook";

export interface ExchangeState {
  marketSymbol: string;
  depth: { bids: Array<{ price: number; quantity: number }>; asks: Array<{ price: number; quantity: number }> };
  trades: Trade[];
  balances: Record<string, TraderBalance>;
  totalSystemGold: number;
  totalSystemInventory: Record<string, number>;
}

export type ExchangeAction =
  | { type: "PLACE_LIMIT_ORDER"; order: { id: string; traderId: string; side: Side; price: number; quantity: number } };

export const ExchangeInvariants: Invariant<ExchangeState, ExchangeAction>[] = [
  {
    id: "INV-EXCH-001",
    name: "Total Gold Conservation",
    description: "Total gold across all market accounts must remain strictly conserved after trades",
    severity: "critical",
    check: (prev, next) => next.totalSystemGold === prev.totalSystemGold
  },
  {
    id: "INV-EXCH-002",
    name: "Total Inventory Conservation",
    description: "Total count of potion ingredients across accounts must remain strictly conserved",
    severity: "critical",
    check: (prev, next) => {
      for (const [sym, count] of Object.entries(prev.totalSystemInventory)) {
        if ((next.totalSystemInventory[sym] ?? 0) !== count) return false;
      }
      return true;
    }
  },
  {
    id: "INV-EXCH-003",
    name: "Strict Orderbook Spread",
    description: "Best Bid price must be strictly less than Best Ask price on resting book",
    severity: "critical",
    check: (_prev, next) => {
      const bestBid = next.depth.bids[0]?.price;
      const bestAsk = next.depth.asks[0]?.price;
      if (bestBid !== undefined && bestAsk !== undefined) {
        return bestBid < bestAsk;
      }
      return true;
    }
  }
];

export function createExchangeEngine(symbol = "DRAGON_BLOOD") {
  const engine = new PotionsMatchingEngine();
  const initialTotals = engine.getTotalSystemAssets();

  const getBalancesRecord = () => {
    const res: Record<string, TraderBalance> = {};
    for (const [id, bal] of engine.getBalances()) {
      res[id] = { gold: bal.gold, inventory: { ...bal.inventory } };
    }
    return res;
  };

  const initialState: ExchangeState = {
    marketSymbol: symbol,
    depth: engine.getDepth(),
    trades: engine.getTrades(),
    balances: getBalancesRecord(),
    totalSystemGold: initialTotals.totalGold,
    totalSystemInventory: initialTotals.totalInventory
  };

  const reducer = (state: ExchangeState, action: ExchangeAction): ExchangeState => {
    switch (action.type) {
      case "PLACE_LIMIT_ORDER": {
        engine.placeOrder({
          id: action.order.id,
          traderId: action.order.traderId,
          symbol: state.marketSymbol,
          side: action.order.side,
          price: action.order.price,
          quantity: action.order.quantity
        });

        const totals = engine.getTotalSystemAssets();
        return {
          ...state,
          depth: engine.getDepth(),
          trades: engine.getTrades(),
          balances: getBalancesRecord(),
          totalSystemGold: totals.totalGold,
          totalSystemInventory: totals.totalInventory
        };
      }
    }
  };

  return new InvariantEngine<ExchangeState, ExchangeAction>({
    name: `PotionsExchange_${symbol}`,
    initialState,
    reducer,
    invariants: ExchangeInvariants
  });
}
