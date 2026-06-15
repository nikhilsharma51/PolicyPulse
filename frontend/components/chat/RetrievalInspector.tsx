import { Terminal, Cpu, Network, Layers, Percent, Search } from "lucide-react";

interface InspectorLogs {
  query: string;
  bm25Count: number;
  vectorCount: number;
  rrfCandidates: number;
  crossEncoderScore: number;
  latencyMs: number;
  vectorDistance: number;
}

interface RetrievalInspectorProps {
  logs: InspectorLogs;
}

export default function RetrievalInspector({ logs }: RetrievalInspectorProps) {
  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-300 font-mono text-[10px] border-t border-slate-800">
      
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
        <span className="font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
          <Terminal className="h-4 w-4 text-accent" />
          Retrieval Inspector Debugger
        </span>
        <span className="text-[9px] text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold uppercase tracking-wider">
          log_active
        </span>
      </div>

      {/* Main Debugger Body */}
      <div className="p-4 space-y-4 overflow-y-auto flex-1 leading-normal">
        
        {/* Original Query */}
        <div className="space-y-1">
          <span className="text-slate-500 uppercase text-[8px] tracking-wider font-bold block">// Original Input Query</span>
          <div className="bg-slate-900 p-2.5 border border-slate-800 text-white leading-relaxed break-all">
            "{logs.query}"
          </div>
        </div>

        {/* Phase 1: Dual Retrieval */}
        <div className="border border-slate-800 bg-slate-900/20 p-3 space-y-2">
          <span className="text-slate-500 uppercase text-[8px] tracking-wider font-bold block">// Ingestion Stage 1: Dual Index Lookup</span>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-950 p-2 border border-slate-850">
              <span className="text-slate-500 text-[8px] uppercase block">BM25 Keyword matches</span>
              <span className="text-xs font-bold text-accent block mt-1">{logs.bm25Count} Documents</span>
            </div>
            <div className="bg-slate-950 p-2 border border-slate-850">
              <span className="text-slate-500 text-[8px] uppercase block">Dense HNSW vector matches</span>
              <span className="text-xs font-bold text-accent block mt-1">{logs.vectorCount} Chunks</span>
            </div>
          </div>
          <div className="flex justify-between items-center text-[8px] text-slate-500 pt-1">
            <span>INDEX: HNSW_COSINE_3072</span>
            <span>VECTOR DISTANCE: {logs.vectorDistance}</span>
          </div>
        </div>

        {/* Phase 2: RRF Fusion */}
        <div className="border border-slate-800 bg-slate-900/20 p-3 space-y-2">
          <span className="text-slate-500 uppercase text-[8px] tracking-wider font-bold block">// Ingestion Stage 2: Reciprocal Rank Fusion</span>
          <div className="bg-slate-950 p-2.5 border border-slate-850 space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Candidate Pool Size:</span>
              <span className="text-white font-bold">{logs.rrfCandidates} candidates</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>RRF Weight Constant (k):</span>
              <span className="text-slate-300">60.0 (Standard)</span>
            </div>
          </div>
          <span className="text-[8px] text-slate-500 block leading-tight">
            Formula: RRF_Score(d ∈ D) = ∑ (1 / (60 + r_m(d))) for m ∈ [BM25, Vector]
          </span>
        </div>

        {/* Phase 3: Cross Encoder Rerank */}
        <div className="border border-slate-800 bg-slate-900/20 p-3 space-y-2">
          <span className="text-slate-500 uppercase text-[8px] tracking-wider font-bold block">// Ingestion Stage 3: Cross-Encoder Rerank</span>
          <div className="bg-slate-950 p-2.5 border border-slate-850 flex justify-between items-center">
            <div>
              <span className="text-slate-500 text-[8px] uppercase block">Peak Grounding Confidence</span>
              <span className="text-xs font-bold text-emerald-500 mt-1 block">{logs.crossEncoderScore * 100}%</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 text-[8px] uppercase block">Reranker compute latency</span>
              <span className="text-xs font-bold text-slate-300 mt-1 block">{logs.latencyMs}ms</span>
            </div>
          </div>
          <span className="text-[8px] text-slate-500 block leading-tight">
            Model: bge-reranker-large. Direct Token-Context matrix multiplication.
          </span>
        </div>

      </div>

      {/* Debugger Footer */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 flex justify-between items-center text-[8px] text-slate-500">
        <span>ENCODER: COHERE_V3</span>
        <span>LATENCY: {logs.latencyMs}ms</span>
      </div>

    </div>
  );
}
