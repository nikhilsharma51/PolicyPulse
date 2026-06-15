"use client";

import { ShieldCheck, HelpCircle, ArrowRight, CornerDownLeft } from "lucide-react";

interface AnswerWorkspaceProps {
  query: string;
  answer: string;
  citations: string[];
  selectedCitation: string | null;
  onSelectCitation: (citation: string | null) => void;
}

export default function AnswerWorkspace({
  query,
  answer,
  citations,
  selectedCitation,
  onSelectCitation
}: AnswerWorkspaceProps) {
  
  // Custom parser to map text citations (e.g. "[Data Governance §4.1]") into clickable nodes
  const renderFormattedAnswer = (text: string) => {
    let renderedText = text;
    citations.forEach((citation) => {
      const formattedCitation = `[${citation}]`;
      renderedText = renderedText.replaceAll(
        formattedCitation,
        `||CIT:${citation}||`
      );
    });

    const parts = renderedText.split("||");
    return parts.map((part, idx) => {
      if (part.startsWith("CIT:")) {
        const citationName = part.substring(4);
        const isSelected = selectedCitation === citationName;
        return (
          <button
            key={idx}
            type="button"
            onMouseEnter={() => onSelectCitation(citationName)}
            onClick={() => onSelectCitation(citationName)}
            className={`cursor-pointer font-mono text-[10px] font-bold px-1.5 py-0.5 mx-0.5 rounded border transition-all inline-block align-middle ${
              isSelected
                ? "bg-accent border-accent text-slate-950 shadow-sm"
                : "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {citationName}
          </button>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-white overflow-y-auto font-sans h-full">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-3">
          <HelpCircle className="h-4 w-4 text-slate-400" />
          <span>Research Workspace & Grounding Inspector</span>
        </div>

        {/* Input Query Block */}
        <div className="space-y-1.5">
          <span className="block text-[9px] font-mono uppercase text-slate-400">// Query Input</span>
          <div className="flex border border-slate-300 bg-[#F8FAFC] px-4 py-3 text-sm font-bold text-slate-900 shadow-inner">
            {query}
          </div>
        </div>

        {/* Grounded Output */}
        <div className="space-y-2">
          <span className="block text-[9px] font-mono uppercase text-slate-400">// Grounded Pipeline Generation</span>
          <div className="border border-slate-200 bg-white p-5 text-sm text-slate-700 leading-relaxed shadow-sm min-h-[180px] border-l-4 border-l-slate-800">
            {renderFormattedAnswer(answer)}
          </div>
        </div>

      </div>

      {/* Input Simulator Form */}
      <div className="pt-4 border-t border-slate-100 mt-6 space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            placeholder="Ask a policy question..."
            value={query}
            className="flex-1 border border-slate-200 bg-[#F8FAFC] px-3 py-2 font-sans text-xs text-slate-500 outline-none select-all"
          />
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center border border-slate-800 bg-slate-900 text-white hover:bg-accent hover:border-accent hover:text-slate-900 transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Answer restricted to uploaded context chunks.
          </span>
          <span className="flex items-center gap-1">
            <span>Query locked in session</span>
            <CornerDownLeft className="h-3.5 w-3.5 text-slate-300" />
          </span>
        </div>
      </div>

    </div>
  );
}
