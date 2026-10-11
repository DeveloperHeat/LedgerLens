export type Currency = "NZD" | "AUD" | "USD";

export type TransactionType = "BUY" | "SELL" | "DIVIDEND" | "SPLIT";

export interface Transaction {
  id: string;
  date: string;
  ticker: string;
  name: string;
  type: TransactionType;
  shares: number;
  pricePerShare: number;
  currency: Currency;
  totalValue: number;
}

export interface Holding {
  ticker: string;
  name: string;
  totalShares: number;
  avgCostBasis: number;
  currentPrice: number;
  marketValue: number;
  currency: Currency;
  unrealizedGainLoss: number;
}
