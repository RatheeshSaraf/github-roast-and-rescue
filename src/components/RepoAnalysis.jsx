import React, { useState } from 'react';
import { 
  FolderGit2, 
  Star, 
  GitFork, 
  ExternalLink, 
  FileText, 
  Trophy, 
  LifeBuoy, 
  Search,
  Info
} from 'lucide-react';

export default function RepoAnalysis({ analyzedRepos = [], onSelectRepoForReadme }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'flagship' | 'rescue'
  const [search, setSearch] = useState('');

  const filteredRepos = analyzedRepos.filter((repo) => {
    if (filter === 'flagship' && !repo.isFlagship) return false;
    if (filter === 'rescue' && !repo.needsRescue) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = repo.name.toLowerCase().includes(q);
      const matchDesc = (repo.description || '').toLowerCase().includes(q);
      const matchLang = (repo.language || '').toLowerCase().includes(q);
      return matchName || matchDesc || matchLang;
    }
    return true;
  });

  const flagshipCount = analyzedRepos.filter((r) => r.isFlagship).length;
  const rescueCount = analyzedRepos.filter((r) => r.needsRescue).length;

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#30363d]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-2">
            <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Repository Telemetry & Signals</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <span>REPOSITORY BREAKDOWN</span>
          </h3>
          <p className="text-sm text-zinc-400 mt-1">
            Analyzing presentation, documentation, and live demo signals per repository
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-[#21262d] text-white border border-[#444c56]'
                : 'text-zinc-400 hover:text-white bg-[#0d1117] border border-[#30363d]'
            }`}
          >
            All ({analyzedRepos.length})
          </button>
          <button
            onClick={() => setFilter('flagship')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              filter === 'flagship'
                ? 'bg-amber-950/40 text-amber-300 border border-amber-500/50'
                : 'text-zinc-400 hover:text-white bg-[#0d1117] border border-[#30363d]'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>🏆 Flagship ({flagshipCount})</span>
          </button>
          <button
            onClick={() => setFilter('rescue')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              filter === 'rescue'
                ? 'bg-red-950/40 text-red-300 border border-red-500/50'
                : 'text-zinc-400 hover:text-white bg-[#0d1117] border border-[#30363d]'
            }`}
          >
            <LifeBuoy className="w-3.5 h-3.5 text-red-400" />
            <span>🚑 Needs Rescue ({rescueCount})</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter repositories by name, stack, or description..."
          className="w-full bg-[#0d1117] border border-[#30363d] focus:border-orange-500 rounded-xl py-2 pl-10 pr-4 text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none font-mono"
        />
      </div>

      {/* Repositories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRepos.map((repo) => {
          const isFlagship = repo.isFlagship;
          const isRescue = repo.needsRescue;

          return (
            <div
              key={repo.id || repo.name}
              className={`rounded-2xl p-5 bg-[#0d1117] border transition-all flex flex-col justify-between ${
                isFlagship
                  ? 'border-amber-500/40 shadow-amber-500/5 shadow-md'
                  : isRescue
                  ? 'border-red-500/30'
                  : 'border-[#30363d]'
              }`}
            >
              <div>
                {/* Top Row: Title + Badges */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-sm text-white hover:text-orange-400 transition-colors inline-flex items-center gap-1 font-mono truncate"
                      >
                        {repo.name}
                        <ExternalLink className="w-3.5 h-3.5 shrink-0 text-zinc-500" />
                      </a>
                      {repo.fork && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 font-mono">
                          Fork
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isFlagship && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950/60 text-amber-300 border border-amber-500/40 flex items-center gap-1 font-mono">
                        <Trophy className="w-3 h-3" /> Flagship
                      </span>
                    )}
                    {isRescue && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950/60 text-red-300 border border-red-500/40 flex items-center gap-1 font-mono">
                        <LifeBuoy className="w-3 h-3" /> Rescue
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-zinc-300 mb-3 min-h-[32px] leading-relaxed">
                  {repo.description || (
                    <span className="text-red-400/80 italic font-mono">
                      ⚠ No description provided in About section.
                    </span>
                  )}
                </p>

                {/* Visual Telemetry Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-3 text-[10px] font-mono">
                  {/* README badge */}
                  <div className={`p-1.5 rounded border flex items-center justify-between ${
                    repo.hasReadme
                      ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                      : 'bg-red-950/30 border-red-500/30 text-red-300'
                  }`}>
                    <span>README:</span>
                    <span className="font-bold">{repo.hasReadme ? '✓ PRESENT' : '✗ MISSING'}</span>
                  </div>

                  {/* Description badge */}
                  <div className={`p-1.5 rounded border flex items-center justify-between ${
                    repo.description
                      ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                      : 'bg-red-950/30 border-red-500/30 text-red-300'
                  }`}>
                    <span>DESC:</span>
                    <span className="font-bold">{repo.description ? '✓ PRESENT' : '✗ MISSING'}</span>
                  </div>

                  {/* Activity badge */}
                  <div className={`p-1.5 rounded border flex items-center justify-between ${
                    repo.activityStatus === 'RECENT'
                      ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                      : 'bg-amber-950/30 border-amber-500/30 text-amber-300'
                  }`}>
                    <span>CADENCE:</span>
                    <span className="font-bold">{repo.activityStatus || 'STALE'}</span>
                  </div>

                  {/* Docs status */}
                  <div className={`p-1.5 rounded border flex items-center justify-between ${
                    repo.docStatus === 'STRONG'
                      ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                      : repo.docStatus === 'ADEQUATE'
                      ? 'bg-amber-950/30 border-amber-500/30 text-amber-300'
                      : 'bg-red-950/30 border-red-500/30 text-red-300'
                  }`}>
                    <span>DOCS:</span>
                    <span className="font-bold">{repo.docStatus || 'WEAK'}</span>
                  </div>
                </div>

                {/* Live Demo Link if exists */}
                {repo.homepage && (
                  <div className="mb-3 text-xs flex items-center gap-1.5 text-cyan-400 font-mono">
                    <span className="text-zinc-500">Live Demo:</span>
                    <a
                      href={repo.homepage.startsWith('http') ? repo.homepage : `https://${repo.homepage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-1 truncate"
                    >
                      {repo.homepage}
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                )}
              </div>

              {/* Bottom stats + Actions */}
              <div className="pt-3 border-t border-[#21262d] flex items-center justify-between text-xs text-zinc-400 font-mono">
                <div className="flex items-center gap-3">
                  {repo.language && (
                    <span className="flex items-center gap-1 text-zinc-300">
                      <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                      {repo.language}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400" />
                    {repo.stargazers_count || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="w-3.5 h-3.5 text-zinc-500" />
                    {repo.forks_count || 0}
                  </span>
                </div>

                {onSelectRepoForReadme && (
                  <button
                    type="button"
                    onClick={() => onSelectRepoForReadme(repo)}
                    className="px-2.5 py-1 rounded bg-[#21262d] hover:bg-[#30363d] text-zinc-200 hover:text-white transition-colors cursor-pointer text-[11px] font-sans font-semibold flex items-center gap-1"
                  >
                    <FileText className="w-3 h-3 text-orange-400" />
                    <span>Generate README</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredRepos.length === 0 && (
        <div className="p-8 text-center text-zinc-500 text-xs font-mono">
          No repositories found matching your filter criteria.
        </div>
      )}

      {/* Priority 15: Mandatory Coding Ability Disclaimer */}
      <div className="mt-6 pt-4 border-t border-[#30363d]/60 flex items-start gap-2.5 text-xs text-zinc-400 bg-orange-950/20 border border-orange-500/20 p-3 rounded-xl">
        <Info className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-zinc-200">Important Technical Disclaimer:</strong> These are GitHub profile signals and presentation indicators, not a direct measurement of individual coding ability or problem-solving capability. Strong engineers often work on private client repositories or internal systems.
        </p>
      </div>
    </div>
  );
}
