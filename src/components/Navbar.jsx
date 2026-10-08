import React from 'react';
import { Flame, ShieldCheck, Key, Sparkles } from 'lucide-react';
import GithubIcon from './GithubIcon';

export default function Navbar({ onOpenSettings, rateLimitRemaining, onReset }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0d1117]/85 border-b border-[#30363d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer group"
          title="Return to Home"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-zinc-200 to-orange-400 bg-clip-text text-transparent">
                GitHub Roast & Rescue
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                AUDIT V2.0
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono hidden sm:block">
              Turn messy profiles into recruiter magnets
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          {/* Rate limit status pill */}
          {rateLimitRemaining !== null && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161b22] border border-[#30363d] text-xs font-mono text-zinc-300">
              <span className={`w-2 h-2 rounded-full ${rateLimitRemaining < 10 ? 'bg-red-400 animate-ping' : 'bg-emerald-400'}`}></span>
              <span>API: {rateLimitRemaining}/60 left</span>
            </div>
          )}

          {/* Settings / Token button */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-xs font-medium text-zinc-200 transition-colors"
            title="Configure GitHub Token & API Settings"
          >
            <Key className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline">API Settings</span>
          </button>

          {/* GitHub Repo */}
          <a
            href="https://github.com/ratheeshr01/github-roast-and-rescue"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-xs font-medium text-white transition-colors"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
