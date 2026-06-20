"use client";

import { useState, useRef } from "react";
import {
  UploadCloud,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  FileText,
  Database,
  ShieldCheck,
} from "lucide-react";

type IngestResponse = {
  doc_id: string;
  chunk_count: number;
};

type UploadState = "idle" | "uploading" | "success" | "error";

type UploadRow = {
  name: string;
  size: string;
  date: string;
  status: string;
  progress: number;
  statusType: "success" | "loading" | "error";
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(d: Date): string {
  return d
    .toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
    .toUpperCase();
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function DocumentsPage({
  onUploadComplete,
}: {
  onUploadComplete: (docId: string) => void;
}) {
  const [uploads, setUploads] = useState<UploadRow[]>([
    {
      name: "EU Data Privacy Directive (2026/184)",
      size: "42 KB",
      date: "JUN 15, 2026",
      status: "INDEXED",
      progress: 100,
      statusType: "success",
    },
    {
      name: "Vendor Security Compliance Checklist v3",
      size: "128 KB",
      date: "JUN 14, 2026",
      status: "INDEXED",
      progress: 100,
      statusType: "success",
    },
    {
      name: "SEC Cyber Incident Disclosure Rule §1.4",
      size: "84 KB",
      date: "JUN 12, 2026",
      status: "INDEXED",
      progress: 100,
      statusType: "success",
    },
    {
      name: "FedRAMP High Baseline Control Plan",
      size: "95 KB",
      date: "JUN 10, 2026",
      status: "CHUNKING // STEP 2",
      progress: 45,
      statusType: "loading",
    },
    {
      name: "Global Information Security Policy v1.2",
      size: "204 KB",
      date: "JUN 09, 2026",
      status: "EMBEDDING // STEP 3",
      progress: 80,
      statusType: "loading",
    },
  ]);
  const [isDragging, setIsDragging] = useState(false);

  const [state, setState] = useState<UploadState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (file.type !== "application/pdf") {
      setState("error");
      setErrorMsg("Only PDF files are supported.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setState("error");
      setErrorMsg("File exceeds the 10MB limit.");
      return;
    }

    setState("uploading");
    setErrorMsg("");

    // Optimistically add a row so the table reflects what's in flight.
    const newRow: UploadRow = {
      name: file.name,
      size: formatFileSize(file.size),
      date: formatDate(new Date()),
      status: "UPLOADING // STEP 1",
      progress: 10,
      statusType: "loading",
    };
    setUploads((prev) => [newRow, ...prev]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/ingest", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setState("error");
        setErrorMsg(data.error || "Upload failed.");
        setUploads((prev) =>
          prev.map((u) =>
            u === newRow
              ? { ...u, status: "FAILED", progress: 100, statusType: "error" }
              : u
          )
        );
        return;
      }

      const result = data as IngestResponse;
      setState("success");
      setUploads((prev) =>
        prev.map((u) =>
          u === newRow
            ? { ...u, status: "INDEXED", progress: 100, statusType: "success" }
            : u
        )
      );
      onUploadComplete(result.doc_id);
    } catch (err) {
      setState("error");
      setErrorMsg("Network error. Is the backend running?");
      setUploads((prev) =>
        prev.map((u) =>
          u === newRow
            ? { ...u, status: "FAILED", progress: 100, statusType: "error" }
            : u
        )
      );
    }
  }

  function handleBrowseClick() {
    if (state === "uploading") return;
    inputRef.current?.click();
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset so selecting the same file again still fires onChange.
    e.target.value = "";
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (state !== "uploading") setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (state === "uploading") return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
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
            onClick={handleBrowseClick}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleBrowseClick();
            }}
            role="button"
            tabIndex={0}
            aria-disabled={state === "uploading"}
            className={`border border-dashed p-10 text-center flex flex-col items-center justify-center bg-white transition-colors duration-150 ${
              state === "uploading" ? "cursor-wait opacity-70" : "cursor-pointer"
            } ${
              isDragging
                ? "border-accent bg-slate-50/50"
                : "border-slate-300 hover:border-slate-400"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleInputChange}
            />
            <div className="h-12 w-12 border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-500 mb-4 rounded-full">
              {state === "uploading" ? (
                <RefreshCw className="h-6 w-6 stroke-[1.5] animate-spin" />
              ) : (
                <UploadCloud className="h-6 w-6 stroke-[1.5]" />
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-900 uppercase">
                {state === "uploading"
                  ? "Uploading & indexing…"
                  : "Drag & Drop regulatory PDF"}
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {state === "uploading"
                  ? "Parsing text, chunking, and embedding your document. This can take a moment."
                  : "Secure ingestion pipeline will parse texts, run recursive character chunk splitting, and index vector embeddings."}
              </p>
            </div>
            <div className="mt-4 font-mono text-[9px] text-slate-400 uppercase">
              MAX SIZE: 10MB // SUPPORTED FORMATS: PDF
            </div>
          </div>

          {/* Upload status banner */}
          {state === "error" && (
            <div className="flex items-start gap-2 border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-xs">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {state === "success" && (
            <div className="flex items-start gap-2 border border-emerald-200 bg-emerald-50 text-emerald-700 px-4 py-3 text-xs">
              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
              <span>Document uploaded and indexed successfully.</span>
            </div>
          )}

          {/* Recent Uploads Table */}
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
                              className={`h-full rounded-full transition-all duration-300 ${
                                item.statusType === "success"
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
                          className={`inline-flex items-center gap-1 px-2 py-0.5 border font-mono text-[8px] font-bold rounded ${
                            item.statusType === "success"
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
              <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold block">
                // Active Ingestion Console
              </span>
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