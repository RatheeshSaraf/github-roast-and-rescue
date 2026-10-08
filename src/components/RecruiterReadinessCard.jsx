import React, { useState } from 'react';
import { 
  Briefcase, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  TrendingUp, 
  Target 
} from 'lucide-react';

export default function RecruiterReadinessCard({ analysis }) {
  const { 
    recruiterReadinessScore, 
    recruiterGrade, 
    recruiterGradeColor, 
    recruiterCategories = [], 
    recruiterDecision, 
    fastestPath = [] 
  } = analysis;

  const [expandedCat, setExpandedCat] = useState(null);

  const toggleCategory = (id) => {
    setExpandedCat((prev) => (prev === id ? null : id));
  };

  // SVG Gauge calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (recruiterReadinessScore / 100) * circumference;

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 sm:p-8 mb-8 shadow-2xl relative overflow-hidden">
      {/* Background terminal grid glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-500/10 via-amber-500/5 to-transparent pointer-events-none rounded-bl-full" />

      {/* TOP HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#30363d]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs font-semibold mb-2">
            <Briefcase className="w-3.5 h-3.5 text-orange-400" />
            <span>Recruiter Readiness Indicator</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span>RECRUITER READINESS SCORE</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            What technical recruiters and engineering hiring managers infer from observable public GitHub signals.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="text-right">
            <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider block">Estimated Rank</span>
            <span className={`text-xl sm:text-2xl font-black px-3 py-0.5 rounded-lg border font-mono inline-block ${recruiterGradeColor}`}>
              GRADE {recruiterGrade}
            </span>
          </div>
        </div>
      </div>

      {/* HERO SECTION: SCORE + RECRUITER DECISION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 items-stretch">
        {/* Left: Score Gauge */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-[#0d1117] border border-[#30363d]">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
            <span>READINESS BENCHMARK</span>
            <span className="text-orange-400 font-bold">100 MAX</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-4">
            <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  stroke="#21262d"
                  strokeWidth="12"
                  fill="transparent"
                />
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  stroke="url(#recruiter-grad)"
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="recruiter-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="60%" stopColor="#eab308" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tight font-mono">
                  {recruiterReadinessScore}
                </span>
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  / 100
                </span>
              </div>
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <div className="text-xs font-bold text-zinc-300 font-mono">
                {recruiterReadinessScore >= 75
                  ? '🟢 High Recruiter Appeal'
                  : recruiterReadinessScore >= 50
                  ? '🟡 Moderate Screen Friction'
                  : '🔴 Significant Screen Risk'}
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Calculated across 7 observable recruiter dimensions including documentation, discoverability, and maintenance cadence.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-[#21262d] flex items-center justify-between text-[11px] text-zinc-500 font-mono">
            <span>7 Observable Signals</span>
            <span>Zero False Claims</span>
          </div>
        </div>

        {/* Right: PRIORITY 3 — RECRUITER DECISION PANEL */}
        <div className="lg:col-span-7 flex flex-col justify-between p-6 rounded-2xl bg-[#0d1117] border border-[#30363d]">
          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-mono">
                  RECRUITER SCREENING DECISION
                </span>
              </div>
              <span className={`px-3 py-1 rounded-xl font-black text-xs uppercase tracking-wider border font-mono ${recruiterDecision.badgeColor}`}>
                {recruiterDecision.decision === 'SHORTLIST' && '🟢 '}
                {recruiterDecision.decision === 'MAYBE' && '🟡 '}
                {recruiterDecision.decision === 'NEEDS WORK' && '🔴 '}
                {recruiterDecision.decision}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                WHY DID YOU GET THIS OUTCOME?
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {/* Positive signals */}
                <div className="space-y-1.5 p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase font-mono block">
                    Positive Signals
                  </span>
                  {recruiterDecision.whyPositive.slice(0, 3).map((sig, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-zinc-300 leading-snug">
                      <span className="text-emerald-400 shrink-0 font-bold">✓</span>
                      <span>{sig}</span>
                    </div>
                  ))}
                </div>

                {/* Warning flags */}
                <div className="space-y-1.5 p-3 rounded-xl bg-amber-950/20 border border-amber-500/20">
                  <span className="text-[10px] font-bold text-amber-400 uppercase font-mono block">
                    Friction Points
                  </span>
                  {recruiterDecision.whyWarnings.slice(0, 3).map((warn, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-zinc-300 leading-snug">
                      <span className="text-amber-400 shrink-0 font-bold">⚠</span>
                      <span>{warn}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#21262d] flex items-center justify-between text-xs">
            <span className="text-zinc-300 font-medium">
              💡 {recruiterDecision.quickFixSummary}
            </span>
            <span className="text-[11px] text-orange-400 font-mono hidden sm:inline">
              Follow roadmap below ↓
            </span>
          </div>
        </div>
      </div>

      {/* PRIORITY 5 — YOUR FASTEST PATH TO +15 */}
      {fastestPath.length > 0 && (
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-orange-950/30 via-[#161b22] to-amber-950/20 border border-orange-500/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#30363d]/60">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-400" />
              <h3 className="text-lg font-black text-white tracking-tight uppercase">
                YOUR FASTEST PATH TO +15
              </h3>
            </div>
            <span className="text-[11px] text-zinc-400 font-mono">
              Top 3 highest-ROI improvements • Ranked by impact
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fastestPath.map((item) => (
              <div 
                key={item.step} 
                className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] flex flex-col justify-between hover:border-orange-500/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono font-black text-orange-400 text-sm">{item.step}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] font-bold">
                      Est. impact: {item.estimatedImpact} pts
                    </span>
                  </div>
                  <h4 className="font-black text-sm text-white mb-2 leading-snug">
                    {item.title}
                  </h4>
                  <div className="text-xs text-zinc-400 mb-2 leading-relaxed">
                    <strong className="text-red-400 font-semibold block text-[11px]">Problem:</strong>
                    {item.problem}
                  </div>
                  <div className="text-xs text-zinc-300 leading-relaxed bg-[#161b22] p-2 rounded-lg border border-[#21262d]">
                    <strong className="text-emerald-400 font-semibold block text-[11px]">Action:</strong>
                    {item.action}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-[#21262d] flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                  <span>Priority: {item.priority}</span>
                  <span>{item.effort}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-zinc-500 font-mono mt-3 text-center sm:text-right">
            * Estimated impact based on recruiter presentation signals, not a guaranteed score formula.
          </p>
        </div>
      )}

      {/* PRIORITY 2 — EXPLAINABLE SCORING BREAKDOWN (7 PILLARS) */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#30363d]">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>7 RECRUITER PILLARS — EXPLAINABLE BREAKDOWN</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Click any category to answer: <strong className="text-zinc-200">"Why did I get this score?"</strong>
            </p>
          </div>
          <span className="text-xs text-zinc-500 font-mono">
            Click to inspect evidence
          </span>
        </div>

        <div className="space-y-3">
          {recruiterCategories.map((cat) => {
            const pct = Math.round((cat.score / cat.max) * 100);
            const isExpanded = expandedCat === cat.id;

            return (
              <div 
                key={cat.id} 
                className="rounded-xl bg-[#0d1117] border border-[#30363d] overflow-hidden transition-all"
              >
                {/* Header row / accordion trigger */}
                <button
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left hover:bg-[#161b22]/50 transition-colors cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between sm:justify-start gap-3 mb-1.5">
                      <span className="font-bold text-sm text-white flex items-center gap-2">
                        {cat.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#21262d] text-zinc-400 border border-[#30363d]">
                        Weight: {cat.weight}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full sm:max-w-md h-2 rounded-full bg-[#21262d] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          pct >= 75
                            ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                            : pct >= 50
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                            : 'bg-gradient-to-r from-red-500 to-orange-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 font-mono">
                    <div className="text-right">
                      <span className="text-sm font-bold text-white">{cat.score}</span>
                      <span className="text-xs text-zinc-500"> / {cat.max} pts</span>
                    </div>
                    <div className="p-1 rounded-lg bg-[#21262d] text-zinc-400 hover:text-white">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </button>

                {/* Accordion detail: WHY DID I GET THIS SCORE? */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-[#21262d] bg-[#161b22]/40 text-xs space-y-3 animate-in fade-in duration-200">
                    <div className="font-bold text-zinc-300 uppercase tracking-wider text-[11px] font-mono">
                      WHY DID I GET THIS SCORE?
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Positive signals */}
                      <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 space-y-1.5">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase font-mono block">
                          Positive Signals:
                        </span>
                        {cat.positiveSignals.map((pos, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-zinc-200">
                            <span className="text-emerald-400 font-bold shrink-0">✓</span>
                            <span>{pos}</span>
                          </div>
                        ))}
                      </div>

                      {/* Problems */}
                      <div className="p-3 rounded-lg bg-red-950/20 border border-red-500/20 space-y-1.5">
                        <span className="text-[10px] font-bold text-red-400 uppercase font-mono block">
                          Friction / Deficits:
                        </span>
                        {cat.problems.map((prob, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-zinc-300">
                            <span className="text-red-400 font-bold shrink-0">✗</span>
                            <span>{prob}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-500 font-mono">Recruiter Impact:</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                          cat.recruiterImpact === 'High' 
                            ? 'bg-red-950/60 text-red-300 border border-red-500/40' 
                            : 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
                        }`}>
                          {cat.recruiterImpact}
                        </span>
                      </div>
                      <div className="text-zinc-300">
                        <strong className="text-orange-400 font-medium">Recommended Action: </strong>
                        {cat.recommendedAction}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
