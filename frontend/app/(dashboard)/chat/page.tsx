"use client";

import { useState, useEffect } from "react";
import ConversationList from "@/components/chat/ConversationList";
import AnswerWorkspace from "@/components/chat/AnswerWorkspace";
import EvidencePanel from "@/components/chat/EvidencePanel";
import RetrievalInspector from "@/components/chat/RetrievalInspector";
import { Layers, Terminal } from "lucide-react";

export default function ChatPage() {
  // Mock conversations database
  const conversations = [
    {
      id: "governance",
      title: "Cross-Border Transfers",
      query: "What policies govern cross-border data transfers?",
      date: "11:02 AM",
      answer: "Cross-border transfers of EU resident data require standard contractual clauses (SCCs) under [Data Governance §4.1]. Furthermore, transfers to jurisdictions lacking adequacy decisions must undergo transfer impact assessments (TIAs) as outlined in [Data Governance §4.2].",
      citations: ["Data Governance §4.1", "Data Governance §4.2"],
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
      answer: "All production databases storing personally identifiable information (PII) must be encrypted using AES-256 or stronger under [Security Policy §2.3]. Cryptographic keys must be rotated every 90 days as mandated in [Security Policy §2.4].",
      citations: ["Security Policy §2.3", "Security Policy §2.4"],
      logs: {
        query: "encryption standard data at rest",
        bm25Count: 5,
        vectorCount: 18,
        rrfCandidates: 23,
        crossEncoderScore: 0.97,
        latencyMs: 121,
        vectorDistance: 0.22
      }
    },
    {
      id: "handbook",
      title: "Remote Work Allowances",
      query: "What is the remote work equipment stipend policy?",
      date: "JUN 12",
      answer: "Full-time remote workers are eligible for a one-time home office equipment stipend of up to $1,000 under [Employee Handbook §6.1]. Receipt submissions for reimbursement must occur within 30 days of acquisition under [Employee Handbook §6.2].",
      citations: ["Employee Handbook §6.1", "Employee Handbook §6.2"],
      logs: {
        query: "remote work equipment stipend",
        bm25Count: 3,
        vectorCount: 10,
        rrfCandidates: 13,
        crossEncoderScore: 0.89,
        latencyMs: 108,
        vectorDistance: 0.32
      }
    },
    {
      id: "vendor",
      title: "Vendor Security Audits",
      query: "What are the SOC 2 certification requirements for third-party vendors?",
      date: "JUN 10",
      answer: "All Class 1 third-party vendor platforms hosting customer records must submit a SOC 2 Type II audit report annually under [Vendor Manual §1.5]. Subcontractors are bound by equivalent compliance levels as detailed in [Vendor Manual §1.6].",
      citations: ["Vendor Manual §1.5", "Vendor Manual §1.6"],
      logs: {
        query: "SOC 2 certification vendor compliance",
        bm25Count: 9,
        vectorCount: 15,
        rrfCandidates: 24,
        crossEncoderScore: 0.95,
        latencyMs: 134,
        vectorDistance: 0.26
      }
    }
  ];

  // Mock evidence database
  const evidenceDatabase = {
    "Data Governance §4.1": {
      citation: "Data Governance §4.1",
      sourceDoc: "Data Governance Policy (v2.4)",
      page: 12,
      confidence: 0.94,
      chunkText: "Section 4.1. Cross-Border Ingestion of EU Resident Records. All data pipelines transferring personally identifiable records of European Union residents outside the European Economic Area (EEA) must execute standard contractual clauses (SCCs) as defined under GDPR guidelines."
    },
    "Data Governance §4.2": {
      citation: "Data Governance §4.2",
      sourceDoc: "Data Governance Policy (v2.4)",
      page: 13,
      confidence: 0.91,
      chunkText: "Section 4.2. Transfer Impact Assessments. In instances where adequacy decisions are lacking for the target jurisdiction, legal operations must complete a Transfer Impact Assessment (TIA) documenting potential threat models and local regulatory compliance oversight laws."
    },
    "Security Policy §2.3": {
      citation: "Security Policy §2.3",
      sourceDoc: "Corporate Information Security Policy",
      page: 4,
      confidence: 0.97,
      chunkText: "Section 2.3. Production Database Encryption. All systems persisting customer records, financial histories, or compliance logs must mandate Advanced Encryption Standard (AES) 256-bit block cipher encryption at rest."
    },
    "Security Policy §2.4": {
      citation: "Security Policy §2.4",
      sourceDoc: "Corporate Information Security Policy",
      page: 5,
      confidence: 0.95,
      chunkText: "Section 2.4. Cryptographic Key Lifecycle. Keys deployed for bulk dataset encryption must undergo automated rotation cycles every 90 days. Deprecated keys must be archived under read-only access schemas."
    },
    "Employee Handbook §6.1": {
      citation: "Employee Handbook §6.1",
      sourceDoc: "Internal Employee Operations Manual",
      page: 22,
      confidence: 0.89,
      chunkText: "Section 6.1. Workspace Equipment Allowance. Eligible remote workers are entitled to a remote work stipend up to $1,000 to cover primary desk materials, ergonomic seating, and monitors."
    },
    "Employee Handbook §6.2": {
      citation: "Employee Handbook §6.2",
      sourceDoc: "Internal Employee Operations Manual",
      page: 23,
      confidence: 0.87,
      chunkText: "Section 6.2. Expenses Substantiation. Requisition requests must submit standard invoice PDFs or receipts within 30 days of acquisition via the corporate finance ledger portal."
    },
    "Vendor Manual §1.5": {
      citation: "Vendor Manual §1.5",
      sourceDoc: "Third Party Compliance Framework",
      page: 8,
      confidence: 0.95,
      chunkText: "Section 1.5. Vendor Security Attestation. Class 1 vendor products accessing live environment databases are required to file an annual SOC 2 Type II audit report covering security, confidentiality, and availability principles."
    },
    "Vendor Manual §1.6": {
      citation: "Vendor Manual §1.6",
      sourceDoc: "Third Party Compliance Framework",
      page: 9,
      confidence: 0.92,
      chunkText: "Section 1.6. Subcontractor Security Alignment. Vendor service providers utilizing subcontractors for processing operational data must ensure all such entities contractually execute equivalent security standards."
    }
  } as any;

  const [activeId, setActiveId] = useState("governance");
  const [selectedCitation, setSelectedCitation] = useState<string | null>(null);
  const [rightPanelTab, setRightPanelTab] = useState<"evidence" | "inspector">("evidence");

  // Select the active conversation item
  const activeConversation = conversations.find((c) => c.id === activeId) || conversations[0];

  // Auto select the first citation of the active conversation on load/change
  useEffect(() => {
    if (activeConversation.citations.length > 0) {
      setSelectedCitation(activeConversation.citations[0]);
    } else {
      setSelectedCitation(null);
    }
  }, [activeId]);

  // Handle citation highlight update
  const handleSelectCitation = (citation: string | null) => {
    setSelectedCitation(citation);
    if (citation) {
      // Auto-toggle tab so the user sees evidence immediately
      setRightPanelTab("evidence");
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white overflow-hidden font-sans">
      
      {/* 1. Left Conversation Sidebar */}
      <ConversationList
        conversations={conversations}
        activeId={activeId}
        onSelect={(id) => {
          setActiveId(id);
          setSelectedCitation(null);
        }}
      />

      {/* 2. Middle Answer Workspace */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-slate-200">
        <AnswerWorkspace
          query={activeConversation.query}
          answer={activeConversation.answer}
          citations={activeConversation.citations}
          selectedCitation={selectedCitation}
          onSelectCitation={handleSelectCitation}
        />
      </div>

      {/* 3. Right Panel Sidebar: Citation Evidence & Retrieval Inspector Tabs */}
      <div className="w-80 flex flex-col h-full bg-[#F8FAFC] shrink-0 border-l border-slate-100">
        {/* Tab Selectors */}
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

        {/* Dynamic Panel View */}
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
