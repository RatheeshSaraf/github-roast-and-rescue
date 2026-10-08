import React from 'react';
import { Flame, Heart, Sparkles, ExternalLink } from 'lucide-react';
import GithubIcon from './GithubIcon';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-[#30363d] bg-[#0d1117] py-12 px-4 sm:px-6 lg:px-8 text-xs text-zinc-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center">
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <p className="font-bold text-zinc-200 text-sm">
              GitHub Roast & Rescue
            </p>
            <p className="text-[11px] text-zinc-400">
              Give a messy GitHub profile the honest feedback it deserves.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 font-mono text-zinc-400">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            Hackathon Production Build
          </span>
          <a
            href="https://github.com/ratheeshr01/github-roast-and-rescue"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>Public GitHub Repo</span>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-[#21262d] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-zinc-500">
        <p>
          Powered by GitHub REST API • No personal access tokens or passwords required.
        </p>
        <p>
          Roast the profile, not the person. Built with React 19 & Tailwind CSS.
        </p>
      </div>
    </footer>
  );
}
