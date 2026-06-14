"use client";

import { useState } from "react";
import { FileText, Database, ShieldCheck, HelpCircle, Terminal, Check, Network, ListFilter } from "lucide-react";

interface PolicyData {
  title: string;
  size: string;
  status: string;
  query: string;
  answer: string;
  citations: string[];
  inspector: {
    query: string;
    bm25: number;
    vector: number;
    rrf: number;
    crossEncoder: string;
  };
}

export default function PlatformShowcase() {
  const policies: Record<string, PolicyData> = {
    governance: {
      title: "Data Governance Policy",
      size: "42 KB",
      status: "INDEXED",
      query: "What policies govern cross-border data transfers?",
      answer: "Cross-border transfers of EU resident data require standard contractual clauses (SCCs) under [Data Governance §4.1]. Furthermore, transfers to jurisdictions lacking adequacy decisions must undergo transfer impact assessments (TIAs) as outlined in [Data Governance §4.2].",
      citations: ["Data Governance §4.1", "Data Governance §4.2"],
      inspector: {
        query: "cross-border data transfers",
        bm25: 8,
        vector: 12,
        rrf: 20,
        crossEncoder: "Top 5 selected // Peak score 0.94"
      }
    },
    security: {
      title: "Security Policy",
      size: "128 KB",
      status: "INDEXED",
      query: "What is the encryption standard for data at rest?",
      answer: "All production data databases storing personally identifiable information (PII) must be encrypted using AES-256 or stronger under [Security Policy §2.3]. Cryptographic keys must be rotated every 90 days as mandated in [Security Policy §2.4].",
      citations: ["Security Policy §2.3", "Security Policy §2.4"],
      inspector: {
        query: "encryption standard data at rest",
        bm25: 5,
        vector: 18,
        rrf: 23,
        crossEncoder: "Top 4 selected // Peak score 0.97"
      }
    },
    handbook: {
      title: "Employee Handbook",
      size: "84 KB",
      status: "INDEXED",
      query: "What is the remote work equipment stipend policy?",
      answer: "Full-time remote workers are eligible for a one-time home office equipment stipend of up to $1,000 under [Employee Handbook §6.1]. Receipt submissions for reimbursement must occur within 30 days of acquisition under [Employee Handbook §6.2].",
      citations: ["Employee Handbook §6.1", "Employee Handbook §6.2"],
      inspector: {
        query: "remote work equipment stipend",
        bm25: 3,
        vector: 10,
        rrf: 13,
        crossEncoder: "Top 3 selected // Peak score 0.89"
      }
    },
    vendor: {
      title: "Vendor Compliance Manual",
      size: "95 KB",
      status: "INDEXED",
      query: "What are the SOC 2 certification requirements for third-party vendors?",
      answer: "All Class 1 third-party vendor platforms hosting customer records must submit a SOC 2 Type II audit report annually under [Vendor Manual §1.5]. Subcontractors are bound by equivalent compliance levels as detailed in [Vendor Manual §1.6].",
      citations: ["Vendor Manual §1.5", "Vendor Manual §1.6"],
      inspector: {
        query: "SOC 2 certification vendor compliance",
        bm25: 9,
        vector: 15,
        rrf: 24,
        crossEncoder: "Top 6 selected // Peak score 0.95"
      }
    }
  };

  const [activeKey, setActiveKey] = useState<keyof typeof policies>("governance");
  const activeData = policies[activeKey];
  const [highlightedCitation, setHighlightedCitation] = useState<string | null>(null);

  // Render the answer with highlighted citations
  const renderAnswer = (text: string) => {
    let renderedText = text;
    activeData.citations.forEach((citation) => {
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
        const isHighlighted = highlightedCitation === citationName;
        return (
          <span
            key={idx}
            onMouseEnter={() => setHighlightedCitation(citationName)}
            onMouseLeave={() => setHighlightedCitation(null)}
            className={`cursor-help font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border transition-all ${
              isHighlighted
                ? "bg-accent border-accent text-slate-950 shadow-sm"
                : "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {citationName}
          </span>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  return (
    <section className="border-b border-slate-200 bg-slate-50 py-16 md:py-24" id="showcase">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl border-l-2 border-slate-800 pl-4 md:pl-6 mb-12">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Interactive System Preview // Core Interface
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl uppercase">
            The policy intelligence workspace
          </h2>
          <p className="mt-3 text-slate-600 font-sans text-sm md:text-base">
            Click on different policies in the library below to observe how the hybrid retrieval system isolates clauses, verifies answers, and logs operations.
          </p>
        </div>

        {/* Dashboard Frame */}
        <div className="border border-slate-300 bg-white shadow-xl overflow-hidden flex flex-col font-sans">
          
          {/* Top Panel bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-slate-200 bg-[#F8FAFC] px-4 py-3 gap-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-accent"></div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Workspace: PolicyPulse_v1.0.4
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
              <span className="flex items-center gap-1"><Database className="h-3.5 w-3.5" /> Chunks: 12,402</span>
              <span className="h-3 w-px bg-slate-300"></span>
              <span className="flex items-center gap-1"><Network className="h-3.5 w-3.5" /> Fusion: RRF</span>
            </div>
          </div>

          {/* 3 Panels layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
            
            {/* Panel 1: Policy Library (Col-span 3) */}
            <div className="lg:col-span-3 flex flex-col bg-[#F8FAFC] min-h-[300px]">
              <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-100/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                  <ListFilter className="h-3 w-3" /> Policy Library
                </span>
                <span className="text-[9px] font-mono text-slate-400">4 Active</span>
              </div>
              <div className="p-2 space-y-1.5 flex-1 overflow-y-auto">
                {Object.entries(policies).map(([key, data]) => {
                  const isActive = activeKey === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveKey(key as keyof typeof policies)}
                      className={`w-full text-left p-3 border transition-colors flex items-start gap-2.5 ${
                        isActive
                          ? "border-slate-800 bg-white shadow-sm"
                          : "border-transparent hover:bg-slate-200/50"
                      }`}
                    >
                      <FileText className={`h-4.5 w-4.5 shrink-0 mt-0.5 ${isActive ? "text-accent" : "text-slate-400"}`} />
                      <div className="space-y-0.5">
                        <div className={`text-xs font-bold ${isActive ? "text-slate-950" : "text-slate-700"}`}>
                          {data.title}
                        </div>
                        <div className="flex gap-2 text-[9px] font-mono text-slate-400">
                          <span>{data.size}</span>
                          <span>•</span>
                          <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                            <Check className="h-2 w-2" /> {data.status}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Panel 2: Q&A Workspace (Col-span 6) */}
            <div className="lg:col-span-6 p-5 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
                  <HelpCircle className="h-4 w-4 text-slate-400" />
                  <span>Q&A Session Workspace</span>
                </div>

                {/* Input Prompt (Disabled style but filled) */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono uppercase text-slate-400">Ask Document</label>
                  <div className="flex border border-slate-300 px-3 py-2.5 bg-slate-50 text-xs font-bold text-slate-800">
                    {activeData.query}
                  </div>
                </div>

                {/* Response Output */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono uppercase text-slate-400">Grounded Answer Output</label>
                  <div className="border border-slate-200 bg-white p-4 text-xs md:text-sm text-slate-700 leading-relaxed shadow-sm min-h-[120px]">
                    {renderAnswer(activeData.answer)}
                  </div>
                </div>
              </div>

              {/* Citations inspector footnote */}
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  Grounded response verified via RAGAS metrics
                </span>
                <span>Select citation to inspect chunk source</span>
              </div>
            </div>

            {/* Panel 3: Retrieval Inspector (Col-span 3) */}
            <div className="lg:col-span-3 flex flex-col bg-slate-950 text-slate-300 font-mono p-4 min-h-[300px]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                  <Terminal className="h-3 w-3 text-accent" /> Retrieval Inspector
                </span>
                <span className="text-[9px] text-slate-500">Live_Stream</span>
              </div>

              <div className="space-y-4 flex-1 text-[11px] leading-relaxed">
                <div>
                  <span className="block text-[8px] uppercase text-slate-500 tracking-wider">Original Query</span>
                  <span className="text-white">"{activeData.inspector.query}"</span>
                </div>

                <div className="border-t border-slate-900 pt-3 space-y-2">
                  <span className="block text-[8px] uppercase text-slate-500 tracking-wider">Retrieval Candidates</span>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>BM25 Keyword matches:</span>
                    <span className="text-accent font-bold">{activeData.inspector.bm25}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Dense Vector matches:</span>
                    <span className="text-accent font-bold">{activeData.inspector.vector}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>RRF Fusion list:</span>
                    <span className="text-accent font-bold">{activeData.inspector.rrf} candidates</span>
                  </div>
                </div>

                <div className="border-t border-slate-900 pt-3">
                  <span className="block text-[8px] uppercase text-slate-500 tracking-wider mb-1">Cross-Encoder scoring</span>
                  <span className="text-emerald-500 font-bold block bg-slate-900 px-2 py-1 border border-slate-800/80">
                    {activeData.inspector.crossEncoder}
                  </span>
                </div>

                {highlightedCitation && (
                  <div className="border border-accent/30 bg-accent/5 p-2 mt-4 space-y-1">
                    <span className="block text-[8px] text-accent uppercase font-bold tracking-wider">// Citations Metadata</span>
                    <span className="text-[10px] text-slate-200 block">Matched {highlightedCitation}</span>
                    <span className="text-[9px] text-slate-400 block leading-tight">Relevance score: 0.96. Verified grounding match.</span>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
