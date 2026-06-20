"use client";

import { useCallback, useEffect, useState } from "react";
import ConversationList from "@/components/chat/ConversationList";
import DocumentSelector from "@/components/chat/DocumentSelector";
import AnswerWorkspace from "@/components/chat/AnswerWorkspace";
import SourcePanel from "@/components/chat/SourcePanel";
import { fetchDocuments, type Document, type Source } from "@/lib/api";

type Conversation = {
  id: string;
  title: string;
  query: string;
  date: string;
  answer: string;
  citations: string[];
  docId: string;
  docName: string;
};

type EvidenceDetails = {
  citation: string;
  sourceDoc: string;
  page: number | string;
  chunkText: string;
};

function getConversationTitle(question: string) {
  const trimmed = question.replace(/\?$/, "").trim();
  if (trimmed.length <= 34) return trimmed || "Untitled Query";
  return `${trimmed.slice(0, 31)}...`;
}

function buildEvidenceFromSources(
  sources: Source[],
  docName: string
): Record<string, EvidenceDetails> {
  return sources.reduce<Record<string, EvidenceDetails>>((acc, source) => {
    const citation = `Source ${source.source_number}`;
    acc[citation] = {
      citation,
      sourceDoc: docName,
      page: source.page,
      chunkText: source.content,
    };
    return acc;
  }, {});
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [evidenceDatabase, setEvidenceDatabase] = useState<Record<string, EvidenceDetails>>({});
  const [activeId, setActiveId] = useState("new");
  const [selectedCitation, setSelectedCitation] = useState<string | null>(null);

  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocId, setSelectedDocId] = useState("");
  const [docsLoading, setDocsLoading] = useState(true);
  const [docsError, setDocsError] = useState<string | null>(null);

  const loadDocuments = useCallback(async () => {
    setDocsLoading(true);
    setDocsError(null);
    try {
      const docs = await fetchDocuments();
      setDocuments(docs);

      if (docs.length === 0) {
        setSelectedDocId("");
        return;
      }

      setSelectedDocId((current) => {
        if (current && docs.some((doc) => doc.id === current)) return current;

        const stored =
          typeof window !== "undefined"
            ? window.localStorage.getItem("policypulse.doc_id")
            : null;
        if (stored && docs.some((doc) => doc.id === stored)) return stored;

        return docs[0].id;
      });
    } catch (err) {
      setDocsError(err instanceof Error ? err.message : "Failed to load documents");
    } finally {
      setDocsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleSelectDocument = (docId: string) => {
    setSelectedDocId(docId);
    window.localStorage.setItem("policypulse.doc_id", docId);
  };

  const selectedDocument = documents.find((doc) => doc.id === selectedDocId);
  const activeConversation =
    activeId === "new"
      ? null
      : conversations.find((conversation) => conversation.id === activeId) ?? null;

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
    const docName = selectedDocument?.name ?? "Uploaded document";
    const sourceEvidence = buildEvidenceFromSources(sources, docName);

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
      docId: selectedDocId,
      docName,
    };

    setEvidenceDatabase((prev) => ({ ...prev, ...sourceEvidence }));
    setConversations((prev) => [nextConversation, ...prev]);
    setActiveId(id);
    setSelectedCitation(citations[0] ?? null);
  };

  const handleNewChat = () => {
    setActiveId("new");
    setSelectedCitation(null);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white overflow-hidden font-sans">
      <DocumentSelector
        documents={documents}
        selectedId={selectedDocId}
        onSelect={handleSelectDocument}
        loading={docsLoading}
        error={docsError}
        onRefresh={loadDocuments}
      />

      <ConversationList
        conversations={conversations}
        activeId={activeId}
        onSelect={(id) => {
          setActiveId(id);
          const nextConversation = conversations.find((conversation) => conversation.id === id);
          setSelectedCitation(nextConversation?.citations[0] ?? null);
          if (nextConversation?.docId) {
            handleSelectDocument(nextConversation.docId);
          }
        }}
        onNewChat={handleNewChat}
      />

      <div className="flex-1 flex flex-col min-w-0 border-r border-slate-200">
        <AnswerWorkspace
          key={activeId}
          query={activeConversation?.query ?? ""}
          answer={activeConversation?.answer ?? ""}
          citations={activeConversation?.citations ?? []}
          selectedCitation={selectedCitation}
          onSelectCitation={setSelectedCitation}
          docId={activeId === "new" ? selectedDocId : (activeConversation?.docId ?? selectedDocId)}
          docName={
            activeId === "new"
              ? selectedDocument?.name
              : (activeConversation?.docName ?? selectedDocument?.name)
          }
          onQueryComplete={handleQueryComplete}
        />
      </div>

      <SourcePanel selectedCitation={selectedCitation} evidence={evidenceDatabase} />
    </div>
  );
}
