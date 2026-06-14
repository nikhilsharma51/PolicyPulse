import { Upload, Cpu, Search, Merge, RefreshCcw, FileText, CheckSquare, ArrowRight, ArrowDown } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Upload",
      desc: "Raw PDF, DOCX, or markdown ingested via secure TLS channels.",
      icon: Upload
    },
    {
      step: "02",
      title: "Chunk & Embed",
      desc: "Document parsing into contextual paragraphs with dense vector mappings.",
      icon: Cpu
    },
    {
      step: "03",
      title: "Hybrid Search",
      desc: "Executes BM25 keyword matching + dense vector index lookups.",
      icon: Search,
      split: true
    },
    {
      step: "04",
      title: "RRF Fusion",
      desc: "Reciprocal Rank Fusion (RRF) standardizes and merges candidate ranks.",
      icon: Merge
    },
    {
      step: "05",
      title: "Reranking",
      desc: "Cross-encoder scoring validates query-document token dependencies.",
      icon: RefreshCcw
    },
    {
      step: "06",
      title: "Generation",
      desc: "LLM synthesis restricted strictly to verified source documents.",
      icon: FileText
    },
    {
      step: "07",
      title: "RAGAS Eval",
      desc: "Automated scoring of Faithfulness and Answer Relevance.",
      icon: CheckSquare
    }
  ];

  return (
    <section className="border-b border-slate-200 bg-white py-16 md:py-24" id="how-it-works">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl border-l-2 border-slate-800 pl-4 md:pl-6 mb-16">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Pipeline Topology // Data Sequence
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl uppercase">
            How it works
          </h2>
          <p className="mt-3 text-slate-600 font-sans text-sm md:text-base">
            From ingestion to evaluation, every request traverses a transparent, audit-ready retrieval pipeline.
          </p>
        </div>

        {/* Process Diagram: Horizontal on Desktop, Stacked on Mobile */}
        <div className="hidden lg:block space-y-8">
          <div className="grid grid-cols-7 gap-4">
            {steps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="relative flex flex-col justify-between border border-slate-200 bg-[#F8FAFC] p-4 min-h-[260px] group hover:border-slate-400 transition-colors">
                  {/* Step Num & Link Line */}
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                    <span className="font-mono text-[10px] font-bold text-accent">STEP {item.step}</span>
                    <Icon className="h-4 w-4 text-slate-500 stroke-[1.5]" />
                  </div>

                  {/* Special Visual display for Hybrid Search Split */}
                  {item.split ? (
                    <div className="flex-1 flex flex-col justify-center my-2">
                      <div className="border border-slate-300 bg-white px-2 py-1 text-[9px] font-mono text-center font-bold mb-1 text-slate-700">
                        BM25 Keyword
                      </div>
                      <div className="text-[10px] font-bold text-center text-slate-400 my-0.5">+</div>
                      <div className="border border-slate-300 bg-white px-2 py-1 text-[9px] font-mono text-center font-bold text-slate-700">
                        Dense Vector
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col justify-start">
                      <h4 className="font-sans text-xs font-bold text-slate-900 mb-1.5 uppercase">
                        {item.title}
                      </h4>
                      <p className="font-sans text-[10px] leading-relaxed text-slate-500">
                        {item.desc}
                      </p>
                    </div>
                  )}

                  {/* Connectors */}
                  {idx < steps.length - 1 && (
                    <div className="absolute top-1/2 -right-2.5 -translate-y-1/2 z-10 bg-white border border-slate-200 rounded-full p-0.5">
                      <ArrowRight className="h-3 w-3 text-slate-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Process Flow (Vertical) */}
        <div className="lg:hidden space-y-4">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex flex-col border border-slate-200 bg-[#F8FAFC] p-5 relative">
                <div className="flex items-center gap-3 border-b border-slate-200 pb-3 mb-3">
                  <span className="font-mono text-xs font-bold text-accent">STEP {item.step}</span>
                  <Icon className="h-5 w-5 text-slate-600 stroke-[1.5]" />
                  <h4 className="font-sans text-sm font-bold text-slate-900 uppercase ml-auto">
                    {item.title}
                  </h4>
                </div>

                {item.split ? (
                  <div className="grid grid-cols-2 gap-2 my-2">
                    <div className="border border-slate-200 bg-white p-2 text-[10px] font-mono text-center text-slate-700">
                      BM25 Index
                    </div>
                    <div className="border border-slate-200 bg-white p-2 text-[10px] font-mono text-center text-slate-700">
                      Dense Vector
                    </div>
                  </div>
                ) : (
                  <p className="font-sans text-xs text-slate-600">
                    {item.desc}
                  </p>
                )}

                {/* Vertical connector arrow */}
                {idx < steps.length - 1 && (
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10 bg-white border border-slate-200 rounded-full p-0.5">
                    <ArrowDown className="h-3 w-3 text-slate-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
