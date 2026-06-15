"use client";

import { MessageSquare, Calendar, ChevronRight, HelpCircle } from "lucide-react";

interface Conversation {
  id: string;
  title: string;
  query: string;
  date: string;
}

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
}

export default function ConversationList({
  conversations,
  activeId,
  onSelect
}: ConversationListProps) {
  return (
    <div className="w-64 border-r border-slate-200 bg-[#F8FAFC] flex flex-col h-full shrink-0 font-sans">
      {/* Title */}
      <div className="px-4 py-3.5 border-b border-slate-200 bg-slate-100/60 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <MessageSquare className="h-4 w-4 text-slate-400" />
          Research Sessions
        </span>
        <span className="text-[9px] font-mono text-slate-400">{conversations.length} Active</span>
      </div>

      {/* List */}
      <div className="p-2 space-y-1 overflow-y-auto flex-grow">
        {conversations.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`w-full text-left p-3 border transition-colors flex items-start gap-2.5 ${
                isActive
                  ? "border-slate-800 bg-white shadow-sm"
                  : "border-transparent hover:bg-slate-200/50"
              }`}
            >
              <HelpCircle className={`h-4.5 w-4.5 shrink-0 mt-0.5 ${isActive ? "text-accent" : "text-slate-400"}`} />
              <div className="space-y-0.5 min-w-0 flex-1">
                <div className={`text-xs font-bold truncate ${isActive ? "text-slate-950" : "text-slate-700"}`}>
                  {item.title}
                </div>
                <div className="flex justify-between items-center text-[9px] font-mono text-slate-400">
                  <span className="truncate max-w-[120px]">"{item.query}"</span>
                  <span className="shrink-0">{item.date}</span>
                </div>
              </div>
              <ChevronRight className={`h-3 w-3 shrink-0 self-center text-slate-400 transition-transform ${isActive ? "translate-x-0.5 text-slate-700" : ""}`} />
            </button>
          );
        })}
      </div>

      {/* Bottom Info */}
      <div className="p-3 border-t border-slate-200 bg-white text-center font-mono text-[9px] text-slate-400">
        SECURE RESEARCH WORKSTATION
      </div>
    </div>
  );
}
