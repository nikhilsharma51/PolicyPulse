"use client";

import { FileText, Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import type { Document } from "@/lib/api";

interface DocumentSelectorProps {
  documents: Document[];
  selectedId: string;
  onSelect: (docId: string) => void;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export default function DocumentSelector({
  documents,
  selectedId,
  onSelect,
  loading,
  error,
  onRefresh,
}: DocumentSelectorProps) {
  return (
    <div className="w-56 border-r border-slate-200 bg-[#F8FAFC] flex flex-col h-full shrink-0 font-sans">
      <div className="px-4 py-3.5 border-b border-slate-200 bg-slate-100/60 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <FileText className="h-4 w-4 text-slate-400" />
          Your Documents
        </span>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="text-slate-400 hover:text-slate-600 disabled:opacity-50"
          aria-label="Refresh documents"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="p-2 space-y-1 overflow-y-auto flex-grow">
        {loading && documents.length === 0 ? (
          <div className="flex items-center justify-center gap-2 py-8 text-[10px] font-mono text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading documents...
          </div>
        ) : null}

        {error ? (
          <div className="flex items-start gap-2 border border-red-200 bg-red-50 px-3 py-2 text-[10px] text-red-700">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        ) : null}

        {!loading && !error && documents.length === 0 ? (
          <div className="px-3 py-6 text-center text-[10px] font-mono text-slate-400 leading-relaxed">
            No documents yet.
            <br />
            Upload a PDF on the Documents page first.
          </div>
        ) : null}

        {documents.map((doc) => {
          const isSelected = selectedId === doc.id;
          return (
            <button
              key={doc.id}
              type="button"
              onClick={() => onSelect(doc.id)}
              className={`w-full text-left p-3 border transition-colors ${
                isSelected
                  ? "border-slate-800 bg-white shadow-sm"
                  : "border-transparent hover:bg-slate-200/50"
              }`}
            >
              <div className={`text-xs font-bold truncate ${isSelected ? "text-slate-950" : "text-slate-700"}`}>
                {doc.name}
              </div>
              <div className="flex justify-between items-center mt-1 text-[9px] font-mono text-slate-400">
                <span>
                  {doc.chunk_count != null ? `${doc.chunk_count} chunks` : "indexed"}
                </span>
                <span className="shrink-0">
                  {new Date(doc.created_at).toLocaleDateString()}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="p-3 border-t border-slate-200 bg-white text-center font-mono text-[9px] text-slate-400">
        {selectedId ? "DOCUMENT SELECTED" : "SELECT A DOCUMENT"}
      </div>
    </div>
  );
}
