# Design: App-2 Potions Exchange

## 1. Matching Algorithm
Double auction matching with FIFO price-time priority. Orders are indexed by price levels with doubly-linked FIFO queues.

## 2. Invariant Specifications for Fast-Check
```typescript
// Invariant 1: Conservation of Gold & Asset Shares
fc.assert(
  fc.property(fc.array(orderArbitrary), (orders) => {
    const engine = new OrderbookEngine();
    const initialBalance = engine.getTotalBalance();
    orders.forEach(o => engine.placeOrder(o));
    return engine.getTotalBalance() === initialBalance;
  })
);
```
