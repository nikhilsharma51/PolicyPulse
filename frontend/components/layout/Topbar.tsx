"use client";

import { Search, Bell, Upload, User } from "lucide-react";
import Link from "next/link";

export default function Topbar() {
  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 sticky top-0 z-30 font-sans">
      
      {/* Search Input block */}
      <div className="flex-1 max-w-lg flex items-center">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="search"
            placeholder="SEARCH POLICIES [e.g. data retention]..."
            className="block w-full pl-9 pr-3 py-1.5 border border-slate-200 bg-[#F8FAFC] font-mono text-[10px] tracking-wider text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-800 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Action and Profile details */}
      <div className="flex items-center gap-4">
        {/* Upload Policy Button */}
        <Link
          href="/documents"
          className="inline-flex h-9 items-center justify-center border border-slate-800 bg-slate-900 px-4 text-xs font-mono uppercase tracking-wider text-white hover:bg-accent hover:border-accent hover:text-slate-900 transition-all duration-150 gap-2"
        >
          <Upload className="h-3.5 w-3.5" />
          <span>Upload Policy</span>
        </Link>

        {/* Vertical Divider */}
        <span className="h-5 w-px bg-slate-200"></span>

        {/* Notifications */}
        <button
          type="button"
          className="relative p-1.5 border border-slate-200 bg-[#F8FAFC] text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
        >
          <span className="sr-only">View notifications</span>
          <Bell className="h-4 w-4" />
          <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 bg-accent rounded-full"></span>
        </button>

        {/* User initials block */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center border border-slate-800 bg-slate-900 text-white font-mono text-xs font-bold uppercase">
            NA
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-[10px] font-bold text-slate-900 uppercase tracking-tight">Nikhil Sharma</span>
            <span className="text-[8px] font-mono text-slate-400 uppercase -mt-0.5">Administrator</span>
          </div>
        </div>

      </div>

    </header>
  );
}
