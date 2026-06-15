import { ShieldCheck, Crosshair, Award, Target } from "lucide-react";

export default function MetricsGrid() {
  const RAGAS = [
    {
      name: "Faithfulness",
      value: "0.96",
      percent: "96%",
      icon: ShieldCheck,
      desc: "Checks grounding. Measures if the generated output uses only facts retrieved from source context. Detects hallucination.",
      status: "COMPLIANT"
    },
    {
      name: "Answer Relevancy",
      value: "0.94",
      percent: "94%",
      icon: Target,
      desc: "Checks intent matching. Measures how directly the response addresses the prompt query, penalizing redundant information.",
      status: "OPTIMAL"
    },
    {
      name: "Context Precision",
      value: "0.91",
      percent: "91%",
      icon: Crosshair,
      desc: "Checks ranking. Measures whether the most relevant policy chunks were correctly positioned at the top of the search fusion ranks.",
      status: "COMPLIANT"
    },
    {
      name: "Context Recall",
      value: "0.95",
      percent: "95%",
      icon: Award,
      desc: "Checks database coverage. Measures if the hybrid search successfully retrieved all clauses required to fully address the query.",
      status: "OPTIMAL"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {RAGAS.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div key={idx} className="border border-slate-200 bg-white p-5 flex flex-col justify-between hover:shadow-sm transition-shadow">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
                RAGAS_KPI // {item.name}
              </span>
              <Icon className="h-4.5 w-4.5 text-slate-400 stroke-[1.5]" />
            </div>

            <div className="flex items-baseline justify-between py-2">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-3xl font-extrabold text-slate-900">
                  {item.value}
                </span>
                <span className="font-mono text-[9px] text-slate-400 uppercase">Score (0-1.0)</span>
              </div>
              
              <span className="font-mono text-[9px] px-2 py-0.5 border border-emerald-250 bg-emerald-50 text-emerald-700 font-bold rounded">
                [ {item.status} // {item.percent} ]
              </span>
            </div>

            <p className="font-sans text-[11px] text-slate-500 pt-3 border-t border-slate-50 leading-relaxed">
              {item.desc}
            </p>

          </div>
        );
      })}
    </div>
  );
}
