import React from 'react';
import { ShieldCheck, AlertOctagon, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function StrengthsAndProblems({ strengths = [], problems = [] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Column 1: Evidence-Based Strengths */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-[#30363d]">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>EVIDENCE-BASED STRENGTHS</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                  {strengths.length} Verified
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Observable technical signals verified by public repository analytics
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {strengths.map((s, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#0d1117] border border-emerald-500/20 hover:border-emerald-500/40 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <h4 className="font-bold text-sm text-white uppercase tracking-tight">{s.title}</h4>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#21262d] text-emerald-400 font-semibold border border-[#30363d]">
                    {s.metric}
                  </span>
                </div>

                {/* Evidence */}
                {s.evidence && (
                  <div className="text-xs text-zinc-300 pl-6 leading-relaxed">
                    <strong className="text-zinc-400 font-mono text-[11px] block">Evidence:</strong>
                    <span>{s.evidence}</span>
                  </div>
                )}

                {/* Why recruiters care */}
                {s.whyRecruitersCare && (
                  <div className="text-xs text-zinc-400 pl-6 leading-relaxed bg-[#161b22] p-2.5 rounded-lg border border-[#21262d]">
                    <strong className="text-emerald-400 font-medium block text-[11px]">Why Recruiters Care:</strong>
                    <span>{s.whyRecruitersCare}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#30363d]/60 text-xs text-zinc-400 flex items-center justify-between">
          <span>💡 Highlight these verified signals on your resume.</span>
          <span className="font-mono text-[11px] text-emerald-400 font-semibold">{strengths.length} Strong Signals</span>
        </div>
      </div>

      {/* Column 2: Evidence-Based Red Flags */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-[#30363d]">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
              <AlertOctagon className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>EVIDENCE-BASED RED FLAGS</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-mono">
                  {problems.length} Detected
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Friction points causing recruiters and screeners to pass on candidate profiles
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {problems.map((p, idx) => {
              const isHigh = p.severity === 'HIGH';
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#0d1117] border border-red-500/20 hover:border-red-500/40 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                      <h4 className="font-bold text-sm text-white uppercase tracking-tight">{p.title}</h4>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border uppercase ${
                      isHigh ? 'bg-red-950/60 text-red-400 border-red-500/40' : 'bg-amber-950/60 text-amber-400 border-amber-500/40'
                    }`}>
                      {p.severity} RISK
                    </span>
                  </div>

                  {/* Evidence */}
                  {p.evidence && (
                    <div className="text-xs text-zinc-300 pl-6 leading-relaxed">
                      <strong className="text-zinc-400 font-mono text-[11px] block">Evidence:</strong>
                      <span>{p.evidence}</span>
                    </div>
                  )}

                  {/* Recruiter impact */}
                  {p.recruiterImpact && (
                    <div className="text-xs text-zinc-400 pl-6 leading-relaxed">
                      <strong className="text-red-400 font-medium block text-[11px]">Recruiter Impact:</strong>
                      <span>{p.recruiterImpact}</span>
                    </div>
                  )}

                  {/* Actionable Fix */}
                  {p.fix && (
                    <div className="text-xs text-zinc-300 pl-6 leading-relaxed bg-[#161b22] p-2.5 rounded-lg border border-[#21262d]">
                      <strong className="text-orange-400 font-semibold block text-[11px]">Recommended Fix:</strong>
                      <span>{p.fix}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#30363d]/60 text-xs text-zinc-400 flex items-center justify-between">
          <span>🛠 Fix these points using the step-by-step rescue plan below.</span>
          <span className="font-mono text-[11px] text-amber-400 font-semibold">Resolvable in &lt;1 hour</span>
        </div>
      </div>
    </div>
  );
}
