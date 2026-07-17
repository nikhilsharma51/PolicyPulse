import { ShieldCheck, Crosshair, Award, Target } from "lucide-react";
import type { EvalScore } from "@/lib/api";

type MetricKey = "faithfulness" | "answer_relevancy" | "context_precision" | "context_recall";

const METRIC_CONFIG: {
  key: MetricKey;
  name: string;
  icon: typeof ShieldCheck;
  desc: string;
}[] = [
  {
    key: "faithfulness",
    name: "Faithfulness",
    icon: ShieldCheck,
    desc: "Checks grounding. Measures if the generated output uses only facts retrieved from source context.",
  },
  {
    key: "answer_relevancy",
    name: "Answer Relevancy",
    icon: Target,
    desc: "Checks intent matching. Measures how directly the response addresses the prompt query.",
  },
  {
    key: "context_precision",
    name: "Context Precision",
    icon: Crosshair,
    desc: "Checks ranking. Measures whether the most relevant chunks were ranked at the top.",
  },
  {
    key: "context_recall",
    name: "Context Recall",
    icon: Award,
    desc: "Checks coverage. Measures if retrieval found the context needed to answer the question.",
  },
];

function average(scores: EvalScore[], key: MetricKey): number | null {
  const values = scores
    .map((s) => s[key])
    .filter((v): v is number => typeof v === "number" && !Number.isNaN(v));
  if (values.length === 0) return null;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function formatScore(value: number | null): string {
  if (value == null) return "—";
  return value.toFixed(2);
}

function statusFor(value: number | null): { label: string; percent: string } {
  if (value == null) return { label: "NO DATA", percent: "—" };
  const pct = Math.round(value * 100);
  return {
    label: value >= 0.9 ? "COMPLIANT" : value >= 0.75 ? "OK" : "LOW",
    percent: `${pct}%`,
  };
}

interface MetricsGridProps {
  scores?: EvalScore[];
}

export default function MetricsGrid({ scores = [] }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {METRIC_CONFIG.map((item) => {
        const Icon = item.icon;
        const avg = average(scores, item.key);
        const status = statusFor(avg);

        return (
          <div
            key={item.key}
            className="border border-slate-200 bg-white p-5 flex flex-col justify-between hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
                RAGAS_KPI // {item.name}
              </span>
              <Icon className="h-4.5 w-4.5 text-slate-400 stroke-[1.5]" />
            </div>

            <div className="flex items-baseline justify-between py-2">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-3xl font-extrabold text-slate-900">
                  {formatScore(avg)}
                </span>
                <span className="font-mono text-[9px] text-slate-400 uppercase">
                  Score (0-1.0)
                </span>
              </div>

              <span className="font-mono text-[9px] px-2 py-0.5 border border-emerald-250 bg-emerald-50 text-emerald-700 font-bold rounded">
                [ {status.label} // {status.percent} ]
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
