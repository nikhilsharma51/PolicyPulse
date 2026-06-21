export default function WhyPolicyPulse() {
  const stats = [
    {
      value: "95%+",
      label: "Retrieval Precision",
      desc: "Measured against standard RAGAS evaluation pipelines on dense datasets."
    },
    {
      value: "40%",
      label: "Reduction in Search Time",
      desc: "Compared to traditional keyword and file-folder structure queries."
    },
    {
      value: "100%",
      label: "Source Traceability",
      desc: "Every answer generation maps back to verified structural subsections."
    },
    {
      value: "Real-Time",
      label: "Answer Evaluation",
      desc: "Immediate evaluation of faithfulness and answer relevance scores."
    }
  ];

  return (
    <section className="border-b border-slate-200 bg-white py-16 md:py-24" id="why-policypulse">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl border-l-2 border-slate-800 pl-4 md:pl-6 mb-16">
          
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl uppercase">
            Quantifiable trust
          </h2>
          <p className="mt-3 text-slate-600 font-sans text-sm md:text-base">
            Compliance and risk intelligence platforms require validation metrics. PolicyPulse provides empirical performance guarantees.
          </p>
        </div>

        {/* 4 Columns Stats Grid */}
        <div className="grid grid-cols-1 divide-y divide-slate-200 border border-slate-200 sm:grid-cols-2 lg:grid-cols-4 lg:divide-y-0 lg:divide-x bg-[#F8FAFC]">
          {stats.map((stat, idx) => (
            <div key={idx} className="p-8 space-y-3 bg-white flex flex-col justify-between">
              <div>
                <span className="font-mono text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight block">
                  {stat.value}
                </span>
                <span className="font-sans text-sm font-bold text-slate-800 mt-2 block uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
              <p className="font-sans text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Large Institutional Quote Banner */}
        <div className="mt-12 border border-slate-200 bg-[#F8FAFC] p-6 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-accent font-bold mb-2">
            // Mission Statement
          </p>
          <blockquote className="font-sans text-sm md:text-base font-bold text-slate-800 max-w-3xl mx-auto leading-relaxed">
            "Built for teams that require auditability, explainability, and trust in document intelligence systems."
          </blockquote>
        </div>

      </div>
    </section>
  );
}
