"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle2, RefreshCw, AlertTriangle, FileText, Database, Layers, ShieldCheck, Trash2 } from "lucide-react";

export default function DocumentsPage() {
  const [uploads, setUploads] = useState([
    {
      name: "EU Data Privacy Directive (2026/184)",
      size: "42 KB",
      date: "JUN 15, 2026",
      status: "INDEXED",
      progress: 100,
      statusType: "success"
    },
    {
      name: "Vendor Security Compliance Checklist v3",
      size: "128 KB",
      date: "JUN 14, 2026",
      status: "INDEXED",
      progress: 100,
      statusType: "success"
    },
    {
      name: "SEC Cyber Incident Disclosure Rule §1.4",
      size: "84 KB",
      date: "JUN 12, 2026",
      status: "INDEXED",
      progress: 100,
      statusType: "success"
    },
    {
      name: "FedRAMP High Baseline Control Plan",
      size: "95 KB",
      date: "JUN 10, 2026",
      status: "CHUNKING // STEP 2",
      progress: 45,
      statusType: "loading"
    },
    {
      name: "Global Information Security Policy v1.2",
      size: "204 KB",
      date: "JUN 09, 2026",
      status: "EMBEDDING // STEP 3",
      progress: 80,
      statusType: "loading"
    }
  ]);

  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Simulation only
  };

  return (
    <div className="p-6 space-y-6 font-sans">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold uppercase tracking-tight text-slate-900">
          Policy Library & Ingestion Manager
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Upload regulatory frameworks and index document sections into semantic vectors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Hand: Upload Zone & Recent Uploads (Col-span 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border border-dashed p-10 text-center cursor-pointer flex flex-col items-center justify-center bg-white transition-colors duration-150 ${
              isDragging ? "border-accent bg-slate-50/50" : "border-slate-300 hover:border-slate-400"
            }`}
          >
            <div className="h-12 w-12 border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-500 mb-4 rounded-full">
              <UploadCloud className="h-6 w-6 stroke-[1.5]" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-900 uppercase">
                Drag & Drop regulatory PDF or markdown here
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Secure ingestion pipeline will parse texts, run recursive character chunk splitting, and index vector embeddings.
              </p>
            </div>
            <div className="mt-4 font-mono text-[9px] text-slate-400 uppercase">
              MAX SIZE: 50MB // SUPPORTED FORMATS: PDF, DOCX, MD, TXT
            </div>
          </div>

          {/* Recent Uploads Table */}
          <div className="border border-slate-200 bg-white">
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Recent Library Ingestions
              </span>
              <span className="font-mono text-[9px] text-slate-400">Total: {uploads.length} Policies</span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                <thead className="bg-[#F8FAFC] font-mono text-[9px] uppercase tracking-wider text-slate-500">
                  <tr>
                    <th scope="col" className="px-6 py-3 font-semibold">Document</th>
                    <th scope="col" className="px-6 py-3 font-semibold">Size</th>
                    <th scope="col" className="px-6 py-3 font-semibold">Inferred Date</th>
                    <th scope="col" className="px-6 py-3 font-semibold">Progress</th>
                    <th scope="col" className="px-6 py-3 font-semibold text-right">Status</th>
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
                              className={`h-full rounded-full transition-all duration-300 ${
                                item.progress === 100 ? "bg-emerald-500" : "bg-accent"
                              }`}
                              style={{ width: `${item.progress}%` }}
                            ></div>
                          </div>
                          <span className="font-mono text-[9px] text-slate-400 block">{item.progress}% compiled</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 border font-mono text-[8px] font-bold rounded ${
                          item.statusType === "success"
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                            : "bg-blue-50 border-blue-200 text-blue-700"
                        }`}>
                          {item.statusType === "success" ? (
                            <CheckCircle2 className="h-2.5 w-2.5" />
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

        </div>

        {/* Right Hand: Document Status Summary Panel (Col-span 4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Document Status */}
          <div className="border border-slate-200 bg-white p-5 space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Database className="h-4.5 w-4.5 text-slate-400" />
                Ingestion Database Summary
              </span>
            </div>

            <div className="space-y-3 font-mono text-[11px]">
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-slate-500 uppercase">Documents indexed</span>
                <span className="font-bold text-slate-900">42 / 45</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-slate-500 uppercase">Total vector chunks</span>
                <span className="font-bold text-slate-900">12,402</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-slate-500 uppercase">Average chunk size</span>
                <span className="font-bold text-slate-900">512 Tokens</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-slate-500 uppercase">Vector latency</span>
                <span className="font-bold text-slate-900">~24ms</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-500 uppercase">Embedding model</span>
                <span className="font-bold text-accent">text-embedding-3</span>
              </div>
            </div>

            {/* Shield note */}
            <div className="border border-slate-200 bg-slate-50 p-3.5 space-y-1">
              <div className="font-mono text-[8px] text-accent uppercase font-bold tracking-wider flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-accent" /> Security Protocol Verified
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                All document uploads are processed through isolated container namespaces, avoiding multi-tenant overlap. No LLM training occurs on stored vectors.
              </p>
            </div>
          </div>

          {/* Processing Progress tracker */}
          <div className="border border-slate-200 bg-slate-950 text-slate-300 p-5 font-mono space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold block">// Active Ingestion Console</span>
            </div>

            <div className="text-[10px] space-y-2.5 leading-relaxed">
              <div className="flex justify-between">
                <span>[ Ingest ]</span>
                <span className="text-emerald-500">FEDRAMP_PLAN.PDF loaded</span>
              </div>
              <div className="flex justify-between">
                <span>[ Split ]</span>
                <span className="text-accent">Created 184 chunks</span>
              </div>
              <div className="flex justify-between">
                <span>[ Embed ]</span>
                <span className="text-slate-500">Computing matrices (45%)...</span>
              </div>
              <div className="flex justify-between">
                <span>[ Verify ]</span>
                <span className="text-slate-500">Awaiting RAGAS baseline...</span>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-[9px] text-slate-500">
              <span>Thread: INGEST_POOL_02</span>
              <span>Load: 14%</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
