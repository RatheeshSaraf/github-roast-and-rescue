import React, { useState } from 'react';
import { Sparkles, Check, X } from 'lucide-react';

export default function BeforeAfter({ onOpenReadmeGenerator }) {
  const [activeTab, setActiveTab] = useState('readme'); // 'readme' | 'repo' | 'bio' | 'commits'

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
            Real side-by-side examples showing the difference between a 10-second rejection and an interview invite
          </p>
        </div>

        {/* Tab selection */}
        <div className="flex flex-wrap items-center p-1 rounded-xl bg-[#0d1117] border border-[#30363d] self-start sm:self-auto gap-1">
          <button
            onClick={() => setActiveTab('readme')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'readme'
                ? 'bg-[#21262d] text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            README Anatomy
          </button>
          <button
            onClick={() => setActiveTab('repo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'repo'
                ? 'bg-[#21262d] text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Repository View
          </button>
          <button
            onClick={() => setActiveTab('bio')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'bio'
                ? 'bg-[#21262d] text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Profile Bio
          </button>
          <button
            onClick={() => setActiveTab('commits')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'commits'
                ? 'bg-[#21262d] text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Commit Hygiene
          </button>
        </div>
      </div>

      {/* Tab 1: README Anatomy */}
      {activeTab === 'readme' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* BEFORE */}
          <div className="p-5 rounded-2xl bg-[#0d1117] border border-red-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black px-2.5 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-500/40 uppercase font-mono">
                  ❌ BEFORE: The Blank Boilerplate
                </span>
                <span className="text-xs text-zinc-500 font-mono">10s bounce</span>
              </div>

              <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] font-mono text-xs text-zinc-300 space-y-2 mb-4">
                <div className="text-zinc-500"># student-management</div>
                <div className="text-zinc-400">Student management system.</div>
                <div className="text-zinc-600 text-[11px] pt-2">### Getting started</div>
                <div className="text-zinc-600 text-[11px]">npm start</div>
              </div>

              <ul className="space-y-2 text-xs text-zinc-400 mb-4">
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>No problem statement or explanation of who it serves</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>No tech stack badges or architecture details</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>Zero live demonstration link or product screenshots</span>
                </li>
              </ul>
            </div>

            <div className="p-2.5 rounded-lg bg-red-950/20 text-red-300 text-xs font-mono border border-red-500/20">
              Verdict: Recruiter closes tab without knowing what was built.
            </div>
          </div>

          {/* AFTER */}
          <div className="p-5 rounded-2xl bg-[#0d1117] border border-emerald-500/40 flex flex-col justify-between relative shadow-lg">
            <div className="absolute top-3 right-3">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold font-mono uppercase">
                Recruiter Ready
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black px-2.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 uppercase font-mono">
                  ✓ AFTER: Professional Product Showcase
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] font-mono text-xs text-zinc-200 space-y-2 mb-4">
                <div className="text-white font-bold text-sm"># EduTrack — Student Management Platform</div>
                <div className="text-emerald-400 text-[11px]">
                  [![Demo](https://img.shields.io/badge/Live_Demo-Online-success)]() [![Stack](https://img.shields.io/badge/TypeScript-React-blue)]()
                </div>
                <p className="text-zinc-300 text-[11px] leading-relaxed">
                  "Full-stack student management platform built with React, Node.js, and PostgreSQL featuring role-based authentication, student records, search, and administrative workflows."
                </p>
                <div className="text-zinc-400 text-[11px] pt-1">
                  <strong>Features:</strong> RBAC Auth • Real-time CSV Export • Audit Trails
                </div>
              </div>

              <ul className="space-y-2 text-xs text-zinc-300 mb-4">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Immediately communicates business value and features</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Interactive 1-click live demo link prominently pinned</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Clear setup guide: Prerequisites, Environment vars, Run scripts</span>
                </li>
              </ul>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-emerald-400 font-semibold">
                Result: Shortlisted for technical screening.
              </span>
              {onOpenReadmeGenerator && (
                <button
                  type="button"
                  onClick={onOpenReadmeGenerator}
                  className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  Generate README Now →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Repository Presentation */}
      {activeTab === 'repo' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-[#0d1117] border border-red-500/30">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black px-2.5 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-500/40 uppercase font-mono">
                ❌ BEFORE
              </span>
            </div>
            <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] mb-4 font-mono text-xs text-zinc-400 space-y-2">
              <div className="text-white font-bold text-sm">📁 final-project-v2</div>
              <div className="text-red-400/80 italic">No description provided.</div>
              <div className="text-zinc-500 text-[11px]">Updated 14 months ago • 0 stars • 0 forks</div>
            </div>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li className="flex items-center gap-2 text-red-300">
                <X className="w-4 h-4 text-red-400 shrink-0" /> Generic name suggests school assignment
              </li>
              <li className="flex items-center gap-2 text-red-300">
                <X className="w-4 h-4 text-red-400 shrink-0" /> No description forces recruiter to guess
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-[#0d1117] border border-emerald-500/40">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black px-2.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 uppercase font-mono">
                ✓ AFTER
              </span>
            </div>
            <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] mb-4 font-mono text-xs text-zinc-200 space-y-2">
              <div className="text-white font-bold text-sm">📁 cloud-metrics-monitor</div>
              <div className="text-zinc-300 text-[11px]">
                Real-time server telemetry dashboard with WebSockets, Next.js 14, and TimescaleDB.
              </div>
              <div className="text-cyan-400 text-[11px]">🔗 https://metrics.mydomain.dev</div>
              <div className="text-zinc-400 text-[11px]">Updated 3 days ago • TypeScript • 18 stars</div>
            </div>
            <ul className="space-y-2 text-xs text-zinc-300">
              <li className="flex items-center gap-2 text-emerald-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Domain-driven project naming
              </li>
              <li className="flex items-center gap-2 text-emerald-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Live deployment URL in repository header
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 3: Profile Bio */}
      {activeTab === 'bio' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-[#0d1117] border border-red-500/30">
            <span className="text-xs font-black px-2.5 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-500/40 uppercase font-mono block mb-4">
              ❌ BEFORE
            </span>
            <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] font-mono text-xs text-zinc-400 italic mb-4">
              "Aspiring developer. CS student @ college. Learning to code. Hire me!"
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Weak, defensive phrasing. The word "aspiring" signals lack of professional confidence and readiness to ship code in production.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0d1117] border border-emerald-500/40">
            <span className="text-xs font-black px-2.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 uppercase font-mono block mb-4">
              ✓ AFTER
            </span>
            <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] font-mono text-xs text-zinc-200 mb-4">
              "Full-Stack Software Engineer building real-time applications with TypeScript, React & Go. Focused on developer tools and distributed systems."
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Confident declaration of specialty, tech stack, and engineering domain. Immediately anchors senior screeners.
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: Commit Hygiene */}
      {activeTab === 'commits' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-[#0d1117] border border-red-500/30">
            <span className="text-xs font-black px-2.5 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-500/40 uppercase font-mono block mb-4">
              ❌ BEFORE: The Panic Commits
            </span>
            <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] font-mono text-xs text-red-300/80 space-y-1 mb-4">
              <div>commit 3b41: fix</div>
              <div>commit 8f12: fix again</div>
              <div>commit 91a2: asdfasdf</div>
              <div>commit 0c14: final fix please work</div>
            </div>
            <p className="text-xs text-zinc-400">
              Looks like uncontrolled trial-and-error without branch discipline or meaningful change logs.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0d1117] border border-emerald-500/40">
            <span className="text-xs font-black px-2.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 uppercase font-mono block mb-4">
              ✓ AFTER: Conventional Commits
            </span>
            <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] font-mono text-xs text-emerald-300 space-y-1 mb-4">
              <div>feat(auth): implement JWT token rotation and refresh middleware</div>
              <div>fix(api): resolve race condition in concurrent user websocket pool</div>
              <div>docs(readme): add docker-compose setup and live demo badge</div>
            </div>
            <p className="text-xs text-zinc-300">
              Follows conventional commit standards used in top engineering organizations.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
