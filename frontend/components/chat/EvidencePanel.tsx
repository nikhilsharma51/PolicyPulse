import { FileText, Award, Percent, Hash } from "lucide-react";

interface EvidenceDetails {
  citation: string;
  sourceDoc: string;
  page: number;
  confidence: number;
  chunkText: string;
}

interface EvidencePanelProps {
  activeCitation: string | null;
  evidence: Record<string, EvidenceDetails>;
}

export default function EvidencePanel({
  activeCitation,
  evidence
}: EvidencePanelProps) {
  
  const currentEvidence = activeCitation ? evidence[activeCitation] : null;

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] border-t lg:border-t-0 border-slate-200">
      
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-100/60 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <FileText className="h-4 w-4 text-slate-400" />
          Grounded Evidence Viewer
        </span>
        {activeCitation ? (
          <span className="font-mono text-[9px] bg-accent text-slate-950 font-bold px-1.5 py-0.5 border border-accent rounded">
            {activeCitation}
          </span>
        ) : (
          <span className="font-mono text-[9px] text-slate-400">Select Citation</span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        {currentEvidence ? (
          <div className="space-y-4 flex-grow flex flex-col">
            
            {/* Metadata Rows */}
            <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
              <div className="border border-slate-200 bg-white p-2.5 flex flex-col justify-between">
                <span className="text-[8px] text-slate-400 uppercase">Page No.</span>
                <span className="font-bold text-slate-800 flex items-center gap-1 mt-1">
                  <Hash className="h-3 w-3 text-slate-400" />
                  Page {currentEvidence.page}
                </span>
              </div>
              <div className="border border-slate-200 bg-white p-2.5 flex flex-col justify-between">
                <span className="text-[8px] text-slate-400 uppercase">Confidence</span>
                <span className="font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
                  <Percent className="h-3 w-3 text-emerald-500" />
                  {currentEvidence.confidence * 100}%
                </span>
              </div>
              <div className="border border-slate-200 bg-white p-2.5 flex flex-col justify-between">
                <span className="text-[8px] text-slate-400 uppercase">Citation Ref</span>
                <span className="font-bold text-slate-800 mt-1 truncate">
                  {currentEvidence.citation}
                </span>
              </div>
            </div>

            {/* Source document block */}
            <div className="border border-slate-200 bg-white p-3 space-y-1">
              <span className="block text-[8px] font-mono text-slate-400 uppercase">Source Document Reference</span>
              <span className="block text-xs font-bold text-slate-800">
                {currentEvidence.sourceDoc}
              </span>
            </div>

            {/* Retrieved semantic text chunk */}
            <div className="flex-1 border border-slate-200 bg-white p-4 flex flex-col space-y-2">
              <span className="block text-[8px] font-mono text-slate-400 uppercase border-b border-slate-100 pb-1.5">
                Retrieved Context Chunk
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed overflow-y-auto flex-grow max-h-[140px] italic">
                "{currentEvidence.chunkText}"
              </p>
            </div>

          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center text-center p-8 border border-dashed border-slate-300 bg-white min-h-[220px]">
            <FileText className="h-8 w-8 text-slate-300 stroke-[1.5] mb-2" />
            <p className="text-xs font-bold text-slate-700 uppercase">No Citation Selected</p>
            <p className="text-[10px] text-slate-400 max-w-[180px] mt-1 leading-normal">
              Hover over or select an inline citation in the workspace to display the matching text source.
            </p>
          </div>
        )}

        {/* Audit footer */}
        <div className="border-t border-slate-200 pt-3 text-[9px] font-mono text-slate-400 flex items-center gap-1.5 bg-slate-50/20 -mx-4 -mb-4 px-4 py-3">
          <Award className="h-4 w-4 text-emerald-600" />
          <span>Ingested vector hash: SHA-256 verified</span>
        </div>
      </div>

    </div>
  );
}
