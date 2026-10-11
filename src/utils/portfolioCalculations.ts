import type { Transaction, Holding } from "../types/portfolio";

export function calculateHoldings(transactions: Transaction[]): Holding[] {
  const holdingsMap: Record<
    string,
    { totalShares: number; totalCost: number; currency: any; name: string }
  > = {};

  // Sort chronologically oldest to newest for accurate cost basis calculation
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  for (const txn of sorted) {
    if (!holdingsMap[txn.ticker]) {
      holdingsMap[txn.ticker] = {
        totalShares: 0,
        totalCost: 0,
        currency: txn.currency,
        name: txn.name,
      };
    }

    const holding = holdingsMap[txn.ticker];

    if (txn.type === "BUY") {
      holding.totalShares += txn.shares;
      holding.totalCost += txn.totalValue;
    } else if (txn.type === "SELL") {
      const avgCost =
        holding.totalShares > 0 ? holding.totalCost / holding.totalShares : 0;
      holding.totalShares -= txn.shares;
      holding.totalCost -= txn.shares * avgCost;
    } else if (txn.type === "SPLIT") {
      holding.totalShares += txn.shares; // assuming split shares modifier
    }
    // Dividends don't change share count or cost basis of the holding directly
  }

  return Object.entries(holdingsMap)
    .map(([ticker, data]) => {
      const totalShares = Math.max(0, data.totalShares);
      const avgCostBasis = totalShares > 0 ? data.totalCost / totalShares : 0;

      // Simulate a random current market price hovering around cost basis (+/- 15%)
      const randomMultiplier = 0.85 + Math.random() * 0.3;
      const currentPrice = parseFloat(
        (avgCostBasis * randomMultiplier).toFixed(2),
      );
      const marketValue = parseFloat((totalShares * currentPrice).toFixed(2));
      const costBasisTotal = parseFloat(
        (totalShares * avgCostBasis).toFixed(2),
      );
      const unrealizedGainLoss = parseFloat(
        (marketValue - costBasisTotal).toFixed(2),
      );

      return {
        ticker,
        name: data.name,
        totalShares: parseFloat(totalShares.toFixed(2)),
        avgCostBasis: parseFloat(avgCostBasis.toFixed(2)),
        currentPrice,
        marketValue,
        currency: data.currency,
        unrealizedGainLoss,
      };
    })
    .filter((h) => h.totalShares > 0);
}
