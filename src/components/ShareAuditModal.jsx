import React, { useState } from 'react';
import { X, Copy, Check, Award, ExternalLink, Flame, ShieldCheck } from 'lucide-react';

export default function ShareAuditModal({ analysis, onClose }) {
  const [copied, setCopied] = useState(false);

  const { user, totalScore, grade, recruiterVerdict, roasts, strengths } = analysis;

  const topRoast = roasts[0] ? roasts[0].roast : 'A mysterious profile waiting for code!';
  const topStrength = strengths[0] ? strengths[0].title : 'Active builder';

  const shareText = `🔥 My GitHub Roast & Rescue Audit:
Score: ${totalScore}/100 (Grade ${grade})
Recruiter Verdict: "${recruiterVerdict.slice(0, 80)}..."
Top Roast: "${topRoast.slice(0, 80)}..."

Audit your profile at: https://github-roast-and-rescue.vercel.app`;

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
            <h3 className="font-bold text-base text-white">Shareable Profile Audit Card</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-[#21262d] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Card */}
        <div className="p-6 bg-[#0d1117] flex justify-center">
          <div className="w-full rounded-2xl bg-gradient-to-br from-[#161b22] via-[#0d1117] to-orange-950/20 border-2 border-[#30363d] p-6 shadow-xl relative overflow-hidden">
            {/* Background watermarks */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar_url}
                  alt={user.login}
                  className="w-12 h-12 rounded-xl border border-[#30363d]"
                />
                <div>
                  <h4 className="font-black text-white text-base leading-tight">
                    {user.name || user.login}
                  </h4>
                  <p className="text-xs text-zinc-400 font-mono">@{user.login}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-orange-400">
                  {totalScore}
                </span>
                <span className="text-xs text-zinc-500 font-mono">/100</span>
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                  GRADE {grade}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0d1117] border border-[#21262d] mb-3 text-xs">
              <span className="text-orange-400 font-bold block mb-1">🔥 Top Roast:</span>
              <p className="text-zinc-200 italic line-clamp-2">
                "{topRoast}"
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#0d1117] border border-[#21262d] mb-4 text-xs">
              <span className="text-blue-400 font-bold block mb-1">👔 30-Sec Verdict:</span>
              <p className="text-zinc-300 line-clamp-2">
                "{recruiterVerdict}"
              </p>
            </div>

            <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono border-t border-[#21262d] pt-3">
              <span>GitHub Roast & Rescue Audit</span>
              <span>recruiter-ready.dev</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-[#161b22] border-t border-[#30363d] flex items-center justify-end gap-2">
          <button
            onClick={handleShareTwitter}
            className="px-4 py-2 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-xs font-semibold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Share on X / Twitter</span>
          </button>
          <button
            onClick={handleCopyText}
            className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Summary</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
