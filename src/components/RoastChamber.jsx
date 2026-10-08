import React, { useState } from 'react';
import { Flame, ShieldAlert, Sparkles, AlertCircle, Copy, Check, MessageSquare } from 'lucide-react';

export default function RoastChamber({ roasts }) {
  const [copiedIdx, setCopiedIdx] = useState(null);

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#30363d]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs font-semibold mb-2">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>Honest & Constructive Humor</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <span className="text-orange-500">🔥</span>
            <span>THE ROAST CHAMBER</span>
          </h3>
          <p className="text-sm text-zinc-400 mt-1">
            Data-driven roasts of the profile (never the human) paired with immediate rescues
          </p>
        </div>

        <span className="text-xs font-mono text-zinc-400 bg-[#0d1117] px-3 py-1.5 rounded-lg border border-[#30363d] self-start sm:self-auto">
          {roasts.length} Custom Roasts Generated
        </span>
      </div>

      {/* Roast Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {roasts.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl bg-[#0d1117] border border-[#30363d] overflow-hidden flex flex-col justify-between hover:border-orange-500/40 transition-all shadow-md group"
          >
            {/* Top: Card Header */}
            <div className="p-5 pb-3">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold text-orange-400 tracking-wider uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
                  {item.title}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#21262d] text-zinc-400 border border-[#30363d]">
                  {item.category}
                </span>
              </div>

              {/* Roast Section */}
              <div className="p-3.5 rounded-xl bg-orange-950/20 border border-orange-500/30 mb-3">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-orange-400 mb-1">
                  <Flame className="w-3.5 h-3.5" />
                  <span>🔥 THE ROAST</span>
                </div>
                <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                  "{item.roast}"
                </p>
              </div>

              {/* Rescue Section */}
              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-400 mb-1">
                  <span>🚑 THE RESCUE</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                  {item.rescue}
                </p>
              </div>
            </div>

            {/* Footer Copy Button */}
            <div className="px-5 py-2.5 bg-[#161b22]/60 border-t border-[#21262d] flex items-center justify-between text-xs text-zinc-400">
              <span className="text-[11px] font-mono text-zinc-500">Roast #{index + 1}</span>
              <button
                onClick={() => handleCopy(`🔥 ROAST: "${item.roast}"\n🚑 RESCUE: ${item.rescue}`, index)}
                className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                title="Copy Roast"
              >
                {copiedIdx === index ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Share / Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
