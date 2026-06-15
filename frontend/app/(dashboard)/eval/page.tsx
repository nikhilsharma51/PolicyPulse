import MetricsGrid from "@/components/eval/MetricsGrid";
import TrendChart from "@/components/eval/TrendChart";
import QueryHistory from "@/components/eval/QueryHistory";
import { ShieldAlert, Compass, Server } from "lucide-react";

export default function EvalPage() {
  return (
    <div className="p-6 space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-4 gap-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-tight text-slate-900">
            Automated Quality & RAGAS Evaluation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Groundedness metrics, answer relevancies, and context recalls computed across index partitions.
          </p>
        </div>

        {/* System node tag */}
        
      </div>

      {/* RAGAS Metrics Grid */}
      <MetricsGrid />

      {/* Charts and History Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* SVG Trend Chart (Col-span 7) */}
        <div className="lg:col-span-7 flex flex-col">
          <TrendChart />
        </div>

        {/* Evaluation Summary block (Col-span 5) */}
        <div className="lg:col-span-5 border border-slate-200 bg-white p-5 space-y-4">
          <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <ShieldAlert className="h-4 w-4 text-slate-400" />
              Evaluation Performance Summary
            </span>
            <span className="font-mono text-[9px] text-slate-400">QA Report</span>
          </div>

          <div className="space-y-3 font-mono text-[11px] leading-relaxed">
            <div className="flex justify-between border-b border-slate-50 py-1.5">
              <span className="text-slate-500">Evaluation batches run</span>
              <span className="font-bold text-slate-800">109</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 py-1.5">
              <span className="text-slate-500">Avg query latency</span>
              <span className="font-bold text-slate-800">134ms</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 py-1.5">
              <span className="text-slate-500">System grounding compliance</span>
              <span className="font-bold text-emerald-600">96.4% Compliant</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Audit threshold parameter</span>
              <span className="font-bold text-accent">0.90 baseline</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed pt-2 border-t border-slate-100">
            The automated RAGAS framework computes semantic similarity grids comparing LLM outputs with matching document source chunks. Batches failing the 0.90 faithfulness baseline are quarantined and flagged for manual audit review immediately.
          </p>

          <div className="border border-slate-200 bg-slate-50/50 px-3 py-2 text-[9px] font-mono text-slate-500 uppercase tracking-wide text-center">
            // Quarantined Queries: <span className="font-bold text-red-600">0 Active</span>
          </div>
        </div>

      </div>

      {/* Query History Log */}
      <QueryHistory />

    </div>
  );
}
