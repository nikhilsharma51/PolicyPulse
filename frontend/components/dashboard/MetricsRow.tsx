import { Database, HelpCircle, ShieldCheck, AlertTriangle } from "lucide-react";

export default function MetricsRow() {
  const metrics = [
    {
      title: "Documents Indexed",
      value: "42",
      icon: Database,
      desc: "Raw policy sources ingested, parsed, and tokenized."
    },
    {
      title: "Questions Answered",
      value: "1,284",
      icon: HelpCircle,
      desc: "Grounded responses generated with verified context."
    },
    {
      title: "Average Faithfulness",
      value: "0.96",
      icon: ShieldCheck,
      desc: "Context-to-generation truth score across queries."
    },
   
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {metrics.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className={`border bg-white p-5 flex flex-col justify-between gap-5 min-h-[140px] hover:shadow-sm transition-shadow duration-150 ${
              item.isAlert ? "border-accent" : "border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-slate-500">
                {item.title}
              </span>
              <Icon className={`h-4.5 w-4.5 stroke-[1.5] ${item.isAlert ? "text-accent" : "text-slate-400"}`} />
            </div>

            <div className="py-3 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-extrabold text-slate-900 tracking-tight">
                {item.value}
              </span>
              <span className={`font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 border ${
                item.isAlert
                  ? "bg-accent/10 border-accent text-accent font-bold"
                  : "bg-slate-50 border-slate-200 text-slate-600"
              }`}>
                {item.tag}
              </span>
            </div>

            <p className="font-sans text-[10px] text-slate-500 border-t border-slate-50 pt-2 leading-relaxed">
              {item.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
}
