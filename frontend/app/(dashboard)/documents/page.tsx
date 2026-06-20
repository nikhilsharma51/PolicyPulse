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
import Status from "@/components/documents/Status";
import RecentUpload from "@/components/documents/RecentUpload";
import Header from "@/components/documents/Header";

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

export default function DocumentsPage() {
  const [uploads, setUploads] = useState<UploadRow[]>([

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
      window.localStorage.setItem("policypulse.doc_id", result.doc_id);

    } catch {
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
      <Header />

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
            className={`border border-dashed p-10 text-center flex flex-col items-center justify-center bg-white transition-colors duration-150 ${state === "uploading" ? "cursor-wait opacity-70" : "cursor-pointer"
              } ${isDragging
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
          <RecentUpload uploads={uploads} />
        </div>

        {/* Right Hand: Document Status Summary Panel (Col-span 4) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Document Status */}
          <Status />
        </div>
      </div>
    </div>
  );
}



