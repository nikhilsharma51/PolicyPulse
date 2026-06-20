"use client";

import { useState, useSyncExternalStore } from "react";
import ConversationList from "@/components/chat/ConversationList";
import AnswerWorkspace from "@/components/chat/AnswerWorkspace";
import EvidencePanel from "@/components/chat/EvidencePanel";
import RetrievalInspector from "@/components/chat/RetrievalInspector";
import { Layers, Terminal } from "lucide-react";
import type { Source } from "@/lib/api";

type Conversation = {
  id: string;
  title: string;
  query: string;
  date: string;
  answer: string;
  citations: string[];
  logs: {
    query: string;
    bm25Count: number;
    vectorCount: number;
    rrfCandidates: number;
    crossEncoderScore: number;
    latencyMs: number;
    vectorDistance: number;
  };
};

type EvidenceDetails = {
  citation: string;
  sourceDoc: string;
  page: number | string;
  confidence: number;
  chunkText: string;
};

const initialConversations: Conversation[] = [
  {
    id: "governance",
    title: "Cross-Border Transfers",
    query: "What policies govern cross-border data transfers?",
    date: "11:02 AM",
    answer: "Cross-border transfers of EU resident data require standard contractual clauses (SCCs) under [Data Governance 4.1]. Furthermore, transfers to jurisdictions lacking adequacy decisions must undergo transfer impact assessments (TIAs) as outlined in [Data Governance 4.2].",
    citations: ["Data Governance 4.1", "Data Governance 4.2"],
    logs: {
      query: "cross-border data transfers",
      bm25Count: 8,
      vectorCount: 12,
      rrfCandidates: 20,
      crossEncoderScore: 0.94,
      latencyMs: 142,
      vectorDistance: 0.28
    }
  },
  {
    id: "security",
    title: "Data Encryption Standards",
    query: "What is the encryption standard for data at rest?",
    date: "JUN 14",
    answer: "All production databases storing personally identifiable information (PII) must be encrypted using AES-256 or stronger under [Security Policy 2.3]. Cryptographic keys must be rotated every 90 days as mandated in [Security Policy 2.4].",
    citations: ["Security Policy 2.3", "Security Policy 2.4"],
    logs: {
      query: "encryption standard data at rest",
      bm25Count: 5,
      vectorCount: 18,
      rrfCandidates: 23,
      crossEncoderScore: 0.97,
      latencyMs: 121,
      vectorDistance: 0.22
    }
  }
];

const initialEvidence: Record<string, EvidenceDetails> = {
  "Data Governance 4.1": {
    citation: "Data Governance 4.1",
    sourceDoc: "Data Governance Policy (v2.4)",
    page: 12,
    confidence: 0.94,
    chunkText: "Section 4.1. Cross-Border Ingestion of EU Resident Records. All data pipelines transferring personally identifiable records of European Union residents outside the European Economic Area (EEA) must execute standard contractual clauses (SCCs) as defined under GDPR guidelines."
  },
  "Data Governance 4.2": {
    citation: "Data Governance 4.2",
    sourceDoc: "Data Governance Policy (v2.4)",
    page: 13,
    confidence: 0.91,
    chunkText: "Section 4.2. Transfer Impact Assessments. In instances where adequacy decisions are lacking for the target jurisdiction, legal operations must complete a Transfer Impact Assessment (TIA) documenting potential threat models and local regulatory compliance oversight laws."
  },
  "Security Policy 2.3": {
    citation: "Security Policy 2.3",
    sourceDoc: "Corporate Information Security Policy",
    page: 4,
    confidence: 0.97,
    chunkText: "Section 2.3. Production Database Encryption. All systems persisting customer records, financial histories, or compliance logs must mandate Advanced Encryption Standard (AES) 256-bit block cipher encryption at rest."
  },
  "Security Policy 2.4": {
    citation: "Security Policy 2.4",
    sourceDoc: "Corporate Information Security Policy",
    page: 5,
    confidence: 0.95,
    chunkText: "Section 2.4. Cryptographic Key Lifecycle. Keys deployed for bulk dataset encryption must undergo automated rotation cycles every 90 days. Deprecated keys must be archived under read-only access schemas."
  }
};

