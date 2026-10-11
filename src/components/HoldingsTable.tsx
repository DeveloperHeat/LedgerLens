import React, { useMemo } from "react";
import type { Holding } from "../types/portfolio";
import { TrendingUp, TrendingDown } from "lucide-react";

interface HoldingsTableProps {
  holdings: Holding[];
}

export const HoldingsTable: React.FC<HoldingsTableProps> = ({ holdings }) => {
  return (
    <div className="flex flex-col h-[650px] bg-card border border-border rounded-xl overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/50">
        <h3 className="font-semibold text-white tracking-tight">
          Active Portfolio Holdings (Aggregated)
        </h3>
        <div className="text-xs font-mono text-zinc-400">
          Tracking{" "}
          <span className="text-white font-bold">{holdings.length}</span> unique
          positions
        </div>
      </div>

      <div className="grid grid-cols-7 bg-background/80 border-b border-border text-xs font-semibold text-zinc-400 uppercase tracking-wider px-6 py-3">
        <div>Ticker / Asset</div>
        <div>Currency</div>
        <div>Net Shares</div>
        <div>Avg Cost Basis</div>
        <div>Current Price</div>
        <div>Market Value</div>
        <div className="text-right">Unrealized Gain/Loss</div>
      </div>

      <div className="flex-1 overflow-auto divide-y divide-border/40">
        {holdings.map((h) => {
          const isPositive = h.unrealizedGainLoss >= 0;
          return (
            <div
              key={h.ticker}
              className="grid grid-cols-7 items-center px-6 py-3.5 text-sm hover:bg-zinc-800/40 transition-colors"
            >
              <div>
                <div className="font-semibold text-white">{h.ticker}</div>
                <div className="text-xs text-zinc-400 truncate">{h.name}</div>
              </div>
              <div className="font-mono text-xs text-zinc-400">
                {h.currency}
              </div>
              <div className="font-mono">{h.totalShares.toLocaleString()}</div>
              <div className="font-mono">${h.avgCostBasis.toFixed(2)}</div>
              <div className="font-mono">${h.currentPrice.toFixed(2)}</div>
              <div className="font-mono font-medium text-white">
                ${h.marketValue.toLocaleString()}
              </div>
              <div
                className={`font-mono text-right flex items-center justify-end gap-1 ${isPositive ? "text-emerald-400" : "text-rose-400"}`}
              >
                {isPositive ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" />
                )}
                ${Math.abs(h.unrealizedGainLoss).toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
