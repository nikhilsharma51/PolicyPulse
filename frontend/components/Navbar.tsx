"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, Menu, X, ArrowUpRight } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-slate-50/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center border border-slate-800 bg-slate-900 text-accent transition-colors group-hover:border-accent">
                <Shield className="h-5 w-5 stroke-[1.5]" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-lg font-bold tracking-tight text-slate-900 uppercase">
                  Policy<span className="text-accent">Pulse</span>
                </span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500 -mt-1 font-medium">
                  Regulatory RAG
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#architecture"
              className="font-mono text-xs uppercase tracking-wider text-slate-600 hover:text-slate-900 transition-colors"
            >
              [ Architecture ]
            </Link>
            
            
            <Link
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs uppercase tracking-wider text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-0.5"
            >
              GitHub <ArrowUpRight className="h-3 w-3" />
            </Link>
          </nav>

          {/* Action CTA */}
          <div className="hidden md:flex items-center">
            <Link
              href="/dashboard"
              className="inline-flex h-9 items-center justify-center border border-slate-900 bg-slate-900 px-5 text-xs font-mono uppercase tracking-wider text-white hover:bg-accent hover:border-accent hover:text-slate-900 transition-all duration-200"
            >
              Launch App
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 bg-slate-50" id="mobile-menu">
          <div className="space-y-1 px-4 py-4 sm:px-6">
            <Link
              href="#architecture"
              onClick={() => setIsOpen(false)}
              className="block font-mono text-xs uppercase tracking-wider text-slate-700 hover:bg-slate-100 hover:text-slate-900 px-3 py-2 border border-transparent hover:border-slate-200"
            >
              Architecture
            </Link>
            <Link
              href="#documentation"
              onClick={() => setIsOpen(false)}
              className="block font-mono text-xs uppercase tracking-wider text-slate-700 hover:bg-slate-100 hover:text-slate-900 px-3 py-2 border border-transparent hover:border-slate-200"
            >
              Documentation
            </Link>
            <Link
              href="https://github.com"
              target="_blank"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-slate-700 hover:bg-slate-100 hover:text-slate-900 px-3 py-2 border border-transparent hover:border-slate-200"
            >
              GitHub <ArrowUpRight className="h-3 w-3" />
            </Link>
            <div className="pt-4 border-t border-slate-200 mt-4">
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex w-full h-10 items-center justify-center border border-slate-900 bg-slate-900 text-xs font-mono uppercase tracking-wider text-white hover:bg-accent hover:border-accent hover:text-slate-900 transition-all duration-200"
              >
                Launch App
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
