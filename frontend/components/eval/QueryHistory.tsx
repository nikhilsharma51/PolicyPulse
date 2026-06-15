import { HelpCircle, CheckCircle2, AlertCircle } from "lucide-react";

export default function QueryHistory() {
  const records = [
    {
      query: "What policies govern cross-border data transfers?",
      faithfulness: "0.96",
      relevancy: "0.94",
      precision: "0.91",
      recall: "0.95",
      status: "PASSED",
      isPassed: true
    },
    {
      query: "What is the encryption standard for data at rest?",
      faithfulness: "0.97",
      relevancy: "0.92",
      precision: "0.94",
      recall: "0.90",
      status: "PASSED",
      isPassed: true
    },
    {
      query: "What is the remote work equipment stipend policy?",
      faithfulness: "0.89",
      relevancy: "0.91",
      precision: "0.88",
      recall: "0.92",
      status: "AUDIT REQUIRED",
      isPassed: false
    },
    {
      query: "What are the SOC 2 certification requirements for third-party vendors?",
      faithfulness: "0.95",
      relevancy: "0.95",
      precision: "0.91",
      recall: "0.96",
      status: "PASSED",
      isPassed: true
    },
    {
      query: "Who is responsible for security key rotation cycles?",
      faithfulness: "0.98",
      relevancy: "0.87",
      precision: "0.93",
      recall: "0.89",
      status: "PASSED",
      isPassed: true
    }
  ];

  return (
    <div className="border border-slate-200 bg-white">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <HelpCircle className="h-4 w-4 text-slate-400" />
          RAGAS Query Validation Log
        </span>
        <span className="font-mono text-[9px] text-slate-400">Showing last 5 queries</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-xs font-sans">
          <thead className="bg-[#F8FAFC] font-mono text-[9px] uppercase tracking-wider text-slate-500">
            <tr>
              <th scope="col" className="px-6 py-3 font-semibold">Evaluation Query</th>
              <th scope="col" className="px-4 py-3 font-semibold text-center">Faithfulness</th>
              <th scope="col" className="px-4 py-3 font-semibold text-center">Relevancy</th>
              <th scope="col" className="px-4 py-3 font-semibold text-center">Precision</th>
              <th scope="col" className="px-4 py-3 font-semibold text-center">Recall</th>
              <th scope="col" className="px-6 py-3 font-semibold text-right">Result State</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {records.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800 max-w-[280px] truncate">
                  {item.query}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-center font-mono text-[10px] text-slate-600">
                  {item.faithfulness}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-center font-mono text-[10px] text-slate-600">
                  {item.relevancy}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-center font-mono text-[10px] text-slate-600">
                  {item.precision}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-center font-mono text-[10px] text-slate-600">
                  {item.recall}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 border font-mono text-[8px] font-bold rounded ${
                    item.isPassed
                      ? "bg-emerald-50 border-emerald-250 text-emerald-700"
                      : "bg-red-50 border-red-200 text-red-700"
                  }`}>
                    {item.isPassed ? <CheckCircle2 className="h-2.5 w-2.5" /> : <AlertCircle className="h-2.5 w-2.5" />}
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
