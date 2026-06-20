"use client";

import { BookOpen } from "lucide-react";

interface SourceDetails {
  citation: string;
  sourceDoc: string;
  page: number | string;
  chunkText: string;
}

interface SourcePanelProps {
  selectedCitation: string | null;
  evidence: Record<string, SourceDetails>;
}

export default function SourcePanel({ selectedCitation, evidence }: SourcePanelProps) {
  const details = selectedCitation ? evidence[selectedCitation] : null;

  return (
    <div className="w-72 border-l border-slate-200 bg-[#F8FAFC] flex flex-col h-full shrink-0 font-sans">
      <div className="px-4 py-3.5 border-b border-slate-200 bg-slate-100/60">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <BookOpen className="h-4 w-4 text-slate-400" />
          Source Evidence
        </span>
      </div>

      <div className="p-4 overflow-y-auto flex-grow">
        {!selectedCitation || !details ? (
          <p className="text-[10px] font-mono text-slate-400 leading-relaxed">
            Click a citation badge in the answer to view the retrieved chunk from your document.
          </p>
        ) : (
          <div className="space-y-4">
            <div>
              <span className="block text-[9px] font-mono uppercase text-slate-400 mb-1">
                Citation
              </span>
              <span className="inline-block font-mono text-[10px] font-bold px-1.5 py-0.5 bg-accent border border-accent text-slate-950 rounded">
                [{details.citation}]
              </span>
            </div>

            <div>
              <span className="block text-[9px] font-mono uppercase text-slate-400 mb-1">
                Document
              </span>
              <p className="text-xs font-bold text-slate-800">{details.sourceDoc}</p>
            </div>

            <div>
              <span className="block text-[9px] font-mono uppercase text-slate-400 mb-1">
                Page
              </span>
              <p className="text-xs font-mono text-slate-600">{details.page}</p>
            </div>

            <div>
              <span className="block text-[9px] font-mono uppercase text-slate-400 mb-1">
                Retrieved Chunk
              </span>
              <p className="text-xs text-slate-700 leading-relaxed border border-slate-200 bg-white p-3 whitespace-pre-wrap">
                {details.chunkText}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
