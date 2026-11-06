import type { Order, OrderbookDepth, Side, Trade, TraderBalance } from "./orderbook";

export class PotionsMatchingEngine {
  private bids: Order[] = []; // sorted descending by price, then ascending by timestamp
  private asks: Order[] = []; // sorted ascending by price, then ascending by timestamp
  private trades: Trade[] = [];
  private balances: Map<string, TraderBalance> = new Map();

  constructor() {
    // Seed test accounts with Gold and Potion ingredients
    this.balances.set("alchemist_alice", {
      gold: 10000,
      inventory: { DRAGON_BLOOD: 50, BAT_WING: 100 }
    });
    this.balances.set("witch_bob", {
      gold: 10000,
      inventory: { DRAGON_BLOOD: 50, BAT_WING: 100 }
    });
  }

  public getBalances(): Map<string, TraderBalance> {
    return new Map(this.balances);
  }

  public getTraderBalance(traderId: string): TraderBalance {
    let bal = this.balances.get(traderId);
    if (!bal) {
      bal = { gold: 1000, inventory: {} };
      this.balances.set(traderId, bal);
    }
    return bal;
  }

  public getTotalSystemAssets(): { totalGold: number; totalInventory: Record<string, number> } {
    let totalGold = 0;
    const totalInventory: Record<string, number> = {};

    for (const bal of this.balances.values()) {
      totalGold += bal.gold;
      for (const [sym, qty] of Object.entries(bal.inventory)) {
        totalInventory[sym] = (totalInventory[sym] ?? 0) + qty;
      }
    }

    return { totalGold, totalInventory };
  }

  public placeOrder(order: Omit<Order, "filledQuantity" | "timestamp">): { order: Order; executedTrades: Trade[] } {
    const fullOrder: Order = {
      ...order,
      filledQuantity: 0,
      timestamp: Date.now()
    };

    const executedTrades: Trade[] = [];
    const isBuy = fullOrder.side === "BUY";

    // Opposite book to match against
    const oppositeBook = isBuy ? this.asks : this.bids;

    while (oppositeBook.length > 0 && fullOrder.filledQuantity < fullOrder.quantity) {
      const bestOpposite = oppositeBook[0];
      const matchPossible = isBuy ? fullOrder.price >= bestOpposite.price : fullOrder.price <= bestOpposite.price;

      if (!matchPossible) break;

      const remainingTaker = fullOrder.quantity - fullOrder.filledQuantity;
      const remainingMaker = bestOpposite.quantity - bestOpposite.filledQuantity;
      const tradeQty = Math.min(remainingTaker, remainingMaker);
      const executionPrice = bestOpposite.price; // Maker price priority

      fullOrder.filledQuantity += tradeQty;
      bestOpposite.filledQuantity += tradeQty;

      // Settlement
      const buyerId = isBuy ? fullOrder.traderId : bestOpposite.traderId;
      const sellerId = isBuy ? bestOpposite.traderId : fullOrder.traderId;
      const tradeCost = tradeQty * executionPrice;

      const buyerBal = this.getTraderBalance(buyerId);
      const sellerBal = this.getTraderBalance(sellerId);

      buyerBal.gold -= tradeCost;
      sellerBal.gold += tradeCost;

      buyerBal.inventory[fullOrder.symbol] = (buyerBal.inventory[fullOrder.symbol] ?? 0) + tradeQty;
      sellerBal.inventory[fullOrder.symbol] = (sellerBal.inventory[fullOrder.symbol] ?? 0) - tradeQty;

      const trade: Trade = {
        id: `trd_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        makerOrderId: bestOpposite.id,
        takerOrderId: fullOrder.id,
        symbol: fullOrder.symbol,
        price: executionPrice,
        quantity: tradeQty,
        timestamp: Date.now()
      };

      executedTrades.push(trade);
      this.trades.push(trade);

      if (bestOpposite.filledQuantity >= bestOpposite.quantity) {
        oppositeBook.shift();
      }
    }

    // If remaining quantity, rest on book
    if (fullOrder.filledQuantity < fullOrder.quantity) {
      if (isBuy) {
        this.bids.push(fullOrder);
        this.bids.sort((a, b) => b.price - a.price || a.timestamp - b.timestamp);
      } else {
        this.asks.push(fullOrder);
        this.asks.sort((a, b) => a.price - b.price || a.timestamp - b.timestamp);
      }
    }

    return { order: fullOrder, executedTrades };
  }

  public getDepth(): OrderbookDepth {
    return {
      bids: this.bids.map(b => ({ price: b.price, quantity: b.quantity - b.filledQuantity })),
      asks: this.asks.map(a => ({ price: a.price, quantity: a.quantity - a.filledQuantity }))
    };
  }

  public getTrades(): Trade[] {
    return [...this.trades];
  }
}