function subscribeDocId(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function getStoredDocId() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem("policypulse.doc_id") ?? "";
}
function getConversationTitle(question: string) {
  const trimmed = question.replace(/\?$/, "").trim();
  if (trimmed.length <= 34) return trimmed || "Untitled Query";
  return `${trimmed.slice(0, 31)}...`;
}

function buildEvidenceFromSources(sources: Source[], docId: string) {
  return sources.reduce<Record<string, EvidenceDetails>>((acc, source) => {
    const citation = `Source ${source.source_number}`;
    acc[citation] = {
      citation,
      sourceDoc: docId ? `Document ${docId}` : "Uploaded document",
      page: source.page,
      confidence: 1,
      chunkText: source.content,
    };
    return acc;
  }, {});
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [evidenceDatabase, setEvidenceDatabase] = useState<Record<string, EvidenceDetails>>(initialEvidence);
  const [activeId, setActiveId] = useState("governance");
  const [selectedCitation, setSelectedCitation] = useState<string | null>(initialConversations[0].citations[0] ?? null);
  const [rightPanelTab, setRightPanelTab] = useState<"evidence" | "inspector">("evidence");
  const docId = useSyncExternalStore(subscribeDocId, getStoredDocId, () => "");

  const activeConversation = conversations.find((c) => c.id === activeId) || conversations[0];

  const handleSelectCitation = (citation: string | null) => {
    setSelectedCitation(citation);
    if (citation) setRightPanelTab("evidence");
  };

  const handleQueryComplete = ({
    question,
    answer,
    sources,
  }: {
    question: string;
    answer: string;
    sources: Source[];
  }) => {
    const id = `query-${Date.now()}`;
    const citations = sources.map((source) => `Source ${source.source_number}`);
    const sourceEvidence = buildEvidenceFromSources(sources, docId);

    const nextConversation: Conversation = {
      id,
      title: getConversationTitle(question),
      query: question,
      date: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      answer,
      citations,
      logs: {
        query: question,
        bm25Count: sources.length,
        vectorCount: sources.length,
        rrfCandidates: sources.length,
        crossEncoderScore: sources.length > 0 ? 1 : 0,
        latencyMs: 0,
        vectorDistance: 0,
      },
    };

    setEvidenceDatabase((prev) => ({ ...prev, ...sourceEvidence }));
    setConversations((prev) => [nextConversation, ...prev]);
    setActiveId(id);
    setSelectedCitation(citations[0] ?? null);
    setRightPanelTab("evidence");
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white overflow-hidden font-sans">
      <ConversationList
        conversations={conversations}
        activeId={activeId}
        onSelect={(id) => {
          setActiveId(id);
          const nextConversation = conversations.find((conversation) => conversation.id === id);
          setSelectedCitation(nextConversation?.citations[0] ?? null);
        }}
      />

      <div className="flex-1 flex flex-col min-w-0 border-r border-slate-200">
        <AnswerWorkspace
          key={activeConversation.id}
          query={activeConversation.query}
          answer={activeConversation.answer}
          citations={activeConversation.citations}
          selectedCitation={selectedCitation}
          onSelectCitation={handleSelectCitation}
          docId={docId}
          onQueryComplete={handleQueryComplete}
        />
      </div>

      <div className="w-80 flex flex-col h-full bg-[#F8FAFC] shrink-0 border-l border-slate-100">
        <div className="grid grid-cols-2 border-b border-slate-200 bg-white">
          <button
            onClick={() => setRightPanelTab("evidence")}
            className={`py-3 text-center font-mono text-[9px] uppercase tracking-wider border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
              rightPanelTab === "evidence"
                ? "border-accent text-slate-900 font-bold bg-slate-50/50"
                : "border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50/30"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>[ Evidence Chunks ]</span>
          </button>
          <button
            onClick={() => setRightPanelTab("inspector")}
            className={`py-3 text-center font-mono text-[9px] uppercase tracking-wider border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
              rightPanelTab === "inspector"
                ? "border-accent text-slate-900 font-bold bg-slate-50/50"
                : "border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50/30"
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>[ Inspector ]</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {rightPanelTab === "evidence" ? (
            <EvidencePanel
              activeCitation={selectedCitation}
              evidence={evidenceDatabase}
            />
          ) : (
            <RetrievalInspector logs={activeConversation.logs} />
          )}
        </div>
      </div>
    </div>
  );
}



