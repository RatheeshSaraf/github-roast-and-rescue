import React from 'react';
import { ShieldCheck, AlertOctagon, CheckCircle2, AlertTriangle, ArrowUpRight } from 'lucide-react';

export default function StrengthsAndProblems({ strengths, problems }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Column 1: Strengths */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-[#30363d]">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>Genuine Strengths</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                  {strengths.length} Detected
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Verified signals backed by public repository analytics
              </p>
            </div>
          </div>

          <div className="space-y-3.5">
            {strengths.map((s, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#0d1117] border border-emerald-500/20 hover:border-emerald-500/40 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <h4 className="font-bold text-sm text-white">{s.title}</h4>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#21262d] text-emerald-400 font-semibold">
                    {s.metric}
                  </span>
                </div>
                <p className="text-xs text-zinc-300 pl-6 leading-relaxed">
                  {s.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#30363d]/60 text-xs text-zinc-400">
          💡 Leverage these strong points directly in your resume bullet points.
        </div>
      </div>

      {/* Column 2: Problems */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-[#30363d]">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
              <AlertOctagon className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>Critical Red Flags</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-mono">
                  {problems.length} Issues
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Friction points causing recruiters or hiring managers to bounce
              </p>
            </div>
          </div>

          <div className="space-y-3.5">
            {problems.map((p, idx) => {
              const isHigh = p.severity === 'HIGH';
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl bg-[#0d1117] border transition-colors ${
                    isHigh
                      ? 'border-red-500/40 hover:border-red-500/60'
                      : 'border-amber-500/30 hover:border-amber-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <AlertTriangle
                        className={`w-4 h-4 shrink-0 ${isHigh ? 'text-red-400' : 'text-amber-400'}`}
                      />
                      <h4 className="font-bold text-sm text-white">{p.title}</h4>
                    </div>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                        isHigh
                          ? 'bg-red-950/60 text-red-300 border-red-500/40'
                          : 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      {p.severity}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 pl-6 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#30363d]/60 text-xs text-zinc-400">
          🚨 Fixing the HIGH severity items will produce an immediate jump in your score.
        </div>
      </div>
    </div>
  );
}
