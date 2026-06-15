import { FileText, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

export default function RecentActivity() {
  const activities = [
    {
      document: "EU Data Privacy Directive (2026/184)",
      updated: "2 hours ago",

    },
    {
      document: "Vendor Security Compliance Checklist v3",
      updated: "1 day ago",

    },
    {
      document: "SEC Cyber Incident Disclosure Rule §1.4",
      updated: "3 days ago",
  
    },
    {
      document: "FedRAMP High Baseline Control Plan",
      updated: "5 days ago",
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
              
              <th scope="col" className="px-6 py-3 font-semibold">Last Synced</th>
          
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {activities.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="whitespace-nowrap px-6 py-4 font-bold text-slate-800 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-slate-400 shrink-0"></span>
                  {item.document}
                </td>
               
                <td className="whitespace-nowrap px-6 py-4 text-slate-500 font-mono text-[10px]">
                  {item.updated}
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
