"use client";

import { FormEvent, useState } from "react";
import {
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  CornerDownLeft,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { streamQuery, type Source } from "@/lib/api";

interface AnswerWorkspaceProps {
  query: string;
  answer: string;
  citations: string[];
  selectedCitation: string | null;
  onSelectCitation: (citation: string | null) => void;
  docId?: string;
  onQueryComplete?: (result: {
    question: string;
    answer: string;
    sources: Source[];
  }) => void;
}

function resolveCitation(label: string, citations: string[]) {
  if (citations.includes(label)) return label;

  const numericLabel = label.match(/^source\s+(\d+)$/i)?.[1] ?? label.match(/^\d+$/)?.[0];
  if (!numericLabel) return null;

  const sourceCitation = citations.find(
    (citation) => citation.toLowerCase() === `source ${numericLabel}`
  );

  return sourceCitation ?? null;
}

export default function AnswerWorkspace({
  query,
  answer,
  citations,
  selectedCitation,
  onSelectCitation,
  docId,
  onQueryComplete
}: AnswerWorkspaceProps) {
  const [question, setQuestion] = useState(query);
  const [currentQuery, setCurrentQuery] = useState(query);
  const [currentAnswer, setCurrentAnswer] = useState(answer);
  const [currentCitations, setCurrentCitations] = useState(citations);
  const [localDocumentId, setLocalDocumentId] = useState("");
  const documentId = docId || localDocumentId;
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedQuestion = question.trim();
    const trimmedDocId = documentId.trim();

    if (!trimmedQuestion) {
      setError("Enter a question before running a query.");
      return;
    }

    if (!trimmedDocId) {
      setError("Enter the doc_id returned by ingestion before querying.");
      return;
    }

    let streamedAnswer = "";
    let streamCompleted = false;
    setError(null);
    setIsStreaming(true);
    setCurrentQuery(trimmedQuestion);
    setCurrentAnswer("");
    setCurrentCitations([]);
    onSelectCitation(null);

    await streamQuery(
      trimmedQuestion,
      trimmedDocId,
      (token) => {
        streamedAnswer += token;
        setCurrentAnswer(streamedAnswer);
      },
      (sources) => {
        streamCompleted = true;
        const sourceCitations = sources.map((source) => `Source ${source.source_number}`);
        setCurrentCitations(sourceCitations);
        setIsStreaming(false);
        if (sourceCitations.length > 0) onSelectCitation(sourceCitations[0]);
        onQueryComplete?.({
          question: trimmedQuestion,
          answer: streamedAnswer,
          sources,
        });
      },
      (message) => {
        streamCompleted = true;
        setIsStreaming(false);
        setError(message);
      }
    );

    if (!streamCompleted) {
      setIsStreaming(false);
      onQueryComplete?.({
        question: trimmedQuestion,
        answer: streamedAnswer,
        sources: [],
      });
    }
  };

  const renderFormattedAnswer = (text: string) => {
    if (!text) {
      return (
        <span className="text-slate-400">
          {isStreaming ? "Generating grounded answer..." : "Ask a question to generate an answer from the uploaded document."}
        </span>
      );
    }

    const nodes = [];
    const citationRegex = /\[([^\]]+)\]/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = citationRegex.exec(text)) !== null) {
      const fullMatch = match[0];
      const label = match[1];
      const citationName = resolveCitation(label, currentCitations);

      if (!citationName) continue;

      if (match.index > lastIndex) {
        nodes.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex, match.index)}</span>);
      }

      const isSelected = selectedCitation === citationName;
      nodes.push(
        <button
          key={`citation-${match.index}`}
          type="button"
          onMouseEnter={() => onSelectCitation(citationName)}
          onClick={() => onSelectCitation(citationName)}
          className={`cursor-pointer font-mono text-[10px] font-bold px-1.5 py-0.5 mx-0.5 rounded border transition-all inline-block align-middle ${
            isSelected
              ? "bg-accent border-accent text-slate-950 shadow-sm"
              : "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {fullMatch}
        </button>
      );
      lastIndex = match.index + fullMatch.length;
    }

    if (lastIndex < text.length) {
      nodes.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex)}</span>);
    }

    return nodes.length > 0 ? nodes : text;
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-white overflow-y-auto font-sans h-full">
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-3">
          <HelpCircle className="h-4 w-4 text-slate-400" />
          <span>Research Workspace & Grounding Inspector</span>
        </div>

        <div className="space-y-1.5">
          <span className="block text-[9px] font-mono uppercase text-slate-400">{"// Query Input"}</span>
          <div className="flex border border-slate-300 bg-[#F8FAFC] px-4 py-3 text-sm font-bold text-slate-900 shadow-inner min-h-11">
            {currentQuery}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="block text-[9px] font-mono uppercase text-slate-400">{"// Grounded Pipeline Generation"}</span>
            {isStreaming ? (
              <span className="inline-flex items-center gap-1.5 text-[9px] font-mono uppercase text-slate-500">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Streaming
              </span>
            ) : null}
          </div>
          <div className="border border-slate-200 bg-white p-5 text-sm text-slate-700 leading-relaxed shadow-sm min-h-[180px] border-l-4 border-l-slate-800 whitespace-pre-wrap">
            {renderFormattedAnswer(currentAnswer)}
          </div>
        </div>

        {error ? (
          <div className="flex items-start gap-2 border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="pt-4 border-t border-slate-100 mt-6 space-y-3">
        <div className="grid grid-cols-[minmax(0,1fr)_9rem_2.25rem] gap-2">
          <input
            type="text"
            placeholder="Ask a policy question..."
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            disabled={isStreaming}
            className="min-w-0 border border-slate-200 bg-[#F8FAFC] px-3 py-2 font-sans text-xs text-slate-700 outline-none focus:border-slate-500 disabled:cursor-wait disabled:text-slate-400"
          />
          <input
            type="text"
            placeholder="doc_id"
            value={documentId}
            onChange={(event) => setLocalDocumentId(event.target.value)}
            disabled={isStreaming || Boolean(docId)}
            className="min-w-0 border border-slate-200 bg-[#F8FAFC] px-3 py-2 font-mono text-[10px] text-slate-700 outline-none focus:border-slate-500 disabled:cursor-not-allowed disabled:text-slate-400"
          />
          <button
            type="submit"
            disabled={isStreaming}
            className="inline-flex h-9 w-9 items-center justify-center border border-slate-800 bg-slate-900 text-white hover:bg-accent hover:border-accent hover:text-slate-900 transition-colors disabled:cursor-wait disabled:opacity-60"
            aria-label="Submit query"
          >
            {isStreaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Answer restricted to uploaded context chunks.
          </span>
          <span className="flex items-center gap-1">
            <span>{documentId ? "Document context ready" : "Waiting for doc_id"}</span>
            <CornerDownLeft className="h-3.5 w-3.5 text-slate-300" />
          </span>
        </div>
      </form>
    </div>
  );
}




