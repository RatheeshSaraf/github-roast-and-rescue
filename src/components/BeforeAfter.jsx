import React, { useState } from 'react';
import { ArrowRight, Sparkles, Check, X, Copy, Code, Layout, Terminal } from 'lucide-react';

export default function BeforeAfter({ onOpenReadmeGenerator }) {
  const [activeTab, setActiveTab] = useState('repo'); // 'repo' | 'profile' | 'readme'

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#30363d]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Recruiter Visual Transformation</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <span>BEFORE VS AFTER RESCUE</span>
          </h3>
          <p className="text-sm text-zinc-400 mt-1">
            See the exact differences between an ignored profile and a hiring manager magnet
          </p>
        </div>

        {/* Tab selection */}
        <div className="flex items-center p-1 rounded-xl bg-[#0d1117] border border-[#30363d] self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('repo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'repo'
                ? 'bg-[#21262d] text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Repository View
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#21262d] text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Profile Header
          </button>
          <button
            onClick={() => setActiveTab('readme')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'readme'
                ? 'bg-[#21262d] text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            README Anatomy
          </button>
        </div>
      </div>

      {/* Tab 1: Repository Presentation */}
      {activeTab === 'repo' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* BEFORE */}
          <div className="p-5 rounded-2xl bg-[#0d1117] border border-red-500/30">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black px-2.5 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-500/40 uppercase tracking-wider">
                ❌ BEFORE: Ignored by Recruiters
              </span>
              <span className="text-xs text-zinc-500 font-mono">10s bounce</span>
            </div>

            <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] mb-4 font-mono text-xs text-zinc-400 space-y-2">
              <div className="text-white font-bold text-sm">📁 my-final-project-v2</div>
              <div className="text-red-400/80 italic">No description provided.</div>
              <div className="text-zinc-500 text-[11px]">Last updated 14 months ago • 0 stars • 0 forks</div>
              <div className="p-2 rounded bg-[#0d1117] text-zinc-500 text-[11px] border border-[#21262d]">
                README.md: (empty or only contains default boilerplate)
              </div>
            </div>

            <ul className="space-y-2 text-xs text-zinc-400">
              <li className="flex items-center gap-2 text-red-300">
                <X className="w-4 h-4 text-red-400 shrink-0" />
                Vague repository name gives no context
              </li>
              <li className="flex items-center gap-2 text-red-300">
                <X className="w-4 h-4 text-red-400 shrink-0" />
                No live deployment link (forces cloning)
              </li>
              <li className="flex items-center gap-2 text-red-300">
                <X className="w-4 h-4 text-red-400 shrink-0" />
                Zero explanation of architecture or tools
              </li>
            </ul>
          </div>

          {/* AFTER */}
          <div className="p-5 rounded-2xl bg-[#0d1117] border border-emerald-500/40 relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black px-2.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 uppercase tracking-wider">
                ✅ AFTER: Recruiter Ready Showcase
              </span>
              <span className="text-xs text-emerald-400 font-mono">Instant interview hook</span>
            </div>

            <div className="p-4 rounded-xl bg-[#161b22] border border-emerald-500/30 mb-4 font-mono text-xs text-zinc-300 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-white font-bold text-sm">🚀 devpulse-realtime-analytics</div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Live Demo ↗
                </span>
              </div>
              <div className="text-zinc-200">
                High-throughput telemetry dashboard built with TypeScript, React 19, and Tailwind.
              </div>
              <div className="flex flex-wrap gap-1 text-[10px] text-zinc-400">
                <span className="px-1.5 py-0.5 rounded bg-[#21262d]">#react</span>
                <span className="px-1.5 py-0.5 rounded bg-[#21262d]">#typescript</span>
                <span className="px-1.5 py-0.5 rounded bg-[#21262d]">#websocket</span>
              </div>
            </div>

            <ul className="space-y-2 text-xs text-zinc-300">
              <li className="flex items-center gap-2 text-emerald-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                Descriptive repo name + 1-sentence value statement
              </li>
              <li className="flex items-center gap-2 text-emerald-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                Clickable live cloud URL in the About sidebar
              </li>
              <li className="flex items-center gap-2 text-emerald-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                Interactive GIF / screenshot & setup steps in README
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 2: Profile Header */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-[#0d1117] border border-red-500/30">
            <span className="text-xs font-black px-2.5 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-500/40 uppercase tracking-wider">
              ❌ BEFORE: Anonymous & Silent
            </span>
            <div className="mt-4 p-4 rounded-xl bg-[#161b22] border border-[#30363d] space-y-2">
              <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500 font-bold">
                ?
              </div>
              <p className="font-bold text-white">coder123</p>
              <p className="text-xs text-red-400 italic">No bio, no location, no website link.</p>
            </div>
            <p className="text-xs text-zinc-400 mt-4 leading-relaxed">
              Recruiters immediately wonder: "Who is this? Are they seeking internships? Are they even active?"
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0d1117] border border-emerald-500/40">
            <span className="text-xs font-black px-2.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 uppercase tracking-wider">
              ✅ AFTER: Clear Professional Identity
            </span>
            <div className="mt-4 p-4 rounded-xl bg-[#161b22] border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-white font-bold">
                  JS
                </div>
                <div>
                  <p className="font-bold text-white text-base">Jordan Smith</p>
                  <p className="text-xs text-zinc-400 font-mono">@jordansmith • SF Bay Area</p>
                </div>
              </div>
              <p className="text-xs text-zinc-200">
                Full-Stack Engineer building performant web apps (React, Node, Postgres). Open to Summer 2025 roles.
              </p>
              <p className="text-[11px] text-orange-400 font-mono">🔗 jordansmith.dev • linkedin.com/in/jordansmith</p>
            </div>
            <p className="text-xs text-zinc-400 mt-4 leading-relaxed">
              Takes 5 minutes to set up. Converts casual profile views into LinkedIn messages.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: README Anatomy */}
      {activeTab === 'readme' && (
        <div className="p-5 rounded-2xl bg-[#0d1117] border border-purple-500/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h4 className="text-base font-bold text-white">
                The Gold-Standard 5-Section README Blueprint
              </h4>
              <p className="text-xs text-zinc-400">
                What recruiters look for in project documentation:
              </p>
            </div>
            <button
              onClick={onOpenReadmeGenerator}
              className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate Template for My Repo</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-[#161b22] border border-[#30363d]">
              <span className="text-orange-400 font-bold block mb-1">1. Hero Section</span>
              <p className="text-zinc-400 text-[11px]">Badges, Title, 1-line elevator pitch, and live demo URL button.</p>
            </div>
            <div className="p-3 rounded-xl bg-[#161b22] border border-[#30363d]">
              <span className="text-emerald-400 font-bold block mb-1">2. Screenshots</span>
              <p className="text-zinc-400 text-[11px]">Visual GIF or screenshot. 80% of readers look at pictures first.</p>
            </div>
            <div className="p-3 rounded-xl bg-[#161b22] border border-[#30363d]">
              <span className="text-blue-400 font-bold block mb-1">3. Tech Stack</span>
              <p className="text-zinc-400 text-[11px]">Clear bullet points: Frontend, Backend, Database, Cloud hosting.</p>
            </div>
            <div className="p-3 rounded-xl bg-[#161b22] border border-[#30363d]">
              <span className="text-purple-400 font-bold block mb-1">4. Features</span>
              <p className="text-zinc-400 text-[11px]">3–4 bullet points solving the core problem (why it was built).</p>
            </div>
            <div className="p-3 rounded-xl bg-[#161b22] border border-[#30363d]">
              <span className="text-amber-400 font-bold block mb-1">5. Quickstart</span>
              <p className="text-zinc-400 text-[11px]">git clone, npm install, npm run dev in clean code blocks.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
