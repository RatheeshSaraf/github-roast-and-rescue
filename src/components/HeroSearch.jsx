import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, 
  Sparkles, 
  AlertCircle, 
  RefreshCw, 
  Key, 
  Play, 
  User, 
  BookOpen, 
  Users, 
  Code2, 
  X 
} from 'lucide-react';
import { searchGitHubUsers } from '../services/githubApi';

export default function HeroSearch({ onSearch, onTryDemo, isLoading, error, onOpenSettings, token = '' }) {
  const [username, setUsername] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searchRateLimited, setSearchRateLimited] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const sampleUsers = [
    { label: 'Student Profile', user: 'alex-student', tag: 'Typical Messy', bio: 'Computer Science student building projects' },
    { label: 'Dan Abramov', user: 'gaearon', tag: 'Redux Author', bio: 'Co-author of Redux and Create React App' },
    { label: 'Linus Torvalds', user: 'torvalds', tag: 'Linux Creator', bio: 'Creator of Linux & Git' },
    { label: 'shadcn', user: 'shadcn', tag: 'UI Legend', bio: 'Design systems & open source components' },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Feature 3: Debounce ~350ms GitHub search autocomplete
  useEffect(() => {
    const trimmed = username.trim();

    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      setSearchRateLimited(false);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchRateLimited(false);
    setSearchError(null);

    const timer = setTimeout(async () => {
      try {
        const result = await searchGitHubUsers(trimmed, token);
        setSuggestions(result.items || []);
        setSearchRateLimited(Boolean(result.isRateLimited));
        if (result.error) setSearchError(result.error);
        setIsDropdownOpen(true);
      } catch (err) {
        console.warn('Search autocomplete error:', err.message);
        setSearchError('GitHub search is temporarily unavailable.');
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [username, token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsDropdownOpen(false);
    if (username.trim()) {
      onSearch(username.trim());
    }
  };

  // Feature 1: Clicking suggestion selects username, closes dropdown, does NOT auto-audit
  const handleSelectSuggestion = (login) => {
    setUsername(login);
    setIsDropdownOpen(false);
    setActiveIndex(-1);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Feature 4: Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isDropdownOpen) {
      if (e.key === 'ArrowDown' && (suggestions.length > 0 || username.trim().length === 0)) {
        setIsDropdownOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        e.preventDefault();
        handleSelectSuggestion(suggestions[activeIndex].login);
      }
      // If activeIndex is -1, allows standard form submission to perform the audit
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsDropdownOpen(false);
      setActiveIndex(-1);
    }
  };

  // Highlight matching portion of username
  const renderHighlighted = (text, query) => {
    if (!query || query.trim().length < 2) return text;
    const q = query.trim().toLowerCase();
    const idx = text.toLowerCase().indexOf(q);
    if (idx === -1) return text;

    const before = text.substring(0, idx);
    const match = text.substring(idx, idx + q.length);
    const after = text.substring(idx + q.length);

    return (
      <span>
        {before}
        <strong className="text-orange-400 font-black underline decoration-orange-500/60">{match}</strong>
        {after}
      </span>
    );
  };

  const showDropdown = isDropdownOpen && (
    isSearching || 
    suggestions.length > 0 || 
    searchRateLimited || 
    searchError || 
    (username.trim().length >= 2 && !isSearching) ||
    username.trim().length === 0
  );

  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden text-center px-4">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-gradient-to-tr from-orange-500/15 via-red-500/10 to-amber-500/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Hackathon Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs font-semibold mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          <span>The Recruiter 30-Second Roast & Rescue Audit</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-6 uppercase">
          Find out what a recruiter sees <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-orange-400 via-red-500 to-amber-400 bg-clip-text text-transparent">
            when they open your GitHub.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-zinc-300 font-medium max-w-2xl mx-auto mb-8 leading-relaxed">
          Enter a public GitHub username and get a recruiter-focused audit, evidence-backed roast, and step-by-step rescue plan.
        </p>

        {/* Autocomplete Search Form */}
        <div ref={containerRef} className="max-w-xl mx-auto mb-4 relative text-left">
          <form onSubmit={handleSubmit}>
            <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center shadow-2xl rounded-2xl bg-[#161b22] border-2 border-[#30363d] focus-within:border-orange-500 transition-all p-1.5 gap-2">
              <div className="flex items-center flex-1 pl-3 pr-2 text-zinc-400">
                <span className="font-mono text-zinc-500 text-base sm:text-lg select-none">github.com/</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setIsDropdownOpen(true)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter or search username..."
                  disabled={isLoading}
                  autoComplete="off"
                  role="combobox"
                  aria-expanded={isDropdownOpen}
                  aria-autocomplete="list"
                  aria-controls="autocomplete-dropdown"
                  className="w-full bg-transparent border-none text-white text-base sm:text-lg focus:outline-none placeholder-zinc-500 font-medium py-2 pl-1"
                  autoFocus
                />
                {username && (
                  <button
                    type="button"
                    onClick={() => {
                      setUsername('');
                      setSuggestions([]);
                      setIsDropdownOpen(false);
                      if (inputRef.current) inputRef.current.focus();
                    }}
                    className="p-1 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                    title="Clear input"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                {isSearching && (
                  <RefreshCw className="w-4 h-4 text-orange-400 animate-spin shrink-0 ml-1" />
                )}
              </div>

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

          {/* Autocomplete Dropdown Listbox */}
          {showDropdown && (
            <div
              id="autocomplete-dropdown"
              role="listbox"
              className="absolute left-0 right-0 top-full mt-2 bg-[#161b22] border-2 border-[#30363d] rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-[#21262d] max-h-96 overflow-y-auto animate-in fade-in duration-150"
            >
              {/* State 1: Searching */}
              {isSearching && suggestions.length === 0 && (
                <div className="p-4 text-center text-xs text-zinc-400 flex items-center justify-center gap-2 font-mono">
                  <RefreshCw className="w-4 h-4 animate-spin text-orange-400" />
                  <span>Searching GitHub profiles...</span>
                </div>
              )}

              {/* State 2: Rate limited warning */}
              {searchRateLimited && (
                <div className="p-3 bg-amber-950/40 text-amber-300 text-xs flex items-center justify-between gap-2 border-b border-amber-500/30">
                  <span className="font-mono flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    GitHub search is temporarily rate limited.
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onTryDemo();
                      setIsDropdownOpen(false);
                    }}
                    className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-[11px] font-bold cursor-pointer"
                  >
                    Try Demo Profile
                  </button>
                </div>
              )}

              {/* State 3: Search error */}
              {searchError && !searchRateLimited && suggestions.length === 0 && (
                <div className="p-4 text-center text-xs text-zinc-400 font-mono">
                  <p>{searchError}</p>
                </div>
              )}

              {/* State 4: Suggestions list */}
              {suggestions.length > 0 && (
                <div className="py-1">
                  <div className="px-3 py-1.5 text-[10px] font-mono text-zinc-500 uppercase tracking-wider flex items-center justify-between">
                    <span>Matching Profiles (Click to select)</span>
                    <span className="text-zinc-600">Arrow keys to navigate</span>
                  </div>
                  {suggestions.map((item, idx) => {
                    const isSelected = activeIndex === idx;
                    return (
                      <div
                        key={item.login}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleSelectSuggestion(item.login)}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={`px-3.5 py-2.5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                          isSelected ? 'bg-orange-500/15 text-white' : 'hover:bg-[#21262d] text-zinc-200'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {item.avatar_url ? (
                            <img
                              src={item.avatar_url}
                              alt={item.login}
                              className="w-9 h-9 rounded-xl border border-[#30363d] object-cover bg-zinc-800 shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-xl border border-[#30363d] bg-zinc-800 flex items-center justify-center shrink-0">
                              <User className="w-4 h-4 text-zinc-400" />
                            </div>
                          )}

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-sm font-mono truncate text-white">
                                @{renderHighlighted(item.login, username)}
                              </span>
                              {item.name && item.name !== item.login && (
                                <span className="text-xs text-zinc-400 truncate">
                                  ({item.name})
                                </span>
                              )}
                              {item.isSample && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                                  Verified Sample
                                </span>
                              )}
                            </div>

                            {item.bio && (
                              <p className="text-xs text-zinc-400 truncate mt-0.5 max-w-sm">
                                {item.bio}
                              </p>
                            )}

                            {/* Metadata telemetry tags if present */}
                            {(item.public_repos > 0 || item.followers > 0 || item.primaryLanguage) && (
                              <div className="flex items-center gap-2.5 text-[10px] text-zinc-500 font-mono mt-1">
                                {item.public_repos > 0 && (
                                  <span className="flex items-center gap-1">
                                    <BookOpen className="w-3 h-3 text-zinc-500" />
                                    {item.public_repos} repos
                                  </span>
                                )}
                                {item.followers > 0 && (
                                  <span className="flex items-center gap-1">
                                    <Users className="w-3 h-3 text-zinc-500" />
                                    {item.followers} followers
                                  </span>
                                )}
                                {item.primaryLanguage && (
                                  <span className="flex items-center gap-1 text-orange-400">
                                    <Code2 className="w-3 h-3" />
                                    {item.primaryLanguage}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <span className="text-[11px] font-mono text-zinc-500 shrink-0">
                          Select ↵
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* State 5: No results found */}
              {!isSearching && suggestions.length === 0 && username.trim().length >= 2 && (
                <div className="p-4 text-center text-xs text-zinc-400 font-mono">
                  <p>No GitHub profiles found for "{username}".</p>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    Check spelling or select one of the curated test profiles below.
                  </p>
                </div>
              )}

              {/* State 6: Empty input -> Show Quick Curated Profiles */}
              {username.trim().length < 2 && (
                <div className="p-3">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2">
                    Quick Curated Profiles (1-Click Select)
                  </div>
                  <div className="space-y-1">
                    {sampleUsers.map((item) => (
                      <div
                        key={item.user}
                        onClick={() => handleSelectSuggestion(item.user)}
                        className="px-3 py-2 rounded-xl hover:bg-[#21262d] flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white font-mono">@{item.user}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-orange-400 border border-zinc-700">
                              {item.tag}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-0.5">{item.bio}</p>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500">Select</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Priority 11: Prominent Try Demo Profile Button for Judges */}
        <div className="flex items-center justify-center gap-3 max-w-xl mx-auto mb-6">
          <button
            type="button"
            onClick={onTryDemo}
            disabled={isLoading}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#21262d] hover:bg-[#30363d] border-2 border-amber-500/40 text-amber-300 hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:border-amber-400 group"
          >
            <Play className="w-3.5 h-3.5 fill-amber-400 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>TRY DEMO PROFILE</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 border border-amber-500/30 font-mono">
              ⚡ 1-Click Judge Demo
            </span>
          </button>
        </div>

        {/* Error message box */}
        {error && (
          <div className="max-w-xl mx-auto mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/50 text-red-200 text-sm flex flex-col sm:flex-row items-start justify-between gap-3 text-left shadow-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{error}</p>
                <p className="text-xs text-red-300/80 mt-1">
                  Tip: Check the username, click <button onClick={onTryDemo} className="underline font-bold text-amber-300 cursor-pointer">Try Demo Profile</button>, or add a token in Settings.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                type="button"
                onClick={onTryDemo}
                className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold cursor-pointer"
              >
                Load Demo
              </button>
              {onOpenSettings && (
                <button
                  type="button"
                  onClick={onOpenSettings}
                  className="px-2.5 py-1 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Key className="w-3 h-3" />
                  <span>Settings</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Quick Sample Profiles Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto mb-6 text-xs text-zinc-400">
          <span className="font-medium text-zinc-500">Curated Test Profiles:</span>
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
