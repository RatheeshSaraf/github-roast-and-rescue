import React from 'react';
import { Briefcase, CheckCircle2, AlertTriangle, XCircle, Clock, Eye, Sparkles } from 'lucide-react';

export default function RecruiterTest({ analysis }) {
  const { recruiterChecks, recruiterVerdict, recruiterTone } = analysis;

  const passCount = recruiterChecks.filter((c) => c.status === 'PASS').length;
  const warnCount = recruiterChecks.filter((c) => c.status === 'WARN').length;
  const failCount = recruiterChecks.filter((c) => c.status === 'FAIL').length;

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#30363d]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold mb-2">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>Recruiter Simulation</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <Briefcase className="w-7 h-7 text-blue-400" />
            <span>THE 30-SECOND RECRUITER TEST</span>
          </h3>
          <p className="text-sm text-zinc-400 mt-1">
            What technical screeners & engineering leads decide in their initial 30-second glance
          </p>
        </div>

        {/* Status badges summary */}
        <div className="flex items-center gap-2 self-start md:self-auto text-xs font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {passCount} Pass
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-300 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> {warnCount} Warn
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5 text-red-400" /> {failCount} Fail
          </span>
        </div>
      </div>

      {/* Recruiter Verdict Callout Box */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-[#0d1117] border border-blue-500/30 mb-8 relative">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
            <Eye className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-300 tracking-wider uppercase">
                Recruiter Screener Verdict
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-200 border border-blue-400/30 font-mono">
                30s SCAN
              </span>
            </div>
            <p className="text-base sm:text-lg font-bold text-white mt-1 leading-snug">
              "{recruiterVerdict}"
            </p>
          </div>
        </div>
      </div>

      {/* 9 Checklist Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recruiterChecks.map((check) => {
          let badgeStyles = 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300';
          let icon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;

          if (check.status === 'WARN') {
            badgeStyles = 'bg-amber-950/40 border-amber-500/40 text-amber-300';
            icon = <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
          } else if (check.status === 'FAIL') {
            badgeStyles = 'bg-red-950/40 border-red-500/40 text-red-300';
            icon = <XCircle className="w-4 h-4 text-red-400 shrink-0" />;
          }

          return (
            <div
              key={check.id}
              className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] flex flex-col justify-between hover:border-[#444c56] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className="font-bold text-sm text-zinc-100">{check.title}</h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${badgeStyles}`}>
                    {check.status}
                  </span>
                </div>
                <p className="text-xs text-zinc-300 mb-3 leading-relaxed">
                  {check.detail}
                </p>
              </div>

              <div className="pt-2.5 border-t border-[#21262d] flex items-start gap-1.5 text-[11px] text-zinc-400">
                <span className="font-semibold text-orange-400 shrink-0">Fix:</span>
                <span>{check.fix}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
