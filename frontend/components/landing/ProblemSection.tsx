import { XCircle, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function ProblemSection() {
  return (
    <section className="border-b border-slate-200 bg-white py-16 md:py-24" id="problem">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl border-l-2 border-slate-800 pl-4 md:pl-6 mb-16">
          
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl uppercase">
            Why traditional document search fails
          </h2>
          <p className="mt-3 text-slate-600 font-sans text-sm md:text-base">
            In regulatory, compliance, and enterprise legal frameworks, search errors are not minor inconveniences—they are liabilities. Standalone keyword or vector databases cannot guarantee grounded answers.
          </p>
        </div>

        {/* 3-Column Comparative Grid */}
        <div className="grid grid-cols-1 divide-y divide-slate-200 border border-slate-200 lg:grid-cols-3 lg:divide-y-0 lg:divide-x bg-[#F8FAFC]">
          
          {/* Column 1: Keyword Search */}
          <div className="flex flex-col justify-between p-8 space-y-8 bg-white">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-slate-900">
                  01 // Keyword Search
                </h3>
                <span className="font-mono text-[9px] uppercase tracking-wider text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                  <XCircle className="h-3 w-3" /> Insufficient
                </span>
              </div>
              <p className="font-sans text-xs text-slate-500 leading-relaxed">
                Standard database index lookups (e.g. basic SQL LIKE, Elasticsearch BM25 without semantic overlays).
              </p>
              <ul className="space-y-3 pt-2 font-mono text-[11px] text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold shrink-0">[×]</span>
                  <span>Finds exact terms but misses synonyms and related phrasing</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold shrink-0">[×]</span>
                  <span>Misses broader structural context and document intent</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold shrink-0">[×]</span>
                  <span>Poor comprehension of cross-referenced clauses</span>
                </li>
              </ul>
            </div>
            <div className="border-t border-slate-100 pt-4 text-[10px] font-mono text-slate-400">
              RESULT: Low Recall, High Manual Audit Required
            </div>
          </div>

          {/* Column 2: Vector Search */}
          <div className="flex flex-col justify-between p-8 space-y-8 bg-white">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-slate-900">
                  02 // Standalone Vector Search
                </h3>
                <span className="font-mono text-[9px] uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Unstable
                </span>
              </div>
              <p className="font-sans text-xs text-slate-500 leading-relaxed">
                Semantic embeddings (e.g. standard vector database matchers) without hybrid overlays or keyword boosting.
              </p>
              <ul className="space-y-3 pt-2 font-mono text-[11px] text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="text-amber-600 font-bold shrink-0">[!]</span>
                  <span>Understands general meaning but misses exact clause codes</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-amber-600 font-bold shrink-0">[!]</span>
                  <span>Struggles with alphanumeric IDs, dates, and strict section titles</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-amber-600 font-bold shrink-0">[!]</span>
                  <span>Weak traceability: source chunk borders are opaque & fuzzy</span>
                </li>
              </ul>
            </div>
            <div className="border-t border-slate-100 pt-4 text-[10px] font-mono text-slate-400">
              RESULT: Model Hallucinations, Opaque Citations
            </div>
          </div>

          {/* Column 3: PolicyPulse */}
          <div className="flex flex-col justify-between p-8 space-y-8 bg-slate-900 text-white relative overflow-hidden">
            {/* Corner Decorative Accent */}
            <div className="absolute top-0 right-0 h-16 w-16 bg-[radial-gradient(ellipse_at_top_right,#C0843D_0%,transparent_70%)] opacity-35"></div>

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-accent">
                  03 // PolicyPulse RAG
                </h3>
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-900 bg-accent px-2.5 py-0.5 rounded font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Enterprise Ready
                </span>
              </div>
              <p className="font-sans text-xs text-slate-300 leading-relaxed">
                Multi-stage search fusion integrating statistical and dense vector matchers with cross-encoder verification.
              </p>
              <ul className="space-y-3 pt-2 font-mono text-[11px] text-slate-200">
                <li className="flex items-start gap-2.5">
                  <span className="text-accent font-bold shrink-0">[✓]</span>
                  <span>Hybrid Retrieval: Merges BM25 lookup + vector embeddings</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-accent font-bold shrink-0">[✓]</span>
                  <span>Cross-Encoder Reranking for context validation</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-accent font-bold shrink-0">[✓]</span>
                  <span>Explainable Answers: Fully traceable inline source links</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-accent font-bold shrink-0">[✓]</span>
                  <span>RAGAS Evaluation: Built-in validation pipelines</span>
                </li>
              </ul>
            </div>
            <div className="border-t border-slate-800 pt-4 text-[10px] font-mono text-accent">
              RESULT: Audit-ready outputs, 100% Grounded Answers
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
