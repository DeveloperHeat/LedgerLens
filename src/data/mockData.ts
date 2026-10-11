import type { Transaction } from "../types/portfolio";

const tickers = [
  {
    ticker: "FPH.NZ",
    name: "Fisher & Paykel Healthcare",
    currency: "NZD",
    basePrice: 32.5,
  },
  {
    ticker: "RYM.NZ",
    name: "Ryman Healthcare",
    currency: "NZD",
    basePrice: 3.8,
  },
  {
    ticker: "A2M.NZ",
    name: "a2 Milk Company",
    currency: "NZD",
    basePrice: 6.2,
  },
  {
    ticker: "BHP.AX",
    name: "BHP Group Limited",
    currency: "AUD",
    basePrice: 42.1,
  },
  {
    ticker: "MQG.AX",
    name: "Macquarie Group",
    currency: "AUD",
    basePrice: 185.0,
  },
  { ticker: "AAPL", name: "Apple Inc.", currency: "USD", basePrice: 182.3 },
  {
    ticker: "MSFT",
    name: "Microsoft Corporation",
    currency: "USD",
    basePrice: 415.5,
  },
];

export function generateMockTransactions(count: number = 15000): Transaction[] {
  const transactions: Transaction[] = [];
  const types: Transaction["type"][] = ["BUY", "SELL", "DIVIDEND", "SPLIT"];

  for (let i = 1; i <= count; i++) {
    const asset = tickers[Math.floor(Math.random() * tickers.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const shares =
      type === "DIVIDEND"
        ? 0
        : parseFloat((Math.random() * 500 + 10).toFixed(2));
    const pricePerShare = parseFloat(
      (asset.basePrice * (0.8 + Math.random() * 0.4)).toFixed(2),
    );

    // Generate dates over the past 3 years
    const daysAgo = Math.floor(Math.random() * 1095);
    const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    transactions.push({
      id: `txn-${i}`,
      date,
      ticker: asset.ticker,
      name: asset.name,
      type,
      shares,
      pricePerShare,
      currency: asset.currency as any,
      totalValue: parseFloat((shares * pricePerShare).toFixed(2)),
    });
  }

  // Sort descending by date
  return transactions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}
