import { ArrowDown, Cpu, Server, CheckSquare, Layers, Search, RefreshCcw, Database } from "lucide-react";

export default function ArchitectureSection() {
  const pipeline = [
    {
      stage: "01",
      title: "Documents Ingestion",
      desc: "TLS-secured upload. Text extraction via Apache Tika/custom OCR. Text normalization.",
     
    },
    {
      stage: "02",
      title: "Chunking & Tokenization",
      desc: "Recursive character split with semantic overlap thresholds. Token size limit: 512 tokens.",
      
    },
    {
      stage: "03",
      title: "Dense Embeddings",
      desc: "High-dimensional vector computation mapping documents to semantic space.",
      
    },
    {
      stage: "04",
      title: "Hybrid Retrieval",
      desc: "Parallel search: Dense vector search (HNSW index) + BM25 keyword index lookup.",
      
    },
    {
      stage: "05",
      title: "RRF Rank Fusion",
      desc: "Merges ranked candidate lists using Reciprocal Rank Fusion formulas.",
      
    },
    {
      stage: "06",
      title: "Cross-Encoder Reranking",
      desc: "Deploys cross-encoder scoring to evaluate direct question-context token interaction.",
      
    },
    {
      stage: "07",
      title: "LLM Context Compilation",
      desc: "Top 5 chunks compiled into prompt context. LLM restricted to context—no database access.",
      
    },
    {
      stage: "08",
      title: "RAGAS Evaluation",
      desc: "Real-time checking of Faithfulness (grounding) and Answer Relevance (context overlap).",
      
    }
  ];

  return (
    <section className="border-b border-slate-200 bg-slate-50 py-16 md:py-24" id="architecture">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl border-l-2 border-slate-800 pl-4 md:pl-6 mb-16">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
            System Architecture // Technical Deep-Dive
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl uppercase">
            Built on transparent retrieval systems
          </h2>
          <p className="mt-3 text-slate-600 font-sans text-sm md:text-base">
            We don't hide our search logic behind APIs. Below is the precise multi-stage retrieval architecture that executes on every user query.
          </p>
        </div>

        {/* System Diagram Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch font-sans">
          
          {/* Left Side: Detail explanation of blocks (col-span-8) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pipeline.map((item, idx) => (
                <div key={idx} className="border border-slate-200 bg-white p-5 space-y-3 relative hover:border-slate-400 transition-colors">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-accent">
                      Node {item.stage}
                    </span>
                    <span className="font-mono text-[9px] text-slate-400 bg-slate-50 px-1.5 py-0.5 border border-slate-200">
                      {item.tech}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase">
                    {item.title}
                  </h4>
                  <p className="text-[11px] leading-relaxed text-slate-500">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Visual Flow Chart (col-span-4) */}
          <div className="lg:col-span-4 border border-slate-200 bg-slate-900 text-slate-200 p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_0%,#C0843D_0%,transparent_100%)] opacity-10"></div>
            
            <div className="relative z-10 space-y-4 flex-1 flex flex-col">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <Server className="h-4.5 w-4.5 text-accent" /> pipeline_flow.log
                </span>
                <span className="text-[9px] font-mono text-emerald-500">online</span>
              </div>

              {/* Visual Nodes List */}
              <div className="flex-1 flex flex-col justify-between items-center py-2 space-y-2 font-mono text-[10px] uppercase text-center w-full">
                <div className="w-full border border-slate-800 bg-slate-950 py-1.5 text-slate-300">
                  Documents Source
                </div>
                <ArrowDown className="h-3 w-3 text-accent" />
                <div className="w-full border border-slate-800 bg-slate-950 py-1.5 text-slate-300">
                  Semantic Chunking
                </div>
                <ArrowDown className="h-3 w-3 text-accent" />
                <div className="w-full border border-slate-800 bg-slate-950 py-1.5 text-slate-300">
                  Vector Embedding
                </div>
                <ArrowDown className="h-3 w-3 text-accent" />
                <div className="w-full border border-slate-800 bg-slate-950 py-1.5 text-slate-200 flex divide-x divide-slate-800">
                  <div className="w-1/2 text-center py-0.5">BM25 Search</div>
                  <div className="w-1/2 text-center py-0.5">Dense Vector</div>
                </div>
                <ArrowDown className="h-3 w-3 text-accent" />
                <div className="w-full border border-slate-800 bg-slate-950 py-1.5 text-slate-300">
                  Reciprocal Rank Fusion
                </div>
                <ArrowDown className="h-3 w-3 text-accent" />
                <div className="w-full border border-slate-800 bg-slate-950 py-1.5 text-slate-300">
                  Cross-Encoder Rerank
                </div>
                <ArrowDown className="h-3 w-3 text-accent" />
                <div className="w-full border border-slate-800 bg-slate-950 py-1.5 text-slate-300">
                  LLM Generation (Ground)
                </div>
                <ArrowDown className="h-3 w-3 text-accent" />
                <div className="w-full border border-accent bg-accent/10 py-1.5 text-accent font-bold">
                  RAGAS Verification
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
