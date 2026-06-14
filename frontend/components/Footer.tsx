import Link from "next/link";
import { Shield, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-12 md:py-16 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Upper footer grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12">
          
          {/* Logo & description column */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 group max-w-fit">
              <div className="flex h-8 w-8 items-center justify-center border border-slate-800 bg-slate-900 text-accent transition-colors group-hover:border-accent">
                <Shield className="h-4 w-4 stroke-[1.5]" />
              </div>
              <span className="font-sans text-base font-bold tracking-tight text-slate-900 uppercase">
                Policy<span className="text-accent">Pulse</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              PolicyPulse is a regulatory intelligence and retrieval platform powered by explainable RAG. We deliver accurate document search and auditability for complex enterprise compliance.
            </p>
            <div className="text-[10px] font-mono text-slate-400">
              PLATFORM STATUS: <span className="text-emerald-600 font-bold">ALL SYSTEMS OPERATIONAL</span>
            </div>
          </div>

          {/* Nav columns */}
          <div className="space-y-4">
            <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
              // Platform
            </h4>
            <ul className="space-y-2 text-xs font-mono uppercase tracking-wider text-slate-600">
              <li>
                <Link href="#architecture" className="hover:text-slate-950 hover:underline underline-offset-4 flex items-center gap-0.5">
                  Architecture
                </Link>
              </li>
              <li>
                <Link href="#showcase" className="hover:text-slate-950 hover:underline underline-offset-4 flex items-center gap-0.5">
                  Workspace
                </Link>
              </li>
              <li>
                <Link href="https://github.com" target="_blank" className="hover:text-slate-950 hover:underline underline-offset-4 flex items-center gap-0.5">
                  GitHub <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources column */}
          <div className="space-y-4">
            <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
              // Resources
            </h4>
            <ul className="space-y-2 text-xs font-mono uppercase tracking-wider text-slate-600">
              <li>
                <span className="text-slate-400 cursor-not-allowed">
                  RAG Best Practices
                </span>
              </li>
              <li>
                <span className="text-slate-400 cursor-not-allowed">
                  Evaluation Framework
                </span>
              </li>
              <li>
                <span className="text-slate-400 cursor-not-allowed">
                  Hybrid Retrieval Specs
                </span>
              </li>
            </ul>
          </div>

          {/* Company column */}
          <div className="space-y-4">
            <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
              // Company
            </h4>
            <ul className="space-y-2 text-xs font-mono uppercase tracking-wider text-slate-600">
              <li>
                <span className="text-slate-400 cursor-not-allowed">
                  About
                </span>
              </li>
              <li>
                <span className="text-slate-400 cursor-not-allowed">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-slate-400 cursor-not-allowed">
                  Terms of Service
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Lower footer row */}
        <div className="border-t border-slate-200 pt-8 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-slate-400 gap-4">
          <div>
            © {new Date().getFullYear()} PolicyPulse Inc. All rights reserved.
          </div>
          <div className="flex gap-4">
            <span>IS-01-SECURE</span>
            <span>AES-256 ENCRYPTED</span>
            <span>RAGAS EVALUATED</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
