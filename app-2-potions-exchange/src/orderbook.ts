export type Side = "BUY" | "SELL";

export interface Order {
  id: string;
  traderId: string;
  symbol: string; // e.g. "DRAGON_BLOOD", "BAT_WING"
  side: Side;
  price: number;
  quantity: number;
  filledQuantity: number;
  timestamp: number;
}

export interface Trade {
  id: string;
  makerOrderId: string;
  takerOrderId: string;
  symbol: string;
  price: number;
  quantity: number;
  timestamp: number;
}

export interface TraderBalance {
  gold: number;
  inventory: Record<string, number>;
}

export interface OrderbookDepth {
  bids: Array<{ price: number; quantity: number }>;
  asks: Array<{ price: number; quantity: number }>;
}
