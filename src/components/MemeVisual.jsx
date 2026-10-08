import React from 'react';

/**
 * Original SVG & CSS Meme Panels
 * 100% Free, Zero external APIs, Zero third-party hotlinks.
 * Humorous, sharp, evidence-backed developer memes that roast the presentation, not the person.
 */
export default function MemeVisual({ type, title, _evidence }) {
  // Infer meme category from type or title
  const normalized = (type || title || '').toLowerCase();

  if (normalized.includes('silent') || normalized.includes('desc') || normalized.includes('telepathy')) {
    return (
      <div className="relative w-full rounded-xl bg-gradient-to-br from-[#12161f] to-[#1c1427] border border-purple-500/30 p-4 text-center overflow-hidden my-3 shadow-inner">
        {/* Ambient glow */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-500/15 rounded-full blur-xl pointer-events-none" />
        
        <div className="inline-block px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold tracking-wider uppercase mb-2 border border-purple-500/30">
          DLC NOT INSTALLED
        </div>

        <div className="h-24 flex items-center justify-center">
          <svg className="w-20 h-20 text-purple-400 animate-pulse" viewBox="0 0 100 100" fill="none">
            {/* Brain Outline */}
            <path d="M50 20 C35 20, 25 30, 25 45 C20 48, 15 58, 20 68 C25 78, 38 80, 50 80 C62 80, 75 78, 80 68 C85 58, 80 48, 75 45 C75 30, 65 20, 50 20 Z" stroke="currentColor" strokeWidth="3" strokeDasharray="4 2" />
            {/* Telepathy Waves */}
            <path d="M15 35 C10 42, 10 52, 15 60" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M85 35 C90 42, 90 52, 85 60" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M8 28 C1 38, 1 58, 8 68" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 3" />
            <path d="M92 28 C99 38, 99 58, 92 68" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 3" />
            {/* Crossed Out Mute */}
            <line x1="35" y1="35" x2="65" y2="65" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
            <circle cx="50" cy="50" r="16" stroke="#ef4444" strokeWidth="3" />
          </svg>
        </div>

        <div className="font-mono text-xs font-bold text-zinc-200 mt-1">
          "Recruiter Telepathy DLC: <span className="text-red-400">404 NOT FOUND</span>"
        </div>
        <p className="text-[11px] text-zinc-400 mt-1 italic font-sans">
          0 descriptions detected. Recruiters are unfortunately not mind-readers.
        </p>
      </div>
    );
  }

  if (normalized.includes('crime') || normalized.includes('readme') && !normalized.includes('welcome')) {
    return (
      <div className="relative w-full rounded-xl bg-gradient-to-br from-[#1b1712] to-[#161b22] border border-amber-500/30 p-4 text-center overflow-hidden my-3 shadow-inner">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-stripes-amber opacity-60" />
        
        {/* Crime Tape Banner */}
        <div className="inline-block px-3 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-black tracking-widest uppercase mb-2 border border-amber-500/40">
          ⚠️ CRIME SCENE: 0 BYTES FOUND
        </div>

        <div className="h-24 flex items-center justify-center gap-3">
          <svg className="w-20 h-20 text-amber-400" viewBox="0 0 100 100" fill="none">
            {/* Blank File Sheet */}
            <rect x="25" y="15" width="50" height="70" rx="4" stroke="currentColor" strokeWidth="3" fill="#0d1117" />
            <path d="M60 15 L75 30 L60 30 Z" fill="currentColor" />
            {/* Empty dotted lines */}
            <line x1="35" y1="40" x2="55" y2="40" stroke="#71717a" strokeWidth="2" strokeDasharray="3 2" />
            <line x1="35" y1="50" x2="65" y2="50" stroke="#71717a" strokeWidth="2" strokeDasharray="3 2" />
            <line x1="35" y1="60" x2="48" y2="60" stroke="#71717a" strokeWidth="2" strokeDasharray="3 2" />
            {/* Magnifying glass finding nothing */}
            <circle cx="62" cy="62" r="14" stroke="#f97316" strokeWidth="3" fill="#161b22" />
            <line x1="72" y1="72" x2="84" y2="84" stroke="#f97316" strokeWidth="4" strokeLinecap="round" />
            <text x="57" y="66" fill="#ef4444" fontSize="12" fontWeight="bold" fontFamily="monospace">?</text>
          </svg>
        </div>

        <div className="font-mono text-xs font-bold text-zinc-200 mt-1">
          "Shipped like Ikea furniture with no instructions."
        </div>
        <p className="text-[11px] text-zinc-400 mt-1 italic font-sans">
          Zero README documentation. How do we build this? Nobody knows.
        </p>
      </div>
    );
  }

  if (normalized.includes('phantom') || normalized.includes('demo') || normalized.includes('live')) {
    return (
      <div className="relative w-full rounded-xl bg-gradient-to-br from-[#121c17] to-[#161b22] border border-emerald-500/30 p-4 text-center overflow-hidden my-3 shadow-inner">
        <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold tracking-wider uppercase mb-2 border border-emerald-500/30">
          WORKS ON MY MACHINE™
        </div>

        <div className="h-24 flex items-center justify-center">
          <svg className="w-24 h-20 text-emerald-400" viewBox="0 0 120 100" fill="none">
            {/* Laptop Base */}
            <rect x="25" y="20" width="70" height="46" rx="3" stroke="currentColor" strokeWidth="3" fill="#0d1117" />
            <path d="M15 68 L105 68 L98 76 L22 76 Z" stroke="currentColor" strokeWidth="2.5" fill="#161b22" />
            {/* Screen contents: localhost:3000 */}
            <rect x="30" y="25" width="60" height="8" rx="2" fill="#21262d" />
            <text x="33" y="31" fill="#10b981" fontSize="5.5" fontFamily="monospace" fontWeight="bold">localhost:3000</text>
            <circle cx="83" cy="29" r="1.5" fill="#ef4444" />
            {/* Big Stamp */}
            <g transform="rotate(-12 60 48)">
              <rect x="32" y="40" width="56" height="15" rx="2" stroke="#f59e0b" strokeWidth="2" fill="#78350f" fillOpacity="0.4" />
              <text x="35" y="51" fill="#fbbf24" fontSize="7" fontWeight="900" fontFamily="monospace">TRUST ME BRO</text>
            </g>
          </svg>
        </div>

        <div className="font-mono text-xs font-bold text-zinc-200 mt-1">
          "Software exists solely on port 3000."
        </div>
        <p className="text-[11px] text-zinc-400 mt-1 italic font-sans">
          No live link attached. Recruiters will rarely clone and run locally.
        </p>
      </div>
    );
  }

  if (normalized.includes('cobweb') || normalized.includes('stale') || normalized.includes('activity')) {
    return (
      <div className="relative w-full rounded-xl bg-gradient-to-br from-[#101726] to-[#161b22] border border-cyan-500/30 p-4 text-center overflow-hidden my-3 shadow-inner">
        <div className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold tracking-wider uppercase mb-2 border border-cyan-500/30">
          CRYOGENIC SLEEP DETECTED
        </div>

        <div className="h-24 flex items-center justify-center">
          <svg className="w-20 h-20 text-cyan-400" viewBox="0 0 100 100" fill="none">
            {/* Cryo capsule */}
            <rect x="35" y="15" width="30" height="70" rx="15" stroke="currentColor" strokeWidth="3" fill="#0d1117" />
            <line x1="35" y1="35" x2="65" y2="35" stroke="currentColor" strokeWidth="2" />
            <line x1="35" y1="65" x2="65" y2="65" stroke="currentColor" strokeWidth="2" />
            {/* Spiderweb top-right */}
            <path d="M70 20 L90 20 M70 20 L85 35 M70 20 L70 40" stroke="#94a3b8" strokeWidth="1.5" />
            <path d="M78 20 C80 25, 82 28, 85 30" stroke="#94a3b8" strokeWidth="1" />
            {/* Sleeping developer / Zzz */}
            <text x="45" y="54" fill="#38bdf8" fontSize="12" fontWeight="bold" fontFamily="monospace">z</text>
            <text x="53" y="47" fill="#38bdf8" fontSize="9" fontWeight="bold" fontFamily="monospace">z</text>
            <text x="59" y="42" fill="#38bdf8" fontSize="7" fontWeight="bold" fontFamily="monospace">z</text>
          </svg>
        </div>

        <div className="font-mono text-xs font-bold text-zinc-200 mt-1">
          "Dormant code awaiting archaeological revival."
        </div>
        <p className="text-[11px] text-zinc-400 mt-1 italic font-sans">
          No commits in 30+ days. Time to breathe fresh life into your repositories.
        </p>
      </div>
    );
  }

  if (normalized.includes('naming') || normalized.includes('scratchpad') || normalized.includes('committee')) {
    return (
      <div className="relative w-full rounded-xl bg-gradient-to-br from-[#1e1512] to-[#161b22] border border-orange-500/30 p-4 text-center overflow-hidden my-3 shadow-inner">
        <div className="inline-block px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 text-[10px] font-mono font-bold tracking-wider uppercase mb-2 border border-orange-500/30">
          NAMING COMMITTEE ON STRIKE
        </div>

        <div className="h-24 flex items-center justify-center">
          <svg className="w-24 h-20 text-orange-400" viewBox="0 0 120 100" fill="none">
            {/* Folder 1: test-1 */}
            <path d="M20 35 L40 35 L48 42 L80 42 L80 75 L20 75 Z" stroke="#71717a" strokeWidth="2" fill="#0d1117" />
            {/* Folder 2: final_v2 */}
            <path d="M30 25 L50 25 L58 32 L90 32 L90 65 L30 65 Z" stroke="#a1a1aa" strokeWidth="2" fill="#161b22" />
            {/* Folder 3: really_final_USETHIS.zip */}
            <path d="M40 18 L60 18 L68 25 L100 25 L100 58 L40 58 Z" stroke="currentColor" strokeWidth="2.5" fill="#21262d" />
            <text x="46" y="42" fill="#fb923c" fontSize="6.5" fontFamily="monospace" fontWeight="bold">final_v3_USE.zip</text>
          </svg>
        </div>

        <div className="font-mono text-xs font-bold text-zinc-200 mt-1">
          "test-1, demo-app, final_final_v2"
        </div>
        <p className="text-[11px] text-zinc-400 mt-1 italic font-sans">
          Scratchpad names dilute production engineering authority.
        </p>
      </div>
    );
  }

  if (normalized.includes('stealth') || normalized.includes('bio') || normalized.includes('classified')) {
    return (
      <div className="relative w-full rounded-xl bg-gradient-to-br from-[#15171c] to-[#161b22] border border-zinc-600/40 p-4 text-center overflow-hidden my-3 shadow-inner">
        <div className="inline-block px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 text-[10px] font-mono font-bold tracking-wider uppercase mb-2 border border-zinc-700">
          CLASSIFIED DOSSIER: BIO REDACTED
        </div>

        <div className="h-24 flex items-center justify-center">
          <svg className="w-20 h-20 text-zinc-400" viewBox="0 0 100 100" fill="none">
            {/* Spy silhouette */}
            <circle cx="50" cy="38" r="16" stroke="currentColor" strokeWidth="3" fill="#0d1117" />
            <path d="M25 78 C25 60, 38 56, 50 56 C62 56, 75 60, 75 78" stroke="currentColor" strokeWidth="3" fill="#0d1117" />
            {/* Redacted censor bars across eyes and chest */}
            <rect x="34" y="33" width="32" height="9" fill="#f43f5e" />
            <rect x="30" y="64" width="40" height="7" fill="#000000" stroke="#52525b" strokeWidth="1" />
          </svg>
        </div>

        <div className="font-mono text-xs font-bold text-zinc-200 mt-1">
          "Bio Status: ██████████"
        </div>
        <p className="text-[11px] text-zinc-400 mt-1 italic font-sans">
          Recruiters spending 15 seconds have no idea what role you want.
        </p>
      </div>
    );
  }

  if (normalized.includes('welcome') || normalized.includes('billboard')) {
    return (
      <div className="relative w-full rounded-xl bg-gradient-to-br from-[#1a1324] to-[#161b22] border border-fuchsia-500/30 p-4 text-center overflow-hidden my-3 shadow-inner">
        <div className="inline-block px-2.5 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-300 text-[10px] font-mono font-bold tracking-wider uppercase mb-2 border border-fuchsia-500/30">
          PRIME REAL ESTATE: ABANDONED
        </div>

        <div className="h-24 flex items-center justify-center">
          <svg className="w-24 h-20 text-fuchsia-400" viewBox="0 0 120 100" fill="none">
            {/* Highway billboard structure */}
            <rect x="25" y="15" width="70" height="42" rx="3" stroke="currentColor" strokeWidth="3" fill="#0d1117" />
            <line x1="45" y1="57" x2="45" y2="85" stroke="#71717a" strokeWidth="4" />
            <line x1="75" y1="57" x2="75" y2="85" stroke="#71717a" strokeWidth="4" />
            <text x="32" y="38" fill="#e879f9" fontSize="6.5" fontFamily="monospace" fontWeight="bold">YOUR AD HERE</text>
            <text x="34" y="47" fill="#71717a" fontSize="5" fontFamily="monospace">github.com/user/user</text>
          </svg>
        </div>

        <div className="font-mono text-xs font-bold text-zinc-200 mt-1">
          "The Personal Welcome Billboard is 100% blank."
        </div>
        <p className="text-[11px] text-zinc-400 mt-1 italic font-sans">
          The single highest converting real estate on your entire profile.
        </p>
      </div>
    );
  }

  // Default / Overachiever / General
  return (
    <div className="relative w-full rounded-xl bg-gradient-to-br from-[#131d24] to-[#161b22] border border-blue-500/30 p-4 text-center overflow-hidden my-3 shadow-inner">
      <div className="inline-block px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-mono font-bold tracking-wider uppercase mb-2 border border-blue-500/30">
        RECRUITER RADAR ACTIVE
      </div>

      <div className="h-24 flex items-center justify-center">
        <svg className="w-20 h-20 text-blue-400" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="22" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
          <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="1.5" />
          <line x1="50" y1="15" x2="50" y2="85" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.5" />
          <line x1="15" y1="50" x2="85" y2="50" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.5" />
          <circle cx="64" cy="36" r="3.5" fill="#f43f5e" className="animate-ping" />
          <circle cx="64" cy="36" r="3.5" fill="#f43f5e" />
        </svg>
      </div>

      <div className="font-mono text-xs font-bold text-zinc-200 mt-1">
        "Recruiter audit sweep in progress."
      </div>
      <p className="text-[11px] text-zinc-400 mt-1 italic font-sans">
        Roast the GitHub presentation, never the human.
      </p>
    </div>
  );
}
