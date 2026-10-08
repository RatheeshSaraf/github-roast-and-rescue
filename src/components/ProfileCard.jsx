import React from 'react';
import { 
  Users, 
  BookMarked, 
  MapPin, 
  Building, 
  Link as LinkIcon, 
  Calendar, 
  ExternalLink,
  Flame,
  Award,
  Sparkles,
  GitFork
} from 'lucide-react';

export default function ProfileCard({ analysis, onGenerateReadme, onShareCard }) {
  const { user, totalRepos, languages, totalStars, nonForkReposCount, forkedReposCount, grade, gradeColor, totalScore } = analysis;

  const joinedDate = new Date(user.created_at).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 sm:p-8 mb-8 shadow-xl relative overflow-hidden">
      {/* Decorative gradient corner */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-orange-500/10 via-red-500/5 to-transparent pointer-events-none rounded-bl-full" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        {/* Left: Avatar + Details */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative">
            <img
              src={user.avatar_url}
              alt={user.login}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-[#30363d] shadow-md object-cover bg-zinc-800"
            />
            <div className={`absolute -bottom-2 -right-2 px-2 py-0.5 rounded-lg border text-xs font-black uppercase tracking-wider ${gradeColor} shadow-md`}>
              Grade {grade}
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {user.name || user.login}
              </h2>
              <a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-mono text-zinc-400 hover:text-orange-400 transition-colors"
              >
                @{user.login}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Bio */}
            {user.bio ? (
              <p className="text-zinc-300 text-sm sm:text-base mt-2 max-w-xl font-normal leading-relaxed">
                "{user.bio}"
              </p>
            ) : (
              <p className="text-red-400/90 text-sm mt-2 italic flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                No public bio set. Recruiters will not know what role you seek!
              </p>
            )}

            {/* Meta details */}
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-zinc-400">
              {user.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                  {user.location}
                </span>
              )}
              {user.company && (
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-zinc-500" />
                  {user.company}
                </span>
              )}
              {user.blog && (
                <a
                  href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-orange-400 hover:underline"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  {user.blog.replace(/^https?:\/\//, '').slice(0, 24)}
                </a>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                Joined {joinedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick actions */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
          <button
            onClick={onGenerateReadme}
            className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span>Generate Gold README</span>
          </button>
          <button
            onClick={onShareCard}
            className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-zinc-200 border border-[#30363d] text-xs sm:text-sm font-semibold transition-all cursor-pointer"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Audit Card</span>
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 mt-6 pt-6 border-t border-[#30363d]/80">
        <div className="p-3 rounded-xl bg-[#0d1117] border border-[#30363d]/60">
          <p className="text-xs text-zinc-400 font-medium">Public Repos</p>
          <p className="text-xl font-bold text-white mt-0.5">{totalRepos}</p>
          <p className="text-[11px] text-zinc-500 mt-0.5 font-mono">
            {nonForkReposCount} original • {forkedReposCount} forks
          </p>
        </div>

        <div className="p-3 rounded-xl bg-[#0d1117] border border-[#30363d]/60">
          <p className="text-xs text-zinc-400 font-medium">Followers</p>
          <p className="text-xl font-bold text-white mt-0.5">{user.followers}</p>
          <p className="text-[11px] text-zinc-500 mt-0.5 font-mono">
            Following {user.following}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-[#0d1117] border border-[#30363d]/60">
          <p className="text-xs text-zinc-400 font-medium">Languages</p>
          <p className="text-xl font-bold text-orange-400 mt-0.5">
            {languages.length > 0 ? languages.length : '0'}
          </p>
          <p className="text-[11px] text-zinc-500 mt-0.5 font-mono truncate" title={languages.join(', ')}>
            {languages.slice(0, 3).join(', ') || 'None detected'}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-[#0d1117] border border-[#30363d]/60">
          <p className="text-xs text-zinc-400 font-medium">Total Stars</p>
          <p className="text-xl font-bold text-amber-400 mt-0.5">⭐ {totalStars}</p>
          <p className="text-[11px] text-zinc-500 mt-0.5 font-mono">
            From public repos
          </p>
        </div>

        <div className="col-span-2 sm:col-span-4 lg:col-span-1 p-3 rounded-xl bg-gradient-to-r from-orange-950/40 to-red-950/40 border border-orange-500/30 flex items-center justify-between lg:flex-col lg:items-start lg:justify-center">
          <div>
            <p className="text-xs text-orange-300 font-semibold">Audit Score</p>
            <p className="text-2xl font-black text-white mt-0.5">{totalScore}<span className="text-sm font-normal text-zinc-400">/100</span></p>
          </div>
          <span className={`px-2.5 py-1 rounded-lg border text-xs font-black uppercase tracking-wider ${gradeColor}`}>
            Grade {grade}
          </span>
        </div>
      </div>
    </div>
  );
}
