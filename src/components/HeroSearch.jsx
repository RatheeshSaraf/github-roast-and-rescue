import React, { useState } from 'react';
import { Search, Flame, ArrowRight, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

export default function HeroSearch({ onSearch, isLoading, error }) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onSearch(username.trim());
    }
  };

  const sampleUsers = [
    { label: 'Student Profile', user: 'alex-student', tag: 'Typical Messy' },
    { label: 'Dan Abramov', user: 'gaearon', tag: 'Redux Author' },
    { label: 'Linus Torvalds', user: 'torvalds', tag: 'Linux Creator' },
    { label: 'shadcn', user: 'shadcn', tag: 'UI Legend' },
  ];

  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden text-center px-4">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-orange-500/15 via-red-500/10 to-amber-500/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Hackathon Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs font-semibold mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          <span>The Recruiter 30-Second Roast & Rescue Audit</span>
        </div>

        {/* Headline & Subtitle */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white mb-6">
          Your GitHub <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-orange-400 via-red-500 to-amber-400 bg-clip-text text-transparent">
            deserves the truth.
          </span>
        </h1>

        <p className="text-lg sm:text-2xl text-zinc-300 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
          Get roasted. Get rescued. Become recruiter-ready.
        </p>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-6">
          <div className="relative flex items-center shadow-2xl rounded-2xl bg-[#161b22] border-2 border-[#30363d] focus-within:border-orange-500 transition-all p-1.5">
            <div className="pl-4 pr-2 text-zinc-400">
              <span className="font-mono text-zinc-500 text-lg">github.com/</span>
            </div>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter GitHub username"
              disabled={isLoading}
              className="w-full bg-transparent border-none text-white text-base sm:text-lg focus:outline-none placeholder-zinc-500 font-medium py-2"
              autoFocus
            />

            <button
              type="submit"
              disabled={isLoading || !username.trim()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-600/30 whitespace-nowrap cursor-pointer active:scale-95"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Auditing...</span>
                </>
              ) : (
                <>
                  <Flame className="w-4 h-4" />
                  <span>Roast My GitHub</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error message */}
        {error && (
          <div className="max-w-xl mx-auto mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/50 text-red-200 text-sm flex items-start gap-3 text-left">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{error}</p>
              <p className="text-xs text-red-300/80 mt-1">
                Tip: Try one of the quick profiles below to test the full audit experience.
              </p>
            </div>
          </div>
        )}

        {/* Quick Sample Profiles */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto mb-6 text-xs text-zinc-400">
          <span className="font-medium text-zinc-500">Quick Test Profiles:</span>
          {sampleUsers.map((item) => (
            <button
              key={item.user}
              onClick={() => {
                setUsername(item.user);
                onSearch(item.user);
              }}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-zinc-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span className="font-mono font-medium">@{item.user}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-orange-400 border border-zinc-700">
                {item.tag}
              </span>
            </button>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-zinc-500 max-w-lg mx-auto font-mono">
          ⚠️ Analysis uses publicly available GitHub data. Roast the profile, not the person.
        </p>
      </div>
    </section>
  );
}
