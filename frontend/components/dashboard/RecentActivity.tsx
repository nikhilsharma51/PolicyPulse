import { FileText, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

export default function RecentActivity() {
  const activities = [
    {
      document: "EU Data Privacy Directive (2026/184)",
      jurisdiction: "EU (Brussels)",
      updated: "2 hours ago",
      status: "INDEXED",
      statusType: "success"
    },
    {
      document: "Vendor Security Compliance Checklist v3",
      jurisdiction: "Global (Corporate)",
      updated: "1 day ago",
      status: "INDEXED",
      statusType: "success"
    },
    {
      document: "SEC Cyber Incident Disclosure Rule §1.4",
      jurisdiction: "US (Federal)",
      updated: "3 days ago",
      status: "REVIEW REQUIRED",
      statusType: "warning"
    },
    {
      document: "FedRAMP High Baseline Control Plan",
      jurisdiction: "US (Federal)",
      updated: "5 days ago",
      status: "PROCESSING",
      statusType: "loading"
    }
  ];

  return (
    <div className="border border-slate-200 bg-white">
      {/* Table Header / Title */}
      <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <FileText className="h-4 w-4 text-slate-400" />
          Recent Ingested Policy Activity
        </span>
        <span className="font-mono text-[9px] text-slate-400">Showing last 4 logs</span>
      </div>

      {/* Structured Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left font-sans text-xs">
          <thead className="bg-[#F8FAFC] font-mono text-[9px] uppercase tracking-wider text-slate-500">
            <tr>
              <th scope="col" className="px-6 py-3 font-semibold">Document Reference</th>
              <th scope="col" className="px-6 py-3 font-semibold">Jurisdiction</th>
              <th scope="col" className="px-6 py-3 font-semibold">Last Synced</th>
              <th scope="col" className="px-6 py-3 font-semibold text-right">Pipeline Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {activities.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="whitespace-nowrap px-6 py-4 font-bold text-slate-800 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-slate-400 shrink-0"></span>
                  {item.document}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-slate-600 font-medium">
                  {item.jurisdiction}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-slate-500 font-mono text-[10px]">
                  {item.updated}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 border font-mono text-[9px] font-bold rounded ${
                    item.statusType === "success"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : item.statusType === "warning"
                      ? "bg-amber-50 border-accent/20 text-accent"
                      : "bg-blue-50 border-blue-200 text-blue-700"
                  }`}>
                    {item.statusType === "success" && <CheckCircle2 className="h-2.5 w-2.5" />}
                    {item.statusType === "warning" && <AlertCircle className="h-2.5 w-2.5" />}
                    {item.statusType === "loading" && <RefreshCw className="h-2.5 w-2.5 animate-spin" />}
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
