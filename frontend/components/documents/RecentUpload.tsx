import { CheckCircle, FileText, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react"

type UploadRow = {
  name: string;
  size: string;
  date: string;
  status: string;
  progress: number;
  statusType: "success" | "loading" | "error";
};

type RecentUploadProps = {
  uploads: UploadRow[];
};

export default function RecentUpload({ uploads }: RecentUploadProps) {

  //   const uploads = [
  // {
  //   name: "SEBI_Circular_2026.pdf",
  //   size: "2.4 MB",
  //   date: "2026-06-20",
  //   progress: 100,
  //   status: "Indexed",
  //   statusType: "success",
  // },

  return (
    <div className="border border-slate-200 bg-white">
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-600">
          Recent Library Ingestions
        </span>
        <span className="font-mono text-[9px] text-slate-400">
          Total: {uploads.length} Policies
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
          <thead className="bg-[#F8FAFC] font-mono text-[9px] uppercase tracking-wider text-slate-500">
            <tr>
              <th scope="col" className="px-6 py-3 font-semibold">
                Document
              </th>
              <th scope="col" className="px-6 py-3 font-semibold">
                Size
              </th>
              <th scope="col" className="px-6 py-3 font-semibold">
                Inferred Date
              </th>
              <th scope="col" className="px-6 py-3 font-semibold">
                Progress
              </th>
              <th scope="col" className="px-6 py-3 font-semibold text-right">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {uploads.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-2 max-w-[240px] truncate">
                  <FileText className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                  <span className="truncate">{item.name}</span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-slate-600 font-mono text-[10px]">
                  {item.size}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-slate-500 font-mono text-[10px]">
                  {item.date}
                </td>
                <td className="px-6 py-4 w-1/4">
                  <div className="space-y-1.5">
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200/50">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${item.statusType === "success"
                            ? "bg-emerald-500"
                            : item.statusType === "error"
                              ? "bg-red-500"
                              : "bg-accent"
                          }`}
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                    <span className="font-mono text-[9px] text-slate-400 block">
                      {item.progress}% compiled
                    </span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 border font-mono text-[8px] font-bold rounded ${item.statusType === "success"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : item.statusType === "error"
                          ? "bg-red-50 border-red-200 text-red-700"
                          : "bg-blue-50 border-blue-200 text-blue-700"
                      }`}
                  >
                    {item.statusType === "success" ? (
                      <CheckCircle2 className="h-2.5 w-2.5" />
                    ) : item.statusType === "error" ? (
                      <AlertTriangle className="h-2.5 w-2.5" />
                    ) : (
                      <RefreshCw className="h-2.5 w-2.5 animate-spin" />
                    )}
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  )
}