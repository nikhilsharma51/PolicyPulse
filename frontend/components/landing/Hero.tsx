"use client";

import { useState } from "react";
import Link from "next/link";
import { Terminal, ShieldCheck, Database, Play, RefreshCw, Cpu } from "lucide-react";

export default function Hero() {
  const [queryState, setQueryState] = useState<"idle" | "retrieving" | "done">("done");
  const [latency, setLatency] = useState(134);

  const simulateRetrieval = () => {
    setQueryState("retrieving");
    setTimeout(() => {
      setQueryState("done");
      setLatency(Math.floor(Math.random() * 80) + 90);
    }, 1200);
  };

  return (
    <section className="relative border-b border-slate-200 bg-slate-50 py-16 md:py-24">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40"></div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-stretch">
          {/* Left Column: Text Content */}
          <div className="flex flex-col justify-center lg:col-span-6 space-y-6">
            <div className="inline-flex max-w-fit items-center gap-2 border border-slate-300 bg-white px-2.5 py-1">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
              </span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-700">
                System Active // Enterprise RAG Pipeline
              </span>
            </div>

            <h1 className="font-sans text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl uppercase">
              Understand complex policy documents with{" "}
              <span className="text-accent underline decoration-slate-300 underline-offset-8">
                explainable
              </span>{" "}
              AI retrieval.
            </h1>

            <p className="font-sans text-base text-slate-600 sm:text-lg max-w-xl leading-relaxed">
              PolicyPulse combines hybrid search, cross-encoder reranking, and evaluation frameworks to deliver accurate answers grounded in your documents—not model guesses.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="#launch"
                className="inline-flex h-11 items-center justify-center border border-slate-900 bg-slate-900 px-6 font-mono text-xs uppercase tracking-wider text-white hover:bg-accent hover:border-accent hover:text-slate-900 transition-all duration-200"
              >
                Launch Platform
              </Link>
              <Link
                href="#architecture"
                className="inline-flex h-11 items-center justify-center border border-slate-200 bg-white px-6 font-mono text-xs uppercase tracking-wider text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
              >
                View Architecture
              </Link>
            </div>

            {/* Sub-bar stats */}
            <div className="grid grid-cols-3 gap-4 border-t border-slate-200 pt-6 font-mono">
              <div>
                <span className="block text-[10px] uppercase text-slate-500 tracking-wider">RETRIEVAL LATENCY</span>
                <span className="text-sm font-bold text-slate-800">{latency}ms avg</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase text-slate-500 tracking-wider">VERIFIABILITY</span>
                <span className="text-sm font-bold text-slate-800">100% Citation</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase text-slate-500 tracking-wider">EVAL FRAMEWORK</span>
                <span className="text-sm font-bold text-slate-800">RAGAS Standard</span>
              </div>
            </div>
          </div>

          {/* Right Column: Terminal */}
          <div className="flex items-center lg:col-span-6">
            <div className="w-full border border-slate-800 bg-slate-950 text-slate-300 font-mono shadow-2xl flex flex-col relative">
              {/* Terminal Title Bar */}
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/50 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-700"></span>
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-700"></span>
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-700"></span>
                  </div>
                  <span className="text-[10px] uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                    <Terminal className="h-3 w-3 text-accent" />
                    Query console // us-east-prod-09
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-emerald-500 border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                    SECURE_NODE
                  </span>
                </div>
              </div>

              {/* Terminal Content Panels */}
              <div className="grid grid-cols-1 md:grid-cols-4 border-b border-slate-800 min-h-[300px]">
                {/* Side Navigation Console */}
                <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-slate-800 p-3 bg-slate-950 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <span className="block text-[8px] uppercase text-slate-500 tracking-widest mb-1.5">POLICIES</span>
                      <div className="space-y-1 text-[10px] text-slate-400">
                        <div className="flex items-center gap-1 text-slate-300 font-semibold">
                          <Database className="h-2.5 w-2.5 text-accent" /> Global_HR
                        </div>
                        <div className="pl-3.5 opacity-60">Security_v2</div>
                        <div className="pl-3.5 opacity-60">Data_Ops_EU</div>
                      </div>
                    </div>
                    <div>
                      <span className="block text-[8px] uppercase text-slate-500 tracking-widest mb-1.5">STRATEGY</span>
                      <div className="space-y-0.5 text-[9px] text-slate-400">
                        <div className="text-accent">[X] BM25</div>
                        <div className="text-accent">[X] DENSE VECTOR</div>
                        <div className="text-accent">[X] RERANKER</div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={simulateRetrieval}
                    disabled={queryState === "retrieving"}
                    className="w-full mt-4 border border-accent bg-accent/10 hover:bg-accent/20 hover:text-white text-accent px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {queryState === "retrieving" ? (
                      <>
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        RUNNING...
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3 fill-accent" />
                        RE-RUN QUERY
                      </>
                    )}
                  </button>
                </div>

                {/* Main Query Console Output */}
                <div className="md:col-span-3 p-4 flex flex-col justify-between space-y-4">
                  {queryState === "retrieving" ? (
                    <div className="flex-1 flex flex-col justify-center items-center py-12 space-y-3">
                      <RefreshCw className="h-6 w-6 text-accent animate-spin" />
                      <div className="text-center space-y-1">
                        <p className="text-[10px] text-slate-300 uppercase tracking-widest">Executing Hybrid Search...</p>
                        <p className="text-[9px] text-slate-500">Retrieving chunks & reranking via cross-encoder</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Query section */}
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase text-slate-500 tracking-widest">// USER QUERY</span>
                        <div className="text-xs text-white border-l-2 border-accent pl-3 py-1 bg-slate-900/40">
                          "What are the data retention requirements for customer records?"
                        </div>
                      </div>

                      {/* Response section */}
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase text-slate-500 tracking-widest">// VERIFIED RESPONSE</span>
                        <div className="text-xs text-slate-200 leading-relaxed bg-slate-900/20 p-2.5 border border-slate-900">
                          Customer records must be retained for{" "}
                          <span className="text-accent underline font-bold">7 years</span> under{" "}
                          <span className="bg-slate-800 text-[10px] px-1 py-0.5 rounded text-white border border-slate-700 cursor-pointer hover:bg-accent hover:text-slate-950 transition-colors">
                            Section 4.2
                          </span>{" "}
                          of the Global Retention policy.
                        </div>
                      </div>

                      {/* Sources block */}
                      <div className="border-t border-slate-900 pt-3 flex items-center justify-between text-[9px] text-slate-400">
                        <span className="flex items-center gap-1.5 text-[8px] uppercase">
                          <Cpu className="h-3 w-3 text-slate-500" /> Model: Llama-3-70B-RAG
                        </span>
                        <span>Latency: {latency}ms</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Terminal Bottom Metadata Indicators */}
              <div className="grid grid-cols-3 divide-x divide-slate-800 bg-slate-900 text-center py-2 text-xs">
                <div className="flex flex-col py-1">
                  <span className="text-[8px] text-slate-400 uppercase tracking-wider">Faithfulness</span>
                  <span className="text-sm font-bold text-accent">0.96</span>
                </div>
                <div className="flex flex-col py-1">
                  <span className="text-[8px] text-slate-400 uppercase tracking-wider">Sources Used</span>
                  <span className="text-sm font-bold text-slate-200">5 Citations</span>
                </div>
                <div className="flex flex-col py-1">
                  <span className="text-[8px] text-slate-400 uppercase tracking-wider">RAG Confidence</span>
                  <span className="text-sm font-bold text-emerald-500 flex items-center justify-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" /> High
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
