import { AlertTriangle, AlertCircle, Calendar, ShieldAlert } from "lucide-react";

export default function AlertsPanel() {
  const alerts = [
    {
      title: "New Regulation Detected",
      scope: "EU-AI-ACT // Annex III",
      desc: "Clause 4.2 data logging mandates detected in draft specifications. Verification required.",
      date: "JUN 15, 2026",
      severity: "high"
    },
    {
      title: "Compliance Update Ingested",
      scope: "FINRA // Rule 3110",
      desc: "Supervisor review workflow templates updated. System chunk indexes regenerated.",
      date: "JUN 14, 2026",
      severity: "info"
    },
    {
      title: "Policy Review Required",
      scope: "SOC2-CC-6.3 // Data Encryption",
      desc: "Discrepancy detected between key rotation schedule and active Security Policy §2.4.",
      date: "JUN 12, 2026",
      severity: "warning"
    }
  ];

  return (
    <div className="border border-slate-200 bg-white h-full flex flex-col justify-between">
      {/* Title */}
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <ShieldAlert className="h-4 w-4 text-slate-400" />
          Active Regulatory Alerts
        </span>
        <span className="font-mono text-[9px] text-accent font-bold">03 Alerts</span>
      </div>

      {/* List */}
      <div className="p-4 space-y-3 flex-1">
        {alerts.map((item, idx) => (
          <div
            key={idx}
            className={`border p-3.5 space-y-2 relative hover:bg-slate-50/50 transition-colors ${
              item.severity === "high"
                ? "border-l-4 border-l-red-600 border-slate-200"
                : item.severity === "warning"
                ? "border-l-4 border-l-accent border-slate-200"
                : "border-l-4 border-l-slate-400 border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs font-bold text-slate-900 uppercase">
                {item.title}
              </span>
              <span className="font-mono text-[8px] text-slate-400 flex items-center gap-1">
                <Calendar className="h-2.5 w-2.5" />
                {item.date}
              </span>
            </div>

            <div className="font-mono text-[9px] text-accent uppercase font-bold tracking-wider">
              {item.scope}
            </div>

            <p className="font-sans text-[11px] text-slate-600 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom link */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
        <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500 font-bold hover:text-slate-900 cursor-pointer">
          Configure Alert Rules →
        </span>
      </div>
    </div>
  );
}
