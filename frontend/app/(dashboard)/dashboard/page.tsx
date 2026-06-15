import MetricsRow from "@/components/dashboard/MetricsRow";
import RecentActivity from "@/components/dashboard/RecentActivity";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import QuickQuestion from "@/components/dashboard/QuickQuestion";
import { Server, Compass, Network } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6 font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-4 gap-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-tight text-slate-900">
            Policy Intelligence Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time compliance monitoring, document parsing state, and grounded retrieval logs.
          </p>
        </div>
        
        {/* System state metrics badges */}
        <div className="flex items-center gap-3 text-[10px] font-mono">
          <div className="px-2.5 py-1 border border-slate-200 bg-white flex items-center gap-1.5 text-slate-600">
            <Server className="h-3 w-3 text-slate-400" />
            <span>NODE: US-EAST-09</span>
          </div>
          <div className="px-2.5 py-1 border border-slate-200 bg-white flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            </span>
            <span>SYS_ONLINE</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <MetricsRow />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Recent Activity (Col-span 8) */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          <RecentActivity />
        </div>

        {/* Right Column: Alerts Panel (Col-span 4) */}
        <div className="lg:col-span-4 flex flex-col">
          <AlertsPanel />
        </div>

      </div>

      {/* Sub Grid for Secondary details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Ask Question Simulator Panel (Col-span 5) */}
        <div className="lg:col-span-5 flex flex-col">
          <QuickQuestion />
        </div>

        {/* System Infrastructure Note (Col-span 7) */}
        <div className="lg:col-span-7 border border-slate-200 bg-white p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Network className="h-4 w-4 text-slate-400" />
                Pipeline Cluster Status
              </span>
              <span className="font-mono text-[9px] text-slate-400">RAG Topology</span>
            </div>

            <div className="grid grid-cols-3 gap-4 font-mono text-[10px]">
              <div className="border border-slate-100 p-3 bg-[#F8FAFC]">
                <span className="block text-slate-400 text-[8px] uppercase">RRF Fusion Config</span>
                <span className="font-bold text-slate-700 block mt-1">k=60 (Tuned)</span>
              </div>
              <div className="border border-slate-100 p-3 bg-[#F8FAFC]">
                <span className="block text-slate-400 text-[8px] uppercase">Cross-Encoder</span>
                <span className="font-bold text-slate-700 block mt-1">bge-reranker-large</span>
              </div>
              <div className="border border-slate-100 p-3 bg-[#F8FAFC]">
                <span className="block text-slate-400 text-[8px] uppercase">Retrieval Index</span>
                <span className="font-bold text-slate-700 block mt-1">HNSW Vector + BM25</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              All parsed document chunks are indexed inside isolated tenant spaces using 256-bit TLS encryption at rest. Query executions trigger Reciprocal Rank Fusion (RRF) vectors merging dense and keyword match matrices dynamically before re-evaluating context scores via cross-encoder token dependency paths.
            </p>
          </div>

          <div className="border-t border-slate-100 pt-3 mt-4 flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span>Model Endpoint: Llama-3-70B-Instruct</span>
            <span>Cluster SLA: 99.99%</span>
          </div>
        </div>

      </div>

    </div>
  );
}
