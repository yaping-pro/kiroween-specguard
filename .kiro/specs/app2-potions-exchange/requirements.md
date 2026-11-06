# Requirements: App-2 Potions Exchange (Dark Matching Engine)

## 1. Overview
Potions Exchange demonstrates SpecGuard applied to high-frequency financial trading algorithms: an in-memory limit orderbook matching engine for Halloween ingredients (Bat Wings, Dragon Blood, Moon Dust).

## 2. EARS Specification

### REQ-EXCH-001: Limit Order Matching
WHEN a Buy or Sell limit order is submitted, THE Engine SHALL match it against opposite orders adhering strictly to Price-Time priority.

### REQ-EXCH-002: Invariant - Conservation of Value
WHEN trades execute or orders cancel, THE Ledger SHALL ensure the total sum of allocated assets and buyer/seller balances remains strictly conserved.

### REQ-EXCH-003: Invariant - No Crossed Book Post-Matching
WHEN matching completes for any order event, THE Orderbook SHALL ensure $\max(\text{Bids}) < \min(\text{Asks})$ holds true.

### REQ-EXCH-004: Invariant - Volume Non-Negativity
WHEN any partial fill occurs, THE Remaining Quantities for all resting orders SHALL be strictly non-negative.
