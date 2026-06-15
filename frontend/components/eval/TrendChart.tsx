import { Calendar } from "lucide-react";

export default function TrendChart() {
  // SVG Chart parameters
  // Width: 600, Height: 200
  // Data points for Faithfulness (y values mapped to 200-h):
  // batch 104: 0.90 -> Y=50
  // batch 105: 0.92 -> Y=42
  // batch 106: 0.91 -> Y=46
  // batch 107: 0.95 -> Y=30
  // batch 108: 0.94 -> Y=34
  // batch 109: 0.96 -> Y=22
  
  // Data points for Relevancy:
  // batch 104: 0.88 -> Y=58
  // batch 105: 0.89 -> Y=54
  // batch 106: 0.93 -> Y=38
  // batch 107: 0.90 -> Y=50
  // batch 108: 0.92 -> Y=42
  // batch 109: 0.94 -> Y=34

  return (
    <div className="border border-slate-200 bg-white p-5 space-y-4 font-sans">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <Calendar className="h-4 w-4 text-slate-400" />
          RAGAS Trend Timeline // Last 6 Validation Batches
        </span>
        
        {/* Legend */}
        <div className="flex items-center gap-4 font-mono text-[9px]">
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 bg-emerald-500 rounded-full"></span>
            <span className="text-slate-500">FAITHFULNESS</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 bg-accent rounded-full"></span>
            <span className="text-slate-500">RELEVANCY</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full relative min-h-[220px] pt-4 flex items-center justify-center">
        <svg
          viewBox="0 0 600 200"
          className="w-full h-full text-slate-200"
          preserveAspectRatio="none"
        >
          {/* Grid Lines */}
          <line x1="40" y1="20" x2="580" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="2" />
          <line x1="40" y1="60" x2="580" y2="60" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="2" />
          <line x1="40" y1="100" x2="580" y2="100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="2" />
          <line x1="40" y1="140" x2="580" y2="140" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="2" />
          <line x1="40" y1="180" x2="580" y2="180" stroke="#e2e8f0" strokeWidth="1" />

          {/* Left Y Axis labels */}
          <text x="15" y="24" className="fill-slate-400 font-mono text-[8px]" textAnchor="middle">1.00</text>
          <text x="15" y="64" className="fill-slate-400 font-mono text-[8px]" textAnchor="middle">0.90</text>
          <text x="15" y="104" className="fill-slate-400 font-mono text-[8px]" textAnchor="middle">0.80</text>
          <text x="15" y="144" className="fill-slate-400 font-mono text-[8px]" textAnchor="middle">0.70</text>
          <text x="15" y="184" className="fill-slate-400 font-mono text-[8px]" textAnchor="middle">0.00</text>

          {/* Faithfulness Line Path */}
          <path
            d="M 50 120 L 150 100 L 250 110 L 350 70 L 450 80 L 550 40"
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Faithfulness Dots */}
          <circle cx="50" cy="120" r="4" className="fill-white stroke-[#10b981] stroke-2" />
          <circle cx="150" cy="100" r="4" className="fill-white stroke-[#10b981] stroke-2" />
          <circle cx="250" cy="110" r="4" className="fill-white stroke-[#10b981] stroke-2" />
          <circle cx="350" cy="70" r="4" className="fill-white stroke-[#10b981] stroke-2" />
          <circle cx="450" cy="80" r="4" className="fill-white stroke-[#10b981] stroke-2" />
          <circle cx="550" cy="40" r="4" className="fill-[#10b981]" />

          {/* Relevancy Line Path */}
          <path
            d="M 50 140 L 150 130 L 250 80 L 350 110 L 450 90 L 550 60"
            fill="none"
            stroke="#C0843D"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Relevancy Dots */}
          <circle cx="50" cy="140" r="4" className="fill-white stroke-[#C0843D] stroke-2" />
          <circle cx="150" cy="130" r="4" className="fill-white stroke-[#C0843D] stroke-2" />
          <circle cx="250" cy="80" r="4" className="fill-white stroke-[#C0843D] stroke-2" />
          <circle cx="350" cy="110" r="4" className="fill-white stroke-[#C0843D] stroke-2" />
          <circle cx="450" cy="90" r="4" className="fill-white stroke-[#C0843D] stroke-2" />
          <circle cx="550" cy="60" r="4" className="fill-[#C0843D]" />

          {/* X Axis Labels */}
          <text x="50" y="196" className="fill-slate-500 font-mono text-[8px]" textAnchor="middle">BATCH 104</text>
          <text x="150" y="196" className="fill-slate-500 font-mono text-[8px]" textAnchor="middle">BATCH 105</text>
          <text x="250" y="196" className="fill-slate-500 font-mono text-[8px]" textAnchor="middle">BATCH 106</text>
          <text x="350" y="196" className="fill-slate-500 font-mono text-[8px]" textAnchor="middle">BATCH 107</text>
          <text x="450" y="196" className="fill-slate-500 font-mono text-[8px]" textAnchor="middle">BATCH 108</text>
          <text x="550" y="196" className="fill-slate-500 font-mono text-[8px]" textAnchor="middle">BATCH 109</text>
        </svg>
      </div>

    </div>
  );
}
