import React, { useState } from "react";
import { Upload, FileText, X, CheckCircle2 } from "lucide-react";
import {
  parseCSVTransactions,
  generateSampleCSVTemplate,
} from "../utils/csvParser";
import type { Transaction } from "../types/portfolio";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (newTransactions: Transaction[]) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleFileProcess = (file: File) => {
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = parseCSVTransactions(text);
        if (parsed.length === 0) {
          setError(
            "No valid transactions found. Please check your CSV column format.",
          );
          return;
        }
        setSuccessCount(parsed.length);
        setTimeout(() => {
          onImport(parsed);
          setSuccessCount(null);
          onClose();
        }, 1000);
      } catch (err) {
        setError("Failed to parse CSV file format.");
      }
    };
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const template = generateSampleCSVTemplate();
    const blob = new Blob([template], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ledgerlens_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-card border border-border w-full max-w-lg rounded-2xl p-6 shadow-2xl flex flex-col gap-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div>
          <h2 className="text-lg font-semibold text-white tracking-tight">
            Import Transactions
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Upload a custom CSV file to populate LedgerLens with your own
            portfolio trade history.
          </p>
        </div>

        {/* Dropzone Area */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files?.[0]) {
              handleFileProcess(e.dataTransfer.files[0]);
            }
          }}
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-colors ${
            dragOver
              ? "border-emerald-500 bg-emerald-500/10"
              : "border-border bg-background/50"
          }`}
        >
          {successCount !== null ? (
            <div className="flex flex-col items-center gap-2 text-emerald-400">
              <CheckCircle2 className="h-10 w-10 animate-bounce" />
              <span className="text-sm font-medium">
                Successfully imported {successCount} transactions!
              </span>
            </div>
          ) : (
            <>
              <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300">
                <Upload className="h-5 w-5" />
              </div>
              <div className="text-center">
                <p className="text-sm text-zinc-300 font-medium">
                  Drag and drop your CSV file here
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  or click below to browse from your computer
                </p>
              </div>
              <label className="mt-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium rounded-lg cursor-pointer transition-colors border border-border">
                Browse CSV File
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0])
                      handleFileProcess(e.target.files[0]);
                  }}
                />
              </label>
            </>
          )}
        </div>

        {error && (
          <div className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800/50 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Template Download Row */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <FileText className="h-4 w-4 text-sky-400" />
            <span>Need the correct formatting structure?</span>
          </div>
          <button
            onClick={downloadTemplate}
            className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Download Sample CSV Template
          </button>
        </div>
      </div>
    </div>
  );
};
