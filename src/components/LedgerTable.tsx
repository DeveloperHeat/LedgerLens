import React, { useState, useMemo, useRef } from "react";
import {
  useTable,
  tableFeatures,
  rowSortingFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  columnVisibilityFeature,
  createSortedRowModel,
  createFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { Transaction } from "../types/portfolio";
import { Search, ArrowUpDown } from "lucide-react";

interface LedgerTableProps {
  data: Transaction[];
}

export const LedgerTable: React.FC<LedgerTableProps> = ({ data }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const features = tableFeatures({
    rowSortingFeature,
    columnFilteringFeature,
    globalFilteringFeature,
    columnVisibilityFeature,
    sortedRowModel: createSortedRowModel(),
    filteredRowModel: createFilteredRowModel(),
  });

  const columns = useMemo<ColumnDef<typeof features, Transaction, unknown>[]>(
    () => [
      {
        accessorKey: "date",
        header: "Date",
        cell: (info) => (
          <span className="text-zinc-400 font-mono">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "ticker",
        header: "Ticker",
        cell: (info) => (
          <span className="font-semibold text-white">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "name",
        header: "Asset Name",
        cell: (info) => (
          <span className="text-zinc-300">{info.getValue() as string}</span>
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: (info) => {
          const type = info.getValue() as string;
          const colorMap: Record<string, string> = {
            BUY: "text-emerald-400 bg-emerald-950/40 border-emerald-800/50",
            SELL: "text-rose-400 bg-rose-950/40 border-rose-800/50",
            DIVIDEND: "text-sky-400 bg-sky-950/40 border-sky-800/50",
            SPLIT: "text-amber-400 bg-amber-950/40 border-amber-800/50",
          };
          return (
            <span
              className={`px-2 py-0.5 text-xs font-mono rounded border ${colorMap[type] || "text-zinc-300"}`}
            >
              {type}
            </span>
          );
        },
      },
      {
        accessorKey: "shares",
        header: "Shares",
        cell: (info) => (
          <span className="font-mono">
            {Number(info.getValue()).toLocaleString()}
          </span>
        ),
      },
      {
        accessorKey: "pricePerShare",
        header: "Price",
        cell: (info) => (
          <span className="font-mono">
            ${Number(info.getValue()).toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: "currency",
        header: "CCY",
        cell: (info) => (
          <span className="text-zinc-400 font-mono text-xs">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "totalValue",
        header: "Total Value",
        cell: (info) => (
          <span className="font-mono font-medium text-white">
            $
            {Number(info.getValue()).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </span>
        ),
      },
    ],
    [],
  );

  const table = useTable({
    features,
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
  });

  const { rows } = table.getRowModel();
  const parentRef = useRef<HTMLDivElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 45,
    overscan: 15,
  });

  return (
    <div className="flex flex-col h-[650px] bg-card border border-border rounded-xl overflow-hidden shadow-2xl">
      {/* Search Header Controls */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/50">
        <div className="relative w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search transactions..."
            className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-1.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
          />
        </div>
        <div className="text-xs font-mono text-zinc-400">
          Showing{" "}
          <span className="text-white font-bold">
            {rows.length.toLocaleString()}
          </span>{" "}
          ledger entries (Virtualised)
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-8 bg-background/80 border-b border-border text-xs font-semibold text-zinc-400 uppercase tracking-wider px-6 py-3">
        {table.getHeaderGroups().map((headerGroup) =>
          headerGroup.headers.map((header) => (
            <div
              key={header.id}
              onClick={header.column.getToggleSortingHandler()}
              className="flex items-center gap-1 cursor-pointer select-none hover:text-white"
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
              {header.column.getCanSort() && (
                <ArrowUpDown className="h-3 w-3 opacity-50" />
              )}
            </div>
          )),
        )}
      </div>

      {/* Virtualized Body Container */}
      <div
        ref={parentRef}
        className="flex-1 overflow-auto relative divide-y divide-border/40"
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index];
            const visibleCells = row.getVisibleCells();

            return (
              <div
                key={row.id}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                className="grid grid-cols-8 items-center px-6 text-sm hover:bg-zinc-800/40 transition-colors border-b border-border/20"
              >
                {visibleCells.map((cell: (typeof visibleCells)[number]) => (
                  <div key={cell.id} className="truncate pr-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
