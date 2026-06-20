import { FileText } from "lucide-react";
import { getServerBaseUrl } from "@/lib/server-url";

type Document = {
  id: string;
  name: string;
  status?: string;
  chunk_count?: number | null;
  created_at: string;
};

async function getDocuments(): Promise<Document[]> {
  const baseUrl = getServerBaseUrl();
  const res = await fetch(`${baseUrl}/api/documents?limit=4`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function RecentActivity() {
  const documents = await getDocuments();

  return (
    <div className="border border-slate-200 bg-white">
      <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <FileText className="h-4 w-4 text-slate-400" />
          Recent Ingested Policy Activity
        </span>
        <span className="font-mono text-[9px] text-slate-400">Showing last 4 logs</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left font-sans text-xs">
          <thead className="bg-[#F8FAFC] font-mono text-[9px] uppercase tracking-wider text-slate-500">
            <tr>
              <th scope="col" className="px-6 py-3 font-semibold">
                Document Reference
              </th>
              <th scope="col" className="px-6 py-3 font-semibold">
                Last Synced
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {documents.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-6 py-8 text-center text-slate-400 font-mono text-[10px]">
                  No documents uploaded yet.
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="whitespace-nowrap px-6 py-4 font-bold text-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 bg-slate-400 shrink-0 rounded-full" />
                      {doc.name}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-500 font-mono text-[10px]">
                    {new Date(doc.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
