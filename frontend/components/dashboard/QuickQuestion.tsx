import { Search, ShieldCheck, Database, FileSpreadsheet } from "lucide-react";
import Link from "next/link";

export default function QuickQuestion() {
  return (
    <div className="border border-slate-200 bg-white p-5 space-y-4 flex flex-col justify-between h-full font-sans">
      <div className="space-y-4">
        {/* Title */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-600">
            Sandbox // Grounded Query Simulator
          </span>
          <span className="font-mono text-[9px] text-slate-400">Sandbox Mode</span>
        </div>

        {/* Input representation */}
        <div className="space-y-1">
          <label className="block text-[9px] font-mono uppercase text-slate-400">Test Prompt Query</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <div className="block w-full pl-9 pr-3 py-2 border border-slate-200 bg-[#F8FAFC] text-xs font-bold text-slate-800">
              What are the cross-border data transfer requirements?
            </div>
          </div>
        </div>

        {/* Output representation */}
        <div className="space-y-1">
          <label className="block text-[9px] font-mono uppercase text-slate-400">Grounded Response Output</label>
          <div className="border border-slate-200 bg-white p-3 text-xs text-slate-600 leading-relaxed min-h-[90px]">
            Section 4.2 requires all cross-border transfers of EU resident data to utilize standard contractual clauses (SCCs) unless an adequacy decision is active. Furthermore, all transfer logs must be retained for 7 years under regulatory policy.
          </div>
        </div>
      </div>

      {/* Metrics and Link */}
      <div className="space-y-4 pt-2">
        <div className="grid grid-cols-2 divide-x divide-slate-100 border border-slate-200 bg-slate-50/50 text-center py-2 text-[10px] font-mono">
          <div className="flex flex-col items-center">
            <span className="text-[8px] text-slate-400 uppercase tracking-wider">Faithfulness Score</span>
            <span className="text-xs font-bold text-accent">0.96 / 1.00</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[8px] text-slate-400 uppercase tracking-wider">Sources Used</span>
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Database className="h-3 w-3 text-slate-400" />
              5 Citations
            </span>
          </div>
        </div>

        <Link
          href="/chat"
          className="w-full h-9 border border-slate-900 bg-slate-900 text-white font-mono text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-accent hover:border-accent hover:text-slate-900 transition-colors"
        >
          Open Research Workstation
        </Link>
      </div>
    </div>
  );
}
