import React, { useState } from 'react';
import { 
  FolderGit2, 
  Star, 
  GitFork, 
  ExternalLink, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Trophy, 
  LifeBuoy, 
  Search,
  Filter
} from 'lucide-react';

export default function RepoAnalysis({ analyzedRepos, onSelectRepoForReadme }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'flagship' | 'rescue'
  const [search, setSearch] = useState('');

  const filteredRepos = analyzedRepos.filter((repo) => {
    // Tab filter
    if (filter === 'flagship' && !repo.isFlagship) return false;
    if (filter === 'rescue' && !repo.needsRescue) return false;
    // Search query
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
            <span>Granular Audit</span>
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
            <span>⚠️ Needs Rescue ({rescueCount})</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter repositories by name, language, or keyword..."
          className="w-full bg-[#0d1117] border border-[#30363d] focus:border-orange-500 rounded-xl py-2 pl-10 pr-4 text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none"
        />
      </div>

      {/* Repos Grid */}
      {filteredRepos.length === 0 ? (
        <div className="p-8 text-center text-zinc-500 bg-[#0d1117] rounded-xl border border-[#30363d]">
          No repositories match the current filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRepos.map((repo) => {
            const updatedDate = new Date(repo.updated_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={repo.id}
                className="p-5 rounded-2xl bg-[#0d1117] border border-[#30363d] hover:border-[#444c56] transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-white hover:text-orange-400 transition-colors flex items-center gap-1.5 text-sm sm:text-base"
                      >
                        <span>{repo.name}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
                      </a>
                      {repo.fork && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                          fork
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#161b22] text-zinc-300 border border-[#30363d]">
                        {repo.repoScore}/100
                      </span>
                      {repo.isFlagship && (
                        <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                          🏆 Flagship
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {repo.description ? (
                    <p className="text-xs text-zinc-300 line-clamp-2 mb-3 leading-relaxed">
                      {repo.description}
                    </p>
                  ) : (
                    <p className="text-xs text-red-400/90 italic mb-3 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      Missing description. Add 1 sentence in repo About.
                    </p>
                  )}

                  {/* Badges / Metrics */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 mb-3 font-mono">
                    {repo.language && (
                      <span className="px-2 py-0.5 rounded-md bg-[#21262d] text-orange-300 border border-[#30363d]">
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400" />
                      {repo.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="w-3.5 h-3.5 text-zinc-400" />
                      {repo.forks_count}
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      Updated {updatedDate}
                    </span>
                  </div>

                  {/* Quality Checklist Signals */}
                  <div className="flex flex-wrap gap-2 text-[11px] mb-3">
                    <span className={`px-2 py-0.5 rounded border flex items-center gap-1 ${
                      repo.hasReadme
                        ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                        : 'bg-red-950/40 text-red-300 border-red-500/30'
                    }`}>
                      <FileText className="w-3 h-3" />
                      {repo.hasReadme ? 'README Present' : 'No README'}
                    </span>

                    {repo.homepage ? (
                      <a
                        href={repo.homepage.startsWith('http') ? repo.homepage : `https://${repo.homepage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-0.5 rounded bg-blue-950/40 text-blue-300 border border-blue-500/30 flex items-center gap-1 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Live Demo
                      </a>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-zinc-800/60 text-zinc-500 border border-zinc-700/60">
                        No Demo Link
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="pt-3 border-t border-[#21262d] flex items-center justify-between text-xs">
                  {repo.missingItems.length > 0 ? (
                    <span className="text-[11px] text-amber-400 font-mono">
                      Needs: {repo.missingItems.join(', ')}
                    </span>
                  ) : (
                    <span className="text-[11px] text-emerald-400 font-mono">
                      ✓ Recruiter Ready
                    </span>
                  )}

                  <button
                    onClick={() => onSelectRepoForReadme(repo)}
                    className="text-orange-400 hover:text-orange-300 font-semibold cursor-pointer transition-colors"
                  >
                    Template README →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
