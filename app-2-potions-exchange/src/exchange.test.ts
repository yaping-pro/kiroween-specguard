import { describe, expect, it } from "bun:test";
import * as fc from "fast-check";
import { PbtRunner } from "../../core-template/src";
import { PotionsMatchingEngine } from "./engine";
import { createExchangeEngine } from "./exchange-machine";

describe("App-2: Potions Exchange Tests", () => {
  it("executes matched trade and transfers gold and potion balance correctly", () => {
    const exchange = createExchangeEngine("DRAGON_BLOOD");

    // Alice sells 5 Dragon Blood @ 100 gold
    const sellRes = exchange.dispatch({
      type: "PLACE_LIMIT_ORDER",
      order: { id: "o1", traderId: "alchemist_alice", side: "SELL", price: 100, quantity: 5 }
    });
    expect(sellRes.report.passed).toBe(true);

    // Bob buys 5 Dragon Blood @ 100 gold
    const buyRes = exchange.dispatch({
      type: "PLACE_LIMIT_ORDER",
      order: { id: "o2", traderId: "witch_bob", side: "BUY", price: 100, quantity: 5 }
    });
    expect(buyRes.report.passed).toBe(true);
    expect(buyRes.state.trades.length).toBe(1);

    // Total gold and inventory must remain conserved
    expect(buyRes.state.totalSystemGold).toBe(20000);
    expect(buyRes.state.totalSystemInventory["DRAGON_BLOOD"]).toBe(100);
  });

  it("PBT: Generative randomized limit order stream preserves value conservation (500 orders)", async () => {
    const pbtResult = await PbtRunner.verify({
      name: "High-Frequency Order Matching Conservation Invariant",
      arbitrary: fc.array(
        fc.record({
          id: fc.uuid(),
          traderId: fc.constantFrom("alchemist_alice", "witch_bob"),
          side: fc.constantFrom("BUY", "SELL") as fc.Arbitrary<"BUY" | "SELL">,
          price: fc.integer({ min: 10, max: 200 }),
          quantity: fc.integer({ min: 1, max: 10 })
        }),
        { minLength: 10, maxLength: 50 }
      ),
      predicate: (orders) => {
        const engine = new PotionsMatchingEngine();
        const initialGold = engine.getTotalSystemAssets().totalGold;
        const initialBlood = engine.getTotalSystemAssets().totalInventory["DRAGON_BLOOD"] ?? 0;

        for (const o of orders) {
          engine.placeOrder({
            id: o.id,
            traderId: o.traderId,
            symbol: "DRAGON_BLOOD",
            side: o.side,
            price: o.price,
            quantity: o.quantity
          });
        }

        const finalAssets = engine.getTotalSystemAssets();
        const goldConserved = finalAssets.totalGold === initialGold;
        const inventoryConserved = finalAssets.totalInventory["DRAGON_BLOOD"] === initialBlood;

        // Also check spread: Best Bid < Best Ask
        const depth = engine.getDepth();
        const bestBid = depth.bids[0]?.price;
        const bestAsk = depth.asks[0]?.price;
        const spreadOk = bestBid === undefined || bestAsk === undefined || bestBid < bestAsk;

        return goldConserved && inventoryConserved && spreadOk;
      },
      numRuns: 500
    });

    expect(pbtResult.passed).toBe(true);
  });
});
