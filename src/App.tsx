import React, { useMemo, useState } from "react";
import { generateMockTransactions } from "./data/mockData";
import { calculateHoldings } from "./utils/portfolioCalculations";
import { LedgerTable } from "./components/LedgerTable";
import { HoldingsTable } from "./components/HoldingsTable";
import { ImportModal } from "./components/ImportModel";
import {
  DollarSign,
  Activity,
  ShieldCheck,
  Layers,
  Database,
  UploadCloud,
} from "lucide-react";
import type { Transaction } from "./types/portfolio";

export default function App() {
  const [activeTab, setActiveTab] = useState<"ledger" | "holdings">("ledger");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // State for transactions (defaults to 15,000 mock items, can be overridden by user import)
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    generateMockTransactions(15000),
  );

  const holdings = useMemo(
    () => calculateHoldings(transactions),
    [transactions],
  );

  const totalPortfolioValue = useMemo(() => {
    return holdings.reduce((acc, h) => acc + h.marketValue, 0);
  }, [holdings]);

  return (
    <div className="min-h-screen bg-background text-zinc-100 flex flex-col justify-between">
      <div>
        {/* Top Navigation Bar */}
        <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-50 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              LL
            </div>
            <div>
              <h1 className="font-semibold tracking-tight text-white flex items-center gap-2">
                LedgerLens{" "}
                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-mono font-normal">
                  v1.0.0-sandbox
                </span>
              </h1>
              <p className="text-xs text-zinc-400">
                Track investments and trade history with mock data or custom CSV
                imports
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-lg cursor-pointer"
            >
              <UploadCloud className="h-4 w-4" /> Import CSV
            </button>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="h-3.5 w-3.5" /> 60 FPS Virtualised Engine
              Active
            </span>
          </div>
        </header>

        {/* Main Dashboard Container */}
        <main className="max-w-7xl w-full mx-auto px-8 py-8 flex flex-col gap-8">
          {/* Metric Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-card border border-border rounded-xl p-6 flex flex-col justify-between shadow-lg">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-sm font-medium">
                  Net Portfolio Valuation
                </span>
                <DollarSign className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white">
                $
                {totalPortfolioValue.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </div>
              <div className="text-xs text-emerald-400 mt-1">
                Aggregated across active positions
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 flex flex-col justify-between shadow-lg">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-sm font-medium">
                  Processed Transactions
                </span>
                <Activity className="h-4 w-4 text-sky-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white">
                {transactions.length.toLocaleString()}
              </div>
              <div className="text-xs text-zinc-400 mt-1">
                Historical ledger stream parsed
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 flex flex-col justify-between shadow-lg">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-sm font-medium">Active Positions</span>
                <ShieldCheck className="h-4 w-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white">
                {holdings.length} Assets
              </div>
              <div className="text-xs text-zinc-400 mt-1">
                Multi-currency cost basis tracking
              </div>
            </div>
          </div>

          {/* View Switcher Tabs */}
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("ledger")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === "ledger"
                    ? "bg-zinc-800 text-white border border-border"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                <Database className="h-4 w-4 text-sky-400" />
                Transactional Ledger Stream (
                {transactions.length.toLocaleString()})
              </button>
              <button
                onClick={() => setActiveTab("holdings")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === "holdings"
                    ? "bg-zinc-800 text-white border border-border"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                <Layers className="h-4 w-4 text-emerald-400" />
                Portfolio Holdings Rollup ({holdings.length})
              </button>
            </div>
          </div>

          {/* Dynamic View Section */}
          <section className="flex flex-col gap-4">
            {activeTab === "ledger" ? (
              <LedgerTable data={transactions} />
            ) : (
              <HoldingsTable holdings={holdings} />
            )}
          </section>
        </main>
      </div>

      {/* Professional Footer & Simulation Disclaimer (NZ English) */}
      <footer className="border-t border-border bg-card/30 px-8 py-6 mt-12 text-center text-xs text-zinc-500 flex flex-col gap-1.5">
        <p>
          LedgerLens is a frontend performance engineering and portfolio
          simulation sandbox. All data is simulated and does not represent real
          market conditions, corporate actions, or investment advice. This is
          only a portfolio project.
        </p>
        <p className="text-zinc-600">
          All data is simulated and does not represent real market conditions,
          corporate actions, or investment advice.
        </p>
      </footer>

      {/* CSV Import Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={(newTxns) => setTransactions(newTxns)}
      />
    </div>
  );
}
