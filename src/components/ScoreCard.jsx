import React from 'react';
import { Info, TrendingUp } from 'lucide-react';

export default function ScoreCard({ analysis }) {
  const { totalScore, grade, gradeColor, scoreCategories } = analysis;

  // Calculate SVG stroke dash for radial gauge
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (totalScore / 100) * circumference;

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#30363d]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-orange-400" />
              <span>GitHub Profile Signal Score</span>
            </h3>
            <span className={`px-2.5 py-0.5 rounded-full border text-xs font-black uppercase ${gradeColor}`}>
              Grade {grade}
            </span>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Weighted algorithmic analysis of 7 recruiter visibility benchmarks (0–100)
          </p>
        </div>

        <div className="text-xs text-zinc-400 font-mono bg-[#0d1117] px-3 py-1.5 rounded-lg border border-[#30363d] self-start md:self-auto">
          Scale: 90+ (S) • 80+ (A) • 70+ (B) • 60+ (C) • &lt;60 (Needs Rescue)
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Big Circular Radial Gauge */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-[#0d1117] border border-[#30363d]">
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* SVG circle */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#21262d"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="url(#score-gradient)"
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="50%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#eab308" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner text */}
            <div className="absolute flex flex-col items-center text-center">
              <span className="text-5xl font-black text-white tracking-tight">
                {totalScore}
              </span>
              <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mt-0.5">
                Out of 100
              </span>
              <span className={`mt-1 text-xs font-bold px-2 py-0.5 rounded border ${gradeColor}`}>
                Rank: {grade}
              </span>
            </div>
          </div>

          <p className="text-xs text-center text-zinc-400 mt-4 leading-relaxed">
            {totalScore >= 80
              ? '🌟 Excellent profile presentation and recruiter signals!'
              : totalScore >= 60
              ? '⚡ Solid foundation. Small tweaks will unlock high-tier recruiter attention.'
              : '🚑 High rescue potential! Follow the rescue checklist below.'}
          </p>
        </div>

        {/* Right: 7 Weighted Breakdown Bars */}
        <div className="lg:col-span-8 space-y-3.5">
          {scoreCategories.map((cat) => {
            const pct = Math.round((cat.score / cat.max) * 100);
            return (
              <div key={cat.name} className="p-2.5 rounded-xl bg-[#0d1117] border border-[#30363d]/70">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-200">{cat.name}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">Weight: {cat.weight}</span>
                  </div>
                  <div className="font-mono">
                    <span className="font-bold text-white">{cat.score}</span>
                    <span className="text-zinc-500"> / {cat.max} pts</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-[#21262d] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                      pct >= 80
                        ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                        : pct >= 50
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                        : 'bg-gradient-to-r from-red-500 to-orange-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="mt-6 pt-4 border-t border-[#30363d]/60 flex items-start gap-2.5 text-xs text-zinc-400 bg-orange-950/20 border border-orange-500/20 p-3 rounded-xl">
        <Info className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-zinc-200">Important Disclaimer:</strong> This score audits publicly visible GitHub signals (presentation, documentation, and discoverability) that recruiters and hiring managers scan in 30 seconds. Stars, commit graphs, or follower counts alone do not define engineering problem-solving ability.
        </p>
      </div>
    </div>
  );
}
