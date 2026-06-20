import { Database, ShieldCheck } from "lucide-react"

export default function Status() {
    return (
        <div className="border border-slate-200 bg-white p-5 space-y-5">
            <div className="border-b border-slate-100 pb-3">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <Database className="h-4.5 w-4.5 text-slate-400" />
                    Ingestion Database Summary
                </span>
            </div>

            <div className="space-y-3 font-mono text-[11px]">
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-500 uppercase">Documents indexed</span>
                    <span className="font-bold text-slate-900">42 / 45</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-500 uppercase">Total vector chunks</span>
                    <span className="font-bold text-slate-900">12,402</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-500 uppercase">Average chunk size</span>
                    <span className="font-bold text-slate-900">512 Tokens</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-500 uppercase">Vector latency</span>
                    <span className="font-bold text-slate-900">~24ms</span>
                </div>
                <div className="flex justify-between items-center py-2">
                    <span className="text-slate-500 uppercase">Embedding model</span>
                    <span className="font-bold text-accent">text-embedding-3</span>
                </div>
            </div>

            {/* Shield note */}
            <div className="border border-slate-200 bg-slate-50 p-3.5 space-y-1">
                <div className="font-mono text-[8px] text-accent uppercase font-bold tracking-wider flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-accent" /> Security Protocol Verified
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                    All document uploads are processed through isolated container namespaces, avoiding multi-tenant overlap. No LLM training occurs on stored vectors.
                </p>
            </div>
        </div>
    )
};