import { Layers, Shuffle, Link2, BarChart3, Copy, Eye } from "lucide-react";

export default function FeaturesGrid() {
  const features = [
    {
      num: "01",
      icon: Layers,
      title: "Hybrid Retrieval",
      description: "Combines dense vector search and BM25 keyword retrieval to capture both semantic meaning and exact policy language.",
      metric: "Recall // 99.2%"
    },
    {
      num: "02",
      icon: Shuffle,
      title: "Cross-Encoder Reranking",
      description: "Evaluates retrieved passages using document-query interaction to surface the most relevant evidence.",
      metric: "Compute // ~12ms"
    },
    {
      num: "03",
      icon: Link2,
      title: "Source Citations",
      description: "Every answer is linked directly to supporting document sections.",
      metric: "Traceability // 100%"
    },
    {
      num: "04",
      icon: BarChart3,
      title: "RAGAS Evaluation",
      description: "Measure faithfulness, relevance, precision, and recall for every response.",
      metric: "Score // Real-time"
    },
    {
      num: "05",
      icon: Copy,
      title: "Multi-Document Analysis",
      description: "Compare policies across departments, regions, or regulatory frameworks.",
      metric: "Capacity // 100k+ pages"
    },
    {
      num: "06",
      icon: Eye,
      title: "Retrieval Inspector",
      description: "Understand exactly how the system arrived at every answer.",
      metric: "Transparency // Open Log"
    }
  ];

  return (
    <section className="border-b border-slate-200 bg-slate-50 py-16 md:py-24" id="features">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl border-l-2 border-slate-800 pl-4 md:pl-6 mb-16">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
            System Capability // Technical Specifications
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl uppercase">
            Built for enterprise-grade auditability
          </h2>
          <p className="mt-3 text-slate-600 font-sans text-sm md:text-base">
            Engineered from the ground up for teams that require complete transparency in retrieval systems. No black-box outputs.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group border border-slate-200 bg-white p-6 transition-all duration-200 hover:border-slate-400 hover:shadow-sm flex flex-col justify-between min-h-[220px]"
              >
                <div>
                  {/* Card Top */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                    
                    <div className="flex h-8 w-8 items-center justify-center border border-slate-200 bg-slate-50 text-slate-700 transition-colors group-hover:bg-accent group-hover:border-accent group-hover:text-slate-900">
                      <Icon className="h-4 w-4 stroke-[1.5]" />
                    </div>
                  </div>

                  {/* Card Content */}
                  <h3 className="font-sans text-base font-bold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="font-sans text-xs text-slate-500 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Card Footer Metric */}
                <div className="border-t border-slate-100 pt-4 mt-6 flex justify-between items-center">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent">
                    {feature.metric}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    details →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
