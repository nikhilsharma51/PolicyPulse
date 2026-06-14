import Link from "next/link";
import { Terminal, Shield } from "lucide-react";

export default function CTA() {
  return (
    <section className="bg-slate-900 text-white py-16 md:py-20 relative overflow-hidden" id="launch">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30"></div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border border-slate-800 bg-slate-950 p-8 md:p-12 relative overflow-hidden">
          {/* Corner decoration */}
          <div className="absolute top-0 right-0 h-24 w-24 bg-[radial-gradient(ellipse_at_top_right,#C0843D_0%,transparent_70%)] opacity-30"></div>
          
          <div className="max-w-3xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-1.5 border border-slate-800 bg-slate-900 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent font-bold">
              <Shield className="h-3.5 w-3.5" /> SECURE_PLATFORM_V1.0
            </div>
            
            <h2 className="font-sans text-3xl font-extrabold sm:text-4xl uppercase tracking-tight text-white leading-tight">
              Transform policy documents into searchable intelligence.
            </h2>
            
            <p className="font-sans text-sm md:text-base text-slate-400 max-w-2xl leading-relaxed">
              Move beyond keyword search and gain confidence in every answer. Deploy our explainable retrieval framework inside your local infrastructure or private VPC.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-4 font-mono text-xs uppercase tracking-wider">
              <Link
                href="#launch"
                className="inline-flex h-11 items-center justify-center bg-accent text-slate-950 px-6 font-bold hover:bg-accent-hover transition-colors"
              >
                Launch Platform
              </Link>
              
            </div>
          </div>
          
          {/* Technical sub-metrics */}
          <div className="mt-12 border-t border-slate-800 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between text-[10px] font-mono text-slate-500 gap-4">
            <div className="flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-slate-600" />
              <span>SYSTEM HASH: 9f72b38cd48ea112108ac</span>
            </div>
            <div className="flex gap-4">
              <span>COMPLIANCE: SOC2 TYPE II</span>
              <span>DEPLOYMENT: ONSITE / HYBRID</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
