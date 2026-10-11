import type {
  Transaction,
  Currency,
  TransactionType,
} from "../types/portfolio";

export function parseCSVTransactions(csvText: string): Transaction[] {
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) return [];

  // Expected headers: date, ticker, name, type, shares, pricePerShare, currency
  const transactions: Transaction[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV split (handling standard commas)
    const cols = line
      .split(",")
      .map((c) => c.trim().replace(/^["']|["']$/g, ""));
    if (cols.length < 7) continue;

    const [date, ticker, name, typeStr, sharesStr, priceStr, ccyStr] = cols;
    const shares = parseFloat(sharesStr);
    const pricePerShare = parseFloat(priceStr);

    if (isNaN(shares) || isNaN(pricePerShare)) continue;

    transactions.push({
      id: `import-${i}-${Date.now()}`,
      date: date || new Date().toISOString().split("T")[0],
      ticker: ticker || "UNKNOWN",
      name: name || "Unknown Asset",
      type: (["BUY", "SELL", "DIVIDEND", "SPLIT"].includes(
        typeStr.toUpperCase(),
      )
        ? typeStr.toUpperCase()
        : "BUY") as TransactionType,
      shares,
      pricePerShare,
      currency: (["NZD", "AUD", "USD"].includes(ccyStr.toUpperCase())
        ? ccyStr.toUpperCase()
        : "NZD") as Currency,
      totalValue: parseFloat((shares * pricePerShare).toFixed(2)),
    });
  }

  // Sort descending by date
  return transactions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function generateSampleCSVTemplate(): string {
  return `date,ticker,name,type,shares,pricePerShare,currency
2026-01-15,AAPL,Apple Inc.,BUY,50,180.50,USD
2026-02-10,BHP.AX,BHP Group Limited,BUY,100,42.00,AUD
2026-03-01,FPH.NZ,Fisher & Paykel Healthcare,BUY,200,32.40,NZD
2026-03-15,AAPL,Apple Inc.,DIVIDEND,0,0.50,USD
2026-04-05,BHP.AX,BHP Group Limited,SELL,25,45.00,AUD`;
}
