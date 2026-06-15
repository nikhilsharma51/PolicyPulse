"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, LayoutDashboard, FileText, MessageSquare, BarChart3, Settings } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Documents", href: "/documents", icon: FileText },
    { name: "Ask Questions", href: "/chat", icon: MessageSquare },
    { name: "Evaluation", href: "/eval", icon: BarChart3 },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-slate-50 flex flex-col h-screen sticky top-0 shrink-0 font-sans">
      {/* Top Branding Section */}
      <div className="h-16 flex items-center px-6 border-b border-slate-200 bg-white">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center border border-slate-800 bg-slate-900 text-accent transition-colors group-hover:border-accent">
            <Shield className="h-5 w-5 stroke-[1.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-sm font-bold tracking-tight text-slate-900 uppercase">
              Policy<span className="text-accent">Pulse</span>
            </span>
            <span className="font-mono text-[8px] uppercase tracking-widest text-slate-500 -mt-1 font-medium">
              Regulatory RAG
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 border font-mono text-[10px] uppercase tracking-wider transition-all duration-150 ${
                isActive
                  ? "border-slate-800 bg-white text-slate-900 font-bold shadow-sm"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-accent" : "text-slate-400"}`} />
              <span>{item.name}</span>
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 bg-accent rounded-full"></span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Lower Settings Section */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <Link
          href="#settings"
          className="flex items-center gap-3 px-3 py-2.5 border border-transparent font-mono text-[10px] uppercase tracking-wider text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
        >
          <Settings className="h-4.5 w-4.5 text-slate-400" />
          <span>Settings</span>
        </Link>
        
        
      </div>
    </aside>
  );
}
