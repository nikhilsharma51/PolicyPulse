import { HelpCircle, CheckCircle2, AlertCircle } from "lucide-react";
import type { EvalScore } from "@/lib/api";

function formatMetric(value?: number | null): string {
  if (value == null || Number.isNaN(value)) return "—";
  return value.toFixed(2);
}

function isPassed(score: EvalScore): boolean {
  const faith = score.faithfulness ?? 0;
  const relevancy = score.answer_relevancy ?? 0;
  return faith >= 0.75 && relevancy >= 0.75;
}

interface QueryHistoryProps {
  scores?: EvalScore[];
  loading?: boolean;
}

export default function QueryHistory({ scores = [], loading = false }: QueryHistoryProps) {
  return (
    <div className="border border-slate-200 bg-white">
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <HelpCircle className="h-4 w-4 text-slate-400" />
          RAGAS Query Validation Log
        </span>
        <span className="font-mono text-[9px] text-slate-400">
          {loading ? "Loading..." : `Showing ${scores.length} queries`}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-xs font-sans">
          <thead className="bg-[#F8FAFC] font-mono text-[9px] uppercase tracking-wider text-slate-500">
            <tr>
              <th scope="col" className="px-6 py-3 font-semibold">
                Evaluation Query
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-center">
                Faithfulness
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-center">
                Relevancy
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-center">
                Precision
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-center">
                Recall
              </th>
              <th scope="col" className="px-6 py-3 font-semibold text-right">
                Result State
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {!loading && scores.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-slate-400 font-mono text-[10px]">
                  No evaluation scores yet. Upload a document or click Run Evaluation.
                </td>
              </tr>
            ) : null}

            {scores.map((item) => {
              const passed = isPassed(item);
              return (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800 max-w-[280px] truncate">
                    {item.question}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-center font-mono text-[10px] text-slate-600">
                    {formatMetric(item.faithfulness)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-center font-mono text-[10px] text-slate-600">
                    {formatMetric(item.answer_relevancy)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-center font-mono text-[10px] text-slate-600">
                    {formatMetric(item.context_precision)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-center font-mono text-[10px] text-slate-600">
                    {formatMetric(item.context_recall)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 border font-mono text-[8px] font-bold rounded ${
                        passed
                          ? "bg-emerald-50 border-emerald-250 text-emerald-700"
                          : "bg-red-50 border-red-200 text-red-700"
                      }`}
                    >
                      {passed ? (
                        <CheckCircle2 className="h-2.5 w-2.5" />
                      ) : (
                        <AlertCircle className="h-2.5 w-2.5" />
                      )}
                      {passed ? "PASSED" : "LOW SCORE"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
