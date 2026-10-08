import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Award, 
  ExternalLink, 
  Flame, 
  Target, 
  LifeBuoy 
} from 'lucide-react';

export default function ShareAuditModal({ analysis, onClose }) {
  const [copied, setCopied] = useState(false);

  const { 
    user, 
    recruiterReadinessScore, 
    recruiterGrade, 
    recruiterDecision, 
    roasts = [], 
    fastestPath = [] 
  } = analysis;

  const bestRoast = roasts[0]?.roast || 'Your repositories are waiting for their first proper introduction.';
  const bestRescue = roasts[0]?.rescue || fastestPath[0]?.action || 'Add concise descriptions and a README to your top repositories.';
  const decisionText = recruiterDecision?.decision || 'MAYBE';

  const shareText = `🔥 GITHUB ROAST & RESCUE AUDIT
Developer: @${user.login}
Recruiter Readiness: ${recruiterReadinessScore}/100 (Grade ${recruiterGrade})
Verdict: ${decisionText}

"${bestRoast}"

🚑 RESCUE:
${bestRescue}

ROAST THE PROFILE. NOT THE PERSON.
Get audited: https://github-roast-and-rescue.web.app`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareTwitter = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(tweetUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#30363d] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base text-white">Shareable Recruiter Roast Card</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-[#21262d] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature 12: Visual Roast Card */}
        <div className="p-6 bg-[#0d1117] flex justify-center">
          <div className="w-full rounded-2xl bg-gradient-to-br from-[#161b22] via-[#0d1117] to-orange-950/20 border-2 border-[#30363d] p-6 shadow-xl relative overflow-hidden">
            {/* Ambient corner glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-bl-full pointer-events-none" />

            {/* Header row: Avatar, Name, Grade & Score */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#30363d]/60">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar_url}
                  alt={user.login}
                  className="w-14 h-14 rounded-2xl border-2 border-orange-500/40 object-cover bg-zinc-800 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-orange-500 text-xs">🔥</span>
                    <span className="font-mono text-xs font-bold text-orange-400 uppercase tracking-wider">ROAST TARGET</span>
                  </div>
                  <h4 className="font-black text-white text-base leading-tight">
                    {user.name || user.login}
                  </h4>
                  <p className="text-xs text-zinc-400 font-mono">@{user.login}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-zinc-400 uppercase font-mono">Readiness</div>
                <div className="flex items-baseline justify-end gap-1">
                  <span className="text-3xl font-black text-white font-mono">
                    {recruiterReadinessScore}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">/100</span>
                </div>
                <p className="text-[11px] font-black text-amber-400 uppercase tracking-widest font-mono">
                  GRADE {recruiterGrade}
                </p>
              </div>
            </div>

            {/* Screening Decision */}
            <div className="mb-4 p-2.5 rounded-xl bg-[#0d1117] border border-[#21262d] flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-orange-400" /> Screening Verdict:
              </span>
              <span className={`font-black uppercase px-2 py-0.5 rounded border ${
                decisionText === 'SHORTLIST'
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                  : decisionText === 'MAYBE'
                  ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                  : 'bg-red-950/60 text-red-300 border-red-500/40'
              }`}>
                {decisionText}
              </span>
            </div>

            {/* Feature 12: Best Roast Box */}
            <div className="p-3.5 rounded-xl bg-orange-950/20 border border-orange-500/30 mb-3">
              <div className="flex items-center gap-1.5 text-xs font-black text-orange-400 mb-1 font-mono">
                <Flame className="w-3.5 h-3.5" />
                <span>THE VERDICT ROAST:</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed italic">
                "{bestRoast}"
              </p>
            </div>

            {/* Feature 12: Best Rescue Box */}
            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 mb-4">
              <div className="flex items-center gap-1.5 text-xs font-black text-emerald-400 mb-1 font-mono">
                <LifeBuoy className="w-3.5 h-3.5" />
                <span>🚑 RESCUE:</span>
              </div>
              <p className="text-xs text-zinc-200 leading-relaxed font-sans">
                {bestRescue}
              </p>
            </div>

            {/* Footer watermark & Motto */}
            <div className="pt-3 border-t border-[#21262d] flex items-center justify-between text-[10px] text-zinc-500 font-mono">
              <span className="flex items-center gap-1 text-orange-400 font-bold">
                <Flame className="w-3 h-3" /> GITHUB ROAST & RESCUE
              </span>
              <span className="text-zinc-400 uppercase tracking-wider font-semibold">
                ROAST THE PROFILE. NOT THE PERSON.
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="p-5 bg-[#161b22] border-t border-[#30363d] flex items-center justify-between gap-3">
          <button
            onClick={handleShareTwitter}
            className="px-4 py-2.5 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-xs font-bold text-zinc-200 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer border border-[#30363d]"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Share on X / Twitter</span>
          </button>

          <button
            onClick={handleCopyText}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-orange-600/20 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Audit Summary</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
